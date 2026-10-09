import type { AudioPreferenceIntent, LiveAudioGate } from '../audio/contracts';
import { INITIAL_AUDIO_PREFERENCES } from './contracts';
import type {
  AudioPreferencesPatch, CommitResult, CommittedSnapshot, InstallationAudioPreferences,
  PreferenceStatus, ProfileId, ProfilePreferences, StateCommand, StateReasonCode, UpdateReadiness,
} from './contracts';

type PreferenceCommand = Extract<StateCommand, { kind: 'SetAudioPreferences' | 'SetProfilePreferences' }>;
export type PreferenceControllerOptions = Readonly<{
  initialCommitted: CommittedSnapshot | null;
  initialLoadStatus?: 'loading' | 'read-failed';
  enqueue(command: PreferenceCommand): Promise<CommitResult>;
  applyLivePreferences: LiveAudioGate['applyLiveIntent'];
  broadcastSilence(): void;
  /** Facade allocation, once outside the reducer. Injection also enables
   * deterministic fixtures; default uses the platform UUID allocator. */
  allocateActionId?: () => string;
}>;
export type PreferenceController = Readonly<{
  getStatus(): PreferenceStatus;
  subscribe(listener: () => void): () => void;
  setAudioPreferences(intent: AudioPreferenceIntent): void;
  setProfilePreferences(profileId: ProfileId, patch: Readonly<Partial<ProfilePreferences>>): void;
  acceptCommitted(snapshot: CommittedSnapshot, acknowledgedGeneration?: number): void;
  receiveSilence(): void;
  reportReadFailure(): void;
  retry(): void;
  /** Explicit acknowledgement of lost old-scope choices, not a storage retry.
   * Does not clear read/write/gate failures or pending writes. */
  acknowledgeDiscardedChanges(): void;
  flush(): Promise<UpdateReadiness>;
}>;

type AudioLeaf = 'soundEnabled' | 'silenceAll' | 'music.muted' | 'music.volume' | 'effects.muted' | 'effects.volume';
type Leaf = { scope: 'audio'; leaf: AudioLeaf; generation: number }
  | { scope: 'profile'; profileId: ProfileId; leaf: keyof ProfilePreferences; generation: number };
type LeafValue = boolean | number | ProfilePreferences['motion'];
type Batch = { epoch: string; generation: number; command: PreferenceCommand;
  leaves: readonly { key: string; leaf: Leaf; value: LeafValue }[] };
const audioLeaves: readonly AudioLeaf[] = ['soundEnabled', 'silenceAll', 'music.muted', 'music.volume', 'effects.muted', 'effects.volume'];
const profileLeaves = ['instructionReadAloud', 'motion'] as const;
const audioCopy = (audio: InstallationAudioPreferences): InstallationAudioPreferences => Object.freeze({
  soundEnabled: audio.soundEnabled, silenceAll: audio.silenceAll,
  music: Object.freeze({ ...audio.music }), effects: Object.freeze({ ...audio.effects }),
});
const profileCopy = (profile: ProfilePreferences): ProfilePreferences => Object.freeze({ ...profile });
const leafKey = (leaf: Leaf) => JSON.stringify(leaf.scope === 'audio' ? ['audio', leaf.leaf] : ['profile', leaf.profileId, leaf.leaf]);
function audioValue(audio: InstallationAudioPreferences, leaf: AudioLeaf): boolean | number {
  switch (leaf) {
    case 'soundEnabled': case 'silenceAll': return audio[leaf];
    case 'music.muted': return audio.music.muted;
    case 'music.volume': return audio.music.volume;
    case 'effects.muted': return audio.effects.muted;
    case 'effects.volume': return audio.effects.volume;
  }
}
function withAudioLeaf(audio: InstallationAudioPreferences, leaf: AudioLeaf, value: boolean | number): InstallationAudioPreferences {
  switch (leaf) {
    case 'soundEnabled': case 'silenceAll': return { ...audio, [leaf]: value as boolean };
    case 'music.muted': return { ...audio, music: { ...audio.music, muted: value as boolean } };
    case 'music.volume': return { ...audio, music: { ...audio.music, volume: value as number } };
    case 'effects.muted': return { ...audio, effects: { ...audio.effects, muted: value as boolean } };
    case 'effects.volume': return { ...audio, effects: { ...audio.effects, volume: value as number } };
  }
}
function validateIntent(intent: AudioPreferenceIntent): void {
  const keys = Object.keys(intent);
  switch (intent.kind) {
    case 'enable': case 'exit-silence': case 'silence-all':
      if (keys.length !== 1) throw new TypeError('Invalid audio intent.');
      return;
    case 'channel-mute': case 'channel-volume':
      if (keys.length !== 3 || (intent.channel !== 'music' && intent.channel !== 'effects')) break;
      if (intent.kind === 'channel-mute' && typeof intent.muted === 'boolean') return;
      if (intent.kind === 'channel-volume' && Number.isFinite(intent.volume) && intent.volume >= 0 && intent.volume <= 1) return;
      break;
  }
  throw new TypeError('Invalid audio intent.');
}

/** One preference queue over the sole facade writer. There is no database,
 * playback, profile selection, educational action or durable side store here. */
export function createPreferenceController(options: PreferenceControllerOptions): PreferenceController {
  let committed = options.initialCommitted;
  let loadStatus: PreferenceStatus['loadStatus'] = options.initialLoadStatus ?? (committed ? 'loaded' : 'loading');
  let requestedAudio = audioCopy(committed?.save.installation.audio ?? INITIAL_AUDIO_PREFERENCES);
  let requestedProfiles: Record<ProfileId, ProfilePreferences> = Object.create(null);
  // Ordinary loading is a temporary playback guard in PreferenceStatus, not
  // user Silence all. WP02 applies loadStatus before playback. Failed reads
  // retain the explicit recovery latch, as do saved/local/received silence.
  let silenceLatch = requestedAudio.silenceAll || loadStatus === 'read-failed';
  let generation = 0;
  let savedGeneration = 0;
  let acknowledgedHighWater = 0;
  let writeError: StateReasonCode | undefined;
  let scopeError: StateReasonCode | undefined;
  let gateError = false;
  let inFlight: Batch | null = null;
  let running: Promise<void> | null = null;
  let scheduled = false;
  const dirty = new Map<string, Leaf>();
  const retiredEpochs = new Set<string>();
  const listeners = new Set<() => void>();
  const allocateActionId = options.allocateActionId ?? (() => crypto.randomUUID());
  let status: PreferenceStatus;

  function nextGeneration(): number {
    if (!Number.isSafeInteger(generation + 1)) throw new RangeError('Preference generation capacity exceeded.');
    return ++generation;
  }
  function publish(): void {
    let earliest = generation + 1;
    for (const leaf of dirty.values()) earliest = Math.min(earliest, leaf.generation);
    if (!scopeError && !writeError && !gateError && loadStatus === 'loaded') {
      savedGeneration = Math.max(savedGeneration, Math.min(acknowledgedHighWater, earliest - 1));
    }
    status = Object.freeze({ requestedAudio, requestedProfileById: Object.freeze({ ...requestedProfiles }),
      loadStatus, generation, savedGeneration, pending: scheduled || inFlight !== null || dirty.size > 0 || loadStatus === 'loading',
      failed: loadStatus === 'read-failed' || Boolean(writeError || scopeError || gateError),
      ...(writeError || scopeError || gateError || loadStatus === 'read-failed'
        ? { errorCode: writeError ?? scopeError ?? (gateError ? 'transition-failed' : 'storage-unreadable') } : {}),
    });
    for (const listener of listeners) { try { listener(); } catch { /* A UI subscriber cannot abort persistence. */ } }
  }
  function live(intent: AudioPreferenceIntent): boolean {
    try { options.applyLivePreferences(intent); return true; }
    catch {
      gateError = true; silenceLatch = true;
      requestedAudio = audioCopy({ ...requestedAudio, silenceAll: true });
      try { options.applyLivePreferences({ kind: 'silence-all' }); } catch { /* Expose failure; never activate. */ }
      publish(); return false;
    }
  }
  function valueAt(snapshot: CommittedSnapshot, leaf: Leaf): LeafValue | undefined {
    return leaf.scope === 'audio' ? audioValue(snapshot.save.installation.audio, leaf.leaf)
      : snapshot.save.profiles[leaf.profileId]?.preferences[leaf.leaf];
  }
  function requestedValue(leaf: Leaf): LeafValue {
    return leaf.scope === 'audio' ? audioValue(requestedAudio, leaf.leaf) : requestedProfiles[leaf.profileId][leaf.leaf];
  }
  function mergeClean(): void {
    if (!committed) return;
    let audio = committed.save.installation.audio;
    for (const leaf of dirty.values()) if (leaf.scope === 'audio') audio = withAudioLeaf(audio, leaf.leaf, audioValue(requestedAudio, leaf.leaf));
    // Refresh/import can tighten silence, but never release an existing latch.
    if (audio.silenceAll && !dirty.has(leafKey({ scope: 'audio', leaf: 'silenceAll', generation: 0 }))) {
      if (!silenceLatch) live({ kind: 'silence-all' });
      silenceLatch = true;
    }
    requestedAudio = audioCopy({ ...audio, silenceAll: silenceLatch || audio.silenceAll });
    const profiles: Record<ProfileId, ProfilePreferences> = Object.create(null);
    for (const [id, profile] of Object.entries(committed.save.profiles)) {
      let prefs = profile.preferences;
      for (const leaf of dirty.values()) if (leaf.scope === 'profile' && leaf.profileId === id) prefs = { ...prefs, [leaf.leaf]: requestedProfiles[id][leaf.leaf] };
      profiles[id] = profileCopy(prefs);
    }
    requestedProfiles = profiles;
  }
  function acknowledge(batch: Batch, snapshot: CommittedSnapshot): void {
    if (batch.epoch !== committed?.token.epoch || batch.epoch !== snapshot.token.epoch) return;
    for (const sent of batch.leaves) {
      const current = dirty.get(sent.key);
      if (current && current.generation <= sent.leaf.generation && valueAt(snapshot, sent.leaf) === sent.value) dirty.delete(sent.key);
    }
    if (batch.leaves.every(sent => valueAt(snapshot, sent.leaf) === sent.value)) acknowledgedHighWater = Math.max(acknowledgedHighWater, batch.generation);
  }
  function acceptCommitted(snapshot: CommittedSnapshot, acknowledgedGeneration?: number): void {
    if (retiredEpochs.has(snapshot.token.epoch)) return;
    const replacement = committed !== null && snapshot.token.epoch !== committed.token.epoch;
    if (replacement) {
      retiredEpochs.add(committed!.token.epoch);
      if (dirty.size > 0 || inFlight) scopeError = 'invalid-command';
      dirty.clear(); writeError = undefined;
      // Even an imported enabled save cannot activate this visit.
      silenceLatch = true;
      live({ kind: 'silence-all' });
      committed = snapshot;
    } else if (!committed || snapshot.token.revision >= committed.token.revision) committed = snapshot;
    else {
      // A known acknowledgement may retire old leaves without rolling back a
      // newer committed snapshot received from another action/tab.
      if (inFlight && acknowledgedGeneration === inFlight.generation) acknowledge(inFlight, snapshot);
      mergeClean(); publish(); return;
    }
    loadStatus = 'loaded';
    for (const [key, leaf] of dirty) if (leaf.scope === 'profile' && !committed.save.profiles[leaf.profileId]) {
      dirty.delete(key); scopeError = 'profile-missing';
    }
    if (!replacement && inFlight && acknowledgedGeneration === inFlight.generation) acknowledge(inFlight, snapshot);
    mergeClean(); schedule(); publish();
  }
  function pruneSatisfied(): void {
    if (!committed || inFlight) return;
    for (const [key, leaf] of dirty) if (valueAt(committed, leaf) === requestedValue(leaf)) {
      dirty.delete(key); acknowledgedHighWater = Math.max(acknowledgedHighWater, leaf.generation);
    }
    mergeClean();
  }
  function makeBatch(): Batch | null {
    if (!committed || dirty.size === 0) return null;
    const all = [...dirty.entries()];
    const first = all.find(([, leaf]) => leaf.scope === 'audio' && leaf.leaf === 'silenceAll')
      ?? all.reduce((a, b) => a[1].generation <= b[1].generation ? a : b);
    const selected = all.filter(([, leaf]) => leaf.scope === first[1].scope
      && (leaf.scope === 'audio' || (first[1].scope === 'profile' && leaf.profileId === first[1].profileId)));
    const leaves = selected.map(([key, leaf]) => ({ key, leaf: { ...leaf }, value: requestedValue(leaf) }));
    const envelope = { actionId: allocateActionId(), expected: { ...committed.token } };
    let command: PreferenceCommand;
    if (first[1].scope === 'audio') {
      let patch: AudioPreferencesPatch = {};
      for (const sent of leaves) if (sent.leaf.scope === 'audio') {
        const leaf = sent.leaf.leaf;
        if (leaf === 'soundEnabled' || leaf === 'silenceAll') patch = { ...patch, [leaf]: sent.value };
        else {
          const channel = leaf.startsWith('music.') ? 'music' : 'effects';
          const property = leaf.endsWith('.volume') ? 'volume' : 'muted';
          patch = { ...patch, [channel]: { ...patch[channel], [property]: sent.value } };
        }
      }
      command = { ...envelope, kind: 'SetAudioPreferences', payload: { patch } };
    } else {
      const patch: Partial<ProfilePreferences> = Object.fromEntries(leaves.map(sent => [sent.leaf.leaf, sent.value]));
      command = { ...envelope, profileId: first[1].profileId, kind: 'SetProfilePreferences', payload: { patch } };
    }
    return { epoch: committed.token.epoch, generation, command, leaves };
  }
  async function drain(): Promise<void> {
    let conflictRetries = 0;
    while (committed && loadStatus === 'loaded' && !writeError && !gateError) {
      pruneSatisfied();
      const batch = makeBatch();
      if (!batch) break;
      inFlight = batch; publish();
      let result: CommitResult;
      try { result = await options.enqueue(batch.command); }
      catch { result = { status: 'save-failed', retryable: true, reason: { code: 'storage-write-failed', message: "Changed for this visit; couldn't save. Retry." } }; }
      if (batch.epoch !== committed.token.epoch) { inFlight = null; publish(); continue; }
      switch (result.status) {
        case 'committed': case 'already-applied':
          acceptCommitted(result.snapshot, batch.generation); conflictRetries = 0; break;
        case 'conflict':
          acceptCommitted(result.snapshot);
          if (++conflictRetries > 1 && batch.epoch === committed.token.epoch) writeError = 'storage-write-failed';
          break;
        case 'save-failed':
          if (result.snapshot) acceptCommitted(result.snapshot);
          if (batch.epoch === committed.token.epoch) writeError = result.reason.code;
          break;
        case 'invalid': case 'unsupported': writeError = result.reason.code; break;
      }
      inFlight = null; mergeClean(); publish();
    }
  }
  function schedule(): void {
    if (scheduled || running || !committed || loadStatus !== 'loaded' || writeError || gateError || dirty.size === 0) return;
    scheduled = true;
    queueMicrotask(() => {
      // Install ownership before drain's synchronous work can publish to a
      // reentrant subscriber. Keep scheduled true until that owned task starts.
      running = Promise.resolve().then(() => {
        scheduled = false;
        return drain();
      }).catch(() => { writeError = 'transition-failed'; inFlight = null; }).finally(() => {
        running = null; schedule(); publish();
      });
    });
  }
  function markAudio(leaves: readonly AudioLeaf[]): void {
    const edited = nextGeneration();
    for (const leaf of leaves) { const entry: Leaf = { scope: 'audio', leaf, generation: edited }; dirty.set(leafKey(entry), entry); }
    schedule(); publish();
  }
  function setAudioPreferences(intent: AudioPreferenceIntent): void {
    validateIntent(intent);
    // No exit action can create first-use consent or defeat unreadable storage.
    if (intent.kind === 'exit-silence' && (!requestedAudio.soundEnabled || loadStatus !== 'loaded')) return;
    if (intent.kind === 'enable' && loadStatus !== 'loaded') return;
    // Enable grants first-use consent. An existing Silence all requires Resume.
    if (intent.kind === 'enable' && requestedAudio.soundEnabled && silenceLatch) return;
    // A successful slider does not prove a previously failed stop has recovered.
    if (gateError && intent.kind !== 'silence-all') {
      if (!live({ kind: 'silence-all' })) return;
      gateError = false; markAudio(['silenceAll']);
    }
    if (!live(intent)) {
      if (intent.kind === 'silence-all') {
        markAudio(['silenceAll']);
        try { options.broadcastSilence(); } catch { /* Other tabs may still stop even if the local adapter failed. */ }
      }
      return;
    }
    gateError = false;
    switch (intent.kind) {
      case 'enable':
        requestedAudio = audioCopy({ ...requestedAudio, soundEnabled: true });
        markAudio(['soundEnabled']); break;
      case 'exit-silence':
        silenceLatch = false;
        requestedAudio = audioCopy({ ...requestedAudio, silenceAll: false });
        markAudio(['silenceAll']); break;
      case 'silence-all':
        silenceLatch = true;
        requestedAudio = audioCopy({ ...requestedAudio, silenceAll: true });
        markAudio(['silenceAll']);
        try { options.broadcastSilence(); } catch { /* Local stop/save must survive unavailable broadcast. */ }
        break;
      case 'channel-mute':
        requestedAudio = audioCopy({ ...requestedAudio, [intent.channel]: { ...requestedAudio[intent.channel], muted: intent.muted } });
        markAudio([`${intent.channel}.muted`]); break;
      case 'channel-volume':
        requestedAudio = audioCopy({ ...requestedAudio, [intent.channel]: { ...requestedAudio[intent.channel], volume: intent.volume } });
        markAudio([`${intent.channel}.volume`]); break;
    }
  }
  function setProfilePreferences(profileId: ProfileId, patch: Readonly<Partial<ProfilePreferences>>): void {
    if (!Object.hasOwn(requestedProfiles, profileId)) throw new RangeError('Profile is unavailable.');
    const keys = Object.keys(patch);
    if (keys.some(key => !profileLeaves.includes(key as keyof ProfilePreferences))
      || ('instructionReadAloud' in patch && typeof patch.instructionReadAloud !== 'boolean')
      || ('motion' in patch && patch.motion !== 'system' && patch.motion !== 'reduced')) throw new TypeError('Invalid profile preference patch.');
    if (!keys.length) return;
    const edited = nextGeneration();
    requestedProfiles = { ...requestedProfiles, [profileId]: profileCopy({ ...requestedProfiles[profileId], ...patch }) };
    for (const leaf of keys as (keyof ProfilePreferences)[]) {
      const entry: Leaf = { scope: 'profile', profileId, leaf, generation: edited }; dirty.set(leafKey(entry), entry);
    }
    schedule(); publish();
  }
  function receiveSilence(): void {
    const stopped = live({ kind: 'silence-all' });
    if (stopped) gateError = false;
    silenceLatch = true; requestedAudio = audioCopy({ ...requestedAudio, silenceAll: true });
    markAudio(['silenceAll']); // Persist through the same writer, never rebroadcast.
  }
  function reportReadFailure(): void {
    loadStatus = 'read-failed'; silenceLatch = true;
    live({ kind: 'silence-all' });
    requestedAudio = audioCopy({ ...requestedAudio, silenceAll: true }); publish();
  }
  function retry(): void {
    if (gateError && live({ kind: 'silence-all' })) { gateError = false; markAudio(['silenceAll']); }
    writeError = undefined; schedule(); publish();
  }
  function readiness(): UpdateReadiness {
    return { ready: loadStatus === 'loaded' && !status.pending && !status.failed,
      pendingCommands: 0, pendingPreferences: status.pending, failedCommand: false,
      failedPreferences: status.failed, unsavedTransition: false };
  }
  async function flush(): Promise<UpdateReadiness> {
    schedule();
    // Include edits scheduled by subscribers and by an in-flight completion.
    do { await Promise.resolve(); if (running) await running; } while (scheduled || running);
    publish(); return readiness();
  }

  if (committed) mergeClean();
  if (silenceLatch) { requestedAudio = audioCopy({ ...requestedAudio, silenceAll: true }); live({ kind: 'silence-all' }); }
  publish();
  return Object.freeze({ getStatus: () => status, subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    setAudioPreferences, setProfilePreferences, acceptCommitted, receiveSilence, reportReadFailure, retry,
    acknowledgeDiscardedChanges: () => { scopeError = undefined; publish(); }, flush });
}
