import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import {
  buildLeaderboardReadModel, closeWeek, rankPositiveScores, removeProfileResults,
  validateCompetitionState,
} from '../../src/rewards/standings';
import type { CompetitionScoreEntry } from '../../src/rewards/standings';
import type {
  ClosedWeekResult, CompetitionProfile, CompetitionState, CompetitiveSlot, PersonalRecords,
} from '../../src/rewards/contracts';

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
const emptyRecords = (): PersonalRecords => ({ best: null, medals: { gold: 0, silver: 0, bronze: 0 } });
const rows: readonly CompetitionScoreEntry[] = [
  { profileId: 'p1', nickname: 'Zoe', avatarId: 'avatar-1', points: 20 },
  { profileId: 'p2', nickname: 'Ada', avatarId: 'avatar-2', points: 20 },
  { profileId: 'p3', nickname: 'Milo', avatarId: 'avatar-3', points: 10 },
  { profileId: 'p4', nickname: 'Unscored', avatarId: 'avatar-4', points: 0 },
];
function fixture() {
  const profiles: readonly CompetitionProfile[] = rows.map(row => ({
    profileId: row.profileId, nickname: row.nickname, avatarId: row.avatarId,
    lifetimePoints: 2000, personalRecords: emptyRecords(),
  }));
  const competition: CompetitionState = {
    timezone: 'Europe/London', latestOpenedWeek: '2026-10-05', policyVersion: '1', archives: [],
    currentScores: Object.fromEntries(rows.filter(row => row.points > 0).map(row => [row.profileId, row.points])),
    currentSlots: Object.fromEntries(rows.filter(row => row.points > 0).map(row => [row.profileId, [{
      slot: 1, opportunityId: `opportunity-${row.profileId}`, canonicalQuestionId: 'lif.math.bridge.r1.total-12', points: row.points,
    }]])),
  };
  return { competition, profiles };
}
function closedFixture() {
  const original = fixture();
  const closed = closeWeek(original);
  const competition: CompetitionState = { ...original.competition,
    latestOpenedWeek: '2026-10-12', currentScores: {}, currentSlots: {}, archives: [closed.result!],
  };
  const profiles = original.profiles.map(profile => ({ ...profile,
    personalRecords: closed.nextPersonalRecordsByProfile[profile.profileId],
  }));
  return { competition, profiles, closed };
}
const codes = (competition: CompetitionState, profiles: readonly CompetitionProfile[]) =>
  validateCompetitionState(competition, profiles).map(issue => issue.code);

describe('positive competition ranks and pure closure', () => {
  it('ranks 20/20/10/0 as 1/1/3/unranked and gold/gold/bronze/none', () => {
    const frozen = freeze(structuredClone(rows));
    expect(rankPositiveScores(frozen)).toStrictEqual([
      { ...rows[1], rank: 1, medal: 'gold' },
      { ...rows[0], rank: 1, medal: 'gold' },
      { ...rows[2], rank: 3, medal: 'bronze' },
    ]);
    expect(frozen).toStrictEqual(rows);
  });
  it('uses immutable ID after equal nickname only for display, preserving score ties', () => {
    expect(rankPositiveScores([
      { ...rows[0], profileId: 'b', nickname: 'Same' },
      { ...rows[0], profileId: 'a', nickname: 'Same' },
    ]).map(row => [row.profileId, row.rank, row.medal])).toEqual([
      ['a', 1, 'gold'], ['b', 1, 'gold'],
    ]);
    expect(rankPositiveScores([])).toEqual([]);
  });
  it.each([-1, NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1])('rejects invalid score %j', points => {
    expect(() => rankPositiveScores([{ ...rows[0], points }])).toThrow(RangeError);
  });
  it('rejects duplicate identities even if one row is unscored', () => {
    expect(() => rankPositiveScores([rows[0], { ...rows[0], points: 0 }])).toThrow(RangeError);
  });
  it('projects exactly one result and per-profile records without altering lifetime points', () => {
    const input = freeze(fixture());
    const before = structuredClone(input);
    const outcome = closeWeek(input);
    expect(outcome.result).toStrictEqual({
      week: '2026-10-05', timezone: 'Europe/London', policyVersion: '1',
      entries: [{ ...rows[1], rank: 1, medal: 'gold' }, { ...rows[0], rank: 1, medal: 'gold' },
        { ...rows[2], rank: 3, medal: 'bronze' }], omittedDeletedProfiles: false,
    });
    expect(outcome.nextPersonalRecordsByProfile).toStrictEqual({
      p1: { best: { points: 20, week: '2026-10-05' }, medals: { gold: 1, silver: 0, bronze: 0 } },
      p2: { best: { points: 20, week: '2026-10-05' }, medals: { gold: 1, silver: 0, bronze: 0 } },
      p3: { best: { points: 10, week: '2026-10-05' }, medals: { gold: 0, silver: 0, bronze: 1 } },
      p4: emptyRecords(),
    });
    expect(outcome.nextPersonalRecordsByProfile.p4).toBe(input.profiles[3].personalRecords);
    expect(closeWeek(input)).toStrictEqual(outcome);
    expect(input).toStrictEqual(before);
  });
  it('keeps the original tied best week and reuses records for an unchanged nonmedallist', () => {
    const original = fixture();
    const previous: PersonalRecords = {
      best: { points: 20, week: '2026-09-21' }, medals: { gold: 2, silver: 0, bronze: 0 },
    };
    const profiles = original.profiles.map(profile => profile.profileId === 'p1' || profile.profileId === 'p4'
      ? { ...profile, personalRecords: previous } : profile);
    const competition: CompetitionState = { ...original.competition,
      currentScores: { ...original.competition.currentScores, p4: 5 },
      currentSlots: { ...original.competition.currentSlots, p4: [{
        slot: 1, opportunityId: 'opportunity-p4', canonicalQuestionId: 'task-four', points: 5,
      }] },
    };
    const outcome = closeWeek(freeze({ competition, profiles }));
    expect(outcome.nextPersonalRecordsByProfile.p1.best).toBe(previous.best);
    expect(outcome.nextPersonalRecordsByProfile.p1.medals.gold).toBe(3);
    expect(outcome.nextPersonalRecordsByProfile.p4).toBe(previous);
    expect(outcome.result?.entries.at(-1)).toMatchObject({ profileId: 'p4', rank: 4, medal: null });
  });
  it('does not manufacture an archive or change records for unopened/zero-participation weeks', () => {
    const input = fixture();
    for (const latestOpenedWeek of [null, '2026-10-05']) {
      const outcome = closeWeek({ ...input, competition: { ...input.competition,
        latestOpenedWeek, currentScores: {}, currentSlots: {},
      } });
      expect(outcome.result).toBeNull();
      input.profiles.forEach(profile => expect(outcome.nextPersonalRecordsByProfile[profile.profileId]).toBe(profile.personalRecords));
    }
  });
  it('rejects a state that attempts to close an already archived active week', () => {
    const input = closedFixture();
    expect(() => closeWeek({ ...input, competition: { ...input.competition, latestOpenedWeek: '2026-10-05' } })).toThrow(RangeError);
  });
  it('fails before overflowing a cumulative medal count', () => {
    const input = fixture();
    const profiles = input.profiles.map(profile => profile.profileId === 'p1' ? { ...profile,
      personalRecords: { best: { points: 20, week: '2026-09-21' },
        medals: { gold: Number.MAX_SAFE_INTEGER, silver: 0, bronze: 0 } },
    } : profile);
    expect(() => closeWeek({ ...input, profiles })).toThrow('safe integer range');
  });
});

describe('committed leaderboard and deletion', () => {
  it('shows actual browser-local totals, slots, provisional ranks and zero profiles', () => {
    const input = freeze(fixture());
    const model = buildLeaderboardReadModel({ ...input,
      context: { observedLocalDate: '2026-10-08', activeWeek: '2026-10-05', clockRollback: false },
    });
    expect(model.localScopeLabel).toBe('Profiles saved in this browser');
    expect(model.activeWeekLabel).toBe('2026-10-05 – 2026-10-11 (Europe/London)');
    expect(model.profiles.map(profile => [profile.profileId, profile.competitivePoints,
      profile.lifetimePoints, profile.usedSlots, profile.rank])).toEqual([
      ['p2', 20, 2000, 1, 1], ['p1', 20, 2000, 1, 1], ['p3', 10, 2000, 1, 3], ['p4', 0, 2000, 0, null],
    ]);
    expect(model.clockNotice).toBeUndefined();
    expect(model.personalRecordsByProfile.p1).toBe(input.profiles[0].personalRecords);
  });
  it('supports empty/single-profile models, thirty used slots and date-range year boundaries', () => {
    const input = fixture();
    const empty: CompetitionState = { ...input.competition, latestOpenedWeek: '2026-12-28', currentScores: {}, currentSlots: {} };
    const context = { observedLocalDate: '2027-01-01', activeWeek: '2026-12-28', clockRollback: false };
    const model = buildLeaderboardReadModel({ competition: empty, profiles: [], context });
    expect(model.profiles).toEqual([]);
    expect(model.activeWeekLabel).toBe('2026-12-28 – 2027-01-03 (Europe/London)');
    const slots: CompetitionState['currentSlots'][string] = Array.from({ length: 30 }, (_, index) => ({
      slot: (index + 1) as CompetitiveSlot, opportunityId: `opportunity-${index}`, canonicalQuestionId: `task-${index}`, points: 20,
    }));
    const single = buildLeaderboardReadModel({ competition: { ...empty, currentScores: { p1: 600 }, currentSlots: { p1: slots } },
      profiles: [input.profiles[0]], context });
    expect(single.profiles).toHaveLength(1);
    expect(single.profiles[0]).toMatchObject({ competitivePoints: 600, usedSlots: 30, rank: 1 });
  });
  it('preserves historical names after rename, newest-first history and rollback notice', () => {
    const input = closedFixture();
    const older: ClosedWeekResult = { ...input.competition.archives[0], week: '2026-09-28', entries: [], omittedDeletedProfiles: true };
    const model = buildLeaderboardReadModel({ competition: { ...input.competition, archives: [older, ...input.competition.archives] },
      profiles: input.profiles.map(profile => profile.profileId === 'p1' ? { ...profile, nickname: 'Renamed', avatarId: 'new-avatar' } : profile),
      context: { observedLocalDate: '2026-10-04', activeWeek: '2026-10-12', clockRollback: true },
    });
    expect(model.profiles.find(profile => profile.profileId === 'p1')).toMatchObject({ nickname: 'Renamed', avatarId: 'new-avatar' });
    expect(model.recentClosedResults[0].entries.find(entry => entry.profileId === 'p1')).toMatchObject({ nickname: 'Zoe', avatarId: 'avatar-1' });
    expect(model.recentClosedResults.map(result => result.week)).toEqual(['2026-10-05', '2026-09-28']);
    expect(model.clockNotice).toContain('earlier than the active London week');
  });
  it('rejects mismatched/non-Monday read-model contexts', () => {
    const input = fixture();
    for (const activeWeek of ['2026-10-06', '2026-10-12']) {
      expect(() => buildLeaderboardReadModel({ ...input,
        context: { observedLocalDate: '2026-10-08', activeWeek, clockRollback: false },
      })).toThrow(RangeError);
    }
  });
  it('deletes a joint winner without reranking, replacing medals or recomputing survivor records', () => {
    const fixtureInput = closedFixture();
    const input = freeze({ competition: { ...fixtureInput.competition,
      currentScores: { p2: 5 }, currentSlots: { p2: [{ slot: 1 as const, opportunityId: 'new-p2', canonicalQuestionId: 'new-task', points: 5 }] },
    }, personalRecordsByProfile: fixtureInput.closed.nextPersonalRecordsByProfile });
    const before = structuredClone(input);
    const deleted = removeProfileResults(input, 'p2');
    expect(deleted.competition.currentScores).toEqual({});
    expect(deleted.competition.currentSlots).toEqual({});
    expect(deleted.competition.archives[0]).toMatchObject({ omittedDeletedProfiles: true,
      entries: [{ profileId: 'p1', rank: 1, medal: 'gold' }, { profileId: 'p3', rank: 3, medal: 'bronze' }],
    });
    expect(Object.hasOwn(deleted.personalRecordsByProfile, 'p2')).toBe(false);
    expect(deleted.personalRecordsByProfile.p1).toBe(input.personalRecordsByProfile.p1);
    const survivingProfiles = fixtureInput.profiles.filter(profile => profile.profileId !== 'p2');
    expect(validateCompetitionState(deleted.competition, survivingProfiles)).toEqual([]);
    expect(removeProfileResults(deleted, 'p2')).toStrictEqual(deleted);
    expect(input).toStrictEqual(before);
  });
  it('retains emptied omission-labelled archives and leaves unaffected weeks unchanged', () => {
    const input = closedFixture();
    const onlyOne: ClosedWeekResult = { ...input.competition.archives[0], week: '2026-09-28', entries: [input.competition.archives[0].entries[0]] };
    const competition = { ...input.competition, archives: [onlyOne, ...input.competition.archives] };
    const records = input.closed.nextPersonalRecordsByProfile;
    const deleted = removeProfileResults(freeze({ competition, personalRecordsByProfile: records }), 'p2');
    expect(deleted.competition.archives[0]).toMatchObject({ week: '2026-09-28', entries: [], omittedDeletedProfiles: true });
    expect(deleted.competition.archives).toHaveLength(2);
    const absent = removeProfileResults(deleted, 'missing');
    expect(absent.competition).toBe(deleted.competition);
    expect(absent.personalRecordsByProfile).toBe(deleted.personalRecordsByProfile);
  });
  it('never obtains ambient time, network or storage in selectors and closure', () => {
    const input = fixture();
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => { throw new Error('Ambient clock'); });
    try {
      expect(closeWeek(input).result).not.toBeNull();
      expect(buildLeaderboardReadModel({ ...input,
        context: { observedLocalDate: '2026-10-08', activeWeek: '2026-10-05', clockRollback: false },
      }).profiles).toHaveLength(4);
    } finally { clock.mockRestore(); }
    const source = readFileSync(new URL('../../src/rewards/standings.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/Date\.now|indexedDB|localStorage|fetch\(|SaveDataV1|from ['"].*state\//);
  });
});

describe('competition and retained aggregate invariant issues', () => {
  it('accepts finite valid competition and record fixtures', () => {
    const open = fixture();
    const closed = closedFixture();
    expect(validateCompetitionState(open.competition, open.profiles)).toEqual([]);
    expect(validateCompetitionState(closed.competition, closed.profiles)).toEqual([]);
    const allEmpty = { ...open.competition, latestOpenedWeek: null, currentScores: {}, currentSlots: {} };
    expect(validateCompetitionState(allEmpty, [])).toEqual([]);
  });
  it.each([
    ['unknown score profile', (c: CompetitionState) => ({ ...c, currentScores: { missing: 5 } }), 'invalid-reference'],
    ['score exceeds cap', (c: CompetitionState) => ({ ...c, currentScores: { ...c.currentScores, p1: 605 } }), 'invalid-counter'],
    ['noninteger score', (c: CompetitionState) => ({ ...c, currentScores: { ...c.currentScores, p1: 5.5 } }), 'invalid-counter'],
    ['non-Monday active key', (c: CompetitionState) => ({ ...c, latestOpenedWeek: '2026-10-06' }), 'invalid-date'],
    ['wrong zone', (c: CompetitionState) => ({ ...c, timezone: 'UTC' }), 'inconsistent'],
    ['slot mismatch', (c: CompetitionState) => ({ ...c, currentSlots: { ...c.currentSlots, p1: [{ ...c.currentSlots.p1[0], points: 5 }] } }), 'inconsistent'],
    ['invalid slot points', (c: CompetitionState) => ({ ...c, currentSlots: { ...c.currentSlots, p1: [{ ...c.currentSlots.p1[0], points: 15 }] } }), 'invalid-counter'],
    ['duplicate token', (c: CompetitionState) => ({ ...c, currentSlots: { ...c.currentSlots, p2: [{ ...c.currentSlots.p2[0], opportunityId: c.currentSlots.p1[0].opportunityId }] } }), 'duplicate'],
    ['slot gap', (c: CompetitionState) => ({ ...c, currentSlots: { ...c.currentSlots, p1: [{ ...c.currentSlots.p1[0], slot: 2 }] } }), 'inconsistent'],
    ['missing slots', (c: CompetitionState) => ({ ...c, currentSlots: {} }), 'inconsistent'],
    ['unopened participating week', (c: CompetitionState) => ({ ...c, latestOpenedWeek: null }), 'inconsistent'],
  ] as const)('rejects %s', (_name, change, expectedCode) => {
    const input = fixture();
    expect(codes(change(input.competition) as CompetitionState, input.profiles)).toContain(expectedCode);
  });
  it('rejects duplicate canonical slots and slot/profile capacity overflow', () => {
    const input = fixture();
    const duplicate: CompetitionState = { ...input.competition,
      currentScores: { ...input.competition.currentScores, p1: 40 },
      currentSlots: { ...input.competition.currentSlots, p1: [input.competition.currentSlots.p1[0], {
        ...input.competition.currentSlots.p1[0], slot: 2, opportunityId: 'different-token',
      }] },
    };
    expect(codes(duplicate, input.profiles)).toContain('duplicate');
    const overflow = { ...input.competition, currentSlots: { p1: Array.from({ length: 31 }, (_, index) => ({
      slot: index + 1, opportunityId: `opportunity-${index}`, canonicalQuestionId: `task-${index}`, points: 20,
    })) } } as CompetitionState;
    expect(codes(overflow, input.profiles)).toContain('limit-exceeded');
    expect(codes(input.competition, Array.from({ length: 17 }, (_, index) => ({ ...input.profiles[0], profileId: `p${index}` }))))
      .toContain('limit-exceeded');
  });
  it.each([
    ['non-Monday archive', (a: ClosedWeekResult) => ({ ...a, week: '2026-10-06' }), 'invalid-date'],
    ['reopened archive', (a: ClosedWeekResult) => ({ ...a, week: '2026-10-12' }), 'inconsistent'],
    ['rank tie broken', (a: ClosedWeekResult) => ({ ...a, entries: a.entries.map((e, i) => i === 1 ? { ...e, rank: 2, medal: 'silver' } : e) }), 'inconsistent'],
    ['medal mismatch', (a: ClosedWeekResult) => ({ ...a, entries: [{ ...a.entries[0], medal: 'silver' }, ...a.entries.slice(1)] }), 'inconsistent'],
    ['zero archive entry', (a: ClosedWeekResult) => ({ ...a, entries: [{ ...a.entries[0], points: 0 }, ...a.entries.slice(1)] }), 'invalid-counter'],
    ['duplicate archived profile', (a: ClosedWeekResult) => ({ ...a, entries: [a.entries[0], a.entries[0]] }), 'duplicate'],
    ['unknown archived profile', (a: ClosedWeekResult) => ({ ...a, entries: [{ ...a.entries[0], profileId: 'missing' }, ...a.entries.slice(1)] }), 'invalid-reference'],
    ['empty unmarked week', (a: ClosedWeekResult) => ({ ...a, entries: [] }), 'inconsistent'],
    ['rank above original capacity', (a: ClosedWeekResult) => ({ ...a, entries: [{ ...a.entries[0], rank: 17, medal: null }] }), 'invalid-counter'],
  ] as const)('rejects %s', (_name, change, expectedCode) => {
    const input = closedFixture();
    expect(codes({ ...input.competition, archives: [change(input.competition.archives[0]) as ClosedWeekResult] }, input.profiles))
      .toContain(expectedCode);
  });
  it('rejects duplicate/out-of-order archives and retention overflow', () => {
    const input = closedFixture();
    const archive = input.competition.archives[0];
    expect(codes({ ...input.competition, archives: [archive, archive] }, input.profiles)).toContain('inconsistent');
    expect(codes({ ...input.competition, archives: [archive, { ...archive, week: '2026-09-28' }] }, input.profiles))
      .toContain('inconsistent');
    expect(codes({ ...input.competition, archives: Array.from({ length: 53 }, () => archive) }, input.profiles))
      .toContain('limit-exceeded');
  });
  it('accepts original gaps after omission, while rejecting impossible tie-group gaps', () => {
    const input = closedFixture();
    const archive = input.competition.archives[0];
    const gap: ClosedWeekResult = { ...archive, entries: [archive.entries[1], archive.entries[2]], omittedDeletedProfiles: true };
    const surviving = input.profiles.filter(profile => profile.profileId !== 'p2');
    expect(validateCompetitionState({ ...input.competition, archives: [gap] }, surviving)).toEqual([]);
    const impossible: ClosedWeekResult = { ...archive, omittedDeletedProfiles: true,
      entries: [{ ...archive.entries[0], rank: 2, medal: 'silver' },
        { ...archive.entries[1], rank: 2, medal: 'silver' }, archive.entries[2]],
    };
    expect(codes({ ...input.competition, archives: [impossible] }, input.profiles)).toContain('inconsistent');
    const tooManyOriginalTies: ClosedWeekResult = { ...archive, omittedDeletedProfiles: true,
      entries: [{ ...archive.entries[0], rank: 16, medal: null }, { ...archive.entries[1], rank: 16, medal: null }],
    };
    expect(codes({ ...input.competition, archives: [tooManyOriginalTies] }, input.profiles)).toContain('limit-exceeded');
  });
  it('F1 rejects an omitted 600-point rank-2 result without changing historical facts', () => {
    const competition: CompetitionState = {
      timezone: 'Europe/London', policyVersion: '1', latestOpenedWeek: '2026-10-12',
      currentScores: {}, currentSlots: {}, archives: [{
        week: '2026-10-05', timezone: 'Europe/London', policyVersion: '1', omittedDeletedProfiles: true,
        entries: [{ profileId: 'p1', nickname: 'Ada', avatarId: 'avatar-1', points: 600, rank: 2, medal: 'silver' }],
      }],
    };
    const profiles: readonly CompetitionProfile[] = [{
      profileId: 'p1', nickname: 'Ada', avatarId: 'avatar-1', lifetimePoints: 2000,
      personalRecords: { best: { points: 600, week: '2026-10-05' }, medals: { gold: 0, silver: 1, bronze: 0 } },
    }];
    const before = structuredClone({ competition, profiles });
    freeze({ competition, profiles });
    expect(validateCompetitionState(competition, profiles)).toContainEqual({
      path: 'competition.archives[0].entries[0].rank', code: 'inconsistent',
      message: 'A maximum-score participant must retain rank 1, including after deletion',
    });
    expect({ competition, profiles }).toStrictEqual(before);
  });
  it('F1 controls accept deleted maximum-score ties and possible higher deleted winners', () => {
    for (const [points, rank, medal] of [[600, 1, 'gold'], [595, 2, 'silver']] as const) {
      const competition: CompetitionState = {
        timezone: 'Europe/London', policyVersion: '1', latestOpenedWeek: '2026-10-12',
        currentScores: {}, currentSlots: {}, archives: [{
          week: '2026-10-05', timezone: 'Europe/London', policyVersion: '1', omittedDeletedProfiles: true,
          entries: [{ profileId: 'p1', nickname: 'Ada', avatarId: 'avatar-1', points, rank, medal }],
        }],
      };
      const profiles: readonly CompetitionProfile[] = [{
        profileId: 'p1', nickname: 'Ada', avatarId: 'avatar-1', lifetimePoints: 2000,
        personalRecords: { best: { points, week: '2026-10-05' },
          medals: { gold: medal === 'gold' ? 1 : 0, silver: medal === 'silver' ? 1 : 0, bronze: 0 } },
      }];
      expect(validateCompetitionState(competition, profiles)).toEqual([]);
    }
  });
  it('F2 rejects a missing best week inside retained dates but accepts an older expired best', () => {
    const competition: CompetitionState = {
      timezone: 'Europe/London', policyVersion: '1', latestOpenedWeek: '2026-10-12',
      currentScores: {}, currentSlots: {}, archives: ['2026-09-21', '2026-10-05'].map(week => ({
        week, timezone: 'Europe/London', policyVersion: '1', omittedDeletedProfiles: false,
        entries: [{ profileId: 'p1', nickname: 'Ada', avatarId: 'avatar-1', points: 5, rank: 1, medal: 'gold' }],
      })),
    };
    const profiles: readonly CompetitionProfile[] = [{
      profileId: 'p1', nickname: 'Ada', avatarId: 'avatar-1', lifetimePoints: 2000,
      personalRecords: { best: { points: 20, week: '2026-09-28' }, medals: { gold: 3, silver: 0, bronze: 0 } },
    }];
    const before = structuredClone({ competition, profiles });
    freeze({ competition, profiles });
    expect(validateCompetitionState(competition, profiles)).toContainEqual({
      path: 'profiles.p1.personalRecords.best', code: 'inconsistent',
      message: 'Best inside the retained date window must contain the matching original result',
    });
    const expiredProfiles = profiles.map(profile => ({ ...profile, personalRecords: {
      ...profile.personalRecords, best: { points: 20, week: '2026-09-14' },
    } }));
    expect(validateCompetitionState(competition, expiredProfiles)).toEqual([]);
    const laterMissingProfiles = profiles.map(profile => ({ ...profile, personalRecords: {
      ...profile.personalRecords, best: { points: 20, week: '2026-10-12' },
    } }));
    expect(validateCompetitionState({ ...competition, latestOpenedWeek: '2026-10-19' }, laterMissingProfiles))
      .toContainEqual({ path: 'profiles.p1.personalRecords.best', code: 'inconsistent',
        message: 'Best inside the retained date window must contain the matching original result' });
    expect({ competition, profiles }).toStrictEqual(before);
  });
  it('validates available best/medal/lifetime provenance without requiring discarded weeks', () => {
    const input = closedFixture();
    const modify = (personalRecords: PersonalRecords, lifetimePoints = 2000) => input.profiles.map(profile =>
      profile.profileId === 'p1' ? { ...profile, personalRecords, lifetimePoints } : profile);
    const validOld: PersonalRecords = { best: { points: 100, week: '2025-01-06' }, medals: { gold: 30, silver: 20, bronze: 10 } };
    expect(validateCompetitionState(input.competition, modify(validOld))).toEqual([]);
    expect(codes(input.competition, modify({ ...validOld, best: null }))).toContain('inconsistent');
    expect(codes(input.competition, modify({ ...validOld, best: { points: 10, week: '2025-01-06' } }))).toContain('inconsistent');
    expect(codes(input.competition, modify({ ...validOld, best: { points: 20, week: '2026-10-12' } }))).toContain('inconsistent');
    expect(codes(input.competition, modify({ ...validOld, best: { points: 25, week: '2026-10-05' } }))).toContain('inconsistent');
    expect(codes(input.competition, modify({ ...validOld, medals: { gold: 0, silver: 0, bronze: 0 } }))).toContain('inconsistent');
    expect(codes(input.competition, modify({ ...validOld, medals: { gold: -1, silver: 0, bronze: 0 } }))).toContain('invalid-counter');
    expect(codes(input.competition, modify(input.profiles[0].personalRecords, 10))).toContain('inconsistent');
    const earlierEqual = { ...input.competition, archives: [{ ...input.competition.archives[0], week: '2026-09-28' }] };
    expect(codes(earlierEqual, input.profiles)).toContain('inconsistent');
  });
  it('reports malformed shapes as issues instead of throwing during decoder checks', () => {
    const input = fixture();
    for (const competition of [null, { ...input.competition, currentScores: [] }, { ...input.competition, archives: null },
      { ...input.competition, currentSlots: { p1: null } }, { ...input.competition, archives: [null] },
      { ...input.competition, currentSlots: { p1: [null] } }]) {
      expect(codes(competition as unknown as CompetitionState, input.profiles)).toContain('invalid-shape');
    }
    expect(codes(input.competition, [null] as unknown as CompetitionProfile[])).toContain('invalid-shape');
    expect(codes(input.competition, input.profiles.map(profile => ({ ...profile, personalRecords: null })) as unknown as CompetitionProfile[]))
      .toContain('invalid-shape');
  });
});
