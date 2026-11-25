import { Link } from 'react-router-dom';
import { LEVELS } from '@/content/levels';
import { FEATURED, PROJECTS } from '@/content/projects';
import { ArchiveIndex } from '@/components/projects/ArchiveIndex';
import { EarlierWork } from '@/components/projects/EarlierWork';
import { ShelfBox } from '@/components/shelf/ShelfBox';
import { LevelShell } from '@/components/ui/LevelShell';

const level = LEVELS[3];
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Level 4, Archive (plan 5.4). The static tape grid is the SSR and no-JS view; ShelfBox mounts the shelf into the same box. */
export function L4Archive() {
  return (
    <LevelShell level={level} kanjiPosition="left" className="l4">
      <p className="l4__intro">
        {cap(WORDS[FEATURED.length] ?? String(FEATURED.length))} tapes on the shelf, {WORDS[PROJECTS.length] ?? PROJECTS.length} in the archive. Open a tape for the
        full story.
      </p>
      <ShelfBox />
      <h3 className="l4__h3">Full archive</h3>
      <ArchiveIndex variant="compact" />
      <p className="l4__more">
        <Link to="/projects" className="btn btn--secondary">
          Open the archive page
        </Link>
      </p>
      <EarlierWork variant="details" />
    </LevelShell>
  );
}
