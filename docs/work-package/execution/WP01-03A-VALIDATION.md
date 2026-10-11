# WP01-03A — independent platform validation

11 October 2026. **Technical platform review PASS for the frozen local candidate; no actionable P1/P2 findings.** The final native matrix and fresh independent cases support complete offline caching and safe native next-launch updates. Actual Linux D3, Controller acceptance, dependency release and publication remain outstanding and Controller-owned. This report grants none of those approvals.

**Port 5196 released.** The independent two-case run exited 0 through managed teardown. A subsequent TCP connection returned ECONNREFUSED and the positively identified reviewer server PID 53800 returned ESRCH. No reviewer browser/server remains.

## Scope and evidence identity

Read the child criteria, final WP01-03A-HANDOFF, actual platform/worker/checker/helper/spec source, and installed Workbox implementation where needed. Consumed OFFLINE-CONFIG-VALIDATION's exact F1 correction/emitted/request evidence and OFFLINE-SHELL-VALIDATION's presentation, save-composition and fresh race evidence; did not repeat those broad audits. Historical planning prohibitions and earlier green results are not treated as current execution disposition.

Author evidence **E**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a1203e-df35-7f31-9a43-b048c3b4ee83`.

Independent evidence **R**: `C:/Users/alexb/.codex/visualizations/2026/10/11/01a1295d-1de3-71b3-9e5e-10cb066e1842`.

Used the frozen actual application at `E/corrected-11/build-a` and `build-b`, IDs `local-offline-a/b`, same origin `http://127.0.0.1:5196`, scope `/playtest/`. No candidate rebuild or mutation occurred. Before/after checks match all 16 executable/configuration/asset-register source fingerprints in E/source-and-final-inventory.json; both emitted worker hashes and every supplied public-asset hash also match after the native run.

| Platform-owned file | Reviewed SHA-256 |
| --- | --- |
| src/platform/pwa.ts | 20a0214e3cc1e905fa3322c28458a03d66e4d8cf6997113d3a627cb558b164a0 |
| src/platform/fullscreen.ts | f5cb213b0c43fc8fbaddd24a02d91c4e04fe7a85ff4ae35b7b9f78ba9e81b0f4 |
| src/sw.ts | c7b573f959e55d7b0d588e7cf6fcb3f168a0683f06588daeab453ed2fffd469e |
| scripts/check-precache.mjs | b3b2a92fd167e902ddd55576f3bb50ae1f1b78d4f091f17b795e12cbb1585f4e |
| tests/platform/offline-update.spec.ts | 074f1f2a6e142ee684ba61d2fdad90918dc3b84f3d12a9674ca39eb90f3f074e |
| tests/fixtures/offline-build.mjs | 5c63b92b6a6a2eea1119e8be520efbc4ef61c7f0e9691f408508c111bffcef36 |
| tests/fixtures/offline-server.mjs | 1b849ba086ce2b7cba25432570167fc87b9cc376d0f930ad964713ebf0ec9a20 |

Documentation receipt note: the inventory's handoff-document hash is `c8cd953ea06687e59598d8deaecaf3abf9bc9205b36214ee0d66bfcb741486b2`, whereas the final handoff read after Controller release hashes `9443f8d55ba7fb4522dac76d13855ded587a9933a17e8a7240b8ab40f792e5d8`. The final verification stopped on that mismatch until the document was distinguished from executable source. Both values are retained in R/independent-final-receipt.json. This is a stale documentation fingerprint, not a changed executable candidate; the author can refresh that receipt without rerunning native tests.

## Source and contract assessment

Readiness probes address the captured active and waiting ServiceWorker objects independently. Request IDs, generation checks and captured object comparisons discard obsolete results; visibility/controller changes immediately withdraw prior readiness. The matching active build must report every revision-key response present, successful and readable. A waiting B identity cannot make incomplete A ready. Timeouts/malformed responses do not assert readiness. Retry can recover a removed first-install registration, and disposal gates callbacks, cancels pending channels and removes listeners without removing registration, cache or save data.

The final worker repairs the producing cache boundary. If its build cache already exists, it positively obtains active/waiting owners' build identities before clearing only that unowned exact cache. A matching owner preserves it; failed ownership probing rejects installation before deletion. Workbox still owns manifest/download/revision operations. Fetch uses that worker's cache revision without a network fallback, is bounded to same-origin app GETs, and aliases only the app entry navigation. Activation removes only obsolete valid-build caches under the exact app prefix. No skipWaiting, clientsClaim, activation command, page reload or save authority exists.

The inventory evidence covers 49 injected rows / 48 unique URLs, 44 public assets (37 SVGs and seven WAVs), all emitted application chunks and the icon. The WAVs are village-loop, library-loop, pickup, placement, support, success and restoration. The largest measured file is library-loop.wav at 6,773,804 bytes, below the explicit 8,388,608-byte bound. Required public revisions are nonempty; actual B WAV/SVG bytes and revisions differ from A. Checker negative reports reject missing loop, oversized loop, out-of-project entry and unrevisioned public asset; earlier missing-identity/external-icon rejection evidence remains available. Config F1's separate independent checks establish actual installed Workbox reload request semantics. The portable helpers retain private controls/support outside the published app.

## Actual author results independently decoded

R/review-evidence.cjs reads the actual JSON attempts and embedded scenario receipts, producing R/evidence-decoded.json. `E/corrected-11/results-final-owner-verified-matrix.json` has exactly **16 passed attempts**, four original groups in each D1 Chrome, D2 Edge, T1 Chromium touch and T2 WebKit touch, retry 0, no skipped/flaky/unexpected results or report errors. Author typecheck/build/inventory evidence is consumed; no new package-wide tests were run by this reviewer.

The receipts and original assertions cover disconnected M1 completion, hints, all seven media responses, saved-profile reload and Hall; interrupted initial preparation with continued online play and successful native retry; missing active loop, timeout, delayed genuine stale success and disposal; unavailable service worker and optional fullscreen fallback/exit. The update sequence retains A through failed B and complete waiting B, withholds activation after closing only one of two actual A clients, and activates B after both close. Required-loop removal makes A incomplete while B remains complete. Native failed suspension and pending/failed preference acknowledgements withhold close instructions and recover through producer-owned retry. Exact committed saves, build/media identity and unrelated cache/IDB sentinels survive next launch.

Preserved history matters: the old `results-final-local-green.json` passed before the additional next-launch observation exposed WebKit failure. `results-final-update-audio.json` contains that red result. The final `results-update-cache-owner-fix.json` contains three fresh complete WebKit successes with explicit waiting/activated inventory probes. The later final 16-case matrix, not the old green matrix, supports this verdict. No failed evidence was overwritten by the reviewer.

## Fresh independent native and contract cases

After explicit Controller release, ran R/native-review.config.cjs against the unchanged frozen A/B using one browser worker and fresh isolated contexts: **2 passed in 24.2 seconds**, Chrome and WebKit, zero retries/skips/flaky/unexpected/errors. The private spec preserves the original complete failed-B/two-A-client input and assertions and extends the actual B launch. It does not replace the application or fake worker/save readiness.

After B becomes active, each case requires the real Ready offline UI and River chooser, disconnects the context, opens River's actual adventure, verifies remembered Silence all and both individual mute switches, explicitly exits Silence all while both channels stay muted, restores Silence all, resumes the saved library activity and requests a visible written hint. The complete pre-gesture save equals A's committed save. The resumed UI retains the saved question mark; observed B page/active identities match, waiting is null and inventory is complete. B media hashes equal actual origin B. The original unrelated cache/store and obsolete-A-cache assertions still pass.

Chrome has a real AudioContext after the explicit gesture, with **zero decoded buffers and zero source starts** through muted resume/hint. WebKit reports AudioContext unavailable and zero starts; it is fallback evidence only. This supplements the author's cold-launch zero-start checks with an actual rendered and interactive B application. No acoustic/listening inference is made, and the approved source music/art pair was unchanged. Visually inspected R/review-WebKit-B.png: the real application, saved library draft, written hint, Ready offline and Silent controls are present.

R/worker-contract.cjs executes the actual stripped worker source with isolated API mocks: **11 passing contract checks** cover orphan first-install cleanup, failed B with active A, active-B/waiting-B cache preservation, owner timeout/post failure without deletion, absent target cache, exact activation namespace boundary, missing loop, unreadable body and missing-entry fetch returning an error without network fallback. These are focused branch checks, explicitly not native browser/cache acceptance.

Reproduction/evidence: R/prepare-native-review.cjs, native-review.spec.ts, native-review.config.cjs, native-results.json, native-output traces, extracted B screenshots, worker-contract-results.json and independent-final-receipt.json. The final receipt records managed HTTP-200 shutdown, refused port, absent owned server PID and unchanged executable/candidate fingerprints.

Only this report and private evidence were written. No production/spec/config/other-report/status change, Git operation, installation, deployment, messaging or delegation occurred. Local technical review is complete; actual Linux D3 and all administrative acceptance remain with Controller.
