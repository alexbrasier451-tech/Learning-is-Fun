# WP02-08A — independent M2 artwork validation

11 October 2026. **PASS at the SVG export/preview producer boundary.** All 28 M2
exports meet the accepted M1 visual/rights rubric and frozen scene, result and
creative contracts. No producer correction is required. Actual world/creative
composition and published acceptance remain downstream.

Reviewed under [WP02-08A](../chunks/WP02-08A.md), the accepted
[art direction](../../art-direction.md), retained
[M1 validation](WP02-02A-VALIDATION.md), frozen WP02-01A catalogue and the
[human continuation authority](CONTINUATION-AND-MUSIC-VARIATION.md). The latter
permits M2 construction before final listening; this review adds no acoustic
acceptance. No full M1 or dependency audit was repeated.

## Exact frozen identity

Candidate:
`C:/Users/alexb/Documents/ChatGPT/Learning is Fun/artifacts/wp02-08a-20261011/candidate`.
Private base: `9485a2cf67b0703deb4efa6c178602dc7952f705`.

The following SHA-256 identities were independently checked against actual bytes:

| File, relative to the candidate's parent unless prefixed | SHA-256 |
|---|---|
| `freeze.json` | `25a2d279d3486059fe96c05b542a335cf153572d8f880ae44aa2a7173b048925` |
| `art-only.patch` — 7,636,836 bytes | `de1f27b2174f8aec9321aa76bf867769c5495f726d7d0a6887115bb5558fbd50` |
| `art-only-files.json` — 101 files | `4025d630147aa98481744ae84cc9a1e39f1ec85df2d5a247d0cb2cf064abdc82` |
| Candidate `assets/source/art/m2/manifest.json` | `e975ed491767616f8e4ca3c4afe272827813790aa1fc10a9022301c1ecc3519c` |
| Candidate `assets/source/art/m2/asset-register.delta.json` | `df26e12fe5e7e039b2d6c0aff9516bd715b09f7cc37c1fa04ab3dfd5b208c3a4` |
| Candidate `assets/source/art/m2/bindings.json` | `7f81008e86acf85f0fb18232d248d4b967264dc85bf7c1e9cc49c62bebfb7cb4` |
| Candidate `docs/work-package/execution/WP02-08A-HANDOFF.md` | `1b03ddaef21bc6b57cfaf3a8c936ebb52dcdebdf2a81dfb8c26bb19cca57ddb9` |
| Candidate `assets/source/art/m2/evidence/overview-three-scenes.png` | `f0fa3b48558e2b824fb9e10d3dd238a7f5bb0ae6faabfda7a0b740a985a4b8b1` |

All 101 manifest paths, byte counts and hashes match. Read the patch itself:
exactly 101 additions under owned M2 source/runtime paths and the handoff, no
deletions or whole-register patch. Its path set equals the file manifest.
Producer's private patch-application receipt was inspected; this reviewer did
not run Git or claim a fresh patch application.

Independently compared all 654 inherited files directly with `baseline.zip`:
no deletion, and the only changed inherited file is the private register.
Parsed comparison proves its top-level schema/order and all 44 non-M2 rows,
including seven audio rows, are unchanged. `expectedBefore` equals the archive's
28 planned M2 rows, and replacing only those IDs with `records` reproduces the
private register. Inherited M1 artwork, saved cosmetic IDs and audio bytes have
no drift.

**Integration scope:** merge only the accepted 28-row M2 delta after checking
`expectedBefore`. Preserve Controller's newer music at `9301069` and all other
current rows. This candidate's older unchanged music is valid baseline context,
not a defect to send back to the art author. Never copy its complete register
over main.

## Export integrity, rights and reproduction

All **28 source/runtime SVG pairs are byte-identical**, totalling **196,292
runtime bytes**. Fresh independent checks confirmed each manifest SHA-256,
dimension, viewBox, row byte count and source/runtime path. All 28 parse as XML.
IDs are unique within each export and correctly prefixed; every local gradient
reference resolves. Declared layers exist. No scripts, animation elements,
foreignObject, raster dependencies, external references or baked text appear.

The set contains seven 960×600 scene/overlay exports plus 960×600 home trim,
one 320×320 Orin, six 320×320 activity surrounds, eleven 240×240 story/discovery/
decoration props, and two 300×320 scarf patterns. The inherited planter supplies
the sixth decoration type. The manifest records the complete per-export
inventory and measured hashes; no additional runtime helper asset is needed.

Read the authored builder, palette usage, preview and measurement logic.
Independently executed the builder's generation logic in memory, replacing
filesystem writes with byte comparisons and directory creation with a no-op.
All **56 source/runtime destinations reproduced exactly**. Candidate files were
not rewritten; final hashes of all 101 frozen files still match.

Every new row has confirmed original authorship/project-use evidence pointing
to `assets/source/art/m2/PROVENANCE.md`, with measured ready metadata and actual
retained source. The statement accurately describes project-original,
AI-generated SVG extending the accepted M1 family, without fabricated human
authorship, exclusivity or CC0/GPL grants. No new third-party artwork or paid
asset dependency was found.

The required-runtime delta is exactly the 28 exports. The complete path list is
72 unique ready paths: 37 inherited M1 SVGs, 28 M2 SVGs and seven audio paths.
Preview/source/evidence helpers are excluded. This path list does not validate
the newer integrated audio measurements or prove publication/precache success.

## Independent visual judgment

Actually opened and inspected the final overview, all **15 comparison PNGs**
(five compositions × 1366/1024/768 viewport widths), cast/creative/props panels
at all three widths, and the three initial viewport screenshots. These are
actual retained Chromium renders, not inferred appearance from hashes. The
superseded `early-overview.png` was not used as final evidence.

- **Workshop:** timber wheel, riverside plaster/wood building and supplies form
  a distinct landmark. The initial wheel lacks paddles; restored paddles, warm
  window, increased timber and separate miniature invention give a visible
  change. The main wheel/building remains readable in tablet comparisons.
- **Forest:** the leafy arch and winding pale path are distinct from the built
  locations. Initial branches obstruct the path; the restored route is clear,
  with restrained flowers/stones and a separately addressable highlighted gear.
  Foliage and foreground details preserve depth without covering the route.
- **Castle:** stepped towers and the large clock aperture remain identifiable
  in landscape and portrait. Clock illumination, open entrance and finale
  banners are legible changes. The clock area is clear of bunting, hands,
  numerals and marks; the lowered pennant fits the canvas.
- **Green/library:** garden, marker, facade/finale and shelf overlays align with
  unchanged M1 bases. Doors/windows and foreground space remain usable. The
  three small story-display examples rest within the shelf area; their visual
  scale is decorative, not a claim of adequate interactive hit-target size.
- **Cast:** Orin's teal coat/cap, grey beard and brass key read clearly beside
  Pip, Rowan, Iona and Nessa. Orin is the sole new named character; the full
  portrait fits its viewBox and the documented face crop retains cap/beard.
- **Creative family:** planter/tree/bench/lantern/banner/pond have distinct,
  finished silhouettes and consistent ground shadows. Six example sockets are
  seated correctly without duplicating the three inherited rims. Star/wave
  embroidery stays on the shared scarf beside inherited leaf; facade trim
  follows the original roof and windows.
- **Educational surrounds:** array, potion, book, story, map and clock frames
  are intentionally blank content surfaces. They are finished surrounds, not
  placeholder artwork. Decorative gear teeth and recovered map/book pictures
  are story art; no assessed quantities, clock values or labels are baked in.

The warm paper/wood/cloth palette, rounded shapes, modest texture and depth
match the accepted M1 family. No visual producer defect was found. Initial and
restored states differ, while static/reduced-motion examples preserve the same
restored facts. Portrait comparisons retain whole landmarks rather than crop
them; the quiet instruction area moves below the scene in the portrait fixture.

## Consumer contract checks

Programmatically cross-checked the handoff matrix against the frozen
`SCENES`, `QUESTS`, `WORLD_RESULTS`, `COSMETICS`, `CREATIVE_CHOICES`,
`STORY_DISPLAYS` and `DISCOVERIES`. All Q4–Q10 result and required asset IDs
resolve; Q10 has separate green/castle overlays. Every specified show/hide
layer exists, with result groups initially hidden and carrying the exact
`data-result`. The three new scenes have background/middle/landmark/foreground/
initial groups. Forest path and gear, and castle illumination and entrance,
are separately addressable groups.

The handoff is complete enough for WP02-10A/11A to compose:

| Consumer concern | Supplied contract |
|---|---|
| Q4 | Workshop initial/restored layers; independent `sawmill-model` placement |
| Q5 | Garden overlay on green; marker prop and placement |
| Q6 | Shelf overlay on library; separate story-map prop/display |
| Q7–Q8 | Forest path/gear groups; tale and reusable gear props |
| Q9–Q10 | Clock/open groups; independent green/castle finale overlays |
| Creative plot | Six type IDs, six socket IDs/centres, source-ground alignment and inherited-rim rule |
| Cosmetics | Home trim (960×600), star/wave (300×320), zero offsets and pattern stacking order |
| Displays/discoveries | Q2/Q6/Q7 shelf requirements, Q4 invention, one existing-ID discovery per new location |
| Live task content | Explicit safe rectangles/radii, including castle centre (490,233), radius 52 |

Use 960:600 `contain`, reset conditional groups when profile/scene changes, and
derive visibility from committed facts. The preview intentionally reveals all
applicable results together; it is not the implementation of individual quest
or entitlement gating. Keep Q3 decoration availability independent of Q5 garden
art, apply one earned scarf pattern after the selected colour, and namespace
IDs/references if SVG instances are inlined together.

## Evidence limits and downstream work

Inspected the producer's native preview script and frozen Chromium
156.0.8078.4 receipt: three viewports, 92 displayed images each, no broken
images/errors/external requests/horizontal overflow; initial pixels differ and
restored/static pixels match for all five compositions. These are retained
producer browser measurements, with independent visual inspection and fresh
source checks here. No fresh browser session, actual touch or branded-browser
acceptance is claimed. No additional preview rerun was needed to resolve a
source/visual uncertainty.

WP02-10A/11A must validate actual committed-state composition, reset/isolation,
live assessed diagrams, readable labels/hit targets, shelf/cosmetic gating and
saved placements. WP02-13A/WP06 must check actual published appearance and
browser/device/accessibility behaviour; asset defects can return to the author.
WP01 owns publication/offline inclusion. Physical tablet, WebKit, child testing,
gameplay, persistence and audio are outside this producer PASS.

Only this main validation report was written. No source fix, main registry
mutation, broad build/dependency audit, Git operation, deployment, worker or
other-chat message was performed. Frozen candidate identity is preserved; the
independent reviewer returns idle.
