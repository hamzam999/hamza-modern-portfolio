import { LEVELS } from '@/content/levels';
import { HERO_CONTENT, PROFILE } from '@/content/profile';
import { PROJECTS } from '@/content/projects';
import { HeroCollage } from '@/components/art/HeroCollage';
import { Button } from '@/components/ui/Button';
import { LevelShell } from '@/components/ui/LevelShell';
import { MaskLine } from '@/components/ui/MaskLine';
import { TechIcon } from '@/components/ui/TechIcon';

const level = LEVELS[0];

/** Level 1, Spawn (plan 5.1). The H1 is plain markup so it is the LCP element and paints immediately. */
export function L1Spawn() {
  return (
    <LevelShell
      level={level}
      urduPosition="right"
      className="l1"
      heading={
        <>
          {PROFILE.name} <span className="l1__role">{PROFILE.title}</span>
        </>
      }
    >
      <MaskLine as="p" trigger="mount" delay={80} className="l1__lead">
        {HERO_CONTENT.lead}
      </MaskLine>
      <MaskLine as="p" trigger="mount" delay={200} className="l1__tagline">
        {HERO_CONTENT.tagline}
      </MaskLine>
      <div className="l1__meta">
        <ul className="l1__focus" aria-label="Focus">
          {HERO_CONTENT.focus.map((f) => (
            <li key={f}>
              <TechIcon name={f} />
              {f}
            </li>
          ))}
        </ul>
        <p className="l1__avail">
          {HERO_CONTENT.availability} · {PROFILE.location} · Remote
        </p>
      </div>
      <div className="l1__actions">
        <Button as="a" href="#level-origin" size="lg">
          Press start
        </Button>
        <Button as="a" href="#level-archive" variant="secondary" size="lg">
          Skip to projects
        </Button>
        <Button as="a" href="#level-contact" variant="ghost" size="lg">
          Hire me
        </Button>
      </div>
      <HeroCollage />
      <p className="l1__note">This page is a six-level run. Scroll to play, or turn Play mode off in the passport.</p>
      <p className="l1__credits">
        A {PROFILE.name.toUpperCase()} build · 2020–2026 · {PROJECTS.length} reels in the archive
      </p>
    </LevelShell>
  );
}
