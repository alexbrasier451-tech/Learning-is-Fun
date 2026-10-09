# Read-only raw recovery export handoff

Controller-authorized additive refinement, implemented 9 October 2026. R-01
corrected and author-verified; ready for independent recheck before consumer
integration. Changed
only repository.ts, its owned spec/fixtures, and this handoff. No shared DTOs,
backup/migration/facade implementation, dependencies, configuration, Git or
ledger edits. Other workers' files are preserved.

## R-01 correction and current verified state

The independent review correctly found that an unversioned open queued behind
an earlier genuinely blocked upgrade can emit no blocked event. The earlier
implementation waited indefinitely, including after repository.close(). The
new tests reproduce the exact native version-3 holder, blocked version-4
upgrade, recovery open, 1500 ms observation, close and 250 ms observation
sequence before releasing the holder. All nine original/early-close/no-close
cases failed against the reviewed source in Chromium, Edge and WebKit. Retained
red report: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-f595da88bd6540878c7da34a79ab547e/results.json`
(start 2026-10-09T01:52:03.572Z; nine expected reproductions of R-01, exit 1).

`RECOVERY_OPEN_TIMEOUT_MS = 1000` is now exported locally from repository.ts.
Once a recovery operation reaches the serial queue head, it starts a 1000 ms
open timer. If the private open is still pending when the timer runs, the
operation settles unavailable/blocked with the existing retry message, even
without an IndexedDB blocked event. This is a browser-scheduled timeout, not a
hard real-time guarantee; suspended/background tasks can delay it. It does not
bound time spent behind prior normal repository operations, the root read,
browser materialization or JSON inspection. No normal load/write semantics or
existing SAVE_LIMITS changed.

Closing the repository while this recovery open is pending cancels that
operation immediately, returning unavailable/closed through promise microtasks.
It releases the serial queue so already queued recovery calls also return
closed without issuing another native open. Open success/error, blocked,
timeout and cancellation remove the timer/cancellation hook exactly once.
Closing after a completed timeout does not change its settled blocked result.

The native request itself cannot be cancelled. Its late success handler closes
that exact connection without reading, validating, caching, writing or
publishing. The fixture records native request IDs and connection identities:
in every final case, pending request 4 succeeds later as connection 4 at version
4 and has a corresponding close. After release, a fresh recovery retry opens
version 4 and exports this identical 122-byte logical root:

```json
{"epoch":"blocked-token","revision":58,"save":{"schemaVersion":7,"calendar":{"futureWeek":"3099-11-02"}},"unknown":"keep"}
```

Native rereads after a subsequent version-5 upgrade retain that entire root.
The timed-out/cancelled calls audit only their unversioned open; their late
callbacks perform no transaction or broadcast. The one later upgrade event in
the audit belongs to the deliberately queued external version-4 probe. A
throw-on-any-call validator remains uncalled, and invalidation counts stay zero.
Cleanup is verified by connection identity and eventual upgrade completion,
allowing WebKit's brief native closure latency rather than requiring no blocked
event.

Final source state, complete focused run `./tests/fixtures/save-repository-run.ps1`:
**53 passed, one existing WebKit CDP forced-termination skip, zero unexpected or
flaky, exit 0**. Report:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-d7776ca118814787a7922ce9d1f5ff3e/results.json`.
Started 2026-10-09T01:53:51.022Z (02:53:51 BST), duration 70.910 seconds. Reserved
5179, one worker, private Vite cache and report/output directory. Strict focused
ES2022/DOM/Bundler typecheck passes. The run includes the complete original
repository suite, all nine new queued-open flows, supported/unsupported raw
exports, absent database/root/store, injected unreadable request and retry,
non-JSON and all depth/value/byte capacity variants. Each queued case uses a
fresh browser page and namespace. No browser page errors occurred in those or
absent-database cases.

Measured final-run timing, milliseconds (original and no-close timeout cases):

| Engine/version | Focused result | Timeout settlement | Early-close settlement after close | Version-5 cleanup upgrade |
|---|---|---|---|---|
| Chromium 156.0.8078.4 | 18 passed | 1015.0 / 1005.0 | 0.3 | 0.2 / 0.3 / 0.3 |
| Edge 154.0.4258.62 | 18 passed | 1005.2 / 1011.1 | 0.3 | 0.1 / 0.1 / 0.2 |
| WebKit 27.2 | 17 passed, existing skip | 1003 / 1011 | 1 | 30 / 29 / 30 |

The original sequence now observes blocked before close and remains settled
while the holder is retained. The early-close variant closes at about 100 ms,
settles both active and queued recovery calls before its 250 ms observation,
then releases the holder. The no-close variant also settles blocked while the
holder remains open. A preceding targeted correction run passed nine tests;
its report is `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-d1f29f0135554719b53b0c662f8a1b98/results.json`
(01:52:57.799Z; 19.098 seconds). The complete run above supersedes it after
formatting and stronger late-operation/connection evidence were added.

Current lowercase SHA-256 values:

| File | SHA-256 |
|---|---|
| src/state/repository.ts | `9f024213d5a381e300e3d3f24876b126756e81ca43eb805ee19ed6c7b5dbfa90` |
| tests/browser/save-repository.spec.ts | `5c6f81dd2dd9d2fa9d2ee8a2321d649efd2ae74b8e0edaafe8a2c4b7b6dc6ebb` |
| tests/fixtures/save-repository.tsx | `a757eb8ff8eb9778cff136bd81ff5f3de1260ae464c23a8a079dd4f0f802f975` |
| tests/fixtures/save-repository-api.ts | `899cc3b3f109cf0e83ff9c84b139803e644b9a692e7aea5d3340dec67829bc9f` |

Production edits are complete and fixed for the backup author's consumer rerun.
The independent RECOVERY-EXPORT-VALIDATION.md report is preserved unchanged;
its FAIL describes the retired source and must be independently rechecked.
This author verification does not claim reviewer acceptance or facade/UI delivery.

## Port and consuming facade/UI distinction

`SaveRepository.readRecoveryExport(): Promise<RecoveryExportResult>` is a
separate local repository port. New exported types are RecoveryExportResult and
RecoveryExportUnavailable; they live only in repository.ts.

```ts
type RecoveryExportResult =
  | Readonly<{
      status: 'available'; representation: 'raw-indexeddb-root-json';
      databaseName: string; structuralVersion: number;
      store: 'records'; key: 'root'; json: string; byteLength: number;
    }>
  | Readonly<{
      status: 'unavailable';
      cause: 'closed' | 'absent-database' | 'missing-store' | 'missing-root'
        | 'blocked' | 'unreadable' | 'non-json' | 'capacity-exceeded';
      message: string;
    }>;
```

`json` is the complete existing stored root's JSON representation, including its
actual epoch/revision, save versions, calendar and unknown fields. It is not a
CommittedSnapshot, BackupEnvelopeV1, supported-format conversion or a claim that
the data is compatible/importable. IndexedDB exposes a structured value, not
original file bytes; this preserves its JSON-compatible logical value.

The consuming facade must expose a separate operation, such as
`exportRawRecoveryData()`, bound to this port rather than readExportSnapshot or
exportBackup. Recovery UI should identify **Download raw recovery data**, use a
distinct `.recovery.json` filename, and explain that this file preserves stored
data but is not a compatible save backup. Download `result.json` without wrapping
it as v1, stripping fields, generating a new token, updating dates/calendar or
claiming migration. On unavailable, show the reason; never substitute a default
save. Those facade/download/UI bindings are not implemented here.

Normal validated `readExportSnapshot()` and ordinary `exportBackup()` remain the
supported backup path, with their existing validation/flush/import semantics.
Raw recovery does not relax normal loading or writes: after successful raw
export, the unsupported store still loads as unsupported. No decoder call or
automatic import/replacement follows raw export.

## Read mechanics and bounds

The method joins the existing serial queue but bypasses the normal initializer,
validator, snapshot cache and failed normal connection. A private temporary idb
connection opens `${appNamespace}:save` **without requesting a version**, so
existing structural versions, including future version 7, can be inspected.
It reads records/root in a readonly transaction and waits for completion. It
then closes its connection. There is no put, reset, store creation, upgrade of
an existing database, validation rewrite, invalidation or broadcast.

If the database is absent, the browser fires a creation upgrade event. Recovery
immediately aborts it without creating stores/root; the database remains absent.
The expected aborted transaction's tx.done rejection is handled. A blocked or
timed-out pending open returns a recovery retry message; close cancels a pending
recovery open, and any late success closes its connection as described above.
Versionchange closes the temporary connection. Missing records/root, closed
handles and unreadable requests return unavailable; no alternative store or
unsupported structural layout is guessed.

A bounded iterative JSON-only inspection uses the existing SAVE_LIMITS:
16 MiB UTF-8 for the entire raw-root JSON, 32 maximum traversal depth, 250,000
visited values. These are recovery work bounds, not approval of an unknown
format. Larger/deeper future data returns capacity-exceeded intact; nothing is
truncated. The browser must first materialize the indivisible IDB root read, so
these are inspection/serialization bounds, not a claim about browser allocation.

Dates, Maps, BigInts, undefined, nonfinite numbers, negative zero, sparse/extra
array properties, cycles and other non-plain JSON data are unavailable. They
would be transformed/dropped by ordinary JSON.stringify, so no lossy export is
invented. JSON-compatible unknown fields are retained, with exact UTF-8 byte
length (including accented text, emoji, control/quote/backslash escapes).

## Original refinement evidence before R-01 (historical)

Reproduced the integration gap before adding the port: normal load/export reject
readable future schema, content and policy data; native roots remain unchanged.
Three-engine reproduction passed at private report root
`learning-is-fun-repository-ccd82df92151433b913c7e57976d6ad6/results.json`.
This is a test demonstrating the gap, not successful normal recovery export.

Final complete focused repository regression:
`./tests/fixtures/save-repository-run.ps1` — **44 passed, 1 existing WebKit CDP
skip, 0 unexpected/flaky**, exit 0, 50.3 s. Started
`2026-10-09T01:29:35.606Z` / 02:29:35 BST. Actual running versions:

| Engine | Version | Focused result |
|---|---|---|
| Playwright Chromium | 156.0.8078.4 | 15 passed |
| Installed Edge/msedge | 154.0.4258.62 | 15 passed |
| Playwright WebKit | 27.2 | 14 passed; existing CDP forced-close skip |

Full native-root, recovery JSON, token, status, namespace and operation evidence:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-538b52dc349a4beea74dbeb4e8864e7f/results.json`.
One worker, reserved 5179, private Vite cache and Playwright output/report root.
No broad unrelated unit/build suite was rerun. Strict focused ES2022/DOM/Bundler
typecheck of repository, spec, entry/API and vite-env passes with no emit/cache.

Native operation audits prove existing recovery calls perform only an
unversioned open and readonly transaction: zero put, validation calls,
invalidation or token changes. A separate BroadcastChannel postMessage observer
was added to the fixture for the final targeted recovery recheck; zero broadcast
is required by the same exact audit assertions. Native rereads preserve the full
root, and separate `learning-is-fun:/playtest/:unrelated-sentinel`, sentinel/root,
remains exactly `{"marker":"untouched"}` for every future-format case.

That final targeted command, `save-repository-run.ps1 -Filter 'raw recovery|recovery gap'`,
passes **15 tests**, exit 0, 16.0 s. Its report is
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-2bad3500818b491d97caf9521811f204/results.json`.
The optional broadcast observer is guarded when the native channel API is absent.

Durable paired root/token sample (native before and after are identical):
namespace pattern is
`learning-is-fun:/playtest/:repository-814fc51f18bf6ba2e843-<suffix>-<case>:save`.
Cases are schema/content/policy/structure; the first three are structural v1,
structure is v7. All roots retain revision **37**, the epoch below, future
timezone `Etc/Future`, calendar week `3026-12-28`, unknownRoot.keep/text,
unknownSave.doNotStrip and unknownCalendar.retain. Schema case keeps save schema
2; content case keeps future-content; policy case keeps future-policy. Others
retain original fixture versions. Normal status is unsupported for all cases;
raw recovery is available. JSON byte lengths are respectively 633/632/632/633.

| Engine | Namespace suffix | Unchanged epoch |
|---|---|---|
| Chromium | 2c600cabeea0e70d83f1 | 8a58a10c-fbd3-4974-ab5d-d26f09c7fa61 |
| Edge | 95be9ae65424e819cd6d | 1b445936-22e5-4b1d-8c5e-46c65962d069 |
| WebKit | 08660b65e6b1dd73f363 | 797da92b-ea9f-45c2-90c2-23fc54f6b918 |

Additional all-engine cases prove absent DB remains absent after an aborted
creation attempt; existing absent root/store is not filled; closed port opens
nothing; a fixture-injected read exception returns unreadable and retry succeeds
with the identical native root. That exception is fault injection on a real
readonly transaction, not a claim of a naturally occurring browser failure.
Non-JSON values and depth/value/byte exhaustion remain stored unchanged and
return the named unavailable cause. A supported committed root also exports raw
without disturbing normal snapshot identity, reload or its validated export.
Original atomic abort/conflict/replacement/channel and F-01 regression cases pass.

An intermediate absent-DB run exposed an unhandled idb tx.done AbortError despite
the expected unavailable result. The new recovery upgrade callback now consumes
that expected rejection. Full affected flow passes; no page errors or unhandled
abort warnings remain. This necessary further source edit was reported before
the final consumer rerun. Production source is fixed for that rerun:
SHA-256 `56df08e463414f54a4ee3915ad5f1fd4bfc3932197d2a03375b739d89d68e308`.

No facade/UI, real educational decoder/policy, publication, disk-failure,
branded Chrome/Firefox or automatic future-format compatibility acceptance is
claimed. Same-reviewer independent approval remains required before integration.
