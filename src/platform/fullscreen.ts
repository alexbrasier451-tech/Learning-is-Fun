/** Call only from the player's explicit gesture. The browser owns exit. */
export async function requestFullscreen(element: HTMLElement): Promise<'entered' | 'unavailable' | 'denied'> {
  if (typeof element.requestFullscreen !== 'function' || element.ownerDocument.fullscreenEnabled === false) return 'unavailable';
  try { await element.requestFullscreen(); return 'entered'; }
  catch { return 'denied'; }
}
