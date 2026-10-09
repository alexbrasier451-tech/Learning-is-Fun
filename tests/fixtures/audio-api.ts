import type { CommittedSnapshot, InstallationAudioPreferences, LoadResult, PreferenceStatus, UpdateReadiness } from '../../src/state/contracts';

/** Erased fixture boundary. No TSX, media implementation or DOM types cross
 * into the strict Node-only Playwright spec. The browser host satisfies it. */
export type AudioFixtureStatus = Readonly<{
  preferences: InstallationAudioPreferences; loadStatus: PreferenceStatus['loadStatus'];
  activation: 'inactive' | 'ready' | 'blocked' | 'unavailable'; persistence: PreferenceStatus | null;
  speaking: boolean; localVoiceAvailable: boolean; voiceName: string | null;
  visible: boolean; mediaError: boolean; persistenceError: boolean;
}>;
export type AudioFixtureApi = {
  namespace: string; binding: 'real' | 'fake'; ready(): Promise<LoadResult>;
  audio: {
    getSnapshot(): AudioFixtureStatus;
    subscribe(listener: () => void): () => void;
    playEffect(cue: 'pickup' | 'placement' | 'support' | 'success' | 'restoration'): void;
    setVisible(visible: boolean): void;
    setSceneTheme(theme: 'village' | 'library' | null): void;
    silenceAll(): void;
    stopReading(): void;
  };
  events(): Array<Record<string, unknown>>;
  createdContexts(): number;
  activeSources(): Array<{ loop: boolean; duration: number | undefined }>;
  committed(): CommittedSnapshot;
  preferences: { getStatus(): PreferenceStatus; flush(): Promise<UpdateReadiness> };
  flush(): Promise<UpdateReadiness>; nativeRoot(): Promise<unknown>;
  createProfile(nickname: string): Promise<string>; selectProfile(profileId: string): void; selectedProfile(): string | null;
  dispatchVisibility(visible: boolean): void;
  failNext(): void; failNextHandoff(): void; holdNext(): void; held(): boolean; release(): void;
  finishReading(): void; utteranceCount(): number; teardown(): void; cleanup(): Promise<void>;
};
