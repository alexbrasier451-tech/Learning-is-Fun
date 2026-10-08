# WP05-03A implementation handoff

Implemented on 9 October 2026 under current GLOBAL_RULES execution authority.
Controller accepted/committed WP05-01A at `279c911` and released DEP-021 before
the serial calendar extension. Independent validation/acceptance remain
Controller-owned; no commit or staging performed by this worker.

## Files and behavior

- `src/rewards/standings.ts`: positive shared-tie ranking, pure one-week closure,
  per-profile best/medal updates, committed leaderboard selection, targeted
  profile-result deletion and competition/available-history invariant issues.
- `src/rewards/calendar.ts`: added reward-domain imports and the accepted
  explicit-time `reconcileCompetitionWeek` port. Existing error/date helper
  declarations and bodies remain exactly unchanged against `279c911`.
- `tests/rewards/calendar.test.ts`, `tests/rewards/standings.test.ts`: controlled
  rollover/absence/rollback/retention and immutable ranking/record/deletion/
  validation/read-model fixtures, including rejection cases.
- `tests/rewards/calendar-date.test.ts`: narrow Controller-authorized adjustment
  to the previous worker-owned harness; all 86 original behavior/type fixtures
  remain. This handoff is the only new execution document written here.

No contracts, date algorithms, config, shared documents, concurrent experience/
asset/audio files, storage, UI, learning or scoring implementation were changed.

## Exact ports and invariants

All domain DTOs come from accepted `src/rewards/contracts.ts`. No state facade
or save types are imported; these functions never read a live clock or storage.

```ts
rankPositiveScores(entries: readonly CompetitionScoreEntry[]): ClosedWeekResult['entries']
closeWeek(input: ReconciliationInput): CloseWeekResult
reconcileCompetitionWeek: ReconcileCompetitionWeek
buildLeaderboardReadModel(input: ReconciliationInput & { context: CalendarContext }): LeaderboardReadModel
removeProfileResults(input: { competition: CompetitionState;
  personalRecordsByProfile: Readonly<Record<ProfileId, PersonalRecords>> }, profileId: ProfileId): typeof input
validateCompetitionState(competition: CompetitionState,
  profiles: readonly CompetitionProfile[]): readonly CompetitionValidationIssue[]
```

`CompetitionScoreEntry = { profileId, nickname, avatarId, points }`;
`CloseWeekResult = { result: ClosedWeekResult | null,
nextPersonalRecordsByProfile }`. `CompetitionValidationIssue = { path, code,
message }`, with codes invalid-shape, invalid-date, invalid-counter,
invalid-reference, duplicate, inconsistent or limit-exceeded. These exported
policy-local port/result types do not redeclare the accepted domain DTOs.

Reconciliation samples only the supplied epoch: first run opens its London week;
same week returns original competition/no closed changes; forward movement closes
only the last active participating week, clears scores/slots and opens the actual
observed week. Skipped empty weeks produce nothing. Rollback retains the latest
competition/scores/slots/records and reports observed date + active week +
clockRollback. Applying **both** returned competition and records before replay
produces no second medal/best/archive change. Invalid domain inputs throw
RangeError; date/zone failures retain the accepted typed CalendarError.

Ranks depend only on positive points: 20/20/10/0 → 1/1/3/unranked, with
gold/gold/bronze/none. Display ties use nickname then immutable ID without changing
rank. Closure snapshots nickname/avatar/policy, and updates best only on a
strictly higher score; tied best retains its original week/object. Record values
are reused when unchanged; medals are safe-integer checked before increment.

Archives are stored **oldest-first**, appended then limited to the newest 52
participating closed results. Omission-emptied historical weeks stay in this same
window. Read models expose archives newest-first, actual current/lifetime points,
slot count, nullable provisional rank, per-profile records, browser-local scope
and the Monday–Sunday ISO date range in Europe/London. Rollback notice explains
that local clock/old-backup changes can alter local history. No synthetic rivals.

Deletion removes only the target's score/slots/records and archived entries;
affected archives gain omittedDeletedProfiles. Survivor ranks/medals/bests and
record references stay unchanged, including historical rank gaps. Repeated or
absent-ID deletion has no further effect.

Validation checks safe counters, profile references/capacity, dates/Mondays,
slot uniqueness/order/canonical identity and 5/10/20 contributions, current sum
and 600 cap, archive count/order/closed dates/positive scores/ranks/medals,
original ties/gaps after omission, and best/medal/lifetime lower bounds against
retained facts. Omitted tie-group gaps cannot imply more than 16 original
participants. Discarded histories are not recreated: an older best and larger
cumulative medal counts remain valid outside displayed archives. WP04 retains
full JSON schema/text/ID/version/catalogue validation; WP05-02A retains reward
receipts, compaction and opportunity-to-slot joins.

## Verification and retained evidence

Executed using bundled Node `v24.19.0` at
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`:

1. `node node_modules/vitest/vitest.mjs run tests/rewards/calendar.test.ts tests/rewards/standings.test.ts tests/rewards/calendar-date.test.ts`
   — **3 suites, 151 tests passed**, including all 86 prior date/DTO tests.
2. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --verbatimModuleSyntax --types node src/rewards/calendar.ts src/rewards/standings.ts tests/rewards/calendar.test.ts tests/rewards/standings.test.ts tests/rewards/calendar-date.test.ts`
   — **passed**, without shared project build-info writes.
3. Compared the accepted date/error declarations and helper bodies to `279c911`
   — **identical**; `git diff --exit-code -- src/rewards/contracts.ts` — **clean**.
4. Owned-file trailing-whitespace scan and command-local safe.directory
   `git diff --check` — **passed**. No persistent Git configuration change.

Literal controlled outcomes include:

| Case | Expected / observed |
|---|---|
| Summer/winter London Sunday → Monday | Close only at 23:00 UTC / 00:00 UTC respectively |
| Spring/autumn DST competition week | Close March 23 at March 29 23:00 UTC; October 19 at October 26 00:00 UTC |
| Absence October 5 → November 9 | One October 5 result, actual November 9 opening, no skipped archives |
| Rollback November 9 → observed October 8 | Active November 9 retained, notice/context true, no medal replay on recovery |
| 53 closures from January 6, 2025 | 52 archives January 13, 2025–January 5, 2026; original 20-point best January 6, 2025 and 53 gold medals survive |
| Omission-emptied oldest displayed archive | Expires at the same 53rd boundary; remaining records survive |
| Delete one joint gold winner | Survivor ranks 1/3, gold/bronze preserved, omission flag, no replacement awards |

Fixtures deep-freeze inputs and compare before/after values/reference reuse;
output states pass the domain validator. Extra probes reject impossible omitted
tie gaps, invalid aggregates/slots/dates/counters, duplicate identities/archives,
zero unmarked archives, unsupported Intl and medal-count overflow. Late success
fixtures prove only old earning-week/new active-week context and immutable
archive/no-new-slot behavior; WP05-02A owns the actual lifetime remainder.

The existing Node two-host-zone test needed a test-only `registerHooks` resolver
for the two extensionless reward-source imports introduced by the planned
calendar extension. It now dynamically imports after installing that narrowly
bounded resolver. Original London expected dates/weeks/additions and measured
Los Angeles/Tokyo host offsets remain unchanged. The historical “closure not
implemented” source guard became a reward-only imports/no-live-effects guard.
This is harness adaptation, not a date-policy change.

Initial strict checks exposed validator array-narrowing and one intentionally
malformed fixture-cast typing defect; corrected locally, then reran the complete
focused set. At initial handoff no remaining defect was known; independent
validation subsequently identified the two validation gaps retained below.
Standard build protocol governed the dependent slice; ranking, closure, deletion,
read models and validators share standings.ts, and reconciliation depends on its
closure. This worker remained serial under the explicit no-delegation boundary.

## Handoff and limitations

Ready for independent affected recheck; downstream WP04-03A/04A and WP05-04A
release remains conditional on Controller acceptance. Controller serializes the final project build/integration
and commit; this worker ran focused reward/date/type checks only. Pure simulated
dates and before/after policy values are not real elapsed weeks, facade lifecycle
calls, atomic storage actions, browser UI acceptance or published play evidence.
No live clock authority or anti-cheat guarantee is claimed. Unrelated tracked
and concurrent untracked files were preserved; no chat creation/delegation or
messages were performed.

## Independent findings and narrow correction — 9 October 2026

The independent [validation report](WP05-03A-VALIDATION.md) returned **NOT
ACCEPTED** for two P2 validator findings. Its original probes/report remain
untouched. The previous 151-test passing evidence above is retained as the
initial baseline, not acceptance of these missing invariants.

Common exact probe input: profile p1/Ada/avatar-1, lifetimePoints 2000; London
policyVersion 1; active week 2026-10-12; empty current score/slot maps.

| Probe | Original facts and observed failure | Corrected observed outcome |
|---|---|---|
| F1 | Omission-marked October 5 archive: one 600-point rank-2 silver entry; best 600/October 5; gold/silver/bronze counts 0/1/0. Validator returned `[]`. | `inconsistent` at `competition.archives[0].entries[0].rank`: a maximum-score participant must retain rank 1, including after deletion. |
| F2 | September 21 and October 5 archives each contain p1 at 5 points/rank 1/gold; best 20/September 28, medals 3/0/0. Validator returned `[]` despite the missing middle-week archive. | `inconsistent` at `profiles.p1.personalRecords.best`: a best inside retained dates requires its matching original result. |
| Older-best control | Same F2 archives/medals, best 20/September 14. Original result `[]`. | Still `[]`: genuinely older unavailable history remains allowed. |

The earliest causal defects were localized to validation, not generated ranking
or retention. F1's omitted-rank checks allowed a gap without enforcing that no
original participant could exceed the 600 cap. Added a maximum-score/rank-1
invariant; facts are rejected, never reranked or remedalled. Controls still accept
an omitted 600-point gold winner (deleted ties) and a 595-point silver survivor
(a deleted 600-point winner is possible).

F2's matching-result guard ran only when an archive already had best.week. It
now requires matching profile/week/points whenever a retained valid week is at
or before that best date. This covers missing middle weeks and closed weeks
after the last displayed result; a best older than every retained week stays
allowed. A fresh October 12 missing-best variant with active October 19 is also
rejected. No archived or personal-record fact is rewritten.

Corrections changed only `src/rewards/standings.ts` validator guards,
`tests/rewards/standings.test.ts` regression fixtures and this handoff. Ranking,
closure, calendar, retention, deletion, read models, contracts and config remain
unchanged during this correction.

Evidence with the same bundled Node and command conventions:

1. Before production correction, `vitest run tests/rewards/standings.test.ts -t 'F1|F2'`
   reproduced **2 failed / 1 passed / 46 skipped**; both exact negative fixtures
   observed the original empty issue arrays.
2. After correction, the same focused command passed **3 / 46 skipped**,
   including exact probes, unchanged frozen inputs and acceptance controls.
3. Complete relevant reward/date rerun (the three suites in verification above)
   passed **154 tests**, including all 86 original date/DTO checks and the 53-week
   retention/deletion/rollback paths.
4. The exact strict source/fixture TypeScript command above passed. Correction
   files passed trailing-whitespace and scoped `git diff --check` checks.

Ready for independent affected recheck of F1/F2 and their controls. This author
does not replace the independent verdict or administrative acceptance. No
broader build, commits, shared-document edits, delegation or messages performed.
