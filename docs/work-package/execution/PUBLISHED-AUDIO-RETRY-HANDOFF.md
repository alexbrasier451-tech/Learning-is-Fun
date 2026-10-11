# F01 preference retry — local correction handoff

11 October 2026. **Local correction verified; published F01 remains open.**
The original audio producer has frozen the changes below for independent review.
Production B remains the original published observation; no deployment or Git
operation was performed. The original observer must repeat F01 on the reviewed,
coordinately republished candidate before published recovery can be accepted.

## Original input and causal finding

The frozen contract is [BOUNDARIES.md, F01](../../playtests/M1/BOUNDARIES.md).
Its original evidence is retained without modification at
`artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/`:
`command-26.js`, `command-27.js`, `result-28.json`, `command-29.js`,
`D1-preference-no-ui-retry.json` and `D1-original.trace.zip`.

Input: import untouched UI-created starter save, select River Boundary, exit
Silence all, unmute both channels, pause/resume and visit the library. Abort the
actual native preference put transaction, press Silence all, restore native
storage, then try Save progress and repeat Silence all. Expected: live stop
immediately, preserve the committed root on abort, expose explicit preference
retry, and acknowledge only the eventual native commit while keeping silence.

| Ordered checkpoint | Actual before correction | Verdict |
|---|---|---|
| Live Silence all intent | Active native sources stop, master gain becomes 0, speech speaking/pending false | Correct; preserve |
| Real facade → repository → native abort | Candidate revision 4 aborts; whole committed root stays at revision 3 | Correct; preserve |
| Preference queue retains failed request | Dirty preference leaves retained; `writeError` prevents automatic drain; status remains failed/pending | Correct explicit-retry contract |
| UI → existing preference `retry()` | App `AudioControls` has no retry action or binding; repeating an edit does not clear `writeError`; shell flush cannot clear it | **First causal violation: missing UI binding** |
| Later saved acknowledgement/reload | Cannot reach durable acknowledgement through the available UI | Consequence |

`src/state/preferences.ts` already implements `retry()` by clearing the write
error and scheduling retained leaves through its existing queue. No new writer
or state-controller repair is needed. The audio fixture previously rendered a
separate retry button calling this helper outside production `AudioControls`.
That fixture-only action explains why its earlier retry test passed while the
published UI had no such control.

Logic-Flow Diagnosis was used for this investigation. The original red evidence
was consumed and a local full-app red case was run before production changes.
The local red trace reaches abort, truthful failure, restored storage, Save
progress and repeated Silence all, then fails because the panel retry button is
absent. Its results/screenshot/trace are preserved under the private `red/` root.
The final green original case additionally asserts the native 76.8-second
library source is active before injecting the abort.

## Exact correction surface

| Path | Change |
|---|---|
| `src/audio/AudioControls.tsx` | Optional `retrySavingPreferences` callback and native button **Retry saving sound choices**, displayed for loaded, failed, pending preference state when a binding exists. No activation/media action. |
| `src/app/AppShell.tsx` | Binds the button directly to `state.preferences.retry`. |
| `src/app/App.tsx` | Supplies the same binding in the initial/recovery shell. Read-failed/loading states still do not expose a save retry. |
| `tests/fixtures/audio.tsx` | Uses the production button/binding and removes its separate fixture-only retry action/subscription. |
| `tests/browser/audio-retry.spec.ts` | Three local full-app browser cases covering original recovery, a fresh explorer with newer mute/volume edits and repeated failure, and whole-save epoch replacement. |
| This handoff | Diagnosis, evidence and exact review boundary. |

`controller.ts`, `createAppRuntime.ts`, all state producers, shared configuration,
CI, observer reports/ledgers and media remain untouched by this correction.
No new retry queue, fake acknowledgement, automatic retry, unmute, silence exit
or media resume was added. Existing isolated consumers can omit the callback;
both production shell render sites and the audio fixture bind it explicitly.

The button disappears while the retained queue drains and after successful
commit. A repeated storage failure returns the same truthful failure and retry
action. Discarded old-epoch edits remain governed by the existing scope-error
contract; the button cannot acknowledge those losses or replay retired fields.

## Complete local original-flow result

Private evidence root:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-f01-20261011`.
Full application served locally at `http://127.0.0.1:5202/playtest/`, build identity
`local-f01-correction`, actual Chrome **155.0.8059.40**, Windows, 1366×768.
One worker, no retries, isolated browser contexts. Normal UI creates/selects or
imports profiles; production creates the actual runtime, facade, preference
controller and IndexedDB repository. No app command or transition stub is used.

The test wraps actual native audio objects for observation and calls their native
start/stop/resume methods. The storage fault wrapper calls native `put` and then
aborts the matching transaction. The acknowledgement check keeps the actual
retry transaction alive using native reads until the test explicitly releases
it; no candidate, result or acknowledgement is fabricated.

In `green-variants/results.json`, the original imported-library attachment
`full-app-native-retry.json` records:

| Stage | Observed |
|---|---|
| Before abort | Epoch `ca93d5d5-52dd-4ebd-bd3c-88f48e84027a`, revision 3; enabled, unlatched, both channels unmuted at .5; one active 76.8s library source, master 1 |
| Native abort + Silence all | Whole native root exactly unchanged at revision 3; active sources 0, master 0, speech speaking/pending false; truthful uncertainty |
| Storage restored + Save progress/repeated Silence all | No premature commit; panel exposes explicit retry |
| Keyboard Enter on retry, transaction held | “Saving sound choices…”; saved text absent; retry action absent; no new source, context or native resume |
| Native commit | Same epoch, revision 4; entire root equals prior root plus only the expected revision and `silenceAll=true` change; saved badge/status appears |
| Shell readiness | Subsequent Save progress says “Your progress is saved.” |
| Reload | Exact revision-4 root retained; silence stays on; contexts/resumes/sources all 0 |

The native resume count stays 1 and total source starts stay 3 throughout the
stop/retry/commit interval. Retrying storage cannot restart playback.

## Focused variants and regression results

| Check | Result and evidence |
|---|---|
| Local original red before fix | 1 expected diagnostic failure at missing retry control; `red/results.json`, screenshot and trace |
| Original full-app flow immediately after fix | 1 passed; `green-original/results.json` |
| Strengthened original + fresh explorer | 2 passed; `green-variants/results.json`, full traces and JSON attachments |
| Fresh variant detail | Normal UI-created explorer with village playback; failure followed by both mutes and volumes .31/.82, another aborted retry, then successful held/released retry. Entire committed root matches latest retained fields, revision advances once, silence and levels survive reload |
| Whole-save replacement epoch | 1 passed; `green-epoch/results.json` and `replacement-epoch.json` attachment. Failed .93 edit is discarded by explicit normal import; new epoch/revision 0 has donor .5. Retry absent, lost-edit/readiness failure remains truthful until reload; no stale field commit or audio activation |
| Existing complete audio browser suite | **15 passed**, Chromium, one worker, zero skips/retries; `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-ad7609e47c07478288630bcb2a7c2ed3/results.json` |
| Existing audio controller + speech + preference unit suites | **73 passed** (30 + 7 + 36); `unit-results.json`. Covers delayed decode/resume, live silence, reentrant cancellation, epoch replacement/late completion, conflicts, failed retry and readiness |
| Application/fixture TypeScript | `tsc --project tsconfig.app.json --composite false --incremental false --noEmit` passed; no shared build-info output |
| Browser spec Node-only boundary | Strict noEmit ES2023/Node, no DOM/JSX, for existing audio spec and new retry spec passed after final test edit |

Only the relevant suites were run. These are local correction checks, not a new
published or full-device-matrix acceptance. Speech was not actively speaking in
the full-app original/fresh cases; speech cancellation coverage comes from the
existing focused suites. Heard silence, acoustic quality and physical-device
claims remain unverified here.

The private `run.ps1`, `retry.config.ts`, `teardown.ts` and `unit.config.mts`
retain the exact launch configuration. For review, use a fresh output name:

```powershell
& 'C:/Users/alexb/AppData/Local/Temp/learning-is-fun-f01-20261011/run.ps1' -Run reviewer-new
```

No server reuse: port 5202 for full-app checks, then owned audio port 5184 for
existing fixture regressions. Normal teardown completed; both ports had no
listener at the final cleanup check. No worker, other-chat message or deployment
was initiated by this lane.

## Frozen executable-file hashes

Lowercase SHA-256 at handoff (ordinary read-only observations):

| Path | SHA-256 |
|---|---|
| `src/audio/AudioControls.tsx` | `7238207b13d9a87cffdf4af7a35e688acd58e5651ff3dc1aca923fa5e15778c0` |
| `src/app/AppShell.tsx` | `17b4ddecbac35e6a0dd83c80c86068a663ba05e5a5a975e0f4a8fb3cd399e6d4` |
| `src/app/App.tsx` | `c8544d14584431465a448abfdd2a2496e70dcdcd4c04eb60f3d78bf97b538940` |
| `tests/fixtures/audio.tsx` | `e24b536b882635f0fddb395cca6f736f02378c990d386d03859ba252462be65a` |
| `tests/browser/audio-retry.spec.ts` | `207f814e1e7502c43adc7ffd51d7deee249f0921b2f9898b2a7254583e98a6ee` |

Controller owns review/publication coordination. After approval and coordinated
republish, the original observer owns the same published abort → live stop →
restored storage → explicit retry → native commit → reload retest and affected
silence/preference/readiness variants. This local correction does not close
published F01 or change the frozen B observations.
