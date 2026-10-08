# WP02-01A implementation handoff

Implemented 9 October 2026 under GLOBAL_RULES current execution authority and
the explicit WP02-01A assignment, after DEP-003/004 release. Independent
validation, administrative acceptance and commits remain Controller-owned.

## Files and frozen handoff

- `src/experience/types.ts`: pure readonly Scene/Quest/WorldResult IDs,
  SceneDefinition/QuestDefinition, WorldProgress/WorldView/typed hotspots,
  CreativeState/CreativeChoice, asset/permission and avatar definitions. Imports
  WP03 ActivityBindingId/LearningRouteIntent and WP05's entitlement element type;
  no duplicate state, learning, reward or preference DTO/runtime.
- `src/experience/catalogue.ts`: seven SCENES, Q1–Q10 QUESTS, eighteen derived
  WORLD_RESULTS, five COSMETICS, complete CREATIVE_CHOICES, six AVATARS, seven
  transient DISCOVERIES, four derived STORY_DISPLAYS and empty initial progress/
  arrangement. All references resolve to planned export rows.
- `src/audio/contracts.ts`: exact DEC-026 AudioPreferenceIntent and synchronous
  LiveAudioGate.applyLiveIntent only. WP04 owns the full preference snapshot,
  generations/queue/ack/retries; WP02-05A supplies audio/speech later. DEC-020's
  first/read-failed silence, explicit resume and local-English speech preserved.
- `docs/art-direction.md` and its required companion
  `docs/art-direction-reference.svg`: concrete storybook material/cast/landmark,
  tokens/control/accessibility/audio/rights brief and one original static sample.
  The SVG is documentation, never a runtime export or premature production scene.
- `assets/asset-register.json`: version 1 with embedded Draft 2020-12 per-export
  schema, readiness/provenance rules and 71 planned exports (36 M1 SVG, 7 M1 WAV,
  28 M2 SVG). No fabricated measured metadata, confirmed authorship or file
  existence. The current ready-runtime set is empty.
- `tests/experience/catalogue.test.ts`: 20 focused static/contract/contrast tests
  and compile-only negative readonly/finite-ID/audio-channel examples.

Concrete entitlement IDs are `scarf-leaf`, `planter-rim`, `home-trim`,
`scarf-star`, `scarf-wave`, matching choice IDs in a separate field. WP05 binds
them to accepted 20/60/150/300 outcomes; both star/wave use 300. No thresholds or
point calculations are in the production catalogue. Free colours/decorations
remain null-entitlement choices. Null pattern/rim/trim is plain; the dormant
initial flower colour is coral with six null placement keys. WP04 validates M1
one planter/three sockets, M2 reusable six types/sockets, Q3 and entitlements.

The exact graph is Q1→Q2→Q3; Q3→Q4→Q5 and Q3→Q6; Q5+Q6→Q7→Q8→Q9→Q10.
Q5/Q6/Q10 explicitly stay M2 while revisiting M1 scenes. Result facts derive
from committed quest membership; no mutable restoration booleans. Permanent
completedQuestIds/completedStoryBindingIds start empty, survive compaction/
reload/backup/upgrade and are written only by WP04. WP03 owns binding identity,
role/availability and required success; optional-transfer/revisit/practice
success cannot complete required story bindings. Shelf entries derive from
Q2/Q6/Q7, invention from Q4; discoveries have no saved completion.

## Criteria and executed evidence

| Child criterion | Evidence / bounded disposition |
|---|---|
| 1 — one-way importable contract | App/Node/worker typecheck, fixture typecheck and import-direction/purity fixture passed. No state/UI/controller import. |
| 2 — free direction and accessibility contract | Brief retains system fonts, 18px/16px text, ≥44px targets, 200% reflow, tap AND keyboard routes, source/rights fields. These are downstream implementation targets. |
| 3 — owners/matrix/read-aloud/adult meaning | Brief names DEC-005 D1–T2, WP01/WP06, WP03 assistance, WP04 deliberate entry/preferences and localService/text fallback; no certification/authentication claim. |
| 4 — downstream acceptance | Real art/audio/widget/runtime/game acceptance reserved to named children/WP02-12A/13A/WP06. |
| 5 — exact graph/count/availability | Literal seven-scene/ten-quest fixtures, graph traversal and M2 revisit assertions passed. |
| 6 — cosmetics/restoration/staged assets | Eighteen unique single-producer result IDs, five concrete associations, free choices and all asset references checked; all exports planned. |
| 7 — tokens/reference/states/motion | Eight computed contrast pairs passed; static sample rendered and visually inspected; brief specifies normal/selected/focus/feedback plus reduced-motion alternatives. |
| 8 — DEC-034 durable binding set | DTO/round-trip/empty-set/negative readonly fixtures and explicit WP03/WP04 handoff above. No compactable history dependency. |

Successful commands used bundled Node 24 at
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`:

1. `node node_modules/typescript/bin/tsc -b` — app/Node/worker passed.
2. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/experience/catalogue.test.ts` — focused fixture and negative type probes passed.
3. `node node_modules/vitest/vitest.mjs run tests/experience/catalogue.test.ts` — 1 suite, 20 tests passed.
4. Headless Chromium via installed `@playwright/test` loaded the local reference
   SVG and captured 1200×800. No SVG parse error or unresolved use reference.
   Screenshot visually inspected: no clipped/overlapping text; cream reading
   surface, fox silhouette, timber/river landmark, three depth planes and labelled
   states coherent. The initial render command imported uninstalled `playwright`
   and failed before rendering; corrected to the existing `@playwright/test`
   package without installing/editing dependencies. This is reference QA only.
5. Owned-path `git diff --check` and explicit owned-file trailing-whitespace
   scan passed. Unrelated reward/status changes were preserved; no commit/staging.

Measured ratios: ink/paper 10.83, secondary/paper 5.85, paper/teal 6.24,
ink/amber 6.56, plum/paper 6.20, forest/success-paper 7.91,
ink/support-paper 9.60, teal/amber focus 3.78. Tests assert unrounded ≥4.5 text
and ≥3 boundary, then pin displayed two-decimal values. The brief links W3C
contrast, enhanced target and dragging guidance checked on 9 October 2026.

Reference raster evidence (outside the repository):
`C:/Users/alexb/.codex/visualizations/2026/10/08/01a11dc0-7d18-7262-96b0-017e40560fd7/WP02-01A-reference.png`.
The persistent, portable source is `docs/art-direction-reference.svg`.

## Ownership transfer and limits

Initial register remains single-writer WP02-01A until administrative acceptance;
then hand it exclusively to WP02-02A → WP02-03A → WP02-08A. Art/audio sources may
be authored independently as specified, but register integration is serial.
WP01 derives runtime inventory from unique ready paths filtered to delivered
milestone (M2 includes M1), not from planned rows. Scene files contain result
layers; avatar crops reuse source exports, never count as additional files.

Additional bounded reads: WP02-02A/03A/08A producer file conventions, finite
inventory and audio outputs were necessary to assign compatible source/runtime
paths; WP05-02A confirmed threshold ownership with no prior concrete entitlement
names. No signed-off package conflict found or shared rule invented.

No media exports, renderer, state/selection/reward implementation, preference
runtime, schema-validation engine or broad regression/game journey was added.
Embedded-schema structure and inventory are tested; truthful ready provenance,
actual export measurements, file checks and PCM loop inequalities remain the
future producer's obligations. Static reference QA does not prove real keyboard/
touch/reflow, tablet/child testing, acoustic quality or offline readiness.
No config, shared package/status, durable instructions, commits, delegation or
other-chat messages were changed/performed.

## Owner correction — 9 October 2026, planned-to-ready inventory lifecycle

Controller authorized this bounded continuation after WP02-02A supplied 36
ready M1 SVG exports for independent art review. Reproduced the obsolete
`asset.status === 'planned'` assertion at catalogue test line 187: expected
planned, received ready. This was a historical test expectation, not an asset
or producer-contract defect. The original all-planned evidence above describes
the initial handoff only.

Changed only `tests/experience/catalogue.test.ts` and this appended section.
The inventory check now permits planned/ready states. Planned rows still forbid
all measured fields and retain pending original permission. Ready rows require
nonempty existing editable sources/runtime files, exact file-byte agreement,
positive safe-integer bytes/dimensions, a non-placeholder author and retained
original permission evidence or exact reused licence/version/URL/file. SVG
record dimensions must match the runtime root viewBox. Future ready audio rows
require 44.1kHz/positive frame counts and valid exclusive loop-frame bounds.
Unsafe/traversing file paths are rejected; ordinary spaces in evidence filenames
remain permitted. Existing ID/count/reference/base-path/schema checks are retained.
No fixed ready count is asserted, so later audio/M2 acceptance can advance the
same lifecycle without rewriting this early catalogue test.

At verification the register contained 36 ready M1 SVGs and 35 planned rows
(seven audio, 28 M2 SVG). Successful bounded checks, using the same bundled Node:

1. `node node_modules/vitest/vitest.mjs run tests/experience/catalogue.test.ts`
   — 1 suite, all 20 tests passed, including measured file/viewBox evidence for
   the actual 36 ready exports.
2. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/experience/catalogue.test.ts`
   — focused no-cache typecheck passed.

No register/asset/source/config/ledger edits, commit or delegation. These are
inventory-consistency checks, not independent visual acceptance, SVG rendering,
audio decoding/PCM verification, listening or proof of legal rights. Those
producer/validator obligations remain unchanged.
