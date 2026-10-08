# WP03-01A independent implementation validation

Date: 8 October 2026. Reviewer: Codex, independent validator; not the implementation author on this scope.

**Verdict: ACCEPTED after the narrow F01 correction recheck. Open findings: NONE.** The learning DTO, canonical identity, registry, import direction and fixture criteria pass at this early handoff boundary. The original P2 curriculum-reference finding and its closure evidence are retained below. Controller owns administrative acceptance and dependency release.

## Authority and reviewed scope

Read [GLOBAL_RULES](../GLOBAL_RULES.md), including current execution authority, [WP03-01A](../chunks/WP03-01A.md), its named decisions in [DECISIONS](../DECISIONS.md), the [implementation handoff](WP03-01A-HANDOFF.md), retained Stage 6 learning findings and the accepted foundation validation. Reviewed the current three production leaf modules, two focused test files and [registry review record](../../content-review/registry.md), over foundation `1916da9` and test-discovery correction `e881253` (current HEAD `e881253f3c1ad6841cc7ef2f9248ceae78999939`). WP03-01A implementation files are currently uncommitted/untracked.

Read the relevant counterpart specifications solely to check the exact producer interfaces consumers will import: WP03-02A/03A/04A, WP04-01A, WP05-01A and WP02-09A. Their later runtime implementations are not prerequisites. This validator changes only this report; production, shared package/status documents and Git history remain untouched.

## Initial finding — resolved

### F01 — [P2] Correct M08's Year 5 timetable programme section

**File:** `src/content/skills.ts`, line 16, M08's second curriculum reference.

**Initially observed:** the Year 5 selected-stretch timetable mapping declared `section: 'Measurement: timetables'`. The retained [DfE mathematics programme, Year 5 Statistics](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-5-programme-of-study) places the timetable objective under **Statistics**. Year 5 Measurement covers time-unit conversion, but does not contain this timetable objective. The source was inspected at that specificity, including both neighbouring sections.

**Required correction:** cite `Statistics: tables and timetables` (or the actual `Statistics` heading with an equally clear timetable qualification) for this Year 5 reference. Retain M08's Years 3–4 Measurement/time reference and its accepted selected timetable scope. No DTO, skill count, difficulty-band, dependency or product-scope change is needed.

**Initially invalidated requirement:** WP03-01A Exact scope item 1's objective/programme references, the SkillDefinition producer's source URL/programme-section meaning, and the Evidence required skill/objective/source registry. This was a false source mapping in a required producer deliverable, rather than missing later item review. Consumers using the exported registry would have inherited the wrong programme section. At initial review, the tests only checked that section strings were nonempty, so their passing result did not detect it.

**Recheck:** inspect the corrected M08 reference against the retained primary source and its review record; verify any affected focused assertion. The passing unrelated DTO/identity evidence below can be reused. This report does not make the correction or release dependent work.

**Disposition: RESOLVED.** The author subsequently corrected the source section and supplied an updated handoff. The narrow independent recheck at the end of this report restores the affected requirements.

## Contract and outcome assessment

| Area | Result and independent assessment |
|---|---|
| Readonly JSON producer DTOs / DEC-017/022 | PASS. Contracts are readonly semantic data; the nine response kinds use bounded numeric/ID facts through their response specs, with exact rationals available for quantities. The four evaluation tags distinguish unscored recovery from judged correctness/objective/band/justified feedback. Task records retain descriptors separately from content revision, primary versus contextual skills, curriculum/demand fields, two hints, worked support, narration and honest review disposition. Manifest fields match the family handoff. Numeric/domain enforcement remains with assigned family/state validators. |
| Lifecycle and assistance / DEC-024/025 | PASS. The common observation facts and separate episode-local/cumulative indexes match the producer specification. A wrong Check has null completion; a correct Check completes success in that event. Deliberate finish has neither submission nor Check indexes. The serialized wrong → finish → episode-2 success example retains original first-Check failure and sticky help. Instruction narration, assessed-text listening/mixed evidence and answer-relevant help are separate concepts; no points or ability percentages appear. WP04 still owns valid event construction, deduplication and authoritative lifecycle. |
| Representation / DEC-029 | PASS. All five stimulus variants reproduce the exact producer fields, including clock face/day offset and diagram edge IDs/labels. Coordinates occur in stimuli, not responses. Reviewed fixture alternatives agree with their supplied source data and do not add computed answers. Absent/null text-only tasks serialize. Counterexamples include zero denominator, missing endpoint, analogue/24-hour mismatch, invalid scale, discriminant and empty alternative. These bounded probes are explicitly fixtures, not a universal production validator or reviewed bank. |
| Binding and consumer construction / DEC-034 | PASS. Binding, provenance, fresh route, resolved intent and unavailable result fields match the accepted producer definitions. Quest IDs stay strings without importing later experience types. The experience/state/reward construction fixture imports learning DTOs directly, preserves canonical versus encounter/opportunity/submission identities and first-encounter versus later-review candidate meaning. SelectionRequest and SelectionResult also match WP03-04A's exact consuming specification; selection does not allocate opportunities. Resolution, immutable persistence, permanent binding completion and catalogue validation stay with the assigned later chunks. |
| Canonical identity / DEC-008/010 | PASS. Literal expected strings pin all three anchors and a non-anchor encoding. Bridge target and merchant multiplier/pear parameters reconstruct the intended numerical task; punctuation's two accepted endings retain one authored identity. Sorted typed JSON tuples preserve parameter boundaries/types for other families. Arrangements, cosmetics, content revision and week stay outside the descriptor; substantive parameter/version changes change identity. Invalid anchor parameters and nonfinite/noninteger generated values reject. Generic family authors must still establish complete meaningful descriptors and reviewed equivalence changes; the utility does not infer educational equivalence or decode content. |
| Registry / DEC-007/009 | PASS after F01 recheck. Exactly M01–M10/E01–E10, twenty distinct objective IDs, accepted M1 staging and eight correct acyclic suggestion edges are present. Registry bands are declarations; the empty delivered catalogue fixture demonstrates no content delivery. Earlier English consolidation and official Years 3–4/5–6 bands are correctly acknowledged. M08 now correctly attributes the selected Year 5 timetable reference to Statistics. |
| Import direction | PASS. Manual source inspection agrees with the focused import check: contracts has no imports; identity and skills import only learning types. No state/reward/experience/UI implementation, renderer, database or browser global is imported. Only the accepted foundation is an upstream implementation prerequisite. |

The retained [DfE English programme](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study) and its [grammar/punctuation Appendix 2](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/335190/English_Appendix_2_-_Vocabulary_grammar_and_punctuation.pdf) support the band distinction and explicitly revisiting earlier terminology/end punctuation. Registry review attribution is honest: Codex contract review, not educator approval or educational-efficacy evidence. Retained H5P/Perseus/mathjs decisions were reused; no blanket library/research assessment was repeated.

## Verification evidence

- Fresh focused fixture typecheck: bundled Node with `node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/learning/identity.test.ts tests/learning/contracts.test.ts` — **exit 0**, including the four negative type examples.
- Fresh `node node_modules/vitest/vitest.mjs run tests/learning/identity.test.ts tests/learning/contracts.test.ts` — **2 suites, 50 tests passed**. This confirms discovery under `e881253` and current executable fixture evidence; it does not establish source correctness by itself.
- Reused the author's successful project `tsc -b` and whitespace evidence after inspecting the current project/discovery configuration. No broad application/browser/save/reward acceptance run was warranted for this contract-only scope.

Initial reviewed production SHA-256 snapshots, lowercase (the corrected registry snapshot is recorded below):

| File | SHA-256 |
|---|---|
| `src/learning/contracts.ts` | `299c0937a6dcb5c78282b38707001e600e1a2fbe1bddd8d53f893802c380a9ff` |
| `src/learning/identity.ts` | `64cc247f6dd7cfcfc37a0f47d3f7b74e46fd242d6b8d4c9bc8c36a5d772ddc92` |
| `src/content/skills.ts` | `27fd06e17d5a805a08345769d75c0bda5e7821b36389624e42673162a01a8ba7` |

No other concrete implementation finding was identified on the assigned scope. Later actual task review, runtime validation/selection/evaluation, durable integration and published play remain their owning chunks' acceptance work.

## Narrow correction recheck

Date: 8 October 2026. **ACCEPTED. F01 closed; open findings and invalidated criteria: NONE.** Reviewed the author's completed correction handoff, corrected registry/review record and new fixture assertion. The validator still writes only this report.

`src/content/skills.ts:16` now cites `Statistics: tables, including timetables` for M08's selected Year 5 stretch. Its Years 3–4 Measurement/time reference, skill identity, staging and demand rationale remain unchanged. `docs/content-review/registry.md` records the exact attribution and source recheck; `tests/learning/contracts.test.ts:207` explicitly asserts the corrected source URL/section/year. This agrees with the primary-source section already inspected during initial review.

Fresh independent `vitest run tests/learning/contracts.test.ts -t 'selected curriculum registry'` passed **3 affected registry/import-direction tests**; **28 unrelated tests were intentionally skipped**, not newly rerun. The focused fixture TypeScript command above again returned **exit 0**. Reused the earlier independent **50-test** run for unaffected contracts/identity behavior and the author's project typecheck evidence.

Contracts and identity production hashes are unchanged. Replacing only the corrected section string with its initial value in memory reproduces the initial registry SHA-256, confirming that this attribution is the registry's sole production change. Corrected `src/content/skills.ts` SHA-256: `2c0bf14a1f52088b504a686f57879c4602c6e1daf0f30056501350dc64d3d2ec`. All original contract and import-direction conclusions remain valid. Administrative acceptance and dependency release remain Controller-owned.
