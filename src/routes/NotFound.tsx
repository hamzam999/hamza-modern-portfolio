import { Link } from 'react-router-dom';
import { FEATURED } from '@/content/projects';
import { JP, KANJI } from '@/content/jp';
import { PageShell } from '@/components/ui/LevelShell';

export default function NotFound() {
  return (
    <PageShell eyebrow="404" heading="Lost reel" jp={JP.notFound} kanji={KANJI.notFound}>
      <p className="level__body">This tape is not in the archive. It may have been renamed or never existed.</p>
      <ul className="notfound__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">All projects</Link></li>
        <li><Link to="/arcade">Arcade</Link></li>
        {FEATURED.slice(0, 5).map((p) => (
          <li key={p.slug}>
            <Link to={`/projects/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
