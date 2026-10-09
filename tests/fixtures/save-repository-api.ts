import type { CommitResult, CommittedSnapshot, LoadResult, SaveToken, StoredRoot } from '../../src/state/contracts';

type FixtureInvalidation = { kind: 'committed'; token: SaveToken } | { kind: 'silence' };
type FixtureRecovery = { status: 'available'; representation: 'raw-indexeddb-root-json'; databaseName: string;
  structuralVersion: number; store: 'records'; key: 'root'; json: string; byteLength: number }
  | { status: 'unavailable'; cause: string; message: string };
type RecoveryAudit = { kind: string; databaseName: string; requestedVersion?: number;
  mode?: string; oldVersion?: number; newVersion?: number | null };

/** Type-only fixture boundary, usable by the DOM entry and Node Playwright
 * project without importing React/TSX or ambient browser globals into Node. */
export type RepositoryFixture = {
  namespace: string;
  open(suffix: string, missingChannel?: boolean, frozenParent?: 'save' | 'nested'): Promise<LoadResult>;
  load(): Promise<LoadResult>;
  snapshot(): Promise<CommittedSnapshot>;
  rawRead(): Promise<StoredRoot | undefined>;
  commit(expected: SaveToken, actionId: string, duplicate?: boolean): Promise<CommitResult>;
  receipt(expected: SaveToken, actionId: string): Promise<CommitResult>;
  replace(expected: SaveToken, epoch: string, label: string): Promise<CommitResult>;
  fault(mode: 'none' | 'abort' | 'throw-after-put' | 'uncloneable'): void;
  validator(mode: string): void;
  signals(): FixtureInvalidation[];
  observations(): Array<{ value: unknown; duringCompletion: boolean }>;
  reduceCalls(): number;
  silence(): void;
  close(): void;
  seed(value: StoredRoot | null, kind?: string): Promise<void>;
  sentinel(): Promise<void>;
  readSentinel(): Promise<unknown>;
  upgrade(): Promise<void>;
  blockUpgrade(): Promise<string>;
  releaseUpgrade(): Promise<void>;
  destructiveCommand(expected: SaveToken, kind: 'ResetSave' | 'ReplaceSave'): Promise<CommitResult>;
  expired(expected: SaveToken): Promise<CommitResult>;
  invalidReplacement(expected: SaveToken): Promise<CommitResult>;
  unknownStore(suffix: string): Promise<void>;
  seedUnknown(suffix: string, value: unknown, version?: number): Promise<void>;
  validationCalls(): number;
  prepareRecovery(suffix: string): void;
  recoveryProbe(): Promise<{ result: FixtureRecovery; validationDelta: number; signalsDelta: number; audit: RecoveryAudit[] }>;
  hasDatabase(): Promise<boolean>;
  failRecoveryRead(): void;
  queuedRecovery(suffix: string, mode: 'original' | 'close' | 'timeout'): Promise<{
    beforeClose: { settled: boolean; cause?: string };
    afterClose: { settled: boolean; cause?: string; queuedSettled: boolean };
    result: FixtureRecovery; queuedResult?: FixtureRecovery; settlementMs: number;
    closeSettlementMs: number | null; retry: FixtureRecovery; rootBefore: unknown; rootAfter: unknown;
    lateConnectionClosed: boolean; cleanupUpgradeMs: number; validatorCalls: number; signalCount: number;
    audit: RecoveryAudit[];
    lateAudit: RecoveryAudit[];
    lifecycle: Array<{ event: string; requestId?: number; version?: number; connectionId?: number; requestedVersion?: number }>;
  }>;
};
