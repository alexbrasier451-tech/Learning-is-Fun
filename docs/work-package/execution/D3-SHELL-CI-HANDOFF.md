# D3 application shell CI handoff

9 October 2026. **Ready for independent tooling review, then controller commit/push/manual dispatch with `selection=shell`.** This worker verified configuration, discovery and report gates. Actual shell execution remains pending.

## Owned change

The five owned paths are `.github/workflows/d3-firefox-smoke.yml`, `tests/fixtures/d3-firefox.config.ts`, `tests/fixtures/shell.vite.config.ts`, `tests/fixtures/shell-teardown.ts`, and this handoff. Production source, shell/adventure specs, other fixtures, root configuration, dependencies, shared status and Git state were not edited.

| Manual selection | Selected cases |
|---|---|
| `components` — default | adult 3, Hall 3, audio 2, creative 2 |
| `adventure` | existing adventure 6 |
| `shell` | existing `tests/platform/shell.spec.ts` 4 |

Prepare, discovery and result gates use the same fixed selection counts. Existing component/adventure contracts and workflow execution loops remain intact. Run metadata and artifact names retain selection, commit, run and attempt identity. Closure requires exactly four shell cases under `D3-Firefox`, no report errors, skips, unexpected or flaky results, expected passed status, and exactly one passed attempt per case.

## Actual application launch

The inspected shell author's private launch files specify the repository root application at `http://127.0.0.1:5195/playtest/`, `APP_BASE=/playtest/`, and `APP_BUILD_ID=local-wp01-02a`. The new Vite wrapper preserves the root configuration/plugin chain, uses `--configLoader runner`, and redirects its cache to `${SHELL_VERIFY_ROOT}/vite`. It adds no fixture entry or runtime transform. The actual development-only `__shellRuntime` and its production erasure belong to the source author; this worker did not verify a production build.

The four original cases cover keyboard/help focus, Hall, adult entry and reflow; profile suspension failure/retry/discard; native audio startup, pending-decode silence, channels, pause/reload and failed-read recovery; and registry readiness, stale cleanup, epoch replacement and disposal. No case or test behavior was changed.

Port 5195 is strict with no server reuse. POST-only `/playtest/__d3-shell-close` closes the owned server; teardown requests it with a three-second bound. Results, screenshots and traces use `${SHELL_VERIFY_ROOT}`. The adapter retains one Firefox worker/project, zero retries, `forbidOnly`, no parallel execution, default 1280 × 720 viewport, and traces/screenshots enabled. Shell timeout is 40 seconds per case; global timeout remains five minutes and CI job timeout 30 minutes.

CI prepares all six fixture roots privately below `$RUNNER_TEMP/d3-firefox`. Direct local shell discovery still needs the four legacy component roots because their owner configs are imported, plus `SHELL_VERIFY_ROOT`; adventure root is optional. The accepted matched Firefox setup, bounded browser logging, PulseAudio package/private output/readiness, host observation, targeted cleanup, failure propagation and artifact retention are unchanged. Technical audio provisioning does not establish heard quality.

## Verification and pending acceptance

Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-shell-ci-yIUqqs`. Native YAML parsing, six inline Node syntax checks and strict runner-only typechecking passed. Private Prepare and actual Playwright **discovery only** passed all three selections with paths containing spaces: components 3/3/2/2, adventure 6, shell 4. Sixteen private gate checks passed, including unknown selection and missing shell root rejection. Synthetic shell reports exercised the pass gate and rejection variants; they are never shell execution evidence.

All 102 frozen non-owned file fingerprints remained unchanged: the previous 100 tooling/config/spec paths plus the two adventure server helpers. `final-validation.json` records final owned hashes and checks for the original reviewer.

No port 5195 server, browser, root build, installation, external run, Git mutation or shared-status write was performed. The original tooling reviewer must recheck the final five paths alongside the coherent shell candidate. The controller then dispatches `shell` and supplies run identity, four original actual results, discovery, screenshots/traces, command receipts, native readiness/host/cleanup metadata and browser logs. Local runner checks establish neither shell behavior nor broader M1 acceptance.
