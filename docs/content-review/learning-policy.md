# Learning evidence and selection policy

WP03-04A, 9 October 2026. This is a record of the implemented product heuristics,
not research-validated mastery, a calibrated ability estimate or curriculum coverage
certification. The policy emits suggestions and factual counts. It cannot lock a
quest, award points, create an encounter or decide durable eligibility.

## Inputs and authority

`applyLearningObservation`, `resolveBindingIntent`, `selectNextActivity` and
`summarizeLearning` use the frozen learning DTOs. All inputs are readonly; changed
records are replaced and unaffected skill/band records are preserved. Outputs are
JSON data. Tests freeze inputs and check serialized before/after values.

WP04 supplies new committed observations once, cumulative attempts/help, permanent
story completion, accessible quests and canonical history. It validates saved
data, filters duplicate/stale/expired submissions, persists assistance before
display and retains unsuccessful canonical work. This reducer is not a second
durable replay guard. Suspension and audio controls produce no observation.
Zero-Check finish and mismatched active-episode/index facts produce no evidence.

The supplied catalogue is the delivered catalogue for the current milestone.
Only approved entries are selectable; registry declarations never deliver M2
content. Catalogue assembly validates definitions and route binding semantics;
the resolver additionally checks binding IDs, nonempty unique pools, approval,
skill/response-kind agreement, roles, accessibility and source linkage. Fresh
selection consumes only a resolved intent. WP04 revalidates saved binding
provenance when constructing a resume intent; the selector checks its retained
canonical descriptor, content revision, skill and band against approved content.

## Evidence and assistance

Every valid Check increments `validChecks`, and a correct Check increments
`correctChecks`. `answerHelpChecks` counts Checks made with sticky answer hint or
worked support already present. Help after a wrong Check can qualify the eventual
completed episode without retroactively incrementing that Check counter.

A wrong Check updates one active accumulator per encounter. Correctness appends
one succeeded episode. Deliberate unsuccessful finish appends one existing
Check-bearing episode and adds no Check. Completion removes its active accumulator;
WP04 retains the encounter and supplies cumulative attempts/help on the next
episode. Original `firstCheckCorrect` and `encounterCheckIndex` are never reset by
this reducer. Recent windows contain the last four completed episodes per band,
not four submissions; independent aggregates retain older outcomes.

Independent success requires success on the retained encounter's first Check,
original first correctness, no answer hint/worked support, and objective-specific
`evidenceMode=independent`. The committed adapter owns that evidence mode. Neutral
instructions and routine narration do not qualify mathematical evidence or count
as help. Listening to assessed reading is `listening-supported`; a mixed task is
`mixed`. Guided, listening, mixed and retry completions still count as success,
with non-independent successes in `supportedSuccesses`. Retry is a subset with
cumulative Check index greater than one. This educational label is not a numeric
reward classification. Neither a text nor a spoken answer hint can be washed away.

Only the primary skill/objective is updated. M04 mixed-task success does not
establish M02 or E08 evidence. Issues retain observed wrong responses and authored
feedback; they are not diagnoses. Later-distinct success counts a non-familiar
successful canonical task when this band already has a cumulative correct Check,
even if earlier success needed help and intervening unsuccessful episodes evicted
it from the recent window. WP04's original non-familiar flag survives unsuccessful
continuation; succeeded encounters cannot be reopened as fresh non-familiar work.
The recent IDs additionally guard against counting a same-ID replay. The existence
of earlier success comes from the cumulative aggregate, never from window survival.
The bounded distinct-ID list is derived from the four completed episodes; summary
distinct counts describe that retained window, not lifetime unique-task totals.
Familiar review never supplies transfer evidence or one of the three non-familiar
successes used for promotion.

## Bands, finite pools and reviews

Start at core if available; otherwise offer the lowest available introductory
band with a missing-core suggestion. A singleton story anchor stays fixed.
For subsequent policy, current band is the band with the most recently completed
episode date. Date ties between bands choose higher authored demand; the DTO has
no global within-day event order. Within one band the retained episode/review
array preserves actual order. Still-open wrong Checks cannot move current band.

Three independent successes on distinct, non-familiar canonical tasks among the
last four completed episodes suggest the next delivered higher band. Two latest
completed episodes with answer help or unsuccessful outcomes suggest a lower
available band. A completed supported/unsuccessful review also suggests support.
At the lowest available band, offer existing hints/worked support and the approved
prerequisite suggestion, explicitly identifying whether that content is delivered.
Suggestions never silently redirect a bound request to another skill. Missing
harder work keeps practice available with an honest message. At the top band there
is no invented fourth band.

Selection resumes retained work first, then respects story/transfer/revisit pools.
Unbound suggested practice may offer the oldest due skill/band; an explicit skill
limits it to that skill. Visit suppression bypasses review without changing its
date or adding failure. The UI/WP04 must set suppression for subsequent requests
after an offer or skip until the next visit, so the pure selector offers at most
the one review represented by this request. Explicit story, transfer, revisit,
easier and repeat routes never receive unsolicited review.

For ordinary adaptive practice within the selected band, prefer unseen tasks,
then stable canonical string order.
An explicit repeat prefers familiar tasks. Exhausted unbound suggested practice
is labelled `repeat-practice` with `familiar=true`. Bound work retains its binding
reason. Child-easier chooses the nearest delivered lower band (or lowest available)
and remains noncompetitive. No weekly unseen-task quota is implied.

First independent success per band schedules three civil days later. Independent
review schedules seven; supported or deliberately unsuccessful review schedules
three and suggests support. Wrong still-open review does not finalize a result.
The reducer uses WP05 `addCalendarDays`, never elapsed 72/168-hour arithmetic or
an ambient clock. Selection compares the supplied date/week context. Missed days
simply leave review due, with no penalty.

Due review selects from approved tasks in the due band with an actual canonical
previous-success date and week in committed history. The selected familiar task
retains a non-null `reviewReference` identifying that same canonical task, the
band's due date and its actual previous success week. Choose the oldest available
due skill/band, then stable canonical order. An unseen task cannot acquire review
provenance from another task. Skipping review restores ordinary unseen-first
practice; absent usable review provenance also falls through to ordinary practice
without inventing a reference. Review remains optional and visit suppression does
not erase the due date.

Same-week educational review retains its genuine reason/reference and can complete,
update evidence and export/decode successfully with zero award. Only reward
eligibility requires a later competition week. The former unseen-task/null-reference
review convention was rejected during integration and is superseded by this rule;
the original failure and full-path correction evidence are retained in
[WP03-04A-INTEGRATION-CORRECTION](../work-package/execution/WP03-04A-INTEGRATION-CORRECTION.md).

## Provenance and reward advisory boundary

Quest omission resolves the first incomplete required row in binding order;
explicit incomplete story rows are permitted. Unknown, completed, inaccessible,
optional-as-story, mismatched-quest or invalid-source requests are unavailable.
An M1 story row must contain exactly one fixed task, including when the current
milestone is M2. Multi-task M1 story rows are rejected as invalid bindings before
selection. M2 story pools and M1 transfer/revisit pools can contain multiple tasks.
An M1 transfer derives its excluded canonical source from the immutable singleton
story row plus permanent completion, including after source encounter compaction.
Revisits remain revisits and cannot complete a required binding.

Pending canonical work in the requested pool wins over unseen work. Resume returns
the retained encounter ID, original reason/provenance, familiar flag and review
reference. It cannot attach the newly requested story binding or clear help.
Missing retained content is recoverably unavailable rather than a replacement.
After success, a later fresh required encounter can receive story provenance;
existing canonical reward history still applies.

`rewardCandidate` is only `first-encounter`, `later-week-due-review` or `none`.
A fresh never-Checked task can be a first candidate. A selected due review can be
a review candidate only after that canonical task's actual previous success week,
and not if already Checked in the current week. Child-easier/repeat and resumed
work return `none`; resume tells WP05 to inspect its existing opportunity instead
of opening another. Week rollover, familiar replay or cosmetic identity changes
cannot create a candidate. Delayed success compares its actual success week,
not the older earning week. WP05 rechecks all eligibility, reserves any slot,
binds earning week and computes rewards. No output promises points or a slot.

## Compact acceptance histories

These rows name A/B/C/D as distinct canonical core tasks. Selection fixtures use
canonical IDs derived from authored keys A/B/C/D; reducer fixtures use those
literal IDs so expected counts are independently readable. S/T denote delivered
support/stretch tasks. All rows are asserted in the owned tests.

| Input history / context | Expected and observed |
|---|---|
| Completed independent A, helped D, independent B, independent C | Four episodes; select T/stretch |
| Independent A/A/A in separate episodes | Three successes but one identity; stay core |
| A wrong at sequence 1, wrong 2, correct 3 with inherited hint | Three Checks, one completed episode, one supported retry; no independent success |
| Completed helped A and B | Suggest S/support |
| Helped A complete, B wrong and still open; unchecked departure | Core; B is not a completed struggle |
| Wrong A/episode 1/sequence 1 plus hint; finish; return correct A/episode 2/sequence 2 | Two Checks, two completed episodes, one supported retry; finish adds no Check |
| Helped A success; distinct B has four unsuccessful finished episodes then succeeds at cumulative Check 5 | Six Checks, six episodes, two supported successes, one retry and one later-distinct success; A's window eviction does not erase the fact |
| Helped A success; distinct B has five unsuccessful finished episodes then succeeds at cumulative Check 6 | Seven Checks, seven episodes, two supported successes, one retry and one later-distinct success |
| Zero-Check finish | No observation accepted, no attempts/failure |
| Independent A/B/C, no stretch task in requested pool | Core continues; harder practice unavailable suggestion |
| First independent success 2026-10-23 | Due 2026-10-26 across London autumn DST |
| Independent review 2026-10-26 | Due 2026-11-02 |
| Supported missed review 2026-11-05 | Due 2026-11-08; support suggested |
| Unsuccessful finished review 2026-11-09 | Due 2026-11-12; wrong open Check alone did not reschedule |
| First success Monday 2026-10-19; review due 2026-10-22 within same week | Familiar educational review; no new reward candidate |
| Q1 success 2026-10-05; same-week review completes 2026-10-08 | Zero award/new receipts, no new slot/opportunity; next due 2026-10-15; backup decode equals committed save |
| A actual success week 2026-10-19, due review 2026-10-26 | Same canonical A, familiar; later-week candidate only |
| A old earning week 2026-10-19 but actual success week 2026-10-26 | Review in 2026-10-26 has no new candidate |
| Source A compacted, permanent story completion retained | Transfer selects B/C; never source A |
| M1 story row contains support S and core A | Resolver returns unavailable/invalid-binding; no validated intent reaches selection |
| Pending hinted free practice requested through story or another week | Original encounter/provenance/reason; no fresh reward candidate |
| All finite core items familiar; no due review | Labelled repeat practice, world/learning access remains |

Factual summary fixtures separately pin missing evidence, listening-supported
reading, mixed M04, retry subsets, later-distinct success, recent dates/familiar
labels, unavailable delivery and all 20 supplied skill rows. A fresh E08 fixture
traverses resolver → selector → reducer → summary, followed by a distinct success
and familiar later-week review. Storage, duplicate filtering, atomic commit/reload,
world completion and audible behavior remain downstream integration evidence.

Independent review corrections F01/F02 (9 October 2026) replaced the original
window-dependent later-distinct predicate and added M1 singleton validation.
Boundary cases cover 0/3/4/5/8 unsuccessful episodes, both earlier helped and
independent success, familiar same-task replay, no prior success, and other
skill/band success. The prerequisite test uses a legitimate M1 revisit pool.
The unchanged reviewer harness now passes 11/11; the final scoped suite passes
279 tests, including 113 owned tests. This is author correction evidence;
independent recheck and acceptance remain Controller-owned.
