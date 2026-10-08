import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INITIAL_CREATIVE_STATE } from '../../src/experience/catalogue';
import type { BandEvidence, LearningObservation, QuestActivityBinding, TaskDefinition } from '../../src/learning/contracts';
import type { RewardOpportunity, ScoreDelta } from '../../src/rewards/contracts';
import { INITIAL_AUDIO_PREFERENCES, INITIAL_PROFILE_PREFERENCES, SAVE_LIMITS } from '../../src/state/contracts';
import type {
  ActivityProjectionResult, CommitChanges, CommitResult, CommittedActivityProjection,
  CommittedSnapshot, EncounterSave, LearningEpisode, LoadResult, OpenEncounterPayload,
  PreferenceStatus, ProfileSave, ReduceCommand, SaveDataV1, SaveToken, SelectCommittedActivity,
  StateCommand, StateController, StateControllerReadinessInput, StoredRoot, TransitionContext, TransientReadiness,
  UpdateReadiness, ValidateSave, ValidationResult,
} from '../../src/state/contracts';

const roundTrip = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const token: SaveToken = { epoch: '8c420151-0000-4000-8000-000000000001', revision: 2 };
const profileId = '8c420151-0000-4000-8000-000000000002';
const envelope = { actionId: '8c420151-0000-4000-8000-000000000003', expected: token } as const;
const captured = { ...envelope, profileId };
const response = { kind: 'bridge', planks: [6, 6] } as const;
const partialDraft = { kind: 'bridge', planks: [3] } as const;
const task: TaskDefinition = {
  canonicalQuestionId: 'lif.math.bridge.r1.total-12',
  descriptor: { familyId: 'math.bridge', equivalenceVersion: 'r1', authoredKey: null, parameters: { target: 12 } },
  contentRevision: 'fixture-1', skillId: 'M01', objectiveId: 'addition', band: 'support', contextualSkillIds: [],
  curriculum: { sourceUrl: 'fixture:curriculum', section: 'addition', programmeBand: 'Year 4' },
  demandRationale: 'Contract construction only.', instructionText: 'Choose planks.', assessedText: 'Span 12 metres.',
  responseSpec: { kind: 'bridge', plankLengths: [1, 2, 3, 4, 5, 6], cardinality: { min: 1, max: 6 } },
  answerRule: { kind: 'bridge-total', target: 12 }, explanation: 'Combine the lengths.',
  hints: [{ id: 'h1', text: 'Look at the span.' }, { id: 'h2', text: 'Add the lengths.' }],
  workedSupport: { id: 'worked', text: 'Two 6 m planks.' },
  narration: { neutralText: 'Choose planks.', assessedTextMayBeSpokenBeforeCheck: true },
  review: { status: 'approved', reviewer: 'fixture only', rationale: 'Synthetic approved record for read-port construction.', evidenceRef: 'tests/state/contracts.test.ts' },
};
const story: QuestActivityBinding = {
  bindingId: 'q1-story', questId: 'Q1', availability: 'M1', role: 'story', skillId: 'M01',
  taskIds: [task.canonicalQuestionId], mechanic: 'drag', responseKind: 'bridge', sourceBindingId: null,
};
const transfer: QuestActivityBinding = {
  ...story, bindingId: 'q1-transfer', role: 'optional-transfer', sourceBindingId: story.bindingId,
  taskIds: ['lif.math.bridge.r1.total-13'],
};
const revisit: QuestActivityBinding = { ...story, bindingId: 'q1-revisit', role: 'revisit' };
const provenance = { bindingId: story.bindingId, questId: story.questId, role: story.role };
const assistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' } as const;
const opportunity: RewardOpportunity = {
  opportunityId: 'opportunity-1', profileId, canonicalQuestionId: task.canonicalQuestionId, ordinal: 1,
  selectionFacts: { profileId, canonicalQuestionId: task.canonicalQuestionId, encounterId: 'encounter-1', selectionReason: 'story', candidate: 'first-encounter', band: 'support' },
  earningWeek: '2026-10-05', slot: 1, validChecks: 1, answerHintUsed: true,
  components: { answer: true, independentSuccess: false, supportedSuccess: false },
};
const delta: ScoreDelta = {
  lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: 1,
  newReceiptKeys: [{ opportunityId: opportunity.opportunityId, component: 'answer' }], newEntitlementIds: [],
};
const openEpisode: LearningEpisode = { ordinal: 1, status: 'open', validChecks: 0, firstCheckSequence: null, completionActionId: null };
const encounter: EncounterSave = {
  encounterId: 'encounter-1', opportunityId: opportunity.opportunityId, canonicalQuestionId: task.canonicalQuestionId,
  descriptor: task.descriptor, taskContentRevision: task.contentRevision, skillId: task.skillId, band: task.band,
  selectionReason: 'story-anchor', bindingProvenance: provenance, familiar: false, reviewReference: null,
  validChecks: 0, firstCheckCorrect: null, assistance, learningEpisode: openEpisode,
  responseDraft: null, revealedAssistanceIds: [], eligibility: { kind: 'eligible-first', reason: 'first-encounter' }, lastCommittedCheck: null,
};
const wrongCheck: EncounterSave = {
  ...encounter, validChecks: 1, firstCheckCorrect: false, responseDraft: partialDraft,
  learningEpisode: { ...openEpisode, validChecks: 1, firstCheckSequence: 1 },
  lastCommittedCheck: {
    submissionId: 'submission-1', checkSequence: 1, learningEpisodeOrdinal: 1, response: partialDraft,
    evaluation: { status: 'judged', correct: false, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId,
      objectiveId: task.objectiveId, band: task.band, feedback: { explanation: 'The span is longer.', issues: [] } }, delta,
  },
};
const finished: EncounterSave = { ...wrongCheck, assistance: { ...assistance, answerHintUsed: true }, revealedAssistanceIds: ['h1'],
  learningEpisode: { ...wrongCheck.learningEpisode, status: 'completed-unsuccessful', completionActionId: 'finish-action-1' } };
const resumed: EncounterSave = { ...finished, responseDraft: { kind: 'bridge', planks: [] }, learningEpisode: { ...openEpisode, ordinal: 2 } };
const secondDelta: ScoreDelta = { lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: null,
  newReceiptKeys: [{ opportunityId: opportunity.opportunityId, component: 'supported-success' }], newEntitlementIds: [] };
const succeeded: EncounterSave = { ...resumed, validChecks: 2, responseDraft: response,
  learningEpisode: { ordinal: 2, status: 'completed-success', validChecks: 1, firstCheckSequence: 2, completionActionId: 'check-action-2' },
  lastCommittedCheck: { ...wrongCheck.lastCommittedCheck!, submissionId: 'submission-2', checkSequence: 2, learningEpisodeOrdinal: 2,
    response, evaluation: { ...wrongCheck.lastCommittedCheck!.evaluation, correct: true, feedback: { explanation: 'The lengths span 12 metres.', issues: [] } }, delta: secondDelta } };
const emptyBand: BandEvidence = { validChecks: 0, correctChecks: 0, answerHelpChecks: 0, completedEpisodes: 0,
  independentSuccesses: 0, supportedSuccesses: 0, retrySuccesses: 0, laterDistinctSuccesses: 0,
  distinctSuccessfulCanonicalQuestionIds: [], recentCompletedEpisodes: [], reviewResults: [], reviewDueLocalDate: null };
const supportEvidence: BandEvidence = { ...emptyBand, validChecks: 1, completedEpisodes: 1,
  recentCompletedEpisodes: [{ encounterId: encounter.encounterId, learningEpisodeOrdinal: 1,
    canonicalQuestionId: task.canonicalQuestionId, objectiveId: task.objectiveId, band: task.band, validChecks: 1,
    firstCheckCorrect: false, encounterCheckIndex: 1, assistance: finished.assistance, outcome: 'deliberate-unsuccessful',
    localDate: '2026-10-09', competitionWeekId: '2026-10-05', familiar: false, reviewReference: null, issues: [] }] };
const profile: ProfileSave = {
  identity: { profileId, nickname: 'Rowan', avatarId: 'pip' }, preferences: INITIAL_PROFILE_PREFERENCES,
  learning: { evidence: { M01: { skillId: 'M01', bands: { support: supportEvidence, core: emptyBand, stretch: emptyBand }, activeEpisodes: {} } },
    canonicalHistory: [{ canonicalQuestionId: task.canonicalQuestionId, pendingEncounterId: encounter.encounterId,
      everChecked: true, previousSuccessLocalDate: null, previousSuccessWeek: null, checkedCompetitionWeekIds: ['2026-10-05'], assistance: finished.assistance }] },
  encounters: { [encounter.encounterId]: resumed }, world: { completedQuestIds: [], completedStoryBindingIds: [] },
  creative: INITIAL_CREATIVE_STATE, rewards: { lifetimePoints: 5, tracksByCanonical: { [task.canonicalQuestionId]: {
    lastAllocatedOrdinal: 1, completedThroughOrdinal: 0, closedAwardTotal: 0,
    freePractice: { validChecks: 0, answerHintUsed: false }, currentOpportunity: opportunity,
  } }, questReceipts: [], entitlementIds: [] }, personalRecords: { best: null, medals: { gold: 0, silver: 0, bronze: 0 } },
};
const save: SaveDataV1 = {
  schemaVersion: 1, contentVersion: 'fixture-m1', rewardPolicyVersion: 'fixture-policy-1',
  installation: { timezone: 'Europe/London', audio: INITIAL_AUDIO_PREFERENCES }, profiles: { [profileId]: profile },
  competition: { timezone: 'Europe/London', latestOpenedWeek: '2026-10-05', currentScores: { [profileId]: 5 },
    currentSlots: { [profileId]: [{ slot: 1, opportunityId: opportunity.opportunityId, canonicalQuestionId: task.canonicalQuestionId, points: 5 }] }, archives: [], policyVersion: 'fixture-policy-1' },
};
const root: StoredRoot = { ...token, save };
const snapshot: CommittedSnapshot = { token, save };
const changes: CommitChanges = { earnedPoints: delta, unlockedIds: [], restorationIds: [], closedWeekIds: [] };

/** A mapped catalogue requires an example of every command kind at typecheck. */
const commands = {
  CreateProfile: { ...envelope, kind: 'CreateProfile', payload: { newProfileId: 'new-profile', nickname: 'Iona', avatarId: 'iona' } },
  RenameProfile: { ...captured, kind: 'RenameProfile', payload: { nickname: 'New name' } },
  SetAvatar: { ...captured, kind: 'SetAvatar', payload: { avatarId: 'rowan' } },
  ChooseCosmetic: { ...captured, kind: 'ChooseCosmetic', payload: { choice: { kind: 'appearance', value: INITIAL_CREATIVE_STATE } } },
  SetProfilePreferences: { ...captured, kind: 'SetProfilePreferences', payload: { patch: { motion: 'reduced' } } },
  SetAudioPreferences: { ...envelope, kind: 'SetAudioPreferences', payload: { patch: { music: { volume: 0 } } } },
  OpenEncounter: { ...captured, kind: 'OpenEncounter', payload: { route: { kind: 'quest', questId: 'Q1', bindingId: story.bindingId }, suppressDueReviewForVisit: false } },
  RecordAssistance: { ...captured, kind: 'RecordAssistance', payload: { encounterId: encounter.encounterId, assistanceKind: 'answer-hint', hintId: 'h1' } },
  SaveDraft: { ...captured, kind: 'SaveDraft', payload: { encounterId: encounter.encounterId, responseDraft: partialDraft } },
  SubmitCheck: { ...captured, kind: 'SubmitCheck', payload: { encounterId: encounter.encounterId, learningEpisodeOrdinal: 2, submissionId: 'submission-2', checkSequence: 2, response } },
  SuspendEncounter: { ...captured, kind: 'SuspendEncounter', payload: { encounterId: encounter.encounterId, learningEpisodeOrdinal: 2, responseDraft: partialDraft } },
  FinishPractice: { ...captured, kind: 'FinishPractice', payload: { encounterId: encounter.encounterId, learningEpisodeOrdinal: 1 } },
  DeleteProfile: { ...captured, kind: 'DeleteProfile', payload: {} },
  StartOver: { ...captured, kind: 'StartOver', payload: { newProfileId: 'replacement-profile', nickname: 'Pip', avatarId: 'pip' } },
  ResetSave: { ...envelope, kind: 'ResetSave', payload: {} },
  ReplaceSave: { ...envelope, kind: 'ReplaceSave', payload: { preparedImportId: 'preview-1' } },
  ReconcileCalendar: { ...envelope, kind: 'ReconcileCalendar', payload: {} },
} satisfies { [K in StateCommand['kind']]: Extract<StateCommand, { kind: K }> };
const opens: readonly OpenEncounterPayload[] = [
  { route: { kind: 'optional-transfer', bindingId: transfer.bindingId }, suppressDueReviewForVisit: false },
  { route: { kind: 'revisit', bindingId: revisit.bindingId }, suppressDueReviewForVisit: true },
  { route: { kind: 'practice', mode: 'suggested' }, suppressDueReviewForVisit: true },
  { resumeEncounterId: encounter.encounterId, suppressDueReviewForVisit: false },
];
const results: readonly CommitResult[] = [
  { status: 'committed', snapshot, changes }, { status: 'already-applied', snapshot }, { status: 'conflict', snapshot },
  { status: 'invalid', reason: { code: 'invalid-command', message: 'Please try that action again.' } },
  { status: 'save-failed', reason: { code: 'storage-write-failed', message: 'Could not save. Retry.' }, retryable: true, snapshot },
  { status: 'unsupported', reason: { code: 'unsupported-content', message: 'This content version is unavailable.' } },
];
function resultDisposition(result: CommitResult): 'saved' | 'unchanged' | 'failed' {
  switch (result.status) {
    case 'committed': return 'saved';
    case 'already-applied': return 'unchanged';
    case 'conflict': case 'invalid': case 'save-failed': case 'unsupported': return 'failed';
    default: { const exhaustive: never = result; return exhaustive; }
  }
}
const freshProjection: CommittedActivityProjection = {
  token, profileId, encounterId: encounter.encounterId, learningEpisodeOrdinal: 1, episodeStatus: 'open', nextCheckSequence: 1,
  task, responseDraft: null, lastEvaluation: null, lastCheck: null, revealedAssistanceIds: [], bindingProvenance: provenance,
  selectionReason: encounter.selectionReason, familiar: false, reviewReference: null,
  rewardDisplay: { eligibility: encounter.eligibility, earningWeek: null, slot: null, components: null, earningWeekOpen: false, lastCommittedDelta: null },
};
const historicalProjection: CommittedActivityProjection = {
  ...freshProjection, learningEpisodeOrdinal: 2, nextCheckSequence: 2, responseDraft: resumed.responseDraft,
  lastEvaluation: wrongCheck.lastCommittedCheck!.evaluation, lastCheck: wrongCheck.lastCommittedCheck, revealedAssistanceIds: resumed.revealedAssistanceIds,
  rewardDisplay: { eligibility: encounter.eligibility, earningWeek: opportunity.earningWeek, slot: opportunity.slot,
    components: opportunity.components, earningWeekOpen: true, lastCommittedDelta: delta },
};
const projections: readonly ActivityProjectionResult[] = [
  { status: 'ready', activity: freshProjection }, { status: 'ready', activity: historicalProjection },
  ...(['profile-missing', 'encounter-expired', 'content-unavailable'] as const).map(reason => ({ status: 'unavailable' as const, reason, token })),
];
const preferences: PreferenceStatus = {
  requestedAudio: { ...INITIAL_AUDIO_PREFERENCES, silenceAll: true }, requestedProfileById: { [profileId]: INITIAL_PROFILE_PREFERENCES },
  loadStatus: 'loaded', generation: 3, savedGeneration: 2, pending: true, failed: false,
};

/** Finite construction probes only; real binding, save and command validation
 * belongs to WP03/WP04 consumers, not this type-only producer. */
function bindingFixtureMatches(value: EncounterSave, bindings: readonly QuestActivityBinding[]): boolean {
  if (!value.bindingProvenance) return true;
  const p = value.bindingProvenance;
  const binding = bindings.find(b => b.bindingId === p.bindingId);
  if (!binding || binding.questId !== p.questId || binding.role !== p.role || !binding.taskIds.includes(value.canonicalQuestionId)) return false;
  return binding.role !== 'optional-transfer' || bindings.some(b => b.bindingId === binding.sourceBindingId && b.role === 'story' && b.taskIds.length === 1);
}

describe('WP04-01A single save and command contract fixtures', () => {
  it.each(Object.values(commands))('serializes $kind with its token and captured scope', command => {
    expect(roundTrip(command)).toEqual(command);
    expect(command.expected).toEqual(token);
    if (['CreateProfile', 'ResetSave', 'ReplaceSave', 'ReconcileCalendar', 'SetAudioPreferences'].includes(command.kind)) {
      expect(command).not.toHaveProperty('profileId');
    } else expect(command).toHaveProperty('profileId', profileId);
  });
  it('serializes exclusive transfer, revisit, practice and resume intents', () => {
    expect(roundTrip(opens)).toEqual(opens);
    for (const open of opens) expect(('route' in open) !== ('resumeEncounterId' in open)).toBe(true);
  });
  it('retains cumulative identity/counts and historical attribution while episode-local counts reset', () => {
    expect(finished.learningEpisode).toMatchObject({ ordinal: 1, validChecks: 1, firstCheckSequence: 1, status: 'completed-unsuccessful' });
    expect(resumed.learningEpisode).toMatchObject({ ordinal: 2, validChecks: 0, firstCheckSequence: null, completionActionId: null });
    expect(resumed.validChecks).toBe(1);
    expect(commands.SubmitCheck.payload).toMatchObject({ learningEpisodeOrdinal: 2, checkSequence: 2 });
    expect(resumed.opportunityId).toBe(finished.opportunityId);
    expect(resumed.bindingProvenance).toEqual(finished.bindingProvenance);
    expect(resumed.firstCheckCorrect).toBe(false);
    expect(resumed.assistance).toEqual(finished.assistance);
    expect(resumed.assistance.answerHintUsed).toBe(true);
    expect(succeeded).toMatchObject({ opportunityId: finished.opportunityId, validChecks: 2, firstCheckCorrect: false,
      learningEpisode: { ordinal: 2, validChecks: 1, firstCheckSequence: 2, status: 'completed-success' },
      lastCommittedCheck: { checkSequence: 2, learningEpisodeOrdinal: 2 } });
    expect(succeeded.assistance).toEqual(finished.assistance);
    expect(roundTrip(succeeded)).toEqual(succeeded);
    expect(historicalProjection.lastCheck).toMatchObject({ learningEpisodeOrdinal: 1, checkSequence: 1, response: partialDraft });
    expect(historicalProjection.responseDraft).not.toEqual(historicalProjection.lastCheck?.response);
    expect(commands.FinishPractice.payload).not.toHaveProperty('checkSequence');
  });
  it('constructs a producer finish observation without inventing a Check or submission', () => {
    const observation: LearningObservation = { kind: 'finished-unsuccessfully', eventId: envelope.actionId, profileId,
      encounterId: encounter.encounterId, learningEpisodeOrdinal: 1, canonicalQuestionId: task.canonicalQuestionId,
      skillId: task.skillId, objectiveId: task.objectiveId, band: task.band, selectionReason: encounter.selectionReason,
      localDate: '2026-10-09', competitionWeekId: '2026-10-05', familiar: false, reviewReference: null, assistance,
      episodeCompletion: 'deliberate-unsuccessful' };
    expect(roundTrip(observation)).toEqual(observation);
    expect(observation).not.toHaveProperty('submissionId');
    expect(observation).not.toHaveProperty('encounterCheckIndex');
  });
  it('round-trips complete household state without local root token, full task or transient selection', () => {
    expect(roundTrip(save)).toEqual(save);
    expect(roundTrip(root)).toEqual(root);
    expect(save).not.toHaveProperty('epoch');
    expect(save).not.toHaveProperty('activeProfileId');
    expect(profile.encounters[encounter.encounterId]).not.toHaveProperty('task');
    expect(profile.encounters[encounter.encounterId]).not.toHaveProperty('contentRevision');
    expect(SAVE_LIMITS).toMatchObject({ profiles: 16, backupBytes: 16_777_216, archivedWeeks: 52 });
  });
  it('represents all six results and exposes changes only on a new committed result', () => {
    expect(roundTrip(results)).toEqual(results);
    expect(results.map(r => r.status)).toEqual(['committed', 'already-applied', 'conflict', 'invalid', 'save-failed', 'unsupported']);
    for (const r of results) if (r.status !== 'committed') expect(r).not.toHaveProperty('changes');
    expect(results.map(resultDisposition)).toEqual(['saved', 'unchanged', 'failed', 'failed', 'failed', 'failed']);
  });
  it('represents instruction, assessed-reading, hint and worked-help recording separately', () => {
    const recording: readonly Extract<StateCommand, { kind: 'RecordAssistance' }>[] = [
      { ...captured, kind: 'RecordAssistance', payload: { encounterId: encounter.encounterId, assistanceKind: 'instruction-read-aloud' } },
      { ...captured, kind: 'RecordAssistance', payload: { encounterId: encounter.encounterId, assistanceKind: 'assessed-text-read-aloud' } },
      commands.RecordAssistance,
      { ...captured, kind: 'RecordAssistance', payload: { encounterId: encounter.encounterId, assistanceKind: 'worked-support', hintId: task.workedSupport.id } },
    ];
    expect(roundTrip(recording)).toEqual(recording);
    expect(recording[0].payload).not.toHaveProperty('hintId');
    expect(recording[1].payload).not.toHaveProperty('hintId');
  });
  it('represents nullable fresh/partial attributed reads and unavailable keys/revisions', () => {
    expect(roundTrip(projections)).toEqual(projections);
    expect(freshProjection).toMatchObject({ responseDraft: null, lastEvaluation: null, lastCheck: null });
    expect(historicalProjection.lastEvaluation?.correct).toBe(false);
    expect(historicalProjection.rewardDisplay.lastCommittedDelta).toBe(delta);
  });
  it('keeps requested pending silence distinct from durable preferences and exact defaults', () => {
    expect(INITIAL_AUDIO_PREFERENCES).toEqual({ soundEnabled: false, silenceAll: false, music: { muted: false, volume: .25 }, effects: { muted: false, volume: .5 } });
    expect(INITIAL_PROFILE_PREFERENCES).toEqual({ instructionReadAloud: false, motion: 'system' });
    expect(preferences.requestedAudio.silenceAll).toBe(true);
    expect(snapshot.save.installation.audio.silenceAll).toBe(false);
    expect(roundTrip({ ...preferences, pending: false, failed: true, errorCode: 'storage-write-failed' })).toMatchObject({ generation: 3, savedGeneration: 2, failed: true });
  });
  it('constructs permanent source completion with no source encounter or extra history store', () => {
    const compacted: ProfileSave = { ...profile, encounters: {}, learning: { evidence: {}, canonicalHistory: [] },
      world: { completedQuestIds: ['Q1'], completedStoryBindingIds: [story.bindingId] } };
    const restored = roundTrip(compacted);
    const source = [story, transfer].find(b => b.bindingId === transfer.sourceBindingId)!;
    expect(restored.world.completedStoryBindingIds).toContain(source.bindingId);
    expect(source.taskIds).toEqual([task.canonicalQuestionId]);
    expect(restored.encounters).toEqual({});
  });
  it('rejects mismatched provenance/task and unknown transfer source in bounded fixture probes', () => {
    expect(bindingFixtureMatches(encounter, [story])).toBe(true);
    expect(bindingFixtureMatches({ ...encounter, bindingProvenance: { ...provenance, questId: 'Q2' } }, [story])).toBe(false);
    const transferEncounter: EncounterSave = { ...encounter, canonicalQuestionId: transfer.taskIds[0],
      descriptor: { ...task.descriptor, parameters: { target: 13 } }, selectionReason: 'transfer',
      bindingProvenance: { bindingId: transfer.bindingId, questId: transfer.questId, role: transfer.role } };
    expect(bindingFixtureMatches(transferEncounter, [story, transfer])).toBe(true);
    expect(bindingFixtureMatches(transferEncounter, [transfer])).toBe(false);
    const revisited: EncounterSave = { ...encounter, selectionReason: 'repeat-practice', bindingProvenance: { bindingId: revisit.bindingId, questId: revisit.questId, role: revisit.role } };
    expect(bindingFixtureMatches(revisited, [revisit])).toBe(true);
    expect(bindingFixtureMatches({ ...encounter, selectionReason: 'adaptive-practice', bindingProvenance: null }, [])).toBe(true);
    const scopedResume = (s: CommittedSnapshot, id: string, encounterId: string) => s.save.profiles[id]?.encounters[encounterId] ?? null;
    expect(scopedResume(snapshot, 'other-profile', encounter.encounterId)).toBeNull();
    expect(scopedResume(snapshot, profileId, 'compacted-encounter')).toBeNull();
  });
  it('constructs synchronous reducer/validator/read ports without a repository implementation', () => {
    const reduce: ReduceCommand = () => ({ status: 'changed', save, changes });
    const validate: ValidateSave = () => ({ status: 'valid', save });
    const select: SelectCommittedActivity = () => projections[0];
    const context: TransitionContext = { nowEpochMs: 0, catalogue: [task], questBindings: [story], milestone: 'M1', allocatedIds: {} };
    const validationFailure: ValidationResult = { status: 'invalid', issues: [{ path: 'profiles', code: 'invalid-save', message: 'Invalid profile.' }] };
    const loads: readonly LoadResult[] = [{ status: 'absent' }, { status: 'new', snapshot }, { status: 'ready', snapshot },
      { status: 'blocked', reason: { code: 'storage-blocked', message: 'Close other game tabs.' } },
      { status: 'unreadable', reason: { code: 'storage-unreadable', message: 'Save could not be read.' } },
      { status: 'unsupported', reason: { code: 'unsupported-schema', message: 'Save version unavailable.' } }];
    expect(reduce(root, commands.OpenEncounter, context).status).toBe('changed');
    expect(validate(save, [task]).status).toBe('valid');
    expect(select(snapshot, [task], { profileId, encounterId: encounter.encounterId }).status).toBe('ready');
    expect(roundTrip(validationFailure)).toEqual(validationFailure);
    expect(roundTrip(loads)).toEqual(loads);
  });
  it('types a facade with current callback readiness and stable snapshot subscription', async () => {
    let current: TransientReadiness = { dirty: false, pending: false, failed: false };
    const inputs: StateControllerReadinessInput = { readTransientReadiness: () => current };
    // Test-only port consumer, not the production queue/readiness implementation.
    const readiness = (): UpdateReadiness => { const live = inputs.readTransientReadiness(); const unsavedTransition = live.dirty || live.pending || live.failed;
      return { ready: !unsavedTransition, pendingCommands: 0, pendingPreferences: false, failedCommand: false, failedPreferences: false, unsavedTransition }; };
    let unsubscribed = false;
    const facade: StateController = { getSnapshot: () => snapshot, subscribe: () => () => { unsubscribed = true; },
      dispatch: async () => results[0], refresh: async () => results[1], getUpdateReadiness: readiness, flush: async () => readiness() };
    expect(facade.getSnapshot()).toBe(facade.getSnapshot());
    const unsubscribe = facade.subscribe(() => {});
    current = { dirty: true, pending: false, failed: true };
    expect(await facade.flush()).toMatchObject({ ready: false, unsavedTransition: true });
    current = { dirty: false, pending: false, failed: false };
    expect(facade.getUpdateReadiness().ready).toBe(true);
    unsubscribe(); expect(unsubscribed).toBe(true);
  });
  it('keeps domain producers independent of state, UI and runtime imports', () => {
    for (const file of ['learning/contracts.ts', 'rewards/contracts.ts', 'experience/types.ts']) {
      const source = readFileSync(new URL(`../../src/${file}`, import.meta.url), 'utf8');
      expect(source).not.toMatch(/from\s+['"][^'"]*(?:state|react|controller)/);
    }
    const source = readFileSync(new URL('../../src/state/contracts.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/from\s+['"][^'"]*(?:idb|controller|transition|react)/);
    expect(source.match(/from '..\/learning\/contracts'/g)).toHaveLength(1);
    expect(source.match(/from '..\/rewards\/contracts'/g)).toHaveLength(1);
    expect(source.match(/from '..\/experience\/types'/g)).toHaveLength(1);
  });
});

/** Compile-only adversarial consumer examples. No production validation claim. */
function forbiddenExamples(): void {
  // @ts-expect-error Every mutation requires the preview/dispatch token.
  const missingToken: StateCommand = { actionId: 'a', kind: 'ResetSave', payload: {} };
  // @ts-expect-error An existing-profile action cannot defer profile selection.
  const missingProfile: StateCommand = { ...envelope, kind: 'DeleteProfile', payload: {} };
  // @ts-expect-error Installation actions cannot carry a selected profile.
  const globalWithProfile: StateCommand = { ...captured, kind: 'ResetSave', payload: {} };
  // @ts-expect-error A resume cannot supply any replacement fresh route.
  const mixedOpen: OpenEncounterPayload = { route: { kind: 'practice', mode: 'suggested' }, resumeEncounterId: 'e', suppressDueReviewForVisit: false };
  // @ts-expect-error SubmitCheck carries no caller correctness claim.
  const claimedCorrect: StateCommand = { ...commands.SubmitCheck, payload: { ...commands.SubmitCheck.payload, correct: true } };
  // @ts-expect-error SubmitCheck carries no caller score delta.
  const claimedScore: StateCommand = { ...commands.SubmitCheck, payload: { ...commands.SubmitCheck.payload, points: 20 } };
  // @ts-expect-error SubmitCheck carries no caller world patch.
  const claimedWorld: StateCommand = { ...commands.SubmitCheck, payload: { ...commands.SubmitCheck.payload, world: profile.world } };
  // @ts-expect-error SubmitCheck requires cumulative sequence and episode identity.
  const missingEpisode: StateCommand = { ...captured, kind: 'SubmitCheck', payload: { encounterId: 'e', submissionId: 's', checkSequence: 1, response } };
  // @ts-expect-error Finish is not a new Check.
  const finishCheck: StateCommand = { ...commands.FinishPractice, payload: { ...commands.FinishPractice.payload, checkSequence: 2 } };
  // @ts-expect-error Caller cannot choose calendar dates.
  const callerDate: StateCommand = { ...commands.ReconcileCalendar, payload: { date: '2026-10-05' } };
  // @ts-expect-error Caller cannot import raw save through a replacement command.
  const rawImport: StateCommand = { ...commands.ReplaceSave, payload: { save } };
  // @ts-expect-error Assistance reveal requires the approved hint ID.
  const anonymousHint: StateCommand = { ...captured, kind: 'RecordAssistance', payload: { encounterId: 'e', assistanceKind: 'answer-hint' } };
  // @ts-expect-error Completion records require action attribution.
  const missingClosure: LearningEpisode = { ordinal: 1, status: 'completed-unsuccessful', validChecks: 1, firstCheckSequence: 1, completionActionId: null };
  // @ts-expect-error Already-applied cannot celebrate again.
  const replayChanges: CommitResult = { status: 'already-applied', snapshot, changes };
  // @ts-expect-error Conflict cannot expose newly earned changes.
  const conflictChanges: CommitResult = { status: 'conflict', snapshot, changes };
  // @ts-expect-error Failed save cannot expose newly earned changes.
  const failedChanges: CommitResult = { status: 'save-failed', snapshot, changes, retryable: true, reason: { code: 'storage-write-failed', message: 'Retry' } };
  // @ts-expect-error Invalid result cannot be interpreted as a newly saved snapshot.
  const invalidSnapshot: CommitResult = { status: 'invalid', snapshot, reason: { code: 'invalid-command', message: 'Retry' } };
  // @ts-expect-error Unsupported results cannot celebrate changes.
  const unsupportedChanges: CommitResult = { status: 'unsupported', changes, reason: { code: 'unsupported-content', message: 'Unavailable' } };
  // @ts-expect-error Portable save never contains local root epoch.
  const portableToken: SaveDataV1 = { ...save, epoch: token.epoch };
  // @ts-expect-error Snapshot consumers cannot mutate nested world progress.
  snapshot.save.profiles[profileId].world.completedQuestIds.push('Q2');
  // @ts-expect-error No caller role in fresh route intent.
  const claimedRole: OpenEncounterPayload = { route: { kind: 'quest', questId: 'Q1', role: 'story' }, suppressDueReviewForVisit: false };
  void [missingToken, missingProfile, globalWithProfile, mixedOpen, claimedCorrect, claimedScore, claimedWorld, missingEpisode,
    finishCheck, callerDate, rawImport, anonymousHint, missingClosure, replayChanges, conflictChanges, failedChanges,
    invalidSnapshot, unsupportedChanges, portableToken, claimedRole];
}
void forbiddenExamples;
