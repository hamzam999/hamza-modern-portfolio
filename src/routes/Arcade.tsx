import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JP, KANJI } from '@/content/jp';
import { PageShell } from '@/components/ui/LevelShell';
import ReelPong from '@/components/arcade/ReelPong';
import { GAMES } from '@/components/arcade/games';
import { selectUnlockedArcade, useGame } from '@/game/store';

/** Arcade page (plan 8.1): intro, Reel Pong, placeholder reels, links back. Text is prerendered; the canvas mounts on the client. */
export default function Arcade() {
  const unlocked = useGame(selectUnlockedArcade);
  const markSeen = useGame((s) => s.markArcadeSeen);
  useEffect(() => {
    markSeen();
  }, [markSeen]);
  return (
    <PageShell eyebrow="ARCADE" heading="Arcade" jp={JP.arcade} kanji={KANJI.arcade}>
      <p className="level__body">Small games built for this site. Win Reel Pong to earn the arcade stamp.</p>
      {!unlocked && (
        <p className="arcade__banner" data-testid="arcade-early">
          You found the arcade early. Play anyway.
        </p>
      )}
      <div className="arcade__grid">
        <ReelPong />
        {GAMES.filter((g) => g.status === 'soon').map((g) => (
          <section key={g.id} className="arcade__slot" aria-labelledby={`${g.id}-t`}>
            <h2 id={`${g.id}-t`} className="arcade__slot-title">{g.title}</h2>
            <p className="arcade__slot-note">Coming later</p>
          </section>
        ))}
      </div>
      <p className="arcade__links">
        <Link to="/projects">Back to the archive</Link>
        <Link to="/">Home</Link>
      </p>
    </PageShell>
  );
}
