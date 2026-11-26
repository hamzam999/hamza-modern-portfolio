import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/game/store';
import { prefersReducedMotion } from '@/lib/motion';

const FINE = '(pointer: fine) and (hover: hover)';
const INTERACTIVE = 'a[href], button, [role="button"], summary, label[for], [data-cursor]';
const NATIVE = 'input, textarea, select, [contenteditable], dialog';
const LERP = 0.18;
const IDLE_MS = 500;

/**
 * Custom cursor (plan 3.11): an 8 px dot that follows exactly and a 36 px ring that lerps, both drawn with
 * transform only. Mounted only for fine hover pointers and when the visitor has not chosen "Classic cursor".
 * Native cursor returns over form fields and dialogs. The rAF loop sleeps after 500 ms without movement.
 * Reduced motion: the ring follows without lag (3.5). Labels come from `data-cursor` on any ancestor.
 */
export function Cursor() {
  const choice = useGame((s) => s.settings.cursor);
  const [enabled, setEnabled] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(FINE);
    const update = () => setEnabled(mq.matches && choice === 'custom');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [choice]);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    let tx = -100, ty = -100, rx = -100, ry = -100;
    let raf = 0;
    let idle = 0;
    let seen = false;

    const draw = () => {
      raf = 0;
      const reduced = prefersReducedMotion();
      rx = reduced ? tx : rx + (tx - rx) * LERP;
      ry = reduced ? ty : ry + (ty - ry) * LERP;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (label.current?.parentElement) label.current.parentElement.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        rx = tx;
        ry = ty;
        root.current?.setAttribute('data-visible', 'true');
      }
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      const el = e.target instanceof Element ? e.target : null;
      const native = !!el?.closest(NATIVE);
      const hot = !native && !!el?.closest(INTERACTIVE);
      root.current?.setAttribute('data-visible', native ? 'false' : 'true');
      root.current?.setAttribute('data-hover', hot ? 'true' : 'false');
      if (label.current) label.current.textContent = el?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '';
      if (!raf) raf = requestAnimationFrame(draw);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        raf = 0;
      }, IDLE_MS);
    };
    const onLeave = () => root.current?.setAttribute('data-visible', 'false');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      html.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={root} className="cursor" aria-hidden="true" data-visible="false" data-hover="false">
      <div ref={dot} className="cursor__dot" />
      <div ref={ring} className="cursor__ring">
        <span className="cursor__ring-scale" />
      </div>
      <div className="cursor__tag">
        <span ref={label} className="cursor__label" />
      </div>
    </div>
  );
}
