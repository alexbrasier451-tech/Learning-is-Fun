# D3 published runner extension

11 October 2026. **Source frozen for original independent tooling review.** Controller owns commit, dispatch, candidate replacement and acceptance. This owner ran configuration/discovery/private model checks only; no browser, server, build, Git, CI dispatch or deployment was performed.

## Exact owned delta

Changed only `tests/fixtures/d3-firefox.config.ts`, `.github/workflows/d3-firefox-smoke.yml` and this handoff, plus private evidence. Root configuration, source/specs/helpers, packages/lock, release ledger and other handoffs remain unchanged.

| Manual selection | Exact D3 cases |
|---|---|
| `components` — default | adult 3 + Hall 3 + audio 2 + creative 2 |
| `adventure` | **7**, including the existing published-J01/J02/J03 regression |
| `shell` | 4 |
| `offline` | 4 |
| `published` | **1**, the frozen bounded published smoke |

All three workflow count maps now use adventure 7 and published 1. Existing discovery/result gates retain exact counts, `D3-Firefox`, no errors/skips/unexpected/flaky results, expected passed status and exactly one passed attempt. Published gates additionally require report metadata to match prepared CI source and deployment identities, including the candidate metadata hash. Six-case adventure reports are rejected.

## Published contract and identity

Consumed the actual [observer handoff](../../../execution/WP06-02A-HANDOFF.md) at repository-root `execution/`, not the initially supplied docs location. Frozen `tests/playtest/starter.spec.ts` SHA-256 is `ae2a7c45ec71e855359e9a992838ad96aa56f76db376fd71dad173c013e1483e`. Exact selected title: `M1 published bounded entry, profile resume, bridge, adult, Hall and project reload smoke`.

The adapter scopes discovery to `tests/playtest/starter.spec.ts`, with the title suffix, one Firefox project at 1280 × 720, one worker, zero retries, `forbidOnly`, trace/screenshots on, 90-second case timeout and the existing five-minute global bound. **No local web server or global teardown is configured for published.** The spec's visible Help version and native active-worker identity assertions remain untouched. The smoke is bounded D3 evidence, not a replacement for agent-directed D1/T1 journeys or listening.

Prepare reads the actual seven-field `docs/release/M1/CANDIDATE.json` only for published selection. It validates M1, the canonical HTTPS project entry and base, the build/commit/Pages-run relationship, and CI source commit, then exports `PLAYTEST_MODE=published` and `PLAYTEST_BASE_URL` from that validated record. The adapter independently validates the ledger and matching environment. Invalid-input errors omit supplied values; only whitelisted public deployment identity fields enter run/report metadata, without dumping ambient environment or the private inventory-location field.

`run.json.commit` remains the **CI source commit**. `run.json.deployedCandidate` and Playwright report metadata retain the separately deployed URL/base/build/commit/run plus SHA-256 of the ledger bytes. Prepare and adapter read metadata dynamically; no B build/commit is hardcoded. The current inspected record is B (`b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1`); private modeled replacement metadata proves future-candidate support without claiming a replacement was deployed. Existing selection/run/attempt artifact names and wildcard report/trace paths retain both identities.

## Adventure host and preservation

The seventh adventure case navigates to `./` and observes the real development root shell. Existing adventure startup already uses repository cwd, the root-serving Vite wrapper and `/playtest/` at 5194. Actual in-memory serve resolution confirmed repository root, `index.html` pointing to `src/main.tsx`, the private adventure cache and disabled dev PWA. The same host still serves `tests/fixtures/adventure.html` for the original six cases; no helper, fixture entry or runtime injection was added. No HTTP server was started for this proof.

Matched Firefox setup, job environment/timeout, native PulseAudio routing/readiness, browser logging, host observation, targeted cleanup, artifact retention and component/shell/offline contracts are structurally preserved. Twelve workflow steps match the predecessor exactly. Direct discovery still needs the four imported component roots; published additionally requires `PUBLISHED_VERIFY_ROOT` for private results, plus the published environment. CI prepares all roots below `$RUNNER_TEMP/d3-firefox`.

## Checks and next step

Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-published-ci-dWv60p`. Native YAML parsing, six inline Node syntax checks and isolated strict adapter typechecking passed. Actual Playwright **discovery only** passed components 3/3/2/2, adventure 7, shell 4, offline 4, published 1. The initial leading title anchor excluded Playwright's project/file-prefixed title; removing that anchor while retaining exact suffix/file scope corrected discovery. The original published discovery was rerun successfully.

Forty-three private metadata/adapter/gate checks passed, including current/modeled replacement metadata, URL/schema/identity rejections, suppressed invalid-input values, all selected pass models and result failure variants. Synthetic reports are gate checks, never browser pass evidence. `final-validation.json` pins the final three owned paths and preserved non-owned fingerprints. The original independent tooling reviewer rechecks this frozen snapshot; Controller then commits/dispatches the exact selected candidate. Published B remains untouched by this work.
