import { LEVELS } from '@/content/levels';
import { ABOUT_STATS, PROFILE } from '@/content/profile';
import { Portrait } from '@/components/art/Portrait';
import { LevelShell } from '@/components/ui/LevelShell';
import { MaskLine } from '@/components/ui/MaskLine';

const level = LEVELS[1];

const FACTS: ReadonlyArray<readonly [string, React.ReactNode]> = [
  ['Role', `${PROFILE.title} (current title: ${PROFILE.currentRole.replace(' (Freelance)', ', freelance')})`],
  ['Experience', '6+ years, since January 2020'],
  [
    'Focus',
    'React, Next.js, TypeScript, Shopify (Online Store 2.0, Functions, Checkout Extensions, custom apps), Web3 (Solana, Ethers.js, Wagmi), ERPNext/Frappe, Three.js and GLSL',
  ],
  ['Education', `${PROFILE.education.degree}, ${PROFILE.education.school}, ${PROFILE.education.city}, ${PROFILE.education.year}`],
  [
    'Recognition',
    '“Promising Newcomer” at ITH Technologies, for quickly ramping up on complex Web3 systems and delivering high-impact frontend solutions',
  ],
  ['Based in', PROFILE.location],
  ['Works', 'Remote'],
  ['Email', <a key="e" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>],
];

/** Level 2, Origin (plan 5.2): bio, quick facts as a definition list, stats as credits. */
export function L2Origin() {
  return (
    <LevelShell level={level} urduPosition="right" className="l2">
      <div className="l2__grid">
        <div className="l2__bio">
          {PROFILE.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Portrait />
        <dl className="l2__facts">
          {FACTS.map(([k, v]) => (
            <div key={k} className="l2__fact">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <ul className="l2__stats" aria-label="Highlights">
        {ABOUT_STATS.map((s, i) => (
          <li key={s.value} className={`l2__stat${i === 4 ? ' l2__stat--extra' : ''}`}>
            <MaskLine as="span" className="l2__num" delay={i * 60}>
              {s.value}
            </MaskLine>
            <span className="l2__label">{s.label}</span>
          </li>
        ))}
      </ul>
    </LevelShell>
  );
}
