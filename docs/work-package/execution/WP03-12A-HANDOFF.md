# WP03-12A candidate handoff

Status: implemented and author-reviewed; focused verification green; **awaiting independent review**. No integration, state/UI/save/published acceptance, detailed listening, educator review or efficacy claim.

Base: `2f6a7fc8474e1301a8c1129e8430273af275a88d` (accepted `main` at dispatch). Private git-archive candidate: `artifacts/wp03-12a-20261011/candidate`. Main source/build/Git/deploy remained read-only. No new workers, other-chat messages, install, automatic setup or shared dependency writes. Existing direct Node/Vitest/TypeScript executables were used; test cache and TypeScript buildinfo live in this lane's artifact directory outside the candidate. No Git patch is required under the Controller's delivery simplification.

## Frozen delivery

Exactly these five new files are owned and delivered:

1. `src/content/expansion-english/reading-writing.ts`
2. `src/learning/evaluators/expansion-reading-writing.ts`
3. `tests/learning/expansion-reading-writing.test.ts`
4. `docs/content-review/expansion-reading-writing.md`
5. `docs/work-package/execution/WP03-12A-HANDOFF.md`

`artifacts/wp03-12a-20261011/manifest.json` records the base, relative path, byte length and lowercase SHA-256 for each final file. Controller can verify and copy only those files. It intentionally does not hash itself. There is no whole-archive/dependency preservation audit or unrelated source delta in this delivery.

## Capability and exports

Thirty original finite tasks: E08 retrieval/instructions, E09 joint inference plus supporting clue, E10 narrative sequence/complete editing alternatives. Each skill has exactly four core, three support, three stretch records. Five sequence tasks cover simple dependencies, independent middle events and two interleaved chains; five edit tasks include legitimate alternate formulations. Ten E09 tasks have sixteen accepted pairs, including all three sufficient clues for the limited rain-gauge claim. Thirty passages have distinct assessed meanings, not name/option-order variations.

Frozen signatures: `READING_WRITING_TASKS: readonly TaskDefinition[]`, `READING_WRITING_MANIFEST: TaskFamilyManifest`, `evaluateExpansionReadingWriting(task: TaskDefinition, response: unknown): EvaluationResult`, `validateReadingWritingTask(task: TaskDefinition): readonly ContentIssue[]`.

Family ID `english.reading-writing`, equivalence `r1`, authored keys with no generated parameters. Full IDs are in the manifest export. Reconstruction is direct membership in the frozen task bank; no generated task API is needed. Canonical identity and answers survive option/tile presentation order and cosmetic content revisions. Deeply frozen content/dispositions and strict lossless finite-JSON comparison reject non-finite numbers, unsafe numeric coercion, sparse/extended arrays, undefined, non-plain objects, symbols, accessors and cycles. Content defects return unavailable-content; wrong kind/unknown or duplicate IDs return invalid-response; known partial work is incomplete; only complete in-domain responses are judged. E09 is one primary objective/result with no clue credit or extra reward.

Additional exports:

- `READING_WRITING_BINDING_PROPOSALS`: real support-accessible story pools for `q7-story-e10-sequence` (five sequence tasks) and `q8-story-e08-clue` (ten retrieval tasks); optional M2 revisit rows `q7-revisit-e10-choice`, `q8-revisit-e09-choice`, `q10-revisit-e10-choice`. Exact WP03-13A naming, role and sourceBindingId conventions are retained.
- `READING_WRITING_HANDOFF_CASES`: nine exact resolved case records with required case/binding/canonical/response/status/correctness/evidenceMode/consumer fields plus explicit assistance and scenario. These cover real-control expectations, incomplete/wrong clue, alternatives, source read-aloud, hints and worked-help reload.
- `READING_WRITING_DISPOSITIONS`: post-Check specific rejection explanations only, never neutral narration or source alternatives.

The item review document supplies all thirty source/demand/identity/help reviews, all E09 3×3 matrices, all retrieval/edit alternatives, and exhaustive sequence disposition through independent narrative dependencies. The official English source was checked on 11 October 2026. Support/core use Years 3–4; selected higher viewpoint/editing demand explicitly uses Years 5–6. The tests' textual/answer matrices were authored separately from production rules, but independent-person review remains outstanding and is not claimed by `review.status: approved`.

## Verification and retained failure

Final focused result: **101 tests passed** in the sole owned test file. The answer-space oracle covers 318 complete responses: 30 retrieval options, 90 inference/clue combinations, 180 sequence permutations and 18 complete edits. It accepts 45 complete alternatives and rejects the other 273. All 308 proper ordered tile subsets remain incomplete; tests also cover one-slot E09 work, unknown IDs, duplicates, malformed/lossy task and response data, binding references, bounds, identity, help, and fresh reordered JSON reconstruction.

Pure consumer fixtures pass actual owned-task evaluation into the accepted learning and reward APIs. They establish one E09 skill/episode, listening-supported evidence without ordinary-point reduction, neutral instruction semantics, sticky answer help over a wrong Check and later success, and ordinary answer plus one success receipts. These constructed observations/opportunities do not prove the live state adapter.

Final scoped TypeScript check: **passed**. Relevant imported frozen contracts/policy dependencies are included by normal module resolution; no full application build or broad suite was run.

Retained logs outside the five-file candidate: `focused-first.log` (99 tests passed before two later focused tests), `typecheck-first.log` (TS2538 in the malformed-symbol **test fixture**), `focused-final.log` (101 passed), `typecheck-final.log` (clean). The fixture used a string-indexed record with a symbol index; changing it to `Object.defineProperty` corrected the typing without changing production behaviour. The complete owned task→evaluation suite was rerun after the correction and final content clarifications. Author review also clarified seed watering chronology, kite spotting chronology and explicit bag ownership, and retained the legitimate limited-observation clue for the rain-gauge item.

Reproduce from the candidate using the existing Node executable and repository dependencies, without package-manager setup:

```text
node <main>/node_modules/vitest/vitest.mjs run --config <lane>/vitest.config.ts --configLoader runner
node <main>/node_modules/typescript/bin/tsc -p <lane>/tsconfig.json
```

Here `<lane>` is the absolute `artifacts/wp03-12a-20261011` directory; both private configs are retained there. They set private cache/buildinfo/output and scope checks to this family. The final manifest is the authoritative byte freeze.

## Required downstream work and limits

WP03-13A imports the family and adds central catalogue/dispatch/binding rows serially, preserving all 36 M1 identities and nine M1 bindings. None of those shared files changed here. Optional revisit success cannot replace a required story binding, and Q7/Q10 reuse cannot mint a new task identity.

WP04-07A must implement objective-specific assessed-reading narration qualification: the frozen M1 adapter currently preserves its existing evidenceMode when recording source narration. For this family, source passage/tile/answer-relevant text read-aloud must be retained as listening-supported; instruction narration stays neutral. Explicit hints/worked support remain sticky and qualified success does not become independent reading evidence. Actual atomically committed history, reward caps/week rules, drafts, save/reload, old M1 compatibility and same-canonical help across routes are downstream checks.

WP02-10A must demonstrate accessible controls and narration roles, treating sentence tiles and other assessed textual material as source content, separating worked explanations from source alternatives, and persisting assistance before speaking/showing it. WP06 must exercise those routes on the actual published PC/tablet candidate and perform the deferred final listening checks. E10 remains bounded composition/editing; extended essays and proficiency claims remain excluded. The candidate is ready to remain idle for independent review.
