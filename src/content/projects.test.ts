import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EARLIER_WORK, FEATURED, PROJECTS } from './projects';
import { SKILL_BRANCHES } from './skills';
import { EXPERIENCES } from './experience';
import { LEVELS } from './levels';

const slugs = new Set<string>(PROJECTS.map((p) => p.slug));

describe('project content', () => {
  it('has 17 unique projects and 5 earlier-work entries', () => {
    expect(PROJECTS).toHaveLength(17);
    expect(slugs.size).toBe(17);
    expect(EARLIER_WORK).toHaveLength(5);
  });

  it('has unique, contiguous shelf order and 8 to 12 featured', () => {
    const orders = FEATURED.map((p) => ('shelfOrder' in p ? p.shelfOrder : 0)).sort((a, b) => a - b);
    expect(new Set(orders).size).toBe(orders.length);
    expect(orders).toEqual(orders.map((_, i) => i + 1));
    expect(FEATURED.length).toBeGreaterThanOrEqual(8);
    expect(FEATURED.length).toBeLessThanOrEqual(12);
  });

  it('respects title lengths', () => {
    for (const p of PROJECTS) {
      expect(p.spineTitle.length, p.slug).toBeLessThanOrEqual(14);
      expect(p.cardTitle.length, p.slug).toBeLessThanOrEqual(28);
    }
  });

  it('keeps private and offline projects free of external URLs', () => {
    for (const p of PROJECTS) {
      if (p.link.kind === 'private' || p.link.kind === 'offline') {
        expect('url' in p.link, p.slug).toBe(false);
      }
    }
  });

  it('does not contain removed projects', () => {
    expect(slugs.has('skyai-3d-robot')).toBe(false);
    expect(JSON.stringify({ PROJECTS, EARLIER_WORK })).not.toMatch(/valerie|skyai/i);
  });

  it('resolves every skill and experience project reference', () => {
    for (const b of SKILL_BRANCHES) {
      for (const e of b.evidence) {
        if (!e.startsWith('experience:')) expect(slugs.has(e), e).toBe(true);
        else expect(EXPERIENCES.some((x) => x.id === e.slice('experience:'.length)), e).toBe(true);
      }
    }
    for (const x of EXPERIENCES) for (const s of x.relatedProjects ?? []) expect(slugs.has(s)).toBe(true);
  });

  it('has six levels with matching anchors', () => {
    expect(LEVELS.map((l) => l.anchor)).toEqual(LEVELS.map((l) => `level-${l.id}`));
    expect(LEVELS.map((l) => l.index)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('never contains a phone number in src/content', () => {
    const phone = /(\+\s?\d{1,3}[\s-]?\d{4,}|\b\d{5}[\s-]?\d{5}\b)/;
    const dir = __dirname;
    for (const f of readdirSync(dir)) {
      if (f === 'interview.ts' || f.endsWith('.test.ts')) continue;
      expect(readFileSync(join(dir, f), 'utf8'), f).not.toMatch(phone);
    }
  });
});
