# WP04-06A — Independent UI validation

9 October 2026. **Final whole-child validation: PASS — ready for Controller
acceptance.** F01–F03 remain closed. Installed branded Chrome D1 evidence closes
the last relevant-view gap; accepted D2/T1/T2 and Linux Firefox D3 evidence is
retained. No actionable finding or required browser-mode gap remains within
WP04-06A's profile/adult/backup boundary.

The final D1 completion review below supersedes earlier outstanding-mode verdicts;
those dated reviews remain as history. Controller retains administrative
acceptance. Final-shell, published/physical, acoustic and M2 obligations retain
their downstream owners; this verdict does not claim M1 release acceptance.

## Initial frozen review — historical

9 October 2026. **Three actionable UI findings; frozen construction is not yet
technically ready.** Original author retains correction ownership; Controller
owns integration and acceptance. This review changed only this report and
private temporary probes. No production/permanent-test/shared configuration,
dependency, Git, package-status, delegation or other-chat message action occurred.

The review initially ran under the explicit actual-facade release gate. Controller
subsequently reported the facade accepted at **97482c4b** and acknowledged these
three findings. That prerequisite acceptance permits the owner's next binding
stage; it does not turn this review's frozen acknowledgements into real-facade
UI acceptance. No real-mode browser case was executed here.

## Reviewed boundary and reused evidence

Read WP04-06A and its construction handoff, all owned profile/adult components,
styles, erased panel ports, fixture/API/config/runner/spec, and the directly
material state-command, backup, preference-helper and learning-summary contracts.
Checked the facade's command allocation and preview/cancel/confirm/export
handoff without modifying or independently re-auditing that producer.

Directly parsed both retained author reports:

| Private report root below `C:/Users/alexb/AppData/Local/Temp/` | Recorded result | Attribution |
|---|---|---|
| `learning-is-fun-adult-90fa7f7ccff348ec93a780c3774cf8bb` | 44 expected passes, 4 skipped, zero unexpected/flaky/errors | Eleven frozen UI cases across Edge D2, Chromium supporting desktop, Chromium T1 touch emulation, WebKit T2 touch emulation; four actual-mode cases explicitly skipped |
| `learning-is-fun-adult-d42cec5c2bfe42389a5994fa0ba3664f` | 8 expected passes, zero skipped/unexpected/flaky/errors | Expanded destructive-backup offer and chooser/adult text/reflow cases across the same four projects |

Reused these runs rather than repeating the whole owned suite. Independently
viewed retained Edge `four-profiles`, WebKit `delete-confirmation`, Chromium T1
`truthful-progress`, and expanded Edge `chooser-text-200-percent` captures. The
portraits distinguish the four explorers, the paper/ink illustration language is
coherent, and the captured panels/editor wrap without obvious clipping. Retained
measurements cover 44px targets, 200% text, and portrait/landscape relevant views.
Styles specify 18px body/button text at the normal 16px root size and at least
48px button height. These are browser/emulation observations, not physical-device
or published-link evidence. F01 below limits the otherwise passing focus evidence.

Inspected six AVATARS/assetUrl mappings and the accepted ready-art handoff. Existing
Pip/Rowan/Iona/Nessa/flower/apple artwork is reused; no assets were authored here.

## Independent narrow checks

Private evidence root:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-validator-bdecc3cd31fe46499a78d178361e5c44`

`probe.mjs` mounts the original components and exercises frozen fixture ports or
explicit private result branches. The final `probe-results.json` records **11
sequences: 6 passing, 5 failed assertions grouped into the 3 findings below**.
Edge at 1366×768 is supporting desktop evidence here, not D1 or D2 acceptance.
Execution used one browser serially, private Vite/cache/output and port5186,
with `VITE_ADULT_REAL_RELEASE=no`. No alternate repository writer was used.

Passing independent sequences:

- Removing the viewed/selected identity leaves no displayed substitute child.
  Explicitly viewing Ben changes the adult view but retains the shell selection.
- Invalid/expired and non-retryable import outcomes disable confirmation until a
  new preview. Refresh cancels the exact old prepared ID before preparing another.
- Retryable import failure confirms the same prepared ID on retry.
- Preparation resolving after unmount cancels exactly its returned prepared ID.
- Exactly 16 MiB reaches prepare; a `.recovery.json` candidate is rejected before
  another prepare call. The author's 16 MiB + 1 rejection remains valid.

The original pending-rename counterexample additionally passes its captured `a`
profile ID, truthful missing-profile failure and absence of a saved banner; its
failed assertion is specifically the subsequent focus restoration (F01).
The disappeared destructive-target counterexample additionally passes stale
disablement, no dispatch, dialog closure and heading focus; its failed assertion
is specifically the overwritten explanation (F02).

The initial private run had a probe-only optimized-React namespace mistake and
an over-specific missing-target wait. `probe-attempt1.json` preserves that result;
it is not production-failure evidence for those setup errors. The corrected
probe imports React's default export and observes the actual status element.
`probe-attempt2.json` retains the earlier ten-sequence result; adding the directly
related adult unacknowledged-cancel branch produced the final eleven-sequence
report. No production behavior or acceptance expectation was weakened.

Fresh strict Node-only typecheck **PASS**:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2023 --module ESNext --moduleResolution bundler --lib ES2023 --types node tests/browser/adult-profiles.spec.ts tests/fixtures/adult-profiles-api.ts tests/fixtures/adult-profiles.config.ts tests/fixtures/adult-profiles.vite.config.ts tests/fixtures/adult-profiles-teardown.ts
```

Bundled Node 24.19.0 was used. `--listFilesOnly` confirms **zero `lib.dom` files and
zero TSX imports** in the 251-file graph. A private ES2023/Node emit of the API
produces only `export {};`: all contract imports erase. No DOM library, JSX
configuration or implementation import was added to this Node boundary. The first
invocation omitted `--ignoreConfig` and stopped at TS5112 before checking source;
that tooling invocation error was corrected in the command above.

## Actionable findings for original author

### F01 — P2: restore chooser focus when the edit opener disappears

Causal surface:
[ProfileChooser.tsx:31](<C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/profiles/ProfileChooser.tsx:31>)
and its `close()` at line36. Both restoration paths focus the retained opener
without testing whether it is still connected or falling back to the existing
focusable chooser heading.

Original sequence, using the existing frozen fixture:

1. Open **Rename Ada**, enter `Star`, call `hold()` and `outcome('invalid')`, then
   **Save explorer**.
2. While it is pending, call `scenario('deleted')`, `select('b')`, then `release()`.
   The captured command correctly remains attributed to `a` and reports
   `Not saved. The captured profile is missing.`
3. Choose **Cancel edit**. Ada's original Rename button has disappeared; closing
   the editor removes its focused Cancel button. Observed `document.activeElement`
   is **BODY**, with no predictable surviving chooser focus target.

Expected: after closing an editor whose opener was removed/disabled, focus a
surviving chooser control or the existing `Who’s exploring today?` heading.
Keep the captured command and missing-profile failure intact. Recheck both this
original sequence and ordinary connected-opener cancellation. Evidence:
`counterexample-2.png` and the corresponding final JSON assertion.

### F02 — P3: preserve the missing-target explanation when refreshing a preview

Causal surface:
[AdultArea.tsx:121](<C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/adult/AdultArea.tsx:121>).
`buildPreview()` at line48 correctly sets a missing-profile error and returns
null. The refresh handler then unconditionally overwrites that error with
`Preview updated. Review the affected profiles before confirming.`

Original sequence:

1. Enter the adult area and open **Delete Ada**.
2. Call `scenario('deleted')`; the old confirmation correctly becomes stale and
   disabled.
3. Choose **Update affected-profile preview**. No replacement preview can be
   built, so the dialog closes and focus correctly reaches the adult heading.
   Zero destructive commands were submitted. The status nevertheless says
   `Preview updated...`, and the useful `That profile is no longer available...`
   explanation is lost.

Expected: publish the updated-preview message only when a real current preview
exists; otherwise preserve the missing-profile explanation and require explicit
selection of an existing profile. Do not retarget the removed identity. Evidence:
`counterexample-3.png` and the final JSON assertion.

### F03 — P2: cancellation must retain a prior submitted/unacknowledged outcome

Causal surfaces:
[BackupPanel.tsx:32](<C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/adult/BackupPanel.tsx:32>)
and
[AdultArea.tsx:111](<C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/adult/AdultArea.tsx:111>)
(the equivalent button cancellation is at line118). Cancellation always uses
pre-submission wording even after confirmation has already been attempted.

Original private BackupPanel fault sequence:

1. Prepare a valid preview through the private frozen port.
2. Confirm; the port rejects. The panel correctly reports
   `Replacement was not acknowledged... no success is claimed.`
3. Choose **Cancel replacement**. The same panel now states
   `Replacement cancelled. No backup was imported.` Cancellation did not establish
   a persisted outcome, so this is an unsupported certainty after an explicitly
   unacknowledged result.

Directly related adult sequences:

- Existing frozen fixture: **Delete Ada → Confirm → save-failed → Cancel** records
  one dispatched command, then states `No destructive change was submitted.`
- Private rejecting dispatch: **Delete Ada → Confirm → unacknowledged → Escape**
  also records one attempted command, then replaces the uncertainty with the same
  never-submitted claim.

Expected: distinguish cancelling an untouched preview from abandoning further
retry after a submitted attempt. Preserve acknowledgement uncertainty until the
committed state is known; do not assert that no import occurred merely because
the dialog was dismissed. A neutral cancelled-preview/retry message can avoid
inventing a storage outcome. Retain exact retry identities and cancellation of
the prepared capability.

This is original-component UI fault-path evidence, **not** evidence that a real
facade import committed, lost its acknowledgement, or threw. Typed real-facade
integration remains a separate check. Evidence: `counterexample-4.png`,
`counterexample-8.png`, `counterexample-9.png` and their final JSON assertions.

## Preserved contract conclusions and remaining acceptance

Four/16-profile presentation and capacity explanation, nickname trim/limits,
separate avatar intent, immutable profile/action retry attribution, and the
shell-owned selection request remain sound in the inspected frozen boundary.
The chooser never optimistically publishes a selection. Actual shell guarded
suspension/discard and downstream adventure identity are still consumer-owned.

Adult entry is two separate actions and explicitly an accidental-entry barrier,
without authentication claims. Preferences use the accepted helper's
`setProfilePreferences`/`retry` and requested/committed status, without another
writer or educational command. Progress renders the producer DTO: M01 counts
4/3/2/1/1/1, Hint/later-success feedback, distinct-task evidence and independent
dated familiar review on 2026-10-12; M04/E06 show absent evidence. Recent retained
help flags are labelled, the unavailable all-time Hint count is disclosed, and
suggestions are separated from observations. No ability percentage or durable
learning certainty is invented.

Whole-backup preparation and confirmation are separate; previews name current
and incoming profiles and dates. Stale tokens block confirmation, exact retry
and cancellation IDs are retained, terminal results require fresh preview, and
oversized/raw-recovery candidates are rejected before prepare. Normal flushed
export, explicitly labelled last-committed compatible recovery, and unsupported
raw recovery remain distinct. Destructive scopes, named identities, StartOver's
new-identity explanation and usable backup offers remain intact. No committed
success was observed on a typed failed result or before acknowledgement; F03
specifically concerns the later cancellation wording.

Required next owner work: correct F01–F03, rerun their exact original UI sequences
and focused related paths, then execute the actual-facade UI profile/progress/
preference/reload/backup-replace/scoped-delete/StartOver/reset integration using
the now-accepted incoming facade. Frozen acknowledgements do not prove native
save/score/world separation, import/deletion persistence or complete P4-A/D/G.

D1 Chrome and D3 Firefox remain unavailable required host criteria. The user's
proposed Edge-primary change was still unanswered in this review; no substitute
or requirement amendment is accepted here. Retained Edge/Chromium/WebKit results
keep their actual attribution. Final shell integration, published P4-H PC/tablet
paths, physical observations, M2/WP04-07A and acoustic criteria remain outside
this validation. No broad package suite, browser installation, security change,
publication or release acceptance was performed.

## Reviewed source identity and stopped execution

Observed SHA-256 on the reviewed causal/UI files:

| File | SHA-256 |
|---|---|
| `src/profiles/ProfileChooser.tsx` | `de4988094eb326aefca2e31b2309374bc07d368829a877b756cd10ddac45d034` |
| `src/adult/AdultArea.tsx` | `55cc879d3b89af7963dd97b09de8a97026d3532438eb1d95b44ee67720c3123a` |
| `src/adult/BackupPanel.tsx` | `8a7b196c94f9628d1de429db55d21b0f8004dbd91d400a9bae8ccc8e5d271453` |
| `src/adult/ProgressView.tsx` | `9ffc8522320fd090da76cbe5cdc4e38222c9acac731d2d439c228d6c4cd6cafe` |

Private browser probes and source inspection are stopped. The owned Vite
teardown endpoint returned `closing`, the server process exited0, and a subsequent
port5186 probe showed no listener. Other workers' ports were not touched. This
report is the correction handoff; further implementation and acceptance belong
to the original author and Controller.

## Correction and real-facade recheck — 9 October 2026

**PASS on the final reviewed sources.** Read the updated correction/binding
handoff and narrow changed surfaces. The corrections preserve the accepted
facade, sole preference helper, erased panel ports and producer summary meanings.
No producer/state/backup contract was weakened. Controller had released actual
binding against `97482c4b791a84c55384c623163664c7d1fdddbc`; real mode was explicitly
enabled for this recheck. The initial gated/frozen evidence above remains
historical and is not relabelled as native persistence evidence.

### Original findings and affected focus/truthfulness paths

Reused the retained independent `probe.mjs` with only its private output root
changed. The original eleven inputs and assertions now pass **11/11** in Edge
at supporting 1366×768. This includes all five previously failing assertions
grouped into F01–F03. It also preserves the original passing missing-identity,
terminal-import/fresh-preview, exact retry, late-unmount cancellation and file
size/raw-recovery boundary evidence.

- **F01 closed:** restoration occurs after the editor closes and saving is idle,
  checks opener connectivity/enabled state, and falls back to the surviving
  focusable chooser heading. The original removed-Ada pending command stays
  captured to `a` and retains its missing-profile failure. Independently rerun
  author variants cover disabled Add at capacity, ordinary connected-opener
  cancellation, and successful captured rename/create restoration.
- **F02 closed:** refresh only announces an updated preview if one was actually
  produced. The original deleted-target input closes the dialog, focuses the
  adult heading, retains the missing-profile explanation and submits zero
  destructive commands. The related stale all-profile preview still shows its
  refreshed affected names before confirmation.
- **F03 closed:** transient attempted-confirmation state distinguishes untouched
  preview cancellation from closing after dispatch. The original typed-failure
  button cancel, rejected import button cancel, and rejected destructive Escape
  retain their prior failure/uncertainty and state that no further retry was
  requested. No never-submitted/no-import assertion replaces those attempted
  outcomes. Button/Escape share the adult cancellation path. The related blocked
  backup offer after a rejected destructive dispatch also retains uncertainty.
  Prepared import cancellation still uses the exact capability ID.

Private independent recheck root:

`C:/Users/alexb/AppData/Local/Temp/wp04-06a-independent-recheck-eb3c08fbc5944835891891f31b646004`

`probe-results.json` records the unchanged eleven-sequence pass. The original red
root, attempts, captures and assertions above remain retained. This recheck made
no production or permanent-test correction.

### Independently executed supported-engine binding and focused regressions

Executed the owned author spec on installed **Edge D2 only**, one worker, with
`ADULT_REAL_RELEASE=yes`:

```text
tests/fixtures/adult-profiles-run.ps1 -Project adult-edge-D2 -Filter 'review F01|review F02|review F03|actual facade|two-step adult entry|destructive failure|backup prepare cancel|frozen UI shows four|create retries'
```

Report:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-5b93fb2a41b449488f7d2464a7e4dbb4/results.json`

**10/10 passed**, 10.115 seconds, zero skipped/unexpected/flaky/report errors.
Eight are focused frozen correction/related cases; two use the real
controller/repository/decoder and native IndexedDB. This is an independent
execution of author regressions, distinct from the independently authored probes.
No full owned suite or broad package suite was repeated.

The real profile case creates four distinguishable profiles through the UI,
records actual Q1 progress in two, holds the old profile's allocated rename
through a separately recorded selection request, saves preferences, reloads,
downloads/prepares/confirms a whole backup, then deletes/starts over/resets with
scoped surviving-profile assertions. Displayed M01 counts are 2/1/0/1/1/0 for
the wrong→Hint→later-success profile. The attached actual profile checkpoints
record points **30/40/0/0**, with Q1 world restoration isolated to the two practised
profiles. Rename preserves awards; replacement preserves the portable save and
changes epoch; deletion removes one identity; StartOver creates a new empty
identity; surviving full profiles remain equal; reset leaves no profiles.

The real backup case verifies untouched-preview cancellation preserves native
storage, a committed intervening rename makes the preview stale, and a fresh
preview shows current affected names. Aborting the actual native put leaves both
acknowledged and native roots equal to the pre-attempt root. Exact retry commits
the original portable save with a new epoch. Abort→cancel retains the typed
failure and native root. A held confirmation disables Cancel/Exit and Escape
does not dismiss it; after release and actual commit, reload retains the root.
The hold is a fixture wrapper before facade dispatch, not a claimed blocked
native transaction. Fault injection only aborts the fixture namespace's real
repository transaction; native root inspection is readonly.

The same-file success correction is directly covered: successful replacement
clears the file input, and selecting that identical downloaded file again reaches
prepare and the subsequent real abort/retry/cancel/pending flows.

Decoded `actual-profile-checkpoints` and `actual-backup-checkpoints` JSON
attachments from this independent execution. Example observed epochs:

- Profile saved `ccf0708b-239e-4938-b488-b8b807a4e250` → replacement
  `f79c9f56-ddff-4156-b646-47f93e7e57c4`.
- Backup pre-abort `6c944be5-7a8f-4769-af56-57adb8a27b2d` → successful retry
  `8e93d1e0-bb2c-457d-9d8e-4917c75151b3`.
- Both failed and successful confirmation calls use prepared ID
  `0ed3b1f3-034b-440b-83fa-4b12410d770e`.

Visually inspected this run's `actual-facade-roundtrip.png` and
`actual-native-abort.png`. The actual summary/preferences and successful
replacement are labelled correctly; the failed preview retains the named current
and incoming profiles, typed failure and retry control, without an imported
success banner.

### Fresh independent native counterexamples

`native-probe.mjs` in the independent recheck root adds two directly relevant
real-facade sequences in supporting Edge 1366×768, serially. **2/2 passed**;
`native-probe-results.json` retains exact snapshots, recovery envelope and calls.

1. **Preference abort → ordinary/recovery export → retry → reload:** create Mira
   through the actual UI, abort the helper's native read-aloud write, and verify
   snapshot/native root remain equal to the pre-attempt root. Ordinary current
   export is blocked. Explicit last-committed recovery downloads a compatible
   envelope containing exactly the old committed save/read-aloud=false, with
   its labelled filename. Prepare/cancel of that recovery file writes nothing.
   Helper retry then persists read-aloud=true; native and acknowledged roots
   agree and exact state survives reload.
2. **Epoch change during displayed import → fresh preview → cancel:** prepare
   that real downloaded file, commit a real ResetSave through the fixture's
   accepted command port, and verify the old preview disables confirmation.
   Fresh preparation shows no current profiles and permits a new deliberate
   confirmation. Cancel leaves the reset native root unchanged, makes zero
   import-confirm calls, and retains the old missing selected identity without
   choosing another child automatically.

These supplement the author cases' revision-stale and native-replacement-abort
inputs. They use the actual facade and repository; no fake acknowledgement or
alternate persisted writer supplies their outcomes.

### Reused reports, boundary checks and final limits

Directly parsed the updated author's reports with zero skips/unexpected/flaky/
errors: `learning-is-fun-adult-dd4810f40fb9475c91ffd7919c4b490b` (**28 pass**),
`learning-is-fun-adult-c8877fccca984a4283ef49591dd2dd6d` (**8 pass**), and
`learning-is-fun-adult-89caf2db1fe54830ab137d75a8557c9a` (**12 pass**). Each
records Edge D2, Chromium supporting desktop, Chromium T1 emulation and WebKit
T2 emulation. The last report contains eight real-facade cases plus four frozen
F01 cases; it is not twelve native-binding cases. These multi-project author
results and the unaffected initial 44+8 evidence are reused, not claimed as a
new independent four-project/full-suite run.

Fresh strict ES2023/Node-only typecheck **PASS** on updated spec/API/configs/
teardown with the same command recorded above. File-graph check again finds
zero DOM libraries and zero TSX imports (251 files). Private API emit is only
`export {};`. No shared configuration/dependency or DOM/JSX boundary change was
made by this validator.

Final reviewed SHA-256 values remained unchanged from the start of the recheck:

| File | SHA-256 |
|---|---|
| `src/profiles/ProfileChooser.tsx` | `5fd6d6cc487c819c816b65ddd26b9bde6c1f4a3865401a19572d9fcf20ee733c` |
| `src/adult/AdultArea.tsx` | `dff1c0649b5b6e01eb2a59c40420064100007ca8608259e913bce0a7412f7da7` |
| `src/adult/BackupPanel.tsx` | `4f2b10973c48e3c2411b27791e0b207d2ad428e8c76ac93a21d69375b07c9338` |
| `tests/browser/adult-profiles.spec.ts` | `94b2cea82a7eef978cbfa9c3376f349c9e46cb190cd52dd9c45a8444d3245b81` |
| `tests/fixtures/adult-profiles.tsx` | `1c7ea8395728d84bafb9491cb41ec36dd4940466a4cad9bd3dc29c86cdbdd107` |
| `tests/fixtures/adult-profiles-api.ts` | `04b867847d491b783fff9a60678d395417f687649e2dcd4362bf61544b829fd2` |

**Technical correction/binding verdict: PASS; Controller can accept this reviewed
boundary. Whole-child acceptance is not claimed.** D1 branded Chrome/D3 Firefox
remain unavailable outstanding criteria. The proposed Edge-primary substitution
still has no user answer; no matrix requirement was changed or substituted.
Chromium viewport evidence remains supporting, and touch evidence remains
emulation. Final shell guarded suspension/discard/navigation, published P4-H
PC/tablet paths and physical observations retain their downstream owners. M2
expanded compatibility remains WP04-07A; acoustic/listening obligations remain
their existing owners' work. No published, physical or listening result is
inferred from these local UI/native-state checks.

Execution is stopped. Both private server and owned runner teardown completed;
the final port5186 listener count was **0**. Other workers' ports were untouched.
Only this report and private review probes/output were changed; no production,
permanent test, shared config/status, Git, delegation or other-chat message
action occurred. Historical red evidence and scoped passing conclusions remain
retained above.

## Retained remote Firefox D3 adult smoke — 9 October 2026

**D3 relevant-view obligation: SATISFIED for WP04-06A.** Independently inspected
the three retained adult results, four labelled renders, all three trace ZIPs,
decoded profile-checkpoint attachment and runner/browser metadata. This is an
evidence review of the actual remote execution, not a rerun. It supersedes this
report's earlier D3-unavailable statements for the adult relevant-view boundary.
The technical correction/binding PASS remains intact; no new adult finding was
identified.

Run: [GitHub Actions 37884581632](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/37884581632),
attempt 1, candidate `b0b36714b0c545173be952d44c445a474b4579d8`.
Controller reports the adult implementation unchanged since `100f905`; no Git or
production-source inspection/mutation was performed during this narrow review.

Retained evidence root:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37884581632`

Reviewed `artifact/adult/results.json`, its three per-case trace ZIPs and images,
`artifact/adult/discovery.json`, `artifact/run.json`,
`artifact/playwright-version.txt`, and the directly relevant portions of
`job.log`. The discovery JSON represents `--list` and has no executed results;
its listed/skipped entries are not the acceptance evidence. The separate executed
adult report records **3 expected passes, 0 skipped, 0 unexpected, 0 flaky, 0
report errors**, duration **7.436 seconds**. Each case has one passed result,
retry 0, empty errors/stdout/stderr, and retained trace/render attachments.

The run metadata and checked-out commit in the log agree with the candidate/run
above. Runner log identifies **Ubuntu 24.04.5 / ubuntu-24.04**; Node is 24.21.0 and
Playwright is 1.64.0. The log installs the matched **Firefox 157.0, build 1555**.
Each adult trace independently records browserName `firefox`, platform `linux`,
viewport **1280×720**, hasTouch=false and isMobile=false. Recorded network
User-Agent is `Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0`.
This is actual remote Firefox desktop engine evidence, with its Linux provenance
retained; it is not a Chromium viewport substitution or tablet/touch claim.

| Executed adult case | Independently checked coverage |
|---|---|
| Two-step adult entry, confirmation cancellation and exit focus | Keyboard entry focuses the explanatory heading then adult heading; confirmation opens on Cancel, Tab/Shift+Tab traverse the controls, Escape cancels without a destructive command and restores opener focus; adult exit restores the entry control. `adult-entry.png` visibly states the accidental-entry/non-authentication distinction; `delete-confirmation.png` shows the named target, focused Cancel and scoped confirmation/backup offer. |
| Producer progress evidence | `truthful-progress.png` displays M01 counts 4/3/2/1/1/1, retained Hint/later-success feedback, distinct-task evidence, familiar independent review dated 2026-10-12, and M04/E06 missing evidence. The recorded assertions verify the producer DTO, missing-evidence labels and absence of an ability percentage. Counts, help, observations and suggested practice remain distinct in the actual Firefox render. |
| Actual four-profile preferences/reload/backup | Actual facade creates Pip/Rowan/Iona/Nessa profiles, records separate first-slice progress, keeps the held rename attributed to the original ID through a selection request, saves both reading/motion preferences and reloads exact state. Real file download/prepare/confirmation replaces the whole portable save with a new epoch; scoped delete/StartOver/survivor and final reset assertions pass. `actual-facade-roundtrip.png` is explicitly labelled actual facade/IndexedDB, shows committed preferences, M01 counts 2/1/0/1/1/0 and acknowledged replacement. |

Decoded `actual-profile-checkpoints` independently confirms four distinct avatar
IDs, practised points **30/40/0/0**, renamed nickname **Star**, and saved preferences
`instructionReadAloud:true, motion:reduced`. Portable saved/replaced roots are
equal; epochs differ:
`d1187aee-ec67-456a-ae27-630291b61626` →
`7f29710b-1423-474d-ae26-70b6bf44d57f`. Deletion leaves three profiles with Ben's
full profile equal to its saved value. StartOver removes Ben's original identity;
Cora's full profile remains equal. The passed traced test includes the final
empty-profile reset assertion; the checkpoint attachment itself ends at StartOver.
No native-abort/failure suite is inferred from this three-case smoke.

All three traces contain no recorded action errors, page-error/exception events,
console errors or warnings, or HTTP 4xx/5xx resource responses. Console records
are Vite debug, development info and timestamps. Entry/focus, summary and actual
round-trip renders are readable at the required D3 size without visible text or
control clipping. These observations provide the remaining DEC-005 Firefox
1280×720 **smoke** coverage; they do not claim a new full keyboard, touch, 200%
text, failure-path or physical-device suite.

**Overall remote job: FAILED, not accepted as a whole-job pass.** The job log
records the three adult passes first, then later failures in separate audio
Enable cases. This review neither diagnoses nor accepts those audio cases.
Their failure does not erase the valid scoped adult results; no published,
listening/acoustic or other-fixture acceptance follows from the adult smoke.

**Exact remaining whole-child blocker: D1 branded Chrome complete keyboard/mouse
and profile/adult/backup paths remain unavailable/unperformed.** The proposed
Edge-primary substitution still has no user answer, so no D1 requirement was
amended or substituted. D3 adult relevant views no longer block WP04-06A.
Controller retains whole-child administrative acceptance. Existing final-shell,
published P4-H/physical PC/tablet and M2 obligations keep their prior downstream
owners; none is inflated into a new requirement or closed by this remote smoke.

Only this report was appended. No browser launch/test rerun, source/shared-file
edit, Git action, dependency install, port use, delegation or other-chat message
occurred during this evidence-only review.

## Final D1 completion review — 9 October 2026

**Whole-child result: PASS, ready for Controller acceptance.** Independently
reviewed the original author's remaining installed-Chrome D1 evidence against
the profile/adult/backup criteria. Reused the accepted correction/binding,
D2/T1/T2 and Linux D3 evidence above. No new gap or finding justified a rerun;
this completion review launched no browser and used no server port.

Retained D1 evidence root:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-adult-d1-59c768d38ef64ecbab695c801ff79bb1`

Reviewed `results.json`, private `d1.config.mjs` and `d1-keyboard-setup.mjs`,
`d1-keyboard-result.json`, `d1-keyboard-trace.zip`, the actual profile/backup
JSON checkpoint attachments, and relevant retained screenshots. The report
records **10 expected passes, 0 skipped, 0 unexpected, 0 flaky, 0 report errors**,
duration **12.648 seconds**. Each case has one passed result, retry 0 and empty
errors. Passing suite traces were not retained under `retain-on-failure`; the
separate successful keyboard journey has its own retained trace.

Configuration restricts the run to Playwright `channel: chrome` at **1366×768**.
The keyboard result reports browser version **155.0.8059.40**, and trace context
records Chromium engine, Chrome channel, Windows and Playwright **1.64.0**.
Recorded User-Agent is HeadlessChrome/155.0.0.0. Independently read Windows
version metadata for `C:/Program Files/Google/Chrome/Application/chrome.exe`:
product Google Chrome, company Google LLC, version **155.0.8059.40**, matching
the browser runtime. This is installed branded Chrome in headless desktop mode;
no Edge substitution or browser-matrix amendment is required.

| D1 criterion | Independently reviewed evidence and result |
|---|---|
| Profile chooser and editing | Passed cases cover four portraits, captured pending rename, guarded selection request, nickname validation, avatar keyboard operation, cancellation, capacity and F01 surviving focus fallback. `four-profiles.png` shows distinct portraits, selected state, readable controls and visible adult-entry focus. |
| Adult entry and focus | Passed case covers the separate explanation/Continue step, initial confirmation focus on Cancel, cancellation and exit focus. The additional trace records keyboard entry, Tab to Continue, Tab to confirmation, Escape cancellation restoring Delete focus, and exit restoring For grown-ups focus. |
| Truthful evidence and preferences | Passed producer/preference cases retain failure/retry and committed preference behavior. `truthful-progress.png` shows counts 4/3/2/1/1/1, retained help/later-success feedback, familiar independent review, distinct-task evidence and explicit M04/E06 missing evidence. No ability percentage is inferred. |
| Backup and destructive scopes | Passed frozen and actual cases cover prepare/cancel/stale refresh/failure/recovery, exact prepared-ID retry, repeat selection of the same backup, pending cancellation lock, whole replacement, delete, StartOver and reset. `actual-native-abort.png` visibly retains the saving-failed explanation, unchanged last-committed-save assurance and retry/cancel/backup choices. |
| Targets, text and reflow | Passed measurements assert visible controls at least 44×44px and no horizontal overflow. The established method doubles root text to 32px and checks 683px width, plus 768×1024 and 1024×768 relevant views. Independently viewed chooser/adult enlarged captures and private inspection crops: titles, labels, disclosures, buttons and backup scopes wrap readably. This is text enlargement/reflow evidence, not operation of Chrome's native zoom menu. |
| Actual profile and backup round trip | Actual JSON attachments and the separate keyboard result confirm portable-save equality across whole replacement, a new epoch, scoped survivor preservation and exact persisted state after reload. Actual-labelled renders distinguish these outcomes from frozen acknowledgements. |

The separate keyboard journey records **passed**, `keyboard: true` and no page
errors. Source and trace agree on keyboard activation: 16 focus operations,
21 keyboard presses, three keyboard typing operations and no mouse click action.
It creates Maple/Pip and Birch/Rowan, requests selection without optimistic
publication, renames Maple to Maple Star, enters the adult area, commits both reading
and motion preferences, downloads a real backup, confirms whole-save replacement,
cancels deletion with Escape, exits with restored opener focus and reloads.
`d1-keyboard-backup-confirm.png` shows a strong visible focus outline on Confirm,
the affected/incoming names and a modal contained within the 1366×768 viewport.
`d1-keyboard-adult.png` shows both committed preferences and recorded practice.

The journey uses the existing fixture API for practice and explicitly permitted
shell publication. File input is focused, then Playwright `setInputFiles` selects
the downloaded backup; native OS picker keyboard operation is explicitly
unclaimed. These limits do not add a final adventure or physical-device claim.

Independently compared the keyboard result's complete roots: saved and replaced
portable saves are equal, while epochs change from
`f34325c6-a42b-4a75-94f1-3ac3e8bd8caa` to
`0e744ad5-2380-451f-b395-c02bdcbfaa75`; replaced and reloaded roots are exactly
equal. Maple Star retains Pip, both preferences and 30 points; Birch retains
Rowan, default preferences and 40 points.

Decoded actual suite checkpoints independently confirm four profiles with points
30/40/0/0, equal portable saved/replaced roots and changed epochs
`50ce2e10-d9a6-4b4a-9129-f0eb4d951d40` →
`852907d0-1d5d-4ecf-85c5-f789ebd01870`. Delete leaves three profiles and Ben's
full saved profile unchanged; StartOver removes Ben's original identity.
Backup checkpoints repeat the exact prepared ID
`8979e448-d5eb-4e35-b224-2f2ad6f96d1c` on retry and preserve portable-save
equality. The passed actual native-abort case retains assertions for unchanged
native root after abort/cancel, same-file reselection, disabled cancellation while
confirmation is pending, and exact final reload.

Keyboard trace contains **zero action errors or page-error/exception events**.
It does contain one console error: a **404 for the fixture's
`http://127.0.0.1:5186/favicon.ico`**. This incidental browser favicon request is
not an adult application exception or failed workflow and does not create a D1
acceptance gap. No captured network response is HTTP 4xx/5xx; the favicon error
is retained in console evidence rather than erased by that network observation.

**No remaining owned technical or relevant-view blocker.** D1 is now satisfied
by actual installed Chrome evidence; D2/T1/T2 and scoped Linux D3 remain accepted.
The D3 remote job's later unrelated audio failure remains a failed whole job,
as documented above. Controller may accept WP04-06A as a whole child. Final shell
guarded journeys, published P4-H/physical PC-tablet paths, acoustic checks and
WP04-07A/M2 retain their downstream owners and are not accepted by this review.

Only this owned report and private screenshot inspection crops changed. Original
captures were preserved. No product/permanent-test/config/dependency/shared-status
or Git write, browser launch/test rerun, server operation, delegation or
other-chat message occurred during this final evidence-only review.
