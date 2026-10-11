# WP03-11A — expansion punctuation and direct speech

Author and finite-content reviewer: Codex AI author, 11 October 2026. This is
original authored material and a separate editorial answer oracle, not a claim
of independent human review, qualified educator approval, child research or
educational efficacy. Independent acceptance remains Controller-owned.

## Scope and source

Twenty new, meaningful records: E06 and E07 each have three support, four core
and three stretch tasks. None is a name substitution, an M1 duplicate, or a
second reward identity for an accepted variant. Every record has one primary
skill/objective; E06 context in the contraction-inside-speech task does not award
separate E06 evidence. Difficulty describes task demand, not the child's ability.

The retained [DfE English programme](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study)
is the WP03-01A accepted source, checked in that research on 8 October 2026.
No new research, library, corpus or external bank was introduced. Item-specific
source section, official programme band and actual demand are reproduced below.
Earlier objectives are expressly consolidation. The Year 4-centred core includes
fronted-adverbial commas, regular/irregular plural possession and direct speech;
the combined its/it's discrimination consolidates earlier omission learning with
two interacting uses rather than claiming a new statutory Year 4 objective.

E06 stretch includes selected Years 5–6/Appendix 2 Year 5 ambiguity and parenthesis
objectives. Combined proofreading adds two simultaneous Years 3–4 edits, not a
fabricated later-year attribution. E07 stretch extends the Years 3–4 direct-speech
and proofreading objective through interruptions, sentence continuity and nested
boundaries. Nested alternating quote styles are explicitly an authored convention,
not claimed as a statutory Year 4 or Year 5 item. No speed or larger-number proxy.

## Conventions, controls and identity

Context plus unfinished lines stays within 60 words. Each offered complete
version contains at most two sentences. Editable punctuation uses at most three
slots and four exact glyph IDs per slot; complete-version tasks use one `version`
choice with four alternatives. No sequence tasks, typing or unbounded prose
grading are introduced. All offered distinctions remain visible and assessed.

The families are `english.punctuation.expansion` (E06) and
`english.direct-speech` (E07), equivalence `r1`, with descriptive authored keys
and empty parameters. IDs use the accepted identity helper. Answer, placement,
release, week, cosmetic revision and slot/option order are not identity inputs.
Semantic changes require a new equivalence review, not silent rewording under an
existing key. The approved reference bank is deeply frozen.

Typography conventions are local and explicit. Some tasks offer both straight
and curly apostrophes or both single and double quote styles; these are equally
correct where offered. Other tasks fix the printed style so the available
alternatives assess placement/function. Unoffered styles are not declared
universally wrong: sending any unoffered ID is malformed input, not a grammar
judgement. Mixed quote styles are rejected only where the task requires a
matching pair; nested speech explicitly requires alternating inner/outer styles.
Serial-comma style is not assessed by the list task because that boundary is
fixed. Its offered alternatives are comma, full stop and question mark; a
semicolon is not offered, so this support task needs no advanced list-style rule.

Parenthesis offers three equally correct pairs: comma/comma, dash/dash, opening
round bracket/closing round bracket. All other 13 offered pairs are rejected.
Matching is a whole-pair constraint; a locally possible mark can still form a
wrong pair. UI spacing may adapt to the selected punctuation as requested by the
context, but must not repair a wrong mark or infer correctness. A complete
incorrect map is judged; it must not be silently normalised into a valid map.

All twelve M1 spellbook IDs are referenced through
`STARTER_PUNCTUATION_MANIFEST.taskIds` as retained identities. No M1 task data is
copied into `PUNCTUATION_TASKS`. The unchanged nine-pair M1 anchor test still
accepts exactly question `?` plus discovery `.` or `!`, with deeply equal results
and `lif.english.punctuation.r1.spellbook-anchor` for both lines together. Fixed
words/case/comma, objective, support band and assistance semantics are unchanged.

## Response and validation disposition

### Presentation repair after independent review

The prior frozen candidate and matrix remain preserved in
`.verification/review-return-01`. F01 found five explanations referring to displayed
option ordinals; these now identify the exact text or punctuation feature instead.
F02 found all thirteen complete-version tasks accepted the first displayed choice.
Their new deterministic presentation orders below preserve every ID-to-label pair
and every accepted ID; no runtime shuffle or widget change was introduced.
All thirteen choice records use content revision `expansion-punctuation-2`;
glyph records remain revision 1. Canonical identities and assessed meanings remain.

| Authored key | Displayed IDs, left to right | Accepted displayed positions |
|---|---|---|
| one-fox-owner | v3, v1, v4, v2 | 2 |
| regular-plural-owners | v2, v4, v1, v3 | 3 |
| irregular-plural-owners | v1, v3, v2, v4 | 1 |
| its-and-it-is | v4, v2, v3, v1 | 4 |
| address-not-food | v2, v1, v4, v3 | 2 |
| combined-proofread | v4, v3, v1, v2 | 3 |
| spoken-question-end | v3, v4, v2, v1 | 4 |
| speech-before-report | v1, v3, v4, v2 | 1, 4 |
| apostrophe-inside-speech | v3, v2, v1, v4 | 2, 3 |
| question-and-reply | v2, v3, v1, v4 | 3 |
| interrupted-one-sentence | v2, v4, v3, v1 | 1, 4 |
| two-spoken-sentences | v4, v1, v2, v3 | 2, 3 |
| quotation-within-speech | v1, v3, v2, v4 | 1, 3 |

Always selecting displayed position 1/2/3/4 now succeeds on 4/4/6/4 of the
thirteen tasks, respectively (previously 13/5/0/0). No fixed position solves the
choice bank, either skill's choice subset, or any support/core/stretch choice
subset. Conventional glyph ordering is unchanged. A stable option ID denotes
its authored text; it is not a displayed option number or an independence claim.

The five original reversal/v4 counterexamples and all 24 permutations of their
four choices are checked via the actual draft model and read-only server rendering
of `ChoiceTiles`. For each of those 480 order/selection combinations, the displayed
palette order, placed label, returned correctness and feature-specific feedback
agree. All twenty fresh drafts render blank and evaluate incomplete. This is
bounded rendered-markup and model evidence, not a browser interaction/accessibility
or audio acceptance claim. The complete original finite correctness oracle is
unchanged; only its control-domain assertion now allows presentation order.

### Response classes

Punctuation responses use `{kind:'punctuation', slots:{id:glyph}}`; choice
responses use `{kind:'choice', choices:{version:optionId}}`. Controls submit IDs,
never visible prose. Known missing/null/empty-string entries are incomplete even
if an already filled entry would be wrong. Unknown or extra keys (including null
extras), wrong kind/shape, explicit undefined, non-string values and unoffered IDs
are invalid. Invalid supplied values take precedence over missing entries.
Complete permitted maps are judged against all and only the reviewed answers.

Changed or malformed content is `unavailable-content`. The validator compares
source, objective/band, meaning, response domains, answers, hints and narration to
the frozen reviewed record; an external `approved` flag is insufficient. Dense
arrays are required, including glyph options, required IDs and accepted answers.
No unknown ID is sorted/coerced before validation. This carries forward both
resolved M1 sparse-option and malformed-required-ID regression classes.
Valid slot/option/requirement/accepted-map reordering is harmless. A nonempty
cosmetic revision may change; revised prose needs a reviewed source-bank update.
The data boundary is ordinary JSON-like values, not executable proxies/getters.

Wrong maps return `punctuation-context` on each locally wrong slot. A wrong
combination whose individual marks all appear in some correct response instead
returns `punctuation-combination` with constraint `assessed-convention`. Every
issue includes the observed selection and the contextual explanation; none is
a diagnosis. Incomplete, invalid and unavailable results have no scored fields.

## Narration and assistance

Exact neutral instruction and optional pre-Check narration for all records:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Every record sets `assessedTextMayBeSpokenBeforeCheck:false`. Contexts, unfinished
lines, complete option text and semantic slot labels are assessed material,
not neutral speech. Do not auto-read them, model punctuation through prosody,
announce an answer, or synthesise a completed sentence before Check. Routine
control narration may identify the controls equally, without recommending one.
Neutral instructions/control access remain available. Text suffices if no local
English voice is available or sound is disabled.

Each exact hint below directs attention without giving a mark, option ID or
completed answer. Hints still require durable `answerHintUsed` before reveal.
Worked support intentionally supplies answers and requires `workedSupportUsed`
before reveal, including when requested before Check. Speaking either does not
change its assistance category. Later assessed-text listening, where offered,
retains `assessedTextReadAloud` and listening-supported meaning where relevant;
it is distinct from answer help. Feedback after a valid Check is not neutral
pre-Check narration. WP04 owns assistance persistence; WP02 owns speech, Stop,
Silence all, independent channels, ducking and actual accessible presentation.

All forty hints and twenty worked supports were reviewed as text. Automated
lexical guards supplement this editorial review; absence of a mark name alone
is not a proof of non-leakage. No audible, child or physical-device test is claimed.

## Optional receiving bindings

`PUNCTUATION_REVISIT_PROPOSALS` exports four typed proposals for WP03-13A:

| Proposed binding | Skill / form / mechanic | Meaning |
|---|---|---|
| q2-revisit-e06-punctuation | E06 / punctuation / drag | New comma/apostrophe/parenthesis pages |
| q2-revisit-e06-choice | E06 / choice / consequential-selection | Complete punctuation edits |
| q2-revisit-e07-punctuation | E07 / punctuation / drag | New direct-speech mark controls |
| q2-revisit-e07-choice | E07 / choice / consequential-selection | Complete direct-speech edits |

All rows are Q2, availability M2, role revisit, sourceBindingId null, with
nonempty explicit ID pools and a support route. Together they reference each new
task once. They neither mutate the nine existing M1 rows nor create story beats,
new quests or required bank completion. WP03-13A owns serial integration and
family dispatch; WP02-10A/WP04-07A/WP06 own actual control/save/published checks.

## Independent finite matrix and exact records

The appendix is reproduced from the five-file candidate's actual task records,
but correctness comes from the separately written editorial oracle in the test
file, not the evaluator or `answerRule`. Every complete Cartesian map is listed,
including all wrong combinations. Choice IDs link to exact full alternatives.
For a rejected row, its reason is the stated contextual rule and explanation
immediately above that matrix; slot labels identify which local condition fails,
and `pair/convention` denotes incompatible individually plausible marks. All
known partial states are tested separately and never enter these judged tables.

Independent totals: **96 complete maps, 30 accepted and 66 rejected; 243 permitted partial states**.

<!-- BEGIN EXACT RECORDS -->

### list-separator

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22list-separator%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **support**. Revision `expansion-punctuation-1`.

Source programme: Year 2 consolidation in Years 3–4. Section: Year 2 Writing — vocabulary, grammar and punctuation; English Appendix 2, Year 2: commas in lists.

Actual demand: One explicit boundary between simple items in a list; earlier consolidation with the final conjunction fixed.

Assessed context/text (visible before Check, not neutral speech):

> Complete this calm, one-sentence packing instruction naming three separate foods:
> Pack bread ___ cheese and apples.

Exact offered controls:

- `list` — Between bread and cheese:
  - `,`: ,
  - `.`: .
  - `?`: ?

Contextual accepted/rejected rule and post-Check explanation:

> The comma separates bread from cheese in this list. A full stop or question mark ends the line before the list is finished and leaves cheese and apples as a fragment, rather than keeping the required instruction together.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"list":","}` | Accepted, equal credit |
| `{"list":"."}` | Rejected: list |
| `{"list":"?"}` | Rejected: list |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`list-separator-hint-1`):

> Count the separate things being packed.

Hint 2, after answer-help recording (`list-separator-hint-2`):

> Notice how the last two items are already joined.

Worked support, after worked-help recording (`list-separator-worked`):

> Pack bread, cheese and apples. The comma separates the first two items; and joins the last two. All three foods remain in one complete instruction.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### contract-is-not

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22contract-is-not%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **support**. Revision `expansion-punctuation-1`.

Source programme: Year 2 consolidation in Years 3–4. Section: Year 2 Writing — vocabulary, grammar and punctuation; English Appendix 2, Year 2: apostrophes for omissions and singular possession.

Actual demand: Insert one omission mark in an explicitly given contraction; straight and curly typography have equal meaning.

Assessed context/text (visible before Check, not neutral speech):

> Shorten is not without changing its meaning; straight or curly apostrophes are both allowed:
> It isn___t cold.

Exact offered controls:

- `omission` — Between isn and t:
  - `'`: '
  - `’`: ’
  - `,`: ,

Contextual accepted/rejected rule and post-Check explanation:

> An apostrophe marks the omitted o in not. Straight and curly apostrophes are equally correct here. A comma does not mark a contraction.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"omission":"'"}` | Accepted, equal credit |
| `{"omission":"’"}` | Accepted, equal credit |
| `{"omission":","}` | Rejected: omission |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`contract-is-not-hint-1`):

> Compare the shortened word with the two original words.

Hint 2, after answer-help recording (`contract-is-not-hint-2`):

> Check which letter disappears when the words join.

Worked support, after worked-help recording (`contract-is-not-worked`):

> It isn’t cold. Is not becomes isn’t: the o is omitted. It isn't cold. uses the equally accepted straight apostrophe.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### one-fox-owner

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22one-fox-owner%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **support**. Revision `expansion-punctuation-2`.

Source programme: Year 2 consolidation in Years 3–4. Section: Year 2 Writing — vocabulary, grammar and punctuation; English Appendix 2, Year 2: apostrophes for omissions and singular possession.

Actual demand: Select singular ownership with an explicit one-owner cue; distinguish possession from plural and omission.

Assessed context/text (visible before Check, not neutral speech):

> One fox owns this den; choose the sentence that shows ownership, using the printed straight apostrophe style:

Exact offered controls:

- `version` — Choose the complete version:
  - `v3`: The foxes den is warm.
  - `v1`: The fox's den is warm.
  - `v4`: The foxs den is warm.
  - `v2`: The foxs' den is warm.

Contextual accepted/rejected rule and post-Check explanation:

> Fox’s places the apostrophe before s for one fox’s possession. Foxs is not the plural foxes; neither foxs’ nor an unmarked foxes/foxs expresses the specified singular ownership.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Rejected: version |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`one-fox-owner-hint-1`):

> Identify the owner before looking at the den.

Hint 2, after answer-help recording (`one-fox-owner-hint-2`):

> Keep the stated number of owners in mind when comparing versions.

Worked support, after worked-help recording (`one-fox-owner-worked`):

> The fox's den is warm. One fox is the owner, so fox takes apostrophe plus s. The other choices do not mark ownership by that one fox.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### fronted-time

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22fronted-time%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **core**. Revision `expansion-punctuation-1`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: commas after fronted adverbials; English Appendix 2, Year 4.

Actual demand: Locate the boundary between a multiword fronted time adverbial and its main clause.

Assessed context/text (visible before Check, not neutral speech):

> Follow this page’s convention of separating the opening time phrase from the main clause:
> Before the sun rose ___ the team packed its bags.

Exact offered controls:

- `time` — After Before the sun rose:
  - `,`: ,
  - `;`: ;
  - `:`: :

Contextual accepted/rejected rule and post-Check explanation:

> A comma separates this fronted time adverbial from the main clause. The opening dependent phrase is not an independent clause for a semicolon or a complete introduction for a colon.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"time":","}` | Accepted, equal credit |
| `{"time":";"}` | Rejected: time |
| `{"time":":"}` | Rejected: time |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`fronted-time-hint-1`):

> Find the part that tells when the packing happened.

Hint 2, after answer-help recording (`fronted-time-hint-2`):

> Look for the boundary where the main action begins.

Worked support, after worked-help recording (`fronted-time-worked`):

> Before the sun rose, the team packed its bags. The opening time phrase comes before the main clause and is separated by a comma.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### regular-plural-owners

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22regular-plural-owners%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **core**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: possessive apostrophe with plural nouns; English Appendix 2, Year 4.

Actual demand: Place a possessive apostrophe with a regular plural ending in s; contrast singular owner and unmarked plural.

Assessed context/text (visible before Check, not neutral speech):

> Several gardeners share these tools; choose the version that marks their ownership in the printed straight apostrophe style:

Exact offered controls:

- `version` — Choose the complete version:
  - `v2`: The gardener's tools are clean.
  - `v4`: The gardener's' tools are clean.
  - `v1`: The gardeners' tools are clean.
  - `v3`: The gardeners tools are clean.

Contextual accepted/rejected rule and post-Check explanation:

> Gardeners is already a plural ending in s, so its possessive apostrophe follows that s. Gardener’s means one owner; no apostrophe omits the assessed possession mark; two apostrophes do not form this possessive.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Rejected: version |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`regular-plural-owners-hint-1`):

> Work out whether the owner word is singular or plural.

Hint 2, after answer-help recording (`regular-plural-owners-hint-2`):

> Keep the plural spelling intact while comparing the ownership forms.

Worked support, after worked-help recording (`regular-plural-owners-worked`):

> The gardeners' tools are clean. Several gardeners own the tools; put the possessive apostrophe after the plural gardeners.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### irregular-plural-owners

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22irregular-plural-owners%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **core**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: possessive apostrophe with plural nouns; English Appendix 2, Year 4.

Actual demand: Apply possession to an irregular plural that does not end in s, rather than copying the regular-plural placement.

Assessed context/text (visible before Check, not neutral speech):

> These boots belong to several children; choose the version showing that ownership with the printed straight apostrophe style:

Exact offered controls:

- `version` — Choose the complete version:
  - `v1`: The children's boots are muddy.
  - `v3`: The child's boots are muddy.
  - `v2`: The childrens' boots are muddy.
  - `v4`: The children boots are muddy.

Contextual accepted/rejected rule and post-Check explanation:

> Children is already plural without a final s, so add apostrophe plus s. Child’s changes the owner count; childrens’ invents a plural childrens; children alone lacks the possession marking.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Rejected: version |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`irregular-plural-owners-hint-1`):

> Start with the correct word for more than one child.

Hint 2, after answer-help recording (`irregular-plural-owners-hint-2`):

> Compare the ending of this plural with a plural such as gardeners.

Worked support, after worked-help recording (`irregular-plural-owners-worked`):

> The children's boots are muddy. Children is the plural owner word and takes apostrophe plus s, unlike a regular plural that already ends in s.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### its-and-it-is

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22its-and-it-is%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **core**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4 consolidation of Year 2 apostrophes. Section: Writing — vocabulary, grammar and punctuation; English Appendix 2, Year 2 apostrophes for omissions, consolidated in Years 3–4.

Actual demand: Distinguish two functions of nearly identical forms in one edit: contraction and possessive determiner; not a new Year 4 statutory objective.

Assessed context/text (visible before Check, not neutral speech):

> The first shortened form means it is; the second shows that the wing belongs to the bird; use straight apostrophes:

Exact offered controls:

- `version` — Choose the complete version:
  - `v4`: Its folding its wing.
  - `v2`: Its folding it's wing.
  - `v3`: It's folding it's wing.
  - `v1`: It's folding its wing.

Contextual accepted/rejected rule and post-Check explanation:

> It’s means it is; possessive its has no apostrophe. Every other offered version confuses at least one of those roles. The added core demand is discriminating both uses together, beyond inserting a supplied contraction.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Rejected: version |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`its-and-it-is-hint-1`):

> Try expanding each similar-looking form in turn.

Hint 2, after answer-help recording (`its-and-it-is-hint-2`):

> Decide whether each form describes ownership or stands for two words.

Worked support, after worked-help recording (`its-and-it-is-worked`):

> It's folding its wing. Expanding the first form gives It is folding; the wing belongs to the bird, so the second form is possessive its.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### address-not-food

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22address-not-food%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **stretch**. Revision `expansion-punctuation-2`.

Source programme: Years 5–6; Appendix 2 Year 5. Section: Writing — vocabulary, grammar and punctuation: commas to clarify meaning or avoid ambiguity; English Appendix 2, Year 5.

Actual demand: Use comma placement to preserve who is addressed and avoid a different literal meaning, not merely list separation.

Assessed context/text (visible before Check, not neutral speech):

> Pip is being invited to eat, not offered as food; keep the invitation calm and choose the version that makes this meaning clear:

Exact offered controls:

- `version` — Choose the complete version:
  - `v2`: Let's eat Pip.
  - `v1`: Let's eat, Pip.
  - `v4`: Let's eat Pip, .
  - `v3`: Let's, eat Pip.

Contextual accepted/rejected rule and post-Check explanation:

> The comma before Pip separates the person being addressed. Without it Pip can be read as what to eat. The other placements do not separate the address and disrupt the sentence.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Rejected: version |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`address-not-food-hint-1`):

> Identify who receives the invitation.

Hint 2, after answer-help recording (`address-not-food-hint-2`):

> Compare what each version might tell a reader to eat.

Worked support, after worked-help recording (`address-not-food-worked`):

> Let's eat, Pip. Pip is the person addressed; separating that name makes the invitation clear without suggesting that Pip is food.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### paired-parenthesis

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22paired-parenthesis%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **stretch**. Revision `expansion-punctuation-1`.

Source programme: Years 5–6; Appendix 2 Year 5. Section: Writing — vocabulary, grammar and punctuation: brackets, dashes or commas for parenthesis; English Appendix 2, Year 5.

Actual demand: Coordinate two boundaries of removable information and accept three different valid paired conventions; single-slot local correctness is insufficient.

Assessed context/text (visible before Check, not neutral speech):

> Mark a gift from Pip as extra information; use a matched pair of commas, dashes or round brackets, with spacing appropriate to the chosen pair:
> The boat ___ a gift from Pip ___ is blue.

Exact offered controls:

- `open` — Before a gift from Pip:
  - `,`: ,
  - `—`: —
  - `(`: (
  - `)`: )
- `close` — After a gift from Pip:
  - `,`: ,
  - `—`: —
  - `(`: (
  - `)`: )

Contextual accepted/rejected rule and post-Check explanation:

> Both commas, both dashes, or an opening bracket followed by a closing bracket enclose the extra information. Mixed, reversed or repeated opening/closing brackets do not form an accepted matched pair.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"open":",","close":","}` | Accepted, equal credit |
| `{"open":",","close":"—"}` | Rejected: pair/convention |
| `{"open":",","close":"("}` | Rejected: close |
| `{"open":",","close":")"}` | Rejected: pair/convention |
| `{"open":"—","close":","}` | Rejected: pair/convention |
| `{"open":"—","close":"—"}` | Accepted, equal credit |
| `{"open":"—","close":"("}` | Rejected: close |
| `{"open":"—","close":")"}` | Rejected: pair/convention |
| `{"open":"(","close":","}` | Rejected: pair/convention |
| `{"open":"(","close":"—"}` | Rejected: pair/convention |
| `{"open":"(","close":"("}` | Rejected: close |
| `{"open":"(","close":")"}` | Accepted, equal credit |
| `{"open":")","close":","}` | Rejected: open |
| `{"open":")","close":"—"}` | Rejected: open |
| `{"open":")","close":"("}` | Rejected: open, close |
| `{"open":")","close":")"}` | Rejected: open |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`paired-parenthesis-hint-1`):

> Read the main sentence without the extra information.

Hint 2, after answer-help recording (`paired-parenthesis-hint-2`):

> Check the two boundaries together, rather than judging each in isolation.

Worked support, after worked-help recording (`paired-parenthesis-worked`):

> The boat, a gift from Pip, is blue. Also accepted: The boat — a gift from Pip — is blue. Or: The boat (a gift from Pip) is blue. Each matching pair encloses the same extra information.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### combined-proofread

Canonical ID: `lif.english.punctuation.expansion.r1.authored-%5B%22combined-proofread%22%2C%5B%5D%5D`. Primary E06 / `E06-punctuation` / **stretch**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4 with additional combined editing demand. Section: Writing — composition: proofreading punctuation; vocabulary, grammar and punctuation: plural possessive apostrophes and commas after fronted adverbials.

Actual demand: Proofread two different features together with less scaffolding: a fronted time adverbial and irregular-plural possession; additional reasoning within Years 3–4, not a Year 5 claim.

Assessed context/text (visible before Check, not neutral speech):

> Several children own the coats; follow the page’s convention of separating a fronted time phrase and mark ownership, using straight apostrophes:

Exact offered controls:

- `version` — Choose the complete version:
  - `v4`: After the rain stopped the childrens' coats dried.
  - `v3`: After the rain stopped, the childrens' coats dried.
  - `v1`: After the rain stopped, the children's coats dried.
  - `v2`: After the rain stopped the children's coats dried.

Contextual accepted/rejected rule and post-Check explanation:

> The version with a comma after stopped and the possessive children's marks both features. Omitting that comma leaves the fronted time phrase unseparated; childrens' uses the wrong possessive for the irregular plural children. A version can have one or both errors.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Rejected: version |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`combined-proofread-hint-1`):

> Review the time information and the ownership information separately.

Hint 2, after answer-help recording (`combined-proofread-hint-2`):

> A version can repair one feature while leaving another unchanged.

Worked support, after worked-help recording (`combined-proofread-worked`):

> After the rain stopped, the children's coats dried. The comma closes the opening time phrase; children's shows that the coats belong to several children.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### quote-boundaries

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22quote-boundaries%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **support**. Revision `expansion-punctuation-1`.

Source programme: Years 3–4; Appendix 2 Year 3 introduction. Section: Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 3 introduction to inverted commas.

Actual demand: Identify the two boundaries of explicitly given spoken words, with sentence punctuation already fixed; single/double straight quote styles both count.

Assessed context/text (visible before Check, not neutral speech):

> These are the speaker’s exact words; enclose them using matching straight single or double quotation marks:
> ___The door is open.___

Exact offered controls:

- `open` — Before The:
  - `"`: "
  - `'`: '
- `close` — After the full sentence:
  - `"`: "
  - `'`: '

Contextual accepted/rejected rule and post-Check explanation:

> Matching opening and closing quotation marks enclose all the spoken words and their full stop. Either offered quote style is valid; mixing single and double marks does not make a matching pair.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"open":"\"","close":"\""}` | Accepted, equal credit |
| `{"open":"\"","close":"'"}` | Rejected: pair/convention |
| `{"open":"'","close":"\""}` | Rejected: pair/convention |
| `{"open":"'","close":"'"}` | Accepted, equal credit |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`quote-boundaries-hint-1`):

> Locate the first and last parts belonging to the speaker.

Hint 2, after answer-help recording (`quote-boundaries-hint-2`):

> Compare the two boundaries as one enclosing pair.

Worked support, after worked-help recording (`quote-boundaries-worked`):

> "The door is open." and 'The door is open.' are equally accepted. Each version encloses the whole spoken sentence with one consistent quote style.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### reporting-clause-link

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22reporting-clause-link%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **support**. Revision `expansion-punctuation-1`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 inverted commas and other punctuation, including reporting-clause comma and end punctuation inside inverted commas.

Actual demand: Choose one connection after a supplied reporting clause; quotation boundaries and spoken sentence punctuation are fixed.

Assessed context/text (visible before Check, not neutral speech):

> Join the reporting clause to the spoken statement in the book’s standard dialogue style:
> Mira said ___ “The path is clear.”

Exact offered controls:

- `link` — After Mira said:
  - `,`: ,
  - `.`: .
  - `?`: ?

Contextual accepted/rejected rule and post-Check explanation:

> The comma links Mira said to the quoted words in this reporting-first construction. The offered full stop breaks the required connection and the question mark would turn the reporting clause into a question.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"link":","}` | Accepted, equal credit |
| `{"link":"."}` | Rejected: link |
| `{"link":"?"}` | Rejected: link |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`reporting-clause-link-hint-1`):

> Separate the narrator’s introduction from the speaker’s words.

Hint 2, after answer-help recording (`reporting-clause-link-hint-2`):

> Check whether the chosen version keeps the introduction attached to what was said.

Worked support, after worked-help recording (`reporting-clause-link-worked`):

> Mira said, “The path is clear.” The comma follows the reporting clause; the spoken sentence’s full stop remains inside its quotation marks.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### spoken-question-end

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22spoken-question-end%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **support**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 inverted commas and other punctuation, including reporting-clause comma and end punctuation inside inverted commas.

Actual demand: Choose a complete version retaining a genuine question inside its quotation, with the lower-case reporting clause already modelled.

Assessed context/text (visible before Check, not neutral speech):

> Pip calmly asks a real question, expecting an answer; choose the version with correct question and reporting punctuation:

Exact offered controls:

- `version` — Choose the complete version:
  - `v3`: “Is the bridge safe,” asked Pip.
  - `v4`: “Is the bridge safe.” asked Pip.
  - `v2`: “Is the bridge safe”? asked Pip.
  - `v1`: “Is the bridge safe?” asked Pip.

Contextual accepted/rejected rule and post-Check explanation:

> The question mark belongs inside the quotation because Pip’s spoken words ask the question. The following asked Pip is a reporting clause, not a new sentence. A comma or full stop removes the assessed question ending.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Rejected: version |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`spoken-question-end-hint-1`):

> Identify whose words ask for an answer.

Hint 2, after answer-help recording (`spoken-question-end-hint-2`):

> Look at the boundary between the spoken words and the narrator’s attribution.

Worked support, after worked-help recording (`spoken-question-end-worked`):

> “Is the bridge safe?” asked Pip. The question mark completes Pip’s spoken question inside the quotation; the reporting clause follows with a lower-case a.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### speech-before-report

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22speech-before-report%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **core**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 inverted commas and other punctuation, including reporting-clause comma and end punctuation inside inverted commas.

Actual demand: Coordinate quote boundary and comma when the spoken statement comes before a reporting clause; accept both consistent quote styles.

Assessed context/text (visible before Check, not neutral speech):

> Mira calmly states that departure is possible; use the standard speech-before-reporting convention, with either consistent curly quote style:

Exact offered controls:

- `version` — Choose the complete version:
  - `v1`: “We can leave,” said Mira.
  - `v3`: “We can leave”, said Mira.
  - `v4`: “We can leave.” said Mira.
  - `v2`: ‘We can leave,’ said Mira.

Contextual accepted/rejected rule and post-Check explanation:

> The comma is inside the closing quote and connects the spoken statement to said Mira. Single and double curly quotation styles both work. Moving the comma outside or using a full stop before lower-case said breaks the assessed convention.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Accepted, equal credit |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`speech-before-report-hint-1`):

> Notice whether the narrator’s attribution comes before or after the speech.

Hint 2, after answer-help recording (`speech-before-report-hint-2`):

> Check the speech boundary and the connection to the attribution together.

Worked support, after worked-help recording (`speech-before-report-worked`):

> “We can leave,” said Mira. Also accepted: ‘We can leave,’ said Mira. Both put the connecting comma inside the closing quotation mark.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### coordinate-report-first

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22coordinate-report-first%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **core**. Revision `expansion-punctuation-1`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 inverted commas and other punctuation, including reporting-clause comma and end punctuation inside inverted commas.

Actual demand: Coordinate reporting-clause connection and two quote boundaries; all three editable features must work together.

Assessed context/text (visible before Check, not neutral speech):

> The narrator introduces a calm statement; use the book’s reporting-first dialogue convention and matching straight single or double quotes:
> Pip said ___ ___The lantern is ready.___

Exact offered controls:

- `link` — After Pip said:
  - `,`: ,
  - `.`: .
  - `?`: ?
- `open` — Before The lantern:
  - `"`: "
  - `'`: '
- `close` — After ready and its full stop:
  - `"`: "
  - `'`: '

Contextual accepted/rejected rule and post-Check explanation:

> A comma follows Pip said and the whole spoken statement is enclosed by matching quotes. Either offered quote style works. A different linking mark or mismatched quote pair fails the stated dialogue convention.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"link":",","open":"\"","close":"\""}` | Accepted, equal credit |
| `{"link":",","open":"\"","close":"'"}` | Rejected: pair/convention |
| `{"link":",","open":"'","close":"\""}` | Rejected: pair/convention |
| `{"link":",","open":"'","close":"'"}` | Accepted, equal credit |
| `{"link":".","open":"\"","close":"\""}` | Rejected: link |
| `{"link":".","open":"\"","close":"'"}` | Rejected: link |
| `{"link":".","open":"'","close":"\""}` | Rejected: link |
| `{"link":".","open":"'","close":"'"}` | Rejected: link |
| `{"link":"?","open":"\"","close":"\""}` | Rejected: link |
| `{"link":"?","open":"\"","close":"'"}` | Rejected: link |
| `{"link":"?","open":"'","close":"\""}` | Rejected: link |
| `{"link":"?","open":"'","close":"'"}` | Rejected: link |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`coordinate-report-first-hint-1`):

> Distinguish the narrator’s words from the speaker’s words.

Hint 2, after answer-help recording (`coordinate-report-first-hint-2`):

> Check the connection and the two enclosing boundaries as separate jobs.

Worked support, after worked-help recording (`coordinate-report-first-worked`):

> Pip said, "The lantern is ready." and Pip said, 'The lantern is ready.' are both accepted. Each has a comma after the reporting clause and matching quotes around the complete speech.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### apostrophe-inside-speech

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22apostrophe-inside-speech%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **core**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 inverted commas and other punctuation, including reporting-clause comma and end punctuation inside inverted commas.

Actual demand: Distinguish an internal contraction apostrophe from the outer speech boundaries while retaining the speech-to-reporting comma; E06 is context, not a second award.

Assessed context/text (visible before Check, not neutral speech):

> Pip says it is raining; retain the contraction and use either matching curly quotation style around the speech:

Exact offered controls:

- `version` — Choose the complete version:
  - `v3`: “Its raining,” said Pip.
  - `v2`: ‘It’s raining,’ said Pip.
  - `v1`: “It’s raining,” said Pip.
  - `v4`: “It’s raining”, said Pip.

Contextual accepted/rejected rule and post-Check explanation:

> The apostrophe inside It’s represents it is; it is not an outer quotation boundary. Both complete consistent quote styles are accepted. “Its raining,” loses the contraction distinction; “It’s raining”, puts the speech-to-reporting comma outside the quote.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Accepted, equal credit |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`apostrophe-inside-speech-hint-1`):

> Work out which marks belong inside a word and which enclose speech.

Hint 2, after answer-help recording (`apostrophe-inside-speech-hint-2`):

> Compare the complete spoken unit with the narrator’s attribution.

Worked support, after worked-help recording (`apostrophe-inside-speech-worked`):

> “It’s raining,” said Pip. Also accepted: ‘It’s raining,’ said Pip. The internal apostrophe stays in It’s and the connecting comma stays inside the outer closing quote.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### question-and-reply

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22question-and-reply%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **core**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4; Appendix 2 Year 4. Section: Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 inverted commas and other punctuation, including reporting-clause comma and end punctuation inside inverted commas.

Actual demand: Edit two quoted turns together, distinguishing a spoken question from a statement reply before their reporting clauses.

Assessed context/text (visible before Check, not neutral speech):

> Mira asks where the map is and Pip calmly answers; use double curly quotes and retain the standard punctuation for both turns:

Exact offered controls:

- `version` — Choose the complete version:
  - `v2`: “Where is the map,” asked Mira. “In my bag,” said Pip.
  - `v3`: “Where is the map?” asked Mira. “In my bag.” said Pip.
  - `v1`: “Where is the map?” asked Mira. “In my bag,” said Pip.
  - `v4`: “Where is the map”? asked Mira. “In my bag”, said Pip.

Contextual accepted/rejected rule and post-Check explanation:

> The question keeps its question mark inside the quote; the reply takes an internal connecting comma before said Pip. The other versions remove the question ending, break the reply’s reporting connection, or put both marks outside.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Rejected: version |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`question-and-reply-hint-1`):

> Consider the purpose of each spoken turn.

Hint 2, after answer-help recording (`question-and-reply-hint-2`):

> A correct boundary in one turn does not guarantee that the other turn is correct.

Worked support, after worked-help recording (`question-and-reply-worked`):

> “Where is the map?” asked Mira. “In my bag,” said Pip. The first turn is a question; the second is a reply attached to its reporting clause.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### interrupted-one-sentence

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22interrupted-one-sentence%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **stretch**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4 with less-direct editing demand. Section: Writing — composition: proofreading punctuation; vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 (authored extension of convention, not a new statutory year claim).

Actual demand: Track one spoken sentence across an inserted reporting clause, coordinating continuation case and both comma boundaries; additional reasoning beyond uninterrupted dialogue.

Assessed context/text (visible before Check, not neutral speech):

> Mira’s one spoken sentence is interrupted by the narrator; retain that single sentence and use either consistent curly quote style:

Exact offered controls:

- `version` — Choose the complete version:
  - `v2`: ‘When the bell rings,’ said Mira, ‘we will leave.’
  - `v4`: “When the bell rings.” said Mira. “We will leave.”
  - `v3`: “When the bell rings,” said Mira, “We will leave.”
  - `v1`: “When the bell rings,” said Mira, “we will leave.”

Contextual accepted/rejected rule and post-Check explanation:

> The same spoken sentence continues after the reporting clause, so we remains lower-case; commas mark the interruption. Both quote styles work. A capital We breaks the stated continuation convention. “When the bell rings.” leaves a dependent fragment, and a full stop before lower-case said breaks the speech-to-report connection.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Accepted, equal credit |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`interrupted-one-sentence-hint-1`):

> Read just the spoken words, leaving out the narrator’s interruption.

Hint 2, after answer-help recording (`interrupted-one-sentence-hint-2`):

> Decide whether the resumed words continue the same sentence.

Worked support, after worked-help recording (`interrupted-one-sentence-worked`):

> “When the bell rings,” said Mira, “we will leave.” The speech alone is When the bell rings, we will leave. Matching single curly quotes are equally accepted.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### two-spoken-sentences

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22two-spoken-sentences%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **stretch**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4 with less-direct editing demand. Section: Writing — composition: proofreading punctuation; vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 (authored extension of convention, not a new statutory year claim).

Actual demand: Distinguish a new spoken sentence after a reporting clause from a continuation, coordinating narrator full stop and resumed capital; contrast with the interrupted-sentence convention.

Assessed context/text (visible before Check, not neutral speech):

> Mira gives two complete spoken statements with a reporting clause after the first; use either consistent curly quote style:

Exact offered controls:

- `version` — Choose the complete version:
  - `v4`: “The bridge is safe.” said Mira. “We can cross.”
  - `v1`: “The bridge is safe,” said Mira. “We can cross.”
  - `v2`: ‘The bridge is safe,’ said Mira. ‘We can cross.’
  - `v3`: “The bridge is safe,” said Mira, “we can cross.”

Contextual accepted/rejected rule and post-Check explanation:

> The reporting clause ends the first sentence; the second complete spoken sentence begins with We. Both quote styles are accepted. Joining the two independent statements with commas creates a splice under the assessed convention. “The bridge is safe.” said Mira. has a full stop before lower-case said, breaking the speech-to-report connection.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Accepted, equal credit |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`two-spoken-sentences-hint-1`):

> Read each spoken statement on its own.

Hint 2, after answer-help recording (`two-spoken-sentences-hint-2`):

> Compare the boundary after the narrator with an interruption inside one sentence.

Worked support, after worked-help recording (`two-spoken-sentences-worked`):

> “The bridge is safe,” said Mira. “We can cross.” The narrator closes the first sentence, then a new spoken sentence begins with a capital. Consistent single curly quotes also work.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.

### quotation-within-speech

Canonical ID: `lif.english.direct-speech.r1.authored-%5B%22quotation-within-speech%22%2C%5B%5D%5D`. Primary E07 / `E07-direct-speech` / **stretch**. Revision `expansion-punctuation-2`.

Source programme: Years 3–4 with less-direct editing demand. Section: Writing — composition: proofreading punctuation; vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 (authored extension of convention, not a new statutory year claim).

Actual demand: Track two levels of quoted words and their different endpoints; alternating quote styles is an explicit authored extension, not claimed as a statutory Year 4 nested-quotation requirement.

Assessed context/text (visible before Check, not neutral speech):

> Mira repeats Pip’s exact warning inside her own speech; use different curly quote styles for inner and outer speech, and keep the warning emphatic:

Exact offered controls:

- `version` — Choose the complete version:
  - `v1`: “Pip shouted ‘Wait!’ before the gate closed,” said Mira.
  - `v3`: “Pip shouted “Wait!” before the gate closed,” said Mira.
  - `v2`: ‘Pip shouted “Wait!” before the gate closed,’ said Mira.
  - `v4`: “Pip shouted ‘Wait’! before the gate closed,” said Mira.

Contextual accepted/rejected rule and post-Check explanation:

> The inner warning includes its exclamation mark and uses the other quote style; the outer speech ends with the reporting comma. Either outer style is accepted. Using double quotes for both levels violates the stated alternating convention; ‘Wait’! places the warning ending outside its inner quote.

| Complete offered map | Independent editorial disposition |
|---|---|
| `{"version":"v1"}` | Accepted, equal credit |
| `{"version":"v2"}` | Accepted, equal credit |
| `{"version":"v3"}` | Rejected: version |
| `{"version":"v4"}` | Rejected: version |

Neutral pre-Check script:

> Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.

Hint 1, after answer-help recording (`quotation-within-speech-hint-1`):

> Identify whose words appear inside whose speech.

Hint 2, after answer-help recording (`quotation-within-speech-hint-2`):

> Follow each speaker’s boundaries separately, including the ending that belongs to each.

Worked support, after worked-help recording (`quotation-within-speech-worked`):

> “Pip shouted ‘Wait!’ before the gate closed,” said Mira. The inner warning ends inside its single quotes; Mira’s outer speech closes with its comma. Reversing single and double styles consistently is equally correct.

Review: approved; Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed. Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.
