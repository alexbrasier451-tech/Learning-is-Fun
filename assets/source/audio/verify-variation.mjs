/** Read-only by default. --write-evidence writes only variation-checks.json. */
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readScores, render } from '../../../tools/render-audio.mjs';
const root = new URL('../../../', import.meta.url);
const load = path => readFile(new URL(path, root));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const scores = await readScores();
const source = await load('assets/source/audio/licensed/sleep-talking.wav');
let bData;
for (let p = 12; p + 8 <= source.length;) {
  const n = source.readUInt32LE(p + 4);
  assert.ok(p + n + 8 <= source.length);
  if (source.toString('ascii', p, p + 4) === 'data') bData = source.subarray(p + 8, p + 8 + n);
  p += 8 + n + n % 2;
}
assert.equal(bData?.length, 5419008);
const rows = [];
for (const score of scores.slice(0, 2)) {
  const key = score.assetId === 'village-loop' ? 'village' : 'library';
  const baseline = await load(`assets/source/audio/approved-a-only/${key}-loop.wav`);
  const output = await load(`public/assets/audio/${score.assetId}.wav`);
  const [a, b] = score.components, overlap = score.overlapFrames;
  assert.equal(overlap, 22050);
  assert.equal(score.frameCount, a.frameCount + b.frameCount - 2 * overlap);
  assert.equal(a.frameCount, (baseline.length - 44) / 2);
  assert.equal(b.frameCount, 1354752);
  assert.ok(baseline.subarray(44 + 2 * overlap, 44 + 2 * (a.frameCount - overlap))
    .equals(output.subarray(44 + 2 * overlap, 44 + 2 * (a.frameCount - overlap))), 'A interior differs from approved PCM');
  const bStart = a.frameCount - overlap;
  for (let i = overlap; i < b.frameCount - overlap; i++) {
    const expected = Math.round((bData.readInt16LE(i * 4) + bData.readInt16LE(i * 4 + 2)) / 65536 * b.masterGain * 32767);
    assert.equal(output.readInt16LE(44 + (bStart + i) * 2), expected || 0, 'B interior frame missing/changed');
  }
  const sample = i => output.readInt16LE(44 + ((i + score.frameCount) % score.frameCount) * 2);
  const transitions = [];
  for (const [name, start] of [['A-to-B', bStart], ['B-to-A', 0]]) {
    let peak = 0, maxStep = 0, squares = 0;
    for (let i = start; i < start + overlap; i++) {
      const value = sample(i); peak = Math.max(peak, Math.abs(value));
      maxStep = Math.max(maxStep, Math.abs(value - sample(i - 1))); squares += value * value;
    }
    transitions.push({ name, outputStartFrame: start, outputEndFrame: start + overlap,
      seconds: overlap / 44100, startStepPcm: Math.abs(sample(start) - sample(start - 1)),
      endStepPcm: Math.abs(sample(start + overlap) - sample(start + overlap - 1)), peakPcm: peak,
      maxStepPcm: maxStep, rmsDbfs: 20 * Math.log10(Math.sqrt(squares / overlap) / 32768) });
  }
  assert.throws(() => render({ ...score, frameCount: 110 * 44100 + 1 }), /Invalid frame count/);
  assert.throws(() => render({ ...score, frameCount: 59 * 44100, samples: new Float32Array(59 * 44100), loopEndFrame: 59 * 44100 }), /Invalid licensed loop bounds/);
  assert.throws(() => render({ ...score, sampleRate: 48000 }), /44100 Hz/);
  assert.throws(() => render({ ...score, loopEndFrame: score.frameCount + 1 }), /Invalid licensed loop bounds/);
  rows.push({ id: score.assetId, baselineSha256: sha(baseline), outputSha256: sha(output),
    aUnchangedInterior: { startFrame: overlap, endFrame: a.frameCount - overlap, frames: a.frameCount - 2 * overlap },
    bUnchangedInterior: { sourceStartFrame: overlap, sourceEndFrame: b.frameCount - overlap, frames: b.frameCount - 2 * overlap, gain: b.masterGain }, transitions,
    negativeChecks: 'PASS: >110s loop, <60s loop, wrong rate, out-of-range exclusive loop end rejected' });
}
assert.throws(() => render({ ...scores[2], frameCount: 90 * 44100 + 1 }), /Invalid frame count/);
for (const file of ['sleep-talking-acquisition.json', 'acquisition-manifest.json']) {
  const manifest = JSON.parse(await load(`assets/source/audio/licensed/${file}`));
  for (const item of manifest.files) {
    const bytes = await load(`assets/source/audio/licensed/${item.file}`);
    assert.equal(bytes.length, item.bytes, `Raw evidence byte length: ${item.file}`);
    assert.equal(sha(bytes), item.sha256, `Raw evidence hash: ${item.file}`);
  }
}
const registry = JSON.parse(await load('assets/asset-register.json'));
const preservation = JSON.parse(await load('assets/source/audio/variation-registry-preservation.json'));
assert.equal(sha(JSON.stringify(registry.assets.filter(row => !preservation.excludedIds.includes(row.id)))), preservation.sha256);
const report = { base: preservation.base, rows, rawAcquisitionBytes: 'PASS: original and new source/licence hashes',
  effectMaxGuard: 'PASS: >90 seconds still rejected', unchangedRegistryRows: preservation.unchangedRows,
  acousticAcceptance: 'UNVERIFIED — technical transition measurements do not establish musical fit' };
const text = JSON.stringify(report, null, 2) + '\n';
assert.ok(process.argv.slice(2).every(arg => arg === '--write-evidence'));
if (process.argv.includes('--write-evidence')) await writeFile(new URL('variation-checks.json', import.meta.url), text);
else assert.equal((await readFile(new URL('variation-checks.json', import.meta.url), 'utf8')).replaceAll('\r\n', '\n'), text);
console.log(text);
