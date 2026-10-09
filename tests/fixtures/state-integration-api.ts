import type { AudioPreferenceIntent } from '../../src/audio/contracts';
import type { TaskDefinition } from '../../src/learning/contracts';
import type { ActivityProjectionResult, CommitResult, CommittedSnapshot, LoadResult, PreferenceStatus, ProfilePreferences,
  SaveToken, StateCommand, StateController, StateReason, TransientReadiness, UpdateReadiness, ValidationIssue } from '../../src/state/contracts';

/** Erased structural boundary shared by the browser host and Node-only spec.
 * No React, IndexedDB, browser globals or implementation imports cross it. */
type FixtureIntent<C extends StateCommand = StateCommand> = C extends StateCommand ? Omit<C, 'actionId' | 'expected' | 'payload'> & {
  payload: C['kind'] extends 'CreateProfile' | 'StartOver' ? Omit<C['payload'], 'newProfileId'>
    : C['kind'] extends 'SubmitCheck' ? Omit<C['payload'], 'submissionId'> : C['payload'];
} : never;
type FixturePreview = { preparedImportId: string; expected: SaveToken; exportedAt: string; profileNames: readonly string[]; profileCount: number };
type FixtureRecovery = { status: 'available'; representation: 'raw-indexeddb-root-json'; databaseName: string;
  structuralVersion: number; store: 'records'; key: 'root'; json: string; byteLength: number }
  | { status: 'unavailable'; cause: string; message: string };
type FixtureController = StateController & {
  ready: Promise<LoadResult>;
  getLoadState(): { status: 'loading' } | LoadResult;
  prepareCommand(intent: FixtureIntent): StateCommand;
  preferences: {
    getStatus(): PreferenceStatus;
    subscribe(listener: () => void): () => void;
    setAudioPreferences(intent: AudioPreferenceIntent): void;
    setProfilePreferences(profileId: string, patch: Partial<ProfilePreferences>): void;
    retry(): void;
    acknowledgeDiscardedChanges(): void;
    flush(): Promise<UpdateReadiness>;
  };
  backupActions: {
    prepare(file: { size: number; text(): Promise<string> }): Promise<{ status: 'ready'; preview: FixturePreview }
      | { status: 'invalid' | 'unsupported'; issues: readonly ValidationIssue[] } | { status: 'unavailable'; reason: StateReason }>;
    cancel(preparedImportId: string): void;
    confirm(preparedImportId: string): Promise<CommitResult>;
    export(mode: 'flushed' | 'last-committed'): Promise<{ status: 'ready'; source: 'committed' | 'last-committed-recovery'; backup: { filename: string; json: string; byteLength: number } }
      | { status: 'blocked'; readiness: UpdateReadiness; message: string } | { status: 'unavailable'; reason: StateReason }>;
  };
  exportRawRecoveryData(): Promise<FixtureRecovery>;
  dispose(): void;
};
export type StateIntegrationApi = {
  namespace: string; catalogue: readonly TaskDefinition[];
  controller(): FixtureController;
  snapshot(): CommittedSnapshot | null;
  make(kind: StateCommand['kind'], payload: unknown, profileId?: string): StateCommand;
  dispatch(command: StateCommand): Promise<CommitResult>;
  send(kind: StateCommand['kind'], payload: unknown, profileId?: string): Promise<CommitResult>;
  projection(profileId: string, encounterId: string): ActivityProjectionResult;
  setNow(value: string): void;
  clockReads(): number;
  events(): unknown[];
  celebrations(): unknown[];
  readiness(value: TransientReadiness, throwing?: boolean): void;
  hold(): void;
  held(): boolean;
  release(): void;
  abort(): void;
  nativeRoot(): Promise<unknown>;
  reload(): Promise<LoadResult>;
  rawRecovery(): Promise<Extract<FixtureRecovery, { status: 'available' }> & { filename: string; label: string } | Extract<FixtureRecovery, { status: 'unavailable' }>>;
  sentinel(): Promise<string>;
  readSentinel(name: string): Promise<unknown>;
};
