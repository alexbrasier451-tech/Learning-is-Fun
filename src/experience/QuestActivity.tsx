import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import type { ActivePanelHost, ActivePanelLifecycle, ActivePanelStatus, PanelLeaveResult } from '../app/panelLifecycle';
import type { AudioController } from '../audio/controller';
import { listTasks } from '../content/catalogue';
import { createDraft, reduceDraft, toResponse } from '../interaction/draft';
import type { ActivityDraft, DraftAction } from '../interaction/draft';
import { ChoiceTiles, PlacementBoard, QuantityControl } from '../interaction/ActivityWidgets';
import { selectCommittedActivity } from '../state/controller';
import type { CommitResult, CommittedActivityProjection, StateCommand, StateController } from '../state/contracts';
import { CompanionView } from './CompanionView';
import { toActivityTaskView } from './activityAdapter';

const catalogue = listTasks();
type ActivityCommand = Extract<StateCommand, { kind: 'SubmitCheck' | 'RecordAssistance' | 'SaveDraft' | 'SuspendEncounter' | 'FinishPractice' }>;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const ready: PanelLeaveResult = { status: 'ready' };
const blocked = (message: string): PanelLeaveResult => ({ status: 'blocked', message });
const acknowledged = (result: CommitResult) => result.status === 'committed' || result.status === 'already-applied';
function failure(result: CommitResult) {
  return result.status === 'conflict' ? 'Your save changed elsewhere. Refresh and retry when you are ready. Your draft is still here.'
    : 'reason' in result && result.reason ? `${result.reason.message} Your draft is still here.` : 'This action was not saved. Please retry.';
}

/** One transient session per captured profile/epoch/encounter/episode. The sole
 * facade owns every durable command; this object owns only draft and leave flags. */
function createActivitySession(initial: CommittedActivityProjection, controller: StateController,
  onCommitted: (result: Extract<CommitResult, { status: 'committed' }>) => void) {
  const key = { profileId: initial.profileId, encounterId: initial.encounterId };
  let activity = initial, draft = createDraft(toActivityTaskView(initial).responseSpec, initial.responseDraft);
  let baseline = toResponse(draft), disposed = false, failedLeave = false, pending = false, leaving = false, freshSuccess = false;
  let operation: Promise<CommitResult | null> | null = null, leaveOperation: Promise<PanelLeaveResult> | null = null;
  let retry: ActivityCommand | null = null, leaveRetry: Extract<ActivityCommand, { kind: 'SuspendEncounter' }> | null = null, message = '', conflict = false;
  let version = 0, status: ActivePanelStatus = { dirty: false, pending: false, failed: false };
  const listeners = new Set<() => void>();
  const read = () => {
    const snapshot = controller.getSnapshot();
    if (disposed || snapshot.token.epoch !== initial.token.epoch) return null;
    const projected = selectCommittedActivity(snapshot, catalogue, key);
    return projected.status === 'ready' && projected.activity.learningEpisodeOrdinal === initial.learningEpisodeOrdinal ? projected.activity : null;
  };
  function publish() {
    const next = { dirty: !same(toResponse(draft), baseline), pending: pending || leaving, failed: failedLeave };
    if (!same(status, next)) status = next;
    version++; listeners.forEach(listener => listener());
  }
  function sync() {
    const next = read();
    if (!next) { message = 'This saved activity is no longer available. Return to your players to recover it.'; publish(); return; }
    if (!status.dirty && !pending && !leaving) {
      draft = createDraft(toActivityTaskView(next).responseSpec, next.responseDraft); baseline = toResponse(draft);
    }
    activity = next; publish();
  }
  const unsubscribe = controller.subscribe(sync);
  function envelope() { return { actionId: crypto.randomUUID(), profileId: initial.profileId, expected: controller.getSnapshot().token }; }
  function run(command: ActivityCommand): Promise<CommitResult | null> {
    if (pending || !read()) return Promise.resolve(null);
    pending = true; message = 'Saving…'; publish();
    const work = Promise.resolve().then(async () => {
      let result: CommitResult;
      try { result = await controller.dispatch(command); }
      catch { result = { status: 'save-failed', retryable: true, reason: { code: 'storage-write-failed', message: 'Saving was interrupted.' } }; }
      if (!read()) return null;
      pending = false; activity = read()!;
      if (acknowledged(result)) {
        retry = null; conflict = false; message = result.status === 'already-applied' ? 'Already saved. Your progress is safe.' : 'Saved on this device.';
        if (command.kind === 'SubmitCheck' || command.kind === 'SuspendEncounter' || command.kind === 'SaveDraft') {
          baseline = toResponse(createDraft(toActivityTaskView(activity).responseSpec, activity.responseDraft));
        }
        if (result.status === 'committed') {
          if (command.kind === 'SubmitCheck' && activity.lastEvaluation?.correct) freshSuccess = true;
          onCommitted(result);
        }
      } else {
        retry = result.status === 'invalid' && command.kind !== 'SuspendEncounter' ? null : command;
        conflict = result.status === 'conflict'; message = failure(result);
      }
      publish(); return result;
    }).finally(() => { if (operation === work) operation = null; });
    operation = work; return work;
  }
  async function retryAction() {
    if (!retry || pending || leaving) return;
    let command = retry;
    if (conflict) {
      pending = true; publish();
      try { await controller.refresh(); } finally { pending = false; }
      const current = read();
      if (!current || (command.kind === 'SubmitCheck' && current.nextCheckSequence !== command.payload.checkSequence)) {
        message = 'Saved work has advanced. Leave this draft or return to players and reopen the saved activity.'; publish(); return;
      }
      command = { ...command, ...envelope() }; retry = command;
    }
    await run(command);
  }
  const lifecycle: ActivePanelLifecycle = {
    getStatus: () => status,
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    suspend() {
      if (leaveOperation) return leaveOperation;
      leaving = true; publish();
      const work = Promise.resolve().then(async (): Promise<PanelLeaveResult> => {
        if (operation) await operation;
        const current = read();
        if (!current) return blocked('The original activity binding changed. Return to players to recover.');
        if (retry && retry.kind !== 'SuspendEncounter') return blocked('An action is not saved. Retry it before leaving, or explicitly discard only the local draft.');
        if (current.episodeStatus.startsWith('completed') && !status.dirty) { failedLeave = false; return ready; }
        if (leaveRetry && conflict) {
          await controller.refresh();
          if (!read()) return blocked('The original activity changed. It cannot be saved into another episode.');
          leaveRetry = { ...leaveRetry, ...envelope() };
        }
        const command: Extract<ActivityCommand, { kind: 'SuspendEncounter' }> = leaveRetry ?? { ...envelope(), kind: 'SuspendEncounter', payload: {
          encounterId: initial.encounterId, learningEpisodeOrdinal: initial.learningEpisodeOrdinal, responseDraft: toResponse(draft),
        } };
        const result = await run(command);
        if (result && acknowledged(result) && read()?.episodeStatus === 'suspended') {
          leaveRetry = null; failedLeave = false; retry = null; return ready;
        }
        leaveRetry = command; failedLeave = true;
        return blocked(message || 'Your draft has not been saved. Retry leaving, or explicitly leave without saving the draft.');
      }).catch(() => { failedLeave = true; message = 'Leaving was interrupted. Your draft is still here.'; return blocked(message); })
        .then(result => { if (result.status === 'blocked') { failedLeave = true; message = result.message; } return result; })
        .finally(() => { leaving = false; leaveOperation = null; if (!disposed) publish(); });
      leaveOperation = work; return work;
    },
    discardDraft() {
      if (pending || leaving) return blocked('Please wait for the current action to finish.');
      const current = read();
      if (current) { activity = current; draft = createDraft(toActivityTaskView(current).responseSpec, current.responseDraft); baseline = toResponse(draft); }
      failedLeave = false; leaveRetry = null;
      if (retry?.kind === 'SuspendEncounter') retry = null;
      message = current ? 'Only your unsaved draft was discarded. Saved attempts, help and progress remain.' : 'Saved content is unavailable. Return to players for recovery.';
      publish(); return ready;
    },
  };
  return {
    lifecycle, getVersion: () => version, subscribe: lifecycle.subscribe,
    getView: () => ({ activity, draft, message, status, retry, conflict, freshSuccess }),
    edit(action: DraftAction) {
      if (pending || leaving || activity.episodeStatus !== 'open' || !read()) return;
      draft = reduceDraft(draft, action, toActivityTaskView(activity).responseSpec); publish();
    },
    submitDraft() {
      if (retry || pending || leaving) return Promise.resolve(null);
      const current = read(); if (!current || current.episodeStatus !== 'open') return Promise.resolve(null);
      return run({ ...envelope(), kind: 'SubmitCheck', payload: { encounterId: key.encounterId,
        learningEpisodeOrdinal: initial.learningEpisodeOrdinal, submissionId: crypto.randomUUID(),
        checkSequence: current.nextCheckSequence, response: toResponse(draft) } });
    },
    requestHint() {
      if (retry || pending || leaving) return Promise.resolve(null);
      const current = read(); if (!current) return Promise.resolve(null);
      if (current.episodeStatus !== 'open') { message = 'This idea is already saved. Continue the adventure, or try an optional challenge.'; publish(); return Promise.resolve(null); }
      const hint = toActivityTaskView(current).nextHelp;
      if (!hint) { message = 'All of Pip’s help for this idea is on screen. You can keep it open while you try.'; publish(); return Promise.resolve(null); }
      return run({ ...envelope(), kind: 'RecordAssistance', payload: { encounterId: key.encounterId,
        assistanceKind: hint.id === current.task.workedSupport.id ? 'worked-support' : 'answer-hint', hintId: hint.id } });
    },
    async readAssessed(audio: AudioController) {
      if (retry || pending || leaving) return;
      const sound = audio.getSnapshot();
      if (!sound.localVoiceAvailable || sound.activation !== 'ready' || !sound.visible || !sound.preferences.soundEnabled || sound.preferences.silenceAll) return;
      const current = read(); if (!current || !current.task.narration.assessedTextMayBeSpokenBeforeCheck) return;
      const result = await run({ ...envelope(), kind: 'RecordAssistance', payload: { encounterId: key.encounterId, assistanceKind: 'assessed-text-read-aloud' } });
      if (result && acknowledged(result) && read()) audio.readText({ requestId: crypto.randomUUID(), role: 'assessed-text', text: current.task.assessedText, language: 'en' });
    },
    async finishPractice() {
      if (retry || pending || leaving) return Promise.resolve(null);
      const current = read();
      if (!current || current.episodeStatus !== 'open' || !current.lastCheck || current.lastCheck.learningEpisodeOrdinal !== current.learningEpisodeOrdinal || current.lastEvaluation?.correct) return Promise.resolve(null);
      if (status.dirty) {
        const saved = await run({ ...envelope(), kind: 'SaveDraft', payload: { encounterId: key.encounterId, responseDraft: toResponse(draft) } });
        if (!saved || !acknowledged(saved) || !read()) return null;
      }
      return run({ ...envelope(), kind: 'FinishPractice', payload: { encounterId: key.encounterId, learningEpisodeOrdinal: initial.learningEpisodeOrdinal } });
    },
    retryAction,
    dispose() { disposed = true; unsubscribe(); listeners.clear(); },
  };
}

export function QuestActivity({ activity, stateController, audioController, activePanelHost, onLeave, onContinue, onTransfer, onCommitted }: {
  activity: CommittedActivityProjection; stateController: StateController; audioController: AudioController; activePanelHost: ActivePanelHost;
  onLeave(): void; onContinue(): void; onTransfer?: () => void;
  onCommitted(result: Extract<CommitResult, { status: 'committed' }>): void;
}) {
  const callback = useRef(onCommitted); callback.current = onCommitted;
  const session = useMemo(() => createActivitySession(activity, stateController, result => callback.current(result)),
    [activity.profileId, activity.encounterId, activity.token.epoch, activity.learningEpisodeOrdinal, stateController]);
  useSyncExternalStore(session.subscribe, session.getVersion, session.getVersion);
  const audioStatus = useSyncExternalStore(audioController.subscribe, audioController.getSnapshot, audioController.getSnapshot);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const unregister = activePanelHost.register(session.lifecycle); heading.current?.focus();
    return () => { session.dispose(); audioController.stopReading(); unregister(); };
  }, [session, activePanelHost, audioController]);
  const view = session.getView(), task = toActivityTaskView(view.activity);
  const success = view.activity.episodeStatus === 'completed-success';
  const canRead = audioStatus.localVoiceAvailable && audioStatus.activation === 'ready' && audioStatus.visible
    && audioStatus.preferences.soundEnabled && !audioStatus.preferences.silenceAll;
  const terminal = view.activity.episodeStatus.startsWith('completed');
  const guidance = task.help.length ? task.help.map(h => h.text).join('\n\n') : task.instructionText;
  const Widget = task.responseSpec.kind === 'bridge' ? PlacementBoard : task.responseSpec.kind === 'punctuation' ? ChoiceTiles : QuantityControl;
  const changedSinceCheck = task.feedback && !same(toResponse(view.draft), task.feedback.response);
  return <section className="adventure-activity" aria-busy={view.status.pending}>
    <header className="activity-heading"><div><p className="adventure-eyebrow">{task.label}{task.familiar ? ' · A familiar idea' : ''}</p>
      <h2 ref={heading} tabIndex={-1}>Make a little difference</h2></div>
      <button type="button" onClick={onLeave}>Leave activity</button></header>
    <p className="activity-prompt">{task.instructionText}</p>
    {task.assessedText && <div className="activity-reading"><p>{task.assessedText}</p>
      {task.assessedTextMayBeSpoken && <button type="button" disabled={view.status.pending || terminal || !!view.retry || !canRead}
        onClick={() => { void session.readAssessed(audioController); }}>Read the task text with listening support</button>}</div>}
    <p className="adventure-note">Try things out. Moving pieces does not count as an answer. Choose Check when you are ready; Undo and hints are here to help.</p>
    <Widget responseSpec={task.responseSpec} draft={view.draft} disabled={view.status.pending || terminal || !!view.retry} onAction={action => {
      session.edit(action); audioController.playEffect(action.kind === 'select' ? 'pickup' : 'placement');
    }} />
    <div className="activity-actions">
      <button className="adventure-primary" type="button" disabled={view.status.pending || terminal || !!view.retry} onClick={() => { void session.submitDraft(); }}>Check my idea</button>
      {!terminal && task.feedback && task.feedback.episode === activity.learningEpisodeOrdinal && !task.feedback.correct
        && <button type="button" disabled={view.status.pending || !!view.retry} onClick={() => { void session.finishPractice().then(result => { if (result && acknowledged(result)) onLeave(); }); }}>Finish practice for now</button>}
      {view.retry && view.retry.kind !== 'SuspendEncounter' && <button type="button" disabled={view.status.pending} onClick={() => { void session.retryAction(); }}>{view.conflict ? 'Refresh and retry action' : 'Retry saved action'}</button>}
    </div>
    <p role="status" className="activity-save-status">{view.message || (view.status.dirty ? 'Your idea is not saved yet.' : 'Your saved starting point is ready.')}</p>
    {task.feedback && <section className={`activity-feedback ${task.feedback.correct ? 'is-success' : ''}`} aria-label="Feedback from your saved Check">
      <h3>{task.feedback.correct ? 'Your idea worked!' : 'A useful step. Keep exploring.'}</h3>
      <p>{task.feedback.explanation}</p>{task.feedback.issues.map((issue, i) => <p key={i}>{issue.explanation}</p>)}
      <p className="adventure-note">From Check {task.feedback.checkSequence} in practice session {task.feedback.episode}.{changedSinceCheck ? ' You have changed your idea since this Check.' : ''}</p>
      {task.historicalDelta && <p className="adventure-note">That saved Check added {task.historicalDelta.lifetimeDelta} lifetime points and {task.historicalDelta.competitiveDelta} weekly points.</p>}
      {success && task.help.length > 0 && <p>You used help and kept going. Your idea still made a difference.</p>}
    </section>}
    <p className="adventure-note">{task.rewardLabel}</p>
    <CompanionView pose={view.freshSuccess ? 'celebration' : task.help.length ? 'help' : 'idle'} visibleGuidance={guidance}
      audioStatus={audioStatus} onRequestHint={() => { void session.requestHint(); }}
      onChooseNext={onContinue} nextActivityLabel={success ? 'Continue the adventure' : undefined}
      onRead={() => audioController.readText({ requestId: crypto.randomUUID(), language: 'en', text: guidance, role: task.help.length ? 'answer-help' : 'instruction' })}
      onStopReading={audioController.stopReading} />
    {success && onTransfer && <aside className="activity-transfer"><h3>One more way to use your idea?</h3>
      <p>This different challenge is optional. Your restoration is already saved.</p>
      <button type="button" onClick={onTransfer}>Try the optional challenge</button><button type="button" onClick={onContinue}>Continue without the extra challenge</button></aside>}
  </section>;
}
