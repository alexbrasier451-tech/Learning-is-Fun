# WP02-03A — Licensed music replacement handoff

9 October 2026. **The human rejected the first synthesized themes, then approved
this licensed pair after listening to the replacement comparison: “Much better—use
these tracks.” Technical source production is complete.** Detailed join/cue and
integrated acoustic evidence remains unverified; track selection is accepted.
Do not treat the old technical report as acceptance of the new files. Controller
owns independent validation, administrative acceptance, shared authority and Git.

The human explicitly requested existing properly licensed free music online,
superseding original-only theme composition. Controller released exclusive
audio runtime/catalogue/register ownership before any existing exports or records
were changed. Two themes were replaced; the five cues remain byte-identical.
No other worker/chat, shared configuration, dependency, state, UI, controller,
commit or second runtime inventory was created or changed.

## New music and exact provenance

| Role / export | Recording and creator | Licence | Frames / seconds | Bytes |
|---|---|---|---:|---:|
| village-loop.wav | Market on the Sea — Jonathan Shaw (InspectorJ) | CC BY 3.0 Unported | 3,086,846 / 69.99650794 | 6,173,736 |
| library-loop.wav | Sunset Walk — Kilua Boy / KiluaBoy | CC0 1.0 Universal | 3,386,880 / 76.8 | 6,773,804 |

[Village creator page](https://opengameart.org/content/market-on-the-sea-rpg-orchestral-essentials-village-music)
and [library creator page](https://opengameart.org/content/sunset-walk-ambient-quiet-sweet-loop)
explicitly offer the respective licences. Originals, creator pages, full licence
text and acquisition hashes are retained in
[licensed/](../../../assets/source/audio/licensed/), including the composer's
included PDF EULA. The selected village adaptation licence is the creator's
explicit CC BY 3.0 offering; the additional EULA is retained, not substituted.
Its historical update URL was unavailable to the web reader.

Use required credits from the register: title, actual creator, source/licence
links and transformation notice. In particular, “Market on the Sea” Composed by
Jonathan Shaw (www.jshaw.co.uk), CC BY 3.0; adapted by complete-loop extraction,
mono PCM conversion and gain reduction. Kilua Boy credit is voluntarily retained
alongside the existing CC0 dedication. Neither track is falsely described as
Codex-authored, project-owned or newly relicensed.
[Complete provenance](../../../assets/source/audio/PROVENANCE.md).

## Musical-period selection and reproducible processing

Village: retain decoded source frames **3,086,846–6,173,692 exclusive**, the
second full repeated phrase period. Four independent one-second windows at
8/20/35/50 seconds agree on a **3,086,846-frame offset**, correlations
0.99488/0.99885/0.99755/0.99716. The creator describes an internal repeat; selecting
the second pass preserves prior-cycle reverberation. No arbitrary partial-phrase
duration cut, tempo/pitch change, seam crossfade or inserted silence. Arithmetic
stereo downmix, then gain **0.35**, then PCM16 quantization.

Library: retain the complete creator WAV, whose `smpl` start 0 / inclusive end
3,386,879 matches all 76.8 seconds. Arithmetic stereo downmix, gain **0.16**,
PCM16 quantization; no trim or additional seam treatment. Natural source onset
remains; the longest final quantized zero run is 119 frames (2.70 ms), not an
inserted gap. Acoustic join quality still needs listening.

A Tale of Peace was investigated as a same-collection candidate, but its observed
~103.66-second repeat exceeded the preferred duration. It was not cut merely to
fit. Its unused download/large decode intermediates were removed from this
worker's source tree; its source-page evidence remains. Sunset Walk supplied a
complete period within the existing duration contract, so no duration/interface
amendment or second inventory was needed.

Recipes remain [village.json](../../../assets/source/audio/village.json) and
[library.json](../../../assets/source/audio/library.json). Village's retained
hash-pinned selected float master supports normal offline Node rendering;
[decode-sources.mjs](../../../assets/source/audio/licensed/decode-sources.mjs)
also reproduces that master from the unmodified MP3 through the existing pinned
Chromium decoder. The library's original lossless WAV is read directly.
[decode-manifest.json](../../../assets/source/audio/licensed/decode-manifest.json)
records input/output hashes, frames, decoder and repeat alignment.

## Unchanged runtime interface and cue inventory

All seven exports remain mono 44.1 kHz, 16-bit PCM WAV, under the same
`public/assets/audio/` paths. [AUDIO_ASSETS](../../../src/audio/catalogue.ts)
keeps its exact seven keys, base-relative path/kind/sampleRate/frameCount/bytes
shape and exclusive loop endpoints. Use WP01 `assetUrl`; loop seconds are
frames/sampleRate. No state/controller imports, runtime MP3 playback or synthesis.

| Unchanged cue | Frames | Seconds | Bytes |
|---|---:|---:|---:|
| pickup.wav | 37,485 | 0.85 | 75,014 |
| placement.wav | 35,280 | 0.8 | 70,604 |
| support.wav | 72,765 | 1.65 | 145,574 |
| success.wav | 94,815 | 2.15 | 189,674 |
| restoration.wav | 198,450 | 4.5 | 396,944 |

Current largest audio file: **6,773,804 bytes**. Current seven-file total:
**13,825,350 bytes**. The old 14,205,898-byte total is superseded.
At 44.1 kHz, the pair's decoded float32 samples total **25,894,904 bytes** before
overhead. These are cache sizing inputs, not performance acceptance.

Only the two music register rows changed in this revision; five effect and
64 non-audio records were preserved. [Revision preservation evidence](../../../assets/source/audio/licensed/revision-preservation.json)
retains their canonical before/after hash. Source/review/archive files are not
runtime inventory or precache assets. WP01 consumes ready register paths.

## Technical verification performed on this replacement

Existing Node v24.19.0 and Chromium 156.0.8078.4; no installation or paid/account
dependency. All commands run from repository root.

1. `node assets/source/audio/licensed/decode-sources.mjs --write`, then the same
   command without `--write`: original MP3 → decoded stereo → mono selected
   master reproduced exactly; four repeat-offset checks passed.
2. `node tools/render-audio.mjs`: generated exactly seven runtime WAVs.
   `node assets/source/audio/verify-audio.mjs --write-evidence`, then
   `node assets/source/audio/verify-audio.mjs --check-register-handoff`: all
   seven fresh renders byte-identical; independent actual RIFF/PCM headers,
   frames/rate/channels/bits/bytes and register/catalogue/source agreement passed;
   five effect hashes equal the prior delivery; mix bound and review artifacts
   passed. Omit the optional historical register-snapshot flag after later
   authorized non-audio writers advance their own records.
3. `node assets/source/audio/check-browser.mjs`: all seven final WAVs decoded
   to exact mono/44.1kHz/frame counts; nine audition players had intended initial
   gains, were paused and had no autoplay. No audible playback or listening was
   performed. [Browser evidence](../../../assets/source/audio/browser-decode.json).
4. `node node_modules/vitest/vitest.mjs run tests/experience/catalogue.test.ts`:
   all **20 tests passed**, including ready reused-licence records.
5. Focused no-output TypeScript passed:
   `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental
   false --strict --skipLibCheck --target ES2022 --module ESNext
   --moduleResolution Bundler --types node src/audio/catalogue.ts`.
6. Scoped text/link/diff checks; unchanged non-theme record/source effect checks.
   No unrelated full application, physical-device or published journey claimed.

Acquisition initially hit the sandbox network boundary; the authorized download
was completed through the normal reviewed escalation. PDF text extraction used
the available pypdf after an unavailable fitz probe; no packages were installed.
A duplicate delete/add patch request was rejected before any write and reapplied
as an ordinary update. No production regression was hidden by those tool issues.

[measurements.json](../../../assets/source/audio/measurements.json) holds final
SHA-256/frames/bytes/peaks/RMS/DC/joins. Village peak/RMS: **−12.78/−31.05 dBFS**;
library: **−17.45/−35.51 dBFS**. Wrap steps are **98/48** PCM units, versus
within-buffer maximum steps **1,466/1,852**. No sample clips. Conservative peak
sum of both themes plus four loudest effect voices: **0.9543762** at unity,
**0.3862381** at default 25% music / 50% effects. These bounds exclude speech,
resampler overshoot and device processing. Numeric checks do not imply comfort
or heard seamlessness.

## Concrete human-review handoff: WP02-03A-SOURCE-LISTENING

Owner remains **project requester as human reviewer, coordinated by Controller**,
or a Controller-named reviewer with a real audio-listening route.
The human's exact replacement verdict is **“Much better—use these tracks”**, after
listening to the comparison, conveyed by Controller on 9 October 2026. This accepts
the chosen pair. No device/player, complete-theme, two-join or cue observations
were supplied; those detailed acoustic criteria remain unverified. Preserve this
pair and do not ask for another selection approval now.

- [Audition page](../../../assets/source/audio/audition.html): opens locally;
  credits, quick music comparison, full themes/cues and join reel.
- [51-second music preview](../../../assets/source/audio/music-preview.wav):
  village for 25 seconds, 1-second pause, library for 25 seconds; music 25% baked
  in. Full processed themes are available in the page, not merely this excerpt.
- [91.90-second join/cue reel](../../../assets/source/audio/audition.wav):
  village joins at 6/19 seconds, library joins at 32/45; all five cues alone and
  over new music. Intended 25% music / 50% effects are baked in.
- [Rejected baseline](../../../assets/source/audio/rejected-synthesis/README.md)
  remains available for comparison, not as accepted or active music.

During integration, assess complete phrases, two joins/theme, all cues and relative
levels; record reviewer/date/device/player/volume and specific changes or acceptance.
These observations must not be inferred from the selection approval. The source
owner remains responsible for fixes.
No exposed tool in this session supplies acoustic listening or browser-loopback
assessment, so no claim of hearing is made.

WP02-05A retains controls, four-effect voice limiting, transitions, speech
duck/restoration and mute/cancellation guards; WP06/WP02-12A retain actual
published-build listening. Readable credits must consume the new reused author/
licence/change metadata. Controller may commission independent technical review
and proceed with this approved pair; detailed acoustic and published-playback
acceptance must remain visibly pending.
