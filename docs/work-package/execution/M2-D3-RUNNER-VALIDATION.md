# M2 adventure and shell D3 runner — independent validation

11 October 2026. **PASS for the frozen final runner candidate: adventure 11 and shell 6.** No actionable runner issue remains. This amends the earlier adventure-only sign-off, whose applicable checks and frozen identity are retained. Actual Linux Firefox execution and final integrated acceptance remain with Controller.

## Final identity and exact delta

Candidate: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/m2-d3-runner-successor-3dba183-46011684/candidate`.

- Accepted archive base: `3dba18315246be257de595875b05a8c0d7961675`.
- Final freeze-manifest SHA-256: `3a79b9c317959d43ce7a018b9743e06d1096848341843676d47eca5c980c72e9`.
- Final private workflow: 26,616 bytes, SHA-256 `e18423399af010bd23c672d8bdcf5c36fae31c6ee5c98901a70d194b9a37f062`.
- Planned main workflow preserving its newline bytes: 26,210 bytes, SHA-256 `593bce3a48eedb4528d4c65efef0b40cea73d020df323bcab3ec97ada1a24c4e`.

Relative to the reviewed adventure-only predecessor, the sole workflow delta is exactly three `shell: { shell: 4 }` → `shell: { shell: 6 }` replacements. Adventure remains eleven in Prepare, discovery and results. Every other workflow byte is unchanged. Relative to the accepted archive, the combined delta is only three adventure 7→11 and three shell 4→6 values.

| Integration alternative | Bytes | SHA-256 |
|---|---:|---|
| Combined patch from accepted archive | 2653 | `ea6358791234a7772fc7bb2c55f79126b55fcca1a238ade370aa30a424aaef94` |
| Shell-only patch from reviewed predecessor | 2656 | `0433f96348350994562a1202151072f67d83cd29f7fb7c9416685028eaa61eba` |

These are alternative preimages, not cumulative patches. Main’s recorded raw preimage remains 26,207 bytes, SHA-256 `6d177e29a9b2c8f5ece9bc276989e70dde635a343f791cb2d8ce5c226f8a9f15`; archive/private and main newline identities were checked separately.

The unchanged remainder preserves components 3/3/2/2, offline 4, published 1, permissions, dispatch options, job settings, matched Firefox installation, native audio readiness/cleanup, log bounds, artifacts and strict validation. Published still means the existing M1 ledger/starter smoke; no M2 published extension is included. Only workflow and revised handoff are deliverables.

## Applicable predecessor review and frozen inputs

The original `m2-d3-runner-3dba183-713c325c` candidate remains immutable. Its freeze-manifest SHA-256 `0aa15751e775ea1078ed33d301f2989be6191b5f8a54e222852c3be0d15bcfbf`, workflow SHA-256 `89f0c50491bce8c538663e6ba684bf58c2b4186216557d80f7e9f66c7815aba1`, and owned handoff bytes still match. Its **48-check PASS**, including fresh eleven-title collection and strict adventure rejection probes, remains applicable. The earlier report is preserved in the new reviewer-private output as `prior-adventure-validation.md`; original review evidence remains at `C:/Users/alexb/AppData/Local/Temp/m2-d3-runner-independent-fb4d325e45b3429ba21f440cc4090f18`.

Independently checked 33 relevant successor source/config/input/proof files against the final freeze. All thirteen copied world/shell inputs match their pinned records. The ten world inputs are byte-identical to the predecessor collection copy, with original composition identity `cbda1df5a85de84601709eda48259d25531726c4a50dc85de141b38157d5213b`. Shell activation identity is `5ce8ff487121b437bcb672564b801b6a26b9a05c9e25d3ce547f740407bd8538`.

| Frozen test input | Bytes | SHA-256 |
|---|---:|---|
| `tests/browser/experience.spec.ts` | 57051 | `04765294a1be7cdeaedd635d2d9f66ce969ad8bd78ed967bc8861b335f50db03` |
| `tests/platform/shell.spec.ts` | 48970 | `b2d6e88ef89a103988f8d18ce4b6183b69eb846553693ee5df421554c5f0764a` |

This retains the pre-copy world revision before the separate display-sentence correction. Tests/titles are unchanged, so that prose correction does not invalidate the runner collection evidence or require a behavior replay here. World/shell behavior acceptance remains outside this tooling review.

## Fresh collection and strict gates

Fresh direct bundled Node / Playwright CLI `--list --project D3-Firefox --reporter=json` found **eleven adventure and six shell cases**, matching every frozen expected title in order. Actual Prepare generated each exact selection/count with private roots containing spaces. The accepted D3 config is byte-identical across predecessor and successor probes: one Firefox project, one worker, zero retries, `forbidOnly`, retained trace/screenshots and timeouts. No alternate config or title filter was introduced; `M2_SHELL_STARTER` was removed from the fresh environment.

The six shell titles are:

1. M2 root activation continues genuine M1 progress and commits a new required activity
2. real shell keyboard, help focus, Hall, adult barrier and supported reflow
3. composite music credits retain component rights and wrap in Help
4. two-profile suspension failure, exact retry, safe discard and live readiness
5. native audio cold start, pending decode silence, channels, pause, reload and failed read recovery
6. token registry stale cleanup, live readiness, guarded pending epoch replacement and disposal

All six embedded Node scripts pass fresh syntax checks. The actual delivered discovery gates accept both fresh reports. Actual result gates reject both list-only reports as execution evidence and accept correctly sized synthetic pass models only. Fresh shell probes reject counts 0/4/5/7, wrong project, report errors, unknown selection, wrong expected count, unexpected/flaky/skipped statistics, expected failure, missing/extra attempts and failed/skipped/timed-out attempts. The result contract remains exact count, `D3-Firefox`, expected passed status and one passed attempt, with retries disabled.

The author’s retained **52 gate cases** have their expected exits and are supporting collection/model evidence. Synthetic reports and validator console wording do not establish a Firefox pass.

## Concurrent caches and immutable boundary

The successor’s recorded before/after inventories have exactly two differences: `.vite-temp` directory mtime and `.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json` bytes/hash/mtime. The other **15,287 records match**, including installed package files, links, shims and lock metadata. Full cache equality is not claimed.

The original verifier exited 1 at the full-snapshot assertion after successful collection and gate checks. Its unchanged reconciliation accurately records that writer identity was not observed at that time and that both cache mtimes predate verifier creation/collection. The separate `m2-d3-runner-successor-3dba183-46011684-controller-cache-attribution.json` supplement identifies Controller’s authorized concurrent main verification: 86/86 tests, full root TypeScript, Vite production build and precache verification, without pnpm/install or shim/lock changes. That attribution comes from Controller’s confirmation, not a newly inferred forensic observation.

Supplement SHA-256: `8570aefaa96c65fc13cd3a80d5a65b170c6021e79d7f9729836c3164d8170595`. It applies to this exact final freeze and adds attribution without modifying the frozen evidence. No cache restoration, unrelated rerun or new shared-cache audit was performed.

## Completion and evidence

**52 independent successor checks passed; zero failures**, with the prior 48-check adventure review retained. Reviewer-private output: `C:/Users/alexb/AppData/Local/Temp/m2-d3-successor-independent-e9e0588fb8fa4750aa60749e07d825d5`. It contains `independent-validation.json`, two fresh collection reports/receipts, extracted actual scripts, private Prepare outputs, the copied attribution supplement, original report and preservation records. All 33 selected frozen files, predecessor owned files and seven captured immutable main source/dependency files remained unchanged through these checks.

Only this amended main report and private output were written. No browser/server, pnpm/install, shared dependency mutation, remote workflow, Git/deployment mutation, STATUS edit, worker or other-chat message occurred. The combined adventure 11 / shell 6 runner is ready for Controller’s integration and actual Linux Firefox dispatch after source reviews.
