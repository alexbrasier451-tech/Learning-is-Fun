# WP02-05A — Independent frozen-construction validation

9 October 2026. Report-only review for Controller and the original author.

**Current verdict: PASS for the WP02-05A bounded-host component implementation and real-facade handoff. All three original findings remain closed; DEP-042 binding is independently validated below. No component-mode blocker remains.** Controller retains administrative acceptance. This does not close the defined target-browser matrix, full-shell, published, platform-local speech or acoustic acceptance obligations.

The initial changes-required findings and their counterexamples below are retained as historical evidence. The appended correction revalidation supersedes their original open status and request to return them for repair.

The final real-binding review further supersedes the earlier pending-DEP-042 statements. Read the historical sections as checkpoint evidence, not current blockers.

Latest browser evidence: the two defined original D3 audio smoke cases now pass on actual provisioned Ubuntu Firefox 157 in run `37889547310`; see the final addendum. Earlier D3-unavailable statements remain historical Windows/environment limitations, not the current remote smoke result.

## Scope and authority

Read the complete [child](../chunks/WP02-05A.md), [handoff](WP02-05A-HANDOFF.md), current GLOBAL_RULES authority, the controller/speech/controls/CSS, both audio unit suites, browser spec and fixture, accepted audio/preference DTOs, the actual preference producer and its accepted [validation](WP04-05A-VALIDATION.md). Read the Node compiler configuration and pure state fixture API to localize the compiler concern forwarded by Controller. The report distinguishes accepted producer behavior from hypothetical or unaccepted facade composition.

Only this report and private temporary probes were written. No production/test fixes, shared configuration/status/dependency changes, Git operations, delegation, other-chat messages, server use, installs or security changes. The bounded review and localized counterexamples used ordinary readers/writers; no repair or substantial implementation stage was entered.

## Finding 1 — P1: a stop during the initial speech-cancellation publication is lost

**Owner:** [speech.ts](../../../src/audio/speech.ts), original `speak` lines 53–60 and 67–70; caller gate in [controller.ts](../../../src/audio/controller.ts), original `readText` line 253. **Closed by correction revalidation below.**

`speak` calls `cancel()` before capturing its new utterance token. That cancellation synchronously publishes `speaking=false`; the controller forwards the notification to its subscribers. If a subscriber calls Silence all, Stop reading, hide, or a route/profile teardown during this publication, its cancellation advances the token. The original `speak` then allocates a newer token and starts its replacement utterance. The guard after `publish(true)` cannot detect the earlier cancellation because its baseline was captured afterward. The controller checked its live policy only before entering the adapter.

Independent reproduction used the actual controller and speech adapter with a fake local English synthesis endpoint and Web Audio context:

1. Load defaults, explicitly enable, and start an authorized instruction reading.
2. Subscribe a one-shot controller listener which calls `silenceAll()` when it sees `speaking=false`.
3. Request a replacement instruction reading. Its initial cancellation triggers the listener.
4. Observe the full path through the live gate, nested speech cancellation, resumed replacement operation and synthesis `speak` call.

| Ordered checkpoint | Expected | Observed |
|---|---|---|
| Replacement calls initial cancel | Old utterance canceled | Old utterance canceled; false status published |
| Listener calls Silence all | Latch true, buses zero, replacement invalidated | Latch true and master zero; nested cancel completes |
| Original replacement continues | Return false; no new synthesis call | Returns true; utterance count becomes 2; `speaking=true` while `silenceAll=true` |
| Fresh hide variant | No speech after hide | Returns true; `visible=false`, `speaking=true`, utterance count 2 |
| Fresh route and Stop reading variants | No replacement survives their cancellation | Both return true and start utterance 2 |

These are synchronous subscription counterexamples, not simulated interleaving of two browser click handlers. The exposed subscription API permits them, and the existing speech test already explicitly protects reentrant Stop during the later `publish(true)` phase. This earlier publication has the same contract but lacks protection. Master gain cannot mute this escaped speech.

**Invalidates:** acceptance 3–5, immediate Silence all/Stop reading, lifecycle cancellation, and utterance-generation protection. Original author should preserve cancellation identity across the entire replacement operation, including the first observable cancellation publication. A narrow token/order correction and regressions for the original input and hide/route/Stop variants are sufficient; no new queue or defensive framework is requested. Revalidate through the controller into synthesis, not solely the speech snapshot.

## Finding 2 — P2: an unrelated status clears a failed handoff warning without saving silence

**Owner:** [controller.ts](../../../src/audio/controller.ts), original `request` lines 197–203 and `applyPreferenceState` lines 211–221; visible consequence in [AudioControls.tsx](../../../src/audio/AudioControls.tsx), lines 65–67. **Closed by correction revalidation below.**

The controller intentionally preserves live values if `persistPreferences` throws, using `liveFields` and `persistenceError`. However, every subsequently accepted producer status unconditionally resets `persistenceError=false`, even if the producer still has not received the failed field. `liveFields` continues overlaying that unsent value, so the displayed live preference can differ from the producer's clean saved state while the panel says “Sound choices saved on this device.”

Independent reproduction bound the actual accepted `createPreferenceController` to audio, with its normal synchronous gate/status subscription and one fake preference writer. The port wrapper throws once before forwarding Silence all to the helper; a subsequent ordinary music-volume edit is forwarded and successfully committed through the helper's complete enqueue/flush path.

| Ordered checkpoint | Expected | Observed |
|---|---|---|
| Silence all handoff throws | Live silence true; uncertain persistence | Correct: live silence true and `persistenceError=true` |
| Set music volume to .6 | New field may save; unsent silence remains uncertain | Matching volume status clears `persistenceError` while silence bridge remains |
| Helper writer commits and flush completes | No saved-success claim for unsent silence | Generation/savedGeneration 1/1, pending=false, failed=false, persistenceError=false |
| Compare final values | Any unsaved live silence remains visibly uncertain | Audio `silenceAll=true`; helper/durable fake-writer `silenceAll=false`; UI condition selects saved-success text |

Live playback remains silent in this case. The defect is truthful persistence/recovery: reload would not recover the unsent latch, and the clean helper has no silence command to retry. This is specifically the advertised throwing-port boundary, not evidence that ordinary accepted-helper save failures lose their latest requested value.

**Invalidates:** acceptance 9 and honest save-preference-error reporting. Clear failed-handoff uncertainty only with evidence that the affected live request is represented by producer state, or an explicit subsequent request supersedes it. Keep any retry through the existing preference intent/helper owner; do not add a second durable queue in audio. Verify both the original throw → unrelated successful save counterexample and explicit recovery.

## Finding 3 — P2: owned browser spec fails the repository's Node-only compiler boundary

**Owner:** [audio-controls.spec.ts](../../../tests/browser/audio-controls.spec.ts), original line 2 import and browser-global uses, particularly lines 80–81 and 93–96. **Closed by correction revalidation below.**

`tsconfig.node.json` includes `tests/**/*.spec.ts`, sets `lib: ["ES2023"]` and `types: ["node"]`, and does not enable JSX. This spec imports its API type from the executable `audio.tsx` host, and declares an interface `Window` without declaring the browser-global values used in evaluated functions. The author's DOM/JSX-enabled focused check does not verify this boundary.

Independent exact check, bundled Node 24.19.0:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2023 --types node tests/browser/audio-controls.spec.ts
```

**FAIL, exit 1:** TS6142 at 2:38 (`../fixtures/audio` resolves to TSX but JSX is unset); TS2304 for `window`, `AudioContext`, `innerWidth` and `getComputedStyle`; TS2584 for `document`; and downstream TS7006 callback parameters. All reported diagnostics from this focused command are in the owned spec. Root composite file-list errors or other chunks' compiler problems are not attributed to this author.

Follow the existing erased structural boundary pattern in [state-integration-api.ts](../../../tests/fixtures/state-integration-api.ts): share a pure fixture contract and narrowly type the evaluated browser surface without importing executable TSX/media implementations into the Node spec. Do not broaden shared compiler settings to make this pass. Rerun this exact strict Node-only check after correction, plus proportionate affected browser verification.

## Bridge and implementation assessment

The per-leaf map is a synchronous live-state bridge, not a second persistence queue. It contains no command scheduling, retries or durable writes. Its rationale is reasonable: the helper invokes the live gate before publishing its new requested state, and a throwing handoff must not restore audible values. The exact accepted helper owns dirty leaves, generation advancement, acknowledgement, conflicts and retries. Audio correctly avoids echoing persistence from either consuming port. Finding 2 concerns the bridge's error lifecycle, not a requirement to replace it with a larger framework.

The audio generation guards, one lazy context/master/music/effects graph, independent mute/zero policy, first-visit gate, explicit exit, four pending/sounding effect slots, theme-source bound, cancellation of gain schedules and stale media callbacks are coherent in inspected source and existing evidence. Added independent fresh case: an effect decode remains pending across hide/foreground; a new same-cue request reuses that decode, and exactly one source starts for the new slot. The old slot cannot resume. This passed against actual controller code.

Local voice selection checks actual `localService === true` and English language, avoids remote fallback, and cancels synthesis independently of graph gain. Ducking changes only the live music bus. Existing token guards correctly reject captured old end/error callbacks and a Stop during `publish(true)`; finding 1 identifies the uncovered earlier phase.

## Reused evidence and rendered inspection

- Reused author-run **29 unit passes** and its DOM/JSX focused check as described in the handoff; did not rerun the broad/focused suite merely to duplicate it. The new cases above were absent from those tests.
- Inspected stored Playwright `results.json`: Chromium root `learning-is-fun-audio-95681bcbe9a54ee2b52b30a1a328cb5c` has 5 expected/0 unexpected; Edge root `learning-is-fun-audio-7b0e3f1befe740fc9fdc56324d22f6e2` has 5/0; selected WebKit root `learning-is-fun-audio-9bfe1e4e30634e47959df3bfabbfdeab` has 3/0. All are below the Windows temporary directory. These remain author-run browser results, not a fresh reviewer playback run.
- Independently viewed the retained Edge `audio-320.png` and `audio-1024.png`. Panel content is readable, controls and notices wrap without clipping, and independent channel controls remain identifiable. The narrow panel is tall and scrolls; the screenshots do not establish final-shell persistent stop placement. Existing automated target and keyboard checks remain reusable. No new browser server was necessary; port 5184 was unused.
- Private reviewer evidence: `C:/Users/alexb/AppData/Local/Temp/wp02-05a-review-2e9757adc7e449efb3a32902fb46572a/` contains `probe.mjs`, `results.json`, and reviewed-source `hashes.json`. Six cases executed with actual source via Node native TypeScript transformation: five recorded counterexample cases (four speech variants plus failed-handoff status) and the passing fresh effect-slot case. Assertions intentionally confirm the observed counterexamples; exit 0 does not mark those requirements passing.
- Probe command: bundled `node --experimental-transform-types <private-root>/probe.mjs`, exit 0. Initial strip-only loading failed before tests because an imported existing backup class uses a TypeScript parameter property; rerunning with supported transformation resolved that tooling limitation. No source change or installation was used.
- Reviewed controller SHA-256: `a3c9bd0841c56d76a7b0af4cc090a88738f308c5814f003655cfdc9f707e7c81`; speech: `444a7b77437928a2a70415892806177117e428b92062e3713a99fc8200b0b751`; browser spec: `869dd4190edd9bd0125a2cec3bb6c6d8e9a24222fc13f3250328aaa87dbee520`. Accepted preference producer remains `02a4fc067973be1d0d022e3705843992cb444d3fc055b7b845631ff20a6a9b45`.

## Remaining gates

Controller should return the three exact findings to the original author, then obtain narrow independent revalidation of the corrected cases. No source repair was made by this reviewer.

Even after these findings close, **DEP-042 acceptance/release and real-facade bounded-host binding remain required before child completion**: real load/dispatch/save outcomes, latest-request retry, persistence across reload, lifecycle/profile/route forwarding, cross-tab silence and the sole runtime/panel. Fake-writer success cannot close that gate. Full-shell overlays, update/published behavior and later WP01/WP06 checks remain separately owned.

The seven human-approved licensed source files were neither reselected nor composed. Chromium and Edge evidence is technical playback evidence only. Windows WebKit lacks AudioContext in the recorded environment and is capability-blocked for playback; its fallback checks do not replace native playback acceptance. D1 branded Chrome and D3 Firefox launch blockers remain unresolved. No physical tablet, listening, acoustic quality, published, platform speech-network guarantee, or M2 completion claim is made.

## Correction revalidation — all three findings closed

9 October 2026, following Controller's correction recheck assignment. Read the handoff's correction section, corrected production paths, added regression cases, pure fixture API and affected host/spec wiring. This continues the same report-only review; no production repair or broader package audit was performed.

### Exact correction scope

Verified the production delta in memory against the original reviewed hashes. Reversing only the cancellation-token correction in `speech.ts` and the conditional uncertainty clearing in `controller.ts` reproduces each original SHA-256 exactly. Removing only the added seven controller cases and one speech case likewise reproduces the two original unit-test hashes. `AudioControls.tsx` and `controls.css` remain byte-identical. This supports reuse of the unaffected graph, channel, layout and original media evidence.

The speech fix makes `cancel()` return the token it allocated before publication. `speak()` retains that token, rejects any intervening cancellation immediately after the initial publication, and uses the same identity for later publication/end/error checks. The persistence fix retains `persistenceError` while any live-field bridge value is absent from producer state. These are narrow corrections at the producing stages; neither adds a queue, writer or scheduling framework.

### Independent full-path results

Executed nine independent cases against corrected actual source using the original private harness and native TypeScript transformation. Unlike the historical probe, these assertions require the intended behavior. **All nine passed, exit 0.**

| Case and ordered checkpoints | Independent observed result |
|---|---|
| Original replacement reading → initial `speaking=false` publication → subscriber Silence all → outer continuation → captured old end callback | Replacement returns false; synthesis utterance count stays 1; speaking=false; latch=true and master=0. After explicit exit, no automatic reading occurs; a fresh explicit reading succeeds. |
| Same original path with Stop reading | Replacement returns false; count 1, speaking=false. Music remains permitted. A later explicit reading succeeds. |
| Same original path with hide | Replacement returns false; count 1, speaking=false; visible=false and master=0. Foreground does not narrate; a fresh explicit reading succeeds. |
| Same original path with route teardown | Replacement returns false; count 1, speaking=false. A fresh explicit request can subsequently read. |
| Disposal variant at the same publication | Replacement returns false; count 1, speaking=false, master=0. No post-disposal speech is attempted. |
| Exact original failed handoff: first-run defaults → Silence port throws → unrelated music .6 completes through accepted helper enqueue/flush | Live silence=true, fake durable silence=false, helper generation/savedGeneration=1/1 and clean, but audio persistenceError=true. A helper-only retry keeps uncertainty. Repeating Silence through the normal intent port commits silence=true, clears uncertainty, preserves music .6/effects .5 and leaves speaking=false; 2 total writes. |
| Same failure after explicit Enable, then repeat Silence | Before recovery, live/durable silence remain true/false with uncertainty=true and helper generation/savedGeneration=2/2. Helper-only retry cannot falsely clear it. Repeating Silence commits true/true, clears uncertainty and preserves channel settings; 3 total writes including Enable. |
| Same enabled failure, then explicit Exit Silence all | Uncertainty remains until explicit exit supersedes the unsent latch. Live/durable silence become false/false; uncertainty clears; music .6/effects .5 and speaking=false are preserved. There are 2 total writes because the superseding exit already matches committed silence=false. |
| Fresh full-controller case: newer authorized reading requested during outer replacement's initial cancellation | Only the original and newer authorized text reach synthesis. The superseded outer replacement returns false; the newer reading remains active. |

The original failed-handoff input is covered without adding consent; the separate enabled variants prove both valid recovery choices. Recovery stays within the existing intent/helper ports. Speech tests traverse controller → actual speech adapter → fake synthesis and invoke the captured stale completion, rather than checking only an isolated token or snapshot.

### Node boundary and reused browser evidence

Reran the **exact original strict Node-only command** shown under finding 3, with ES2023 and Node types, no DOM or JSX: **PASS, exit 0, no diagnostics**. The browser spec now imports `audio-api.ts`, an erased structural contract using state DTOs only. Narrow module-local declarations cover evaluated browser globals. The host uses `satisfies AudioFixtureApi`; no shared compiler expansion is present in this correction.

Inspected the author's corrected Chromium `results.json` at `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-aad4afcbca5046f6b1e500c9eb96375f/`: **10 expected, 0 unexpected, 0 skipped, 0 flaky**. The five added scenarios cover all four initial-cancellation UI paths and the visible uncertain → explicit recovery → saved transition; the prior five media/control/layout cases also pass. Read their assertions to confirm the warning remains visible while fake durable silence is false and that saved-success text is absent until recovery. This is retained author-run rendered evidence, not a new reviewer browser run.

Reuse the handoff's **37 unit passes** and separate host/unit DOM/JSX typecheck as author-run regression evidence. No duplicate full suite, browser server or new screenshot run was needed. The reviewer independently executed the nine traces, strict Node-only compile and exact-delta checks only.

Private evidence remains in `C:/Users/alexb/AppData/Local/Temp/wp02-05a-review-2e9757adc7e449efb3a32902fb46572a/`: `revalidation.mjs`, `revalidation-results.json`, `delta-check.mjs` and `revalidation-hashes.json`. Original failing observations are retained unchanged in the original probe/results.

Corrected hashes:

- Controller: `f28b0eb87ae862221bb1404a528d1b2c4868f054822f97d9be69b99ba376bdb1`.
- Speech: `1c3a7e89e2975f6f1b20c7c3bbfc3befd8660da4bb7e33df449ec575a49c8e78`.
- Controller tests: `a6da86d3c7762fc9231d18b3958e7725e57a069d508d05751428059f46a9a04e`.
- Speech tests: `14cc0df3237dc04e7e223391599af1ecb7f2ffc992463353bc7c752874b46ab5`.

**Disposition:** original P1 speech cancellation, P2 failed-handoff warning and P2 Node boundary findings are closed. Frozen construction is technically ready for the next authorized binding step. Controller retains administrative acceptance and DEP-042 release; accepted real-facade integration is still outstanding. All earlier acoustic, published, browser-capability, physical-device and final-shell limits remain unchanged. No child-completion or listening claim follows from this technical pass.

## Real-facade component handoff — independent PASS

9 October 2026, after Controller released DEP-042 and requested this bounded binding review. The accepted facade reference is `97482c4b791a84c55384c623163664c7d1fdddbc`. Its current controller hash matches the accepted WP04-04A validation: `14aab57d98a9a9f96e2c5172c3e7dac37eacd60590b11bc7a3d514ae54a20657`. The accepted preference helper hash is unchanged. Audio controller, speech, controls and CSS all match this review's already-passing hashes exactly. No original fake-race suite or unaffected visual suite was repeated.

### Binding inspection

Read the updated handoff, complete actual fixture/API and five real-mode browser scenarios, plus the accepted facade's preference construction, load forwarding and broadcast receiving paths. `binding=real` creates one actual `openSaveRepository` with full save validation/catalogue, then one actual state facade with actual quest bindings, M1 and the declared clock/readiness inputs. It consumes `facade.preferences`; nullish selection does not construct the fake helper in real mode. The fake writer is isolated to the other fixture mode.

The sole audio instance is created before facade binding and remains loading/silent. Its intent port calls the facade helper, the facade gate synchronously calls that same audio instance, and the single helper subscription immediately forwards its current status and every subsequent publication. Controls mount once through `mountPanel`. Route/profile changes invoke the specified speech/scene lifecycle ports; profile selection is honestly host-local while the profiles themselves are real committed records. Visibility tests inject the DOM event into the actual listener, without claiming OS backgrounding. Teardown disposes audio/speech, facade/repository, subscriptions and panel.

The native failure hook calls the original IndexedDB `put` and aborts only the transaction for the unique test database. It does not manufacture `save-failed` or replace the repository transition. The hold hook delays only the real repository call. Cross-tab propagation uses the real repository/facade notification path. Actual WAV fetch/decode/source creation remains native; only speech in these lifecycle scenarios is explicitly simulated. The pure fixture API keeps the strict Node spec separate from executable TSX/DOM/media code.

### Author evidence independently inspected

Read the real-mode test assertions and stored results, including decoding the final Edge JSON attachments rather than relying only on a pass count. Reused results below are author-run, not a fresh reviewer matrix run:

| Evidence | Observed and accepted component result |
|---|---|
| Chromium initial four real scenarios, root `learning-is-fun-audio-90511d3d3e2e44378eb7e51b35fa1f85`; cross-tab addition, root `learning-is-fun-audio-6052c56b988a41b0a1630b45b237303e` | Four plus one real-mode passes. Chromium is labelled Chromium, not D1 branded Chrome. |
| Edge final five scenarios, root `learning-is-fun-audio-aa852a08aab04ba090055bd9e2d88066` | 5 expected, 0 unexpected/skipped/flaky, Edge 154.0.4258.62. Native data and acknowledged facade snapshots agree. |
| Seven-file playback and latched reload | Both themes/five effects decode; independent channel checks pass. Revision 10 stores enabled/latched, music muted/.61 and effects unmuted/0. Reload starts with no context. Explicit exit advances to revision 11 without changing channels or starting speech. |
| Abort → latest edit → retry | Ordered events show live silence before native abort, then repository `save-failed`. Revision 2 remains durable, active sources/speech stop, latest .73 remains live, and readiness exposes failed/pending preferences. Existing helper retry commits latch/.73 at revision 3 and returns clean readiness; actual reload preserves them without creating a context. |
| Profiles and visibility | Two real profiles start instructionReadAloud=false. Injected hide stops active effects/reading; foreground restores only permitted music. Profile switch clears transient output and preserves installation settings with one context. |
| Invalid stored root | Full validator rejects the native malformed record. Exact stored value remains unchanged; load status is read-failed with zero contexts and no narrated output. |
| Cross-tab ordering | Receiver is latched with speech stopped and no active sources while both commits are held and native silence is still false. After both saves, sender-only explicit exit changes committed silence to false but receiver stays live-latched, with no speech restart. |
| Final affected Chromium run, root `learning-is-fun-audio-63ecd7d13b8c4be095cb4c60428afa12` | Native-abort case with an active restoration cue plus fake-mode failed-handoff compatibility smoke pass. |

These roots are below `C:/Users/alexb/AppData/Local/Temp/`. The earlier corrected 37 unit cases, independent nine correction traces, local-voice/fallback and rendered layout evidence remain valid for unchanged runtime/UI source.

### Fresh independent real-browser boundary

Ran one new serial Chromium 156.0.8078.4 probe through the actual real-mode host, native IndexedDB and media. This covers returning **enabled but unlatched** preferences, complementing the author's latched reload case:

1. Fresh native load → music muted/.42 and effects unmuted/.27 → explicit Enable → actual flush. Native root contains soundEnabled=true, silenceAll=false and those exact channels.
2. Actual page reload → real facade `ready` → audio preferences equal native data, activation=inactive, zero contexts and no sources. Stored consent alone does not activate this visit.
3. Ordinary gameplay cue, Read aloud, music slider to .43, and effects off/on → actual preference flush. Still zero contexts, zero utterances and no sources; music remains muted.
4. Explicit Retry sound → exactly one context → restoration effect. The effect starts from native media, no music loop or narration starts, native audio equals live choices, and facade readiness is fully clean. No page errors occurred.

**PASS, exit 0.** Private evidence: `C:/Users/alexb/AppData/Local/Temp/wp02-05a-binding-review-f51fe1a9266a45d8887b31736a49b017/`, containing `fresh-return.mjs`, `fresh-return-results.json` and `server.log`. One private Vite cache/output root and one browser context were used on released port 5184. Cleanup disposed the fixture, deleted only its unique test database, closed the browser/server, and left no 5184 listener. Hall/adult ports were not used.

Reran the exact strict Node-only spec compile from finding 3 against the expanded real-mode spec: **PASS, exit 0, no diagnostics**. Reused the author's separate host DOM/JSX typecheck. No permanent tests or production files were edited by this reviewer.

Reviewed binding hashes: fixture `b15f1190bd5aa3d33848d8f12b2c1b743358771e5e985152e1135dfd2eaf409a`; pure API `3c89bf42fbbd69bdccae1eec03b49782c1d89bbe313915de218c61cfb9f38b3d`; browser spec `0bd2dd675c1f8f17a5d4ab76178cb2cbe1f9a9401721695c581b2ea69560e737`.

### Exact completion boundary and wording clarification

**The WP02-05A bounded-host implementation meets its component handoff.** Actual audio exports, accepted preferences/facade, real load/dispatch/save/retry, reload, profile/route/visibility ports and cross-tab silence are now evidenced. The earlier DEP-042 binding gap is closed, with no new actionable component defect or owner gap found. Controller can administratively accept this implementation boundary without treating a completed WP01 shell as an upstream prerequisite. This follows the child's Dependencies and Proportionate verification sections; it is not a waiver of later acceptance.

Carry forward only the already-defined obligations:

- WP01/full-app integration owns permanent toolbar/overlay reachability, complete navigation/profile/update/service-worker lifecycle and final shell composition. This fixture's inline overlay does not prove top-layer/modal integration.
- WP02-12A/WP06 own published candidate journeys, defined emulated browser/input/viewport coverage and actual listening records; platform-local speech behavior also remains unverified beyond voice feature detection. Native playback events cannot supply heard-quality evidence.
- D1 branded Chrome and D3 Firefox remain unavailable in the recorded environment. The human decision on using Edge as primary is still pending; this review neither supplies that approval nor silently substitutes Edge/Chromium for a required target. Windows WebKit native playback remains capability-blocked by missing AudioContext; fallback evidence stays separate. Thus this component PASS is not a completed matrix claim.

**Nonblocking handoff wording clarification:** the handoff's Remaining acceptance gates paragraph groups “Physical tablets, real touch ergonomics” with later accepted runs. Read those as unsupported claims or separately authorized future activities, not mandatory completion requirements. WP06 explicitly excludes silently making physical-tablet/child sessions mandatory for this agent-playtest boundary. Prefer moving that phrase out of the gate list in the author's next handoff edit. This report adds no physical-device, child-testing or child-enjoyment obligation and makes none of those claims.

All three earlier findings remain closed. No further private probes, production checks or repairs are pending from this reviewer. No listening, published, full-matrix, M2 or whole-package completion claim is made.

## Actual D3 Firefox audio smoke — PASS

9 October 2026. Independently inspected run `37889547310`, attempt 1, candidate `18f08b01e7ffc839b0fb14d686ff8341d3fd362e`, retained at `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37889547310/`. The complete native/checkpoint/causal assessment is appended to [FIREFOX-AUDIO-DIAGNOSTICS-VALIDATION](FIREFOX-AUDIO-DIAGNOSTICS-VALIDATION.md#original-remote-inputs-now-green--independently-inspected-results).

**Both original audio cases pass on actual Firefox 157.0/Linux**, using the unchanged previously reviewed spec: first visit/keyboard/independent Silence all controls, and actual facade/profiles/visibility forwarding. Each has one passed attempt, retry=0 and errors=[]; totals are 2 expected, 0 unexpected, 0 skipped and 0 flaky. The original five-second ready assertions now succeed. Full suite result files and the actual-pass gate also record adult 3/Hall 3/audio 2/creative 2, ten total with no skips/flaky results; only audio is substantively reviewed here.

The real-facade trace shows a trusted active Enable click, one 44.1kHz native context with maxChannels=2, native resume fulfillment to running, then public ready status. Native effects and music sources subsequently start, injected hide/foreground and profile-change assertions complete, and final preference/save readiness is clean. The first-visit trace confirms ready activation and eventual single music source after explicit latch exit, preserving music 26% and effects zero. The trace-embedded spec hash exactly matches the previously reviewed diagnostic spec (`51b93b9951a130a954c0228d680951da8ce5d4d9cc7e80aadfd3db8b062b80d0`); production controller/speech hashes remain unchanged.

Native readiness proves the runner had a private, authenticated PulseAudio 16.1 server and clocked stereo virtual output before the cases. Earlier instrumented failures had native resume pending, suspended/time-zero context and maxChannels=0; the preceding passive host record lacks the standard audio processes/sockets/devices it inspected. This supports the **CI native-output environment** as the causal boundary: supplying a usable native path makes the unchanged originals pass. It does not establish a production-code defect, isolate each backend subcomponent's necessity, or imply heard output from the virtual sink.

Explicit fixture teardown/cleanup evaluations return successfully; targeted native server exit and Firefox process exit both report zero. A pagehide teardown script-timeout warning and Juggler close-time errors remain in the native log and are explicitly retained in the companion review. They do not erase the original-case passes; no blanket warning-free-cleanup claim is made. Final screenshots are post-unmount blanks; pre-teardown trace frames, inspected independently, show the active panel and preserved profile-switch controls.

**Current disposition:** WP02-05A component handoff remains PASS, all three original component findings remain closed, and the selected actual D3 audio smoke gap is now closed on this provisioned Linux workflow. This is not a claim that all audio tests or every target were run on Firefox. D1, broader defined matrix/full-shell/update/published obligations, actual platform speech/local-data behavior and listening remain separately scoped. No acoustic, physical-device, child-testing, M2 or whole-package claim follows. No runtime changes or additional execution were needed for this evidence review.
