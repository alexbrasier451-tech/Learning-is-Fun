# WP03-07A independent validation — 11 October 2026

**Verdict: PASS — F1 closed by independent narrow recheck.** The corrected frozen
candidate's mathematical answers, response boundaries, representations, demand
inventory and actual support selection satisfy this producer review. Controller
retains acceptance/integration authority. The original NOT PASS report and failed
source reproduction remain preserved in private evidence. The validator made no
candidate/source changes and did not repeat unaffected broad checks.

## Frozen identity and authority

Candidate: `artifacts/wp03-07a-20261011/candidate`, base
`9485a2cf67b0703deb4efa6c178602dc7952f705`.

Manifest SHA-256:
`553285622fd9be7a73c6a8bb207f386ace5046585951b000aad5747316915603`.
Patch: 94,243 bytes, SHA-256
`2872336d531e89d087f927e4889b0a640219ac6aa43addc424072ba8ef6850cc`.
Fresh checks verified every file's bytes/hash and reconstructed all five added
files directly from the patch, without applying it or mutating Git.

| Frozen file | Bytes | SHA-256 |
|---|---:|---|
| src/content/expansion-maths/quantities.ts | 32745 | `8fb09395a415f9ed237c01571fe82490402b9c6f2a14581bc9c5332a39a6951b` |
| src/learning/evaluators/expansion-quantities.ts | 10365 | `07763b3ca23d7ac3f6ef168b6c160d7d2a7c6cd97589ca86ac3f3275ca3574b9` |
| tests/learning/expansion-quantities.test.ts | 20020 | `5b96f19135c426668b8a62ce704743c5eb8806c31130044038d3c9843f081df8` |
| docs/content-review/expansion-quantities.md | 16204 | `971bdb63ef2b2da5a8ba5d35ed041634beca83bfd838ede33e7421780fb2c4ed` |
| docs/work-package/execution/WP03-07A-HANDOFF.md | 12670 | `33273fc9d4757d4954d2363eed5e32f2d815bf326a1a3ae279cb0ce4fbe6029a` |

Read the exact delivery, author handoff/evidence, WP03-07A, WP03-13A's required
story and optional revisit rules, WP03-01A contracts, frozen source registry,
identity and selection implementations, and current
[continuation authority](CONTINUATION-AND-MUSIC-VARIATION.md). That authority
allows M2 work with acoustic closure deferred; it does not confer final acceptance.
Standard build protocol applied once. Review remained serial because the dispatch
expressly excluded additional workers/chats. Ordinary writes were limited to this
report and private evidence.

## F1 — P2: decimal-money programme year — CLOSED

The corrected export now states `Year 4 (introductory support)`, section
`Measurement`, and its demand explicitly describes introductory Year 4
decimal-money equivalence. This agrees with the retained DfE evidence below.
Its support band remains appropriate. The associated test-year expectation and
review table agree, and the updated handoff honestly separates author checks
from independent acceptance.

Fresh `recheck-f1.mjs` loaded actual candidate exports and compared them with
the independently retained original `task-review-inputs.json`. Exactly two
export fields changed: this task's `curriculum.programmeBand` and
`demandRationale`. All other fields and the other 29 complete tasks are identical.
Decoding both pinned original and corrected patches confirms exactly two content
source-line changes, one test-year change, associated review/handoff changes,
and an unchanged evaluator. Thus descriptors/IDs, support band, source URL,
prompts, hints, worked help, answer rules, controls, bindings and manifest retain
their reviewed meanings. Original per-item/answer/support-selection evidence
remains applicable.

All nine matching maps plus partial and unknown-ID responses passed fresh
validation/evaluation checks, retaining the original correct mapping
item-1→target-3 (120 p), item-2→target-1 (75 p). Both original-reference and
reconstructed corrected records validate. Recheck exit 0; exact results and
source/document deltas are in private `f1-recheck-results.json` and
`f1-recheck.log`. Command:

```powershell
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --experimental-vm-modules artifacts/wp03-07a-20261011/independent-validation/recheck-f1.mjs
```

Author `.checks/typecheck-f1.log`, `tests-f1.log` (10 family tests), and
`f1-results.json` (11 unchanged evaluations) were inspected as author evidence;
they are not counted as fresh independent executions. No source changes,
main build or broad rerun was performed during closure.

### Original finding and reproduction (retained)

Original patch SHA-256:
`581ef234bf165df4f8e749a0ac44949135163cd13226944da46364dd8c6db1fa`;
original manifest SHA-256:
`7db83ba5b1c7ab9c7585beb395533609746d7209558557ce6ca43f62d85682ee`.
The full original report is retained as private
`validation-before-f1-closure.md`; original `results.json` remains unchanged.
The following finding describes that superseded freeze.

Location: candidate `src/content/expansion-maths/quantities.ts:164–169`;
corresponding author test row and review table also assert Year 3.

`goods-price-pence` presents `Ribbon: £1.20` and `Label: £0.75`, with a hint
explicitly referring to the decimal point. Its export nevertheless says
`programmeBand: "Year 3 (introductory support)"` and its demand starts
`Year 3 supported money equivalence`.

The retained official [DfE mathematics source, Year 3 Measurement notes](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-3-programme-of-study)
states: “The decimal recording of money is introduced formally in year 4.”
Year 4 Measurement connects decimal notation with recorded measures, including
money. This makes the candidate's exact year attribution inaccurate for the
representation it actually assesses. The support band itself is reasonable:
the supplied conversion and direct matching make it introductory Year 4 work.

Recommended bounded correction: retain the task, support band, exact answers and
canonical descriptor, but attribute it to Year 4 introductory support and revise
the demand wording, matching test expectation, review table and handoff/freeze
evidence consistently. No new identity is needed for a metadata-only correction.
An alternative redesign using separate pounds/pence notation would need a fresh
semantic review; the metadata correction is sufficient.

Original reproduction: the final group in private `check.mjs` reads the actual
export, verifies the £1.20 label and asserts `/Year 4/` against its programme
band. It fails with the original Year 3 metadata and labels preserved in
`results.json`. Exact task ID:

```text
lif.math.expansion.m07.r1.authored-%5B%22goods-price-pence%22%2C%5B%5B%22first-pence%22%2C120%5D%2C%5B%22pence-per-pound%22%2C100%5D%2C%5B%22second-pence%22%2C75%5D%5D%5D
```

## Independent mathematical and demand review

All 30 full records were read, including every offered choice/matching label,
quantity bound/form/unit, two hints and separate worked support. The following
solutions were derived from prompts and givens; executable oracles do not read
the author's answerRule or test oracle. S/C/T denote support/core/stretch.

| Skill/key | Band | Independent answer and demand assessment |
|---|---|---|
| M05 shaded-half | S | 1/2 whole; direct part/whole identification |
| shaded-quarters-form | S | 2/4 exactly; names drawn partitions |
| third-of-counters | S | 12 ÷ 3 = 4; explicit sharing scaffold |
| equivalent-sixths | C | 4/6 exactly; numerator/denominator scaling |
| three-quarters-of-beads | C | 20 ÷ 4 × 3 = 15; unscaffolded non-unit fraction |
| add-eighths | C | 5/8; independent combination of like fractional units |
| subtract-tenths | C | 5/10 = 1/2; removal relative to the same whole |
| reverse-three-fifths | T | 12 ÷ 3 × 5 = 20; reconstruct unknown whole |
| improper-mixed-quarters | T | 1 3/4; retain mixed-number form across two wholes |
| compare-thirds-sixths | T | 5/6-full jar; 2/3 is 4/6 |
| M06 five-tenths-decimal | S | 0.5; direct notation |
| seven-hundredths-decimal | S | 0.07; zero placeholder |
| match-decimal-parts | S | tenths→0.3; hundredths→0.03; contrast place values |
| compare-decimal-lengths | C | 0.7; 70 hundredths exceeds 65 |
| quarter-decimal-equivalence | C | 0.75; quarter/hundredths relationship |
| round-decimal-whole | C | 3; midpoint reasoning |
| extend-decimal-pattern | C | 65/100; infer 15-hundredths increment |
| missing-decimal-pattern | T | 70/100 = 7/10; infer later step then reverse |
| decimal-digit-constraints | T | 5.72; interval, digit use and maximisation |
| round-to-tenth | T | 2.5; rounding plus explicitly assessed one-place form |
| M07 path-metres | S | 5 m; explicit same-unit measured route |
| goods-price-pence | S | 120 p; 75 p; supported conversion; source issue F1 now closed |
| millimetres-to-centimetres | S | 3 cm; supplied conversion/grouping |
| path-mixed-lengths | C | 275 cm; conversion before addition |
| goods-change-pence | C | 75 p; 60 p; distinguish costs/payments |
| money-change-quantity | C | 80 p; decimal price to pence then subtraction |
| capacity-total | C | 1250 ml; combine paired units |
| path-remaining-length | T | 175 cm; convert, total, remove travelled distance |
| goods-basket-change | T | 225 p; 155 p; repeated items, extra item, change |
| mass-after-sharing | T | 500 g; conversion and two kinds of removal |

Each skill has genuine 3S/4C/3T demand, with distinct assessed relations rather
than renamed/reordered duplicates. M05 core addition/subtraction are straightforward
fluency tasks within the declared Year 4 scope; stretch adds inverse reasoning
or selected later representations. M06 introductory tasks correctly retain Year 4
source attribution. The other source/section mappings fit the selected scope.
Neither this review nor the source links establish qualified educator approval.

The fraction stimuli retain (shaded, partition per whole, wholes) of (1,2,1),
(2,4,1), (7,4,2). Text alternatives give those same source counts, without a
computed fraction/mixed answer. The three paths retain edge pairs 2m+3m,
2m+75cm, 3m+50cm; coordinates are explicitly not measurements. Alternatives
do not calculate totals/remainders. All 60 hints direct attention or suggest a
method without providing the requested result. Worked support separately gives
the checked solution. No pre-Check answer leak was found in these authored
stimuli, alternatives, instructions or hints.

## Original independent executable evidence (retained and reused)

Private directory: `artifacts/wp03-07a-20261011/independent-validation/`.
`check.mjs`, `results.json`, `task-review-inputs.json`, `run-2.log` and
`typecheck.log` contain the final checks and exact selection IDs. Direct command
from repository root:

```powershell
& 'C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --experimental-vm-modules artifacts/wp03-07a-20261011/independent-validation/check.mjs
```

The direct Node harness loads actual candidate TypeScript exports with built-in
type stripping and VM modules, including the unchanged accepted selection and
evidence policy. No package manager, dependency writes or shared cache is used.
Original exit **1 preserves the then-unresolved F1**, with eight other groups
passing. The separate narrow recheck above closes F1 with exit 0; the original
logs have not been overwritten or represented as passing.

- Exhausted **13,210 quantity responses, 31 choices and 43 matching maps**.
  All results match the independent oracle, including 41 accepted complete
  responses across 30 tasks. Matching enumeration includes duplicate-target
  invalidity. Every task has a reachable correct answer.
- Rational alternatives use BigInt cross-products in the oracle. Actual
  evaluator uses guarded safe-integer products, without float division/equality.
  Exact 2/4 and 4/6 forms, mixed-number notation and 2.5 versus 2.50 remain
  assessed. All declared wrong units are judged false; unknown units are invalid.
- **1,178 boundary checks** cover missing/null values, extra/unknown fields,
  malformed present values, invalid numerators/denominators, non-finite numbers,
  unrepresentable changed content, withheld review and corrupted task fields.
  Incomplete/invalid/unavailable cases carry no correctness. Malformed content
  takes precedence even when a correct answer is submitted.
- All 30 reconstructed records remain valid with permitted card/control order
  and revision changes. Exported records/manifest/bindings are deeply frozen.
- Nine relevant shared/identity/starter files match retained `base.tar` bytes;
  the 36 starter records remain present with no expansion identity collision.
  This is a scoped compatibility check, not a repeated broad repository audit.
- Direct no-emit strict TypeScript check of the candidate focused test and its
  imports passed (exit 0). Arguments: `--ignoreConfig --noEmit --strict
  --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler
  --types node tests/learning/expansion-quantities.test.ts`.

Required pools passed actual `resolveBindingIntent` → `selectNextActivity`
checks. Starting with no evidence selects core. Feeding two valid unsuccessful
completed core episodes through `applyLearningObservation` selects these support
tasks with their original story provenance and reachable correct responses:

| Binding | Support selected |
|---|---|
| q5-story-m05-quantity | shaded-half |
| q8-story-m07-path | path-metres |
| q10-story-m07-goods | goods-price-pence |

All six optional proposals resolve and select from their declared pools. IDs,
quest/skill/response/mechanic, M2 availability and null source links match
WP03-13A; all 30 tasks have routes. M1 rejects these rows as unavailable and
completed story rows reject re-entry. No added mandatory Q1–Q3 beat exists.
This exercises producer proposals supplied to existing pure policy APIs; central
catalogue/dispatcher/binding assembly remains WP03-13A's work.

The first independent run had a **validator fixture defect**: it submitted
zero-Check finishes, which the accepted evidence policy correctly ignores.
`check-run-1.mjs`, `results-run-1.json` and `run-1.log` preserve that failure.
The corrected fixture submits a valid incorrect Check before each finish and
asserts two completed episodes before checking support selection. The full
harness rerun passed selection; no production correction was made. The author's
separate retained 99-test pass and earlier failed attempts were inspected but
are not presented as fresh independent executions.

## Limits and handback

The original author's bounded correction is independently verified. No findings
remain against the exact corrected five-file freeze recorded above. Controller
may use this producer PASS for acceptance/integration; the original finding,
failed reproduction and superseded freeze remain preserved.

No source fixes, main build, Git mutation, deployment, other chat messages or
additional workers were performed. Actual tap/keyboard controls, visual/accessibility
rendering, sticky help/listening evidence, retry/reload, M1-save compatibility,
world completion and published play remain with WP02/WP04/WP06. Listening and
final acoustic acceptance remain deferred under the human's continuation
authority. The validator now idles; Controller owns repair routing and integration.
