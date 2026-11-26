import { useEffect, useState } from 'react';
import { LEVELS } from '@/content/levels';
import { useGame } from '@/game/store';
import { scrollToLevel } from '@/lib/scroll';

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;
const DESCRIPTOR: Record<string, string> = {
  spawn: 'introduction',
  origin: 'my story',
  skills: 'skills and tools',
  archive: 'selected projects',
  career: 'career path',
  contact: 'contact',
};

/**
 * Bottom ruler (plan 5.8), level mode: the main navigation on `/`. Six markers with 44 px hit areas, decorative
 * year ticks and a gliding accent dot moved with transform only. Career mode arrives with Level 5 (P2-5).
 */
export function Ruler() {
  const active = useGame((s) => s.activeLevel);
  const current = Math.max(1, active);
  const career = active === 5;
  const [cp, setCp] = useState<{ p: number; label: string } | null>(null);

  // Career mode (plan 5.5): while Level 5 is active the dot follows the checkpoint crossing the viewport centre.
  useEffect(() => {
    if (!career || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-checkpoint]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          setCp({ p: Number(el.dataset.p), label: el.dataset.label ?? '' });
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [career]);

  const careerP = career && cp ? cp.p : null;
  const pos = careerP !== null ? careerP * 5 : current - 1;
  return (
    <nav aria-label="Levels" className={`ruler${career ? ' ruler--career' : ''}`}>
      <div className="ruler__track">
        <div className="ruler__line" aria-hidden="true" />
        <ol className="ruler__years" aria-hidden="true">
          {YEARS.map((y, i) => (
            <li key={y} style={{ left: `${(i / (YEARS.length - 1)) * 100}%` }}>
              <i />
              {y}
            </li>
          ))}
        </ol>
        <div className="ruler__slider" style={{ '--p': pos } as React.CSSProperties} aria-hidden="true">
          <span className="ruler__dot" />
          {careerP !== null && cp && (
            <span className="ruler__label" data-align={careerP < 0.14 ? 'start' : careerP > 0.86 ? 'end' : 'mid'}>
              {cp.label}
            </span>
          )}
        </div>
        <ol className="ruler__marks">
          {LEVELS.map((l, i) => (
            <li key={l.id} style={{ left: `${i * 20}%` }}>
              <a
                href={`#${l.anchor}`}
                className="ruler__mark"
                aria-label={`Level ${l.index}: ${l.name}, ${DESCRIPTOR[l.id]}`}
                aria-current={current === l.index && active !== 0 ? 'location' : undefined}
                onClick={(e) => {
                  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  scrollToLevel(l.anchor);
                }}
              >
                <span className="ruler__pip" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
