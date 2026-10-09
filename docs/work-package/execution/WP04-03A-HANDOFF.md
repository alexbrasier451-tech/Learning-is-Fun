# WP04-03A implementation handoff

Implemented 9 October 2026 as sole author under current GLOBAL_RULES execution
authority, after the Controller accepted DEP-025/026/027/028: repository
`36560a51cb57d7bd1ef69c4242479462c78d32df`, scoring `8e351c7`, standings
`b9fa1cd`, starter catalogue `1f0ea93`. Controller retains independent
validation, administrative acceptance and commits. No shared contracts,
configuration, dependencies, producer modules, ledger or Git were changed.
No delegation or other-chat messages were performed.

## Delivered modules and exact ports

- `src/state/backup.ts`: original fixed-format explicit typed decoder, full-root
  pre-write validator, export/file adapters, private preview/confirmation pairing
  and controller export-readiness adapter. No schema framework or second writer.
- `src/state/migrations.ts`: `CURRENT_SAVE_VERSION = 1`; pure v1 identity only.
- `tests/state/backup.test.ts`, `tests/browser/backup-roundtrip.spec.ts` and
  unique `tests/fixtures/backup-*` entries: producer-driven logical saves and
  actual IndexedDB replacement/recovery observations. Focused browser config
  uses 5181, one worker and a fresh private temp cache/output/report root.

```ts
BackupEnvelopeV1 = { format: 'learning-is-fun-save', schemaVersion: 1,
  exportedAt: string, save: SaveDataV1 }
decodeBackup(text, catalogue): DecodeResult
decodeBackupFile(file: Pick<File, 'size' | 'text'>, catalogue): Promise<DecodeResult>
validateSave(candidate, catalogue): ValidationResult
exportBackup(snapshot, exportedAt, catalogue = listTasks()):
  { filename, json, byteLength }
measureBackupBudget(envelope): { byteLength, visitedValues, nesting }
prepareImport(envelope, currentSnapshot): ImportPreview
confirmPreparedImport(exactPreview, currentSnapshot): Confirmation
createImportSession(): { prepareImport, confirmImport, cancelImport, clear }
exportFromController(controller, exportedAt,
  mode = 'ordinary', catalogue = listTasks()): Promise<ControllerBackupExport>
migrateSupportedSave(envelope, targetContentVersion,
  catalogue = listTasks()): DecodeResult
```

`DecodeResult` is valid/envelope or invalid/unsupported plus typed path/code/
message issues. Validated saves/envelopes are fresh explicit records and deeply
frozen. Validator outputs conform to the accepted state-owned ValidationResult.
The first format registers contentVersion **`m1`** and rewardPolicyVersion
**`1`** (including competition/archive policy); these literals are exported
from the backup owner for facade initialization. Other versions require explicit
compatible registration. Exact approved retained task revisions may be supplied
through the catalogue argument; unknown identities are unsupported, never stripped.
M2 extends the content/binding/response compatibility path under WP04-07A.

ImportPreview exposes only preparedImportId, expected, exportedAt, profileNames
and profileCount. Only exact decoder-issued envelopes can prepare; weak private
pairings reject reconstructed previews. One facade-owned session retains at most
one preview. Cancel, clear/reload, reissue or consume invalidate it. Confirmation
returns ready/private preparedImport or conflict/expired and consumes once.
The ready value is the existing TransitionContext.preparedImport shape. The
facade handles explicit Replace by consuming its session ID, stopping audio,
allocating a fresh local UUID and calling **repository.replaceSave** with the
captured expected token and validatedSave. It must never send ReplaceSave through
commitCommand or create another durable import writer. A race after confirmation
still conflicts in the repository transaction; regenerate a preview against the
fresh snapshot before another explicit Replace.

The decoder/preview/migration/export paths obtain no clock, perform no durable
write and never reconcile calendar state. exportedAt is supplied explicitly.
Ordinary UI export should use exportFromController: flush then read only the
acknowledged snapshot when every readiness flag is clear. Failed/pending
preferences/commands or unsaved panel state return blocked with an explicit
last-committed recovery choice. The labelled recovery mode deliberately exports
only getSnapshot without claiming a successful flush. The low-level exportBackup
port is for an already acknowledged snapshot. Filename is returned for UI display;
manual transfer wording/text-only string rendering remain WP04-06A-owned.

## Limits and semantic ownership

UTF-8 <= **16 MiB**, profiles <= **16**, containers <= **32**, visited values
<= **250,000**, IDs/property names <= **160** characters, nickname **1–24**,
other text <= **4096**; fixed 20 skills/10 quests, 52 archived weeks. These use
the existing SAVE_LIMITS without altering contracts. File.size rejects before
text(); string decode repeats bytes and scans quoted/escaped JSON depth before
parse. Duplicate JSON members and dangerous names reject before parse. An
iterative object pass rejects non-JSON values, cycles, exotic objects, getters,
hidden/symbol properties and sparse/custom arrays; legitimate repeated immutable
input references are reconstructed independently. Pre-write validation budgets
the complete serialized envelope, including the fixed-length export timestamp.
The iterative pass also accumulates exact serialized JSON byte costs, rejecting
an oversized object before allocating its complete serialized output. Capacity
failures use capacity-exceeded and preserve the prior root. No truncation.

Every versioned DTO rejects extra/missing fields. Numeric safe-integer/range/date/
week/preference and identity/reference guards precede domain calls. Actual approved
task evaluators validate saved drafts and available last judged response/feedback.
The state layer joins encounter/episode/Check high-water, assistance, active and
retained completion evidence, canonical success history, provenance/permanent
world sets, quest receipts and creative availability/entitlements. All three M1
families (bridge, merchant, punctuation) execute through their real validators.

WP05 validateRewardState owns compact ordinal/receipt component exclusivity,
+5/+15/+5 contributions, once-only +20 quests, lifetime sums, entitlements and
opportunity/slot joins. validateCompetitionState owns 30-slot/600-point policy,
oldest-first archives, referenced profiles, authentic producer rank gaps after
deletion and available medal/best/lifetime lower bounds. Saved Check deltas can
include a joined quest receipt (+40 total, <=20 competitive); individual receipt
amounts must sum exactly and match the available identities/help/Check facts.
No authenticity guarantee is claimed.

Compaction does not require live completed encounter FKs or raw full event
history. The permanent story set uses only retained story-role binding IDs.
Completed quests require their nonempty required set and prerequisites; optional
transfers use the immutable singleton source definition + permanent completion,
including after source encounter/reward compaction. Unresolved encounter,
episode closure, cumulative Checks/help and opportunity remain mandatory.

## Fixtures and measured observations

backup-data.ts produces the two-profile save through actual selection/resolution,
family evaluation, learning observations, scoring/quest awards, reward compaction,
calendar reconciliation and ranking. Ada has lifetime **55**, active-week **15**,
one archived 20-point gold/best, Q1/permanent source completion, leaf scarf and
remembered audio/narration/motion choices. The source encounter is removed after
a real later review folds its 20 points. Transfer remains hinted, Check 1 false,
episode 1 completed-unsuccessful with finish ID, open reward opportunity and slot
2. Its source resolves after import without a source encounter/history pointer.
Ben remains a distinct complete profile. The sixteen-profile fixture copies these
producer facts with fresh household identities and uses actual tie ranking.

| Logical fixture | Serialized bytes | Values | Container depth |
|---|---:|---:|---:|
| Two profiles | 10,965 | 493 | 13 |
| Compact sixteen profiles | 158,201 | 6,769 | 13 |

These finite supported fixtures are not a worst-case/unlimited capacity claim.
Unit boundaries also accept exact 16-MiB JSON, 250,000 values, depth 32, ID 160,
nickname 24 and text 4096, then reject their next value. Rejections cover malformed,
truncated, UTF-8 oversize, depth/value capacity, unknown fields/references/version,
episode/reward/sum/aggregate/entitlement/archive and binding corruption.

Fresh actual finish -> resume -> correct uses the same transfer opportunity and
slot, episode 2 / cumulative Check 2, +5 lifetime/+5 competitive only. Lifetime
becomes 60/current 20; original firstCheckCorrect=false, sticky help and permanent
Q1 source remain. Learning records four Checks/four completions with one independent
success, two supported successes and one retry. No first-attempt renewal occurs.

## Executed checks

Bundled Node:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
Command-local NODE_DISABLE_COMPILE_CACHE=1, no tooling installation.

- Focused Vitest command uses run tests/state/backup.test.ts --no-cache
  --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism:
  **83 passed** after all authored decoder/fixture changes.
- Relevant producer regression (backup, scoring, standings, learning/evidence):
  **191 passed / 4 files**, final cache-free run at 02:29 BST, 1.30 seconds.
- Scoped strict ES2022/DOM/Bundler/noEmit check covers backup/migrations, both
  tests and all TypeScript backup fixture/config/teardown files; passed after
  the final decoder changes. No shared project build-info write.
- Actual Chromium/IDB suite: **5 passed**, one worker, 2.0 seconds, started
  `2026-10-09T01:17:07.213Z` (02:17 BST). Full paired roots/tokens/measurements:
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-78df65f75b424d0da0c5ed7d7f787a3b/results.json`.

The suite proves empty and populated whole replacement, exact logical save before
reconciliation, byte-identical re-export, close/reopen, fresh epoch/revision 0,
old-epoch rejection, cancellation, malformed decode preservation, in-transaction
concurrent revision conflict, reissued preview and seventeenth-profile pre-write
refusal. Separately committed resume advances October 12 -> October 19, archives
1 -> 2, same replacement epoch/revision 1. Original/import epochs respectively:

| Case | Original epoch | Imported epoch |
|---|---|---|
| Empty / two-profile | e77b746a-1cae-436c-b145-e40bcb7bb7cb | 1badb6fe-ac01-4e43-a366-094c1c29ad95 |
| Existing / two-profile | 411a9697-6ced-41e7-845a-6d47fda30cfe | e7f34a54-2d39-4d69-812b-b0c5ba096299 |
| Existing / compact sixteen | 71c95cd3-2e75-4b5d-a175-0a61496ec0d9 | 15e15646-4168-4939-8d08-0ecb83478fa0 |

Initial browser equality compared JSON property insertion order and falsely failed
three valid replacements; the independent deep-equality unit result and fixed DTO
ordering localized this to the fixture comparator. Replaced it with complete
structural equality; original three paths and whole focused suite passed. Initial
capacity fixture remapping accidentally rewrote selectionReason='transfer'; that
fixture defect was corrected before its passing capacity check. Production was
not relaxed for either fixture defect. The last completed browser run predates
the final additional retained-completion guards; those pass unit producer paths.
Controller subsequently instructed a browser hold to prevent HMR during the
repository owner's additive recovery change. No new browser run will start until
explicit release. The Controller has now released verification after the owner's
source freeze; the final scoped browser rerun is recorded below.

Additional pure producer controls accept unchecked free practice before the
first Check creates its reward counters and older hinted completion alongside
a later independent review's replacement canonical help facts. These prevent
an unnecessary producer write or a full-history assistance assumption. Browser
unsupported output is now named normalValidatedExportAvailable: that probe
tests only readExportSnapshot, not the separate additive raw recovery port.

## Persisted unsupported recovery and downstream composition

Pure unsupported input decoding/migration rejects without mutation and retains
the original supplied file for compatible recovery. The browser's future-root
probe replaces only its private test root's save.schemaVersion with 2. Repository
load reports unsupported; raw before/after root is identical after attempted load
and readExportSnapshot. **The accepted repository currently cannot export that
persisted unknown root through its validated readExportSnapshot.** Test-only raw
reads establish unchanged bytes, not a delivered production export port.

The Controller confirmed this producer gap and assigned an additive read-only raw
recovery port to the repository owner. This backup author implements no production
IDB reader and does not label unknown raw recovery data a validated v1 backup.
Persisted raw recovery-port acceptance and facade/UI composition remain with
their respective owners; the Controller will accept that refinement before the
facade starts. Stop-audio and explicit page activation/silence gates remain
facade/audio-owned: this decoder stores preferences but never activates playback.
Unit mocked readiness is not actual composed preference UI or audible evidence.
No published gameplay, power-loss simulation, M2 migration, broad build or final
chunk acceptance is claimed. Controller alone integrates, validates and commits.

## Post-release focused verification

After the first Controller release and source freeze, the complete five-case
Chromium/IDB suite passed again against all final decoder changes at
`2026-10-09T01:29:47.635Z` (02:29 BST), **5 passed, 0 skips/unexpected/flaky**,
2.3 seconds. Report:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-85819247efc34a6a89ad248c4115c827/results.json`.
The measured budgets remain exactly 10,965/493/13 and 158,201/6,769/13.
Empty, existing-two and existing-sixteen original/imported epochs respectively:
`2c67968f-915c-4d30-9dcb-8e3425b128e8` -> `8746c18e-01e7-4b5a-b7ac-42f24c3fb2e1`,
`93c2b4e2-c333-421e-91fd-5271e2b7d972` -> `93479d12-ab48-437d-b946-a21fae3ec329`,
`90599019-4865-450e-80a9-ff14967c7efc` -> `af6e5880-920d-4605-a31c-40f31fd281d3`.
Each imported revision is 0, later calendar-only revision 1. Cancellation,
rejected decode, capacity refusal and a post-confirmation peer commit all preserve
the corresponding raw root. Fresh reissue replaces under another new epoch.

The same final check call passed the strict scoped typecheck and 191-test relevant
unit set. Owned paths passed trailing-whitespace/conflict-marker inspection.
An additional expected-abort correction in the repository owner's new absent-
database recovery path then caused a second Controller browser hold; this run
had already completed. Its normal replacement/export results remain valid;
the final post-correction rerun followed the Controller's second explicit release
and is recorded below.

## Final author result — ready for independent review

Verified the Controller's frozen repository source before final browser execution:
SHA-256 `56df08e463414f54a4ee3915ad5f1fd4bfc3932197d2a03375b739d89d68e308`.
The final unchanged five-case backup suite passed at
`2026-10-09T01:31:48.426Z` (02:31 BST), **5 passed, no skipped/unexpected/flaky**,
2.3 seconds, port 5181/one worker/private output. Final report:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-a735f4b8a331460d9ef3f98a510e7ebe/results.json`.
The strict scoped typecheck passed again against that final repository source.
The final authored decoder/unit set remains **83 backup / 191 relevant tests**.
All owned files passed whitespace/conflict-marker inspection; no production or
fixture change followed this final browser result.

| Final case | Original epoch, revision 0 | Imported epoch, revision 0 (then calendar revision 1) |
|---|---|---|
| Empty / two-profile | 452d7b53-9d0a-4cf5-b128-2562d1c22951 | 85dbcfc9-721b-447e-a918-98a2fceebd7f |
| Existing / two-profile | 5024ed72-7af0-4f90-9579-5372b27cbca1 | 88f8bafb-7939-4572-81f7-cc5022fc9ef2 |
| Existing / compact sixteen | 507536b8-5849-4154-a988-0f0615a55a1f | df17c449-7761-4f9a-850c-93754ef6bee6 |

Final cancellation/rejection/race namespace ends
`backup-reject-71592ffc-e11d-48d8-b33c-fd2ed384c5ce`: epoch
`20f75c36-8ed9-4ade-9adf-a403c4116d05` advances only for the peer write from
revision 0 to 1; stale import and capacity failure preserve revision 1. A reissued
explicit Replace alone installs epoch `0cb28e2c-a57a-4ccc-ac00-5ed87f49f370`,
revision 0. Final unsupported probe namespace ends
`backup-future-aaf82e37-7a71-4275-a01e-06a6f40fb0ad`; before/after future root
matches exactly and normal validated export remains refused. This does not test
or reject the repository owner's separate raw recovery export method. The
Controller reported that additive method fixed/frozen with 44 passing owner
checks and one existing WebKit CDP skip; its independent acceptance is separate
and pending. No additional browser hold or author-owned failure remains.

## Independent decoder findings F01/F02 — corrected author result

The independent review in `WP04-03A-VALIDATION.md` supersedes the earlier author
readiness claim. The review report and its original private evidence remain
unchanged. Both reported complete IDB flows were rerun before the correction by
copying the independent scripts to a fresh private output directory and changing
only their output destination:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-correction-before-a2057ddade424f7e94bf7216e33c112f`.
Its `results.json` and `continuation-results.json` reproduce the two findings.

F01: two distinct hinted successes from the actual learning/reward producers
have 2 correct Checks, 0 independent successes, 2 supported successes, 1 later
distinct success and 20 lifetime/current points. Reward and competition checks
accept those facts, but the previous decoder aggregate bound rejected them,
blocking export, identity migration and the authoritative repository write.
The causal decoder bound now permits later-distinct successes up to total
successes minus the required first success. It does not assume independent
success or retention of the first successful ID in the bounded recent window.

F02: changing only the suspended wrong episode's active-evidence
`firstCheckCorrect` to true previously passed decoding/replacement. Actual correct
Check 2 then awarded +5 but the learning producer returned unchanged evidence;
the next authoritative write was invalid. The active-evidence join now requires
the immutable first-Check fact to match its encounter. Assistance still uses the
existing containment join so legitimate later help remains allowed.

Only these two predicates in `src/state/backup.ts` change production behavior.
No repository, producer, shared contract/configuration or migration code was
changed for the correction. The new owned
`tests/fixtures/backup-learning-regressions.ts` derives its evidence and reward
counters from the actual accepted producers. Ten regression cases cover the
original inputs, mixed hinted/independent success variants, compacted encounters,
hinted/unhinted valid suspended continuations, the exact one-field corruption,
and a fresh case with the prior successful ID evicted by four later completions.
Before the production correction those focused cases reported **3 failures / 7
passes**; afterward they report **10 passes**. The complete relevant unit set
now reports **93 backup / 201 total passing tests**, and strict scoped TypeScript
checking passes including both new browser regressions.

Browser integration was held at the Controller's request while the repository
owner corrected a separately identified pending-open recovery defect. No new
integration run started during that hold. The Controller explicitly released
port 5181 after production edits finished. Before and after the correction runs,
the frozen `src/state/repository.ts` SHA-256 matched
`9f024213d5a381e300e3d3f24876b126756e81ca43eb805ee19ed6c7b5dbfa90`.

The original F01 save/export/migrate/import and F02 rejection/valid Check-2
continuation paths both passed at `2026-10-09T01:56:46.927Z` (02:56 BST):
**2 passed, 0 skipped/unexpected/flaky**, private report
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-88df7e59a5ef4dd696926080cd0079bf/results.json`.
The complete relevant browser suite then passed at
`2026-10-09T01:56:55.403Z` (02:56 BST): **7 passed, 0
skipped/unexpected/flaky**, 2.6 seconds, one Chromium worker, private report
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-088cd00c2a0249e99665c1b5c477db71/results.json`.
The report embeds paired logical roots, local tokens and producer evidence in
named JSON attachments; the two new attachments are
`F01-producer-decoder-writer-roundtrip` and
`F02-import-rejection-and-continuation`.

In the final full run, F01 committed the actual second hinted success under epoch
`6c2b93e8-e8a4-409e-ac43-946d7cc6d4e7`, revision 0 -> 1, preserving all producer
facts. Export, decode, v1 identity migration and compacted validation succeeded;
explicit replacement installed the identical logical save under new epoch
`1e2ff6db-ab31-4199-8035-bf4aeb1b94c3`, revision 0. All five assistance variants
and the fresh evicted-prior-success case passed.

F02's exact one-field corruption was invalid before preview and also refused by
the authoritative replacement writer. Epoch
`b2efd08d-0a0d-414d-83fc-2f836d48618e`, revision 0 and its complete logical root
remained unchanged. The valid hinted and unhinted controls imported under epochs
`32a8de9f-70cb-4e8f-9506-3379bd14e82e` and
`19227818-d10f-4138-b023-05e4e4bd82af`. Actual correct Check 2 advanced learning,
awarded +5 lifetime/current points without another slot, validated and committed
under the same imported epochs from revision 0 -> 1.

Final strict scoped TypeScript checking and owned whitespace/conflict-marker
inspection passed. No decoder or fixture change followed these browser results.
The verification wrapper stopped its server; an explicit listener check found
**zero listeners on port 5181**, which is released for independent review.
The Controller reported 53 passing repository-owner checks and one existing
WebKit CDP skip, and 17 independent pure correction checks; those are separate
owner/reviewer evidence, not additional author test claims. Independent browser
revalidation and final acceptance remain with the Controller/reviewer. This
worker has made no Git mutations or completion/acceptance ledger edits.

## Controller integration type boundary correction

The Controller's shared Node-project check exposed an author-owned test boundary
error after the browser handoff. The Node spec imported the browser fixture's
function types directly; TypeScript consequently traversed the fixture and its
repository implementation without DOM libraries. The exact shared check was
reproduced before editing and failed on 14 DOM-related diagnostics.

`tests/browser/backup-roundtrip.spec.ts` now imports the erased structural
`BackupFixture` type from the new pure type-only
`tests/fixtures/backup-roundtrip-api.ts`, following the existing repository
fixture API pattern. The new file imports only shared DTO types. No shared
configuration, production code, browser fixture runtime or test assertion was
changed; the independent IDB recheck can continue against its frozen runtime.

With `NODE_DISABLE_COMPILE_CACHE=1`, the bundled Node invocation of
`node_modules/typescript/bin/tsc -p tsconfig.node.json --composite false
--incremental false --noEmit` now passes. Strict focused DOM-enabled fixture/spec
typing also passes, including an explicit structural assignment of the actual
browser implementation to `BackupFixture`. That compile-only probe is preserved
at
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-backup-types-4135d721dcde41848c37c6000afb7fe3/boundary.ts`.
No runtime rerun was required or started for this erased type correction. The
201-unit/7-browser results above remain the latest runtime evidence; independent
review and acceptance remain with the Controller.
