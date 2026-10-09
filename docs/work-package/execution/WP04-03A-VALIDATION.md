# WP04-03A independent implementation validation

9 October 2026, fresh report-only validation and narrow correction recheck of the M1 backup implementation.

**Current verdict: PASS — F01 and F02 closed; no open actionable findings.** Corrected source passes 17 independent pure checks, both original complete IDB decision gates and the final Node/fixture API type-boundary checks. The original failed review and intermediate holds below are retained as evidence, not current decoder failures or blockers. Controller alone owns administrative acceptance, integration and commits.

## Scope and authority

Read [GLOBAL_RULES](../GLOBAL_RULES.md), the complete [WP04-03A chunk](../chunks/WP04-03A.md), [author handoff](WP04-03A-HANDOFF.md), actual backup/migrations modules, all focused fixtures/tests, state/repository interfaces, and the owning learning, reward, competition/calendar and retained binding/catalogue contracts. The accepted WP03-04A handoff/validation and its actual evidence reducer were additionally inspected because they determine the valid later-distinct aggregate, rather than the backup owner's assumptions. WP04-02A's accepted immutable-snapshot validation establishes the repository boundary.

Only this repository report was written. Source, tests, configuration, dependencies, Git, shared status and other chats were untouched; no delegation occurred. Ordinary writing applies. Used [Logic-Flow Diagnosis](C:/Users/alexb/.codex/skills/diagnose-logic-flow/SKILL.md) once for the producer → semantic gate → repository and import → continuation traces. This assignment authorizes diagnosis only, so no repair was attempted. Execution was serial, on port **5181**, with one Chromium browser at a time and private OS-temp caches/reports. The separately assigned raw recovery-port review on 5179 was neither duplicated nor treated as a blocker for these checks.

## Original F01 [P1] — valid supported later-distinct successes cannot be saved or exported

**Causal location:** `src/state/backup.ts:393`, the `validateBand` condition `b.laterDistinctSuccesses <= b.independentSuccesses`.

This contradicts the accepted learning producer. `src/learning/evidence.ts:104–113` increments later-distinct success for a succeeded, non-familiar task when there is a previous success and the current canonical ID is distinct. Help does not prevent that factual count. WP03-04A Exact scope explicitly retains later distinct success when the prior task was helped; its accepted independent recheck also records 0 independent / 2 supported / 1 later-distinct. This is available producer meaning, not an invented full-history invariant.

**Fresh reproduction:** start one clean Ben profile, active week `2026-10-12`. Use actual retained M01/support tasks `lif.math.bridge.r1.total-12` and `lif.math.bridge.r1.total-10`, adaptive first encounters, non-familiar, answer hint before each Check, and correct responses `[6,6]` then `[5,5]`. For each, invoke actual `classifyRewardEligibility`, `evaluateResponse`, `applyCheckRewards` and `applyLearningObservation`, adapting their outputs to the accepted state DTO exactly as the author fixture does. No counters or awards are forged.

| Checkpoint | Expected / actual evidence | Verdict |
|---|---|---|
| First supported success | 1 Check / 1 completion / 0 independent / 1 supported / 0 later-distinct; root validates | Correct |
| Second distinct supported success | 2 Checks / 2 completions / 0 independent / 2 supported / **1 later-distinct**, 20 lifetime/current points, two 10-point slots, correct threshold entitlement | Correct producer output |
| Owning reward / standings validators | Both return `[]` for all five hint variants | Correct |
| Full-root `validateSave` / `decodeBackup` | Reject second-supported case at `save.profiles.ben.learning.evidence.M01.bands.support`, `invalid-save`, “Evidence aggregate counters are inconsistent.” | **First incorrect checkpoint** |
| `exportBackup` / v1 identity migration | Export throws that message; migration returns the same invalid issue | Downstream failure |
| Real IndexedDB write gate | First supported root exists; a reducer returning the second producer root is refused as `invalid` | Downstream failure; prior root preserved |

The actual IndexedDB before/after token remains epoch `2c1c874a-b7e4-490e-a12e-885286129c3f`, revision **0**; complete snapshots are equal. This protects the prior root but prevents legitimate progress from persisting. The same aggregate is rejected after completed encounter records are removed, so retaining raw event/encounter history cannot solve the causal mismatch.

Controls pass: one supported success; two independent successes; independent then supported; supported then independent. Only the two-supported control has later-distinct greater than independent and fails. Its original complete logical JSON and the producer outputs are retained in the private evidence.

**Invalidated criteria:** P4-C supported logical self-export/import and logical preservation; the full-root pre-write/self-importability contract; P4-G's v1 identity preservation for this supported producer state. This finding does not invalidate the existing two-/sixteen-profile fixture results.

**Required correction and recheck:** align the aggregate bound with the owning factual-success semantics, retaining appropriate available-provenance bounds. Do not alter the learning producer, discard later-distinct facts, manufacture independent successes or require compacted history. Add this exact supported case and mixed controls; rerun full decode/export/migration and actual IDB acceptance for the original producer root.

## Original F02 [P2] — contradictory active first-Check evidence survives import and prevents continuation

**Causal location:** `src/state/backup.ts:366`, the active-evidence/encounter join checks identity, ordinal, counts and help, but omits `active.firstCheckCorrect === e.firstCheckCorrect`. Completed evidence already checks that retained equality at line 376.

**Exact counterexample:** create a fresh actual M01/support bridge first encounter with hint, wrong response `[1]`, one cumulative Check, suspended episode 1, an open reward opportunity and a five-point slot. The actual producer root has encounter and active evidence `firstCheckCorrect=false`; its saved judgement is also `correct=false`. Change **only** `profiles.ben.learning.evidence.M01.activeEpisodes['fresh-0'].firstCheckCorrect` to **true**. Leave encounter, judgement, counters, opportunity, response, reward totals and all other fields intact.

Both `decodeBackup` and repository validation report **valid**. Private preview → explicit session confirmation → `repository.replaceSave` accepts this contradictory root under a fresh epoch/revision 0 in actual Chromium IndexedDB. The first incorrect checkpoint is therefore the decoder's semantic join, not the subsequent producer.

Next, run the actual correct second Check `[6,6]` with cumulative Check 2 / episode Check 2 and retained encounter `firstCheckCorrect=false`. `applyCheckRewards` returns the legitimate remaining +5 lifetime/+5 competitive supported reward. However, `applyLearningObservation` at `src/learning/evidence.ts:63` correctly rejects the observation because its previous active record says firstCheckCorrect=true. It returns the exact previous evidence object, leaving one wrong Check and no completion. The resulting completed encounter then fails full-root validation (“Active evidence must match unresolved encounter episode.”), and the actual repository write is refused.

| Full IDB path | Unmodified producer control | One-field contradiction |
|---|---|---|
| Decode / confirmed replacement | valid / committed | **valid / committed** |
| Next correct Check updates evidence | Yes; 2 Checks, 1 completion, 1 supported retry | No; producer returns unchanged evidence |
| Next write | committed | **invalid** |
| Epoch/revision before → after | `c9176c9a-e5ed-4a6d-a3cb-43bc3710ea48`, 0 → 1 | `ff44bf9c-079c-4fe8-ace1-a2161f10147a`, 0 → 0 |

Complete before/after snapshots for the invalid continuation are equal. The root is not partially written, but replacement has installed work that cannot continue through the normal producer/gate contract.

**Invalidated criteria:** P4-C rejection of inconsistent imports; explicit unfinished attempt/evidence consistency and portable continuation. This compares two retained facts directly, without requiring expired completion history or claiming authenticity.

**Required correction and recheck:** enforce the available active first-Check equality at the decoder join. The original one-field contradiction must reject before preview/replacement; retain the suspended wrong producer control and prove its imported correct second Check still commits through real IDB.

## Passing and reused evidence

The author's **83 backup / 191 related tests** and final strict scoped typecheck are reused as recorded author evidence, not claimed as independently rerun. Inspected the focused tests and exact cache-free command description; no redundant broad suites were run. Read the final retained Playwright JSON at `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-a735f4b8a331460d9ef3f98a510e7ebe/results.json`: start `2026-10-09T01:31:48.426Z`, 5 expected, 0 unexpected/skipped/flaky.

Independently ran all five existing browser paths via their actual fixture APIs, supplementing fixture comparisons with Node native `assert.deepEqual` against complete freshly generated donor saves. This run completed **02:37:21 BST**; the independent original-input continuation run completed **02:38:25 BST**. Findings are additional acceptance failures despite the existing cases passing.

| Area | Independent result / inspected contract |
|---|---|
| Two profiles into empty and populated IDB; sixteen into populated IDB | All three pass full native structural equality before reconciliation, byte-identical re-export, close/reopen, new epoch/revision 0 and old-epoch refusal |
| Finite supported household measurements | Two profiles **10,965 bytes / 493 values / depth 13**; sixteen **158,201 bytes / 6,769 values / depth 13** |
| Separate calendar reconciliation | All three advance October 12 → October 19, add one archive, preserve replacement epoch and advance revision only 0 → 1 |
| Cancel, invalid decode, stale preview, post-confirmation peer commit, capacity | Existing browser case passes; prior complete roots preserved, six rejected inputs, in-transaction conflict, fresh reissue committed, 17-profile write refused as capacity-exceeded |
| Persisted future root | load returns unsupported; complete raw before/after root identical through refused normal validated export. No claim about separately assigned raw export |
| Limits before typed reconstruction | File.size >16 MiB independently rejects with **zero text() calls**. Decoder checks UTF-8 bytes and quote/escape-aware container depth before the full JSON parse; iterative value/text/object inspection precedes fresh typed DTO construction. Object gate budgets the serialized envelope before allocating its full serialized output |
| Malicious syntax/property boundaries | Independent escaped duplicate `a`/`\u0061`, escaped `__proto__`, and depth 33 reject. Inspected authored exact 16-MiB/250,000-value/depth-32/ID-160/nickname-24/text-4096 controls and next-value rejections, nonfinite values, getters, cycles, hidden/symbol/custom/sparse/exotic data |
| Full fixed v1 shape | Explicit required/optional records throughout; unexpected/missing members, dangerous property names, invalid range/counters/dates/weeks/enums and unknown schema/content/policy/catalogue reject; decoded records are fresh/deeply frozen. Independent missing preference, future inner schema, escaped long nickname, unknown family, foreign unfinished practice and mismatched slot canonical all refuse |
| Reward / archived state | Actual reward and competition validators own +5/+15/+5, quest +20, compact sums, marks, entitlements, unique ordered slots/30/600 policy, archive ordering/references and retained aggregate bounds. Inspected legitimate deletion rank-gap and older-name/aggregate controls; no demand for full event reconstruction |
| Retained bindings / transfer | Existing producer/browser fixtures remove old source encounter before export. Permanent story source, completed quest and unfinished optional transfer retain exact state; retained resolver works without a source encounter/history pointer. Role/quest/task corruptions reject |
| Response families | Inspected actual bridge/merchant/punctuation producer and strict draft checks, stored judgement re-evaluation and descriptor/revision joins; unknown family independently returns unsupported |
| Export readiness | Independently blocked each of pendingCommands, pendingPreferences, failedCommand, failedPreferences and unsavedTransition even with an inconsistent ready=true; **zero snapshot reads**. Existing authored explicit last-committed recovery control skips flush and labels source accurately |
| Private confirmation | Independent copied preview expires; exact session confirmation succeeds once, then expires; public fields contain only ID/token/date/profile names/count, preview frozen. Existing browser cancel/reissue/token-race cases pass |

Other exploratory assistance mutations were not promoted to findings: encounter assistance can legitimately grow after a Check, so available Check evidence need not mirror every later help flag. The reported F02 is only the immutable first-Check contradiction with a proven failed continuation.

## Reproduction evidence and snapshot identity

Private evidence directory:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-validation-fab9c7ea95e54f01911bf317a628ed63`.

- `independent.mjs` / `results.json`: complete five-case observations, full producer counterexample/variants, reward/standings results, export/migration refusals, IDB snapshots and additional boundaries.
- `continuation.mjs` / `continuation-results.json`: complete unmodified and contradictory import → second Check → repository paths with paired snapshots.
- `vite` and `vite-continuation`: private caches. Both hosts and browsers closed after execution.

Replay serially with the bundled Node executable and `NODE_DISABLE_COMPILE_CACHE=1`: run `independent.mjs`, then `continuation.mjs`. They import actual workspace modules, use existing Vite configuration with private cache overrides and strict port 5181, and create only private test namespaces. No installation is needed. The continuation script reads the first report's full actual wrong producer root.

| Reviewed file | SHA-256 |
|---|---|
| `src/state/backup.ts` | `292e5671b57e32f0ba7abbd3405db4924b5047c066f5db80a5a63beff76f143c` |
| `src/state/migrations.ts` | `42f4f0f7172e423741edc9d0541d807fe7c7ea5d35df6d6e8a4dccd0a141d02f` |
| `src/state/repository.ts` | `56df08e463414f54a4ee3915ad5f1fd4bfc3932197d2a03375b739d89d68e308` |
| `tests/state/backup.test.ts` | `cb44a11981befb520e9792a499dafe093ff7d4d3c84d8c7a0b738e8d2fe9b156` |
| `tests/fixtures/backup-data.ts` | `de3e5c015bb53b35052d5adfde3a92520c9dcceb3fac0d783bd1864cf3bcaa64` |
| `tests/browser/backup-roundtrip.spec.ts` | `f38db7ba420cd5564549a15ec93a77372d9208c6abf4cd601ec73103d1110bfc` |

Repository/backup/migration hashes were checked before and after the independent runs; the repository matches the Controller's specified freeze. Unit/test hashes identify the reviewed evidence without claiming a Git operation or a whole-worktree seal.

## Evidence limits and disposition

The independent cases use actual domain functions and the actual IDB writer; a fixture-owned synchronous reducer adapts completed producer state at `commitCommand`, as in the accepted author fixtures. They do not claim implementation of the later Check facade, rendered preference UI, audio playback/stop or page activation/silence gates. Those remain WP04-04A/WP04-06A/audio-owner composition obligations. The backup module retains imported preferences without itself activating audio.

These measured fixtures demonstrate finite supported capacity, not an unlimited or worst-case household guarantee. Value/text checks are post-parse/pre-DTO, as the chunk explicitly prescribes; the pre-parse byte/depth checks do not mean zero allocation. No cryptographic authenticity, power-loss simulation, published gameplay, M2 migration, broad build or raw unsupported-data export acceptance is claimed.

The original review completed with F01 and F02 blocking acceptance. Their narrow correction recheck is recorded below; no final acceptance is asserted until its required integration gate passes. The separate additive raw recovery port has its own reviewer.

## Narrow correction recheck — pure boundary green, integration held

At the Controller's explicit continuation instruction, inspected the revised source, new focused producer fixture/test cases and updated handoff without restarting the investigation or repeating broad suites. No browser, IndexedDB run or listening server was launched during this hold. A private Vite SSR module loader with `middlewareMode=true` and `hmr=false` imported the actual modules into Node; its cache and script/report remain in the existing private evidence directory.

The narrow production corrections match the causal findings:

- F01: the bound is now `laterDistinctSuccesses <= Math.max(0, successes - 1)`, where successes is independent + supported. It requires an earlier success of either kind without requiring the prior ID in the bounded four-completion window. Available retained completion/counter checks remain intact.
- F02: the active-evidence join now requires `active.firstCheckCorrect === e.firstCheckCorrect`. It leaves legitimate assistance containment intact and rejects contradictory available facts before preview/replacement.

**Independent pure result: 17 named checks, 17 passed**, completed `2026-10-09T01:54:27.006Z` (**02:54:27 BST**). These are native assertions against exact original evidence and actual producer outputs, not an independently rerun broad Vitest suite:

| Recheck | Result |
|---|---|
| F01 exact original full JSON from `results.json` | Full-root validation, export → decode → native exact equality, v1 migration and byte-identical re-export pass |
| F01 original with completed encounters removed | Same complete pure path passes without demanding raw history |
| Five hinted/independent success variants | Single supported, two independent, independent → supported, supported → independent, and two supported all preserve actual counters/rewards and round-trip exactly |
| Prior successful ID evicted by four unsuccessful completions | Actual producer remains 0 independent / 2 supported / 1 later-distinct; export/decode/migrate pass without fabricating the expired ID |
| Fresh three distinct supported successes; fresh three mixed successes | Both full pure paths pass, extending beyond the original two-success failure |
| One supported success falsely claiming one later-distinct success | Still rejects, retaining a meaningful aggregate bound |
| F02 original retained hinted suspended-wrong root and fresh unhinted control | Both validate/export/decode/migrate unchanged |
| F02 correct Check 2 after decode, hinted and unhinted | Actual learning producer advances; +5 lifetime/+5 competitive, two Checks, one supported retry completion; resulting root round-trips. Hinted result is native-deep-equal to the original independently retained valid continuation save |
| F02 exact one-field contradiction, hinted and unhinted | Both full-root validation and decode reject with “Active evidence must match unresolved encounter episode.”; the original producer's refusal of the corrupt continuation remains independently observable |

Private reproducible files: `pure-recheck.mjs` and `pure-recheck-results.json` in the directory already recorded above. Replay the script with the same bundled Node and disabled compile cache. It performs no browser/repository integration or durable application write.

Reused the updated author evidence: **93 backup / 201 relevant unit tests**, strict scoped TypeScript checks and ten new focused regressions passing after the two changes. These remain author results. The source and pure semantic recheck find no remaining issue in the corrected predicates; final PASS is withheld solely because the original IDB decision gate and post-release author browser evidence have not yet been run against stable final repository source.

| Corrected pure-recheck source | SHA-256 |
|---|---|
| `src/state/backup.ts` | `640adcefbc94d998ec7bdd7e5574dff9b05d753a114cb7d43d37fc48f61da661` |
| `src/state/migrations.ts` — unchanged | `42f4f0f7172e423741edc9d0541d807fe7c7ea5d35df6d6e8a4dccd0a141d02f` |

The repository was being corrected separately; its observed in-progress hash is not represented as the final freeze or integration identity. No new investigation, delegation, source/test/configuration/dependency/Git/status edit or other-chat message occurred. Only this report was updated in the repository. After explicit release, rerun the original full F01 save/export/migrate/import case and F02 reject-before-replacement/valid second-Check continuation through actual IDB, then assess the author's final focused browser results before closing both findings.

## Final released IDB correction recheck — both original paths green

The Controller transferred port 5181 after the author's final browser execution and repository freeze. Verified repository SHA-256 **`9f024213d5a381e300e3d3f24876b126756e81ca43eb805ee19ed6c7b5dbfa90`** and the corrected decoder/migration identities before and after execution. Ran only the original correction paths, retaining the 17 pure passes and previously valid household/rejection/calendar evidence rather than repeating broad suites.

Independent run completed `2026-10-09T01:59:46.735Z` (**02:59:46 BST**), one Chromium browser, port 5181, private cache/output. It takes the original full F01 save and F02 wrong-episode root directly from the initial independent `results.json`, imports actual source modules, and invokes the original domain-producer/repository adaptation. Native complete deep equality checks full logical saves and raw IDB roots.

| Released original path | Actual result |
|---|---|
| F01 original second hinted distinct success | **Committed**, epoch `ef43427c-e977-424f-90da-7a2e87d657ae`, revision 0 → 1; persisted save equals the exact original producer JSON |
| F01 export/decode/identity migration | All valid; complete save equal to original; compacted completed encounters remain accepted |
| F01 explicit confirmed replacement/re-export/reload | **Committed**, fresh epoch `69456034-44e8-4e47-8bac-7074117f03ef`, revision 0; logical save and raw IDB root equal original, re-export byte-identical, close/reopen preserves complete replacement snapshot |
| F02 exact one-field active first-Check contradiction | **Invalid before preview**; no preview created. Explicit attempt to bypass decoder also refused by authoritative replacement validation. Complete raw root and snapshot unchanged, epoch `8f9e4ee0-2038-410c-bcc2-ea3ad35da680`, revision 0 |
| F02 original valid hinted import → correct Check 2 | Import and subsequent write both **committed**; learning advances to two Checks / one supported retry completion; +5 lifetime/+5 competitive, no extra slot. Imported epoch `4b524203-e815-4e80-a785-6213e70640a1`, revision 0 → 1 |
| F02 valid unhinted wrong control → correct Check 2 | Same successful producer/gate/write path, epoch `bae1084c-629f-4cc9-92c3-421f1253df26`, revision 0 → 1; whole next save equals persisted raw root |

Retained `final-idb-recheck.mjs` / `final-idb-recheck-results.json` in the private evidence directory, with paired complete roots, producer facts, export/decode/migration results and before/after source identities. Host and browser closed; subsequent listener query found no listening connection on port 5181.

Read the finalized author handoff and retained final JSON reports: original correction tests **2 passed** at `2026-10-09T01:56:46.927Z`; full focused suite **7 passed / 0 skipped / 0 unexpected / 0 flaky**, start `2026-10-09T01:56:55.403Z`, duration 2.6 seconds, report `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-088cd00c2a0249e99665c1b5c477db71/results.json`. These are author results, with their final scoped TypeScript evidence; they supplement the independent original-input rerun. Decoder/migration/repository hashes match throughout.

Both original decoder findings satisfy the runtime closure gate. During this run the Controller identified a separate Node-project typing issue: the browser spec's type-only import traverses the fixture into DOM-dependent source. Its author is applying an erased Node-side API boundary correction without changing browser runtime/production files. Final report disposition waits for that narrow delta review and the fixed Node project check; this is not a new runtime defect or a reason to repeat unchanged browser execution.

## Final type-boundary review and disposition — PASS

After the Controller's explicit correction-complete notice, read the finalized handoff, the complete new `tests/fixtures/backup-roundtrip-api.ts`, changed browser-spec prefix, and the preserved structural compatibility probe. The API imports only shared DTO types and exports a type; it does not import the browser implementation, add executable code, change test expectations or alter shared compiler configuration. The browser spec's sole change replaces the implementation `typeof` imports/window declaration with the pure `BackupFixture` type. Compared against a private pre-correction copy: the runtime import and **every test body are byte-identical**. The browser fixture/runtime source and all production hashes remain frozen. Existing original-input IDB and seven-case author browser evidence therefore remain applicable without a redundant runtime rerun.

Independently passed both required compiler boundaries, with bundled Node, `NODE_DISABLE_COMPILE_CACHE=1`, no emission, no incremental cache and no build-info write:

1. Shared Node project: `node_modules/typescript/bin/tsc -p tsconfig.node.json --composite false --incremental false --noEmit` — **exit 0**.
2. Actual implementation → erased API structural assignment: the preserved `boundary.ts` imports actual browser implementation and assigns it to `BackupFixture`; compiled with explicit ES2022/DOM/DOM.Iterable, ESNext/Bundler, strict, skipLibCheck, Node types/typeRoots, noEmit, composite=false, incremental=false and `--ignoreConfig` — **exit 0**. The API does not merely conceal an incompatible implementation.

| Final reviewed boundary/runtime | SHA-256 |
|---|---|
| `tests/fixtures/backup-roundtrip-api.ts` | `990d4bd8e457b1e6428d8b0c5be24f470e0d86bdfd966cefa22adc843d03596f` |
| `tests/browser/backup-roundtrip.spec.ts` | `b927f2b65ca5abd67e1d214ea420652fb77cc2185a6cac0e625f6b501502c289` |
| `tests/fixtures/backup-roundtrip.ts` | `2ad3676b51453e6ab8647c205529e52d163a34d4633ca301d9985624d309d8ee` |
| `tests/fixtures/backup-learning-regressions.ts` | `ae8597e4f86591be5b243df8689326a73576510d46bd32660249ca3592422ac8` |
| `src/state/backup.ts` | `640adcefbc94d998ec7bdd7e5574dff9b05d753a114cb7d43d37fc48f61da661` |
| `src/state/migrations.ts` | `42f4f0f7172e423741edc9d0541d807fe7c7ea5d35df6d6e8a4dccd0a141d02f` |
| `src/state/repository.ts` | `9f024213d5a381e300e3d3f24876b126756e81ca43eb805ee19ed6c7b5dbfa90` |

**F01 closed:** exact original supported-success state now traverses producers → full-root gate → actual IDB commit → export/decode/identity migration → explicit whole replacement/reload with exact logical equality. Mixed and compacted/evicted evidence controls remain green.

**F02 closed:** exact original contradiction rejects before preview and authoritative replacement, preserving complete raw root; legitimate imported hinted/unhinted wrong work proceeds through actual Check-2 producers → gate → IDB commit with correct learning/reward continuation.

**Final independent implementation verdict: PASS.** Reused final author **93 backup / 201 relevant unit tests**, seven passing browser cases and scoped typecheck; supplemented them with the 17 pure checks, exact original independent IDB reruns and independent final Node/API checks. No actionable finding or invalidated criterion remains within this chunk's decoder/repository integration scope. The earlier evidence limits still apply: later facade/audio composition, raw unsupported-data recovery acceptance, M2 and published behavior are separate owners/criteria. No shared status, source/test/configuration/dependency/Git write or other-chat message occurred; only this validation report was changed in the repository. Port 5181 is stopped and released. Controller alone accepts, integrates and commits.
