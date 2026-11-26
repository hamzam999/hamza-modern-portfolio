// Generates robots.txt, sitemap.xml, llms.txt, llms-full.txt and projects/<slug>.md (plan 9.7).
// Reads the content through the SSR bundle so the files can never drift from the site.
// Round 4: every file is written to dist/ AND to public/ (committed), so a plain `vite build` (or `vite dev`)
// still ships and serves them. scripts/check-budgets.mjs fails when the public/ copy differs from dist/.
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const S = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href);
const { SITE_URL, PROJECTS, EARLIER_WORK, PROFILE, EXPERIENCES, SKILL_BRANCHES, CATEGORY_LABEL, heroImage, fullPageImages, getRouteMeta } = S;

const pub = join(root, 'public');
const write = (rel, text) => {
  for (const base of [dist, pub]) {
    const file = join(base, rel);
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, text.endsWith('\n') ? text : text + '\n');
  }
};
const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
const countWord = (n) => COUNT_WORDS[n] ?? String(n);

// ---------- helpers ----------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ym = (v) => (v === null ? 'present' : `${MONTHS[Number(v.slice(5, 7)) - 1]} ${v.slice(0, 4)}`);
const span = (e) => `${ym(e.start)}–${ym(e.end)}`;
const url = (slug) => `${SITE_URL}/projects/${slug}`;
const HEADING = { interactive: 'interactive web', ecommerce: 'e-commerce and Shopify', web3: 'Web3', product: 'full-stack and product', ai: 'AI and automation', wordpress: 'WordPress' };
const STATUS = {
  live: 'live',
  repo: 'public repository',
  private: 'private (not linked)',
  offline: 'shut down (no longer online)',
};
const statusOf = (p) => STATUS[p.link.kind];
const yearOf = (p) => (p.year ? (p.yearStatus === 'confirmed' ? p.year : `${p.year} (approximate, inferred from role dates)`) : 'year unknown');
const externalLink = (p) => (p.link.kind === 'live' || p.link.kind === 'repo' ? p.link.url : null);
const CATEGORY_ORDER = ['interactive', 'ecommerce', 'web3', 'product', 'ai', 'wordpress'];

const summary = `${PROFILE.name} is a ${PROFILE.title} based in ${PROFILE.location}, with 6+ years of experience building e-commerce platforms, Web3 applications, ERP interfaces and interactive web experiences. He works with React, Next.js, TypeScript, Shopify (Online Store 2.0, Functions, Checkout Extensions, custom apps), ERPNext/Frappe, Solana and EVM wallets, and Three.js with GLSL. He works remotely as a freelance ${PROFILE.currentRole.replace(/ \(Freelance\)$/, '')}.`;

function projectBody(p, level) {
  const h = '#'.repeat(level);
  const lines = [];
  lines.push(`- Category: ${[CATEGORY_LABEL[p.category], ...(p.secondaryCategories ?? []).map((c) => CATEGORY_LABEL[c])].join('; ')}`);
  lines.push(`- Status: ${statusOf(p)}`);
  lines.push(`- Year: ${yearOf(p)}`);
  lines.push(`- Engagement: ${p.engagement}`);
  if (p.role) lines.push(`- Role: ${p.role}`);
  lines.push(`- Stack: ${p.stack.join(', ')}`);
  if (p.tools?.length) lines.push(`- Tools used: ${p.tools.join(', ')}`);
  const link = externalLink(p);
  lines.push(`- Link: ${link ?? 'none'}`);
  lines.push(`- Page: ${url(p.slug)}`);
  const out = [lines.join('\n'), '', p.synopsis];
  if (p.subtitle) out.splice(1, 0, '', `_${p.subtitle}_`);
  if (p.highlights?.length) out.push('', `${h} Highlights`, '', p.highlights.map((x) => `- ${x}`).join('\n'));
  if (p.productScope?.length) out.push('', `${h} Product scope (facts about the product, not the owner's work)`, '', p.productScope.map((x) => `- ${x}`).join('\n'));
  if (p.claims?.length) out.push('', `${h} Results`, '', p.claims.map((c) => `- ${c.text.charAt(0).toUpperCase()}${c.text.slice(1)} (owner-reported)`).join('\n'));
  return out.join('\n');
}

// ---------- robots.txt ----------
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// ---------- sitemap.xml ----------
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const indexable = (S.getAllRoutes()).filter((r) => getRouteMeta(r).robots !== 'noindex');
const lastmod = (r) => {
  if (r === '/' || r === '/projects') return S.CONTENT_UPDATED;
  if (r === '/arcade') return S.ARCADE_UPDATED;
  if (r === '/interview-framework') return S.INTERVIEW_UPDATED;
  return PROJECTS.find((p) => `/projects/${p.slug}` === r).updated;
};
const urls = indexable.map((r) => {
  const slug = r.startsWith('/projects/') ? r.slice('/projects/'.length) : null;
  const imgs = slug ? [heroImage(slug), ...fullPageImages(slug)].filter(Boolean) : [];
  return [
    '  <url>',
    `    <loc>${xml(SITE_URL + (r === '/' ? '/' : r))}</loc>`,
    `    <lastmod>${lastmod(r)}</lastmod>`,
    ...imgs.map((img) => `    <image:image><image:loc>${xml(img.url)}</image:loc></image:image>`),
    '  </url>',
  ].filter(Boolean).join('\n');
});
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>`,
);

// ---------- llms.txt ----------
const careerLine = [...EXPERIENCES].reverse().map((e) => `${e.role}${e.company === 'Self-Employed' || e.id === 'freelance' ? '' : ` at ${e.company}`} (${span(e)})`).join('; ');
const skillTitles = SKILL_BRANCHES.filter((b) => b.id !== 'learning-backend').map((b) => b.title).join(', ');
const learning = SKILL_BRANCHES.find((b) => b.id === 'learning-backend');
const learningNames = learning ? learning.nodes.map((n) => n.name).join(', ') : '';

const statusSuffix = (p) => {
  const text = p.seo.llmsSummary.toLowerCase();
  if (p.link.kind === 'private') return /private/.test(text) ? '' : '; private';
  if (p.link.kind === 'offline') return /shut down|shut-down|offline/.test(text) ? '' : '; shut down';
  return '';
};

const sections = CATEGORY_ORDER.map((cat) => {
  const items = PROJECTS.filter((p) => p.category === cat);
  if (!items.length) return '';
  const list = items
    .map((p) => `- [${p.title}](${url(p.slug)}): ${p.seo.llmsSummary.replace(/\.$/, '')}${statusSuffix(p)}`)
    .join('\n');
  return `## Projects: ${HEADING[cat]}\n\n${list}\n`;
}).filter(Boolean).join('\n');

const llms = `# ${PROFILE.name}

> ${summary}

This site is his portfolio. Every project below has its own page with a plain-language summary, his role, the tech stack and links. Results quoted on project pages are as stated by the owner. Private client work is described without naming the client or linking to it.

## About

- [Profile and quick facts](${SITE_URL}/#level-origin): role, experience since 2020, education (${PROFILE.education.degree}, ${PROFILE.education.school}, ${PROFILE.education.city}, ${PROFILE.education.year}), recognition ("Promising Newcomer" at ITH Technologies)
- [Career path](${SITE_URL}/#level-career): ${careerLine}
- [Skills](${SITE_URL}/#level-skills): ${skillTitles}${learningNames ? `; currently learning backend (${learningNames})` : ''}
- [Contact](${SITE_URL}/#level-contact): email ${PROFILE.email}, LinkedIn, GitHub

${sections}
## Optional

- [Full project archive](${SITE_URL}/projects), including an "Earlier work" list of older client sites and tools (${EARLIER_WORK.map((e) => e.name).join(', ')}) that are no longer online
- [Full text for language models](${SITE_URL}/llms-full.txt)
- [Frontend interview questions](${SITE_URL}/interview-framework)
- [Arcade](${SITE_URL}/arcade)
- [GitHub](${PROFILE.links.github})
- [LinkedIn](${PROFILE.links.linkedin})
`;
write('llms.txt', llms);

// ---------- llms-full.txt ----------
const career = [...EXPERIENCES].reverse().map((e) =>
  `### ${e.role}, ${e.company} (${span(e)})${e.location ? `\n\nLocation: ${e.location}` : ''}\n\n${e.details.map((d) => `- ${d}`).join('\n')}`,
).join('\n\n');
const skills = SKILL_BRANCHES.map((b) => {
  const names = b.nodes.map((n) => n.name).join(', ');
  const seen = b.evidence.map((e) => (e.startsWith('experience:') ? EXPERIENCES.find((x) => x.id === e.slice(11))?.company : PROJECTS.find((p) => p.slug === e)?.title)).filter(Boolean);
  return `- ${b.title}: ${names}${seen.length ? `. Seen in: ${seen.join(', ')}.` : ''}`;
}).join('\n');
const projectSections = PROJECTS.map((p) => `## ${p.title}\n\n${projectBody(p, 3)}`).join('\n\n');
const earlier = EARLIER_WORK.map((e) => `### ${e.name}\n\n${e.year} · ${e.context}. ${e.description}\n\nStack: ${e.stack.join(', ')}. No longer online.`).join('\n\n');
const date = S.CONTENT_UPDATED;
const full = `# ${PROFILE.name}

> ${summary}

## Quick facts

- Role: ${PROFILE.title}; currently ${PROFILE.currentRole}
- Location: ${PROFILE.location}
- Experience: 6+ years (since 2020)
- Education: ${PROFILE.education.degree}, ${PROFILE.education.school}, ${PROFILE.education.city}, ${PROFILE.education.year}
- Recognition: ${PROFILE.award}
- Focus: React, Next.js, Three.js / WebGL, Shopify, Web3
- Website: ${SITE_URL}/

## Profile

${PROFILE.summary.join('\n\n')}

## Career

${career}

## Skills

${skills}

# Projects

${countWord(PROJECTS.length)} projects. Results marked "owner-reported" are as stated by the owner. Private client work is described without naming the client.

${projectSections}

## Earlier work (out of print)

${earlier}

## Contact

- Email: ${PROFILE.email}
- LinkedIn: ${PROFILE.links.linkedin}
- GitHub: ${PROFILE.links.github}

Generated from the site's content files on ${date}.
`;
write('llms-full.txt', full);

// ---------- /projects/<slug>.md ----------
// Drop project .md files of projects that no longer exist (public/ is committed).
for (const f of readdirSync(join(pub, 'projects'))) {
  if (f.endsWith('.md') && !PROJECTS.some((p) => `${p.slug}.md` === f)) rmSync(join(pub, 'projects', f));
}
for (const p of PROJECTS) {
  write(`projects/${p.slug}.md`, `# ${p.title}\n\n${projectBody(p, 2)}\n\nBy ${PROFILE.name}: ${SITE_URL}/\n`);
}

// ---------- content guards ----------
const all = [llms, full, ...PROJECTS.map((p) => projectBody(p, 2))].join('\n');
const bad = [];
if (/\+91|\b\d{10}\b|9919/.test(all)) bad.push('phone-number pattern in generated text');
if (/Valerie|SkyAI/i.test(all)) bad.push('Valerie or SkyAI in generated text');
if (/ERC-?(721|1155)[^.]{0,40}\bon (Sui|Solana)/i.test(all)) bad.push('ERC standard claimed on Sui or Solana');
if (bad.length) {
  console.error(`gen-seo-files: FAILED: ${bad.join('; ')}`);
  process.exit(1);
}
console.log(`seo files: robots.txt, sitemap.xml (${indexable.length} urls), llms.txt, llms-full.txt, ${PROJECTS.length} project .md`);
