import { Link } from 'react-router-dom';
import { CATEGORY_LABEL, type OwnerClaim, type Project } from '@/types/content';
import { PROFILE } from '@/content/profile';
import { PosterFallback } from './PosterFallback';
import { yearLabel } from './ArchiveIndex';

const SOURCE: Record<OwnerClaim['source'], string> = {
  csv: 'Project notes',
  resume: 'Resume',
  'previous-site': 'Previous portfolio',
  'owner-confirmed': 'Confirmed by Mohammad Hamza',
};
const PRIVATE_NOTE = {
  client: 'Built for a client. The work is not publicly available.',
  'client-internal': 'Built for a client’s internal use. The work is not publicly available.',
  'private-repo': 'Lives in a private repository, so there is no public link.',
} as const;

interface Props {
  project: Project;
  headingLevel: 1 | 2;
  /** Shows the "Open as a page" link (used by the detail sheet, Phase 3). */
  showPageLink?: boolean;
}

/** Content block shared by the detail sheet and `/projects/:slug` (plan 3.11, 6.8). */
export function ProjectDetail({ project: p, headingLevel, showPageLink }: Props) {
  const H = headingLevel === 1 ? 'h1' : 'h2';
  const Sub = headingLevel === 1 ? 'h2' : 'h3';
  const link = p.link;
  return (
    <article className="pd">
      <p className="pd__eyebrow">
        {CATEGORY_LABEL[p.category]} · {p.genre}
      </p>
      <H className="pd__title" id={`pd-${p.slug}`} tabIndex={headingLevel === 1 ? -1 : undefined}>
        {p.title}
      </H>
      {p.subtitle && <p className="pd__subtitle">{p.subtitle}</p>}
      <div className="pd__poster">
        <PosterFallback project={p} size="hero" />
      </div>
      <div className="pd__grid">
        <div className="pd__col">
          <p className="pd__synopsis">{p.synopsis}</p>

          <Sub className="pd__h">My role</Sub>
          <p className={p.role ? 'pd__text' : 'pd__text pd__text--tbc'}>{p.role ?? 'Owner to confirm'}</p>

          {p.highlights && p.highlights.length > 0 && (
            <>
              <Sub className="pd__h">Highlights</Sub>
              <ul className="pd__list">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </>
          )}

          {p.productScope && p.productScope.length > 0 && (
            <>
              <Sub className="pd__h">Product scope</Sub>
              <ul className="pd__list">
                {p.productScope.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </>
          )}

          {p.claims && p.claims.length > 0 && (
            <>
              <Sub className="pd__h">Results</Sub>
              <ul className="pd__list">
                {p.claims.map((c) => (
                  <li key={c.text}>
                    {c.text} <span className="pd__src">(Source: {SOURCE[c.source]})</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="pd__side" aria-label="Project facts">
          <Sub className="pd__h pd__h--first">Stack</Sub>
          <ul className="pd__chips">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {p.tools && p.tools.length > 0 && (
            <>
              <Sub className="pd__h">Tools</Sub>
              <ul className="pd__chips">
                {p.tools.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
          <Sub className="pd__h">Year</Sub>
          <p className="pd__text tabular">{yearLabel(p)}</p>
          <Sub className="pd__h">Link</Sub>
          {link.kind === 'live' && (
            <>
              <a className="btn btn--primary on-cobalt" href={link.url} rel="noopener noreferrer" target="_blank">
                Visit live site<span className="sr-only"> (opens in a new tab)</span>
              </a>
              {link.note && <p className="pd__note">{link.note}</p>}
            </>
          )}
          {link.kind === 'repo' && (
            <a className="btn btn--primary on-cobalt" href={link.url} rel="noopener noreferrer" target="_blank">
              View repository<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {link.kind === 'private' && <p className="pd__text">{PRIVATE_NOTE[link.reason]}</p>}
          {link.kind === 'offline' && <p className="pd__text pd__oop">Out of print. This project has shut down.</p>}
          {showPageLink && (
            <p className="pd__note">
              <Link to={`/projects/${p.slug}`}>Open as a page</Link>
            </p>
          )}
        </aside>
      </div>
      <p className="pd__credit">Built by {PROFILE.name}.</p>
    </article>
  );
}
