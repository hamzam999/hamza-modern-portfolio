import { EXPERIENCES } from '@/content/experience';
import manifest from '@/content/media-manifest.json';
import { PROFILE } from '@/content/profile';
import { PROJECTS } from '@/content/projects';
import { SKILL_BRANCHES } from '@/content/skills';
import type { MediaManifest } from '@/types/content';
import { ARCADE_UPDATED, CONTENT_UPDATED, INTERVIEW_UPDATED, PROJECTS_UPDATED } from './dates';
import { getRouteMeta } from './meta';
import { SITE_NAME, SITE_URL } from './site';

type Json = Record<string, unknown>;
type Project = (typeof PROJECTS)[number];

const media = manifest as MediaManifest;
const ID = { person: `${SITE_URL}/#person`, website: `${SITE_URL}/#website` };

/** Largest hero width that was actually built, or null when the project has no screenshot yet. */
export function heroImage(slug: string): { url: string; path: string } | null {
  const hero = media[slug]?.hero;
  if (!hero || hero.widths.length === 0) return null;
  const path = `/projects/${slug}/hero-${Math.max(...hero.widths)}.webp`;
  return { url: SITE_URL + path, path };
}

const graph = (nodes: Json[]): Json => ({ '@context': 'https://schema.org', '@graph': nodes });
const personStub: Json = { '@type': 'Person', '@id': ID.person, name: SITE_NAME, url: `${SITE_URL}/` };
const websiteNode = (): Json => ({
  '@type': 'WebSite',
  '@id': ID.website,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'en',
  publisher: { '@id': ID.person },
});
const crumbs = (items: Array<[string, string]>): Json => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE_URL + path })),
});

function knowsAbout(): string[] {
  return [...new Set(SKILL_BRANCHES.flatMap((b) => b.nodes.map((n) => n.name.replace(/ \(.*\)$/, ''))))];
}

function home(): Json {
  const current = EXPERIENCES.find((e) => e.end === null);
  const person: Json = {
    '@type': 'Person',
    '@id': ID.person,
    name: PROFILE.name,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og/default.png`,
    jobTitle: PROFILE.title,
    description: PROFILE.summary[0],
    email: `mailto:${PROFILE.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Kanpur', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: PROFILE.education.school,
      address: { '@type': 'PostalAddress', addressLocality: PROFILE.education.city, addressCountry: 'IN' },
    },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: PROFILE.education.degree,
      dateCreated: String(PROFILE.education.year),
    },
    award: 'Promising Newcomer, ITH Technologies',
    hasOccupation: {
      '@type': 'Occupation',
      name: current?.role ?? PROFILE.currentRole,
      occupationLocation: { '@type': 'Country', name: 'India' },
      skills: 'React, Next.js, TypeScript, Shopify, ERPNext/Frappe, Web3, Three.js',
    },
    knowsAbout: knowsAbout(),
    sameAs: [PROFILE.links.linkedin, PROFILE.links.github],
  };
  return graph([
    person,
    websiteNode(),
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profile`,
      url: `${SITE_URL}/`,
      name: 'Mohammad Hamza · Senior Frontend Developer',
      isPartOf: { '@id': ID.website },
      mainEntity: { '@id': ID.person },
      dateModified: CONTENT_UPDATED,
    },
  ]);
}

const workId = (slug: string) => `${SITE_URL}/projects/${slug}#work`;

function projectNode(p: Project): Json {
  const hero = heroImage(p.slug);
  const node: Json = {
    '@type': p.seo.schemaType,
    '@id': workId(p.slug),
    name: p.title,
    url: `${SITE_URL}/projects/${p.slug}`,
    description: p.synopsis,
    keywords: p.stack.join(', '),
    creator: { '@id': ID.person },
    isPartOf: { '@id': ID.website },
    dateModified: p.updated,
  };
  if ('applicationCategory' in p.seo) node.applicationCategory = p.seo.applicationCategory;
  if ('operatingSystem' in p.seo) node.operatingSystem = p.seo.operatingSystem;
  if (hero) node.image = hero.url;
  // Only a confirmed year becomes dateCreated; inferred and TBC years stay out of structured data.
  const status: string = p.yearStatus;
  const year: string | null = p.year;
  if (status === 'confirmed' && year) node.dateCreated = year;
  // No sameAs: client store and app URLs are not the same entity as this page; the page keeps its own url.
  return node;
}

function project(slug: string): Json | null {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return null;
  return graph([
    projectNode(p),
    crumbs([['Home', '/'], ['Projects', '/projects'], [p.title, `/projects/${p.slug}`]]),
    websiteNode(),
    personStub,
  ]);
}

function projectsIndex(): Json {
  const m = getRouteMeta('/projects');
  return graph([
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/projects#page`,
      url: `${SITE_URL}/projects`,
      name: m.title,
      description: m.description,
      isPartOf: { '@id': ID.website },
      dateModified: PROJECTS_UPDATED,
      hasPart: PROJECTS.map((p) => ({ '@id': workId(p.slug) })),
    },
    ...PROJECTS.map(projectNode),
    crumbs([['Home', '/'], ['Projects', '/projects']]),
    websiteNode(),
    personStub,
  ]);
}

function plainPage(path: string, updated: string): Json {
  const m = getRouteMeta(path);
  return graph([
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${path}#page`,
      url: `${SITE_URL}${path}`,
      name: m.title,
      description: m.description,
      isPartOf: { '@id': ID.website },
      dateModified: updated,
    },
    crumbs([['Home', '/'], [m.title.split(' | ')[0] ?? m.title, path]]),
    websiteNode(),
    personStub,
  ]);
}

/** JSON-LD document for a route, or null when the route is not indexable (404). */
export function getJsonLd(route: string): Json | null {
  const path = route.length > 1 ? route.replace(/\/$/, '') : route;
  if (path === '/') return home();
  if (path === '/projects') return projectsIndex();
  if (path === '/arcade') return plainPage(path, ARCADE_UPDATED);
  if (path === '/interview-framework') return plainPage(path, INTERVIEW_UPDATED);
  if (path.startsWith('/projects/')) return project(path.slice('/projects/'.length));
  return null;
}
