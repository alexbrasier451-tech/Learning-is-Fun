# D3 Firefox fixture CI setup — independent validation

Date: 9 October 2026. Source baseline: `5a26068`, following accepted root configuration correction `2e3296d`. Reviewed `.github/workflows/d3-firefox-smoke.yml`, `tests/fixtures/d3-firefox.config.ts`, inherited fixture configurations/teardowns, selected cases and completed [D3-CI-HANDOFF](D3-CI-HANDOFF.md). Existing component acceptance remains the input, not a reopened audit.

**Verdict: PASS for the bounded local CI setup.** Finding severity: NONE. No blocking setup findings. Actual Ubuntu Firefox execution and D3 component observations remain pending; Controller owns acceptance, commit/push and explicit dispatch.

## Workflow and portable fixture boundary

Independently parsed the actual YAML with installed Playwright's bundled YAML parser. Its sole trigger is `workflow_dispatch`; one standard `ubuntu-24.04` job has only `contents: read`, no matrix or continue-on-error, a 30-minute bound and no deployment/custom-secret configuration. Checkout does not persist credentials. Node 24 matches the declared engine family, pnpm is exactly 11.25.0, dependencies use frozen installation, and matched Firefox is installed through the pinned Playwright 1.64.0 CLI. Package/configuration pins and policies are unchanged.

Verified current official tagged action definitions and used inputs: [checkout v7](https://raw.githubusercontent.com/actions/checkout/v7/action.yml), [setup-node v7](https://raw.githubusercontent.com/actions/setup-node/v7/action.yml), [pnpm setup v6](https://raw.githubusercontent.com/pnpm/action-setup/v6/action.yml) and [upload-artifact v7](https://raw.githubusercontent.com/actions/upload-artifact/v7/action.yml). All use Node 24; explicit cache disabling and one-day artifact retention are supported. `ubuntu-24.04` is a standard public-repository runner with free compute; the handoff correctly retains the separate free-storage-allowance dependency. [Runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners), [billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

The adapter preserves each selected owner's testDir/testMatch, base URL, private output/report paths, Vite command/configuration, URL-derived cwd and HTTP teardown. All four roots are supplied before static imports and created separately under runner.temp. Existing Node/Vite/HTTP paths use no Windows executable or PowerShell helper. Linux native bindings are present in the lockfile. This is static portability evidence; Linux startup/media behavior still requires execution.

Exactly one replacement project runs: **D3-Firefox, browserName=firefox, 1280×720, no touch/mobile, no channel/executable override**. One worker, no retries, forbidOnly, five-minute per-invocation bound and trace/screenshot capture apply. The four fixture calls run serially; their owned ports/teardowns are preserved, reuseExistingServer remains false, and no local reviewer port was used. ADULT_REAL_RELEASE=yes enables the already-released real binding; invalid selection/unreleased-adult guards reject.

## Exact smoke selection and evidence

Inspected the author's actual discovery JSON and exit metadata, not only the prose summary. Each list-only invocation exits 0 with zero collection errors, only D3-Firefox and these exact current selections:

| Fixture / suite | Count | Selected relevant views/routes |
|---|---|---|
| adult / `tests/browser/adult-profiles.spec.ts` | 3 | Two-step entry/cancellation/exit focus; truthful learning evidence; actual four-profile rename/preferences/reload/whole-backup replacement |
| Hall / `tests/browser/local-leaderboard.spec.ts` | 3 | Exact tied ranks; keyboard history/back focus; real acknowledged rollover and repeated-open behavior |
| audio / `tests/browser/audio-controls.spec.ts` | 2 | First-visit silence and keyboard controls; real profile/visibility forwarding with unchanged installation choices |
| creative / `tests/browser/creative.spec.ts` | 2 | Scarf preview/undo/cancel/atomic save/abort/conflict/reload; acknowledged help plus explicit Read/Stop |

The complete titles in raw discovery agree with the adapter grep expressions, selected source cases and final handoff: **3/3/2/2, ten tests total**. ExpectedStatus is passed for all ten; collection is not an actual-browser pass. Reused the green scoped strict ES2023/Node adapter compile, its empty diagnostic output and selector/release rejection evidence. No browser suite or root/build rerun was needed.

Privately executed the exact inline discovery/result guards with in-memory synthetic reports. Discovery accepts correct counts and rejects wrong count/project and collection errors. The result guard accepts ten single-attempt actual passes and rejects **13** adverse cases: missing report, zero tests, collection error, skip, failure, flaky retry, expected-failure fake green, wrong project, multiple attempts, incorrect count, inconsistent expected stats, missing stats and missing actual results. Synthetic reports verify guard logic only and supply no Firefox observations.

Failure artifacts include commit/OS/Node metadata, Playwright version, discovery/results JSON and screenshot/trace outputs, with private Vite caches excluded. Upload uses `!cancelled()` so it runs after success or failure, consistent with [GitHub status-function semantics](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#status-check-functions); canceled runs are excluded. Existing Hall stdout and real audio/creative attachments expose the launched browser version for later remote review. A green job must still be inspected for rendered evidence and exceptions.

## Final identity and scope

Final reviewed SHA-256 values:

| Exact file | SHA-256 |
|---|---|
| `.github/workflows/d3-firefox-smoke.yml` | `43c9ee6f1474827a8fd9394b77afbb0469e807386adf564cedeeb88d7c696e5a` |
| `tests/fixtures/d3-firefox.config.ts` | `6c6db0b3a798e255b1f98105e45a207bbdbae568540a9355db59a796d7c2d191` |
| `docs/work-package/execution/D3-CI-HANDOFF.md` | `05b4c8afdd41fc3149a115c4cea385f71f721b3b8636abf9a6377097f94268f0` |

Independently compared all 156 pre-existing files with the owner's captured hashes: unchanged. Private reviewer branch checks/final hashes are under `C:/Users/alexb/AppData/Local/Temp/d3-ci-validation-MaRPVf`. Only this report and private outputs were authored; no source/configuration/dependency/shared-status/Git mutation, delegation, other-chat message, external action, server launch or browser execution occurred. Native Actions/Bash execution was not performed locally.

This verdict grants no actual D3 execution acceptance, D1/Edge-primary substitution, live published/final-game/offline claim, heard speech/audio or physical-device evidence. Speech is explicitly simulated in these fixtures. D1 Edge-primary approval remains unresolved. Reviewed remote evidence at the accepted candidate commit is still required for these ten D3 observations, with later final-shell/published acceptance retaining its own scope.

## Continuation — HTTP 422 runner-context correction

9 October 2026. Read the Controller-owned [D3-CI-EXECUTION](D3-CI-EXECUTION.md), actual workflow diff against candidate `46214efbf8fbb76126991d742c98405e5cce5176`, and completed original-owner handoff addendum. The source push succeeded, but workflow dispatch returned HTTP 422 before a runner started because `runner.temp` is unavailable in `jobs.firefox.env`. The original local PASS above covered parsing/discovery/guard checks and missed this GitHub field-context restriction; it supplies no remote schema/runtime pass. That failure evidence and the prior limited checks remain preserved.

**Correction verdict: PASS for the narrow runtime-root initialization repair. Current blocking findings in the reviewed correction: NONE.** GitHub permits `runner` in `jobs.<job_id>.steps.with`, but excludes it from `jobs.<job_id>.env`. The five forbidden expressions are removed; the remaining five `runner.temp` expressions occur only in the artifact step's supported `with.path` scope. Its github name expressions and !cancelled() condition also remain in supported step scopes. [Official context-availability table](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability).

The preparation step reads built-in RUNNER_TEMP/GITHUB_ENV, derives the evidence root and four separate fixture roots, creates them and appends UTF-8 `KEY=value` lines to the environment file. Metadata uses its local `root` variable, without assuming the five new application variables exist during that initialization process. GitHub exposes environment-file assignments to subsequent steps, not the writing step; these built-in paths are available on the runner. [Environment-file propagation](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-environment-variable), [default variables](https://docs.github.com/en/actions/reference/workflows-and-actions/variables).

Independently executed the exact extracted preparation program in a private simulation with a temporary path containing spaces and all five application variables initially absent: exit 0, five expected directories/exports, preserved pre-existing environment-file content and correct initial metadata. Parsed those assignments into a separate downstream process: exit 0, all five paths available and distinct as intended. Missing RUNNER_TEMP or GITHUB_ENV each rejects with exit 1. Evidence is explicitly labelled LOCAL-SIMULATION-NOT-GITHUB-OR-FIREFOX under `C:/Users/alexb/AppData/Local/Temp/d3-env-correction-validation-Gw0Qgx`.

Parsed-object comparison with the failed candidate proves only the five job-env deletions and preparation program changed. Adapter, installation, discovery/result guards, artifact layout/retention, trigger, permissions and serial execution remain unchanged. Reused the accepted adapter/compile/result-guard evidence and the owner's new downstream 3/3/2/2 list-only evidence; no broad repeat or browser run was needed.

Final correction workflow SHA-256: `bcc588c18bdcc45fe3aa5465b4a171e93e3e457498a6b9f0f2153c08ad208f19`. Unchanged adapter: `6c6db0b3a798e255b1f98105e45a207bbdbae568540a9355db59a796d7c2d191`. Completed handoff snapshot: `8e44febf6f58f66f6aad8b037d04a367fee57e773a30f1acd3659ded92cd5936`.

Only this validation appendix and private checks/output were authored. Controller's execution record was read, never edited. No source/Git/external action occurred. Complete dispatch → runner → matched Firefox → ten actual cases remains Controller-owned and unverified until that original remote flow succeeds. D1 and all broader acceptance limits remain unchanged.
