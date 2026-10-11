# Published M1 boundary fixtures — producer handoff

11 October 2026. **Six validated normal-import backups in three groups are
frozen for the original independent reviewer.** No catalogue incompatibility was
found: M1 delivers 36 approved canonical questions (12 each M01/M04/E06), enough
to reach the 30th and 31st eligible opportunities in one week.

Target published B remains
`b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1`.
No production, deployment, shared configuration, observer file, ledger or Git
mutation was made. No browser context or host clock was used/changed. These are
controlled producer histories for the published observer, **not published UI
observations, an unseeded journey, or a replacement for the genuine M1 starter
save required by WP06-03A criterion 7**.

## Files, starting facts and expected next Check

All files below live in `artifacts/playtests/M1/producer-fixtures/`. Each is a
whole backup accepted by `validateSave`, `decodeBackup`, `decodeBackupFile` and
the existing private import-preview/confirmation pairing. Schema version is 1,
content version `m1`, reward policy version `1`. Import replaces the whole local
save and creates a fresh local epoch; portable backups deliberately have no
repository token. Use a disposable isolated context.

| Normal import file | Select explorer / profile ID | Before: lifetime / weekly / slots | Next Check: lifetime / weekly / new slot | After: lifetime / weekly / slots |
|---|---|---|---|---|
| [cap-before-30.json](../../../artifacts/playtests/M1/producer-fixtures/cap-before-30.json) | Cap Explorer / `boundary-cap` | 640 / 580 / 29 | +20 / +20 / 30 | 660 / 600 / 30 |
| [cap-before-31.json](../../../artifacts/playtests/M1/producer-fixtures/cap-before-31.json) | Cap Explorer / `boundary-cap` | 660 / 600 / 30 | +20 / 0 / null | 680 / 600 / 30 |
| [summer-sunday-before-check.json](../../../artifacts/playtests/M1/producer-fixtures/summer-sunday-before-check.json) | Sunday Explorer / `boundary-summer` | 0 / 0 / 0 | +5 / +5 / 1, wrong on Sunday | 5 / 5 / 1 |
| [summer-sunday-wrong.json](../../../artifacts/playtests/M1/producer-fixtures/summer-sunday-wrong.json) | Sunday Explorer / `boundary-summer` | 5 / 5 / 1, old week | +25 / 0 / null, correct on Monday | 30 / 0 / 0, new week |
| [review-plus-3-ready.json](../../../artifacts/playtests/M1/producer-fixtures/review-plus-3-ready.json) | Review Explorer / `boundary-review` | 120 / 0 / 0 | +20 / +20 / 1 | 140 / 20 / 1 |
| [review-plus-7-ready.json](../../../artifacts/playtests/M1/producer-fixtures/review-plus-7-ready.json) | Review Explorer / `boundary-review` | 180 / 0 / 0 | +20 / +20 / 1 | 200 / 20 / 1 |

Each file also has an untouched **Other Explorer**, ID respectively
`boundary-cap-other`, `boundary-summer-other`, or `boundary-review-other`, with
zero points/receipts/evidence/medals and no encounters. Both profiles retain
default preferences: sound disabled, saved Silence all false, music/effects
volumes .25/.5, channel mutes false, instruction read-aloud false, motion system.
Import may tighten the facade's live silence latch; it does not grant consent.

## Normal import procedure and clock discipline

1. Set/freeze **only the isolated observer browser clock before loading B** at
   the case's import instant below. Keep it frozen throughout setup; do not let
   a real second accidentally cross the summer boundary.
2. Open **Grown-ups → Continue to adult area**. Under **Backup and transfer**,
   use **Choose a backup to replace this app’s whole save**, select the named
   file, review its two profiles, then **Confirm whole-save replacement**.
   `provenance.json` is not an import file.
3. Return through **Explorers** and select the named primary explorer. The cap
   and summer files contain one deliberately suspended activity visible under
   **Your saved ideas**. The review files contain no unfinished activity.
4. Follow the group steps below. Use normal visible controls and **Check**;
   export through **Download current backup** for comparisons. Do not write
   IndexedDB, rewrite an award, set an active week directly, or rewrite an ID.

The simulated backup `exportedAt` is the fixture's frozen import clock, not the
real generation date. `provenance.json` records complete commands, clocks,
allocated fixture IDs, resulting tokens and deltas from the initial empty save.

## CAP — actual 30th/31st opportunities

Import clock: **2026-07-01T11:00:00.000Z**, London **12:00 Wednesday 1 July**;
active week **2026-06-29**. Keep this clock for both Checks. Both saves have
Q1/Q2/Q3 complete, their three permanent story bindings and exactly three +20
quest receipts. Question-only totals are 580 before slot 30, 600 after slot 30,
and 620 after the capped 31st; the displayed lifetime total includes **60 extra
quest points**, explaining 640 → 660 → 680. There is no weekly quest bonus.

Reachable setup uses the ordinary production routes: complete Q1, Q2, Q3, then
11 `q1-revisit-m01` successes, 11 `q3-revisit-m04` successes and four
`q2-revisit-e06` successes. Each Check is the first independent success for its
own distinct delivered canonical question, all in the same week. This is the
normal equivalent of **Try some practice** in each restored scene. No due review
is due on 1 July; no forced selection or synthetic task ID is used.

- **30th:** import `cap-before-30.json`, choose Cap Explorer, then **Resume Wake
  the Whispering Library**. Encounter `cap-encounter-61`, opportunity
  `cap-opportunity-61`, role `revisit`, binding `q2-revisit-e06`, quest association
  Q2. The activity says **“What a beautiful sky”**. Choose **`.`** in slot
  `admiration` and Check (`!` is also independently accepted). Canonical ID:
  `lif.english.punctuation.r1.authored-%5B%22spellbook-05%22%2C%5B%5D%5D`.
- **31st:** import `cap-before-31.json` at the same clock, select the same
  explorer and resume the same named Q2 practice. Encounter `cap-encounter-65`,
  opportunity `cap-opportunity-65`. The activity says **“The branch is falling”**
  in an urgent-warning context. Choose **`!`** in slot `warning` and Check.
  Canonical ID:
  `lif.english.punctuation.r1.authored-%5B%22spellbook-06%22%2C%5B%5D%5D`.

For a continuous UI scenario, after completing the 30th choose **Continue the
adventure**, return to **Whispering Library**, then **Try some practice**; the
selector chooses the same 31st canonical task with fresh runtime encounter and
opportunity IDs. The separate pre-31 import provides an independent starting
point. Both provisional opportunities have null earning week/slot before Check;
the first valid Check binds June 29 and either slot 30 or null. The capped Check
must leave the entire competition state unchanged while adding 20 lifetime.
No additional quest receipt/restoration is expected. Exact retained Check replay
is recognized without a second award.

## WEEK — summer Sunday wrong Check, Monday late success

Import clock: **2026-07-05T22:59:59.000Z**, London **23:59:59 Sunday 5 July**.
The Monday boundary is precisely **2026-07-05T23:00:00.000Z**, London **00:00
Monday 6 July**, not UTC midnight. Week keys change June 29 → July 6.

Use `summer-sunday-before-check.json` to observe the entire sequence: select
Sunday Explorer, **Resume A Bridge Back Home**, add a single **1 m** plank,
and Check while still frozen on Sunday. Expect wrong-but-valid +5 lifetime/+5
weekly, slot1, no quest receipt. Leave/save normally; navigation alone must not
create an unsuccessful completion. `summer-sunday-wrong.json` is a validated
shortcut to precisely that saved wrong-Check state, suspended with draft `[1]`.

Retained identities in both starting files:

- Profile `boundary-summer`; Q1 / binding `q1-story-m01` / `story` role.
- Canonical `lif.math.bridge.r1.total-12`.
- Encounter `summer-encounter-3`; opportunity `summer-opportunity-3`.
- After wrong Check: episode1, cumulative validChecks1, firstCheckCorrect false,
  earningWeek `2026-06-29`, slot1, answer component true, success components false.

After the wrong Check, set only the isolated browser clock to the Monday boundary.
Resume the saved activity (or let the normal refresh reconcile), replace the
draft with **6 m + 6 m**, then Check. The original opportunity/encounter remains;
it cannot become a new unassisted first success. Expected +25 lifetime consists
of **+5 remaining supported-success component +20 first Q1 completion**.
Weekly delta is zero: the bound earning week has closed. Total lifetime30;
current week July6 has no score entry and no slots (display zero).

The closed June29 result remains exactly **5 points, rank1, gold** for Sunday
Explorer, best5 in June29 and one gold medal. The late success must not change
the archive, add points to the new week or consume a new slot. Opportunity keeps
earningWeek June29/slot1, advances cumulative Checks to2 and records first
success week July6 with supportedSuccess true. No deliberate Finish was used;
the learning episode remains ordinal1.

## REVIEW — real successes followed by +3/+7 civil-day selection

The shared prior history completes all three starter quests independently at
**2026-07-03T11:00:00.000Z**, London noon Friday3 July: lifetime120 (60 question
+60 quest), weekly60, three slots. Each support band has an actual independent
success and its first due date **July6 = July3 +3 civil days**.

- **+3 file:** freeze/import at **2026-07-06T11:00:00.000Z** (London noon
  Monday6). June29 has already closed at60; current week July6 is empty. Select
  Review Explorer and **Choose some practice** from the completed-adventure
  panel. This must call unbound suggested practice, not **Try some practice**
  (the bound revisit route does not select a due review). The actual selector
  chooses `lif.math.bridge.r1.total-12`, reason `due-review`, previous success
  week June29, dueLocalDate July6, familiar true, `eligible-review`.
- **+7 file:** freeze/import at **2026-07-13T11:00:00.000Z** (London noon
  Monday13). Its history additionally performs the three real July6 due reviews
  in ordinary suggested order **M01 bridge → M04 merchant → E06 punctuation**,
  each independently correct for +20/+20. This moves every due date to **July13
  = July6 +7 civil days**, so no overdue different skill masks the intended
  bridge. June29 and July6 both closed at60; current week July13 is empty.
  **Choose some practice** again selects the same bridge as a later-week due
  review with previousSuccessWeek July6 and dueLocalDate July13.

In either case answer **6 m + 6 m** and Check without a hint. Expect +20 lifetime,
+20 weekly, slot1, no quest bonus or restoration. The existing canonical ID is
unchanged, but the newly selected reward opportunity must differ from the actual
prior completion: `review-opportunity-3` for the +3 file, and
`review-opportunity-10` for the +7 file. New opportunity ordinals are respectively
2 and3. Actual browser-generated new IDs are opaque; do not compare them with
the deterministic reference exercise's newly allocated IDs. The successful
review advances the next due date to July13 or July20 respectively.

The prior bridge records and the complete July6 review sequence are in the
provenance trace; no last-success date, learning evidence or reward track was
manufactured. Ordinary reload/redisplay of saved success must not add points.
The accepted producer regression suites retain same-week/replay exclusions.

## Construction, reproducibility and evidence limits

Owned source: `tests/fixtures/published-boundary-data.ts` and
`tests/state/published-boundary-data.test.ts`. The builder starts from
`createInitialSave` and changes logical save data only through production
`reduceCommand`, which composes real binding/selection/evaluation/evidence/
scoring/calendar/quest policy. Supplied answers are actual accepted responses;
tests pin the boundary tasks' literal responses and independent arithmetic.
Every changed root is validated, and every complete setup trace is independently
replayed by the test before its exported bytes are compared.

The [provenance record](../../../artifacts/playtests/M1/producer-fixtures/provenance.json)
contains exact SHA-256/byte length for each import file, consumed producer source
hashes, all 36 catalogue IDs, profile/token metadata, full setup commands and
producer expected-after-next saves. Those after-saves are reference logical
results: compare semantic facts and retained IDs, not newly allocated runtime
submission/action/opportunity IDs. This is fixture validation at the domain/import
boundary; the observer still owns native persistence, UI execution, exported
actual observations and published-B acceptance.

Bundled Node24 was used, no dependencies installed. Checks on 11 October 2026:

- Fixture generation/check: six tests pass. First run had one assertion-only
  shorthand-ID mistake for a non-anchor English task; corrected to the actual
  producer's encoded canonical ID without modifying data or production policy.
- Read-only final run of the six fixture checks plus existing scoring, calendar,
  calendar-date and selection suites: **221 passed, five files, 3.19s**, started
  07:40:46 BST. No skipped or failed tests. The existing reward oracle remains
  31 distinct independent opportunities =620 question lifetime/600 weekly/30
  slots; these M1 fixtures additionally retain the three real quest bonuses.
- Strict ES2022 focused typecheck of the two new files: pass.

Commands (run from repository root, private serial test execution):

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/fixtures/published-boundary-data.ts tests/state/published-boundary-data.test.ts
node node_modules/vitest/vitest.mjs run tests/state/published-boundary-data.test.ts tests/rewards/scoring.test.ts tests/rewards/calendar.test.ts tests/rewards/calendar-date.test.ts tests/learning/selection.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
```

Regeneration uses the same fixture test with `PUBLISHED_BOUNDARY_WRITE=1`; its only
write destination is the owned `artifacts/playtests/M1/producer-fixtures/` folder.
Ordinary checks leave exports unchanged. Controller retains integration and
acceptance; source/data are frozen for the independent reviewer. No cap-policy
interpretation or production change is requested because all three groups are
reachable with the delivered M1 catalogue.
