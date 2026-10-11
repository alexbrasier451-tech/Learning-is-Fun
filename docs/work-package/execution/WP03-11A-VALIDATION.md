# WP03-11A independent candidate validation

Date: 11 October 2026. Reviewer: independent Codex English-content review chat,
not the candidate author or a qualified educator.

**Verdict: PASS after F01/F02 repair recheck. Both findings RESOLVED; open findings: NONE.**
The revised freeze corrects the five positional explanations and varies all
thirteen complete-choice presentations while preserving identities, answer
meanings and legitimate alternatives. The original rejection and evidence are
retained below as history; the final section identifies the accepted freeze and
fresh recheck. Controller retains integration and administrative authority.

## Frozen scope and evidence identity

Reviewed the read-only candidate at
`C:/Users/alexb/.codex/visualizations/2026/10/08/01a11de8-47cb-7422-9b0c-d6ecf8ea0e4c/WP03-11A-candidate-d51481e`,
base `d51481e0954beca1ff380e5a9fdde7f2cc8312ca`, against
`.verification/WP03-11A-FILES.json`. Fresh verification matched every declared
byte count and hash:

| Candidate-owned file | Bytes | SHA-256 |
|---|---:|---|
| `src/content/expansion-english/punctuation.ts` | 32262 | `5735e487b61ae011048f466c32cfe2d29656f7975a7e3dfeaaeab2eae3fc12db` |
| `src/learning/evaluators/expansion-punctuation.ts` | 6875 | `dccffe4d31aa383a2a2569c13e152927b680bcfb8cb5906efbb182142f44b175` |
| `tests/learning/expansion-punctuation.test.ts` | 19357 | `e67670f6c0180ce2d048386e4bccc0c46229b66a91528cb9c66a51ecfe15cbe1` |
| `docs/content-review/expansion-punctuation.md` | 60975 | `7006d08cca414103cfc7ae3491255465e5b99f155d8c5cab443b3e692cf3df37` |
| `docs/work-package/execution/WP03-11A-HANDOFF.md` | 12449 | `7e066774f45c761fc181f751ea3506491d85379c8c3fe6ee0d609d1b8441f59b` |

Read the governing chunk, handoff, content/review appendix, evaluator and focused
tests, plus the frozen draft, widget, identity, selection and evidence contracts
needed for the checks below. No candidate or shared implementation was changed.
No patch replay, whole-archive audit, dependency installation, ledger update,
commit or deployment was performed. Prior WP03-03A and WP03-09A acceptance remains
untouched. Deferred listening remains deferred, not passed.

## F01 — [P2, resolved] Original supported option reordering invalidated feedback

Historical finding; closure is recorded in the final recheck section.

Location: `src/content/expansion-english/punctuation.ts`, explanation fields at
lines 122, 178, 196, 205 and 214. Exact affected authored keys:

- E06 `combined-proofread`.
- E07 `apostrophe-inside-speech`, `interrupted-one-sentence`,
  `two-spoken-sentences`, `quotation-within-speech`.

The validator deliberately permits semantic-preserving option reordering.
The widget renders the supplied option order, while the evaluator returns the
approved explanation unchanged. These explanations identify answers by displayed
ordinal, so the supported presentation transform changes their meaning.

Fresh reproduction: clone each record, reverse
`responseSpec.slots[0].options`, validate, then evaluate `version: 'v4'`.
All five clones validate with no issues; all five responses are judged wrong.
For `combined-proofread`, the first displayed version now reads
“After the rain stopped the childrens' coats dried.” Feedback nevertheless says
“The first version marks both features”, attributing correct punctuation to the
version that fails both features. For `apostrophe-inside-speech`, the third and
fourth displayed versions are now the accepted single- and double-quote versions,
yet feedback says the third loses the contraction and the fourth puts the comma
outside the quotation. The other three explanations likewise call the now-valid
fourth version defective. This is inaccurate teaching feedback, even though the
underlying answer IDs still grade correctly.

Required correction: make these explanations identify the relevant text or
punctuation feature independently of option position; synchronize the review
records and focused checks. Preserve semantic reorder support and accepted
alternatives. Recheck the feedback against the actual displayed labels after
reordering, rather than checking unchanged explanation strings alone.

## F02 — [P2, resolved] Original complete-version tasks all rewarded the first choice

Historical finding; closure is recorded in the final recheck section.

Location: `src/content/expansion-english/punctuation.ts`, choice helper at line 24
and all thirteen choice records; presentation contract in
`src/interaction/ActivityWidgets.tsx`, `ChoiceTiles` at line 262 onward.

Every choice record presents `v1` first and accepts it. Five also accept `v2`,
but none requires the learner to depart from the first displayed choice. This
holds across both skills and all three bands. The widget maps the supplied
option order directly; it does not shuffle these choices. Consequently, always
selecting the first complete version solves all thirteen such tasks without
discriminating the assessed punctuation. This undermines the bank's assessment
value and makes its otherwise real progression bypassable.

Fresh execution through `createDraft`, `reduceDraft`, `toResponse` and the
candidate evaluator confirms 13/13 correct for the first complete-version choice.
The seven glyph tasks also accept each individual space's first offered option,
giving 20/20 when following that per-space strategy. The latter is a per-space
observation, not a claim that one globally selected palette mark solves every
space. All twenty drafts begin blank with null selection and return incomplete;
there is no default preselection or initially correct Check defect.

Required correction: vary the authored presentation positions of accepted
complete versions across E06/E07 and the bands so a universal first-choice rule
does not solve the choice bank. Keep ID-to-label meaning, accepted quote variants,
canonical identity and actual difficulty intact. Runtime randomization or a new
interaction mechanism is unnecessary; conventional glyph palette ordering need
not be randomized. Add a focused bank-level guard against recurrence. F01 must
also be corrected so presentation changes retain accurate feedback.

## Independent content and demand review: all twenty records

The table uses `descriptor.authoredKey`; E06 belongs to
`english.punctuation.expansion`, E07 to `english.direct-speech`, both revision
`r1` with empty parameters. All twenty canonical IDs reconstruct exactly.
`v1`/`v2` below describe the frozen candidate's answer IDs, not a recommended
presentation order. Every offered distractor was reviewed against the stated
context and page convention, including joint constraints in multi-slot tasks.

| Skill / band | Authored key | Accepted space and demand assessment |
|---|---|---|
| E06 support | `list-separator` | Comma only; a single list boundary with the final “and” fixed. Period/question mark do not satisfy the instruction. |
| E06 support | `contract-is-not` | Straight or curly apostrophe in `isn't`; both omission variants accepted equally. Comma is wrong. |
| E06 support | `one-fox-owner` | `v1`, singular `fox's`; the context excludes plural ownership and unmarked forms. One local possessive decision. |
| E06 core | `fronted-time` | Comma after the opening time clause under the stated page convention; semicolon/colon are unsuitable. |
| E06 core | `regular-plural-owners` | `v1`, `gardeners'`; plural ownership distinguishes singular, missing and doubled apostrophes. |
| E06 core | `irregular-plural-owners` | `v1`, `children's`; irregular plural ownership distinguishes `child's`, `childrens'` and unmarked forms. |
| E06 core | `its-and-it-is` | `v1`, “It's folding its wing.” Both contraction and possessive roles must be coordinated. |
| E06 stretch | `address-not-food` | `v1`, “Let's eat, Pip.” Calm direct address and meaning distinguish the missing/misplaced comma alternatives. |
| E06 stretch | `paired-parenthesis` | Exactly comma/comma, dash/dash or opening/closing parentheses. Three legitimate pairs accepted; mixed or wrongly oriented pairs rejected. |
| E06 stretch | `combined-proofread` | `v1`; requires both the opening comma and irregular-plural possession. Each distractor fails one or both. F01 affects explanation after reorder. |
| E07 support | `quote-boundaries` | Matching straight single or double quotes; both styles accepted equally, mixed styles rejected. |
| E07 support | `reporting-clause-link` | Comma only after “Mira said”; the offered period/question mark break the stated construction. |
| E07 support | `spoken-question-end` | `v1`; question mark inside the quote. The explicit spoken question excludes a statement ending or outside question mark. |
| E07 core | `speech-before-report` | `v1` and `v2`, consistent double/single quote styles with the reporting comma inside; both have equal results. |
| E07 core | `coordinate-report-first` | Reporting comma plus matching single or double boundaries: two accepted maps out of twelve. Multiple conventions must agree. |
| E07 core | `apostrophe-inside-speech` | `v1` and `v2`; contraction apostrophe, outer quote boundaries and reporting comma coordinated. E06 is contextual. F01 applies. |
| E07 core | `question-and-reply` | `v1`; question ending and reply/reporting comma coordinated across two turns. Each alternative breaks a required boundary. |
| E07 stretch | `interrupted-one-sentence` | `v1` and `v2`; reporting interruption retains lowercase continuation of one sentence. Alternatives create an inappropriate capital or fragment. F01 applies. |
| E07 stretch | `two-spoken-sentences` | `v1` and `v2`; correctly separates complete spoken sentences around the report. Other versions splice or detach the report. F01 applies. |
| E07 stretch | `quotation-within-speech` | `v1` and `v2`; either outer style with alternating inner style, inner exclamation and outer reporting comma. Explicit convention excludes the other two. F01 applies. |

Source cross-check: the [DfE English Appendix 2](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/335190/English_Appendix_2_-_Vocabulary_grammar_and_punctuation.pdf)
places list commas, omission and singular possession in Year 2; introduces
inverted commas in Year 3; and adds fronted-adverbial commas, plural possession
and other direct-speech punctuation in Year 4. Year 5 includes parenthesis and
commas to clarify meaning. The review distinguishes those sources from extra
editing demand rather than presenting every extension as a verbatim curriculum
requirement. Combining earlier contraction/possession knowledge in `its-and-it-is`
creates an actual two-role decision. The harder speech tasks coordinate sentence
structure or nested boundaries. Both skills meet the numerical 4/3/3 split and
the substantive demand distinction, subject to F02's presentation shortcut.

No unresolved legitimate offered variant was found to be rejected. Explicit
page conventions avoid claiming that one publishing convention is universally
the only grammatical form. Candidate content stays within the declared short
reading load. The answer oracle can therefore remain intact during correction.

## Narration, assistance and initial controls

All twenty records disallow assessed-text speech before Check. Their shared
neutral narration describes reading, choosing/changing and checking, without
speaking punctuation answers or completed versions. All forty hints were read;
they direct attention without supplying the answer mark or completed response.
The twenty worked supports accurately explain the authored answers and belong
to explicit assistance. These are content/contract findings, not a claim that
audio was heard or that deferred final listening passed.

The actual draft model was exercised for every record: null selection and null
required responses, with an incomplete evaluation before interaction. Source
inspection establishes the supplied choice order; no browser-rendering or audio
test is claimed. F02 concerns the pattern of successful user choices, not an
initially populated answer.

## Evaluator and retained-flow checks

Fresh private evidence is in
[`review.mjs`](../../../artifacts/wp03-11a-review-20261011/review.mjs) and
[`results.json`](../../../artifacts/wp03-11a-review-20261011/results.json).
The script imports the actual frozen modules with the bundled Node runtime.
It completed successfully, recording the two findings as counterexamples:

- 54 independent complete-response checks: all 30 accepted maps, one wrong
  response per record, and four further joint-constraint failures. Accepted
  alternatives return equal full results; mixed pairs return combination issues.
- 120 response recovery checks: absent/null/empty known responses are incomplete;
  unknown slots, unoffered values and explicit undefined are invalid.
- 60 malformed-content checks: sparse options, non-coercible required IDs and
  changed neutral narration all return unavailable content without exceptions.
- All twenty semantic option reversals remain valid and preserve grading.
  Five additional feedback counterexamples demonstrate F01.
- All twenty blank drafts and first-offered interaction paths, exposing F02.
- All nine M1 anchor endpoint pairs. Exactly question/discovery `?` + `.` or `!`
  succeed, with equal full results. Anchor identity remains
  `lif.english.punctuation.r1.spellbook-anchor`; fixed comma and case remain.
- The expansion manifest retains the starter manifest's task-ID reference and
  contains 136 cases. The new bank does not replace starter tasks.
- LF/CRLF-normalized candidate/main comparisons match for starter English,
  starter punctuation evaluator, learning contracts and quest bindings.

The evaluator's dense bag checks and exact response-key handling address the
earlier malformed-content concerns. Unknown entries are not silently ignored,
and incomplete responses are not judged wrong. The remaining demonstrated
semantic defect is positional feedback, not accepted-answer evaluation.

The handoff reports 432 passing focused Vitest tests and a passing scoped,
nonincremental typecheck. Its finite-count evidence covers 96 complete maps
(30 accepted, 66 rejected), 243 partial maps and 136 manifest cases. Those results
are reused author evidence, not a fresh reviewer test-suite/typecheck run.
Fresh checks above supplement them with independent semantic expectations and
interaction/reorder counterexamples; no broad suite was rerun needlessly.

## Optional proposals and support selection

All four proposals are Q2 revisit rows available at M2, with null source-story
replacement and no added required story beat. They cover the twenty new records
once across skill/response kind. Fresh binding resolution rejects each at M1
and resolves each at M2. After two hinted core episodes per skill were applied
through the real evidence updater, the real selection policy selected support
from each proposal, retaining revisit provenance:

| Proposal | Selected support authored key |
|---|---|
| `q2-revisit-e06-punctuation` | `contract-is-not` |
| `q2-revisit-e06-choice` | `one-fox-owner` |
| `q2-revisit-e07-punctuation` | `quote-boundaries` |
| `q2-revisit-e07-choice` | `spoken-question-end` |

These checks use the frozen proposals as inputs and do not install them into
production bindings. The preserved M1 Q2 story path and compound anchor remain
the existing required route.

## Original required return and recheck boundary

Return to the producer for the five order-independent explanations and a varied
complete-choice presentation order, with synchronized review/test evidence.
Keep canonical identities and answer meanings stable: neither finding requires
a new semantic question. Recheck the changed displayed orders and feedback,
accepted alternatives, blank drafts, bank-level shortcut guard and relevant
focused regression results. No new broad audit, required beat, evaluator policy
change or M1 repair is requested. Acceptance remains withheld until F01/F02 are
resolved against a newly identified candidate.

## Final repair recheck — 11 October 2026

**PASS. F01/F02 resolved.** Same private candidate path and base commit; current
`.verification/WP03-11A-FILES.json` supersedes the original freeze. Fresh hashes
and byte counts match all five current delivery files:

| File | Bytes | Current SHA-256 |
|---|---:|---|
| `src/content/expansion-english/punctuation.ts` | 33075 | `4ccaea4d7a7a4c2938fc32425e64a8cd36887b0c3b8c1bcb591a6a2babc75ffe` |
| `src/learning/evaluators/expansion-punctuation.ts` | 6875 | `dccffe4d31aa383a2a2569c13e152927b680bcfb8cb5906efbb182142f44b175` |
| `tests/learning/expansion-punctuation.test.ts` | 26317 | `dffe82698a0221ab0fa957032e18bc1cd64c28253b9d5e5a53f9a462c40c5419` |
| `docs/content-review/expansion-punctuation.md` | 63632 | `5d421c9ca7a9e08dc819fc799fad40f47bae81957d12473a02ab5c5fab620855` |
| `docs/work-package/execution/WP03-11A-HANDOFF.md` | 18063 | `12efc2810fb6e3df309d5bc7115ccbe2cc357fb6420bc4769e0a95218024c10f` |

The preserved `.verification/review-return-01` snapshot was independently
matched against all five hashes in this reviewer's original evidence. Fresh
before/after comparisons prove all twenty canonical identities, task semantics,
ID-to-label maps, accepted responses, bands, sources, hints, narration and worked
support are preserved. Exactly the five named explanations and thirteen choice
orders changed. Choice content revisions advance to `expansion-punctuation-2`;
all seven glyph tasks remain deeply equal. Evaluator bytes and all four optional
proposals remain unchanged. Manifest metadata and the complete response/result
case multiset are preserved, with generated case numbering following the new
display order. These facts justify reusing the earlier passing answer-space,
demand, assistance, support-selection and M1 findings without a broad new audit.

### F01 closure

Each explanation was read against its actual option text. `combined-proofread`
now identifies the comma after “stopped” and the possessive `children's`, rather
than “the first version”. `apostrophe-inside-speech` names the missing apostrophe
and external comma in the erroneous text. The interrupted and two-sentence
records describe the fragment/capital and full stop before lowercase “said”.
Nested speech identifies double quotes at both levels and the misplaced ending
in `‘Wait’!`. These descriptions remain true regardless of displayed order.
The review appendix contains the exact revised explanations.

The fresh recheck recreates the **original** reversed order `v4,v3,v2,v1` for
each affected record, and also reverses each newly authored order: ten paths in
total. Each passes validation, then selects/places `v4` through the actual draft
model and receives the correct negative judgement with the accurate feature-based
explanation. This checks the original counterexamples rather than substituting
only a different reversal after the presentation repair.

### F02 closure

Fresh selection/placement checks give fixed-position success counts **4/4/6/4**
across the thirteen complete-choice records, replacing **13/5/0/0**. No fixed
position solves the bank, either skill subset, or any band subset:

| Subset | Choice tasks | Correct at positions 1 / 2 / 3 / 4 |
|---|---:|---|
| E06 | 6 | 1 / 2 / 2 / 1 |
| E07 | 7 | 3 / 2 / 4 / 3 |
| Support | 2 | 0 / 1 / 0 / 1 |
| Core | 6 | 2 / 1 / 3 / 2 |
| Stretch | 5 | 2 / 2 / 3 / 1 |

All 52 offered choice responses were independently exercised against the original
literal accepted-ID expectations. All five legitimate paired-style alternatives
retain equal full results. All twenty initial drafts still have null selection
and evaluate incomplete. No widget mechanism or conventional glyph ordering was
changed. The universal first-choice shortcut is removed without changing the
questions' semantic difficulty.

### Evidence and limits

Fresh reviewer files:
[`recheck.mjs`](../../../artifacts/wp03-11a-review-20261011/recheck.mjs) and
[`recheck-results.json`](../../../artifacts/wp03-11a-review-20261011/recheck-results.json).
The complete recheck exited successfully. Its initial raw-manifest equality
assertion was too strict because generated ordinal case IDs track presentation
order. That checker failure and correction are retained in
[`recheck-attempt-01.json`](../../../artifacts/wp03-11a-review-20261011/recheck-attempt-01.json).
The corrected assertion compares every semantic case field and metadata, omitting
only the generated ordinal case ID; the entire recheck was then rerun. No
production repair was needed for this reviewer-fixture error.

Reviewed the new focused regressions and retained author logs: **458 tests pass**,
and the scoped nonincremental typecheck exits zero. These are reused author runs,
not a fresh reviewer Vitest/typecheck run. The author regressions additionally
render the actual `ChoiceTiles` component and check option/placed labels and
feedback over all 24 orders and four selections for the five F01 records, plus
blank controls and the F02 position guard. This supports the fresh model-path
recheck; neither is browser-event, visual-layout or acoustic acceptance.

No production files, bindings, cache, ledger or prior accepted validation report
were modified by this recheck. Deferred listening remains deferred. The identified
punctuation candidate is accepted with no open substantive findings.
