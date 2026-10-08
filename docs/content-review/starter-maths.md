# Starter maths content review — WP03-02A

Author and content reviewer: Codex WP03-02A, 9 October 2026. Original task prose,
feedback, hints and worked support were reviewed against the finite arithmetic
domains and independent answer table below. Records are internally approved for
catalogue assembly; qualified educator, child and published-game review have not
occurred. Independent chunk acceptance remains Controller-owned.

The accepted registry retains the [DfE mathematics programme](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study).
M01 uses Number — addition and subtraction; M04 uses Number — multiplication and
division: integer scaling/correspondence problems, in the Years 3–4 planning
context. These small-number tasks consolidate earlier arithmetic. All 24 are
introductory support; larger numbers alone do not justify core/stretch. This is
selected practice, not a statutory attainment or calibrated ability assessment.
No copied bank, new library, parser, runtime AI or remote resource is used.

## Exact inventory and independent answer review

Bridge solutions below were chosen independently of the production worked
examples. The complete wrong response for every bridge is `[1]`, expected
`judged`, false, `sum-under`. The complete wrong basket for every merchant is
`{apples:1, pears:0}`, expected `judged`, false, both `total-mismatch` and
`relationship-mismatch`. Tests check those expectations for each record.

| Canonical ID | Retained meaningful parameters | Independent reachable answer |
|---|---|---|
| lif.math.bridge.r1.total-6 | target=6 | [6] |
| lif.math.bridge.r1.total-7 | target=7 | [3,4] |
| lif.math.bridge.r1.total-8 | target=8 | [4,4] |
| lif.math.bridge.r1.total-9 | target=9 | [3,3,3] |
| lif.math.bridge.r1.total-10 | target=10 | [5,5] |
| lif.math.bridge.r1.total-11 | target=11 | [5,6] |
| lif.math.bridge.r1.total-12 | target=12 | [4,4,4] |
| lif.math.bridge.r1.total-13 | target=13 | [3,5,5] |
| lif.math.bridge.r1.total-14 | target=14 | [4,5,5] |
| lif.math.bridge.r1.total-15 | target=15 | [5,5,5] |
| lif.math.bridge.r1.total-16 | target=16 | [4,6,6] |
| lif.math.bridge.r1.total-17 | target=17 | [5,6,6] |
| lif.math.merchant.r1.mult-2.pears-1 | multiplier=2, pears=1 | 2 apples, 1 pear; total 3 |
| lif.math.merchant.r1.mult-2.pears-2 | multiplier=2, pears=2 | 4 apples, 2 pears; total 6 |
| lif.math.merchant.r1.mult-2.pears-3 | multiplier=2, pears=3 | 6 apples, 3 pears; total 9 |
| lif.math.merchant.r1.mult-2.pears-4 | multiplier=2, pears=4 | 8 apples, 4 pears; total 12 |
| lif.math.merchant.r1.mult-2.pears-5 | multiplier=2, pears=5 | 10 apples, 5 pears; total 15 |
| lif.math.merchant.r1.mult-2.pears-6 | multiplier=2, pears=6 | 12 apples, 6 pears; total 18 |
| lif.math.merchant.r1.mult-3.pears-1 | multiplier=3, pears=1 | 3 apples, 1 pear; total 4 |
| lif.math.merchant.r1.mult-3.pears-2 | multiplier=3, pears=2 | 6 apples, 2 pears; total 8 |
| lif.math.merchant.r1.mult-3.pears-3 | multiplier=3, pears=3 | 9 apples, 3 pears; total 12 |
| lif.math.merchant.r1.mult-3.pears-4 | multiplier=3, pears=4 | 12 apples, 4 pears; total 16 |
| lif.math.merchant.r1.mult-3.pears-5 | multiplier=3, pears=5 | 15 apples, 5 pears; total 20 |
| lif.math.merchant.r1.mult-3.pears-6 | multiplier=3, pears=6 | 18 apples, 6 pears; total 24 |

All descriptors have authoredKey null, equivalenceVersion r1, and the family ID
in their canonical prefix. contentRevision is `starter-maths-1`. Each bridge
solution uses at most three permitted planks; every merchant solution satisfies
both constraints and fits the 24-fruit limit. The same total can be a different
merchant question: multiplier 2/pears 4 and multiplier 3/pears 3 both total 12,
but assess different given relationships and retain different canonical IDs.

## Exact educational and structural cases

| Anchor response | Expected and observed |
|---|---|
| Bridge [6,6], [4,4,4], [1,2,3,6], [6,3,2,1] | All judged correct; one unchanged total-12 identity |
| Bridge [5,6] | Judged false, sum-under; observed 11 m, 1 m short |
| Bridge [6,6,1] | Judged false, sum-over; observed 13 m, 1 m over |
| Merchant apples 6, pears 3 | Judged correct |
| Merchant apples 5, pears 4 | Judged false, relationship-mismatch only |
| Merchant apples 4, pears 2 | Judged false, total-mismatch only |
| Merchant apples 2, pears 2 | Judged false, both mismatch codes |

| Boundary | Expected and observed |
|---|---|
| Bridge [] | Incomplete, missing planks |
| Bridge six 1 m planks | Legal domain; judged false against 12 m |
| Bridge seven planks totalling 12 m | Invalid-response despite its arithmetic total |
| Bridge 0/7/1.5/string/NaN/Infinity/sparse lengths | Invalid-response |
| Bridge extra coordinates or wrong kind | Invalid-response |
| Merchant null counts, or wholly empty 0+0 | Incomplete |
| Merchant 0 apples/3 pears or 6 apples/0 pears | Complete domain response; judged false |
| Merchant 18 apples/6 pears (24 fruit) | Legal domain; judged false for anchor, correct for multiplier 3/pears 6 |
| Merchant 22 apples/3 pears (25 fruit) | Invalid-response |
| Merchant negative/noninteger/string/boolean/NaN/Infinity/missing counts | Invalid-response |
| Merchant unknown extra field/wrong kind | Invalid-response |
| Unreachable/mismatched/withheld/malformed task | Unavailable-content before response validation |

Invalid, incomplete and unavailable results have no correctness or points.
Only permitted complete responses are judged. Exploration before Check is a
draft; this family emits no learning observation, attempt count or reward.

## Content, assistance and feedback review

Neutral instructionText describes controls; assessedText contains the required
span or the two merchant requests. The merchant anchor retains exactly:
“Please pack twice as many apples as pears. I need nine pieces of fruit altogether.”
Neutral narration contains only instructions. Mathematical assessed text may be
read separately without implying a hint. No audio is generated or played here.

Hint 1 redirects attention to the given conditions. Hint 2 supplies an addition
or grouping strategy without giving the task's final construction/counts; its
given multiplier is already in the prompt. Worked support has a third distinct
ID, deliberately reveals a checked solution and must be recorded as answer help
before display by downstream state/UI. Reused help IDs are scoped by retained
canonical task and revision. Bridge support presents one possible arrangement,
never the sole accepted answer. Singular/plural language was reviewed.

Wrong bridge feedback states the actual total and difference, then explains how
changing a plank changes the total. Merchant feedback independently reports
observed total and relationship violations; satisfying one does not suppress
the other. No statement diagnoses a learner or auto-corrects their basket.
Text accompanies all feedback; sound is not needed to understand correctness.

Bridge primary evidence is M01; metres contextualise M07 without separately
assessing it. Merchant primary evidence is mixed-task M04, with M02 and E08
contextual only. Downstream observation construction must preserve mixed evidence;
this evaluator does not add an incompatible evidenceMode field to EvaluationResult.

## Focused executable evidence and handoff

`tests/learning/starter-maths.test.ts`: 70 tests passed. It independently pins
24 answers and wrong cases, executes 52 exported manifest cases, and exhausts
55,986 ordered legal bridge responses across all 12 targets (671,832 judgements).
All 325 legal nonnegative counter pairs are checked against each of 12 merchant
requests (3,900 evaluations, including empty baskets). Explicit malformed/draft/
content-error cases check unscored tags, and inputs/identities remain unchanged.
Focused no-emit TypeScript checking passed without writing shared build caches.

WP03-05A owns aggregation and bindings. Use total-12 for q1-story-m01 and
mult-2.pears-3 for q3-story-m04; their other 11 tasks form distinct transfer pools
under the signed-off binding table. Example transferable descriptors are bridge
`{target:13}` and merchant `{multiplier:2,pears:4}`; their independently checked
answers above are reachable and exclude the anchors. No new binding or selector
is supplied here. Required tasks still follow WP02 Q1/Q3 quest prerequisites.

WP02/WP04 integration must reproduce the boundary/constraint cases through real
controls→Check→commit→reload. Attempt/assistance/history/reward behavior, graphical
rendering, narration playback and the published journey are not established by
this family review. The finite support pools do not promise 30 unseen tasks or
an available harder band.
