import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FEATURED } from '@/content/projects';
import { useGame } from '@/game/store';
import { useReducedMotion } from '@/lib/motion';
import { TapeGrid } from '@/components/projects/TapeGrid';
import type { Project } from '@/types/content';

const Shelf = lazy(() => import('./Shelf'));

/** If the shelf throws, the grid comes back and the error stays in the console (plan 6.9). */
class ShelfBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Shelf failed, showing the grid instead.', error, info.componentStack);
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** E2E only: `?shelfN=14` runs the windowed path with a longer list (plan 6.4, P3-9). */
function testItems(): readonly Project[] {
  if (import.meta.env.VITE_TEST_HOOKS !== 'true' || typeof window === 'undefined') return FEATURED;
  const n = Number(new URLSearchParams(window.location.search).get('shelfN'));
  if (!Number.isFinite(n) || n < 1) return FEATURED;
  return Array.from({ length: n }, (_, i) => FEATURED[i % FEATURED.length] as Project);
}

/**
 * Level 4 stage box. Prerender and no-JS show the static grid. With JS and motion allowed the shelf chunk mounts into
 * the same reserved box (shelf.css). Under reduced motion the grid stays, with a "Show as shelf" button (plan 6.9).
 */
export function ShelfBox() {
  const reduced = useReducedMotion();
  const view = useGame((s) => s.settings.shelfView);
  const setSettings = useGame((s) => s.setSettings);
  const navigate = useNavigate();
  const location = useLocation();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [armed, setArmed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [items] = useState(testItems);

  useEffect(() => setMounted(true), []);

  const wantShelf = !failed && (view === 'shelf' || (view === 'auto' && !reduced));

  // Mount the chunk when Level 4 is within one viewport height, or on idle, whichever comes first (plan 6.4).
  useEffect(() => {
    if (!wantShelf || armed) return;
    const box = boxRef.current;
    const go = () => setArmed(true);
    const io = typeof IntersectionObserver !== 'undefined' && box ? new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && go(), { rootMargin: '100% 0px' }) : null;
    if (box && io) io.observe(box);
    const idle = window.requestIdleCallback ? window.requestIdleCallback(go, { timeout: 2500 }) : window.setTimeout(go, 1200);
    return () => {
      io?.disconnect();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [wantShelf, armed]);

  const onOpen = useCallback(
    (slug: string, rect: DOMRect | null) => {
      navigate(`/projects/${slug}`, {
        state: {
          backgroundLocation: location,
          fromShelf: true,
          originRect: rect ? { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom } : undefined,
        },
      });
    },
    [navigate, location],
  );

  const shelfShown = mounted && wantShelf && armed;
  const dataView = !mounted ? undefined : wantShelf ? (armed ? 'shelf' : undefined) : 'grid';

  return (
    <div className="l4__shelf" data-shelf-box>
      <div ref={boxRef} className="shelf-box" data-view={dataView}>
        {shelfShown ? (
          <ShelfBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <Shelf items={items} onOpen={onOpen} instant={reduced} />
            </Suspense>
          </ShelfBoundary>
        ) : (
          <TapeGrid />
        )}
      </div>
      {mounted && (reduced || view !== 'auto') && (
        <p className="shelf-toggle">
          {shelfShown ? (
            <button type="button" className="btn btn--secondary" onClick={() => setSettings({ shelfView: 'grid' })}>
              Show as grid
            </button>
          ) : (
            <button type="button" className="btn btn--secondary" onClick={() => { setFailed(false); setSettings({ shelfView: 'shelf' }); }}>
              Show as shelf
            </button>
          )}
        </p>
      )}
    </div>
  );
}
