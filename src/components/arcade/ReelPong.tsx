import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Stamp } from '@/components/ui/Stamp';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/game/store';
import { prefersReducedMotion } from '@/lib/motion';
import { useGameInput } from './useGameInput';
import {
  BALL_R, CPU_FACE, FIELD_ACROSS, PADDLE_INSET, PADDLE_T, WIN_SCORE,
  createPong, fieldSize, paddleLength, project,
  type Difficulty, type Orientation, type Phase, type Pong,
} from './pong-engine';

interface View {
  phase: Phase;
  you: number;
  cpu: number;
  winner: 'player' | 'cpu' | null;
}
const INITIAL_VIEW: View = { phase: 'idle', you: 0, cpu: 0, winner: null };
const DIFFICULTIES: readonly Difficulty[] = ['easy', 'normal', 'hard'];
const LABEL = 'Reel Pong game field. First to 5 points wins. Move your paddle by dragging, or with the arrow keys or W and S. Press Space to start and P to pause.';

interface Theme { paper: string; cobalt: string; ink: string; font: string }
const readTheme = (): Theme => {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string, d: string) => cs.getPropertyValue(n).trim() || d;
  return { paper: v('--paper', '#ECE8E0'), cobalt: v('--cobalt', '#1F3FB0'), ink: v('--ink', '#141414'), font: v('--font-ui', 'sans-serif') };
};

const phaseLabel = (v: View): string => {
  if (v.phase === 'idle') return 'Start game';
  if (v.phase === 'paused') return 'Resume';
  if (v.phase === 'over') return 'Play again';
  return 'Pause';
};

/**
 * Reel Pong card (plan 8.1 to 8.6): DOM scoreboard, canvas, controls and rules. The canvas is created in an
 * effect only on the client; the surrounding text is prerendered. The engine runs on a fixed 120 Hz step and the
 * rAF loop only exists while a game is running, visible and in view.
 */
export default function ReelPong() {
  const uid = useId();
  const pong = useGame((s) => s.pong);
  const recordPong = useGame((s) => s.recordPong);
  const [view, setView] = useState<View>(INITIAL_VIEW);
  const [live, setLive] = useState('');
  const [result, setResult] = useState('');
  const [stampDate, setStampDate] = useState<string | null>(null);
  const [size, setSize] = useState<{ w: number; h: number; o: Orientation } | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Pong | null>(null);
  const orient = useRef<Orientation>('landscape');
  const themeRef = useRef<Theme | null>(null);
  const raf = useRef(0);
  const last = useRef(0);
  const shake = useRef(0);
  const viewRef = useRef<View>(INITIAL_VIEW);
  const blocked = useRef({ hidden: false, away: false });
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const pongRef = useRef(pong);
  pongRef.current = pong;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const eng = engine.current;
    const sz = sizeRef.current;
    if (!canvas || !eng || !sz) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const th = (themeRef.current ??= readTheme());
    const o = sz.o;
    const f = fieldSize(o);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const k = (sz.w / f.w) * dpr;
    const s = eng.s;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.fillStyle = th.paper;
    ctx.fillRect(0, 0, f.w, f.h);
    if (shake.current > 0) ctx.translate((Math.random() - 0.5) * shake.current * 6, (Math.random() - 0.5) * shake.current * 6);

    // Centre dashes
    ctx.fillStyle = th.cobalt;
    for (let i = 8; i < 300; i += 22) {
      const p = project(o, i, FIELD_ACROSS / 2);
      if (o === 'landscape') ctx.fillRect(p.x - 1, p.y, 2, 10); else ctx.fillRect(p.x, p.y - 1, 10, 2);
    }
    // Score digits as decoration (the DOM scoreboard is the real one)
    ctx.font = `600 40px ${th.font}`;
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.25;
    const c = f.w / 2;
    if (o === 'landscape') { ctx.fillText(String(s.playerScore), c - 60, 52); ctx.fillText(String(s.cpuScore), c + 60, 52); }
    else { ctx.fillText(String(s.cpuScore), 44, f.h / 2 - 16); ctx.fillText(String(s.playerScore), 44, f.h / 2 + 46); }
    ctx.globalAlpha = 1;

    // Paddles
    const len = paddleLength(eng.cfg);
    ctx.fillStyle = eng.cfg.accessible ? th.ink : th.cobalt;
    for (const [along, face] of [[s.playerAlong, PADDLE_INSET], [s.cpuAlong, CPU_FACE]] as const) {
      const p = project(o, along - len / 2, face);
      if (o === 'landscape') ctx.fillRect(p.x, p.y, PADDLE_T, len); else ctx.fillRect(p.x, p.y - PADDLE_T, len, PADDLE_T);
    }
    // Ball
    const b = project(o, s.along, s.across);
    ctx.fillStyle = th.ink;
    ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = th.paper;
    ctx.beginPath(); ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.strokeStyle = th.ink; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, f.w - 1, f.h - 1);

    // Banners, mirrored by the DOM buttons below
    const v = viewRef.current;
    const banner = v.phase === 'idle' ? ['Reel Pong', 'press start'] : v.phase === 'paused' ? ['Paused', 'press resume or P']
      : v.phase === 'over' ? [v.winner === 'player' ? 'You win' : 'CPU wins', 'play again?'] : null;
    if (banner) {
      ctx.fillStyle = 'rgb(20 20 20 / 0.55)';
      ctx.fillRect(0, 0, f.w, f.h);
      ctx.fillStyle = th.paper;
      ctx.textAlign = 'center';
      ctx.font = `600 24px ${th.font}`;
      ctx.fillText(banner[0] ?? '', f.w / 2, f.h / 2 - 4);
      ctx.font = `500 12px ${th.font}`;
      ctx.fillText(banner[1] ?? '', f.w / 2, f.h / 2 + 18);
    }
  }, []);

  /** Mirrors engine state into React only when something visible changed. */
  const sync = useCallback(() => {
    const eng = engine.current;
    if (!eng) return;
    const s = eng.s;
    const prev = viewRef.current;
    if (prev.phase !== s.phase || prev.you !== s.playerScore || prev.cpu !== s.cpuScore || prev.winner !== s.winner) {
      viewRef.current = { phase: s.phase, you: s.playerScore, cpu: s.cpuScore, winner: s.winner };
      setView(viewRef.current);
    }
  }, []);

  const handleEvents = useCallback(() => {
    const eng = engine.current;
    if (!eng) return;
    for (const ev of eng.drain()) {
      if (ev === 'point') {
        if (!prefersReducedMotion()) shake.current = 1;
        setLive(`You ${eng.s.playerScore}, CPU ${eng.s.cpuScore}`);
      } else if (ev === 'win') {
        const you = eng.s.playerScore, cpu = eng.s.cpuScore;
        const rec = pongRef.current;
        if (eng.s.winner === 'player') {
          const game = useGame.getState();
          const had = 'arcade:pong:win:1' in game.events;
          const gained = game.grantPongWin();
          game.recordPong({ wins: rec.wins + 1 });
          const stamped = !had && 'arcade:pong:win:1' in useGame.getState().events;
          if (stamped) setStampDate(useGame.getState().events['arcade:pong:win:1'] ?? new Date().toISOString());
          const msg = `You win, ${you} to ${cpu}.${gained > 0 ? ` +${gained} FR.` : ''}${stamped ? ' Arcade stamp earned.' : ''}`;
          setResult(msg);
          setLive(msg);
        } else {
          useGame.getState().recordPong({ losses: rec.losses + 1 });
          setResult('CPU wins. Play again?');
          setLive(`CPU wins, ${cpu} to ${you}. Play again?`);
        }
      }
    }
  }, []);

  /** Fresh visibility check (IntersectionObserver entries can lag behind a programmatic scroll). */
  const measureAway = (): boolean => {
    const c = canvasRef.current;
    if (!c) return false;
    const r = c.getBoundingClientRect();
    const ratio = r.height > 0 ? Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)) / r.height : 1;
    return ratio < 0.5;
  };

  const canRun = () => !blocked.current.hidden && !blocked.current.away;

  const tick = useCallback((t: number) => {
    raf.current = 0;
    const eng = engine.current;
    if (!eng) return;
    const dt = last.current ? (t - last.current) / 1000 : 0;
    last.current = t;
    eng.advance(dt);
    if (shake.current > 0) shake.current = Math.max(0, shake.current - dt / 0.18);
    handleEvents();
    sync();
    draw();
    const p = eng.s.phase;
    if ((p === 'serve' || p === 'play' || p === 'point' || shake.current > 0) && canRun()) raf.current = requestAnimationFrame(tick);
  }, [draw, handleEvents, sync]);

  const kick = useCallback(() => {
    sync();
    draw();
    const p = engine.current?.s.phase;
    if (!raf.current && (p === 'serve' || p === 'play' || p === 'point') && canRun()) {
      last.current = 0;
      raf.current = requestAnimationFrame(tick);
    }
  }, [draw, sync, tick]);

  const pauseIfRunning = useCallback(() => {
    engine.current?.pause();
    kick();
  }, [kick]);

  const activate = useCallback(() => {
    const eng = engine.current;
    if (!eng) return;
    if (eng.s.phase === 'idle' || eng.s.phase === 'over') {
      setStampDate(null);
      setResult('');
      setLive('');
    }
    // Bring the field into view first: a start below the 50 % visibility line would pause at once (plan 8.4).
    const c = canvasRef.current;
    if (c) {
      const r = c.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 56;
      if (r.top < top || r.bottom > window.innerHeight) {
        c.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
      }
      blocked.current.away = measureAway();
      c.focus({ preventScroll: true });
    }
    eng.start();
    kick();
  }, [kick]);

  const togglePause = useCallback(() => {
    const eng = engine.current;
    if (!eng) return;
    if (eng.s.phase === 'paused') eng.resume();
    else eng.pause();
    kick();
  }, [kick]);

  // Engine lives for the component's lifetime; config changes reconfigure it.
  useEffect(() => {
    engine.current = createPong({ difficulty: pong.difficulty, accessible: pong.accessible });
    themeRef.current = readTheme();
    // e2e build only (plan 11.2): lets specs set up a won game without playing 5 rallies.
    if (import.meta.env.VITE_TEST_HOOKS === 'true') (window as unknown as { __pong?: Pong }).__pong = engine.current;
    kick();
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      engine.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const eng = engine.current;
    if (!eng) return;
    if (eng.cfg.difficulty !== pong.difficulty || eng.cfg.accessible !== pong.accessible) {
      eng.configure({ difficulty: pong.difficulty, accessible: pong.accessible });
      setStampDate(null);
      setResult('');
      kick();
    }
  }, [pong.difficulty, pong.accessible, kick]);

  // Canvas size and orientation (plan 8.3).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const cw = stage.clientWidth;
      if (cw === 0) return;
      const topbar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 56;
      const availH = Math.max(260, window.innerHeight - topbar - 160);
      const o: Orientation = cw / availH >= 1.05 ? 'landscape' : 'portrait';
      const f = fieldSize(o);
      const scale = Math.min(cw / f.w, availH / f.h);
      const w = Math.floor(f.w * scale), h = Math.floor(f.h * scale);
      orient.current = o;
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      sizeRef.current = { w, h, o };
      setSize((p) => (p && p.w === w && p.h === h && p.o === o ? p : { w, h, o }));
      draw();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [draw]);

  // Pause rules (plan 8.4): hidden tab, window blur, scrolled away, any dialog open.
  useEffect(() => {
    const canvas = canvasRef.current;
    const onVis = () => {
      blocked.current.hidden = document.hidden;
      if (document.hidden) pauseIfRunning();
    };
    const onBlur = () => pauseIfRunning();
    const io = new IntersectionObserver(
      () => {
        blocked.current.away = measureAway();
        if (blocked.current.away) pauseIfRunning();
      },
      { threshold: [0, 0.5, 1] },
    );
    if (canvas) io.observe(canvas);
    const mo = new MutationObserver(() => {
      const ph = engine.current?.s.phase;
      if ((ph === 'serve' || ph === 'play' || ph === 'point') && document.querySelector('dialog[open]')) pauseIfRunning();
    });
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] });
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('blur', onBlur);
      io.disconnect();
      mo.disconnect();
    };
  }, [pauseIfRunning]);

  useGameInput(canvasRef, { engine, orientation: orient, onChange: draw, onActivate: activate, onTogglePause: togglePause });

  const onMainButton = () => {
    const p = viewRef.current.phase;
    if (p === 'idle' || p === 'over' || p === 'paused') activate();
    else togglePause();
  };

  const reduced = prefersReducedMotion();
  const scoreId = `${uid}-score`;
  const howId = `${uid}-how`;
  const o = size?.o ?? 'landscape';
  return (
    <section className="pong" aria-labelledby={`${uid}-title`}>
      <header className="pong__head">
        <h2 id={`${uid}-title`} className="pong__title">Reel Pong</h2>
        <p className="pong__sub">First to {WIN_SCORE}, the rally speeds up</p>
      </header>

      <p id={scoreId} className="pong__score" data-testid="pong-score">
        <span>You <b>{view.you}</b></span>
        <span aria-hidden="true"> · </span>
        <span>CPU <b>{view.cpu}</b></span>
      </p>
      <p className="sr-only" role="status" data-testid="pong-live">{live}</p>

      <div className="pong__stage" ref={stageRef} data-orientation={o}>
        <canvas
          ref={canvasRef}
          className="pong__canvas"
          role="img"
          aria-label={LABEL}
          aria-describedby={howId}
          tabIndex={0}
          data-phase={view.phase}
          data-orientation={o}
          style={size ? { width: size.w, height: size.h } : undefined}
        />
        {stampDate && (
          <div className="pong__stamp" aria-hidden="false">
            <Stamp level="arcade" state={reduced ? 'set' : 'landing'} date={stampDate} />
          </div>
        )}
      </div>

      <p className="pong__result" aria-hidden={result ? undefined : true}>{result}</p>

      <div className="pong__controls">
        <Button className="pong__main" onClick={onMainButton} data-testid="pong-main">
          {phaseLabel(view)}
        </Button>
        <fieldset className="pong__seg">
          <legend>Difficulty</legend>
          {DIFFICULTIES.map((d) => (
            <label key={d} className="pong__opt">
              <input type="radio" name={`${uid}-diff`} value={d} checked={pong.difficulty === d} onChange={() => recordPong({ difficulty: d })} disabled={pong.accessible} />
              <span>{d[0]?.toUpperCase()}{d.slice(1)}</span>
            </label>
          ))}
        </fieldset>
        <label className="pong__toggle">
          <input type="checkbox" checked={pong.accessible} onChange={(e) => recordPong({ accessible: e.target.checked })} />
          <span>Accessible mode</span>
        </label>
      </div>
      {pong.accessible && <p className="pong__note">Accessible mode: slower ball, no speed-up, larger paddle, easy CPU.</p>}

      <p id={howId} className="pong__how">
        <strong>How to play.</strong> First to 5 points wins. The rally speeds up with every hit. Move your paddle with the mouse, by dragging a finger, or with the arrow keys or W and S. Press P or Escape to pause.
      </p>
    </section>
  );
}
