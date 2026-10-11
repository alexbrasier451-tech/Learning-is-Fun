# Browser callback typecheck handoff

The private accepted-base candidate now completes the full root typecheck without a CLI library override. The only source change adds DOM and DOM.Iterable to tsconfig.node.json's existing ES2023 lib list. Strict checking, Node declarations and every existing test file remain included. Root Vite and default precache validation also pass. This is a frozen candidate for independent review; main source, Git and deployment were not changed.

## Base, cause and scope

- Accepted commit: `9485a2cf67b0703deb4efa6c178602dc7952f705` (current HEAD confirmed before extraction).
- Private candidate: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/candidate`.
- Archive SHA-256: `ca1bece08bf6c4e77b719237bedd033e3e923bd3ea004c2d51ae3f83c350dbf5`.
- Unchanged archive reproduced all 61 browser-global/type diagnostics using the full root `tsc -b --force`, without library overrides. Exact source locations and diagnostics are retained in [evidence/unchanged-base-full-typecheck.log](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/unchanged-base-full-typecheck.log) and [evidence/baseline-summary.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/baseline-summary.json).
- The Node project compiles tooling configs plus tests/**/*.spec.ts. The accepted playtest tests contain actual typed callbacks serialized to the browser by Playwright, using window, AudioContext, IndexedDB, service workers, MessageChannel and other browser interfaces. TypeScript checks those callback bodies as part of the enclosing test source; their runtime destination does not supply declaration libraries to the compiler.
- ES2023 describes ECMAScript APIs. Adding DOM supplies the browser interfaces used by those existing callbacks; DOM.Iterable supplies their iterable browser collection interfaces. Existing `types: ["node"]` continues to supply Node declarations used by the same test modules/tool configs. The separate service-worker project retains ES2022 plus WebWorker, and the app project is unchanged.
- Only tsconfig.node.json and this handoff are deliverables. No observer/test/game/audio/service-worker/runtime code, include glob, strictness option, package file or dependency version was changed. No new any, ts-ignore or exclusion was added.

## Exact patch and effective scope

[evidence/browser-typecheck.patch](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/browser-typecheck.patch): 396 bytes, SHA-256 `5de65d333c5a26f28a58e8842741b6c6c04204fe2f39392b218c037b541cba59`. [evidence/patch-contract.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/patch-contract.json) pins the source before/after bytes/hashes. The sole replacement is:

```diff
-    "lib": ["ES2023"],
+    "lib": ["ES2023", "DOM", "DOM.Iterable"],
```

Effective configuration before/after has the same 20 root files and identical include list, and is deeply identical after removing only the lib property. Strict mode and all its effective flags remain enabled; Node types remain. [evidence/before-effective-node-config.log](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/before-effective-node-config.log) and [evidence/after-effective-node-config.log](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/after-effective-node-config.log) retain the full effective configurations. The browser-test root files are: `./tests/playtest/access-audio.spec.ts`, `./tests/playtest/local-boundaries.spec.ts`, `./tests/playtest/starter.spec.ts`.

## Verification

Direct Node executable and installed package entry points were used throughout. No pnpm/package manager, automatic preparation or dependency installation was invoked. The private node_modules root and .tmp/.vite-temp directories are physical directories; package junctions reuse installed package inputs. No shared .pnpm junction or copied bin shim was created. TEMP, TMP and PWTEST_CACHE_DIR point into the private root; Node compile cache is disabled. Exact declared package versions, resolved targets and current package.json hashes are in [evidence/dependency-inputs.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/dependency-inputs.json).

| Command from private candidate | Result |
|---|---|
| Node `node_modules/typescript/bin/tsc -b --force` | exit 0, no diagnostics; complete root app/node/service-worker references |
| Node `node_modules/vite/bin/vite.js build` | exit 0; actual root config and actual injected service worker |
| Node `scripts/check-precache.mjs` | exit 0; normal default max 8,388,608 bytes, no override; missing/oversized/out-of-scope sets empty |

These are the package build's complete three stages run directly, avoiding pnpm setup. Build identity `local-browser-typecheck-9485a2c`, base `/Learning-is-Fun/`. Retained baseline themes are unchanged; largest asset 6,773,804 bytes. No music variation overlay or cache-size companion was merged into this candidate. Existing Vite chunk-size/deprecation warnings remain visible in its log. No browser journey rerun was needed for this declaration-only change.

Receipts and logs: [evidence/complete-root-typecheck-receipt.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/complete-root-typecheck-receipt.json), [evidence/normal-root-vite-build-receipt.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/normal-root-vite-build-receipt.json), [evidence/default-precache-check-receipt.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/default-precache-check-receipt.json). [evidence/verification-summary.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/verification-summary.json) records all assertions.

All three project build-info files are under the private candidate's physical node_modules/.tmp. Full before/after inventory of 15289 shared dependency file/link/directory records matches exactly, including regular file bytes/hashes and mtimes, symlink targets and mtimes, directory mtimes. Snapshots: [evidence/shared-dependencies-before.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/shared-dependencies-before.json), [evidence/shared-dependencies-after.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/shared-dependencies-after.json). No shared dependency write occurred in this verification window. Ten main source/media/package file snapshots also match. The preceding music-cache task's pnpm incident is retained in that separate frozen handoff; this evidence does not retrospectively erase it.

## Freeze boundary

All archive source files are verified unchanged except the single lib declaration; this handoff is the only added source path. The freeze manifest pins source, patch, receipts and reports outside dependency/temp caches. The final read-only main HEAD/status snapshot is [evidence/main-final-read-only.json](C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/evidence/main-final-read-only.json); later main work is preserved. No commit, deployment or worker delegation was performed. Independent original-owner review remains pending; worker is idle after freeze.
