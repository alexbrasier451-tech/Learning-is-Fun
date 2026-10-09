# Raw recovery export independent validation

Initial review and narrow repair recheck completed 9 October 2026 by the same
independent repository validator.

**Current verdict: PASS — R-01 closed; no open actionable findings.** The repaired
pending-open timeout/cancellation and late cleanup pass the exact original
counterexample and independent queued-call variants in all three engines.
Prior passing preservation, read-only, capacity, abort-rejection and repository
evidence remains valid. Controller alone accepts and commits; this report does
not grant administrative acceptance or certify facade/UI delivery.

## Scope and actual delta

Read [RECOVERY-EXPORT-HANDOFF](RECOVERY-EXPORT-HANDOFF.md), the actual repository,
owned browser spec/fixtures, SAVE_LIMITS, and the prior accepted
[WP04-02A validation](WP04-02A-VALIDATION.md). Inspected the actual source delta
from `36560a51cb57d7bd1ef69c4242479462c78d32df` with a read-only Git diff.
The delta adds repository-local result types, readRecoveryExport, bounded
JSON inspection and a private recovery open/read path; existing initialization,
validated load/export, mutation, replacement, deep freezing and duplicate/token
ordering are unchanged. Shared contracts retain their accepted hash.

Only this report was written. No source, test, configuration, dependency, Git or
shared-status mutation, delegation or other-chat message was performed. All
fresh probes used the actual module on the existing Vite fixture host, port 5179,
private OS-temp caches/reports and sequential browser execution with one browser
at a time. No broad suite or full build was rerun.

## R-01 repair recheck and current closure

Inspected the actual correction at the producing open-promise layer. A local
1000 ms RECOVERY_OPEN_TIMEOUT_MS timer starts once recover reaches the serial
queue head; unavailable/blocked can now settle without a native blocked event.
Repository close invokes the pending-open cancellation hook. Finish removes the
timer and only its own hook; settled/cancelled guards preserve the first terminal
outcome and close late native success without a read or publication. Existing
normal load/write semantics, JSON inspection and shared DTOs are unchanged.

Fresh independent probes imported the actual repository module directly on the
existing focused host. All used the exact original version-3 root below, a
retained native version-3 holder and an earlier genuine blocked version-4 upgrade.
They ran three variants in each actual engine:

- **Original sequence:** call recovery, observe at 1500 ms, close and observe
  again after 250 ms while still retaining the holder. Recovery had already
  settled unavailable/blocked with the retry message; close did not alter that
  settled outcome.
- **Early close with queued calls:** submit three calls, close after about
  100 ms while the first open is pending. All three promptly returned
  unavailable/closed; only the first issued a native open. The two queued calls
  did not open another connection.
- **Two queued timeouts without close:** both calls returned unavailable/blocked
  while the holder remained retained. The first settled at about 1000 ms and the
  second at about 2000 ms, independently exercising the per-queue-head deadline
  and proving the queue resumes after timeout.

**Result: nine independent flows passed, exit 0.** Across these flows, all 18
requested terminal outcomes were correct. After releasing the holder, all 12
late native recovery opens succeeded and their exact connection identities had
corresponding close events. Their audit contained no transaction, put or
broadcast; validator and invalidation counts remained zero. No late callback
changed an already returned blocked/closed result.

Each flow then performed two successful raw recovery reads at structural
version 4, including reuse of the same still-open repository after two timeouts.
Every retry returned the exact 122-byte JSON shown below, unchanged epoch
blocked-token/revision 58, schema 7, future calendar and unknown field. A later
native version-5 upgrade completed without external cleanup, and its root
reread remained exact. Page errors and unhandled rejections were zero.

Measured fresh foreground-browser timings, milliseconds:

| Engine / version | Original timeout | Two queued timeout settlements | Settlement after early close | Version-5 cleanup completion |
|---|---|---|---|---|
| Chromium 156.0.8078.4 | 1011.4 | 1003.4 / 2008.9 | 0.2 | 0.1–0.2 |
| Edge 154.0.4258.62 | 1010.5 | 1005.1 / 2013.1 | 0.1 | 0.3–0.6 |
| WebKit 27.2 | 1009 | 1003 / 2016 | less than 1 at browser timer resolution | 30–32 |

The bound is a browser-scheduled open deadline, not a hard real-time guarantee.
It starts at the recovery queue head and does not bound waiting behind earlier
normal operations, IDB root materialization, the readonly read or JSON inspection.
These limits are explicitly documented in the corrected handoff. Transient
native blocked events during close propagation are allowed; eventual upgrade
completion and exact connection closure establish cleanup.

Complete independent roots, namespaces, settlements and connection/request
identity audits are retained at
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-recovery-validator-r01-recheck-6339698e-3c6d-44e1-881b-9094a49cba4e/independent-results.json`.
Fresh execution started `2026-10-09T01:59:17.990Z`, ended `01:59:35.089Z`
(02:59 BST).
All namespaces use
`learning-is-fun:/playtest/:r01-independent-<engine>-<mode>-<fresh UUID>`, with
`:save` appended for the database. The probe used port 5179, private caches and
outputs, and sequential browsers with at most one running browser.

Independently decoded and reused the author's corrected full focused report:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-d7776ca118814787a7922ce9d1f5ff3e/results.json`
— **53 passed, one existing WebKit CDP skip, zero unexpected/flaky**, started
`2026-10-09T01:53:51.022Z`, duration 70.910 seconds. The nine new returned-path
attachments confirm correct terminal causes, zero validation/signals, exact
native root preservation, successful version-4 retry, late connection closure
and version-5 completion. Reused the reported successful focused strict
typecheck and prior passing preservation/capacity checks; no broad rerun was
performed by this reviewer.

Current source hashes, unchanged during the fresh recheck:

| File | Lowercase SHA-256 |
|---|---|
| `src/state/repository.ts` | `9f024213d5a381e300e3d3f24876b126756e81ca43eb805ee19ed6c7b5dbfa90` |
| `src/state/contracts.ts` | `9f9987c93ba1e8ce7682957861ab15f46c27210d70cd0dd9a63c1a644945bccf` |
| `tests/browser/save-repository.spec.ts` | `5c6f81dd2dd9d2fa9d2ee8a2321d649efd2ae74b8e0edaafe8a2c4b7b6dc6ebb` |
| `tests/fixtures/save-repository.tsx` | `a757eb8ff8eb9778cff136bd81ff5f3de1260ae464c23a8a079dd4f0f802f975` |
| `tests/fixtures/save-repository-api.ts` | `899cc3b3f109cf0e83ff9c84b139803e644b9a692e7aea5d3340dec67829bc9f` |

Only this report was updated by the reviewer. R-01 is closed; its original red
evidence below is retained as history. The narrow separate raw-recovery versus
compatible-backup facade/UI distinction remains accepted without redesign.

## Historical R-01 — P2, now closed

The following describes the retired source and initial failed review.

**Earliest causal layer:** `src/state/repository.ts:281–297`, the recovery-open
promise. Its only blocked rejection is the opening request's `blocked` callback
at line 289. An unversioned open queued behind an earlier blocked upgrade does
not receive that event. The earlier upgrade request receives it; the recovery
request has no success/error/blocked event until that upgrade is released.
There is no other bounded terminal outcome or pending-open cancellation.
Repository close marks the handle closed, but does not settle this pending
recovery promise; the serial queue also remains occupied until the open resumes.

**Exact stored input:** structural database version 3, store records, key root:

```json
{"epoch":"blocked-token","revision":58,"save":{"schemaVersion":7,"calendar":{"futureWeek":"3099-11-02"}},"unknown":"keep"}
```

**Reproduction:** seed that root using native IndexedDB in a fresh app namespace.
Retain a native version-3 connection that does not close on versionchange. Issue
a separate native open requesting version 4 and wait for its genuine `blocked`
event. Construct the repository with the existing valid initial fixture and a
validator that throws if called; call only readRecoveryExport.

```ts
const held = await nativeOpen(databaseName); // retained v3 connection
const upgrading = indexedDB.open(databaseName, 4);
await new Promise<void>(resolve => { upgrading.onblocked = () => resolve(); });

let settled = false;
const pending = repo.readRecoveryExport().then(result => {
  settled = true;
  return result;
});
await delay(1500);
// Observed: settled === false; recovery request emitted only its open request.
repo.close();
await delay(250);
// Observed: still unsettled, with no recovery blocked/success/error event.
held.close();
await pending; // now unavailable/closed after the earlier upgrade finishes
```

The 1.5-second window is an observation, not a newly imposed product deadline.
The native request audit and source establish the dependency on releasing the
held connection: no fallback exists while it remains held. A first probe also
left the repository open: after 600 ms there was no outcome; releasing the held
connection allowed recovery to return available at structural version 4 with the
exact unchanged root. Thus the cause is opening/queue liveness, not validation,
serialization, data corruption or a connection leak after a completed read.

Reproduced in actual Chromium **156.0.8078.4**, installed Edge
**154.0.4258.62**, and WebKit **27.2**. Follow-up namespaces:

| Engine | Exact app namespace |
|---|---|
| Chromium | `learning-is-fun:/playtest/:recovery-followup-chromium-blocked-close-51e217d5-3ef6-4013-901a-43c105cc8bcb` |
| Edge | `learning-is-fun:/playtest/:recovery-followup-edge-blocked-close-60299f54-3b4d-4a1b-95d7-439d1e7bae4f` |
| WebKit | `learning-is-fun:/playtest/:recovery-followup-webkit-blocked-close-087f1550-bbf7-41a8-ae7c-bad4f099ce88` |

Database names append `:save`. Before close and 250 ms after close, each recovery
request audit contains only `{event:'request',requestedVersion:null}`. Only after
external release is `success` recorded and the method returns unavailable/closed.
Native reread retains the complete input above, epoch blocked-token/revision 58,
including schema/calendar/unknown fields. No unhandled rejection occurs.

**Invalidated behavior:** the handoff's blocked recovery retry outcome and an
operation that can finish when recovery is not currently feasible. A consuming
recovery screen could otherwise remain pending without explaining that another
tab must close; closing the repository also leaves its awaiting caller pending.

**Action and closure criteria:** add a narrow bounded terminal outcome for a
queued recovery open and settle it on repository close, while preserving the
existing late-success connection close. Keep the unversioned read-only behavior;
do not force an upgrade or compensate by changing save data. Re-run the exact
held-connection/blocked-prior-upgrade case: without releasing the holder, recovery
must yield unavailable/blocked within the implementation's documented bound and
provide the retry message; closing a pending repository must yield
unavailable/closed. Later release must close any late native connection without
validation, writes or broadcasts. A fresh retry after release must return the
unchanged version-4 root. Run the affected recovery cases in all three engines;
reuse unaffected accepted regression evidence. No repair was made by this
validator.

## Passing criteria and discriminating checks

| Criterion | Assessment |
|---|---|
| Explicit raw representation and producer boundary | PASS. Available result identifies raw-indexeddb-root-json, database name, actual structural version, records/root, JSON and exact byte length. It is not a CommittedSnapshot or supported backup envelope. No shared DTO redesign or alternate save authority is introduced. |
| Unknown schema/content/policy/token/calendar fields | PASS. Decoded author's paired roots and audits for schema/content/policy/structural future data; native before/after roots are identical. Independent future-version probes retain unusual own keys `__proto__`, constructor and a non-callable toJSON field, unknown calendar/large finite numbers, Unicode and escapes. Recovery neither repairs unsafe token values nor normalizes future fields. |
| No validation, mutation, committed creation/upgrade or broadcast | PASS for completed operations. Author's targeted audits and independent native-operation observers show an unversioned open and readonly records transaction, with zero validator calls, puts, store creation, broadcasts or invalidation. Missing-database creation attempts are aborted; no committed database/root is created. |
| Newer structural databases | PASS. Author reads version 7; independent reads versions 11 and 17, including a database with an additional metadata store whose sentinel remains exact. Normal load remains unsupported before/after raw recovery. The pending-upgrade outcome and safe retry now pass the R-01 recheck above. |
| Absent/missing/closed/unreadable cases | PASS within inspected cases. Retained author evidence covers missing store, missing root, closed port, injected readonly request exception and successful unchanged retry. Independent probes repeat absent-database recovery 12 times per engine: every result is absent-database, no database remains, and there are no page errors or unhandled rejections. |
| Expected first-open abort rejection | PASS. Source consumes the upgrade transaction's tx.done rejection before aborting. Thirty-six fresh absent-database calls across engines and a post-probe rejection/error observation window produced zero unhandled rejections/page errors. |
| Non-JSON values | PASS. Retained cases cover Date, Map, BigInt, undefined child, Infinity, negative zero, sparse array and cycles. Independent cases add Set, RegExp, NaN and an array's extra own property: all return non-json while native values remain unchanged. A literal null root exports the exact raw JSON `null`, without claiming a valid save. |
| Recovery work/byte capacities | PASS. Retained cases reject excessive depth/visited values/bytes intact. Independent exact-boundary roots produce 16,777,216-byte available JSON, preserving all padding and fields; adding one byte returns capacity-exceeded without trimming or mutation. Bounds apply to inspection/serialization after the indivisible IDB root has been read. |
| UTF-8 representation | PASS. Independent escaped-source probes retain accented text, emoji, control/quote/backslash escapes, lone surrogates and Unicode line separators. Reported byte length equals TextEncoder UTF-8 bytes; JSON equals the native logical root representation. No claim is made to preserve nonexistent original file bytes. |
| Temporary connection cleanup | PASS. Completed reads and all 12 timed-out/cancelled late opens close their exact native connections; a later native version upgrade completes without extra external cleanup. Some engines emit a transient blocked event while close propagates. An initial zero-blocked-event expectation was too strict and is classified as a probe defect, not a product leak. Pending timeout/close settlement now passes the R-01 recheck above. |
| Pending open and queued recovery settlement | PASS after repair. Original sequence returns blocked without releasing the holder; early close settles the active and two queued calls as closed without further opens; two queued timeouts each settle when their own queue-head timer runs. |
| Prior atomic/duplicate/F-01 acceptance | Retained. The actual delta leaves those producing paths unchanged; the author's new complete focused regression passes their existing cases. No repeated broad verification was needed. |

## Consuming facade/UI distinction

The narrow distinction is compatible with the accepted architecture. The facade
should expose a separate raw-recovery operation bound to readRecoveryExport.
Recovery UI should label it **Download raw recovery data**, use a distinct
`.recovery.json` filename, and state that it preserves stored data but is not a
compatible save backup. Download the supplied JSON unchanged; do not wrap it as
v1, strip fields, create a new token, update calendar data or claim migration.
Unavailable results should display their reason, without substituting a default
save. Normal readExportSnapshot/exportBackup retain their validated compatible
backup behavior. Actual facade/download/UI integration belongs to its consumer
and is not certified here. R-01 is closed and the repository port is ready for
that handoff; no new facade architecture is requested.

## Initial-review evidence and continuing limits

Independently decoded the author's new retained browser JSON:

- Complete focused suite:
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-538b52dc349a4beea74dbeb4e8864e7f/results.json`
  — **44 passed, one existing WebKit CDP skip, zero unexpected/flaky**, start
  `2026-10-09T01:29:35.606Z`, duration 50.318 seconds.
- Targeted recovery/broadcast audit:
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-2bad3500818b491d97caf9521811f204/results.json`
  — **15 passed, zero unexpected/flaky**, start `2026-10-09T01:32:34.366Z`,
  duration 16.022 seconds. Future-format cases retain exact raw roots, zero
  validator/invalidation deltas, only unversioned open/readonly transaction
  audits, and the unrelated namespace sentinel.

Reused the author's reported successful strict focused typecheck and valid
prior repository acceptance. Fresh independent evidence:

- `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-recovery-validator-3d26c2f8-7a68-42cd-9912-7036ead27067/independent-results.json`
  — started `2026-10-09T01:38:55.265Z`, ended `01:39:01.666Z` (02:38–02:39 BST).
  Contains preservation/read-only audits, 36 absent aborts, byte boundaries,
  additional non-JSON values, three blocked-prior-upgrade failures and the
  over-strict initial WebKit cleanup probe.
- `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-recovery-validator-followup-7a3a482b-5200-4e7b-a2d1-32faf0a66eb9/independent-results.json`
  — started `2026-10-09T01:40:47.891Z`, ended `01:40:55.399Z` (02:40 BST).
  Confirms successful connection cleanup/escaped-Unicode preservation and
  independently reproduces R-01 plus close-while-pending in every engine.

Probe harnesses exited 0 because they collected outcomes. Explicit pass:false
blocked-upgrade results are failures; no overall green independent run is
claimed. The initial cleanup expectation was superseded by the discriminating
follow-up, as explained above. Both reports have zero browser page errors and
the absence probes record zero unhandled rejections.

Initial-review SHA-256 values, unchanged during that review (repaired-file values
are superseded by the current recheck hashes above):

| File | Lowercase SHA-256 |
|---|---|
| `src/state/repository.ts` | `56df08e463414f54a4ee3915ad5f1fd4bfc3932197d2a03375b739d89d68e308` |
| `src/state/contracts.ts` | `9f9987c93ba1e8ce7682957861ab15f46c27210d70cd0dd9a63c1a644945bccf` |
| `tests/browser/save-repository.spec.ts` | `23d229ab39650b29150f974ebd5cf4821347cac68304eae6ee5628b44d492d44` |
| `tests/fixtures/save-repository.tsx` | `0505b44148e040937d2773a70949520306a3246670d579c0eeb1ee69bab5e6e6` |
| `tests/fixtures/save-repository-api.ts` | `3a5912e8079e565a9ee44b10ae861a3cbe35f7dad01bf36e2e00a35c1ba38ec5` |

Evidence is local synthetic storage verification, not full gameplay, actual
future-format compatibility, automatic migration/import, facade/UI delivery,
publication or disk-failure protection. Existing WebKit forced-termination and
branded Chrome/Firefox capability limits remain as previously documented. No
other actionable refinement finding was established. R-01 has been repaired
and independently revalidated; no open actionable refinement finding remains.
