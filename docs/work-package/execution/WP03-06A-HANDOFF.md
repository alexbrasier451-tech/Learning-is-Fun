# WP03-06A candidate handoff

Frozen for independent review on 11 October 2026. Implemented by Codex under the
Controller dispatch and current human execution/continuation authority. DEP-087
and DEP-088 were supplied as accepted frozen contracts. DEP-086's detailed
acoustic gate is deferred for construction under CONTINUATION-AND-MUSIC-VARIATION;
no acoustic pass or final release acceptance is claimed.

## Candidate, base and exact ownership

Candidate root: `C:/Users/alexb/AppData/Local/Temp/lif-m2-arithmetic-01a12b4c`.
Base: `6b5834953b56b4f2ce33c099700b1090805b6144`.

The managed-worktree tool failed once on the app Git process's ownership check.
A private copy was produced with `git archive` from the exact base and moved
outside the shared checkout before implementation. No setup retry, global Git
configuration, main source mutation, commit, staging, merge, push or deployment.
Only these five added paths are the production patch; Controller can copy them
exactly from this candidate after independent acceptance:

1. `src/content/expansion-maths/arithmetic.ts`
2. `src/learning/evaluators/expansion-arithmetic.ts`
3. `tests/learning/expansion-arithmetic.test.ts`
4. `docs/content-review/expansion-arithmetic.md`
5. `docs/work-package/execution/WP03-06A-HANDOFF.md`

Candidate-local `.checks/` contains private check configuration/logs and the
five-path byte/hash inventory. It is evidence, not an integration patch or
Toolkit transaction. `node_modules` is a read-only dependency junction to the
frozen main installation. TypeScript ran without config/build/buildinfo writes;
Vitest used a native-loaded private config, candidate-owned `.checks/vite-cache`,
one worker and serial files. No cache/config output writes through that junction.

## Delivered capability

`ARITHMETIC_TASKS: readonly TaskDefinition[]` contains exactly 40 finite tuples,
each M01–M04 4 core/3 support/3 stretch. All parameter givens, operations,
canonical descriptors, sources, demand, prose, approved author review, response
bounds, complete accepted answers, two hints and separate worked support are
retained. Nine actual source arrays agree with their givens and accessible
alternatives. No array caption supplies a requested product/new share/scaled
count. Text tasks have null stimulus.

`ARITHMETIC_MANIFEST: TaskFamilyManifest` inventories forty new IDs, twenty-four
unchanged starter references, four family IDs, exact finite domains, review
evidence and 164 correct/alternative/wrong/partial/invalid cases.

`evaluateExpansionArithmetic(task, response): EvaluationResult` handles bounded
whole-count, matching and group-sorting responses. Malformed content is
unavailable; unknown IDs, duplicate matching endpoints, forbidden numbers/units/
denominators are invalid; permitted drafts incomplete; complete in-domain
answers judged. Zero is a real complete quantity. Equivalent matching choices
are accepted independently of object/card order. Wrong feedback reports observed
slot placements/counts and a justified mismatch, with factual arithmetic
explanation rather than learner diagnosis. No state/reward/renderer is imported.

`validateArithmeticTask(task): readonly ContentIssue[]` enforces membership in
the reviewed finite bank and consistency of descriptor, objective/band/source,
representation, prose/help, controls and answer rule. Object and display-option
order are immaterial; content revision is separate from equivalence. New or
non-exact/zero-divisor tuples are not silently generated. Deeply frozen approved
exports use a reference shortcut; reconstructed/untrusted tasks undergo the
full field consistency check.

Additional `ARITHMETIC_BINDING_PROPOSALS: readonly QuestActivityBinding[]`
follows the assembler's exact required/optional division. The only required
proposal is `q4-story-m02-match`, with a represented support expression-match
plus three core fact matches. The remaining Q1/Q3/Q4/Q9 routes use the documented
`q{number}-revisit-{skill}-{responseKind}` convention and nonempty explicit pools.
M02 has its own Q3 equal-group assessment; M03 has its own Q4 exact division/
inverse work; M01 has separate Q9 missing totals; M04 remains Q3 scaling breadth.
These are proposed data, not central runtime edits. No new required Q1–Q3 work.

## Actual verification and retained failures

Bundled Node 24.19.0 was used from the candidate cwd. Exact final commands:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/learning/expansion-arithmetic.test.ts
node node_modules/vitest/vitest.mjs run --config .checks/vitest.config.mjs --configLoader native
```

Focused strict TypeScript passed. Vitest passed **100 tests / three files**:
11 expansion arithmetic, 70 starter maths, 19 identity. Final suite runtime was
2.83 seconds; an arithmetic-only rerun when pinning exhaustive counts also passed
all 11 before the last binding refinement. The complete final suite was rerun after matching/binding
refinement. Private logs are `.checks/final-focused-checks.log` and
`.checks/arithmetic-domain-counts.log` (the latter records the earlier numeric
count-pinning run; final counts are the checked-in tests).

The independent literal oracle and inverse checks cover all forty task answers;
all 71,444 single-count values, 57,509 two-count combinations, 203 matching maps
and 64 sorting maps are exhaustively classified (129,220 family responses),
plus 164 manifest cases and malformed/content/identity cases. Directly affected
starter checks retain the original exact controls, three alternative bridge
anchor constructions and merchant anchor. No broad game suite or build ran.

Retained failures/corrections:

- Initial strict typecheck caught a broad ActivityResponse union in manifest
  sorting fallback (`Property groups does not exist`). Explicitly narrowing the
  three arithmetic response kinds fixed it; focused typecheck then passed.
- The first attempted Vitest cache CLI flag was unsupported (`Unknown option
  --cacheDir`), so no tests ran. A private plain ESM config and `--configLoader
  native` supplied candidate-owned cache paths without bundled config output.
- Source-data review exposed represented-share answer leakage despite initial
  green arithmetic tests. A focused regression then failed on the caption's
  requested six-counter share. `.checks/represented-share-pre-fix.log` preserves
  that red result. The three support division records were corrected at the
  source question/parameters layer to ask new shares from displayed counters.
  Independent numeric oracles, source-data checks and full task→evaluator suite
  then passed. No downstream compensation or unresolved semantic failure.
- Inspection of the receiving WP03-13A contract established the exact required
  Q4 matching ID and support-accessible pool. The support expression-match was
  authored within the frozen DTOs; optional proposals were aligned with the
  accepted revisit convention. No DTO/quest change or contract gap remains.
- The frozen-tree verification first hit the shell Git ownership check; a
  command-local safe.directory argument enabled that read without persistent
  configuration. Raw blob comparison then exposed the archive's normal Windows
  text EOL conversion. The final attributes-aware comparison passed all **644**
  original files: normalized text plus raw bytes for the four retained `-text`
  licensed evidence files. Empty/incorrect preliminary comparisons were not
  accepted as evidence. `.checks/base-compare.log` retains the final result.

The per-task oracle/source/demand review is in
`docs/content-review/expansion-arithmetic.md`. Owned-file whitespace and frozen
base comparison checks were performed before final freeze; exact file lengths
and lowercase SHA-256 hashes are in `.checks/owned-files.json`.

## Narrow P2 repair after independent review

The independent Sol/xhigh review in main
`docs/work-package/execution/WP03-06A-VALIDATION.md` passed the forty item
meanings, independent answers, source/demand/help and binding checks, but reported
one P2 in reconstructed-content comparison. Its original report and prior
five-file inventory are retained in candidate `.checks/WP03-06A-VALIDATION-original.md`
and `.checks/owned-files-before-P2.json`; earlier PASS evidence and failures above
remain historical evidence, not acceptance of this repaired candidate.

NaN, positive infinity and negative infinity as `tasks[0].stimulus` originally
compared equal to the reviewed null via JSON.stringify. All three were reproduced
through validateArithmeticTask then evaluateExpansionArithmetic with the original
correct 43-counter response: zero content issues and scored judgement. The
three new regression cases failed before the fix; the full red result is in
`.checks/P2-original-cases-pre-fix.log`.

The earliest causal fix is limited to the stable comparison's primitive boundary:
only null, strings, booleans and finite numbers can be serialized as primitives.
Arrays and plain records retain recursive, order-independent comparison;
undeclared objects/types and non-finite values throw before serialization can
erase their type. The existing validator catch emits malformed-content and
the evaluator's existing gate returns unavailable-content. Response structure
and judgement behavior were not changed or compensated downstream.

Fresh exact-case plus related reconstruction checks passed **four tests**:
the three original non-finite stimuli return content issues and unavailable-content
with no correctness field; undeclared primitive/boxed/custom-toJSON values and
non-finite nested array counts are rejected; genuine reconstructed null/text and
all forty task representations/independent answers still pass. Non-finite
response counts continue returning invalid-response. Logs:
`.checks/P2-original-cases-post-fix.log` and `.checks/P2-strict-typescript.log`.

The complete focused arithmetic/starter/identity run passed **104 tests / three
files** (15/70/19), runtime 2.76 seconds, using the same private native config,
one worker and candidate-owned cache. Log: `.checks/P2-focused-regression.log`.
Strict no-config, no-emit TypeScript passed. All 129,220 exhaustive family responses
and 164 manifest fixtures were rerun. No broad build/game suite ran.

The content module, forty task records, canonical meanings, exact source arrays,
help, response domains, 164 cases and eleven binding proposals are byte-unchanged
from the independent review. Only evaluator, regression tests, review document
and this handoff changed. The integration allowlist remains the same five added
paths; `.checks/owned-files.json` is refreshed with their actual lengths/hashes.
Same-reviewer recheck and Controller administrative acceptance remain pending.

## Receiving boundaries and limits

WP03-13A imports the four prescribed exports directly and owns shared catalogue,
family dispatch and binding integration. Family IDs are
`math.expansion.m01`, `.m02`, `.m03`, `.m04`. Response kinds are quantity,
matching and sorting; no new adapter is required. Manifest correct/alternative/
partial/invalid cases provide representative real-control fixtures for each.
The existing DTO does not add a binding field to TaskFamilyManifest; the typed
proposal export and review table supply those bindings without changing it.

Required and optional pools retain the same task IDs; repeated binding offers do
not manufacture new canonical breadth or reward opportunities. Worked support
reveals the answer and must be recorded before display by downstream state.
No compulsory full-bank completion, subject lock or harder-band reward exists.

This is a frozen independent-review candidate. Independent acceptance, actual
widget rendering/accessibility, committed Check/help/evidence/reward/save and
reload, real M2 composition, published play and final listening remain with
Controller and downstream WP03/WP02/WP04/WP06 owners. No runtime integration or
qualified educator/child/efficacy claim is made. No workers were delegated or
other chats messaged.
