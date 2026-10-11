import { useState } from 'react';
import { mountPanel } from './host';
import { ChoiceTiles, PlacementBoard, QuantityControl, MatchingBoard, SequenceList, SortBoard } from '../../src/interaction/ActivityWidgets';
import { TaskStimulus } from '../../src/interaction/TaskStimulus';
import type { ResponseSpec, TaskStimulus as SourceStimulus } from '../../src/learning/contracts';
import { createDraft, reduceDraft, toResponse } from '../../src/interaction/draft';
import type { DraftAction } from '../../src/interaction/draft';

// Representative contract fixtures, not approved tasks or answer/help content.
const specifications: readonly ResponseSpec[] = [
  { kind: 'bridge', plankLengths: [1, 2, 3, 4, 5, 6], cardinality: { min: 1, max: 6 } },
  { kind: 'punctuation', slots: [
    { id: 'first', label: 'Where is the little bridge', options: [{ id: '?', label: 'question mark' }, { id: '.', label: 'full stop' }, { id: '!', label: 'exclamation mark' }] },
    { id: 'second', label: 'The book is on the shelf', options: [{ id: '?', label: 'question mark' }, { id: '.', label: 'full stop' }, { id: '!', label: 'exclamation mark' }] },
  ], requiredSlotIds: ['first', 'second'] },
  { kind: 'merchant', countBounds: { min: 0, max: 24 }, maxTotal: 24 },
  { kind: 'matching', items: [{ id: 'oak', label: 'Oak panel' }, { id: 'ash', label: 'Ash panel' }], targets: [{ id: 'east', label: 'East partner' }, { id: 'west', label: 'West partner' }], requiredItemIds: ['oak', 'ash'], uniqueTargets: true },
  { kind: 'sequence', tiles: [{ id: 'dawn', label: 'Dawn panel' }, { id: 'noon', label: 'Noon panel' }, { id: 'dusk', label: 'Dusk panel' }], cardinality: { min: 3, max: 3 } },
  { kind: 'sorting', items: [{ id: 'circle', label: 'Round panel' }, { id: 'square', label: 'Square panel' }], groups: [{ id: 'first', label: 'First group' }, { id: 'second', label: 'Second group' }], requiredItemIds: ['circle', 'square'] },
  { kind: 'quantity', slots: [
    { id: 'whole', label: 'Whole amount', numeratorBounds: { min: 0, max: 12 }, allowedDenominators: [1], units: ['cm', 'm'], form: 'exact' },
    { id: 'parts', label: 'Fraction parts', numeratorBounds: { min: 0, max: 12 }, allowedDenominators: [2, 4], units: ['whole'], form: 'exact' },
    { id: 'money', label: 'Pence amount', numeratorBounds: { min: 0, max: 500 }, allowedDenominators: [1], units: ['pence'], form: 'exact' },
    { id: 'decimal', label: 'Hundredths amount', numeratorBounds: { min: 0, max: 500 }, allowedDenominators: [100], units: ['metre'], form: 'exact' },
  ], requiredSlotIds: ['whole', 'parts', 'money', 'decimal'] },
  { kind: 'clock', minuteBounds: { min: 0, max: 1439 } },
  { kind: 'choice', slots: [{ id: 'option', label: 'Choose a panel label', options: [{ id: 'a', label: 'Amber label' }, { id: 'b', label: 'Blue label' }] }], requiredSlotIds: ['option'] },
];
const stimuli: readonly SourceStimulus[] = [
  { kind: 'array', groups: 3, itemsPerGroup: 4, labels: ['Three equal rows'], accessibleDescription: 'Three rows, each containing four dots.' },
  { kind: 'fraction', numerator: 5, denominator: 4, wholeCount: 2, labels: ['Two equal wholes'], accessibleDescription: 'Two equal bars, each divided into four equal parts. Four parts in the first bar and one in the second are shaded.' },
  { kind: 'clock', minutes: 195, dayOffset: 0, display: '12-hour', face: 'analogue', labels: ['Before midday, starting day'], accessibleDescription: 'The short hand is a quarter of the way from three to four. The long hand points to three.' },
  { kind: 'clock', minutes: 975, dayOffset: 1, display: '24-hour', face: 'digital', labels: ['Following day'], accessibleDescription: 'The digital display reads 16:15 on the following day.' },
  { kind: 'diagram', points: [{ id: 'a', x: 10, y: 10, label: 'A' }, { id: 'b', x: 90, y: 10, label: 'B' }, { id: 'c', x: 90, y: 60, label: 'C' }], edges: [{ id: 'ab', from: 'a', to: 'b', label: '8 cm' }, { id: 'bc', from: 'b', to: 'c', label: '5 cm' }], closed: false, labels: ['Given path lengths'], accessibleDescription: 'A path from A to B to C. AB is labelled 8 cm; BC is labelled 5 cm. There is no segment from C to A.' },
  ...(['bar', 'line', 'table'] as const).map(display => ({ kind: 'data' as const, display, xLabel: 'Day', yLabel: 'Books', unit: 'books', scaleStep: 2, rows: [{ id: 'wed', label: 'Wednesday', value: 4 }, { id: 'mon', label: 'Monday', value: 0 }, { id: 'fri', label: 'Friday', value: 6 }], labels: ['Authored day order'], accessibleDescription: 'Wednesday: four books. Monday: zero books. Friday: six books.' })),
];
function Fixture() {
  const [drafts, setDrafts] = useState(() => specifications.map(spec => createDraft(spec)));
  const [disabled, setDisabled] = useState(false);
  const [actions, setActions] = useState<string[]>([]);
  const edit = (index: number, action: DraftAction) => {
    setDrafts(previous => previous.map((draft, i) => i === index ? reduceDraft(draft, action, specifications[i]) : draft));
    setActions(previous => [...previous, action.kind]);
  };
  return <main style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#263d38' }}>
    <h1>M1 and M2 native construction contract fixtures</h1>
    <p>Contract fixtures, not reviewed expansion questions. No Check, evaluator, help, reward, speech or saved-state port is attached.</p>
    <button type="button" onClick={() => setDisabled(value => !value)}>{disabled ? 'Enable editing' : 'Pause editing'}</button>
    <div aria-label="Ordinary scroll area" style={{ background: '#e1eee2', padding: '24px', marginBlock: '24px', fontSize: '18px' }}>Scroll here as usual. Only piece handles suppress touch scrolling.</div>
    <PlacementBoard responseSpec={specifications[0]} draft={drafts[0]} disabled={disabled} onAction={action => edit(0, action)} />
    <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }} aria-label="Bridge response">{JSON.stringify(toResponse(drafts[0]))}</pre>
    <ChoiceTiles responseSpec={specifications[1]} draft={drafts[1]} disabled={disabled} onAction={action => edit(1, action)} />
    <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }} aria-label="Punctuation response">{JSON.stringify(toResponse(drafts[1]))}</pre>
    <QuantityControl responseSpec={specifications[2]} draft={drafts[2]} disabled={disabled} onAction={action => edit(2, action)} />
    <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }} aria-label="Merchant response">{JSON.stringify(toResponse(drafts[2]))}</pre>
    {specifications.slice(3).map((spec, offset) => {
      const index = offset + 3;
      const Widget = spec.kind === 'matching' ? MatchingBoard : spec.kind === 'sequence' ? SequenceList : spec.kind === 'sorting' ? SortBoard : spec.kind === 'choice' ? ChoiceTiles : QuantityControl;
      return <div key={spec.kind}>
        <Widget responseSpec={spec} draft={drafts[index]} disabled={disabled} onAction={action => edit(index, action)} />
        <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }} aria-label={`${spec.kind[0].toUpperCase() + spec.kind.slice(1)} response`}>{JSON.stringify(toResponse(drafts[index]))}</pre>
      </div>;
    })}
    <section aria-label="Read-only source fixtures">{stimuli.map((stimulus, index) => <TaskStimulus key={index} stimulus={stimulus} />)}<TaskStimulus stimulus={null} /><TaskStimulus stimulus={undefined} /></section>
    <output aria-label="Draft action kinds">{JSON.stringify(actions)}</output>
    <div style={{ height: '400px' }} aria-hidden="true" />
  </main>;
}
const container = document.getElementById('panel');
if (!container) throw new Error('Fixture container is missing.');
const panel = mountPanel(container, <Fixture />);
document.getElementById('unmount')?.addEventListener('click', () => {
  panel.unmount(); panel.unmount();
  document.getElementById('teardown')!.textContent = 'Removed interaction panel.';
});
