# WP04-02A implementation handoff

Implemented 9 October 2026 against accepted DEP-022/state contracts and the
WP01 namespace/host. Controller retains review, acceptance, integration and
commits. No dependencies, shared configuration/contracts/ledger, unrelated
work, domain reducer, decoder or facade were edited. No delegation, commits or
other-chat messages were performed. Source authoring began during the dependency
hold; all Node checks began after the controller's explicit release.

## F-01 repair — ready for the original reviewer's narrow recheck

The independent [validation](WP04-02A-VALIDATION.md) found that `immutable`
skipped mutable descendants when their parent was already frozen. Reproduced
the initial-load and successful-commit counterexamples before changing source:
all six save/nested-parent cases failed across Chromium 156.0.8078.4, Edge
154.0.4258.62 and WebKit 27.2. Cached snapshot/export music volume became 0.9;
native IndexedDB retained 0.25 at the same revision-0/revision-1 token. No new
invalidation was emitted. This was an in-memory/export defect, not a write.

The sole production repair makes the existing helper always traverse object
children, then freeze an unfrozen parent. It preserves identity and the
epoch → read-only duplicate → revision protocol. No transaction, cache or
consumer compensation was added. The validated save remains a JSON tree.

Added shallow-frozen save and shallow-frozen installation fixtures, using the
reviewer's exact initial save (S below with contentVersion=independent-initial,
rewardPolicyVersion=independent-policy and competition.policyVersion likewise).
Each case checks initial/new, ready, committed, committed close/reopen,
already-applied, conflict, replacement and replacement close/reopen results.
Every snapshot probe attempts the actual nested assignment, checks all object
descendants, compares export to a native root read under the same token,
requires the same cached snapshot reference, and checks unchanged signal count.
The original post-commit reducer changes only contentVersion to committed.
All applicable returned snapshot paths are covered; save-failed currently
returns no snapshot. Export and explicit reopen retain volume 0.25.

Actual repair verification, one worker on 5179 with private caches/reports:

- Before repair: `save-repository-run.ps1 -Filter 'shallow-frozen'` — six
  expected reproductions fail, exit 1; complete initial and committed outcomes
  are attached before assertions. Report root ends
  `learning-is-fun-repository-009265922cc246c0834381407502bfe3/results.json`.
- After repair, same exact flows/filter — **6 passed**, exit 0, 5.8 s; root ends
  `learning-is-fun-repository-960a09a947064d49900feb6da5d68b21/results.json`.
- Complete focused repository suite — **29 passed, 1 existing WebKit CDP skip,
  0 unexpected/flaky**, exit 0, 32.2 s. Started
  `2026-10-09T00:52:55.531Z` / 01:52:55 BST. Chromium/Edge each pass 10;
  WebKit passes 9. Full paired evidence is at
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-bce6d0a361984ce88bbe2a6f236ec39e/results.json`.
- Focused strict ES2022/DOM/Bundler/React JSX typecheck of repository, spec,
  entry, API and vite-env passes. Used `--ignoreConfig --noEmit --strict
  --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler
  --jsx react-jsx --types node --lib ES2022,DOM`. An initially untyped probe
  result array was explicitly typed; that annotation has no runtime effect.
  No broad unrelated tests/builds were rerun for this repair.

Both before/after report roots above are below
`C:/Users/alexb/AppData/Local/Temp/`. Durable exact evidence follows. For each
row, both initial revision 0 and committed revision 1 use the displayed epoch
within their respective run. Before repair both cached/exported roots have
music.volume=0.9 while native root has 0.25. After repair snapshot, export,
native root and close/reopen all have 0.25, all descendants are frozen, identity
is stable and signals are unchanged. Namespace database pattern is
`learning-is-fun:/playtest/:repository-814fc51f18bf6ba2e843-<suffix>:save`.

| Engine/parent | Namespace suffix | Before-repair epoch | After-repair epoch |
|---|---|---|---|
| Chromium/save | b9edcef121db4538f0da | cdc32a6e-98ba-4abe-801c-3631a61ff8eb | 4ff5aec1-e6b1-4bd7-859d-63ddb06cc2c9 |
| Chromium/nested | 8de486d4882ce798ef68 | b5e5be69-0b4f-40f9-abe2-45a63b4caed7 | e510c415-5931-48a0-b0b0-4a14cd5edf0d |
| Edge/save | f3b8e6e5ad4364dcf58e | bf071b22-0703-47e1-9c2d-ef762b64f353 | 11b19ca3-c9d9-4e72-b264-bd5efffa8fc4 |
| Edge/nested | 840219a7b5e2bd50acdb | f55c6878-23a3-4fbb-acf6-4568d46d76d6 | 140a4511-59c7-4ba8-ba03-34f10aabe336 |
| WebKit/save | ffc2852332691666b897 | 09667f66-c81c-46ff-a50b-f816dc1339bf | f7364b66-ca5d-4dae-8afa-e0e0cf895802 |
| WebKit/nested | 8ca4f1916bfaafbd6ee5 | cee06b98-2331-4b84-a4e8-c2c40f6dc0c0 | 6c690385-86ef-485a-a9d7-1e4f7ad1a38f |

Changed only repository.ts, save-repository.spec.ts, save-repository.tsx,
save-repository-api.ts and this handoff. No shared/config/dependency/Git/status
edits or unrelated worker changes. Reviewed repair source SHA-256:
`73abbc6a4dd5b7f24fd239695f1d17d7231955af0ba5afff040a7df520447a9f`.
Independent validation/administrative acceptance remains with the reviewer and
controller; this repair does not alter the independent FAIL report.

## Delivered boundary

`src/state/repository.ts` is the sole production IndexedDB/idb authority. It
exports openSaveRepository, SaveRepository, CommitPorts, RecognizeDuplicate and
RepositoryInvalidation. The returned loadRoot, commitCommand,
readExportSnapshot, replaceSave and close methods implement the accepted ports;
subscribeInvalidation and notifySilence supply the narrow channel adapter.
Construction takes the specified appNamespace/initialSave/validateSave and an
optional catalogue for loading/replacement validation. Domain composition must
supply its actual approved catalogue there.

One `${appNamespace}:save` database, structural version 1, records/root. First
initialization reads absence and puts the validated default inside the schema
creation transaction. Competing opens therefore see one initialized root, never
an intermediate empty store. Existing missing/unknown roots are recovery errors.
Mutation reads and checks inside one serialized readwrite transaction: epoch,
retained duplicate, revision/capacity, synchronous reducer, synchronous validator,
put, tx.done. Only IDB requests/completion are awaited inside transactions.
Exceptions explicitly abort; invalid/unsupported decisions also abort. Revision
increments once; snapshots and changes publish after completion. Snapshot
references are frozen and stable for a token. Inputs/ports are captured before
queueing. Failure leaves the queue usable.

Replacement checks the exact token, revalidates, requires a different bounded
epoch and writes revision zero atomically. The facade owns local fresh UUID
allocation. ResetSave/ReplaceSave through commitCommand are rejected: the facade
must route them through replaceSave. Ordinary commands cannot preserve the old
epoch while resetting the save. Retrying a lost replacement acknowledgement with
the prior token conflicts.

BroadcastChannel `${appNamespace}:save:invalidation` carries only committed
tokens or a silence signal. Unavailable channels are tolerated. Subscribers must
reload on invalidation; broadcasts are never trusted state. Focus/visible resume
reload independently, and every write reads the database token independently.
Versionchange closes/suspends the connection. Terminated/closed/unknown stores
return recovery failures; no blank reset, localStorage fallback, lease, timer or
unload save. Explicit retry requires closing/reopening the repository; a future
structural version remains unsupported.

## Contract refinement requiring integration attention

The frozen ReduceCommand returns a changed/duplicate decision but provides no
separate read-only duplicate-recognition port. Calling the full reducer before
revision comparison would violate the required ordering. CommitPorts therefore
adds optional `recognizeDuplicate(root, command, context): boolean`, after epoch
and before revision. WP04-04A must supply the domain's complete retained
identity/payload comparison for stale-revision duplicates. Without it, stale
revision requests safely conflict; exact-token reducer duplicates still work.
Expired/mismatched receipts return false and remain domain-owned. No shared
contract was changed. This is the material interface gap for controller review.

At the original handoff the root local project discovered only `*.local.spec.ts`, whereas this
assigned suite is `tests/browser/save-repository.spec.ts`. The owned focused
config runs it explicitly. Route any desired standard-command discovery change
to WP01; this author did not change the shared config.

## Verification and repeatable invocation

Owned fixtures use the existing mountPanel host: save-repository.html/.tsx,
type-only save-repository-api.ts, focused Playwright/Vite configs, teardown and
Windows run wrapper, all under tests/fixtures. The wrapper starts one browser
worker at reserved port 5179, creates a fresh private OS-temp cache/output/JSON
report root, and uses the bundled Node/short child Path. No shared report or Vite
cache is used by the final runs. Fixture-server teardown is private to this
local config and never enters the product build.

```powershell
& ./tests/fixtures/save-repository-run.ps1
```

Pre-review baseline run: **23 passed, 1 skipped, 0 unexpected/flaky; exit 0; 25.8 s**.
Started `2026-10-09T00:41:11.345Z` / 01:41:11 BST. Actual browser.version values:

| Engine | Observed running version | Result |
|---|---|---|
| Playwright Chromium | 156.0.8078.4 | 8 passed |
| Installed Edge/msedge | 154.0.4258.62 | 8 passed |
| Playwright WebKit | 27.2 | 7 passed; CDP forced-close probe skipped |

Full paired logical roots/tokens, exact per-case namespaces, statuses and engine
attachments are retained in the private report:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-c40a565082164b1086f10cf943550d21/results.json`.
This is local execution evidence, not a published play session.

Other checks actually run before review (retained, not rerun for F-01):

- App and WebWorker TypeScript projects pass with `--composite false
  --incremental false --noEmit`.
- Focused strict ES2022/Bundler/React JSX check of this suite and its configs,
  teardown and vite-env declarations passes, using `--ignoreConfig --types node`.
- Broad Vitest: `node node_modules/vitest/vitest.mjs run --no-cache
  --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`
  passes **17 suites, 966 tests**, exit 0.
- The earlier shared Node project check reported only DOM/global/type errors in the
  concurrently authored `tests/browser/interaction.spec.ts`.
  This suite uses a type-only fixture boundary and module-local browser
  declaration; its errors are resolved. Controller should recheck after the
  interaction author's integration. No all-project build pass is claimed.
- Owned-file trailing-whitespace scan passes; final ownership/status review
  preserves all other authors' files. No tracked shared files were changed by
  this lane.

During verification, a later completion observer falsely reported early
publication because event listeners can run promise microtasks between them.
The fixture now registers its observer before idb's completion listener; focused
three-engine rerun and the complete final suite pass. One intermediate WebKit
context was destroyed by fixture hot reload during authoring; the final suite
ran with files fixed. Initial host pnpm lookup and Windows managed-server
termination friction were confined to fixture setup; final private invocation
starts/exits successfully. The earlier default-port run was stopped when the
controller supplied the port-isolation instruction; it is not final evidence.

## Durable concise paired root/token evidence

All saves below equal this complete baseline S except the named fields:

```json
{"schemaVersion":1,"contentVersion":"fixture-initial","rewardPolicyVersion":"fixture-policy","installation":{"timezone":"Europe/London","audio":{"soundEnabled":false,"silenceAll":false,"music":{"muted":false,"volume":0.25},"effects":{"muted":false,"volume":0.5}}},"profiles":{},"competition":{"timezone":"Europe/London","latestOpenedWeek":null,"currentScores":{},"currentSlots":{},"archives":[],"policyVersion":"fixture-policy"}}
```

A logical stored root is exactly `{epoch, revision, save}`; snapshot is exactly
`{token:{epoch,revision},save}`. App namespace is
`learning-is-fun:/playtest/`. For the table, database names are
`learning-is-fun:/playtest/:repository-814fc51f18bf6ba2e843-<suffix>:save`.
Thus baseline plus table overrides reconstruct the complete paired roots.

| Engine/case | Namespace suffix | Epoch | Before → after revision/root |
|---|---|---|---|
| Chromium commit/reload | c5ecd0e17a66beeeebc7 | 97c63e5b-8853-4f81-9f7f-8d0571371c8f | 0/S → 1/S with contentVersion=success |
| Chromium aborts | 849a68b31e56da95125d | 54d8663c-c8a4-4388-a665-0637c3820931 | 0/S → 0/S for every rejected attempt; subsequent recovery 1/contentVersion=recovered |
| Chromium competing tabs | 0a87e203da26064ca7f3 | ebd794c3-252f-4966-bc2c-e6b582e1bef6 | both 0/S → one committed, one conflict, both 1/contentVersion=winner-0 |
| Edge commit/reload | f1692b990dc24cf7efc0 | 2c2ec8ee-8243-4e1d-ac1d-55d4fbbda161 | 0/S → 1/contentVersion=success |
| Edge aborts | 52e7210ec87bc57e9b8d | f0c1439e-179f-4e81-b042-cc5ffbb7c7c5 | 0/S → 0/S; recovery 1/contentVersion=recovered |
| Edge competing tabs | dee22b41944100c59843 | 7fc34bb9-0c84-4102-9ab2-e6a087516f3b | both 0/S → committed/conflict at 1/contentVersion=winner-1 |
| WebKit commit/reload | a6d48d28bc8894adf748 | e66111b9-2e3d-4ce9-9fc4-2462a2e9436a | 0/S → 1/contentVersion=success |
| WebKit aborts | 71b8cda0db13f53fba8b | 3c30f8f6-5cf6-42cc-9473-ba7c2fbaf55e | 0/S → 0/S; recovery 1/contentVersion=recovered |
| WebKit competing tabs | d7d8a438bfb37bfab6f2 | bb06a58f-8dce-4208-8265-387f7d63f993 | both 0/S → committed/conflict at 1/contentVersion=winner-1 |

Rejected attempts: reducer exception, validator invalid result, validator
exception, asynchronous reducer/validator ports, actual reducer/validator queued
partial-root put followed by throw, native abort, throw after real queued put,
and native DataCloneError. Invalid validation returns invalid; other faults
return save-failed/retryable. No failed attempt emits a new committed token or
changes; raw reread and reload confirm the retained root. Recovery commits once.
Successful publication follows native completion; reload/export equal the root.

Replacement evidence (same namespace pattern):

| Engine/suffix | Old epoch at revisions 0→1→2 | Replacement epoch at revision 0 |
|---|---|---|
| Chromium/a597869e411110b3df81 | 70ebf102-625f-4046-81ce-447df7ea3ae0 | 76a1b4cb-7bb9-4d4e-a801-0b75459fc8ca |
| Edge/005aea02d110ff968e1e | 19b3eb34-868e-403d-891c-561337d5b0a3 | 47291d23-43dd-4d7a-82cf-3b3ced1c1f76 |
| WebKit/c143469952ed2a8459aa | 90210828-aa26-4259-8c94-a3ba2c53f21b | 5fbf2e24-583c-43b8-afd0-fedbe4ea203f |

Revision 0 is S. Revision 1 changes contentVersion to delivery and
rewardPolicyVersion to receipt:delivery. Revision 2 changes only contentVersion
to intervening. Retained identical delivery with expected revision 0 returns
already-applied at revision 2 without calling the reducer again; mismatch
conflicts. An expired guard returns invalid/encounter-expired. Invalid replacement
returns unsupported and writes nothing. Valid replacement is S with
contentVersion=replacement, the new epoch above, revision 0. Old-epoch delivery
and lost-ack replacement retry conflict with that exact replacement snapshot.
Separate `learning-is-fun:/playtest/:unrelated-sentinel`, store sentinel/root,
still contains exactly `{"marker":"untouched"}` after replacement.

All engines also prove missing BroadcastChannel still yields one winning write
and one fresh conflict, real committed-token/silence channel delivery, independent
focus refresh, MAX_SAFE_INTEGER capacity refusal, explicit close, unknown store,
missing existing root, and versionchange/newer-version suspension. A held raw
connection creates a genuine blocked upgrade; the repository closes and returns
blocked/save-failed with **"Close other game tabs and retry."**, preserving S and
its token. Chromium/Edge CDP browser storage removal forces a genuine terminated
connection: unreadable/save-failed/storage-unreadable, no new snapshot, recovery
message **"Saved data is unavailable. Retry or recover from a backup; your save
has not been reset."**. The test-only browser removal is not product behavior.

## Dependency and limits

Installed **idb 8.0.3**, published integrity and full ISC notice are retained in
[IDB-DEPENDENCY-HANDOFF.md](IDB-DEPENDENCY-HANDOFF.md). This author did not repeat
research/install or change the dependency pin. Only repository.ts imports idb
in production. Preserve the notice in eventual distribution.

Fixtures are deterministic synthetic storage policy, not real educational,
reward, ordinal allocation/compaction, decoder or facade acceptance. The
validator owns save numeric/domain capacities; the repository owns safe revision
arithmetic. Browser transaction completion is ordinary save acknowledgement,
not an OS disk-failure/data-clearing guarantee. WebKit forced termination is
unverified because this probe needs CDP; real WebKit abort/block/versionchange
coverage passes. Branded Chrome and Firefox capability gaps remain documented
in BROWSER-CAPABILITY.md; neither unsupported browser was attempted/relabelled.
No published gameplay, audible silence, full D1–T2, PWA or deployment acceptance
is claimed. F-01 is repaired and ready for the original reviewer's narrow recheck.
