# WP03-09A independent candidate validation

Date: 11 October 2026. Reviewer: independent Codex English-content review chat,
not this candidate's author or a qualified educator.

**Verdict: PASS after demand-repair-1 recheck. F01/F02 RESOLVED. Open findings: NONE.**
The four substantive replacements supply the missing core/stretch demand while
preserving legitimate alternatives and support access. The other 26 records and
evaluator are unchanged. The original rejection and its evidence remain below
as history; the final section records current identities, hashes and independent
recheck results. Controller retains integration and administrative authority.

## Original frozen scope and authority

Reviewed `artifacts/wp03-09a-20261011/candidate`, baseline
`93010690bc9d82f050476079ddd8f018117c944a`, against its parent `owned-files.json`.
Fresh byte/hash verification matched all five owned files and the patch's exact
five path headers. Candidate source and all shared files were read-only.

| Owned file | Verified SHA-256 |
|---|---|
| `src/content/expansion-english/words.ts` | `d8aad250ff7ada0c83edf77660c9b0ff312c10c5609e36de326fcdbe9f8a4561` |
| `src/learning/evaluators/expansion-words.ts` | `d09ddac191a57f4356e28ce0c7d421a84953f2330d7ed9ded954ab3dd5704f64` |
| `tests/learning/expansion-words.test.ts` | `9bd7264418dc08dfd9ccc112b5a7c7c6d22dcd9a5ac0be2025fafaf93f1dffbb` |
| `docs/content-review/expansion-words.md` | `5cab580d8da7e94cbfc859f44dd266a7bb93f3468dc7a5515fa4b8be362747a4` |
| `docs/work-package/execution/WP03-09A-HANDOFF.md` | `0f8ac52bba47b96373101ffcb68bdfeef3de172a51316d2363d56086cd2695ef` |

Read the governing WP03-09A chunk, candidate handoff/review/source/tests, frozen
learning DTO/identity/registry/selection/assistance contracts, WP03-13A binding
requirements, and current continuation authority. M2 continuation is authorized;
listening is deferred, not passed. No whole archive/dependency audit was repeated.
Prior WP03-03A acceptance and resolved M1 findings are untouched.

## F01 — [P2, resolved] Original E02 core/stretch demand shortfall

The following records the original failure and required correction. See the
demand-repair-1 recheck for resolution; these three old identities are retired.

Location: candidate `src/content/expansion-english/words.ts:105`, `:110`, `:125`;
corresponding review records `e02-their`, `e02-youre`, `e02-piece`.

Exact original examples:

- **e02-their, core:** “The readers own the books on this shelf. These are ___
  books.” Options `a=they’re`, `b=there`, `c=their`; `c` is correctly accepted.
  The context directly states ownership and asks for its familiar determiner.
  Splitting that direct clue over two sentences does not add the claimed core
  reasoning. This specific three-way group is already an Appendix 1 Year 2
  example; the record describes it as Years 3–4 further homophones without
  acknowledging the earlier consolidation or demonstrating additional demand.
- **e02-youre, core:** “The guide tells the helper, ‘___ ready to open the book
  now.’ The guide means ‘you are ready’.” Options `a=your`, `b=you’re`, `c=yore`;
  `b` is correct. The prompt supplies the full contraction expansion, so the
  learner does not perform the expansion/context inference claimed by the
  rationale. This is explicit meaning recognition, analogous to the support
  tasks; the uncommon distractor `yore` does not supply a harder reasoning step.
- **e02-piece, stretch:** “The torn map will not be whole until we find its
  missing ___. Choose the word naming what is absent.” Options `a=piece`,
  `b=peace`; `a` is correct. Torn map plus missing part is a direct concrete
  clue. The negative/until wording does not require an additional distinction
  beyond the single contextual choice already made in core `e02-brake` or
  `e02-weather`. Its rationale labels this less-direct but does not implement
  the higher demand needed to count a third stretch task.

The [DfE spelling appendix, printed pp. 9–10 and 15](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/239784/English_Appendix_1_-_Spelling.pdf)
places contraction work and the familiar three-way group in earlier learning,
and lists peace/piece among Years 3–4 examples. Revisiting those words later is
legitimate; source membership alone cannot establish a harder item band. This
finding concerns the concrete tasks' supplied clues, not a claim about any
child's ability or a rule forbidding earlier words in core/stretch work.

**Invalidated criteria:** WP03-09A's actual 4 core/3 support/3 stretch demand per
skill, item-specific source/demand rationale, and WP03-13A's meaningful band
floor. The exported evaluator presently credits these answers in those authored
bands, so an inventory-only test propagates the unsupported classification.

**Required correction:** strengthen or replace these higher-band items with
observable contextual/spelling distinctions, or honestly reclassify them and
provide replacements to restore the floor. Update each affected source mapping,
oracle/review and receiving pool as needed. Changing only the rationale or
adding a longer story is insufficient. Preserve unambiguous offered answers and
the three support-accessible Q6 choices. Identity treatment of substantive
candidate revisions remains explicit and Controller-owned.

Minimum bounded producer work is two demonstrable E02 core items and one
demonstrable E02 stretch item in place of these three counted records. The other
seven E02 items do not need rewriting. Correcting the earlier-source attribution
alone would repair a misleading provenance claim, but would not create the
missing core demand; similarly, removing the word “less-direct” would make the
piece rationale more honest without restoring the stretch floor.

## F02 — [P2, resolved] Original e03-mild repeats core intensity selection

The following records the original failure and required correction. The final
recheck verifies a new task identity and actual competing word senses.

Location: candidate `src/content/expansion-english/words.ts:189` and its review
record. Exact context: “The potion has a mild scent that is noticeable only close
to the bottle. Choose a replacement for mild that keeps the meaning in this
scene.” Options `a=gentle`, `b=overpowering`, `c=faint`, `d=violent`.
Both `a` and `c` are correctly accepted; neither should be removed.

The rationale claims less-direct nuance and rejection of another sense of
`mild`. The actual alternatives offer two low-intensity synonyms and two
incompatible high-intensity descriptions; no competing legitimate sense of
`mild` must be distinguished. Core `e03-faint` already asks the same operation:
use barely detectable sensory intensity to accept two synonyms (`dim`, `weak`)
and reject intense/unrelated alternatives (`dazzling`, `noisy`). Changing glow
to scent and the detection cue to distance supplies useful further practice,
but not the additional demand claimed for the third stretch record.

**Invalidated criteria:** genuine 3-stretch E03 floor and truthful demand
rationale. The other two stretch tasks have identifiable added work: selecting
among valid senses of `sharp`, and linking `reserve` to the later step.

**Required correction:** author an actual additional contextual distinction or
selected harder demand, while retaining every equally appropriate offered
answer; alternatively classify this as same-demand practice and add another
genuine stretch task. Recheck its whole finite option space, hints, listening
policy and meaningful identity. A band/rationale-only edit does not fix the floor.

Minimum producer work is one E03 stretch replacement or a substantive revision
of this one item. This is not a finding that faint and mild have duplicate IDs,
identical lexical learning, or no practice value. They test different words at
the same supported intensity-selection demand. Thirty unique authored identities
and useful lexical records remain present; the failed criterion is their claimed
distribution into genuine higher bands, not a computational duplicate count.

## Original item-by-item lexical, source and help assessment

All 30 contexts, options/maps, explanations, both hints and worked support were
read. `S/C/T` below are the candidate's support/core/stretch labels. Every listed
accepted answer is legitimate; all other offered alternatives have a contextual
or spelling reason for rejection. Band concerns are identified separately.

| Authored key | Band | Accepted answer(s) / reviewed distinction |
|---|---|---|
| e01-unfasten | S | unfasten; reversal, not repetition/action noun. Earlier un- consolidation. |
| e01-rewrite | S | rewrite; explicit again, not undo/incorrectly. Reduced-demand prefix work. |
| e01-suffix-sort | S | hopeful/careful→having; fearless/painless→without. Both groups reusable. |
| e01-illegal | C | illegal; correct negative-prefix form and two l letters. |
| e01-happily | C | happily; y→i while retaining pp. |
| e01-disappear | C | disappear; intact supplied prefix/base, one s and pp. |
| e01-gently | C | gently; replace -le with -ly rather than append. |
| e01-forgetting | T | forgetting; multisyllabic final-stress doubling, beyond direct affix assembly. |
| e01-preferred | T | offered / preferred; genuinely contrasts unstressed/stressed final syllables. |
| e01-reliable | T | reliable; selected Years 5–6 -able form with base change. |
| e02-sea | S | sea; explicit salt-water noun, not sight verb. |
| e02-hear | S | hear; sensory action, not location. |
| e02-pair | S | pair; two associated objects, not fruit. |
| e02-their | C | their; ownership. Answer passes; source/demand finding F01. |
| e02-youre | C | you’re; supplied expansion. Answer passes; demand finding F01. |
| e02-weather | C | weather; conditions inferred from rain's effect on the plan. |
| e02-brake | C | brake; slowing device, not damage/interruption. |
| e02-piece | T | piece; physical missing part. Answer passes; demand finding F01. |
| e02-whose | T | whose; embedded ownership question; neither who-is nor who-has fits. |
| e02-stationery | T | stationery; category inferred from materials, selected Years 5–6 distinction. |
| e03-warm | S | cool; same temperature dimension, not brightness/taste. |
| e03-tiny | S | very small; explicit definition, not weight/age. |
| e03-label-match | S | start→begin; stop→cease. Opposite pairing is wrong, reused target invalid. |
| e03-faint | C | dim / weak; both fit barely visible glow. |
| e03-fragile | C | easy to break; consequence explains the warning. |
| e03-transparent | C | easy to see through / clear; both preserve visibility through the liquid. |
| e03-scarce | C | few in number; limited supply, not cultivation difficulty. |
| e03-sharp | T | strong and pungent; sensory meaning selected over two other legitimate senses. |
| e03-reserve | T | keep it for later / set it aside; both preserve the final-step amount. |
| e03-mild | T | gentle / faint; both fit low intensity. Demand finding F02. |

The contrasting-stress item was specifically checked: offer + -ed retains one
final r; prefer + -ed doubles it. Its two-answer-pair distractors independently
test each side. The cited Years 3–4 multisyllabic-suffix row supports this rule;
it need not be falsely moved to Years 5–6 merely because later -fer work exists.
The same appendix supports the other cited affix rows and reliable's selected
Years 5–6 placement. The [DfE programme's Years 3–4 comprehension section](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study#years-3-and-4-programme-of-study)
supports contextual word meanings. These source checks are bounded to the
retained official links; they do not validate a psychometric difficulty scale.

All 60 hints direct attention/strategy without naming an accepted option or
spelling the answer; all 30 worked supports correctly supply assisted answers.
The neutral scripts name only the control action and Check. E01 assessed speech
is blocked before Check, including stress/affix pronunciation. E02/E03 visible
context reading is explicitly listening support, with blanks unfilled and no
spelling, expansion or emphasis selecting an option. Reading an explicit
definition already present in a support prompt is not an extra hidden hint.
Worked/hint assistance remains separate from evidenceMode; text-only worked
help can be supported even when evidenceMode is independent. No audible or
runtime persistence acceptance follows from these safe authored policies.

## Original fresh executable evidence and bindings

Private reproducible harness:
[review.mjs](../../../artifacts/wp03-09a-review-20261011/review.mjs), with results
in [results.json](../../../artifacts/wp03-09a-review-20261011/results.json).
Run from repository root using the bundled Node executable:

```text
C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe artifacts/wp03-09a-review-20261011/review.mjs
```

**Fresh result: exit 0.** The harness imports actual frozen TypeScript modules
with a resolution hook that supplies missing `.ts` extensions; no implementation
is copied or mocked. An editorial oracle lists accepted words independently of
production answerRule. Checks passed:

- All **82 offered choice maps**, with actual wrong/accepted feedback, and
  deeply equal results for each of the four two-answer synonym sets.
- All **16 suffix-sort maps**; all **4 two-target matching maps** (two complete
  unique maps judged, duplicate targets invalid).
- **210** missing/null/extra/unknown/empty/false/undefined recovery cases across
  the 30 tasks, and **27** malformed-content cases across choice/sort/match.
  Changed context/help/band/answers/narration, sparse arrays, non-coercible ID
  objects, accessors and cycles all remain unavailable without execution of the
  accessor. Prior M1 sparse-option/ID-coercion failures do not recur here.
- All 30 task IDs reconstruct, revision-only/presentation reordering validates,
  36 frozen starter IDs reconstruct and are disjoint from the new bank. Exact
  patch paths exclude starter/identity/shared contract changes. The rendered
  review matches all 30 source contexts, demands, explanations, hints and worked
  supports. Numeric inventory is 4C/3S/3T per skill, subject to F01/F02.
- All six proposed bindings resolve and select with the actual frozen
  `resolveBindingIntent` / `selectNextActivity` exports; M1 rejects the M2 routes.
  Two completed hinted E02 core episodes, constructed through the accepted
  `applyLearningObservation`, cause the Q6 story pool to select support
  `e02-hear`, retaining story provenance and reason. This proves a real
  support-accessible policy route, not merely presence of a support item.

Q6 E01 choice/sorting and E02 choice revisits, and Q5 E03 choice/matching revisits,
have the exact optional IDs/roles required by WP03-13A. They are nonempty,
skill/response-consistent proposals; only q6-story-e02-clue is required here.
Its full quest ordering after q6-story-e04-sort and all-required completion remain
the assembler/state owners' responsibility. Revisit selection retains revisit
provenance; it cannot itself certify the missing story completion. Frozen M1
central catalogue/binding validators intentionally await WP03-13A expansion;
their unchanged M1-only dispatch is not a finding against this family.

## Original reused evidence, repair boundary and limits

Inspected the author's frozen test log: **69/69 passed**; reused the reported
scoped TypeScript exit 0 and inspected the actual tests. Did not rerun the
unchanged full suite or present author evidence as fresh reviewer execution.
Those tests establish answer/domain behavior and numeric counts, not the
semantic difficulty claims challenged above. The 43-case manifest and eight
receiving examples are correctly shaped handoffs, not durable-state/audio proof.

The original author should repair F01/F02, freeze the affected files and provide
narrow before/after semantic and evaluator evidence. Preserve the passing answer,
validator, neutral-narration and binding findings where the repair leaves them
unchanged. Re-review each revised item's demand, complete offered answer set,
source, identity and assistance; recheck counts/pools if membership changes.

This reviewer wrote only this report and private evidence. No source fix,
package-manager/dependency/cache mutation, main build, Git operation, deployment,
worker creation or other-chat message was performed. No educator approval,
efficacy, full curriculum, integrated save, browser or final listening claim.

## Narrow independent recheck — demand-repair-1, 11 October 2026

**F01 RESOLVED; F02 RESOLVED. PASS for the bounded WP03-09A family handoff.**
Reviewed only the four replacements, their current review/oracle/receiving
references, identity retirement, unchanged-record evidence and support-selection
path. Current delivery is the exact five-file `owned-files.json`, revision
`demand-repair-1`; earlier Git patches are historical and must not be used as
this repair's delivery. No patch replay, whole-repository audit or broad suite.

| Replacement / band | Exact offered answers and independent semantic conclusion |
|---|---|
| e02-accept-delivery / core, replacing e02-their | `a=except`, `b=accept`; only **b**. The library will take the matching parcel, with the otherwise-return condition supplying contrasting evidence. The task requires a receiving/exclusion decision rather than copying a provided definition. The Years 3–4 accept/except mapping is accurate. |
| e02-plane-tool / core, replacing e02-youre | `a=plain`, `b=plane`; only **b**. Shaving thin curls from a rough wooden shelf identifies the woodworking tool sense; simple/flat-land meanings cannot satisfy that action. This is contextual word-sense application, not a supplied contraction expansion. Years 3–4 plain/plane mapping is accurate. |
| e02-practice-rehearsal / stretch, replacing e02-piece | `a=practice / practice`, `b=practise / practice`, `c=practice / practise`, `d=practise / practise`; only **c**. In “After today’s ___, the actor will ___ the difficult scene”, the first blank names the activity and the second supplies the action. British English is explicitly required. The four pairs test both positions: a misses the verb, d misses the noun, b misses both. This adds a genuine two-role spelling distinction and justified selected Years 5–6 demand. |
| e03-mild-weather-scent / stretch, replacing e03-mild | `a=gentle`, `b=not cold for the season`, `c=faint`, `d=not severe as an illness`; **a and c equally correct**. The same scene now uses mild for both weather and scent and explicitly asks about scent. The weather definition fits the other occurrence, so rejecting it requires locating the requested sense. The illness meaning fits neither occurrence. This implements the previously absent polysemy distinction while preserving both appropriate scent synonyms. |

The retained [official spelling appendix, printed pp. 15 and 21](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/239784/English_Appendix_1_-_Spelling.pdf)
supports the selected pairs and British practice/practise noun/verb distinction.
Freshly checked the latter source row; the Years 3–4 pairs were also present in
the source inspected during the initial review. The vocabulary source remains
contextual comprehension. These are defensible authored bands, not calibrated
difficulty, independent grammar credit, ability estimates or efficacy claims.

All eight replacement hints are appropriate attention/strategy help. In the
practice item, the second hint identifies grammatical jobs but does not reveal
the -ce/-se mapping or name the answer pair; worked support supplies that mapping
as explicit assistance. Mild hints direct the reader to the requested noun
without selecting either valid synonym. The four neutral scripts remain control
instructions. Assessed listening may read the visible context with blanks left
blank; pronouncing homophones does not distinguish their spellings. Filling or
spelling the answers still constitutes help. Audible delivery remains deferred.

### Current independent evidence

Private [recheck.mjs](../../../artifacts/wp03-09a-review-20261011/recheck.mjs)
and [recheck-results.json](../../../artifacts/wp03-09a-review-20261011/recheck-results.json)
retain the exact narrow checks and old/new canonical IDs. Fresh direct command,
from repository root:

```text
C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe artifacts/wp03-09a-review-20261011/recheck.mjs
```

**Exit 0.** Actual frozen exports passed all **12 replacement option maps**,
**16 partial/invalid responses**, **8 malformed-content cases** (sparse option
and non-coercible required-ID object for each replacement), and valid
option-reorder/revision checks. Both mild successes are deeply equal. The five
replacement accepted manifest cases execute with the expected results.

Fresh deep comparison against the retained pre-demand-repair inventory confirms
the other **26 full task records are unchanged**. Evaluator SHA-256 equals the
previous independently reviewed hash. All four old task tuples return
`unavailable-content` with `unreviewed-task`; their old canonical IDs are absent
from tasks, manifest inventory/cases, all binding pools and receiving examples.
Each replacement reconstructs to its distinct new authored ID, r1/revision 1.
This retires rejected unpublished tasks, not released M1 receipts or identities.

Freshly verified 30 unique IDs and 4 core/3 support/3 stretch per skill; the
substantive review above restores the meaningful band floor. Binding records
equal their prior records with only the four ID substitutions. Eight receiving
cases are exactly unchanged. All six bindings still resolve under M2. Two hinted
core episodes produced through the actual evidence function again cause the
required q6-story-e02-clue pool to select **e02-hear / support**, retaining story
provenance. The other two support records are also unchanged. No new required
Q5/Q6 beat, optional-to-story credit or starter-ID change is introduced.

Current five-file byte lengths and hashes were independently checked against
the current manifest; all match:

| File | Bytes | SHA-256 |
|---|---:|---|
| `src/content/expansion-english/words.ts` | 34829 | `7a13806b67fdfed02f079005302338a6aa17403e4325b8c9caa766ed9890ee15` |
| `src/learning/evaluators/expansion-words.ts` | 8845 | `d09ddac191a57f4356e28ce0c7d421a84953f2330d7ed9ded954ab3dd5704f64` |
| `tests/learning/expansion-words.test.ts` | 17834 | `a6542d10b32adc1bd22445068f88235c5d8e790e98a0c2a2629935474ad23443` |
| `docs/content-review/expansion-words.md` | 45809 | `65c15b9ba285a7732b35a9533a2e6a9808165dd3f159e3bb1b562b0411e1c1bd` |
| `docs/work-package/execution/WP03-09A-HANDOFF.md` | 6339 | `16e66e12ab9cce9193a983389192ea7410a69612f51c2318931b3995bfc8a286` |

Inspected the updated lexical oracle, retirement/alternative assertions and
binding fixtures. Reused the author's **70/70 focused tests** and reported scoped
TypeScript **exit 0**, distinctly from the fresh independent checks above.
Prior passing checks for unchanged records/evaluator remain valid; no broad
unchanged suite was rerun. New review sections match the four actual contexts,
demands, explanations, hints and worked supports exactly.

Only this validation report and private reviewer evidence were updated. Main
source/configuration, previous M1 reports, shared caches, Git and deployment were
untouched. WP03-13A still owns assembly, WP02 actual controls/narration, WP04
durable help/history/save compatibility, and WP06 published and final listening
acceptance. This bounded PASS waives none of those downstream requirements.
