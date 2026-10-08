# WP05-01A independent implementation validation

Review began 8 October 2026. Reviewer: Codex, independent validator; not the implementation author on this scope.

**Verdict: ACCEPTED. Finding severity: NONE. Invalidated criteria: NONE.** Acceptance is limited to the early reward contracts and date-only calendar. Controller owns administrative acceptance and dependency release.

## Authority and scope

Read the current execution authority in [GLOBAL_RULES](../GLOBAL_RULES.md), [WP05-01A](../chunks/WP05-01A.md), its named decisions in [DECISIONS](../DECISIONS.md) (including DEC-030/032), the [implementation handoff](WP05-01A-HANDOFF.md), current source and the complete focused fixture suite. The accepted learning handoff is committed at `700a50e8cc9a25e0f65729671ee850dea95ba8fe`, current HEAD during this review. Reward implementation files are currently uncommitted/untracked.

Inspected the relevant consuming specifications in WP05-02A/03A/04A, WP04-01A/04A and WP03-04A to check imported field meanings and the reserved reconciliation port. These specifications inform the producer; their later runtime implementations are not prerequisites. This validator writes only this report and preserves unrelated Controller changes.

## Acceptance assessment

| Criterion / contract | Independent conclusion |
|---|---|
| Import direction / DEC-017/022 | PASS. `contracts.ts` imports only learning types; `calendar.ts` imports only local reward date types. No state, experience, facade, storage, UI or scoring implementation is imported. The reward domain remains directly usable by later save/experience authors after the accepted learning handoff. |
| Reward identities, components and compaction / DEC-010/011/024/025 | PASS. Canonical, encounter, opportunity and submission fields are separate. Selected candidates preserve learning's vocabulary while reward reasons use the accepted adapter vocabulary. Opportunities retain ordinal, unbound/bound week and slot, valid Checks, sticky help and actual-success facts. Components require the answer component before either success bonus and exclude simultaneous success bonuses. Receipts pin answer/independent/supported/quest amounts to 5/15/5/20; slots are the union 1–30. Tracks express allocation/completion high-water marks, exact compacted totals, unfinished free-practice contamination and retained opportunities. Episode ordinals do not enter reward keys. Cross-field validation and durable replay remain with their assigned later owners. |
| EligibilityResult / DEC-032 | PASS. Exact kind/reason pairs are exported: eligible-first/first-encounter, eligible-review/selected-due-review, resume-existing/unfinished-opportunity, and practice-only with the five specified reasons. Classification carries no score or promise of a competitive slot. WP04 can import it directly into the committed activity projection without maintaining a second classification schema. |
| Reconciliation and personal records / DEC-012/030 | PASS. `ReconciliationInput` contains competition and profiles including personal records. `ReconciliationResult` requires next competition, **nextPersonalRecordsByProfile**, one observed calendar context and closed-week presentation changes. `ReconcileCompetitionWeek` is a function type with the exact explicit-time input; no successful no-op closure is exported. `PersonalRecords` uses nullable best plus cumulative medal counts; both reconciliation and leaderboard records are per-profile maps, independent of retained archives. First-run null week, rollback notice, late lifetime-only success and deletion-preserved ranks are expressible. |
| RewardCheckInput/Result and read model | PASS. The check port imports a judged learning evaluation and assistance, preserves submission/cumulative sequence and stored pre-Check counts, and returns replacement reward/competition data plus an internally computed delta. Null track/token can represent initial free practice. The leaderboard carries the specified local scope, active London week/label, optional notice, profile totals/slots/rank, immutable recent results and per-profile records. These are construction ports and data, not implemented award/closure outcomes. |
| London date extraction | PASS. `localDateAt` validates finite supported epochs, explicitly requests en-GB/Europe/London/gregory/latn numeric parts and checks resolved settings. Its extra era part prevents BCE instants being read as positive years. It passes the supplied epoch to `formatToParts`, without ambient time or localized-string parsing. Unsupported formatting/zone failures are typed `CalendarError` failures; another host zone is never substituted. |
| Date-only arithmetic, validation and week bounds | PASS. `weekKeyFor` returns Monday's civil date; `addCalendarDays` uses a UTC civil-date carrier rather than elapsed London hours. Round-trip year/month/day checks reject nonexistent dates instead of rolling them over. `setUTCFullYear` avoids the year-0–99 constructor shortcut. Exact YYYY-MM-DD, AD years 0001–9999, safe-integer offsets and out-of-range arithmetic have explicit validation/failure behavior. Date-only helpers require no Intl timezone support themselves. |
| Fixtures and evidence boundary | PASS. Serialized imported fixtures cover nullable pre-Check fields, help/attempt retention, same canonical later-review identity, compaction, distinct tokens, late success, rollback, rank gaps and independent personal records. Negative type examples cover eligibility reasons, component amounts/exclusivity, slot bounds and mandatory reconciliation records. They are clearly labelled construction fixtures, not validators, executed scoring or elapsed-week evidence. |

The native-part extraction choice agrees with the retained [Intl formatToParts reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts). The implementation supplies explicit time and interprets typed numeric date components. Reused the retained date-library exclusion; no Luxon/library assessment was repeated. The 2026 DST fixture dates independently agree with [GOV.UK clock-change dates](https://www.gov.uk/when-do-the-clocks-change): 29 March and 25 October.

## Independent verification

Used bundled Node 24 at `C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

- Fresh `node node_modules/vitest/vitest.mjs run tests/rewards/calendar-date.test.ts` — **1 suite, 86 tests passed**. This includes actual child processes in America/Los_Angeles and Asia/Tokyo, with summer host offsets asserted as 420 and -540 minutes, identical London outputs for eleven supplied instants and identical civil-day additions.
- Fresh `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/rewards/calendar-date.test.ts` — **exit 0**, including negative type examples.
- Reused the handoff's successful application/Node/worker project typechecks. Independently inspected the complete source and focused examples; no broader application or future archive/scoring suite was needed.
- Fresh trailing-whitespace scan of the two source files and focused test file — **zero offending lines**. Final status inspection preserves unrelated changes; no source/configuration/shared-status mutation or commit was made by this validator.

Selected literal expectations were inspected against the intended calendar, not derived by calling the helper as its own oracle:

| Controlled input | Expected / observed output |
|---|---|
| UTC 2026-07-05 22:59:59.999 → 23:00:00 | London Sunday 2026-07-05 / Monday key 2026-06-29 → Monday 2026-07-06 / key 2026-07-06 |
| UTC 2026-01-04 23:59:59.999 → 2026-01-05 00:00:00 | London Sunday 2026-01-04 / key 2025-12-29 → Monday 2026-01-05 / same Monday key |
| Civil 2026-03-27 +3 / +7 days | 2026-03-30 / 2026-04-03 across spring DST |
| Civil 2026-10-23 +3 / +7 days | 2026-10-26 / 2026-10-30 across autumn DST |
| Civil 2000-02-28 +1 versus 1900-02-28 +1 | 2000-02-29 versus 1900-03-01, correct Gregorian century behavior |
| Invalid date, epoch, day offset, supported-range overflow or unavailable explicit zone | Typed failure; no rollover date or host-zone fallback |

Reviewed lowercase SHA-256 snapshots:

| File | SHA-256 |
|---|---|
| `src/rewards/contracts.ts` | `5b5aefc144debe284bc5b89410dda615f94b4aab9f55d761cb8d0bb1ab4d8e8d` |
| `src/rewards/calendar.ts` | `b1cb58b56a4bd95d4d185ee740990e1a500277f838c25cc726b6bf5251586fc2` |
| `tests/rewards/calendar-date.test.ts` | `9b3a1c4f387a15282d2251a9eb87ea1099a9ef198477cb86792c9acd3c69125e` |

WP05-02A retains classification/scoring/reward-validation implementation; WP05-03A retains serial extension of calendar reconciliation, closure/ranks/retention and competition validation; WP04 retains durable validation, replay and atomic application of both returned state surfaces. Browser/device acceptance and published play remain downstream. This early acceptance waives none of those responsibilities.
