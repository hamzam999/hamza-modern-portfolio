import { useGame } from './store';
import type { EventId } from './rules';

/** Exposed on window.__aq only in the e2e build (VITE_TEST_HOOKS, plan 11.1). Tree-shaken from production. */
export function installTestHooks(): void {
  (window as unknown as { __aq: unknown }).__aq = {
    grant: (id: EventId) => useGame.getState().grant(id),
    reset: () => useGame.getState().reset(),
    winPong: () => useGame.getState().grantPongWin(),
    state: () => useGame.getState(),
  };
}
