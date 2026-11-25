import { useEffect } from 'react';
import { LEVEL_NUMS, levelClearId, levelEnterId, type LevelNum } from './rules';
import { useGame } from './store';

const TICK_MS = 200;
const ENTER_MS = 1200;
const CLEAR_MS = 2000;

/**
 * One observer on a viewport-center line finds the active level; a second watches the end sentinels (plan 4.2).
 * Dwell time accumulates while a level is active, the tab is visible and no ruler jump is running, so levels
 * scrolled through by a jump grant nothing. Mount once on the home route.
 */
export function useLevelTracker(): void {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-level]'));
    const sentinels = Array.from(document.querySelectorAll<HTMLElement>('[data-level-end]'));
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const dwell = new Map<LevelNum, number>(LEVEL_NUMS.map((n) => [n, 0]));
    const endVisible = new Set<LevelNum>();
    const levelOf = (el: Element): LevelNum | null => {
      const n = Number(el.closest('section[data-level]')?.getAttribute('data-level'));
      return (LEVEL_NUMS as readonly number[]).includes(n) ? (n as LevelNum) : null;
    };

    const centre = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const n = levelOf(e.target) ?? Number(e.target.getAttribute('data-level'));
          if (e.isIntersecting && (LEVEL_NUMS as readonly number[]).includes(n)) useGame.getState().setActiveLevel(n as LevelNum);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    const ends = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const n = levelOf(e.target);
        if (n === null) continue;
        if (e.isIntersecting) endVisible.add(n);
        else endVisible.delete(n);
      }
    });
    sections.forEach((s) => centre.observe(s));
    sentinels.forEach((s) => ends.observe(s));

    const tick = window.setInterval(() => {
      const st = useGame.getState();
      const n = st.activeLevel;
      if (n === 0 || st.jumping || document.hidden) return;
      const t = (dwell.get(n) ?? 0) + TICK_MS;
      dwell.set(n, t);
      if (t >= ENTER_MS) st.grant(levelEnterId(n));
      if (t >= CLEAR_MS && endVisible.has(n)) st.grant(levelClearId(n));
    }, TICK_MS);

    return () => {
      window.clearInterval(tick);
      centre.disconnect();
      ends.disconnect();
      useGame.getState().setActiveLevel(0);
    };
  }, []);
}
