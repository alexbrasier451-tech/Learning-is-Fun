# WP03-04A implementation handoff

Implemented 9 October 2026 under the explicit execution assignment, consuming the
independently accepted WP03-01A, WP05-01A and WP04-01A handoffs and actual DTOs.
This is author evidence; Controller retains independent review, acceptance and
commit authority. No commit, Git operation, other-chat message or worker creation
was performed.

The original author snapshot below is retained. The F01/F02 correction section
at the end supersedes its initial completeness assessment and test totals.
The later integration correction and same-week follow-up below supersede the
original review-provenance convention. Current consumer guidance is maintained
in the Consumer expectations section and the learning policy.

## Changed files and behavior

- `src/learning/evidence.ts`: pure `applyLearningObservation`; valid-Check totals,
  sticky active-episode assistance/issues, completed episode windows, independent/
  supported/retry/later-distinct counts and civil review dates. Completion-only
  finish never adds a Check. Only the primary registry objective is updated.
- `src/learning/select.ts`: pure `resolveBindingIntent` and `selectNextActivity`;
  ordered story resolution, immutable source-derived transfer, bounded revisit
  pools, retained canonical continuation, available-band policy, optional review,
  finite familiar practice and advisory reward candidates.
- `src/learning/summarize.ts`: pure `summarizeLearning`; factual aggregate counts,
  retained distinct counts, dated outcomes, assistance/familiar qualifiers,
  current/delivered bands, review status and explicit missing evidence.
- `tests/learning/evidence.test.ts`, `tests/learning/selection.test.ts`,
  `tests/learning/summary.test.ts`: 94 controlled tests, including an independently
  specified fresh E08 resolver → selection → evidence → summary sequence.
- `docs/content-review/learning-policy.md`: heuristic status, authority and DTO
  assumptions, finite-pool/current-band conventions, A/B/C/D acceptance table,
  explicit calendar examples and downstream expectations.
- This handoff.

No changes to shared DTOs, state, delivered starter content, assets, config,
dependencies, package ledgers or other authors' files.

## Criteria mapped to evidence

| WP03-04A criteria | Owned evidence and observed result |
|---|---|
| 1, 6: three distinct among four; replay/retry insufficient; support; isolation; missing content | Selection tests name A/B/C/D, pin independent A/helped D/B/C → stretch, A/A/A → core, familiar A/B/C → core, three wrong Checks plus success in A → one episode, two completed helped/unsuccessful episodes → support. Still-open wrong does not close evidence. M01 struggle leaves E06 unchanged. Missing next/lowest bands, delivered/absent prerequisites and highest-band behavior are checked. |
| 2, 7: civil review dates and optional skip | Evidence pins 2026-10-23 → 2026-10-26 → 2026-11-02; missed supported review 2026-11-05 → 2026-11-08; finished unsuccessful 2026-11-09 → 2026-11-12. Selector suppression keeps evidence/due dates byte-for-byte unchanged across requests; no failure is introduced. Shared calendar tests exercise London Monday/DST under independent host zones. |
| 3: familiar review, unchanged identity, pending help/free practice, late success | Selection snapshots pin same-week due practice → none, later actual-success week → review candidate, old earning week plus current-week actual success → none, rollover without review → none, same-week free-practice Check → none. JSON-round-tripped hinted pending work resumes its original ID/reason/provenance and never creates a fresh candidate. |
| 4: suitable independent/supported/listening/mixed evidence and factual summaries | Summary snapshot pins independent, supported, retry subset and later-distinct totals; listening E08 and mixed M04 remain qualified successes. Contextual M02/E08 are not manufactured by M04. No percentage/score/quest-lock output. Fresh E08 path ends with 3 Checks/3 episodes, 2 independent/1 supported, 1 later-distinct and due 2026-11-03 after familiar review. |
| 5: pure serializable outputs; invalid/incomplete inputs | Deep-freeze and serialized before/after assertions for reducer, selector and summary; unaffected skill/band identities preserved. Wrong/zero-Check finish, malformed indexes, stale active-episode facts, incomplete/invalid event tags and missing retained descriptor cases add no attempts. Import/runtime boundary test excludes state/UI/storage/playback/clocks/ID allocation in owned modules. |
| 8: neutral controls versus sticky assistance | Neutral narration/mute/Stop/Silence-all event probes return unchanged evidence. Text/spoken answer hints use the same sticky flag, worked support is qualified, and listening mode remains explicit in completed reading evidence. These are pure facts, not audible/UI acceptance. |
| 9: DEC-024/025 exact episode sequence | A/episode 1 wrong sequence 1 plus hint leaves 1 Check/0 completed. Deliberate finish gives 1 Check/1 unsuccessful episode. Return A/episode 2 correct cumulative sequence 2 with inherited hint gives 2 Checks/2 episodes/1 supported retry/0 independent. Zero-Check finish remains unchanged. |
| 10: binding/transfer/resume | Omitted binding selects first incomplete ordered story row. Optional-as-story, mismatched quest, unknown/completed/inaccessible/M2-only/malformed rows are unavailable. Permanent source completion with no retained source encounter yields transfer B/C excluding A. Revisit stays revisit. Pending work retains its old provenance even through a fresh story route. No usable bound pool yields no task. Results never add permanent completion. |

Full input/expected-output rows live in tests, with a compact readable table in
`docs/content-review/learning-policy.md`. Fixture approval is synthetic test data,
not a review or release of new educational content.

## Exact commands and results

Working directory: `C:/Users/alexb/Documents/ChatGPT/Learning is Fun`.
Each `node` below was invoked directly as:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

1. Final scoped production/fixture typecheck:

   ```powershell
   & 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node --verbatimModuleSyntax src/learning/evidence.ts src/learning/select.ts src/learning/summarize.ts tests/learning/evidence.test.ts tests/learning/selection.test.ts tests/learning/summary.test.ts
   ```

   Exit 0, no diagnostics. No incremental compiler cache or build output.

2. Final relevant regression suite, explicitly changing only this command
   process's host timezone:

   ```powershell
   $env:TZ = 'America/Los_Angeles'
   & 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/learning/evidence.test.ts tests/learning/selection.test.ts tests/learning/summary.test.ts tests/learning/contracts.test.ts tests/learning/identity.test.ts tests/rewards/calendar-date.test.ts tests/state/contracts.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
   ```

   Exit 0: **7 files, 260 tests passed**. Owned three suites contain 94 tests;
   accepted learning identity/DTO, calendar and state DTO suites supply the other
   166. Shared calendar tests also spawn Los Angeles/Tokyo contexts and pin their
   London outputs. No broad gameplay/build/browser tests or shared test caches.

3. Exact owned-path whitespace/conflict-marker scan (PowerShell, eight listed
   files) passed. No Git command was used.

The first behavioral run passed all then-existing 92 tests. The independent
typecheck found one test-fixture defect: summary task stubs omitted required
TaskDefinition fields. They were replaced with complete typed fixture objects;
no production behavior changed for that failure. During subsequent author review,
same-date summary ordering was corrected to return the latest within-band review
and episode first; its regression and the fresh E08 sequence brought the owned
total to 94. Final commands above passed after those changes.

## Consumer expectations and limits

WP03-05A can use the actual three public policies plus resolver with its delivered
approved catalogue. The selector shares `learningBandPolicy` with the summary to
avoid competing heuristics; helper exports stay in the owned modules. Band
availability is derived from supplied tasks, never registry declarations.

Date-only DTOs have no global within-day cross-band sequence. The policy uses the
latest completed date with higher-band tie-break; within a band array order is
authoritative. Review/episode/retained-success-ID windows are bounded to four per
band; aggregates are cumulative. A due review selects a task with an actual
canonical previous-success date and week, and retains a non-null reference for
that same task. Unseen tasks remain ordinary adaptive practice. Suppressing review
restores unseen-first selection and preserves the due date. Genuine same-week
educational review is valid and nonrewardable; the later-week condition belongs
only to reward eligibility. See the integration correction below for evidence
superseding the original unseen-task/null-reference assumption.

WP04-04A must supply sticky cumulative facts after completion, including the
exact DEC-024 fixture above; filter duplicate finish/Check once before invoking
the reducer; keep zero-Check finish invalid; retain pending canonical descriptors,
help and immutable provenance through reload; and apply learning/world/reward
results atomically. Selection does not alter permanent binding completion.
Only a later correct committed story-bound judged Check can do that.

For WP04's reward adapter, preserve the accepted translation: story-anchor →
story, transfer/adaptive-practice → adaptive, due-review → due-review,
child-easier/repeat-practice → child-practice. A resumed result returns candidate
none and its retained encounter ID: inspect the original reward opportunity and
cumulative facts; do not allocate a fresh one. No educational episode completion
requests reward completion or compaction. WP05 remains the only eligibility,
earning-week, slot and numeric award authority.

No material frozen-contract defect or unresolved check failure was found. Actual
commit/reload/duplicate rejection, failed-save rollback, assistance-before-display,
world completion, audio behavior, UI visit suppression, full catalogue assembly
and published play remain WP04/WP02/WP03-05A/WP06 integration evidence. These pure
tests do not claim those outcomes. No storage, DOM, audio, ambient wall clock,
ID allocation, competition cap accounting or reward allocation was introduced.

## Independent review corrections F01/F02 — 9 October 2026

Read the independent validation report and executed its retained JavaScript
unchanged before editing. The result exactly reproduced **8 passed / 3 failed**:
later-distinct after four and five unsuccessful episodes, and multi-task M1 story
acceptance. The other eight controls passed. No validator-report edits were made.

**F01 causal repair:** the first divergence was the reducer's use of the bounded
recent-success IDs as proof that any prior success existed. Four unsuccessful
episodes evicted helped A while cumulative `correctChecks` remained 1. The reducer
now uses that aggregate, together with the authoritative original non-familiar
flag, to count later distinct success. The existing recent same-ID exclusion
remains a replay guard. Under the committed-observation contract, an unresolved
non-familiar B remains non-familiar across episodes; a prior correct Check cannot
be a previous success of that same still-unresolved encounter. Familiar replay
is excluded. No full history, DTO extension or summary masking was introduced;
the bounded completed/ID windows remain four.

The original observation → reducer → summary path now produces:

| Unsuccessful B episodes after helped A | Checks / episodes | Supported / retry / later-distinct | Summary missing-later-distinct message |
|---|---|---|---|
| 0 | 2 / 2 | 1 / 0 / 1 | Absent |
| 3 | 5 / 5 | 2 / 1 / 1 | Absent |
| 4 | 6 / 6 | 2 / 1 / 1 | Absent |
| 5 | 7 / 7 | 2 / 1 / 1 | Absent |
| 8, fresh boundary extension | 10 / 10 | 2 / 1 / 1 | Absent |

Additional complete-path regressions cover earlier independent A and helped B
after 3/4/5 unsuccessful episodes; no prior success; familiar same-task replay
after eviction; and prior success only in another skill or band. Negative cases
retain zero later-distinct successes. Windows and aggregate totals are asserted
separately so widening the window cannot conceal the defect.

**F02 causal repair:** `resolveBindingIntent` now requires exactly one task when
the row is both M1 and story. The row retains that rule even under an M2 request.
The original route → resolver counterexample returns exactly
`{status:'unavailable', reason:'invalid-binding'}`, so no validated intent reaches
selection. New tests cover omitted/explicit binding IDs, same-/mixed-band malformed
pools, current M1/M2 milestones, and legal multi-task M2 story/M1 transfer/M1 revisit
route → resolver → selection flows. Existing singleton/compacted-source controls
remain passing. The prerequisite fixture now uses a legitimate M1 revisit pool,
rather than an invalid two-task M1 story row.

Correction edits are limited to six originally owned files: `evidence.ts`,
`select.ts`, their two test files, the policy and this handoff. `summarize.ts` and
its tests needed no masking or correction for these findings. No contracts,
validator report, shared configuration, dependencies, ledger or other author
files were changed; no commit or Git operation.

### Exact correction verification

The retained independent harness was extracted and executed without writing a
script file. Before repair it exited 1 with 8/3; immediately after both causal
repairs the **same command exited 0 with 11 passed / 0 failed**:

```powershell
$env:NODE_DISABLE_COMPILE_CACHE = '1'
$learningReviewReport = Get-Content -LiteralPath 'docs/work-package/execution/WP03-04A-VALIDATION.md' -Raw
$learningReviewScript = [regex]::Match($learningReviewReport, '(?s)```javascript\r?\n(.*?)\r?\n```').Groups[1].Value
$learningReviewScript | & 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --input-type=commonjs
```

Native TypeScript stripping emitted its experimental-feature warning, as in the
original review; all eleven semantic assertions executed. The successful result
includes the original complete observation → evidence → summary cases and the
route-resolution/selection controls, not component-only substitutes.

After adding 19 owned regressions, reran the exact scoped TypeScript command and
seven-suite timezone-controlled Vitest command in the earlier commands section:
both exited 0. **7 files / 279 tests passed, including 113 owned tests.** Caches
remained disabled and no incremental compilation/build output was created.
Final exact eight-owned-path whitespace/conflict-marker scan passed.

No correction check remains red. These are author results for a narrow independent
recheck of F01/F02; the validator's historical verdict is deliberately unchanged.
All original downstream integration limits remain in force.

## Accepted selector integration correction and same-week follow-up

On 9 October 2026, Controller reported independent acceptance of the selector
correction described in
[WP03-04A-INTEGRATION-CORRECTION](WP03-04A-INTEGRATION-CORRECTION.md).
The historical implementation had labelled unseen total-10 as due-review with
null reference after Q1 total-12 success; full-save validation correctly rejected
that mismatch. The corrected optional review selects total-12 with its actual
prior-success reference. Skip-review still selects unseen total-10 as ordinary
practice. No shared DTO or downstream relabelling was used.

The separate backup owner then corrected same-week completed-review validation.
The owned rejection-characterization test has now been replaced with desired
full-path assertions: Q1 success on 2026-10-05 → genuine review on 2026-10-08 →
correct Check commits with zero lifetime/competitive delta and no new receipt,
slot or opportunity → learning review due 2026-10-15 → ordinary facade export
and decode produce a save equal to the committed save. Real review provenance
is preserved throughout. The in-memory repository fixture makes no IndexedDB
or browser persistence claim.

This follow-up changed only `tests/learning/selection.test.ts`,
`docs/content-review/learning-policy.md`, this handoff and the integration report.
No production selector, backup, facade or other owner's files were edited.
The affected test passed (1 passed / 79 skipped); the scoped TypeScript check
of the selection test and its imported production modules passed. Exact commands
and original/corrected outcomes are in the integration report. Earlier broad
totals are retained as historical evidence, not a claim of a new broad run.
The backup owner's independent recheck remains separately controlled.
