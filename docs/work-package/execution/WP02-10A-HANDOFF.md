# WP02-10A — M2 connected composition handoff

Private producer candidate, frozen for the original independent reviewer. Correction history and current delivery scope follow; earlier main/preimage statements describe the original freeze. Base: `3dba18315246be257de595875b05a8c0d7961675`. Main was not integrated, staged or committed. No deployment, audible-quality, physical-device, child-test or independent-acceptance claim.

## Integration F01 (P2): occupied garden socket URL correction — 11 October 2026

**Source correction frozen for original review; production finding remains open until rebuilt-artifact verification.** This is distinct from the earlier P3 copy finding, whose accepted evergreen wording is preserved.

The fresh integration report `docs/work-package/execution/M2-INTEGRATION-VALIDATION.md` records the original path: normal adult prepare/confirm import of the retained workshop-first Q10 save, select Aster, then Village Green. The three socket bases under **occupied spots 4–6** request `/Learning-is-Fun/assets/art/m1/props/plot-socket.svg` and return HTTP 404. Production evidence (receipt, trace, response log and screenshots) is retained by reviewer `01a12cb7-71ef-7a30-b334-0b95b648b61d` under `C:/Users/alexb/.codex/visualizations/2026/10/11/01a12cb7-71ef-7a30-b334-0b95b648b61d/review/`. The reported Ready offline state concerns the valid registered inventory; it does not validate this erroneous unregistered consumer URL.

The sole production delta changes AdventureView's socket literal from `assets/art/m1/props/plot-socket.svg` to the existing accepted `assets/art/m1/ui/plot-socket.svg`. No asset alias, registry, cache-readiness, progression, save or art treatment changes. The corrected SVG SHA-256 is `18605b6fe758476eced4697db17fc19ff98e8e502f3c426e0b1faae78a60bc6a`.

Why prior verification missed it: the private Vite producer returns **200 text/html** for the nonexistent path (SPA fallback), unlike the production static host's 404. The old response guard rejected only HTTP >=400. Its screenshot helper checked main/layer visibility, not image decode and not the added socket bases. `socket-correction/before.json` reproduces the wrong URL with all three images complete but naturalWidth=0; `before.png` retains the visual failure. The first private probe incorrectly expected a 404 from Vite and stopped on that assertion; the probe was corrected to record the actual response and assert undecodable images. That probe mismatch is not counted as a pass.

The existing `experience.spec.ts` response guard now also rejects non-SVG MIME responses for art SVG URLs. Its capture helper polls every composed scene image, including saved decoration/socket images, until complete with positive naturalWidth, reporting unresolved URLs. The retained before-response fails the new MIME predicate and its three broken image entries fail the decode predicate. The selected case names/count remain **11**, with no skipped or replaced tests. The first focused journey completed its flow but failed the newly added MIME assertion on legitimate 304 cache responses without Content-Type; its report and trace remain in `socket-correction/attempt-1-report.json` and `attempt-1-output`. The guard now checks MIME on successful body responses only; 304 cache reuse remains covered by the decoded-image check. This assertion repair did not change production behavior.

Focused source/consumer evidence: `socket-correction/check-sockets.cjs` checks the source literal and absence of a props alias, imports the unchanged logical Q10 receipt (SHA-256 `c77fe5419d4c4f8c4551020078485785a0049e4e806496ffc55da6677807495c`) through the real fixture prepare/confirm path, and inspects the actual composed Green. All three bases at occupied spots 4–6 now decode at naturalWidth=240; each resolved URL returns 200 image/svg+xml and exact accepted-asset bytes. The evergreen copy remains rendered; zero page errors. See `after.json` and visually inspected `after.png`.

Fresh verification after the URL and guard changes: full supported TypeScript build PASS (`socket-correction/compiler.log`); the existing Chrome workshop-first complete journey **1/1 PASS**, no retries/skips, including six saved placements/reload and composed-scene captures with the strengthened guard (`socket-correction/journey-report.json`, `journey-output`). The original 44-case matrix and 86 focused tests remain historical evidence for their earlier frozen bytes, not fresh executions of this correction. No broad matrix was repeated.

The fixture import and focused journey support consumer repair; **they do not close the original production path**. After this source review, Controller must rebuild and the fresh integration reviewer must rerun the exact adult-import/Aster/Green path under the production base, checking all three occupied bases online and after offline reload. Main and its built artifact were not edited by this author.

Integrate only this correction's three-file delta: `src/experience/AdventureView.tsx`, `tests/browser/experience.spec.ts`, and this handoff. **Do not copy candidate world.ts:** Controller's main EOF normalization (5161 bytes, SHA-256 `ae2a153e5f19bd524fb59e59f8f5458db9a77f765242aa891d268724ccc7a733`) must remain. Seven other candidate manifest files are unchanged; the historical full manifest is not a request to recopy them. Current main input identities are separately retained in `socket-correction/main-input-hashes.json` and rechecked unchanged.

Previous frozen input hashes (retained files/manifest/freeze under `socket-correction/input-*`):

- src/experience/AdventureView.tsx: 35534 bytes, SHA-256 `d51f086c07e920e75ccc7566c45b57f2fd6a8a366cf809e18212dc3e778ff04b`.
- tests/browser/experience.spec.ts: 57051 bytes, SHA-256 `04765294a1be7cdeaedd635d2d9f66ce969ad8bd78ed967bc8861b335f50db03`.
- docs/work-package/execution/WP02-10A-HANDOFF.md: 19945 bytes, SHA-256 `d9aafefd7df5b7e7178561a46d6791624d20ddfbeaf68a172a34e862f84874b8`.

## F01 correction after independent review — 11 October 2026

The original independent review in main `docs/work-package/execution/WP02-10A-VALIDATION.md` passed the core producer scope and readiness repair, with one P3 stale invitation. The Q3 achievement remains visible after later quests, so describing the workshop and story shelves as the next adventure became false after completion.

The only production correction replaces that one sentence with: “There is always room to explore, create and practise at your own pace.” The historical Q3 achievement, planter/practice/Hall controls, Q10 finale, progression conditions and every other reviewed source/test byte are unchanged. No castle clock behavior was added.

Focused rendered verification: **3/3 pass** on Chrome at 1366×768, importing unaltered logical saves through the existing real backup prepare/confirm path: the genuine M1 boundary after Q3, the prior native upgrade receipt after Q4 with the other branch incomplete, and the prior workshop-first final receipt after Q10. The checks verify the new text, absence of the stale invitation, all four retained controls, exact completed quest membership and Q10 finale presence only in the completed state. All three ending screenshots were visually inspected; no page errors occurred. See `copy-correction/check-copy.cjs`, `rendered-copy-results.json` and the three PNGs in that directory. These checks inspect saved-state rendering; they do not claim to rerun progression.

The full TypeScript build, 86 focused tests, 44 browser cases and native readiness replays below apply to the **previous reviewed freeze**. They remain behavior evidence for the unchanged logic; they were not rerun for this reversible sentence-only edit. Their original reports are untouched. The new focused rendering evidence applies to the corrected source.

Previous reviewed identities: `src/experience/AdventureView.tsx` — 35544 bytes, SHA-256 `5f2fd12d0aea12603aa76c0e0c7cc2c04dc570d1da47b50db5cfdad7aa2c597e`; this handoff — 17460 bytes, SHA-256 `d35ecc23b0e1f5c268206804759c54b2b0aae59bab8e712a01283979ba701d0e`. Exact prior files, manifest and freeze are retained under `copy-correction/reviewed-*`. The current manifest preserves the original main preimages and adds `previousReviewed` for these two changed files. Eight other reviewed files remain byte-identical. Main owned-file preimages were rechecked unchanged; review sign-off for F01 remains with the same reviewer.

## Candidate and boundary

- Candidate: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11fd0-2521-7fc1-87cc-43d4c52e7995/m2/candidate`.
- Evidence: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11fd0-2521-7fc1-87cc-43d4c52e7995/m2`; final browser report: `results/report.json`.
- Nine existing owned files changed, plus this new handoff. `composition-files.json` records exact initial main bytes/hashes and final candidate bytes/hashes, including this handoff. Main preimages were rechecked before freeze.
- Private archive of the dispatched commit; existing dependencies reused via a junction. Ordinary supported writers; no Toolkit transaction, Git worktree creation, dependency install, shared status/root config/workflow edits, or other-chat messages.
- Existing panel command/retry/dirty/profile/epoch ownership and cleanup are retained. The observed activity-readiness defect described below is repaired at its mount timing. Only consumers of accepted content, widgets, state, rewards, creative, Festival, art and audio are changed.

## Result

Seven locations and Pip, Rowan, Iona, Nessa, Orin plus the named player are connected through Q1–Q10. Q3 opens Q4 and Q6; Q4 opens Q5; both Q5 and Q6 are needed for Q7; Q7→Q8→Q9→Q10 remains exact. The existing three M1 required beats and all twelve M2 required beats run through actual reviewed forms. Continue opens the next missing ordered beat without completing the quest early.

All completion and result presentation uses committed permanent quest/binding membership. No encounter-history reconstruction, score/mastery gate, calendar gate, grading, ranking or award calculation is added. Actual response controls cover all nine kinds through the six accepted widgets, with TaskStimulus displaying supplied assessment sources. The adapter does not expose answer rules or unrevealed help. Tests alone read approved answers and enter them through visible controls.

Named optional routes use actual accepted binding pools; an optional topic chooser uses the existing practice intent. The 57 rows (unchanged nine M1, twelve required M2, thirty-six M2 revisits) and all twenty primary assessed skills are audited against actual task definitions. One real judged activity per skill is preserved in the matrix below and the attached exact-canonical JSON; incidental reading/counting is not counted as another skill.

Accepted M2 layers are shown at their authored 960:600 aspect and anchors. Results include garden/marker, story shelf, sawmill model, forest path/gear, castle opening and separate Green/castle Q10 finale. All seven non-scored discoveries use accepted assets and the existing audio gates. Six saved decorations, home trim, Companion appearance, derived story displays and actual committed supported-success acknowledgement consume WP02-11A unchanged.

Festival refreshes through the facade once per ordinary mounted visit (including StrictMode replay). Only the supplied latest closed result is offered. Skip/replay state is local to that visit; closing restores focus, and reload offers the result again. It writes no seen flag, dates, rankings or awards. Q10 remains a distinct permanent story ending.

## Verification

- Full supported `tsc -b`: see `compiler.log`. The private root references app/node/sw wrappers extending the original projects; only tsBuildInfoFile is overridden. Original strict settings and complete fixture membership remain intact, with no ignoreConfig/include/noEmit alteration.
- Focused regressions: **86/86 across 5 files**, covering world/catalogue/Festival, all response drafts and expanded-state compatibility. See `unit.log` and `unit-results.json`.
- Browser matrix: **44/44**, **11 each** D1 Chrome, D2 Edge, T1 Chromium touch and T2 WebKit touch; one worker, zero retries, zero skips. Native IndexedDB and actual facade/evaluator/rewards/audio/components. Runtime page errors and missing art responses are asserted absent.
- All original seven M1 cases remain, including actual root entry, dirty saved-Check messaging, retained hint receipts, exact retries/lost acknowledgement, native aborts, failed leave/profile changes and StrictMode subscription/disposal behavior.
- Both complete legal branch orders pass. The library-first route uses committed support across the journey. Q9 clock success leaves Q9 incomplete; native reload preserves it; a real familiar repeat compacts the older clock encounter for zero renewed lifetime points; real unbound successful sequence practice still cannot fill the missing story beat. Its subsequent bound sequence can be edited, suspended, reloaded/resumed and completed before Q10.
- Genuine M1 source is the unchanged WP04-07A boundary file: `artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/starter-save.json`, **22690 bytes**, SHA-256 `7400aef18215e63f5d44303e8c16c804bc323e1f534a9edbe70956e563bc6c3e`. Real prepare/confirm import preserves the entire logical save before ordinary visit reconciliation. River’s retained suspended merchant identity/draft/help/opportunity resumes without an award. Native-aborted new Q4 Check leaves world and pre-Check reward state unchanged; exact retry completes Q4; old Q1–Q3 receipts remain, Moss remains empty, and reload preserves progress. This is separate from the publisher’s closed-result profile and the owner’s synthetic expanded fixture.
- Final images include full scenes at desktop, 1024×768 touch and 768×1024 WebKit, plus every scene at 390×844 and 768×1024 with 200% root text and reduced motion. No horizontal overflow in those checks. Desktop, tablet and portrait scene/creative/Festival captures were visually inspected. Full-resolution images, command receipts and snapshots are in each case directory under `results`.
- Earlier development attempts `attempt-01` through `attempt-10` remain evidence. Harness corrections included legacy image/planter selectors, async acknowledgement waits, the practice selector’s accessible name, reward-state assertions that distinguish opening an opportunity from earning an award, and the owner’s rule that pending same-skill work resumes before optional repetition. The remount-readiness assertion now polls until the ordinary-visit refresh finishes: attempt-09 recorded the held Check followed by an already-applied ReconcileCalendar; its failure capture was already ready with zero pending commands. The separate native focus defect is detailed below; it was not dismissed as a timing-only test failure.

## Native WebKit readiness defect: evidence and repair

The original failure remains in `attempt-07/experience-supported-keybo-7a670-s-and-calm-spellbook-ending-T2-WebKit-touch`. Its extracted trace is `focus-trace`: oebh@543 resumes, oebh@545 observes the visible widget, oebh@554 focuses the 4-metre plank, oebh@556 presses Enter, and oebh@558 still shows aria-pressed=false. The 241565ms screencast shows focus on the activity heading during that sequence. This trace alone did not record session readiness, so a passing delayed test was insufficient evidence to dismiss a user-facing race.

The unchanged original boundary was replayed with native focus/key/click capture and the existing read-only readiness API in `native-focus.cjs`. No heading-focus wait was added to that replay. It reproduced on attempt 3; exact evidence is `native-focus/attempt-3.json` and its native trace ZIP:

| Time from page origin | Observed checkpoint |
|---|---|
| 2764ms | Widget controls are in the DOM; panel absent, two baseline subscriptions. |
| 2783ms | The enabled 4-metre button receives focus while the panel remains absent. |
| 2791ms | Native Enter produces keydown and click on that button; panel absent, aria-pressed=false. |
| 2792ms | Keyup still has no selection. |
| 2793ms | QuestActivity’s passive effect connects/registers (panel present, three subscriptions), then focuses the heading away from the button. |
| 2813ms | Placement click occurs with no selected plank, so the draft stays at 8 metres. |

The producing defect was a visible, enabled but disconnected interval: createActivitySession.read() correctly rejected input while connected=false, but the host did not connect until a passive effect after paint. This is a real input-readiness window, not evidence that a visibly enabled control was safe merely because an automation was fast. The later focus effect also took focus after the attempted input.

The narrow repair moves the existing connect/register/initial-focus sequence to useLayoutEffect, retaining render-pure construction, the same cleanup, captured binding and retry behavior. The world’s scene-heading focus also runs before paint and only when no activity owns focus, including cross-scene resume. No widget, draft reducer, command, learning or reward behavior changes.

The temporary heading-focus waits were **removed** from the original test. Its selection checkpoint now asserts aria-pressed=true immediately after choosing a plank, so losing selection cannot be concealed by later placement or Check assertions. Twelve fresh native replays passed without a readiness delay; `native-focus-after-summary.json` records zero activity keydown/click events while unregistered across all twelve. The complete original WebKit keyboard journey and failed-profile/disposal case passed in attempt-10, followed by the full final matrix. This is timing evidence plus the original complete flow, not a claim based solely on a delayed passing test.

## Assessed route matrix

Exact canonical IDs and source checks: `results/experience-M2-workshop-fir-f1fac-and-saved-six-socket-finale-D1-Chrome/assessed-skill-binding-matrix.json`; matching evidence exists for all four browser projects.

| Primary skill | Reached binding | Location | Mechanic | Form |
|---|---|---|---|---|
| M01 | q1-revisit-m01 | River Bridge | drag | bridge |
| E06 | q2-revisit-e06 | Whispering Library | drag | punctuation |
| M04 | q3-revisit-m04 | Market Square | object-manipulation | merchant |
| M02 | q3-revisit-m02-matching | Market Square | matching | matching |
| M05 | q5-revisit-m05-choice | Village Green | consequential-selection | choice |
| E04 | q6-revisit-e04-sorting | Whispering Library | sorting | sorting |
| E02 | q6-revisit-e02-choice | Whispering Library | consequential-selection | choice |
| E10 | q7-revisit-e10-choice | Storywood Forest | consequential-selection | choice |
| E08 | q8-story-e08-clue | Storywood Forest | consequential-selection | choice |
| M07 | q1-revisit-m07-quantity | River Bridge | object-manipulation | quantity |
| M08 | q9-revisit-m08-quantity | Clockwork Castle | object-manipulation | quantity |
| M10 | q10-revisit-m10-quantity | Village Green | object-manipulation | quantity |
| E05 | q7-revisit-e05-sequence | Storywood Forest | sequencing | sequence |
| M03 | q4-revisit-m03-quantity | Tinker's Workshop | object-manipulation | quantity |
| M06 | q5-revisit-m06-choice | Village Green | consequential-selection | choice |
| M09 | q4-revisit-m09-choice | Tinker's Workshop | consequential-selection | choice |
| E01 | q6-revisit-e01-choice | Whispering Library | consequential-selection | choice |
| E03 | q5-revisit-e03-choice | Village Green | consequential-selection | choice |
| E07 | q2-revisit-e07-punctuation | Whispering Library | drag | punctuation |
| E09 | q8-revisit-e09-choice | Storywood Forest | consequential-selection | choice |

## Foundation and downstream obligations

1. **WP01 shell:** `src/app/createAppRuntime.ts:59` still constructs the original M1 facade at this dispatch base. The final M2 shell must supply milestone M2 before exposing the extended composer. The producer host does so already. This file is outside this worker’s ownership; it was not edited. Actual root tests here verify the retained M1 journey, not a published M2 upgrade.
2. **D3 foundation runner:** `.github/workflows/d3-firefox-smoke.yml` has three separate selections maps asserting adventure **7** (setup, discovery, result validation). The selected `experience.spec.ts` set is now exactly **11**. Update all three to 11 through the foundation owner; do not weaken the discovery/result comparison or skip cases. The two longer new journey cases declare their own 180-second bounds, so the inherited 45-second default does not truncate them. Exact names follow below.
3. **D3/publication:** Firefox and actual published M2 smoke/upgrade/full journey remain downstream observer obligations. No workflow was run or changed here. Current public M1 C remains untouched.
4. **Review:** Use the original independent reviewer on these frozen files and native evidence before Controller integration. Broad main integration, root build, public deployment, audio detailed hearing and final acceptance remain with their assigned owners.

## Exact selected browser names (11)

1. ordinary Q1 → Q2 → Q3 → saved planter, all optional offers declined, reload and Hall
2. supported keyboard journey: suspend versus finish, both merchant constraints and calm spellbook ending
3. third bridge combination and distinct optional transfer preserve provenance on leave and resume
4. native save aborts retain draft and committed help; exact retry, leave failure, flush and explicit discard
5. pending Check blocks profile change, saves only captured child, and a failed switch retains selection
6. silent reduced motion and 200 percent portrait keep native controls and committed restoration
7. published journey: Hall resume keeps mission scene and edited saved Checks remain visibly unsaved
8. M2 workshop-first journey reaches all 20 assessed skills, nine forms, seven discoveries and saved six-socket finale
9. M2 library-first multibeat leave and reload plus actual Q9 compaction cannot complete a missing story beat
10. M2 genuine immutable M1 import retains suspended identity and old awards while new failed Check stays pending
11. M2 Festival offers refreshed closed facts on ordinary visit, skip and replay restore focus without story completion

## Reproduction

Use the bundled Node executable directly, candidate as cwd, and private outputs. Compiler wrapper/configuration and browser configuration are retained under candidate `.verification` solely as verification support, not delivered root changes. The Vite producer server used port 5223, APP_BASE=/playtest/, APP_BUILD_ID=local-wp02-10a, ADVENTURE_VERIFY_ROOT pointing to evidence/cache. PWTEST_CACHE_DIR points to evidence/pw-cache. No pnpm install or shared config rewrite is required.

Commands (`node` denotes `C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`):

`node node_modules/typescript/bin/tsc -b .verification/tsconfig.json --force --verbose`

`node node_modules/vitest/vitest.mjs run tests/experience tests/interaction tests/state/expanded-compatibility.test.ts --config .verification/vitest.config.mts --reporter=default --reporter=json --outputFile=../unit-results.json`

`node node_modules/vite/bin/vite.js --config tests/fixtures/adventure.vite.config.ts --host 127.0.0.1 --port 5223 --strictPort`

`node node_modules/@playwright/test/cli.js test --config .verification/playwright.config.mts`

## Exact owned source/test bytes

| Path | Main preimage bytes / SHA-256 | Candidate bytes / SHA-256 |
|---|---|---|
| src/experience/world.ts | 4279 / `0793855e10ddce760b6ff1d3f540efb86f82e05cec4b0cd3ca7b61bf54b0e6df` | 5163 / `815527ebc12e487ce6ab59559118905a9d9daea76fc4281bc56e3f77f2b7fcac` |
| src/experience/AdventureView.tsx | 25419 / `1b535d6770ec0840c165a61b56bd2350d676ec409352c0d49e2c9f5887f14f79` | 35531 / `ba2f0616124f26f4082cb8ccbe9e2051837cc0141e9552268cb359836218061f` |
| src/experience/QuestActivity.tsx | 18710 / `a3f8547679f61dc6ed6c88d7a6c7e0fafa5f520972b78468c233d0770effb59c` | 19776 / `55dc8e88fcf232012dd5b7fafdcd174855823ce5615470b35589feda488b0b13` |
| src/experience/activityAdapter.ts | 2459 / `b033b7fe49d9f052f4cb3da2c7b0c698d67e6ce0683377e0f3fa9d49205f0bb2` | 2195 / `26de7854e6e96457b16389f765fd2ab0ba293e7856f929d2508b40713e8ce0b4` |
| src/experience/experience.css | 6903 / `5ed2be3ac72c3e741448ded05346804d6dfcc86bfe187bd97c2b88e9b2a1381b` | 8039 / `8f7955a369ce8d89d69bc5c49129a1c632230009046bbff353e1368281a9c356` |
| tests/experience/world.test.ts | 4791 / `9d186da521254189b33bb245258b504f067609f2ca940e206ac128b211e2afa9` | 8376 / `0c0451fba20cdcbe13124296c8de8ccf7811f779bc737497ffc0c5b100d54403` |
| tests/browser/experience.spec.ts | 35452 / `bbc2181c33af8dba5f7372b3b0586a8d7d352b85480a818b78bc829567146642` | 57826 / `9446ae32aea737594bdd76702a554c39fd9d30adcb6574d935b4562028f68d89` |
| tests/fixtures/adventure.tsx | 12337 / `35a21b7996308fa7bc8167d82a3fe18f29d006ec24704531c2acf4b8e33a63dd` | 12929 / `52e6c6e8c5da71fbae8a59a1d51d1def4f79c90dd859a275079863ed48e79128` |
| tests/fixtures/adventure-api.ts | 1061 / `dbe59e5f18eaaa1d1e3998cdcd5e80b6f58a5ecf24d9aa584615680133df970c` | 1210 / `4ed1e8822237e7e546014d431887c834f1dd3033478dda513291322a03da7f60` |

This handoff is new (main preimage absent). Its final hash is recorded externally in `composition-files.json` to avoid a self-reference.
