import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { addCalendarDays, CalendarError, localDateAt, weekKeyFor } from '../../src/rewards/calendar';
import type {
  CalendarContext, CanonicalRewardTrack, ClosedWeekResult, CompetitionClock,
  CompetitionProfile, CompetitionState, EligibilityResult, LeaderboardReadModel,
  PersonalRecords, ReconcileCompetitionWeek, ReconciliationInput, ReconciliationResult,
  RewardCheckInput, RewardCheckResult, RewardComponents, RewardOpportunity, RewardReceipt,
  RewardSelectionFacts, RewardState, ScoreDelta,
} from '../../src/rewards/contracts';
import type { EvaluationResult, LearningAssistance, SelectionResult } from '../../src/learning/contracts';

const instants = [
  ['2026-07-05T22:59:59.999Z', '2026-07-05', '2026-06-29'],
  ['2026-07-05T23:00:00.000Z', '2026-07-06', '2026-07-06'],
  ['2026-01-04T23:59:59.999Z', '2026-01-04', '2025-12-29'],
  ['2026-01-05T00:00:00.000Z', '2026-01-05', '2026-01-05'],
  ['2026-03-29T00:59:59.999Z', '2026-03-29', '2026-03-23'],
  ['2026-03-29T01:00:00.000Z', '2026-03-29', '2026-03-23'],
  ['2026-03-29T23:00:00.000Z', '2026-03-30', '2026-03-30'],
  ['2026-10-25T00:59:59.999Z', '2026-10-25', '2026-10-19'],
  ['2026-10-25T01:00:00.000Z', '2026-10-25', '2026-10-19'],
  ['2026-10-25T23:59:59.999Z', '2026-10-25', '2026-10-19'],
  ['2026-10-26T00:00:00.000Z', '2026-10-26', '2026-10-26'],
] as const;

function expectCalendarError(action: () => unknown, code: CalendarError['code']) {
  expect(action).toThrow(CalendarError);
  try { action(); } catch (error) {
    expect(error).toMatchObject({ name: 'CalendarError', code });
  }
}

describe('validated Europe/London date-only calendar', () => {
  it.each(instants)('maps %s to London %s / Monday %s', (instant, date, week) => {
    expect(localDateAt(Date.parse(instant))).toBe(date);
    expect(weekKeyFor(date)).toBe(week);
  });

  it('produces identical London results in two distinct process host timezones', () => {
    const moduleUrl = new URL('../../src/rewards/calendar.ts', import.meta.url).href;
    const standingsUrl = new URL('../../src/rewards/standings.ts', import.meta.url).href;
    const script = `
      import { registerHooks } from 'node:module';
      // Bundler source imports are extensionless; this test-only Node hook
      // resolves the two reward modules while preserving real host TZ behavior.
      registerHooks({ resolve(specifier, context, nextResolve) {
        if ([${JSON.stringify(moduleUrl)}, ${JSON.stringify(standingsUrl)}].includes(context.parentURL)
          && ['./calendar', './standings'].includes(specifier)) {
          return nextResolve(new URL(specifier + '.ts', context.parentURL).href, context);
        }
        return nextResolve(specifier, context);
      }});
      const { localDateAt, weekKeyFor, addCalendarDays } = await import(${JSON.stringify(moduleUrl)});
      const instants = ${JSON.stringify(instants)};
      console.log(JSON.stringify({
        hostOffset: new Date(instants[0][0]).getTimezoneOffset(),
        dates: instants.map(([instant]) => {
          const date = localDateAt(Date.parse(instant));
          return [date, weekKeyFor(date)];
        }),
        adds: [addCalendarDays('2026-03-27', 3), addCalendarDays('2026-10-23', 7)],
      }));
    `;
    const run = (timezone: string): { hostOffset: number; dates: string[][]; adds: string[] } =>
      JSON.parse(execFileSync(process.execPath,
        ['--experimental-strip-types', '--input-type=module', '--eval', script],
        { encoding: 'utf8', env: { ...process.env, TZ: timezone } }));
    const west = run('America/Los_Angeles');
    const east = run('Asia/Tokyo');
    expect(west.hostOffset).toBe(420);
    expect(east.hostOffset).toBe(-540);
    expect(west.dates).toEqual(instants.map(([, date, week]) => [date, week]));
    expect(east.dates).toEqual(west.dates);
    expect(east.adds).toEqual(west.adds);
    expect(west.adds).toEqual(['2026-03-30', '2026-10-30']);
  });

  it.each([
    ['2026-03-27', 3, '2026-03-30'], ['2026-03-27', 7, '2026-04-03'],
    ['2026-10-23', 3, '2026-10-26'], ['2026-10-23', 7, '2026-10-30'],
    ['2026-03-30', -3, '2026-03-27'], ['2026-10-30', -7, '2026-10-23'],
    ['2024-02-28', 1, '2024-02-29'], ['2024-02-29', 1, '2024-03-01'],
    ['2000-02-28', 1, '2000-02-29'], ['1900-02-28', 1, '1900-03-01'],
    ['2026-04-30', 1, '2026-05-01'], ['2026-12-31', 1, '2027-01-01'],
    ['2027-01-01', -1, '2026-12-31'], ['0099-12-31', 1, '0100-01-01'],
    ['0001-01-01', 0, '0001-01-01'], ['9999-12-31', 0, '9999-12-31'],
  ] as const)('adds %s + %s civil days = %s', (date, days, expected) => {
    expect(addCalendarDays(date, days)).toBe(expected);
  });

  it.each([
    ['2027-01-01', '2026-12-28'], ['2024-02-29', '2024-02-26'],
    ['2026-10-05', '2026-10-05'], ['0001-01-01', '0001-01-01'],
    ['0099-01-01', '0098-12-29'],
  ] as const)('finds Monday for %s = %s', (date, expected) => {
    expect(weekKeyFor(date)).toBe(expected);
  });

  it.each([
    '', '2026-2-03', '26-02-03', '2026-02-30', '2025-02-29', '1900-02-29',
    '2026-04-31', '2026-00-10', '2026-13-10', '2026-01-00', '2026-01-32',
    '0000-01-01', '10000-01-01', '2026-10-08T00:00:00Z', ' 2026-10-08',
    '2026-10-08\n', '２０２６-１０-０８', null, undefined, 20261008,
  ])('rejects invalid date %j without rollover or fallback', value => {
    expectCalendarError(() => weekKeyFor(value as string), 'invalid-date');
    expectCalendarError(() => addCalendarDays(value as string, 3), 'invalid-date');
  });

  it.each([NaN, Infinity, -Infinity, 8.64e15 + 1, -8.64e15 - 1,
    Date.parse('0000-07-01T12:00:00Z'), Date.parse('+010000-01-01T00:00:00Z'),
    '2026-10-08', null, undefined])('rejects unsupported epoch %j', value => {
    expectCalendarError(() => localDateAt(value as number), 'invalid-date');
  });
  it('handles early AD years without the 1900 constructor shortcut', () => {
    expect(localDateAt(Date.parse('0099-07-01T12:00:00Z'))).toBe('0099-07-01');
  });
  it.each([NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1, '3', null, undefined])(
    'rejects non-safe-integer day offset %j', value => {
      expectCalendarError(() => addCalendarDays('2026-10-08', value as number), 'invalid-date');
    });
  it.each([['0001-01-01', -1], ['9999-12-31', 1], ['2026-10-08', Number.MAX_SAFE_INTEGER]] as const)(
    'rejects out-of-range addition from %s + %s', (date, days) => {
      expectCalendarError(() => addCalendarDays(date, days), 'invalid-date');
    });

  it('requests explicit London / Gregorian / Latin numeric parts', () => {
    const formatter = vi.spyOn(Intl, 'DateTimeFormat');
    try {
      localDateAt(Date.parse('2026-10-08T12:00:00Z'));
      expect(formatter).toHaveBeenCalledWith('en-GB', {
        timeZone: 'Europe/London', calendar: 'gregory', numberingSystem: 'latn',
        year: 'numeric', month: '2-digit', day: '2-digit', era: 'short',
      });
    } finally { formatter.mockRestore(); }
  });
  it('reports unsupported explicit zone instead of substituting the host zone', () => {
    const formatter = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
      throw new RangeError('Explicit zone unsupported');
    });
    try {
      expectCalendarError(() => localDateAt(0), 'unsupported-zone');
    } finally { formatter.mockRestore(); }
  });
  it('rejects an Intl implementation silently substituting another zone', () => {
    const resolved = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', calendar: 'gregory', numberingSystem: 'latn',
    }).resolvedOptions();
    const spy = vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({ ...resolved, timeZone: 'UTC' });
    try {
      expectCalendarError(() => localDateAt(0), 'unsupported-zone');
    } finally { spy.mockRestore(); }
  });
  it('reports unavailable numeric date-part extraction as a typed failure', () => {
    const spy = vi.spyOn(Intl.DateTimeFormat.prototype, 'formatToParts')
      .mockImplementation(() => { throw new TypeError('Numeric date parts unavailable'); });
    try {
      expectCalendarError(() => localDateAt(0), 'unsupported-zone');
    } finally { spy.mockRestore(); }
  });
  it('accepts a caller-injected clock without reading ambient time', () => {
    const clock: CompetitionClock = { nowEpochMs: () => Date.parse('2026-07-05T23:00:00Z') };
    const spy = vi.spyOn(Date, 'now').mockImplementation(() => { throw new Error('Ambient clock'); });
    try { expect(localDateAt(clock.nowEpochMs())).toBe('2026-07-06'); }
    finally { spy.mockRestore(); }
  });
});

// Construction fixtures, not a scoring/closure implementation or state validator.
const learningSelection: Extract<SelectionResult, { status: 'selected' }> = {
  status: 'selected', canonicalQuestionId: 'lif.math.bridge.r1.total-12', band: 'support',
  reason: 'story-anchor', bindingProvenance: null, familiar: false, reviewReference: null,
  resumeEncounterId: null, rewardCandidate: 'first-encounter', unavailableSuggestion: null,
};
const selection: RewardSelectionFacts = {
  profileId: 'profile-1', canonicalQuestionId: learningSelection.canonicalQuestionId,
  encounterId: 'encounter-1', selectionReason: 'story',
  candidate: learningSelection.rewardCandidate, band: learningSelection.band,
};
const preCheck: RewardOpportunity = {
  opportunityId: 'opportunity-1', profileId: selection.profileId,
  canonicalQuestionId: selection.canonicalQuestionId, ordinal: 1, selectionFacts: selection,
  earningWeek: null, slot: null, validChecks: 0, answerHintUsed: true,
  components: { answer: false, independentSuccess: false, supportedSuccess: false },
};
const unfinished: RewardOpportunity = {
  ...preCheck, earningWeek: '2026-10-05', slot: 1, validChecks: 1,
  components: { answer: true, independentSuccess: false, supportedSuccess: false },
};
const track: CanonicalRewardTrack = {
  lastAllocatedOrdinal: 1, completedThroughOrdinal: 0, closedAwardTotal: 0,
  freePractice: { validChecks: 0, answerHintUsed: false }, currentOpportunity: unfinished,
};
const rewards: RewardState = {
  lifetimePoints: 25, tracksByCanonical: { [selection.canonicalQuestionId]: track },
  questReceipts: [{ profileId: selection.profileId, questId: 'Q1' }], entitlementIds: ['leaf-scarf-pattern'],
};
const competition: CompetitionState = {
  timezone: 'Europe/London', latestOpenedWeek: '2026-10-05',
  currentScores: { 'profile-1': 5 }, currentSlots: { 'profile-1': [{
    slot: 1, opportunityId: unfinished.opportunityId,
    canonicalQuestionId: unfinished.canonicalQuestionId, points: 5,
  }] }, archives: [], policyVersion: '1',
};
const records: PersonalRecords = { best: null, medals: { gold: 0, silver: 0, bronze: 0 } };
const profiles: readonly CompetitionProfile[] = [{
  profileId: 'profile-1', nickname: 'Rowan', avatarId: 'avatar-1',
  lifetimePoints: rewards.lifetimePoints, personalRecords: records,
}];
const context: CalendarContext = {
  observedLocalDate: '2026-10-12', activeWeek: '2026-10-12', clockRollback: false,
};
const closed: ClosedWeekResult = {
  week: '2026-10-05', timezone: 'Europe/London', policyVersion: '1',
  entries: [{ profileId: 'profile-1', nickname: 'Rowan', avatarId: 'avatar-1', points: 5,
    rank: 1, medal: 'gold' }], omittedDeletedProfiles: false,
};
const nextRecords: PersonalRecords = {
  best: { points: 5, week: closed.week }, medals: { gold: 1, silver: 0, bronze: 0 },
};
const reconciliationInput: ReconciliationInput = { competition, profiles };
const reconciliationResult: ReconciliationResult = {
  nextCompetition: { ...competition, latestOpenedWeek: context.activeWeek,
    currentScores: {}, currentSlots: {}, archives: [closed] },
  nextPersonalRecordsByProfile: { 'profile-1': nextRecords }, context,
  closedWeekChanges: [{ week: closed.week, result: closed }],
};
const evaluation: Extract<EvaluationResult, { status: 'judged' }> = {
  status: 'judged', correct: true, canonicalQuestionId: selection.canonicalQuestionId,
  skillId: 'M01', objectiveId: 'M01-addition-subtraction', band: 'support',
  feedback: { explanation: 'The planks total 12 metres.', issues: [] },
};
const assistance: LearningAssistance = {
  answerHintUsed: true, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent',
};
const check: RewardCheckInput = {
  profileId: selection.profileId, encounterId: selection.encounterId,
  opportunityId: unfinished.opportunityId, submissionId: 'submission-2', checkSequence: 2,
  validChecks: 1, track, rewards, evaluation, assistance, selection,
  competition: reconciliationResult.nextCompetition, context,
};
const delta: ScoreDelta = {
  lifetimeDelta: 5, competitiveDelta: 0, consumedSlot: null,
  newReceiptKeys: [{ opportunityId: unfinished.opportunityId, component: 'supported-success' }],
  newEntitlementIds: [],
};
const completed: RewardOpportunity = {
  ...unfinished, validChecks: 2, firstSuccessWeek: context.activeWeek,
  firstSuccessLocalDate: context.observedLocalDate,
  components: { answer: true, independentSuccess: false, supportedSuccess: true },
};
const { currentOpportunity: _unfinishedOpportunity, ...completedTrack } = track;
const checkResult: RewardCheckResult = {
  nextRewards: { ...rewards, lifetimePoints: 30, tracksByCanonical: {
    [selection.canonicalQuestionId]: { ...completedTrack,
      recentCompletedOpportunity: completed, lastSuccessWeek: context.activeWeek,
      lastSuccessLocalDate: context.observedLocalDate },
  } }, nextCompetition: reconciliationResult.nextCompetition, delta,
};
const model: LeaderboardReadModel = {
  localScopeLabel: 'This browser', activeWeek: context.activeWeek,
  activeWeekLabel: '12–18 October 2026', timezone: 'Europe/London',
  profiles: [{ profileId: 'profile-1', nickname: 'Rowan', avatarId: 'avatar-1',
    competitivePoints: 0, lifetimePoints: 30, usedSlots: 0, rank: null }],
  recentClosedResults: [closed], personalRecordsByProfile: { 'profile-1': nextRecords },
};
const classifications: readonly EligibilityResult[] = [
  { kind: 'eligible-first', reason: 'first-encounter' },
  { kind: 'eligible-review', reason: 'selected-due-review' },
  { kind: 'resume-existing', reason: 'unfinished-opportunity' },
  ...(['same-week-used', 'child-practice', 'not-due', 'unfinished-free-practice', 'familiar-repeat'] as const)
    .map(reason => ({ kind: 'practice-only' as const, reason })),
];

describe('pure reward producer contract fixtures', () => {
  it('preserves the exact eligibility classifications and rejects mismatched tags at typecheck', () => {
    expect(classifications).toHaveLength(8);
    // @ts-expect-error eligible-review cannot use the first-encounter reason
    const mismatched: EligibilityResult = { kind: 'eligible-review', reason: 'first-encounter' };
    expect(mismatched).toBeDefined();
  });
  it('pins component amounts and disallows two simultaneous success awards at typecheck', () => {
    const receipts: readonly RewardReceipt[] = [
      { key: { opportunityId: 'opportunity-1', component: 'answer' }, amount: 5 },
      { key: { opportunityId: 'opportunity-1', component: 'independent-success' }, amount: 15 },
      { key: { opportunityId: 'opportunity-1', component: 'supported-success' }, amount: 5 },
      { key: { profileId: 'profile-1', questId: 'Q1' }, amount: 20 },
    ];
    expect(receipts.map(receipt => receipt.amount)).toEqual([5, 15, 5, 20]);
    // @ts-expect-error an independent-success receipt is exactly 15 points
    const wrongAmount: RewardReceipt = { key: { opportunityId: 'opportunity-1', component: 'independent-success' }, amount: 5 };
    // @ts-expect-error independent and supported success are mutually exclusive
    const bothSuccesses: RewardComponents = { answer: true, independentSuccess: true, supportedSuccess: true };
    expect([wrongAmount, bothSuccesses]).toHaveLength(2);
  });
  it('expresses pre-Check help, bound attempts, same canonical later-review and compaction independently', () => {
    const practiceTrack: CanonicalRewardTrack = {
      lastAllocatedOrdinal: 0, completedThroughOrdinal: 0, closedAwardTotal: 0,
      freePractice: { latestWeek: '2026-10-05', validChecks: 2, answerHintUsed: true,
        unfinishedEncounterId: 'practice-encounter-1' },
    };
    const review: RewardSelectionFacts = { ...selection, encounterId: 'encounter-2',
      selectionReason: 'due-review', candidate: 'later-week-due-review',
      dueLocalDate: '2026-10-15', previousSuccessWeek: '2026-10-12' };
    const compacted: CanonicalRewardTrack = {
      lastAllocatedOrdinal: 2, completedThroughOrdinal: 1, closedAwardTotal: 10,
      lastSuccessWeek: '2026-10-12', lastSuccessLocalDate: '2026-10-12',
      freePractice: { validChecks: 0, answerHintUsed: false },
      currentOpportunity: { ...preCheck, opportunityId: 'opportunity-2', ordinal: 2,
        selectionFacts: review, answerHintUsed: false },
    };
    expect(preCheck).toMatchObject({ earningWeek: null, slot: null, answerHintUsed: true });
    expect(unfinished).toMatchObject({ earningWeek: '2026-10-05', validChecks: 1 });
    expect(review.canonicalQuestionId).toBe(selection.canonicalQuestionId);
    expect(compacted.currentOpportunity?.ordinal).toBeGreaterThan(compacted.completedThroughOrdinal);
    expect(practiceTrack.freePractice).toMatchObject({ validChecks: 2, answerHintUsed: true });
    expect(practiceTrack.currentOpportunity).toBeUndefined();
    expect(check.submissionId).not.toBe(check.opportunityId);
    expect(check.encounterId).not.toBe(check.opportunityId);
    // @ts-expect-error only slots 1 through 30 are permitted
    const invalidSlot: RewardOpportunity = { ...preCheck, slot: 31 };
    expect(invalidSlot.slot).toBe(31);
  });
  it('typechecks the reserved reconciliation port including mandatory per-profile records', () => {
    const firstRun: CompetitionState = {
      ...competition, latestOpenedWeek: null, currentScores: {}, currentSlots: {}, archives: [],
    };
    expect(firstRun.latestOpenedWeek).toBeNull();
    // A local fixture function proves assignability, not an exported closure stub.
    const fixturePort: ReconcileCompetitionWeek =
      (input: ReconciliationInput, nowEpochMs: number): ReconciliationResult => {
        expect(input).toBe(reconciliationInput);
        expect(localDateAt(nowEpochMs)).toBe(reconciliationResult.context.observedLocalDate);
        return reconciliationResult;
      };
    expect(fixturePort(reconciliationInput, Date.parse('2026-10-12T12:00:00Z')))
      .toHaveProperty('nextPersonalRecordsByProfile.profile-1', nextRecords);
    // @ts-expect-error DEC-030 requires personal records alongside competition
    const missingRecords: ReconciliationResult = { nextCompetition: competition, context, closedWeekChanges: [] };
    expect(missingRecords).toBeDefined();
  });
  it('expresses late lifetime-only success, rollback and deletion-preserved historical ranks', () => {
    expect(checkResult.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 0, consumedSlot: null });
    expect(checkResult.nextCompetition.archives[0]).toEqual(closed);
    expect(completed.earningWeek).toBe('2026-10-05');
    expect(completed.firstSuccessWeek).toBe('2026-10-12');
    const rollback: CalendarContext = { ...context, observedLocalDate: '2026-10-04', clockRollback: true };
    const omitted: ClosedWeekResult = { ...closed, entries: [{ ...closed.entries[0], rank: 3,
      medal: 'bronze' }], omittedDeletedProfiles: true };
    expect(rollback.activeWeek).toBe(context.activeWeek);
    expect(omitted.entries[0].rank).toBe(3);
  });
  it('round-trips JSON fixtures and keeps each profile record independent of retained archives', () => {
    const twoProfiles: LeaderboardReadModel = { ...model, recentClosedResults: [],
      personalRecordsByProfile: { ...model.personalRecordsByProfile,
        'profile-2': { best: { points: 20, week: '2026-01-05' }, medals: { gold: 2, silver: 1, bronze: 0 } } },
    };
    for (const fixture of [selection, preCheck, unfinished, track, rewards, reconciliationInput,
      reconciliationResult, check, checkResult, twoProfiles, classifications]) {
      expect(JSON.parse(JSON.stringify(fixture))).toStrictEqual(fixture);
    }
    expect(twoProfiles.personalRecordsByProfile['profile-1'].medals.gold).toBe(1);
    expect(twoProfiles.personalRecordsByProfile['profile-2'].medals.gold).toBe(2);
  });
  it('keeps contracts upstream-only and appended calendar policy within the reward domain', () => {
    const source = readFileSync(new URL('../../src/rewards/contracts.ts', import.meta.url), 'utf8');
    expect(source.match(/from\s+['"]([^'"]+)['"]/g)).toEqual(["from '../learning/contracts'"]);
    expect(source.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(
      /export\s+(?:async\s+)?function|Date\.now|window\.|document\.|fetch\(/);
    const calendar = readFileSync(new URL('../../src/rewards/calendar.ts', import.meta.url), 'utf8');
    expect(calendar.match(/from\s+['"]([^'"]+)['"]/g)).toEqual([
      "from './contracts'", "from './contracts'", "from './standings'",
    ]);
    expect(calendar.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(
      /Date\.now|window\.|document\.|fetch\(|SaveDataV1|controller/);
  });
});
