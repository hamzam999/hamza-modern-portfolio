import { describe, expect, it } from 'vitest';
import { clearedLevels, computeXP, isRunComplete, MAX_XP, parseEvent, pongWinId } from './rules';

const T = '2026-11-25T10:00:00Z';
const log = (...ids: string[]) => Object.fromEntries(ids.map((i) => [i, T]));

describe('computeXP', () => {
  it('scores each event type', () => {
    expect(computeXP(log('level:1:enter'))).toBe(40);
    expect(computeXP(log('level:1:clear'))).toBe(60);
    expect(computeXP(log('project:navig:open'))).toBe(20);
    expect(computeXP(log('boss:contact'))).toBe(100);
    expect(computeXP(log('arcade:pong:win:1'))).toBe(120);
  });
  it('pays 120 for the first pong win and 30 for later wins, capped at 300', () => {
    expect(computeXP(log('arcade:pong:win:1', 'arcade:pong:win:2'))).toBe(150);
    const many = log(...Array.from({ length: 12 }, (_, i) => pongWinId(i + 1)));
    expect(computeXP(many)).toBe(300);
  });
  it('counts at most 10 projects', () => {
    const slugs = Array.from({ length: 14 }, (_, i) => `project:p${i}:open`);
    expect(computeXP(log(...slugs))).toBe(200);
  });
  it('ignores unknown and malformed ids', () => {
    expect(computeXP(log('level:7:enter', 'level:0:clear', 'nope', 'project:Bad Slug:open', 'arcade:pong:win:0'))).toBe(0);
  });
  it('never exceeds the 1200 cap', () => {
    const all = [
      ...[1, 2, 3, 4, 5, 6].flatMap((n) => [`level:${n}:enter`, `level:${n}:clear`]),
      ...Array.from({ length: 30 }, (_, i) => `project:p${i}:open`),
      ...Array.from({ length: 30 }, (_, i) => pongWinId(i + 1)),
      'boss:contact',
    ];
    expect(MAX_XP).toBe(1200);
    expect(computeXP(log(...all))).toBe(1200);
  });
  it('is independent of insertion order', () => {
    const a = log('level:2:enter', 'boss:contact');
    const b = log('boss:contact', 'level:2:enter');
    expect(computeXP(a)).toBe(computeXP(b));
  });
});

describe('levels', () => {
  it('parses ids', () => {
    expect(parseEvent('level:4:clear')).toEqual({ kind: 'clear', level: 4 });
    expect(parseEvent('x')).toBeNull();
  });
  it('reports cleared levels and run completion', () => {
    expect(clearedLevels(log('level:2:clear', 'level:5:clear'))).toEqual([2, 5]);
    expect(isRunComplete(log(...[1, 2, 3, 4, 5, 6].map((n) => `level:${n}:clear`)))).toBe(true);
  });
});
