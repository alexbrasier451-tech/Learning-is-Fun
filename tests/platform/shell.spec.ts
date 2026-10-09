import { test, expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

async function probe(page: Page) {
  return page.evaluate(() => {
    const runtime = (globalThis as unknown as { __shellRuntime: any }).__shellRuntime;
    return { snapshot: runtime.state.getSnapshot(), readiness: runtime.state.getUpdateReadiness(),
      transient: runtime.panels.readTransientReadiness(), audio: runtime.audio.getSnapshot(), load: runtime.state.getLoadState() };
  });
}
async function attach(page: Page, info: TestInfo, name: string) {
  await info.attach(name, { body: JSON.stringify(await probe(page), null, 2), contentType: 'application/json' });
}
async function create(page: Page, name: string) {
  await page.getByRole('button', { name: 'Add an explorer', exact: true }).click();
  await page.getByLabel('Nickname', { exact: true }).fill(name);
  await page.getByRole('button', { name: 'Save explorer', exact: true }).click();
  await expect(page.getByRole('button', { name: `${name} Choose explorer`, exact: true })).toBeVisible();
}
async function start(page: Page) {
  await page.goto('./'); await create(page, 'River');
  await page.getByRole('button', { name: 'River Choose explorer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
}
async function openBridge(page: Page) {
  await page.getByRole('button', { name: 'Meet Pip at the bridge' }).click();
  await page.getByRole('button', { name: 'A Bridge Back Home', exact: false }).click();
  await expect(page.getByRole('button', { name: 'Choose 6 metre plank', exact: true })).toBeVisible();
}
async function plank(page: Page, length = 6) {
  const choose=page.getByRole('button', { name: `Choose ${length} metre plank`, exact: true }), place=page.getByRole('button', { name: 'Place selected plank at the end', exact: true });
  if (test.info().project.name.startsWith('T')) { await choose.tap(); await place.tap(); }
  else { await choose.focus(); await choose.press('Enter'); await place.focus(); await place.press('Enter'); }
}
test.afterEach(async ({ page }, info) => {
  await info.attach('browser-and-viewport', { body: JSON.stringify({ browser: page.context().browser()?.version(), project: info.project.name, viewport: page.viewportSize() }), contentType: 'application/json' });
  if (info.status !== info.expectedStatus) await attach(page, info, 'failure-state').catch(() => {});
});
test('real shell keyboard, help focus, Hall, adult barrier and supported reflow', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await start(page); await openBridge(page); await plank(page); await plank(page);
  await info.attach('supported-layout', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await page.getByRole('button', { name: 'Check my idea', exact: true }).focus();
  await page.keyboard.press('Enter'); await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  for (const [name, action] of [['Hazel', 'save'], ['Willow', 'adventure']] as const) {
    await page.getByRole('navigation', { name: 'Your story', exact: true }).getByRole('button', { name: 'Explorers', exact: true }).click();
    await create(page, name); await page.getByRole('button', { name: `${name} Choose explorer`, exact: true }).click();
    await openBridge(page); await plank(page, 3);
    const before = await probe(page), profile = Object.values(before.snapshot.save.profiles).find((p: any) => p.identity.nickname === name) as any;
    const initial = Object.values(profile.encounters)[0] as any;
    expect(initial.validChecks).toBe(0); expect(before.transient.dirty).toBe(true);
    const control = action === 'save' ? page.getByRole('button', { name: 'Save progress', exact: true })
      : page.getByRole('navigation', { name: 'Your story', exact: true }).getByRole('button', { name: 'Adventure', exact: true });
    await control.focus(); await control.press('Enter');
    await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
    await expect(page.locator('.adventure-activity')).toHaveCount(0);
    const suspended = (await probe(page)).snapshot.save.profiles[profile.identity.profileId].encounters[initial.encounterId];
    expect(suspended.learningEpisode.status).toBe('suspended'); expect(suspended.validChecks).toBe(0);
    expect(suspended.opportunityId).toBe(initial.opportunityId); expect(suspended.learningEpisode.ordinal).toBe(initial.learningEpisode.ordinal);
    await expect.poll(async () => (await probe(page)).readiness.ready).toBe(true);
    if (action === 'save') await expect(page.locator('.shell-save')).toContainText('Your progress is saved. Choose where to explore next.');
    await attach(page, info, `F01-${action}-overview`);
    const resume = page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true });
    await resume.focus(); await resume.press('Enter');
    await expect(page.getByRole('button', { name: 'Choose placed plank 1: 3 metres', exact: true })).toBeVisible();
    const reopened = (await probe(page)).snapshot.save.profiles[profile.identity.profileId].encounters[initial.encounterId];
    expect(reopened.learningEpisode.status).toBe('open'); expect(reopened.responseDraft).toEqual(suspended.responseDraft);
    expect(reopened.opportunityId).toBe(initial.opportunityId); expect(reopened.learningEpisode.ordinal).toBe(initial.learningEpisode.ordinal);
    await plank(page, 3); await plank(page, 6);
    await page.getByRole('button', { name: 'Check my idea', exact: true }).focus(); await page.keyboard.press('Enter');
    await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
    expect((await probe(page)).snapshot.save.profiles[profile.identity.profileId].encounters[initial.encounterId].validChecks).toBe(1);
    await attach(page, info, `F01-${action}-resumed-check`);
  }
  const riverId = (Object.values((await probe(page)).snapshot.save.profiles).find((p: any) => p.identity.nickname === 'River') as any).identity.profileId;
  await page.getByLabel('Active explorer', { exact: true }).selectOption(riverId);
  await page.getByRole('button', { name: 'Help', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByText('Music credits',{exact:true}).click();
  await expect(page.getByRole('link',{name:'Jonathan Shaw (InspectorJ)',exact:true})).toHaveAttribute('href','https://www.jshaw.co.uk/');
  await expect(page.getByRole('link',{name:'CC BY 3.0',exact:true})).toHaveAttribute('href','https://creativecommons.org/licenses/by/3.0/');
  await expect(page.getByRole('link',{name:'CC0 1.0',exact:true})).toHaveAttribute('href','https://creativecommons.org/publicdomain/zero/1.0/');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible(); await expect(page.getByRole('button', { name: 'Help', exact: true })).toBeFocused();
  await page.getByRole('navigation', { name: 'Your story', exact: true }).getByRole('button', { name: 'Hall of Champions', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Hall of Champions', exact: true })).toBeVisible();
  await expect(page.getByText('Your saved results are up to date.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'See River’s history', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'River’s history', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back to Hall', exact: true }).click();
  await expect(page.getByRole('button', { name: 'See River’s history', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Grown-ups', exact: true }).click();
  await page.getByRole('button', { name: 'For grown-ups', exact: true }).click();
  await page.getByRole('button', { name: 'Continue to adult area', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Stories, practice and care' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete River', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Delete River', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Exit adult area', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => { (globalThis as unknown as { document: { documentElement: { style: { fontSize: string } } } }).document.documentElement.style.fontSize = '32px'; });
  await page.setViewportSize({ width: 768, height: 1024 });
  expect(await page.evaluate(`Array.from(document.querySelectorAll('button')).filter(e=>e.getClientRects().length).every(e=>{const r=e.getBoundingClientRect();return r.width>=44 && r.height>=44;})`)).toBe(true);
  await expect(page.getByRole('button', { name: 'Silence all', exact: true })).toBeVisible();
  await info.attach('portrait-200-percent', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await page.setViewportSize({ width: 1024, height: 768 });
  expect(await page.evaluate(() => { const d = (globalThis as unknown as { document: { documentElement: { scrollWidth: number; clientWidth: number } } }).document.documentElement; return d.scrollWidth <= d.clientWidth; })).toBe(true);
  await attach(page, info, 'complete-shell'); expect(errors).toEqual([]);
});

test('two-profile suspension failure, exact retry, safe discard and live readiness', async ({ page }, info) => {
  await page.goto('./'); await create(page, 'River'); await create(page, 'Meadow');
  await page.getByRole('button', { name: 'River Choose explorer', exact: true }).click(); await openBridge(page); await plank(page);
  const beforeRotation = await probe(page), answer = await page.locator('.iw-summary').textContent();
  await page.setViewportSize({width:768,height:1024}); await expect(page.locator('.iw-summary')).toHaveText(answer!);
  await info.attach('portrait-current-draft', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await page.setViewportSize({width:1024,height:768}); await expect(page.locator('.iw-summary')).toHaveText(answer!);
  expect((await probe(page)).snapshot).toEqual(beforeRotation.snapshot);
  await page.evaluate(`const runtime=globalThis.__shellRuntime, send=runtime.state.dispatch;globalThis.shellCommands=[];runtime.state.dispatch=async command=>{globalThis.shellCommands.push(structuredClone(command));if(command.kind==='SubmitCheck'&&globalThis.shellHoldCheck){globalThis.shellHoldCheck=false;await new Promise(resolve=>globalThis.releaseShellCheck=resolve);}return send(command);};globalThis.shellHoldCheck=true;`);
  const meadow = Object.values((await probe(page)).snapshot.save.profiles).find((p: any) => p.identity.nickname === 'Meadow') as any;
  const riverId=(Object.values((await probe(page)).snapshot.save.profiles).find((p:any)=>p.identity.nickname==='River') as any).identity.profileId;
  await page.getByRole('button',{name:'Check my idea',exact:true}).click();
  await expect.poll(async()=>(await probe(page)).transient.pending).toBe(true);
  await page.getByLabel('Active explorer',{exact:true}).selectOption(meadow.identity.profileId);
  await expect(page.getByLabel('Active explorer',{exact:true})).toBeDisabled();
  await expect(page.locator('.adventure-player')).toContainText('River');
  await attach(page,info,'pending-original-profile-check'); await page.evaluate('globalThis.releaseShellCheck?.()');
  await expect(page.locator('.adventure-player')).toContainText('Meadow');
  expect((await probe(page)).snapshot.save.profiles[meadow.identity.profileId].rewards.lifetimePoints).toBe(0);
  await page.getByLabel('Active explorer',{exact:true}).selectOption(riverId);
  await page.getByRole('button',{name:'Resume A Bridge Back Home',exact:false}).click();
  await plank(page); await page.evaluate('globalThis.shellCommands=[]');
  expect((await probe(page)).transient.dirty).toBe(true);
  await page.evaluate(`globalThis.abortShellNext = true; const native = IDBObjectStore.prototype.put; IDBObjectStore.prototype.put = function(...args) { const r = native.apply(this,args); if(globalThis.abortShellNext){globalThis.abortShellNext=false;this.transaction.abort();} return r; };`);
  await page.getByLabel('Active explorer', { exact: true }).selectOption(meadow.identity.profileId);
  await expect(page.getByRole('button', { name: 'Retry saving and continue' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose 6 metre plank', exact: true })).toBeVisible();
  expect((await probe(page)).readiness.ready).toBe(false); await attach(page, info, 'failed-leave');
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await page.getByRole('button', { name: 'Retry saving and continue' }).click();
  await expect(page.locator('.shell-leave')).toContainText('save changed elsewhere');
  const suspensions=await page.evaluate(`globalThis.shellCommands.filter(command=>command.kind==='SuspendEncounter')`) as unknown[];
  expect(suspensions.length).toBe(2); expect(suspensions[1]).toEqual(suspensions[0]);
  await page.getByRole('button', { name: 'Retry saving and continue' }).click();
  await expect(page.locator('.adventure-player')).toContainText('Meadow');
  expect((await probe(page)).transient).toEqual({ dirty: false, pending: false, failed: false });
  const river = Object.values((await probe(page)).snapshot.save.profiles).find((p: any) => p.identity.nickname === 'River') as any;
  await page.getByLabel('Active explorer', { exact: true }).selectOption(river.identity.profileId);
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: false }).click();
  await plank(page); await page.evaluate('globalThis.abortShellNext=true');
  await page.getByLabel('Active explorer', { exact: true }).selectOption(meadow.identity.profileId);
  await expect(page.getByRole('button', { name: 'Discard unsaved draft and continue' })).toBeVisible();
  const unrelated=await page.evaluate(async()=>{const g=globalThis as unknown as {__shellRuntime:any;abortShellNext:boolean};g.abortShellNext=true;
    const state=g.__shellRuntime.state;const other=Object.values(state.getSnapshot().save.profiles).find((p:any)=>p.identity.nickname==='Meadow') as any;
    return state.dispatch(state.prepareCommand({kind:'RenameProfile',profileId:other.identity.profileId,payload:{nickname:'Meadow flower'}}));});
  expect(unrelated.status).toBe('save-failed');
  await page.getByRole('button', { name: 'Discard unsaved draft and continue' }).click();
  await expect(page.locator('.adventure-player')).toContainText('Meadow');
  expect((await probe(page)).transient).toEqual({ dirty: false, pending: false, failed: false });
  expect((await probe(page)).readiness.failedCommand).toBe(true);
  await attach(page, info, 'retry-and-discard');
  await openBridge(page); await plank(page, 3); await page.evaluate('globalThis.abortShellNext=true');
  await page.getByRole('button', { name: 'Save progress', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retry saving and continue' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose placed plank 1: 3 metres', exact: true })).toBeVisible();
  await expect(page.locator('.adventure-player')).toContainText('Meadow');
  await attach(page, info, 'F01-failed-save-keeps-draft');
  await page.getByRole('button', { name: 'Retry saving and continue' }).click();
  await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
  await expect(page.locator('.adventure-activity')).toHaveCount(0);
  await expect(page.locator('.shell-save')).toContainText('Your activity is saved. Some other changes still need saving');
  expect((await probe(page)).readiness.ready).toBe(false); expect((await probe(page)).readiness.failedCommand).toBe(true);
  expect((await probe(page)).transient).toEqual({ dirty: false, pending: false, failed: false });
  await attach(page, info, 'F01-saved-activity-retains-independent-blocker');
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await plank(page, 3); await plank(page, 6); await page.getByRole('button', { name: 'Check my idea', exact: true }).click();
  await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  expect((await probe(page)).readiness.failedCommand).toBe(true);
});

test('native audio cold start, pending decode silence, channels, pause, reload and failed read recovery', async ({ page }, info) => {
  await page.addInitScript(`
    globalThis.shellMedia = { contexts:0, starts:0, decoded:0, released:false };
    const Native = globalThis.AudioContext; globalThis.shellMedia.nativeAvailable = typeof Native === 'function';
    if (typeof Native === 'function') {
    globalThis.AudioContext = new Proxy(Native, { construct(target,args){
      globalThis.shellMedia.contexts++; let ctx; try {ctx=Reflect.construct(target,args);} catch(error) {globalThis.shellMedia.error=String(error);throw error;}
      const decode=ctx.decodeAudioData.bind(ctx); ctx.decodeAudioData=async bytes=> {
        const buffer=await decode(bytes); globalThis.shellMedia.decoded++;
        if(!globalThis.shellMedia.released) await new Promise(resolve=>globalThis.releaseShellDecode=resolve); return buffer;
      };
      const create=ctx.createBufferSource.bind(ctx); ctx.createBufferSource=()=>{const s=create(),start=s.start.bind(s);s.start=(...a)=>{globalThis.shellMedia.starts++;start(...a);};return s;};return ctx;
    }}); }
  `);
  await start(page);
  expect(await page.evaluate('globalThis.shellMedia.contexts')).toBe(0);
  expect((await probe(page)).audio.loadStatus).toBe('loaded');
  await page.locator('.audio-sound').click();
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await info.attach('native-context-state', { body: JSON.stringify(await page.evaluate('globalThis.shellMedia')), contentType: 'application/json' });
  if (await page.evaluate('globalThis.shellMedia.nativeAvailable')) await expect.poll(() => page.evaluate('globalThis.shellMedia.decoded')).toBeGreaterThan(0);
  else expect((await probe(page)).audio.activation).toBe('unavailable');
  await expect.poll(async () => (await probe(page)).audio.persistence.pending).toBe(false);
  await page.evaluate(`globalThis.shellAbortPreference=true;const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const request=put.apply(this,args);if(globalThis.shellAbortPreference){globalThis.shellAbortPreference=false;this.transaction.abort();}return request;};`);
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  expect((await probe(page)).audio.preferences.silenceAll).toBe(true);
  await expect.poll(async () => (await probe(page)).audio.persistence.failed).toBe(true);
  await page.evaluate('globalThis.shellMedia.released=true; globalThis.releaseShellDecode?.()');
  expect(await page.evaluate('globalThis.shellMedia.starts')).toBe(0);
  await attach(page, info, 'failed-preference-keeps-immediate-silence');
  await page.evaluate(async()=>{await (globalThis as unknown as {__shellRuntime:any}).__shellRuntime.state.preferences.retry();});
  await expect.poll(async () => (await probe(page)).audio.persistence.failed).toBe(false);
  await page.getByRole('switch', { name: 'Music', exact: true }).click();
  await page.getByRole('slider', { name: 'Effects volume', exact: true }).fill('0');
  expect((await probe(page)).audio.preferences.silenceAll).toBe(true);
  await expect.poll(async () => (await probe(page)).audio.persistence.pending).toBe(false);
  await page.getByRole('button', { name: 'Close sound settings', exact: true }).click();
  await page.getByRole('button', { name: 'Pause sound', exact: true }).click();
  expect((await probe(page)).audio.visible).toBe(false);
  await page.getByRole('button', { name: 'Resume sound', exact: true }).click();
  expect((await probe(page)).audio.visible).toBe(true);
  await page.evaluate(`window.dispatchEvent(new Event('pagehide'))`);
  expect((await probe(page)).audio.visible).toBe(false);
  await page.evaluate(`window.dispatchEvent(new Event('pageshow'))`);
  expect((await probe(page)).audio.visible).toBe(true);
  await attach(page, info, 'pending-decode-and-latch');
  for (let visit=0;visit<3;visit++) {
    await page.getByRole('button',{name:'Explorers',exact:true}).click();
    await page.getByRole('button',{name:'River Selected explorer',exact:true}).click();
    await expect(page.getByRole('heading',{name:'Village Green',exact:true})).toBeVisible();
  }
  expect(await page.evaluate('globalThis.shellMedia.contexts')).toBe(await page.evaluate('globalThis.shellMedia.nativeAvailable ? 1 : 0'));
  await page.evaluate(async () => { const g=globalThis as unknown as {__shellRuntime:any;shellAfterDispose:number};const r=g.__shellRuntime;g.shellAfterDispose=0;
    r.audio.subscribe(()=>g.shellAfterDispose++);r.state.subscribe(()=>g.shellAfterDispose++);r.dispose();r.dispose();
    r.audio.playEffect('restoration');r.audio.silenceAll();r.audio.setVisible(true);await r.audio.enableSoundFromGesture();await r.state.refresh(); });
  expect(await page.evaluate('globalThis.shellAfterDispose')).toBe(0);
  await page.reload(); await expect(page.getByRole('heading', { name: 'Who’s exploring today?' })).toBeVisible();
  expect(await page.evaluate('globalThis.shellMedia.contexts')).toBe(0);
  expect((await probe(page)).audio.preferences.music.muted).toBe(true);
  expect((await probe(page)).audio.preferences.effects.volume).toBe(0);
  expect((await probe(page)).audio.preferences.silenceAll).toBe(true);
  await page.addInitScript(`globalThis.shellOpen=indexedDB.open.bind(indexedDB);indexedDB.open=()=>{throw new Error('test read failure');};`);
  await page.reload(); await expect(page.getByRole('heading', { name: 'Your saved story needs a little care' })).toBeVisible();
  await page.locator('.audio-sound').click();
  await expect(page.getByText('Sound settings could not be loaded. Everything stays quiet.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enable sound', exact: true })).toHaveCount(0);
  expect(await page.evaluate('globalThis.shellMedia.contexts')).toBe(0);
  await info.attach('read-failed-startup', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

test('token registry stale cleanup, live readiness, guarded pending epoch replacement and disposal', async ({ page }, info) => {
  await page.goto('./'); await create(page, 'River'); await create(page, 'Meadow');
  await page.getByRole('button', { name: 'River Choose explorer', exact: true }).click();
  const result = await page.evaluate(async () => {
    const url='/playtest/src/app/createAppRuntime.ts'; const {createActivePanelRegistry}=await import(url);
    const registry=createActivePanelRegistry(); let notifyOld=()=>{}; let secondDirty=false;
    const old={getStatus:()=>({dirty:false,pending:false,failed:false}),subscribe:(fn:()=>void)=>{notifyOld=fn;return()=>{};},suspend:async()=>({status:'ready'}),discardDraft:()=>({status:'ready'})};
    const removeOld=registry.host.register(old), staleNotify=notifyOld;
    const second={...old,getStatus:()=>({dirty:secondDirty,pending:false,failed:false})};
    const removeSecond=registry.host.register(second); secondDirty=true; removeOld(); staleNotify();
    const stale=registry.readTransientReadiness(); removeSecond(); const orphan=registry.readTransientReadiness(); registry.resetBinding(); const reset=registry.readTransientReadiness(); registry.dispose();
    const g=globalThis as unknown as {__shellRuntime:any;releaseShellLeave?:()=>void; shellEpochEvents?:unknown[];installShellPending:()=>void;orphanShellPanel:()=>void};
    const runtime=g.__shellRuntime; let isPending=false;const events:unknown[]=[];g.shellEpochEvents=events;
    g.installShellPending=()=> { g.orphanShellPanel=runtime.panels.host.register({getStatus:()=>({dirty:true,pending:isPending,failed:false}),subscribe:()=>()=>{},
      suspend:async()=>{isPending=true;events.push({stage:'suspend',token:runtime.state.getSnapshot().token}); await new Promise<void>(resolve=>g.releaseShellLeave=resolve);isPending=false;events.push({stage:'ready',token:runtime.state.getSnapshot().token});return {status:'ready'};},discardDraft:()=>({status:'blocked',message:'Wait for saving.'})});
    }; g.installShellPending();
    return {stale,orphan,reset};
  });
  expect(result.stale.dirty).toBe(true); expect(result.orphan.dirty).toBe(true); expect(result.reset).toEqual({dirty:false,pending:false,failed:false});
  await page.evaluate('globalThis.orphanShellPanel()');
  await page.getByRole('navigation',{name:'Your story',exact:true}).getByRole('button',{name:'Hall of Champions',exact:true}).click();
  await expect(page.locator('.shell-leave')).toContainText('still needs saving');
  await expect(page.locator('.adventure-player')).toContainText('River');
  expect((await probe(page)).readiness.unsavedTransition).toBe(true);
  await attach(page,info,'cleanup-keeps-blocker');
  await page.evaluate('globalThis.__shellRuntime.panels.resetBinding()');
  await page.getByRole('navigation',{name:'Your story',exact:true}).getByRole('button',{name:'Adventure',exact:true}).click();
  await page.evaluate('globalThis.installShellPending()');
  const meadow=Object.values((await probe(page)).snapshot.save.profiles).find((p:any)=>p.identity.nickname==='Meadow') as any;
  await page.getByLabel('Active explorer', {exact:true}).selectOption(meadow.identity.profileId);
  await expect(page.getByLabel('Active explorer', {exact:true})).toBeDisabled();
  expect((await probe(page)).transient.pending).toBe(true); await page.getByRole('button',{name:'Silence all',exact:true}).click();
  await expect.poll(async () => (await probe(page)).audio.persistence.pending).toBe(false);
  await page.evaluate(async () => {
    const runtime=(globalThis as unknown as {__shellRuntime:any}).__shellRuntime;
    await runtime.state.dispatch(runtime.state.prepareCommand({kind:'ResetSave',payload:{}}));
  });
  await expect(page.getByRole('heading',{name:'Who’s exploring today?'})).toBeVisible();
  await page.evaluate('globalThis.releaseShellLeave?.()');
  await expect(page.getByRole('heading',{name:'Who’s exploring today?'})).toBeVisible();
  expect((await probe(page)).transient).toEqual({dirty:false,pending:false,failed:false});
  await attach(page,info,'registry-epoch-replacement');
  await create(page,'River'); await create(page,'Meadow'); await page.getByRole('button',{name:'River Choose explorer',exact:true}).click();
  await page.evaluate('globalThis.installShellPending()');
  const profiles=(await probe(page)).snapshot.save.profiles;
  const remaining=(Object.values(profiles).find((p:any)=>p.identity.nickname==='Meadow') as any).identity.profileId;
  const deleted=(Object.values(profiles).find((p:any)=>p.identity.nickname==='River') as any).identity.profileId;
  await page.getByLabel('Active explorer',{exact:true}).selectOption(remaining);
  await expect(page.getByLabel('Active explorer',{exact:true})).toBeDisabled();
  await page.evaluate(async id=>{const state=(globalThis as unknown as {__shellRuntime:any}).__shellRuntime.state;await state.dispatch(state.prepareCommand({kind:'DeleteProfile',profileId:id,payload:{}}));},deleted);
  await expect(page.getByRole('heading',{name:'Who’s exploring today?'})).toBeVisible();
  await page.evaluate('globalThis.releaseShellLeave?.()');
  await expect(page.getByRole('heading',{name:'Who’s exploring today?'})).toBeVisible();
  await expect(page.getByLabel('Active explorer',{exact:true})).toHaveValue('');
  expect(Object.keys((await probe(page)).snapshot.save.profiles)).toEqual([remaining]);
  await attach(page,info,'deleted-binding-ignores-late-leave');
  await page.evaluate(async()=>{const runtime=(globalThis as unknown as {__shellRuntime:any}).__shellRuntime;runtime.dispose();runtime.dispose();});
  await page.getByRole('button',{name:'Silence all',exact:true}).click();
});
