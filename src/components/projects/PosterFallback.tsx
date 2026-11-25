import type { Project } from '@/types/content';

interface Props {
  project: Pick<Project, 'cardTitle' | 'spine'>;
  /** Large variant (project page) sets the title bigger. */
  size?: 'card' | 'hero';
}

/** Swatch colours for the typographic poster (plan 6.11). Accent is decorative, so low contrast is allowed. */
const SWATCH = {
  cobalt: { bg: 'var(--cobalt)', accent: 'var(--vermilion)', ink: 'var(--sheet)' },
  ink: { bg: 'var(--ink)', accent: 'var(--paper)', ink: 'var(--paper)' },
  graphite: { bg: 'var(--graphite)', accent: 'var(--sheet)', ink: 'var(--sheet)' },
  paper: { bg: 'var(--sheet)', accent: 'var(--cobalt)', ink: 'var(--ink)' },
} as const;

/** Typographic poster used whenever a screenshot is missing. Decorative: the surrounding link carries the name. */
export function PosterFallback({ project, size = 'card' }: Props) {
  const c = SWATCH[project.spine];
  return (
    <span
      className={`poster poster--${size}`}
      aria-hidden="true"
      style={
        {
          '--poster-bg': c.bg,
          '--poster-accent': c.accent,
          '--poster-ink': c.ink,
        } as React.CSSProperties
      }
    >
      <span className="poster__title">{project.cardTitle}</span>
    </span>
  );
}
