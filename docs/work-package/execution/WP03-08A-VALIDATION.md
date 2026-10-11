# WP03-08A independent validation — scoped PASS after F1 and diagram repairs

11 October 2026. Independent Codex validator; not the candidate author. **Scoped
PASS for the refrozen candidate below: F1 and the assembly-returned diagram
contract defect are closed by narrow independent rechecks.** The replacement
supplies the fourth substantiated M09 core task. My earlier review missed the
frozen diagram coordinate bounds and did not exercise the real renderer; its
diagram-compliance conclusion was insufficient and is superseded below. Earlier
passing grading and support-selection evidence is retained where unchanged.
Controller retains acceptance and
integration authority; this is not integrated/published or final acoustic
acceptance. The original rejection remains preserved below and in the author's
[before snapshot](../../../artifacts/wp03-08a-20261011/f1-repair/WP03-08A-VALIDATION-before.md).

## Frozen scope and authority

Candidate: `artifacts/wp03-08a-20261011/candidate`.
Base commit: `5a9f131e29f0c12717abbeb2f0e6a18fbeaf5f26`.
The parent [owned-files.json](../../../artifacts/wp03-08a-20261011/owned-files.json)
was checked against all five files; exact byte lengths and SHA-256 values agree:

| Candidate-relative path | Bytes | SHA-256 |
|---|---:|---|
| src/content/expansion-maths/time-space-data.ts | 40037 | d2ca82c13ee18984c6231409b92bb0f806b8f0bd933090745db7f35ea8e3772c |
| src/learning/evaluators/expansion-time-space-data.ts | 9650 | d280f8c1d328ff8891acee6d8fe1c4959139148d125cc71aefb704dd51676248 |
| tests/learning/expansion-time-space-data.test.ts | 25778 | 5dc7bc2448f15409447d6dfb40f0dc4a29ee49383735fa075688027661599442 |
| docs/content-review/expansion-time-space-data.md | 22997 | ba601f0c5a5d8bfa0a73481d51b6f0fad7e6283cab200793cc910f2a7151af96 |
| docs/work-package/execution/WP03-08A-HANDOFF.md | 16263 | 77af62331681f7dcb2ccdd2c80f0c0c94b702dd168b895f38a5ad4b47e08c8cf |

Read the candidate handoff and per-item review, WP03-08A, WP03-01A, the frozen
contracts/identity/skills and registry review, WP03-13A required/optional binding
requirements, and current
[continuation authority](CONTINUATION-AND-MUSIC-VARIATION.md). The latter permits
M2 continuation while deferring final listening; it does not waive independent
content review. No final acoustic acceptance is inferred.

The eight relevant frozen contract/policy/starter modules match the base source
after CRLF-only normalization. Candidate archive files use CRLF; Git blobs use
LF. Raw hashes and normalized comparisons are retained in fresh evidence.
All 36 starter IDs reconstruct unchanged, no new ID collides, and the nine M1
bindings remain in their untouched source. New tasks do not count starters or
additional accepted answers toward their floor.

## Diagram contract closure — independent source and actual-render recheck

**Scoped PASS, with the earlier review omission explicitly acknowledged.**
WP03-01A's stimulus table requires finite display coordinates in 0–100, equal
x/y scale and explicit labels for given lengths; coordinates are not measured
lengths. My original topology/equal-unit checks did not enforce the first of
those requirements. The negative compass/rotated-square sources therefore should
not have passed content review. The first-pass answer-space results remain valid
as grading evidence, but did not prove renderer compatibility or usable geometry.

The immediate pre-repair five-file snapshot is preserved under
[diagram-repair/before](../../../artifacts/wp03-08a-20261011/diagram-repair/before/),
with its [manifest](../../../artifacts/wp03-08a-20261011/diagram-repair/owned-files-before.json).
Fresh independent reproduction through the real `TaskStimulus` produced:

- Four compass tasks (`north-quarter-clockwise`, `two-turn-map`, `reverse-turns`,
  `alternating-turn-pattern`) with N y=-2/W x=-2, and `rotated-square-symmetry`
  with top y=-3/left x=-3: exactly five `TypeError: Malformed TaskStimulus producer
  metadata.` exceptions.
- The other five diagrams rendered into a 448×448 SVG but their geometry was
  only 13.18–19.76 pixels wide; fresh browser measurements showed overlapping
  vertex labels, plus overlapping 3/4/5 length labels in the classification task.
  This was a producer placement defect; the unchanged renderer's rejection was
  correct. Original source inputs, failures and screenshots remain preserved.

The current source corrects all ten placements within 10–90. Independent
pre/post comparison verified these exact positive uniform transforms, preserving
orientation, angles, relative lengths, incidence, closure and reflection symmetry:

| Distinct arrangement | Transform of old display points | Normal / compact geometry extent (pixels) |
|---|---|---|
| Introductory triangle | x′=20x+10, y′=20y+20 | 263.53×197.65 / 148.24×111.18 |
| Compass (four tasks) | x′=20x+50, y′=20y+50 | 263.53×263.53 / 148.24×148.24 |
| Rectangle (two tasks) | x′=(40/3)x+10, y′=(40/3)y+30 | 263.53×131.76 / 148.24×74.12 |
| 3–4–5 classification triangle | x′=20x+10, y′=20y+20 | 263.53×197.65 / 148.24×111.18 |
| Rotated square | x′=(40/3)x+50, y′=(40/3)y+50 | 263.53×263.53 / 148.24×148.24 |
| Square before proposed cut | x′=20x+10, y′=20y+10 | 263.53×263.53 / 148.24×148.24 |

All point/edge identities and endpoint relationships are unchanged. The rectangle
now has explicit 6/3/6/3 unit edge labels, the classification triangle retains
4/5/3 and the square has four explicit 4-unit labels. These are educational
givens; an 80-display-unit side does not mean an 80-unit measured length. The
accessible alternatives retain those givens and arrangements without supplying
the requested property, count or destination. The rotated-square alternative
now states equal radial distances instead of giving its old display radius as
a measured length. The proposed diagonal AC remains explicit in prompt/caption;
it is not invented as an additional boundary edge. All six distinct alternatives
were read against the rendered source and assessed question.

The validator change is exactly a finite 0–100 x/y guard before the trusted
export fast path (`expansion-time-space-data.ts:35–43`). Removing just that new
guard from the current evaluator reproduces the previous file byte-for-byte;
all response parsing and grading code is unchanged. Fresh checks verified all
ten exported and reconstructed records, their accepted answers, and 180 coordinate
probes across both axes. Negative/over-100, NaN/Infinity, null/undefined inputs
produce `diagram-coordinate-bounds` and unavailable-content. Coordinates 0, 100
and fractional 50.5 do not trigger that domain issue; their altered unreviewed
arrangements still produce unavailable-content through exact membership. A
valid numeric domain alone therefore cannot approve a geometry change or change
an answer. Nothing derives a grade from source or pointer coordinates.

All thirty IDs/descriptors, prompts, objectives, bands, answers, options, hints
and worked support are unchanged from the F1-accepted snapshot. All twenty
non-M09 records are deeply identical. All seven binding proposals and all 122
manifest cases are deeply identical. Only the ten diagrams' stimulus data and
contentRevision (1→2) changed in task exports. The F1 replacement canonical ID
below remains current. The earlier answer-space and support-selection proof is
reused on that evidence, rather than replaying the whole bank or broad tests.

Fresh execution used the real main `src/interaction/TaskStimulus.tsx`, transformed
from JSX in memory, React static rendering and headless Chromium with the actual
`widgets.css`. No renderer substitute, app build or shared output was used.
Renderer SHA-256: `3542c6ea2a4caca12871e37266a503a1fb654583ef4255f1d96a048ee75111c4`;
CSS SHA-256: `724acc295dfd04f7c508a872ad4624a9ec5b99ddf80f9fe73a1b8decb63c1cb6`.
Every original diagram was reproduced at 1366×900; every repaired diagram then
traversed producer validation → actual component → browser at both 1366×900 and
320×900. The SVG sizes were respectively 448×448 and 252×252. All twenty repaired
render cases passed: equal screen x/y scale, all text inside the SVG, no pair of
text labels overlapping and no horizontal page overflow.

I visually inspected the six distinct repaired arrangements at both widths,
not just their bounding boxes. Vertices, orientation, proportions and given
lengths remain discernible; the original collapsed-label defect is resolved.
Screenshots at each width:

| Arrangement | Normal | Compact |
|---|---|---|
| Triangle | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-1366-triangle-boundary.png) | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-320-triangle-boundary.png) |
| Compass | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-1366-north-quarter-clockwise.png) | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-320-north-quarter-clockwise.png) |
| Rectangle | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-1366-rectangle-symmetry.png) | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-320-rectangle-symmetry.png) |
| Classification triangle | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-1366-triangle-side-angle-classification.png) | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-320-triangle-side-angle-classification.png) |
| Rotated square | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-1366-rotated-square-symmetry.png) | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-320-rotated-square-symmetry.png) |
| Square/cut | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-1366-square-diagonal-pieces.png) | [PNG](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/after-320-square-diagonal-pieces.png) |

Visual limits: existing renderer labels sometimes sit on shape strokes, and its
fixed SVG font scales to approximately 9.3 CSS pixels at the compact width
(16.5 at normal width). The screenshots retain discernible labels and full-size
source text repeats the givens, but this is not certification of compact-label
readability for every learner or a screen-reader/interaction/zoom audit. Broader
widget accessibility, integrated save/resume, assembly, world and published play
remain downstream. This scoped producer correction requires no new source fix.

Independent [runner](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck.mjs),
[log](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck.log)
and [structured before/after evidence](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck/results.json)
are private and reproducible with `node artifacts/wp03-08a-20261011/independent-validation/diagram-recheck.mjs`.
The first launch used one excess parent traversal for the main renderer path and
stopped at ENOENT before rendering; its
[script](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck-attempt-01.mjs)
and [log](../../../artifacts/wp03-08a-20261011/independent-validation/diagram-recheck-attempt-01.log)
are preserved as a validator harness path failure. After the private path fix,
the complete bounded recheck exited successfully. The author-reported 114 family
tests, 856 related tests and focused TypeScript remain separately labelled author
evidence; none was broadly replayed here. Final five-file hashes above were
independently verified. Controller alone may integrate before assembly refresh.

## Retained F1 closure — narrow recheck before the later diagram repair

This section preserves the F1 repair evidence as executed. Its display-point
positions and unchanged-evaluator observation describe that earlier snapshot;
the subsequent display coordinates and evaluator guard are superseded by the
diagram closure above. Its mathematical classification and final identity remain
unchanged and F1 remains closed.

Final task: `triangle-side-angle-classification`, M09 core,
`src/content/expansion-maths/time-space-data.ts:67–68` and content-review row 68.
Exact final canonical identity:

```text
lif.math.expansion.m09.r1.authored-%5B%22triangle-side-angle-classification%22%2C%5B%5B%22source%22%2C%22triangle-ABC%3B%20AB4-BC5-CA3%3B%20A-top-left-B-right4-C-down3%3B%20classify-side-equality-and-angle-type%22%5D%5D%5D
```

Its descriptor source is
`triangle-ABC; AB4-BC5-CA3; A-top-left-B-right4-C-down3; classify-side-equality-and-angle-type`.
The complete prompt is: “Classify triangle ABC using BOTH its side lengths and
its angles. Which description fits it?” Instruction remains “Choose one answer,
then Check.” This now classifies a whole triangle using two properties, matching
the [Year 4 shape-classification objective](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-4-programme-of-study)
already inspected during the original review. Recognizing the right angle alone
leaves two choices; recognizing unequal sides alone also leaves two choices.
Combining the properties establishes a genuine core demand beyond the original
direct perpendicular-pair identification. No new source research was needed.

Independent source/help review:

- A(0,0), B(4,0), C(0,3); connected closed boundary A–B–C–A. Edges A-B, B-C,
  C-A carry labels “4 units”, “5 units”, “3 units”, respectively. These lengths
  agree with the supplied equal-unit geometry; no learner Pythagoras calculation
  is required because all three lengths are given.
- Accessible source: “Boundary A–B–C–A. B is 4 units directly right of A; C is
  3 units directly below A. Side AB is 4 units, BC is 5 units and CA is 3 units.
  Horizontal and vertical units have the same length.” It supplies the same
  givens without naming the angle or side classification.
- Hint 1: “Check whether any of the three labelled side lengths are equal.”
  Hint 2: “Inspect the corners and compare them with a square corner; then choose
  the description that matches both checks.” Neither states either classification.
- Worked support correctly explains unequal 4/5/3 lengths, the right angle at A
  and their combined classification. It remains a separate assisted field.
  Vocabulary definitions in every option remove an incidental terminology barrier
  while leaving both property decisions to the learner. No coordinate-derived
  grading was introduced; the evaluator file is byte-identical to the first freeze.

Fresh actual-export results, with input shape
`{"kind":"choice","choices":{"answer":"<option ID>"}}`:

| Option ID and full offered label | Independent semantics | Actual result |
|---|---|---|
| right-scalene — Right-angled and scalene: one right angle, no equal sides | Both properties hold | judged true, core, final ID above |
| right-isosceles — Right-angled and isosceles: one right angle, two equal sides | Angle only; 3,4,5 have no equal pair | judged false, choice-mismatch |
| acute-scalene — Acute-angled and scalene: all angles less than a right angle, no equal sides | Side equality only; A is a right angle | judged false, choice-mismatch |
| acute-isosceles — Acute-angled and isosceles: all angles less than a right angle, two equal sides | Neither property holds | judged false, choice-mismatch |

`validateTimeSpaceDataTask` returns `[]` for the exported and JSON-reconstructed
replacement. Empty choices return incomplete. The old `ab-ac` option submitted
to the new task returns invalid-response. The exact original frozen task with
`{"kind":"choice","choices":{"answer":"ab-ac"}}` now returns
unavailable-content, field descriptor, code unreviewed-tuple. Thus removal is
recoverable unavailable content, not a newly wrong learner answer or a silent
reinterpretation of the old canonical identity. Four narrow reconstructed-content
probes (changed BC length label, broken closing edge, altered accessible text,
wrong accepted response) all return unavailable-content before judging.

Fresh identity/inventory consistency checks also passed:

- All five new file sizes/hashes match the current owned-files.json; the preserved
  original source matches owned-files-before.json before it is used as evidence.
- New key/source reconstruct exactly to the final ID and differ from the rejected
  ID. The original task is absent from tasks, manifest and binding pools.
- The other 29 exported tasks are deeply equal to the verified before snapshot,
  including both legitimate M10 alternative sets. Thirty tasks remain, with
  exactly 4 core/3 support/3 stretch in each of M08/M09/M10.
- The four new manifest cases pass their declared status/correctness expectations;
  the remaining 118 cases are deeply unchanged. The manifest's task-ID list is
  exactly the old list with the one replacement.
- Every binding equals its old value after that same single ID substitution.
  Only q4-revisit-m09-choice and q8-revisit-m09-choice contain the replacement.
  All story pools and support records are unchanged, so their previously executed
  accepted-policy support-selection evidence remains applicable.

These were independent read-only direct Node v24.19.0 assertions through the
actual exports, using the existing private type-stripping loader and an inline
stdin script. The before module was checked against its frozen hash and loaded
with only its two runtime dependency paths redirected to the same unchanged
identity/skills modules. The run exited 0 and printed scoped PASS. No new private
file, source change, dependency installation or broad rerun was made. This report
records the exact recheck inputs/results; the execution transcript retains the
command/output. The 811 learning tests, 111 family tests, focused TypeScript and
original/replacement route logs in the new handoff are separately **author
evidence**, not claimed independent reruns. The author's first repair typecheck
failure remains retained in f1-repair/typecheck-repair-attempt-01.log.

**F1 is closed.** The substantive replacement meets the required educational
demand and preserves identity discipline, giving a scoped content/evaluator PASS
when combined with the unaffected first-pass evidence below.

## Historical F1 — P2: unsupported core demand and incorrect programme attribution

The following finding records the rejected first freeze, not an open finding on
the replacement. Its original five-file identity is preserved in
[owned-files-before.json](../../../artifacts/wp03-08a-20261011/f1-repair/owned-files-before.json).

Locations in that original frozen candidate:

- `src/content/expansion-maths/time-space-data.ts:67–68`, `triangle-perpendicular`.
- `docs/content-review/expansion-time-space-data.md:68`, M09 C / G4 row.

Exact canonical identity:

```text
lif.math.expansion.m09.r1.authored-%5B%22triangle-perpendicular%22%2C%5B%5B%22source%22%2C%22triangle-A-top-left-B-right4-C-down3%3B%20perpendicular-sides%22%5D%5D%5D
```

Original prompt: “Which pair of sides of triangle ABC meets at a right angle?”
The source gives A(0,0), B(4,0), C(0,3), with B directly right of A and C directly
below A. Options are AB and AC, AB and BC, AC and BC. The recorded demand is
“Classify the angle relationship of named sides, not the overall silhouette.”
The item declares `band: 'core'`, `programmeBand: 'Year 4'` and a section about
comparing/classifying geometric shapes by properties and sizes.

Fresh original response and result through the actual exports:

```json
{"kind":"choice","choices":{"answer":"ab-ac"}}
```

`validateTimeSpaceDataTask(task)` returns `[]`; evaluation returns
`status: 'judged', correct: true, band: 'core'`. The other two offered pairs are
judged wrong. Empty choices are incomplete; an unknown option is invalid-response.
The answer and response parsing are correct. The failed criterion is the
authored educational mapping and band floor, not learner wrongness or a parser
defect.

The [DfE programme, checked 11 October 2026](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-3-programme-of-study)
places identification of right angles and perpendicular pairs in Year 3.
Year 4 shape classification requires a different demand. This item asks for
one directly represented pair; it does not classify or compare shapes, combine
properties, transform an arrangement, or add another reasoning step. Naming the
sides changes the answer format but does not establish the claimed core
progression beyond `rectangle-right-angles`. The author's G3-consolidation note
acknowledges the earlier content but does not repair the Year 4 record or justify
counting it as the fourth genuine core task.

Required author action at the first review: correct the source attribution and deliver a genuinely
justified fourth M09 core demand. Retaining this item as additional earlier
consolidation plus a distinct new core task is one option. A substantive redesign
must receive an appropriate reviewed meaningful descriptor, not silently change
the meaning of this frozen tuple. Do not fix the floor by changing only its
rationale/year label. Re-review the changed prompt, all offered answers, hints,
worked support, accessible givens and binding membership; then refreeze the
owned outputs and return focused fresh evidence. Preserve starter identities and
the two multiple-correct M10 answer sets. Controller routes this finding to
original author chat `01a12b90-c700-7321-b313-d6c8ff062ae6`.

## Retained first-pass item-level independent review

This table documents all thirty original records. Its triangle-perpendicular row
is superseded by the independently reviewed replacement above; the other 29
records were verified deeply unchanged in the narrow recheck.

All thirty records were read together with their actual prompt, response options,
source/stimulus, accessible givens, two hints and worked support. Answers below
were independently calculated; the runner does not derive its expected answers
from the author's answer rule, manifest or tests. S/C/X denote authored bands.
Except F1, each demand is accepted for this selected scope; this is not educator
certification or a claim of calibrated difficulty.

| M08 item | Band and demand assessment | Independently derived answer; help/source review |
|---|---|---|
| morning-hands | S: represented half-hour and stated morning | 09:30 / 570. Hand positions give the problem, not the decoded time; both hints describe method. |
| morning-event-order | S: explicit whole-hour comparison | breakfast, gates, bell. Three distinct labels; hints do not supply the order. |
| same-hour-duration | S: direct within-hour duration | 30 minutes. Start/finish given; hints leave the subtraction/counting to the learner. |
| afternoon-conversion | C: convert a stated pm time | 15:25 / 925. Source remains 12-hour; response instruction is explicitly 24-hour. |
| midnight-crossing | C: combine intervals across explicit day boundary | 10 + 10 = 20 minutes. Day 0/Day 1 and finish are available in text; strategy hints do not give 20. |
| mixed-period-order | C: reconcile mixed notation before ordering | unlock, lunch, repair, close. Noon and pm unambiguous; two strategies precede full worked order. |
| elapsed-clock | C: convert 85-minute duration and carry an hour | 11:10 / 670. Given 09:45 and 85, with no finish in alternative. |
| latest-safe-service | X: derive deadline, filter, maximize departure | 09:10 / 550. Latest arrival permitted is 10:00; Reed fails. Three labelled services; hints leave selection unresolved. |
| journey-with-wait | X: interpret four-row journey including waiting | 75 minutes; legs 35 + wait 15 + leg 25. Earlier/last endpoints give same result; worked support accounts for waiting. |
| two-day-event-order | X: prioritize day over misleading clock magnitude | lock, inspect, restart, open. Day labels support the extra ordering relation; no hidden date/calendar assumption. |

| M09 item | Band and demand assessment | Independently derived answer; help/source review |
|---|---|---|
| triangle-boundary | S: earlier shape recognition, explicitly Y2 consolidation | triangle. Closed three-edge boundary; alternative describes joins without naming the shape. |
| north-quarter-clockwise | S: single specified turn | east. Compass labels and clockwise direction explicit; hints do not name the destination. |
| rectangle-right-angles | S: directly represented right-angle identification | four. 6-by-3 boundary; alternative describes side arrangement, not angle count. |
| rectangle-symmetry | C: test whole-boundary reflection, reject diagonals | two. Non-square dimensions matter; hints propose folds for testing without asserting success/count. |
| triangle-perpendicular | **F1: C not substantiated; direct Y3 recognition** | AB and AC. Geometry, answer, help and accessible arrangement are internally correct. |
| two-turn-map | C: compose turns in different directions | south: east → west → south. Consolidated Y3 source is explicit; composition adds a genuine step. |
| rotated-square-symmetry | C: retain symmetry under orientation change | four. Equal units and four equidistant vertices preserve square geometry; hints leave fold testing. |
| reverse-turns | X: recover an unknown start by reversing composition | north. Backward half then reverse quarter agrees with forward north → east → west. |
| alternating-turn-pattern | X: extend alternating sizes and compose five turns | west. Quarter/half/quarter/half/quarter totals seven quarters; worked directions agree. |
| square-diagonal-pieces | X: infer resulting pieces using angles and equality | right-isosceles, both pieces. Boundary closes; proposed AC cut is explicit; alternative does not classify the pieces. |

| M10 item | Band and demand assessment | Independently derived answer; help/source review |
|---|---|---|
| read-attendance-table | S: retrieve one labelled datum | twelve. Oak12/Elm8/Ash15; source alternative legitimately repeats the given value. |
| joint-greatest-bar | S: compare bars including a tie | **oak OR ash**, each 20 > Elm10. Prompt asks for one venue and explicitly accepts either; both controls grade true. |
| two-session-total | S: one-step sum | 10 visitors. Morning6/Afternoon4 are different visitors; no overlap ambiguity. |
| bar-attendance-difference | C: scale reading and directed comparison | 24 − 16 = 8 visitors. Ash12 is irrelevant; step4 and values retained. |
| combined-versus-single | C: combine categories before comparing | three-more: 15 + 12 − 24 = 3. Disjoint visitors explicit; all three statements reviewed. |
| target-shortfall | C: select category and solve missing amount against target | 15 tickets. Tuesday25 against40; other days are 10/20. |
| five-session-total | C: organize complete multi-category sum | 60 visitors. 8/14/16/12/10; distinct sessions avoid double counting. Core scope is sum organization, not the size of the answer. |
| largest-line-increase | X: compare consecutive changes, not maximum height | wed-thu. Changes +6, −2, +10; ordered daily domain explicit. |
| equal-line-increases | X: retain every qualifying consecutive difference | **mon-tue OR tue-wed**, both +5; wed-thu is −2. Thursday18 is valid between scale ticks; no requirement that observations be scale multiples. |
| line-total-target | X: distinguish daily/cumulative values and solve target | 60 − (10 + 15 + 20) = 15 tickets. Daily interpretation explicit; hints preserve the computation. |

Across the bank, worked support deliberately reveals and explains the solution
in its separate field. Hints are strategy prompts rather than answer statements.
There is no remaining accessible-text answer leak: source values/hand positions,
side arrangement and already-given shape names are legitimate givens. Narration
is allowed for these mathematical instructions; it does not assert reading skill.
All data units, ordered row labels, zero-origin/positive integer scales and
equal-spacing line domains agree with the source. Geometry boundaries have
valid connected edges and equal coordinate units. Coordinates are stimulus-only;
the evaluator consumes named choices and never computes a grade from a pointer.

## Retained first-pass executable evidence

Private evidence:
[runner](../../../artifacts/wp03-08a-20261011/independent-validation/check.mjs),
[loader](../../../artifacts/wp03-08a-20261011/independent-validation/ts-loader.mjs),
[final log](../../../artifacts/wp03-08a-20261011/independent-validation/run-02.log),
[structured exact inputs/results](../../../artifacts/wp03-08a-20261011/independent-validation/fresh-results.json).

From repository root:

```powershell
node artifacts/wp03-08a-20261011/independent-validation/check.mjs
node artifacts/wp03-08a-20261011/independent-validation/supplement.mjs
```

Direct Node v24.19.0 imported the candidate's actual TypeScript exports through
a private type-stripping loader. No dependencies were installed, no shared
node_modules/cache was written, and no app build or author test suite was run.
The loader only resolves extensionless local TS imports and strips types.

The first-pass fresh runner passed 14,471 bounded cases, including all 32 independently
specified accepted responses, a complete wrong/partial/invalid example for every
item, all 49 offered choices, all 54 complete sequence permutations and all
13,088 integer clock/quantity responses. It checked 605 reconstructed-content
mutations before grading, 30 harmless revision/control-order variants, malformed
response maps/roots, numeric bounds/units/denominators, all diagram topologies
and independently entered source datasets. Correct answers remain correct after
JSON reconstruction. Corrupt source/answer/representation/help/review/spec fields
yield unavailable-content, including when the submitted answer is partial.
Malformed learner values yield invalid-response; legitimate incomplete drafts
yield incomplete; valid complete mistakes yield judged false with only the
observed mismatch. The supplementary check retained 36 starter identities/nine
M1 rows and verified that the Q10 optional quantity revisit cannot supply its
required data completion.

The author reports 809 learning tests / 109 new tests and focused typechecking.
Those remain **author evidence**, not the basis or claimed fresh execution of
this review. Those executable checks did not settle F1's original authored demand;
the separate narrow semantic closure above does. The original runner and logs
are preserved against the first freeze and were not rerun against the new bank
with their intentionally obsolete triangle oracle.

## Binding and selection review

All seven proposals are nonempty, unique explicit canonical pools, M2, with
null sourceBindingId, the required skill/response and an appropriate mechanic.
Actual `resolveBindingIntent` then `selectNextActivity` were exercised, using
valid core evidence with two recently supported successes. The accepted policy
selected a support item within each binding and retained that binding's
provenance; this was not inferred from the presence of a support tag.

| Binding | Fresh-policy band | Support-policy selected task |
|---|---|---|
| q9-story-m08-clock | core | morning-hands |
| q9-story-m08-sequence | core | morning-event-order |
| q10-story-m10-data | core | joint-greatest-bar |
| q9-revisit-m08-quantity | core | same-hour-duration |
| q4-revisit-m09-choice | core | north-quarter-clockwise |
| q8-revisit-m09-choice | core | north-quarter-clockwise |
| q10-revisit-m10-quantity | core | two-session-total |

Q9's required set is clock then sequence. Actual required-set helpers keep it
incomplete after clock plus optional quantity and complete only after the
sequence ID is also present. Automatic Q9 resolution after clock selects the
sequence binding. Q10's data proposal has the correct required identity; WP03-13A
must place it between the separate M07 goods and E05 meaning beats. This family
does not contain or claim to prove those other producers' final combined set.
Optional pools do not become extra required beats or compulsory bank completion.

## Retained failed attempts and limits

Initial read-only discovery tried two incorrect handoff/test paths and a
PowerShell-style wildcard in an rg path argument; these were read failures and
exercised no candidate code. The actual manifest handoff path and policy exports
were then read directly.

The first fresh runner had twelve failed assertions: eight compared raw
LF/CRLF baseline bytes and four assumed the equal-unit declaration occupied the
first diagram label. Narrow inspection proved all eight source texts identical
after CRLF normalization and all four compasses declared equal units in their
second label. These are **validator harness defects**, not production failures.
[Original runner](../../../artifacts/wp03-08a-20261011/independent-validation/check-attempt-01.mjs),
[failed log](../../../artifacts/wp03-08a-20261011/independent-validation/run-01.log)
and [failed structured results](../../../artifacts/wp03-08a-20261011/independent-validation/fresh-results-attempt-01.json)
are preserved. Only these private assertions were corrected; the entire bounded
runner then passed. The Node experimental type-stripping warning is retained.

No source fixes, shared build, Git mutation, deployment, new worker or other-chat
message occurred. This validator wrote only this report and private evidence.
Rendering, actual pointer/keyboard/tap equivalence, state/save compatibility,
world assembly, published play and final listening remain downstream. F1 has now
been repaired by its original author and independently closed as recorded above.
The F1 recheck changed only this report; the later diagram recheck changed this
report and private evidence only. Controller acceptance/integration remain
pending, with no broader regression or acceptance claim made here.
