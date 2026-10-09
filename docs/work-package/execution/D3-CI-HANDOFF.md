# D3 Firefox fixture CI — local implementation handoff

9 October 2026 (Europe/London). Controller authorized this bounded implementation; Controller owns independent review, companion acceptance, commit/push and explicit dispatch. No external write, authentication, deployment, browser launch or component server run was performed by this worker. **Local deliverables and focused checks PASS; actual Ubuntu Firefox execution and D3 acceptance remain pending.**

## Authored scope

- `.github/workflows/d3-firefox-smoke.yml`: manual `workflow_dispatch` only, one standard `ubuntu-24.04` job with contents:read, Node 24/pnpm 11.25.0, frozen install, supported root typecheck, bounded discovery, package-matched Firefox + Linux dependencies, four serial fixture calls, strict actual-pass gate, compact success/failure artifacts retained one day. No push trigger, paid runner, cache, deployment, extra service or secrets. Checkout does not persist credentials.
- `tests/fixtures/d3-firefox.config.ts`: selects one existing owned config with D3_FIXTURE; preserves its server, baseURL, testMatch/testDir, private output/report locations and teardown; replaces its project array with only D3-Firefox (Firefox,1280×720, no touch/mobile). One worker, no retries, forbidOnly, five-minute per-invocation global timeout, trace/screenshot capture. Grep selection lives in this adapter, so CI commands need no duplicated grep. Invalid selector or adult release=no fails configuration loading.
- This handoff only. No package/lock/workspace, original fixture/config/spec, production source, shared status or root compiler config was edited. Before/after hashes verify **156 pre-existing source/test/config/dependency files unchanged**, including the frozen Node/app refinement and root/worker scheduling.

## Official action versions

The current official tagged action definitions were read on 9 October 2026. Implemented versions supersede the earlier feasibility proposal: checkout@v7, setup-node@v7, pnpm/action-setup@v6 and upload-artifact@v7. Each tagged definition uses Node 24. Explicit package-manager-cache=false, pnpm cache=false and run_install=false keep the frozen install as its own step; retention-days=1 is supported.

[checkout v7 definition](https://raw.githubusercontent.com/actions/checkout/v7/action.yml), [setup-node v7 definition](https://raw.githubusercontent.com/actions/setup-node/v7/action.yml), [pnpm setup v6 definition](https://raw.githubusercontent.com/pnpm/action-setup/v6/action.yml), [upload-artifact v7 definition](https://raw.githubusercontent.com/actions/upload-artifact/v7/action.yml).

## Linux portability and inherited ownership

Inspected the four owned Playwright configs, Vite configs, teardown modules and shared Vite foundation. Windows executable/Path literals exist in their local `*-run.ps1` helpers; CI does not invoke those helpers. The imported path uses ordinary `node node_modules/vite/bin/vite.js`, URL-derived cwd (`fileURLToPath(new URL("../..", import.meta.url))`), relative config paths, environment-supplied private Vite/output roots, and Node 24 fetch to owned HTTP teardown endpoints. No material Windows-only assumption was found on this CI path; no other owner was edited. Frozen lockfile already contains Linux native bindings. This is static portability/discovery evidence, not a Linux runtime pass.

| Fixture | Required private root | Inherited server port / teardown |
|---|---|---|
| adult | ADULT_VERIFY_ROOT | 5186 / `/playtest/__wp04-adult-close` |
| Hall | HALL_VERIFY_ROOT | 5185 / `/playtest/__wp05-hall-close` |
| audio | AUDIO_VERIFY_ROOT | 5184 / `/playtest/__wp02-audio-close` |
| creative | CREATIVE_VERIFY_ROOT | 5187 / `/playtest/__wp02-creative-close` |

The adapter statically imports all four configs, so all four roots must be set even for one selection. Workflow creates distinct `${{ runner.temp }}/d3-firefox/{adult,hall,audio,creative}` roots and sets ADULT_REAL_RELEASE=yes for the released binding. Each fixture owns shutdown through its inherited teardown; reuseExistingServer remains false. CI runs serially on its isolated host and uses no local Windows review listener.

## Focused local checks

Private evidence root: `C:/Users/alexb/AppData/Local/Temp/d3-ci-validation-KofHRo`. NODE_DISABLE_COMPILE_CACHE=1, no shared compiler cache, no broad root/build/browser rerun. Local bundled Node 24 launches the installed CLIs with a bounded child Path.

| Check | Result |
|---|---|
| Strict isolated ES2023/Node adapter compile | PASS, exit 0, no diagnostics; no DOM/JSX settings added |
| Actual Playwright list-only discovery | PASS, exits 0; adult 3 / Hall 3 / audio 2 / creative 2; sole D3-Firefox project; zero discovery errors |
| Actual YAML parse | PASS using installed pnpm 11.25.0 native YAML reader in a private scratch workspace, `config get jobs/on/permissions --json`; no dependency install |
| Parsed workflow contracts | PASS: sole workflow_dispatch, one Ubuntu job, read-only contents, four private roots, frozen install/root check, matched Firefox installation, no retry/matrix/cache, failure artifact condition and retention 1 |
| Three extracted inline Node programs | Syntax PASS via `node --check`; actual discovery JSON also passes the workflow discovery gate |
| Reporter gate contract | Synthetic passing report accepted; synthetic skipped, failed, flaky and missing-cases reports each rejected exit 1 |
| Selector/release guards | Actual list-only CLI with invalid selector / unreleased adult each rejected exit 1 |
| Frozen pre-existing files | PASS: all 156 hashes unchanged |

Synthetic reporter files are explicitly marked SYNTHETIC-NOT-BROWSER-EVIDENCE and remain private. They verify rejection behavior only; they do not count as Firefox tests or acceptance. Native GitHub Actions schema/execution and Bash execution were not available locally; parsed YAML, job contract checks and Node syntax/runtime gates are verified. Remote startup/media and the native Actions service remain execution dependencies, not an invented local PASS.

Exact local compile command (bundled Node invokes this installed CLI):

```text
node node_modules/typescript/lib/tsc.js --ignoreConfig --noEmit --strict --target ES2023 --lib ES2023 --types node --module ESNext --moduleResolution Bundler --skipLibCheck --incremental false tests/fixtures/d3-firefox.config.ts
```

For each selector with all four private roots and ADULT_REAL_RELEASE=yes:

```text
for fixture in adult hall audio creative; do
  D3_FIXTURE="$fixture" node node_modules/@playwright/test/cli.js test --config tests/fixtures/d3-firefox.config.ts --project D3-Firefox --list --reporter=json
done
```

## Exact discovered cases

| Fixture | Accepted current title |
|---|---|
| adult | two-step adult entry, keyboard or touch confirmation cancellation and exit focus |
| adult | producer evidence separates supported later success, distinct task, delayed review and missing data |
| adult | actual facade four-profile committed rename preferences reload and whole-backup replacement |
| hall | 20/20/10/0 ties and historical names remain exact |
| hall | keyboard and touch history/back routes restore focus without awards |
| hall | real facade opening refreshes native committed rollover once before displaying new closed results |
| audio | real facade profiles and visibility hook clear transient speech and cues without changing installation choices |
| audio | first visit is silent; keyboard controls preserve independent choices under Silence all |
| creative | scarf: free preview, undo, cancel, atomic Save, native abort retry, conflict and reload |
| creative | approved help remains hidden through pending and failed commit; explicit Read and Stop follow acknowledgement |

## Remote commands and controller next step

Workflow runs after checkout/runtime setup:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
# List-only discovery first; exact 3/3/2/2 JSON counts are required.
for fixture in adult hall audio creative; do
  D3_FIXTURE="$fixture" pnpm exec playwright test --config tests/fixtures/d3-firefox.config.ts --project D3-Firefox --list --reporter=json
done
pnpm exec playwright --version
pnpm exec playwright install --with-deps firefox
for fixture in adult hall audio creative; do
  D3_FIXTURE="$fixture" pnpm exec playwright test --config tests/fixtures/d3-firefox.config.ts --project D3-Firefox
done
```

The authored workflow redirects discovery JSON to the four private directories, then checks counts. Its final gate requires each results.json to contain the expected count, expectedStatus=passed and one actual passed attempt per case; errors, unexpected/flaky/skipped stats, wrong project or missing cases fail the job. Artifact upload runs on success/failure unless cancelled and includes commit/OS/Node run metadata, Playwright version, discovery/results JSON and screenshot/trace output. Actual Firefox version is exposed by existing Hall beforeAll stdout and audio/creative real-case evidence. Private Vite caches are excluded from artifacts.

Controller confirms the repository is public, main is default, and Actions is enabled. After independent review and companion acceptance, Controller alone commits/pushes the reproducible candidate and these CI files. With reviewed main at the accepted commit, the explicit next command is:

```bash
gh workflow run d3-firefox-smoke.yml --repo alexbrasier451-tech/Learning-is-Fun --ref main
```

Use the reviewed branch ref if Controller publishes the candidate elsewhere. The workflow must exist on default main before first manual dispatch; compare recorded GITHUB_SHA/run metadata with the exact accepted candidate before using its evidence. Neither this command nor any push/dispatch was executed here. Standard public Ubuntu runner compute is free; artifact storage still needs remaining free allowance, with no paid overage authorized. [GitHub public-runner billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [manual dispatch behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch).

## Remaining acceptance boundary

A reviewed remote pass can support these ten bounded D3 component view/route observations at 1280×720, using matched Firefox and real storage/facade paths where selected. Inspect rendered screenshots/traces, captured exceptions, actual launched version and all ten results; a green job alone does not certify the visuals. Native Linux AudioContext/media availability is a real dependency of audio/help assertions: diagnose any failure rather than silently skipping or waiving it.

No published/offline/service-worker, final full-game relevant-view D3, D1 agent journey or Edge-primary substitution, OS speech/listening, Windows Firefox recovery, physical-device/child testing or whole-package claim follows. These fixtures simulate speech explicitly. Final-shell published D3 smoke still follows real deployment; this CI supplies no browser/package waiver or fake journey. Network access to registry/browser CDN/Linux packages and remaining free artifact allowance are the other concrete remote dependencies.

| Authored file | SHA-256 |
|---|---|
| `.github/workflows/d3-firefox-smoke.yml` | `43c9ee6f1474827a8fd9394b77afbb0469e807386adf564cedeeb88d7c696e5a` |
| `tests/fixtures/d3-firefox.config.ts` | `6c6db0b3a798e255b1f98105e45a207bbdbae568540a9355db59a796d7c2d191` |

**Disposition: three requested local files complete and reviewable; focused local checks PASS; no remote execution or D3 acceptance claimed.**
