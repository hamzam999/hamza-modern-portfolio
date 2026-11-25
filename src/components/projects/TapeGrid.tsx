import { Link } from 'react-router-dom';
import { FEATURED } from '@/content/projects';
import { CATEGORY_LABEL } from '@/types/content';
import { PosterFallback } from './PosterFallback';

/** Static grid of the featured tapes (plan 6.9): what crawlers and no-JS visitors get; Phase 3 mounts the shelf over it. */
export function TapeGrid() {
  return (
    <ol className="tape-grid">
      {FEATURED.map((p) => (
        <li key={p.slug} className="tape">
          <Link to={`/projects/${p.slug}`} className="tape__link">
            <PosterFallback project={p} />
            <span className="tape__meta">
              <span className="tape__title">{p.cardTitle}</span>
              <span className="tape__cat">{CATEGORY_LABEL[p.category]}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
