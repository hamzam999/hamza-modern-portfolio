import { useState } from 'react';
import { TechIcon } from '@/components/ui/TechIcon';

export const TICKER_SKILLS = ['Shopify Functions', 'Checkout Extensions', 'React', 'Next.js', 'TypeScript', 'Three.js', 'WebGL', 'Solana', 'Wagmi', 'ERPNext', 'Frappe', 'GLSL', 'Online Store 2.0'] as const;

/**
 * Skills ticker on a film strip, between level 1 and 2. The list is real text (readable without CSS motion or JS);
 * the scrolling copy is aria-hidden. It stops on hover or focus, under reduced motion, and with the pause button (WCAG 2.2.2).
 */
export function Ticker() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="ticker" aria-label="Skills ticker" data-paused={paused ? '' : undefined}>
      <div className="ticker__viewport">
        <div className="ticker__track">
          <ul className="ticker__list">
            {TICKER_SKILLS.map((s) => (
              <li key={s}>
                <TechIcon name={s} />
                {s}
              </li>
            ))}
          </ul>
          <ul className="ticker__list" aria-hidden="true">
            {TICKER_SKILLS.map((s) => (
              <li key={s}>
                <TechIcon name={s} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button type="button" className="ticker__btn" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        <span aria-hidden="true">{paused ? 'Play' : 'Pause'}</span>
        <span className="sr-only">Pause ticker</span>
      </button>
    </section>
  );
}
