import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createAudioController } from '../../src/audio/controller';
import { createSpeechAdapter } from '../../src/audio/speech';
import { AUDIO_ASSETS } from '../../src/audio/catalogue';
import { INITIAL_AUDIO_PREFERENCES } from '../../src/state/contracts';
import type { InstallationAudioPreferences, PreferenceStatus, CommittedSnapshot } from '../../src/state/contracts';
import { createPreferenceController } from '../../src/state/preferences';
import { createInitialSave } from '../../src/state/transition';

const tick = async () => { for (let n = 0; n < 12; n++) await Promise.resolve(); };
const deferred = <T,>() => { let resolve!: (v: T) => void, reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
class Parameter {
  value = 0; events: Array<[string, number]> = [];
  cancelScheduledValues() { this.events.push(['cancel', this.value]); }
  setValueAtTime(value: number) { this.value = value; this.events.push(['set', value]); }
  linearRampToValueAtTime(value: number) { this.value = value; this.events.push(['ramp', value]); }
}
class Gain { gain = new Parameter(); connect = vi.fn(); disconnect = vi.fn(); }
class Source {
  buffer: AudioBuffer | null = null; loop = false; loopStart = 0; loopEnd = 0; onended: (() => void) | null = null;
  started = false; stopped = false; connect = vi.fn(); disconnect = vi.fn();
  start() { this.started = true; } stop() { this.stopped = true; }
}
class Context {
  currentTime = 0; state: AudioContextState = 'suspended'; destination = {}; onstatechange: (() => void) | null = null;
  gains: Gain[] = []; sources: Source[] = [];
  resume = vi.fn(async () => { this.state = 'running'; });
  close = vi.fn(async () => { this.state = 'closed'; });
  decodeAudioData = vi.fn(async (_bytes: ArrayBuffer) => ({ duration: 70 } as AudioBuffer));
  createGain() { const g = new Gain(); this.gains.push(g); return g; }
  createBufferSource() { const s = new Source(); this.sources.push(s); return s; }
}
function status(audio: InstallationAudioPreferences = INITIAL_AUDIO_PREFERENCES, generation = 0, other: Partial<PreferenceStatus> = {}): PreferenceStatus {
  return { requestedAudio: audio, requestedProfileById: {}, generation, savedGeneration: generation, loadStatus: 'loaded', pending: false, failed: false, ...other };
}
function setup() {
  const ctx = new Context(), utterances: SpeechSynthesisUtterance[] = [];
  const synth = { getVoices: () => [{ name: 'English local fake', lang: 'en-GB', localService: true }], cancel: vi.fn(),
    speak: (u: SpeechSynthesisUtterance) => utterances.push(u), addEventListener() {}, removeEventListener() {} };
  const speech = createSpeechAdapter({ synthesis: synth as unknown as SpeechSynthesis, createUtterance: text => ({ text } as SpeechSynthesisUtterance) });
  const persist = vi.fn(), createContext = vi.fn(() => ctx as unknown as AudioContext), fetchAsset = vi.fn(async (_url: string) => new ArrayBuffer(8));
  const controller = createAudioController({ assetResolver: path => `/playtest/${path}`, persistPreferences: persist, speechAdapter: speech, createContext, fetchAsset });
  const active = () => ctx.sources.filter(s => s.started && !s.stopped);
  return { controller, ctx, speech, synth, utterances, persist, createContext, fetchAsset, active };
}
const reading = { requestId: 'instructions', text: 'Choose a bridge plank.', role: 'instruction', language: 'en' } as const;
async function enabled(h: ReturnType<typeof setup>) { h.controller.applyPreferenceState(status()); await h.controller.enableSoundFromGesture(); }

describe('single audio controller gates and races', () => {
  it.each(['silence', 'stop', 'hide', 'route', 'dispose'] as const)('replacement initial cancellation respects reentrant %s through the full speech path', async action => {
    const h = setup(); await enabled(h); h.controller.setSceneTheme('village'); await tick();
    expect(h.controller.readText(reading)).toBe(true);
    const staleEnd = h.utterances[0].onend!;
    let stopped = false;
    const unsub = h.controller.subscribe(() => {
      if (stopped || h.controller.getSnapshot().speaking) return;
      stopped = true;
      if (action === 'silence') h.controller.silenceAll();
      if (action === 'stop') h.controller.stopReading();
      if (action === 'hide') h.controller.setVisible(false);
      if (action === 'route') h.controller.setSceneTheme(null);
      if (action === 'dispose') h.controller.dispose();
    });
    const replacement = h.controller.readText({ ...reading, requestId: 'replacement' });
    staleEnd.call(h.utterances[0], {} as SpeechSynthesisEvent); await tick();
    expect({ replacement, utterances: h.utterances.length, speaking: h.controller.getSnapshot().speaking })
      .toEqual({ replacement: false, utterances: 1, speaking: false });
    if (action === 'silence' || action === 'hide' || action === 'dispose') expect(h.ctx.gains[0].gain.value).toBe(0);
    unsub(); h.controller.dispose();
  });
  it.each(['repeat-silence', 'explicit-exit'] as const)('failed silence handoff stays uncertain after unrelated full save, then recovers by %s', async recovery => {
    const h = setup();
    let committed: CommittedSnapshot = { token: { epoch: 'handoff', revision: 0 }, save: createInitialSave() };
    const preferences = createPreferenceController({ initialCommitted: committed, applyLivePreferences: h.controller.applyLiveIntent,
      broadcastSilence() {}, async enqueue(command) {
        if (command.kind !== 'SetAudioPreferences') throw new Error('Unexpected fixture command');
        const patch = command.payload.patch, old = committed.save.installation.audio;
        committed = { token: { epoch: 'handoff', revision: committed.token.revision + 1 }, save: { ...committed.save,
          installation: { ...committed.save.installation, audio: { ...old, ...patch, music: { ...old.music, ...patch.music }, effects: { ...old.effects, ...patch.effects } } } } };
        return { status: 'committed', snapshot: committed, changes: { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0, newReceiptKeys: [], newEntitlementIds: [] }, unlockedIds: [], restorationIds: [], closedWeekIds: [] } };
      } });
    h.persist.mockImplementation(preferences.setAudioPreferences);
    const unsub = preferences.subscribe(() => h.controller.applyPreferenceState(preferences.getStatus()));
    h.controller.applyPreferenceState(preferences.getStatus()); await h.controller.enableSoundFromGesture(); await preferences.flush();
    h.persist.mockImplementationOnce(() => { throw new Error('handoff fails before helper'); });
    h.controller.silenceAll(); expect(h.controller.getSnapshot().persistenceError).toBe(true);
    h.controller.setChannelVolume('music', .6); await preferences.flush();
    expect({ live: h.controller.getSnapshot().preferences.silenceAll, saved: committed.save.installation.audio.silenceAll,
      pending: preferences.getStatus().pending, failed: preferences.getStatus().failed, uncertain: h.controller.getSnapshot().persistenceError })
      .toEqual({ live: true, saved: false, pending: false, failed: false, uncertain: true });
    if (recovery === 'repeat-silence') h.controller.silenceAll(); else await h.controller.exitSilenceAllFromGesture();
    await preferences.flush();
    expect(h.controller.getSnapshot().persistenceError).toBe(false);
    expect(h.controller.getSnapshot().preferences).toEqual(committed.save.installation.audio);
    expect(committed.save.installation.audio.silenceAll).toBe(recovery === 'repeat-silence');
    expect(h.controller.getSnapshot().speaking).toBe(false); unsub(); h.controller.dispose();
  });
  it('first visit/loading/failed reads stay silent, ordinary cues/sliders never activate', async () => {
    const h = setup(); h.controller.setSceneTheme('village'); h.controller.playEffect('pickup');
    h.controller.setChannelVolume('music', .8); await h.controller.enableSoundFromGesture();
    expect(h.createContext).not.toHaveBeenCalled();
    h.controller.applyPreferenceState(status()); h.controller.playEffect('pickup');
    expect(h.controller.readText(reading)).toBe(false); expect(h.createContext).not.toHaveBeenCalled();
    h.controller.applyPreferenceState(status(INITIAL_AUDIO_PREFERENCES, 1, { loadStatus: 'read-failed', failed: true }));
    await h.controller.enableSoundFromGesture(); expect(h.createContext).not.toHaveBeenCalled(); h.controller.dispose();
  });
  it('explicit enable preserves independently remembered channels and creates exactly one graph', async () => {
    const h = setup(); h.controller.applyPreferenceState(status({ ...INITIAL_AUDIO_PREFERENCES, music: { muted: true, volume: .7 }, effects: { muted: false, volume: .2 } }));
    h.controller.setSceneTheme('village'); await h.controller.enableSoundFromGesture(); h.controller.playEffect('pickup'); await tick();
    expect(h.active()).toHaveLength(1); expect(h.active()[0].loop).toBe(false);
    expect(h.ctx.gains[1].gain.value).toBe(0); expect(h.ctx.gains[2].gain.value).toBe(.2);
    h.controller.setChannelMuted('effects', true); h.controller.setChannelMuted('music', false); await tick();
    expect(h.active()).toHaveLength(1); expect(h.active()[0].loop).toBe(true);
    await h.controller.enableSoundFromGesture(); expect(h.createContext).toHaveBeenCalledTimes(1); h.controller.dispose();
  });
  it('zero stops a channel and a slider never changes its mute', async () => {
    const h = setup(); await enabled(h); h.controller.setSceneTheme('village'); h.controller.playEffect('restoration'); await tick();
    h.controller.setChannelVolume('music', 0); expect(h.active().filter(s => s.loop)).toHaveLength(0);
    expect(h.active().filter(s => !s.loop)).toHaveLength(1);
    h.controller.setChannelMuted('music', true); h.controller.setChannelVolume('music', .6); await tick();
    expect(h.ctx.gains[1].gain.value).toBe(0); expect(h.controller.getSnapshot().preferences.music.muted).toBe(true);
    h.controller.setChannelVolume('effects', 0); expect(h.active()).toHaveLength(0); h.controller.dispose();
  });
  it('silences buses/sources/speech before invoking even a throwing persistence port', async () => {
    const h = setup(); await enabled(h); h.controller.setSceneTheme('village'); h.controller.playEffect('restoration'); await tick(); h.controller.readText(reading);
    const oldSpeechEnd = h.utterances[0].onend!;
    h.persist.mockImplementation(() => {
      expect(h.ctx.gains.map(g => g.gain.value)).toEqual(expect.arrayContaining([0]));
      expect(h.ctx.gains[0].gain.value).toBe(0); expect(h.active()).toHaveLength(0);
      expect(h.controller.getSnapshot().speaking).toBe(false); throw new Error('unavailable writer');
    });
    h.controller.silenceAll(); oldSpeechEnd.call(h.utterances[0], {} as SpeechSynthesisEvent);
    expect(h.controller.getSnapshot().persistenceError).toBe(true); expect(h.ctx.gains[0].gain.value).toBe(0);
    h.persist.mockReset(); h.controller.setChannelVolume('music', .8); h.controller.setChannelMuted('effects', true);
    expect(h.controller.readText(reading)).toBe(false); await h.controller.enableSoundFromGesture();
    expect(h.controller.getSnapshot().preferences.silenceAll).toBe(true);
    await h.controller.exitSilenceAllFromGesture(); await tick();
    expect(h.controller.getSnapshot().preferences.music.volume).toBe(.8); expect(h.controller.getSnapshot().preferences.effects.muted).toBe(true);
    expect(h.controller.getSnapshot().speaking).toBe(false); h.controller.dispose();
  });
  it('a late resume after Silence all cannot activate, while an explicit exit can', async () => {
    const h = setup(), resumed = deferred<void>();
    h.controller.applyPreferenceState(status()); h.controller.setSceneTheme('village');
    h.ctx.resume.mockImplementation(async () => { await resumed.promise; h.ctx.state = 'running'; });
    const enable = h.controller.enableSoundFromGesture(); h.controller.silenceAll(); resumed.resolve(); await enable; await tick();
    expect(h.active()).toHaveLength(0); expect(h.ctx.gains[0].gain.value).toBe(0);
    await h.controller.exitSilenceAllFromGesture(); await tick(); expect(h.active()).toHaveLength(1); h.controller.dispose();
  });
  it.each(['silence', 'mute', 'zero', 'hide', 'route', 'dispose'] as const)('late decoding cannot defeat %s', async action => {
    const h = setup(), decoded = deferred<AudioBuffer>(); await enabled(h);
    h.ctx.decodeAudioData.mockImplementation(() => decoded.promise);
    h.controller.setSceneTheme('village'); h.controller.playEffect('success'); await tick();
    if (action === 'silence') h.controller.silenceAll();
    if (action === 'mute') { h.controller.setChannelMuted('music', true); h.controller.setChannelMuted('effects', true); }
    if (action === 'zero') { h.controller.setChannelVolume('music', 0); h.controller.setChannelVolume('effects', 0); }
    if (action === 'hide') h.controller.setVisible(false);
    if (action === 'route') h.controller.setSceneTheme(null);
    if (action === 'dispose') h.controller.dispose();
    decoded.resolve({} as AudioBuffer); await tick(); expect(h.active()).toHaveLength(0);
    h.controller.dispose();
  });
  it('drops hidden effects and narration, restores only music on foreground', async () => {
    const h = setup(); await enabled(h); h.controller.setSceneTheme('village'); await tick(); h.controller.readText(reading);
    h.controller.setVisible(false); h.controller.playEffect('restoration'); expect(h.controller.readText(reading)).toBe(false);
    h.controller.setVisible(true); await tick();
    expect(h.active()).toHaveLength(1); expect(h.active()[0].loop).toBe(true); expect(h.utterances).toHaveLength(1);
    h.controller.setSceneTheme('village'); expect(h.controller.getSnapshot().speaking).toBe(false); h.controller.dispose();
  });
  it('caps pending and sounding effects at four, replacing the oldest transient', async () => {
    const h = setup(); await enabled(h); for (let n = 0; n < 20; n++) h.controller.playEffect('pickup'); await tick();
    expect(h.active()).toHaveLength(4); const oldest = h.active()[0]; h.controller.playEffect('placement'); await tick();
    expect(oldest.stopped).toBe(true); expect(h.active()).toHaveLength(4); h.controller.dispose();
  });
  it('caps rapid theme crossfades at two; stale fade timers cannot restore silence', async () => {
    vi.useFakeTimers(); const h = setup();
    try {
      await enabled(h); h.controller.setSceneTheme('village'); await tick();
      for (const next of ['library', 'village', 'library'] as const) { h.controller.setSceneTheme(next); await tick(); expect(h.active().length).toBeLessThanOrEqual(2); }
      h.controller.silenceAll(); vi.runAllTimers(); expect(h.active()).toHaveLength(0); expect(h.ctx.gains[0].gain.value).toBe(0);
    } finally { h.controller.dispose(); vi.useRealTimers(); }
  });
  it('ducks without saving a lower volume; stale utterance completion cannot undo a current mute', async () => {
    const h = setup(); await enabled(h); h.controller.setSceneTheme('village'); await tick(); h.persist.mockClear();
    h.controller.readText(reading); expect(h.ctx.gains[1].gain.value).toBe(.075);
    const end = h.utterances[0].onend!; h.controller.setChannelVolume('music', .8); expect(h.ctx.gains[1].gain.value).toBe(.24);
    h.controller.stopReading(); expect(h.ctx.gains[1].gain.value).toBe(.8); h.controller.setChannelMuted('music', true);
    end.call(h.utterances[0], {} as SpeechSynthesisEvent); expect(h.ctx.gains[1].gain.value).toBe(0);
    expect(h.persist).toHaveBeenCalledTimes(2); h.controller.dispose();
  });
  it('rejects older status and preserves a synchronous latch before matching status publication', async () => {
    const h = setup(); await enabled(h);
    h.controller.applyPreferenceState(status({ ...INITIAL_AUDIO_PREFERENCES, soundEnabled: true }, 1));
    h.controller.silenceAll(); h.controller.applyPreferenceState(status({ ...INITIAL_AUDIO_PREFERENCES, soundEnabled: true }, 1));
    expect(h.controller.getSnapshot().preferences.silenceAll).toBe(true);
    h.controller.applyPreferenceState(status({ ...INITIAL_AUDIO_PREFERENCES, soundEnabled: true, silenceAll: true }, 2, { failed: true }));
    h.controller.applyPreferenceState(status({ ...INITIAL_AUDIO_PREFERENCES, soundEnabled: true }, 1));
    expect(h.controller.getSnapshot().preferences.silenceAll).toBe(true); expect(h.controller.getSnapshot().persistence?.failed).toBe(true);
    h.controller.dispose();
  });
  it('reports browser denial honestly and retries only on an explicit gesture', async () => {
    const h = setup(); h.controller.applyPreferenceState(status()); h.ctx.resume.mockRejectedValueOnce(new Error('NotAllowedError'));
    await h.controller.enableSoundFromGesture(); expect(h.controller.getSnapshot().activation).toBe('blocked');
    h.controller.playEffect('pickup'); h.controller.setSceneTheme('village'); h.controller.setChannelVolume('music', .4); await tick();
    expect(h.ctx.resume).toHaveBeenCalledTimes(1); await h.controller.enableSoundFromGesture(); await tick(); expect(h.active()).toHaveLength(1);
    h.ctx.state = 'suspended'; h.ctx.onstatechange?.(); expect(h.active()).toHaveLength(0); expect(h.controller.getSnapshot().activation).toBe('blocked'); h.controller.dispose();
  });
  it('returning saved consent is loaded before playback and still needs this visit’s browser activation', async () => {
    const h = setup(); h.controller.applyPreferenceState(status({ ...INITIAL_AUDIO_PREFERENCES, soundEnabled: true }));
    h.controller.setSceneTheme('library'); h.controller.playEffect('support');
    expect(h.createContext).not.toHaveBeenCalled(); expect(h.controller.getSnapshot().activation).toBe('inactive');
    await h.controller.enableSoundFromGesture(); await tick(); expect(h.active()).toHaveLength(1); h.controller.dispose();
  });
  it('gate echoes and state subscriptions cannot enqueue persistence or clear a saved latch', async () => {
    const h = setup(); h.controller.applyPreferenceState(status({ ...INITIAL_AUDIO_PREFERENCES, soundEnabled: true, silenceAll: true }));
    h.controller.applyLiveIntent({ kind: 'channel-volume', channel: 'music', volume: .4 });
    h.controller.applyLiveIntent({ kind: 'enable' });
    expect(h.persist).not.toHaveBeenCalled(); expect(h.controller.getSnapshot().preferences.silenceAll).toBe(true);
    expect(h.createContext).not.toHaveBeenCalled(); h.controller.dispose();
  });
  it('out-of-order theme fetches cannot start the old scene', async () => {
    const h = setup(), village = deferred<ArrayBuffer>(), library = deferred<ArrayBuffer>(); await enabled(h);
    h.fetchAsset.mockImplementation(url => url.includes('village') ? village.promise : library.promise);
    h.controller.setSceneTheme('village'); h.controller.setSceneTheme('library');
    library.resolve(new ArrayBuffer(8)); await tick(); expect(h.active()).toHaveLength(1);
    expect(h.active()[0].loopEnd).toBe(AUDIO_ASSETS.library.frameCount / AUDIO_ASSETS.library.sampleRate);
    village.resolve(new ArrayBuffer(8)); await tick(); expect(h.active()).toHaveLength(1); h.controller.dispose();
  });
  it('a delayed resume crossing hide and foreground requires a new explicit retry', async () => {
    const h = setup(), resume = deferred<void>(); h.controller.applyPreferenceState(status()); h.controller.setSceneTheme('village');
    h.ctx.resume.mockImplementation(async () => { await resume.promise; h.ctx.state = 'running'; });
    const enabling = h.controller.enableSoundFromGesture(); h.controller.setVisible(false); h.controller.setVisible(true);
    resume.resolve(); await enabling; await tick(); expect(h.active()).toHaveLength(0); expect(h.controller.readText(reading)).toBe(false);
    await h.controller.enableSoundFromGesture(); await tick(); expect(h.active()).toHaveLength(1); h.controller.dispose();
  });
  it('actual seven-file bindings retain exact PCM sizes, loop points and resolver paths', async () => {
    const h = setup(); await enabled(h);
    for (const [id, asset] of Object.entries(AUDIO_ASSETS)) {
      const bytes = readFileSync(`public/${asset.path}`); expect(bytes.length).toBe(asset.bytes); expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      expect(bytes.readUInt32LE(24)).toBe(asset.sampleRate);
      if (id === 'village' || id === 'library') { h.controller.setSceneTheme(id); await tick();
        const source = h.active().at(-1)!; expect(source.loopStart).toBe(0); expect(source.loopEnd).toBe(asset.frameCount / asset.sampleRate);
      } else { h.controller.playEffect(id as 'pickup'); await tick(); }
      expect(h.fetchAsset).toHaveBeenCalledWith(`/playtest/${asset.path}`);
    }
    expect(Object.keys(AUDIO_ASSETS)).toHaveLength(7); h.controller.dispose();
  });
  it('binds accepted preference helper with a single queue; late failed save keeps live silence', async () => {
    const h = setup(), response = deferred<never>();
    const initial: CommittedSnapshot = { token: { epoch: 'audio-fixture', revision: 0 }, save: createInitialSave() };
    const enqueue = vi.fn(() => response.promise);
    const preferences = createPreferenceController({ initialCommitted: initial, enqueue, applyLivePreferences: h.controller.applyLiveIntent, broadcastSilence() {} });
    h.persist.mockImplementation(preferences.setAudioPreferences);
    const unsub = preferences.subscribe(() => h.controller.applyPreferenceState(preferences.getStatus()));
    h.controller.applyPreferenceState(preferences.getStatus()); await h.controller.enableSoundFromGesture(); await tick();
    h.controller.silenceAll(); h.controller.setChannelVolume('music', .9); await tick();
    expect(enqueue).toHaveBeenCalledTimes(1); response.reject(new Error('save failed')); await preferences.flush();
    expect(h.controller.getSnapshot().preferences.silenceAll).toBe(true);
    expect(h.controller.getSnapshot().preferences.music.volume).toBe(.9); expect(h.controller.getSnapshot().persistence?.failed).toBe(true);
    expect(h.ctx.gains[0].gain.value).toBe(0); unsub(); h.controller.dispose();
  });
});
