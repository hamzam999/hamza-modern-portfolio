import { techIcon } from '@/content/tech';

/**
 * Technology icon tile (Round 4). Icons come from the generated sprite (Simple Icons / Devicon, see
 * scripts/build-icons.mjs), referenced with <use>, so no icon data is in the JS bundle. Decorative: the technology name
 * is always visible text next to it. Real technologies with no library icon get a neutral initial chip; concepts get nothing.
 */
export function TechIcon({ name, size = 24 }: { name: string; size?: 24 | 28 }) {
  const t = techIcon(name);
  if (t.kind === 'none') return null;
  const style = { '--size': `${size}px` } as React.CSSProperties;
  if (t.kind === 'chip') {
    return (
      <span className="tech tech--chip" aria-hidden="true" style={style}>
        {t.initial}
      </span>
    );
  }
  return (
    <span className="tech" data-i={t.id} aria-hidden="true" style={style}>
      <svg className="tech__svg" width={size} height={size} focusable="false">
        <use href={`/art/tech-sprite.svg#${t.id}`} />
      </svg>
    </span>
  );
}
