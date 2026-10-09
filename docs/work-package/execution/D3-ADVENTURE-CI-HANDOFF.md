# D3 adventure CI handoff

9 October 2026. **Ready for independent foundation validation, then controller commit/push/manual dispatch with `selection=adventure`.** This worker verified configuration and discovery only. No adventure browser case, root build, native installation, Windows browser operation, or external action was performed.

## Owned change and selection contract

Owned files are `.github/workflows/d3-firefox-smoke.yml`, `tests/fixtures/d3-firefox.config.ts`, the new `adventure.vite.config.ts` / `adventure-teardown.ts`, and this handoff. World source, `experience.spec.ts`, adventure HTML/TSX/API, other fixture configs, dependencies, root configuration, and shared status were not edited.

The manual workflow now has a required choice input named `selection`:

| Selection | Fixtures run | Exact expected passes |
|---|---|---|
| `components` — default | adult, Hall, audio, creative | 3 + 3 + 2 + 2 = 10 |
| `adventure` | adventure only | 6 |

Prepare validates the input and exports `D3_FIXTURES` from the fixed selected-count map. Discovery and execution loop over that list; adventure selection does not execute unchanged component cases. Both discovery and final result gates independently use the selected fixed counts and require project `D3-Firefox`. The result gate retains the original no-error/no-failure/no-skip/no-flaky requirements, expected passed status, and exactly one passed result per case. Run metadata records selection and expected counts with commit/run/attempt identity; artifact names also include selection.

The default component filters, servers, teardown, counts, and final status checks remain valid. Existing local component discovery still works with its four private output roots and without `ADVENTURE_VERIFY_ROOT`.

## Adventure runner contract

The inspected host is self-contained: `experience.spec.ts` navigates to `tests/fixtures/adventure.html?namespace=...`, generates per-test namespaces, uses native IndexedDB through the actual facade, and calls its existing `adventureFixture.close()` after each case. No additional feature flag or source/API change is required. All six existing cases in that file are selected: ordinary journey, supported keyboard journey, optional transfer, native-save failure/retry, profile switching, and reduced-motion/portrait reflow. No new case was invented.

The D3 adapter supplies `http://127.0.0.1:5194/playtest/`, the existing host path, `APP_BASE=/playtest/`, and `APP_BUILD_ID=local-adventure`. Vite uses port 5194 with strict-port and no server reuse. Its cache is `${ADVENTURE_VERIFY_ROOT}/vite`; results and Playwright screenshots/traces are under `${ADVENTURE_VERIFY_ROOT}`. The new POST-only `/playtest/__d3-adventure-close` endpoint closes the owned Vite server; teardown uses a three-second bounded request.

The adapter remains one Firefox project, default viewport 1280 × 720, no touch/mobile emulation, maximum one worker, zero retries, no focused tests, and no parallel execution. Adventure cases have a 45-second case timeout; the existing five-minute D3 global timeout remains. Case-authored viewport/media changes are preserved.

CI exports `ADVENTURE_VERIFY_ROOT=$RUNNER_TEMP/d3-firefox/adventure` alongside the existing four roots. Direct local adventure discovery must provide all five roots because the adapter imports the four existing owner configs; the adventure root itself is required only when adventure is selected. All CI caches/evidence remain private to the runner. Existing bounded browser stderr, failure exit propagation, screenshots/traces, and one-day artifact retention apply to adventure too.

## Verification and pending run

Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-adventure-ci-odwd4p`. Native pnpm YAML parsing, all inline Node syntax, and strict ES2023/Node type checking of only the three runner files passed. Private Prepare execution tested both choices and paths containing spaces. Actual Playwright discovery passed components 3/3/2/2 and adventure 6, all under `D3-Firefox`; unknown selections and a missing adventure root were rejected.

Fifteen gate checks passed, including the actual accepted component reports from run `37889547310` and a synthetic six-pass adventure report derived from current discovery. Missing cases/empty reports, wrong projects, expected failure, skips, failures, flaky results, extra attempts, and report errors remained rejected. Synthetic results are gate validation only, never adventure acceptance evidence. One hundred fingerprints for other fixture/spec and root dependency/config files remained unchanged; the actively refined world files were excluded from that freeze.

The accepted PulseAudio package setup, private native output/readiness, host observation, matched Firefox setup, and targeted cleanup steps are unchanged. Prior native-output success is documented in `D3-AUDIO-HOST-DIAGNOSIS.md`; technical audio provisioning does not establish heard quality.

The independent validator must recheck the final owned snapshot alongside the coherent world candidate. The controller then dispatches **adventure only** and returns run identity, six original results, screenshots/traces/command receipts, discovery, native readiness/host/cleanup metadata, and browser logs. Closure requires six actual passes with the unchanged gate; local checks do not establish browser behavior or broader M1 acceptance.
