import { Link } from 'react-router-dom';
import { FEATURED } from '@/content/projects';
import { LEVELS } from '@/content/levels';
import { PROFILE, SOCIAL_LINKS } from '@/content/profile';
import { selectUnlockedArcade, useGame } from '@/game/store';
import { useLevelNav } from '@/lib/useLevelNav';
import { useLocation } from 'react-router-dom';
import { HamzaMark } from '@/components/brand/HamzaMark';
import { ResetProgress, SettingsToggles } from './Settings';

const door = () => {
  useGame.getState().grant('door:contact');
};

const firstSentence = (s: string) => (s.split('. ')[0] ?? s).replace(/\.$/, '') + '.';

export function Footer() {
  const { pathname } = useLocation();
  const goLevel = useLevelNav();
  const unlocked = useGame(selectUnlockedArcade);
  const arcadeSeen = useGame((s) => s.arcadeSeen);
  const setPassportOpen = useGame((s) => s.setPassportOpen);
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__cols">
          <div className="footer__col footer__col--intro">
            <p className="footer__name">
              <HamzaMark className="footer__logo" />
              {PROFILE.name}
            </p>
            <p className="footer__role">{PROFILE.title}</p>
            <p className="footer__bio">{firstSentence(PROFILE.summary[0] ?? '')}</p>
          </div>
          <nav aria-label="Footer levels" className="footer__col">
            <h2 className="footer__title">Levels</h2>
            <ul className="footer__list">
              {LEVELS.map((l) => (
                <li key={l.id}>
                  <a
                    href={pathname === '/' ? `#${l.anchor}` : `/#${l.anchor}`}
                    onClick={(e) => {
                      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      goLevel(l.anchor);
                    }}
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer archive" className="footer__col">
            <h2 className="footer__title">Archive</h2>
            <ul className="footer__list">
              <li><Link to="/projects">All projects</Link></li>
              {FEATURED.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link to={`/projects/${p.slug}`}>{p.cardTitle}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__col">
            <h2 className="footer__title">Elsewhere</h2>
            <ul className="footer__list">
              <li><a href={`mailto:${SOCIAL_LINKS.email}`} onClick={door}>Email</a></li>
              <li><a href={SOCIAL_LINKS.linkedin} rel="noopener noreferrer" onClick={door}>LinkedIn</a></li>
              <li><a href={SOCIAL_LINKS.github} rel="noopener noreferrer" onClick={door}>GitHub</a></li>
              {PROFILE.resumePdf && <li><a href={PROFILE.resumePdf} onClick={door}>Resume (PDF)</a></li>}
            </ul>
          </div>
          <div className="footer__col">
            <h2 className="footer__title">Extras</h2>
            <ul className="footer__list">
              <li>
                <Link to="/arcade">{unlocked ? (arcadeSeen ? 'Arcade' : 'Arcade · NEW') : 'Arcade · clear Level 3 to unlock'}</Link>
              </li>
              <li>
                <button type="button" className="footer__linkbtn" aria-haspopup="dialog" onClick={() => setPassportOpen(true)}>
                  Passport
                </button>
              </li>
              <li><Link to="/interview-framework">Interview framework</Link></li>
              <li><a href="/llms.txt" type="text/plain">llms.txt</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__settings">
          <SettingsToggles />
          <ResetProgress />
        </div>
        <p className="footer__colophon">
          Technology icons: Simple Icons (CC0), Devicon (MIT); logos are trademarks of their owners.<br />
          Set in Inter Tight and Newsreader. Built with React and Vite. © {__BUILD_YEAR__} {PROFILE.name}.
        </p>
      </div>
    </footer>
  );
}
