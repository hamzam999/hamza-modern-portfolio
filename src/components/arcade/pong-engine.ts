/**
 * Reel Pong engine (plan 8.2). Pure TypeScript, no DOM, no dependencies.
 * Coordinates: `along` runs along the paddle axis (0..FIELD_ALONG), `across` runs from the player's edge (0)
 * toward the CPU (FIELD_ACROSS). The renderer maps them to landscape (across = x) or portrait (along = x,
 * CPU at the top) with `project`.
 */

export type Difficulty = 'easy' | 'normal' | 'hard';
export type Phase = 'idle' | 'serve' | 'play' | 'point' | 'paused' | 'over';
export type Orientation = 'landscape' | 'portrait';
export type PongEvent = 'hit' | 'point' | 'win';

export const FIELD_ACROSS = 480;
export const FIELD_ALONG = 300;
export const BALL_R = 7;
export const PADDLE_T = 8;
export const PADDLE_LEN = 60;
export const PADDLE_LEN_ACCESSIBLE = 90;
export const PADDLE_INSET = 14;
export const WIN_SCORE = 5;
export const SERVE_SPEED = 240;
export const MAX_SPEED = 660;
export const KEY_SPEED = 360;
export const SERVE_DELAY = 0.7;
export const STEP = 1 / 120;
export const ACCESSIBLE_SPEED = 0.7;
export const SPIN = 4.2;

export const CPU_SPECS = {
  easy: { speed: 130, delay: 0.18, aim: 18, predict: false },
  normal: { speed: 174, delay: 0.09, aim: 0, predict: false },
  hard: { speed: 230, delay: 0, aim: 0, predict: true },
} as const satisfies Record<Difficulty, { speed: number; delay: number; aim: number; predict: boolean }>;

export interface PongConfig {
  difficulty: Difficulty;
  accessible: boolean;
}

export interface PongState {
  phase: Phase;
  /** Phase to return to after a pause. */
  resumeTo: Phase;
  playerScore: number;
  cpuScore: number;
  /** Ball position and velocity. */
  across: number;
  along: number;
  vAcross: number;
  vAlong: number;
  /** Paddle centres along the axis. */
  playerAlong: number;
  cpuAlong: number;
  /** -1, 0 or 1: keyboard direction for the player's paddle. */
  axis: -1 | 0 | 1;
  /** Who scored last, and who won. */
  lastScorer: 'player' | 'cpu' | null;
  winner: 'player' | 'cpu' | null;
  timer: number;
  /** Seconds until the CPU reacts to the current approach, and its aim error for it. */
  cpuWait: number;
  cpuAim: number;
  cpuApproaching: boolean;
}

export const paddleLength = (cfg: PongConfig): number => (cfg.accessible ? PADDLE_LEN_ACCESSIBLE : PADDLE_LEN);
/** Centre of a paddle face along `across`. */
export const PLAYER_FACE = PADDLE_INSET + PADDLE_T;
export const CPU_FACE = FIELD_ACROSS - PADDLE_INSET - PADDLE_T;

/** Engine to screen mapping. Field is 480 x 300 in landscape, 300 x 480 in portrait (CPU at the top). */
export function project(o: Orientation, along: number, across: number): { x: number; y: number } {
  return o === 'landscape' ? { x: across, y: along } : { x: along, y: FIELD_ACROSS - across };
}
/** Inverse for the paddle axis: screen field coordinates to `along`. */
export function alongFromScreen(o: Orientation, x: number, y: number): number {
  return o === 'landscape' ? y : x;
}
export const fieldSize = (o: Orientation): { w: number; h: number } =>
  o === 'landscape' ? { w: FIELD_ACROSS, h: FIELD_ALONG } : { w: FIELD_ALONG, h: FIELD_ACROSS };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export interface Pong {
  readonly s: PongState;
  readonly cfg: PongConfig;
  /** Applies a new config and returns to idle with scores cleared. */
  configure: (cfg: Partial<PongConfig>) => void;
  /** Starts a new game from idle or over, or resumes from pause. */
  start: () => void;
  pause: () => void;
  resume: () => void;
  setPlayerAlong: (v: number) => void;
  setAxis: (a: -1 | 0 | 1) => void;
  /** Advances by `dt` seconds of wall time using fixed 120 Hz steps. */
  advance: (dt: number) => void;
  /** Returns and clears events raised since the last call. */
  drain: () => PongEvent[];
}

export function createPong(initial: Partial<PongConfig> = {}, rng: () => number = Math.random): Pong {
  const cfg: PongConfig = { difficulty: initial.difficulty ?? 'normal', accessible: initial.accessible ?? false };
  const events: PongEvent[] = [];
  const s: PongState = {
    phase: 'idle', resumeTo: 'idle', playerScore: 0, cpuScore: 0,
    across: FIELD_ACROSS / 2, along: FIELD_ALONG / 2, vAcross: 0, vAlong: 0,
    playerAlong: FIELD_ALONG / 2, cpuAlong: FIELD_ALONG / 2, axis: 0,
    lastScorer: null, winner: null, timer: 0, cpuWait: 0, cpuAim: 0, cpuApproaching: false,
  };
  let acc = 0;
  /** Direction of the next serve: +1 toward the CPU. */
  let serveDir: 1 | -1 = 1;

  const cpuSpec = () => CPU_SPECS[cfg.accessible ? 'easy' : cfg.difficulty];
  const half = () => paddleLength(cfg) / 2;
  const speedScale = () => (cfg.accessible ? ACCESSIBLE_SPEED : 1);

  const centreBall = () => {
    s.across = FIELD_ACROSS / 2; s.along = FIELD_ALONG / 2; s.vAcross = 0; s.vAlong = 0;
  };
  const beginServe = () => {
    s.phase = 'serve'; s.timer = SERVE_DELAY; centreBall(); s.cpuApproaching = false;
  };
  const launch = () => {
    const speed = SERVE_SPEED * speedScale();
    const angle = (rng() * 2 - 1) * 0.4;
    s.vAcross = serveDir * speed * Math.cos(angle);
    s.vAlong = speed * Math.sin(angle);
    s.phase = 'play';
  };
  const reset = () => {
    s.playerScore = 0; s.cpuScore = 0; s.lastScorer = null; s.winner = null; s.axis = 0;
    s.playerAlong = FIELD_ALONG / 2; s.cpuAlong = FIELD_ALONG / 2;
    serveDir = 1; centreBall();
  };

  /** Ball `along` position when it reaches the CPU face, with wall bounces folded in. */
  const predict = (): number => {
    if (s.vAcross <= 0) return FIELD_ALONG / 2;
    const t = (CPU_FACE - BALL_R - s.across) / s.vAcross;
    const lo = BALL_R, span = FIELD_ALONG - 2 * BALL_R;
    const raw = s.along - lo + s.vAlong * t;
    const m = ((raw % (2 * span)) + 2 * span) % (2 * span);
    return lo + (m > span ? 2 * span - m : m);
  };

  const hitPaddle = (who: 'player' | 'cpu') => {
    const centre = who === 'player' ? s.playerAlong : s.cpuAlong;
    const mult = cfg.accessible ? 1 : who === 'player' ? 1.07 : 1.05;
    s.vAcross = (who === 'player' ? 1 : -1) * Math.abs(s.vAcross) * mult;
    s.vAlong += (s.along - centre) * SPIN;
    // Keep the ball moving across the field, then cap total speed.
    s.vAlong = clamp(s.vAlong, -1.1 * Math.abs(s.vAcross), 1.1 * Math.abs(s.vAcross));
    const cap = MAX_SPEED * speedScale();
    const sp = Math.hypot(s.vAcross, s.vAlong);
    if (sp > cap) { s.vAcross *= cap / sp; s.vAlong *= cap / sp; }
    s.across = who === 'player' ? PLAYER_FACE + BALL_R : CPU_FACE - BALL_R;
    events.push('hit');
  };

  const score = (who: 'player' | 'cpu') => {
    if (who === 'player') s.playerScore++; else s.cpuScore++;
    s.lastScorer = who;
    // Serve toward the player who just lost the point.
    serveDir = who === 'player' ? 1 : -1;
    centreBall();
    events.push('point');
    if (s.playerScore >= WIN_SCORE || s.cpuScore >= WIN_SCORE) {
      s.phase = 'over'; s.winner = who; events.push('win');
    } else { s.phase = 'point'; s.timer = SERVE_DELAY; }
  };

  const stepCpu = (dt: number) => {
    const spec = cpuSpec();
    const approaching = s.phase === 'play' && s.vAcross > 0;
    if (approaching && !s.cpuApproaching) { s.cpuWait = spec.delay; s.cpuAim = (rng() * 2 - 1) * spec.aim; }
    s.cpuApproaching = approaching;
    let target = FIELD_ALONG / 2;
    if (approaching) {
      s.cpuWait -= dt;
      target = s.cpuWait > 0 ? s.cpuAlong : (spec.predict ? predict() : s.along) + s.cpuAim;
    }
    const d = spec.speed * dt;
    s.cpuAlong = clamp(s.cpuAlong + clamp(target - s.cpuAlong, -d, d), half(), FIELD_ALONG - half());
  };

  const step = (dt: number) => {
    if (s.axis !== 0) s.playerAlong = clamp(s.playerAlong + s.axis * KEY_SPEED * dt, half(), FIELD_ALONG - half());
    if (s.phase === 'serve' || s.phase === 'point') {
      stepCpu(dt);
      s.timer -= dt;
      if (s.timer <= 0) { if (s.phase === 'point') beginServe(); else launch(); }
      return;
    }
    if (s.phase !== 'play') return;
    stepCpu(dt);
    s.across += s.vAcross * dt;
    s.along += s.vAlong * dt;
    if (s.along < BALL_R) { s.along = BALL_R; s.vAlong = Math.abs(s.vAlong); }
    else if (s.along > FIELD_ALONG - BALL_R) { s.along = FIELD_ALONG - BALL_R; s.vAlong = -Math.abs(s.vAlong); }
    const reach = half() + BALL_R * 0.6;
    if (s.vAcross < 0 && s.across - BALL_R <= PLAYER_FACE && s.across > PADDLE_INSET && Math.abs(s.along - s.playerAlong) <= reach) hitPaddle('player');
    else if (s.vAcross > 0 && s.across + BALL_R >= CPU_FACE && s.across < FIELD_ACROSS - PADDLE_INSET && Math.abs(s.along - s.cpuAlong) <= reach) hitPaddle('cpu');
    else if (s.across < -BALL_R) score('cpu');
    else if (s.across > FIELD_ACROSS + BALL_R) score('player');
  };

  return {
    s, cfg,
    configure: (c) => {
      if (c.difficulty) cfg.difficulty = c.difficulty;
      if (c.accessible !== undefined) cfg.accessible = c.accessible;
      reset(); s.phase = 'idle'; acc = 0;
    },
    start: () => {
      if (s.phase === 'paused') { s.phase = s.resumeTo; return; }
      if (s.phase !== 'idle' && s.phase !== 'over') return;
      reset(); beginServe(); acc = 0;
    },
    pause: () => {
      if (s.phase === 'serve' || s.phase === 'play' || s.phase === 'point') { s.resumeTo = s.phase; s.phase = 'paused'; s.axis = 0; }
    },
    resume: () => { if (s.phase === 'paused') s.phase = s.resumeTo; },
    setPlayerAlong: (v) => { s.playerAlong = clamp(v, half(), FIELD_ALONG - half()); },
    setAxis: (a) => { s.axis = a; },
    advance: (dt) => {
      acc += Math.min(Math.max(dt, 0), 0.1);
      while (acc >= STEP) { step(STEP); acc -= STEP; }
    },
    drain: () => events.splice(0, events.length),
  };
}
