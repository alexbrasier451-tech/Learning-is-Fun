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
