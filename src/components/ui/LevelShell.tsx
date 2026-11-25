import type { ReactNode } from 'react';
import type { Level } from '@/types/content';
import { JP } from '@/content/jp';
import { HalftoneKanji } from './HalftoneKanji';
import { MaskLine } from './MaskLine';

interface Props {
  level: Level;
  children?: ReactNode;
  kanjiPosition?: 'left' | 'right';
  /** Replaces the masked heading with plain markup (used for the hero H1 so the LCP element paints at once). */
  heading?: ReactNode;
  className?: string;
}

/**
 * One level of the landing page (plan 3.11): section with eyebrow, halftone kanji, one descriptive heading
 * (H1 for level 1, H2 otherwise), content, and an end sentinel for the level tracker. The heading takes focus
 * after a ruler jump.
 */
export function LevelShell({ level, children, kanjiPosition = 'right', heading, className }: Props) {
  const headingId = `${level.anchor}-heading`;
  const n = String(level.index).padStart(2, '0');
  return (
    <section id={level.anchor} aria-labelledby={headingId} data-level={level.index} className={`level level--kanji-${kanjiPosition}${className ? ` ${className}` : ''}`}>
      <HalftoneKanji text={level.kanji} />
      <div className="level__inner">
        <p className="level__eyebrow">
          <MaskLine>{level.eyebrow.replace(`0${level.index}`, n)}</MaskLine>
          <span lang="ja" className="level__jp" aria-hidden="true">
            {JP.level} · {level.jpLabel}
          </span>
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
  jp?: string;
  kanji?: string;
  children?: ReactNode;
}

/** Page frame for routes outside the six levels (projects, arcade, 404). Same visual language, one H1. */
export function PageShell({ eyebrow, heading, jp, kanji, children }: PageProps) {
  return (
    <main id="main" tabIndex={-1} className="level level--page level--kanji-right">
      {kanji && <HalftoneKanji text={kanji} />}
      <div className="level__inner">
        <p className="level__eyebrow">
          <span>{eyebrow}</span>
          {jp && (
            <span lang="ja" className="level__jp" aria-hidden="true">
              {jp}
            </span>
          )}
        </p>
        <h1 className="level__heading" tabIndex={-1}>
          {heading}
        </h1>
        {children}
      </div>
    </main>
  );
}
