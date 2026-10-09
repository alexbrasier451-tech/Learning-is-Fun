# WP06-01A producer handoff

9 October 2026. Controller released accepted foundation, widgets, catalogue,
calendar, backup `ae50dbe641d9b4957a7f8a1be1ac3500e7c295c3`, additive recovery
`05df90d73706c3c4f2f115b053a067294006b2ce`, preferences `acf7d6166e039855bb0b1442a835c2327302a5de`
and widgets `30d95efa0c6822f8255d7791b4a39b5233e8f932`. This is sole-author
implementation/proof evidence for independent review; Controller owns acceptance
and integration. **Helpers and M1/M2 definitions are delivered; complete toolkit
readiness remains blocked on the real D1 launch/checkpoint rehearsal.** There is
no published candidate/play pass or M2 execution claim.

## Deliverables and interfaces

- `tests/playtest/helpers/touch.ts`: `touchDrag(page,{from,to})` and
  `touchCancel(page,{from,toward})`. Chromium CDP only, explicit touch-context/
  viewport/finite-coordinate checks, one native touch contact, eight intermediate
  moves, end or cancel. A finally block cancels interrupted contact and detaches
  the CDP session. No legacy TouchEvent, draft/Check/answer injection, production
  hook, alternative engine or framework.
- `tests/playtest/helpers/evidence.ts`: required `CheckpointRecord`, session
  metadata and `recordCheckpoint(page,testInfo,row)` native Playwright attachments.
  `captureCheckpoint(page,uniqueStepDirectory,row)` supplies the same native
  files/descriptors to the persistent agent session without manufacturing
  TestInfo. Observer owns judgment/next choice; actual capture URL/engine/version/
  viewport is recorded separately. Acoustic status is never inferred.
- [SCENARIOS](../../playtests/SCENARIOS.md): matrix/setup/evidence and the supported
  step/observe/choose/resume route; M1 entry/Q1–Q3/access/local/profile capture/
  lifecycle/backup/readiness/raw recovery/week/reward/review/offline/audio/visual
  expected results; gated M2 Q1–Q10/six-mechanic/world/real-upgrade deltas. No copied
  production command schemas or new domain oracles. Exact responses/results cite
  accepted producer handoffs, and observations stay outside definitions.
- This handoff. No lasting additional repository files are owned by this task.

## Actual verification and retained evidence

Installed project Node 24 / Playwright 1.64.0 were reused. No installation window
was opened. Private Vite host used port **5183**, independent cache/output,
`APP_BASE=/playtest/`, configured build label `local-wp06-01a` and the actual
accepted `tests/fixtures/interaction.html`/WP02 widgets. The fixture's visible
heading identifies **M1 native construction fixture** and expressly states no
Check/evaluator/help/reward/speech/saved-state port. Its label/environment is not
a verified published build identity.

Strict scoped Node-only check passed for both helpers and private proof spec/
configuration:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2023 --lib ES2023 --module ESNext --moduleResolution Bundler --types node .wp06-01a-private/helper.spec.ts .wp06-01a-private/proof.config.ts tests/playtest/helpers/touch.ts tests/playtest/helpers/evidence.ts
```

Final exact-match private Playwright proof consumed the root configuration's
baseline with diagnostic-only project/output/port overrides, one worker, no
retries and native list/JSON/HTML reports. **10 passed, five intentional skips,
zero unexpected/flaky**; 14.737-second reported duration. T1 passed five cases;
D2 passed evidence/unsupported-context cases and skipped three touch-only cases;
T2 passed taps/rotation/evidence/unsupported-engine cases and skipped two CDP-only
cases. Skips are applicability exclusions, never missing-mode passes.

Primary report:
[results.json](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/final-proof/results.json),
[native HTML report](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/final-proof/report/index.html).
Private probe sources are retained at
[probe-source](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/probe-source)
for reviewer inspection/reproduction; temporary repository probes are removed
after proof. Restore those three files to the same private workspace path if a
rerun is needed, set `WP06_PROOF_ROOT` to a fresh output root, start private Vite
on 5183, and invoke project Playwright with `--config .wp06-01a-private/proof.config.ts --workers 1`.
No shared configuration change is needed for this author proof; future standard
published suites use the WP01-owned configuration directly.

| Proof | Observed facts and artifact |
|---|---|
| Native T1 drag | Chromium **156.0.8078.4**, 1024×768 `hasTouch:true`. Native trusted `pointerType:touch` down/move/up; gotpointercapture and move with capture/one visible ghost. Completed drop changes actual response `[]→[2]`; final up/lostcapture has zero ghost and capture false. [events](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-selected-drag.json), [screen](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-selected-drag.png). |
| Native T1 cancel | After observing `[2]`, agent chose a three-metre manipulation and cancellation. Trusted captured moves show a ghost, then native pointercancel/lostcapture removes it; actual response remains `[2]`. Next real tap/place succeeds, proving another contact works. [events](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-selected-cancel.json), [screen](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-selected-cancel.png). |
| Interrupted helper cleanup | Test-only CDP send interruption at first move, with actual native start/cancel retained: helper rejects; sent sequence start/move/cancel; detach observed; zero ghost; subsequent tap/place produces `[2]`. This probes helper error cleanup, not a production failure hook. Native event attachment/trace is in final report. |
| Native tap alternatives | T1 Chromium and T2 **WebKit 27.2**: tap source/place for bridge `[4]`, punctuation first=`?`, apples=1; rotate viewport and tap pear increment→`{apples:1,pears:1}`. No mouse substitute. WebKit initial 768×1024→1024×768. Fixed bounded helper proof, not a full agent adventure. |
| Agent choice boundary | Persistent `node_repl` holds real Playwright browser/context/page. Initial screenshot/DOM returned to agent before selecting two-metre drag; response observed before choosing three-metre cancel. [original choice trace](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-agent-choice.trace.zip). No custom gateway or run-ahead answer script. |
| Delivered evidence helper in agent route | Separate live calls capture initial empty board, choose visible four-metre source, observe pressed/empty state, then choose placement and observe `[4]`. Same Page persists across tool boundaries. `captureCheckpoint` writes actual screenshot/DOM/metadata at [step-0](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/artifacts/playtests/M1/local-wp06-01a/T1/M1-TOOLING-T1-CHOICE/step-0/checkpoint.json), [step-1](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/artifacts/playtests/M1/local-wp06-01a/T1/M1-TOOLING-T1-CHOICE/step-1/checkpoint.json), [step-2](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/artifacts/playtests/M1/local-wp06-01a/T1/M1-TOOLING-T1-CHOICE/step-2/checkpoint.json); [native trace](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/T1-agent-evidence.trace.zip). |
| Report attachment honesty | Real TestInfo in each proof engine receives JSON/PNG/accessible DOM. Sample row deliberately has `status:blocked`, `acousticStatus:unverified`, null owner/retest/applicability. Asserted metadata remains blocked/unverified, actual version/URL agrees and retained DOM names fixture. This technical helper case passes without relabelling its acoustic row. Sample files are under final-proof/playwright/.../artifacts/playtests/M1/local-wp06-01a/<matrix>/M1-TOOLING-SAMPLE/checkpoint-0/. |

Screenshots/DOM were actually inspected in the persistent session: labelled timber
sources, clear amber selected state, explicit placement target, real placed plank,
and unchanged completed construction after cancel. These are widget observations,
not final branded art/world/access acceptance. Runtime header records Windows,
emulated tablet, Europe/London, Chromium version, fixture identity and null listener:
[session-header](C:/Users/alexb/AppData/Local/Temp/learning-is-fun-wp06-01a/session-header.json).

One initial persistent launch with extra `chromiumSandbox:true` reached a
`newPage: Target crashed` failure before rehearsal. The project configuration
does not request that extra option; its ordinary supported launch options worked
in the persistent session and actual Test runner. No extra flags, system/security
settings, vendor files or shared configuration were changed. This does not assert
OS/browser containment. A direct ESM import of `@playwright/test` in `node_repl`
failed; standard `createRequire` anchored to project package.json worked. This
host accepts emitted `.js`/`.mjs`, not `.ts` dynamic imports. The manifest records
the verified route and retains no compiler/runtime adapter in production.

## Readiness and unresolved requirements

| Matrix mode | Actual engine/version and launch | Observation/action route; limits |
|---|---|---|
| D1 Chrome 1366×768 | **Blocked**, no observed running branded Stable version; see current BROWSER-CAPABILITY. | Persistent native Playwright keyboard/mouse + screenshot/DOM route defined, but actual branded launch and agent-chosen early-host checkpoint are **not rehearsed**. Pending human Chrome-open input remains open. Bundled Chromium/T1 or Edge cannot substitute. No adapter/install authorized here. |
| D2 Edge 1920×1080 | **154.0.4258.62**, fixture proof launches. | Native Test runner evidence/DOM/screenshot and mouse/keyboard API available; no full published smoke or agent adventure claimed. |
| D3 matched Firefox 1280×720 | **Blocked**, no running version; matched archive metadata 157.0 is not launch evidence. | Native Playwright route conditional on actual launch. Documented Windows mozglue side-by-side failure remains; possible later approved CI route not executed. |
| T1 Chromium 1024×768 | **156.0.8078.4**, launched and actually rehearsed. | Persistent native Playwright step/observe/choose/resume plus screenshot/DOM/trace and native CDP touch drag/cancel/taps proved. No physical device or published game pass. |
| T2 WebKit 768×1024 | **27.2**, fixture proof launches. | Native taps on all three widgets and viewport rotation proved; screenshot/DOM report available. CDP drag explicitly rejects; no trusted WebKit-drag, Safari or physical-device claim. |
| Listening/loopback | **Unverified**, no established route in current task tools. | Two joins per approved theme, five individual cues, speech/mix/comfort and published Silence all still require actual listener observations. Track selection approval is settled, no new audition requested. |

Controller subsequently assigned the foundation owner read-only diagnosis of
the existing Stable CfT/Firefox Windows failures. This task neither owns nor
predicts a repair. The now-retained
[activation diagnosis](BROWSER-ACTIVATION-DIAGNOSIS.md) establishes no supported
correction or running browser and leaves those gates open. D1/D3 remain blocked
unless new actual supported launch evidence supersedes this table. Existing
branded gaps are not waived. Criterion
2/6 D1 rehearsal remains open; T1 route/helper proof is ready for independent
review. Acoustic unverified status is a permitted foundation handoff, not release
audio acceptance. M1 helper completion does not authorize M2 implementation.

## Receiving producer boundaries

| Consumer | Handoff/use |
|---|---|
| WP01 | Keep shared matrix/engine/channel/URL/config ownership. No dependency/config request is required by helper code. Release a real candidate only after composition; resolve D1/D3 capability independently and verify visible page/worker identity. Private rehearsal used only 5183, not facade port5182. |
| WP02 interaction/world | Consume current rendered locator coordinates with actual handlers; no response/Check hook. Widget trusted touch/cancel proof is supporting evidence. Later world journeys must inspect complete Q1–Q3 UI and apply named visual/access rubric, then new M2 manifest. |
| WP02 audio/criterion reviewers | Consume explicit verified/unverified rows and actual recordings/listener notes from future observers. Current helper sample is unverified. Require two runtime joins/theme, every named cue and integrated speech/silence/mix; source pair approval remains settled. |
| WP03 / WP05 | Definitions reuse seven educational oracle IDs and accepted canonical/opportunity/civil-week/score/rank values. Harness constructs no competing schedule/scorer/task bank. Fresh/struggling/exhausted/ready-with-no-harder-band outcomes remain honest. |
| WP04 | Import only validated whole-save fixtures via normal UI; preserve lifecycle/profile capture/readiness contracts. Supported backup, labelled last-committed backup recovery and raw unsupported-root recovery are distinct. Current task changes none of their modules or fixtures. |
| WP06-02A/03A and later M2 children | Reuse helpers/schema/manifest and supported persistent route, retaining actual agent choices plus original captures. Own real JOURNEY/BOUNDARIES and genuine M1 save/native-upgrade evidence. A fixed passing script cannot supply missing agent observation, branded D1 or listening evidence. Sole release closure remains WP06-04A/07A. |

Only the four assigned files remain as this task's deliverables. No production source,
shared status/configuration/dependency/Git change, delegation, other-chat message,
M1/M2 run report, deployment, installation, device/child testing or acoustic
acceptance was performed. Unrelated concurrent facade/Controller edits are
preserved. Ordinary writer used; no Toolkit transaction.

## F1/F2 scenario-definition corrections

9 October 2026, in response to the
[independent review](WP06-01A-VALIDATION.md#findings-for-the-original-scenario-author).
Only SCENARIOS and this handoff changed; helper code and prior native evidence
are unchanged. No additional browser run, production fix or shared/Git edit.

- **F1:** M1-Q1 and the journey checkpoint rule now explicitly require `[6,6]`
  **and `[3,4,5]`** across normal replay/fresh-profile bounded variants,
  producer-grounded `[5,6]` incorrect→acknowledged hint→retry→success, and separate
  chosen-draft/pre-Check attempt/point, explicit result/feedback and acknowledged
  committed-world checkpoints for every Q1–Q3. Other valid bridge combinations
  remain optional; completed-location reopen retains restoration without rewards.
- **F2:** the explicit
  [M1-HELP-RESUME row and complete definition](../../playtests/SCENARIOS.md#m1-help-resume)
  map the previously incomplete seventh educational oracle. Both zero-Check and
  one-wrong histories preserve original optional/revisit provenance/reason,
  descriptor/revision/draft/help/firstCheckCorrect/cumulative Checks/opportunity
  across story request/export/reload; candidate none cannot cancel the retained
  opportunity. Assistance acknowledgment precedes requested text/speech reveal;
  failure preserves prior committed state and offers recovery. Optional success
  never adds required story completion or renews reward eligibility.

Verification is a focused comparison with WP06-02A criteria 2/7 and the exact
accepted M1-HELP-RESUME producer oracle, plus owned-document whitespace/link
checks. Helpers retain the independently reviewed SHA-256 values
`5bcf1d66fbca5daf3d4cc019364f23a3545eea5a531e20fca084feb731a770f3`
(touch) and `03b0d3996f7758fb9c39aaa950463205b33f4c05cb5eb1490ad734af4694c9a4`
(evidence). Definitions await the original validator's narrow recheck. Whole
WP06-01A remains **blocked on actual D1 criteria 2/6**; D3 and acoustic gaps
remain explicit. No game/release or M2 implementation claim is added.
