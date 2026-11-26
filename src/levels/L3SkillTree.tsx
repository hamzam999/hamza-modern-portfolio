import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '@/content/levels';
import { EXPERIENCES } from '@/content/experience';
import { PROJECTS } from '@/content/projects';
import { SKILL_BRANCHES } from '@/content/skills';
import { LevelShell } from '@/components/ui/LevelShell';
import { TechIcon } from '@/components/ui/TechIcon';
import { useInView } from '@/lib/useInView';
import type { SkillBranch, SkillDepth } from '@/types/content';

const level = LEVELS[2];

const ICON: Record<string, string> = {
  frontend: 'i-frontend',
  architecture: 'i-architecture',
  '3d-animation': 'i-3d',
  shopify: 'i-shopify',
  web3: 'i-web3',
  'ecommerce-saas': 'i-ecom',
  erp: 'i-erp',
  'devops-tools': 'i-devops',
  'ai-automation': 'i-ai',
  'learning-backend': 'i-learning',
};

const DEPTH_LABEL: Record<SkillDepth, string> = { core: 'core skill', working: 'working skill', familiar: 'currently learning' };

function seenIn(branch: SkillBranch<string>) {
  return branch.evidence.map((e) => {
    if (e.startsWith('experience:')) {
      const exp = EXPERIENCES.find((x) => `experience:${x.id}` === e);
      return exp ? { key: e, label: exp.company, to: '#level-career' } : null;
    }
    const p = PROJECTS.find((x) => x.slug === e);
    return p ? { key: e, label: p.cardTitle, to: `/projects/${p.slug}` } : null;
  });
}

function BranchCard({ branch, page, delay, next }: { branch: SkillBranch<string>; page: number; delay: number; next: boolean }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const seen = useInView(ref, { rootMargin: '0px 0px -12% 0px' });
  const links = seenIn(branch).filter((x): x is NonNullable<typeof x> => x !== null);
  const id = `branch-${branch.id}`;
  const coreN = branch.nodes.filter((n) => n.depth === 'core').length;
  const core = Math.round((coreN / Math.max(1, branch.nodes.length)) * 100);
  return (
    <li ref={ref} className={`l3__card${next ? ' l3__card--next' : ''}`} data-state={seen ? 'in' : 'pending'}>
      <span className="l3__visa" aria-hidden="true" style={{ '--d': `${delay}ms` } as React.CSSProperties}>
        <span>P.{String(page).padStart(2, '0')}</span>
      </span>
      <div className="l3__head">
        <span className="l3__icon" aria-hidden="true" style={{ '--core': `${core}` } as React.CSSProperties}>
          <svg width="30" height="30" focusable="false">
            <use href={`/art/sprite.svg#${ICON[branch.id] ?? 'i-frontend'}`} />
          </svg>
        </span>
        <div>
          <h3 id={id} className="l3__h3">
            {branch.title}
          </h3>
          <p className="l3__tags">
            <span>{branch.nodes.length} skills</span>
            <span>{coreN > 0 ? `${coreN} core` : branch.nodes.some((n) => n.depth === 'familiar') ? 'currently learning' : 'working skills'}</span>
          </p>
        </div>
      </div>
      <ul className="l3__chips" aria-labelledby={id}>
        {branch.nodes.map((n) => (
          <li key={n.id} className={`l3__chip l3__chip--${n.depth}`}>
            <span className="l3__dot" aria-hidden="true" />
            <TechIcon name={n.name} size={28} />
            {n.name}
            <span className="sr-only">, {DEPTH_LABEL[n.depth]}</span>
          </li>
        ))}
      </ul>
      {links.length > 0 && (
        <p className="l3__seen">
          <span>Seen in:</span>{' '}
          {links.map((l, i) => (
            <span key={l.key}>
              {i > 0 && ' · '}
              {l.to.startsWith('#') ? <a href={l.to}>{l.label}</a> : <Link to={l.to}>{l.label}</Link>}
            </span>
          ))}
        </p>
      )}
    </li>
  );
}

/** Level 3, Skill Tree (plan 5.3): resume branches as passport pages, each with a visa stamp and "Seen in" links. */
export function L3SkillTree() {
  return (
    <LevelShell level={level} urduPosition="right" className="l3">
      <p className="l3__intro">Skills as listed on my resume, linked to the projects where they were used.</p>
      <ul className="l3__legend" aria-label="How to read the skill marks">
        <li><span className="l3__dot l3__dot--core" aria-hidden="true" /> core skill</li>
        <li><span className="l3__dot l3__dot--working" aria-hidden="true" /> working skill</li>
        <li><span className="l3__dot l3__dot--familiar" aria-hidden="true" /> currently learning</li>
      </ul>
      <ul className="l3__grid">
        {SKILL_BRANCHES.map((b, i) => (
          <BranchCard key={b.id} branch={b} page={i + 1} delay={(i % 5) * 80} next={b.id === 'learning' || i === SKILL_BRANCHES.length - 1} />
        ))}
      </ul>
    </LevelShell>
  );
}
