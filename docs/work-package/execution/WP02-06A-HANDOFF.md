# WP02-06A — M1 adventure author handoff

9 October 2026. **Author implementation and local verification complete; source frozen for fresh independent review. D3 explicitly pending.** This is a reviewable M1 producer, not acceptance or publication. Controller owns integration/commits and later M1 acceptance; no M2 production was added.

## Exact owned files and interfaces

- `src/experience/world.ts`: pure committed world/result/hotspot projection and permanent required-binding progress.
- `src/experience/activityAdapter.ts`: accepted committed projection to presentation, without answer rules/regrading/reward calculation.
- `src/experience/QuestActivity.tsx`: draft, exact command retries, committed help, attributed feedback and captured lifecycle.
- `src/experience/AdventureView.tsx`: explicit selected profile, guarded route/resume adapters, four illustrated scenes, optional offers, discoveries and actual creative ending.
- `src/experience/experience.css`, `motion.ts`: scoped storybook presentation, text enlargement/reflow and cancellable illustration-only motion.
- `tests/experience/world.test.ts`, `tests/browser/experience.spec.ts`: four pure checks and six integrated cases.
- `tests/fixtures/adventure.html`, `adventure.tsx`, `adventure-api.ts`: mountPanel host, actual producers/native IndexedDB and erased diagnostics.
- This handoff.

`AdventureView({selectedProfileId,activePanelHost,stateController,audioController,navigation,assetResolver})` matches the accepted contract. Missing selected profiles and unavailable projections yield recovery, never a substitute player/question. Profile/epoch/encounter/episode and local disposal guard callbacks. The sole facade supplies every mutation/snapshot. Permanent world sets and WP03's helper supply progress; no local success counters, reward oracle, second store, learning observations or regrading.

QuestActivity preserves dirty edits across snapshots and attributes feedback to its saved Check/practice session. Help appears only after committed assistance. Listening support commits before assessed-text speech and respects the real audio/voice gate. Deliberate Check captures action/submission/sequence/response; save-failure retries preserve the exact envelope. Conflict retry refreshes and validates the current token/episode/sequence. Fresh committed success alone triggers restoration or Pip celebration; already-applied/reload is static.

One stable activity lifecycle publishes dirty/pending/failed synchronously, coalesces leave, waits for prior work, validates the original binding, and latches unsuccessful leave. Explicit discard is blocked while pending and preserves committed attempts/help/world; independent facade failures remain in facade readiness. Terminal clean work leaves without synthetic suspension. An edited response uses existing SaveDraft before deliberate FinishPractice. Resume uses only the retained encounter form; episode restart never invents a reward encounter.

Q1 opens bridge/map routes, Q2 lights/opens the library and gives the story handoff, Q3 stocks the market and enables bunting/planter. Each optional transfer has Continue; all three can be declined. Restored destinations reoffer the optional transfer from its accepted sourceBindingId and permanent completed story-binding set, including after leaving, reload and actual encounter compaction. The existing guarded requestActivity route owns opening it. Revisit and unbound suggested practice retain producer provenance/review semantics. Actual CreativePlot commits explicit appearance Save and the saved planter appears in the village. No timer, score, mastery or perfection lock.

Accepted SVG layers are isolated in image documents, avoiding duplicate DOM IDs. Full source aspect ratios/edges remain visible; task text/quantities/controls stay live DOM. CSS respects system OR profile reduced motion. The accepted single audio runtime/preferences and both themes/five cue ports are reused; persistent Sound/Silence all stay outside activities. No new assets, paid tools or audio production.

## Host, evidence and checks

Host: `http://127.0.0.1:5194/playtest/tests/fixtures/adventure.html?namespace=<unique>`; namespace `learning-is-fun:/playtest/:adventure-<query>`. Real `openSaveRepository`, full validator, `createStateController`, reviewed catalogue/bindings, audio/preferences and Hall read model. Visible DOM creates/selects players and solves activities. Diagnostics contain no answer/completion/world-patch/reward endpoint: only snapshots/events/readiness, clock changes, native abort/hold/release, a second actual facade rename and exact command redelivery/lost acknowledgement. Loss throws after the real native result; no fake success status. Teardown restores hooks and disposes host/audio/facade.

Evidence root **E**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11fd0-2521-7fc1-87cc-43d4c52e7995`.

Private configs `E/adventure-server.mjs` and `E/adventure.config.mjs` use port **5194**, `/playtest/`, build identity `local-wp02-06a`, private cache/output, one browser worker and zero retries. No broad root build. Bundled Node: `C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

| Check | Final result |
|---|---|
| Six original cases, D1 branded Chrome channel, 1366×768 | 6 passed |
| Same six, D2 Edge channel, 1920×1080 | 6 passed; normal Windows account via authorized escalation |
| Same six, T1 Chromium touch, 1024×768 | 6 passed; native tap route, emulated tablet |
| Same six, T2 WebKit touch, 768×1024 | 6 passed; native tap route, emulated tablet |
| Combined final behavior closure after F01 | **24 passed**, no failure/skip/retry, `E/results-f01-final.json`; prior closure retained in `E/results-closure.json` |
| Final uncropped-art CSS adjustment | Four affected full ordinary/portrait cases passed on D1/T2, `E/results-art-final.json` |
| Owned Vitest suite | **4 passed**, no cache/filesystem module cache, one worker |
| Strict DOM/JSX source+host typecheck | Passed, explicit `src/vite-env.d.ts` + `adventure.tsx`, no emitted/shared cache |
| Separate strict ES2023 Node-only spec/adapter typecheck | Passed, explicit `experience.spec.ts` + `world.test.ts`, no unchecked TSX import |
| Owned whitespace/hash scan | No trailing whitespace; final bytes/lowercase SHA-256 in `E/final-hashes.json` |

Reproduce locally from the repo using the bundled Node: run `E/adventure-server.mjs`, then `node_modules/@playwright/test/cli.js test --config E/adventure.config.mjs --project D1-Chrome`. Set `ADVENTURE_RUN` to a unique report suffix. Pure suite command: `node_modules/vitest/vitest.mjs run tests/experience/world.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`. D2 requires the documented normal-account route; it was not substituted with Chromium.

## Criteria/evidence mapping

| Existing case / criteria | Actual integrated evidence |
|---|---|
| Ordinary journey; criteria 1–7, 9, 12 | 6+6 bridge; excited spellbook ending; 6 apples/3 pears; decline all transfers; gold planter spot 2; reload preserves world/rewards/planter; actual Hall. Later-week unbound due review retains a known canonical identity, new opportunity and no extra quest receipt. Initial three quests: 120 lifetime; final after review: 140 (actual WP05 output). |
| Supported keyboard; criteria 1, 4, 8, 9 | Wrong 4+4 → Back/resume same episode/encounter/opportunity → committed help → Finish → exact duplicate already-applied → resume advances only episode → 4+4+4. Calm punctuation ending after support. Merchant 5/4 versus 4/2 yields different real constraint issues, then supported 6/3; violet planter spot 3. Actual final lifetime 90, Q1/Q2/Q3 permanent sets. |
| Transfer; criteria 4, 12 | Fresh 5+4+3 bridge; decline/return/reload retains the optional offer; distinct transfer; leave/resume keeps role/identity/draft; actual transfer success never adds missing story completion or duplicate quest reward. One quest receipt; actual lifetime 60. The ordinary journey also proves actual later-week review compacts its source encounter, then reload/destination navigation still opens a distinct optional transfer with the same quest provenance and unchanged permanent world/quest receipts. |
| Native failures; criteria 5, 8, 9, 11 | Aborted help remains hidden until exact retry; wrong Check/edited draft survives failed leave; flush stays blocked; retry saves same suspension; explicit discard preserves committed facts. Second-facade conflict → explicit refreshed retry. Lost Check acknowledgement → identical action/submission/response retry → already-applied with no banner or Pip animation. Q1/lifetime 30; final readiness true. |
| Two profiles; criteria 10, 11 | Held Check keeps original child visible while switch waits; release changes only that child's world. Failed other-child suspension preserves selection/draft; retry permits switch. First/second lifetime 40/0, second world empty. |
| Quiet/portrait; criteria 2, 3, 6 | System reduced motion, Silence all, viewport rotation and 200% root text retain committed bridge, ≥44px visible native controls and no horizontal overflow; manual visual inspection confirms meaningful text wrapping. |

Reports include complete native command/result/snapshot/readiness JSON attachments; extracted receipts are in `E/final-images`. Accepted producer evidence is reused for low-level drag/capture, audio/speech internals and unavailable-revision/invalid/unsupported validation. Actual history compaction is also exercised in the extended ordinary case. This suite does not claim to repeat every producer fault permutation or acoustic playback measurement. New source handles their nonacknowledgement/recovery results without replacement/regrading.

## Findings and original reruns

1. **Fixture timing:** resume read ordinal 1 before OpenEncounter acknowledgment. Wait for the reopened activity; original complete suspended/finished journey passed. No policy edit.
2. **Fixture keyboard targeting:** supported journey initially submitted 10 apples/3 pears. Trace showed Enter while Set zero was disabled during help saving; focus remained on the previous control. Wait for enabled controls before focus/Enter and assert visible counts. Original entire Q1→Q2→Q3→creative flow, then all six cases across four projects passed. Retained `E/results-d1-second.json`, `E/browser-output/...supported-keybo.../trace.zip`, `E/merchant-failure.jpg`.
3. **Fixture route expectation:** bound revisit correctly selected practice, not due review. Command provenance and accepted selector showed review requires unbound suggested practice. Test now uses the existing ending practice control; original complete journey/review passed on all four projects. Historical `E/results-d1-full.json` retained.
4. **Visual composition:** 200% chapter labels fragmented vertically despite no overflow. Rem-based auto-fit stacks them; illustration-only fade preserves live text; companion typography inherits enlargement. Final art adjustment removes clipped corners to honor complete source edges. Original portrait/full journey reruns passed; no animation grants progression.
5. **Source review:** animated Pip pose now depends on a fresh committed successful Check, not just a successful projection. Lost-acknowledgement case verifies both celebrations stay absent after already-applied; the full 24-result closure passed.
6. **Independent F01, criterion 12:** only the projected successful story encounter offered a transfer; leaving or compacting that encounter stranded the optional route despite permanent completion. The extended existing transfer case reproduced the absent action (`E/results-f01-before.json` and `E/browser-f01-before/.../trace.zip`). Fixed the producing world hotspot projection only, using accepted transfer source binding plus permanent completion; existing guarded AdventureView dispatch is unchanged. Original complete decline/return/reload/transfer/resume case and ordinary journey with actual review compaction passed (`E/results-f01-d1.json`), then all six cases across four projects passed (`E/results-f01-final.json`). Four pure checks and both strict typechecks passed. No new cases, harness hooks or reward/evaluator/provenance policies.

## Representative final images and review boundary

Under E, actual inspected captures (not mockups):

- `final-images/D1-Chrome-01-village-before.png`
- `final-images/D1-Chrome-02-bridge-restored.png`
- `final-images/D1-Chrome-03-library-restored.png`
- `final-images/D1-Chrome-04-market-restored.png`
- `final-images/D1-Chrome-05-creative-saved.png`
- `final-images/D1-Chrome-05-explicit-ending.png`
- `final-images/T2-WebKit-touch-portrait-200-percent-reduced-motion.png`

Inspected before/restored/market/creative/ending and enlarged portrait: intact art, visible restoration, named planter socket, readable hierarchy and correctly wrapped chapter labels. Screenshot capture fast-forwards finite presentation animations only. Final images and receipt extracts are refreshed from the all-green F01 closure.

**D3 pending:** foundation's `D3-ADVENTURE-CI-HANDOFF.md` defines `selection=adventure`, these same six cases, port 5194 and private `ADVENTURE_VERIFY_ROOT` on the existing matched Linux Firefox/native backend. Controller can review/commit/dispatch then seek narrow final acceptance. No new test or acceptance gate and no Windows Firefox substitution.

No cross-owner production defect remains. Final shell/update lifecycle, publication, actual device/listening observations and sole M1 acceptance stay downstream. No physical tablet, child-duration, acoustic hearing or whole-game release claim. No staging/commit/delegation/other-chat messaging, shared policy edits, dependency installation or other producer writes. Unrelated work was preserved. After the ready checkpoint changes were limited to the documented uncropped-art CSS and requested F01 world projection with extensions to the existing pure/browser checks. The final manifest identifies the frozen review snapshot.
