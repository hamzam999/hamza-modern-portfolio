import { useEffect, useSyncExternalStore } from 'react';
import { useGame } from '@/game/store';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
const getSnapshot = (): boolean => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches;
const getServerSnapshot = (): boolean => false;

/** True when the system asks for reduced motion OR the in-site Motion setting is off (plan 3.5, 7.6). SSR renders false. */
export function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useReducedMotion(): boolean {
  const system = useSystemReducedMotion();
  const setting = useGame((s) => s.settings.motion);
  return setting === 'off' || system;
}

/** Non-hook read for event handlers and rAF loops. */
export function prefersReducedMotion(): boolean {
  return useGame.getState().settings.motion === 'off' || getSnapshot();
}

/** Mirrors the Motion setting and the system preference onto html.reduced so CSS duration tokens collapse to 0. Mount once in the app shell. */
export function useSyncMotionClass(): void {
  const setting = useGame((s) => s.settings.motion);
  useEffect(() => {
    // Read the media query directly (not through useSyncExternalStore, whose hydration snapshot is false)
    // so the class the inline script set before first paint is never removed and re-added.
    const mq = window.matchMedia(QUERY);
    const apply = () => document.documentElement.classList.toggle('reduced', setting === 'off' || mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [setting]);
}
