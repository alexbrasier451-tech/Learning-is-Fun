# Starter punctuation content review — WP03-03A

Author and bounded reviewer: Codex WP03-03A author (AI), 9 October 2026.
This is an author review with an independently specified finite answer oracle,
not an independent human review, qualified educator approval, child study or
evidence of efficacy. Administrative/independent acceptance belongs to Controller.
All twelve tasks are approved for the constrained contexts below. No ambiguity
is left for the evaluator to infer from arbitrary free text.

## Curriculum, identity and scope

Retained source: [DfE English programme of study](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study),
checked in the accepted WP03-01A research on 8 October 2026. No new research or
copied question bank was used. Exact selected objective: Year 1, Writing —
vocabulary, grammar and punctuation, beginning to punctuate sentences using a
capital letter and a full stop, question mark or exclamation mark; also English
Appendix 2, Year 1 — Punctuation. This bank assesses only choosing terminal
marks; capital letters, spelling, commas and all other words are fixed.
It consolidates that earlier learning in the Years 3–4 planning context.
All tasks have primary skill E06, objective `E06-punctuation`, band `support`,
and no separately assessed contextual skills. Different forms and purposes make
meaningful practice, not an invented core/stretch progression or mastery test.

The accepted identity implementation takes descriptor family
`english.punctuation`, adds `lif.`, and uses equivalence `r1`. This implements
the child's `lif.english.punctuation` canonical namespace without doubling the
prefix. The anchor's exact ID is `lif.english.punctuation.r1.spellbook-anchor`.
The remaining authored keys are `spellbook-01` through `spellbook-11`, using the
accepted identity helper's encoded authored-key form, with empty parameters.
No custom replacement ID scheme was introduced. All twelve IDs are retained in
the manifest. Both anchor lines are ONE scored canonical question. Alternate
endings, slot/option/answer-map order, revision and week do not create new IDs.
Cosmetic wording revisions require a reviewed source-bank update and a new
`contentRevision`; they retain the descriptor. Educational changes require an
explicit identity/equivalence review, not silent relabelling.

## Independent complete-answer review

These editorial matrices were specified separately from the evaluator and
answer rules. The test oracle records these decisions independently and feeds
every complete map through the actual validator/evaluator. Every space offers
exactly `.`, `?`, `!`; no substring matching, punctuation stripping or prose
normalisation occurs. `A` means accepted, `R` means a judged contextual mismatch.
Rejection does not claim that the words could never take that mark elsewhere.

For one-slot tasks the slot ID, each of the three dispositions and its reason:

| Key | Slot | `.` | `?` | `!` |
|---|---|---|---|---|
| spellbook-01 | record | A: calm factual growing record | R: turns the record into a confirmation question | R: adds emphasis excluded by the neutral diary context |
| spellbook-02 | lantern | R: fails to mark the yes/no request | A: genuine information question | R: emphasis does not match the calm information question |
| spellbook-03 | request | R: fails to mark the offered question | A: polite question allowing yes or no | R: does not match the calm request framed as a question |
| spellbook-04 | thought | A: statement reporting wondering | R: the whole journal sentence reports a thought rather than directly asking | R: adds emphasis absent from the calm journal entry |
| spellbook-05 | admiration | A: quiet admiration | R: admiration is not an information question despite initial What | A: excited admiration, equally accepted |
| spellbook-06 | warning | R: calm report does not convey the explicitly requested alarm | R: uncertainty does not match the warning | A: emphatic urgent warning |
| spellbook-07 | direction | A: routine calm written direction | R: turns a direction into a query | R: adds emphasis excluded by this routine card |
| spellbook-09 | confirmation | R: states what the walker is actually unsure of | A: confirmation question despite statement word order | R: emphasises the words without marking this calm yes/no check |

Two-slot rejection codes identify exactly the mismatching slots:

- **AQ**: anchor `question` needs `?` because it asks where the books are.
- **AD**: anchor `discovery` cannot use `?`: the books have been found. Both
  `.` (calm) and `!` (excited) are legitimate and equally correct.
- **OD**: 08 `door` cannot use `?`: the open door is a discovery, calm or excited.
- **OK**: 08 `key` needs `?`: it asks who has the key.
- **TP**: 10 `path` needs `?`: it asks which path leads home.
- **TC**: 10 `crossing` needs `?`: it asks whether the route crosses the river.
- **EC**: 11 `cheer` needs `!`: strong excitement is explicitly required; `.`
  would suppress that requested tone, `?` would introduce uncertainty.
- **EL**: 11 `log` needs `.`: a calm factual record is explicitly required;
  `?` would introduce uncertainty and `!` would add excluded emphasis.

| First / second mark | anchor: question / discovery | 08: door / key | 10: path / crossing | 11: cheer / log |
|---|---|---|---|---|
| `.` / `.` | R AQ | R OK | R TP, TC | R EC |
| `.` / `?` | R AQ, AD | A calm discovery + question | R TP | R EC, EL |
| `.` / `!` | R AQ | R OK | R TP, TC | R EC, EL |
| `?` / `.` | A question + calm discovery | R OD, OK | R TC | R EC |
| `?` / `?` | R AD | R OD | A two information questions | R EC, EL |
| `?` / `!` | A question + excited discovery | R OD, OK | R TC | R EC, EL |
| `!` / `.` | R AQ | R OK | R TP, TC | A cheer + calm log |
| `!` / `?` | R AQ, AD | A excited discovery + question | R TP | R EL |
| `!` / `!` | R AQ | R OK | R TP, TC | R EL |

Totals: eight single-slot tasks × three maps plus four double-slot tasks × nine
maps = **60 complete maps: 15 accepted and 45 rejected**. The anchor alone has
exactly two accepted and seven rejected maps. The fixed comma and case in
`Where are my magic books` / `Look, there they are` are preserved. Accepted
completed anchor text is exactly “Where are my magic books?” followed by either
“Look, there they are.” or “Look, there they are!”

## Partial and malformed responses

The shared shape is `{kind: 'punctuation', slots: {slotId: mark}}`.

| Input class (each task) | Disposition and reason |
|---|---|
| Known slot absent, null or empty string, other supplied values legal | `incomplete`, missing IDs in authored order; no judgement or feedback, even when a filled slot would later be wrong |
| Empty plain map | `incomplete`, all required IDs missing |
| Complete known legal map | `judged`, using the complete independent matrix above |
| Unknown/extra slot, even with null or on an otherwise correct map | `invalid-response`; not an available control response |
| Unknown top-level field or wrong/missing response kind | `invalid-response`; wrong shared shape |
| Slot value undefined, number, boolean, object, array or any nonempty string other than the three exact marks | `invalid-response`; no coercion or trimming |
| Whitespace, multi-mark `!!`, full-width punctuation, mark names, a completed sentence | `invalid-response`; not glyph IDs |
| Null/array/non-plain response or slot map; inherited slot values; symbol extra keys | `invalid-response`; not a plain, explicit slot map |
| Any malformed supplied value plus a missing slot | `invalid-response` takes precedence over incomplete |
| Unapproved/changed contextual content, identity/domain/help/narration mismatch | `unavailable-content`; this is a content defect, never learner error |

Exhaustive permitted partial-state oracle: each slot may be absent/null/empty
string/`.`/`?`/`!`. Eight singles have three partial states each; four pairs have
36−9=27 partial states each: **132 partial maps**, all unscored. Tests also run
28 malformed input variants for each task and reject faulty task definitions.
Null-prototype plain JSON-equivalent maps are allowed. The runtime expects
ordinary decoded data, not arbitrary executable getters/proxies.

Wrong complete maps return `punctuation-context` for each and only the
mismatching slot, retaining its exact observed glyph and the approved contextual
explanation. Whole-task `correct` is false if either slot is wrong; slot feedback
never creates another scored opportunity. All correct maps give an empty issue
list and the same task-level fields. For the anchor the two success results are
deeply equal. Wrong `question='.', discovery='?'` gives issues in order
`question`, `discovery`; `question='?', discovery='?'` gives only `discovery`.
The complete 60-case oracle checks actual slot IDs, code, observed glyph and
explanation, not just a Boolean.

## Narration and assistance disposition

Each record supplies the exact neutral script reproduced below. This is the
instruction/control role and is safe before Check without an answer-help flag.
It contains no completed assessed line, semantic slot label, selected answer,
mark name or expressive delivery cue. `assessedText` contains the context and
unfinished lines; slot labels contain the exact unfinished line without a mark.
Those labels and that text are assessed content, not neutral narration. Every
record has `assessedTextMayBeSpokenBeforeCheck: false`: the runtime must not
automatically synthesise the lines, append chosen marks, or infer spoken
punctuation from intonation before Check. Slot labels identify fields visually;
neutral spoken controls may say “first space” or “second space”. Glyph controls
may identify every offered mark equally; they must not recommend one for a slot.

| Content role | Earliest availability | Assistance meaning |
|---|---|---|
| Neutral instruction and routine controls | Before any Check, text or optional read-aloud | No answer assistance |
| Context and unfinished lines | Visible from opening the task | Assessed text; no pre-Check modelled speech for this family |
| Hint 1 and hint 2 | On explicit help request, including before Check | Persist `answerHintUsed` before revealing; speech preserves that meaning |
| Worked support | On explicit assisted-support request, including before Check | Persist `workedSupportUsed` before revealing; contains actual answers |
| Correct/incorrect explanation and completed-line narration | After valid Check; or via explicit worked support with its help meaning | Feedback after Check must not be mislabelled as neutral pre-Check speech |
| Reading assessed text where later offered | Subject to the timing restriction above | `assessedTextReadAloud`, listening-supported evidence where relevant; not erased by calling it accessibility |

The two hints per task direct attention to purpose/context but give no mark,
completed answer or rule mapping a specific line to a mark. They are still
answer assistance, never independent evidence. All actual scripts below were
read in this review; automated checks additionally pin neutral text and rule out
mark names/completed-answer punctuation in hints. That lexical check is a guard,
not proof of semantic safety.

Text contains everything needed to complete every task. Music/effects, absent
local voice and channel preferences are not evaluator inputs and change no
answer matrix. WP02 owns audible verification, local English voice fallback,
Stop, Silence all and ducking; WP04 owns durable assistance before reveal.
No audible listening or runtime persistence evidence is claimed here.

## Approved records and exact offered text

The following appendix is reproduced from the authored records to retain the
actual prompts, field IDs, neutral text, both hints, worked support and review
reason. It is not the independent correctness oracle; the matrices above and
the separately written test oracle supply that.

### spellbook-anchor

Canonical ID: `lif.english.punctuation.r1.spellbook-anchor`. Revision: `starter-punctuation-1`.

Demand: Introductory two-line search and discovery; distinguish a real information question from a finding with two legitimate tones. Both lines form one question for learning evidence. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> The reader asks where the missing books are. Then the reader spots them. The discovery may be calm or excited; the reader is no longer asking where they are.
> Where are my magic books ___
> Look, there they are ___

Slot labels: `question` = Where are my magic books; `discovery` = Look, there they are.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-anchor-hint-1`), only after answer-help recording:

> Think about what changes between searching and finding.

Hint 2 (`spellbook-anchor-hint-2`), only after answer-help recording:

> Use the scene to decide what each line is doing. The two lines need not have the same ending.

Worked support (`spellbook-anchor-worked`), only after worked-help recording:

> Where are my magic books? Look, there they are. This is a question followed by a calm discovery. Where are my magic books? Look, there they are! This is the same question followed by an excited discovery. Both complete versions are correct.

Post-Check explanation:

> The first line asks where the books are, so it ends with a question mark. The second tells of a discovery: a full stop is a calm observation and an exclamation mark is an excited one. Both discoveries work equally well. A question mark would make the discovery uncertain, outside this scene.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Introductory two-line search and discovery; distinguish a real information question from a finding with two legitimate tones. Both lines form one question for learning evidence.

### spellbook-01

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-01%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Recognise a neutral factual record, with a specified calm writing purpose rather than a universally fixed ending for these words. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> Write a calm, factual entry in a growing diary. The writer is recording what is visible, without asking or showing surprise.
> The seed has two leaves ___

Slot labels: `record` = The seed has two leaves.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-01-hint-1`), only after answer-help recording:

> Think about why the writer is making this diary entry.

Hint 2 (`spellbook-01-hint-2`), only after answer-help recording:

> Compare the job of a record with the job of a message asking someone to respond.

Worked support (`spellbook-01-worked`), only after worked-help recording:

> The seed has two leaves. The full stop finishes a calm factual record. The other endings would change the purpose or tone given in the scene.

Post-Check explanation:

> A full stop fits this calm diary record. A question mark would ask for confirmation, and an exclamation mark would add emphasis or excitement that this entry does not call for.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Recognise a neutral factual record, with a specified calm writing purpose rather than a universally fixed ending for these words.

### spellbook-02

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-02%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Identify a genuine yes-or-no information question, contrasting with the anchor’s where question. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> The lamp keeper cannot see the lantern. The keeper calmly asks a friend for a yes-or-no answer.
> Is the lantern lit ___

Slot labels: `lantern` = Is the lantern lit.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-02-hint-1`), only after answer-help recording:

> Think about what the keeper needs from the friend.

Hint 2 (`spellbook-02-hint-2`), only after answer-help recording:

> Imagine what a useful reply from the friend would do.

Worked support (`spellbook-02-worked`), only after worked-help recording:

> Is the lantern lit? The keeper is asking for information. The question mark shows that a reply is wanted.

Post-Check explanation:

> Is the lantern lit? asks for an answer, so it needs a question mark here. A full stop does not signal the question; an exclamation mark would not match this calm request for information.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Identify a genuine yes-or-no information question, contrasting with the anchor’s where question.

### spellbook-03

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-03%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Recognise a polite request framed as a genuine question, not a shouted command. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> A gardener politely asks whether a helper can carry a basket. This is a real, calm question: the helper may say yes or no.
> Could you carry this basket ___

Slot labels: `request` = Could you carry this basket.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-03-hint-1`), only after answer-help recording:

> Notice how the gardener approaches the helper.

Hint 2 (`spellbook-03-hint-2`), only after answer-help recording:

> Consider whether the helper has been invited to respond before doing anything.

Worked support (`spellbook-03-worked`), only after worked-help recording:

> Could you carry this basket? This polite request is phrased as a question and allows a reply, so it ends with a question mark.

Post-Check explanation:

> Could you carry this basket? is a polite question in this scene. A question mark fits the invitation to answer. A full stop or an exclamation mark would not express the supplied calm question.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Recognise a polite request framed as a genuine question, not a shouted command.

### spellbook-04

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-04%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Distinguish an indirect wondering statement from a direct question; the word where alone does not determine the ending. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> A traveller writes a calm statement about a thought in a private journal. The traveller is describing being curious, not directly asking anyone for an answer.
> I wonder where the path leads ___

Slot labels: `thought` = I wonder where the path leads.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-04-hint-1`), only after answer-help recording:

> Look at the beginning of the whole line, not just one word inside it.

Hint 2 (`spellbook-04-hint-2`), only after answer-help recording:

> Use the journal context to decide whose thought is being described.

Worked support (`spellbook-04-worked`), only after worked-help recording:

> I wonder where the path leads. This sentence calmly reports the traveller’s wondering. A direct question would have different wording, such as Where does the path lead?

Post-Check explanation:

> I wonder where the path leads. reports a thought in this journal. The full stop suits the calm statement. The word where occurs inside it but does not turn the whole sentence into a direct question here; excitement is not part of the scene.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Distinguish an indirect wondering statement from a direct question; the word where alone does not determine the ending.

### spellbook-05

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-05%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Recognise admiration rather than a question despite initial What, allowing both a quiet and an emphatic reading. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> A watcher admires the night sky. The words may express quiet admiration or an excited response. The watcher is not asking what the sky is.
> What a beautiful sky ___

Slot labels: `admiration` = What a beautiful sky.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-05-hint-1`), only after answer-help recording:

> Consider the watcher’s purpose in speaking.

Hint 2 (`spellbook-05-hint-2`), only after answer-help recording:

> The first word is only one clue. Read the whole line with the scene in mind.

Worked support (`spellbook-05-worked`), only after worked-help recording:

> What a beautiful sky. is the quiet version. What a beautiful sky! is the excited version. Both match the admiration allowed in this scene; neither asks for information.

Post-Check explanation:

> What a beautiful sky. can express quiet admiration; What a beautiful sky! makes it emphatic. Both tones are offered here. A question mark would suggest a question, but the watcher is admiring the sky rather than requesting information.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Recognise admiration rather than a question despite initial What, allowing both a quiet and an emphatic reading.

### spellbook-06

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-06%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Use an emphatic ending for an explicitly urgent warning; recognise that statement-shaped words can carry alarm. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> A scout sees a branch falling towards a friend and shouts an urgent warning. Show the alarm in the ending, not a calm report or a question.
> The branch is falling ___

Slot labels: `warning` = The branch is falling.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-06-hint-1`), only after answer-help recording:

> Think about how quickly the friend needs to notice this message.

Hint 2 (`spellbook-06-hint-2`), only after answer-help recording:

> Compare the feeling in an urgent warning with a calm description.

Worked support (`spellbook-06-worked`), only after worked-help recording:

> The branch is falling! The exclamation mark supplies the emphatic alarm the scene asks for. These words could have a different ending in a different scene.

Post-Check explanation:

> The branch is falling! uses an exclamation mark to show the urgent alarm requested here. A full stop could suit a calm report in another scene, and a question mark could ask for confirmation, but neither expresses this shouted warning.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Use an emphatic ending for an explicitly urgent warning; recognise that statement-shaped words can carry alarm.

### spellbook-07

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-07%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Recognise that a calm direction can end with a full stop; imperative wording alone does not require emphasis. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> A guide writes one calm direction on a walking card. It is a routine instruction, without alarm, excitement or a request for confirmation.
> Turn left at the oak ___

Slot labels: `direction` = Turn left at the oak.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-07-hint-1`), only after answer-help recording:

> Think about how the walking card will be used.

Hint 2 (`spellbook-07-hint-2`), only after answer-help recording:

> Read the description of the guide’s tone as well as the words on the card.

Worked support (`spellbook-07-worked`), only after worked-help recording:

> Turn left at the oak. The full stop ends a routine direction. A command or instruction does not always need an exclamation mark.

Post-Check explanation:

> Turn left at the oak. is a calm written direction. The full stop suits this routine instruction. An exclamation mark would add emphasis not requested here; a question mark would change the direction into a query.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Recognise that a calm direction can end with a full stop; imperative wording alone does not require emphasis.

### spellbook-08

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-08%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Switch from a discovery to an information question in the reverse order from the anchor; preserve both allowed discovery tones. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> An explorer discovers an open hidden door, calmly or excitedly. Then the explorer calmly asks the group who has the key, expecting an answer.
> The hidden door is open ___
> Who has the key ___

Slot labels: `door` = The hidden door is open; `key` = Who has the key.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-08-hint-1`), only after answer-help recording:

> Track what the explorer does first and what happens next.

Hint 2 (`spellbook-08-hint-2`), only after answer-help recording:

> Consider the job of each line separately before comparing your choices.

Worked support (`spellbook-08-worked`), only after worked-help recording:

> The hidden door is open. Who has the key? works, and The hidden door is open! Who has the key? works too. The discovery may have either tone; the second line still asks for information.

Post-Check explanation:

> The hidden door is open. is a calm discovery and The hidden door is open! is an excited one; both fit. Who has the key? is the separate information question. Questioning the discovery or failing to mark the request for information changes the supplied scene.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Switch from a discovery to an information question in the reverse order from the anchor; preserve both allowed discovery tones.

### spellbook-09

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-09%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Use the supplied communicative purpose to identify a confirmation question even with statement word order. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> A walker is unsure whether a friend brought the map. The walker uses these words as a calm question to check, expecting yes or no, not as a statement.
> You brought the map ___

Slot labels: `confirmation` = You brought the map.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-09-hint-1`), only after answer-help recording:

> Decide what the walker already knows and what is still uncertain.

Hint 2 (`spellbook-09-hint-2`), only after answer-help recording:

> Use the scene as well as the word order to understand this message.

Worked support (`spellbook-09-worked`), only after worked-help recording:

> You brought the map? The question mark shows that the walker wants confirmation. You brought the map. would confidently state something instead.

Post-Check explanation:

> You brought the map? uses a question mark because the unsure walker is checking. Statement word order does not prevent a question in this dialogue. A full stop would state the fact, and an exclamation mark would emphasise it instead of marking the calm check.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Use the supplied communicative purpose to identify a confirmation question even with statement word order.

### spellbook-10

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-10%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Maintain two question purposes with different answer types; do not assume adjacent lines must use different marks. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> A visitor calmly asks two separate things about the route. The visitor wants both a path name and a yes-or-no answer about a river crossing.
> Which path leads home ___
> Does it cross the river ___

Slot labels: `path` = Which path leads home; `crossing` = Does it cross the river.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-10-hint-1`), only after answer-help recording:

> Think about the two pieces of information the visitor needs.

Hint 2 (`spellbook-10-hint-2`), only after answer-help recording:

> Each line has its own job. Adjacent lines may need the same kind of ending.

Worked support (`spellbook-10-worked`), only after worked-help recording:

> Which path leads home? Does it cross the river? Both lines are questions even though the replies would be different kinds of information.

Post-Check explanation:

> Which path leads home? asks for a path, and Does it cross the river? asks for yes or no. Both need question marks here. Full stops or exclamation marks do not express the two calm questions the visitor is asking.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Maintain two question purposes with different answer types; do not assume adjacent lines must use different marks.

### spellbook-11

Canonical ID: `lif.english.punctuation.r1.authored-%5B%22spellbook-11%22%2C%5B%5D%5D`. Revision: `starter-punctuation-1`.

Demand: Contrast two purposes for identical words: emphatic celebration versus neutral record. Context rather than vocabulary changes the chosen ending. Earlier terminal-punctuation consolidation, not a core or stretch Years 3–4 punctuation claim.

Assessed context and displayed lines (each ___ is a terminal space; line order maps to the slot order below):

> First, a team cheers its result with strong excitement; show that excitement in the ending. Later, the team writes the same words as a calm factual record in its log, without emphasis.
> We won the race ___
> We won the race ___

Slot labels: `cheer` = We won the race; `log` = We won the race.

Neutral instruction/read-aloud, available before Check:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Hint 1 (`spellbook-11-hint-1`), only after answer-help recording:

> The words stay the same, but the two situations change.

Hint 2 (`spellbook-11-hint-2`), only after answer-help recording:

> Compare why the team speaks first with why it writes later.

Worked support (`spellbook-11-worked`), only after worked-help recording:

> We won the race! is the excited cheer. We won the race. is the calm log entry. The words are identical, but their purposes call for different endings here.

Post-Check explanation:

> We won the race! gives the cheer the strong excitement requested. We won the race. suits the later calm log. A question mark would express uncertainty not present in either use; exchanging the other endings would exchange their requested tones.

Review disposition: approved. All finite endings reviewed against this context, with both hints and narration checked for answer leakage. Contrast two purposes for identical words: emphatic celebration versus neutral record. Context rather than vocabulary changes the chosen ending.
