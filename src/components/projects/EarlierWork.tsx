import { useEffect, useRef } from 'react';
import { EARLIER_WORK } from '@/content/projects';

/** Earlier work name to its print under public/archive (built by `npm run media`) and alt text. No links: these projects are offline. */
const PRINTS: Record<string, { file: string; alt: string }> = {
  'Louis Cardin': { file: 'louis-cardin', alt: 'Screenshot of the Louis Cardin Shopify homepage: a perfume bottle on a rock in water' },
  'Sedef Anatolia': { file: 'sedefanatolia', alt: 'Screenshot of the Sedef Anatolia Shopify homepage: a dark perfume bottle with vanilla and ice cream' },
  Slurvo: { file: 'slurvo', alt: 'Screenshot of the Slurvo website: pet treat exporter homepage with dogs and treats' },
  'WanHam Leathers': { file: 'wanhamleathers', alt: 'Screenshot of the WanHam Leathers website: a leather craftsman at work and the company name' },
  'Bizthon Cursor': { file: 'cursor', alt: 'Screenshot of the code editor window used to build the Bizthon Cursor extension' },
};

function Wall() {
  return (
    <ul className="earlier__wall">
      {EARLIER_WORK.map((w) => {
        const art = PRINTS[w.name];
        return art ? (
          <li key={w.name}>
            <figure className="earlier__print">
              <img src={`/archive/${art.file}-360.webp`} srcSet={`/archive/${art.file}-360.webp 360w, /archive/${art.file}-720.webp 720w`} sizes="(min-width: 640px) 140px, 30vw" width={360} height={450} alt={art.alt} loading="lazy" decoding="async" />
              <i className="strip" aria-hidden="true" />
            </figure>
            <span className="earlier__cap">{w.name}</span>
          </li>
        ) : null;
      })}
    </ul>
  );
}

function List({ prints }: { prints: boolean }) {
  return (
    <ul className="earlier__list">
      {EARLIER_WORK.map((w) => (
        <li key={w.name} className="earlier__item">
          {prints && PRINTS[w.name] && (
            <figure className="earlier__print">
              <img
                src={`/archive/${PRINTS[w.name]?.file}-360.webp`}
                srcSet={`/archive/${PRINTS[w.name]?.file}-360.webp 360w, /archive/${PRINTS[w.name]?.file}-720.webp 720w`}
                sizes="(min-width: 768px) 180px, 40vw"
                width={360}
                height={450}
                alt={PRINTS[w.name]?.alt ?? ''}
                loading="lazy"
                decoding="async"
              />
              <i className="strip" aria-hidden="true" />
            </figure>
          )}
          <div className="earlier__text">
          <p className="earlier__name">
            <strong>{w.name}</strong> <span className="badge badge--oop">Out of print</span>
          </p>
          <p className="earlier__meta tabular">{w.year} · {w.context}</p>
          <p className="earlier__desc">{w.description}</p>
          <p className="earlier__stack">{w.stack.join(' · ')}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Earlier work (plan 5.4a): plain list, no pages, no links. `details` in Level 4, open list on /projects. */
export function EarlierWork({ variant }: { variant: 'details' | 'open' }) {
  const ref = useRef<HTMLDetailsElement | null>(null);
  useEffect(() => {
    if (variant !== 'details') return;
    const open = () => {
      if (window.location.hash === '#earlier-work' && ref.current) ref.current.open = true;
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, [variant]);

  if (variant === 'open') {
    return (
      <section id="earlier-work" aria-labelledby="earlier-work-h" className="earlier earlier--open">
        <h2 id="earlier-work-h" className="archive__h">Earlier work</h2>
        <p className="earlier__intro">Client stores and tools from earlier years. They have no live links, so they have no pages.</p>
        <List prints />
      </section>
    );
  }
  return (
    <section id="earlier-work" aria-label="Earlier work" className="earlier">
      <Wall />
      <details ref={ref}>
        <summary>Earlier work · out of print ({EARLIER_WORK.length})</summary>
        <List prints={false} />
      </details>
    </section>
  );
}
