import { expect, test, type Page } from '@playwright/test';
import { resolve } from 'node:path';

const starter = resolve('artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/starter-save.json');
const saved = 'Sound choices saved on this device.';
const failure = 'Your choices apply now, but saving is uncertain. They may not be remembered after you leave.';
const retryName = 'Retry saving sound choices';
type Root = { epoch: string; revision: number; save: { installation: { audio: {
  soundEnabled: boolean; silenceAll: boolean; music: { muted: boolean; volume: number }; effects: { muted: boolean; volume: number };
} }; [key: string]: unknown } };
type Native = { contexts: number; resumes: number; active: number; activeSeconds: number[]; starts: number; master: number; speaking: boolean; pending: boolean };

// Native browser observers only. The full application creates its real runtime,
// facade, preference queue and repository. No application commands are injected.
async function observe(page: Page) {
  await page.addInitScript(`(() => {
    const proof = window.audioRetryProof = { contexts: [], gains: [], sources: [], resumes: 0 };
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      constructor(...args) { super(...args); proof.contexts.push(this); }
      resume() { proof.resumes++; return super.resume(); }
      createGain() { const gain = super.createGain(); proof.gains.push(gain); return gain; }
      createBufferSource() {
        const source = super.createBufferSource(), record = { source, started: false, stopped: false, ended: false };
        proof.sources.push(record);
        const start = source.start.bind(source), stop = source.stop.bind(source);
        source.start = (...args) => { start(...args); record.started = true; };
        source.stop = (...args) => { stop(...args); record.stopped = true; };
        source.addEventListener('ended', () => { record.ended = true; });
        return source;
      }
    };
    window.readAudioRetryProof = () => ({ contexts: proof.contexts.length, resumes: proof.resumes,
      active: proof.sources.filter(s => s.started && !s.stopped && !s.ended).length,
      activeSeconds: proof.sources.filter(s => s.started && !s.stopped && !s.ended).map(s => s.source.buffer.duration),
      starts: proof.sources.filter(s => s.started).length, master: proof.gains[0]?.gain.value ?? 0,
      speaking: speechSynthesis.speaking, pending: speechSynthesis.pending });
  })()`);
}
const native = (page: Page) => page.evaluate<Native>('window.readAudioRetryProof()');
const root = (page: Page) => page.evaluate<Root>(`new Promise((resolve, reject) => {
  const request = indexedDB.open('learning-is-fun:/playtest/:save');
  request.onerror = () => reject(request.error);
  request.onsuccess = () => {
    const db = request.result, tx = db.transaction('records'), read = tx.objectStore('records').get('root');
    let value; read.onsuccess = () => { value = read.result; };
    tx.oncomplete = () => { db.close(); resolve(value); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  };
})`);
async function adult(page: Page) {
  for (const name of ['Grown-ups', 'For grown-ups', 'Continue to adult area']) await page.getByRole('button', { name, exact: true }).click();
}
async function importStarter(page: Page) {
  await adult(page);
  await page.locator('input[type=file]').setInputFiles(starter);
  await page.getByRole('button', { name: 'Confirm whole-save replacement', exact: true }).click();
  await expect(page.getByRole('button', { name: 'River Boundary Choose explorer', exact: true })).toBeVisible();
}
async function injectAbort(page: Page) {
  await page.evaluate(`(() => {
    const put = IDBObjectStore.prototype.put;
    window.audioRetryWrites = [];
    window.restoreAudioRetryPut = () => { IDBObjectStore.prototype.put = put; };
    IDBObjectStore.prototype.put = function (...args) {
      const request = put.apply(this, args);
      if (this.transaction.db.name === 'learning-is-fun:/playtest/:save') {
        window.audioRetryWrites.push(structuredClone(args[0])); this.transaction.abort();
      }
      return request;
    };
  })()`);
}

for (const scenario of ['original imported library', 'fresh explorer latest muted levels'] as const) {
  test(`full app preference retry: ${scenario}`, async ({ page, context }, info) => {
    test.setTimeout(90000);
    const evidence: unknown[] = [];
    await observe(page); await page.goto('./');
    if (scenario === 'original imported library') {
      await importStarter(page);
      await page.getByRole('combobox', { name: 'Active explorer', exact: true }).selectOption({ label: 'River Boundary' });
    } else {
      await page.getByRole('button', { name: 'Add an explorer', exact: true }).click();
      await page.getByRole('textbox', { name: 'Nickname', exact: true }).fill('Retry Explorer');
      await page.getByRole('button', { name: 'Save explorer', exact: true }).click();
      await page.getByRole('button', { name: 'Retry Explorer Choose explorer', exact: true }).click();
    }
    const sound = page.getByRole('region', { name: 'Music, effects and reading', exact: true });
    await page.getByRole('button', { name: /^Sound/ }).click();
    await page.getByRole('button', { name: scenario === 'original imported library' ? 'Exit Silence all' : 'Enable sound', exact: true }).click();
    if (scenario === 'original imported library') {
      for (const name of ['Music', 'Effects']) await page.getByRole('switch', { name, exact: true }).click();
    }
    await expect.poll(async () => (await native(page)).active).toBe(1);
    await page.getByRole('button', { name: 'Close sound settings', exact: true }).click();
    await page.getByRole('button', { name: 'Pause sound', exact: true }).click();
    expect((await native(page)).active).toBe(0);
    await page.getByRole('button', { name: 'Resume sound', exact: true }).click();
    if (scenario === 'original imported library') {
      await page.getByRole('button', { name: 'Whispering Library', exact: true }).click();
      await expect.poll(async () => (await native(page)).activeSeconds.some(seconds => Math.abs(seconds - 76.8) < .01)).toBe(true);
    }
    await expect.poll(async () => (await native(page)).active).toBe(1);
    await page.getByRole('button', { name: /^Sound/ }).click();
    await expect(page.getByText(saved, { exact: true })).toBeVisible();
    const before = await root(page);
    evidence.push({ stage: 'before-abort-playback', root: before, native: await native(page) });
    await injectAbort(page);
    await page.getByRole('button', { name: 'Silence all', exact: true }).click();
    await expect(page.getByText(failure, { exact: true })).toBeVisible();
    expect(await root(page)).toEqual(before);
    await expect.poll(async () => (await native(page)).master).toBe(0);
    expect(await native(page)).toMatchObject({ active: 0, speaking: false, pending: false });
    evidence.push({ stage: 'aborted-live-stop', root: await root(page), native: await native(page), writes: await page.evaluate('window.audioRetryWrites') });
    await page.evaluate('window.restoreAudioRetryPut()');
    await page.getByRole('button', { name: 'Save progress', exact: true }).click();
    await expect(page.getByText('Some changes still need saving. Stay here and retry the action that could not save.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Silence all', exact: true }).click();
    expect(await root(page)).toEqual(before);
    // This assertion reproduces F01 before the production binding correction.
    await expect(sound.getByRole('button', { name: retryName, exact: true })).toBeVisible();
    if (scenario === 'fresh explorer latest muted levels') {
      for (const name of ['Music', 'Effects']) await page.getByRole('switch', { name, exact: true }).click();
      await page.getByRole('slider', { name: 'Music volume' }).fill('31');
      await page.getByRole('slider', { name: 'Effects volume' }).fill('82');
      // A still-unavailable writer must remain truthful on explicit retry.
      await injectAbort(page);
      await sound.getByRole('button', { name: retryName, exact: true }).click();
      await expect(page.getByText(failure, { exact: true })).toBeVisible();
      expect(await root(page)).toEqual(before);
      await page.evaluate('window.restoreAudioRetryPut()');
    }
    const stopped = await native(page);
    // Keep the genuine native retry transaction in flight until explicitly
    // released. No candidate or commit result is replaced by the observer.
    await page.evaluate(`(() => {
      const put = IDBObjectStore.prototype.put;
      window.audioRetryHeld = false; window.audioRetryRelease = false;
      window.restoreAudioRetryPut = () => { IDBObjectStore.prototype.put = put; };
      IDBObjectStore.prototype.put = function (...args) {
        const request = put.apply(this, args);
        if (this.transaction.db.name === 'learning-is-fun:/playtest/:save') {
          window.audioRetryHeld = true;
          const keepAlive = () => { if (!window.audioRetryRelease) this.get('root').onsuccess = keepAlive; };
          keepAlive();
        }
        return request;
      };
    })()`);
    await sound.getByRole('button', { name: retryName, exact: true }).focus(); await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate('window.audioRetryHeld')).toBe(true);
    await expect(page.getByText('Saving sound choices…', { exact: true })).toBeVisible();
    await expect(page.getByText(saved, { exact: true })).toHaveCount(0);
    await expect(sound.getByRole('button', { name: retryName, exact: true })).toHaveCount(0);
    expect(await native(page)).toEqual(stopped);
    evidence.push({ stage: 'retry-native-transaction-pending', native: await native(page), ui: await sound.innerText() });
    await page.evaluate('window.audioRetryRelease = true; window.restoreAudioRetryPut()');
    await expect(page.getByText(saved, { exact: true })).toBeVisible();
    await expect(sound.getByRole('button', { name: retryName, exact: true })).toHaveCount(0);
    const after = await root(page);
    expect(after.epoch).toBe(before.epoch); expect(after.revision).toBe(before.revision + 1);
    const expected = structuredClone(before); expected.revision++; expected.save.installation.audio.silenceAll = true;
    if (scenario === 'fresh explorer latest muted levels') {
      expected.save.installation.audio.music = { muted: true, volume: .31 };
      expected.save.installation.audio.effects = { muted: true, volume: .82 };
    }
    expect(after).toEqual(expected);
    expect(await native(page)).toEqual(stopped); // Retry does not resume, create a context or start a source.
    await page.getByRole('button', { name: 'Save progress', exact: true }).click();
    await expect(page.getByText('Your progress is saved.', { exact: true })).toBeVisible();
    evidence.push({ stage: 'explicit-retry-committed-ready', root: after, native: await native(page) });
    await page.reload();
    await page.getByRole('button', { name: /^Sound/ }).click();
    await expect(page.getByText('Silence all is on. Music, effects and reading are stopped.', { exact: true })).toBeVisible();
    await expect(page.getByText(saved, { exact: true })).toBeVisible();
    expect(await root(page)).toEqual(after);
    expect(await native(page)).toMatchObject({ contexts: 0, resumes: 0, active: 0, starts: 0, speaking: false, pending: false });
    evidence.push({ stage: 'reload-retained-silence', root: await root(page), native: await native(page) });
    await info.attach('full-app-native-retry.json', { body: JSON.stringify({ browser: context.browser()?.version(), scenario, evidence }, null, 2), contentType: 'application/json' });
  });
}

test('full app preference retry cannot replay discarded fields into a replacement epoch', async ({ page, context }, info) => {
  await observe(page); await page.goto('./'); await importStarter(page);
  const before = await root(page);
  await page.getByRole('button', { name: /^Sound/ }).click();
  await injectAbort(page);
  await page.getByRole('slider', { name: 'Music volume' }).fill('93');
  await expect(page.getByText(failure, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: retryName, exact: true })).toBeVisible();
  expect(await root(page)).toEqual(before);
  await page.evaluate('window.restoreAudioRetryPut()');
  // Replacement is a normal, explicitly confirmed adult UI action. Do not
  // mutate root/epoch directly or replay the former queue into the new save.
  await importStarter(page);
  const replacement = await root(page);
  expect(replacement.epoch).not.toBe(before.epoch);
  expect(replacement.revision).toBe(0); expect(replacement.save).toEqual(before.save);
  await expect(page.getByRole('slider', { name: 'Music volume' })).toHaveValue('50');
  await expect(page.getByRole('button', { name: retryName, exact: true })).toHaveCount(0);
  // Existing lost-edit reporting/readiness is retained; retry cannot falsely
  // acknowledge the discarded epoch. Reload reads the actual replacement.
  await expect(page.getByText(failure, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save progress', exact: true }).click();
  await expect(page.getByText('Some changes still need saving. Stay here and retry the action that could not save.', { exact: true })).toBeVisible();
  expect(await root(page)).toEqual(replacement);
  expect(await native(page)).toMatchObject({ contexts: 0, resumes: 0, active: 0, starts: 0 });
  await page.reload(); await page.getByRole('button', { name: /^Sound/ }).click();
  await expect(page.getByText(saved, { exact: true })).toBeVisible();
  expect(await root(page)).toEqual(replacement);
  await info.attach('replacement-epoch.json', { body: JSON.stringify({ browser: context.browser()?.version(), before, replacement, native: await native(page) }, null, 2), contentType: 'application/json' });
});
