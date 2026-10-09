import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { COSMETICS, QUESTS } from '../../src/experience/catalogue';
import type { LearningAssistance } from '../../src/learning/contracts';
import type { CalendarContext, CanonicalRewardTrack, CompetitionState, RewardCheckInput,
  RewardCheckResult, RewardOpportunity, RewardSelectionFacts, RewardState } from '../../src/rewards/contracts';
import { applyCheckRewards, applyQuestReward, classifyRewardEligibility, compactCompletedOpportunity,
  deriveCosmeticEntitlements, validateRewardState } from '../../src/rewards/scoring';

const profileId = 'profile-1';
const W1 = '2026-10-05', W2 = '2026-10-12', W3 = '2026-10-19';
const context = (activeWeek = W1, observedLocalDate = activeWeek): CalendarContext =>
  ({ activeWeek, observedLocalDate, clockRollback: false });
const rewards = (): RewardState => ({ lifetimePoints: 0, tracksByCanonical: {}, questReceipts: [], entitlementIds: [] });
const competition = (activeWeek = W1): CompetitionState => ({ timezone: 'Europe/London', latestOpenedWeek: activeWeek,
  currentScores: {}, currentSlots: {}, archives: [], policyVersion: '1' });
const track = (): CanonicalRewardTrack => ({ lastAllocatedOrdinal: 0, completedThroughOrdinal: 0,
  closedAwardTotal: 0, freePractice: { validChecks: 0, answerHintUsed: false } });
const assistance: LearningAssistance = { answerHintUsed: false, workedSupportUsed: false,
  assessedTextReadAloud: false, evidenceMode: 'independent' };

/** Independently authored JSON fixtures for WP04 decoder/composition tests.
 * Ordinal 1 earned 20 and is folded; ordinal 2 earned 5+5 and remains exact. */
export const compactRewardFixture: RewardState = {
  lifetimePoints: 30, questReceipts: [], entitlementIds: ['scarf-leaf'],
  tracksByCanonical: { 'fixture-bridge': {
    lastAllocatedOrdinal: 2, completedThroughOrdinal: 1, closedAwardTotal: 20,
    lastSuccessWeek: '2026-10-12', lastSuccessLocalDate: '2026-10-13',
    freePractice: { validChecks: 0, answerHintUsed: false },
    recentCompletedOpportunity: {
      opportunityId: 'fixture-opportunity-2', profileId: 'profile-1', canonicalQuestionId: 'fixture-bridge', ordinal: 2,
      selectionFacts: { profileId: 'profile-1', canonicalQuestionId: 'fixture-bridge', encounterId: 'fixture-review',
        selectionReason: 'due-review', candidate: 'later-week-due-review', band: 'core',
        previousSuccessWeek: '2026-10-05', dueLocalDate: '2026-10-12' },
      earningWeek: '2026-10-12', slot: 1, validChecks: 2, answerHintUsed: false,
      firstSuccessWeek: '2026-10-12', firstSuccessLocalDate: '2026-10-13',
      components: { answer: true, independentSuccess: false, supportedSuccess: true },
    },
  } },
};
export const compactCompetitionFixture: CompetitionState = {
  timezone: 'Europe/London', latestOpenedWeek: '2026-10-12', policyVersion: '1', archives: [],
  currentScores: { 'profile-1': 10 }, currentSlots: { 'profile-1': [{ slot: 1,
    opportunityId: 'fixture-opportunity-2', canonicalQuestionId: 'fixture-bridge', points: 10 }] },
};
const select = (canonical = 'canonical-1', extra: Partial<RewardSelectionFacts> = {}): RewardSelectionFacts =>
  ({ profileId, canonicalQuestionId: canonical, encounterId: `encounter-${canonical}`,
    selectionReason: 'adaptive', candidate: 'first-encounter', band: 'core', ...extra });
const review = (canonical: string, previousSuccessWeek = W1, dueLocalDate = W2): RewardSelectionFacts =>
  select(canonical, { selectionReason: 'due-review', candidate: 'later-week-due-review', previousSuccessWeek,
    dueLocalDate, encounterId: `review-${canonical}-${dueLocalDate}` });
// WP04 allocates tokens/ordinals; this fixture performs that external step.
function open(r: RewardState, s: RewardSelectionFacts, token = `opportunity-${s.encounterId}`, hint = false): RewardState {
  const previous = Object.hasOwn(r.tracksByCanonical, s.canonicalQuestionId)
    ? r.tracksByCanonical[s.canonicalQuestionId] : track();
  const opportunity: RewardOpportunity = { opportunityId: token, profileId, canonicalQuestionId: s.canonicalQuestionId,
    ordinal: previous.lastAllocatedOrdinal + 1, selectionFacts: s, earningWeek: null, slot: null,
    validChecks: 0, answerHintUsed: hint,
    components: { answer: false, independentSuccess: false, supportedSuccess: false } };
  return { ...r, tracksByCanonical: { ...r.tracksByCanonical, [s.canonicalQuestionId]: {
    ...previous, lastAllocatedOrdinal: opportunity.ordinal, currentOpportunity: opportunity } } };
}
function input(r: RewardState, c: CompetitionState, s: RewardSelectionFacts, correct = true,
  extra: Partial<RewardCheckInput> = {}): RewardCheckInput {
  const t = Object.hasOwn(r.tracksByCanonical, s.canonicalQuestionId) ? r.tracksByCanonical[s.canonicalQuestionId] : null;
  const o = t?.currentOpportunity;
  const count = o?.validChecks ?? t?.freePractice.validChecks ?? 0;
  return { profileId, encounterId: s.encounterId, opportunityId: o?.opportunityId ?? null,
    submissionId: `submission-${s.encounterId}-${count + 1}`, checkSequence: count + 1, validChecks: count,
    track: t, rewards: r, evaluation: { status: 'judged', correct, canonicalQuestionId: s.canonicalQuestionId,
      skillId: 'M01', objectiveId: 'M01-addition-subtraction', band: s.band, feedback: { explanation: '', issues: [] } },
    assistance, selection: s, competition: c, context: context(c.latestOpenedWeek!), ...extra };
}
function frozen<T>(v: T): T {
  if (v !== null && typeof v === 'object') {
    Object.values(v).forEach(frozen);
    Object.freeze(v);
  }
  return v;
}
function check(i: RewardCheckInput): RewardCheckResult {
  const before = JSON.stringify(i);
  const result = applyCheckRewards(frozen(i));
  expect(JSON.stringify(i)).toBe(before);
  expect(validateRewardState(result.nextRewards, result.nextCompetition, profileId, COSMETICS)).toEqual([]);
  return result;
}
function eligibility(t: CanonicalRewardTrack | null, s: RewardSelectionFacts, activeWeek = W1, today = activeWeek) {
  return classifyRewardEligibility(frozen({ track: t, selection: s, context: context(activeWeek, today) }));
}

describe('explicit once-only Check components (P5-A)', () => {
  it.each([
    ['unassisted', assistance, 20, 'independent-success'],
    ['answer hint', { ...assistance, answerHintUsed: true }, 10, 'supported-success'],
    ['worked method', { ...assistance, workedSupportUsed: true }, 10, 'supported-success'],
    ['assessed read-aloud', { ...assistance, assessedTextReadAloud: true, evidenceMode: 'listening-supported' as const }, 20, 'independent-success'],
  ] as const)('%s has exact receipts', (_name, help, expected, component) => {
    const s = select();
    const r = check(input(open(rewards(), s), competition(), s, true, { assistance: help }));
    expect(r.delta).toEqual({ lifetimeDelta: expected, competitiveDelta: expected, consumedSlot: 1,
      newReceiptKeys: [{ opportunityId: `opportunity-${s.encounterId}`, component: 'answer' },
        { opportunityId: `opportunity-${s.encounterId}`, component }],
      newEntitlementIds: expected === 20 ? ['scarf-leaf'] : [] });
    expect(r.nextRewards.tracksByCanonical[s.canonicalQuestionId].currentOpportunity).toBeUndefined();
  });
  it('wrong → finish episode 1 → episode 2 correct is 5 + 5; further delivery cannot award', () => {
    const s = select();
    const wrong = check(input(open(rewards(), s), competition(), s, false));
    expect(wrong.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: 1 });
    // FinishPractice/navigation/reload is deliberately no scoring call or state change.
    const reloaded = JSON.parse(JSON.stringify(wrong.nextRewards)) as RewardState;
    const correct = check(input(reloaded, wrong.nextCompetition, s));
    expect(correct.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: null });
    expect(correct.nextRewards.lifetimePoints).toBe(10);
    const completed = correct.nextRewards.tracksByCanonical[s.canonicalQuestionId].recentCompletedOpportunity!;
    expect(completed).toMatchObject({ validChecks: 2, ordinal: 1, slot: 1 });
    const further = check(input(correct.nextRewards, correct.nextCompetition, s, true, {
      opportunityId: completed.opportunityId, validChecks: 2, checkSequence: 3,
    }));
    expect(further.delta.newReceiptKeys).toEqual([]);
    expect(further.nextRewards).toBe(correct.nextRewards);
    expect(() => applyCheckRewards(input(correct.nextRewards, correct.nextCompetition, s, true, {
      opportunityId: completed.opportunityId, validChecks: 1, checkSequence: 2,
    }))).toThrow('Stale completed');
  });
  it('hint is sticky across wrong Checks, JSON reload and returning episodes', () => {
    const s = select();
    const first = check(input(open(rewards(), s, 'opportunity-1', true), competition(), s, false));
    const again = check(input(first.nextRewards, first.nextCompetition, s, false));
    expect(again.delta.lifetimeDelta).toBe(0);
    const last = check(input(again.nextRewards, again.nextCompetition, s));
    expect(last.nextRewards.lifetimePoints).toBe(10);
    expect(last.nextRewards.tracksByCanonical[s.canonicalQuestionId].recentCompletedOpportunity).toMatchObject({ validChecks: 3, answerHintUsed: true });
  });
  it('an unbound hinted opportunity resumes its recorded selection across routes and Monday', () => {
    const s = select();
    const opened = open(rewards(), s, 'precheck-hinted-token', true);
    const t = opened.tracksByCanonical[s.canonicalQuestionId];
    expect(eligibility(t, { ...s, encounterId: 'new-route', selectionReason: 'child-practice', candidate: 'none' }, W2))
      .toEqual({ kind: 'resume-existing', reason: 'unfinished-opportunity' });
    const resumed = check(input(opened, competition(W2), s));
    expect(resumed.delta).toMatchObject({ lifetimeDelta: 10, competitiveDelta: 10, consumedSlot: 1 });
    expect(resumed.nextRewards.tracksByCanonical[s.canonicalQuestionId].recentCompletedOpportunity)
      .toMatchObject({ opportunityId: 'precheck-hinted-token', earningWeek: W2, answerHintUsed: true });
  });
  it('incomplete/invalid input, old episode counts and mismatched facts are rejected without mutation', () => {
    const s = select();
    const base = frozen(input(open(rewards(), s), competition(), s));
    for (const extra of [
      { evaluation: { status: 'incomplete', missing: ['slot'] } },
      { evaluation: { status: 'invalid-response', reason: 'unknown object' } },
      { checkSequence: 0 }, { validChecks: 1 }, { encounterId: 'new-session' }, { profileId: 'foreign' },
      { opportunityId: 'unallocated' }, { track: null },
      { selection: { ...s, candidate: 'none' } },
      { evaluation: { ...base.evaluation, canonicalQuestionId: 'other-task' } },
    ]) expect(() => applyCheckRewards({ ...base, ...extra } as RewardCheckInput)).toThrow(RangeError);
    const wrong = check({ ...base, evaluation: { ...base.evaluation, correct: false } });
    expect(() => applyCheckRewards(input(wrong.nextRewards, wrong.nextCompetition, s, true,
      { validChecks: 0, checkSequence: 1 }))).toThrow('cumulative');
    expect(base.rewards.lifetimePoints).toBe(0); // Editing/narration makes no call.
  });
});

describe('canonical selection and free practice (P5-B)', () => {
  it('classifies fresh, child-selected, familiar, due, stale, future-due and changed-week cases', () => {
    const s = select();
    expect(eligibility(null, s)).toEqual({ kind: 'eligible-first', reason: 'first-encounter' });
    expect(eligibility(null, { ...s, selectionReason: 'child-practice' })).toMatchObject({ reason: 'child-practice' });
    expect(eligibility(null, { ...s, candidate: 'none' })).toMatchObject({ reason: 'not-due' });
    const done = check(input(open(rewards(), s), competition(), s));
    const t = done.nextRewards.tracksByCanonical[s.canonicalQuestionId];
    for (const encounterId of ['reshuffled-objects', 'alternate-answer', 'new-session', 'cosmetic-release']) {
      expect(eligibility(t, { ...s, encounterId })).toMatchObject({ reason: 'same-week-used' });
    }
    expect(eligibility(t, s, W2)).toMatchObject({ reason: 'familiar-repeat' });
    expect(eligibility(t, review(s.canonicalQuestionId), W2)).toMatchObject({ kind: 'eligible-review' });
    expect(eligibility(t, review(s.canonicalQuestionId, W1, '2026-10-14'), W2)).toMatchObject({ reason: 'not-due' });
    expect(eligibility(t, review(s.canonicalQuestionId, '2026-09-28'), W2)).toMatchObject({ reason: 'not-due' });
    expect(eligibility(null, select('different-validated-parameters'), W2)).toMatchObject({ kind: 'eligible-first' });
    const wrong = check(input(open(rewards(), s), competition(), s, false));
    expect(eligibility(wrong.nextRewards.tracksByCanonical[s.canonicalQuestionId], s, W2)).toMatchObject({ kind: 'resume-existing' });
  });
  it('free-practice wrong → finish → route switch → success stays zero and waits for later due review', () => {
    const s = select('free', { selectionReason: 'child-practice', candidate: 'none' });
    const wrong = check(input(rewards(), competition(), s, false, { assistance: { ...assistance, answerHintUsed: true } }));
    const t = wrong.nextRewards.tracksByCanonical.free;
    expect(t.freePractice).toEqual({ latestWeek: W1, validChecks: 1, answerHintUsed: true, unfinishedEncounterId: s.encounterId });
    expect(eligibility(t, select('free'))).toMatchObject({ reason: 'unfinished-free-practice' });
    expect(eligibility(t, select('free'), W2)).toMatchObject({ reason: 'unfinished-free-practice' });
    const success = check(input(wrong.nextRewards, wrong.nextCompetition, { ...s, selectionReason: 'story', candidate: 'first-encounter' }));
    expect(success.nextRewards.lifetimePoints).toBe(0);
    expect(success.nextCompetition.currentSlots).toEqual({});
    expect(success.nextRewards.tracksByCanonical.free.freePractice).toMatchObject({ validChecks: 2, answerHintUsed: true });
    expect(eligibility(success.nextRewards.tracksByCanonical.free, select('free'))).toMatchObject({ reason: 'same-week-used' });
    const later = review('free');
    const earned = check(input(open(success.nextRewards, later), competition(W2), later));
    expect(earned.nextRewards.lifetimePoints).toBe(20);
  });
  it('revalidates stale provisional selection and preserves its pre-Check hint as practice', () => {
    const s = select('stale');
    const opened = open(rewards(), s, 'stale-token', true);
    const previous = opened.tracksByCanonical.stale;
    const contaminated: RewardState = { ...opened, tracksByCanonical: { stale: { ...previous,
      freePractice: { validChecks: 1, answerHintUsed: false, latestWeek: W1 },
      lastSuccessWeek: W1, lastSuccessLocalDate: W1 } } };
    const result = check(input(contaminated, competition(), s, true, { validChecks: 1, checkSequence: 2 }));
    expect(result.delta.lifetimeDelta).toBe(0);
    expect(result.nextRewards.tracksByCanonical.stale).toMatchObject({ lastAllocatedOrdinal: 1,
      freePractice: { validChecks: 2, answerHintUsed: true } });
    expect(result.nextRewards.tracksByCanonical.stale.currentOpportunity).toBeUndefined();
    expect(() => applyCheckRewards(input(result.nextRewards, result.nextCompetition, s, true,
      { opportunityId: 'stale-token' }))).toThrow('Unknown or compacted');
  });
  it('unfinished free practice rejects another encounter/episode-local reset; completed practice permits a new encounter', () => {
    const s = select('practice-continuation', { selectionReason: 'child-practice', candidate: 'none' });
    const wrong = check(input(rewards(), competition(), s, false));
    expect(() => applyCheckRewards(input(wrong.nextRewards, wrong.nextCompetition, s, true,
      { validChecks: 0, checkSequence: 1 }))).toThrow('cumulative');
    expect(() => applyCheckRewards(input(wrong.nextRewards, wrong.nextCompetition,
      { ...s, encounterId: 'replacement-encounter' }))).toThrow('must resume');
    const done = check(input(wrong.nextRewards, competition(W2), s));
    const repeated = check(input(done.nextRewards, done.nextCompetition, { ...s, encounterId: 'new-after-success' }, true,
      { validChecks: 0, checkSequence: 1 }));
    expect(repeated.nextRewards.lifetimePoints).toBe(0);
    expect(repeated.nextRewards.tracksByCanonical[s.canonicalQuestionId]).toMatchObject({
      lastSuccessWeek: W2, lastSuccessLocalDate: W2, freePractice: { validChecks: 1 } });
    expect(eligibility(repeated.nextRewards.tracksByCanonical[s.canonicalQuestionId], review(s.canonicalQuestionId, W1), W2))
      .toMatchObject({ reason: 'same-week-used' });
  });
});

describe('slots, earning weeks and late success (P5-C)', () => {
  it('independent oracle: 31 first successes = 620 lifetime / 600 competitive / 30 slots', () => {
    let r = rewards(), c = competition();
    for (let n = 1; n <= 31; n++) {
      const s = select(`task-${n}`);
      const result = check(input(open(r, s), c, s));
      expect(result.delta).toMatchObject({ lifetimeDelta: 20, competitiveDelta: n <= 30 ? 20 : 0,
        consumedSlot: n <= 30 ? n : null });
      r = result.nextRewards; c = result.nextCompetition;
    }
    expect(r.lifetimePoints).toBe(620);
    expect(c.currentScores[profileId]).toBe(600);
    expect(c.currentSlots[profileId]).toHaveLength(30);
    expect(c.currentSlots[profileId].map(s => s.slot)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(r.entitlementIds).toEqual(['scarf-leaf', 'planter-rim', 'home-trim', 'scarf-star', 'scarf-wave']);
  });
  it('wrong answers reserve all 30 slots; capped unfinished work never receives a later slot', () => {
    let r = rewards(), c = competition();
    for (let n = 1; n <= 31; n++) {
      const s = select(`wrong-${n}`);
      const result = check(input(open(r, s), c, s, false));
      r = result.nextRewards; c = result.nextCompetition;
    }
    expect(r.lifetimePoints).toBe(155);
    expect(c.currentScores[profileId]).toBe(150);
    const retry = check(input(r, c, select('wrong-1')));
    expect(retry.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: null });
    expect(retry.nextCompetition.currentSlots[profileId]).toHaveLength(30);
    const capped = check(input(retry.nextRewards, competition(W2), select('wrong-31')));
    expect(capped.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 0, consumedSlot: null });
    expect(capped.nextRewards.tracksByCanonical['wrong-31'].recentCompletedOpportunity).toMatchObject({ earningWeek: W1, slot: null });
  });
  it('Sunday hint binds on Monday; Sunday Check binds permanently and late success leaves archives byte-equivalent', () => {
    const s = select();
    const monday = check(input(open(rewards(), s, 'sunday-selected', true), competition(W2), s));
    expect(monday.delta).toMatchObject({ lifetimeDelta: 10, competitiveDelta: 10 });
    expect(monday.nextRewards.tracksByCanonical[s.canonicalQuestionId].recentCompletedOpportunity?.earningWeek).toBe(W2);
    const sunday = check(input(open(rewards(), s), competition(), s, false, { context: context(W1, '2026-10-11') }));
    const closed: CompetitionState = { ...competition(W2), archives: [{ week: W1, timezone: 'Europe/London', policyVersion: '1',
      entries: [{ profileId, nickname: 'Pip', avatarId: 'pip', points: 5, rank: 1, medal: 'gold' }], omittedDeletedProfiles: false }] };
    const late = check(input(sunday.nextRewards, closed, s));
    expect(late.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 0, consumedSlot: null });
    expect(late.nextCompetition).toBe(closed);
    expect(late.nextRewards.tracksByCanonical[s.canonicalQuestionId]).toMatchObject({ lastSuccessWeek: W2,
      recentCompletedOpportunity: { earningWeek: W1, firstSuccessWeek: W2, firstSuccessLocalDate: W2, slot: 1 } });
    expect(eligibility(late.nextRewards.tracksByCanonical[s.canonicalQuestionId], review(s.canonicalQuestionId, W1), W2)).toMatchObject({ reason: 'same-week-used' });
    expect(eligibility(late.nextRewards.tracksByCanonical[s.canonicalQuestionId], review(s.canonicalQuestionId, W2, W3), W3)).toMatchObject({ kind: 'eligible-review' });
  });
  it('rollback stays in reconciled active week and makes no time/difficulty bonus', () => {
    const s = select();
    const normal = check(input(open(rewards(), s), competition(), s));
    const rollback = check(input(open(rewards(), s), competition(), s, true,
      { context: { observedLocalDate: '2026-10-04', activeWeek: W1, clockRollback: true } }));
    expect(rollback.delta).toEqual(normal.delta);
    const stretch = select('stretch', { band: 'stretch' });
    expect(check(input(open(rewards(), stretch), competition(), stretch)).delta.lifetimeDelta).toBe(20);
  });
});

describe('quests, entitlements and bounded compaction (P5-D)', () => {
  it('three supported quests unlock both starter choices; quest receipts never affect competition', () => {
    let r = rewards(), c = competition();
    for (const questId of ['Q1', 'Q2', 'Q3']) {
      const s = select(questId);
      const result = check(input(open(r, s), c, s, true, { assistance: { ...assistance, answerHintUsed: true } }));
      const award = applyQuestReward(frozen({ profileId, questId, questCompleted: true, rewards: result.nextRewards }));
      expect(award.delta).toMatchObject({ lifetimeDelta: 20, competitiveDelta: 0, newReceiptKeys: [{ profileId, questId }] });
      r = award.nextRewards; c = result.nextCompetition;
      expect(applyQuestReward({ profileId, questId, questCompleted: true, rewards: r })).toMatchObject({ nextRewards: r, delta: { lifetimeDelta: 0 } });
      expect(validateRewardState(r, c, profileId, COSMETICS)).toEqual([]);
    }
    expect(r.lifetimePoints).toBe(90);
    expect(c.currentScores[profileId]).toBe(30);
    expect(r.entitlementIds).toEqual(['scarf-leaf', 'planter-rim']);
  });
  it('all ten stable quests use +20 once; thresholds are exact permanent choices', () => {
    let r = rewards();
    for (const q of QUESTS) r = applyQuestReward({ profileId, questId: q.id, questCompleted: true, rewards: r }).nextRewards;
    expect(r.lifetimePoints).toBe(200);
    expect(r.questReceipts).toHaveLength(10);
    expect(applyQuestReward({ profileId, questId: 'Q1', questCompleted: false, rewards: r }).delta.lifetimeDelta).toBe(0);
    expect(() => applyQuestReward({ profileId, questId: 'challenge-30', questCompleted: true, rewards: r })).toThrow();
    for (const [n, expected] of [[19, []], [20, ['scarf-leaf']], [59, ['scarf-leaf']], [60, ['scarf-leaf', 'planter-rim']],
      [149, ['scarf-leaf', 'planter-rim']], [150, ['scarf-leaf', 'planter-rim', 'home-trim']],
      [299, ['scarf-leaf', 'planter-rim', 'home-trim']], [300, ['scarf-leaf', 'planter-rim', 'home-trim', 'scarf-star', 'scarf-wave']]] as const) {
      expect(deriveCosmeticEntitlements(n, COSMETICS)).toEqual(expected);
    }
  });
  it('success → later review → compact → old delivery rejects; retained unfinished work can succeed', () => {
    const s = select();
    const first = check(input(open(rewards(), s), competition(), s));
    const s2 = review(s.canonicalQuestionId);
    const wrong = check(input(open(first.nextRewards, s2, 'opportunity-2'), competition(W2), s2, false));
    const pending = wrong.nextRewards.tracksByCanonical[s.canonicalQuestionId];
    expect(compactCompletedOpportunity(frozen(pending), W2)).toBe(pending);
    expect(pending).toMatchObject({ closedAwardTotal: 0, completedThroughOrdinal: 0,
      currentOpportunity: { ordinal: 2, validChecks: 1 }, recentCompletedOpportunity: { ordinal: 1 } });
    const second = check(input(wrong.nextRewards, wrong.nextCompetition, s2));
    const compact = second.nextRewards.tracksByCanonical[s.canonicalQuestionId];
    expect(compact).toMatchObject({ closedAwardTotal: 20, completedThroughOrdinal: 1,
      lastAllocatedOrdinal: 2, recentCompletedOpportunity: { ordinal: 2, validChecks: 2 } });
    expect(second.nextRewards.lifetimePoints).toBe(30);
    expect(compactCompletedOpportunity(frozen(compact), W2)).toBe(compact);
    expect(() => applyCheckRewards(input(second.nextRewards, second.nextCompetition, s, true,
      { opportunityId: `opportunity-${s.encounterId}`, validChecks: 1, checkSequence: 2 }))).toThrow('Unknown or compacted');
    const s3 = review(s.canonicalQuestionId, W2, W3);
    const third = check(input(open(second.nextRewards, s3, 'opportunity-3'), competition(W3), s3));
    expect(third.nextRewards.lifetimePoints).toBe(50);
    expect(third.nextRewards.tracksByCanonical[s.canonicalQuestionId]).toMatchObject({ closedAwardTotal: 30, completedThroughOrdinal: 2 });
    expect(Object.keys(third.nextRewards.tracksByCanonical)).toEqual([s.canonicalQuestionId]);
    expect(JSON.parse(JSON.stringify(third.nextRewards))).toEqual(third.nextRewards);
  });
  it('rejects active-week compaction and retains exact oldest-unfinished facts across repeated compaction', () => {
    const s = select();
    const done = check(input(open(rewards(), s), competition(), s));
    const t = done.nextRewards.tracksByCanonical[s.canonicalQuestionId];
    const older = t.recentCompletedOpportunity!;
    expect(() => compactCompletedOpportunity({ ...t, lastAllocatedOrdinal: 2,
      currentOpportunity: { ...older, opportunityId: 'forged-second', ordinal: 2 } }, W1)).toThrow('active-week');
    const wrong = check(input(open(rewards(), s, 'unfinished-hinted', true), competition(), s, false));
    const pending = wrong.nextRewards.tracksByCanonical[s.canonicalQuestionId];
    for (const w of [W1, W2, W3]) expect(compactCompletedOpportunity(pending, w)).toBe(pending);
    const eventual = check(input(wrong.nextRewards, competition(W3), s));
    expect(eventual.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 0 });
    expect(eventual.nextRewards.lifetimePoints).toBe(10);
  });
});

describe('rejecting invariant API and purity', () => {
  it('F1: rejects bound review history that precedes actual success or masquerades as a first encounter', () => {
    const s = select('late-review');
    const wrong = check(input(open(rewards(), s), competition(), s, false,
      { assistance: { ...assistance, answerHintUsed: true } }));
    const late = check(input(wrong.nextRewards, competition(W2), s));
    const nextSelection = review('late-review', W2, W3);
    const pending = check(input(open(late.nextRewards, nextSelection), competition(W3), nextSelection, false));
    expect(pending.nextRewards.lifetimePoints).toBe(15);
    const t = pending.nextRewards.tracksByCanonical['late-review'];
    const o = t.currentOpportunity!;
    const contradictions = [
      { activeWeek: W2, opportunity: { ...o, earningWeek: W2,
        selectionFacts: { ...nextSelection, previousSuccessWeek: W1, dueLocalDate: W2 } } },
      { activeWeek: W3, opportunity: { ...o,
        selectionFacts: { ...nextSelection, selectionReason: 'adaptive' as const, candidate: 'first-encounter' as const } } },
      { activeWeek: W3, opportunity: { ...o,
        selectionFacts: { ...nextSelection, previousSuccessWeek: W1 } } },
    ];
    for (const { activeWeek, opportunity } of contradictions) {
      const r: RewardState = frozen({ ...pending.nextRewards,
        tracksByCanonical: { 'late-review': { ...t, currentOpportunity: opportunity } } });
      const c = frozen({ ...pending.nextCompetition, latestOpenedWeek: activeWeek });
      const before = JSON.stringify([r, c]);
      // Classification alone is provisional; decode must reject before continuation.
      expect(eligibility(r.tracksByCanonical['late-review'], opportunity.selectionFacts, activeWeek))
        .toMatchObject({ kind: 'resume-existing' });
      let continued: string;
      try {
        const result = applyCheckRewards(input(r, c, opportunity.selectionFacts));
        continued = `${result.delta.lifetimeDelta}/${result.delta.competitiveDelta}`;
      } catch (error) { continued = error instanceof RangeError ? 'RangeError' : String(error); }
      expect({ rejected: validateRewardState(r, c, profileId, COSMETICS).length > 0, continued })
        .toEqual({ rejected: true, continued: 'RangeError' });
      expect(JSON.stringify([r, c])).toBe(before);
    }
    const legitimate = check(input(pending.nextRewards, pending.nextCompetition, nextSelection));
    expect(legitimate.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 5 });
    expect(legitimate.nextRewards).toMatchObject({ lifetimePoints: 20,
      tracksByCanonical: { 'late-review': { closedAwardTotal: 10, completedThroughOrdinal: 1 } } });
  });
  it('F2: rejects orphaned completion marks before classification/allocation can refresh rewards', () => {
    const orphan: CanonicalRewardTrack = JSON.parse('{"lastAllocatedOrdinal":1,"completedThroughOrdinal":1,"closedAwardTotal":0,"freePractice":{"validChecks":0,"answerHintUsed":false}}');
    const s = select('orphan');
    const r = frozen({ ...rewards(), tracksByCanonical: { orphan } });
    const c = frozen(competition(W2));
    let continued: string;
    try {
      const result = applyCheckRewards(input(open(r, s), c, s));
      continued = `${result.delta.lifetimeDelta}/${result.delta.competitiveDelta}`;
    } catch (error) { continued = error instanceof RangeError ? 'RangeError' : String(error); }
    expect({ rejected: validateRewardState(r, c, profileId, COSMETICS).length > 0,
      classification: eligibility(orphan, s, W2).kind, continued })
      .toEqual({ rejected: true, classification: 'practice-only', continued: 'RangeError' });
  });
  it('F2 variants: compaction must retain contributions and latest completion without requiring contiguous ordinals', () => {
    const base = compactRewardFixture.tracksByCanonical['fixture-bridge'];
    for (const t of [{ ...base, closedAwardTotal: 0 },
      { ...base, recentCompletedOpportunity: undefined },
      { ...base, lastSuccessWeek: undefined, lastSuccessLocalDate: undefined }]) {
      const retained = t.recentCompletedOpportunity === undefined ? 0 : 10;
      const lifetimePoints = t.closedAwardTotal + retained;
      const r: RewardState = { lifetimePoints, tracksByCanonical: { 'fixture-bridge': t }, questReceipts: [],
        entitlementIds: lifetimePoints >= 20 ? ['scarf-leaf'] : [] };
      expect(validateRewardState(frozen(r), compactCompetitionFixture, profileId, COSMETICS))
        .toContainEqual({ path: 'tracksByCanonical.fixture-bridge',
          message: 'Compaction mark requires earned contributions and retained completion/success history' });
    }
    const s = select('gap');
    const opened = open(rewards(), s, 'removed-provisional', true);
    const contaminated = { ...opened, tracksByCanonical: { gap: { ...opened.tracksByCanonical.gap,
      lastSuccessWeek: W1, lastSuccessLocalDate: W1,
      freePractice: { validChecks: 1, answerHintUsed: false, latestWeek: W1 } } } };
    const removed = check(input(contaminated, competition(), s, true, { validChecks: 1, checkSequence: 2 }));
    expect(removed.nextRewards.tracksByCanonical.gap).toMatchObject({ lastAllocatedOrdinal: 1,
      completedThroughOrdinal: 0, closedAwardTotal: 0 });
    const s2 = review('gap');
    expect(eligibility(removed.nextRewards.tracksByCanonical.gap, s2, W2)).toMatchObject({ kind: 'eligible-review' });
    const second = check(input(open(removed.nextRewards, s2, 'gap-opportunity-2'), competition(W2), s2, true,
      { assistance: { ...assistance, answerHintUsed: true } }));
    const s3 = review('gap', W2, W3);
    const third = check(input(open(second.nextRewards, s3, 'gap-opportunity-3'), competition(W3), s3));
    expect(third.nextRewards.lifetimePoints).toBe(30);
    expect(third.nextRewards.tracksByCanonical.gap).toMatchObject({ completedThroughOrdinal: 2, closedAwardTotal: 10,
      recentCompletedOpportunity: { ordinal: 3 } });
    expect(() => applyCheckRewards(input(third.nextRewards, third.nextCompetition, s, true,
      { opportunityId: 'removed-provisional' }))).toThrow('Unknown or compacted');
  });
  it('F1 variant: stale unchecked review still revalidates into practice instead of failing the bound-history invariant', () => {
    const s = select('provisional-review');
    const wrong = check(input(open(rewards(), s), competition(), s, false));
    const late = check(input(wrong.nextRewards, competition(W2), s));
    const stale = review('provisional-review', W1, W3);
    const opened = open(late.nextRewards, stale);
    expect(validateRewardState(opened, competition(W3), profileId, COSMETICS)).toEqual([]);
    expect(eligibility(opened.tracksByCanonical['provisional-review'], stale, W3)).toMatchObject({ reason: 'not-due' });
    const result = check(input(opened, competition(W3), stale));
    expect(result.delta).toMatchObject({ lifetimeDelta: 0, competitiveDelta: 0, newReceiptKeys: [] });
    expect(result.nextRewards.lifetimePoints).toBe(10);
    expect(result.nextRewards.tracksByCanonical['provisional-review'].currentOpportunity).toBeUndefined();
  });
  it('F3: actual malformed JSON arithmetic values return issues rather than throwing', () => {
    const malformed = JSON.parse('{"valueOf":null,"toString":null}');
    const badSlot = JSON.parse('{"slot":1,"opportunityId":"bad","canonicalQuestionId":"c","points":{"valueOf":null,"toString":null}}');
    const c = frozen({ ...competition(), currentSlots: { [profileId]: [badSlot] } });
    expect(validateRewardState(rewards(), c, profileId, COSMETICS).length).toBeGreaterThan(0);
    for (const field of ['closedAwardTotal', 'lastAllocatedOrdinal', 'completedThroughOrdinal'] as const) {
      const r = frozen({ ...rewards(), tracksByCanonical: { c: { ...track(), [field]: malformed } } });
      expect(validateRewardState(r, competition(), profileId, COSMETICS).length).toBeGreaterThan(0);
    }
    const base = compactRewardFixture.tracksByCanonical['fixture-bridge'];
    const opportunity = base.recentCompletedOpportunity!;
    for (const field of ['ordinal', 'validChecks', 'earningWeek', 'firstSuccessWeek', 'firstSuccessLocalDate'] as const) {
      const r = JSON.parse(JSON.stringify({ ...compactRewardFixture, tracksByCanonical: { 'fixture-bridge': {
        ...base, recentCompletedOpportunity: { ...opportunity, [field]: malformed },
      } } })) as RewardState;
      expect(validateRewardState(frozen(r), compactCompetitionFixture, profileId, COSMETICS).length).toBeGreaterThan(0);
    }
    for (const field of ['lastSuccessWeek', 'lastSuccessLocalDate'] as const) {
      const r = JSON.parse(JSON.stringify({ ...compactRewardFixture,
        tracksByCanonical: { 'fixture-bridge': { ...base, [field]: malformed } } })) as RewardState;
      expect(validateRewardState(frozen(r), compactCompetitionFixture, profileId, COSMETICS).length).toBeGreaterThan(0);
    }
    expect(validateRewardState(rewards(), { ...competition(), latestOpenedWeek: malformed }, profileId, COSMETICS).length)
      .toBeGreaterThan(0);
  });
  it('accepts the independently authored compact decoder fixture and continues its next legitimate review', () => {
    expect(validateRewardState(frozen(compactRewardFixture), frozen(compactCompetitionFixture), profileId, COSMETICS)).toEqual([]);
    const s = review('fixture-bridge', W2, W3);
    const next = check(input(open(compactRewardFixture, s, 'fixture-opportunity-3'), competition(W3), s));
    expect(next.nextRewards.lifetimePoints).toBe(50);
    expect(next.nextCompetition.currentScores[profileId]).toBe(20);
    expect(next.nextRewards.tracksByCanonical['fixture-bridge']).toMatchObject({ completedThroughOrdinal: 2, closedAwardTotal: 30 });
  });
  it('rejects forged receipts, totals, ordinals, component combinations, identities, slots and entitlements', () => {
    const s = select();
    const result = check(input(open(rewards(), s), competition(), s));
    const r = result.nextRewards, c = result.nextCompetition;
    const t = r.tracksByCanonical[s.canonicalQuestionId], o = t.recentCompletedOpportunity!;
    const alter = (delta: object): RewardState => ({ ...r, tracksByCanonical: { [s.canonicalQuestionId]: { ...t,
      recentCompletedOpportunity: { ...o, ...delta } as RewardOpportunity } } });
    const badRewards: RewardState[] = [
      { ...r, lifetimePoints: 21 }, { ...r, entitlementIds: [] }, { ...r, entitlementIds: ['scarf-leaf', 'scarf-leaf'] },
      { ...r, questReceipts: [{ profileId: 'foreign', questId: 'Q1' }] },
      { ...r, tracksByCanonical: { [s.canonicalQuestionId]: { ...t, completedThroughOrdinal: 1 } } },
      alter({ profileId: 'foreign' }), alter({ ordinal: 99 }), alter({ answerHintUsed: true }), alter({ validChecks: 2 }),
      alter({ components: { answer: true, independentSuccess: true, supportedSuccess: true } }),
      alter({ firstSuccessWeek: undefined }), alter({ slot: 2 }), alter({ earningWeek: W2 }),
      alter({ selectionFacts: { ...s, candidate: 'none' } }),
    ];
    for (const bad of badRewards) expect(validateRewardState(frozen(bad), c, profileId, COSMETICS).length).toBeGreaterThan(0);
    const badCompetition: CompetitionState[] = [
      { ...c, currentScores: { [profileId]: 25 } }, { ...c, currentSlots: {} },
      { ...c, currentSlots: { [profileId]: [...c.currentSlots[profileId], ...c.currentSlots[profileId]] } },
    ];
    for (const bad of badCompetition) expect(validateRewardState(r, frozen(bad), profileId, COSMETICS).length).toBeGreaterThan(0);
    for (const bad of [null, {}, { ...r, tracksByCanonical: null }, { ...r, questReceipts: null }]) {
      expect(validateRewardState(bad as RewardState, c, profileId, COSMETICS).length).toBeGreaterThan(0);
    }
  });
  it('has no clock, storage, UI, network or token creation dependency', () => {
    const source = readFileSync(new URL('../../src/rewards/scoring.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/Date\.now|Math\.random|randomUUID|localStorage|indexedDB|window\.|document\.|fetch\(|from ['"].*(?:state|audio|react)/);
  });
  it('malformed nested JSON returns issues; erased slots and future history cannot pass as valid saves', () => {
    const s = select();
    const done = check(input(open(rewards(), s), competition(), s));
    const base = done.nextRewards;
    const t = base.tracksByCanonical[s.canonicalQuestionId];
    for (const corrupt of [null, false, 7, [], {}, { ...t, currentOpportunity: null },
      { ...t, recentCompletedOpportunity: { ...t.recentCompletedOpportunity, components: null } },
      { ...t, lastSuccessWeek: W3 }, { ...t, freePractice: { ...t.freePractice, latestWeek: W3 } }]) {
      const bad = { ...base, tracksByCanonical: { [s.canonicalQuestionId]: corrupt } } as RewardState;
      expect(validateRewardState(bad, done.nextCompetition, profileId, COSMETICS).length).toBeGreaterThan(0);
    }
    const missingSlot = { ...base, tracksByCanonical: { [s.canonicalQuestionId]: { ...t,
      recentCompletedOpportunity: { ...t.recentCompletedOpportunity!, slot: null } } } };
    expect(validateRewardState(missingSlot, competition(), profileId, COSMETICS)).toContainEqual({
      path: 'currentSlots', message: 'Unslotted eligible Check requires an exhausted weekly cap' });
    for (const bad of [{ ...competition(), currentSlots: { [profileId]: null } },
      { ...competition(), currentScores: { [profileId]: null } }]) {
      expect(validateRewardState(rewards(), bad as unknown as CompetitionState, profileId, COSMETICS).length).toBeGreaterThan(0);
    }
  });
  it('fresh case: opaque canonical keys and another profile’s existing scores stay independent', () => {
    const s = select('__proto__');
    const c: CompetitionState = { ...competition(), currentScores: { other: 5 }, currentSlots: { other: [{
      slot: 1, opportunityId: 'other-opportunity', canonicalQuestionId: 'other-question', points: 5 }] } };
    const result = check(input(open(rewards(), s, 'opaque|opportunity'), c, s));
    expect(result.nextRewards.lifetimePoints).toBe(20);
    expect(Object.keys(result.nextRewards.tracksByCanonical)).toEqual(['__proto__']);
    expect(result.nextCompetition.currentScores).toEqual({ other: 5, [profileId]: 20 });
    expect(result.nextCompetition.currentSlots.other).toBe(c.currentSlots.other);
    expect(result.delta.newReceiptKeys).toEqual([{ opportunityId: 'opaque|opportunity', component: 'answer' },
      { opportunityId: 'opaque|opportunity', component: 'independent-success' }]);
  });
});
