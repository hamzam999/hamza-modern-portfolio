import { startTransition, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Project } from '@/types/content';
import { CATEGORY_LABEL } from '@/types/content';
import { Caption, Reel } from './Caption';
import { makeGeometry, mod, placeTape, slotPosition, stageHeightFor, tapeHeight, faceTransforms, transformOf, visibleRadius, wrapOffset, poolSize, type Geometry } from './geometry';
import { createShelfEngine, type ShelfEngine, type ShelfFrame } from './spring';
import { Tape } from './Tape';
import { useShelfInput } from './useShelfInput';

export interface ShelfProps {
  items: readonly Project[];
  /** Called when the active tape is activated (click, Enter, Space). `rect` is the cover's on-screen rectangle. */
  onOpen: (slug: string, rect: DOMRect | null) => void;
  /** No spring and no tilt: used when the shelf is chosen under reduced motion (plan 6.9). */
  instant?: boolean;
}

interface Entry {
  el: HTMLElement;
  spine: HTMLElement | null;
  cover: HTMLElement | null;
  sp: HTMLElement | null;
  cv: HTMLElement | null;
  hidden: boolean;
  /** last offset from the current position, used by click handling */
  r: number;
}

interface PoolSlot {
  slot: number;
  item: number;
  copy: -1 | 0 | 1;
}

/**
 * The VHS shelf (plan 6). React renders the tapes once; the engine's frame callback only writes styles
 * (transform, z-index, shade opacity, hidden). React state changes only when the rounded active index changes.
 */
export default function Shelf({ items, onOpen, instant = false }: ShelfProps) {
  const N = items.length;
  const uid = useId();
  const helpId = `${uid}-help`;
  const shelfId = `${uid}-shelf`;
  const wrapRef = useRef<HTMLElement | null>(null);
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const probeRef = useRef<HTMLSpanElement | null>(null);
  const engineRef = useRef<ShelfEngine | null>(null);
  const geoRef = useRef<Geometry | null>(null);
  const entries = useRef<Array<Entry | undefined>>([]);
  const baseRef = useRef(0);
  const inReact = useRef(false);
  const windowed = N > 12;
  const [win, setWin] = useState<{ R: number; K: number } | null>(null);
  const [base, setBase] = useState(0);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('');
  const pendingAnnounce = useRef(false);
  const focusMoved = useRef(false);
  const announceTimer = useRef(0);
  const instantRef = useRef(instant);
  instantRef.current = instant;

  const pool = useMemo<PoolSlot[]>(() => {
    if (windowed) {
      if (!win) return [];
      return Array.from({ length: win.K }, (_, j) => {
        const p = slotPosition(j, base, win.R, win.K);
        return { slot: j, item: mod(p, N), copy: (p === base ? 0 : p < base ? -1 : 1) as -1 | 0 | 1 };
      });
    }
    return items.flatMap((_, i) => ([-1, 0, 1] as const).map((copy) => ({ slot: i * 3 + copy + 1, item: i, copy })));
  }, [windowed, win, base, N, items]);

  const activeIdx = windowed ? mod(base, N) : active;

  /** Writes one frame to the DOM (plan 6.3). No layout reads. */
  const renderFrame = useCallback(
    (f: Readonly<ShelfFrame>) => {
      const g = geoRef.current;
      if (!g) return;
      let b = 0;
      if (windowed) {
        b = Math.round(f.s);
        if (b !== baseRef.current) {
          baseRef.current = b;
          if (inReact.current) setBase(b);
          else flushSync(() => setBase(b));
        }
      }
      const R = win?.R ?? 0;
      const K = win?.K ?? 0;
      const list = entries.current;
      for (let j = 0; j < list.length; j++) {
        const e = list[j];
        if (!e) continue;
        let r: number;
        if (windowed) r = slotPosition(j, b, R, K) - f.s;
        else {
          const item = Math.floor(j / 3);
          r = wrapOffset(item, f.s, N) + ((j % 3) - 1) * N;
        }
        e.r = r;
        const p = placeTape(g, r, f.tilt.x, f.tilt.y);
        if (p.hidden) {
          if (!e.hidden) {
            e.el.hidden = true;
            e.hidden = true;
          }
          continue;
        }
        if (e.hidden) {
          e.el.hidden = false;
          e.hidden = false;
        }
        e.el.style.transform = transformOf(p);
        e.el.style.zIndex = String(p.zIndex);
        const faces = faceTransforms(g, p);
        if (e.spine) e.spine.style.transform = faces.spine;
        if (e.cover) e.cover.style.transform = faces.cover;
        if (e.sp) e.sp.style.opacity = p.spineShade.toFixed(3);
        if (e.cv) e.cv.style.opacity = p.coverShade.toFixed(3);
      }
    },
    [windowed, win, N],
  );
  const renderRef = useRef(renderFrame);
  renderRef.current = renderFrame;

  const collect = useCallback(() => {
    const out: Array<Entry | undefined> = [];
    stageRef.current?.querySelectorAll<HTMLElement>('a.tape').forEach((el) => {
      const slot = Number(el.dataset.slot);
      out[slot] = {
        el,
        spine: el.querySelector<HTMLElement>('.tape__sp'),
        cover: el.querySelector<HTMLElement>('.tape__cv'),
        sp: el.querySelector<HTMLElement>('[data-shade="sp"]'),
        cv: el.querySelector<HTMLElement>('[data-shade="cv"]'),
        hidden: el.hidden,
        r: 0,
      };
    });
    entries.current = out;
  }, []);

  const measure = useCallback(() => {
    const shelf = shelfRef.current;
    const stage = stageRef.current;
    const probe = probeRef.current;
    if (!shelf || !stage || !probe) return;
    const w = shelf.clientWidth;
    if (!w) return;
    const svh = probe.offsetHeight || window.innerHeight;
    const H = tapeHeight(w, svh, stageHeightFor(svh));
    const g = makeGeometry(w, H);
    geoRef.current = g;
    stage.style.setProperty('--H', `${H}px`);
    stage.style.setProperty('--ws', `${g.ws}px`);
    stage.style.setProperty('--d', `${g.d}px`);
    if (windowed) {
      const R = visibleRadius(g);
      const K = poolSize(N, R);
      setWin((cur) => (cur && cur.R === R && cur.K === K ? cur : { R, K }));
    }
    const eng = engineRef.current;
    if (eng) eng.render();
  }, [windowed, N]);

  // Engine lifetime.
  useLayoutEffect(() => {
    const eng = createShelfEngine({
      N,
      instant: instantRef.current,
      onFrame: (f) => renderRef.current(f),
      onActive: (i) => {
        pendingAnnounce.current = true;
        startTransition(() => setActive(i));
      },
      onSettle: () => {
        window.clearTimeout(announceTimer.current);
        announceTimer.current = window.setTimeout(() => {
          if (pendingAnnounce.current && !focusMoved.current) {
            const p = items[eng.active];
            if (p) setStatus(`${p.cardTitle}. ${CATEGORY_LABEL[p.category]}. Tape ${eng.active + 1} of ${N}.`);
          }
          pendingAnnounce.current = false;
          focusMoved.current = false;
        }, 250);
      },
    });
    engineRef.current = eng;
    inReact.current = true;
    measure();
    inReact.current = false;
    return () => {
      window.clearTimeout(announceTimer.current);
      eng.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N, items]);

  // DOM nodes changed (pool built or resized): re-collect and paint synchronously, before the browser paints.
  useLayoutEffect(() => {
    collect();
    inReact.current = true;
    engineRef.current?.render();
    inReact.current = false;
  }, [pool, collect]);

  useEffect(() => {
    inReact.current = true;
    engineRef.current?.setInstant(instant);
    inReact.current = false;
  }, [instant]);

  // Resize: coalesced into the next frame.
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(run);
    ro.observe(shelf);
    window.addEventListener('resize', run);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', run);
    };
  }, [measure]);

  // Pause when off screen or hidden (plan 6.4): the loop settles and stops; will-change is dropped.
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    let inView = true;
    const apply = () => {
      const on = inView && !document.hidden;
      engineRef.current?.setVisible(on);
      if (on) shelf.setAttribute('data-live', '');
      else shelf.removeAttribute('data-live');
    };
    const io = new IntersectionObserver((es) => {
      inView = es.some((e) => e.isIntersecting);
      apply();
    }, { rootMargin: '200px' });
    io.observe(shelf);
    document.addEventListener('visibilitychange', apply);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);

  const focusTape = useCallback((index: number) => {
    focusMoved.current = true;
    const el = stageRef.current?.querySelector<HTMLElement>(`a.tape[data-copy="0"][data-index="${index}"]`);
    el?.focus({ preventScroll: true });
  }, []);

  useShelfInput(
    wrapRef,
    shelfRef,
    {
      engine: () => engineRef.current,
      pitch: () => geoRef.current?.pitch ?? 100,
      cover: () => {
        const g = geoRef.current;
        const r = shelfRef.current?.getBoundingClientRect();
        return g && r ? { cx: r.left + r.width / 2, cy: r.top + r.height / 2, d: g.d, H: g.H } : null;
      },
      onKeyMove: focusTape,
      still: instant,
    },
    N,
  );

  const onTapeClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, slot: number) => {
      // Let the browser handle modifier and middle clicks: the link opens /projects/<slug> in a new tab.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const eng = engineRef.current;
      const entry = entries.current[slot];
      if (!eng || !entry) return;
      e.preventDefault();
      if (Math.abs(entry.r) < 0.5) {
        const el = e.currentTarget;
        onOpen(el.dataset.slug ?? '', el.querySelector('.tape__cv')?.getBoundingClientRect() ?? null);
      } else {
        eng.setTarget(Math.round(eng.state.s + entry.r));
      }
    },
    [onOpen],
  );

  const step = (d: number) => {
    const eng = engineRef.current;
    if (eng) eng.setTarget(Math.round(eng.state.T) + d);
  };

  const current = items[activeIdx] ?? items[0];
  if (!current) return null;

  return (
    <section ref={wrapRef} className="shelf-wrap" aria-roledescription="carousel" aria-label="Project shelf" data-shelf-wrap>
      <p id={helpId} className="sr-only">
        Use the left and right arrow keys to browse tapes. Press Enter to open the selected project.
      </p>
      <div ref={shelfRef} id={shelfId} className="shelf" data-shelf>
        <div ref={stageRef} className="sstage">
          {pool.map((s) => {
            const p = items[s.item];
            if (!p) return null;
            return (
              <Tape
                key={s.slot}
                project={p}
                index={s.item}
                total={N}
                copy={s.copy}
                slot={s.slot}
                current={s.copy === 0 && s.item === activeIdx}
                eager={s.copy === 0 && (s.item === 0 || s.item === 1 || s.item === N - 1)}
                onClick={onTapeClick}
                describedBy={helpId}
              />
            );
          })}
        </div>
        <span ref={probeRef} className="shelf__probe" aria-hidden="true" />
      </div>
      <Caption project={current} controls={shelfId} onPrev={() => step(-1)} onNext={() => step(1)} />
      <Reel items={items} active={activeIdx} onJump={(i) => engineRef.current?.goTo(i)} />
      <p className="sr-only" aria-live="polite" aria-atomic="true" data-shelf-status>
        {status}
      </p>
    </section>
  );
}
