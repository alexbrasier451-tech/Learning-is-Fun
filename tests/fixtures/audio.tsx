import { useState, useSyncExternalStore } from 'react';
import { mountPanel } from './host';
import { AudioControls } from '../../src/audio/AudioControls';
import { createAudioController } from '../../src/audio/controller';
import { createSpeechAdapter } from '../../src/audio/speech';
import { createPreferenceController } from '../../src/state/preferences';
import { createStateController } from '../../src/state/controller';
import { openSaveRepository } from '../../src/state/repository';
import type { SaveRepository } from '../../src/state/repository';
import { validateSave } from '../../src/state/backup';
import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { createInitialSave } from '../../src/state/transition';
import type { AudioPreferencesPatch, CommittedSnapshot } from '../../src/state/contracts';
import { assetUrl } from '../../src/platform/assets';
import type { AudioFixtureApi } from './audio-api';

// Default retains the frozen test writer. binding=real creates exactly one
// accepted facade/helper/repository instead, using actual native IndexedDB.
const params = new URLSearchParams(location.search);
const realBinding = params.get('binding') === 'real';
const namespace = `learning-is-fun:/playtest/:audio-${params.get('namespace') ?? crypto.randomUUID()}`;
let selectedProfileId: string | null = null;
let committed: CommittedSnapshot = { token: { epoch: 'audio-fixture', revision: 0 }, save: createInitialSave() };
let failNext = false, failNextHandoff = false, holdNext = false, release: (() => void) | null = null;
const events: Array<Record<string, unknown>> = [];
let context: AudioContext | null = null, createdContexts = 0;
let stopContextDiagnostics = () => {};
function browserGate() {
  return { hidden: document.hidden, visibilityState: document.visibilityState,
    userActivation: { isActive: navigator.userActivation?.isActive ?? null, hasBeenActive: navigator.userActivation?.hasBeenActive ?? null } };
}
function contextState() {
  return context ? { state: context.state, currentTime: context.currentTime, sampleRate: context.sampleRate,
    baseLatency: context.baseLatency, destinationChannels: context.destination.channelCount, maxChannels: context.destination.maxChannelCount } : null;
}
function checkpoint(stage: string, details: Record<string, unknown> = {}) {
  events.push({ stage, sequence: events.length, atMs: performance.now(), ...details });
}
const sources: { source: AudioBufferSourceNode; started: boolean; stopped: boolean; loop: boolean }[] = [];
const utterances: SpeechSynthesisUtterance[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;
const fakeSynthesis = {
  getVoices: () => [{ name: 'Fixture local English (simulated)', lang: 'en-GB', localService: true }],
  addEventListener() {}, removeEventListener() {},
  speak(utterance: SpeechSynthesisUtterance) { currentUtterance = utterance; utterances.push(utterance); events.push({ stage: 'simulated-speech' }); },
  cancel() { currentUtterance = null; events.push({ stage: 'speech-cancel' }); },
};
const speech = params.get('speech') === 'fake'
  ? createSpeechAdapter({ synthesis: fakeSynthesis as unknown as SpeechSynthesis, createUtterance: text => ({ text } as SpeechSynthesisUtterance) })
  : createSpeechAdapter();
const audio = createAudioController({ assetResolver: assetUrl, speechAdapter: speech,
  persistPreferences: intent => {
    checkpoint('preference-handoff', { intent, live: audio.getSnapshot(), browser: browserGate() });
    if (failNextHandoff) { failNextHandoff = false; throw new Error('Fixture handoff fails before helper.'); }
    preferences.setAudioPreferences(intent);
  },
  createContext() {
    createdContexts++;
    try { context = new AudioContext(); }
    catch (error) { events.push({ stage: 'context-unavailable', error: String(error), constructorType: typeof AudioContext }); throw error; }
    checkpoint('native-context-created', { context: contextState(), browser: browserGate(), live: audio.getSnapshot() });
    const created = context, resume = created.resume.bind(created);
    // Observe the real promise without resolving, replacing, timing out or
    // retrying it. These fixture checkpoints never set runtime activation.
    created.resume = () => {
      checkpoint('native-resume-call', { context: contextState(), browser: browserGate(), live: audio.getSnapshot() });
      try {
        const pending = resume();
        void pending.then(() => checkpoint('native-resume-fulfilled', { context: contextState(), browser: browserGate(), live: audio.getSnapshot() }),
          error => checkpoint('native-resume-rejected', { error: String(error), context: contextState(), live: audio.getSnapshot() }));
        return pending;
      } catch (error) { checkpoint('native-resume-threw', { error: String(error), context: contextState() }); throw error; }
    };
    const nativeStateChange = () => checkpoint('native-statechange', { context: contextState(), browser: browserGate(), live: audio.getSnapshot() });
    created.addEventListener('statechange', nativeStateChange);
    stopContextDiagnostics = () => { created.removeEventListener('statechange', nativeStateChange); };
    const createSource = context.createBufferSource.bind(context);
    context.createBufferSource = () => {
      const source = createSource(), item = { source, started: false, stopped: false, loop: false };
      const start = source.start.bind(source), stop = source.stop.bind(source);
      source.start = (...args) => { item.started = true; item.loop = source.loop; events.push({ stage: 'source-start', loop: source.loop, duration: source.buffer?.duration }); start(...args); };
      source.stop = (...args) => { item.stopped = true; stop(...args); };
      source.addEventListener('ended', () => { item.stopped = true; });
      sources.push(item); return source;
    };
    const decode = context.decodeAudioData.bind(context);
    context.decodeAudioData = (data: ArrayBuffer) => decode(data).then(buffer => { events.push({ stage: 'decoded', duration: buffer.duration, frames: buffer.length, rate: buffer.sampleRate }); return buffer; });
    return context;
  },
});
const stopAudioDiagnostics = audio.subscribe(() => checkpoint('audio-status', { live: audio.getSnapshot(), browser: browserGate(), context: contextState() }));
function recordClick(event: MouseEvent) {
  const button = event.target instanceof Element ? event.target.closest('button') : null;
  if (button && /^(Enable sound|Retry sound|Exit Silence all)$/.test(button.textContent?.trim() ?? '')) {
    checkpoint('explicit-activation-click', { label: button.textContent?.trim(), trusted: event.isTrusted, browser: browserGate(), live: audio.getSnapshot() });
  }
}
document.addEventListener('click', recordClick, true);
const nativePut = IDBObjectStore.prototype.put;
if (realBinding) IDBObjectStore.prototype.put = function (...args: Parameters<IDBObjectStore['put']>) {
  const request = nativePut.apply(this, args);
  if (this.transaction.db.name === `${namespace}:save` && failNext) {
    failNext = false; events.push({ stage: 'native-transaction-abort', live: audio.getSnapshot().preferences }); this.transaction.abort();
  }
  return request;
};
async function realFacade() {
  if (params.get('corrupt') === 'yes') await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(`${namespace}:save`, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('records');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction('records', 'readwrite');
      tx.objectStore('records').put({ epoch: 'unreadable-fixture', revision: 0, save: { malformed: 'preserve me' } }, 'root');
      tx.oncomplete = () => { db.close(); resolve(); }; tx.onabort = () => { db.close(); reject(tx.error); };
    };
  });
  const catalogue = listTasks();
  const real = openSaveRepository({ appNamespace: namespace, initialSave: createInitialSave(), validateSave, catalogue });
  const repository: SaveRepository = { ...real, async commitCommand(command, ports) {
    events.push({ stage: 'repository-command', kind: command.kind, payload: command.payload, live: audio.getSnapshot().preferences });
    if (holdNext) { holdNext = false; await new Promise<void>(resolve => { release = resolve; }); release = null; }
    const result = await real.commitCommand(command, ports);
    events.push({ stage: 'repository-result', kind: command.kind, status: result.status, ...('snapshot' in result ? { token: result.snapshot?.token } : {}) });
    return result;
  } };
  return createStateController({ repository, catalogue, questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1',
    clock: { nowEpochMs: () => Date.parse('2026-10-09T12:00:00Z') }, preferenceGate: { applyLiveIntent(intent) {
      audio.applyLiveIntent(intent); events.push({ stage: 'live-gate', intent, live: audio.getSnapshot().preferences });
    } }, readTransientReadiness: () => ({ dirty: false, pending: false, failed: false }) });
}
const facade = realBinding ? await realFacade() : null;
const preferences = facade?.preferences ?? createPreferenceController({ initialCommitted: committed,
  applyLivePreferences: audio.applyLiveIntent, broadcastSilence() { events.push({ stage: 'broadcast-silence' }); },
  async enqueue(command) {
    events.push({ stage: 'preference-enqueue', kind: command.kind });
    if (holdNext) { holdNext = false; await new Promise<void>(resolve => { release = resolve; }); release = null; }
    if (failNext) { failNext = false; return { status: 'save-failed', retryable: true, snapshot: committed,
      reason: { code: 'storage-unreadable', message: 'Fixture simulates a failed save.' } }; }
    const patch = command.payload.patch as AudioPreferencesPatch, old = committed.save.installation.audio;
    committed = { token: { epoch: 'audio-fixture', revision: committed.token.revision + 1 }, save: { ...committed.save,
      installation: { ...committed.save.installation, audio: { ...old, ...patch, music: { ...old.music, ...patch.music }, effects: { ...old.effects, ...patch.effects } } } } };
    return { status: 'committed', snapshot: committed, changes: { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0, newReceiptKeys: [], newEntitlementIds: [] }, unlockedIds: [], restorationIds: [], closedWeekIds: [] } };
  },
});
const unsubscribe = preferences.subscribe(() => {
  audio.applyPreferenceState(preferences.getStatus());
  if (realBinding) events.push({ stage: 'preference-status', status: preferences.getStatus() });
});
audio.applyPreferenceState(preferences.getStatus()); audio.setSceneTheme('village');
function visibility() { checkpoint('visibility-forward', { browser: browserGate() }); audio.setVisible(!document.hidden); }
document.addEventListener('visibilitychange', visibility);
visibility();
function snapshot() { return facade ? facade.getSnapshot() : committed; }
function selectProfile(profileId: string) {
  if (!snapshot().save.profiles[profileId]) throw new Error('Profile unavailable.');
  audio.stopReading(); audio.setSceneTheme(null); selectedProfileId = profileId;
  events.push({ stage: 'profile-selected', profileId, live: audio.getSnapshot().preferences });
}
let tornDown = false;
const api = {
  namespace, binding: realBinding ? 'real' as const : 'fake' as const,
  ready: () => facade?.ready ?? Promise.resolve({ status: 'ready' as const, snapshot: committed }),
  audio, events: () => events, createdContexts: () => createdContexts,
  diagnostics: () => ({ binding: realBinding ? 'real' : 'fake', browser: browserGate(), userAgent: navigator.userAgent,
    context: contextState(), createdContexts, live: audio.getSnapshot(), preferenceStatus: preferences.getStatus(), events }),
  activeSources: () => sources.filter(s => s.started && !s.stopped).map(s => ({ loop: s.loop, duration: s.source.buffer?.duration })),
  committed: snapshot, preferences,
  flush: () => facade ? facade.flush() : preferences.flush(),
  async nativeRoot(): Promise<unknown> {
    if (!realBinding) throw new Error('Native root requires real binding.');
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(`${namespace}:save`);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result, tx = db.transaction('records', 'readonly'), read = tx.objectStore('records').get('root');
        tx.oncomplete = () => { db.close(); resolve(read.result); };
        tx.onabort = () => { db.close(); reject(tx.error); };
      };
    });
  },
  async createProfile(nickname: string) {
    if (!facade) throw new Error('Profile commands require real binding.');
    const command = facade.prepareCommand({ kind: 'CreateProfile', payload: { nickname, avatarId: 'pip' } });
    if (command.kind !== 'CreateProfile') throw new Error('Unexpected profile command.');
    const result = await facade.dispatch(command);
    if (result.status !== 'committed') throw new Error(`Profile failed: ${result.status}`);
    return command.payload.newProfileId;
  },
  selectProfile, selectedProfile: () => selectedProfileId,
  dispatchVisibility(visible: boolean) {
    // Test injection into the actual DOM-event forwarding hook, not an OS-hide claim.
    Object.defineProperty(document, 'hidden', { configurable: true, value: !visible });
    try { document.dispatchEvent(new Event('visibilitychange')); }
    finally { Reflect.deleteProperty(document, 'hidden'); }
    events.push({ stage: 'injected-visibility-event', visible });
  },
  failNext: () => { failNext = true; }, failNextHandoff: () => { failNextHandoff = true; },
  holdNext: () => { holdNext = true; }, held: () => !!release, release: () => release?.(),
  finishReading() { currentUtterance?.onend?.call(currentUtterance, {} as SpeechSynthesisEvent); },
  utteranceCount: () => utterances.length,
  teardown() {
    if (tornDown) return; tornDown = true;
    unsubscribe(); stopAudioDiagnostics(); stopContextDiagnostics(); document.removeEventListener('click', recordClick, true);
    document.removeEventListener('visibilitychange', visibility); audio.dispose(); facade?.dispose();
    if (realBinding) IDBObjectStore.prototype.put = nativePut;
    mounted.unmount();
  },
  async cleanup() {
    api.teardown();
    if (realBinding) await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(`${namespace}:save`);
      request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Close sibling audio fixture tabs before cleanup.'));
    });
  },
} satisfies AudioFixtureApi;
declare global { interface Window { audioFixture: AudioFixtureApi } }
window.audioFixture = api;
function Panel() {
  const [scene, setScene] = useState('Village Green'), [overlay, setOverlay] = useState(false);
  const preferenceStatus = useSyncExternalStore(preferences.subscribe, preferences.getStatus);
  return <main style={{ maxWidth: 1040, margin: '0 auto', padding: 20, font: '18px/1.5 system-ui', color: '#263d38' }}>
    <p>LOCAL FIXTURE · {params.get('speech') === 'fake' ? 'Simulated speech' : 'Device speech'} · {realBinding ? 'Real facade + IndexedDB' : 'Preference test writer'}</p>
    <AudioControls controller={audio} />
    {preferenceStatus.failed && <button onClick={preferences.retry}>Retry saving sound choices</button>}
    <section style={{ marginTop: 28, borderRadius: 24, padding: 24, background: '#e5eee3' }}>
      <h1>{scene}</h1><p>Choose a plank to help restore the bridge.</p>
      <div className="audio-toolbar"><button onClick={() => audio.playEffect('pickup')}>Pick up a plank</button>
        <button onClick={() => { setScene('Whispering Library'); audio.setSceneTheme('library'); }}>Visit the library</button>
        <button onClick={() => {
          const profileIds = realBinding ? Object.keys(snapshot().save.profiles) : [];
          if (profileIds.length) selectProfile(profileIds[(profileIds.indexOf(selectedProfileId ?? '') + 1) % profileIds.length]);
          else { audio.stopReading(); audio.setSceneTheme(null); }
          setScene('Another explorer');
        }}>Switch profile</button>
        <button onClick={() => setOverlay(!overlay)}>Open instructions</button>
        <button onClick={() => audio.readText({ requestId: 'fixture-instructions', text: 'Choose a plank to help restore the bridge.', role: 'instruction', language: 'en' })}>Read aloud</button>
      </div>
      {overlay && <section aria-label="Activity instructions" style={{ marginTop: 20, padding: 20, border: '2px solid #24665e', background: '#fff6e5', borderRadius: 18 }}>
        <h2>Build a bridge</h2><p>Sound and Silence all stay available above this activity panel.</p><button onClick={() => setOverlay(false)}>Close instructions</button>
      </section>}
    </section>
  </main>;
}
const mounted = mountPanel(document.getElementById('root')!, <Panel />);
window.addEventListener('pagehide', api.teardown, { once: true });
