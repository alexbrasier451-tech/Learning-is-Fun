/** Offline only: no dependencies, downloads, device playback or runtime synthesis.
 * Run `node tools/render-audio.mjs` to write ONLY the seven named runtime WAVs.
 * `--check` renders in memory and compares every byte; never writes.
 * Import renderAll/readScores/measure for source QA without invoking the CLI.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const ids = ['village-loop', 'library-loop', 'pickup', 'placement', 'support', 'success', 'restoration'];
const rate = 44100;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const finite = value => typeof value === 'number' && Number.isFinite(value);
const frame = seconds => Math.round(seconds * rate);

export async function readScores() {
  const load = async name => JSON.parse(await readFile(resolve(root, `assets/source/audio/${name}.json`), 'utf8'));
  const village = await load('village');
  const library = await load('library');
  const effects = await load('effects');
  const { cues, ...shared } = effects;
  return [village, library, ...cues.map(cue => ({ ...shared, ...cue }))];
}

function validate(score) {
  assert(score.schemaVersion === 1 && score.sampleRate === rate, 'Expected v1, 44100 Hz');
  assert(ids.includes(score.assetId), 'Unapproved output ID');
  assert(['loop', 'effect'].includes(score.kind), 'Invalid kind');
  assert(Number.isSafeInteger(score.frameCount) && score.frameCount > 0 && score.frameCount <= rate * 90, 'Invalid frame count');
  assert(finite(score.tempo) && score.tempo > 0 && score.tempo <= 240, 'Invalid tempo');
  assert(finite(score.masterGain) && score.masterGain > 0 && score.masterGain <= 1, 'Invalid gain');
  if (score.kind === 'loop') {
    assert(score.loopStartFrame === 0 && score.loopEndFrame === score.frameCount, 'Full-period exclusive loop required');
    assert(frame(score.totalBeats * 60 / score.tempo) === score.frameCount, 'Phrase/loop length mismatch');
    assert(score.frameCount >= 60 * rate, 'Loop too short');
  }
  for (const instrument of Object.values(score.instruments)) {
    assert(instrument.partials.length > 0 && instrument.partials.every(([ratio, gain]) => finite(ratio) && ratio > 0 && finite(gain) && gain > 0), 'Invalid partials');
    assert(finite(instrument.attackSeconds) && instrument.attackSeconds >= .005 && finite(instrument.releaseSeconds) && instrument.releaseSeconds > 0, 'Invalid envelope');
    assert(finite(instrument.decayPerSecond) && instrument.decayPerSecond >= 0 && finite(instrument.noise) && instrument.noise >= 0 && instrument.noise <= .1, 'Invalid decay/noise');
  }
  assert(score.reverb.every(tap => finite(tap.seconds) && tap.seconds > 0 && tap.seconds <= 1 && finite(tap.gain) && tap.gain >= 0 && tap.gain <= .5), 'Invalid reflection');
  const lastTap = Math.max(0, ...score.reverb.map(tap => frame(tap.seconds)));
  for (const event of score.events) {
    const instrument = score.instruments[event.instrument];
    assert(instrument && finite(event.beat) && event.beat >= 0 && finite(event.duration) && event.duration > 0, 'Invalid event');
    assert(Number.isInteger(event.note) && event.note >= 24 && event.note <= 96 && finite(event.level) && event.level > 0 && event.level <= 1, 'Invalid pitch/level');
    assert(Number.isSafeInteger(event.seed) && event.seed > 0 && event.seed <= 0xffffffff, 'Invalid noise seed');
    const start = frame(event.beat * 60 / score.tempo);
    const length = frame(event.duration * 60 / score.tempo + instrument.releaseSeconds);
    assert(start < score.frameCount && length <= score.frameCount, 'Event exceeds bounded render period');
    if (score.kind === 'effect') assert(start + length + lastTap <= score.frameCount, `${score.assetId}: clipped release/tail`);
  }
}

export function render(score) {
  validate(score);
  const count = score.frameCount;
  const loop = score.kind === 'loop';
  const dry = new Float64Array(count);
  for (const event of score.events) {
    const inst = score.instruments[event.instrument];
    const start = frame(event.beat * 60 / score.tempo);
    const gate = event.duration * 60 / score.tempo;
    const length = frame(gate + inst.releaseSeconds);
    const frequency = 440 * 2 ** ((event.note - 69) / 12);
    const sum = inst.partials.reduce((total, [, gain]) => total + gain, 0);
    assert(inst.partials.every(([ratio]) => frequency * ratio < rate / 2), 'Aliasing partial');
    let seed = event.seed >>> 0;
    let filteredNoise = 0;
    for (let i = 0; i < length; i++) {
      const seconds = i / rate;
      // Raised-cosine ramps have zero endpoint slope; no note-edge impulses.
      const attack = .5 - .5 * Math.cos(Math.PI * Math.min(1, seconds / inst.attackSeconds));
      const release = seconds <= gate ? 1 : .5 + .5 * Math.cos(Math.PI * Math.min(1, (seconds - gate) / inst.releaseSeconds));
      const envelope = attack * release * Math.exp(-inst.decayPerSecond * seconds);
      let tone = 0;
      for (const [ratio, gain] of inst.partials) tone += gain * Math.sin(2 * Math.PI * frequency * ratio * seconds);
      if (inst.noise) {
        seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0;
        filteredNoise += .12 * ((seed / 0x100000000 * 2 - 1) - filteredNoise);
      }
      const sample = event.level * envelope * (tone / sum + inst.noise * filteredNoise);
      dry[loop ? (start + i) % count : start + i] += sample;
    }
  }
  // Finite quiet reflections. Circular convolution folds EVERY release and
  // reflection into the period, making the exported buffer steady-state.
  // No seam crossfade, edge mute, appended padding or inserted join silence.
  const mixed = dry.slice();
  for (const tap of score.reverb) {
    const delay = frame(tap.seconds);
    for (let i = 0; i < count; i++) {
      const destination = i + delay;
      if (loop || destination < count) mixed[destination % count] += dry[i] * tap.gain;
    }
  }
  const wav = Buffer.alloc(44 + count * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) {
    const sample = mixed[i] * score.masterGain;
    assert(finite(sample) && Math.abs(sample) < .8, `${score.assetId}: inadequate headroom at ${i}`);
    wav.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }
  return wav;
}

export function measure(score, wav) {
  const pcm = i => wav.readInt16LE(44 + i * 2);
  const count = score.frameCount;
  let peak = 0, squares = 0, dc = 0, maxStep = 0;
  for (let i = 0; i < count; i++) {
    const value = pcm(i);
    peak = Math.max(peak, Math.abs(value)); squares += value * value; dc += value;
    if (i) maxStep = Math.max(maxStep, Math.abs(value - pcm(i - 1)));
  }
  const result = { assetId: score.assetId, sampleRate: rate, frameCount: count, seconds: count / rate, bytes: wav.length,
    sha256: createHash('sha256').update(wav).digest('hex'), peakPcm: peak,
    peakDbfs: 20 * Math.log10(peak / 32768), rmsDbfs: 20 * Math.log10(Math.sqrt(squares / count) / 32768),
    dcPcm: dc / count, maxStepPcm: maxStep, eventCount: score.events.length };
  if (score.kind === 'loop') {
    let seamSquares = 0, seamMaxStep = 0;
    for (let i = -441; i < 441; i++) {
      const index = (count + i) % count;
      seamSquares += pcm(index) ** 2;
      seamMaxStep = Math.max(seamMaxStep, Math.abs(pcm(index) - pcm((index + count - 1) % count)));
    }
    Object.assign(result, { loopStartFrame: 0, loopEndFrame: count, joinStepPcm: Math.abs(pcm(0) - pcm(count - 1)),
      joinWindowMaxStepPcm: seamMaxStep, joinWindowRmsDbfs: 20 * Math.log10(Math.sqrt(seamSquares / 882) / 32768),
      joinWindowMilliseconds: 20, firstPcm: pcm(0), lastPcm: pcm(count - 1) });
  }
  return result;
}

export async function renderAll({ check = false } = {}) {
  const scores = await readScores();
  assert(scores.length === ids.length && scores.every((score, i) => score.assetId === ids[i]), 'Expected exactly seven ordered exports');
  const output = resolve(root, 'public/assets/audio');
  if (!check) await mkdir(output, { recursive: true });
  const measurements = [];
  for (const score of scores) {
    const wav = render(score);
    const path = resolve(output, `${score.assetId}.wav`);
    if (check) assert(wav.equals(await readFile(path)), `${score.assetId}: export is not reproducible from source`);
    else await writeFile(path, wav);
    measurements.push(measure(score, wav));
  }
  return { node: process.version, mode: check ? 'byte-identical check' : 'render', measurements,
    largestBytes: Math.max(...measurements.map(item => item.bytes)), totalBytes: measurements.reduce((sum, item) => sum + item.bytes, 0),
    acousticAcceptance: 'UNVERIFIED — numeric measurements are not listening' };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  assert(process.argv.slice(2).every(arg => arg === '--check'), 'Only --check is supported');
  console.log(JSON.stringify(await renderAll({ check: process.argv.includes('--check') }), null, 2));
}
