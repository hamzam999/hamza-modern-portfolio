import { describe, expect, it } from 'vitest';
import {
  CPU_FACE, FIELD_ACROSS, FIELD_ALONG, MAX_SPEED, PLAYER_FACE, WIN_SCORE,
  alongFromScreen, createPong, fieldSize, project, type Pong,
} from './pong-engine';

const mid = () => 0.5; // angle 0
const run = (p: Pong, seconds: number) => { for (let i = 0; i < seconds * 10; i++) p.advance(0.1); };
const playing = (p: Pong) => { p.start(); run(p, 0.8); expect(p.s.phase).toBe('play'); p.s.cpuApproaching = false; p.s.cpuWait = 0; };

describe('serve and scoring', () => {
  it('first serve goes toward the CPU after 700 ms', () => {
    const p = createPong({}, mid);
    p.start();
    expect(p.s.phase).toBe('serve');
    run(p, 0.5);
    expect(p.s.phase).toBe('serve');
    run(p, 0.3);
    expect(p.s.phase).toBe('play');
    expect(p.s.vAcross).toBeCloseTo(240, 5);
    expect(p.s.vAlong).toBeCloseTo(0, 5);
  });
  it('serve angle stays within 0.4 rad', () => {
    for (const r of [0, 1]) {
      const p = createPong({}, () => r);
      playing(p);
      expect(Math.abs(Math.atan2(p.s.vAlong, p.s.vAcross))).toBeLessThanOrEqual(0.4001);
    }
  });
  it('CPU scores when the ball passes the player, then serves toward the player who lost', () => {
    const p = createPong({}, mid);
    playing(p);
    p.setPlayerAlong(20); // away from the centre ball
    p.s.across = 5; p.s.vAcross = -300; p.s.along = 150; p.s.vAlong = 0;
    run(p, 0.3);
    expect(p.s.cpuScore).toBe(1);
    expect(p.s.phase).toBe('point');
    expect(p.drain()).toContain('point');
    run(p, 1.5);
    expect(p.s.phase).toBe('play');
    expect(p.s.vAcross).toBeLessThan(0);
  });
  it('player scores, so the CPU lost and the next serve goes toward the CPU', () => {
    const p = createPong({}, mid);
    playing(p);
    p.s.across = FIELD_ACROSS - 5; p.s.vAcross = 300; p.s.cpuAlong = 20; p.s.along = 200; p.s.vAlong = 0;
    run(p, 0.3);
    expect(p.s.playerScore).toBe(1);
    run(p, 1.5);
    expect(p.s.vAcross).toBeGreaterThan(0);
  });
  it('first to 5 ends the game and raises win once', () => {
    const p = createPong({}, mid);
    p.start();
    const events: string[] = [];
    for (let i = 0; i < WIN_SCORE; i++) {
      run(p, 0.9);
      p.s.across = FIELD_ACROSS - 5; p.s.vAcross = 300; p.s.cpuAlong = 20; p.s.along = 200; p.s.vAlong = 0; p.s.phase = 'play';
      run(p, 0.3);
      events.push(...p.drain());
    }
    expect(p.s.playerScore).toBe(5);
    expect(p.s.phase).toBe('over');
    expect(p.s.winner).toBe('player');
    expect(events.filter((e) => e === 'win')).toHaveLength(1);
    run(p, 5);
    expect(p.s.playerScore).toBe(5);
  });
});

describe('paddle hits', () => {
  it('player hit speeds the ball by 1.07 and applies spin', () => {
    const p = createPong({}, mid);
    playing(p);
    p.setPlayerAlong(150);
    p.s.across = PLAYER_FACE + 8; p.s.vAcross = -200; p.s.along = 160; p.s.vAlong = 0;
    run(p, 0.1);
    expect(p.s.vAcross).toBeCloseTo(214, 0);
    expect(p.s.vAlong).toBeGreaterThan(0); // (160-150)*4.2 = 42
    expect(p.drain()).toContain('hit');
  });
  it('CPU hit multiplies by 1.05', () => {
    const p = createPong({}, mid);
    playing(p);
    p.s.cpuAlong = 150; p.s.across = CPU_FACE - 8; p.s.vAcross = 200; p.s.along = 150; p.s.vAlong = 0;
    p.advance(0.05);
    expect(p.s.vAcross).toBeCloseTo(-210, 0);
  });
  it('never exceeds 660 px/s', () => {
    const p = createPong({}, mid);
    playing(p);
    for (let i = 0; i < 30; i++) {
      p.setPlayerAlong(p.s.along);
      p.s.across = PLAYER_FACE + 8; p.s.vAcross = -MAX_SPEED + 10; p.s.vAlong = 300;
      p.advance(0.02);
      expect(Math.hypot(p.s.vAcross, p.s.vAlong)).toBeLessThanOrEqual(MAX_SPEED + 0.001);
    }
  });
  it('walls reflect the along velocity', () => {
    const p = createPong({}, mid);
    playing(p);
    p.s.along = 9; p.s.vAlong = -200; p.s.across = 240; p.s.vAcross = 50;
    p.advance(0.05);
    expect(p.s.vAlong).toBeGreaterThan(0);
  });
});

describe('CPU difficulty', () => {
  const chase = (d: 'easy' | 'normal' | 'hard') => {
    const p = createPong({ difficulty: d }, mid);
    playing(p);
    p.s.cpuAlong = 40; p.s.across = 200; p.s.vAcross = 100; p.s.along = 260; p.s.vAlong = 0;
    p.advance(0.5);
    return p.s.cpuAlong;
  };
  it('faster difficulties cover more ground', () => {
    const [e, n, h] = [chase('easy'), chase('normal'), chase('hard')];
    expect(e).toBeLessThan(n);
    expect(n).toBeLessThan(h);
    expect(h - 40).toBeLessThanOrEqual(230 * 0.5 + 1);
  });
  it('easy waits 180 ms before reacting', () => {
    const p = createPong({ difficulty: 'easy' }, mid);
    playing(p);
    p.s.cpuAlong = 40; p.s.across = 200; p.s.vAcross = 100; p.s.along = 260; p.s.vAlong = 0;
    p.advance(0.1);
    expect(p.s.cpuAlong).toBeCloseTo(40, 3);
  });
  it('hard predicts the wall bounce', () => {
    const p = createPong({ difficulty: 'hard' }, mid);
    playing(p);
    p.s.cpuAlong = 150; p.s.across = 240; p.s.vAcross = 300; p.s.along = 250; p.s.vAlong = 300;
    p.advance(0.1);
    // Naive tracking would chase the ball at 250; the bounce lands near 126.
    expect(p.s.cpuAlong).toBeLessThan(150);
  });
  it('returns to centre when the ball moves away', () => {
    const p = createPong({}, mid);
    playing(p);
    p.s.cpuAlong = 40; p.s.across = 200; p.s.vAcross = -100;
    p.advance(0.2);
    expect(p.s.cpuAlong).toBeGreaterThan(40);
  });
});

describe('accessible mode', () => {
  it('slows the serve, removes speed-up, enlarges the paddle and fixes the CPU at easy', () => {
    const p = createPong({ accessible: true, difficulty: 'hard' }, mid);
    playing(p);
    expect(p.s.vAcross).toBeCloseTo(240 * 0.7, 5);
    p.setPlayerAlong(150);
    p.s.across = PLAYER_FACE + 8; p.s.vAcross = -168; p.s.along = 150 + 40; p.s.vAlong = 0; // 40 off centre: hit only with 90 paddle
    p.advance(0.05);
    expect(p.s.vAcross).toBeCloseTo(168, 0);
    p.s.cpuAlong = 40; p.s.across = 200; p.s.vAcross = 100; p.s.along = 260; p.s.vAlong = 0;
    p.advance(0.5);
    expect(p.s.cpuAlong).toBeLessThanOrEqual(40 + 130 * 0.32 + 1);
  });
});

describe('pause, input and mapping', () => {
  it('pause freezes the ball and resume continues', () => {
    const p = createPong({}, mid);
    playing(p);
    p.pause();
    const a = p.s.across;
    run(p, 1);
    expect(p.s.across).toBe(a);
    p.start();
    expect(p.s.phase).toBe('play');
  });
  it('keyboard axis moves the paddle at 360 px/s and clamps', () => {
    const p = createPong({}, mid);
    p.start();
    p.setAxis(1);
    p.advance(0.1);
    expect(p.s.playerAlong).toBeCloseTo(150 + 36, 0);
    run(p, 3);
    expect(p.s.playerAlong).toBeCloseTo(FIELD_ALONG - 30, 5);
  });
  it('orientation mapping puts the CPU at the top in portrait', () => {
    expect(project('landscape', 100, 20)).toEqual({ x: 20, y: 100 });
    expect(project('portrait', 100, 20)).toEqual({ x: 100, y: FIELD_ACROSS - 20 });
    expect(project('portrait', 0, FIELD_ACROSS).y).toBe(0);
    expect(fieldSize('portrait')).toEqual({ w: 300, h: 480 });
    expect(alongFromScreen('landscape', 7, 9)).toBe(9);
    expect(alongFromScreen('portrait', 7, 9)).toBe(7);
  });
  it('configure resets to idle', () => {
    const p = createPong({}, mid);
    playing(p);
    p.configure({ difficulty: 'hard' });
    expect(p.s.phase).toBe('idle');
    expect(p.cfg.difficulty).toBe('hard');
  });
});
