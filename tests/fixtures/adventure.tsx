import { StrictMode, useState, useSyncExternalStore } from 'react';
import { mountPanel } from './host';
import { AdventureView } from '../../src/experience/AdventureView';
import { createStateController } from '../../src/state/controller';
import { createInitialSave } from '../../src/state/transition';
import { openSaveRepository } from '../../src/state/repository';
import type { SaveRepository } from '../../src/state/repository';
import { validateSave } from '../../src/state/backup';
import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { createAudioController } from '../../src/audio/controller';
import { AudioControls } from '../../src/audio/AudioControls';
import { assetUrl } from '../../src/platform/assets';
import type { ActivePanelHost, ActivePanelLifecycle } from '../../src/app/panelLifecycle';
import type { AppView, NavigationPort } from '../../src/app/navigation';
import { HallOfChampions } from '../../src/rewards/HallOfChampions';
import type { HallRefreshStatus } from '../../src/rewards/HallOfChampions';
import { PersonalHistory } from '../../src/rewards/PersonalHistory';
import { buildLeaderboardReadModel } from '../../src/rewards/standings';
import type { LeaderboardReadModel } from '../../src/rewards/contracts';
import { localDateAt, weekKeyFor } from '../../src/rewards/calendar';
import type { AdventureEvent, AdventureFixtureApi } from './adventure-api';

const params = new URLSearchParams(location.search);
const namespace = `learning-is-fun:/playtest/:adventure-${params.get('namespace') ?? 'manual'}`;
const catalogue = listTasks(), events: AdventureEvent[] = [], listeners = new Set<() => void>();
let version = 0, selected = '', view: AppView = { kind: 'profiles' }, notice = '', switchPending = false;
let worldMount = 0, stateSubscriptions = 0;
let now = Date.parse('2026-10-09T12:00:00Z'), disposed = false, abortNext = false, holdNext = false, loseAcknowledgement = false;
let release: (() => void) | null = null, active: { token: symbol; panel: ActivePanelLifecycle; unsubscribe(): void } | null = null;
let hall: LeaderboardReadModel | null = null, hallStatus: HallRefreshStatus = 'loading', history: string | null = null;
let destination: (() => void) | null = null;
function publish() { version++; listeners.forEach(listener => listener()); }
const activePanelHost: ActivePanelHost = { register(panel) {
  const token = Symbol(); active?.unsubscribe();
  const unsubscribe = panel.subscribe(() => { if (active?.token === token) publish(); });
  active = { token, panel, unsubscribe }; events.push({ stage: 'register' }); publish();
  let registered = true;
  return () => { if (!registered) return; registered = false; unsubscribe();
    if (active?.token === token) { active = null; publish(); } events.push({ stage: 'unregister' }); };
} };
const audio = createAudioController({ assetResolver: assetUrl, persistPreferences: intent => controller.preferences.setAudioPreferences(intent) });
const nativePut = IDBObjectStore.prototype.put;
IDBObjectStore.prototype.put = function (...args: Parameters<IDBObjectStore['put']>) {
  const request = nativePut.apply(this, args);
  if (abortNext && this.transaction.db.name === `${namespace}:save`) { abortNext = false; events.push({ stage: 'native-abort' }); this.transaction.abort(); }
  return request;
};
const real = openSaveRepository({ appNamespace: namespace, initialSave: createInitialSave(), validateSave, catalogue });
const repository: SaveRepository = { ...real, async commitCommand(command, ports) {
  events.push({ stage: 'command', command });
  if (holdNext) { holdNext = false; events.push({ stage: 'held' }); await new Promise<void>(resolve => { release = resolve; }); release = null; }
  const result = await real.commitCommand(command, ports); events.push({ stage: 'result', command, result });
  if (loseAcknowledgement) { loseAcknowledgement = false; events.push({ stage: 'acknowledgement-lost' }); throw new Error('Fixture transport dropped the actual native acknowledgement'); }
  return result;
} };
const facade = createStateController({ repository, catalogue, questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1',
  clock: { nowEpochMs: () => now }, preferenceGate: audio,
  readTransientReadiness: () => active?.panel.getStatus() ?? { dirty: false, pending: switchPending, failed: false } });
const controller: typeof facade = { ...facade, subscribe(listener) {
  stateSubscriptions++; const unsubscribe = facade.subscribe(listener); let subscribed = true;
  return () => { if (subscribed) { subscribed = false; stateSubscriptions--; unsubscribe(); } };
} };
await controller.ready;
const unsubscribeState = controller.subscribe(publish);
const unsubscribePreferences = controller.preferences.subscribe(() => audio.applyPreferenceState(controller.preferences.getStatus()));
audio.applyPreferenceState(controller.preferences.getStatus());
function visibility() { audio.setVisible(!document.hidden); }
document.addEventListener('visibilitychange', visibility); visibility();
async function guard(next: () => void) {
  if (switchPending) return;
  destination = next; switchPending = true; publish();
  const result = active ? await active.panel.suspend() : { status: 'ready' };
  switchPending = false;
  if (result.status !== 'ready') { notice = 'The current player’s draft has not been saved. Retry or explicitly discard it.'; publish(); return; }
  destination = null; notice = ''; audio.stopReading(); next(); publish();
}
async function refreshHall() {
  hallStatus = hall ? 'refreshing' : 'loading'; publish();
  const result = await controller.refresh();
  if (result.status === 'committed' || result.status === 'already-applied') {
    const activeWeek = result.snapshot.save.competition.latestOpenedWeek;
    if (activeWeek) {
      const observedLocalDate = localDateAt(now);
      hall = buildLeaderboardReadModel({ competition: result.snapshot.save.competition,
        profiles: Object.values(result.snapshot.save.profiles).map(p => ({ ...p.identity, lifetimePoints: p.rewards.lifetimePoints, personalRecords: p.personalRecords })),
        context: { activeWeek, observedLocalDate, clockRollback: weekKeyFor(observedLocalDate) < activeWeek } });
      hallStatus = 'ready';
    } else hallStatus = 'failed';
  } else hallStatus = 'failed';
  publish();
}
const navigation: NavigationPort = { navigate(next) {
  events.push({ stage: 'navigation', detail: next.kind }); view = next; history = null;
  if (next.kind === 'leaderboard') void refreshHall(); publish();
} };
async function createProfile(nickname: string) {
  const command = controller.prepareCommand({ kind: 'CreateProfile', payload: { nickname, avatarId: 'pip' } });
  const result = await controller.dispatch(command);
  if (result.status === 'committed' && command.kind === 'CreateProfile') {
    selected = command.payload.newProfileId; view = { kind: 'world' }; notice = '';
  } else notice = `The player was not saved (${result.status}).`;
  publish();
}
function Fixture() {
  useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => version, () => version);
  const [nickname, setNickname] = useState('');
  const snapshot = controller.getSnapshot();
  return <><div className="fixture-tools"><p>Bounded M1 producer host · native IndexedDB · local evidence only · port 5194</p>
    <nav aria-label="Fixture player selection">{Object.values(snapshot.save.profiles).map(p => <button key={p.identity.profileId} disabled={switchPending}
      onClick={() => { void guard(() => { selected = p.identity.profileId; view = { kind: 'world' }; }); }}>Play as {p.identity.nickname}</button>)}
      <button disabled={switchPending} onClick={() => { void guard(() => { view = { kind: 'profiles' }; }); }}>Player chooser</button>
      {selected && <button onClick={() => controller.preferences.setProfilePreferences(selected, { motion: snapshot.save.profiles[selected]?.preferences.motion === 'reduced' ? 'system' : 'reduced' })}>Toggle reduced motion</button>}</nav>
    {notice && <div role="alert"><p>{notice}</p>{destination && <><button disabled={switchPending} onClick={() => { if (destination) void guard(destination); }}>Retry player change</button>
      <button disabled={switchPending} onClick={() => { const result = active?.panel.discardDraft(); if (result?.status === 'blocked') return;
        const next = destination; destination = null; notice = ''; next?.(); publish(); }}>Discard local draft and change player</button></>}</div>}</div>
    <div className="fixture-audio"><AudioControls controller={audio} /></div>
    {view.kind === 'profiles' ? <section className="fixture-players"><h1>Choose your adventurer</h1><p>Your adventures stay on this device.</p>
      {Object.values(snapshot.save.profiles).map(p => <button key={p.identity.profileId} onClick={() => { selected = p.identity.profileId; view = { kind: 'world' }; publish(); }}>Continue as {p.identity.nickname}</button>)}
      <form onSubmit={event => { event.preventDefault(); void createProfile(nickname); }}><label>New player name <input required maxLength={24} value={nickname} onChange={e => setNickname(e.target.value)} /></label><button>Create adventurer</button></form></section>
      : view.kind === 'leaderboard' ? hall ? history ? <PersonalHistory profileId={history} model={hall} onBack={() => { history = null; publish(); }} />
        : <HallOfChampions model={hall} refreshStatus={hallStatus} onRefresh={() => { void refreshHall(); }} onOpenHistory={id => { history = id; publish(); }} onClose={() => { view = { kind: 'world' }; publish(); }} />
        : <p role="status">{hallStatus === 'failed' ? 'The Hall could not load.' : 'Loading saved Hall results…'}<button onClick={() => { void refreshHall(); }}>Retry Hall</button></p>
        : <AdventureView key={worldMount} selectedProfileId={selected} activePanelHost={activePanelHost} stateController={controller} audioController={audio} navigation={navigation} assetResolver={assetUrl} />}
  </>;
}
const mounted = mountPanel(document.getElementById('root')!, <StrictMode><Fixture /></StrictMode>);
const api: AdventureFixtureApi = {
  snapshot: controller.getSnapshot, events: () => events,
  abortNext() { abortNext = true; }, holdNext() { holdNext = true; }, release() { release?.(); },
  loseNextAcknowledgement() { loseAcknowledgement = true; },
  redeliverLastCommand() {
    const last = events.filter(event => event.stage === 'command' && event.command.kind !== 'ReconcileCalendar').at(-1);
    if (!last || last.stage !== 'command') throw new Error('No captured command to redeliver');
    return controller.dispatch(last.command);
  },
  readiness: () => ({ facade: controller.getUpdateReadiness(), panel: active?.panel.getStatus() ?? null, stateSubscriptions }), flush: controller.flush,
  // Deliberately bypass normal leave only to exercise genuine disposal while an
  // already dispatched native command is pending. No save/progress is patched.
  remountWorld() { worldMount++; publish(); },
  setClock(iso) { const date = Date.parse(iso); if (!Number.isFinite(date)) throw new Error('Invalid test date'); now = date; },
  async externalRename(nickname) {
    const external = createStateController({ repository: openSaveRepository({ appNamespace: namespace, initialSave: createInitialSave(), validateSave, catalogue }),
      catalogue, questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1', clock: { nowEpochMs: () => now }, preferenceGate: { applyLiveIntent() {} },
      readTransientReadiness: () => ({ dirty: false, pending: false, failed: false }) });
    await external.ready;
    try { return await external.dispatch(external.prepareCommand({ kind: 'RenameProfile', profileId: selected, payload: { nickname } })); }
    finally { external.dispose(); }
  },
  async close() {
    if (disposed) return; disposed = true; release?.(); mounted.unmount(); unsubscribeState(); unsubscribePreferences();
    document.removeEventListener('visibilitychange', visibility); audio.dispose(); controller.dispose(); IDBObjectStore.prototype.put = nativePut;
  },
};
(window as unknown as { adventureFixture: AdventureFixtureApi }).adventureFixture = api;
addEventListener('pagehide', () => { void api.close(); }, { once: true });
