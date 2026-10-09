import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { AudioPreferenceIntent } from '../../src/audio/contracts';
import { INITIAL_AUDIO_PREFERENCES, INITIAL_PROFILE_PREFERENCES } from '../../src/state/contracts';
import type { CommitResult, CommittedSnapshot, InstallationAudioPreferences, ProfileSave, StateCommand } from '../../src/state/contracts';
import { createPreferenceController } from '../../src/state/preferences';
import type { PreferenceControllerOptions } from '../../src/state/preferences';

type PreferenceCommand = Extract<StateCommand, { kind: 'SetAudioPreferences' | 'SetProfilePreferences' }>;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
function profile(id: string): ProfileSave {
  return { identity: { profileId: id, nickname: id, avatarId: 'pip' }, preferences: INITIAL_PROFILE_PREFERENCES,
    learning: { evidence: {}, canonicalHistory: [] }, encounters: {}, world: { completedQuestIds: [], completedStoryBindingIds: [] },
    creative: { scarfColourId: 'teal', scarfPatternId: null, flowerColourId: 'coral', planterRimId: null, facadeTrimId: null,
      placements: { 'plot-1': null, 'plot-2': null, 'plot-3': null, 'plot-4': null, 'plot-5': null, 'plot-6': null } },
    rewards: { lifetimePoints: 0, tracksByCanonical: {}, questReceipts: [], entitlementIds: [] },
    personalRecords: { best: null, medals: { gold: 0, silver: 0, bronze: 0 } } };
}
function snapshot(audio: InstallationAudioPreferences = INITIAL_AUDIO_PREFERENCES, revision = 0, epoch = 'epoch-a'): CommittedSnapshot {
  return { token: { epoch, revision }, save: { schemaVersion: 1, contentVersion: 'fixture-m1', rewardPolicyVersion: 'fixture-1',
    installation: { timezone: 'Europe/London', audio: clone(audio) }, profiles: { alpha: profile('alpha'), beta: profile('beta') },
    competition: { timezone: 'Europe/London', latestOpenedWeek: null, currentScores: {}, currentSlots: {}, archives: [], policyVersion: 'fixture-1' } } };
}
const enabled = { ...INITIAL_AUDIO_PREFERENCES, soundEnabled: true };
const noChanges = { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0, newReceiptKeys: [], newEntitlementIds: [] }, unlockedIds: [], restorationIds: [], closedWeekIds: [] } as const;
/** Tiny fixture writer for these two commands only. No production repository,
 * transition, playback or educational action is substituted by this harness. */
function apply(base: CommittedSnapshot, command: PreferenceCommand): CommittedSnapshot {
  let save = base.save;
  if (command.kind === 'SetAudioPreferences') {
    const previous = save.installation.audio;
    const patch = command.payload.patch;
    const audio = { ...previous, ...patch, music: { ...previous.music, ...patch.music }, effects: { ...previous.effects, ...patch.effects } };
    save = { ...save, installation: { ...save.installation, audio } };
  } else {
    const prior = save.profiles[command.profileId];
    if (!prior) throw new Error('Deleted fixture profile.');
    save = { ...save, profiles: { ...save.profiles, [command.profileId]: { ...prior, preferences: { ...prior.preferences, ...command.payload.patch } } } };
  }
  return { token: { ...base.token, revision: base.token.revision + 1 }, save };
}
async function tick(): Promise<void> { for (let i = 0; i < 12; i++) await Promise.resolve(); }
function harness(initial: CommittedSnapshot | null = snapshot(), initialLoadStatus?: 'loading' | 'read-failed') {
  const events: string[] = [];
  const gates: AudioPreferenceIntent[] = [];
  const calls: { command: PreferenceCommand; resolve(result: CommitResult): void; reject(error: unknown): void }[] = [];
  let current = initial ?? snapshot();
  let allocated = 0;
  let gateThrows: boolean | 'silence-all' = false;
  let broadcastThrows = false;
  const options: PreferenceControllerOptions = {
    initialCommitted: initial, initialLoadStatus,
    allocateActionId: () => `00000000-0000-4000-8000-${String(++allocated).padStart(12, '0')}`,
    applyLivePreferences(intent) { events.push(`gate:${intent.kind}`); gates.push(clone(intent)); if (gateThrows === true || gateThrows === intent.kind) throw new Error('fixture gate failure'); },
    broadcastSilence() { events.push('broadcast:silence'); if (broadcastThrows) throw new Error('fixture broadcast failure'); },
    enqueue(command) { events.push(`enqueue:${command.kind}`); return new Promise((resolve, reject) => { calls.push({ command, resolve, reject }); }); },
  };
  const controller = createPreferenceController(options);
  return { controller, events, gates, calls, get current() { return current; },
    setGateThrows(value: boolean | 'silence-all') { gateThrows = value; }, setBroadcastThrows(value: boolean) { broadcastThrows = value; },
    commit(index: number, basis = current) { current = apply(basis, calls[index].command); calls[index].resolve({ status: 'committed', snapshot: current, changes: noChanges }); return current; },
    conflict(index: number, fresh: CommittedSnapshot) { current = fresh; calls[index].resolve({ status: 'conflict', snapshot: fresh }); },
    fail(index: number) { calls[index].resolve({ status: 'save-failed', retryable: true, reason: { code: 'storage-write-failed', message: "Changed for this visit; couldn't save. Retry." } }); },
  };
}

describe('WP04-05A remembered preferences and immediate silence', () => {
  it('review P1: owns the drain before reentrant publication and waits for the late writer failure', async () => {
    const h = harness(snapshot(enabled));
    let notifications = 0;
    h.controller.subscribe(() => {
      if (++notifications === 2) h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'effects', volume: .8 });
    });
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .7 });
    await tick();
    const initialEnqueues = h.calls.length;
    const revision1 = h.commit(0);
    // Retain the review's complete four-enqueue counterexample if overlapping
    // drains recur, then assert it is forbidden. The fixed path has one writer.
    if (initialEnqueues === 2) h.conflict(1, revision1);
    await tick();
    const afterFirstResults = h.calls.length;
    const lastWriter = initialEnqueues === 2 ? 3 : 1;
    if (initialEnqueues === 2) { h.commit(2); await tick(); }
    let settled = false;
    const flush = h.controller.flush().then(result => { settled = true; return result; });
    await tick();
    const settledBeforeFailure = settled;
    h.calls[lastWriter].resolve({ status: 'save-failed', retryable: true, snapshot: h.current,
      reason: { code: 'storage-write-failed', message: 'Late fixture writer failure.' } });
    const result = await flush;
    const afterFailure = await h.controller.flush();
    expect({ initialEnqueues, afterFirstResults, settledBeforeFailure, ready: result.ready })
      .toEqual({ initialEnqueues: 1, afterFirstResults: 2, settledBeforeFailure: false, ready: false });
    expect(afterFailure).toMatchObject({ failedPreferences: true, ready: false });
    expect(h.calls[lastWriter].command.expected).toEqual(revision1.token);
    h.controller.retry(); await tick(); h.commit(h.calls.length - 1);
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.current.save.installation.audio).toMatchObject({ music: { volume: .7 }, effects: { volume: .8 } });
  });
  it('review P2: ordinary loading restores clean defaults and dedicated Enable completes unsilenced', async () => {
    const h = harness(null);
    h.controller.acceptCommitted(snapshot());
    const loaded = clone(h.controller.getStatus().requestedAudio);
    h.controller.setAudioPreferences({ kind: 'enable' });
    await tick(); h.commit(0);
    const readiness = await h.controller.flush();
    expect({ loaded, requested: h.controller.getStatus().requestedAudio, saved: h.current.save.installation.audio, ready: readiness.ready })
      .toEqual({ loaded: INITIAL_AUDIO_PREFERENCES, requested: enabled, saved: enabled, ready: true });
  });
  it('loads returning consent without inventing silence or issuing activation/gate/save commands', async () => {
    const h = harness(null);
    h.controller.acceptCommitted(snapshot(enabled));
    expect(h.controller.getStatus()).toMatchObject({ loadStatus: 'loaded', requestedAudio: enabled, generation: 0, savedGeneration: 0 });
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.gates).toEqual([]); expect(h.calls).toEqual([]);
  });
  it.each(['saved', 'local', 'received', 'read-failed'] as const)('ordinary load completion and Enable preserve %s silence', async source => {
    const h = harness(null);
    if (source === 'local') h.controller.setAudioPreferences({ kind: 'silence-all' });
    if (source === 'received') h.controller.receiveSilence();
    if (source === 'read-failed') h.controller.reportReadFailure();
    h.controller.acceptCommitted(snapshot({ ...INITIAL_AUDIO_PREFERENCES, silenceAll: source === 'saved' }));
    h.controller.setAudioPreferences({ kind: 'enable' });
    await tick(); h.commit(0); await h.controller.flush();
    expect(h.controller.getStatus().requestedAudio).toMatchObject({ soundEnabled: true, silenceAll: true });
    const beforeExit = h.calls.length;
    h.controller.setAudioPreferences({ kind: 'exit-silence' }); await tick();
    if (h.calls.length > beforeExit) h.commit(beforeExit);
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(false);
  });
  it('serializes reentrant captured-profile edits through conflict, two simultaneous flushes and late failure', async () => {
    const h = harness(snapshot(enabled));
    let notifications = 0;
    h.controller.subscribe(() => {
      if (++notifications === 2) h.controller.setProfilePreferences('beta', { motion: 'reduced', instructionReadAloud: true });
    });
    h.controller.setAudioPreferences({ kind: 'silence-all' }); await tick();
    expect(h.calls).toHaveLength(1);
    h.conflict(0, snapshot(enabled, 3)); await tick();
    expect(h.calls).toHaveLength(2);
    expect(h.calls[1].command).toMatchObject({ kind: 'SetAudioPreferences', expected: { revision: 3 }, payload: { patch: { silenceAll: true } } });
    h.commit(1); await tick();
    expect(h.calls).toHaveLength(3);
    expect(h.calls[2].command).toMatchObject({ kind: 'SetProfilePreferences', profileId: 'beta', expected: { revision: 4 } });
    let settled = 0;
    const flushes = [h.controller.flush().then(result => { settled++; return result; }), h.controller.flush().then(result => { settled++; return result; })];
    await tick(); expect(settled).toBe(0);
    h.fail(2);
    for (const readiness of await Promise.all(flushes)) expect(readiness).toMatchObject({ ready: false, failedPreferences: true });
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(true);
    h.controller.retry(); await tick(); h.commit(3);
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.current.save.profiles.beta.preferences).toEqual({ motion: 'reduced', instructionReadAloud: true });
  });
  it('fresh startup flow: received silence during first Enable publication survives its ack and failed persistence', async () => {
    const h = harness(null);
    let notifications = 0;
    h.controller.subscribe(() => {
      if (++notifications === 3) h.controller.receiveSilence();
    });
    h.controller.acceptCommitted(snapshot()); // notification 1: ordinary loading ends
    h.controller.setAudioPreferences({ kind: 'enable' }); // 2: explicit first consent
    await tick(); // 3: owned first-write publication receives a real silence signal
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0].command.payload.patch).toEqual({ soundEnabled: true });
    expect(h.gates).toEqual([{ kind: 'enable' }, { kind: 'silence-all' }]);
    h.commit(0); await tick();
    expect(h.calls).toHaveLength(2);
    expect(h.controller.getStatus()).toMatchObject({ requestedAudio: { soundEnabled: true, silenceAll: true }, savedGeneration: 1 });
    let settled = false;
    const flush = h.controller.flush().then(result => { settled = true; return result; });
    await tick(); expect(settled).toBe(false);
    h.fail(1); expect((await flush).ready).toBe(false);
    h.controller.retry(); await tick(); h.commit(2);
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.current.save.installation.audio).toMatchObject({ soundEnabled: true, silenceAll: true });
  });
  it('starts with exact quiet defaults and no consent from slider or narration', async () => {
    const h = harness();
    expect(h.controller.getStatus()).toMatchObject({ requestedAudio: INITIAL_AUDIO_PREFERENCES, generation: 0, savedGeneration: 0, pending: false, failed: false, loadStatus: 'loaded' });
    expect(h.controller.getStatus().requestedProfileById.alpha).toEqual(INITIAL_PROFILE_PREFERENCES);
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .6 });
    h.controller.setProfilePreferences('alpha', { instructionReadAloud: true });
    expect(h.controller.getStatus().requestedAudio.soundEnabled).toBe(false);
    expect(h.events[0]).toBe('gate:channel-volume');
    await tick(); h.commit(0); await tick(); h.commit(1);
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.current.save.installation.audio.soundEnabled).toBe(false);
    expect(h.current.save.profiles.alpha.preferences.instructionReadAloud).toBe(true);
    expect(h.current.save.profiles.alpha.rewards.lifetimePoints).toBe(0);
  });
  it('requires Enable for first consent and Resume for persisted silence without changing channel choices', async () => {
    const h = harness();
    h.controller.setAudioPreferences({ kind: 'exit-silence' });
    expect(h.gates).toEqual([]);
    h.controller.setAudioPreferences({ kind: 'enable' });
    expect(h.controller.getStatus().requestedAudio).toMatchObject({ soundEnabled: true, silenceAll: false });
    await tick(); h.commit(0); await h.controller.flush();
    const muted = harness(snapshot({ ...enabled, silenceAll: true, music: { volume: .4, muted: true }, effects: { volume: 0, muted: false } }));
    muted.controller.setAudioPreferences({ kind: 'enable' });
    expect(muted.gates).toEqual([{ kind: 'silence-all' }]);
    muted.controller.setAudioPreferences({ kind: 'exit-silence' });
    expect(muted.controller.getStatus().requestedAudio).toEqual({ soundEnabled: true, silenceAll: false, music: { volume: .4, muted: true }, effects: { volume: 0, muted: false } });
    await tick(); expect(muted.calls[0].command.payload.patch).toEqual({ silenceAll: false });
    muted.commit(0); expect((await muted.controller.flush()).ready).toBe(true);
  });
  it('gates three rapid generations then Silence all before enqueue and only coalesces changed leaves', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .1 });
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .2 });
    h.controller.setAudioPreferences({ kind: 'channel-mute', channel: 'effects', muted: true });
    h.controller.setAudioPreferences({ kind: 'silence-all' });
    expect(h.calls).toHaveLength(0);
    expect(h.events).toEqual(['gate:channel-volume', 'gate:channel-volume', 'gate:channel-mute', 'gate:silence-all', 'broadcast:silence']);
    expect(h.controller.getStatus()).toMatchObject({ generation: 4, savedGeneration: 0, pending: true, requestedAudio: { silenceAll: true } });
    await tick();
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0].command).toMatchObject({ expected: { epoch: 'epoch-a', revision: 0 }, kind: 'SetAudioPreferences', payload: { patch: { music: { volume: .2 }, effects: { muted: true }, silenceAll: true } } });
    h.commit(0); const readiness = await h.controller.flush();
    expect(readiness).toMatchObject({ ready: true, pendingPreferences: false, failedPreferences: false });
    expect(h.controller.getStatus()).toMatchObject({ generation: 4, savedGeneration: 4 });
  });
  it('retains latest fields/latch while a stale in-flight acknowledgement and refresh arrive', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .1 });
    await tick();
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .2 });
    h.controller.setAudioPreferences({ kind: 'channel-mute', channel: 'music', muted: true });
    h.controller.setAudioPreferences({ kind: 'silence-all' });
    const old = h.commit(0); await tick();
    expect(h.controller.getStatus()).toMatchObject({ generation: 4, savedGeneration: 1, requestedAudio: { silenceAll: true, music: { volume: .2, muted: true } } });
    expect(h.calls[1].command.payload.patch).toEqual({ music: { volume: .2, muted: true }, silenceAll: true });
    h.controller.acceptCommitted(snapshot(enabled, 0));
    h.controller.acceptCommitted(old, 1);
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(true);
    h.commit(1); await h.controller.flush();
    h.controller.acceptCommitted(old, 1);
    expect(h.controller.getStatus().requestedAudio).toMatchObject({ silenceAll: true, music: { muted: true, volume: .2 } });
  });
  it('does not roll back newer clean fields when an older known ack arrives', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .4 }); await tick();
    const ack = apply(h.current, h.calls[0].command);
    const newer = snapshot({ ...ack.save.installation.audio, effects: { muted: true, volume: .7 } }, 5);
    h.controller.acceptCommitted(newer);
    h.calls[0].resolve({ status: 'committed', snapshot: ack, changes: noChanges });
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.controller.getStatus().requestedAudio.effects).toEqual({ muted: true, volume: .7 });
    expect(h.controller.getStatus().savedGeneration).toBe(1);
  });
  it('keeps reverted fields dirty until an older conflicting value has settled', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .7 }); await tick();
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .25 });
    h.controller.acceptCommitted(snapshot(enabled));
    h.commit(0); await tick();
    expect(h.calls[1].command.payload.patch).toEqual({ music: { volume: .25 } });
    h.commit(1); await h.controller.flush();
    expect(h.current.save.installation.audio.music.volume).toBe(.25);
  });
  it('retries only current dirty leaves against a conflict token, preserving concurrent clean changes', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .1 }); await tick();
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .3 });
    h.controller.setAudioPreferences({ kind: 'silence-all' });
    const fresh = snapshot({ ...enabled, effects: { muted: true, volume: .9 } }, 8);
    h.conflict(0, fresh); await tick();
    expect(h.calls[1].command).toMatchObject({ expected: fresh.token, payload: { patch: { music: { volume: .3 }, silenceAll: true } } });
    expect(h.calls[1].command.actionId).not.toBe(h.calls[0].command.actionId);
    h.commit(1); expect((await h.controller.flush()).ready).toBe(true);
    expect(h.current.save.installation.audio.effects).toEqual(fresh.save.installation.audio.effects);
  });
  it('bounds repeated conflicts and waits for explicit retry instead of spinning forever', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .4 }); await tick();
    h.conflict(0, snapshot(enabled, 1)); await tick(); h.conflict(1, snapshot(enabled, 2));
    expect((await h.controller.flush()).failedPreferences).toBe(true);
    expect(h.calls).toHaveLength(2);
    h.controller.retry(); await tick(); h.commit(2); expect((await h.controller.flush()).ready).toBe(true);
  });
  it('retains visit-only silence after failed save and retries the newest generation', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'silence-all' }); await tick(); h.fail(0);
    expect(await h.controller.flush()).toMatchObject({ ready: false, failedPreferences: true, pendingPreferences: true });
    expect(h.controller.getStatus()).toMatchObject({ failed: true, savedGeneration: 0, requestedAudio: { silenceAll: true }, errorCode: 'storage-write-failed' });
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'effects', volume: 0 });
    await tick(); expect(h.calls).toHaveLength(1);
    h.controller.retry(); await tick();
    expect(h.calls[1].command.payload.patch).toEqual({ silenceAll: true, effects: { volume: 0 } });
    h.commit(1); expect((await h.controller.flush()).ready).toBe(true);
    expect(h.controller.getStatus()).toMatchObject({ generation: 2, savedGeneration: 2, failed: false });
    expect(createPreferenceController({ initialCommitted: h.current, enqueue: async () => { throw new Error('unexpected save'); }, applyLivePreferences: () => {}, broadcastSilence: () => {} }).getStatus().requestedAudio.silenceAll).toBe(true);
  });
  it('handles rejected enqueue promises without raw exception messages or clearing requests', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'silence-all' }); await tick(); h.calls[0].reject(new Error('<script>raw</script>'));
    expect((await h.controller.flush()).failedPreferences).toBe(true);
    expect(h.controller.getStatus().errorCode).toBe('storage-write-failed');
    expect(JSON.stringify(h.controller.getStatus())).not.toContain('script');
    h.controller.retry(); await tick(); h.commit(1); await h.controller.flush();
  });
  it.each(['invalid', 'unsupported'] as const)('retains requested silence and honest failure on %s', async status => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'silence-all' }); await tick();
    h.calls[0].resolve({ status, reason: { code: status === 'invalid' ? 'invalid-command' : 'unsupported-schema', message: 'Unable to save.' } });
    expect(await h.controller.flush()).toMatchObject({ ready: false, failedPreferences: true });
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(true);
  });
  it('accepts already-applied as acknowledgement without a new celebration', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'channel-mute', channel: 'effects', muted: true }); await tick();
    h.calls[0].resolve({ status: 'already-applied', snapshot: apply(h.current, h.calls[0].command) });
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.controller.getStatus().savedGeneration).toBe(1);
  });
  it('receives immediate silence with no rebroadcast and ignores another tab unmuting the save', async () => {
    const h = harness(snapshot(enabled));
    h.controller.receiveSilence();
    expect(h.events).toEqual(['gate:silence-all']);
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(true);
    await tick(); h.commit(0); await h.controller.flush();
    h.controller.acceptCommitted(snapshot(enabled, 10));
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(true);
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .8 }); await tick(); h.commit(1, snapshot(enabled, 10)); await h.controller.flush();
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(true);
    h.controller.setAudioPreferences({ kind: 'exit-silence' }); await tick();
    // The external save is already unsilenced: explicit live exit can settle
    // from the fresh committed read without a redundant write.
    if (h.calls.length > 2) h.commit(2);
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(false);
  });
  it.each(['enable', 'exit-silence'] as const)('received silence overtakes an in-flight %s and its late acknowledgement', async kind => {
    const h = harness(kind === 'enable' ? snapshot() : snapshot({ ...enabled, silenceAll: true }));
    h.controller.setAudioPreferences({ kind }); await tick();
    h.controller.receiveSilence();
    expect(h.gates.at(-1)).toEqual({ kind: 'silence-all' });
    const late = h.commit(0); await tick();
    h.controller.acceptCommitted(late, 1);
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(true);
    expect(h.calls[1].command.payload.patch).toEqual({ silenceAll: true });
    h.commit(1); expect((await h.controller.flush()).ready).toBe(true);
    expect(h.current.save.installation.audio.silenceAll).toBe(true);
    expect(h.events.filter(event => event === 'broadcast:silence')).toEqual([]);
  });
  it('keeps channel mute and volume independent, including zero, under Silence all', async () => {
    const h = harness(snapshot({ ...enabled, silenceAll: true }));
    h.controller.setAudioPreferences({ kind: 'channel-mute', channel: 'music', muted: true });
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .7 });
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'effects', volume: 0 });
    expect(h.controller.getStatus().requestedAudio).toEqual({ ...enabled, silenceAll: true, music: { muted: true, volume: .7 }, effects: { muted: false, volume: 0 } });
    await tick(); h.commit(0); await h.controller.flush();
    h.controller.setAudioPreferences({ kind: 'exit-silence' }); await tick(); h.commit(1); await h.controller.flush();
    expect(h.current.save.installation.audio).toMatchObject({ silenceAll: false, music: { muted: true, volume: .7 }, effects: { volume: 0, muted: false } });
  });
  it('loads clean profiles but preserves dirty captured profile leaves across refreshes and switches', async () => {
    const h = harness();
    h.controller.setProfilePreferences('alpha', { motion: 'reduced' }); await tick();
    h.controller.setProfilePreferences('beta', { instructionReadAloud: true });
    const fresh = snapshot();
    const updated: CommittedSnapshot = { ...fresh, token: { ...fresh.token, revision: 3 }, save: { ...fresh.save,
      profiles: { ...fresh.save.profiles, alpha: { ...fresh.save.profiles.alpha, preferences: { instructionReadAloud: true, motion: 'system' } } } } };
    h.conflict(0, updated); await tick();
    expect(h.controller.getStatus().requestedProfileById.alpha).toEqual({ motion: 'reduced', instructionReadAloud: true });
    expect(h.calls[1].command).toMatchObject({ profileId: 'alpha', payload: { patch: { motion: 'reduced' } } });
    h.commit(1); await tick();
    expect(h.calls[2].command).toMatchObject({ profileId: 'beta', payload: { patch: { instructionReadAloud: true } } });
    expect(h.controller.getStatus().savedGeneration).toBe(1);
    h.commit(2); await h.controller.flush();
    expect(h.controller.getStatus().savedGeneration).toBe(2);
    expect(h.gates).toEqual([]);
  });
  it('drops old-epoch edits on replacement, latches silence, ignores old completions and reports loss', async () => {
    const h = harness(snapshot(enabled));
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .7 }); await tick();
    h.controller.setProfilePreferences('alpha', { motion: 'reduced' });
    const replacement = snapshot({ ...enabled, music: { muted: false, volume: .1 } }, 0, 'epoch-b');
    h.controller.acceptCommitted(replacement);
    expect(h.controller.getStatus()).toMatchObject({ failed: true, errorCode: 'invalid-command', requestedAudio: { silenceAll: true, music: { volume: .1 } } });
    expect(h.controller.getStatus().requestedProfileById.alpha.motion).toBe('system');
    h.commit(0, snapshot(enabled));
    expect(await h.controller.flush()).toMatchObject({ ready: false, failedPreferences: true, pendingPreferences: false });
    h.controller.acceptCommitted(snapshot(enabled, 100, 'epoch-a'), 1);
    h.controller.retry(); await tick(); expect(h.calls).toHaveLength(1);
    h.controller.acknowledgeDiscardedChanges(); expect((await h.controller.flush()).ready).toBe(true);
    h.controller.setAudioPreferences({ kind: 'exit-silence' }); await h.controller.flush();
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .2 }); await tick();
    expect(h.calls[1].command.expected).toEqual(replacement.token);
    h.commit(1, replacement); await h.controller.flush();
  });
  it('drops a deleted profile scope without replaying its settings into another profile', async () => {
    const h = harness();
    h.controller.setProfilePreferences('alpha', { motion: 'reduced' }); await tick();
    h.controller.setProfilePreferences('beta', { instructionReadAloud: true });
    const base = snapshot(); const deleted = { ...base, token: { epoch: 'epoch-a', revision: 2 }, save: { ...base.save, profiles: { beta: base.save.profiles.beta } } };
    h.controller.acceptCommitted(deleted);
    h.conflict(0, deleted); await tick();
    expect(h.controller.getStatus()).toMatchObject({ failed: true, errorCode: 'profile-missing' });
    expect(h.controller.getStatus().requestedProfileById).not.toHaveProperty('alpha');
    expect(h.calls[1].command).toMatchObject({ profileId: 'beta', payload: { patch: { instructionReadAloud: true } } });
    h.commit(1, deleted); await h.controller.flush();
    h.controller.acknowledgeDiscardedChanges(); expect((await h.controller.flush()).ready).toBe(true);
    expect(() => h.controller.setProfilePreferences('alpha', { motion: 'system' })).toThrow('Profile is unavailable');
  });
  it('stays silent through loading/read failure and reports blocked readiness until a safe fresh read', async () => {
    const h = harness(null);
    expect(h.controller.getStatus()).toMatchObject({ loadStatus: 'loading', pending: true, requestedAudio: { soundEnabled: false, silenceAll: false } });
    h.controller.setAudioPreferences({ kind: 'enable' }); expect(h.gates).toEqual([]);
    h.controller.reportReadFailure();
    expect(await h.controller.flush()).toMatchObject({ ready: false, failedPreferences: true });
    h.controller.retry(); expect(h.controller.getStatus().loadStatus).toBe('read-failed');
    h.controller.acceptCommitted(snapshot(enabled));
    expect(h.controller.getStatus()).toMatchObject({ loadStatus: 'loaded', requestedAudio: { silenceAll: true } });
    h.controller.setAudioPreferences({ kind: 'exit-silence' });
    expect((await h.controller.flush()).ready).toBe(true);
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(false);
    const unreadable = harness(null, 'read-failed');
    expect(unreadable.controller.getStatus()).toMatchObject({ loadStatus: 'read-failed', failed: true, errorCode: 'storage-unreadable' });
  });
  it('honors explicit read failure even when a last-committed snapshot is available for recovery', async () => {
    const h = harness(snapshot(enabled, 4), 'read-failed');
    expect(h.gates).toEqual([{ kind: 'silence-all' }]);
    expect(h.controller.getStatus()).toMatchObject({ loadStatus: 'read-failed', failed: true, requestedAudio: { soundEnabled: true, silenceAll: true } });
    expect((await h.controller.flush()).ready).toBe(false);
    h.controller.acceptCommitted(snapshot(enabled, 3));
    expect(h.controller.getStatus().loadStatus).toBe('read-failed');
    h.controller.acceptCommitted(snapshot(enabled, 4));
    expect(h.controller.getStatus().loadStatus).toBe('loaded');
    expect(h.controller.getStatus().requestedAudio.silenceAll).toBe(true);
    h.controller.setAudioPreferences({ kind: 'exit-silence' });
    expect((await h.controller.flush()).ready).toBe(true);
  });
  it('survives gate/broadcast failures safely and never activates on a failed gate', async () => {
    const h = harness(); h.setGateThrows(true);
    h.controller.setAudioPreferences({ kind: 'enable' });
    expect(h.controller.getStatus()).toMatchObject({ failed: true, errorCode: 'transition-failed', requestedAudio: { soundEnabled: false, silenceAll: true } });
    await tick(); expect(h.calls).toHaveLength(0);
    h.setGateThrows(false); h.controller.retry(); await tick(); h.commit(0);
    expect((await h.controller.flush()).ready).toBe(true);
    h.setBroadcastThrows(true); h.controller.setAudioPreferences({ kind: 'silence-all' });
    expect((await h.controller.flush()).ready).toBe(true); // already saved true
  });
  it('does not clear a failed stop through a successful slider and still broadcasts the stop request', async () => {
    const h = harness(snapshot(enabled)); h.setGateThrows('silence-all');
    h.controller.setAudioPreferences({ kind: 'silence-all' });
    expect(h.events).toContain('broadcast:silence');
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .8 });
    expect(h.gates.some(gate => gate.kind === 'channel-volume')).toBe(false);
    expect(h.controller.getStatus()).toMatchObject({ failed: true, errorCode: 'transition-failed', requestedAudio: { music: { volume: .25 }, silenceAll: true } });
    expect((await h.controller.flush()).ready).toBe(false);
    h.setGateThrows(false);
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .8 });
    expect(h.gates.slice(-2)).toEqual([{ kind: 'silence-all' }, { kind: 'channel-volume', channel: 'music', volume: .8 }]);
    await tick(); expect(h.calls[0].command.payload.patch).toEqual({ silenceAll: true, music: { volume: .8 } });
    h.commit(0); expect((await h.controller.flush()).ready).toBe(true);
  });
  it('provides frozen stable status snapshots and unsubscribe without subscriber failure breaking saves', async () => {
    const h = harness(); const first = h.controller.getStatus(); expect(h.controller.getStatus()).toBe(first);
    let notifications = 0; const unsubscribe = h.controller.subscribe(() => { notifications++; });
    h.controller.subscribe(() => { throw new Error('fixture UI subscriber'); });
    h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .6 });
    expect(Object.isFrozen(h.controller.getStatus())).toBe(true);
    expect(Object.isFrozen(h.controller.getStatus().requestedAudio.music)).toBe(true);
    expect(first.requestedAudio.music.volume).toBe(.25);
    const before = notifications; unsubscribe(); await tick(); h.commit(0); await h.controller.flush();
    expect(notifications).toBe(before);
  });
  it('rejects malformed volume/intent/profile patches before gate or persistence', () => {
    const h = harness();
    for (const volume of [-.1, 1.1, NaN, Infinity]) expect(() => h.controller.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume })).toThrow(TypeError);
    expect(() => h.controller.setAudioPreferences({ kind: 'start' } as unknown as AudioPreferenceIntent)).toThrow(TypeError);
    expect(() => h.controller.setProfilePreferences('alpha', { motion: 'automatic' } as never)).toThrow(TypeError);
    expect(() => h.controller.setProfilePreferences('alpha', { score: 10 } as never)).toThrow(TypeError);
    expect(h.calls).toHaveLength(0); expect(h.gates).toHaveLength(0);
  });
  it('has no database, browser playback or duplicate audio/state contract', () => {
    const source = readFileSync(new URL('../../src/state/preferences.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/from\s+['"][^'"]*(?:idb|repository|react)/);
    expect(source).not.toMatch(/indexedDB|AudioContext|HTMLAudioElement|speechSynthesis/);
    expect(source).not.toMatch(/export type (?:InstallationAudioPreferences|AudioPreferenceIntent|PreferenceStatus)/);
  });
});
