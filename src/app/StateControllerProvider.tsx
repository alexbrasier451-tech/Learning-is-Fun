import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import type { ComposedStateController } from '../state/controller';

const StateContext = createContext<ComposedStateController | null>(null);
export function StateControllerProvider({ controller, children }: { controller: ComposedStateController; children: ReactNode }) {
  return <StateContext.Provider value={controller}>{children}</StateContext.Provider>;
}
export function useStateController() {
  const controller = useContext(StateContext);
  if (!controller) throw new Error('The state controller provider is missing.');
  return controller;
}
export function useGameSnapshot() {
  const controller = useStateController();
  return useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
}
