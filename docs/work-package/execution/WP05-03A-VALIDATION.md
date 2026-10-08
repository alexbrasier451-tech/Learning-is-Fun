# WP05-03A independent implementation validation

Reviewed on 9 October 2026 by an independent validator with no authorship in the reviewed implementation.

**Verdict: ACCEPTED. Open findings: NONE. Invalidated criteria: NONE.** Both historical P2 validator findings were resolved and independently rechecked on 9 October 2026. Acceptance covers this child's pure policy and validation scope; Controller owns administrative acceptance, dependency release and integration.

## Authority and scope

Read the current execution authority in [GLOBAL_RULES](../GLOBAL_RULES.md), the exact [WP05-03A child](../chunks/WP05-03A.md), DEC-012/013/030 in [DECISIONS](../DECISIONS.md), the accepted reward/calendar contracts and [WP05-01A validation](WP05-01A-VALIDATION.md), actual `src/rewards/calendar.ts` and `src/rewards/standings.ts`, all three named reward test files, and the [implementation handoff](WP05-03A-HANDOFF.md).

Additionally inspected the relevant aggregate/archive validation clauses in [WP04-03A](../chunks/WP04-03A.md) to distinguish the producer's invariant responsibility from downstream JSON/schema validation. Those clauses require bounds and available provenance while allowing intentionally discarded history; they do not authorize invented or internally impossible retained facts.

Compared the calendar/date-test changes with accepted commit `279c911`. The existing date/error declarations and helper bodies are unchanged; calendar changes comprise the planned reward imports and appended reconciliation function. Reward contracts are unchanged. The authorized date-test harness adaptation resolves only the two new extensionless reward imports and replaces the obsolete no-closure source guard. Original date assertions, host-offset assertions, DTO examples and negative type fixtures remain.

This validator wrote only this report. No product, test, contract, shared-package or status edits, staging, commits, delegation or chat messages were performed. Unrelated Controller changes were preserved.

## Historical findings — resolved

The following records the initial implementation's failures and the requested corrections. The original evidence is preserved; neither finding remains open. The affected recheck and corrected outcomes follow below.

### F1 — P2: Reject an impossible omitted rank at the maximum weekly score

**File:** `src/rewards/standings.ts:283` (omission-marked archive rank validation).

**Criteria:** WP05-03A P5-G and its current/closed rank-and-aggregate invariant requirement; DEC-012 shared competition ranks; accepted weekly score cap of 600.

The omission branch permits a positive offset above the retained competition rank without checking whether any strictly higher score could exist. A single retained entry with **600 points, rank 2, silver**, in an omission-marked archive, returns no validation issues when the profile's best and medal aggregate match that entry. Rank 2 requires a higher-scoring original participant. No such participant can exist under the 600-point cap. Deleting a tied 600-point participant would leave the survivor at rank 1 with gold.

This is a concrete consistency failure using facts already available to the validator, rather than a request to reconstruct deleted identities. Downstream JSON field/range validation cannot catch it: the fields separately satisfy their ranges. The Hall can consequently expose an impossible historical silver result that this domain gate has accepted.

Required repair: report an invariant issue for this impossible rank/score combination while retaining legitimate deletion gaps. Do not rerank an imported archive or issue replacement medals. Add a focused negative fixture alongside the existing omitted-gap fixtures.

### F2 — P2: Require best-week provenance when its date lies inside the retained window

**File:** `src/rewards/standings.ts:326` (personal-best available provenance).

**Criteria:** WP05-03A P5-G and its retained aggregate/backup invariant requirement; latest 52 participating archives with personal records independent of expiry; WP04-03A available aggregate provenance.

The matching-result check runs only when an archive already has `best.week`. With retained archives for **2026-09-21** and **2026-10-05**, both containing this profile at 5 points, a best of **20 points in 2026-09-28** is accepted even though that week is absent. The best lies between retained weeks. A positive best would have made its week participating; keeping a still-older archive means that best week could not have expired from the newest-52 window. Deletion cannot explain it for a surviving profile: deletion removes that identity and its personal records, and emptied archives remain in the window.

The current conditional therefore mistakes a missing required archive for unavailable discarded history. It allows an inconsistent personal-record week/score into the read model. An actual best older than the oldest retained archive remains legitimate and must continue to pass.

Required repair: when a best week is within the dates covered by retained history, require its matching positive profile result, even if the archive for that week is missing. Preserve the existing allowance for a best older than the retained window. Add the missing-middle-week rejection and an older-expired-best acceptance control.

## Original independent counterexample evidence

Ran a direct Node import of the actual modules, using the same narrowly bounded extensionless-source resolver as the date harness. No temporary source/test file was written. Common data: profile `p1`, nickname `Ada`, avatar `avatar-1`, lifetime points 2000; Europe/London, policy version `1`, active week `2026-10-12`, empty current scores/slots. All archive rows snapshot that same identity.

| Probe | Exact distinguishing facts | Expected | Observed |
|---|---|---|---|
| F1 | One archive `2026-10-05`, `omittedDeletedProfiles: true`, one row `{ points: 600, rank: 2, medal: 'silver' }`; best `{ points: 600, week: '2026-10-05' }`; medals `{ gold: 0, silver: 1, bronze: 0 }` | An inconsistent-rank issue | `[]` |
| F2 | Two ordinary archives `2026-09-21` and `2026-10-05`, each one row `{ points: 5, rank: 1, medal: 'gold' }`; best `{ points: 20, week: '2026-09-28' }`; medals `{ gold: 3, silver: 0, bronze: 0 }` | A missing-best-provenance issue | `[]` |
| Older-best control | Same two archives and medal totals as F2; best `{ points: 20, week: '2026-09-14' }` | Accept unavailable older history | `[]` |

These probes isolate `validateCompetitionState(competition, profiles)` and use otherwise valid bounded DTOs. They require no live clock, storage, scoring engine or broader game acceptance.

## Affected independent recheck — 9 October 2026

Inspected the corrected validation guards, the three added F1/F2 tests and their controls, and the author's updated handoff. Reused the unaffected source review, original 151-check evidence and contract/date-helper comparison. The changes remain confined to the two causal validator conditions and focused fixtures.

- **F1 resolved**, `src/rewards/standings.ts:289`: a 600-point archived participant must retain rank 1, including in omission-marked history. This rejects the impossible result without changing stored ranks or medals. The controls accept a remaining 600-point gold winner after tied-profile deletion and a 595-point rank-2 silver survivor whose higher-scoring winner could have been deleted.
- **F2 resolved**, `src/rewards/standings.ts:329`: if any valid retained week is at or before the best date, a matching profile/week/points result is required. A missing middle week or a missing closed best week after the newest displayed result is rejected. A best earlier than every retained week remains valid. Existing matching-best and original deletion-gap fixtures still pass.

Independently reran the exact original direct probes against the actual corrected module. Corrected outcomes were:

| Probe | Expected / observed |
|---|---|
| Original F1 | One `inconsistent` issue at `competition.archives[0].entries[0].rank`: `A maximum-score participant must retain rank 1, including after deletion` |
| Original F2 | One `inconsistent` issue at `profiles.p1.personalRecords.best`: `Best inside the retained date window must contain the matching original result` |
| Original older-best control | `[]`; older unavailable history remains valid |

Fresh `node node_modules/vitest/vitest.mjs run tests/rewards/standings.test.ts -t 'F1|F2|original gaps after omission|available best/medal/lifetime'` — **5 passed, 44 skipped**, exit 0. This includes the exact negatives, unchanged frozen inputs, maximum-score/deleted-winner controls, original legitimate gaps, older-best allowance and the fresh missing-best week after the displayed range.

Reused the updated handoff's complete **154 reward/date checks** and successful strict source/fixture typecheck. The author's retained red-before/green-after evidence agrees with the independent original failures and corrected direct probes. No broad acceptance or unrelated suite was added for this bounded recheck. No remaining concrete deficiency was found in the affected scope.

## Acceptance assessment

| Contract / criterion | Independent conclusion |
|---|---|
| P5-E London rollover | PASS for this child's pure boundary. First run opens the observed London week. Summer/winter Sunday-to-Monday and both DST transition weeks close only the prior active week; current maps clear and the actual observed week opens. Multiweek absence creates one prior participating result and no skipped archives. Supplied lifetime points remain unchanged. |
| Once-only closure | PASS with the accepted atomic-output contract. Applying both returned competition and per-profile records, then replaying the same instant, yields no new archive, medal or best change. Archived weeks must precede the active week. `closeWeek` is a pure projection; committing only its record surface is not the specified integration path. |
| P5-F rollback and late-success context | PASS for this child's boundary. Earlier observed weeks retain latest active week, scores, slots and records, return rollback context/notice, and recovery does not replay medals. The late-success fixture supplies the old earning/new active-week context without changing archives or consuming a new slot. Actual lifetime remainder and action/storage integration remain WP05-02A/WP04-04A responsibilities. |
| P5-G ranking and positive medals | PASS. 20/20/10/0 yields 1/1/3/unranked and gold/gold/bronze/none. Nickname then immutable ID controls only display order. Nonmedallists can improve a best without receiving a medal; equal best retains the original week and unchanged record references. |
| Archive and record retention | PASS for generated outcomes. The 53rd participating closure keeps the newest 52 archives while the expired 20-point best and 53 gold medals survive per profile. Omission-emptied weeks remain in the same window and expire at its boundary. Empty intervening weeks do not consume retention or invent champions. |
| Rename and deletion | PASS. Historical identity snapshots survive rename. Target deletion removes current scores/slots, archive identity entries and personal records; affected archives gain omission flags. Surviving historical ranks, medals, bests and record references remain unchanged. Empty marked history survives, and repeated/absent deletion is inert. |
| Exact interfaces and read models | PASS. Accepted domain DTOs are imported rather than redeclared; reconciliation has the accepted explicit epoch signature and mandatory per-profile records. Current/lifetime points, used slots, nullable provisional rank, browser-local scope, London date range, newest-first history and rollback notice are exposed without awards. Empty/single-profile boards have no synthetic opponents. |
| Domain validator | PASS after the affected recheck. Existing fixtures exercise references, safe counters, capacity, ordered unique slots and sum/cap rules, Monday/date/order/retention constraints, positive scores, original ties/gaps/medals, aggregate lower bounds and malformed JSON shapes. F1/F2 now reject impossible maximum-score ranks and missing best provenance inside retained dates while preserving legitimate gaps and older records. Full schema/text/ID/version/catalogue validation and opportunity/receipt joins remain downstream. |
| Scope and proportionality | PASS. Two pure policy modules and bounded focused fixtures implement the planned slice. No storage, ambient clock read, network request, UI, scoring engine or new dependency was added. Existing date helpers and contracts remain intact. Repeated trigger-name cases demonstrate the common pure port, not actual facade lifecycle calls; the handoff correctly keeps those later acceptance obligations separate. |

## Initial independent verification — retained

Used bundled Node at `C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

- Fresh `node node_modules/vitest/vitest.mjs run tests/rewards/calendar.test.ts tests/rewards/standings.test.ts tests/rewards/calendar-date.test.ts` — **3 suites, 151 tests passed**, including the 86 retained date/DTO checks and actual differing-host-zone child processes.
- Fresh `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --verbatimModuleSyntax --types node src/rewards/calendar.ts src/rewards/standings.ts tests/rewards/calendar.test.ts tests/rewards/standings.test.ts tests/rewards/calendar-date.test.ts` — **exit 0**, with no project build-info output.
- Fresh direct validator probes — reproduced F1 and F2 as empty issue arrays; older-best control also passed.
- Read-only comparison to `279c911` — date/error helper bodies and reward contracts unchanged; date-test adaptation matches its narrow authorization.
- Scoped `git diff --check -- src/rewards/calendar.ts tests/rewards/calendar-date.test.ts` — **exit 0**. Reused the handoff's owned-file whitespace evidence for untracked implementation/test files.

No broad game regression, browser/UI, real elapsed-week, atomic-store or published-play acceptance was run or claimed. The affected recheck above closes both historical findings. WP05-03A is accepted within its specified pure-module boundary; downstream lifecycle, scoring and atomic-store acceptance remains required from its named owners.
