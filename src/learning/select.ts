import type {
  ActivityBindingId, BindingResolution, DifficultyBand, LearningRouteIntent,
  LearningSuggestion, QuestActivityBinding, SelectionEncounter, SelectionReason,
  SelectionRequest, SelectionResult, SkillId, SkillLearningEvidence, TaskDefinition,
} from './contracts';
import { PREREQUISITE_SUGGESTIONS, SKILLS } from '../content/skills';
import { isIndependentEpisode, usedAnswerHelp } from './evidence';
import { canonicalQuestionId } from './identity';

export const BANDS: readonly DifficultyBand[] = ['support', 'core', 'stretch'];
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
export const approvedTasks = (catalogue: readonly TaskDefinition[]): readonly TaskDefinition[] =>
  catalogue.filter(task => task.review.status === 'approved');

export function resolveBindingIntent(input: {
  route: LearningRouteIntent; milestone: 'M1' | 'M2'; bindings: readonly QuestActivityBinding[];
  catalogue: readonly TaskDefinition[]; accessibleQuestIds: readonly string[];
  completedStoryBindingIds: readonly ActivityBindingId[];
}): BindingResolution {
  const { route, bindings, milestone, accessibleQuestIds, completedStoryBindingIds } = input;
  const unavailable = (reason: Extract<BindingResolution, { status: 'unavailable' }>['reason']): BindingResolution =>
    ({ status: 'unavailable', reason });
  const tasks = approvedTasks(input.catalogue);
  if (route.kind === 'practice') {
    if (!tasks.some(task => route.skillId === undefined || task.skillId === route.skillId)) return unavailable('no-suitable-task');
    return { status: 'resolved', intent: {
      kind: route.mode === 'easier' ? 'child-easier' : route.mode === 'repeat' ? 'repeat-practice' : 'adaptive-practice',
      skillId: route.skillId ?? null, binding: null, provenance: null, previousCanonicalQuestionId: null,
    } };
  }
  if (route.kind === 'quest' && !accessibleQuestIds.includes(route.questId)) return unavailable('quest-unavailable');
  const binding = route.kind === 'quest' && route.bindingId === undefined
    ? bindings.find(row => row.questId === route.questId && row.role === 'story'
      && (row.availability === 'M1' || milestone === 'M2') && !completedStoryBindingIds.includes(row.bindingId))
    : bindings.find(row => row.bindingId === route.bindingId);
  if (!binding) return unavailable(route.kind === 'quest' && route.bindingId === undefined ? 'no-suitable-task' : 'unknown-binding');
  if (binding.availability === 'M2' && milestone !== 'M2') return unavailable('milestone-unavailable');
  if (!accessibleQuestIds.includes(binding.questId)) return unavailable('quest-unavailable');
  if ((route.kind === 'quest' && (binding.role !== 'story' || binding.questId !== route.questId))
    || (route.kind === 'optional-transfer' && binding.role !== 'optional-transfer')
    || (route.kind === 'revisit' && binding.role !== 'revisit')) return unavailable('route-mismatch');
  const valid = (row: QuestActivityBinding): boolean =>
    bindings.filter(other => other.bindingId === row.bindingId).length === 1
    && row.taskIds.length > 0 && new Set(row.taskIds).size === row.taskIds.length
    && (row.availability !== 'M1' || row.role !== 'story' || row.taskIds.length === 1)
    && row.taskIds.every(id => tasks.filter(task => task.canonicalQuestionId === id
      && task.skillId === row.skillId && task.responseSpec.kind === row.responseKind).length === 1)
    && (row.role === 'optional-transfer' ? row.sourceBindingId !== null : row.sourceBindingId === null);
  if (!valid(binding)) return unavailable('invalid-binding');
  if (binding.role === 'story' && completedStoryBindingIds.includes(binding.bindingId)) return unavailable('already-completed');
  let previousCanonicalQuestionId: string | null = null;
  if (binding.role === 'optional-transfer') {
    const source = bindings.find(row => row.bindingId === binding.sourceBindingId);
    if (!source || !valid(source) || source.role !== 'story' || source.availability !== 'M1'
      || binding.availability !== 'M1' || source.questId !== binding.questId
      || source.skillId !== binding.skillId || source.taskIds.length !== 1
      || binding.taskIds.includes(source.taskIds[0])) return unavailable('invalid-binding');
    if (!completedStoryBindingIds.includes(source.bindingId)) return unavailable('source-incomplete');
    previousCanonicalQuestionId = source.taskIds[0];
  }
  return { status: 'resolved', intent: {
    kind: binding.role === 'story' ? 'story-anchor' : binding.role === 'optional-transfer' ? 'transfer' : 'adaptive-practice',
    skillId: binding.skillId, binding, previousCanonicalQuestionId,
    provenance: { bindingId: binding.bindingId, questId: binding.questId, role: binding.role },
  } };
}

/** Shared selection/read-model policy. Date-only histories cannot order different
 * bands within a day: ties choose the higher authored band, never array order. */
export function learningBandPolicy(skillId: SkillId, evidence: SkillLearningEvidence | undefined,
  pool: readonly TaskDefinition[], catalogue: readonly TaskDefinition[]) {
  const availableBands = BANDS.filter(band => pool.some(task => task.skillId === skillId && task.band === band));
  const practiced = BANDS.filter(band => (evidence?.bands[band].completedEpisodes ?? 0) > 0);
  const latestDate = (band: DifficultyBand): string => evidence?.bands[band].recentCompletedEpisodes.at(-1)?.localDate ?? '';
  const currentBand = [...practiced].sort((a, b) => compare(latestDate(b), latestDate(a))
    || BANDS.indexOf(b) - BANDS.indexOf(a))[0] ?? (availableBands.includes('core') ? 'core' : availableBands[0] ?? 'core');
  const recent = evidence?.bands[currentBand].recentCompletedEpisodes ?? [];
  const ready = new Set(recent.filter(episode => isIndependentEpisode(episode) && !episode.familiar)
    .map(episode => episode.canonicalQuestionId)).size >= 3;
  const latest = recent.at(-1);
  const lastReview = evidence?.bands[currentBand].reviewResults.at(-1);
  const reviewNeedsSupport = latest !== undefined && lastReview !== undefined
    && lastReview.canonicalQuestionId === latest.canonicalQuestionId && lastReview.localDate === latest.localDate
    && lastReview.outcome !== 'independent-success' && !isIndependentEpisode(latest);
  const struggling = (recent.length >= 2 && recent.slice(-2).every(episode =>
    usedAnswerHelp(episode.assistance) || episode.outcome === 'deliberate-unsuccessful')) || reviewNeedsSupport;
  const index = BANDS.indexOf(currentBand);
  let band = availableBands.includes(currentBand) ? currentBand
    : [...availableBands].reverse().find(value => BANDS.indexOf(value) < index) ?? availableBands[0] ?? currentBand;
  let suggestion: LearningSuggestion | null = null;
  if (struggling) {
    const lower = [...availableBands].reverse().find(value => BANDS.indexOf(value) < index);
    if (lower) band = lower;
    else {
      const prerequisite = PREREQUISITE_SUGGESTIONS.find(row => row.skillId === skillId);
      suggestion = prerequisite ? {
        kind: 'prerequisite', skillId, band: null, prerequisiteSkillId: prerequisite.prerequisiteSkillId,
        explanation: catalogue.some(task => task.skillId === prerequisite.prerequisiteSkillId)
          ? `${prerequisite.rationale} This practice is available; hints and worked support are also available.`
          : `${prerequisite.rationale} That practice is not available yet; use hints or worked support.`,
      } : { kind: 'unavailable-band', skillId, band: 'support', prerequisiteSkillId: null,
        explanation: 'Easier tasks are not available in this pool; hints and worked support are available.' };
    }
  } else if (ready) {
    const higher = availableBands.find(value => BANDS.indexOf(value) > index);
    if (higher) band = higher;
    else suggestion = { kind: 'unavailable-band', skillId, band: BANDS[index + 1] ?? null,
      prerequisiteSkillId: null, explanation: 'Harder practice is not available yet; continue distinct practice or review.' };
  } else if (!availableBands.includes(currentBand) || (!practiced.length && !availableBands.includes('core'))) {
    suggestion = { kind: 'unavailable-band', skillId, band: practiced.length ? currentBand : 'core',
      prerequisiteSkillId: null, explanation: 'The suggested band is not available in this pool; offering available introductory practice.' };
  }
  return { currentBand, band, availableBands, ready, struggling, suggestion };
}

function resume(encounter: SelectionEncounter, catalogue: readonly TaskDefinition[]): SelectionResult {
  let validDescriptor = false;
  try { validDescriptor = canonicalQuestionId(encounter.descriptor) === encounter.canonicalQuestionId; } catch { /* Recoverable unavailable. */ }
  const task = catalogue.find(row => row.canonicalQuestionId === encounter.canonicalQuestionId);
  try { validDescriptor = validDescriptor && !!task && canonicalQuestionId(task.descriptor) === encounter.canonicalQuestionId; }
  catch { validDescriptor = false; }
  if (!validDescriptor || !task || task.contentRevision !== encounter.contentRevision
    || task.skillId !== encounter.skillId || task.band !== encounter.band) {
    return { status: 'no-suitable-task', reason: 'Retained task or descriptor is unavailable; keep the saved encounter.', unavailableSuggestion: null };
  }
  return {
    status: 'selected', canonicalQuestionId: encounter.canonicalQuestionId, band: encounter.band,
    reason: encounter.selectionReason, bindingProvenance: encounter.bindingProvenance ? { ...encounter.bindingProvenance } : null,
    familiar: encounter.familiar, reviewReference: encounter.reviewReference ? { ...encounter.reviewReference } : null,
    resumeEncounterId: encounter.encounterId, rewardCandidate: 'none', unavailableSuggestion: null,
  };
}

export function selectNextActivity(request: SelectionRequest): SelectionResult {
  const { intent, evidence, canonicalHistory, calendar } = request;
  const catalogue = approvedTasks(request.catalogue);
  const unavailable = (reason: string, unavailableSuggestion: LearningSuggestion | null = null): SelectionResult =>
    ({ status: 'no-suitable-task', reason, unavailableSuggestion });
  if (request.activeEncounter && request.activeEncounter.episodeStatus !== 'completed-success') return resume(request.activeEncounter, catalogue);
  if (intent.kind === 'resume') return unavailable('No unfinished retained encounter was supplied.');
  let pool = catalogue.filter(task => (intent.skillId === null || task.skillId === intent.skillId)
    && (!intent.binding || intent.binding.taskIds.includes(task.canonicalQuestionId))
    && (intent.kind !== 'transfer' || task.canonicalQuestionId !== intent.previousCanonicalQuestionId));
  if (!pool.length) return unavailable('No approved task is available in the requested pool.');
  const history = (id: string) => canonicalHistory.find(row => row.canonicalQuestionId === id);
  const familiar = (id: string): boolean => !!history(id)?.everChecked || history(id)?.previousSuccessWeek != null;
  const order = (tasks: readonly TaskDefinition[]): TaskDefinition[] => [...tasks].sort((a, b) =>
    Number(familiar(a.canonicalQuestionId)) - Number(familiar(b.canonicalQuestionId))
    || compare(a.canonicalQuestionId, b.canonicalQuestionId));
  const pendingTask = [...pool].sort((a, b) => compare(a.canonicalQuestionId, b.canonicalQuestionId))
    .find(task => history(task.canonicalQuestionId)?.pendingEncounter);
  if (pendingTask) return resume(history(pendingTask.canonicalQuestionId)!.pendingEncounter!, catalogue);
  const select = (task: TaskDefinition, reason: SelectionReason, suggestion: LearningSuggestion | null,
    dueDate: string | null = null): SelectionResult => {
    const prior = history(task.canonicalQuestionId);
    // A different route cannot replace the original pending encounter's facts.
    if (prior?.pendingEncounter) return resume(prior.pendingEncounter, catalogue);
    const childPractice = reason === 'child-easier' || reason === 'repeat-practice';
    const checkedThisWeek = prior?.checkedCompetitionWeekIds.includes(calendar.competitionWeekId) ?? false;
    const first = !prior?.everChecked && prior?.previousSuccessWeek == null;
    const laterReview = reason === 'due-review' && dueDate !== null && dueDate <= calendar.todayDate
      && prior?.previousSuccessWeek != null && prior.previousSuccessWeek < calendar.competitionWeekId;
    return {
      status: 'selected', canonicalQuestionId: task.canonicalQuestionId, band: task.band, reason,
      bindingProvenance: intent.provenance ? { ...intent.provenance } : null,
      familiar: familiar(task.canonicalQuestionId), resumeEncounterId: null,
      reviewReference: dueDate && prior?.previousSuccessWeek ? {
        canonicalQuestionId: task.canonicalQuestionId, dueLocalDate: dueDate, previousSuccessWeek: prior.previousSuccessWeek,
      } : null,
      rewardCandidate: childPractice || checkedThisWeek ? 'none' : first ? 'first-encounter' : laterReview ? 'later-week-due-review' : 'none',
      unavailableSuggestion: suggestion,
    };
  };
  if (!intent.binding && intent.kind === 'adaptive-practice' && !request.suppressDueReviewForVisit) {
    const due = SKILLS.flatMap(skill => BANDS.flatMap(band => {
      const date = evidence[skill.skillId]?.bands[band].reviewDueLocalDate;
      return date && date <= calendar.todayDate && pool.some(task => task.skillId === skill.skillId && task.band === band)
        ? [{ skillId: skill.skillId, band, date }] : [];
    })).sort((a, b) => compare(a.date, b.date));
    if (due[0]) return select(order(pool.filter(task => task.skillId === due[0].skillId && task.band === due[0].band))[0], 'due-review', null, due[0].date);
  }
  const skillId = intent.skillId ?? SKILLS.find(skill => pool.some(task => task.skillId === skill.skillId))?.skillId;
  if (!skillId) return unavailable('No delivered skill is available.');
  pool = pool.filter(task => task.skillId === skillId);
  if (intent.kind === 'story-anchor' && pool.length === 1) return select(pool[0], 'story-anchor', null);
  const policy = learningBandPolicy(skillId, evidence[skillId], pool, catalogue);
  let band = policy.band;
  if (intent.kind === 'child-easier') band = [...policy.availableBands].reverse()
    .find(value => BANDS.indexOf(value) < BANDS.indexOf(policy.currentBand)) ?? policy.availableBands[0];
  const candidates = pool.filter(task => task.band === band);
  if (!candidates.length) return unavailable('No task is available in the suggested band.', policy.suggestion);
  const task = intent.kind === 'repeat-practice'
    ? [...candidates].sort((a, b) => Number(familiar(b.canonicalQuestionId)) - Number(familiar(a.canonicalQuestionId))
      || compare(a.canonicalQuestionId, b.canonicalQuestionId))[0] : order(candidates)[0];
  const reason = intent.kind === 'adaptive-practice' && !intent.binding
    && candidates.every(candidate => familiar(candidate.canonicalQuestionId)) ? 'repeat-practice' : intent.kind;
  return select(task, reason, policy.suggestion);
}
