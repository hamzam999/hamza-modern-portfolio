// Build-time prerender (plan 9.6): renders every route with React's server renderer into dist/.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const templatePath = join(dist, 'index.html');
const savedTemplate = join(ssrDir, 'template.html');
let template = readFileSync(templatePath, 'utf8');
if (template.includes('<!--app-html-->')) writeFileSync(savedTemplate, template);
else if (existsSync(savedTemplate)) template = readFileSync(savedTemplate, 'utf8');
else throw new Error('dist/index.html is already prerendered and no template copy exists. Run the client build first.');

const manifest = JSON.parse(readFileSync(join(dist, '.vite', 'manifest.json'), 'utf8'));
const { render, getAllRoutes, getRouteMeta } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

/** Preload exactly the two above-the-fold fonts (plan 3.7). */
const fontFiles = Object.values(manifest)
  .map((e) => e.file)
  .filter((f) => /inter-tight-latin-600-normal-.*\.woff2$|newsreader-latin-400-normal-.*\.woff2$/.test(f));
const preloads = fontFiles.map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${f}">`);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headFor(meta) {
  const tags = [`<title>${esc(meta.title)}</title>`];
  if (meta.description) tags.push(`<meta name="description" content="${esc(meta.description)}">`);
  tags.push(`<meta name="robots" content="${meta.robots}">`);
  if (meta.canonical) tags.push(`<link rel="canonical" href="${esc(meta.canonical)}">`);
  return [...tags, ...preloads].join('\n    ');
}

const problems = [];
for (const route of getAllRoutes()) {
  const meta = getRouteMeta(route);
  const html = render(route);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (!/<main[\s>][\s\S]*?<\/main>/.test(html) || /<main[^>]*><\/main>/.test(html)) problems.push(`${route}: empty or missing <main>`);
  if (h1s !== 1) problems.push(`${route}: expected exactly one <h1>, found ${h1s}`);
  if (meta.title.length > 70) problems.push(`${route}: title is ${meta.title.length} characters (max 70)`);

  const page = template.replace('<!--app-head-->', headFor(meta)).replace('<!--app-html-->', html);
  const file = route === '/404' ? join(dist, '404.html') : route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  console.log(`prerendered ${route.padEnd(36)} ${(page.length / 1024).toFixed(1)} KB`);
}
if (problems.length) {
  console.error('\nPrerender checks failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
