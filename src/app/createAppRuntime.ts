import { createAudioController } from '../audio/controller';
import { listTasks } from '../content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../content/quest-bindings';
import { APP_NAMESPACE } from '../platform/appIdentity';
import { assetUrl } from '../platform/assets';
import { attachLifecycle } from '../platform/lifecycle';
import { validateSave } from '../state/backup';
import { createStateController } from '../state/controller';
import { openSaveRepository } from '../state/repository';
import { createInitialSave } from '../state/transition';
import type { TransientReadiness } from '../state/contracts';
import type { ActivePanelHost, ActivePanelLifecycle } from './panelLifecycle';

export function createActivePanelRegistry() {
  type Registration = { token: symbol; panel: ActivePanelLifecycle; unsubscribe(): void };
  let active: Registration | null = null, orphan: TransientReadiness | null = null;
  let pending = false, failed = false, version = 0, disposed = false;
  const listeners = new Set<() => void>();
  const emit = () => { version++; if (!disposed) for (const listener of listeners) listener(); };
  const readTransientReadiness = (): TransientReadiness => {
    const status = active?.panel.getStatus() ?? orphan ?? { dirty: false, pending: false, failed: false };
    return { dirty: status.dirty, pending: status.pending || pending, failed: status.failed || failed };
  };
  const host: ActivePanelHost = { register(panel) {
    if (disposed) throw new Error('The panel host is closed.');
    const current = readTransientReadiness();
    if (active || orphan) {
      if (current.dirty || current.pending || current.failed) throw new Error('The previous activity must leave safely before another can register.');
      active?.unsubscribe();
    }
    const registration: Registration = { token: Symbol('active-panel'), panel, unsubscribe: () => {} };
    active = registration; orphan = null;
    registration.unsubscribe = panel.subscribe(() => { if (active === registration) emit(); });
    emit();
    let removed = false;
    return () => {
      if (removed) return; removed = true; registration.unsubscribe();
      if (active !== registration) return;
      const status = readTransientReadiness();
      orphan = status.dirty || status.pending || status.failed ? status : null;
      active = null; emit();
    };
  } };
  return { host, readTransientReadiness, current: () => active, getVersion: () => version,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    setTransition(nextPending: boolean, nextFailed: boolean) { pending = nextPending; failed = nextFailed; emit(); },
    resetBinding() { active?.unsubscribe(); active = null; orphan = null; pending = false; failed = false; emit(); },
    dispose() { if (disposed) return; disposed = true; active?.unsubscribe(); active = null; listeners.clear(); },
  };
}

export function createAppRuntime() {
  const panels = createActivePanelRegistry(), catalogue = listTasks();
  let persist: Parameters<typeof createAudioController>[0]['persistPreferences'] = () => {};
  const audio = createAudioController({ assetResolver: assetUrl, persistPreferences: intent => persist(intent) });
  const repository = openSaveRepository({ appNamespace: APP_NAMESPACE, initialSave: createInitialSave(), validateSave, catalogue });
  const state = createStateController({ repository, catalogue, questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1',
    clock: { nowEpochMs: () => Date.now() }, preferenceGate: { applyLiveIntent: audio.applyLiveIntent }, readTransientReadiness: panels.readTransientReadiness });
  persist = state.preferences.setAudioPreferences;
  const forward = () => audio.applyPreferenceState(state.preferences.getStatus());
  const stopPreferences = state.preferences.subscribe(forward);
  forward();
  const lifecycle = attachLifecycle(audio);
  let disposed = false;
  return { state, audio, panels, setPaused: lifecycle.setPaused, dispose() {
    if (disposed) return; disposed = true;
    lifecycle.dispose(); stopPreferences(); persist = () => {};
    panels.dispose(); audio.dispose(); state.dispose();
  } };
}
export type AppRuntime = ReturnType<typeof createAppRuntime>;
