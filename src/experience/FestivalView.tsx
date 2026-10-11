import { useEffect, useId, useRef } from 'react';
import type { ClosedWeekResult } from '../rewards/contracts';
import { assetUrl } from '../platform/assets';
import './festival.css';

export type FestivalViewProps = Readonly<{
  result: ClosedWeekResult | null;
  selectedProfileId: string | null;
  onSkip(): void;
  onOpenHall(): void;
}>;

/** Read-only closed facts. No ranking, date arithmetic, clock, writer or awards. */
export function FestivalView({ result, selectedProfileId, onSkip, onOpenHall }: FestivalViewProps) {
  const title = useId(), heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [result, selectedProfileId]);
  const personal = result?.entries.find(entry => entry.profileId === selectedProfileId);
  return <section className="village-festival" aria-labelledby={title} onKeyDown={event => {
    if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); onSkip(); }
  }}>
    <header className="festival-heading"><div><p className="festival-kicker">A village gathering</p><h1 id={title} ref={heading} tabIndex={-1}>Village Festival</h1>
      <p>Drop in, take a look, or carry on exploring. Your world stays yours.</p></div><button type="button" onClick={onSkip}>Skip Festival</button></header>
    <div className="festival-banner" aria-hidden="true"><img src={assetUrl('assets/art/m1/characters/pip-celebration.svg')} alt="" />
      <span>Little adventures,<br />lasting memories.</span></div>
    {!result ? <div className="festival-paper"><h2>No closed weekly result yet</h2><p>The current week is still open. Its points are not a final Festival result.</p></div> : <>
      <div className="festival-paper"><p className="festival-kicker">Saved closed result · this browser</p>
        <h2>Week beginning <time dateTime={result.week}>{result.week}</time></h2><p>{result.timezone}</p>
        {result.entries.length === 0 ? <p>{result.omittedDeletedProfiles ? 'All entries in this closed result belonged to deleted profiles and are omitted.' : 'No entries were supplied for this closed result.'}</p> :
          <ol className="festival-results">{result.entries.map(entry => <li key={entry.profileId} className={entry.profileId === selectedProfileId ? 'festival-personal' : ''}>
            <span className="festival-rank">Rank {entry.rank}{result.entries.some(other => other.profileId !== entry.profileId && other.rank === entry.rank) && <span>Shared place</span>}</span>
            <div><strong>{entry.nickname}</strong><span>{entry.points} weekly points</span></div>
            <span className={`festival-medal festival-${entry.medal ?? 'none'}`}>{entry.medal ? `${entry.medal[0].toUpperCase()}${entry.medal.slice(1)} medal` : 'No medal recorded'}</span>
          </li>)}</ol>}
        {result.omittedDeletedProfiles && <p className="festival-omission">Deleted profiles are omitted. Original ranks and medals stay unchanged.</p>}
      </div>
      {selectedProfileId && <div className="festival-paper festival-personal-note"><h2>Your adventure continues</h2>
        <p>{personal ? `${personal.nickname}, this is your saved result for that closed week.` : 'This explorer has no displayed entry in this closed week.'}</p>
        <p>Your saved creative choices and completed adventures stay available.</p></div>}
    </>}
    <footer className="festival-footer"><p>You can revisit closed results in the Hall whenever you like.</p><button type="button" onClick={onOpenHall}>Open Hall of Champions</button></footer>
  </section>;
}
