import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ActivityDraft, DraftAction, DraftSelection, Fruit } from './draft';
import type { ExactQuantity, ResponseSpec } from '../learning/contracts';
import { ClockFace } from './TaskStimulus';
import { bindPointerDrag, resolveDropTarget } from './pointer';
import { assetUrl } from '../platform/assets';
import './widgets.css';

export type ActivityWidgetProps = Readonly<{
  responseSpec: ResponseSpec; draft: ActivityDraft; disabled: boolean;
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

/** Item and destination IDs are the only relationship stored by these boards. */
function AssignmentBoard(props: ActivityWidgetProps & { mode: 'matching' | 'sorting' }) {
  const { draft, responseSpec, disabled, onAction, mode } = props;
  if ((draft.kind !== 'matching' && draft.kind !== 'sorting') || (responseSpec.kind !== 'matching' && responseSpec.kind !== 'sorting') || draft.kind !== mode || responseSpec.kind !== mode) throw new TypeError('AssignmentBoard needs a matching draft/specification.');
  const assignments = draft.kind === 'matching' ? draft.pairs : draft.groups;
  const targets = responseSpec.kind === 'matching' ? responseSpec.targets : responseSpec.groups;
  const itemLabel = (id: string) => responseSpec.items.find(item => item.id === id)!.label;
  const targetLabel = (id: string) => targets.find(target => target.id === id)!.label;
  return <section className={`iw-widget iw-${mode}`} aria-label={mode === 'matching' ? 'Matching construction' : 'Sorting construction'}>
    <h2>{mode === 'matching' ? 'Make your pairs' : 'Arrange your groups'}</h2>
    <p>Choose an item, then its {mode === 'matching' ? 'partner' : 'group'}. You can move or remove an assignment.</p>
    <div className="iw-palette" aria-label="Items">
      {responseSpec.items.map(item => <div className="iw-item-card" key={item.id}>
        <DragButton {...props} selection={{ kind: 'item', id: item.id }} label={`Choose ${item.label}`}>{item.label}</DragButton>
        <p>{assignments[item.id] === null ? 'Unassigned' : targetLabel(assignments[item.id]!)}</p>
        <button type="button" disabled={disabled || assignments[item.id] === null} aria-label={`Remove ${item.label} assignment`} onClick={event => {
          event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('.iw-piece')?.focus();
          onAction({ kind: 'remove', targetId: item.id });
        }}>Remove assignment</button>
      </div>)}
    </div>
    <div className="iw-destinations">
      {targets.map(target => <div className="iw-destination" key={target.id}>
        <button type="button" className="iw-drop" data-drop-target={target.id} disabled={disabled}
          aria-label={`Place selected item with ${target.label}`} onClick={() => onAction({ kind: 'place', targetId: target.id })}>{target.label}</button>
        <ul aria-label={`${target.label} assignments`}>{Object.entries(assignments).filter(([, id]) => id === target.id).map(([id]) => <li key={id}>{itemLabel(id)}</li>)}</ul>
      </div>)}
    </div>
    <Footer {...props} summary={`${Object.values(assignments).filter(id => id !== null).length} of ${responseSpec.items.length} items assigned.${draft.selection?.kind === 'item' ? ` ${itemLabel(draft.selection.id)} selected.` : ''}`} />
  </section>;
}
export function MatchingBoard(props: ActivityWidgetProps) { return <AssignmentBoard {...props} mode="matching" />; }
export function SortBoard(props: ActivityWidgetProps) { return <AssignmentBoard {...props} mode="sorting" />; }

export function SequenceList(props: ActivityWidgetProps) {
  const { draft, responseSpec, disabled, onAction } = props;
  if (draft.kind !== 'sequence' || responseSpec.kind !== 'sequence') throw new TypeError('SequenceList needs a sequence draft/specification.');
  const label = (id: string) => responseSpec.tiles.find(tile => tile.id === id)!.label;
  return <section className="iw-widget iw-sequence" aria-label="Sequence construction">
    <h2>Arrange the panels</h2><p>Choose a panel, then move it before or after another. Earlier and Later work too.</p>
    <ol className="iw-sequence-list">{draft.orderedIds.map((id, index) => <li className="iw-sequence-card" key={id} data-sequence-id={id}>
      <span>Position {index + 1}</span>
      <DragButton {...props} selection={{ kind: 'item', id }} label={`Choose ${label(id)}`}>{label(id)}</DragButton>
      <div className="iw-toolbar">{(['before', 'after'] as const).map(direction => <button key={direction} type="button" disabled={disabled}
        data-drop-target={`${direction}:${id}`} aria-label={`Place selected panel ${direction} ${label(id)}`} onClick={() => onAction({ kind: 'place', targetId: `${direction}:${id}` })}>{direction === 'before' ? 'Place before' : 'Place after'}</button>)}</div>
      <div className="iw-toolbar">
        <button type="button" disabled={disabled || index === 0} aria-label={`Move ${label(id)} earlier`} onClick={event => {
          event.currentTarget.closest('li')?.querySelector<HTMLButtonElement>('.iw-piece')?.focus();
          onAction({ kind: 'move', instanceId: id, direction: 'before' });
        }}>Earlier</button>
        <button type="button" disabled={disabled || index === draft.orderedIds.length - 1} aria-label={`Move ${label(id)} later`} onClick={event => {
          event.currentTarget.closest('li')?.querySelector<HTMLButtonElement>('.iw-piece')?.focus();
          onAction({ kind: 'move', instanceId: id, direction: 'after' });
        }}>Later</button>
      </div>
    </li>)}</ol>
    <Footer {...props} summary={`Order: ${draft.orderedIds.map(label).join(' · ')}.${draft.selection?.kind === 'item' ? ` ${label(draft.selection.id)} selected.` : ''}`} />
  </section>;
}

function ExactQuantityControl(props: ActivityWidgetProps) {
  const { draft, responseSpec, disabled, onAction } = props;
  if (draft.kind !== 'quantity' || responseSpec.kind !== 'quantity') throw new TypeError('ExactQuantityControl needs a quantity draft/specification.');
  return <section className="iw-widget iw-quantity" aria-label="Quantity construction">
    <h2>Set your quantities</h2><p>Choose the parts, denominator and unit. Each value remains exactly as you set it.</p>
    <div className="iw-counts">{responseSpec.slots.map(slot => {
      const value = draft.values[slot.id];
      const initial: ExactQuantity = { numerator: slot.numeratorBounds.min, denominator: slot.allowedDenominators[0], unit: slot.units[0] };
      const set = (next: ExactQuantity | null) => onAction({ kind: 'set-quantity', slotId: slot.id, value: next });
      return <fieldset key={slot.id}><legend>{slot.label}</legend>
        <output aria-label={`${slot.label} value`}>{value === null ? 'Not set' : `${value.numerator}/${value.denominator} ${value.unit}`}</output>
        <p>Parts from {slot.numeratorBounds.min} to {slot.numeratorBounds.max}; {slot.form === 'exact' ? 'keep the declared form' : 'equivalent forms are allowed'}.</p>
        <div className="iw-toolbar">
          <button type="button" aria-label={`Decrease ${slot.label} parts`} disabled={disabled || value === null || value.numerator <= slot.numeratorBounds.min} onClick={() => set({ ...value!, numerator: value!.numerator - 1 })}>One fewer part</button>
          <button type="button" aria-label={`Increase ${slot.label} parts`} disabled={disabled || (value !== null && value.numerator >= slot.numeratorBounds.max)} onClick={() => set(value === null ? { ...initial, numerator: Math.min(slot.numeratorBounds.max, slot.numeratorBounds.min + 1) } : { ...value, numerator: value.numerator + 1 })}>One more part</button>
          {[10, 100].filter(step => slot.numeratorBounds.max - slot.numeratorBounds.min >= step).map(step => <span className="iw-toolbar" key={step}>
            <button type="button" aria-label={`Decrease ${slot.label} by ${step} parts`} disabled={disabled || value === null || value.numerator - step < slot.numeratorBounds.min} onClick={() => set({ ...value!, numerator: value!.numerator - step })}>−{step} parts</button>
            <button type="button" aria-label={`Increase ${slot.label} by ${step} parts`} disabled={disabled || (value?.numerator ?? initial.numerator) + step > slot.numeratorBounds.max} onClick={() => set({ ...(value ?? initial), numerator: (value?.numerator ?? initial.numerator) + step })}>+{step} parts</button>
          </span>)}
          <button type="button" aria-label={`Set ${slot.label} minimum`} disabled={disabled} onClick={() => set({ ...(value ?? initial), numerator: slot.numeratorBounds.min })}>Set minimum</button>
          <button type="button" aria-label={`Clear ${slot.label}`} disabled={disabled || value === null} onClick={() => set(null)}>Clear value</button>
        </div>
        <p>Denominator</p><div className="iw-toolbar">{slot.allowedDenominators.map(denominator => <button key={denominator} type="button" aria-label={`${slot.label} denominator ${denominator}`}
          aria-pressed={value?.denominator === denominator} disabled={disabled} onClick={() => set({ ...(value ?? initial), denominator })}>{denominator}</button>)}</div>
        <p>Unit</p><div className="iw-toolbar">{slot.units.map(unit => <button key={unit} type="button" aria-label={`${slot.label} unit ${unit}`}
          aria-pressed={value?.unit === unit} disabled={disabled} onClick={() => set({ ...(value ?? initial), unit })}>{unit}</button>)}</div>
      </fieldset>;
    })}</div>
    <Footer {...props} summary={`${Object.values(draft.values).filter(value => value !== null).length} of ${responseSpec.slots.length} quantities set.`} />
  </section>;
}

function ClockControl(props: ActivityWidgetProps) {
  const { draft, responseSpec, disabled, onAction } = props;
  const face = useRef<HTMLDivElement>(null);
  const hourHandle = useRef<HTMLButtonElement>(null), minuteHandle = useRef<HTMLButtonElement>(null);
  const latest = useRef(props); latest.current = props;
  useEffect(() => {
    const bindings = (['hour', 'minute'] as const).map(hand => bindPointerDrag((hand === 'hour' ? hourHandle : minuteHandle).current!, {
      getDraft: () => latest.current.disabled ? null : { ...latest.current.draft, selection: { kind: 'clock-hand', hand } },
      resolveDropTarget: point => {
        const current = latest.current;
        if (current.draft.kind !== 'clock' || current.responseSpec.kind !== 'clock') return null;
        const box = face.current!.getBoundingClientRect();
        const dx = point.x - (box.left + box.width / 2), dy = point.y - (box.top + box.height / 2);
        const radius = Math.min(box.width, box.height) / 2;
        if (Math.hypot(dx, dy) > radius || Math.hypot(dx, dy) < radius * .15) return null;
        const turn = (Math.atan2(dx, -dy) / (2 * Math.PI) + 1) % 1;
        const old = current.draft.minutes ?? current.responseSpec.minuteBounds.min;
        const minutes = hand === 'minute' ? Math.floor(old / 60) * 60 + Math.round(turn * 60) % 60
          : Math.floor(old / 720) * 720 + (Math.round(turn * 12) % 12) * 60 + old % 60;
        return minutes >= current.responseSpec.minuteBounds.min && minutes <= current.responseSpec.minuteBounds.max ? `minute:${minutes}` : null;
      },
      onAction: action => { if (!latest.current.disabled) latest.current.onAction(action); },
    }));
    return () => bindings.forEach(dispose => dispose());
  }, []);
  if (draft.kind !== 'clock' || responseSpec.kind !== 'clock') throw new TypeError('ClockControl needs a clock draft/specification.');
  const base = draft.minutes ?? responseSpec.minuteBounds.min;
  const change = (minutes: number | null) => onAction({ kind: 'set-clock', minutes });
  const inBounds = (minutes: number) => minutes >= responseSpec.minuteBounds.min && minutes <= responseSpec.minuteBounds.max;
  const hour = Math.floor(base / 60);
  return <section className="iw-widget iw-clock" aria-label="Clock construction">
    <h2>Set your clock</h2><p>Choose hours and minutes with the number buttons, or drag a hand handle to the dial. The dial repeats every twelve hours.</p>
    <div className="iw-clock-dial" ref={face}><ClockFace minutes={draft.minutes} /></div>
    <output aria-label="Clock value">{draft.minutes === null ? 'Not set' : `${String(hour).padStart(2, '0')}:${String(base % 60).padStart(2, '0')} · ${base} minutes`}</output>
    <div className="iw-toolbar">
      {(['hour', 'minute'] as const).map(hand => <button key={hand} type="button" ref={hand === 'hour' ? hourHandle : minuteHandle}
        className="iw-drag-handle" aria-pressed={draft.selection?.kind === 'clock-hand' && draft.selection.hand === hand} disabled={disabled}
        data-ghost-label={`${hand} hand`} aria-label={`Choose ${hand} hand`} onClick={() => onAction({ kind: 'select', selection: { kind: 'clock-hand', hand } })}>Move {hand} hand</button>)}
      <button type="button" disabled={disabled} onClick={() => change(responseSpec.minuteBounds.min)}>Set earliest time</button>
      <button type="button" disabled={disabled || draft.minutes === null} onClick={() => change(null)}>Clear time</button>
    </div>
    <fieldset className="iw-clock-options"><legend>Hour in 24-hour notation</legend><div className="iw-toolbar">{Array.from({ length: 24 }, (_, h) => h).filter(h => inBounds(h * 60 + base % 60)).map(h => <button key={h} type="button" aria-label={`Set hour ${h}`} aria-pressed={draft.minutes !== null && hour === h} disabled={disabled} onClick={() => change(h * 60 + base % 60)}>{String(h).padStart(2, '0')}</button>)}</div></fieldset>
    <fieldset className="iw-clock-options"><legend>Minute</legend><div className="iw-toolbar">
      {Array.from({ length: 12 }, (_, i) => i * 5).filter(m => inBounds(hour * 60 + m)).map(m => <button key={m} type="button" aria-label={`Set minute ${m}`} aria-pressed={draft.minutes !== null && base % 60 === m} disabled={disabled} onClick={() => change(hour * 60 + m)}>{String(m).padStart(2, '0')}</button>)}
      <button type="button" aria-label="One minute earlier" disabled={disabled || !inBounds(base - 1)} onClick={() => change(base - 1)}>−1 minute</button>
      <button type="button" aria-label="One minute later" disabled={disabled || !inBounds(base + 1)} onClick={() => change(base + 1)}>+1 minute</button>
    </div></fieldset>
    <Footer {...props} summary={draft.minutes === null ? 'Time not set.' : `Clock set to ${String(hour).padStart(2, '0')}:${String(base % 60).padStart(2, '0')}.`} />
  </section>;
}

export function ChoiceTiles(props: ActivityWidgetProps) {
  const { draft, responseSpec, disabled, onAction } = props;
  if ((draft.kind !== 'punctuation' && draft.kind !== 'choice') || (responseSpec.kind !== 'punctuation' && responseSpec.kind !== 'choice') || draft.kind !== responseSpec.kind) throw new TypeError('ChoiceTiles needs a matching choice draft/specification.');
  const punctuation = draft.kind === 'punctuation';
  const slots = draft.kind === 'punctuation' ? draft.slots : draft.choices;
  const options = [...new Map(responseSpec.slots.flatMap(slot => slot.options).map(option => [option.id, option])).values()];
  const selectedMark = draft.selection?.kind === 'mark' ? draft.selection.value : null;
  const filled = Object.values(slots).filter(value => value !== null).length;
  return <section className="iw-widget iw-punctuation" aria-label={punctuation ? 'Punctuation construction' : 'Choice construction'}>
    <h2>{punctuation ? 'Give each sentence its mark' : 'Choose for each space'}</h2>
    <p>{punctuation ? 'Choose a mark, then choose a sentence space. You can replace or clear it.' : 'Choose an option, then its space. You can replace or clear it.'}</p>
    <div className="iw-palette" aria-label={punctuation ? 'Punctuation marks' : 'Options'}>
      {options.map(option => <DragButton key={option.id} {...props} selection={{ kind: 'mark', value: option.id }} label={`Choose ${option.label}`}>
        {punctuation && <span className="iw-mark">{option.id}</span>}<span>{option.label}</span>
      </DragButton>)}
    </div>
    <div className="iw-sentences">
      {responseSpec.slots.map(slot => <div className="iw-sentence" key={slot.id}>
        <p>{slot.label}</p>
        <button type="button" className="iw-slot" data-drop-target={slot.id} aria-label={`Place selected ${punctuation ? 'mark' : 'option'} in ${slot.id}`}
          disabled={disabled || (selectedMark !== null && !slot.options.some(option => option.id === selectedMark))}
          onClick={() => onAction({ kind: 'place', targetId: slot.id })}>
          <span className={punctuation ? 'iw-mark' : undefined}>{slots[slot.id] === null ? '…' : punctuation ? slots[slot.id] : slot.options.find(option => option.id === slots[slot.id])?.label}</span><span>{slots[slot.id] === null ? 'Empty space' : 'Replace selection'}</span>
        </button>
        <button type="button" disabled={disabled || slots[slot.id] === null} aria-label={`Clear ${slot.id}`} onClick={() => onAction({ kind: 'remove', targetId: slot.id })}>Clear</button>
      </div>)}
    </div>
    <Footer {...props} summary={`${filled} of ${responseSpec.slots.length} ${punctuation ? 'sentence ' : ''}spaces filled.${selectedMark ? ` ${punctuation ? selectedMark : options.find(option => option.id === selectedMark)!.label} selected.` : ` Choose ${punctuation ? 'a mark' : 'an option'} to place.`}`} />
  </section>;
}

function FruitArt({ which }: { which: Fruit }) {
  return <img className="iw-fruit-art" alt="" draggable={false} src={assetUrl(`assets/art/m1/props/${which === 'apples' ? 'apple' : 'pear'}.svg`)} />;
}
export function QuantityControl(props: ActivityWidgetProps) {
  const { draft, responseSpec, disabled, onAction } = props;
  if (draft.kind === 'quantity' && responseSpec.kind === 'quantity') return <ExactQuantityControl {...props} />;
  if (draft.kind === 'clock' && responseSpec.kind === 'clock') return <ClockControl {...props} />;
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
