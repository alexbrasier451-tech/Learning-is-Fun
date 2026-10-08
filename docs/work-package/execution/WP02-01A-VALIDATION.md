# WP02-01A independent implementation validation

Review completed 9 October 2026. Reviewer: Codex, independent validator; not the implementation author on this scope.

**Verdict: ACCEPTED. Finding severity: NONE. Invalidated criteria: NONE.** Acceptance covers the early experience/audio contracts, static catalogue, asset-register structure and bounded visual direction. Controller owns administrative acceptance and dependency release.

## Authority and scope

Read the current execution authority in [GLOBAL_RULES](../GLOBAL_RULES.md), [WP02-01A](../chunks/WP02-01A.md), its named decisions in [DECISIONS](../DECISIONS.md), the [implementation handoff](WP02-01A-HANDOFF.md), all seven implementation/reference/test files listed below and the relevant neighbouring producer contracts. Current HEAD during review was `b9ecc846c724cb525e0f6ffc41f03ebc9e7d59bb`; this scope is uncommitted/untracked. Current execution authority supersedes historical planning-only restrictions in the child.

Bounded additional reads checked Q1–Q10 outcomes in WP02-06A/10A, creative facts in WP02-07A/11A, export conventions in WP02-02A/03A/08A, and audio ownership/consumption in WP02-05A and WP04-05A. Accepted learning and reward producer types were inspected directly. These reads establish compatibility; later implementations are not early-contract prerequisites. This validator writes only this report and preserves concurrent reward/status work.

## Acceptance assessment

| Criterion / contract | Independent conclusion |
|---|---|
| 1 — Pure, importable producer contracts | PASS. Experience types import only learning/reward types; the catalogue imports only local types. The audio port has no imports. No renderer, state facade, callback-bearing world DTO, educational evaluator or reward implementation is introduced. Readonly construction fixtures and negative type probes demonstrate consumer use. |
| 2 — Storybook direction, free workflow and interaction contract | PASS. The brief and reference give concrete paper/wood/cloth/clay materials, three depth planes, expressive cast, distinct landmarks, quiet reading surfaces and live instructional text. System fonts, original SVG sources and locally rendered PCM support the accepted free production scope. The brief specifies 44×44 CSS-pixel targets, 18px child/16px secondary text, 200% text enlargement, contrast roles, keyboard completion and separate tap/click selection-placement alternatives. Matching, sequencing, sorting, manipulation and selection each have explicit controls. |
| 3 — Authoritative matrix, read-aloud and adult meanings | PASS. DEC-005 owns the browser/device matrix; WP01 verifies actual local voice/data behaviour. Only English localService speech is permitted later, with visible text and unavailable-voice fallback. Assessed passage assistance remains WP03's responsibility. WP04 owns deliberate two-step adult entry. The brief claims neither device/accessibility certification nor authentication. |
| 4 — Downstream acceptance boundaries | PASS. The reference is direction evidence. Finished art/audio, interactive widgets, state commits, actual keyboard/touch/reflow behaviour and full adventure acceptance retain their producing children and WP02-12A/13A owners. No future M2 export or full-game journey is made a prerequisite for this closure. |
| 5 — Seven scenes, ten quests, graph and staged M2 | PASS. Scene IDs are exactly village-green, river-bridge, whispering-library, market-square, tinkers-workshop, storywood-forest and clockwork-castle. Quest/result references resolve. The acyclic graph is Q1→Q2→Q3; Q3→Q4→Q5 and Q3→Q6; Q5+Q6→Q7→Q8→Q9→Q10. Q4–Q10 are M2, including Q5/Q6/Q10 revisits to M1 scenes. Scene availability and quest availability are separately represented. |
| 6 — Restoration, cosmetic, creative and asset facts | PASS. All 18 result IDs have one producer quest and the accepted visible meaning. Restoration derives from committed quest IDs, without duplicate saved booleans. Five cosmetic IDs target the correct appearance fields and imported reward entitlement identities; reward thresholds remain WP05-owned. Free scarf/flower colours, six sockets, M1's one-planter limit and M2's reusable decoration types are explicit. Shelf/invention facts derive from Q2/Q4/Q6/Q7; discoveries are transient and unscored. Six avatars reuse M1 cast/props. Every declared asset reference resolves to a planned register row. |
| 7 — Concrete tokens, reference and control states | PASS. Eight computed contrast pairs match the brief. Normal, selected, focus, pending/disabled, retry and success meanings use labels/shapes as well as colour. Reduced motion supplies immediate static changes. Independent inspection of the rendered sample found a coherent fox/bridge/village illustration, clear depth and reading hierarchy, labelled controls and no clipped or overlapping important text. This is sufficient direction for independent art/widget producers. |
| 8 — DEC-034 permanent story-binding completion | PASS. WorldProgress imports WP03's ActivityBindingId and keeps completedStoryBindingIds separate from completedQuestIds and compactable encounter history; both start empty. The producer alias is a string, with the finite allowed binding set supplied by WP03's registry and enforced by WP04 validation. The handoff assigns binding/required-success authority to WP03 and sole committed validation to WP04. Optional-transfer, revisit and practice success cannot satisfy required story progress. |
| DEC-026 — Early synchronous audio port | PASS. AudioPreferenceIntent has the exact enable/exit-silence/silence-all, channel-mute and channel-volume variants, limited to music/effects channels. LiveAudioGate.applyLiveIntent returns void synchronously. WP04's applyLivePreferences callback binds this method; the installation preference snapshot, generations, queue and retries remain WP04-owned. The contract does not duplicate the saved preference DTO or implement playback. |
| Asset-register structure and readiness | PASS. There are 71 unique planned export records: 36 M1 SVGs, seven M1 WAVs and 28 M2 SVGs. Runtime/source paths align with producer inventories and are base-relative. Original rights remain pending with unassigned authors; no ready files, measured bytes/dimensions or audio frame values are fabricated. The embedded record schema distinguishes planned/ready metadata and original/reused permissions. Real file measurements, confirmed rights, PCM format and loop bounds remain future producer checks. Serial register ownership is explicit. |

The contrast checks use unrounded thresholds: 4.5:1 for normal text and 3:1 for the specified boundary pair. That agrees with [W3C Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html). The brief correctly adopts 44px as a stronger product target from the Level AAA [W3C Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html). Its tap/click and keyboard alternatives address distinct requirements described by [W3C Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). These are design targets, not conformance evidence for an implemented game.

| Pair | Computed ratio |
|---|---:|
| Ink / paper | 10.83:1 |
| Secondary / paper | 5.85:1 |
| Paper / teal | 6.24:1 |
| Ink / amber | 6.56:1 |
| Plum / paper | 6.20:1 |
| Forest / success-paper | 7.91:1 |
| Ink / support-paper | 9.60:1 |
| Teal / amber boundary | 3.78:1 |

## Independent verification

Used bundled Node at `C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

- Fresh `node node_modules/vitest/vitest.mjs run tests/experience/catalogue.test.ts` — **one suite, 20 tests passed**. Inspected literal graph/result expectations, staged availability, creative/cosmetic associations, imported construction fixtures, register references and token checks against the signed-off tables.
- Fresh `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/experience/catalogue.test.ts` — **exit 0**, including negative probes for readonly progress/placements, finite scene IDs and valid audio channels.
- Reused the author's successful `tsc -b` application/Node/worker checks. A further broad application run was not necessary for this data-only closure.
- Independently inspected the author's 1200×800 raster of `docs/art-direction-reference.svg`, at `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11dc0-7d18-7262-96b0-017e40560fd7/WP02-01A-reference.png`. Read the complete SVG source; fresh XML parsing succeeded. The reference is self-contained, with no scripts, foreignObject or remote media dependencies. No new browser/game acceptance run is claimed.
- Fresh runtime-path regex probe — **71/71 current rows match**; leading-slash, remote-origin and parent-traversal examples are rejected. This checks the actual serialized pattern; it does not claim a full schema engine or ready-file verification.
- Fresh owned-file trailing-whitespace scan — **zero offending lines**. Final status inspection preserves unrelated work; no source/configuration/shared-status mutation, commit, delegation or other-chat message was performed.

Reviewed lowercase SHA-256 snapshots:

| File | SHA-256 |
|---|---|
| `src/experience/types.ts` | `174ca1e22d3b3daf682f9d6a939a66160b9f6e173f270f5a7ef53066c5521060` |
| `src/experience/catalogue.ts` | `c533707da5787265600fb57f36507c04b03b25ce7580a33bd10855fbea418cc9` |
| `src/audio/contracts.ts` | `d739cb6231167f6c2e5a3e741561134ffeaa986eab67d105fe601700db46b1da` |
| `assets/asset-register.json` | `fe64a74f49cde252ba50d09d0af14c5e7cd1d6c62d16130ece44d982bd9b8588` |
| `docs/art-direction.md` | `d5201c70212b5260fed68e8184b3b095a4ebf1b5533035d714746f3d41e7e511` |
| `docs/art-direction-reference.svg` | `b3a781bc3b6e7a32c248aae73a554b82543869404f795dc9bbe3e6aa089f24aa` |
| `tests/experience/catalogue.test.ts` | `341177618b2ebce41eaafe5e86de23b438d73a8c8831e684b13dfcc389140050` |

The accepted contracts and reference provide concrete direction for the final illustrated experience. Actual production quality, asset rights/measurements, audio quality, offline inventory and integrated interaction remain downstream acceptance responsibilities; this early acceptance waives none of them.
