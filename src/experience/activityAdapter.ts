import type { CommittedActivityProjection } from '../state/contracts';
import type { M1ResponseSpec } from '../interaction/draft';

/** No answer rules cross the presentation adapter. Feedback is explicitly attributed. */
export function toActivityTaskView(activity: CommittedActivityProjection) {
  const { task, lastCheck, lastEvaluation, rewardDisplay } = activity;
  if (task.responseSpec.kind !== 'bridge' && task.responseSpec.kind !== 'merchant' && task.responseSpec.kind !== 'punctuation') {
    throw new Error('This activity needs an unavailable response form. Your saved work is unchanged.');
  }
  const help = [...task.hints, task.workedSupport].filter(item => activity.revealedAssistanceIds.includes(item.id));
  return {
    profileId: activity.profileId, encounterId: activity.encounterId, epoch: activity.token.epoch,
    learningEpisodeOrdinal: activity.learningEpisodeOrdinal, nextCheckSequence: activity.nextCheckSequence,
    responseSpec: task.responseSpec as M1ResponseSpec, instructionText: task.instructionText, assessedText: task.assessedText,
    neutralText: task.narration.neutralText, assessedTextMayBeSpoken: task.narration.assessedTextMayBeSpokenBeforeCheck,
    responseDraft: activity.responseDraft, help,
    nextHelp: task.hints.find(item => !activity.revealedAssistanceIds.includes(item.id))
      ?? (!activity.revealedAssistanceIds.includes(task.workedSupport.id) ? task.workedSupport : null),
    feedback: lastCheck && lastEvaluation ? { ...lastEvaluation.feedback, correct: lastEvaluation.correct,
      checkSequence: lastCheck.checkSequence, episode: lastCheck.learningEpisodeOrdinal, response: lastCheck.response } : null,
    label: activity.selectionReason === 'due-review' ? 'Review' : activity.bindingProvenance?.role === 'story' ? 'Story adventure'
      : activity.bindingProvenance?.role === 'optional-transfer' ? 'Optional new challenge' : 'Practice',
    familiar: activity.familiar, provenance: activity.bindingProvenance,
    rewardLabel: rewardDisplay.eligibility.kind === 'practice-only' ? 'Practice · learning and exploration'
      : rewardDisplay.earningWeek === null ? 'Your scoring turn has not started'
        : rewardDisplay.slot === null ? 'Lifetime learning · no weekly scoring slot'
          : `Saved scoring turn · week of ${rewardDisplay.earningWeek}`,
    historicalDelta: rewardDisplay.lastCommittedDelta,
  };
}
export type ActivityTaskView = ReturnType<typeof toActivityTaskView>;
