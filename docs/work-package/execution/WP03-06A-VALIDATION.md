# WP03-06A independent validation

Independent reviewer: Codex, Sol/xhigh domain review, 11 October 2026.

**Final verdict: PASS — the original P2 finding is closed.** All forty supplied
task meanings, independently calculated answers, band floors, help and proposed
bindings retain their passing review. The original author's finite-JSON repair
passes the narrow independent task→validator→evaluator recheck below, including
all three original counterexamples. No open finding remains in this bounded
producer/domain review. Controller retains administrative lane acceptance and
downstream integration acceptance.

## Candidate and authority

Reviewed frozen candidate:
`C:/Users/alexb/AppData/Local/Temp/lif-m2-arithmetic-01a12b4c`, supplied base
`6b5834953b56b4f2ce33c099700b1090805b6144`.

This final review identifies the repaired/refrozen candidate by the five exact
lengths and hashes at the end of this report. The arithmetic content module,
including all forty records, manifest and eleven binding proposals, is
byte-identical to the original reviewed candidate. The evaluator, regression
tests and two explanatory documents were updated for the P2 repair.

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

## Original finding and independent closure

### P2 — closed: reject non-finite content before JSON equality erases its type

Original location: `src/learning/evaluators/expansion-arithmetic.ts`, line 14
in the original candidate (SHA-256
`ec2e3982185e289cffc15f0c3bc930abb7d08360ec9777ef394f46aabcff1916`).
The original field-comparison call at line 47 and evaluator gate at lines
89–90 propagated the result. `TaskDefinition.stimulus` is an optional `TaskStimulus | null`
(accepted contracts, line 108), so these numeric values are malformed content.

Before repair, `stable()` returned `JSON.stringify(value)` for primitive values. JavaScript
serializes `NaN`, `Infinity` and `-Infinity` as the string `"null"`. For a text
task whose reviewed stimulus is null, the full reconstructed-record comparison
therefore reported equality and `validateArithmeticTask()` returned no issues.
The evaluator then returned a scored correct judgement for the correct response.
This contradicted the chunk's unavailable-content boundary and the handoff's
claim that reconstructed/untrusted content undergoes full consistency checking.

Original reproduction using the actual candidate exports, retained as red evidence:

```ts
const task = {
  ...ARITHMETIC_TASKS[0],
  stimulus: NaN,
} as unknown as TaskDefinition;
const response = {
  kind: 'quantity',
  values: { answer: { numerator: 43, denominator: 1, unit: 'count' } },
};

validateArithmeticTask(task);                 // before repair: []
evaluateExpansionArithmetic(task, response); // before repair: judged, correct: true
```

The same pre-repair results were reproduced separately for positive and negative
infinity. Required for each: at least one content issue and
`status: 'unavailable-content'` before response grading. The private log retains
the complete original result, including the unchanged canonical question ID.

The earliest defect was the content comparison's lossy primitive serialization.
The original author repaired that primitive boundary. The current
[finite-value guard, line 16](C:/Users/alexb/AppData/Local/Temp/lif-m2-arithmetic-01a12b4c/src/learning/evaluators/expansion-arithmetic.ts:16)
allows null, strings, booleans and finite numbers; undeclared/non-finite values
throw before serialization. Existing validator handling emits malformed-content
and the existing evaluator gate returns unavailable-content. Arrays and plain
records retain recursive comparison. No downstream compensation or response
grading change was introduced.

Impact is bounded: the forty frozen, deeply frozen exported records are valid;
this finding concerns the separately advertised reconstructed/untrusted-record
path. No save, reward or browser failure was inferred or demonstrated.

### Narrow recheck on the repaired candidate

All three original mutated copies of row 1, with the same correct 43-counter
response, were independently rerun through the complete actual validator and
evaluator path. Each now produces a `stimulus` issue with code
**`malformed-content`**, then **`unavailable-content`** with no `correct` field.
The original task's canonical ID remains unchanged. These original counterexamples
are green; the initial red evidence is retained rather than overwritten.

The private independent recheck also passes genuine reconstructed null/text,
array matching, represented division and represented scaling tasks. Related
checks cover undefined/function/symbol/bigint/boxed/custom-toJSON/invalid-Date
stimuli, finite wrong stimulus types, nested non-finite groups/items per group
and finite wrong dimensions. These fail content validation and cannot be scored.
Plain null-prototype records, reversed meaningful-object/card order, legitimate
equivalent matching responses and independent content revision remain valid.
Non-finite and undeclared response counts remain **invalid-response**; complete
zero remains judged wrong, and an empty draft remains incomplete.

Fresh evidence: **12 independent check groups passed**, **12 focused arithmetic
tests passed with three exhaustive loops skipped**, and strict no-emit TypeScript
passed; all three processes exited 0. Author evidence separately reports the
complete **104 tests / three files** (15 arithmetic, 70 starter maths, 19 identity),
129,220 exhaustive family responses and 164 manifest cases rerun green.

The exact evaluator/test delta was independently bounded without Git: removing
only the finite-primitive guard/comments from the current evaluator reconstructs
the original reviewed hash; removing only the four added regression cases from
the current tests reconstructs their original reviewed hash. The content-module
hash is unchanged. All five final hashes/lengths match the refreshed inventory.
The explanatory document updates record the repair and its evidence.

The earlier forty-item content review and 45 unaffected independent check groups
are retained. No broad reauthoring or audit was repeated. **P2 closed; bounded
review PASS.**

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
wrong cases remain judged wrong. The closed finding above concerned malformed content,
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

Original independent evidence retained:

| Evidence | Original independent result |
|---|---|
| `independent-oracle.cjs` / `independent-oracle.log` | **45 check groups passed, one failed**, process exit 1. Forty row groups each exercise independent correct, complete wrong, partial and invalid responses; remaining passing groups cover floors/identity, equivalent answers/order/feedback, repaired shares, actual Q4 support selection and malformed-response precedence. One failing group retains all three non-finite content observations. |
| `vitest.config.mjs` / `focused-vitest.log` | **Eight tests passed, three exhaustive loops skipped**, process exit 0. Native-loaded private config, one worker, private cache path with cache/module-cache disabled. |
| `strict-typescript.log` | Candidate's focused strict no-emit TypeScript command independently passed, exit 0. No project config/build/buildinfo output. |
| `reviewed-files.json` | All five original independently measured lengths and SHA-256 hashes match the pre-repair frozen inventory. Retained for before/after identification. |

Fresh independent evidence on the final repaired candidate:

| Evidence | Final independent result |
|---|---|
| `P2-recheck.cjs` / `P2-recheck.log` | **12 groups passed**, exit 0: the three original full-path cases, legitimate reconstructed records, related finite-JSON/type and response variants, exact evaluator/test delta and all five final hashes/lengths. The log retains exact issue/status results and final inventory. |
| `P2-focused-vitest.log` | **12 tests passed, three exhaustive loops skipped**, exit 0, using the same native-loaded private configuration with cache/module-cache disabled. Includes the four new regression cases. |
| `P2-strict-typescript.log` | Fresh focused strict no-config, no-emit TypeScript passed, exit 0. |

The private oracle loads actual candidate TypeScript modules in memory using
Node's type stripping and VM modules. It imports actual binding selection and
evidence functions for the support-route test; it is not a substitute
implementation of the evaluator. Experimental Node feature warnings are
retained and do not change the assertions. The reviewer made no production
repair or in-memory candidate repair. The original red counterexample log is
retained; the separate post-repair log demonstrates its closure.

Reused, clearly distinguished author evidence: original **100 tests / three
files**, then repaired final **104 tests / three files** (15 arithmetic,
70 starter maths, 19 identity), **129,220** finite family
responses (71,444 single counts, 57,509 two-count combinations, 203 matching maps
and 64 sorting maps), and **164** manifest cases. These reported exhaustive
loops were inspected but not rerun independently; the bounded reviewer checks
and item-by-item content review supply independent evidence. The supplied
base-comparison log reports all 644 original files matching the frozen base,
using text EOL normalization and raw bytes for the four licensed `-text` files.
That base comparison is reused author evidence, not an independent Git audit.

Final repaired candidate inventory, independently measured and matched to the
refreshed `.checks/owned-files.json`:

| Path | Bytes | Lowercase SHA-256 |
|---|---:|---|
| `src/content/expansion-maths/arithmetic.ts` | 33536 | `589c57c0a02969bace3c6713bfbc635616a2ae26cc7797a17816943f77f60dea` |
| `src/learning/evaluators/expansion-arithmetic.ts` | 9425 | `b43c5f39f463aea5f60a504036115cd64a6d74db92285ea515bef6fd9a87728f` |
| `tests/learning/expansion-arithmetic.test.ts` | 22205 | `eafef33ebce0cf3774883379dccefb3d6366d5c0fb1d9aa4f75ec68279f1373e` |
| `docs/content-review/expansion-arithmetic.md` | 18667 | `2f3dc7dea7c8ed6144cd6efb6544d4e2dc87061727457ed78ecd33517dde1148` |
| `docs/work-package/execution/WP03-06A-HANDOFF.md` | 12125 | `c0a6ecb36ad9ed8fbe01eef630b4dcf39a390b9f9a38710c5766f6a696b19418` |

This is a bounded producer/domain review. Actual widget rendering and
accessibility, aggregate runtime dispatch, committed Check/help/evidence/
reward/save/reload, full M2 composition, published play and final listening
remain downstream. No broad game build, shared test run or additional audit
was performed. The original-author repair and focused original-case recheck
are complete and green. Controller administrative acceptance remains separate
from this independent producer/domain PASS.
