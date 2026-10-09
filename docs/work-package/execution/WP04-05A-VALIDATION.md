# WP04-05A independent implementation validation

9 October 2026. Report-only review; Controller owns acceptance and dependency release.

**Verdict: ACCEPTED after narrow independent revalidation. Open finding severity: NONE. Invalidated criteria: NONE within this preference/gating producer boundary.** The original P1 queue/flush and P2 ordinary startup findings are resolved. Controller owns administrative acceptance and dependency release; real playback, storage composition and listening remain downstream.

## Scope and authority

Read [GLOBAL_RULES](../GLOBAL_RULES.md), the complete [child](../chunks/WP04-05A.md), [handoff](WP04-05A-HANDOFF.md), DEC-004/017/020/026 in [DECISIONS](../DECISIONS.md), actual preference implementation/tests and accepted state/audio ports. Bounded reads of WP02-01A/05A and WP04-04A established startup, gate/status forwarding and downstream ownership. Execution is human-authorized; this review changes only this report. No production/test/configuration/dependency/cache/ledger edits, commits, workers, other-chat messages or browser-port use.

Initial reviewed HEAD: `29e3f374f8ce292edbac150ba6cca769000ebd69`; correction revalidation HEAD: `0692b3f68782c12ff758429f5cff78fceb720a7f`. Preference implementation/tests are untracked delivered files; unrelated concurrent work was preserved. Standard build protocol and Logic-Flow Diagnosis were applied once and continued directly for revalidation without authorizing reviewer repair.

The following two sections retain the first-review counterexamples and causal diagnosis. Their pre-correction observations are historical; the current results and exact delta are recorded under Narrow independent revalidation below.

## Resolved finding 1 — original P1: reentrant drains and premature flush

**Original owner:** [preferences.ts](../../../src/state/preferences.ts), pre-correction `schedule` lines 251–260, `drain` lines 225–249 and `flush` lines 343–347. **Resolution: PASS.**

`schedule` clears `scheduled`, then evaluates `drain()` before assigning its promise to `running`. The async function executes synchronously through its first `await`, including `inFlight = batch; publish()`. A subscriber that makes one preference edit during this publication sees both scheduling guards clear and queues another drain. Two unresolved preference enqueues then share one mutable `inFlight` and `running`; completion of one can erase the other's bookkeeping.

Independent reproduction used the actual controller and the existing full-save deferred harness, with these new inputs:

1. Start from `snapshot(enabled)`. Subscribe a listener that, on its second notification, requests effects volume `.8`, once.
2. Request music volume `.7`; drain-start publication triggers that listener. After `tick()`, **two** enqueues are unresolved, both expected revision 0. Only one may be active.
3. Commit call 0 at revision 1, then deliver call 1 as `conflict` with that same revision-1 snapshot. Each completion starts another effects-volume `.8` command, producing calls 2 and 3, both expected revision 1.
4. Commit call 2 at revision 2, leaving call 3 unresolved. Call `flush()` and advance microtasks.
5. Resolve call 3 as `save-failed`, with the known revision-2 snapshot.

| Checkpoint | Expected | Observed |
|---|---|---|
| Drain-start subscription | Existing drain owns scheduling before publication | Second drain scheduled while first starts |
| Before first result | One unresolved enqueue | Two unresolved enqueues |
| After call 2 commits | Flush waits for unresolved call 3 | Flush resolves; `ready=true`, `pendingPreferences=false`, `failedPreferences=false` |
| Late call 3 failure | No earlier completed drain/readiness claim | Status changes to `failed=true`, `storage-write-failed`; later flush reports `ready=false` |

Commit/conflict snapshots in this final reproduction respect expected-token ordering; it does not depend on committing two commands against the same stale token. Subscriber edits are within the exposed API and are explicitly contemplated by the implementation's flush comment. This is not a throwing subscriber or a malformed command.

**Originally invalidated requirements, now restored:** the single preference queue, generation/acknowledgement bookkeeping under callbacks, and truthful flush/update readiness in Produced outputs and Exact scope; P4-F's pending/failure/readiness support. The correction establishes drain ownership before observable synchronous work and adds the callback/late-failure regression. Independent reruns now show one active enqueue and no premature readiness.

## Resolved finding 2 — original P2: ordinary loading invents Silence all

**Original owner:** [preferences.ts](../../../src/state/preferences.ts), pre-correction initial latch line 88, `mergeClean` lines 138–147, `acceptCommitted` lines 175–187 and Enable handling lines 288–290. **Resolution: PASS.**

The constructor treats ordinary `loading` as permanent Silence all. A successful first read does not distinguish that temporary load guard from persisted/local/received silence. Consequently the ordinary startup sequence cannot reach enabled, unsilenced preferences through its dedicated Enable sound action.

Independent reproduction, repeated with the existing full-save harness:

```ts
const h = harness(null);
h.controller.acceptCommitted(snapshot()); // clean first-run false/false/.25/.50
h.controller.setAudioPreferences({ kind: 'enable' });
await tick(); h.commit(0);
const readiness = await h.controller.flush();
```

| Checkpoint | Expected | Observed |
|---|---|---|
| Before read | Loading prevents playback | Quiet; constructor gates `silence-all` |
| Clean first-run read | Loaded defaults: `soundEnabled=false`, `silenceAll=false` | Requested `silenceAll=true`, generation 0, no pending/failure |
| Dedicated Enable and acknowledgement | Consent true; no invented user Silence all | Requested `soundEnabled=true`, `silenceAll=true`; saved audio true/false |
| Completion | First-enable path no longer blocked by ordinary loading | `savedGeneration=1`, `ready=true`, but live Silence all remains until a second explicit exit action |

A clean returning save with `soundEnabled=true`, `silenceAll=false` loaded through `initialCommitted=null` also remains requested-silent. The direct already-loaded first-run fixture passes because it never takes this constructor path. The handoff's blanket statement that loading requires deliberate exit describes the implementation but is not an accepted startup-contract amendment.

**Originally invalidated requirements, now restored:** P4-F first-visit Enable sound, exact loaded defaults and cold-start committed-preference application; DEC-004 and the WP02-05A consuming startup contract. Ordinary loading now uses `loadStatus` without creating a silence latch or a silence-all intent; real persisted/local/received/read-failed silence retains its explicit-exit rule. Browser activation remains WP02-owned.

## Narrow independent revalidation

The exact production delta was verified in memory against the first-review SHA-256: reversing only the initial latch classification and the scheduling ownership correction reproduces the original source hash. Reversing the nine added regression/variant cases and two corrected old loading expectations likewise reproduces the original test hash. No other preference implementation/test delta is hidden by the untracked-file state.

Fresh traces executed the corrected actual source through the complete helper/port flow, using the existing full-save deferred fixture helpers and independent assertions:

| Case | Exact independent result |
|---|---|
| Original P1 input: music `.7`, effects `.8` from subscriber notification 2 | One initial enqueue. After its revision-1 acknowledgement, one effects-only enqueue with expected revision 1. Two concurrent flushes remain unsettled while that writer is unresolved. Its rejected promise makes both return `ready=false`, `pendingPreferences=true`, `failedPreferences=true`; generation 2/saved 1. Explicit retry is the third total enqueue; final music `.7`/effects `.8`, generation/saved 2, ready true. The original four-command overlap cannot arise. |
| Original P2 input: null/loading → clean defaults → Enable → acknowledgement | No startup silence-all gate. Loaded defaults equal false/false/.25/.50. Events are exactly `gate:enable`, then `enqueue:SetAudioPreferences`; requested and saved audio both true/false/.25/.50, generation/saved 1, ready true. No Resume action is required. |
| Four real-silence variants: saved, local, received, read-failed | After loading and Enable, every variant remains silent. A newer revision-10 unsilenced refresh and music slider at zero cannot clear the latch. Explicit exit alone clears it. Each case has two enqueues; local silence broadcasts once, the other variants never rebroadcast. |
| Fresh case: returning enabled save, reentrant received silence plus captured beta motion, conflict/failure/retry | Initial music remains muted at `.4`, effects initially zero; ordinary return causes no gate/save. Music slider `.65` triggers received silence and beta reduced-motion from drain publication. One writer at each stage; silence retry uses fresh revision 3 after conflict. Flush waits for the failed retry and returns blocked. Explicit retry saves silence, then beta's captured command uses revision 4. Five total enqueues; final revision 5, generation/saved 3, music still muted at `.65`, concurrent clean effects `.9`, silence true, beta motion reduced, zero reward points, ready true. |

All seven independent trace cases passed, exit 0. These reruns validate the original inputs through their final acknowledgement/failure/retry/readiness outcomes, not just component assertions.

Also independently ran the nine focused correction/variant cases through Vitest:

```text
node node_modules/vitest/vitest.mjs run tests/state/preferences.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism -t 'review P|ordinary load completion|returning consent|reentrant captured-profile|fresh startup'
```

**PASS: 1 file, 9 passed, 27 skipped, exit 0.** This includes the author's preserved original four-call failure branch, returning consent without activation, all four real-silence variants, reentrant captured-profile conflict with simultaneous flushes, and silence received during first Enable publication followed by failed persistence/retry.

## Current assessment

| Requirement | Assessment and evidence |
|---|---|
| Synchronous gate before enqueue | PASS in inspected paths, rapid/failure fixtures and reentrant reruns. Gate failure remains visible and blocks persistence/activation; local failed stop still broadcasts. Events prove adapter ordering only. |
| Dirty leaves, rapid generations, independent channels | PASS: narrow changed leaves, latest volumes, independent mute/zero/volume, no slider/profile narration consent or implicit exit. Corrected drain ownership also passes callback/late-failure reruns. |
| Stale acknowledgement/refresh/conflict/retry | Existing cases pass: only dispatched generations retire; newer clean fields survive older acknowledgements; retries use fresh tokens/latest leaves and repeated conflicts stop. Independently probed a conflict snapshot already satisfying volume plus received silence: one enqueue, generation/savedGeneration 2, truthful ready result. |
| Failed save/rejected enqueue/read failure/live gate | Existing failure cases remain valid. Independently probed failed received-silence gate: no enqueue while failed, no rebroadcast, blocked readiness; successful retry first stops and saves silence. Failed-read recovery remains silent until explicit exit. |
| Startup and local/received Silence all | PASS after correction: clean first run/return does not invent a lasting latch; real saved/local/received/read-failed silence still survives Enable, refresh, slider and late acknowledgement until explicit exit. Received silence never rebroadcasts. |
| Epoch replacement/discard reporting | PASS existing fixtures and independent old-epoch rejection/new-epoch edit ordering: retired failure does not affect the new command; fresh token/captured choice retained; explicit loss acknowledgement clears only scope loss. |
| Profile deletion/captured identity | PASS existing fixtures and independent deletion of queued alpha settings while a valid audio acknowledgement arrives: alpha discarded/reported, beta narration sent with revision 2 and its original ID; late revision-1 audio acknowledgement cannot resurrect alpha. Loss blocks readiness until acknowledgement. |
| P4-J preference portion | Captured motion/narration patches, clean/dirty reconciliation and no educational/reward command production pass. Actual UI effects, assistance attribution/scoring and integrated reload remain downstream. |
| Flush/readiness | PASS after correction: one active enqueue, concurrent flushes await it, late failures stay blocked, latest-only retry restores readiness. Existing loading/scope-loss blockers remain valid. |

## Evidence and limits

- Initial review reused the author's valid 57 tests, which lacked the two counterexamples. Correction revalidation reuses the updated handoff's **36 preference + 30 contract tests (66 total)**, focused strict typecheck and application typecheck with caches disabled. Those full checks are author-run evidence; this reviewer independently ran only the focused nine cases plus the seven trace cases above. No duplicate full/broad suite was run.
- Fresh probes ran in memory via bundled **Node v24.19.0** and `node:module.stripTypeScriptTypes`, executing actual source with accepted constants and existing full-save fixture helpers. No fixture or source files were written. Initial review's failed TypeScript loader attempt was tooling-only; the supported Node loader was reused for revalidation without further tooling failure.
- First-review source/test hashes: **c34c2ceeda63927513be134a76f732e00ce50ba5dc60f84759098281d90c2db5** / **7f2a6204c5c26d5ed3fe6b1ccfbbf83c05c833d16a54b0ebd87fd138fde70a81**. Corrected source/test hashes: **02a4fc067973be1d0d022e3705843992cb444d3fc055b7b845631ff20a6a9b45** / **9f9163cc74587b2f4f8c5c72b96965a3594ee8832d124db4bdd07fa9f88b84d4**; unchanged across revalidation.
- These fixtures establish preference state, gate ordering and asynchronous port behavior. No actual sound, speech cancellation, browser activation, production storage, published reload/update or acoustic quality is claimed. WP04-04A/WP02-05A/WP06 retain those integration and listening obligations.

Both findings are closed by causal corrections and complete independent reruns. No open producer-boundary finding remains. No repair was made by this reviewer.
