import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '@/content/levels';
import { EXPERIENCES } from '@/content/experience';
import { PROFILE } from '@/content/profile';
import { PROJECTS } from '@/content/projects';
import { LevelShell } from '@/components/ui/LevelShell';
import { MaskLine } from '@/components/ui/MaskLine';
import { useInView } from '@/lib/useInView';
import type { Experience, YearMonth } from '@/types/content';

const level = LEVELS[4];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmt(ym: YearMonth): string {
  const [y, m] = ym.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
/** Position on the ruler, 0..1 (plan 5.5): p = (year + (month - 1) / 12 - 2020) / 6, clamped. */
export function careerP(ym: YearMonth): number {
  const [y, m] = ym.split('-').map(Number) as [number, number];
  return Math.min(1, Math.max(0, (y + (m - 1) / 12 - 2020) / 6));
}

function Checkpoint({ children, p, label, year, kind }: { children: React.ReactNode; p: number; label: string; year: string; kind: string }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const seen = useInView(ref, { rootMargin: '0px 0px -45% 0px' });
  return (
    <li ref={ref} className={`l5__cp l5__cp--${kind}`} data-state={seen ? 'in' : 'pending'}>
      <span className="l5__year tabular">{year}</span>
      <span className="l5__node" aria-hidden="true" />
      <article className="l5__card" data-checkpoint="" data-p={p} data-label={label}>
        {children}
      </article>
    </li>
  );
}

function ExpCard({ e }: { e: Experience<string> }) {
  const related = (e.relatedProjects ?? []).map((s) => PROJECTS.find((p) => p.slug === s)).filter((p) => !!p);
  return (
    <>
      <MaskLine as="h3" className="l5__role">
        {e.role}
      </MaskLine>
      <p className="l5__co">
        {e.company}
        {e.location ? ` · ${e.location}` : ''}
      </p>
      <p className="l5__dates tabular">
        <time dateTime={e.start}>{fmt(e.start)}</time> – {e.end ? <time dateTime={e.end}>{fmt(e.end)}</time> : 'Present'}
      </p>
      <ul className="l5__bul">
        {e.details.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      {e.id === 'ith' && <p className="l5__award">“Promising Newcomer” award.</p>}
      {e.id === 'thl' && (
        <p className="l5__rel">
          <Link to="/#earlier-work">Earlier client stores from this period</Link>
        </p>
      )}
      {related.length > 0 && (
        <p className="l5__rel">
          Related projects:{' '}
          {related.map((p, i) => (
            <span key={p.slug} className="l5__rel-i">
              <Link to={`/projects/${p.slug}`}>{p.cardTitle}</Link>
              {i < related.length - 1 && ' '}
            </span>
          ))}
        </p>
      )}
    </>
  );
}

/** Level 5, Career Path (plan 5.5): chronological checkpoints; the ruler switches to career mode while this level is active. */
export function L5CareerPath() {
  const now = EXPERIENCES[EXPERIENCES.length - 1];
  return (
    <LevelShell level={level} kanjiPosition="right" className="l5">
      {now && (
        <p className="l5__now">
          Now: {now.role}, {now.company}, since {fmt(now.start)}, {now.location.toLowerCase()}.
        </p>
      )}
      <ol className="l5__path">
        <Checkpoint kind="edu" p={0} label={`2020 · ${PROFILE.education.school}`} year="2020">
          <h3 className="l5__role l5__role--small">Education</h3>
          <p className="l5__co">
            {PROFILE.education.degree}, {PROFILE.education.school}, {PROFILE.education.city}, {PROFILE.education.year}.
          </p>
        </Checkpoint>
        {EXPERIENCES.map((e) => (
          <Checkpoint key={e.id} kind="exp" p={careerP(e.start)} label={`${e.start.slice(0, 4)} · ${e.company}`} year={e.start.slice(0, 4)}>
            <ExpCard e={e} />
          </Checkpoint>
        ))}
      </ol>
    </LevelShell>
  );
}
