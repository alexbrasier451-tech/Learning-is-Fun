import { useState } from 'react';
import { mountPanel } from './host';
import { HallOfChampions } from '../../src/rewards/HallOfChampions';
import type { HallRefreshStatus } from '../../src/rewards/HallOfChampions';
import { PersonalHistory } from '../../src/rewards/PersonalHistory';
import { buildLeaderboardReadModel } from '../../src/rewards/standings';
import type { ClosedWeekResult, CompetitionProfile, CompetitionState, CompetitionSlotEntry, LeaderboardReadModel } from '../../src/rewards/contracts';

const noRecords = { best: null, medals: { gold: 0, silver: 0, bronze: 0 } } as const;
const people: readonly CompetitionProfile[] = [
  { profileId: 'a', nickname: 'Amira', avatarId: 'pip', lifetimePoints: 80, personalRecords: { best: { points: 20, week: '2026-09-28' }, medals: { gold: 1, silver: 0, bronze: 0 } } },
  { profileId: 'b', nickname: 'Ben', avatarId: 'rowan', lifetimePoints: 60, personalRecords: { best: { points: 20, week: '2026-09-28' }, medals: { gold: 1, silver: 0, bronze: 0 } } },
  { profileId: 'c', nickname: 'Cleo', avatarId: 'flower', lifetimePoints: 40, personalRecords: { best: { points: 10, week: '2026-09-28' }, medals: { gold: 0, silver: 0, bronze: 1 } } },
  { profileId: 'd', nickname: 'Dev', avatarId: 'apple', lifetimePoints: 0, personalRecords: noRecords },
];
const tieArchive: ClosedWeekResult = { week: '2026-09-28', timezone: 'Europe/London', policyVersion: 'local-v1', omittedDeletedProfiles: false,
  entries: [ { profileId: 'a', nickname: 'Mira before rename', avatarId: 'iona', points: 20, rank: 1, medal: 'gold' },
    { profileId: 'b', nickname: 'Ben', avatarId: 'rowan', points: 20, rank: 1, medal: 'gold' },
    { profileId: 'c', nickname: 'Cleo', avatarId: 'flower', points: 10, rank: 3, medal: 'bronze' } ] };
const blank: CompetitionState = { timezone: 'Europe/London', latestOpenedWeek: '2026-10-05', currentScores: {}, currentSlots: {}, archives: [], policyVersion: 'local-v1' };
function project(profiles: readonly CompetitionProfile[], competition: CompetitionState = blank, clockRollback = false) {
  return buildLeaderboardReadModel({ profiles, competition, context: { activeWeek: '2026-10-05', observedLocalDate: clockRollback ? '2026-09-28' : '2026-10-09', clockRollback } });
}
const slots = (id: string, points: readonly number[]): readonly CompetitionSlotEntry[] => points.map((value, index) => ({
  slot: (index + 1) as CompetitionSlotEntry['slot'], opportunityId: `${id}-${index}`, canonicalQuestionId: `fixture-${id}-${index}`, points: value,
}));
const tieCompetition: CompetitionState = { ...blank, currentScores: { a: 20, b: 20, c: 10 }, currentSlots: { a: slots('a', [20]), b: slots('b', [20]), c: slots('c', [10]) }, archives: [tieArchive] };
const oldWeek = (index: number) => new Date(Date.UTC(2026, 8, 28 - 7 * index)).toISOString().slice(0, 10);
const archiveWeeks: readonly ClosedWeekResult[] = Array.from({ length: 52 }, (_, index) => ({
  week: oldWeek(51 - index), timezone: 'Europe/London', policyVersion: 'local-v1', omittedDeletedProfiles: false,
  entries: [{ profileId: 'a', nickname: 'Mira before rename', avatarId: 'iona', points: 20, rank: 1, medal: 'gold' }],
}));
const models: Readonly<Record<string, LeaderboardReadModel>> = {
  empty: project([]), single: project([{ ...people[0], lifetimePoints: 20, personalRecords: noRecords }], { ...blank, currentScores: { a: 20 }, currentSlots: { a: slots('a', [20]) } }),
  unscored: project([{ ...people[0], lifetimePoints: 0, personalRecords: noRecords }]),
  ties: project(people, tieCompetition), clock: project(people, tieCompetition, true),
  cap: project([{ ...people[0], lifetimePoints: 620, personalRecords: noRecords }], { ...blank, currentScores: { a: 600 }, currentSlots: { a: slots('a', Array(30).fill(20)) } }),
  omitted: project([people[2]], { ...blank, archives: [{ ...tieArchive, entries: [tieArchive.entries[2]], omittedDeletedProfiles: true }] }),
  deleted: project([], { ...blank, archives: [{ ...tieArchive, entries: [], omittedDeletedProfiles: true }] }),
  archive: project([{ ...people[0], lifetimePoints: 1100, personalRecords: { best: { points: 20, week: oldWeek(52) }, medals: { gold: 53, silver: 0, bronze: 0 } } }], { ...blank, archives: archiveWeeks }),
};
let changeScenario: (name: string) => void, changeStatus: (status: HallRefreshStatus) => void, chooseHistory: (profileId: string) => void;
const events: unknown[] = [];
let current = models.ties;
function Fixture() {
  const [scenario, setScenario] = useState(new URLSearchParams(location.search).get('scenario') ?? 'ties');
  const [status, setStatus] = useState<HallRefreshStatus>('ready');
  const [profileId, setProfileId] = useState<string | null>(null);
  changeScenario = name => { setScenario(name); setProfileId(null); setStatus('ready'); };
  changeStatus = setStatus;
  chooseHistory = setProfileId;
  current = models[scenario] ?? models.ties;
  function refresh() { events.push({ kind: 'refresh-request', model: current }); setStatus('refreshing'); }
  function back() {
    const previous = profileId; setProfileId(null);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`.hall-player[data-profile="${previous}"] button`)?.focus());
  }
  return profileId === null ? <HallOfChampions model={current} refreshStatus={status} onRefresh={refresh}
    onOpenHistory={id => { events.push({ kind: 'history', profileId: id }); setProfileId(id); }}
    onClose={() => { events.push({ kind: 'close' }); document.getElementById('scenario')?.focus(); }} /> :
    <PersonalHistory profileId={profileId} model={current} onBack={back} />;
}
function Controls() { return <label>Bounded read-model fixture<select id="scenario" defaultValue={new URLSearchParams(location.search).get('scenario') ?? 'ties'} onChange={event => changeScenario(event.target.value)}>
  {Object.keys(models).map(name => <option key={name}>{name}</option>)}</select></label>; }
if (new URLSearchParams(location.search).get('mode') === 'real') {
  void import('./local-leaderboard-real').then(({ mountRealHall }) => {
    const api = mountRealHall(document.getElementById('root')!, document.getElementById('fixture-controls')!);
    (window as unknown as { realHall: import('./local-leaderboard-api').RealHallApi }).realHall = api;
    addEventListener('pagehide', api.teardown, { once: true });
  });
} else {
  const controls = mountPanel(document.getElementById('fixture-controls')!, <Controls />);
  const panel = mountPanel(document.getElementById('root')!, <Fixture />);
  const api = { model: () => current, select: (name: string) => changeScenario(name), status: (value: HallRefreshStatus) => changeStatus(value), history: (profileId: string) => chooseHistory(profileId), events: () => events,
    teardown: () => { panel.unmount(); controls.unmount(); } };
  (window as unknown as { hallFixture: typeof api }).hallFixture = api;
  addEventListener('pagehide', api.teardown, { once: true });
}
