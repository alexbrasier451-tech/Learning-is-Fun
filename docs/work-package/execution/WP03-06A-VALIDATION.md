# WP03-06A independent validation

Independent reviewer: Codex, Sol/xhigh domain review, 11 October 2026.

**Verdict: CHANGES REQUIRED — one P2 validator finding.** All forty supplied
task meanings, independently calculated answers, band floors, help and proposed
bindings pass this bounded review. The reconstructed-content gate accepts a
malformed non-finite stimulus as the expected null and consequently scores it.
Controller should route that causal repair to the original author, then request
a focused independent recheck. This report does not grant lane acceptance.

## Candidate and authority

Reviewed frozen candidate:
`C:/Users/alexb/AppData/Local/Temp/lif-m2-arithmetic-01a12b4c`, supplied base
`6b5834953b56b4f2ce33c099700b1090805b6144`.

Read the candidate handoff, WP03-06A chunk, accepted learning and starter
contracts, receiving WP03-13A binding contract and the exact five-file patch:

- `src/content/expansion-maths/arithmetic.ts`
- `src/learning/evaluators/expansion-arithmetic.ts`
- `tests/learning/expansion-arithmetic.test.ts`
- `docs/content-review/expansion-arithmetic.md`
- `docs/work-package/execution/WP03-06A-HANDOFF.md`

Current human continuation authority is
[CONTINUATION-AND-MUSIC-VARIATION](CONTINUATION-AND-MUSIC-VARIATION.md).
Detailed acoustic acceptance is deferred to final release; this arithmetic
review makes no acoustic or published-play acceptance claim.

Report-only ownership was respected. Only this main-checkout report and the
reviewer's private evidence were written. No production fixes, shared build,
configuration, dependency/cache/ledger writes, Git commands, commits, deployment,
workers or messages to other chats were performed by this validator. Controller
retains repair routing, integration and administrative acceptance.

## Actionable finding

### P2 — reject non-finite content before JSON equality can erase its type

Location: candidate
[expansion-arithmetic.ts, line 14](C:/Users/alexb/AppData/Local/Temp/lif-m2-arithmetic-01a12b4c/src/learning/evaluators/expansion-arithmetic.ts:14).
The field-comparison call at line 47 and evaluator gate at lines 89–90 propagate
the result. `TaskDefinition.stimulus` is an optional `TaskStimulus | null`
(accepted contracts, line 108), so these numeric values are malformed content.

`stable()` returns `JSON.stringify(value)` for primitive values. JavaScript
serializes `NaN`, `Infinity` and `-Infinity` as the string `"null"`. For a text
task whose reviewed stimulus is null, the full reconstructed-record comparison
therefore reports equality and `validateArithmeticTask()` returns no issues.
The evaluator then returns a scored correct judgement for the correct response.
This contradicts the chunk's unavailable-content boundary and the handoff's
claim that reconstructed/untrusted content undergoes full consistency checking.

Minimal reproduction using the actual candidate exports:

```ts
const task = {
  ...ARITHMETIC_TASKS[0],
  stimulus: NaN,
} as unknown as TaskDefinition;
const response = {
  kind: 'quantity',
  values: { answer: { numerator: 43, denominator: 1, unit: 'count' } },
};

validateArithmeticTask(task);                 // actual: []
evaluateExpansionArithmetic(task, response); // actual: judged, correct: true
```

The same actual results were reproduced separately for positive and negative
infinity. Expected for each: at least one content issue and
`status: 'unavailable-content'` before response grading. The private log retains
the complete actual result, including the unchanged canonical question ID.

The earliest defect is the content comparison's lossy primitive serialization.
The original author should reject non-finite/undeclared content values before
they can compare equal to null, preserving legitimate object and option-order
equivalence. Add focused counterexamples and rerun each original mutated
task through `validateArithmeticTask` and `evaluateExpansionArithmetic` with
the original correct response. The unmodified task must still validate and
score correctly. No downstream renderer/state compensation is called for.

Impact is bounded: the forty frozen, deeply frozen exported records are valid;
this finding concerns the separately advertised reconstructed/untrusted-record
path. No save, reward or browser failure was inferred or demonstrated.

## Forty-item domain and demand review

All forty records were read for the requested quantity/relationship, full
meaningful givens, assessed objective, representation, source section, actual
demand, accepted controls, explanations, two hints and separate worked support.
The following answers were calculated from the questions and entered literally
in the private oracle, without using the candidate answer rule, producer solver,
manifest answers or worked support as the answer oracle. Row numbers refer only
to the frozen export order and are not identities.

| Row | Skill / band | Independent meaning and answer | Demand judgement |
|---|---|---|---|
| 1 | M01 support | 28 + 15 = **43** | Direct earlier combination. |
| 2 | M01 support | 60 − 24 = **36** | Direct removal with an inverse check. |
| 3 | M01 support | 80 − 37 = **43** | One explicitly missing addend. |
| 4 | M01 core | 2687 + 1756 = **4443** | Four-digit place-value exchange. |
| 5 | M01 core | 5000 − 2678 = **2322** | Regrouping through zero places. |
| 6 | M01 core | 7000 − 3846 = **3154** | Inverse calculation of a four-digit gap. |
| 7 | M01 core | 1240 + 875 − 560 = **1555** | Form a combined store, then infer another store. |
| 8 | M01 stretch | 940 + 180 − 275 = **845** | Undo changes in reverse order. |
| 9 | M01 stretch | 1420 + 785 − 1350 = **855** | Reconstruct a missing intermediate delivery. |
| 10 | M01 stretch | 3000 + 1940 − 2200 − 875 = **1865** | Selected multi-step missing contribution. |
| 11 | M02 support | Displayed 2 groups of 5 → **2 × 5 or 5 × 2** | Represented group-expression recognition. |
| 12 | M02 support | 3 × 4 = **12** | Derive a represented total. |
| 13 | M02 support | 4 × 8 = **32** | Derive a represented total from known groups. |
| 14 | M02 core | 6 × 7 = **42**, 8 × 9 = **72**, 12 × 11 = **132** | Three distinct fact matches with equivalent first cards. |
| 15 | M02 core | 9 × 6 = **54**, 7 × 8 = **56**, 12 × 4 = **48** | A different three-fact network. |
| 16 | M02 core | 11 × 8 = **88**, 12 × 12 = **144**, 7 × 7 = **49** | Square facts and the 12 × 12 boundary. |
| 17 | M02 core | 28, 35, 42, next **49** | Continue an equal-group increment. |
| 18 | M02 stretch | Missing factor in 8 × ? = 96 is **12** | Infer an absent group dimension. |
| 19 | M02 stretch | Left: 6 × 8, 8 × 6, (5 × 8) + 8 = **48**; right: 7 × 9, 9 × 7, (6 × 9) + 9 = **63** | Commutative and distributive equivalence across six expressions. |
| 20 | M02 stretch | 27, ?, 45, 54, 63 → **36** | Infer a later step and reconstruct an earlier missing term. |
| 21 | M03 support | 1 × 12 counters shared among 2 new trays → **6** | Redistribute source counters into new shares. |
| 22 | M03 support | 1 × 12 shared among 3 new trays → **4** | Another exact represented redistribution. |
| 23 | M03 support | 2 × 10 shared among 5 new trays → **4** | Count the source groups, then share into a different grouping. |
| 24 | M03 core | 84 ÷ 7 = **12** | Exact inverse fact with distinct divisor/quotient roles. |
| 25 | M03 core | 132 ÷ 12 = **11** | Exact inverse fact at the divisor boundary. |
| 26 | M03 core | 8 × 9 = 72 → 72 ÷ 8 = **9**, 72 ÷ 9 = **8** | Match both inverse divisions. |
| 27 | M03 core | 7 × 12 = 84 → 84 ÷ 7 = **12**, 84 ÷ 12 = **7** | Match another inverse pair. |
| 28 | M03 stretch | (6 × 8) ÷ 12 = **4** | Form the original dividend before regrouping. |
| 29 | M03 stretch | (96 − 24) ÷ 9 = **8** | Remove the excluded counters before sharing. |
| 30 | M03 stretch | (35 + 49) ÷ 7 = **12** | Combine two sources before sharing. |
| 31 | M04 support | 4 × 2 = **8** | Visible base and explicit scaling. |
| 32 | M04 support | 5 × 3 = **15** | Another represented scale. |
| 33 | M04 support | 6 × 4 = **24** | Represented repeated copies. |
| 34 | M04 core | Large 8 × 3 = **24**; combined 8 + 24 = **32** | Scale, then include the original base. |
| 35 | M04 core | Large 24 × 2 = **48**; combined 24 + 48 = **72** | Same two-count demand with an independent meaningful base. |
| 36 | M04 core | 48 ÷ 4 = **12** | Undo scaling. |
| 37 | M04 core | 17 × 3 + 5 = **56** | Scale the base and add the unscaled extra once. |
| 38 | M04 stretch | 60 comprises five small parts → small **12**, large **48** | Reconstruct two values from multiplier and total. |
| 39 | M04 stretch | Difference 18 comprises two small parts → small **9**, large **27** | Reconstruct from the excess, then check both constraints. |
| 40 | M04 stretch | Original total 29 + 7 = 36 → small **12**, large **24** | Restore the total before reconstructing both original counts. |

Each skill has exactly **4 core / 3 support / 3 stretch**, and all forty
canonical meanings are distinct. The 24 retained M1 references do not count
toward these floors. Band judgements follow representation and reasoning:
support provides direct or represented entry, core supplies selected facts or
multi-step calculation, and stretch uses inverse/less-direct reconstruction or
additional constraints. A larger number alone is not the rationale. These are
reviewed demand distinctions, not empirical difficulty calibration.

The official [DfE mathematics programme](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study)
was independently checked on 11 October 2026. The selected Year 2 calculation,
group/array and inverse work; Year 3 facts and integer scaling; Year 4
four-digit calculation, facts, inverse division and scaling; and Year 5
multi-step addition/subtraction sections support the stated source links.
The last M01 item is selected Year 5 reasoning within the bounded bank, not
coverage of the whole Year 5 calculation range. Other stretch items use
additional reasoning within the cited earlier material. No formal ratio
algebra, curriculum-completeness or qualified educator/efficacy claim is made.

## Representation, help and repaired cases

Nine tasks contain actual arrays: rows 11–13, 21–23 and 31–33. Their groups,
items per group, labels and accessible descriptions match the meaningful
source givens. The remaining records use null stimulus. Captions describe
source grouping without supplying a requested product, new share or scaled
count. The forty hint pairs give attention/strategy without a computed answer;
the distinct worked-support entries explicitly reveal a valid solution and
remain separate from hints. Explanations describe actual arithmetic and
observed wrong counts/placements without diagnosing a learner.

The three repaired represented-share tasks pass. Their displayed source
groupings are respectively 1 × 12, 1 × 12 and 2 × 10; requested sharing is
among 2, 3 and 5 new trays. The quotient is neither the displayed source-group
size nor a literal answer in the captions/hints. The private check verifies
these exact source parameters and total = divisor × new share for all three.
This resolves the reported source-data answer leakage without weakening the
represented objective.

## Controls, identity, manifest and binding compatibility

The existing DTOs express all responses: 33 quantities (28 one-count and five
two-count), six matching tasks and one six-item sorting task. Counts use bounded
safe integers, denominator 1 and unit count. Zero remains a complete wrong
answer where appropriate. Missing/null required entries are incomplete; bad
values, extra/unknown fields, unknown endpoints and duplicate unique matching
targets are invalid before missing-field handling. All independent complete
wrong cases remain judged wrong. The finding above concerns malformed content,
not a demonstrated response-classification defect.

All four additional legitimate matching alternatives pass: the support array
accepts either factor order, and each three-fact match accepts its equivalent
first result card. Object/card order does not change meaning or acceptance.
Feedback for an otherwise wrong mapping with a valid equivalent first card
identifies only the two wrong placements. Sorting correctly separates the
three expressions for 48 from the three for 63.

Identity uses the four `math.expansion.m01`–`.m04` families, r1 equivalence,
null authored key and the full operation/givens through the accepted canonical
encoder. Seeds, skins, answer values, weeks and presentation order do not
manufacture identities. All forty IDs reconstruct and are disjoint from the
24 retained starter IDs. Starter bridge/merchant controls and anchor
alternatives are retained. Finite manifest domains, correct/alternative/wrong/
partial/invalid examples and frozen record membership fit the receiving
interfaces; unreviewed/zero-divisor/non-exact tuples are rejected by the focused
candidate tests. Content revision remains separate from equivalence.

The eleven explicit proposals use existing Q1/Q3/Q4/Q9 response contracts and
nonempty pools. The only required proposal is **`q4-story-m02-match`**, with the
represented support row 11 and core rows 14–16. The private check resolves it
through the actual binding resolver and verifies support selection after two
valid hinted core observations produce a struggling M02 history. A fresh
history can select core under the accepted policy; support accessibility does
not mean every fresh selection must choose support. One selected correct task
can satisfy the binding; the pool does not require all tasks to be completed.

The remaining proposals follow the accepted
`q{number}-revisit-{skill}-{responseKind}` convention. M02 has independent Q3
equal-group assessment, M03 has exact Q4 division/inverse work, M01 has separate
Q9 missing totals and M04 has Q3 scaling. Contextual M02/E08 references in M04
do not award independent assessment credit. No required extra Q1–Q3 activity,
new quest, subject lock, full-bank completion or harder-band reward is added.

## Verification evidence and exact limits

Private evidence root:
`C:/Users/alexb/.codex/visualizations/2026/10/08/01a11daf-7049-7a81-b793-57ed7dc35964/WP03-06A-private`.

| Evidence | Fresh independent result |
|---|---|
| `independent-oracle.cjs` / `independent-oracle.log` | **45 check groups passed, one failed**, process exit 1. Forty row groups each exercise independent correct, complete wrong, partial and invalid responses; remaining passing groups cover floors/identity, equivalent answers/order/feedback, repaired shares, actual Q4 support selection and malformed-response precedence. One failing group retains all three non-finite content observations. |
| `vitest.config.mjs` / `focused-vitest.log` | **Eight tests passed, three exhaustive loops skipped**, process exit 0. Native-loaded private config, one worker, private cache path with cache/module-cache disabled. |
| `strict-typescript.log` | Candidate's focused strict no-emit TypeScript command independently passed, exit 0. No project config/build/buildinfo output. |
| `reviewed-files.json` | All five independently measured lengths and SHA-256 hashes match the candidate's frozen inventory. |

The private oracle loads actual candidate TypeScript modules in memory using
Node's type stripping and VM modules. It imports actual binding selection and
evidence functions for the support-route test; it is not a substitute
implementation of the evaluator. Experimental Node feature warnings are
retained and do not change the assertions. The reviewer made no production
repair or in-memory candidate repair; the red content counterexample remains
red for author handoff.

Reused, clearly distinguished author evidence: final **100 tests / three
files** (11 arithmetic, 70 starter maths, 19 identity), **129,220** finite family
responses (71,444 single counts, 57,509 two-count combinations, 203 matching maps
and 64 sorting maps), and **164** manifest cases. These reported exhaustive
loops were inspected but not rerun independently; the bounded reviewer checks
and item-by-item content review supply independent evidence. The supplied
base-comparison log reports all 644 original files matching the frozen base,
using text EOL normalization and raw bytes for the four licensed `-text` files.
That base comparison is reused author evidence, not an independent Git audit.

Independent candidate inventory:

| Path | Bytes | Lowercase SHA-256 |
|---|---:|---|
| `src/content/expansion-maths/arithmetic.ts` | 33536 | `589c57c0a02969bace3c6713bfbc635616a2ae26cc7797a17816943f77f60dea` |
| `src/learning/evaluators/expansion-arithmetic.ts` | 9072 | `ec2e3982185e289cffc15f0c3bc930abb7d08360ec9777ef394f46aabcff1916` |
| `tests/learning/expansion-arithmetic.test.ts` | 20330 | `e8f4a826dd438f1d80b7cd239ba7632d55ae5704d3410b175246bf9943c6d6d9` |
| `docs/content-review/expansion-arithmetic.md` | 17411 | `358cf137b494c4fc488ce380c0eef64f8ffa1d4c86b998291e2699e5a7fb677c` |
| `docs/work-package/execution/WP03-06A-HANDOFF.md` | 9180 | `dab657243cbcc33babbb00cccd41ef836d25b3beff884202bdd7cedddd805cee` |

This is a bounded producer/domain review. Actual widget rendering and
accessibility, aggregate runtime dispatch, committed Check/help/evidence/
reward/save/reload, full M2 composition, published play and final listening
remain downstream. No broad game build, shared test run or additional audit
was performed. Original-author repair and the focused original-case recheck
are required before Controller can accept this lane.
