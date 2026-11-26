import { useEffect, useRef, type RefObject } from 'react';
import { alongFromScreen, fieldSize, type Orientation, type Pong } from './pong-engine';

interface Options {
  engine: RefObject<Pong | null>;
  orientation: RefObject<Orientation>;
  /** Called after any input that changes engine state, so the caller can sync view and redraw. */
  onChange: () => void;
  /** Start, serve, resume or restart (Space, Enter, tap). */
  onActivate: () => void;
  onTogglePause: () => void;
}

const UP = new Set(['ArrowUp', 'w', 'W', 'ArrowLeft', 'a', 'A']);
const DOWN = new Set(['ArrowDown', 's', 'S', 'ArrowRight', 'd', 'D']);
const LANDSCAPE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S']);
const PORTRAIT_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D']);

/**
 * Pointer and keyboard input for the canvas (plan 8.4). Pointer sets the paddle directly; keys set a direction
 * the engine integrates at 360 px/s. Arrow keys call preventDefault only while the canvas is focused and a
 * game is running, so the page never gets stuck. Listeners live on the canvas element and clean up on unmount.
 */
export function useGameInput(canvasRef: RefObject<HTMLCanvasElement | null>, opts: Options): void {
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let activeTouch: number | null = null;
    const held = new Set<string>();

    const place = (e: PointerEvent) => {
      const { engine, orientation, onChange } = optsRef.current;
      const eng = engine.current;
      if (!eng) return;
      const r = canvas.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const f = fieldSize(orientation.current);
      eng.setPlayerAlong(alongFromScreen(orientation.current, ((e.clientX - r.left) / r.width) * f.w, ((e.clientY - r.top) / r.height) * f.h));
      onChange();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && e.pointerId !== activeTouch) return;
      place(e);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        if (activeTouch !== null) return; // ignore a second finger
        activeTouch = e.pointerId;
        canvas.setPointerCapture(e.pointerId);
      }
      place(e);
      const phase = optsRef.current.engine.current?.s.phase;
      if (phase === 'idle' || phase === 'over' || phase === 'paused') optsRef.current.onActivate();
    };
    const onPointerEnd = (e: PointerEvent) => {
      if (e.pointerId === activeTouch) activeTouch = null;
    };

    const axisFromHeld = (): -1 | 0 | 1 => {
      const portrait = optsRef.current.orientation.current === 'portrait';
      const set = portrait ? PORTRAIT_KEYS : LANDSCAPE_KEYS;
      let a = 0;
      for (const k of held) if (set.has(k)) a += UP.has(k) ? -1 : DOWN.has(k) ? 1 : 0;
      return a < 0 ? -1 : a > 0 ? 1 : 0;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const eng = optsRef.current.engine.current;
      if (!eng) return;
      const running = eng.s.phase === 'serve' || eng.s.phase === 'play' || eng.s.phase === 'point';
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!e.repeat) optsRef.current.onActivate();
        return;
      }
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (e.key === 'Escape' && !running) return;
        e.preventDefault();
        if (!e.repeat) optsRef.current.onTogglePause();
        return;
      }
      const set = optsRef.current.orientation.current === 'portrait' ? PORTRAIT_KEYS : LANDSCAPE_KEYS;
      if (!set.has(e.key)) return;
      if (running) e.preventDefault();
      held.add(e.key);
      eng.setAxis(axisFromHeld());
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!held.delete(e.key)) return;
      optsRef.current.engine.current?.setAxis(axisFromHeld());
    };
    const releaseKeys = () => {
      held.clear();
      optsRef.current.engine.current?.setAxis(0);
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerEnd);
    canvas.addEventListener('pointercancel', onPointerEnd);
    canvas.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('blur', releaseKeys);
    return () => {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerEnd);
      canvas.removeEventListener('pointercancel', onPointerEnd);
      canvas.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('blur', releaseKeys);
    };
  }, [canvasRef]);
}
