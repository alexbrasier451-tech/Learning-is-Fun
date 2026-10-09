const motions = new WeakMap<Element, Animation>();
export function cancelSceneMotion(element: Element | null) {
  if (!element) return;
  motions.get(element)?.cancel(); motions.delete(element);
}
/** Presentation only. The correct static result is already in the DOM. */
export function playRestoration(element: Element | null, reduced: boolean) {
  cancelSceneMotion(element);
  if (!element || reduced || typeof element.animate !== 'function') return;
  const motion = element.animate([{ opacity: .55, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }],
    { duration: 480, easing: 'ease-out' });
  motions.set(element, motion);
  motion.onfinish = () => { if (motions.get(element) === motion) motions.delete(element); };
}
