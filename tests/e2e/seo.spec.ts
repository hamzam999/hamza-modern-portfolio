import { expect, test } from '@playwright/test';
import { PROJECTS } from '../../src/content/projects';

const SITE = 'https://erhamza.tech';
const INDEXABLE = ['/', '/projects', ...PROJECTS.map((p) => `/projects/${p.slug}`), '/arcade', '/interview-framework'];
const attr = (html: string, re: RegExp) => html.match(re)?.[1];

for (const route of INDEXABLE) {
  test(`@seo ${route}: head tags, JSON-LD and one H1 in the built HTML`, async ({ request }) => {
    const res = await request.get(route);
    expect(res.status()).toBe(200);
    const html = await res.text();
    const title = attr(html, /<title>([^<]+)<\/title>/);
    expect(title, 'title').toBeTruthy();
    expect(title!.length).toBeLessThanOrEqual(70);
    const desc = attr(html, /<meta name="description" content="([^"]+)"/);
    expect(desc!.length).toBeGreaterThan(60);
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/)!;
    expect(canonical).toMatch(/^https:\/\//);
    expect(canonical.endsWith(route === '/' ? '/' : route)).toBe(true);
    expect(canonical.endsWith('/') && route !== '/').toBe(false);
    expect(html).toContain('<meta name="robots" content="index, follow">');
    for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'og:site_name', 'og:type', 'og:locale', 'og:image:width', 'og:image:height']) {
      expect(html, p).toContain(`<meta property="${p}"`);
    }
    expect(attr(html, /<meta property="og:image:width" content="(\d+)"/)).toBe('1200');
    expect(attr(html, /<meta property="og:image:height" content="(\d+)"/)).toBe('630');
    expect(attr(html, /<meta property="og:image" content="([^"]+)"/)).toMatch(/^https:\/\/.+\/og\/.+\.(png|jpg)$/);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
    for (const n of ['twitter:title', 'twitter:description', 'twitter:image']) expect(html, n).toContain(`<meta name="${n}"`);
    expect(attr(html, /<meta property="og:title" content="([^"]+)"/)).toBe(title!.replace(/&amp;/g, '&'));
    expect(attr(html, /<meta property="og:url" content="([^"]+)"/)).toBe(canonical);
    expect(html).toContain('<link rel="alternate" type="text/plain" href="/llms.txt"');
    expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);

    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]!);
    expect(blocks).toHaveLength(1);
    const ld = JSON.parse(blocks[0]!);
    expect(ld['@context']).toBe('https://schema.org');
    expect(Array.isArray(ld['@graph'])).toBe(true);
    expect(html).not.toMatch(/\+91|9919/);
    if (route.startsWith('/projects/')) expect(html).toContain(`<link rel="alternate" type="text/markdown" href="${route}.md">`);
  });
}

test('@seo og images exist and stay under 300 KB', async ({ request }) => {
  const paths = ['/og/default.png', '/og/projects.png', '/og/arcade.png', '/og/interview.png'];
  for (const p of PROJECTS) {
    const html = await (await request.get(`/projects/${p.slug}`)).text();
    paths.push(new URL(/<meta property="og:image" content="([^"]+)"/.exec(html)![1]!).pathname);
  }
  for (const p of paths) {
    const res = await request.get(p);
    expect(res.status(), p).toBe(200);
    const body = await res.body();
    expect(body.length, p).toBeLessThan(300 * 1024);
    // Projects with a captured hero use a jpeg crop of it, the rest a generated png card.
    if (p.endsWith('.jpg')) expect(body.subarray(0, 2).toString('hex'), p).toBe('ffd8');
    else expect(body.subarray(1, 4).toString(), p).toBe('PNG');
  }
});

test('@seo llms.txt, llms-full.txt, robots.txt and sitemap.xml return 200 with the right content type', async ({ request }) => {
  const want: Record<string, RegExp> = {
    '/llms.txt': /^text\/plain/,
    '/llms-full.txt': /^text\/plain/,
    '/robots.txt': /^text\/plain/,
    '/sitemap.xml': /xml/,
  };
  for (const [url, type] of Object.entries(want)) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    expect(res.headers()['content-type'], url).toMatch(type);
    expect((await res.text()).length, url).toBeGreaterThan(40);
  }
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms).toContain('/projects/downtowns-fashion');
});

test('@seo robots.txt points at the sitemap and allows crawling', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toMatch(/User-agent: \*\nAllow: \//);
  expect(txt).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
});

test('@seo sitemap lists exactly the indexable routes, with hero images only for existing heroes', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml.startsWith('<?xml')).toBe(true);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  const pages = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  expect(pages.sort()).toEqual([...INDEXABLE].sort());
  expect(locs.some((l) => l.includes('/404'))).toBe(false);
  expect([...xml.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)].length).toBe(INDEXABLE.length);
  for (const m of xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)) {
    const res = await request.get(new URL(m[1]!).pathname);
    expect(res.status(), m[1]).toBe(200);
  }
});

test('@seo llms.txt, llms-full.txt and project markdown twins are served and phone-free', async ({ request }) => {
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms.startsWith('# Mohammad Hamza\n\n> ')).toBe(true);
  for (const p of PROJECTS) expect(llms).toContain(`${SITE}/projects/${p.slug}`);
  const full = await (await request.get('/llms-full.txt')).text();
  expect(full).toContain('erhamza.dev@gmail.com');
  for (const p of PROJECTS) expect(full).toContain(`## ${p.title}`);
  expect(full + llms).not.toMatch(/\+91|9919|Valerie|SkyAI/i);
  expect(full + llms).not.toMatch(/ERC-?(721|1155)[^.]{0,40}\bon (Sui|Solana)/i);
  const md = await request.get('/projects/navig.md');
  expect(md.status()).toBe(200);
  expect(await md.text()).toContain('# NAVIG');
});

test('@seo unknown path returns a real 404 with noindex', async ({ request }) => {
  const res = await request.get('/no-such-page');
  expect(res.status()).toBe(404);
  const html = await res.text();
  expect(html).toContain('<meta name="robots" content="noindex">');
  expect(html).not.toContain('rel="canonical"');
});

test('@seo private and shut-down projects have no outbound sameAs in JSON-LD', async ({ request }) => {
  for (const p of PROJECTS.filter((x) => x.link.kind === 'private' || x.link.kind === 'offline')) {
    const html = await (await request.get(`/projects/${p.slug}`)).text();
    expect(html, p.slug).not.toContain('"sameAs"');
  }
});

// With JavaScript disabled the prerendered HTML is the whole page.
test('@nojs home renders content, nav and every project link without JavaScript', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mohammad Hamza');
  expect((await page.locator('main').innerText()).length).toBeGreaterThan(800);
  const hrefs = await page.locator('a[href^="/projects/"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  for (const p of PROJECTS) expect(hrefs, p.slug).toContain(`/projects/${p.slug}`);
  await expect(page.getByRole('link', { name: /erhamza\.dev@gmail\.com|email/i }).first()).toBeVisible();
  expect(await page.content()).not.toMatch(/\+91|9919/);
});

test('@nojs project page renders its H1, synopsis and a breadcrumb path without JavaScript', async ({ page }) => {
  await page.goto('/projects/lammles');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Lammle/);
  await expect(page.locator('main')).toContainText('checkout');
  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Project archive');
  expect(await page.locator('main a[href^="/projects/"]').count()).toBeGreaterThanOrEqual(PROJECTS.length);
});

test('@nojs links have descriptive text, images have alt, landmarks are present', async ({ page }) => {
  for (const route of ['/', '/projects', '/projects/navig', '/arcade', '/interview-framework']) {
    await page.goto(route);
    const links = await page.locator('a[href]').evaluateAll((els) =>
      els.map((e) => ({ href: e.getAttribute('href'), name: (e.getAttribute('aria-label') ?? e.textContent ?? '').trim() })),
    );
    for (const l of links) {
      expect(l.name.length, `${route}: link ${l.href} has no name`).toBeGreaterThan(0);
      expect(l.name, `${route}: ${l.href}`).not.toMatch(/^(click here|here|read more|link)$/i);
    }
    const noAlt = await page.locator('img:not([alt])').count();
    expect(noAlt, `${route}: img without alt`).toBe(0);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('header').first()).toBeAttached();
  }
});
