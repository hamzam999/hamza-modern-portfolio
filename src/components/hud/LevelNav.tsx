import { useLocation } from 'react-router-dom';
import { LEVELS } from '@/content/levels';
import { useGame } from '@/game/store';
import { useLevelNav } from '@/lib/useLevelNav';

/**
 * The six levels as top bar links (desktop, from 1024 px): level number plus name, the active level highlighted.
 * Uses the same jump logic as the ruler and menu, so focus lands on the level heading. Below 1024 px the levels
 * stay in the menu and on the bottom ruler.
 */
export function LevelNav() {
  const { pathname } = useLocation();
  const active = useGame((s) => s.activeLevel);
  const goLevel = useLevelNav();
  const current = pathname === '/' ? Math.max(1, active) : 0;
  return (
    <nav aria-label="Jump to a level" className="levelnav">
      <ol className="levelnav__list">
        {LEVELS.map((l) => {
          const on = current === l.index;
          return (
            <li key={l.id} className="levelnav__item">
              <a
                className="levelnav__link"
                href={pathname === '/' ? `#${l.anchor}` : `/#${l.anchor}`}
                aria-current={on && active !== 0 ? 'location' : undefined}
                data-active={on ? '' : undefined}
                onClick={(e) => {
                  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  goLevel(l.anchor);
                }}
              >
                <span className="levelnav__num tabular">{String(l.index).padStart(2, '0')}</span>
                <span className="levelnav__name">{l.name}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
