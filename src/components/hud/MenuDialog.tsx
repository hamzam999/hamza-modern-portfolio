import { Link, useLocation } from 'react-router-dom';
import { LEVELS } from '@/content/levels';
import { PROFILE } from '@/content/profile';
import { selectUnlockedArcade, useGame } from '@/game/store';
import { IconClose } from '@/components/icons/Icons';
import { ModalDialog } from './ModalDialog';
import { SettingsToggles } from './Settings';

interface Props {
  open: boolean;
  onClose: () => void;
  onAfterClose: () => void;
  /** Registers what to do once the dialog has closed (so focus is not stolen back by the trigger). */
  onNavigate: (action: () => void) => void;
  goLevel: (anchor: string) => void;
  navigate: (to: string) => void;
}

const isPlain = (e: React.MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/** Menu dialog (plan 5.7): slides down from the top bar with a clip-path. Closes on Escape, link and backdrop. */
export function MenuDialog({ open, onClose, onAfterClose, onNavigate, goLevel, navigate }: Props) {
  const { pathname } = useLocation();
  const unlocked = useGame(selectUnlockedArcade);
  const arcadeSeen = useGame((s) => s.arcadeSeen);

  const toPage = (to: string) => (e: React.MouseEvent) => {
    if (!isPlain(e)) return;
    e.preventDefault();
    onNavigate(() => navigate(to));
    onClose();
  };

  return (
    <ModalDialog open={open} onClose={onClose} onAfterClose={onAfterClose} labelledBy="menu-title" className="menu">
      <div className="menu__inner">
        <div className="menu__head">
          <h2 id="menu-title" className="menu__title">Menu</h2>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="Close menu">
            <IconClose />
          </button>
        </div>
        <nav aria-label="Menu" className="menu__nav">
          <ol className="menu__levels">
            {LEVELS.map((l) => (
              <li key={l.id}>
                <a
                  className="menu__link"
                  href={pathname === '/' ? `#${l.anchor}` : `/#${l.anchor}`}
                  onClick={(e) => {
                    if (!isPlain(e)) return;
                    e.preventDefault();
                    onNavigate(() => goLevel(l.anchor));
                    onClose();
                  }}
                >
                  <span className="menu__num tabular">0{l.index}</span>
                  {l.name}
                </a>
              </li>
            ))}
          </ol>
          <ul className="menu__pages">
            <li>
              <Link className="menu__link menu__link--small" to="/projects" onClick={toPage('/projects')}>All projects</Link>
            </li>
            <li>
              <Link className="menu__link menu__link--small" to="/arcade" onClick={toPage('/arcade')}>
                {unlocked ? (
                  <>Arcade {!arcadeSeen && <span className="menu__new">NEW</span>}</>
                ) : (
                  'Arcade · clear Level 3 to unlock'
                )}
              </Link>
            </li>
            <li>
              <Link className="menu__link menu__link--small" to="/interview-framework" onClick={toPage('/interview-framework')}>Interview framework</Link>
            </li>
            {PROFILE.resumePdf && (
              <li>
                <a className="menu__link menu__link--small" href={PROFILE.resumePdf}>Resume (PDF)</a>
              </li>
            )}
          </ul>
        </nav>
        <h3 className="menu__sub">Settings</h3>
        <SettingsToggles />
      </div>
    </ModalDialog>
  );
}
