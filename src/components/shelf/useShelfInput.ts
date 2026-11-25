import { useEffect, useRef, type RefObject } from 'react';
import type { ShelfEngine } from './spring';

export interface InputContext {
  engine: () => ShelfEngine | null;
  /** px of drag that equal one tape */
  pitch: () => number;
  /** cover size and the stage centre in client pixels, for the tilt */
  cover: () => { cx: number; cy: number; d: number; H: number } | null;
  /** called when selection moves by keyboard, so focus can follow */
  onKeyMove: (targetIndex: number) => void;
  /** reduced motion: no tilt */
  still: boolean;
}

const DRAG_START = 8;
const CLICK_SLOP = 6;
const FLICK_MS = 120;
const MAX_FLICK = 4;

/**
 * Pointer, wheel and keyboard input for the shelf (plan 6.5). Everything is arithmetic on the engine:
 * no layout reads except the tilt's single rect read per pointer move, and no React state.
 * Vertical touch always goes to the page (touch-action: pan-y plus the axis lock).
 */
export function useShelfInput(wrap: RefObject<HTMLElement | null>, shelf: RefObject<HTMLElement | null>, ctx: InputContext, N: number) {
  const c = useRef(ctx);
  c.current = ctx;

  useEffect(() => {
    const el = shelf.current;
    const root = wrap.current;
    if (!el || !root) return;

    let down: { id: number; x0: number; y0: number; lastX: number; lastT: number; v: number } | null = null;
    let dragging = false;
    let abandoned = false;
    let suppress = false;
    let wheelTimer = 0;

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
      suppress = false;
      dragging = false;
      abandoned = false;
      down = { id: e.pointerId, x0: e.clientX, y0: e.clientY, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
    };

    const onMove = (e: PointerEvent) => {
      const eng = c.current.engine();
      if (!eng) return;
      if (down && e.pointerId === down.id && !abandoned) {
        const dx = e.clientX - down.x0;
        const dy = e.clientY - down.y0;
        if (!dragging) {
          if (Math.abs(dx) > DRAG_START && Math.abs(dx) > Math.abs(dy)) {
            dragging = true;
            suppress = true;
            try {
              el.setPointerCapture(e.pointerId);
            } catch {
              /* capture can fail for synthetic pointers */
            }
            eng.startDrag();
            eng.setTilt(0, 0);
          } else if (Math.abs(dy) > DRAG_START) {
            abandoned = true; // the browser pans the page (pan-y) and sends pointercancel
          } else if (Math.hypot(dx, dy) > CLICK_SLOP) suppress = true;
        }
        if (dragging) {
          const step = e.clientX - down.lastX;
          const dt = Math.max(1, e.timeStamp - down.lastT);
          const a = 1 - Math.exp(-dt / 80);
          down.v += (step / dt - down.v) * a;
          down.lastX = e.clientX;
          down.lastT = e.timeStamp;
          eng.drag(eng.state.T - step / c.current.pitch());
          return;
        }
      }
      if (e.pointerType !== 'touch' && !c.current.still) {
        const box = c.current.cover();
        if (!box) return;
        const px = (e.clientX - (box.cx - box.d / 2)) / box.d;
        const py = (e.clientY - (box.cy - box.H / 2)) / box.H;
        if (px >= 0 && px <= 1 && py >= 0 && py <= 1) eng.setTilt(-(py - 0.5) * 10, (px - 0.5) * 14);
        else eng.setTilt(0, 0);
      }
    };

    const endDrag = (e: PointerEvent, cancelled: boolean) => {
      if (!down || e.pointerId !== down.id) return;
      const eng = c.current.engine();
      const v = down.v;
      const was = dragging;
      down = null;
      dragging = false;
      if (was && eng) {
        const T = eng.state.T;
        const lead = cancelled ? 0 : Math.max(-MAX_FLICK, Math.min(MAX_FLICK, (-v * FLICK_MS) / c.current.pitch()));
        eng.endDrag(Math.round(T + lead));
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* already released */
        }
      }
      // The click that follows a drag is cancelled by the capture listener below; clear the flag afterwards.
      window.setTimeout(() => {
        suppress = false;
      }, 0);
    };
    const onUp = (e: PointerEvent) => endDrag(e, false);
    const onCancel = (e: PointerEvent) => endDrag(e, true);
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' && !dragging) c.current.engine()?.setTilt(0, 0);
    };

    const onClickCapture = (e: MouseEvent) => {
      if (suppress) {
        e.preventDefault();
        e.stopPropagation();
        suppress = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch zoom
      const eng = c.current.engine();
      if (!eng) return;
      let dx = e.deltaX;
      if (e.shiftKey && e.deltaY !== 0 && dx === 0) dx = e.deltaY;
      else if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical wheel always scrolls the page
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientWidth : 1;
      e.preventDefault();
      eng.nudge((dx * unit) / c.current.pitch());
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        const e2 = c.current.engine();
        if (e2) e2.setTarget(Math.round(e2.state.T));
      }, 140);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const eng = c.current.engine();
      if (!eng) return;
      const T = Math.round(eng.state.T);
      let next: number | null = null;
      switch (e.key) {
        case 'ArrowLeft': next = T - 1; break;
        case 'ArrowRight': next = T + 1; break;
        case 'PageUp': next = T - 3; break;
        case 'PageDown': next = T + 3; break;
        case 'Home': next = Math.round(eng.state.s) + eng.shortestTo(0); break;
        case 'End': next = Math.round(eng.state.s) + eng.shortestTo(N - 1); break;
        case ' ': {
          const t = e.target as HTMLElement | null;
          if (t?.matches('a.tape')) {
            e.preventDefault();
            t.click();
          }
          return;
        }
        default: return;
      }
      e.preventDefault();
      eng.setTarget(next);
      c.current.onKeyMove(((next % N) + N) % N);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onCancel);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(wheelTimer);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onCancel);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('wheel', onWheel);
      root.removeEventListener('keydown', onKey);
    };
  }, [N, shelf, wrap]);
}
