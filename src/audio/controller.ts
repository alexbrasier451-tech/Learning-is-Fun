import { AUDIO_ASSETS } from './catalogue';
import type { AudioPreferenceIntent } from './contracts';
import { createSpeechAdapter } from './speech';
import type { ReadTextRequest, SpeechAdapter } from './speech';
import { INITIAL_AUDIO_PREFERENCES } from '../state/contracts';
import type { InstallationAudioPreferences, PreferenceStatus } from '../state/contracts';

export type AudioChannel = 'music' | 'effects';
export type SceneTheme = 'village' | 'library';
export type EffectCue = Exclude<keyof typeof AUDIO_ASSETS, SceneTheme>;
export type AudioStatus = Readonly<{
  preferences: InstallationAudioPreferences;
  loadStatus: PreferenceStatus['loadStatus'];
  activation: 'inactive' | 'ready' | 'blocked' | 'unavailable';
  persistence: PreferenceStatus | null;
  speaking: boolean; localVoiceAvailable: boolean; voiceName: string | null;
  visible: boolean; mediaError: boolean; persistenceError: boolean;
}>;
export type AudioController = Readonly<{
  getSnapshot(): AudioStatus; subscribe(listener: () => void): () => void;
  applyLiveIntent(intent: AudioPreferenceIntent): void;
  applyPreferenceState(status: PreferenceStatus): void;
  enableSoundFromGesture(): Promise<void>; exitSilenceAllFromGesture(): Promise<void>;
  setChannelMuted(channel: AudioChannel, muted: boolean): void;
  setChannelVolume(channel: AudioChannel, volume: number): void;
  silenceAll(): void; setSceneTheme(theme: SceneTheme | null): void;
  playEffect(cue: EffectCue): void; readText(request: ReadTextRequest): boolean;
  stopReading(): void; setVisible(visible: boolean): void; dispose(): void;
}>;
export type AudioControllerOptions = Readonly<{
  assetResolver(path: string): string;
  persistPreferences(intent: AudioPreferenceIntent): void;
  speechAdapter?: SpeechAdapter;
  /** Test/media boundary. Production defaults use one native Web Audio graph. */
  createContext?: () => AudioContext;
  fetchAsset?: (url: string) => Promise<ArrayBuffer>;
}>;
type Track = { theme: SceneTheme; source: AudioBufferSourceNode; gain: GainNode; timer?: ReturnType<typeof setTimeout> };
type Effect = { source?: AudioBufferSourceNode };
type Leaf = 'soundEnabled' | 'silenceAll' | 'music.muted' | 'music.volume' | 'effects.muted' | 'effects.volume';
const copy = (p: InstallationAudioPreferences): InstallationAudioPreferences => Object.freeze({
  ...p, music: Object.freeze({ ...p.music }), effects: Object.freeze({ ...p.effects }),
});
const value = (p: InstallationAudioPreferences, leaf: Leaf): boolean | number => {
  if (leaf === 'soundEnabled' || leaf === 'silenceAll') return p[leaf];
  const [channel, key] = leaf.split('.') as [AudioChannel, 'muted' | 'volume']; return p[channel][key];
};
const withLeaf = (p: InstallationAudioPreferences, leaf: Leaf, v: boolean | number): InstallationAudioPreferences => {
  if (leaf === 'soundEnabled' || leaf === 'silenceAll') return copy({ ...p, [leaf]: v });
  const [channel, key] = leaf.split('.') as [AudioChannel, 'muted' | 'volume'];
  return copy({ ...p, [channel]: { ...p[channel], [key]: v } });
};

export function createAudioController(options: AudioControllerOptions): AudioController {
  const speech = options.speechAdapter ?? createSpeechAdapter();
  const listeners = new Set<() => void>();
  // A synchronous bridge until WP04 publishes the matching requested value.
  // This is NOT a save queue: no commands, acknowledgements or retries live here.
  const liveFields = new Map<Leaf, boolean | number>();
  let preferences = copy(INITIAL_AUDIO_PREFERENCES), loadStatus: AudioStatus['loadStatus'] = 'loading';
  let persistence: PreferenceStatus | null = null, persistenceError = false, mediaError = false;
  let activation: AudioStatus['activation'] = 'inactive';
  let visible = true, disposed = false, latch = false;
  let context: AudioContext | null = null, master: GainNode | null = null, music: GainNode | null = null, effects: GainNode | null = null;
  let theme: SceneTheme | null = null, musicGeneration = 0, effectGeneration = 0, activationGeneration = 0;
  let pendingTheme: SceneTheme | null = null;
  const tracks: Track[] = [], voices: Effect[] = [];
  const buffers = new Map<keyof typeof AUDIO_ASSETS, AudioBuffer>();
  const loading = new Map<keyof typeof AUDIO_ASSETS, Promise<AudioBuffer>>();
  let snapshot: AudioStatus;
  const policy = () => !disposed && visible && loadStatus === 'loaded' && preferences.soundEnabled && !preferences.silenceAll;
  const permitted = (channel: AudioChannel) => policy() && activation === 'ready' && context?.state === 'running'
    && !preferences[channel].muted && preferences[channel].volume > 0;
  function publish() {
    snapshot = Object.freeze({ preferences, loadStatus, activation, persistence, visible, mediaError, persistenceError, ...speech.getSnapshot() });
    if (!disposed) for (const listener of listeners) { try { listener(); } catch { /* UI cannot defeat the live gate. */ } }
  }
  function gain(node: GainNode | null, level: number) {
    if (!node || !context) return;
    node.gain.cancelScheduledValues(context.currentTime);
    node.gain.setValueAtTime(level, context.currentTime);
  }
  function mix() {
    gain(master, policy() && activation === 'ready' && context?.state === 'running' ? 1 : 0);
    gain(music, permitted('music') ? preferences.music.volume * (speech.getSnapshot().speaking ? .3 : 1) : 0);
    gain(effects, permitted('effects') ? preferences.effects.volume : 0);
  }
  function stopSource(source?: AudioBufferSourceNode) {
    if (!source) return; source.onended = null;
    try { source.stop(); } catch { /* Single-use source may already have ended. */ }
    source.disconnect();
  }
  function removeTrack(track: Track) {
    clearTimeout(track.timer); gain(track.gain, 0); stopSource(track.source); track.gain.disconnect();
    const index = tracks.indexOf(track); if (index >= 0) tracks.splice(index, 1);
    if (track.theme !== theme && !tracks.some(t => t.theme === track.theme)) buffers.delete(track.theme);
  }
  function stopMusic() { musicGeneration++; pendingTheme = null; tracks.slice().forEach(removeTrack); }
  function stopEffects() { effectGeneration++; voices.splice(0).forEach(v => stopSource(v.source)); }
  function cancelSpeech() { speech.cancel(); }
  function reconcile() {
    mix();
    if (!policy()) { activationGeneration++; stopMusic(); stopEffects(); cancelSpeech(); }
    else {
      if (!permitted('music')) stopMusic();
      if (!permitted('effects')) stopEffects();
      if (permitted('music')) void startMusic();
    }
  }
  async function buffer(id: keyof typeof AUDIO_ASSETS): Promise<AudioBuffer> {
    const cached = buffers.get(id); if (cached) return cached;
    const inFlight = loading.get(id); if (inFlight) return inFlight;
    const ctx = context!;
    const request = (async () => {
      const url = options.assetResolver(AUDIO_ASSETS[id].path);
      const bytes = await (options.fetchAsset ? options.fetchAsset(url) : fetch(url).then(response => {
        if (!response.ok) throw new Error('Audio asset unavailable.'); return response.arrayBuffer();
      }));
      return ctx.decodeAudioData(bytes);
    })();
    loading.set(id, request);
    try {
      const decoded = await request;
      if (!disposed && (AUDIO_ASSETS[id].kind === 'effect' || id === theme || tracks.some(t => t.theme === id))) buffers.set(id, decoded);
      return decoded;
    } finally { if (loading.get(id) === request) loading.delete(id); }
  }
  async function startMusic() {
    if (!theme || !permitted('music') || pendingTheme === theme || tracks.some(t => t.theme === theme && !t.timer)) return;
    const selected = theme, generation = ++musicGeneration;
    pendingTheme = selected;
    try {
      const decoded = await buffer(selected);
      if (disposed || generation !== musicGeneration || selected !== theme || !permitted('music')) return;
      // Rapid navigation removes older fading voices before admitting a new one.
      while (tracks.length > 1) removeTrack(tracks[0]);
      const ctx = context!, source = ctx.createBufferSource(), trackGain = ctx.createGain();
      source.buffer = decoded; source.loop = true;
      source.loopStart = AUDIO_ASSETS[selected].loopStartFrame / AUDIO_ASSETS[selected].sampleRate;
      source.loopEnd = AUDIO_ASSETS[selected].loopEndFrame / AUDIO_ASSETS[selected].sampleRate;
      source.connect(trackGain); trackGain.connect(music!);
      const previous = tracks[0], track: Track = { theme: selected, source, gain: trackGain };
      gain(trackGain, previous ? 0 : 1); tracks.push(track);
      source.start();
      if (previous) {
        gain(previous.gain, previous.gain.gain.value);
        previous.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + .25);
        trackGain.gain.linearRampToValueAtTime(1, ctx.currentTime + .25);
        previous.timer = setTimeout(() => { if (tracks.includes(previous)) removeTrack(previous); }, 280);
      }
      mediaError = false; publish();
    } catch { if (!disposed && generation === musicGeneration && permitted('music')) { mediaError = true; publish(); } }
    finally { if (generation === musicGeneration) pendingTheme = null; }
  }
  function ensureContext(): boolean {
    if (context) return context.state !== 'closed';
    try {
      context = options.createContext ? options.createContext() : new AudioContext();
      master = context.createGain(); music = context.createGain(); effects = context.createGain();
      gain(master, 0); gain(music, 0); gain(effects, 0);
      music.connect(master); effects.connect(master); master.connect(context.destination);
      context.onstatechange = () => {
        if (!disposed && activation === 'ready' && context?.state !== 'running') {
          activation = 'blocked'; activationGeneration++; stopMusic(); stopEffects(); cancelSpeech(); mix(); publish();
        }
      };
      return true;
    } catch { activation = 'unavailable'; publish(); return false; }
  }
  async function activate() {
    if (!policy() || !ensureContext()) return;
    const generation = ++activationGeneration;
    try {
      await context!.resume();
      if (disposed || generation !== activationGeneration || !policy()) return;
      activation = context!.state === 'running' ? 'ready' : 'blocked';
      reconcile(); publish();
    } catch { if (!disposed && generation === activationGeneration) { activation = 'blocked'; reconcile(); publish(); } }
  }
  function applyLiveIntent(intent: AudioPreferenceIntent) {
    if (disposed) return;
    let leaf: Leaf, next: boolean | number;
    switch (intent.kind) {
      case 'enable': if (loadStatus !== 'loaded') return; leaf = 'soundEnabled'; next = true; break;
      case 'exit-silence': if (loadStatus !== 'loaded' || !preferences.soundEnabled) return; leaf = 'silenceAll'; next = false; latch = false; break;
      case 'silence-all': leaf = 'silenceAll'; next = true; latch = true; break;
      case 'channel-mute':
        if (!['music', 'effects'].includes(intent.channel) || typeof intent.muted !== 'boolean') throw new TypeError('Invalid channel mute.');
        leaf = `${intent.channel}.muted`; next = intent.muted; break;
      case 'channel-volume':
        if (!['music', 'effects'].includes(intent.channel) || !Number.isFinite(intent.volume) || intent.volume < 0 || intent.volume > 1) throw new RangeError('Volume must be between 0 and 1.');
        leaf = `${intent.channel}.volume`; next = intent.volume; break;
    }
    liveFields.set(leaf, next); preferences = withLeaf(preferences, leaf, next);
    reconcile(); publish();
  }
  function request(intent: AudioPreferenceIntent) {
    if (disposed) return;
    // Immediate safety even if the persistence port throws; its gate echo is
    // idempotent and cannot call persistence recursively.
    applyLiveIntent(intent);
    try { options.persistPreferences(intent); }
    catch { persistenceError = true; publish(); }
  }
  const unsubscribeSpeech = speech.subscribe(() => { if (!disposed) { mix(); publish(); } });
  publish();
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { if (disposed) return () => {}; listeners.add(listener); return () => { listeners.delete(listener); }; },
    applyLiveIntent,
    applyPreferenceState(status) {
      if (disposed || (persistence && (status.generation < persistence.generation
        || status.generation === persistence.generation && status.savedGeneration < persistence.savedGeneration))) return;
      persistence = status; loadStatus = status.loadStatus;
      let next = copy(status.requestedAudio);
      for (const [leaf, desired] of liveFields) {
        if (value(next, leaf) === desired) liveFields.delete(leaf);
        else next = withLeaf(next, leaf, desired);
      }
      // A clean save of another field is not evidence that a throwing port
      // handed off every live request. Clear uncertainty only once the bridge
      // is represented in producer state (including an explicit supersession).
      if (liveFields.size === 0) persistenceError = false;
      latch ||= next.silenceAll || loadStatus === 'read-failed';
      preferences = copy({ ...next, silenceAll: latch });
      reconcile(); publish();
    },
    async enableSoundFromGesture() { request({ kind: 'enable' }); await activate(); },
    async exitSilenceAllFromGesture() { request({ kind: 'exit-silence' }); await activate(); },
    setChannelMuted(channel, muted) { request({ kind: 'channel-mute', channel, muted }); },
    setChannelVolume(channel, volume) { request({ kind: 'channel-volume', channel, volume }); },
    silenceAll() { request({ kind: 'silence-all' }); },
    setSceneTheme(next) {
      if (disposed) return;
      if (next !== null && next !== 'village' && next !== 'library') throw new TypeError('Unknown scene theme.');
      stopEffects(); cancelSpeech();
      if (next !== theme) { musicGeneration++; pendingTheme = null; theme = next; }
      if (next === null) stopMusic();
      reconcile(); publish();
    },
    playEffect(cue) {
      if (!permitted('effects') || !Object.hasOwn(AUDIO_ASSETS, cue) || AUDIO_ASSETS[cue].kind !== 'effect') return;
      const generation = effectGeneration, voice: Effect = {};
      if (voices.length === 4) stopSource(voices.shift()!.source);
      voices.push(voice);
      void buffer(cue).then(decoded => {
        if (disposed || generation !== effectGeneration || !voices.includes(voice) || !permitted('effects')) return;
        const source = context!.createBufferSource(); voice.source = source;
        source.buffer = decoded; source.connect(effects!);
        source.onended = () => { const index = voices.indexOf(voice); if (index >= 0) voices.splice(index, 1); source.disconnect(); };
        source.start();
      }).catch(() => {
        const index = voices.indexOf(voice); if (index >= 0) voices.splice(index, 1);
        if (!disposed && generation === effectGeneration && permitted('effects')) { mediaError = true; publish(); }
      });
    },
    readText(request) { return policy() && activation === 'ready' && context?.state === 'running' ? speech.speak(request) : false; },
    stopReading() { if (!disposed) cancelSpeech(); },
    setVisible(next) { if (disposed || visible === next) return; visible = next; reconcile(); publish(); },
    dispose() {
      if (disposed) return;
      disposed = true; activationGeneration++; mix(); stopMusic(); stopEffects();
      unsubscribeSpeech(); speech.dispose(); listeners.clear(); buffers.clear(); loading.clear(); liveFields.clear();
      if (context) { context.onstatechange = null; void context.close().catch(() => {}); }
      publish();
    },
  };
}
