# WP01-02A — Independent shell and assembled M1 integration review

9 October 2026. **Corrected-candidate technical review PASS: F01 is independently closed; no actionable P1/P2 findings remain.** The original failed review and its exact evidence are retained below as history, followed by the independent correction recheck. Actual shell D3 and whole-child administrative acceptance remain Controller-owned and pending. No production fix was made by this reviewer.

**Corrected source-read freeze and port 5195 are released.** The recheck server was stopped and the final TCP connection was refused (`R/F01-server-release.txt`). No more browser probes are running. The candidate is ready for Controller commit and exact-candidate D3; physical-device, acoustic, published and release acceptance remain downstream.

## Reviewed boundary and evidence identity

Read GLOBAL_RULES, WP01-02A, its handoff, foundation navigation/lifecycle interfaces, and relevant accepted facade/preference, Adventure/activity StrictMode, audio, profile/adult and Hall contracts/handoffs. This is one shell integration review, not fresh unrelated producer audits. Root StrictMode remains enabled. Consumed the independently reviewed activity correction and its changed-candidate six-case D3 closure at `df331762ad23195c152e4c4491febb3882999e31`; that producer result is not shell D3 evidence.

- Author evidence **A**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d`.
- Independent evidence **R**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12025-a68f-75e0-b9c7-574993834af7`.

Recomputed all nine measured handoff paths, including unchanged navigation, and all ten producer measurements. Every byte/hash identity matched the handoff before review and remained unchanged after the final probe (`R/review-hashes-before.json`, `review-hashes-after.json`). Source/configuration/shared tests, assets, instructions, Git and shared status were not written. Repository writes are limited to this report; runners, compiler caches, build output, probes and evidence are private. No installs, delegation or other-chat messages occurred. Used the ordinary writer, standard build protocol once, and a report-only Logic-Flow Diagnosis loop for the new failure.

## Original F01 — P2: leave suspension is retained as an interactive activity (now closed)

**Earliest causal owner: WP01-02A, `src/app/AppShell.tsx:94` (the saveOnly branch after the suspension at line 86), and the same mounted AdventureView identity used by same-view navigation.** This requires the original shell owner, not a producer-side relaxation of suspended-episode rules.

Exact original complete input, installed Chrome 155.0.8059.40, 1366×768, new isolated browser context, actual `/playtest/` root and `APP_BUILD_ID=local-wp01-02a`:

1. Add explorer **Hazel**, select Hazel, choose **Meet Pip at the bridge**, then **A Bridge Back Home**.
2. Use Enter on **Choose 3 metre plank**, then Enter on **Place selected plank at the end**. Visible summary is one plank / three metres.
3. Click the shell **Save progress**. The shell reports **Your progress is saved.**
4. Use the same keyboard route to attempt another three-metre plank and a six-metre plank, then click **Check my idea**.
5. Expected: an honestly navigated/reopened usable activity, or continued active editing with a valid producer-owned save contract. Observed: the old bridge remains on screen with enabled-looking controls, its draft stays `[3]`, Check dispatches nothing, and no feedback appears. The failure is repeatable; the unchanged original case failed twice.

The original receipt has epoch `2480ffbb-1c61-444e-95b9-e9e9aa01d3a1`, revision 4, encounter `1303504e-9556-47fa-acec-bf2d84e7ed3f`, episode ordinal 1, status `suspended`, zero valid Checks, and saved draft `[3]`. The captured command stream after opening contains exactly one acknowledged `SuspendEncounter`; subsequent attempted edits/Check leave that revision unchanged. Readiness truthfully reports ready because the suspension was saved; that does not make the retained activity interactive.

| Checkpoint | Observed meaning | Assessment |
| --- | --- | --- |
| Real active draft before action | Open episode, `[3]`, dirty panel | Correct |
| Panel `suspend()` → actual facade/native IDB | Acknowledged suspended episode and `[3]` | Correct producer leave contract |
| Shell saveOnly continuation | Flushes, reports saved, returns while preserving the suspended activity instance | **First incorrect composition checkpoint** |
| Producer `edit` / `submitDraft` | Refuses an episode whose status is not open | Correct downstream guard; do not bypass it |
| UI after attempted continuation | Old controls remain visible, no mutation or Check | User-visible failure |

Controller-requested focused variant also reproduces: replace step 3 with the **Adventure** button in navigation **Your story**. The shell suspends successfully, but setting the already-current world destination retains the AdventureView keyed only by profile/epoch and its internal activity. The same attempted 3+6 continuation and Check do nothing. This is the same F01 defect class, not a second unrelated finding.

**Proposed owner contract:** after a successful leave suspension, shell routing must not present that retained suspended binding as an editable active activity. Resolve same-destination navigation deliberately before/after the guard; make Save progress either complete a truthful leave/return through existing producer navigation, or obtain an explicitly agreed non-leaving save/resume contract if remaining in the editor is intended. Keep producer ownership of drafts, episode transitions, attempts, help and rewards. Do not fabricate a draft copy, silently dispatch finish-practice, or make suspended sessions accept edits as a downstream workaround.

Evidence: `R/independent.spec.mjs`; `independent-original-results.json`; decoded `save-after-save.json`, `save-final-receipt.json`, `save-final-screen.png`; repeated original `independent-save-results.json` and `independent-save-output/.../trace.zip`; variant `independent-adventure-results.json` and `independent-adventure-output/.../trace.zip`. The browser wrappers only record actual dispatch/result envelopes. The real facade, native IDB and producer session perform all operations. Each private probe disposes the actual runtime before context closure.

**Required closure:** original owner correction, then rerun the complete original Save progress input and same-view Adventure variant, related failure/retry/discard behavior, the four existing shell cases and proportionate affected checks. No corrected-candidate pass is claimed yet.

## Evidence independently checked and exercised

Decoded A's final JSON reports and actual save/status attachments into `R/author-evidence-review.json` and per-scenario JSON. `results-final.json` contains 12 passes (D1/T1/T2); `results-final-edge.json` contains four D2 passes. All are retry 0, no skips/flaky/unexpected/report errors. The attachments support the original 6+6 successful Check (40 lifetime points), held original-profile operation, failed suspension with retained dirty draft, later exact retry/conflict path, safe discard with an independent facade `failedCommand` still true, orphan readiness, epoch replacement and deleted-owner chooser behavior. Inspected the spec's exact-envelope comparison and actual native-write abort hooks. These sixteen passing cases do not cover F01.

| Independent check | Result |
| --- | --- |
| Four unchanged root shell cases, D1 Chrome, one worker, zero retries | **4 passed**; `R/results-independent-d1.json` |
| Fresh 2+4+6 bridge, 200% portrait, reduced motion, music credits keyboard traversal and Help Escape/opener return | **PASS**; `R/independent-focus-pass-results.json`, `credits-200.png` |
| Original Save progress case and focused same-view Adventure variant | **FAIL, F01**, preserved above |
| Complete focused state/audio unit suites | **218 passed, six files**; `R/focused-checks.log` |
| App / Node / worker typechecks with private build-info output | **PASS**; private `tsconfig.*.json` and logs |
| Actual production build at `/Learning-is-Fun/`, private output/cache | **PASS**; `R/build.log`; same nonfatal 589.08 kB entry warning |
| Production bundle inspection | No `__shellRuntime` or fixture-entry marker found |

The first private Node typecheck needed an explicit path to the repository's existing `node_modules/@types` because the extending config lives outside the repository; corrected private config passes. No dependency was added. The first new focus assertion incorrectly required an outline when Chrome's native Tab cycle moved focus out to browser UI (`document.activeElement` reports BODY). Actual app controls were visible and outlined. Excluding that browser-level stop fixed the probe; its complete original 2+4+6 → Help/credits → Escape case passed. The original failed report is retained, not counted as a product finding.

## Integration conclusions outside F01

One runtime is constructed outside routing/StrictMode; facade and audio preference subscriptions, synchronous live gate, lifecycle disposal and context snapshots use producer ports. No duplicate domain store/player or reward/evaluation authority was introduced. Source review and accepted corrected producer subscription evidence support reversible activity connection and disposal; the root rerun confirms repeated navigation retains one native audio graph and disposed callbacks do not publish. This does not mean every legitimate React consumer shares one total listener.

Guard capture checks registration identity, selected owner, target existence and save epoch. Pending UI rejects additional requests; failure retains the old binding and exact retry path. Live readiness includes panel status, guard work and unresolved failure; stale cleanup cannot clear a replacement, and orphan dirty state blocks. Explicit discard does not erase independent facade failures. Epoch reset/deleted owner ignores late leave completion and renders an unselected chooser. F01 concerns the successful guard's retained-view continuation.

Audio evidence covers loaded-before-enable startup, unrelated-click silence, native delayed decode followed by immediate Silence all and failed IDB preference persistence, explicit owner retry, retained mute/zero/latch across reload, pause/pagehide/pageshow and unavailable/read-failed written fallback. Accepted producer race tests supply pending-resume and preference-generation permutations; no second player was built. Windows WebKit lacks native AudioContext in the cited author run, so its evidence is fallback behavior, not native playback. No listening/acoustic inference is made.

Visually inspected original D1 activity and T2 200% portrait captures plus the fresh 200% credits capture. They show readable reflow, written instructions, native controls and visible focus; the focus probe confirms credits links remain keyboard reachable and unobscured. Both licensed tracks expose attribution, source, licence and modification text from the accepted register. Author touch/rotation checks and fresh D1 dialog/focus/layout results are retained. This is bounded technical evidence, not WCAG certification or physical tablet acceptance.

**Original disposition, superseded by the recheck below:** return F01 to the original shell author. The remaining examined composition paths had no additional actionable P1/P2 finding.

## Independent F01 correction recheck — 9 October 2026

**PASS.** Resumed only after Controller confirmed the author's final source freeze and release of 5195. Reviewed the updated handoff, changed AppShell continuation and extended existing cases. The correction changes only AppShell and the shell spec among the nineteen measured source/test/producer paths. All current measurements match the updated handoff before probing and remain identical afterwards (`R/F01-hashes-before.json`, `F01-hashes-after.json`).

| Corrected file | Bytes | SHA-256 |
| --- | ---: | --- |
| `src/app/AppShell.tsx` | 16094 | `38f17645c88ca2713846723136e6eb14b88c33f6802db787014e1d3530e3042e` |
| `tests/platform/shell.spec.ts` | 28359 | `aaa29b81fbd0e943936972b82798ce6c57859f213f0a7f9d83fd5146493b2843` |

The shell's tab-transient adventure visit counter changes the mounted AdventureView identity only after the existing guard permits the requested destination. Successful Save progress with a registered panel awaits facade flush, rechecks the captured binding, stops reading and returns to a new producer overview. Same-view Adventure also reaches a new overview. Failed suspension exits before any remount. The producer's existing Resume action owns reopening; the shell does not allocate an encounter, reopen an episode, copy a draft or weaken suspended-session rules. Flush can remain blocked by an independent facade failure: the saved activity still returns to the overview with specific partial-save wording, while that failure remains in readiness. Registration/profile/epoch validation, failure/discard paths and producer ownership remain intact.

Ran `node node_modules/@playwright/test/cli.js test --config R/F01-recheck.config.mjs` against the actual root app, real facade/native IDB/audio, StrictMode, private cache/output, installed Chrome and one browser worker. **Three complete cases passed, retry 0, no skipped/unexpected/flaky results or report errors, 5.069 seconds.** The two original Hazel inputs preserve their original 3 → action → additional 3+6 → Check journey; the only behavioral adaptation is the explicitly accepted truthful overview → producer Resume step. They are not replaced by a fixture-only or component check.

| Case | Independent result |
| --- | --- |
| Original Hazel Save progress | Old editor absent after save; overview resumes saved `[3]` into the same encounter, canonical question, opportunity and episode ordinal 1. Additional 3+6 edits work; first real Check succeeds with `[3,3,6]`, one valid Check and 40 lifetime points. Recorded commands are exactly acknowledged SuspendEncounter → OpenEncounter → SubmitCheck. |
| Original Hazel same-view Adventure | Same complete successful path, with the original navigation button instead of Save. Explicit overview replaces the old editor, and Resume preserves the binding before the successful first Check. |
| Related failed Save / exact retry / partial flush, with prior Check and hint | Start with an incorrect three-metre Check and `bridge-look` hint; extend the live draft to `[3,3]`. Abort native suspension write. The snapshot stays unchanged, the live draft remains visible and dirty/failed, and the panel remains mounted. Abort a separate RenameProfile, then retry the original suspension. Retry command is structurally identical, commits, clears only panel transient flags, and presents the partial-save message with `ready=false`, `failedCommand=true`. Producer Resume retains the same encounter/opportunity/ordinal, one prior Check and the hint; adding six and checking succeeds with two cumulative Checks and 30 lifetime points. The unrelated failed rename still blocks readiness after success. No FinishPractice command occurs. |

The first original's retained encounter is `90ca4cba-5283-44b2-981e-95d3361e0684`, opportunity `9f304058-4714-4d85-bd2f-b820e3413d6f`, epoch `a7c50ae1-bbb9-4587-aa47-ed656e726327`, revisions 4 suspended → 5 resumed → 6 successful Check. The related failure case retains encounter `8ca49256-224c-43e0-83a2-59fc4928dfdb`, opportunity `609ecd66-eca4-4f70-9cee-ae61fabaa480`, epoch `770f7799-09d5-42a1-a5b3-d4fad21d5efe`; revision 5 survives both aborts, exact suspension retry reaches 6, Resume 7 and successful second Check 8. These are actual acknowledged producer receipts, not invented expected state.

Private evidence: `R/F01-recheck.spec.mjs`, `F01-recheck.config.mjs`, `F01-recheck-results.json`, per-case traces/screens in `F01-recheck-output`, and decoded `F01-recheck-results-*-*.json`. `F01-evidence-review.json` also records independent inspection of the author's corrected reports: `A/results-F01-variants.json` (4 D1), `results-F01-edge.json` (4 D2), and `results-F01-tablets.json` (8 T1/T2). All sixteen corrected-candidate cases passed with retry 0 and no report errors, skips, flaky or unexpected outcomes. Decoded the added F01 overview/resumed-Check and failed-save/independent-blocker attachments. The permanent suite remains four cases, including the existing failure/epoch/disposal/audio checks.

Reused unchanged producer evidence and the earlier independently run 218 focused checks, typechecks and private build; no unrelated broad suite was rerun. The author separately records corrected-candidate typecheck/private production build and 218 focused-check passes. No new D3, acoustic, physical-device or publication evidence is asserted.

**Final disposition:** F01 closed; corrected shell technical review PASS. Source is unchanged by this reviewer, port 5195 and source-read freeze are released, and the Controller may commit and execute exact-candidate shell D3. Whole-child administrative acceptance still awaits that evidence and Controller action.
