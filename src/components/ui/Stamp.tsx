import { useId } from 'react';
import { HAMZA } from '@/components/brand/hamza-path';
import type { LevelNum } from '@/game/rules';

export type StampLevel = LevelNum | 'arcade';

interface Props {
  level: StampLevel;
  state: 'empty' | 'landing' | 'set';
  /** ISO timestamp the stamp was earned. */
  date?: string;
  className?: string;
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
  const rim = level === 'arcade' ? 'REEL PONG CHAMPION' : `LEVEL ${String(level).padStart(2, '0')} CLEARED`;
  const label =
    state === 'empty'
      ? level === 'arcade'
        ? 'Reel Pong stamp, not yet earned'
        : `Level ${level} stamp, not yet earned`
      : `${level === 'arcade' ? 'Reel Pong champion' : `Level ${level} cleared`}${date ? `, ${formatStampDate(date)}` : ''}`;

  const gh = 40;
  const gw = (gh * HAMZA.w) / HAMZA.h;

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
            {level === 'arcade' ? (
              <path fill="var(--vermilion)" transform={`translate(${60 - gw / 2} ${54 - gh / 2}) scale(${gh / HAMZA.h})`} d={HAMZA.d} />
            ) : (
              <text x="60" y="66" textAnchor="middle" fill="var(--vermilion)" fontFamily="var(--font-ui)" fontWeight="600" fontSize="38" letterSpacing="-1">
                {String(level).padStart(2, '0')}
              </text>
            )}
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
