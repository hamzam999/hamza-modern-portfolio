import { describe, expect, it } from 'vitest';
import { makeGeometry, placeTape, poolSize, shortest, slotPosition, stageHeightFor, tapeHeight, uOfR, visibleRadius, wrapOffset, xOfU, scl, CHROME_H } from './geometry';

describe('tapeHeight (plan 6.2 expected values)', () => {
  const cases: Array<[number, number, number]> = [
    [360, 740, 276],
    [390, 844, 304],
    [768, 1024, 334],
    [1024, 768, 289],
    [1440, 900, 334],
  ];
  it.each(cases)('%i x %i gives about %i', (w, h, expected) => {
    expect(Math.abs(tapeHeight(w, h) - expected)).toBeLessThanOrEqual(2);
  });
  it('uses 160 as the minimum in phone landscape', () => {
    expect(tapeHeight(300, 360)).toBeGreaterThanOrEqual(160);
    expect(tapeHeight(300, 360)).toBeLessThan(200);
  });
  it('caps the stage height at 760', () => {
    expect(stageHeightFor(2000)).toBe(760);
    expect(stageHeightFor(700)).toBe(700 - CHROME_H);
  });
});

describe('X lookup table', () => {
  const g = makeGeometry(1440, 334);
  it('is monotonic', () => {
    for (let i = 1; i < g.table.length; i++) expect(g.table[i]).toBeGreaterThan(g.table[i - 1] ?? 0);
  });
  it('matches a fine numerical integral within 0.5 px', () => {
    for (const u of [10.5, 100, 333.3, 600, g.limit]) {
      let sum = 0;
      const step = 0.01;
      for (let q = 0; q < u; q += step) sum += step * scl(q + step / 2, g.U);
      expect(Math.abs(xOfU(g, u) - sum)).toBeLessThan(0.5);
    }
  });
  it('is odd', () => {
    expect(xOfU(g, -200)).toBeCloseTo(-xOfU(g, 200), 5);
  });
});

describe('placeTape', () => {
  const g = makeGeometry(1440, 334);
  it('puts the active tape face-on at the center', () => {
    const p = placeTape(g, 0);
    expect(p.hidden).toBe(false);
    expect(p.x).toBeCloseTo(0, 5);
    expect(p.ry).toBeCloseTo(-90, 5);
    expect(p.coverShade).toBe(0);
  });
  it('keeps k relationship: on-screen x equals X(u) after perspective', () => {
    for (const r of [-6, -2.5, 1.7, 4, 9]) {
      const p = placeTape(g, r);
      // o = 0 for |r| >= 1, so z is exactly P (1 - k) and projection scale is 1 / k.
      const screen = (p.x * g.P) / (g.P - p.z);
      expect(screen).toBeCloseTo(xOfU(g, p.u), 3);
    }
  });
  it('hides tapes beyond 1.95 U and shows the ones inside', () => {
    const R = visibleRadius(g);
    expect(placeTape(g, R).hidden).toBe(true);
    expect(placeTape(g, -R).hidden).toBe(true);
    expect(placeTape(g, R - 1).hidden).toBe(false);
    expect(Math.abs(uOfR(g, R))).toBeGreaterThan(g.limit);
  });
  it('three copies of ten cover the whole visible span on desktop and phone', () => {
    for (const [w, H] of [[1440, 334], [360, 276], [1920, 400], [360, 200]] as const) {
      expect(visibleRadius(makeGeometry(w, H))).toBeLessThanOrEqual(15);
    }
  });
});

describe('ring helpers', () => {
  it('wrapOffset folds into (-N/2, N/2]', () => {
    expect(wrapOffset(9, 0.2, 10)).toBeCloseTo(-1.2, 5);
    expect(wrapOffset(0, 9.5, 10)).toBeCloseTo(0.5, 5);
  });
  it('shortest picks the nearer direction', () => {
    expect(shortest(9, 10)).toBe(-1);
    expect(shortest(-9, 10)).toBe(1);
    expect(shortest(5, 10)).toBe(5);
    expect(shortest(3, 10)).toBe(3);
  });
});

describe('windowed slots (N > 12)', () => {
  const R = 15;
  const K = poolSize(14, R);
  it('caps the pool at 36 and uses 3N up to 12 items', () => {
    expect(K).toBe(31);
    expect(poolSize(10, R)).toBe(30);
    expect(poolSize(30, 40)).toBe(36);
  });
  it('maps each logical position in the window to a unique slot', () => {
    for (const base of [-3, 0, 7, 40]) {
      const ps = Array.from({ length: K }, (_, j) => slotPosition(j, base, R, K));
      expect(new Set(ps).size).toBe(K);
      expect(Math.min(...ps)).toBe(base - R);
      expect(Math.max(...ps)).toBe(base + R);
    }
  });
  it('moving the window by one reassigns exactly one slot', () => {
    for (const base of [0, 5, 13]) {
      let changed = 0;
      for (let j = 0; j < K; j++) if (slotPosition(j, base, R, K) !== slotPosition(j, base + 1, R, K)) changed++;
      expect(changed).toBe(1);
    }
  });
});
