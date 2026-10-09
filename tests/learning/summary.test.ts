import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { summarizeLearning } from '../../src/learning/summarize';
import { applyLearningObservation } from '../../src/learning/evidence';
import { SKILLS } from '../../src/content/skills';
import type { LearningAssistance, LearningObservation, SkillEvidence, SkillId, TaskDefinition } from '../../src/learning/contracts';

const neutral: LearningAssistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' };
function check(id: string, skillId: SkillId = 'M01', patch: Partial<LearningObservation> = {}): LearningObservation {
  return { kind: 'check', eventId: id, submissionId: id, profileId: 'child', encounterId: id,
    learningEpisodeOrdinal: 1, canonicalQuestionId: id, skillId, objectiveId: SKILLS.find(skill => skill.skillId === skillId)!.objectiveId,
    band: 'core', selectionReason: 'adaptive-practice', localDate: '2026-10-23', competitionWeekId: '2026-10-19',
    familiar: false, reviewReference: null, assistance: neutral, episodeCheckIndex: 1, encounterCheckIndex: 1,
    firstCheckCorrect: true, correct: true, issues: [], episodeCompletion: 'success', ...patch } as LearningObservation;
}
const tasks = (skillIds: readonly SkillId[]): readonly TaskDefinition[] => skillIds.flatMap(skillId => (['support', 'core', 'stretch'] as const).map(band => ({
  canonicalQuestionId: `${skillId}-${band}`, skillId, band,
  descriptor: { familyId: 'fixture', equivalenceVersion: 'r1', authoredKey: `${skillId}-${band}`, parameters: {} },
  contentRevision: '1', objectiveId: SKILLS.find(skill => skill.skillId === skillId)!.objectiveId,
  contextualSkillIds: skillId === 'M04' ? ['M02', 'E08'] : [],
  curriculum: { sourceUrl: 'fixture', section: 'fixture', programmeBand: 'fixture' }, demandRationale: 'fixture',
  instructionText: 'Choose a tile.', assessedText: 'fixture', responseSpec: { kind: 'choice', slots: [], requiredSlotIds: [] },
  answerRule: { kind: 'accepted-responses', responses: [] }, explanation: 'fixture', hints: [{ id: 'h1', text: 'help' }, { id: 'h2', text: 'help' }],
  workedSupport: { id: 'w', text: 'support' }, narration: { neutralText: 'Choose a tile.', assessedTextMayBeSpokenBeforeCheck: false },
  review: { status: 'approved', reviewer: 'test fixture', rationale: 'synthetic fixture', evidenceRef: 'test' },
})));
function frozen<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}

describe('factual adult learning summary', () => {
  it('shows missing evidence for delivered skills without fabricating contextual or undeclared M2 mastery', () => {
    const summaries = summarizeLearning({}, tasks(['M01', 'M04', 'E06']), '2026-10-23');
    expect(summaries.map(row => row.skillId)).toEqual(['M01', 'M04', 'E06']);
    expect(summaries[0]).toEqual({
      skillId: 'M01', label: 'practising', currentBand: 'core', availableBands: ['support', 'core', 'stretch'],
      validChecks: 0, completedEpisodes: 0, independentSuccesses: 0, supportedSuccesses: 0,
      retrySuccesses: 0, laterDistinctSuccesses: 0, distinctSuccessesByBand: { support: 0, core: 0, stretch: 0 },
      recentCompletedEpisodes: [], reviewDueLocalDate: null, latestReview: null, suggestion: null,
      missingEvidence: ['No valid Checks recorded.', 'No completed Check-bearing episodes recorded.',
        'No independent first-Check success recorded for this objective.', 'No later success on a distinct task recorded.',
        'No completed dated review recorded.'],
    });
  });
  it('distinguishes independent, helped, retry, later-distinct, listening and mixed outcomes on primary objectives', () => {
    let evidence: SkillEvidence = {};
    evidence = applyLearningObservation(evidence, check('A', 'M01', { assistance: { ...neutral, answerHintUsed: true } }));
    evidence = applyLearningObservation(evidence, check('B'));
    evidence = applyLearningObservation(evidence, check('C', 'M01', { correct: false, firstCheckCorrect: false, episodeCompletion: null }));
    evidence = applyLearningObservation(evidence, check('C', 'M01', { episodeCheckIndex: 2, encounterCheckIndex: 2, firstCheckCorrect: false }));
    evidence = applyLearningObservation(evidence, check('merchant', 'M04', { assistance: { ...neutral, evidenceMode: 'mixed' } }));
    evidence = applyLearningObservation(evidence, check('reading', 'E08', { assistance: { ...neutral, assessedTextReadAloud: true, evidenceMode: 'listening-supported' } }));
    const summaries = summarizeLearning(evidence, tasks(['M01', 'M04', 'E08']), '2026-10-23');
    expect(summaries.map(row => row.skillId)).toEqual(['M01', 'M04', 'E08']);
    expect(summaries[0]).toMatchObject({ validChecks: 4, completedEpisodes: 3, independentSuccesses: 1,
      supportedSuccesses: 2, retrySuccesses: 1, laterDistinctSuccesses: 2, reviewDueLocalDate: '2026-10-26' });
    expect(summaries[1]).toMatchObject({ independentSuccesses: 0, supportedSuccesses: 1 });
    expect(summaries[1].recentCompletedEpisodes[0].assistance.evidenceMode).toBe('mixed');
    expect(summaries[2]).toMatchObject({ independentSuccesses: 0, supportedSuccesses: 1 });
    expect(summaries[2].recentCompletedEpisodes[0].assistance).toMatchObject({ assessedTextReadAloud: true, evidenceMode: 'listening-supported' });
    expect(summaries[2].missingEvidence).toContain('No independent first-Check success recorded for this objective.');
  });
  it('does not inflate attempts when deliberate unsuccessful finish completes one episode', () => {
    const wrong = check('A', 'M01', { correct: false, firstCheckCorrect: false, episodeCompletion: null });
    let evidence = applyLearningObservation({}, wrong);
    expect(summarizeLearning(evidence, tasks(['M01']), '2026-10-23')[0]).toMatchObject({ validChecks: 1, completedEpisodes: 0 });
    const { submissionId: _submission, episodeCheckIndex: _episode, encounterCheckIndex: _encounter, ...facts } = wrong as Extract<LearningObservation, { kind: 'check' }>;
    evidence = applyLearningObservation(evidence, { ...facts, kind: 'finished-unsuccessfully', episodeCompletion: 'deliberate-unsuccessful' });
    expect(summarizeLearning(evidence, tasks(['M01']), '2026-10-23')[0]).toMatchObject({ validChecks: 1, completedEpisodes: 1, independentSuccesses: 0 });
  });
  it('shows ready-for-harder-work then review-due on explicit dates, with no ability percentage', () => {
    let evidence: SkillEvidence = {};
    for (const id of ['A', 'B', 'C']) evidence = applyLearningObservation(evidence, check(id));
    const ready = summarizeLearning(evidence, tasks(['M01']), '2026-10-25')[0];
    expect(ready).toMatchObject({ label: 'ready-for-harder-work', independentSuccesses: 3, currentBand: 'core' });
    expect(summarizeLearning(evidence, tasks(['M01']), '2026-10-26')[0]).toMatchObject({ label: 'review-due', reviewDueLocalDate: '2026-10-26' });
    expect(JSON.stringify(ready)).not.toMatch(/percent|mastery|points|questLock/i);
  });
  it('retains dated familiar review labels and the latest actual result', () => {
    let evidence = applyLearningObservation({}, check('A'));
    evidence = applyLearningObservation(evidence, check('review', 'M01', { canonicalQuestionId: 'A', selectionReason: 'due-review',
      familiar: true, localDate: '2026-10-26', competitionWeekId: '2026-10-26',
      reviewReference: { canonicalQuestionId: 'A', dueLocalDate: '2026-10-26', previousSuccessWeek: '2026-10-19' } }));
    const summary = summarizeLearning(evidence, tasks(['M01']), '2026-10-26')[0];
    expect(summary).toMatchObject({ label: 'practising', reviewDueLocalDate: '2026-11-02', laterDistinctSuccesses: 0,
      latestReview: { canonicalQuestionId: 'A', localDate: '2026-10-26', competitionWeekId: '2026-10-26', outcome: 'independent-success', familiar: true } });
    expect(summary.recentCompletedEpisodes[0]).toMatchObject({ familiar: true, localDate: '2026-10-26' });
  });
  it('reports the latest within-band outcome when two reviews occurred on the same civil date', () => {
    let evidence = applyLearningObservation({}, check('helped', 'M01', { selectionReason: 'due-review', assistance: { ...neutral, answerHintUsed: true } }));
    evidence = applyLearningObservation(evidence, check('independent', 'M01', { selectionReason: 'due-review' }));
    const summary = summarizeLearning(evidence, tasks(['M01']), '2026-10-23')[0];
    expect(summary.latestReview).toMatchObject({ canonicalQuestionId: 'independent', outcome: 'independent-success' });
    expect(summary.recentCompletedEpisodes.map(row => row.canonicalQuestionId)).toEqual(['independent', 'helped']);
  });
  it('reports evidence when content is missing without making it available', () => {
    const evidence = applyLearningObservation({}, check('A'));
    const summary = summarizeLearning(evidence, [], '2026-10-23')[0];
    expect(summary.availableBands).toEqual([]);
    expect(summary.missingEvidence).toContain('No approved task is currently delivered for this skill.');
    expect(summary.validChecks).toBe(1);
  });
  it('uses delivered bands rather than declared bands and supports all twenty skills when actually supplied', () => {
    expect(summarizeLearning({}, tasks(['M01']).filter(task => task.band === 'support'), '2026-10-23')[0])
      .toMatchObject({ availableBands: ['support'], currentBand: 'support', suggestion: { band: 'core' } });
    expect(summarizeLearning({}, tasks(SKILLS.map(skill => skill.skillId)), '2026-10-23')).toHaveLength(20);
    expect(summarizeLearning({}, tasks(['M01']).map(task => ({ ...task, review: { ...task.review, status: 'withheld' } })), '2026-10-23')).toEqual([]);
  });
  it('keeps current-band date ties deterministic and does not let a still-open higher-band wrong Check replace it', () => {
    let evidence = applyLearningObservation({}, check('core'));
    evidence = applyLearningObservation(evidence, check('stretch', 'M01', { band: 'stretch', correct: false, firstCheckCorrect: false, episodeCompletion: null }));
    expect(summarizeLearning(evidence, tasks(['M01']), '2026-10-23')[0].currentBand).toBe('core');
    evidence = applyLearningObservation(evidence, check('support', 'M01', { band: 'support' }));
    expect(summarizeLearning(evidence, tasks(['M01']), '2026-10-23')[0].currentBand).toBe('core');
  });
  it('is pure with deeply frozen evidence/catalogue and serializable results', () => {
    const evidence = frozen(applyLearningObservation({}, check('A'))), catalogue = frozen(tasks(['M01', 'E06']));
    const before = JSON.stringify([evidence, catalogue]);
    const summaries = summarizeLearning(evidence, catalogue, '2026-10-23');
    expect(JSON.stringify([evidence, catalogue])).toBe(before);
    expect(JSON.parse(JSON.stringify(summaries))).toEqual(summaries);
  });
  it('keeps pure modules free of state, UI, playback, storage, clocks and allocation APIs', () => {
    for (const file of ['evidence', 'select', 'summarize']) {
      const source = readFileSync(new URL(`../../src/learning/${file}.ts`, import.meta.url), 'utf8');
      expect(source).not.toMatch(/from ['"].*(?:state|experience|audio|react)/);
      expect(source).not.toMatch(/Date\.now|new Date\(|document\.|window\.|localStorage|indexedDB|randomUUID|Math\.random|speechSynthesis/);
    }
  });
});
