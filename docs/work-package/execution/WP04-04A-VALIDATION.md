# WP04-04A — independent facade validation

9 October 2026. Fresh independent validator; report and temporary probes only.

**Current verdict: PASS for the reviewed WP04-04A technical implementation boundary. F01, F02 and F03 are closed.** The final revalidation below records the last native-IDB original and protection variants, exact source hashes and evidence limits. Controller retains acceptance/commit authority; this is not whole-package or release acceptance.

**Initial verdict (historical): CHANGES REQUIRED.** The principal atomic M1 path passes the reviewed evidence and fresh independent real-IndexedDB anchor/provenance/flush probes. Three actionable findings remain: obsolete preference retry reservations exhaust the facade, an aborted replacement cannot perform its advertised exact retry, and the owned browser spec violates the Node-only type boundary. These are correction handoffs to the original WP04-04A author through Controller, not acceptance of the facade or whole package.

**Probe/source-review work is stopped and ready for correction handoff.** No production, owned permanent test, dependency, shared configuration, status, Git, delegation or other-chat message mutation was performed. Port 5182 has no listener after fixture teardown. Port 5184 was not used. The report and `.wp04-04a-independent/` probes are the only workspace outputs of this review.

## Findings

### F01 — P2: successful preference recovery leaks failed reservations until all new commands are refused

Owner: `src/state/controller.ts:150–158,196–203`, composed with the accepted preference helper's fresh-action retry behavior in `src/state/preferences.ts:211–234,341–344` (line references describe the reviewed source).

Every failed preference dispatch reserves a context in `retryContexts`. The helper retries current dirty leaves with a new action ID, so the successful command deletes only its own context. Both preference command kinds are excluded from the failed-intent retirement branch; the previous failed context can never be retired by that helper's successful retry. Draft/suspension replacement/discard should also be checked against this same retention rule. The failure is in the facade's reservation lifecycle, not the helper's accepted generation/dirty-leaf contract.

Independent Chromium native-IDB reproduction, test `recovered preference failures must release obsolete reservations`:

1. Start a clean facade with no profiles and its real repository. Alternate music volume between `.7` and `.3` so each attempt needs a write.
2. Abort each first native `put`, flush to a visible preference failure, call `preferences.retry()`, and flush again.
3. The first **127** retries successfully commit and return `ready: true`.
4. The 128th failed attempt fills the reservation map. Its fresh retry never reaches the repository: `PreferenceStatus.errorCode === 'capacity-exceeded'`, generation 128, savedGeneration 127, pending/failed true, pendingCommands 0.
5. An unrelated `CreateProfile` is also rejected with `invalid/capacity-exceeded`, despite only the latest preference choice actually being unsaved.

At the failure boundary the persisted token is epoch `f482aae7-a253-4d4d-ad94-87e7a05b8e3f`, revision 128. This is not the author's intentional 128-*unresolved*-command case: 127 earlier preferences were explicitly retried, saved and acknowledged ready. Reload clears volatile reservations, but ordinary recovery must not require reload. The retained contexts are inaccessible through the preference API, so “Finish or retry the pending saves” does not recover this state.

Expected: terminal or explicitly superseded preference/draft work releases its reservation while genuinely pending/failed educational actions preserve their original IDs and clock. Keep the passing failed-Open reservation/capacity protection; do not restore eviction of unresolved work. Add a focused regression through the actual composed preference helper, including the exact recovery loop and a subsequent ordinary command.

### F02 — P2: aborted ReplaceSave consumes the only validated candidate before its advertised retry

Owner: `src/state/controller.ts:163–175,278–291`; the existing backup session is correctly a one-use private preview capability.

The facade calls `imports.confirmImport` before `repository.replaceSave`. Confirmation consumes the preview. A transaction abort returns `save-failed/retryable: true` and retains the operation's clock/epoch context, but the validated replacement candidate is not retained with that operation. Dispatching the identical command again calls `confirmImport` again and returns `invalid/prepared-import-expired`. The public `backupActions.confirm` also constructs a new command each invocation and cannot recover that consumed preview.

Independent Chromium native-IDB reproduction, test `failed replacement keeps validated candidate for exact safe retry`:

1. Create one profile, export a flushed valid backup, prepare its real file bytes, and retain the resulting `ReplaceSave` command.
2. Abort its native `put`. Result is `save-failed`, `retryable: true`; both the published snapshot and native root exactly equal the original epoch `0f0e54fd-70c1-4e28-8dca-5216a70e9ed6`, revision 2.
3. Retry the same immutable command with no intervening commit. Actual result: `invalid`, code `prepared-import-expired`, message “Choose and preview the backup again.” `flush` remains `ready: false, failedCommand: true`.

Expected: an operation advertised as safely retryable retains its already-authorized validated candidate privately through a failed transaction and can retry under its original token/new-epoch allocation. Stale-token conflict must still require a fresh preview, and cancel/dispose/replacement must still invalidate private capabilities. Preserve the decoder's one-use preview pairing; resolve it once into the facade operation rather than weakening the backup producer or accepting save data from the command. Verify the public confirmation adapter as well as retained-envelope dispatch. Reopening/reconfirming a file is an available workaround, not the promised retry of this action.

### F03 — P2: owned browser spec imports browser/React implementation into the Node-only typecheck

Owner: `tests/browser/local-save.spec.ts:6` and its fixture API usage. `tsconfig.node.json` deliberately has `lib: ["ES2023"]`, Node types and no JSX. The import `import type {} from '../fixtures/state-integration'` still resolves a TSX implementation to obtain ambient `Window`, so the owned suite fails the supported Node boundary.

The root Node project check fails, including unrelated existing composite-file-list and concurrently owned audio-spec errors. Those other failures are not attributed to WP04-04A. A separate focused command isolates the owned defect without changing any shared settings:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2023 --module ESNext --moduleResolution Bundler --lib ES2023 --types node tests/browser/local-save.spec.ts
```

Exit 1: `TS6142` at line 6 (`state-integration.tsx`, JSX not set), then `TS2304 Cannot find name 'window'` and dependent lost-type errors. Full isolated diagnostics are retained in `.wp04-04a-independent/node-boundary.txt`. The author's focused check explicitly enables JSX and obtains default DOM libraries, so its success does not prove this boundary.

Expected: use a browser-type-free structural fixture API for the Node spec, following the existing `save-repository-api.ts` / `backup-roundtrip-api.ts` pattern, and local typed access to the browser evaluation surface. Do not broaden the shared Node project with DOM/JSX to conceal the import. Root composite-list issues remain for their integration owner; the focused owned check must independently pass.

## Passing assessment and contract coverage

Read the final chunk/handoff, accepted state DTOs, repository, preference and backup contracts/implementations, actual transition/controller, focused learning/selection/evidence/calendar/scoring/binding interfaces, and relevant unit/browser tests. Reused the separately accepted selector and same-week decoder correction reviews. No new producer audit or production correction was attempted.

| Boundary | Assessment and evidence |
|---|---|
| One writer and publication | PASS. Controller serializes captured commands; repository owns the readwrite transaction, checks epoch first, recognizes exact retained duplicate before revision, then reduces/validates/puts and awaits `tx.done`. Controller accepts only acknowledged snapshots. Author's abort trace captures the proposed candidate while the old snapshot is still visible and proves native-root rollback/no celebration. Independent import abort also preserves both surfaces. |
| Captured profile and retry identity | PASS for inspected ordinary educational path and author's final affected evidence. Input/profile/response/token are cloned before await; Open allocations and one clock are reserved. Exact in-flight envelope mutation rejects. The failed-Open test preserves original IDs/old-week clock across 130 completed no-op operations and admits an existing reservation at real unresolved capacity. F01 concerns obsolete reservations; F02 concerns missing private replacement payload. |
| Duplicate/sequence/epoch guards | PASS. Retained Check recognition compares profile, encounter, episode, sequence, submission and complete response; no clock/reducer/evaluator/scoring is invoked by recognition. Older compacted identities cannot reconstruct state. Exact retained stale-revision duplicate has no presentation changes; old epoch is rejected before recognition. Author has actual two-tab evidence. |
| Calendar and personal records | PASS. One observed clock feeds London calendar and `addCalendarDays`; both `nextCompetition` and `nextPersonalRecordsByProfile` enter the candidate. Invalid/incomplete input discards candidate rollover. Valid triggering Check and rollover commit together. Rollback retains active competition week while observations use actual date. Author's cross-week/53-closure evidence covers lasting personal records beyond 52 displayed archives. |
| Selection, provenance and rewards | PASS. Fresh routes resolve through real bindings; resume retains original encounter/provenance; completion uses the producer's nonempty/all-required helper plus prerequisites. Optional transfer derives from permanent singleton source binding, not encounter scanning. First-Check scoring rechecks eligibility; observation receives original learning reason, while reward reason mapping is explicit. |
| Episode and compaction semantics | PASS in inspected code/tests and reused real-IDB cases. Suspend creates no synthetic failed observation; Finish is completion-only, once per closed ordinal/action. Resume after unsuccessful finish advances only episode; cumulative Checks/help/opportunity persist. Latest successful detail can compact without deleting permanent bindings, question ordinal totals or personal records. |
| Last-actual-Check projection | PASS. Pure explicit-snapshot selector resolves approved canonical/revision/descriptor, clones saved draft and actual attributed last evaluation/delta, and never invokes evaluation/policy/scoring/repository. Fresh independent draft editing preserves old feedback identity; initial feedback is null. Reused missing/withheld/mismatched revision checks return unavailable without mutation. |
| Preferences, live gate and readiness | PASS for ordering/current-panel sampling and fresh delayed-failure case; F01 remains. Helper calls gate synchronously, preserves latest dirty generations/silence, and composes into the same writer. Flush drains reentrant queues then resamples the current transient getter; draft-only failure is panel-owned, unrelated durable failure remains blocked. |
| Backup/recovery separation | PASS for decode/private preview/token/cancel/conflict/full replacement/raw recovery design; F02 remains. Compatible export is validated and ordinary export flushes; explicit last-committed export is labelled recovery. Raw recovery forwards original unknown-format logical root without v1 conversion or blank-save fallback. |
| Profiles and scope | PASS by inspected lifecycle implementation and author native-IDB evidence: immutable IDs, rename retains awards, captured profiles do not retarget, delete/start-over strip target current/archive links without reranking or issuing replacement medals, replacement/reset use new local epoch and preserve unrelated namespace. |

No generic transaction framework, durable event journal, second state store, invented binding mapping or downstream grading compensation was introduced. The bounded reducer/controller split is appropriate. The reservation lifecycle and replacement operation ownership need the narrow corrections above; a broader architectural rewrite is not justified by this review.

## Independent original arithmetic and fresh adversarial evidence

Expected arithmetic was fixed independently before reading observed results:

| Input | Lifetime delta | Competitive delta |
|---|---:|---:|
| Q1 bridge total-12, answer hint, correct `[3,4,5]` | 10 answer + 20 quest = 30 | 10 |
| Q2 spellbook anchor, first independent correct punctuation | 20 question + 20 quest = 40 | 20 |
| Q3 merchant wrong apples3/pears6 | 5 | 5 |
| Q3 retry correct apples6/pears3 | 5 supported success + 20 quest = 25 | 5 |
| Total | **100** | **40** |

Fresh Chromium native-IDB trace observed these exact deltas, three slots, three quest receipts, Q1–Q3 permanent bindings/quest completions, and `scarf-leaf`/`planter-rim` entitlements. Reload retained the entire snapshot. After the wrong merchant Check, a saved partial `{apples:6,pears:null}` draft did not alter last evaluation or submission/episode identity.

The extended fresh case completed a free repeat of total-12 using `[5,5,2]`, compacted the original hinted source encounter, rejected resuming the expired ID, then opened the actual `q1-transfer-m01` task total-10 and solved it using `[3,3,4]`. Transfer added exactly 20 lifetime/20 competitive, giving 120/60, with no restoration or extra required binding/quest receipt. A JSON-cloned exact duplicate returned `already-applied` with no changes. Native root exactly equalled the final acknowledged snapshot. This is real M1 singleton/provenance evidence, not multi-required M2 evidence.

Fresh delayed preference case: enable/save, hold an effects `.9` write, request Silence all, newer effects `.1`, and profile reduced motion while it waits; start flush, prove it has not settled and the silence gate already ran, then abort/release the older native write. Flush returned failed preference readiness while the committed effects volume remained `.5`; requested silence/.1 survived. Retry saved all latest fields, motion and generation, then returned ready. This independently tests asynchronous supersession/flush/live ordering; the gate is a fixture, so no acoustic claim follows.

Independent browser reports (Chromium 156.0.8078.4, one worker, unique output/cache, port 5182):

- `C:/Users/alexb/AppData/Local/Temp/wp04-04a-independent-30150e0397ab4174860b6db059dc00f5/results.json`: 1 passed original anchor/projection/compaction case; 2 failed acceptance assertions reproducing F01/F02. JSON attachments `preference-reservation-capacity` and `replace-exact-retry` retain outcomes/native roots; failure traces are beside the report.
- `C:/Users/alexb/AppData/Local/Temp/wp04-04a-independent-25f2f15df2704bf5a2e84fe9f99f661b/results.json`: 2 passed, extending the anchor through the distinct transfer/duplicate and adding delayed preference abort. No production change occurred between these runs; F01/F02 were not silently converted to expected-failure passes or claimed fixed.
- Reproduction source: `.wp04-04a-independent/validation.spec.ts`, `validation.config.ts`, `run.ps1`. `run.ps1` defaults to Chromium and uses the accepted host/teardown with an isolated test directory. These are temporary reviewer probes, not new permanent suite ownership.

No in-memory repository surrogate was used for these browser results.

## Reused author evidence and limits

Directly parsed the saved Playwright reports, not only the handoff summary:

| Report root under `C:/Users/alexb/AppData/Local/Temp/` | Result |
|---|---|
| `learning-is-fun-state-6a039315b2cc4b11a741fac0c4db187f` | 60 expected, zero skipped/unexpected/flaky/errors; 20 cases each Chromium/Edge/WebKit; 79.599 seconds. |
| `learning-is-fun-state-b5ae759a9afe4829a4fcb9babe806cab` | 15 affected rechecks, zero skipped/unexpected/flaky/errors after final retention correction. |
| `learning-is-fun-state-a593f2e8ca4e47d99b76bcd1faf37874` | 3 capacity extensions, one each engine, zero skipped/unexpected/flaky/errors. |

Decoded report attachments in all three engines for anchor, abort/exact retry, 53 closures and reentrant late preference failure. Native save equals acknowledged save in each inspected attachment. Anchor is revision10, 100/40/3, three permanent quest IDs and four judged-Check celebrations; abort/retry is revision4, 40/20, one celebration. At revision110, archive-expiry trace has lifetime1100, one quest receipt, 52 archives, best20 from 5 October and **53 gold medals**. This independently checks the claimed evidence is actual real-IDB state, while reusing the author's tests rather than rerunning all browser scenarios.

The author reports 15 passing unit tests; their source and relevant assertions were inspected and that run is reused, not represented as an independent rerun. The final owned source does **not** have a claimed 63-case full final browser run. Independent Chromium probes complement the credible three-engine author baseline/affected rechecks. Root Node diagnostics outside the owned type boundary are recorded as unrelated integration work, not new package-wide acceptance conditions.

The [accepted multi-binding amendment](MULTI-BINDING-AMENDMENT.md) and its [independent review](MULTI-BINDING-AMENDMENT-VALIDATION.md) remain authoritative. The helper test proves missing/empty false, proper subset false, complete multi-ID true and JSON preservation using already specified Q9 IDs strictly as helper inputs. Actual M1 singleton persistence is separately evidenced above. Integrated partial multi-required full-save/compaction/reload/backup proof remains **WP04-07A after the M1 gate**, using real WP03-13A content. No invalid synthetic M1 registry or completed M2 runtime proof is demanded or claimed.

Selector/guidance and same-week decoder producer corrections retain their separate independent PASS reports. Their pending coherent commit is Controller's responsibility; this validation neither reopens those audits nor claims package completion. Final consumer integration, published PC/tablet acceptance, acoustic/listening verification and M2 remain outside this bounded facade review.

Reviewed source SHA-256 (before corrections):

- `src/state/controller.ts`: `f9ec1bb1749ebe963718104db47a8ab5f74cfb07fc5db7a54b87f452acfceb19`
- `src/state/transition.ts`: `2eb5f6d0e78eb20e63905f4dd6a58737f2ae13a4b9a01b94d80a6a71132c047e`
- `tests/browser/local-save.spec.ts`: `a6be9458d02fafb246114732dafda224e693c1bf1968676eb83b46a1da33732e`
- `tests/state/transition.test.ts`: `7ded03cdaeb8470c4c56d0b3f805f0a655bfdab352b6e52d24f32899fbde4540`
- `execution/WP04-04A-HANDOFF.md`: `9229191315e32fa480fd3ec6d34f1bd0192da702dd9d1a95d720436ffad29caf`.

During the final report-only verification, `tests/browser/local-save.spec.ts` had changed to `df73286179055efc8fe18777519a6e5b3401f0ca87cbf94b61c81afd4863e1b0`; the other four recorded files still matched. That concurrent correction was not inspected or tested by this completed review. F03 and its retained diagnostics apply to the reviewed source above; no verdict on the newer spec is implied.

Correction acceptance should rerun the exact native-IDB F01/F02 inputs end to end, add focused related variants (especially draft replacement/discard and public import retry/token invalidation), preserve the original failed-Open ID/clock protection, and pass the isolated Node-only owned spec check. Reuse unaffected producer/three-engine evidence proportionately. Controller owns the single eventual acceptance and coherent commit.

## Correction revalidation — 9 October 2026

**Current verdict: CHANGES REQUIRED — F02 and F03 are closed; one directly related F01 recovery case remains open.** This continuation supersedes the initial review's three-open-findings disposition. Both exact original native-IDB failures now pass, as do the supplied relevant variants. A fresh single-intent/consecutive-outage case demonstrates that preference retries can still exhaust the facade and cannot recover after storage becomes writable. This is the same reservation-lifecycle owner, not a new package gate.

Read the appended correction and Hall handoff, final controller, the new structural fixture API, affected browser fixture/spec and regression assertions. Continued the existing investigation without reloading process machinery or reopening the producer audits. The reducer's hash is unchanged. Original independent anchor, provenance, personal-record, raw-recovery and atomicity evidence remains applicable.

### Remaining F01 — P2: consecutive retries of one preference generation consume every reservation

Owner: `src/state/controller.ts:123–129,179–196,201–211,258–263`, in composition with `createPreferenceController` allocating a fresh internal command in `makeBatch()` on each retry. The correction retires reservations after a successful explicit supersession or an acknowledged fully settled helper generation. Neither condition is reached during a persistent storage outage. Consequently every failed retry of the **same single preference choice and same generation** retains another private reservation. Once 128 are retained, the public helper cannot obtain a slot to perform the successful retry that would release them.

Independent original variation `one preference intent remains recoverable after consecutive storage failures`:

1. Begin with committed music volume `.25`, no profiles, epoch `13e4b2db-8c6b-44f8-9e7f-85b5b4e53066`, revision 1.
2. Request music volume `.7` once. Abort the native `put` and flush to its typed preference failure.
3. Call `preferences.retry()` 127 times, each with a real native `put` abort. The attachment verifies **128 actual native aborts**, unchanged native/published state, `generation: 1`, `savedGeneration: 0`, and only one requested music value.
4. Stop injecting failures: storage is writable again. Call the public `preferences.retry()` and `flush()`.
5. Actual: no new native write; `errorCode: 'capacity-exceeded'`, `ready: false`, `pendingCommands: 0`, `pendingPreferences/failedPreferences: true`. Native music volume remains `.25`; live requested value remains `.7`. An unrelated `CreateProfile` also fails with `invalid/capacity-exceeded`.

This is **one unresolved preference generation**, not 128 independently pending educational actions or distinct desired settings. The helper does not expose its old command envelopes, so the existing exception allowing an exact reserved dispatch cannot be used through its public retry action. Keeping the dirty choice while retrying after an outage must remain possible. Reload or explicitly abandoning the desired value is a workaround, not successful recovery of that choice.

Expected correction: keep helper-owned retry work bounded by its unresolved intent and allow its retry when storage recovers, without evicting or changing genuinely reserved educational IDs/clock, discarding unacknowledged partial preference leaves, or allowing silent rebase of educational commands. Keep the now-passing acknowledged-retirement and no-write-settlement cases. The exact native-IDB variation above is the remaining acceptance input; original WP04-04A author retains implementation ownership.

Evidence: `C:/Users/alexb/AppData/Local/Temp/wp04-04a-independent-e31f8f7f8761424fac55ae6e28716963/results.json`, JSON attachment `consecutive-one-preference-outage`, and adjacent retained trace ZIP. The failed assertion is `recovered.ready === true`; all 128-native-abort and prior-root assertions pass first. The temporary probe was added at `.wp04-04a-independent/validation.spec.ts:151`. No production mutation was made in response.

### Closed findings and passing focused checks

**F02 PASS.** A one-use preview is now resolved into the private retained operation, with its original validated save, token and replacement epoch. Both retained-envelope and public-confirm retries use that operation after abort. The repository's token guard and full validation remain intact. Cancel, fresh preview, reset and dispose invalidate the capability; stale token still requires a fresh preview. The decoder/session producer was not weakened.

**F03 PASS.** `state-integration-api.ts` imports only pure types and expresses browser-facing arguments structurally, including file `{size,text}`. The TSX host is explicitly assigned that API, while the Node spec declares only its local structural `window`. No implementation/React/TSX import or shared DOM/JSX configuration change is needed. Fresh independent command exited 0:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2023 --module ESNext --moduleResolution Bundler --lib ES2023 --types node tests/browser/local-save.spec.ts tests/fixtures/state-integration.config.ts tests/fixtures/state-integration-teardown.ts
```

Independent Chromium executions, max1/port5182/private outputs:

| Report | Tests actually run and outcome |
|---|---|
| `wp04-04a-independent-4aa2dbe3c5414b239b5933594d7b8163` | **3 passed**: unchanged reviewer originals for recovered-preference reservation failure and exact replacement retry, plus retained delayed-preference-abort/silence/flush case. |
| `learning-is-fun-state-e9ef02099c0c418f8759d412d909a3bb` | **6 passed**: author regressions independently executed for partial-leaf/same-scope retirement, 130 no-write return-to-saved settlements, SaveDraft and Suspend replacement/discard, public-confirm retry/cancel/stale/reset/dispose, and original failed-Open IDs/clock/unresolved-capacity protection. |
| `wp04-04a-independent-e31f8f7f8761424fac55ae6e28716963` | **1 passed / 1 failed**: fresh queued-confirm cancellation passed; consecutive-outage F01 variation failed as above. No skipped tests or expected-failure relabelling. |

Each report is under `C:/Users/alexb/AppData/Local/Temp/` with `results.json` and its attachments. The queued cancellation case holds a real Rename before repository commit, queues public confirmation, cancels that preview before it reaches the writer, then releases the Rename. It proves the renamed root commits in the same epoch at one higher revision, the queued import returns `prepared-import-expired`, native/published roots agree and readiness becomes true. This independently checks pending capability invalidation in addition to the author's post-abort cancellation case.

The six author-regression executions verify scope-sensitive retirement rather than indiscriminate clearing: a first channel write leaves another unacknowledged channel reservation owned; a different failed Rename remains a readiness blocker through 130 draft discards; a genuinely reserved failed Open keeps its original allocations and clock and can retry at the unresolved limit. The remaining F01 counterexample does not invalidate these passing results.

Directly parsed the author's `learning-is-fun-state-66d4bd156f414533afa0fca16002bb59/results.json` (**45 passed**, 124.131 seconds) and `learning-is-fun-state-1eb783fc1e5940cba22c74eba56c9d26/results.json` (**24 passed**, 63.754 seconds). Both contain Chromium/Edge/WebKit projects, zero skipped/unexpected/flaky results and no report errors. Reused the author's 151 passing state/preference/backup tests and separate DOM-host check. No full 60-case baseline or unperformed 84-case final suite was repeated or claimed.

### Hall handoff and limits

The appended Hall adapter guidance is compatible with the inspected producer APIs: `localDateAt`/`weekKeyFor` derive a separately identified presentation observation; `buildLeaderboardReadModel` receives `competition.latestOpenedWeek` and committed profile records. A later observed week is explicitly stale until successful refresh, an earlier observed week yields the rollback notice, and null active week stays unavailable. It adds no writer, reward computation or DTO. This is a reviewed read-only handoff, **not runtime Hall integration acceptance**; that fixture remains with WP05-04A. Existing M1/M2 evidence allocation and published/acoustic limits remain unchanged.

Hashes verified unchanged at the end of this correction recheck:

- `src/state/controller.ts`: `9c7140a58fc1c3c8dea9f173770f3caa7469f083108b654ddb6bec4575fdcc5e`
- `src/state/transition.ts`: `2eb5f6d0e78eb20e63905f4dd6a58737f2ae13a4b9a01b94d80a6a71132c047e`
- `tests/browser/local-save.spec.ts`: `83cf34b66bef22cdb0e7cbbc760b49209b53c4fc26b05df0655a919e9677fc59`
- `tests/fixtures/state-integration-api.ts`: `a721dd3030b5e36ab7b0ff3309d5978134b310c73667e8e4835772c4876f65f8`
- `tests/fixtures/state-integration.tsx`: `2ed4bb88647af1edb2a23d9538109ae43a97cb8763d4c5b53caeb54d8012db27`
- `execution/WP04-04A-HANDOFF.md`: `2ac2f9ce81820ff9ca2a58b60eb3300235dab50d584f820c4639556343b4a47a`

**Recheck stopped; port5182 released and verified without a listener.** No source, permanent tests, shared configuration/status, Git, delegation or other-chat message changes. Only this report and temporary independent probes were edited. Original source-inspection and browser work is finished for the remaining F01 correction handoff; Controller retains the single acceptance/commit decision.

## Final F01 closure — 9 October 2026

**Final verdict: PASS. No remaining actionable finding within this reviewed WP04-04A implementation boundary.** F01's consecutive-outage variation is now closed. F02/F03 closures and all unaffected passing evidence above are preserved. Historical red traces and intermediate verdicts remain recorded; this section supersedes them for the final hashes below. Controller owns administrative acceptance and the coherent commit.

The final causal change follows the actual retry owner. A helper-issued preference envelope now occupies a reservation only while that attempt is pending; completing the attempt releases it even on storage failure. The accepted helper retains requested dirty leaves, failure state and generations and issues a fresh envelope for retry. Public failed envelopes still retain their original contexts, IDs and clock. The public dispatch wrapper forwards only its command argument, so callers cannot supply the private helper-owned marker. Pending attempts still count toward the unchanged 128 limit. No capacity increase, eviction of public failures, premature dirty-leaf acknowledgement, new writer or new queue was added. The previous settled-generation cleanup was removed as unnecessary.

Read the final appended handoff and source delta, including public dispatch exposure, helper enqueue, pending counts and terminal cleanup; inspected the directly material protection/partial-scope regressions. Import lifetime/token logic, the structural fixture API, reducer and Hall handoff are unchanged. No new broad audit or process re-entry was performed.

### Exact original and related native-IDB proof

The retained reviewer probe `one preference intent remains recoverable after consecutive storage failures` was rerun **unchanged** on final source in Chromium. It passed after exactly **128 native aborts** of one music `.7` request at generation1/savedGeneration0. Published/native state remained at music `.25`, epoch `af956b36-dafa-4c08-a498-953c624a4866`, revision1 during the outage. With abort injection removed, public `preferences.retry()` saved `.7`, reported ready with all blockers false, and acknowledged generation1. A subsequent ordinary CreateProfile committed; final native revision3 includes both successful writes and the requested music value.

Report: `C:/Users/alexb/AppData/Local/Temp/wp04-04a-independent-c60b2a89a7cd4d3c92c45f2bcfb738a3/results.json` — **1 passed**, no skipped/failed cases, attachment `consecutive-one-preference-outage`. This directly closes the prior failing acceptance assertion without changing its input or expectation.

Independently executed three directly material author regressions on final source:

- **Pending/public-ID protection at capacity:** 126 failed public preference commands plus one failed educational Open survive 131 failed helper attempts. A held helper write fills the 128th slot and rejects a further public allocation. The original Open remains retryable with its original encounter/opportunity IDs and old-week clock even after the injected clock moves forward. Helper retry subsequently recovers. Native and acknowledged roots agree.
- **Scope change at capacity:** with 127 public reservations retained, return the failed audio request to the already saved value and request profile reduced motion. The helper's changed scope reaches native IDB, can fail honestly, then recovers. Filling the last public reservation and rejecting the next allocation proves public work was not discarded during helper cleanup.
- **Partial leaves and separate profiles:** 131 aborts while reverting one profile leaf, changing another profile and editing audio preserve only the latest requested choices. Final recovery leaves Ada at system motion/read-aloud false, Ben at reduced motion, effects volume `.6`, music `.25`; savedGeneration equals generation6. No stale partial value is reapplied, and native/published roots agree.

Report: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-a7aa3906cd0d4cf596ba6fad32488181/results.json` — **3 passed**, no skipped/failed cases. These are validator-executed author regressions, distinct from the independently authored original probe. All four checks used Chromium, one worker, private cache/output and port5182.

Directly parsed the final author's three-engine report `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-7793079fc43b48418a70d19cb602798d/results.json`: **30 expected passes**, zero skipped/unexpected/flaky/errors, 91.153 seconds, Chromium/Edge/WebKit. It covers exact outage, changed/partial/scope cases, earlier no-write settlement, recovered failures, partial public-leaf acknowledgements, failed Open, delayed silence and reentrant flush. Reused the reported **51 focused unit passes** and focused source/host plus Node-only typechecks; those were not rerun by this validator. F03's previously independent Node-only pass and unchanged API remain valid. No full 60-case baseline or unperformed 96-case final suite is claimed.

### Final reviewed hashes and release of the boundary

- `src/state/controller.ts`: `14aab57d98a9a9f96e2c5172c3e7dac37eacd60590b11bc7a3d514ae54a20657`
- `src/state/transition.ts`: `2eb5f6d0e78eb20e63905f4dd6a58737f2ae13a4b9a01b94d80a6a71132c047e`
- `tests/browser/local-save.spec.ts`: `7e63299f0f8fbb27364db03ab6d70875cc089a5aae56da671d9fe42d607381bb`
- `tests/fixtures/state-integration-api.ts`: `a721dd3030b5e36ab7b0ff3309d5978134b310c73667e8e4835772c4876f65f8`
- `tests/fixtures/state-integration.tsx`: `2ed4bb88647af1edb2a23d9538109ae43a97cb8763d4c5b53caeb54d8012db27`
- `execution/WP04-04A-HANDOFF.md`: `4a1d9ae5e8ef8309ad2e8251f7dae516634e80ab257ed2e4300de859601debb3`

No further technical finding prevents Controller from accepting this facade input for the downstream audio/adult/Hall bindings. Their real integration and acceptance remain with their assigned owners. The accepted M1 helper-versus-singleton evidence split, outstanding M2 multibeat obligation, published PC/tablet checks and acoustic/listening limits are unchanged. The whole package is not declared complete.

**Validation work stopped; port5182 released.** Only this report was changed in this final continuation; the original temporary probe was reused. No production/permanent-test/shared-configuration/status/Git/delegation/message action occurred. Final hashes and absence of a listener were checked after the browser runs.
