import { activeIndex, mod, shortest } from './geometry';

/** Snapshot passed to `onFrame`. The object is reused between frames; copy what you need. */
export interface ShelfFrame {
  /** current float position on the ring [0, N) */
  s: number;
  /** target position (may lie outside [0, N) while a wrap is in flight) */
  T: number;
  tilt: { x: number; y: number };
  dragging: boolean;
}

/** Injectable clock so the loop can be driven by a fake timer in tests. */
export interface Clock {
  now(): number;
  request(cb: (t: number) => void): number;
  cancel(id: number): void;
}

export interface EngineOptions {
  /** number of items on the ring */
  N: number;
  onFrame: (frame: Readonly<ShelfFrame>) => void;
  /** fires when the rounded active index changes */
  onActive?: (index: number) => void;
  /** fires when the loop goes to sleep */
  onSettle?: () => void;
  clock?: Clock;
  /** start position */
  initial?: number;
  /** no spring: the position jumps to the target (reduced motion, 6.9) */
  instant?: boolean;
}

export interface ShelfEngine {
  readonly state: Readonly<ShelfFrame>;
  readonly active: number;
  readonly running: boolean;
  setTarget(T: number): void;
  /** Moves to item `index` by the shortest path. */
  goTo(index: number): void;
  /** Adds a (possibly fractional) step to the target. */
  nudge(delta: number): void;
  /** Signed steps from the current rounded position to `index`, shortest way round. */
  shortestTo(index: number): number;
  startDrag(): void;
  drag(T: number): void;
  endDrag(T: number): void;
  setTilt(x: number, y: number): void;
  setInstant(instant: boolean): void;
  /** Off-screen or hidden tab: settle at once and stop the loop. Visible again: render and continue. */
  setVisible(visible: boolean): void;
  /** Forces one render with the current state. */
  render(): void;
  destroy(): void;
}

const browserClock: Clock = {
  now: () => performance.now(),
  request: (cb) => requestAnimationFrame(cb),
  cancel: (id) => cancelAnimationFrame(id),
};

const SPRING_FREE = 5.2;
const SPRING_DRAG = 18;
const SPRING_TILT = 8;
const EPS = 0.0005;
const TILT_EPS = 0.01;

/** Critically damped follow loop with wrap-around (plan 6.3). No React inside: it only calls `onFrame`. */
export function createShelfEngine(opts: EngineOptions): ShelfEngine {
  const { N, onFrame, onActive, onSettle } = opts;
  const clock = opts.clock ?? browserClock;
  const f: ShelfFrame = { s: mod(opts.initial ?? 0, N), T: mod(opts.initial ?? 0, N), tilt: { x: 0, y: 0 }, dragging: false };
  const tiltTarget = { x: 0, y: 0 };
  let instant = !!opts.instant;
  let visible = true;
  let raf = 0;
  let running = false;
  let last = 0;
  let lastActive = activeIndex(f.s, N);

  const wrap = () => {
    while (f.s >= N) {
      f.s -= N;
      f.T -= N;
    }
    while (f.s < 0) {
      f.s += N;
      f.T += N;
    }
  };

  const emit = () => {
    onFrame(f);
    const a = activeIndex(f.s, N);
    if (a !== lastActive) {
      lastActive = a;
      onActive?.(a);
    }
  };

  const tiltSettled = () => Math.abs(tiltTarget.x - f.tilt.x) < TILT_EPS && Math.abs(tiltTarget.y - f.tilt.y) < TILT_EPS;
  const settled = () => Math.abs(f.T - f.s) < EPS && tiltSettled() && !f.dragging;

  const stop = () => {
    if (running) clock.cancel(raf);
    running = false;
  };

  const tick = (now: number) => {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    const k = f.dragging ? SPRING_DRAG : SPRING_FREE;
    f.s += (f.T - f.s) * (1 - Math.exp(-k * dt));
    const kt = 1 - Math.exp(-SPRING_TILT * dt);
    f.tilt.x += (tiltTarget.x - f.tilt.x) * kt;
    f.tilt.y += (tiltTarget.y - f.tilt.y) * kt;
    if (settled()) {
      f.s = f.T;
      f.tilt.x = tiltTarget.x;
      f.tilt.y = tiltTarget.y;
      wrap();
      running = false;
      emit();
      onSettle?.();
      return;
    }
    wrap();
    emit();
    raf = clock.request(tick);
  };

  const wake = () => {
    if (!visible) {
      // Nobody can see the shelf: land on the target without running a loop.
      f.s = f.T;
      wrap();
      return;
    }
    if (instant) {
      f.s = f.T;
      f.tilt.x = f.tilt.y = 0;
      wrap();
      emit();
      onSettle?.();
      return;
    }
    if (running) return;
    if (settled()) {
      emit();
      return;
    }
    running = true;
    last = clock.now();
    raf = clock.request(tick);
  };

  const setT = (T: number) => {
    f.T = T;
    wake();
  };

  return {
    state: f,
    get active() {
      return activeIndex(f.s, N);
    },
    get running() {
      return running;
    },
    setTarget: setT,
    shortestTo: (index) => shortest(index - Math.round(f.s), N),
    goTo(index) {
      setT(Math.round(f.s) + shortest(index - Math.round(f.s), N));
    },
    nudge: (delta) => setT(f.T + delta),
    startDrag() {
      f.dragging = true;
      wake();
    },
    drag: (T) => setT(T),
    endDrag(T) {
      f.dragging = false;
      setT(T);
    },
    setTilt(x, y) {
      if (instant) return;
      tiltTarget.x = x;
      tiltTarget.y = y;
      wake();
    },
    setInstant(v) {
      instant = v;
      if (v) {
        f.s = f.T;
        tiltTarget.x = tiltTarget.y = 0;
        f.tilt.x = f.tilt.y = 0;
        stop();
        wrap();
        emit();
      }
    },
    setVisible(v) {
      if (v === visible) return;
      visible = v;
      if (!v) {
        stop();
        f.s = f.T;
        f.tilt.x = tiltTarget.x = f.tilt.y = tiltTarget.y = 0;
        f.dragging = false;
        wrap();
        emit();
      } else {
        emit();
        wake();
      }
    },
    render: emit,
    destroy: stop,
  };
}
