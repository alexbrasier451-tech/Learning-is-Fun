# WP01-01A — Independent implementation validation

Date: 8 October 2026. Baseline: `528d9d64e980df8f44d513778699896cebc00ba8`; foundation files remain intentionally uncommitted. Validator did not author this implementation.

**Verdict: ACCEPTED for the WP01-01A foundation boundary.** No blocking implementation findings. Finding severity: NONE. Invalidated acceptance criteria: NONE. Administrative acceptance and commits remain Controller responsibilities.

## Authority and review boundary

Read [GLOBAL_RULES](../GLOBAL_RULES.md), [WP01-01A](../chunks/WP01-01A.md), [DECISIONS](../DECISIONS.md), coverage/dependency handoffs and [WP01-01A-HANDOFF](WP01-01A-HANDOFF.md). Current execution authority supersedes historical planning-only wording. Applied DEC-005/016/017/019/023/027/033 and the accepted navigation/active-panel interfaces. Review covers toolchain, identity/assets, early shell/types, fixture support and browser configuration/evidence. It does not accept gameplay, final shell guards, offline behavior, publication or complete D1–T2 journeys.

Only this validation report was authored. No production/shared-document edits, staging, commits, delegation or messages to other chats were performed. Existing Controller changes to `docs/work-package/execution/STATUS.md` were preserved. Focused checks used the existing project/runtime and generated compiler state.

## Acceptance assessment

| Criterion | Assessment and exact files |
|---|---|
| 1 — Reproducible compatible stack and environments | PASS. `package.json` and the sole `pnpm-lock.yaml` pin matching installed versions. Installed mandatory peers and Node 24 requirements agree, including React/React DOM, Vite/React plugin/Vitest and PWA/Workbox. Reused the author's successful install/frozen-install/build evidence; independently reran typecheck. `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.sw.json` and `src/vite-env.d.ts` separate app DOM, Node tooling and worker libraries. PWA dependencies are declared; implementation correctly remains with WP01-03A. |
| 2 — Stable app/base namespace and candidate identity | PASS. `src/platform/appIdentity.ts` exports the required app ID, validated normalized base, build-independent namespace and candidate build ID. `vite.config.ts` supplies the intended `/Learning-is-Fun/` default, explicit base override and required build identity. `src/platform/assets.test.ts` verifies root/project normalization, malformed inputs and namespace stability across two candidates. Reused root/two-candidate build evidence; inspected final `dist/index.html` and bundle for the project base and `local-candidate-b`. |
| 3 — Base-safe assets and reload | PASS. `src/platform/assets.ts` rejects leading slash, schemes/colon, escapes, query/fragment, backslash, controls and empty/dot/traversal segments before prefixing the configured base. Focused tests pass. The saved execution of `tests/platform.local.spec.ts` proves a real `/playtest/__wp01-probe.txt` response, history/reload, and same-origin `/playtest/` HTTP requests. Temporary probe is absent afterward. The root-style source entry in `index.html` is a Vite build input; the emitted entry uses `/Learning-is-Fun/assets/...`. |
| 4 — Early integration contracts and isolated fixtures | PASS. `src/app/navigation.ts` has exactly the accepted seven view kinds and `NavigationPort`, without domain IDs/commands or a durable store. `src/app/panelLifecycle.ts` contains only the accepted type declarations and no imports/runtime. `src/app/App.tsx` and `src/main.tsx` provide a neutral early shell; final guards are correctly deferred. `tests/fixtures/host.tsx` uses one React root with idempotent unmount. Producer-owned entries are documented in `tests/fixtures/README.md`; `platform.html`/`platform.tsx` demonstrate navigation/heading focus, subscription, suspension, explicit discard and teardown without downstream state/domain imports. `vite.config.ts` builds only `index.html`; current `dist` contains that entry and one application bundle, with no fixture entry/markers. No worker/precache is implemented yet. |
| 5 — Honest browser setup and capability distinction | PASS at this foundation boundary. `playwright.config.ts` declares exact D1 Chrome, D2 Edge, D3 Firefox, T1 Chromium touch and T2 WebKit touch modes/viewport sizes. Local fixtures and published observations use separate projects/patterns; published mode requires an explicit HTTPS URL and has no local fallback/server. The handoff distinguishes binary presence, successful launches and agent-interaction capability, and explicitly records Chrome installation and Firefox launch failures. Neither engine is relabeled. |

## Independent checks and reused evidence

- Fresh `node node_modules/vitest/vitest.mjs run src/platform/assets.test.ts`: **27 passed**, one suite. `node node_modules/typescript/bin/tsc -b`: **exit 0** across the referenced app/Node/worker projects. Used the bundled Node 24.19.0 and the bounded child PATH described in the handoff.
- Read installed metadata for all 14 manifest dependencies: exact pins match; required peer ranges and declared licences agree. Compared all **16 retained upstream licence/notice files** with the handoff appendix: byte lengths, SHA-256 values and notice text match. `pnpm-workspace.yaml` exempts only the explicitly selected `vite@8.3.4` from release-age delay; this is a bounded dependency-selection choice, with frozen installation already evidenced.
- Imported `playwright.config.ts` in fresh processes: local mode selects one fixture project/server; explicit HTTPS published mode selects the five prescribed projects without a server. Missing URL, HTTP URL, URL without published mode and unknown mode all reject as expected. The example HTTPS address was configuration input only, with no network/publication observation.
- Decoded the existing `playwright-report/index.html` report in memory: exactly **one expected/passed local-fixture test**, no skipped/flaky/unexpected tests or errors, run duration approximately 2.3 seconds. Its recorded steps match the current spec, including actual public-file response, reload/focus, suspension/discard, empty mounted container, zero remaining subscriptions, no page errors and request-prefix assertions. `test-results/.last-run.json` also records passed. Reused this successful browser run instead of repeating it.
- Reused the handoff's frozen-install, root/project builds and engine-launch inventory; independently inspected current build output and source/configuration. No broad game suite, additional browser installation or launch retries were needed for this bounded review.

## Open capability gaps and receiving obligations

These are explicitly reported capability gaps, not WP01-01A implementation findings; they invalidate none of this foundation's criteria:

| Mode | Evidence disposition | Later obligation |
|---|---|---|
| D1 stable Chrome | Branded executable absent; supported installation attempt failed. No launch success claimed. | Resolve the exact branded mode before mandatory D1 play acceptance. |
| D3 Firefox | Matched installed binary/157.0 metadata; launch and bounded retry failed `spawn UNKNOWN`. Metadata is not an observed running version. | Resolve launch capability before mandatory D3 play acceptance. |
| D2 Edge / T1 Chromium / T2 WebKit | Handoff reports actual launch versions 154.0.4258.62 / 156.0.8078.4 / 27.2 and neutral DOM/input probes; T2 rotation is recorded. Reviewer reused those probes. | WP06 must establish actual agent interaction and required published journeys. Emulation/WebKit does not establish physical-tablet/Safari behavior. |

The sequential handoff remains sound: WP01-02A owns final composition and guarded/token-safe panel registration; WP01-03A owns worker/PWA injection, matching candidate identity and fixture exclusion from precache; WP01-04A owns publication/CI identity. Later producers retain their domain contracts and fixture entries. Foundation acceptance does not waive any later browser, gameplay, audio or offline requirement.

## Bounded recheck — downstream unit discovery

Date: 8 October 2026. Reviewed the correction against committed foundation `1916da9`, the updated handoff's “Downstream unit-discovery correction” section and signed-off downstream test ownership. **ACCEPTED.** Finding severity: NONE. Invalidated criteria: NONE; criteria 1 and 4 remain accepted for this configuration change.

`vitest.config.ts` now includes `.test.ts` and `.test.tsx` under both `src/` and `tests/`, retains `configDefaults.exclude`, and explicitly excludes `tests/fixtures/**` and Playwright `.spec.ts`/`.spec.tsx` paths. The diff changes discovery only; the Node environment and build-ID define remain intact. This supplies the already-signed-off `tests/learning/identity.test.ts` and `tests/learning/contracts.test.ts` convention in WP03-01A, along with the other producer-owned unit-test paths, without moving ownership or requiring a downstream configuration override. WP01-01A's active configuration owner owns this sequential correction under its exact scope.

Independently imported the effective config and checked its globs in memory using the installed matcher: all **29 distinct downstream unit-test paths named in signed-off chunks** are selected. Representative source TS/TSX and downstream TS/TSX paths are included; fixture TS/TSX, local/browser/playtest specs, `.spec.tsx` and dependency paths are excluded. The temporary discovery-probe directory is absent and the fixture/source search found no probe test/spec remnants.

Reused the author's bounded evidence: all 27 existing asset/identity checks pass, a temporary `tests/` unit probe is discovered and passes, temporary spec/fixture probes are excluded, cleanup removes the probes, and tooling typecheck passes. No broad test/build run or unfinished learning tests were executed during this recheck. Only this report was appended; production files, shared status and commits were untouched. The earlier browser capability gaps and later acceptance obligations remain unchanged.
