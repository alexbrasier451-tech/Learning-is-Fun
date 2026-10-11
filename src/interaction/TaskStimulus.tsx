import type { TaskDefinition, TaskStimulus as Stimulus } from '../learning/contracts';
import './widgets.css';

/** A conventional dial. The caller supplies the text alternative; this drawing
 * never derives a spoken answer from source hands. */
export function ClockFace({ minutes }: { minutes: number | null }) {
  return <svg className="iw-clock-face" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
    <circle cx="100" cy="100" r="95" fill="#fff6e5" stroke="#24665e" strokeWidth="3" />
    {Array.from({ length: 12 }, (_, i) => {
      const angle = (i + 1) * Math.PI / 6;
      return <text key={i} x={100 + 77 * Math.sin(angle)} y={100 - 77 * Math.cos(angle)} textAnchor="middle" dominantBaseline="central" fill="#263d38">{i + 1}</text>;
    })}
    {minutes !== null && <>
      <line data-clock-hand="hour" x1="100" y1="100" x2="100" y2="48" stroke="#263d38" strokeWidth="6" strokeLinecap="round" transform={`rotate(${minutes % 720 / 2} 100 100)`} />
      <line data-clock-hand="minute" x1="100" y1="100" x2="100" y2="27" stroke="#24665e" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minutes % 60 * 6} 100 100)`} />
      <circle cx="100" cy="100" r="5" fill="#263d38" />
    </>}
  </svg>;
}

function requireSource(condition: boolean): asserts condition {
  if (!condition) throw new TypeError('Malformed TaskStimulus producer metadata.');
}
const whole = (n: number) => Number.isSafeInteger(n) && n > 0;

function Representation({ stimulus: s }: { stimulus: Stimulus }) {
  switch (s.kind) {
    case 'array':
      requireSource(whole(s.groups) && s.groups <= 12 && whole(s.itemsPerGroup) && s.itemsPerGroup <= 12);
      return <div className="iw-array" aria-hidden="true">{Array.from({ length: s.groups }, (_, group) =>
        <div className="iw-array-group" data-array-group={group} key={group}>{Array.from({ length: s.itemsPerGroup }, (_, item) => <span className="iw-array-item" key={item} />)}</div>)}</div>;
    case 'fraction':
      requireSource(whole(s.denominator) && whole(s.wholeCount) && Number.isSafeInteger(s.numerator) && s.numerator >= 0 && s.numerator <= s.denominator * s.wholeCount);
      return <div className="iw-fraction" aria-hidden="true">{Array.from({ length: s.wholeCount }, (_, w) =>
        <div className="iw-whole" key={w} style={{ gridTemplateColumns: `repeat(${s.denominator}, 1fr)` }}>{Array.from({ length: s.denominator }, (_, p) =>
          <span data-fraction-part="" data-shaded={w * s.denominator + p < s.numerator} key={p} />)}</div>)}</div>;
    case 'clock': {
      requireSource(Number.isSafeInteger(s.minutes) && s.minutes >= 0 && s.minutes <= 1439 && (s.dayOffset === 0 || s.dayOffset === 1)
        && (s.display === '12-hour' || s.display === '24-hour') && (s.face === 'digital' || s.face === 'analogue') && !(s.face === 'analogue' && s.display === '24-hour'));
      if (s.face === 'analogue') return <ClockFace minutes={s.minutes} />;
      const hour = Math.floor(s.minutes / 60);
      const text = `${String(s.display === '24-hour' ? hour : hour % 12 || 12).padStart(2, '0')}:${String(s.minutes % 60).padStart(2, '0')}${s.display === '12-hour' ? hour < 12 ? ' AM' : ' PM' : ''}`;
      return <p className="iw-digital" aria-hidden="true">{text}</p>;
    }
    case 'diagram': {
      requireSource(s.points.length > 0 && new Set(s.points.map(p => p.id)).size === s.points.length && new Set(s.edges.map(e => e.id)).size === s.edges.length
        && s.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100));
      return <svg className="iw-diagram" viewBox="-18 -18 136 136" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        {s.edges.map(edge => {
          const from = s.points.find(p => p.id === edge.from), to = s.points.find(p => p.id === edge.to);
          requireSource(!!from && !!to);
          return <g key={edge.id} data-edge-id={edge.id}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#24665e" strokeWidth="1" />
            {edge.label !== undefined && <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 3} textAnchor="middle">{edge.label}</text>}
          </g>;
        })}
        {s.points.map(point => <g key={point.id}><circle cx={point.x} cy={point.y} r="1.5" fill="#263d38" />{point.label !== undefined && <text x={point.x} y={point.y + 7} textAnchor="middle">{point.label}</text>}</g>)}
      </svg>;
    }
    case 'data': {
      requireSource(['table', 'bar', 'line'].includes(s.display) && whole(s.scaleStep) && s.rows.length > 0 && s.rows.length <= 6
        && new Set(s.rows.map(row => row.id)).size === s.rows.length && s.rows.every(row => Number.isSafeInteger(row.value) && row.value >= 0));
      const max = Math.max(s.scaleStep, Math.ceil(Math.max(...s.rows.map(row => row.value)) / s.scaleStep) * s.scaleStep);
      const y = (value: number) => 180 - value / max * 150;
      const x = (index: number) => 70 + index * 70;
      return <>
        {s.display !== 'table' && <svg className="iw-chart" viewBox={`0 0 ${Math.max(200, s.rows.length * 70 + 70)} 220`} aria-hidden="true" focusable="false">
          {Array.from({ length: max / s.scaleStep + 1 }, (_, i) => i * s.scaleStep).map(tick => <g key={tick} data-scale-tick={tick}>
            <line x1="45" y1={y(tick)} x2={s.rows.length * 70 + 35} y2={y(tick)} stroke="#a4b6ae" />
            <text x="38" y={y(tick) + 4} textAnchor="end">{tick}</text>
          </g>)}
          {s.display === 'line' && <polyline fill="none" stroke="#24665e" strokeWidth="3" points={s.rows.map((row, i) => `${x(i)},${y(row.value)}`).join(' ')} />}
          {s.rows.map((row, i) => <g key={row.id} data-data-row={row.id}>
            {s.display === 'bar' ? <rect x={x(i) - 20} y={y(row.value)} width="40" height={180 - y(row.value)} fill="#24665e" /> : <circle cx={x(i)} cy={y(row.value)} r="4" fill="#24665e" />}
            <text x={x(i)} y="202" textAnchor="middle">{i + 1}</text>
          </g>)}
        </svg>}
        <table className="iw-source-table"><caption>{s.xLabel} · {s.yLabel}{s.unit ? ` (${s.unit})` : ''}{s.display !== 'table' ? ` · scale starts at 0, step ${s.scaleStep}` : ''}</caption>
          <thead><tr><th scope="col">{s.xLabel}</th><th scope="col">{s.yLabel}{s.unit ? ` (${s.unit})` : ''}</th></tr></thead>
          <tbody>{s.rows.map((row, i) => <tr key={row.id}><th scope="row">{s.display !== 'table' ? `${i + 1}. ` : ''}{row.label}</th><td>{row.value}</td></tr>)}</tbody>
        </table>
      </>;
    }
    default: throw new TypeError('Unsupported TaskStimulus producer discriminant.');
  }
}

export function TaskStimulus({ stimulus }: { stimulus: TaskDefinition['stimulus'] }) {
  if (stimulus === null || stimulus === undefined) return null;
  requireSource(typeof stimulus.accessibleDescription === 'string' && stimulus.accessibleDescription.trim().length > 0
    && Array.isArray(stimulus.labels) && stimulus.labels.every(label => typeof label === 'string'));
  return <figure className="iw-widget iw-stimulus" aria-label="Task source" data-stimulus-kind={stimulus.kind}>
    <Representation stimulus={stimulus} />
    <figcaption>{stimulus.labels.map((label, i) => <p key={i}>{label}</p>)}<p className="iw-source-description">{stimulus.accessibleDescription}</p></figcaption>
  </figure>;
}
