import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ActivePanelHost, ActivePanelLifecycle } from '../app/panelLifecycle';
import type { NavigationPort } from '../app/navigation';
import type { AudioController } from '../audio/controller';
import { listTasks } from '../content/catalogue';
import { SKILLS } from '../content/skills';
import { QUEST_ACTIVITY_BINDINGS } from '../content/quest-bindings';
import type { LearningRouteIntent, SkillId } from '../learning/contracts';
import { selectCommittedActivity } from '../state/controller';
import type { CommitResult, CommittedSnapshot, OpenEncounterPayload, ProfileId, StateCommand, StateController } from '../state/contracts';
import { CREATIVE_CHOICES, DISCOVERIES, QUESTS, SCENES } from './catalogue';
import { CreativePlot } from './CreativePlot';
import { FestivalView } from './FestivalView';
import type { ClosedWeekResult } from '../rewards/contracts';
import type { CreativeSaveStatus } from './CreativePlot';
import { QuestActivity } from './QuestActivity';
import type { CreativeChoice, CreativeOption, HotspotIntent, QuestId, SceneId, WorldHotspot } from './types';
import { committedResultIds, QUEST_TITLES, requiredProgress, resolveWorldView, sceneReachable } from './world';
import { cancelSceneMotion, playRestoration } from './motion';
import './experience.css';

const catalogue = listTasks();
type Props = {
  selectedProfileId: ProfileId; activePanelHost: ActivePanelHost; stateController: StateController;
  audioController: AudioController; navigation: NavigationPort; assetResolver(path: string): string;
};
const sceneCopy: Record<SceneId, { before: string; after: string; character?: string; person?: string }> = {
  'village-green': { before: 'A quiet village. A fox with a plan. A little adventure that starts with you.', after: 'The flags are flying. The neighbours are gathering. You made this welcome possible.' },
  'river-bridge': { before: 'The river has carried away the old crossing. Rowan has timber and an idea — will you lend a hand?', after: 'A sturdy bridge spans the river. Rowan waves you across: the library may hold the missing market instructions.', character: 'rowan', person: 'Rowan · Village maker' },
  'whispering-library': { before: 'Behind the sleepy windows, Iona has found a spellbook whose sentences have lost their marks.', after: 'Warm light spills from the library. Iona opens the door and hands you Nessa’s market instructions.', character: 'iona', person: 'Iona · Keeper of stories' },
  'tinkers-workshop': { before: 'Rowan has equal groups of timber to match. Help the sawmill turn again, then bring its supplies to the garden.', after: 'The wheel turns and the supplies are ready. A little sawmill model remembers your work.', character: 'rowan', person: 'Rowan · Village maker' },
  'storywood-forest': { before: 'Your garden marker and Iona’s story map have brought you here. Pip is waiting to help you put the woodland tale in order.', after: 'A path winds between the trees. Follow the written clues and measure the route to find the castle’s missing gear.', character: 'pip-idle', person: 'Pip · Your travelling companion' },
  'clockwork-castle': { before: 'Orin has kept a place for you. Set the clock and arrange the times to open the castle together.', after: 'The clock is running and the door is open. Orin invites you to bring everyone together on the Village Green.', character: 'orin', person: 'Orin · Castle caretaker' },
  'market-square': { before: 'Nessa’s stall is waiting for its first order. The recovered instructions will help you fill the basket.', after: 'Apples and pears fill the stall. Nessa hangs the bunting and sends a flower planter back to the village for you.', character: 'nessa', person: 'Nessa · Market gardener' },
};
const questCopy: Partial<Record<QuestId, string>> = {
  Q4: 'Rowan needs your help matching the timber groups to restart the sawmill.',
  Q5: 'With the workshop supplies, mix the growing potion. The garden will grow a marker toward Storywood.',
  Q6: 'Iona’s recovered books need their shelves. Sort the words, then follow the reading clue to assemble a forest story map.',
  Q7: 'The garden marker and story map are ready. Put the woodland tale in order to reveal the path.',
  Q8: 'Follow the written clues and measure the route. Both ideas will help Pip recover the missing castle gear.',
  Q9: 'Give Orin the gear, set the clock and arrange the time instructions. Both steps will reopen the castle.',
  Q10: 'Plan the gathering with goods, an attendance display and sentence meanings. Bring the kingdom together, one idea at a time.',
};

/** Each trusted SVG stays in its own image document. Result visibility is
 * projected from the committed quest set; art never supplies assessment values. */
function SceneImage({ path, primary, resultIds, assetResolver }: {
  path: string; primary?: string; resultIds: readonly string[]; assetResolver: Props['assetResolver'];
}) {
  const [image, setImage] = useState<{ key: string; url: string } | null>(null), [error, setError] = useState(false);
  const resultKey = resultIds.join('|'), key = path + ':' + resultKey;
  useEffect(() => {
    let disposed = false, url: string | undefined;
    const abort = new AbortController(); setError(false);
    void fetch(assetResolver(path), { signal: abort.signal })
      .then(response => { if (!response.ok) throw new Error('Scene unavailable'); return response.text(); })
      .then(source => {
        const svg = new DOMParser().parseFromString(source, 'image/svg+xml');
        if (svg.querySelector('parsererror')) throw new Error('Scene unavailable');
        svg.querySelectorAll<SVGElement>('[data-result]').forEach(group => { group.style.display = resultIds.includes(group.dataset.result!) ? '' : 'none'; });
        svg.querySelectorAll<SVGElement>('[data-state="initial"]').forEach(group => { group.style.display = primary && resultIds.includes(primary) ? 'none' : ''; });
        url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
        if (!disposed) setImage({ key, url }); else URL.revokeObjectURL(url);
      }).catch(error => { if (!disposed && error.name !== 'AbortError') setError(true); });
    return () => { disposed = true; abort.abort(); if (url) URL.revokeObjectURL(url); };
  }, [path, primary, resultKey, assetResolver, key]);
  return <>{image?.key === key && <img src={image.url} alt="" draggable={false} />}
    {error && <p className="scene-fallback">The illustration could not load. All destinations and instructions are available below.</p>}</>;
}

export function SceneView({ sceneId, resultIds, assetResolver, map = false }: {
  sceneId: SceneId; resultIds: readonly string[]; assetResolver: Props['assetResolver']; map?: boolean;
}) {
  const scene = SCENES.find(s => s.id === sceneId)!;
  const primary: Record<SceneId, string> = { 'river-bridge': 'bridge-restored', 'whispering-library': 'library-restored',
    'market-square': 'market-stocked', 'village-green': 'village-welcome', 'tinkers-workshop': 'sawmill-restored',
    'storywood-forest': 'forest-path-restored', 'clockwork-castle': 'castle-clock-restored' };
  const piece = (path: string, x = 0, y = 0, w = 960, h = 600) => <span key={path} className="adventure-scene-piece"
    style={{ left: x / 9.6 + '%', top: y / 6 + '%', width: w / 9.6 + '%', height: h / 6 + '%' }}>
    <SceneImage path={path} resultIds={resultIds} assetResolver={assetResolver} /></span>;
  const has = (id: string) => resultIds.includes(id);
  return <div className={map ? 'adventure-map-art' : 'adventure-scene-art'} data-scene={sceneId} data-results={resultIds.join('|')}>
    <SceneImage path={map ? 'assets/art/m1/ui/world-map.svg' : 'assets/art/' + scene.milestone.toLowerCase() + '/scenes/' + sceneId + '.svg'}
      primary={primary[sceneId]} resultIds={resultIds} assetResolver={assetResolver} />
    {!map && <>
      {sceneId === 'village-green' && <>
        {has('garden-restored') && piece('assets/art/m2/scenes/green-garden.svg')}
        {has('kingdom-finale') && piece('assets/art/m2/scenes/green-finale.svg')}
        {has('forest-marker') && piece('assets/art/m2/props/forest-marker.svg', 715, 337, 120, 120)}
      </>}
      {sceneId === 'whispering-library' && <>
        {has('books-shelved') && piece('assets/art/m2/scenes/library-shelf.svg')}
        {has('library-restored') && piece('assets/art/m1/props/spellbook.svg', 473, 410, 48, 48)}
        {has('forest-story-map') && piece('assets/art/m2/props/forest-story-map.svg', 513, 400, 48, 48)}
        {has('forest-path-restored') && piece('assets/art/m2/props/forest-tale.svg', 530, 405, 44, 44)}
      </>}
      {sceneId === 'tinkers-workshop' && has('invention-available') && piece('assets/art/m2/props/sawmill-model.svg', 510, 409, 100, 100)}
      {sceneId === 'clockwork-castle' && has('kingdom-finale') && piece('assets/art/m2/scenes/castle-finale.svg')}
    </>}
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
  const [practiceSkill, setPracticeSkill] = useState<SkillId>('M01');
  const [blockedLeave, setBlockedLeave] = useState(false), [quiet, setQuiet] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const panel = useRef<ActivePanelLifecycle | null>(null), pendingDestination = useRef<(() => void | Promise<void>) | null>(null);
  const opening = useRef(false), retainedOpen = useRef<Extract<StateCommand, { kind: 'OpenEncounter' }> | null>(null), retainedCreative = useRef<StateCommand | null>(null);
  const transitioning = useRef(false);
  const [closedResult, setClosedResult] = useState<ClosedWeekResult | null>(null);
  const [festival, setFestival] = useState(false), [festivalSkipped, setFestivalSkipped] = useState(false);
  const festivalTrigger = useRef<HTMLButtonElement>(null), restoreFestivalFocus = useRef(false);
  const visitRefresh = useRef<Promise<CommitResult> | null>(null);
  useEffect(() => {
    let subscribed = true;
    // StrictMode reuses this visit's refresh; no seen flag or calendar logic lives here.
    visitRefresh.current ??= stateController.refresh();
    void visitRefresh.current.then(result => {
      if (!subscribed || (result.status !== 'committed' && result.status !== 'already-applied')) return;
      if (result.snapshot.token.epoch !== snapshot.token.epoch) return;
      setClosedResult([...result.snapshot.save.competition.archives].sort((a, b) => b.week.localeCompare(a.week))[0] ?? null);
    }).catch(() => { /* The normal Hall refresh remains available after a failed visit refresh. */ });
    return () => { subscribed = false; };
  }, [stateController, snapshot.token.epoch]);
  useEffect(() => { if (!festival && restoreFestivalFocus.current) { restoreFestivalFocus.current = false; festivalTrigger.current?.focus(); } }, [festival]);
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
  useEffect(() => { audioController.stopReading(); audioController.setSceneTheme(SCENES.find(s => s.id === sceneId)!.theme); }, [sceneId, audioController]);
  // An activity owns its initial focus, including a resume into another scene.
  useLayoutEffect(() => { if (!encounterId) heading.current?.focus(); }, [sceneId, encounterId]);
  const current = () => alive.current && stateController.getSnapshot().token.epoch === snapshot.token.epoch
    && Object.hasOwn(stateController.getSnapshot().save.profiles, selectedProfileId);
  const world = resolveWorldView({ world: profile.world, creative: profile.creative, entitlements: profile.rewards.entitlementIds, sceneId, milestone: 'M2' });
  const results = committedResultIds(profile.world), completed = profile.world.completedQuestIds.includes('Q3');
  const sceneQuest = QUESTS.find(q => q.sceneId === sceneId && world.availableQuestIds.includes(q.id)) ?? QUESTS.find(q => q.sceneId === sceneId);
  const baseQuest = QUESTS.find(q => q.sceneId === sceneId);
  const restored = sceneId === 'village-green' ? completed : !!baseQuest && profile.world.completedQuestIds.includes(baseQuest.id);
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
      const quest = QUESTS.find(q => q.id === selection.activity.bindingProvenance?.questId);
      if (quest) setScene(quest.sceneId);
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
    void guarded(async () => {
      const savedWorld = stateController.getSnapshot().save.profiles[selectedProfileId].world;
      if (quest && !savedWorld.completedQuestIds.includes(quest as QuestId)) {
        await open({ route: { kind: 'quest', questId: quest }, suppressDueReviewForVisit: false }); return;
      }
      setEncounter(null); setFresh(''); setMessage('');
      const following = QUESTS.find(q => !savedWorld.completedQuestIds.includes(q.id) && q.requiresAll.every(id => savedWorld.completedQuestIds.includes(id)));
      setScene(quest === 'Q3' ? 'village-green' : following?.sceneId ?? 'village-green');
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
  const allowed = (option: CreativeOption) => option.requiresAll.every(q => profile.world.completedQuestIds.includes(q));
  const unfinished = Object.values(profile.encounters).filter(e => e.learningEpisode.status !== 'completed-success');
  const offered = projected?.status === 'ready' && projected.activity.bindingProvenance?.role === 'story'
    ? QUEST_ACTIVITY_BINDINGS.find(b => b.role === 'optional-transfer' && b.sourceBindingId === projected.activity.bindingProvenance?.bindingId) : null;
  if (festival) return <section className="adventure" data-reduced-motion={reduced}><FestivalView result={closedResult} selectedProfileId={selectedProfileId}
    onSkip={() => { restoreFestivalFocus.current = true; setFestivalSkipped(true); setFestival(false); }}
    onOpenHall={() => { void guarded(() => navigation.navigate({ kind: 'leaderboard' })); }} /></section>;
  return <section className="adventure" data-reduced-motion={reduced}>
    <header className="adventure-masthead"><div><p className="adventure-eyebrow">The Lost Kingdom · A village to bring to life</p>
      <p className="adventure-player">{profile.identity.nickname}’s adventure</p></div><button type="button" disabled={busy} onClick={() => { void guarded(() => navigation.navigate({ kind: 'profiles' })); }}>Save & choose player</button></header>
    <nav className="adventure-chapters" aria-label="Your story so far">{QUESTS.map((q, i) => {
      const id = q.id, progress = requiredProgress(profile.world, id), done = profile.world.completedQuestIds.includes(id);
      const reachable = done || q.requiresAll.every(id => profile.world.completedQuestIds.includes(id));
      return <button key={id} disabled={busy || !reachable} aria-current={sceneId === q.sceneId ? 'step' : undefined} onClick={() => goScene(q.sceneId)}>
        <span className="chapter-number" aria-hidden="true">{done ? '✓' : String(i + 1).padStart(2, '0')}</span><span>{['The crossing', 'The spellbook', 'The welcome', 'The workshop', 'The garden', 'The story shelves', 'The forest trail', 'The hidden gear', 'The castle clock', 'The kingdom gathering'][i]}<small>{done ? 'Restored' : reachable ? `${progress.completed} of ${progress.total} story steps` : 'Complete the earlier story steps'}</small></span></button>;
    })}</nav>
    <div className="adventure-scene-layout"><div className="adventure-illustration" ref={illustration}>
      <div className="adventure-scene-canvas"><SceneView sceneId={sceneId} resultIds={results} assetResolver={assetResolver} />
      {sceneId === 'village-green' && <>
        {profile.creative.facadeTrimId === 'home-trim' && profile.rewards.entitlementIds.includes('home-trim') && <img className="adventure-facade" alt="Your saved home trim" src={assetResolver('assets/art/m2/props/home-trim.svg')} />}
        {completed && Object.entries(profile.creative.placements).filter(([, value]) => value !== null).map(([socket, decoration]) => {
          const index = Number(socket.slice(-1)) - 1, x = [310, 490, 668][index % 3], y = index < 3 ? 468 : 548;
          return <span key={socket} className="adventure-saved-decoration" style={{ left: (x - 60) / 9.6 + '%', top: (y - 108) / 6 + '%' }}
            aria-label={decoration === 'planter' ? 'Your saved ' + profile.creative.flowerColourId + ' planter' : 'Your saved ' + decoration + ' in spot ' + (index + 1)} role="img">
            {index >= 3 && <img className="adventure-extra-socket" src={assetResolver('assets/art/m1/ui/plot-socket.svg')} alt="" />}
            <img src={assetResolver('assets/art/' + (decoration === 'planter' ? 'm1' : 'm2') + '/props/decoration-' + decoration + '.svg')} alt="" />
            {decoration === 'planter' && <><img src={assetResolver('assets/art/m1/props/flowers-' + profile.creative.flowerColourId + '.svg')} alt="" />
              {profile.creative.planterRimId && profile.rewards.entitlementIds.includes('planter-rim') && <img src={assetResolver('assets/art/m1/props/planter-rim.svg')} alt="" />}</>}
          </span>;
        })}
      </>}</div>
      <span className="scene-caption">{restored ? 'A change you made. A place that remembers.' : 'Every little idea can make a difference.'}</span>
    </div><div className="adventure-story"><p className="adventure-eyebrow">{restored ? 'Restored, thanks to you' : sceneQuest ? 'Your next little adventure' : 'Welcome, explorer'}</p>
      <h1 ref={heading} tabIndex={-1}>{scene.title}</h1><p className="adventure-story-copy">{restored ? copy.after : copy.before}</p>
      {copy.character && <div className="adventure-neighbour"><img src={assetResolver(`assets/art/${copy.character === 'orin' ? 'm2' : 'm1'}/characters/${copy.character}.svg`)} alt="" /><span>{copy.person}</span></div>}
      {sceneQuest && world.availableQuestIds.includes(sceneQuest.id) && questCopy[sceneQuest.id] && <p className="adventure-story-copy">{questCopy[sceneQuest.id]} <span className="adventure-note">{requiredProgress(profile.world, sceneQuest.id).completed} of {requiredProgress(profile.world, sceneQuest.id).total} story steps saved.</span></p>}
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
      activity={projected.activity} appearance={profile.creative} stateController={stateController} audioController={audioController} activePanelHost={scopedHost}
      onLeave={() => { void guarded(() => { setEncounter(null); setMessage(''); setFresh(''); heading.current?.focus(); }); }} onContinue={next}
      onTransfer={offered ? () => requestActivity({ kind: 'optional-transfer', bindingId: offered.bindingId }) : undefined} onCommitted={committed} />}
    {projected?.status === 'unavailable' && <section className="recovery"><h2>Saved activity unavailable</h2><p>{projected.reason}. Your saved progress has not been replaced.</p><button onClick={() => navigation.navigate({ kind: 'profiles' })}>Return to players</button></section>}
    {creative && <><CreativePlot key={`${selectedProfileId}:${snapshot.token.epoch}`} saved={profile.creative} world={profile.world} availableChoices={{
      scarfColours: CREATIVE_CHOICES.scarfColours.filter(allowed), flowerColours: CREATIVE_CHOICES.flowerColours.filter(allowed),
      decorations: CREATIVE_CHOICES.decorations.filter(allowed), cosmetics: CREATIVE_CHOICES.cosmetics.filter(allowed), sockets: CREATIVE_CHOICES.sockets,
    }} entitlements={profile.rewards.entitlementIds} pending={busy} saveStatus={saveStatus} onSave={choice => { void saveCreative(choice); }} onCancel={() => setSaveStatus('idle')} />
      <button disabled={busy} onClick={() => { setCreative(false); heading.current?.focus(); }}>Back to village · discard any unsaved preview</button></>}
    {!encounterId && !creative && <>
      {closedResult && <aside className="adventure-festival-offer"><h2>A saved village gathering</h2><p>The latest closed weekly result is ready to visit. Your story can continue whenever you like.</p>
        <button ref={festivalTrigger} onClick={() => { void guarded(() => setFestival(true)); }}>{festivalSkipped ? 'Replay the Festival' : 'Visit the Festival'}</button>
        {!festivalSkipped && <button onClick={() => setFestivalSkipped(true)}>Skip Festival for this visit</button>}</aside>}
      {profile.world.completedQuestIds.includes('Q10') && <section className="adventure-ending" aria-label="Kingdom story finale"><p className="adventure-eyebrow">A Kingdom Together</p><h2>Your kingdom is together again</h2>
        <p>{profile.identity.nickname}, you, Pip, Rowan, Iona, Nessa and Orin have brought every part of this place to life. The gathering on the Green and the welcome at the castle are saved.</p>
        <p>Keep exploring, make your corner your own, or rest for another day. This story ending belongs to you.</p></section>}
      {completed && <section className="adventure-ending"><p className="adventure-eyebrow">The village welcome</p><h2>Your first adventure is complete</h2>
        <p>A crossing, a light in the library, a bustling market. Your ideas brought them back.</p><p>Your flower planter is ready to make your own. All three flower colours and six garden spots are free. There is always room to explore, create and practise at your own pace.</p>
        <button className="adventure-primary" onClick={() => choose({ kind: 'creative' })}>Customise and place your planter</button>
        <button onClick={() => requestActivity({ kind: 'practice', mode: 'suggested' })}>Choose some practice</button>
        <button onClick={() => choose({ kind: 'hall' })}>Visit the Hall</button><button onClick={() => navigation.navigate({ kind: 'profiles' })}>Resume another day</button></section>}
      {completed && <details className="adventure-practice"><summary>More ways to explore · optional practice</summary>
        <p>Choose a topic to try, or revisit a familiar idea. Practice never replaces a missing story step.</p>
        <label>Practice topic <select aria-label="Practice topic" value={practiceSkill} onChange={event => setPracticeSkill(event.target.value as SkillId)}>{SKILLS.map(skill => <option key={skill.skillId} value={skill.skillId}>{skill.label}</option>)}</select></label>
        <button onClick={() => requestActivity({ kind: 'practice', skillId: practiceSkill, mode: 'suggested' })}>Explore this topic</button>
        <button onClick={() => requestActivity({ kind: 'practice', skillId: practiceSkill, mode: 'repeat' })}>Revisit a familiar idea</button></details>}
      {unfinished.length > 0 && <section className="adventure-resume"><h2>Your saved ideas</h2>{unfinished.map(e => <button key={e.encounterId} disabled={busy} onClick={() => resumeActivity(e.encounterId)}>
        Resume {e.bindingProvenance?.questId ? QUEST_TITLES[e.bindingProvenance.questId as QuestId] : 'practice'}{e.bindingProvenance?.role === 'optional-transfer' ? ' · optional challenge' : ''}</button>)}</section>}
      <section className="adventure-map"><div><p className="adventure-eyebrow">Take the scenic route</p><h2>A village worth exploring</h2>
        <p>{profile.world.completedQuestIds.includes('Q1') ? 'The bridge is open. Follow your curiosity.' : 'Meet Rowan at the river to open the path to the library and market.'}</p>
        <nav aria-label="Village destinations">{world.hotspots.filter(h => h.intent.kind !== 'quest' && h.intent.kind !== 'practice').map(h => <SceneHotspot key={h.id} hotspot={h} onChoose={choose} disabled={busy} />)}</nav>
        <p className="adventure-note">Two trails meet at Storywood: restore the workshop and garden, and recover Iona’s stories. The hidden gear leads onward to Orin’s castle.</p>
        <ul className="adventure-locked-places">{SCENES.filter(s => !sceneReachable(s.id, profile.world)).map(s => <li key={s.id}>{s.title} · {s.id === 'storywood-forest' ? 'Needs the garden and story shelves' : s.id === 'clockwork-castle' ? 'Needs the hidden gear' : s.id === 'tinkers-workshop' ? 'Needs the village welcome' : 'Needs the crossing'}</li>)}</ul></div>
        <SceneView sceneId={sceneId} resultIds={results} assetResolver={assetResolver} map />
      </section>
      {discovery && <aside className="adventure-discovery" role="status"><img alt="" src={assetResolver(`assets/art/${DISCOVERIES.find(d => d.id === discovery)?.milestone.toLowerCase()}/props/${DISCOVERIES.find(d => d.id === discovery)?.assetId}.svg`)} />
        <p>{DISCOVERIES.find(d => d.id === discovery)?.label}. A small moment, just for you.</p><button onClick={() => setDiscovery(null)}>Back to exploring</button></aside>}
    </>}
  </section>;
}
