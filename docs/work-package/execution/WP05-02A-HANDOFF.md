# WP05-02A implementation handoff

Implemented 9 October 2026 under the explicit execution assignment after accepted
DEP-018/019/020. Independent validation and administrative acceptance remain
Controller-owned. No frozen contract change or material contract defect found.

## Owned output and consumer contract

- `src/rewards/scoring.ts`: all six requested pure APIs:
  `classifyRewardEligibility`, `applyCheckRewards`, `applyQuestReward`,
  `deriveCosmeticEntitlements`, `compactCompletedOpportunity`, and
  `validateRewardState`. Validation returns readonly `{ path, message }` issues.
- `tests/rewards/scoring.test.ts`: 30 deterministic tests with independent
  expected totals, frozen inputs, JSON reloads and exact receipt/slot assertions.
  Exports `compactRewardFixture` and `compactCompetitionFixture`, independently
  authored literal fixtures for WP04 decoder/composition tests.
- This handoff. No contract, calendar, state, catalogue, dependency, configuration,
  asset, build or cache writes; no workers, other-chat messages, staging or commits.

WP04 persists the assigned opportunity token, ordinal and selection before
scoring. Classification allocates nothing. Existing unchecked opportunities
resume their recorded selection and hint; first-Check eligibility is still
revalidated against current success/practice/date facts. Checked unresolved work
always retains its opportunity, attempts, help, earning week and slot. A new
selected review needs a later week than **actual success** and the selected due
date must have arrived. No second scheduler or canonical-ID construction exists.

`applyCheckRewards` accepts the stored pre-Check track and next cumulative
sequence. It rejects stale sequences, changed stored/selection/identity facts,
unjudged inputs and unknown/compacted tokens with `RangeError`, without mutation.
WP04 must reconcile the calendar first and atomically apply both returned states.
WP04 owns submission replay/tombstones and never treats episode-local indexes as
cumulative indexes. A retained completed token produces no further award;
replaying its original stale count is rejected. No submission journal is added.

When an unchecked provisional opportunity fails revalidation, the Check becomes
ordinary free practice and removes that provisional token. WP04 should adopt the
returned track (and clear the corresponding encounter opportunity reference);
resubmitting the removed token rejects. Its allocated ordinal is not reused.
Free practice with an unfinished encounter requires that encounter and cumulative
count across unsuccessful episodes. After success a new practice encounter may
start at count zero, while canonical success/latest-week facts continue preventing
fresh same-week rewards. A legitimate later selected review has fresh opportunity
attempts; preceding practice history remains retained separately.

Success moves the opportunity to the exact latest-completion position. Replacing
an older completion folds its 10/20 contribution once and advances the completion
high-water. Active-week completion/slot facts cannot be folded; unresolved work is
returned unchanged by compaction. Full input validation rejects expired ordinals,
contradictory component/help/count facts, duplicate earning-week identities,
receipt/entitlement mismatches and inconsistent slot/lifetime sums. Competition
calendar/archive/rank validation stays with `validateCompetitionState`; WP04's
decoder must compose both validators and its own learning/encounter guards.

`applyQuestReward` requires WP04's derived prerequisite/result completion fact,
recognizes the ten static quest IDs and awards +20 once, lifetime only. Cosmetics
use the accepted concrete IDs at 20/60/150/300; star and wave both unlock at 300.
Presentation availability never enters the score calculation. No +30 challenge,
time/difficulty multiplier, spending or educational access gate was introduced.

## Criterion evidence

Fixture conventions: canonical `c`, encounter `e`, supplied opportunity `o`,
submission `sN` at cumulative sequence N; W1 = 2026-10-05, W2 = 2026-10-12,
W3 = 2026-10-19. These are controlled data, not real elapsed play.

| Criterion / controlled history | Expected = observed | Identity / retention evidence |
|---|---|---|
| P5-A: selected first correct, no answer help | +20 lifetime, +20 competitive | `o/answer` and `o/independent-success`; one slot |
| P5-A: wrong s1 → unsuccessful episode finish → correct s2 | +5 then +5; total 10 | Same e/o/ordinal/slot; cumulative count 2; only supported-success remains payable |
| P5-A: Hint or worked method → first correct | +10 / +10 | Sticky help; answer + supported-success receipts |
| P5-A: assessed read-aloud | +20 / +20 | Reading evidence alone does not remove independence |
| P5-A: incomplete/invalid response, stale count/identity | Rejected, zero mutation | No receipt; manipulation/narration/FinishPractice are not scoring events |
| P5-B: alternate answer, reshuffle, new session or cosmetic release | Same-week-used | Canonical identity unchanged; no fresh opportunity |
| P5-B: W1 success → W2 selected due review | Fresh opportunity, same canonical | Old completion retained until new success, then folded exactly |
| P5-B: merely changed week / not-yet-due / stale prior success | Practice-only | No date-only renewal or alternative scheduler |
| P5-B: child practice wrong → finish → story-route success | 0 lifetime / 0 competitive | Counts/help persist; actual success W1 blocks W1 renewal; selected W2 review can earn |
| P5-B: stale provisional selection after practice success | 0 / 0 | Provisional token removed; help retained; old token rejects |
| P5-C independent oracle: 31 distinct unassisted successes | **620 lifetime / 600 competitive / 30 slots** | Exact ordered first 30; 31st null slot with normal lifetime award |
| P5-C separate 31 wrong-first history | 155 lifetime / 150 competitive / 30 slots | Retry of slot 1 adds +5 to same slot; capped retry after rollover remains lifetime-only |
| Sunday pre-Check hint → Monday first Check | +10 / +10 in W2 | Same hinted token binds W2 only when Checked |
| Sunday valid wrong Check → Monday success | +5 / +0 on Monday | Earning W1/slot retained; archive and current competition byte-equivalent; actual success W2 |
| P5-D three supported starter quests | 90 lifetime / 30 competitive | Three +20 quest receipts; 20/60 choices reachable; repeat/reload zero |
| P5-D all ten static quests, threshold boundaries | 200 quest-only lifetime | 19/20, 59/60, 149/150, 299/300 exact; M2 runtime delivery not claimed |
| Completion 20 → next review 10 → next review 20 | Lifetime 20 → 30 → 50 | Closed totals 0 → 20 → 30; high-water 0 → 1 → 2; old token rejects |
| Fresh opaque canonical key with another profile present | +20 for target only | `__proto__` handled as own data; other profile's score/slot objects preserved |

Literal decoder fixture: lifetime 30 = closed 20 + retained supported completion
10, completion mark 1, latest ordinal 2, W2 slot 1/score 10, leaf entitlement.
It validates independently and continues into a W3 review yielding lifetime 50,
closed total 30 and completion mark 2. The unfinished-history tests demonstrate
that repeated compaction across W1/W2/W3 retains legitimate eventual success.

## Initial executed checks and limits

Bundled Node 24:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

1. Final `node node_modules/vitest/vitest.mjs run tests/rewards
   tests/learning/identity.test.ts tests/learning/contracts.test.ts --no-cache`:
   **6 suites, 229 tests passed**, including all 25 scoring tests.
2. Final `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit
   --incremental false --strict --skipLibCheck --target ES2022 --module ESNext
   --moduleResolution Bundler --types node tests/rewards/scoring.test.ts`:
   **passed**, including scoring and its imported producers.
3. One observational app-wide `tsc -p tsconfig.app.json --noEmit
   --incremental false --composite false` found six diagnostics in concurrently
   authored `src/content/catalogue.ts` (52, 64) and
   `src/content/quest-bindings.ts` (37 twice, 42, 83). Controller confirmed these
   were unfinished concurrent input, not this child's acceptance blocker, and
   reserved assembled verification for integration. No broad rerun or edits to
   those sources were performed.
4. Owned-path whitespace/diff inspection completed; unrelated work preserved.

Development checks caught nullable cosmetic entitlement typing and a test-array
inference issue; both were corrected before the final focused typecheck. The
fresh opaque-key test initially exposed inherited-property lookup in the test
allocator, corrected to own-property lookup; production already used own keys.
Review also added the unchecked-opportunity resumption regression. Final tests
cover those initial corrections. The subsequent independent review found three
decoder defects; their reproduction and correction are recorded below.

These are pure-policy results. They do not establish real persistence,
transaction/replay integration, two-tab behavior, world presentation, child
fairness, real M2 ten-quest progression or published-game acceptance. WP04-03A
composes validators; WP04-04A exercises real learning/save application and replay;
WP04-07A retains M2 real-state verification.

## Independent-review corrections — 9 October 2026

Read the unchanged `WP05-02A-VALIDATION.md` and reproduced all three findings
before editing production. The focused `-t 'F1:|F2:|F3:' --no-cache` run failed
all three newly added regressions with exactly the reviewed outcomes:

| Finding | Before: reproduced | After: complete rejecting/continuation path |
|---|---|---|
| F1: late-success W2 followed by forged bound review earning W2, referencing W1 | Validator returned no issues; continuation awarded +5 lifetime/+5 competitive | Validator reports retained-prior-success contradiction; Check rejects with `RangeError`, no mutation or award. The adaptive/first-encounter substitution and W3 review referencing stale W1 also reject. |
| F2: allocation/completion marks 1/1 with closed total 0 and no success/completion | Validator returned no issues; classification was eligible-first; externally allocated ordinal 2 earned +20/+20 | Validator rejects missing compacted contribution/completion history; classification is practice-only; attempted ordinal-2 continuation rejects before awarding. |
| F3: slot points is JSON `{"valueOf":null,"toString":null}` | Validator threw `TypeError: Cannot convert object to primitive value` | Validator returns an invalid numeric-points issue; no coercion or exception. Equivalent malformed compact totals, ordinals, Check counts and week/date fields return issues. |

The causal changes are in the existing scoring validator and its familiar-history
classification. A bound unfinished opportunity must agree with the retained
**actual** prior success: selected due review, matching previous-success week,
and a strictly later earning week. A first encounter cannot follow compacted
completions. This check applies after binding, preserving the provisional
first-Check revalidation path. Numeric/boolean shape is established before
comparisons, multiplication or accumulation; malformed values are not added to
totals after failed validation.

A positive completion mark now requires a positive compacted contribution and
retained latest completion/success history. Allocation marks alone do not imply
completion. No contiguous-ordinal or `10 × completion-mark` lower bound is
assumed: the real provisional-removal → ordinal-2 supported success → ordinal-3
independent review regression validates with completion mark **2**, compacted
total **10**, and lifetime **30**. The removed token still rejects.

Five focused regressions were added. The F1 test constructs the legal original
W1 hinted wrong → W2 late success → W3 wrong review path, applies each corruption,
classifies, validates and attempts the correct continuation with frozen inputs.
Its unmodified W3 continuation still adds +5/+5 and folds the prior 10 exactly.
The stale **unchecked** review variant still validates provisionally, classifies
not-due, and converts to zero-award practice. Existing compact-fixture review,
free-practice/episode continuation, immutability and the 620/600/30 oracle pass.

Final correction checks, using the same bundled Node and commands above:

- Focused scoring suite: **30/30 passed**, no cache.
- Related reward/identity/contracts suite: **6 suites, 234/234 passed**, no cache.
- Focused strict TypeScript check: **passed**, no emit or incremental cache.
- Owned-file diff/whitespace inspection: passed.

No app-wide rerun, contract/config/shared-file/validation-report edits, workers,
other-chat messages or commits. The corrected child is returned for Controller's
narrow independent recheck; this author result does not claim reviewer acceptance.
