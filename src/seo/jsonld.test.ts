import { describe, expect, it } from 'vitest';
import { PROJECTS } from '@/content/projects';
import { getJsonLd } from './jsonld';
import { getAllRoutes } from './meta';

type Node = Record<string, unknown> & { '@id'?: string; '@type'?: string };
const nodes = (route: string): Node[] => ((getJsonLd(route) as { '@graph': Node[] }) ?? { '@graph': [] })['@graph'];

describe('JSON-LD', () => {
  it('every indexable route has a graph; 404 has none', () => {
    for (const r of getAllRoutes()) {
      if (r === '/404') expect(getJsonLd(r)).toBeNull();
      else expect(nodes(r).length).toBeGreaterThan(0);
    }
  });

  it('every @id reference resolves inside its own graph', () => {
    for (const r of getAllRoutes().filter((x) => x !== '/404')) {
      const g = nodes(r);
      const defined = new Set(g.map((n) => n['@id']).filter(Boolean));
      const refs = [...JSON.stringify(g).matchAll(/\{"@id":"([^"]+)"\}/g)].map((m) => m[1]);
      for (const ref of refs) expect(defined.has(ref), `${r}: dangling ${ref}`).toBe(true);
    }
  });

  it('home graph carries the logo ImageObject and the WebSite points at it', () => {
    const logo = nodes('/').find((n) => n['@type'] === 'ImageObject')!;
    expect(logo['@id']).toMatch(/#logo$/);
    expect(String(logo.url)).toMatch(/\/icon-512\.png$/);
    const site = nodes('/').find((n) => n['@type'] === 'WebSite')!;
    expect(site.image).toEqual({ '@id': logo['@id'] });
  });

  it('home Person has no telephone and no worksFor, and serialises without a phone number', () => {
    const person = nodes('/').find((n) => n['@type'] === 'Person')!;
    expect(person).not.toHaveProperty('telephone');
    expect(person).not.toHaveProperty('worksFor');
    expect(JSON.stringify(getJsonLd('/'))).not.toMatch(/\+91|9919/);
  });

  it('private and shut-down projects emit no outbound sameAs; unconfirmed years emit no dateCreated', () => {
    for (const p of PROJECTS) {
      const work = nodes(`/projects/${p.slug}`).find((n) => n['@id']?.endsWith('#work'))!;
      if (p.link.kind === 'private' || p.link.kind === 'offline') expect(work).not.toHaveProperty('sameAs');
      if ((p.yearStatus as string) !== 'confirmed') expect(work).not.toHaveProperty('dateCreated');
    }
  });

  it('software projects carry application fields', () => {
    const w = nodes('/projects/codeslytic-budget').find((n) => n['@id']?.endsWith('#work'))!;
    expect(w['@type']).toBe('SoftwareApplication');
    expect(w.applicationCategory).toBe('FinanceApplication');
  });

  it('collection page lists all projects', () => {
    const c = nodes('/projects').find((n) => n['@type'] === 'CollectionPage')!;
    expect((c.hasPart as unknown[]).length).toBe(PROJECTS.length);
  });
});
