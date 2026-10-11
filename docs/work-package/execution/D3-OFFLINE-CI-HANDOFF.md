# Production offline runner and D3 handoff

11 October 2026. **Runner configuration ready for the original independent tooling reviewer. Actual production/browser acceptance remains pending Controller's source freeze and port lease.** Human resumption was explicitly relayed by Controller. No build, server or browser was run by this owner during this continuation.

## Final frozen teardown contract for the owner's next run

Controller has acknowledged the F1 root freeze and assigned the offline owner one fresh integrated A/B build and complete matrix/ordinary-HTTP-cache variant. Use the existing `offline.config.ts` and absolute new `OFFLINE_OUTPUT`; optional `OFFLINE_RUN` only suffixes test reports/traces. This same run should prove managed teardown; no competing configuration-owner run is needed.

Both local and D3 configs resolve global teardown to `tests/fixtures/offline-teardown.ts`. After successful managed startup and the cases, it issues one POST to the existing private `http://127.0.0.1:5196/__offline-shutdown`, with a three-second AbortSignal. It writes `${OFFLINE_OUTPUT}/server-cleanup.json` before Playwright's managed process teardown. The receipt records endpoint/request time, HTTP status when received, and `shutdown-requested`, `shutdown-rejected` or `shutdown-unconfirmed`. A connection closed by the helper before fetch receives its response can yield unconfirmed status; the receipt alone never asserts process removal. The artifact path is retained in D3. Signal/process cleanup remains the supported fallback, including the existing five-second grace bound on supported hosts.

Native closure evidence should retain the helper's actual startup `pid` and `parentPid`, the loaded config/command and private output identity, original test results/normal runner completion, cleanup receipt, and a post-run check that the owned server PID and port 5196 listener are gone. If targeted manual cleanup is still necessary, retain that failed managed attempt and report cleanup as open rather than using the manual stop as a passing runner proof. No unrelated process or user session should be stopped. The helper remains offline-owner owned; its endpoint is never injected into production output.

Frozen teardown SHA-256: `61580783f218aed1b1ebb2011e4bf0e781eb2d8ae6e2dc74539982e7f5931dc1`. The configuration owner has not made a live request or launched any run. Original reviewer recheck and the offline owner's native result are pending; final fresh injected-output proof follows the owner's new immutable path.

## Owned delta and real helper contract

Owned runner changes: new `tests/fixtures/offline-runner.ts`, `tests/fixtures/offline.config.ts` and `tests/fixtures/offline-teardown.ts`, updated `tests/fixtures/d3-firefox.config.ts` and `.github/workflows/d3-firefox-smoke.yml`, this handoff and the existing `OFFLINE-CONFIG-HANDOFF.md`. Existing root config/package edits remain frozen. No helper, spec, worker, shell, asset, dependency/lock, status or Git write was made.

The inspected offline-owner helpers are `tests/fixtures/offline-build.mjs` and `offline-server.mjs`. The former builds the actual root application into private A/B outputs with `/playtest/` and `local-offline-a/b`, runs the real inventory checker, and changes a WAV sample/SVG colour only in private B public output. It builds observers from the actual platform APIs outside the app scope. The latter serves those built files on loopback 5196, without missing-file SPA fallback, and owns the existing candidate/failure controls. It handles SIGTERM/SIGINT. Neither helper was edited or executed by this configuration owner.

The shared configuration requires absolute `OFFLINE_OUTPUT`, outside the repository and unable to contain it. Local `OFFLINE_RUN` is an optional bounded filename suffix: JSON goes to `results-<run>.json` and Playwright evidence to `playwright-<run>/`; no suffix uses `results.json` and `playwright/`. D3 deliberately uses canonical unsuffixed paths regardless of local `OFFLINE_RUN`.

Managed startup runs `node tests/fixtures/offline-build.mjs && node tests/fixtures/offline-server.mjs`, so failed building/checking prevents server startup. Readiness is the actual built `/playtest/` index. Startup allows 180 seconds, server reuse is false, and Playwright owns process teardown with SIGTERM and a five-second grace period on supported hosts. Windows graceful signals are unsupported. The offline owner subsequently demonstrated surviving Windows child servers at suite completion and added/tested private POST `/__offline-shutdown`. The new shared global teardown requests that existing endpoint with a three-second bound before process cleanup and records requested/rejected/unconfirmed status in `server-cleanup.json`. Playwright registers global teardown after successful server setup, so a refused port/startup does not send this POST. No live request was made by this owner; native repaired lifecycle still needs the Controller's lease. Test endpoints remain absent from dist.

## Selections and bounds

| D3 manual selection | Exact selected cases |
|---|---|
| `components` — default | adult 3 + Hall 3 + audio 2 + creative 2 |
| `adventure` | 6 |
| `shell` | 4 |
| `offline` | `tests/platform/offline-update.spec.ts` 4 |

All four original offline groups are selected: disconnected cached M1/help/media/save reload; two actual A clients through failed/waiting B and subsequent launch; interrupted preparation/cache loss/timeout/disposal; unavailable registration/fullscreen with online gameplay. The offline author retains their behavior and evolving assertions. No successful substitute fixture was created.

Local projects are `D1-Chrome`, `D2-Edge`, `T1-Chromium-touch` and `T2-WebKit-touch`, four groups each; select a project for its individual run. D3 replaces these with the existing single matched `D3-Firefox` project. Shared bounds are one worker, zero retries, no parallel execution, `forbidOnly`, 90 seconds per offline case, and screenshots/traces enabled. D3 offline gets a ten-minute global bound for A/B preparation plus the four cases; other D3 selections retain five minutes. CI retains its 30-minute job limit.

Prepare exports `OFFLINE_OUTPUT=$RUNNER_TEMP/d3-firefox/offline`. Discovery and result gates independently enforce `offline: 4`, project `D3-Firefox`, no errors/skips/failures/flaky results, expected passed status and exactly one passed attempt. Selection/commit/run/attempt identity and the accepted native-audio provisioning, logging, readiness, observation and cleanup steps remain unchanged. Existing evidence retention adds the helper's `build-contract.json`, `precache-*.json` and `server-cleanup.json`; full A/B asset payloads are not uploaded. Direct D3 discovery still needs the four imported legacy owner roots; other selections work without `OFFLINE_OUTPUT`.

## Verification and next boundary

Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-offline-ci-MgyH9M`. Native YAML parsing, six inline Node syntax checks, isolated strict typechecking of the three runner TS files and actual discovery passed. D3 counts are 3/3/2/2, 6, 4 and 4; local discovery is four per project. Eleven unchanged workflow steps were compared structurally with the accepted pre-change workflow. Twenty-four checks covered synthetic result gates, unknown selections, missing/relative/repository output roots, suffix validation and managed configuration. Synthetic reports validate gates only; they are not offline/browser acceptance evidence. Final protected fingerprints and owned hashes are in `final-validation.json`.

Continuation evidence: `C:/Users/alexb/AppData/Local/Temp/offline-proof-6ZLvfj`. The immutable integrated A/B outputs independently passed identity/base, manifest, complete inventory and metadata-exclusion checks. Actual checker package exit propagation passed via a private copy/control; earlier typecheck/build commands were explicitly stood in, with no rebuild. Three mocked teardown cases and its strict isolated typecheck passed; no live request was made. The reviewer confirmed F1's unrevisioned stable media. Controller subsequently authorized the root correction: the exemption now matches no URL, preserving content revisions for all precache files. Root typechecking and eleven configuration resolutions passed; an in-memory installed Workbox probe gives 44 public media content revisions per preserved candidate and different changed-marker revisions. Correction evidence is `C:/Users/alexb/AppData/Local/Temp/offline-f1-config-1GnSTy`. Fresh injected output, actual media freshness and native teardown remain unaccepted until their complete leased reruns. See `OFFLINE-CONFIG-HANDOFF.md` for the before/correction evidence.

Controller retains the active 5196 lease and must authorize the native repaired-teardown run. The original tooling reviewer checks the coherent final configuration delta, including any confirmed root correction. Controller owns any D3 dispatch and final browser/production acceptance.
