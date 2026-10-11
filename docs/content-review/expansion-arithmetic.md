# Expansion arithmetic review — WP03-06A

Author/content reviewer: Codex, 11 October 2026. This is an original authored
bank with numerical, demand, response, representation and help review. Task
`review.status = approved` records this author review. Independent Sol/xhigh
review and Controller acceptance remain pending; no qualified educator, child
review, curriculum completeness or educational efficacy is claimed.

The frozen base is `6b5834953b56b4f2ce33c099700b1090805b6144`. The bank adds
40 canonical tasks: M01–M04 each have **4 core, 3 support, 3 stretch**. None of
the 24 retained starter tasks contributes to these floors or changes demand.
There is no random domain, remote bank, expression parser or runtime wiring.

## Source and demand review

The directly linked [DfE mathematics programme](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study)
was checked on 11 October 2026. The following codes identify exact programme
sections; every record also retains the full official URL, section and band.

| Code | Official programme section | Selected relevance |
|---|---|---|
| A2 | Year 2, Number — addition and subtraction | Earlier whole-number calculation and inverse missing numbers. |
| G2 | Year 2, Number — multiplication and division | Equal groups/arrays and earlier exact sharing. |
| G3 | Year 3, Number — multiplication and division | Selected 3/4/8 facts and positive integer scaling. |
| A4 | Year 4, Number — addition and subtraction | Four-digit calculations, inverse checks and two-step problems. |
| G4 | Year 4, Number — multiplication and division | Facts to 12 × 12, exact inverse division, factor/equality reasoning, scaling and multiplying plus adding. |
| A5 | Year 5, Number — addition and subtraction | Selected multi-step missing-delivery reasoning. |

These are selected objective links. The Year 5 task does not claim the complete
Year 5 calculation range. Other stretch items retain Year 4 source material and
justify additional/less-direct reasoning explicitly, rather than relabelling
larger quantities as harder. The source section for M04 is multiplication and
division; contextual multiplication/reading never creates independent M02/E08
credit. M03 inverse work is primarily exact division; M02 missing dimensions
remain primarily equal-group/factor reasoning.

## Independent inventory and arithmetic oracle

Rows are the exact order of `ARITHMETIC_TASKS`, with one-based row numbers used
only for review navigation and manifest case names. They are **not** identity
parameters. Each descriptor is `{familyId: math.expansion.m01/m02/m03/m04,
equivalenceVersion: r1, authoredKey: null, parameters: {operation, ...givens}}`.
`canonicalQuestionId` uses the existing sorted-key, typed JSON-tuple encoding;
the exported manifest contains all exact canonical strings. All given values
below are meaningful descriptor inputs, so reconstruction needs no seed/skin,
answer, release, week or item-order number.

Numeric answers were calculated separately and entered literally in the test
oracle. Inverse relations check that oracle against the givens before the actual
evaluator is called. Matching labels were checked against separate literal
product tables (42/72/132, 54/56/48, 88/144/49) and inverse totals 72/84. Sorting
was checked as 48 versus 63 with explicit equivalent-expression labels.

| Row | Skill/band | Operation and complete givens | Independent accepted answer | Source / actual demand |
|---|---|---|---|---|
| 1 | M01 support | add; a=28,b=15 | answer=43 | A2: direct combination with exchange. |
| 2 | M01 support | subtract; a=60,b=24 | answer=36 | A2: remove a known count, inverse check. |
| 3 | M01 support | missing-addend; a=37,total=80 | answer=43 | A2: one explicit missing total. |
| 4 | M01 core | add; a=2687,b=1756 | answer=4443 | A4: four-digit place-value exchange. |
| 5 | M01 core | subtract; a=5000,b=2678 | answer=2322 | A4: regroup through zero places. |
| 6 | M01 core | missing-addend; a=3846,total=7000 | answer=3154 | A4: inverse four-digit gap. |
| 7 | M01 core | balance; a=1240,b=875,c=560 | answer=1555 | A4: combine first store then find second-store gap. |
| 8 | M01 stretch | reverse-change; final=940,added=275,removed=180 | answer=845 | A4: undo changes in reverse chronological order. |
| 9 | M01 stretch | missing-delivery; start=1350,used=785,final=1420 | answer=855 | A4: reconstruct an intermediate missing change. |
| 10 | M01 stretch | two-deliveries; start=2200,first=875,used=1940,final=3000 | answer=1865 | A5: undo use and remove two known contributions. |
| 11 | M02 support | array-expression; groups=2,items=5 | displayed→forward **or** reverse | G2: map one represented grouping to either commutative product expression. |
| 12 | M02 support | array-total; groups=3,items=4 | answer=12 | G3: count/derive a represented total. |
| 13 | M02 support | array-total; groups=4,items=8 | answer=32 | G3: represented known-group repeated addition. |
| 14 | M02 core | match-products; a=6,b=7,c=8,d=9,e=12,f=11 | first→t-first **or** t-equivalent; second→t-second; third→t-third | G4: three distinct multiplication facts, equivalent count cards. |
| 15 | M02 core | match-products; a=9,b=6,c=7,d=8,e=12,f=4 | same semantic map; totals 54,56,48 | G4: different fact network, no visible countable objects. |
| 16 | M02 core | match-products; a=11,b=8,c=12,d=12,e=7,f=7 | same semantic map; totals 88,144,49 | G4: square facts and boundary 12 × 12. |
| 17 | M02 core | continue-pattern; step=7,start=4 | answer=49 | G4: infer one equal-group increment and extend. |
| 18 | M02 stretch | missing-factor; total=96,factor=8 | answer=12 | G4: reconstruct an absent array dimension. |
| 19 | M02 stretch | sort-products; a=6,b=8,c=7,d=9 | a,b,c→left; d,e,f→right | G4: recognise commutative and distributive equalities across six expressions. |
| 20 | M02 stretch | missing-pattern; step=9,start=3 | answer=36 | G4: infer later step and fill earlier missing term across a two-step gap. |
| 21 | M03 support | array-share; groups=1,items=12,divisor=2 | answer=6 | G2: redistribute displayed counters into two new equal shares. |
| 22 | M03 support | array-share; groups=1,items=12,divisor=3 | answer=4 | G3: redistribute displayed counters into three new shares. |
| 23 | M03 support | array-share; groups=2,items=10,divisor=5 | answer=4 | G2: displayed source counters, one-at-a-time sharing among five trays. |
| 24 | M03 core | divide; total=84,divisor=7 | answer=12 | G4: exact inverse fact with quotient/divisor roles. |
| 25 | M03 core | divide; total=132,divisor=12 | answer=11 | G4: another exact inverse fact, divisor boundary. |
| 26 | M03 core | match-inverses; a=8,b=9 | by-a→b; by-b→a | G4: distinguish both divisions derived from 8 × 9 = 72. |
| 27 | M03 core | match-inverses; a=7,b=12 | by-a→b; by-b→a | G4: distinguish both divisions derived from 7 × 12 = 84. |
| 28 | M03 stretch | regroup; groups=6,items=8,divisor=12 | answer=4 | G4: form a dividend from old packets then change packet size. |
| 29 | M03 stretch | remove-share; total=96,removed=24,divisor=9 | answer=8 | G4: remove unshared counters before dividing. |
| 30 | M03 stretch | combine-share; first=35,second=49,divisor=7 | answer=12 | G4: combine two sources to form the correct dividend. |
| 31 | M04 support | represented-scale; base=4,multiplier=2 | answer=8 | G3: visible base, explicit scaling. |
| 32 | M04 support | represented-scale; base=5,multiplier=3 | answer=15 | G3: visible base, another meaningful scale. |
| 33 | M04 support | represented-scale; base=6,multiplier=4 | answer=24 | G3: represented repeated copies, no harder-band claim. |
| 34 | M04 core | scale-total; base=8,multiplier=3 | large=24,total=32 | G4: scale and include original base in combined total. |
| 35 | M04 core | scale-total; base=24,multiplier=2 | large=48,total=72 | G4: independent base at authoring ceiling; same two-count demand. |
| 36 | M04 core | undo-scale; scaled=48,multiplier=4 | answer=12 | G4: undo scaling to infer the base. |
| 37 | M04 core | scale-extra; base=17,multiplier=3,extra=5 | answer=56 | G4: multiply base, add an unscaled extra once. |
| 38 | M04 stretch | total-constraints; total=60,multiplier=4 | small=12,large=48 | G4: infer one part from a combined total, check both unknowns. |
| 39 | M04 stretch | difference-constraints; difference=18,multiplier=3 | small=9,large=27 | G4: infer one part from the extra parts, not all large-pack parts. |
| 40 | M04 stretch | after-removal; remaining=29,removed=7,multiplier=2 | small=12,large=24 | G4: restore original total before reconstructing both original counts. |

Row 19's exact expressions are `6 × 8`, `8 × 6`, `(5 × 8) + 8`, `7 × 9`,
`9 × 7`, `(6 × 9) + 9`. There is no expression-input parser: these are authored
labels and stable item/group IDs. Parentheses make the intended operations
unambiguous. Pattern rows retain the first group index and group step; these
parameters generate every printed term and identify the exact missing position
through the operation name. Repeated operation families have different genuine
given arithmetic relationships, not renamed skins/options/retries.

## Representation, help and response review

Nine real array stimuli occur in rows 11–13, 21–23 and 31–33. Their exact
`groups/itemsPerGroup` pairs are 2/5, 3/4, 4/8, 1/12, 1/12, 2/10, 1/4, 1/5,
1/6. Captions and source alternatives state only those given groups and items.
All other records use null stimulus. Rows 21–23 ask for a **new** share among
the stated trays; the displayed source grouping is not the requested quotient.
Row 11 asks which product represents the source grouping, accepting either
factor order; it does not provide a derived product total in the caption.

This was corrected after review exposed answer leakage in the initial
represented-share question. The pre-fix regression failed because the source
alternative literally stated the requested `6`-counter share. The retained
`.checks/represented-share-pre-fix.log` records that failure. The revised source
arrays describe original counters, while the child computes a new share. The
original full task→structural validation→evaluation path and all focused tests
passed after correction. No downstream renderer workaround is required.

Each task has a primary assessed objective, instruction versus assessed prompt,
neutral control narration, two distinct hint IDs, an attention hint and a
task-specific strategy hint. Neither hint states a computed result or identifies
a correct option ID. Worked support is separate and intentionally supplies the
solution and an inverse/check strategy; consumers must record help before
display. Explanation after Check supplies the same factual arithmetic, without
diagnosing a misconception or claiming ability. Narration of maths source data
is permitted and does not independently credit reading.

There are 33 quantity tasks (28 single-count, five two-count), six matching tasks
and one sorting task. Whole counts require denominator exactly 1 and unit
`count`; equivalent rational forms and alternate units are not controls for this
family. Per-task maxima are 12, 24, 96, 100, 120, 144 or 10000. Zero is a complete
permitted count, judged wrong where appropriate. Blank/missing required slots
are incomplete; an out-of-domain value anywhere makes even a partial map invalid.
Matching has at most three pairs, no repeated target endpoints; sorting permits
multiple items in each group. Object/option order never changes the verdict.

All legitimate alternatives are enumerated: row 11 forward/reverse product
cards and rows 14–16 equivalent first-total cards. No other whole-count tuple
has multiple numerical solutions. Quantity constraints were checked using
independent inverse equations and every permitted response combination.

## Domains, negative examples and actual checks

Authoring ceilings are addition/subtraction givens/results 0–10000; products use
factors 1–12, exact division uses divisors 1–12, and scaling base counts are 1–24
with multipliers 2–4. These are limits, not an unbounded generator. The forty
listed tuples are the only deliverable domain. Every requested count is a safe,
nonnegative integer within its tighter response spec. Unknown tuples, zero
divisors, non-exact divisions, changed objectives, leaked/mismatched stimuli,
unreviewed help/rules, withheld review and expanded controls are unavailable
content before examining the response. Reconstructed records are compared with
the finite reviewed records, allowing object/option order and a separate positive
content revision. No new unreviewed tuple is accepted because an evaluator can
calculate it.

| Response family | Reachable/alternative | Complete wrong | Structural invalid | Partial |
|---|---|---|---|---|
| Single quantity | Row 4 answer 4443; integer denominator 1, unit count | Row 4 answer 0 or 10000, both judged | 10001, fraction/noninteger, denominator 2, wrong unit, unknown slot | empty map or answer=null |
| Two quantities | Row 38 small=12,large=48 | 15/45 keeps total but breaks scaling; 10/40 keeps scaling but breaks total; 0/0 is complete wrong | value 97 beyond max96, including when other slot is missing | small=null or omitted, valid large present |
| Represented matching | Row 11 displayed→forward or reverse | displayed→addition | unknown target/item | displayed=null or empty map |
| Product/inverse matching | Row 14 first→t-first or t-equivalent, other pairs correct; row 26 by-a→b,by-b→a | swapped valid endpoints | duplicate target endpoints, even in a partial map | one legal pair and remaining null/omitted |
| Group sorting | Row 19 a,b,c→left,d,e,f→right | swap all two groups, or any one wrong placement | unknown item/group | legal assignments with one item omitted/null |

`ARITHMETIC_MANIFEST` exports 164 executable cases: correct plus all valid
alternatives, complete wrong, partial and structural-invalid for every tuple.
It references the actual canonical task, whose reviewed stimulus/alternative,
source, demand, response bounds, feedback and help are available to WP03-13A.
The focused suite checks all 71,444 single-count values, all 57,509 two-count
combinations, 203 matching maps and 64 sorting maps: **129,220** exhaustive family
responses, in addition to manifests, metadata, content faults and compatibility.
Valid zero and maximum values are not confused with malformed drafts. Maximum
12 × 12, divisor12, base24 and input count10000 are exercised; zero divisor and
85÷7 are explicitly unavailable unreviewed content.

Executed on the isolated candidate: focused strict TypeScript check passed; the
arithmetic, starter-maths and identity suites initially passed **100 tests in three files**.
After the independent review's P2 reconstructed-content correction, the same
focused suites passed **104 tests** (15 arithmetic, 70 starter, 19 identity).
Existing starter controls and exact
IDs were unchanged; the related starter suite independently rechecked every
existing bridge arrangement and merchant counter domain. These checks prove the
pure family boundary, not committed state, rendered widgets or published play.

The independent Sol/xhigh review passed all forty supplied meanings, numeric
answers, demand/source/help checks and binding proposals, but required one P2
repair: JSON primitive serialization converted NaN and both infinities to null,
so malformed reconstructed text-task stimuli could pass validation and score.
The author reproduced all three exact cases as failing end-to-end regressions
before changing production behavior. The comparison now permits only finite
JSON primitives, plain records and arrays, throwing for undeclared/non-finite
values before lossy serialization. Existing validator handling converts that
throw into malformed-content and evaluation returns unavailable-content.
Reconstructed genuine null/text and all nine array representations still validate
and accept their independent answers; non-finite response counts separately
remain invalid-response. The original red and post-fix green logs are retained
under `.checks/P2-original-cases-pre-fix.log` and
`.checks/P2-original-cases-post-fix.log`. All focused regressions and strict
TypeScript passed; the same independent reviewer's recheck remains pending.

## Binding handoff and retained identity

`ARITHMETIC_BINDING_PROPOSALS` is data for the assembler, not an installed
registry. It follows the exact WP03-13A required/optional contract:

| Quest | Proposed actual route | Pool |
|---|---|---|
| Q1 | q1-revisit-m01-quantity | All ten new M01 quantity tasks; optional totals breadth. |
| Q3 | q3-revisit-m02-matching / quantity / sorting (one row each) | Separate M02 assessment; merchant success never credits M02. |
| Q3 | q3-revisit-m04-quantity | All ten new M04 scaling tasks; optional expansion of scaling/total work. |
| Q4 | **q4-story-m02-match** | Four M02 matching tasks, including represented support row 11 and three core fact matches. |
| Q4 | q4-revisit-m02-quantity / sorting | Explicit optional equal-group/pattern pools, no new required beat. |
| Q4 | q4-revisit-m03-quantity / matching | Exact division and inverse tasks; optional own primary M03 assessment. |
| Q9 | q9-revisit-m01-quantity | Separate M01 missing-total/reverse-change work, distinct from clock evidence. |

Every proposed row is M2, has null sourceBindingId, a nonempty explicit task-ID
list, one primary skill, one response kind and its matching/sorting/manipulation
mechanic. Only the documented Q4 matching row is required. No new required work
is attached to Q1–Q3; no quest graph, registry or restoration fact changes here.
The required Q4 pool has a genuine support route. Optional core/stretch-only
matching/sorting pools honestly expose their available bands; selectors must
use the existing unavailable-band behavior rather than invent support content.

The manifest retains all twelve bridge target IDs and twelve merchant IDs as
references only. `lif.math.bridge.r1.total-12` still accepts 6+6, 4+4+4 and
1+2+3+6 under one-to-six 1–6 m planks. Merchant anchor
`lif.math.merchant.r1.mult-2.pears-3` remains six apples/three pears, total nine,
with the original at-most-24-fruit controls. No starter prose, help, demand,
response, outcome or descriptor was edited. WP03-13A integrates these exports
and bindings; WP02/WP04 later prove controls→Check→committed help/evidence/save
and restore. This author review makes no downstream acceptance claim.
