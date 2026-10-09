import { useState } from 'react';
import { mountPanel } from './host';
import { ChoiceTiles, PlacementBoard, QuantityControl } from '../../src/interaction/ActivityWidgets';
import { createDraft, reduceDraft, toResponse } from '../../src/interaction/draft';
import type { DraftAction, M1ResponseSpec } from '../../src/interaction/draft';

// Representative contract fixtures, not approved tasks or answer/help content.
const specifications: readonly M1ResponseSpec[] = [
  { kind: 'bridge', plankLengths: [1, 2, 3, 4, 5, 6], cardinality: { min: 1, max: 6 } },
  { kind: 'punctuation', slots: [
    { id: 'first', label: 'Where is the little bridge', options: [{ id: '?', label: 'question mark' }, { id: '.', label: 'full stop' }, { id: '!', label: 'exclamation mark' }] },
    { id: 'second', label: 'The book is on the shelf', options: [{ id: '?', label: 'question mark' }, { id: '.', label: 'full stop' }, { id: '!', label: 'exclamation mark' }] },
  ], requiredSlotIds: ['first', 'second'] },
  { kind: 'merchant', countBounds: { min: 0, max: 24 }, maxTotal: 24 },
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
    <h1>M1 native construction fixture</h1>
    <p>Three editable responses. No Check, evaluator, help, reward, speech or saved-state port is attached.</p>
    <button type="button" onClick={() => setDisabled(value => !value)}>{disabled ? 'Enable editing' : 'Pause editing'}</button>
    <div aria-label="Ordinary scroll area" style={{ background: '#e1eee2', padding: '24px', marginBlock: '24px', fontSize: '18px' }}>Scroll here as usual. Only piece handles suppress touch scrolling.</div>
    <PlacementBoard responseSpec={specifications[0]} draft={drafts[0]} disabled={disabled} onAction={action => edit(0, action)} />
    <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }} aria-label="Bridge response">{JSON.stringify(toResponse(drafts[0]))}</pre>
    <ChoiceTiles responseSpec={specifications[1]} draft={drafts[1]} disabled={disabled} onAction={action => edit(1, action)} />
    <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }} aria-label="Punctuation response">{JSON.stringify(toResponse(drafts[1]))}</pre>
    <QuantityControl responseSpec={specifications[2]} draft={drafts[2]} disabled={disabled} onAction={action => edit(2, action)} />
    <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }} aria-label="Merchant response">{JSON.stringify(toResponse(drafts[2]))}</pre>
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
