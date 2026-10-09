/** Source QA and review-artifact builder, never imported by the application.
 * `node assets/source/audio/verify-audio.mjs --write-evidence` regenerates
 * measurements.json, audition.wav, music-preview.wav, audition.html here. Without the flag it
 * checks them against fresh results; neither mode changes runtime exports.
 * --check-register-handoff additionally checks the historical non-audio snapshot
 * while this lane owns the register. Omit after later asset producers advance it.
 */
import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { AUDIO_ASSETS } from '../../../src/audio/catalogue.ts';
import { readScores, renderAll } from '../../../tools/render-audio.mjs';

const root = new URL('../../../', import.meta.url);
const source = new URL('./', import.meta.url);
const load = async path => readFile(new URL(path, root));
const sha = value => createHash('sha256').update(value).digest('hex');
const rate = 44100;
const entries = Object.values(AUDIO_ASSETS);
assert.deepEqual(Object.keys(AUDIO_ASSETS), ['village', 'library', 'pickup', 'placement', 'support', 'success', 'restoration']);
assert.deepEqual((await readdir(new URL('public/assets/audio/', root))).sort(), entries.map(a => `${a.assetId}.wav`).sort());
const register = JSON.parse(await load('assets/asset-register.json'));
const preservation = JSON.parse(await readFile(new URL('register-preservation.json', source)));
if (process.argv.includes('--check-register-handoff')) {
  assert.equal(sha(JSON.stringify(register.assets.filter(a => !a.kind.startsWith('audio')))), preservation.nonAudioRecordsSha256);
  assert.equal(sha(JSON.stringify(Object.fromEntries(Object.entries(register).filter(([k]) => k !== 'assets')))), preservation.registerContractSha256);
}
const buffers = new Map();
const headerChecks = [];
for (const entry of entries) {
  const wav = await load(`public/${entry.path}`);
  // Independent on-disk RIFF reader: no renderer header helper is reused.
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.readUInt32LE(4), wav.length - 8);
  assert.equal(wav.toString('ascii', 8, 16), 'WAVEfmt ');
  assert.equal(wav.readUInt32LE(16), 16);
  assert.equal(wav.readUInt16LE(20), 1); // PCM, not float or compressed
  assert.equal(wav.readUInt16LE(22), 1);
  assert.equal(wav.readUInt32LE(24), rate);
  assert.equal(wav.readUInt32LE(28), rate * 2);
  assert.equal(wav.readUInt16LE(32), 2);
  assert.equal(wav.readUInt16LE(34), 16);
  assert.equal(wav.toString('ascii', 36, 40), 'data');
  assert.equal(wav.readUInt32LE(40), wav.length - 44);
  assert.equal(wav.length, entry.bytes);
  assert.equal((wav.length - 44) / 2, entry.frameCount);
  const pcm = new Int16Array(entry.frameCount);
  let peak = 0, maxZeroRun = 0, zeroRun = 0;
  for (let i = 0; i < pcm.length; i++) {
    pcm[i] = wav.readInt16LE(44 + i * 2);
    peak = Math.max(peak, Math.abs(pcm[i]));
    zeroRun = pcm[i] === 0 ? zeroRun + 1 : 0;
    maxZeroRun = Math.max(maxZeroRun, zeroRun);
  }
  assert.ok(peak > 0 && peak < 26214, 'Nonempty signal with >1.9 dB headroom');
  if (entry.kind === 'loop') {
    assert.equal(entry.loopStartFrame, 0);
    assert.equal(entry.loopEndFrame, entry.frameCount);
    assert.ok(entry.frameCount / rate >= 60 && entry.frameCount / rate <= 90);
    assert.ok(pcm.subarray(0, 441).some(value => value !== 0));
    assert.ok(pcm.subarray(-441).some(value => value !== 0));
  } else {
    assert.equal(pcm[0], 0);
    assert.ok(pcm.subarray(-441).every(value => value === 0), 'Cue release must have finished before export end');
  }
  const record = register.assets.find(item => item.id === entry.assetId);
  assert.ok(record);
  assert.equal(record.runtimePath, entry.path);
  assert.equal(record.kind, entry.kind === 'loop' ? 'audio-loop' : 'audio-effect');
  assert.equal(record.status, 'ready');
  for (const field of ['sampleRate', 'frameCount', 'bytes', 'loopStartFrame', 'loopEndFrame']) assert.equal(record[field], entry[field]);
  if (entry.kind === 'loop') {
    assert.equal(record.permission.kind, 'reused');
    assert.ok(record.sourceUrl && record.author && record.attribution && record.modifications);
    await load(record.permission.retainedLicencePath);
  } else {
    assert.equal(record.permission.kind, 'original');
    assert.equal(record.permission.status, 'confirmed');
    await load(record.permission.evidencePath);
  }
  for (const path of record.sourcePaths) await load(path);
  buffers.set(entry.assetId, pcm);
  headerChecks.push({ assetId: entry.assetId, riff: 'PCM mono 44100 Hz 16-bit; exact sizes', peakPcm: peak, maxZeroRunFrames: maxZeroRun });
}
const reproduction = await renderAll({ check: true });
const musicPeakSum = reproduction.measurements.slice(0, 2).reduce((sum, item) => sum + item.peakPcm / 32768, 0);
const loudestCue = Math.max(...reproduction.measurements.slice(2).map(item => item.peakPcm / 32768));
const sourceMixBound = { assumption: 'Both themes and at most four effect voices; linear gains each <= 1; no speech included',
  fullGainPeakUpperBound: musicPeakSum + 4 * loudestCue,
  defaultGainPeakUpperBound: musicPeakSum * .25 + 4 * loudestCue * .5 };
assert.ok(sourceMixBound.fullGainPeakUpperBound < 1, 'Concurrent source mix lacks headroom');
for (const result of reproduction.measurements) {
  const disk = headerChecks.find(item => item.assetId === result.assetId);
  assert.equal(disk.peakPcm, result.peakPcm);
  if ('joinStepPcm' in result) assert.ok(result.joinStepPcm <= result.maxStepPcm);
}
const scores = await readScores();
assert.ok(scores.slice(0, 2).every(score => score.production === 'licensed-recording'));
const rejected = JSON.parse(await readFile(new URL('rejected-synthesis/measurements.json', source)));
for (const effect of reproduction.measurements.slice(2)) assert.equal(effect.sha256, rejected.measurements.find(item => item.assetId === effect.assetId).sha256, 'Existing effect changed');

// Audition derivative: two separately presented continuous joins per theme,
// all five cues alone, then all five cues over real theme excerpts. Outer
// excerpt ramps are 20 ms and never touch the central loop seam. Pauses between
// labelled clips are intentional. Runtime WAVs themselves are not modified.
const chunks = [], timeline = [];
let cursor = 0;
const append = (samples, label, details, ramp = false) => {
  const clip = Int16Array.from(samples, (sample, i) => {
    const edge = ramp ? Math.min(1, i / 882, (samples.length - 1 - i) / 882) : 1;
    assert.ok(Math.abs(sample) < 32767, 'Audition clipping');
    return Math.round(sample * Math.max(0, edge));
  });
  timeline.push({ label, startSeconds: cursor / rate, endSeconds: (cursor + clip.length) / rate, ...details });
  chunks.push(clip, new Int16Array(rate));
  cursor += clip.length + rate;
};
for (const id of ['village-loop', 'library-loop']) {
  const pcm = buffers.get(id);
  for (let pass = 1; pass <= 2; pass++) {
    const clip = Float64Array.from({ length: rate * 12 }, (_, i) => pcm[(pcm.length - rate * 6 + i) % pcm.length] * .25);
    append(clip, `${id}: join ${pass}`, { joinSeconds: (cursor + rate * 6) / rate, musicGain: .25, effectsGain: 0 }, true);
  }
}
const cueIds = ['pickup', 'placement', 'support', 'success', 'restoration'];
for (const id of cueIds) append(Float64Array.from(buffers.get(id), value => value * .5), `${id}: alone`, { musicGain: 0, effectsGain: .5 });
for (const [index, id] of cueIds.entries()) {
  const cue = buffers.get(id);
  const themeId = index % 2 ? 'library-loop' : 'village-loop';
  const music = buffers.get(themeId);
  const lead = rate;
  const clip = Float64Array.from({ length: cue.length + rate * 2 }, (_, i) => music[(rate * (12 + index * 7) + i) % music.length] * .25 + (i >= lead && i < lead + cue.length ? cue[i - lead] * .5 : 0));
  append(clip, `${id}: over ${themeId}`, { cueSeconds: (cursor + lead) / rate, musicGain: .25, effectsGain: .5 }, true);
}
const audition = Buffer.alloc(44 + cursor * 2);
const template = await load('public/assets/audio/pickup.wav');
template.copy(audition, 0, 0, 44);
audition.writeUInt32LE(audition.length - 8, 4); audition.writeUInt32LE(audition.length - 44, 40);
let position = 44;
for (const chunk of chunks) for (const sample of chunk) { audition.writeInt16LE(sample, position); position += 2; }
assert.equal(position, audition.length);
const preview = Buffer.alloc(44 + 51 * rate * 2);
template.copy(preview, 0, 0, 44);
preview.writeUInt32LE(preview.length - 8, 4); preview.writeUInt32LE(preview.length - 44, 40);
for (const [id, sourceSecond, outputSecond] of [['village-loop', 4, 0], ['library-loop', 24, 26]]) {
  const pcm = buffers.get(id);
  for (let i = 0; i < rate * 25; i++) {
    const fade = Math.min(1, i / (rate * .08), (rate * 25 - 1 - i) / (rate * .08));
    preview.writeInt16LE(Math.round(pcm[sourceSecond * rate + i] * .25 * fade), 44 + (outputSecond * rate + i) * 2);
  }
}
const report = { ...reproduction, sourceMixBound, independentHeaderChecks: headerChecks,
  registerPreservation: preservation,
  audition: { file: 'assets/source/audio/audition.wav', bytes: audition.length, frameCount: cursor, seconds: cursor / rate, sha256: sha(audition), timeline },
  musicPreview: { file: 'assets/source/audio/music-preview.wav', bytes: preview.length, seconds: 51, sha256: sha(preview),
    description: 'Village source 4–29 seconds, 1-second pause, library source 24–49 seconds; music gain 0.25 baked in; 80 ms outer fades; no seam assessment.' },
  listening: { status: 'TRACK SELECTION ACCEPTED; detailed acoustic checks UNVERIFIED', method: 'On 9 October 2026 the human listened to the replacement comparison and replied: Much better—use these tracks. This accepts the chosen pair. Device/player, full-theme, two-join and cue observations were not supplied. No exposed acoustic-listening or browser-loopback assessment tool is available to this agent.',
    reviewOwner: 'Project requester (human source-audio reviewer), coordinated by Controller; WP02-05A owns speech/mix integration and WP06 owns published listening.' } };
const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Learning is Fun — source audio audition</title>
<style>body{max-width:850px;margin:2rem auto;padding:0 1rem;font:18px/1.5 system-ui;background:#faf6e9;color:#253b36}audio{width:100%}table{border-collapse:collapse;width:100%;font-size:15px}td,th{border:1px solid #bbb;padding:.5rem;text-align:left}button{padding:.6rem 1rem;font:inherit}h1{font-size:1.8rem}</style>
<h1>Licensed replacement soundtrack audition</h1><p><strong>Chosen pair approved by the requester on 9 October 2026: “Much better—use these tracks.”</strong> The five existing cues are unchanged. Detailed join, cue and integrated speech observations remain unverified; no second selection approval is requested.</p>
<p>Village: “Market on the Sea” composed by <a href="https://www.jshaw.co.uk/">Jonathan Shaw</a> (<a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>), complete repeated section, mono conversion and reduced gain. <a href="https://opengameart.org/content/market-on-the-sea-rpg-orchestral-essentials-village-music">Original source</a>.</p>
<p>Library: “Sunset Walk” by Kilua Boy / KiluaBoy (<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>), complete loop, mono conversion and reduced gain. <a href="https://opengameart.org/content/sunset-walk-ambient-quiet-sweet-loop">Original source</a>.</p>
<p>Review owner: project requester, coordinated by Controller. Listen at a comfortable device volume. The audition file already contains music at 25% and effects at 50%; leave its player at 100%. Device volume and automatic audio processing change perceived loudness.</p>
<button id="stop">Pause every player</button><h2>Quick music comparison (51 seconds)</h2>
<audio controls preload="metadata" src="music-preview.wav" data-gain="1"></audio>
<p>Village for 25 seconds, one-second pause, then library for 25 seconds. Music 25% is baked in. Full themes are below.</p>
<h2>Join and cue reel (${(cursor / rate).toFixed(2)} seconds)</h2>
<audio controls preload="metadata" src="audition.wav" data-gain="1"></audio>
<p>Each 12-second join excerpt crosses the exact runtime last-to-first frame at its centre. Only the outer 20 ms is faded. One-second pauses separate clips. Each theme's same seam is presented twice. This reel does not substitute for hearing the complete arrangements below.</p>
<table><tr><th>Time (seconds)</th><th>Clip</th><th>Listen at</th></tr>${timeline.map(item => `<tr><td>${item.startSeconds.toFixed(2)}–${item.endSeconds.toFixed(2)}</td><td>${item.label}</td><td>${item.joinSeconds === undefined ? item.cueSeconds === undefined ? 'Whole cue' : `Cue at ${item.cueSeconds.toFixed(2)}` : `Join at ${item.joinSeconds.toFixed(2)}`}</td></tr>`).join('')}</table>
<h2>Complete arrangements and individual cues</h2><p>Initial player gains below are 25% music / 50% effects. Playing one pauses the others. No autoplay, repeated-ended looping, speech or game preferences are implemented here.</p>
${entries.map(entry => `<h3>${entry.assetId}</h3><audio controls preload="none" src="../../../public/${entry.path}" data-gain="${entry.kind === 'loop' ? .25 : .5}"></audio>`).join('\n')}
<h2>Integration listening record</h2><p>The chosen music is approved. During the integrated review, record reviewer, date, device/browser/headphones or speakers and device volume; full-theme observations; each of the four join timestamps; all five cues alone and against music; any click, gap, harshness, fatigue or startling level jump; and pass/fail with fixes. Those details were not supplied with the selection approval. Speech masking/duck restoration still needs the WP02-05A integrated runtime and published WP06 session.</p>
<script>const players=[...document.querySelectorAll('audio')];for(const player of players){player.volume=Number(player.dataset.gain);player.addEventListener('play',()=>players.forEach(other=>{if(other!==player)other.pause()}))}document.querySelector('#stop').onclick=()=>players.forEach(player=>player.pause());</script></html>\n`;
assert.ok(process.argv.slice(2).every(arg => ['--write-evidence', '--check-register-handoff'].includes(arg)), 'Unsupported QA argument');
for (const [name, value] of [['measurements.json', JSON.stringify(report, null, 2) + '\n'], ['audition.wav', audition], ['music-preview.wav', preview], ['audition.html', html]]) {
  const data = typeof value === 'string' ? Buffer.from(value) : value;
  if (process.argv.includes('--write-evidence')) await writeFile(new URL(name, source), data);
  else assert.ok(data.equals(await readFile(new URL(name, source))), `${name} evidence is stale`);
}
console.log(JSON.stringify({ status: 'PASS: headers, audio catalogue/register, original-source reproduction, mix bound, review artifacts', files: entries.length,
  largestBytes: reproduction.largestBytes, totalRuntimeBytes: reproduction.totalBytes, auditionSeconds: cursor / rate,
  reviewArtifact: fileURLToPath(new URL('audition.html', source)), acousticAcceptance: report.listening.status }, null, 2));
