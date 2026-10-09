import { useSyncExternalStore } from 'react';
import { mountPanel } from './host';
import { CompanionView } from '../../src/experience/CompanionView';
import { CreativePlot } from '../../src/experience/CreativePlot';
import type { CreativeSaveStatus } from '../../src/experience/CreativePlot';
import { CREATIVE_CHOICES } from '../../src/experience/catalogue';
import type { CreativeChoice } from '../../src/experience/types';
import { createStateController, selectCommittedActivity } from '../../src/state/controller';
import { openSaveRepository } from '../../src/state/repository';
import type { SaveRepository } from '../../src/state/repository';
import { validateSave } from '../../src/state/backup';
import { createInitialSave } from '../../src/state/transition';
import type { StateCommand, CommittedSnapshot } from '../../src/state/contracts';
import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { createAudioController } from '../../src/audio/controller';
import { createSpeechAdapter } from '../../src/audio/speech';
import { AudioControls } from '../../src/audio/AudioControls';
import { assetUrl } from '../../src/platform/assets';
import type { CreativeFixtureApi } from './creative-api';

const params = new URLSearchParams(location.search);
const namespace = `learning-is-fun:/playtest/:creative-${params.get('namespace') ?? crypto.randomUUID()}`;
const catalogue = listTasks();
const events: Array<CreativeFixtureApi['events'] extends () => readonly (infer E)[] ? E : never> = [];
const listeners = new Set<() => void>();
let version = 0, selected = '', selectionGeneration = 0, pending = false, helpPending = false;
let saveStatus: CreativeSaveStatus = 'idle', helpStatus = '', celebrationCount = 0, celebrating = false;
let retainedSave: StateCommand | null = null, retainedHelp: StateCommand | null = null;
let holdNext = false, release: (() => void) | null = null, abortNext = false;
const encounters = new Map<string, string>();
const publish = () => { version++; listeners.forEach(listener => listener()); };
const synthesis = { getVoices: () => [{ name: 'Simulated local English', lang: 'en-GB', localService: true }],
  addEventListener() {}, removeEventListener() {}, cancel() {},
  speak(utterance: SpeechSynthesisUtterance) { events.push({ stage: 'simulated-speech', text: utterance.text, profileId: selected }); },
};
const audio = createAudioController({ assetResolver: assetUrl,
  speechAdapter: params.get('speech') === 'fake' ? createSpeechAdapter({ synthesis: synthesis as unknown as SpeechSynthesis,
    createUtterance: text => ({ text } as SpeechSynthesisUtterance) }) : createSpeechAdapter(),
  persistPreferences: intent => controller.preferences.setAudioPreferences(intent) });
const nativePut = IDBObjectStore.prototype.put;
IDBObjectStore.prototype.put = function (...args: Parameters<IDBObjectStore['put']>) {
  const request = nativePut.apply(this, args);
  if (this.transaction.db.name === `${namespace}:save` && abortNext) {
    abortNext = false; events.push({ stage: 'native-abort' }); this.transaction.abort();
  }
  return request;
};
const real = openSaveRepository({ appNamespace: namespace, initialSave: createInitialSave(), validateSave, catalogue });
const repository: SaveRepository = { ...real, async commitCommand(command, ports) {
  events.push({ stage: 'repository-command', kind: command.kind, command, profileId: command.profileId });
  if (holdNext) { holdNext = false; await new Promise<void>(resolve => { release = resolve; }); release = null; }
  const result = await real.commitCommand(command, ports);
  events.push({ stage: 'repository-result', kind: command.kind, status: result.status, profileId: command.profileId });
  return result;
} };
const controller = createStateController({ repository, catalogue, questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1',
  clock: { nowEpochMs: () => Date.parse('2026-10-09T12:00:00Z') }, preferenceGate: audio,
  readTransientReadiness: () => ({ dirty: !!document.querySelector('.creative-preview-label')?.textContent?.includes('Your preview'),
    pending: pending || helpPending, failed: saveStatus === 'save-failed' }) });
await controller.ready;
const unsubscribeState = controller.subscribe(publish);
const unsubscribePreferences = controller.preferences.subscribe(() => audio.applyPreferenceState(controller.preferences.getStatus()));
audio.applyPreferenceState(controller.preferences.getStatus());
function visibility() { audio.setVisible(!document.hidden); }
document.addEventListener('visibilitychange', visibility); visibility();
const scope = () => `${selected}:${controller.getSnapshot().token.epoch}:${selectionGeneration}`;
function projection() {
  const id = encounters.get(selected);
  return id ? selectCommittedActivity(controller.getSnapshot(), catalogue, { profileId: selected, encounterId: id }) : null;
}
function select(profileId: string) {
  if (!Object.hasOwn(controller.getSnapshot().save.profiles, profileId)) throw new Error('Choose a committed profile.');
  selected = profileId; selectionGeneration++; audio.stopReading(); pending = false; helpPending = false;
  saveStatus = 'idle'; helpStatus = ''; celebrating = false; retainedSave = null; retainedHelp = null; publish();
}
async function createProfile(nickname: string) {
  const command = controller.prepareCommand({ kind: 'CreateProfile', payload: { nickname, avatarId: 'pip' } });
  if (command.kind !== 'CreateProfile') throw new Error('Wrong profile command.');
  const result = await controller.dispatch(command);
  if (result.status !== 'committed') throw new Error(`Profile: ${result.status}`);
  return command.payload.newProfileId;
}
async function save(choice: CreativeChoice) {
  if (pending) return;
  const capturedScope = scope(), profileId = selected;
  const command = retainedSave?.kind === 'ChooseCosmetic' && JSON.stringify(retainedSave.payload.choice) === JSON.stringify(choice)
    ? retainedSave : controller.prepareCommand({ kind: 'ChooseCosmetic', profileId, payload: { choice } });
  retainedSave = command; pending = true; celebrating = false; publish();
  const result = await controller.dispatch(command);
  if (scope() !== capturedScope) { events.push({ stage: 'old-scope-save-ignored', profileId }); return; }
  pending = false; saveStatus = result.status;
  if (result.status === 'conflict') retainedSave = null; // Next explicit Save captures the refreshed token.
  if (result.status === 'committed' || result.status === 'already-applied') {
    retainedSave = null;
    if (result.status === 'committed') { celebrating = true; celebrationCount++; }
  }
  events.push({ stage: 'save-ui-ack', status: result.status, profileId }); publish();
}
async function hint() {
  if (helpPending) return;
  const projected = projection();
  if (projected?.status !== 'ready') { helpStatus = 'Choose an activity before asking for a hint.'; publish(); return; }
  const hintText = projected.activity.task.hints.find(h => !projected.activity.revealedAssistanceIds.includes(h.id));
  if (!hintText) { helpStatus = 'All of Pip’s hints for this activity are on screen.'; publish(); return; }
  const capturedScope = scope(), profileId = selected;
  const command = retainedHelp ?? controller.prepareCommand({ kind: 'RecordAssistance', profileId,
    payload: { encounterId: projected.activity.encounterId, assistanceKind: 'answer-hint', hintId: hintText.id } });
  retainedHelp = command; helpPending = true; helpStatus = 'Pip is getting your hint ready…'; publish();
  const result = await controller.dispatch(command);
  if (scope() !== capturedScope) { events.push({ stage: 'old-scope-help-ignored', profileId }); return; }
  helpPending = false;
  if (result.status === 'committed' || result.status === 'already-applied') { retainedHelp = null; helpStatus = ''; }
  else { if (result.status === 'conflict') retainedHelp = null; helpStatus = 'Your hint was not saved. Ask Pip again to retry.'; }
  events.push({ stage: 'help-ui-ack', status: result.status, profileId }); publish();
}
function guidance() {
  const projected = projection();
  if (projected?.status !== 'ready') return { text: catalogue.find(task => task.skillId === 'M01')!.instructionText, role: 'instruction' as const };
  const { task, revealedAssistanceIds } = projected.activity;
  const revealed = task.hints.filter(h => revealedAssistanceIds.includes(h.id));
  return revealed.length ? { text: revealed.map(h => h.text).join('\n\n'), role: 'answer-help' as const }
    : { text: task.instructionText, role: 'instruction' as const };
}
async function openHelp() {
  const profileId = selected;
  const result = await controller.dispatch(controller.prepareCommand({ kind: 'OpenEncounter', profileId,
    payload: { route: { kind: 'practice', skillId: 'M01', mode: 'suggested' }, suppressDueReviewForVisit: true } }));
  if (result.status !== 'committed' && result.status !== 'already-applied') throw new Error(`Open: ${result.status}`);
  const encounter = Object.values(controller.getSnapshot().save.profiles[profileId].encounters).find(e => e.learningEpisode.status === 'open');
  if (!encounter) throw new Error('No selected open encounter.');
  encounters.set(profileId, encounter.encounterId); audio.stopReading(); if (selected === profileId) publish();
}
async function completeQuest(questId: 'Q1' | 'Q2' | 'Q3') {
  const profileId = selected;
  const opened = await controller.dispatch(controller.prepareCommand({ kind: 'OpenEncounter', profileId,
    payload: { route: { kind: 'quest', questId }, suppressDueReviewForVisit: true } }));
  if (opened.status !== 'committed') throw new Error(`Quest open: ${opened.status}`);
  const encounter = Object.values(controller.getSnapshot().save.profiles[profileId].encounters).find(e => e.bindingProvenance?.questId === questId && e.learningEpisode.status === 'open');
  if (!encounter) throw new Error('No quest encounter.');
  const task = catalogue.find(t => t.canonicalQuestionId === encounter.canonicalQuestionId)!;
  // Bounded test oracle only, never exposed as game guidance or a product evaluator.
  const rule = task.answerRule;
  const response = rule.kind === 'accepted-responses' ? rule.responses[0] : rule.kind === 'merchant-constraints'
    ? { kind: 'merchant' as const, pears: rule.total / (rule.multiplier + 1), apples: rule.total * rule.multiplier / (rule.multiplier + 1) }
    : { kind: 'bridge' as const, planks: [...Array(Math.floor(rule.target / 6)).fill(6), ...(rule.target % 6 ? [rule.target % 6] : [])] };
  const checked = await controller.dispatch(controller.prepareCommand({ kind: 'SubmitCheck', profileId,
    payload: { encounterId: encounter.encounterId, learningEpisodeOrdinal: encounter.learningEpisode.ordinal,
      checkSequence: encounter.validChecks + 1, response } }));
  if (checked.status !== 'committed') throw new Error(`Quest Check: ${checked.status}`);
  await controller.dispatch(controller.prepareCommand({ kind: 'FinishPractice', profileId,
    payload: { encounterId: encounter.encounterId, learningEpisodeOrdinal: encounter.learningEpisode.ordinal } }));
  publish();
}
async function nativeRoot(): Promise<unknown> {
  return new Promise((resolve, reject) => { const request = indexedDB.open(`${namespace}:save`);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { const db = request.result, tx = db.transaction('records', 'readonly'), read = tx.objectStore('records').get('root');
      tx.oncomplete = () => { db.close(); resolve(read.result); }; tx.onabort = () => { db.close(); reject(tx.error); }; };
  });
}
let tornDown = false;
function teardown() {
  if (tornDown) return; tornDown = true; mounted.unmount(); unsubscribeState(); unsubscribePreferences();
  document.removeEventListener('visibilitychange', visibility); audio.dispose(); controller.dispose(); IDBObjectStore.prototype.put = nativePut;
}
const api: CreativeFixtureApi = { namespace, snapshot: controller.getSnapshot, selected: () => selected, select, createProfile, completeQuest, openHelp, projection,
  send: controller.dispatch, events: () => events, celebrations: () => celebrationCount,
  hold() { holdNext = true; }, held: () => !!release, release() { release?.(); }, abort() { abortNext = true; }, nativeRoot,
  async settle() { await controller.flush(); },
  async cleanup() { teardown(); await new Promise<void>((resolve, reject) => { const request = indexedDB.deleteDatabase(`${namespace}:save`);
    request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); request.onblocked = () => reject(new Error('Close sibling creative tabs first.')); }); },
};
declare global { interface Window { creativeFixture: CreativeFixtureApi } }
window.creativeFixture = api;
const ids = Object.keys(controller.getSnapshot().save.profiles);
selected = ids[0] ?? await createProfile('Robin');
const second = ids[1] ?? await createProfile('Juniper');
void second;
function Panel() {
  useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => version);
  const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot);
  const audioStatus = useSyncExternalStore(audio.subscribe, audio.getSnapshot);
  const profile = snapshot.save.profiles[selected];
  if (!profile) return <main><p>The selected explorer is no longer in this save. Choose a committed explorer to continue.</p><AudioControls controller={audio} /></main>;
  const q3 = profile.world.completedQuestIds.includes('Q3');
  const approved = guidance();
  return <main style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 16px 48px', font: '18px/1.55 system-ui', color: '#243f38' }}>
    <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 20 }}>
      <p style={{ margin: 0 }}>LOCAL CREATIVE FIXTURE · {params.get('speech') === 'fake' ? 'Simulated local speech' : 'Device speech'}</p>
      <label>Explorer <select aria-label="Explorer" value={selected} onChange={event => select(event.target.value)} style={{ font: 'inherit', minHeight: 48, marginLeft: 8 }}>
        {Object.values(snapshot.save.profiles).map(p => <option value={p.identity.profileId} key={p.identity.profileId}>{p.identity.nickname}</option>)}
      </select></label><AudioControls controller={audio} />
    </header>
    <CreativePlot key={`${selected}:${snapshot.token.epoch}:${selectionGeneration}`} saved={profile.creative}
      availableChoices={{ ...CREATIVE_CHOICES, flowerColours: q3 ? CREATIVE_CHOICES.flowerColours : [],
        decorations: q3 ? CREATIVE_CHOICES.decorations.filter(o => o.milestone === 'M1') : [],
        cosmetics: CREATIVE_CHOICES.cosmetics.filter(o => o.milestone === 'M1' && o.requiresAll.every(id => profile.world.completedQuestIds.includes(id))) }}
      entitlements={profile.rewards.entitlementIds} pending={pending} saveStatus={saveStatus}
      onSave={choice => { void save(choice); }} onCancel={() => { retainedSave = null; saveStatus = 'idle'; celebrating = false; publish(); }} />
    <CompanionView pose={celebrating ? 'celebration' : approved.role === 'answer-help' ? 'help' : 'idle'} visibleGuidance={approved.text}
      nextActivityLabel="Choose my next activity" onChooseNext={() => { void openHelp(); }} onRequestHint={() => { void hint(); }} audioStatus={audioStatus}
      onRead={() => { const current = guidance(); audio.readText({ requestId: crypto.randomUUID(), text: current.text, role: current.role, language: 'en' }); }} onStopReading={audio.stopReading} />
    <p role="status" data-testid="help-status">{helpStatus}</p>
    <p data-testid="points">Lifetime points: {profile.rewards.lifetimePoints}</p>
  </main>;
}
document.body.style.margin = '0'; document.body.style.background = '#e9eee1';
const mounted = mountPanel(document.getElementById('root')!, <Panel />);
window.addEventListener('pagehide', teardown, { once: true });
