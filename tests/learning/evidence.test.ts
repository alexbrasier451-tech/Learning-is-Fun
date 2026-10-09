import { describe, expect, it } from 'vitest';
import { applyLearningObservation } from '../../src/learning/evidence';
import { summarizeLearning } from '../../src/learning/summarize';
import type { LearningAssistance, LearningObservation, SkillEvidence } from '../../src/learning/contracts';

const neutral: LearningAssistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' };
const hint: LearningAssistance = { ...neutral, answerHintUsed: true };
type Check = Extract<LearningObservation, { kind: 'check' }>;
function check(id = 'A', options: Partial<Check> = {}): LearningObservation {
  return { kind: 'check', eventId: `${id}-check`, submissionId: `${id}-check`, profileId: 'child', encounterId: id,
    learningEpisodeOrdinal: 1, canonicalQuestionId: id, skillId: 'M01', objectiveId: 'M01-addition-subtraction', band: 'core',
    selectionReason: 'adaptive-practice', localDate: '2026-10-23', competitionWeekId: '2026-10-19',
    familiar: false, reviewReference: null, assistance: neutral, episodeCheckIndex: 1, encounterCheckIndex: 1,
    firstCheckCorrect: true, correct: true, issues: [], episodeCompletion: 'success', ...options } as LearningObservation;
}
function finish(previous: LearningObservation, assistance = previous.assistance): LearningObservation {
  const { eventId, profileId, encounterId, learningEpisodeOrdinal, canonicalQuestionId, skillId, objectiveId,
    band, selectionReason, localDate, competitionWeekId, familiar, reviewReference } = previous;
  return { kind: 'finished-unsuccessfully', eventId: `${eventId}-finish`, profileId, encounterId,
    learningEpisodeOrdinal, canonicalQuestionId, skillId, objectiveId, band, selectionReason,
    localDate, competitionWeekId, familiar, reviewReference, assistance, episodeCompletion: 'deliberate-unsuccessful' };
}
function frozen<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
const wrong = { correct: false, firstCheckCorrect: false, episodeCompletion: null } as const;

function delayedSuccess(closures: number, prior: LearningObservation | null, familiar = false,
  assistance: LearningAssistance = neutral): SkillEvidence {
  let evidence = prior ? applyLearningObservation({}, prior) : {};
  for (let i = 1; i <= closures; i++) {
    const observation = check('B', { ...wrong, learningEpisodeOrdinal: i, encounterCheckIndex: i, familiar, assistance });
    evidence = applyLearningObservation(evidence, observation);
    evidence = applyLearningObservation(evidence, finish(observation));
  }
  return applyLearningObservation(evidence, check('B', { learningEpisodeOrdinal: closures + 1,
    encounterCheckIndex: closures + 1, firstCheckCorrect: closures === 0, familiar, assistance }));
}

describe('committed learning observations', () => {
  it('records one first independent Check, only its primary skill, with a civil +3 due date', () => {
    const result = applyLearningObservation({}, check());
    expect(Object.keys(result)).toEqual(['M01']);
    expect(result.M01?.bands.core).toMatchObject({ validChecks: 1, correctChecks: 1, completedEpisodes: 1,
      independentSuccesses: 1, supportedSuccesses: 0, retrySuccesses: 0, laterDistinctSuccesses: 0,
      distinctSuccessfulCanonicalQuestionIds: ['A'], reviewDueLocalDate: '2026-10-26' });
    expect(result.M01?.activeEpisodes).toEqual({});
  });
  it('implements DEC-024 A episode 1 wrong/hint, finish, episode 2 correct without recounting the finish', () => {
    const first = check('A', { ...wrong, assistance: hint });
    const open = applyLearningObservation({}, first);
    expect(open.M01?.bands.core).toMatchObject({ validChecks: 1, completedEpisodes: 0, answerHelpChecks: 1 });
    // Navigation supplies no observation: the open evidence is retained unchanged.
    const ended = applyLearningObservation(open, finish(first));
    expect(ended.M01?.bands.core).toMatchObject({ validChecks: 1, correctChecks: 0, completedEpisodes: 1 });
    expect(ended.M01?.bands.core.recentCompletedEpisodes[0]).toMatchObject({ outcome: 'deliberate-unsuccessful', validChecks: 1, encounterCheckIndex: 1 });
    const returned = applyLearningObservation(ended, check('A', { learningEpisodeOrdinal: 2,
      encounterCheckIndex: 2, firstCheckCorrect: false, assistance: hint }));
    expect(returned.M01?.bands.core).toMatchObject({ validChecks: 2, correctChecks: 1, completedEpisodes: 2,
      independentSuccesses: 0, supportedSuccesses: 1, retrySuccesses: 1, answerHelpChecks: 2, reviewDueLocalDate: null });
    expect(returned.M01?.bands.core.recentCompletedEpisodes.map(row => [row.learningEpisodeOrdinal, row.validChecks, row.assistance.answerHintUsed]))
      .toEqual([[1, 1, true], [2, 1, true]]);
    expect(returned.M01?.activeEpisodes).toEqual({});
  });
  it('several retries inside A produce one completed episode and sticky help/issues', () => {
    const issue = { code: 'total', slotId: null, constraintId: 'sum', observed: '10', explanation: 'The total is 10.' } as const;
    let result = applyLearningObservation({}, check('A', { ...wrong, assistance: hint, issues: [issue] }));
    result = applyLearningObservation(result, check('A', { ...wrong, encounterCheckIndex: 2, episodeCheckIndex: 2, issues: [issue] }));
    result = applyLearningObservation(result, check('A', { encounterCheckIndex: 3, episodeCheckIndex: 3, firstCheckCorrect: false }));
    expect(result.M01?.bands.core).toMatchObject({ validChecks: 3, completedEpisodes: 1, answerHelpChecks: 3,
      independentSuccesses: 0, supportedSuccesses: 1, retrySuccesses: 1 });
    expect(result.M01?.bands.core.recentCompletedEpisodes[0]).toMatchObject({ validChecks: 3, issues: [issue], assistance: hint });
  });
  it('help shown after a wrong Check is captured by deliberate finish without adding a helped Check', () => {
    const first = check('A', wrong);
    const result = applyLearningObservation(applyLearningObservation({}, first), finish(first, hint));
    expect(result.M01?.bands.core).toMatchObject({ validChecks: 1, answerHelpChecks: 0, completedEpisodes: 1 });
    expect(result.M01?.bands.core.recentCompletedEpisodes[0].assistance).toEqual(hint);
  });
  it.each([
    ['answer hint', hint], ['worked support', { ...neutral, workedSupportUsed: true }],
    ['listening', { ...neutral, assessedTextReadAloud: true, evidenceMode: 'listening-supported' }],
    ['mixed', { ...neutral, evidenceMode: 'mixed' }],
  ] as const)('%s qualifies success without inventing independent evidence', (_name, assistance) => {
    const result = applyLearningObservation({}, check('A', { assistance }));
    expect(result.M01?.bands.core).toMatchObject({ correctChecks: 1, completedEpisodes: 1, independentSuccesses: 0,
      supportedSuccesses: 1, retrySuccesses: 0, reviewDueLocalDate: null });
  });
  it('retains a factual later distinct success even when A was helped', () => {
    const a = applyLearningObservation({}, check('A', { assistance: hint }));
    const b = applyLearningObservation(a, check('B'));
    expect(b.M01?.bands.core.laterDistinctSuccesses).toBe(1);
    expect(b.M01?.bands.core.distinctSuccessfulCanonicalQuestionIds).toEqual(['A', 'B']);
  });
  it.each([0, 3, 4, 5, 8])('preserves later-distinct success after %i unsuccessful B episodes evict helped A, through the full summary path', closures => {
    const evidence = delayedSuccess(closures, check('A', { assistance: hint }));
    const summary = summarizeLearning(evidence, [], '2026-10-23')[0];
    expect(summary).toMatchObject({ validChecks: closures + 2, completedEpisodes: closures + 2,
      independentSuccesses: closures === 0 ? 1 : 0, supportedSuccesses: closures === 0 ? 1 : 2,
      retrySuccesses: closures === 0 ? 0 : 1, laterDistinctSuccesses: 1 });
    expect(summary.missingEvidence).not.toContain('No later success on a distinct task recorded.');
    expect(evidence.M01?.bands.core.laterDistinctSuccesses).toBe(1);
    expect(evidence.M01?.bands.core.recentCompletedEpisodes).toHaveLength(Math.min(4, closures + 2));
    if (closures >= 3) expect(evidence.M01?.bands.core.distinctSuccessfulCanonicalQuestionIds).toEqual(['B']);
  });
  it.each([3, 4, 5])('records helped B after %i unsuccessful episodes following independent A without window dependence', closures => {
    const evidence = delayedSuccess(closures, check('A'), false, hint);
    expect(summarizeLearning(evidence, [], '2026-10-23')[0]).toMatchObject({ validChecks: closures + 2,
      independentSuccesses: 1, supportedSuccesses: 1, retrySuccesses: 1, laterDistinctSuccesses: 1 });
  });
  it('does not invent later-distinct success from unsuccessful episodes without any prior success', () => {
    const evidence = delayedSuccess(5, null);
    expect(summarizeLearning(evidence, [], '2026-10-23')[0]).toMatchObject({ validChecks: 6, completedEpisodes: 6,
      supportedSuccesses: 1, retrySuccesses: 1, laterDistinctSuccesses: 0 });
  });
  it('familiar same-task replay after window eviction never becomes later-distinct success', () => {
    const evidence = delayedSuccess(5, check('prior-B', { canonicalQuestionId: 'B', assistance: hint }), true);
    const summary = summarizeLearning(evidence, [], '2026-10-23')[0];
    expect(summary).toMatchObject({ validChecks: 7, completedEpisodes: 7, supportedSuccesses: 2, laterDistinctSuccesses: 0 });
    expect(summary.missingEvidence).toContain('No later success on a distinct task recorded.');
  });
  it.each([
    check('A', { band: 'support', assistance: hint }),
    check('A', { skillId: 'M04', objectiveId: 'M04-integer-scaling', assistance: hint }),
  ])('does not use another band or skill as the prior-success fact', prior => {
    const evidence = delayedSuccess(5, prior);
    expect(evidence.M01?.bands.core.laterDistinctSuccesses).toBe(0);
    expect(summarizeLearning(evidence, [], '2026-10-23').find(row => row.skillId === 'M01')?.laterDistinctSuccesses).toBe(0);
  });
  it('bounds episode, distinct-success and review windows to four while aggregate counts remain', () => {
    let result: SkillEvidence = {};
    for (const id of ['A', 'B', 'C', 'D', 'E', 'F']) result = applyLearningObservation(result, check(id, { selectionReason: 'due-review' }));
    expect(result.M01?.bands.core).toMatchObject({ validChecks: 6, completedEpisodes: 6, independentSuccesses: 6,
      laterDistinctSuccesses: 5, distinctSuccessfulCanonicalQuestionIds: ['C', 'D', 'E', 'F'] });
    expect(result.M01?.bands.core.reviewResults).toHaveLength(4);
    expect(result.M01?.bands.core.recentCompletedEpisodes.map(row => row.canonicalQuestionId)).toEqual(['C', 'D', 'E', 'F']);
  });
  it('does not reschedule a first independent review date on an ordinary later success', () => {
    const a = applyLearningObservation({}, check());
    const b = applyLearningObservation(a, check('B', { localDate: '2026-10-25' }));
    expect(b.M01?.bands.core.reviewDueLocalDate).toBe('2026-10-26');
  });
  it('uses explicit October DST/Monday dates for first success, independent review, supported review and unsuccessful review', () => {
    let result = applyLearningObservation({}, check());
    const reviewReference = { canonicalQuestionId: 'A', dueLocalDate: '2026-10-26', previousSuccessWeek: '2026-10-19' };
    result = applyLearningObservation(result, check('review-A', { canonicalQuestionId: 'A', familiar: true,
      selectionReason: 'due-review', localDate: '2026-10-26', competitionWeekId: '2026-10-26', reviewReference }));
    expect(result.M01?.bands.core.reviewDueLocalDate).toBe('2026-11-02');
    result = applyLearningObservation(result, check('review-B', { canonicalQuestionId: 'A', familiar: true, assistance: hint,
      selectionReason: 'due-review', localDate: '2026-11-05', competitionWeekId: '2026-11-02', reviewReference }));
    expect(result.M01?.bands.core.reviewDueLocalDate).toBe('2026-11-08');
    const unsuccessful = check('review-C', { ...wrong, selectionReason: 'due-review', localDate: '2026-11-09', reviewReference });
    result = applyLearningObservation(result, unsuccessful);
    expect(result.M01?.bands.core.reviewDueLocalDate).toBe('2026-11-08');
    result = applyLearningObservation(result, finish(unsuccessful));
    expect(result.M01?.bands.core.reviewDueLocalDate).toBe('2026-11-12');
    expect(result.M01?.bands.core.reviewResults.map(row => row.outcome)).toEqual(['independent-success', 'supported-success', 'unsuccessful']);
  });
  it('keeps per-band review dates independent', () => {
    const core = applyLearningObservation({}, check());
    const result = applyLearningObservation(core, check('B', { band: 'stretch', localDate: '2026-10-28' }));
    expect(result.M01?.bands.core.reviewDueLocalDate).toBe('2026-10-26');
    expect(result.M01?.bands.stretch.reviewDueLocalDate).toBe('2026-10-31');
  });
  it('rejects zero-Check finish, invalid/incomplete events, malformed indexes and mismatched primary objectives without attempts', () => {
    const empty: SkillEvidence = {};
    const bad = [finish(check()), { ...check(), kind: 'incomplete' }, { ...check(), kind: 'invalid-response' },
      { ...check(), episodeCheckIndex: 0 }, { ...check(), encounterCheckIndex: 0 },
      { ...check(), objectiveId: 'context-reading' }, { ...check(), episodeCompletion: null },
      { ...check(), firstCheckCorrect: false }, { ...check(), learningEpisodeOrdinal: 0 }];
    for (const observation of bad) expect(applyLearningObservation(empty, observation as LearningObservation)).toBe(empty);
  });
  it('rejects out-of-sequence observations or stale episode finish against an active accumulator', () => {
    const initial = check('A', wrong);
    const evidence = applyLearningObservation({}, initial);
    expect(applyLearningObservation(evidence, check('A', { episodeCheckIndex: 3, encounterCheckIndex: 3 }))).toBe(evidence);
    expect(applyLearningObservation(evidence, { ...finish(initial), learningEpisodeOrdinal: 2 })).toBe(evidence);
  });
  it('preserves frozen inputs, unaffected skills/bands, and JSON output', () => {
    const initial = frozen(applyLearningObservation({}, check('M', { skillId: 'M04', objectiveId: 'M04-integer-scaling' })));
    const observation = frozen(check());
    const before = JSON.stringify([initial, observation]);
    const result = applyLearningObservation(initial, observation);
    expect(result).not.toBe(initial);
    expect(result.M04).toBe(initial.M04);
    expect(JSON.stringify([initial, observation])).toBe(before);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    const b = applyLearningObservation(frozen(result), frozen(check('B')));
    expect(b.M01?.bands.support).toBe(result.M01?.bands.support);
  });
  it('neutral narration, mute, Stop and Silence all generate no observation or synthetic Check', () => {
    const base = applyLearningObservation({}, check('A', wrong));
    for (const kind of ['neutral-narration', 'mute-music', 'mute-effects', 'stop', 'silence-all']) {
      expect(applyLearningObservation(base, { ...check('B'), kind } as unknown as LearningObservation)).toBe(base);
    }
  });
});
