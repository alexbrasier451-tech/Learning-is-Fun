# WP02-11A — lasting creativity and closed-week Festival candidate

Candidate ready for independent review; no acceptance, integration or publication claim. Sole author, private candidate based on main commit `6035f1fbf9f9eb6d0b2af12ac73be616fcc58f8c`. Main and shared status documents were not changed. The authorized continuation permits M2 construction; final acoustic acceptance remains deferred and unverified here.

Candidate directory: `C:\Users\alexb\AppData\Local\Temp\learning-is-fun-wp02-11a-b3324a46c62b4bdd90e449bc8874488d`.

## Delivery and boundaries

The external `owned-files.json` in that directory freezes exactly fourteen delivery paths, operations, exact main and archive preimages, and final byte lengths/lowercase SHA-256 hashes. It is not a source delivery file. The archive, dependency junction, private verification files, generated reports and inherited files are excluded. The archive is the original base export; existing dependency binaries were reused without installation. Original preimages remain frozen from the initial delivery; the membership correction records its current unchanged-main preimage separately.

- `src/experience/CompanionView.tsx`, `CreativePlot.tsx`, `creative.css`
- New `src/experience/FestivalView.tsx`, `festival.css`
- `tests/browser/creative.spec.ts`
- `tests/fixtures/creative-api.ts`, `creative.tsx`, `creative.config.ts`, `creative-run.ps1`
- New `tests/fixtures/creative-festival-fixtures.ts`, `tests/experience/festival.test.tsx`
- `tsconfig.app.json`: exact imported fixture membership entry only
- This handoff

No catalogue, state facade, reward/calendar, Hall, world composer, app root, shared experience stylesheet, asset register or dependency changes. No upstream semantic defect was found requiring an owner escalation.

## Components and adapter contract

`CreativePlot` preserves all existing props and `M1CreativeChoices`; optional `world?: WorldProgress` supplies committed shelf/invention facts. It imports the accepted `STORY_DISPLAYS` requirements directly: Q2 spellbook, Q6 story map, Q7 forest tale and Q4 workshop invention. Empty states remain honest. These displays never enter an appearance Save.

Supplying M2 cosmetic/decoration choices enables six sockets and six reusable types (planter, tree, bench, lantern, banner, pond). Existing M1 hosts may supply all socket records while filtering choices to M1; they still receive the original three-socket/single-planter behavior. The host must filter prerequisites from committed world state. Patterns and trim use supplied entitlements: leaf 20, rim 60, home 150, star/wave 300. Threshold text is explanatory; the component neither computes rewards nor deducts points. Initial colours remain free.

Preview, replacement, removal, move/swap and Undo remain local. Save submits one complete creative choice through the existing atomic host adapter. Moving between identical decorations is a no-op and does not create Undo history. Rejected saves retain the unsaved preview. Preserve the existing `${profileId}:${snapshot.token.epoch}` mount key, captured profile/epoch Save envelope and late-result safeguards. Do not let an old profile acknowledgement replace another profile's preview or trigger its celebration.

`CompanionView` preserves its original props, adding optional `appearance?: CreativeState` and `persistenceAcknowledgement?: string`. It renders ready scarf overlays and supplied personal acknowledgement. Supply acknowledgement only after an actual supported committed success; it grants no points, eligibility or ranked award. Read/Stop still use the existing explicit speech and actual audio status; there is no automatic speech.

`FestivalView` has exactly `result: ClosedWeekResult | null`, `selectedProfileId: string | null`, `onSkip()` and `onOpenHall()`. It renders supplied closed week/timezone, nickname snapshots, entry order, ranks, points, medals and omission flags. Ties preserve ranks/medals; partial omission never promotes a survivor. Null, empty, fully omitted and absent-personal-entry cases are explicit. Skip is immediate; Escape invokes the same callback. The heading receives focus on opening/result/profile change. The parent restores focus on closing.

Festival owns no writer, clock, date arithmetic, ranking computation, audio cue or persisted seen-week state. On the next ordinary visit, the world adapter performs its existing facade refresh/reconciliation and then offers the latest available closed result. Skip/close is transient to that visit; Hall/green replay is voluntary. No Sunday attendance requirement, current-week finalization, new award categories or new points arise from viewing. Any future cue must use the existing audio controller and current silence gate. Q10's committed story finale remains separate and must not cause calendar closure.

WP02-10A owns authored building/castle restoration and the optional non-scored interaction in each delivered location. Consume the unchanged `DISCOVERIES` IDs/labels for village green, bridge, library, market, workshop, forest and castle; no discovery journal, inventory or collection economy is added here. This handoff does not claim the composed world/finale is delivered.

## Actual host and verification

The extended early host uses the real state controller, native IndexedDB, full validator, actual quest bindings and approved answer rules. M2 imports the unchanged WP04-07A `expanded-full-save.json` through the real backup prepare/confirm path only on a fresh database. Its ten committed quests and entitlements are compatible state, not a second state or reward oracle. Node browser tests import the erased API, not the executable DOM host. Test-only answer selection follows actual approved task rules.

An ordinary later visit uses the facade's existing refresh, then presents its closed archive. The rollover case preserves every profile's creative/world/reward facts, while checking the actual closed result and active week. Pure Skip, replay, Hall and Escape retain an identical snapshot; reload/next visit introduces no seen-state or award. Finite tie/omission models reuse the accepted WP05 Hall fixture facts (ranks 1/1/3, gold/gold/bronze).

| Check | Result and evidence |
|---|---|
| Full Chromium suite | 16/16: all eleven inherited M1 cases plus five M2 cases; no skips, flakes or unexpected failures. Root `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-creative-501784df57aa44fd9d366627f79eb322`; start `2026-10-11T18:59:08.298Z`, 26.161 seconds. |
| Final M2 matrix | 20/20, five cases in each of Chromium desktop 1366×768, Edge desktop 1920×1080, Chromium touch 1024×768 and WebKit touch 768×1024. One worker, no skips/flakes/unexpected failures. Root `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-creative-ad3d4f15b20c4e21bc99cc79d4667445`; start `2026-10-11T19:01:16.956Z`, 74.113 seconds. |
| Festival focused tests | Vitest 6/6: null, ties, partial/full omission, absent explorer and immutable input/no callbacks during rendering. |
| Strict type checks | Separate DOM/JSX component/host/test and Node-only browser/API/config checks passed without diagnostics. |
| Visual inspection | Final desktop and WebKit tablet creative layouts and Festival result layouts inspected; earlier unchanged Festival desktop/360px views inspected. Browser cases check 360px reflow and artwork containment within all six sockets. |

M2 browser coverage includes each type through keyboard/touch preview, duplicate use, move to an empty socket, Undo, atomic Save and reload; all six sockets accept reusable decorations. Actual quest progression exercises locked/earned thresholds and shelf/invention states, followed by Save/reload. A native IndexedDB abort remains unsaved; retry commits. A held Save across a profile switch retains isolation and produces no late celebration. Final geometry checks cover the repaired socket layout.

Two preliminary runs were red and corrected before the final evidence: the inherited exact-20 test assumed the M1 bridge task despite the accepted expanded selector; it now answers the actual selected approved rule. A new test expected Undo after swapping two identical lanterns; it now creates an empty destination and tests a real move. Visual review also found a tall second-row banner overlapping first-row controls; M2 socket/artwork bounds were corrected and the four-mode M2 matrix rerun. The final bounds are M2-only, so the full Chromium M1 result remains applicable. These were owned test/layout defects, not state/reward repairs.

Reproduction uses `tests/fixtures/creative-run.ps1 -Filter 'M2'` for the four-mode matrix, its project option for the full Chromium suite, and the focused Vitest/strict TypeScript commands with the installed bundled Node runtime. Reports retain JSON assertions/snapshots and screenshots in private roots. The initial handoff did not run the full supported TypeScript build; its subsequent membership correction and build evidence follow below. No package regression rerun, producer rerun or deployment was performed; Controller owns integrated verification.

## Integration correction — exact fixture project membership

After integrating the original thirteen reviewed files, Controller reported the full supported build failure: `tests/fixtures/creative.tsx(9,35) TS6307: tests/fixtures/creative-festival-fixtures.ts is not listed in tsconfig.app.json`. This candidate reproduced that exact diagnostic with exit code 1; the failure is retained at `.verification/typecheck-membership/before.txt`. The earlier standalone strict checks did not exercise composite project membership and therefore did not cover this requirement.

The correction adds only `tests/fixtures/creative-festival-fixtures.ts` to the existing app project's `include` list. Every other compiler option and member is preserved. It neither relaxes checking nor relocates content. The original twelve production/test files retain their reviewed byte lengths and hashes; only this handoff and the additional configuration entry change. Main config remains unchanged by this author.

Full supported TypeScript build mode passed (exit code 0, no diagnostics): bundled Node ran `node_modules/typescript/bin/tsc -b .verification/typecheck-membership/tsconfig.json --force`. That private root references wrappers extending the original app, Node and service-worker projects, with only each `tsBuildInfoFile` redirected into the candidate's private verification directory. All original project membership and compiler options, including `noEmit`, are inherited. This avoids writing build-info through the shared dependency junction. The passing output is retained at `.verification/typecheck-membership/after.txt`; wrappers and outputs are excluded from delivery.

The manifest now includes the exact unchanged-main and archive config preimages, its final bytes/hash, and the handoff's correction preimage. The configuration-only fix does not invalidate browser/runtime evidence, so no browser rerun was performed. This small correction awaits the same independent reviewer; the chunk remains unaccepted until Controller closes that review and integration check.

Browser engines and touch emulation do not establish physical tablet/Safari, child-testing or acoustic quality acceptance. Chromium support is not an installed Chrome claim. No fresh Firefox/D3 M2 result is claimed. Independent review and Controller integration remain outstanding.
