# Offline shell integration — independent validation

11 October 2026. **PASS at the assigned shell presentation/composition boundary; no actionable P1/P2 findings.** Reviewed the frozen offline additions against the accepted WP01-02A shell/F01 behavior (Controller baseline `da2d39f`), OFFLINE-SHELL-HANDOFF and the WP01-03A status, readiness, next-launch and optional-fullscreen contracts. Native production A/B caching/activation on 5196 remains the offline owner's separate evidence. This report does not grant WP01-03A, D3, publication or release acceptance.

**Port 5195 and source inspection are released.** The reviewer-owned server was stopped after the probes; a fresh TCP connection was refused. No owned server/browser remains. Controller owns administrative acceptance, integration and Git.

## Frozen scope and ownership

Author evidence **A**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d`.

Independent evidence **R**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12025-a68f-75e0-b9c7-574993834af7/Offline-2026-10-11`.

Read the four owned source/spec files, the unchanged main entry/recovery composition, and the supplied PWA/fullscreen contracts as needed to establish real ownership. All four frozen hashes match the handoff before and after review:

| Path | SHA-256 |
| --- | --- |
| `src/app/AppShell.tsx` | `cce623d24154440ee5478270b7f703db2f5bbea0656aef7c6629d9d2a9fd8d78` |
| `src/app/createAppRuntime.ts` | `3774cef7865d1142ab7409428e2c515c4fb773c59c7ae5aef2c164595d9b617d` |
| `src/app/shell.css` | `3a9861ea1f8eb3d0343eb3a1e322237aead7d1ee7efa6a2dc493898dc8a45698` |
| `tests/platform/shell.spec.ts` | `4381e9f40be7e5f87fc77a259359f2ab87cac12fdbcd1d0f056cad64e68c8f8a` |

The measured main entry remains unchanged from the prior shell review; supplied `pwa.ts`, `fullscreen.ts` and `sw.ts` also match the author-recorded frozen identities. `R/hashes-before.json` and `hashes-after.json` retain all eight measurements, unchanged through this review. Only this report and private evidence were written. No production/spec/shared configuration, other report, status, instruction or dependency edits; no Git operation, install, messaging or delegation. The explicit single-reviewer/one-browser assignment was followed.

## Source assessment

The existing sole runtime invokes `registerOfflineApp` outside React and routing, stores its readonly status without synthesizing worker state, and exposes a stable subscription/getSnapshot pair. Runtime disposal first gates callbacks, disposes the platform registration adapter and clears offline subscribers, then follows the accepted lifecycle/audio/facade disposal. It neither unregisters the worker nor deletes caches/saves. StrictMode and route changes do not create registrations.

Ready offline is derived from **activeBuildId = pageBuildId plus activeInventoryComplete**. The waiting build and incomplete preparation are independent presentation facts. Retry calls the platform adapter; no activation, reload, `skipWaiting`, save writer or second offline cache implementation appears in shell code. Written help accurately separates saved stories, offline preparation and manual backups, including first-ever offline failure and possible browser eviction.

Managed update preparation uses the existing captured registration/profile/epoch guard, waits for the producer suspension, samples transient status, calls the actual facade flush, then rechecks the binding, current facade readiness and waiting-build identity. Its close-all-game-tabs instructions additionally require current readiness, unchanged approved profile/epoch/waiting build, no pending shell transition and no active panel registration. The separate readiness subscription observes pending/failed preference changes even when the committed snapshot identity is stable. Independent durable failures cannot be cleared by remount, discard or an old successful flush result.

The accepted F01 behavior remains: successful suspension followed by Save/update returns to a fresh producer overview; existing Resume owns reopening the same durable encounter. Failed suspension retains the editor and its retry/discard path. Fullscreen is invoked only by the player's button, with distinct unavailable/denied/entered copy and browser-exit feedback. Its synthetic assertions compare the actual committed snapshot before/after; they do not prove native fullscreen hardware behavior. No custom installation funnel was added.

## Author evidence independently inspected

Decoded the actual JSON reports and scenario attachments, rather than relying only on the handoff. `A/results-offline-freeze-{d1,d2,t1,t2}.json` contain **16 passes: four each in Chrome 155.0.8059.40, Edge 155.0.4283.45, Chromium 156.0.8078.4 touch and WebKit 27.2 touch**. All are retry 0, no skips, flaky, unexpected or report errors. Results retain the original four case identities with extensions.

The receipts show separate F01 save/adventure/update overview and resumed-Check states, independent command failure remaining a blocker after safe suspension/discard, failed preference status withdrawing close instructions, and epoch/deletion rejection of late suspension. Alder's update/Resume path preserves the same encounter/opportunity/episode and saved three-metre draft before successful 3+3+6 Check; each project ends with one valid Check and 40 lifetime points for that path. UI-only disposal counters record **one registration and zero remaining instrumented worker/container/registration listeners**, with unchanged status after disposal/retry/visibility attempts. The spec also checks that messages are inventory probes only.

Visually inspected `A/offline-d1-supported-layout.png` and `offline-t2-portrait-200-percent.png`. Offline status/copy and retry/update/fullscreen controls reflow with the existing content and readable native controls; the long portrait page scrolls normally. The passing size/overflow assertions and retained keyboard/fullscreen/help checks support this bounded layout assessment. Full-page captures include the existing sticky sound strip; this is not a full accessibility certification.

The author records passing typechecks and whitespace verification after source freeze. No changed-candidate production build or broad state/audio run is represented as performed by this shell author or reviewer. The earlier 218-check baseline evidence is not relabelled as a fresh offline-candidate run. Windows WebKit's audio branch remains the known unavailable/text fallback, not native playback evidence.

## Fresh independent counterexamples

Ran `node node_modules/@playwright/test/cli.js test --config R/review.config.mjs`: **four passed in 6.313 seconds**, one installed-Chrome worker, zero retries/skips/flaky/unexpected/report errors. Actual root `/playtest/`, build `local-wp01-02a`, real runtime/activity/facade/native IDB/audio, private cache/output and port 5195. Synthetic service-worker replies pass through the real registration adapter/MessageChannel. Test wrappers retain and delay the **actual** flush result and record actual command/result envelopes; they do not fabricate readiness or replace the save implementation. Each case disposes the runtime.

| Fresh input/order | Observed result |
| --- | --- |
| Cedar `[4]` → Update for waiting B → real suspension and ready flush held → waiting identity changes to C and active inventory becomes complete → release old flush | Ready offline correctly reflects the matching active build, but stale B approval creates no close instructions. Overview/Resume preserves encounter/opportunity/episode, reopens `[4]`, and additional 4+4 edits produce a successful first Check. One registration, no FinishPractice. |
| Cedar `[3]` → Update → real ready flush held → abort a newer native Silence all preference write without changing committed snapshot → release | Live silence remains on; current readiness overrides the old ready result. Overview reports other changes still need saving, close instructions stay absent and failedPreferences remains true. Explicit preference retry restores readiness but does not invent approval for the previously blocked update request; a fresh explicit update action then shows instructions. |
| Cedar `[2]` → Update → real ready flush held → actual ResetSave → release old result | New epoch/empty household chooser; no stale editor, selection or close instructions; transient flags clear only with the invalidated binding. |
| Same held-flush input → actual DeleteProfile for Cedar while Fern survives → release | Fern remains the only profile, chooser has no selected explorer, no old editor/close instructions, no migrated draft. |

For the changed-waiting case, actual suspended receipt is epoch `f1cc4afa-2f94-41eb-b480-c9ecdd60c7fe`, revision 5, encounter `321418f4-e2b1-41b1-9459-da6fdcb9ccb0`, opportunity `30642d8f-52d6-44e8-abee-e39ac06e55a5`, episode ordinal 1. The preference-race receipt has no transient blocker but `pendingPreferences=true`, `failedPreferences=true`, `ready=false`; this establishes why a saved activity alone cannot authorize closing.

Full inputs, traces, renders and decoded receipts are retained in `R/review.spec.mjs`, `review.config.mjs`, `results.json`, `output/`, per-scenario JSON and `evidence-review.json`. `R/server-release.txt` records the released port. No failing attempt or source correction arose during this review.

## Disposition and limits

**Shell integration PASS; no actionable P1/P2 findings.** These are presentation, ownership, guard and real-save integration proofs. Synthetic worker/fullscreen UI evidence does not establish complete production precaching, disconnected launch, native waiting activation, two-client A/B behavior or physical fullscreen. Those remain with the existing offline/platform verification and Controller; no duplicate A/B run, D3 claim, acoustic claim, extra gate or package acceptance is introduced here.
