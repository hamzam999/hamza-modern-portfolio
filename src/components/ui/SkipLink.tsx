import { useLocation } from 'react-router-dom';

function jump(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ block: 'start' });
  const target = el.matches('main, [tabindex]') ? el : (el.querySelector<HTMLElement>('[data-level-heading]') ?? el);
  target.focus({ preventScroll: true });
}

/** First focusable elements on every page; visible on focus only. */
export function SkipLink() {
  const { pathname } = useLocation();
  return (
    <div className="skip-links">
      <a className="skip-link" href="#main" onClick={(e) => jump(e, 'main')}>
        Skip to content
      </a>
      {pathname === '/' && (
        <a className="skip-link" href="#level-archive" onClick={(e) => jump(e, 'level-archive')}>
          Skip to projects
        </a>
      )}
    </div>
  );
}
