# WP04-03A same-week educational review — independent correction validation

9 October 2026. Original independent backup validator; narrow continuation, report-only.

**Verdict: PASS — the same-week completed-review decoder defect is closed. No open actionable finding within this correction.** The exact Monday → Thursday input completes, persists through the validating facade test port, exports/decodes unchanged and earns zero new points. Future-week/foreign-canonical provenance still rejects; rewarded review remains a separate later-week policy. Controller retains administrative acceptance and integration authority.

## Scope and source delta

Read [WP04-03A-REVIEW-CORRECTION](WP04-03A-REVIEW-CORRECTION.md), affected `backup.ts` and `backup.test.ts`, the selector's [correction](WP03-04A-INTEGRATION-CORRECTION.md) and [independent validation](WP03-04A-INTEGRATION-VALIDATION.md), and actual controller/transition/learning/reward/calendar mappings. Retained the earlier [backup acceptance](WP04-03A-VALIDATION.md); its F01/F02, household, malformed-input and IDB evidence was not re-audited. The known historical selector rejection characterization is pending its owner's update and is not a remaining runtime failure in the corrected source.

The production delta is exactly the completed educational episode check at `src/state/backup.ts:227`: matching canonical identity is unchanged; `previousSuccessWeek < competitionWeekId` becomes `<=`, with two explanatory comment lines. Independently removed those comments and restored `<` in a private in-memory string; the reconstructed source's SHA-256 equals the previously accepted complete backup module **`640adcefbc94d998ec7bdd7e5574dff9b05d753a114cb7d43d37fc48f61da661`**. This verifies the narrow delta without Git or production writes.

`src/rewards/scoring.ts:298` still requires `previousSuccessWeek < earningWeek` for a rewarded later-week review. No selector, producer, controller, shared DTO or reward-policy compensation is introduced by this decoder change. The seven new backup tests use the actual controller/reducer/producers and validate every proposed save before acknowledging it; their assertions distinguish educational completion from monetary awards and preserve exact export/decode state.

Only this report was written in the repository. Probes/caches/results are private temporary artifacts. No source/test/configuration/dependency/Git/shared-document edits, delegation, other-chat messages, browser or listening server occurred; port 5182 was untouched. Continued the existing causal investigation directly, without reloading process skills or repeating broad suites.

## Independent original complete path

Executed a new native-assertion probe against actual `createStateController`, `reduceCommand`, catalogue/bindings, selection, reward/learning producers, `validateSave`, ordinary flushed facade export, `decodeBackup` and `migrateSupportedSave`. The isolated in-memory repository port checks the real validator before updating its root and verifies reducer input immutability. It supplies no alternate decoder, repaired fact or fabricated counter.

For the old-guard control, a private Vite SSR transform loads the independently reconstructed exact prior backup module while all other current modules remain the same. The loader never changes an on-disk production file. Its original Monday → Thursday completion returns invalid-save with **“Completed review provenance has a mismatched identity/week.”** and preserves the complete acknowledged root. This confirms the decoder guard is the causal divergence.

| Checkpoint | Corrected exact observation |
|---|---|
| Monday **2026-10-05**, clean Ada, required Q1 total-12 `[6,6]` | Actual independent success; lifetime 40 including once-only Q1, current score 20; real canonical success week October 5 and review due October 8 |
| Thursday **2026-10-08**, suggested M01 without suppression | Opens actual successful `lif.math.bridge.r1.total-12`, due-review, familiar=true; null opportunity; practice-only/same-week-used; real reference `{canonicalQuestionId:'lif.math.bridge.r1.total-12', dueLocalDate:'2026-10-08', previousSuccessWeek:'2026-10-05'}` |
| SubmitCheck `[6,6]` | **Committed** under the same local epoch, revision 5 → 6; lifetimeDelta=0, competitiveDelta=0, consumedSlot=null, no receipt or entitlement IDs |
| Persisted logical state | Competition is complete-deep-equal to before the review Check; lifetime remains 40 and quest receipts unchanged. Learning now has 2 Checks / 2 completed episodes / 2 independent successes, with a successful same-week review episode and its exact original reference |
| Ordinary facade export → full decode → v1 migration | Export ready; decode valid; native complete equality against acknowledged save; migration valid and complete equality preserved. Export leaves the acknowledged snapshot unchanged |

Thus the original input traverses the complete pure facade/save/export path successfully; equality is permitted only at the educational provenance boundary rather than creating a new reward opportunity.

## Focused variants and material boundaries

Independent execution completed `2026-10-09T02:39:23.407Z` (**03:39:23 BST**). Four corrected complete paths and three malicious provenance boundaries pass their independent expectations, plus the prior-guard reproduction:

| Case | Result |
|---|---|
| Exact Monday October 5 → Thursday October 8, independent | **PASS**, complete path above, zero awards |
| Same exact dates, hint recorded before review Check | **PASS**, complete commit/export/decode/migration path, 1 independent / 1 supported completion, zero awards, competition/quest receipts unchanged |
| Fresh Monday **October 19** → Thursday **October 22** | **PASS**, genuine same-week due review with null opportunity, zero awards, complete export/decode/migration equality |
| Original October 5 success → legitimate **October 12** review | **PASS**, eligible-review with an opportunity; +20 lifetime/+20 competitive, one reserved slot; export/decode/migration remain valid |
| Completed reference previousSuccessWeek changed to future **October 12**, while episode week remains October 5 | **PASS rejection** by both full-root validator and decoder with original provenance message; input unchanged |
| Completed reference canonical changed to actual other task total-10 | **PASS rejection** by both full-root validator and decoder with original provenance message; input unchanged |
| Actual later-week rewarded opportunity's previousSuccessWeek changed to its earningWeek | **PASS rejection** by owning reward validator and full-root decoder gate, “Bound opportunity lacks eligible selection.” Educational equality does not bypass reward eligibility |

Retained all exact input/candidate roots, tokens, acknowledgements, selected review facts, reward deltas and exports in private evidence:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-validation-fab9c7ea95e54f01911bf317a628ed63/same-week-review-results.json`

The adjacent `same-week-review.mjs` reproduces the native assertions using the bundled Node executable with `NODE_DISABLE_COMPILE_CACHE=1`. Vite SSR uses `middlewareMode=true`, `hmr=false`, private `vite-review-prior` / `vite-review-current` caches and no listener. Both loaders were closed.

## Reused checks and source identity

Reused author evidence rather than rerunning broad suites: original desired-behavior case failed before mutation, and the new backup group was **6 failed / 1 passed** before correction; afterward its seven cases pass. The complete relevant final regression reports **223 tests / 5 files passed**, including **100 backup / 15 transition tests**, with strict scoped TypeScript checks green. These are author results, not independently rerun totals. Independent original-path/variant/boundary results above supplement them.

| Reviewed source / tests | SHA-256 |
|---|---|
| `src/state/backup.ts` | `ec0982f16b1a3336553c3524af1160b5174d2bf7e5cea775007f6c61525721bf` |
| `tests/state/backup.test.ts` | `8de5a2f0d8cb23bb34950b01d07c3ef2fdac373cacf7d5d6df5ab70880b20c02` |
| `src/state/controller.ts` | `bd6b20b3a87b7fdf41a50ef90983122ef88d3b3e7f0fc4003e874039bc360cf4` |
| `src/state/transition.ts` | `2eb5f6d0e78eb20e63905f4dd6a58737f2ae13a4b9a01b94d80a6a71132c047e` |
| `src/learning/select.ts` | `11a97a7f31472437f5446f67864fea72b4fd229042275dfed2c3605bcd59adb2` |
| `src/learning/evidence.ts` | `1f6e70f52c81f1e27aeed5144574648ae80ff803529d9159bccd45c26925001c` |
| `src/rewards/scoring.ts` | `c160c3de147118910fc343987e240bdf525cc2adfec2951cc9772c61c734ad50` |

The backup source hash was checked before and after independent execution. Exact prior-source reconstruction and current identity are embedded in the private result. Report whitespace/conflict-marker inspection passed.

## Evidence limits and disposition

This is complete integrated **pure** facade/reducer/validator/export evidence with a validating in-memory acknowledgement port. It does not claim native IndexedDB durability, reload, browser rendering or audio observations; the facade owner retains its requested native/browser rerun. No browser was required by this assignment. Historical selector test/document cleanup remains with its owner and Controller.

**Scoped independent verdict: PASS.** The causal guard is corrected; exact original and fresh same-week reviews complete without renewed reward, and material rejection/reward boundaries remain enforced. No remaining actionable decoder finding or invalidated correction criterion. Prior backup acceptance remains retained within its recorded limits; Controller alone accepts and integrates this additional correction.
