import { useEffect, useRef } from 'react';
import { EARLIER_WORK } from '@/content/projects';

function List() {
  return (
    <ul className="earlier__list">
      {EARLIER_WORK.map((w) => (
        <li key={w.name} className="earlier__item">
          <p className="earlier__name">
            <strong>{w.name}</strong> <span className="badge badge--oop">Out of print</span>
          </p>
          <p className="earlier__desc">{w.description}</p>
          <p className="earlier__stack">{w.stack.join(' · ')}</p>
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
        <List />
      </section>
    );
  }
  return (
    <section id="earlier-work" aria-label="Earlier work" className="earlier">
      <details ref={ref}>
        <summary>Earlier work · out of print ({EARLIER_WORK.length})</summary>
        <List />
      </details>
    </section>
  );
}
