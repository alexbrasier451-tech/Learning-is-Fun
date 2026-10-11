# WP01-04A — independent publication validation

11 October 2026. **Prepared-source PASS; no actionable P1/P2 deficiencies in this review boundary. Actual publication acceptance remains pending.** The reviewed workflow, runbook and focused test support the authorized controlled A/B publication. No successful deployment, verified HTTPS entry, final PublishedCandidate or candidate freeze is asserted. Controller alone performs Git/Pages operations, accepts the child and releases dependencies; user authorization is already settled.

## Reviewed boundary and source identity

Read the bounded WP01-04A child and preparation handoff, `.github/workflows/pages.yml`, `docs/release/PUBLISHING.md` and `tests/platform/base-path.spec.ts`. Inspected the existing build/identity/checker and root test-discovery contracts only where needed to verify those interfaces. Consumed accepted WP01-03A validation and actual D3 execution on production commit `64865808d867dfe3d02e0f71deaec7ed3fdf897c`, with DEP-067 acceptance `d2ce42c2b65b1cc02e873d91c744f79e12dfb015`. The accepted narrow Help identity review supplies the shell display correction. These accepted scopes were not reopened.

Author evidence **E**: `C:/Users/alexb/.codex/visualizations/2026/10/11/01a1296c-853f-73d1-9788-f757198f484b`.

Reviewer evidence **R**: `C:/Users/alexb/.codex/visualizations/2026/10/11/01a12976-1cff-7762-aafc-e4ef40196912`.

Independently matched every entry in E/source-freeze.json, including the handoff receipt. The accepted shell hash also matches. Before/after fingerprints for these files and the narrowly consumed build/identity/lockfile/checker/discovery sources are unchanged after the private checks.

| Prepared owned file | Bytes | Reviewed SHA-256 |
| --- | ---: | --- |
| .github/workflows/pages.yml | 5,863 | a3beef7ab17e733473e3077dc05a0d2b646511b31397d520f6b5d0f9dadbecdc |
| docs/release/PUBLISHING.md | 12,118 | cb8b70113c90f5352b1a896aae423a8ba0b289060738f94bba036a4cd132b87d |
| tests/platform/base-path.spec.ts | 7,049 | 76527dc5924a0a78f723ba5a386ea488dd2574f27ab3a80b4bf244430b1d8d65 |
| docs/work-package/execution/WP01-04A-HANDOFF.md | 7,209 | 3beb485f0d37b241ebc6dc884a537fe43cac6d719b880116b605784ad5d549b8 |

`src/app/AppShell.tsx` remains the independently accepted `9a12a03c229b8f2faaff6426b8e41263d553bdda837470066ecbc5e45ebbbc89`. No author-owned source was changed by this reviewer.

## Workflow and runbook assessment

The workflow has only manual dispatch, with the build restricted to the named repository and `main`. It installs the committed lockfile with the declared pnpm version on Node24, explicitly supplies `/Learning-is-Fun/` and SHA/run/attempt identity, and calls the existing `pnpm build` once. That script runs typecheck, one production Vite build and the accepted precache checker. Page and worker consume the same compiled identity.

The passing matching report and hidden Vite mapping move outside `dist`; runtime files remain unchanged. The workflow measures every remaining file, rejects hidden/non-file publication paths, retains files/report/mapping/build metadata and an archive separately, then uploads that same `dist`. The current `public` tree contains only the 44 approved M1 SVG/WAV assets. Source/tests/private helpers/reports are outside the upload tree, and the accepted checker rejects source/test bulk. Actual workflow artifact enumeration and origin byte equality must still be verified after deployment.

Configure/upload/deploy action references and their input/output contracts were checked against the official definitions: [configure-pages v5](https://github.com/actions/configure-pages/blob/v5/action.yml), [upload-pages-artifact v4](https://github.com/actions/upload-pages-artifact/blob/v4/action.yml), and [deploy-pages v5](https://github.com/actions/deploy-pages/blob/v5/action.yml). The uploader's default artifact name matches the deployer's default; moving hidden metadata avoids its documented archive exclusion. The other selected checkout/setup-node/pnpm-setup/upload-artifact versioned action definitions resolve and support the supplied inputs.

The build token has only contents read. Deployment adds pages write and id-token write, depends on the build, uses `github-pages`, records the actual page output and verifies configured base/path before deployment. These match [GitHub's custom workflow requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). One workflow concurrency group with cancellation disabled, plus Controller's ordered manual A/B dispatch, keeps the experiment serialized. Administrative Pages enablement is assigned to Controller with the actual workflow REST payload; configure-pages does not attempt administrative enablement using the ordinary job token. Repository/public/main/admin/Actions inputs are consumed from Controller's supplied capability evidence; this reviewer did not perform a new authenticated remote check.

The runbook requires retained real A/B artifacts, recorded unsuccessful attempts, explicit published metadata and verification before writing the seven-field final B record. Its intended HTTPS entry is correctly labeled unverified. `docs/release/M1/CANDIDATE.json` is absent as expected; absence at preparation is not a deficiency or a placeholder handoff.

## Focused test and actual local evidence

Independently parsed workflow YAML with zero errors and syntax-checked all three embedded Node modules. The existing Node TypeScript project passes through the installed compiler CLI with no runtime emit and its incremental metadata redirected into R. Read-only root Playwright collection finds exactly the intended one local case. No browser/server/build was launched by this reviewer.

Decoded the actual final E/base-path-local-final.json, rather than relying on the handoff summary. It contains one expected passing attempt, retry0, one worker, no skipped/unexpected/flaky results, attempt errors or report errors; total duration3.185s. It uses the unchanged root configuration, Playwright1.64.0, Chromium156.0.8078.4 and `/playtest/`. Independently verified all44 fetched records against the ready source inventory and current public bytes/SHA-256, including both loops and all five effects. Failed response and out-of-path arrays are empty. The report itself hashes `0a53349e5117b17f93ad9f9731101e1f4ccd6a5e47b118445db585dfa0a5cc8d`.

Extracted and visually inspected the final attempt's actual reloaded/resumed screenshot: explorer Publication, the real bridge controls and its retained six-metre plank are rendered. The development fixture's incomplete-offline banner is visible; this local run does not exercise production-worker readiness or prove HTTPS behavior.

Published mode requires explicit build/inventory/files, the exact HTTPS project URL, inventory/path consistency, independent origin byte/hash equality for every publication file, the visible Help version and native active-worker inventory identity. It then saves, reloads the project entry, reselects the real profile and resumes the saved bridge activity. The root published discovery intentionally excludes this filename; the runbook explicitly assigns a private runner that selects it. That runner and the private update harness were not yet present in E at this checkpoint, so their execution is not claimed here.

R/review-prepared.cjs, prepared-review-receipt.json, node-typecheck.json, decoded-local-final.json and local-final-resumed.png retain reproduction/decoded evidence. The initial private verifier failed on an unavailable TypeScript JavaScript API; R/review-attempt1.txt preserves that utility failure. The corrected installed-CLI check passes. This was a reviewer utility issue, with no production correction required. The author's interrupted initial browser attempt remains retained in E; the final real passing run is identified separately.

## Published A/B feasibility and remaining acceptance

The documented procedure preserves two real in-progress A clients before Controller publishes B. A B-only required emitted-code request is aborted only in the disposable observation context, with native request ownership/failure and installation state recorded. Approved public artifacts stay valid. [Playwright's service-worker routing documentation](https://playwright.dev/docs/service-workers#network-events-and-routing) supports this Chromium route and explains why updated worker-script routing is avoided. The runbook also requires recovery to complete waiting B, continued complete A, close-one waiting, all-close native B activation, compatible saves/preferences/sentinels and fresh/pre-existing final B launch identities. The out-of-scope same-origin observer has to prove it is not an A client. No forced activation/reload or hosted private control endpoint is introduced.

Consume the already accepted local changed-media proof; unchanged approved public audio/art across actual A/B is permitted, with their published hashes/revisions checked. Browser source starts/decodes and mute behavior remain technical evidence; no heard-quality or acoustic approval is inferred.

**Actual child acceptance stays pending** until Controller supplies successful real A/B run/head/artifact/deploy metadata and the owner's required published-origin observations. This same review will then inspect HTTPS nonroot entry/reload and all required bytes, visible/active identity, failed B and recovery, two-client lifecycle/no mixed revisions, preserved saves/preferences/sentinels, final fresh/pre-existing B and the actual seven-field PublishedCandidate/freeze. No DEP-074/076 release, WP06 observation authorization or M1 game acceptance is granted by this preparation verdict.

Only this validation report and private R evidence were written. No source/config/test/runbook mutation, installation, Git operation, administrative API mutation, deployment, server/browser startup, delegation or message to another chat occurred. Unrelated dirty files and the frozen shell addition were preserved.
