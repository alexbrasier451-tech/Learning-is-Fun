# Published M2 Linux WebKit CI — independent validation

12 October 2026 follow-up. **PASS for integrating the frozen single-owner tracing correction.** Ten targeted checks close the tracing source finding; the same-case native Linux rerun remains pending. Actual run `38185441804` already closes the HTTP 422 context-scope defect. Both missed-review findings and their retained failure evidence remain below.

## First-dispatch finding — historical

12 October 2026. **The integrated workflow is not ready for dispatch until its evidence-root binding is corrected.** Controller reports that dispatch of source `9ec9cc67d77a2ec4667db63bdfaa4dd500d8b0f3` returned HTTP 422 before job creation: line 16, column 37, `Unrecognized named-value: runner`. The job-level `env.PUBLISHED_WEBKIT_VERIFY_ROOT` uses `${{ runner.temp }}`, which is unavailable in that expression scope. This configuration defect was missed by the prior source review; local typing, config loading and report models did not validate GitHub's workflow context scope.

The original foundation author owns the narrow workflow/runtime environment correction. This reviewer has not changed source. Re-review is limited to the corrected binding, its availability to preparation/config/discovery/runtime/results/artifact steps, and the unchanged private output contract. The prior readiness checks remain historical evidence below; their PASS does not establish dispatch readiness for the affected workflow.

Controller separately reports successful real integrated one-case discovery, strict discovery validation and full main TypeScript checking before dispatch. These are attributed Controller results, not new reviewer checks. No Linux job or native browser execution occurred. The Windows failure remains unresolved. The exact prior report is preserved privately as `prior-prepared-source-validation.md`, SHA-256 `bd51570a7913fc2cf899cd4f786073eabd49d5bd74d6c4e3c18a8247d11318f2`.

## Prior prepared-source review

12 October 2026. **PASS for the frozen prepared source.** No actionable tooling finding remains. This accepts the dedicated manual route and its interface with the independently owned observer. Actual combined one-case discovery, CI execution and native Linux browser evidence remain pending with Controller.

## Frozen delivery

Candidate: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/linux-webkit-e986c68/candidate`.

- Source base: `e986c685ef818717237a4657df1eeeeb53e2755c`.
- Shared head recorded at freeze: `0bb9671793c9d6acc667c81010966025e3d519e3`.
- Freeze-manifest SHA-256: `83e398a7f8465d496ceaff9f615d3563cda68f854f73123f4ae41658cc49e52e`.
- Four-file additive patch: 18,917 bytes, SHA-256 `ef9e40e5d2b628eebbd5e6e0d27349a1ec63ddb7bb9bf712e2a0b02e746c66a8`.

| Owned private deliverable | Bytes | SHA-256 |
|---|---:|---|
| `.github/workflows/published-webkit-observation.yml` | 2659 | `1e20ce429be120846ae34835025e37152d52bdd37c000925da166e792ea31659` |
| `tests/fixtures/published-webkit.config.ts` | 1177 | `a566126ed01eeb7462c28b579d4a022945d1ddb017fbd7a05a6f65d9bb5fdf9f` |
| `tests/fixtures/published-webkit-evidence.ts` | 8793 | `bc97bcac47f96db0971ea1e0894a8cdea8751d9f1fb19dfdfcf5887ad8a1f23a` |
| `docs/work-package/execution/PUBLISHED-WEBKIT-CI-HANDOFF.md` | 5097 | `f370126a9b8cf70b967ace1e061bf208723874c1821b9fe18b0b1c412c98bb96` |

All four exact identities and six selected proof records match the freeze. Eight targeted accepted inputs match their archive/main records and have equivalent normalized content, including Pages, existing D3 workflow/config, package/lock, M2 ledger and the shared evidence helper. No whole-source or dependency audit was performed.

## Route, identity and observer interface

The workflow has only `workflow_dispatch`, `contents: read` and checkout without persisted credentials. Its action versions match the existing D3 route. Ubuntu 24.04, Node 24, pnpm 11.25.0, frozen-lock installation and exact Playwright 1.64.0 checking precede matched `install --with-deps webkit`. Preparation rejects another host, Ubuntu version or Node major. No Pages or existing D3 change is delivered.

The config selects only `tests/playtest/published-webkit.spec.ts`, project `T2-WebKit-touch`, and exact title `Published M2 WebKit touch and scene transport observation`. Full project/file/title matching rejects prefixes, suffixes and other files/projects. It supplies native headless WebKit, touch, 768×1024, Europe/London, reduced motion, one worker, zero retries and one repetition. `forbidOnly`, retained output, traces and screenshots apply; there is no local server, routing, proxy or transport override. Job/case/global limits are 30/10/15 minutes; the observer can tighten its own case timeout.

The actual frozen ledger identifies `011d2afe6e8a2215d4bebdd21787cfaa4f7a9fc9-pages-38177521884-1`. Candidate validation requires its seven nonempty fields and matching canonical HTTPS project URL, base, build, commit and Pages run. It records the raw checkout ledger hash: archive CRLF `13adc8f65963f4e2635320488dc24283ab40a96e96f727ecf343049595f02839`, shared LF `c939b17c55777c9345a67a4bafa81c940ded29110a4444b5d04c76c20a69765f`. Neither local hash is hardcoded into the route. The inventory-location field is validated and excluded from the retained deployment whitelist; its publisher-local file is never opened.

CI source SHA remains independent of the deployed commit. GitHub SHA takes precedence; local use requires an explicit full source SHA. Preparation exports published mode, validated URL and private temporary/cache roots. Modeled preparation checked these contracts without representing a native Linux run.

The observer is intentionally absent from the archive. A narrow read-only check of the current main observer confirms matching title, Linux/WebKit/package assertions, deployed ledger/source conventions and `testInfo.outputPath` attachments. Its semantic journey remains under its original independent review; no duplicate semantic acceptance is claimed.

## Strict gates and retained evidence

Discovery and results require matching source SHA and every retained deployed field, the sole configured project, one worker, zero retries, one repetition, no report errors and exactly the expected file/title/project. Results additionally require one expected pass, zero unexpected/flaky/skipped counts, and exactly one passed attempt at retry zero. List-only reports fail that result gate.

The workflow orders typechecking, exact discovery, native installation/runtime facts, execution and final result validation. Result validation runs after failures unless cancelled. Artifact upload runs always, retaining the private evidence root for seven days; preparation, package facts, reports, gate receipts, runner log and observer output share that root. A successful result gate alone does not certify artifact contents or native execution. Controller must review the uploaded actual observer attachments, traces and screenshots. Package registry browser version is explicitly an expectation; the observer records the actual version.

**29 independent check groups passed; zero failures.** Fresh checks include both authored TypeScript files under strict no-emit checking, native Node 24 helper import, metadata/config/host-preparation models, gate rejection variants and all 53 frozen report models. Fresh real Playwright list-only loading uses the exact config and ledger, returns zero cases with `No tests found`, and fails discovery as expected before observer integration. No surrogate test was created. The author's 84 checks remain supporting preparation evidence, not native browser evidence.

## Completion boundary

Private review evidence: `C:/Users/alexb/AppData/Local/Temp/published-webkit-independent-20981513afb84edbbd7c7ec43ffae7e3`, including `independent-validation.json`, fresh discovery/typecheck receipts and targeted preservation records. The frozen owned files, selected receipts, eight main inputs and original observer retained their checked hashes through verification.

Only this main report and reviewer-private evidence were written. No author source repair, observer change, package/engine installation, browser or transport probe, broad matrix, main build, Git mutation, dispatch, worker or other-chat message occurred. Controller must integrate both reviewed sources, discover the single authored case, dispatch if authorized and assess the actual Linux evidence. The retained Windows native curl-send-55 failure and unknown cause remain unresolved; Linux preparation does not close Windows applicability or the wider T2/Safari matrix.

## Context correction — source finding closed

12 October 2026. **PASS for the frozen correction from `9ec9cc67d77a2ec4667db63bdfaa4dd500d8b0f3`; ready for Controller integration.** Candidate: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/linux-webkit-context-fix-9ec9cc6/candidate`. Freeze-manifest SHA-256: `41e4aa9ee7f0a0688ac3b64bc199ad4bb3999b70af9fb09ba8df230577175b6b`.

| Corrected private deliverable | Bytes | SHA-256 |
|---|---:|---|
| `.github/workflows/published-webkit-observation.yml` | 2790 | `cc4791c29b6de6dce82c4122f0ed0d8de7a64e53e0a0f362c81fa00128e4c0b6` |
| `docs/work-package/execution/PUBLISHED-WEBKIT-CI-HANDOFF.md` | 7746 | `5148bb61781ca13d7e6a8962655a86cc8df7f873f80b41faaace9c884a5635e5` |

The exact workflow delta removes the job-level root expression, defines the same `${{ runner.temp }}/published-webkit` value in the preparation step's `env`, and writes it to `GITHUB_ENV` before invoking preparation. GitHub documents `runner` as available in step environment definitions and `env` as available in step action inputs; job-level environment definitions exclude `runner`. All six remaining expressions use supported scopes. [GitHub context availability](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability).

The preparation step receives the root directly from its own environment. Its quoted single-line `printf` persists that exact value for later steps, including failure handling. Subsequent command steps and the artifact step remain byte-identical: discovery/report redirection, package facts, runner log, adapter runtime/result commands and `${{ env.PUBLISHED_WEBKIT_VERIFY_ROOT }}` artifact input consume the persisted root. GitHub documents environment-file values as available to subsequent job steps. [GitHub environment files](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-environment-variable).

**Nine targeted independent checks passed; zero failures.** Checks pin both corrected files and four focused records, establish the exact delta and supported scopes, model immediate/persisted root continuity with spaces, preserve all downstream bytes, verify six frozen read-only inputs and both main preimages, and retain the first 422 history. The author's eight targeted checks agree. No Bash shell or GitHub runner was executed; persistence verification uses the exact quoted line and the documented environment-file contract. The unchanged adapter/config/test behavior checks were not rerun.

Evidence is retained in the existing private review directory as `context-fix-independent-validation.json`, `context-fix-main-preservation.json` and `dispatch-finding-validation.md`. The original readiness report and missed-context finding remain preserved. Only this report and private evidence were written; no source, browser, CI or Git action occurred. Remote parser acceptance, actual Linux WebKit evidence and the unresolved Windows outcome remain outside this source closure.

## Second run — trace lifecycle finding

12 October 2026. Actual run `38185441804`, source `ed2e4f65ceefb09a3f2a8e0534656c32e426cfe8`, parsed the corrected workflow, prepared its evidence root, installed the native package/engine and passed real exact-case discovery. The earlier HTTP 422 context finding is therefore closed by actual runner acceptance. This does not establish a Linux game outcome.

The sole test failed at observer line 75, column 27: `tracing.start: Tracing has been already started`. The config's automatic `trace: 'on'` and the observer's explicit per-context `tracing.start` both own the same lifecycle. This source-interface conflict was missed by the prepared review, which checked the two tracing mechanisms separately. Failure occurred before app navigation. Actual results contain expected 0, unexpected 1, flaky 0 and skipped 0; the strict result gate correctly rejected the failed result. Controller reports that the execution pipeline step returned tee's zero status; the subsequent result gate kept the job red.

Retained evidence: [results.json](<C:/Users/alexb/Documents/ChatGPT/Learning is Fun/artifacts/ci/M2/ed2e4f6/published-webkit-38185441804/artifact/results.json>) and [result-gate log](<C:/Users/alexb/Documents/ChatGPT/Learning is Fun/artifacts/ci/M2/ed2e4f6/published-webkit-38185441804/run-logs/observe/10_Require one actual pass with no retries or skipped results.txt>). Six targeted artifact records were read and pinned privately in `trace-interface-finding.json`; no archive, browser or broad journey replay was performed. The pre-finding report is preserved as `context-closure-validation.md`, SHA-256 `cc005def8d44ded250343fb3079511c6029d09e6f5798009bd2f5b4e21d756d3`.

The original foundation author owns the minimal config/handoff correction to disable automatic tracing while retaining the observer's manual scope traces, screenshots and evidence. Reviewer has changed no source and will recheck only that lifecycle contract after the refrozen handoff. Linux application behavior remains unobserved; the retained Windows failure remains unresolved.

## Tracing correction — source finding closed

12 October 2026. **PASS for integrating the two-file correction from `ed2e4f65ceefb09a3f2a8e0534656c32e426cfe8`.** Candidate: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/linux-webkit-trace-owner-ed2e4f6/candidate`. Freeze-manifest SHA-256: `2dc157f10bbccb5630f0e74596a0b7d1c5b386b42e2284d17941b89081f8eb2e`.

| Corrected private deliverable | Bytes | SHA-256 |
|---|---:|---|
| `tests/fixtures/published-webkit.config.ts` | 1241 | `8cd0aa9ecce49b75760f1a75e6895f6a0342a1ec78831f28ea23bc79dbb9bc2b` |
| `docs/work-package/execution/PUBLISHED-WEBKIT-CI-HANDOFF.md` | 10484 | `b2741eab2279210782db303c808a36626df399e8a6975d9c1a711686fb0d552b` |

The checked config preimage is 1,177 bytes, SHA-256 `a566126ed01eeb7462c28b579d4a022945d1ddb017fbd7a05a6f65d9bb5fdf9f`; handoff preimage is 7,746 bytes, SHA-256 `5148bb61781ca13d7e6a8962655a86cc8df7f873f80b41faaace9c884a5635e5`. Both agree with main's captured preimages. The exact config delta is automatic `trace: 'on'` → `trace: 'off'` plus the comment assigning per-context trace ownership to the observer. Every other loaded config value is equivalent, including native touch settings, screenshot capture, output preservation, reporting, identity and strict single-case settings.

The unchanged observer contains one authored per-context start site with screenshots/snapshots/sources, one stop site writing its scope ZIP through `testInfo.outputPath`, attachment before context closure, and retained explicit viewport screenshots. The installed Playwright 1.64.0 automatic start/stop hooks were inspected and exercised with disabled automatic options and mock API calls: they neither start nor stop the manually owned trace. This is a JavaScript contract model, not a native lifecycle probe or successful browser run.

**Ten targeted independent checks passed; zero failures.** They pin both deliverables and seven focused records, establish the exact delta and loaded-config equivalence, check the observer's retained lifecycle, replay the authored real one-case discovery through the unchanged gate, and confirm the actual failed run still fails the result gate. The author's six checks and strict TypeScript receipt are supporting evidence. Only the two main preimages and three lifecycle inputs were checked; no broad case/source/dependency audit or browser probe was added.

Private evidence: `trace-owner-independent-validation.json`, `trace-owner-main-preservation.json` and preserved `trace-finding-validation.md` in the existing review directory. The pre-closure finding report hashes to `c299a20cc3554564e8acab078b9d308fd248c0fa1396f7f50fb6c0edf2666a37`. Both prior missed-review histories remain intact. Only this report and private evidence were written. Controller owns integration and the complete same-case Linux rerun; app/visual/scene-transport success remains unverified, and the Windows failure remains unresolved.
