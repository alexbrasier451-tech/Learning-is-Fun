# WP01 browser discovery correction — 9 October 2026

Ready for independent review by the original WP01 reviewer. Only `playwright.config.ts` and this handoff are persistent changes for this correction. No worker spec/fixture, dependency pin, Git state or shared status file was edited. No browser/server was launched, no gameplay check was run, and ports 5179/5180 were not used.

## Cause and bounded correction

The root local project previously matched only `**/*.local.spec.ts`. That silently omitted accepted producer suite names including WP04-02A `tests/browser/save-repository.spec.ts`, WP02-04A `tests/browser/interaction.spec.ts`, and later named browser/platform suites.

Inspected named paths across WP01/WP02/WP04/WP05/WP06 chunks. Producer checks live under `tests/browser/` and platform checks under `tests/platform/`; published observation work lives under `tests/playtest/`. Preserve existing explicit local suffixes and published-mode filtering.

The `local-fixture` project now matches:

```text
**/*.local.spec.ts
**/browser/**/*.spec.ts
**/platform/**/*.spec.ts
```

Shared exclusions are `**/fixtures/**` and `**/support/**`. Local additionally excludes `**/*.published.spec.ts` and `**/playtest/**`. The published projects retain their existing `**/*.published.spec.ts` matcher and inherit fixture/support exclusions. This does not reclassify future published playtest files or rename producer suites; WP06 owns its later published observation/configuration handoff.

Unchanged behavior: explicit HTTPS published URL validation, no published localhost fallback/webServer, D1–T2 names/browser channels/viewports/touch settings, local server port 4173/base `/playtest/`, isolated contexts, retries, reporters and capture settings. No executable adapter or browser recovery was added.

## Discovery-only verification

Used project-local Playwright 1.64.0 through bundled Node with the known short child Path. The command was exclusively:

```text
node node_modules/@playwright/test/cli.js test --list --reporter=json
```

Actual existing local collection: **28 tests, 3 files**, zero collection errors:

- `browser/interaction.spec.ts`
- `browser/save-repository.spec.ts`
- `platform.local.spec.ts`

No test hooks, IndexedDB operations or interactions executed. `--list` does not start the configured webServer or browser. This is discovery evidence, not proof that all 28 tests pass.

Temporary harmless probes were written only under the new owned directory `tests/__wp01-browser-discovery__/`, with empty test bodies. Local discovery collected its `future.local.spec.ts`, `browser/future-local.spec.ts`, and `platform/future-platform.spec.ts`; total count became 31. It excluded its published-only browser probe, fixture-directory published probe, support-directory local/published probes, nested browser/support probe and playtest-directory local-suffix probe.

Published discovery with explicit `PLAYTEST_MODE=published` and intended HTTPS project URL collected exactly the one temporary `browser/future.published.spec.ts` in each project:

```text
D1-Chrome
D2-Edge
D3-Firefox
T1-Chromium-touch
T2-WebKit-touch
```

The intended URL was configuration input only; no network navigation or publication claim was made. Published discovery excluded existing plain local browser specs and all fixture/support probes.

Fresh config-import processes confirmed expected rejection of:

- Published mode without URL: `Published observations require PLAYTEST_BASE_URL.`
- HTTP URL: `PLAYTEST_BASE_URL must be an explicit HTTPS deployment entry URL.`
- URL without published mode: `Use PLAYTEST_MODE=published with PLAYTEST_BASE_URL.`

All discovery/validation checks succeeded. Temporary files and empty directories were removed with exact, nonrecursive `finally` cleanup. No producer file was touched. No broader app/Node typecheck was necessary for the bounded filter change; the reported interaction typing repair remains its owner's evidence.

## Remaining acceptance

Independent reviewer should recheck the config diff and discovery boundaries. These results release intended suite discovery only; producer browser tests, later D1–T2 sessions, actual browser launch capability and published game acceptance retain their own required evidence. Controller owns integration/commit and shared status updates.
