import { useId, useState, useSyncExternalStore } from 'react';
import type { AudioController } from './controller';
import './controls.css';

export function StopReading({ controller }: { controller: AudioController }) {
  const status = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  return status.speaking ? <button className="audio-stop" type="button" onClick={controller.stopReading}>Stop reading</button> : null;
}

/** Mount once in the persistent shell, outside activity overlays. The parent
 * owns placement; no focus trap or modal hides the immediate stop actions. */
export function AudioControls({ controller }: { controller: AudioController }) {
  const status = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const [open, setOpen] = useState(false);
  const id = useId();
  const prefs = status.preferences;
  const pending = status.persistence?.pending;
  const failed = status.persistenceError || status.persistence?.failed;
  return <aside className="audio-controls" aria-label="Sound controls">
    <div className="audio-toolbar">
      <button className="audio-sound" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span aria-hidden="true">♫</span> Sound
        <span className="audio-badge">{failed ? 'Not saved' : prefs.silenceAll || !prefs.soundEnabled ? 'Silent' : 'Settings'}</span>
      </button>
      <button className="audio-silence" type="button" onClick={controller.silenceAll}>Silence all</button>
      <StopReading controller={controller} />
    </div>
    <section className="audio-panel" id={id} hidden={!open} aria-label="Music, effects and reading">
      <div className="audio-heading"><span className="audio-medallion" aria-hidden="true">♫</span><div>
        <h2>Your adventure, your sound</h2><p>Choose a comfortable volume.</p>
      </div></div>
      <div className="audio-notice" role="status">
        {status.loadStatus === 'loading' ? 'Loading your sound settings. Everything stays quiet.'
          : status.loadStatus === 'read-failed' ? 'Sound settings could not be loaded. Everything stays quiet.'
          : prefs.silenceAll ? 'Silence all is on. Music, effects and reading are stopped.'
          : !prefs.soundEnabled ? 'Your adventure starts quietly. Enable sound when you are ready.'
          : status.activation === 'blocked' ? 'Your browser paused sound. Use Retry sound to try again.'
          : status.activation === 'unavailable' ? 'Sound is unavailable in this browser. You can still play.'
          : status.activation === 'inactive' ? 'Sound is waiting for your permission in this visit.'
          : 'Your sound choices are active.'}
      </div>
      {status.loadStatus === 'loaded' && <div className="audio-actions">
        {!prefs.soundEnabled && <button className="audio-primary" type="button" onClick={() => { void controller.enableSoundFromGesture(); }}>Enable sound</button>}
        {prefs.silenceAll && prefs.soundEnabled && <button className="audio-primary" type="button" onClick={() => { void controller.exitSilenceAllFromGesture(); }}>Exit Silence all</button>}
        {prefs.soundEnabled && !prefs.silenceAll && status.activation !== 'ready' && status.activation !== 'unavailable'
          && <button className="audio-primary" type="button" onClick={() => { void controller.enableSoundFromGesture(); }}>Retry sound</button>}
      </div>}
      <div className="audio-channels">{(['music', 'effects'] as const).map(channel => {
        const label = channel === 'music' ? 'Music' : 'Effects', settings = prefs[channel], percent = Math.round(settings.volume * 100);
        return <fieldset key={channel}>
          <legend>{label}</legend>
          <button type="button" role="switch" aria-checked={!settings.muted} aria-label={label}
            onClick={() => controller.setChannelMuted(channel, !settings.muted)}>
            <span className="audio-switch-track" aria-hidden="true"><span /></span>{settings.muted ? 'Off' : 'On'}
          </button>
          <label htmlFor={`${id}-${channel}`}>{label} volume <output>{percent}%</output></label>
          <input id={`${id}-${channel}`} aria-label={`${label} volume`} type="range" min="0" max="100" step="1"
            aria-valuetext={`${percent} percent${percent === 0 ? ', silent' : ''}`} value={percent}
            onChange={event => controller.setChannelVolume(channel, Number(event.target.value) / 100)} />
          <p className="audio-channel-note">{settings.muted ? 'Off — your volume is remembered.' : percent === 0 ? 'Zero volume is silent.' : channel === 'music' ? 'Gentle music as you explore.' : 'Little sounds for your discoveries.'}</p>
        </fieldset>;
      })}</div>
      <p className="audio-reading">{status.localVoiceAvailable ? 'Read aloud uses an available English voice on this device. Each reading starts only when you ask.'
        : 'Read aloud is unavailable: no local English voice was found. All instructions remain on screen.'}</p>
      <p className={`audio-saving${failed ? ' audio-warning' : ''}`} role="status">{failed
        ? 'Your choices apply now, but saving is uncertain. They may not be remembered after you leave.'
        : pending ? 'Saving sound choices…' : status.persistence && status.loadStatus === 'loaded' ? 'Sound choices saved on this device.' : 'Sound choices have not loaded yet.'}</p>
      {status.mediaError && <p role="status" className="audio-warning">Some sounds could not load. You can keep playing.</p>}
      <button type="button" onClick={() => { setOpen(false); document.getElementById(id)?.parentElement?.querySelector<HTMLButtonElement>('.audio-sound')?.focus(); }}>Close sound settings</button>
    </section>
  </aside>;
}
