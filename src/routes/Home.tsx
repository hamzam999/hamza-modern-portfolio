import { useLevelTracker } from '@/game/useLevelTracker';
import { L1Spawn } from '@/levels/L1Spawn';
import { L2Origin } from '@/levels/L2Origin';
import { L3SkillTree } from '@/levels/L3SkillTree';
import { L4Archive } from '@/levels/L4Archive';
import { L5CareerPath } from '@/levels/L5CareerPath';
import { L6FinalBoss } from '@/levels/L6FinalBoss';

/** The six-level run (plan 5). Level XP, clears and the arcade unlock are handled by the level tracker and store. */
export default function Home() {
  useLevelTracker();
  return (
    <main id="main" tabIndex={-1}>
      <L1Spawn />
      <L2Origin />
      <L3SkillTree />
      <L4Archive />
      <L5CareerPath />
      <L6FinalBoss />
    </main>
  );
}
