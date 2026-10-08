/** Pure readonly JSON contracts. Numeric/domain constraints are validated by the
 * owning content family or committed-state adapter, not by this type module. */
export type SkillId =
  | 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06' | 'M07' | 'M08' | 'M09' | 'M10'
  | 'E01' | 'E02' | 'E03' | 'E04' | 'E05' | 'E06' | 'E07' | 'E08' | 'E09' | 'E10';
export type DifficultyBand = 'support' | 'core' | 'stretch';
export type Mechanic = 'drag' | 'matching' | 'sequencing' | 'sorting'
  | 'object-manipulation' | 'consequential-selection';
export type CurriculumReference = Readonly<{
  sourceUrl: string; section: string; programmeBand: string;
}>;
export type SkillDefinition = Readonly<{
  skillId: SkillId; label: string; objectiveId: string; focus: string;
  curriculum: readonly CurriculumReference[]; demandRationale: string;
  availability: 'M1' | 'M2'; declaredBands: readonly DifficultyBand[];
}>;
export type PrerequisiteSuggestion = Readonly<{
  prerequisiteSkillId: SkillId; skillId: SkillId; rationale: string;
}>;

/** Never contain seed, chosen answer, placement, release, encounter or week. */
export type TaskDescriptor = Readonly<{
  familyId: string; equivalenceVersion: string; authoredKey: string | null;
  parameters: Readonly<Record<string, number | string>>;
}>;
export type ExactQuantity = Readonly<{
  numerator: number; denominator: number; unit: string;
}>;
export type ActivityResponse =
  | Readonly<{ kind: 'bridge'; planks: readonly number[] }>
  | Readonly<{ kind: 'merchant'; apples: number | null; pears: number | null }>
  | Readonly<{ kind: 'punctuation'; slots: Readonly<Record<string, string | null>> }>
  | Readonly<{ kind: 'choice'; choices: Readonly<Record<string, string | null>> }>
  | Readonly<{ kind: 'sequence'; orderedIds: readonly string[] }>
  | Readonly<{ kind: 'sorting'; groups: Readonly<Record<string, string | null>> }>
  | Readonly<{ kind: 'matching'; pairs: Readonly<Record<string, string | null>> }>
  | Readonly<{ kind: 'quantity'; values: Readonly<Record<string, ExactQuantity | null>> }>
  | Readonly<{ kind: 'clock'; minutes: number | null }>;

export type IntegerBounds = Readonly<{ min: number; max: number }>;
export type ResponseOption = Readonly<{ id: string; label: string }>;
export type ResponseSlot = Readonly<{
  id: string; label: string; options: readonly ResponseOption[];
}>;
/** Bounds are finite safe integers. Partial permitted drafts are unscored.
 * Unknown IDs, duplicates and forbidden values are invalid, not learner wrongness. */
export type ResponseSpec =
  | Readonly<{ kind: 'bridge'; plankLengths: readonly number[]; cardinality: IntegerBounds }>
  | Readonly<{ kind: 'merchant'; countBounds: IntegerBounds; maxTotal: number }>
  | Readonly<{ kind: 'punctuation' | 'choice'; slots: readonly ResponseSlot[]; requiredSlotIds: readonly string[] }>
  | Readonly<{ kind: 'sequence'; tiles: readonly ResponseOption[]; cardinality: IntegerBounds }>
  | Readonly<{ kind: 'sorting'; items: readonly ResponseOption[]; groups: readonly ResponseOption[]; requiredItemIds: readonly string[] }>
  | Readonly<{ kind: 'matching'; items: readonly ResponseOption[]; targets: readonly ResponseOption[]; requiredItemIds: readonly string[]; uniqueTargets: boolean }>
  | Readonly<{ kind: 'quantity'; slots: readonly Readonly<{
      id: string; label: string; numeratorBounds: IntegerBounds;
      allowedDenominators: readonly number[]; units: readonly string[];
      form: 'exact' | 'equivalent';
    }>[]; requiredSlotIds: readonly string[] }>
  | Readonly<{ kind: 'clock'; minuteBounds: IntegerBounds }>;

/** Finite accepted responses serve bounded authored tasks; family evaluators own
 * comparison (including rational equality). No expression interpreter is implied. */
export type AnswerRule =
  | Readonly<{ kind: 'bridge-total'; target: number }>
  | Readonly<{ kind: 'merchant-constraints'; total: number; multiplier: number }>
  | Readonly<{ kind: 'accepted-responses'; responses: readonly ActivityResponse[] }>;
export type FeedbackIssue = Readonly<{
  code: string; observed: string; explanation: string;
}> & (
  | Readonly<{ slotId: string; constraintId: string | null }>
  | Readonly<{ slotId: null; constraintId: string }>
);
export type ContentIssue = Readonly<{
  canonicalQuestionId: string; field: string; code: string; detail: string;
}>;
export type EvaluationResult =
  | Readonly<{ status: 'incomplete'; missing: readonly string[] }>
  | Readonly<{ status: 'invalid-response'; reason: string }>
  | Readonly<{ status: 'unavailable-content'; issues: readonly ContentIssue[] }>
  | Readonly<{
      status: 'judged'; correct: boolean; canonicalQuestionId: string;
      skillId: SkillId; objectiveId: string; band: DifficultyBand;
      feedback: Readonly<{ explanation: string; issues: readonly FeedbackIssue[] }>;
    }>;

type StimulusText = Readonly<{ labels: readonly string[]; accessibleDescription: string }>;
/** Coordinates describe source stimuli only; they are never scored responses. */
export type TaskStimulus = StimulusText & (
  | Readonly<{ kind: 'array'; groups: number; itemsPerGroup: number }>
  | Readonly<{ kind: 'fraction'; numerator: number; denominator: number; wholeCount: number }>
  | Readonly<{ kind: 'clock'; minutes: number; dayOffset: 0 | 1;
      display: '12-hour' | '24-hour'; face: 'analogue' | 'digital' }>
  | Readonly<{ kind: 'diagram'; points: readonly Readonly<{
      id: string; x: number; y: number; label?: string;
    }>[]; edges: readonly Readonly<{
      id: string; from: string; to: string; label?: string;
    }>[]; closed: boolean }>
  | Readonly<{ kind: 'data'; display: 'table' | 'bar' | 'line'; xLabel: string;
      yLabel: string; unit: string; scaleStep: number;
      rows: readonly Readonly<{ id: string; label: string; value: number }>[] }>
);
export type AssistanceText = Readonly<{ id: string; text: string }>;
export type TaskDefinition = Readonly<{
  canonicalQuestionId: string; descriptor: TaskDescriptor; contentRevision: string;
  skillId: SkillId; objectiveId: string; band: DifficultyBand;
  contextualSkillIds: readonly SkillId[]; curriculum: CurriculumReference;
  demandRationale: string; instructionText: string; assessedText: string;
  stimulus?: TaskStimulus | null; responseSpec: ResponseSpec; answerRule: AnswerRule;
  explanation: string; hints: readonly [AssistanceText, AssistanceText];
  workedSupport: AssistanceText;
  narration: Readonly<{ neutralText: string; assessedTextMayBeSpokenBeforeCheck: boolean }>;
  review: Readonly<{
    status: 'approved' | 'withheld'; reviewer: string; rationale: string; evidenceRef: string;
  }>;
}>;
export type TaskFamilyManifest = Readonly<{
  moduleId: string; familyIds: readonly string[]; taskIds: readonly string[];
  retainedTaskIds: readonly string[]; domainDescription: string; reviewEvidenceRef: string;
  cases: readonly Readonly<{
    caseId: string; canonicalQuestionId: string; response: ActivityResponse;
    expectedStatus: EvaluationResult['status']; expectedCorrect?: boolean;
    expectedIssueCodes: readonly string[];
  }>[];
}>;

export type ActivityBindingId = string;
export type QuestActivityBinding = Readonly<{
  bindingId: ActivityBindingId; questId: string; availability: 'M1' | 'M2';
  role: 'story' | 'optional-transfer' | 'revisit'; skillId: SkillId;
  taskIds: readonly string[]; mechanic: Mechanic; responseKind: ActivityResponse['kind'];
  sourceBindingId: ActivityBindingId | null;
}>;
export type ActivityBindingProvenance = Readonly<{
  bindingId: ActivityBindingId; questId: string; role: QuestActivityBinding['role'];
}>;
export type LearningRouteIntent =
  | Readonly<{ kind: 'quest'; questId: string; bindingId?: ActivityBindingId }>
  | Readonly<{ kind: 'optional-transfer'; bindingId: ActivityBindingId }>
  | Readonly<{ kind: 'revisit'; bindingId: ActivityBindingId }>
  | Readonly<{ kind: 'practice'; skillId?: SkillId; mode: 'suggested' | 'easier' | 'repeat' }>;
export type ResolvedSelectionIntent = Readonly<{
  kind: 'story-anchor' | 'transfer' | 'adaptive-practice' | 'child-easier' | 'repeat-practice' | 'resume';
  skillId: SkillId | null; binding: QuestActivityBinding | null;
  provenance: ActivityBindingProvenance | null; previousCanonicalQuestionId: string | null;
}>;
export type BindingResolution =
  | Readonly<{ status: 'resolved'; intent: ResolvedSelectionIntent }>
  | Readonly<{ status: 'unavailable'; reason: 'unknown-binding' | 'route-mismatch'
      | 'milestone-unavailable' | 'quest-unavailable' | 'already-completed'
      | 'source-incomplete' | 'invalid-binding' | 'no-suitable-task' }>;
export type SelectionReason = 'story-anchor' | 'transfer' | 'adaptive-practice'
  | 'due-review' | 'child-easier' | 'repeat-practice';
export type ReviewReference = Readonly<{
  canonicalQuestionId: string; dueLocalDate: string; previousSuccessWeek: string;
}>;
/** Neutral instructions/control narration are not answer help and need no sticky flag. */
export type LearningAssistance = Readonly<{
  answerHintUsed: boolean; workedSupportUsed: boolean; assessedTextReadAloud: boolean;
  evidenceMode: 'independent' | 'listening-supported' | 'mixed';
}>;
type ObservationFacts = Readonly<{
  eventId: string; profileId: string; encounterId: string; learningEpisodeOrdinal: number;
  canonicalQuestionId: string; skillId: SkillId; objectiveId: string; band: DifficultyBand;
  selectionReason: SelectionReason; localDate: string; competitionWeekId: string;
  familiar: boolean; reviewReference: ReviewReference | null; assistance: LearningAssistance;
}>;
/** Only committed valid Checks reach this union. Finish never recounts a Check. */
export type LearningObservation = ObservationFacts & (
  | Readonly<{ kind: 'check'; submissionId: string; episodeCheckIndex: number;
      encounterCheckIndex: number; firstCheckCorrect: boolean; correct: false;
      issues: readonly FeedbackIssue[]; episodeCompletion: null }>
  | Readonly<{ kind: 'check'; submissionId: string; episodeCheckIndex: number;
      encounterCheckIndex: number; firstCheckCorrect: boolean; correct: true;
      issues: readonly FeedbackIssue[]; episodeCompletion: 'success' }>
  | Readonly<{ kind: 'finished-unsuccessfully'; episodeCompletion: 'deliberate-unsuccessful';
      submissionId?: never; episodeCheckIndex?: never; encounterCheckIndex?: never }>
);

export type CompletedLearningEpisode = Readonly<{
  encounterId: string; learningEpisodeOrdinal: number; canonicalQuestionId: string;
  objectiveId: string; band: DifficultyBand; validChecks: number;
  firstCheckCorrect: boolean; encounterCheckIndex: number;
  assistance: LearningAssistance; outcome: 'success' | 'deliberate-unsuccessful';
  localDate: string; competitionWeekId: string; familiar: boolean;
  reviewReference: ReviewReference | null; issues: readonly FeedbackIssue[];
}>;
export type ActiveLearningEpisode = Readonly<{
  encounterId: string; learningEpisodeOrdinal: number; canonicalQuestionId: string;
  objectiveId: string; band: DifficultyBand; validChecks: number;
  encounterCheckIndex: number; firstCheckCorrect: boolean;
  assistance: LearningAssistance; issues: readonly FeedbackIssue[];
}>;
export type DatedReviewResult = Readonly<{
  canonicalQuestionId: string; localDate: string; competitionWeekId: string;
  outcome: 'independent-success' | 'supported-success' | 'unsuccessful'; familiar: boolean;
}>;
export type BandEvidence = Readonly<{
  validChecks: number; correctChecks: number; answerHelpChecks: number;
  completedEpisodes: number; independentSuccesses: number; supportedSuccesses: number;
  retrySuccesses: number; laterDistinctSuccesses: number;
  distinctSuccessfulCanonicalQuestionIds: readonly string[];
  recentCompletedEpisodes: readonly CompletedLearningEpisode[];
  reviewResults: readonly DatedReviewResult[]; reviewDueLocalDate: string | null;
}>;
export type SkillLearningEvidence = Readonly<{
  skillId: SkillId; bands: Readonly<Record<DifficultyBand, BandEvidence>>;
  activeEpisodes: Readonly<Record<string, ActiveLearningEpisode>>;
}>;
/** Keys are skill IDs; activeEpisodes keys are encounter IDs, not a second event log. */
export type SkillEvidence = Readonly<Partial<Record<SkillId, SkillLearningEvidence>>>;
export type LearningSuggestion = Readonly<{
  kind: 'unavailable-band' | 'prerequisite'; skillId: SkillId;
  band: DifficultyBand | null; prerequisiteSkillId: SkillId | null; explanation: string;
}>;
export type LearningSummary = Readonly<{
  skillId: SkillId; label: 'practising' | 'ready-for-harder-work' | 'review-due';
  currentBand: DifficultyBand; availableBands: readonly DifficultyBand[];
  validChecks: number; completedEpisodes: number; independentSuccesses: number;
  supportedSuccesses: number; retrySuccesses: number; laterDistinctSuccesses: number;
  distinctSuccessesByBand: Readonly<Record<DifficultyBand, number>>;
  recentCompletedEpisodes: readonly CompletedLearningEpisode[];
  reviewDueLocalDate: string | null; latestReview: DatedReviewResult | null;
  suggestion: LearningSuggestion | null; missingEvidence: readonly string[];
}>;
/** WP04 supplies this projection; these are not WP04 persisted lifecycle fields. */
export type SelectionEncounter = Readonly<{
  encounterId: string; opportunityId: string | null; canonicalQuestionId: string;
  descriptor: TaskDescriptor; contentRevision: string; skillId: SkillId; band: DifficultyBand;
  selectionReason: SelectionReason; bindingProvenance: ActivityBindingProvenance | null;
  familiar: boolean; reviewReference: ReviewReference | null;
  learningEpisodeOrdinal: number; episodeStatus: 'open' | 'suspended' | 'completed-success' | 'completed-unsuccessful';
  validChecks: number; firstCheckCorrect: boolean | null; assistance: LearningAssistance;
}>;
export type CanonicalLearningHistory = Readonly<{
  canonicalQuestionId: string; pendingEncounter: SelectionEncounter | null;
  everChecked: boolean; previousSuccessLocalDate: string | null; previousSuccessWeek: string | null;
  checkedCompetitionWeekIds: readonly string[]; assistance: LearningAssistance;
}>;
export type SelectionRequest = Readonly<{
  catalogue: readonly TaskDefinition[]; intent: ResolvedSelectionIntent; evidence: SkillEvidence;
  activeEncounter: SelectionEncounter | null; canonicalHistory: readonly CanonicalLearningHistory[];
  calendar: Readonly<{ todayDate: string; competitionWeekId: string;
    reviewIn3DaysDate: string; reviewIn7DaysDate: string }>;
  suppressDueReviewForVisit: boolean;
}>;
export type SelectionResult =
  | Readonly<{ status: 'selected'; canonicalQuestionId: string; band: DifficultyBand;
      reason: SelectionReason; bindingProvenance: ActivityBindingProvenance | null;
      familiar: boolean; reviewReference: ReviewReference | null; resumeEncounterId: string | null;
      rewardCandidate: 'first-encounter' | 'later-week-due-review' | 'none';
      unavailableSuggestion: LearningSuggestion | null }>
  | Readonly<{ status: 'no-suitable-task'; reason: string; unavailableSuggestion: LearningSuggestion | null }>;
