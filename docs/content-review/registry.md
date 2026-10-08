# Selected curriculum registry — WP03-01A

Author/contract reviewer: Codex, WP03-01A implementation worker, 8 October 2026.
This is a selected-scope mapping and contract review, not human curriculum
approval, item review or evidence of educational efficacy. Task fixtures are
withheld construction examples; no reviewed question bank is delivered here.

Retained accepted sources (package research checked 8 October 2026):
[DfE mathematics programme](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study)
and [DfE English programme](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study).
The source URLs, programme sections and demand rationales are recorded per row
in `src/content/skills.ts`. No new source research or copied content was used.

Year 4 is the planning centre with Year 3 support and selected Year 5 maths
stretch. English uses official Years 3–4 and Years 5–6 bands; earlier word-class
and end-punctuation consolidation is explicitly labelled. These topic mappings
do not establish that an individual item assesses a statutory objective.
Content authors must provide its primary objective, exact source section,
demand rationale and approved prompt/answer/feedback/support review.

The retained DfE source was rechecked after independent review: its Year 5
Statistics section covers tables including timetables. M08's selected timetable
stretch is attributed there; its Years 3–4 clock/duration reference remains
Measurement. This corrects source attribution without changing skill scope.

| Skill | Objective ID | Selected scope | Staging |
|---|---|---|---|
| M01 | M01-addition-subtraction | Missing totals, addition/subtraction; Y3–4 | M1 |
| M02 | M02-multiplication-groups | Facts/equal groups; Y3–4 | M2 |
| M03 | M03-exact-division | Exact division/inverse facts; Y3–4 | M2 |
| M04 | M04-integer-scaling | Scaling/two constraints; Y3–4 problem solving | M1 |
| M05 | M05-equivalence-quantity | Fractions/equivalence; Y3–4, selected Y5 | M2 |
| M06 | M06-decimal-place-value | Decimals; Y4, selected Y5 | M2 |
| M07 | M07-money-metric | Money/change/metric quantities; Y3–4 | M2 |
| M08 | M08-clock-duration | Measurement: time, Y3–4; Statistics: tables including timetables, selected Y5 | M2 |
| M09 | M09-shape-symmetry-turn | Shape/symmetry/turns; Y3–4 | M2 |
| M10 | M10-tables-charts | Data/comparison; Y3–4, selected Y5 line graph | M2 |
| E01 | E01-spelling-affixes | Spelling/affixes; Years 3–4 | M2 |
| E02 | E02-homophones | Homophones in context; Years 3–4 | M2 |
| E03 | E03-contextual-vocabulary | Meaning/synonyms/opposites; Years 3–4 | M2 |
| E04 | E04-word-classes | Earlier grammar consolidated in Years 3–4 | M2 |
| E05 | E05-clauses-conjunctions | Clauses/conjunctions; Years 3–4 | M2 |
| E06 | E06-punctuation | Earlier endings into Years 3–4 commas/apostrophes | M1 |
| E07 | E07-direct-speech | Direct speech; Years 3–4 | M2 |
| E08 | E08-retrieval-instructions | Detail retrieval/instructions; Years 3–4 | M2 |
| E09 | E09-inference-prediction | Inference plus clue; Years 3–4, selected Years 5–6 text demand | M2 |
| E10 | E10-narrative-editing | Sequencing/editing; Years 3–4 bounded composition substitute | M2 |

All three difficulty bands are declared scope only. M1 delivery later supplies
M01/M04/E06 tasks; this chunk supplies none. Actual availability is the set of
bands in the approved delivered catalogue, never the registry's declaredBands.
The fixture SelectionRequest deliberately uses an empty catalogue despite the
complete registry. No selector or band availability runtime is implemented.

Eight directed suggestions are retained exactly: M02→M03/M04,
M03→quantity M05, M06→decimal money M07, E04→E05, E06→E07,
E08→E09/E10. Focused tests check known endpoints and acyclicity. These are
educational suggestions, never hard quest locks or diagnoses. Merchant M04
context does not award independent M02/E08 evidence; bridge metres do not
independently assess M07.

Canonical descriptors contain family ID, educational equivalence version,
authored key or complete meaningful integer/string parameters. Preserve them
alongside canonical IDs. Bridge `{target:12}`, merchant `{multiplier:2,pears:3}`
and punctuation authored key `spellbook-anchor` produce the three exact r1
anchor strings. Parameters are sorted by key during encoding; generated and
authored namespaces and JSON value types stay distinct. Starter families reject
extra parameters. Other families must review their complete meaningful tuple;
the identity utility cannot determine whether a source-data change is cosmetic.
Coordinates, seed, answer choice, layout, skin, contentRevision, session and week
are not new identity inputs. Substantive geometry/data changes must be represented
by reviewed source parameters/key; a new equivalence version requires substantive
review and old-receipt compatibility. No identifier allocation occurs here.

Assistance separates answer hints/worked support from assessed-text listening
and routine neutral narration. The DEC-025 observation union retains original
first-Check correctness and cumulative encounter Check index across episodes;
completion-only observations have no Check/submission fields. DEC-029 stimuli
retain exact source fields/live labels/accessibility descriptions. DEC-034
binding provenance and route intents are learning-owned definitions, imported
by downstream owners. Binding roles, permanent completion and runtime validation
remain with their assigned producers/consumers.

Retained reuse decisions: H5P/Perseus are unnecessary integration surfaces;
mathjs is unnecessary for bounded integer/rational/pence/date work. See the
accepted [WP03-01A specification](../work-package/chunks/WP03-01A.md) for the
already assessed source/licence links. No new library, bank or framework was
introduced. Product heuristics and curriculum links are not calibrated mastery
measures; there are no ability percentages or point fields in these DTOs.
