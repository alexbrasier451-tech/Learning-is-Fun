# M1 educational assembly and downstream oracle — WP03-05A

Author: Codex WP03-05A, 9 October 2026. This assembles accepted original content
and policy; it does not reauthor their prose, answers, review or contracts.
Internal content approval is the named producers' review, not qualified educator
or child approval. Actual controls, commits, reload, audio and published play
remain downstream acceptance.

## Delivered inventory and boundaries

`src/content/catalogue.ts` supplies exactly 36 immutable approved tasks:
12 M01 bridge targets 6–17, 12 M04 merchant multiplier 2/3 × pears 1–6, and
12 E06 punctuation records (`spellbook-anchor`, `spellbook-01` through `-11`).
All are support band. `getTask` returns undefined for undelivered IDs; `listTasks`
filters actual tasks, so core/stretch and the other 17 registry skills remain
unavailable. IDs are taken from producer records, including encoded non-anchor
English IDs, never invented from an authored-key suffix.

Exact inventories/answers and review are retained by reference:
[maths review](starter-maths.md), [punctuation review](starter-punctuation.md),
[policy review](learning-policy.md), `STARTER_MATHS_MANIFEST` (24 IDs/52 cases)
and `STARTER_PUNCTUATION_MANIFEST` (12 IDs/65 cases). English retainedTaskIds are
compatibility references to existing records, not another twelve tasks.
Tests resolve every manifest reference and execute all 117 cases.

The catalogue clones and freezes its own assembly objects. It validates the full
36-record bank before exposing usable records; any bank defect exposes an empty
usable bank. `validateCatalogue` also accepts nonempty filtered subsets and checks
unique IDs, reconstructible descriptors, delivered family/reference, family-domain
validation and reviewed source/prose/help/narration/attribution. A caller cannot
change a worked answer or claim approval for changed prose. Compatible nonempty
content revisions and semantic punctuation control/map order are preserved by
the producers; revisions do not change canonical identity. WP04 must still resolve
the exact retained revision before calling the dispatcher.

`evaluateResponse` gates content before grading and delegates the actual family
evaluator. Recovery remains incomplete / invalid-response / unavailable-content;
only complete permitted responses are judged. Recovery tags carry no correctness,
attempt or reward. Task/answer rules are resolved by WP04 from committed identity,
not accepted from the UI. No numeric rewards or durable changes occur here.

## Nine released bindings and six offered encounters

All bindings are availability M1. Order is story, optional-transfer, revisit
within Q1, then Q2, then Q3. They are frozen records with frozen task pools.

| Binding | Quest/skill | Required/source | Task pool | Mechanic/response |
|---|---|---|---|---|
| q1-story-m01 | Q1/M01 | story/null | total-12 only | drag/bridge |
| q1-transfer-m01 | Q1/M01 | optional-transfer/q1-story-m01 | other 11 bridge tasks | drag/bridge |
| q1-revisit-m01 | Q1/M01 | revisit/null | all 12 bridge tasks | drag/bridge |
| q2-story-e06 | Q2/E06 | story/null | spellbook-anchor only | drag/punctuation |
| q2-transfer-e06 | Q2/E06 | optional-transfer/q2-story-e06 | other 11 punctuation tasks | drag/punctuation |
| q2-revisit-e06 | Q2/E06 | revisit/null | all 12 punctuation tasks | drag/punctuation |
| q3-story-m04 | Q3/M04 | story/null | mult-2.pears-3 only | object-manipulation/merchant |
| q3-transfer-m04 | Q3/M04 | optional-transfer/q3-story-m04 | other 11 merchant tasks | object-manipulation/merchant |
| q3-revisit-m04 | Q3/M04 | revisit/null | all 12 merchant tasks | object-manipulation/merchant |

Validation checks the exact released meanings/pools, unique IDs/tasks, real quest
references, approved primary skill/response, mechanic, source links and nonempty
required sets. A transfer source is exactly one M1 story anchor in the same
quest/skill; it is excluded from the transfer pool. Such source links cannot form
a cycle. Only the nine signed M1 IDs are allowed. Missing rows and adding M2
required work retrospectively to Q1–Q3 are content faults.

The actual WP02 graph remains Q1 with no prerequisites, Q2 requires Q1, Q3 requires
Q2. Required binding queries admit M1 rows in M1 and both availabilities in M2;
they never complete an empty/missing required set. WP04 alone adds permanent
completedStoryBindingIds on a correct committed story-bound judged Check,
including supported/retry success, then tests all required IDs and quest
prerequisites. Optional/unbound work and FinishPractice never add a required ID.
No binding award or second world reducer exists.

For a fresh profile with no due review/history and the appropriate committed
accessible quests, the actual resolver/selector produces these six offers:

| Offer | Route / binding | Exact task | Valid response / assessed outcome | Continue or skip |
|---|---|---|---|---|
| Q1 story | quest Q1 / q1-story-m01 | lif.math.bridge.r1.total-12 | bridge [6,6], [4,4,4] or [1,2,3,6]; M01 correct | Correct committed story success can restore Q1 |
| Q1 transfer | optional-transfer / q1-transfer-m01 | lif.math.bridge.r1.total-10 | bridge [5,5]; M01 correct | Requires permanent source success; skip changes nothing |
| Q2 story | quest Q2 / q2-story-e06 | lif.english.punctuation.r1.spellbook-anchor | question=?, discovery=. or !; E06 correct | One whole task, one required success; both endings equal |
| Q2 transfer | optional-transfer / q2-transfer-e06 | lif.english.punctuation.r1.authored-%5B%22spellbook-01%22%2C%5B%5D%5D | punctuation {record:'.'}; E06 correct | Requires permanent source success; skip changes nothing |
| Q3 story | quest Q3 / q3-story-m04 | lif.math.merchant.r1.mult-2.pears-3 | merchant apples=6, pears=3; mixed-task M04 correct | Correct committed story success can finish Q3 |
| Q3 transfer | optional-transfer / q3-transfer-m04 | lif.math.merchant.r1.mult-2.pears-1 | merchant apples=2, pears=1; mixed-task M04 correct | Requires permanent source success; skip changes nothing |

These transfer choices are deterministic fresh examples, not immutable single-task
transfer anchors: each transfer retains its full eleven-task pool. Children are
offered three story and three optional transfer encounters; the 36 records are
not compulsory padding or a promise of 30 unseen weekly tasks. Revisits stay
optional even when they reuse a story task.

## Stable downstream scenarios

Below, route resolution/provenance and evaluation/learning expectations are
executable pure evidence. Commit/save/reload/world/reward/UI expectations are
oracles for WP04-04A and WP02-06A; WP06-04A verifies the published adventure.
Profile is `child`; any generated command/submission/opportunity IDs remain
opaque and distinct from canonical IDs. WP04 constructs observations from
committed facts and filters duplicate/stale events once before the pure reducer.

### M1-BRIDGE

Fresh route `{kind:'quest',questId:'Q1'}` resolves to q1-story-m01 provenance
`{bindingId:'q1-story-m01',questId:'Q1',role:'story'}`, reason story-anchor and
total-12. Alternatives [6,6], [4,4,4], [1,2,3,6] are all judged correct and
retain one identity. [5,6] is sum-under; [6,6,1] is sum-over. [] is incomplete,
[7] and seven planks are invalid. Draft/recovery results produce no Check.
On acknowledged correct story Check, permanent set gains q1-story-m01, then Q1
once, with bridge-restored and route-to-library-market facts. Unsupported save
or failed/conflicting commit preserves the previous committed world/display;
no celebration before acknowledgement. Repeating the same accepted action is
already-applied, not another award or required completion.

### M1-SPELLBOOK

After Q1, route quest Q2 resolves q2-story-e06 with story provenance and
spellbook-anchor. `{question:'?',discovery:'.'}` and
`{question:'?',discovery:'!'}` produce deeply equal correct whole-task results.
`{question:'.',discovery:'?'}` is judged wrong in both slots; absent/null/empty
known endings are incomplete and unknown slots are invalid. Successful committed
story work adds q2-story-e06 and then Q2 once, not one completion per slot or
ending. Canonical and opportunity identity do not change when the ending changes.
Assessed text cannot be modelled before Check by ordinary narration; only safe
neutral instructions are spoken. Preserve line-to-slot association, particularly
the identical words in spellbook-11's cheer and later calm log.

### M1-MERCHANT

After Q2, route quest Q3 resolves q3-story-m04 with story provenance and
mult-2.pears-3. (6,3) is correct; (5,4) fails relationship only, (4,2) total only,
(2,2) both. The 24-fruit domain is legal; 25 is invalid. Null counts/0+0 are
incomplete; zero of one fruit with a nonempty basket is a judged wrong answer.
Correct committed story work gains q3-story-m04 and Q3 once, with market-stocked,
village-welcome and planter-available. Primary evidence is mixed M04; contextual
M02/E08 do not gain independent successes. Text feedback must convey both
constraint facts regardless of audio availability.

### M1-TRANSFER

Use optional-transfer q1-transfer-m01 after permanent q1-story-m01 completion.
The source encounter/receipts may be fully compacted: with no retained source
encounter or canonical history, the resolver derives previous canonical ID
total-12 from the singleton source row and still selects distinct total-10 for
the fresh example above. Provenance is optional-transfer, reason transfer. A
correct [5,5] never adds q1-story-m01 or Q1; the already committed source facts
remain. Without permanent source completion resolution is source-incomplete.
Requesting a transfer as required quest work, or a Q1 binding under quest Q2, is
route-mismatch. Unknown ID is unknown-binding. Skip creates no command, Check,
failure, score or permanent completion. The same source-compaction test passes
for Q2/Q3 transfers. A revisit resolves adaptive-practice with revisit provenance,
not story provenance. Every bound selection stays within its pool.

### M1-HELP-RESUME

Retained `saved-bridge`, canonical total-12, original q1-revisit-m01 provenance,
reason adaptive-practice, opportunity `saved-opportunity`, sticky answerHintUsed
true and episode ordinal 1 is supplied by WP04. Test both zero Checks before help
and one prior wrong Check. A fresh quest Q1 request resumes `saved-bridge`, its
original reason/provenance and candidate none; it cannot relabel optional work
as required. Save/reload must retain the descriptor/revision, draft/help IDs,
firstCheckCorrect and cumulative Checks/opportunity. Help must be saved before
text/spoken hint/worked support is revealed; save failure keeps the prior state
and offers recovery. This optional success cannot complete story work; after it
succeeds, a later genuine story request still obeys sticky canonical/free-practice
history and WP05 eligibility. Neutral instruction narration/mute/Stop is not
answer help. Candidate none on resume is not cancellation of an existing
opportunity; WP05 reuses its retained opportunity/components/earning week.

### M1-FINISH-RESUME

Encounter `finish-A`, episode 1: [1] yields wrong judged Check, cumulative/local
index 1 and inherited hint. Evidence is 1 Check/0 completed episodes. Navigation
suspends, adds no observation and does not reset help/attempts. Deliberate finish
action `finish-action` closes that Check-bearing episode: 1 Check/1 unsuccessful
completed episode, no new submission/index/opportunity. Zero-Check finish is
invalid. Return uses the same encounter/opportunity/provenance, episode ordinal
2, local index 1/cumulative index 2. [6,6] is correct with original firstCheckCorrect
false and inherited hint. Final summary: 2 Checks, 2 completed episodes, zero
independent, one supported and one retry success. Pure selection returns the
saved encounter and candidate none. WP04 must preserve sticky reward history
and filter duplicate finish/Check once. In this revisit example no required
completion is added; an otherwise identical genuine story-provenance success
would qualify for its required binding despite support/retry.

### M1-DUE-REVIEW

Unbound suggested M01 practice only; never silently replace requested story,
transfer or revisit. Independent first success on total-10, 2026-10-23/week
2026-10-19, schedules 2026-10-26 across London autumn DST. With all M01 tasks
familiar, on 2026-10-26/week 2026-10-26 select total-10, reason due-review, familiar
true, null binding provenance, advisory later-week-due-review candidate and
reviewReference `{canonicalQuestionId:'lif.math.bridge.r1.total-10',
dueLocalDate:'2026-10-26',previousSuccessWeek:'2026-10-19'}`. WP05 alone rechecks
eligibility/allocates a new opportunity; canonical identity remains unchanged.
Independent review on 2026-10-26 schedules 2026-11-02. A supported review would
schedule three calendar days and qualify evidence; no numeric awards are computed.

Separate same-week example: success Monday 2026-10-19, due Thursday 2026-10-22,
offered Friday 2026-10-23/week 2026-10-19 is educationally due, familiar practice
with candidate none. Visit skip keeps evidence/due dates unchanged and re-requests
with suppressDueReviewForVisit true. Exhausted familiar practice remains accessible,
labelled repeat-practice/noncompetitive. A new week alone creates no opportunity.

## Audio, controls and acceptance ownership

The [human music revision](../work-package/execution/MUSIC-REVISION.md) supersedes
original synthesized music: locally bundled licensed online replacements, creator
attribution/source/licence evidence and reproducible conversion/loop/gain edits
belong to WP02-03A. Two village/quieter-library themes and five effects remain;
roughly 60–90-second loops apply where suitable, with any necessary bounded
refinement returned to Controller rather than arbitrary trimming.

The latest Controller amendment records the chosen pair as Market on the Sea
and Sunset Walk, and the human response “Much better—use these tracks”. Selection
approval is therefore complete; no further source-selection approval is needed
without a material new musical change. No device/player details or itemized
full-theme/join/cue listening were supplied. Technical source checks and actual
integrated/published listening remain with the audio and acceptance owners.

All scenarios start silent before explicit enable, with remembered independent
music/effects mute and levels, explicit Stop for read-aloud and persistent Silence
all stopping music, effects and speech. WP04-05A owns preference persistence/ack;
WP02-05A owns immediate synchronous playback/speech gating. Sliders/late help or
load callbacks cannot implicitly unmute or defeat silence. Learning supplies
safe narration and assistance facts, without preference writers/playback callbacks.
Text-only judgements and world access stay identical.

WP04-04A verifies atomic Check/learning/reward/world changes, duplicate/stale/save
failure, help-before-display, exact revision resolution and committed reload.
WP02-06A verifies real accessible controls, correct saved projection and celebration
only for acknowledged new changes. WP06 verifies actual listening plus published
PC/tablet play; playback events, numerical measurements and these pure tests are
not evidence of heard quality or a completed adventure. WP02-12A reuses those
observations. No second full journey or audio production is commissioned here.
