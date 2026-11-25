import { useId } from 'react';
import { KANJI_GLYPHS, KANJI_UPEM } from '@/content/kanji-paths';
import { KANJI } from '@/content/jp';
import { LEVELS } from '@/content/levels';
import type { LevelNum } from '@/game/rules';

export type StampLevel = LevelNum | 'arcade';

interface Props {
  level: StampLevel;
  state: 'empty' | 'landing' | 'set';
  /** ISO timestamp the stamp was earned. */
  date?: string;
  className?: string;
}

export function stampKanji(level: StampLevel): string {
  return level === 'arcade' ? KANJI.arcade : (LEVELS[level - 1]?.kanji ?? '');
}

export function formatStampDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Circular vermilion stamp (plan 3.11). Landing plays a one-shot scale/rotate with a clip-path ink spread
 * (ui.css); under reduced motion it simply appears set. Rim text is real SVG text; the svg itself is labelled.
 */
export function Stamp({ level, state, date, className }: Props) {
  const uid = useId();
  const pathId = `stamp-rim-${uid.replace(/:/g, '')}`;
  const chars = [...stampKanji(level)];
  const rim = level === 'arcade' ? 'REEL PONG CHAMPION' : `LEVEL ${String(level).padStart(2, '0')} CLEARED`;
  const label =
    state === 'empty'
      ? level === 'arcade'
        ? 'Reel Pong stamp, not yet earned'
        : `Level ${level} stamp, not yet earned`
      : `${level === 'arcade' ? 'Reel Pong champion' : `Level ${level} cleared`}${date ? `, ${formatStampDate(date)}` : ''}`;

  const em = chars.length > 1 ? 34 : 46;
  const totalW = em * chars.length;

  return (
    <div className={`stamp stamp--${state}${className ? ` ${className}` : ''}`}>
      <svg viewBox="0 0 120 120" role="img" aria-label={label} focusable="false">
        {state === 'empty' ? (
          <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
        ) : (
          <g className="stamp__ink">
            <circle cx="60" cy="60" r="56" fill="none" stroke="var(--vermilion)" strokeWidth="3" />
            <circle cx="60" cy="60" r="38" fill="none" stroke="var(--vermilion)" strokeWidth="1" />
            <defs>
              <path id={pathId} d="M60 60 m-47 0 a47 47 0 1 1 94 0 a47 47 0 1 1 -94 0" />
            </defs>
            <text fill="var(--vermilion)" fontFamily="var(--font-ui)" fontWeight="600" fontSize="9.5" letterSpacing="1.4">
              <textPath href={`#${pathId}`} startOffset="25%" textAnchor="middle">
                {rim}
              </textPath>
            </text>
            <g fill="var(--vermilion)" transform={`translate(${60 - totalW / 2} ${54 - em * 0.5})`}>
              {chars.map((c, i) => {
                const g = KANJI_GLYPHS[c];
                return g ? <path key={c} d={g.d} transform={`translate(${i * em} 0) scale(${em / KANJI_UPEM})`} /> : null;
              })}
            </g>
            {date && (
              <text x="60" y="94" textAnchor="middle" fill="var(--vermilion)" fontFamily="var(--font-ui)" fontWeight="600" fontSize="7" letterSpacing="0.6">
                {formatStampDate(date).toUpperCase()}
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
