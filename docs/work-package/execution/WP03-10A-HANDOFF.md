# WP03-10A handoff — contextual word classes and clauses

Author: Codex WP03-10A worker, 11 October 2026. Status: F1 repaired and refrozen for narrow independent recheck; no integration, educator approval, efficacy or milestone acceptance claim. Controller remains the integration authority. Work followed the [authorized continuation](CONTINUATION-AND-MUSIC-VARIATION.md); final listening is still deferred.

## Candidate and owned delivery

Private git-archive candidate from accepted main **2812863ec610cb92ecc508601d7adc436f227887**:
`artifacts/wp03-10a-20261011/candidate/`.

Exactly five deliverable files:

1. `src/content/expansion-english/grammar.ts`
2. `src/learning/evaluators/expansion-grammar.ts`
3. `tests/learning/expansion-grammar.test.ts`
4. `docs/content-review/expansion-grammar.md`
5. `docs/work-package/execution/WP03-10A-HANDOFF.md`

`artifacts/wp03-10a-20261011/owned-files.json` freezes their lowercase SHA-256 hashes and byte lengths. Controller may copy the verified five files directly; no Git patch is required. No main source, central catalogue/bindings/dispatcher, contracts, UI/state/world, assets, dependencies or shared cache were changed by this worker. No main build, commit, deployment, new worker or other-chat message was issued. Existing dependency files were read by direct Node tools; all caches, buildinfo and logs are private to the artifact directory.

## Exported capability

- `GRAMMAR_TASKS: readonly TaskDefinition[]`: twenty original tasks, each E04/E05 **4 core + 3 support + 3 stretch**. Ten sorting, two sequencing, eight choice tasks. Every task has one exact primary objective, official source/section, actual demand rationale, stable authored identity, finite response/answer domain, explanation, two conceptual hints, worked support, narration roles and author-review provenance.
- `GRAMMAR_MANIFEST: TaskFamilyManifest`: exact task IDs, family IDs `english.expansion.e04` / `english.expansion.e05`, cases and review reference. `retainedTaskIds: []`; E04/E05 had no starter items. All starter files and identities remain untouched.
- `validateGrammarTask(task: TaskDefinition): readonly ContentIssue[]`: finite reviewed membership, canonical reconstruction and full source/answer/help/record consistency. Presentation control order and a positive content revision can vary without new identity. Non-finite values, holes, undefined, symbols, hidden/accessor fields and cycles are rejected before normalization can lose their types. Unreviewed/malformed records are unavailable content.
- `evaluateExpansionGrammar(task: TaskDefinition, response: unknown): EvaluationResult`: exact item/group, tile and slot/choice IDs. Invalid domain/type/duplicate IDs are invalid-response; missing/null valid drafts are incomplete; full in-domain incorrect responses are judged false. All legitimate finite alternatives are accepted equally, including fronted subordinate clauses, synonymous joins and omitted relative pronouns. No text parser, universal word classifier or answer normalization is used.
- `GRAMMAR_BINDING_PROPOSALS`: six typed rows, for serial WP03-13A integration only.
- `GRAMMAR_HANDOFF_CASES`: seven compact exact case/binding/canonical/response/result/evidence-mode/consumer expectations. Scenario facts and downstream obligations are in the review document.

Both required pools are support-accessible: `q6-story-e04-sort` contains all ten E04 sorting records; `q10-story-e05-meaning` contains all eight E05 choices. Optional proposals are `q6-revisit-e04-sorting`, `q7-revisit-e05-sequence`, `q7-revisit-e05-choice`, `q10-revisit-e05-choice`. All use M2 and null sourceBindingId. Q7 grammar remains optional. No prerequisite lock, full-bank quota or extra quest is introduced.

## Review and verification

[The content review](../../content-review/expansion-grammar.md) independently records every selected word's role in its supplied sentence, every offered choice, all six orders for each sequence and all four two-join combinations. It distinguishes grammatical but wrong-meaning alternatives, identifies real band demands, cites the retained official DfE programme plus linked appendix/glossary, and states original provenance and reviewer limits.

The focused suite now passes **84/84 tests**, including **1,197** complete in-domain responses independently classified by separately authored fixtures (**27 correct; 1,170 wrong**). It also covers partial, duplicate, unknown and malformed responses; finite/type integrity in reconstructed content; contextual repeated-word IDs; counts/identity/source/band constraints; actual manifest and binding exports; narration/help flags; fresh JSON reconstructions with reversed presentation order and revision 2; and both real fresh sequence drafts through reducer edits and evaluation. Tests do not infer expected correctness from production answerRule.

Direct checks from repository root:

```text
node node_modules/vitest/vitest.mjs run --config artifacts/wp03-10a-20261011/vitest.config.mjs --configLoader runner
node node_modules/typescript/bin/tsc --project artifacts/wp03-10a-20261011/tsconfig.json
```

Post-F1 focused family test exit **0** and scoped strict TypeScript exit **0** are retained in `focused-f1-family.log` and `typecheck-f1.log`. The latter checks the two owned production modules and the owned test plus their relevant frozen imports, now including the actual draft/reducer module, with private incremental buildinfo. Original `focused-final.log` and `typecheck-final.log` remain historical pre-F1 evidence. No broad app build, browser suite or unrelated family rerun was performed.

Failed-attempt evidence remains in `typecheck-first.log`: the first compiler check rejected inferred heterogeneous manifest-map unions because absent properties became optional undefined in TypeScript's inferred type. This was a bounded declaration defect, not a grammar/evaluation failure. Explicit generic types on the two freeze calls preserve the frozen DTOs; the original whole grammar export/evaluation suite and scoped compiler were rerun successfully. `focused-first.log` preserves the initial 82-test pass. A rejected patch invocation with duplicate target headers made no changes; the corrected single-header patch applied normally. During initial prose review, the gardener options were made explicitly restrictive with “Only”; all associated answer matrices were updated and the entire focused suite was rerun. The subsequent independent F1 finding and causal repair are retained below.

### Independent finding F1 and bounded repair

[Independent validation](WP03-10A-VALIDATION.md) confirmed both sequence trays initially opened solved: `wait,because,flood` and `pack,before,leave`. `createDraft` preserves authored tile-array order, and an untouched `toResponse` was judged correct. The defect belonged to authored presentation order, not the accepted grammar sets or interaction machinery.

Only those two production arrays changed: the new starts are **`flood,because,wait`** and **`leave,before,pack`**, both complete but wrong for the specified relation. Tile IDs/labels, all four accepted arrangements, authored keys, r1 descriptors, revisions and canonical IDs remain unchanged. The evaluator is byte-identical to the initial freeze. No central or UI module changed.

Added two regressions using actual `createDraft`, `reduceDraft` and `toResponse` exports. Before repair they both failed because fresh Check was correct (`focused-f1-red.log`). After repair both fresh responses are judged false; each accepted alternative is reachable by both Earlier and select/Place-before actions. Correct restored drafts still pass without forced extra interaction. Targeted retest: **2/2**, `focused-f1-green.log`; complete family rerun: **84/84**, `focused-f1-family.log`; scoped TypeScript: **exit 0**, `typecheck-f1.log`. Existing complete answer-space oracles were retained, with only their expected initial tray order updated.

`owned-files-before-f1.json` and `grammar-before-f1.ts` retain the prior freeze and original source. The current `owned-files.json` refreezes exactly the same five deliverables. Independent narrow recheck is pending; prior contextual grammar, malformed-input and support-accessibility PASS findings are not reinterpreted as acceptance of this repair.

## Downstream limits and next step

WP03-13A imports the named exports and integrates the central bank/dispatcher/bindings serially, preserving all M1 records and nine binding identities. The validator intentionally rejects substantive alterations to a reviewed authored record; those return to this owner for review rather than silently generating new content from changed parameters.

WP02-10A must exercise actual keyboard/tap sorting, sequence and choice controls through Check and preserve all equivalent answers. WP04-07A must demonstrate actual commit/save/reload, permanent binding completion, first-Check history, sticky help and familiar/review/reward identity. Neither alternate answers, revisits nor revision changes create fresh canonical opportunity. The E04→E05 prerequisite remains a suggestion only.

Neutral narration is ordinary instruction/control access. Assessed context/options may be read faithfully before Check as listening support, without filling blanks, selective answer emphasis or explanatory category labels. This does not count as answer help. Explicit hints/worked support do count as sticky answer help; independent reading mode may coexist with a supported success. The test uses the actual frozen `usedAnswerHelp` export to verify this distinction, but does not claim real saved or audible behavior.

WP06 owns published interaction and final acoustic acceptance. This lane makes no browser/published UI, persistence, audio safety, full-writing proficiency or educational efficacy claim. Refrozen delivery is ready for the same reviewer's narrow F1 recheck; the author is idle pending findings.
