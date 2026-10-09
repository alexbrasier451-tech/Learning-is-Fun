import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AdultArea } from '../adult/AdultArea';
import { AudioControls, StopReading } from '../audio/AudioControls';
import { AdventureView } from '../experience/AdventureView';
import { assetUrl } from '../platform/assets';
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
  const main = useRef<HTMLElement>(null), notice = useRef<HTMLDivElement>(null), help = useRef<HTMLDialogElement>(null), helpButton = useRef<HTMLButtonElement>(null);
  const binding = useRef({ profile: selectedProfileId, epoch: snapshot.token.epoch });
  binding.current = { profile: selectedProfileId, epoch: snapshot.token.epoch };
  const previousEpoch = useRef(snapshot.token.epoch), alive = useRef(true), helpReturn = useRef<AppView>({ kind: 'profiles' });
  type Request = { destination: AppView; profile: ProfileId | null; owner: ProfileId | null; epoch: string; registration: ReturnType<AppRuntime['panels']['current']>; opener: HTMLElement | null; saveOnly: boolean };
  const request = useRef<Request | null>(null), inFlight = useRef(false);
  useSyncExternalStore(runtime.panels.subscribe, runtime.panels.getVersion, runtime.panels.getVersion);
  const readiness = state.getUpdateReadiness();
  const validSelection = previousEpoch.current === snapshot.token.epoch && selectedProfileId !== null && Object.hasOwn(snapshot.save.profiles, selectedProfileId);
  const sameBinding = (captured: Request) => alive.current && binding.current.profile === captured.owner
    && state.getSnapshot().token.epoch === captured.epoch && runtime.panels.current() === captured.registration
    && (captured.owner === null || Object.hasOwn(state.getSnapshot().save.profiles, captured.owner));
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    if (previousEpoch.current !== snapshot.token.epoch || (selectedProfileId !== null && !validSelection)) {
      previousEpoch.current = snapshot.token.epoch;
      request.current = null; inFlight.current = false; runtime.panels.resetBinding();
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
        if (captured.registration) {
          runtime.audio.stopReading();
          setView({ kind: 'world' }); setAdventureVisit(visit => visit + 1);
          setMessage(saved.ready ? 'Your progress is saved. Choose where to explore next.'
            : 'Your activity is saved. Some other changes still need saving; retry the action that could not save.');
        } else setMessage(saved.ready ? 'Your progress is saved.' : 'Some changes still need saving. Stay here and retry the action that could not save.');
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
  function navigate(destination: AppView, profile = selectedProfileId, saveOnly = false) {
    if (inFlight.current) return;
    const captured: Request = { destination, profile, saveOnly, owner: selectedProfileId, epoch: snapshot.token.epoch,
      registration: runtime.panels.current(), opener: document.activeElement as HTMLElement };
    request.current = captured; void run(captured);
  }
  const navigation = useMemo<NavigationPort>(() => ({ navigate: destination => navigate(destination) }), [selectedProfileId, snapshot.token.epoch, view]);
  const returnToAdventure = () => navigate({ kind: validSelection ? 'world' : 'profiles' });
  const closeHelp = () => navigate(helpReturn.current);
  return <div className="app-shell">
    <a className="shell-skip" href="#story">Skip to your story</a>
    <header className="shell-header"><a className="shell-brand" href="#story"><img src={assetUrl('assets/art/m1/characters/pip-idle.svg')} alt="" /><span>Learning is Fun<small>A little learning. A lasting adventure.</small></span></a></header>
    <div className="shell-soundbar"><AudioControls controller={runtime.audio} /></div>
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
      <details className="shell-credits"><summary>Music credits</summary>{assetRegister.assets.filter(record => record.status === 'ready' && record.permission.kind === 'reused').map(record => <article key={record.id}>
        <h3>{record.id === 'village-loop' ? 'Market on the Sea' : 'Sunset Walk'}</h3><p>{record.attribution}</p>
        <p>Creator: {record.id === 'village-loop' ? <a href="https://www.jshaw.co.uk/">{record.author}</a> : record.author}. <a href={record.sourceUrl}>Original source</a> · <a href={record.permission.licenceUrl}>{record.permission.licence} {record.permission.version}</a></p>
        <p>Changes for this game: {record.modifications}</p></article>)}</details>
      <button onClick={closeHelp}>Back to my story</button> <button onClick={runtime.audio.silenceAll}>Silence all</button> <StopReading controller={runtime.audio} /></dialog>
    <footer className="shell-footer">Made for curious explorers · Saved on this browser</footer>
  </div>;
}
