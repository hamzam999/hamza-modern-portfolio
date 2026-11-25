import { JP, KANJI } from '@/content/jp';
import { PageShell } from '@/components/ui/LevelShell';

/** Title only in Phase 1; Reel Pong arrives in Phase 4. */
export default function Arcade() {
  return (
    <PageShell eyebrow="ARCADE" heading="Arcade" jp={JP.arcade} kanji={KANJI.arcade}>
      <p className="level__body">Small games built for this site. Win Reel Pong to earn the arcade stamp.</p>
    </PageShell>
  );
}
