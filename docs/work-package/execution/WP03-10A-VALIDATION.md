# WP03-10A independent validation — 11 October 2026

**Current verdict: PASS — F1 and F2 independently rechecked and closed on the second refrozen candidate, 11 October 2026.** Both sequences start unsolved; choice positions vary in every band; reordered choices retain all legitimate answers and accurate explanations. The earlier semantic, malformed-input and selector evidence remains applicable within the limits below. This is producer review acceptance for Controller integration, not integrated state, browser, published or acoustic acceptance.

Reviewer: independent Codex review lane, requested Astra/high; not the candidate author. No author files were edited. Controller remains the integration authority; the original author supplied both bounded repairs. No additional workers or other-chat messages were used.

## Current second refreeze and narrow F2 recheck

The earlier PASS after F1 was limited and missed a material presentation pattern: all eight choice tasks accepted the first option in every slot. The original exhaustive answer matrix proved which IDs were right, but did not test whether positional selection bypassed the intended meaning work. It also missed two explanations tied to the last displayed option. Controller's related inspection exposed these gaps; they were not covered by the prior acceptance. Controller reports WP03-13A release was held and no downstream consumer began. That coordination fact is reported, not independently audited here.

Current candidate: `artifacts/wp03-10a-20261011/candidate`; unchanged declared base `2812863ec610cb92ecc508601d7adc436f227887`. All five current raw byte counts and SHA-256 hashes were freshly verified against `owned-files.json`:

| Candidate-relative file | Bytes | SHA-256 |
|---|---:|---|
| src/content/expansion-english/grammar.ts | 33177 | 89b6f4bc1ed0e9e012b114770063b3b2d08bb553c32ca183f8a3a199edbe56e7 |
| src/learning/evaluators/expansion-grammar.ts | 9410 | d32e81a7b0c39e2f699ebf97d53c76b8f27f475f964922defb5881ec798b8d3e |
| tests/learning/expansion-grammar.test.ts | 27329 | 93c952cba219df7c37f96df8517ccd681a8689ea50db60ad38def897f8e939d9 |
| docs/content-review/expansion-grammar.md | 23751 | d968cd9aa55c663a07920cd950e3d19155b3524e2140464fa93e30b4e52b9e7f |
| docs/work-package/execution/WP03-10A-HANDOFF.md | 11971 | 43779580ae50d11d36ed4d0dadb851c07bba5821466248b0fde1afaf5aed1507 |

Fresh command: `node artifacts/wp03-10a-20261011/reviewer/f2-recheck.mjs`. **Exit 0; 379 equality assertions**, plus structural assertions. Private evidence: `reviewer/f2-results.json` and `reviewer/f2-run.log`. Earlier reviewer evidence remains intact. Author-reported **88/88 family tests and scoped typecheck PASS** are separate; those commands were not rerun by this reviewer.

### F2 counterexample, correction and presentation checks

The original pre-F2 grammar module was imported after its raw hash was verified against the prior independently checked freeze. An isolated instance of the byte-identical evaluator was bound to that original module. Actual `createDraft → reduceDraft(select/place) → toResponse → evaluateExpansionGrammar` reproduced **eight out of eight correct** when choosing the first option per slot: add, cause, contrast, although, if, who, although/because, and that respectively. These were deliberate first-position selections, not initially preselected drafts.

The current authored order has these accepted one-based positions:

| Band | Task | Accepted positions |
|---|---|---|
| support | add-two-actions | 2 |
| support | explain-dry-pots | 3 |
| support | contrast-heavy-basket | 1 |
| core | concede-wind | 1 or 3 |
| core | condition-pass | 2 or 4 |
| stretch | relative-gardeners | 1 or 4 |
| stretch | sheltered-nest-relations | contrast slot 2 **and** reason slot 1 |
| stretch | relative-repaired-rope | 2, 3 or 4 |

Fresh real-reducer checks of first, second, third, fourth (clamped to the last available option) and last selection confirm that no tested fixed-position strategy solves an entire band's choice pool. First-per-slot now solves 1/3 support, 1/2 core and 1/3 stretch. This verifies removal of the universal positional shortcut; it does not claim that guessing can never succeed or that every possible heuristic has been excluded.

All eight real fresh choice drafts still have null choices and evaluate incomplete. For each task, all complete choice combinations were constructed through the real select/place reducer in authored, reversed and rotated option order: **29 combinations × 3 presentations = 87 evaluations**, all agreeing with the earlier independent semantic oracle. This preserves all 13 accepted choice combinations, including synonyms, restrictive who/that, omitted relative pronoun and restrictive which; grammatical wrong-meaning distractors remain wrong. Presentation reordering validates without changing identity.

### Explanation accuracy and bounded scope

The gardener explanation now identifies the sentence about gardeners who have no passes, correctly rejecting the opposite permitted group wherever that option appears. The rope explanation identifies the clause “that repaired Inez”, correctly identifying the reversed repairer/patient relation. In the new authored order those rejected choices are third and first respectively, so the old “last option” descriptions would have been false. The revised semantic descriptions remain true in authored/reversed/rotated layouts, and the evaluator returns the same appropriate explanation in all 87 checks. All choice hints and worked support were checked for displayed-option ordinal references; remaining references to first/second joins or facts locate parts of the sentence, not option positions.

The exact production diff is **nine lines: seven option-array orders and those two explanations**. Raw source comparison and per-record comparison independently establish that all option IDs/labels, answer sets, canonical identities/descriptors/revisions, source/band metadata, hints, narration, sequence starts, manifest, binding proposals and handoff cases are otherwise unchanged. The evaluator remains byte-identical to both prior freezes. Removing only the four new test cases and presentation-order assertion adaptations recovers the pre-F2 test hash; removing the F2 review subsection recovers its prior hash. The updated handoff was read and confines its new claims to F2 and the reported author checks.

Both fresh sequence counterexamples were rerun against current exports: `flood,because,wait` and `leave,before,pack` still evaluate judged false. Their entire records and evaluator are unchanged from the successful F1 recheck, so the earlier eight valid reducer constructions and 12-order proof remain applicable. Likewise, the 1,197 semantic enumeration, malformed-content checks and real support-selector evidence are retained where unchanged; no complete rereview or broad suite was needed. The two changed explanation fields were specifically revalidated above.

**F2 is closed, F1 remains closed, and no finding remains against the current freeze.** Static ordering is the repair; no randomizer, interaction gate, new identity or downstream compensation was introduced. All integration, state, browser, published and acoustic limits at the end remain in force.

## First refreeze and narrow F1 recheck — retained history

Candidate and base remain `artifacts/wp03-10a-20261011/candidate` and `2812863ec610cb92ecc508601d7adc436f227887`. The final narrow recheck verified every raw byte length and SHA-256 against the current parent `owned-files.json`:

| Candidate-relative file | Bytes | SHA-256 |
|---|---:|---|
| src/content/expansion-english/grammar.ts | 33131 | 4d38847e2bb9a4697b2d38fd6098e1d12514b1057893ad41df3b5568de88a2e7 |
| src/learning/evaluators/expansion-grammar.ts | 9410 | d32e81a7b0c39e2f699ebf97d53c76b8f27f475f964922defb5881ec798b8d3e |
| tests/learning/expansion-grammar.test.ts | 25291 | e73a3c54a2eaf851411794db9c9a1a38b49557915841b8b77ef32eea7182aaf6 |
| docs/content-review/expansion-grammar.md | 20950 | 239506d87df39a460eaf52e349958144ba9072ea7bc1d0332daa4409393131c8 |
| docs/work-package/execution/WP03-10A-HANDOFF.md | 9955 | 919f93b3bf42788441a8c8d8f3d177ca329c312227448bb11371925168c25100 |

Fresh independent command: `node artifacts/wp03-10a-20261011/reviewer/f1-recheck.mjs`. **Exit 0; 109 equality assertions**, plus structural assertions. Evidence: private `reviewer/f1-results.json` and `reviewer/f1-run.log`; the original `reviewer/results.json` and failure evidence remain unchanged.

The retained original grammar source matched the first review's exact hash. Comparing it to current source proved that **only the two presentation arrays changed**. The evaluator is byte-identical. Removing the new draft import, two presentation-order expectations and two new reducer regression cases from the test text reproduces its original raw hash. Removing the inserted F1 subsection from the content review reproduces its original raw hash. The complete updated handoff was inspected: changes describe F1, revised author checks and the same downstream boundaries. No source patch replay or production mutation was performed by this reviewer.

The old source was imported as an actual module. Every current task equals its original record after restoring only those two tile-array orders; canonical IDs, descriptors, revisions, labels, accepted answers, hints, sources and other metadata are unchanged. Manifest, binding proposals and handoff cases are deeply equal to the original exports. This is why the earlier exhaustive semantic, malformed-content and support-selector results can be retained without recreating the full review.

| Real fresh-draft counterexample | Original source | Refrozen source |
|---|---|---|
| flooded-path-cause | wait,because,flood → judged true | flood,because,wait → judged false |
| pack-before-leave | pack,before,leave → judged true | leave,before,pack → judged false |

Both checks used actual `createDraft → toResponse → evaluateExpansionGrammar`, with zero prior edits and null selection. The repaired starts are grammatical but express the wrong cause/time relation, so construction now requires reasoning and rearrangement. Each of the four accepted arrangements was independently reached from its new fresh tray through both real reducer routes: `move` (Earlier/Later), and `select` plus `place`. **Eight reducer constructions passed**. Each resulting correct response also passed after restoration without a forced new movement. All **12 complete sequence permutations** were rechecked against the independent original language matrix; all four accepted arrangements remain equally correct. The exact canonical IDs shown in the historical finding below are unchanged.

F1 was closed by this first recheck. Its producer PASS did not establish freedom from the subsequently discovered F2 positional shortcut; that limitation and correction are recorded above. The author's then-current **84/84 tests and scoped typecheck PASS remain author-reported**, distinct from the reviewer's fresh 109-assertion recheck; neither author command was rerun here. All downstream rendering/state/published/acoustic limitations at the end of this report remain in force.

## Original frozen target and scope — retained history

Candidate: `artifacts/wp03-10a-20261011/candidate`, declared base `2812863ec610cb92ecc508601d7adc436f227887`. Independently verified all five raw byte lengths and lowercase SHA-256 values against the parent `owned-files.json` during the final fresh run:

| Candidate-relative file | Bytes | SHA-256 |
|---|---:|---|
| src/content/expansion-english/grammar.ts | 33131 | c996e93cc67a89fdef74cafb0757a4066e4e1c1931f6fd62d6a370d9f06669d6 |
| src/learning/evaluators/expansion-grammar.ts | 9410 | d32e81a7b0c39e2f699ebf97d53c76b8f27f475f964922defb5881ec798b8d3e |
| tests/learning/expansion-grammar.test.ts | 23425 | 06ad609862dded1b003dd242bbf476505fd267b000905afec5a2a67a406af171 |
| docs/content-review/expansion-grammar.md | 19433 | 9836f57110441af7d7b86a8c72b74886d9bb2838234543c38bfb2015499ec222 |
| docs/work-package/execution/WP03-10A-HANDOFF.md | 7874 | dca7aeee5bae9045334f8a4cc8dde24dd4cd433afd19f5d53dba5e5c697bdc51 |

Read the actual five files, WP03-10A, WP03-01A and its registry/identity/response/assistance definitions, WP03-13A's required/optional bindings, and `CONTINUATION-AND-MUSIC-VARIATION.md`. M2 continuation is authorized; detailed acoustic acceptance remains deferred. The original evidence below applies to this historical freeze; the narrow recheck above establishes its applicability and closes F1 for the current freeze.

## F1 — historical finding, now closed

**Original priority P2; repaired and independently closed above.** Locations: candidate `src/content/expansion-english/grammar.ts:145` and `:153`. The original authored `responseSpec.tiles` arrays were respectively `wait,because,flood` and `pack,before,leave`, both accepted complete answers. The real `createDraft` in `src/interaction/draft.ts:91` initializes a fresh sequence from that array. `SequenceList` in `src/interaction/ActivityWidgets.tsx:159` renders the draft's order directly. The existing Check submission in `src/experience/QuestActivity.tsx:145` sends `toResponse(draft)` without requiring an edit; the Check button at line 228 is not gated on a tile movement.

Original counterexamples, freshly executed through actual exports:

```text
evaluateExpansionGrammar(task, toResponse(createDraft(task.responseSpec)))

flooded-path-cause
  response: {kind:'sequence', orderedIds:['wait','because','flood']}
  visible order: we waited inside | because | rain flooded the path
  result: judged, correct:true; fresh undo length:0; selection:null

pack-before-leave
  response: {kind:'sequence', orderedIds:['pack','before','leave']}
  visible order: we packed the tent | before | we left the field
  result: judged, correct:true; fresh undo length:0; selection:null
```

Exact affected identities:

```text
lif.english.expansion.e05.r1.authored-%5B%22flooded-path-cause%22%2C%5B%5D%5D
lif.english.expansion.e05.r1.authored-%5B%22pack-before-leave%22%2C%5B%5D%5D
```

Both are in `q7-revisit-e05-sequence` and available to the E05 bank. A learner can submit the supplied solution without constructing a clause order. That defeats their declared construction demand and WP03-10A's meaningful 4 core/3 support/3 stretch and distinct usable-task criteria. This is a presentation-data defect, not a reason to reject a valid grammatical answer or require arbitrary interaction after a correct answer.

Smallest repair: author a deterministic unsolved presentation order for each task while preserving all legitimate accepted orders, tile IDs and canonical identities. Add a regression that passes each real fresh draft through the evaluator, then reaches each accepted construction through actual reducer actions. Update the frozen evidence and handoff. Do not mint new equivalence identities for a tile-order change. A full browser/published verification remains downstream; this finding is demonstrated at the actual content → draft → response → evaluator boundary plus inspection of the rendering/submission path.

## Independent contextual language review

Each class below is determined by the supplied sentence, not by a bare-word dictionary. The repeated forms have distinct IDs and visible location labels. Within the offered DfE bins, each E04 task has one complete legitimate map; no additional class alternative was found.

| E04 key / band | Independently established map and contextual basis |
|---|---|
| otter-actions / support | In “Otters splash beside rocks”, otters and rocks are nouns; splash predicates the action and is a verb. |
| meadow-description / support | In “A narrow path crosses a quiet meadow”, path/meadow are nouns; narrow/quiet modify those nouns and are adjectives. |
| careful-movements / support | In Mira's opening/lifting sentence, opens/lifts are verbs; carefully/gently modify their manner and are adverbs. |
| lantern-reference / core | These specifies lanterns and the specifies path: determiners. Us and They refer without following nouns: pronouns. |
| oak-relations / core | Under the oak and beyond the wall introduce noun phrases: prepositions. Because introduces the finite rain clause: conjunction. |
| watch-clause / core | The watch is the timepiece noun; river is a noun. Stopped/watched are finite verbs; while joins the two clauses. |
| sweet-soup / core | Sweet describes soup after linking verb smells: adjective, not manner adverb. Smells is a verb, baker a noun, softly an adverb modifying speaks. |
| hard-roles / stretch | Hard before seed describes its firmness: adjective. Hard after fell modifies the fall: adverb. Seed noun; fell verb. The two occurrence IDs cannot be conflated. |
| before-roles / stretch | Before dawn takes a noun phrase: preposition. Before the sun rose introduces a finite clause: conjunction under the specified school terminology. Dawn noun; rose past-tense verb. |
| that-roles / stretch | That before key is a determiner; that after chest is the relative pronoun functioning as subject of holds. Opens/holds are verbs. |

E04's band distribution is substantive: simple earlier distinctions in support; reference, clause context and a predicative adjective in core; identical-form contrasts and a relative pronoun in stretch. E05's support choices consolidate additive, causal and contrastive joins. Its two remaining core choices distinguish concessive/conditional alternatives. Its intended sequencing demands would be suitable core work after F1. Restrictive relatives, an omitted object relative pronoun and two coupled clause relationships justify the three stretch records; the coupled-relation task does not falsely claim a new Year 5 statutory objective.

All offered E05 choices were reviewed, including grammatical distractors that express the wrong requested meaning:

| Key / band | Legitimate selections | Disposition of every other selection |
|---|---|---|
| add-two-actions / support | add (and) | reason (because) adds causation; condition (if) adds dependency. Both can form grammatical sentences but fail simple addition. |
| explain-dry-pots / support | cause (because) | despite (although) asserts concession; uncertain (if) states a condition. Neither gives the supplied roof explanation. |
| contrast-heavy-basket / support | contrast (but) | cause (because) reverses the explanatory relationship; alternative (or) does not report the requested surprising conjunction of facts. |
| concede-wind / core | although; even-though | because gives cause and if gives condition, not the requested concession. |
| condition-pass / core | if; provided | because states a reason and although a concession, not the conditional permission rule. |
| relative-gardeners / stretch | who; that | all supplies a supplementary relative about the gardeners as a whole, contrary to the requested identifying relative and the explicit passless gardeners. Without identifies the opposite group. The restrictive that construction is valid and must not be rejected for stylistic preference. |
| sheltered-nest-relations / stretch | contrast=although, reason=because | although/although changes shelter into concession; because/because changes wind into cause; because/although changes both. All three can be grammatical; they fail one or both requested relationships. |
| relative-repaired-rope / stretch | that; omitted; which | reversed makes the rope repair Inez. The zero object relative and restrictive which construction are both valid alongside that. |

All six orders for each sequence were independently classified, with case/punctuation excluded as instructed:

| Key | Correct | Grammatical but wrong meaning | Does not construct the required single sentence |
|---|---|---|---|
| flooded-path-cause | wait,because,flood; because,flood,wait | flood,because,wait; because,wait,flood (waiting causes flood) | wait,flood,because; flood,wait,because (unattached final conjunction) |
| pack-before-leave | pack,before,leave; before,leave,pack | leave,before,pack; before,pack,leave (leaving precedes packing) | pack,leave,before; leave,pack,before (no clause join; final adverbial reading does not repair this) |

No valid offered construction was rejected merely because another wording is preferred. The complete domains comprise 1,156 sorting maps, 29 choice combinations and 12 sequence permutations: 1,197 total, with 27 correct and 1,170 wrong.

## Sources, identity, help and bounds

Independently reopened the retained [DfE English programme](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study), [Appendix 2](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/335190/English_Appendix_2_-_Vocabulary_grammar_and_punctuation.pdf) and [glossary](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/238985/English_Glossary.pdf). The cited sections support earlier consolidation, Years 3–4 clause/time/place/cause and reference work, and selected Year 5 relative clauses including omission. Appendix page references 2–5 are accurate. The glossary supports the context-sensitive preposition/conjunction distinction. No citation mismatch was found; the bank makes no full-curriculum or qualified-educator claim.

All 20 records have one primary objective, unique authored identity, finite controls, explanations, two conceptual hints and separate worked answers. The hints direct attention to function, scope or intended meaning without specifying the complete map/order or selecting an option; worked support intentionally supplies answers. Every assessed text is within two sentences/60 words, sorting within six cards/two–four groups, sequence within five tiles, and choice within four offered options total. The tests and reviewer inspection cover these bounds rather than relying on prose claims.

The 20 authored keys represent different contextual questions, not reordered duplicates. Family/key/r1 descriptors with empty generated parameters reconstruct their exact canonical IDs. Positive revision and presentation-order changes preserve identity; substantive context/answer/source changes are rejected as unavailable content by the family validator. The manifest retains no starter IDs because these are new E04/E05 records. Actual starter exports contain 36 records, with nine M1 bindings. Candidate/main starter maths, starter English, identity and binding source text match after CRLF/LF normalization only; raw hashes for each side are retained in private evidence. No archive or Git audit was performed.

Neutral narration equals the generic instructions and contains no task answer. Assessed reading is allowed and separately qualified as listening support. Actual `usedAnswerHelp` returns false for neutral/assessed listening alone and true for either hint or worked support. Independent reading mode cannot override sticky answer-help flags. This validates data and the pure helper, not playback, audio emphasis, saved assistance or acoustic quality.

## Original fresh execution and receiving routes — evidence retained

Private reviewer harness: `artifacts/wp03-10a-20261011/reviewer/review.mjs`. Final direct command from repository root:

```text
node artifacts/wp03-10a-20261011/reviewer/review.mjs
```

**Exit 0; 2,855 counted equality assertions**, plus bounds assertions. `results.json` records the exact frozen identity, per-task domains, selectors, fresh solved drafts, malformed-content variants and starter evidence; `final-run.log` retains the concise output. The harness's exit 0 means its expected semantic/boundary assertions and F1 reproduction succeeded; it does not mean acceptance passed. The reviewer oracle was authored from the contexts and does not derive expected correctness from production `answerRule`.

Fresh checks cover all 1,197 complete answers; equal treatment of alternatives; incomplete empty/null-valued/partial maps and valid partial tile lists; complete wrong answers; unknown/duplicate/type-invalid responses, sparse arrays and malformed maps; valid null-prototype maps; and 16 malformed-content mutations through the actual evaluator. Malformed content precedes response parsing and returns unavailable-content. Reconstructed revision-7 tasks with reordered controls validate and preserve the same correct response and identity. All manifest and seven downstream case responses were also executed.

Actual `resolveBindingIntent` and `selectNextActivity`, supplied the proposed bank and two recent unsuccessful core episodes, select support with preserved story provenance for both `q6-story-e04-sort` and `q10-story-e05-meaning`. All six proposed routes resolve under M2 and are unavailable under M1. Both Q7 routes retain revisit provenance; the sequence-only pool appropriately remains core rather than inventing absent support content. There is no hard E04 prerequisite check. Optional rows follow WP03-13A naming, null source and mechanic/response conventions.

The candidate central `validateBindings` still rejects the proposed combined catalogue with `content-unavailable`, as expected before WP03-13A integrates this family and expands the central validator/dispatcher. Pure selector accessibility is proven; central integration is not. Initial reviewer harness mistakes (an expectation of already-complete central integration, one excess path parent, and a raw-byte comparison across CRLF/LF starter copies) are documented in `reviewer/first-attempt.txt`; only the corrected full final run supplies completion evidence. No candidate repair was made to satisfy those checks.

The author's 82-test suite, 1,197-response enumeration and scoped typecheck remain **author-reported** evidence. The actual test file was inspected, but the author suite and typecheck were not rerun or represented as reviewer-owned results. The fresh enumeration independently reaches the same numerical totals and additionally exposes F1 through the real draft API and checks support accessibility through the real selector.

## Completion and downstream limits

Producer review is **PASS for the current second-refrozen five-file identity at the top of this report**. F1 and F2 are closed and no item-level finding remains. Earlier acceptance was limited as explicitly corrected above. No source fixes, dependency/package-manager writes, main build, Git operation, deployment, patch replay, broad unrelated test suite or archive audit was performed. This report and private reviewer evidence are the only reviewer writes.

WP03-13A must integrate/validate the actual family and all required binding sets while retaining M1 identities. WP02-10A must demonstrate fresh unsolved presentation, keyboard/tap sorting/sequencing/choice, all accepted alternatives and actual Check on the repaired bank. WP04-07A must demonstrate committed save/reload, permanent story completion, original first-Check history, sticky help and familiar/review/reward continuity; this review does not claim state or reward outcomes. WP06 owns real published interaction, offline behavior and final listening. No published, acoustic, educational-efficacy or full-writing-proficiency acceptance is implied.
