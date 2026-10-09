import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import type { AudioFixtureApi } from '../fixtures/audio-api';
// Module-local declarations only: these expressions execute inside the browser.
declare const window: { audioFixture: AudioFixtureApi };
declare const AudioContext: unknown;
declare const document: { documentElement: { scrollWidth: number } };
declare const innerWidth: number;
declare function getComputedStyle(element: unknown): { fontSize: string };

async function bootReal(page: Page, namespace = randomUUID(), corrupt = false) {
  await page.goto(`tests/fixtures/audio.html?binding=real&speech=fake&namespace=${namespace}${corrupt ? '&corrupt=yes' : ''}`);
  await page.waitForFunction(() => !!window.audioFixture);
  const loaded = await page.evaluate(() => window.audioFixture.ready());
  expect(loaded.status).toBe(corrupt ? 'unreadable' : 'new');
  await page.getByRole('button', { name: /^Sound/ }).click();
  return namespace;
}
async function enableReal(page: Page) {
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.audio.getSnapshot().activation)).toBe('ready');
  expect((await page.evaluate(() => window.audioFixture.flush())).ready).toBe(true);
}
async function recordReal(page: Page, info: TestInfo, label: string) {
  const evidence = await page.evaluate(async () => ({ binding: window.audioFixture.binding,
    snapshot: window.audioFixture.committed(), nativeRoot: await window.audioFixture.nativeRoot(),
    audio: window.audioFixture.audio.getSnapshot(), readiness: await window.audioFixture.flush(),
    contexts: window.audioFixture.createdContexts(), sources: window.audioFixture.activeSources(),
    events: window.audioFixture.events().filter(e => e.stage !== 'preference-status') }));
  await info.attach(label, { body: JSON.stringify({ browserVersion: page.context().browser()?.version(), ...evidence }, null, 2), contentType: 'application/json' });
  expect(evidence.nativeRoot).toEqual({ ...evidence.snapshot.token, save: evidence.snapshot.save });
}

test('real facade persists seven-file playback, independent channels, zero and explicit latch exit through reload', async ({ page }, info) => {
  await bootReal(page);
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().preferences)).toEqual({ soundEnabled: false, silenceAll: false,
    music: { muted: false, volume: .25 }, effects: { muted: false, volume: .5 } });
  await page.getByRole('button', { name: 'Pick up a plank', exact: true }).click();
  expect(await page.evaluate(() => window.audioFixture.createdContexts())).toBe(0);
  await enableReal(page);
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().filter(s => s.loop).length)).toBe(1);
  for (const cue of ['pickup', 'placement', 'support', 'success', 'restoration'] as const) {
    await page.evaluate(cue => window.audioFixture.audio.playEffect(cue), cue);
    await expect.poll(() => page.evaluate(() => window.audioFixture.events().filter(e => e.stage === 'decoded').length)).toBeGreaterThanOrEqual(['pickup', 'placement', 'support', 'success', 'restoration'].indexOf(cue) + 2);
  }
  await page.getByRole('button', { name: 'Visit the library', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.events().filter(e => e.stage === 'decoded').length)).toBe(7);
  await page.getByRole('switch', { name: 'Music', exact: true }).click();
  await page.getByRole('button', { name: 'Pick up a plank', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().some(s => !s.loop))).toBe(true);
  expect(await page.evaluate(() => window.audioFixture.activeSources().some(s => s.loop))).toBe(false);
  await page.getByRole('switch', { name: 'Effects', exact: true }).click();
  await page.getByRole('switch', { name: 'Music', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().some(s => s.loop))).toBe(true);
  expect(await page.evaluate(() => window.audioFixture.activeSources().some(s => !s.loop))).toBe(false);
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await page.getByRole('slider', { name: 'Music volume' }).fill('61');
  await page.getByRole('switch', { name: 'Music', exact: true }).click();
  await page.getByRole('switch', { name: 'Effects', exact: true }).click();
  await page.getByRole('slider', { name: 'Effects volume' }).fill('0');
  expect((await page.evaluate(() => window.audioFixture.flush())).ready).toBe(true);
  const desired = { soundEnabled: true, silenceAll: true, music: { muted: true, volume: .61 }, effects: { muted: false, volume: 0 } };
  expect(await page.evaluate(() => window.audioFixture.committed().save.installation.audio)).toEqual(desired);
  await recordReal(page, info, 'real-seven-assets-and-latched-preferences.json');
  await page.reload(); await page.waitForFunction(() => !!window.audioFixture); expect((await page.evaluate(() => window.audioFixture.ready())).status).toBe('ready');
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().preferences)).toEqual(desired);
  expect(await page.evaluate(() => window.audioFixture.createdContexts())).toBe(0);
  await page.getByRole('button', { name: /^Sound/ }).click();
  await page.getByRole('button', { name: 'Exit Silence all', exact: true }).click();
  await page.evaluate(() => window.audioFixture.flush());
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().preferences)).toEqual({ ...desired, silenceAll: false });
  expect(await page.evaluate(() => window.audioFixture.activeSources())).toEqual([]);
  expect(await page.evaluate(() => window.audioFixture.utteranceCount())).toBe(0);
  await recordReal(page, info, 'real-reloaded-explicit-exit.json'); await page.evaluate(() => window.audioFixture.cleanup());
});

test('real facade transaction abort retains live silence, retries latest fields and reloads acknowledged data', async ({ page }, info) => {
  await bootReal(page); await enableReal(page);
  await page.evaluate(() => window.audioFixture.audio.playEffect('restoration'));
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().some(s => !s.loop))).toBe(true);
  await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
  const before = await page.evaluate(() => window.audioFixture.nativeRoot());
  await page.evaluate(() => window.audioFixture.failNext());
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await expect(page.getByText(/saving is uncertain/)).toBeVisible();
  expect(await page.evaluate(() => window.audioFixture.activeSources())).toEqual([]);
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().speaking)).toBe(false);
  expect(await page.evaluate(() => window.audioFixture.nativeRoot())).toEqual(before);
  await page.getByRole('slider', { name: 'Music volume' }).fill('73');
  expect((await page.evaluate(() => window.audioFixture.flush())).ready).toBe(false);
  expect(await page.evaluate(() => window.audioFixture.nativeRoot())).toEqual(before);
  await recordReal(page, info, 'real-native-abort-before-retry.json');
  await page.getByRole('button', { name: 'Retry saving sound choices', exact: true }).click();
  expect((await page.evaluate(() => window.audioFixture.flush())).ready).toBe(true);
  await expect(page.getByText('Sound choices saved on this device.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.audioFixture.committed().save.installation.audio)).toMatchObject({ silenceAll: true, music: { volume: .73 } });
  await recordReal(page, info, 'real-latest-retry-acknowledged.json');
  await page.reload(); await page.waitForFunction(() => !!window.audioFixture); await page.evaluate(() => window.audioFixture.ready());
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().preferences)).toMatchObject({ silenceAll: true, music: { volume: .73 } });
  expect(await page.evaluate(() => window.audioFixture.createdContexts())).toBe(0); await page.evaluate(() => window.audioFixture.cleanup());
});

test('real facade profiles and visibility hook clear transient speech and cues without changing installation choices', async ({ page }, info) => {
  await bootReal(page); await enableReal(page);
  const profiles = await page.evaluate(async () => [await window.audioFixture.createProfile('Ada'), await window.audioFixture.createProfile('Bea')]);
  const saved = await page.evaluate(() => window.audioFixture.committed().save.installation.audio);
  const profilePreferences = await page.evaluate(() => Object.values(window.audioFixture.committed().save.profiles).map(p => p.preferences.instructionReadAloud));
  expect(profilePreferences).toEqual([false, false]);
  await page.evaluate(id => window.audioFixture.selectProfile(id), profiles[0]);
  await page.getByRole('button', { name: 'Visit the library', exact: true }).click();
  await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
  await page.evaluate(() => window.audioFixture.audio.playEffect('restoration'));
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().some(s => !s.loop))).toBe(true);
  await page.evaluate(() => window.audioFixture.dispatchVisibility(false));
  expect(await page.evaluate(() => ({ speaking: window.audioFixture.audio.getSnapshot().speaking, sources: window.audioFixture.activeSources() }))).toEqual({ speaking: false, sources: [] });
  await page.evaluate(() => { window.audioFixture.audio.playEffect('restoration'); window.audioFixture.dispatchVisibility(true); });
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().filter(s => s.loop).length)).toBe(1);
  expect(await page.evaluate(() => window.audioFixture.activeSources().some(s => !s.loop))).toBe(false);
  expect(await page.evaluate(() => window.audioFixture.utteranceCount())).toBe(1);
  await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
  await page.getByRole('button', { name: 'Switch profile', exact: true }).click();
  expect(await page.evaluate(() => window.audioFixture.selectedProfile())).toBe(profiles[1]);
  expect(await page.evaluate(() => ({ speaking: window.audioFixture.audio.getSnapshot().speaking, sources: window.audioFixture.activeSources() }))).toEqual({ speaking: false, sources: [] });
  expect(await page.evaluate(() => window.audioFixture.committed().save.installation.audio)).toEqual(saved);
  expect(await page.evaluate(() => window.audioFixture.createdContexts())).toBe(1);
  await recordReal(page, info, 'real-profile-and-visibility-forwarding.json'); await page.evaluate(() => window.audioFixture.cleanup());
});

test('real facade invalid stored root remains unreadable and silent without replacing data', async ({ page }, info) => {
  await bootReal(page, randomUUID(), true);
  await expect(page.getByText('Sound settings could not be loaded. Everything stays quiet.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.audioFixture.createdContexts())).toBe(0);
  await page.getByRole('button', { name: 'Pick up a plank', exact: true }).click();
  await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
  const evidence = await page.evaluate(async () => ({ status: window.audioFixture.audio.getSnapshot(), native: await window.audioFixture.nativeRoot(), contexts: window.audioFixture.createdContexts() }));
  expect(evidence.native).toEqual({ epoch: 'unreadable-fixture', revision: 0, save: { malformed: 'preserve me' } });
  expect(evidence.status.loadStatus).toBe('read-failed'); expect(evidence.contexts).toBe(0);
  await info.attach('real-unreadable-root-preserved.json', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
  await page.evaluate(() => window.audioFixture.cleanup());
});

test('real facade broadcasts silence before either tab saves and another tab’s explicit exit cannot release it', async ({ page, context }, info) => {
  const namespace = await bootReal(page); await enableReal(page);
  const other = await context.newPage();
  try {
    await other.goto(`tests/fixtures/audio.html?binding=real&speech=fake&namespace=${namespace}`);
    await other.waitForFunction(() => !!window.audioFixture);
    expect((await other.evaluate(() => window.audioFixture.ready())).status).toBe('ready');
    await other.getByRole('button', { name: /^Sound/ }).click();
    await other.getByRole('button', { name: 'Retry sound', exact: true }).click();
    expect((await other.evaluate(() => window.audioFixture.flush())).ready).toBe(true);
    await other.getByRole('button', { name: 'Read aloud', exact: true }).click();
    await page.evaluate(() => window.audioFixture.holdNext());
    await other.evaluate(() => window.audioFixture.holdNext());
    await page.getByRole('button', { name: 'Silence all', exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.audioFixture.held())).toBe(true);
    await expect.poll(() => other.evaluate(() => window.audioFixture.held())).toBe(true);
    const receiver = await other.evaluate(async () => ({ audio: window.audioFixture.audio.getSnapshot(), sources: window.audioFixture.activeSources(), native: await window.audioFixture.nativeRoot() }));
    expect(receiver.audio.preferences.silenceAll).toBe(true); expect(receiver.audio.speaking).toBe(false); expect(receiver.sources).toEqual([]);
    expect(receiver.native).toMatchObject({ save: { installation: { audio: { silenceAll: false } } } });
    await info.attach('real-broadcast-silence-before-either-save.json', { body: JSON.stringify(receiver, null, 2), contentType: 'application/json' });
    await page.evaluate(() => window.audioFixture.release()); await other.evaluate(() => window.audioFixture.release());
    expect((await page.evaluate(() => window.audioFixture.flush())).ready).toBe(true);
    expect((await other.evaluate(() => window.audioFixture.flush())).ready).toBe(true);
    await page.getByRole('button', { name: 'Exit Silence all', exact: true }).click();
    expect((await page.evaluate(() => window.audioFixture.flush())).ready).toBe(true);
    await expect.poll(() => other.evaluate(() => window.audioFixture.committed().save.installation.audio.silenceAll)).toBe(false);
    expect(await other.evaluate(() => window.audioFixture.audio.getSnapshot().preferences.silenceAll)).toBe(true);
    expect(await other.evaluate(() => window.audioFixture.audio.getSnapshot().speaking)).toBe(false);
    await info.attach('real-cross-tab-exit-keeps-receiver-latched.json', { body: JSON.stringify(await other.evaluate(() => ({
      committed: window.audioFixture.committed(), audio: window.audioFixture.audio.getSnapshot(), contexts: window.audioFixture.createdContexts(),
    })), null, 2), contentType: 'application/json' });
  } finally {
    await other.evaluate(() => window.audioFixture.teardown()).catch(() => {}); await other.close();
    await page.evaluate(() => window.audioFixture.cleanup());
  }
});

for (const action of ['silence', 'stop', 'hide', 'route'] as const) {
  test(`replacement reading cannot survive ${action} during its initial cancellation notification`, async ({ page }) => {
    await page.goto('tests/fixtures/audio.html?speech=fake');
    await page.getByRole('button', { name: /^Sound/ }).click(); await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.audioFixture.audio.getSnapshot().activation)).toBe('ready');
    await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Stop reading', exact: true })).toBeVisible();
    await page.evaluate(action => {
      const audio = window.audioFixture.audio;
      const unsubscribe = audio.subscribe(() => {
        if (audio.getSnapshot().speaking) return;
        unsubscribe();
        if (action === 'silence') audio.silenceAll();
        if (action === 'stop') audio.stopReading();
        if (action === 'hide') audio.setVisible(false);
        if (action === 'route') audio.setSceneTheme(null);
      });
    }, action);
    await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
    expect(await page.evaluate(() => ({ utterances: window.audioFixture.utteranceCount(), speaking: window.audioFixture.audio.getSnapshot().speaking })))
      .toEqual({ utterances: 1, speaking: false });
    await expect(page.getByRole('button', { name: 'Stop reading', exact: true })).toHaveCount(0);
    if (action === 'silence') await expect(page.getByText('Silence all is on. Music, effects and reading are stopped.', { exact: true })).toBeVisible();
    await page.evaluate(() => window.audioFixture.teardown());
  });
}

test('unsent silence remains visibly uncertain after another field saves, until explicit silence recovery', async ({ page }) => {
  await page.goto('tests/fixtures/audio.html?speech=fake');
  await page.getByRole('button', { name: /^Sound/ }).click(); await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await page.evaluate(() => window.audioFixture.preferences.flush());
  await page.evaluate(() => window.audioFixture.failNextHandoff());
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await page.getByRole('slider', { name: 'Music volume' }).fill('60');
  await page.evaluate(() => window.audioFixture.preferences.flush());
  expect(await page.evaluate(() => window.audioFixture.committed().save.installation.audio.silenceAll)).toBe(false);
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().preferences.silenceAll)).toBe(true);
  await expect(page.getByText(/saving is uncertain/)).toBeVisible();
  await expect(page.getByText('Sound choices saved on this device.', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Sound Not saved', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await page.evaluate(() => window.audioFixture.preferences.flush());
  expect(await page.evaluate(() => window.audioFixture.committed().save.installation.audio.silenceAll)).toBe(true);
  await expect(page.getByText('Sound choices saved on this device.', { exact: true })).toBeVisible();
  await page.evaluate(() => window.audioFixture.teardown());
});

test('first visit is silent; keyboard controls preserve independent choices under Silence all', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('tests/fixtures/audio.html?speech=fake');
  await page.getByRole('button', { name: 'Pick up a plank' }).click();
  expect(await page.evaluate(() => window.audioFixture.createdContexts())).toBe(0);
  await page.getByRole('button', { name: 'Sound', exact: false }).first().click();
  await page.getByRole('slider', { name: 'Music volume' }).focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('slider', { name: 'Music volume' })).toHaveValue('26');
  expect(await page.evaluate(() => window.audioFixture.createdContexts())).toBe(0);
  await page.getByRole('switch', { name: 'Music', exact: true }).click();
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.audio.getSnapshot().activation)).toBe('ready');
  await expect(page.getByRole('switch', { name: 'Music', exact: true })).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await page.getByRole('slider', { name: 'Effects volume' }).fill('0');
  await page.getByRole('switch', { name: 'Music', exact: true }).click();
  await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
  expect(await page.evaluate(() => window.audioFixture.utteranceCount())).toBe(0);
  expect(await page.evaluate(() => window.audioFixture.activeSources())).toEqual([]);
  await page.getByRole('button', { name: 'Exit Silence all', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().filter(s => s.loop).length)).toBe(1);
  await expect(page.getByRole('slider', { name: 'Effects volume' })).toHaveValue('0');
  await expect(page.getByRole('slider', { name: 'Music volume' })).toHaveValue('26');
  expect(await page.evaluate(() => window.audioFixture.createdContexts())).toBe(1);
  expect(errors).toEqual([]); await page.evaluate(() => window.audioFixture.teardown());
});

test('native media decodes all seven files; Stop, route/profile and hide clear transient output', async ({ page }) => {
  await page.goto('tests/fixtures/audio.html?speech=fake');
  await page.getByRole('button', { name: /^Sound/ }).click(); await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().some(s => s.loop))).toBe(true);
  for (const cue of ['pickup', 'placement', 'support', 'success', 'restoration'] as const) {
    await page.evaluate(cue => window.audioFixture.audio.playEffect(cue), cue);
    await expect.poll(() => page.evaluate(() => window.audioFixture.events().filter(e => e.stage === 'decoded').length)).toBeGreaterThanOrEqual(['pickup', 'placement', 'support', 'success', 'restoration'].indexOf(cue) + 2);
  }
  await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Stop reading', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open instructions', exact: true }).click();
  await page.getByRole('button', { name: 'Stop reading', exact: true }).click();
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().speaking)).toBe(false);
  await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
  await page.getByRole('button', { name: 'Visit the library', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.events().filter(e => e.stage === 'decoded').length)).toBe(7);
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().speaking)).toBe(false);
  await page.evaluate(() => { window.audioFixture.audio.setVisible(false); window.audioFixture.audio.playEffect('restoration'); window.audioFixture.audio.setVisible(true); });
  await expect.poll(() => page.evaluate(() => window.audioFixture.activeSources().filter(s => !s.loop).length)).toBe(0);
  await page.getByRole('button', { name: 'Switch profile', exact: true }).click();
  expect(await page.evaluate(() => window.audioFixture.activeSources())).toEqual([]);
  await page.evaluate(() => window.audioFixture.teardown());
});

test('a delayed failed preference save cannot defeat immediate silence; retry saves latest choices', async ({ page }) => {
  await page.goto('tests/fixtures/audio.html?speech=fake');
  await page.getByRole('button', { name: /^Sound/ }).click(); await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await page.evaluate(() => window.audioFixture.preferences.flush());
  await page.evaluate(() => { window.audioFixture.holdNext(); window.audioFixture.failNext(); });
  await page.getByRole('slider', { name: 'Music volume' }).fill('60');
  await expect.poll(() => page.evaluate(() => window.audioFixture.held())).toBe(true);
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  expect(await page.evaluate(() => window.audioFixture.activeSources())).toEqual([]);
  await page.evaluate(() => window.audioFixture.release());
  await expect(page.getByText(/saving is uncertain/)).toBeVisible();
  expect(await page.evaluate(() => window.audioFixture.audio.getSnapshot().preferences.silenceAll)).toBe(true);
  await page.getByRole('button', { name: 'Retry saving sound choices', exact: true }).click();
  await page.evaluate(() => window.audioFixture.preferences.flush());
  await expect(page.getByText('Sound choices saved on this device.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.audioFixture.committed().save.installation.audio)).toMatchObject({ silenceAll: true, music: { volume: .6 } });
  await page.evaluate(() => window.audioFixture.teardown());
});

test('records native audio capability and actual selected device voice without claiming listening', async ({ page }, testInfo) => {
  await page.goto('tests/fixtures/audio.html');
  await page.getByRole('button', { name: /^Sound/ }).click();
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.audioFixture.audio.getSnapshot().activation)).not.toBe('inactive');
  const evidence = await page.evaluate(() => ({ constructorType: typeof AudioContext,
    status: window.audioFixture.audio.getSnapshot(), events: window.audioFixture.events() }));
  await testInfo.attach('native-audio-capability.json', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
  if (evidence.status.activation === 'unavailable') await expect(page.getByText('Sound is unavailable in this browser. You can still play.', { exact: true })).toBeVisible();
  else expect(evidence.status.activation).toBe('ready');
  await page.evaluate(() => window.audioFixture.teardown());
});

test('controls reflow to narrow portrait, keep 44px targets and honest device voice status', async ({ page }, testInfo) => {
  await page.goto('tests/fixtures/audio.html');
  await page.getByRole('button', { name: /^Sound/ }).click();
  for (const width of [768, 320, 1024]) {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 1024 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const targets = await page.locator('.audio-controls button:visible, .audio-controls input:visible').evaluateAll(elements => elements.map(e => {
      const rect = e.getBoundingClientRect(); return { width: rect.width, height: rect.height, font: parseFloat(getComputedStyle(e).fontSize) };
    }));
    for (const target of targets) { expect(target.width).toBeGreaterThanOrEqual(44); expect(target.height).toBeGreaterThanOrEqual(44); }
    await page.screenshot({ path: testInfo.outputPath(`audio-${width}.png`), fullPage: true });
  }
  const speech = await page.evaluate(() => window.audioFixture.audio.getSnapshot());
  await expect(page.getByText(speech.localVoiceAvailable ? /available English voice on this device/ : /no local English voice was found/)).toBeVisible();
  await page.getByRole('button', { name: 'Close sound settings', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Sound/ })).toBeFocused();
  await page.evaluate(() => window.audioFixture.teardown());
});
