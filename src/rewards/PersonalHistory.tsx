import { useEffect, useId, useRef } from 'react';
import type { LeaderboardReadModel } from './contracts';
import { HallAvatar } from './HallOfChampions';
import './leaderboard.css';

export type PersonalHistoryProps = Readonly<{ profileId: string; model: LeaderboardReadModel; onBack(): void }>;

export function PersonalHistory({ profileId, model, onBack }: PersonalHistoryProps) {
  const titleId = useId(), recordsId = useId(), weeksId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [profileId]);
  const profile = model.profiles.find(value => value.profileId === profileId);
  const records = Object.hasOwn(model.personalRecordsByProfile, profileId) ? model.personalRecordsByProfile[profileId] : undefined;
  // Filter for display only. Recorded rank, medal and identity are never rewritten.
  const weeks = model.recentClosedResults.flatMap(result => {
    const entry = result.entries.find(value => value.profileId === profileId);
    return entry ? [{ result, entry }] : [];
  });
  return <section className="hall hall-personal" aria-labelledby={titleId} onKeyDown={event => {
    if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); onBack(); }
  }}>
    <header className="hall-header"><HallAvatar avatarId={profile?.avatarId ?? ''} />
      <div className="hall-intro"><p className="hall-kicker">Your adventure journal</p>
        <h1 id={titleId} ref={heading} tabIndex={-1}>{profile ? `${profile.nickname}’s history` : 'Profile unavailable'}</h1>
        <p>{model.localScopeLabel}</p></div><button className="hall-button" onClick={onBack}>Back to Hall</button></header>
    {!profile || !records ? <div className="hall-paper hall-empty"><p>This profile is no longer available. Return to the Hall to choose a saved player.</p></div> : <div className="hall-panels">
      <section className="hall-paper" aria-labelledby={recordsId}><div className="hall-panel-heading"><p className="hall-kicker">Lasting keepsakes</p><h2 id={recordsId}>Personal records</h2><p>From saved closed weeks, across your whole history.</p></div>
        <dl className="hall-personal-stats"><div><dt>Lifetime points</dt><dd>{profile.lifetimePoints}</dd></div>
          <div><dt>Best closed week</dt><dd>{records.best ? <>{records.best.points} points<span>Week of <time dateTime={records.best.week}>{records.best.week}</time></span></> : 'No closed personal best yet'}</dd></div></dl>
        <h3>Lifetime medal totals</h3><dl className="hall-medal-totals">{(['gold', 'silver', 'bronze'] as const).map(medal => <div className={`hall-medal-${medal}`} key={medal}><dt>{medal[0].toUpperCase()}{medal.slice(1)} medals</dt><dd>{records.medals[medal]}</dd></div>)}</dl>
        <p className="hall-retention">Your medal collection includes every closed week, even older pages beyond the 52-week display window.</p>
        <p className="hall-single">Your current week is still open: {profile.competitivePoints} weekly points and {profile.usedSlots} / 30 scoring turns used. It is not a closed medal result.</p>
      </section>
      <section className="hall-paper" aria-labelledby={weeksId}><div className="hall-panel-heading"><p className="hall-kicker">The pages so far</p><h2 id={weeksId}>Your closed weeks</h2><p>Newest first · within the latest 52 participating weeks.</p></div>
        {weeks.length === 0 ? <div className="hall-empty"><h3>No displayed closed results yet</h3><p>{records.best ? 'Your older personal best and lifetime medals remain saved above.' : 'Keep exploring. A participating closed week will become a page in your journal.'}</p></div> :
          <ol className="hall-personal-weeks">{weeks.map(({ result, entry }) => <li key={result.week}>
            <h3>Week of <time dateTime={result.week}>{result.week}</time></h3><div className="hall-historical-name"><HallAvatar avatarId={entry.avatarId} /><strong>{entry.nickname}</strong></div>
            <p><strong>{entry.points} weekly points</strong> · Rank {entry.rank}</p>
            <p className={`hall-medal hall-medal-${entry.medal ?? 'none'}`}>{entry.medal ? `${entry.medal[0].toUpperCase()}${entry.medal.slice(1)} medal` : 'No medal'}</p>
            {result.omittedDeletedProfiles && <p className="hall-omission">Deleted profiles are omitted. Your original rank and medal stay the same.</p>}
          </li>)}</ol>}
      </section>
    </div>}
  </section>;
}
