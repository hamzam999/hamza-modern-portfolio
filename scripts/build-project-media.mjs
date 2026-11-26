// Project media pipeline (plan 6.11). Run: `npm run media [-- --strict]`.
// media-src/projects/<slug>/screenshot.(png|jpg|webp) [+ mobile.*]  ->  public/projects/<slug>/*.avif|webp
// and src/content/media-manifest.json. Missing sources are reported and skipped (exit 0 unless --strict).
import sharp from 'sharp';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'media-src/projects');
const OUT = path.join(ROOT, 'public/projects');
const MANIFEST = path.join(ROOT, 'src/content/media-manifest.json');
const strict = process.argv.includes('--strict');

const HERO_W = [640, 1280, 1920];
const COVER_W = [300, 600];
const MOBILE_W = [390, 780];
const COVER_ASPECT = 0.823;
const HERO_ASPECT = 1.6;

/** Duotone ramps by spine swatch (plan 6.11 table). */
const DUOTONE = {
  cobalt: ['#1F3FB0', '#ECE8E0'],
  ink: ['#141414', '#ECE8E0'],
  graphite: ['#2A2A2A', '#F3F0EA'],
  paper: ['#1F3FB0', '#F3F0EA'],
};
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = ([r, g, b]) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

/** Reads slug, spine and media.focal from src/content/projects.ts without a build step. */
async function loadProjects() {
  const code = readFileSync(path.join(ROOT, 'src/content/projects.ts'), 'utf8');
  const js = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  return mod.PROJECTS.map((p) => ({ slug: p.slug, spine: p.spine, focal: p.media?.focal ?? { x: 0.5, y: 0.3 }, alt: p.media?.alt, altStatus: p.media?.altStatus }));
}

function findSource(slug, base) {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = path.join(SRC, slug, `${base}.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

const sha1 = (...files) => {
  const h = createHash('sha1');
  for (const f of files) if (f) h.update(readFileSync(f));
  return h.digest('hex');
};

async function writePair(img, file) {
  await img.clone().avif({ quality: 55, effort: 6 }).toFile(`${file}.avif`);
  await img.clone().webp({ quality: 78 }).toFile(`${file}.webp`);
}

/** Crops an aspect-ratio window of `region` (a Buffer) around the focal point. */
async function cropAspect(input, aspect, focal) {
  const { width: w, height: h } = await sharp(input).metadata();
  let cw = w;
  let ch = Math.round(w / aspect);
  if (ch > h) {
    ch = h;
    cw = Math.round(h * aspect);
  }
  const left = Math.max(0, Math.min(w - cw, Math.round(focal.x * w - cw / 2)));
  const top = Math.max(0, Math.min(h - ch, Math.round(focal.y * h - ch / 2)));
  return sharp(input).extract({ left, top, width: cw, height: ch });
}

async function duotone(img, [shadow, highlight], width) {
  const { data, info } = await img
    .clone()
    .resize({ width, height: Math.round(width / COVER_ASPECT), fit: 'cover' })
    .grayscale()
    .linear(1.15, -12)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [sr, sg, sb] = rgb(shadow);
  const [hr, hg, hb] = rgb(highlight);
  const out = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 3) {
    const l = data[i] / 255;
    out[j] = sr + (hr - sr) * l;
    out[j + 1] = sg + (hg - sg) * l;
    out[j + 2] = sb + (hb - sb) * l;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } });
}

async function main() {
  const projects = await loadProjects();
  const old = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
  const manifest = {};
  const missing = [];
  const warnings = [];

  for (const p of projects) {
    const shot = findSource(p.slug, 'screenshot');
    if (!shot) {
      missing.push(p.slug);
      continue;
    }
    const mobileSrc = findSource(p.slug, 'mobile');
    const hash = sha1(shot, mobileSrc);
    const dir = path.join(OUT, p.slug);
    const prev = old[p.slug];
    if (prev?.sourceHash === hash && existsSync(path.join(dir, 'cover-300.webp'))) {
      manifest[p.slug] = prev;
      continue;
    }
    mkdirSync(dir, { recursive: true });
    const meta = await sharp(shot).metadata();
    if ((meta.width ?? 0) < 1920) warnings.push(`${p.slug}: screenshot is ${meta.width}px wide (spec minimum 1920)`);
    if (p.altStatus === 'placeholder') warnings.push(`${p.slug}: media.alt is still a placeholder`);

    // Hero: 16:10 from the top of the capture (full-page captures are taller than 16:10), never upscaled.
    const heroBase = await (await cropAspect(shot, HERO_ASPECT, { x: 0.5, y: 0 })).png().toBuffer();
    const heroW = HERO_W.filter((w) => w <= (meta.width ?? 0));
    if (heroW.length === 0) heroW.push(Math.min(...HERO_W));
    for (const w of heroW) {
      await writePair(sharp(heroBase).resize({ width: w, withoutEnlargement: true }), path.join(dir, `hero-${w}`));
    }

    // Cover art: portrait crop of mobile.* when present, otherwise of the 16:10 hero crop, around media.focal.
    const coverBase = mobileSrc ? mobileSrc : heroBase;
    const cropped = await cropAspect(coverBase, COVER_ASPECT, p.focal);
    const croppedBuf = await cropped.png().toBuffer();
    const ramp = DUOTONE[p.spine] ?? DUOTONE.ink;
    for (const w of COVER_W) await writePair(await duotone(sharp(croppedBuf), ramp, w), path.join(dir, `cover-${w}`));

    let mobile = null;
    if (mobileSrc) {
      for (const w of MOBILE_W) await writePair(sharp(mobileSrc).resize({ width: w, withoutEnlargement: true }), path.join(dir, `mobile-${w}`));
      mobile = { widths: MOBILE_W };
    }

    const stats = await sharp(heroBase).resize(64).stats();
    manifest[p.slug] = {
      hero: { widths: heroW, ratio: HERO_ASPECT },
      cover: { widths: COVER_W },
      mobile,
      dominant: toHex([stats.dominant.r, stats.dominant.g, stats.dominant.b]),
      sourceHash: hash,
    };
    console.log(`media: ${p.slug} done`);
  }

  // Remove generated output for slugs that no longer have a source (e.g. moved to media-src/_unverified).
  if (existsSync(OUT)) {
    for (const d of readdirSync(OUT, { withFileTypes: true })) {
      if (d.isDirectory() && !manifest[d.name]) rmSync(path.join(OUT, d.name), { recursive: true, force: true });
    }
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);

  for (const w of warnings) console.warn(`media warning: ${w}`);
  if (missing.length) {
    console.warn(`\nmedia: ${missing.length} of ${projects.length} projects have no screenshot (PosterFallback is shown):`);
    for (const slug of missing) console.warn(`  - media-src/projects/${slug}/screenshot.png`);
  }
  console.log(`media: manifest has ${Object.keys(sorted).length} entries`);
  if (strict && missing.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
