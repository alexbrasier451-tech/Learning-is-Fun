import { useEffect, useState } from 'react';
import type { CreativeChoice, CreativeOption, CreativeState, DecorationId, SocketId, WorldProgress } from './types';
import { STORY_DISPLAYS } from './catalogue';
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
  /** Committed M2 story facts; display only, never part of an appearance Save. */
  world?: WorldProgress;
}>;

const equal = (a: CreativeState, b: CreativeState) => a.scarfColourId === b.scarfColourId
  && a.scarfPatternId === b.scarfPatternId && a.flowerColourId === b.flowerColourId
  && a.planterRimId === b.planterRimId && a.facadeTrimId === b.facadeTrimId
  && (Object.keys(a.placements) as SocketId[]).every(id => a.placements[id] === b.placements[id]);
const art = (id: string) => assetUrl(`assets/art/${['scarf-star', 'scarf-wave', 'home-trim', 'forest-story-map', 'forest-tale', 'sawmill-model',
  'decoration-tree', 'decoration-bench', 'decoration-lantern', 'decoration-banner', 'decoration-pond'].includes(id) ? 'm2' : 'm1'}/props/${id}.svg`);
const cosmeticThresholds = { 'scarf-leaf': 20, 'planter-rim': 60, 'home-trim': 150, 'scarf-star': 300, 'scarf-wave': 300 } as const;
const displayLabels = { spellbook: 'Recovered spellbook', 'forest-story-map': 'Forest story map',
  'forest-tale': 'Forest tale', 'sawmill-model': 'Workshop invention' } as const;

/** Local preview only. Mount with key `${profileId}:${snapshot.token.epoch}` to
 * discard an old child's preview; host captures that same scope before dispatch. */
export function CreativePlot({ saved, availableChoices, entitlements, pending, saveStatus, onSave, onCancel, world }: CreativePlotProps) {
  const [preview, setPreview] = useState(saved), [history, setHistory] = useState<readonly CreativeState[]>([]);
  const [dirty, setDirty] = useState(false);
  const [selectedDecoration, setDecoration] = useState<DecorationId>('planter');
  const [moveFrom, setMoveFrom] = useState<SocketId | null>(null);
  useEffect(() => {
    if (!dirty || ((saveStatus === 'committed' || saveStatus === 'already-applied') && equal(preview, saved))) {
      setPreview(saved); setHistory([]); setDirty(false); setMoveFrom(null);
    }
  }, [saved, saveStatus, dirty, preview]);
  function change(next: CreativeState) {
    if (pending || equal(next, preview)) return;
    setHistory([...history, preview]); setPreview(next); setDirty(!equal(next, saved));
  }
  // Old M1 hosts supplied all socket records, but only M1 choices. Preserve that.
  const expanded = availableChoices.cosmetics.some(o => o.milestone === 'M2') || availableChoices.decorations.some(o => o.milestone === 'M2');
  const decorations = availableChoices.decorations.filter(o => expanded || o.milestone === 'M1');
  const planterAvailable = decorations.some(option => option.id === 'planter');
  const sockets = availableChoices.sockets.filter(socket => expanded || socket.milestone === 'M1');
  const placed = sockets.find(socket => preview.placements[socket.id] === 'planter')?.id;
  const label = (id: string) => decorations.find(d => d.id === id)?.label ?? id;
  const moving = moveFrom ? preview.placements[moveFrom] : null;
  function place(socketId: SocketId) {
    if (pending) return;
    const placements = { ...preview.placements };
    if (moveFrom && moving) { placements[moveFrom] = placements[socketId]; placements[socketId] = moving; }
    else {
      if (!expanded) sockets.forEach(s => { placements[s.id] = null; });
      placements[socketId] = expanded ? selectedDecoration : 'planter';
    }
    setMoveFrom(null); change({ ...preview, placements });
  }
  const failed = ['conflict', 'save-failed', 'invalid', 'unsupported'].includes(saveStatus);
  function cosmetic(id: keyof typeof cosmeticThresholds, target: 'scarfPatternId' | 'planterRimId' | 'facadeTrimId') {
    const option = availableChoices.cosmetics.find(option => option.id === id);
    const unlocked = !!option && (!option.entitlementId || entitlements.includes(option.entitlementId));
    return <div className="creative-unlock">
      <button type="button" disabled={pending || !unlocked} aria-pressed={preview[target] === id}
        onClick={() => change({ ...preview, [target]: preview[target] === id ? null : id })}>
        {option?.label ?? (id === 'scarf-leaf' ? 'Leaf scarf pattern' : 'Decorated planter rim')}
      </button>
      <span>{unlocked ? 'Available · appearance only' : `Available at ${cosmeticThresholds[id]} lifetime points`}</span>
    </div>;
  }
  const earnedDisplays = world ? STORY_DISPLAYS.filter(d => d.requiresAll.every(q => world.completedQuestIds.includes(q))) : [];
  return <section className={`creative-plot ${expanded ? 'creative-expanded' : ''}`} aria-labelledby="creative-title" aria-busy={pending}>
    <header className="creative-heading"><div><p className="creative-eyebrow">Made by you</p><h1 id="creative-title">Your little corner</h1>
      <p>Try a colour. Find a favourite. Save when it feels like yours.</p></div><span className="creative-free">All colours are free</span></header>
    <div className="creative-workspace">
      <div className="creative-meadow" aria-label="Your appearance preview">
        <span className="creative-preview-label">{dirty ? 'Your preview' : 'Saved appearance'}</span>
        <div className="creative-pip" aria-label={`Pip wearing a ${preview.scarfColourId} scarf${preview.scarfPatternId ? ` with a ${preview.scarfPatternId.slice(6)} pattern` : ''}`} role="img">
          <img src={assetUrl('assets/art/m1/characters/pip-idle.svg')} alt="" />
          <img src={art(`scarf-${preview.scarfColourId}`)} alt="" />
          {preview.scarfPatternId && ['scarf-leaf', 'scarf-star', 'scarf-wave'].includes(preview.scarfPatternId) && <img src={art(preview.scarfPatternId)} alt="" />}
        </div>
        {planterAvailable ? <div className="creative-sockets" role="group" aria-label="Planter placement">
          {sockets.map((socket, index) => {
            const decoration = preview.placements[socket.id];
            return <div className="creative-socket-cell" key={socket.id}><button className="creative-socket" type="button" disabled={pending}
            aria-label={expanded ? `${moving ? 'Move' : 'Place'} ${label(moving ?? selectedDecoration)} ${moving ? 'to' : 'in'} spot ${index + 1}` : `Place planter in spot ${index + 1}`}
            aria-pressed={expanded ? !!decoration : placed === socket.id} onClick={() => place(socket.id)}>
            <img className="creative-soil" src={assetUrl('assets/art/m1/ui/plot-socket.svg')} alt="" />
            {decoration && <span className="creative-planter" aria-hidden="true">
              <img src={art(`decoration-${decoration}`)} alt="" />
              {decoration === 'planter' && <><img src={art(`flowers-${preview.flowerColourId}`)} alt="" />
              {preview.planterRimId === 'planter-rim' && <img src={art('planter-rim')} alt="" />}</>}
            </span>}
            <span className="creative-spot-label">Spot {index + 1}</span>
          </button>{expanded && <><span className="creative-socket-description">{decoration ? label(decoration) : 'Empty'}</span>
            <button className="creative-small" type="button" disabled={pending || !decoration} aria-pressed={moveFrom === socket.id}
              aria-label={`Move decoration from spot ${index + 1}`} onClick={() => setMoveFrom(moveFrom === socket.id ? null : socket.id)}>Move</button>
            <button className="creative-small" type="button" disabled={pending || !decoration} aria-label={`Remove decoration from spot ${index + 1}`}
              onClick={() => { setMoveFrom(null); change({ ...preview, placements: { ...preview.placements, [socket.id]: null } }); }}>Remove</button></>}</div>;
          })}
        </div> : <p className="creative-meadow-note">A flower planter will join your corner after the market adventure.</p>}
        {expanded && planterAvailable && <p className="creative-move-status" role="status">{moving
          ? `Moving ${label(moving)}. Choose a spot; occupied spots swap decorations.`
          : 'Choose a decoration, then a spot. Each decoration can be used again.'}</p>}
      </div>
      <div className="creative-palette">
        <fieldset disabled={pending}><legend>Pip's scarf</legend><p className="creative-note">Three colours, yours from the start.</p>
          <div className="creative-colours">{availableChoices.scarfColours.filter(o => o.milestone === 'M1').map(option =>
            <button type="button" key={option.id} aria-pressed={preview.scarfColourId === option.id} className={`creative-colour colour-${option.id}`}
              onClick={() => change({ ...preview, scarfColourId: option.id as CreativeState['scarfColourId'] })}><span aria-hidden="true" />{option.label}</button>)}</div>
          {cosmetic('scarf-leaf', 'scarfPatternId')}
          {expanded && <>{cosmetic('scarf-star', 'scarfPatternId')}{cosmetic('scarf-wave', 'scarfPatternId')}</>}
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
            const placements = { ...preview.placements }; sockets.forEach(s => { if (placements[s.id] === 'planter') placements[s.id] = null; }); setMoveFrom(null); change({ ...preview, placements });
          }}>Put planter away</button>
        </fieldset>}
        {expanded && planterAvailable && <fieldset disabled={pending}><legend>Garden decorations</legend><p className="creative-note">Six reusable choices. One decoration in each spot.</p>
          <div className="creative-decoration-choices">{decorations.map(option => <button type="button" key={option.id} aria-pressed={selectedDecoration === option.id}
            onClick={() => { setDecoration(option.id as DecorationId); setMoveFrom(null); }}><img src={art(option.assetId)} alt="" />{option.label}</button>)}</div>
        </fieldset>}
      </div>
    </div>
    {expanded && <section className="creative-home" aria-label="Home appearance"><div className="creative-home-art">
      <img src={assetUrl('assets/art/m1/scenes/village-green.svg')} alt="Your village home" />
      {preview.facadeTrimId === 'home-trim' && <img src={art('home-trim')} alt="Decorated home facade" />}
    </div><div><h2>A finishing touch for home</h2>{cosmetic('home-trim', 'facadeTrimId')}<p className="creative-note">An appearance choice. Your adventures remain open whatever you choose.</p></div></section>}
    {world && <section className="creative-keepsakes" aria-label="Your discovered stories and invention">
      <div className="creative-story-shelf"><h2>Your story shelf</h2><div className="creative-story-items">
        {STORY_DISPLAYS.filter(d => d.kind === 'shelf').map(display => <figure key={display.id}>
          {earnedDisplays.includes(display) ? <img src={art(display.assetId)} alt={displayLabels[display.id]} /> : <span className="creative-empty-book" aria-hidden="true" />}
          <figcaption>{earnedDisplays.includes(display) ? displayLabels[display.id] : `A space for ${displayLabels[display.id].toLowerCase()}`}</figcaption>
        </figure>)}</div><p className="creative-note">Stories you have recovered stay here when a new week begins.</p></div>
      <div className="creative-invention"><h2>From the workshop</h2>
        {earnedDisplays.some(d => d.id === 'sawmill-model') ? <figure><img src={art('sawmill-model')} alt="Workshop invention" /><figcaption>Your sawmill model</figcaption></figure>
          : <p>A space for the invention from your workshop adventure.</p>}</div>
    </section>}
    <footer className="creative-footer">
      <p className={`creative-save-message ${failed && dirty ? 'creative-unsaved' : ''}`} role="status" aria-atomic="true">
        {pending ? 'Saving your arrangement…' : failed && dirty ? saveStatus === 'conflict' ? 'Not saved: your save changed elsewhere. Your preview is safe. Retry Save or Cancel to use the latest saved arrangement.'
          : 'Not saved. Your preview is safe. Try Save again.' : dirty ? 'Preview only · choose Save to keep it.' : saveStatus === 'already-applied' ? 'Already saved · your arrangement is safe.' : 'Saved · ready whenever you return.'}
      </p>
      <div className="creative-actions">
        <button type="button" disabled={pending || history.length === 0} onClick={() => {
          const previous = history[history.length - 1]; setHistory(history.slice(0, -1)); setPreview(previous); setDirty(!equal(previous, saved)); setMoveFrom(null);
        }}>Undo</button>
        <button type="button" disabled={pending || !dirty} onClick={() => { setPreview(saved); setHistory([]); setDirty(false); setMoveFrom(null); onCancel(); }}>Cancel</button>
        <button className="creative-save" type="button" disabled={pending || !dirty} onClick={() => { setMoveFrom(null); onSave({ kind: 'appearance', value: structuredClone(preview) }); }}>Save arrangement</button>
      </div>
    </footer>
  </section>;
}
