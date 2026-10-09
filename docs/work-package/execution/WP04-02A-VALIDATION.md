# WP04-02A independent implementation validation

Initial review and narrow repair recheck completed 9 October 2026 by the same
fresh independent implementation validator.

**Current verdict: PASS — F-01 closed; no open actionable findings.** The
repaired immutable snapshot/export contract passes the original counterexamples
and related returned paths in all three engines. Prior valid transaction,
token, initialization and recovery evidence remains applicable, supplemented by
the author's complete repaired focused suite. Controller alone accepts,
integrates and commits; this report does not grant administrative acceptance.

## Scope and authority

Read [GLOBAL_RULES](../GLOBAL_RULES.md), [WP04-02A](../chunks/WP04-02A.md),
[WP04-01A](../chunks/WP04-01A.md), its accepted
[handoff](WP04-01A-HANDOFF.md) and [validation](WP04-01A-VALIDATION.md),
DEC-006/013/018/019, the complete repository and focused browser fixtures, and
[WP04-02A-HANDOFF](WP04-02A-HANDOFF.md). Checked the actual state contract,
namespace producer and installed idb dependency against their retained evidence.

Used the ordinary report writer and the standard build protocol once for this
verification stage. The failure is a localized production contract defect;
the causal helper is established directly, so no separate multi-stage diagnosis
or implementation loop was initiated. This assignment prohibits delegation,
other-chat messaging and production/test/configuration/dependency/Git/status
changes. Only this repository report was written. Browser caches, output and
JSON reports are private OS-temp artifacts. All browser execution was serial
with at most one browser worker and used only port 5179.

## F-01 repair recheck and current closure

Independently inspected the repaired helper and the new fixture cases against
the original finding. The sole production correction is at
`src/state/repository.ts:40–45`: traversal now runs for every object; only the
final Object.freeze call is conditional. This repairs the earliest producing
layer without changing cache identity, transaction behavior or token ordering.
The save remains the accepted JSON tree. The shared state-contract hash is
unchanged. No new architecture, duplicate policy or contract redesign was
introduced.

Fresh independent probes imported the actual repository module directly from
the existing focused Vite host, rather than relying on the author's fixture
API. They used the exact original baseline below, its synchronous
shallow-frozen-save validator, and a related validator that freezes only the
installation container. Each chain attempted the original music.volume=0.9
assignment and read native IndexedDB at these eight returned paths:

`initial-load/new → ready-load → committed → committed-reopen → already-applied
→ conflict → replacement → replacement-reopen`.

**Result: six independent chains passed, 48 snapshot probes passed, exit 0.**
Actual engines were Chromium **156.0.8078.4**, installed Edge **154.0.4258.62**
and WebKit **27.2**, run sequentially with one browser at a time on port 5179.
Every object descendant was frozen; each nested mutation was prevented;
snapshot/export retained volume 0.25; repeated exports returned the exact same
snapshot reference within that repository instance; the token and complete
snapshot were unchanged by the attempt; export exactly equalled the independently
read native root; and signal counts were unchanged. References across distinct
close/reopen instances were not required to be identical.

Every chain had revisions `0,0,1,1,2,2,0,0`. Revisions 0–2 used one original
epoch. Replacement used the locally allocated different epoch and revision 0,
retained exactly after reopen. For a complete logical root, start with the
baseline below: revision 1 changes only contentVersion to `committed`; revision
2 additionally changes rewardPolicyVersion to `receipt:delivery`; replacement
uses the baseline with contentVersion=`replacement`. Music volume remains 0.25
in all snapshots, exports and native roots.

The exact namespace is
`learning-is-fun:/playtest/:f01-independent-<engine>-<parent>-<namespace UUID>`;
the database appends `:save`.

| Engine / frozen parent | Namespace UUID | Original epoch | Replacement epoch |
|---|---|---|---|
| chromium / save | `1abe5093-1c30-4b5b-9cdc-1c4c3cee6f60` | `495be78d-411d-4335-99ad-211fab4eaf59` | `f3b9ef48-7715-4bf1-9809-57797b1e25f3` |
| chromium / installation | `6c22c5cf-f0fe-4818-8716-2330b08757b3` | `8ae0035b-7b1f-477a-800d-0f9ec6e039fd` | `080e7887-4512-4018-9586-a34d4827cc42` |
| edge / save | `74aef723-9e5c-45dc-a9dd-13488f6319ec` | `5f21b72c-68b0-4d92-bf74-348c178ee6a3` | `baa472ce-92e8-4b4d-b11f-1a5254f38f77` |
| edge / installation | `c3f90a97-789a-455e-ae6a-42c9e51ed0f8` | `8ef882c1-26c4-4a21-9d2a-68d7bf2d24f7` | `7fe10040-0892-4572-9291-68be0867fe53` |
| webkit / save | `820c14e0-a668-4047-8910-4f96d1702a35` | `30bb29f9-d482-414f-9452-0423f7877140` | `2d16ebfb-576d-4290-a3b4-cdad07a6f353` |
| webkit / installation | `1552aa38-8302-449c-b6eb-eed02ce22840` | `d4885f0c-02f6-420d-b4e7-df2295468765` | `710860a4-a07b-435e-abce-de76c52cb7a0` |

Fresh run started `2026-10-09T00:57:02.853Z`, ended `00:57:07.048Z`
(01:57 BST). Complete paired roots, tokens, mutation attempts, references,
signals and boolean outcomes are retained at
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-validator-f01-recheck-c59990fa-3047-4594-ab48-84dbf05756c1/independent-results.json`.

Also independently decoded the author's retained repair evidence:

- Before-repair report `learning-is-fun-repository-009265922cc246c0834381407502bfe3/results.json`:
  six red cases, eight returned paths per case, initial and post-commit cached
  volume 0.9 versus native 0.25 in all engines.
- After-repair report `learning-is-fun-repository-960a09a947064d49900feb6da5d68b21/results.json`:
  six passing cases, with all paths deeply frozen and exports equal to storage.
- Complete repaired focused suite report
  `learning-is-fun-repository-bce6d0a361984ce88bbe2a6f236ec39e/results.json`:
  **29 passed, one existing WebKit CDP skip, zero unexpected/flaky**, started
  `2026-10-09T00:52:55.531Z`, duration 32.181 seconds. Reused this valid regression
  evidence and the author's focused strict typecheck; no broad suite or full
  build was rerun during the narrow recheck. All three report roots are below
  `C:/Users/alexb/AppData/Local/Temp/`.

The optional read-only `recognizeDuplicate` port disposition remains compatible
and ready for facade handoff as described below. WP04-04A still supplies the
complete domain identity/payload/expiry comparison and approved catalogue;
repository acceptance does not certify that later domain composition.

Reviewed repair hashes, unchanged through the independent recheck:

| File | Lowercase SHA-256 |
|---|---|
| `src/state/repository.ts` | `73abbc6a4dd5b7f24fd239695f1d17d7231955af0ba5afff040a7df520447a9f` |
| `src/state/contracts.ts` | `9f9987c93ba1e8ce7682957861ab15f46c27210d70cd0dd9a63c1a644945bccf` |
| `tests/browser/save-repository.spec.ts` | `9195667e5ad59a4a77676b3e7dee76919d9c610a994880f8d608a7446fda84df` |
| `tests/fixtures/save-repository.tsx` | `670a2fa81f2bd562faef81d16cd42ed09457b25b25243c43eac40247a463e3ff` |
| `tests/fixtures/save-repository-api.ts` | `01171097dea199a22c8242bb14f0b873ef8ef8834610c565c01dfc8f946c34e7` |

Only this validation document was updated by the reviewer. F-01 is closed;
the original failure and evidence below are retained as history. The existing
domain, browser-capability and publication limits remain unchanged.

## Historical finding F-01 — P2, now closed

The following describes the pre-repair source and original failed review.

**Earliest causal layer:** `src/state/repository.ts:40–44`, `immutable`.
Its `!Object.isFrozen(value)` guard skips both freezing and traversal for an
already-frozen parent. A frozen object can still contain mutable descendants.
The helper therefore does not establish deep immutability at initialization,
load or mutation publication (`root`, `snapshot`, and the validated-write path).

The accepted `ValidateSave` contract requires a fresh decoded valid save; it
does not require that the returned object be unfrozen or already deeply frozen.
A validator that additionally freezes its fresh top-level result remains
compatible. The counterexample uses only the known-valid synthetic baseline,
with a synchronous validator returning
`{ status: 'valid', save: Object.freeze(structuredClone(candidate)) }`.
It does not ask the repository to implement educational or decoder policy.

**Exact reproducible input and flow:** on the focused host, dynamically import
the actual `src/state/repository.ts`; use a new app namespace and this complete
initial save:

```json
{"schemaVersion":1,"contentVersion":"independent-initial","rewardPolicyVersion":"independent-policy","installation":{"timezone":"Europe/London","audio":{"soundEnabled":false,"silenceAll":false,"music":{"muted":false,"volume":0.25},"effects":{"muted":false,"volume":0.5}}},"profiles":{},"competition":{"timezone":"Europe/London","latestOpenedWeek":null,"currentScores":{},"currentSlots":{},"archives":[],"policyVersion":"independent-policy"}}
```

```ts
const validateSave = (candidate: unknown) => ({
  status: 'valid' as const,
  save: Object.freeze(structuredClone(candidate as SaveDataV1)),
});
const repo = openSaveRepository({ appNamespace, initialSave, validateSave });
const loaded = await repo.loadRoot(); // new, revision 0
if (loaded.status !== 'new') throw new Error('Expected new');

// Runtime consumer mutation probe, despite the readonly TypeScript surface.
(loaded.snapshot.save as any).installation.audio.music.volume = 0.9;
const exported = await repo.readExportSnapshot();
```

**Required:** mutation is prevented, and export still equals the committed root
under that token. **Observed:** snapshot and save are frozen, but audio is not;
the assignment succeeds. Export returns the same snapshot reference with volume
0.9 at revision 0. An independent native IndexedDB reread still has volume 0.25
under exactly the same epoch/revision. No new commit or invalidation was emitted.

This was reproduced in Chromium **156.0.8078.4**, installed Edge
**154.0.4258.62**, and WebKit **27.2**:

| Engine | Exact namespace suffix after `learning-is-fun:/playtest/:` | Epoch at revision 0 |
|---|---|---|
| Chromium | `independent-chromium-shallow-frozen-save-f1604bce-736a-4d1a-a482-ab37dc6f886d` | `f6c3225c-8214-4151-a42b-bdde8ecb2f55` |
| Edge | `independent-edge-shallow-frozen-save-c79c1640-8dea-4975-811a-fe8950711805` | `5475f64e-da0e-4498-85c3-568ec8149a43` |
| WebKit | `independent-webkit-shallow-frozen-save-6148c994-82ee-49be-9554-fbfa52286c7e` | `79dd93ca-77f5-421b-a669-968a272e8e06` |

Database names append `:save`. Complete before/after snapshots and raw roots
are retained in the independent JSON report identified below.

A second, independent flow confirms the defect **after a successful commit**.
Use the same shallow-freezing validator, ordinary `ReconcileCalendar` intent
with the exact loaded token, empty payload, synchronous reducer changing only
contentVersion to `committed`, and zero presentation changes. The context is
`{nowEpochMs:0,catalogue:[],questBindings:[],milestone:'M1',allocatedIds:{}}`.
After `committed` at revision 1, mutate the returned snapshot's music volume to
0.9 and export. All three engines return 0.9; native storage and explicit
close/reopen return 0.25 at the same revision-1 token. This confirms an
in-memory/export divergence, not persisted data corruption or early transaction
acknowledgement. The follow-up JSON retains every complete root and token.

| Engine | Follow-up namespace suffix after `learning-is-fun:/playtest/:` | Epoch at revision 1 |
|---|---|---|
| Chromium | `independent-chromium-shallow-committed-b89daf6e-c371-469a-9a66-a6641496d22f` | `2acdd062-83c3-4b94-9bae-ccf718d118b5` |
| Edge | `independent-edge-shallow-committed-b137d98c-3fab-4f86-86ba-96940ee1b8c6` | `fe95a24b-543b-4766-8dd8-a3bd57fee9a6` |
| WebKit | `independent-webkit-shallow-committed-2a4d70bf-0a9c-4a61-8d48-f79a71fef6fe` | `d011ace7-bdb6-476b-b63f-64497755bbd3` |

**Invalidated acceptance:** readonly immutable committed snapshots, one token
representing one complete committed root, and export reading that committed
root. The cache's same-token identity reuse makes the escaped mutation visible
on later export; cache replacement would only mask the producing defect.

**Action:** make `immutable` traverse descendants even when a parent is already
frozen, then freeze any unfrozen objects. Preserve stable identity for genuinely
immutable same-token snapshots. Add focused coverage for a shallow-frozen save
and a shallow-frozen nested container across load, commit and replacement. Rerun
the original counterexample through native storage, export and close/reopen, then
the focused three-engine repository suite. This validator made no repair.

## Criteria and passing evidence

| Criterion | Assessment and evidence |
|---|---|
| Sole app-scoped database authority | PASS. Production `repository.ts` alone imports idb. One `${appNamespace}:save`, version 1, records/root. Source search found no other production IndexedDB writer, localStorage fallback, periodic save timer or unload save. |
| First-open race | PASS. Author's real two-page concurrent opens return exactly new/ready with one identical complete root, then serialize same-token writers. Fresh Chromium replay independently passes. Additional three-engine initialization probes reject invalid, throwing and asynchronous validators with zero published snapshots and no initialized database; valid explicit reopen then creates one revision-0 root. |
| Synchronous reducer/validator and explicit abort | PASS. Reused paired author evidence for reducer/validator exceptions, invalid proposed save, asynchronous ports, a real partial root queued by reducer/validator followed by throw, native abort, throw after queued put and DataCloneError. Prior logical root/token remain exact; no new snapshot/changes are published; subsequent recovery commits once. Fresh Chromium replay passes. |
| Completion acknowledgement | PASS. Successful publication follows native completion in the author fixture. An additional independent three-engine probe aborts the transaction from the actual put request's success event, before transaction completion: request success is observed, result is save-failed, revision remains 0, and only the initial signal exists. No write is acknowledged merely because put succeeded. |
| Cross-tab stale revision and missing invalidation | PASS. Real concurrent same-token writers yield one committed and one conflict with the winner's exact root/token, including unavailable BroadcastChannel. Source reads/checks/writes inside the same overlapping readwrite transaction. Missing notifications cannot bypass token comparison. |
| Epoch → duplicate → revision ordering | PASS. The retained identical guard runs before revision comparison and does not rerun reduction or publish celebrations; mismatched/expired guards remain domain-owned. Independent three-engine counters prove malformed tokens and old epochs invoke neither duplicate guard nor reducer. Recognizer exceptions, asynchronous results and a queued partial write followed by recognizer throw explicitly abort; the queue subsequently recovers. |
| Whole-save replacement/reset | PASS. Source revalidates and requires the exact token and a different bounded epoch, writes revision zero and awaits completion. Old-epoch commands and lost-ack replacement retry conflict. Same-epoch and overlong replacement epochs are independently rejected without mutation. ResetSave/ReplaceSave command envelopes are rejected for facade routing through replaceSave. |
| Invalidation and focus refresh | PASS. Token/silence messages contain no save payload. Independent three-engine focus probes run with channels unavailable: no signal arrives before focus; focus itself reloads and emits revision 1 before any export/read call. Forged revision-999 channel messages produce sanitized notifications, while export still reads the real revision-1 database root. |
| Capacity | PASS for repository-owned revision arithmetic. MAX_SAFE_INTEGER refuses a new mutation without writing; validator owns domain ordinals, numeric ranges and save capacities. No educational capacity policy is invented here. |
| Blocked/versionchange/termination/unknown store | PASS within the engine limits below. Author's genuine held connection causes a blocked upgrade and suspension with “Close other game tabs and retry.” Versionchange closes the connection; reopen of a newer structural version is unsupported. Missing root/unknown store remain unreadable and are not initialized. Chromium/Edge CDP forced termination returns storage-unreadable/save-failed without a new snapshot; fresh Chromium replay passes. |
| Namespace preservation | PASS. Replacement retains the separately named sentinel exactly as `{"marker":"untouched"}` in every author's engine. Product source has no origin-wide deletion/clearing operation. CDP origin data removal exists only in the isolated termination test. |
| Immutable snapshot and export | PASS after repair: F-01 closed by the independent recheck above. Original unfrozen cases and repaired shallow-frozen save/nested-container cases pass; snapshot/export/native root equality and stable reference/token are independently confirmed across all returned paths. |

## Duplicate-recognition port compatibility

The optional `CommitPorts.recognizeDuplicate` refinement is compatible with the
accepted synchronous reducer/validator and ordering contract. It supplies the
read-only retained-delivery decision that the frozen `ReduceCommand` port cannot
provide separately. It runs only after epoch protection and before revision
comparison; without it, a stale revision safely conflicts. Exact-token reducer
duplicates remain supported. It introduces no receipt, score, reward, compaction
or expiry policy and changes no shared contract.

WP04-04A must supply its domain's complete retained identity/payload comparison,
return false for expired/mismatched receipts, and compose the approved catalogue
into repository construction. That named integration obligation is already
flagged in the author handoff; it is not an additional repository finding.
The boolean fixture guard proves adapter ordering only, not actual SubmitCheck
payload identity or educational correctness.

## Initial-review verification and retained historical evidence

1. Inspected and decoded the author's original real-browser JSON, including
   paired logical roots/tokens, returned statuses, engine-version attachments,
   recovery messages and untouched namespace sentinel. Its stats are **23
   passed, 1 skipped, 0 unexpected, 0 flaky**, started
   `2026-10-09T00:41:11.345Z`, duration 25.756 seconds. Reused valid Edge/WebKit
   cases instead of repeating the entire suite.
2. Fresh focused invocation:
   `./tests/fixtures/save-repository-run.ps1 -Project repository-chromium` —
   **8 passed, exit 0, 3.3 seconds**, one worker, private cache/output/report.
3. Independent direct browser probes imported the actual repository module on
   the existing focused Vite host. Sequential Chromium, Edge and WebKit runs
   produced **15 passing and 3 failing top-level cases** in the first probe;
   each failed case is F-01. Subcases include three recognizer faults and three
   rejected initializations per engine. Started
   `2026-10-09T00:46:54.017Z`, ended `00:46:57.542Z` (01:46 BST).
4. Follow-up probes produced **6 passing and 3 failing top-level cases** across
   the same engines: focus without channels and forged-token notifications pass;
   committed snapshot/export immutability fails and native storage/reopen confirm
   the cause. Started `2026-10-09T00:48:24.341Z`, ended `00:48:26.786Z`
   (01:48 BST). Probe harnesses exited 0 because they collected outcomes; their
   explicit `pass:false` results are failures, not an overall test pass.
5. Actual installed package is **idb 8.0.3**, ISC. Its LICENSE SHA-256 matches
   `873a2f333fda393ec3464f4579209b019d98e97c3bf498b10e85f630162fd708`.
   Reused [IDB-DEPENDENCY-HANDOFF](IDB-DEPENDENCY-HANDOFF.md) for publication,
   integrity and complete notice; no new research or installation was needed.

Private local evidence files:

- Author original: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-c40a565082164b1086f10cf943550d21/results.json`.
- Fresh Chromium: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-c9df0508541447578e2143c8f5db7ed1/results.json`.
- Independent probes: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-validator-bdd43bcc-d62b-44f8-bb6c-a3b0fa605753/independent-results.json`.
- Follow-up: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-repository-validator-followup-1ab47359-66e9-4fc4-bfc0-1d53c0316b9c/independent-results.json`.

These are local temporary execution artifacts, not published gameplay evidence.
The essential failure input, output, cause and closure criteria are retained
durably in this report even if temporary reports later disappear.

Initial-review source hashes, unchanged across the original browser verification
(superseded for repaired files by the recheck hashes above):

| File | Lowercase SHA-256 |
|---|---|
| `src/state/repository.ts` | `d5be5bffd7f11eec095d099a6d5fff1738e5e97dbfdb3608e00dd1cb7fce5010` |
| `src/state/contracts.ts` | `9f9987c93ba1e8ce7682957861ab15f46c27210d70cd0dd9a63c1a644945bccf` |
| `tests/browser/save-repository.spec.ts` | `62905163996249be5b31631b0a424fcde1711e54a11e201deb9832b00a6885e1` |
| `tests/fixtures/save-repository.tsx` | `8891dc82d7870324b63705e95c07d86540f2082d90b4ca84d1e7084433072997` |

## Evidence limits and integration boundary

Synthetic fixture ports certify storage mechanics only. Actual educational
transitions, receipt identity/payload comparison, episode/ordinal compaction,
decoder, facade, draft preservation/UI confirmation and reward atomicity remain
their assigned consumers' acceptance. This review does not certify audible
silence, full gameplay, PWA readiness or publication. Browser transaction
completion is ordinary save acknowledgement, not a disk-failure or browser-data
clearing guarantee.

WebKit forced termination remains unverified because the retained probe uses
CDP; WebKit real abort, conflict, blocked/versionchange and independent probes
are valid. Branded Chrome/Firefox capability gaps remain with the existing
browser matrix. No broad unrelated Vitest suites or all-project build were
rerun. The shared interaction.spec.ts Node typing issue and root Playwright
discovery correction remain with their designated owners; the explicit focused
runner discovers this repository suite correctly.

F-01 has been repaired and independently revalidated. No open actionable
repository finding remains; this child passes its repository-mechanics boundary
with the stated evidence limits. Administrative acceptance remains with the
controller.
