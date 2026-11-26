import { useLocation } from 'react-router-dom';
import { LEVELS } from '@/content/levels';
import { PROJECTS } from '@/content/projects';
import { useGame } from '@/game/store';

export function pageLabel(pathname: string): string {
  if (pathname === '/projects') return 'ARCHIVE';
  if (pathname.startsWith('/projects/')) {
    const slug = pathname.split('/')[2];
    const p = PROJECTS.find((x) => x.slug === slug);
    return p ? `ARCHIVE / ${p.spineTitle}` : 'ARCHIVE';
  }
  if (pathname === '/arcade') return 'ARCADE';
  if (pathname === '/interview-framework') return 'INTERVIEW FRAMEWORK';
  return 'LOST REEL';
}

/** "LEVEL 04 / 06 · ARCHIVE" on desktop, "04/06" on mobile; page name on other routes. Text swap is a mask slide. */
export function LevelLabel() {
  const { pathname } = useLocation();
  const active = useGame((s) => s.activeLevel);
  if (pathname !== '/') {
    return (
      <span className="levellabel levellabel--page">
        <span className="levellabel__mask">
          <span className="levellabel__in">{pageLabel(pathname)}</span>
        </span>
      </span>
    );
  }
  const n = Math.max(1, active);
  const level = LEVELS[n - 1];
  const nn = String(n).padStart(2, '0');
  return (
    <span className="levellabel">
      <span className="levellabel__mask">
        <span key={n} className="levellabel__in levellabel__in--swap">
          <span className="levellabel__full">{`LEVEL ${nn} / 06 · ${level?.name.toUpperCase()}`}</span>
          <span className="levellabel__short" aria-hidden="true">{`${nn}/06`}</span>
        </span>
      </span>
    </span>
  );
}
