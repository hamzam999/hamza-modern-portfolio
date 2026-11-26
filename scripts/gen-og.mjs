// Open Graph images (plan 9.9): satori (element tree to SVG) + resvg (SVG to PNG), written to dist/og/. Each PNG must stay under 300 KB.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import sharp from 'sharp';
import { projectCard, siteCard, halftoneUrdu } from './og/templates.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const S = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href);
const { PROJECTS, CATEGORY_LABEL, heroImage } = S;
const URDU = JSON.parse(readFileSync(join(root, 'scripts/og/urdu-paths.json'), 'utf8'));
const favicon = readFileSync(join(root, 'public/favicon.svg'));
const logo = `data:image/svg+xml;base64,${favicon.toString('base64')}`;

const font = (pkg, file) => readFileSync(join(root, 'node_modules/@fontsource', pkg, 'files', file));
const fonts = [
  { name: 'Inter Tight', data: font('inter-tight', 'inter-tight-latin-600-normal.woff'), weight: 600, style: 'normal' },
  { name: 'Newsreader', data: font('newsreader', 'newsreader-latin-400-normal.woff'), weight: 400, style: 'normal' },
];

const MAX = 300 * 1024;
mkdirSync(join(dist, 'og', 'projects'), { recursive: true });

async function emit(rel, tree) {
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  let png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  if (png.length > MAX) png = await sharp(png).png({ palette: true, quality: 80, compressionLevel: 9 }).toBuffer();
  if (png.length > MAX) throw new Error(`${rel} is ${(png.length / 1024).toFixed(0)} KB (max 300)`);
  writeFileSync(join(dist, 'og', rel), png);
  return png.length;
}

const urdu = (word) => {
  if (!URDU[word]) throw new Error(`no shaped outline for ${word}; run npm run urdu`);
  return halftoneUrdu(URDU[word], 230);
};
const sizes = [];
const site = [
  ['default.png', { title: 'Mohammad Hamza', line: 'Senior Frontend Engineer', focus: 'React · Next.js · Three.js · Shopify · Web3', urdu: urdu('آغاز'), logo }],
  ['projects.png', { title: 'Project archive', line: 'Selected work by Mohammad Hamza', focus: 'Shopify · Web3 · 3D · Full-stack', urdu: urdu('کام'), logo }],
  ['arcade.png', { title: 'Arcade: Reel Pong', line: 'A small Pong game on this portfolio', focus: 'First to five wins', urdu: urdu('کھیل'), logo }],
  ['interview.png', { title: 'Frontend interview questions', line: 'JavaScript, React and Next.js', focus: 'Short answers, searchable', urdu: urdu('ہنر'), logo }],
];
for (const [file, props] of site) sizes.push([file, await emit(file, siteCard(props))]);

for (const p of PROJECTS) {
  const hero = heroImage(p.slug);
  let imageUri = null;
  const src = hero ? join(dist, hero.path) : null;
  if (src && existsSync(src)) {
    const buf = await sharp(src).resize(600, 630, { fit: 'cover', position: 'north' }).png({ palette: true }).toBuffer();
    imageUri = `data:image/png;base64,${buf.toString('base64')}`;
  }
  const summary = p.seo.llmsSummary.length > 120 ? `${p.seo.llmsSummary.slice(0, 117).replace(/\s+\S*$/, '')}…` : p.seo.llmsSummary;
  const tree = projectCard({ eyebrow: CATEGORY_LABEL[p.category], title: p.title, summary, imageUri, swatch: p.spine, spine: p.spineTitle, logo });
  sizes.push([`projects/${p.slug}.png`, await emit(`projects/${p.slug}.png`, tree)]);
}
const total = sizes.reduce((n, [, s]) => n + s, 0);
console.log(`og images: ${sizes.length} written to dist/og (largest ${(Math.max(...sizes.map(([, s]) => s)) / 1024).toFixed(0)} KB, total ${(total / 1024).toFixed(0)} KB)`);
