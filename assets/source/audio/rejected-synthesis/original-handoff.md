# WP02-03A — Original music and effects technical handoff

9 October 2026. Technical source production is complete for independent review.
**Acoustic acceptance remains UNVERIFIED.** This is not full audible-quality or
published-game acceptance. Controller retains administrative acceptance and Git
ownership. This worker made no commit, created no workers, sent no other-chat
messages and changed no shared configuration, dependency, state, UI or controller.

DEP-036 was accepted in the assignment. Source composition/rendering began
disjointly from art. Controller explicitly released DEP-037 after WP02-02A was
independently accepted and committed; only then were the seven audio register
rows changed. All 36 ready art and 28 planned M2 records, their ordering and the
register contract remained semantically byte-identical under canonical JSON
serialization. [Preservation hashes](../../../assets/source/audio/register-preservation.json)
retain that before/after evidence. Whole-file indentation remains two spaces;
ordinary checkout line-ending conversion may affect textual file bytes.

## Delivery

- [Audio direction](../../audio-direction.md): original sonic reference, score
  form, rendering/mix contract, numeric results and listening instructions.
- [Editable source tree](../../../assets/source/audio/): village.json,
  library.json and effects.json; original permission/provenance; source QA and
  browser decode scripts/reports; local audition page and derived PCM reel.
- [Offline renderer](../../../tools/render-audio.mjs): Node built-ins only;
  writes exactly the seven named WAVs. `--check` is read-only and compares an
  in-memory render to the exports. Fixed note data, envelopes and noise seeds;
  no runtime synthesis or external samples.
- [Readonly AUDIO_ASSETS](../../../src/audio/catalogue.ts): exact keys village,
  library, pickup, placement, support, success and restoration, with base-relative
  paths, kind/rate/frames/bytes and exclusive loop endpoints. No state/controller
  imports. Consumers apply WP01 `assetUrl`.
- [Asset register](../../../assets/asset-register.json): only the seven audio
  entries advanced to ready with measured metadata and explicit original
  project-use permission. Ready means produced source/export, not listened-to.

| Runtime file under public/assets/audio/ | Frame count | Seconds | Bytes |
|---|---:|---:|---:|
| village-loop.wav | 3,136,000 | 71.111111… | 6,272,044 |
| library-loop.wav | 3,528,000 | 80 | 7,056,044 |
| pickup.wav | 37,485 | 0.85 | 75,014 |
| placement.wav | 35,280 | 0.8 | 70,604 |
| support.wav | 72,765 | 1.65 | 145,574 |
| success.wav | 94,815 | 2.15 | 189,674 |
| restoration.wav | 198,450 | 4.5 | 396,944 |

All seven are mono 44,100 Hz, 16-bit PCM. Loops start at frame 0 and end at their
exclusive frame counts. Village is 16 bars at 54 BPM (153 events); library is
16 bars at 48 BPM (102 events). Four authored phrase sections vary melody,
register, harmony, accompaniment and space while preserving a common motif and
palette. Restoration doubles as welcome. No extra runtime soundtrack file.

**WP01 sizing input: largest file 7,056,044 bytes; audio total 14,205,898 bytes.**
Derive required paths from the ready register, not this evidence table or the
source audition assets. The two decoded float32 loops at 44.1 kHz total
26,656,000 sample bytes before overhead. Cache/device budgets remain unaccepted;
lazy decode/current-plus-incoming/release policy remains with consumers.

## Checks actually performed

Existing Node v24.19.0 and Chromium 156.0.8078.4 were used. No installation,
account, paid dependency or trial was required.

1. `node tools/render-audio.mjs` produced exactly seven WAVs. The renderer rejects
   unknown IDs, invalid envelopes/frames, out-of-period events, aliasing partials,
   cut effect tails and insufficient source headroom.
2. `node assets/source/audio/verify-audio.mjs --write-evidence` independently read
   actual RIFF/PCM headers, exact lengths, channels/rate/bits/frames, first/final
   cue samples, loop bounds and catalogue/register/source provenance links. It
   calls a fresh seven-file in-memory render and compares every exported byte.
3. `node assets/source/audio/verify-audio.mjs --check-register-handoff` passed
   again against final sources, PCM and review artifacts, also confirming the
   historical non-audio record/schema snapshot. Omit that optional historical
   snapshot flag after later authorized asset writers advance their records.
4. `node assets/source/audio/check-browser.mjs` passed: eight paused, non-autoplay
   audition players with intended initial gains; native metadata for the review
   reel; exact frames/rate/mono channels for all seven real WAVs decoded through
   AudioContext.decodeAudioData at 44.1 kHz. No source was played audibly and no
   listening assessment occurred. [Retained report](../../../assets/source/audio/browser-decode.json).
5. Focused TypeScript, no cache/output: `node node_modules/typescript/bin/tsc
   --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target
   ES2022 --module ESNext --moduleResolution Bundler --types node
   src/audio/catalogue.ts` passed.
6. `node node_modules/vitest/vitest.mjs run tests/experience/catalogue.test.ts`
   passed all 20 tests, including the ready register lifecycle and exact file
   metadata. No broad application regression or published journey was claimed.
7. Scoped diff/whitespace inspection passed; unrelated concurrent production
   files were preserved.

The first browser probe used the non-declared bare `playwright` import and
failed before exercising audio (`ERR_MODULE_NOT_FOUND`). This was a tooling
entry-point error. It was corrected to the existing declared `@playwright/test`
in the retained checker; the subsequent browser check passed. No dependency or
production behavior was changed to accommodate the probe.

[measurements.json](../../../assets/source/audio/measurements.json) retains
exact lowercase SHA-256 per export, bytes/frames, peaks/RMS/DC and join results.
Reproduction was checked in this pinned Node/Windows environment; bit identity
across other JavaScript math implementations is not asserted.

## Numeric source corrections and result

Cue master gain was reduced from 0.85 to 0.60 after a worst-case concurrent
source-sum calculation exposed inadequate full-gain mix headroom. The final
seven-file render, exact reproduction, independent PCM checks, audition reel
and browser decode were all rerun after that change. No acoustic correction is
claimed. Final individual peaks range from −20.16 to −13.44 dBFS; no PCM sample
clips. Conservative sum of both theme peaks plus four copies of the loudest cue
is **0.9588623** at unity gains and **0.3873596** at default music 25%/effects 50%.
This bound excludes speech and resampler/device processing, and assumes at most
four effects. Runtime integration still owns gain control and listening.

Loop wrap steps are 45/36 PCM units for village/library, below within-buffer
maximum steps 521/307; ±10 ms join windows are nonzero. Full note releases and
finite reflection tails are folded into each loop, without inserted join silence
or seam muting. These measurements show technical continuity, not heard quality.

## Required acoustic handoff: WP02-03A-SOURCE-LISTENING

**Owner: project requester as human source-audio reviewer, coordinated by
Controller**, or a named Controller-assigned reviewer with a real listening
route. No actual reviewer/date/device/observations are available yet. The exposed
tools provide media generation/display and browser data; none provides acoustic
listening or a browser-loopback assessment in this session. No physical-device,
child-testing, acoustic comfort or seamlessness claim is made.

Concrete ready-to-use artifacts:

- [Local audition page](../../../assets/source/audio/audition.html), which opens
  directly from disk: pre-mixed reel plus full tracks/cues, timeline and pause-all.
- [Standalone 91.90-second audition WAV](../../../assets/source/audio/audition.wav):
  village joins at 6/19 s, library joins at 32/45 s, all cues alone from 52 s and
  every cue over music from 66.95 s. Music 25%/effects 50% are baked into the reel.

Review the complete arrangements as well as both join presentations per theme
and every cue at the proposed levels. Record device/browser/player and comfortable
device volume, exact observations per item, clicks/gaps/harshness/startling jumps,
pass/fail and corrections. Return findings to Controller/source author. No text,
peak, metadata, decode-success or callback result can satisfy this listening gate.

WP02-05A then owns actual speech masking, duck/restoration, source concurrency,
mute/cancel/asynchronous-load guards and controls; WP06/WP02-12A own listening
to the actual published build. This source handoff need not wait for their runtime
implementation, but the unresolved acoustic criterion must remain in release evidence.

## Acceptance disposition and integration boundary

| Criterion | Disposition |
|---|---|
| 1 — two related arrangements/five cues | Delivered technically, with authored phrase form/variation/space. Perceived musical quality awaits listening. |
| 2 — PCM/frames/loop metadata/bytes | Verified against disk, fresh render, catalogue/register and Chromium decode. |
| 3 — actual listening | UNVERIFIED; permitted unsupported-listening handoff supplied above. No pass claimed. |
| 4 — reproducible free originals/provenance | Verified source reproduction; explicit original authorized-use record, no external samples or arbitrary relicensing. |
| 5 — downstream playback/speech/mute/published checks | Reserved to WP02-05A and WP06/WP02-12A; source uncertainty retained. |

Additional bounded reads were limited to implemented AssetRecord/permission,
asset register/lifecycle test handoff, art provenance for consistent commissioned
AI-output wording, and platform resolver/build/test entry points needed for
compatible paths and focused checks. No contract or scope change was needed.
Controller may now independently validate this source delivery and administratively
transfer the register to WP02-08A after the appropriate M1 acceptance. This worker
has finished register writes and does not claim to authorize that next transfer.
