import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ActivityDraft, DraftAction, DraftSelection, Fruit, M1ResponseSpec } from './draft';
import { bindPointerDrag, resolveDropTarget } from './pointer';
import { assetUrl } from '../platform/assets';
import './widgets.css';

export type ActivityWidgetProps = Readonly<{
  responseSpec: M1ResponseSpec; draft: ActivityDraft; disabled: boolean;
  onAction(action: DraftAction): void;
}>;
const selected = (draft: ActivityDraft, selection: DraftSelection) => JSON.stringify(draft.selection) === JSON.stringify(selection);

function DragButton({ selection, children, label, ...props }: ActivityWidgetProps & {
  selection: DraftSelection; children: ReactNode; label: string;
}) {
  const element = useRef<HTMLButtonElement>(null);
  const latest = useRef({ ...props, selection });
  latest.current = { ...props, selection };
  const selectionKey = JSON.stringify(selection);
  useEffect(() => {
    const button = element.current!;
    return bindPointerDrag(button, {
      getDraft: () => latest.current.disabled ? null : { ...latest.current.draft, selection: latest.current.selection },
      resolveDropTarget: point => {
        const board = button.closest('.iw-widget');
        const targets = [...(board?.querySelectorAll<HTMLElement>('[data-drop-target]') ?? [])]
          .filter(target => !(target instanceof HTMLButtonElement && target.disabled))
          .map(target => ({ id: target.dataset.dropTarget!, rect: target.getBoundingClientRect() }));
        return resolveDropTarget(point, targets);
      },
      onAction: action => { if (!latest.current.disabled) latest.current.onAction(action); },
    });
  }, [selectionKey]);
  return <button ref={element} type="button" className="iw-piece iw-drag-handle"
    aria-label={label} data-ghost-label={label} aria-pressed={selected(props.draft, selection)}
    disabled={props.disabled} onClick={() => props.onAction({ kind: 'select', selection })}>
    {children}<span className="iw-selected-label">{selected(props.draft, selection) ? 'Selected' : 'Choose'}</span>
  </button>;
}

function Instructions() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button type="button" ref={trigger} onClick={() => dialog.current?.showModal()}>How to move pieces</button>
    <dialog ref={dialog} className="iw-instructions" aria-label="Move pieces your way" onClose={() => trigger.current?.focus()}>
      <h3>Move pieces your way</h3>
      <p>Choose a piece, then choose its space. Or drag it by its handle.</p>
      <p>Use Tab to reach buttons and Enter or Space to choose. Remove, move and Undo let you revise your arrangement.</p>
      <p>Escape cancels a drag or closes this window. Only a separate Check action can submit an answer.</p>
      <button type="button" autoFocus onClick={() => dialog.current?.close()}>Back to pieces</button>
    </dialog>
  </>;
}

function Footer(props: ActivityWidgetProps & { summary: string }) {
  return <footer className="iw-footer">
    <p role="status" className="iw-summary" aria-live="polite" aria-atomic="true">{props.summary}</p>
    <div className="iw-toolbar">
      <button type="button" disabled={props.disabled || props.draft.undo.length === 0} onClick={() => props.onAction({ kind: 'undo' })}>Undo last edit</button>
      <button type="button" disabled={props.disabled || props.draft.selection === null} onClick={() => props.onAction({ kind: 'select', selection: null })}>Cancel selection</button>
      <Instructions />
    </div>
  </footer>;
}

/** Accepted art has a 72px-per-metre body plus constant 8px side gutters.
 * One container-relative unit scales every SVG, in palette and construction.
 * The live label and native hit area never stretch the painted length. */
function Timber({ length }: { length: number }) {
  return <>
    <span className="iw-timber" data-plank-length={length}
      style={{ inlineSize: `calc(var(--iw-plank-unit) * ${length + 16 / 72})` }}>
      <img className="iw-timber-art" alt="" draggable={false} width={72 * length + 16} height={88}
        src={assetUrl(`assets/art/m1/props/plank-${length}.svg`)} />
    </span>
    <span className="iw-timber-label">{length} m</span>
  </>;
}

export function PlacementBoard(props: ActivityWidgetProps) {
  const { draft, responseSpec, disabled, onAction } = props;
  if (draft.kind !== 'bridge' || responseSpec.kind !== 'bridge') throw new TypeError('PlacementBoard needs a bridge draft/specification.');
  const total = draft.planks.reduce((sum, p) => sum + p.length, 0);
  return <section className="iw-widget iw-bridge" aria-label="Bridge construction">
    <h2>Build your bridge</h2>
    <p>Choose a timber length, then place it. You can move or remove each plank.</p>
    <div className="iw-palette" aria-label="Timber lengths">
      {responseSpec.plankLengths.map(length => <DragButton key={length} {...props} selection={{ kind: 'plank', length }} label={`Choose ${length} metre plank`}>
        <Timber length={length} />
      </DragButton>)}
    </div>
    <div className="iw-river">
      <div className="iw-placed" aria-label="Placed planks">
        {draft.planks.map((plank, index) => <article className="iw-plank-card" key={plank.instanceId}
          style={{ inlineSize: `max(12rem, calc(var(--iw-plank-unit) * ${plank.length + 16 / 72} + 34px))` }}>
          <DragButton {...props} selection={{ kind: 'placed-plank', instanceId: plank.instanceId }} label={`Choose placed plank ${index + 1}: ${plank.length} metres`}>
            <Timber length={plank.length} />
          </DragButton>
          <button type="button" data-drop-target={`before:${plank.instanceId}`} disabled={disabled || !draft.selection}
            onClick={() => onAction({ kind: 'place', targetId: `before:${plank.instanceId}` })}>Place before plank {index + 1}</button>
          <div className="iw-move-row">
            <button type="button" aria-label={`Move plank ${index + 1} before`} disabled={disabled || index === 0} onClick={() => onAction({ kind: 'move', instanceId: plank.instanceId, direction: 'before' })}>Earlier</button>
            <button type="button" aria-label={`Move plank ${index + 1} after`} disabled={disabled || index === draft.planks.length - 1} onClick={() => onAction({ kind: 'move', instanceId: plank.instanceId, direction: 'after' })}>Later</button>
          </div>
          <button type="button" onClick={() => onAction({ kind: 'remove', targetId: plank.instanceId })} disabled={disabled} aria-label={`Remove plank ${index + 1}`}>Remove</button>
        </article>)}
      </div>
      <button type="button" className="iw-drop" data-drop-target="bridge" disabled={disabled}
        onClick={() => onAction({ kind: 'place', targetId: 'bridge' })}>Place selected plank at the end</button>
    </div>
    <Footer {...props} summary={`${draft.planks.length} planks · ${total} metres so far.${draft.selection ? ' A plank is selected.' : ' Choose a plank to place.'}`} />
  </section>;
}

export function ChoiceTiles(props: ActivityWidgetProps) {
  const { draft, responseSpec, disabled, onAction } = props;
  if (draft.kind !== 'punctuation' || responseSpec.kind !== 'punctuation') throw new TypeError('ChoiceTiles needs a punctuation draft/specification.');
  const options = [...new Map(responseSpec.slots.flatMap(slot => slot.options).map(option => [option.id, option])).values()];
  const selectedMark = draft.selection?.kind === 'mark' ? draft.selection.value : null;
  const filled = Object.values(draft.slots).filter(value => value !== null).length;
  return <section className="iw-widget iw-punctuation" aria-label="Punctuation construction">
    <h2>Give each sentence its mark</h2>
    <p>Choose a mark, then choose a sentence space. You can replace or clear it.</p>
    <div className="iw-palette" aria-label="Punctuation marks">
      {options.map(option => <DragButton key={option.id} {...props} selection={{ kind: 'mark', value: option.id }} label={`Choose ${option.label}`}>
        <span className="iw-mark">{option.id}</span><span>{option.label}</span>
      </DragButton>)}
    </div>
    <div className="iw-sentences">
      {responseSpec.slots.map(slot => <div className="iw-sentence" key={slot.id}>
        <p>{slot.label}</p>
        <button type="button" className="iw-slot" data-drop-target={slot.id} aria-label={`Place selected mark in ${slot.id}`}
          disabled={disabled || (selectedMark !== null && !slot.options.some(option => option.id === selectedMark))}
          onClick={() => onAction({ kind: 'place', targetId: slot.id })}>
          <span className="iw-mark">{draft.slots[slot.id] ?? '…'}</span><span>{draft.slots[slot.id] === null ? 'Empty space' : 'Replace mark'}</span>
        </button>
        <button type="button" disabled={disabled || draft.slots[slot.id] === null} aria-label={`Clear ${slot.id}`} onClick={() => onAction({ kind: 'remove', targetId: slot.id })}>Clear</button>
      </div>)}
    </div>
    <Footer {...props} summary={`${filled} of ${responseSpec.slots.length} sentence spaces filled.${selectedMark ? ` ${selectedMark} selected.` : ' Choose a mark to place.'}`} />
  </section>;
}

function FruitArt({ which }: { which: Fruit }) {
  return <img className="iw-fruit-art" alt="" draggable={false} src={assetUrl(`assets/art/m1/props/${which === 'apples' ? 'apple' : 'pear'}.svg`)} />;
}
export function QuantityControl(props: ActivityWidgetProps) {
  const { draft, responseSpec, disabled, onAction } = props;
  if (draft.kind !== 'merchant' || responseSpec.kind !== 'merchant') throw new TypeError('QuantityControl needs a merchant draft/specification.');
  const total = (draft.apples ?? 0) + (draft.pears ?? 0);
  return <section className="iw-widget iw-merchant" aria-label="Fruit basket construction">
    <h2>Arrange the fruit basket</h2>
    <p>Choose a fruit, then place it in the basket. The number buttons work too.</p>
    <div className="iw-palette">
      {(['apples', 'pears'] as const).map(which => <DragButton key={which} {...props} selection={{ kind: 'fruit', fruit: which }} label={`Choose ${which}`}>
        <FruitArt which={which} /><span>{which === 'apples' ? 'Apples' : 'Pears'}</span>
      </DragButton>)}
    </div>
    <button type="button" className="iw-drop iw-basket" data-drop-target="basket" disabled={disabled} onClick={() => onAction({ kind: 'place', targetId: 'basket' })}>
      <span className="iw-basket-fruit" aria-hidden="true">
        {(['apples', 'pears'] as const).flatMap(which => Array.from({ length: Math.min(24, draft[which] ?? 0) }, (_, i) => <FruitArt key={`${which}-${i}`} which={which} />))}
      </span>
      <span>Place selected fruit in basket</span>
    </button>
    <div className="iw-counts">
      {(['apples', 'pears'] as const).map(which => <fieldset key={which}>
        <legend>{which === 'apples' ? 'Apples' : 'Pears'}</legend>
        <output aria-label={`${which} count`}>{draft[which] === null ? 'Not set' : draft[which]}</output>
        <div className="iw-toolbar">
          <button type="button" aria-label={`Remove one ${which === 'apples' ? 'apple' : 'pear'}`} disabled={disabled || draft[which] === null || draft[which]! <= responseSpec.countBounds.min}
            onClick={() => onAction({ kind: 'remove', targetId: which })}>Remove one</button>
          <button type="button" aria-label={`Add one ${which === 'apples' ? 'apple' : 'pear'}`} disabled={disabled || (draft[which] !== null && draft[which]! >= responseSpec.countBounds.max) || total >= responseSpec.maxTotal}
            onClick={() => onAction({ kind: 'increment', fruit: which, delta: 1 })}>Add one</button>
          <button type="button" aria-label={`Set ${which} to zero`} disabled={disabled || responseSpec.countBounds.min > 0} onClick={() => onAction({ kind: 'set', fruit: which, value: 0 })}>Set zero</button>
          <button type="button" aria-label={`Clear ${which} count`} disabled={disabled || draft[which] === null} onClick={() => onAction({ kind: 'set', fruit: which, value: null })}>Clear count</button>
        </div>
      </fieldset>)}
    </div>
    <Footer {...props} summary={`${total} fruit in the basket.${draft.apples === null || draft.pears === null ? ' Some counts are not set.' : ''}${draft.selection?.kind === 'fruit' ? ` ${draft.selection.fruit} selected.` : ''}`} />
  </section>;
}
