import { Link } from 'react-router-dom';
import { FEATURED } from '@/content/projects';
import { CATEGORY_LABEL } from '@/types/content';
import { statusOf } from './ArchiveIndex';
import { CoverArt, mediaOf } from '@/components/shelf/media';
import { PosterFallback } from './PosterFallback';

/** Static grid of the featured tapes (plan 6.9): what crawlers and no-JS visitors get; Phase 3 mounts the shelf over it. */
export function TapeGrid() {
  return (
    <ol className="tape-grid">
      {FEATURED.map((p) => (
        <li key={p.slug} className="tape-grid__item">
          <Link to={`/projects/${p.slug}`} className="tape__link">
            {mediaOf(p.slug)?.cover ? (
              <span className="poster poster--img" aria-hidden="true">
                <CoverArt project={p} sizes="(min-width: 1024px) 20vw, 45vw" />
              </span>
            ) : (
              <PosterFallback project={p} />
            )}
            <span className="tape__meta">
              <span className="tape__title">{p.cardTitle}</span>
              <span className="tape__cat">{CATEGORY_LABEL[p.category]}</span>
              {p.link.kind === 'offline' && <span className="badge badge--oop tape__badge">{statusOf(p).label}</span>}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
