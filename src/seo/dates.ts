import { EXPERIENCE_UPDATED } from '@/content/experience';
import { PROFILE_UPDATED } from '@/content/profile';
import { PROJECTS } from '@/content/projects';
import { SKILLS_UPDATED } from '@/content/skills';

/** Own constants for pages that are not content files (plan 9.7). Bump by hand when the page changes. */
export const ARCADE_UPDATED = '2026-11-25';
export const INTERVIEW_UPDATED = '2026-11-25';

const max = (dates: readonly string[]) => dates.reduce((a, b) => (a > b ? a : b));
export const PROJECTS_UPDATED = max(PROJECTS.map((p) => p.updated));
/** Latest `updated` across all content files: lastmod for `/` and `/projects` when relevant. */
export const CONTENT_UPDATED = max([PROJECTS_UPDATED, PROFILE_UPDATED, EXPERIENCE_UPDATED, SKILLS_UPDATED]);
