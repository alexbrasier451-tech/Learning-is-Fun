import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

/** Each producer owns its entry and supplies its panel's actual typed ports. */
export function mountPanel(container: HTMLElement, panel: ReactNode): { unmount(): void } {
  const root = createRoot(container);
  root.render(panel);
  let mounted = true;
  return { unmount() { if (mounted) { mounted = false; root.unmount(); } } };
}
