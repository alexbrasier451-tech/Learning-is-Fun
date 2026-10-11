# Offline configuration and portable runner independent validation

11 October 2026. **PASS — F1 correction, root PWA configuration, portable runner configuration/gates, and observed managed cleanup for the retained final Windows run.** No open finding remains in this review's assigned scope. Whole WP01-03A platform acceptance, actual Linux D3, publication and milestone acceptance remain with Controller and their assigned reviewers.

Reviewed OFFLINE-CONFIG-HANDOFF.md, D3-OFFLINE-CI-HANDOFF.md, the narrow WP01-03A configuration requirements and the final WP01-03A-HANDOFF.md evidence. This reviewer wrote only this report and private probes/output. No production/config/test/helper/status/Git mutation, build/server/browser launch, delegation or live port request occurred. Port 5196 now belongs to the fresh independent platform reviewer; retained evidence was used throughout closure.

## F1 correction and final emitted proof

The original [P1] finding was real: vite-plugin-pwa 2.0.0 defaulted dontCacheBustURLsMatching to ^assets/, treating stable public WAV/SVG filenames as versioned URLs. Both original workers emitted null revisions for all 44 ready public assets despite different actual A/B marker bytes. Installed Workbox 7.4.1 produced default HTTP-cache requests for those entries, allowing fresh A responses to populate B. The original no-store server did not exercise that response-cache condition. The [Workbox exemption](https://developer.chrome.com/docs/workbox/modules/workbox-build#basepartial) is intended for uniquely versioned URLs.

The original root owner corrected only its explanatory comment and injectManifest.dontCacheBustURLsMatching: /(?!)/. Removing those two lines recovers the exact reviewed pre-correction root hash. This never-matching expression retains content revisions for every URL. Native waiting, manifest, explicit registration, base/build identity, inventory limit and fixture isolation remain intact. Independent in-memory installed Workbox generation assigns all 44 media content revisions and distinct A/B marker revisions; the author's eleven actual root/dev/fixture resolutions also pass against the frozen source.

**Authoritative final candidates:** C:/Users/alexb/.codex/visualizations/2026/10/09/01a1203e-df35-7f31-9a43-b048c3b4ee83/corrected-11/build-a and build-b. The final worker repair rebuilt this path after an earlier inspection; the closing fingerprint check caught that change, preserved the earlier checkpoint and triggered a complete read-only recheck. Final outputs supersede earlier corrected-11 and integrated-11 hashes.

Fourteen final output/checker/revision/request checks pass:

- Page and worker identity constructors receive /playtest/ and their respective local-offline-a/b IDs; entry HTML, manifest id/start/scope and the ready square SVG icon match.
- Each worker has 49 injected rows / 48 unique URLs, including the identical duplicate webmanifest row. All 48 runtime files and 44 ready public assets are represented: 37 SVGs and seven WAVs, two loops/five cues.
- Every stable public revision is nonempty and equals its actual emitted file's MD5. Both changed WAV/SVG marker SHA-256 bytes and content revisions differ A/B.
- The actual installed Workbox controller, supplied the final injected A/B lists, produces reload requests and matching revision cache keys for every stable public asset. Strategy interception occurs before network/CacheStorage; this is actual request production, not a browser claim.
- Largest measured file is 6,773,804 bytes; configured maximum is 8,388,608. Vite mapping is emitted and excluded from precache. No observer/test support, source bulk, automatic registration helper or unsafe activation call is emitted.
- Both real checker CLI reports exactly match the supplied positive reports. A bound one byte below the largest WAV fails with exit 1. Full final output fingerprints remain unchanged through inspection and the closing check.

The exact F1 regression is now guarded: a private copy of final A changed only the village-loop manifest revision to null. URLs, coverage, scope and asset bytes stayed valid, but the actual checker exited 1 with “Required public asset lacks a content revision: assets/audio/village-loop.wav”. Original outputs remained unchanged.

## Configuration and portable runner

Root production builds use the installed supported injectManifest strategy from src/sw.ts, injectRegister false and prompt mode. Development omits PWA; all nine imported fixture builds disable it through the synchronous supported integration hook before option resolution. The worker producer copies page defines/base and invokes the explicit worker hook before build. Required HTML/JS/CSS/JSON/art/image/WAV/webmanifest patterns, .vite exclusion and 8-MiB per-file cap are explicit. No autoUpdate, skipWaiting, SKIP_WAITING handler, clientsClaim or forced reload is configured. This fits the [custom-worker strategy](https://vite-pwa-org.netlify.app/guide/inject-manifest).

The package command is pnpm typecheck && vite build && node scripts/check-precache.mjs. Environment/base/maximum/report defaults align. The author's private exact command-chain control uses copied actual A, successful explicit stand-ins for preceding typecheck/Vite, and the actual no-argument checker: intact A exits 0; removing the required loop exits 1. This verifies propagation, not compilation. This reviewer also executed the actual checker against final emitted output without building.

OFFLINE_OUTPUT must be absolute, outside the repository and unable to contain it. Missing/relative/repository/child/ancestor roots and unsafe or overlength run suffixes are rejected. Canonical and safe suffixed evidence paths pass; D3 intentionally ignores the local suffix. These are lexical path-contract checks.

Managed startup runs the actual build/check helper then server, repository cwd, loopback 5196 /playtest/ readiness, no reuse and 180-second startup bound. One worker, no retries/parallel execution, forbidOnly, 90-second cases and traces/screenshots are retained. D3 offline has ten minutes globally; other selections retain five minutes. Local Chrome/Edge channels, touch projects and geometry match their contracts; D3 replaces them with the single matched Firefox project.

Fresh list-only discovery against the final source passes: local 16, four per D1/D2/T1/T2 project; D3 offline 4 from the actual offline-update.spec.ts. Both resolve the real shared teardown. Existing components 3/3/2/2 (10), adventure 6 and shell 4 remain preserved. Adapter comparisons retain existing owner commands/teardowns and grep expressions when the offline root is absent.

The workflow consistently maps offline to 4 in prepare/discovery/actual-result gates, retaining components as default. Independent synthetic gate models reject unknown selection, missing/extra tests, errors, wrong project, expected failures, failed/skipped/missing/extra attempts and incorrect expected/unexpected/flaky/skipped statistics. These validate gates only. Eleven predecessor workflow steps, commit/run/attempt identity, environment, matched Firefox installation and native PulseAudio readiness/module identity/logging/observation/cleanup remain unchanged. Compact artifacts add the build contract, precache reports and server-cleanup receipt with accepted retention.

## Observed managed Windows cleanup

[Playwright documents](https://playwright.dev/docs/test-webserver) that graceful signals are ignored on Windows. Installed 1.64.0 follows that rule and falls back to process-tree termination; Linux uses the configured process-group SIGTERM/grace timeout. Static settings did not prove cleanup: earlier surviving child servers were preserved as failed evidence.

The original runner owner added shared offline-teardown.ts. After successful server setup, it POSTs the existing private loopback shutdown endpoint with a three-second bound and records requested/rejected/unconfirmed status. Installed task ordering runs this hook before web-server process cleanup and does not reach it after refused startup. Independent HTTP-success/rejection/interruption mocks and isolated types pass. No live POST was made by this reviewer.

**The final retained Windows run closes the observed cleanup boundary.** Its report is corrected-11/results-final-owner-verified-matrix.json: 16 passed, four original groups per project, zero errors/skips/flaky outcomes/retries and one passed attempt each. The owner reports normal runner exit 0 without manual shutdown. Loaded config resolves the shared teardown. The cleanup receipt records HTTP 200 / shutdown-requested at the end of that same matrix.

The author's final-verification-receipt.json matches the exact matrix statistics and cleanup receipt, then records owned server PID 24112 as ESRCH and port 5196 as ECONNREFUSED. Its retained final-receipt.mjs shows the post-run PID/connection checks. This reviewer read those receipts without probing the currently leased port. This accepts the observed Windows run; it does not claim actual Linux D3 cleanup or universal host behavior.

## Platform evidence boundary

The first green matrix was invalidated by a later genuine WebKit B-next-launch/cache failure. That history remains retained. The author subsequently repaired ownership of unused failed-install caches, supplied three passing fresh WebKit sequences and the final matrix above, and froze the final source. This review consumes that final matrix for selected-case/runner and F1 response-cache evidence; the separate fresh independent platform reviewer owns causal worker/cache/lifecycle acceptance.

Final attachments record real Chrome/Edge/Chromium retaining HTTP-fresh A after the origin switches to B, while WebKit refetches B and reports that difference. Actual origin B marker hashes differ from A and final next-launch media comparison passes. These are real original-flow observations. A successful-B request log may legitimately reuse correctly revisioned B entries fetched during an earlier failed B install; a private review assertion was corrected to account for that phase.

No whole-child, D3 browser, published-origin, native-install or acoustic acceptance is granted here.

## Evidence and final freeze

Private reviewer root: C:/Users/alexb/AppData/Local/Temp/offline-config-independent-fb9662d4870d412d82b26e4567917b14.

- review-results.json: 73 independent config/path/preservation/discovery/gate checks; earlier runner/source checkpoints remain saved.
- types-syntax-results.json: strict no-emit root/runner/teardown typecheck and all six current inline Node syntax checks pass.
- f1-source-results.json: exact two-line correction and installed in-memory 44-media revision proof.
- fresh-f1-output-proof/emitted-results.json and f1-regression-results.json: final rebuilt output/request proof, fingerprints and exact real checker rejection.
- fresh-f1-output-proof/actual-results-review.json: final actual matrix/cache attachments and matched retained native cleanup receipt.
- fresh-f1-output-proof/final-discovery-review.json: final local/D3 lists and source fingerprints. 101 of the original 102 protected fingerprints match; only the explicitly authorized F1 root correction differs.
- fresh-f1-output-proof/final-supported-scope.json: closing seven-file freeze/output checks and this exact scoped PASS. pre-final-worker-recheck/ retains the prior superseded output checkpoint.

The private probes' initial cross-realm equality and support.wav directory-match false positives were corrected without production changes. The freeze mismatch was a real authorized output rebuild, not a harness defect.

| Final config path | Bytes | SHA-256 |
| --- | ---: | --- |
| vite.config.ts | 2991 | a290f843a4db470484dd9fccf27e75cb7de7d63c545e6657c3a2c80feabb5954 |
| package.json | 892 | edcbf80fc7ec644fc64306e417fa61ed2862a0b7541c0fbaac85f6434943fb58 |
| tests/fixtures/offline-runner.ts | 1757 | 3b5cab2f025b974571b6a3583a9a73bf9f513befb66829c05f3025e57c53cc4e |
| tests/fixtures/offline-teardown.ts | 1195 | 61580783f218aed1b1ebb2011e4bf0e781eb2d8ae6e2dc74539982e7f5931dc1 |
| tests/fixtures/offline.config.ts | 711 | dd7d35041b0e010aceecb9e604a72f1f32d8237703115d691dd25af9555c2b43 |
| tests/fixtures/d3-firefox.config.ts | 3773 | 4a507cd181c870dd20e5f65393d7df2c16481c1f4d1f723f593bf655419790a4 |
| .github/workflows/d3-firefox-smoke.yml | 23002 | 61a7c1b3d8b65aed35423fa06d2d8ed285cacb4b82b3d9964cb5fddb47766869 |

Controller owns integration, final platform/D3 acceptance and Git.
