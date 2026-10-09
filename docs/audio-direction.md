# Soundtrack direction — licensed music replacement

9 October 2026. **The human approved this chosen pair: “Much better—use these
tracks.”** The replacement comparison was heard; detailed join/cue/integrated
acoustic checks remain UNVERIFIED. The human rejected the earlier synthesized
music and explicitly requested existing free licensed recordings. The five
original effects are unchanged. The old version is preserved in
[rejected-synthesis](../assets/source/audio/rejected-synthesis/README.md).

## Selected recordings and intended roles

**Village — Market on the Sea**, composed by Jonathan Shaw (InspectorJ).
The creator describes it as orchestral village/market music and supplies a
recording with an internal repeat. It is offered under CC BY 3.0 Unported.
Use for green, bridge and market, later workshop/castle.
[Creator source](https://opengameart.org/content/market-on-the-sea-rpg-orchestral-essentials-village-music).

**Library — Sunset Walk**, by Kilua Boy / KiluaBoy. The creator describes a
quiet ambient loop with a melody and supplies the lossless 76.8-second WAV under
CC0 1.0 Universal. Use for library and forest. It is gain-staged quieter than
the village recording.
[Creator source](https://opengameart.org/content/sunset-walk-ambient-quiet-sweet-loop).

The human's selection approval is recorded without claiming the agent heard the
tracks. The pair uses existing arranged recordings rather than the rejected
synthesized themes. Preserve these tracks. Detailed acoustic observations were
not supplied with that approval. The earlier shared-motif/original-only design
is superseded by the music replacement instruction.

A Tale of Peace, also by Jonathan Shaw, was inspected as a same-collection
library candidate. Its measured repeat is about 103.66 seconds, outside the
preferred range. It was not truncated to manufacture a shorter arrangement.
Sunset Walk preserves its whole creator-supplied period instead.

## Exact transformations and rights

[village.json](../assets/source/audio/village.json) and
[library.json](../assets/source/audio/library.json) are the editable recipes.
They record source identity, master hash, format, source/loop frame endpoints
and linear gain. No notes were transcribed or fabricated for these recordings.

Village import decodes the unmodified retained MP3 to 44.1 kHz stereo using
Chromium 156.0.8078.4, averages the channels and retains decoded frames
**3,086,846 through 6,173,692 exclusive**: one **69.99650794-second** phrase
cycle in the second pass, which already contains prior-cycle reverberation.
Independent one-second waveform windows at source seconds 8, 20, 35 and 50 all
find the same 3,086,846-frame repeat offset, with correlation above 0.994.
This supports a repeated musical period; it is not an audible-join judgement.
The selected float32 master is retained and hash-pinned. Final gain is **0.35**.

Library conversion reads the original stereo PCM16 WAV directly and averages
the channels. Its `smpl` start 0 / inclusive end 3,386,879 matches the entire
**3,386,880-frame, 76.8-second** data chunk. The export retains that whole period,
with final gain **0.16**. No duration adjustment is made.

Both become mono 44.1 kHz PCM16 WAVs. Neither transformation changes tempo/pitch,
adds instruments, inserts join silence or adds a seam crossfade. The library's
natural source onset is retained; its longest quantized zero run is 119 frames
(2.70 ms), not a gap inserted by this producer. Runtime entry/exit fades remain
appropriate because beginning a loop buffer is distinct from its internal wrap.

Original files, licence versions, downloaded licence text, creator-posted pages
and attribution/change notices are retained under
[licensed/](../assets/source/audio/licensed/). See
[Market on the Sea licence](../assets/source/audio/licensed/market-on-the-sea-LICENSE.md),
[Sunset Walk licence](../assets/source/audio/licensed/sunset-walk-LICENSE.md) and
[provenance](../assets/source/audio/PROVENANCE.md).
The register now marks both music rows as reused, not original. Required
title/author/source/licence/change credits must reach the product's credits.
CC0 describes only Kilua Boy's existing dedication, not the other assets.

## Runtime export contract and measurements

[AUDIO_ASSETS](../src/audio/catalogue.ts) keeps all seven existing keys and
base-relative paths. Consumers call WP01 `assetUrl`, decode Web Audio buffers
and use loopStart/loopEnd in seconds = frame/sampleRate. End is exclusive.
Do not loop via repeated HTML-media ended events. No controller/state import,
runtime synthesis, streaming or new inventory format was introduced.

Every file below is `public/assets/audio/<ID>.wav`, with a 44-byte RIFF header,
mono 44,100 Hz, signed little-endian 16-bit PCM. Loop start is 0 and exclusive
end equals the frame count. Bytes include the header.

| ID | Frames | Seconds | Bytes | Peak dBFS | RMS dBFS |
|---|---:|---:|---:|---:|---:|
| village-loop | 3,086,846 | 69.996508 | 6,173,736 | −12.78 | −31.05 |
| library-loop | 3,386,880 | 76.8 | 6,773,804 | −17.45 | −35.51 |
| pickup | 37,485 | 0.85 | 75,014 | −17.08 | −29.24 |
| placement | 35,280 | 0.8 | 70,604 | −18.56 | −30.81 |
| support | 72,765 | 1.65 | 145,574 | −20.16 | −31.43 |
| success | 94,815 | 2.15 | 189,674 | −16.62 | −30.80 |
| restoration | 198,450 | 4.5 | 396,944 | −16.87 | −29.91 |

Largest required audio file: **6,773,804 bytes**. Total: **13,825,350 bytes**.
WP01 derives its inventory from the ready register, not source/review files.
Decoded float32 loop samples at 44.1 kHz total **25,894,904 bytes**, excluding
overhead. Cache/device budgets are not accepted by this measurement. Decode
lazily; retain current/briefly incoming music and release superseded buffers.

| Numeric seam observation | Village | Library |
|---|---:|---:|
| Last → first PCM sample | −33 → 65 | 48 → 0 |
| Wrap step (16-bit units) | 98 | 48 |
| Maximum step inside buffer | 1,466 | 1,852 |
| ±10 ms join-window RMS dBFS | −30.82 | −56.71 |

These measurements do not establish an inaudible join or comfortable sound.
[measurements.json](../assets/source/audio/measurements.json) holds exact hashes,
frames/bytes, peaks/RMS/DC, source identities, seam observations and review timeline.

Keep DEC-004's initial enabled levels: music **25%**, effects **50%**. Do not
normalize each file independently. The library's whole-file RMS is 4.45 dB below
the village's; perceived loudness is still unverified. Conservative peak sum
for two themes and four loudest effect voices is **0.9543762** at unity gains,
**0.3862381** at default gains. This excludes speech, resampler overshoot and
device processing. Four-effect voice limiting, short theme fades, speech ducking,
silence/mute gates and restoration of only permitted levels remain WP02-05A.

## Listen to the new version

Open the [audition page](../assets/source/audio/audition.html) directly from disk:

- **51-second quick music comparison:** village excerpt (25 seconds), one-second
  pause, then library excerpt (25 seconds). The standalone
  [music-preview.wav](../assets/source/audio/music-preview.wav) has music gain
  25% baked in; leave its player at 100% and choose a comfortable device volume.
- **Full themes and five cues:** separate players at initial 25%/50% levels.
- **91.90-second join/cue reel:** village joins at 6/19 s, library joins at 32/45 s;
  every cue alone from 52 s and against music from 66.95 s.
  [Standalone audition.wav](../assets/source/audio/audition.wav).

The quick preview has 80 ms outer fades. Join clips retain six seconds on each
side of the actual seam with only 20 ms fades at their outer edges; the same seam
is presented twice per theme. One-second pauses separate labelled clips and are
not runtime-loop gaps. The five cue WAVs and their original composition remain
byte-identical to the first delivery.

**WP02-03A-SOURCE-LISTENING owner:** project requester as human reviewer,
coordinated by Controller, or an explicitly assigned audio-capable reviewer.
The human has accepted the replacement pair after the comparison, without
specifying device/player, complete-theme, join or cue observations. No second
selection approval is requested now. At integration, record full-theme suitability,
both joins per theme, all cues alone/mixed, clicks/gaps/harshness/startling jumps,
reviewer/date/device/player/volume and pass/fail or changes. Selection approval does not accept speech
masking or the actual published build: those remain WP02-05A / WP06 / WP02-12A.

## Reproduction and focused checks

From repository root, using existing Node v24.19.0:

```text
node assets/source/audio/licensed/decode-sources.mjs
node tools/render-audio.mjs --check
node assets/source/audio/verify-audio.mjs
node assets/source/audio/check-browser.mjs
```

The first command reproduces the village master from the retained original MP3,
checks its exact hash and repeat alignment, without writing. Add `--write` only
to rebuild that intermediate/report using the pinned decoder. Normal rendering
uses retained masters, needs no browser/network and writes only the seven named
WAVs when `--check` is omitted. To regenerate source-only review derivatives,
use `verify-audio.mjs --write-evidence`.

All seven final WAVs reproduced byte-for-byte. Independent RIFF/PCM checks,
catalogue/register agreement, unchanged-cue hashes, source mix bound, current
review artifacts, focused TypeScript and all 20 experience catalogue tests passed.
Chromium decoded each real WAV at exact 44.1 kHz frame counts; nine audition
players were paused with correct initial gains/no autoplay. No agent listening,
loopback capture, physical-device test or published-game acceptance is claimed;
the separate human selection approval is retained exactly as received.
