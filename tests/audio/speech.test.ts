import { describe, expect, it, vi } from 'vitest';
import { createSpeechAdapter } from '../../src/audio/speech';
import type { ReadTextRequest } from '../../src/audio/speech';

const request: ReadTextRequest = { requestId: 'visible-1', text: 'Explore the village.', role: 'instruction', language: 'en' };
const voice = (lang: string, localService: boolean, name = lang) => ({ lang, localService, name } as SpeechSynthesisVoice);
function host(initial: SpeechSynthesisVoice[] = []) {
  let voices = initial;
  const events = new Map<string, () => void>(), utterances: SpeechSynthesisUtterance[] = [];
  const synthesis = { getVoices: () => voices, cancel: vi.fn(), speak: vi.fn((u: SpeechSynthesisUtterance) => utterances.push(u)),
    addEventListener: (key: string, fn: () => void) => events.set(key, fn), removeEventListener: (key: string) => events.delete(key) };
  const adapter = createSpeechAdapter({ synthesis: synthesis as unknown as SpeechSynthesis,
    createUtterance: text => ({ text } as SpeechSynthesisUtterance) });
  return { adapter, synthesis, utterances, events, voices(next: SpeechSynthesisVoice[]) { voices = next; events.get('voiceschanged')?.(); } };
}
describe('local English speech owner', () => {
  it('uses only an actual local English voice and keeps the supplied classification/text', () => {
    const h = host([voice('en-US', false, 'remote'), voice('fr-FR', true), voice('en-GB', true, 'local')]);
    expect(h.adapter.speak({ ...request, role: 'assessed-text' })).toBe(true);
    expect(h.utterances[0].voice?.name).toBe('local');
    expect(h.utterances[0].text).toBe(request.text);
    expect(h.adapter.getSnapshot()).toEqual({ speaking: true, localVoiceAvailable: true, voiceName: 'local' });
    h.adapter.dispose();
  });
  it('reports text fallback for remote-only/non-English/absent speech', () => {
    for (const voices of [[], [voice('en-US', false)], [voice('de-DE', true)], [voice('english', true)]]) {
      const h = host(voices); expect(h.adapter.speak(request)).toBe(false); expect(h.synthesis.speak).not.toHaveBeenCalled(); h.adapter.dispose();
    }
    const absent = createSpeechAdapter({ synthesis: null }); expect(absent.speak(request)).toBe(false); absent.dispose();
  });
  it('handles late voices, then cancels when the only suitable voice disappears', () => {
    const h = host(); h.voices([voice('EN_gb', true)]);
    expect(h.adapter.getSnapshot().localVoiceAvailable).toBe(true); h.adapter.speak(request);
    h.voices([voice('en-GB', false)]);
    expect(h.adapter.getSnapshot().speaking).toBe(false); expect(h.synthesis.cancel).toHaveBeenCalled();
    h.adapter.dispose(); expect(h.events.size).toBe(0);
  });
  it('cancels previous utterances and ignores captured stale end/error callbacks', () => {
    const h = host([voice('en-GB', true)]); h.adapter.speak(request);
    const oldEnd = h.utterances[0].onend!, oldError = h.utterances[0].onerror!;
    h.adapter.speak({ ...request, requestId: 'second' });
    oldEnd.call(h.utterances[0], {} as SpeechSynthesisEvent); oldError.call(h.utterances[0], {} as SpeechSynthesisErrorEvent);
    expect(h.adapter.getSnapshot().speaking).toBe(true);
    const latestEnd = h.utterances[1].onend!;
    h.adapter.cancel(); latestEnd.call(h.utterances[1], {} as SpeechSynthesisEvent);
    expect(h.adapter.getSnapshot().speaking).toBe(false);
    expect(h.utterances).toHaveLength(2); h.adapter.dispose();
  });
  it('a reentrant Stop during publication prevents the utterance from reaching synthesis', () => {
    const h = host([voice('en-US', true)]);
    h.adapter.subscribe(() => { if (h.adapter.getSnapshot().speaking) h.adapter.cancel(); });
    expect(h.adapter.speak(request)).toBe(false); expect(h.synthesis.speak).not.toHaveBeenCalled(); h.adapter.dispose();
  });
  it('a newer explicit reading during initial cancellation supersedes the outer replacement', () => {
    const h = host([voice('en-GB', true)]); h.adapter.speak(request);
    let replaced = false;
    h.adapter.subscribe(() => {
      if (!replaced && !h.adapter.getSnapshot().speaking) {
        replaced = true;
        h.adapter.speak({ ...request, requestId: 'newer', text: 'Newer authorized text.' });
      }
    });
    expect(h.adapter.speak({ ...request, requestId: 'outer', text: 'Superseded text.' })).toBe(false);
    expect(h.utterances.map(u => u.text)).toEqual([request.text, 'Newer authorized text.']);
    expect(h.adapter.getSnapshot().speaking).toBe(true); h.adapter.dispose();
  });
  it('handles a speech failure and refuses all new speech after disposal', () => {
    const h = host([voice('en', true)]); h.synthesis.speak.mockImplementation(() => { throw new Error('platform denial'); });
    expect(h.adapter.speak(request)).toBe(false); expect(h.adapter.getSnapshot().speaking).toBe(false);
    h.adapter.dispose(); expect(h.adapter.speak(request)).toBe(false);
  });
});
