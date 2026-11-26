/**
 * Shelf geometry (plan 6.2). Pure functions only: no DOM, no React.
 * The CSS in shelf.css mirrors `tapeHeight` with clamp() so the reserved box matches the measured stage.
 */

/** Top bar plus ruler, subtracted from the viewport height to get the stage height (plan 6.2 expected-value table). */
export const CHROME_H = 113;
export const PERSPECTIVE = 1400;
export const MAX_POOL = 36;
/** Tapes beyond this many arc lengths (times U) are hidden. */
export const VISIBLE_U = 1.95;

const clamp = (min: number, v: number, max: number) => Math.max(min, Math.min(max, v));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Stage height budget: viewport minus chrome, capped at 760. */
export function stageHeightFor(innerHeight: number): number {
  return Math.min(innerHeight - CHROME_H, 760);
}

/** Tape height H in px (plan 6.2). `stageH` defaults to the viewport-derived budget. */
export function tapeHeight(w: number, innerHeight: number, stageH: number = stageHeightFor(innerHeight)): number {
  const min = innerHeight < 500 ? 160 : 200;
  return clamp(min, Math.min(0.78 * w, 0.44 * stageH), 400);
}

export interface Geometry {
  w: number;
  H: number;
  /** spine width */
  ws: number;
  /** cover width (tape depth) */
  d: number;
  gap: number;
  /** arc-length scale: 1.05 H below 768 px stage width, 1.3 H above */
  U: number;
  P: number;
  /** drag distance in px that equals one tape */
  pitch: number;
  /** hidden beyond this |u| */
  limit: number;
  /** X(u) lookup table, one entry per integer u */
  table: Float32Array;
}

export const scl = (u: number, U: number) => 1 / (1 + (Math.abs(u) / U) ** 1.6);

/** Trapezoid-rule table of X(u) = integral of scl over [0, u] for integer u (plan 6.2 lookup table). */
export function buildTable(U: number): Float32Array {
  const n = Math.ceil(2 * U) + 2;
  const t = new Float32Array(n);
  for (let i = 1; i < n; i++) t[i] = (t[i - 1] ?? 0) + (scl(i - 1, U) + scl(i, U)) / 2;
  return t;
}

export function makeGeometry(w: number, H: number): Geometry {
  const ws = (H * 142) / 840;
  const d = (H * 474) / 900;
  const gap = H * 0.035;
  const U = (w < 768 ? 1.05 : 1.3) * H;
  return { w, H, ws, d, gap, U, P: PERSPECTIVE, pitch: d + gap, limit: VISIBLE_U * U, table: buildTable(U) };
}

/** Signed X(u) by linear interpolation in the table. */
export function xOfU(g: Geometry, u: number): number {
  const a = Math.abs(u);
  const i = Math.min(g.table.length - 2, Math.floor(a));
  const f = a - i;
  const v = (g.table[i] ?? 0) * (1 - f) + (g.table[i + 1] ?? 0) * f;
  return u < 0 ? -v : v;
}

/** Arc-length position of a tape at signed offset r from the current position. */
export function uOfR(g: Geometry, r: number): number {
  const a = Math.abs(r);
  const B = a < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : Math.sign(r) * 0.5;
  return r * (g.ws + g.gap) + (g.d - g.ws + 1.4 * g.gap) * B;
}

export interface Placement {
  hidden: boolean;
  u: number;
  x: number;
  y: number;
  z: number;
  /** rotateY in degrees, tilt included */
  ry: number;
  rx: number;
  zIndex: number;
  spineShade: number;
  coverShade: number;
}

export function placeTape(g: Geometry, r: number, tiltX = 0, tiltY = 0): Placement {
  const u = uOfR(g, r);
  const o = smooth(Math.max(0, 1 - Math.abs(r)));
  if (Math.abs(u) > g.limit) {
    return { hidden: true, u, x: 0, y: 0, z: 0, ry: 0, rx: 0, zIndex: 0, spineShade: 0, coverShade: 0 };
  }
  const sc = scl(u, g.U);
  const k = 1 / sc;
  const x = xOfU(g, u) * k;
  const y = (g.H * 0.5 * (1 - sc) * 0.42 + o * g.H * 0.012) * k;
  const z = g.P * (1 - k) + o * g.H * 0.1;
  const ry = Math.sign(u) * Math.min(1, Math.abs(u) / g.U) * 26 * (1 - o) - 90 * o + tiltY * o;
  return {
    hidden: false,
    u,
    x,
    y,
    z,
    ry,
    rx: tiltX * o,
    zIndex: Math.round(3000 + z),
    spineShade: Math.min(0.6, o * 0.55 + (1 - sc) * 0.32),
    coverShade: (1 - o) * 0.82,
  };
}

/** Root of one tape: translation only. A rotated parent would be edge-on at rest (ry = -90) and the browser cannot hit-test through it. */
export function transformOf(p: Placement): string {
  return `translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,${p.z.toFixed(2)}px)`;
}

/** Per-face transforms: the tape's rotation is applied on the faces, so the visible cover stays clickable. */
export function faceTransforms(g: Geometry, p: Placement): { spine: string; cover: string } {
  const rot = `rotateY(${p.ry.toFixed(3)}deg) rotateX(${p.rx.toFixed(3)}deg)`;
  return {
    spine: `${rot} translateZ(${(g.d / 2).toFixed(2)}px)`,
    cover: `${rot} rotateY(90deg) translateZ(${(g.ws / 2).toFixed(2)}px)`,
  };
}

/** Offset of item i from position s on the ring of N, folded into (-N/2, N/2]. */
export function wrapOffset(i: number, s: number, N: number): number {
  let r = mod(i - s, N);
  if (r > N / 2) r -= N;
  return r;
}

/** Shortest signed step on a ring of N, in (-N/2, N/2]. */
export function shortest(diff: number, N: number): number {
  let r = mod(diff, N);
  if (r > N / 2) r -= N;
  return r;
}

/** Active (centered) item index for a float position. */
export const activeIndex = (s: number, N: number) => mod(Math.round(s), N);

/** Smallest integer R such that every tape with |r| >= R is hidden. */
export function visibleRadius(g: Geometry): number {
  let r = 1;
  while (Math.abs(uOfR(g, r)) <= g.limit && r < 200) r++;
  return r;
}

/** Number of tape elements the pool needs (plan 6.4): three copies up to 12 items, windowed beyond. */
export function poolSize(N: number, R: number): number {
  return N <= 12 ? 3 * N : Math.min(MAX_POOL, 2 * R + 1);
}

/**
 * Windowed rendering (plan 6.4). Slot j holds logical position p where p = base - R + mod(j - (base - R), K), so that
 * moving `base` by one reassigns exactly one slot (the one leaving the far edge).
 */
export function slotPosition(slot: number, base: number, R: number, K: number): number {
  const lo = base - R;
  return lo + mod(slot - lo, K);
}
