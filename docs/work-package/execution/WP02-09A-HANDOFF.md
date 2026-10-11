# WP02-09A implementation handoff — 11 October 2026

Candidate delivered for independent review; administrative acceptance/integration
remain Controller-owned. Baseline is exactly
`6b5834953b56b4f2ce33c099700b1090805b6144`, including current GLOBAL_RULES and
CONTINUATION-AND-MUSIC-VARIATION. DEP-085 is accepted. Human scheduling authority
permits construction before final detailed listening; no M1 acoustic PASS is implied.

**Current revision: F1 producer repair.** The independent review rejected the
initial rotation-order classification below. This revision corrects the shared
pointer adapter; the appended F1 section owns current repair evidence and limits.
Initial frozen payload and failed traces remain in private/frozen-before-F1 and
private/F1. No independent recheck PASS is claimed by this author.

## Isolation and frozen delivery

Managed creation was attempted once after list_artifacts returned no worktree.
The app rejected creation because Git ownership differs between its user and the
sandbox owner. No global safe.directory/security change or retry loop was made.
Authorized fallback: git archive of the fixed commit into this private candidate:

`C:/Users/alexb/AppData/Local/Temp/lif-WP02-09A-4cf69d487f5c4221908e571bd901145c/`

The main checkout was a read-only source for the archive, frozen-contract reads
and installed dependencies. A candidate node_modules junction reads existing
packages. No dependency installation or shared configuration mutation occurred.
Vite uses configLoader:runner and candidate/private/vite-cache. Vitest uses a
private config/cacheDir with both caches disabled; tsc uses noEmit and
incremental:false, never the shared tsBuildInfoFile. Browser runners use one
worker/no retries, fresh contexts and port **5211**. Initial Playwright calls used
its ordinary OS-temp transform cache; the retained reproducible launcher now
pins PWTEST_CACHE_DIR and all browser temp paths inside candidate/private.
No shared dependency cache was deliberately written or cleared. This tooling
detail and all failed attempts remain in private/attempts.md.

Frozen review payload, relative to candidate:

- `private/WP02-09A.patch`: the nine original assigned paths plus pointer.ts,
  explicitly released by Controller for the causally required F1 correction.
- `private/frozen-manifest.json`: baseline, exact candidate path, byte counts and
  SHA-256 hashes for every assigned file and the patch. The handoff hash is in
  this separate manifest to avoid self-reference.
- `private/freeze.mjs`: ordinary deterministic export utility, using exact owned
  entries extracted from baseline.zip and no-index diff. It performs no commit
  or main write. Archive-byte comparison checks all other baseline files.

For an exact byte replay, use `git -c core.autocrlf=false apply` (and the same
prefix for `apply --check`) or copy the frozen files directly. This invocation-only
setting preserves the existing files' CRLF and new files' LF; normal Git settings
otherwise convert the added files during application. No persistent Git change.

Only the nine assigned implementation/test files and this handoff differ from
the archived baseline. Other candidate source/config/docs are unchanged.
Private scripts/results are evidence, excluded from the production
patch. No commits, merge, push, deployment, delegation or other-chat messages.
OS temporary cleanup may eventually remove the candidate; Controller should
preserve the payload during independent review/integration.

## Delivered contract and causal boundaries

`ActivityWidgetProps` retains `{responseSpec,draft,disabled,onAction}` and now
consumes the producer ResponseSpec directly. Existing M1ResponseSpec remains
exported for unchanged M1 callers. createDraft/reduceDraft/toResponse support
all nine response discriminants while retaining six interaction mechanics.
No copied DTO, answer rule, evaluator, score, Check, reward, storage or audio port
is added. Empty/partial responses remain editable and unscored. Saved structural
mismatches throw instead of being discarded.

MatchingBoard and SortBoard reuse one item/destination view with native labelled
selection/place/remove controls and existing bindPointerDrag. Matching atomically
replaces the source endpoint and clears any prior source occupying the same
target when the producer declares uniqueTargets. Sorting moves the selected
item alone between groups or back to unassigned. Remove returns focus to the
item handle before disabling its remove control.

SequenceList starts with every declared tile exactly once in authored order.
IDs survive move-before/after, adjacent Earlier/Later and undo; no item is created
or removed and labels/pixels never become identities. Adjacent moves return focus
to the stable handle before a boundary button becomes disabled. Selection/cancel
is transient and not undoable; response edits share the existing last-64 undo
history. Bridge session ordinals retain their previous behavior.

ChoiceTiles also consumes choice slots, showing authored labels rather than
opaque IDs. Its punctuation path retains actual mark glyphs and M1 commands.
QuantityControl retains merchant controls and adds quantity/clock variants.
Quantity numerator buttons preserve exact numerator, declared denominator and
unit; no simplification/conversion is performed for exact or equivalent forms.
±1 and bounded ±10/±100 controls cover larger integer pence/hundredths without
typing; native denominator/unit buttons retain the declared sets. Clear is null,
explicit zero is zero. Fixture examples include 2/4 whole, 111 integer pence and
125/100 metre, with declared forms untouched.

Clock controls provide hour, five-minute and ±1-minute buttons, earliest-time,
clear and undo. Hour/minute hand handles reuse the existing capture/cancel
binding and resolve current dial geometry to integer minute target IDs. This
is geometric input adaptation, never scoring. Moving the minute hand preserves
the hour; moving the hour hand preserves minutes and the current AM/PM half.
The labelled 24-hour controls supply that period explicitly. Response is exactly
`{kind:'clock',minutes:number|null}` and respects authored minuteBounds.

`TaskStimulus({stimulus:TaskDefinition['stimulus']})` imports the frozen union.
Absent/null returns nothing. Array rows keep the supplied groups/counts; fraction
bars keep equal wholes and every declared partition, without reduction. Clock
face and authored notation remain independent; analogue text is exactly supplied
hand/context data, with no computed time answer. Digital display formats the
supplied time/notation. Diagram uses a square viewBox and equal x/y scaling,
retains every supplied edge ID/label and draws only those edges, including closed
boundaries. Data preserves authored row order and zero-origin supplied tick step;
bar/line numbered positions map directly to the labelled source-value table.
Tables, captions and alternatives are live escaped plain text. No extra total,
comparison, shape answer or hidden answer choice is inferred. Structural metadata
needed to render is checked and invalid/unsupported forms throw producer-contract
errors instead of an empty card or learner wrongness.

No new library, global style, world composition, catalogue, asset-register,
domain, content or shared host edit. Existing M1 assets remain read-only. Real
bank/stimulus/task/evaluator composition remains WP03-13A → WP02-10A.

## Criteria and bounded evidence

| Criterion | Actual evidence |
|---|---|
| 1/5 — three equivalent new mechanics | Pointer, native taps/clicks and native keyboard Enter produce identical IDs on all three tested engines; replacement, both sequence directions, category moves, remove and undo covered. |
| 2/6 — cancel/rotate/focus | Each new mechanic retains a completed edit during explicit cancel, active-drag Escape and viewport swap; source controls accept Space, dialog Escape returns focus. Remove/adjacent-move focus returns verified. Clock resize cancellation and PM hour-hand variant also pass. |
| 3/6 — retained M1 | Three routes for bridge/punctuation/merchant pass on every engine; repeated pieces, exact null/zero, edit/undo/remove and proportional timber geometry remain green. No redundant full published adventure test. |
| 4 — comfortable/reflow | Ordinary wheel scroll, dialog focus and all widgets at 200% root text/768×1024 pass in all engines. Additional filled-board Chromium measurements: seven boards, 139 visible buttons, all ≥44×44px, 36px body, no overlapping controls or horizontal overflow. |
| 7 — exact forms/stimuli | Numerator/denominator/unit responses include integer quantity, unreduced 2/4, 111 pence and 125/100; clock drag/native controls agree at 195 minutes, single-minute edit196, PM hour edit740. All five source variants plus digital/analogue and table/bar/line cases retain actual quantities/labels/edges/scale/order and supplied alternatives. Malformed/absent/escaped-source checks pass. |

Route checkpoints are the same for each pointer/tap/keyboard route:

| Mechanic | Complete response | Revisions and cancellation |
|---|---|---|
| Matching | `{oak:east,ash:west}` | Ash→east clears oak; undo restores both; remove oak→null; undo restores. Escape/rotation preserve a completed oak→east. |
| Sequence | `[dawn,noon,dusk]` initially | Dusk before dawn→`[dusk,dawn,noon]`; after noon→initial; undo; Later/Earlier preserve all IDs. Escape/rotation preserve moved order. |
| Sorting | `{circle:first,square:first}` | Circle→second; undo; remove→null; undo. Escape/rotation preserve completed category assignment. |

Pointer is real native mouse Pointer Events/capture on all three engines. Tap
means Playwright native touchscreen tap in Chromium/WebKit and ordinary click
in desktop Edge. Keyboard uses native focus/Enter/Space and retained Tab traversal
evidence. Fixtures are schema-conformant contract probes, not reviewed expansion
questions. The displayed strings deliberately carry no correct-answer inference.

## Actual checks and reproduction

Bundled runtime: `C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
Run from candidate cwd; private server is `node private/vite-server.mjs`.

- `node node_modules/vitest/vitest.mjs run --config private/unit.config.mjs --configLoader runner --cache false --fsModuleCache false`: **42/42 passed**. Includes retained 18 M1/geometry/owner checks, 15 new semantic checks and nine source/absence/failure/plain-text cases.
- Focused app/fixture/consumer check, no cache: **PASS**. CLI:
  `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --jsx react-jsx --types node,vite/client src/vite-env.d.ts src/interaction/draft.ts src/interaction/pointer.ts src/interaction/ActivityWidgets.tsx src/interaction/TaskStimulus.tsx tests/fixtures/interaction.tsx tests/interaction/draft.test.ts src/experience/QuestActivity.tsx`.
- Independent Node-only spec check: **PASS**.
  `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2023 --lib ES2023 --module ESNext --moduleResolution Bundler --types node tests/browser/interaction.spec.ts`.
- Original failed clock/source full-flow rerun: **2/2 passed**, retained in
  `private/browser-original-retest`; see diagnostic details below.
- Final focused browser set: **81/81 passed**, no skips/retries, one worker:
  `node node_modules/@playwright/test/cli.js test --config private/playwright.config.mjs --grep 'M2 |bridge create|punctuation create|basket create|ordinary scroll|bridge timber' --output private/browser-focused-final-1`.
- Final ±10/±100 quantity refinement: **9/9 affected checks passed** after the 81-case run:
  same CLI/config with `--grep 'M2 bounded|ordinary scroll' --output private/quantity-reflow-final`.
  Other mechanics/representations/reducer unchanged after their green checks.
- `node private/visual-review.mjs`: filled 200% measurements **PASS**, zero page
  errors; retains metrics and normal/enlarged per-widget screenshots.
- Frozen-patch application/whitespace and unchanged baseline checks are retained
  in `private/freeze-verification.json`.

For a reproduction with all Playwright generated cache/profile paths pinned in
the candidate, use `node private/playwright-run.mjs test` with the same config,
grep and a new private output path. It is a thin launcher, not a copied runner.

| Tested local engine | Actual running version | Viewport |
|---|---|---|
| Chromium touch | 156.0.8078.4 | 1024×768 + swapped/768×1024 portrait |
| Edge | 155.0.4283.45 | 1920×1080 + swapped/768×1024 portrait |
| WebKit touch | 27.2 | 768×1024 + swapped/portrait |

Normal matching and 200% sequence/quantity/diagram/chart screenshots were
visually inspected: readable controls, ordered panels, equal geometry, source
labels/tables and text alternatives, wrapping without clipping. The tall quantity
capture is retained at full resolution; the viewing tool resized its presentation.
Additional sorting/clock/choice and whole-page per-engine captures remain in
private evidence for the reviewer. No root build, dependency install or publish.

## Diagnostic trace and retained attempts

This section retains initial-attempt facts. Its classification of the immediate
release failure as only test-driver ordering is withdrawn by the F1 repair below.
The synchronized test remains useful for the resize-before-release order; it does
not replace the now-required unsynchronized original sequence.

Read the original WP02-04A handoff/validation, frozen WP03-01A/DEC-029 contracts
and current authority before editing. No missing frozen contract was found.

Initial type-only failures were in nullable restoration narrowing and heterogeneous
test-array inference. Fixed their local typings; no downstream runtime workaround.
Initial browser attempt had **34 passed / 2 failed**. A grep also matched the private
project prefix, so it included the existing 20 M1 cases once; later runner names
and exact selections avoid that. Both traces remain in browser-attempt-1.

The source failure was a strict single-locator assertion on four tick elements;
replaced it with the exact ordered tick array. Actual representation was already
correct. Clock failure invoked Logic-Flow Diagnosis once. Original expectation
was preserve195 during rotation; actual output190. Private native event capture:

| Ordered checkpoint | Actual value | Diagnosis |
|---|---|---|
| Before viewport command | response195; active capture/ghost | Correct completed draft and pending gesture. |
| Pointerup after setViewportSize | width768; pointerup422.8ms; response190 | Test released the drag before its required resize cancellation. New dial geometry gave a permitted rounded10-minute hand drop. |
| Native resize | resize424.3ms; drag already completed | Correct event handler could not cancel an earlier completed release. Earliest violated contract was test-driver ordering. |

`private/clock-event-trace.json` preserves full native coordinates/actions/state.
Test now awaits resize-driven ghost removal before release, consistent with the
retained M1 cancellation ordering. No production pointer/reducer workaround was
introduced. Complete original minute/drop/undo/native-control/rotation flow went
green, then the fresh 16:20→12:20 PM hour-hand variant, all related new-mechanic
cases and complete relevant focused set went green. A failed standalone helper
import was corrected to the exposed pnpm @playwright/test re-export; it had not
launched a browser. All attempts remain separate, never overwritten.

## Integration limits

WP02-10A must dispatch MatchingBoard/SequenceList/SortBoard, pass producer
ResponseSpec directly, render TaskStimulus beside authored prompts, and bind real
approved WP03-13A data. This slice does not change the current M1-only activity
adapter/world composer or claim evaluated quest truth, durable restore/reward
acceptance, full six-mechanic release, published play, child/physical-device use,
or acoustic quality. Current branded Chrome capability evidence is available;
this scoped runner exercised Chromium, Edge and WebKit, without relabelling
Chromium as Chrome or repeating Firefox infrastructure. Final listening remains
explicitly outstanding under the human authorization. Independent review and
Controller integration/acceptance are pending. Private port5211 server is stopped
after verification; no worker runtime is left running.

## F1/P2 correction — 11 October 2026

Read the independent main-checkout WP02-09A-VALIDATION report and exact native
scripts/event traces in the reviewer's private root
`C:/Users/alexb/AppData/Local/Temp/lif-WP02-09A-validator-f75fa740c6e14c7ebd72aaf8d98d0bd6/`.
The existing diagnostic loop continues without a skill/protocol reload or
delegation. Controller explicitly permits pointer.ts if causal evidence requires
it; the report and actual reproduction establish that requirement.

### Reproduction, cause and correction

Copied the reviewer's native runner into candidate/private/F1, changing only its
private server URL from5213 to this author's5211. Its CASE_FILTER selected the
original complete sequence: native controls set195 → captured minute-hand drag
→ viewport1024×768 becomes768×1024 → immediate native pointer release, with no
ghost/resize synchronization → settled response. **Before correction: six of six
became190**, exit1, zero page errors. Preserved original-before-fix.json,
clock-rotation-before.json and the failed screenshot. This matches the six
reviewer failures and the valid earlier author trace.

| Earliest causal checkpoint | Before | Corrected contract |
|---|---|---|
| Native control completion |195 |195 |
| Gesture starts | No recorded viewport eligibility | Records innerWidth, innerHeight and available screen orientation angle |
| Release, before queued resize callback | Changed768×1024; pending gesture incorrectly remains eligible | Compares current viewport to gesture start; cancels before asking for a target or emitting place |
| Resolver/reducer | New rectangle legitimately maps190; reducer accepts integer edit | Neither is invoked for a rotated pending drop; prior completed195 remains |
| Later resize event | Too late to prevent edit | Existing event cancellation stays valid for the opposite order |

Changed **pointer.ts**, the new immediate-release browser regression and this
handoff only in the production review payload. A gesture's layout dimensions and
orientation are captured at pointerdown. Both move and up cancel when that stamp
changes, including release before resize delivery. The guard clears transient
ghost/selection and suppresses the cancelled gesture's compatibility click; it
does not create a response/history edit. Existing Escape, capture-loss,
pointercancel, resize/orientation event, blur and disposal cancellation remain.
Scroll offsets are excluded from the stamp, so ordinary scrolling/layout motion
still resolves current target rectangles. No stale target geometry, answer
restoration, reducer compensation, timer or delayed release is introduced.

**Original complete native sequence after correction: six of six retain195,
exit0, zero page errors.** All six retained after-traces still observe pointerup
before resize at the changed viewport. First example: pointerup447.0ms and
resize455.4ms; final response195. The producer now handles the excluded event
order rather than making the test wait for the callback.

The permanent browser case repeats the unsynchronized original six times per
engine, asserts no place command, verifies Undo returns180 (no phantom history),
then exercises an invalid center drop and a fresh valid portrait drop195/Undo180.
The old resize-before-release case stays, alongside the PM hour-hand fresh case.
The copied reviewer555-minute normal drop/control/Undo/resize-before-release
variant independently reran **PASS**, exit0.

### Separate touch-to-dialog probe

The original combined probe is **still FAIL before and after F1**. Do not call
it passed or certify its first-tap focus flow. Instrumented capture logs show
the post-rotation native tap sends pointerdown/up and touchstart/end to “How to
move pieces”, with no click event and dialog open:false. F1 does not alter its
outcome. Retained focus-before-fix.json and focus-after-F1.json/screenshot include
the failed complete probe and zero page errors.

Localized the missing click outside application code with a fresh plain page:
one static touch-action:none button, one ordinary button whose only click
handler opens a native dialog, no React, widget, pointer adapter, cancellation
logic, preventDefault call or production import. Native touch-start/move →
viewport resize → touch-end → first target tap likewise produces no click/open;
second native tap emits click and opens. Clean tap and touchCancel-only both
open on the first tap. This occurs both when the final tap uses Playwright's
touch API and when every touch uses the same CDP session; no mixed-API cause is
assumed. Exact events/results are in plain-native-tap-results.json and
plain-native-tap-results-cdp.json; helper source is plain-native-tap-probe.mjs.

Inference bounded to this observed Chromium/native automated viewport sequence:
the absent native click is reproducible without any application listener and
is not a second localized widget source defect. The exact first-tap probe remains
an environment/input limitation for independent adjudication. No pointerup
activation workaround is added to normal native buttons. A diagnostic second-tap
variant emits native clicks and verifies dialog opening/Escape focus return on
matching, sequence and sorting; its explicitly labelled result is separate from
the failed original and does not turn that original into PASS. No physical-device
or cross-engine explanation is inferred from this control experiment.

### Correction checks and frozen review boundary

Unchanged quantity/source renderer acceptance retains the previous valid42/81/9
and independent evidence;
neither quantity buttons nor source renderers changed in this repair. Shared
pointer changes invalidate the affected input/cancellation paths, so their full
scoped local regression set is rerun. No domain/full-game/main build is run.

- Original exact native195 immediate release: **6/6 FAIL before → 6/6 PASS after**,
  including the pointerup-before-resize order. Both results/traces retained.
- Fresh related native555 control/drop/undo/resize-before-release: **PASS**.
- Corrected shared-pointer local suite: **100 passed, 2 CDP-only skips**, 3.2m,
  one worker/no retries, Chromium156.0.8078.4, Edge155.0.4283.45, WebKit27.2.
  The immediate-release regression has six original repetitions per engine,
  followed by no-place/undo/invalid-drop/fresh-valid-drop checks. All M1/M2
  pointer/tap/keyboard, cancel/disposal/current-rectangle scroll/second-pointer,
  focus and portrait/timber cases affected by the adapter pass. The two existing
  native-CDP-only skips are Edge/WebKit, not failed or newly omitted cases.
- **42/42** scoped unit tests reran green with disabled/private caches.
- Focused app/fixture/consumer and Node-only spec checks reran **PASS** with
  the earlier exact noEmit/incremental:false CLI forms; no shared buildinfo.
- Original combined touch-to-dialog first-tap probe: **FAIL** before and after
  F1, with zero page errors. Plain zero-product-code native controls reproduce
  the absent click for both same-CDP and mixed touch delivery. The diagnostic
  second-tap variant's successful opening/focus return is separately labelled,
  never substituted for that original failure.
- Exact patch check/application, whitespace and ten-file byte-hash replay:
  **PASS**, in `private/freeze-verification.json`; other archived files unchanged.

Actual adapter-suite invocation from candidate cwd with bundled Node:
`node private/playwright-run.mjs test --config private/playwright.config.mjs --grep-invert 'M2 bounded|M2 read-only' --output private/F1/pointer-regressions-final`.
Excludes unchanged quantity/source cases rather than repeating their accepted
checks. The copied reviewer runner supports CASE_FILTER/RESULT_NAME; original
commands select `clock real viewport rotation` and separate before/after result
names. Failed clock and dialog results remain frozen in private/F1. Generated
browser caches/profiles/reports all use candidate/private paths.

Read/hash comparison with the pre-review manifest confirms only pointer.ts,
interaction.spec.ts and this handoff changed in the repair. No widgets, draft,
stimuli, CSS, other tests/fixtures, contracts or external assets were changed.

Updated payload has **ten exact files**, including pointer.ts. Current full
manifest/patch supersede the initial nine-file payload; initial hashes/patch stay
in private/frozen-before-F1. Independent reviewer recheck and Controller acceptance
remain pending. This repair claims no complete focus certification from the
failed combined probe, no published/game/state/evaluator acceptance, and no
acoustic PASS.
