import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { App } from './App';

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}

export { getAllRoutes, getRouteMeta } from './seo/meta';
export { getJsonLd, heroImage, fullPageImages } from './seo/jsonld';
export { SITE_URL, SITE_NAME } from './seo/site';
export { ARCADE_UPDATED, CONTENT_UPDATED, INTERVIEW_UPDATED, PROJECTS_UPDATED } from './seo/dates';
export { PROJECTS, EARLIER_WORK } from './content/projects';
export { PROFILE } from './content/profile';
export { EXPERIENCES } from './content/experience';
export { SKILL_BRANCHES } from './content/skills';
export { CATEGORY_LABEL } from './types/content';
