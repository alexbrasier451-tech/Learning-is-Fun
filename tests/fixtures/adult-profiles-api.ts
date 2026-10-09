import type { CommittedSnapshot, CommitResult, StateCommand } from '../../src/state/contracts';
import type { LearningSummary } from '../../src/learning/contracts';

/** Node-only test boundary: pure erased contracts, never a TSX typeof import. */
export type AdultProfilesApi = Readonly<{
  mode: 'frozen' | 'real';
  namespace: string;
  snapshot(): CommittedSnapshot;
  summaries(): readonly LearningSummary[];
  commands(): readonly StateCommand[];
  backupCalls(): readonly Readonly<{ kind: 'prepare' | 'cancel' | 'confirm'; id?: string; size?: number }>[];
  selected(): string | null;
  selections(): readonly string[];
  select(profileId: string | null): void;
  scenario(name: 'four' | 'empty' | 'capacity' | 'renamed' | 'deleted'): void;
  outcome(status: 'committed' | 'conflict' | 'save-failed' | 'invalid' | 'unacknowledged'): void;
  hold(): void;
  release(): void;
  bump(): void;
  blocked(value: boolean): void;
  abortNextWrite(): void;
  nativeRoot(): Promise<unknown>;
  send(command: StateCommand): Promise<CommitResult>;
  practice(profileId: string, wrongFirst: boolean): Promise<CommitResult>;
  reload(): Promise<void>;
  now(value: string): void;
}>;
