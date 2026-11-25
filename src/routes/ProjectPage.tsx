import { Link, useParams } from 'react-router-dom';
import { CATEGORY_LABEL } from '@/types/content';
import { PROJECTS } from '@/content/projects';
import { PageShell } from '@/components/ui/LevelShell';
import NotFound from './NotFound';

/** Standalone project page (title only in Phase 1; ProjectDetail arrives in P2-8). */
export default function ProjectPage() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return <NotFound />;
  return (
    <PageShell eyebrow={`${CATEGORY_LABEL[project.category].toUpperCase()} · ${project.genre}`} heading={project.title}>
      <p className="level__body">{project.synopsis}</p>
      <div className="level__actions">
        <Link className="btn btn--secondary" to="/projects">
          All projects
        </Link>
      </div>
    </PageShell>
  );
}
