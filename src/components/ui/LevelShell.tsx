import type { ReactNode } from 'react';
import type { Level } from '@/types/content';
import { HalftoneUrdu } from './HalftoneUrdu';
import { MaskLine } from './MaskLine';

interface Props {
  level: Level;
  children?: ReactNode;
  urduPosition?: 'left' | 'right';
  /** Replaces the masked heading with plain markup (used for the hero H1 so the LCP element paints at once). */
  heading?: ReactNode;
  className?: string;
}

/**
 * One level of the landing page (plan 3.11): section with eyebrow, halftone Urdu word, one descriptive heading
 * (H1 for level 1, H2 otherwise), content, and an end sentinel for the level tracker. The heading takes focus
 * after a ruler jump.
 */
export function LevelShell({ level, children, urduPosition = 'right', heading, className }: Props) {
  const headingId = `${level.anchor}-heading`;
  const n = String(level.index).padStart(2, '0');
  return (
    <section id={level.anchor} aria-labelledby={headingId} data-level={level.index} className={`level level--urdu-${urduPosition}${className ? ` ${className}` : ''}`}>
      <HalftoneUrdu text={level.urdu} />
      <div className="level__inner">
        <p className="level__eyebrow">
          <MaskLine>{level.eyebrow.replace(`0${level.index}`, n)}</MaskLine>
        </p>
        {heading !== undefined ? (
          level.index === 1 ? (
            <h1 id={headingId} className="level__heading" tabIndex={-1} data-level-heading="">
              {heading}
            </h1>
          ) : (
            <h2 id={headingId} className="level__heading" tabIndex={-1} data-level-heading="">
              {heading}
            </h2>
          )
        ) : (
          <MaskLine as={level.index === 1 ? 'h1' : 'h2'} id={headingId} className="level__heading" tabIndex={-1} data-level-heading="">
            {level.heading}
          </MaskLine>
        )}
        {children}
      </div>
      <div data-level-end aria-hidden="true" className="level__end" />
    </section>
  );
}

interface PageProps {
  eyebrow: string;
  heading: string;
  urdu?: string;
  children?: ReactNode;
}

/** Page frame for routes outside the six levels (projects, arcade, 404). Same visual language, one H1. */
export function PageShell({ eyebrow, heading, urdu, children }: PageProps) {
  return (
    <main id="main" tabIndex={-1} className="level level--page level--urdu-right">
      {urdu && <HalftoneUrdu text={urdu} />}
      <div className="level__inner">
        <p className="level__eyebrow">
          <span>{eyebrow}</span>
        </p>
        <h1 className="level__heading" tabIndex={-1}>
          {heading}
        </h1>
        {children}
      </div>
    </main>
  );
}
