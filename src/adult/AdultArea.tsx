import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { CommittedSnapshot, StateCommand } from '../state/contracts';
import type { PreferenceController } from '../state/preferences';
import type { LearningSummary } from '../learning/contracts';
import { summarizeLearning } from '../learning/summarize';
import { listTasks } from '../content/catalogue';
import { assetUrl } from '../platform/assets';
import { ProfileAvatar } from '../profiles/ProfileChooser';
import { BackupPanel, downloadBackupFile } from './BackupPanel';
import { ProgressView } from './ProgressView';
import type { BackupActions, ProfileDispatch } from './adultProfilesPorts';
import './adult.css';

export type AdultAreaProps = Readonly<{
  snapshot: CommittedSnapshot;
  selectedProfileId: string | null;
  preferenceController: PreferenceController;
  dispatch: ProfileDispatch;
  backupActions: BackupActions;
  onExit(): void;
  /** View-only injection for a dated producer summary fixture. */
  summaries?: readonly LearningSummary[];
  todayDate?: string;
}>;
type DestructiveKind = 'DeleteProfile' | 'StartOver' | 'ResetSave';
type DestructivePreview = { command: StateCommand; kind: DestructiveKind; names: readonly string[]; profileId: string | null; attempted: boolean };
export function AdultArea({ snapshot, selectedProfileId, preferenceController, dispatch, backupActions, onExit, summaries, todayDate }: AdultAreaProps) {
  const [entry, setEntry] = useState<'closed' | 'explanation' | 'open'>('closed');
  const [viewedId, setViewedId] = useState<string | null>(selectedProfileId);
  const [preview, setPreview] = useState<DestructivePreview | null>(null), [pending, setPending] = useState(false), [message, setMessage] = useState('');
  const [backupBusy, setBackupBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null), entryButton = useRef<HTMLButtonElement>(null), dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null), opener = useRef<HTMLElement | null>(null), id = useId();
  const preferences = useSyncExternalStore(preferenceController.subscribe, preferenceController.getStatus);
  const profiles = Object.values(snapshot.save.profiles), profile = viewedId ? snapshot.save.profiles[viewedId] : undefined;
  const requested = profile ? preferences.requestedProfileById[profile.identity.profileId] ?? profile.preferences : undefined;
  const stale = !!preview && (preview.command.expected.epoch !== snapshot.token.epoch || preview.command.expected.revision !== snapshot.token.revision);
  const date = todayDate ?? new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  useEffect(() => { if (entry !== 'closed') heading.current?.focus(); else entryButton.current?.focus(); }, [entry]);
  useEffect(() => { if (entry !== 'open') setViewedId(selectedProfileId); }, [entry, selectedProfileId]);
  useEffect(() => {
    if (preview && !dialog.current?.open) { dialog.current?.showModal(); cancelButton.current?.focus(); }
    if (!preview && dialog.current?.open) { dialog.current.close(); if (opener.current?.isConnected && !opener.current.hasAttribute('disabled')) opener.current.focus(); else heading.current?.focus(); }
  }, [preview]);
  function leave() { setEntry('closed'); setPreview(null); setMessage(''); onExit(); }
  function buildPreview(kind: DestructiveKind, profileId: string | null): DestructivePreview | null {
    const target = profileId ? snapshot.save.profiles[profileId] : undefined;
    if (kind !== 'ResetSave' && !target) { setMessage('That profile is no longer available. Choose an existing profile.'); return null; }
    const command = dispatch.prepareCommand(kind === 'ResetSave' ? { kind, payload: {} } : kind === 'DeleteProfile'
      ? { kind, profileId: profileId!, payload: {} }
      : { kind, profileId: profileId!, payload: { nickname: target!.identity.nickname, avatarId: target!.identity.avatarId } });
    return { kind, command: { ...command, expected: snapshot.token }, profileId, attempted: false, names: kind === 'ResetSave' ? profiles.map(p => p.identity.nickname) : [target!.identity.nickname] };
  }
  function openPreview(kind: DestructiveKind, element: HTMLElement) {
    opener.current = element; setMessage('');
    try { setPreview(buildPreview(kind, kind === 'ResetSave' ? null : profile?.identity.profileId ?? null)); }
    catch { setMessage('This action is unavailable until the save is ready.'); }
  }
  async function confirm() {
    if (!preview || pending || stale) return;
    const captured = preview; setPreview({ ...captured, attempted: true }); setPending(true); setMessage('Saving the confirmed change…');
    try {
      const result = await dispatch.dispatch(captured.command);
      if (result.status === 'committed' || result.status === 'already-applied') {
        setPreview(null); setMessage(captured.kind === 'ResetSave' ? 'App reset committed. Return to the profile chooser.' : `${captured.names[0]}: ${captured.kind === 'StartOver' ? 'start over committed with a new profile identity' : 'deletion committed'}. Return to the profile chooser.`);
      } else if (result.status === 'conflict') setMessage('Not changed. The save changed; update the preview and confirm the newly displayed affected profiles.');
      else setMessage(`Not changed. ${result.reason.message}`);
    } catch { setMessage('The change was not acknowledged. Retry this exact confirmation when saving is available.'); }
    finally { setPending(false); }
  }
  function cancelPreview() {
    if (pending) return;
    const attempted = preview?.attempted;
    setPreview(null);
    setMessage(previous => attempted
      ? `${previous} Confirmation closed; no further retry was requested. Review the committed save before taking another action.`
      : 'Confirmation cancelled. No command was submitted for this preview.');
  }
  async function offerBackup() {
    if (pending) return; setPending(true);
    const report = (text: string) => setMessage(previous => preview?.attempted ? `${previous} ${text}` : text);
    try {
      const result = await backupActions.export('flushed');
      if (result.status === 'ready') { downloadBackupFile(result.backup.json, result.backup.filename); report('Committed backup download requested. Keep it before confirming the change.'); }
      else report(result.status === 'blocked' ? result.message : result.reason.message);
    } catch { report('Backup could not be prepared. This download did not request an additional destructive change.'); }
    finally { setPending(false); }
  }
  if (entry === 'closed') return <div className="adult-area adult-entry-link"><button ref={entryButton} onClick={() => setEntry('explanation')}>For grown-ups</button></div>;
  if (entry === 'explanation') return <section className="adult-area adult-entry adult-paper" aria-labelledby={`${id}-title`}>
    <img src={assetUrl('assets/art/m1/characters/pip-help.svg')} alt="" />
    <div><p className="adult-kicker">A LITTLE PAUSE BEFORE THE NOTEBOOK</p><h1 ref={heading} id={`${id}-title`} tabIndex={-1}>For grown-ups</h1>
      <p>View practice observations, change reading and motion preferences, or manage this browser’s saved stories.</p>
      <p>This extra step helps avoid accidental entry. It does not check who you are or secure the data. Deleting or replacing data has its own confirmation.</p>
      <div className="adult-actions"><button className="adult-primary" onClick={() => setEntry('open')}>Continue to adult area</button><button onClick={leave}>Back to explorers</button></div></div>
  </section>;
  return <section className="adult-area" data-motion={requested?.motion} aria-labelledby={`${id}-title`}>
    <header className="adult-header"><img src={assetUrl('assets/art/m1/props/spellbook.svg')} alt="" /><div><p className="adult-kicker">THE GROWN-UP NOTEBOOK</p>
      <h1 ref={heading} id={`${id}-title`} tabIndex={-1}>Stories, practice and care</h1><p>Local observations and deliberate choices for this browser.</p></div><button disabled={pending || backupBusy} onClick={leave}>Exit adult area</button></header>
    <p className="adult-scope">Saved only for this app address and browser profile. Clearing browser data can erase it. Keep a manual backup for transfer or recovery.</p>
    <div className="adult-profile-select"><label htmlFor={`${id}-profile`}>Profile to view</label><select id={`${id}-profile`} value={viewedId ?? ''} disabled={pending || backupBusy || !!preview} onChange={e => { setViewedId(e.target.value || null); setMessage(''); }}>
      <option value="">Choose a profile</option>{profiles.map(p => <option key={p.identity.profileId} value={p.identity.profileId}>{p.identity.nickname}</option>)}</select></div>
    {!profile && <p className="adult-note">Choose an existing profile. If a replacement or deletion removed the selected explorer, return to the profile chooser; no other child has been selected automatically.</p>}
    {profile && <><div className="adult-current"><ProfileAvatar avatarId={profile.identity.avatarId} /><p><strong>{profile.identity.nickname}</strong><br />Viewing this explorer’s evidence and preferences. This does not switch the active adventure.</p></div>
      <section className="adult-paper" aria-labelledby={`${id}-prefs`}><h2 id={`${id}-prefs`}>Reading and motion</h2>
        <label className="adult-toggle"><input type="checkbox" checked={requested!.instructionReadAloud} onChange={e => preferenceController.setProfilePreferences(profile.identity.profileId, { instructionReadAloud: e.target.checked })} />Read instructions aloud</label>
        <p>Essential text stays visible. Routine instructions do not use a Check or affect first-correct eligibility. Reading assessed text aloud is recorded as supported reading evidence; an answer-relevant Hint is the scoring assistance flag.</p>
        <label className="adult-toggle"><input type="checkbox" checked={requested!.motion === 'reduced'} onChange={e => preferenceController.setProfilePreferences(profile.identity.profileId, { motion: e.target.checked ? 'reduced' : 'system' })} />Reduce motion</label>
        <p>When off, motion follows the device preference. Music, effects and Silence all remain in the game’s quick controls outside this area.</p>
        <p role="status">{preferences.failed ? 'Preferences are not saved. Your requested choices remain for this visit.' : preferences.pending ? 'Saving preferences…' : 'Preferences match the committed save.'}</p>
        {preferences.failed && <button onClick={() => preferenceController.retry()}>Retry preferences</button>}</section>
      <ProgressView profileIdentity={profile.identity} summaries={summaries ?? summarizeLearning(profile.learning.evidence, listTasks(), date)} />
    </>}
    <BackupPanel backupActions={backupActions} onBusyChange={setBackupBusy} saveStatus={{ token: snapshot.token, profileNames: profiles.map(p => p.identity.nickname), pending: pending || preferences.pending, failed: preferences.failed }} />
    <section className="adult-paper adult-manage" aria-labelledby={`${id}-data`}><h2 id={`${id}-data`}>Manage saved stories</h2><p>Download a backup first if you may want to keep these stories. Each action below has a separate confirmation.</p>
      <div className="adult-actions"><button disabled={!profile || pending || !!preview} onClick={e => openPreview('DeleteProfile', e.currentTarget)}>Delete {profile?.identity.nickname ?? 'profile'}</button>
        <button disabled={!profile || pending || !!preview} onClick={e => openPreview('StartOver', e.currentTarget)}>Start over {profile?.identity.nickname ?? 'profile'}</button>
        <button disabled={pending || !!preview} onClick={e => openPreview('ResetSave', e.currentTarget)}>Reset this app’s save</button></div></section>
    <p role="status" className="adult-status">{message}</p>
    <dialog ref={dialog} className="adult-dialog" aria-labelledby={`${id}-confirm`} onCancel={e => { e.preventDefault(); cancelPreview(); }}>
      {preview && <><h2 id={`${id}-confirm`}>{preview.kind === 'ResetSave' ? 'Reset this app’s whole save?' : preview.kind === 'StartOver' ? 'Start this explorer over?' : 'Delete this explorer?'}</h2>
        <h3>Affected profiles</h3><ul>{preview.names.length ? preview.names.map((name, index) => <li key={index}>{name}</li>) : <li>No current profiles</li>}</ul>
        <p>{preview.kind === 'ResetSave' ? 'All profiles, progress, standings, awards and preferences in this app namespace will be removed. Other apps and addresses are outside this reset.' : 'This identity and all its linked progress, standings and awards will be removed. Other explorers retain their own data.'}</p>
        {preview.kind === 'StartOver' && <p>A new empty profile will use the same nickname and picture, with a new identity. The old awards will not transfer.</p>}
        <p>Download a current backup in Backup and transfer before confirming if you want a copy.</p>
        {stale && <p role="alert" className="adult-note">The save changed. Update the preview to see the current affected identities before confirming.</p>}
        <div className="adult-actions"><button ref={cancelButton} disabled={pending} onClick={cancelPreview}>Cancel destructive action</button>
          <button disabled={pending || stale} className="adult-danger" onClick={() => void confirm()}>{pending ? 'Saving…' : 'Confirm destructive action'}</button>
          <button disabled={pending} onClick={() => void offerBackup()}>Download backup before this change</button>
          {stale && <button onClick={() => { try { const updated = buildPreview(preview.kind, preview.profileId); setPreview(updated); if (updated) setMessage('Preview updated. Review the affected profiles before confirming.'); } catch { setMessage('Preview is unavailable.'); } }}>Update affected-profile preview</button>}</div>
        <p role="status">{message}</p></>}
    </dialog>
  </section>;
}
