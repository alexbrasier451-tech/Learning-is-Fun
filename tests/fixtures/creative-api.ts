import type { CommitResult, CommittedSnapshot, StateCommand } from '../../src/state/contracts';
import type { ActivityProjectionResult } from '../../src/state/contracts';
/** Erased pure boundary for Node-only specs; no executable TSX/media imports. */
export type CreativeFixtureApi = Readonly<{
  namespace: string;
  snapshot(): CommittedSnapshot;
  selected(): string;
  select(profileId: string): void;
  createProfile(nickname: string): Promise<string>;
  completeQuest(questId: 'Q1' | 'Q2' | 'Q3'): Promise<void>;
  openHelp(): Promise<void>;
  projection(): ActivityProjectionResult | null;
  send(command: StateCommand): Promise<CommitResult>;
  hold(): void; held(): boolean; release(): void; abort(): void;
  events(): readonly Readonly<{ stage: string; kind?: string; status?: string; profileId?: string; text?: string; command?: StateCommand }>[];
  celebrations(): number;
  nativeRoot(): Promise<unknown>;
  settle(): Promise<void>;
  cleanup(): Promise<void>;
}>;
