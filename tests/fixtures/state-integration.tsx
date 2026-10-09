import { useState, useSyncExternalStore } from 'react';
import { mountPanel } from './host';
import { createStateController, selectCommittedActivity } from '../../src/state/controller';
import type { ComposedStateController } from '../../src/state/controller';
import { openSaveRepository } from '../../src/state/repository';
import type { SaveRepository } from '../../src/state/repository';
import { validateSave } from '../../src/state/backup';
import { createInitialSave } from '../../src/state/transition';
import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import type { CommitResult, CommittedSnapshot, StateCommand, TransientReadiness } from '../../src/state/contracts';
import type { StateIntegrationApi } from './state-integration-api';

const params = new URLSearchParams(location.search);
const namespace = `learning-is-fun:/playtest/:state-integration-${params.get('namespace') ?? crypto.randomUUID()}`;
const catalogue = listTasks();
let now = Date.parse('2026-10-09T12:00:00Z'), clocks = 0;
let currentReadiness: TransientReadiness = { dirty: false, pending: false, failed: false }, throwsReadiness = false;
let holdNext = false, releaseHold: (() => void) | undefined, abortNext = false;
const events: unknown[] = [], celebrations: unknown[] = [];
const nativePut = IDBObjectStore.prototype.put;
IDBObjectStore.prototype.put = function (...args: Parameters<IDBObjectStore['put']>) {
  const result = nativePut.apply(this, args);
  if (this.transaction.db.name === `${namespace}:save` && abortNext) {
    abortNext = false; events.push({ stage: 'abort-after-put', candidate: args[0], visible: availableSnapshot() }); this.transaction.abort();
  }
  return result;
};
let controller!: ComposedStateController;
function availableSnapshot(): CommittedSnapshot | null { try { return controller.getSnapshot(); } catch { return null; } }
function open() {
  const real = openSaveRepository({ appNamespace: namespace, initialSave: createInitialSave(), validateSave, catalogue });
  const repository: SaveRepository = { ...real, async commitCommand(command, ports) {
    if (holdNext) { holdNext = false; await new Promise<void>(resolve => { releaseHold = resolve; }); releaseHold = undefined; }
    return real.commitCommand(command, ports);
  } };
  controller = createStateController({ repository, catalogue, questBindings: params.get('missingBindings') === 'yes' ? [] : QUEST_ACTIVITY_BINDINGS, milestone: 'M1',
    clock: { nowEpochMs() { clocks++; return now; } }, preferenceGate: { applyLiveIntent(intent) { events.push({ stage: 'gate', intent }); } },
    readTransientReadiness() { if (throwsReadiness) throw new Error('fixture unavailable registration'); return currentReadiness; } });
  return controller;
}
async function nativeRoot() {
  return new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open(`${namespace}:save`);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { const db = request.result; const tx = db.transaction('records', 'readonly'); const read = tx.objectStore('records').get('root');
      tx.oncomplete = () => { db.close(); resolve(read.result); }; tx.onerror = () => { db.close(); reject(tx.error); }; };
  });
}
async function seedFuture() {
  if (params.get('future') !== 'yes') return;
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(`${namespace}:save`, 7);
    request.onupgradeneeded = () => request.result.createObjectStore('records');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { const db = request.result, tx = db.transaction('records', 'readwrite');
      tx.objectStore('records').put({ epoch: 'future-epoch', revision: 37, save: { schemaVersion: 9, contentVersion: 'future', unknown: ['keep', 'é🙂'] }, extra: { preserve: true } }, 'root');
      tx.oncomplete = () => { db.close(); resolve(); }; };
  });
}
function make(kind: StateCommand['kind'], payload: unknown, profileId?: string): StateCommand {
  return { kind, payload, actionId: crypto.randomUUID(), expected: controller.getSnapshot().token, ...(profileId ? { profileId } : {}) } as StateCommand;
}
async function dispatch(command: StateCommand): Promise<CommitResult> {
  const result = await controller.dispatch(command);
  events.push({ stage: 'acknowledged', kind: command.kind, actionId: command.actionId, result });
  if (result.status === 'committed' && command.kind === 'SubmitCheck') celebrations.push(result.changes);
  return result;
}
const api: StateIntegrationApi = {
  namespace, catalogue,
  controller: () => controller,
  snapshot: availableSnapshot,
  make, dispatch,
  send: (kind: StateCommand['kind'], payload: unknown, profileId?: string) => dispatch(make(kind, payload, profileId)),
  projection: (profileId: string, encounterId: string) => selectCommittedActivity(controller.getSnapshot(), catalogue, { profileId, encounterId }),
  setNow: (value: string) => { now = Date.parse(value); }, clockReads: () => clocks,
  events: () => events, celebrations: () => celebrations,
  readiness: (value: TransientReadiness, throwing = false) => { currentReadiness = value; throwsReadiness = throwing; },
  hold: () => { holdNext = true; }, held: () => !!releaseHold, release: () => releaseHold?.(),
  abort: () => { abortNext = true; }, nativeRoot,
  async reload() { controller.dispose(); open(); return controller.ready; },
  async rawRecovery() { const result = await controller.exportRawRecoveryData(); return result.status === 'available'
    ? { ...result, filename: 'learning-is-fun.recovery.json', label: 'Download raw recovery data — preserves stored data; not a compatible save backup.' } : result; },
  async sentinel() {
    const name = `${namespace}:unrelated`;
    await new Promise<void>((resolve, reject) => {
      const r = indexedDB.open(name, 1); r.onupgradeneeded = () => r.result.createObjectStore('sentinel'); r.onerror = () => reject(r.error);
      r.onsuccess = () => { const db = r.result, tx = db.transaction('sentinel', 'readwrite'); tx.objectStore('sentinel').put({ keep: 'unrelated' }, 'root');
        tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => { db.close(); reject(tx.error); }; };
    }); return name;
  },
  async readSentinel(name) {
    return new Promise<unknown>((resolve, reject) => {
      const r = indexedDB.open(name); r.onerror = () => reject(r.error);
      r.onsuccess = () => { const db = r.result, tx = db.transaction('sentinel', 'readonly'), read = tx.objectStore('sentinel').get('root');
        tx.oncomplete = () => { db.close(); resolve(read.result); }; tx.onerror = () => { db.close(); reject(tx.error); }; };
    });
  },
};
declare global { interface Window { stateIntegration: StateIntegrationApi } }

function Panel() {
  const [text, setText] = useState(''), [status, setStatus] = useState('loading');
  const load = useSyncExternalStore(controller.subscribe, controller.getLoadState);
  return <section><h1>State integration command host</h1><p>Local fixture. Commands use the real state controller and IndexedDB.</p>
    <p data-testid="load-state">{load.status}</p><label>Command JSON<textarea aria-label="Command JSON" value={text} onChange={e => setText(e.target.value)} /></label>
    <button onClick={() => { void (async () => { try {
      const intent = JSON.parse(text) as { kind: StateCommand['kind']; payload: unknown; profileId?: string };
      const result = await api.send(intent.kind, intent.payload, intent.profileId); setStatus(result.status);
    } catch { setStatus('invalid'); } })(); }}>Dispatch command</button>
    <output data-testid="command-status">{status}</output><pre data-testid="committed-state">{JSON.stringify(availableSnapshot())}</pre>
    {load.status === 'unsupported' || load.status === 'unreadable' || load.status === 'blocked' ? <>
      <p>Saved data could not be loaded. Download raw recovery data to preserve it; this is not a compatible save backup.</p>
      <button onClick={() => { void api.rawRecovery().then(result => {
        if (result.status !== 'available') { setStatus(result.message); return; }
        const url = URL.createObjectURL(new Blob([result.json], { type: 'application/json' }));
        const link = document.createElement('a'); link.href = url; link.download = result.filename; link.click(); URL.revokeObjectURL(url);
      }); }}>Download raw recovery data</button></> : null}
  </section>;
}
await seedFuture(); open(); window.stateIntegration = api;
const mounted = mountPanel(document.getElementById('root')!, <Panel />);
await controller.ready;
window.addEventListener('pagehide', () => { mounted.unmount(); controller.dispose(); IDBObjectStore.prototype.put = nativePut; }, { once: true });
