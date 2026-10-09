import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ActivePanelHost, ActivePanelLifecycle } from '../app/panelLifecycle';
import type { NavigationPort } from '../app/navigation';
import type { AudioController } from '../audio/controller';
import { listTasks } from '../content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../content/quest-bindings';
import type { LearningRouteIntent } from '../learning/contracts';
import { selectCommittedActivity } from '../state/controller';
import type { CommitResult, CommittedSnapshot, OpenEncounterPayload, ProfileId, StateCommand, StateController } from '../state/contracts';
import { CREATIVE_CHOICES, DISCOVERIES, QUESTS, SCENES } from './catalogue';
import { CreativePlot } from './CreativePlot';
import type { CreativeSaveStatus } from './CreativePlot';
import { QuestActivity } from './QuestActivity';
import type { CreativeChoice, CreativeOption, HotspotIntent, QuestId, SceneId, WorldHotspot } from './types';
import { committedResultIds, QUEST_TITLES, requiredProgress, resolveWorldView } from './world';
import { cancelSceneMotion, playRestoration } from './motion';
import './experience.css';

const catalogue = listTasks();
type Props = {
  selectedProfileId: ProfileId; activePanelHost: ActivePanelHost; stateController: StateController;
  audioController: AudioController; navigation: NavigationPort; assetResolver(path: string): string;
};
const sceneCopy: Partial<Record<SceneId, { before: string; after: string; character?: string; person?: string }>> = {
  'village-green': { before: 'A quiet village. A fox with a plan. A little adventure that starts with you.', after: 'The flags are flying. The neighbours are gathering. You made this welcome possible.' },
  'river-bridge': { before: 'The river has carried away the old crossing. Rowan has timber and an idea — will you lend a hand?', after: 'A sturdy bridge spans the river. Rowan waves you across: the library may hold the missing market instructions.', character: 'rowan', person: 'Rowan · Village maker' },
  'whispering-library': { before: 'Behind the sleepy windows, Iona has found a spellbook whose sentences have lost their marks.', after: 'Warm light spills from the library. Iona opens the door and hands you Nessa’s market instructions.', character: 'iona', person: 'Iona · Keeper of stories' },
  'market-square': { before: 'Nessa’s stall is waiting for its first order. The recovered instructions will help you fill the basket.', after: 'Apples and pears fill the stall. Nessa hangs the bunting and sends a flower planter back to the village for you.', character: 'nessa', person: 'Nessa · Market gardener' },
};

/** Each conditional SVG is isolated in an image document, so authored IDs never
 * collide. Only trusted, accepted same-origin assets are parsed; DOM prose stays live. */
export function SceneView({ sceneId, resultIds, assetResolver, map = false }: {
  sceneId: SceneId; resultIds: readonly string[]; assetResolver: Props['assetResolver']; map?: boolean;
}) {
  const [image, setImage] = useState<{ key: string; url: string } | null>(null), [error, setError] = useState(false);
  const resultKey = resultIds.join('|'), key = `${sceneId}:${map}:${resultKey}`;
  useEffect(() => {
    let disposed = false, url: string | undefined;
    const abort = new AbortController(); setError(false);
    void fetch(assetResolver(map ? 'assets/art/m1/ui/world-map.svg' : `assets/art/m1/scenes/${sceneId}.svg`), { signal: abort.signal })
      .then(response => { if (!response.ok) throw new Error('Scene unavailable'); return response.text(); })
      .then(source => {
        const svg = new DOMParser().parseFromString(source, 'image/svg+xml');
        if (svg.querySelector('parsererror')) throw new Error('Scene unavailable');
        svg.querySelectorAll<SVGElement>('[data-result]').forEach(group => { group.style.display = resultIds.includes(group.dataset.result!) ? '' : 'none'; });
        const primary = sceneId === 'river-bridge' ? 'bridge-restored' : sceneId === 'whispering-library' ? 'library-restored'
          : sceneId === 'market-square' ? 'market-stocked' : 'village-welcome';
        svg.querySelectorAll<SVGElement>('[data-state="initial"]').forEach(group => { group.style.display = resultIds.includes(primary) ? 'none' : ''; });
        url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
        if (!disposed) setImage({ key, url }); else URL.revokeObjectURL(url);
      }).catch(error => { if (!disposed && error.name !== 'AbortError') setError(true); });
    return () => { disposed = true; abort.abort(); if (url) URL.revokeObjectURL(url); };
  }, [sceneId, map, resultKey, assetResolver, key]);
  return <div className={map ? 'adventure-map-art' : 'adventure-scene-art'} data-scene={sceneId} data-results={resultKey}>
    {image?.key === key && <img src={image.url} alt="" draggable={false} />}
    {error && <p className="scene-fallback">The illustration could not load. All destinations and instructions are available below.</p>}
  </div>;
}

export function SceneHotspot({ hotspot, onChoose, disabled }: { hotspot: WorldHotspot; onChoose(intent: HotspotIntent): void; disabled?: boolean }) {
  return <button type="button" disabled={disabled} onClick={() => onChoose(hotspot.intent)}>{hotspot.label}<span aria-hidden="true"> →</span></button>;
}

export function AdventureView(props: Props) {
  const snapshot = useSyncExternalStore(props.stateController.subscribe, props.stateController.getSnapshot, props.stateController.getSnapshot);
  if (!Object.hasOwn(snapshot.save.profiles, props.selectedProfileId)) return <section className="adventure recovery">
    <h1>This player is no longer available</h1><p>Your other players have not been changed. Return to the player chooser.</p>
    <button onClick={() => props.navigation.navigate({ kind: 'profiles' })}>Choose a player</button></section>;
  return <AdventureBinding key={`${props.selectedProfileId}:${snapshot.token.epoch}`} {...props} snapshot={snapshot} />;
}

function AdventureBinding({ snapshot, ...props }: Props & { snapshot: CommittedSnapshot }) {
  const { selectedProfileId, activePanelHost, stateController, audioController, navigation, assetResolver } = props;
  const profile = snapshot.save.profiles[selectedProfileId];
  const [sceneId, setScene] = useState<SceneId>('village-green'), [encounterId, setEncounter] = useState<string | null>(null);
  const [creative, setCreative] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const [discovery, setDiscovery] = useState<string | null>(null), [fresh, setFresh] = useState('');
  const [saveStatus, setSaveStatus] = useState<CreativeSaveStatus>('idle');
  const [blockedLeave, setBlockedLeave] = useState(false), [quiet, setQuiet] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const panel = useRef<ActivePanelLifecycle | null>(null), pendingDestination = useRef<(() => void | Promise<void>) | null>(null);
  const opening = useRef(false), retainedOpen = useRef<Extract<StateCommand, { kind: 'OpenEncounter' }> | null>(null), retainedCreative = useRef<StateCommand | null>(null);
  const transitioning = useRef(false);
  const alive = useRef(true), illustration = useRef<HTMLDivElement>(null), heading = useRef<HTMLHeadingElement>(null);
  const reduced = quiet || profile.preferences.motion === 'reduced';
  const scopedHost = useMemo<ActivePanelHost>(() => ({ register(lifecycle) {
    panel.current = lifecycle;
    const unregister = activePanelHost.register(lifecycle);
    return () => { if (panel.current === lifecycle) panel.current = null; unregister(); };
  } }), [activePanelHost]);
  useEffect(() => { alive.current = true; return () => { alive.current = false; audioController.stopReading(); cancelSceneMotion(illustration.current); }; }, [audioController]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)'), change = () => setQuiet(media.matches);
    media.addEventListener('change', change); return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => { if (reduced) cancelSceneMotion(illustration.current); }, [reduced]);
  useEffect(() => { audioController.stopReading(); audioController.setSceneTheme(SCENES.find(s => s.id === sceneId)!.theme); heading.current?.focus(); }, [sceneId, audioController]);
  const current = () => alive.current && stateController.getSnapshot().token.epoch === snapshot.token.epoch
    && Object.hasOwn(stateController.getSnapshot().save.profiles, selectedProfileId);
  const world = resolveWorldView({ world: profile.world, creative: profile.creative, entitlements: profile.rewards.entitlementIds, sceneId, milestone: 'M1' });
  const results = committedResultIds(profile.world), completed = profile.world.completedQuestIds.includes('Q3');
  const sceneQuest = QUESTS.find(q => q.sceneId === sceneId && q.milestone === 'M1');
  const restored = sceneId === 'village-green' ? completed : !!sceneQuest && profile.world.completedQuestIds.includes(sceneQuest.id);
  const scene = SCENES.find(s => s.id === sceneId)!, copy = sceneCopy[sceneId]!;
  const projected = encounterId ? selectCommittedActivity(snapshot, catalogue, { profileId: selectedProfileId, encounterId }) : null;
  async function guarded(destination: () => void | Promise<void>) {
    if (opening.current || busy || transitioning.current) return;
    transitioning.current = true;
    try {
    pendingDestination.current = destination;
    if (panel.current) {
      const result = await panel.current.suspend();
      if (!current()) return;
      if (result.status !== 'ready') { setMessage(result.message); setBlockedLeave(true); return; }
    }
    if (!current()) return;
    setBlockedLeave(false); pendingDestination.current = null; audioController.stopReading(); cancelSceneMotion(illustration.current);
    await destination();
    } finally { transitioning.current = false; }
  }
  function goScene(id: SceneId) { void guarded(() => { setEncounter(null); setCreative(false); setDiscovery(null); setFresh(''); setMessage(''); setScene(id); }); }
  function commandEnvelope() { return { actionId: crypto.randomUUID(), expected: stateController.getSnapshot().token, profileId: selectedProfileId }; }
  async function open(payload: OpenEncounterPayload, retry = false) {
    if (opening.current || !current()) return;
    opening.current = true; setBusy(true); setMessage('Opening your saved activity…');
    const before = stateController.getSnapshot().save.profiles[selectedProfileId].encounters;
    let command: Extract<StateCommand, { kind: 'OpenEncounter' }> = retry && retainedOpen.current ? retainedOpen.current : { ...commandEnvelope(), kind: 'OpenEncounter', payload };
    retainedOpen.current = command;
    try {
      const result = await stateController.dispatch(command);
      if (!current()) return;
      if (result.status !== 'committed' && result.status !== 'already-applied') {
        if (result.status === 'conflict') { command = { ...command, ...commandEnvelope() }; retainedOpen.current = command; }
        setMessage(result.status === 'conflict' ? 'Your save changed. Retry opening this activity using the refreshed save.' : result.reason.message); return;
      }
      const after = result.snapshot.save.profiles[selectedProfileId].encounters;
      const changed = Object.values(after).filter(e => e.learningEpisode.status === 'open' && JSON.stringify(before[e.encounterId]) !== JSON.stringify(e));
      const resumed = 'resumeEncounterId' in payload ? after[payload.resumeEncounterId!] : null;
      const candidates = resumed ? [resumed] : changed.length === 1 ? changed : Object.values(after).filter(e => e.learningEpisode.status === 'open'
        && ('route' in payload && payload.route && (payload.route.kind === 'quest' ? e.bindingProvenance?.questId === payload.route.questId && e.bindingProvenance.role === 'story'
          : payload.route.kind === 'practice' ? (!payload.route.skillId || e.skillId === payload.route.skillId)
            : e.bindingProvenance?.bindingId === payload.route.bindingId)));
      if (candidates.length !== 1) { setMessage('The saved selection could not be identified safely. Return to the village and resume a named saved activity.'); return; }
      const selection = selectCommittedActivity(result.snapshot, catalogue, { profileId: selectedProfileId, encounterId: candidates[0].encounterId });
      if (selection.status !== 'ready') { setMessage('The approved content for this saved activity is unavailable. Your progress is unchanged.'); return; }
      retainedOpen.current = null; setEncounter(selection.activity.encounterId); setCreative(false); setFresh(''); setMessage('');
    } catch { if (current()) setMessage('The activity could not be opened. Retry without losing your saved progress.'); }
    finally { opening.current = false; if (current()) setBusy(false); }
  }
  function requestActivity(route: LearningRouteIntent) { void guarded(() => open({ route, suppressDueReviewForVisit: false })); }
  function resumeActivity(id: string) { void guarded(() => open({ resumeEncounterId: id, suppressDueReviewForVisit: false })); }
  function committed(result: Extract<CommitResult, { status: 'committed' }>) {
    if (!current()) return;
    if (result.changes.restorationIds.length) {
      setFresh('A little part of the village is restored — and saved.'); audioController.playEffect('restoration'); playRestoration(illustration.current, reduced);
    } else if (result.changes.earnedPoints.newReceiptKeys.length && encounterId
      && result.snapshot.save.profiles[selectedProfileId]?.encounters[encounterId]?.lastCommittedCheck?.evaluation.correct) audioController.playEffect('success');
    else audioController.playEffect('support');
  }
  function next() {
    const quest = projected?.status === 'ready' ? projected.activity.bindingProvenance?.questId : null;
    void guarded(() => {
      setEncounter(null); setFresh(''); setMessage('');
      setScene(quest === 'Q1' ? 'whispering-library' : quest === 'Q2' ? 'market-square' : 'village-green');
      if (quest === 'Q3') setCreative(true);
    });
  }
  function choose(intent: HotspotIntent) {
    if (intent.kind === 'navigate') goScene(intent.sceneId);
    else if (intent.kind === 'quest') requestActivity({ kind: 'quest', questId: intent.questId });
    else if (intent.kind === 'practice') requestActivity(intent.route);
    else if (intent.kind === 'hall') void guarded(() => navigation.navigate({ kind: 'leaderboard' }));
    else if (intent.kind === 'creative') void guarded(() => { setEncounter(null); setScene('village-green'); setCreative(true); setFresh(''); });
    else { setDiscovery(intent.discoveryId); audioController.playEffect('pickup'); }
  }
  async function saveCreative(choice: CreativeChoice) {
    if (opening.current || !current()) return;
    opening.current = true; setBusy(true);
    const previous = retainedCreative.current;
    const command: StateCommand = previous?.kind === 'ChooseCosmetic' && JSON.stringify(previous.payload.choice) === JSON.stringify(choice)
      ? previous : { ...commandEnvelope(), kind: 'ChooseCosmetic', payload: { choice } };
    retainedCreative.current = command;
    try {
      const result = await stateController.dispatch(command); if (!current()) return;
      setSaveStatus(result.status);
      if (result.status === 'committed' || result.status === 'already-applied') { retainedCreative.current = null; if (result.status === 'committed') audioController.playEffect('placement'); }
      else if (result.status === 'conflict') retainedCreative.current = null;
    } catch { if (current()) setSaveStatus('save-failed'); }
    finally { opening.current = false; if (current()) setBusy(false); }
  }
  const allowed = (option: CreativeOption) => option.milestone === 'M1' && option.requiresAll.every(q => profile.world.completedQuestIds.includes(q));
  const unfinished = Object.values(profile.encounters).filter(e => e.learningEpisode.status !== 'completed-success');
  const offered = projected?.status === 'ready' && projected.activity.bindingProvenance?.role === 'story'
    ? QUEST_ACTIVITY_BINDINGS.find(b => b.role === 'optional-transfer' && b.sourceBindingId === projected.activity.bindingProvenance?.bindingId) : null;
  return <section className="adventure" data-reduced-motion={reduced}>
    <header className="adventure-masthead"><div><p className="adventure-eyebrow">The Lost Kingdom · A village to bring to life</p>
      <p className="adventure-player">{profile.identity.nickname}’s adventure</p></div><button type="button" disabled={busy} onClick={() => { void guarded(() => navigation.navigate({ kind: 'profiles' })); }}>Save & choose player</button></header>
    <nav className="adventure-chapters" aria-label="Your story so far">{(['Q1', 'Q2', 'Q3'] as const).map((id, i) => {
      const q = QUESTS.find(q => q.id === id)!, progress = requiredProgress(profile.world, id), done = profile.world.completedQuestIds.includes(id);
      const reachable = id === 'Q1' || profile.world.completedQuestIds.includes('Q1');
      return <button key={id} disabled={busy || !reachable} aria-current={sceneId === q.sceneId ? 'step' : undefined} onClick={() => goScene(q.sceneId)}>
        <span className="chapter-number" aria-hidden="true">{done ? '✓' : `0${i + 1}`}</span><span>{['The crossing', 'The spellbook', 'The welcome'][i]}<small>{done ? 'Restored' : reachable ? `${progress.completed} of ${progress.total} story steps` : 'Beyond the bridge'}</small></span></button>;
    })}</nav>
    <div className="adventure-scene-layout"><div className="adventure-illustration" ref={illustration}>
      <SceneView sceneId={sceneId} resultIds={results} assetResolver={assetResolver} />
      {sceneId === 'village-green' && completed && Object.entries(profile.creative.placements).filter(([, value]) => value === 'planter').map(([socket]) => <span key={socket} className={`adventure-saved-planter ${socket}`} aria-label={`Your saved ${profile.creative.flowerColourId} planter`} role="img">
        <img src={assetResolver('assets/art/m1/props/decoration-planter.svg')} alt="" /><img src={assetResolver(`assets/art/m1/props/flowers-${profile.creative.flowerColourId}.svg`)} alt="" />
        {profile.creative.planterRimId && profile.rewards.entitlementIds.includes(profile.creative.planterRimId) && <img src={assetResolver('assets/art/m1/props/planter-rim.svg')} alt="" />}</span>)}
      <span className="scene-caption">{restored ? 'A change you made. A place that remembers.' : 'Every little idea can make a difference.'}</span>
    </div><div className="adventure-story"><p className="adventure-eyebrow">{restored ? 'Restored, thanks to you' : sceneQuest ? 'Your next little adventure' : 'Welcome, explorer'}</p>
      <h1 ref={heading} tabIndex={-1}>{scene.title}</h1><p className="adventure-story-copy">{restored ? copy.after : copy.before}</p>
      {copy.character && <div className="adventure-neighbour"><img src={assetResolver(`assets/art/m1/characters/${copy.character}.svg`)} alt="" /><span>{copy.person}</span></div>}
      {sceneId === 'village-green' && !completed && <button className="adventure-primary" disabled={busy} onClick={() => goScene('river-bridge')}>Meet Pip at the bridge <span aria-hidden="true">→</span></button>}
      {!encounterId && !creative && world.hotspots.filter(h => h.intent.kind === 'quest' || h.intent.kind === 'practice').map(h => <SceneHotspot key={h.id} hotspot={h} onChoose={choose} disabled={busy} />)}
      {sceneId === 'market-square' && !profile.world.completedQuestIds.includes('Q2') && <p>Visit Iona at the library to recover the market instructions first.</p>}
      {restored && <p className="restoration-description">This change is saved for your next visit. There is always time to explore a little more.</p>}
    </div></div>
    {fresh && <p className="adventure-celebration" role="status">{fresh}</p>}
    {message && <div className="adventure-message" role="status"><p>{message}</p>
      {retainedOpen.current?.kind === 'OpenEncounter' && <button disabled={busy} onClick={() => { const command = retainedOpen.current; if (command?.kind === 'OpenEncounter') void open(command.payload, true); }}>Retry opening activity</button>}</div>}
    {blockedLeave && <div className="adventure-leave" role="alert"><h2>Your draft is still here</h2><p>Saved answers, help and world changes will stay saved.</p>
      <button onClick={() => { const destination = pendingDestination.current; if (destination) void guarded(destination); }}>Retry saving and leaving</button>
      <button onClick={() => { const result = panel.current?.discardDraft(); if (result?.status === 'blocked') { setMessage(result.message); return; }
        const destination = pendingDestination.current; pendingDestination.current = null; setBlockedLeave(false); audioController.stopReading(); void destination?.(); }}>Leave without saving the draft</button>
      <button onClick={() => { setBlockedLeave(false); pendingDestination.current = null; }}>Stay with my idea</button></div>}
    {projected?.status === 'ready' && <QuestActivity key={`${selectedProfileId}:${snapshot.token.epoch}:${encounterId}:${projected.activity.learningEpisodeOrdinal}`}
      activity={projected.activity} stateController={stateController} audioController={audioController} activePanelHost={scopedHost}
      onLeave={() => { void guarded(() => { setEncounter(null); setMessage(''); setFresh(''); heading.current?.focus(); }); }} onContinue={next}
      onTransfer={offered ? () => requestActivity({ kind: 'optional-transfer', bindingId: offered.bindingId }) : undefined} onCommitted={committed} />}
    {projected?.status === 'unavailable' && <section className="recovery"><h2>Saved activity unavailable</h2><p>{projected.reason}. Your saved progress has not been replaced.</p><button onClick={() => navigation.navigate({ kind: 'profiles' })}>Return to players</button></section>}
    {creative && <><CreativePlot key={`${selectedProfileId}:${snapshot.token.epoch}`} saved={profile.creative} availableChoices={{
      scarfColours: CREATIVE_CHOICES.scarfColours.filter(allowed), flowerColours: CREATIVE_CHOICES.flowerColours.filter(allowed),
      decorations: CREATIVE_CHOICES.decorations.filter(allowed), cosmetics: CREATIVE_CHOICES.cosmetics.filter(allowed), sockets: CREATIVE_CHOICES.sockets,
    }} entitlements={profile.rewards.entitlementIds} pending={busy} saveStatus={saveStatus} onSave={choice => { void saveCreative(choice); }} onCancel={() => setSaveStatus('idle')} />
      <button disabled={busy} onClick={() => { setCreative(false); heading.current?.focus(); }}>Back to village · discard any unsaved preview</button></>}
    {!encounterId && !creative && <>
      {completed && <section className="adventure-ending"><p className="adventure-eyebrow">The village welcome</p><h2>Your first adventure is complete</h2>
        <p>A crossing, a light in the library, a bustling market. Your ideas brought them back.</p><p>Your flower planter is ready to make your own. All three flower colours and garden spots are free.</p>
        <button className="adventure-primary" onClick={() => choose({ kind: 'creative' })}>Customise and place your planter</button>
        <button onClick={() => requestActivity({ kind: 'practice', mode: 'suggested' })}>Choose some practice</button>
        <button onClick={() => choose({ kind: 'hall' })}>Visit the Hall</button><button onClick={() => navigation.navigate({ kind: 'profiles' })}>Resume another day</button></section>}
      {unfinished.length > 0 && <section className="adventure-resume"><h2>Your saved ideas</h2>{unfinished.map(e => <button key={e.encounterId} disabled={busy} onClick={() => resumeActivity(e.encounterId)}>
        Resume {e.bindingProvenance?.questId ? QUEST_TITLES[e.bindingProvenance.questId as QuestId] : 'practice'}{e.bindingProvenance?.role === 'optional-transfer' ? ' · optional challenge' : ''}</button>)}</section>}
      <section className="adventure-map"><div><p className="adventure-eyebrow">Take the scenic route</p><h2>A village worth exploring</h2>
        <p>{profile.world.completedQuestIds.includes('Q1') ? 'The bridge is open. Follow your curiosity.' : 'Meet Rowan at the river to open the path to the library and market.'}</p>
        <nav aria-label="Village destinations">{world.hotspots.filter(h => h.intent.kind !== 'quest' && h.intent.kind !== 'practice').map(h => <SceneHotspot key={h.id} hotspot={h} onChoose={choose} disabled={busy} />)}</nav>
        <p className="adventure-note">Beyond the hills: the workshop, forest and castle belong to a future adventure.</p></div>
        <SceneView sceneId={sceneId} resultIds={results} assetResolver={assetResolver} map />
      </section>
      {discovery && <aside className="adventure-discovery" role="status"><img alt="" src={assetResolver(`assets/art/m1/props/${DISCOVERIES.find(d => d.id === discovery)?.assetId}.svg`)} />
        <p>{DISCOVERIES.find(d => d.id === discovery)?.label}. A small moment, just for you.</p><button onClick={() => setDiscovery(null)}>Back to exploring</button></aside>}
    </>}
  </section>;
}
