# WP03-03A independent implementation validation

Date: 9 October 2026. Reviewer: Codex, fresh independent AI review chat; not the
implementation author or a qualified educator.

**Verdict: ACCEPTED after F01/F02 correction recheck. Open findings: NONE.**
The twelve authored tasks, contextual answer matrices, identity, assistance and
neutral narration pass this bounded review. Both P2 malformed-content findings
are resolved by the narrow independent recheck below. Original failure evidence
is retained as history. Controller owns administrative acceptance.

## Scope and evidence boundary

Read WP03-03A and its handoff; the actual content, evaluator and punctuation and
identity tests; the complete content-review matrix and offered scripts; the
accepted learning contracts/identity/registry and WP03-01A evidence; the relevant
WP02-01A handoff/validation and art-direction narration contract; GLOBAL_RULES
and DEC-004/007/008/010/020. Execution authority supersedes historical planning
restrictions. This reviewer writes only this report, with no implementation,
test, configuration, cache, ledger or Git mutation, delegation or other-chat
message. Concurrent adaptive and audio work is outside this verdict.

Reviewed HEAD: `8292030d3fea46a39a7f48022448030fade76266`; the punctuation
implementation is untracked. Reviewed SHA-256 snapshots:

| File | SHA-256 |
|---|---|
| `src/content/starter-english.ts` | `b49ae55dc3ddb98c4af522baa7c64d860b6c8663d206c5026311309870440a6b` |
| `src/learning/evaluators/starter-punctuation.ts` | `6a7d05e3baecee7bd4d3cd5a366ad30682ccb042a45e37ccc38ec86c67d03e57` |
| `tests/learning/starter-punctuation.test.ts` | `476ff28aa4deabf6f9bd4b1567544fbde9a4740f4eb224f55bff95165f5babbf` |
| `docs/content-review/starter-punctuation.md` | `7a3893d56707d86dbc1b41595af79c349aa32e7718b8f5dd6b2c3718987d9b54` |

## Original findings — both resolved

The locations and observations below refer to the initial reviewed source.
Resolution evidence and corrected snapshots are recorded at the end.

### F01 — [P2] Reject holes in the glyph option array

Location: `src/learning/evaluators/starter-punctuation.ts:86–89`.

Clone the anchor, then `delete task.responseSpec.slots[1].options[2]`.
The array still has length three but offers only `.` and `?`. Validation returns
`[]`; evaluating `{kind:'punctuation',slots:{question:'?',discovery:'!'}}`
returns `judged`, `correct:true`. Deleting either other index also passes.
`every` skips the hole, and the mapped array contributes `undefined` as a third
Set member, so cardinality alone does not prove all three marks exist.

This is ordinary in-memory data, with no getter or proxy. JSON serialization
turns the hole into null and that version is correctly rejected; the two producer
paths therefore disagree. The bank is imported directly and the existing suite
already treats sparse authored arrays as a content-validation case.

Invalidated criterion: the exported validator's exact reviewed slot domain and
the handoff's promise that changed/malformed content is unavailable rather than
scored. A renderer mapping this array can omit a legitimate answer while the
content is certified. Require dense, individually validated options and exactly
the approved glyph IDs. Recheck every possible single hole, explicit null and
undefined, permitted reordering, and the original clone through the complete
validator/evaluator path. Expected result: `slot-domain-mismatch` and
`unavailable-content`, never a judged result.

### F02 — [P2] Validate required-slot ID types before sorting

Location: `src/learning/evaluators/starter-punctuation.ts:78`.

On a JSON-decoded clone of the anchor, assign
`task.responseSpec.requiredSlotIds = JSON.parse('[{"toString":null},"discovery"]')`.
Both `validateStarterPunctuationTask(task)` and
`evaluateStarterPunctuation(task, validAnchorResponse)` throw
`TypeError: Cannot convert object to primitive value`. Sorting coerces the
unvalidated element before a content issue can be returned. This reproduction
uses only JSON data, within the stated boundary excluding executable getters
and proxies.

Invalidated criterion: malformed content must produce content issues and an
unscored `unavailable-content` result, rather than breaking the evaluation call.
Check dense string elements before sorting/comparing required IDs. Recheck the
original JSON reproduction through both public functions, alongside malformed
ID elements and valid reordered requirements. Expected result:
`slot-domain-mismatch` / `unavailable-content`, with no exception.

## Context, identity and narration assessment

All available endings were independently read against the actual scenes. The
following lists every accepted complete map in authored slot order; every other
complete map over `.`, `?`, `!` is contextually rejected.

| Task | Accepted | Independent contextual assessment |
|---|---|---|
| anchor | `?.`, `?!` | Exact search question followed by definite discovery; both discovery tones legitimate. |
| 01 | `.` | Explicit calm factual growing record excludes query and emphasis. |
| 02 | `?` | Calm yes/no information request. |
| 03 | `?` | Polite request explicitly framed as a real question allowing refusal. |
| 04 | `.` | Calm journal report of wondering, not a direct question despite embedded “where”. |
| 05 | `.`, `!` | Quiet or emphatic admiration; initial “What” does not make this a question. Quiet full-stop delivery is legitimate in the supplied context. |
| 06 | `!` | Context explicitly asks the ending to convey alarm; rejection of a calm report is contextual. |
| 07 | `.` | Routine written imperative without emphasis; commands do not universally require `!`. |
| 08 | `.?`, `!?` | Discovery then information question; both discovery tones retained. |
| 09 | `?` | Explicit confirmation question with statement word order. |
| 10 | `??` | Two questions seeking different information, one canonical task. |
| 11 | `!.` | Identical words used for a strong cheer and later neutral log entry. |

These are twelve meaningful support tasks, not name substitutions or an invented
difficulty progression. The retained Year 1 terminal-punctuation objective and
Appendix 2 attribution agree with the accepted registry's earlier consolidation
in Years 3–4. Capital letters and commas are fixed, not claimed as assessed.
No new curriculum research or educational-efficacy claim is made.

The anchor retains exact words/case/comma, `question` and `discovery` slots and
`lif.english.punctuation.r1.spellbook-anchor`. The other eleven authored keys use
the accepted helper's encoded identity, not a competing namespace. Alternatives,
revision, slot/option order and week do not refresh identity. Slot feedback stays
part of one whole-task judgement. The 65-case manifest retains all twelve IDs,
60 complete maps and five draft/invalid examples; the separately authored matrix
and test oracle agree: 15 accepted, 45 wrong, 132 permitted partial states.
Ordinary missing/null/empty slots are incomplete; unknown/extra slots and
malformed marks are invalid before completeness is considered.

Every exact neutral script is safe before Check: it describes choosing endings
and using Check without naming a mark or modelling an assessed line. All twelve
records prohibit pre-Check assessed-text speech. All 24 hints direct attention
without supplying a mark or completed answer; they remain answer assistance.
All twelve worked examples correctly supply answers under worked assistance,
including equal treatment of alternatives. The review records reveal timing
and sticky assistance semantics; post-Check explanations are not neutral speech.
Fresh comparison confirmed every appendix's assessed text, neutral script,
hints, worked support and explanation exactly matches the source.

For later UI integration, preserve the scene-to-slot association when presenting
task 11: its identical visible line labels need the first-cheer/later-log context.
Evaluator reorder invariance alone does not demonstrate that a reordered UI
communicates those associations. This is a downstream check, not another source
finding. Runtime help persistence, speech delivery, audio controls and canonical
reward allocation retain their existing owners.

## Initial commands, observations and reuse limits

Reused the author's reported scoped nonincremental TypeScript success and final
no-cache Vitest result: **237 punctuation + 19 identity = 256 passing tests**.
Inspected those tests and their independent finite oracle; did not repeat the
exhaustive suite or represent its run as fresh reviewer evidence. Neither original
finding is covered by that suite. No broad build, gameplay or browser run.

Fresh probes used PowerShell single-quoted here-string input piped to
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe --input-type=module`.
The in-memory harness read the actual three source modules, stripped TypeScript
with Node `stripTypeScriptTypes`, and replaced only their runtime import URLs
with linked data URLs. It retained no generated files and changed no logic.
Node emitted its experimental type-stripper warning; both commands exited 0.
The second command caught and printed F02's exceptions intentionally; its exit
code is not a passing validation result.

Fresh observations: all twelve originals validate; deep equality of successful
results passes for all three alternative-bearing tasks; prototype-named extra
slots, zero-width suffixes and full-width marks remain invalid; exact appendix
comparison passes for all twelve records; all three sparse-option deletions
reproduce F01; JSON-null options reject; the JSON required-ID case reproduces
F02 in both public functions. Findings above give the precise mutations for
reproduction using normal module imports.

No authored wording/answer ambiguity or narration leakage was found. The initial
review required narrow regression evidence before closing the two validator
findings; that recheck follows. Actual controls, persistence, listening quality
and published PC/tablet acceptance remain unverified here.

## Independent correction recheck — 9 October 2026

**F01: RESOLVED. F02: RESOLVED. Bounded implementation verdict: ACCEPTED.**
Read the author's appended before/after handoff, corrected evaluator and 43
added regressions. Recheck HEAD: `df61a9e3b2bb92aa9e146a092b7f028984e0d2f9`.
The repair addresses the producing validator: `denseEvery` requires an own
element at every index; options must pass element validation before uniqueness
checking, and required IDs must be strings before sorting. No exception catch
or downstream grading compensation masks malformed content.

Fresh independent probes used the same file-free Node type-strip/data-URL
harness and `node --input-type=module` command described above, against the
actual corrected modules. Assertions traverse both exported functions. The
command exited 0; only the expected experimental type-stripper warning appeared.

- F01: both anchor slots, all three option positions and hole/null/undefined,
  each before and after JSON roundtrip: **36 malformed task cases passed**.
  This includes the original deletion of discovery option 2. Every validator
  result contains exactly `slot-domain-mismatch`; every evaluator result is
  exactly `unavailable-content` with those issues and no scored fields.
- F02: the original non-coercible JSON reproduction, seven malformed element
  types at each required-ID position and each single hole: **17 cases passed**.
  Both public functions return the expected issue/unavailable results; neither
  throws. Types probed: null, undefined, number, boolean, object, array and the
  JSON object with `toString:null`.
- All six glyph permutations with reversed slots and requirements validate;
  both accepted anchor endings retain deeply equal successful results in every
  permutation. The repair preserves semantic reorder tolerance and equal credit.

Reused, without rerunning, the author's corrected scoped TypeScript success,
targeted **43 passed / 237 skipped**, and full relevant **299 passed**
(280 punctuation + 19 identity). The freshly inspected added regressions also
cover symbols and all nine anchor answer maps under each permutation. No broad
audit, full-suite rerun, browser test or source/configuration mutation was needed.

Corrected SHA-256 snapshots:

| File | SHA-256 |
|---|---|
| `src/learning/evaluators/starter-punctuation.ts` | `096cf851b5379e1971880a0c5f0203ff775b2ef74fc943db785f6bb14889544d` |
| `tests/learning/starter-punctuation.test.ts` | `24d05899225703b98dbf4110372c10c5b3d6a1036a24862a2f0b97aa7f7c48db` |

Fresh hashes of the bank and content-review document exactly match the original
snapshots above. Their passing editorial, identity, curriculum and narration
assessment is retained. The task-11 scene/slot integration note and all runtime
evidence limits remain in force. This reviewer updated only this report.
