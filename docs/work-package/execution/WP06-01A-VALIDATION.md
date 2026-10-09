# WP06-01A independent validation

Reviewed 9 October 2026 by the original independent validator. **Current verdict:
PASS for whole WP06-01A foundation tooling readiness.** F1/F2 are closed; the
new actual branded D1 rehearsal closes criteria 2/6, alongside the accepted T1
proof and current D3 Linux evidence. The final recheck below supersedes earlier
blocked verdicts while retaining their evidence. Controller owns acceptance.

Listening remains explicitly unverified, as permitted at this foundation gate.
No published game, complete M1 journey, M2 implementation, release acoustic,
physical-device or child-session acceptance follows from this verdict. Old
Windows CfT/matched-Firefox failures remain historical host evidence; current D3
readiness uses accepted matched Firefox on Linux, without engine substitution.

## Findings for the original scenario author

### F1 — P2: preserve the required journey variants in the manifest

At [SCENARIOS line 116](../../playtests/SCENARIOS.md#m1-scenario-definitions),
M1-Q1 names `[6,6]`, `[4,4,4]` and `[1,2,3,6]` as correct examples, but never
names the required `[3,4,5]` variant or requires the useful incorrect → hint →
retry sequence within the journey. These examples are valid; the defect is
incomplete scenario coverage, not an incorrect evaluator answer.

[WP06-02A criteria 2 and 7](../chunks/WP06-02A.md#acceptance-criteria) require
two bridge constructions, specifically 6+6 and 3+4+5 across bounded runs, a
useful incorrect response followed by hint/retry, and pre-Check attempt/point,
Check and committed-world checkpoints. Following the manifest's present Q1 row
can omit those required variants while satisfying every listed example.

**Requested correction:** explicitly require `[6,6]` and `[3,4,5]` across normal
replay/fresh-profile variants, an owner-grounded incorrect → acknowledged hint →
retry → success case, and the pre-Check/result/committed consequence checkpoints.
Keep the other correct examples as optional alternatives. This is a definition
edit; no new journey run or production fix is requested at this foundation gate.

### F2 — P2: give hinted resume its producer oracle

The M1-TRANSFER-REVISIT, M1-PRACTICE-LIFECYCLE and M1-BACKUP rows (SCENARIOS lines
119, 123 and 125) cover transfer, episode continuation and retained hinted work,
but none requests the distinct story-request-over-optional-resume case or its
expected result. M1-READINESS covers failed saves without requiring help to stay
hidden until its acknowledgment. Consequently a resume that relabels optional
work as story work, loses the retained opportunity on `candidate none`, or
reveals unpaid help is not ruled out by the listed scenario oracles.

The accepted [M1-HELP-RESUME oracle](../../content-review/starter-handoff.md#m1-help-resume)
requires both zero prior Checks and one prior wrong Check. A new Q1 story
request must resume the saved revisit with original reason/binding provenance,
descriptor/revision, draft/help IDs, firstCheckCorrect, cumulative Checks and
opportunity. `candidate none` must not cancel that opportunity. Help/worked
support is saved before text or speech reveal; failed acknowledgment preserves
the prior state. Optional success must not complete required story work or
renew first-attempt reward eligibility.

**Requested correction:** add an explicit row linked to M1-HELP-RESUME, or give
those existing rows a complete named mapping to it, with both histories, failed
help acknowledgment, normal export/reload comparisons and the exact producer
outcomes above. Reuse producer fixtures and UI; introduce no command DTO,
answer hook or competing oracle. The handoff's claim to reuse all seven stable
educational oracles should point to this completed mapping.

These are scenario-definition findings. Neither establishes a production defect.
No helper defect requiring a code change was found.

## Technical assessment and evidence reuse

| Boundary | Assessment |
|---|---|
| Touch API/type compatibility | PASS. Both helpers compile strictly against installed Playwright 1.64.0 with Node-only ES2023 libraries. Only Playwright Page is imported as a type; no production DTO/schema is copied. Chromium, real touch capability, explicit CSS viewport and finite in-bounds endpoints are checked before a session opens. |
| Trusted input and actual handler path | PASS within the accepted fixture. Retained T1 events show trusted touch down/move/up, capture, one moving ghost and response `[]→[2]`. Cancel shows trusted pointercancel/lostcapture, zero ghost and unchanged `[2]`. Inspected drag/cancel screenshots agree. Author native proof also verifies another real tap/place after cancel. No synthetic PointerEvent/legacy TouchEvent or response mutation supplies this result. |
| Exceptional cleanup | PASS. Retained native interrupted-move proof establishes actual cancellation, zero ghost and a working subsequent contact. Fresh browser-free probes independently cover a start that may have delivered before rejection, failed terminal end/cancel, failed cleanup send, and guaranteed detach attempt. A closed/broken transport cannot guarantee native delivery; the helper rejects rather than reporting success. |
| Native tap alternatives | PASS for foundation capability. Attributed T1/T2 tests tap all three actual widgets; WebKit 27.2 starts portrait and retains construction while rotating, then taps a fruit increment. This is not evidence that every final activity was played in both orientations. WebKit CDP drag explicitly rejects. |
| Evidence/schema honesty | PASS. Required URL/build/environment/actions/expectation/observation/status/links/owner/retest/applicability/acoustic fields remain observer-supplied. Actual capture facts are separately named. A real TestInfo sample retains blocked/unverified, null owner/retest/applicability and original screenshot/accessible DOM attachments. Fresh probes show mismatched supplied facts are not silently rewritten into capture facts and capture failure attaches no partial checkpoint. |
| Persistent observation/choice/resume | PASS for T1, BLOCKED for D1. Available node_repl supports persistent bindings. The retained native trace uses one touch Page, 1024×768 and Europe/London; screenshots/ARIA observations precede two separated native taps. About 11 seconds separate initial observation from source selection and 22 seconds separate the selected-state observation from placement. Step rows preserve the choices and actual `[]→[4]` result. The separate drag/cancel artifacts preserve the agent's two-metre choice and subsequent three-metre cancellation. These support the handoff's bounded T1 rehearsal; a trace alone does not prove the agent's internal reasoning. |
| Remaining scenario values | The three story anchors, alternatives, canonical/permanent binding identities, finish/resume Check/episode totals, +20/+10 scoring, 90 lifetime/30 competitive starter total, 620/600/30 cap, closed-week +5/+0 retry, London instants, ties and 52-week retention agree with focused accepted content/learning/reward/calendar/backup handoffs. Raw recovery remains distinct from supported backup. F1/F2 leave scenario completeness open. |
| Audio and M2 boundaries | PASS as definitions/limitations. Two actual runtime loop joins per approved theme and all five named cues require listener observations; technical gain/playback/filenames do not verify acoustics. The unavailable sample is deliberately unverified. Market on the Sea / Sunset Walk approval remains settled. M2 definitions defer actual released mechanics/results/candidate and real native upgrade evidence to their owners; no M2 execution or fresh-import substitute is claimed. |

The readiness table accurately retains D2 Edge 154.0.4258.62, T1 Chromium
156.0.8078.4 and T2 WebKit 27.2 fixture launches, with D1 and D3 blocked and
listening unavailable. [BROWSER-ACTIVATION-DIAGNOSIS](BROWSER-ACTIVATION-DIAGNOSIS.md)
records executable private-assembly binding failures before startup for existing
Stable CfT Chrome and matched Firefox. File metadata, direct manifest activation
and binary presence do not establish running versions. This review proposes no
browser install, host/security change or speculative loader repair.

## Verification actually performed

From the repository, using its bundled Node 24.19.0 and installed TypeScript:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2023 --lib ES2023 --module ESNext --moduleResolution Bundler --types node tests/playtest/helpers/touch.ts tests/playtest/helpers/evidence.ts
```

Exit 0. The same scoped invocation with `--outDir
C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a-validation-01a11e76/compiled`
instead of `--noEmit` produced disposable JS for the independent probes, exit 0.

```text
node C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a-validation-01a11e76/probes.mjs
```

Exit 0: **8 passed, 0 failed, 0 skipped**. These are mocked contract/error-path
checks, expressly not fresh native-touch or browser launch evidence. Sources,
compiled helpers, mock capture outputs, [probe summary](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a-validation-01a11e76/probe-summary.json)
and [review evidence](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a-validation-01a11e76/review-evidence.json)
are retained outside production. No browser or server was launched by this review;
no broad game/matrix/build suite was rerun.

Independently inspected attributed native [author results](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/final-proof/results.json):
10 passed / 5 applicability skips / 0 unexpected / 0 flaky, 14.737 seconds.
T1 is 5 passed; D2 is 2 passed/3 skipped; T2 is 3 passed/2 skipped. Skips are
not mode acceptance. Sources of those probes are retained at
[author probe-source](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/probe-source).

Other inspected primary artifacts are
[drag events](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-selected-drag.json),
[cancel events](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-selected-cancel.json),
their PNGs, the step-0/1/2 checkpoint JSON/DOM/PNG files under
[agent choice artifacts](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/artifacts/playtests/M1/local-wp06-01a/T1/M1-TOOLING-T1-CHOICE),
[choice trace](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-agent-choice.trace.zip),
[evidence trace](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-agent-evidence.trace.zip)
and the real TestInfo blocked/unverified attachment listed in review-evidence.json.
Artifact existence was checked; screenshots were visually inspected, not listened to.

## Reviewed snapshot and recommendation

| Delivered path | Reviewed SHA-256 |
|---|---|
| tests/playtest/helpers/touch.ts | `5bcf1d66fbca5daf3d4cc019364f23a3545eea5a531e20fca084feb731a770f3` |
| tests/playtest/helpers/evidence.ts | `03b0d3996f7758fb9c39aaa950463205b33f4c05cb5eb1490ad734af4694c9a4` |
| docs/playtests/SCENARIOS.md | `d6d790152770ae11eda65f429aa5f3c30e8f7fc321952a08b703bb0096fc816c` |
| docs/work-package/execution/WP06-01A-HANDOFF.md | `c6c1d298d6b6fac69cfe848385407066ad32cf2b375ccba5b9ed6a83929f4cd5` |

**Controller recommendation:** accept the helper technical quality and bounded
T1/T2 proof at these snapshots; return F1/F2 to the sole scenario author and
recheck those definitions after correction. Keep the whole WP06-01A gate
BLOCKED pending real branded D1 launch and observation/choice/resume rehearsal.
Do not substitute T1, Edge, binary metadata or a fixed script. Keep D3's native
activation gap explicit. Unavailable acoustics is permitted for this foundation
handoff and remains a release requirement; do not ask for track selection again.

Only this validation document was added to the repository by this validator.
Private probes/evidence are outside production. Ordinary writer used; unrelated
dirty tracked/untracked files were preserved. No source/helper/config/dependency,
shared status, Git mutation, delegation or other-chat message was performed.

## Independent F1/F2 correction recheck — 9 October 2026

**Verdict at this recheck: F1 and F2 CLOSED. Helper and scenario deliverables are
technically ready within the reviewed foundation boundary. Whole WP06-01A is
still BLOCKED on real branded D1 criteria 2/6.** This narrow recheck supersedes
the initial request to revise SCENARIOS; the initial findings and evidence above
are retained as history. Controller remains the acceptance authority.

The original author changed only SCENARIOS and its handoff for these corrections.
Independently compared the actual corrected definitions with WP06-02A criteria
2/7, the accepted M1-BRIDGE and M1-HELP-RESUME producer oracles, and this review's
requested corrections. The handoff's correction summary agrees with the actual
manifest; it is not used in place of reading that manifest.

| Finding | Exact correction and independent result |
|---|---|
| F1 — required journey variants | **PASS/CLOSED.** SCENARIOS lines 113–128 and M1-Q1 at line 132 require both `[6,6]` and `[3,4,5]` across normal replay/fresh-profile bounded variants. Other correct combinations are optional. The producer-grounded `[5,6]` sum-under response leads through acknowledged hint, valid retry and later success. The definition requires written error-feedback assessment and separates chosen draft/pre-Check attempts/points, explicit Check result/feedback and acknowledged world consequence for every Q1–Q3. Completed-location reopen must retain restoration without renewing rewards. These match WP06-02A criteria 2/7 without claiming those journeys have run. |
| F2 — hinted optional resume | **PASS/CLOSED.** The row at line 136 and complete M1-HELP-RESUME definition at lines 152–188 explicitly require both zero-prior-Check and one-prior-wrong histories. A new Q1 story request resumes the retained revisit with original binding/reason and canonical/encounter identity; descriptor/revision, draft, help, firstCheckCorrect, cumulative Checks and opportunity are compared across normal export/reload. `candidate none` cannot cancel the retained opportunity/components/earning week. Assistance must be acknowledged before text/speech reveal; failure retains prior committed state and offers recovery/retry, with labelled recovery distinct from successful ordinary flush. Optional success adds no required story completion or renewed opportunity/first-attempt eligibility; a later genuine story request obeys sticky history and WP05 eligibility. This maps the accepted producer oracle without adding a DTO, writer or response/progression hook. |

The existing M1-READINESS row still explicitly blocks ordinary export/update
while commands, preferences or panel state are pending/failed; the new help
failure branch preserves that rule and the labelled last-committed recovery
distinction. The correction adds scenario expectations, not an implementation
or a new runtime pass.

Actual checks for this recheck were targeted file reads/`rg` against the corrected
definitions, the producer oracle and journey criteria; SHA-256 comparison of the
two helpers; and a trailing-whitespace scan of this appended report. Helper
hashes exactly match the initially validated snapshots, so the prior strict
typecheck, eight independent probes and attributed native fixture evidence
remain applicable. **No helper probe, typecheck, browser/server launch, game run
or matrix run was repeated.**

| Current reviewed path | SHA-256 |
|---|---|
| tests/playtest/helpers/touch.ts — unchanged | `5bcf1d66fbca5daf3d4cc019364f23a3545eea5a531e20fca084feb731a770f3` |
| tests/playtest/helpers/evidence.ts — unchanged | `03b0d3996f7758fb9c39aaa950463205b33f4c05cb5eb1490ad734af4694c9a4` |
| docs/playtests/SCENARIOS.md — corrected | `a5320ee6239e503eb1c576618193ca090aea5704aae0d7cf82c6d3b91acf60e0` |
| docs/work-package/execution/WP06-01A-HANDOFF.md — corrected | `a607d7aa7545bba57b1acffb408d467c862623f6b94cf18f994265ece9ad62be` |

**Updated Controller recommendation:** accept the helper/scenario technical
deliverables at these snapshots with no open F1/F2 finding. Do not mark whole
WP06-01A complete: D1 has neither a successful branded launch nor the required
agent observation/choice/resume rehearsal. D3 native activation remains open;
no new launch evidence supersedes the retained diagnosis. Listening is still
unverified and permitted only as an explicit foundation gap; actual release
listening remains required. Human track approval is unchanged and no new source
selection is requested. No published-game, release, M2, device/child or acoustic
acceptance is added.

This recheck changed only this validation report. Unrelated concurrent work was
preserved; no production/helper/config/dependency/shared-status/Git mutation,
delegation or other-chat message was performed.

## Final D1 and readiness recheck — 9 October 2026

**Verdict: whole WP06-01A PASS for its defined foundation/helper/scenario boundary.
No remaining blocking finding.** The new D1 evidence closes the last original
criteria 2/6 blocker. F1/F2 remain closed and the unchanged helpers retain their
accepted checks. This is toolkit readiness, not a published adventure or release
acceptance. No mode was waived or replaced with another engine.

### D1 actual launch and agent choice

Independently read the original author's latest handoff and the new retained
[launch record](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-d1-3c4a5ba2-c266-43fd-885a-d4d6250db094/launch.json),
[session header](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-d1-3c4a5ba2-c266-43fd-885a-d4d6250db094/session-header.json),
[rehearsal summary](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-d1-3c4a5ba2-c266-43fd-885a-d4d6250db094/D1-REHEARSAL.json),
all three checkpoint JSON/accessible-DOM files, and the
[native trace](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-d1-3c4a5ba2-c266-43fd-885a-d4d6250db094/D1-agent-choice.trace.zip).
Visually inspected all three original `screen.png` files under
[D1 step artifacts](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-d1-3c4a5ba2-c266-43fd-885a-d4d6250db094/artifacts/playtests/M1/local-wp06-d1/D1/M1-TOOLING-D1-CHOICE).
All referenced screenshot/DOM files exist and contain the stated observations.

The actual runtime is **Google Chrome 155.0.8059.40**: browser.version and CDP
Browser.getVersion product `Chrome/155.0.8059.40` agree. The explicit executable
is the installed Google Chrome at
`C:/Program Files/Google/Chrome/Application/chrome.exe`, with channel `chrome`.
The session is desktop **1366×768**, Europe/London, at the real accepted widget
fixture on private port **5193**. It identifies the fixture and absent scoring/
audio/state ports; it does not pretend to verify a published build.

The trace records one snapshot Page ID throughout
(`page@ea618e3d5eb104350e083c9001e717b6`). Initial screenshot/ARIA observations
precede source focus by about 30 seconds. `Page.keyboardPress` with Enter at
call `jfrn@26` selects the observed three-metre source. The next screenshot/DOM
shows visible focus, pressed/amber selection and an empty response. About 20
seconds later, call `jfrn@40` makes a native locator click on the observed
placement target. The final screenshot/DOM shows the actual placed plank,
response `[3]`, and only select/place draft actions. The calls are native input
and observation APIs, with no answer/progression injection. The step metadata
records the agent's choices and original capture facts. This establishes the
supported inspect→choose→observe→resume route required by criterion 2, together
with the already accepted T1 manipulation/cancel sequence.

The persistent tool's channel lookup initially lacked a drive prefix. Its
supported transient executablePath points to that same installed Chrome; it
does not change the repository configuration or select another engine. The
ordinary project `channel:'chrome'` launch is confirmed separately in the
handoff/rehearsal record and the current foundation capability addendum. The
trace records actual browser behavior, rather than deriving a pass from an
installation claim. No command-line-enumeration or extra automation flag is
required for these original acceptance criteria.

### Consolidated current readiness table

This table completes criterion 6 using the current producer evidence. It
supersedes the earlier D1 blocked text and supplements the handoff's D3 row,
which still described the earlier Windows snapshot. Installed Store Firefox
native launch is distinct from the matched Playwright/Linux D3 route below.

| Required mode | Actual engine, launch and input | Observation/action route and scope limits |
|---|---|---|
| D1, 1366×768 | Installed branded Google Chrome 155.0.8059.40; actual persistent launch; desktop native keyboard/mouse. | Screenshot/accessible DOM → agent choice → native Enter → observed selection → chosen mouse placement → observed `[3]`, same Page, retained trace/checkpoints. Ordinary project Chrome channel works; persistent tool needs the same installed executable's explicit path due its lookup environment. Fixture rehearsal only. |
| D2, 1920×1080 | Microsoft Edge 154.0.4258.62; accepted fixture launch plus current foundation usable real-fixture launch; desktop keyboard/mouse. | Native Playwright input and screenshot/DOM/report/trace observation are available. Reuse accepted D2 evidence and BROWSER-CAPABILITY's fresh Edge check. No full D2 published smoke is claimed here. |
| D3, 1280×720 | Matched Playwright Firefox 157.0, revision 1555, on accepted Ubuntu 24.04; native desktop input, no touch/mobile. | Accepted serial native Playwright fixture CI with retained original screenshots/DOM/checkpoints/traces for agent/reviewer observation. Actual 3 adult + 3 Hall + 2 audio + 2 creative passes, no skips/unexpected/flaky, in run 37889547310. No full agent adventure is required for D3 by this child. Windows Store native launch is not treated as Juggler compatibility, and the old Windows archive failure is not claimed repaired. |
| T1, 1024×768 | Bundled Chromium 156.0.8078.4, hasTouch; accepted actual launch and rehearsal; CDP touch drag/cancel and native taps. | Persistent agent inspect/choose/resume route, trusted touch/capture/visible manipulation/cancel cleanup and retained native artifacts already accepted. Emulated tablet only. |
| T2, 768×1024 with rotation | WebKit 27.2, hasTouch; accepted native tap and rotation proof. | Existing Playwright screenshot/accessible DOM/report/trace route; tap alternatives on all three fixture widgets and retained construction across rotation. CDP drag rejects explicitly. Emulation, not Safari or physical-device evidence. |
| Listening | No established listener/loopback route; unverified. | SCENARIOS names two actual runtime loop joins per approved theme, five separate cues and published mix/speech/silence observations. The retained sample keeps unavailable acoustics unverified. This permitted foundation gap remains a release obligation; approved tracks are not reselected. |

The current [BROWSER-CAPABILITY addendum](BROWSER-CAPABILITY.md#addendum--installed-browser-availability-9-october-2026)
confirms installed Chrome/Edge and native Store Firefox availability while
preserving account/transport limits. For matched D3, reused the accepted
[D3-CI-EXECUTION result](D3-CI-EXECUTION.md#corrected-native-module-identity-verification)
and original component reviewers' conclusions. Narrowly inspected run
37889547310's retained run.json, Playwright version, four results.json stats and
relevant job-log lines under
[D3 retained evidence](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37889547310).
They agree on candidate `18f08b01e7ffc839b0fb14d686ff8341d3fd362e`, attempt 1,
Linux, 1280×720, Playwright 1.64.0, actual Hall stdout `D3-Firefox: running
157.0`, and the ten expected passes. Their substantive component acceptance is
reused, not reopened. Software-sink readiness/browser playback is not listening.

### Final criterion disposition and checks

| Original criterion | Current disposition |
|---|---|
| 1 — matrix/config/engine identity | PASS; current branded D1 and accepted matched D3 complete the earlier engine evidence. Matrix/scenario definitions and root channel remain unchanged. |
| 2 — actual agent choice in D1/T1 | PASS; new D1 persistent native sequence plus retained accepted T1 choice/manipulation/cancel. |
| 3 — trusted T1 and T2 alternatives | PASS; reuse unchanged helper and accepted native proof. |
| 4 — honest evidence schema | PASS; reuse accepted attachment/type/probe evidence, plus actual D1 metadata/capture facts. |
| 5 — bounded claims | PASS; fixture/emulation and published/device/child/acoustic acceptance remain distinct. |
| 6 — per-mode readiness and D1/T1 rehearsal | PASS; consolidated table above and actual D1/T1 retained observations. |
| 7 — listening definitions and unavailable sample | PASS at foundation; actual acoustic release evidence remains unverified and required downstream. |

This recheck used read-only file/JSON/trace inspection, actual image inspection
and hash comparison. No browser, server, probe, typecheck or unaffected suite was
rerun. The helpers retain hashes `5bcf1d66fbca5daf3d4cc019364f23a3545eea5a531e20fca084feb731a770f3`
and `03b0d3996f7758fb9c39aaa950463205b33f4c05cb5eb1490ad734af4694c9a4`;
SCENARIOS retains its F1/F2-accepted hash
`a5320ee6239e503eb1c576618193ca090aea5704aae0d7cf82c6d3b91acf60e0`.
Latest reviewed handoff hash:
`23d9e94ca92da72549641c40b1abf77a01dbfe22d1d7af6a4c77a0ff44ead7ff`.

**Final Controller recommendation: accept WP06-01A.** No original readiness
criterion remains blocked. The older diagnosis and blocked verdicts are valid
historical evidence, superseded only where actual supported launch/rehearsal
evidence now exists. Published M1/M2 game acceptance, final matrix journeys and
real listening remain with the later owners. Only this validation report was
updated; no source/helper/config/dependency/shared-status/Git mutation,
delegation, other-chat write, installation or host/security change occurred.
