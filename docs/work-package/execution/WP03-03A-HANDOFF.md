# WP03-03A implementation handoff

Implemented by Codex WP03-03A author on 9 October 2026 after explicit execution
authorisation and accepted/committed DEP-010 and DEP-011. This is the bounded
author delivery; Controller retains independent acceptance and integration.
No additional workers, other-chat messages, staging or commit were used.

## Delivered behaviour and ownership

Only these five assigned paths were authored:

- `src/content/starter-english.ts`: `STARTER_PUNCTUATION_TASKS` (exactly twelve
  original reviewed support tasks) and `STARTER_PUNCTUATION_MANIFEST` (all twelve
  IDs, 60 independently specified complete cases plus five draft/invalid cases).
- `src/learning/evaluators/starter-punctuation.ts`:
  `validateStarterPunctuationTask(task)` and
  `evaluateStarterPunctuation(task, response)`, pure synchronous family functions.
- `tests/learning/starter-punctuation.test.ts`: independent editorial oracle,
  complete and partial finite spaces, malformed inputs/content and narration.
- `docs/content-review/starter-punctuation.md`: complete accepted/rejected matrix,
  contextual reasons, retained curriculum/provenance, demand and exact offered
  prompt/instruction/hints/worked-support/explanation/narration appendix.
- This handoff.

The anchor is `lif.english.punctuation.r1.spellbook-anchor`, with fixed words,
case and comma and slots `question` / `discovery`. Exactly `{question:'?',
discovery:'.'}` and `{question:'?', discovery:'!'}` are correct with identical
results and no slot issues. All other seven complete pairs are judged wrong.
Two lines never create two learning/reward questions.

The other authored keys are exactly `spellbook-01` through `spellbook-11`.
They cover calm records, yes/no information, polite questions, reported thoughts,
quiet/emphatic admiration, urgent warning, routine directions, discovery then
question, confirmation with statement word order, two questions and identical
words used for an excited cheer versus a calm log. These are contextual purpose
differences, not name substitutions or an invented difficulty progression.
All twelve use E06 / `E06-punctuation` / support, with the earlier Year 1 terminal
objective explicitly consolidated in Years 3–4. No core/stretch/efficacy claim.

The accepted identity helper takes `english.punctuation` and supplies the `lif.`
prefix. This resolves the child wording's namespace shorthand without changing
the contract or producing `lif.lif...`. Non-anchor canonical IDs use the helper's
encoded authored-key format. Consumers must import the bank/identity helper,
not invent a `.spellbook-01` suffix. Empty descriptor parameters remain empty;
responses, order, revision and week never refresh identity.

## Consumer contract and finite evidence

`responseSpec.slots` supplies stable semantic IDs, exact assessed line labels and
three glyph options. `assessedText` begins with the scene followed by the lines
with `___` terminal spaces; line order corresponds to the authored slot order.
The UI returns `{kind:'punctuation', slots:{...}}` using IDs and glyphs, not
visible text as an answer. It may reorder slots/options without changing their
labels/IDs or the whole-task judgement. Missing/feedback order stays authored.

The independent oracle reviews **60 complete maps: 15 accepted, 45 wrong**.
It also traverses all **132 permitted partial maps**, including already-wrong
filled slots next to blanks. Absent/null/empty-string known slots are incomplete.
Unknown/extra slots and malformed values are invalid before checking missing
slots. No trimming, coercion, substring matching or arbitrary text grading.
No incomplete, invalid or unavailable result carries correctness/reward facts.

Each wrong slot returns `punctuation-context`, its exact observed glyph, slot ID
and approved context explanation. The exhaustive oracle verifies every issue
slot/code/observation and explanation. Examples actually observed:

| Anchor slots | Status / correctness | Issue slots (in order) |
|---|---|---|
| `{question:'?', discovery:'.'}` | judged / true | none |
| `{question:'?', discovery:'!'}` | judged / true; deeply equal result to preceding row | none |
| `{question:'.', discovery:'?'}` | judged / false | question, discovery |
| `{question:'?', discovery:'?'}` | judged / false | discovery |
| `{question:'?', discovery:null}` | incomplete | missing discovery; no judged feedback |
| `{question:' ?', discovery:'.'}` | invalid-response | no judgement |
| Correct slots plus `extra:null` | invalid-response | no judgement |

The validator fails closed for changed/unreviewed descriptors, domains, accepted
maps, context, source/objective/band, assistance or narration. Merely setting
`review.status='approved'` cannot author a new task. The reference bank is deeply
frozen. A valid nonempty cosmetic revision ID and semantic slot/option/map
reordering are allowed. A prose correction must update/review the owned source
bank and its revision; the validator cannot certify arbitrary external prose.
Validation is for ordinary JSON-like content and response data, not executable
getters or hostile proxies. The downstream aggregator still owns catalogue and
binding validation and dispatch; WP04 resolves trusted content before grading.

## Narration/assistance handoff

Exact neutral pre-Check script for every task:

> Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.

Every record sets `assessedTextMayBeSpokenBeforeCheck:false`. Its scene, unfinished
lines and semantic line labels must not be passed to neutral speech or completed
with selected marks before Check. Use neutral ordinal space labels for routine
spoken controls; identify all offered glyphs equally, without recommending one.
The complete review appendix retains all actual hint/worked/explanation text.

Both hints avoid naming an answer or modelling a completed sentence, but remain
answer help: WP04 records `answerHintUsed` before reveal. Worked support contains
answers and requires `workedSupportUsed` before reveal, including when requested
before Check. Reading help aloud retains its assistance category. Any later
assessed-text listening retains its listening-supported meaning where relevant.
Post-Check explanation is not a neutral pre-Check script. Text alone suffices.

Music/effects/voice availability are absent from the pure evaluator inputs.
Actual local-English voice selection/fallback, audible quality, Stop, Silence
all, ducking and remembered controls remain WP02. Durable help/draft/retry/reload
and one-canonical-question reward attribution remain WP04/WP05 and integration.

## Checks run and limitations

Bundled Node 24 executable:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
Final successful commands from repository root:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node src/content/starter-english.ts src/learning/evaluators/starter-punctuation.ts tests/learning/starter-punctuation.test.ts
node node_modules/vitest/vitest.mjs run tests/learning/starter-punctuation.test.ts tests/learning/identity.test.ts --no-cache
```

Scoped nonincremental TypeScript: passed. Final no-cache Vitest: **2 suites,
256 tests passed** (237 punctuation, 19 existing identity). The initial focused
run passed 236 punctuation tests; a sparse-array content validation case was
added during final review and the full scoped run above then passed.
Cases include JSON roundtrip/fresh null-prototype map, immutable inputs, both
anchor endings, exact canonical count, alternate contexts, invalid-before-missing,
unavailable-content precedence, identity/reorder/revision invariance and the
65 runnable manifest cases. Import guards exclude UI/state/audio/reward/browser
dependencies. These are family-flow checks, not actual game/control integration.

An initial source typecheck found mixed manifest fixtures inferred optional
undefined properties incompatible with the shared slot map. Explicit generic
contextual typing fixed that compile-time construction issue; no grading rule
changed. A one-off documentation reproduction command initially assumed the
installed TypeScript package exposed its older JavaScript transpile API. It
failed before writing. Reproduction then succeeded using Node's built-in type
stripper over the owned source and accepted identity helper; no package/config
changes or retained utility were needed. The resulting appendix is exact source
text, while the answer matrices/tests remain separately authored oracles.

Final owned-path `git diff --check` passed. Because the five authored paths were
new/untracked, a separate direct scan checked all five for trailing whitespace
and final newlines: passed. A source-to-review text check confirmed exactly
twelve appendix records and exact context/lines, neutral narration, both hints,
worked support and explanation for every record. Final Git status showed the
five owned paths alongside other authors' audio/policy changes; no unrelated
file was changed by this author.
No broad build/test run, browser play, published run, audible listening, durable
save, reward or world-restoration acceptance is claimed. WP03-05A consumes the
family/manifest and supplies binding/selection observations; WP02/WP04 exercise
actual controls and persistence; WP06 later checks the published PC/tablet flow.

No material source-contract defect was found. Unrelated working changes from
other authors were preserved, and shared contracts/bindings/config/locks/assets
and execution ledgers were not edited by this author.

## Independent-review repair — F01/F02, 9 October 2026

Read the independent `WP03-03A-VALIDATION.md` findings and reproduced both with
the actual source modules before editing. This follow-up changes only the owned
evaluator, punctuation tests and this handoff. The approved content bank,
content-review document, independent validation report, contracts and all other
sources remain unchanged. No commit was made. Ready for narrow independent
recheck; this author does not close the independent findings administratively.

| Finding / exact reproduction | Observed before | Observed after |
|---|---|---|
| F01: clone anchor; delete `responseSpec.slots[1].options[2]`; Check `{question:'?',discovery:'!'}` | Validator `[]`; evaluator `judged`, `correct:true`, despite unavailable `!` control | Validator returns only `slot-domain-mismatch`; evaluator returns `unavailable-content` with those same issues and no judgement |
| F02: JSON-decoded clone; `requiredSlotIds = JSON.parse('[{"toString":null},"discovery"]')`; same valid Check | Both public functions throw `TypeError: Cannot convert object to primitive value` | Validator returns only `slot-domain-mismatch`; evaluator returns `unavailable-content` with those same issues; neither throws |

F01's causal defect was `Array.every` skipping a hole while the subsequent Set
count treated its mapped undefined entry as a third value. F02's causal defect
was sorting before proving that required IDs were strings. A small `denseEvery`
helper now checks an own element at every index and validates its value. Glyph
options use it before ID uniqueness checking. Required-slot IDs use it to prove
dense string elements before sorting; sorting cannot coerce malformed objects.
No downstream catch, grading compensation, domain/answer change or narration
change was introduced. Semantic slot/option/requirement reordering still passes.

Added **43 focused validator→evaluator regressions**:

- F01: both anchor slots × all three glyph positions × hole/null/undefined =
  18 cases, each also checked after JSON roundtrip. Each uses a correct anchor
  response through the evaluator, so content rejection is proven before grading.
- F02: eight malformed element types × both required-ID positions, both single
  holes, and the exact JSON reproduction = 19 cases. Types include null,
  undefined, number, boolean, object, array, the non-coercible JSON object and
  symbol. Both exported entry points return issues/unavailable without throwing.
- All six glyph permutations with reversed slots and requirements = six cases,
  each exercising all nine complete anchor answers and comparing whole results.

Successful commands, using the same bundled Node executable as above:

```text
node node_modules/vitest/vitest.mjs run tests/learning/starter-punctuation.test.ts -t "independent-review malformed control regressions" --no-cache
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node src/content/starter-english.ts src/learning/evaluators/starter-punctuation.ts tests/learning/starter-punctuation.test.ts
node node_modules/vitest/vitest.mjs run tests/learning/starter-punctuation.test.ts tests/learning/identity.test.ts --no-cache
```

Observed: targeted **43 passed, 237 skipped**; scoped nonincremental TypeScript
passed; complete scoped regression **2 suites, 299 passed** (280 punctuation,
19 identity). This rechecks the unchanged 60 complete maps, 132 partial maps,
65 manifest cases, identity and neutral narration. Before-repair probes were
fresh observations, not passing evidence; the after results are fresh test
executions. No broad application/browser/audio/state check was run.

SHA-256 comparison against the independent review confirms the untouched bank
`b49ae55dc3ddb98c4af522baa7c64d860b6c8663d206c5026311309870440a6b`
and content review
`7a3893d56707d86dbc1b41595af79c349aa32e7718b8f5dd6b2c3718987d9b54`.
The previously reviewed content/identity/narration assessment remains reusable;
the independent recheck can be limited to the two validator findings and their
focused evidence. The reviewer’s downstream note about preserving cheer/log
scene-to-slot association for task 11 remains an actual-control integration check.
