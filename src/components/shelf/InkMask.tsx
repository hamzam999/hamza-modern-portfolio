import { useEffect, useId, useRef, useState } from 'react';
import type { Project } from '@/types/content';
import { mediaOf } from './media';

/** Circle centres (poster units 0..1) and target radii as a fraction of the poster diagonal (plan 6.8). */
const CIRCLES: ReadonlyArray<readonly [number, number, number]> = [
  [0.2, 0.3, 0.32],
  [0.75, 0.25, 0.28],
  [0.5, 0.6, 0.36],
  [0.15, 0.8, 0.24],
  [0.85, 0.7, 0.3],
  [0.4, 0.15, 0.22],
  [0.62, 0.88, 0.26],
];
const W = 1600;
const H = 1000;
const DIAG = Math.hypot(W, H);
const START = 300;
const GROW = 900;
const STAGGER = 70;
const REMOVE_AT = 1400;

const seedOf = (slug: string) => [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % 1000;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const ACCENT: Record<Project['spine'], { bg: string; accent: string; ink: string }> = {
  accent: { bg: 'var(--accent)', accent: 'var(--vermilion)', ink: 'var(--sheet)' },
  ink: { bg: 'var(--ink)', accent: 'var(--paper)', ink: 'var(--paper)' },
  graphite: { bg: 'var(--graphite)', accent: 'var(--sheet)', ink: 'var(--sheet)' },
  paper: { bg: 'var(--sheet)', accent: 'var(--accent)', ink: 'var(--ink)' },
};

interface Props {
  project: Pick<Project, 'slug' | 'title' | 'cardTitle' | 'spine' | 'media'>;
  /** false: render the finished poster at once (reduced motion). */
  animate: boolean;
}

/**
 * Poster for the detail sheet: an inline SVG whose `<image>` is revealed through seven growing, turbulence-displaced
 * circles (plan 6.8). rAF writes the radii; at 1.4 s the mask is dropped so the filter costs nothing while reading.
 * (CSS `mask: url(#id)` is not used: Chromium does not support SVG mask references on HTML content.)
 */
export function InkMask({ project: p, animate }: Props) {
  const uid = useId().replace(/:/g, '');
  const maskId = `ink-${uid}`;
  const filterId = `inkf-${uid}`;
  const circles = useRef<Array<SVGCircleElement | null>>([]);
  const [masked, setMasked] = useState(animate);
  const hero = mediaOf(p.slug)?.hero;
  const c = ACCENT[p.spine];

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = now - t0;
      circles.current.forEach((el, i) => {
        const spec = CIRCLES[i];
        if (!el || !spec) return;
        const k = Math.max(0, Math.min(1, (t - START - i * STAGGER) / GROW));
        el.setAttribute('r', String(easeOut(k) * spec[2] * DIAG));
      });
      if (t >= REMOVE_AT) setMasked(false);
      else raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const words = p.cardTitle.split(' ');
  const mid = Math.ceil(words.length / 2);
  const lines = words.length > 2 ? [words.slice(0, mid).join(' '), words.slice(mid).join(' ')] : [p.cardTitle];

  return (
    <svg className="ink" viewBox={`0 0 ${W} ${H}`} role={hero ? 'img' : undefined} aria-label={hero ? p.media.alt : undefined} aria-hidden={hero ? undefined : true} preserveAspectRatio="xMidYMid slice">
      <defs>
        {masked && (
          <>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed={seedOf(p.slug)} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="38" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
              <g filter={`url(#${filterId})`}>
                {CIRCLES.map(([cx, cy], i) => (
                  <circle key={i} ref={(el) => void (circles.current[i] = el)} cx={cx * W} cy={cy * H} r="0" fill="#fff" />
                ))}
              </g>
            </mask>
          </>
        )}
      </defs>
      <g mask={masked ? `url(#${maskId})` : undefined}>
        {hero ? (
          <image href={`/projects/${p.slug}/hero-${Math.max(...hero.widths)}.webp`} width={W} height={H} preserveAspectRatio="xMidYMid slice" />
        ) : (
          <>
            <rect width={W} height={H} style={{ fill: c.bg }} />
            <circle cx={W * 0.82} cy={H * 0.22} r={H * 0.2} style={{ fill: c.accent }} />
            <polygon points={`${W * 0.38},${H} ${W},${H * 0.45} ${W},${H}`} style={{ fill: c.accent }} />
            {lines.map((l, i) => (
              <text key={l} x={W * 0.06} y={H * 0.2 + i * 150} style={{ fill: c.ink, font: '600 140px "Inter Tight", Arial, sans-serif', letterSpacing: '-0.02em' }}>
                {l}
              </text>
            ))}
          </>
        )}
      </g>
    </svg>
  );
}
