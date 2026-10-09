import { useEffect, useId, useRef, useState } from 'react';
import type { ImportPreview } from '../state/backup';
import { SAVE_LIMITS } from '../state/contracts';
import type { BackupActions, PanelSaveStatus } from './adultProfilesPorts';
import './adult.css';

export type BackupPanelProps = Readonly<{ backupActions: BackupActions; saveStatus: PanelSaveStatus; onBusyChange?(busy: boolean): void }>;
export function downloadBackupFile(json: string, filename: string) {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function BackupPanel({ backupActions, saveStatus, onBusyChange }: BackupPanelProps) {
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [preview, setPreview] = useState<ImportPreview | null>(null);
  const [retryable, setRetryable] = useState(false), [requiresPreview, setRequiresPreview] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null), cancelButton = useRef<HTMLButtonElement>(null), fileInput = useRef<HTMLInputElement>(null);
  const file = useRef<File | null>(null), activePreview = useRef<ImportPreview | null>(null), id = useId();
  const actions = useRef(backupActions); actions.current = backupActions;
  const mounted = useRef(true);
  const attempted = useRef(false);
  activePreview.current = preview;
  const stale = !!preview && (!saveStatus.token || preview.expected.epoch !== saveStatus.token.epoch || preview.expected.revision !== saveStatus.token.revision);
  useEffect(() => {
    if (preview && !dialog.current?.open) { dialog.current?.showModal(); cancelButton.current?.focus(); }
    if (!preview && dialog.current?.open) { dialog.current.close(); fileInput.current?.focus(); }
  }, [preview]);
  useEffect(() => { onBusyChange?.(busy); }, [busy, onBusyChange]);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (activePreview.current) actions.current.cancel(activePreview.current.preparedImportId); }; }, []);
  function cancel() {
    if (busy) return;
    if (preview) backupActions.cancel(preview.preparedImportId);
    setPreview(null); setRetryable(false); file.current = null;
    setMessage(previous => attempted.current
      ? `${previous} Replacement preview closed; no further retry was requested. Check the committed save before relying on this attempt’s outcome.`
      : 'Replacement preview cancelled. No confirmation was submitted for this preview.');
    if (fileInput.current) fileInput.current.value = '';
  }
  async function prepare(candidate: File) {
    if (busy) return;
    if (preview) backupActions.cancel(preview.preparedImportId);
    setPreview(null); setRetryable(false); setRequiresPreview(false); attempted.current = false; setMessage('Checking backup…');
    // File.size is checked before any File.text read by the decoder. Recovery
    // downloads have a different purpose; never advertise them as importable.
    if (candidate.size > SAVE_LIMITS.backupBytes) { setMessage('Not imported. Choose a backup no larger than 16 MiB.'); return; }
    if (candidate.name.endsWith('.recovery.json')) { setMessage('Raw recovery data is not an importable backup. Keep it for recovery assistance.'); return; }
    setBusy(true); file.current = candidate;
    try {
      const result = await backupActions.prepare(candidate);
      if (!mounted.current) { if (result.status === 'ready') actions.current.cancel(result.preview.preparedImportId); return; }
      if (result.status === 'ready') { setPreview(result.preview); setMessage('Backup checked. Review the whole-save replacement before confirming.'); }
      else setMessage(`Not imported. ${result.status === 'unavailable' ? result.reason.message : result.issues.map(issue => issue.message).join(' ')}`);
    } catch { setMessage('Not imported. The file could not be checked; keep the original backup.'); }
    finally { setBusy(false); }
  }
  async function confirm() {
    if (!preview || stale || busy || requiresPreview) return;
    const captured = preview; attempted.current = true; setBusy(true); setMessage('Replacing the whole save…');
    try {
      const result = await backupActions.confirm(captured.preparedImportId);
      if (result.status === 'committed' || result.status === 'already-applied') {
        setPreview(null); setRetryable(false); file.current = null; setMessage('Whole backup replacement committed. Return to the profile chooser to select an explorer.');
        if (fileInput.current) fileInput.current.value = '';
      } else if (result.status === 'conflict') {
        setRetryable(false); setRequiresPreview(true); setMessage('Not imported. The save changed. Preview the file again and review the affected profiles.');
      } else {
        setRetryable(result.status === 'save-failed' && result.retryable);
        setRequiresPreview(result.status !== 'save-failed' || !result.retryable);
        setMessage(`Not imported. ${result.reason.message}${result.status !== 'save-failed' ? ' Preview the file again.' : ''}`);
      }
    } catch { setRetryable(true); setMessage('Replacement was not acknowledged. Retry the same confirmed replacement or cancel; no success is claimed.'); }
    finally { setBusy(false); }
  }
  async function exportFile(mode: 'flushed' | 'last-committed') {
    if (busy) return; setBusy(true); setMessage('Preparing download…');
    try {
      const result = await backupActions.export(mode);
      if (result.status === 'ready') {
        downloadBackupFile(result.backup.json, result.source === 'last-committed-recovery' ? `last-committed-${result.backup.filename}` : result.backup.filename);
        setMessage(result.source === 'last-committed-recovery' ? 'Last-committed recovery backup download requested. It excludes unsaved changes.' : 'Committed backup download requested. Keep the file somewhere safe.');
      } else setMessage(result.status === 'blocked' ? result.message : result.reason.message);
    } catch { setMessage('The backup download could not be prepared. No save was changed.'); }
    finally { setBusy(false); }
  }
  async function rawRecovery() {
    if (busy || !backupActions.exportRawRecoveryData) return; setBusy(true);
    try {
      const result = await backupActions.exportRawRecoveryData();
      if (result.status === 'available') { downloadBackupFile(result.json, 'learning-is-fun.recovery.json'); setMessage('Raw recovery download requested. This preserves stored data; it is not an importable backup.'); }
      else setMessage(result.message);
    } catch { setMessage('Raw recovery data is unavailable. No save was changed.'); }
    finally { setBusy(false); }
  }
  return <section className="adult-paper adult-backup" aria-labelledby={`${id}-title`}>
    <p className="adult-kicker">KEEP A COPY OF YOUR STORY</p><h2 id={`${id}-title`}>Backup and transfer</h2>
    <p>A backup contains every local profile, progress, awards and saved preferences. Transfer is manual; this app does not sync between devices.</p>
    <p className="adult-note">{!saveStatus.token ? 'No compatible committed save is available.' : saveStatus.failed ? 'Some changes are not saved. Retry them before downloading a current backup.' : saveStatus.pending ? 'Changes are still saving.' : 'The displayed save is committed.'}</p>
    <div className="adult-actions"><button disabled={busy || !saveStatus.token} onClick={() => void exportFile('flushed')}>Download current backup</button>
      <button disabled={busy || !saveStatus.token} onClick={() => void exportFile('last-committed')}>Download last-committed recovery backup</button></div>
    <p>The last-committed recovery backup is compatible with import, but excludes changes that have not saved.</p>
    <label className="adult-file" htmlFor={`${id}-file`}>Choose a backup to replace this app’s whole save<input id={`${id}-file`} ref={fileInput}
      type="file" accept=".json,application/json" disabled={busy || !saveStatus.token} onChange={e => { const candidate = e.target.files?.[0]; if (candidate) void prepare(candidate); }} /></label>
    <p>Up to 16 MiB. Import replaces all profiles; it does not merge them. Choosing a file only prepares a preview.</p>
    {backupActions.exportRawRecoveryData && <details><summary>Preserve unreadable or unsupported stored data</summary><p>Raw recovery preserves the stored root, including unknown data, for recovery assistance. A .recovery.json file is not a compatible backup and cannot be imported here.</p>
      <button disabled={busy} onClick={() => void rawRecovery()}>Download raw recovery data</button></details>}
    <p role="status" className="adult-status">{message}</p>
    <dialog ref={dialog} className="adult-dialog" aria-labelledby={`${id}-replace`} onCancel={e => { e.preventDefault(); cancel(); }}>
      {preview && <><h2 id={`${id}-replace`}>Replace this app’s whole save?</h2>
        <p>All current profiles and their linked progress, standings, awards and preferences will be replaced.</p>
        <h3>Current profiles affected</h3><ul>{saveStatus.profileNames.length ? saveStatus.profileNames.map((name, index) => <li key={index}>{name}</li>) : <li>No current profiles</li>}</ul>
        <h3>Profiles in the backup · {preview.profileCount}</h3><ul>{preview.profileNames.length ? preview.profileNames.map((name, index) => <li key={index}>{name}</li>) : <li>No profiles in this backup</li>}</ul>
        <p>Backup exported <time dateTime={preview.exportedAt}>{preview.exportedAt}</time>.</p>
        <p>Offer: download a current backup before replacing these profiles.</p>
        {stale && <p role="alert" className="adult-note">The save changed since this preview. Preview the file again, then check the current affected profiles.</p>}
        <div className="adult-actions"><button disabled={busy} ref={cancelButton} onClick={cancel}>Cancel replacement</button>
          <button disabled={busy || stale || requiresPreview || !saveStatus.token} className="adult-danger" onClick={() => void confirm()}>{busy ? 'Working…' : retryable ? 'Retry confirmed replacement' : 'Confirm whole-save replacement'}</button>
          <button disabled={busy || !file.current} onClick={() => { if (file.current) void prepare(file.current); }}>Preview file again</button>
          <button disabled={busy || !saveStatus.token} onClick={() => void exportFile('flushed')}>Download current backup</button></div>
        <p role="status">{message}</p></>}
    </dialog>
  </section>;
}
