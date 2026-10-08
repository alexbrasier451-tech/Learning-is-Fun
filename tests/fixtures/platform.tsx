import { useEffect, useRef, useState } from 'react';
import { mountPanel } from './host';
import type { AppView, NavigationPort } from '../../src/app/navigation';
import type { ActivePanelLifecycle, ActivePanelStatus } from '../../src/app/panelLifecycle';
import { APP_NAMESPACE, BUILD_ID } from '../../src/platform/appIdentity';
import { assetUrl } from '../../src/platform/assets';

// Neutral status recorder only; no game state, durable reducer, or domain DTOs.
let status: ActivePanelStatus = { dirty: true, pending: false, failed: false };
const listeners = new Set<() => void>();
function clean() {
  status = { dirty: false, pending: false, failed: false };
  listeners.forEach(listener => listener());
}
const lifecycle: ActivePanelLifecycle = {
  getStatus: () => status,
  subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  async suspend() { clean(); return { status: 'ready' }; },
  discardDraft() { clean(); return { status: 'ready' }; },
};

function NeutralPanel() {
  const [view, setView] = useState<AppView>({ kind: 'profiles' });
  const [currentStatus, setCurrentStatus] = useState(lifecycle.getStatus);
  const heading = useRef<HTMLHeadingElement>(null);
  const navigation: NavigationPort = { navigate: setView };
  useEffect(() => lifecycle.subscribe(() => setCurrentStatus(lifecycle.getStatus())), []);
  useEffect(() => { heading.current?.focus(); }, [view]);
  return <section>
    <h1 tabIndex={-1} ref={heading}>Neutral {view.kind} panel</h1>
    <button onClick={() => navigation.navigate({ kind: 'world' })}>Request world view</button>
    <button onClick={() => { void lifecycle.suspend(); }}>Suspend fixture draft</button>
    <button onClick={() => lifecycle.discardDraft()}>Discard fixture draft</button>
    <output aria-label="Panel status">{currentStatus.dirty ? 'dirty' : 'clean'}</output>
    <p>{APP_NAMESPACE} · {BUILD_ID}</p>
    <a href={assetUrl('__wp01-probe.txt')}>Public asset probe</a>
  </section>;
}

const container = document.getElementById('panel');
if (!container) throw new Error('Fixture container is missing.');
const panel = mountPanel(container, <NeutralPanel />);
document.getElementById('unmount')?.addEventListener('click', () => {
  panel.unmount();
  panel.unmount();
  const output = document.getElementById('teardown');
  if (output) output.textContent = `Removed panel; ${listeners.size} subscriptions remain.`;
});
