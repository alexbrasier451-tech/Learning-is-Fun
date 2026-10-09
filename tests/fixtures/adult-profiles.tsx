import { useState, useSyncExternalStore } from 'react';
import { mountPanel } from './host';
import { ProfileChooser } from '../../src/profiles/ProfileChooser';
import { AdultArea } from '../../src/adult/AdultArea';
import type { BackupActions, ProfileDispatch } from '../../src/adult/adultProfilesPorts';
import type { AdultProfilesApi } from './adult-profiles-api';
import { createPreferenceController } from '../../src/state/preferences';
import { createInitialSave } from '../../src/state/transition';
import { INITIAL_PROFILE_PREFERENCES } from '../../src/state/contracts';
import type { CommitResult, CommittedSnapshot, ProfileSave, StateCommand } from '../../src/state/contracts';
import type { ComposedStateController } from '../../src/state/controller';
import type { LearningObservation, SkillEvidence } from '../../src/learning/contracts';
import { applyLearningObservation } from '../../src/learning/evidence';
import { summarizeLearning } from '../../src/learning/summarize';
import { listTasks } from '../../src/content/catalogue';
import { AVATARS, INITIAL_CREATIVE_STATE } from '../../src/experience/catalogue';
import { BackupPanel } from '../../src/adult/BackupPanel';

const params = new URLSearchParams(location.search), mode = params.get('mode') === 'real' ? 'real' : 'frozen';
if (mode === 'real' && import.meta.env.VITE_ADULT_REAL_RELEASE !== 'yes') throw new Error('Actual facade integration awaits Controller release.');
const namespace = `learning-is-fun:/playtest/:adult-${params.get('namespace') ?? crypto.randomUUID()}`;
let abortNextWrite = false;
const nativePut = IDBObjectStore.prototype.put;
// Fault injection only: the actual repository still owns every native write.
if (mode === 'real') IDBObjectStore.prototype.put = function (...args: Parameters<IDBObjectStore['put']>) {
  const result = nativePut.apply(this, args);
  if (abortNextWrite && this.transaction.db.name === `${namespace}:save`) { abortNextWrite = false; this.transaction.abort(); }
  return result;
};
const catalogue = listTasks(), tasks = catalogue.filter(t => t.skillId === 'M01');
const neutral = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' } as const;
let evidence: SkillEvidence = {};
function observation(encounterId: string, index: number, correct: boolean, hint: boolean, secondTask = false, review = false): LearningObservation {
  const task = secondTask ? tasks.find(t => t.canonicalQuestionId !== tasks[0].canonicalQuestionId && t.band === tasks[0].band)! : tasks[0];
  return { kind: 'check', eventId: `${encounterId}-${index}`, submissionId: `${encounterId}-${index}`, profileId: 'a', encounterId,
    learningEpisodeOrdinal: 1, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    selectionReason: review ? 'due-review' : 'adaptive-practice', localDate: review ? '2026-10-12' : '2026-10-06', competitionWeekId: review ? '2026-10-12' : '2026-10-05',
    familiar: review, reviewReference: review ? { canonicalQuestionId: task.canonicalQuestionId, dueLocalDate: '2026-10-09', previousSuccessWeek: '2026-10-05' } : null,
    assistance: { ...neutral, answerHintUsed: hint }, episodeCheckIndex: index, encounterCheckIndex: index, firstCheckCorrect: index === 1 && correct,
    correct, issues: correct ? [] : [{ code: 'total', observed: 'Too short', explanation: 'The planks do not reach the target total.', slotId: null, constraintId: 'bridge-total' }],
    episodeCompletion: correct ? 'success' : null } as LearningObservation;
}
for (const o of [observation('hinted', 1, false, false), observation('hinted', 2, true, true), observation('distinct', 1, true, false, true), observation('review', 1, true, false, false, true)]) evidence = applyLearningObservation(evidence, o);
const summary = summarizeLearning(evidence, catalogue, '2026-10-13');
function frozenProfile(profileId: string, nickname: string, avatarId: string): ProfileSave {
  return { identity: { profileId, nickname, avatarId }, preferences: INITIAL_PROFILE_PREFERENCES,
    learning: { evidence: profileId === 'a' ? evidence : {}, canonicalHistory: [] }, encounters: {},
    world: { completedQuestIds: [], completedStoryBindingIds: [] }, creative: INITIAL_CREATIVE_STATE,
    rewards: { lifetimePoints: profileId === 'a' ? 42 : 0, tracksByCanonical: {}, questReceipts: [], entitlementIds: [] }, personalRecords: { best: null, medals: { gold: 0, silver: 0, bronze: 0 } } };
}
const four = [frozenProfile('a', 'Ada', 'pip'), frozenProfile('b', 'Ben', 'rowan'), frozenProfile('c', 'Cora', 'iona'), frozenProfile('d', 'Dev', 'nessa')];
const cases = {
  four, empty: [], capacity: Array.from({ length: 16 }, (_, index) => frozenProfile(`full-${index}`, `Explorer ${index + 1}`, AVATARS[index % 6].id)),
  renamed: four.map(p => p.identity.profileId === 'a' ? { ...p, identity: { ...p.identity, nickname: 'Star' } } : p), deleted: four.filter(p => p.identity.profileId !== 'a'),
};
let snapshot: CommittedSnapshot = { token: { epoch: 'frozen-ui', revision: 1 }, save: { ...createInitialSave(), profiles: Object.fromEntries(four.map(p => [p.identity.profileId, p])) } };
let selected: string | null = 'a', outcome: 'committed' | 'conflict' | 'save-failed' | 'invalid' | 'unacknowledged' = 'committed', blocked = false;
let holdNext = false, release: (() => void) | undefined, nextProfiles: readonly ProfileSave[] | null = null, now = Date.parse('2026-10-13T12:00:00Z');
const listeners = new Set<() => void>(), commands: StateCommand[] = [], selections: string[] = [];
const backupCalls: { kind: 'prepare' | 'cancel' | 'confirm'; id?: string; size?: number }[] = [];
const emit = () => { for (const listener of listeners) listener(); };
const changes = { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0, newReceiptKeys: [], newEntitlementIds: [] }, unlockedIds: [], restorationIds: [], closedWeekIds: [] } as const;
const fakeDispatch: ProfileDispatch = {
  prepareCommand: intent => ({ ...intent, actionId: crypto.randomUUID(), expected: snapshot.token,
    payload: { ...intent.payload, ...(intent.kind === 'CreateProfile' || intent.kind === 'StartOver' ? { newProfileId: crypto.randomUUID() } : {}) } } as StateCommand),
  async dispatch(command) {
    commands.push(command);
    if (holdNext) { holdNext = false; await new Promise<void>(resolve => { release = resolve; }); release = undefined; }
    if (outcome === 'unacknowledged') throw new Error('Frozen fault port: submitted result was not acknowledged.');
    if (outcome === 'save-failed') return { status: 'save-failed', retryable: true, reason: { code: 'storage-write-failed', message: 'Fixture write failed. Retry the captured action.' } };
    if (outcome === 'invalid') return { status: 'invalid', reason: { code: 'profile-missing', message: 'The captured profile is missing.' } };
    if (outcome === 'conflict') { snapshot = { ...snapshot, token: { ...snapshot.token, revision: snapshot.token.revision + 1 } }; emit(); return { status: 'conflict', snapshot }; }
    // Finite presentation acknowledgements, never proof of domain transitions.
    if (nextProfiles) { snapshot = { ...snapshot, save: { ...snapshot.save, profiles: Object.fromEntries(nextProfiles.map(p => [p.identity.profileId, p])) } }; nextProfiles = null; }
    if (command.kind === 'SetProfilePreferences' && snapshot.save.profiles[command.profileId]) {
      const p = snapshot.save.profiles[command.profileId]; snapshot = { ...snapshot, save: { ...snapshot.save, profiles: { ...snapshot.save.profiles,
        [command.profileId]: { ...p, preferences: { ...p.preferences, ...command.payload.patch } } } } };
    }
    snapshot = { ...snapshot, token: { ...snapshot.token, revision: snapshot.token.revision + 1 } }; preferenceController.acceptCommitted(snapshot); emit();
    return { status: 'committed', snapshot, changes };
  },
};
let controller: ComposedStateController | null = null;
let preferenceController = createPreferenceController({ initialCommitted: snapshot, enqueue: command => fakeDispatch.dispatch(command), applyLivePreferences() {}, broadcastSilence() {} });
const fakeBackup: BackupActions = {
  async prepare(file) { const id = crypto.randomUUID(); backupCalls.push({ kind: 'prepare', id, size: file.size }); return { status: 'ready', preview: { preparedImportId: id, expected: snapshot.token, exportedAt: '2026-10-13T12:00:00Z', profileNames: ['Backup explorer'], profileCount: 1 } }; },
  cancel(id) { backupCalls.push({ kind: 'cancel', id }); cancelled.add(id); },
  async confirm(id) { backupCalls.push({ kind: 'confirm', id }); if (cancelled.has(id)) return { status: 'invalid', reason: { code: 'prepared-import-expired', message: 'Preview expired.' } };
    return fakeDispatch.dispatch({ kind: 'ReplaceSave', actionId: crypto.randomUUID(), expected: snapshot.token, payload: { preparedImportId: id } }); },
  async export(mode) { return blocked && mode === 'flushed' ? { status: 'blocked', readiness: { ready: false, pendingCommands: 0, pendingPreferences: false, failedCommand: true, failedPreferences: false, unsavedTransition: false }, message: 'Some changes are not saved. Download the last committed recovery backup.' }
    : { status: 'ready', source: mode === 'flushed' ? 'committed' : 'last-committed-recovery', backup: { filename: 'frozen-port-example.json', json: '{"fixtureOnly":true}', byteLength: 20 } }; },
  async exportRawRecoveryData() { return { status: 'available', representation: 'raw-indexeddb-root-json', databaseName: namespace, structuralVersion: 7, store: 'records', key: 'root', json: '{"unsupported":true}', byteLength: 20 }; },
};
const cancelled = new Set<string>();
async function openReal() {
  const [{ createStateController }, { openSaveRepository }, { validateSave }, { QUEST_ACTIVITY_BINDINGS }] = await Promise.all([
    import('../../src/state/controller'), import('../../src/state/repository'), import('../../src/state/backup'), import('../../src/content/quest-bindings')]);
  controller = createStateController({ repository: openSaveRepository({ appNamespace: namespace, initialSave: createInitialSave(), validateSave, catalogue }), catalogue,
    questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1', clock: { nowEpochMs: () => now }, preferenceGate: { applyLiveIntent() {} }, readTransientReadiness: () => ({ dirty: false, pending: false, failed: false }) });
  await controller.ready; preferenceController = controller.preferences; controller.subscribe(emit);
}
if (mode === 'real') await openReal();
const getSnapshot = () => controller ? controller.getSnapshot() : snapshot;
const realDispatch: ProfileDispatch = {
  prepareCommand(intent) { if (!controller) throw new Error('Controller not loaded.'); return controller.prepareCommand(intent); },
  async dispatch(command) {
    const capturedController = controller; if (!capturedController) throw new Error('Controller not loaded.');
    commands.push(command);
    if (holdNext) { holdNext = false; await new Promise<void>(resolve => { release = resolve; }); release = undefined; }
    return capturedController.dispatch(command);
  },
};
const dispatchPort = () => controller ? realDispatch : fakeDispatch;
function backupPort(): BackupActions {
  const capturedController = controller;
  if (!capturedController) return fakeBackup;
  return {
    async prepare(file) { const result = await capturedController.backupActions.prepare(file);
      if (result.status === 'ready') backupCalls.push({ kind: 'prepare', id: result.preview.preparedImportId, size: file.size }); return result; },
    cancel(id) { backupCalls.push({ kind: 'cancel', id }); capturedController.backupActions.cancel(id); },
    async confirm(id) { backupCalls.push({ kind: 'confirm', id });
      if (holdNext) { holdNext = false; await new Promise<void>(resolve => { release = resolve; }); release = undefined; }
      return capturedController.backupActions.confirm(id); },
    export: capturedController.backupActions.export, exportRawRecoveryData: capturedController.exportRawRecoveryData,
  };
}
// Stable port object: do not invalidate pending import sessions on React renders.
let backupActions = backupPort();
let revision = 0;
function publish() { revision++; for (const listener of uiListeners) listener(); }
const uiListeners = new Set<() => void>(); listeners.add(publish);
window.adultProfiles = {
  mode, namespace, snapshot: getSnapshot, summaries: () => summary, commands: () => commands, backupCalls: () => backupCalls, selected: () => selected, selections: () => selections,
  select(value) { selected = value; publish(); },
  scenario(name) { if (mode !== 'frozen') throw new Error('Finite scenarios are frozen-port-only.');
    snapshot = { ...snapshot, token: { ...snapshot.token, revision: snapshot.token.revision + 1 }, save: { ...snapshot.save, profiles: Object.fromEntries(cases[name].map(p => [p.identity.profileId, p])) } }; preferenceController.acceptCommitted(snapshot); emit(); },
  outcome(value) { outcome = value; }, hold() { holdNext = true; }, release() { release?.(); },
  bump() { snapshot = { ...snapshot, token: { ...snapshot.token, revision: snapshot.token.revision + 1 } }; emit(); },
  blocked(value) { blocked = value; }, send(command) { return dispatchPort().dispatch(command); },
  abortNextWrite() { if (!controller) throw new Error('Native abort requires real mode.'); abortNextWrite = true; },
  async nativeRoot() {
    if (!controller) throw new Error('Native root read requires real mode.');
    return new Promise<unknown>((resolve, reject) => {
      const request = indexedDB.open(`${namespace}:save`);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => { const db = request.result, tx = db.transaction('records', 'readonly'), read = tx.objectStore('records').get('root');
        tx.oncomplete = () => { db.close(); resolve(read.result); }; tx.onerror = () => { db.close(); reject(tx.error); }; };
    });
  },
  async practice(profileId, wrongFirst) {
    if (!controller) throw new Error('Actual learning integration awaits release.');
    await controller.dispatch(controller.prepareCommand({ kind: 'OpenEncounter', profileId, payload: { route: { kind: 'quest', questId: 'Q1' }, suppressDueReviewForVisit: true } }));
    const encounter = Object.values(controller.getSnapshot().save.profiles[profileId].encounters).at(-1)!;
    const task = catalogue.find(t => t.canonicalQuestionId === encounter.canonicalQuestionId)!;
    if (task.answerRule.kind !== 'bridge-total') throw new Error('Fixture needs the real Q1 bridge task.');
    const key = { encounterId: encounter.encounterId, learningEpisodeOrdinal: encounter.learningEpisode.ordinal };
    if (wrongFirst) {
      await controller.dispatch(controller.prepareCommand({ kind: 'SubmitCheck', profileId, payload: { ...key, checkSequence: 1, response: { kind: 'bridge', planks: [1] } } }));
      await controller.dispatch(controller.prepareCommand({ kind: 'RecordAssistance', profileId, payload: { encounterId: encounter.encounterId, assistanceKind: 'answer-hint', hintId: task.hints[0].id } }));
    }
    const target = task.answerRule.target, solution = [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])];
    return controller.dispatch(controller.prepareCommand({ kind: 'SubmitCheck', profileId, payload: { ...key, checkSequence: wrongFirst ? 2 : 1, response: { kind: 'bridge', planks: solution } } }));
  },
  async reload() { if (!controller) throw new Error('Reload proof requires real mode.'); controller.dispose(); await openReal(); backupActions = backupPort(); publish(); },
  now(value) { now = Date.parse(value); },
} satisfies AdultProfilesApi;
declare global { interface Window { adultProfiles: AdultProfilesApi } }
function Panel() {
  useSyncExternalStore(listener => { uiListeners.add(listener); return () => { uiListeners.delete(listener); }; }, () => revision);
  const [chooserVisible, setChooserVisible] = useState(true);
  const current = getSnapshot();
  return <>{chooserVisible && <ProfileChooser snapshot={current} selectedProfileId={selected} dispatch={dispatchPort()}
    onSelectProfile={profileId => { selections.push(profileId); /* shell owns publishing a permitted switch */ publish(); }} />}
    <AdultArea snapshot={current} selectedProfileId={selected} dispatch={dispatchPort()} backupActions={backupActions} preferenceController={preferenceController}
      {...(mode === 'frozen' && selected === 'a' ? { summaries: summary, todayDate: '2026-10-13' } : {})} onExit={() => setChooserVisible(true)} />
  </>;
}
document.getElementById('fixture-label')!.textContent = mode === 'frozen' ? 'Frozen-port UI fixture · finite acknowledgements are not state/backup integration evidence.' : 'Actual facade / IndexedDB fixture · local only.';
const mounted = mountPanel(document.getElementById('root')!, params.get('raw') === 'yes' ? <div className="adult-area"><BackupPanel backupActions={backupActions} saveStatus={{ token: null, profileNames: [], pending: false, failed: true }} /></div> : <Panel />);
window.addEventListener('pagehide', () => { mounted.unmount(); controller?.dispose(); listeners.clear(); uiListeners.clear(); if (mode === 'real') IDBObjectStore.prototype.put = nativePut; }, { once: true });
