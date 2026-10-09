# WP03-04A due-review integration correction

Author correction, 9 October 2026. Controller assigned the original learning owner
the producer gap recorded in WP04-04A-HANDOFF. Diagnosis/proposed ownership were
reported before editing. Controller then confirmed port 5182 stopped with no
dependent browser/unit run active and authorized the narrow correction. Source
is now stable for independent recheck and Controller-coordinated browser release.

**Current follow-up status:** Controller reported independent acceptance of the
selector correction. After the separate backup-owner repair, the desired same-week
completion/zero-award/export/decode test also passes. The original failure below
is historical evidence; see the final follow-up section for exact current results.

The initial correction changed only `src/learning/select.ts`, `tests/learning/selection.test.ts`, and this
new report. No facade, backup, shared DTO, config, dependencies, status/ledger,
Git operations, delegation or other-chat messages. The other learning sources
and the historical policy/handoff files were not changed in that initial stage.
Controller later authorized their narrow guidance correction, recorded below.

## Diagnosis and correction

Original complete case: a clean profile succeeds independently on required Q1
bridge total-12 on **2026-10-09**, then requests suggested M01 practice on
**2026-10-12** without review suppression.

| Checkpoint | Original observation | Ownership |
|---|---|---|
| Q1 Check, learning evidence and full-root validation | Correct; support-band review due 2026-10-12; canonical total-12 succeeded in week 2026-10-05 | No defect |
| Calendar/history input | Correct date/week and retained actual success; total-10 has no success | No defect |
| Selector due branch | Chose unseen total-10 and labelled it due-review with null reference | **First semantic divergence, learning producer** |
| Facade/reducer composition | Preserved producer fields | No compensation warranted |
| Full-save validation | Rejected `Review reason/reference mismatch.` before write | Correct rejection of absent review provenance |

The due branch now builds its review pool from tasks with actual canonical
previous-success date **and** week in the supplied committed history. It selects
the oldest available due skill/band within that pool, preserving stable canonical
ordering. In this case it selects total-12 with its real prior-success reference.
It does not fabricate a success for total-10, copy total-12 provenance onto
total-10, or relabel genuine review as ordinary practice.

The optional review precedes normal adaptive selection. When the child skips it,
`suppressDueReviewForVisit=true` bypasses review and the normal unseen-first order
selects total-10 with `reason=adaptive-practice`, null review reference and a first
candidate. With no usable prior-success provenance in a due pool, ordinary
selection proceeds without inventing review facts. Pending canonical continuation,
explicit routes/bindings, finite-band policy and review scheduling are unchanged.

Same-week educational review remains allowed. There is deliberately **no**
previous-week filter in the educational review pool. The existing separate reward
candidate check still requires a later competition week and excludes current-week
Checks. A genuine same-week review therefore retains its real reference and
`reason=due-review` while returning candidate none.

This correction supersedes the historical WP03-04A policy/handoff convention
that an unseen due-band task could be emitted as due-review with a null reference.
The frozen persisted contract cannot represent that combination. Those historical
documents were outside the initial correction's permitted documentation ownership;
the authorized follow-up now updates their current consumer guidance while
retaining historical evidence.

## Full-path results

The new owned test group `review producer through the actual facade and decoder`
uses the delivered M1 catalogue/bindings and actual `createStateController`,
`reduceCommand`, selector, committed activity projection, `validateSave`, facade
backup export and `decodeBackup`. The repository port is isolated in-memory test
data; no IndexedDB/browser/durable-reload claim is made. Every proposed successful
save is validated before the fixture acknowledges a write. No production
downstream normalizer or alternate validator is inserted.

| Case | Exact observed result |
|---|---|
| 9 Oct Q1 success → 12 Oct unsuppressed suggestion | Committed total-12 due-review, familiar=true; reference `{canonicalQuestionId:'lif.math.bridge.r1.total-12', dueLocalDate:'2026-10-12', previousSuccessWeek:'2026-10-05'}`; eligible-review |
| Complete that review with `[6,6]` | Committed; actual reward delta lifetime 20/competitive 20; 2 valid Checks, 2 completed episodes, 2 independent successes, 0 later-distinct; next due **2026-10-19** |
| Export/decode completed later-week review | Facade ordinary export ready; decoder valid; decoded save equals committed save |
| Same original history, skip review | Committed unseen total-10, adaptive-practice, familiar=false, reference null; `[6,4]` Check commits; due remains **2026-10-12**; export/decode valid |
| Missing history / Checked without prior success / missing success date | No fabricated review reference; ordinary adaptive first practice |
| Same-week educational review with unseen tasks still available | Pure selector chooses actual successful canonical task with real due reference and candidate none |

Oldest-due skills, explicit skill/bound routes, suspension/unfinished canonical
continuation, familiar later-week review, current-week Check contamination,
actual late-success week, source compaction and the prior F01/F02 corrections
remain covered by the owned regression suite.

## Historical backup-owner counterexample — now corrected by its owner

**Never repaired or hidden in learning selection.** The original reproducer was:
a clean profile solves Q1
total-12 on **Monday 2026-10-05**. On **Thursday 2026-10-08**, unsuppressed M01
suggested practice opens the same canonical as a genuine due review:

```text
selectionReason: due-review
familiar: true
reviewReference:
  canonicalQuestionId: lif.math.bridge.r1.total-12
  dueLocalDate: 2026-10-08
  previousSuccessWeek: 2026-10-05
opportunityId: null
eligibility.kind: practice-only
```

OpenEncounter commits and `validateSave` accepts its root. SubmitCheck `[6,6]`
then returns exactly:

```text
status: invalid
reason.code: invalid-save
reason.message: Completed review provenance has a mismatched identity/week.
```

The producing learning episode has the correct canonical identity and
`competitionWeekId=2026-10-05`. The decoder's completed-episode check in
`src/state/backup.ts` originally required
`reviewReference.previousSuccessWeek < competitionWeekId`, incorrectly treating
the later-week reward condition as a condition for educational review evidence.
This equality case is explicitly permitted by WP03-04A criteria 3/7. The committed
snapshot and write count remained unchanged on rejection. Fix ownership was backup
validation, not selection or facade. Do not erase the review reference, change its
real week, suppress the review or mint a reward candidate to bypass the check.

The initial owned test was an explicit **characterization of the known rejection**,
not a claim that same-week completion succeeded. The facade author's transition
test `Monday success → Thursday educational review is zero-award practice but
retains valid learning completion` asserted desired behavior and was red in the
recorded run below. The backup owner has since repaired that guard, and the owned
characterization has been replaced with desired successful completion/export/decode
assertions. Current evidence is in the follow-up section.

## Initial correction commands and evidence (historical)

Repository cwd: `C:/Users/alexb/Documents/ChatGPT/Learning is Fun`.
All Node commands used the bundled executable directly. No shared compiler or
Vitest cache was enabled.

1. Before correction:

   ```powershell
   & 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/state/transition.test.ts -t 'producer-owned due-review gap' --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
   ```

   1 passed / 11 skipped: this retained test expected the original invalid-save
   rejection. It established the reproducer, not successful requested behavior.

2. After correction, full owned producer/facade/decoder cases:

   ```powershell
   & 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/learning/selection.test.ts -t 'review producer through' --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
   ```

   3 passed / 77 skipped. Two positive complete paths and the explicit separate
   same-week rejection characterization described above.

3. Scoped production and fixture typecheck:

   ```powershell
   & 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node --verbatimModuleSyntax src/learning/evidence.ts src/learning/select.ts src/learning/summarize.ts tests/learning/evidence.test.ts tests/learning/selection.test.ts tests/learning/summary.test.ts
   ```

   Exit 0, no diagnostics after fixture corrections.

4. Relevant owned/producer/decoder regression:

   ```powershell
   $env:TZ = 'America/Los_Angeles'
   & 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/learning/evidence.test.ts tests/learning/selection.test.ts tests/learning/summary.test.ts tests/learning/contracts.test.ts tests/learning/identity.test.ts tests/rewards/calendar-date.test.ts tests/state/contracts.test.ts tests/state/backup.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
   ```

   **8 files / 379 tests passed**, including **120 owned learning tests**. The
   passing total includes the known-rejection characterization; it does not
   resolve the separate backup-owner gap.

5. Facade owner's evolving transition suite, read/run only:

   ```powershell
   & 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/state/transition.test.ts -t '^(?!.*producer-owned due-review gap)' --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
   ```

   **14 passed / 1 failed**. By this run, the facade author had replaced the old
   rejection test and added desired review cases, so the pattern selected all
   15 current tests. Original later-week reproduction and exhausted-bank review
   passed. The only failure was same-week review completion at the decoder,
   with the exact message retained above. No edit to that suite was made here.

6. Exact three-changed-path whitespace/conflict-marker scan passed.

Intermediate failures were fixture construction defects: an explicit undefined
argument re-enabled a default profile ID on CreateProfile; Vitest array cases
were spread rather than passed as a history array; and a test-only `findLast`
exceeded the scoped ES2022 library. Corrected the fixture arguments/case wrappers
and used reverse/find. No extra production correction was made for those errors.

At the end of the initial correction, independent recheck was pending; the selector
and its original full path were green, while same-week decoding remained open for
the separate owner. Browser persistence checks on port 5182 remain the facade
author's evidence and were neither controlled nor claimed here.

## Follow-up after backup-owner repair — 9 October 2026

Controller confirmed the selector correction independently accepted and the
backup-owner source stable, with independent backup recheck running. The decoder
now permits previous-success week equal to completed educational-review week;
reward eligibility retains its separate strict later-week condition. This author
did not edit or independently accept the backup repair.

Replaced the known-rejection characterization with
`same-week educational review completes with zero award and export/decode equality`.
The same clean-profile dates and canonical task were retained. Observed results:

- Q1 total-12 independent success on 2026-10-05; review opens on 2026-10-08 with
  genuine due-review reason, same canonical reference, previous week 2026-10-05,
  `familiar=true`, practice-only eligibility and no reward opportunity.
- Correct `[6,6]` Check commits exactly one additional write. Lifetime and
  competitive deltas are both zero; new receipt keys are empty. Lifetime remains
  40, weekly score remains 20, one existing slot remains, and allocated reward
  ordinal remains 1.
- Learning has 2 valid Checks, 2 completed episodes, 2 independent successes and
  0 later-distinct successes. The dated familiar review outcome is independent
  success on 2026-10-08 in week 2026-10-05; next due date is **2026-10-15**.
- The completed encounter retains its real review reference and null opportunity.
  Ordinary facade export returns ready; decode returns valid and its entire save
  equals the committed save.

Only these four files changed in this follow-up:

1. `tests/learning/selection.test.ts`
2. `docs/content-review/learning-policy.md` (the actual original policy path)
3. `docs/work-package/execution/WP03-04A-HANDOFF.md`
4. `docs/work-package/execution/WP03-04A-INTEGRATION-CORRECTION.md`

The current policy/handoff now require genuine canonical previous success for
review, preserve skip-review unseen-first practice, and distinguish same-week
educational review from later-week reward eligibility. Original rejection and
earlier verification results remain documented as history. No production selector
or other owner's tests/reports/shared ledger were edited; no Git or delegation.

Only the affected test and typecheck were run:

```powershell
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vitest/vitest.mjs run tests/learning/selection.test.ts -t 'same-week educational review completes' --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node --verbatimModuleSyntax tests/learning/selection.test.ts
```

Both exited 0: **1 test passed / 79 skipped**; TypeScript emitted no diagnostics.
No broad suite was rerun. The exact four-path whitespace/conflict-marker scan
passed. The fixture uses the real facade/reducer/validator/export/decoder with
an in-memory repository port, so browser/IndexedDB persistence evidence and the
backup-owner independent recheck remain separate.
