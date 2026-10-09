import type { LeaderboardReadModel } from '../../src/rewards/contracts';
import type { CommitResult, CommittedSnapshot, LoadResult, StateCommand } from '../../src/state/contracts';

/** Erased fixture-only boundary. No browser/controller implementation imports. */
export type RealHallApi = {
  namespace: string;
  ready(): Promise<LoadResult>;
  snapshot(): CommittedSnapshot | null;
  model(): LeaderboardReadModel | null;
  status(): string;
  lastRefresh(): CommitResult | null;
  open(): Promise<CommitResult | null>;
  send(kind: StateCommand['kind'], payload: unknown, profileId?: string): Promise<CommitResult>;
  setNow(value: string): void;
  setObservation(value: string | null): void;
  clockReads(): number;
  events(): unknown[];
  abort(): void;
  hold(): void;
  held(): boolean;
  release(): void;
  nativeRoot(): Promise<unknown>;
  lifecycle(): { subscriptionActive: boolean; disposed: boolean; notifications: number };
  teardown(): void;
};
