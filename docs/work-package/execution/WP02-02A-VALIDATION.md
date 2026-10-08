# WP02-02A — Independent finished-art validation

9 October 2026. Independent report-only review of the completed M1 artwork,
accepted WP02-01A direction/catalogue and WP02-02A handoff. The reviewer did not
author or alter the artwork, register, preview, tests, production source or shared
execution records. Administrative acceptance and any commit remain Controller-owned.

## Verdict

**PASS for the finished M1 asset handoff and bounded early-preview layout scope.**
All 36 required exports exist, match editable sources and measured records, and
form a coherent finished illustrated family. No substantive asset defect was
found that invalidates WP02-02A criteria 1–5 within this delivery boundary.

This does **not** establish branded Chrome D1 acceptance, the complete D1–T2
matrix, integrated gameplay/accessibility, physical-tablet behaviour, publication,
offline readiness or acoustic quality. Chromium at 1366×768 is desktop layout
evidence only. Those explicitly separate acceptance stages remain outstanding.

The planning-only catalogue assertion identified in the producer handoff was
present at the review's first read. Its owner corrected it during this review,
before the independent focused test run: **47/47 tests now pass**. That correction
and its separate catalogue review do not replace the artifact checks below.

## Bounded inputs and inspected implementation

Read WP02-02A in full; WP02-02A-HANDOFF; WP02-01A contract/handoff;
`docs/art-direction.md`; the rendered compact reference; GLOBAL_RULES execution
authority; DEC-003/005/019/021/027; and the Q1–Q3/creative target sections of
WP02-06A/07A. Read the catalogue, current register, manifest, required-runtime
list and provenance. Inspected the authoring, measurement and browser inspection
scripts, preview HTML/TSX/CSS/configuration and actual source/runtime SVGs.

Additional bounded causal reads were the existing fixture `mountPanel`, platform
`assetUrl`, Vite/Vitest configuration, and the catalogue/platform tests. These
establish preview ownership/base-path behaviour, avoid shared cache writes and
localize the known obsolete test expectation. No domain/state implementation or
broad build/regression scope was opened.

## Criteria and substantive assessment

| Criterion | Result and evidence |
|---|---|
| 1 — finite inventory and reuse | PASS. Four scenes, six character exports, six planks, punctuation tile, fruit/basket, book/instructions, planter, three scarf colours, three flower colours, leaf/rim overlays, river fish, map/Hall/socket/control total exactly 36. All six AVATARS and four M1 DISCOVERIES resolve to these existing exports. Seven Q1–Q3 result facts resolve to ready assets. No extra cast, avatar export or fetched duplicate scene. |
| 2 — coherent finished artwork and early layout | PASS at the bounded Chromium dimensions 1366×768, 1024×768 and 768×1024. Inspected actual comparison images, cast, avatar crops, creative assemblies, shared-scale timber, inventory, discoveries and reference. Fresh non-scene section captures at all three sizes are byte-identical to retained evidence. D1 browser acceptance is not claimed. |
| 3 — visible restoration, static result and usable portrait arrangement | PASS for authored assets/preview. Every scene's initial pixels differ from restored; restored/static decoded pixels match at each of three sizes. Portrait reflows the quiet panel beneath the scene, without shrinking controls. All seven preview buttons remain at least 57.6875px wide and 48px high. Puzzle content remains outside runtime artwork. Integrated native hotspots, assessed objects and committed-state projection remain consumer work. |
| 4 — local exports, mappings, measurements and rights | PASS. 36 byte-identical source/runtime pairs; 264,736 bytes total; manifest SHA-256, dimensions and viewBoxes match actual files and register rows. Exact ready-runtime set matches the directory. All 36 are confirmed original project outputs with retained provenance. No script, remote/font/image, editor namespace or editor-only filter dependency. Preview fetches use assetUrl and emitted no remote request. |
| 5 — finished export/preview closure | PASS for producer handoff. Evidence and placement/layer contracts are sufficient for consumers to begin. Later WP02-06A/07A assembly and WP02-12A/WP06 observations remain separate and may return producing-owner corrections. |

### Visual findings by family

The artwork meets the accepted modest storybook direction. It is deliberately
geometric vector illustration, with restrained gradients and repeated landscape
motifs; it is not a textured painted-media claim. Timber grain/highlights,
cream walls and muzzles, stitched cloth, wicker and clay are consistently drawn.
The four central landmarks remain distinct against the shared hills, trees and
sparse foreground. Repetition reads as one village family, not mismatched stock
or unfinished placeholders. Edges and layer registration are clean at inspected
sizes; there are no emoji stand-ins or clipped signature props.

| Family / inspected evidence | Concrete judgment |
|---|---|
| [Village comparison](../../../assets/source/art/m1/evidence/comparison-village-green-768.png) | Plain home changes to lit windows and bunting; three plot sockets appear on clear ground. Window/roof/bunting alignment is sound. The Hall direction marker remains visible. |
| [Bridge comparison](../../../assets/source/art/m1/evidence/comparison-river-bridge-768.png) | Broken bank ends become a continuous arched timber crossing with a continuous rail. The deck now reads as a crossing, not a fence. River and foreground reeds remain legible. |
| [Library comparison](../../../assets/source/art/m1/evidence/comparison-whispering-library-768.png) | Sleeping windows and closed door become warm windows, an open dark doorway and visible spellbook/light. Closed-door art does not show through. The small book is a secondary cue; doorway/windows carry the result at small scale. |
| [Market comparison](../../../assets/source/art/m1/evidence/comparison-market-square-768.png) | Empty crates/basket become visibly stocked, with bunting and a flower accent. Fruit silhouettes are distinct; bunting crosses part of the crates but does not conceal the stocked result or stall shape. |
| [Cast and avatars](../../../assets/source/art/m1/evidence/characters-1366.png) | Pip's idle/help/celebration are readable; Rowan's apron/ruler, Iona's plum/book and Nessa's shawl/basket differentiate the cast. Full portraits contain their props; circular crops preserve recognizable faces and the flower/apple silhouettes. |
| [Creative assemblies](../../../assets/source/art/m1/evidence/creative-1024.png) | Three scarf colours and flower choices remain visually distinct. Leaf embroidery and the decorated rim align with their parent objects. Additional fresh in-memory renders checked all nine pose × scarf-colour combinations with leaf overlay: no leaked default scarf, displaced neckline or clipped embroidery. |
| [Inventory and common-scale planks](../../../assets/source/art/m1/evidence/inventory-768.png) | Six lengths retain one shared scale in the dedicated timber section. XML body widths are exactly 72, 144, 216, 288, 360, 432 units, with consistent gutters/height. Equal-width inventory thumbnails must not become assessed length representations; the handoff correctly says so. Punctuation remains blank, and book/scroll leave space for live content. |
| Map/Hall and [discoveries](../../../assets/source/art/m1/evidence/discoveries-768.png) | Local illustrated map and Hall entrance are coherent with the scenes. The route overlay has the exact catalogue result ID. Flowers, fish, book and apple support the four transient discoveries through reuse. No scored discovery state is introduced. |
| [Portrait layout](../../../assets/source/art/m1/evidence/preview-768x1024.png) | The scene retains its aspect ratio above the cream panel; labels wrap and actions retain full hit areas. This is useful early layout evidence, not proof of the eventual game's navigation or text-resize behaviour. |
| [Accepted reference](../../../assets/source/art/m1/evidence/reference-1366.png) | Production keeps the reference's warm timber, cream/coral/plum/teal palette, shallow depth, fox identity and separated quiet instruction space, with added craft detail. |

Additional in-memory scene probes placed a plank against the river, a blank tile
against library ground and a basket against market ground. Their outlines and
silhouettes remain distinguishable. A separate village probe assembled
planter/flowers/rim at all three supplied anchors, using 120×120 instances at
source coordinates x=310/490/668 and y=360: the pots sit on their authored sockets.
Displaying three together was a comparison fixture only; M1 still permits one
planter. These probes do not claim actual gameplay arrangement or hit testing.

## Independent commands and results

Used existing bundled Node **v24.19.0**, TypeScript **7.0.2**, Vitest **5.0.3** and
Playwright Chromium **156.0.8078.4**. No dependency installation or broad build.
Inline Node programs ran through PowerShell here-strings piped to
`node --input-type=module`; their checks are specified below. They did not invoke
the producer's writing measurement/evidence scripts.

1. **Read-only inventory program — PASS.** Read all 36 source/export pairs and
   register/manifest/required-runtime JSON. Asserted exact counts and unique
   IDs/paths, source-byte equality, manifest SHA-256, byte lengths, SVG root
   dimensions/viewBoxes, ready provenance evidence and all local URL references.
   Enumerated actual SVG tags/attributes: only browser-native vector markup,
   gradients and modest `feDropShadow`; no script/text/image/foreignObject,
   event attributes, href/src, animation, remote resource, DTD or entity. All IDs
   are unique within their export and prefixed. Required scene depth/initial
   layers exist. Directory membership equals the 36 required runtime paths.
   The other **35** records remain planned/pending with no measured fields:
   seven M1 audio and 28 M2 art rows.
2. **Read-only catalogue/layer program — PASS.** Imported the current pure
   catalogue with Node type stripping. Resolved six avatars, four discoveries,
   four scenes and all seven Q1–Q3 result facts. Checked the six authored scene/map
   result-layer IDs and exact data-result values, plus all six plank rectangles.
   `market-instructions` is the independent scroll export, as specified.
3. `node node_modules/typescript/bin/tsc -p assets/source/art/m1/tsconfig.preview.json`
   — **PASS**, exit 0; owned preview and real imports, no emit/incremental cache.
4. **Focused Vitest API invocation — PASS, 2 files / 47 tests.**
   `startVitest('test', ['tests/experience/catalogue.test.ts', 'src/platform/assets.test.ts'],
   {run:true, config:false, cache:false, maxWorkers:1, fileParallelism:false},
   {configFile:false, define:{__BUILD_ID__:JSON.stringify('local-unit-tests')},
   cacheDir:process.env.TEMP+'/wp02-02a-validation-vitest'})`, then `ctx.close()`.
   This uses the existing suites, disables the test cache and avoids shared Vite
   config/cache writes. The corrected catalogue contributes 20 tests.
5. **Fresh browser preview — PASS.** Programmatic Vite `createServer` used the
   existing React plugin, `/Learning-is-Fun/` base, localhost port 5189, a local
   review build identity, `configFile:false` and a private OS-temp cache. Opened
   the actual owned preview, decoded all images, selected every scene and each
   of Initial/Restored/Static result, and hashed decoded scene pixels without
   DOM captions. Ran at 1366×768, 1024×768, 768×1024 with reduced motion enabled.
   All **12 scene comparisons** passed. Per viewport: **81 images, 0 broken,
   0 console/page errors, 0 remote requests, 0 horizontal overflow**. Scene widths
   were 860.640625, 600.609375 and 724 CSS px; only portrait placed the panel below.
   Fresh characters/creative/inventory/discoveries/reference screenshots were
   held in memory and compared with the retained files: **15/15 byte-identical**.
   Browser contexts and server were closed afterwards.
6. **Fresh overlay/placement visual probes — PASS.** Rendered actual current SVGs
   as separate image instances in an in-memory document. Inspected nine Pip
   combinations and four scene placement probes as described above. No artifact
   or evidence image was written back to the repository.

Execution limitations/errors retained honestly: the first sandboxed preview
attempt crashed at `browserContext.newPage` before page inspection. Approved
normal-user execution succeeded with **Chromium's own sandbox still enabled**;
no security setting was changed. An initial attempt to return two large PNG
probes exceeded tool output capacity, so it supplied no reviewable image;
smaller JPEG captures were then successfully returned and inspected. These were
review transport/environment failures, not repaired production defects.

## Known catalogue assertion: precise disposition

At the first read, `tests/experience/catalogue.test.ts:187–192` required every
record to be planned, every original permission pending, every measurement
absent and the ready set empty. Those are obsolete WP02-01A initial-state
expectations once WP02-02A delivers finished exports. They invalidate that test's
continued readiness assertion, **not the art acceptance criteria**.

The required owner correction was to retain unique IDs, safe paths, reference
resolution, exact inventory and staged-record guards; branch planned versus
ready validation; and require concrete ready-file measurements and confirmed
rights/evidence. Never demote the finished art or simply remove artifact checks
to obtain green tests. The catalogue owner supplied that lifecycle correction
during this review. The current diff adds existing nonempty source/runtime and
rights-evidence checks, exact byte counts, measured SVG viewBoxes and applicable
audio metadata guards while retaining the planned no-fabricated-measurements
branch. The independent art program separately pins today's **36 ready / 35
planned** inventory, hashes and source equality.

No further catalogue production/test mutation is requested by this report.
The Controller's separate catalogue reviewer owns acceptance of that correction;
the producer handoff's historical “46 passed / 1 obsolete failure” should be
read with this later **47 passed** result. This reviewer did not edit the test.

## Reviewed identities and remaining limits

SHA-256 identities measured at the end of artifact checks:

| File | SHA-256 |
|---|---|
| `assets/asset-register.json` | `a21f03113c566a662ef1dd84f28646ae956a1e45296875625e7202943d5cd41e` |
| `assets/source/art/m1/manifest.json` | `a713cd7feed705e947adb4cbf8162590fd0939ded88ef7b12690b027cb4690ba` |
| `assets/source/art/m1/preview.tsx` | `56170a8a53cb3274c97357dbf1c572a79ffc8b3507e4131b234bd16bbfc1b34b` |
| `assets/source/art/m1/preview.css` | `5a286d81e4229e726fd8227782360f1b9e84b3652aba8d99ab8a43af0cc96ccd` |
| Corrected `tests/experience/catalogue.test.ts` | `d65af833024236a6af1200d872fd35173537f527f3a6f4eba9bbecc833201bbb` |

Original-rights validation checks the retained authorship/project-use statement,
the absence of imported media/dependencies in the inspected sources and the
truthful scope of the register. It is not a copyright eligibility/exclusivity
opinion. No invented CC0/GPL grant was found.

No branded Chrome/Edge/Firefox/WebKit run, touch/rotation interaction, physical
device, 200% text-resize acceptance, screen-reader journey, saved-state/profile
projection, sound/listening check, published build or service-worker cache test
was performed. Static pixel equality proves the result does not require motion;
it does not prove the eventual animation/cancellation implementation. Preview
controls and caption typography are development inspection UI, not acceptance
of final game widget typography. Runtime consumers must retain DOM labels,
native targets, common plank scale and per-instance SVG ID isolation.

Only this report was added to the repository by this review. No commit, worker,
other-chat message, shared ledger/configuration change or production fix was made.
