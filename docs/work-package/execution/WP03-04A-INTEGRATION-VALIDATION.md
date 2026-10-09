# WP03-04A integration correction — independent validation

9 October 2026. Original independent WP03-04A reviewer; not the correction author.

**Current verdict: ACCEPTED for the scoped selector correction and its final test/guidance follow-up. No new learning finding.** Later-week review, skipped review and same-week zero-award completion now pass the affected facade/export/decode group. The former same-week rejection below is historical; see the final continuation. This records successful learning-consumer integration, not an independent verdict on the backup runtime repair or the complete facade/browser stage. Those remain with their assigned validators and Controller.

## Scope and authority

Read [WP03-04A-INTEGRATION-CORRECTION](WP03-04A-INTEGRATION-CORRECTION.md), the affected selector/test changes, actual facade-to-selector and saved-observation mappings, the completed-episode/encounter decoder guards, and the relevant transition tests. Compared the changed due branch with the original implementation retained in this review context; no Git command was used. The requested `tests/learning/select.test.ts` does not exist: the actual changed and reviewed file is **`tests/learning/selection.test.ts`**.

This is a narrow continuation of the earlier review. The accepted F01/F02 corrections and other passing assessments are retained, not re-audited. Reused the correction author's scoped typecheck and **379 passing relevant tests**; that total includes a characterization of the known decoder rejection, not successful same-week completion. Also retained the author's 14-pass/1-known-failure facade evidence without repeating that full suite.

The correction report records Controller authorization for the changed selection behavior and supersedes the historical unseen-task/null-reference review convention. The original policy/handoff and earlier validation are historical on that particular convention. This review changes none of those shared/other-owned documents.

## Causal assessment

`src/learning/select.ts:174–187` now restricts the optional due-review pool to canonical tasks with both actual previous-success date and week in committed history. It selects the oldest usable due skill/band and then its stable canonical order. Ordinary adaptive selection retains unseen-first order when review is suppressed or no usable canonical review exists. The correction changes the producing selection decision rather than fabricating history or weakening downstream validation.

The unchanged reward-candidate predicate remains separate: educational same-week review is permitted, but a review candidate requires a later competition week and no current-week Check. The new pool has **no earlier-week-only filter**. Pending continuation, explicit bound routes, saved provenance, band policy and review scheduling are unchanged by the correction.

| Checkpoint | Original defect / corrected observation | Assessment |
|---|---|---|
| Clean Q1 success 2026-10-09 | Actual total-12 success, week 2026-10-05; support review due 2026-10-12 | Correct authoritative input |
| 2026-10-12 selector | Previously unseen total-10, due-review, null reference; now actual successful total-12 with its own reference | Earliest divergence repaired in learning producer |
| Facade/reducer persistence | Preserves selected canonical/reason/reference; no normalization inserted | Correct consumer behavior |
| Open/check validation and commit | Corrected review opens and completes; both candidate roots validate | Original integrated blocker removed |
| Ordinary export/decode | Ready export; valid decode equal to committed save | Complete original path green |

The in-memory repository test port checks each proposed root with the actual `validateSave` before acknowledging a write. The controller, reducer, selector, projection, reward policy, export and decoder are production implementations. This provides pure integrated evidence, not native IndexedDB durability or browser-reload evidence.

## Independently observed outcomes

| Case | Result |
|---|---|
| Original 9 Oct Q1 total-12 success → 12 Oct suggested M01, no suppression | **PASS.** Opens committed total-12, due-review, familiar=true; reference `{canonicalQuestionId:'lif.math.bridge.r1.total-12', dueLocalDate:'2026-10-12', previousSuccessWeek:'2026-10-05'}`; eligible-review. |
| Complete original review with `[6,6]`, then export/decode | **PASS.** Committed +20 lifetime/+20 competitive; 2 Checks/2 completed episodes/2 independent successes/0 later-distinct; next due 2026-10-19. Export ready, decode valid and save equality verified. |
| Same original history, suppress review | **PASS.** Committed unseen total-10, adaptive-practice, familiar=false, null reference. `[6,4]` commits; due remains 2026-10-12; export/decode valid. |
| Same-week genuine review with unseen work still available | **PASS at selection/open.** Chooses the successful canonical with real reference, candidate none; integrated encounter has null opportunity and practice-only eligibility. Completion remains the separate failure below. |
| Missing history, checked-without-success, or missing success date | **PASS.** Ordinary adaptive practice, no invented review provenance. |
| Oldest due skill, explicit skill/route/suppression, delayed actual-success week and current-week Checks | **PASS in selected affected tests.** Educational selection and reward advisory remain separate. |
| Original reducer reproduction and exhausted-bank genuine review | **PASS.** Transition-level desired-behavior tests preserve canonical identity and fold real reward ordinals. |
| Fresh missed-date case: 9 Oct success → review requested 19 Oct | **PASS.** Total-12 retains due date 12 Oct and previous success week 5 Oct; correct Check commits +20/+20, next due 26 Oct; export/decode equals committed save. |
| Fresh pool counterexample: older M01 due date without usable success history, later E06 due date with actual successful P | **PASS.** Unspecified skill selects P as genuine E06 review; explicit M01 falls back to ordinary practice with null reference. Frozen input serialization is unchanged. |

For the final fresh counterexample, synthetic A/M01/core succeeds on 2026-10-19 (due 22 Oct), P/E06/core on 20 Oct (due 23 Oct), but only P has supplied canonical prior-success history. At 26 Oct, the review reference belongs to P and uses due 23 Oct/previous week 19 Oct. This explicitly verifies that due dates alone cannot invent canonical provenance and that an unusable older pool does not suppress the next usable review.

## Retained P2 — backup decoder rejects same-week educational completion

**Owner:** WP04 backup validation, `src/state/backup.ts:225`, not WP03 selection or the facade adapter. This is the already known external defect, independently reproduced, not an additional selector finding.

Clean Q1 total-12 success on Monday **2026-10-05**, then suggested M01 on Thursday **2026-10-08**, opens a genuine due review with:

```text
canonicalQuestionId: lif.math.bridge.r1.total-12
selectionReason: due-review
familiar: true
reviewReference.dueLocalDate: 2026-10-08
reviewReference.previousSuccessWeek: 2026-10-05
opportunityId: null
eligibility.kind: practice-only
```

The open root validates and commits. Completing `[6,6]` returns:

```text
status: invalid
reason.code: invalid-save
reason.message: Completed review provenance has a mismatched identity/week.
```

The completed episode correctly has the same canonical and `competitionWeekId=2026-10-05`. The decoder requires `reviewReference.previousSuccessWeek < competitionWeekId`; equality is rejected. That applies the later-week **reward** condition to educational evidence, contrary to WP03-04A criteria 3/7. The independent desired-behavior transition test fails at this validation boundary. The separate characterization verifies no new write or committed snapshot escaped rejection.

No selector compensation is appropriate: do not suppress same-week review, fabricate an earlier success week, remove its reference, relabel it as ordinary practice or allocate a reward opportunity. Backup ownership must repair its completed-evidence condition and rerun successful same-week completion/export/decode. The current green characterization will then need updating; it must not be mistaken for acceptance of the rejected behavior.

## Verification commands and evidence

All commands ran from `C:/Users/alexb/Documents/ChatGPT/Learning is Fun`, using bundled Node, process-local `NODE_DISABLE_COMPILE_CACHE=1`, disabled Vitest caches and one worker. No shared compiler cache/build output or browser/port operation was performed.

```powershell
$env:NODE_DISABLE_COMPILE_CACHE = '1'
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/learning/selection.test.ts -t 'review producer through|genuine canonical review|usable previous success|same-week|oldest due skill|late success' --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
```

**Exit 0: 13 passed / 67 skipped.** Includes both full positive facade/export/decode paths and the explicit known-rejection characterization. Skipped tests are not independently rerun evidence.

```powershell
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/state/transition.test.ts -t 'original due-review reproduction|Monday success|eligible due review after all' --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
```

**Exit 1: 2 passed / 1 failed / 12 skipped.** Only the desired same-week completion test failed, with the exact decoder error above. Original and exhausted-bank later-week cases passed.

Two independently specified fresh probes were run in the authorized temporary `tests/learning/wp03-04a-independent.tmp.test.ts`, using only copied fixture constructors/in-memory repository helper and actual imported production implementations. `vitest run` of that exact path with the same disabled-cache/one-worker flags **exited 0: 2 passed**. The missed-date and unavailable-oldest-pool inputs/expected outcomes are retained above. The temporary file was removed after execution and its absence checked. No production or retained test source was modified.

Reused, without claiming an independent rerun: author's **379 relevant tests/typecheck passing** and **14 passed/1 known failure** full transition evidence. No broad new audit or browser run was needed for this correction; port 5182 was not touched.

## Reviewed snapshots and written files

| Reviewed file | SHA-256 |
|---|---|
| `src/learning/select.ts` | `11a97a7f31472437f5446f67864fea72b4fd229042275dfed2c3605bcd59adb2` |
| `tests/learning/selection.test.ts` | `b69e9e14039a4892d610c5d3a9c89721f43b8054f93123342615cdbd5f12ef1d` |
| `src/state/backup.ts` | `640adcefbc94d998ec7bdd7e5574dff9b05d753a114cb7d43d37fc48f61da661` |
| `tests/state/transition.test.ts` | `56d2a434f2671c9536f8577d7370e9f7f96ab2bac63ec57f104bd6b7190ea48c` |
| `docs/work-package/execution/WP03-04A-INTEGRATION-CORRECTION.md` | `4d7178295047f5a12f6a9b1ced54fd2174d425bb640b18a9ddae835ead8418b3` |

**Persistent reviewer output:** only `docs/work-package/execution/WP03-04A-INTEGRATION-VALIDATION.md`. The sole temporary probe was removed. No fixes, shared-document/ledger/configuration/dependency edits, Git operations, delegation or other-chat messages. Earlier F01/F02 acceptance remains intact. Native persistence, browser behavior and complete same-week review acceptance remain outside this scoped selector verdict.

## Final continuation — same-week success test and current guidance

9 October 2026. **ACCEPTED within this narrow follow-up scope; no substantive finding.** The earlier selector acceptance remains unchanged. The backup owner supplied a stable correction under separate independent review. This reviewer inspected the replacement learning test and changed guidance, and executed only the affected full-path test group. No earlier selector counterexample suite, broader audit, backup-runtime audit or browser run was repeated.

### Changed expectations and observed result

`tests/learning/selection.test.ts` replaces the known-rejection characterization with `same-week educational review completes with zero award and export/decode equality`. It keeps the exact original Monday 2026-10-05 Q1 total-12 success → Thursday 2026-10-08 review input. The test retains the genuine canonical review reference and verifies:

- Practice-only eligibility and null reward opportunity before completion.
- Correct `[6,6]` commits exactly one additional write and changes the acknowledged snapshot.
- Lifetime/competitive deltas are both zero and `newReceiptKeys` is empty; lifetime remains 40, weekly score 20, existing slot count 1 and allocated ordinal 1.
- Learning records 2 Checks, 2 completed episodes, 2 independent successes and 0 later-distinct successes. The familiar independent review is dated 2026-10-08 in week 2026-10-05; next due is 2026-10-15.
- Completed-success encounter retains its real review reference and null opportunity. Ordinary facade export is ready; decode is valid and its entire save equals the committed save.

These assertions exercise the actual facade/reducer/validator/export/decoder path with the already inspected in-memory repository helper. They establish desired successful behavior rather than treating a known rejection as a passing product outcome. The original later-week review and skipped-review cases also pass in the same group.

### Guidance review

The current `learning-policy.md` and handoff consumer guidance now consistently require actual canonical previous-success date/week and a non-null same-canonical reference for due review. Unseen work remains ordinary adaptive practice; skip restores unseen-first selection without erasing the due date. Same-week educational review and its zero-award completion are distinguished from strictly later-week reward eligibility. The integration correction report labels the original rejection and old test totals as historical, and records the later authorized guidance changes and successful same-week path. No obsolete unseen/null-review statement remains presented as the current consumer rule in these changed passages.

The production selector hash is unchanged from the preceding integration review. No selector compensation or further production selection change was introduced. The earlier backup-owned P2 reproduction in this report is retained as historical evidence; **its original consumer path is now green, while the backup repair's overall independent acceptance remains exclusively with the backup validator**.

### Exact independent verification

```powershell
$env:NODE_DISABLE_COMPILE_CACHE = '1'
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/learning/selection.test.ts -t 'review producer through the actual facade and decoder' --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
```

**Exit 0: 3 passed / 77 skipped.** All three are now positive complete-path tests. Reused the author's successful scoped selection-test/imported-module typecheck; no broad rerun is claimed. The historical 379-test total was not rerun or relabelled as new evidence.

### Follow-up file hashes

| File | SHA-256 |
|---|---|
| `tests/learning/selection.test.ts` | `f9c9b35e941b074cf6044945860ec0c547fb688c9706d8c7d7dcccdd5538a5d5` |
| `docs/content-review/learning-policy.md` | `dc6cc9966087912646c7ef723dc7f3693a06f68718724cbcac63637dd1cfa78a` |
| `docs/work-package/execution/WP03-04A-HANDOFF.md` | `3bce8f35cc806be082791aaf46eab523891c85cb1221a4df05210f461279bb13` |
| `docs/work-package/execution/WP03-04A-INTEGRATION-CORRECTION.md` | `e16b401c4c9d3fa646d18ec493b4d94c8bd7a2b3b179a91f1c4e28859eeb6b3e` |
| `src/learning/select.ts` — unchanged | `11a97a7f31472437f5446f67864fea72b4fd229042275dfed2c3605bcd59adb2` |

Only this integration validation report was updated by the reviewer in this continuation. No temporary probe, other file write, production fix, Git operation, delegation, other-chat message or port 5182 operation was performed. Browser/IndexedDB durability and independent backup-runtime acceptance remain outside this result.
