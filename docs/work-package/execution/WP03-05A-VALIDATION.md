# WP03-05A independent implementation validation

Review completed 9 October 2026. Reviewer: Codex, independent validator; not the implementation author on this scope.

**Verdict: ACCEPTED. Finding severity: NONE. Invalidated criteria: NONE.** Acceptance covers the pure starter catalogue, binding validation/queries, aggregate evaluator and educational handoff. Controller owns administrative acceptance and dependency release.

## Authority and scope

Read current [GLOBAL_RULES](../GLOBAL_RULES.md), [WP03-05A](../chunks/WP03-05A.md), the [implementation handoff](WP03-05A-HANDOFF.md), all three production assembly modules, both scoped tests and the complete [starter handoff](../../content-review/starter-handoff.md). Reused this reviewer's accepted learning/maths context and the accepted punctuation/policy validations, including their correction boundaries. Inspected the actual family validator/manifest and resolver/selector/evidence APIs where necessary to verify assembly and scenario meanings.

Read the human-approved [MUSIC-REVISION](MUSIC-REVISION.md); it supersedes original-only music wording. The educational handoff correctly retains the accepted Market on the Sea/Sunset Walk selection and the remaining audio/control/listening owners, without treating numeric checks as heard quality. No audio review was repeated here.

Review began at HEAD `06603af3835023a6412b034c05d4b74a4112b8cc`; Controller integration advanced HEAD to `33ca3bc7209a9697b54f53ff51698b4c7ece83e1` during the review. The assembly files remained uncommitted/untracked and are identified by the snapshots below. This validator writes only this report and preserves unrelated music/scoring/status work.

## Acceptance assessment

| Criterion / contract | Independent conclusion |
|---|---|
| Actual producer integration and immutable catalogue | PASS. The bank clones the actual 12 bridge, 12 merchant and 12 punctuation records, recursively freezes its own objects and publishes 36 unique validated canonical tasks. Full-bank count/validation failure exposes no usable bank. getTask/listTasks expose delivered records only; nonempty filtered subsets can be validated. Only M01/M04/E06 support is delivered; other skills and core/stretch are honestly unavailable. Family content and policy are imported rather than reauthored. |
| Reconstruction, review and fail-closed content gate | PASS. Catalogue validation checks ID reconstruction/uniqueness, delivered family/reference, domain validation and equality of reviewed objective/source/prose/help/narration/attribution fields. Altered approval or worked prose cannot bypass the gate. Empty/sparse/malformed banks and unknown tasks produce issues. Compatible revisions and semantic punctuation control order preserve canonical identity; exact retained revision resolution remains WP04-owned. |
| Exact nine bindings and fixed anchors | PASS. All nine signed rows are M1. Q1/M01 binds only total-12, Q2/E06 only spellbook-anchor and Q3/M04 only mult-2.pears-3. Each transfer has its corresponding singleton story source and the other eleven tasks; each revisit has all twelve. Primary skill, response and mechanic match the accepted table. Released meaning/pool changes, missing/duplicate rows, wrong task/quest/role/mechanic/source, source inclusion and retrospective M2 required work on Q1–Q3 are rejected. |
| Required queries and permanent source proof | PASS. Required IDs are the admitted story rows, with M1-only admission in M1 and both availabilities in M2. Completion requires a nonempty set and every required ID; missing/empty sets and optional IDs cannot pass. Actual resolver/selector flows for all three transfers derive the excluded source canonical ID from the singleton source row and permanent completion, with empty canonical history and no source encounter. Source-incomplete and route/quest mismatch are truthful unavailable results. No required fact, quest or award is written here. |
| Aggregate dispatch and status boundaries | PASS. Content validation precedes dispatch to the accepted family evaluators. Actual bridge sums, both equal-credit spellbook endings and both merchant constraints retain their producer outcomes. Empty permitted responses are incomplete, malformed/out-of-bound responses invalid, content faults unavailable, and only complete permitted responses judged. Recovery tags contain neither correctness nor points. Dispatch accepts no UI score/world patch and computes no reward. |
| Selection, assistance and immutable resume provenance | PASS. Fresh required routes select their fixed anchors with story provenance. Transfers/revisits stay optional; same canonical work does not relabel a retained encounter when a required route is requested. Zero-Check hinted and one-Check wrong resumes preserve original encounter/reason/provenance and candidate none. Fresh/struggling/ready-with-no-harder-band/exhausted starter histories use the actual accepted policy with honest unavailable-band/familiar-repeat results. Candidate none on resume does not cancel an existing reward opportunity. |
| Evidence and civil review oracles | PASS. Wrong Check → deliberate finish → resumed supported success yields two cumulative Checks, two completed episodes, zero independent, one supported and one retry success. Finish adds no Check; navigation adds no observation. Same-week educational review has candidate none; eligible later-week review keeps canonical identity and an advisory later-week candidate, with +3/+7 civil dates. Skip/suppression leaves evidence unchanged. Mixed M04 and contextual-only skills retain their accepted evidence meanings. |
| Downstream scenarios and ownership | PASS. All seven stable scenario IDs contain exact educational inputs/results, routes/provenance, assistance and permanent-completion expectations. Six story/transfer offers are examples rather than compulsory completion of the 36-task bank. Commit/save/reload, duplicate/stale/failure handling, required story writes, rewards and acknowledged celebrations are explicitly WP04/WP02 oracles; WP06 alone accepts the published journey. The audio amendment and remaining listening obligations are correctly incorporated. |

The scenario oracles were checked against the actual scoped fixtures and producer contracts:

| Stable case | Checked educational expectation / downstream boundary |
|---|---|
| M1-BRIDGE | Three alternative exact-12 constructions pass one identity; under/over, incomplete and malformed cases retain distinct tags. Only acknowledged story success can add q1-story-m01/Q1. |
| M1-SPELLBOOK | Both question=? / discovery=. or ! yield equal whole-task results; one required success, no per-slot grant or pre-Check modelling through neutral narration. |
| M1-MERCHANT | (6,3) correct; (5,4) relationship only, (4,2) total only, (2,2) both wrong. Mixed M04 does not independently assess contextual M02/E08. |
| M1-TRANSFER | Source compaction leaves permanent singleton proof sufficient for a distinct transfer; no optional success supplies required completion and skip makes no command. All three actual fresh transfer choices are verified. |
| M1-HELP-RESUME | Original revisit provenance/help/opportunity and zero/one prior Checks survive a newly requested story route; existing optional work cannot be relabelled as required. |
| M1-FINISH-RESUME | One wrong Check plus completion-only finish, then ordinal-2/cumulative-2 correct Check, produces the exact supported retry summary while retaining provenance/help. |
| M1-DUE-REVIEW | 23 October → 26 October, independent review → 2 November; same-week review remains noncompetitive and suppression leaves evidence unchanged. WP05 owns final eligibility/allocation. |

## Independent verification

Used bundled Node at `C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`, with command-process `NODE_DISABLE_COMPILE_CACHE=1`.

- Fresh `node node_modules/vitest/vitest.mjs run tests/learning/catalogue.test.ts tests/learning/evaluate.test.ts -t '^(?!.*dispatches producer case)' --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism` — **two suites, 48 tests passed; 117 producer-manifest dispatch cases deliberately skipped**. These fresh checks cover actual assembly/binding faults, required queries, pure integrated scenarios, anchor alternatives, aggregate recovery and compatible presentation order.
- Fresh `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node --verbatimModuleSyntax tests/learning/catalogue.test.ts tests/learning/evaluate.test.ts` — **exit 0**.
- Reused the author's **165 passing assembly checks**, including all **117 actual producer-manifest dispatch cases**, and final **nine-file / 678-test relevant regression**. Inspected both manifests/reference coverage and the exact final command; no broad application or repeated full producer suite was needed.
- Independently executed the four read-only counterexample groups below through actual production functions, loading TypeScript modules into an in-memory Node VM. **All four passed**. No probe/test/source/configuration/dependency/cache file was written.
- Fresh owned-file trailing-whitespace/conflict-marker scan — **zero offending lines**. Final status inspection preserves unrelated work. No commit, worker, delegation or other-chat message was performed.

| Independent counterexample | Expected / observed result |
|---|---|
| Coherently change Q1's anchor to delivered total-6 and rebuild its eleven-task transfer pool to exclude that new anchor | Binding validation still rejects released-pool-mismatch; consistent arithmetic/source links cannot rewrite the signed required anchor. |
| Delete one hint from an otherwise copied approved bridge task while supplying a correct answer | Aggregate evaluation returns unavailable-content without a correctness judgement; sparse help cannot become learner error. |
| Resolve/select/evaluate correct Q3 merchant work, then apply an observation with accepted mixed evidence mode and no answer help | Actual evidence/summary reports one Check/episode, zero independent and one supported success; M02/E08 gain no evidence. The committed adapter must supply that mode. |
| Resume saved hinted revisit work for a fresh Q1 request, then mutate the returned provenance to story | Original saved input remains byte-for-byte unchanged, with old provenance/reason/encounter and candidate none before the attempted mutation. |

The first probe-loader attempt stopped before assertions because installed TypeScript 7's package exposes version metadata rather than the older transpileModule API. Switched only the transient harness to Node's built-in TypeScript transformation/VM loader; the four production counterexamples then passed. No implementation failure or dependency change resulted.

Reviewed lowercase SHA-256 snapshots:

| File | SHA-256 |
|---|---|
| `src/content/catalogue.ts` | `d1735732a704f8c4d61397bca98d63641b637d4adbfd5bcd202a47bc234d9d61` |
| `src/content/quest-bindings.ts` | `54d463d90d54a45df78acacd06446be6db11795532b4bcda27634bef2193c4de` |
| `src/learning/evaluate.ts` | `a7bc3913419bbe8c9e9aabf684bea65bcd89529cb98174e83452fbfc6b793339` |
| `tests/learning/catalogue.test.ts` | `4761acfa497fca04091476312fe1ade45a07eba9d40196229ea81b6b97d28f52` |
| `tests/learning/evaluate.test.ts` | `94d8dfdffdea76e925f57d5fe63b88208eac95cf6f62bea289cdc830bc19c134` |
| `docs/content-review/starter-handoff.md` | `7bdeaf78eea5a6a835a15490b827a211dcd4449be188629c33d7749fc87634cd` |

This closes the pure educational assembly handoff. Atomic story/learning/reward application, actual controls and committed projections, save/reload/compaction, audio and published PC/tablet play retain their assigned downstream acceptance owners. WP03-13A later extends these same assembly files serially after the M1 gate.
