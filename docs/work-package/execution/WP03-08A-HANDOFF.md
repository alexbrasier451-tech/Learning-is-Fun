# WP03-08A private candidate handoff

Status: F1 demand repair authored and checked; independent narrow semantic
recheck and Controller acceptance pending. 11 October 2026. The original
independent review rejected one core demand; its evidence is preserved.

Base commit: `5a9f131e29f0c12717abbeb2f0e6a18fbeaf5f26`.
Candidate: `artifacts/wp03-08a-20261011/candidate`, created with a per-command
safe.directory Git archive. Main was read-only. No Git-managed worktree,
installation, pnpm preparation, shared dependency write, app build, main commit,
deployment or worker spawning occurred. Direct Node checks used this private
candidate, one test worker at a time, no cache and no buildinfo output.

## Owned output and APIs

Exactly these five deliverable paths are owned; all are additions to the base:

- `src/content/expansion-maths/time-space-data.ts`
- `src/learning/evaluators/expansion-time-space-data.ts`
- `tests/learning/expansion-time-space-data.test.ts`
- `docs/content-review/expansion-time-space-data.md`
- `docs/work-package/execution/WP03-08A-HANDOFF.md`

The external `artifacts/wp03-08a-20261011/owned-files.json` freezes exact
relative paths, byte counts and lowercase SHA-256 values, including this
handoff. It is the copy/integration allowlist. Baseline archive and logs remain
alongside it; they are evidence, not proposed repository additions.

Exports:

- `TIME_SPACE_DATA_TASKS: readonly TaskDefinition[]`: 30 new finite canonical
  tasks; M08/M09/M10 each exactly 3 support, 4 core, 3 stretch. No starters replaced.
- `TIME_SPACE_DATA_MANIFEST: TaskFamilyManifest`: exact IDs/families, review
  reference, domain and 122 accepted/rejected/partial/invalid semantic fixtures.
- `TIME_SPACE_DATA_BINDING_PROPOSALS: readonly QuestActivityBinding[]`: seven
  exact proposals, with explicit task ID pools and support access.
- `validateTimeSpaceDataTask(task: TaskDefinition): readonly ContentIssue[]`.
- `evaluateExpansionTimeSpaceData(task: TaskDefinition, response: unknown): EvaluationResult`.

Dispatch families: `math.expansion.m08`, `math.expansion.m09`,
`math.expansion.m10`. Descriptors retain r1, a named assessed demand key and its
fixed meaningful source string. `canonicalQuestionId` remains the frozen
WP03-01A implementation. Do not derive new questions from option order,
coordinates, contentRevision, seeds, weeks or another response. Unknown/altered
tuples return unavailable-content. Controls are clock, sequence, choice and
exact whole-number quantity; no arbitrary string parser or coordinate grading.

## Exact proposals for WP03-13A

All rows are M2, sourceBindingId null. The exported lists, not prose abbreviations,
are authoritative canonical ID pools. Below, authored keys name their exact
members without repeating percent-encoded canonical strings.

| Binding ID | Skill/response/mechanic | Exact authored-key pool |
|---|---|---|
| q9-story-m08-clock | M08 / clock / object-manipulation | morning-hands; afternoon-conversion; elapsed-clock; latest-safe-service |
| q9-story-m08-sequence | M08 / sequence / sequencing | morning-event-order; mixed-period-order; two-day-event-order |
| q10-story-m10-data | M10 / choice / consequential-selection | read-attendance-table; joint-greatest-bar; combined-versus-single; largest-line-increase; equal-line-increases |
| q9-revisit-m08-quantity | M08 / quantity / object-manipulation | same-hour-duration; midnight-crossing; journey-with-wait |
| q4-revisit-m09-choice | M09 / choice / consequential-selection | triangle-boundary; north-quarter-clockwise; rectangle-right-angles; rectangle-symmetry; triangle-side-angle-classification; two-turn-map; rotated-square-symmetry; reverse-turns; alternating-turn-pattern; square-diagonal-pieces |
| q8-revisit-m09-choice | M09 / choice / consequential-selection | same ten M09 keys as q4-revisit-m09-choice |
| q10-revisit-m10-quantity | M10 / quantity / object-manipulation | two-session-total; bar-attendance-difference; target-shortfall; five-session-total; line-total-target |

The first three rows have role story; others revisit. WP03-13A must preserve
required within-quest order: Q9 clock then sequence. Q10 data goes after the
separate M07 goods binding and before E05 meaning. Every proposed pool has a
support task. Do not turn pools into compulsory sequences or rewrite nine M1 rows.

## Consumer observations to run after integration

For each case below, resolve canonicalQuestionId from the named key in the
frozen task array; stimulus and source-data alternative resolve through that
same task. These are proposed reproducible observations, not passed UI tests.

| Case ID / binding | Task and semantic response | Expected evaluation / evidence | Consumers |
|---|---|---|---|
| t08-clock / q9-story-m08-clock | morning-hands; `{kind:"clock",minutes:570}` | judged true / independent without help | WP02-10A, WP04-07A, WP06 |
| t08-clock-wrong / q9-story-m08-clock | morning-hands; `{kind:"clock",minutes:1290}` | judged false, clock-mismatch; one valid Check, no completion | WP02-10A, WP04-07A, WP06 |
| t08-sequence / q9-story-m08-sequence | morning-event-order; `{kind:"sequence",orderedIds:["breakfast","gates","bell"]}` | judged true / independent without help; completes only this binding | WP02-10A, WP04-07A, WP06 |
| t08-midnight / q9-revisit-m08-quantity | midnight-crossing; `{kind:"quantity",values:{answer:{numerator:20,denominator:1,unit:"minutes"}}}` | judged true / independent without help | WP02-10A, WP04-07A, WP06 |
| t09-turn / q8-revisit-m09-choice | two-turn-map; `{kind:"choice",choices:{answer:"south"}}` | judged true / independent without help | WP02-10A, WP04-07A, WP06 |
| t10-scale / q10-revisit-m10-quantity | bar-attendance-difference; `{kind:"quantity",values:{answer:{numerator:8,denominator:1,unit:"visitors"}}}` | judged true / independent without help | WP02-10A, WP04-07A, WP06 |
| t10-story / q10-story-m10-data | joint-greatest-bar; `{kind:"choice",choices:{answer:"ash"}}` (also oak) | judged true / independent without help | WP02-10A, WP04-07A, WP06 |

For each actual clock/geometry/chart control, submit the same semantic answer
through pointer and keyboard/tap paths and compare results. Test one partial
draft (empty map/sequence or null clock): incomplete, no judged observation.
Test an unknown option/event or out-of-domain value: invalid-response, no
judged observation. Mutated source metadata must be unavailable-content before
Check can be committed. After a wrong Check, use a hint or worked support and
retry correctly: sticky assistance remains, first-Check correctness remains
false, no independent-success claim. Math source narration is allowed and does
not assess reading. Save/resume and later review retain canonical identity and
the existing state/reward policies; this family emits no history or receipts.

## Verification and retained attempts

Run from the private candidate using the existing Node/runtime dependencies:

```powershell
node ../../../node_modules/vitest/vitest.mjs run --config vitest.config.ts --configLoader runner --no-cache --maxWorkers 1 --no-file-parallelism tests/learning
node ../../../node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --verbatimModuleSyntax src/content/expansion-maths/time-space-data.ts src/learning/evaluators/expansion-time-space-data.ts tests/learning/expansion-time-space-data.test.ts
```

F1 repair checks: 11 learning test files / 811 tests passed, including all 111 new
family tests; focused TypeScript passed. New tests enumerate all 1,440 clock
values for each clock task and independently specify thirty exact answers,
thirty rejected examples, bands, every chart dataset, both additional legitimate
choice answers, malformed controls and source/representation boundaries.

Retained logs outside the candidate: `focused-first.log` (config path resolved
twice; no test execution), `typecheck-first.log` (TS7 requires --ignoreConfig
for explicit files), `focused-second.log` (109 passed), `typecheck-second.log`
(union narrowing error), `learning-final.log` and `typecheck-final.log` (green
after explicit quantity narrowing), and final frozen-output verification logs
`learning-frozen.log` / `typecheck-frozen.log` after the source-attribution and
manifest-fixture completion. Those 809/109-test results predate F1. The content
demand failure, despite correct original grading, remains in the independent
review and the immutable F1 before snapshot. Fresh repair logs are
`f1-repair/learning-repair.log`, `f1-repair/typecheck-repair.log` and
`f1-repair/route.log`; structured actual original/replacement task routes are
in `f1-repair/route-results.json`. The first repair typecheck is retained as
`f1-repair/typecheck-repair-attempt-01.log`: adding labelled edges exposed the
diagram helper's overly broad union return annotation. Narrowing that annotation
to the existing diagram variant resolved the compile error without changing
runtime data or evaluation. Original/replacement routes and checks were rerun.

## F1 narrow semantic repair

The rejected original `triangle-perpendicular` was direct Year 3 pair
recognition, so its Year 4 core attribution was not defensible. Its complete
five-file freeze, manifest and independent validation report were copied to
`artifacts/wp03-08a-20261011/f1-repair/before`, `owned-files-before.json` and
`WP03-08A-VALIDATION-before.md` before any repair.

Its replacement is `triangle-side-angle-classification`, still M09 core, with
meaningful source parameter:

```text
triangle-ABC; AB4-BC5-CA3; A-top-left-B-right4-C-down3; classify-side-equality-and-angle-type
```

The new authored key/source produces a new canonical ID. The unpublished old
tuple is removed; there is no alias that changes its meaning. Both M09 revisit
pools and all associated manifest cases now reference the new ID. All 36
shipped starter identities and the other 29 family tasks remain unchanged.

The actual Year 4 demand is classifying a complete triangle using side equality
AND angle type. Four choices cover the combinations right/acute and
scalene/isosceles with child-readable definitions. Only `right-scalene` fits
the 3/4/5 side lengths and right angle at A; the two one-property distractors
prove that identifying a perpendicular pair alone is no longer sufficient.
Both source edge labels and accessible givens supply 4,5,3 units and the corner
arrangement without naming the answer. Two non-answer hints prompt the separate
checks and combining them; worked support explains the result. See the full
per-item review for the prompt/source/help assessment.

Fresh original route: load the exact retained before task and evaluator;
`ab-ac` still reproduces the historical judged-correct/core result that failed
the demand review. Feed that same old task to the new evaluator: unavailable
content. Fresh replacement route: validate the actual reconstructed task and
grade all four offered options; only right-scalene is correct. Partial and
malformed choices remain unscored; the old option ID is invalid for the new
task. New tests check independent 3/4/5 properties and old-ID removal from every
manifest/binding pool. All existing geometry, identity, domain and alternative
checks run in the complete learning suite. Independent recheck is still needed;
the author is not converting a green runtime check into accepted demand evidence.

## Review boundaries

The per-task [review](../../content-review/expansion-time-space-data.md) covers
sources, demand and all help/representation pairs. The author corrected triangle
recognition attribution to earlier Year 2 consolidation; repeated-turn stretch
is honestly mapped to additional reasoning using Year 3 content. It does not
claim a new statutory Year 4 repeated-turn objective.

Only author/content and pure-function evidence is delivered. Independent
review, WP03-13A assembly/dispatch, WP02 rendering/accessibility, WP04 save and
action compatibility, actual published play and deferred final acoustic review
remain downstream. There is no qualified educator or efficacy claim. Main
remains unmodified by this worker; hand off to the Controller, then idle.
