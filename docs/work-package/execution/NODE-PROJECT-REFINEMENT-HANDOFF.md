# Node project refinement — diagnosis and proposed tooling change

9 October 2026. Original WP01-01A tooling owner. Initial read-only diagnosis at 04:56–04:58 BST; Controller subsequently released the serialized writer window. The accepted one-property correction in `tsconfig.node.json` is now applied and its private Node check passes. The first supported root check at 05:04 BST localized the matching six app-project file-list errors. After Controller released that path, the app include correction was privately verified and applied; the complete supported root typecheck passes at 05:06 BST. Final repository mutations are this handoff and the two authorized configuration lines. Production/UI/tests, dependencies, root/worker configuration, shared status and Git were not changed. No server or browser was launched; other reviews’ ports were untouched.

## Diagnosis and causal ownership

The supported Node project fails with **12 TS6307 file-list errors and no other diagnostics** at the observed source snapshot. The earliest violation is the tooling-owned `tsconfig.node.json` composite membership contract. Its include covers the three root tool configurations and `tests/**/*.spec.ts`; imported erased fixture APIs and their pure domain contracts enter the program but are not listed as roots. A type-only import still brings its source into the TypeScript program and therefore falls under composite membership requirements.

Current missing members: seven `tests/fixtures/*-api.ts` files (adult-profiles, audio, backup-roundtrip, creative, local-leaderboard, state-integration, save-repository), plus `src/state/contracts.ts`, `src/learning/contracts.ts`, `src/rewards/contracts.ts`, `src/experience/types.ts` and `src/audio/contracts.ts`. These are configuration membership diagnostics, not evidence of defects in their accepted producers. The creative author was still editing their source; this sampled check supplies no creative acceptance.

Read the existing M1 core integration limits, audio validation and Hall validation. Their independently passing strict ES2023/Node erased-boundary checks are consistent with this diagnosis. The earlier audio/local-save imports of executable TSX/DOM hosts were separate, already corrected consumer defects; this reproduction finds none of those errors. Do not reassign this issue to those owners or add browser globals to the Node project.

## Accepted narrow correction — applied in released writer window

**Applied path: `tsconfig.node.json` only. Replaced its `"composite": true` property with `"incremental": true`.** Keep the existing build-info path, include patterns, strictness, ES2023-only library, Node types, module settings, skipLibCheck and noEmit unchanged. Do not alter root/app/worker configs, fixture APIs, source, tests or package/lock files.

This Node project performs checking rather than supplying declaration output to another source project. The root solution has no source files and schedules app, Node and worker checks; app and worker do not declare a reference to the Node project. Incremental checking retains its compiler cache without imposing composite declaration-project file-list closure. The installed compiler accepts the proposed Node project through an empty-files solution using `tsc -b`. The proposed configuration continues to follow imported API/type dependencies automatically and reject unsupported DOM/JSX use; no include expansion across executable fixture hosts is needed.

Exact proposed diff:

```diff
-    "composite": true,
+    "incremental": true,
```

## Private targeted reproduction and verification

Compiler: installed `node_modules/typescript/lib/tsc.js` (pinned TypeScript 7.0.2), launched with the bundled Node executable and `NODE_DISABLE_COMPILE_CACHE=1`. All compiler build-info and evidence output is private to:

`C:/Users/alexb/AppData/Local/Temp/node-project-refinement-73qP4F`

Original supported project reproduction (composite retained; cache path is the only override):

```text
node node_modules/typescript/lib/tsc.js -p tsconfig.node.json --tsBuildInfoFile <private>/node.tsbuildinfo --noEmit --pretty false
Exit 1: 12 TS6307 diagnostics.
```

Private `node-refined.json` extends the actual repository Node config and overrides composite=false, incremental=true and the private build-info path. Because the shadow config resides outside the repository, it also explicitly points typeRoots at the existing repository `node_modules/@types`; that relocation-only setting is **not** part of the proposed repository patch. The first shadow attempt omitted it and produced TS2688 (cannot find Node definitions). That harness failure is retained in `refined-check.txt` / `refined-solution-build.txt`; correcting only relocated type discovery yielded the checks below.

| Targeted check | Result |
|---|---|
| Actual source closure, private refined `tsc -p ... --pretty false` | PASS, exit 0, no diagnostics |
| Private empty-files solution referencing only refined Node project, `tsc -b ... --force --pretty false --verbose` | PASS, exit 0 |
| `--listFilesOnly` and `--showConfig` | PASS, exit 0; retained exact outputs |
| Program boundary | 24 repository source files; zero DOM/WebWorker library files; zero TSX files; strict=true, lib=[ES2023], types=[node], no JSX compiler option |
| Shared Node configuration compared with captured original bytes | Equal after investigation |

The private solution check establishes the Node scheduling mechanism only. It is not an authoritative root `pnpm typecheck`, broad build, regression suite or acceptance of concurrently changing creative code. No shared compiler cache was used or written. No unit/browser tests were required for this read-only causal reproduction.

## Exact original diagnostics

```text
src/state/contracts.ts(5,8): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/learning/contracts.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
  The file is in the program because:
    Imported via '../learning/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/state/contracts.ts'
    Imported via '../learning/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/rewards/contracts.ts'
    Imported via '../learning/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/experience/types.ts'
    Imported via '../../src/learning/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/adult-profiles-api.ts'
    Imported via '../../src/learning/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/backup-roundtrip-api.ts'
    Imported via '../../src/learning/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/browser/local-save.spec.ts'
    Imported via '../../src/learning/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/state-integration-api.ts'
src/state/contracts.ts(9,8): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/rewards/contracts.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
  The file is in the program because:
    Imported via '../rewards/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/state/contracts.ts'
    Imported via '../rewards/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/experience/types.ts'
    Imported via '../../src/rewards/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/backup-roundtrip-api.ts'
    Imported via '../../src/rewards/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/browser/local-leaderboard.spec.ts'
    Imported via '../../src/rewards/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/local-leaderboard-api.ts'
src/state/contracts.ts(10,93): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/experience/types.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
tests/browser/adult-profiles.spec.ts(3,39): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/adult-profiles-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
tests/browser/audio-controls.spec.ts(4,38): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/audio-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
tests/browser/backup-roundtrip.spec.ts(2,36): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/backup-roundtrip-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
tests/browser/creative.spec.ts(4,41): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/creative-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
tests/browser/local-leaderboard.spec.ts(5,34): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/local-leaderboard-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
tests/browser/local-save.spec.ts(6,42): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/state-integration-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
tests/browser/save-repository.spec.ts(4,40): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/save-repository-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
tests/fixtures/adult-profiles-api.ts(1,68): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/state/contracts.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
  The file is in the program because:
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/adult-profiles-api.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/audio-api.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/backup-roundtrip-api.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/creative-api.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/creative-api.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/browser/local-leaderboard.spec.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/local-leaderboard-api.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/browser/local-save.spec.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/state-integration-api.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/browser/save-repository.spec.ts'
    Imported via '../../src/state/contracts' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/save-repository-api.ts'
tests/fixtures/state-integration-api.ts(1,44): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/src/audio/contracts.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.node.json'. Projects must list all files or use an 'include' pattern.
```

## Serialized implementation and proportionate verification plan

1. Await Controller release of the shared-config writer window and a stable creative handoff. Apply the one-property change in `tsconfig.node.json` only.
2. Rerun the same actual Node project with a new private build-info path and `--listFilesOnly`; require no diagnostics and retain strict ES2023/Node, no JSX and no browser library/host leakage.
3. In the released stable window, run the supported root `pnpm typecheck` (`tsc -b`) once. Require app/Node/worker success. If it reports a source error, classify it by its actual owner and inputs; do not weaken the Node boundary or attribute mutable creative code to accepted components.
4. Confirm only the authorized config line and this handoff changed. No dependency install, browser recovery, Vite build or browser rerun is implied by this configuration-only correction. Controller owns any broader integration acceptance and shared status updates.

## Inspected configuration hashes

| Path | SHA-256 |
|---|---|
| `tsconfig.json` | `bcf16541ddda80ac1f0a629ac54f954f2e5de303f25d121f86351d3266787ecb` |
| `tsconfig.node.json` | `517077e04de7072aa05f05a5dd8fd8b68ece3b3612f86afab540c3353924fe24` |
| `tsconfig.app.json` | `81ca8b66288bc03eb56cd564dd845e3fdfc9625bf6800d699395d9d5bdcbcabc` |
| `tsconfig.sw.json` | `347c948e018ae13ea871206370bac8b888ec1b0bc20307a4ba8fa6cf36f1fd15` |

Private evidence includes original `run.json` and diagnostic output, shadow configs, both initial relocation failures, resolved run metadata/output, exact file list/options and configuration hashes. These are reproducible temporary diagnostics, not committed acceptance machinery.

The preceding plan and hashes describe the initial read-only phase. The released execution and current disposition follow.

## Released execution — Node PASS; root check still red

At 05:04 BST, applied exactly the accepted `composite` → `incremental` property change. Fresh actual-project Node check, list-files and show-config commands all return exit 0. Private output: `C:\Users\alexb\AppData\Local\Temp\node-project-applied-h5PkRo`. Node program retains 24 repository sources, strict=true, ES2023-only library, types=[node], no JSX compiler option, no TSX and no DOM/WebWorker library files. The new Node config SHA-256 is `c562fed04d69f1dab71ef3cfd6d9bed7a068fccd42245b38478f742e353ff805`. Byte comparison proves this exact one-property delta; root/app/worker configuration hashes remain equal to the earlier captured values.

Ran the supported `pnpm run typecheck` (`tsc -b`) **once**, via pinned pnpm 11.25.0 with a bounded child Path; exit **1**. This authorized root run uses the normal build caches. The private scoped checks do not. Exact root output:

```text
tests/fixtures/adult-profiles.tsx(6,39): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/adult-profiles-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.app.json'. Projects must list all files or use an 'include' pattern.
tests/fixtures/audio.tsx(16,38): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/audio-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.app.json'. Projects must list all files or use an 'include' pattern.
tests/fixtures/creative.tsx(20,41): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/creative-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.app.json'. Projects must list all files or use an 'include' pattern.
tests/fixtures/local-leaderboard-real.tsx(17,34): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/local-leaderboard-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.app.json'. Projects must list all files or use an 'include' pattern.
  The file is in the program because:
    Imported via './local-leaderboard-api' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/local-leaderboard-real.tsx'
    Imported via './local-leaderboard-api' from file 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/local-leaderboard.tsx'
tests/fixtures/save-repository.tsx(2,40): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/save-repository-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.app.json'. Projects must list all files or use an 'include' pattern.
tests/fixtures/state-integration.tsx(12,42): error TS6307: File 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tests/fixtures/state-integration-api.ts' is not listed within the file list of project 'C:/Users/alexb/Documents/ChatGPT/Learning is Fun/tsconfig.app.json'. Projects must list all files or use an 'include' pattern.
[ELIFECYCLE] Command failed with exit code 1.
$ tsc -b
```

All six diagnostics belong to the tooling-owned `tsconfig.app.json` composite membership: its include lists `src` and fixture TSX, but omits imported `tests/fixtures/*-api.ts`. Affected imports are adult, audio, creative, Hall, save repository and state integration. No source-semantic error was reported. These are not transient creative-source errors and do not invalidate accepted producer checks. The app config was not changed. A narrow follow-up candidate is adding `tests/fixtures/*-api.ts` to the app include while retaining its existing DOM/JSX/composite boundary; Controller must release that distinct path before implementation and appropriate private app/root verification. Do not edit component source to compensate.

**Intermediate disposition before app-path release: accepted Node correction applied and verified; root typecheck blocked by six app-config membership errors. No broad build, test matrix, dependency change or browser recovery was performed.**

## Final two-configuration correction — complete root PASS

Controller released `tsconfig.app.json` as the same continuing tooling investigation. Before editing, reproduced its six original TS6307 diagnostics with composite retained and a private cache; this output equals the six TypeScript diagnostics in the root failure retained above. Private `app-refined.json` extends the actual app project, adds only the fixture API include pattern (absolute paths in the relocated harness), and overrides its cache path. Its no-emit compile, file list and effective options all pass, exit 0. Evidence: `C:/Users/alexb/AppData/Local/Temp/app-project-refinement-ZcUj8F`.

After that private causal check, applied exactly:

```diff
-  "include": ["src", "tests/fixtures/**/*.tsx"],
+  "include": ["src", "tests/fixtures/**/*.tsx", "tests/fixtures/*-api.ts"],
```

The applied app project was then checked with a fresh private cache: compile/list-files/show-config all exit 0. Its strict=true, composite=true, ES2022 + DOM + DOM.Iterable, react-jsx, types=[], verbatimModuleSyntax=true and worker exclusion are preserved. All seven erased fixture APIs are in the app file list. The matched Node boundary was not broadened. Root solution references and worker config are unchanged.

Reran the original complete supported `pnpm run typecheck` (`tsc -b`) after the app fix: **PASS, exit 0, no diagnostics**, at 05:06:38 BST. This is the second authorized root invocation: first red localized app membership; second green closes the integrated flow. No new causal errors appeared. Final evidence: `C:\Users\alexb\AppData\Local\Temp\node-app-project-final-71Kj9J`; exact command arguments, exit codes, timestamps, file lists/options and output are retained in adjacent files.

```text
$ tsc -b
```

Byte comparisons against the original captured configs establish precisely two authored configuration line changes. Source/API files, dependencies, root/worker configs and shared status remain outside this worker’s mutations. No Git mutation or broad build/test/browser run was performed.

| Final path | SHA-256 |
|---|---|
| `tsconfig.json` | `bcf16541ddda80ac1f0a629ac54f954f2e5de303f25d121f86351d3266787ecb` |
| `tsconfig.node.json` | `c562fed04d69f1dab71ef3cfd6d9bed7a068fccd42245b38478f742e353ff805` |
| `tsconfig.app.json` | `cd75a3dfaaa4981d6e946c7111e06d260772bc15a4b4bdb1c2b856fa0a620995` |
| `tsconfig.sw.json` | `347c948e018ae13ea871206370bac8b888ec1b0bc20307a4ba8fa6cf36f1fd15` |

**Final configuration disposition: Node and app membership defects corrected at their tooling-owned configuration layers; supported integrated root typecheck PASS. No remaining configuration repair is pending from this investigation. Controller owns integration/status/commit.**

## D3 Firefox via free Ubuntu Actions — feasibility only

Preparation requested by Controller; no CI/config/dependency/source or external write was made. Windows activation failure was not repeated. Public `alexbrasier451-tech/Learning-is-Fun` source/workflow push and execution are authorized but not yet performed.

**Supported path:** standard `ubuntu-24.04` hosted runner, Node 24, pnpm 11.25.0, frozen install and Playwright 1.64.0 installing its matched Firefox (installed metadata: 157.0/revision 1555) plus Linux dependencies. Standard public-repository runner compute is free; larger runners are paid. Keep compact artifacts within remaining free storage, retention 1 day, no paid overage/cache. [GitHub billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [Playwright matching](https://playwright.dev/docs/browsers), [Ubuntu support](https://playwright.dev/docs/intro#system-requirements).

**Two planned new files; existing owners’ fixtures need no edits:**

- `.github/workflows/d3-firefox-smoke.yml`: one serial Ubuntu job, contents:read, checkout@v6, setup-node@v6 (Node 24), pnpm/action-setup@v6 (11.25.0; no automatic install), commands below and upload-artifact@v5 on success/failure. No deployment/secrets. First authorized push can trigger it; workflow_dispatch requires the workflow on the default branch. [CI setup](https://playwright.dev/docs/ci), [pnpm setup](https://github.com/pnpm/action-setup), [dispatch prerequisite](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch).
- `tests/fixtures/d3-firefox.config.ts`: statically import adult-profiles, local-leaderboard, audio and creative owned configs; select with D3_FIXTURE=adult|hall|audio|creative. Use `defineConfig({...base, ...overrides})`, replacing projects with `[{name:"D3-Firefox",use:{browserName:"firefox",viewport:{width:1280,height:720},hasTouch:false,isMobile:false}}]`; workers=1, fullyParallel=false, forbidOnly=true, retries=0, globalTimeout=300000, `use:{...base.use,trace:"on",screenshot:"on"}`. Preserve selected testMatch/testDir, server/config/baseURL, private output/report paths and teardown. No channel/executable override or project-array merge.

Supply all four imported configs’ required roots: ADULT_VERIFY_ROOT, HALL_VERIFY_ROOT, AUDIO_VERIFY_ROOT and CREATIVE_VERIFY_ROOT, each under `${{ runner.temp }}/d3-firefox/{adult,hall,audio,creative}`; create directories. Set ADULT_REAL_RELEASE=yes for its released binding. Serial calls inherit owned ports 5186/5185/5184/5187 on the isolated CI host.

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm exec playwright --version
pnpm exec playwright install --with-deps firefox
D3_FIXTURE=adult pnpm exec playwright test --config tests/fixtures/d3-firefox.config.ts --project D3-Firefox --grep "two-step adult entry|producer evidence separates|actual facade four-profile"
D3_FIXTURE=hall pnpm exec playwright test --config tests/fixtures/d3-firefox.config.ts --project D3-Firefox --grep "20/20/10/0 ties|keyboard and touch history/back|real facade opening refreshes"
D3_FIXTURE=audio pnpm exec playwright test --config tests/fixtures/d3-firefox.config.ts --project D3-Firefox --grep "first visit is silent; keyboard controls|real facade profiles and visibility hook"
D3_FIXTURE=creative pnpm exec playwright test --config tests/fixtures/d3-firefox.config.ts --project D3-Firefox --grep "scarf: free preview|approved help remains hidden"
```

This selects guarded adult/progress/profile/preferences/backup routes (3), Hall/ranks/history/back/real opening (3), Sound controls and real lifecycle (2), creative preview/save/reload and companion help/read/stop (2). Verify 3/3/2/2 discovery with --list after writing the adapter; require all 10 pass, zero skip/fail/flaky, and update selections if accepted titles change. Sources remain at one known commit.

Retain jobURL/commit, OS, Playwright and actual launched Firefox version (Hall beforeAll/real-case attachments), four results.json files, screenshots/traces. Inspect rendered relevant states and exceptions; a green job alone is insufficient. Upload the four private output roots within the free artifact allowance.

**A reviewed pass supports D3 component smoke:** matched Firefox on Linux, selected actual views/routes, keyboard focus and coded native-storage/facade/lifecycle behavior at 1280×720. It does not require every D1/T1 finite-state journey. It proves no published HTTPS/offline/service-worker behavior, final integrated-game D3 routes, D1/Edge substitution or D1 agent journey, OS voices/heard audio, Windows launch, physical/child testing or whole-package completion. Speech here is simulated. Native Linux media availability is an execution dependency; failures must be diagnosed, never skipped/waived. [Platform media differences](https://playwright.dev/docs/browsers#firefox).

**Concrete prerequisites:** root typecheck is now green; Controller must accept/freeze components, write/discovery-check the two planned CI files in a released window, then push reproducible source+lockfile/assets/workflow with authenticated workflow-write authority. Actions must be enabled and registry/browserCDN/Linux package downloads reachable. No paid service/custom agent gateway/dependency update/publication is needed for this fixture smoke. Final-shell relevant routes still need actual published D3 smoke after deployment: the existing root published D3 project requires an HTTPS entry and published specs, which do not exist yet. D1 Edge-primary remains a separate pending user decision.

**Disposition: feasibility recorded; no remote Firefox run or D3 acceptance has occurred.**
