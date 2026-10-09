# WP04-06A — Profile and adult UI correction/binding handoff

9 October 2026. **F01–F03 corrected and supported-engine actual-facade checks
passed; ready for the original validator's narrow independent recheck.**
Controller released DEP-048 against accepted facade
`97482c4b791a84c55384c623163664c7d1fdddbc`. The real UI binding now uses that
producer. D1 Chrome/D3 Firefox and final administrative acceptance remain open;
this is not a completed browser matrix, M1 release or published-link claim.

Implemented under the current GLOBAL_RULES execution authority and explicit
sole-author assignment. CON-003 permits this isolated construction. Controller
owns integration, administrative acceptance, shared package documents and Git.
The ordinary writer was used. No other-chat message/delegation, producer-state
edit, dependency/config/global-theme change or broad package test was performed.

## Owned files

- `src/profiles/ProfileChooser.tsx`, `ProfileChooser.css`.
- `src/adult/AdultArea.tsx`, `ProgressView.tsx`, `BackupPanel.tsx`, `adult.css`.
- `src/adult/adultProfilesPorts.ts`: narrow erased panel-port aliases, no store,
  validator, playback or queue.
- `tests/browser/adult-profiles.spec.ts`.
- `tests/fixtures/adult-profiles.html`, `.tsx`, `-api.ts`, `.config.ts`,
  `.vite.config.ts`, `-run.ps1`, `-teardown.ts`.
- This handoff only under `docs/work-package/execution`.

## Exported interfaces and composition

`ProfileChooser({ snapshot, selectedProfileId, dispatch, onSelectProfile })`
consumes the producer's `CommittedSnapshot`. `dispatch` is the minimal object
`Pick<ComposedStateController, 'prepareCommand' | 'dispatch'>`: facade-owned
allocation followed by the existing exact `StateCommand` writer. Shell adapters
can pass that controller directly. The returned immutable envelope is retained
for failed-save retries. Existing-profile IDs are captured before awaiting.

`onSelectProfile` is a shell-owned guarded request. The chooser never publishes
an optimistic selection, persists an active profile, or retargets a pending
command. The fixture records requests separately from its explicitly published
`selectedProfileId`. The actual shell's suspension/discard registration and
guarded adventure switch remain WP01-02A/WP02 responsibilities; frozen UI checks
do not prove those downstream behaviors.

`AdultArea({ snapshot, selectedProfileId, preferenceController, dispatch,
backupActions, onExit })` begins with the “For grown-ups” control, then a focused
explanation, then a separate Continue action. The text explicitly describes an
accidental-entry barrier. Exit closes it. The selected shell identity initializes
the viewed profile on each entry; the adult viewing selector does not switch the
adventure. Missing/deleted identity remains missing until an explicit choice.
Optional `summaries` and `todayDate` are view-only producer-fixture injections.
Normal composition calls `summarizeLearning` over that profile's committed
evidence, delivered `listTasks()` and a London civil date. Expanded catalogue
content remains WP04-07A's obligation.

`ProgressView({ profileIdentity, summaries })` displays the producer's immutable
`LearningSummary[]`, without grading, changing evidence or calculating ability.
It uses SKILLS for display names. Compose it within the `.adult-area` style
scope, as AdultArea does. All-time Hint counts are **not provided by this DTO**:
the UI explicitly labels that absence and displays the exact retained episode
Hint/worked-support/assessed-reading flags and recorded misconception feedback.
No inferred lifetime hint count is substituted.

`BackupPanel({ backupActions, saveStatus, onBusyChange? })` consumes the exact
facade prepare/cancel/confirm/export functions. `BackupActions` only adds the
optional facade `exportRawRecoveryData` callback. `PanelSaveStatus` has
`token: SaveToken | null`, `profileNames`, `pending`, `failed`. Standalone
unreadable/unsupported composition uses a null token and the raw-recovery callback
within `.adult-area`. AdultArea forwards backup busy state to prevent exit during
an in-flight operation. Prepare results that arrive after unmount are cancelled;
an outstanding preview is also cancelled on unmount. Changing a wrapper object's
identity does not silently cancel the preview.

`downloadBackupFile(json, filename)` is the same module's browser-download helper;
AdultArea uses it for the usable backup offer inside destructive dialogs.
Download messages say “download requested”, not that a file has been saved to disk.

The adapter subscribes to the shared committed-state port. The fixture demonstrates
`useSyncExternalStore` and idempotent host unmount; AdultArea directly subscribes
to the accepted preference helper and React unsubscribes on unmount. Read-aloud
and reduced-motion changes call only `setProfilePreferences`/`retry`. Immediate
music/effects/Stop/Silence controls remain the external audio/shell owners' work.

## Behaviors constructed

Four distinguishable ready avatar crops use exactly AVATARS and `assetUrl`:
Pip, Rowan, Iona, Nessa, with coral flower and apple also selectable. Unknown
future portraits preserve the nickname and display a neutral fallback. No art
or asset-register changes. Local system typography and the WP02 paper/ink/teal/
plum palette are scoped to these panels.

Nickname editing trims and checks 1–24 characters, and remains separate from
avatar changes and awards. The sixteenth profile disables creation with a visible
capacity explanation. Selection requests can be made while a captured rename is
pending; the old envelope stays attributed to its original profile. Invalid,
conflicting and failed-save results never produce saved success. Failed creation
retries retain the facade's original new-profile and action identities.

Deletion, StartOver and app reset have separate native modal confirmations,
named affected profiles, export offers, exact preview tokens and deliberate
confirm buttons. A stale token disables confirmation. Updating a preview rebuilds
the command against current profiles and displays their current names before
another confirmation. StartOver explicitly removes the old identity and awards
and requests a new empty identity with the same nickname/picture. The panel does
not implement these transitions or claim their persistence from fixture results.

Backup input checks `File.size` against 16 MiB before calling prepare; the real
decoder retains its own pre-read check. Only prepare returns a usable preview.
Import is explicitly whole-save replacement, with current affected profile names,
backup names/count/export date, cancellation and a separate confirm. Stale,
expired/invalid and non-retryable failures require a new preview. Retryable failure
retains the same prepared ID for the facade's exact retry. Last-committed recovery
is explicitly a compatible backup that omits unsaved changes; raw `.recovery.json`
is explicitly unsupported for import and is rejected before prepare.

Native dialog focus enters on Cancel, traps by the browser, and returns to the
opener/file control or heading when the original target disappeared. Escape
cancels only while idle. Essential text remains visible, controls have at least
44px targets and 18px button/body typography, long content wraps and scrolls,
and reduced motion follows the requested/device setting.

## Retained construction evidence

Focused strict ES2022 DOM/React typecheck over the four panels, port types and
browser fixture: **PASS**. Focused ES2023 **Node-only** typecheck over the owned
spec/API/configs with `--lib ES2023 --types node`: **PASS**. The pure erased
`adult-profiles-api.ts` imports producer data contracts only, never a TSX typeof
or the controller implementation. No DOM library was added to the Node project.

Prior stable-source full owned browser run (reused, not repeated wholesale):

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-90fa7f7ccff348ec93a780c3774cf8bb`

**44 frozen-port checks passed; four actual-facade checks skipped by the explicit
release gate**. Eleven UI cases in each of Edge D2 1920×1080, Chromium supporting
desktop 1366×768, Chromium T1 touch emulation 1024×768 and WebKit T2 touch emulation
768×1024. Keyboard/touch entry, four portraits, immutable rename/create retries,
avatar commands, capacity, focus, producer summary counts, missing data,
preferences/retry, stale/destructive failure, exact prepare/cancel IDs, import
failure, raw recovery, pre-prepare size rejection and adult reflow were exercised.

The final two expanded test cases (usable backup offer before destruction, and
chooser/editor plus adult 200% text checks) passed **8/8** across those projects:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-d42cec5c2bfe42389a5994fa0ba3664f`

This includes portrait/landscape rotation and 683px-wide 200% text reflow with no
horizontal overflow, and target measurements. It is browser emulation, not a
physical tablet or child observation. Both roots contain results.json, labelled
captures and per-test attachment folders. Relevant captures: `four-profiles`,
`new-profile-form`, `adult-entry`, `delete-confirmation`, `truthful-progress`,
`preference-failure`, `destructive-failure`, `backup-failure`, `raw-recovery`,
`chooser-text-200-percent`, `text-200-percent`. Rendered desktop chooser,
touch progress and WebKit confirmation captures were visually inspected.

The factual summary fixture feeds the actual WP03 `applyLearningObservation`
and `summarizeLearning` functions: wrong → Hint → later success; a distinct
similar task; then a familiar delayed independent review. Expected M01 counts
are Checks **4**, completed episodes **3**, independent first successes **2**,
supported/later successes **1**, later-Check successes **1**, later distinct
successes **1**. Latest review is independent-success, **2026-10-12**, familiar.
The earlier episodes are dated **2026-10-06**. M04/E06 have explicit missing
evidence; recent wrong feedback remains attributed. No percentage is rendered.

Earlier exploratory evidence is retained, not accepted as final evidence:
`421565...` found the selector label defect (corrected to a separate native label).
`64182da...` passed the earlier 36 UI checks. `f96137...` had one WebKit dialog
failure during an author edit/HMR; the stable rerun above supersedes it. No
production behavior was changed to compensate for that infrastructure event.

## Execution boundary and remaining work

Runner: `tests/fixtures/adult-profiles-run.ps1`, optionally `-Project` or `-Filter`.
It uses bundled Node, a fresh private ADULT_VERIFY_ROOT, private Vite/output/cache,
port **5186**, strict port ownership and **one worker**. Teardown stopped the
fixture; a final Get-NetTCPConnection probe returned no port5186 listener.
Facade5182/audio5184/Hall5185 were not touched.

Actual mode retains its default release lock; authorized execution used
`ADULT_REAL_RELEASE=yes`, forwarded to Vite as `VITE_ADULT_REAL_RELEASE=yes`.
See the actual-binding results below. No alternate persistence was introduced.

Chrome D1 and Firefox D3 remain required unavailable host checks as recorded in
WP01/browser-discovery handoffs. Chromium's matching viewport is supporting
evidence, not D1 Chrome substitution; Edge and WebKit are attributed by name.
The proposed Edge-primary change is still pending; no substitution or matrix
amendment is claimed. No install or security workaround was attempted. Final shell registration,
published P4-H/PC-tablet paths, physical observations, WP04-07A/M2 and acoustic
claims remain downstream. No publication, release acceptance or real saved
success/deletion/import is inferred from finite frozen-port acknowledgements.

## Independent-review corrections and original reruns

Read the exact [independent report](WP04-06A-VALIDATION.md). The original owner
tests reproduced all three findings on the unchanged causal surfaces:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-486aeac18be7481098611f7b88279d18`

Three expected failures: disconnected edit opener lost focus; removed destructive
target's explanation was overwritten; submitted failure cancellation claimed that
no command had been submitted. This is retained reproduction evidence, not a pass.

Narrow production changes:

- **F01:** ProfileChooser restores after the editor has closed and saving is idle.
  It checks opener connectivity/enabled state and falls back to the surviving
  focusable chooser heading. The pending command remains captured to its old ID;
  the missing-profile error is unchanged. Removed **and disabled** opener variants
  now pass, with ordinary connected-opener behavior retained.
- **F02:** the refresh handler reports “Preview updated” only when buildPreview
  returns a real current preview. A removed target closes the dialog, focuses the
  adult heading, retains the missing-profile explanation and dispatches nothing.
- **F03:** each destructive/replacement preview records whether confirmation was
  attempted, entirely in transient UI state. Cancelling an untouched preview has
  scoped never-submitted wording. Closing after a submitted failure/rejection
  preserves its prior typed failure or acknowledgement uncertainty and says that
  no further retry was requested. Button and Escape use the same cancellation
  path; the prepared capability is still cancelled by its exact ID. A backup
  offer attempted after a rejected destructive call also preserves that outcome
  instead of overwriting it with a never-submitted claim. No storage outcome is
  inferred from dismissal, and no state/repository/backup/preference code changed.

The three original corrections plus the four affected existing UI cases passed
**28/28** across Edge D2, Chromium supporting desktop, Chromium T1 and WebKit T2:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-dd4810f40fb9475c91ffd7919c4b490b`

Related final F03 variant and the ordinary destructive backup offer passed
**8/8** on those same projects:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-c8877fccca984a4283ef49591dd2dd6d`

This variant retains rejection uncertainty even when the subsequent backup offer
is blocked. It covers typed save failure → button cancel, unacknowledged dispatch
→ Escape, and unacknowledged import → button cancel. These frozen rejection ports
exercise UI fault semantics only; they do not claim a real facade lost an
acknowledgement. The original 44+8 construction checks remain reused evidence.

## Actual-facade UI binding evidence

Final checkpoint run:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-89caf2db1fe54830ab137d75a8557c9a`

**12/12 passed**: two actual-facade integrated cases plus the expanded F01
removed/disabled opener case in each of the four supported projects. Eight of
these cases are actual-controller/native-IndexedDB evidence; four are frozen
focus variants. Earlier actual main-path passes are also retained at
`learning-is-fun-adult-2601b95cabf5427a90452147096d379c` (4/4), but the final
checkpoint run contains the stronger explicit counts/state checks.

Actual case 1 creates Ada/Ben/Cora/Dev through the real chooser/facade, with four
different ready portraits. Q1 committed evidence in Ada is wrong → answer Hint
→ later success; Ben completes independently. Their lifetime totals differ,
both have their own Q1 restoration, and Cora remains untouched. A facade-prepared
rename is held by the fixture before dispatch while the shell selection request
is recorded separately. Publishing the permitted new selection then releasing
the captured envelope still renames Ada's ID, preserves its awards, and does not
retarget Ben. This proves the real command boundary, not the final shell's
suspension/discard implementation.

The real Star summary displays exact M01 counts **2/1/0/1/1/0** (Checks/completed/
independent/supported/later-Check/later-distinct). Reading and reduced-motion
preferences commit through the accepted helper. Page reload preserves the exact
snapshot. A browser-downloaded valid backup file is decoded/prepared and explicitly
confirmed: its portable save equals the saved state and its epoch changes.
Deleting Star removes its ID while Ben's full saved profile stays equal.
StartOver removes Ben's old ID and creates a fresh identity with zero points/empty
world; Cora's full profile stays equal. Confirmed app reset leaves no profiles.
Producer tests own the broader historical-rank/medal/namespace semantics; these
UI checks assert actual scoped outcomes without creating a second transition.

Actual case 2 proves backup cancellation leaves the native root unchanged; a
real intervening Ben → Benny rename makes the old preview stale; refresh displays
current affected names before proceeding. An injected abort after the actual
repository's native put returns typed save-failed, leaving both acknowledged
snapshot and native root exactly equal to their pre-attempt values. Retry calls
the exact same prepared ID, commits the original portable save, and changes epoch.
Another aborted attempt followed by cancel retains the failure explanation and
leaves native storage unchanged. A held confirmation disables Cancel/Exit and
ignores Escape until release; after real commit, reload retains the exact root.
The native interceptor only aborts this fixture namespace's real transaction; it
never writes an alternative save. Native root reads are readonly.

This new same-file round-trip found a further bounded BackupPanel defect:
successful import had left the file input selection intact, suppressing change
when the same backup was selected again. The success branch now clears that input;
the test asserts the empty value before repeating the same file. Failure evidence
is retained at `learning-is-fun-adult-68532f88978c4534a452614e1af1c1f6` (four
failures at the repeat-selection step). The next run at
`learning-is-fun-adult-e85b7f42e29b4e27b0b4f6656d088e24` passed all runtime
failure/retry/cancel/pending steps, but four tests raced fixture initialization
after final reload. The test now waits for the mounted chooser before reading its
erased API. No production change compensated for that fixture-only race. The
complete corrected case passed 4/4 at
`learning-is-fun-adult-a4fd5f3ecde3408498f0db242dbf9c11` and then passed again in
the final 12-case checkpoint run.

Final reports retain named `actual-profile-checkpoints` and
`actual-backup-checkpoints` application/json attachments containing exact captured
snapshots, replacement epochs, survival assertions and repeated prepared IDs.
Captures include `actual-facade-roundtrip`, `actual-native-abort`,
`actual-retry-and-pending`. The actual native-abort and round-trip renders are
available in the per-project folders; native-abort render was visually inspected.
Frozen/real labels are visible in every fixture capture.

Focused DOM/React and pure ES2023/Node-only typechecks remain **PASS**. The erased
API now exposes only data/command types plus fixture abort/native-read methods;
no TSX/controller implementation or DOM library enters the Node test graph.
Execution is stopped and port5186 is released. Original-validator narrow recheck
and Controller acceptance are the next steps; D1/D3, the pending browser amendment,
final shell, physical/published journeys and M2 remain explicitly unclaimed.
