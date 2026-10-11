# Music variation cache — independent foundation validation

11 October 2026. **SCOPED TECHNICAL PASS for the frozen three-file cache-cap companion.** No cap correction is required. The normal package build remains blocked by 61 unchanged-base TypeScript diagnostics, and the initial author's pnpm invocation did write shared dependency metadata/shims. Those limits remain explicit; this report does not certify an integration build, a published candidate or acoustic acceptance.

Authority is [the human continuation and bounded 10 MiB decision](CONTINUATION-AND-MUSIC-VARIATION.md), with the existing [independent music producer validation](MUSIC-VARIATION-VALIDATION.md). Read the cache owner's handoff in the private candidate; it has not yet been copied into the main checkout.

## Frozen candidate and exact patch

Candidate: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/music-cache-73a920f-036a0260/candidate`.

Base is `73a920f3cbbca7b9e6e4f8071b1029405ab11801`; base archive SHA-256 is `aef0c40de392a92da620a05dea6b36b7d0bc16279e1b0e7a0b6c0b4915b21f54`. Independently verified all **1,611** declared private frozen files against exact byte lengths and hashes, and repeated the preservation guard after fresh checks. Freeze-manifest SHA-256: `d66f51ba9d1e5dac72cb82d17f7b3d40b74a376773b92cfdab17c67fb15ac65c`. This is an ordinary hash freeze, without an authenticated-seal claim.

Each production file equals its accepted-base bytes with exactly the declared numeric replacement:

| Path | Replacement | Frozen after SHA-256 |
|---|---|---|
| `vite.config.ts` | `8 * 1024 * 1024` → `10 * 1024 * 1024` | `29a12a29118474ceaa8dc7925f52cd2fe357a76473157c8b2b412f0e898c7e14` |
| `scripts/check-precache.mjs` | default `8388608` → `10485760` | `a30ccdb1b69e9c5abe1fbaf18c75b77375ef0c05fae1e6c6d0181bf6a0fbc0e5` |
| `tests/fixtures/offline-build.mjs` | numeric maximum `8388608` → `10485760` | `578a54e5eaa71c42f2354670e607be5654482673884508cfd11ccbed831222d1` |

The 2,659-byte integration patch matches SHA-256 `428e9d24f9810c66cbc0956d5f6d083c497de01ef3528d91c555b79c42c7f119`. Content-revision safeguards, helper lifecycle/port/markers and all other bytes in these three files are preserved.

All 32 declared music-overlay records match the original independently validated producer manifest, including 31 copied files and the two-row register merge. The other 70 register rows/order/metadata are unchanged. Worker, platform, shell, package/lock, server and five cue bytes match the accepted base. The cache companion introduces no runtime/audio/save/media repair.

## Larger assets, precache and fresh native proof

| Theme | Actual bytes | Runtime SHA-256 |
|---|---:|---|
| Village | 8,795,040 | `5506aca739cb60aa265ae32823f4444e966fb6179ef27416d271c7e0de55e6a6` |
| Library | 9,395,108 | `cfb28bbd7ac9c6b9241873df2a05691dff6c4387d2df916d79102eccf015acd4` |

Both exceed 8,388,608 bytes and fit the authorized **per-file** 10,485,760-byte cap. Actual root output and A contain the reviewed bytes; B retains the accepted one-byte village marker and unchanged library. Both themes have exact content-MD5 revisions in all three injected inventories.

Fresh executions of the actual checker CLI, with **no maximum override**, pass the frozen root output and both A/B outputs. Each reports maximum 10,485,760, largest asset 9,395,108, and no missing/oversized/out-of-scope URLs. A fresh 8 MiB negative rejects both larger themes. A fresh check of the isolated omitted-manifest build rejects the missing library URL and missing content revision; this malformed output was not served.

The author's five-case receipt, build/check log hashes, failed proof attempts and final native traces were inspected against the freeze. Additionally, a fresh independent **Chrome 155.0.8059.40** headless session at 1366 × 768 used two ephemeral contexts and the frozen real build A at private loopback port 5216. The accepted server was copied into reviewer-private output with only `5196` → `5216`; no candidate files or app/worker implementation changed. Four native cases passed:

1. Real shell Ready, complete active-worker identity `local-offline-a`, then actual network-disconnected reload with Ready. All 49 injected entries resolve to 48 native revision keys; every native cached body matches its built file hash/length. All seven WAVs fetch offline with exact bytes. Both complete themes decode as mono: 99.7165 / 106.52 seconds at the browser's 48 kHz output rate.
2. Deleting the required library native cache key while offline returns `complete: false`, `reason: missing-entry`; the shell refuses Ready immediately and after offline reload.
3. A fresh context receiving actual HTTP 503 for the library theme shows incomplete preparation. A read-only DOM observer records no Ready state; the original server records the failed-media request.
4. Restoring the origin and clicking the real shell **Retry offline preparation** recovers Ready and a complete native inventory.

No broad browser/A→B lifecycle matrix was rerun. Shutdown succeeded, the owned server exited 0, and a final port probe returned `ECONNREFUSED`.

## TypeScript and dependency evidence limits

The author normal `pnpm build` exited 1 at `tsc -b`. Its **61 exact diagnostic lines** match the separate unchanged-base reproduction log and receipt; the errors concern browser DOM names/types in the two playtest specs covered by the ES2023 Node project. This review inspected that reproduction and its frozen archive/source evidence; it did not rerun or repair the normal build. Direct root Vite and accepted A/B helper builds passed, with existing warnings retained. Their success supports this cap proof and does not establish a passing package build. Controller/causal owner must resolve that integration limitation.

The initial pnpm command violated the intended private dependency-write boundary. Reconciliation identifies **195 shared transitive bin shims plus installed `.pnpm/lock.yaml`**, 196 regular files total, within the recorded invocation window; 35 directory mtimes and zero shared symlink mtimes were recorded. No package-source file mtime appears in that window, which is a timestamp observation rather than proof of unchanged payloads.

Independently read and hashed the exact 196 recorded paths: their current bytes match the reconciliation. Main package/lock match captured pre-command hashes and scoped Git status is clean. The installed lock is currently byte-identical to the main tracked lock, 153,432 bytes, SHA-256 `47463db91c336ca0a1e17de10d80880ea0d7bc540af84fd40005604077b1bd04`. Recorded root dependency targets/current package identities remain applicable; main tsc/vite shims still point to the main TypeScript 7.0.2 / Vite 8.3.4 installations.

Shared shim/installed-lock pre-command bytes and internal topology were not captured. Current agreement cannot establish their before/after identity or prove untouched dependencies. No speculative restore, shared cleanup, install, pnpm invocation or timestamp rewrite was performed by this reviewer. The scoped technical PASS relies on actual current executable identities and successful fresh checks, while retaining the incident and unavailable preimage explicitly.

## Reviewer evidence and completion boundary

**36 inspection/checker/preservation checks and four fresh native cases passed; zero failures.** Reviewer output: `C:/Users/alexb/AppData/Local/Temp/music-cache-independent-831d763001dd4d1c94f0da1f5dca67a3`. Key receipts are `final-validation.json`, `fresh-browser-proof.json`, checker reports/negative reports, reproducible probe scripts, fresh screenshots/traces and `review-preservation.json`. All 204 captured main-source/shared-dependency files retained exact bytes through the fresh checks.

Only this main validation report and reviewer-private output were written. No production fix, main/candidate build, Git mutation, deployment, new worker or other-chat message occurred. Controller owns the three numeric edits' coordinated integration and passing final build/offline acceptance. Existing A+B acoustic acceptance remains unverified under the human's deferred final-release gate.
