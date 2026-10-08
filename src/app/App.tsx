import { useEffect, useReducer, useRef } from 'react';
import { APP_ID, BASE_URL, BUILD_ID } from '../platform/appIdentity';
import { navigationReducer, type AppView, type NavigationPort } from './navigation';

/** Early neutral shell. Domain panels and leave guards arrive in WP01-02A. */
export function App() {
  const [view, navigate] = useReducer(navigationReducer, { kind: 'profiles' });
  const heading = useRef<HTMLHeadingElement>(null);
  const navigation: NavigationPort = { navigate };
  useEffect(() => { heading.current?.focus(); }, [view]);
  const destinations: AppView[] = [{ kind: 'profiles' }, { kind: 'world' }, { kind: 'help' }];
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '2rem', maxWidth: '60rem', fontSize: '18px' }}>
      <h1 ref={heading} tabIndex={-1}>Learning is Fun — {view.kind}</h1>
      <p>The platform is ready for adventure panels.</p>
      <nav aria-label="Platform views" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {destinations.map(destination => (
          <button key={destination.kind} style={{ minHeight: '44px', padding: '0.5rem 1rem', font: 'inherit' }}
            onClick={() => navigation.navigate(destination)}>{destination.kind}</button>
        ))}
      </nav>
      <p><small>{APP_ID} · {BASE_URL} · {BUILD_ID}</small></p>
    </main>
  );
}
