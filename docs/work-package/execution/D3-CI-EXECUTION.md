# D3 Firefox remote execution

9 October 2026. Controller-owned external execution record. The public repository and implementation were explicitly authorized by the human. No GitHub Pages deployment or live-game acceptance has occurred.

## Initial candidate and dispatch

- Repository: https://github.com/alexbrasier451-tech/Learning-is-Fun . Read-only GitHub verification found public visibility, main as default, Actions enabled and all actions allowed.
- Local CI setup independently passed; candidate `46214efbf8fbb76126991d742c98405e5cce5176` includes reviewed game components, pinned dependencies and the dispatch-only workflow.
- `git push -u origin main` succeeded. GitHub branch lookup confirmed the exact candidate SHA.
- The explicit REST workflow dispatch failed with HTTP 422 before a runner started. GitHub's parser rejected `runner.temp` in `jobs.firefox.env`, lines 16–20: “Unrecognized named-value: 'runner'.”
- Original tooling author owns the narrow workflow correction. The root paths must be established at an actual runner step, preserving separate fixture roots and evidence. Original independent recheck and a complete dispatch/run attempt remain required.

There is no D3 runtime pass, artifact or browser observation from this rejected dispatch. The prior local YAML parser and synthetic reporter checks did not validate GitHub's context-availability schema. No browser, product or acceptance requirement has been waived. D1 Edge-primary approval remains unanswered.

## Corrected candidate accepted by GitHub

- Original-author runner-scope correction and original independent recheck passed. Controller committed and pushed candidate `b0b36714b0c545173be952d44c445a474b4579d8` and verified the exact remote main SHA.
- Explicit dispatch succeeded. Run: https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/37884581632 ; job `113671600917`.
- GitHub reports the expected candidate SHA. Setup, evidence-root initialization, frozen dependencies, supported root typecheck, exact bounded discovery and matched Firefox/Linux dependency installation have passed. The serial browser step is running.
- Actual ten-case results, artifacts and rendered inspection are still pending; successful setup is not D3 acceptance.

## First real runner outcome — audio activation failure

Run `37884581632` completed with failure at the serial browser step. Native setup and the corrected environment initialization succeeded, closing the original HTTP 422 path. Downloaded job log and artifact `11595742259` (20,505,423 bytes) to `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37884581632`.

| Fixture | Actual result |
|---|---|
| Adult/profile | 3 passed, zero skipped/unexpected/flaky/errors |
| Hall | 3 passed, zero skipped/unexpected/flaky/errors |
| Audio | 2 failed, zero skipped/flaky; explicit Enable sound remained activation=inactive instead of ready |
| Creative | Not executed because the preceding serial invocation failed |

Both audio failures occur at the explicit activation readiness assertion, in actual-facade profile/visibility and first-visit keyboard/Silence-all cases. This is not a heard-quality judgement. Original audio owner is tracing whether the earliest cause is runtime, fixture or runner audio capability; no source compensation or waiver is authorized without identifying the cause. Original Hall/adult reviewers inspect their passing D3 artifacts independently. D1 remains blocked and its Edge substitution question remains unanswered.

Original Hall and adult validators have now independently inspected their respective three Firefox cases, actual browser/viewport metadata, traces, rendered views and real-save checkpoints. Both conclude their D3 relevant-view smoke obligations are satisfied; Controller accepts those narrow conclusions. Their validation reports retain the overall job's later audio failure and the remaining D1 requirement. Neither child is complete while D1 is unresolved, and no full-game published Firefox check is claimed.

## Observational audio rerun

Original author added only fixture checkpoints and failure attachments; independent review confirmed native calls, promise identity, thrown/rejected errors, original inputs and expectations remain unchanged. Commit `ffd1d39f103f8b2b694f2db203a6acc160e40dfd` was pushed and explicitly dispatched.

Run https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/37885535995 completed with the same two audio failures, after three adult and three Hall passes. Creative was not reached. Downloaded artifact `11596108124` (22,176,419 bytes) and job `113674588485` log to `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37885535995`. Original audio owner is examining the new ordered native-startup checkpoints. This was an evidence-gathering run, not an attempted production repair or a target-browser pass.

## Passive native-host observation

The original audio owner localized both captured failures to one pending native resume, with valid consent/visibility/user activation and no native state progress. Missing or unusable output remains a hypothesis; zero output channels alone do not prove its cause.

Foundation authored passive audio-host metadata and bounded native Firefox stderr capture. Independent review passed, preserving the original cases, failure exit status, and acceptance gates. Candidate `307885b493857655635924adcad8c056ac59562c` was committed, pushed, remote-SHA checked and explicitly dispatched as run https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/37887423464 (job `113680449790`). Actual host evidence is pending. No audio service has been installed/started or product behavior changed by this observation.

That run completed with the same two audio failures after six adult/Hall passes. Artifact `11597425353` (22,546,416 bytes) and the job log were downloaded to `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37887423464`.

The passive post-test snapshot reports missing `/dev/snd`, ALSA cards/PCM files, standard Pulse/PipeWire socket paths and corresponding executable commands. Both observed process lists have zero audio matches; relevant user/system units are not-found/inactive/dead. The mixed package query exited 1 and must be read as partial evidence: it reports libasound2t64 installed and several named Pulse/PipeWire packages not found. Sink state remains explicitly unprobed. Native Firefox logs are retained, including teardown warnings; no sandbox override is authorized by them.

Foundation is interpreting these facts and preparing the narrow native-output provisioning repair on the ephemeral Linux runner. This adds no game-source change and grants no Firefox pass until the original complete cases run successfully with a verified real backend.

## Native-output repair candidate

The original tooling owner supplied a private runner-user PulseAudio instance and clocked stereo sink with explicit native readiness checks and scoped cleanup. Independent local review passed. Controller committed/pushed `159137b46f21099d7a4c766159ff13828154fdcb`, verified remote main, and dispatched https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/37888549520 (job `113683998388`).

The original ten browser cases, discovery and pass gates are unchanged. No game, fixture, browser-security or autoplay behavior was altered. Actual native readiness and complete original Firefox results remain pending.

Run `37888549520` stopped at the readiness gate before any browser case. Artifact `11596764569` (11,078 bytes), job log and readiness/cleanup records are retained at `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37888549520`.

Ubuntu PulseAudio 16.1 packages installed; daemon startup, the owned Unix socket, native server connection, and the expected IDLE/unmuted stereo 44100 Hz sink all succeeded. The readiness verifier nevertheless failed. Captured `pactl --format=json list modules` entries have no `index` property, while the verifier tried to match `module.index` with the sink's numeric `owner_module`. Original foundation owner is correcting this verifier against the actual output using supported explicit module identity. This is a new earliest divergence in the same end-to-end loop; no browser pass is inferred from successful backend startup.

## Corrected native module identity verification

Original author and independent validator reproduced the schema defect from captured native JSON. The reviewed correction reads explicit IDs from PulseAudio's supported short text listing, rejects malformed/duplicate IDs and preserves readiness/ownership gates. Independent focused checks passed; all 157 frozen product/test/config files remained identical.

Controller committed/pushed `18f08b01e7ffc839b0fb14d686ff8341d3fd362e`, verified the exact remote SHA and dispatched https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/37889547310 . Actual native identity output and all original browser results are pending.

Run `37889547310` completed successfully. Artifact `11597771163` (38,454,512 bytes), job `113687120938` log and extracted evidence are retained under `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37889547310`.

Controller inspected the original JSON reports: adult 3, Hall 3, audio 2 and creative 2 expected passes, each with zero skipped, unexpected or flaky results. Native readiness is true with no failure: the actual short-text output identifies module 0 as module-null-sink and module 1 as module-native-protocol-unix. The unmuted stereo 44100 Hz d3_output sink explicitly belongs to module 0. Cleanup targeted the private server and exited 0, with no signal/error and an untruncated log.

The original audio and creative validators are independently inspecting their corresponding actual Firefox results and retained views/checkpoints. Native-output setup success, software-sink execution and browser behavior do not establish heard quality, physical-device use, published-game acceptance or D1 completion. No production audio, original test input/expectation or browser security setting changed during this causal repair.

Original audio and creative independent reviews now both PASS for their selected original D3 cases. Controller accepts their narrow conclusions and the native-host repair closure: actual native resume fulfills and playback becomes ready, committed creative roots match snapshots, failed/conflicting saves preserve unsaved intent, and help commits before explicit Read. Reports retain Firefox unload/fixture-teardown timeout and progress-listener warnings; no warning-free or complete page-close-lifecycle claim is made. Explicit cleanup/browser/server exits and all original assertions passed.

All unaffected work in this branch is complete at this checkpoint. D1 remains the concrete external blocker: the human's pending browser substitution choice has not been answered. Hall/adult/tooling completion and dependent composition/publication remain unreleased; accepted-child count remains 20/49. No Pages URL, whole-package or M1 completion is claimed.
