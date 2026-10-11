import { PrecacheController } from 'workbox-precaching';
import { APP_NAMESPACE, BASE_URL, BUILD_ID } from './platform/appIdentity';

declare const self: ServiceWorkerGlobalScope;

const prefix = `${APP_NAMESPACE}::precache::`;
const cacheName = `${prefix}${BUILD_ID}`;
const precache = new PrecacheController({ cacheName, fallbackToNetwork: false });
const inventory = self.__WB_MANIFEST;
// A single injected Workbox inventory owns install, fetch lookup and readiness.
precache.addToCacheList(inventory);
async function workerBuild(worker: ServiceWorker): Promise<string> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel(), requestId = `install:${BUILD_ID}`;
    const finish = (buildId?: string) => {
      clearTimeout(timer); channel.port1.close(); channel.port2.close();
      if (buildId) resolve(buildId); else reject(new Error('Existing cache ownership could not be checked.'));
    };
    const timer = setTimeout(() => finish(), 10000);
    channel.port1.onmessage = event => {
      const reply = event.data;
      if (reply?.type === 'OFFLINE_INVENTORY_RESULT' && reply.requestId === requestId && typeof reply.buildId === 'string') finish(reply.buildId);
    };
    channel.port1.onmessageerror = () => finish();
    try { worker.postMessage({ type: 'OFFLINE_INVENTORY_PROBE', requestId }, [channel.port2]); }
    catch { finish(); }
  });
}
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    // A failed installation can leave an unusable partial cache, including
    // during updates. Reset only this build's cache after checking its owners.
    if (await caches.has(cacheName)) {
      const owners = [self.registration.active, self.registration.waiting].filter((worker): worker is ServiceWorker => worker !== null);
      const builds = await Promise.all(owners.map(workerBuild));
      if (!builds.includes(BUILD_ID)) await caches.delete(cacheName);
    }
    await precache.install(event);
  })());
});
self.addEventListener('activate', precache.activate);

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name !== cacheName && name.startsWith(prefix) && /^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(name.slice(prefix.length))) {
        await caches.delete(name);
      }
    }
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE_URL)) return;
  // Only the actual entry gets a navigation alias. Missing assets never get HTML.
  const entry = event.request.mode === 'navigate' && (url.pathname === BASE_URL || url.pathname === `${BASE_URL}index.html`);
  const lookup = entry ? new URL(`${BASE_URL}index.html`, self.location.origin).href : url.href;
  if (!precache.getCacheKeyForURL(lookup)) return;
  // No network fallback: A must never obtain B's revision of a stable URL.
  event.respondWith(precache.matchPrecache(lookup).then(response => response ?? Response.error()));
});

self.addEventListener('message', event => {
  const request = event.data, port = event.ports[0];
  if (!port || request?.type !== 'OFFLINE_INVENTORY_PROBE' || typeof request.requestId !== 'string') return;
  event.waitUntil((async () => {
    let complete = inventory.length > 0, reason: string | null = null;
    try {
      const cache = await caches.open(cacheName);
      for (const [url, key] of precache.getURLsToCacheKeys()) {
        const resolved = new URL(url);
        if (resolved.origin !== self.location.origin || !resolved.pathname.startsWith(BASE_URL)) throw new Error('out-of-scope-entry');
        const response = await cache.match(key);
        if (!response?.ok) throw new Error('missing-entry');
        // Reading the body is part of readiness, not merely checking key existence.
        await response.arrayBuffer();
      }
    } catch (error) { complete = false; reason = error instanceof Error ? error.message : 'cache-read-failed'; }
    port.postMessage({ type: 'OFFLINE_INVENTORY_RESULT', requestId: request.requestId, buildId: BUILD_ID, complete, reason });
    port.close();
  })());
});
