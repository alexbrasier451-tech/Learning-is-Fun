import type { LiveAudioGate } from '../audio/contracts';
import type { TaskDefinition, QuestActivityBinding } from '../learning/contracts';
import type { Milestone } from '../experience/types';
import type { CompetitionClock } from '../rewards/contracts';
import { QUESTS } from '../experience/catalogue';
import { validateBindings } from '../content/quest-bindings';
import { createImportSession, decodeBackupFile, exportFromController, validateSave } from './backup';
import type { ControllerBackupExport, ImportPreview } from './backup';
import { createPreferenceController } from './preferences';
import type { PreferenceController } from './preferences';
import type { SaveRepository, RecoveryExportResult } from './repository';
import type { CommitResult, CommittedSnapshot, LoadResult, ReadTransientReadiness, SelectCommittedActivity, StateCommand, StateController,
  StateReason, TransitionContext, UpdateReadiness, ValidationIssue } from './contracts';
import { createInitialSave, recognizeDuplicate, reduceCommand, retainedTask, sameValue, validCommand } from './transition';

function immutable<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(immutable); if (!Object.isFrozen(value)) Object.freeze(value); }
  return value;
}
const sameToken = (a: CommittedSnapshot['token'], b: CommittedSnapshot['token']) => a.epoch === b.epoch && a.revision === b.revision;
const failed = (snapshot?: CommittedSnapshot): CommitResult => ({ status: 'save-failed', retryable: true,
  reason: { code: 'storage-unreadable', message: 'Saved data is unavailable. Retry or download recovery data; your save has not been reset.' }, ...(snapshot ? { snapshot } : {}) });
const invalid = (reason: StateReason): CommitResult => ({ status: 'invalid', reason });
class RetryCapacityError extends Error {}
type RetryOperation = {
  command: StateCommand; context: TransitionContext; replacementEpoch: string;
  pending: number; failed?: boolean; preferenceOwned?: boolean; remainingPreferenceLeaves?: Set<string>;
  confirmedImport?: TransitionContext['preparedImport']; cancelled?: boolean;
};
function preferenceLeaves(command: StateCommand): string[] | undefined {
  if (command.kind === 'SetProfilePreferences') return Object.keys(command.payload.patch);
  if (command.kind !== 'SetAudioPreferences') return undefined;
  return Object.entries(command.payload.patch).flatMap(([key, value]) =>
    typeof value === 'object' ? Object.keys(value).map(leaf => `${key}.${leaf}`) : [key]);
}
const isDraft = (command: StateCommand) => command.kind === 'SaveDraft' || command.kind === 'SuspendEncounter';
/** A successful explicit replacement retires the failed intent it supersedes.
 * An unrelated commit or panel discard cannot dismiss another durable failure. */
function resolvesFailedIntent(previous: StateCommand, current: StateCommand): boolean {
  if (previous.expected.epoch !== current.expected.epoch || previous.profileId !== current.profileId) return false;
  if (current.kind === 'DeleteProfile' || current.kind === 'StartOver') return previous.profileId !== undefined;
  if (previous.kind !== current.kind) return false;
  if (sameValue(previous.payload, current.payload)) return true;
  if (previous.kind === 'SubmitCheck' && current.kind === 'SubmitCheck') return previous.payload.encounterId === current.payload.encounterId
    && previous.payload.learningEpisodeOrdinal === current.payload.learningEpisodeOrdinal && previous.payload.checkSequence === current.payload.checkSequence;
  return current.kind === 'RenameProfile' || current.kind === 'SetAvatar' || current.kind === 'ChooseCosmetic';
}

/** A bounded historical projection. Reading feedback never evaluates or awards. */
export const selectCommittedActivity: SelectCommittedActivity = (snapshot, catalogue, key) => {
  const unavailable = (reason: 'profile-missing' | 'encounter-expired' | 'content-unavailable') => ({ status: 'unavailable', reason, token: snapshot.token } as const);
  const profile = Object.hasOwn(snapshot.save.profiles, key.profileId) ? snapshot.save.profiles[key.profileId] : undefined;
  if (!profile) return unavailable('profile-missing');
  const e = Object.hasOwn(profile.encounters, key.encounterId) ? profile.encounters[key.encounterId] : undefined;
  if (!e) return unavailable('encounter-expired');
  const task = retainedTask(e, catalogue);
  if (!task) return unavailable('content-unavailable');
  const track = profile.rewards.tracksByCanonical[e.canonicalQuestionId];
  const opportunity = e.opportunityId === null ? undefined : [track?.currentOpportunity, track?.recentCompletedOpportunity].find(o => o?.opportunityId === e.opportunityId);
  const last = e.lastCommittedCheck;
  return immutable(structuredClone({ status: 'ready', activity: { token: snapshot.token, profileId: key.profileId, encounterId: e.encounterId,
    learningEpisodeOrdinal: e.learningEpisode.ordinal, episodeStatus: e.learningEpisode.status, nextCheckSequence: e.validChecks + 1,
    task, responseDraft: e.responseDraft, lastEvaluation: last?.evaluation ?? null,
    lastCheck: last ? { submissionId: last.submissionId, checkSequence: last.checkSequence, learningEpisodeOrdinal: last.learningEpisodeOrdinal, response: last.response } : null,
    revealedAssistanceIds: e.revealedAssistanceIds, bindingProvenance: e.bindingProvenance, selectionReason: e.selectionReason, familiar: e.familiar,
    reviewReference: e.reviewReference, rewardDisplay: { eligibility: e.eligibility, earningWeek: opportunity?.earningWeek ?? null, slot: opportunity?.slot ?? null,
      components: opportunity?.components ?? null, earningWeekOpen: opportunity?.earningWeek != null && opportunity.earningWeek === snapshot.save.competition.latestOpenedWeek,
      lastCommittedDelta: last?.delta ?? null } } } as const));
};

export type ImportPreviewResult = Readonly<{ status: 'ready'; preview: ImportPreview }>
  | Readonly<{ status: 'invalid' | 'unsupported'; issues: readonly ValidationIssue[] }>
  | Readonly<{ status: 'unavailable'; reason: StateReason }>;
export type ExportResult = ControllerBackupExport | Readonly<{ status: 'unavailable'; reason: StateReason }>;
export type ControllerLoadState = Readonly<{ status: 'loading' }> | LoadResult;
type IntentFor<C extends StateCommand> = C extends StateCommand ? Omit<C, 'actionId' | 'expected' | 'payload'> & Readonly<{
  payload: C['kind'] extends 'CreateProfile' | 'StartOver' ? Omit<C['payload'], 'newProfileId'>
    : C['kind'] extends 'SubmitCheck' ? Omit<C['payload'], 'submissionId'> : C['payload'];
}> : never;
/** The shell retains this prepared envelope for retries instead of allocating
 * a fresh submission/profile on every click. dispatch also accepts saved envelopes. */
export type CommandIntent = IntentFor<StateCommand>;
export type ComposedStateController = StateController & Readonly<{
  ready: Promise<LoadResult>;
  getLoadState(): ControllerLoadState;
  prepareCommand(intent: CommandIntent): StateCommand;
  preferences: PreferenceController;
  backupActions: Readonly<{
    prepare(file: Pick<File, 'size' | 'text'>): Promise<ImportPreviewResult>;
    cancel(preparedImportId: string): void;
    confirm(preparedImportId: string): Promise<CommitResult>;
    export(mode: 'flushed' | 'last-committed'): Promise<ExportResult>;
  }>;
  exportRawRecoveryData(): Promise<RecoveryExportResult>;
  /** Stops listeners and closes this controller's repository. No new publication
   * occurs after disposal; an already submitted IDB transaction may still finish. */
  dispose(): void;
}>;
export type StateControllerOptions = Readonly<{
  repository: SaveRepository; catalogue: readonly TaskDefinition[]; questBindings: readonly QuestActivityBinding[];
  milestone: Milestone; clock: CompetitionClock; preferenceGate: LiveAudioGate; readTransientReadiness: ReadTransientReadiness;
  allocateId?: () => string;
}>;

export function createStateController(options: StateControllerOptions): ComposedStateController {
  const { repository } = options;
  const catalogue = immutable(structuredClone(options.catalogue)), questBindings = immutable(structuredClone(options.questBindings));
  const bindingIssues = validateBindings(questBindings, catalogue, QUESTS.map(q => q.id));
  const unavailableContent: StateReason = { code: 'unsupported-content', message: 'The activity catalogue and bindings are unavailable.' };
  const allocateId = options.allocateId ?? (() => crypto.randomUUID());
  const listeners = new Set<() => void>(), failedActions = new Map<string, StateCommand>();
  const imports = createImportSession();
  // Only volatile retry allocations are retained; receipts remain in the save.
  const retryContexts = new Map<string, RetryOperation>();
  let snapshot: CommittedSnapshot | undefined, loadState: ControllerLoadState = { status: 'loading' };
  let queue: Promise<unknown> = Promise.resolve(), pending = 0, readFailed = false, disposed = false;
  let broadcastingSilence = false;
  let signalledToken: CommittedSnapshot['token'] | undefined;
  const emit = () => { if (!disposed) for (const listener of listeners) { try { listener(); } catch { /* Observer cannot change a commit. */ } } };
  const preferences = createPreferenceController({ initialCommitted: null,
    enqueue: command => dispatch(command, true), applyLivePreferences: intent => options.preferenceGate.applyLiveIntent(intent),
    broadcastSilence: () => { broadcastingSilence = true; try { repository.notifySilence(); } finally { broadcastingSilence = false; } }, allocateActionId: allocateId });
  const stopPreferences = preferences.subscribe(emit);
  function accept(next: CommittedSnapshot) {
    if (disposed) return;
    if (!snapshot || !sameToken(snapshot.token, next.token)) {
      if (snapshot && snapshot.token.epoch !== next.token.epoch) { imports.clear(); retryContexts.clear(); failedActions.clear(); }
      snapshot = immutable(structuredClone(next));
    }
    readFailed = false; loadState = { status: 'ready', snapshot };
    preferences.acceptCommitted(snapshot); emit();
  }
  function acceptResult(result: CommitResult): CommitResult {
    if ('snapshot' in result && result.snapshot && result.status !== 'save-failed') accept(result.snapshot);
    if (result.status === 'save-failed' && !result.snapshot && snapshot) return { ...result, snapshot };
    return result;
  }
  function enqueue<T>(run: () => Promise<T>): Promise<T> {
    pending++;
    // Install ownership before notifying reentrant subscribers.
    const work = queue.then(run, run);
    const finished = work.finally(() => {
      pending--; emit();
      if (!pending && signalledToken) {
        const signal = signalledToken; signalledToken = undefined;
        if (!disposed && (!snapshot || !sameToken(snapshot.token, signal))) void refresh();
      }
    });
    queue = finished.catch(() => {});
    emit(); return finished;
  }
  async function load(): Promise<LoadResult> {
    let result: LoadResult;
    try { result = await repository.loadRoot(); }
    catch { result = { status: 'unreadable', reason: { code: 'storage-unreadable', message: 'Saved data could not be read. Retry or download raw recovery data.' } }; }
    if (disposed) return result;
    loadState = result;
    if (result.status === 'ready' || result.status === 'new') accept(result.snapshot);
    else { readFailed = true; preferences.reportReadFailure(); emit(); }
    return result;
  }
  function releaseDiscardedDrafts() {
    // The current panel owns discard/readiness. Observe its clean state without
    // changing it; educational failures and in-flight reservations stay owned.
    try {
      const current = options.readTransientReadiness();
      if (!current || current.dirty !== false || current.pending !== false || current.failed !== false) return;
      for (const [key, retained] of retryContexts) if (!retained.pending && retained.failed && isDraft(retained.command)) retryContexts.delete(key);
    } catch { /* An unavailable registration cannot acknowledge a discard. */ }
  }
  function releaseSupersededRetries(command: StateCommand) {
    const leaves = preferenceLeaves(command);
    for (const [key, retained] of retryContexts) {
      const previous = retained.command;
      if (retained.pending || !retained.failed || previous.expected.epoch !== command.expected.epoch || previous.profileId !== command.profileId) continue;
      if (leaves && previous.kind === command.kind) {
        retained.remainingPreferenceLeaves ??= new Set(preferenceLeaves(previous));
        for (const leaf of leaves) retained.remainingPreferenceLeaves.delete(leaf);
        if (retained.remainingPreferenceLeaves.size === 0) retryContexts.delete(key);
      } else if (previous.kind === 'SaveDraft' && (command.kind === 'SaveDraft' || command.kind === 'SuspendEncounter')
        && command.payload.responseDraft !== undefined && previous.payload.encounterId === command.payload.encounterId) retryContexts.delete(key);
      else if (previous.kind === 'SuspendEncounter' && command.kind === 'SuspendEncounter'
        && previous.payload.encounterId === command.payload.encounterId && previous.payload.learningEpisodeOrdinal === command.payload.learningEpisodeOrdinal
        && (previous.payload.responseDraft === undefined || command.payload.responseDraft !== undefined)) retryContexts.delete(key);
    }
  }
  function invalidateImports(preparedImportId?: string) {
    for (const [key, retained] of retryContexts) if (retained.command.kind === 'ReplaceSave'
      && (preparedImportId === undefined || retained.command.payload.preparedImportId === preparedImportId)) {
      retained.cancelled = true; retained.confirmedImport = undefined; retryContexts.delete(key);
    }
    for (const [key, command] of failedActions) if (command.kind === 'ReplaceSave'
      && (preparedImportId === undefined || command.payload.preparedImportId === preparedImportId)) failedActions.delete(key);
  }
  function operation(command: StateCommand) {
    const key = JSON.stringify([command.expected.epoch, command.actionId]);
    const previous = retryContexts.get(key);
    if (previous) return { key, retained: previous };
    releaseDiscardedDrafts();
    // Never evict an unresolved operation's IDs/clock to admit another action.
    if (retryContexts.size >= 128) throw new RetryCapacityError();
    const allocated: RetryOperation = { command: immutable(structuredClone(command)), context: immutable({ nowEpochMs: options.clock.nowEpochMs(), catalogue, questBindings,
      milestone: options.milestone, allocatedIds: command.kind === 'OpenEncounter' ? { encounterId: allocateId(), opportunityId: allocateId() } : {} }), replacementEpoch: allocateId(), pending: 0 };
    retryContexts.set(key, allocated); return { key, retained: allocated };
  }
  async function run(command: StateCommand, retained: RetryOperation): Promise<CommitResult> {
    if (disposed) return failed(snapshot);
    if (bindingIssues.length) return { status: 'unsupported', reason: unavailableContent };
    if (command.kind === 'ResetSave' || command.kind === 'ReplaceSave') {
      let candidate;
      if (command.kind === 'ReplaceSave') {
        if (!snapshot) return failed();
        if (retained.cancelled) return invalid({ code: 'prepared-import-expired', message: 'Choose and preview the backup again.' });
        // Consume the decoder/session capability once, then privately retain
        // that exact confirmed payload with this immutable operation on abort.
        if (!retained.confirmedImport) {
          const confirmation = imports.confirmImport(command.payload.preparedImportId, snapshot);
          if (confirmation.status !== 'ready') return confirmation.status === 'conflict' ? { status: 'conflict', snapshot }
            : invalid({ code: 'prepared-import-expired', message: 'Choose and preview the backup again.' });
          retained.confirmedImport = confirmation.preparedImport;
        }
        if (!sameToken(command.expected, retained.confirmedImport.expected) || !sameToken(command.expected, snapshot.token)) return { status: 'conflict', snapshot };
        candidate = retained.confirmedImport.save;
      } else candidate = createInitialSave();
      const validation = validateSave(candidate, catalogue);
      if (validation.status !== 'valid') return { status: validation.status, reason: validation.issues[0] ?? { code: 'invalid-save', message: 'The replacement is invalid.' } };
      return repository.replaceSave({ expected: command.expected, validatedSave: validation.save, replacementEpoch: retained.replacementEpoch });
    }
    return repository.commitCommand(command, { reduce: reduceCommand, recognizeDuplicate, context: retained.context });
  }
  function dispatch(input: StateCommand, preferenceOwned = false): Promise<CommitResult> {
    if (disposed) return Promise.resolve(failed(snapshot));
    let captured: StateCommand, allocation: ReturnType<typeof operation>;
    try {
      captured = immutable(structuredClone(input));
      if (!validCommand(captured)) return Promise.resolve(invalid({ code: 'invalid-command', message: 'This action is invalid.' }));
      allocation = operation(captured);
      // An action ID may retain allocations only for its exact original request.
      if (!sameValue(allocation.retained.command, captured)) return Promise.resolve(invalid({ code: 'invalid-command', message: 'Retry the original action unchanged, or create a new action.' }));
    } catch (error) { return Promise.resolve(invalid(error instanceof RetryCapacityError
      ? { code: 'capacity-exceeded', message: 'Finish or retry the pending saves before starting another action.' }
      : { code: 'invalid-command', message: 'This action could not be prepared.' })); }
    allocation.retained.pending++;
    if (preferenceOwned) allocation.retained.preferenceOwned = true;
    return enqueue(async () => {
      let result: CommitResult;
      try { result = await run(captured, allocation.retained); }
      catch { result = { status: 'save-failed', retryable: true, reason: { code: 'transition-failed', message: 'This action could not be saved. Keep your work and retry.' } }; }
      result = acceptResult(result);
      allocation.retained.pending--;
      allocation.retained.failed = result.status === 'save-failed';
      // Public failed envelopes remain exactly retryable. The preference helper
      // owns dirty choices and always issues a new envelope; its completed
      // attempt cannot be retried and owns no reservation after failure either.
      if ((result.status !== 'save-failed' || allocation.retained.preferenceOwned) && !allocation.retained.pending) {
        retryContexts.delete(allocation.key); allocation.retained.confirmedImport = undefined;
      }
      if (result.status === 'committed' || result.status === 'already-applied') releaseSupersededRetries(captured);
      const draftOrPreference = ['SaveDraft', 'SuspendEncounter', 'SetAudioPreferences', 'SetProfilePreferences'].includes(captured.kind);
      if (!draftOrPreference) {
        if (result.status === 'committed' || result.status === 'already-applied') {
          for (const [key, previous] of failedActions) if (key === allocation.key || resolvesFailedIntent(previous, captured)) {
            failedActions.delete(key); retryContexts.delete(key);
          }
        } else if (result.status === 'save-failed' || result.status === 'conflict' || result.status === 'unsupported') failedActions.set(allocation.key, captured);
      }
      return result;
    });
  }
  function refresh(): Promise<CommitResult> {
    if (disposed) return Promise.resolve(failed(snapshot));
    if (bindingIssues.length) return Promise.resolve({ status: 'unsupported', reason: unavailableContent });
    const nowEpochMs = options.clock.nowEpochMs(), actionId = allocateId();
    return enqueue(async () => {
      const loaded = await load();
      if (loaded.status !== 'ready' && loaded.status !== 'new') return loaded.status === 'unsupported' ? { status: 'unsupported', reason: loaded.reason } : failed(snapshot);
      const result = await repository.commitCommand({ kind: 'ReconcileCalendar', actionId, expected: loaded.snapshot.token, payload: {} },
        { reduce: reduceCommand, recognizeDuplicate, context: { nowEpochMs, catalogue, questBindings, milestone: options.milestone, allocatedIds: {} } });
      if (result.status === 'save-failed' || result.status === 'unsupported') readFailed = true;
      return acceptResult(result);
    });
  }
  function getUpdateReadiness(): UpdateReadiness {
    let unsavedTransition = true;
    try { const current = options.readTransientReadiness(); unsavedTransition = !current || [current.dirty, current.pending, current.failed].some(v => typeof v !== 'boolean' || v); }
    catch { /* Missing registration status fails closed. */ }
    const status = preferences.getStatus();
    const failedCommand = disposed || readFailed || loadState.status === 'loading' || failedActions.size > 0;
    return { ready: pending === 0 && !status.pending && !failedCommand && !status.failed && !unsavedTransition,
      pendingCommands: pending, pendingPreferences: status.pending, failedCommand, failedPreferences: status.failed, unsavedTransition };
  }
  async function flush(): Promise<UpdateReadiness> {
    // A preference acknowledgement/subscriber may append work to either queue.
    // Drain until both ownership references and pending counts are stable.
    for (;;) {
      const before = queue;
      await before; await preferences.flush();
      const status = preferences.getStatus();
      // Failed dirty leaves are intentionally retained as visit-only requests.
      // Their queue is drained even though PreferenceStatus.pending stays true.
      if (before === queue && pending === 0 && (!status.pending || status.failed)) return getUpdateReadiness();
    }
  }
  const unsubscribe = repository.subscribeInvalidation(signal => {
    if (disposed) return;
    if (signal.kind === 'silence') { if (!broadcastingSilence) preferences.receiveSilence(); return; }
    signalledToken = signal.token;
    if (!pending) { signalledToken = undefined; void refresh(); }
  });
  const initialNow = options.clock.nowEpochMs();
  const ready = enqueue(async (): Promise<LoadResult> => {
    // The repository's first load may create a clean root. Validate the assembled
    // registry first, so unavailable content cannot initiate that write either.
    if (bindingIssues.length) {
      const unavailable = { status: 'unsupported' as const, reason: unavailableContent };
      loadState = unavailable; readFailed = true; preferences.reportReadFailure(); emit(); return unavailable;
    }
    const loaded = await load();
    if (loaded.status !== 'new' && loaded.status !== 'ready') return loaded;
    const result = acceptResult(await repository.commitCommand({ kind: 'ReconcileCalendar', actionId: allocateId(), expected: loaded.snapshot.token, payload: {} },
      { reduce: reduceCommand, recognizeDuplicate, context: { nowEpochMs: initialNow, catalogue, questBindings, milestone: options.milestone, allocatedIds: {} } }));
    if (result.status === 'committed' || result.status === 'already-applied' || result.status === 'conflict') return { status: loaded.status, snapshot: result.snapshot };
    readFailed = true;
    const unavailable = { status: result.status === 'unsupported' ? 'unsupported' as const : 'unreadable' as const, reason: result.reason };
    loadState = unavailable; preferences.reportReadFailure(); emit(); return unavailable;
  });
  const controller: ComposedStateController = {
    ready, getLoadState: () => loadState,
    prepareCommand(intent) {
      if (!snapshot || disposed) throw new Error('Load a committed snapshot before preparing an action.');
      const command = { ...structuredClone(intent), expected: snapshot.token, actionId: allocateId(), payload: {
        ...structuredClone(intent.payload), ...(intent.kind === 'CreateProfile' || intent.kind === 'StartOver' ? { newProfileId: allocateId() }
          : intent.kind === 'SubmitCheck' ? { submissionId: allocateId() } : {}),
      } };
      if (!validCommand(command)) throw new TypeError('This action is invalid.');
      return immutable(command);
    },
    getSnapshot: () => { if (!snapshot) throw new Error('No committed snapshot is available; inspect getLoadState().'); return snapshot; },
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    dispatch: command => dispatch(command), refresh, flush, getUpdateReadiness, preferences,
    backupActions: {
      async prepare(file) {
        await ready;
        if (!snapshot || disposed) return { status: 'unavailable', reason: { code: 'storage-unreadable', message: 'Load the current save before preparing a replacement.' } };
        const captured = snapshot;
        const decoded = await decodeBackupFile(file, catalogue);
        if (decoded.status !== 'valid') return decoded;
        if (disposed) return { status: 'unavailable', reason: { code: 'prepared-import-expired', message: 'The import session is closed.' } };
        invalidateImports();
        return { status: 'ready', preview: imports.prepareImport(decoded.envelope, captured) };
      },
      cancel(id) { imports.cancelImport(id); invalidateImports(id); emit(); },
      confirm(id) {
        if (!snapshot) return Promise.resolve(failed());
        const retained = [...retryContexts.values()].find(value => value.command.kind === 'ReplaceSave' && value.command.payload.preparedImportId === id);
        if (retained) return dispatch(retained.command);
        return dispatch({ kind: 'ReplaceSave', actionId: allocateId(), expected: snapshot.token, payload: { preparedImportId: id } });
      },
      async export(mode) {
        await ready;
        if (!snapshot) return { status: 'unavailable', reason: { code: 'storage-unreadable', message: 'No compatible committed snapshot is available. Use Download raw recovery data.' } };
        try { return await exportFromController(controller, new Date(options.clock.nowEpochMs()).toISOString(), mode === 'flushed' ? 'ordinary' : 'last-committed-recovery', catalogue); }
        catch { return { status: 'unavailable', reason: { code: 'storage-unreadable', message: 'The committed backup could not be exported.' } }; }
      },
    },
    exportRawRecoveryData: () => repository.readRecoveryExport(),
    dispose() { if (disposed) return; disposed = true; unsubscribe(); stopPreferences(); imports.clear(); invalidateImports(); retryContexts.clear(); listeners.clear(); repository.close(); },
  };
  return controller;
}
