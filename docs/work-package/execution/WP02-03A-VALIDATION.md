# WP02-03A — Independent technical audio validation

9 October 2026. Independent report-only review of the finished-media producer.
The reviewer authored no media and changed no production/source asset, catalogue,
register, configuration, test or shared ledger. Administrative acceptance remains
Controller-owned.

## Current verdict — licensed replacement

**PASS for the current licensed-source/technical handoff. The chosen musical pair
is human-approved: “Much better—use these tracks.”** That selection approval
supersedes the old music rejection for the active replacement files. No repeated
source-selection approval is required. No blocking defect was found in the
changed provenance, processing, PCM, metadata or register boundary.

Detailed full-theme/two-join/cue/mix observations remain **UNVERIFIED**. No
device/player/volume details were supplied, and the reviewer did not hear or
acoustically assess these files. Selection approval does not establish clean
joins, cue comfort, speech intelligibility, transitions/mute behaviour or
published-game quality. Those checks remain with the named integration owners.

This recheck follows the current [technical handoff](WP02-03A-HANDOFF.md),
[audio direction](../../audio-direction.md) and human-authorized
[MUSIC-REVISION](MUSIC-REVISION.md). The original-only/shared-motif composition
requirement is superseded for the two themes. Existing runtime, provenance and
listening obligations persist. Original cues retain their earlier valid technical
evidence. Administrative acceptance remains Controller-owned.

### Current source and licence verification

Independently reopened the creator-posted pages and Creative Commons terms on
9 October 2026, and inspected the retained source/licence/acquisition evidence:

- [Market on the Sea](https://opengameart.org/content/market-on-the-sea-rpg-orchestral-essentials-village-music)
  is posted by InspectorJ with Jonathan Shaw's attribution and an explicit
  **CC BY 3.0** licence. The page links the same source ZIP retained here and
  describes an internal repeat. [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
  permits reuse/adaptation subject to its credit/licence/change-notice conditions
  and no additional restrictions. The register retains the title, actual creator,
  source/licence links and extraction/downmix/gain modification notice.
- [Sunset Walk](https://opengameart.org/content/sunset-walk-ambient-quiet-sweet-loop)
  is posted by KiluaBoy, credits Kilua Boy, links the retained WAV and explicitly
  offers **CC0**. Its [CC0 1.0 dedication](https://creativecommons.org/publicdomain/zero/1.0/)
  supports the documented reuse; optional creator credit is retained voluntarily.
  No project-original or Jonathan Shaw asset is relabelled CC0.

All eight acquisition-manifest byte lengths/SHA-256 values match retained files,
including source pages, full legal-code HTML, originals and creator PDF. Read the
ZIP entries without extracting: the MP3 and PDF contents exactly match the
retained MP3/PDF hashes. The bundled 2019 Jonathan Shaw EULA is retained as
additional evidence; the adaptation explicitly relies on the creator's CC BY 3.0
offering rather than substituting that EULA. Its historical update URL was not
needed for this verification. The retained extracted EULA text and licence
records support the documented creator credit; no unreviewed update is claimed.

Both theme permissions now correctly say **reused**, with specific versions,
licence URLs and retained evidence paths. Rights metadata is technically complete
for handoff. Downstream register-driven product credits must display the required
Jonathan Shaw attribution and links/change notice; this source review does not
claim that the final credits UI has already been inspected.

### Current transformation and technical results

| Active theme | Selected source period | Gain | Frames / seconds | Bytes / export SHA-256 |
|---|---|---:|---|---|
| Village — Market on the Sea | Decoded source frames 3,086,846–6,173,692 exclusive | 0.35 | 3,086,846 / 69.99650794 | 6,173,736; `d7c1512a10eec6c26cd351136ed299f5ac0d4d58e49c2b99361fc2cd9cf26d0a` |
| Library — Sunset Walk | Complete original WAV, frames 0–3,386,880 exclusive | 0.16 | 3,386,880 / 76.8 | 6,773,804; `3ca0ea4bfd638d6fd2ab3d98b305c90c65ca0cbecbbd1713ecacb555d0bb8e64` |

Fresh retained-MP3 decoding through Chromium **156.0.8078.4**, at 44.1 kHz,
reproduced 6,445,440 stereo frames, the selected mono float32 master and the exact
decode-manifest bytes. Four one-second source windows at 8/20/35/50 seconds again
selected the same **3,086,846-frame** offset, with correlations
**0.9948829 / 0.9988461 / 0.9975483 / 0.9971577**. Combined with the creator's
internal-repeat statement, this supports retaining one full repeated cycle in
the second pass, including prior-cycle reverberation. It is not an acoustic
judgment about the seam. The master hash matches
`6f468380a131eb0990af0ef7158a44a5a5b3aef0fbf6d3a5d1d9fc1e0f059ca3`.

Independently parsed the original library RIFF: stereo PCM16/44.1 kHz,
3,386,880 data frames and one `smpl` loop with start **0**, inclusive end
**3,386,879**. The complete creator-supplied period is retained. No arbitrary
shortening is needed. Normal rendering reads the lossless WAV directly;
village rendering reads the retained hash-pinned selected master, without
browser/network dependency after import.

Independently compared **every output sample** in both new themes with the
documented arithmetic channel mean, float32 intermediate where applicable,
linear gain and PCM16 quantization. All match. No tempo/pitch change, added
instrument, seam crossfade, inserted join silence or extra runtime file is in
the processing path. The library's longest quantized zero run is **119 frames
(2.70 ms)** and village's is **2 frames**; these derive from conversion of the
source, not a producer-added gap.

All seven runtime files independently pass RIFF/data-size, PCM-format, mono,
44,100 Hz, 16-bit, 2-byte block alignment, frame/byte, register/catalogue and
SHA-256 checks. Both loops use start 0 and exclusive end equal to frame count.
Recomputed peaks/RMS/DC and maximum steps match current measurements; there are
zero full-scale clipped samples. Village/library wrap steps are **98/48** PCM
units, versus within-buffer maxima **1,466/1,852**. These observations do not
establish an inaudible join.

Current audio total is **13,825,350 bytes**, largest file **6,773,804 bytes**;
decoded float32 loop sample storage at 44.1 kHz is **25,894,904 bytes**, before
overhead. The conservative two-theme-plus-four-largest-cue sample sum is
**0.954376220703125** at unity gains and **0.38623809814453125** at music 0.25 /
effects 0.50. Speech, resampler overshoot and device processing remain excluded.
These are sizing/headroom observations, not cache/device/acoustic acceptance.

### Preservation, interface and executed recheck

The five effect SHA-256 values still match the independently checked historical
delivery below; `effects.json` is byte-identical to its archived original. The
prior effect-tail/source checks remain valid. All **64 non-audio rows**, asset-ID
order and record schema independently match the accepted art register at
`9da250c`. The **69 non-theme rows** match the retained revision-preservation
hash `fa1a6fb01c493d30d0a0b7e3b7ec5874af03cc64c2e0cd47736790803696e2ed`.
The register remains 43 ready / 28 planned records. Two theme rows carry new
sources/rights/measurements; consumer keys, base-relative paths, field shapes
and frame-to-seconds contract are unchanged.

Executed using existing Node v24.19.0 and tools, with no source/evidence writes:

1. `node assets/source/audio/verify-audio.mjs --check-register-handoff` — **PASS**:
   all seven fresh renders byte-identical, exact current metadata/register,
   preservation, unchanged cue hashes, mix bound and all current generated review
   artifacts. The 51-second music preview and 91.9-second join/cue reel are current.
2. Read-only `licensed/decode-sources.mjs` logic via stdin — **PASS**. Only the
   in-memory `import.meta.url` was fixed to the actual script location and launch
   added `chromiumSandbox:true`; no `--write`. Approved normal-user execution
   retained Chromium's own sandbox. Original MP3 → selected master and manifest
   reproduced exactly, including the four alignment windows. No audio played.
3. Independent inline Node RIFF/sample/hash/register program — **PASS**: all eight
   acquisition hashes, original library `smpl`, every transformed theme sample,
   seven actual PCM statistics, five old cue hashes, source-score equality,
   non-audio commit comparison and 69-row preservation hash. Read-only .NET ZIP
   entry hashing separately confirmed the extracted MP3/PDF are unmodified.
4. Focused catalogue TypeScript command recorded below, `--noEmit --incremental
   false` — **PASS**. Existing catalogue suite through the same cache-disabled,
   single-worker Vitest API invocation below — **20/20 PASS**.
5. Inspected and reused the current author Chromium decode report: seven final
   WAVs have exact decoded rate/channels/frames; nine audition players are paused,
   non-autoplay and use intended initial gains. Did not rerun the writing browser
   checker. Decode evidence is not listening evidence.

### Current acoustic disposition and limits

The human has heard the comparison and accepted these tracks. Preserve the pair;
there is no pending repeat selection question. The 51-second comparison did not
document full-theme listening, two joins/theme, cue-by-cue observations,
device/player/volume or integrated speech. Those facts must not be invented.

**WP02-03A-SOURCE-LISTENING** remains with the project requester or a
Controller-assigned audio-capable reviewer for the outstanding detailed
observations. At integration, record full-theme suitability, both joins per
theme, each cue alone/over music, clicks/gaps/harshness/relative jumps and
reviewer/date/device/player/volume. WP02-05A owns actual source concurrency,
transitions, speech masking/duck restoration and mute/cancellation controls;
WP06/WP02-12A own published-build listening. The report approves the current
technical handoff without closing those distinct checks.

Only this validation document was updated. No production/shared document,
configuration or ledger was changed; no commit, worker or other-chat message.

## Historical review — rejected synthesis (superseded)

The following record preserves the rejected first delivery and its valid
unchanged-cue evidence. Its theme measurements, totals and acceptance hold refer
to that old snapshot only. Historical path references describe the files at the
time; use the retained [rejected-synthesis archive](../../../assets/source/audio/rejected-synthesis/README.md)
for the old theme sources, WAVs, measurements and handoff. Current disposition is
the licensed-replacement section above.

### Historical verdict

**Old synthesized music: NOT ACCEPTED. Technical checks passed for the reviewed
snapshot only; they do not accept its musical quality or any replacement.**

During review, the human rejected the synthesized music: “Sounds pretty bad :-)
rip the music off from free sources online instead unless you can do better with
what you have?” Controller will replace the themes with properly licensed
existing free music. That explicit instruction supersedes the original-only
composition requirement; runtime format/control and truthful rights/provenance
obligations persist. Soundtrack acceptance is held pending replacement and review.
The reviewer has stopped checking the old files so the producer can revise them.

In the reviewed old snapshot, the two arranged 60–90-second themes, five cues,
reproducible sources, PCM
exports, measured register/catalogue, preservation evidence and concrete audition
artifacts are technically complete. No blocking technical defect was found.
Criterion 3's actual-listening requirement is **outstanding, not passed**.
The perceived gentleness/cohesion, absence of harshness or startling jumps, and
audible cleanliness of loop joins are also unverified aspects of criterion 1.
Numeric checks and decode evidence do not establish those qualities.

The old delivery supplied the alternative handoff allowed by WP02-03A criterion 3 when
no listening route exists. It allows technical handoff to consumers without
pretending that full acoustic or published-game acceptance is complete.

## Inputs and acceptance disposition

Read the complete WP02-03A child and technical handoff, `docs/audio-direction.md`,
actual village/library/effects scores, renderer, audio catalogue, register,
provenance, preservation snapshot, QA/audition generator, measurements and
browser-decode script/report. Retained WP02-01A asset/permission contract and
platform resolver context from the preceding independent art review; checked
DEC-004/019/020. Read the accepted art register at commit `9da250c` to independently
verify the preservation claim rather than relying solely on the author's hashes.

| Child criterion | Disposition |
|---|---|
| 1 — two related arrangements and five cues | Technical inventory/compositional structure PASS. Two distinct 16-bar arrangements share instruments, harmony/motif material and finite variation. Perceived musical quality and absence of harshness remain UNVERIFIED pending listening. |
| 2 — PCM, duration, frames, loop bounds and bytes | PASS. Independently parsed all actual RIFF chunks/PCM and compared catalogue/register/measurements. Both full-period exclusive loop spans are valid. No intentionally inserted seam silence; complete source tails are folded into each period. |
| 3 — actual listening | **Human music approval NOT ACCEPTED.** Human rejected the synthesized music; Controller is routing properly licensed free replacement themes. This reviewer supplied no acoustic assessment. The old audition artifacts satisfy a technical review handoff only. Replacement music requires new provenance/technical checks and actual listening approval. |
| 4 — editable free reproduction and provenance | PASS technically. Fresh same-environment rendering exactly reproduces every runtime byte. Original scores, partials/envelopes and fixed seeds are retained; renderer uses Node built-ins and no external samples/service. All seven confirmed original permission records point to retained provenance. |
| 5 — consumer/integration boundary | PASS as a handoff boundary. Source files/catalogue provide the required interface; WP02-05A owns runtime mixing, speech, mute and concurrency. WP06/WP02-12A own published listening. These checks are not claimed complete here. |

No technical criterion was invalidated by this review. There is no basis to
close the acoustic criterion or erase its release-evidence limitation.

## Independent file and source findings

Exactly seven files exist in `public/assets/audio/`, with no audition, source or
extra soundtrack export. All are format-tag 1 PCM, mono, 44,100 Hz, 88,200-byte/s,
2-byte block alignment and signed 16-bit samples. RIFF and data lengths match
the complete files, and the register/catalogue agree with the measured frames.

| Runtime asset | Frames | Seconds | Bytes | Peak absolute PCM |
|---|---:|---:|---:|---:|
| village-loop | 3,136,000 | 71.111111… | 6,272,044 | 6,973 |
| library-loop | 3,528,000 | 80 | 7,056,044 | 5,095 |
| pickup | 37,485 | 0.85 | 75,014 | 4,584 |
| placement | 35,280 | 0.8 | 70,604 | 3,867 |
| support | 72,765 | 1.65 | 145,574 | 3,216 |
| success | 94,815 | 2.15 | 189,674 | 4,838 |
| restoration | 198,450 | 4.5 | 396,944 | 4,698 |

Audio totals **14,205,898 bytes**; largest file **7,056,044 bytes**. These remain
WP01 sizing inputs, not accepted cache/performance budgets. The two loops contain
6,664,000 mono frames, or **26,656,000 float32 sample bytes at 44.1 kHz**, before
overhead. Runtime inventory must derive from ready register rows, including the
36 accepted art exports; source audition files must remain excluded.

### Arrangement and source structure

Village has 153 events at 54 BPM; library has 102 at 48 BPM. Both use 64 beats,
four beats per bar and four four-bar sections. Independently inspected bar-level
pitch, onset, duration and instrument data; all four sections in each theme are
distinct after normalizing their start times and ignoring seeds. The first
village melodic question is F#4–A4–B4, answered by A4–E4; later bars change the
melodic shape, register and harmonic pacing. Library retains related material
with fewer foreground events, bell-led passages, fewer wooden accents and a
raised lowest sustained voice. The shared pluck/bell/warm/wood instrument
definitions are exactly equal across all three score files.

The five cues are differentiated source sequences: pickup uses two plucked
notes; placement adds wooden contact to lower plucks; support uses a three-note
turn; success uses four overlapping pluck/bell events; restoration has nine
events including sustained support and the shared motif. No lyric/sample track
or dedicated buzzer generator exists. These observations establish authored
structure and intended palette, **not what it sounds like**.

The renderer has a fixed seven-ID output list and validates frames, tempo,
envelopes, note bounds, seeds and finite event tails. It uses literal partials,
raised-cosine note attack/release, deterministic filtered noise and finite
reflection taps. There is no network call, SoundFont, paid synthesis service,
runtime scheduler or playback/preferences implementation. `--check` renders only
in memory and does not call the runtime-writing branch. Same-environment byte
reproduction passes; cross-engine/platform transcendental-math identity is not
asserted.

### Loop, tail and mix bounds

Both loops start at frame 0 and end exclusively at the complete frame count.
Full note releases wrap modulo that count; finite reflections use the dry signal
with circular destination indexing. Source tails actually extend beyond each
nominal period, so folding is doing useful work: the final calculated tail ends
at frame 3,219,579 versus 3,136,000 for village and 3,613,300 versus 3,528,000 for
library. No global seam fade/mute, padding or repeated-media-ended loop is present.

Independent disk measurements reproduce the retained peaks, RMS, DC, maximum
steps, hashes and zero-run results. Village/library wrap steps are **45/36 PCM
units**, versus within-buffer maxima **521/307**. Maximum steps within ±10 ms
of the join are **108/62**. Longest exact-zero runs anywhere in the loops are
only **4/8 frames**. These are numerical continuity observations, not evidence
of heard clean joins or pleasantness.

All five cues begin at zero and have at least 10 ms of zero samples at the end.
Independent event-plus-release-plus-reflection calculations leave respectively
about **57, 92, 167, 207 and 857 ms** of source tail margin. No cue release is
cut by its frame count. All seven disk exports have zero full-scale clipped
samples.

Recomputed conservative sample-domain bounds for two themes plus four copies
of the largest cue are **0.9588623046875** at unity source gains and
**0.387359619140625** at DEC-004's music 0.25/effects 0.50. The stated four-effect
limit and gain assumptions matter. Speech, resampler/intersample overshoot,
device processing and perceived level changes are excluded; actual runtime
headroom and comfort remain integration/listening checks. The producer's cue
gain reduction is a supported numeric correction, not an acoustic correction.

## Register, rights and consumer interfaces

Compared the current register with `git show 9da250c:assets/asset-register.json`.
All **64 non-audio rows**, their ordering, the overall asset-ID order and register
contract are structurally unchanged. That preserves **36 ready M1 art** and
**28 planned M2 art** rows. Only the seven audio rows advance to ready: the current
register has **43 ready / 28 planned** records. The canonical non-audio hash
matches the retained snapshot:
`198263dd17c0d6b00e6e28854cf1e990172ccdf5292bc3c9f5c389113bb07bd1`.

Every audio row links existing editable sources and renderer, exact runtime
path, nonempty author/holder/statement and confirmed original permission evidence
in [PROVENANCE.md](../../../assets/source/audio/PROVENANCE.md). No external sample
or invented CC0/GPL dedication is present in the inspected source chain. This
checks provenance consistency and authorized project-use wording, not copyright
eligibility or exclusivity. Ready status is clearly separated from listening.

`AUDIO_ASSETS` has the exact seven required readonly keys, data-only entries,
base-relative `assets/audio/<id>.wav` paths and exclusive loop frames. It imports
no state/controller implementation. Consumers can use `assetUrl`, convert loop
frames to seconds and derive the same seven paths from the register. Entry/exit
channel fades are correctly reserved to runtime because a steady-state loop
buffer can begin mid-tail. No new preference owner, playback singleton or
divergent runtime inventory was introduced.

## Acoustic handoff review

The retained [audition page](../../../assets/source/audio/audition.html) and
[standalone reel](../../../assets/source/audio/audition.wav) provide a concrete
review route. The reel is **91.9 seconds / 4,052,790 frames / 8,105,624 bytes**.
Its join centres are exactly **6 and 19 seconds** for village and **32 and
45 seconds** for library. Independently compared every sample in ±10 ms around
each centre with the actual runtime last-to-first samples at gain 0.25: all
match, with no fade over the central seam. These are two presentations of the
same seam per theme, as the page explicitly explains.

Independently compared all five complete standalone cue segments with runtime
PCM at gain 0.50; all match. The reel has five additional cue-over-music segments,
and all fourteen documented one-second separators are truly zero. Those are
review-clip separators, not silence inserted into runtime loops. The complete
arrangements are available separately for listening beyond the excerpts.

The local page has eight paused/non-autoplay players, intended initial gains,
one-player-at-a-time handling, pause-all and a concrete findings checklist.
The retained browser checker/report supports native metadata and successful
44.1 kHz mono decoding of all seven WAVs. That author evidence was inspected and
reused; this review did not rerun its writing script or treat decoding as hearing.

**Required outstanding review: WP02-03A-SOURCE-LISTENING. Owner: project requester
as human source-audio reviewer, coordinated by Controller, or a specifically
assigned audio-capable reviewer.** Controller requested source-audio feedback;
the human first selected “Needs changes; I’ll describe them”, then explicitly
rejected the synthesized music and requested existing free-source music unless
better results were possible. Controller chose properly licensed replacement
themes. No listening request was sent by this reviewer; the human's device and
detailed acoustic observations are not known. The old reel is now diagnostic
evidence, not an approval candidate or evidence for the future replacement.

The named reviewer must hear the full themes, both seam presentations per theme,
each cue alone and over music at proposed levels, then record reviewer/date,
device/player/speakers or headphones, volume, item-specific observations and
pass/fail/corrections. Audible clicks/gaps, harshness, fatigue and startling
relative jumps need explicit findings. The explicit human rejection prevents
source approval. Controller should obtain fresh technical/provenance validation
and human listening approval of the replacement. This rejection of music does
not establish separate approval or rejection of the five cues. Speech
intelligibility/duck restoration, simultaneous
sources, maximum-volume behaviour, mute/cancel and published playback still need
WP02-05A and WP06/WP02-12A integrated review afterwards.

## Commands, evidence and limitations

Used existing Node **v24.19.0**, TypeScript **7.0.2** and Vitest **5.0.3**.
No installation, broad build, shared-cache run, audible playback or source edit.

1. `node assets/source/audio/verify-audio.mjs --check-register-handoff` — **PASS**.
   Inspected the flags/write branches first. This mode checks actual headers,
   catalogue/register/provenance, historical preservation, all seven fresh
   in-memory renders and exact current measurements/audition artifacts without
   writing them. Total 14,205,898 bytes; acoustic status remains UNVERIFIED.
2. Independent inline Node program via `node --input-type=module` — **PASS**.
   Parsed RIFF chunks and PCM without renderer measurement helpers; recomputed
   all per-export peaks/RMS/DC/max steps/hashes/zero runs, clipped-sample counts,
   loop windows and mix bounds. Compared exact metadata and source/rights paths.
   Independently compared the prior committed non-audio register and contract.
3. Independent score/reel inline program — **PASS after reviewer-fixture repair**.
   Checked four distinct phrase sections per theme, all finite cue tail margins,
   four seam windows, all five standalone cue segments and fourteen separators.
   The first run used strict equality against JavaScript `Math.round`, which can
   produce negative zero; signed-integer PCM stores zero. The comparison failed
   on `0` versus `-0`, before completion. Normalizing expected integer zero and
   rerunning the entire probe passed. No source/export defect or change resulted.
4. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false
   --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution
   Bundler --types node src/audio/catalogue.ts` — **PASS**, exit 0.
5. Existing catalogue suite through `startVitest('test',
   ['tests/experience/catalogue.test.ts'], {run:true, config:false, cache:false,
   maxWorkers:1, fileParallelism:false}, {configFile:false,
   define:{__BUILD_ID__:JSON.stringify('local-unit-tests')},
   cacheDir:process.env.TEMP+'/wp02-03a-validation-vitest'})`, then `ctx.close()`
   — **PASS, 1 file / 20 tests**. No broad regression or shared cache.

Reviewed identity anchors (SHA-256):

| File | Hash |
|---|---|
| `tools/render-audio.mjs` | `4d22dba523e9446246a8739304ea1170cd3f038e83e9e5ed6f065a8c08ede077` |
| `assets/source/audio/village.json` | `da1dbfe3ec7f015fb09642ba6ccb1d434ba6af8c97389205d7aea4e86574f1b1` |
| `assets/source/audio/library.json` | `5254cc0cbcbbc42110db63406813defcb3c8c9676d7df24fae7823831d43ba65` |
| `assets/source/audio/effects.json` | `5285a50d83d6982707a8cd0ccf528d20a0219e55ce2f19418e68545f0eddecd5` |
| `src/audio/catalogue.ts` | `4da79f524fbcbfc838d5688867f7fadbe58ad0a4640a2600f092af5bfdfa7d8a` |
| `assets/asset-register.json` | `1840bd333720c125c210dc29f01317ee7bc87579cf97659f1c19bfb75ed22645` |
| `assets/source/audio/measurements.json` | `0fceea6fbb10f8b2483afec49640b86a2b409d482a291e4869b8da88707e4acd` |
| `assets/source/audio/audition.wav` | `8b9220a6ed4ddec36a1da9cfc73d892c1d2e89d517f80538e2d8192ba0e130f1` |

The exact seven export hashes are retained in
[measurements.json](../../../assets/source/audio/measurements.json) and were
independently matched to disk. No acoustic assessment route was exposed to this
reviewer, no listening occurred in this technical review, and no
audibility/pleasantness/clean-join conclusion is
inferred. No branded D1–T2, physical-device, child, speech, offline or published
acceptance is supplied by this source review.

Only this report was added for the WP02-03A review. No commits, workers,
other-chat messages or shared ledger changes were made.
