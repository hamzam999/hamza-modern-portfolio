// Byte budgets (plan 9.10) read from dist/.vite/manifest.json. Run after a build: `npm run budgets`.
// P3 creates the script with the JS, CSS and shelf-chunk budgets; later phases extend it (arcade chunk, fonts, SEO checks).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const KB = 1024;
const BUDGET = { initialJs: 110 * KB, shelf: 18 * KB, sheet: 14 * KB, arcade: 14 * KB, css: 34 * KB, fonts: 5, images: 3400 * KB, fullDesktop: 350 * KB, fullMobile: 300 * KB, fullTotal: 7000 * KB, heroPrint: 64 * KB, urduFont: 80 * KB };

const manifestPath = path.join(DIST, '.vite/manifest.json');
if (!existsSync(manifestPath)) {
  console.error('budgets: dist/.vite/manifest.json not found. Run a build first.');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const walkAll = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walkAll(path.join(dir, d.name)) : [path.join(dir, d.name)]));
const gz = (file) => gzipSync(readFileSync(path.join(DIST, file))).length;
const fail = [];
const rows = [];
const check = (name, size, limit) => {
  rows.push(`${size <= limit ? 'ok  ' : 'FAIL'} ${name.padEnd(34)} ${(size / KB).toFixed(1).padStart(7)} KB / ${(limit / KB).toFixed(0)} KB`);
  if (size > limit) fail.push(name);
};

// Initial JS: the entry chunk plus everything it imports statically.
const entry = Object.values(manifest).find((c) => c.isEntry);
const seen = new Set();
const walk = (key) => {
  if (seen.has(key) || !manifest[key]) return;
  seen.add(key);
  (manifest[key].imports ?? []).forEach(walk);
};
const entryKey = Object.keys(manifest).find((k) => manifest[k] === entry);
if (entryKey) walk(entryKey);
check('initial JS for /', [...seen].reduce((n, k) => n + gz(manifest[k].file), 0), BUDGET.initialJs);

// Lazy chunks by source file.
const chunkOf = (needle) => Object.values(manifest).find((c) => c.isDynamicEntry && c.src?.includes(needle));
const shelf = chunkOf('components/shelf/Shelf.tsx');
if (shelf) check('shelf chunk', gz(shelf.file), BUDGET.shelf);
else fail.push('shelf chunk missing from the manifest');
const sheet = chunkOf('components/shelf/DetailSheet.tsx');
if (sheet) check('detail sheet chunk', gz(sheet.file), BUDGET.sheet);
const arcade = chunkOf('routes/Arcade');
if (arcade) check('arcade chunk', gz(arcade.file), BUDGET.arcade);

// CSS total.
const assets = path.join(DIST, 'assets');
const css = readdirSync(assets).filter((f) => f.endsWith('.css'));
check('CSS total', css.reduce((n, f) => n + gz(`assets/${f}`), 0), BUDGET.css);

// Fonts on first view (9.10): preloaded fonts of the home page, at most 5 files and 150 KB; first-view transfer at most 450 KB (gzip HTML, JS, CSS and those fonts).
{
  const html = readFileSync(path.join(DIST, 'index.html'), 'utf8');
  const preloaded = [...html.matchAll(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/g)].map((m) => /href="([^"]+)"/.exec(m[0])?.[1]).filter(Boolean);
  const fontBytes = preloaded.reduce((n, href) => n + readFileSync(path.join(DIST, href.replace(/^\//, ''))).length, 0);
  {
    const ok = preloaded.length <= BUDGET.fonts;
    rows.push(`${ok ? 'ok  ' : 'FAIL'} ${'first-view font files (count)'.padEnd(34)} ${String(preloaded.length).padStart(7)} files / ${BUDGET.fonts} files`);
    if (!ok) fail.push('first-view font files (count)');
  }
  check('first-view font bytes', fontBytes, 150 * KB);
  const htmlGz = gzipSync(readFileSync(path.join(DIST, 'index.html'))).length;
  const jsGz = [...seen].reduce((n, k) => n + gz(manifest[k].file), 0);
  const cssGz = css.reduce((n, f) => n + gz(`assets/${f}`), 0);
  check('first-view transfer for /', htmlGz + jsGz + cssGz + fontBytes, 450 * KB);
}

// Urdu font (round 2): content-hashed subset referenced by fonts.css must exist in dist and stay small.
{
  const css = readFileSync(path.join(ROOT, 'src/styles/fonts.css'), 'utf8');
  const m = /\/fonts\/(noto-nastaliq-urdu-700-subset\.[0-9a-f]{8}\.woff2)/.exec(css);
  if (!m) fail.push('fonts.css has no content-hashed Urdu font');
  else if (!existsSync(path.join(DIST, 'fonts', m[1]))) fail.push(`dist/fonts/${m[1]} missing (run npm run urdu)`);
  else check('Urdu font (woff2)', readFileSync(path.join(DIST, 'fonts', m[1])).length, BUDGET.urduFont);
}

// Images. Round 2: everything the home page and the shelf can reach (heroes, covers, prints, archive, profile, art) stays under one cap, 3400 KB since round 3
// (11 projects now have captures: about 280 KB of hero avif+webp and 100 KB of covers and prints each; the home view only loads the covers and three prints, see first-view transfer).
// Round 3: the full-page layouts (full-desktop.webp / full-mobile.webp) are tall images that only project pages and the detail sheet load
// (lazy, inside a scrolling frame), so they get their own caps: 350 KB per desktop image, 300 KB per mobile image and a total for all of them.
// They never count toward the home-view budgets; the first-view transfer check above stays at 450 KB.
{
  const IMG = /\.(webp|avif|png|jpe?g|svg)$/;
  const all = ['projects', 'archive', 'profile', 'art'].flatMap((d) => (existsSync(path.join(DIST, d)) ? walkAll(path.join(DIST, d)) : [])).filter((f) => IMG.test(f));
  const isFull = (f) => /full-(desktop|mobile)\.webp$/.test(f);
  const shared = all.filter((f) => !isFull(f));
  const fulls = all.filter(isFull);
  check('images total (home-reachable)', shared.reduce((n, f) => n + readFileSync(f).length, 0), BUDGET.images);
  const prints = all.filter((f) => /print-\d+\.webp$/.test(f));
  check('largest hero print', Math.max(0, ...prints.map((f) => readFileSync(f).length)), BUDGET.heroPrint);
  check('largest full-page desktop image', Math.max(0, ...fulls.filter((f) => f.endsWith('full-desktop.webp')).map((f) => readFileSync(f).length)), BUDGET.fullDesktop);
  check('largest full-page mobile image', Math.max(0, ...fulls.filter((f) => f.endsWith('full-mobile.webp')).map((f) => readFileSync(f).length)), BUDGET.fullMobile);
  check('full-page layouts total (project pages)', fulls.reduce((n, f) => n + readFileSync(f).length, 0), BUDGET.fullTotal);
  // The home page HTML must not reference a full-page image.
  const homeHtml = readFileSync(path.join(DIST, 'index.html'), 'utf8');
  if (/full-(desktop|mobile)\.webp/.test(homeHtml)) fail.push('home page references a full-page layout image');
}

// Test hooks must not ship in a production build (the e2e build has the testHooks chunk).
const e2e = readdirSync(assets).some((f) => f.startsWith('testHooks'));
if (!e2e && readdirSync(assets).some((f) => f.endsWith('.js') && readFileSync(path.join(assets, f), 'utf8').includes('__aq'))) fail.push('__aq test hooks found in a production build');

// SEO and content guards (plan 9.7, Phase 5): no phone number, no removed projects, required generated files.
const TEXT = /\.(html|txt|xml|md|json|js|css|svg|webmanifest)$/;
const walkDist = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walkDist(path.join(dir, d.name)) : [path.join(dir, d.name)]));
const files = walkDist(DIST);
for (const f of files.filter((x) => TEXT.test(x))) {
  const text = readFileSync(f, 'utf8');
  const rel = path.relative(DIST, f);
  if (/\+91|9919/.test(text)) fail.push(`phone-number pattern (+91 or 9919) in dist/${rel}`);
  if (/Valerie|SkyAI/i.test(text)) fail.push(`removed project name in dist/${rel}`);
  if (/[\u3000-\u30ff\u4e00-\u9fff\uff00-\uffef]/.test(text)) fail.push(`Japanese or CJK character in dist/${rel}`);
  if (/Final Boss|boss defeated/i.test(text)) fail.push(`old level name in dist/${rel}`);
}
for (const f of ['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', 'og/default.png', 'og/projects.png', 'og/arcade.png', 'og/interview.png', '404.html', 'favicon.svg', 'apple-touch-icon.png', 'icon-512.png']) {
  if (!existsSync(path.join(DIST, f))) fail.push(`dist/${f} missing`);
}
for (const f of files.filter((x) => x.includes(`${path.sep}og${path.sep}`) && x.endsWith('.png'))) {
  if (readFileSync(f).length > 300 * KB) fail.push(`OG image over 300 KB: ${path.relative(DIST, f)}`);
}

console.log(rows.join('\n'));
if (fail.length) {
  console.error(`\nbudgets: FAILED: ${fail.join('; ')}`);
  process.exit(1);
}
console.log(`budgets: all within limits${e2e ? ' (e2e build: hook check skipped)' : ''}`);
