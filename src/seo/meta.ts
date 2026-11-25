import { PROJECTS } from '@/content/projects';
import { SITE_NAME, SITE_URL } from './site';

export interface RouteMeta {
  title: string;
  description: string;
  canonical: string | null;
  robots: 'index, follow' | 'noindex';
}

const STATIC: Record<string, Omit<RouteMeta, 'canonical'> & { path: string | null }> = {
  '/': {
    path: '/',
    title: 'Mohammad Hamza · Senior Frontend Developer (React, Next.js)',
    description:
      'Senior frontend engineer in Kanpur, India with 6+ years building React and Next.js apps, Shopify storefronts, Web3 dashboards and Three.js sites. Remote.',
    robots: 'index, follow',
  },
  '/projects': {
    path: '/projects',
    title: 'Project archive: React, Shopify, Web3 and 3D work | Mohammad Hamza',
    description:
      'Seventeen projects by Mohammad Hamza: Shopify checkouts and storefronts, Web3 dashboards and wallets, Three.js sites, Next.js and ERPNext products, WordPress builds.',
    robots: 'index, follow',
  },
  '/arcade': {
    path: '/arcade',
    title: 'Arcade: Reel Pong | Mohammad Hamza',
    description:
      'Play Reel Pong, a small paper-and-cobalt Pong game built for this portfolio. First to five wins; touch, mouse and keyboard supported.',
    robots: 'index, follow',
  },
  '/interview-framework': {
    path: '/interview-framework',
    title: 'Frontend interview questions: React, Next.js, JS | Mohammad Hamza',
    description:
      'A searchable set of frontend interview questions and short answers on JavaScript, TypeScript, React, Next.js, Angular and Shopify.',
    robots: 'index, follow',
  },
  '/404': { path: null, title: 'Lost reel | Mohammad Hamza', description: '', robots: 'noindex' },
};

/** Every prerendered route: `/`, `/projects`, 17 project pages, `/arcade`, `/interview-framework`, `/404`. */
export function getAllRoutes(): string[] {
  return ['/', '/projects', ...PROJECTS.map((p) => `/projects/${p.slug}`), '/arcade', '/interview-framework', '/404'];
}

export function getRouteMeta(pathname: string): RouteMeta {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const hit = STATIC[clean];
  if (hit) {
    return { title: hit.title, description: hit.description, robots: hit.robots, canonical: hit.path === null ? null : SITE_URL + hit.path };
  }
  const slug = clean.startsWith('/projects/') ? clean.slice('/projects/'.length) : null;
  const project = slug ? PROJECTS.find((p) => p.slug === slug) : undefined;
  if (project) {
    return { title: project.seo.title, description: project.seo.description, robots: 'index, follow', canonical: `${SITE_URL}/projects/${project.slug}` };
  }
  return { title: 'Lost reel | Mohammad Hamza', description: '', robots: 'noindex', canonical: null };
}

export { SITE_NAME };
