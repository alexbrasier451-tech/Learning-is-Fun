# Playwright local browser discovery — independent validation

Date: 9 October 2026. Review baseline: `acf7d61`. Read [BROWSER-DISCOVERY-HANDOFF](BROWSER-DISCOVERY-HANDOFF.md), the actual `playwright.config.ts` diff and signed-off browser/platform test ownership, reusing the accepted WP01 foundation context.

**Verdict: ACCEPTED for the bounded discovery correction.** Finding severity: NONE. No invalidated foundation criteria or ownership changes. This accepts collection/configuration only; it does not claim that the collected browser tests pass.

## Scope and configuration preservation

The diff adds shared fixture/support exclusions and extends the `local-fixture` project from `**/*.local.spec.ts` to also match `**/browser/**/*.spec.ts` and `**/platform/**/*.spec.ts`. Local mode additionally excludes published-suffix files and `playtest/`. This covers already-declared producer suites such as WP04-02A `tests/browser/save-repository.spec.ts` and WP02-04A `tests/browser/interaction.spec.ts`, retaining WP01 ownership of shared configuration and each producer's ownership of its specs/fixtures.

Compared effective local/published configurations with HEAD after removing only the intended discovery-field changes: all other fields are equal. Explicit HTTPS entry validation, published no-fallback/no-webServer behavior, D1–T2 project names/channels/viewports/touch settings, local port 4173 and `/playtest/` base, context/capture settings, retries and reporters remain unchanged. Published projects retain `**/*.published.spec.ts` and inherit fixture/support exclusions. Future WP06 published-observation naming/configuration handoffs remain with their owners.

## Independent bounded evidence

Fresh project-local Playwright 1.64.0 `test --list --reporter=json` returned **exit 0, 28 tests, three files, zero collection errors**:

| Exact suite | Collected tests |
|---|---|
| `tests/browser/interaction.spec.ts` | 19 |
| `tests/browser/save-repository.spec.ts` | 8 |
| `tests/platform.local.spec.ts` | 1 |

No hooks/test bodies, browsers or configured webServer were executed by this discovery-only command.

Imported the effective configuration and used the installed Playwright file matcher in memory: all **13 distinct signed-off `tests/browser/` and `tests/platform/` suite paths** match local discovery. Representative existing-local-suffix, browser and platform paths are included. Published-suffix, fixture/support (including nested support), playtest-local-suffix and Vitest unit paths are excluded from local discovery. Published-suffix paths outside fixture/support match all five published projects; plain local suites and fixture/support paths do not. No probe files were created by this reviewer.

Fresh config-import processes independently rejected missing published URL, HTTP, URL without published mode, credentials, query, fragment, missing trailing slash and unknown mode. The HTTPS example was configuration input only, with no network navigation or deployment observation.

Reused the author's temporary discovery-probe evidence for actual local/published collection boundaries and cleanup. `tests/__wp01-browser-discovery__/` is absent. The handoff does not claim a fresh Node typecheck; it explicitly reuses the interaction owner's typing evidence. No additional typecheck is required for this bounded filter correction.

Only this report was authored. No production/configuration/Git/shared-status edits, broad test/build runs, server launches, browser recovery, delegation or other-chat messages were performed. Concurrent repository and widget work was left undisturbed. Later producer test outcomes and mandatory published D1–T2 acceptance remain separate obligations.
