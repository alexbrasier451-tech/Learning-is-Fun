# D3 shell CI — independent tooling validation

9 October 2026. Reviewed the completed [handoff](D3-SHELL-CI-HANDOFF.md), exact workflow/adapter changes, shell Vite wrapper and teardown, and retained private evidence. Production shell implementation, original test behavior and root configuration/build remain outside this review.

**Verdict: PASS for the narrow runner extension; ready for Controller's reviewed-candidate execution with `selection=shell`. Blocking findings: NONE.** Actual four-case shell Firefox execution remains pending. This verdict establishes local runner support, not shell behavior or broader acceptance.

## Selection and launch

The manual choice still defaults to `components` and now permits exactly `components`, `adventure` or `shell`. Fixed count maps agree across Prepare, discovery and result gates: components 3/3/2/2, adventure six, shell four. Private execution verified all three selections, rejected missing/unknown/inherited-property selections before creating roots or exports, and checked selection/counts plus commit/run/attempt metadata. `D3_FIXTURES` is derived only from the selected fixed map; shell runs only its own fixture.

Prepare adds `$RUNNER_TEMP/d3-firefox/shell` while preserving the existing roots. Seven distinct directories—the evidence root and six fixture roots—were verified with paths containing spaces. The same `GITHUB_ENV` propagation supplies subsequent steps. Artifact naming retains selection/run/attempt, and run metadata retains commit identity.

The adapter collects only `tests/platform/shell.spec.ts`, launches the repository root application at `http://127.0.0.1:5195/playtest/`, and supplies `APP_BASE=/playtest/`, `APP_BUILD_ID=local-wp01-02a` and the private shell root. URL-derived cwd and the wrapper's explicit repository root agree. No fixture entry or runtime replacement is added. The development shell runtime and production erasure remain the source owner's responsibility.

Vite uses `--configLoader runner`, port 5195, strict-port and no server reuse. Its inherited configuration/plugins are preserved; cache is under `${SHELL_VERIFY_ROOT}/vite`, results under that root and screenshots/traces under its `playwright` directory. Missing shell root or invalid fixture selection rejects. Existing component and adventure adapter objects/grep expressions compare identically with their predecessor, including operation without a shell root.

One `D3-Firefox` project retains Firefox, default 1280×720, no touch/mobile, one worker, no retries, `forbidOnly`, serial execution and trace/screenshot capture. Shell has a 40-second case timeout; global timeout remains five minutes and the job remains bounded to 30 minutes.

## Teardown, collection and acceptance gate

The wrapper closes its owned server only on POST `/playtest/__d3-shell-close`; GET and unrelated paths continue normally. Teardown requests that same loopback route with a three-second abort bound and tolerates an already-stopped server. Mocked callbacks verified inherited plugins, root/cache paths, exact endpoint, closure and exit behavior, and bounded/missing-server handling. No real fetch, server or browser was used.

Inspected the actual list-only JSON for all three selections. Components remain 3/3/2/2 and adventure six. Shell contains exactly four `D3-Firefox` cases, with report-relative filenames resolved against the captured `rootDir` to the actual `tests/platform/shell.spec.ts`. Titles match its four existing declarations: keyboard/help/Hall/adult/reflow; profile suspension/retry/discard; native audio and failed-read recovery; registry/epoch/disposal. Collection does not establish behavior.

Independent execution of the exact preparation/discovery/result programs passed 25 focused checks. A declared synthetic four-pass shell report accepts. Missing/extra/empty cases, missing report, wrong selection/project, expected failure, failed/skipped attempts, extra attempts, report errors, flaky/skipped/unexpected statistics and missing statistics reject. The gate requires exactly four expected single-attempt actual passes with no errors, failures, skips or flakiness. Synthetic results supply no actual shell evidence.

Workflow step comparison proves only the three selection-aware programs changed; existing execution/logging, matched Firefox setup, native PulseAudio provisioning/readiness, passive host observation, targeted cleanup and artifact upload are identical. Prior accepted native/component evidence and the [adventure runner validation](D3-ADVENTURE-CI-VALIDATION.md) were reused. Browser failure propagation and one-day retention of discovery/results, browser logs, screenshots/traces/attachments and native metadata remain intact.

Reused the actual green strict ES2023/Node no-emit receipt for the three runner files: exit 0 and empty diagnostics. All 102 protected non-owned fingerprints independently match, including the two adventure server helpers. No production source/test edit, root build or broad suite rerun occurred.

## Final snapshot and remaining execution

Final byte counts and SHA-256 hashes match the completed author snapshot:

| File | Bytes | SHA-256 |
|---|---:|---|
| `.github/workflows/d3-firefox-smoke.yml` | 22631 | `412db9fcf7ca0868621d12195298c8ad26fb9a6b98d2f3184a5cdc7146fa933e` |
| `tests/fixtures/d3-firefox.config.ts` | 3471 | `800e316cb85bb483cbb6e2fef5d1d124b84ff3014b2c59b2ce2153a431c376fe` |
| `tests/fixtures/shell.vite.config.ts` | 942 | `5f0abb36b77b7accb555e2d523830c12faa198cb659f9ee0bd6c90ba2ba715be` |
| `tests/fixtures/shell-teardown.ts` | 266 | `a06aaf94291d456b49cf47fde74f82e17c5cbd7cfed1589a24a2381ccbf6a83b` |
| `docs/work-package/execution/D3-SHELL-CI-HANDOFF.md` | 4459 | `6450ce2eff651c8d313ebfba2e0327b916c7f412538f88b0b6b02f355aa0e2bc` |

Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-shell-independent-96af8314a14740588a6abcfb1129fc1f`, labelled `PRIVATE-PROGRAM-CHECKS-NOT-ACTUAL-SHELL`. Only this new report and private outputs were written. Unrelated shared/production work was preserved; no Git mutation, external action, other-chat message, delegation, installation, port-5195 launch or browser operation occurred.

Controller must execute the reviewed coherent production candidate with `selection=shell` and return actual run identity, four original results, discovery, screenshots/traces/receipts, browser logs and native readiness/host/cleanup evidence. Closure requires four actual passes through the strict gate. Local setup checks do not establish production erasure, heard quality, physical-device use, publication, D1 completion or broader M1 acceptance.
