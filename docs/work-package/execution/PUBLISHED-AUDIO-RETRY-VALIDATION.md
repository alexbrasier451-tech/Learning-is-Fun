# F01 preference retry — independent local validation

11 October 2026. **PASS for the frozen local correction. No actionable causal finding. Published F01 remains open.**

The real Sound panel now reaches the existing preference retry queue. The reviewed correction preserves immediate live silence, the last committed root on native abort, truthful failure/pending state, and acknowledgement after the latest native commit. This report does not accept a republished candidate or change the original B observations.

## Review boundary and causal assessment

Reviewed the [frozen F01 reproduction](../../playtests/M1/BOUNDARIES.md), the [producer handoff](PUBLISHED-AUDIO-RETRY-HANDOFF.md), production `AudioControls`, both application bindings, the actual runtime/preference path, the updated fixture, and all three new full-app test cases. Inspected the retained published no-retry JSON and the producer's red/green result files and JSON attachments.

The original published evidence retains revision 3 and an uncertain-save message after storage restoration, Save progress and repeated Silence all; its Sound panel has no preference retry. The producer's pre-fix local red result fails specifically at the missing **Retry saving sound choices** button. This supports the identified first divergence: UI access to the existing queue, after correct live stopping and native-abort preservation.

The correction is appropriately narrow:

- `AudioControls` renders a native button only for loaded, failed, pending preference state with a supplied callback. Loading/read failure does not gain a misleading save-retry action.
- `AppShell` supplies `state.preferences.retry`; `App` supplies `runtime.state.preferences.retry` in its initial/recovery render. The fixture now uses this same production control.
- The callback neither activates audio nor changes channel preferences. Existing `retry()` clears the write error and schedules retained leaves through the existing guarded queue; its gate-error branch can only reassert Silence all. It does not clear the discarded-epoch error.
- No second queue or fabricated acknowledgement is introduced. Existing generation/epoch checks continue to govern later edits and replacement saves.

## Immutable review input

Because another lane could change experience files in the shared checkout, the initial shared-Vite original-flow pass was treated as provisional and excluded from final acceptance. Both acceptance cases below ran against a private full-app source snapshot. Only installed `node_modules` was linked to the shared checkout; application source, public media, asset register, configs, original test and starter save were copied. Vite's application root was the snapshot, so shared source/HMR changes could not enter these runs.

Private evidence root:

`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-f01-independent-f8f334590d5d40e1a3b8c7e32586acb0`

`snapshot-manifest.json` records all 128 copied input files, byte counts and SHA-256 values. Source-before, copied bytes and source-after matched; every copied input was checked again after the run and remained unchanged. The SHA-256 of the serialized file-entry manifest is `a49cb5b8af15d5f9d78b6a94e534e2fbacc4c5af314196c3bc3bafcce94dc29b`.

All five executable-file hashes match the producer's frozen handoff:

| File | SHA-256 |
|---|---|
| `src/audio/AudioControls.tsx` | `7238207b13d9a87cffdf4af7a35e688acd58e5651ff3dc1aca923fa5e15778c0` |
| `src/app/AppShell.tsx` | `17b4ddecbac35e6a0dd83c80c86068a663ba05e5a5a975e0f4a8fb3cd399e6d4` |
| `src/app/App.tsx` | `c8544d14584431465a448abfdd2a2496e70dcdcd4c04eb60f3d78bf97b538940` |
| `tests/fixtures/audio.tsx` | `e24b536b882635f0fddb395cca6f736f02378c990d386d03859ba252462be65a` |
| `tests/browser/audio-retry.spec.ts` | `207f814e1e7502c43adc7ffd51d7deee249f0921b2f9898b2a7254583e98a6ee` |

The captured experience baseline is fully recorded in that manifest and summarized in `evidence-summary.json`. In particular, `AdventureView.tsx` is `1b535d6770ec0840c165a61b56bd2350d676ec409352c0d49e2c9f5887f14f79`, `QuestActivity.tsx` is `a3f8547679f61dc6ed6c88d7a6c7e0fafa5f520972b78468c233d0770effb59c`, and `experience.css` is `a24ceebeb2a90e672d88df104a55443203cad77f178ef1907ecf6c021cf32642`. This identifies the tested baseline without accepting concurrent experience changes.

## Fresh independent execution

**2 passed, zero retries/skips/failures**, one worker, Chrome **155.0.8059.40**, Windows, 1366×768. Started `2026-10-11T07:00:21.926Z`; runner duration 5.934 seconds. Full app at `http://127.0.0.1:5202/playtest/`, identity `local-f01-independent-snapshot`. Exact launch configuration, private additional spec, results, native JSON attachments and traces are retained under the evidence root (`run.ps1`, `retry.config.ts`, `specs/`, `acceptance/results.json`, `acceptance/playwright/`).

Both cases use normal application UI and the real runtime/facade/repository. Native audio observers call the underlying browser methods. The storage fault calls native `put` and aborts its actual transaction. Commit-delay observers keep real transactions alive with native reads; they do not replace repository outcomes or application acknowledgements.

| Case/checkpoint | Result |
|---|---|
| Original untouched starter import, River Boundary, explicit sound, pause/resume, Whispering Library | Real 76.8-second library source active; native root revision 3, epoch `94976cb1-a1d7-42ba-844c-e9e2da07ba56`. |
| Native abort during Silence all | Whole root remains exactly equal to revision 3; active sources 0, master 0, speech speaking/pending false; truthful failure. |
| Storage restored, Save progress, repeated Silence all | No unintended automatic commit. Actual Sound panel exposes explicit retry. |
| Keyboard Enter on retry; native transaction held | Saving text visible, saved text and retry absent; no new context, resume or source start. |
| Release and native commit | Whole root equals the previous root plus revision 4 and `silenceAll=true` only; saved message and shell readiness become correct. |
| Reload | Exact committed root retained, Silence all visible; zero contexts/resumes/source starts. |
| Fresh reviewer-created explorer; newer edits during held retry | First retry remains held while music/effects are muted and volumes become .37/.19 through normal UI. No concurrent second put is created. |
| First retry commits while latest-field transaction is held | First transaction reports native completion; second reports uncommitted. UI still says Saving and has no saved acknowledgement. |
| Latest-field transaction commits | Exactly two successful puts after the injected failure. Whole root advances from revision 3 to 5 in epoch `b0a87cbe-67bd-4716-a1c0-8443ea2431a2`, with Silence all and latest mutes/levels only; readiness succeeds. Reload retains the exact root and creates no audio context. |

In the original case, context/resume/start counts remain **1/1/3** throughout stop/retry/commit. In the independent in-flight case they remain **1/1/1**. The latter expands the producer's coverage: edits arrive after the retry has already reached a native transaction, and acknowledgement waits for the subsequent retained batch too.

## Supporting retained evidence

Inspected the producer evidence under `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-f01-20261011`:

- `red/results.json`: one diagnostic failure at the missing production retry button.
- `green-original/results.json`: original full-app case passes.
- `green-variants/results.json`: two passes; original and fresh explorer with another aborted explicit retry followed by successful persistence of latest .31/.82 muted levels.
- `green-epoch/results.json`: one pass; normal confirmed whole-save replacement changes epoch, retains donor volume .5 at revision 0, removes retry availability for discarded .93 edits, and preserves truthful lost-edit/readiness failure until reload. No retired field replay or audio activation.
- `unit-results.json`: **73/73 passed**, zero failed. Existing audio/speech/preference regression evidence is reused, not claimed as a new reviewer run.
- Existing fixture browser result at `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-ad7609e47c07478288630bcb2a7c2ed3/results.json`: **15 passed**, zero unexpected/skipped/flaky. Relevant native-abort, reentrant cancellation, cross-tab silence and readiness cases are present.

`evidence-summary.json` retains the extracted result/attachment observations and post-run snapshot verification. The controller, speech and preference implementation hashes match the previously reviewed baseline; the correction did not change those producers. The handoff also records passing application and Node-only spec typechecks; these were not rerun for this report-only review.

## Scope and release gate

No production, fixture, shared configuration, observer report, ledger, Git or deployment mutation was made by this reviewer. Repository output is this report only; execution files and evidence are private. No worker or other-chat message was created. The owned server shut down normally and port 5202 had no listener at cleanup.

This is local full-app acceptance of the frozen audio correction on the recorded experience baseline. Active speech cancellation and acoustic/heard silence are not established by these two fresh cases; the former has retained focused-suite coverage. No new browser/device matrix or experience acceptance is claimed.

**Published F01 remains open until coordinated republication and the original observer's repeat of the published abort → live stop → restored storage → explicit retry → native commit → reload flow, including affected preference/silence/readiness checks.**
