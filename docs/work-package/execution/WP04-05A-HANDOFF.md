# WP04-05A implementation handoff

Implemented 9 October 2026 under current GLOBAL_RULES execution authority and
the assigned single-author boundary, after accepted DEP-023/024. Independent
validation, acceptance and integration/commits remain Controller-owned.

## Files and interface

- `src/state/preferences.ts`: runnable createPreferenceController over the
  accepted preference/status/command DTOs and WP02 AudioPreferenceIntent /
  LiveAudioGate.applyLiveIntent. No database, playback, educational actions or
  duplicate persisted contracts.
- `tests/state/preferences.test.ts`: deterministic deferred enqueue and
  synchronous live-gate fixtures. The tiny fixture writer applies only the two
  preference command patches; it does not substitute a production repository.
- This handoff only. Shared source/config/dependencies/status/ledger and other
  workers' catalogue, scoring and audio changes are preserved.

Exports: createPreferenceController, PreferenceControllerOptions and
PreferenceController. Constructor fields are initialCommitted (snapshot or
null while loading), optional initialLoadStatus=loading/read-failed, enqueue,
applyLivePreferences and broadcastSilence. Optional allocateActionId allows the
facade to supply its allocator; default is crypto.randomUUID outside reduction.
enqueue accepts the existing SetAudioPreferences/SetProfilePreferences command
union and returns Promise<CommitResult>. Each dispatched envelope captures the
current epoch/revision, immutable target profile and one action ID.

Methods specified by the child: getStatus, subscribe (unsubscribe-returning),
setAudioPreferences, setProfilePreferences, acceptCommitted(snapshot,
acknowledgedGeneration?), receiveSilence and flush. The locally specified
recovery methods are retry, reportReadFailure and acknowledgeDiscardedChanges;
the child requires their behavior but leaves their signatures open. No shared
contract was changed. Acknowledging lost old-scope choices cannot clear pending
writes or read/write/gate failures.

## Behavior and integration

The live gate runs synchronously before deriving a patch or scheduling a save.
Microtask coalescing sends only changed leaves; one deferred command is active
at a time. Each leaf carries its request generation; acknowledgements retire
only the leaves that command actually saved and never newer edits. A later
committed revision replaces clean fields without rolling back dirty leaves.
savedGeneration advances from acknowledged/satisfied facts, not from requests.

Local/received Silence all latches this visit, stops through the gate immediately
and persists via the same enqueue writer. Local silence broadcasts immediately;
received silence never rebroadcasts. Refresh and another tab's saved unmute do
not release a local latch. Only deliberate exit-silence clears it, and never
creates first-use consent. Enable is required for never-enabled installations;
sliders/profile narration cannot enable sound, unmute a channel or exit silence.
Channel zero/mute/volume are independent. Defaults remain false/false/.25/.50,
profile narration=false and motion=system in committed first-run data.

Conflict uses the fresh token and only the latest dirty fields, with one automatic
retry before requiring explicit retry on repeated contention. Failure/rejection
retains visit-only choices and blocks readiness. retry resumes current valid
dirty fields; flush drains scheduled/in-flight work but does not erase failures.
Read failure gates silence and remains failed until acceptCommitted supplies a
valid read; it does not fabricate a root. Loading/unreadable snapshots require
no playback until a valid read, but ordinary loading does not create Silence all
or send a silence-all gate intent. WP02 consumes loadStatus as the temporary
playback guard. A clean first-run read restores false/false/.25/.50; dedicated
Enable then sets consent without needing Resume. Saved/local/received silence
and failed-read recovery retain their lasting latch and require explicit exit.
Explicit read-failed initialization remains blocked even
with a last-committed recovery snapshot. A live gate failure fails closed,
remains visible and cannot activate playback; recovery first re-establishes
silence. A successful slider alone cannot dismiss a failed stop. Even a failed
local stop broadcasts its silence request so other tabs can stop.

Epoch replacement discards all old patches, gates silence and reports unsaved
loss. Retired-epoch callbacks cannot restore old choices. Same-epoch deletion
drops only the removed profile's fields while valid captured-profile writes can
finish; settings never retarget another profile. Explicit acknowledgement clears
the reported scope-loss blocker, not storage failures. Scope-loss codes reuse
invalid-command (replacement) and profile-missing (deletion) from the accepted
reason DTO. WP04-04A composes helper readiness with command/panel blockers and
must call acceptCommitted on every committed/refresh/replacement snapshot.
WP01 forwards status to WP02 without creating a second queue or writing saves.

## Verification

All final checks passed with bundled Node
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`:

1. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/state/preferences.test.ts tests/state/contracts.test.ts`
   — focused fixture/type/port checks passed.
2. `node node_modules/vitest/vitest.mjs run tests/state/preferences.test.ts tests/state/contracts.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`
   — corrected final run: 2 suites, 66 tests passed (36 preferences, 30 accepted contracts).
3. `node node_modules/typescript/bin/tsc -p tsconfig.app.json --composite false --incremental false --noEmit`
   — application typecheck passed without writing compiler caches.
4. Owned-file trailing-whitespace scan and owned-path Git diff whitespace check
   passed; Git uses only the command-local exact safe.directory setting.

Checks ran serially with caches disabled and shared configuration untouched.
The Controller's dependency window was honored: checks stopped while open and
resumed only after explicit release. No final check failure remains.

Expected/observed rapid trace: gate(volume .1), gate(volume .2), gate(effects
mute), gate(silence), broadcast(silence), then one enqueue with latest narrow
leaves. Requested generation 4 / saved 0 while deferred; after acknowledgement,
generation 4 / saved 4, pending=false, failed=false. An older in-flight slider
ack leaves newer volume/mute/silence intact; old Enable/Resume acknowledgements
also cannot clear received silence. Failed save leaves requested silence,
savedGeneration=0 and blocked readiness; explicit retry saves the latest leaves.
Replacement/deletion fixtures demonstrate dropped old-scope choices and
explicit loss acknowledgement without retargeting. Test-only gates establish
ordering, not real acoustic output.

## Independent-review corrections and narrow recheck

Both findings in [WP04-05A-VALIDATION](WP04-05A-VALIDATION.md) were reproduced
before production repair using new tests over the actual helper and full-save
deferred harness. The initial filtered run exited 1 with both assertions red;
these were production regressions, not fixture/tool failures. The previous 57
passing checks did not establish the missing callback/startup invariants.

| Finding/checkpoint | Before correction | Causal correction and full-flow rerun |
|---|---|---|
| P1 — drain-start publication | Subscriber notification 2 edited effects .8 after music .7. Two revision-0 enqueues overlapped; commit/conflict produced four total calls. Flush reported ready before call 3's failure. | schedule installs the running promise before drain executes or publishes and retains scheduled ownership until the owned task starts. Same input now has one initial enqueue and two total sequential calls; the second captures revision 1. Flush remains unresolved until its late failure, then returns ready=false/failedPreferences=true. Explicit retry persists both latest fields and returns ready=true. |
| P2 — ordinary loading classification | null → clean first-run read → Enable → acknowledgement retained requested silenceAll=true even though saved audio was true/false. | Only real saved/read-failed silence initializes the latch. loadStatus handles ordinary loading, without manufacturing a silence-all intent. The exact flow now loads false/false, then requests and saves true/false with ready=true. A returning true/false save loads without a gate, activation or save command. |

The original P1 test preserves the review's complete four-call branch if this
regression returns, so its failing trace includes the premature ready result
and later failure rather than stopping at the first count mismatch. Both
original tests passed immediately after causal repair. Related variants preserve
saved/local/received/read-failed silence across load completion and Enable;
two simultaneous flush calls wait through reentrant captured-profile edits,
conflict and late failure. The full preference and contract suites/typechecks
passed after adding a fresh combined case: received silence during first Enable
publication survives its acknowledgement, failed persistence and explicit retry.

For independent narrow recheck, use the same cache-free Vitest invocation with
`-t 'review P|ordinary load completion|returning consent|reentrant captured-profile|fresh startup'`
over tests/state/preferences.test.ts (nine added correction/variant cases).
The production change is confined to initial latch classification and scheduling
ownership; the earlier loading fixture's invented-latch expectation was corrected.
No shared contracts/configuration, reviewer report, Git state or status ledger
was edited. This is author correction evidence, not independent acceptance.

## Criteria and limits

P4-F preference/gating scope is represented by exact defaults, explicit enable/
resume, independent channels, three rapid generations then silence, stale ack/
refresh, bounded conflict, failed save/retry, received silence, epoch replacement,
deletion and cold read failure fixtures. P4-J covers captured-profile motion and
narration patches/reload without scoring or assistance commands.

The accepted DTOs have no material blocking defect. Retry/read-failure/scope-loss
method signatures were completed locally as described above. Event traces prove
adapter ordering only: actual active/queued audio and speech cancellation,
gesture activation, local-English voice/text fallback, UI controls/Stop reading,
audible silence and published reload/update/browser journeys remain WP02-05A,
WP04-04A and WP06 acceptance. No acoustic or real storage claim is made.
Ordinary supported writes; no Toolkit, staging, commits, workers or other-chat
messages. Standard build protocol applied once; queue/ack/latch decisions and
their verification are coupled and the assigned boundary explicitly forbids
delegation.
