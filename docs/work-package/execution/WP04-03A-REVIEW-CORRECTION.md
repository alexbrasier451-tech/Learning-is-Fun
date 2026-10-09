# WP04-03A same-week educational review correction

Author correction, 9 October 2026. Ready for the original independent backup
reviewer; Controller retains acceptance and integration authority.

Read the selector integration correction, its independent validation and the
facade handoff before editing. The Controller explicitly confirmed that port
5182's browser runs had finished, no browser/unit run remained active, and the
narrow decoder mutation was authorized. Production edits began only after that
confirmation. The facade remains responsible for its native persistence/browser
rerun after source release.

## Earliest divergence and narrow fix

Original case: clean Q1 total-12 independent success Monday **2026-10-05**, genuine
due review Thursday **2026-10-08**, SubmitCheck `[6,6]`.

| Checkpoint | Before correction |
|---|---|
| Initial Q1 success/history | Correct canonical identity, success week 2026-10-05; review due 2026-10-08 |
| Suggested review selection/open | Actual successful total-12, due-review, familiar=true, real reference; null opportunity, practice-only eligibility; root committed |
| Learning/reward producers on successful review | Completed episode in week 2026-10-05; zero lifetime/competitive delta and no new slot |
| Full-root completed-episode decoder | **First divergence:** strict previous-success-week inequality rejected equality with `Completed review provenance has a mismatched identity/week.` |
| Facade acknowledgement | Invalid-save; candidate not committed |

`src/state/backup.ts` changes only the completed educational episode condition
from `previousSuccessWeek < competitionWeekId` to
`previousSuccessWeek <= competitionWeekId`, with a short explanatory comment.
Canonical identity must still match, and future success weeks remain invalid.
The separate reward opportunity validator still requires a strictly earlier
success week for a rewarded later-week review. No learning selector, facade,
reward producer, shared DTO or configuration compensation was made.

## Original full flow and focused variants

Seven new cases in `tests/state/backup.test.ts` use actual `createStateController`,
`reduceCommand`, selection, learning/reward producers, full-root validation,
ordinary flushed facade export and `decodeBackup`. The isolated in-memory
repository port checks every proposed save before acknowledging it. No alternate
validator, normalized producer fact or manufactured evidence counter is used.
These tests prove the complete facade/save/export/decode path; they do not claim
IndexedDB durability or browser reload.

| Case | Corrected result |
|---|---|
| Exact Monday → Thursday independent review | Commits; null opportunity/practice-only; +0 lifetime/+0 competitive/no slot; real same-week reference retained; 2 Checks, 2 completed episodes, 2 independent successes; flushed export/decode equals acknowledged save; v1 identity migration valid |
| Same exact dates, hinted review | Commits supported completion with zero award; 1 independent/1 supported success; export/decode and identity migration valid |
| Same exact dates, wrong Check then FinishPractice | Both commit; unsuccessful educational completion retains real reference; zero award; export/decode and identity migration valid |
| Fresh Monday → Friday review | Same-week completion/export/decode valid; zero award |
| Rollback: 12 Oct success → 15 Oct review opens → Check observed 8 Oct | Retained competition week 12 Oct; real prior-success week 12 Oct; observed date 8 Oct retained; completion/export/decode valid; zero award |
| 5 Oct success → 12 Oct review | Existing eligible later-week review still commits +20 lifetime/+20 competitive and exports/decodes |
| Corrupted completed reference / rewarded opportunity | Different canonical or future previous-success week rejected with original provenance message; same-week rewarded review opportunity remains invalid; acknowledged root unchanged by pure corrupt-input checks |

The three exact-date zero-award cases preserve competition state, lifetime total
and quest receipts. Learning completion advances without another question or
quest award. No change to the F01/F02 predicates or accepted fixtures was needed.

## Verification

All commands use the bundled Node executable, process-local
`NODE_DISABLE_COMPILE_CACHE=1`, disabled Vitest caches and one worker. No shared
compiler cache, broad build, browser server or dependency installation was used.

Before production mutation:

```text
vitest run tests/state/transition.test.ts -t 'Monday success'
  --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
```

**1 failed / 14 skipped**, reproducing the exact reported invalid-save message.
The new seven-case backup group also ran before mutation: **6 failed / 1 passed /
93 skipped**. The existing later-week rewarded case passed; the same-week
completion-dependent cases failed at the causal guard.

After mutation, the complete original facade/save/export/decode path and its
focused variants reported **7 passed / 93 skipped**. Then the relevant complete
regression command:

```text
vitest run tests/state/backup.test.ts tests/state/transition.test.ts
  tests/rewards/scoring.test.ts tests/rewards/standings.test.ts tests/learning/evidence.test.ts
  --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism
```

reported **5 files / 223 tests passed**, no skips, at 03:34 BST. This includes all
**100 backup tests** and all **15 transition tests**, including the original
desired-behavior Monday-to-Thursday case. Strict scoped ES2022 TypeScript checking
of `src/state/backup.ts` and `tests/state/backup.test.ts`, with Node and DOM types,
also passed. The exact three-owned-path whitespace/conflict-marker scan passed.

The selector owner's separate test named `retains the separate decoder
counterexample: same-week educational review opens but completion is rejected`
is now stale by design and must be updated by that original owner. This worker
did not change it or count its earlier passing rejection as successful completion.
The full selection suite was not rerun while that known characterization remained.

## Stable source and scope

| File | Final SHA-256 |
|---|---|
| `src/state/backup.ts` | `ec0982f16b1a3336553c3524af1160b5174d2bf7e5cea775007f6c61525721bf` |
| `tests/state/backup.test.ts` | `8de5a2f0d8cb23bb34950b01d07c3ef2fdac373cacf7d5d6df5ab70880b20c02` |

The production source is stable; no further mutation or dependent run is active.
Only the two owned source/test paths and this newly assigned report were edited.
No other owner's files, shared status/dependency/acceptance ledger, Git state,
delegation or other-chat messages were changed. No native browser/IDB rerun or
independent acceptance is claimed here. The original backup reviewer recheck,
selector-owner characterization update and facade browser release remain with
their owners under Controller coordination.
