import { useSyncExternalStore } from 'react';
import { AudioControls } from '../audio/AudioControls';
import { BackupPanel } from '../adult/BackupPanel';
import type { AppRuntime } from './createAppRuntime';
import { StateControllerProvider } from './StateControllerProvider';
import { AppShell } from './AppShell';
import './shell.css';

export function App({ runtime }: { runtime: AppRuntime }) {
  const load = useSyncExternalStore(runtime.state.subscribe, runtime.state.getLoadState, runtime.state.getLoadState);
  if (load.status === 'ready' || load.status === 'new') return <StateControllerProvider controller={runtime.state}><AppShell runtime={runtime} /></StateControllerProvider>;
  return <div className="app-shell"><header className="shell-header"><span className="shell-brand">Learning is Fun</span><AudioControls controller={runtime.audio} /></header>
    <main className="shell-paper recovery"><h1>{load.status === 'loading' ? 'Opening your story…' : 'Your saved story needs a little care'}</h1>
      <p role="status">{load.status === 'loading' ? 'Everything stays quiet while your saved stories and sound choices load.' : 'reason' in load ? load.reason.message : 'Your saved story is unavailable. Retry opening it or recover from a backup.'}</p>
      {load.status !== 'loading' && <><button onClick={() => { void runtime.state.refresh(); }}>Retry opening saved stories</button>
        <BackupPanel backupActions={{ ...runtime.state.backupActions, exportRawRecoveryData: runtime.state.exportRawRecoveryData }} saveStatus={{ token: null, profileNames: [], pending: false, failed: true }} /></>}
    </main></div>;
}
