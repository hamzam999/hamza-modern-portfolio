import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PROFILE } from '@/content/profile';
import { useGame } from '@/game/store';
import { IconMenu, IconPassport } from '@/components/icons/Icons';
import { useLevelNav } from '@/lib/useLevelNav';
import { LevelLabel } from './LevelLabel';
import { MenuDialog } from './MenuDialog';
import { PassportDialog } from './Passport';
import { XPCounter } from './XPCounter';

/** Fixed top bar (plan 5.7): monogram, level label, XP, passport, Hire me, Menu. Never hides on scroll. */
export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const goLevel = useLevelNav();
  const [menu, setMenu] = useState(false);
  const [passport, setPassport] = useState(false);
  const dot = useGame((s) => s.passportDot);
  const play = useGame((s) => s.settings.play);
  const clearDot = useGame((s) => s.clearPassportDot);
  const pending = useRef<(() => void) | null>(null);

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link to="/" className="topbar__home" aria-label={`${PROFILE.name}, home`}>
          <span className="topbar__mono" aria-hidden="true">MH</span>
          <span className="topbar__name" aria-hidden="true">{PROFILE.name}</span>
        </Link>
        <div className="topbar__center">
          <LevelLabel />
        </div>
        <div className="topbar__right">
          <XPCounter />
          <button
            type="button"
            className="topbar__btn"
            aria-haspopup="dialog"
            onClick={() => {
              clearDot();
              setPassport(true);
            }}
          >
            <IconPassport />
            <span className="topbar__btntext" aria-hidden="true">Passport</span>
            <span className="sr-only">Passport</span>
            {dot && play && <span className="topbar__dot" aria-hidden="true" />}
            {dot && play && <span className="sr-only"> (new stamp)</span>}
          </button>
          <a
            className="btn btn--primary on-cobalt topbar__hire"
            href={pathname === '/' ? '#level-contact' : '/#level-contact'}
            onClick={(e) => {
              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              goLevel('level-contact');
            }}
          >
            Hire me
          </a>
          <button type="button" className="topbar__btn topbar__menu" aria-haspopup="dialog" onClick={() => setMenu(true)}>
            <IconMenu />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
      <MenuDialog
        open={menu}
        onClose={() => setMenu(false)}
        onNavigate={(a) => (pending.current = a)}
        onAfterClose={() => {
          const a = pending.current;
          pending.current = null;
          a?.();
        }}
        goLevel={goLevel}
        navigate={(to) => navigate(to)}
      />
      <PassportDialog open={passport} onClose={() => setPassport(false)} />
    </header>
  );
}
