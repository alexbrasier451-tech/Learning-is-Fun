# D3 adventure CI — independent foundation validation

9 October 2026. Reviewed the completed [handoff](D3-ADVENTURE-CI-HANDOFF.md), the exact workflow/adapter, adventure Vite wrapper and teardown, and their private verification evidence. World implementation remains outside this review; only the existing browser spec's collection and host/lifecycle contract were inspected. No server was started or contacted on the world author's active port 5194.

**Verdict: PASS for bounded CI support; ready for Controller's coherent-candidate execution with `selection=adventure`. Blocking findings: NONE.** Six actual adventure Firefox results remain pending. This local configuration verdict grants no adventure behavior, world-source, root-build or broader M1 acceptance.

## Selection, metadata and private roots

The workflow remains manual-dispatch-only. Its required choice defaults to `components`, with exactly two allowed choices:

| Selection | Executed fixtures | Required passes |
|---|---|---|
| `components` | adult, Hall, audio, creative | 3/3/2/2, ten total |
| `adventure` | adventure only | Six |

GitHub supports choice defaults and `inputs` in job environment and step artifact inputs. `D3_SELECTION` receives that input in the supported job-env scope. Prepare rejects missing/unknown/inherited-property selections and exports `D3_FIXTURES` from fixed validated maps. Discovery and execution iterate only that controlled list; adventure selection does not execute component cases. [Dispatch inputs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_dispatchinputs), [context availability](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability).

Prepare preserves existing private roots and adds `$RUNNER_TEMP/d3-firefox/adventure`. All six directories are distinct; subsequent-step assignments use the existing `GITHUB_ENV` mechanism. Private simulations passed both selections with paths containing spaces and verified fixture lists, roots, selection/counts and commit/run/attempt metadata. Artifacts include selection/run/attempt in their names, with the same one-day retention and failure-upload condition.

## Runner and lifecycle

The adapter selects only `tests/browser/experience.spec.ts` for adventure, through the existing fixture host at `http://127.0.0.1:5194/playtest/tests/fixtures/adventure.html`. It uses the repository cwd derived from its URL, `APP_BASE=/playtest/`, `APP_BUILD_ID=local-adventure`, a private Vite cache, results JSON and Playwright output root. `--port 5194 --strictPort` and `reuseExistingServer: false` prevent silent port substitution or server reuse. [Vite strict-port behavior](https://vite.dev/config/server-options#server-strictport).

One `D3-Firefox` project retains Firefox, default 1280×720, no touch/mobile, one worker, zero retries, forbidOnly, serial execution, trace/screenshot capture and the existing five-minute global bound. Adventure has a 45-second case timeout. Existing case-authored viewport/media changes remain. Component config objects and grep expressions are unchanged; components still configure without an adventure root. Adventure rejects a missing root or invalid fixture selection.

The Vite wrapper preserves inherited configuration/plugins and changes only its private cache and teardown plugin. Its endpoint closes the owned server only for POST `/playtest/__d3-adventure-close`; unrelated requests continue normally. Teardown uses the matching loopback URL and a three-second abort bound, tolerating an already-stopped server while Playwright retains owned-process cleanup. Mocked lifecycle checks passed without network connections or process/server startup.

## Discovery, failure gates and unchanged evidence

Inspected the author's actual list-only discovery JSON: components remain 3/3/2/2; adventure contains exactly six cases, all `D3-Firefox`. Titles agree with the current spec: ordinary journey, keyboard journey, optional transfer, native-save failure/retry, profile switching, and reduced-motion/portrait restoration. Their existing namespace creation and afterEach fixture-close contract need no new feature flag. Collection is not browser acceptance.

Independent execution of the actual extracted preparation/discovery/result programs passed 25 focused checks. The gate accepts retained accepted component reports and explicitly synthetic six-pass adventure data. It rejects missing reports/cases, extra or empty collection, wrong/absent selection, wrong project, expected failure, skipped/failed results, flaky/skipped/unexpected statistics, extra attempts, missing statistics and report errors. Six single-attempt passed results, matching expected statistics and no errors are mandatory. Adventure synthetic reports establish gate behavior only.

The execution loop's command and Bash pipefail logging remain unchanged apart from the selected fixture list. Native package/readiness/host-observation/cleanup steps are identical in parsed-step comparison; their accepted evidence, including component run `37889547310`, was reused. Failure propagation, native metadata, browser logs, discovery/results, screenshots/traces/attachments and artifact paths remain applicable to adventure. No failure suppression or browser/security substitution is added.

Reused the green strict ES2023/Node no-emit receipt for the three runner files: exit 0, no diagnostics. All 100 owner-frozen non-owned fixture/spec/root dependency/config fingerprints independently match; active world files were excluded from that freeze and not reviewed. No root typecheck/build, broad suite, browser installation or browser case was rerun.

## Final identity and limits

Final owned hashes match the completed author snapshot:

| File | SHA-256 |
|---|---|
| `.github/workflows/d3-firefox-smoke.yml` | `fc8ea2686b8686197336593cbe1a4025ae82e7e7d432ea0b42b0919af371ca55` |
| `tests/fixtures/d3-firefox.config.ts` | `47d25e32f5f796bab1be1c69e68b4e0f1860340a2727440f760fb6ae747a7283` |
| `tests/fixtures/adventure.vite.config.ts` | `b7c1a5ee6fef567154147d7633fe539cbb162fca59ca188fc889dfa724fbd8f2` |
| `tests/fixtures/adventure-teardown.ts` | `982c42e272bdef387b73b4e97b34ca8d302c16f923e147410f44bd552680a972` |
| `docs/work-package/execution/D3-ADVENTURE-CI-HANDOFF.md` | `25b289d171056de066df2193874079e6ae2e9ab7281ba0ea2af122881fa4cbff` |

Private reviewer evidence: `C:/Users/alexb/AppData/Local/Temp/d3-adventure-independent-50f9f11ccf2145fba30045c2c0c170f5`, labelled `PRIVATE-PROGRAM-CHECKS-NOT-BROWSER-OR-WORLD-ACCEPTANCE`. Only this report and private outputs were written; unrelated world/shared work was preserved. No Git mutation, external dispatch, other-chat write, delegation or real service/browser operation occurred.

Controller must integrate the coherent world candidate, dispatch adventure only and return its actual identity, six original results, discovery, screenshots/traces/receipts, browser logs and native readiness/host/cleanup metadata. Closure requires six actual passes through the unchanged strict gate. D1, heard audio, physical-device, published-game and broader acceptance boundaries remain separate.
