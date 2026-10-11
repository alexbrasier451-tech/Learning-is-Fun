# WP03-08A content review

Author and item reviewer: Codex, 11 October 2026. `approved` means this recorded
author review; independent review and Controller acceptance are pending. No
qualified educator review, child testing, full-curriculum coverage or educational
efficacy is claimed. Original authored content; no imported question bank.

Base: `5a9f131e29f0c12717abbeb2f0e6a18fbeaf5f26`. Thirty canonical tasks, ten
each for M08, M09 and M10; each has 3 support, 4 core and 3 stretch. No starter
record contributes to these floors or changes identity. Source keys and givens
are fixed, meaningful educational tuples, not random variants. No runtime LLM,
expression parser, geometry engine, coordinate grading or renderer is added.

## Sources and primary objectives

The retained [registry](registry.md) and frozen `src/content/skills.ts` supply
the objective IDs and official source. The same primary
[DfE mathematics programme](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study)
was rechecked for the earlier shape-recognition attribution on 11 October 2026.
Every task retains its full URL, programme year and section. Codes below are
review navigation, not extra curriculum identities.

| Code | Programme section and selected demand |
|---|---|
| T3 | Year 3, Measurement: clock readings, periods and durations. |
| T4 | Year 4, Measurement: clock conversion and time calculations. |
| TT5 | Year 5, Statistics: interpreting timetables. |
| G2 | Year 2, Geometry — properties of shapes: sides and shape classification; earlier consolidation. |
| G3 | Year 3, Geometry — properties of shapes: angles, turns, perpendicular lines. |
| G4 | Year 4, Geometry — properties of shapes: classification and reflection symmetry in different orientations. |
| D3 | Year 3, Statistics: tables, scaled bars and one/two-step questions. |
| D4 | Year 4, Statistics: comparison, sum and difference questions. |
| D5 | Year 5, Statistics: problems using line graphs. |

Primary objectives remain `M08-clock-duration`, `M09-shape-symmetry-turn` and
`M10-tables-charts`. Reading instructions and doing contextual arithmetic do
not award other skills. The bands are authored demand judgments. In particular,
reversing/composing Year 3 turns supplies additional reasoning without claiming
a new Year 5 geometry topic. No speed requirement or uniform ability label is
attached. Five-category addition is organisational core demand; line-graph
stretch uses changes or a multi-step target, not merely larger values.

## Exact item review and independent oracle

Each row below was reviewed as a unit with its prompt, primary objective, band,
curriculum source, demand rationale, complete accepted and rejected responses,
both hints, worked support, stimulus and accessible source data. Tests contain
a separately entered literal answer/demand/rejection table for all thirty rows,
plus independent chart source data. The answer column is review evidence and
never part of a learner's source-data alternative. S/C/X mean support/core/stretch.

| Authored key | Skill/band; source | Assessed demand and source | Exact accepted answer; representative rejected answer | Representation and help review |
|---|---|---|---|---|
| morning-hands | M08 S; T3 | Minute hand at 6, hour hand halfway 9–10, morning | clock 570 (09:30); reject 1290 | Analogue, 12-hour, Day 0. Alternative gives hand positions and morning, not time. Hints separate hand roles/counting; worked support converts. |
| morning-event-order | M08 S; T3 | Same-day 08:00/09:00/10:00 events | breakfast,gates,bell; reject bell,breakfast,gates | Text-only labelled event tiles. Hints compare hours; support orders all three. |
| same-hour-duration | M08 S; T3 | 14:00–14:30 same day | 30 minutes; reject 14 | Digital 24-hour start plus explicit finish. Hints attend to same hour/minute interval. |
| afternoon-conversion | M08 C; T4 | 3:25 pm into 24-hour convention | clock 925 (15:25); reject 205 | Source 12-hour digital; response explicitly 24-hour. Hints inspect period/add twelve hours. |
| midnight-crossing | M08 C; T4 | 23:50 Day 0 to 00:10 Day 1 | 20 minutes; reject 1400 | Day labels in prompt/alternative. Hints split at midnight; worked 10+10. |
| mixed-period-order | M08 C; T4 | 06:45, noon, 1:15 pm, 18:00 | unlock,lunch,repair,close; reject repair first | Text tiles retain period conventions. Hints normalise notation then order periods. |
| elapsed-clock | M08 C; T4 | Start 09:45, duration 85 minutes | clock 670 (11:10); reject 630 | Digital 24-hour start. Hints split duration/carry hour; worked 1h25m. |
| latest-safe-service | M08 X; TT5 | Three services and a setup deadline | clock 550 (09:10); reject 575 | Three named timetable rows in source text. Hints derive deadline/filter; support excludes Reed's 10:05 arrival. |
| journey-with-wait | M08 X; TT5 | Four journey events, including waiting | 75 minutes; reject 60 | Four labelled times in source text. Hints choose overall interval/check parts; support 35+15+25. |
| two-day-event-order | M08 X; T4 | Day 0 late event before three Day 1 events | lock,inspect,restart,open; reject lock last | Four distinct labelled tiles. Hints sort by day then time. |
| triangle-boundary | M09 S; G2 | Name closed three-side boundary | triangle; reject quadrilateral | Diagram/alternative describe boundary, not name. Hints trace/count; support supplies classification. |
| north-quarter-clockwise | M09 S; G3 | North, one clockwise quarter turn | east; reject west | Labelled compass; alternative gives cardinal arrangement. Hints locate start/follow clockwise. |
| rectangle-right-angles | M09 S; G3 | Count horizontal/vertical corners | four; reject two | 6-by-3 boundary; alternative gives positions/lengths, not angles. Hints inspect each corner. |
| rectangle-symmetry | M09 C; G4 | Reflection symmetry of non-square rectangle | two; reject four | Same meaningful source, different assessed property/key. Hints test central/diagonal folds; support explains unequal sides. |
| triangle-side-angle-classification | M09 C; G4 | Classify the whole triangle by BOTH side equality and angle type | right-scalene; reject right-isosceles, acute-scalene and acute-isosceles | A(0,0), B(4,0), C(0,3); AB4/BC5/CA3 shown as edge labels and repeated in alternative. Hints inspect equality and corners separately without supplying either classification. |
| two-turn-map | M09 C; G3 | East, clockwise half, anticlockwise quarter | south; reject north | Compass. Hints retain intermediate orientation and turn direction; support East→West→South. |
| rotated-square-symmetry | M09 C; G4 | Reflection lines under changed orientation | four; reject two | Vertices top/right/bottom/left equidistant from centre. Hints consider vertex and midpoint folds. |
| reverse-turns | M09 X; G3 | Unknown start; clockwise quarter then half ends West | north; reject south | Compass. Hints reverse instruction order and turn direction; worked reverse path. |
| alternating-turn-pattern | M09 X; G3 | Repeat clockwise quarter/half for five turns | west; reject east | Compass plus explicit pattern text. Hints enumerate instructions/retain phase; support lists all orientations. |
| square-diagonal-pieces | M09 X; G4 | Cut square along AC, classify both pieces | right-isosceles; reject equilateral | Boundary labels and proposed cut in prompt/labels; alternative supplies sides/corners, not piece properties. Hints retain original sides/angles. |
| read-attendance-table | M10 S; D3 | Find Oak in 12/8/15 table | twelve; reject eight | Labelled table, visitors, scale 1. Hints locate row/read value. |
| joint-greatest-bar | M10 S; D3 | Greatest of Oak20/Elm10/Ash20 | oak OR ash; reject elm | Bars, visitors, scale 5. Prompt explicitly permits either tied venue. Hints compare endpoints/check tie. |
| two-session-total | M10 S; D3 | Different visitors in sessions 6 and 4 | 10 visitors; reject 2 | Table, visitors, scale 1. Hints combine/include once. |
| bar-attendance-difference | M10 C; D4 | Oak24 versus Elm16; Ash12 distractor | 8 visitors; reject 40 | Bars, visitors, scale 4. Hints read scale/find gap. |
| combined-versus-single | M10 C; D4 | Oak15+Elm12 versus Ash24 | three-more; reject three-fewer | Table, visitors, scale 3. Hints combine then compare. |
| target-shortfall | M10 C; D4 | Tuesday25 against target40, with other days | 15 tickets; reject 40 | Bars, tickets, scale 5. Hints choose category/find missing amount. |
| five-session-total | M10 C; D4 | Sum 8,14,16,12,10 disjoint sessions | 60 visitors; reject 50 | Table, visitors, scale 2. Hints include once/group terms. |
| largest-line-increase | M10 X; D5 | Consecutive values 8,14,12,22 | wed-thu; reject mon-tue | Ordered daily domain, visitors, scale 2. Hints compute changes/exclude falls. |
| equal-line-increases | M10 X; D5 | Consecutive values 10,15,20,18; seek +5 | mon-tue OR tue-wed; reject wed-thu | Ordered daily domain, visitors, scale 5. Source includes 18 between scale marks. Hints subtract/check every interval. |
| line-total-target | M10 X; D5 | Daily sales 10,15,20; four-day target60 | 15 tickets; reject 40 | Ordered daily domain, tickets, scale 5. Prompt distinguishes daily values from running total. Hints total then subtract. |

The rejection observations are respectively `clock-mismatch`, `order-mismatch`,
`choice-mismatch` or `quantity-mismatch`. They report submitted values, not a
diagnosed misconception. Expected wrong answers above are complete in-domain
answers; malformed or incomplete controls are not judged failures.

## Representation and domain decisions

Clock responses are integer minutes from midnight, 0–1439. They are independent
of source-clock minutes. Every source clock specifies face, display and Day 0;
the midnight task explicitly supplies its finish on Day 1 in prompt and
alternative. There is no timezone, DST, week or calendar policy. Duration slots
use integer minutes 0–1440 with denominator 1. Exact quantities use the declared
visitors/tickets unit and 0–600 bounds. Fractional quantities, a different unit,
non-finite values and out-of-range integers are invalid controls, not wrong work.
No 12-hour response ambiguity remains: the instruction fixes a 24-hour answer.

Timetable rows have meaningful service/event labels and at most four rows;
they are text-only rather than squeezing minutes into a chart's 0–100 domain.
Source tables are authored explicitly in the prompt. Sequences have three or
four distinct event IDs and require all of them; initial presentation order is
not identity or grading. Repeated/unknown IDs are invalid; partial known sets
are incomplete; complete wrong permutations are judged.

All geometry uses equal horizontal/vertical coordinate units. Closed shapes
have a single connected boundary with named vertices and explicit edge IDs;
the compass is an open four-spoke diagram. Coordinates describe source geometry
only. Fixed choice IDs carry named shape, turn or property answers. The diagonal
cut is a proposed operation stated in prompt and labels, not an extra closed
boundary edge. Diagram alternatives describe positions, side lengths and source
arrangements, without supplying the requested shape classification or symmetry
count. Shape-name givens in prompts are legitimate when a different property is
being assessed. Decorative layout changes cannot create new canonical IDs;
unreviewed geometry changes are rejected rather than silently recomputed.

Every chart/table retains ordered row IDs, names, integer values 0–100, x/y
labels, units and a positive integer scaleStep. Bar/line scale starts at zero;
line days are equally spaced in authored order. A source value need not lie on
a scale tick (18 with step 5 is intentional). Text alternatives repeat every
label and source value, unit and scale, but no computed comparison, aggregate,
change or missing value. Rendering must preserve this data and equal geometry
scale. This author review does not establish integrated accessibility.

All records have two separate strategy hints and a distinct worked-support
field. Hints direct attention/strategy without stating the selected option,
computed time, total, order or symmetry count. Worked support deliberately
contains the solution and must retain the assistance flag downstream. Prompts
are maths instructions/source information; narration is allowed before Check
and does not pretend to assess independent reading.

## Validation and evidence

`validateTimeSpaceDataTask` checks finite membership and agreement of all
reviewed fields, canonical identity and representation. Deeply frozen exported
records are trusted only because this complete inventory is tested/reviewed;
reconstructed content traverses comparison. Object key order, option/tile
presentation order and a positive content revision do not change meaning.
The finite structural comparison rejects NaN, Infinity and undefined before
JSON can erase them to null. An unknown tuple, missing source, changed answer,
broken edge, invalid scale or altered source data becomes unavailable-content.

The independent test table covers all thirty tasks, both extra legitimate
alternatives, every clock minute, control endpoints, malformed/partial inputs,
actual source labels/values/scales, diagram closure, equal-unit semantics,
identity/presentation equivalence and each proposed binding. The manifest has
122 cases: 32 correct responses (including alternatives), 30 complete wrong,
30 partial and 30 invalid. Manifest fixtures are handoff samples; the independent
test oracle is not generated from them.

Direct Node checks run in the private candidate with one worker at a time,
cache disabled and no build or shared dependency writes. The retained command
logs and final result are listed in the [handoff](../work-package/execution/WP03-08A-HANDOFF.md).
Independent review F1 rejected the original `triangle-perpendicular` core
demand despite correct runtime answers. The initial Vitest config
path and TypeScript config invocation failed before exercising content; the
first compiling run exposed an explicit union-narrowing requirement. That
compile-only repair changed no grading semantics. All attempts remain recorded.

### F1 content repair and re-review

The original tuple only identified a directly represented perpendicular pair,
a Year 3 demand. Its Year 4 classification attribution and its contribution to
the fourth M09 core slot were unsupported. The frozen independent rejection
and all five original files are preserved in
`artifacts/wp03-08a-20261011/f1-repair`, including `owned-files-before.json`.
The original report in main remains unchanged. Earlier claims that all four
M09 core demands had been justified are superseded by this finding.

The replacement `triangle-side-angle-classification` asks for a classification
of the whole triangle on **two dimensions**: side equality and angle type. The
source is the Year 4 Geometry — properties of shapes objective for classifying
shapes by their properties and sizes. The three exact side lengths 3, 4 and 5
establish no equal sides; the horizontal and vertical sides meet at A. The
correct combined description is right-angled and scalene. `right-isosceles`
matches only the angle property, `acute-scalene` matches only side equality,
and `acute-isosceles` matches neither. Each of the four descriptions explains
its vocabulary; no terminology inference is required outside the offered
controls. This makes classification, rather than one named perpendicular
pair, the assessed action. The stretch diagonal-cut item still adds an extra
transformation/inference step beyond these given whole-shape properties.

The prompt explicitly requires both checks. Each side length is rendered as
an edge label and repeated in the accessible alternative. The alternative
states source positions/lengths and equal coordinate units; it does not name
scalene, right-angled or any requested classification. Hint 1 prompts an equality
check; hint 2 prompts corner comparison and combining the two checks. Neither
supplies the classification. Separate worked support explains both properties
and why the alternatives fail. The answer is literal reviewed content, never
calculated from pointer or stimulus coordinates during grading.

This is an unpublished substantive replacement, with a new authored key and
meaningful source string in its r1 descriptor. The old tuple is not selectable
and evaluates as unavailable-content. Manifest cases and both M09 revisit
pools follow the new ID automatically from the reviewed task array; the original
ID remains only in failed evidence/regression checks. All shipped starter IDs,
other 29 tasks and both legitimate M10 alternative sets are preserved. The
bank remains exactly 30 tasks with 4 core/3 support/3 stretch per skill.

Fresh F1 verification repeats the original frozen task/response route, verifies
its rejection by the replacement bank, and evaluates every replacement option
through the actual exports. The complete learning suite and focused TypeScript
check are rerun; independent semantic recheck remains pending.

## Binding and downstream limits

`TIME_SPACE_DATA_BINDING_PROPOSALS` supplies exact, nonempty task ID lists.
Required story rows are `q9-story-m08-clock`, `q9-story-m08-sequence` and
`q10-story-m10-data`; each has a support route. Optional rows are only
`q9-revisit-m08-quantity`, `q4-revisit-m09-choice`, `q8-revisit-m09-choice` and
`q10-revisit-m10-quantity`. Each references one response kind, uses M2
availability and null sourceBindingId. One selected correct task completes a
story binding; none of these pools requires all tasks. Existing M1 rows and
starter IDs are untouched.

WP03-13A owns catalogue, dispatch and final bindings; WP02 owns actual controls,
equal-scale rendering and keyboard/tap accessibility; WP04 owns atomic commit,
saved identity/assistance and learning observations; WP06 owns published play.
There is no integration, deployment or complete-game acceptance claim here.
