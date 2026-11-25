import { Link } from 'react-router-dom';
import { PROJECTS } from '@/content/projects';
import { CATEGORY_LABEL, type Project, type ProjectCategory } from '@/types/content';

const ORDER: readonly ProjectCategory[] = ['interactive', 'ecommerce', 'web3', 'product', 'ai', 'wordpress'];

export function statusOf(p: Pick<Project, 'link'>): { label: string; kind: 'live' | 'repo' | 'private' | 'oop' } {
  switch (p.link.kind) {
    case 'live': return { label: 'Live', kind: 'live' };
    case 'repo': return { label: 'Repo', kind: 'repo' };
    case 'private': return { label: 'Private', kind: 'private' };
    case 'offline': return { label: 'Out of print', kind: 'oop' };
  }
}

export function yearLabel(p: Pick<Project, 'year' | 'yearStatus'>): string {
  if (!p.year) return 'TBC';
  return p.yearStatus === 'inferred' ? `${p.year} (approx.)` : p.year;
}

interface Props {
  variant: 'compact' | 'full';
}

/** Semantic list of all projects grouped by category (plan 6.10). SSR-rendered. */
export function ArchiveIndex({ variant }: Props) {
  const H = variant === 'full' ? 'h2' : 'h4';
  return (
    <div className={`archive archive--${variant}`}>
      {ORDER.map((cat) => {
        const items = PROJECTS.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        const hid = `archive-${variant}-${cat}`;
        return (
          <section key={cat} aria-labelledby={hid} className="archive__group">
            <H id={hid} className="archive__h">
              {CATEGORY_LABEL[cat]} <span className="archive__count">({items.length})</span>
            </H>
            <ul className="archive__list">
              {items.map((p) => {
                const st = statusOf(p);
                return (
                  <li key={p.slug} className="archive__row">
                    <div className="archive__main">
                      <Link to={`/projects/${p.slug}`} className="archive__link">
                        {p.title}
                        <span className="sr-only">: {p.genre.toLowerCase()}</span>
                      </Link>
                      <p className="archive__sum">{p.seo.llmsSummary}</p>
                      <p className="archive__stack">{p.stack.slice(0, 3).join(' · ')}</p>
                    </div>
                    <div className="archive__side">
                      <span className={`badge badge--${st.kind}`}>{st.label}</span>
                      {variant === 'full' && <span className="archive__year">{yearLabel(p)}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
