# WP03-02A independent implementation validation

Review completed 9 October 2026. Reviewer: Codex, independent validator; not the implementation author on this scope.

**Verdict: ACCEPTED. Finding severity: NONE. Invalidated criteria: NONE.** Acceptance covers the bounded starter maths content, family validator/evaluator, manifest and content-review evidence. Controller owns administrative acceptance and dependency release.

## Authority and scope

Read the current execution authority in [GLOBAL_RULES](../GLOBAL_RULES.md), [WP03-02A](../chunks/WP03-02A.md), DEC-007–011 in [DECISIONS](../DECISIONS.md), the [implementation handoff](WP03-02A-HANDOFF.md), complete content/evaluator/test files and the [24-row review matrix](../../content-review/starter-maths.md). Inspected accepted learning identity/types and M01/M04 curriculum definitions. Current HEAD during review was `85ec7099d58e9ecde0681f1e266c23903fb06f87`; this family scope is uncommitted/untracked. Current execution authority supersedes historical planning-only restrictions.

Bounded consumer reads checked the M1 anchor/transfer table in WP03-05A and bridge/basket semantics in WP02-06A. They confirm the direct family handoff without requiring aggregate bindings, widgets or committed state. This validator writes only this report and the separately requested WP02-01A validation append; concurrent art/adaptive-policy/shared-status work is preserved.

## Acceptance assessment

| Criterion / contract | Independent conclusion |
|---|---|
| Exact bank, saved parameters and canonical identities | PASS. Deterministic builders emit 12 ascending bridge targets 6–17 and 12 merchant multiplier 2/3 × pears 1–6 records. IDs exactly match the accepted total/multiplier/pear keys, with meaningful descriptors, authoredKey null, r1 equivalence and separate starter-maths-1 content revision. The total-12 and mult-2.pears-3 anchors are immutable. Alternative construction/order and compatible content revision do not refresh identity. Different relationships retain different merchant identities even when their total matches. |
| Reachability and actual bridge arithmetic | PASS. Every independently tabulated solution sums to its requested target within one to six reusable whole-metre lengths 1–6. The evaluator sums the actual submitted planks, accepts every permitted exact total, and emits sum-under/sum-over from the actual difference. At the anchor, [6,6], [4,4,4], [1,2,3,6] and its reverse all pass. Feedback reports observed totals and how a plank change changes the sum; it does not privilege one arrangement or diagnose the child. |
| Both merchant constraints | PASS. The anchor retains the exact nine-fruit/twice-as-many wording. The evaluator independently checks total and apples = multiplier × pears. (6,3) passes; (5,4) fails relationship only; (4,2) fails total only; (2,2) fails both. Every review-table solution satisfies both constraints; the largest, (18,6), fits the 24-fruit domain. Wrong-constraint feedback is explicit and neither condition suppresses the other. |
| Malformed, incomplete and judged boundaries | PASS. Empty bridge, null merchant fields and wholly empty basket are incomplete. Nonempty permitted wrong answers, including zero of one fruit, are judged. Seven planks, out-of-range/noninteger/nonfinite/sparse lengths, wrong response kind or extra fields are invalid. Merchant negative/noninteger/nonfinite/wrong-type/missing counts and totals over 24 are invalid. Six legal planks and 24 fruit remain in the judged domain regardless of their correctness. Unscored variants have no correct field or points. |
| Content faults and family contract | PASS. Validation checks canonical identity, r1/family, parameter reachability, objective/support band/context, retained source, response bounds, matching answer rule and assessed request, required text/help/narration and approved review. Unavailable/mismatched/withheld content is returned before response judgement. The pure family exports implement the agreed builders, evaluator, validator and manifest; no task binding catalogue, state mutation, learning observation or reward calculation is introduced. |
| Educational wording, assistance and feedback | PASS. Neutral instructions describe controls; assessed text carries the span or both merchant requests. Hint 1 directs attention and hint 2 gives addition/grouping strategy without a final construction/count answer. Separate worked support deliberately reveals a valid solution with a distinct ID. All twelve bridge worked constructions and twelve merchant worked calculations are correct. Text explains outcomes without relying on audio; downstream recording-before-help ownership is explicit. |
| Objective/source/demand and honest evidence | PASS. M01 assesses introductory addition; metres are M07 context. M04 is explicitly mixed integer-scaling/two-constraint work, with M02/E08 contextual only. All tasks remain support band; larger target/multiplier does not invent core/stretch or proficiency evidence. The review distinguishes internal content approval from qualified educator, child and published-game review. No full-curriculum, calibrated ability or 30-unseen-task promise appears. |
| Independent answers, manifest and receiving contract | PASS. The review and tests pin independently chosen answers and a complete wrong answer/category for every record. The 52 manifest cases resolve to exactly the 24 exported tasks and cover per-task success/wrong plus key unscored boundaries. WP03-05A retains aggregate evaluation and the q1-story-m01/q3-story-m04 singleton anchors; the remaining eleven tasks per family support distinct transfer pools. Actual controls→Check→commit→reload remains downstream. |

The retained [DfE mathematics programme](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study) was independently rechecked: Year 3 addition/subtraction includes missing-number problem solving, and Year 3/4 multiplication/division includes integer scaling. The small-number support tasks are reasonably described as earlier arithmetic consolidation in that planning context; this is a bounded reviewer inference, not statutory attainment evidence.

Selected exact expectations were checked independently of the production worked examples:

| Input | Expected / observed result |
|---|---|
| Bridge target 12, [5,6] | Judged false, sum-under, observed 11 m / 1 m short |
| Bridge target 12, [6,6,1] | Judged false, sum-over, observed 13 m / 1 m over |
| Bridge target 12, six 1 m planks / seven planks totalling 12 | Legal wrong judgement / invalid response |
| Merchant anchor (6,3) / (5,4) / (4,2) / (2,2) | Correct / relationship-only / total-only / both wrong |
| Merchant anchor (0,3) or (6,0) / (0,0) | Complete wrong judgement / incomplete |
| Merchant (18,6) | Legal wrong judgement at anchor; correct at multiplier 3, pears 6 |
| Merchant (22,3) | Invalid response: 25 fruit exceeds the structural bound |
| Withheld/mismatched content and otherwise empty response | Unavailable-content, rather than a child attempt or wrong answer |

## Independent verification

Used bundled Node at `C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

- Fresh `node node_modules/vitest/vitest.mjs run tests/learning/starter-maths.test.ts -t '^(?!.*exhausts)'` — **68 tests passed; two exhaustive tests deliberately skipped**. This includes the literal 24-answer table, all 52 manifest cases, alternative anchors, both-constraint cases, malformed/incomplete/content-error boundaries, metadata/help and purity/identity checks.
- Fresh `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/learning/starter-maths.test.ts` — **exit 0**.
- Reused the author's successful complete **70-test** run for the two exhaustive domains. Inspected both enumeration/oracle implementations: all 55,986 ordered one-to-six-plank responses are checked across twelve independently indexed targets (**671,832 judgements**); all 325 bounded counter pairs are checked across twelve independently tabulated merchant requests (**3,900 evaluations**, including empty baskets). The oracles do not obtain expected answers from production evaluation or worked support.
- Independently checked every review-table sum, merchant multiplication/total, prompt, hint, worked solution, feedback classification and source/demand attribution. This is independent content/implementation review; no qualified educator or child review is claimed.
- Fresh owned-file trailing-whitespace scan — **zero offending lines**. No broad application suite, production/shared-status mutation, commit, delegation or other-chat message was performed.

Reviewed lowercase SHA-256 snapshots:

| File | SHA-256 |
|---|---|
| `src/content/starter-maths.ts` | `eabbe55e1894bc228359afce89292228e56150e97fc673723d44798cacd1fe68` |
| `src/learning/evaluators/starter-maths.ts` | `4534df3dd084294df09efba912836e2513ee81c0d4ec7b6ebc0af8bc4eade2ba` |
| `tests/learning/starter-maths.test.ts` | `42e33389294cbbde025172f0b488b57b9951588f66583caa26d4d951134baa58` |
| `docs/content-review/starter-maths.md` | `d7a7e6195757dbfd41f459d99d6dd31fce3d9d01ad2e5f98a9f136b68a50ef40` |

Family acceptance supplies reviewed reachable tasks and exact unscored/judged outcomes. Aggregate binding/selection, actual widgets, assistance/evidence/reward persistence, save/reload, audio and the published adventure retain their assigned downstream acceptance owners.
