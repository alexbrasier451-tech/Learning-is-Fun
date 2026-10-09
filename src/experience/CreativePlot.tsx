import { useEffect, useState } from 'react';
import type { CreativeChoice, CreativeOption, CreativeState, SocketId } from './types';
import { assetUrl } from '../platform/assets';
import './creative.css';

export type M1CreativeChoices = Readonly<{
  scarfColours: readonly CreativeOption[]; flowerColours: readonly CreativeOption[];
  sockets: readonly Readonly<{ id: SocketId; milestone: 'M1' | 'M2' }>[];
  decorations: readonly CreativeOption[]; cosmetics: readonly CreativeOption[];
}>;
export type CreativeSaveStatus = 'idle' | 'committed' | 'already-applied' | 'conflict' | 'save-failed' | 'invalid' | 'unsupported';
export type CreativePlotProps = Readonly<{
  saved: CreativeState;
  /** Host filters quest prerequisites using committed world progress. */
  availableChoices: M1CreativeChoices;
  entitlements: readonly string[];
  pending: boolean; saveStatus: CreativeSaveStatus;
  onSave(choice: CreativeChoice): void;
  onCancel(): void;
}>;

const equal = (a: CreativeState, b: CreativeState) => a.scarfColourId === b.scarfColourId
  && a.scarfPatternId === b.scarfPatternId && a.flowerColourId === b.flowerColourId
  && a.planterRimId === b.planterRimId && a.facadeTrimId === b.facadeTrimId
  && (Object.keys(a.placements) as SocketId[]).every(id => a.placements[id] === b.placements[id]);
const art = (id: string) => assetUrl(`assets/art/m1/props/${id}.svg`);

/** Local preview only. Mount with key `${profileId}:${snapshot.token.epoch}` to
 * discard an old child's preview; host captures that same scope before dispatch. */
export function CreativePlot({ saved, availableChoices, entitlements, pending, saveStatus, onSave, onCancel }: CreativePlotProps) {
  const [preview, setPreview] = useState(saved), [history, setHistory] = useState<readonly CreativeState[]>([]);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty || ((saveStatus === 'committed' || saveStatus === 'already-applied') && equal(preview, saved))) {
      setPreview(saved); setHistory([]); setDirty(false);
    }
  }, [saved, saveStatus, dirty, preview]);
  function change(next: CreativeState) {
    if (pending || equal(next, preview)) return;
    setHistory([...history, preview]); setPreview(next); setDirty(!equal(next, saved));
  }
  const planterAvailable = availableChoices.decorations.some(option => option.id === 'planter' && option.milestone === 'M1');
  const sockets = availableChoices.sockets.filter(socket => socket.milestone === 'M1');
  const placed = sockets.find(socket => preview.placements[socket.id] === 'planter')?.id;
  const failed = ['conflict', 'save-failed', 'invalid', 'unsupported'].includes(saveStatus);
  function cosmetic(id: 'scarf-leaf' | 'planter-rim', target: 'scarfPatternId' | 'planterRimId') {
    const option = availableChoices.cosmetics.find(option => option.id === id && option.milestone === 'M1');
    const unlocked = !!option && (!option.entitlementId || entitlements.includes(option.entitlementId));
    return <div className="creative-unlock">
      <button type="button" disabled={pending || !unlocked} aria-pressed={preview[target] === id}
        onClick={() => change({ ...preview, [target]: preview[target] === id ? null : id })}>
        {id === 'scarf-leaf' ? 'Leaf scarf pattern' : 'Decorated planter rim'}
      </button>
      <span>{unlocked ? 'Available · appearance only' : `Available at ${id === 'scarf-leaf' ? '20' : '60'} lifetime points`}</span>
    </div>;
  }
  return <section className="creative-plot" aria-labelledby="creative-title" aria-busy={pending}>
    <header className="creative-heading"><div><p className="creative-eyebrow">Made by you</p><h1 id="creative-title">Your little corner</h1>
      <p>Try a colour. Find a favourite. Save when it feels like yours.</p></div><span className="creative-free">All colours are free</span></header>
    <div className="creative-workspace">
      <div className="creative-meadow" aria-label="Your appearance preview">
        <span className="creative-preview-label">{dirty ? 'Your preview' : 'Saved appearance'}</span>
        <div className="creative-pip" aria-label={`Pip wearing a ${preview.scarfColourId} scarf${preview.scarfPatternId ? ' with a leaf pattern' : ''}`} role="img">
          <img src={assetUrl('assets/art/m1/characters/pip-idle.svg')} alt="" />
          <img src={art(`scarf-${preview.scarfColourId}`)} alt="" />
          {preview.scarfPatternId === 'scarf-leaf' && <img src={art('scarf-leaf')} alt="" />}
        </div>
        {planterAvailable ? <div className="creative-sockets" role="group" aria-label="Planter placement">
          {sockets.map((socket, index) => <button className="creative-socket" type="button" key={socket.id} disabled={pending}
            aria-label={`Place planter in spot ${index + 1}`} aria-pressed={placed === socket.id} onClick={() => {
              const placements = { ...preview.placements };
              sockets.forEach(s => { placements[s.id] = null; }); placements[socket.id] = 'planter';
              change({ ...preview, placements });
            }}>
            <img className="creative-soil" src={assetUrl('assets/art/m1/ui/plot-socket.svg')} alt="" />
            {placed === socket.id && <span className="creative-planter" aria-hidden="true">
              <img src={art('decoration-planter')} alt="" /><img src={art(`flowers-${preview.flowerColourId}`)} alt="" />
              {preview.planterRimId === 'planter-rim' && <img src={art('planter-rim')} alt="" />}
            </span>}
            <span className="creative-spot-label">Spot {index + 1}</span>
          </button>)}
        </div> : <p className="creative-meadow-note">A flower planter will join your corner after the market adventure.</p>}
      </div>
      <div className="creative-palette">
        <fieldset disabled={pending}><legend>Pip's scarf</legend><p className="creative-note">Three colours, yours from the start.</p>
          <div className="creative-colours">{availableChoices.scarfColours.filter(o => o.milestone === 'M1').map(option =>
            <button type="button" key={option.id} aria-pressed={preview.scarfColourId === option.id} className={`creative-colour colour-${option.id}`}
              onClick={() => change({ ...preview, scarfColourId: option.id as CreativeState['scarfColourId'] })}><span aria-hidden="true" />{option.label}</button>)}</div>
          {cosmetic('scarf-leaf', 'scarfPatternId')}
        </fieldset>
        {!planterAvailable && <fieldset disabled><legend>After the market adventure</legend>
          <p className="creative-note">Your flower planter and its three free colours will be here after the market is restored.</p>
          {cosmetic('planter-rim', 'planterRimId')}
        </fieldset>}
        {planterAvailable && <fieldset disabled={pending}><legend>Your flower planter</legend><p className="creative-note">Choose flowers, then tap a spot in the garden.</p>
          <div className="creative-colours">{availableChoices.flowerColours.filter(o => o.milestone === 'M1').map(option =>
            <button type="button" key={option.id} aria-pressed={preview.flowerColourId === option.id} className={`creative-colour colour-${option.id}`}
              onClick={() => change({ ...preview, flowerColourId: option.id as CreativeState['flowerColourId'] })}><span aria-hidden="true" />{option.label}</button>)}</div>
          {cosmetic('planter-rim', 'planterRimId')}
          <button type="button" disabled={pending || !placed} onClick={() => {
            const placements = { ...preview.placements }; sockets.forEach(s => { placements[s.id] = null; }); change({ ...preview, placements });
          }}>Put planter away</button>
        </fieldset>}
      </div>
    </div>
    <footer className="creative-footer">
      <p className={`creative-save-message ${failed && dirty ? 'creative-unsaved' : ''}`} role="status" aria-atomic="true">
        {pending ? 'Saving your arrangement…' : failed && dirty ? saveStatus === 'conflict' ? 'Not saved: your save changed elsewhere. Your preview is safe. Retry Save or Cancel to use the latest saved arrangement.'
          : 'Not saved. Your preview is safe. Try Save again.' : dirty ? 'Preview only · choose Save to keep it.' : saveStatus === 'already-applied' ? 'Already saved · your arrangement is safe.' : 'Saved · ready whenever you return.'}
      </p>
      <div className="creative-actions">
        <button type="button" disabled={pending || history.length === 0} onClick={() => {
          const previous = history[history.length - 1]; setHistory(history.slice(0, -1)); setPreview(previous); setDirty(!equal(previous, saved));
        }}>Undo</button>
        <button type="button" disabled={pending || !dirty} onClick={() => { setPreview(saved); setHistory([]); setDirty(false); onCancel(); }}>Cancel</button>
        <button className="creative-save" type="button" disabled={pending || !dirty} onClick={() => onSave({ kind: 'appearance', value: structuredClone(preview) })}>Save arrangement</button>
      </div>
    </footer>
  </section>;
}
