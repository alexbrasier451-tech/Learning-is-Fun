# WP01-02A — Accessible shell and single-runtime composition handoff

9 October 2026. **F01 author correction and changed-candidate local checks complete; source frozen for fresh independent recheck. D3 runner is prepared but actual shell D3 remains pending Controller review/execution.** This handoff is not acceptance, acoustic assessment, physical-tablet verification, publication or an M1 release claim. M2, offline caching/update activation and publication remain downstream.

## F01 correction and current verification

The independent review [WP01-02A-VALIDATION](WP01-02A-VALIDATION.md) identified a shell-owned P2 defect missed by the initial sixteen passing cases. Its original Hazel keyboard 3 → Save progress → attempted 3+6 → Check, and same-view Adventure variant, acknowledged suspension correctly but left the suspended editor mounted. The first incorrect checkpoint was the shell's successful continuation, not producer editing/scoring. The producer correctly refuses edits and Check while suspended. Original red evidence remains under review root `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12025-a68f-75e0-b9c7-574993834af7`: `independent-original-results.json`, repeated `independent-save-results.json`, `independent-adventure-results.json`, receipts/screens and traces. This author waited for explicit reviewer release before changing source or using 5195.

Narrow correction: `AppShell` now owns a tab-transient adventure visit key. An acknowledged allowed shell request to world/activity genuinely remounts the producer overview, even when AppView and selected profile are unchanged. After Save progress suspends an active panel, the shell awaits flush/readiness, revalidates registration/profile/epoch, stops reading and genuinely returns to that same profile's overview. The old suspended editor is unmounted; the existing producer-owned Resume button reopens its durable draft. No draft copy, new facade, shell-owned OpenEncounter/FinishPractice/Check, producer guard weakening or change to encounter/opportunity/episode/reward rules was introduced. Failed suspension retains the panel/draft and original retry/discard path. An independent facade failure still blocks readiness and gets distinct wording after the activity saves; it is not dismissed by remount or a misleading whole-save success message.

Only `src/app/AppShell.tsx`, the existing `tests/platform/shell.spec.ts`, this handoff and private evidence changed for F01. The permanent case count remains **four** and no producer/root config/CI/independent-report/Git write was made. Case 1 retains the original River 6+6 Check and extends it with exact Hazel keyboard 3 → Save → overview → Resume → additional 3+6 → Check, plus fresh Willow same-view Adventure → overview → Resume → additional 3+6 → Check. Both prove the suspended editor is absent, canonical encounter/opportunity/episode identity remains, no prior Check was invented, the saved 3-metre draft reopens, and the first real Check succeeds. Case 2 adds native failed Save progress → retained Meadow draft → exact producer retry → saved overview while an independent failed RenameProfile remains a facade blocker → Resume and successful 3+3+6 Check. Existing failed-switch/conflict/discard, late epoch/deletion, audio and disposal cases remain green.

Changed-candidate results (same evidence root E defined below):

| Check | Current result |
|---|---|
| Original complete repaired root case and same-view variant, D1 | PASS; E/results-F01-original.json, then final case 1 in E/results-F01-variants.json. |
| All four cases, D1 Chrome 155.0.8059.40 | **4 passed**; E/results-F01-variants.json. |
| All four cases, D2 Edge 154.0.4258.62 | **4 passed**; E/results-F01-edge.json; normal account authorization reused. |
| All four cases, T1 Chromium 156.0.8078.4 and T2 WebKit 27.2 | **8 passed**; E/results-F01-tablets.json. T2 retains the known unavailable native-audio boundary. |
| Typecheck | PASS after final AppShell/spec edits. |
| Private actual production build | PASS; E/build, 589.41 kB entry; same nonfatal size warning. |
| Relevant complete state/audio regressions | **218 passed, six files**, same focused command below. |

Current total is **16 passing browser runs**, zero retries/skips/failures, with no D3 claim. Named F01 JSON attachments retain overview/suspended and resumed-Check snapshots, IDs, attempts, preference state and readiness; native failed-save and independent-blocker snapshots are separate. Original pre-F01 reports/attempts remain retained and are historical evidence, not closure for this corrected candidate. E/source-hashes-pre-F01.json preserves the prior measured source set; E/source-hashes.json and the current table below pin the corrected set. Final local Git base is `5e2427a2a01ab7856bbf8821b2e4800ea1ec8493`; accepted producer source measurements are unchanged. Source and 5195 are released for the same independent reviewer after author verification.

## Authority and owned files

Implemented the assigned child under GLOBAL_RULES current execution authority, its complete WP01-02A contract, WP01-01A identity/navigation/lifecycle contracts and accepted producer handoffs. Used the ordinary writer and the standard build protocol once. Runtime/leave/readiness ownership is coupled; this assignment expressly prohibited further delegation. No other chat was created or messaged. Controller owns shared status, integration and Git; this author did not stage or commit.

Changed only `src/main.tsx`, `src/app/App.tsx`; added `src/app/AppShell.tsx`, `StateControllerProvider.tsx`, `createAppRuntime.ts`, `shell.css`, `src/platform/lifecycle.ts`, `tests/platform/shell.spec.ts`, and this handoff. Transferred `src/app/navigation.ts` remains unchanged and remains the sole AppView/NavigationPort definition. No producer source, configuration, dependency, lock, art/audio asset, global theme, service worker or publication workflow was authored here. Concurrent Controller/foundation/world corrections and unrelated `.wp04-04a-independent/` and `debug.log` were preserved.

Base at initial local verification: `df331762ad23195c152e4c4491febb3882999e31`, Controller's accepted producer StrictMode correction. Original dispatch base was `5f6d877425f9827facd2e9cb20482d9667c934de`; corrected-candidate base is recorded above. Consumed the actual accepted Adventure, adult/profile, Hall, companion, facade and audio producers; no local substitutes or inferred first profile.

## Composition and boundaries

`main.tsx` creates the application runtime once outside React/routing, retains StrictMode, and disposes the root/runtime on Vite hot teardown. `createAppRuntime` constructs one actual repository, one facade using the accepted M1 catalogue/bindings/calendar clock, and one audio controller using `assetUrl`. The facade retains evaluation, selection, reward, canonical-role, command-envelope and durable mutation authority. No GameRuntime, copied save/draft DTO, scoring rule or optimistic durable state was added.

Audio is constructed silent first; its persistence intent forwards to the facade preference owner. The facade's synchronous live gate calls the same audio instance, and one preference subscription forwards load/requested/pending/failure/acknowledgement status immediately. Both directions are attached before eligibility for playback. Idempotent disposal removes preference/lifecycle subscriptions, detaches persistence, disposes the registry/audio and closes the facade repository. Explicit browser permission is still required each visit. Sliders preserve mutes/latches. Pause, visibility, pagehide and pageshow forward only the live visibility gate, preserving saved settings and avoiding transient replay. AudioControls and StopReading are the accepted producer controls. A compact sticky sound strip remains available during interaction and failed/pending leave; its expanded panel enters normal flow to avoid a tall fixed overlay. Help also has immediate silence using the same controller.

The provider uses the actual facade; `useGameSnapshot` uses its stable `getSnapshot`, `subscribe` and returned unsubscribe with `useSyncExternalStore`. Multiple mounted consumers have their necessary subscriptions; there is one application facade/audio instance, rather than a claim that all producer/React observers collapse to one total listener. Accepted corrected producer evidence verifies activity subscription counts across StrictMode and genuine remount.

The shell owns tab-transient selectedProfileId and view only. Null, absent/deleted selection or changed save epoch renders the chooser; another profile is never selected implicitly. A request captures the registration token/object, selected owner, target and epoch. One pending guard blocks additional requests. Its old panel stays mounted while the producer suspends. Late completion checks the original registration/epoch/profile, including owner deletion. Failed leave retains the view, draft and selection, focuses a readable notice, and offers exact retry, Stay and explicit safe discard. A discard never clears independent facade command/preference failures. Navigation stops reading only after permission to leave and never creates FinishPractice/Check commands.

`createActivePanelRegistry` supplies the accepted ActivePanelHost. It samples current panel flags on every readiness call, includes guard pending/unresolved failure, and subscribes to initial/live status. Token-bound stale notifications/unregister closures cannot clear a replacement. Unexpected dirty/pending/failed replacement fails closed. Dirty cleanup preserves an orphan blocker; it cannot authorize navigation. Epoch/deleted binding teardown invalidates only that old transient binding. Save progress takes the same suspension guard, then awaits facade flush/readiness; it neither activates nor reloads a worker. WP01-03A must connect its update preparation to this guarded path before any later activation UI.

Hall refresh/projecting uses the accepted facade refresh, committed snapshot and WP05 read model/calendar functions; history has explicit semantic focus return. ProfileChooser, AdultArea (including its proportionate grown-up barrier, backup and confirmations) and AdventureView remain the actual producers. Help explains keyboard/tap routes, quiet play and save limitations. Music credits consume the accepted register's creator/source/licence/change metadata, preserving Jonathan Shaw/InspectorJ CC BY 3.0 and Kilua Boy/KiluaBoy CC0 attribution without relicensing.

## Runner contract and private evidence

Evidence root **E**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d`.

Private `E/shell-server.mjs` launches the root app at `http://127.0.0.1:5195/playtest/` with APP_BASE `/playtest/`, APP_BUILD_ID `local-wp01-02a`, private cache and no producer fixture entry. `E/shell.config.mjs` uses one browser worker, zero retries and private reports/output. Run the bundled Node executable with `node_modules/@playwright/test/cli.js test --config E/shell.config.mjs`; select the desired project, and set SHELL_RUN to an evidence suffix. Edge requires the already authorized normal Windows account route. No browser installation/security change or engine substitution occurred.

Final intended selection is exactly **four** cases in `tests/platform/shell.spec.ts`. Foundation owns Linux D3 config/workflow and may select this file against the same root/base. No runtime transformation is required. The development-only `__shellRuntime` reference in main points to the actual root instance and is erased from the production bundle. This minimal inspection seam was necessary because dynamically importing an unstamped main entry beside Vite's stamped entry executed a second root/runtime; the final tests instead inspect the sole root instance. Test-local browser hooks hold commands/native decode, abort native writes, and use the accepted lifecycle port to exercise stale registrations. They contain no answers, completion, scoring or replacement empty-store endpoint. Browser context closure removes native hooks; the runner owns server teardown.

## Initial checks before F01 review

| Check | Result / evidence |
|---|---|
| Root application/Node/worker typecheck | `node node_modules/typescript/bin/tsc -b --pretty false`, PASS after final source/spec edits. |
| Private production build, actual `/Learning-is-Fun/` base | `node E/shell-build.mjs`, PASS. Output only in E/build; no shared dist/config mutation. Vite reports a nonfatal 589.08 kB entry-chunk warning. No fixture entry or `__shellRuntime` string is in the bundle. |
| Focused complete state/audio regression | `node node_modules/vitest/vitest.mjs run tests/audio tests/state --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`: **218 passed, 6 files**. Reuses producer media/generation/speech/state evidence, without another player. |
| D1 Chrome 155.0.8059.40, 1366×768 | **4 passed**, E/results-final.json. Actual keyboard piece placement/Check and shell navigation. |
| D2 Edge 154.0.4258.62, 1920×1080 | **4 passed**, E/results-final-edge.json; authorized normal account. |
| T1 Chromium 156.0.8078.4 touch, 1024×768 | **4 passed**, E/results-final.json. Native tap selection/placement. |
| T2 WebKit 27.2 touch, 768×1024 | **4 passed**, E/results-final.json; rotates to landscape. Existing Windows build lacks AudioContext, so native playback/decode is not claimed there. Truthful unavailable fallback/silent controls pass. |
| Exact owned whitespace/hash scan | PASS; E/source-hashes.json holds bytes/lowercase SHA-256, E/producer-hashes.json pins actual consumed sources. |

Initial browser total **16 passed**, no retry/skip/failure; the changed-candidate results above supersede this set. D3 is not included in either count. Reports retain browser versions, snapshots, preference status/revisions, readiness and named captures; `E/captures` contains extracted original PNGs. Desktop and 200% portrait captures were visually inspected. E/results-final-local.json is an earlier full 12-case pass before final native keyboard/tap and credits assertions; initial final evidence above supersedes it.

## Criteria and scenarios

| Criteria | Actual shell evidence |
|---|---|
| 1–3 | Case 1 composes accepted panels at every local matrix viewport; visible keyboard focus, native Help and adult dialog Escape/focus return, Hall/history return, 200% root text, ≥44px visible button bounds, portrait reflow/landscape rotation and no horizontal overflow. Case 2 rotates a real dirty bridge answer and proves its text and committed attempt snapshot unchanged. Producer widget/scene evidence supplies other drag/tap paths. Body/instructions start at 18px; reduced-motion media rule removes shell movement, and accepted producer reductions remain active. Targeted checks are not WCAG certification. |
| 4–6 | Case 3: no native context after unrelated initial game actions; preferences loaded before explicit enable; native decode held → immediate Silence all → native save abort → truthful failed persistence → exact preference-owner retry. Late decode starts zero sources. Independent mute/effects zero and persisted latch survive reload. Pause/pagehide/pageshow preserve choices; repeated route mounts keep one graph; disposed playback/refresh emit zero callbacks. Failed cold read exposes silent recovery, never Enable sound or an invented replacement save. Written text remains usable. Windows WebKit availability limitation is explicit above. |
| 5, 7–8 | Case 2: actual two profiles; held original-profile Check keeps River mounted/selected and blocks switching until settlement. Meadow receives no reward/state transfer. Failed native suspension preserves River's draft and selection; exact retry retains the complete envelope. A newer Silence all revision produces a truthful conflict; further explicit retry lets the producer refresh the original binding and save. Safe discard switches while an independent native RenameProfile failure remains a facade failedCommand blocker. No navigation FinishPractice. |
| 8–9 | Case 4: current/live dirty projection, stale token cleanup/notification, orphan cleanup blocker, and blocked Hall navigation. Held leave → actual ResetSave epoch replacement → chooser; late completion ignored. A fresh real two-profile case deletes the selected owner during held leave, retains the other profile but chooses nobody, and ignores late completion. Transient flags clear only for invalidated binding/safe leave; facade failures remain independent. |

## Causal failures and original reruns

1. **Producer StrictMode failure:** Original D1 root app River → bridge → place 6+6 → Check showed no success. Companion case observed dirty false after a plank. First wrong checkpoint was the activity session connection: constructor subscription during discarded memoized render, followed by effect cleanup permanently disposing the retained session and setup re-registering it. Reported to Controller/producer without editing producer source. World owner repaired reversible effect connection under `df33176`. Original root integrated Check now succeeds and dirty/failed-suspension flow passes; full final 16-case rerun is green. E/results-d1-trace.json retains the original failures; E/results-d1-producer-correction.json proves the repaired Check/dirty checkpoints before later shell findings. Controller/world correction report remains the authoritative owner evidence.
2. **Shell focus return:** The repaired original flow reached Help, then closing/remounting Adventure let destination effects take focus after the close call. Shell now schedules opener focus after destination effects; Hall history resolves the recreated semantic opener by profile ID. Original complete case, both dialog returns and final matrix pass. E/results-d1-producer-correction.json → E/results-d1-layout.json → final reports retain the sequence.
3. **Test expectation/locator defects:** Initial chooser labels came from a different producer fixture; corrected to actual ProfileChooser controls. Root diagnostic import duplicated the Vite entry; replaced by the erased actual-instance reference. A broad Sound locator also matched Pause sound; it now targets the accepted toolbar. Shell/world Hall controls require navigation-scoped selection. After Silence all changes the revision, the first unchanged suspension retry correctly conflicts; the test now verifies that exact retry and an additional explicit producer refresh/retry, rather than expecting stale-envelope success. These fixes did not change production domain behavior.
4. **Known T2 host capability:** The inherited Windows WebKit build has no AudioContext. The case checks the real unavailable fallback there; it does not mock native playback or repeat prior environment diagnosis. Native pending-decode evidence comes from D1/D2/T1, with actual Linux D3 still pending.

## Source seal for review

These are ordinary deterministic source measurements, not a Toolkit transaction or acceptance seal. Navigation is measured but unchanged.

| Path | Bytes | SHA-256 |
|---|---:|---|
| src/main.tsx | 771 | 3a15f0125b7f9372c26cd2a5bf15085b81f173cdd986d081844362728360276e |
| src/app/App.tsx | 1634 | e7c6075753ff0b026c3c346f53d9a9da82c4e03c8506400cca0289d4669ed34d |
| src/app/navigation.ts | 444 | 0bf551bc2edf6d6ade2c6da4a1fda07b1d320dacf7d0bb10f9b65ae6a93cee89 |
| src/app/AppShell.tsx | 16094 | 38f17645c88ca2713846723136e6eb14b88c33f6802db787014e1d3530e3042e |
| src/app/StateControllerProvider.tsx | 847 | c5a57bd32caf5a3fbd8b1ba45a25cbfe4938d5d6b4235486dc687c130cd3c7a4 |
| src/app/createAppRuntime.ts | 4259 | ecff18bd6a243897ac5a38ddd4a193c5c61a17b50bed1da1e929acd3f7fdca41 |
| src/app/shell.css | 4172 | a54a35080de15ffddd5f11aa259a920a3f51d379177af53c938b9e310ed695dc |
| src/platform/lifecycle.ts | 848 | c1e2313c14e1cd8255a63243c6ea9323a161138b8df18fc49a6dd652bd268a4c |
| tests/platform/shell.spec.ts | 28359 | aaa29b81fbd0e943936972b82798ce6c57859f213f0a7f9d83fd5146493b2843 |

## Remaining boundary

Source is frozen for independent review and foundation D3 execution. Controller owns acceptance, commits and package progression. D3, acoustic/physical/published evidence, offline inventory/update activation and release remain unclaimed. Foundation's newly appearing shell runner/teardown and shared CI changes are its work, not this author's deliverables. The private local server can be stopped/restarted with E/shell-server.mjs; its 5195 lease is released at handoff.
