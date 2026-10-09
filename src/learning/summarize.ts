import type { LearningSummary, SkillEvidence, TaskDefinition } from './contracts';
import { SKILLS } from '../content/skills';
import { approvedTasks, BANDS, learningBandPolicy } from './select';

/** Factual practice evidence, including explicitly missing evidence. Contextual
 * skills with no delivered task or primary observation do not acquire a row. */
export function summarizeLearning(evidence: SkillEvidence, catalogue: readonly TaskDefinition[], todayDate: string): readonly LearningSummary[] {
  const tasks = approvedTasks(catalogue);
  return SKILLS.filter(skill => evidence[skill.skillId] || tasks.some(task => task.skillId === skill.skillId)).map(skill => {
    const saved = evidence[skill.skillId];
    const policy = learningBandPolicy(skill.skillId, saved, tasks, tasks);
    const bands = BANDS.flatMap(band => saved ? [saved.bands[band]] : []);
    const sum = (key: 'validChecks' | 'completedEpisodes' | 'independentSuccesses' | 'supportedSuccesses' | 'retrySuccesses' | 'laterDistinctSuccesses') =>
      bands.reduce((total, band) => total + band[key], 0);
    const dates = bands.flatMap(band => band.reviewDueLocalDate ? [band.reviewDueLocalDate] : []).sort();
    const recentCompletedEpisodes = bands.flatMap(band => [...band.recentCompletedEpisodes].reverse())
      .sort((a, b) => a.localDate < b.localDate ? 1 : a.localDate > b.localDate ? -1 : BANDS.indexOf(b.band) - BANDS.indexOf(a.band));
    const latestReview = [...bands].reverse().flatMap(band => [...band.reviewResults].reverse()).sort((a, b) =>
      a.localDate < b.localDate ? 1 : a.localDate > b.localDate ? -1 : 0)[0] ?? null;
    const missingEvidence: string[] = [];
    if (!sum('validChecks')) missingEvidence.push('No valid Checks recorded.');
    if (!sum('completedEpisodes')) missingEvidence.push('No completed Check-bearing episodes recorded.');
    if (!sum('independentSuccesses')) missingEvidence.push('No independent first-Check success recorded for this objective.');
    if (!sum('laterDistinctSuccesses')) missingEvidence.push('No later success on a distinct task recorded.');
    if (!latestReview) missingEvidence.push('No completed dated review recorded.');
    if (!policy.availableBands.length) missingEvidence.push('No approved task is currently delivered for this skill.');
    return {
      skillId: skill.skillId,
      label: dates[0] && dates[0] <= todayDate ? 'review-due' : policy.ready && !policy.struggling ? 'ready-for-harder-work' : 'practising',
      currentBand: policy.currentBand, availableBands: policy.availableBands,
      validChecks: sum('validChecks'), completedEpisodes: sum('completedEpisodes'),
      independentSuccesses: sum('independentSuccesses'), supportedSuccesses: sum('supportedSuccesses'),
      retrySuccesses: sum('retrySuccesses'), laterDistinctSuccesses: sum('laterDistinctSuccesses'),
      distinctSuccessesByBand: {
        support: saved?.bands.support.distinctSuccessfulCanonicalQuestionIds.length ?? 0,
        core: saved?.bands.core.distinctSuccessfulCanonicalQuestionIds.length ?? 0,
        stretch: saved?.bands.stretch.distinctSuccessfulCanonicalQuestionIds.length ?? 0,
      },
      recentCompletedEpisodes, reviewDueLocalDate: dates[0] ?? null, latestReview,
      suggestion: policy.suggestion, missingEvidence,
    };
  });
}
