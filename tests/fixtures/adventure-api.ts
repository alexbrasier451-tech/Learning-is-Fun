import type { CommittedSnapshot, StateCommand, CommitResult, UpdateReadiness } from '../../src/state/contracts';
import type { ActivePanelStatus } from '../../src/app/panelLifecycle';
export type AdventureEvent = { stage: 'command'; command: StateCommand } | { stage: 'result'; command: StateCommand; result: CommitResult }
  | { stage: 'native-abort' | 'held' | 'unregister' | 'register' | 'navigation' | 'acknowledgement-lost'; detail?: string };
/** Erased diagnostics only: no answer, completion, reward or grading endpoint. */
export type AdventureFixtureApi = {
  snapshot(): CommittedSnapshot; events(): readonly AdventureEvent[];
  abortNext(): void; holdNext(): void; release(): void;
  loseNextAcknowledgement(): void; redeliverLastCommand(): Promise<CommitResult>;
  readiness(): { facade: UpdateReadiness; panel: ActivePanelStatus | null; stateSubscriptions: number };
  remountWorld(): void;
  flush(): Promise<UpdateReadiness>;
  setClock(iso: string): void;
  externalRename(nickname: string): Promise<CommitResult>;
  close(): Promise<void>;
};
