import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { FestivalView } from '../../src/experience/FestivalView';
import { FESTIVAL_FIXTURES } from '../fixtures/creative-festival-fixtures';

// Pure SSR presentation checks; browser interactions stay in the erased API spec.
const render = (scenario: keyof typeof FESTIVAL_FIXTURES, selected = 'a') =>
  renderToStaticMarkup(<FestivalView result={FESTIVAL_FIXTURES[scenario]} selectedProfileId={selected}
    onSkip={() => { throw new Error('Rendering must not Skip.'); }}
    onOpenHall={() => { throw new Error('Rendering must not open the Hall.'); }} />);
describe('closed Festival presentation', () => {
  it('distinguishes no closed result from provisional weekly points', () => {
    const html = render('empty'); expect(html).toContain('No closed weekly result yet');
    expect(html).toContain('current week is still open'); expect(html).not.toContain('Gold medal');
  });
  it('preserves supplied joint gold and bronze rank gap without reranking', () => {
    const html = render('ties');
    expect(html.match(/Rank 1/g)).toHaveLength(2); expect(html).toContain('Rank 3');
    expect(html).not.toContain('Rank 2'); expect(html.match(/Shared place/g)).toHaveLength(2);
    expect(html.match(/Gold medal/g)).toHaveLength(2); expect(html).toContain('Bronze medal');
    expect(html).toContain('Mira before rename'); expect(html).toContain('2026-09-28');
  });
  it('preserves omission survivor rank/medal and explains the missing entries', () => {
    const html = render('omitted', 'c'); expect(html).toContain('Rank 3');
    expect(html).toContain('Bronze medal'); expect(html).not.toContain('Gold medal');
    expect(html).toContain('Deleted profiles are omitted');
  });
  it('renders an omission-emptied archive honestly', () => {
    expect(render('deleted')).toContain('All entries in this closed result belonged to deleted profiles');
  });
  it('an absent selected explorer keeps their world, without an invented result', () => {
    const html = render('ties', 'absent'); expect(html).toContain('no displayed entry');
    expect(html).toContain('saved creative choices and completed adventures stay available');
    expect(html).not.toContain('Most Improved'); expect(html).not.toContain('Maths Champion');
  });
  it('does not mutate immutable supplied facts or invoke either action while rendering', () => {
    const result = structuredClone(FESTIVAL_FIXTURES.ties)!;
    result.entries.forEach(Object.freeze); Object.freeze(result.entries); Object.freeze(result);
    const before = JSON.stringify(result); let calls = 0;
    renderToStaticMarkup(<FestivalView result={result} selectedProfileId="a" onSkip={() => { calls++; }} onOpenHall={() => { calls++; }} />);
    expect(JSON.stringify(result)).toBe(before); expect(calls).toBe(0);
  });
});
