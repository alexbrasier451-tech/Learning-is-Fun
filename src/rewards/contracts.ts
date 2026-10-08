import type {
  DifficultyBand, EvaluationResult, LearningAssistance, SelectionResult, TaskDefinition,
} from '../learning/contracts';

/** Pure readonly JSON DTOs. Save/policy owners validate safe integer counts,
 * bounded opaque IDs and cross-field invariants; these types do not award points. */
export type ProfileId = string;
export type QuestId = string;
export type CanonicalQuestionId = TaskDefinition['canonicalQuestionId'];
/** Gregorian civil date, YYYY-MM-DD (0001–9999). Calendar helpers validate it. */
export type LocalDate = string;
/** The validated Monday LocalDate identifying a Europe/London week. */
export type WeekKey = LocalDate;
export type CompetitionClock = Readonly<{ nowEpochMs(): number }>;

/** Classification is neither an earned delta nor a promise of a weekly slot. */
export type EligibilityResult =
  | Readonly<{ kind: 'eligible-first'; reason: 'first-encounter' }>
  | Readonly<{ kind: 'eligible-review'; reason: 'selected-due-review' }>
  | Readonly<{ kind: 'resume-existing'; reason: 'unfinished-opportunity' }>
  | Readonly<{ kind: 'practice-only'; reason: 'same-week-used' | 'child-practice'
      | 'not-due' | 'unfinished-free-practice' | 'familiar-repeat' }>;

/** WP04 adapts the learning reason; only WP03-selected, later-week due review
 * can be a review candidate. Dates alone do not establish eligibility. */
export type RewardSelectionFacts = Readonly<{
  profileId: ProfileId;
  canonicalQuestionId: CanonicalQuestionId;
  encounterId: string;
  selectionReason: 'story' | 'adaptive' | 'due-review' | 'child-practice';
  candidate: Extract<SelectionResult, { status: 'selected' }>['rewardCandidate'];
  dueLocalDate?: LocalDate;
  previousSuccessWeek?: WeekKey;
  band: DifficultyBand;
}>;

export type CompetitiveSlot =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;

/** Awarded component flags: success requires the answer component and the two
 * success bonuses are mutually exclusive. No episode ordinal enters a key. */
export type RewardComponents =
  | Readonly<{ answer: false; independentSuccess: false; supportedSuccess: false }>
  | Readonly<{ answer: true; independentSuccess: false; supportedSuccess: false }>
  | Readonly<{ answer: true; independentSuccess: true; supportedSuccess: false }>
  | Readonly<{ answer: true; independentSuccess: false; supportedSuccess: true }>;

/** Pre-Check week/slot are null. First valid Check binds the earning week; a
 * capped/noncompetitive slot stays null. Resume retains token, ordinal and help.
 * The post-binding unique reward key is the JSON tuple
 * [profileId, canonicalQuestionId, earningWeek], never delimiter concatenation. */
export type RewardOpportunity = Readonly<{
  opportunityId: string;
  profileId: ProfileId;
  canonicalQuestionId: CanonicalQuestionId;
  ordinal: number;
  selectionFacts: RewardSelectionFacts;
  earningWeek: WeekKey | null;
  slot: CompetitiveSlot | null;
  validChecks: number;
  answerHintUsed: boolean;
  firstSuccessWeek?: WeekKey;
  firstSuccessLocalDate?: LocalDate;
  components: RewardComponents;
}>;

export type AnswerReceiptKey = Readonly<{
  opportunityId: string;
  component: 'answer' | 'independent-success' | 'supported-success';
}>;
export type QuestReceiptKey = Readonly<{ profileId: ProfileId; questId: QuestId }>;
export type RewardReceiptKey = AnswerReceiptKey | QuestReceiptKey;
export type RewardReceipt =
  | Readonly<{ key: Readonly<{ opportunityId: string; component: 'answer' }>; amount: 5 }>
  | Readonly<{ key: Readonly<{ opportunityId: string; component: 'independent-success' }>; amount: 15 }>
  | Readonly<{ key: Readonly<{ opportunityId: string; component: 'supported-success' }>; amount: 5 }>
  | Readonly<{ key: QuestReceiptKey; amount: 20 }>;

/** Internally computed, never accepted from UI. Null/absent consumedSlot means
 * no newly consumed competitive slot, not a fresh eligibility decision. */
export type ScoreDelta = Readonly<{
  lifetimeDelta: number;
  competitiveDelta: number;
  consumedSlot?: CompetitiveSlot | null;
  newReceiptKeys: readonly RewardReceiptKey[];
  newEntitlementIds: readonly string[];
}>;

/** Older exact contributions fold into closedAwardTotal once, advancing the
 * completion mark. No open opportunity may lie at/below completedThroughOrdinal.
 * Keep unresolved attempts/help through routes, weeks and unsuccessful episodes.
 * WP04 separately owns submission high-water/tombstones and expired-ID rejection. */
export type CanonicalRewardTrack = Readonly<{
  lastAllocatedOrdinal: number;
  completedThroughOrdinal: number;
  closedAwardTotal: number;
  lastSuccessWeek?: WeekKey;
  lastSuccessLocalDate?: LocalDate;
  freePractice: Readonly<{
    latestWeek?: WeekKey;
    validChecks: number;
    answerHintUsed: boolean;
    unfinishedEncounterId?: string;
  }>;
  currentOpportunity?: RewardOpportunity;
  recentCompletedOpportunity?: RewardOpportunity;
}>;

/** lifetimePoints equals compacted totals + retained components + 20 per quest
 * receipt. Do not count an already compacted component a second time. */
export type RewardState = Readonly<{
  lifetimePoints: number;
  tracksByCanonical: Readonly<Record<CanonicalQuestionId, CanonicalRewardTrack>>;
  questReceipts: readonly QuestReceiptKey[];
  entitlementIds: readonly string[];
}>;

export type Medal = 'gold' | 'silver' | 'bronze';
export type PersonalRecords = Readonly<{
  best: Readonly<{ points: number; week: WeekKey }> | null;
  medals: Readonly<Record<Medal, number>>;
}>;
/** Positive participants only. Original ranks/medals and identity snapshots
 * survive deletion of another profile; rank gaps are valid after omission. */
export type ClosedWeekResult = Readonly<{
  week: WeekKey;
  timezone: 'Europe/London';
  policyVersion: string;
  entries: readonly Readonly<{
    profileId: ProfileId;
    nickname: string;
    avatarId: string;
    points: number;
    rank: number;
    medal: Medal | null;
  }>[];
  omittedDeletedProfiles: boolean;
}>;
export type CompetitionSlotEntry = Readonly<{
  slot: CompetitiveSlot;
  opportunityId: string;
  canonicalQuestionId: CanonicalQuestionId;
  points: number;
}>;
/** Missing profile maps read as zero. Scores equal ordered, unique slot sums;
 * lifetime-only points never appear. Archives retain at most 52 participating
 * closed weeks; records live per profile independently of that display window. */
export type CompetitionState = Readonly<{
  timezone: 'Europe/London';
  latestOpenedWeek: WeekKey | null;
  currentScores: Readonly<Record<ProfileId, number>>;
  currentSlots: Readonly<Record<ProfileId, readonly CompetitionSlotEntry[]>>;
  archives: readonly ClosedWeekResult[];
  policyVersion: string;
}>;
export type CalendarContext = Readonly<{
  observedLocalDate: LocalDate;
  activeWeek: WeekKey;
  clockRollback: boolean;
}>;
export type CompetitionProfile = Readonly<{
  profileId: ProfileId;
  nickname: string;
  avatarId: string;
  lifetimePoints: number;
  personalRecords: PersonalRecords;
}>;
export type ReconciliationInput = Readonly<{
  competition: CompetitionState;
  profiles: readonly CompetitionProfile[];
}>;
/** Presentation data, never an additional award request. */
export type ClosedWeekChange = Readonly<{ week: WeekKey; result: ClosedWeekResult }>;
/** WP04 commits records and competition atomically. Closure implementation is
 * reserved for WP05-03A; no no-op or ambient-clock implementation is published. */
export type ReconciliationResult = Readonly<{
  nextCompetition: CompetitionState;
  nextPersonalRecordsByProfile: Readonly<Record<ProfileId, PersonalRecords>>;
  context: CalendarContext;
  closedWeekChanges: readonly ClosedWeekChange[];
}>;
export type ReconcileCompetitionWeek =
  (input: ReconciliationInput, nowEpochMs: number) => ReconciliationResult;

/** Pre-Check stored facts. checkSequence is previous cumulative validChecks + 1,
 * never an episode-local count; invalid/unjudged responses do not reach scoring.
 * A null track/token supports first free practice. WP04 filters transport replay;
 * scoring rejects inconsistent identity/counts and revalidates first-Check facts. */
export type RewardCheckInput = Readonly<{
  profileId: ProfileId;
  encounterId: string;
  opportunityId: string | null;
  submissionId: string;
  checkSequence: number;
  validChecks: number;
  track: CanonicalRewardTrack | null;
  rewards: RewardState;
  evaluation: Extract<EvaluationResult, { status: 'judged' }>;
  assistance: LearningAssistance;
  selection: RewardSelectionFacts;
  competition: CompetitionState;
  context: CalendarContext;
}>;
export type RewardCheckResult = Readonly<{
  nextRewards: RewardState;
  nextCompetition: CompetitionState;
  delta: ScoreDelta;
}>;

export type LeaderboardReadModel = Readonly<{
  localScopeLabel: string;
  activeWeek: WeekKey;
  activeWeekLabel: string;
  timezone: 'Europe/London';
  clockNotice?: string;
  profiles: readonly Readonly<{
    profileId: ProfileId;
    nickname: string;
    avatarId: string;
    competitivePoints: number;
    lifetimePoints: number;
    usedSlots: number;
    rank: number | null;
  }>[];
  recentClosedResults: readonly ClosedWeekResult[];
  personalRecordsByProfile: Readonly<Record<ProfileId, PersonalRecords>>;
}>;
