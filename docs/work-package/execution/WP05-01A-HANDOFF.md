# WP05-01A implementation handoff

Implemented on 8 October 2026 under GLOBAL_RULES current execution authority,
after Controller released DEP-002 following WP03-01A independent acceptance.
Independent validation and administrative acceptance remain Controller-owned.

## Files and behavior

- `src/rewards/contracts.ts`: pure readonly JSON reward, competition, records,
  reconciliation and leaderboard DTOs; its sole import is learning **types**.
  No state/experience/controller dependency, allocation or scoring implementation.
- `src/rewards/calendar.ts`: validated London date extraction, Monday keys and
  civil-day arithmetic; exported typed `CalendarError` has code `invalid-date`
  or `unsupported-zone`. Explicit zone failure never substitutes the host zone.
- `tests/rewards/calendar-date.test.ts`: controlled date fixtures, two actual
  process host timezones, unsupported-Intl simulations and imported DTO fixtures.
- This handoff is the only execution document written by this worker.

## Frozen consumer interfaces

`LocalDate = string` is a validated Gregorian `YYYY-MM-DD` civil-date value,
years 0001–9999; `WeekKey = LocalDate` additionally denotes Monday. They remain
JSON strings, compatible with learning's existing date fields. Date helpers
validate runtime input; later save/competition validators own stored-field
validation. Out-of-range arithmetic and BCE/expanded-year instants are typed
failures. UTC is solely the neutral date arithmetic carrier, not London midnight.

Exact implemented utility signatures:

```ts
localDateAt(epochMs: number): LocalDate
weekKeyFor(date: LocalDate): WeekKey
addCalendarDays(date: LocalDate, days: number): LocalDate
CompetitionClock = Readonly<{ nowEpochMs(): number }>
```

`days` must be a safe integer. Intl uses `en-GB`, explicit `Europe/London`,
`gregory`, `latn` and year/month/day `formatToParts`; the additional short era
part prevents a BCE instant being mistaken for a positive civil year. Formatting
support and resolved zone/calendar/numbering system are checked. No dependency,
localized-text parsing, ambient clock read or elapsed London-day arithmetic.

Exact policy handoffs are exported types, with no fake closure/scoring function:

```ts
CalendarContext = { observedLocalDate, activeWeek, clockRollback }
CompetitionProfile = { profileId, nickname, avatarId, lifetimePoints, personalRecords }
ReconciliationInput = { competition, profiles: readonly CompetitionProfile[] }
ReconciliationResult = {
  nextCompetition, nextPersonalRecordsByProfile, context, closedWeekChanges
}
ClosedWeekChange = { week, result: ClosedWeekResult }
ReconcileCompetitionWeek =
  (input: ReconciliationInput, nowEpochMs: number) => ReconciliationResult
RewardCheckInput = {
  profileId, encounterId, opportunityId, submissionId, checkSequence, validChecks,
  track, rewards, evaluation, assistance, selection, competition, context
}
RewardCheckResult = { nextRewards, nextCompetition, delta }
```

`RewardCheckInput` uses stored **pre-Check** `validChecks`, next cumulative
`checkSequence`, judged `EvaluationResult` and `LearningAssistance` imported from
WP03. `track`/`opportunityId` may be null for fresh free practice. Submission and
encounter tokens remain separate from opportunity identity and ordinal; no
learning episode ordinal enters any reward receipt key. WP04 owns replay guards.

`EligibilityResult` is exactly eligible-first/first-encounter,
eligible-review/selected-due-review, resume-existing/unfinished-opportunity, or
practice-only with same-week-used, child-practice, not-due,
unfinished-free-practice or familiar-repeat. Classification promises no slot.

Opportunity components are `{ answer, independentSuccess, supportedSuccess }`
boolean flags; the type requires answer before success and forbids both success
flags together. `RewardReceipt` is `{ key, amount }`: opportunity/component keys
pin answer/independent-success/supported-success to 5/15/5; profile/quest keys
pin lifetime-only quests to 20. `questReceipts` stores those profile/quest keys;
`ScoreDelta.newReceiptKeys` accepts either key shape. Slots are the integer union
1–30; optional `consumedSlot` is the actual new slot or null/absent.

Opportunity/track fields match the child, including nullable unbound week/slot,
optional actual-success dates/weeks, completion high-water/compact totals and
sticky free-practice attempts/help. Unique bound reward keys use the unambiguous
JSON tuple `[profileId, canonicalQuestionId, earningWeek]`; key encoding policy
is documented here, not implemented as a competing allocator.

`CompetitionState` has timezone, nullable latestOpenedWeek, currentScores,
ordered currentSlots, archives and policyVersion. `ClosedWeekResult` has week,
timezone, policyVersion, positive entries with snapshot nickname/avatar,
points/rank/medal and omittedDeletedProfiles. `PersonalRecords` has nullable
`best: { points, week }` and gold/silver/bronze counts. DEC-030 records are
mandatory in reconciliation and mapped **per profile** in the leaderboard;
fixtures demonstrate survival independently of the archive display window.

## Verification and evidence

Successful commands used bundled Node 24 at
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`:

1. `node node_modules/vitest/vitest.mjs run tests/rewards/calendar-date.test.ts`
   — 1 suite, 86 tests passed.
2. `node node_modules/typescript/bin/tsc -b` — app/Node/worker typechecks passed.
3. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/rewards/calendar-date.test.ts`
   — fixture and negative type examples passed, including eligibility reasons,
   component exclusivity/amounts, slot bounds and required reconciliation records.
4. Owned-file trailing-whitespace scan and command-local safe.directory
   `git diff --check` passed. No persistent Git configuration change.

Selected expected/observed London results (full literals remain in tests):

| Controlled UTC instant | London date | Monday key |
|---|---|---|
| 2026-07-05 22:59:59.999 | 2026-07-05 | 2026-06-29 |
| 2026-07-05 23:00:00 | 2026-07-06 | 2026-07-06 |
| 2026-01-04 23:59:59.999 | 2026-01-04 | 2025-12-29 |
| 2026-01-05 00:00:00 | 2026-01-05 | 2026-01-05 |
| 2026-03-29 01:00:00 | 2026-03-29 | 2026-03-23 |
| 2026-10-25 01:00:00 | 2026-10-25 | 2026-10-19 |

Both child processes, America/Los_Angeles and Asia/Tokyo, produced identical
London date/week results for all 11 instants; measured summer host offsets were
420 and -540 minutes respectively. Three/seven-day additions span both DST
changes without drift (March 27 → March 30/April 3; October 23 → October 26/30).
Fixtures also cover leap/century/month/year boundaries, early AD years, invalid
dates/epochs/offsets, first-run null week, pre-Check assistance, distinct IDs,
free-practice retention, compaction, late lifetime-only success, rollback and
deletion-preserved rank gaps. These are controlled dates/data, not real elapsed
weeks or implemented policy outcomes.

The first run found one test-only comment false positive in the import/purity
assertion; corrected it to inspect code outside block comments. No production
semantic failure or package mismatch was found. Native Intl behavior was tested
with existing runtime data; the child's retained Stage 6 Intl/Luxon assessment
remains the reuse basis, with no added date library or research requirement.

## Boundary and limitations

The early calendar ownership is ready for serial transfer to WP05-03A, which
may append reconciliation while preserving these date APIs. WP05-02A owns
classification, awards, entitlement derivation and reward validators; WP05-03A
owns closure/ranks/retention and competition validators; WP04 owns durable replay,
validation and atomic application of returned competition and personal records.
These contracts express their outcomes without implementing those policies.

No storage, UI/browser acceptance, actual closure/medal/score application,
anti-cheat guarantee or broad gameplay verification is claimed. No config,
shared documents, commits, staging, chat creation, delegation or messages.
Pre-existing Controller changes were preserved.
