import type { AudioController } from '../audio/controller';

export function attachLifecycle(audio: AudioController) {
  let paused = false, disposed = false, leaving = false;
  const apply = () => { if (!disposed) audio.setVisible(!paused && !leaving && document.visibilityState !== 'hidden'); };
  const hide = () => { leaving = true; apply(); };
  const show = () => { leaving = false; apply(); };
  document.addEventListener('visibilitychange', apply);
  window.addEventListener('pagehide', hide);
  window.addEventListener('pageshow', show);
  apply();
  return { setPaused(next: boolean) { paused = next; apply(); }, dispose() {
    if (disposed) return; disposed = true;
    document.removeEventListener('visibilitychange', apply);
    window.removeEventListener('pagehide', hide);
    window.removeEventListener('pageshow', show);
  } };
}
