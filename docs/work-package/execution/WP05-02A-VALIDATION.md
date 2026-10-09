# WP05-02A independent validation

Reviewed and narrowly rechecked 9 October 2026. **Current verdict: pass for
WP05-02A's bounded pure-policy handoff.** All three original P2 findings are
resolved by independent recheck. Earlier passing scoring evidence remains valid;
there are no outstanding findings in this review. Administrative acceptance and
integrated WP04 verification remain with their respective owners.

## Original findings — retained evidence, all resolved

The reproductions and line references below describe the pre-correction source.
Their corrected outcomes are recorded in the recheck section.

### F1 — P2, resolved: bound opportunities are not checked against retained prior success

`src/rewards/scoring.ts:281–301` validates selection fields individually and
compares earning-week identity, but does not reconcile a bound current
opportunity with the retained completion's actual success. A bound opportunity
then bypasses eligibility revalidation through `resume-existing`.

Independent reproduction (W1 = 2026-10-05, W2 = 2026-10-12,
W3 = 2026-10-19):

1. Produce ordinal 1 legally: wrong/hinted Checks in W1, success in W2. It earns
   10 lifetime, retains earning W1 and actual success W2.
2. Produce ordinal 2 legally: selected W3 review referencing previous success W2,
   wrong first Check; total lifetime is 15, current slot/score is 1/5.
3. Clone that reward state, change ordinal 2's earning week to W2 and its
   selection's `previousSuccessWeek`/`dueLocalDate` to W1/W2; set competition's
   active week to W2. Keep ordinal 1's actual success W2 and all receipt/slot
   sums intact.
4. `validateRewardState` returns **[]**. A correct next Check adds **5 lifetime
   and 5 competitive**, and its output also validates as **[]**.

The new opportunity starts in the preceding opportunity's actual-success week,
contrary to P5-B and the late-success acceptance clause. A separate single-field
family mutation of the legal W3 fixture, replacing current selection with
`adaptive`/`first-encounter`, also validates and pays the remaining +5 despite
the retained prior completion. Reject these contradictions in the reward
validator, while preserving legitimate bound unfinished continuations and
unchecked provisional revalidation. WP04 should not need a second reward-policy
authority to repair this handoff.

### F2 — P2, resolved: completion high-water can survive without its earned history

`src/rewards/scoring.ts:237–244` accepts a track containing only:

```json
{"lastAllocatedOrdinal":1,"completedThroughOrdinal":1,"closedAwardTotal":0,
 "freePractice":{"validChecks":0,"answerHintUsed":false}}
```

With lifetime 0, empty receipts/entitlements and empty W2 competition,
`validateRewardState` returns **[]**. Classification returns
**eligible-first/first-encounter**; allocating ordinal 2 externally and Checking
correctly awards **20 lifetime / 20 competitive**, again yielding a valid state.
This is not the legitimate removed-provisional case: that case increments the
allocation mark without advancing the completion mark. A positive completion
mark here has neither a compacted completion contribution nor retained success
or latest completion. The decoder must reject inconsistent completion/compaction
history rather than accepting its conversion into a fresh question. This blocks
the high-water, lifetime-preservation and old-history acceptance requirements.
Do not impose ordinal-contiguity assumptions: removed provisional allocations
can create legitimate gaps.

### F3 — P2, resolved: malformed JSON can throw instead of returning validation issues

`src/rewards/scoring.ts:332` adds `slot.points` even after the slot check fails.
For empty rewards and an otherwise empty W1 competition, set profile `p`'s slots
to:

```json
[{"slot":1,"opportunityId":"bad","canonicalQuestionId":"c",
  "points":{"valueOf":null,"toString":null}}]
```

`validateRewardState` throws **TypeError: Cannot convert object to primitive
value**, contradicting its explicit shape-failure/issue-return contract. These
are ordinary JSON values, without getters or executable input. Guard arithmetic
behind numeric validation; inspect the same pattern at `closedAwardTotal`
accumulation. Competition validation remains separately owned, but this exported
reward validator's malformed-input behavior must be dependable for WP04.

## Initial criteria and evidence — preserved

| Area | Independent assessment |
|---|---|
| P5-A, once-only components | Source/tests agree with +5/+15 or +5/+5. Fresh wrong → wrong → late success totals 10; repeated wrong adds 0; help remains sticky. Authored tests additionally cover completed retries, stale sequences, narration and rejected unjudged input. |
| P5-B, eligibility and episodes | Fresh free-practice wrong W1 → story-route success W2 stays at 0 with cumulative help; W2 review remains ineligible; selected W3 review earns 20. No episode identity enters receipts. Decoder exceptions are F1/F2. |
| P5-C, first 30 | Fresh independently assembled 31-canonical oracle produces **620 lifetime / 600 competitive / 30 slots**, checking each competitive delta. Existing wrong-first/capped-null-slot and Sunday/Monday evidence reused after source inspection. |
| Late success and compaction | Fresh W1 wrong/wrong → W2 success contributes no current competitive points; actual success is W2. Legal W3 review yields lifetime 30, closed total 10, completion mark 1. Each output validates. |
| P5-D, quests/choices | Fresh Q1–Q10 sequence gives 200 lifetime; every replay gives 0. Exact 19/20, 59/60, 149/150, 299/300 boundaries pass, including both 300 choices. Authored three-supported-starter-quest 90/30 fixture reused. |
| Purity/ownership | All fresh Check inputs recursively frozen and byte-equivalent afterwards; quest inputs likewise checked. No clock read, allocation, canonical constructor, persistence, learning scheduler or second receipt journal introduced. |
| Rejecting decoder | F1/F2 incorrectly return no issues and permit subsequent awards; F3 throws. Acceptance remains blocked here. |

Read the child and implementation handoff, complete scoring source/tests,
WP05-01A DTO/calendar contract, WP03-01A learning handoff and relevant learning
types, WP02-01A static quest/cosmetic catalogue and handoff, and
DEC-010/011/014/021. Reused the author's recorded **229 passing related tests
(25 owned)** and focused no-emit typecheck; these were not represented as fresh
reviewer runs. No duplicate broad sweep or app-wide diagnostics were run.

Fresh probes executed through bundled Node 24 stdin, stripping TypeScript and
loading the actual source modules entirely in memory. Expected totals were
literal independent values. Assertions checked legal outputs, input immutability
and the exact counterexample results above. No test, source, configuration,
dependency, ledger or cache file was written. This report is the sole write;
no workers, other-chat messages, staging or commits were used.

The initial acceptance blockers in this section are superseded by the narrow
recheck below. Real save/replay/two-tab composition remains WP04; M2 real
progression and published behavior remain outside this review.

## Independent correction recheck — 9 October 2026

Read the corrected validator/classifier, five added regression tests and appended
handoff evidence. Re-executed the original reviewer counterexamples against the
actual corrected source using the same in-memory Node stdin harness. This was a
narrow recheck, not a new broad audit.

| Case | Fresh observed outcome |
|---|---|
| F1: bound W2 review after actual W2 success; familiar first-encounter substitution; stale previous-success reference | Each validator call returns issues; each attempted correct continuation throws `RangeError` before awarding. Frozen reward/competition inputs remain byte-equivalent. **Resolved.** |
| F2: original orphan completion mark 1 with zero contribution/history | Validator returns issues; classification is practice-only; attempted externally allocated ordinal-2 continuation throws `RangeError`. **Resolved.** |
| F3: original JSON object in slot points | Validator returns issues without throwing. The same malformed object in compact total/allocation/completion marks also returns issues. **Resolved.** |
| Legal W1 hinted wrong/wrong → W2 late success → W3 wrong/correct selected review | Lifetime 20; W3 success delta +5 lifetime/+5 competitive; closed total 10 and completion mark 1. All legal outputs validate. |
| Stale unchecked review following late success | Provisional state validates; first Check converts to practice with zero award, preserves lifetime 10 and removes the provisional opportunity. |
| Provisional removal → ordinal-2 supported success → ordinal-3 independent review | Lifetime 30, closed total 10, completion mark 2. The valid allocation gap is accepted; no erroneous contiguous-ordinal minimum is imposed. |
| Existing literal compact decoder fixture → W3 selected review | Fixture validates; continuation yields lifetime 50, closed total 30, completion mark 2. Only its profile ID was consistently adapted to the independent harness. |

Every legal Check above used recursively frozen inputs, checked unchanged input
JSON and validated both returned states. Numeric shape guards precede the
previously failing arithmetic; retained-prior-success checks apply to bound
current opportunities, preserving unchecked revalidation. Completion marks now
require earned compacted contributions and retained completion/success history.
These corrections remain in the existing reward authority without new DTOs,
schedulers, storage or replay journals.

Reused the author's updated **30/30 scoring tests, 234/234 related tests and
focused strict no-emit typecheck** as recorded handoff evidence; no broad sweep,
app-wide check or duplicate typecheck was run by this reviewer. Earlier passing
620/600/30, quest, threshold, free-practice and purity evidence is preserved.
Only this validation report was updated; no source/test/config/dependency/ledger/
cache writes, workers, other-chat messages or commits occurred.
