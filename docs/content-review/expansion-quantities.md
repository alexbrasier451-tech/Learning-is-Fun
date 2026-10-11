# Expansion quantities — WP03-07A author review

Reviewed by Codex, WP03-07A content author, 11 October 2026. This is an original
content and exact-answer author review. Independent acceptance is pending. It
is not qualified educator review, child testing, accessibility certification,
curriculum completeness or evidence of educational efficacy.

Thirty new canonical tasks assess M05/M06/M07: each has **3 support, 4 core,
3 stretch**. No starter task is counted or changed. Each task is counted once,
regardless of bindings or accepted rational variants. Review covers each full
record: prompt, givens, primary objective, source/year, demand, controls,
complete answer space, representation/text alternative, explanation, two hints
and separate worked support. `review.status: approved` means the author has
completed this review; Controller still requires independent acceptance before
assembly. Unreviewed mutations cannot be scored merely by copying that status.

## Source and objective mapping

Retain the official [DfE mathematics programme of study](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study)
evidence checked 8 October 2026 in [the frozen registry](registry.md). The
Year 3 and Year 4 Measurement notes were rechecked on 11 October 2026 for
independent finding F1: Year 3 records pounds/pence separately and introduces
decimal recording formally in Year 4; Year 4 connects place value and decimal
notation with money. Accordingly, `goods-price-pence` is introductory Year 4
Measurement, retaining its valid support band. See the official
[Year 3 notes](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-3-programme-of-study)
and [Year 4 notes](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-4-programme-of-study).
No new library, bank, copied exercise, runtime AI or expression parser is used.
The following tags expand to exact programme sections; each task also
stores the full URL, section and year itself.

| Tag | Exact programme section | Selected objective relation |
|---|---|---|
| 3F | Year 3, Number — fractions | Recognise/use fractions of discrete objects; recognise/represent fractions as numbers; equivalent fractions with small denominators. |
| 4F | Year 4, Number — fractions (including decimals) | Common equivalent fractions; fractions of quantities; add/subtract fractions with the same denominator. |
| 5F | Year 5, Number — fractions (including decimals and percentages) | Improper/mixed conversion; compare fractions whose denominators are multiples of one number. |
| 4D | Year 4, Number — fractions (including decimals) | Tenths/hundredths and decimal equivalents; quarters/decimals; compare to two places; round one decimal place to a whole. Patterns apply this place-value knowledge. |
| 5D | Year 5, Number — fractions (including decimals and percentages) | Round decimals with two places to the nearest whole and to one decimal place; this bank selects the latter. |
| 3M | Year 3, Measurement | Measure/compare/add/subtract lengths; mm/cm/m equivalence; pounds/pence in practical money contexts. |
| 4M | Year 4, Measurement | Convert units of measure and solve measure/money problems, including fractions/decimals; multistep variants increase reasoning rather than merely size. |

M05 has objective `M05-equivalence-quantity`; M06 has
`M06-decimal-place-value`; M07 has `M07-money-metric`. Cross-topic operations or
reading directions do not earn extra skill evidence. The frozen M03→M05 and
M06→M07 suggestions remain suggestions, without new locks. Introductory M06
support is explicitly Year 4 introductory representation, not a fabricated
Year 3 decimal objective. Stretch can be less-direct Year 4 reasoning; the
three selected Year 5 items are explicitly labelled.

## Independent solution and demand review

Keys below are exact `descriptor.authoredKey` values. Each descriptor also
records all numeric/unit/form givens in lowercase hyphenated parameters.
Family IDs are `math.expansion.m05`, `.m06`, `.m07`, equivalence `r1`.
The test file independently states these solutions and band/year assignments;
it never derives its oracle from the authored answer rule.

| Key | Band/source | Independent solution and assessed demand | Rejected complete example |
|---|---|---|---|
| shaded-half | support/3F | One of two equal parts: 1/2 whole. 2/4, 3/6, 4/8, 5/10, 6/12 also pass. Identify the unit whole. | 1/4 whole |
| shaded-quarters-form | support/3F | Two drawn quarter-parts: **2/4** whole. Name the actual partition; prompt explicitly requires denominator 4. | 1/2 or 4/8 (equal value, wrong form) |
| third-of-counters | support/3F | 12 ÷ 3 = **4 counters**. Explicit equal-share scaffold. | 3 counters |
| equivalent-sixths | core/4F | 2/3 × 2/2 = **4/6** whole. Coordinate scaling into the required sixths form. | 2/3 (wrong form), 2/6 |
| three-quarters-of-beads | core/4F | 20 ÷ 4 × 3 = **15 beads/count**. Non-unit fraction without a supplied share procedure. | 5 counters |
| add-eighths | core/4F | 3/8 + 2/8 = **5/8** whole. Combine like parts, same unit whole. | 5/4 whole |
| subtract-tenths | core/4F | 9/10 − 4/10 = **5/10 = 1/2** whole. Removal refers to full bottle, not fraction of contents. | 4/10 whole |
| reverse-three-fifths | stretch/4F | 12 ÷ 3 × 5 = **20 counters**. Recover an unknown whole from a non-unit part. | 4 counters |
| improper-mixed-quarters | stretch/5F | 7 quarters = **1 3/4**; `option-1`. Carry across equal wholes and retain mixed-number form. | `option-2` 7/4; `option-3` 7/8; `option-4` 2 3/4 |
| compare-thirds-sixths | stretch/5F | 2/3 = 4/6 < 5/6: **5/6 jar**, `option-2`. Common multiple partition. | 2/3 jar or equal |
| five-tenths-decimal | support/4D | **0.5**, `option-2`. Direct named tenths representation. | 0.05; 5.0 |
| seven-hundredths-decimal | support/4D | **0.07**, `option-3`. Empty tenths placeholder. | 0.7; 7.00 |
| match-decimal-parts | support/4D | Three tenths→**0.3** (`target-3`); three hundredths→**0.03** (`target-1`). Contrast identical digits in two places. | Swapped cards; 3.0 |
| compare-decimal-lengths | core/4D | 70 hundredths > 65: **0.7**, `option-1`. Unequal written decimal lengths. | 0.65; equal |
| quarter-decimal-equivalence | core/4D | 3 × 25 hundredths = **0.75**, `option-2`. Fraction/decimal equivalence. | 0.34; 0.25; 3.4 |
| round-decimal-whole | core/4D | 2.6 > midpoint 2.5: **3**, `option-2`. Round to a whole. | 2; 2.5 |
| extend-decimal-pattern | core/4D | Steps of 15 hundredths: 50 + 15 = **65/100** whole. Infer and extend. | 60/100 whole |
| missing-decimal-pattern | stretch/4D | 120 − 95 = 25; 95 − 25 = **70/100 = 7/10** whole. Infer step from later adjacent terms; reconstruct earlier term. | 95/100 whole |
| decimal-digit-constraints | stretch/4D | Whole digit must be 5; maximise tenths: **5.72**, `option-2`. Coordinate interval, unique digit use and place value. | 5.27 smaller; 7.52 outside interval; 5.77 repeats 7 and omits 2 |
| round-to-tenth | stretch/5D | 2.46 > midpoint 2.45: **2.5**, `option-2`. One-place rounding and written form. | 2.4; 2.50 (equal value, wrong form); 2.46 |
| path-metres | support/3M | 2 m + 3 m = **5 m**. Same-unit measured route with explicit edge givens. | 5 cm; 2 m |
| goods-price-pence | support/4M | £1.20→**120 p** (`target-3`); £0.75→**75 p** (`target-1`). Introductory Year 4 decimal-money notation, scaffolded by an explicit 100 p/£ fact and direct matching. | 102 p; swapped prices |
| millimetres-to-centimetres | support/3M | 30 mm ÷ 10 = **3 cm**. Conversion factor supplied; group into requested units. | 30 mm (equal measure, wrong requested unit); 30 cm |
| path-mixed-lengths | core/4M | 2 m = 200 cm; +75 = **275 cm**. Convert before measured route total. | 275 m; 77 cm |
| goods-change-pence | core/4M | Ribbon: 200 − 125 = **75 p** (`target-3`); label: 100 − 40 = **60 p** (`target-1`). Two independent changes. | 125 p; swapped changes |
| money-change-quantity | core/4M | 200 − 120 = **80 p**. Decimal price interpreted in integer pence. | 120 p; 80 GBP |
| capacity-total | core/4M | 1000 + 250 = **1250 ml**. Normalise paired capacity units. | 1250 l; 251 ml |
| path-remaining-length | stretch/4M | 300 + 50 − 175 = **175 cm**. Convert, total, then remove distance already travelled. | 350 cm full route; 175 m |
| goods-basket-change | stretch/4M | A cost 2×120+35=275; change **225 p** (`target-2`). B cost 3×75+120=345; change **155 p** (`target-3`). Repeated items + extra item + change. | Cost cards 275/345 p; swapped changes |
| mass-after-sharing | stretch/4M | 2000 − 750 − 3×250 = **500 g**. Convert, account for distinct and repeated removals. | 1250 g intermediate remainder; 500 kg |

All matching tasks have two items, three targets (four for basket-change),
unique-target controls and exactly one correct complete mapping. Every permitted
mapping is checked; repeated targets are structurally invalid. All choices
have three or four options and exactly one correct option. Labels that name
equal values occur only when the prompt deliberately assesses their written
form (7/4 versus mixed number; 2.5 versus 2.50).

## Exact domains and equivalence policy

The bank is the finite checked-in list, not a rule for generating more tuples.
All source numeric parameters are nonnegative safe integers ≤10,000. Source
fractions use the permitted denominators 2/3/4/5/6/8/10/12; integer counts use
denominator 1. Decimal source values are stored as integer hundredths, money
as integer pence, and metric source values as explicit units. Conversions are
declared 10 mm/cm, 100 cm/m, 1000 g/kg or 1000 ml/l. All authored subtractions
are nonnegative; all discrete counts are whole and reachable. The unreviewed
10/3-counter variant and zero-denominator variant are unavailable content.

| Quantity keys | Numerator range inclusive | Allowed denominators | Allowed units; policy |
|---|---|---|---|
| shaded-half, shaded-quarters-form, equivalent-sixths, add-eighths, subtract-tenths | 0–24 | 1,2,3,4,5,6,8,10,12 | whole; equivalent except the two explicitly required forms |
| third-of-counters | 0–12 | 1 | count; exact whole count |
| three-quarters-of-beads | 0–20 | 1 | count; exact whole count |
| reverse-three-fifths | 0–30 | 1 | count; exact whole count |
| extend-decimal-pattern, missing-decimal-pattern | 0–150 | 1,10,100 | whole; exact rational equivalence within available forms |
| path-metres | 0–10 | 1 | m, cm; **m required** |
| millimetres-to-centimetres | 0–40 | 1 | cm, mm; **cm required** |
| path-mixed-lengths, path-remaining-length | 0–400 | 1 | cm, m; **cm required** |
| money-change-quantity | 0–200 | 1 | p, GBP; **p required** |
| capacity-total | 0–2000 | 1 | ml, l; **ml required** |
| mass-after-sharing | 0–2500 | 1 | g, kg; **g required** |

Equivalent slots compare integer cross-products with safe-integer guards, never
floating-point quotients. Unit strings must agree; conversion to an unrequested
unit is not silently credited. Deliberately offered wrong units are complete
wrong answers; undeclared units are invalid input. An allowed denominator with
the wrong required form is likewise judged wrong, not normalised away. Zero is
a real complete input, not a missing value. Slot maxima give conservative
cross-product bounds ≤250,000. Equivalent answers outside the declared control
domain are invalid, not additional reachable answers.

`validateQuantityTask` requires canonical membership and agreement with every
reviewed field, including help/review/source/stimulus/answers. Frozen exports
have a reference fast path; reconstructed tasks undergo full comparison.
Harmless card order, object insertion order and positive contentRevision changes
are accepted without changing identity. Source tuple, label, unit, form or help
changes require author review. Finite structural comparison rejects NaN,
infinity, undefined, malformed shapes and non-JSON keys rather than allowing
JSON serialization to equate those values with null.

## Representation and help review

Six tasks have stimuli. `shaded-half` is (shaded=1, denominator=2, wholes=1);
`shaded-quarters-form` is (2,4,1); `improper-mixed-quarters` is (7,4,2).
Their text alternatives give whole count, per-whole partition and shaded-part
count, preserving the same unsimplified picture across equal wholes. They do
not state the requested fraction or mixed number. Two wholes do not change
each whole's denominator to eight.

The three path stimuli use Gate→Well→Garden with edge labels respectively
`2 m; 3 m`, `2 m; 75 cm`, and `3 m; 50 cm`. Alternatives state those edges and
the route, explicitly not to scale, without calculating a total or remainder.
The remaining-distance prompt supplies 175 cm already travelled separately.
Identical decorative coordinates cannot determine length and are never scored.
All other stimuli are null; full givens are in assessedText or response labels.

Every row has two distinct non-answer hints. The first directs attention to a
given, unit, place or required relation; the second suggests a method without
computing the requested result. Both hints were read alongside each prompt and
correct/distractor space. Explicit operation help is intentional assistance,
not an independent attempt. A separate worked support text actually performs
the arithmetic/form reasoning and gives the answer. Explanations use the same
checked solution. The table above covers one complete source/answer/demand
exemplar per band per skill, and all remaining records as well.

Choice/matching target IDs are semantic, not DOM order or displayed text.
Quantity responses are bounded numerator/denominator/unit values. Listening
permission is true for these maths prompts; neutral instruction narration is
separate. Downstream sticky hint/worked-support and listening-supported evidence
must come from WP04, not this evaluator. Feedback only reports the observed
entry and a mismatch in quantity/form/unit; it makes no diagnosis of a child.

## Binding and downstream handoff

`QUANTITY_BINDING_PROPOSALS` contains exact task IDs, response and mechanic for
the three required story pools, in prescribed order:

| Binding | Exact authored-key pool |
|---|---|
| q5-story-m05-quantity | shaded-half; shaded-quarters-form; third-of-counters; equivalent-sixths; three-quarters-of-beads; add-eighths; subtract-tenths; reverse-three-fifths |
| q8-story-m07-path | path-metres; path-mixed-lengths; path-remaining-length |
| q10-story-m07-goods | goods-price-pence; goods-change-pence; goods-basket-change |

Each has a real support route. Q5/Q8 use quantity/object-manipulation and Q10
uses matching/matching. One correct selected task completes its binding; pools
are not compulsory sequences. All proposals are M2 with sourceBindingId null.
The six other proposals use the exact `q{number}-revisit-{skill}-{responseKind}`
convention, for Q1/M07 quantities; Q5/M05 choices; Q5/M06 choices, matching and
quantities; Q10/M07 quantities. They are optional, nonempty, response-homogeneous
and together give every authored record a route. No new quest, starter edit or
additional mandatory Q1–Q3 beat is introduced. Q8 path work remains its exact
required pool; no redundant optional path row is needed.

The frozen manifest supplies 120 correct/wrong/partial/invalid cases. Tests
add all legitimate rational alternatives, wrong-unit/form cases, malformed
content/responses and every finite response combination. See the
[candidate handoff](../work-package/execution/WP03-07A-HANDOFF.md) for actual
commands, retained failures and exact integration limits. WP03-13A owns shared
dispatch/catalogue/bindings. WP02 owns real controls and alternatives, WP04
save/retry/assistance, WP06 published play and final acceptance. No browser,
save/reload, acoustic or published-play pass is claimed here.
