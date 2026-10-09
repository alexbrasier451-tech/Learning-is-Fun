# Original soundtrack direction and source evidence

WP02-03A, 9 October 2026. **Technical source production complete; acoustic
acceptance UNVERIFIED.** No audible listening result is claimed. The review owner
is the **project requester as human source-audio reviewer, coordinated by the
Controller**, or a Controller-assigned audio-capable reviewer who can actually
hear the files. Runtime controls, speech mixing and published listening remain
WP02-05A / WP06 / WP02-12A responsibilities.

## Sonic direction

The original family accompanies the layered storybook miniature. A small
F#–A–B / A–E question moves through Dadd9, Bm7, G and suspended A harmony.
Low warm tones anchor it; soft plucks carry the melody; occasional higher bell
partials and quiet wooden taps mark changes. These are authored arrangements,
not transcriptions of an external reference. No lyrics or failure buzzer.
The descriptions here state compositional intent, not heard results.

**The Green Wakes Slowly** (village) is 16 bars of 4/4 at 54 BPM: 71.111111…
seconds, 153 note events. Bars 1–4 ask and answer in D/B minor; 5–8 move through
G and A; 9–12 lift the motif and change harmony more often; 13–16 descend to D.
Melody rests separate short phrases. Quiet secondary plucks and a wood accent
pattern vary by bar, with percussion omitted in each fourth bar. Use for green,
bridge and market, then workshop/castle in expansion.

**Lamplight between the Pages** (library) slows the same 16-bar harmonic journey
to 48 BPM: 80 seconds, 102 events. It omits selected melody notes and most
accompaniment/percussion, raises the lowest sustained voice, uses occasional
bell-led questions and has a lower master level. Use for library and forest.

Pickup is a short open fifth; placement adds a quiet wooden contact under a
lower fifth. Support turns gently to an open ending. Success is a compact
arrival without a fanfare. Restoration opens the shared motif into sustained D
and also serves the welcome scene. Full event lists and instrument definitions
are in [village.json](../assets/source/audio/village.json),
[library.json](../assets/source/audio/library.json) and
[effects.json](../assets/source/audio/effects.json).

## Source/render contract

All exports are mono 44,100 Hz, 16-bit signed little-endian PCM in a 44-byte RIFF
WAV header. Event `beat` and `duration` use the score tempo (effects use 60 BPM,
so beats equal seconds); `note` is MIDI pitch; `level` and `masterGain` are
linear amplitudes. Envelopes use raised-cosine attack/release and exponential
decay. Oscillators use the literal original partial ratios/amplitudes; wooden
tones add fixed-seed, low-pass-filtered xorshift noise. No sample library,
network service, runtime synth, scheduler or editor dependency is used.

The [renderer](../tools/render-audio.mjs) sums complete event releases modulo
the phrase frame count and applies finite, circular reflection taps. Thus the
loop file includes steady-state tails from the prior cycle. Loop start is frame
0; end is the exclusive buffer frame count. No seam silence, appended padding,
global fade-in/out or seam crossfade is inserted. Each note's own envelope still
ramps naturally. Non-loop cues include their complete finite tails and a short
zero ending; the renderer rejects a cue whose release/reflections would be cut.

At runtime, use one decoded Web Audio buffer with loopStart/loopEnd calculated
from frame/sampleRate. Do not replay HTML media `ended` events. Because full
loop buffers start mid-tail, the runtime should fade the channel on entry/exit;
that is distinct from the internal repeating seam. Paths in
[AUDIO_ASSETS](../src/audio/catalogue.ts) are passed through WP01 `assetUrl`.
The catalogue has no state/controller imports.

## Exact export measurements

Files are `public/assets/audio/<asset ID>.wav`; the register stores
`assets/audio/<asset ID>.wav`. Bytes include the header. RMS includes the whole
buffer, including cue tails. dBFS is a sample-domain measurement, not perceived
loudness or an acoustic safety claim.

| Asset ID | Frames | Seconds | Bytes | Peak dBFS | RMS dBFS |
|---|---:|---:|---:|---:|---:|
| village-loop | 3,136,000 | 71.111111… | 6,272,044 | −13.44 | −27.21 |
| library-loop | 3,528,000 | 80 | 7,056,044 | −16.17 | −31.41 |
| pickup | 37,485 | 0.85 | 75,014 | −17.08 | −29.24 |
| placement | 35,280 | 0.8 | 70,604 | −18.56 | −30.81 |
| support | 72,765 | 1.65 | 145,574 | −20.16 | −31.43 |
| success | 94,815 | 2.15 | 189,674 | −16.62 | −30.80 |
| restoration | 198,450 | 4.5 | 396,944 | −16.87 | −29.91 |

**Largest audio file: 7,056,044 bytes. Total seven-file audio: 14,205,898 bytes.**
These are WP01 cache sizing inputs, not accepted performance budgets. The two
decoded mono float32 loops at 44.1 kHz occupy 26,656,000 sample bytes combined,
excluding decoder/object overhead. At 48 kHz the pair is approximately 29.01 MB
of samples after resampling; that is a calculation, not a device measurement.
Decode lazily, keep the current/briefly incoming theme and release superseded
buffers. Precache only ready runtime paths from the register; none of the source
review files or scripts belongs in the runtime inventory.

| Numeric join check | Village | Library |
|---|---:|---:|
| Last PCM → first PCM | 456 → 411 | −5 → −41 |
| Absolute step at wrap (16-bit units) | 45 | 36 |
| Maximum step inside buffer | 521 | 307 |
| Maximum step in ±10 ms join window | 108 | 62 |
| RMS in that 20 ms window (dBFS) | −28.25 | −33.77 |

The nonzero join windows and step comparison check for gross digital seam
mistakes. They do not prove absence of audible clicks, gaps, harmonic distraction
or fatigue. Exact hashes, DC, peaks, frames and zero runs are retained in
[measurements.json](../assets/source/audio/measurements.json).

## Proposed mix and numeric correction

Use DEC-004's initial enabled channel levels: **music 0.25, effects 0.50**;
do not independently normalize each file. Library is intentionally quieter.
The initial cue master gain 0.85 would permit a conservative worst-case sum
above full scale with two themes and four effect voices at unity. Before final
delivery it was reduced to 0.60 and all WAVs/review artifacts were regenerated.
This is a numeric source-headroom correction, not a listening correction.

The final bound is the sum of both measured theme peaks plus four times the
loudest measured cue peak: below 1.0 even when all six source gains are unity.
At default channel levels the same conservative bound is below 0.39. It assumes
at most four effects, gain ≤1 and only these sources; it is not a guarantee about
resampler intersample overshoot, device processing or speech. WP02-05A should
replace the oldest effect transient when all four voices are occupied and manage
short theme fades. Speech must lower only otherwise-permitted music and restore
only the currently permitted prior level; actual intelligibility and speech/mix
comfort require integrated listening, including maximum-volume settings.

## Convenient acoustic handoff

Open [audition.html](../assets/source/audio/audition.html) locally in a browser.
It has one pre-mixed 91.90-second reel, complete theme/cue players, timestamps,
and pause-all. No server, network, autoplay or saved preference is required.
The standalone [audition.wav](../assets/source/audio/audition.wav) also works in
an ordinary audio player: music 25%, effects 50% are already baked in, so leave
that player's gain at 100% and use a comfortable device volume.

The reel presents village joins at **6 s and 19 s**, library joins at **32 s and
45 s**, then every cue alone (from 52 s) and against music (from 66.95 s).
Each join excerpt contains six seconds before and after the exact wrap. The same
seam is presented twice per theme; only the outer 20 ms of each excerpt is faded.
One-second pauses separate labelled clips and are not runtime-loop gaps.
Complete arrangements are available below the reel for phrase/variation review.

The named reviewer should record date, device, browser/player, speakers/headphones
and device volume; observations at all four join timestamps; the complete themes;
each cue alone and mixed; any click, gap, harshness, fatigue or startling jump;
and an explicit pass/fail with required corrections. Return findings to Controller
for source-owner repair. **No reviewer has yet supplied this evidence.** Hearing
the source reel does not accept speech masking or actual published playback.

## Reproduction and verified scope

From the repository root, using the existing Node v24.19.0:

```text
node tools/render-audio.mjs
node tools/render-audio.mjs --check
node assets/source/audio/verify-audio.mjs --write-evidence
node assets/source/audio/verify-audio.mjs
node assets/source/audio/check-browser.mjs
```

Renderer output is limited to the seven exact runtime WAVs; `--check` writes
nothing and compares a fresh in-memory render byte-for-byte. The separate QA
script independently reads on-disk headers/PCM, compares catalogue/register,
checks the source mix bound and regenerates/checks the source-only audition and
measurements. Same-environment reproduction was verified; cross-engine/platform
bit identity of JavaScript transcendental math is not asserted.

`check-browser.mjs` uses the existing @playwright/test and installed Chromium,
with no installation step. All seven WAVs decoded with the exact sample rate,
frames and mono channels at an explicitly requested 44.1 kHz AudioContext.
The audition metadata/initial volumes/no-autoplay checks also passed. Results
are in [browser-decode.json](../assets/source/audio/browser-decode.json).
No audio was listened to, captured through loopback or assessed acoustically.

Rights, actual tools and the exact authorized project-use statement are retained
in [PROVENANCE.md](../assets/source/audio/PROVENANCE.md). No external recordings,
licences or sample rights were inferred from an editor. No arbitrary CC0/GPL
relicensing was applied.
