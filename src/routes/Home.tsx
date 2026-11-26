import { Divider } from '@/components/art/Divider';
import { Ticker } from '@/components/art/Ticker';
import { useLevelTracker } from '@/game/useLevelTracker';
import { L1Spawn } from '@/levels/L1Spawn';
import { L2Origin } from '@/levels/L2Origin';
import { L3SkillTree } from '@/levels/L3SkillTree';
import { L4Archive } from '@/levels/L4Archive';
import { L5CareerPath } from '@/levels/L5CareerPath';
import { L6OpenDoor } from '@/levels/L6OpenDoor';

/** The six-level run (plan 5). Level XP, clears and the arcade unlock are handled by the level tracker and store. */
export default function Home() {
  useLevelTracker();
  return (
    <main id="main" tabIndex={-1}>
      <L1Spawn />
      <Ticker />
      <L2Origin />
      <Divider kind="perf" />
      <L3SkillTree />
      <Divider kind="tear" />
      <L4Archive />
      <Divider kind="sprocket" tone="accent" />
      <L5CareerPath />
      <Divider kind="ticket" />
      <L6OpenDoor />
    </main>
  );
}
