import type { EncounterSave, ProfileSave, SaveDataV1 } from '../../src/state/contracts';
import type { ActivityResponse, LearningAssistance } from '../../src/learning/contracts';
import type { CanonicalRewardTrack, RewardSelectionFacts } from '../../src/rewards/contracts';
import { applyLearningObservation } from '../../src/learning/evidence';
import { evaluateResponse } from '../../src/learning/evaluate';
import { applyCheckRewards, classifyRewardEligibility } from '../../src/rewards/scoring';
import { BACKUP_CATALOGUE, emptyBackupSave, multiProfileBackupSave } from './backup-data';

export type FreshBackupCheck = Readonly<{ hinted: boolean; wrong?: boolean; finishUnsuccessful?: boolean; target?: number }>;
const calendar = { activeWeek: '2026-10-12', observedLocalDate: '2026-10-13', clockRollback: false };

/** Exact independent-review producer recipe. No decoder-derived expectations or
 * invented evidence/point counters: adapt actual producer outputs to state DTOs. */
export function freshLearningBackupSave(specs: readonly FreshBackupCheck[]): SaveDataV1 {
  let save: SaveDataV1 = { ...emptyBackupSave(), profiles: { ben: multiProfileBackupSave().profiles.ben },
    competition: { ...emptyBackupSave().competition, latestOpenedWeek: calendar.activeWeek } };
  for (const [index, spec] of specs.entries()) {
    let p = save.profiles.ben;
    const target = spec.target ?? [12, 10, 8][index];
    const canonical = `lif.math.bridge.r1.total-${target}`, task = BACKUP_CATALOGUE.find(t => t.canonicalQuestionId === canonical)!;
    const encounterId = `fresh-${index}`, opportunityId = `fresh-op-${index}`, submissionId = `fresh-check-${index}`;
    const assistance: LearningAssistance = { answerHintUsed: spec.hinted, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' };
    const response: ActivityResponse = { kind: 'bridge', planks: spec.wrong ? [1] : target === 12 ? [6, 6] : target === 10 ? [5, 5]
      : [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])] };
    const evaluation = evaluateResponse(task, response); if (evaluation.status !== 'judged') throw new Error('Fresh task must be actually judged');
    const selection: RewardSelectionFacts = { profileId: 'ben', canonicalQuestionId: canonical, encounterId, selectionReason: 'adaptive', candidate: 'first-encounter', band: task.band };
    const eligibility = classifyRewardEligibility({ track: null, selection, context: calendar });
    const track: CanonicalRewardTrack = { lastAllocatedOrdinal: 1, completedThroughOrdinal: 0, closedAwardTotal: 0,
      freePractice: { validChecks: 0, answerHintUsed: false }, currentOpportunity: { opportunityId, profileId: 'ben', canonicalQuestionId: canonical,
        ordinal: 1, selectionFacts: selection, earningWeek: null, slot: null, validChecks: 0, answerHintUsed: spec.hinted,
        components: { answer: false, independentSuccess: false, supportedSuccess: false } } };
    p = { ...p, rewards: { ...p.rewards, tracksByCanonical: { ...p.rewards.tracksByCanonical, [canonical]: track } } };
    const rewards = applyCheckRewards({ profileId: 'ben', encounterId, opportunityId, submissionId, checkSequence: 1, validChecks: 0,
      track, rewards: p.rewards, evaluation, assistance, selection, competition: save.competition, context: calendar });
    const facts = { profileId: 'ben', encounterId, learningEpisodeOrdinal: 1, canonicalQuestionId: canonical,
      skillId: task.skillId, objectiveId: task.objectiveId, band: task.band, selectionReason: 'adaptive-practice' as const,
      localDate: calendar.observedLocalDate, competitionWeekId: calendar.activeWeek, familiar: false, reviewReference: null, assistance };
    let evidence = applyLearningObservation(p.learning.evidence, { ...facts, eventId: submissionId, kind: 'check', submissionId,
      episodeCheckIndex: 1, encounterCheckIndex: 1, firstCheckCorrect: evaluation.correct, issues: evaluation.feedback.issues,
      ...(evaluation.correct ? { correct: true, episodeCompletion: 'success' } : { correct: false, episodeCompletion: null }) });
    if (spec.finishUnsuccessful && !evaluation.correct) evidence = applyLearningObservation(evidence, { ...facts, eventId: `finish-${encounterId}`,
      kind: 'finished-unsuccessfully', episodeCompletion: 'deliberate-unsuccessful' });
    const e: EncounterSave = { encounterId, opportunityId, canonicalQuestionId: canonical, descriptor: task.descriptor,
      taskContentRevision: task.contentRevision, skillId: task.skillId, band: task.band, selectionReason: 'adaptive-practice',
      bindingProvenance: null, familiar: false, reviewReference: null, validChecks: 1, firstCheckCorrect: evaluation.correct, assistance,
      learningEpisode: evaluation.correct ? { ordinal: 1, validChecks: 1, firstCheckSequence: 1, status: 'completed-success', completionActionId: submissionId }
        : spec.finishUnsuccessful ? { ordinal: 1, validChecks: 1, firstCheckSequence: 1, status: 'completed-unsuccessful', completionActionId: `finish-${encounterId}` }
          : { ordinal: 1, validChecks: 1, firstCheckSequence: 1, status: 'suspended', completionActionId: null },
      responseDraft: response, revealedAssistanceIds: spec.hinted ? [task.hints[0].id] : [], eligibility,
      lastCommittedCheck: { submissionId, checkSequence: 1, learningEpisodeOrdinal: 1, response, evaluation, delta: rewards.delta } };
    const profile: ProfileSave = { ...p, rewards: rewards.nextRewards, encounters: { ...p.encounters, [encounterId]: e },
      learning: { evidence, canonicalHistory: [...p.learning.canonicalHistory, { canonicalQuestionId: canonical,
        pendingEncounterId: evaluation.correct ? null : encounterId, everChecked: true,
        previousSuccessLocalDate: evaluation.correct ? calendar.observedLocalDate : null, previousSuccessWeek: evaluation.correct ? calendar.activeWeek : null,
        checkedCompetitionWeekIds: [calendar.activeWeek], assistance }] } };
    save = { ...save, competition: rewards.nextCompetition, profiles: { ben: profile } };
  }
  return structuredClone(save);
}

/** Continue the review's suspended wrong encounter with actual correct Check 2.
 * A corrupt active first-Check fact makes the producer return identical evidence. */
export function continueFreshWrongBackupSave(save: SaveDataV1) {
  const p = save.profiles.ben, e = p.encounters['fresh-0'];
  const task = BACKUP_CATALOGUE.find(t => t.canonicalQuestionId === e.canonicalQuestionId)!, response: ActivityResponse = { kind: 'bridge', planks: [6, 6] };
  const evaluation = evaluateResponse(task, response); if (evaluation.status !== 'judged' || !evaluation.correct) throw new Error('Continuation requires judged success');
  const submissionId = 'fresh-check-0-2', track = p.rewards.tracksByCanonical[e.canonicalQuestionId], selection = track.currentOpportunity!.selectionFacts;
  const rewards = applyCheckRewards({ profileId: 'ben', encounterId: e.encounterId, opportunityId: e.opportunityId, submissionId,
    checkSequence: 2, validChecks: 1, track, rewards: p.rewards, evaluation, assistance: e.assistance, selection, competition: save.competition, context: calendar });
  const evidence = applyLearningObservation(p.learning.evidence, { eventId: submissionId, profileId: 'ben', encounterId: e.encounterId,
    learningEpisodeOrdinal: 1, canonicalQuestionId: e.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    selectionReason: e.selectionReason, localDate: calendar.observedLocalDate, competitionWeekId: calendar.activeWeek,
    familiar: e.familiar, reviewReference: e.reviewReference, assistance: e.assistance, kind: 'check', submissionId,
    episodeCheckIndex: 2, encounterCheckIndex: 2, firstCheckCorrect: e.firstCheckCorrect!, correct: true, issues: evaluation.feedback.issues, episodeCompletion: 'success' });
  const next: SaveDataV1 = { ...save, competition: rewards.nextCompetition, profiles: { ben: { ...p, rewards: rewards.nextRewards,
    learning: { evidence, canonicalHistory: p.learning.canonicalHistory.map(h => h.canonicalQuestionId === e.canonicalQuestionId
      ? { ...h, pendingEncounterId: null, previousSuccessLocalDate: calendar.observedLocalDate, previousSuccessWeek: calendar.activeWeek } : h) },
    encounters: { ...p.encounters, [e.encounterId]: { ...e, validChecks: 2, learningEpisode: { ordinal: 1, validChecks: 2, firstCheckSequence: 1,
      status: 'completed-success', completionActionId: submissionId }, responseDraft: response,
      eligibility: classifyRewardEligibility({ track, selection, context: calendar }),
      lastCommittedCheck: { submissionId, checkSequence: 2, learningEpisodeOrdinal: 1, response, evaluation, delta: rewards.delta } } } } } };
  return { save: next, delta: rewards.delta, learningAdvanced: evidence !== p.learning.evidence };
}

export function evictedPriorSuccessBackupSave(): SaveDataV1 {
  return freshLearningBackupSave([{ hinted: true, target: 12 }, ...[8, 9, 11, 13].map(target => ({ hinted: true, wrong: true, finishUnsuccessful: true, target })),
    { hinted: true, target: 10 }]);
}
