import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { createAppRuntime } from './app/createAppRuntime';

const container = document.getElementById('root');
if (!container) throw new Error('The application root is missing.');
export const appRuntime = createAppRuntime();
// Development inspection reads the actual instance rather than importing a
// second entry module. This branch is erased from production builds.
if (import.meta.env.DEV) Object.assign(globalThis, { __shellRuntime: appRuntime });
const root = createRoot(container);
root.render(<StrictMode><App runtime={appRuntime} /></StrictMode>);
if (import.meta.hot) import.meta.hot.dispose(() => { root.unmount(); appRuntime.dispose(); });
