import { describe, expect, it, vi } from 'vitest';
import { addCalendarDays, CalendarError, reconcileCompetitionWeek } from '../../src/rewards/calendar';
import { buildLeaderboardReadModel, removeProfileResults, validateCompetitionState } from '../../src/rewards/standings';
import type {
  CompetitionProfile, CompetitionState, PersonalRecords, ReconcileCompetitionWeek, ReconciliationResult,
} from '../../src/rewards/contracts';

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
const records = (): PersonalRecords => ({ best: null, medals: { gold: 0, silver: 0, bronze: 0 } });
function fixture(week = '2026-10-05') {
  const profiles: readonly CompetitionProfile[] = ['p1', 'p2', 'p3', 'p4'].map((profileId, index) => ({
    profileId, nickname: ['Zoe', 'Ada', 'Milo', 'Unscored'][index], avatarId: `avatar-${index}`,
    lifetimePoints: 2000, personalRecords: records(),
  }));
  const competition: CompetitionState = {
    timezone: 'Europe/London', latestOpenedWeek: week, policyVersion: '1', archives: [],
    currentScores: { p1: 20, p2: 20, p3: 10 }, currentSlots: {
      p1: [{ slot: 1, opportunityId: 'opportunity-p1', canonicalQuestionId: 'bridge', points: 20 }],
      p2: [{ slot: 1, opportunityId: 'opportunity-p2', canonicalQuestionId: 'bridge', points: 20 }],
      p3: [{ slot: 1, opportunityId: 'opportunity-p3', canonicalQuestionId: 'bridge', points: 10 }],
    },
  };
  return { competition, profiles };
}
function applied(result: ReconciliationResult, profiles: readonly CompetitionProfile[]) {
  return { competition: result.nextCompetition,
    profiles: profiles.map(profile => ({ ...profile,
      personalRecords: result.nextPersonalRecordsByProfile[profile.profileId],
    })),
  };
}

describe('explicit-time London competition reconciliation', () => {
  it.each([
    ['2026-07-06', '2026-07-05T23:00:00Z'],
    ['2026-01-05', '2026-01-05T00:00:00Z'],
  ])('opens first run in actual London week %s without invented history', (week, instant) => {
    const input = fixture();
    const competition = { ...input.competition, latestOpenedWeek: null, currentScores: {}, currentSlots: {} };
    const outcome = reconcileCompetitionWeek({ ...input, competition }, Date.parse(instant));
    expect(outcome.nextCompetition).toStrictEqual({ ...competition, latestOpenedWeek: week });
    expect(outcome.closedWeekChanges).toEqual([]);
    expect(outcome.context).toEqual({ observedLocalDate: week, activeWeek: week, clockRollback: false });
    input.profiles.forEach(profile => expect(outcome.nextPersonalRecordsByProfile[profile.profileId]).toBe(profile.personalRecords));
  });
  it.each([
    ['2026-06-29', '2026-07-05T22:59:59.999Z', '2026-07-05T23:00:00Z', '2026-07-06'],
    ['2025-12-29', '2026-01-04T23:59:59.999Z', '2026-01-05T00:00:00Z', '2026-01-05'],
    ['2026-03-23', '2026-03-29T22:59:59.999Z', '2026-03-29T23:00:00Z', '2026-03-30'],
    ['2026-10-19', '2026-10-25T23:59:59.999Z', '2026-10-26T00:00:00Z', '2026-10-26'],
  ])('closes %s only at London Monday, including DST weeks', (week, sunday, monday, opened) => {
    const input = freeze(fixture(week));
    const before = structuredClone(input);
    const provisional = reconcileCompetitionWeek(input, Date.parse(sunday));
    expect(provisional.nextCompetition).toBe(input.competition);
    expect(provisional.closedWeekChanges).toEqual([]);
    const outcome = reconcileCompetitionWeek(input, Date.parse(monday));
    expect(outcome.context).toStrictEqual({ observedLocalDate: opened, activeWeek: opened, clockRollback: false });
    expect(outcome.nextCompetition.latestOpenedWeek).toBe(opened);
    expect(outcome.nextCompetition.currentScores).toEqual({});
    expect(outcome.nextCompetition.currentSlots).toEqual({});
    expect(outcome.closedWeekChanges).toHaveLength(1);
    expect(outcome.closedWeekChanges[0].week).toBe(week);
    expect(outcome.closedWeekChanges[0].result.entries.map(entry => [entry.points, entry.rank, entry.medal]))
      .toEqual([[20, 1, 'gold'], [20, 1, 'gold'], [10, 3, 'bronze']]);
    expect(outcome.nextPersonalRecordsByProfile.p1.medals.gold).toBe(1);
    expect(outcome.nextPersonalRecordsByProfile.p3.medals.bronze).toBe(1);
    const committed = applied(outcome, input.profiles);
    expect(validateCompetitionState(committed.competition, committed.profiles)).toEqual([]);
    const again = reconcileCompetitionWeek(freeze(committed), Date.parse(monday));
    expect(again.nextCompetition).toBe(committed.competition);
    expect(again.closedWeekChanges).toEqual([]);
    expect(again.nextPersonalRecordsByProfile).toStrictEqual(outcome.nextPersonalRecordsByProfile);
    expect(input).toStrictEqual(before);
    expect(committed.profiles.map(profile => profile.lifetimePoints)).toEqual([2000, 2000, 2000, 2000]);
  });
  it.each(['startup', 'foreground resume', 'standings entry', 'before action'])(
    'uses the same injected context for the %s adapter', () => {
      const input = fixture();
      const outcome = reconcileCompetitionWeek(input, Date.parse('2026-10-11T23:00:00Z'));
      expect(outcome.context).toEqual({ observedLocalDate: '2026-10-12', activeWeek: '2026-10-12', clockRollback: false });
      expect(outcome.closedWeekChanges).toHaveLength(1);
    });
  it('closes only the last active participating week after absence and opens the actual current week', () => {
    const input = fixture();
    const result = reconcileCompetitionWeek(input, Date.parse('2026-11-09T12:00:00Z'));
    expect(result.context.activeWeek).toBe('2026-11-09');
    expect(result.nextCompetition.archives.map(archive => archive.week)).toEqual(['2026-10-05']);
    expect(result.nextPersonalRecordsByProfile.p1.medals.gold).toBe(1);
    const committed = applied(result, input.profiles);
    const nextEmptyJump = reconcileCompetitionWeek(committed, Date.parse('2026-12-14T12:00:00Z'));
    expect(nextEmptyJump.nextCompetition.latestOpenedWeek).toBe('2026-12-14');
    expect(nextEmptyJump.nextCompetition.archives).toBe(result.nextCompetition.archives);
    expect(nextEmptyJump.closedWeekChanges).toEqual([]);
    expect(nextEmptyJump.nextPersonalRecordsByProfile.p1).toBe(result.nextPersonalRecordsByProfile.p1);
  });
  it('keeps latest active week/scores/records on rollback and prevents a second award on recovery', () => {
    const input = fixture();
    const forward = reconcileCompetitionWeek(input, Date.parse('2026-11-09T12:00:00Z'));
    const committed = freeze(applied(forward, input.profiles));
    const rollback = reconcileCompetitionWeek(committed, Date.parse('2026-10-08T12:00:00Z'));
    expect(rollback.nextCompetition).toBe(committed.competition);
    expect(rollback.context).toEqual({ observedLocalDate: '2026-10-08', activeWeek: '2026-11-09', clockRollback: true });
    expect(rollback.closedWeekChanges).toEqual([]);
    expect(rollback.nextPersonalRecordsByProfile.p1).toBe(committed.profiles[0].personalRecords);
    expect(buildLeaderboardReadModel({ ...committed, context: rollback.context }).clockNotice)
      .toContain('Scores remain in that week');
    const recovered = reconcileCompetitionWeek(committed, Date.parse('2026-11-10T12:00:00Z'));
    expect(recovered.closedWeekChanges).toEqual([]);
    expect(recovered.nextPersonalRecordsByProfile.p1.medals.gold).toBe(1);
  });
  it('reports rollback without clearing current participating scores or reserved slots', () => {
    const input = freeze(fixture('2026-10-12'));
    const result = reconcileCompetitionWeek(input, Date.parse('2026-10-04T12:00:00Z'));
    expect(result.nextCompetition).toBe(input.competition);
    expect(result.context.activeWeek).toBe('2026-10-12');
    expect(result.context.clockRollback).toBe(true);
    expect(result.nextCompetition.currentScores.p1).toBe(20);
  });
  it('supplies closed/open context for delayed success without changing an archive or allocating a new slot', () => {
    const input = fixture();
    const earningWeek = '2026-10-05';
    const firstWrongCompetition: CompetitionState = { ...input.competition,
      currentScores: { p1: 5 }, currentSlots: { p1: [{ ...input.competition.currentSlots.p1[0], points: 5 }] },
    };
    const result = reconcileCompetitionWeek({ ...input, competition: firstWrongCompetition }, Date.parse('2026-10-12T12:00:00Z'));
    expect(result.nextCompetition.archives[0].entries).toMatchObject([{ profileId: 'p1', points: 5 }]);
    expect(result.context.activeWeek).not.toBe(earningWeek);
    const committed = applied(result, input.profiles);
    const archiveBefore = structuredClone(committed.competition.archives);
    const contextOnly = reconcileCompetitionWeek(committed, Date.parse('2026-10-13T12:00:00Z'));
    expect(contextOnly.nextCompetition.currentSlots).toEqual({});
    expect(contextOnly.nextCompetition.archives).toEqual(archiveBefore);
    // WP05-02A computes the actual +5 lifetime remainder; this test exercises
    // only the old earning-week/new active-week temporal handoff.
  });
  it('retains exactly 52 participating archives after 53 closures, while best and medals remain all-time', () => {
    const initial = fixture('2025-01-06');
    let competition = { ...initial.competition, currentScores: {}, currentSlots: {} } as CompetitionState;
    let profiles = initial.profiles;
    const closedWeeks: string[] = [];
    for (let index = 0; index < 53; index++) {
      const week = competition.latestOpenedWeek!;
      const points = index === 0 ? 20 : 5;
      competition = { ...competition, currentScores: { p1: points }, currentSlots: {
        p1: [{ slot: 1, opportunityId: `opportunity-${index}`, canonicalQuestionId: 'bridge', points }],
      } };
      const nextWeek = addCalendarDays(week, 7);
      const result = reconcileCompetitionWeek(freeze({ competition, profiles }), Date.parse(`${nextWeek}T12:00:00Z`));
      closedWeeks.push(week);
      const committed = applied(result, profiles);
      competition = committed.competition;
      profiles = committed.profiles;
      expect(validateCompetitionState(competition, profiles)).toEqual([]);
    }
    expect(competition.archives).toHaveLength(52);
    expect(competition.archives.map(archive => archive.week)).toEqual(closedWeeks.slice(1));
    expect(competition.archives[0].week).toBe('2025-01-13');
    expect(competition.archives.at(-1)?.week).toBe('2026-01-05');
    expect(profiles[0].personalRecords).toEqual({
      best: { points: 20, week: '2025-01-06' }, medals: { gold: 53, silver: 0, bronze: 0 },
    });
    const again = reconcileCompetitionWeek({ competition, profiles }, Date.parse('2026-01-12T12:00:00Z'));
    expect(again.closedWeekChanges).toEqual([]);
    expect(again.nextPersonalRecordsByProfile.p1.medals.gold).toBe(53);
    expect(buildLeaderboardReadModel({ competition, profiles, context: again.context }).recentClosedResults[0].week).toBe('2026-01-05');
  });
  it('includes deletion-emptied historical weeks in the same retention window', () => {
    const input = fixture();
    const close = reconcileCompetitionWeek(input, Date.parse('2026-10-12T12:00:00Z'));
    let deleted = { competition: close.nextCompetition, personalRecordsByProfile: close.nextPersonalRecordsByProfile };
    for (const id of ['p1', 'p2', 'p3']) deleted = removeProfileResults(deleted, id);
    expect(deleted.competition.archives[0]).toMatchObject({ entries: [], omittedDeletedProfiles: true });
    const profiles = input.profiles.filter(profile => profile.profileId === 'p4');
    const next = reconcileCompetitionWeek({ competition: deleted.competition, profiles }, Date.parse('2026-11-09T12:00:00Z'));
    expect(next.nextCompetition.archives).toHaveLength(1);
    expect(validateCompetitionState(next.nextCompetition, profiles)).toEqual([]);
  });
  it('expires an omission-emptied oldest archive at the same 53rd participating boundary', () => {
    const initial = fixture('2026-01-05');
    const archives: CompetitionState['archives'] = Array.from({ length: 52 }, (_, index) => ({
      week: addCalendarDays('2025-01-06', index * 7), timezone: 'Europe/London', policyVersion: '1',
      entries: index === 0 ? [] : [{ profileId: 'p1', nickname: 'Zoe', avatarId: 'avatar-0',
        points: 5, rank: 1, medal: 'gold' }], omittedDeletedProfiles: index === 0,
    }));
    const personalRecords: PersonalRecords = {
      best: { points: 5, week: '2025-01-13' }, medals: { gold: 51, silver: 0, bronze: 0 },
    };
    const profiles = initial.profiles.map(profile => profile.profileId === 'p1' ? { ...profile, personalRecords } : profile);
    const competition: CompetitionState = { ...initial.competition, archives,
      currentScores: { p1: 10 }, currentSlots: { p1: [{ ...initial.competition.currentSlots.p1[0], points: 10 }] },
    };
    const result = reconcileCompetitionWeek(freeze({ competition, profiles }), Date.parse('2026-01-12T12:00:00Z'));
    expect(result.nextCompetition.archives).toHaveLength(52);
    expect(result.nextCompetition.archives[0].week).toBe('2025-01-13');
    expect(result.nextCompetition.archives.at(-1)?.week).toBe('2026-01-05');
    expect(result.nextPersonalRecordsByProfile.p1).toEqual({
      best: { points: 10, week: '2026-01-05' }, medals: { gold: 52, silver: 0, bronze: 0 },
    });
    const committed = applied(result, profiles);
    expect(validateCompetitionState(committed.competition, committed.profiles)).toEqual([]);
  });
  it('keeps the accepted exact function type and uses no ambient clock', () => {
    const reconcile: ReconcileCompetitionWeek = reconcileCompetitionWeek;
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => { throw new Error('Ambient clock'); });
    try { expect(reconcile(fixture(), Date.parse('2026-10-12T12:00:00Z')).context.activeWeek).toBe('2026-10-12'); }
    finally { clock.mockRestore(); }
  });
  it('preserves typed date/zone failures and rejects invalid competition before producing a new state', () => {
    expect(() => reconcileCompetitionWeek(fixture(), NaN)).toThrow(CalendarError);
    const formatter = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => { throw new RangeError('Unsupported zone'); });
    try {
      expect(() => reconcileCompetitionWeek(fixture(), 0)).toThrow(CalendarError);
    } finally { formatter.mockRestore(); }
    const input = fixture();
    expect(() => reconcileCompetitionWeek({ ...input, competition: { ...input.competition,
      latestOpenedWeek: '2026-10-06' } }, Date.parse('2026-10-12T12:00:00Z'))).toThrow(RangeError);
  });
});
