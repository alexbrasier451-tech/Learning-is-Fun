# WP05-04A independent frozen-UI validation

9 October 2026. Independent report-only review of the Hall/history construction.

**Verdict: TECHNICALLY READY within the frozen read-model UI scope. Open UI
findings: NONE. Full WP05-04A acceptance: PENDING.** DEP-053 release and the
real-facade refresh/closure sequence have not been completed by this evidence.
Required D1 Chrome and D3 Firefox observations remain outstanding. Controller
owns dependency release, administrative acceptance and integration.

## Authority and reviewed boundary

Read the current execution authority in [GLOBAL_RULES](../GLOBAL_RULES.md), the
[WP05-04A child](../chunks/WP05-04A.md), DEC-005/011/012/017/023/027/030,
[the author handoff](WP05-04A-HANDOFF.md), the accepted reward DTOs and standings
selector, and [WP05-03A validation](WP05-03A-VALIDATION.md). Inspected both
components, all Hall CSS, the nine owned browser cases and the complete owned
fixture/configuration/runner/teardown boundary. Compared presentation with
`docs/art-direction.md`, the accepted avatar catalogue and ready M1 art handoff.
Read the Hall read-only adapter addendum at the end of
[WP04-04A-HANDOFF](WP04-04A-HANDOFF.md), and the retained
[browser capability](BROWSER-CAPABILITY.md) and
[activation diagnosis](BROWSER-ACTIVATION-DIAGNOSIS.md) evidence.

This validator wrote only this report. No production/test/shared configuration,
dependency, asset, package/status or Git changes; no delegation or other-chat
messages. Ordinary report writing is sufficient. Fresh checks were isolated
no-emit typechecks, and retained reports/captures were read directly. No browser
or fixture server was launched and no other worker's port was used.

## Independent assessment

| Criterion | Conclusion and evidence |
|---|---|
| Current versus closed results | PASS for controlled presentation. Current `competitivePoints`, `lifetimePoints`, `usedSlots` and nullable `rank` are printed directly, under individually labelled fields and a provisional-rank explanation. Closed entries use their supplied points/rank/medal. Personal history explicitly says the current week is open and is not a closed medal result. Neither component awards a current rank a trophy. |
| Positive ties and zeros | PASS. The accepted selector supplies 20/20/10/0 as 1/1/3/unranked. Current rows retain those exact ranks, while closed rows retain gold/gold/bronze and omit the zero participant. Text explains positive ties and unranked zero scores without describing intelligence or ability. The UI contains no second ranking calculation. |
| Weekly cap and lifetime meaning | PASS. The cap fixture displays 600 weekly, 620 lifetime and 30/30. The cap notice says lifetime points and adventure progress can continue. The explanation matches DEC-011's first valid Check, mutually exclusive success bonuses, first 30 eligible learning-selected opportunities, noncompetitive repeated/child-selected practice and once-only lifetime quest bonus. Cosmetics do not spend points. |
| Saved identity versus current identity | PASS. Current Amira/Pip and archived Mira before rename/Iona are read from their separate supplied fields. Both Hall closed rows and personal closed rows retain the historical nickname/avatar. No archive rewriting is performed. |
| Retention and cumulative records | PASS. Hall renders 52 supplied archives, with 51 older-week disclosures after the first. Personal history renders the selected profile's 52 retained entries, but reads best and medal totals from `personalRecordsByProfile`, independently of that window. Retained source evidence has 53 gold medals and a best dated 2025-09-29, older than every displayed archive. No medals or best are reconstructed from displayed weeks. |
| Deleted entries and original gaps | PASS. The omitted fixture keeps Cleo at rank 3/bronze even as the sole surviving archived entry; personal history preserves the same rank. The wholly omitted week remains dated 2026-09-28 with an honest no-entries message. Omission notices explain the unchanged original ranks and medals. |
| Empty, unscored, single and unavailable | PASS. Zero saved profiles, one unscored profile and one actual 20-point profile contain no synthetic rivals or history. A single player's history has zero medal totals and no closed best. Personal selection reads Cleo's 0/0/1 totals and lifetime 40 separately from Dev's 0/0/0/no-best records. A removed identity has a focused unavailable heading and a usable Back route. |
| Refresh and clock honesty | PASS for the status/model ports. Loading/refreshing disable the calendar button; failed/stale states visibly identify last committed results and do not claim a new week or confirmed closure. The live status and busy region support readable pending feedback. Independently decoded retained models are exactly unchanged across refreshing, failed, loading and stale states. The rollback notice preserves active week 2026-10-05 and identifies local clock/backup limitations. Actual facade refresh is still pending. |
| Local scope and dates | PASS. Both surfaces state that profiles are saved in this browser; Hall adds explicit browser-local competition language. The supplied current range is displayed as 2026-10-05–2026-10-11 with Europe/London. Closed weeks retain their supplied Monday dates. No accounts, worldwide standings or anti-cheat claim is introduced. |
| Single policy/clock/writer | PASS for the reviewed source boundary. Components import React, accepted erased reward types, avatar catalogue and base-aware asset helper only. They do not import repository, state controller, calendar, scoring or reconciliation; no ambient clock, storage, network, dispatch or closure logic appears. Filtering personal rows is display-only. The frozen fixture alone builds models from explicit domain data through the accepted selector. |
| Keyboard, focus and touch | PASS in the retained available-engine evidence. Heading entry focus, Enter to history, Escape to back/close, 3px visible focus, initiating-player focus restoration, touch history/back and idempotent teardown are tested. Native buttons, disclosures, lists and definition lists retain DOM labels. The outer host remains responsible for restoring adventure focus in real composition. No keyboard trap or hover-only route was found in this boundary. |
| Readability and reflow | PASS in the retained available-engine evidence. The tests measure 18px body, at least 44px targets, 36px body at 200% root text size, 683px reflow, landscape/portrait changes and no document horizontal overflow. The final eight affected checks cover keyboard/focus and art/reflow after the header CSS change. Inspected final enlarged captures show intact header/freshness sections, readable whole words, taller controls and no clipped required content. |
| Supplied-art presentation | PASS within this two-panel surface. The CSS matches the accepted paper/ink/teal/plum typography, spacing, outlined controls and rounded paper framing. Ready base-aware Hall marker, Pip, spellbook and mapped avatar SVGs load in retained checks. Inspected avatar crops remain recognizable and current/historical art differ correctly. Art is decorative beside live text; unknown future avatar IDs do not invent portraits. No extra art or dense administrative/marketing UI was added. |
| Fixture isolation | PASS by source inspection. The fixture uses accepted `mountPanel` with teardown for its roots, private controls and recorders. Foundation release input remains `index.html`; no Hall fixture import appears in app/platform source. Private Hall configuration uses port 5185, one worker, temporary cache/report output and its own teardown. No release build or precache acceptance is inferred from this source check. |

## Reused execution evidence, independently inspected

Read the original JSON results, all per-test statuses/engine logs and decoded
read-model attachments; inspected representative retained rendered PNGs. The
following are author executions being reused, not new independent browser runs.

| Retained report | Actual result |
|---|---|
| `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-65806730ed514054ba9b9d90842a80ca/results.json` | 36 expected/passed; zero unexpected, flaky, skipped or report errors; 37.096s; started 9 October 2026 at 03:54:46 BST. Nine cases in each of four projects. |
| `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-91ba4f8f12574c3ba2684423554408f7/results.json` | Eight expected/passed; zero unexpected, flaky, skipped or report errors; 7.666s; started 9 October 2026 at 03:56:18 BST. Two final affected cases in each project. |

Actual engine logs identify installed Edge 154.0.4258.62 at 1920×1080 D2,
Playwright Chromium 156.0.8078.4 at supporting 1366×768 desktop and touch
1024×768 T1, and Playwright WebKit 27.2 at touch 768×1024 T2. Chromium desktop
is supporting evidence and does not satisfy branded D1 Chrome. WebKit/touch
emulation does not establish Safari or a physical tablet.

Viewed these retained files directly:

- Final report: `hall-edge-D2-layout-baseline-render.png`,
  `hall-webkit-T2-layout-baseline-render.png`,
  `hall-chromium-T1-text-200-reflow-render.png`, and
  `hall-webkit-T2-text-200-history-landscape-render.png`.
- Original report: `hall-chromium-T1-failed-render.png`,
  `hall-webkit-T2-empty-render.png`, and
  `hall-chromium-T1-unavailable-profile-render.png`.

The enlarged Hall and journal images were inspected at original resolution.
Empty and failed/clock captures retain readable notices, supplied decorative art
and usable Back/check controls. The final CSS timestamp precedes the final
eight-case run; the earlier 36-case run is correctly not represented as a second
complete run on that final CSS. The supplied finite cases and focused final
rerun are proportionate; this review did not repeat the broad matrix or reward,
calendar, storage or whole-game suites.

## Fresh independent type verification

Both commands below passed with exit 0 using bundled Node 24 at
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
They use `--noEmit --incremental false`; no build-info/output or shared compiler
configuration was written.

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --jsx react-jsx --lib ES2022,DOM --types node src/vite-env.d.ts src/rewards/HallOfChampions.tsx src/rewards/PersonalHistory.tsx tests/fixtures/local-leaderboard.tsx tests/browser/local-leaderboard.spec.ts

node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --incremental false --strict --skipLibCheck --target ES2023 --module ESNext --moduleResolution Bundler --lib ES2023 --types node tests/browser/local-leaderboard.spec.ts tests/fixtures/local-leaderboard.config.ts tests/fixtures/local-leaderboard-teardown.ts
```

The second command confirms the spec/config/teardown Node boundary without
DOM/JSX settings or runtime fixture/component imports. No root composite build,
release build or integrated runtime claim follows from these checks. No concrete
counterexample required a source fix or additional browser matrix.

## Remaining completion obligations

1. **Release DEP-053 and execute the real binding.** Controller must accept and
   release WP04-04A before the author integrates it. The requested proof remains
   a real committed positive current result, controlled London-week advance,
   opening Hall through `controller.refresh()`, acknowledged prior closure and
   new-week score/slot reset, then repeated opening/refresh without duplicate
   closure or medals. Retain real before/after committed snapshots and displayed
   numbers. Frozen fixture equality proves display fidelity, not persistence or
   once-only durable closure.
2. **Use the existing read-only adapter handoff.** The WP04 addendum resolves the
   earlier context question through accepted `localDateAt`/`weekKeyFor`, committed
   `latestOpenedWeek` and a separate presentation observation instant. It calls
   for readiness, subscription/unsubscription and retention of the last
   acknowledged model during pending/failed/conflicting/stale refresh. A null
   active week remains loading/unavailable; a presentation week later than the
   acknowledged week remains stale. An earlier observation supplies the rollback
   flag. Scores/slots/archives/records remain snapshot facts passed through the
   accepted selector. This is usable adapter guidance, not executed integration
   evidence, and it requires no new DTO, clock inside durable operations, reward
   engine or writer.
3. **Complete the existing required browser observations.** D1 branded current
   Stable Chrome and D3 matched Firefox remain unavailable as documented. The
   Hall's required D1 states/routes and subsequent shared-matrix/published
   observations remain outstanding; the supporting Chromium run cannot close
   D1. No substitute pass, installation, security change or browser recovery was
   attempted in this review.

Final shell/world composition and WP06's actual published PC/tablet standings
journey remain with their existing owners. WP06-04A alone accepts M1; later M2
obligations remain unchanged. No published-play, M1/M2 completion, acoustic,
screen-reader, child, physical-device or complete-browser-matrix claim is made.

## Real-facade continuation recheck — 9 October 2026

**Current verdict: PASS / technically complete for the implemented Hall/history
and real-facade host binding in the available, attributed modes. Open source or
binding findings: NONE. Whole WP05-04A acceptance remains PENDING its required
browser observations and Controller acceptance.** This addendum supersedes the
preceding DEP-053-release and real-binding-pending statements. The frozen-UI
assessment and its 36+8 evidence remain valid and were reused.

Controller's recorded acceptance of facade commit
`97482c4b791a84c55384c623163664c7d1fdddbc` releases DEP-053; the accepted core
integration record confirms the release. Inspected the updated Hall handoff,
real host, erased fixture API, entry routing and five added browser cases. The
production components and CSS match the preceding source review; their original
modification timestamps are unchanged. Current reviewed fingerprints are:

| Source | Lowercase SHA-256 |
|---|---|
| `src/rewards/HallOfChampions.tsx` | `0ee7c141d99c800482dca8d5a4022af683e73729b77f1aac00d6f79e1a7cc6a5` |
| `src/rewards/PersonalHistory.tsx` | `4d2661e49198e3f6f53716e898c937bd547fac19386aa7548c2ac4ae42c0d78e` |
| `src/rewards/leaderboard.css` | `3dc0d9136fe86709f27bf0ee1ce06a7d7ff3d467f2f32b17e3c37f195ab87989` |
| Accepted `src/state/controller.ts` | `14aab57d98a9a9f96e2c5172c3e7dac37eacd60590b11bc7a3d514ae54a20657` |

The controller digest matches the final independently validated facade digest.
No Git inspection/mutation was needed for this report-only source check.

### Adapter and integrated display assessment

`?mode=real` loads the owned host with one accepted facade/repository per tab,
unique disposable native-IDB namespace and a labelled injected test clock. It
awaits facade readiness. Opening Hall requests `controller.refresh()`; while
pending it keeps the previous model and labels its freshness. With no previous
model it shows loading/unavailable controls rather than inventing saved scores.

Only `committed`/`already-applied` acknowledgement snapshots reach the accepted
standings selector. `localDateAt`/`weekKeyFor` compare the separate presentation
observation with the acknowledged active week. A later observed week retains the
prior model/stale label, an earlier observation supplies the rollback notice,
and null active week stays unavailable. Failed or conflicting refresh keeps
prior displayed facts with failed/stale status. Controller subscription notices
changed tokens and can mark the acknowledged display stale; it does not itself
publish fresh closed results. UI subscription uses a stable
`useSyncExternalStore` view. Teardown unsubscribes, unmounts and disposes once.

The host performs no reward arithmetic, ranking, calendar reconciliation or
native durable write of its own. Its hold/abort instrumentation wraps the real
repository transaction for bounded verification; IDB inspection uses a readonly
transaction. Commands still pass through the accepted sole facade. The model
comes from acknowledged scores/slots/archives/personal records. The prior
adapter guidance is now implemented and exercised, rather than claimed solely
from the handoff example.

Independently read the retained continuation report at
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-18308122ec924aa4a4a2155bb0ec931c/results.json`:
**20 passed**, five real cases in each of the same four attributed modes; zero
unexpected/flaky/skipped or report errors; 28.811s, starting at 04:41:58 BST.
Read all case statuses, engine logs and decoded native/facade/model evidence.
Also checked the affected frozen entry-routing smoke at
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-a2935f7c525844bb9e42840e5a1c6b5f/results.json`:
**four passed**, zero unexpected/flaky/skipped; 4.872s, starting at 04:43:13 BST.
These are retained author runs, not an independently repeated matrix.

| Actual integrated boundary | Independent evidence conclusion |
|---|---|
| Opening/held rollover/acknowledgement | PASS. Real Q1 Check yields 20 weekly, 40 lifetime and one slot. Held 12 October refresh retains that prior display and unchanged native root, with one additional facade clock read. Acknowledgement advances revision 4→5, opens 2026-10-12, clears current scores/slots, displays 0/40/0 and archives 2026-10-05 at rank 1/gold/20. Best and cumulative gold become 20/2026-10-05 and one. |
| Repeat opening | PASS. `already-applied`, same revision 5 and exact native/facade save, one archive and one gold. Personal history displays the actual saved medal total. |
| Native abort and explicit retry | PASS. The abort occurs after the candidate put; `save-failed` leaves the native root and published snapshot unchanged at revision 4, keeps 20/40/1 and shows failure. Explicit retry alone commits revision 5 and a single closure/medal. |
| Real second-tab conflict | PASS. Same-namespace rename wins revision 5; first tab receives a conflict/winner snapshot but retains its acknowledged Amira model with stale text. Explicit refresh accepts Mira without another revision, archive or medal. |
| Later presentation observation | PASS. Observation advances while the durable operation remains in the prior week: `already-applied`, stale prior model, unchanged native save and exactly one facade clock read. Advancing the actual injected facade clock and explicitly checking produces the single legitimate closure. |
| Rollback and disposal | PASS. Earlier observation retains active week 2026-10-12 and exact closed snapshot with the actual selector notice. Double teardown leaves subscription inactive/disposed and UI unmounted. A post-disposal command is `save-failed`, with unchanged notification count and native history. |

For the decoded T1 attachments, native and facade saves match at every labelled
boundary, including failure/conflict. Inspected real WebKit T2 portrait
acknowledged-closure, Chromium T1 stale-conflict and Chromium T1 rollback PNGs.
The old/new weekly distinction and honest notices are readable; no new layout
or art finding arose. The unchanged components retain the prior final 200%,
keyboard/focus/target/rotation review.

### Narrow fresh independent verification

Reran only the original real opening/rollover case in T1, using the existing
private runner:

```text
./tests/fixtures/local-leaderboard-run.ps1 -Filter 'real facade opening refreshes' -Project hall-chromium-T1
```

**One passed**, zero unexpected/flaky/skipped, Playwright Chromium
156.0.8078.4 touch 1024×768, one worker, 2.213s, 04:49:03 BST. Private evidence:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-2502ca9356a34617a0565c3a4d4d4a07/results.json`.
Fresh epoch `1ea2ef17-7b20-4bfb-9215-59f1a94e9e41` independently follows revision
4→5; pending retains 20/40/1 and no archive, acknowledgement displays 0/40/0
with one gold/one archive, and repeated opening stays revision 5 with
`already-applied`. Decoded native/facade saves match each checkpoint. The
runner released port 5185; a final read-only check found zero listeners there.

Both fresh no-emit typechecks pass: strict ES2022/DOM/JSX for components, frozen
entry, real host and erased API; isolated strict ES2023/Node for browser spec,
erased API and owned config/teardown. These use the preceding flags with
`--incremental false` and do not alter shared compiler settings. No full frozen,
full real-engine matrix, root build or broader regression was repeated.

### Exact remaining browser scope and acceptance limits

- **D1:** WP05-04A explicitly requires empty household, one real player,
  20/20/10/0 shared ranks, full 30-slot allowance, clock notice, closed-history
  gap and refresh failure at Chrome 1366×768, with relevant keyboard/mouse,
  focus/targets and 200% checks. Supporting Chromium does not satisfy branded
  Chrome. These D1 observations remain open.
- **T1:** Those finite construction states and touch/layout checks have retained
  Chromium 1024×768 evidence, now supplemented by the independently passing
  actual-facade closure/repeated-open path. This closes the requested technical
  host sequence within available T1 evidence; it does not establish published
  game acceptance.
- **D3:** DEC-005 requires Firefox 1280×720 smoke of relevant views/routes.
  Applicable Hall/history smoke remains outstanding. It does **not** require
  repeating every finite Hall fixture, every boundary or the complete D1/T1
  journey in Firefox. D2 and T2 remain attributed to the existing Edge/WebKit
  evidence and their defined scopes.

D1/D3 host availability remains blocked by the retained capability/activation
evidence. The Edge-primary user question is still pending and does not authorize
a waiver or substitution. This recheck performed no installation, browser
recovery or security change. Full child acceptance remains with Controller after
the existing required observations; no additional completion gate is invented.
Final shell/world composition, actual published PC/tablet journeys, M1/M2 and
acoustic/physical-device/child claims remain outside this technical report.
Only this validation append and private test output were written.
