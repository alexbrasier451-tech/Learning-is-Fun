# WP05-04A Hall/history author handoff

9 October 2026. **Author implementation, real-facade binding and remaining D1
Chrome checks complete. Independent D1 recheck and whole-child acceptance remain
Controller-owned.** The previously outstanding D3 relevant-view Hall/history
smoke was independently accepted in `WP05-04A-VALIDATION.md`; the new D1 proof is
recorded below. Earlier pending-mode statements are historical and superseded.
Controller released DEP-053 against accepted facade commit
`97482c4b791a84c55384c623163664c7d1fdddbc` and fresh core integration PASS.
The prior frozen-port handoff was independently technically PASS with no findings.
The real fixture now imports the accepted facade; controlled components still
have no facade/storage/clock dependency. No final shell/published/M1/M2 acceptance.

## Ownership and delivered interface

Owned additions only:

- `src/rewards/HallOfChampions.tsx`, `PersonalHistory.tsx`, `leaderboard.css`.
- `tests/browser/local-leaderboard.spec.ts`.
- `tests/fixtures/local-leaderboard.{html,tsx}`, unique
  `local-leaderboard.config.ts`, `.vite.config.ts`, `-teardown.ts`, `-run.ps1`.
- Continuation: `tests/fixtures/local-leaderboard-real.tsx` and erased pure
  fixture boundary `local-leaderboard-api.ts`.
- This handoff.

No scoring/calendar/state/shared contract, asset, app root, dependency, shared
configuration/status, Git or other-chat edits. No delegation. Ordinary writer
worked. The assigned sole author kept the coupled UI/read-model/fixture decisions
serial; no independent authoring lane was opened under GLOBAL_RULES.

Exports match the controlled ports:

```ts
HallOfChampions({ model, refreshStatus, onRefresh, onOpenHistory, onClose })
PersonalHistory({ profileId, model, onBack })
HallRefreshStatus = 'ready' | 'loading' | 'refreshing' | 'failed' | 'stale'
```

The model is the accepted `LeaderboardReadModel`; callbacks are synchronous void
requests for the owning adapter. Components do not read a clock, repository or
controller, rank, award, close a week, or reconstruct records. The adapter must
retain the last acknowledged model while pending/failed/stale; status does not
alter its numbers. Hall heading and personal heading receive entry focus. Escape
calls close/back. The host owns restoring the initiating history/adventure focus;
the fixture demonstrates history-button restoration and idempotent teardown.

Warm paper/ink/teal/amber/plum, system typography, outlined controls and rounded
panels consume the accepted WP02 visual token values. `assetUrl` resolves ready
M1 hall-marker, Pip, spellbook and registry-mapped avatar exports. Native lists,
definition lists and details carry readable DOM text; artwork is decorative with
empty alt. Unknown future avatar references retain the name without invented art.
No new art, emoji portraits, synthetic rivals or cosmetic score spending.

## Read-model fidelity and finite fixture evidence

The fixture mounts via accepted `mountPanel`, with private navigation/refresh
recorders. Its model is produced by actual accepted `buildLeaderboardReadModel`
from bounded explicit domain fixtures. Fixtures alone supply records/archives;
production UI only displays them. All teardown roots unmount on pagehide.

Expected and observed:

| State | Exact result |
|---|---|
| Empty / unscored / single | 0 rows / one unranked zero / one actual 20 weekly, 20 lifetime, 1/30; no fabricated history |
| Positive ties | 20/20/10/0 → 1/1/3/unranked; closed gold/gold/bronze and no zero entry |
| Rename snapshot | Current Amira; closed Mira before rename and original Iona avatar |
| Cap | 600 weekly, 620 lifetime, 30/30; continuing lifetime/adventure progress explained |
| Omitted archive | Sole survivor Cleo remains rank3/bronze; deletion notice; wholly omitted week stays dated |
| Retention | 52 displayed archives, 53 gold lifetime medals, personal best one week older than displayed window |
| Personal selection | Cleo 0/0/1 medals and lifetime40; Dev 0/0/0 and no best; unavailable profile has honest fallback |
| Clock rollback | Actual selector notice preserves 2026-10-05 active week; current range 2026-10-05–2026-10-11 London |
| Refresh loading/failure/stale | Prior four rows, archive and records unchanged; freshness explicitly labelled; pending check disabled |

Tests attach named PNG captures and exact JSON source models for each state to
`results.json`. Model equality before/after repeated UI operations confirms no
fixture-model mutation. It does not claim real persistence or awards.

## Checks actually run

Bundled Node24 at
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

1. Focused strict ES2022 JSX typecheck of both components, fixture and browser
   test with `src/vite-env.d.ts`: passed after final TSX edits.
2. Separate strict Node/ES2023-only typecheck of the browser spec and unique
   runner/config support: passed. Browser callbacks use local structural probes
   and erased pure reward types; no `typeof` runtime fixture imports enter Node.
3. `./tests/fixtures/local-leaderboard-run.ps1`: **36 passed**, no failed,
   flaky or skipped cases, 37.1s. Report root:
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-65806730ed514054ba9b9d90842a80ca`.
4. Rendered inspection found word fragmentation in the 200% header. The narrow
   CSS fix wraps whole header/freshness sections. Final affected rerun
   `-Filter 'keyboard and touch|rendered art'`: **8 passed**, 7.7s, no failures
   or skips. Final layout report/captures:
   `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-91ba4f8f12574c3ba2684423554408f7`.
   This is an affected final recheck, not an unperformed second 36-case run.
5. Owned-path trailing-whitespace scan: clean. Read-only app/foundation search
   shows no Hall fixture import; foundation release input remains `index.html`.
   Runner teardown released port5185. No shared cache/build-info/output writes.

| Actual engine and mode | Complete fixture suite | Final affected checks |
|---|---:|---:|
| Installed Edge154.0.4258.62, 1920×1080 D2 | 9 pass | 2 pass |
| Playwright Chromium156.0.8078.4, 1366×768 supporting desktop | 9 pass | 2 pass |
| Playwright Chromium156.0.8078.4 touch, 1024×768 T1 emulation | 9 pass | 2 pass |
| Playwright WebKit27.2 touch, 768×1024 T2 emulation | 9 pass | 2 pass |

Layout assertions cover loaded SVGs, ≥44px targets, 18px default body, 36px body
at 200% root text size, 683px reflow, portrait/landscape rotation and no horizontal
overflow. Keyboard Enter/Escape and visible 3px focus plus touch history/back
routes pass; focus returns to the initiating player. Rendered inspection includes
desktop, portrait, empty, refresh failure, personal journal and corrected 200%
captures. No screen-reader, physical tablet, Safari, child or acoustic claim.
Private port5185, temporary caches/reports and max1 worker throughout.

## Accepted real binding and exact adapter interface

`tests/fixtures/local-leaderboard.html?mode=real` dynamically loads only the
owned real host. Frozen mode retains its prior path. `mountRealHall(container,
controls)` uses the same accepted `mountPanel`; the test-only `RealHallApi`
boundary contains erased JSON/state contract types, never browser implementations.
Each tab has one controller and one real `openSaveRepository` under a unique
`learning-is-fun:/playtest/:hall-<namespace>` namespace. Controls identify this as
a controlled real-IDB fixture. Native IDB inspection is read-only.

The exact ports remain `getSnapshot`, `subscribe`, `dispatch`, `refresh`, readiness
and flush, with composed `ready`, load state and `dispose`. The host awaits
`ready`, and opening the Hall explicitly calls `controller.refresh()`. No model
is fabricated while none is available. The host retains its previously presented
model until a `committed` or `already-applied` refresh acknowledgement is eligible
for presentation. Failure/conflict keep the model and show failed/stale status.
Subscription observes changed tokens and marks prior display stale; it does not
present new closed results ahead of refresh. UI subscriptions use a stable
`useSyncExternalStore` view; teardown unsubscribes, unmounts and disposes once.

The producer's accepted guidance resolved the former context question without
new shared DTOs: `localDateAt(observedEpochMs)` / `weekKeyFor(observedLocalDate)`
are a separate presentation observation, compared with the acknowledged
`snapshot.save.competition.latestOpenedWeek`. Null active week stays unavailable;
observed week later than acknowledged active week retains the prior model/stale;
earlier observed week supplies the selector's actual rollback notice. In normal
controlled checks the known observation equals the facade's injected instant.
No extra clock read occurs inside the write, second reconciliation runs, or score/
calendar policy is reconstructed. Model numbers, slots, records and archives all
come from the acknowledged snapshot and accepted selector. Components unchanged.

## Actual native-IDB continuation proof

`./tests/fixtures/local-leaderboard-run.ps1 -Filter 'real facade'` — **20 passed**,
28.8s, zero unexpected/flaky/skipped. Five cases in each of Edge154.0.4258.62
D2, supporting Chromium156.0.8078.4 desktop, Chromium156.0.8078.4 T1 touch
emulation, WebKit27.2 T2 touch emulation. Private port5185/cache/reports, max1 worker.

Final real proof root:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-18308122ec924aa4a4a2155bb0ec931c`.
Each labelled attachment includes exact facade/native roots, read model, clock
reads, refresh receipts, projection observations and subscription lifecycle;
PNG captures accompany acknowledged closure, prior failure/conflict and rollback.

| Actual flow | Expected = observed |
|---|---|
| Real Q1 first independent correct on 9 October | 40 lifetime / 20 weekly / 1 slot; no closed result |
| Advance injected clock to 12 October; close/open Hall; hold actual calendar write | Last committed 20/40/1 rows visible with refreshing label; no new archive displayed; native root unchanged; exactly one facade clock read |
| Release and acknowledge rollover | Old week2026-10-05 archived rank1/gold20; active2026-10-12 current maps empty; displayed0/40/0; records best20/week2026-10-05 and gold1 |
| Repeated close/open | `already-applied`; exact snapshot/native values retained, same revision, one archive/medal; personal history shows gold1 |
| Native transaction abort after candidate put | `save-failed`; native root and published snapshot unchanged; prior read model20/40/1 retained with failure text; explicit retry alone adds one revision/closure/medal |
| Actual same-namespace second tab renames between read and held commit | Actual revision `conflict`; winner snapshot accepted by facade, prior Amira model visibly stale; explicit refresh accepts Mira without awards/closure |
| Presentation observes later week than same-week durable refresh | `already-applied`, stale prior model and unchanged native state; advancing actual facade clock then explicit check commits the single closure |
| Actual rollback from12 October to9 October | Active2026-10-12 retained with selector clock notice; `already-applied`, exact closed snapshot unchanged |
| Teardown twice, then attempted write | Subscription inactive, disposed, roots unmounted; post-disposal `save-failed`, notification count and native history unchanged |

Concrete final Edge rollover epoch `0a7a00d8-4030-4a95-a393-e5cc8df452cf`,
revision4→5. Repeat opening remains revision5. Each other case has its own native
namespace/epoch in attachments. Full source model/receipt values remain in the
report rather than inferred from the screenshots. Captures inspected: Edge D2
acknowledged closed/new-open panels, WebKit T2 portrait closure, and Chromium T1
failed prior display; no new visual finding.

Focused final strict ES2022/JSX check of the components, entry, real host and pure
API passes; separate strict Node/ES2023-only check of browser spec/API passes.
Because the entry routing changed, only its affected frozen tie smoke was rerun:
`-Filter '20/20/10/0 ties'` — **4 passed**, 4.9s, root
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-a2935f7c525844bb9e42840e5a1c6b5f`.
Prior 36-case frozen and 8-case final layout evidence is retained above; no
unperformed combined 56-case run or repeated full frozen matrix is claimed.

## Remaining limits for independent recheck

D1 branded Chrome and D3 Firefox remain blocked as documented in
`BROWSER-CAPABILITY.md` and `BROWSER-ACTIVATION-DIAGNOSIS.md`. Supporting Chromium
does not substitute for D1. The user Edge-primary question is pending; no mode
requirement was changed. No browser installation or security change attempted.
Controller owns independent review, acceptance and integration. No remaining
owned source/contract defect is known. The actual-domain Hall criterion is now
proved in available modes; exact D1/D3 acceptance, final shell, published game/M1
and M2 are not claimed. No shared state/config/dependency/status/Git/chat mutation.

## Copy-only polish after independent real-binding PASS

Controller preserved the real binding in partial commit
`12ce0e43741b8622c20ee897fea5036c865955e7` and requested plain product wording.
Only component string literals, three affected existing test text expectations
and this addendum changed. No style, behavior, data, port or policy change; no
new tests, matrix rerun, shared config or Git operation.

Exact string changes:

| Previous text | Replacement |
|---|---|
| `Showing the last committed results` in refreshing/failed/stale messages | `Showing your previously saved results` |
| `Calendar checked. These are committed results.` | `Calendar checked. Your saved results are up to date.` |
| `From committed closed weeks, across your whole history.` | `From saved closed weeks, across your whole history.` |
| `Weekly slots used` | `Weekly scoring turns used` |
| `All 30 weekly slots used.` | `All 30 weekly scoring turns used.` |
| ` / 30 slots used.` in personal history | ` / 30 scoring turns used.` |

The weekly-cap explanation now reads exactly:

> Your first 30 scoring turns can add weekly points. A new activity chosen by
> the game can start a turn when you first Check an answer. A due review chosen
> by the game in a later week can start another turn. Retries stay in the same
> turn; repeated or child-chosen practice does not start another. Quest completion
> adds 20 lifetime points, once.

Pending/failure/stale messages still explain that the current/new week or closed
result is unconfirmed until the calendar check succeeds. Cap continuation keeps
the existing lifetime/adventure explanation. Model `usedSlots` and all other
fields/ports retain their exact original meaning.

Focused strict ES2022/JSX component/spec typecheck: passed. One existing smoke:
`./tests/fixtures/local-leaderboard-run.ps1 -Filter 'calendar rollback, loading' -Project 'hall-edge-D2'`
— **1 passed**, 2.3s, observed Edge154.0.4258.62. Root:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-4f3a5b4a428d4fe28a08d5351eae05df`.
No broader matrix or acceptance claim. D1/D3 gaps remain unchanged.

## Remaining D1 branded Chrome proof — 9 October 2026

Human reported installation; the supported Playwright `chromium.launch({
channel: 'chrome' })` route now successfully launches branded Chrome. Actual
running version **155.0.8059.40**, CDP product **Chrome/155.0.8059.40**, executable
**`C:\Program Files\Google\Chrome\Application\chrome.exe`**. Path was returned by
CDP browser command-line metadata, not guessed. That metadata-only launch added
`--enable-automation` to expose the command line; the actual tests below use the
normal `chrome` channel with no executable override or custom flags. No browser
installation, dependency, global configuration or security setting was changed.

A private temporary D1-only config imports the existing Hall config and replaces
only its project list with `hall-chrome-D1`, browserName=chromium, channel=chrome,
**1366×768 desktop**, no touch/mobile. It retains the accepted host, exact port
**5185**, isolated cache/output, one worker and no retry. An initial temporary
config loader failed before test collection because the temp directory lacked
ES-module classification; a temp-only `package.json` fixed that. No repository
source/config/test/support file changed in this continuation.

Final command: bundled Node24 runs installed
`node_modules/@playwright/test/cli.js test --config <private-root>/hall-d1.config.ts`
with exact existing-case grep:

```text
empty, unscored|20/20/10/0|30-slot|closed deletion|52 displayed|calendar rollback|keyboard and touch|rendered art|real facade opening
```

**9 passed**, 7.3s, zero unexpected/skipped/flaky/retries/report errors. Actual
test stdout: `hall-chrome-D1: running 155.0.8059.40`. Evidence/config/report root:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-hall-d1-46cf443edf7b49d59b877c4fc02b710c`.
`results.json` retains named source-model/native/facade receipts and PNGs.

| D1 required observation | Expected = observed |
|---|---|
| Empty, unscored, single | Honest zero/one-player state, 20 weekly/20 lifetime/1 turn; no invented history/opponents |
| Positive ties | 20/20/10/0 → 1/1/3/unranked; closed gold/gold/bronze; historical name/avatar snapshots unchanged |
| Full allowance | 600 weekly/620 lifetime/30 scoring turns; continuing lifetime/adventure copy |
| Historical omissions / retention | Rank3/bronze retained after deletion, omission notice and empty retained week; 52 archives versus 53 lifetime gold medals/older best |
| Clock / loading / failed / stale fixture | Actual selector rollback notice; prior rows/models retained, new closed result unconfirmed, pending control disabled |
| Keyboard/mouse/focus | Native activation, Enter into history, Escape/back, visible3px focus and initiating-control restoration; no model mutation |
| Readability/reflow | Ready M1 SVGs loaded, 18px default body, ≥44px controls, 200% text/36px body, 683px reflow and resize checks without horizontal overflow |
| Real native-IDB rollover / repeated opening | Held refresh retains20/40/1 and no archive; acknowledged week reset displays0/40/0 and old rank1/gold20; repeated open already-applied at same revision, one archive/medal |

Actual D1 rollover epoch **`7c869b02-7b28-4acc-a74f-f736302d342b`**, revision4→5;
closed week2026-10-05, active week2026-10-12. Native root, facade snapshot and
read model agree; repeated opening remains revision5/gold1. The personal-history
gold total and back/reopen routes pass. This is real fixture persistence, not
published-game evidence. The fixture failure state is distinct from previously
retained real-abort/conflict checks in other modes; no unperformed D1 error-flow
cross-product is claimed.

Inspected actual D1 acknowledged-closure and 200%-reflow PNGs: current versus
closed panels remain readable, scoring-turn copy wraps and required controls
are visible; no new visual finding. Source fingerprints remain exactly:

| File | Lowercase SHA-256 |
|---|---|
| HallOfChampions.tsx | `e857cdb2dc7e8ef3d8dc74f9e3c6ec879db783b095231bd86148a7388f0c6671` |
| PersonalHistory.tsx | `7912e2c933cfc0543d89cb6e369eafeeba3b14ca92f5628e5fdc6d814cd05cb7` |
| leaderboard.css | `3dc0d9136fe86709f27bf0ee1ce06a7d7ff3d467f2f32b17e3c37f195ab87989` |
| local-leaderboard.spec.ts | `5c795a3f2dd6d22e653715fd195932b55a38bd314507ad0e945b0dddc755b282` |

Only this handoff was edited in the repository. Private artifacts were written;
port5185 is released. No source finding, source mutation or new tests required.
Accepted T1/T2/D2 evidence was not repeated. Independently accepted Linux D3
smoke stays as recorded in `WP05-04A-VALIDATION.md` (run37884581632, Firefox157.0,
three Hall passes); it is not a new Windows Firefox claim. D1 is now ready for
the original validator's independent recheck and Controller's whole-child gate.
Final shell/full-game/published, physical tablet, child and acoustic acceptance
remain outside this evidence.
