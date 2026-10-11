# WP02-09A independent frozen-candidate validation — 11 October 2026

**Current verdict: PASS — F1/P2 closed after independent correction recheck.**
The original unsynchronized rotation/release flow now preserves the completed
195-minute clock response in **6/6 fresh native runs**, including release before
the resize callback. No confirmed widget source finding remains. Undo, subsequent
portrait drops, the opposite event order and scrolling with current rectangles
also pass. Unaffected earlier checks remain valid.

The original combined touch-to-dialog first-tap probe remains **FAIL**. A fresh
plain-button control reproduces its missing native click without application
code; this is a bounded browser/input evidence limitation, not a second localized
widget defect. Complete first-tap focus, physical-device, full-game and acoustic
acceptance are not claimed. Controller owns administrative acceptance,
integration and commits. Initial failed evidence is retained below.

## Authority and exact reviewed payload

Read current [GLOBAL_RULES](../GLOBAL_RULES.md),
[CONTINUATION-AND-MUSIC-VARIATION](CONTINUATION-AND-MUSIC-VARIATION.md),
[WP02-09A](../chunks/WP02-09A.md), accepted WP02-04A evidence, the frozen
WP03-01A response/stimulus definitions and the candidate handoff. The human's
scheduling amendment permits this M2 construction; detailed acoustic acceptance
remains deferred and is not a widget gate or a claimed PASS.

Frozen candidate:
`C:/Users/alexb/AppData/Local/Temp/lif-WP02-09A-4cf69d487f5c4221908e571bd901145c/`.
Base: `6b5834953b56b4f2ce33c099700b1090805b6144`.

**Current corrected patch:** `private/WP02-09A.patch`, **115715 bytes**, SHA-256
`b60ede3033cc0a9f499d542672c26851d8cbb6218c6754ead2fcb24923514a00`.
Fresh initial and final correction checks match **10/10** frozen file byte
counts/hashes and the patch identity. The reviewer also read/hash-compared all
ten files against the retained exact replay in `private/F1/patch-replay-final`:
**10/10 match**. Inspected patch boundaries and the actual correction delta.
The current payload adds the explicitly Controller-authorized pointer repair
to the original eight implementation/test files and handoff. It introduces no
DTO, evaluator, content, state, asset, dependency or root-config mutation.

Only `src/interaction/pointer.ts`, `tests/browser/interaction.spec.ts` and the
handoff changed since the initial review. The other seven owned entries match
the original manifest byte-for-byte. Current changed-entry identities:

| Path | Bytes | SHA-256 |
|---|---:|---|
| `src/interaction/pointer.ts` |5908| `d9e937eff4e210dd0dd0cab011631f8a8a8e8c14273ca5394afd45622433ede0` |
| `tests/browser/interaction.spec.ts` |42915| `b39df448dd2908295ebe413ca059920c71348e5b8cbda3e03cff47b85bf48312` |
| `docs/work-package/execution/WP02-09A-HANDOFF.md` |25218| `1e1e4674539a3ac56cfb7350704738569a52a6ba30ea2cc8b15008c30f104df4` |

**Historical initial patch:** 100538 bytes, SHA-256
`cd2caf939f5c65a4a1e5334daf0b962327f2f72acfdf006e03fd4b47da916147`.
All nine original file identities matched at the initial freeze. That payload,
manifest and handoff remain in `private/frozen-before-F1`; they are superseded
for integration by the ten-file correction.

Reused the retained exact patch check/application/whitespace and archive
comparison evidence in `private/freeze-verification.json`; this reviewer did
not apply a patch or write the candidate. Fresh final read/hash comparisons
against `baseline.zip` show `src/learning/contracts.ts`,
`src/platform/assets.ts` and `vite.config.ts` remain byte-identical to the archive.
The initial pointer snapshot was also archive-identical, SHA-256
`06335292acbba590076f3274a1567e4b9b5015394a8149b8a9d192a9448aa8c4`;
the current pointer change is the authorized causal correction.

The existing validation protocol remains in effect; no machinery was reloaded
for the inner checks. The worker's no-delegation rule and one-browser allocation
govern this review. No main build, Git operation that changes state, production
fix, deployment, dependency installation or other-chat message was performed.

## F1 — P2, initial finding; CLOSED by correction below

This section retains the initial nine-file candidate's failing diagnosis and
original reproduction. Its source descriptions and open-repair recommendations
are historical; the current ten-file candidate passes the independent recheck.

**Invalidated criteria:** 2 and 6, and the cancellation part of criterion 7's
clock-hand adapter evidence. Completed edits must survive an active gesture's
rotation. Numeric shape/range validation is correct and no Check is emitted;
the failure is an unintended draft edit.

**Causal owner:** the shared
`src/interaction/pointer.ts` `bindPointerDrag` gesture lifetime and `up` path,
especially lines 20, 30–36 and 53–64. Its active state does not retain or compare
the viewport/rotation state from gesture start. It cancels only when the queued
`resize`/`orientationchange` handler runs (line 68 and its event registrations).
The new clock resolver at candidate `ActivityWidgets.tsx` lines 219–230 then
correctly maps the release against the **new** dial rectangle. WP02-09A exposes
this pre-existing adapter gap; the reducer and source-clock renderer are not
causal owners. Controller must route any required pointer-file write permission
to the original author rather than changing scope through this report.

Complete native reproduction, independently repeated **six times, six failures**:

1. Serve the unchanged frozen candidate on private port 5213, base `/playtest/`.
   Open `tests/fixtures/interaction.html` in Chromium 156.0.8078.4, viewport
   1024×768, `hasTouch:true`.
2. In Clock construction, native-click “Set hour 3”, then “Set minute 15”.
   The completed serialized response is `{"kind":"clock","minutes":195}`.
3. Scroll “Choose minute hand” into view. Native mouse-down at its centre,
   move 12px diagonally to start capture/ghost, then move to the current dial's
   `(left + .85 * width, top + .5 * height)` without releasing.
4. `await page.setViewportSize({width:768,height:1024})` and immediately
   `await page.mouse.up()`. Do not wait for the ghost/resize callback; that
   additional synchronization is the excluded event order under investigation.
5. Let native events settle, then inspect the actual fixture response and event
   trace. The response becomes **190**, despite the already-changed viewport.

One complete independent trace (milliseconds within its fresh page):

| Ordered checkpoint | Expected | Actual |
|---|---|---|
| Completed native controls | Clock195 | Clock195 |
| Active captured drag, before viewport command | No response edit | Ghost1; Clock195 |
| Native pointerup at297.900 | Rotation cancels pending gesture, preserving195 | Viewport already768×1024; ghost1; response195 on capture-phase observation |
| Pointer adapter release/drop | No `place` after rotated viewport | New dial geometry resolves190 and the adapter emits the completed place |
| Native resize at309.400 |195 remains the last completed construction | Ghost0; response190; cancellation handler is too late |

All six fresh traces had pointerup before resize, an already768×1024 viewport
at pointerup and a final190 response. Resize followed pointerup by roughly
9.8–13.5ms. No synthetic pointerup/resize event, mocked target rectangle,
producer edit or timed wait was used to create the failure.

The retained author trace independently records the same semantic violation:
pointerup422.8ms at the changed viewport edits195→190; resize424.3ms arrives
afterwards. Its event-order facts are valid. The classification as only a
test-driver error is insufficient for the product's rotation contract. Waiting
for resize-driven ghost removal tests the **resize-before-release** ordering,
which this reviewer separately ran green at555 minutes. That synchronization
cannot establish preservation when release happens after dimensions change but
before the queued cancellation callback.

The earliest missing safeguard is gesture eligibility at release. A narrow
repair should reject a pending drop when a viewport/rotation change has occurred
since gesture start, including this event order. Preserve current-rectangle
resolution for ordinary scrolling and normal drops; do not compensate in
`reduceDraft`, restore the old answer after committing, or keep only the
resize-waiting test. Re-run this original complete195 flow and both event orders,
then focused pointer cancellation/scroll and affected M1/M2 cases. No repair was
attempted by this validator.

## Independent F1 correction recheck — 11 October 2026

The original author repaired the producing stage. At current pointer lines
22–23/38, the active gesture records `innerWidth`, `innerHeight` and the available
screen orientation angle. Both move and up compare that stamp before asking for
a target (lines43/59). A changed viewport cancels capture/ghost/selection and
suppresses the cancelled gesture's compatibility click without emitting `place`
or a response/history edit. Existing resize/orientation/blur/capture-loss/Escape
cancellation remains. Scroll offsets are excluded, retaining current-rectangle
resolution. No reducer compensation, stale geometry, timer or delayed release
was added. Inspected the full pointer delta and permanent regression assertions.

Re-ran the original complete native195 sequence unchanged, selecting
`CASE_FILTER='clock real viewport rotation'` and
`RESULT_NAME='original-unsynchronized-after'` in a private copy of the original
runner. No wait for resize or ghost removal was added. **6/6 retain195**, with
zero page errors. All six traces still have pointerup at changed768×1024 before
resize. In the first trace, pointerup506.800ms observes ghost1/Clock195; the
adapter cancels, and resize519.400ms observes ghost0/Clock195. Across six runs
resize follows release by8.1–12.8ms. Thus the original red event order remains
present and the response-preservation contract is now green.

Additional fresh bounded checks on the same corrected source:

| Complete case | Independent outcome |
|---|---|
| Native555 hand/control equality, normal drop, Undo and resize-before-release | PASS; preserves the completed response in the opposite event order. |
| Unsynchronized195 rotation, action/history inspection, subsequent portrait edits | PASS; no `place`, no ghost; Undo returns180. Invalid centre drop leaves180; fresh valid portrait drop gives195 and Undo returns180. |
| M1 bridge drag while ordinary scrolling moves the target rectangle | PASS; ghost stays active as target top changes347.53125→312.53125. Release at the new rectangle yields `[4]`; Undo restores `[]`. |
| M2 matching drag while ordinary scrolling moves the target rectangle | PASS; native Ash→West yields `{oak:null,ash:west}`; Undo restores both null. |

These checks and the six original repetitions record zero page errors in
Chromium156.0.8078.4. They close F1 without claiming a fresh broad independent
suite or a fresh independent completion of the original failed dialog flow.

Fresh correction evidence root:
`C:/Users/alexb/AppData/Local/Temp/lif-WP02-09A-validator-correction-2ae7378be14e4f2ea7509e0c015e259d/`.
It retains `original-native-checks.mjs`, `original-unsynchronized-after.json`,
`clock-rotation-orders.json`, `resize-before-release-after.json`,
`shared-pointer-checks.mjs`/`shared-pointer-results.json`,
`plain-native-tap-probe.mjs`/`plain-native-tap-results-cdp.json`,
`baseline-archive-check.json`, `final-payload-check.mjs`/`.json`, and a byte copy
of the initial validation report. The initial evidence root remains untouched.
Runtime and server commands use the bundled Node and the same private port5213.

### First-tap limitation and plain native control

The author's retained original combined probe is still **FAIL before and after
F1**: the post-rotation target receives pointerdown/up and touchstart/end, but no
native click; the dialog remains closed. Its separately labelled second-tap
diagnostic opens the dialog and verifies Escape focus return on all three new
boards. That diagnostic does not turn the first-tap probe into PASS.

Inspected and independently executed the static-page control, using the same
CDP session for every touch. The control has a touch-action:none source button
and an ordinary target button whose click handler increments a counter and opens
a native dialog. It imports no production code and has no React, widget,
pointer adapter, preventDefault or application cancellation listener.

| Plain native scenario | First target tap | Second target tap when needed |
|---|---|---|
| Clean | Click1; dialog open | Not needed |
| TouchCancel only | Click1; dialog open | Not needed |
| Native touch movement, viewport resize, touch end | Click0; dialog closed despite target pointer/touch events | Click1; dialog open |
| TouchCancel, new native touch movement, viewport resize, touch end | Click0; dialog closed despite target pointer/touch events | Click1; dialog open |

All recorded control events have `defaultPrevented:false`. The author's separate
mixed-CDP/Playwright control has the same outcome. Same-CDP reproduction means
mixed input APIs are not required to produce the absent click. **Inference:**
within this observed Chromium/automated native viewport sequence, the missing
click occurs without application code, so the failed first-tap probe is a bounded
browser/input limitation rather than a second localized widget source defect.
No physical-device or cross-engine cause is inferred. No pointerup activation
workaround is required by this evidence. First-tap focus certification remains
outside this PASS; the original failed probe and its screenshots are preserved.

## Criteria and preserved passing evidence

| Criterion | Assessment |
|---|---|
| 1 — Match/sequence/sort pointer, non-drag tap and keyboard equivalence | PASS. Fresh independent native CDP touch drags, native Playwright taps and Space activation produce identical IDs through replacement/reorder/remove/undo. This supplements the author's mouse Pointer Events/capture routes in all three engines. |
| 2 — Complete edits survive undo/remove/reorder/cancel/rotation | PASS after correction; F1 closed by6/6 original unsynchronized native runs, opposite event order and explicit no-place/Undo/subsequent-drop checks. Ordinary earlier revisions remain valid. |
| 3 — Six mechanics and affected M1 preservation | PASS for implemented widget support and retained route checks. Three new boards complement existing drag/manipulation/selection; the nine WP03 response tags do not invent a seventh mechanic. Inspected M1 JSX/CSS and the pointer correction; fresh bridge scrolling and author's corrected100-pass affected adapter suite support M1 preservation. No full-game integration is claimed. |
| 4 — Targets, focus, portrait/200% text | Size/reflow PASS. Earlier fresh768×1024 with32px root font gives36px widget body text, visible buttons≥44×44px, no widget/button horizontal overflow and touch-action:none only on handles. Matching/sequence/sort removal/move focus checks pass in revision flows. Author's corrected overlay focus checks pass. The original first-tap combined probe remains FAIL with the bounded native-click limitation above; complete focus certification is not claimed. |
| 5 — Stable matching endpoints, exact sequence set, sorting unassigned/category | PASS. Unique matching replacement clears the displaced source atomically and undo restores both endpoints. Sequence movement preserves each declared ID exactly once in both directions. Sorting moves/removes only the selected item. Neither label text nor coordinates enter responses. |
| 6 — Cancel/rotation/focus recovery and retained M1 fixtures | PASS within the stated local fixture coverage; F1 rotation guarantee now passes both event orders and affected M1/M2 adapter regressions pass. Original first-tap combined dialog flow remains FAIL and is classified by the plain control as a browser/input evidence limitation; complete first-tap focus certification is not claimed. |
| 7 — Exact quantities/time and five source-equivalent representations | PASS; F1 clock cancellation qualification is closed. Earlier fresh values include2/1m, unreduced3/4whole,500/1pence and231/100metre, boundary disabled controls, clear/undo and exact serialization. Clock native hand and labelled controls agree at555 integer minutes, freshly repeated after correction. Five representation families retain source quantities, partition, hand positions, supplied text, edge IDs, equal x/y scale, row order and zero-origin tick step. No computed analogue answer, grading, reward/save/audio port or unsupported-silent-card behavior was found. |

Fresh complete route checkpoints, identical on each independent route:

| Mechanic | Fresh input/revision | Final response |
|---|---|---|
| Matching | Oak→West; Ash→East; Oak→East displaces Ash; undo; remove Ash; undo | `{kind:matching,pairs:{oak:west,ash:east}}` |
| Sequence | Dawn after Dusk; Dawn before Noon; undo | `{kind:sequence,orderedIds:[noon,dusk,dawn]}` |
| Sorting | Square→Second; Round→Second; Round→First; remove Square; undo | `{kind:sorting,groups:{circle:first,square:second}}` |

## Initial verification, retained evidence and current applicability

Independent private root:
`C:/Users/alexb/AppData/Local/Temp/lif-WP02-09A-validator-f75fa740c6e14c7ebd72aaf8d98d0bd6/`.
Bundled Node:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
Actual candidate-cwd commands were `node <private-root>/server.mjs` and
`node <private-root>/native-checks.mjs`. Vite reads frozen candidate config with
`configLoader:runner`; caches, scripts, browser temp paths and reports are
private. Port5213 was exclusive. One Chromium browser/page/context at a time,
fresh fixture pages, no production alteration or broad suite.

- Initial independent bounded run: **seven cases PASS, two FAIL**. Three
  passing cases each cover all three new mechanics on a distinct input route.
  Other passes cover final quantity controls, all five source families, clock
  hand/control equality plus resize-before-release cancellation, and final-source
  portrait metrics/scroll. One failure is F1 (six underlying native reproductions).
  The other is the combined probe below. Zero page errors were recorded.
- Native touchCancel and resize-before-release preserved the completed matching
  response before the combined probe reached its failing dialog step. That run
  did not reach the same cancellation/dialog steps on sequence or sorting; their
  corresponding cancellation evidence remains authored evidence, not a fresh
  independent completion claim.
- **Initially unlocalized combined-probe limitation:** following CDP touchCancel and
  resize cancellation, native tapping matching's “How to move pieces” did not
  open its dialog. The first assertion reported missing focus; separate private
  reruns waited for focus, then explicitly for dialog opening, and still failed.
  `focus-cancellation-final.json` records `open:false` after native tap and the
  30-second visible-dialog timeout. At initial freeze, whether this was input
  driver state or product behavior was not localized. The Controller directed this bounded
  review to freeze and return the confirmed rotation finding before further
  investigation. No second source defect or passed combined-focus flow is
  asserted. The correction-stage plain control above now supports the bounded
  browser/input classification; the original first-tap probe remains FAIL.
- `results.json`, `clock-rotation-orders.json`, the preserved
  `native-checks-attempt-1.mjs` and separate focus-attempt files retain outcomes,
  native timings, dimensions, responses, metrics and failed screenshots. The
  final private script supports `CASE_FILTER` and distinct `RESULT_NAME` outputs
  so valid earlier results are not overwritten by affected-only probes.
- Runtime speech `speak`, Storage `setItem` and IndexedDB `open` counters are
  zero in the tested completed flows; fixture action kinds stay within draft
  commands. Inspected producer imports and props expose no answer rule,
  evaluator, Check, scoring, storage, reward or audio service.
- Genuinely inspected independently generated fraction, analogue clock,
  diagram, bar-chart/table, quantity, matching, sequencing and sorting captures.
  They retain readable labels/alternatives, clear selected/unassigned states,
  correct partitions and given edges, and reachable wrapped controls. Source
  analogue text describes hands without adding03:15. Arrays depict3×4 objects;
  fraction depicts5 shaded parts across two four-part wholes; chart retains
  Wednesday/Monday/Friday values4/0/6 with ticks0/2/4/6. No silent unsupported
  representation is substituted; malformed/absent/escaped-source assertions in
  the inspected author tests remain valid.

Author evidence was reused with exact source applicability:

- **42 unit tests** and focused app/fixture/consumer plus Node-only browser-spec
  typechecks are attributed author evidence. The author reran42/42 and both
  focused TypeScript checks after the pointer correction; no fresh broad
  independent rerun is claimed.
- **81 browser passes** precede the final ±10/±100 convenience buttons. The
  inspected refinement affects only ExactQuantityControl and its test inputs;
  reducer, matching/sequence/sort, clock, source renderer and M1 paths are
  unchanged by that refinement. Their valid results are retained.
- **Nine final affected quantity/reflow passes** cover the final buttons in the
  three available engines. Inspected assertions and actual `passed`/empty
  `failedTests` records in both `browser-focused-final-1` and
  `quantity-reflow-final`. The reviewer independently exercised the final
  quantity buttons through500 and exact231/100, plus final-source reflow.
  This is not described as all81 rerun on final source.
- **100 affected shared-pointer browser passes, two existing CDP-only skips**
  are attributed to the author's final correction run, one worker/no retries.
  Inspected actual `passed`/empty `failedTests` in
  `private/F1/pointer-regressions-final/.last-run.json`, permanent immediate-release
  regression assertions and handoff. The suite repeats the original six times
  per engine, then no-place/Undo/invalid-drop/fresh-valid-drop, and covers affected
  M1/M2 input, cancellation, disposal, current-rectangle scrolling, second-pointer,
  focus and portrait/timber paths. The existing Edge/WebKit skips are for
  CDP-only probes. Unchanged quantity/source cases are excluded from that scoped
  suite and retain their earlier valid evidence. The failed original first-tap
  diagnostic is separately retained; it is not counted as a passing suite case.
- Chromium156.0.8078.4 is the fresh independent engine. Edge155.0.4283.45 and
  WebKit27.2 results are attributed to the author. No branded Chrome, matched
  Firefox, physical-device, child, published-game, durable-state/evaluator or
  acoustic acceptance is inferred from local contract fixtures.

The correction browser and private server were stopped. A fresh TCP check
confirms port5213 is closed. Only this main-checkout report was written; frozen
candidate bytes, other authors' work and main config/source/Git/ledger/deployment
state were preserved. Current report/evidence are frozen in the correction root's
`review-freeze.json`. **F1 is closed; no confirmed source findings remain.**
The first-tap limitation remains explicit. Controller acceptance/integration,
full-game/state/evaluator/published-play and detailed acoustic acceptance remain
outside this independent widget verdict.
