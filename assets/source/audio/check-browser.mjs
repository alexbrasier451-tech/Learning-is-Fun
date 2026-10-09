/** Optional existing-Playwright source verification; no playback/listening claim.
 * Writes only browser-decode.json beside this script. Requires the repository's
 * existing @playwright/test and installed Chromium; does not install anything.
 */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { AUDIO_ASSETS } from '../../../src/audio/catalogue.ts';
const root = new URL('../../../', import.meta.url);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(new URL('audition.html', import.meta.url).href);
  await page.waitForFunction(() => document.querySelector('audio').readyState >= 1);
  const players = await page.locator('audio').evaluateAll(elements => elements.map(element => ({
    src: element.getAttribute('src'), volume: element.volume, paused: element.paused,
    autoplay: element.autoplay, error: element.error?.code ?? null,
  })));
  assert.equal(players.length, 9);
  assert.ok(players.every(player => player.paused && !player.autoplay && player.error === null));
  assert.deepEqual(players.map(player => player.volume), [1, 1, .25, .25, .5, .5, .5, .5, .5]);
  const decoded = [];
  for (const entry of Object.values(AUDIO_ASSETS)) {
    const wav = await readFile(new URL(`public/${entry.path}`, root));
    const result = await page.evaluate(async ({ base64, id }) => {
      const context = new AudioContext({ sampleRate: 44100 });
      try {
        const bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
        const buffer = await context.decodeAudioData(bytes.buffer);
        let peak = 0;
        for (const sample of buffer.getChannelData(0)) peak = Math.max(peak, Math.abs(sample));
        return { assetId: id, sampleRate: buffer.sampleRate, frameCount: buffer.length,
          channels: buffer.numberOfChannels, seconds: buffer.duration, peak };
      } finally { await context.close(); }
    }, { base64: wav.toString('base64'), id: entry.assetId });
    assert.equal(result.frameCount, entry.frameCount);
    assert.equal(result.sampleRate, entry.sampleRate);
    assert.equal(result.channels, 1);
    decoded.push(result);
  }
  const report = { browser: `Headless Chromium ${browser.version()}`,
    method: 'Native HTML media metadata and AudioContext.decodeAudioData at requested 44100 Hz. No audible playback or loopback assessment.',
    players, decoded, acousticAcceptance: 'UNVERIFIED' };
  await writeFile(new URL('browser-decode.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
