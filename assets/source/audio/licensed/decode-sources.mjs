/** Reproduce the selected village master from the retained creator MP3.
 * Existing Chromium only, no network. Default checks without changing files;
 * --write regenerates the selected float master and decode-manifest.json here.
 * The library's original lossless WAV needs no decoder/import intermediate.
 */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../../../../', import.meta.url);
const recipe = JSON.parse(await readFile(new URL('../village.json', import.meta.url), 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const original = await readFile(new URL(recipe.originalPath, root));
assert.equal(sha(original), recipe.originalSha256);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const decoded = await page.evaluate(async ({ base64, start, end }) => {
    const context = new AudioContext({ sampleRate: 44100 });
    try {
      const input = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
      const audio = await context.decodeAudioData(input.buffer);
      const mono = new Float32Array(audio.length);
      for (let channel = 0; channel < audio.numberOfChannels; channel++) {
        const samples = audio.getChannelData(channel);
        for (let i = 0; i < mono.length; i++) mono[i] += samples[i] / audio.numberOfChannels;
      }
      // Independent windows verify one shared full-phrase repeat offset.
      // This is repeat alignment evidence, not listening or phrase aesthetics.
      const alignment = [];
      for (const seconds of [8, 20, 35, 50]) {
        const origin = seconds * 44100;
        let best = { correlation: -1, lagFrames: 0 };
        for (let lag = end - start - 12; lag <= end - start + 12; lag++) {
          let dot = 0, xx = 0, yy = 0;
          for (let i = 0; i < 44100; i++) {
            const x = mono[origin + i], y = mono[origin + i + lag];
            dot += x * y; xx += x * x; yy += y * y;
          }
          const correlation = dot / Math.sqrt(xx * yy);
          if (correlation > best.correlation) best = { correlation, lagFrames: lag };
        }
        alignment.push({ templateStartSeconds: seconds, templateLengthSeconds: 1, ...best });
      }
      const bytes = new Uint8Array((end - start) * 4);
      const view = new DataView(bytes.buffer);
      for (let i = start; i < end; i++) view.setFloat32((i - start) * 4, mono[i], true);
      const chunks = [];
      for (let i = 0; i < bytes.length; i += 16384) chunks.push(String.fromCharCode(...bytes.subarray(i, i + 16384)));
      return { base64: btoa(chunks.join('')), channels: audio.numberOfChannels, sampleRate: audio.sampleRate,
        decodedFrameCount: audio.length, alignment };
    } finally { await context.close(); }
  }, { base64: original.toString('base64'), start: recipe.sourceStartFrame, end: recipe.sourceEndFrame });
  const pcm = Buffer.from(decoded.base64, 'base64');
  assert.equal(decoded.sampleRate, 44100);
  assert.equal(decoded.channels, 2);
  assert.equal(decoded.decodedFrameCount, recipe.decodedSourceFrameCount);
  assert.equal(sha(pcm), recipe.masterSha256);
  assert.ok(decoded.alignment.every(item => item.lagFrames === recipe.frameCount && item.correlation > .99));
  const report = { decoder: 'Chromium ' + browser.version() + ' AudioContext.decodeAudioData',
    source: recipe.originalPath, originalBytes: original.length, originalSha256: sha(original),
    decodedFrameCount: decoded.decodedFrameCount, decodedChannels: decoded.channels, sampleRate: decoded.sampleRate,
    downmix: 'Arithmetic mean of decoded channels in float32; selected period stored float32 little-endian without gain',
    sourceStartFrame: recipe.sourceStartFrame, sourceEndFrame: recipe.sourceEndFrame,
    master: recipe.masterPath, masterBytes: pcm.length, masterSha256: sha(pcm), alignment: decoded.alignment };
  const metadata = Buffer.from(JSON.stringify(report, null, 2) + '\n');
  assert.ok(process.argv.slice(2).every(arg => arg === '--write'), 'Only --write is supported');
  if (process.argv.includes('--write')) {
    await writeFile(new URL(recipe.masterPath, root), pcm);
    await writeFile(new URL('decode-manifest.json', import.meta.url), metadata);
  } else {
    assert.ok(pcm.equals(await readFile(new URL(recipe.masterPath, root))));
    assert.ok(metadata.equals(await readFile(new URL('decode-manifest.json', import.meta.url))));
  }
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
