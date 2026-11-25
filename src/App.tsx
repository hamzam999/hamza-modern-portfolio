import { Suspense, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Cursor } from '@/components/ui/Cursor';
import { Grain } from '@/components/ui/Grain';
import { SkipLink } from '@/components/ui/SkipLink';
import { Toast } from '@/components/ui/Toast';
import { Footer } from '@/components/hud/Footer';
import { Ruler } from '@/components/hud/Ruler';
import { TopBar } from '@/components/hud/TopBar';
import { useGame } from '@/game/store';
import { useSyncMotionClass } from '@/lib/motion';
import { scrollToLevel, scrollToTop } from '@/lib/scroll';
import { Head } from '@/seo/Head';
import Home from '@/routes/Home';
import NotFound from '@/routes/NotFound';
import ProjectPage from '@/routes/ProjectPage';
import ProjectsIndex from '@/routes/ProjectsIndex';
import { Arcade, InterviewFramework } from '@/routes/lazyRoutes';

interface LocationState {
  /** Set when the project detail sheet opens over the page it came from (plan 4.4; the sheet itself lands in Phase 3). */
  backgroundLocation?: ReturnType<typeof useLocation>;
}

/** On client navigation: scroll to top (or to the hash level) and move focus to the route's H1. */
function useRouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (hash) {
      window.setTimeout(() => scrollToLevel(hash.slice(1), { updateHash: false }), 0);
      return;
    }
    scrollToTop();
    const h1 = document.querySelector<HTMLElement>('main h1');
    const target = h1 && h1.hasAttribute('tabindex') ? h1 : document.querySelector<HTMLElement>('main');
    target?.focus({ preventScroll: true });
  }, [pathname, hash]);
}

export function App() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const pageLocation = state?.backgroundLocation ?? location;
  const isHome = pageLocation.pathname === '/';
  const announcement = useGame((s) => s.announcement);
  useSyncMotionClass();
  useRouteEffects();

  return (
    <div className={`app${isHome ? ' app--ruler' : ''}`}>
      <Head />
      <SkipLink />
      <TopBar />
      <Suspense fallback={null}>
        <Routes location={pageLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsIndex />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/arcade" element={<Arcade />} />
          <Route path="/interview-framework" element={<InterviewFramework />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      {isHome && <Ruler />}
      <Toast />
      <Grain />
      <Cursor />
      <div id="game-status" className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
  );
}
