# WP04-04A implementation handoff

**Remaining F01 author correction complete; source stable for exact independent
recheck. F02/F03 are independently closed; Controller acceptance remains
pending.** The persistent-outage correction passes 30 affected native-IDB browser
checks (10 each Chromium/Edge/WebKit), 51 focused transition/preference unit checks
and the source/spec typechecks. Zero skipped, unexpected or flaky browser results.
Port5182 has no listener and is released. The prior 45/24-case correction runs and
151-test state checkpoint remain historical evidence below; closed imports and
the accepted Hall handoff were not re-audited.

The earlier complete 60-case baseline and its original 15-plus-three retention
rechecks remain recorded separately below. The complete baseline report root is
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-6a039315b2cc4b11a741fac0c4db187f`.

Controller owns independent validation, acceptance and commits. Author edits are
limited to transition/controller and their unique state/browser fixture support.
No dependency installation, shared contract/config changes, delegation, other-chat
messages or Git mutation.

## Producer corrections and accepted package amendment

**Original failure; selector correction now passes the owned integration rerun.** On a clean
profile, solving required Q1 bridge total-12 independently on 9 October, then on
12 October request `{kind:'practice',skillId:'M01',mode:'suggested'}` with
`suppressDueReviewForVisit:false`. The actual `selectNextActivity` due branch
originally selected unseen total-10 as `due-review`, without previous success or
reviewReference. Full-save validation rejected “Review reason/reference mismatch”
without writing. The owner-corrected selector now selects total-12 with actual
provenance; the original complete reducer/scoring/decoder flow and later reward
compaction pass. Skipping review retains the producer's ordinary practice policy.

Ordered checkpoints: original Q1 Check/full-root validation is green; calendar
closure is valid; retained history contains only total-12 success; selector's
due branch creates the mismatched reason/reference; reducer copies it unchanged;
decoder correctly rejects the contradiction required by its accepted contract.
No downstream relabelling, invented review provenance, filtered catalogue or
producer-source patch was applied. The causal owner is `src/learning/select.ts`
(WP03-04A) with any contract implications reviewed by the Controller/decoder owner.
Focused reproduction is the due-review scenario in `tests/state/transition.test.ts`.

**Resolved package inconsistency.** The accepted
`validateBindings` requires the immutable nine M1 rows and singleton story anchors;
`validateSave` resolves against `QUEST_ACTIVITY_BINDINGS` and rejects any extra M1
story binding. Controller accepted the independently reviewed
[MULTI-BINDING-AMENDMENT](MULTI-BINDING-AMENDMENT.md), reflected in WP04-04A/07A.
The owned helper test uses already specified `q9-story-m08-clock` and
`q9-story-m08-sequence` identities and an existing retained task-ID pool solely
as helper input, never as an admitted registry. Missing/empty required set and a
proper subset return false; the complete set returns true; JSON round-trips retain
each outcome. Actual M1 Q1–Q3 full-root commits and source compaction/reload/transfer
are separate real-IDB proofs. No question/binding ID or M1 content was added.
Integrated partial multibeat full-save/compaction/backup proof remains explicitly
WP04-07A's M2 obligation using delivered WP03-13A tasks, not completed M1 evidence.

**Same-week review correction.** The original selector owner independently
reproduced the decoder's strict earlier-week rejection of Monday-success →
Thursday educational-review completion. Backup owner corrected that producing
validator; facade did not relabel or strip review provenance. The owned exact
5 October success → 8 October review now commits zero question/quest award,
retains its real learning completion, and passes real backup replacement/reload.
Producer acceptance remains recorded by Controller; no producer source was edited
by this worker. Coordinated browser holds were honored during both corrections.

## Runtime composition

`src/state/transition.ts` owns synchronous `reduceCommand`, the separate readonly
`recognizeDuplicate`, `createInitialSave`, command validation and retained-task
resolution. `src/state/controller.ts` owns `createStateController` and pure
`selectCommittedActivity`. Constructor inputs match the accepted repository,
catalogue, questBindings, milestone, clock, preferenceGate and transient getter;
optional allocateId is a deterministic fixture port.

The controller additionally exposes `ready`, `getLoadState`, `prepareCommand`,
`preferences`, `backupActions`, `exportRawRecoveryData`, and `dispose`.
`prepareCommand` takes an intent without token/action ID (and without new-profile
or submission ID for those operations), allocates once and returns an immutable
retry envelope. Dispatch still consumes the shared `StateCommand` contract.
`getSnapshot` throws while no compatible acknowledged snapshot exists; callers
inspect `getLoadState` and await `ready`, rather than manufacture empty data.
The single preference helper enqueues into the facade queue. No second writer,
store, active-profile field or copied transient draft is introduced.

Each dispatch clones its profile/epoch/episode/payload before awaiting. One clock
and generated encounter/opportunity IDs are retained for exact retry. Repository
epoch guard precedes exact retained submission/episode/response recognition;
revision guard precedes reduction. Recognition never calls the full reducer,
calendar, evaluation, selection or scoring. A changed candidate applies calendar
competition **and personal records**, actual learning observation, WP05 question
and quest rewards, permanent bindings and static world/creative constraints,
then passes the full-root decoder. Repository owns tx.done and token creation;
no aborted candidate is published. Only committed judged Check acknowledgements
drive the fixture's celebration list.

Successful Check emits one combined judged/completed learning event. Finish is
completion-only, guarded by retained episode ordinal/action; resume advances only
an unsuccessful episode while keeping encounter/opportunity/help/Checks. Completed
encounters retain the newest success per canonical task; older completed IDs
expire while permanent bindings, bounded producer evidence and reward ordinal
contributions remain. Unresolved work is retained. Ordinary practice returned
while opening a required route preserves its original provenance. M1 punctuation
narration is not independent-reading assessment and does not become answer help.

One `createImportSession` owns previews. Prepare decodes real file bytes privately;
confirm consumes the decoder's exact validated pairing once into the private
operation, then calls atomic `replaceSave` under the preview token and fresh epoch.
An aborted write retains that candidate/token/epoch for exact dispatch or public
confirm retry. Cancel, a new valid preview, disposal and successful replacement
invalidate the old capability; a stale token never rebases the import. Reset uses
the same replacement port.
Flushed export honors current readiness; explicit last-committed export is labelled
recovery. Separate raw export forwards repository `readRecoveryExport` unchanged,
including unknown fields/version/token, and the fixture downloads `.recovery.json`
with the explicit “not a compatible save backup” label. No raw-to-v1 conversion.

Projection copies the approved matching task/revision, draft, actual last judged
Check and episode/submission attribution, authorized assistance IDs and retained
reward facts. It never evaluates/selects/scores/writes; unavailable content is a
read-only result. Snapshot references stay stable until acknowledged change.

## Verification commands and exact evidence

Bundled Node 24.19.0:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
No dependencies were installed and no shared config or compiler cache was written.

1. `node node_modules/vitest/vitest.mjs run tests/state/transition.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`
   — **15 passed**, no skipped/failed cases. Covers actual producer integration,
   duplicates, invalid/incomplete input, episode semantics, practice provenance,
   required-set helper, compaction, same-week/later-week review, rollback,
   projection, commands/choices and destructive profile semantics.
2. `./tests/fixtures/state-integration-run.ps1`
   — **60 passed**, no unexpected/flaky/skipped, started 9 October 2026
   03:38:49 BST, duration 79.599s. Report root is above; `results.json` embeds
   base64 JSON attachments containing exact commands, tokens, native roots,
   snapshot/evidence/receipts/world states and browser versions.
3. After the final retained-ID fix:
   `./tests/fixtures/state-integration-run.ps1 -Filter 'failed Open retains|abort after candidate|four profiles capture|two real tabs|successful replacement'`
   — **15 passed**, 20.5s, report root
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-b5ae759a9afe4829a4fcb9babe806cab`.
   The added unresolved-capacity/retry extension then passed all three engines:
   `-Filter 'failed Open retains'`, root
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-a593f2e8ca4e47d99b76bcd1faf37874`.
   The file contained 21 browser cases at that checkpoint. This distinguishes the
   complete 20-case baseline from those affected rechecks, rather than
   claiming an unperformed 63-case final full run.
4. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --jsx react-jsx --types node src/state/controller.ts tests/state/transition.test.ts tests/browser/local-save.spec.ts tests/fixtures/state-integration.tsx src/vite-env.d.ts`
   — passed after final edits. Owned-path whitespace checks pass; production
   source/public/index contains no fixture import. Foundation's sole release
   input remains index.html; fixture entry is outside public. No root release
   build or publication is claimed.

| Actual browser | Complete baseline | Final affected recheck | Capacity extension |
|---|---:|---:|---:|
| Playwright Chromium 156.0.8078.4 | 20 pass | 5 pass | 1 pass |
| Installed Edge 154.0.4258.62 | 20 pass | 5 pass | 1 pass |
| Playwright WebKit 27.2 | 20 pass | 5 pass | 1 pass |

Expected and observed in all three engines:

| Case | Independent expected outcome | Observed |
|---|---|---|
| Q1 bridge total-12, answer Hint, `[6,6]` | +30 lifetime / +10 competitive | exact |
| Q2 spellbook-anchor, `question:'?',discovery:'!'`, first Check | +40 / +20 | exact |
| Q3 merchant mult-2.pears-3, apples3/pears6 then apples6/pears3 | +5/+5, then +25/+5 | exact |
| Combined anchor and reload | lifetime100, weekly40, slots3, quest receipts3, Q1–Q3 permanent IDs, scarf-leaf/planter-rim | exact; final revision10; duplicate adds nothing |
| Abort after put, then identical retry | candidate revision4 abort leaves committed revision3; retry alone reaches4, 40/20 Q1 result | exact; no prior celebration; one after retry |
| Wrong before Monday, finish/reload/resume, later success | same encounter/opportunity, cumulative Check2/episode2; +25 lifetime/+0 current week; one archive5/best5/gold1 | exact, revision7→8, lifetime30/current map empty |
| Source compaction/reload then fresh transfer | old source expires; total-10 `[6,4]` earns20/20, no extra required ID/quest receipt | exact, lifetime60 and only Q1 permanent completion |
| 53 closures and review compaction | 52 archives but 53 gold medals; old best week retained; 54 allocated opportunities, completion mark53, closed award1060 | exact; lifetime1100, one quest receipt, one retained encounter, revision110 |
| Monday success → Thursday educational review | zero award; actual review completion remains; full backup replace/reload equivalent | exact; lifetime40/current20; new epoch, revision0 after import |
| Failed Check replaced by deliberately edited Check | only that failed sequence clears; unrelated failed field stays blocked | exact; separate rename/SetAvatar counterexample included |
| Failed Open followed by 130 completed no-op actions | retry keeps original allocated IDs and captured old-week clock | exact after repair; unresolved128 capacity rejects new allocation but allows reserved retry |
| Future structural-v7/schema9 root | no compatible snapshot; raw `.recovery.json` preserves stored epoch/revision and unknown fields | exact: stored epoch `future-epoch`, revision37; raw export leaves storage unchanged |

Concrete Chromium epoch samples from the complete report:
anchor `022d8a76-739f-4a2e-8a58-4647b17f172e` revision10;
abort/retry `85b949e5-937c-491a-ba12-76c36d8feb33` revisions3→4;
late success `2b28ccd3-2e23-4f85-bb89-fa4dedbb44f1` revisions7→8;
archive expiry `607f7987-821e-469b-aba0-dad1cbc3d880` revision110;
restored same-week review `4df2cd1f-a0cc-438b-a536-4227ee091d42` revision0.
Other engine tokens/native values remain in their report attachments.

Additional full cases cover immutable facade-generated UUID envelopes, four
captured profiles, response mutation during a delayed write, one clock read per
operation, real two-tab revision/epoch ordering, backup cancellation/conflict,
failed hint recording, typed incomplete response, actual feedback attribution
despite edited draft, free-practice reload with sticky help, retained survivor
rank2/silver after deletion, start-over, unrelated namespace preservation,
current-panel readiness, immediate silence during failed/delayed persistence,
subscriber-generated preference writes and late failure, and invalid-registry
startup before any database write. Unit-only projection variants remove/withhold
the matching revision without evaluation or save mutation.

## Owned corrections and limits

The first Chromium run exposed a real flush defect: failed preference dirty leaves
remain pending even after the queue drains. Treating pending as active work caused
an infinite wait. The facade now returns honest blocked readiness after draining,
without erasing requests/failures. Original failure evidence is in
`learning-is-fun-state-a22965d3a4384e889a5c70dffa33c66e`; the exact failed-flow and
reentrant late-failure variants pass. The same run found a fixture subscription
race, fixed with useSyncExternalStore. Early unit assumptions about starter maths
bands/order were fixture errors and corrected without changing production policy.

The edited-answer test then demonstrated that clearing only identical payload
failures left an impossible-to-retry old Check blocking updates after a new Check
consumed its sequence. `resolvesFailedIntent` now recognizes explicit successful
replacement of the same Check tuple or full field; unrelated failed actions stay
blocked. Failure root `learning-is-fun-state-d3cc39eceebf453f99ca55cc13146a8d` and
green original rerun `learning-is-fun-state-6172abbe2424496fafbf9513f0427aa3` are
retained; the complete suite and final affected recheck also pass.

Finally, 130 completed commands evicted a failed Open from the original volatile
128-entry retry cache, reallocating its IDs and clock on retry. Failure root
`learning-is-fun-state-033b7583ca50476ab40f079e0078298e` records original encounter
`513e8532-6a15-4b49-aad7-d46b45aaf629` becoming
`0c4b7bda-782c-4246-815c-982b1301c28d`. The causal fix releases terminal contexts,
retains pending/save-failed reservations, rejects excess unresolved capacity with
a typed reason, and always admits an existing reserved retry. No durable action
journal or dropped pending identity was added. Three-engine original, related
abort/profile/epoch/replacement and capacity/recovery variants now pass.

## Independent-review correction handoff (F01–F03)

The completed [independent report](WP04-04A-VALIDATION.md) required three bounded
author corrections. Both native-IDB originals were reproduced before changing
the facade: preference retry stopped after 127 recovered failures, and aborted
replacement's exact retry returned `prepared-import-expired`. Author failure root:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-5f6cd4d578814d95a36633c8c656bcfc`.

- **F01, reservation lifecycle:** only acknowledged supersession releases a
  failed public preference reservation. Cleanup tracks remaining audio/profile patch
  leaves within the same epoch/profile/scope; a successful different field does
  not erase an unsaved leaf. The current continuation below distinguishes private
  helper attempts: their reservation ends when the attempt finishes, including
  failure, while the helper retains all dirty choices and retry/readiness state.
  Failed SaveDraft/Suspend reservations retire on a
  successful replacement of their draft/suspension or an observed clean current
  panel registration. The facade never changes that registration. Pending work,
  unrelated durable failures and genuine failed educational allocations remain
  owned. The 128 unresolved limit and original failed-Open IDs/clock are retained.
- **F02, replacement ownership:** the one-use decoder/session capability is
  resolved exactly once into the retained private operation. Both an immutable
  ReplaceSave envelope and `backupActions.confirm(id)` retry with the same
  confirmed payload, expected token, clock and fresh replacement epoch. No save
  payload is accepted from a command, no decoder/session check was relaxed, and
  no second store or automatic rebase was added. Cancel removes the old import
  blocker and capability, while stale confirmation still conflicts and requires
  a fresh validated preview. New preview/reset/dispose invalidate old sessions.
- **F03, compiler boundary:** `state-integration-api.ts` supplies only erased,
  structural types based on pure DTOs. The browser host is checked against that
  API; the spec uses a module-local window declaration. Native-IDB sentinel work
  moved into the browser fixture. The spec imports no TSX/React/controller/
  repository implementation, and no DOM/JSX/shared config setting was added to
  the Node compiler.

The repaired original cases first passed in Chromium under
`learning-is-fun-state-2f06e5bcfbb24335888ca02bca26b413`. The expanded six-case
original/related set then passed under
`learning-is-fun-state-a81e18001cf44b2aaf916a4b36bfb43d`:
130 audio fail/retry/flush cycles followed by ordinary CreateProfile; partial
two-channel acknowledgement and 130 profile preference recovery cycles; 130
replacement plus 130 discard cycles for each draft command while an independent
Rename failure remains blocked; exact private replacement retry/native rollback;
public confirm retry, forged new action, cancellation, stale token, fresh preview,
reset, disposal and invalid file. Each original input traverses the real facade,
accepted helpers, native IndexedDB transaction, acknowledgement and readiness.

The intermediate expanded run
`learning-is-fun-state-093069d0cddc444da06ed6a5b821d52c` exposed test-oracle errors:
an unchanged draft produces no put to abort, and reload after an empty reset
normally opens the current week. Corrected inputs always change the draft;
reload now asserts the same reset epoch and legitimate one-revision calendar
initialization. No production behavior was changed to satisfy those oracles.

A fresh no-write recovery variant reproduced another F01 path under
`learning-is-fun-state-3a1c26f76b87403498ee3595fdeac0b9`: the helper reported ready
after reverting each failed edit to its saved value, but new ordinary commands
eventually hit stale reservation capacity. That checkpoint used settled-helper
generation cleanup; the continuation below replaces it with terminal private
attempt release, which also covers repeated failure before settlement. The test
requires 130 actual native aborts, no extra committed write/token change during
reversion, ready status and a successful subsequent CreateProfile.

Correction verification uses private port5182/max1 and the existing three engines:

1. `./tests/fixtures/state-integration-run.ps1 -Filter 'recovered preference failures|aborted backup replacement|preference reservations retire|draft reservations|public backup confirm|failed Open retains|abort after candidate|four profiles capture|suspension failure|flush waits|subscriber-generated|preview cancellation|committed projection|real deletion'`
   — **45 passed**, zero skipped/unexpected/flaky, 124.131s, 9 October 2026
   04:04:03 BST. Root:
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-66d4bd156f414533afa0fca16002bb59`.
   This is the 15 affected cases per engine before the final no-write refinement.
2. After the final no-write helper acknowledgement refinement:
   `./tests/fixtures/state-integration-run.ps1 -Filter 'preference recovery back|recovered preference failures|preference reservations retire|failed Open retains|flush waits|subscriber-generated|public backup confirm|aborted backup replacement'`
   — **24 passed**, zero skipped/unexpected/flaky, 63.754s, 9 October 2026
   04:07:59 BST. Root:
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-1eb783fc1e5940cba22c74eba56c9d26`.
   This reruns both native-IDB originals and the directly affected variants on
   final source. The suite now contains 28 cases; no unperformed 84-case full
   final-source run is claimed.
3. `node node_modules/vitest/vitest.mjs run tests/state/transition.test.ts tests/state/preferences.test.ts tests/state/backup.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`
   — **151 passed across three files**, 1.57s, final source, 9 October 2026
   04:09:24 BST. No skipped or failed tests.
4. The isolated Node boundary command is now:
   `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2023 --module ESNext --moduleResolution Bundler --lib ES2023 --types node tests/browser/local-save.spec.ts tests/fixtures/state-integration.config.ts tests/fixtures/state-integration-teardown.ts`.
   It passes without DOM/JSX or implementation imports. The separate strict
   ES2022/JSX check covers controller/transition tests/browser host against the
   structural API. No root composite/project acceptance is implied.

Previous correction checkpoint SHA-256 for `src/state/controller.ts`:
`9c7140a58fc1c3c8dea9f173770f3caa7469f083108b654ddb6bec4575fdcc5e`.
No production/test edits followed that 24-case run before the independent
recheck. Its remaining F01 continuation is recorded below.

No producer source was changed for F01–F03. Original independently passing
100/40/3 anchor, atomicity, singleton provenance, archive and delayed-silence
evidence remains valid; affected acknowledgement, projection/backup, delayed
flush, capacity and namespace cases were rerun above rather than auditing the
whole package again.

## F01 continuation: persistent storage outage

The independent continuation closed F02 and F03 and accepted the Hall handoff.
Those results are preserved. It exposed a remaining F01 variant: a single
preference generation, 128 consecutive native aborts, then writable storage.
Earlier cleanup depended on success/settlement, so the helper's inaccessible
failed envelopes filled capacity and prevented recovery. The exact author
reproduction failed before correction under
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-b17d7b6c847f471f85b7fa896a717baf`.
All 128 native-abort, generation1 and unchanged-root assertions passed; the
subsequent public retry remained blocked by capacity.

The final causal fix is smaller than retaining per-scope helper attempts:

- A public failed command keeps its original retry context, IDs and clock.
- A helper command owns a reservation only while its attempt is pending. When
  that attempt completes, including a native failure, the facade releases that
  private reservation. The accepted helper already retains current dirty leaves,
  generations, failure/readiness and retry ownership, and always sends a fresh
  envelope; its completed envelope is never exposed for exact retry.
- The public dispatch adapter forwards only the public command argument. The
  helper-owned marker belongs to the private enqueue path. Public preference
  commands cannot acquire private-attempt cleanup semantics.
- No capacity increase, eviction, dirty-leaf clearing, success fabrication,
  educational rebase or new queue/store was introduced. In-flight reservations
  still count at the unchanged 128 limit. Obsolete settled-generation cleanup
  was removed because completed helper attempts no longer retain reservations.

An intermediate same-scope-only attempt passed the exact repeated-failure case
but failed a fresh switch-to-another-scope case at capacity, root
`learning-is-fun-state-ede970f105e14c6598102360c5f35057`. That evidence led to
terminal attempt release at the actual owner boundary, rather than extending a
per-scope cleanup exception. The final five-case Chromium original/variant rerun
passed under `learning-is-fun-state-3afd707c30e146a38feb49c413132237`.

Permanent native-IDB regression oracles now include:

- One generation requests music `.7` once; all 128 puts abort with the original
  root/volume `.25` intact. Once writable, public retry commits `.7` at precisely
  one higher revision and ordinary CreateProfile succeeds.
- 126 public preference reservations plus one failed educational Open coexist
  with 131 failed helper attempts and a held helper write. The held write fills
  the 128th slot and another public command is honestly rejected. Retrying the
  original Open preserves its allocated encounter/opportunity IDs and old-week
  clock despite the fixture clock advancing; helper recovery then succeeds.
- At 127 public reservations, reverting the failed audio choice to its saved
  value and requesting reduced motion can still reach IDB, fail honestly, and
  recover. The public reservations remain owned, proven by filling the last
  public slot and observing the next public action's capacity rejection.
- Partial profile leaves, two profiles and audio edits remain dirty during
  131 aborts. Reverted leaves are not reapplied; the final recovery saves only
  the latest choices, with generation6 acknowledged and native/published roots
  equal. Existing no-write settlement, successful recovery, partial public-leaf
  acknowledgement, delayed silence/reentrant flush and failed-Open guards remain
  in the directly affected recheck.

Only controller.ts, the owned local-save spec and this handoff changed in this
continuation. Closed import/decoder, structural fixture API, Node configuration,
Hall guidance, other producers, Git and status files were not changed.

Final continuation checks (9 October 2026, Europe/London):

1. `./tests/fixtures/state-integration-run.ps1 -Filter 'one preference generation|helper retry supersedes|helper scope change at capacity|outage retries preserve|preference recovery back|recovered preference failures|preference reservations retire|failed Open retains|flush waits|subscriber-generated'`
   — **30 passed**, zero skipped/unexpected/flaky, 91.153s, started 04:22:38 BST.
   Root: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-state-7793079fc43b48418a70d19cb602798d`.
   Exact originals and related variants use real native-IDB abort/acknowledgement,
   including held pending ownership, capacity and unchanged/native-root evidence.
   The spec now contains 32 cases; no unperformed full 96-case run is claimed.
2. `node node_modules/vitest/vitest.mjs run tests/state/transition.test.ts tests/state/preferences.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`
   — **51 passed**, two files, 806ms, 04:22:36 BST.
3. The focused controller/host strict ES2022/JSX check and the spec-only strict
   Node/ES2023 check pass. These verify the edited source/test; F03's independent
   closure and unchanged structural API are preserved.

Final controller SHA-256:
`14aab57d98a9a9f96e2c5172c3e7dac37eacd60590b11bc7a3d514ae54a20657`.
Final local-save spec SHA-256:
`7e63299f0f8fbb27364db03ab6d70875cc089a5aae56da671d9fe42d607381bb`.
Source/spec were stable throughout the 30-case final run; only this handoff was
finalized afterward. Owned whitespace scan is clean; port5182 is released.

## Hall read-only adapter handoff

The Controller-requested WP04/WP01 binding can use the existing ports. No new
facade projection or shared DTO is needed. The host awaits a successful
`controller.refresh()` and uses its acknowledged snapshot. It supplies a
separate presentation observation instant to the adapter; in a deterministic
fixture this is the same injected known instant supplied to the facade clock.
This observation is not an additional clock read inside the durable operation.

Using accepted `localDateAt` and `weekKeyFor` from `src/rewards/calendar.ts`:

```ts
const observedLocalDate = localDateAt(observedEpochMs);
const observedWeek = weekKeyFor(observedLocalDate);
const activeWeek = snapshot.save.competition.latestOpenedWeek;
// If activeWeek is null, keep loading/unavailable. Do not invent a saved week.
// If observedWeek > activeWeek, retain the prior model with stale status:
// presentation observed a later week than the acknowledged refresh.
if (activeWeek !== null && observedWeek <= activeWeek) {
  const model = buildLeaderboardReadModel({
    competition: snapshot.save.competition,
    profiles: Object.values(snapshot.save.profiles).map(profile => ({
      ...profile.identity,
      lifetimePoints: profile.rewards.lifetimePoints,
      personalRecords: profile.personalRecords,
    })),
    context: { observedLocalDate, activeWeek, clockRollback: observedWeek < activeWeek },
  });
  // Pass model/status to the existing controlled Hall/history components.
}
```

The adapter owns loading/refreshing/failed/stale status and retains the last
acknowledged model while refresh fails/conflicts or presentation is stale. An
explicit subsequent refresh still goes through the sole facade writer. Scores,
slots, archives and records come only from the snapshot; the accepted selector
owns rank/display mapping. Neither Hall components nor the adapter reconcile,
award or compute rewards. A later presentation observation is labelled as such,
not claimed to be the historical clock used by an earlier commit. The requested
real-facade Hall closure/idempotence fixture remains with WP05-04A after DEP-053
release; this handoff does not claim its acceptance.

Owned files: src/state/{transition,controller}.ts; tests/state/transition.test.ts;
tests/browser/local-save.spec.ts; tests/fixtures/state-integration.{html,tsx},
state-integration-api.ts, state-integration.config.ts, state-integration.vite.config.ts,
state-integration-teardown.ts, state-integration-run.ps1; this handoff. Unrelated
producer corrections, playtest evidence and debug.log are preserved. No Git
mutation, dependency installation, shared config/ledger edit or other-chat message.

All checks use private port5182, private temporary Vite cache/reports/output and
max1 worker. The command host mounts through accepted mountPanel and unsubscribes/
disposes on teardown. No Toolkit transaction was needed; ordinary writes worked.
Standard build/diagnostic reasoning was stage-scoped; assigned coupled work stayed
serial under the explicit no-delegation boundary. No remaining owned failure is
known. Controller owns independent validation, acceptance and commits. Final
world/widgets/shell/audio integration, real published PC/tablet play, acoustic
acceptance and the explicitly carried M2 multibeat proof are not claimed here.
