import { describe, expect, it, vi } from 'vitest';
import { createShelfEngine, type Clock } from './spring';

/** Manual clock: `advance` runs queued frames at 16 ms steps. */
function fakeClock() {
  let t = 0;
  let id = 0;
  const q = new Map<number, (t: number) => void>();
  const clock: Clock = {
    now: () => t,
    request: (cb) => {
      q.set(++id, cb);
      return id;
    },
    cancel: (i) => void q.delete(i),
  };
  return {
    clock,
    pending: () => q.size,
    advance(ms: number) {
      const end = t + ms;
      while (t < end) {
        t += 16;
        const cbs = [...q.entries()];
        q.clear();
        for (const [, cb] of cbs) cb(t);
      }
    },
  };
}

function make(opts: { N?: number; initial?: number; instant?: boolean } = {}) {
  const fc = fakeClock();
  const frames: number[] = [];
  const onActive = vi.fn();
  const onSettle = vi.fn();
  const e = createShelfEngine({ N: 10, ...opts, clock: fc.clock, onFrame: (f) => frames.push(f.s), onActive, onSettle });
  return { fc, e, frames, onActive, onSettle };
}

describe('shelf engine', () => {
  it('eases to the target and sleeps with no queued frame', () => {
    const { fc, e, onSettle } = make();
    e.setTarget(3);
    expect(e.running).toBe(true);
    fc.advance(3000);
    expect(e.state.s).toBe(3);
    expect(e.running).toBe(false);
    expect(fc.pending()).toBe(0);
    expect(onSettle).toHaveBeenCalledTimes(1);
  });

  it('never overshoots (critically damped)', () => {
    const { fc, e, frames } = make();
    e.setTarget(4);
    fc.advance(3000);
    expect(Math.max(...frames)).toBeLessThanOrEqual(4);
  });

  it('wraps past N in both directions and keeps s inside [0, N)', () => {
    const { fc, e } = make();
    e.goTo(9); // shortest path from 0 is backwards
    expect(e.state.T).toBe(-1);
    fc.advance(3000);
    expect(e.state.s).toBe(9);
    expect(e.state.T).toBe(9);
    e.setTarget(11);
    fc.advance(3000);
    expect(e.state.s).toBe(1);
    expect(e.active).toBe(1);
  });

  it('shortestTo and goTo take the nearer way round', () => {
    const { e } = make({ initial: 1 });
    expect(e.shortestTo(9)).toBe(-2);
    expect(e.shortestTo(5)).toBe(4);
    e.goTo(8);
    expect(e.state.T).toBe(-2);
  });

  it('reports active index changes once per tape crossed', () => {
    const { fc, e, onActive } = make();
    e.setTarget(3);
    fc.advance(3000);
    expect(onActive.mock.calls.map((c) => c[0])).toEqual([1, 2, 3]);
  });

  it('follows the finger faster while dragging and stays awake until released', () => {
    const slow = make();
    slow.e.setTarget(2);
    slow.fc.advance(160);
    const free = slow.e.state.s;
    const fast = make();
    fast.e.startDrag();
    fast.e.drag(2);
    fast.fc.advance(160);
    expect(fast.e.state.s).toBeGreaterThan(free);
    fast.fc.advance(2000);
    expect(fast.e.running).toBe(true); // dragging keeps the loop alive
    fast.e.endDrag(2);
    fast.fc.advance(500);
    expect(fast.e.running).toBe(false);
  });

  it('nudge adds to the target and interruption retargets from the current position', () => {
    const { fc, e } = make();
    e.nudge(5);
    fc.advance(200);
    const mid = e.state.s;
    expect(mid).toBeGreaterThan(0);
    e.nudge(-5);
    fc.advance(3000);
    expect(e.state.s).toBe(0);
    expect(mid).toBeLessThan(5);
  });

  it('instant mode jumps without scheduling frames', () => {
    const { fc, e } = make({ instant: true });
    e.setTarget(4);
    expect(e.state.s).toBe(4);
    expect(fc.pending()).toBe(0);
    e.setTilt(5, 5);
    expect(e.state.tilt.x).toBe(0);
  });

  it('settles at once when hidden and runs no loop until visible again', () => {
    const { fc, e } = make();
    e.setTarget(6);
    fc.advance(48);
    e.setVisible(false);
    expect(e.state.s).toBe(6);
    expect(e.running).toBe(false);
    e.setTarget(2);
    expect(fc.pending()).toBe(0);
    expect(e.state.s).toBe(2);
    e.setVisible(true);
    expect(e.running).toBe(false);
  });

  it('tilt eases in and back to zero, then sleeps', () => {
    const { fc, e } = make();
    e.setTilt(6, -8);
    fc.advance(600);
    expect(e.state.tilt.x).toBeCloseTo(6, 1);
    e.setTilt(0, 0);
    fc.advance(1500);
    expect(e.state.tilt.x).toBe(0);
    expect(e.running).toBe(false);
  });
});
