# Agent-directed playtest scenarios

WP06-01A, 9 October 2026. This is a definition/expectation manifest, not a run
report. The rehearsal uses the accepted widget fixture; no published M1 or M2
candidate or full adventure pass is claimed. M2 execution remains gated on M1
acceptance and the actual M2 candidate/producer manifest.

## Authority, setup and evidence

Use [WP01's single matrix](../work-package/chunks/WP01-01A.md#target-outcome)
and `playwright.config.ts`. D1 = branded current Stable Chrome 1366×768 complete
keyboard/mouse journey; D2 = Edge 1920×1080 smoke; D3 = matched Firefox
1280×720 smoke; T1 = Chromium touch 1024×768 complete journey; T2 = WebKit touch
768×1024 activities and rotation. WebKit is emulation, not Safari or a physical
tablet. Separate fresh contexts for each journey, profile and controlled case.
Do not relabel bundled Chromium as D1. The current
[browser capability record](../work-package/execution/BROWSER-CAPABILITY.md)
supersedes historical binary inventories; D1/D3 launch gaps remain open.

For every published session, obtain WP01's PublishedCandidate URL/build,
verify the visible build identity before input, and record OS, actual engine/
`browser.version()`, CSS viewport, input route, timezone, emulation/device class,
fixture versus published origin and listening route using `EvidenceSession`.
Candidate identity comes from visible UI plus the producer handoff. URL and
environment variables alone do not prove the active worker/page build.

Use `CheckpointRecord` from
[evidence.ts](../../tests/playtest/helpers/evidence.ts): scenarioId, release,
candidateUrl/buildId, matrixCase, browserVersion, viewport, inputMode,
seededOrUnseeded, setupRef, actions, expected, observed, status, evidenceLinks,
acousticStatus, defectOwner, retestedBuildId and finalBuildApplicability. Use
null when no defect/retest/applicability claim exists. Preserve blocked/untested
rows; absence of an artifact never means passed. Runtime capture records actual
URL/engine/version/viewport separately from supplied assessment.

`recordCheckpoint(page, testInfo, row)` attaches metadata, full-page screenshot
and accessible DOM snapshot to the existing Playwright report. Files are under
the isolated Playwright output root at
`artifacts/playtests/<release>/<encoded-build-id>/<matrix>/<scenario>/<checkpoint>/`.
They are outside dist/precache. It chooses neither answers nor pass status.
For a persistent agent-controlled Page outside the runner,
`captureCheckpoint(page, uniqueStepDirectory, row)` writes the same three native
artifacts and returns attachment descriptors. Use the same artifact hierarchy;
attach retained originals later with normal `testInfo.attach`, without fabricating
TestInfo or replaying a different page as if it were the original observation.
Record sequence, reason for next choice and links in the owning JOURNEY report.
Traces/screenshots/DOM prove technical/visual observations, not listening.

Unseeded means a fresh normal UI journey with no injected save. Seeded means an
explicit controlled owner-supplied fixture imported through normal adult UI,
or a named test-only fixture host. Cite its producer, exact fixture/validation
result, isolated clock/network/failure settings and previous save. Fixtures
that merely parse are insufficient. Do not inject answers, receipt totals,
quest completion or progression through a developer console.

## Supported step, observe, choose and resume

The supported route is the installed project Playwright controlled through the
persistent `node_repl` task tool, with ordinary screenshots/DOM/trace/files.
It has no custom server, remote agent gateway, answer endpoint or second runner.
A fixed `starter.spec.ts` journey alone cannot satisfy agent-directed D1/T1 play.

1. Compile only the two helpers to a disposable directory with project `tsc`
   (`--ignoreConfig --outDir <private-directory> --strict --skipLibCheck
   --target ES2023 --lib ES2023 --module ESNext --moduleResolution Bundler
   --types node`). This provides `.js` modules accepted by `node_repl` without
   changing dependencies/configuration. Keep evidence directories separate.
2. In `node_repl`, use `createRequire` from `node:module`, anchored to the project's
   absolute `package.json`, to load `@playwright/test`. Import emitted helper
   `.js` files through absolute file URLs. This host's direct ESM package import
   failed; the standard CommonJS `createRequire` route worked. Keep the browser,
   context and page in persistent bindings. For D1 use the configured Chrome
   channel after its launch gap is resolved; never silently fall back. For T1
   create `{viewport:{width:1024,height:768},hasTouch:true}`. Use project launch
   options; request shared option changes from WP01.
3. Navigate to the exact candidate. Start native Playwright tracing with
   screenshots/snapshots. Return `page.locator('body').ariaSnapshot()` and
   `nodeRepl.emitImage(await page.screenshot())` to the agent. Verify identity and
   record an initial checkpoint with `captureCheckpoint`.
4. End that tool call. Inspect the actual screenshot/DOM and choose one bounded
   visible action, explaining the choice in JOURNEY. In the next call activate
   one observed locator using keyboard/click/tap or `touchDrag`/`touchCancel`.
   Select touch coordinates from current bounding boxes after scrolling;
   endpoints must remain inside the CSS viewport. Never read a hidden answer.
5. Return the new screenshot/DOM and capture a unique next-step row. End the call
   and assess the result before choosing another action. For failures, retain
   evidence and route the earliest causal fault to its producer. No run-ahead
   answer list substitutes for these observation boundaries.
6. Stop native trace into the same isolated evidence root and close context/
   browser in cleanup. Attach original artifacts to the owning Playwright report
   and JOURNEY, preserving unchanged-build applicability or a real corrected-build
   end-to-end retest. Do not fake fresh observations from earlier artifacts.

Rehearsal: the actual 1024×768 T1 fixture was inspected in one tool call; the agent
then chose a two-metre plank, resumed with native CDP drag, observed `[2]`, chose
cancellation of a new three-metre manipulation, resumed and observed `[2]` plus
no ghost. Trusted touch/capture/cancel evidence is in
[the handoff](../work-package/execution/WP06-01A-HANDOFF.md). D1 uses the same
supported choice boundary with keyboard/mouse, but its branded launch/rehearsal
remains blocked. Toolkit readiness is partial until that real D1 rehearsal passes.

## M1 scenario definitions

Complete unseeded Q1–Q3 paths on D1 and T1. D2/D3 smoke covers entry, one
construction/Check, navigation, save/reload and conclusion from a separately
validated fixture; it cannot stand in for complete D1/T1 play. T2 exercises each
activity with native taps at portrait and after viewport rotation. Controlled
boundaries use D1/T1 as prescribed by WP06-03A rather than a full cross-product.
Every row below requires checkpoint metadata and retained screenshot/DOM/trace;
normal export adds durable identity/value evidence where named. Audio has an
additional, separate acoustic requirement.

Under [WP06-02A criteria 2 and 7](../work-package/chunks/WP06-02A.md#acceptance-criteria),
the bounded journey runs **must demonstrate both `[6,6]` and `[3,4,5]`** bridge
solutions, using normal retry/replay or a fresh disposable profile with recorded
provenance. Other correct combinations are optional alternatives. Include a
useful incorrect response → **acknowledged hint** → retry → later success: for
the total-12 anchor, `[5,6]` is the producer's sum-under case; assess whether its
written feedback explains that error, request help through normal UI and wait for
save acknowledgment before reveal, then choose a valid retry. Compare supported
retry display/awards with the accepted WP03/WP05 expectations; a failed help save
must not reveal the requested support. At **each Q1–Q3** retain the chosen draft
and pre-Check attempt/point observation (edits accrue neither), the explicit Check
result/feedback, and the acknowledged committed world consequence as separate
checkpoints. Leave/reopen completed locations to confirm retained restoration
and no fresh once-only reward. These are required definitions for later actual
journeys, not claims that those runs have happened.

| Scenario | Setup and bounded controls/checkpoints | Expected producer result; causal owner |
|---|---|---|
| M1-ENTRY | Unseeded; open published URL, read local-browser/household wording, create disposable profile, avatar, onboarding and Village Green; D1/T1 full, D2/D3 smoke, T2 entry. | Visible build matches candidate, no account/server leaderboard promise; readable instructions and available local choices. WP01 shell, WP04 profile/local storage, WP02 onboarding/world. |
| M1-Q1 | Unseeded; enter River Bridge, inspect broken→editable state, construct/undo/change using drag and alternatives. Require `[6,6]` and `[3,4,5]` across normal replay/fresh-profile bounded variants, plus `[5,6]` incorrect→acknowledged hint→valid retry→success. Capture chosen draft/pre-Check attempts/points, explicit Check feedback and acknowledged restoration separately; leave/reopen/reload. | [M1-BRIDGE oracle](../content-review/starter-handoff.md#m1-bridge) and WP06-02A criteria 2/7: both required solutions total 12 under one canonical identity; `[4,4,4]` and `[1,2,3,6]` remain optional correct alternatives. `[5,6]` is sum-under, `[6,6,1]` sum-over. Draft edits/empty/invalid responses accrue no attempt/points. Hint reveals only after acknowledgment and retry is supported. Committed success adds q1-story-m01/Q1 once and bridge-restored/route-to-library-market; failed save never celebrates, reopened completion never renews its reward. WP03 task, WP02 widget/feedback/world, WP04 acknowledgment, WP05 awards. |
| M1-Q2 | Unseeded after Q1; open Whispering Library, inspect both sentences, choose/tap/drag marks, revise/undo, Check, inspect spellbook/library and market-instructions; reload. | [M1-SPELLBOOK oracle](../content-review/starter-handoff.md#m1-spellbook): question `?`, discovery `.` or `!` equally correct under the one spellbook-anchor canonical identity; incomplete spaces do not Check. Acknowledged story success adds q2-story-e06/Q2 once; both valid endings progress equally. Same owners as Q1. |
| M1-Q3 | Unseeded after Q2; enter Market Square, manipulate apples/pears using drag/tap/native number controls, distinguish null/zero, Check, observe market/village/planter conclusion and skip celebration. | [M1-MERCHANT oracle](../content-review/starter-handoff.md#m1-merchant): mult-2.pears-3 requires apples 6 and pears 3, with constraints separately explained. Committed success adds q3-story-m04/Q3 once, market-stocked/village-welcome/planter-available. Conclusion is accessible with supported successes and no medal/mastery gate. Same owners as Q1. |
| M1-TRANSFER-REVISIT | Unseeded after source success; accept or skip optional transfer, revisit a canonical story and request ordinary practice. Record resolver provenance in normal export. | Nine [accepted bindings](../content-review/starter-handoff.md#nine-released-bindings-and-six-offered-encounters), not another quest graph. Optional transfer excludes its source anchor, requires permanent source success, and cannot fulfill required story work; revisits are optional. Same-week alternatives/order/skin/seed/reload do not refresh rewards. WP03 selection/bindings, WP04 provenance, WP05 eligibility. |
| M1-HELP-RESUME | WP04-supplied validated retained revisit fixtures for zero prior Checks and one prior wrong Check; normal adult import, Q1 story request, acknowledged/failed assistance UI paths, ordinary export/reload and later optional success. Execute the complete named oracle below. | [M1-HELP-RESUME producer oracle](../content-review/starter-handoff.md#m1-help-resume): story request resumes original optional/revisit identity/provenance, draft/help/Check/opportunity facts; candidate none never cancels retained opportunity. Save help before reveal, preserve prior committed state on failure, and never turn optional success into required story completion/new reward eligibility. WP03 selection, WP04 assistance/resume/save, WP05 retained opportunity. |
| M1-ACCESS | Unseeded beside each activity; D1 Tab/Space/Enter/Escape, visible focus/instruction dialog return, mouse routes; T1 trusted CDP drag/cancel plus touchscreen tap alternatives; T2 native taps for all three, portrait/rotation. Check 200% text, 44px targets, 18px body, ordinary scroll outside handles, reduced motion and no-audio comprehension. | Actual construction survives cancel/rotation, capture/ghost releases, controls/labels do not clip, drafts stay unscored before Check. Equivalence to native alternative routes; quiet/text routes remain complete. WP02 interaction/access/visual; WP01 platform only when causal. |
| M1-LOCAL | Two disposable profiles via UI; distinct drafts/progress/creative choices, switch/resume, close/reopen. Rename/avatar/delete through adult UI; export before/after. | One browser/installation scope; no cross-profile learning/reward bleed. Changes persist only after acknowledgment; deletion removes that profile's local results and preserves rank gaps/other profiles. WP04 facade/profile, WP05 standings, WP02 displays. |
| M1-PROFILE-CAPTURE | Controlled disposable two-profile setup; begin a slow/failing Check/suspend, request profile switch, then observe acknowledgment/error and old/new profile displays; use producer-scoped native persistence delay/failure only. | Operation keeps its captured profileId/epoch; it cannot commit into the newly selected profile or clear a newer active-panel registration. Blocked suspension retains the old view and truthful status; normal export agrees. WP04 facade/serialization, WP02 activePanelHost/navigation. |
| M1-PRACTICE-LIFECYCLE | Owner-selected canonical task; draft and hint before Check, wrong valid Check, leave/reopen, then deliberately Finish practice; return and succeed. Inspect ordinary exports at each boundary. | DEC-024/025: leaving only suspends, emits no completion; explicit unsuccessful finish after valid Checks emits exactly one episode completion with existing actionId, no new Check/submission. Return can increment learningEpisodeOrdinal while retaining canonical/encounter/opportunity, cumulative attempts/help/earning week/slot. Wrong→finish→correct = two Checks/two completed episodes, one supported retry, zero independent successes. Repeated finish/action adds nothing; no renewed reward eligibility. WP04 lifecycle/observation construction, WP03 learning reduction, WP05 opportunity. |
| M1-REWARD | Controlled valid producer history via adult import plus normal Check; compare edit/invalid/first correct/hinted/wrong-retry/duplicate delivery and same-week replay. | WP05 oracle: answer +5, independent success +15 or supported success +5; first unassisted correct +20, hinted/retried total +10. Quest +20 lifetime only, once. Three supported starter quests can reach 90 lifetime/30 competitive. Narration, manipulation, episode finish and duplicate acknowledgment are not fresh scoring events. WP05 policy, WP04 once-only application; WP03 judges. |
| M1-BACKUP | Two-profile [accepted whole-save fixture](../work-package/execution/WP04-03A-HANDOFF.md#fixtures-and-measured-observations) imported only through normal adult file/preview/confirm UI. Export acknowledged snapshot, cancel preview, confirm replacement, reload/re-export; compare identity/values, then resume retained hinted unfinished practice normally. | Validated v1 envelope round trips all profile/world/learning/receipt/preferences facts under a fresh local epoch, revision 0; raw dates do not reconcile during decode/export. Retained source completion remains valid after compaction. Cancel/stale/reconstructed preview changes nothing; explicit confirmation uses captured expected epoch/revision once and repository replacement. WP04 backup/facade/repository. |
| M1-BACKUP-REJECT | Separate disposable context; import owner-supplied malformed, unsupported version/task, extra-field, over-budget/17-profile backups; race preview against a real committed edit. Compare preceding normal export. | Reject before durable write with truthful explanation, no truncation/default/reset/migration claim. Conflict preserves current save; retry requires a new preview/explicit confirmation. Dangerous/duplicate JSON members and invalid identities stay rejected. WP04 decoder/repository/UI. |
| M1-READINESS | Producer-scoped real UI→facade→repository failed/aborted write; retain draft/live preferences, attempt ordinary export and service-worker update, retry acknowledgment, then export. | Pending/failed command, preferences or unsaved panel prevents ordinary export/update readiness. Last-committed recovery is an explicitly labelled choice, never a successful flush. Retry displays acknowledged state once; no optimistic rewards/restoration. Immediate Silence all precedes preference enqueue and survives a failed save as live silence. WP04 readiness/preferences, WP02 audio/active panel, WP01 update guard. |
| M1-RAW-RECOVERY | Separate owner-provided persisted unsupported-root fixture, not a valid backup; use recovery UI Download raw recovery data. Retain raw root before/after, availability/reason and file wording. | [Accepted recovery port](../work-package/execution/RECOVERY-EXPORT-HANDOFF.md#port-and-consuming-facadeui-distinction) preserves complete JSON-compatible logical records/root including actual epoch/revision/unknown fields. Distinct `.recovery.json`, no v1 wrapping, stripping, new token, reconciliation or importability claim; load remains unsupported. Unavailable/blocked/non-JSON/oversize cases show reason, never default save. This differs from supported last-committed backup recovery. WP04 repository/facade/adult UI. |
| M1-WEEK | WP04/WP05-validated whole-save fixture, browser-scoped clock before load. London summer Sunday 2026-07-05 22:59:59.999Z→23:00:00Z; winter 2026-01-04 23:59:59.999Z→Jan 5 00:00:00Z; DST instants 2026-03-29/Oct 25 01:00Z, absence and rollback. Inspect exports/Hall. | Monday keys change Jun29→Jul6 / Dec29→Jan5; DST Sundays remain Mar23/Oct19. Forward reconciliation closes only last participating week once, no empty skipped weeks. Rollback retains latest week/scores/slots/records and warning. 20/20/10/0 ranks 1/1/3/unranked; closure snapshots identity, best ties retain old week, medals once; 52 newest archives, durable records. WP05 calendar/standings; WP04 acknowledgment. |
| M1-CAP-REVIEW | Validated fixtures for 30th/31st opportunity and closed-week unfinished retry; normal selected review after owner-supplied +3/+7 civil-day dates. Freeze only isolated browser clock. | 31 independent canonical successes = 620 lifetime/600 competitive/30 slots (fixture oracle, not 31 bank tasks). Sunday wrong→Monday success keeps original earning week/slot, adds +5 lifetime/+0 current, leaves archive unchanged. Pre-Check Sunday hint binds Monday on first valid Check. Date alone never renews; later-week WP03-selected due review uses same canonical/new eligible opportunity only after actual-success week. WP05 rewards/calendar, WP03 review selection, WP04 retention. |
| M1-OFFLINE-UPDATE | Published origin after WP01 inventory/cache/install proof; disconnect using context.setOffline, reload and complete one mission/resume. Consume WP01 deployed A→B waiting-worker evidence with unsaved/failed/clean readiness, activate explicitly; inspect page/active build and export. | All required local assets/content available, acknowledged save retained, unavailable speech remains text; no false offline-ready notice. Update stays pending while unsafe; explicit safe activation moves both page/worker identity without losing progress. Export/import evidence alone does not establish worker activation. WP01 cache/update, WP04 readiness, WP02 offline presentation. |
| M1-AUDIO | D1/T1 published source/controllers. Use explicit Enable sound, separate remembered music/effects mute/volume; trigger scene changes and five cues, narration/Stop, delayed load/resume, cross-tab silence, background/navigation/profile changes, reload. See listening plan below. | WP02 audio gate obeys latest mute/generation synchronously before persistence; late callbacks never unmute. Silence all stops themes/effects/speech and persists; broadcast never unmutes. Only English localService voice or truthful text fallback; read-aloud carries no hint penalty. WP04 preferences, WP02 audio/speech; real sound comfort/silence require separate acoustic observations. |
| M1-VISUAL | Unseeded D1/T1 surfaces at entry/Q1–Q3/feedback/restoration/conclusion, Hall/adult controls/creative choices; T2 portrait/rotation; compare owner references and named asset provenance, focused failed/unsupported/empty states. | Accepted WP02 rubric, readable task data over artwork, reversible construction, restrained/skippable celebrations, meaningful world changes and save-acknowledged creative choice. Record surface→criterion→capture findings for WP02-12A without claiming child enjoyment, curriculum efficacy or full physical-device coverage. WP02 visual owner; WP04 save on acknowledgment faults. |

### M1-HELP-RESUME

Consume the exact [producer oracle](../content-review/starter-handoff.md#m1-help-resume)
and WP04's validated retained `saved-bridge` fixture: canonical total-12, original
q1-revisit-m01 provenance, reason adaptive-practice, `saved-opportunity`, sticky
answerHintUsed true and episode ordinal 1. Run **both** histories in separate
disposable contexts: zero Checks before acknowledged help and one prior wrong
Check before acknowledged help. Use normal import/UI controls and producer
expected results; do not construct another DTO or inject a response/progression
hook. Record each history and its acknowledged help state explicitly.

In each history, make a fresh Q1 story request. It must resume `saved-bridge` with
its **original optional/revisit binding provenance and adaptive-practice reason**,
not relabel it as required story work. Compare normal exports before the request,
after resume and after reload: canonical/encounter identity, descriptor/revision,
draft, help IDs/sticky answerHintUsed, firstCheckCorrect, cumulative Checks and
retained opportunity must agree with that history. Zero prior Checks cannot gain
a Check merely from help/resume; the one-wrong history keeps its wrong-first fact
and cumulative count. The producer's `candidate none` result on resume **does not
cancel** `saved-opportunity`: WP05 reuses its retained components/earning week,
and returning cannot renew first-attempt eligibility.

Exercise the acknowledged and failed assistance-save branches through the real
UI→facade→repository route using WP04's scoped failure setup. Requested hint/worked
support must be saved **before** its text or speech is revealed. On failed
acknowledgment, do not reveal the requested support; retain prior committed
state, show recovery/retry, and compare ordinary export/reload with the prior
snapshot. A recovery-labelled last-committed export remains distinct from a
successful flush. After a successful retry acknowledgment, compare persisted
help IDs/sticky assistance before accepting reveal. Neutral instruction
narration, mute and Stop are not answer help.

Then succeed through the resumed optional activity and compare normal export/
reload: no false q1-story-m01/Q1 completion and no new reward opportunity or
first-attempt eligibility follows from the story request or optional success.
A subsequent genuine story request still obeys sticky canonical/free-practice
history and WP05 eligibility. Retain pre-Check/result/acknowledged consequences
and route faults to WP03 selection, WP04 persistence/assistance, or WP05 rewards.

Preserve a genuine `starter-save.json` from the actual M1 candidate through normal
UI, not a save later synthesized by M2: source URL/build, disposable profile IDs,
schema/content/policy version, completed story/quest receipts and unlocks, unfinished
encounter/opportunity/episode attempts/help/earning week, preferences, export time,
setup actions and expected values. WP06-03A owns it. WP01-05A owns a separate closed
native browser-profile working copy for the real deployed upgrade.

## Listening plan and limits

The approved source pair is Market on the Sea / Sunset Walk under
[MUSIC-REVISION](../work-package/execution/MUSIC-REVISION.md); selection is settled.
Do not request another source audition. Source approval and numeric PCM/loop/gain
checks do not close itemized or published control/mix listening requirements.

For each theme, a capable real listener/capture route must observe its full phrase
and **two actual runtime loop joins** (three traversals), recording track, join
times, player/browser/device/output settings, reviewer and concrete continuity/
comfort findings. Observe **pickup, placement, support, success, restoration**
individually through their UI triggers and in the intended mix. Assess cue/music
balance, abrupt starts/stops, transitions, speech intelligibility and comfortable
speech priority; include a speech-absent fallback case. Use a timestamped recording
only when an actual listener reviews it; filename/trace/video is not listening.

Observe Silence all while a theme/cue/read-aloud is active, then after delayed
load/resume, scene/profile change, cross-tab intent and reload. Separately retain
technical playback/gain/cancellation evidence. Acoustic silence/quality is
`verified` only with concrete listener observations, otherwise `unverified`.
Cases with no sound criterion use `not-applicable`. The fixture sample deliberately
sets `status: blocked`, `acousticStatus: unverified`, and a null listener route;
passing helper assertions cannot turn that row into an audio pass. The current
task tools expose no established listening/loopback route. Detailed source and
integrated acoustic acceptance remain WP02-12A/13A release inputs.

## M2 definitions — execution gated

Consume accepted M1 result, WP01-05A M2 PublishedCandidate/expanded inventory,
WP02-10A actual playable quest/mechanic manifest, WP03 reviewed 20-skill/binding
summary and WP04-07A real-save compatibility. Static catalogue rows are expected
IDs/graph/results, not proof of released M2 tasks/assets. Do not hardcode answers
or pretend those prerequisites already exist. Use fresh unseeded profiles for D1
and T1 journeys; the retained upgraded M1 context belongs to WP06-06A exclusively.

Each M2 quest row records actual location, released mechanic, agent-chosen
response, feedback and **committed** consequence on D1/T1; D2/D3 repeat bounded
smoke, T2 every new mechanic at portrait/rotation. Q1–Q3 retain their accepted
required sets; expansion never introduces retrospective story requirements.

| Scenario | Required setup/controls | Expected result and producer reference |
|---|---|---|
| M2-Q1 / M2-Q2 / M2-Q3 | Fresh unseeded expanded candidate; repeat starter story controls/Check/reload and optional source/transfer distinction. | Same canonical identity/permanent q1/q2/q3 required story results and supported progression; changed bindings assessed against actual released manifest. WP02 world, WP03 content, WP04/05 acknowledged identity/awards. |
| M2-Q4 | After Q3, Tinker's Workshop; actual timber-array/expression matching, reversible alternatives/Check. | Sawmill restored/invention available, not another inventory economy. Actual reviewed WP03 answers; WP02-10A quest manifest. |
| M2-Q5 | After Q4, Village Green; measured/fraction quantity manipulation and valid equivalent controls. | Garden restored/forest-marker; exact representations/assessment from producer, never invented in this harness. |
| M2-Q6 | After Q3, Whispering Library; sort reviewed language/book categories and reading clue; both legal branch orders. | books-shelved/forest-story-map; Q7 still blocked until both Q5 and Q6. |
| M2-Q7 | After Q5+Q6, Storywood Forest; meaning-based sequencing, reorder/undo and supported success. | forest-path-restored. Fresh branches Q4/Q5→Q6 and Q6→Q4/Q5 both reach this gate; reload preserves branch state. |
| M2-Q8 | After Q7, Storywood; consequential reversible selection from written map/clues. | castle-gear-recovered; meaningful feedback and reviewed map/measurement/comprehension input. |
| M2-Q9 | After Q8, Clockwork Castle with Orin; clock-hand manipulation/equivalent controls and ordering time instructions. | castle-clock-restored/castle-open; no hidden/dexterity-only progression. |
| M2-Q10 | After Q9, Village Green; released mixed-subject selection/matching of goods/instructions/attendance data. | kingdom-finale at green/castle independent of week/rank/Festival. Celebration is skippable and acknowledged once. |
| M2-MECHANICS-ACCESS | Actual released instances of drag, match, sequence, sort, manipulate, consequential selection; D1 keyboard/mouse, T1 trusted drag/cancel plus taps, T2 each new activity portrait/rotation. | All six have real authored activities/results; focus, 44px/18px/200% text, reduced motion and no-audio alternatives remain. Same access/evidence standards as M1. WP02-09A/10A, WP03 manifest. |
| M2-WORLD-CREATIVE | Seven locations, five named cast plus player, companion/cosmetics, six sockets/six decoration types, shelf/invention; choose/leave/reopen/reload. | Visible catalogue results match acknowledged state, creative choice persists; availability/reward entitlements retain producer rules. Observe new surfaces against WP02-13A delta rubric; no “20 skills” inference from contextual text. |
| M2-UPGRADE-CONTINUE | WP06-03A genuine M1 export plus WP01-05A closed dedicated native-profile working copy and deployed upgrade evidence. Verify same origin/active/page build; compare pre/post exports, resume unfinished task through normal M2 UI, then edit creative choice and backup round trip. | Exact original profile/canonical/encounter/opportunity/episode attempts/help/earning week/receipts/unlocks/preferences retained per WP04-07A. Once-only rewards stay once-only; no regenerated opportunity/first attempt. Logical export/import compatibility and real native worker activation receive separate evidence columns; fresh M2 import is supplemental, never a substitute for native upgrade. |
| M2-BOUNDARIES-AUDIO-OFFLINE | Dedicated isolated boundary context; repeat affected LOCAL/BACKUP/READINESS/RAW-RECOVERY/PRACTICE/WEEK/CAP/REVIEW cases and expanded cache/new offline mission/resume; silence/speech/new transitions/cues/creative audio. | M1 contracts persist. Mark changed/retested versus retained scope with named unchanged-build rationale; acoustic evidence remains separately verified/unverified. WP06-06A produces, WP02-13A reviews, WP06-07A alone accepts M2. |

The final owning JOURNEY/BOUNDARIES reports retain observations separately from
this manifest. No M1/M2 report, source/configuration edit, deployment, browser
installation, physical-tablet claim or child session is created by this foundation.
