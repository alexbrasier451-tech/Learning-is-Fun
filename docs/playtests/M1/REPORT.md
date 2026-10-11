# M1 acceptance and expansion gate — WP06-04A

11 October 2026. **M1 is not accepted. M2 delivery remains gated.** The accepted
journey, boundary, publication and experience reviews support the required
visual and technical results on frozen C within their recorded scope. Required
published acoustic observations remain **blocked**, with `acousticStatus:
unverified`. An accurate completed report, successful publication and accepted
child handoffs do not satisfy that remaining release criterion.

## Fixed release header

| Field | Value |
|---|---|
| `release` | M1 |
| `candidateRef` | [CANDIDATE.json][CAND]; exact Controller-frozen C, not a future deployment |
| `url` | [Published project entry](https://alexbrasier451-tech.github.io/Learning-is-Fun/) |
| `buildId` | `4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1` |
| `acceptance` | **not-accepted** |
| `requiredCaseDispositions` | [Required case dispositions](#required-case-dispositions): D1–T2, finite boundary cases, visual criteria and nine blocked acoustic rows |
| `criterionReviewRef` | [WP02-12A experience handoff][EX], independently [validated PASS][EV] and accepted by Controller; required visuals/technical controls supported, mandatory acoustics unverified |
| `defects` | [Retained defect and closure record](#retained-defect-and-closure-record); B failures remain failed on B, corrected originals applicable to C, M1-ACOUSTIC remains open |
| `limitations` | [Limitations and residual observations](#limitations-and-residual-observations) |
| `starterSaveRef` | Untouched genuine B [starter-save.json][SAVE] and [starter-save-provenance.json][PROV]; [compatibility handoff](#genuine-starter-save-and-later-m2-handoff) |

Application source is `4ce77058e60f8f87285e5b8f63c7630fdaffb188`, Pages
[run38121872059](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38121872059),
project base `/Learning-is-Fun/`. Controller froze C at **07:49:53 UTC /
08:49:53 BST on 11 October 2026**, as recorded in [PAGES-M1-C-EXECUTION][FREEZE].
The final published Firefox smoke used CI source
`308880f8cfc0a82cb478741d55631de397bae43a`; it observed deployed C above.
These two source identities are deliberately distinct.

Historical B is `b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1`,
application source `b158e2b3de86d119c1650996977201264563abde`. No historical
failed row, screenshot, trace or export is rewritten as a C pass.

This report consumes Controller-accepted DEP-079/080/081: [experience][EX],
[JOURNEY][J] and [BOUNDARIES][B], with their independent [experience][EV],
[journey][JV] and [boundary][BV] validations. [Current execution authority][AUTH]
supersedes historical planning-only wording. Controller's dispatched 30/49
accepted children are bounded outputs, not M1 release acceptance. This writer
owns this report only; it has performed evidence reconciliation, not another
journey, broad suite, publication or listening session.

## Required case dispositions

Use the existing observation statuses `passed`, `failed`, `blocked`, `untested`
and separate acoustic values `verified`, `unverified`, `not-applicable`.
The tables below aggregate existing rows; they do not replace WP06-01A's
observation schema. Original candidate, environment, setup, actions,
expected/observed, evidence, owner, retest and applicability fields remain in
the linked observer records and native artifacts. A technical pass does not
populate an acoustic pass.

Applicability basis **C-direct** means actual frozen-C observations. **B-carried**
means the independently accepted B result retained with its original identity
and limits. The accepted [publication comparison][CP], [JV] and [BV] establish
the six changed runtime paths: App, AppShell, AudioControls, AdventureView,
QuestActivity and experience CSS. State/repository/backup/preferences core,
learning/evaluation, reward/calendar, activity widgets, audio controller/speech,
platform and all 44 approved media bytes remain unchanged. The affected
mission/save/retry/text/ending paths have direct C retests. This scoped basis
does not retain a B presentation failure or infer new C execution.

### Journey matrix and actual actions

All matrix sessions use the actual project HTTPS entry and Europe/London.
Fresh C D1/T1/T2 visible Help and complete native active-worker C were checked
before profile input. Initial controller-null is disclosed in native records;
active registration is not described as initial page control. D1/T1 are fresh
normal UI journeys, without injected save, answer or progression. Row sets
are [C D1][D1], [C T1][T1], [C T2][T2], [B capture index][BJ] and [C capture
index][CJ], adjudicated by [JV].

| Required case | Actual environment/input | Observer status and observed result | Final-build applicability |
|---|---|---|---|
| D1 complete M1 entry→Q1–Q3→ending→Hall/reload | Windows 11, branded Chrome155.0.8059.40, 1366×768; native keyboard | **passed**. Fresh C D1 River; actual Tab/Enter and keyboard typing through Help/profile/onboarding; wrong→hint→dirty→Undo→success in all three missions, scene-correct resumes, adult notebook, UI backup, appearance and exact reload. 34 passed rows. | C-direct full affected path; JR-01 closed. Native trace has no locator focus/fill/type/press/click/tap calls. Application autofocus is disclosed. |
| T1 complete M1 entry→Q1–Q3→ending→Hall/reload | Windows, Chromium156.0.8078.4, hasTouch1024×768; trusted CDP touch drag/cancel and native taps, normal form entry | **passed required journey**, with **two failed observer rows retained**. Fresh C T1 Willow; verified alternate solution and all missions/ending/saved appearance/reload complete in one uninterrupted trace. Final90 lifetime/30 weekly/3 turns. | C-direct full affected path; actual extra bridge Check retained, not reset. 26 passed +2 failed observations; details below. |
| T2 each activity, portrait/rotation, profile/navigation/reload | Windows WebKit27.2, hasTouch768×1024↔1024×768, native taps, reduced motion | **passed** finite coverage: B all three activities/rotations and Fern/Hazel isolation; C exact/nearby enlargement, retained question draft and settled Hall. C9 passed rows, not a second full T2 adventure. | B-carried unchanged activities/input/state; C-direct affected heading and loaded Hall, with refreshed D1/T1 scenes/ending and accepted experience review. B broken/pending images do not pass. |
| D2 bounded entry/profile/bridge-resume/Check/adult/Hall/project reload | Windows, Edge155.0.4283.45,1920×1080 | **passed** C smoke1/0skipped/0unexpected/0flaky; one unscored6m draft survives reload/resume under River Bridge, second6m Check1 and Hall40/20/1. | C-direct, original [native results][D2] and [JV]; smoke does not replace full D1/T1 play. |
| D3 same bounded smoke | Linux6.17.0-1022-azure, Firefox157.0, Playwright1.64.0,1280×720 | **passed** C [run38122814533](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38122814533), artifact11696155843;1/0skipped/0unexpected/0flaky. River Bridge resume and Hall40/20/1. | C-direct [independent native receipt][JV]. CI source differs from deployed source; two descriptive candidate-label changes leave selectors/actions/assertions/count unchanged. Earlier Firefox B run remains B only. |
| Q1 two valid combinations/error/help/pre-Check/result/restoration | Full D1/T1 plus B mouse/T2 variants | **passed** 6+6 and visibly verified3+4+5; incorrect sums yield explanatory feedback, acknowledged hint and supported retry. Draft/edit/cancel earns nothing before Check. | C-direct originals and related paths; unchanged B mouse/rotation variants retained. |
| Q2 reviewed punctuation/pre-Check/result/restoration | Full D1/T1; B T2 activity/rotation | **passed** question`?` plus discovery`.` or`!`; wrong response→hint→edit/Undo→saved success. Live asking/discovery explanations and library restoration retained. | C-direct affected feedback/scene; B-carried complete T2 tap/rotation variant, C-direct heading. |
| Q3 merchant/pre-Check/result/restoration | Full D1/T1; B T2 activity/rotation | **passed** actual6 apples/3 pears; wrong5/3→hint→edit/Undo→explicit Check; written total9/twice-as-many explanation, stocked market and planter ending. | C-direct affected path; B-carried T2 unchanged widget/rotation. |
| Transfer/revisit/restore/no-repeat/creative save | Normal Leave→Hall→Back→Resume and completed-location return | **passed** story restoration remains, appearance preview differs from explicit Save, reload retains it; optional draft/appearance/revisit add no fresh quest reward. D1 optional10m/6m resume; fresh T1 bound Practice10m/6m resume. | C-direct. D1's later practice reuses its open optional task and is not counted as fresh-practice proof; T1 supplies that proof. |
| Access/mouse/touch/keyboard/no-audio | Matrix scope above, B D1 nearby mouse/click/Undo, B/C enlargement and reduced-motion variants | **passed** required D1 native keyboard path; trusted T1 drag/cancel/tap; T2 tap/rotation; visible focus/dialog Escape-return, text routes, sampled targets and restored static equivalent. | C-direct affected path and text; B-carried unchanged widgets/mouse variants. Sampled target/contrast evidence, not universal certification. |

Actual C D1 choices were wrong6m→hint→6+6, wrong`.`/`.`→hint→`?`/`.`,
wrong5 apples/3 pears→hint→6/3. Each first wrong Check adds5 lifetime/5 weekly;
each supported success adds25/5, comprising5 remaining question points and a
separate once-lifetime20 quest receipt. Final **90/30/3**, three unique story
receipts, plum scarf/gold flowers/spot3; adult notebook, downloaded backup and
reload agree. Appearance and the unscored optional draft add no reward.

Actual C T1 starts with native drag6m and cancellation of4m leaving6m unchanged.
After wrong6m/hint/dirty/Undo, the observer intended3+4+5 but constructed
**3+3+5=11m** and checked before using readback. `C-Q1-ALTERNATE-DIRTY` and
`C-TOUCH-INPUT-DIVERGENCE` remain **failed** in [adjudication][T1]; original
prose/pixels/DOM and [observation correction][TC] are preserved. Check2 correctly
rejects one metre short and adds0/0. Normal remove/reselect and explicit native
readback then verify3+4+5=12m; Check3 succeeds for25/5. Q2 wrong`.`/`!`→hint→`?`/`!`
and Q3 wrong5/3→hint→6/3 follow. Final **90/30/3**, amber scarf/violet flowers/spot2,
saved ending/reload; fresh unscored Practice and no-repeat Hall leave it unchanged.
These failed observation rows establish no product selection or scoring defect;
the later supported evidence satisfies the required combination. They are not
converted to passes or counted as an unassisted120/60 journey.

### Controlled boundary and platform cases

The [C applicability index][BI] links each original row and evidence identity;
[BOUNDARIES][B] and [independent review][BV] supply the precise finite oracles,
canonical/encounter/opportunity/week/component facts and native observations.
Original B D1 is Windows Chrome155.0.8059.40/1366×768/keyboard-mouse; audio T1
is Chromium156.0.8078.4/1024×768 with native button taps, keyboard sliders and
normal file/text controls. These mixed inputs do not prove an all-touch battery.
Whole-save fixtures are producer-validated and imported through normal adult
file/preview/confirm UI; isolated browser clocks/failure/network controls remain
disclosed. Normal UI-created starter setup is distinct from seeded fixtures.

| Required case / observer IDs | Expected→observed disposition | Final-build applicability / evidence |
|---|---|---|
| LOCAL: two profiles, durable switch/resume | **passed** River/Moss isolated; Moss has no learning/quests/points; exact reload retains separate state. | B-carried state/profile paths; [BI] M1-LOCAL, [BV]; C fresh journey persistence and F01 imported-save equality also supported. |
| BACKUP: whole export/import/reexport | **passed** genuine logical save equals untouched export after adult confirmation and normal reexport; new local epoch/revision0 is deliberate. | B-carried backup/repository paths; [B] whole-backup row, [BV], [SAVE]/[PROV]. |
| BACKUP invalid/truncated rejection | **passed** actual adult import says malformed/truncated; complete prior native root unchanged. | B-carried same decoder/repository; [B] invalid row/local-results.json, [BV]. This is the named invalid case, not every SCENARIOS rejection variant. |
| REWARD edit before Check | **passed** Q1[6,6] draft leaves saved root/revision4 and attempts/points unchanged. | B-carried [BI] M1-REWARD; C Q1–Q3 pre-Check observations refresh presentation. |
| REWARD first unassisted success | **passed** question+20 plus separate lifetime-only quest+20 →40 lifetime/20 weekly/slot1. | B-carried reward/core; [B] Q1 success/[BV]; C D2/D3 corroborate40/20/1. |
| Wrong Check/hint/supported later success | **passed** wrong+5/+5; sticky hint and wrong-first fact; later question+5 plus Q2 quest+20 →70 lifetime/30 weekly after Q1/Q2. | B-carried [BI] M1-REWARD/PRACTICE; C D1/T1 refresh affected feedback, actual90/30/3 full totals. |
| PRACTICE-LIFECYCLE suspend vs Finish | **passed** offline leave/reload adds no completion; real Finish abort preserves root8; identical action retry commits one unsuccessful episode at9, no new Check/points. | B-carried [BI] M1-PRACTICE/[BV], same native lifecycle/repository. |
| Episode continuation | **passed** same canonical/encounter/opportunity/earning week/cumulativeCheck1 and assistance; episode2 starts0 local Checks; later success is cumulativeCheck2/episodeCheck1, supported, no renewed independent-first bonus. | B-carried exact [B] episode row/[BV]; not a replacement identity or new reward eligibility. |
| Check failure→identical retry | **passed** actual native put abort preserves committed root and visible optional merchant2/1 draft; equal retained candidate retry commits once,+5/+5. | B-carried [BI] M1-CHECK-FAILURE/[BV]; native repository, not a facade stub. |
| Same-opportunity repeated wrong/later success | **passed** optional mult-2.pears-2 first wrong+5, repeat wrong0, later4/2 supported+5; lifetime125→125→130, weekly65→65→70. | B-carried exact native identity/receipts [BV]; not arbitrary injected duplicate delivery. |
| F01 preference abort/live stop/durable retry/readiness | **passed C; failed B durable recovery retained**. Four first-attempt D1/T1 original/newer cases: native abort keeps root3; live stop; explicit retry holds actual transaction; commit4 acknowledges retained silence; later edits keep Saving until5 commits. Quiet exact reload. | C-direct [C-final-receipt][BR], [B]/[BV]. Genuine B save imported unchanged. See F01 defect below. |
| CAP30th→31st plus independent31st | **passed** continuous and independent fixtures agree:660 lifetime/600 weekly/30 slots at30,680/600/30 at31;+20 lifetime question/+0 competition. Prior three quest receipts explain60 lifetime. | B-carried [BI] M1-CAP/[BV]; same rewards and accepted normal-import fixtures, not31 manual bank questions. |
| WEEK closed-week rollover: whole wrong/hint and saved-wrong variant | **passed** London Sunday2026-07-05 22:59:59Z→23:00Z Monday; original earning weekJune29 retained. Monday supported+5 plus Q1 quest+20 →30 lifetime/0 current/0 slots; archive5/rank1/gold and personal record unchanged. | B-carried [BI] M1-CLOSED-WEEK/[BV]; isolated clock before load, full sequence and shortcut distinguished. No winter/DST/rollback browser cross-product inferred. |
| Due review+3/+7 and same-week completed redisplay | **passed** WP03-selected same total12 canonical/unbound familiar review with fresh opportunity ordinals2/3; each+20/+20 once, lifetime140/200,next dueJuly13/20. Completed Check disabled; reload/redisplay retains rewards/competition/quest archives. | B-carried [BI] M1-DUE-REVIEW/[BV]; genuine accepted fixtures and normal selection; not a second opened encounter or arbitrary duplicate injection. |
| Representative disconnected mission/resume | **passed** complete native cache→setOffline(true)→reload→Q2 construction/wrong/hint/suspend/Finish retry/continuation/saved success, with Q1 restoration retained. | B-carried [BI] M1-OFFLINE/[BV]; C-direct publication's disconnected saved library Resume/help adds final-build platform proof. |
| Complete inventory/origin/fresh entry | **passed** actual C49 origin bodies and both upload archives agree;48 required native cached bodies/revisions complete;44 approved media unchanged; fresh C entry/project reload/Resume first-attempt pass. | C-direct [CP]/[FREEZE]; no broad platform rerun by this report. |
| Failed preparation/two-version update/save and mute preservation | **passed** accepted A→B failed preparation/guarded next-launch lifecycle retained; actual B→C waits for last B page close, activates naturally and preserves full root/epoch/revision72→72. Remembered both mutes,.31/.73 and Silence all; disconnected C Resume no source starts. | Unchanged platform B-carried plus C-direct [CP]; native upgrade evidence, not inferred from a portable export. |

The generic SCENARIOS manifest contains wider producer and later-milestone
variants. This report claims the finite WP06-02A/03A required matrix and accepted
owner/platform evidence above, not every generic fixture on every engine. The
accepted multi-binding amendment retains integrated partial multi-required M2
persistence for WP04-07A; it neither waives an M1 criterion nor waits on M2 to
decide M1.

### Native audio/control and visual criteria

These technical results are **passed**, with final applicability from [BI]/[BV],
[CP] and the [experience review][EX]/[EV]. Native starts/stops/gains/durations and
speech state never establish heard quality or silence.

| Required technical case | Observed result and retained limit | Final-build applicability |
|---|---|---|
| Cold consent/explicit Enable/denial/no-audio | Unrelated Help/profile clicks create no native context; explicit Enable creates genuine playback. Scoped native resume denial gives Retry sound/written Q1 completion; no-local-voice gives truthful text fallback. Full C journeys complete Silent. | B-carried consent/fallback/controller; C-direct silent journeys and F01 library playback. |
| Remembered independent mute/volume | Both mutes/Silence applied before playback; music-off/effects-on and inverse; zero stops/suppresses; middle/max native active gains.5/1; muted slider edits keep Off. | B-carried final D1/T1 controls; C-direct latest muted37%/19% recovery and reload. |
| Two themes/five cues/scene changes | Actual village69.9965s/library76.8s; pickup.85s, placement.8s, support1.65s, success2.15s, restoration4.5s through activity actions. Native crossfade stops old source; pause/resume starts at most one. | B-carried unchanged catalogue/controller/media; C-direct F01 library source. Duration proves identity/delivery, not joins. |
| Read-aloud/Stop/active Silence all | Native local speech speaking before Stop/Silence all; current/queued reading and active sources stopped, master0, written text remains. | B-carried active-speech cancellation. Four C F01 cases had inactive speech and do not retest an actively speaking voice. |
| Profile/navigation/reload/second tab/explicit exit | Silence persists; Pause/Resume cannot bypass latch; real second-page stop intent stops first-page source; deliberate exit preserves other channel preferences. | B-carried controls with original limits; C-direct F01/root reload and B→C update. No cross-tab unmute claim. |
| Native hidden/visible | Actual Chrome noDefaults native visibility events stop hidden source, resume exactly one when permitted; silence survives another hide/show. | B-carried M1-NATIVE-HIDDEN; separate non-calendar probe with uncaptured timezone, no synthetic visibility. |
| Held decoded delivery/cancellation | Genuine decoded buffer held; Silence/Pause before release prevents source start; only deliberate Exit/Resume starts one loop. | B-carried M1-HELD-LOAD; actual native APIs with scoped delivery wrapper, no hearing claim. |
| Failure/pending/latest readiness | Actual C explicit retry has no new context/resume/source while held/committing; saved status follows latest native commit; reload and Pause/Resume0/0/0. | C-direct F01 originals/nearby variants. Keyboard panel traversal starts at programmatically focused toolbar; T1 sliders mixed input. |

Required **visual criteria are passed within the finite matrix**, adopting
WP02-12A's independently supported per-category dispositions rather than a
beauty average. [EX] records six categories for each of ten surface/state rows:
palette/material/cast, focal action, text/control hierarchy, crisp correct
scale, complete states and purposeful motion/static equivalent. The four
scenes (Village Green, River Bridge, Whispering Library, Market Square), three
activities, Pip, creative/planter UI and ending/navigation/Hall all have linked
initial/selected/feedback/dirty/saved/restored evidence. C directly refreshes
the changed scene/save/ending/enlargement paths; B supplies unchanged wider
portrait/rotation/mouse and controller states with explicit rationale above.
Pending initial art frames are excluded from loaded-art proof; later settled
captures and decoded Hall receipt establish loaded states. Proportional timber
scale is supported by the accepted widget proof and native C readback/pixels.
Motion assessment combines producer presentation contracts and committed-state
observations with reduced-motion static equivalents, not still images alone.

### Mandatory acoustic rows: unresolved on C

All nine rows reuse **M1-ACOUSTIC** in [B]/[BI] and the itemized criterion table
in [EX], independently confirmed by [EV]. Each has `status: blocked`,
`acousticStatus: unverified`, `retestedBuildId: null`. Final-build applicability
is **missing heard evidence on exact C**, despite unchanged media. There is no
observed acoustic defect or heard pass. The human-approved replacement selection
(“Much better—use these tracks”) is settled; it is not a complete source audit or
a published joins/cues/transitions/comfort/silence assessment.

| Required row | Missing actual observation | Accountable owner/action |
|---|---|---|
| Village — Market on the Sea / Jonathan Shaw | Complete runtime phrase, join1 and join2; gaps/clicks/seam/level jumps, clipping and comfort | Existing Controller-coordinated capable listener: verify C, hear at least three cycles/about210s and record both joins. Source flaw→WP02-03A; runtime flaw→WP02-05A. |
| Library — Sunset Walk / Kilua Boy | Same complete-phrase/two-join/comfort/relative-level assessment | Same listener on C; three cycles/about230.4s. Same causal routing. |
| Pickup | Audible clarity/level/comfort/clipping/harshness alone and in intended mix | Same listener, ordinary selection trigger on C; effect→03A, mix→05A. |
| Placement | Same cue observations | Same listener, ordinary placement on C;03A/05A by cause. |
| Supportive feedback | Supportive comfortable cue/mix, no startling jump or clipping | Same listener, actual help/feedback on C;03A/05A by cause. |
| Success | Comfortable saved-success cue/mix and level | Same listener, actual acknowledged Check on C;03A/05A by cause. |
| Restoration | Comfortable saved-restoration cue/mix and level | Same listener, actual restoration on C;03A/05A by cause. |
| Theme transition/duplicate music/speech mix | Village↔library transitions, gaps/clicks/stacked music, speech intelligibility/masking and return from ducking | Same listener on C with actual local voice; runtime/ducking→05A, source loudness→03A. Missing real voice leaves masking unverified. |
| Audible control reliability/silence | Independent mutes/zero, Stop current/queued reading, immediate Silence all during active restoration/read-aloud and delayed/resumed playback, no escaped cue; explicit return preserves other channel | Same listener on C; gate/queues→05A, persistence/binding→WP04/WP01 when causal. Native stops/zero/quiet reload do not supply hearing. |

Required handoff is the already-requested listener response: actual C Help
identity, date, device/browser, listener/capture method, headphones/speakers or
other output route, device/music/effects levels and per-item heard pass/fail,
including both joins per track. Source audition/join-cue reel can support
diagnosis but cannot replace published controls, transitions or speech listening.
No repeat human request or track selection was made by this report writer.
Controller routes new observations to WP02-12A for criterion review and then
WP06-04A for the release gate. If listening establishes a defect, Controller
routes the causal fix, new publication if needed, and affected original full-path
retests; this report author does not start workers or modify production.

## Retained defect and closure record

Every entry preserves original scenario/build/environment, reproduction,
expected/observed, impact, causal owner, disposition, fix build, original-case
retest and final applicability. **B** and **C** expand to the exact header
identities. Producer-local/CI passes support correction provenance; closure
below relies on the original observers' published-C paths, not local tests alone.

| ID | Original scenario/build/environment | Reproduction; expected / observed; impact | Causal owner and correction | Disposition / fix build / original-case retest / final applicability |
|---|---|---|---|---|
| J-01 | B M1-Q1-RETRY-DRAFT; Windows Chrome155.0.8059.40,1366×768,keyboard; related punctuation/merchant and T1 | Saved wrong Check→committed hint→edit without Check. Expected unsaved current draft with clearly historical feedback; observed changed12m still “Saved on this device.” Required truthful save-state failure. [Original DOM][J01]. | WP02-06A QuestActivity: retained saved acknowledgement overrode true dirty state. [Correction][JC]/[independent review][JCV] separates savedNotice and shows it only for clean acknowledged baseline. | **closed on C; B failed**. Fix build C. Original complete D1/T1 journeys: six DIRTY/six UNDO states, explicit success/restoration/ending/reload, plus D1 hint-while-dirty; [J]/[JV]/[CJ]. Direct final-C applicability. |
| J-02 | B M1-Q1-RESUME and Q2/Q3; same D1 environment, related T1 | Save draft→Leave→Hall→Back→named Resume. Expected scene/cast matches retained mission; observed correct bridge activity under Village Green. Required mission/restoration coherence failure, not optional. [J]/[BJ]. | WP02-06A AdventureView: acknowledged correct selection but local remounted scene defaulted to village. [JC]/[JCV] derives scene from ready validated M1 binding; no invented unbound context. | **closed on C; B failed**. Fix build C. All six D1/T1 story resumes, D1 optional and fresh T1 bound Practice, ending/reload; D2/D3 bridge smoke corroborates. [JV]/[CJ]. Loaded later T1 art used where initial capture pending. Direct final-C applicability. |
| J-03 | B M1-ACCESS-LIBRARY-HEADING-200; Windows WebKit27.2 touch emulation1024×768 landscape,London | Q1 success→library`?`draft→rotation→snapshot body* HTMLElement font sizes→double inline, leaving roots16px. Expected full reflow; observed heading358/513px,document1148/1024, clipped word. Required200% text failure. [Original checkpoint][J03]. | WP02-06A heading CSS lacks long-word wrapping in two-column layout. [JC]/[JCV] adds overflow-wrap:anywhere without hiding/reducing text. | **closed on C; B failed**. Fix build C. Original T2 mechanism gives90.112px heading358/358/document1024; after style restoration root32px landscape544/544 and portrait704/704, retained unscored`?`. [J]/[JV]/[CJ]. Direct C, no browser-zoom equivalence claim. |
| F01 | B SAVE/PREFERENCE FAILURE; Windows Chrome155.0.8059.40,1366×768,keyboard/mouse; genuine starter import | Enable/unmute/pause/resume/library→native put abort→Silence all→restore writer→Save progress/repeat stop. Expected live stop, prior root preserved and explicit working retry acknowledged only after commit. Live stop passed; durable retry absent, root3 unchanged, candidate4 aborted. Required preference recovery failure. [Frozen original][B]. | WP02-05A AudioControls + WP01 App/AppShell binding to existing WP04 preferences.retry. Queue/repository/live gate correct; missing production UI binding is causal. [Audio correction][AC]/[independent review][ACV] exposes/binds explicit retry. | **closed technical recovery on C; B failed**. Fix build C. Four original/newer D1/T1 native full-flow first-attempt passes, abort→stop→restore→explicit held retry→commit4/readiness→reload; repeated failure/latest edits3→5 variants. [BR]/[BV]. No restart while pending/committing, reload0 contexts/resumes/starts. Direct C; acoustics and active-speech retest not inferred. |
| JR-01 | B D1 keyboard-entry evidence; Windows Chrome155.0.8059.40,1366×768 | Entry used six locator focus calls then Enter plus locator type; expected actual normal keyboard reachability. Activation-after-focus was observed, not full traversal. Required evidence gap, no demonstrated product defect. [JV] original focus-call table. | Original WP06-02A observer owns evidence correction; no production fix. | **closed on C**. Fix build null (evidence-only); retested build C. Fresh full D1 entry uses native Tab/keyboardType/Enter; six focus viewport captures/onboarding record and772 presses, no locator focus/fill/type/press/click/tap. [JV]/[D1]. C-direct; original B limitation retained. |
| M1-ACOUSTIC | B/C M1-AUDIO/M1-ACOUSTIC; D1/T1 technical environments above; capable listener/device/output route unspecified | Existing listener request has no new observations. Expected both themes/two joins each, five cues, transitions/comfort/clipping/duplicate music/speech masking/heard silence. Observed only selected-track approval and technical playback/control results. Mandatory evidence gap blocks release. | Existing Controller-coordinated human/capable listener supplies nine rows above; WP02-12A criterion review, WP06-04A gate. Causal production owner determined only if a real defect is found. | **open: blocked/acoustic unverified**. Fix build null; retest evidence null. Exact C listening needed; unchanged assets/native playback do not satisfy final acoustic applicability. [EX]/[EV]/[B]/[BI]. M2 gated. |

Retained B WebKit art transport failures and the broken Hall frame remain
historical failures/pending pixels. Read-only observer localization found failed
fetch before SVG parsing; normal B reload recovered scene art. C's settled T2
Hall decoded240×240/displayed128×128 and loaded subsequent scene captures close
the evidence gap within [JV]/[EV]. No media-loading production fix or universal
network reliability is claimed. The two failed C T1 observation rows and their
ordinary correction are preserved above; they are not hidden product defects.

## Limitations and residual observations

- Acoustic quality and audible controls remain unverified; no listener route or
  actual new human published observations arrived. Technical event, gain, PCM,
  waveform, source-duration, trace or file evidence does not imply hearing.
- T1/T2 are Windows touch emulation; WebKit is not a physical Safari tablet.
  Physical devices, children, educational efficacy/enjoyment/child pace and
  universal accessibility certification are **untested** and are not new gates.
  D2/D3 are bounded smoke; T2 C is bounded text/Hall retest; carried B coverage
  remains B. Audio panel input is mixed; local retry focus traversal is not a
  complete keyboard-only control battery.
- Optional composition refinements retained by [EX]/[EV]: tall persistent shell
  (WP01/AppShell with WP02-06A spacing), desktop feedback lines exceeding the
  art direction's32–60-character direction (WP02-06A typography), and aggressive
  enlargement word-boundary polish (WP02-06A). Readable hierarchy/reachable
  actions and complete reflow are supported; numerical line-length compliance
  or optimal composition is not claimed. No new beauty average/above-fold quota
  waives or replaces the actually corrected required defects. These refinements
  have no fix/retest build and remain optional owner backlog applicable to C.
- No clean-console/zero-error blanket claim: original observer errors, pending
  art waits, selector/assertion corrections, D1 favicon404 and native Firefox
  teardown diagnostics remain in accepted records. None is an independently
  established unresolved required-flow defect after retained continuations.
- C time to conclusion/whole evidence session: D1 **171.200s/344.995s**, T1
  **284.001s/557.209s**. T2 C112.083s is a bounded session. B conclusion intervals
  remain309.736s/176.158s/464.423s. These are agent observation timings including
  inspection, not child pace or a20–30-minute release/timer requirement.
- Release scope is M1's three starter quests and named finite cases. Broader
  ten-quest M2 acceptance awaits its later observers/report; no M2 proof or new
  dependency is required to finish this accurate M1 report.

## Genuine starter save and later M2 handoff

Preserve [SAVE] unchanged: **22,690 bytes**, SHA-256
`7400aef18215e63f5d44303e8c16c804bc323e1f534a9edbe70956e563bc6c3e`.
Normal adult UI downloaded it at **2026-10-11T06:28:27.726Z** on frozen **B**,
before M2 existed. Format `learning-is-fun-save`, schema1/content`m1`/reward
policy1; [PROV] retains actual pre-export native root and setup actions.
Subsequent imports used copies; no C/M2-created substitute replaces it.

- River Boundary `6d6f8fd7-46a7-438c-8129-71d152f1c0e2`: completed Q1/Q2/Q3
  permanent story bindings/receipts,115 lifetime/week2026-10-05 points55/four turns.
- Moss Boundary `7860f109-c161-4b73-8b92-02f5c4fa8338`: no learning/quest/points.
- Unfinished optional merchant `lif.math.merchant.r1.mult-2.pears-1`, encounter
  `75d97a4f-733b-460f-82f2-59a884fc1909`, opportunity
  `50c8f1d7-d271-4645-b16c-6f5e636f6845`, binding`q3-transfer-m04`, descriptor
  revision`starter-maths-1`; draft1 apple/0 pears, cumulativeCheck1,
  firstCheckCorrect=false, episode1 suspended/completionActionId=null,
  acknowledged merchant-requests hint/answerHintUsed=true, earning week2026-10-05,
  slot4/answer component only.
- Installation soundEnabled=true/Silence all=true, both channels muted,
  both volumes.5. These are actual normal UI state, not manufactured fixtures.

[BV] independently verifies the export/provenance/native/import/reexport
agreement and hash; [BR] verifies its unchanged reuse on C. WP04-07A consumes
logical compatibility later; WP01-05A owns the separate native upgrade context,
with WP06-06A later observing it. A portable export is not native worker
activation evidence. This reference crosses the existing M1 gate transitively;
it adds no M2 wait/dependency and does not authorize M2 delivery while M1 is
unaccepted. Later REQ-010/GAP-010 M2 defect completion remains WP06-07A-owned.

## Frozen handback and gate

**acceptance: not-accepted.** The exact unresolved required rows are the nine
M1-ACOUSTIC rows above, owned by the existing Controller-coordinated capable
listener action followed by WP02-12A review and WP06-04A reconciliation. No
mandatory visual or technical journey/boundary/control deficiency remains
established by the accepted reviews. Acoustic blocked/unverified is sufficient
to prevent release acceptance. **M2 delivery remains gated**, including the
later compatibility/expansion work that requires accepted M1; report completion
and Controller acceptance of this bounded output must not release that gate.

This report is frozen for independent review. It cites the accepted evidence
and retained corrections without duplicate play, broad suites or new listening
claims. Only `docs/playtests/M1/REPORT.md` was authored. No production, tests,
assets, observer reports, shared package, Git, deployment, other-chat messaging
or worker creation/delegation was performed. Independent review and Controller
administrative disposition of this report remain separate from M1 acceptance.

[CAND]: ../../release/M1/CANDIDATE.json
[AUTH]: ../../work-package/GLOBAL_RULES.md
[FREEZE]: ../../work-package/execution/PAGES-M1-C-EXECUTION.md
[CP]: ../../work-package/execution/M1-CORRECTED-PUBLICATION-VALIDATION.md
[J]: JOURNEY.md
[B]: BOUNDARIES.md
[JV]: ../../work-package/execution/WP06-02A-VALIDATION.md
[BV]: ../../work-package/execution/WP06-03A-VALIDATION.md
[EX]: ../../acceptance/m1-experience.md
[EV]: ../../work-package/execution/WP02-12A-VALIDATION.md
[JC]: ../../work-package/execution/PUBLISHED-JOURNEY-CORRECTION-HANDOFF.md
[JCV]: ../../work-package/execution/PUBLISHED-JOURNEY-CORRECTION-VALIDATION.md
[AC]: ../../work-package/execution/PUBLISHED-AUDIO-RETRY-HANDOFF.md
[ACV]: ../../work-package/execution/PUBLISHED-AUDIO-RETRY-VALIDATION.md
[CJ]: ../../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/journey/visual-index.md
[BJ]: ../../../artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/journey/visual-index.md
[D1]: ../../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/journey/D1/adjudicated-rows.json
[T1]: ../../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/journey/T1/adjudicated-rows.json
[T2]: ../../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/journey/T2/adjudicated-rows.json
[TC]: ../../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/journey/T1/observation-corrections.json
[D2]: ../../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/journey/private/smoke-edge-c-01/results.json
[BI]: ../../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/boundaries/checkpoint-index.json
[BR]: ../../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/boundaries/C-final-receipt.json
[J01]: ../../../artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/journey/D1/M1-Q1-RETRY-DRAFT/step-11/visible-state.txt
[J03]: ../../../artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/journey/T2/M1-ACCESS-LIBRARY-HEADING-200/step-27/checkpoint.json
[SAVE]: ../../../artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/starter-save.json
[PROV]: ../../../artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/starter-save-provenance.json
