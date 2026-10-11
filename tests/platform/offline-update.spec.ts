import { test, expect } from '@playwright/test';
import type { Page, TestInfo, APIRequestContext } from '@playwright/test';
import { createHash } from 'node:crypto';

// The assigned runner serves actual built A/B at one /playtest/ origin. Support
// bundles export the unmodified platform modules; they never replace the app.
const cacheA = 'learning-is-fun:/playtest/::precache::local-offline-a';
const cacheB = 'learning-is-fun:/playtest/::precache::local-offline-b';
const loop = '/playtest/assets/audio/village-loop.wav';
async function serve(request: APIRequestContext, candidate: 'a' | 'b', fail = '') {
  const response = await request.post('/__offline-control', { data: { candidate, fail } }); expect(response.ok()).toBe(true);
}
async function observe(page: Page, candidate = 'a') {
  await page.evaluate(`(async()=>{globalThis.offlineModule=await import('/__offline-support/${candidate}.js');globalThis.offlineStatuses=[];
    globalThis.offlineAdapter=offlineModule.registerOfflineApp({onStatus:s=>{globalThis.offlineStatus=s;offlineStatuses.push(s);}});})()`);
}
const status = (page: Page) => page.evaluate<any>('globalThis.offlineStatus');
async function ready(page: Page, candidate = 'a') {
  await expect.poll(async () => (await status(page))?.activeInventoryComplete, { timeout: 20000 }).toBe(true);
  expect((await status(page)).activeBuildId).toBe(`local-offline-${candidate}`);
  expect((await status(page)).pageBuildId).toBe(`local-offline-${candidate}`);
}
async function raw(page: Page) {
  return page.evaluate<any>(`new Promise((resolve,reject)=>{const r=indexedDB.open('learning-is-fun:/playtest/:save');r.onerror=()=>reject(r.error);r.onsuccess=()=>{
    const db=r.result,tx=db.transaction('records'),get=tx.objectStore('records').get('root');get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();};})`);
}
async function capture(page: Page, info: TestInfo, name: string) {
  await info.attach(name, { body: JSON.stringify({ status: await status(page), root: await raw(page),
    caches: await page.evaluate('caches.keys()'), browser: page.context().browser()?.version() }, null, 2), contentType: 'application/json' });
}
async function create(page: Page) {
  await page.getByRole('button', { name: 'Add an explorer', exact: true }).click();
  await page.getByLabel('Nickname', { exact: true }).fill('River');
  await page.getByRole('button', { name: 'Save explorer', exact: true }).click();
  await page.getByRole('button', { name: 'River Choose explorer', exact: true }).click();
}
async function bridge(page: Page, lengths = [6, 6]) {
  await page.getByRole('button', { name: 'Meet Pip at the bridge' }).click();
  await page.getByRole('button', { name: 'A Bridge Back Home', exact: false }).click();
  for (const length of lengths) {
    await page.getByRole('button', { name: `Choose ${length} metre plank`, exact: true }).click();
    await page.getByRole('button', { name: 'Place selected plank at the end', exact: true }).click();
  }
}
async function check(page: Page) {
  await page.getByRole('button', { name: 'Check my idea', exact: true }).click();
  await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
}
async function mediaHashes(page: Page) {
  return page.evaluate<any>(`(async()=>{const result={};for(const path of ['${loop}','/playtest/assets/art/m1/scenes/village-green.svg']){
    const r=await fetch(path),body=await r.arrayBuffer();result[path]=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',body)),b=>b.toString(16).padStart(2,'0')).join('');}return result;})()`);
}
test.beforeEach(async ({ request, context }) => {
  await serve(request, 'a');
  await context.addInitScript(`globalThis.offlineAudio={available:typeof AudioContext==='function',contexts:0,decoded:0,starts:0};const Native=globalThis.AudioContext;
    if(Native)globalThis.AudioContext=new Proxy(Native,{construct(target,args){offlineAudio.contexts++;const ctx=Reflect.construct(target,args),decode=ctx.decodeAudioData.bind(ctx),create=ctx.createBufferSource.bind(ctx);
      ctx.decodeAudioData=async data=>{const result=await decode(data);offlineAudio.decoded++;return result;};ctx.createBufferSource=()=>{const source=create(),start=source.start.bind(source);source.start=(...a)=>{offlineAudio.starts++;return start(...a);};return source;};return ctx;}});`);
});
test.afterEach(async ({ page }, info) => {
  if (info.status !== info.expectedStatus) {
    await capture(page, info, 'failed-original-checkpoint').catch(() => {});
    await info.attach('failure-screen', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' }).catch(() => {});
  }
});

test('complete cached M1 journey, written help, media and committed reload while disconnected', async ({ page, context }, info) => {
  await page.goto('./'); await observe(page); await ready(page);
  await page.reload(); await observe(page); await ready(page);
  await context.setOffline(true); await page.reload();
  // Support script is intentionally outside precache; the real shell supplies status offline.
  await expect(page.getByText('Ready offline', { exact: true })).toBeVisible();
  await create(page); await page.locator('.audio-sound').click();
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  if (await page.evaluate('offlineAudio.available')) await expect.poll(() => page.evaluate('offlineAudio.decoded')).toBeGreaterThan(0);
  else await expect(page.locator('.audio-panel')).toContainText(/unavailable|not supported/i);
  await page.getByRole('button', { name: 'Close sound settings', exact: true }).click();
  await bridge(page); await page.getByRole('button', { name: 'Ask Pip for a hint', exact: true }).click();
  await expect(page.locator('.pip-guidance')).not.toBeEmpty();
  await check(page); await page.getByRole('button', { name: 'Continue without the extra challenge' }).click();
  await page.getByRole('button', { name: 'Wake the Whispering Library' }).click();
  for (const [mark, slot] of [['?', 'question'], ['!', 'discovery']]) {
    await page.getByRole('button', { name: `Choose ${mark}`, exact: true }).click();
    await page.getByRole('button', { name: `Place selected mark in ${slot}`, exact: true }).click();
  }
  await check(page); await page.getByRole('button', { name: 'Continue without the extra challenge' }).click();
  await page.getByRole('button', { name: 'The Merchant’s Welcome' }).click();
  for (const [fruit, count] of [['apple', 6], ['pear', 3]] as const) for (let i = 0; i < count; i++) await page.getByRole('button', { name: `Add one ${fruit}`, exact: true }).click();
  await check(page); await page.getByRole('button', { name: 'Continue without the extra challenge' }).click();
  await page.getByRole('button', { name: 'Gold flowers', exact: true }).click();
  await page.getByRole('button', { name: 'Place planter in spot 2' }).click();
  await page.getByRole('button', { name: 'Save arrangement' }).click();
  await page.getByRole('button', { name: 'Back to village · discard any unsaved preview' }).click();
  await expect(page.getByRole('heading', { name: 'Your first adventure is complete' })).toBeVisible();
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await page.getByRole('button', { name: 'Save progress', exact: true }).click();
  await expect(page.locator('.shell-save')).toContainText('Your progress is saved');
  const before = await raw(page), profile = Object.values(before.save.profiles)[0] as any;
  expect(profile.world.completedQuestIds).toEqual(['Q1', 'Q2', 'Q3']);
  const media = await page.evaluate<any>(`(async()=>{const result={};for(const n of ['village-loop','library-loop','pickup','placement','support','success','restoration']){
    const r=await fetch('/playtest/assets/audio/'+n+'.wav');result[n]={ok:r.ok,bytes:(await r.arrayBuffer()).byteLength};}return result;})()`);
  expect(media['library-loop']).toEqual({ ok: true, bytes: 6773804 }); expect(media['village-loop']).toEqual({ ok: true, bytes: 6173736 });
  expect(Object.values(media).every((r: any) => r.ok && r.bytes > 0)).toBe(true);
  const audioBeforeReload = await page.evaluate('offlineAudio');
  await page.reload(); await page.getByRole('button', { name: 'River Choose explorer', exact: true }).click();
  expect(await page.evaluate('offlineAudio.starts')).toBe(0);
  expect((await raw(page)).save).toEqual(before.save);
  await page.getByRole('button', { name: 'Visit the Hall', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hall of Champions', exact: true })).toBeVisible();
  await info.attach('offline-complete-save-and-media', { body: JSON.stringify({ before, after: await raw(page), media, audioBeforeReload, audioAfterReload: await page.evaluate('offlineAudio') }), contentType: 'application/json' });
  await info.attach('offline-complete-screen', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

test('two actual A clients retain revisions through failed B, waiting B, close-one and next launch', async ({ page, context, request }, info) => {
  await page.goto('./'); await observe(page); await ready(page); await page.reload(); await observe(page); await ready(page);
  await create(page); await page.locator('.audio-sound').click();
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  if (await page.evaluate('offlineAudio.available')) await expect.poll(() => page.evaluate('offlineAudio.decoded')).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Close sound settings', exact: true }).click();
  await bridge(page); await check(page);
  await page.getByRole('button', { name: 'Save progress', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await page.getByRole('button', { name: 'Save progress', exact: true }).click();
  let before = await raw(page); const hashesA = await mediaHashes(page);
  await page.evaluate(`(async()=>{await(await caches.open('another-project:precache:keep')).put('/other-app/sentinel',new Response('keep'));
    await(await caches.open('learning-is-fun:/playtest-extra/::precache::old')).put('/other-app/near-prefix',new Response('keep'));
    await new Promise((resolve,reject)=>{const r=indexedDB.open('other-app-save',1);r.onupgradeneeded=()=>r.result.createObjectStore('sentinel');r.onsuccess=()=>{const db=r.result,tx=db.transaction('sentinel','readwrite');tx.objectStore('sentinel').put('keep','key');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};});})()`);
  const other = await context.newPage(); await other.goto('./'); await observe(other); await ready(other);
  const observer = await context.newPage(); await observer.goto('/blank');
  expect(await observer.evaluate('navigator.serviceWorker.controller')).toBeNull();
  expect(await mediaHashes(observer)).toEqual(hashesA);
  await serve(request, 'b', 'library-loop.wav');
  // Chromium retains these HTTP-fresh entries. Other engines may choose to
  // refetch in an ephemeral context; record that rather than invent a cache hit.
  const httpAfterSwitch = await mediaHashes(observer);
  const expectedB: Record<string, string> = {};
  for (const url of Object.keys(hashesA)) {
    const response = await request.get(url); expect(response.ok()).toBe(true);
    expect(response.headers()['cache-control']).toBe('public, max-age=3600');
    expectedB[url] = createHash('sha256').update(await response.body()).digest('hex');
    expect(expectedB[url]).not.toBe(hashesA[url]);
    expect([hashesA[url], expectedB[url]]).toContain(httpAfterSwitch[url]);
  }
  if (info.project.use.browserName === 'chromium') expect(httpAfterSwitch).toEqual(hashesA);
  await info.attach('fresh-http-cache-A-and-origin-B', { body: JSON.stringify({ hashesA, expectedB, httpAfterSwitch,
    retainedHttpFreshA: Object.keys(hashesA).every(url => httpAfterSwitch[url] === hashesA[url]) }), contentType: 'application/json' });
  await page.evaluate('offlineAdapter.retryPreparation()');
  await expect.poll(async () => { const s = await request.get('/__offline-control'); return (await s.json()).requests.some((r: any) => r.url.includes('library-loop.wav')); }).toBe(true);
  await expect.poll(() => page.evaluate(`navigator.serviceWorker.getRegistration('/playtest/').then(r=>r.installing===null)`)).toBe(true);
  await page.evaluate('offlineAdapter.retryPreparation()'); await ready(page);
  expect((await status(page)).waitingBuildId).toBeNull(); expect(await mediaHashes(page)).toEqual(hashesA);
  await capture(page, info, 'failed-B-retains-A');
  await serve(request, 'b'); await page.evaluate('offlineAdapter.retryPreparation()');
  await expect.poll(async () => (await status(page)).waitingBuildId, { timeout: 20000 }).toBe('local-offline-b');
  const waitingInventory = await observer.evaluate(`(async()=>{const r=await navigator.serviceWorker.getRegistration('/playtest/'),c=new MessageChannel();
    return new Promise(resolve=>{c.port1.onmessage=e=>{c.port1.close();resolve(e.data);};r.waiting.postMessage({type:'OFFLINE_INVENTORY_PROBE',requestId:'waiting-B-checkpoint'},[c.port2]);});})()`);
  await info.attach('waiting-B-inventory-checkpoint', { body: JSON.stringify(waitingInventory), contentType: 'application/json' });
  expect(waitingInventory).toMatchObject({ buildId: 'local-offline-b', complete: true });
  await info.attach('B-install-origin-requests', { body: JSON.stringify(await (await request.get('/__offline-control')).json()), contentType: 'application/json' });
  expect((await status(page)).activeBuildId).toBe('local-offline-a'); expect((await status(page)).activeInventoryComplete).toBe(true);
  expect(await mediaHashes(page)).toEqual(hashesA); expect(await mediaHashes(other)).toEqual(hashesA);
  // Remove a required active entry while a complete B waits: B cannot attest for A.
  await page.evaluate(`(async()=>{const c=await caches.open('${cacheA}'),k=(await c.keys()).find(r=>new URL(r.url).pathname==='${loop}');globalThis.removedKey=k;globalThis.removedBody=await c.match(k);await c.delete(k);document.dispatchEvent(new Event('visibilitychange'));})()`);
  await expect.poll(async () => { const s = await status(page); return s.phase === 'update-waiting' && !s.activeInventoryComplete; }).toBe(true);
  expect((await status(page)).waitingBuildId).toBe('local-offline-b'); await capture(page, info, 'incomplete-A-complete-waiting-B');
  await page.evaluate(`(async()=>{await(await caches.open('${cacheA}')).put(removedKey,removedBody);document.dispatchEvent(new Event('visibilitychange'));})()`); await ready(page);
  await page.getByRole('button', { name: 'Whispering Library', exact: true }).click();
  await page.getByRole('button', { name: 'Wake the Whispering Library', exact: false }).click();
  await page.getByRole('button', { name: 'Choose ?', exact: true }).click();
  await page.getByRole('button', { name: 'Place selected mark in question', exact: true }).click();
  await page.evaluate(`globalThis.abortOfflineSave=true;globalThis.nativePut=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const result=nativePut.apply(this,args);
    if(globalThis.abortOfflineSave&&this.name==='records'){globalThis.abortOfflineSave=false;this.transaction.abort();}return result;};`);
  await page.getByRole('button', { name: 'Update on next launch', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retry saving and continue', exact: true })).toBeVisible();
  await expect(page.locator('.shell-update-instructions')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Place selected mark in question', exact: true })).toBeVisible();
  await capture(page, info, 'native-failed-suspension-blocks-next-launch');
  await page.getByRole('button', { name: 'Retry saving and continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
  await expect(page.locator('.shell-update-instructions')).toBeVisible();
  // Delay the actual IDB transaction acknowledgement, not a replacement facade.
  await page.locator('.audio-sound').click();
  await page.evaluate(`globalThis.holdOfflineCommit=true;globalThis.nativeTxListen=IDBTransaction.prototype.addEventListener;
    IDBTransaction.prototype.addEventListener=function(type,listener,...rest){if(type==='complete'&&this.mode==='readwrite'&&this.db.name==='learning-is-fun:/playtest/:save'&&globalThis.holdOfflineCommit){
      globalThis.holdOfflineCommit=false;return nativeTxListen.call(this,type,event=>{globalThis.releaseOfflineCommit=()=>listener.call(this,event);},...rest);}return nativeTxListen.call(this,type,listener,...rest);};`);
  await page.getByRole('switch', { name: 'Music', exact: true }).click();
  await expect.poll(() => page.evaluate('typeof globalThis.releaseOfflineCommit')).toBe('function');
  await expect(page.locator('.audio-saving')).toContainText('Saving sound choices');
  await page.getByRole('button', { name: 'Update on next launch', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Update on next launch', exact: true })).toBeDisabled();
  await expect(page.locator('.shell-update-instructions')).toHaveCount(0);
  await capture(page, info, 'pending-native-preference-ack-blocks-next-launch');
  await page.evaluate('releaseOfflineCommit();IDBTransaction.prototype.addEventListener=nativeTxListen');
  await expect(page.locator('.shell-update-instructions')).toBeVisible();
  await page.evaluate('globalThis.abortOfflineSave=true');
  await page.getByRole('switch', { name: 'Effects', exact: true }).click();
  await expect(page.locator('.audio-saving')).toContainText('saving is uncertain');
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await page.getByRole('button', { name: 'Update on next launch', exact: true }).click();
  await expect(page.locator('.shell-save')).toContainText('Some changes still need saving');
  await expect(page.locator('.shell-update-instructions')).toHaveCount(0);
  await capture(page, info, 'failed-preferences-block-next-launch-with-immediate-silence');
  await page.getByRole('button', { name: 'Close sound settings', exact: true }).click();
  await page.getByRole('button', { name: 'Grown-ups', exact: true }).click();
  await page.getByRole('button', { name: 'For grown-ups', exact: true }).click();
  await page.getByRole('button', { name: 'Continue to adult area', exact: true }).click();
  await page.getByRole('button', { name: 'Retry preferences', exact: true }).click();
  await expect(page.getByText('Preferences match the committed save.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Exit adult area', exact: true }).click();
  before = await raw(page);
  await page.getByRole('button', { name: 'Update on next launch', exact: true }).click();
  await expect(page.locator('.shell-update-instructions')).toBeVisible();
  expect((await raw(page)).save).toEqual(before.save); await capture(page, info, 'two-clients-A-with-waiting-B');
  await other.close(); await page.evaluate('offlineAdapter.retryPreparation()');
  expect((await status(page)).waitingBuildId).toBe('local-offline-b'); expect((await status(page)).activeBuildId).toBe('local-offline-a');
  await page.close();
  await expect.poll(() => observer.evaluate(`navigator.serviceWorker.getRegistration('/playtest/').then(r=>r?.waiting===null&&r?.active?.state==='activated')`), { timeout: 20000 }).toBe(true);
  const activatedInventory = await observer.evaluate(`(async()=>{const r=await navigator.serviceWorker.getRegistration('/playtest/'),c=new MessageChannel();
    return new Promise(resolve=>{c.port1.onmessage=e=>{c.port1.close();resolve(e.data);};r.active.postMessage({type:'OFFLINE_INVENTORY_PROBE',requestId:'activated-B-checkpoint'},[c.port2]);});})()`);
  await info.attach('activated-B-inventory-checkpoint', { body: JSON.stringify(activatedInventory), contentType: 'application/json' });
  expect(activatedInventory).toMatchObject({ buildId: 'local-offline-b', complete: true });
  const next = await context.newPage(); await next.goto('./'); await observe(next, 'b'); await ready(next, 'b');
  expect(await next.evaluate('offlineAudio.starts')).toBe(0);
  await info.attach('next-launch-native-audio', { body: JSON.stringify(await next.evaluate('offlineAudio')), contentType: 'application/json' });
  expect((await raw(next)).save).toEqual(before.save); expect(await mediaHashes(next)).toEqual(expectedB);
  const cachesAfter = await next.evaluate('caches.keys()'); expect(cachesAfter).not.toContain(cacheA); expect(cachesAfter).toContain(cacheB);
  expect(cachesAfter).toContain('another-project:precache:keep'); expect(cachesAfter).toContain('learning-is-fun:/playtest-extra/::precache::old');
  expect(await next.evaluate(`caches.open('another-project:precache:keep').then(c=>c.match('/other-app/sentinel')).then(r=>r.text())`)).toBe('keep');
  expect(await next.evaluate(`new Promise(resolve=>{const r=indexedDB.open('other-app-save');r.onsuccess=()=>{const db=r.result,get=db.transaction('sentinel').objectStore('sentinel').get('key');get.onsuccess=()=>{db.close();resolve(get.result);};};})`)).toBe('keep');
  await capture(next, info, 'next-launch-B-and-preserved-save'); await next.close(); await observer.close();
});

test('interrupted initial inventory, missing cache, timeout and disposal never report false ready', async ({ page, request }, info) => {
  await serve(request, 'a', 'library-loop.wav'); await page.goto('./'); await observe(page);
  await expect.poll(async () => (await status(page))?.phase, { timeout: 20000 }).toBe('incomplete');
  expect(await page.evaluate('offlineStatuses.some(s=>s.activeInventoryComplete)')).toBe(false);
  await create(page); await capture(page, info, 'interrupted-preparation-online-profile');
  await serve(request, 'a'); await page.evaluate('offlineAdapter.retryPreparation()'); await ready(page);
  await page.evaluate(`globalThis.nativePost=ServiceWorker.prototype.postMessage;ServiceWorker.prototype.postMessage=function(){};document.dispatchEvent(new Event('visibilitychange'));`);
  await expect.poll(async () => (await status(page)).phase, { timeout: 15000 }).toBe('incomplete');
  expect((await status(page)).activeInventoryComplete).toBe(false); await capture(page, info, 'probe-timeout');
  await page.evaluate(`ServiceWorker.prototype.postMessage=nativePost;document.dispatchEvent(new Event('visibilitychange'));`); await ready(page);
  // A genuine older successful response must not overwrite a newer failed probe.
  await page.evaluate(`globalThis.NativeChannel=MessageChannel;globalThis.holdOfflineReply=true;
    globalThis.MessageChannel=class extends NativeChannel {constructor(){super();const port=this.port1,setter=Object.getOwnPropertyDescriptor(MessagePort.prototype,'onmessage').set;
      Object.defineProperty(port,'onmessage',{set(handler){setter.call(port,event=>{if(globalThis.holdOfflineReply&&event.data?.type==='OFFLINE_INVENTORY_RESULT'){
        globalThis.holdOfflineReply=false;globalThis.releaseOfflineReply=()=>handler(event);return;}handler(event);});}});}};
    document.dispatchEvent(new Event('visibilitychange'));`);
  await expect.poll(() => page.evaluate('typeof globalThis.releaseOfflineReply')).toBe('function');
  await page.evaluate(`(async()=>{const c=await caches.open('${cacheA}'),key=(await c.keys()).find(r=>new URL(r.url).pathname==='${loop}');
    globalThis.retryKey=key;globalThis.retryBody=await c.match(key);await c.delete(key);document.dispatchEvent(new Event('visibilitychange'));})()`);
  await expect.poll(async () => (await status(page)).phase).toBe('incomplete');
  await expect(page.locator('.shell-offline-status')).toContainText('Offline preparation incomplete');
  await page.evaluate('releaseOfflineReply()'); expect((await status(page)).activeInventoryComplete).toBe(false);
  await expect(page.locator('.shell-offline-status')).toContainText('Offline preparation incomplete');
  await capture(page, info, 'stale-success-cannot-overwrite-missing-loop');
  await page.evaluate(`(async()=>{globalThis.MessageChannel=NativeChannel;await(await caches.open('${cacheA}')).put(retryKey,retryBody);document.dispatchEvent(new Event('visibilitychange'));})()`); await ready(page);
  const count = await page.evaluate(`offlineAdapter.dispose();offlineStatuses.length`);
  await page.evaluate(`document.dispatchEvent(new Event('visibilitychange'));navigator.serviceWorker.dispatchEvent(new Event('controllerchange'));`);
  expect(await page.evaluate('offlineStatuses.length')).toBe(count);
  expect(await page.evaluate(`navigator.serviceWorker.getRegistration('/playtest/').then(Boolean)`)).toBe(true);
});

test('unavailable registration and declined fullscreen retain online gameplay and written instructions', async ({ page }, info) => {
  await page.addInitScript(`Object.defineProperty(navigator,'serviceWorker',{get(){throw new DOMException('Unavailable','SecurityError')}});`);
  await page.goto('./'); await observe(page);
  expect((await status(page)).phase).toBe('unsupported'); await create(page); await bridge(page, [3]);
  const before = await raw(page);
  await page.getByRole('button', { name: 'Open fullscreen', exact: true }).click();
  await expect(page.locator('.shell-fullscreen-status')).not.toBeEmpty();
  const nativeFullscreen = await page.evaluate('!!document.fullscreenElement');
  if (nativeFullscreen) {
    await page.evaluate('document.exitFullscreen()');
    await expect(page.locator('.shell-fullscreen-status')).toContainText('Back in your browser tab');
  } else await expect(page.locator('.shell-fullscreen-status')).toContainText(/unavailable|not opened/i);
  expect(await raw(page)).toEqual(before);
  const outcomes = await page.evaluate(`(async()=>{const el=document.documentElement;Object.defineProperty(el,'requestFullscreen',{configurable:true,value:undefined});const unavailable=await offlineModule.requestFullscreen(el);
    Object.defineProperty(document,'fullscreenEnabled',{configurable:true,value:true});Object.defineProperty(el,'requestFullscreen',{configurable:true,value:()=>Promise.reject(new DOMException('Denied','NotAllowedError'))});
    return [unavailable,await offlineModule.requestFullscreen(el)];})()`);
  expect(outcomes).toEqual(['unavailable', 'denied']); expect(await raw(page)).toEqual(before);
  await expect(page.getByRole('heading', { name: 'Build your bridge', exact: true })).toBeVisible();
  await capture(page, info, 'unavailable-browser-preserves-draft');
});
