# WP02-02A — Finished M1 art handoff

9 October 2026. Producer implementation complete; independent validation and
administrative acceptance remain with the Controller. No commit, delegation,
other-chat message, runtime experience/UI/state change or audio-record edit.
DEP-035 was released against WP02-01A commit `85d3641`.

Exactly **36 original finished SVG exports**, with editable byte-identical SVG
sources, now have measured ready M1 records. Total runtime art: **264,736 bytes**.
No paid tool, account, trial, downloaded asset pack, font or media service used.
The original art was authored in one serial visual family under the standard
build protocol; the explicit no-delegation assignment was respected.

## Delivery and exact mapping

For each relative filename below, editable source is
`assets/source/art/m1/<filename>`, runtime file is
`public/assets/art/m1/<filename>`, and the base-relative URL input is
`assets/art/m1/<filename>`. The ID column is the register/catalogue reference.
SVG markup is canonical single-line XML without a trailing newline, keeping byte
measurements stable under this checkout's core.autocrlf=true and on Linux.
The layered SVGs and formatted authoring JavaScript remain editable.
Every viewBox is `0 0 width height`. Sources and exports are identical bytes.

| Asset ID | Filename beneath either M1 root | Dimensions | Bytes |
|---|---|---:|---:|
| scene-village-green | scenes/village-green.svg | 960×600 | 32455 |
| scene-river-bridge | scenes/river-bridge.svg | 960×600 | 30887 |
| scene-whispering-library | scenes/whispering-library.svg | 960×600 | 28448 |
| scene-market-square | scenes/market-square.svg | 960×600 | 44273 |
| pip-idle | characters/pip-idle.svg | 300×320 | 5186 |
| pip-help | characters/pip-help.svg | 300×320 | 5216 |
| pip-celebration | characters/pip-celebration.svg | 300×320 | 5439 |
| rowan | characters/rowan.svg | 320×320 | 4965 |
| iona | characters/iona.svg | 320×320 | 5191 |
| nessa | characters/nessa.svg | 320×320 | 8306 |
| plank-1 | props/plank-1.svg | 88×88 | 2588 |
| plank-2 | props/plank-2.svg | 160×88 | 2594 |
| plank-3 | props/plank-3.svg | 232×88 | 2609 |
| plank-4 | props/plank-4.svg | 304×88 | 2597 |
| plank-5 | props/plank-5.svg | 376×88 | 2609 |
| plank-6 | props/plank-6.svg | 448×88 | 2609 |
| punctuation-tile | props/punctuation-tile.svg | 240×240 | 2571 |
| apple | props/apple.svg | 240×240 | 2739 |
| pear | props/pear.svg | 240×240 | 3625 |
| basket | props/basket.svg | 240×240 | 4048 |
| spellbook | props/spellbook.svg | 240×240 | 2839 |
| market-instructions | props/market-instructions.svg | 240×240 | 2926 |
| decoration-planter | props/decoration-planter.svg | 240×240 | 2824 |
| scarf-teal | props/scarf-teal.svg | 300×320 | 2677 |
| scarf-amber | props/scarf-amber.svg | 300×320 | 2692 |
| scarf-plum | props/scarf-plum.svg | 300×320 | 2677 |
| flowers-coral | props/flowers-coral.svg | 240×240 | 5584 |
| flowers-gold | props/flowers-gold.svg | 240×240 | 5569 |
| flowers-violet | props/flowers-violet.svg | 240×240 | 5599 |
| scarf-leaf | props/scarf-leaf.svg | 300×320 | 2734 |
| planter-rim | props/planter-rim.svg | 240×240 | 2891 |
| river-fish | props/river-fish.svg | 240×240 | 2652 |
| world-map | ui/world-map.svg | 640×420 | 15114 |
| hall-marker | ui/hall-marker.svg | 240×240 | 4026 |
| plot-socket | ui/plot-socket.svg | 240×100 | 2481 |
| control-surround | ui/control-surround.svg | 240×88 | 2496 |

[Measured manifest](../../../assets/source/art/m1/manifest.json) retains per-file
SHA-256, all layer IDs, viewBoxes and complete source→runtime→ID mapping.
[Required runtime art](../../../assets/source/art/m1/required-runtime.json) is the
36 ready M1 art paths only. WP01 still derives its complete runtime set from the
register, including later ready audio. Neither source, scripts, preview nor
evidence belongs in public exports/precache.

## Layer and placement contract

All IDs are prefixed with the full asset ID, including gradient and title IDs.
Each scene has `-background`, `-middle`, `-landmark`, `-foreground`, `-initial`;
result groups have exact catalogue result suffixes and matching `data-result`.
Depth planes carry atmospheric hills/trees, ground/action planes and sparse
foreground foliage. Persistent landmark artwork occupies the middle plane;
the `-landmark` group owns conditional initial/result artwork. Keep their authored
order; do not move the conditional group behind the persistent building.

| Scene / authored group | Initial rendering | Committed result rendering |
|---|---|---|
| `scene-village-green-village-welcome` | Plain village; support poles | Bunting and lit home windows |
| `scene-village-green-planter-available` | No plot sockets | Three empty plots; child IDs `scene-village-green-plot-1`, `-plot-2`, `-plot-3` |
| `scene-river-bridge-bridge-restored` | Broken timbers and interrupted rail | Joined timber deck and continuous arched rail |
| `scene-whispering-library-library-restored` | Sleeping windows, closed doorway | Warm windows, open door, light and unfurled spellbook |
| `scene-market-square-market-stocked` | Empty crates/basket | Apples, pears, basket contents, bunting and flower accent |
| `world-map-route-to-library-market` | Plain illustrated route | Dotted route toward library/market |

Result groups ship with `style="display:none"`. From committed facts, remove
that display rule for the corresponding result group; hide the scene's
`[data-state="initial"]` group when its primary restoration applies. Always
start from clean source or explicitly reset all conditional groups on profile
change. `planter-available` is separately selectable; never infer it from art or
mint saved flags. `route-to-library-market` belongs to the map. The independent
`market-instructions` scroll is the Q2 handoff visual. No extra scene fetch is
needed. The preview demonstrates projection only; **WP02-06A alone owns
resolveWorldView and committed state mapping**.

Use `assetUrl(runtimePath)` for fetches. Fetch/parse the trusted local SVG when
layer selection is needed; `<img>` alone cannot address its internal groups.
If inlining two copies of one export into one DOM, namespace all IDs and their
references per instance. The preview isolates each transformed SVG in its own
blob image, so comparisons cannot collide. Preserve aspect ratio, use `contain`,
and do not crop scene edges/foreground. No text is baked into runtime artwork.
Native labelled controls, DOM numbers/punctuation and instruction panels remain
consumer work. Use empty alt/aria-hidden next to equivalent DOM descriptions.

Scene action regions are around bridge `(245,295)–(737,416)`, library
`(300,225)–(650,455)`, market `(245,285)–(715,432)`. The quiet instruction area is
beside the scene, or below it in portrait, as demonstrated by the preview; it is
not a blank swath embedded into the art. Three village socket centres are
`(310,468)`, `(490,468)`, `(668,468)`; size/label the DOM hit regions independently
to at least 44×44 CSS px. Place a planter at any one socket, e.g. a 120×120
instance with bottom baseline around scene y=480, keeping all three choices free.
These are art anchors, not a new hotspot/state API.

Pip poses and scarf exports share **300×320** coordinates. Overlay one free scarf
colour at `(0,0)` at the same scale, then optional `scarf-leaf`; the opaque colour
scarf fully covers Pip's default teal scarf. Works on idle/help/celebration, whose
neck anchor is shared. Leaf embroidery remains an overlay, not a fourth colour.
Planter, flower variants and rim share **240×240** coordinates: planter → flowers
→ optional rim, all at `(0,0)` and equal scale. No offsets or per-colour fitting.
The leaf/rim are small transparent overlays by design, visibly inspected on their
target objects in the creative comparison. Entitlement/save logic is untouched.

Plank painted bodies are exactly `72*n` units long, at x=8, within an SVG width
`72*n+16` and height 88. Use one shared units-to-pixels scale for all six, or trim
the 8-unit side gutters before placement. Do not uniformly stretch each into an
equal-width card in an assessed length activity. Inventory contact sheets are
thumbnails; the preview's shared-scale timber section verifies real proportions.
Punctuation is a blank surround, and scroll/book pages intentionally leave space
for consumer live content. No answer marks, quantities or puzzle labels are drawn.

## Inventory-to-preview checklist and visual review

The development entry is
`assets/source/art/m1/preview.html` + `preview.tsx`/`preview.css`; it imports the
existing `tests/fixtures/host.tsx` **mountPanel** and platform **assetUrl**. No new
framework or shared-host edits. With the existing Vite config, start:

```text
node node_modules/vite/bin/vite.js --port 5178 --strictPort
http://127.0.0.1:5178/Learning-is-Fun/assets/source/art/m1/preview.html
```

| Required family | Exact evidence / rendering inspected |
|---|---|
| Village plain/welcome/three plots | [Normal, restored, static comparison](../../../assets/source/art/m1/evidence/comparison-village-green-1366.png) |
| Broken/joined bridge | [Normal, restored, static comparison](../../../assets/source/art/m1/evidence/comparison-river-bridge-768.png) |
| Library sleeping/lit/open/book | [Normal, restored, static comparison](../../../assets/source/art/m1/evidence/comparison-whispering-library-768.png) |
| Market empty/stocked | [Normal, restored, static comparison](../../../assets/source/art/m1/evidence/comparison-market-square-768.png) |
| Three Pip poses, three NPCs, reused avatars | [Cast and avatar crops](../../../assets/source/art/m1/evidence/characters-1366.png); also `characters-1024.png`, `characters-768.png` |
| Scarf colours/leaf, planter/flowers/rim | [Assembled overlays](../../../assets/source/art/m1/evidence/creative-1024.png); also `creative-1366.png`, `creative-768.png` |
| Six lengths, punctuation, fruit/basket, book/scroll, map/Hall, socket/control | [Inventory and common-scale timber](../../../assets/source/art/m1/evidence/inventory-768.png); also `inventory-1366.png`, `inventory-1024.png` |
| Four reused discoveries | [Discovery family](../../../assets/source/art/m1/evidence/discoveries-768.png): green→flowers-coral; bridge→river-fish; library→spellbook; market→apple |
| Quiet panels / portrait reflow | [1366×768](../../../assets/source/art/m1/evidence/preview-1366x768.png), [1024×768](../../../assets/source/art/m1/evidence/preview-1024x768.png), [768×1024](../../../assets/source/art/m1/evidence/preview-768x1024.png) |
| Comparison to accepted compact direction | [Reference rendered in same preview](../../../assets/source/art/m1/evidence/reference-1366.png) |

Every scene also has `comparison-<scene-id>-1366.png`, `-1024.png`, `-768.png`,
with all three states together. Actual final families were visually inspected,
including the individual portrait scene comparisons at readable resolution.
The reference's teal/forest/cream/coral/plum palette, bent timber silhouettes,
depth and quiet text space carry through. The production family adds roof-edge
light, shallow shadows, timber grain, foliage flecks, cream muzzles, stitched
scarves, wicker, clay highlights, character-specific clothing and expressions.

Concrete defects and corrections from the early preview:

- Village: broad facade/foliage felt too spare beside the reference. Added a
  round gable window, roof seams, masonry accents and restrained leaf highlights;
  checked welcome lights and plot anchors remain aligned in all states.
- Bridge: the first deep vertical plank faces read as a fence. Reduced deck
  projection, kept rail/board anchors on the arch, and inspected clear joined
  banks against the broken state. See retained `early-scenes.png` versus final.
- Library: checked the open door masks the closed door and the small spellbook
  sits on its shelf; static retains windows, door light and book with no motion.
  Iona's separate book extended beyond her portrait and was rescaled/repositioned.
- Market: checked bunting and stocked fruit sit in front of the crates without
  obscuring the stall silhouette; Nessa's separate basket/fruit were too low and
  clipped. Raised/rescaled them within 320×320. The complete signature props
  now fit all portrait sizes; `early-portrait-clipping.png` retains the defect.
- Equal-width inventory thumbnails could disguise the plank-length relationship;
  added a separate shared-scale timber view with live DOM labels.

Avatar references are exactly AVATARS: Pip→pip-idle; Rowan/Iona/Nessa→same named
portrait; flower→flowers-coral; apple→apple. No extra cast or avatar fetches.
For a 100px circular thumbnail, the preview uses a centred 143×153 Pip instance
offset (-14,-6); portraits use their square canvas centred at the top; flowers
use 148×148 offset (-24,-8); apple uses the complete square silhouette. Consumers
may use equivalent SVG viewBox crops, retaining ears/faces and the flower/apple
silhouette. Cropping is display-only, not another register row.

## Verification and limits

- `node assets/source/art/m1/measure-art.mjs`: **36/36** pairs equal, measured
  dimensions/viewBoxes/bytes correct, IDs unique and prefixed, local gradient
  references resolve, required scene layer IDs present, no script, remote/image
  dependency, event handler, animation or baked text. Manifest includes hashes.
- `node node_modules/typescript/bin/tsc -p assets/source/art/m1/tsconfig.preview.json`:
  **pass** (owned preview and its real imports).
- `node assets/source/art/m1/inspect-art.mjs`: **pass** at 1366×768, 1024×768,
  768×1024, Playwright **Chromium 156.0.8078.4**, browser sandbox enabled,
  reduced-motion preference enabled. All four initial states differ from
  restored; restored/static decoded scene pixels match at all three sizes.
  81 displayed images per viewport, zero broken images, console/page errors or
  horizontal overflow. Every preview control is ≥44px wide and 48px high.
  [Machine results](../../../assets/source/art/m1/evidence/browser-checks.json).
- The first pixel comparison included the overlaid DOM state caption, so its
  hashes differed. This was a fixture comparison error, not a scene defect;
  the final check compares decoded scene pixels at rendered size without captions.
- Browser sandbox execution exited before opening a page. The same local check
  succeeded under the normal user via approved escalation, keeping Chromium's
  sandbox on. No browser installation or security setting was changed.
- `node node_modules/vitest/vitest.mjs run tests/experience/catalogue.test.ts src/platform/assets.test.ts`:
  **46 passed, 1 obsolete assertion failed**. At catalogue.test.ts:187–192 the
  frozen producer test still asserts all 71 records are planned/pending, have no
  measurements, and the ready set is empty. Finished-art readiness necessarily
  invalidates that planning-only expectation. This task does not own that test.
  Controller/catalogue owner should preserve ID/path checks, assert 36 measured
  ready M1 SVGs/confirmed originals, and keep 7 audio + 28 M2 rows planned until
  their producers deliver. No production readiness was rolled back to satisfy it.
- `git diff --check` for owned paths: pass. Other workers' files preserved.

This is finished asset/early-preview evidence, **not D1 Chrome acceptance**,
WebKit/Safari/physical-tablet evidence, child testing, gameplay/state/accessibility
acceptance or publication. T1/T2-sized Chromium viewports prove only this asset
layout; no touch-input claim. No production build or runtime integration was
claimed because those are separate owners/stages. WP02-06A/07A assembly and
WP02-12A/WP06 published observations may return asset causes for correction.

Original-author/project-use statement and actual tool provenance are retained in
[PROVENANCE.md](../../../assets/source/art/m1/PROVENANCE.md). No invented CC0/GPL
licence or external attribution. Assets are ready; the register writer can pass
serially to WP02-03A after Controller acceptance. No shared package/status or
dependency records were changed by this producer.
