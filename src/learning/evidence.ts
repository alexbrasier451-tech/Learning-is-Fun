import type {
  ActiveLearningEpisode, BandEvidence, CompletedLearningEpisode, LearningAssistance,
  LearningObservation, SkillEvidence,
} from './contracts';
import { SKILLS } from '../content/skills';
import { addCalendarDays } from '../rewards/calendar';

export const emptyBandEvidence = (): BandEvidence => ({
  validChecks: 0, correctChecks: 0, answerHelpChecks: 0, completedEpisodes: 0,
  independentSuccesses: 0, supportedSuccesses: 0, retrySuccesses: 0,
  laterDistinctSuccesses: 0, distinctSuccessfulCanonicalQuestionIds: [],
  recentCompletedEpisodes: [], reviewResults: [], reviewDueLocalDate: null,
});

export const usedAnswerHelp = (help: LearningAssistance): boolean =>
  help.answerHintUsed || help.workedSupportUsed;

/** evidenceMode is objective-specific and comes from the committed adapter.
 * Neutral narration has no flag; hearing assessed reading is qualified there. */
export const isIndependentEpisode = (episode: CompletedLearningEpisode): boolean =>
  episode.outcome === 'success' && episode.firstCheckCorrect
  && episode.encounterCheckIndex === 1 && !usedAnswerHelp(episode.assistance)
  && episode.assistance.evidenceMode === 'independent';

function mergeHelp(a: LearningAssistance | undefined, b: LearningAssistance): LearningAssistance {
  return {
    answerHintUsed: !!a?.answerHintUsed || b.answerHintUsed,
    workedSupportUsed: !!a?.workedSupportUsed || b.workedSupportUsed,
    assessedTextReadAloud: !!a?.assessedTextReadAloud || b.assessedTextReadAloud,
    evidenceMode: a?.evidenceMode === 'mixed' || b.evidenceMode === 'mixed' ? 'mixed'
      : a?.evidenceMode === 'listening-supported' || b.evidenceMode === 'listening-supported'
        ? 'listening-supported' : 'independent',
  };
}

/** Consume a new validated observation once. WP04 owns durable replay guards,
 * assistance-only records and encounter history across completed episodes. */
export function applyLearningObservation(evidence: SkillEvidence, observation: LearningObservation): SkillEvidence {
  const o = observation;
  if ((o.kind !== 'check' && o.kind !== 'finished-unsuccessfully')
    || !SKILLS.some(skill => skill.skillId === o.skillId && skill.objectiveId === o.objectiveId)
    || !['support', 'core', 'stretch'].includes(o.band)
    || !Number.isSafeInteger(o.learningEpisodeOrdinal) || o.learningEpisodeOrdinal < 1) return evidence;

  const skill = evidence[o.skillId] ?? {
    skillId: o.skillId,
    bands: { support: emptyBandEvidence(), core: emptyBandEvidence(), stretch: emptyBandEvidence() },
    activeEpisodes: {},
  };
  const previous = skill.activeEpisodes[o.encounterId];
  if (previous && (previous.learningEpisodeOrdinal !== o.learningEpisodeOrdinal
    || previous.canonicalQuestionId !== o.canonicalQuestionId
    || previous.band !== o.band || previous.objectiveId !== o.objectiveId)) return evidence;

  const band = skill.bands[o.band];
  let active: ActiveLearningEpisode;
  let nextBand = band;
  if (o.kind === 'check') {
    if (!Number.isSafeInteger(o.encounterCheckIndex) || !Number.isSafeInteger(o.episodeCheckIndex)
      || o.episodeCheckIndex !== (previous?.validChecks ?? 0) + 1
      || o.encounterCheckIndex < o.episodeCheckIndex
      || (previous && (o.encounterCheckIndex !== previous.encounterCheckIndex + 1
        || o.firstCheckCorrect !== previous.firstCheckCorrect))
      || (o.encounterCheckIndex === 1 && o.firstCheckCorrect !== o.correct)
      || o.episodeCompletion !== (o.correct ? 'success' : null)) return evidence;
    const assistance = mergeHelp(previous?.assistance, o.assistance);
    const issues = [...(previous?.issues ?? [])];
    for (const issue of o.issues) {
      if (!issues.some(old => JSON.stringify(old) === JSON.stringify(issue))) issues.push({ ...issue });
    }
    active = {
      encounterId: o.encounterId, learningEpisodeOrdinal: o.learningEpisodeOrdinal,
      canonicalQuestionId: o.canonicalQuestionId, objectiveId: o.objectiveId, band: o.band,
      validChecks: o.episodeCheckIndex, encounterCheckIndex: o.encounterCheckIndex,
      firstCheckCorrect: o.firstCheckCorrect, assistance, issues,
    };
    nextBand = {
      ...band, validChecks: band.validChecks + 1, correctChecks: band.correctChecks + Number(o.correct),
      answerHelpChecks: band.answerHelpChecks + Number(usedAnswerHelp(assistance)),
    };
  } else {
    // A zero-Check finish is not a failed attempt, even if presented incorrectly.
    if (!previous || previous.validChecks === 0 || o.episodeCompletion !== 'deliberate-unsuccessful') return evidence;
    active = { ...previous, assistance: mergeHelp(previous.assistance, o.assistance) };
  }

  const activeEpisodes = { ...skill.activeEpisodes };
  if (o.kind === 'check' && !o.correct) {
    activeEpisodes[o.encounterId] = active;
  } else {
    const completed: CompletedLearningEpisode = {
      ...active, outcome: o.kind === 'check' ? 'success' : 'deliberate-unsuccessful',
      localDate: o.localDate, competitionWeekId: o.competitionWeekId, familiar: o.familiar,
      reviewReference: o.reviewReference ? { ...o.reviewReference } : null,
    };
    const independent = isIndependentEpisode(completed);
    const succeeded = completed.outcome === 'success';
    const recent = [...band.recentCompletedEpisodes, completed].slice(-4);
    // WP04 retains the original non-familiar flag through unsuccessful episodes
    // and never reopens a succeeded encounter. A new non-familiar success follows
    // a distinct prior success even when intervening finishes evicted its ID.
    // The aggregate supplies that durable fact; the recent list is only a guard
    // against counting a same-ID replay, not the source of prior-success truth.
    const laterDistinct = succeeded && !o.familiar && band.correctChecks > 0
      && !band.distinctSuccessfulCanonicalQuestionIds.includes(o.canonicalQuestionId);
    const isReview = o.selectionReason === 'due-review';
    nextBand = {
      ...nextBand,
      completedEpisodes: band.completedEpisodes + 1,
      independentSuccesses: band.independentSuccesses + Number(independent),
      supportedSuccesses: band.supportedSuccesses + Number(succeeded && !independent),
      retrySuccesses: band.retrySuccesses + Number(succeeded && active.encounterCheckIndex > 1),
      laterDistinctSuccesses: band.laterDistinctSuccesses + Number(laterDistinct),
      recentCompletedEpisodes: recent,
      distinctSuccessfulCanonicalQuestionIds: [...new Set(recent
        .filter(episode => episode.outcome === 'success').map(episode => episode.canonicalQuestionId))],
      reviewDueLocalDate: isReview ? addCalendarDays(o.localDate, independent ? 7 : 3)
        : independent && band.independentSuccesses === 0 ? addCalendarDays(o.localDate, 3)
          : band.reviewDueLocalDate,
      reviewResults: isReview ? [...band.reviewResults, {
        canonicalQuestionId: o.canonicalQuestionId, localDate: o.localDate,
        competitionWeekId: o.competitionWeekId, familiar: o.familiar,
        outcome: independent ? 'independent-success' as const
          : succeeded ? 'supported-success' as const : 'unsuccessful' as const,
      }].slice(-4) : band.reviewResults,
    };
    delete activeEpisodes[o.encounterId];
  }
  return { ...evidence, [o.skillId]: { ...skill, bands: { ...skill.bands, [o.band]: nextBand }, activeEpisodes } };
}
