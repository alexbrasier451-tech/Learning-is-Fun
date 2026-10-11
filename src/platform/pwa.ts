import { BASE_URL, BUILD_ID } from './appIdentity';

export type OfflineStatus = Readonly<{
  phase: 'unsupported' | 'preparing' | 'ready' | 'incomplete' | 'update-waiting';
  pageBuildId: string; activeBuildId: string | null; waitingBuildId: string | null;
  activeInventoryComplete: boolean; reason: string | null;
}>;
type Probe = { buildId: string; complete: boolean; reason: string | null };

/** Native waiting lifecycle only. This adapter has no save or activation authority. */
export function registerOfflineApp({ onStatus }: { onStatus(status: OfflineStatus): void }): {
  retryPreparation(): Promise<void>; dispose(): void;
} {
  let disposed = false, generation = 0, sequence = 0;
  let registration: ServiceWorkerRegistration | null = null, registering: Promise<void> | null = null;
  let downloadFailed = false;
  const workers = new Map<ServiceWorker, () => void>(), cancellations = new Set<() => void>();
  function publish(status: Omit<OfflineStatus, 'pageBuildId'>) {
    if (!disposed) onStatus(Object.freeze({ ...status, pageBuildId: BUILD_ID }));
  }
  function empty(phase: OfflineStatus['phase'], reason: string | null) {
    publish({ phase, reason, activeBuildId: null, waitingBuildId: null, activeInventoryComplete: false });
  }
  let serviceWorkers: ServiceWorkerContainer | null = null;
  try { if (typeof navigator !== 'undefined' && typeof navigator.serviceWorker?.register === 'function' && typeof MessageChannel !== 'undefined') serviceWorkers = navigator.serviceWorker; }
  catch { /* Browser policy can deny access to the service-worker container. */ }
  const supported = serviceWorkers !== null;
  async function probe(worker: ServiceWorker): Promise<Probe | null> {
    return new Promise(resolve => {
      const channel = new MessageChannel(), requestId = `${BUILD_ID}:${++sequence}`;
      const finish = (value: Probe | null) => {
        clearTimeout(timer); channel.port1.close(); channel.port2.close(); cancellations.delete(cancel); resolve(value);
      };
      const cancel = () => finish(null), timer = setTimeout(cancel, 10000);
      cancellations.add(cancel);
      channel.port1.onmessage = event => {
        const reply = event.data;
        if (reply?.type !== 'OFFLINE_INVENTORY_RESULT' || reply.requestId !== requestId) return;
        if (typeof reply.buildId !== 'string' || typeof reply.complete !== 'boolean') { finish(null); return; }
        finish({ buildId: reply.buildId, complete: reply.complete, reason: typeof reply.reason === 'string' ? reply.reason : null });
      };
      channel.port1.onmessageerror = cancel;
      try { worker.postMessage({ type: 'OFFLINE_INVENTORY_PROBE', requestId }, [channel.port2]); }
      catch { cancel(); }
    });
  }
  async function refresh() {
    if (disposed || !registration) return;
    const current = ++generation, active = registration.active, waiting = registration.waiting;
    // Invalidate any prior readiness immediately, including on visibility return.
    empty('preparing', null);
    const [activeReply, waitingReply] = await Promise.all([active ? probe(active) : null, waiting ? probe(waiting) : null]);
    if (disposed || current !== generation || active !== registration.active || waiting !== registration.waiting) return;
    const complete = !!activeReply?.complete && activeReply.buildId === BUILD_ID;
    const reason = !active ? (registration.installing ? null : 'No active offline version yet.')
      : !activeReply ? 'The active offline version could not be checked.'
      : activeReply.buildId !== BUILD_ID ? 'This page and the active offline version differ. Close all game tabs and reopen when your progress is saved.'
      : !complete ? (activeReply.reason ?? 'Offline preparation incomplete.')
      : downloadFailed ? 'An update download failed. The current offline version is still available.' : null;
    publish({ phase: waiting ? 'update-waiting' : complete ? 'ready' : registration.installing ? 'preparing' : 'incomplete',
      activeBuildId: activeReply?.buildId ?? null, waitingBuildId: waitingReply?.buildId ?? null,
      activeInventoryComplete: complete, reason });
  }
  function watch() {
    if (!registration) return;
    for (const worker of [registration.installing, registration.waiting, registration.active]) {
      if (!worker || workers.has(worker)) continue;
      const changed = () => { if (worker.state === 'redundant') downloadFailed = true; watch(); void refresh(); };
      worker.addEventListener('statechange', changed); workers.set(worker, changed);
    }
  }
  const updated = () => { downloadFailed = false; watch(); void refresh(); };
  async function register() {
    if (registering) return registering;
    registering = (async () => {
      try {
        const found = await serviceWorkers!.register(`${BASE_URL}sw.js`, { scope: BASE_URL, updateViaCache: 'none' });
        if (disposed) return;
        if (registration !== found) {
          registration?.removeEventListener('updatefound', updated);
          for (const [worker, listener] of workers) worker.removeEventListener('statechange', listener);
          workers.clear();
        }
        registration = found; found.addEventListener('updatefound', updated); watch(); await refresh();
      } catch { empty('incomplete', 'Offline preparation incomplete. Online play is still available.'); }
    })().finally(() => { registering = null; });
    return registering;
  }
  const controllerChanged = () => { watch(); void refresh(); };
  const visible = () => { if (document.visibilityState === 'visible') void refresh(); };
  if (!supported) empty('unsupported', 'Offline preparation is unavailable in this browser.');
  else {
    empty('preparing', null);
    serviceWorkers!.addEventListener('controllerchange', controllerChanged);
    document.addEventListener('visibilitychange', visible);
    void register();
  }
  return {
    async retryPreparation() {
      if (disposed || !supported) return;
      // A failed first install can remove the browser's registration while the
      // page still holds its empty object. update() cannot revive that object.
      if (!registration || (!registration.active && !registration.waiting && !registration.installing)) {
        downloadFailed = false; await register(); return;
      }
      downloadFailed = false;
      try { await registration.update(); } catch { downloadFailed = true; }
      watch(); await refresh();
    },
    dispose() {
      if (disposed) return; disposed = true; ++generation;
      serviceWorkers?.removeEventListener('controllerchange', controllerChanged);
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', visible);
      registration?.removeEventListener('updatefound', updated);
      for (const [worker, listener] of workers) worker.removeEventListener('statechange', listener);
      workers.clear(); for (const cancel of cancellations) cancel();
    },
  };
}
