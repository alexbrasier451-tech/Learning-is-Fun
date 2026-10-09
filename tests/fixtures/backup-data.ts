import type { SaveDataV1, ProfileSave, EncounterSave } from '../../src/state/contracts';
import { INITIAL_AUDIO_PREFERENCES, INITIAL_PROFILE_PREFERENCES } from '../../src/state/contracts';
import { SUPPORTED_CONTENT_VERSION, SUPPORTED_REWARD_POLICY_VERSION } from '../../src/state/backup';
import { INITIAL_CREATIVE_STATE } from '../../src/experience/catalogue';
import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { resolveBindingIntent, selectNextActivity } from '../../src/learning/select';
import { applyLearningObservation } from '../../src/learning/evidence';
import { evaluateResponse } from '../../src/learning/evaluate';
import type { ActivityResponse, LearningAssistance, SelectionReason, TaskDefinition } from '../../src/learning/contracts';
import type { RewardSelectionFacts, CanonicalRewardTrack } from '../../src/rewards/contracts';
import { applyCheckRewards, applyQuestReward, classifyRewardEligibility } from '../../src/rewards/scoring';
import { reconcileCompetitionWeek } from '../../src/rewards/calendar';
import { rankPositiveScores } from '../../src/rewards/standings';

export const BACKUP_DATE = '2026-10-13T12:00:00.000Z';
export const BACKUP_CATALOGUE = listTasks();
const help: LearningAssistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' };
const newProfile = (profileId: string, nickname: string): ProfileSave => ({
  identity: { profileId, nickname, avatarId: 'pip' }, preferences: INITIAL_PROFILE_PREFERENCES,
  learning: { evidence: {}, canonicalHistory: [] }, encounters: {},
  world: { completedQuestIds: [], completedStoryBindingIds: [] }, creative: INITIAL_CREATIVE_STATE,
  rewards: { lifetimePoints: 0, tracksByCanonical: {}, questReceipts: [], entitlementIds: [] },
  personalRecords: { best: null, medals: { gold: 0, silver: 0, bronze: 0 } },
});
export function emptyBackupSave(): SaveDataV1 {
  return structuredClone({ schemaVersion: 1, contentVersion: SUPPORTED_CONTENT_VERSION, rewardPolicyVersion: SUPPORTED_REWARD_POLICY_VERSION,
    installation: { timezone: 'Europe/London', audio: INITIAL_AUDIO_PREFERENCES }, profiles: {},
    competition: { timezone: 'Europe/London', latestOpenedWeek: null, currentScores: {}, currentSlots: {}, archives: [], policyVersion: SUPPORTED_REWARD_POLICY_VERSION } });
}
/** State adaptation is fixture-owned; every judgement, reward, compact total,
 * episode evidence, rank, best and medal comes from an actual accepted producer. */
export function multiProfileBackupSave(keepSource = false, includeFamilies = false, oldHelpThenIndependentReview = false): SaveDataV1 {
  let save: SaveDataV1 = { ...emptyBackupSave(), profiles: { ada: newProfile('ada', 'Ada'), ben: newProfile('ben', 'Ben') },
    competition: { ...emptyBackupSave().competition, latestOpenedWeek: '2026-10-05' } };
  function replaceProfile(p: ProfileSave) { save = { ...save, profiles: { ...save.profiles, [p.identity.profileId]: p } }; }
  function judged(task: TaskDefinition, encounterId: string, reason: SelectionReason, response: ActivityResponse,
    assistance: LearningAssistance, binding: EncounterSave['bindingProvenance'], previousWeek?: string) {
    let p = save.profiles.ada; const canonical = task.canonicalQuestionId;
    const previous: CanonicalRewardTrack = p.rewards.tracksByCanonical[canonical] ?? { lastAllocatedOrdinal: 0, completedThroughOrdinal: 0, closedAwardTotal: 0, freePractice: { validChecks: 0, answerHintUsed: false } };
    const facts: RewardSelectionFacts = { profileId: 'ada', canonicalQuestionId: canonical, encounterId,
      selectionReason: reason === 'story-anchor' ? 'story' : reason === 'due-review' ? 'due-review' : 'adaptive',
      candidate: reason === 'due-review' ? 'later-week-due-review' : 'first-encounter', band: task.band,
      ...(previousWeek ? { previousSuccessWeek: previousWeek, dueLocalDate: '2026-10-12' } : {}) };
    const context = { activeWeek: save.competition.latestOpenedWeek!, observedLocalDate: save.competition.latestOpenedWeek === '2026-10-05' ? '2026-10-06' : '2026-10-13', clockRollback: false };
    const eligibility = classifyRewardEligibility({ track: previous, selection: facts, context });
    const opportunityId = `op-${encounterId}`;
    const track: CanonicalRewardTrack = { ...previous, lastAllocatedOrdinal: previous.lastAllocatedOrdinal + 1,
      currentOpportunity: { opportunityId, profileId: 'ada', canonicalQuestionId: canonical, ordinal: previous.lastAllocatedOrdinal + 1,
        selectionFacts: facts, earningWeek: null, slot: null, validChecks: 0, answerHintUsed: assistance.answerHintUsed || assistance.workedSupportUsed,
        components: { answer: false, independentSuccess: false, supportedSuccess: false } } };
    p = { ...p, rewards: { ...p.rewards, tracksByCanonical: { ...p.rewards.tracksByCanonical, [canonical]: track } } };
    const evaluation = evaluateResponse(task, response); if (evaluation.status !== 'judged') throw new Error('Fixture needs a judged response');
    const submissionId = `check-${encounterId}`;
    const scored = applyCheckRewards({ profileId: 'ada', encounterId, opportunityId, submissionId, checkSequence: 1,
      validChecks: 0, track, rewards: p.rewards, evaluation, assistance, selection: facts, competition: save.competition, context });
    const reviewReference = previousWeek ? { canonicalQuestionId: canonical, dueLocalDate: '2026-10-12', previousSuccessWeek: previousWeek } : null;
    let evidence = applyLearningObservation(p.learning.evidence, { eventId: submissionId, profileId: 'ada', encounterId,
      learningEpisodeOrdinal: 1, canonicalQuestionId: canonical, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
      selectionReason: reason, localDate: context.observedLocalDate, competitionWeekId: context.activeWeek,
      familiar: !!previousWeek, reviewReference, assistance, kind: 'check', submissionId, episodeCheckIndex: 1,
      encounterCheckIndex: 1, firstCheckCorrect: evaluation.correct,
      issues: evaluation.feedback.issues, ...(evaluation.correct ? { correct: true, episodeCompletion: 'success' } : { correct: false, episodeCompletion: null }) });
    if (!evaluation.correct) evidence = applyLearningObservation(evidence, { eventId: `finish-${encounterId}`, profileId: 'ada', encounterId,
      learningEpisodeOrdinal: 1, canonicalQuestionId: canonical, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
      selectionReason: reason, localDate: context.observedLocalDate, competitionWeekId: context.activeWeek, familiar: false,
      reviewReference, assistance, kind: 'finished-unsuccessfully', episodeCompletion: 'deliberate-unsuccessful' });
    const e: EncounterSave = { encounterId, opportunityId, canonicalQuestionId: canonical, descriptor: task.descriptor,
      taskContentRevision: task.contentRevision, skillId: task.skillId, band: task.band, selectionReason: reason, bindingProvenance: binding,
      familiar: !!previousWeek, reviewReference, validChecks: 1, firstCheckCorrect: evaluation.correct, assistance,
      learningEpisode: { ordinal: 1, validChecks: 1, firstCheckSequence: 1,
        status: evaluation.correct ? 'completed-success' : 'completed-unsuccessful', completionActionId: evaluation.correct ? submissionId : `finish-${encounterId}` },
      responseDraft: response, revealedAssistanceIds: assistance.answerHintUsed ? [task.hints[0].id] : [], eligibility,
      lastCommittedCheck: { submissionId, checkSequence: 1, learningEpisodeOrdinal: 1, response, evaluation, delta: scored.delta } };
    const old = p.learning.canonicalHistory.find(h => h.canonicalQuestionId === canonical);
    replaceProfile({ ...p, rewards: scored.nextRewards, learning: { evidence, canonicalHistory: [
      ...p.learning.canonicalHistory.filter(h => h.canonicalQuestionId !== canonical),
      { canonicalQuestionId: canonical, pendingEncounterId: evaluation.correct ? null : encounterId, everChecked: true,
        previousSuccessLocalDate: evaluation.correct ? context.observedLocalDate : old?.previousSuccessLocalDate ?? null,
        previousSuccessWeek: evaluation.correct ? context.activeWeek : old?.previousSuccessWeek ?? null,
        checkedCompetitionWeekIds: [...new Set([...(old?.checkedCompetitionWeekIds ?? []), context.activeWeek])], assistance },
    ] }, encounters: { ...p.encounters, [encounterId]: e } });
    save = { ...save, competition: scored.nextCompetition };
  }
  const story = BACKUP_CATALOGUE.find(t => t.canonicalQuestionId === 'lif.math.bridge.r1.total-12')!;
  judged(story, 'source', 'story-anchor', { kind: 'bridge', planks: [6, 6] }, oldHelpThenIndependentReview ? { ...help, answerHintUsed: true } : help, { bindingId: 'q1-story-m01', questId: 'Q1', role: 'story' });
  let p = save.profiles.ada;
  const quest = applyQuestReward({ profileId: 'ada', questId: 'Q1', questCompleted: true, rewards: p.rewards });
  const sourceCheck = p.encounters.source.lastCommittedCheck!;
  replaceProfile({ ...p, rewards: quest.nextRewards,
    world: { completedQuestIds: ['Q1'], completedStoryBindingIds: ['q1-story-m01'] },
    encounters: { ...p.encounters, source: { ...p.encounters.source, lastCommittedCheck: { ...sourceCheck, delta: {
      ...sourceCheck.delta, lifetimeDelta: sourceCheck.delta.lifetimeDelta + quest.delta.lifetimeDelta,
      newReceiptKeys: [...sourceCheck.delta.newReceiptKeys, ...quest.delta.newReceiptKeys],
      newEntitlementIds: [...sourceCheck.delta.newEntitlementIds, ...quest.delta.newEntitlementIds],
    } } } } });
  const reconciled = reconcileCompetitionWeek({ competition: save.competition,
    profiles: Object.values(save.profiles).map(p => ({ ...p.identity, lifetimePoints: p.rewards.lifetimePoints, personalRecords: p.personalRecords })) }, Date.parse(BACKUP_DATE));
  save = { ...save, competition: reconciled.nextCompetition, profiles: Object.fromEntries(Object.entries(save.profiles).map(([id, p]) => [id, { ...p, personalRecords: reconciled.nextPersonalRecordsByProfile[id] }])) };
  // Real due-review completion folds the old source reward through WP05's compactor.
  judged(story, 'review', 'due-review', { kind: 'bridge', planks: [6, 6] }, oldHelpThenIndependentReview ? help : { ...help, answerHintUsed: true }, null, '2026-10-05');
  p = save.profiles.ada;
  const { source: _source, ...retained } = p.encounters; replaceProfile({ ...p, encounters: keepSource ? p.encounters : retained });
  const resolved = resolveBindingIntent({ route: { kind: 'optional-transfer', bindingId: 'q1-transfer-m01' }, milestone: 'M1',
    bindings: QUEST_ACTIVITY_BINDINGS, catalogue: BACKUP_CATALOGUE, accessibleQuestIds: ['Q1', 'Q2'], completedStoryBindingIds: p.world.completedStoryBindingIds });
  if (resolved.status !== 'resolved') throw new Error('Transfer must survive source encounter compaction');
  const selected = selectNextActivity({ catalogue: BACKUP_CATALOGUE, intent: resolved.intent, evidence: {}, activeEncounter: null,
    canonicalHistory: [], calendar: { todayDate: '2026-10-13', competitionWeekId: '2026-10-12', reviewIn3DaysDate: '2026-10-16', reviewIn7DaysDate: '2026-10-20' }, suppressDueReviewForVisit: false });
  if (selected.status !== 'selected') throw new Error('Transfer task unavailable');
  judged(BACKUP_CATALOGUE.find(t => t.canonicalQuestionId === selected.canonicalQuestionId)!, 'transfer', selected.reason,
    { kind: 'bridge', planks: [1] }, { ...help, answerHintUsed: true }, selected.bindingProvenance);
  if (includeFamilies) {
    const punctuation = BACKUP_CATALOGUE.find(t => t.canonicalQuestionId === 'lif.english.punctuation.r1.spellbook-anchor')!;
    judged(punctuation, 'punctuation', 'adaptive-practice', { kind: 'punctuation', slots: { question: '?', discovery: '!' } }, help, null);
    const merchant = BACKUP_CATALOGUE.find(t => t.canonicalQuestionId === 'lif.math.merchant.r1.mult-2.pears-3')!;
    judged(merchant, 'merchant', 'adaptive-practice', { kind: 'merchant', apples: 6, pears: 3 }, help, null);
  }
  p = save.profiles.ada; replaceProfile({ ...p, creative: { ...p.creative, scarfColourId: 'plum', scarfPatternId: 'scarf-leaf' },
    preferences: { instructionReadAloud: true, motion: 'reduced' } });
  return structuredClone({ ...save, installation: { ...save.installation, audio: { soundEnabled: true, silenceAll: false,
    music: { muted: true, volume: .12 }, effects: { muted: false, volume: .8 } } } });
}

/** Sixteen complete compact households, each built from the actual producer
 * fixture above. Rewrite opaque identities only; shared tied archive ranks stay 1. */
export function compactCapacityBackupSave(): SaveDataV1 {
  const base = multiProfileBackupSave(); const template = base.profiles.ada;
  const profiles: Record<string, ProfileSave> = {}, currentScores: Record<string, number> = {}, currentSlots: Record<string, SaveDataV1['competition']['currentSlots'][string]> = {};
  const identities = new Set(['ada', 'source', 'review', 'transfer', 'op-source', 'op-review', 'op-transfer', 'check-source', 'check-review', 'check-transfer', 'finish-transfer']);
  function remap(value: unknown, prefix: string): unknown {
    if (typeof value === 'string') return identities.has(value) ? `${prefix}-${value}` : value;
    if (Array.isArray(value)) return value.map(v => remap(v, prefix));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [identities.has(k) ? `${prefix}-${k}` : k, k === 'selectionReason' ? v : remap(v, prefix)]));
    return value;
  }
  for (let n = 1; n <= 16; n++) {
    const prefix = `p${String(n).padStart(2, '0')}`, profileId = `${prefix}-ada`;
    const p = remap(template, prefix) as ProfileSave;
    profiles[profileId] = { ...p, identity: { ...p.identity, nickname: `Child ${n}` } };
    currentScores[profileId] = base.competition.currentScores.ada;
    currentSlots[profileId] = remap(base.competition.currentSlots.ada, prefix) as typeof currentSlots[string];
  }
  return { ...base, profiles, competition: { ...base.competition, currentScores, currentSlots,
    archives: base.competition.archives.map(a => ({ ...a, entries: rankPositiveScores(Object.values(profiles).map(p => ({ ...p.identity, points: a.entries[0].points }))) })) } };
}

/** Genuinely fresh complete policy path after imported unsuccessful closure:
 * same opportunity/slot/help, ordinal 2, Check 2 and only the supported remainder. */
export function resumedTransferBackupSave(): SaveDataV1 {
  const save = multiProfileBackupSave(), p = save.profiles.ada, e = p.encounters.transfer;
  const task = BACKUP_CATALOGUE.find(t => t.canonicalQuestionId === e.canonicalQuestionId)!;
  const response: ActivityResponse = { kind: 'bridge', planks: [5, 5] }, evaluation = evaluateResponse(task, response);
  if (evaluation.status !== 'judged' || !evaluation.correct) throw new Error('Fresh resume needs accepted transfer success');
  const track = p.rewards.tracksByCanonical[e.canonicalQuestionId], selection = track.currentOpportunity!.selectionFacts;
  const context = { activeWeek: '2026-10-12', observedLocalDate: '2026-10-13', clockRollback: false };
  const scored = applyCheckRewards({ profileId: 'ada', encounterId: e.encounterId, opportunityId: e.opportunityId,
    submissionId: 'check-transfer-2', checkSequence: 2, validChecks: 1, track, rewards: p.rewards, evaluation,
    assistance: e.assistance, selection, competition: save.competition, context });
  const evidence = applyLearningObservation(p.learning.evidence, { eventId: 'check-transfer-2', profileId: 'ada', encounterId: e.encounterId,
    learningEpisodeOrdinal: 2, canonicalQuestionId: e.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId,
    band: task.band, selectionReason: e.selectionReason, localDate: context.observedLocalDate, competitionWeekId: context.activeWeek,
    familiar: e.familiar, reviewReference: e.reviewReference, assistance: e.assistance, kind: 'check', submissionId: 'check-transfer-2',
    episodeCheckIndex: 1, encounterCheckIndex: 2, firstCheckCorrect: false, correct: true, issues: evaluation.feedback.issues, episodeCompletion: 'success' });
  return { ...save, competition: scored.nextCompetition, profiles: { ...save.profiles, ada: { ...p, rewards: scored.nextRewards,
    learning: { evidence, canonicalHistory: p.learning.canonicalHistory.map(h => h.canonicalQuestionId !== e.canonicalQuestionId ? h
      : { ...h, pendingEncounterId: null, previousSuccessLocalDate: context.observedLocalDate, previousSuccessWeek: context.activeWeek }) },
    encounters: { ...p.encounters, transfer: { ...e, validChecks: 2, learningEpisode: { ordinal: 2, validChecks: 1, firstCheckSequence: 2,
      status: 'completed-success', completionActionId: 'check-transfer-2' }, responseDraft: response,
      eligibility: classifyRewardEligibility({ track, selection, context }), lastCommittedCheck: { submissionId: 'check-transfer-2', checkSequence: 2,
        learningEpisodeOrdinal: 2, response, evaluation, delta: scored.delta } } } } } };
}
