import type { LearningSummary } from '../learning/contracts';
import { SKILLS } from '../content/skills';
import './adult.css';

export type ProgressViewProps = Readonly<{
  profileIdentity: Readonly<{ profileId: string; nickname: string; avatarId: string }>;
  summaries: readonly LearningSummary[];
}>;
const reviewLabels = { 'independent-success': 'Independent success', 'supported-success': 'Supported success', unsuccessful: 'Unsuccessful review' };
export function ProgressView({ profileIdentity, summaries }: ProgressViewProps) {
  return <section className="adult-progress" aria-label={`Practice evidence for ${profileIdentity.nickname}`}>
    <h2>{profileIdentity.nickname}’s practice notebook</h2>
    <p>These are recorded observations, not an ability score. A successful delayed review is an observation, not proof of durable learning.</p>
    {!summaries.length && <p className="adult-note">Not practised · No skill evidence is available yet.</p>}
    <div className="adult-skills">{summaries.map(row => <article className="adult-skill adult-paper" key={row.skillId}>
      <header><p className="adult-kicker">{row.skillId} · {row.currentBand} practice</p><h3>{SKILLS.find(s => s.skillId === row.skillId)?.label ?? row.skillId}</h3></header>
      <p className="adult-evidence-label">{row.validChecks ? 'Recorded practice' : 'Not practised · Not enough evidence'}</p>
      <dl className="adult-counts">{[
        ['Recorded Checks', row.validChecks], ['Completed episodes', row.completedEpisodes], ['Unassisted first-Check successes', row.independentSuccesses],
        ['Supported / later-Check successes', row.supportedSuccesses], ['Later-Check successes', row.retrySuccesses], ['Later successes on distinct tasks', row.laterDistinctSuccesses],
      ].map(([label, count]) => <div key={label}><dt>{label}</dt><dd>{count}</dd></div>)}</dl>
      <p>Supported / later-Check successes include help, assessed text read aloud, or success after an earlier Check. Later-Check successes are a subset, not an extra total.</p>
      <details><summary>Recent episodes and help</summary><p>Hints are shown for each retained episode. An all-time hint count is not supplied by this summary.</p>
        {!row.recentCompletedEpisodes.length && <p>No completed episodes recorded.</p>}
        <ol className="adult-episodes">{row.recentCompletedEpisodes.map(e => <li key={`${e.encounterId}-${e.learningEpisodeOrdinal}`}>
          <time dateTime={e.localDate}>{e.localDate}</time> · {e.outcome === 'success' ? e.firstCheckCorrect ? 'First-Check success' : 'Later-Check success' : 'Finished without success'}
          <p>{e.validChecks} Check{e.validChecks === 1 ? '' : 's'} · Hint {e.assistance.answerHintUsed ? 'used' : 'not used'} · Worked support {e.assistance.workedSupportUsed ? 'used' : 'not used'} · Assessed text read aloud {e.assistance.assessedTextReadAloud ? 'used' : 'not used'} · {e.assistance.evidenceMode} evidence · {e.familiar ? 'Familiar task' : 'New task at this encounter'}</p>
          {e.issues.map((issue, index) => <p className="adult-feedback" key={`${issue.code}-${index}`}>Recorded feedback: {issue.explanation}</p>)}
        </li>)}</ol></details>
      <div className="adult-review"><h4>Latest completed review</h4>{row.latestReview ? <p>{reviewLabels[row.latestReview.outcome]} · <time dateTime={row.latestReview.localDate}>{row.latestReview.localDate}</time> · {row.latestReview.familiar ? 'Familiar task' : 'New task at review'}</p> : <p>Not enough evidence · No completed dated review recorded.</p>}</div>
      <div className="adult-suggestion"><h4>Suggested practice</h4><p>{row.label === 'review-due' ? `Review due ${row.reviewDueLocalDate}.` : row.label === 'ready-for-harder-work' ? 'The practice policy suggests trying harder work.' : 'Continue practising.'}
        {row.reviewDueLocalDate && row.label !== 'review-due' ? ` Next review suggested ${row.reviewDueLocalDate}.` : ''}</p>{row.suggestion && <p>{row.suggestion.explanation}</p>}</div>
      {!!row.missingEvidence.length && <div><h4>Missing evidence</h4><ul>{row.missingEvidence.map(text => <li key={text}>{text}</li>)}</ul></div>}
    </article>)}</div>
  </section>;
}
