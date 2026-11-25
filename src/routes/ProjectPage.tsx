import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORY_LABEL } from '@/types/content';
import { PROJECTS } from '@/content/projects';
import { projectOpenId } from '@/game/rules';
import { useGame } from '@/game/store';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import NotFound from './NotFound';

/** Standalone project page (plan 4.4). Visiting it counts as opening the project (7.2). */
export default function ProjectPage() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  useEffect(() => {
    if (project) useGame.getState().grant(projectOpenId(project.slug));
  }, [project]);
  if (!project) return <NotFound />;
  return (
    <main id="main" tabIndex={-1} className="level level--page project-page">
      <div className="level__inner">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link to="/projects">All projects</Link>
          <span aria-hidden="true"> / </span>
          <span>{CATEGORY_LABEL[project.category]}</span>
        </nav>
        <ProjectDetail project={project} headingLevel={1} />
      </div>
    </main>
  );
}
