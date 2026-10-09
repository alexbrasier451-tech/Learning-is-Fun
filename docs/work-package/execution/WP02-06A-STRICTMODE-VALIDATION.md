# WP02-06A StrictMode correction — independent validation

9 October 2026. **Technical review PASS; no actionable findings. Changed-candidate D3 remains pending and Controller-owned.** Both original complete root-app D1 scenarios now have passing evidence. This is a narrow correction review, not a new shell acceptance or a replacement for the previously accepted whole-child review.

## Scope and causal assessment

Reviewed the author correction report and the four changed source/test files against the accepted baseline. The failure is owned by the activity session lifecycle: a render-time subscription could survive a discarded StrictMode render, while cleanup permanently disposed the retained memoized session before effect replay registered it again. The resulting live panel could not mutate its draft or submit Check. No evaluator or persistence compensation was required.

The correction removes the constructor subscription and makes effect setup/cleanup reversibly connect/disconnect the session. Setup synchronizes the projection; cleanup unsubscribes, stops reading and unregisters the panel. It preserves draft, exact retry envelope and lifecycle identity during replay. A real remount creates a new session. React owns external-store listener cleanup.

Captured profile, encounter, epoch and learning-episode checks remain intact. The command microtask rechecks the binding before dispatch. An already-dispatched command can commit for its captured owner after detachment, but the disconnected session cannot process UI completion callbacks or notify listeners. The operation-specific finally path settles pending state without overwriting a newer operation. No new reward, grading, routing or runtime behavior was introduced.

The fixture uses actual StrictMode and a pass-through subscription counter around the real facade. The forced-remount diagnostic changes a React key, not saved progression. The extended existing two-profile test checks three leave/resume cycles, one subscription per active session, retained saved draft, held Check disposal, captured-owner persistence, readiness settlement and absence of stale celebration. The suite still has six cases.

## Evidence inspected and independently exercised

Author evidence root **A**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11fd0-2521-7fc1-87cc-43d4c52e7995`.

- `A/results-strictmode-final.json`: six passes each for D1 Chrome, D2 Edge and T1 Chromium touch; T2 had five passes and one subscription-timing assertion failure. The assertion observed a visible heading before the passive effect connected (2 versus 3 subscriptions). The final test polls the actual connection/cleanup count.
- `A/results-strictmode-webkit-closure.json`: all six T2 WebKit cases pass, first attempt, with no skips or flaky results. Therefore all six cases have passing coverage across all four projects, across reports; this is not a claim of one all-green 24-case run. Earlier selector and timing failures remain retained in the author's evidence.
- Decoded the extended T2 command/save attachment: final facade ready, zero pending commands, no active panel, two baseline subscriptions; First retains its 6+6 Q1 result and Second its distinct 2+4+6 Q1 result, each with one valid Check and episode ordinal 1. This agrees with the reviewed captured-owner and disposal assertions.
- The author records passing strict source/host and Node-only typechecks and four pure world tests. Those unrelated checks were not repeated by this reviewer.

Independent evidence root **R**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11ff1-b321-7d32-898b-4aad7a6c65b7`.

Ran `R/strictmode-probe.spec.mjs` through private `R/strictmode.config.mjs` against the frozen producer fixture on port 5194, Chrome **155.0.8059.40**. **1 passed, retry 0, no errors or skips** (`R/strictmode-results.json`, retained trace and decoded JSON attachment).

The fresh case creates Hazel, places a three-metre plank and observes dirty=true. A native save abort retains the dirty draft; retry submits the byte-equivalent structured command envelope and clears dirty only after save. A held hint is then dispatched and the world forcibly remounted. Subscription count returns to baseline 2 and the active panel is null. Releasing the hint commits assistance for the original encounter, returns the facade to ready and creates no stale companion/celebration. Reopening displays the committed hint and three-metre draft, with one valid Check, unchanged episode ordinal 1 and no completed quest. Leaving returns subscriptions to 2 again. The evidence includes the StrictMode register/unregister/register sequence. The fixture database close ran; the reviewer's server close returned HTTP 200 and its process exited 0. Port 5195 was not used.

## Original integrated-case closure

Shell-owner evidence root **S**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d`.

Independently inspected the JSON results, rather than relying only on the correction report:

- `S/results-d1-layout.json`: `real shell keyboard, help focus, Hall, adult barrier and supported reflow` passes, retry 0, no errors.
- `S/results-d1-shell-correction.json`: `two-profile suspension failure, exact retry, safe discard and live readiness` passes, retry 0, no errors.

These are two full scenario passes in separate reports. The latter report also retains the first scenario's intermediate ambiguous Hall locator failure; the layout report closes that complete scenario. The earlier `results-d1-producer-correction.json` recovered the original 6+6 successful-feedback and dirty-state checkpoints but failed later shell checkpoints, so it is not counted as a complete pass. The shell owner supplied the subsequent shell focus/locator correction and integrated reruns; this review changed no shell files.

## Reviewed frozen identity and remaining gate

Recomputed all four hashes after the independent probe; they match `A/strictmode-hashes.json` (manifest base HEAD `5d94d332df06de7365ba8b68e854db54dcf188d2`).

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `src/experience/QuestActivity.tsx` | 18620 | `e4a34dac6e815b5a03de8a7bf8f7c41c77c518cdd14522799cc80c5ceb0632e2` |
| `tests/fixtures/adventure.tsx` | 12337 | `35a21b7996308fa7bc8167d82a3fe18f29d006ec24704531c2acf4b8e33a63dd` |
| `tests/fixtures/adventure-api.ts` | 1061 | `dbe59e5f18eaaa1d1e3998cdcd5e80b6f58a5ecf24d9aa584615680133df970c` |
| `tests/browser/experience.spec.ts` | 27454 | `7ae217cad2c921d3a8f91010baaf532d5f285e75fc2cf7055e68500d3f66b1b7` |

Ready for Controller-owned changed-candidate D3. The old accepted candidate's D3 evidence does not validate this change. No new D3, physical-device, acoustic, deployment or whole-shell acceptance is claimed. Reviewer writes are limited to this report and private probe/evidence files; production, shared tests/configuration, status and Git were not modified.
