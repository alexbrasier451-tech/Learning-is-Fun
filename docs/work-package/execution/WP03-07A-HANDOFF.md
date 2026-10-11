# WP03-07A candidate handoff

Author candidate for independent review, 11 October 2026. Constructed under
Controller dispatch and the human's retained M2 continuation authorization in
CONTINUATION-AND-MUSIC-VARIATION. Detailed acoustic acceptance remains deferred;
this candidate supplies no listening, child-testing, qualified educator or
efficacy claim. Do not integrate until Controller's independent review accepts it.

## Base, candidate and exclusive patch

Base commit: `9485a2cf67b0703deb4efa6c178602dc7952f705`.

Candidate root:
`C:/Users/alexb/Documents/ChatGPT/Learning is Fun/artifacts/wp03-07a-20261011/candidate`.
It was created by `git archive` with command-local safe.directory after the
host's previously reported managed-worktree ownership failure. No global Git
change, setup retry, install, shared dependency write, main source edit, commit,
new worker, shared binding edit, broad app build or deployment was performed.

The production patch consists of exactly these five added files:

1. `src/content/expansion-maths/quantities.ts`
2. `src/learning/evaluators/expansion-quantities.ts`
3. `tests/learning/expansion-quantities.test.ts`
4. `docs/content-review/expansion-quantities.md`
5. `docs/work-package/execution/WP03-07A-HANDOFF.md`

The sibling `WP03-07A.patch` and `WP03-07A-manifest.json` freeze this exact
five-file patch, byte lengths and lowercase SHA-256 values. Candidate-local
`.checks/` holds logs/configuration, exact serialized bindings/cases and the
private Vite cache. Those are review evidence, not production files. The
retained `base.tar` is the original archive. Ordinary supported writes were
used; no Toolkit transaction was requested or required.

## Delivered interfaces and limits

`QUANTITY_TASKS: readonly TaskDefinition[]` contains 30 immutable finite tasks,
ten per M05/M06/M07 and exactly 3 support/4 core/3 stretch each. Source, demand,
identity parameters, control bounds, answer/form/unit policy, two hints,
worked support and author review are complete. Six immutable stimuli retain
source givens and non-answer text alternatives: three fractions and three paths.

`QUANTITY_MANIFEST: TaskFamilyManifest` has three family IDs, thirty IDs and
120 response cases. `retainedTaskIds: []` is deliberate: no M05–M07 starter
records exist to count. No other starter is copied or altered.

`evaluateExpansionQuantities(task, response): EvaluationResult` handles
quantity, choice and matching through the frozen types. Finite integer
cross-products preserve rational equivalence; exact-form slots preserve named
denominators; decimal-place form is assessed with choice IDs. All money is
integer pence, and metric conversions retain requested units. Complete allowed
wrong-unit/form entries are judged false; unknown units, unsafe/negative/out-of-
range numbers, zero/forbidden denominators, unknown IDs and duplicate matching
targets are invalid. Null/missing permitted entries are incomplete. Malformed
present entries take priority over missing fields. Only judged answers carry
correctness and factual feedback.

`validateQuantityTask(task): readonly ContentIssue[]` gates on the reviewed
finite record, source tuple and every semantic field. Unreviewed/nonrepresentable
variants are unavailable content, never child failure. Structural comparison
rejects non-finite numbers before serialisation and never equates NaN/infinity
with a null stimulus. Revision and card order can change without changing
meaning; new givens, help, answers, units or labels cannot bypass review.

`QUANTITY_BINDING_PROPOSALS: readonly QuestActivityBinding[]` supplies the exact
required IDs `q5-story-m05-quantity`, `q8-story-m07-path`,
`q10-story-m07-goods`, with explicit support-accessible pools. The review file
lists each pool in full, and `.checks/quantity-bindings.json` serializes exact
canonical IDs. Six optional Q1/Q5/Q10 revisit proposals follow WP03-13A's
convention. No central catalogue/dispatcher/registry/DTO/UI/state/world or
another family's file was modified.

## Verification and preserved attempts

Direct bundled Node executable:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
Dependencies resolve read-only from the existing main installation through
normal ancestor lookup. There is no new node_modules junction and no pnpm call.
TypeScript ran with no emit and no buildinfo; Vitest used a native-loaded
candidate-local config, private `.checks/vite-cache`, one worker, serial files.

Exact command arguments from the candidate cwd (Node executable above):

```text
<main>/node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/learning/expansion-quantities.test.ts
<main>/node_modules/vitest/vitest.mjs run --config .checks/vitest.config.mjs --configLoader native
```

Strict TypeScript passed. The final focused suite passed **99 tests across
three files**: ten expansion quantity tests, seventy retained starter-maths
tests and nineteen identity tests. Independent literal solution/demand tables
cover all thirty records. Exhaustive checks cover **13,210 quantity responses,
31 choice selections and 43 matching maps**, plus 120 manifest cases,
malformed/draft inputs, reviewed-record mutations, units/assessed forms,
equivalence, stimulus alternatives, identity and exact binding pools. Numeric
oracles use independent BigInt cross-products. Every authored task has a
reachable complete answer. Direct equality never uses floating-point division.

Retained attempts in `.checks/`:

- `typecheck-initial.log`: two diagnostics from the frozen choice/punctuation
  union's narrowing. Producer correction reversed the options ternary to narrow
  on matching; `typecheck-second.log` and later logs pass.
- `tests-initial.log`: family module import rejected camel-case source-parameter
  names. Earliest failure was descriptor construction, before evaluation.
  Producer now serializes givens into the required lowercase hyphenated identity
  names. The starter/identity checks already passed in that attempt.
- `tests-second.log`: response classification checks succeeded, but test-count
  bookkeeping expected 15,030 rather than 13,210 quantity cases and 32 rather
  than 31 choices; a test also imposed an arbitrary character minimum on its
  own short oracle label. These were fixture defects. Corrected counts include
  their independent arithmetic; the irrelevant length assertion was removed.
- `tests-third.log`: all 99 passed after repairs. `typecheck-final.log` and
  `tests-final.log` retain the final rerun after source-domain assertions and
  documentation/evidence completion. No failed attempt is represented as a pass.
- `export-evidence.log`: the private serializer initially used the removed
  TypeScript compiler API. This tooling failure did not affect production or
  tests. The serializer now uses Node's built-in type stripping and VM modules;
  `export-evidence-final.log` records verified output for all handoff responses.
- `freeze.log`: the first boundary check compared archive-exported CRLF files
  with raw Git blob bytes and falsely flagged `.gitattributes`. The final check
  compares every unchanged file byte-for-byte with the retained original
  `base.tar`; no production repair was needed. Command-local autocrlf=false
  keeps the new-file patch byte-exact without changing global Git settings.

## Downstream cases and integration boundary

`.checks/quantity-control-handoff.json` is the exact serialized case-to-binding
manifest, with canonical IDs, response, expected status/correctness, evidence
mode and downstream consumer. It expands these representative scenarios:

| Case | Task key / binding | Expected pure response/result | Downstream expectation |
|---|---|---|---|
| fraction-independent | shaded-half / q5-story-m05-quantity | 2/4 whole; judged true | WP02 quantity controls; WP04 independent Check and saved provenance |
| fraction-supported | third-of-counters / q5-story-m05-quantity | 4/1 count; judged true | WP04 sticky answer-help evidence survives retry/reload; supported outcome |
| path-listening | path-mixed-lengths / q8-story-m07-path | 275/1 cm; judged true | WP02 reads givens without calculating answer; WP04 listening-supported evidence |
| path-wrong-unit | path-metres / q8-story-m07-path | 5/1 cm; judged false, value-mismatch | WP02 preserves unit and displays factual feedback; retry retains same identity |
| goods-independent | goods-price-pence / q10-story-m07-goods | item-1→target-3, item-2→target-1; judged true | WP02 matching controls; WP04 correct exact Q10 binding completion |
| goods-partial | goods-price-pence / q10-story-m07-goods | item-1→target-3, item-2→null; incomplete | No scored Check/reward/learning observation |
| decimal-form | round-to-tenth / q5-revisit-m06-choice | option-3 (2.50); judged false | Written form remains assessed, despite equal numeric value |
| familiar-money | money-change-quantity / q10-revisit-m07-quantity | 80/1 p; judged true | WP04 same-week familiar practice; no new opportunity from catalogue growth |

Evidence-mode labels in that manifest are scenario preconditions for consumers,
not outputs of this pure evaluator. Worked support affects sticky answer-help;
listening is separate. WP03-13A must integrate reviewed exports through existing
shared APIs and preserve all M1 identities/rows. WP04-07A must exercise actual
M1-save compatibility, provenance, hint/retry/listening/familiar history and
partial quest completion. WP02-10A must demonstrate real keyboard/tap controls,
quantity form/unit choices and non-answer alternatives. WP06 must observe the
published candidate and complete final acoustic/play gates. None of those
integrated or published observations is claimed by these data tests.

## Bounded F1 correction for independent recheck

The original independent review, `docs/work-package/execution/WP03-07A-VALIDATION.md`
in main, remains **NOT PASS** with F1 until the reviewer rechecks this replacement.
Its original patch, hash manifest and report are preserved under
`.checks/pre-f1/`; the original patch SHA-256 is
`581ef234bf165df4f8e749a0ac44949135163cd13226944da46364dd8c6db1fa`.
No main report was edited and no independent pass is claimed by this repair.

The official DfE source was rechecked on 11 October 2026. Its
[Year 3 Measurement notes](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-3-programme-of-study)
place formal decimal-money recording in Year 4; the
[Year 4 Measurement notes](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-4-programme-of-study)
connect decimal place value and notation with recording money. The
`goods-price-pence` source is now **Year 4 (introductory support), Measurement**,
with demand explicitly naming decimal labels, integer pence, the supplied
conversion and direct matching. Its support band is preserved.

Only that task's exported curriculum programme band and demand rationale changed.
The independent test-year expectation and review table now agree. The exact
descriptor/canonical ID, prompts, two hints, worked support, answer/control
space and all nine binding proposals remain unchanged. The other 29 complete
tasks, family manifest and evaluator source are unchanged. There is no new
diagnostic stage or unrelated content/evaluator rewrite.

`.checks/f1-check.mjs` compares actual pre/post exports and reruns the task through
validation and evaluation for all nine matching maps plus partial/unknown-ID
drafts. `.checks/f1-results.json` and `f1-check.log` record the passing comparison:
all eleven results are unchanged, and both original-reference and reconstructed
corrected records validate. `typecheck-f1.log` passes the same strict no-emit
check; `tests-f1.log` passes the ten quantity-family tests with the corrected
source expectation. Those tests include all 13,210 quantity responses, 31
choices, 43 matching maps and 120 manifest cases. The prior 99-test run remains
historical evidence; unaffected starter/identity suites were not repeated.
The five-file patch/manifest were refrozen after this correction; the evaluator
hash remains `07763b3ca23d7ac3f6ef168b6c160d7d2a7c6cd97589ca86ac3f3275ca3574b9`.

Freeze this corrected candidate for the same reviewer's narrow recheck. Controller is the sole integration
authority; the author is idle after delivery and has not messaged other chats.
