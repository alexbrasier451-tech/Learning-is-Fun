# WP03-02A implementation handoff

Implemented by Codex on 9 October 2026 after Controller released DEP-008/009
from independently accepted learning/experience contracts. Independent validation
and administrative acceptance remain Controller-owned.

## Behavior and owned files

- `src/content/starter-maths.ts`: buildBridgeTasks/buildMerchantTasks produce
  exactly 12 targets 6–17 and 12 multiplier 2/3 × solution pears 1–6 records;
  all introductory support, original approved prose, two hints and separate
  worked support. STARTER_MATHS_MANIFEST exports the exact 24 IDs and 52 cases.
- `src/learning/evaluators/starter-maths.ts`: bounded family validator and
  evaluateStarterMaths; invalid content is unavailable, malformed responses
  invalid, permitted empty drafts incomplete, complete domain responses judged.
  Bridge uses the actual sum for every construction; merchant checks both
  constraints independently. No points, observations, state or UI runtime.
- `tests/learning/starter-maths.test.ts`: independent solutions, exhaustive
  domains, boundaries, help/metadata, content faults and purity/identity checks.
- `docs/content-review/starter-maths.md`: exact 24-row canonical/parameter/answer
  inventory, observed constraint/boundary matrix and honest content review.

## Exact criteria and evidence

Anchor IDs remain `lif.math.bridge.r1.total-12` (one to six reusable 1–6 m planks)
and `lif.math.merchant.r1.mult-2.pears-3` (nine fruit, six apples/three pears).
Bridge 6+6, 4+4+4 and 1+2+3+6 all pass. Merchant (6,3)/(5,4)/(4,2)/(2,2)
respectively pass / fail relationship / fail total / fail both. Six planks and
24 fruit are legal boundaries; seven planks/25 fruit are invalid. Zero of one
fruit is a real answer; wholly empty baskets and null counts are incomplete.
Invalid/incomplete/unavailable results carry no correctness or points.

All 24 descriptors reproduce from complete meaningful parameters, with r1
equivalence separate from contentRevision. Every record has a source/objective,
support demand rationale, reviewed explanation/two hints/worked example and
neutral narration. M01 measurement context and M04 mixed-task/contextual skills
are explicit; no independent M02/E08 evidence or harder band is invented.

Executed with bundled Node
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`:

1. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/learning/starter-maths.test.ts` — passed, no shared build-cache writes.
2. `node node_modules/vitest/vitest.mjs run tests/learning/starter-maths.test.ts` — 70 passed, final run 1.64 seconds. Includes 671,832 bridge judgements (all 55,986 ordered 1–6-plank responses across 12 targets) and 3,900 merchant evaluations (all 325 legal pairs across 12 requests), independent 24-answer/wrong-answer table and 52 manifest cases.
3. Owned-file whitespace scan and command-only safe.directory `git diff --check` — passed.

An initial focused typecheck caught `{}` fallback inference in the validator;
explicit unknown-value record typing fixed it. Runtime family tests were green
before and after that correction. Singular feedback/worked wording was improved
and the full focused suite rerun. No failed semantic repair remains.

## Receiving examples and limits

WP03-05A consumes the builders, manifest and evaluator/validator directly and
owns the nine signed-off M1 bindings. Other 11 bridge/merchant tasks are the
respective optional-transfer pools, excluding the singleton anchors. Example
distinct descriptors: bridge `{target:13}` → total-13, answer [3,5,5]; merchant
`{multiplier:2,pears:4}` → mult-2.pears-4, answer eight apples/four pears.
No binding catalogue or selection engine was added here. Static WP02 Q1/Q3
prerequisites/results were inspected without importing their runtime.

Worked support deliberately reveals a solution and downstream owners must
persist help before display. Routine instruction/assessed maths narration is
separate from answer help. Merchant observations remain mixed-task M04; the
existing EvaluationResult shape is preserved and allocates no learning IDs.

No material contract mismatch found. Numeric/schema/prompt consistency is
validated here; prose appropriateness is the recorded content review, not a
general text-understanding engine. No qualified educator/child review claimed.
Real widgets, committed attempt/help/reward persistence, save/reload, audio and
published adventure verification belong to downstream owners. No broad tests,
shared configuration/catalogue/status edits, staging, commit or delegation.
Unrelated state/artwork/Controller changes were preserved.
