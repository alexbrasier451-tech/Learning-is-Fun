# WP02-04A implementation handoff

Implemented 9 October 2026 under GLOBAL_RULES current execution authority and
Controller's explicit WP02-04A assignment; DEP-038/039 and the inherited minimal
host were released. Independent validation, administrative acceptance and commits
remain Controller-owned. No shared files or other authors' files were edited.

## Delivered files and consuming contract

- `src/interaction/draft.ts`: pure createDraft/reduceDraft/toResponse;
  ActivityDraft/DraftAction/M1ResponseSpec. M1 specifications import/derive WP03's
  response contract. Bridge stores ordered reusable plank instances; punctuation
  stores stable slot values/null; merchant preserves null versus explicit zero.
  Common select/place/remove/move/set/increment/undo actions enforce declared
  shapes/ranges only. Structural saved-response mismatch throws rather than
  silently discarding it. Empty/partial drafts remain unscored. toResponse copies
  domain values and strips selection/history/instance numbering.
- `src/interaction/pointer.ts`: bindPointerDrag returns an idempotent callable
  disposer with cancelDrag; exported cancelDrag(binding) has no global draft.
  One primary pointer owns capture, with a 6px drag threshold and disposable
  ghost. Each completed drop emits the same select/place pair as native controls.
  Targets use current viewport rectangles and half-open bounds, not event.target.
  Invalid drops, pointercancel, lost capture, Escape, viewport/orientation change,
  blur and disposal remove the ghost without editing response values.
- `src/interaction/ActivityWidgets.tsx`, `widgets.css`: PlacementBoard,
  ChoiceTiles, QuantityControl with exact `{responseSpec,draft,disabled,onAction}`
  props. Explicit selection/place, remove, adjacent move, undo and cancellation;
  fruit increment/remove/zero/clear distinguish zero from not-set. Native buttons,
  visible focus, live concise summaries, system-font 18px body/16px secondary,
  ≥44px targets, wrapping/portrait/200% text, and an accessible instruction dialog
  returning focus after Close/Escape. Only draggable handles use touch-action:none.
  Cream/ink/teal/amber tokens follow the accepted reference; timber/river controls
  are code-native, apple/pear illustrations consume accepted art read-only via
  WP01 assetUrl. No decorative animation is added, so quiet/system reduced-motion
  modes retain the same static construction. Ghost motion follows the user's input.
- `tests/interaction/draft.test.ts`: 18 pure shape/edit/undo/range/restore,
  geometry and owner-boundary checks plus negative readonly/no-Check type probes.
- `tests/browser/interaction.spec.ts`: 19 scoped browser cases per engine,
  covering all three routes/forms, repeated pieces, rearrangement, cancellation,
  scroll, current geometry, second-pointer rejection, disabled/disposal, focus,
  native Tab/Enter/Space and 200% portrait. Browser-probe types are module-local
  structural types; no triple-slash/global DOM declaration bleeds into Node tooling.
- `tests/fixtures/interaction.html`, `interaction.tsx`: WP01 mountPanel with
  representative response specs and action/response recorders. No task answer,
  Check/help/reward/audio/state service is attached; teardown calls unmount twice
  safely. Fixtures and their diagnostic JSON controls are not product UI.
- This handoff is the only execution document authored in this slice.

Undo retains the last 64 response edits in this session, with no committed-state
rewind. Selection/cancellation never adds an undo entry. Transient plank ordinals
do not rewind on undo or enter response/reward identity. A source always selects
its value; explicit Cancel selection clears it, so repeating the same piece is
consistent across drag, tap and keyboard. No M2 matching/sequencing/sorting UI,
world renderer, evaluator, assistance/reward policy or durable writer is included.

## Criteria and actual observations

| Criterion | Bounded evidence |
|---|---|
| 1 — three equivalent forms/routes | Nine route/form cases per engine compare serialized domain responses after edits, undo, rearrangement/removal; repeated plank/mark/fruit selections included. |
| 2 — editable construction | Pure and browser cases preserve tentative values/totals, stable instances and null/zero; no correctness/Check signal. |
| 3 — capture/cancel/scroll | Browser Escape, actual capture release, swapped viewport rotation and teardown preserve a previously placed 2m plank. Injected pointercancel/second-pointer events test adapter filtering; Chromium CDP also delivers native touchCancel. Ghosts are removed. |
| 4 — targets/focus/reflow | Every visible widget button measures ≥44×44px at 200% root font size, widget body ≥36px; no widget/button horizontal overflow at 768×1024. Native Tab/Space/Enter reaches controls, visible 3px focus outline, completes and undoes a bridge. Dialog Close/Escape returns trigger focus. |
| 5 — M1 boundary | Three M1 forms only; remaining three mechanics and later six-mechanic reporting stay WP02-09A/13A. |
| 6 — create/edit/undo/remove and shape | 18 pure tests plus browser fixtures retain partial slots/empty basket, declared ranges/capacity and invalid-drop no-ops. Legal complete answers are never judged here. |
| 7 — scroll/rotation/focus/no scoring | Ordinary wheel scroll in all three engines, native Chromium touch scroll outside handles, rotation/capture cancellation and focus checks pass. Fixture actions contain only draft command kinds; no domain ports/imports exist. |

Compact route equivalence (same serialized values on all tested engines):

| Form | Pointer | Tap/click selection | Keyboard | Representative checkpoints |
|---|---|---|---|---|
| Bridge | PASS | PASS | PASS | Repeated `[2,2]`; undo then `[2,3]`; replace/reorder `[4,2]`; undo `[2,4]`; remove to `[]` |
| Punctuation | PASS | PASS | PASS | Reused `?` in both slots; undo; `?`/`!`; replace first with `.`; undo and clear to null slots |
| Basket | PASS | PASS | PASS | Repeated apples gives `{apples:2,pears:1}`; undo pears; remove apple; undo; clear back to null |

Pointer rows use real mouse Pointer Events and capture in each engine. Tap rows
use native Playwright taps in touch Chromium/WebKit, ordinary clicks in desktop
Edge. Keyboard rows activate native controls with Enter; the separate traversal
case uses only native Tab/Space/Enter. These are local emulated input observations,
not physical tablet/child testing or a published complete adventure.

## Checks and isolated browser invocation

All commands used bundled Node 24:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

1. `node node_modules/vitest/vitest.mjs run tests/interaction/draft.test.ts`
   — 18/18 passed.
2. Focused app/fixture no-cache check passed:
   `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --jsx react-jsx --types node,vite/client src/vite-env.d.ts src/interaction/draft.ts src/interaction/pointer.ts src/interaction/ActivityWidgets.tsx tests/fixtures/interaction.tsx tests/interaction/draft.test.ts`.
3. Independent Node-only browser-spec no-cache check passed:
   `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2023 --lib ES2023 --module ESNext --moduleResolution Bundler --types node tests/browser/interaction.spec.ts`.
4. Private exact-match Playwright suite: **55 passed, 2 intentionally skipped**
   (19 Chromium-touch, 18 Edge, 18 WebKit-touch; CDP-only native touch case skipped
   in Edge/WebKit). No retries, max one browser worker.
5. After naming the dialog and persisting portrait screenshot files, affected
   overlay/scroll/target/reflow cases reran in all engines: **3/3 passed**.
6. Normal bridge/punctuation/basket screenshots and WebKit 200% portrait capture
   visually inspected: readable quiet surfaces, clear selected states, no clipped
   text/controls, appropriate wrapping; actual apple/pear images loaded locally.
7. Owned-file whitespace scan and owned-path git diff --check passed.

Private runtime/evidence root, retained outside repository/shared outputs:
`C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-0222f3d7b2334e4a82731f364605d18b/`.
Its `vite-server.mjs` uses installed Vite and the read-only root Vite config with
private `vite-cache`, APP_BASE=/playtest/, APP_BUILD_ID=local-interaction, host
127.0.0.1 and reserved port 5180. Its `playwright.config.mjs` uses installed
Playwright, absolute tests/browser testDir, exact interaction.spec.ts match,
baseURL `http://127.0.0.1:5180/playtest/`, one worker, no retries, list reporter
and private output directories. Projects:

| Local project | Viewport/input | Observed running version |
|---|---|---|
| interaction-chromium-touch | 1024×768, hasTouch:true | Chromium 156.0.8078.4 |
| interaction-edge | 1920×1080, msedge | Edge 154.0.4258.62 |
| interaction-webkit-touch | 768×1024, hasTouch:true | WebKit 27.2 |

Actual invocation from repository cwd (start private server separately):

```powershell
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' 'C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-0222f3d7b2334e4a82731f364605d18b/vite-server.mjs'
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/@playwright/test/cli.js test --config 'C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-0222f3d7b2334e4a82731f364605d18b/playwright.config.mjs' --output 'C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-0222f3d7b2334e4a82731f364605d18b/final-browser-output-2'
```

Final affected rerun appended `--grep 'ordinary scroll'` and used private
`final-reflow-evidence`. Portrait PNGs are in that directory's per-project test
subfolders; normal-board PNGs are `normal-bridge.png`, `normal-punctuation.png`,
`normal-basket.png` at the private root. Failed traces were preserved in separate
attempt directories, never overwritten or mixed with another worker's output.
Temporary artifacts may eventually be cleaned by the OS; durable reproduction
sources are the assigned fixture/spec and exact invocation above. The private
server was stopped after verification; nothing was installed or globally changed.

## Corrections and retained evidence

- Initial focused typecheck omitted the existing src/vite-env.d.ts build-global
  declaration. Added that existing file to the command, not to source/config.
- A lost-capture fixture initially waited before the browser processed pending
  release. Probe observed captured:true → release captured:false with no event →
  next native move delivered lostpointercapture and removed the ghost. Corrected
  driver ordering; unchanged adapter passed original route retest and full suite.
- WebKit rotation initially requested its already-current 768×1024 viewport.
  Changed the test to swap current width/height; actual resize cancellation passed.
- Repeated-source tap regression reproduced apples:1 instead of apples:2 because
  the source button toggled selection off, whereas dragging always selected.
  Fixed this causal widget event mapping to always select; separate cancellation
  control retained. Original tap input reran green, then repeated-form variants,
  full scoped suite and native keyboard case passed. Reducer semantics unchanged.
- Controller flagged Node-project DOM references in this worker's spec. Reproduced
  the Node-only errors and replaced ambient DOM references with file-local erased
  structural probe types. Node-only check is green; no shared DOM-lib/config edit.

## Integration handoff and limitations

**WP01-owned discovery refinement:** root local Playwright project currently
matches only `**/*.local.spec.ts`, so standard local invocation does not discover
the assigned `tests/browser/interaction.spec.ts`. Controller has queued its
root-harness correction with WP01. This worker made no shared config change;
the private exact-match runner above exercised the real fixture/producer files.

D1 branded Stable Chrome and D3 matched Firefox remain the documented host gaps
in BROWSER-CAPABILITY.md. No installer was repeated, no alternate engine was
claimed as D1/D3, and no complete matrix/published acceptance is asserted. All
remaining domain/scene/Check/assistance/commit integrations belong to WP02-06A
and their producers. Real acoustic, physical-device/child and full-game testing
are outside this widget handoff. No material producer-contract conflict found.
No commits, delegation, other-chat messages, dependencies, shared caches/config,
package/status ledgers or unrelated author changes were edited.

## F1/P2 rendering correction — 9 October 2026

Read the independent WP02-04A-VALIDATION report and reproduced its exact 1024×768
Chromium touch flow in the actual fixture: native taps placed `[1,6]`, the response
and seven-metre summary were correct, but both placed drawings measured 192×48px.
Palette drawings measured 110–112×48px, differing only with selection-border
padding, not metre value. This was a causal rendering defect in my two timber
JSX sites and width:100% decoration, as F1 identified. The reducer/pointer/art
producers were not implicated.

Changed only `src/interaction/ActivityWidgets.tsx`, `widgets.css`,
`tests/browser/interaction.spec.ts` and this handoff. Shared Timber rendering now
uses the accepted plank-1…6 SVG exports, whose bodies are 72*n with constant
8px side gutters. One bridge inline-size container supplies the shared responsive
metre unit, `clamp(24px, 6cqi, 48px)`. Every image width is `(n + 16/72) * unit`;
its aspect ratio retains the same source-to-display scale. Palette and placed
construction use this same rule. Cards/buttons wrap as whole controls; they do
not shrink/stretch individual drawings. Live number labels sit outside the
painted body, with independent native padding and ≥44px hit areas.

The new rendered regression reruns the original `[1,6]` flow, compares all six
palette lengths and every placed image at one source-to-display scale, then fills
`[6,1,5,2,4,3]` and rotates to 768×1024 with 200% root text. It checks actual
image loading/intrinsic widths, equal scales/heights across contexts, strictly
increasing painted lengths and the 1:6 body relationship. At full capacity it
also checks all 40 visible bridge buttons for ≥44×44px dimensions, no overlap
and no horizontal clipping; the response/order survives reflow.

Measured SVG-box widths (constant source gutters included, in pixels):

| Metres | 1024×768 Chromium/Edge | 768×1024 portrait, 200% text |
|---|---|---|
| 1 | 58.65625 | 50.15625 |
| 2 | 106.65625 | 91.18750 |
| 3 | 154.65625 | 132.234375 |
| 4 | 202.65625 | 173.265625 |
| 5 | 250.65625 | 214.31250 |
| 6 | 298.65625 | 255.359375 |

Palette/placed widths agree per length. At the desktop 48px/metre unit, nominal
painted bodies are 48/96/144/192/240/288px; SVG boxes include the constant side
gutters and browser subpixel rounding. WebKit starts at the portrait viewport
and matches the portrait column before and after text enlargement. Normal
`[1,6]` and six-plank 200% portrait images were visually inspected in Chromium,
and the final WebKit six-plank portrait was inspected: unequal bodies, live labels
and reachable controls remain clear without stretching or overlap.

Executed bounded checks with the same bundled Node:

- Original geometry browser regression in Chromium: **1/1 passed**.
- Focused bridge/input/reflow browser regressions in all three available engines:
  **25 passed, 2 intentionally skipped** (CDP-only touch case in Edge/WebKit).
  Includes three bridge edit routes/repeated pieces, shared-scale geometry,
  overlay/200% reflow, native Tab/Enter/Space, changed viewport/second pointer,
  active-drag rotation and native Chromium touch scroll/cancellation.
- Focused app/fixture and independent Node-only spec typechecks from the earlier
  command forms passed with `--incremental false`; no shared type cache/config
  changes. One new test's initial rectangle serialization typing used an
  undeclared toJSON member; corrected the probe to plain numeric fields before
  its first browser run. No production behavior was changed for that test issue.
- Owned correction paths passed whitespace/diff checks. Pure draft/pointer and
  unrelated punctuation/basket suites were unchanged and not redundantly rerun.

Correction-only private evidence root:
`C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-geometry-c6815fdd91d94a62acbb54ed45899f6f/`.
This contains `before-geometry.mjs`, before/after-original JSON/PNGs, private
Vite/Playwright scripts/cache and `focused-regressions` with per-engine original/
portrait PNGs and `painted-geometry.json`. The new Vite script explicitly uses
`configLoader:runner`, the read-only root Vite config, private cache and port 5180;
one browser worker/list reporter/exact interaction.spec.ts match, no shared
outputs. The backup author's port 5181 was untouched. Server stopped after QA.

Final actual invocation, repository cwd after starting the private server:

```powershell
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/@playwright/test/cli.js test --config 'C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-geometry-c6815fdd91d94a62acbb54ed45899f6f/playwright.config.mjs' --grep 'bridge create|bridge timber|ordinary scroll|native Tab|changed viewport geometry|active drag rotation|Chromium native touch' --output 'C:/Users/alexb/AppData/Local/Temp/lif-WP02-04A-geometry-c6815fdd91d94a62acbb54ed45899f6f/focused-regressions'
```

Observed running versions remain Chromium 156.0.8078.4, Edge 154.0.4258.62 and
WebKit 27.2. No branded D1/Firefox, physical-device or game/evaluator acceptance
is added. Art/catalogue, domain responses/IDs, shared configuration, ledgers and
other-author work were not changed. No commits or delegation. F1 correction is
ready for the same independent reviewer's narrow recheck; administrative
acceptance remains pending that review.

The earlier root-discovery warning is now historical: WP01 has updated the local
matcher to include `**/browser/**/*.spec.ts`, as recorded by the validator and
verified read-only here. This correction makes no root-harness change.
