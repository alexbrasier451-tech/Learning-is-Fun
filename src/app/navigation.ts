/** UI intent only; selected domain entities remain with their producer. */
export type AppView =
  | { kind: 'profiles' }
  | { kind: 'world' }
  | { kind: 'activity' }
  | { kind: 'leaderboard' }
  | { kind: 'adult-entry' }
  | { kind: 'adult' }
  | { kind: 'help' };

export interface NavigationPort { navigate(view: AppView): void }

export function navigationReducer(_current: AppView, requested: AppView): AppView {
  return requested;
}
