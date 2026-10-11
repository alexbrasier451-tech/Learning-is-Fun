# WP01-03A root configuration handoff

## Confirmed F1 producer correction — 11 October 2026

Controller supplied the original reviewer's confirmed F1 [P1] and authorized its root-owner correction. **Correction applied and source frozen; fresh integrated output and complete lifecycle recheck remain pending.** `injectManifest.dontCacheBustURLsMatching` now uses the never-matching `/(?!)/` expression, overriding vite-plugin-pwa's broad `^assets/` exemption. All precache URLs retain content revisions, including stable public art/audio. This deliberately removes the optimization for hashed output too; it avoids inferring which filenames are content-versioned. Native waiting, cache namespace, registration, identity/base, inventory cap, manifest and fixture isolation are unchanged.

Isolated strict root-config typechecking and all eleven actual root/dev/fixture configuration resolutions passed. A read-only, in-memory installed Workbox `getManifest` probe used the corrected literal policy against the preserved A/B public media. Each candidate produced 44 nonempty content revisions. WAV marker revisions are `a02bc067fb79188d28dd613501a54974` / `d9fb85e53cc4f8b7e8cf28e1e8fbb0e0`; SVG marker revisions are `73359e0f44eff3ed13c96020a65905b5` / `8a4c7eac1b87a6854a30d5faa3319d78`. This verifies deterministic producer policy without compiling, injecting or rewriting either old worker. It is not a fresh emitted-output or browser acceptance claim.

Private correction evidence: `C:/Users/alexb/AppData/Local/Temp/offline-f1-config-1GnSTy`, including `f1-config-checks.json`, `in-memory-stable-manifest-a/b.json`, root typecheck receipt and `final-validation.json`. Previous old null-revision workers/evidence remain preserved. The teardown repair stays frozen; no live endpoint request or native managed-cleanup claim was added.

After both root and platform freezes, the offline owner will produce one fresh integrated A/B pair. Required closure is the original complete two-client/waiting/next-launch/media-freshness flow plus focused variants and the complete required regressions, verified actual revised install requests and independently rechecked emitted inventory. Controller retains the active WebKit investigation/5196 lease; this owner performed no build/server/browser run and did not change reviewer/status/Git files.

Controller acknowledged this root freeze and routed one fresh integrated build/full regression/ordinary-HTTP-cache variant to the offline owner. The runner/teardown remains frozen for that same run and the original reviewer. The final native cleanup contract and requested PID/port evidence are recorded at the top of `D3-OFFLINE-CI-HANDOFF.md`; no separate competing run is needed. Final emitted-output proof will consume the owner's new immutable path.

## Immutable output proof and teardown repair — 11 October 2026

Read-only reuse of the offline owner's fresh `integrated-11/build-a` and `build-b` established emitted page/worker identity (`local-offline-a/b`) and `/playtest/` base from actual parsed identity calls, scoped manifest and exact SVG icon, complete matching inventory reports, seven WAVs/37 SVGs, measured largest file 6,773,804 bytes below 8,388,608, and emitted `.vite/manifest.json` excluded from precache. Both workers contain 49 injected rows/48 unique required URLs, including the plugin's identical duplicate webmanifest row. No automatic registration asset, skipWaiting, clientsClaim or observer/source bulk was emitted. No rebuild was performed.

The exact root package script was executed in a private command-chain control against a copy of real A output with the actual checker and its no-argument defaults. Explicit stand-ins returned success for the preceding typecheck/Vite commands; this is exit-propagation verification, not a compilation claim. Intact copied A returned exit 0; removing its required library-loop WAV produced a missing URL and package exit 1. Original A/B outputs remained untouched.

**Root correction held for independent reviewer confirmation:** the reviewer identified potentially stale stable-public assets because the plugin regards all `assets/` URLs as versioned. This owner observed that the WAV/SVG B markers have different actual SHA-256 hashes but `revision: null` in both workers. Inventory completeness/identity proof does not close asset freshness or whole-PWA acceptance. No root-config change was made while the offline owner traces the frozen WebKit case.

The offline owner's concrete Windows lifecycle evidence records two completed suites whose child server survived Playwright's signal/process teardown. The helper owner added and tested private POST `/__offline-shutdown`. This owner now wires it through `offline-teardown.ts`, before Playwright's server process cleanup, with a bounded three-second request and `server-cleanup.json` receipt. Actual mocked checks cover requested/rejected/interrupted outcomes without a network request; native managed teardown remains pending a Controller-leased run. The endpoint is outside dist and never contacts the published app.

Private proof root: `C:/Users/alexb/AppData/Local/Temp/offline-proof-6ZLvfj`. Read-only emitted evidence, checker receipts, held revision observations, isolated strict runner typecheck and mocked teardown outcomes are retained there. Runner teardown source is frozen for Controller/reviewer; no live endpoint request, build, browser or server was performed. Root caching correction and native teardown acceptance remain open.

## Resumed runner continuation — 11 October 2026

Controller explicitly relayed human resumption. The original app-icon reviewer now reports PASS and the actual ready icon/register and two count expectations are in place. Root configuration/package source edits remain frozen from the 9 October handoff below; no production-output proof is added by this continuation.

Added the shared actual-production runner in `tests/fixtures/offline-runner.ts`, local D1/D2/T1/T2 `offline.config.ts`, and D3 `offline` selection with exact four-case discovery/result gates. This consumes the offline owner's existing `offline-build.mjs` and `offline-server.mjs`; those helpers remain owner-controlled. The new runner and evidence are detailed in [D3-OFFLINE-CI-HANDOFF](D3-OFFLINE-CI-HANDOFF.md).

Actual discovery, isolated runner types, native YAML/inline-script syntax and private synthetic gate checks passed. No server/browser, current-source production build or shared-dist operation ran. Controller subsequently confirmed the shell source/spec freeze and accepted the icon/count integration (72 inventory rows, 37 public SVGs; 20 catalogue checks reported PASS by Controller). The offline owner is building fresh private integrated A/B and retains port 5196. Production proof remains pending those final emitted outputs, with actual candidate evidence reused where adequate: emitted page/worker identity/base, inventory completeness, metadata exclusion and package checker failure propagation. This owner will not launch a competing build or server.

Private continuation evidence: `C:/Users/alexb/AppData/Local/Temp/d3-offline-ci-MgyH9M`. The original independent tooling reviewer must check this final coherent configuration delta before Controller acceptance. Dependencies/lock, assets/producers, helper/spec source, status and Git remain preserved.

## Original frozen configuration handoff — 9 October 2026

9 October 2026. **Configuration source edits frozen; ready for the next shell presentation handoff.** Production-output verification awaits icon and worker/checker readiness. Controller owns integration, acceptance and Git. Starting accepted shell candidate: `da2d39f737a4eec56c523725846929ccc3e87418`.

## Exact request and ownership

Configure root production builds for `VitePWA` injectManifest from `src/sw.ts`, explicit page registration, an 8,388,608-byte per-file precache maximum, a project-scoped install manifest, `.vite/manifest.json` emitted-input mapping, identical page/worker build identity and base, and an inventory checker after Vite. Keep development and existing fixture builds isolated. No automatic update/registration, skipWaiting or clientsClaim.

Owned implementation paths are `vite.config.ts`, `package.json` and necessary existing root TS/build configuration. This handoff is the requested execution record. Worker/PWA/shell source, checker source, public assets, asset register, fixtures, dependencies and unrelated files remain with their owners.

## Inspected inputs and bounded plan

The current root configuration validates `APP_BASE` and `APP_BUILD_ID`, defines the page build ID, uses React and `index.html`, and binds local servers to loopback. Package dependencies already pin Vite 8.3.4, vite-plugin-pwa 2.0.0 and Workbox 7.4.1. The root TS references already separate DOM application code from the WebWorker project; no TS change is currently required.

The installed PWA implementation copies page defines and resolved base into its separate worker build. Its synchronous `integration.configureOptions` hook runs before option resolution, so it can disable PWA behavior when the resolved command is development or the resolved config file is an existing fixture wrapper. This needs focused resolution checks before acceptance. Official strategy documentation: [injectManifest](https://vite-pwa-org.netlify.app/guide/inject-manifest).

1. **Applied:** `build.manifest: true`; entry, base and identity validation remain intact.
2. **Applied after concrete contract arrived:** injectManifest with `srcDir: 'src'`, `filename: 'sw.ts'`, `injectRegister: false`, prompt registration mode, and project base for `id`/`start_url`/`scope`. The sole icon is `${base}assets/art/m1/ui/app-icon.svg`, `sizes: 'any'`, `type: 'image/svg+xml'`, `purpose: 'any'`. Its actual SVG and ready register entry remain with the original art owner. Manifest colors match the accepted shell's teal `#176a68` and parchment `#f5eedc`; no new palette was introduced. Runtime HTML/JS/CSS/JSON/art/image/audio/webmanifest extensions are included, `.vite/**` is explicitly excluded, and maximum per-file size is 8,388,608 bytes. The handed-off largest required WAV is 6,773,804 bytes.
3. **Applied after checker defaults were confirmed:** root build is `pnpm typecheck && vite build && node scripts/check-precache.mjs`. No-argument checker reads `APP_BUILD_ID`, normalized `APP_BASE` (default `/Learning-is-Fun/`), `dist`, 8 MiB maximum and outside-dist `artifacts/platform/<build-id>/precache-report.json`. Explicit `--dist`, `--build-id`, `--base`, `--max-bytes`, and `--report` support private output. Checker source remains offline-owner controlled.
4. **Pending source readiness:** verify emitted worker/page identity/base, injected inventory, metadata exclusion and checker success/failure propagation using private output. No root build was launched. A private Vite build needs an explicit checker invocation for that output; bare `vite build` does not invoke the package-script gate.

The PWA plugin is absent for development. In production config resolution its integration hook disables generation/injection for every imported fixture wrapper; only the actual root config file enables it. The worker-build hook explicitly passes the same base and build-ID define as the page. No automatic registration asset, autoUpdate, skipWaiting or clientsClaim was added.

These decisions share the root configuration and package build command and depend on the icon/checker contracts, so this owner slice is serial within the controller's existing split. No additional author or other-chat message is needed.

## Dependencies and evidence

At initial inspection, `public/icons` was absent and the asset register contained no app-icon record. Controller subsequently supplied the concrete SVG contract and checker defaults. No icon asset or PNG requirement was invented. Icon generation/register readiness and worker/checker source freeze remain external dependencies for production-output verification.

Private evidence root: `C:/Users/alexb/AppData/Local/Temp/offline-config-PWagog`. `before.json` records starting root/dependency/config and fixture-wrapper fingerprints. `config-validation.json` records the passing isolated strict root-config typecheck and eleven private Vite configuration resolutions: root build PWA enabled, root development PWA absent, and all nine existing fixture builds PWA disabled. Supported plugin API produced only an in-memory manifest, with the exact base/icon/palette and no registration asset; no output was written. An initial harness spy rejected that expected manifest emission; the corrected in-memory API check passed without a production repair. `final-validation.json` pins the owned final files and preservation checks. No production build or emitted-output acceptance is claimed.

No shared-dist build, browser/server launch, worker creation, installation, Git mutation, deployment, production source write, asset write, or shared-status write was performed. Root TS configs, dependencies/lock and fixture wrappers remain unchanged. Final production acceptance remains with Controller after private emitted-output verification and integrated owner checks.
