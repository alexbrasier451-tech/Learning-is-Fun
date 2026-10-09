import { useEffect, useId, useRef, useState } from 'react';
import { AVATARS } from '../experience/catalogue';
import { assetUrl } from '../platform/assets';
import { SAVE_LIMITS } from '../state/contracts';
import type { CommittedSnapshot, StateCommand } from '../state/contracts';
import type { ProfileDispatch } from '../adult/adultProfilesPorts';
import './ProfileChooser.css';

export type ProfileChooserProps = Readonly<{
  snapshot: CommittedSnapshot;
  selectedProfileId: string | null;
  dispatch: ProfileDispatch;
  onSelectProfile(profileId: string): void;
}>;
const paths: Readonly<Record<string, string>> = { 'pip-idle': 'characters/pip-idle.svg', rowan: 'characters/rowan.svg',
  iona: 'characters/iona.svg', nessa: 'characters/nessa.svg', 'flowers-coral': 'props/flowers-coral.svg', apple: 'props/apple.svg' };
export function ProfileAvatar({ avatarId }: Readonly<{ avatarId: string }>) {
  const avatar = AVATARS.find(a => a.id === avatarId);
  return <span className="profile-avatar" aria-hidden="true">{avatar ? <img alt="" data-asset={avatar.assetId}
    src={assetUrl(`assets/art/m1/${paths[avatar.assetId]}`)} /> : <span>?</span>}</span>;
}
type Editor = { kind: 'create' | 'rename' | 'avatar'; profileId: string | null; originalName: string };

export function ProfileChooser({ snapshot, selectedProfileId, dispatch, onSelectProfile }: ProfileChooserProps) {
  const [editor, setEditor] = useState<Editor | null>(null), [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState<string>('pip'), [pending, setPending] = useState(false), [message, setMessage] = useState('');
  const [retry, setRetry] = useState<StateCommand | null>(null);
  const heading = useRef<HTMLHeadingElement>(null), editorHeading = useRef<HTMLHeadingElement>(null), input = useRef<HTMLInputElement>(null), opener = useRef<HTMLElement | null>(null);
  const id = useId(), profiles = Object.values(snapshot.save.profiles), cleanName = nickname.trim();
  useEffect(() => { if (editor) { if (editor.kind === 'avatar') editorHeading.current?.focus(); else input.current?.focus(); } }, [editor]);
  useEffect(() => {
    if (!editor && !pending && opener.current) {
      if (opener.current.isConnected && !opener.current.hasAttribute('disabled')) opener.current.focus();
      else heading.current?.focus();
      opener.current = null;
    }
  }, [editor, pending]);
  function open(next: Editor, element: HTMLElement) {
    opener.current = element; setEditor(next); setNickname(next.kind === 'create' ? '' : next.originalName);
    setAvatarId(next.profileId ? snapshot.save.profiles[next.profileId].identity.avatarId : 'pip'); setRetry(null); setMessage('');
  }
  function close() { setEditor(null); setRetry(null); }
  async function submit() {
    if (!editor || pending) return;
    if (editor.kind !== 'avatar' && (!cleanName || cleanName.length > SAVE_LIMITS.nicknameCharacters)) {
      setMessage('Choose a nickname with 1–24 characters.'); input.current?.focus(); return;
    }
    const captured = editor;
    setPending(true); setMessage(`Saving ${captured.kind === 'create' ? cleanName : captured.originalName}…`);
    try {
      const command = retry ?? dispatch.prepareCommand(captured.kind === 'create'
        ? { kind: 'CreateProfile', payload: { nickname: cleanName, avatarId } }
        : captured.kind === 'rename' ? { kind: 'RenameProfile', profileId: captured.profileId!, payload: { nickname: cleanName } }
          : { kind: 'SetAvatar', profileId: captured.profileId!, payload: { avatarId } });
      setRetry(command);
      const result = await dispatch.dispatch(command);
      if (result.status === 'committed' || result.status === 'already-applied') {
        setMessage(`${captured.kind === 'create' ? cleanName : captured.originalName}: ${captured.kind === 'create' ? 'profile created' : 'change saved'}.`);
        close();
      } else if (result.status === 'conflict') {
        setRetry(null); setMessage('The save changed in another tab. Review the current profiles, then try again.');
      } else { if (result.status !== 'save-failed') setRetry(null); setMessage(`Not saved. ${result.reason.message}`); }
    } catch { setMessage('Not saved. The save is unavailable; retry when it is ready.'); }
    finally { setPending(false); }
  }
  return <section className="profile-chooser" aria-labelledby={`${id}-title`}>
    <header className="profile-intro"><img src={assetUrl('assets/art/m1/props/spellbook.svg')} alt="" />
      <div><p className="profile-kicker">YOUR STORY STARTS HERE</p><h1 id={`${id}-title`} ref={heading} tabIndex={-1}>Who’s exploring today?</h1>
        <p>Choose your own little corner of the adventure.</p></div></header>
    <div className="profile-grid">{profiles.map(({ identity }) => <article className="profile-card" key={identity.profileId}>
      <button className="profile-select" aria-pressed={selectedProfileId === identity.profileId} onClick={() => onSelectProfile(identity.profileId)}>
        <ProfileAvatar avatarId={identity.avatarId} /><strong>{identity.nickname}</strong><span>{selectedProfileId === identity.profileId ? 'Selected explorer' : 'Choose explorer'}</span></button>
      <div className="profile-card-actions"><button onClick={e => open({ kind: 'rename', profileId: identity.profileId, originalName: identity.nickname }, e.currentTarget)} disabled={pending || !!editor}>Rename {identity.nickname}</button>
        <button onClick={e => open({ kind: 'avatar', profileId: identity.profileId, originalName: identity.nickname }, e.currentTarget)} disabled={pending || !!editor}>Picture for {identity.nickname}</button></div>
    </article>)}</div>
    {!profiles.length && <p className="profile-note">No explorers yet. Make a profile to begin your story.</p>}
    <div className="profile-add"><button disabled={pending || !!editor || profiles.length >= SAVE_LIMITS.profiles}
      onClick={e => open({ kind: 'create', profileId: null, originalName: '' }, e.currentTarget)}>Add an explorer</button>
      <p>{profiles.length} of {SAVE_LIMITS.profiles} local profiles{profiles.length >= SAVE_LIMITS.profiles ? ' · This browser’s profile space is full.' : ''}</p></div>
    {editor && <form className="profile-editor" aria-label={editor.kind === 'create' ? 'New explorer' : `Edit ${editor.originalName}`} onSubmit={e => { e.preventDefault(); void submit(); }}>
      <h2 ref={editorHeading} tabIndex={-1}>{editor.kind === 'create' ? 'Meet a new explorer' : editor.kind === 'rename' ? `Rename ${editor.originalName}` : `Choose a picture for ${editor.originalName}`}</h2>
      {editor.kind !== 'avatar' ? <label htmlFor={`${id}-nickname`}>Nickname<input ref={input} id={`${id}-nickname`} autoComplete="off" maxLength={24}
        value={nickname} disabled={pending || !!retry} onChange={e => { setNickname(e.target.value); setMessage(''); }} /></label>
        : <p>A new picture keeps the same profile, progress and awards.</p>}
      {editor.kind !== 'rename' && <fieldset disabled={pending || !!retry}><legend>Explorer picture</legend><div className="profile-avatar-options">{AVATARS.map(a =>
        <label key={a.id}><input type="radio" name={`${id}-avatar`} value={a.id} checked={avatarId === a.id} onChange={() => setAvatarId(a.id)} />
          <ProfileAvatar avatarId={a.id} /><span>{a.label}</span></label>)}</div></fieldset>}
      {editor.kind === 'rename' && <p>Renaming keeps this explorer’s progress and awards. Use a nickname; no real name is needed.</p>}
      <div className="profile-actions"><button type="submit" disabled={pending}>{pending ? 'Saving…' : retry ? 'Retry this save' : 'Save explorer'}</button>
        <button type="button" disabled={pending} onClick={close}>Cancel edit</button></div>
    </form>}
    <p role="status" aria-live="polite" className="profile-status">{message}</p>
    <aside className="profile-scope"><strong>A story saved on this browser</strong><p>Profiles belong to this app address and this browser profile. Other browsers and devices have separate stories. Clearing browser data can erase them. Grown-ups can download a manual backup and transfer it to another device.</p></aside>
  </section>;
}
