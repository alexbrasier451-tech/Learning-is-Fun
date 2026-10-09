# WP02-04A independent implementation validation

Reviewed 9 October 2026 by the independent validator, under the current execution
authority and this worker's report-only assignment. Controller owns acceptance,
dependency release, source correction dispatch and commits.

**Current verdict: PASS. Finding severity: NONE. F1/P2 is CLOSED** following the
independent correction recheck below. The initial failed geometry evidence is
retained as historical evidence; draft/input findings remain valid. Controller
owns administrative acceptance.

The initial review found one P2 rendering defect: unequal labelled bridge lengths
were drawn as equal-length timber in both the palette and the child's construction.
No evaluator, state-repository or root-discovery repair was implicated.

## Authority, scope and evidence reuse

Read [GLOBAL_RULES](../GLOBAL_RULES.md), [WP02-04A](../chunks/WP02-04A.md),
[its implementation handoff](WP02-04A-HANDOFF.md), accepted
[WP02-01A validation](WP02-01A-VALIDATION.md), `docs/art-direction.md`, actual
`src/learning/contracts.ts`, all four interaction modules, their owned reducer
and browser tests, both fixture entries, WP01's `mountPanel` and root Vite config.
The additional [WP02-02A art handoff](WP02-02A-HANDOFF.md) read establishes the
painted-plank common-scale contract at lines 127–131; it explicitly forbids
stretching each length into an equal-width card in an assessed length activity.
This also matches the Controller's explicit geometric-length validation request.

Reused the author's 18 passing reducer tests, focused app/fixture and Node-only
typechecks, 55 passing / two intentionally skipped engine-specific browser cases,
and three passing affected overlay/reflow reruns. Inspected the actual assertions
and final `passed` / empty `failedTests` records in the author's private
`final-browser-output-2` and `final-reflow-evidence` directories. These results
are attributed author evidence, not independently rerun broad suites. Their
geometry test concerns drop-target rectangles, not painted plank lengths.

The root discovery correction is now present; read
[BROWSER-DISCOVERY-HANDOFF](BROWSER-DISCOVERY-HANDOFF.md) and the current matcher.
The interaction author's historical discovery warning is superseded. This
validator did not alter or independently accept the foundation owner's config.

Used the standard build protocol for this bounded validation stage. This worker's
explicit no-delegation rule and exclusive single-browser allocation govern the
serial rendered inspection. Node-only and server-start work ran independently.
No Toolkit transaction or source repair was performed.

## F1 — P2 initial finding: timber drawings erase the geometric length relationship

**Status: CLOSED by the independent correction recheck below.** The measurements
and reproduction in this section describe the initial implementation.

**Causal owner:** WP02-04A `PlacementBoard` rendering, specifically
[`ActivityWidgets.tsx`](../../../src/interaction/ActivityWidgets.tsx) lines 76–84
and [`widgets.css`](../../../src/interaction/widgets.css) lines 36–41.
**Affected requirement:** the explicit geometric-length check and the consuming
bridge representation contract. Numerically serialized response and labelled
controls still work; this finding does not invalidate their route equivalence.

Complete reproduction, against the unchanged production widget in the actual
WP01 React fixture:

1. Serve the repository on the validator's private port 5180 with
   `APP_BASE=/playtest/` and `APP_BUILD_ID=local-interaction-validator`.
2. Open `http://127.0.0.1:5180/playtest/tests/fixtures/interaction.html` in Chromium
   156.0.8078.4, viewport 1024×768, `hasTouch:true`.
3. Measure `.iw-bridge .iw-palette .iw-timber` using `getBoundingClientRect()`.
   Labels 1m, 2m, 3m, 4m, 5m and 6m each have width **112px**, height **48px**.
4. Tap “Choose 1 metre plank”, then “Place selected plank at the end”; repeat
   with “Choose 6 metre plank”. The fixture records the correct domain response
   `{"kind":"bridge","planks":[1,6]}` and the summary says seven metres.
5. Measure `.iw-bridge .iw-placed .iw-timber`. Both the 1m and 6m drawings are
   **192×48px**. Inspect `bridge-geometry.png`: they visibly depict the same
   length. All six palette drawings are equal as well.
6. The fresh six-plank 200%-text portrait case preserves values
   `[6,1,5,2,4,3]` and reachable controls but still draws equal timber bodies.

| Ordered checkpoint | Expected | Actual | Result |
|---|---|---|---|
| Response specification | Distinct integer lengths 1–6 | `[1,2,3,4,5,6]` | Correct |
| Native tap actions → reducer | Ordered 1m then 6m construction | `[1,6]`, separate instance identities | Correct |
| `toResponse` / numeric summary | `[1,6]`, total seven | Correct response and summary | Correct |
| Widget length → painted geometry | One units-to-pixels scale, visibly unequal bodies | Length reaches text only; both bodies take the card's full width | First wrong |

The two JSX sites interpolate length only into label/text. Neither passes a
length-dependent dimension to the timber span; `.iw-timber { width:100% }`
fills each equal-width handle. The defect is in this producer's renderer, not
WP03's integer semantics or WP02-02A's art. The supplied art handoff already
describes correctly scaled `72*n` bodies and constant side gutters; code-native
timber is also viable if it preserves a shared geometric scale.

The independent browser check fails on the measured equal widths. Its conservative
1m/6m ratio assertion is not the authority for a particular pixel size; the
common-scale representation requirement is. Actual equality alone establishes
the violation. Keep the native hit areas and live number labels comfortable
while correcting the painted geometry in both palette and placed construction.
Recheck the original `[1,6]` flow, all six lengths, repeated pieces and the
six-plank 200% portrait case after the rendering correction. No change was made
by this report-only validator.

## Initial criterion assessment — retained evidence

| Child criterion / requested concern | Conclusion and evidence |
|---|---|
| 1 — Bridge, punctuation, basket route equivalence | PASS for serialized domain responses. Reused the authored nine form/route cases per engine. Fresh native Chromium touch drags independently completed repeated bridge `[6,6]`, reorder/undo/remove, repeated punctuation `!`/`!` with replacement/undo/clear, and three pears with remove/undo/zero/clear. These drags use native CDP touch input, not injected PointerEvents or mouse emulation. F1 separately fails painted bridge geometry. |
| 2 — Shape-only editable construction | PASS. Frozen-input counterexamples cover saved repeated/full-capacity planks, movement/removal/undo, slot-specific option rejection, complete legal but unjudged marks, fruit per-count/total bounds, null versus zero, exported-response isolation and an 83-edit bounded undo sequence. Values are not scored or judged. |
| 3 — Cancellation, capture and scrolling | PASS within the local evidence. Reused authored Escape, native capture release, pointercancel, rotation, second-pointer filtering, current-rectangle/scroll drop and teardown cases. Fresh punctuation native touchCancel, basket actual lost capture, disabled-in-flight drag and active-drag unmount preserve completed values or remove the panel without a half-drop. Ghosts are removed and subsequent Escape/resize produces no page error. |
| 4 — Targets, focus, portrait and 200% text | PASS for the documented viewport. Fresh 768×1024 / 32px root-font case has 36px widget body text, six placed planks, no widget/button horizontal overflow and every visible widget button at least 44×44px. All three rendered boards were inspected. Native Tab/Space/Enter reaches punctuation and basket controls; focused removal has a 3px outline. A native instruction dialog focuses its Back control and Escape returns focus to its trigger. |
| 5 — M1 handoff boundary | PASS. Three M1 widgets only; no matching, sequencing, sorting, final-world composition or M2 acceptance claim. WP02-09A/13A retain their supporting responsibilities. |
| 6 — Create → edit → undo → remove, ranges and incomplete forms | PASS. Authored route comparisons plus fresh touch/keyboard/frozen-data cases preserve repeated pieces, stable ordering and partial slot/count states. Removing the last fruit yields explicit zero; clearing yields null; undo restores the prior meaning. Slot compatibility and declared structural limits are enforced without educational correctness judgement. |
| 7 — Ordinary scroll, rotation/lost capture, overlay focus, one-pointer filtering and event boundary | PASS within local evidence. Fresh native touch scroll outside handles works at 200% portrait. Computed touch-action is `none` only on handles. Native lost capture, touch cancellation, focus return and cleanup pass; authored second-pointer/rotation cases supplement them. Runtime counters for speech `speak`, Storage `setItem` and IndexedDB `open` remain zero in tested flows. Recorded fixture action kinds and inspected production imports expose only draft edits; no Check/help/reward/save/speech port is attached or emitted. |
| Requested geometric lengths | **FAIL, F1/P2.** Real measurement and visual inspection show equal timber lengths for unequal metre values in both contexts. |

The no-speech assertion concerns widget-generated speech API calls. The concise
ARIA live edit summary is the intended accessibility announcement, not a TTS or
assessment event. The storage/speech counters corroborate the tested flows; the
typed command boundary and source inspection establish the architectural scope.

## Initial independent verification and rendered inspection

Private evidence root:
`C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-validator-23e12256d43641f49e8afc49f9716c0c/`.

Bundled Node used:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

Invocation from repository cwd, using scripts in that private evidence root:

```text
node <private-root>/vite-server.mjs
node <private-root>/pure-counterexamples.mjs
node <private-root>/browser-counterexamples.mjs
```

- **Pure counterexamples: 4/4 PASS, exit 0.** Node's built-in type stripping
  imports the actual unchanged draft module; no copied reducer or shared Vitest
  cache is used. Inputs and nested histories are deeply frozen before edits.
- **Rendered counterexamples: 7 PASS, 1 FAIL, exit 1.** The one failure is F1.
  Chromium 156.0.8078.4, one launched browser, one page/context at a time;
  1024×768 touch, 768×1024 at 200% root font, and normal 1366×768 captures.
  No retries. `browser-results.json` retains widths, portrait metrics, all case
  names, the failed assertion, zero page errors and zero domain-side-effect
  counters. `pure-results.json` retains the separate pure outcomes.
- The private Vite server uses the read-only root config with `configLoader:runner`,
  a private `vite-cache`, exclusive port **5180** and the fixture base. It never
  uses the repository author's port 5179 or root/shared test report locations.
  The validator server was stopped after inspection; port 5180 has no listener.
- Independently viewed `bridge-geometry.png`, `normal-punctuation.png`,
  `normal-basket.png`, `portrait-bridge-200.png`,
  `portrait-punctuation-200.png` and `portrait-basket-200.png`. Important text,
  selected states, fruit images, editing controls and wrapping remain clear.
  The bridge's incorrect equal-length depiction is visible at normal and
  enlarged portrait sizes. A full-page enlarged capture is also retained.
- No new broad build, regression or matrix run was necessary. Temporary scripts,
  browser output, PNGs and caches are private artifacts; this report is the sole
  repository write. OS temporary cleanup may remove them eventually. The exact
  native-control reproduction and measurement selectors above remain sufficient
  to reproduce F1 from the owned fixture without those scripts.

## Initial reviewed snapshots and limitations

Observed review-start HEAD: `acf7d6166e039855bb0b1442a835c2327302a5de`.
The following eight owned files were hashed before the independent checks and
all remained byte-identical at the final source check:

| Path | Lowercase SHA-256 |
|---|---|
| `src/interaction/draft.ts` | `f65e6e8289248c85660b69121721ff8f777fa94dbc1bcd4c2e36931c06959d92` |
| `src/interaction/pointer.ts` | `dde518fdd3f6a9d25de42bfaea5fef14613d37c74a3430e20ce2b593931ebc63` |
| `src/interaction/ActivityWidgets.tsx` | `6ec93b763cfef5616e1d8796291fec02e4eca2baae861adff57a222a70c9bb32` |
| `src/interaction/widgets.css` | `ae034ca6bbae171e437c49c1e6bed700ec1e7cd3721e91a6c8272fdd644ea9ae` |
| `tests/interaction/draft.test.ts` | `f3bf3da9aa7e046b08d4d3ee68745547d66d7c25c47972d37c858ddd03196022` |
| `tests/browser/interaction.spec.ts` | `add676e37ac48098af42008379ef568650e264463f63d4eb06aa5a7769984046` |
| `tests/fixtures/interaction.tsx` | `f0af98739dadaa16f69e066f497f777c414a905ceda0bc633c9e85aac19fc6e7` |
| `tests/fixtures/interaction.html` | `9c56ce901990adf7a6aa539455b01a0317d2153a2fe373784f79a22ec281b6de` |

The report-only trailing-whitespace scan found zero offending lines, and scoped
`git diff --check` passed. Final status preserves concurrent work.

This is local fixture/browser evidence. Fresh independent rendering used bundled
Chromium; Edge and WebKit results are attributed to the author. Branded Stable
Chrome and matched Firefox remain the documented host gaps; physical tablets,
actual child use, published adventure integration, acoustic quality and durable
Check/reward behavior are not asserted. Static widgets add no decorative
animation; system/profile quiet preference integration remains downstream.

Concurrent root-discovery, repository-author and Controller changes were
preserved. This validator changed no source, owned tests, fixture, config,
dependency, ledger, Git state or durable instruction; did not delegate or message
other chats. **Administrative acceptance should remain pending until F1 is
corrected and independently rechecked** was the initial gate; the recheck below
now closes that finding.

## Independent F1 correction recheck — 9 October 2026

**Correction verdict: PASS. Remaining findings: NONE. F1/P2: CLOSED.** Child
criteria 1–7 remain satisfied within the stated M1/local-fixture evidence, and
the requested geometric-length representation now passes. Controller retains
administrative acceptance, dependency release and commits.

Read the author's appended correction handoff, both corrected rendering files
and the owned browser-spec delta. The production change is confined to shared
`Timber` rendering and bridge layout: approved plank-1…6 SVGs receive one shared
container-relative scale, with live metre labels and padded native controls
outside the painted body. The reducer, pointer adapter, fixture entries and
pure tests remain byte-identical to their earlier reviewed snapshots. The
added browser regression checks both geometry and full-capacity portrait
layout; its module-local probe additions do not change input semantics.

Independently parsed the SVG actually loaded by every palette/placed image,
rather than treating the widget's data attribute or width formula as its own
oracle. The loaded files have source widths `72*n+16`, height 88 and timber
rectangles at x=8 with body width `72*n`, height 56. Natural image dimensions
agree with those source dimensions. Rendered width/source width and rendered
height/source height agree at one scale across all six lengths and both
contexts, within browser subpixel rounding. The correction therefore fixes
the earliest wrong checkpoint identified by F1: semantic length now reaches
painted geometry, with unchanged serialized values and edit commands.

Fresh independent checks used bundled Chromium 156.0.8078.4, one browser worker,
one page/context, no retries and private port 5180:

| Focused complete flow | Independent result |
|---|---|
| Original native taps: create → 1m → 6m, compare all six palette lengths and both placed pieces | PASS. Response `[1,6]`, seven-metre summary, actual SVG loading and common painted scale. Original unequal lengths are visibly unequal. |
| Fresh repeated native touch drags: `[6,6]` → add 1m → drag the placed 1m before the first plank → undo → remove → undo | PASS. Ordered responses `[6,6]`, `[1,6,6]`, `[6,6,1]` and `[6,6]` match the edits. Repeated 6m drawings have identical dimensions; all placed/palette images retain the common scale. |
| Six-plank `[6,1,5,2,4,3]` → rotation to 768×1024 → 200% root font → keyboard rearrange → undo | PASS. All six lengths remain proportionate; response/order survives reflow and later editing. Widget text is 36px. All 40 visible bridge buttons are ≥44×44px, inside the viewport horizontally, without overlapping hit boxes or horizontal overflow. Touch-action remains suppressed only on handles. |

**Fresh result: 3/3 focused cases PASS, exit 0; zero page errors.** Independently
measured SVG-box widths, including their constant side gutters:

| Metres | Original 1024×768 | Portrait 768×1024, 200% text |
|---|---:|---:|
| 1 | 58.65625px | 50.15625px |
| 2 | 106.65625px | 91.18750px |
| 3 | 154.65625px | 132.234375px |
| 4 | 202.65625px | 173.265625px |
| 5 | 250.65625px | 214.31250px |
| 6 | 298.65625px | 255.359375px |

Palette and placed dimensions agree for each length. The actual painted 6m/1m
body ratios are **6.000856** and **6.000434**, respectively; their small departure
from exactly six is consistent with measured CSS-pixel rounding. All intermediate
painted body lengths strictly increase; image heights and units-to-pixels scales
agree across the palette and placed construction.

Genuine independent rendered inspection covered `original-1-6.png`,
`six-portrait-palette.png`, `six-portrait-placed-short-long.png` and
`six-portrait-footer.png`: appropriate unequal lengths, readable separate live
labels, clear selection, comfortable controls, wrapping and reachable footer.
The full six-plank portrait capture is also retained. No important text/control
clipping or overlap was found. A tall portrait board scrolls normally.

Reused the author's corrected focused app/fixture and Node-only typechecks and
**25 passing / two existing intentional CDP-only skips** across Chromium, Edge
and WebKit. Read the new regression's assertions and its retained
`focused-regressions/.last-run.json` (`passed`, no failed tests). Earlier passing
pure/punctuation/basket/cancellation/focus evidence remains valid because the
correction does not change those causal components. No redundant broad suite
or expanded matrix run was performed.

Correction-only private independent evidence root:
`C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-geometry-validator-8c88209013644aaba31e6a06ea0fb0a9/`.
`vite-server.mjs` uses the read-only root config with `configLoader:runner`,
private `vite-cache` and port 5180. `recheck.mjs` contains the three independent
flows; `recheck-results.json` retains actual loaded-source geometry, rendered
dimensions, the 40-button layout and test outcomes. Actual invocation used the
same bundled Node path recorded above, from repository cwd:

```text
node <correction-private-root>/vite-server.mjs
node <correction-private-root>/recheck.mjs
```

The private helper was stopped by its verified exact script identity after
inspection; a fresh TCP connection check confirms port 5180 is closed. Other
workers' servers, caches and reports were untouched.

Recheck-start HEAD: `3cc25661d90d406b2e0ce88bedf153e216a6b617`. Corrected snapshots:

| Path | Lowercase SHA-256 |
|---|---|
| `src/interaction/ActivityWidgets.tsx` | `458918d1032766a8394c6f9585e63ffe94a6fdbe1099d3e34609f9d2dafba016` |
| `src/interaction/widgets.css` | `7c3705061c863d5143ba9e4e9d938306fe01573958e4d07c34d3984f708d91bc` |
| `tests/browser/interaction.spec.ts` | `2a0575648a525e002f269d4143467f1c3842a3eb53b960bb1815fb37d5c54db4` |

These three corrected files and the five unchanged reviewed files remained
byte-identical throughout the independent recheck. The original hashes above
remain historical snapshots, not the current rendering snapshot. The validator
again writes only this report, with private temporary evidence outside the
repository; no source/config/ledger/Git mutation, delegation or other-chat
message. Existing limitations concerning physical devices, branded browser
gaps, published adventures, audio and downstream domain integration remain in
force. **This independent recheck releases F1; no widget finding remains open.**
