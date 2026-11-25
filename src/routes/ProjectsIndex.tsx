import { Link } from 'react-router-dom';
import { PROJECTS } from '@/content/projects';
import { JP, KANJI } from '@/content/jp';
import { PageShell } from '@/components/ui/LevelShell';

export default function ProjectsIndex() {
  return (
    <PageShell eyebrow="ARCHIVE" heading="Project archive" jp={`${JP.levels.archive}`} kanji={KANJI.archive}>
      <ul className="level__list">
        {PROJECTS.map((p) => (
          <li key={p.slug}>
            <Link to={`/projects/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
