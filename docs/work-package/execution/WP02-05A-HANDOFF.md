# WP02-05A — Frozen construction handoff

9 October 2026. **Real-facade binding authored and verified; source stable for
final independent binding review.** Controller reported frozen construction
independently PASS after all three findings closed, accepted WP04-04A at
`97482c4b791a84c55384c623163664c7d1fdddbc`, and released DEP-042. DEP-040/041 were
already released. This author does not make the independent acceptance, acoustic,
published-playback or whole-package completion claim. Controller owns acceptance,
integration, shared status and commits.

## Accepted-facade binding evidence

The existing host now accepts `binding=real` and an explicit unique `namespace`
query parameter. That branch constructs exactly one `createStateController`
with `openSaveRepository`, the actual full `validateSave`, `listTasks`, actual
quest bindings, fixed test clock and transient-readiness port. It uses
`facade.preferences`; the old fake helper/writer is constructed only in the
separate default frozen-fixture mode. No extra preference queue, durable writer
or state controller exists in either host mode.

Audio is created once, first, with its persist port forwarding to this helper.
The facade's synchronous `preferenceGate.applyLiveIntent` forwards to the same
audio instance, and one helper subscription immediately forwards load/requested/
pending/failure/acknowledgement status. One persistent `AudioControls` panel
serves all scene/profile requests. All seven catalogue files are actual local
WAV requests and native Web Audio decodes; no assets were replaced. Runtime
controller/speech/UI/CSS source did not change during binding.

Only `tests/fixtures/audio.tsx`, its erased `audio-api.ts`,
`tests/browser/audio-controls.spec.ts`, and this handoff changed in this stage.
The pure Node API remains separate from executable TSX/DOM/media source. No
state producer, app root, shared configuration, dependency, Git or status change.

| Actual binding check | Expected and observed |
|---|---|
| Fresh read, channels and seven assets | Real first-run defaults are disabled/.25/.50; ordinary game tap creates no context. Explicit enable creates one graph. Both themes and five effects decode from the actual files. Music-off/effects-on and the inverse each work; zero remains silent. PASS. |
| Latch → channel edits → acknowledged save → real page reload → explicit exit | Native root equals facade snapshot. The Edge run saved revision 10 with music muted/.61, effects unmuted/0, sound enabled and silence latched. Reload starts with zero contexts and the same values. Explicit exit produces revision 11, preserves both channels and never starts narration. PASS. |
| Native transaction abort while restoration and simulated reading are active | The fixture aborts the actual named IndexedDB transaction after `put`, without replacing the repository or synthesizing its result. Facade returns `save-failed`; live silence already stops sources/speech. Native data remains at revision 2, unchanged. A later .73 music choice stays live and unsaved; readiness remains false with failedPreferences. PASS. |
| Latest-request retry and reload | Existing helper retry through the shell button commits silence plus latest .73 to revision 3. Native root equals acknowledged snapshot; facade flush is ready, no pending/failed command/preferences. Actual reload restores the latch/.73 and starts no context. PASS. |
| Profiles and visibility forwarding | Two real `CreateProfile` commands persist with instructionReadAloud=false. Selection is host-local, validates an existing committed profile, and clears speech/effects/music through the lifecycle ports. Both installation choices remain unchanged; route/re-render keeps one context. An injected DOM `visibilitychange` exercises the actual forwarding listener: hide clears active restoration/reading, foreground restores only permitted music, never queued cues/narration. This is event-hook evidence, not physical-device background observation. PASS. |
| Invalid stored root | Actual repository/full validator rejects the malformed root as unreadable. Its exact native bytes-as-values remain preserved; loadStatus=read-failed, no context and no narration. No replacement/default root is invented. PASS. |
| Two real tabs, immediate cross-tab silence | Each tab owns its own single runtime/facade. Both preference commits are held before their native transactions. Real repository broadcast stops/latches the receiver while the native stored silence is still false. After releases both flush successfully. A subsequent sender-only explicit exit changes committed silence to false but cannot clear the receiver's live latch or restart speech. PASS. |

Final verification (same bundled Node as below, no broad suite):

- `./tests/fixtures/audio-run.ps1 -Project audio-chromium -Filter 'real facade'`
  — initial **4 passed**, root
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-90511d3d3e2e44378eb7e51b35fa1f85`.
- Added cross-tab case: same runner with `-Project audio-chromium -Filter 'real facade broadcasts'`
  — **1 passed**, root
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-6052c56b988a41b0a1630b45b237303e`.
- `./tests/fixtures/audio-run.ps1 -Project audio-edge -Filter 'real facade'`
  — final **5 passed**, including active restoration in the abort case, root
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-aa852a08aab04ba090055bd9e2d88066`.
  Recorded Edge version: `154.0.4258.62`. This is Edge evidence, not D1 Chrome
  or an approval to replace the primary target browser.
- Final affected Chromium check plus one fake-mode compatibility smoke:
  `./tests/fixtures/audio-run.ps1 -Project audio-chromium -Filter 'real facade transaction|unsent silence remains'`
  — **2 passed**, root
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-63ecd7d13b8c4be095cb4c60428afa12`.
- The exact strict Node-only spec check from the correction section passes;
  a separate DOM/JSX typecheck over `src/vite-env.d.ts`, `audio.tsx` and
  `audio-api.ts` passes, with no shared compiler expansion or generated caches.
  Prior 37 unit/fake-race passes and visual evidence are reused; unaffected
  runtime tests were not repeated merely for a larger count.

Every result root has `results.json`; named JSON attachments contain the native
root, facade snapshot/token, live status, readiness, source/context counts and
ordered gate/repository-result events. The cross-tab attachment records the
before-either-save state separately. Per-test cleanup disposes subscriptions,
audio/speech, the facade/repository and host, restores the native fault hook,
and deletes only that test's uniquely named database after sibling tabs close.
Runs used only port 5184, private output/cache and one worker; server teardown
completed. Neither 5182 nor 5186 was used.

Speech lifecycle checks deliberately use the labelled simulated local voice;
the music/effects graph and files are real. Earlier actual local-voice selection
and fallback evidence remains separate. D1 Chrome/D3 Firefox limitations and
Windows WebKit's missing AudioContext remain unchanged; no installation,
security change, engine substitution, physical listening or publication claim.

**Ready for the original audio validator's final binding review.** No owner gap
was found and no compensation in state producers was required. Final shell
overlay placement, actual device backgrounding/touch, update/service-worker
lifecycle, published playback and WP02-12A/WP06 acoustic gates remain downstream.

## Frozen-construction independent-review corrections (historical checkpoint)

The three findings in [WP02-05A-VALIDATION](WP02-05A-VALIDATION.md) were reproduced
before changing production. The focused regression run failed six assertions:
all four original replacement-speech cases and both recovery branches of the
failed-silence-handoff case. The additional disposal speech variant already
passed. The exact strict Node-only compiler invocation also failed with the
reported TSX/global diagnostics. These original failures remain recorded here;
the preceding construction evidence did not cover these boundaries.

| Finding | Causal correction and full-path result |
|---|---|
| P1 replacement speech | `cancel()` captures and returns its own token before publishing `speaking=false`. `speak()` carries that identity through the entire replacement and rejects a newer cancellation before allocating an utterance. Actual controller → adapter → fake synthesis originals now return false, keep utterance count at one and remain not speaking after nested Silence/Stop/hide/route. A disposal variant and fresh newer-explicit-reading variant pass; the newer reading wins over the superseded outer replacement. Existing late `publish(true)`/end/error guards remain. |
| P2 failed handoff status | `applyPreferenceState` no longer unconditionally clears `persistenceError`. It clears only when the existing live-field bridge is fully represented in producer state, including an explicit supersession. Throw-before-helper Silence → unrelated music .6 → actual accepted helper enqueue/flush leaves live silence true, fake durable silence false, helper clean and audio uncertainty true. Repeating Silence through the normal intent port saves the latch; explicit Exit separately supersedes it and preserves other settings. Both recovery branches pass. No queue, scheduling, retry writer or optimistic saved claim was added. |
| P2 Node-only type boundary | New pure `tests/fixtures/audio-api.ts` imports only erased state DTOs. The browser host structurally satisfies it; the spec no longer imports executable TSX/media code. Evaluated browser globals have narrow module-local erased declarations. The exact strict ES2023/Node-only check passes without JSX/DOM/shared-config expansion. |

Correction delta: `src/audio/speech.ts`, `src/audio/controller.ts`,
`tests/audio/controller.test.ts`, `tests/audio/speech.test.ts`,
`tests/browser/audio-controls.spec.ts`, `tests/fixtures/audio.tsx`,
new `tests/fixtures/audio-api.ts`, and this handoff. UI production code and CSS
were unchanged in this correction pass; rendered regression checks exercised
the existing uncertainty message and saved-success condition.

Final correction checks:

- Full focused audio suite with the original no-cache/single-worker command:
  **37 passed** (30 controller, 7 speech).
- Exact reviewer command:
  `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2023 --types node tests/browser/audio-controls.spec.ts`
  — **passed**.
- Separate browser-host/unit boundary:
  `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM --jsx react-jsx --types node src/vite-env.d.ts tests/fixtures/audio.tsx tests/fixtures/audio-api.ts tests/audio/controller.test.ts tests/audio/speech.test.ts`
  — **passed**. This also verifies the executable host satisfies the pure API.
- `./tests/fixtures/audio-run.ps1 -Project audio-chromium` — **10 passed**,
  including all four initial-cancellation UI paths, false-saved-warning and
  explicit recovery, plus the five prior control/media/layout scenarios.
  Private result root:
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-aad4afcbca5046f6b1e500c9eb96375f`.
  Port 5184 only, one worker, server teardown completed. Existing Edge/WebKit
  evidence is reused as prior evidence, not relabelled as a fresh correction run.

At that correction checkpoint independent revalidation/acceptance and DEP-042
were still pending. Controller subsequently reported all three findings closed
and released DEP-042 as recorded above. The correction pass itself made no
facade, listening, published, browser-installation, shared-source/config or
other-chat claim.

## Authored paths

- `src/audio/controller.ts`
- `src/audio/speech.ts`
- `src/audio/AudioControls.tsx`
- `src/audio/controls.css`
- `tests/audio/controller.test.ts`
- `tests/audio/speech.test.ts`
- `tests/browser/audio-controls.spec.ts`
- `tests/fixtures/audio.html`
- `tests/fixtures/audio.tsx`
- `tests/fixtures/audio-api.ts`
- `tests/fixtures/audio.config.ts`
- `tests/fixtures/audio.vite.config.ts`
- `tests/fixtures/audio-teardown.ts`
- `tests/fixtures/audio-run.ps1`
- This handoff.

No app root, state/preferences producer, catalogue/asset, shared config,
dependency, Git, status or delegation changes. No worker creation or other-chat
messages. Ordinary writers were used. Standard build protocol applied once;
the assigned single-author playback/gate/control work remained serial.

Read the assigned child, GLOBAL_RULES current authority, focused DEC-026 and
related child contracts, actual audio contracts/catalogue, WP04-05A handoff and
accepted validation, WP01 early host/asset resolver, and WP03 narration policy.
Narrow reads of actual preference/command DTOs and facade constructor established
adapter shapes. Facade source was read only, not bound or accepted by this worker.

## Runtime and binding

`createAudioController({ assetResolver, persistPreferences, speechAdapter? })`
exports every specified command, `getSnapshot`, `subscribe`, `applyLiveIntent`
and `applyPreferenceState`. Optional `createContext` and `fetchAsset` are media
test boundaries; defaults use native Web Audio and fetch. No new dependencies.

WP01 creates one controller outside routes, resolving each catalogue path with
`assetUrl`. Bind `persistPreferences` to the accepted facade's
`preferences.setAudioPreferences`. Bind its injected
`preferenceGate.applyLiveIntent` to audio's `applyLiveIntent`. Subscribe to the
preference helper and immediately forward `getStatus()` via
`applyPreferenceState`, then forward every subsequent status. The initial audio
load gate is loading and cannot play. The constructor closure permits binding
the facade after audio creation; do not issue controls until both ports exist.

The live request applies before invoking persistence, including when that port
throws. The helper's synchronous gate echo is idempotent and never persists.
A transient per-leaf bridge protects the interval before the helper publishes
the matching requested state. It holds no command, durable write, retry or save
queue. WP04 alone owns preference generations, acknowledgement and saving.
Older status generations/saved generations cannot overwrite newer status;
the live silence latch only releases through explicit exit. Failed writes
leave the live selection and expose uncertain persistence.

The snapshot contains live `preferences`, exact `loadStatus`, `activation`,
the full WP04 `persistence` status, `speaking`, `localVoiceAvailable`,
`voiceName`, `visible`, `mediaError`, and a thrown-port `persistenceError`.
`AudioControls({controller})` uses this snapshot and invents no saved success.
The sole preference helper's `retry()` remains the retry port; the minimal
fixture demonstrates a separate shell-owned Retry saving sound choices button.
WP01's save-error UI must expose that existing retry port. No second queue or
new save API was introduced in audio.

One lazy context has music/effects/master gains. Sources loop at the actual
catalogue frame bounds; at most two music voices overlap for a 250ms crossfade,
and at most four pending/sounding effect slots replace the oldest transient.
Music buffers are lazy for current/incoming tracks; effect buffers are reused.
First visit, loading and failed reads stay silent. Ordinary cues, sliders and
channel toggles do not resume/create a context. Explicit enable/exit/retry are
the activation paths. Returning saved consent still requires this visit's
explicit browser activation. Zero stops its channel; sliders preserve mute.

Silence zeros all buses, cancels gain schedules, stops current/scheduled sources,
invalidates resume/decode generations and cancels speech before persistence.
Late callbacks cannot restore output. Hidden pages stop music/effects/speech;
foreground may restore currently permitted music, never cues or narration.
`setSceneTheme` clears effects and speech even when the theme string is unchanged.
For route/profile changes, WP01 must call `stopReading()` and
`setSceneTheme(nextThemeOrNull)`; visibility uses `setVisible(!document.hidden)`.
Unmount disposes audio (which disposes its speech adapter), subscriptions and
host. Re-rendering/mounting controls never creates a player.

## Speech and controls

`createSpeechAdapter()` enumerates actual English `localService === true` voices
only, owns one utterance, cancels before replacement, and ignores stale captured
end/error handlers. `voiceschanged`, unsupported synthesis, missing voices and
speech failure produce honest text fallback. Speech is cancelled independently
of Web Audio gains. It ducks permitted music to 30% of the selected level and
restores only the current policy without saving a different volume.

`readText({ requestId, text, role, language: 'en' })` accepts `instruction`,
`assessed-text` or `answer-help`. The caller must supply authorized visible text
and commit required assistance before this call. This port does not classify
content, commit help, enable profile narration or initiate automatic narration.
LocalService is feature detection, not a platform-wide networking guarantee.

The storybook panel uses the established paper/teal/amber palette, independent
labelled switches and 0–100 sliders, explicit enable/exit/retry sound, visible
Silence all outside its disclosure, and `StopReading` while speaking. Targets
are at least 44px, control/body text is 18px, focus is visible, and controls
reflow at 320/768/1024px. Screenshot inspection corrected a hover contrast issue.
Mount the persistent toolbar where activity overlays cannot obscure or make it
inert; the final shell's modal/top-layer and focus policy is WP01's integration
responsibility. The fixture's activity overlay is an inline nonmodal panel.

## Verification and evidence

All commands use bundled Node 24 at
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
Only focused tests ran; no package-wide suite/build or listening claim.

1. `node node_modules/vitest/vitest.mjs run tests/audio/controller.test.ts tests/audio/speech.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`
   — **29 passed**, final run after all runtime changes.
2. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM --jsx react-jsx --types node src/vite-env.d.ts tests/browser/audio-controls.spec.ts tests/fixtures/audio.config.ts tests/fixtures/audio.vite.config.ts tests/fixtures/audio-teardown.ts tests/audio/controller.test.ts tests/audio/speech.test.ts`
   — **passed**, includes owned production components and fixture imports,
   writes no compiler cache. An initial direct-source check omitted Vite's CSS
   declaration and was corrected by including `src/vite-env.d.ts`.
3. `./tests/fixtures/audio-run.ps1 -Project audio-chromium`
   — **5 passed** in private root
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-95681bcbe9a54ee2b52b30a1a328cb5c`.
4. `./tests/fixtures/audio-run.ps1 -Project audio-edge`
   — **5 passed**, final runtime, private root
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-7b0e3f1befe740fc9fdc56324d22f6e2`.
5. `./tests/fixtures/audio-run.ps1 -Project audio-webkit -Filter 'failed preference|records native|controls reflow'`
   — **3 passed**, final runtime/CSS, private root
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-9bfe1e4e30634e47959df3bfabbfdeab`.

Each root contains `results.json`; layout runs retain PNGs in their named
Playwright output directory. Actual-voice/capability JSON is attached to the
results. Final Edge selected **Microsoft George - English (United Kingdom)**
with localService/English feature detection; no utterance was acoustically
assessed. WebKit reported no local English voice and used visible fallback.

The first browser attempt exposed two fixture-only defects: the writer read
`payload` instead of `payload.patch`, and a locator included an aria-hidden
music glyph. Both were corrected before the same sequences passed. No production
repair was used to disguise those fixture failures.

The initial full three-project run produced **10 passed / 2 failed** in
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-528cccc70b9042adb119337632e15a33`.
Both remaining failures are WebKit native playback checks. A narrow capability
probe recorded `typeof AudioContext === 'undefined'` and
`ReferenceError: Can't find variable: AudioContext`; the runtime correctly shows
unavailable. Its separate evidence root is
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-e6d95d9d8cc7443d9f6aac37ceef9531`.
The playback assertions remain intact, not skipped or satisfied by fake media.
No engine substitution, install or security change was attempted. D1 branded
Chrome and D3 Firefox retain their previously recorded Windows activation
blockers and were not rerun. Chromium evidence is labelled Chromium, not D1.

All browser work used only port **5184**, one worker and private caches/output;
the audio-specific teardown closes that server. No 5182/facade fixture was used.
The fixture uses actual seven-file catalogue exports and native decode/playback
in Chromium/Edge, but a clearly labelled preference test writer. Speech-control
race scenarios use a clearly labelled fake local voice; device-voice detection
and fallback use the actual browser adapter. Native playback events and WAV
headers establish technical binding, not what was heard.

### Ordered race evidence

| Input / chronological checkpoints | Expected and observed |
|---|---|
| Loaded disabled → explicit enable → pending resume → Silence all → old resume resolves | Consent changes synchronously; Silence increments activation generation and zeros buses/stops speech. Old generation cannot become ready or start a source. Explicit exit then starts only current permitted music. PASS. |
| Enabled → pending theme/effect fetch/decode → mute, zero, silence, hide, route or dispose → decode completes | Music/effect cancellation generations or removed voice slots reject each late callback. No source starts. Six variants PASS. |
| Village fetch pending → library fetch pending → library decoded first → village decoded last | Only the current music generation starts; source loopEnd matches library export. Old village cannot become current. PASS. |
| Two themes crossing → rapid scene changes → Silence → old fade timer | Active theme sources never exceed two. Scheduled gains are cancelled and all track sources stop. Fade cleanup cannot restore gains. PASS. |
| Speaking → Stop/replacement → captured old end/error callback | Utterance token rejects old callback. Current mute/latch persists; music restores only current permitted level. Speech replacement remains one utterance. PASS. |
| Playing → live Silence → throwing or delayed failing persistence | Before persistence is invoked, master is zero, sources are stopped and speech is cancelled. Failure leaves live latch/levels and honest uncertainty. Helper/UI retry saves latest requested fields. PASS with accepted helper/fake writer. |
| Pending resume → hide → foreground → old resume resolves | Visibility invalidated the resume generation; no source/speech starts. A fresh explicit retry succeeds. PASS. |
| Twenty allowed effect requests → decode → fifth active request | Only latest four pending slots start; oldest active transient is replaced. Hide/scene/profile clears all. PASS. |

## Remaining acceptance gates

- **Final independent binding review required:** DEP-042 is now accepted and
  released; the real-facade/native-IDB checks above establish the author evidence
  beyond the earlier fake writer. Controller/validator own final acceptance.
- Actual persisted reload, component profile/route forwarding, cross-tab
  silence, native write failure/retry, failed-read preservation and sole-runtime
  behavior are now evidenced in the minimal host. Final-shell overlay placement
  and full-app lifecycle still require WP01 integration. No completed shell was
  treated as a prerequisite for this bounded binding check.
- WebKit native playback remains environment-blocked; D1/D3 blockers remain.
  Physical tablets, real touch ergonomics, platform speech local-data behaviour,
  published reload/update/cache behavior and detailed listening belong to later
  accepted runs. Screenshots/automation do not substitute for those observations.
- Existing licensed Market on the Sea / Sunset Walk files and all five effects
  are used exactly as handed off. Nothing was composed, replaced or relabelled.
  Source listening/published acoustic gates remain WP02-12A/WP06; there is no
  claim that this author heard the music, effects, crossfade or speech.
