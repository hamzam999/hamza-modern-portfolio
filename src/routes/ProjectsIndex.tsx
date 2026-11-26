import { URDU } from '@/content/urdu';
import { FEATURED, PROJECTS } from '@/content/projects';
import { ArchiveIndex } from '@/components/projects/ArchiveIndex';
import { EarlierWork } from '@/components/projects/EarlierWork';
import { PageShell } from '@/components/ui/LevelShell';

export default function ProjectsIndex() {
  return (
    <PageShell eyebrow="ARCHIVE" heading="Project archive" urdu={URDU.archive}>
      <p className="level__body">
        All {PROJECTS.length} projects, grouped by kind of work: {FEATURED.length} of them are on the shelf on the home page. Years marked TBC are not
        confirmed yet.
      </p>
      <div className="projects-index">
        <ArchiveIndex variant="full" />
        <EarlierWork variant="open" />
      </div>
    </PageShell>
  );
}
