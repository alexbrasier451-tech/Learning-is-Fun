# M1 visual and acoustic criterion handoff — WP02-12A

11 October 2026. Frozen report-only handoff for REQ-014 to WP06-04A through
DEP-079. Controller accepted WP06-02A and WP06-03A and released DEP-077/078
before this review. **Recommend closure of the required visual criteria and the
supported technical sound-control criteria on C. Acoustic acceptance remains
blocked/unverified.** This is a criterion recommendation, not M1 release
acceptance. WP06-04A alone owns that decision; M2 remains gated.

## Record header and evidence applicability

| Field | Inspected value |
|---|---|
| Milestone / owner | M1 / WP02-12A; owned output: this file only |
| Published URL | [Actual GitHub Pages project entry](https://alexbrasier451-tech.github.io/Learning-is-Fun/) |
| Candidate C | `4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1` |
| Application source / Pages run | `4ce77058e60f8f87285e5b8f63c7630fdaffb188` / `38121872059` |
| Controller freeze | 11 October 2026, 07:49:53 UTC / 08:49:53 BST; [candidate ledger](../release/M1/CANDIDATE.json), [publication/freeze](../work-package/execution/PAGES-M1-C-EXECUTION.md) |
| Original B | `b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1`; source `b158e2b3de86d119c1650996977201264563abde`. Original failures remain failures on B. |
| D1 observed environment | Windows 11 / Chrome 155.0.8059.40 / 1366×768 / actual native keyboard full C journey; retained B mouse drag/click variant. Boundary controls use keyboard/mouse. |
| T1 observed environment | Windows / Chromium 156.0.8078.4 / 1024×768 / touch emulation; native CDP drag/cancel and native journey taps. Boundary controls mix taps with keyboard sliders and normal file/text controls. |
| T2 observed environment | Windows / WebKit 27.2 / 768×1024 portrait ↔ 1024×768 landscape / native taps, reduced-motion emulation; B three-activity/rotation coverage plus bounded C text/Hall retest. |
| D2 observed environment | Windows / Edge 155.0.4283.45 / 1920×1080 / C bounded entry, profile, bridge resume/success, adult and Hall smoke; not another full journey. |
| D3 observed environment | Linux 6.17.0-1022-azure / Firefox 157.0 / Playwright 1.64.0 / 1280×720 / same C bounded smoke. CI source `308880f8cfc0a82cb478741d55631de397bae43a` differs from deployed C; [independent receipt][JV]. |
| Timezone | Europe/London in journey/boundary matrices. Separate B native-visibility probe did not capture timezone; its non-calendar scope is retained. |
| Visual producer references | [art direction](../art-direction.md), 9 October; [static reference](../art-direction-reference.svg); accepted [01A handoff](../work-package/execution/WP02-01A-HANDOFF.md), [02A handoff](../work-package/execution/WP02-02A-HANDOFF.md), [06A handoff](../work-package/execution/WP02-06A-HANDOFF.md), [07A handoff](../work-package/execution/WP02-07A-HANDOFF.md), and their independent validations. |
| Audio producer references | [licensed replacement direction](../audio-direction.md), 9 October; accepted [03A handoff](../work-package/execution/WP02-03A-HANDOFF.md) / [technical validation](../work-package/execution/WP02-03A-VALIDATION.md); human approved pair: “Much better—use these tracks.” Detailed source and published listening were not supplied. |
| Register / rights | [asset-register](../../assets/asset-register.json), schemaVersion 1; 37 ready M1 SVG rows (36 scene/character/prop/UI exports plus app-icon), two ready loops, five ready effects. [Art provenance](../../assets/source/art/m1/PROVENANCE.md) and [audio provenance](../../assets/source/audio/PROVENANCE.md); published C validation confirms all 44 media unchanged from B. |
| Inspected reference revisions | SHA-256 of this review's bytes: art-direction `d5201c70212b5260fed68e8184b3b095a4ebf1b5533035d714746f3d41e7e511`; audio-direction `c367e8c18daf2be2f66f31de83356925927b8980763d742e888dbe62a7efcbb8`; asset-register `5558d48569e1c0ed9dcac50b504fd1e7ea603a201a41b102d35fad880817872c`. These identify read inputs, not new production revisions. |

Consumed the accepted final [JOURNEY][J] and [BOUNDARIES][B], their
[journey handoff](../../execution/WP06-02A-HANDOFF.md),
[boundary handoff](../work-package/execution/WP06-03A-HANDOFF.md), and independent
[journey][JV] / [boundary][BV] validations. Historical pending paragraphs are
superseded only by their final C addenda. This review used retained evidence;
it did not open the game, run another adventure, tests or deployment.

[C's original capture index][CJ] and [B's annotated index][BJ] preserve pixels,
accessible DOM and checkpoint metadata under the original WP06 observation IDs.
The selected originals viewed here include C D1 resumed library, punctuation
success, restored bridge, dirty merchant, conclusion and saved gold planter;
C T1 verified 3/4/5 draft, punctuation success and saved violet planter;
C T2 exact enlarged heading, root-enlarged portrait and settled Hall;
B T2 portrait punctuation, recovered portrait village and landscape market;
and C D1 failed preference save / T1 latest saved sound choices.
Linked row sets provide the other required states; no screenshot quota is used.

Applicability follows the accepted [C publication validation][CP], [JV] and [BV]:
B→C changed App, AppShell, AudioControls, AdventureView, QuestActivity and
experience CSS. Art/audio bytes, interaction widgets, learning, state/repository,
preferences core, rewards/calendar, audio controller/speech and platform paths
remain applicable. C directly refreshes affected save/resume/restoration/ending,
keyboard entry, enlarged-heading and F01 UI recovery paths. Wider B T2 activities,
rotation, mouse/access and unchanged audio-controller observations are **carried B
evidence**, not new C runs. A pending/blank initial frame never proves loaded art;
later settled captures are used explicitly.

## Category-by-surface visual results

For each row, the observed-result clauses separately adjudicate the six required
AC1 categories: **palette/material/cast; focal action; text/control hierarchy;
crisp correct scale; complete states; purposeful motion/static equivalent**.
Each category is passed within the named DEC-005 coverage, unless stated
otherwise. The motion conclusion combines published committed-state observations
with the accepted 06A/07A presentation contract; still images alone do not prove
an animation's trajectory. Reduced-motion evidence is the actual B T2 restored
state and C T2 zero-running-animation observation. Static UI needs no decorative
animation. No child enjoyment, universal accessibility or physical-tablet claim
follows from these results.

| Criterion | Surface/state | WP06 observation/artifact link | Observed result | Status | Causal owner | Correction reference | Retested build/observation | Remaining limitation |
|---|---|---|---|---|---|---|---|---|
| AC1, all six categories | Village Green: initial welcome, Q3 bunting/lights, saved planter | C D1 C-CONCLUSION/C-APPEARANCE-SAVED; C T1 C-APPEARANCE-SAVED [CJ]; B T2 M1-VISUAL-VILLAGE-RECOVERED [BJ]; C fresh initial village [sound saved pixels][CS] | Palette passed: cream walls/coral roof/forest hills match Pip and props. Focal passed: Meet Pip or completion/planter action is named. Hierarchy passed: scene title, story and verbs remain distinct. Scale passed: intact 960×600 scene, restrained foreground and aligned planter/socket. States passed: plain→lit/bunting→saved gold spot3/violet spot2; reload retains appearance. Motion passed: changed layer/text persists after the brief commit presentation and in reduced-motion portrait. | passed | WP02-06A view; WP02-07A creative; WP02-02A art | No new correction; J-02 closure below | C D1/T1 conclusion/save/reload; carried B T2 settled portrait | B transport-fallback frame remains historical; no C full T2 adventure inferred. |
| AC1, all six categories | River Bridge: broken/joined, Rowan, resumed required/optional/practice contexts | C-J02-Q1-RESUME, C-Q1-SUCCESS, C-Q1-RELOAD-RESTORATION, C-J02-OPTIONAL-RESUME/C-J02-REVISIT-RESUME [CJ]; B T2 M1-Q1-RESTORATION-CONFIRMED [BJ] | Palette passed: warm timber over teal river, coherent Rowan portrait. Focal passed: build/crossing or clearly optional practice action. Hierarchy passed: correct mission title and retained task agree. Scale passed: complete arch/rail and foreground, no stretched scene. States passed: broken deck→continuous joined deck only after saved Check; resumed context now River Bridge. Motion passed: restoration serves the changed crossing; reduced-motion immediately shows that same deck and text. | passed | WP02-06A; WP02-02A | [J-02 correction][JC] | C D1/T1 full original paths and D2/D3 bridge smoke [JV] | Smoke covers bridge only; old B Village Green mismatch is not passed. |
| AC1, all six categories | Whispering Library: sleeping/open/lit, Iona, resumed punctuation | C D1 C-J02-Q2-RESUME/C-Q2-SUCCESS; T1 C-J01-Q2-DIRTY/C-Q2-SUCCESS; T2 C-J03-HEADING-VISIBLE [CJ]; B T2 M1-Q2-RESTORATION-CONFIRMED [BJ] | Palette passed: plum roof, cream book-gable, warm windows and Iona share the family. Focal passed: sentence-mark task then named next adventure. Hierarchy passed: live asking/discovery prose; enlarged heading fully wraps. Scale passed: complete shelf/door/scene edges, coherent portrait. States passed: sleeping→open/light/spellbook plus matching caption, loaded later T1 capture rather than pending initial art. Motion passed: reveal leads to durable static open library; reduced-motion retains it. | passed | WP02-06A view/CSS; WP02-02A art | [J-02/J-03 correction][JC] | C D1/T1 saved/resumed states; C T2 exact and nearby text variants | Exact 200% heading breaks a long word over lines; readable reflow, not polished word-boundary composition. |
| AC1, all six categories | Market Square: empty/stocked, Nessa, resumed merchant | C-J02-Q3-RESUME/C-J01-Q3-DIRTY/C-Q3-SUCCESS [CJ]; B T2 M1-Q3-RESTORATION-CONFIRMED [BJ] | Palette passed: coral cloth awning, timber crates, wicker fruit and Nessa match other scenes. Focal passed: fill basket before Check, return/planter after success. Hierarchy passed: both requests and saved versus dirty feedback remain explicit. Scale passed: complete stall, portrait/basket fit; fruit drawings beside live counts. States passed: empty→stocked apples/pears/bunting with saved caption. Motion passed: short saved-change presentation has a complete static stocked equivalent. | passed | WP02-06A; WP02-02A | [J-01/J-02 correction][JC] | C D1/T1 original dirty/Undo/success/resume flows; carried B T2 settled landscape | Long feedback-line refinement below; no physical-device evidence. |
| AC1, all six categories | Bridge activity: initial, selected/placed, wrong/hint/dirty/Undo, correct saved | C-Q1-PRECHECK/C-J01-Q1-DIRTY/C-J01-Q1-UNDO/C-Q1-SUCCESS; T1 C-Q1-TOUCH-DRAG/C-Q1-TOUCH-CANCEL/C-Q1-ALTERNATE-VERIFIED [CJ]; B mouse/access and T2 bridge [BJ] | Palette passed: approved timber and quiet panels. Focal passed: choose/place/Check verbs, clear legal destinations. Hierarchy passed: live metre labels and total; Selected text/tick, retained historical feedback. Scale passed: 3/4/5 drawings have unequal lengths at a common scale; padded hit areas are separate from art. States passed: drafts unscored, wrong retained, Undo restores acknowledged baseline, explicit saved success restores bridge. Motion passed: drag/cancel adds no scoring; static tap/keyboard route yields the same draft. | passed | WP02-04A widget; WP02-06A feedback/view | [J-01 correction][JC]; accepted [proportional-plank recheck][IV] | C D1/T1 affected journey; B desktop mouse and T2 rotation/enlargement carried | T1 3/3/5 observer mistake remains failed as an observation; actual rejection/0-point result was correct, then 3/4/5 readback succeeded. |
| AC1, all six categories | Punctuation activity: empty/partial/full selected marks, wrong/hint/dirty/Undo/saved | C-Q2-WRONG-DRAFT/C-J01-Q2-DIRTY/C-J01-Q2-UNDO/C-Q2-SUCCESS [CJ]; B T2 M1-Q2-PORTRAIT-DRAFT/M1-Q2-PRECHECK-ROTATED/M1-Q2-SUCCESS [BJ] | Palette passed: paper/amber/teal within common family. Focal passed: choose mark then labelled sentence slot and Check. Hierarchy passed: asking versus discovery live text, full mark tiles, selected label beyond colour. Scale passed: small glyphs sit in large targets without stretching art. States passed: partial/full retained through rotation, wrong→written help→historical dirty→saved ?/period or ?/!; both meanings preserved. Motion passed: placement/selection is immediate; no motion-dependent meaning. | passed | WP02-04A; WP02-06A | [J-01/J-03 correction][JC] | C D1/T1 feedback paths; C T2 text/draft restoration; B T2 full state/rotation carried | Enlarged Selected word wrapping is a refinement; J-03 horizontal heading overflow is separately closed. |
| AC1, all six categories | Merchant activity: initial/selected fruit, partial 5/3→6/3, wrong/hint/dirty/Undo/saved | C-Q3-WRONG-DRAFT/C-J01-Q3-DIRTY/C-J01-Q3-UNDO/C-Q3-SUCCESS [CJ]; B T2 M1-Q3-LANDSCAPE-DRAFT/M1-ACCESS-MERCHANT-200/M1-Q3-PRECHECK [BJ] | Palette passed: same apple/pear/wicker art. Focal passed: select/place fruit or labelled number controls, then Check. Hierarchy passed: counts/total and two independent requests remain live. Scale passed: crisp separate fruits/targets; no answer depends on decorative stall. States passed: partial survives rotation, wrong feedback retains draft, changed draft truthfully unsaved, Undo and saved 6/3 agree. Motion passed: equivalent non-drag manipulation works; no timed gesture required. | passed | WP02-04A; WP02-06A | [J-01 correction][JC] | C D1/T1 full affected paths; carried B T2 rotation/200% | Sampled enlarged/native target evidence, not every platform/input cross-product. |
| AC1, all six categories | Pip: idle/help/celebration, written guidance, Read/Stop fallback | C dirty/help/success captures and C-J01-Q1-DIRTY-HELP [CJ]; B D1/T1 speech/cancellation in [B], [BB] results18/34/43 | Palette passed: russet/cream fox and scarf match authored cast. Focal passed: Ask Pip/Continue/read actions labelled. Hierarchy passed: guidance remains visible while Silent or unavailable. Scale passed: silhouette/ears/scarf fit beside text. States passed: approved help visible after committed request, no automatic reading; success pose follows saved result. Motion passed: finite celebration is feedback, not progression; static equivalent and written success remain. | passed | WP02-07A; WP02-06A host; WP02-05A speech | No new visual correction | C D1/T1 written help/success; B speech controller results carried | Heard voice clarity/masking unverified; controlled missing-voice case is not a physical device study. |
| AC1, all six categories | Creative UI: scarf/flowers/socket preview, save, return/reload | C-APPEARANCE-PREVIEW/C-APPEARANCE-SAVED/C-FINAL-RELOAD [CJ]; B T2 M1-CONCLUSION-SAVED/M1-VISUAL-VILLAGE-RECOVERED [BJ] | Palette passed: original scarf/flower/clay overlays match Pip/garden. Focal passed: choose colour/spot then Save arrangement; free choices identified. Hierarchy passed: preview versus saved, Undo/Cancel/Save and availability labels distinct. Scale passed: overlay coordinates align; planter seats in selected socket. States passed: preview differs from acknowledged saved appearance; plum/gold/spot3 and amber/violet/spot2 survive exact reload. Motion passed: cosmetic presentation grants no quest/reward; saved static arrangement remains. | passed | WP02-07A; WP02-06A host | No new correction; accepted [07A validation](../work-package/execution/WP02-07A-VALIDATION.md) supports component fault/state variants | C D1/T1 preview/save/ending/reload; B T2 portrait saved arrangement carried | Producer component fault cases are not additional published C sessions. |
| AC1, all six categories | Completion, navigation and Hall | C-CONCLUSION/C-APPEARANCE-SAVED/C-FINAL-HALL/C-FINAL-RELOAD/C-HALL-EMBLEM-SETTLED [CJ]; D2/D3 C smoke [JV]; B recovered portrait village [BJ] | Palette passed: same village welcome and Hall emblem/materials. Focal passed: explicit first-adventure complete; optional customise/practice/Hall/resume. Hierarchy passed: three Restored labels and local-browser standings. Scale passed: full village/map/emblem, C T2 decoded 240×240 emblem displayed 128×128. States passed: completion and appearance survive reload; C full journeys 90 lifetime/30 weekly/3 turns, no-repeat unchanged. Motion passed: celebratory change settles to static completion, no timed next action. | passed | WP02-06A/07A; WP05 Hall; WP01 shell/media | J-02 view correction; settled Hall collection [JV] | C D1/T1 endings/reloads, T2 settled emblem, D2/D3 finite smoke | B broken Hall image and transport fallback remain original failed/pending pixels; not retrospective passes. |

The bridge-scale check required one extra bounded input read: accepted WP02-04A
[handoff](../work-package/execution/WP02-04A-HANDOFF.md)/[validation][IV], retained
C `dist.tar.gz` identified by [CP], and the original T1 native trace. These
resolve an apparent equal-width impression in the resized preview. The retained
C bundle and native DOM include `iw-timber-art`, original SVG widths and
length-dependent inline sizes. A read-only scan of the original
[C-Q1-ALTERNATE-VERIFIED PNG][PL] at native y=2067 finds the three straight
top-border runs of colour `#795b3c`: x128–264, x336–520, x589–820 (137, 185,
232 pixels). Rounded corners shorten these runs, so they are not full body
widths; their roughly 48px increments support visibly different lengths.
No rendering failure is established and no fix/retest is requested from this
preview impression. An initial inspection utility invocation failed before
measurement; the corrected read-only scan supplied these values, with no file
or product change.

## Required correction closure and visual refinements

| Criterion | Surface/state | WP06 observation/artifact link | Observed result | Status | Causal owner | Correction reference | Retested build/observation | Remaining limitation |
|---|---|---|---|---|---|---|---|---|
| AC1/2: clear complete feedback/save state | J-01, B wrong Check→hint→edited retry | B M1-Q1-RETRY-DRAFT [BJ], frozen J-01 [J] | B failed: current 12m draft still labelled saved despite changed-since-Check feedback. C shows “Your idea is not saved yet”; Undo restores acknowledged baseline. | passed (C); failed (B) | WP02-06A QuestActivity acknowledgement presentation | [owner correction][JC], [independent correction review](../work-package/execution/PUBLISHED-JOURNEY-CORRECTION-VALIDATION.md) | C six D1/T1 Q1/Q2/Q3 DIRTY and six UNDO captures, explicit success/ending/reload [CJ], [JV] | Historical feedback stays labelled historical, not erased. |
| AC1/2: mission/landmark coherence | J-02, B Leave→Hall→Back→Resume | B M1-Q1-RESUME [BJ], frozen J-02 [J] | B failed required coherence: correct task beneath Village Green. C resumes bridge/Rowan, library/Iona, market/Nessa, with matching saved restorations. | passed (C); failed (B) | WP02-06A AdventureView scene selection after acknowledged open | [owner correction][JC] and independent review | C D1/T1 all three originals; optional bridge and fresh bound practice; D2/D3 smoke [JV] | T1 initial Q2 art pending: later loaded captures support art; caption alone not loaded-art evidence. |
| AC1/2: 200% text reflow | J-03, T2 landscape library heading | B M1-ACCESS-LIBRARY-HEADING-200 [BJ]; C-J03-HEADING-VISIBLE [CJ] | B failed: heading 358/513px, document 1148/1024. C same body-descendant doubling, roots16px: font90.112px, heading358/358, document1024/1024; entire heading visible. Independent root32px landscape/portrait also fits. | passed (C); failed (B) | WP02-06A heading CSS | [owner correction][JC] and independent review | C T2 exact mechanism, nearby root enlargement, restore original styles/retain unscored ? draft [JV] | Text-only presentation probes, not browser zoom or physical-tablet proof. |
| AC2/7: actual keyboard reachability | JR-01 entry gap, B programmatic focus | [JR-01 / final native recheck][JV] | B six early focus calls could not prove reachability. C actual Tab/Enter/type traverses Help, profile creation/save/select, invitation and mission entry; then full keyboard adventure. | passed (C); untested reachability segment (B) | WP06-02A evidence producer; no product defect established | Native entry collection [JV] | C D1 native 772 keyboardPress/one keyboardType, zero locator focus/fill/type/press/click/tap in full trace | Application autofocus disclosed. No all-keyboard T1 claim. |
| AC1/2: hierarchy and focal action | Desktop shell height ~413/768; portrait ~538/1024 before content | B M1-ENTRY [BJ]; C D1 resume/ending and C T2 Hall [CJ] | Required readability/reachability passed: labelled navigation/status, ordinary scroll and native Tab reach task/actions. Large initial shell reduces immediately visible play space. No clipped/hidden required control or trap established. | passed (required rubric); optional refinement open | WP01 shell/AppShell composition; WP02-06A content spacing support | NONE — no required correction | C full D1/T1 route; carried B entry-height observation, not a new C pixel-height measurement | Optional compact shell/less whitespace backlog. No maximum-shell-height or above-the-fold gate exists in this child. |
| AC1/2: readable feedback hierarchy | Desktop saved punctuation/merchant feedback lines | C D1 C-Q2-SUCCESS/C-J01-Q3-DIRTY [CJ]; B M1-Q2-SUCCESS [BJ] | Required readable hierarchy passed: complete legible live prose, distinct labelled error/success and historical attribution, actions reachable. Lines exceed art direction's 32–60-character reading-length direction. This deviation is retained, not described as compliance with that number. | passed (required readability); optional refinement open | WP02-06A `.activity-reading`/`.activity-feedback` typography | NONE — no required correction | C actual affected feedback captures; no narrowing/retest performed | Optional constrain prose column to reading direction. AC1's required failure conditions are illegible/clipped text or broken hierarchy/state; neither is established here. No invented character-count release gate. |

These refinements do not downgrade the required J-02 scene mismatch or J-03
clipping; those were real failures and required corrected published retests.
The exact enlarged C heading has ordinary word wrapping, while Selected/chapter
labels can fragment in aggressive text probes. That warrants optional word-boundary
polish, not a claim that every enlarged element is aesthetically ideal. Required
instructions/actions and horizontal reflow are supported within retained coverage.

## Access and technical sound-control results

All rows below describe technical/visual evidence only. “Stopped” means observed
native sources/gates/speech state, **not heard silence**. The unchanged B audio
paths carry to C through [BV]/[CP]; the changed F01 retry UI is directly retested C.

| Criterion | Surface/state | WP06 observation/artifact link | Observed result | Status | Causal owner | Correction reference | Retested build/observation | Remaining limitation |
|---|---|---|---|---|---|---|---|---|
| AC1/5: ≥44px targets / hierarchy | PC/tablet widgets, tiles/counts/creative controls | [J] Text/targets, [BJ] mouse/T2 enlarged surfaces; [CJ] C dirty/selected/save | Retained D1 widget text18px/prompt22.4px; sampled buttons ≥44px. Settled T2 minimum47px high/68.2px wide; full mark tiles and labelled destinations. C affected surfaces remain reachable. | passed | WP02-04A/06A/07A; WP01 shell | J-03 correction for heading only | C refreshed surfaces plus unchanged-widget B/accepted producer checks | Sampled product targets, not universal contrast/target certification. |
| AC1/5/7: non-drag, keyboard, rotation, 200% | Three activities; portrait/landscape drafts | [CJ], [BJ], [JV] | C full native D1 keyboard; T1 trusted drag/cancel then tap alternative; retained B mouse/click/Undo; B T2 all activities rotate with drafts retained. Enlarged bridge/merchant fit; library C corrected. Instructions Escape/return focus supported. | passed | WP02-04A; WP02-06A | J-03 and JR-01 above | C D1/T1 original paths; C T2 exact/nearby variants; applicable B finite variants | Emulation, not physical tablets/Safari. Smoke is finite. |
| AC3/4 technical media / activation | Cold/explicit Enable, denied activation, all seven files | [B] audio table; [BB] audio-results.json/audio-results-5.json and results17/18/33/39/42/43 | No context on unrelated clicks; explicit activation produces genuine playback, denied native resume gives Retry sound/written complete Q1. Native durations identify village69.9965s/library76.8s and five cues0.85/0.8/1.65/2.15/4.5s. | passed (technical) | WP02-05A audio runtime; WP02-03A media | NONE; final control assertions supersede their retained earlier observer failures only | Carried B final native results; C original F01 actual76.8s library playback | Native events/PCM peaks do not prove heard joins, comfort, clipping or suitability. Denial is controlled capability failure. |
| AC4 independent mutes / levels / zero | D1/T1 Sound panel during activities | [BB] audio-controls-final.json/audio-results-5.json; [B] control rows | Music off/effects on and inverse independently gate active paths. Zero stops/suppresses; active gain at middle/max0.5/1. Muted slider edits retain Off; explicit consent/exit preserves other channel's settings. | passed (technical) | WP02-05A; WP04 preferences; WP01 binding | NONE | Carried B final D1/T1 controls; C latest muted37%/19% [CS] | T1 keyboard sliders/mixed controls disclosed; not an all-touch audio battery or acoustic pass. |
| AC4 immediate Silence all / Stop reading | Restoration/cue/theme and active read-aloud; activity panel | [BB] result18/result34/result43, T1-all-cues-and-silence.png; [B] speech rows | Native local speech speaking=true precedes stop; Stop cancels current/queued speech. Silence all stops active sources/master gate and speech without waiting for cue completion; written feedback remains. | passed (technical) | WP02-05A; WP02-06A/07A Read/Stop host | NONE | Carried B original D1/T1 cancellation; C F01 stop/recovery has inactive speech, not a new speaking retest | Audible stop, cue escape and speech masking remain unverified. |
| AC4 persistence / explicit return to sound | Navigation, profile, reload, second page, background/foreground, update | [BB] result34/audio-controls-final.json/native-hidden-result.json/held-results-1.json; [CP] B→C native transition | Silence survives navigation/profile/reload; Pause/Resume cannot clear latch. Native hide stops; show resumes exactly one only when permitted; silence survives next hide/show. Held genuine decoded buffer starts nothing after Silence/Pause; explicit exit/resume starts one. Native update preserves full root and muted31%/73%, disconnected C Resume starts zero sources. | passed (technical) | WP02-05A / WP04 preferences; WP01 lifecycle/shell | NONE for unchanged internals; F01 UI below | Carried B lifecycle, accepted direct B→C publication, C reload0 contexts/resumes/starts | Native visibility is a separate non-calendar probe; no synthesized visibility event, heard silence or full layout cross-product claim. |
| AC4 honest preference failure/retry/readiness | F01 original library abort and newer edits while held | [C boundary native receipt][CR], [abort pixels][CA], [saved pixels][CS], [B]/[BV] | B immediate live stop passed but durable retry failed. C abort retains root3/live silence; explicit Retry reaches real held native transaction, acknowledges only committed4; newer edits keep Saving through4 until latest5 commits. Latest fields and quiet reload preserved. | passed (C technical); failed (B durable recovery) | WP02-05A AudioControls + WP01/App binding to WP04 existing preference retry | [retry owner correction](../work-package/execution/PUBLISHED-AUDIO-RETRY-HANDOFF.md), [independent review](../work-package/execution/PUBLISHED-AUDIO-RETRY-VALIDATION.md) | C four first-attempt D1/T1 original/newer passes; six native Tabs/Enter to retry and native T1 retry tap [BV] | D1 traversal starts from programmatically focused toolbar Silence all; proves disclosed local panel order, not a complete keyboard-only audio battery. |
| AC4 honest text / local-voice fallback | Missing local voice, blocked audio, silent journey | [BB] result45/D1-no-local-voice.png/audio-results.json; [CJ] help/feedback/ending | Explicit unavailable voice/activation guidance; no auto-read; all quests/ending understandable with Silent sound. | passed (technical/visual) | WP02-05A; WP02-06A/07A | NONE | Carried controlled B fallback plus full silent C journeys | No inferred device voice availability, intelligibility, physical testing or listening. |

## Actual listening status and audio-capable handoff

The **human heard the replacement comparison and approved track selection**.
Listener identity is the project requester; the selection statement supplies no
device/player/output-route/volume or complete-theme/join/cue notes. This reviewer
did not hear source or published audio. WP06 provides technical native playback
captures, not loopback/listening capture. Actual published listening response to
the existing Controller request remains pending; no new request is made here.

All following rows use the original **M1-ACOUSTIC** observation/handoff [B] and
[C applicability index][CI], together with accepted [03A source handoff][AH].
Status `blocked` means the required acoustic observation is unverified, not a
demonstrated bad recording. No technical passed row populates a heard-quality pass.

| Criterion | Surface/state | WP06 observation/artifact link | Observed result / what was actually heard | Status | Causal owner | Correction reference | Retested build/observation | Remaining limitation | Source versus published listening | Listener/capture method | Track/cue/join/transition to check |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AC3 music quality | Green/bridge/market village theme | M1-ACOUSTIC [B], [CI], [AH] | Approved replacement pair; no reported full runtime phrase or either join heard. Native69.9965s playback is separate. | blocked | Controller-coordinated capable listener; WP02-03A owns source fixes, 05A runtime fixes | NONE — no acoustic defect established | NONE; C required | Exact joins/comfort/clipping/gaps/clicks absent | Source comparison approved; published unverified | Human selection only; method/device/volume unspecified; no agent hearing | Market on the Sea / Jonathan Shaw: complete phrase, runtime join1 and join2 (at least three successive cycles, about210s) |
| AC3 music quality | Library theme | M1-ACOUSTIC [B], [CI], [AH] | No full runtime phrase or either join report. Native76.8s playback and numeric seam/peak checks are not hearing. | blocked | Same listener; WP02-03A/05A by cause | NONE | NONE; C required | Gap/click, level jump, comfort and perceived relative loudness absent | Source comparison approved; published unverified | Same unspecified human method; no agent audio capture | Sunset Walk / Kilua Boy: complete phrase, runtime join1 and join2 (at least three cycles, about230.4s) |
| AC3 cue quality | Pickup through ordinary selection | M1-ACOUSTIC [B], [BB] results39/42/43, [CI] | No cue heard report; actual native0.85s cue observed. | blocked | Capable listener; WP02-03A effect / 05A mix by cause | NONE | NONE; C required | Clarity, comfort, clipping/harshness alone and mixed absent | Original source cue and published unverified | No identified listening/capture route | pickup, alone and against each intended theme |
| AC3 cue quality | Placement through ordinary place action | M1-ACOUSTIC [B], [BB] results39/42/43, [CI] | No cue heard report; native0.8s cue observed. | blocked | Same listener / 03A/05A | NONE | NONE; C required | Same missing acoustic observations | Source and published unverified | No identified listening/capture route | placement, alone and in mix |
| AC3 cue quality | Supportive feedback/help | M1-ACOUSTIC [B], [BB] results17/39/42, [CI] | No cue heard report; native1.65s cue observed. | blocked | Same listener / 03A/05A | NONE | NONE; C required | Supportive comfort, harshness/startling level/clipping absent | Source and published unverified | No identified listening/capture route | support, alone and in mix |
| AC3 cue quality | Saved success | M1-ACOUSTIC [B], [BB] results17/42/43, [CI] | No cue heard report; native2.15s cue observed. | blocked | Same listener / 03A/05A | NONE | NONE; C required | Comfortable success mix/level/clipping absent | Source and published unverified | No identified listening/capture route | success, alone and in mix |
| AC3 cue quality | Saved restoration | M1-ACOUSTIC [B], [BB] results17/33/43, [CI] | No cue heard report; native4.5s cue observed. | blocked | Same listener / 03A/05A | NONE | NONE; C required | Comfort, clipping, startling jump/harshness absent | Source and published unverified | No identified listening/capture route | restoration, alone and in mix |
| AC3 transitions/duplicate music | Bridge→library→market; pause/resume and read-aloud | M1-ACOUSTIC [B], [BB] result26/control results, [CI] | Technical crossfade/old-source stop/single resume supported; no reported audible transition, duplication or speech intelligibility. | blocked | Capable listener; WP02-05A runtime/ducking; 03A source loudness if causal | NONE | NONE; C required | Gaps/clicks/clipping/stacked music and masking absent | Source mix reel exists; published unverified | Real local voice/output route must be identified | Village↔library theme changes, speech start/Stop and return from ducking; words remain intelligible |
| AC3/4 audible control reliability | Independent mutes/zero; Silence all during restoration+speech, delayed/resumed playback | M1-ACOUSTIC [B], [CI]; technical cancellation/retry [BV] | No heard-silence report. Native sources/gain/speech stop and quiet C reload do not prove silence at the speaker. | blocked | Capable listener; WP02-05A gate/queues, WP04/WP01 binding if causal | NONE | NONE; C required | Audible immediate stop/no late cue; independent channel preservation absent | Published unverified; source players cannot prove runtime controls | Listener/device/browser/output route/music/effect/device levels required | Separate mutes and zero, Stop current/queued reading, Silence all in active restoration/read-aloud and delayed/resumed states; explicit return without unintended channel enable |

Controller can append the already-requested listener evidence through the normal
owner workflow. The capable reviewer should identify C in Help, record date,
browser/device, headphones/speakers/output route and device/music/effects levels,
then attach per-item heard pass/fail observations for the exact rows above.
Use ordinary published actions and the existing WP06 evidence convention; only
the missing listening states are needed, not another full adventure. The
[source audition](../../assets/source/audio/audition.html)/[join-cue reel](../../assets/source/audio/audition.wav)
can supplement source diagnosis, but cannot replace runtime transition, speech
or mute listening. If a real local voice is unavailable, preserve readable
fallback and leave speech masking unverified; do not substitute a fake voice.
Route any actual source flaw to 03A, input flaw to 04A, runtime/ducking/gate flaw
to 05A, view/creative flaw to 06A/07A, shell/cache/persistence flaw to WP01/WP04;
Controller coordinates correction, publication and the affected original-path
WP06 retest. No such acoustic defect is currently established.

## Criterion-closure recommendation and unresolved list

| Child acceptance criterion | Recommendation for WP06-04A |
|---|---|
| 1 — visual finish | passed within accepted D1/T1 full, T2 finite activity/rotation and D2/D3 smoke coverage; six categories recorded per surface above. Required J-01/J-02/J-03 failures corrected and retested C. |
| 2 — integrated visual acceptance | passed: actual published paths, corrected originals/nearby variants, settled Hall, and explicit carried-B applicability supported. Shell/line-length refinements remain optional, with named owners. |
| 3 — music/effect quality | blocked/unverified: provenance and technical media delivery supported; approved pair preserved; both loops/two joins each, five cues, transitions, comfort and masking lack actual published listening. |
| 4 — reliable user control | technical portion passed in disclosed input/layout scope, including C F01 original/newer recovery and quiet native reload. Audible control/silence portion blocked/unverified; no hearing inference. |
| 5 — explicit evidence/status | passed as an honest handoff: every reviewed category/control/acoustic state has evidence and status. Missing acoustics marked blocked; unsupported physical/child modes below are untested. |
| 6 — reuse/corrected-path retests/handoff | passed: retained observations and IDs reused, old B failures preserved, original affected C paths plus nearby variants independently accepted. This file supplies recommendation, not release decision. |
| 7 — real published agent play | published-entry/full D1/T1/finite T2/D2/D3 portion passed; actual URL and C identities retained. Technical playback separated from hearing; acoustic acceptance remains unverified. |

Unresolved required evidence is **M1-ACOUSTIC**, owned by the existing
Controller-coordinated human/capable-listener handoff: complete two runtime themes,
two joins per loop, all five cues, transition/duplicate music/comfort/clipping,
speech masking and heard immediate silence/no escaped queued sound. No required
visual or technical-control deficiency remains established by this review.

Optional backlog remains the recorded shell-height composition, desktop prose
line length and aggressive-enlargement word-boundary polish. These do not block
the scoped visual recommendation. Physical tablets/Safari devices, child testing,
child pace/efficacy/enjoyment and universal accessibility certification are
**untested**, not passed and not invented additional gates. Agent conclusion
intervals (D1 171.200s, T1 284.001s) are not child pace or a20–30-minute gate.

The two C T1 failed observer rows remain failed in adjudication: the intended
3/4/5 draft was actually3/3/5=11m and correctly rejected; the uninterrupted
normal correction/readback then succeeded. No clean-console/zero-error blanket
claim is made. Original B loading/broken-image frames and all failures remain
untouched. Frozen C recommendations rely on loaded later states and accepted
correction/publication/evidence review, not an average beauty score, row count,
functional test alone or retroactive B pass.

This owned file is frozen for Controller review. No production, test, observer
report, shared package, Git, deployment, worker or other-chat write was made.

[J]: ../playtests/M1/JOURNEY.md
[B]: ../playtests/M1/BOUNDARIES.md
[JV]: ../work-package/execution/WP06-02A-VALIDATION.md
[BV]: ../work-package/execution/WP06-03A-VALIDATION.md
[CP]: ../work-package/execution/M1-CORRECTED-PUBLICATION-VALIDATION.md
[JC]: ../work-package/execution/PUBLISHED-JOURNEY-CORRECTION-HANDOFF.md
[IV]: ../work-package/execution/WP02-04A-VALIDATION.md
[AH]: ../work-package/execution/WP02-03A-HANDOFF.md
[CJ]: ../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/journey/visual-index.md
[BJ]: ../../artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/journey/visual-index.md
[BB]: ../../artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/
[CI]: ../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/boundaries/checkpoint-index.json
[CR]: ../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/boundaries/C-final-receipt.json
[CA]: ../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/boundaries/D1-Chrome-original-C-native-abort-screen.png
[CS]: ../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/boundaries/T1-Chromium-touch-newer-C-retry-saved-screen.png
[PL]: ../../artifacts/playtests/M1/4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1/journey/T1/C-Q1-ALTERNATE-VERIFIED/step-08/screen.png
