import { describe, expect, it } from 'vitest';
import icons from './tech-icons.json';
import { HERO_CONTENT } from './profile';
import { SKILL_BRANCHES } from './skills';
import { CONCEPTS, techIcon } from './tech';
import { TICKER_SKILLS } from '../components/art/Ticker';

const names = [
  ...SKILL_BRANCHES.flatMap((b) => b.nodes.map((n) => n.name)),
  ...HERO_CONTENT.focus,
  ...TICKER_SKILLS,
];

describe('technology icons', () => {
  it('every technology referenced in content has an icon, an explicit initial chip, or is a listed concept', () => {
    const missing = names.filter((n) => techIcon(n).kind === 'none' && !CONCEPTS.includes(n));
    expect(missing).toEqual([]);
  });

  it('concepts never resolve to a logo', () => {
    for (const c of CONCEPTS) expect(techIcon(c).kind, c).not.toBe('icon');
  });

  it('every icon id used exists in the generated sprite metadata, from Simple Icons or Devicon', () => {
    const ids = new Set(Object.keys(icons));
    for (const n of names) {
      const t = techIcon(n);
      if (t.kind === 'icon') expect(ids.has(t.id), `${n} -> ${t.id}`).toBe(true);
    }
    for (const m of Object.values(icons)) expect(['simple-icons', 'devicon']).toContain(m.source);
  });

  it('unknown real technologies get the initial chip, not a made-up logo', () => {
    for (const n of ['Antigravity', 'multi-agent workflows (Paperclip, Hermes)', 'GLSL']) expect(techIcon(n).kind, n).toBe('chip');
  });
});
