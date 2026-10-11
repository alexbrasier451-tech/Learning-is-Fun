import type { ClosedWeekResult } from '../../src/rewards/contracts';
/** Exact supplied WP05-04A Hall fixture facts; no ranking/date oracle. */
const tieArchive = {
  week: '2026-09-28', timezone: 'Europe/London', policyVersion: 'local-v1', omittedDeletedProfiles: false,
  entries: [
    { profileId: 'a', nickname: 'Mira before rename', avatarId: 'iona', points: 20, rank: 1, medal: 'gold' },
    { profileId: 'b', nickname: 'Ben', avatarId: 'rowan', points: 20, rank: 1, medal: 'gold' },
    { profileId: 'c', nickname: 'Cleo', avatarId: 'flower', points: 10, rank: 3, medal: 'bronze' },
  ],
} as const satisfies ClosedWeekResult;
export const FESTIVAL_FIXTURES: Readonly<Record<'empty' | 'ties' | 'omitted' | 'deleted', ClosedWeekResult | null>> = {
  empty: null, ties: tieArchive,
  omitted: { ...tieArchive, entries: [tieArchive.entries[2]], omittedDeletedProfiles: true },
  deleted: { ...tieArchive, entries: [], omittedDeletedProfiles: true },
};
