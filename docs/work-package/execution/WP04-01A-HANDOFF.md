# WP04-01A implementation handoff

Implemented 9 October 2026 under GLOBAL_RULES current execution authority and
the assigned WP04-01A boundary, after release of DEP-005/006/007. Accepted inputs:
foundation, learning `700a50e`, rewards `279c911`, experience `85d3641`, their
actual DTO modules and concise handoffs. Controller retains independent
validation, administrative acceptance and integration/commits.

## Owned files and contracts

- `src/state/contracts.ts`: readonly JSON save/root/token, captured-profile
  command envelopes, six exhaustive result statuses, preferences/readiness,
  synchronous reducer/validator and facade/read ports. No database, controller,
  transition, decoder, queue, selector or audio implementation.
- `tests/state/contracts.test.ts`: chosen focused command/serialization fixture
  path. All 17 command kinds, four fresh-route families plus exclusive resume,
  four assistance tags, six results, complete household state, attributed reads,
  unavailable keys/content, permanent source completion after encounter
  compaction, callback readiness and compile-only forbidden consumer examples.
- This handoff only. No shared configuration/package/status changes, staging,
  commits, delegation or messages to other chats.

WP03 imports supply route/provenance, response/descriptor/judged evaluation,
encounter selection facts, evidence and canonical-history fields. EncounterSave
adapts SelectionEncounter: `taskContentRevision` replaces its contentRevision;
`learningEpisode` replaces its ordinal/status projection. Canonical history
stores pendingEncounterId instead of duplicating the encounter descriptor.
WP05 imports supply ProfileId, reward tracks/opportunities, eligibility, actual
deltas, slots/weeks, competition and personal records. WP02 imports supply
WorldProgress, CreativeState/CreativeChoice, milestone and restoration IDs.
Each domain is imported once; producer definitions are not redeclared or edited.
None of those domain DTO modules imports state or UI.

Episode fixtures retain encounter/opportunity identity, binding provenance,
cumulative Checks 1→2, original firstCheckCorrect=false and sticky hint use while
episode ordinals advance 1→2 and local counts restart. Finish has no new Check.
Saved lastCommittedCheck is one bounded actual evaluation/delta record; a new
partial draft and episode leave old feedback attributed to episode 1. Task
definitions stay in the supplied catalogue, outside portable save data.
Permanent world binding/quest sets remain independent of compactable encounters.

Defaults are exactly false/false/.25/.50 with separate unmuted music/effects;
profile narration=false, motion=system. Requested preference generations/status
remain separate from committed audio. The contract preserves synchronous WP02
gating before enqueue, immediate silence and current-generation callback checks.
The full audio intent/gate remains WP02-owned, not duplicated here.
Required StateControllerReadinessInput supplies a current synchronous getter;
getUpdateReadiness/flush sample it and fail closed on unavailable/throwing input.
No tab-selected profile is persisted.

## Export surface

- Save: ProfileId (re-export), NonnegativeSafeInteger, PositiveSafeInteger,
  SAVE_LIMITS, SaveToken, SaveDataV1, StoredRoot, CommittedSnapshot, ProfileSave,
  EncounterSave, SavedCanonicalLearningHistory, LearningEpisode,
  LastCheckIdentity, JudgedEvaluation, LastCommittedCheck.
- Commands/results: OpenEncounterPayload, RecordAssistancePayload, EmptyPayload,
  StateCommand, CommitChanges, StateReasonCode, StateReason, CommitResult,
  TransitionDecision, TransitionContext, ReduceCommand, ValidationIssue,
  ValidationResult, ValidateSave, LoadResult.
- Preferences/facade/read: AudioChannelPreferences,
  InstallationAudioPreferences, ProfilePreferences, INITIAL_AUDIO_PREFERENCES,
  INITIAL_PROFILE_PREFERENCES, AudioPreferencesPatch, PreferenceStatus,
  TransientReadiness, ReadTransientReadiness, StateControllerReadinessInput,
  UpdateReadiness, StateController, CommittedActivityProjection,
  ActivityProjectionResult, SelectCommittedActivity.

## Verification and limits

Bundled Node executable:
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
All checks passed, serially without shared compiler/test caches:

1. `node node_modules/typescript/bin/tsc -p <project> --composite false --incremental false --noEmit`
   for tsconfig.app.json, tsconfig.node.json and tsconfig.sw.json.
2. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/state/contracts.test.ts`
   including 21 expected-error examples and exhaustive result handling.
3. `node node_modules/vitest/vitest.mjs run tests/state/contracts.test.ts --no-cache --no-fsModuleCache --configLoader runner --maxWorkers 1 --no-file-parallelism`
   — one suite, 30 tests passed.
4. Owned-path Git whitespace check and explicit owned-file trailing-whitespace
   scan passed. Read-only Git calls use a command-only exact safe.directory;
   no global configuration changed.

Additional bounded reads of WP04-02A/03A/04A/05A aligned synchronous ports,
backup ownership/budgets, preference fields and current readiness semantics.
The outer backup format/export date remains WP04-03A-owned; SaveDataV1 follows
the specified concrete fields and contains no local token. Capacity constants
record the accepted 16-profile/16-MiB bounds rather than introducing extra saved
policy fields. Assistance tags are state command discriminators for WP03's
instruction, assessed-reading, hint and worked-support categories; approved
help IDs are required for hint/worked support.

No material package/interface defect found. Numeric aliases/opaque IDs remain
JSON number/string types compatible with producers: safe-integer/range/UUID,
cross-field, catalogue/binding/source and response checks are later runtime
validator responsibilities. Finite test probes demonstrate rejected mismatches,
unknown transfer source and cross-profile/expired lookup; they do not implement
or certify the real resolver/decoder. Fixture task approval is synthetic and
does not approve delivered educational content. No actual persistence, atomic
write, compaction, immediate playback cancellation, audible silence, browser or
integrated gameplay acceptance is claimed. Unrelated reward/reviewer/status/art
changes were preserved.
