import { useEffect, useId, useRef } from 'react';
import { AVATARS } from '../experience/catalogue';
import { assetUrl } from '../platform/assets';
import type { ClosedWeekResult, LeaderboardReadModel } from './contracts';
import './leaderboard.css';

/** Adapters retain the last acknowledged model until calendar refresh succeeds. */
export type HallRefreshStatus = 'ready' | 'loading' | 'refreshing' | 'failed' | 'stale';
export type HallOfChampionsProps = Readonly<{
  model: LeaderboardReadModel;
  refreshStatus: HallRefreshStatus;
  onRefresh(): void;
  onOpenHistory(profileId: string): void;
  onClose(): void;
}>;

const avatarPaths: Readonly<Record<string, string>> = {
  'pip-idle': 'characters/pip-idle.svg', rowan: 'characters/rowan.svg',
  iona: 'characters/iona.svg', nessa: 'characters/nessa.svg',
  'flowers-coral': 'props/flowers-coral.svg', apple: 'props/apple.svg',
};

/** Unknown/unavailable future portraits retain the name without inventing art. */
export function HallAvatar({ avatarId }: Readonly<{ avatarId: string }>) {
  const avatar = AVATARS.find(value => value.id === avatarId);
  const path = avatar && avatarPaths[avatar.assetId];
  return path ? <span className="hall-avatar" aria-hidden="true">
    <img src={assetUrl(`assets/art/m1/${path}`)} alt="" data-asset={avatar.assetId} />
  </span> : null;
}

export function ClosedResult({ result }: Readonly<{ result: ClosedWeekResult }>) {
  return <article className="hall-closed-week">
    <h3>Week of <time dateTime={result.week}>{result.week}</time></h3>
    {result.omittedDeletedProfiles && <p className="hall-omission">Deleted profiles are omitted. Original ranks and medals stay the same.</p>}
    {result.entries.length === 0 ? <p>No entries remain for this closed week.</p> :
      <ol className="hall-results" aria-label={`Closed results for ${result.week}`}>
        {result.entries.map(entry => <li key={entry.profileId}>
          <HallAvatar avatarId={entry.avatarId} />
          <div><strong>{entry.nickname}</strong><span>Rank {entry.rank} · {entry.points} weekly points</span>
            <span className={`hall-medal hall-medal-${entry.medal ?? 'none'}`}>{entry.medal ? `${entry.medal[0].toUpperCase()}${entry.medal.slice(1)} medal` : 'No medal'}</span>
          </div>
        </li>)}
      </ol>}
  </article>;
}

export function HallOfChampions({ model, refreshStatus, onRefresh, onOpenHistory, onClose }: HallOfChampionsProps) {
  const titleId = useId(), boardId = useId(), closedId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  const pending = refreshStatus === 'loading' || refreshStatus === 'refreshing';
  const freshness = refreshStatus === 'loading' ? 'Loading saved results. No new closed result is confirmed yet.'
    : refreshStatus === 'refreshing' ? 'Checking the London calendar. Showing the last committed results until the check finishes.'
    : refreshStatus === 'failed' ? 'The calendar check failed. Showing the last committed results; a new week or closed result has not been confirmed. Try again.'
    : refreshStatus === 'stale' ? 'Showing the last committed results. Check the calendar to confirm the current week.'
    : 'Calendar checked. These are committed results.';
  return <section className="hall" aria-labelledby={titleId} onKeyDown={event => {
    if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); onClose(); }
  }}>
    <header className="hall-header">
      <img className="hall-marker" src={assetUrl('assets/art/m1/ui/hall-marker.svg')} alt="" />
      <div className="hall-intro"><p className="hall-kicker">The Lost Kingdom · Your local adventures</p>
        <h1 id={titleId} tabIndex={-1} ref={heading}>Hall of Champions</h1>
        <p>Little steps. Lasting adventures.</p>
      </div>
      <button className="hall-button" onClick={onClose}>Back to adventure</button>
    </header>
    <div className="hall-scope"><strong>{model.localScopeLabel}</strong><p>This board belongs to this browser. It is not a worldwide competition.</p></div>
    <div className={`hall-freshness hall-freshness-${refreshStatus}`}>
      <p role="status" aria-live="polite">{freshness}</p>
      <button className="hall-button" disabled={pending} onClick={onRefresh}>{pending ? 'Checking calendar…' : 'Check calendar'}</button>
    </div>
    {model.clockNotice && <p className="hall-notice" role="note">{model.clockNotice}</p>}
    <div className="hall-panels">
      <section className="hall-paper" aria-labelledby={boardId} aria-busy={pending}>
        <div className="hall-panel-heading"><p className="hall-kicker">The open chapter</p><h2 id={boardId}>This week</h2>
          <p className="hall-week">{model.activeWeekLabel}</p><p>Provisional ranks · medals are saved when the week closes.</p></div>
        {model.profiles.length === 0 ? <div className="hall-empty"><img src={assetUrl('assets/art/m1/characters/pip-idle.svg')} alt="" />
          <h3>Your adventures begin here</h3><p>No profiles are saved in this browser yet. Create a player in the adventure to start your own story.</p></div> : <>
          {model.profiles.length === 1 && <p className="hall-single">Your own adventure, at your own pace. Your history is yours to grow.</p>}
          <ol className="hall-players" aria-label="Provisional weekly standings">
            {model.profiles.map(profile => <li className="hall-player" key={profile.profileId} data-profile={profile.profileId}>
              <div className="hall-player-name"><HallAvatar avatarId={profile.avatarId} /><div><h3>{profile.nickname}</h3>
                <p className="hall-rank">{profile.rank === null ? 'Not yet scored this week' : `Provisional rank ${profile.rank}`}</p></div></div>
              <dl className="hall-points"><div><dt>Weekly points</dt><dd>{profile.competitivePoints}</dd></div>
                <div><dt>Lifetime points</dt><dd>{profile.lifetimePoints}</dd></div>
                <div><dt>Weekly slots used</dt><dd>{profile.usedSlots}<span> / 30</span></dd></div></dl>
              {profile.usedSlots === 30 && <p className="hall-cap">All 30 weekly slots used. Keep learning: lifetime points and adventure progress can continue.</p>}
              <button className="hall-button hall-history-link" onClick={() => onOpenHistory(profile.profileId)}>See {profile.nickname}’s history</button>
            </li>)}
          </ol>
        </>}
        <details className="hall-explanation"><summary>How points and shared ranks work</summary>
          <p>A first valid Check earns 5 points. A first correct answer without answer help adds 15; a supported or later success adds 5 instead.</p>
          <p>The first 30 eligible learning-selected opportunities Checked can count each week. Repeated or child-chosen practice does not create a new weekly slot. Quest completion adds 20 lifetime points, once.</p>
          <p>Equal positive scores share a rank. A tie at rank 1 means the next rank is 3. Zero points has no rank or medal. Points describe this week’s participation.</p>
          <p>Earned cosmetic choices stay available. Choosing them never spends points.</p>
        </details>
      </section>
      <section className="hall-paper hall-archive" aria-labelledby={closedId}>
        <div className="hall-panel-heading"><p className="hall-kicker">Chapters to remember</p><h2 id={closedId}>Closed weeks</h2><p>Saved results · shared places, shared celebrations.</p></div>
        <p className="hall-retention">The latest 52 participating closed weeks are shown. Personal bests and lifetime medal totals last beyond this display window.</p>
        {model.recentClosedResults.length === 0 ? <div className="hall-empty hall-empty-small"><img src={assetUrl('assets/art/m1/props/spellbook.svg')} alt="" />
          <h3>A story still unfolding</h3><p>No closed results yet. Your first participating week will appear here after it closes.</p></div> :
          model.recentClosedResults.map((result, index) => index === 0 ? <ClosedResult key={result.week} result={result} /> :
            <details key={result.week} className="hall-older-week"><summary>Week of {result.week}</summary><ClosedResult result={result} /></details>)}
      </section>
    </div>
  </section>;
}
