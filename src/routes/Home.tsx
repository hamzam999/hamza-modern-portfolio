import { LEVELS } from '@/content/levels';
import { useLevelTracker } from '@/game/useLevelTracker';
import { LevelShell } from '@/components/ui/LevelShell';

/** Six empty level shells (Phase 1); real content lands in Phase 2. */
export default function Home() {
  useLevelTracker();
  return (
    <main id="main" tabIndex={-1}>
      {LEVELS.map((level) => (
        <LevelShell key={level.id} level={level} kanjiPosition={level.index % 2 === 0 ? 'left' : 'right'}>
          <p className="level__body">Level {level.index} content arrives in Phase 2.</p>
        </LevelShell>
      ))}
    </main>
  );
}
