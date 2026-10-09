import { useSyncExternalStore } from 'react';
import { mountPanel } from './host';
import { HallOfChampions } from '../../src/rewards/HallOfChampions';
import type { HallRefreshStatus } from '../../src/rewards/HallOfChampions';
import { PersonalHistory } from '../../src/rewards/PersonalHistory';
import { buildLeaderboardReadModel } from '../../src/rewards/standings';
import { localDateAt, weekKeyFor } from '../../src/rewards/calendar';
import type { LeaderboardReadModel } from '../../src/rewards/contracts';
import { createStateController } from '../../src/state/controller';
import { openSaveRepository } from '../../src/state/repository';
import type { SaveRepository } from '../../src/state/repository';
import { createInitialSave } from '../../src/state/transition';
import { validateSave } from '../../src/state/backup';
import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import type { CommitResult, CommittedSnapshot, StateCommand } from '../../src/state/contracts';
import type { RealHallApi } from './local-leaderboard-api';

/** Bounded real host: all writes use the accepted facade and native repository.
 * Presentation projects acknowledged snapshots; it never reconciles or awards. */
export function mountRealHall(container: HTMLElement, controls: HTMLElement): RealHallApi {
  const params = new URLSearchParams(location.search);
  const namespace = `learning-is-fun:/playtest/:hall-${params.get('namespace') ?? crypto.randomUUID()}`;
  const catalogue = listTasks();
  let now = Date.parse('2026-10-09T12:00:00Z'), observation: number | null = null, clocks = 0;
  let disposed = false, subscriptionActive = true, notifications = 0;
  let abortNext = false, holdNext = false, releaseHold: (() => void) | undefined;
  let lastRefresh: CommitResult | null = null, presentedSnapshot: CommittedSnapshot | null = null;
  let inFlight: Promise<CommitResult | null> | null = null;
  const events: unknown[] = [], listeners = new Set<() => void>();
  let view: { model: LeaderboardReadModel | null; status: HallRefreshStatus; open: boolean; profileId: string | null; message: string } =
    { model: null, status: 'loading', open: false, profileId: null, message: 'Loading the saved adventure.' };
  const publish = (next: Partial<typeof view>) => {
    if (disposed) return;
    view = { ...view, ...next }; for (const listener of listeners) listener();
  };
  const nativePut = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (...args: Parameters<IDBObjectStore['put']>) {
    const request = nativePut.apply(this, args);
    if (abortNext && this.transaction.db.name === `${namespace}:save`) {
      abortNext = false; events.push({ stage: 'native-abort-after-put', candidate: args[0] }); this.transaction.abort();
    }
    return request;
  };
  const real = openSaveRepository({ appNamespace: namespace, initialSave: createInitialSave(), validateSave, catalogue });
  const repository: SaveRepository = { ...real, async commitCommand(command, ports) {
    if (command.kind === 'ReconcileCalendar' && holdNext) {
      holdNext = false; events.push({ stage: 'held-calendar-write', expected: command.expected, nowEpochMs: ports.context.nowEpochMs });
      await new Promise<void>(resolve => { releaseHold = resolve; }); releaseHold = undefined;
    }
    const result = await real.commitCommand(command, ports);
    events.push({ stage: 'repository-acknowledgement', kind: command.kind, result });
    return result;
  } };
  const controller = createStateController({ repository, catalogue, questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1',
    clock: { nowEpochMs() { clocks++; return now; } }, preferenceGate: { applyLiveIntent() {} },
    readTransientReadiness: () => ({ dirty: false, pending: false, failed: false }) });
  const snapshot = () => { try { return controller.getSnapshot(); } catch { return null; } };
  const stopController = controller.subscribe(() => {
    notifications++;
    const next = snapshot();
    if (!inFlight && view.model && view.status === 'ready' && next && presentedSnapshot
      && (next.token.epoch !== presentedSnapshot.token.epoch || next.token.revision !== presentedSnapshot.token.revision)) {
      events.push({ stage: 'subscription-stale', token: next.token }); publish({ status: 'stale' });
    }
  });
  const ready = controller.ready.then(result => {
    publish({ message: result.status === 'new' || result.status === 'ready' ? 'Saved adventure loaded. Open the Hall to check its calendar.' : 'Saved results are unavailable. Your save has not been reset.' });
    return result;
  });
  function projectAcknowledged(result: Extract<CommitResult, { status: 'committed' | 'already-applied' }>) {
    const observedEpochMs = observation ?? now;
    const observedLocalDate = localDateAt(observedEpochMs), observedWeek = weekKeyFor(observedLocalDate);
    const activeWeek = result.snapshot.save.competition.latestOpenedWeek;
    events.push({ stage: 'presentation-observation', observedEpochMs, observedLocalDate, observedWeek, activeWeek, token: result.snapshot.token });
    if (activeWeek === null) { publish({ status: 'failed', message: 'The saved calendar is unavailable. Check again to load results.' }); return; }
    if (observedWeek > activeWeek) {
      publish({ status: 'stale', message: 'The presentation observed a later week. Check the calendar again; prior results are retained.' }); return;
    }
    const model = buildLeaderboardReadModel({ competition: result.snapshot.save.competition,
      profiles: Object.values(result.snapshot.save.profiles).map(profile => ({ ...profile.identity,
        lifetimePoints: profile.rewards.lifetimePoints, personalRecords: profile.personalRecords })),
      context: { observedLocalDate, activeWeek, clockRollback: observedWeek < activeWeek } });
    presentedSnapshot = result.snapshot;
    events.push({ stage: 'present-acknowledged-model', model, snapshot: result.snapshot });
    publish({ model, status: 'ready' });
  }
  function refreshHall(): Promise<CommitResult | null> {
    if (inFlight) return inFlight;
    if (disposed) return Promise.resolve(null);
    // Install the host pending guard before the facade can notify subscribers.
    const work = Promise.resolve().then(async () => {
      await ready;
      if (disposed) return null;
      events.push({ stage: 'hall-refresh-request', prior: view.model, snapshot: snapshot() });
      const result = await controller.refresh(); lastRefresh = result;
      events.push({ stage: 'hall-refresh-result', result });
      if (!disposed) {
        if (result.status === 'committed' || result.status === 'already-applied') projectAcknowledged(result);
        else publish({ status: result.status === 'conflict' ? 'stale' : 'failed', message: 'The calendar check did not confirm new results. Check again; prior results are retained.' });
      }
      return result;
    }).catch(error => {
      events.push({ stage: 'hall-refresh-error', message: String(error) }); publish({ status: 'failed', message: 'Saved results could not be checked. Try again.' }); return null;
    }).finally(() => { inFlight = null; });
    inFlight = work; publish({ status: view.model ? 'refreshing' : 'loading' }); return work;
  }
  function openHall() { publish({ open: true, profileId: null }); return refreshHall(); }
  function close() { publish({ open: false, profileId: null }); requestAnimationFrame(() => document.getElementById('real-open-hall')?.focus()); }
  function back() {
    const profileId = view.profileId; publish({ profileId: null });
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`.hall-player[data-profile="${profileId}"] button`)?.focus());
  }
  function Host() {
    const display = useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => view);
    if (!display.open) return <section className="hall"><h1>Real saved adventure</h1><p role="status">{display.message}</p>
      <button id="real-open-hall" className="hall-button" onClick={() => void openHall()}>Open Hall</button></section>;
    if (!display.model) return <section className="hall"><h1>Hall of Champions</h1><p role="status">{display.status === 'loading' ? 'Checking the saved calendar before showing results…' : display.message}</p>
      <button className="hall-button" disabled={display.status === 'loading'} onClick={() => void refreshHall()}>Check calendar</button>
      <button className="hall-button" onClick={close}>Back to adventure</button></section>;
    return display.profileId === null ? <HallOfChampions model={display.model} refreshStatus={display.status} onRefresh={() => void refreshHall()}
      onOpenHistory={profileId => publish({ profileId })} onClose={close} /> :
      <PersonalHistory profileId={display.profileId} model={display.model} onBack={back} />;
  }
  const panel = mountPanel(container, <Host />);
  controls.textContent = 'Real native IndexedDB Hall binding · controlled test clock';
  async function nativeRoot() {
    return new Promise<unknown>((resolve, reject) => {
      const request = indexedDB.open(`${namespace}:save`);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result, tx = db.transaction('records', 'readonly'), read = tx.objectStore('records').get('root');
        tx.oncomplete = () => { db.close(); resolve(read.result); };
        tx.onerror = () => { db.close(); reject(tx.error); };
      };
    });
  }
  const api: RealHallApi = { namespace, ready: () => ready, snapshot, model: () => view.model, status: () => view.status,
    lastRefresh: () => lastRefresh, open: openHall,
    async send(kind, payload, profileId) {
      await ready;
      const command = { kind, payload, actionId: crypto.randomUUID(), expected: controller.getSnapshot().token,
        ...(profileId ? { profileId } : {}) } as StateCommand;
      return controller.dispatch(command);
    },
    setNow(value) { now = Date.parse(value); }, setObservation(value) { observation = value === null ? null : Date.parse(value); },
    clockReads: () => clocks, events: () => events,
    abort: () => { abortNext = true; }, hold: () => { holdNext = true; }, held: () => !!releaseHold, release: () => releaseHold?.(), nativeRoot,
    lifecycle: () => ({ subscriptionActive, disposed, notifications }),
    teardown() {
      if (disposed) return;
      stopController(); subscriptionActive = false; disposed = true; releaseHold?.();
      panel.unmount(); controller.dispose(); listeners.clear();
      IDBObjectStore.prototype.put = nativePut;
    },
  };
  return api;
}
