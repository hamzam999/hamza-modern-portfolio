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
export function useReducedMotion(): boolean {
  const system = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setting = useGame((s) => s.settings.motion);
  return setting === 'off' || system;
}

/** Non-hook read for event handlers and rAF loops. */
export function prefersReducedMotion(): boolean {
  return useGame.getState().settings.motion === 'off' || getSnapshot();
}

/** Mirrors the Motion setting onto html.reduced so CSS duration tokens collapse to 0. Mount once in the app shell. */
export function useSyncMotionClass(): void {
  const off = useGame((s) => s.settings.motion === 'off');
  useEffect(() => {
    document.documentElement.classList.toggle('reduced', off);
  }, [off]);
}
