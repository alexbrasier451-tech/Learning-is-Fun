/** Callers supply only visible, policy-approved text. Assessed text and answer
 * help must have their required assistance committed before this port is used. */
export type ReadTextRequest = Readonly<{
  requestId: string; text: string; role: 'instruction' | 'assessed-text' | 'answer-help'; language: 'en';
}>;
export type SpeechStatus = Readonly<{ speaking: boolean; localVoiceAvailable: boolean; voiceName: string | null }>;
export type SpeechAdapter = Readonly<{
  getSnapshot(): SpeechStatus;
  subscribe(listener: () => void): () => void;
  speak(request: ReadTextRequest): boolean;
  cancel(): void;
  dispose(): void;
}>;
export type SpeechOptions = Readonly<{
  synthesis?: SpeechSynthesis | null;
  createUtterance?: (text: string) => SpeechSynthesisUtterance;
}>;

/** One utterance, no queue. localService is browser feature detection, not a
 * platform-wide guarantee about network behaviour. Never select a remote voice. */
export function createSpeechAdapter(options: SpeechOptions = {}): SpeechAdapter {
  const synthesis = options.synthesis === undefined
    ? (typeof window === 'undefined' ? null : window.speechSynthesis ?? null) : options.synthesis;
  const make = options.createUtterance ?? (text => new SpeechSynthesisUtterance(text));
  const listeners = new Set<() => void>();
  let disposed = false, token = 0, active: SpeechSynthesisUtterance | null = null;
  let snapshot: SpeechStatus = Object.freeze({ speaking: false, localVoiceAvailable: false, voiceName: null });
  function voice(): SpeechSynthesisVoice | undefined {
    try { return synthesis?.getVoices().find(v => v.localService === true && /^en(?:[-_]|$)/i.test(v.lang)); }
    catch { return undefined; }
  }
  function publish(speaking: boolean) {
    const selected = voice();
    snapshot = Object.freeze({ speaking, localVoiceAvailable: !!selected, voiceName: selected?.name ?? null });
    for (const listener of listeners) { try { listener(); } catch { /* Observers cannot interrupt cancellation. */ } }
  }
  function cancel() {
    const cancelled = ++token;
    if (active) { active.onend = null; active.onerror = null; active.onstart = null; active = null; }
    try { synthesis?.cancel(); } finally { publish(false); }
    return cancelled;
  }
  const voicesChanged = () => {
    if (!disposed) {
      if (active && (!voice() || active.voice?.localService !== true || !/^en(?:[-_]|$)/i.test(active.voice.lang))) cancel();
      else publish(snapshot.speaking);
    }
  };
  synthesis?.addEventListener('voiceschanged', voicesChanged);
  publish(false);
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { if (disposed) return () => {}; listeners.add(listener); return () => { listeners.delete(listener); }; },
    speak(request) {
      if (disposed) return false;
      // Capture this cancellation's identity BEFORE it publishes. A nested
      // Stop/Silence/hide/route cancellation must invalidate the replacement,
      // including when it arrives during the first speaking=false notification.
      const current = cancel();
      if (disposed || token !== current) return false;
      if (!synthesis || request.language !== 'en' || !request.requestId || !request.text.trim()
        || !['instruction', 'assessed-text', 'answer-help'].includes(request.role)) return false;
      const selected = voice();
      if (!selected) { publish(false); return false; }
      try {
        const utterance = make(request.text);
        utterance.voice = selected; utterance.lang = selected.lang;
        active = utterance;
        const finish = () => { if (!disposed && token === current && active === utterance) { active = null; publish(false); } };
        utterance.onend = finish; utterance.onerror = finish;
        publish(true);
        // A subscriber can synchronously stop reading during publication.
        if (disposed || token !== current || active !== utterance) return false;
        synthesis.speak(utterance);
        return true;
      } catch { if (current === token) cancel(); return false; }
    },
    cancel,
    dispose() { if (disposed) return; disposed = true; synthesis?.removeEventListener('voiceschanged', voicesChanged); try { cancel(); } finally { listeners.clear(); } },
  };
}
