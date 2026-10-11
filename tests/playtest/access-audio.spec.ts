import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Native objects remain native: these wrappers record their actual gain/source
// paths. They neither dispatch game commands nor certify acoustic listening.
export async function observeNativeAudio(page: Page) {
  await page.addInitScript(() => {
    const w = window as any;
    w.boundaryAudio = { contexts: [], sources: [], gains: [], resumes: 0 };
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      constructor(...args: ConstructorParameters<typeof AudioContext>) {
        super(...args); w.boundaryAudio.contexts.push(this);
      }
      resume() { w.boundaryAudio.resumes++; return super.resume(); }
      createGain() { const g = super.createGain(); w.boundaryAudio.gains.push(g); return g; }
      createBufferSource() {
        const source = super.createBufferSource();
        const item = { source, started: false, stopped: false, ended: false };
        w.boundaryAudio.sources.push(item);
        const start = source.start.bind(source), stop = source.stop.bind(source);
        source.start = (...args) => { item.started = true; start(...args); };
        source.stop = (...args) => { item.stopped = true; stop(...args); };
        source.addEventListener('ended', () => { item.ended = true; });
        return source;
      }
    };
  });
}
async function audio(page: Page) {
  return page.evaluate(() => {
    const a = (window as any).boundaryAudio;
    return { contexts: a.contexts.map((c: AudioContext) => c.state), resumes: a.resumes,
      gains: a.gains.map((g: GainNode) => g.gain.value),
      sources: a.sources.map((s: any) => ({ started: s.started, stopped: s.stopped, ended: s.ended,
        loop: s.source.loop, seconds: s.source.buffer?.duration })),
      speaking: speechSynthesis.speaking, pendingSpeech: speechSynthesis.pending };
  });
}
const active = (a: Awaited<ReturnType<typeof audio>>) => a.sources.filter((s: any) => s.started && !s.stopped && !s.ended);
async function input(page: Page, name: string, touch: boolean) {
  const control = page.getByRole('button', { name, exact: true });
  if (touch) await control.tap(); else { await control.focus(); await page.keyboard.press('Enter'); }
}

test('published native audio consent, channels, pause, silence and reload', async ({ page, context }, info) => {
  test.setTimeout(90000);
  const touch = info.project.name.startsWith('T1');
  const evidence: any[] = [];
  await observeNativeAudio(page);
  await page.goto('./');
  await input(page, 'Help', touch);
  await expect(page.getByText(`Game version: ${process.env.PLAYTEST_BUILD_ID}`, { exact: true })).toBeVisible();
  await input(page, 'Back to my story', touch);
  expect((await audio(page)).contexts).toEqual([]);
  await input(page, 'Add an explorer', touch);
  await page.getByRole('textbox', { name: 'Nickname', exact: true }).fill('Audio Boundary');
  await input(page, 'Save explorer', touch);
  await input(page, 'Audio Boundary Choose explorer', touch);
  await input(page, 'Meet Pip at the bridge', touch);
  await input(page, 'A Bridge Back Home', touch);
  await page.getByRole('button', { name: /^Sound/ }).click();
  await input(page, 'Enable sound', touch);
  await expect.poll(async () => active(await audio(page)).filter((s: any) => s.loop).length).toBe(1);
  evidence.push({ step: 'explicit consent', native: await audio(page) });
  for (const channel of ['Music', 'Effects']) {
    for (const value of ['0', '50', '100']) {
      // Native keyboard slider interaction, including in the emulated touch case.
      const slider = page.getByRole('slider', { name: `${channel} volume` });
      await slider.focus(); await page.keyboard.press('Home');
      if (value === '50') for (let i = 0; i < 50; i++) await page.keyboard.press('ArrowRight');
      if (value === '100') await page.keyboard.press('End');
      await expect(slider).toHaveValue(value);
      // A disconnected native graph can retain a stale AudioParam.value. Zero
      // and mute are proved by stopped sources; inspect gain while rendering.
      if (channel === 'Music' && value !== '0')
        await expect.poll(async () => (await audio(page)).gains[1]).toBe(Number(value) / 100);
      if (channel === 'Music' && value === '0')
        expect(active(await audio(page)).filter((s: any) => s.loop)).toEqual([]);
      if (channel === 'Effects') {
        const count = (await audio(page)).sources.length;
        await input(page, 'Choose 6 metre plank', touch);
        if (value === '0') expect((await audio(page)).sources.length).toBe(count);
        else {
          await expect.poll(async () => (await audio(page)).sources.length).toBeGreaterThan(count);
          await expect.poll(async () => (await audio(page)).gains[2]).toBe(Number(value) / 100);
        }
      }
      evidence.push({ step: `${channel} ${value}`, native: await audio(page) });
    }
    const toggle = page.getByRole('switch', { name: channel, exact: true });
    if (touch) await toggle.tap(); else await toggle.click();
    await page.getByRole('slider', { name: `${channel} volume` }).fill('50');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    evidence.push({ step: `${channel} stays muted after volume`, native: await audio(page) });
  }
  expect(active(await audio(page))).toEqual([]);
  await page.getByRole('switch', { name: 'Music', exact: true }).click();
  const effectCount = (await audio(page)).sources.filter((s: any) => !s.loop).length;
  await input(page, 'Choose 5 metre plank', touch);
  expect((await audio(page)).sources.filter((s: any) => !s.loop).length).toBe(effectCount);
  evidence.push({step:'music on while effects remain muted',native:await audio(page)});
  await page.getByRole('switch', { name: 'Effects', exact: true }).click();
  await input(page, 'Close sound settings', touch);
  await input(page, 'Pause sound', touch);
  expect(active(await audio(page))).toEqual([]);
  await input(page, 'Resume sound', touch);
  await expect.poll(async () => active(await audio(page)).filter((s: any) => s.loop).length).toBe(1);
  await input(page, 'Silence all', touch);
  expect(active(await audio(page))).toEqual([]);
  expect((await audio(page)).speaking).toBe(false);
  await input(page, 'Save progress', touch);
  await expect(page.getByText(/^Your progress is saved\./)).toBeVisible();
  await page.reload();
  await input(page, 'Audio Boundary Choose explorer', touch);
  await input(page, 'Pause sound', touch); await input(page, 'Resume sound', touch);
  expect((await audio(page)).contexts).toEqual([]);
  await page.getByRole('button', { name: /^Sound/ }).click();
  await expect(page.getByText('Silence all is on. Music, effects and reading are stopped.', { exact: true })).toBeVisible();
  await input(page, 'Exit Silence all', touch);
  await expect.poll(async () => active(await audio(page)).filter((s: any) => s.loop).length).toBe(1);
  evidence.push({ step: 'deliberate exit after reload', native: await audio(page) });
  await input(page, 'Silence all', touch);
  await info.attach('native-audio-observations', { body: JSON.stringify({ browser: context.browser()?.version(), viewport: page.viewportSize(), touch,
    sliderInput: 'keyboard', acousticStatus: 'unverified', evidence }, null, 2), contentType: 'application/json' });
  await info.attach('sound-controls', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

// Corrected published C only. B's original evidence and genuine export stay
// frozen in their original build directory; no production command is invoked.
const correctedBuild = '4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1';
const genuineStarter = resolve('artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/starter-save.json');
const soundSaved = 'Sound choices saved on this device.';
const soundFailed = 'Your choices apply now, but saving is uncertain. They may not be remembered after you leave.';
const soundRetry = 'Retry saving sound choices';
async function preferenceRoot(page: Page): Promise<any> {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('learning-is-fun:/Learning-is-Fun/:save');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction('records'), read = tx.objectStore('records').get('root');
      let value: unknown; read.onsuccess = () => { value = read.result; };
      tx.oncomplete = () => { db.close(); resolve(value); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  }));
}
async function preferenceAbort(page: Page) {
  await page.evaluate(() => {
    const w = window as any, put = IDBObjectStore.prototype.put;
    w.preferenceAborts ??= [];
    w.restorePreferencePut = () => { IDBObjectStore.prototype.put = put; };
    IDBObjectStore.prototype.put = function (...args) {
      const result = put.apply(this, args);
      if (this.transaction.db.name === 'learning-is-fun:/Learning-is-Fun/:save') {
        w.preferenceAborts.push(structuredClone(args[0])); this.transaction.abort();
      }
      return result;
    };
  });
}
async function holdPreferenceCommits(page: Page) {
  await page.evaluate(() => {
    const w = window as any, put = IDBObjectStore.prototype.put;
    w.preferenceHeld = [];
    w.restorePreferencePut = () => { IDBObjectStore.prototype.put = put; };
    IDBObjectStore.prototype.put = function (...args) {
      const request = put.apply(this, args);
      if (this.transaction.db.name === 'learning-is-fun:/Learning-is-Fun/:save') {
        const record = { candidate: structuredClone(args[0]), released: false, completed: false, aborted: false, watchdog: false };
        w.preferenceHeld.push(record);
        const timer = setTimeout(() => { record.watchdog = true; record.released = true; }, 30000);
        this.transaction.addEventListener('complete', () => { record.completed = true; clearTimeout(timer); });
        this.transaction.addEventListener('abort', () => { record.aborted = true; clearTimeout(timer); });
        // Real native reads keep this real transaction alive. No repository
        // result, application acknowledgement or candidate is replaced.
        const keepAlive = () => { if (!record.released) this.get('root').onsuccess = keepAlive; };
        keepAlive();
      }
      return request;
    };
  });
}
async function reachRetry(page: Page, touch: boolean) {
  const retry = page.getByRole('button', {name:soundRetry,exact:true});
  if (touch) { await retry.tap(); return ['native tap']; }
  const path: string[] = [];
  // Start from the toolbar button already used in this flow, then traverse
  // native Tab order; do not focus the retry target programmatically.
  await page.getByRole('button',{name:'Silence all',exact:true}).focus();
  for (let i=0;i<30;i++) {
    await page.keyboard.press('Tab');
    path.push(await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent ?? ''));
    if (await retry.evaluate(node => node === document.activeElement)) {
      await page.keyboard.press('Enter'); return path;
    }
  }
  throw new Error('Retry sound choices was not reached by native Tab traversal');
}
const playbackCounts = (a: Awaited<ReturnType<typeof audio>>) => ({contexts:a.contexts.length,resumes:a.resumes,
  starts:a.sources.filter((s:any)=>s.started).length,active:active(a).length,speaking:a.speaking,pendingSpeech:a.pendingSpeech});

for (const newer of [false,true]) test(`published F01 C ${newer?'newer preferences during held retry':'original imported library recovery'}`, async ({page,context},info) => {
  test.setTimeout(120000);
  const touch = info.project.name.startsWith('T1'), evidence: any[] = [];
  const press = (name:string) => input(page,name,touch);
  const sound = page.getByRole('region',{name:'Music, effects and reading',exact:true});
  try {
    await observeNativeAudio(page); await page.goto('./');
    await press('Help');
    await expect(page.getByText(`Game version: ${correctedBuild}`,{exact:true})).toBeVisible();
    await press('Back to my story');
    await expect(page.getByText('Ready offline',{exact:true})).toBeVisible({timeout:60000});
    const worker = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration(location.pathname);
      return new Promise<any>((resolve,reject) => {
        const channel = new MessageChannel(), timer = setTimeout(()=>reject(Error('worker probe timeout')),10000);
        channel.port1.onmessage = e => {clearTimeout(timer);channel.port1.close();resolve(e.data);};
        registration!.active!.postMessage({type:'OFFLINE_INVENTORY_PROBE',requestId:'f01-C'},[channel.port2]);
      });
    });
    expect(worker).toMatchObject({buildId:correctedBuild,complete:true});
    evidence.push({stage:'C-identity',worker});
    if (!newer) {
      for(const name of ['Grown-ups','For grown-ups','Continue to adult area']) await press(name);
      await page.locator('input[type=file]').setInputFiles(genuineStarter);
      await press('Confirm whole-save replacement');
      await expect(page.getByRole('button',{name:'River Boundary Choose explorer',exact:true})).toBeVisible();
      const imported = await preferenceRoot(page);
      expect(imported.save).toEqual(JSON.parse(await readFile(genuineStarter,'utf8')).save);
      evidence.push({stage:'genuine-starter-import',root:imported});
      await press('River Boundary Choose explorer');
    } else {
      await press('Add an explorer');
      await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('Newer C Boundary');
      await press('Save explorer'); await press('Newer C Boundary Choose explorer');
    }
    const openSound = page.getByRole('button',{name:/^Sound/});
    if(touch) await openSound.tap(); else await openSound.click();
    await press(newer?'Enable sound':'Exit Silence all');
    if(!newer) for(const channel of ['Music','Effects']) {
      const toggle=page.getByRole('switch',{name:channel,exact:true});
      if(touch) await toggle.tap(); else {await toggle.focus();await page.keyboard.press('Space');}
    }
    await expect.poll(async()=>active(await audio(page)).filter((s:any)=>s.loop).length,{timeout:30000}).toBe(1);
    await press('Close sound settings'); await press('Pause sound');
    expect(active(await audio(page))).toEqual([]); await press('Resume sound');
    if(!newer) {
      await press('Whispering Library');
      await expect.poll(async()=>active(await audio(page)).some((s:any)=>Math.abs(s.seconds-76.8)<.01),{timeout:30000}).toBe(true);
    }
    await expect.poll(async()=>active(await audio(page)).length).toBe(1);
    if(touch) await openSound.tap(); else await openSound.click();
    await expect(page.getByText(soundSaved,{exact:true})).toBeVisible();
    const before=await preferenceRoot(page);
    evidence.push({stage:'before-native-abort',root:before,native:await audio(page)});
    await preferenceAbort(page); await press('Silence all');
    await expect(page.getByText(soundFailed,{exact:true})).toBeVisible();
    expect(await preferenceRoot(page)).toEqual(before);
    expect(active(await audio(page))).toEqual([]);
    expect(await audio(page)).toMatchObject({speaking:false,pendingSpeech:false});
    expect((await audio(page)).gains[0]).toBe(0);
    evidence.push({stage:'abort-live-stop',root:await preferenceRoot(page),native:await audio(page),candidates:await page.evaluate(()=>(window as any).preferenceAborts)});
    await info.attach('C-native-abort-screen',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
    await page.evaluate(()=>(window as any).restorePreferencePut());
    await press('Save progress');
    await expect(page.getByText('Some changes still need saving. Stay here and retry the action that could not save.',{exact:true})).toBeVisible();
    await press('Silence all');
    expect(await preferenceRoot(page)).toEqual(before);
    await expect(page.getByRole('button',{name:soundRetry,exact:true})).toBeVisible();
    if(newer) {
      await preferenceAbort(page); await reachRetry(page,touch);
      await expect(page.getByText(soundFailed,{exact:true})).toBeVisible();
      expect(await preferenceRoot(page)).toEqual(before);
      evidence.push({stage:'repeated-native-abort',root:await preferenceRoot(page),candidates:await page.evaluate(()=>(window as any).preferenceAborts)});
      await page.evaluate(()=>(window as any).restorePreferencePut());
    }
    const stopped=playbackCounts(await audio(page));
    await holdPreferenceCommits(page);
    const keyboardPath=await reachRetry(page,touch);
    await expect.poll(()=>page.evaluate(()=>(window as any).preferenceHeld.length)).toBe(1);
    await expect(page.getByText('Saving sound choices…',{exact:true})).toBeVisible();
    await expect(page.getByText(soundSaved,{exact:true})).toHaveCount(0);
    await expect(page.getByRole('button',{name:soundRetry,exact:true})).toHaveCount(0);
    expect(playbackCounts(await audio(page))).toEqual(stopped);
    evidence.push({stage:'native-retry-held',keyboardPath,ui:await sound.innerText(),native:await audio(page),transactions:await page.evaluate(()=>(window as any).preferenceHeld)});
    if(newer) {
      for(const [channel,value] of [['Music','37'],['Effects','19']]) {
        const toggle=page.getByRole('switch',{name:channel,exact:true});
        if(touch) await toggle.tap(); else {await toggle.focus();await page.keyboard.press('Space');}
        const slider=page.getByRole('slider',{name:`${channel} volume`});
        await slider.focus();await page.keyboard.press('Home');
        for(let i=0;i<Number(value);i++) await page.keyboard.press('ArrowRight');
        await expect(slider).toHaveValue(value);
        await expect(toggle).toHaveAttribute('aria-checked','false');
      }
      expect(await page.evaluate(()=>(window as any).preferenceHeld.length)).toBe(1);
      await page.evaluate(()=>{(window as any).preferenceHeld[0].released=true;});
      await expect.poll(()=>page.evaluate(()=>(window as any).preferenceHeld.length)).toBe(2);
      await expect(page.getByText('Saving sound choices…',{exact:true})).toBeVisible();
      await expect(page.getByText(soundSaved,{exact:true})).toHaveCount(0);
      const partial=await page.evaluate(()=>(window as any).preferenceHeld);
      expect(partial[0].completed).toBe(true);expect(partial[1].completed).toBe(false);
      expect(playbackCounts(await audio(page))).toEqual(stopped);
      evidence.push({stage:'older-commit-newer-still-pending',ui:await sound.innerText(),native:await audio(page),transactions:partial});
    }
    await page.evaluate(()=>{const w=window as any;w.preferenceHeld.forEach((r:any)=>r.released=true);w.restorePreferencePut();});
    await expect(page.getByText(soundSaved,{exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:soundRetry,exact:true})).toHaveCount(0);
    const after=await preferenceRoot(page), expected=structuredClone(before);
    expected.revision+=newer?2:1;expected.save.installation.audio.silenceAll=true;
    if(newer) {expected.save.installation.audio.music={muted:true,volume:.37};expected.save.installation.audio.effects={muted:true,volume:.19};}
    expect(after).toEqual(expected);expect(playbackCounts(await audio(page))).toEqual(stopped);
    const transactions=await page.evaluate(()=>(window as any).preferenceHeld);
    expect(transactions).toHaveLength(newer?2:1);
    for(const transaction of transactions) expect(transaction).toMatchObject({completed:true,aborted:false,watchdog:false});
    await press('Save progress');
    await expect(page.getByText('Your progress is saved.',{exact:true})).toBeVisible();
    await expect(page.getByText('Ready offline',{exact:true})).toBeVisible();
    evidence.push({stage:'committed-and-ready',root:after,native:await audio(page),transactions,ui:await page.locator('body').innerText()});
    await info.attach('C-retry-saved-screen',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
    await page.reload();
    if(touch) await openSound.tap(); else await openSound.click();
    await expect(page.getByText('Silence all is on. Music, effects and reading are stopped.',{exact:true})).toBeVisible();
    await expect(page.getByText(soundSaved,{exact:true})).toBeVisible();
    expect(await preferenceRoot(page)).toEqual(after);
    expect(playbackCounts(await audio(page))).toEqual({contexts:0,resumes:0,starts:0,active:0,speaking:false,pendingSpeech:false});
    await press('Pause sound');await press('Resume sound');
    expect((await audio(page)).contexts).toEqual([]);
    evidence.push({stage:'reload-silence-and-pause-resume',root:await preferenceRoot(page),native:await audio(page)});
  } finally {
    await info.attach('C-full-native-preference-retry',{body:JSON.stringify({build:correctedBuild,browser:context.browser()?.version(),viewport:page.viewportSize(),timezone:'Europe/London',touch,sliderInput:'keyboard',acousticStatus:'unverified',newer,evidence},null,2),contentType:'application/json'});
  }
});

test('published denied audio resume keeps a written playable path', async ({ page }, info) => {
  await observeNativeAudio(page);
  await page.addInitScript(() => { AudioContext.prototype.resume = async () => { throw new DOMException('Test-scoped denial', 'NotAllowedError'); }; });
  await page.goto('./');
  await page.getByRole('button', { name: /^Sound/ }).click();
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await expect(page.getByText('Your browser paused sound. Use Retry sound to try again.', { exact: true })).toBeVisible();
  expect(active(await audio(page))).toEqual([]);
  await page.getByRole('button', { name: 'Close sound settings', exact: true }).click();
  await page.getByRole('button', { name: 'Add an explorer', exact: true }).click();
  await page.getByRole('textbox', { name: 'Nickname', exact: true }).fill('Quiet Boundary');
  await page.getByRole('button', { name: 'Save explorer', exact: true }).click();
  await page.getByRole('button', { name: 'Quiet Boundary Choose explorer', exact: true }).click();
  await page.getByRole('button', { name: 'Meet Pip at the bridge', exact: true }).click();
  await page.getByRole('button', { name: 'A Bridge Back Home', exact: true }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'Choose 6 metre plank', exact: true }).click();
    await page.getByRole('button', { name: 'Place selected plank at the end', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Check my idea', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your idea worked!', exact: true })).toBeVisible();
  expect(active(await audio(page))).toEqual([]);
  await info.attach('denial-written-completion', { body: JSON.stringify({ native: await audio(page), ui: await page.locator('body').innerText(), acousticStatus: 'unverified' }), contentType: 'application/json' });
});

for(const gate of ['Silence all','Pause sound'] as const) test(`published held native decode respects ${gate}`, async ({page},info) => {
  test.setTimeout(90000);
  await observeNativeAudio(page);
  await page.addInitScript(() => {
    const w=window as any, native=AudioContext.prototype.decodeAudioData;
    w.heldBoundaryDecodes=[]; w.releaseBoundaryDecodes=[];
    (AudioContext.prototype as any).decodeAudioData=async function(bytes:ArrayBuffer) {
      const decoded=await native.call(this,bytes);
      w.heldBoundaryDecodes.push({seconds:decoded.duration,frames:decoded.length,rate:decoded.sampleRate});
      await new Promise<void>(resolve=>w.releaseBoundaryDecodes.push(resolve));
      return decoded;
    };
  });
  await page.goto('./');
  await page.getByRole('button',{name:'Add an explorer',exact:true}).click();
  await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('Held Boundary');
  await page.getByRole('button',{name:'Save explorer',exact:true}).click();
  await page.getByRole('button',{name:'Held Boundary Choose explorer',exact:true}).click();
  await page.getByRole('button',{name:/^Sound/}).click();
  await page.getByRole('button',{name:'Enable sound',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>(window as any).heldBoundaryDecodes.length),{timeout:30000}).toBe(1);
  const held=await audio(page);
  expect(held.contexts).toEqual(['running']); expect(held.sources).toEqual([]);
  await page.getByRole('button',{name:gate,exact:true}).click();
  await page.evaluate(async()=>{
    const w=window as any; w.releaseBoundaryDecodes.splice(0).forEach((resolve:()=>void)=>resolve());
    await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  });
  expect((await audio(page)).sources).toEqual([]);
  const stopped=await audio(page);
  if(gate==='Silence all') await page.getByRole('button',{name:'Exit Silence all',exact:true}).click();
  else await page.getByRole('button',{name:'Resume sound',exact:true}).click();
  await expect.poll(async()=>active(await audio(page)).filter((s:any)=>s.loop).length).toBe(1);
  const resumed=await audio(page);
  await page.getByRole('button',{name:'Silence all',exact:true}).click();
  expect(active(await audio(page))).toEqual([]);
  await info.attach('held-native-decode',{body:JSON.stringify({gate,browser:page.context().browser()?.version(),held,stopped,resumed,decoded:await page.evaluate(()=>(window as any).heldBoundaryDecodes),acousticStatus:'unverified'}),contentType:'application/json'});
  await info.attach('held-decode-screen',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});
