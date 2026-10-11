# Published M2 Linux WebKit CI handoff

Current delivery is a two-file context-scope correction from accepted
`9ec9cc67d77a2ec4667db63bdfaa4dd500d8b0f3`: this handoff and the dedicated
workflow. The original foundation handoff below is retained as stage history;
the final correction section records integration and the failed first dispatch.

Foundation source base: `e986c685ef818717237a4657df1eeeeb53e2755c`.
Controller reports `0bb9671` as a subsequent docs-only advance with unchanged runtime.
This private candidate adds only the four files listed below. It does not change
D3 selections, Pages, packages, the lockfile, application code or the observer's test.

## Owned files and integration seam

- `.github/workflows/published-webkit-observation.yml`
- `tests/fixtures/published-webkit.config.ts`
- `tests/fixtures/published-webkit-evidence.ts`
- `docs/work-package/execution/PUBLISHED-WEBKIT-CI-HANDOFF.md`

The adapter centralizes candidate validation, private evidence preparation,
package/engine registry metadata and strict discovery/result gates. The config
imports these same identities and settings; the workflow invokes the adapter
directly with Node 24's supported TypeScript stripping.

Original observer `01a1299f` owns `tests/playtest/published-webkit.spec.ts`, with
exact title `Published M2 WebKit touch and scene transport observation`.
Project: `T2-WebKit-touch`. This test is intentionally absent from this source
archive. Controller integrates both reviewed sources, then must discover exactly
one real test before dispatch. No surrogate scenario was created.

The observer owns pacing, original Q1–Q6 actions, rotation, root text sizing,
scene/request/signal checks, initial/final service-worker identity and actual
browser-version evidence. Its `testInfo.outputPath` attachments and native
context traces fit the private Playwright output directory. The config supplies
headless native WebKit, touch, 768×1024, Europe/London and reduced motion, with one
worker, zero retries and one repetition. It supplies no routing, cache bypass,
proxy override, navigation workaround, web server or audio capture service.

## Manual route and identities

The workflow has only `workflow_dispatch` and `contents: read`, runs on
Ubuntu 24.04 with Node 24/pnpm 11.25.0/frozen lock/Playwright 1.64.0, and installs
`playwright install --with-deps webkit`. It performs source typechecking, exact
discovery, native execution and strict result validation. Runner/test/global
limits are 30 minutes/10 minutes/15 minutes; the authored scenario can tighten its
own timeout. No deployment or CI dispatch occurs in this worker.

`docs/release/M2/CANDIDATE.json` is the source of deployed identity. The private
base archive's CRLF ledger SHA-256 is
`13adc8f65963f4e2635320488dc24283ab40a96e96f727ecf343049595f02839`;
the shared LF ledger at freeze hashes to
`c939b17c55777c9345a67a4bafa81c940ded29110a4444b5d04c76c20a69765f`.
Their contents match after newline normalization. CI computes the hash of its
actual checkout bytes rather than hardcoding either local hash.
It identifies the frozen live build
`011d2afe6e8a2215d4bebdd21787cfaa4f7a9fc9-pages-38177521884-1` at
`https://alexbrasier451-tech.github.io/Learning-is-Fun/`.
The CI source commit is independently retained from `GITHUB_SHA`; it need not
equal the deployed commit. The local fallback requires an explicit full
`PLAYTEST_CI_SOURCE_COMMIT`. The ledger's Windows inventory path is validated as
a metadata field but never read by this Linux route.

Discovery and result reports must match the recorded source and every whitelisted
deployed field, contain only the exact file/title/project, and use one worker,
zero retries and one repetition. Results additionally require one expected actual
pass, zero unexpected/flaky/skipped, and exactly one passed result at retry zero.

Evidence lives beneath `$RUNNER_TEMP/published-webkit`, including `run.json`,
package registry/version facts, discovery/results/gate receipts, runner log,
traces, screenshots, and the observer's actual engine, worker, request, signal
and visible-image attachments. Artifact upload runs even after failure, with
seven-day retention. Registry browserVersion is explicitly labelled as an
expectation; the observer records the actual browser version. Linux evidence
does not erase Windows failures or close the full T2/Safari matrix.

## Verification and delivery boundary

Strict focused TypeScript checking passed for both authored TS files. The config
loaded in Playwright 1.64.0 using the real ledger and recorded the exact native
context settings. Real discovery rejected the absent observer with `No tests
found`, as expected. All 84 focused metadata/config/report checks passed;
one-test passing report inputs were explicitly synthetic gate models, not test
execution evidence. Read-only installed package registry resolution passed.

No browser was launched, engine installed, local transport probed, package
installed, shared source/dependency file written, Git state changed, worker
created or CI dispatched. No whole-source or shared-cache audit was performed.
The private freeze manifest pins these four source files, targeted accepted
inputs and verification evidence. Original foundation reviewer `01a11da4`
reviews that boundary; Controller owns combined real discovery, integration,
manual dispatch and interpretation of native Linux evidence.

## First-dispatch rejection and context-scope correction

Controller integrated the four reviewed foundation files exactly, verified real
combined discovery, the strict discovery gate and full main TypeScript checking,
then committed and pushed `9ec9cc67d77a2ec4667db63bdfaa4dd500d8b0f3`.
The manual dispatch was rejected with HTTP 422 before any job started:

> Invalid Argument - failed to parse workflow: (Line:16,Col:37): Unrecognized named-value: runner. Located at position1 within expression: runner.temp

The isolated cause is the evidence-root expression in `jobs.observe.env`.
[GitHub's context-availability table](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability)
allows `runner` in step environment definitions, while job environment
definitions exclude it. The corrected workflow defines the same absolute
`${{ runner.temp }}/published-webkit` root in the preparation step's `env`.
That step receives the value immediately, writes it through a quoted `printf`
to `GITHUB_ENV` before invoking preparation, and therefore makes it available
to all later command steps and the existing artifact `env` expression.
[GitHub's environment-file documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-environment-variable)
defines that persistence for subsequent steps.

The root suffix, artifact path, adapter calls, identity/mode preparation,
discovery/result gates, engine settings and single authored case are unchanged.
The adapter, config, scenario and game require no edits. Evidence-root
persistence precedes preparation so later failure handling can still locate the
private root if the preparation command fails.

Targeted verification checks the exact workflow delta, each expression's allowed
context scope, persistence before preparation, and unchanged subsequent steps.
The initial rejection is retained as evidence; no Linux job or browser outcome
is inferred from it. No further browser probe, matrix, install, shared write,
Git mutation or dispatch was performed by this worker. The two-file correction
is frozen for original reviewer `01a11da4`; Controller owns integration and a
new manual dispatch of the same pending authored case. Remote parser acceptance
and the native Linux outcome remain pending that dispatch.
