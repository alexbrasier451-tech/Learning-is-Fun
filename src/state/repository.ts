import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import { SAVE_LIMITS } from './contracts';
import type {
  CommitChanges, CommitResult, CommittedSnapshot, LoadResult, ReduceCommand, SaveDataV1,
  SaveToken, StateCommand, StateReason, StoredRoot, TransitionContext, ValidateSave,
} from './contracts';

interface SaveDatabase extends DBSchema {
  records: { key: string; value: StoredRoot };
}

export type RepositoryInvalidation = Readonly<{ kind: 'committed'; token: SaveToken } | { kind: 'silence' }>;
export type RecoveryExportUnavailable = 'closed' | 'absent-database' | 'missing-store' | 'missing-root'
  | 'blocked' | 'unreadable' | 'non-json' | 'capacity-exceeded';
/** Open deadline after recovery reaches the serial queue head. Browser timer
 * scheduling can delay settlement; this does not bound root materialization. */
export const RECOVERY_OPEN_TIMEOUT_MS = 1000;
/** Raw logical IndexedDB data, not a compatible backup or validated snapshot.
 * json encodes exactly the existing records/root value, including unknown fields. */
export type RecoveryExportResult = Readonly<{
  status: 'available'; representation: 'raw-indexeddb-root-json'; databaseName: string;
  structuralVersion: number; store: 'records'; key: 'root'; json: string; byteLength: number;
}> | Readonly<{ status: 'unavailable'; cause: RecoveryExportUnavailable; message: string }>;
/** Domain-owned retained identical-delivery test. Must be synchronous/read-only,
 * compare the complete identity/payload, and return false for expired receipts. */
export type RecognizeDuplicate = (root: StoredRoot, command: StateCommand, context: TransitionContext) => boolean;
export type CommitPorts = Readonly<{
  reduce: ReduceCommand; context: TransitionContext; recognizeDuplicate?: RecognizeDuplicate;
}>;
export type SaveRepository = Readonly<{
  loadRoot(): Promise<LoadResult>;
  commitCommand(command: StateCommand, ports: CommitPorts): Promise<CommitResult>;
  readExportSnapshot(): Promise<CommittedSnapshot>;
  readRecoveryExport(): Promise<RecoveryExportResult>;
  replaceSave(input: Readonly<{ expected: SaveToken; validatedSave: SaveDataV1; replacementEpoch: string }>): Promise<CommitResult>;
  subscribeInvalidation(listener: (signal: RepositoryInvalidation) => void): () => void;
  notifySilence(): void;
  close(): void;
}>;

class RepositoryError extends Error {
  constructor(readonly reason: StateReason, readonly loadStatus: 'blocked' | 'unsupported' | 'unreadable') {
    super(reason.message);
  }
}
const problem = (code: StateReason['code'], message: string) => ({ code, message });
const unreadable = () => new RepositoryError(problem('storage-unreadable', 'Saved data is unavailable. Retry or recover from a backup; your save has not been reset.'), 'unreadable');
const blocked = () => new RepositoryError(problem('storage-blocked', 'Close other game tabs and retry.'), 'blocked');
const validToken = (token: SaveToken) => typeof token?.epoch === 'string' && token.epoch.length > 0
  && token.epoch.length <= 160 && Number.isSafeInteger(token.revision) && token.revision >= 0;
const sameToken = (a: SaveToken, b: SaveToken) => a.epoch === b.epoch && a.revision === b.revision;
function immutable<T>(value: T): T {
  if (value && typeof value === 'object') {
    // A frozen parent may still contain mutable children.
    Object.values(value).forEach(immutable);
    if (!Object.isFrozen(value)) Object.freeze(value);
  }
  return value;
}
function synchronous<T>(value: T): T {
  if (value && typeof (value as { then?: unknown }).then === 'function') {
    // Consume an accidentally returned rejected promise without awaiting it.
    void Promise.resolve(value).catch(() => {});
    throw new Error('Repository ports must be synchronous.');
  }
  return value;
}
const noChanges: CommitChanges = {
  earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0, consumedSlot: null, newReceiptKeys: [], newEntitlementIds: [] },
  unlockedIds: [], restorationIds: [], closedWeekIds: [],
};

/** Bounded JSON-only inspection. Reject values JSON.stringify would transform
 * or drop; never decode, normalize, strip fields or invoke a toJSON method. */
function recoveryJson(value: unknown): { json: string; byteLength: number } | 'non-json' | 'capacity-exceeded' {
  const frames: Array<{ value: unknown; depth: number; exit?: boolean }> = [{ value, depth: 0 }];
  const ancestors = new Set<object>();
  let visited = 0;
  let bytes = 0;
  const stringBytes = (text: string) => {
    if (text.length > SAVE_LIMITS.backupBytes - bytes) return SAVE_LIMITS.backupBytes + 1;
    let count = 2;
    for (const character of text) {
      const code = character.codePointAt(0)!;
      count += code === 34 || code === 92 || code === 8 || code === 9 || code === 10 || code === 12 || code === 13 ? 2
        : code < 32 || (code >= 0xd800 && code <= 0xdfff) ? 6
        : code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
      if (count > SAVE_LIMITS.backupBytes) break;
    }
    return count;
  };
  while (frames.length) {
    const frame = frames.pop()!;
    const item = frame.value;
    if (frame.exit) { ancestors.delete(item as object); continue; }
    if (++visited > SAVE_LIMITS.visitedValues || frame.depth > SAVE_LIMITS.nesting) return 'capacity-exceeded';
    if (item === null) bytes += 4;
    else if (typeof item === 'string') bytes += stringBytes(item);
    else if (typeof item === 'boolean') bytes += item ? 4 : 5;
    else if (typeof item === 'number') {
      if (!Number.isFinite(item) || Object.is(item, -0)) return 'non-json';
      bytes += JSON.stringify(item).length;
    } else if (typeof item === 'object') {
      if (ancestors.has(item)) return 'non-json';
      const array = Array.isArray(item);
      if (!array && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null) return 'non-json';
      const keys = Object.keys(item);
      if (keys.length > SAVE_LIMITS.visitedValues) return 'capacity-exceeded';
      if (Reflect.ownKeys(item).length !== keys.length + (array ? 1 : 0)) return 'non-json';
      if (array && (keys.length !== item.length || !keys.every((key, index) => key === String(index)))) return 'non-json';
      bytes += 2 + Math.max(0, keys.length - 1);
      ancestors.add(item);
      frames.push({ value: item, depth: frame.depth, exit: true });
      for (let index = keys.length - 1; index >= 0; index--) {
        const key = keys[index];
        const descriptor = Object.getOwnPropertyDescriptor(item, key)!;
        if (!('value' in descriptor)) return 'non-json';
        if (!array) bytes += stringBytes(key) + 1;
        if (bytes > SAVE_LIMITS.backupBytes) return 'capacity-exceeded';
        frames.push({ value: descriptor.value, depth: frame.depth + 1 });
      }
    } else return 'non-json';
    if (bytes > SAVE_LIMITS.backupBytes) return 'capacity-exceeded';
  }
  const json = JSON.stringify(value);
  const byteLength = new TextEncoder().encode(json).byteLength;
  if (byteLength > SAVE_LIMITS.backupBytes) return 'capacity-exceeded';
  return { json, byteLength };
}

/** Sole durable save authority. Connection recovery means explicitly reopening
 * a repository; an unreadable/terminated/missing root never initializes a save. */
export function openSaveRepository(options: Readonly<{
  appNamespace: string; initialSave: SaveDataV1; validateSave: ValidateSave;
  catalogue?: TransitionContext['catalogue'];
}>): SaveRepository {
  if (!options.appNamespace || options.appNamespace.trim() !== options.appNamespace) throw new Error('An app namespace is required.');
  const listeners = new Set<(signal: RepositoryInvalidation) => void>();
  let channel: BroadcastChannel | undefined;
  let database: Promise<IDBPDatabase<SaveDatabase>> | undefined;
  let connection: IDBPDatabase<SaveDatabase> | undefined;
  let failure: RepositoryError | undefined;
  let closed = false;
  let cancelRecoveryOpen: (() => void) | undefined;
  let created = false;
  let queue: Promise<unknown> = Promise.resolve();
  let cached: CommittedSnapshot | undefined;
  const serial = <T>(run: () => Promise<T>): Promise<T> => {
    const next = queue.then(run, run);
    queue = next.catch(() => {});
    return next;
  };
  function emit(signal: RepositoryInvalidation) {
    for (const listener of listeners) { try { listener(signal); } catch { /* Notification cannot change durable outcome. */ } }
  }
  function broadcast(signal: RepositoryInvalidation) {
    try { channel?.postMessage(signal); } catch { /* Token checks do not rely on broadcasts. */ }
  }
  try {
    channel = new BroadcastChannel(`${options.appNamespace}:save:invalidation`);
    channel.onmessage = ({ data }: MessageEvent<RepositoryInvalidation>) => {
      if (data?.kind === 'silence') emit({ kind: 'silence' });
      else if (data?.kind === 'committed' && validToken(data.token)) {
        emit({ kind: 'committed', token: { epoch: data.token.epoch, revision: data.token.revision } });
      }
    };
  } catch { /* BroadcastChannel may be missing or disabled. IndexedDB remains authoritative. */ }

  function suspend(error: RepositoryError) {
    failure = error;
    connection?.close();
  }
  async function db(): Promise<IDBPDatabase<SaveDatabase>> {
    if (closed) throw unreadable();
    if (failure) throw failure;
    if (!database) {
      database = new Promise((resolve, reject) => {
        const opening = openDB<SaveDatabase>(`${options.appNamespace}:save`, 1, {
          upgrade(database, oldVersion, _newVersion, tx) {
            if (oldVersion === 0) {
              const store = database.createObjectStore('records');
              // Initialize within the structural transaction: competing opens
              // cannot observe a newly created store with an absent root.
              void store.get('root').then(existing => {
                if (existing !== undefined) return;
                const initial = immutable({ epoch: crypto.randomUUID(), revision: 0, save: validate(options.initialSave) });
                created = true;
                return store.put(initial, 'root');
              }).catch(error => {
                failure = error instanceof RepositoryError ? error : unreadable();
                try { tx.abort(); } catch { /* Already aborted. */ }
              });
            }
          },
          blocked() { suspend(blocked()); reject(failure); },
          blocking() { suspend(blocked()); },
          terminated() { suspend(unreadable()); },
        });
        void opening.then(database => {
          if (closed || failure) { database.close(); reject(failure ?? unreadable()); return; }
          if (database.objectStoreNames.length !== 1 || !database.objectStoreNames.contains('records')) {
            database.close();
            failure = unreadable();
            reject(failure);
            return;
          }
          connection = database;
          resolve(database);
        }, error => {
          failure ??= error?.name === 'VersionError'
            ? new RepositoryError(problem('unsupported-schema', 'This save requires a newer application. Recover or update without resetting it.'), 'unsupported')
            : unreadable();
          reject(failure);
        });
      });
    }
    return database;
  }
  function validate(candidate: unknown, catalogue = options.catalogue ?? []) {
    const result = synchronous(options.validateSave(candidate, catalogue));
    if (result.status === 'valid') return result.save;
    const issue = result.issues[0];
    throw new RepositoryError(problem(issue?.code ?? 'invalid-save', issue?.message ?? 'The saved data could not be validated.'),
      result.status === 'unsupported' ? 'unsupported' : 'unreadable');
  }
  function root(value: StoredRoot | undefined): StoredRoot {
    if (!value || !validToken(value)) throw unreadable();
    return immutable({ epoch: value.epoch, revision: value.revision, save: validate(value.save) });
  }
  function snapshot(value: StoredRoot): CommittedSnapshot {
    if (cached && sameToken(cached.token, value)) return cached;
    cached = immutable({ token: { epoch: value.epoch, revision: value.revision }, save: value.save });
    return cached;
  }
  function publish(value: StoredRoot) {
    const result = snapshot(value);
    const signal = { kind: 'committed', token: result.token } as const;
    emit(signal);
    broadcast(signal);
    return result;
  }
  async function load(): Promise<LoadResult> {
    try {
      const database = await db();
      const tx = database.transaction('records', 'readonly');
      void tx.done.catch(() => {});
      try {
        const existing = await tx.store.get('root');
        const value = root(existing);
        const isNew = created;
        await tx.done;
        created = false;
        return { status: isNew ? 'new' : 'ready', snapshot: isNew ? publish(value) : snapshot(value) };
      } catch (error) {
        try { tx.abort(); } catch { /* Already completed/aborted. */ }
        await tx.done.catch(() => {});
        throw error;
      }
    } catch (error) {
      const issue = error instanceof RepositoryError ? error : unreadable();
      return { status: issue.loadStatus, reason: issue.reason };
    }
  }
  function failed(error: unknown): CommitResult {
    const issue = error instanceof RepositoryError ? error : undefined;
    if (issue?.loadStatus === 'unsupported') return { status: 'unsupported', reason: issue.reason };
    return { status: 'save-failed', retryable: !closed && !failure,
      reason: issue?.reason ?? problem('storage-write-failed', 'Saving failed. Your last committed save is unchanged; retry the action.') };
  }
  async function recover(): Promise<RecoveryExportResult> {
    const unavailable = (cause: RecoveryExportUnavailable): RecoveryExportResult => ({
      status: 'unavailable', cause,
      message: cause === 'blocked' ? 'Close other game tabs and retry the recovery export.'
        : cause === 'non-json' ? 'The stored value cannot be exported as JSON without changing data.'
        : cause === 'capacity-exceeded' ? 'The stored value exceeds the bounded recovery export limits; no data was changed.'
        : 'Raw recovery data is unavailable; no save was created or changed.',
    });
    if (closed) return unavailable('closed');
    const name = `${options.appNamespace}:save`;
    let recoveryConnection: IDBPDatabase | undefined;
    let cause: RecoveryExportUnavailable = 'unreadable';
    let cancelled = false;
    try {
      recoveryConnection = await new Promise<IDBPDatabase>((resolve, reject) => {
        let settled = false;
        const finish = () => {
          globalThis.clearTimeout(timer);
          if (cancelRecoveryOpen === cancel) cancelRecoveryOpen = undefined;
        };
        const rejectPending = (nextCause: RecoveryExportUnavailable) => {
          if (settled) return;
          settled = true; cancelled = true; cause = nextCause;
          finish();
          reject(new Error('Recovery connection unavailable.'));
        };
        const cancel = () => rejectPending('closed');
        cancelRecoveryOpen = cancel;
        // An unversioned request queued behind an earlier blocked upgrade may
        // emit no blocked event. Settle our operation without waiting for it.
        const timer = globalThis.setTimeout(() => rejectPending('blocked'), RECOVERY_OPEN_TIMEOUT_MS);
        // Omit a requested version: inspect the current structure, never upgrade.
        try {
          const opening = openDB(name, undefined, {
            upgrade(_database, _oldVersion, _newVersion, tx) {
              cause = 'absent-database';
              void tx.done.catch(() => {});
              tx.abort(); // Abort the browser's attempted creation of a missing DB.
            },
            blocked() { rejectPending('blocked'); },
            blocking() { recoveryConnection?.close(); },
            terminated() { rejectPending('unreadable'); },
          });
          void opening.then(database => {
            // Native IDB open requests cannot be cancelled. A late success owns
            // only connection cleanup, never a read, validation or publication.
            if (cancelled || closed) { database.close(); rejectPending(closed ? 'closed' : cause); }
            else { settled = true; finish(); resolve(database); }
          }, () => rejectPending(cause));
        } catch { rejectPending(cause); }
      });
      if (closed) return unavailable('closed');
      if (!recoveryConnection.objectStoreNames.contains('records')) return unavailable('missing-store');
      const tx = recoveryConnection.transaction('records', 'readonly');
      void tx.done.catch(() => {});
      const existing: unknown = await tx.store.get('root');
      await tx.done;
      if (existing === undefined) return unavailable('missing-root');
      // Inspection/serialization runs after the read-only transaction completes.
      const encoded = recoveryJson(existing);
      if (typeof encoded === 'string') return unavailable(encoded);
      return immutable({ status: 'available', representation: 'raw-indexeddb-root-json', databaseName: name,
        structuralVersion: recoveryConnection.version, store: 'records', key: 'root', ...encoded });
    } catch { return unavailable(closed ? 'closed' : cause); }
    finally { recoveryConnection?.close(); }
  }
  async function mutate(expected: SaveToken, operation: (value: StoredRoot) =>
    { status: 'write'; root: StoredRoot; changes: CommitChanges } | CommitResult): Promise<CommitResult> {
    try {
      const database = await db();
      const tx = database.transaction('records', 'readwrite');
      void tx.done.catch(() => {});
      try {
        const current = root(await tx.store.get('root'));
        let outcome: ReturnType<typeof operation>;
        if (!validToken(expected)) outcome = { status: 'invalid', reason: problem('invalid-command', 'The command token is invalid.') };
        else if (current.epoch !== expected.epoch) outcome = { status: 'conflict', snapshot: snapshot(current) };
        else outcome = operation(current);
        if (outcome.status !== 'write') {
          if (outcome.status === 'invalid' || outcome.status === 'unsupported') {
            tx.abort();
            await tx.done.catch(() => {});
          } else await tx.done;
          return outcome;
        }
        const committedChanges = immutable(structuredClone(outcome.changes));
        await tx.store.put(outcome.root, 'root');
        await tx.done;
        return { status: 'committed', snapshot: publish(outcome.root), changes: committedChanges };
      } catch (error) {
        try { tx.abort(); } catch { /* Already completed/aborted. */ }
        await tx.done.catch(() => {});
        throw error;
      }
    } catch (error) { return failed(error); }
  }
  const refresh = () => {
    if (!closed) void serial(load).then(result => {
      if (result.status === 'ready') emit({ kind: 'committed', token: result.snapshot.token });
    });
  };
  globalThis.addEventListener?.('focus', refresh);
  const visible = () => { if (typeof document !== 'undefined' && document.visibilityState === 'visible') refresh(); };
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', visible);
  return {
    loadRoot: () => serial(load),
    readRecoveryExport: () => serial(recover),
    readExportSnapshot: () => serial(async () => {
      const result = await load();
      if (result.status === 'ready' || result.status === 'new') return result.snapshot;
      throw new RepositoryError('reason' in result ? result.reason : unreadable().reason,
        result.status === 'blocked' || result.status === 'unsupported' ? result.status : 'unreadable');
    }),
    commitCommand: (command, ports) => {
      // Capture caller-owned inputs before joining the serialized queue.
      const captured = immutable(structuredClone(command));
      const context = immutable(structuredClone(ports.context));
      const { reduce, recognizeDuplicate } = ports;
      return serial(() => mutate(captured.expected, current => {
        if (captured.kind === 'ResetSave' || captured.kind === 'ReplaceSave') return {
          status: 'invalid', reason: problem('invalid-command', 'Whole-save replacement requires replaceSave and a fresh local epoch.'),
        };
        if (recognizeDuplicate && synchronous(recognizeDuplicate(current, captured, context))) {
          return { status: 'already-applied', snapshot: snapshot(current) };
        }
        if (current.revision !== captured.expected.revision) return { status: 'conflict', snapshot: snapshot(current) };
        if (current.revision === Number.MAX_SAFE_INTEGER) return {
          status: 'unsupported', reason: problem('capacity-exceeded', 'The save revision has reached supported capacity.'),
        };
        const decision = synchronous(reduce(current, captured, context));
        if (decision.status === 'already-applied') return { status: 'already-applied', snapshot: snapshot(current) };
        if (decision.status !== 'changed') return { status: decision.status, reason: decision.reason };
        const checked = synchronous(options.validateSave(decision.save, context.catalogue));
        if (checked.status !== 'valid') return { status: checked.status,
          reason: problem(checked.issues[0]?.code ?? 'invalid-save', checked.issues[0]?.message ?? 'The proposed save is invalid.') };
        return { status: 'write', root: immutable({ epoch: current.epoch, revision: current.revision + 1, save: checked.save }), changes: decision.changes };
      }));
    },
    replaceSave: input => {
      const captured = immutable(structuredClone(input));
      return serial(() => mutate(captured.expected, current => {
        if (current.revision !== captured.expected.revision) return { status: 'conflict', snapshot: snapshot(current) };
        if (!validToken({ epoch: captured.replacementEpoch, revision: 0 }) || captured.replacementEpoch === current.epoch) {
          return { status: 'invalid', reason: problem('invalid-command', 'Replacement requires a fresh local epoch.') };
        }
        const checked = synchronous(options.validateSave(captured.validatedSave, options.catalogue ?? []));
        if (checked.status !== 'valid') return { status: checked.status,
          reason: problem(checked.issues[0]?.code ?? 'invalid-save', checked.issues[0]?.message ?? 'The replacement save is invalid.') };
        return { status: 'write', root: immutable({ epoch: captured.replacementEpoch, revision: 0, save: checked.save }), changes: noChanges };
      }));
    },
    subscribeInvalidation(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    notifySilence() { if (!closed) { emit({ kind: 'silence' }); broadcast({ kind: 'silence' }); } },
    close() {
      closed = true;
      cancelRecoveryOpen?.();
      connection?.close();
      channel?.close();
      listeners.clear();
      globalThis.removeEventListener?.('focus', refresh);
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', visible);
    },
  };
}
