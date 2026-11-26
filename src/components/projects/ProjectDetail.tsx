import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_LABEL, type OwnerClaim, type Project } from '@/types/content';
import { PROFILE } from '@/content/profile';
import { MaskLine } from '@/components/ui/MaskLine';
import { ProjectHero } from '@/components/shelf/media';
import { FullPageLayout, hasFullPage } from './FullPageLayout';
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
  /** Replaces the default poster (the sheet passes the ink-mask poster). */
  poster?: ReactNode;
  /** Sheet only: eyebrow, title, synopsis and year rise through masks after the clip opens (plan 6.8). */
  reveal?: boolean;
}

/** Content block shared by the detail sheet and `/projects/:slug` (plan 3.11, 6.8). */
export function ProjectDetail({ project: p, headingLevel, showPageLink, poster, reveal }: Props) {
  const H = headingLevel === 1 ? 'h1' : 'h2';
  const Sub = headingLevel === 1 ? 'h2' : 'h3';
  const link = p.link;
  const eyebrow = `${CATEGORY_LABEL[p.category]} · ${p.genre}`;
  const REVEAL_AT = 450;
  const viewer = hasFullPage(p);
  return (
    <article className={`pd${viewer ? ' pd--viewer' : ''}`}>
      {reveal ? (
        <MaskLine as="p" className="pd__eyebrow" trigger="mount" delay={REVEAL_AT}>
          {eyebrow}
        </MaskLine>
      ) : (
        <p className="pd__eyebrow">{eyebrow}</p>
      )}
      {reveal ? (
        <MaskLine as="h2" className="pd__title" id={`pd-${p.slug}`} trigger="mount" delay={REVEAL_AT + 60}>
          {p.title}
        </MaskLine>
      ) : (
        <H className="pd__title" id={`pd-${p.slug}`} tabIndex={headingLevel === 1 ? -1 : undefined}>
          {p.title}
        </H>
      )}
      {p.subtitle && <p className="pd__subtitle">{p.subtitle}</p>}
      <div className={`pd__poster${viewer ? ' pd__poster--viewer' : ''}`}>
        {viewer ? (
          <FullPageLayout project={p} headingLevel={headingLevel} />
        ) : (
          poster ?? <ProjectHero project={p} size="hero" eager={headingLevel === 1} />
        )}
      </div>
      <div className="pd__grid">
        <div className="pd__col">
          {reveal ? (
            <MaskLine as="p" className="pd__synopsis" trigger="mount" delay={REVEAL_AT + 120}>
              {p.synopsis}
            </MaskLine>
          ) : (
            <p className="pd__synopsis">{p.synopsis}</p>
          )}

          {p.role && (
            <>
              <Sub className="pd__h">My role</Sub>
              <p className="pd__text">{p.role}</p>
            </>
          )}
          <Sub className="pd__h">Engagement</Sub>
          <p className="pd__text">{p.engagement}</p>

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
          {p.year && (
            <>
              <Sub className="pd__h">Year</Sub>
              {reveal ? (
                <MaskLine as="p" className="pd__text tabular" trigger="mount" delay={REVEAL_AT + 180}>
                  {yearLabel(p)}
                </MaskLine>
              ) : (
                <p className="pd__text tabular">{yearLabel(p)}</p>
              )}
            </>
          )}
          <Sub className="pd__h">Link</Sub>
          {link.kind === 'live' && (
            <>
              <a className="btn btn--primary on-accent" href={link.url} rel="noopener noreferrer" target="_blank">
                Visit live site<span className="sr-only"> (opens in a new tab)</span>
              </a>
              {link.note && <p className="pd__note">{link.note}</p>}
            </>
          )}
          {link.kind === 'repo' && (
            <a className="btn btn--primary on-accent" href={link.url} rel="noopener noreferrer" target="_blank">
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
