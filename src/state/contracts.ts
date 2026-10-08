import type {
  ActivityBindingProvenance, ActivityResponse, BindingResolution, CanonicalLearningHistory,
  EvaluationResult, LearningRouteIntent, QuestActivityBinding, SelectionEncounter,
  SkillEvidence, TaskDefinition,
} from '../learning/contracts';
import type {
  CompetitionState, CompetitiveSlot, EligibilityResult, PersonalRecords, ProfileId,
  RewardOpportunity, RewardState, ScoreDelta, WeekKey,
} from '../rewards/contracts';
import type { CreativeChoice, CreativeState, Milestone, WorldProgress, WorldResultId } from '../experience/types';

export type { ProfileId };

/** JSON numbers; validators require finite safe integers with the stated lower
 * bound. IDs are opaque strings, allocated once using crypto.randomUUID() by
 * the facade, bounded to 160 characters on decode. These aliases do not validate. */
export type NonnegativeSafeInteger = number;
export type PositiveSafeInteger = number;
export type SaveToken = Readonly<{ epoch: string; revision: NonnegativeSafeInteger }>;

/** Structural IndexedDB v1 is independent of portable/content/policy versions.
 * Only repository.ts opens `${appNamespace}:save`, records, root. */
export const SAVE_LIMITS = {
  profiles: 16, backupBytes: 16 * 1024 * 1024, nesting: 32, visitedValues: 250_000,
  idCharacters: 160, nicknameCharacters: 24, textCharacters: 4096, archivedWeeks: 52,
} as const;

export type AudioChannelPreferences = Readonly<{ muted: boolean; volume: number }>;
/** Volumes are finite [0,1]. Consent, silence, mute and zero volume are separate
 * gates. Slider/mute patches never imply enable, resume or channel unmute. */
export type InstallationAudioPreferences = Readonly<{
  soundEnabled: boolean; silenceAll: boolean;
  music: AudioChannelPreferences; effects: AudioChannelPreferences;
}>;
export type ProfilePreferences = Readonly<{
  instructionReadAloud: boolean; motion: 'system' | 'reduced';
}>;
export const INITIAL_AUDIO_PREFERENCES: InstallationAudioPreferences = {
  soundEnabled: false, silenceAll: false,
  music: { muted: false, volume: .25 }, effects: { muted: false, volume: .50 },
};
export const INITIAL_PROFILE_PREFERENCES: ProfilePreferences = {
  instructionReadAloud: false, motion: 'system',
};
export type AudioPreferencesPatch = Readonly<{
  soundEnabled?: boolean; silenceAll?: boolean;
  music?: Readonly<Partial<AudioChannelPreferences>>;
  effects?: Readonly<Partial<AudioChannelPreferences>>;
}>;

/** Only episode-local counters/closure reset after unsuccessful completion.
 * Resume suspended work retains ordinal. Encounter Checks/help/opportunity stay
 * cumulative; firstCheckSequence is null iff this episode has no judged Check.
 * Completed episodes require a completionActionId; open/suspended do not. */
export type LearningEpisode = Readonly<{
  ordinal: PositiveSafeInteger;
  validChecks: NonnegativeSafeInteger;
  firstCheckSequence: PositiveSafeInteger | null;
}> & (
  | Readonly<{ status: 'open' | 'suspended'; completionActionId: null }>
  | Readonly<{ status: 'completed-success' | 'completed-unsuccessful'; completionActionId: string }>
);
export type LastCheckIdentity = Readonly<{
  submissionId: string; checkSequence: PositiveSafeInteger;
  learningEpisodeOrdinal: PositiveSafeInteger; response: ActivityResponse;
}>;
export type JudgedEvaluation = Extract<EvaluationResult, { status: 'judged' }>;
/** Single bounded attributed record, not an event log. Only an acknowledged
 * judged Check replaces this record and its delta; edited drafts do not. */
export type LastCommittedCheck = LastCheckIdentity & Readonly<{
  evaluation: JudgedEvaluation; delta: ScoreDelta;
}>;
/** Import the producer's encounter projection once; persist its canonical
 * descriptor, never a full TaskDefinition. Provenance is populated from validated
 * SelectionResult, immutable across resume (null only for unbound practice).
 * validChecks/firstCheckCorrect/assistance are sticky across episode closure.
 * opportunityId references the WP05 track; no second opportunity is persisted. */
export type EncounterSave = Omit<SelectionEncounter,
  'contentRevision' | 'learningEpisodeOrdinal' | 'episodeStatus'> & Readonly<{
  taskContentRevision: string; learningEpisode: LearningEpisode;
  responseDraft: ActivityResponse | null; revealedAssistanceIds: readonly string[];
  eligibility: EligibilityResult; lastCommittedCheck: LastCommittedCheck | null;
}>;
/** Store a reference to unresolved work rather than duplicate its descriptor.
 * Producer history fields retain canonical completion/check-week facts after
 * encounter compaction; WP04 adapts pendingEncounterId to SelectionEncounter. */
export type SavedCanonicalLearningHistory = Omit<CanonicalLearningHistory, 'pendingEncounter'>
  & Readonly<{ pendingEncounterId: string | null }>;
export type ProfileSave = Readonly<{
  identity: Readonly<{ profileId: ProfileId; nickname: string; avatarId: string }>;
  preferences: ProfilePreferences;
  learning: Readonly<{ evidence: SkillEvidence; canonicalHistory: readonly SavedCanonicalLearningHistory[] }>;
  encounters: Readonly<Record<string, EncounterSave>>;
  world: WorldProgress; creative: CreativeState; rewards: RewardState;
  personalRecords: PersonalRecords;
}>;
/** Complete portable household state. No tab-selected profile, transient UI
 * draft, token, assets, playback nodes, discovery/result booleans or classes.
 * Permanent world binding/quest sets survive compaction. Content versions preserve
 * compatible Q1–Q10 definitions; unavailable content is never silently stripped. */
export type SaveDataV1 = Readonly<{
  schemaVersion: 1; contentVersion: string; rewardPolicyVersion: string;
  installation: Readonly<{ timezone: 'Europe/London'; audio: InstallationAudioPreferences }>;
  profiles: Readonly<Record<ProfileId, ProfileSave>>; competition: CompetitionState;
}>;
export type StoredRoot = Readonly<{ epoch: string; revision: NonnegativeSafeInteger; save: SaveDataV1 }>;
/** Same immutable reference until acknowledged commit/refresh changes state. */
export type CommittedSnapshot = Readonly<{ token: SaveToken; save: SaveDataV1 }>;

export type OpenEncounterPayload =
  | Readonly<{ route: LearningRouteIntent; resumeEncounterId?: never; suppressDueReviewForVisit: boolean }>
  | Readonly<{ resumeEncounterId: string; route?: never; suppressDueReviewForVisit: boolean }>;
/** State command tags map to WP03 instruction/assessed-reading/answer-help
 * categories. Only hint/worked support accepts a producer-approved help ID.
 * Record answer assistance successfully before revealing it. */
export type RecordAssistancePayload = Readonly<{ encounterId: string }> & (
  | Readonly<{ assistanceKind: 'instruction-read-aloud' | 'assessed-text-read-aloud'; hintId?: never }>
  | Readonly<{ assistanceKind: 'answer-hint' | 'worked-support'; hintId: string }>
);
type CommandEnvelope = Readonly<{ actionId: string; expected: SaveToken }>;
type ProfileCommand<K extends string, P> = CommandEnvelope
  & Readonly<{ profileId: ProfileId; kind: K; payload: P }>;
type InstallationCommand<K extends string, P> = CommandEnvelope
  & Readonly<{ profileId?: never; kind: K; payload: P }>;
/** No caller-defined fields, even for zero-payload actions. */
export type EmptyPayload = Readonly<Record<string, never>>;
type NewProfilePayload = Readonly<{ newProfileId: ProfileId; nickname: string; avatarId: string }>;
type EpisodeKey = Readonly<{ encounterId: string; learningEpisodeOrdinal: PositiveSafeInteger }>;
/** Every existing-profile action captures profileId before await; the facade
 * never consults a later selected profile. expected is also the destructive
 * preview token. Compacted/unknown encounters expire, never reconstruct from UI.
 * Check sequence is next cumulative validChecks+1, never episode-local. Invalid
 * responses consume neither sequence nor points. Finish adds no Check. */
export type StateCommand =
  | InstallationCommand<'CreateProfile', NewProfilePayload>
  | ProfileCommand<'RenameProfile', Readonly<{ nickname: string }>>
  | ProfileCommand<'SetAvatar', Readonly<{ avatarId: string }>>
  | ProfileCommand<'ChooseCosmetic', Readonly<{ choice: CreativeChoice }>>
  | ProfileCommand<'SetProfilePreferences', Readonly<{ patch: Readonly<Partial<ProfilePreferences>> }>>
  | InstallationCommand<'SetAudioPreferences', Readonly<{ patch: AudioPreferencesPatch }>>
  | ProfileCommand<'OpenEncounter', OpenEncounterPayload>
  | ProfileCommand<'RecordAssistance', RecordAssistancePayload>
  | ProfileCommand<'SaveDraft', Readonly<{ encounterId: string; responseDraft: ActivityResponse }>>
  | ProfileCommand<'SubmitCheck', EpisodeKey & Readonly<{
      submissionId: string; checkSequence: PositiveSafeInteger; response: ActivityResponse;
    }>>
  | ProfileCommand<'SuspendEncounter', EpisodeKey & Readonly<{ responseDraft?: ActivityResponse }>>
  | ProfileCommand<'FinishPractice', EpisodeKey>
  | ProfileCommand<'DeleteProfile', EmptyPayload>
  | ProfileCommand<'StartOver', NewProfilePayload>
  | InstallationCommand<'ResetSave', EmptyPayload>
  | InstallationCommand<'ReplaceSave', Readonly<{ preparedImportId: string }>>
  | InstallationCommand<'ReconcileCalendar', EmptyPayload>;

/** Presentation-only changes: only a new committed result triggers celebration.
 * Consumers never submit this object as an award or world patch. */
export type CommitChanges = Readonly<{
  earnedPoints: ScoreDelta; unlockedIds: readonly string[];
  restorationIds: readonly WorldResultId[]; closedWeekIds: readonly WeekKey[];
}>;
export type StateReasonCode = Extract<BindingResolution, { status: 'unavailable' }>['reason']
  | 'already-applied' | 'invalid-command' | 'invalid-response' | 'incomplete-response' | 'profile-missing'
  | 'profile-exists' | 'encounter-expired' | 'cross-profile-encounter' | 'stale-episode'
  | 'invalid-sequence' | 'submission-mismatch' | 'episode-not-finishable'
  | 'content-unavailable' | 'choice-unavailable' | 'not-entitled' | 'capacity-exceeded'
  | 'unsupported-schema' | 'unsupported-content' | 'unsupported-policy'
  | 'invalid-save' | 'prepared-import-expired' | 'storage-blocked' | 'storage-unreadable'
  | 'storage-write-failed' | 'transition-failed';
export type StateReason = Readonly<{ code: StateReasonCode; message: string }>;
export type CommitResult =
  | Readonly<{ status: 'committed'; snapshot: CommittedSnapshot; changes: CommitChanges; reason?: never }>
  | Readonly<{ status: 'already-applied'; snapshot: CommittedSnapshot; changes?: never; reason?: never }>
  | Readonly<{ status: 'conflict'; snapshot: CommittedSnapshot; changes?: never; reason?: never }>
  | Readonly<{ status: 'invalid'; reason: StateReason; snapshot?: never; changes?: never }>
  | Readonly<{ status: 'unsupported'; reason: StateReason; snapshot?: never; changes?: never }>
  | Readonly<{ status: 'save-failed'; reason: StateReason; retryable: boolean;
      snapshot?: CommittedSnapshot; changes?: never }>;
export type TransitionDecision =
  | Readonly<{ status: 'changed'; save: SaveDataV1; changes: CommitChanges }>
  | Readonly<{ status: 'already-applied' | 'invalid' | 'unsupported'; reason: StateReason;
      save?: never; changes?: never }>;
export type TransitionContext = Readonly<{
  nowEpochMs: number; catalogue: readonly TaskDefinition[];
  questBindings: readonly QuestActivityBinding[]; milestone: Milestone;
  allocatedIds: Readonly<{ encounterId?: string; opportunityId?: string }>;
  /** Facade-owned decoded/previewed value, never supplied by the command caller. */
  preparedImport?: Readonly<{ preparedImportId: string; expected: SaveToken; save: SaveDataV1 }>;
}>;
export type ReduceCommand = (root: StoredRoot, command: StateCommand, context: TransitionContext) => TransitionDecision;
export type ValidationIssue = Readonly<{ path: string; code: StateReasonCode; message: string }>;
export type ValidationResult =
  | Readonly<{ status: 'valid'; save: SaveDataV1 }>
  | Readonly<{ status: 'invalid' | 'unsupported'; issues: readonly ValidationIssue[]; save?: never }>;
/** Returns a fresh explicitly decoded save. Runtime owner checks all numeric,
 * ID, capacity, enum, catalogue, binding, reward and cross-field invariants. */
export type ValidateSave = (candidate: unknown, catalogue: readonly TaskDefinition[]) => ValidationResult;

/** Live requested choices, distinct from acknowledged snapshot. The preference
 * owner imports WP02 AudioPreferenceIntent/LiveAudioGate; call its synchronous
 * gate before enqueue, preserve current silence/generation after async callbacks.
 * savedGeneration never exceeds generation; failed persistence retains request. */
export type PreferenceStatus = Readonly<{
  requestedAudio: InstallationAudioPreferences;
  requestedProfileById: Readonly<Record<ProfileId, ProfilePreferences>>;
  loadStatus: 'loading' | 'loaded' | 'read-failed'; generation: NonnegativeSafeInteger;
  savedGeneration: NonnegativeSafeInteger; pending: boolean; failed: boolean;
  errorCode?: StateReasonCode;
}>;
export type TransientReadiness = Readonly<{ dirty: boolean; pending: boolean; failed: boolean }>;
/** Sample current registered-panel status every call; unavailable/throwing input
 * fails closed. State never registers/suspends panels, clears flags or copies UI
 * drafts. Explicit draft discard clears panel blockers, not durable failures. */
export type ReadTransientReadiness = () => TransientReadiness;
/** Required constructor dependency; shell supplies the current registration
 * getter, never a captured status object. Other composition inputs are WP04-04A. */
export type StateControllerReadinessInput = Readonly<{ readTransientReadiness: ReadTransientReadiness }>;
export type UpdateReadiness = Readonly<{
  ready: boolean; pendingCommands: NonnegativeSafeInteger; pendingPreferences: boolean;
  failedCommand: boolean; failedPreferences: boolean; unsavedTransition: boolean;
}>;
export type StateController = Readonly<{
  getSnapshot(): CommittedSnapshot;
  subscribe(listener: () => void): () => void;
  /** Serialize writes; publish snapshots/changes only after tx.done. */
  dispatch(command: StateCommand): Promise<CommitResult>;
  refresh(): Promise<CommitResult>;
  getUpdateReadiness(): UpdateReadiness;
  /** Drain existing queues, then resample readiness. No suspension or flag clear;
   * ready iff every blocker is absent. This is not update-activation permission. */
  flush(): Promise<UpdateReadiness>;
}>;
/** No synthetic empty snapshot for absent/corrupt/unsupported/unreadable storage.
 * Only a confirmed clean first run may initialize an absent root. */
export type LoadResult =
  | Readonly<{ status: 'absent' }>
  | Readonly<{ status: 'new' | 'ready'; snapshot: CommittedSnapshot }>
  | Readonly<{ status: 'blocked' | 'unsupported' | 'unreadable'; reason: StateReason; snapshot?: never }>;

export type CommittedActivityProjection = Readonly<{
  token: SaveToken; profileId: ProfileId; encounterId: string;
  learningEpisodeOrdinal: PositiveSafeInteger; episodeStatus: LearningEpisode['status'];
  nextCheckSequence: PositiveSafeInteger; task: Readonly<TaskDefinition>;
  responseDraft: ActivityResponse | null; lastEvaluation: JudgedEvaluation | null;
  lastCheck: LastCheckIdentity | null; revealedAssistanceIds: readonly string[];
  bindingProvenance: ActivityBindingProvenance | null;
  selectionReason: SelectionEncounter['selectionReason']; familiar: boolean;
  reviewReference: SelectionEncounter['reviewReference'];
  rewardDisplay: Readonly<{
    eligibility: EligibilityResult; earningWeek: WeekKey | null; slot: CompetitiveSlot | null;
    components: RewardOpportunity['components'] | null; earningWeekOpen: boolean;
    /** Historical information only; never a new celebration/award. */
    lastCommittedDelta: ScoreDelta | null;
  }>;
}>;
export type ActivityProjectionResult =
  | Readonly<{ status: 'ready'; activity: CommittedActivityProjection }>
  | Readonly<{ status: 'unavailable'; reason: 'profile-missing' | 'encounter-expired' | 'content-unavailable'; token: SaveToken }>;
/** Pure read over explicit committed state and matching approved retained
 * canonical/revision content. Never grade, dispatch, obtain time or award.
 * Feedback stays attributed to lastCheck even when draft/episode differs. */
export type SelectCommittedActivity = (
  snapshot: CommittedSnapshot, catalogue: readonly TaskDefinition[],
  key: Readonly<{ profileId: ProfileId; encounterId: string }>,
) => ActivityProjectionResult;
