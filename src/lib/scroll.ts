import { useGame } from '@/game/store';
import { prefersReducedMotion } from './motion';

let timer: number | undefined;

/**
 * Jumps to a level section (plan 4.3): smooth unless reduced, respects scroll-padding, then moves focus to the
 * level heading. While the jump runs the store flag `jumping` is set so no XP is granted for levels passed through.
 */
export function scrollToLevel(anchor: string, opts: { updateHash?: boolean } = {}): void {
  const el = document.getElementById(anchor);
  if (!el) return;
  const { setJumping } = useGame.getState();
  const reduced = prefersReducedMotion();
  setJumping(true);
  window.clearTimeout(timer);

  const finish = () => {
    window.clearTimeout(timer);
    window.removeEventListener('scrollend', finish);
    setJumping(false);
    const heading = el.querySelector<HTMLElement>('[data-level-heading]');
    heading?.focus({ preventScroll: true });
  };
  if ('onscrollend' in window) window.addEventListener('scrollend', finish, { once: true });
  // Fallback where scrollend is unsupported, and when the target is already in view (no scroll happens).
  timer = window.setTimeout(finish, reduced ? 60 : 1200);

  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  if (opts.updateHash !== false) {
    try {
      history.replaceState(history.state, '', `#${anchor}`);
    } catch {
      /* ignore */
    }
  }
}

/** Plain scroll to top for route changes (no hash). */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}
