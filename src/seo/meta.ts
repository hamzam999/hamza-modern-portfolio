import manifest from '@/content/media-manifest.json';
import { PROJECTS } from '@/content/projects';
import type { MediaManifest } from '@/types/content';
import { SITE_NAME, SITE_URL } from './site';

export interface RouteMeta {
  title: string;
  description: string;
  canonical: string | null;
  robots: 'index, follow' | 'noindex';
  /** Open Graph block; null on the 404 page. Image URL is absolute. */
  og: { type: 'profile' | 'website' | 'article'; image: string; imageAlt: string } | null;
}

const media = manifest as MediaManifest;
/** Projects with a captured hero use a 1200x630 crop of it as og:image (`.jpg`); the others get a generated card (`.png`). */
const ogFile = (slug: string) => ((media[slug]?.hero?.widths.length ?? 0) > 0 ? `${slug}.jpg` : `${slug}.png`);

const OG_ALT = {
  default: 'The hero of the portfolio of Mohammad Hamza, Senior Frontend Engineer: his name and title beside a collage of project prints',
  projects: 'Project archive of Mohammad Hamza: Shopify, Web3, 3D and full-stack work',
  arcade: 'Reel Pong, a small Pong game on the portfolio of Mohammad Hamza',
  interview: 'Frontend interview questions on JavaScript, React and Next.js',
} as const;

const STATIC: Record<string, Omit<RouteMeta, 'canonical' | 'og'> & { path: string | null; og: { type: 'profile' | 'website'; file: string; alt: string } | null }> = {
  '/': {
    path: '/',
    // og/default.png is a 1200x630 capture of the real hero (npm run og:hero), not a generated card.
    og: { type: 'profile', file: 'default', alt: OG_ALT.default },
    title: 'Mohammad Hamza · Senior Frontend Developer (React, Next.js)',
    description:
      'Senior frontend engineer in India with 6+ years building React and Next.js apps, Shopify storefronts, Web3 dashboards and Three.js sites. Remote.',
    robots: 'index, follow',
  },
  '/projects': {
    path: '/projects',
    og: { type: 'website', file: 'projects', alt: OG_ALT.projects },
    title: 'Project archive: React, Shopify, Web3 and 3D work | Mohammad Hamza',
    description:
      `${PROJECTS.length} projects by Mohammad Hamza: Shopify checkouts and storefronts, Web3 dashboards and wallets, Three.js sites, Next.js and ERPNext products, WordPress builds.`,
    robots: 'index, follow',
  },
  '/arcade': {
    path: '/arcade',
    og: { type: 'website', file: 'arcade', alt: OG_ALT.arcade },
    title: 'Arcade: Reel Pong | Mohammad Hamza',
    description:
      'Play Reel Pong, a small paper-and-green Pong game built for this portfolio. First to five wins; touch, mouse and keyboard supported.',
    robots: 'index, follow',
  },
  '/interview-framework': {
    path: '/interview-framework',
    og: { type: 'website', file: 'interview', alt: OG_ALT.interview },
    title: 'Frontend interview questions: React, Next.js, JS | Mohammad Hamza',
    description:
      'A searchable set of frontend interview questions and short answers on JavaScript, TypeScript, React, Next.js, Angular and Shopify.',
    robots: 'index, follow',
  },
  '/404': { path: null, og: null, title: 'Lost reel | Mohammad Hamza', description: '', robots: 'noindex' },
};

/** Every prerendered route: `/`, `/projects`, one page per project, `/arcade`, `/interview-framework`, `/404`. */
export function getAllRoutes(): string[] {
  return ['/', '/projects', ...PROJECTS.map((p) => `/projects/${p.slug}`), '/arcade', '/interview-framework', '/404'];
}

export function getRouteMeta(pathname: string): RouteMeta {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const hit = STATIC[clean];
  if (hit) {
    return {
      title: hit.title,
      description: hit.description,
      robots: hit.robots,
      canonical: hit.path === null ? null : SITE_URL + hit.path,
      og: hit.og && { type: hit.og.type, image: `${SITE_URL}/og/${hit.og.file}.png`, imageAlt: hit.og.alt },
    };
  }
  const slug = clean.startsWith('/projects/') ? clean.slice('/projects/'.length) : null;
  const project = slug ? PROJECTS.find((p) => p.slug === slug) : undefined;
  if (project) {
    return {
      title: project.seo.title, description: project.seo.description, robots: 'index, follow', canonical: `${SITE_URL}/projects/${project.slug}`,
      og: { type: 'article', image: `${SITE_URL}/og/projects/${ogFile(project.slug)}`, imageAlt: project.media.alt },
    };
  }
  return { title: 'Lost reel | Mohammad Hamza', description: '', robots: 'noindex', canonical: null, og: null };
}

export { SITE_NAME };
