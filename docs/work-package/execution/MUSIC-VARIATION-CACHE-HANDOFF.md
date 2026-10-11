# Music variation cache companion handoff

The private cap companion passes the actual root Vite/default checker, accepted A/B build helper, and focused native Chrome offline proof. All three authorized numeric defaults are 10 MiB. The normal package build is blocked by 61 independently reproduced unchanged-base TypeScript diagnostics. An initial pnpm invocation unexpectedly regenerated shared dependency shims and installed lock metadata; the exact available evidence and limits are below. This is a frozen review candidate, not an integration or production acceptance claim.

## Candidate and ownership

- Base commit: `73a920f3cbbca7b9e6e4f8071b1029405ab11801`.
- Private root: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260`; candidate is its `candidate/` directory.
- Archive SHA-256: `aef0c40de392a92da620a05dea6b36b7d0bc16279e1b0e7a0b6c0b4915b21f54`.
- Reviewed input manifest: `fd5a4f0455a73e3673ed506cd864f881fe77d2288307fba0cb83002f5539c185` from original owner's `music-variation-6b583495/candidate-files.json`.
- 31 reviewed files copied with exact bytes/hashes; only the village-loop and library-loop registry rows merged into accepted-base registry. Other 70 rows and registry metadata unchanged. Catalogue/recipes/provenance/derivatives are the reviewed overlay, not new cache-worker edits.
- Owned production edits: one numeric replacement each in `vite.config.ts`, `scripts/check-precache.mjs`, `tests/fixtures/offline-build.mjs`; plus this private handoff. The helper's port/lifecycle/markers are unchanged.
- No changes to service-worker/platform/audio/shell/save/media semantics, dependency source configuration or the five cues. Existing `assets/source/audio/licensed/*.html -text` retained unchanged; both new licensed HTML evidence files have exact reviewed bytes.
- The worker made no main source edits, commits, deployment, or new worker delegation. Browser contexts were fresh ephemeral contexts at private loopback port 5214; genuine M1 browser save was not opened or touched.

## Measurements and owned patch

| Theme | Bytes | SHA-256 | Source duration |
|---|---:|---|---:|
| village-loop.wav | 8,795,040 | `5506aca739cb60aa265ae32823f4444e966fb6179ef27416d271c7e0de55e6a6` | 99.7165079365 s |
| library-loop.wav | 9,395,108 | `cfb28bbd7ac9c6b9241873df2a05691dff6c4387d2df916d79102eccf015acd4` | 106.52 s |

Both exceed 8,388,608 bytes and fit 10,485,760 bytes. The limit is per file. All seven WAVs total 19,067,958 bytes. Largest actual required asset: 9395108 bytes; default checker configured limit: 10485760 bytes.

[evidence/owned-cache-cap.patch](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/owned-cache-cap.patch) is the three-file integration patch; [evidence/owned-cache-cap.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/owned-cache-cap.json) pins exact before/after bytes and hashes. Patch: 2659 bytes, SHA-256 `428e9d24f9810c66cbc0956d5f6d083c497de01ef3528d91c555b79c42c7f119`. Apply only these three numeric edits and the handoff. The controller retains registry/media integration authority.

## Executed commands and results

All dependency/tool versions remained the accepted installed identities: Node 24.19.0, TypeScript 7.0.2, Vite 8.3.4, vite-plugin-pwa 2.0.0, pnpm 11.25.0, Playwright 1.64.0. Each build receipt records executable, arguments, private cwd, explicit non-secret environment and log hash.

| Command from private candidate | Result | Evidence |
|---|---|---|
| Node + bundled pnpm CLI `build` | exit 1 at `tsc -b`; automatic setup side effect below | [evidence/normal-build-receipt.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/normal-build-receipt.json), [evidence/normal-build.log](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/normal-build.log) |
| Node `node_modules/vite/bin/vite.js build` | exit 0; actual root config and service worker | [evidence/root-vite-build-receipt.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/root-vite-build-receipt.json) |
| Node `scripts/check-precache.mjs` | exit 0; default max used, no max override; missing/oversized/out-of-scope all empty | [evidence/default-precache-check-receipt.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/default-precache-check-receipt.json) |
| Node `tests/fixtures/offline-build.mjs` | exit 0; actual A/B builds and actual platform observers | [evidence/accepted-offline-helper-receipt.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/accepted-offline-helper-receipt.json), [offline-output/precache-a.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/offline-output/precache-a.json), [offline-output/precache-b.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/offline-output/precache-b.json) |
| Node `reproduce-base.mjs` | all 646 original archive files hash-verified; unchanged base `tsc -b` exit 1; all 61 diagnostics exactly match | [evidence/unchanged-base-typecheck.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/unchanged-base-typecheck.json), [evidence/unchanged-base-typecheck.log](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/unchanged-base-typecheck.log) |
| Node `prove-offline.mjs` | exit 0; five focused cases green | [evidence/browser-proof.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/browser-proof.json) |
| Node `verify-scope.mjs` and `reconcile-dependencies.mjs` | source/overlay/patch checks pass; shared dependency incident reconciled read-only | [evidence/scope-verification.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/scope-verification.json), [evidence/dependency-reconciliation.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/dependency-reconciliation.json) |

The unchanged base reproduction used another extraction of the identical base archive, the same installed dependency targets and compiler, with its own physical `node_modules/.tmp`. No browser-test or tsconfig repair was attempted. Root Vite emitted the existing chunk-size and deprecated-option warnings; these were not hidden.

## Focused native browser proof

Actual Chrome 155.0.8059.40, headless desktop viewport 1366×768, native service workers/CacheStorage/Web Audio. Accepted server was copied outside candidate and changed only 5196→5214. Actual built A and B plus unmodified real platform observer modules were served; no replacement app or mock worker. Only A was exercised in this focused browser proof; no A/B lifecycle matrix is claimed.

1. Native active build/page identity `local-offline-a`; 49 injected inventory entries resolve to 48 native revision cache keys. Every injected entry's actual native cached body matched the corresponding built file SHA-256 and length. Complete probe and real shell Ready succeeded.
2. Network disconnected and actual shell reloaded: Ready remained visible. All seven required audio files fetched offline with exact source bytes/hashes. Both full themes decoded natively as mono with expected durations (browser output-rate resampling allowed).
3. Required library theme native cache key deleted while offline: native probe returned incomplete/missing-entry; shell refused Ready both immediately and after actual offline reload.
4. Fresh context with HTTP 503 on required library theme: initial preparation incomplete and no observer status ever Ready. Restoring origin and using real adapter retry recovered Ready.
5. Separate malformed built-worker copy with library theme removed from injected manifest: real build checker rejected the required missing URL and missing content revision. This invalid candidate was never served; native readiness for an invalid inventory is not claimed independently of its required build gate.

Screenshots: [evidence/ready-offline.png](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/ready-offline.png), [evidence/failed-theme-incomplete.png](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/failed-theme-incomplete.png). Native trace archives: [evidence/complete-and-missing-cache-trace.zip](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/complete-and-missing-cache-trace.zip), [evidence/failed-install-and-retry-trace.zip](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/failed-install-and-retry-trace.zip). The earlier proof attempts had incorrect proof assertions (49 physical keys and stereo channels); they are retained under `browser-proof-attempt-1/2.json` and `proof-attempt-1/2-trace.zip`. The final rerun repeats the complete integrated path and all five cases. No application fix was needed.

Server shutdown endpoint succeeded and its child exited 0. Port 5214 was available before launch and had no listener after completion. No persistent browser user-data directory was used.

## Shared dependency preparation incident — available evidence and limits

The initial normal pnpm build unexpectedly treated the manually linked private node_modules layout as requiring automatic preparation. Original output says lockfile up to date, resolution skipped, already up to date; it also records a failed pnpm updater registry lookup. No separate install command was requested or issued. Through private `node_modules/.pnpm`'s shared junction, pnpm regenerated transitive installed package shims and the installed lock metadata. This violated the intended wholly private dependency-write boundary. Subsequent commands used direct executable/API calls; no further pnpm or dependency-mutating command was run.

- Exact invocation window: 2026-10-11T14:48:14.162Z to 2026-10-11T14:48:16.226Z; metadata scan pads the end by 1 s.
- 196 shared files have mtimes in that window: installed `node_modules/.pnpm/lock.yaml` and 195 regular bin-shim files under `node_modules/.pnpm/<package>/node_modules/<package>/node_modules/.bin/`. Exact paths, byte lengths, current SHA-256 and UTC mtimes are all in [evidence/dependency-reconciliation.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/dependency-reconciliation.json). No package source file mtime fell in that window. 35 directory mtimes changed; zero shared symlink mtimes fell in that window.
- Main `package.json` and `pnpm-lock.yaml` current bytes match captured before hashes. Main pnpm-workspace current text matches archive after CRLF normalization and its mtime predates the command; no raw before snapshot of that main file was captured. Private package.json/lock/workspace bytes still exactly match archive.
- Current installed lock: 153,432 bytes; SHA-256 `47463db91c336ca0a1e17de10d80880ea0d7bc540af84fd40005604077b1bd04`, byte-identical to current main tracked lock. Its prior shared bytes/mtime were not captured, so current agreement does not prove before/after identity.
- All recorded root dependency resolved targets still match their original identities, and actual current package versions/package.json hashes are recorded. Private direct-package junctions were replaced with pnpm's relative symbolic links to the same targets; the private .pnpm junction still resolves to the same shared virtual store. Main internal shared topology before this command was not captured, so absence of internal topology changes cannot be proven solely from current timestamps.
- The shared shim before bytes were not captured. They may contain altered invocation paths; their exact effect on other workers requires controller reconciliation. No speculative restoration, clean, shared dependency deletion, or timestamp rewrite was attempted. This worker does not claim dependency isolation for the initial pnpm command or prove unchanged package payload hashes from an unavailable preimage. Original intended dependency-layout evidence is superseded by the explicit incident reconciliation.
- The earlier two main cache-directory snapshots (19 files each in .tmp/.vite/.vite-temp/.cache) are identical, including hashes/mtimes; direct-build snapshots also match. These narrow snapshots do not cover installed shims and do not erase this incident.

## Unchanged-base diagnostics with exact locations

`tsconfig.node.json` includes `tests/**/*.spec.ts` while its lib is ES2023 without DOM; diagnostics identify browser names/types in the two playtest files. This configuration explanation is a scoped observation, not a repair. The causal owner/controller must resolve the integration build blocker. Exact original and reproduction diagnostics match:

```text
tests/playtest/access-audio.spec.ts(9,15): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(11,20): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(12,5): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(13,57): error TS2304: Cannot find name 'AudioContext'.
tests/playtest/access-audio.spec.ts(23,25): error TS7019: Rest parameter 'args' implicitly has an 'any[]' type.
tests/playtest/access-audio.spec.ts(24,24): error TS7019: Rest parameter 'args' implicitly has an 'any[]' type.
tests/playtest/access-audio.spec.ts(33,16): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(34,43): error TS2304: Cannot find name 'AudioContext'.
tests/playtest/access-audio.spec.ts(35,30): error TS2304: Cannot find name 'GainNode'.
tests/playtest/access-audio.spec.ts(38,17): error TS2304: Cannot find name 'speechSynthesis'.
tests/playtest/access-audio.spec.ts(38,58): error TS2304: Cannot find name 'speechSynthesis'.
tests/playtest/access-audio.spec.ts(139,21): error TS2304: Cannot find name 'indexedDB'.
tests/playtest/access-audio.spec.ts(151,15): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(151,36): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/access-audio.spec.ts(153,38): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/access-audio.spec.ts(154,5): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/access-audio.spec.ts(154,46): error TS7019: Rest parameter 'args' implicitly has an 'any[]' type.
tests/playtest/access-audio.spec.ts(165,15): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(165,36): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/access-audio.spec.ts(167,38): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/access-audio.spec.ts(168,5): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/access-audio.spec.ts(168,46): error TS7019: Rest parameter 'args' implicitly has an 'any[]' type.
tests/playtest/access-audio.spec.ts(194,41): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
tests/playtest/access-audio.spec.ts(194,95): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
tests/playtest/access-audio.spec.ts(195,47): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
tests/playtest/access-audio.spec.ts(216,44): error TS2339: Property 'serviceWorker' does not exist on type 'Navigator'.
tests/playtest/access-audio.spec.ts(216,74): error TS2304: Cannot find name 'location'.
tests/playtest/access-audio.spec.ts(219,23): error TS2339: Property 'onmessage' does not exist on type 'MessagePort'.
tests/playtest/access-audio.spec.ts(219,35): error TS7006: Parameter 'e' implicitly has an 'any' type.
tests/playtest/access-audio.spec.ts(264,137): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(266,30): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(276,120): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(277,32): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(282,46): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(287,149): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(298,39): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(299,33): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(300,48): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(303,46): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(308,38): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(315,49): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(339,36): error TS2304: Cannot find name 'AudioContext'.
tests/playtest/access-audio.spec.ts(366,13): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(366,35): error TS2304: Cannot find name 'AudioContext'.
tests/playtest/access-audio.spec.ts(368,6): error TS2304: Cannot find name 'AudioContext'.
tests/playtest/access-audio.spec.ts(382,44): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(387,13): error TS2304: Cannot find name 'window'.
tests/playtest/access-audio.spec.ts(388,38): error TS2304: Cannot find name 'requestAnimationFrame'.
tests/playtest/access-audio.spec.ts(388,64): error TS2304: Cannot find name 'requestAnimationFrame'.
tests/playtest/access-audio.spec.ts(398,167): error TS2304: Cannot find name 'window'.
tests/playtest/local-boundaries.spec.ts(9,21): error TS2304: Cannot find name 'indexedDB'.
tests/playtest/local-boundaries.spec.ts(61,31): error TS2339: Property 'serviceWorker' does not exist on type 'Navigator'.
tests/playtest/local-boundaries.spec.ts(61,61): error TS2304: Cannot find name 'location'.
tests/playtest/local-boundaries.spec.ts(64,15): error TS2339: Property 'onmessage' does not exist on type 'MessagePort'.
tests/playtest/local-boundaries.spec.ts(64,27): error TS7006: Parameter 'e' implicitly has an 'any' type.
tests/playtest/local-boundaries.spec.ts(219,15): error TS2304: Cannot find name 'window'.
tests/playtest/local-boundaries.spec.ts(219,36): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/local-boundaries.spec.ts(221,36): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/local-boundaries.spec.ts(222,5): error TS2304: Cannot find name 'IDBObjectStore'.
tests/playtest/local-boundaries.spec.ts(222,46): error TS7019: Rest parameter 'args' implicitly has an 'any[]' type.
tests/playtest/local-boundaries.spec.ts(239,60): error TS2304: Cannot find name 'window'.
```

## Freeze and review boundary

[evidence/input-contract.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/input-contract.json) pins the immutable reviewed inputs, exact two-row merge and retained HTML hashes. [evidence/scope-verification.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/evidence/scope-verification.json) establishes the authorized private source delta before this handoff was added. The final freeze manifest pins this handoff and all source/evidence/proof artifacts outside dependency/temp caches. No acoustic endorsement, broad browser regression matrix, production offline acceptance, or independent owner review is claimed here. Controller/original-owner review and truthful reconciliation of the dependency incident remain required before integration. This worker is idle after freezing this deliverable.
