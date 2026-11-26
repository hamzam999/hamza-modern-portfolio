import { lazy, Suspense, useEffect, useRef } from 'react';
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

/** A reload keeps history.state, but the sheet must not come back over a page that was just loaded: reload shows the standalone page (plan 6.12.8). */
if (typeof window !== 'undefined') {
  const st = window.history.state as { usr?: LocationState | null } | null;
  if (st?.usr?.backgroundLocation) window.history.replaceState({ ...st, usr: null }, '');
}

const DetailSheet = lazy(() => import('@/components/shelf/DetailSheet'));

interface LocationState {
  /** Set when the project detail sheet opens over the page it came from (plan 4.4). */
  backgroundLocation?: ReturnType<typeof useLocation>;
}

/** On client navigation: scroll to top (or to the hash level) and move focus to the route's H1. */
function useRouteEffects() {
  const { pathname, hash, state } = useLocation();
  const first = useRef(true);
  const wasSheet = useRef(false);
  const isSheet = !!(state as LocationState | null)?.backgroundLocation;
  useEffect(() => {
    // Opening or closing the detail sheet leaves the page underneath exactly where it is (plan 4.4).
    const skip = isSheet || wasSheet.current;
    wasSheet.current = isSheet;
    if (first.current) {
      first.current = false;
      return;
    }
    if (skip && !hash) return;
    if (hash) {
      window.setTimeout(() => scrollToLevel(hash.slice(1), { updateHash: false }), 0);
      return;
    }
    scrollToTop();
    const h1 = document.querySelector<HTMLElement>('main h1');
    const target = h1 && h1.hasAttribute('tabindex') ? h1 : document.querySelector<HTMLElement>('main');
    target?.focus({ preventScroll: true });
  }, [pathname, hash, isSheet]);
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
      {state?.backgroundLocation && (
        <Suspense fallback={null}>
          <Routes>
            <Route path="/projects/:slug" element={<DetailSheet />} />
          </Routes>
        </Suspense>
      )}
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
