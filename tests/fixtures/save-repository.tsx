import { mountPanel } from './host';
import type { RepositoryFixture } from './save-repository-api';
import { APP_NAMESPACE } from '../../src/platform/appIdentity';
import { openSaveRepository } from '../../src/state/repository';
import type { SaveRepository, RepositoryInvalidation } from '../../src/state/repository';
import { INITIAL_AUDIO_PREFERENCES } from '../../src/state/contracts';
import type { CommittedSnapshot, ReduceCommand, SaveDataV1, SaveToken, StateCommand, StoredRoot, TransitionContext, ValidateSave } from '../../src/state/contracts';

const fixtureSave: SaveDataV1 = {
  schemaVersion: 1, contentVersion: 'fixture-initial', rewardPolicyVersion: 'fixture-policy',
  installation: { timezone: 'Europe/London', audio: INITIAL_AUDIO_PREFERENCES }, profiles: {},
  competition: { timezone: 'Europe/London', latestOpenedWeek: null, currentScores: {}, currentSlots: {}, archives: [], policyVersion: 'fixture-policy' },
};
const context: TransitionContext = { nowEpochMs: 0, catalogue: [], questBindings: [], milestone: 'M1', allocatedIds: {} };
const changes = { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0, consumedSlot: null, newReceiptKeys: [], newEntitlementIds: [] }, unlockedIds: [], restorationIds: [], closedWeekIds: [] } as const;
let validatorMode = 'valid';
let validationCalls = 0;
let reduceCalls = 0;
let lastReadStore: IDBObjectStore | undefined;
function queuePartialRootAndThrow() {
  const partial = { epoch: 'partial-must-abort', revision: 999, save: { ...fixtureSave, contentVersion: 'partial-must-abort' } };
  lastReadStore!.put(partial, 'root');
  throw new Error('Fixture port exception after queuing a partial root in the active transaction');
}
const validate: ValidateSave = candidate => {
  validationCalls++;
  if (validatorMode === 'throw-always') throw new Error('Recovery must not call the validator.');
  const save = candidate as SaveDataV1;
  if (!save || save.schemaVersion !== 1) return { status: 'unsupported', issues: [{ path: 'schemaVersion', code: 'unsupported-schema', message: 'Fixture unsupported schema.' }] };
  if (save.contentVersion === 'future-content') return { status: 'unsupported', issues: [{ path: 'contentVersion', code: 'unsupported-content', message: 'Fixture unsupported content.' }] };
  if (save.rewardPolicyVersion === 'future-policy') return { status: 'unsupported', issues: [{ path: 'rewardPolicyVersion', code: 'unsupported-policy', message: 'Fixture unsupported policy.' }] };
  if (validatorMode === 'queue-and-throw' && save.contentVersion !== 'fixture-initial') queuePartialRootAndThrow();
  if (validatorMode === 'async-next' && save.contentVersion !== 'fixture-initial') return Promise.resolve({ status: 'valid', save }) as never;
  if (validatorMode === 'throw-next' && save.contentVersion !== 'fixture-initial') throw new Error('Fixture validator exception');
  if (validatorMode === 'invalid-next' && save.contentVersion !== 'fixture-initial') return { status: 'invalid', issues: [{ path: 'contentVersion', code: 'invalid-save', message: 'Fixture invalid proposed save.' }] };
  const decoded = structuredClone(save);
  if (validatorMode === 'shallow-save') Object.freeze(decoded);
  if (validatorMode === 'shallow-nested') Object.freeze(decoded.installation);
  return { status: 'valid', save: decoded };
};
const reduce: ReduceCommand = (root, command) => {
  reduceCalls++;
  if (command.actionId === 'reducer-queued-throw') queuePartialRootAndThrow();
  if (command.actionId === 'throw') throw new Error('Fixture reducer exception');
  if (command.actionId === 'async') return Promise.resolve({ status: 'changed', save: root.save, changes }) as never;
  return { status: 'changed', save: { ...root.save, contentVersion: command.actionId }, changes };
};
let repository: SaveRepository | undefined;
let namespace = APP_NAMESPACE;
let signals: RepositoryInvalidation[] = [];
let observed: Array<{ value: unknown; duringCompletion: boolean }> = [];
let completed = true;
let releaseUpgrade: (() => Promise<void>) | undefined;
let recoveryAudit: Array<{ kind: string; databaseName: string; requestedVersion?: number;
  mode?: string; oldVersion?: number; newVersion?: number | null }> = [];
const connectionIds = new WeakMap<IDBDatabase, number>();
let connectionSequence = 0, requestSequence = 0;
let lifecycleAudit: Array<{ event: string; requestId?: number; version?: number; connectionId?: number; requestedVersion?: number }> = [];
function connectionId(database: IDBDatabase) {
  if (!connectionIds.has(database)) connectionIds.set(database, ++connectionSequence);
  return connectionIds.get(database)!;
}
const nativeClose = IDBDatabase.prototype.close;
IDBDatabase.prototype.close = function() {
  lifecycleAudit.push({ event: 'close', connectionId: connectionId(this), version: this.version });
  return nativeClose.call(this);
};
if (typeof BroadcastChannel !== 'undefined') {
  const nativeBroadcast = BroadcastChannel.prototype.postMessage;
  BroadcastChannel.prototype.postMessage = function(message: unknown) {
    recoveryAudit.push({ kind: 'broadcast', databaseName: this.name });
    return nativeBroadcast.call(this, message);
  };
}
const nativeOpen = IDBFactory.prototype.open;
IDBFactory.prototype.open = function(name: string, version?: number) {
  const requestId = ++requestSequence;
  lifecycleAudit.push({ event: 'request', requestId, requestedVersion: version });
  recoveryAudit.push({ kind: 'open', databaseName: name, requestedVersion: version });
  const request = nativeOpen.call(this, name, version);
  request.addEventListener('success', () => {
    lifecycleAudit.push({ event: 'success', requestId, connectionId: connectionId(request.result), version: request.result.version });
  });
  request.addEventListener('upgradeneeded', event => {
    recoveryAudit.push({ kind: 'upgrade', databaseName: name, oldVersion: event.oldVersion, newVersion: event.newVersion });
  });
  return request;
};
const nativePut = IDBObjectStore.prototype.put;
const nativeGet = IDBObjectStore.prototype.get;
let failRecoveryRead = false;
const nativeTransaction = IDBDatabase.prototype.transaction;
// Observe completion before idb registers its tx.done listener. Browsers may
// run promise microtasks between event listeners; a later observer would falsely
// label the already-completed transaction's acknowledgement as premature.
IDBDatabase.prototype.transaction = function(...args: Parameters<IDBDatabase['transaction']>) {
  const tx = nativeTransaction.apply(this, args);
  recoveryAudit.push({ kind: 'transaction', databaseName: this.name, mode: tx.mode });
  tx.addEventListener('complete', () => { completed = true; });
  tx.addEventListener('abort', () => { completed = true; });
  return tx;
};
IDBObjectStore.prototype.get = function(key: IDBValidKey | IDBKeyRange) {
  if (this.name === 'records' && key === 'root') lastReadStore = this;
  if (failRecoveryRead && this.name === 'records' && key === 'root') {
    failRecoveryRead = false;
    throw new DOMException('Fixture forced unreadable request.', 'UnknownError');
  }
  return nativeGet.call(this, key);
};
let putFault: 'none' | 'abort' | 'throw-after-put' | 'uncloneable' = 'none';
IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
  recoveryAudit.push({ kind: 'put', databaseName: this.transaction.db.name });
  if (this.name !== 'records' || key !== 'root') return nativePut.call(this, value, key);
  const fault = putFault;
  putFault = 'none';
  completed = false;
  this.transaction.addEventListener('complete', () => { completed = true; });
  this.transaction.addEventListener('abort', () => { completed = true; });
  if (fault === 'none') return nativePut.call(this, value, key);
  if (fault === 'uncloneable') return nativePut.call(this, { ...(value as object), uncloneable: () => {} }, key);
  const request = nativePut.call(this, value, key);
  if (fault === 'abort') this.transaction.abort();
  if (fault === 'throw-after-put') throw new Error('Fixture exception after a real root put was queued');
  return request;
};
function rawOpen(name: string, version?: number): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(`${name}:save`, version);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function rawRead(): Promise<StoredRoot | undefined> {
  const db = await rawOpen(namespace);
  const tx = db.transaction('records', 'readonly');
  const value = await new Promise<StoredRoot | undefined>((resolve, reject) => {
    const request = tx.objectStore('records').get('root');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return value;
}
const command = (expected: SaveToken, actionId: string): StateCommand => ({ kind: 'ReconcileCalendar', actionId, expected, payload: {} });
const api: RepositoryFixture = {
  namespace: APP_NAMESPACE,
  async open(suffix: string, missingChannel = false, frozenParent?: 'save' | 'nested') {
    repository?.close();
    namespace = `${APP_NAMESPACE}:repository-${suffix}`;
    signals = []; observed = []; reduceCalls = 0;
    validatorMode = frozenParent ? `shallow-${frozenParent}` : 'valid';
    const previous = globalThis.BroadcastChannel;
    if (missingChannel) globalThis.BroadcastChannel = undefined as never;
    const initialSave = frozenParent ? { ...fixtureSave,
      contentVersion: 'independent-initial', rewardPolicyVersion: 'independent-policy',
      competition: { ...fixtureSave.competition, policyVersion: 'independent-policy' },
    } : fixtureSave;
    try { repository = openSaveRepository({ appNamespace: namespace, initialSave, validateSave: validate }); }
    finally { globalThis.BroadcastChannel = previous; }
    repository.subscribeInvalidation(signal => { signals.push(signal); observed.push({ value: signal, duringCompletion: !completed }); });
    return repository.loadRoot();
  },
  load: () => repository!.loadRoot(),
  snapshot: () => repository!.readExportSnapshot(),
  rawRead,
  commit(expected: SaveToken, actionId: string, duplicate = false) {
    return repository!.commitCommand(command(expected, actionId), { reduce, context,
      recognizeDuplicate: duplicate ? (root, input) => root.save.rewardPolicyVersion === `receipt:${input.actionId}` : undefined });
  },
  receipt(expected: SaveToken, actionId: string) {
    return repository!.commitCommand(command(expected, actionId), { context, reduce: root => ({
      status: 'changed', save: { ...root.save, contentVersion: actionId, rewardPolicyVersion: `receipt:${actionId}` }, changes,
    }) });
  },
  replace(expected: SaveToken, epoch: string, label: string) {
    return repository!.replaceSave({ expected, replacementEpoch: epoch, validatedSave: { ...fixtureSave, contentVersion: label } });
  },
  fault(mode: typeof putFault) { putFault = mode; },
  validator(mode: string) { validatorMode = mode; },
  signals: () => signals,
  observations: () => observed,
  reduceCalls: () => reduceCalls,
  silence: () => repository!.notifySilence(),
  close: () => repository!.close(),
  async seed(value: StoredRoot | null, kind = 'root') {
    repository?.close();
    const db = await rawOpen(namespace);
    const tx = db.transaction('records', 'readwrite');
    if (kind === 'root') { if (value === null) tx.objectStore('records').delete('root'); else tx.objectStore('records').put(value, 'root'); }
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    db.close();
  },
  async sentinel() {
    const request = indexedDB.open(`${APP_NAMESPACE}:unrelated-sentinel`, 1);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onupgradeneeded = () => request.result.createObjectStore('sentinel');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const tx = db.transaction('sentinel', 'readwrite');
    tx.objectStore('sentinel').put({ marker: 'untouched' }, 'root');
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    db.close();
  },
  async readSentinel() {
    const request = indexedDB.open(`${APP_NAMESPACE}:unrelated-sentinel`);
    const db = await new Promise<IDBDatabase>(resolve => { request.onsuccess = () => resolve(request.result); });
    const requestRead = db.transaction('sentinel').objectStore('sentinel').get('root');
    const value = await new Promise<unknown>(resolve => { requestRead.onsuccess = () => resolve(requestRead.result); });
    db.close(); return value;
  },
  async upgrade() {
    const db = await rawOpen(namespace, 2);
    db.close();
  },
  async blockUpgrade() {
    const held = await rawOpen(namespace);
    const request = indexedDB.open(`${namespace}:save`, 2);
    const finished = new Promise<void>((resolve, reject) => {
      request.onsuccess = () => { request.result.close(); resolve(); };
      request.onerror = () => reject(request.error);
    });
    releaseUpgrade = async () => { held.close(); await finished; };
    return new Promise<string>(resolve => { request.onblocked = () => resolve('genuine blocked upgrade'); });
  },
  releaseUpgrade: () => releaseUpgrade!(),
  destructiveCommand(expected: SaveToken, kind: 'ResetSave' | 'ReplaceSave') {
    const input: StateCommand = kind === 'ResetSave'
      ? { actionId: 'reset', expected, kind, payload: {} }
      : { actionId: 'replace', expected, kind, payload: { preparedImportId: 'fixture' } };
    return repository!.commitCommand(input, { reduce, context });
  },
  expired(expected: SaveToken) {
    return repository!.commitCommand(command(expected, 'expired'), { context, recognizeDuplicate: () => false,
      reduce: () => ({ status: 'invalid', reason: { code: 'encounter-expired', message: 'Fixture retained receipt expired.' } }) });
  },
  invalidReplacement(expected: SaveToken) {
    return repository!.replaceSave({ expected, replacementEpoch: crypto.randomUUID(),
      validatedSave: { ...fixtureSave, schemaVersion: 2 } as never });
  },
  async unknownStore(suffix: string) {
    repository?.close();
    namespace = `${APP_NAMESPACE}:repository-${suffix}`;
    const request = indexedDB.open(`${namespace}:save`, 1);
    const db = await new Promise<IDBDatabase>(resolve => {
      request.onupgradeneeded = () => request.result.createObjectStore('unknown');
      request.onsuccess = () => resolve(request.result);
    });
    db.close();
  },
  validationCalls: () => validationCalls,
  prepareRecovery(suffix: string) {
    repository?.close();
    namespace = `${APP_NAMESPACE}:repository-${suffix}`;
    signals = []; observed = []; validationCalls = 0; validatorMode = 'valid';
    repository = openSaveRepository({ appNamespace: namespace, initialSave: fixtureSave, validateSave: validate });
    repository.subscribeInvalidation(signal => signals.push(signal));
  },
  async recoveryProbe() {
    const validations = validationCalls;
    const signalCount = signals.length;
    recoveryAudit = [];
    const result = await repository!.readRecoveryExport();
    return { result, validationDelta: validationCalls - validations, signalsDelta: signals.length - signalCount,
      audit: structuredClone(recoveryAudit) };
  },
  async hasDatabase() {
    return (await indexedDB.databases()).some(database => database.name === `${namespace}:save`);
  },
  failRecoveryRead() { failRecoveryRead = true; },
  async queuedRecovery(suffix: string, mode: 'original' | 'close' | 'timeout') {
    const rootBefore = { epoch: 'blocked-token', revision: 58,
      save: { schemaVersion: 7, calendar: { futureWeek: '3099-11-02' } }, unknown: 'keep' };
    await api.seedUnknown(suffix, rootBefore, 3);
    const held = await rawOpen(namespace);
    const upgrade = indexedDB.open(`${namespace}:save`, 4);
    const upgraded = new Promise<void>((resolve, reject) => {
      upgrade.onsuccess = () => { upgrade.result.close(); resolve(); };
      upgrade.onerror = () => reject(upgrade.error);
    });
    await new Promise<void>(resolve => { upgrade.onblocked = () => resolve(); });
    api.prepareRecovery(suffix);
    api.validator('throw-always');
    lifecycleAudit = [];
    const began = performance.now();
    let settled = false, settlementMs = 0, closeAt: number | undefined, closeSettlementMs: number | null = null;
    let outcome: Awaited<ReturnType<typeof api.recoveryProbe>> | undefined;
    const pending = api.recoveryProbe().then(result => {
      outcome = result; settled = true; settlementMs = performance.now() - began;
      if (closeAt !== undefined) closeSettlementMs = performance.now() - closeAt;
      return result;
    });
    let queuedSettled = false;
    let queuedResult: Awaited<ReturnType<SaveRepository['readRecoveryExport']>> | undefined;
    const queued = mode === 'close' ? repository!.readRecoveryExport().then(result => {
      queuedSettled = true; queuedResult = result; return result;
    }) : undefined;
    const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
    await delay(mode === 'close' ? 100 : 1500);
    const beforeClose = { settled, cause: outcome?.result.status === 'unavailable' ? outcome.result.cause : undefined };
    if (mode !== 'timeout') { closeAt = performance.now(); api.close(); }
    await delay(250);
    const afterClose = { settled, cause: outcome?.result.status === 'unavailable' ? outcome.result.cause : undefined, queuedSettled };
    const pendingRequest = lifecycleAudit.find(event => event.event === 'request' && event.requestedVersion === undefined);
    held.close();
    await upgraded;
    const completedProbe = await pending;
    if (queued) await queued;
    // Let the late open's idb promise handler run before checking its cleanup.
    await delay(0);
    const lateAudit = structuredClone(recoveryAudit);
    const priorValidatorCalls = validationCalls;
    const priorSignalCount = signals.length;
    api.prepareRecovery(suffix);
    api.validator('throw-always');
    const retry = await api.recoveryProbe();
    const lateSuccess = lifecycleAudit.find(event => event.event === 'success' && event.requestId === pendingRequest?.requestId);
    const lateConnectionClosed = !!lateSuccess && lifecycleAudit.some(event => event.event === 'close' && event.connectionId === lateSuccess.connectionId);
    const cleanupBegan = performance.now();
    const cleanupDatabase = await rawOpen(namespace, 5);
    const cleanupUpgradeMs = performance.now() - cleanupBegan;
    cleanupDatabase.close();
    const rootAfter = await api.rawRead();
    return { beforeClose, afterClose, result: completedProbe.result, queuedResult, settlementMs,
      closeSettlementMs, retry: retry.result, rootBefore, rootAfter, lateConnectionClosed, cleanupUpgradeMs,
      validatorCalls: priorValidatorCalls + validationCalls, signalCount: priorSignalCount + signals.length,
      audit: completedProbe.audit, lateAudit, lifecycle: structuredClone(lifecycleAudit) };
  },
  async seedUnknown(suffix: string, value: unknown, version = 1) {
    repository?.close();
    namespace = `${APP_NAMESPACE}:repository-${suffix}`;
    const request = indexedDB.open(`${namespace}:save`, version);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('records')) request.result.createObjectStore('records'); };
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const tx = db.transaction('records', 'readwrite');
    tx.objectStore('records').put(value, 'root');
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    db.close();
  },
};
declare global { interface Window { saveRepositoryFixture: typeof api } }
window.saveRepositoryFixture = api;
const container = document.getElementById('panel')!;
const panel = mountPanel(container, <section><h1>Atomic repository fixture</h1><p>{APP_NAMESPACE}</p></section>);
window.addEventListener('pagehide', () => { repository?.close(); panel.unmount(); }, { once: true });
export type { CommittedSnapshot };
