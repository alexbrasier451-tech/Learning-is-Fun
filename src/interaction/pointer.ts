import type { ActivityDraft, DraftAction, DraftSelection } from './draft';

export type ClientPoint = Readonly<{ x: number; y: number }>;
export type DropTarget = Readonly<{ id: string; rect: Pick<DOMRectReadOnly, 'left' | 'right' | 'top' | 'bottom'> }>;
export function resolveDropTarget(point: ClientPoint, currentTargets: readonly DropTarget[]): string | null {
  return currentTargets.find(t => point.x >= t.rect.left && point.x < t.rect.right && point.y >= t.rect.top && point.y < t.rect.bottom)?.id ?? null;
}
export type PointerDragBinding = (() => void) & { cancelDrag(): void };
export function cancelDrag(binding: PointerDragBinding): void { binding.cancelDrag(); }

/** getDraft supplies current widget data with this handle's selection. No draft
 * lives in this adapter. Captured events use viewport geometry, not event.target.
 * A tap remains a native click; a completed drag emits select then place. */
export function bindPointerDrag(element: HTMLElement, options: Readonly<{
  getDraft(): ActivityDraft | null;
  resolveDropTarget(point: ClientPoint): string | null;
  onAction(action: DraftAction): void;
}>): PointerDragBinding {
  const doc = element.ownerDocument, win = doc.defaultView!;
  let active: { pointerId: number; start: ClientPoint; selection: DraftSelection; moved: boolean } | null = null;
  let ghost: HTMLDivElement | null = null;
  let suppressClick = false, disposed = false;
  const finish = (cancelled: boolean) => {
    const previous = active;
    active = null;
    ghost?.remove(); ghost = null;
    if (previous && element.hasPointerCapture(previous.pointerId)) element.releasePointerCapture(previous.pointerId);
    if (cancelled && previous?.moved && !disposed) options.onAction({ kind: 'select', selection: null });
  };
  const down = (event: PointerEvent) => {
    if (active || !event.isPrimary || event.button !== 0 || disposed) return;
    suppressClick = false;
    const draft = options.getDraft();
    if (!draft?.selection) return;
    active = { pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, selection: draft.selection, moved: false };
    try { element.setPointerCapture(event.pointerId); } catch { finish(true); }
  };
  const move = (event: PointerEvent) => {
    if (!active || event.pointerId !== active.pointerId) return;
    if (!options.getDraft()) { finish(true); return; }
    if (!active.moved && Math.hypot(event.clientX - active.start.x, event.clientY - active.start.y) < 6) return;
    if (!active.moved) {
      active.moved = true;
      options.onAction({ kind: 'select', selection: active.selection });
      ghost = doc.createElement('div');
      ghost.className = 'iw-drag-ghost'; ghost.setAttribute('aria-hidden', 'true');
      ghost.textContent = element.getAttribute('data-ghost-label') ?? element.textContent;
      doc.body.append(ghost);
    }
    ghost!.style.left = `${event.clientX + 12}px`; ghost!.style.top = `${event.clientY + 12}px`;
    event.preventDefault();
  };
  const up = (event: PointerEvent) => {
    if (!active || event.pointerId !== active.pointerId) return;
    const previous = active;
    if (!previous.moved) { finish(false); return; }
    suppressClick = true;
    const target = options.getDraft() ? options.resolveDropTarget({ x: event.clientX, y: event.clientY }) : null;
    finish(!target);
    if (target) {
      options.onAction({ kind: 'select', selection: previous.selection });
      options.onAction({ kind: 'place', targetId: target });
    }
    event.preventDefault();
  };
  const interrupted = (event: PointerEvent) => { if (active?.pointerId === event.pointerId) { suppressClick = active.moved; finish(true); } };
  const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && active) { suppressClick = active.moved; finish(true); } };
  const resized = () => { if (active) { suppressClick = active.moved; finish(true); } };
  const click = (event: MouseEvent) => {
    if (suppressClick && event.detail !== 0) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; }
  };
  element.addEventListener('pointerdown', down);
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerup', up);
  element.addEventListener('pointercancel', interrupted);
  element.addEventListener('lostpointercapture', interrupted);
  element.addEventListener('click', click, true);
  win.addEventListener('keydown', escape);
  win.addEventListener('resize', resized);
  win.addEventListener('orientationchange', resized);
  win.addEventListener('blur', resized);
  const dispose = () => {
    if (disposed) return;
    disposed = true; finish(true);
    element.removeEventListener('pointerdown', down);
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', up);
    element.removeEventListener('pointercancel', interrupted);
    element.removeEventListener('lostpointercapture', interrupted);
    element.removeEventListener('click', click, true);
    win.removeEventListener('keydown', escape);
    win.removeEventListener('resize', resized);
    win.removeEventListener('orientationchange', resized);
    win.removeEventListener('blur', resized);
  };
  return Object.assign(dispose, { cancelDrag: () => finish(true) });
}
