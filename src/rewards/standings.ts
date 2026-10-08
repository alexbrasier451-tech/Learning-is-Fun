import { addCalendarDays, weekKeyFor } from './calendar';
import type {
  CalendarContext, ClosedWeekResult, CompetitionProfile, CompetitionState,
  LeaderboardReadModel, Medal, PersonalRecords, ProfileId, ReconciliationInput,
} from './contracts';

export type CompetitionScoreEntry = Readonly<{
  profileId: ProfileId; nickname: string; avatarId: string; points: number;
}>;
export type CloseWeekResult = Readonly<{
  result: ClosedWeekResult | null;
  nextPersonalRecordsByProfile: Readonly<Record<ProfileId, PersonalRecords>>;
}>;
export type CompetitionValidationIssue = Readonly<{
  path: string;
  code: 'invalid-shape' | 'invalid-date' | 'invalid-counter' | 'invalid-reference'
    | 'duplicate' | 'inconsistent' | 'limit-exceeded';
  message: string;
}>;

const integer = (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const text = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const monday = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  try { return weekKeyFor(value) === value; } catch { return false; }
};
const medalFor = (rank: number): Medal | null =>
  rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : null;
const byIdentity = (a: CompetitionScoreEntry, b: CompetitionScoreEntry): number =>
  a.nickname < b.nickname ? -1 : a.nickname > b.nickname ? 1
    : a.profileId < b.profileId ? -1 : a.profileId > b.profileId ? 1 : 0;
const scoreAt = (competition: CompetitionState, profileId: ProfileId): number =>
  Object.hasOwn(competition.currentScores, profileId) ? competition.currentScores[profileId] : 0;
const recordsByProfile = (profiles: readonly CompetitionProfile[]): Readonly<Record<ProfileId, PersonalRecords>> =>
  Object.fromEntries(profiles.map(profile => [profile.profileId, profile.personalRecords]));

/** Sorting decides only display order within a score tie. Competition ranks use
 * the count of higher-scoring participants, so 20/20/10 yields 1/1/3. */
export function rankPositiveScores(entries: readonly CompetitionScoreEntry[]): ClosedWeekResult['entries'] {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (!integer(entry.points) || !text(entry.profileId) || ids.has(entry.profileId)) {
      throw new RangeError('Scores must be nonnegative safe integers for distinct profiles');
    }
    ids.add(entry.profileId);
  }
  const positive = entries.filter(entry => entry.points > 0)
    .sort((a, b) => b.points - a.points || byIdentity(a, b));
  let rank = 0;
  return positive.map((entry, index) => {
    if (index === 0 || entry.points !== positive[index - 1].points) rank = index + 1;
    return { ...entry, rank, medal: medalFor(rank) };
  });
}

/** Projection of one close, not a mutation or a second closure journal.
 * Reconciliation alone appends/reset/advances the week in its returned state.
 * Calling with the same original input produces the same records, never adds
 * to a previous call's output. Persist nextCompetition and records together. */
export function closeWeek({ competition, profiles }: ReconciliationInput): CloseWeekResult {
  const issues = validateCompetitionState(competition, profiles);
  if (issues.length > 0) throw new RangeError(`Invalid competition: ${issues[0].path}: ${issues[0].message}`);
  const nextPersonalRecordsByProfile = { ...recordsByProfile(profiles) };
  if (competition.latestOpenedWeek === null) return { result: null, nextPersonalRecordsByProfile };
  const entries = rankPositiveScores(profiles.map(profile => ({
    profileId: profile.profileId, nickname: profile.nickname, avatarId: profile.avatarId,
    points: scoreAt(competition, profile.profileId),
  })));
  if (entries.length === 0) return { result: null, nextPersonalRecordsByProfile };
  const week = competition.latestOpenedWeek;
  for (const entry of entries) {
    const previous = nextPersonalRecordsByProfile[entry.profileId];
    const best = previous.best === null || entry.points > previous.best.points
      ? { points: entry.points, week } : previous.best;
    const medals = entry.medal === null ? previous.medals
      : { ...previous.medals, [entry.medal]: previous.medals[entry.medal] + 1 };
    if (entry.medal !== null && !Number.isSafeInteger(medals[entry.medal])) {
      throw new RangeError('Cumulative medal count exceeds the safe integer range');
    }
    if (best !== previous.best || medals !== previous.medals) {
      nextPersonalRecordsByProfile[entry.profileId] = { best, medals };
    }
  }
  return {
    result: { week, timezone: competition.timezone, policyVersion: competition.policyVersion,
      entries, omittedDeletedProfiles: false },
    nextPersonalRecordsByProfile,
  };
}

/** Committed facts only: no clock read, grading, refresh or award. Archives are
 * stored oldest-first; presentation lists recent results newest-first. */
export function buildLeaderboardReadModel({ competition, profiles, context }: ReconciliationInput &
  Readonly<{ context: CalendarContext }>): LeaderboardReadModel {
  if (!monday(context.activeWeek)
    || (competition.latestOpenedWeek !== null && context.activeWeek !== competition.latestOpenedWeek)) {
    throw new RangeError('Leaderboard context must identify the active Monday week');
  }
  const entries = profiles.map(profile => ({
    profileId: profile.profileId, nickname: profile.nickname, avatarId: profile.avatarId,
    points: scoreAt(competition, profile.profileId),
  }));
  const ranked = rankPositiveScores(entries);
  const ranks = new Map(ranked.map(entry => [entry.profileId, entry.rank]));
  const display = [...entries].sort((a, b) => b.points - a.points || byIdentity(a, b));
  return {
    localScopeLabel: 'Profiles saved in this browser', activeWeek: context.activeWeek,
    activeWeekLabel: `${context.activeWeek} – ${addCalendarDays(context.activeWeek, 6)} (Europe/London)`,
    timezone: competition.timezone,
    ...(context.clockRollback ? { clockNotice:
      `The local clock is earlier than the active London week (${context.activeWeek}). Scores remain in that week. Local clock changes or restoring an older backup can alter this browser's history.` } : {}),
    profiles: display.map(entry => {
      const profile = profiles.find(value => value.profileId === entry.profileId)!;
      const slots = Object.hasOwn(competition.currentSlots, entry.profileId)
        ? competition.currentSlots[entry.profileId] : [];
      return { profileId: entry.profileId, nickname: entry.nickname, avatarId: entry.avatarId,
        competitivePoints: entry.points, lifetimePoints: profile.lifetimePoints,
        usedSlots: slots.length, rank: ranks.get(entry.profileId) ?? null };
    }),
    recentClosedResults: [...competition.archives].reverse(),
    personalRecordsByProfile: recordsByProfile(profiles),
  };
}

/** Delete only this identity. An emptied archive stays as an omission-marked
 * historical week; surviving ranks, medals, bests and record references survive. */
export function removeProfileResults(input: Readonly<{
  competition: CompetitionState;
  personalRecordsByProfile: Readonly<Record<ProfileId, PersonalRecords>>;
}>, profileId: ProfileId): typeof input {
  const { competition, personalRecordsByProfile } = input;
  const without = <T>(map: Readonly<Record<string, T>>): Readonly<Record<string, T>> => {
    if (!Object.hasOwn(map, profileId)) return map;
    const next = { ...map };
    delete next[profileId];
    return next;
  };
  const currentScores = without(competition.currentScores);
  const currentSlots = without(competition.currentSlots);
  let changedArchive = false;
  const archives = competition.archives.map(archive => {
    const entries = archive.entries.filter(entry => entry.profileId !== profileId);
    if (entries.length === archive.entries.length) return archive;
    changedArchive = true;
    return { ...archive, entries, omittedDeletedProfiles: true };
  });
  return {
    competition: changedArchive || currentScores !== competition.currentScores || currentSlots !== competition.currentSlots
      ? { ...competition, currentScores, currentSlots, archives: changedArchive ? archives : competition.archives }
      : competition,
    personalRecordsByProfile: without(personalRecordsByProfile),
  };
}

/** Domain invariant issues for WP04's decoder/pre-write gate. WP04 owns the
 * full JSON envelope, allowed fields, supported versions/catalogue and text/ID
 * bounds. Historical aggregates are checked against available retained facts,
 * without reconstructing discarded weeks or reranking omission-marked history. */
export function validateCompetitionState(
  competition: CompetitionState, profiles: readonly CompetitionProfile[],
): readonly CompetitionValidationIssue[] {
  const issues: CompetitionValidationIssue[] = [];
  const issue = (path: string, code: CompetitionValidationIssue['code'], message: string) =>
    issues.push({ path, code, message });
  if (!record(competition) || !Array.isArray(profiles as unknown)) {
    issue('competition', 'invalid-shape', 'Expected competition data and a profile array');
    return issues;
  }
  if (competition.timezone !== 'Europe/London') issue('competition.timezone', 'inconsistent', 'Timezone must be Europe/London');
  if (!text(competition.policyVersion)) issue('competition.policyVersion', 'invalid-shape', 'Policy version is required');
  const active = competition.latestOpenedWeek;
  if (active !== null && !monday(active)) issue('competition.latestOpenedWeek', 'invalid-date', 'Expected a Monday date or null');
  if (profiles.length > 16) issue('profiles', 'limit-exceeded', 'At most 16 profiles are supported');
  const profileMap = new Map<ProfileId, CompetitionProfile>();
  const retained = new Map<ProfileId, { points: number; medals: Record<Medal, number>; entries: { week: string; points: number }[] }>();
  for (const [index, profile] of profiles.entries()) {
    const path = `profiles[${index}]`;
    if (!record(profile) || !text(profile.profileId) || !text(profile.nickname) || !text(profile.avatarId)) {
      issue(path, 'invalid-shape', 'Profile identity and display fields are required');
      continue;
    }
    if (profileMap.has(profile.profileId)) issue(`${path}.profileId`, 'duplicate', 'Profile ID is duplicated');
    profileMap.set(profile.profileId, profile);
    retained.set(profile.profileId, { points: 0, medals: { gold: 0, silver: 0, bronze: 0 }, entries: [] });
    if (!integer(profile.lifetimePoints)) issue(`${path}.lifetimePoints`, 'invalid-counter', 'Lifetime points must be a nonnegative safe integer');
  }
  const scores = competition.currentScores;
  const slots = competition.currentSlots;
  if (!record(scores) || !record(slots) || !Array.isArray(competition.archives as unknown)) {
    issue('competition', 'invalid-shape', 'Score/slot maps and an archive array are required');
    return issues;
  }
  for (const [id, points] of Object.entries(scores)) {
    if (!profileMap.has(id)) issue(`competition.currentScores.${id}`, 'invalid-reference', 'Score refers to a missing profile');
    if (!integer(points, 0, 600) || points % 5 !== 0) {
      issue(`competition.currentScores.${id}`, 'invalid-counter', 'Weekly score must be a multiple of 5 from 0 to 600');
    }
  }
  const opportunityIds = new Set<string>();
  for (const [id, entries] of Object.entries(slots)) {
    const path = `competition.currentSlots.${id}`;
    if (!profileMap.has(id)) issue(path, 'invalid-reference', 'Slots refer to a missing profile');
    if (!Array.isArray(entries as unknown)) { issue(path, 'invalid-shape', 'Expected an ordered slot array'); continue; }
    if (entries.length > 30) issue(path, 'limit-exceeded', 'At most 30 slots are allowed');
    const canonicalIds = new Set<string>();
    let sum = 0;
    entries.forEach((entry, index) => {
      const entryPath = `${path}[${index}]`;
      if (!record(entry)) { issue(entryPath, 'invalid-shape', 'Expected a slot entry'); return; }
      if (!integer(entry.slot, 1, 30) || entry.slot !== index + 1) {
        issue(`${entryPath}.slot`, 'inconsistent', 'Slots must be unique and ordered consecutively from 1');
      }
      if (!text(entry.opportunityId) || opportunityIds.has(entry.opportunityId)) {
        issue(`${entryPath}.opportunityId`, 'duplicate', 'Opportunity ID must be present and unique');
      } else opportunityIds.add(entry.opportunityId);
      if (!text(entry.canonicalQuestionId) || canonicalIds.has(entry.canonicalQuestionId)) {
        issue(`${entryPath}.canonicalQuestionId`, 'duplicate', 'A canonical task can occupy only one slot per profile/week');
      } else canonicalIds.add(entry.canonicalQuestionId);
      if (!integer(entry.points) || ![5, 10, 20].includes(entry.points)) {
        issue(`${entryPath}.points`, 'invalid-counter', 'Slot points must be 5, 10 or 20');
      } else sum += entry.points;
    });
    const score = Object.hasOwn(scores, id) ? scores[id] : 0;
    if (score !== sum) issue(path, 'inconsistent', 'Score must equal the sum of slot points');
  }
  for (const [id, points] of Object.entries(scores)) {
    if (points !== 0 && !Object.hasOwn(slots, id)) issue(`competition.currentScores.${id}`, 'inconsistent', 'Positive score requires slots');
  }
  if (active === null && (competition.archives.length > 0
    || Object.values(scores).some(value => value !== 0)
    || Object.values(slots).some(value => Array.isArray(value) && value.length > 0))) {
    issue('competition.latestOpenedWeek', 'inconsistent', 'Unopened competition must have no participation/history');
  }
  if (competition.archives.length > 52) issue('competition.archives', 'limit-exceeded', 'At most 52 participating archives are retained');
  let previousWeek = '';
  competition.archives.forEach((archive, archiveIndex) => {
    const path = `competition.archives[${archiveIndex}]`;
    if (!record(archive) || !Array.isArray(archive.entries as unknown)) {
      issue(path, 'invalid-shape', 'Expected a closed result with entries'); return;
    }
    if (!monday(archive.week)) issue(`${path}.week`, 'invalid-date', 'Archive week must be a Monday date');
    else {
      if (archive.week <= previousWeek || (typeof active === 'string' && archive.week >= active)) {
        issue(`${path}.week`, 'inconsistent', 'Archives must be unique, oldest-first and earlier than the active week');
      }
      previousWeek = archive.week;
    }
    if (archive.timezone !== 'Europe/London' || !text(archive.policyVersion)) {
      issue(path, 'inconsistent', 'Archive must retain London timezone and its policy version');
    }
    if (typeof archive.omittedDeletedProfiles !== 'boolean') issue(`${path}.omittedDeletedProfiles`, 'invalid-shape', 'Omission flag must be boolean');
    if (archive.entries.length === 0 && archive.omittedDeletedProfiles !== true) issue(path, 'inconsistent', 'An empty archive must represent deleted participation');
    if (archive.entries.length > 16) issue(`${path}.entries`, 'limit-exceeded', 'At most 16 archived participants are supported');
    const archivedIds = new Set<string>();
    let previousPoints: number | null = null;
    let previousRank = 0;
    let expectedRank = 0;
    let previousExpectedRank = 0;
    let retainedTieSize = 0;
    archive.entries.forEach((entry, index) => {
      const entryPath = `${path}.entries[${index}]`;
      if (!record(entry)) { issue(entryPath, 'invalid-shape', 'Expected an archived participant'); return; }
      if (!text(entry.profileId) || !profileMap.has(entry.profileId)) issue(`${entryPath}.profileId`, 'invalid-reference', 'Archive refers to a missing profile');
      if (archivedIds.has(entry.profileId)) issue(`${entryPath}.profileId`, 'duplicate', 'Profile appears twice in an archive');
      archivedIds.add(entry.profileId);
      if (!text(entry.nickname) || !text(entry.avatarId)) issue(entryPath, 'invalid-shape', 'Historical nickname/avatar snapshots are required');
      if (!integer(entry.points, 5, 600) || entry.points % 5 !== 0) issue(`${entryPath}.points`, 'invalid-counter', 'Archived score must be positive, a multiple of 5 and at most 600');
      if (!integer(entry.rank, 1, 16)) issue(`${entryPath}.rank`, 'invalid-counter', 'Historical rank must be a positive integer up to 16');
      if (previousPoints === null || entry.points !== previousPoints) {
        expectedRank = index + 1;
        retainedTieSize = 0;
      }
      retainedTieSize++;
      if (integer(entry.rank, 1, 16) && entry.rank + retainedTieSize - 1 > 16) {
        issue(`${entryPath}.rank`, 'limit-exceeded', 'Original tied group exceeds the 16-profile capacity');
      }
      if (archive.omittedDeletedProfiles !== true) {
        if (entry.rank !== expectedRank) issue(`${entryPath}.rank`, 'inconsistent', 'Rank must use competition ties');
      } else if (entry.rank < expectedRank
        || (previousPoints !== null && entry.points === previousPoints && entry.rank !== previousRank)
        || (previousPoints !== null && entry.points < previousPoints
          && entry.rank - expectedRank < previousRank - previousExpectedRank)) {
        issue(`${entryPath}.rank`, 'inconsistent', 'Omitted history must preserve valid original ties and increasing rank gaps');
      }
      if (entry.points === 600 && entry.rank !== 1) {
        issue(`${entryPath}.rank`, 'inconsistent', 'A maximum-score participant must retain rank 1, including after deletion');
      }
      if (previousPoints !== null && entry.points > previousPoints) issue(entryPath, 'inconsistent', 'Archive entries must be ordered by descending score');
      if (entry.medal !== medalFor(entry.rank)) issue(`${entryPath}.medal`, 'inconsistent', 'Medal must match the original rank');
      previousPoints = entry.points;
      previousRank = entry.rank;
      previousExpectedRank = expectedRank;
      const facts = retained.get(entry.profileId);
      if (facts && integer(entry.points, 5, 600)) {
        facts.points += entry.points;
        facts.entries.push({ week: archive.week, points: entry.points });
        if (entry.medal === 'gold' || entry.medal === 'silver' || entry.medal === 'bronze') facts.medals[entry.medal]++;
      }
    });
  });
  for (const [id, profile] of profileMap) {
    const path = `profiles.${id}.personalRecords`;
    const personal = profile.personalRecords;
    const facts = retained.get(id)!;
    if (!record(personal) || !record(personal.medals)) {
      issue(path, 'invalid-shape', 'Expected personal best and cumulative medal counts'); continue;
    }
    for (const medal of ['gold', 'silver', 'bronze'] as const) {
      if (!integer(personal.medals[medal])) issue(`${path}.medals.${medal}`, 'invalid-counter', 'Medal count must be a nonnegative safe integer');
      else if (personal.medals[medal] < facts.medals[medal]) issue(`${path}.medals.${medal}`, 'inconsistent', 'Cumulative medals cannot be below retained medals');
    }
    const best = personal.best;
    if (best === null) {
      if (facts.entries.length > 0 || Object.values(personal.medals).some(value => typeof value === 'number' && value > 0)) {
        issue(`${path}.best`, 'inconsistent', 'Participation/medals require a personal best');
      }
    } else if (!record(best) || !integer(best.points, 5, 600) || best.points % 5 !== 0 || !monday(best.week)) {
      issue(`${path}.best`, 'invalid-counter', 'Best must contain a positive supported weekly score and Monday date');
    } else {
      if (active === null || best.week >= active) issue(`${path}.best.week`, 'inconsistent', 'Best must belong to a closed week');
      if (best.points > profile.lifetimePoints || facts.entries.some(entry => entry.points > best.points
        || (entry.points === best.points && entry.week < best.week))) {
        issue(`${path}.best`, 'inconsistent', 'Best must cover retained results and preserve the earliest tied week');
      }
      if (competition.archives.some(archive => record(archive) && monday(archive.week) && archive.week <= best.week)
        && !facts.entries.some(entry => entry.week === best.week && entry.points === best.points)) {
        issue(`${path}.best`, 'inconsistent', 'Best inside the retained date window must contain the matching original result');
      }
    }
    const current = Object.hasOwn(scores, id) && integer(scores[id]) ? scores[id] : 0;
    if (facts.points + current > profile.lifetimePoints) issue(`profiles.${id}.lifetimePoints`, 'inconsistent', 'Lifetime total cannot be below retained competitive contributions');
  }
  return issues;
}
