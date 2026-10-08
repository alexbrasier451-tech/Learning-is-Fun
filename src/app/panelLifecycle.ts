export type ActivePanelStatus = Readonly<{ dirty: boolean; pending: boolean; failed: boolean }>;
export type PanelLeaveResult = { status: 'ready' } | { status: 'blocked'; message: string };

export interface ActivePanelLifecycle {
  getStatus(): ActivePanelStatus;
  subscribe(listener: () => void): () => void;
  suspend(): Promise<PanelLeaveResult>;
  discardDraft(): PanelLeaveResult;
}

export interface ActivePanelHost {
  register(panel: ActivePanelLifecycle): () => void;
}
