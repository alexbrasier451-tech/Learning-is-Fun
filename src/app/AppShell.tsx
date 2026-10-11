import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AdultArea } from '../adult/AdultArea';
import { AudioControls, StopReading } from '../audio/AudioControls';
import { AdventureView } from '../experience/AdventureView';
import { assetUrl } from '../platform/assets';
import { BUILD_ID } from '../platform/appIdentity';
import { requestFullscreen } from '../platform/fullscreen';
import { ProfileChooser } from '../profiles/ProfileChooser';
import { HallOfChampions } from '../rewards/HallOfChampions';
import type { HallRefreshStatus } from '../rewards/HallOfChampions';
import { PersonalHistory } from '../rewards/PersonalHistory';
import { buildLeaderboardReadModel } from '../rewards/standings';
import { localDateAt, weekKeyFor } from '../rewards/calendar';
import type { LeaderboardReadModel } from '../rewards/contracts';
import type { ProfileId } from '../state/contracts';
import type { AppRuntime } from './createAppRuntime';
import type { AppView, NavigationPort } from './navigation';
import { useGameSnapshot, useStateController } from './StateControllerProvider';
import assetRegister from '../../assets/asset-register.json';

function Hall({ onClose }: { onClose(): void }) {
  const state = useStateController(), snapshot = useGameSnapshot();
  const [model, setModel] = useState<LeaderboardReadModel | null>(null), [status, setStatus] = useState<HallRefreshStatus>('loading');
  const [history, setHistory] = useState<ProfileId | null>(null);
  const busy = useRef(false), alive = useRef(true), presentedToken = useRef('');
  async function refresh() {
    if (busy.current) return; busy.current = true; setStatus(model ? 'refreshing' : 'loading');
    try {
      const result = await state.refresh();
      if (!alive.current) return;
      if (result.status !== 'committed' && result.status !== 'already-applied') { setStatus(result.status === 'conflict' ? 'stale' : 'failed'); return; }
      const observedLocalDate = localDateAt(Date.now()), observedWeek = weekKeyFor(observedLocalDate);
      const activeWeek = result.snapshot.save.competition.latestOpenedWeek;
      if (!activeWeek || observedWeek > activeWeek) { setStatus('stale'); return; }
      setModel(buildLeaderboardReadModel({ competition: result.snapshot.save.competition,
        profiles: Object.values(result.snapshot.save.profiles).map(p => ({ ...p.identity, lifetimePoints: p.rewards.lifetimePoints, personalRecords: p.personalRecords })),
        context: { observedLocalDate, activeWeek, clockRollback: observedWeek < activeWeek } }));
      presentedToken.current = JSON.stringify(result.snapshot.token); setStatus('ready');
    } catch { if (alive.current) setStatus('failed'); }
    finally { busy.current = false; }
  }
  useEffect(() => { alive.current = true; void refresh(); return () => { alive.current = false; }; }, []);
  useEffect(() => { if (!busy.current && model && presentedToken.current !== JSON.stringify(snapshot.token)) setStatus('stale'); }, [snapshot, model]);
  if (!model) return <section className="shell-paper"><h1 tabIndex={-1}>Hall of Champions</h1><p role="status">{status === 'loading' ? 'Checking your saved results…' : 'Your saved results could not be checked. Try again.'}</p>
    <button disabled={status === 'loading'} onClick={() => void refresh()}>Check calendar</button><button onClick={onClose}>Back to adventure</button></section>;
  return history ? <PersonalHistory profileId={history} model={model} onBack={() => {
    const id = history; setHistory(null); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`.hall-player[data-profile="${CSS.escape(id)}"] button`)?.focus());
  }} /> : <HallOfChampions model={model} refreshStatus={status} onRefresh={() => void refresh()} onClose={onClose}
    onOpenHistory={id => setHistory(id)} />;
}

export function AppShell({ runtime }: { runtime: AppRuntime }) {
  const snapshot = useGameSnapshot(), state = useStateController();
  const [view, setView] = useState<AppView>({ kind: 'profiles' }), [selectedProfileId, setSelected] = useState<ProfileId | null>(null);
  const [adventureVisit, setAdventureVisit] = useState(0);
  const [message, setMessage] = useState(''), [failed, setFailed] = useState(false), [pending, setPending] = useState(false), [paused, setPaused] = useState(false);
  const [fullscreenMessage, setFullscreenMessage] = useState('');
  const [approvedUpdate, setApprovedUpdate] = useState<{ epoch: string; profile: ProfileId | null; waitingBuildId: string } | null>(null);
  const shell = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null), notice = useRef<HTMLDivElement>(null), help = useRef<HTMLDialogElement>(null), helpButton = useRef<HTMLButtonElement>(null);
  const binding = useRef({ profile: selectedProfileId, epoch: snapshot.token.epoch });
  binding.current = { profile: selectedProfileId, epoch: snapshot.token.epoch };
  const previousEpoch = useRef(snapshot.token.epoch), alive = useRef(true), helpReturn = useRef<AppView>({ kind: 'profiles' });
  type Request = { destination: AppView; profile: ProfileId | null; owner: ProfileId | null; epoch: string; registration: ReturnType<AppRuntime['panels']['current']>; opener: HTMLElement | null; saveOnly: boolean; waitingBuildId: string | null };
  const request = useRef<Request | null>(null), inFlight = useRef(false);
  useSyncExternalStore(runtime.panels.subscribe, runtime.panels.getVersion, runtime.panels.getVersion);
  // The facade's committed snapshot is stable during queue/preference changes.
  // Subscribe to its readiness projection too, without a second state store.
  const readinessSnapshot = useMemo(() => () => JSON.stringify(state.getUpdateReadiness()), [state]);
  useSyncExternalStore(state.subscribe, readinessSnapshot, readinessSnapshot);
  const offline = useSyncExternalStore(runtime.offline.subscribe, runtime.offline.getSnapshot, runtime.offline.getSnapshot);
  const readiness = state.getUpdateReadiness();
  const readyOffline = !!offline && offline.activeBuildId === offline.pageBuildId && offline.activeInventoryComplete;
  const canCloseForUpdate = !!approvedUpdate && approvedUpdate.epoch === snapshot.token.epoch && approvedUpdate.profile === selectedProfileId
    && approvedUpdate.waitingBuildId === offline?.waitingBuildId && readiness.ready && !pending && runtime.panels.current() === null;
  const validSelection = previousEpoch.current === snapshot.token.epoch && selectedProfileId !== null && Object.hasOwn(snapshot.save.profiles, selectedProfileId);
  const sameBinding = (captured: Request) => alive.current && binding.current.profile === captured.owner
    && state.getSnapshot().token.epoch === captured.epoch && runtime.panels.current() === captured.registration
    && (captured.owner === null || Object.hasOwn(state.getSnapshot().save.profiles, captured.owner));
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    const changed = () => { if (!document.fullscreenElement) setFullscreenMessage('Back in your browser tab. Your story is still here.'); };
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  useEffect(() => {
    if (previousEpoch.current !== snapshot.token.epoch || (selectedProfileId !== null && !validSelection)) {
      previousEpoch.current = snapshot.token.epoch;
      request.current = null; inFlight.current = false; runtime.panels.resetBinding();
      setApprovedUpdate(null);
      runtime.audio.stopReading(); setSelected(null); setView({ kind: 'profiles' }); setFailed(false); setPending(false);
      setMessage('Choose an explorer for this saved story.');
    }
  }, [snapshot, selectedProfileId, validSelection, runtime]);
  useEffect(() => { main.current?.querySelector<HTMLElement>('h1')?.focus(); }, [view.kind, selectedProfileId]);
  useEffect(() => {
    if (view.kind === 'help') { if (!help.current?.open) help.current?.showModal(); help.current?.querySelector<HTMLButtonElement>('button')?.focus(); }
    else if (help.current?.open) { help.current.close(); requestAnimationFrame(() => helpButton.current?.focus()); }
  }, [view.kind]);
  useEffect(() => { if (failed) notice.current?.focus(); }, [failed]);
  function block(text: string) { runtime.panels.setTransition(false, true); setFailed(true); setMessage(text); }
  async function run(captured: Request, discard = false) {
    if (inFlight.current || !sameBinding(captured)) return;
    inFlight.current = true; setPending(true); setFailed(false); setMessage('Saving your place…'); runtime.panels.setTransition(true, false);
    setApprovedUpdate(null);
    try {
      const result = captured.registration ? (discard ? captured.registration.panel.discardDraft() : await captured.registration.panel.suspend()) : { status: 'ready' } as const;
      if (!sameBinding(captured)) return;
      const status = captured.registration?.panel.getStatus();
      if (result.status === 'blocked') { block(result.message); return; }
      if (status && (status.dirty || status.pending || status.failed)) { block('Your activity is still waiting to save. Retry or stay here.'); return; }
      runtime.panels.setTransition(false, false);
      const transient = runtime.panels.readTransientReadiness();
      if (transient.dirty || transient.pending || transient.failed) { block('Your activity still needs saving. Stay here until it can leave safely.'); return; }
      if (captured.saveOnly) {
        const saved = await state.flush();
        if (!sameBinding(captured)) return;
        const currentReadiness = state.getUpdateReadiness();
        if (captured.registration) {
          runtime.audio.stopReading();
          setView({ kind: 'world' }); setAdventureVisit(visit => visit + 1);
          setMessage(saved.ready && currentReadiness.ready ? 'Your progress is saved. Choose where to explore next.'
            : 'Your activity is saved. Some other changes still need saving; retry the action that could not save.');
        } else setMessage(saved.ready && currentReadiness.ready ? 'Your progress is saved.' : 'Some changes still need saving. Stay here and retry the action that could not save.');
        if (captured.waitingBuildId && saved.ready && currentReadiness.ready && runtime.offline.getSnapshot()?.waitingBuildId === captured.waitingBuildId) {
          setApprovedUpdate({ epoch: captured.epoch, profile: captured.owner, waitingBuildId: captured.waitingBuildId });
        }
        request.current = null; return;
      }
      if (captured.profile !== null && !Object.hasOwn(state.getSnapshot().save.profiles, captured.profile)) {
        request.current = null; setSelected(null); setView({ kind: 'profiles' }); setMessage('That explorer is no longer available. Choose an explorer.'); return;
      }
      runtime.audio.stopReading();
      if (captured.destination.kind === 'help') helpReturn.current = view;
      if (captured.destination.kind === 'world' || captured.destination.kind === 'activity') setAdventureVisit(visit => visit + 1);
      setSelected(captured.profile); setView(captured.destination); setMessage(''); setFailed(false); request.current = null;
    } catch { if (sameBinding(captured)) block('Your place could not be saved. Your idea is still here. Retry, stay, or choose to discard your unsaved draft.'); }
    finally { if (sameBinding(captured)) { inFlight.current = false; setPending(false); runtime.panels.setTransition(false, request.current !== null); } }
  }
  function navigate(destination: AppView, profile = selectedProfileId, saveOnly = false, waitingBuildId: string | null = null) {
    if (inFlight.current) return;
    const captured: Request = { destination, profile, saveOnly, owner: selectedProfileId, epoch: snapshot.token.epoch,
      registration: runtime.panels.current(), opener: document.activeElement as HTMLElement, waitingBuildId };
    request.current = captured; void run(captured);
  }
  const navigation = useMemo<NavigationPort>(() => ({ navigate: destination => navigate(destination) }), [selectedProfileId, snapshot.token.epoch, view]);
  const returnToAdventure = () => navigate({ kind: validSelection ? 'world' : 'profiles' });
  const closeHelp = () => navigate(helpReturn.current);
  async function openFullscreen() {
    if (!shell.current) return;
    const result = await requestFullscreen(shell.current);
    if (!alive.current) return;
    setFullscreenMessage(result === 'entered' ? 'Fullscreen opened. Use Escape or your browser to leave fullscreen.'
      : result === 'unavailable' ? 'Fullscreen is unavailable here. You can keep playing in this tab.'
        : 'Fullscreen was not opened. You can keep playing in this tab.');
  }
  return <div className="app-shell" ref={shell}>
    <a className="shell-skip" href="#story">Skip to your story</a>
    <header className="shell-header"><a className="shell-brand" href="#story"><img src={assetUrl('assets/art/m1/characters/pip-idle.svg')} alt="" /><span>Learning is Fun<small>A little learning. A lasting adventure.</small></span></a></header>
    <div className="shell-soundbar"><AudioControls controller={runtime.audio} retrySavingPreferences={state.preferences.retry} /></div>
    <div className="shell-navigation"><nav aria-label="Your story">
      <button disabled={pending} aria-current={view.kind === 'profiles' ? 'page' : undefined} onClick={() => navigate({ kind: 'profiles' })}>Explorers</button>
      <button disabled={pending || !validSelection} aria-current={view.kind === 'world' || view.kind === 'activity' ? 'page' : undefined} onClick={returnToAdventure}>Adventure</button>
      <button disabled={pending} aria-current={view.kind === 'leaderboard' ? 'page' : undefined} onClick={() => navigate({ kind: 'leaderboard' })}>Hall of Champions</button>
      <button ref={helpButton} disabled={pending} onClick={() => navigate({ kind: 'help' })}>Help</button>
      <button disabled={pending} onClick={() => navigate({ kind: 'adult-entry' })}>Grown-ups</button>
    </nav><label className="shell-explorer">Explorer <select aria-label="Active explorer" value={validSelection ? selectedProfileId! : ''} disabled={pending} onChange={e => {
      if (e.target.value) navigate({ kind: 'world' }, e.target.value); else navigate({ kind: 'profiles' }, null);
    }}><option value="">Choose an explorer</option>{Object.values(snapshot.save.profiles).map(p => <option key={p.identity.profileId} value={p.identity.profileId}>{p.identity.nickname}</option>)}</select></label></div>
    <div className="shell-save"><p role="status">{message || (readiness.ready ? 'Your saved story is safe here.' : 'Your latest changes are waiting to be saved.')}</p>
      <button disabled={pending} onClick={() => navigate(view, selectedProfileId, true)}>Save progress</button>
      <button aria-pressed={paused} onClick={() => { const next = !paused; setPaused(next); runtime.setPaused(next); }}>{paused ? 'Resume sound' : 'Pause sound'}</button></div>
    <section className="shell-platform" aria-label="Offline play and fullscreen">
      <div><p className="shell-offline-status" role="status">{readyOffline ? 'Ready offline' : !offline || offline.phase === 'preparing' ? 'Preparing offline play…'
        : offline.phase === 'unsupported' ? 'Offline play is unavailable in this browser.' : 'Offline preparation incomplete. You can keep playing online.'}</p>
        {!readyOffline && <p>Keep this game online while it prepares. Your saved story is separate from offline preparation.</p>}
        {offline?.waitingBuildId && <p>An update is waiting for your next launch. Save your place before closing any game tabs or windows.</p>}
        {offline?.phase === 'update-waiting' && !offline.waitingBuildId && <p>An update is waiting, but it could not be checked yet. Try preparation again.</p>}
        {readyOffline && offline?.reason && <p>The current offline game is ready. A newer download may need another try.</p>}
        {canCloseForUpdate && <p className="shell-update-instructions" role="status"><strong>Your progress is saved.</strong> Close <strong>all</strong> Learning is Fun game tabs and windows, then reopen the game to use the update. Leave other browser tabs open if you wish.</p>}
      </div><div className="shell-platform-actions">
        <button onClick={() => { void runtime.offline.retryPreparation(); }}>Retry offline preparation</button>
        {offline?.waitingBuildId && <button disabled={pending} onClick={() => navigate(view, selectedProfileId, true, offline.waitingBuildId)}>Update on next launch</button>}
        <button onClick={() => { void openFullscreen(); }}>Open fullscreen</button>
      </div>{fullscreenMessage && <p className="shell-fullscreen-status" role="status">{fullscreenMessage}</p>}
    </section>
    {failed && <div ref={notice} tabIndex={-1} className="shell-leave" role="alert"><h2>Your idea is still here</h2><p>{message}</p><div>
      <button disabled={pending} onClick={() => request.current && void run(request.current)}>Retry saving and continue</button>
      <button onClick={() => request.current?.opener?.isConnected && request.current.opener.focus()}>Stay with my idea</button>
      <button disabled={pending} onClick={() => request.current && void run(request.current, true)}>Discard unsaved draft and continue</button></div></div>}
    <main id="story" ref={main} tabIndex={-1} className="shell-main" aria-busy={pending}>
      {(view.kind === 'world' || view.kind === 'activity') && validSelection ? <AdventureView key={`${selectedProfileId}:${snapshot.token.epoch}:${adventureVisit}`} selectedProfileId={selectedProfileId!}
        activePanelHost={runtime.panels.host} stateController={state} audioController={runtime.audio} navigation={navigation} assetResolver={assetUrl} />
        : view.kind === 'leaderboard' ? <Hall onClose={returnToAdventure} />
        : view.kind === 'adult-entry' || view.kind === 'adult' ? <AdultArea snapshot={snapshot} selectedProfileId={validSelection ? selectedProfileId : null}
          preferenceController={state.preferences} dispatch={state} backupActions={{ ...state.backupActions, exportRawRecoveryData: state.exportRawRecoveryData }} onExit={returnToAdventure} />
        : view.kind === 'help' ? <section className="shell-paper"><h1 tabIndex={-1}>A helping paw</h1><p>Take your time. Your adventure will wait.</p></section>
        : <ProfileChooser snapshot={snapshot} selectedProfileId={validSelection ? selectedProfileId : null} dispatch={state} onSelectProfile={id => navigate({ kind: 'world' }, id)} />}
    </main>
    <dialog className="shell-help" ref={help} aria-labelledby="help-title" onCancel={event => { event.preventDefault(); closeHelp(); }}>
      <img src={assetUrl('assets/art/m1/characters/pip-help.svg')} alt="" /><h2 id="help-title">A helping paw</h2>
      <p>Explore with Pip. Choose a place, read its story, and try your idea. There is no rush.</p>
      <p>Use Tab to move and Enter or Space to choose. Puzzle pieces can be selected and placed with buttons as well as dragged.</p>
      <p>Check my idea lets you try an answer. Help is there when you need it. Your adventure works with all sound off.</p>
      <p>Leaving an activity saves your place first. If saving fails, your idea stays here while you retry or choose to discard the unsaved draft.</p>
      <p>Saved stories belong to this browser. A grown-up can keep a backup. Closing the browser may lose edits that have not saved.</p>
      <p>For offline play, first open the game with a connection and wait for Ready offline. Without an earlier complete preparation, an offline first visit may show your browser’s connection error.</p>
      <p>Your browser can clear saved stories or offline files when its storage is cleared or space is needed. Keep a manual backup with a grown-up; offline preparation is not a backup.</p>
      <p>An update waits for your next launch. Use Update on next launch to save first, then close all game tabs and windows and reopen. The game will not reload itself during play.</p>
      <p>Fullscreen is optional. You can leave it and keep playing in a normal tab. If your browser offers installation, you may use its own menu; installation is not required.</p>
      <p>Game version: {BUILD_ID}</p>
      <details className="shell-credits"><summary>Music credits</summary>{assetRegister.assets.filter(record => record.status === 'ready' && record.permission.kind === 'reused').map(record => <article key={record.id} style={{ overflowWrap: 'anywhere' }}>
        <h3>{record.id === 'village-loop' ? 'Market on the Sea / Sleep Talking' : 'Sunset Walk / Sleep Talking'}</h3><p>{record.attribution}</p>
        <p>Creator: {record.author}. <a href={record.sourceUrl}>Primary component source</a> · <a href={record.permission.licenceUrl}>Primary component licence: {record.permission.licence} {record.permission.version}</a></p>
        <p>Changes for this game: {record.modifications}</p></article>)}</details>
      <button onClick={closeHelp}>Back to my story</button> <button onClick={runtime.audio.silenceAll}>Silence all</button> <StopReading controller={runtime.audio} /></dialog>
    <footer className="shell-footer">Made for curious explorers · Saved on this browser</footer>
  </div>;
}
