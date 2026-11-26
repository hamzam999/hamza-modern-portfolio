// Media pipeline (plan 6.11, round 2). Run: `npm run media [-- --strict]`.
// media-src/projects/<slug>/desktop-full.(png|webp|jpg) [+ mobile-full.*]  (written by `npm run shots:projects`; legacy screenshot.* still read)
//   ->  public/projects/<slug>/hero-*.avif|webp (16:10 top crop of the desktop capture), cover-*.avif|webp (duotone, top crop of the mobile capture),
//       print-360/720.webp (hero collage), full-desktop.webp / full-mobile.webp (capped full-page layouts for the project page, see FULL below)
//   and src/content/media-manifest.json. Missing sources are reported and skipped (exit 0 unless --strict).
// media-src/archive/<name>.png (the owner's earlier work)           ->  public/archive/<name>-360|720.webp, src/content/archive-media.json
// media-src/profile/hamza.(jpg|png|webp) (optional portrait)        ->  public/profile/portrait-480|800.webp (duotone), src/content/profile-media.json
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
const PRINT_W = [360, 720];
const PRINT_ASPECT = 4 / 3;
const ARCHIVE_SRC = path.join(ROOT, 'media-src/archive');
const ARCHIVE_OUT = path.join(ROOT, 'public/archive');
const ARCHIVE_MANIFEST = path.join(ROOT, 'src/content/archive-media.json');
const ARCHIVE_W = [360, 720];
const ARCHIVE_ASPECT = 0.8;
const PROFILE_SRC = path.join(ROOT, 'media-src/profile');
const PROFILE_OUT = path.join(ROOT, 'public/profile');
const PROFILE_MANIFEST = path.join(ROOT, 'src/content/profile-media.json');
const PROFILE_W = [480, 800];
const PROFILE_ASPECT = 0.8;
const HERO_ASPECT = 1.6;
// Full-page layouts shown inside the browser and phone frames on project pages. Source heights are capped (the frame says "Continues on the live site"),
// then resized to the delivered width and encoded at the highest WebP quality that fits the byte budget (WebP max side is 16383 px).
const FULL = {
  desktop: { cssWidth: 1440, capCssHeight: 7000, outWidth: 1200, budget: 350 * 1024, file: 'full-desktop.webp' },
  mobile: { cssWidth: 390, capCssHeight: 9000, outWidth: 585, budget: 300 * 1024, file: 'full-mobile.webp' },
};
const PIPELINE = 'v5-green-accent';

/** Duotone ramps by spine swatch (plan 6.11 table). */
const DUOTONE = {
  accent: ['#17603F', '#ECE8E0'],
  ink: ['#141414', '#ECE8E0'],
  graphite: ['#2A2A2A', '#F3F0EA'],
  paper: ['#17603F', '#F3F0EA'],
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
  h.update(PIPELINE);
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

/** Capped, resized full-page layout. Returns { file, width, height, cropped, bytes, quality }. */
async function fullPage(src, cfg, dir, warnings, slug) {
  const meta = await sharp(src, { limitInputPixels: false }).metadata();
  const scaleSrc = meta.width / cfg.cssWidth;
  const capSrc = Math.round(cfg.capCssHeight * scaleSrc);
  const cropped = meta.height > capSrc;
  const srcH = Math.min(meta.height, capSrc);
  let w = Math.min(cfg.outWidth, meta.width);
  let h = Math.round((srcH * w) / meta.width);
  const encode = async (width) => {
    const height = Math.round((srcH * width) / meta.width);
    const base = await sharp(src, { limitInputPixels: false }).extract({ left: 0, top: 0, width: meta.width, height: srcH }).resize({ width, height, kernel: 'lanczos3' }).toBuffer();
    let q = 80;
    let out = await sharp(base).webp({ quality: q, effort: 5, smartSubsample: true }).toBuffer();
    while (out.length > cfg.budget && q > 50) {
      q -= 6;
      out = await sharp(base).webp({ quality: q, effort: 5, smartSubsample: true }).toBuffer();
    }
    return { out, q, height };
  };
  // Quality never drops below 50; very noisy pages (particle fields) shrink in width instead, in 8% steps down to 70% of the target.
  let r = await encode(w);
  while (r.out.length > cfg.budget && w > cfg.outWidth * 0.7) {
    w = Math.round(w * 0.92);
    r = await encode(w);
  }
  h = r.height;
  const buf = r.out;
  const q = r.q;
  if (buf.length > cfg.budget) warnings.push(`${slug}/${cfg.file}: ${Math.round(buf.length / 1024)} KB at ${w}px / quality ${q} is over the ${Math.round(cfg.budget / 1024)} KB budget`);
  writeFileSync(path.join(dir, cfg.file), buf);
  return { file: cfg.file, width: w, height: h, cropped, bytes: buf.length, quality: q };
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

/** Earlier-work screenshots become small framed prints: 4:5 from the top-left of the capture, color kept, webp only. */
async function archivePrints(warnings) {
  const manifest = {};
  if (existsSync(ARCHIVE_SRC)) {
    mkdirSync(ARCHIVE_OUT, { recursive: true });
    for (const f of readdirSync(ARCHIVE_SRC).filter((x) => /\.(png|jpe?g|webp)$/i.test(x)).sort()) {
      const name = f.replace(/\.[^.]+$/, '');
      const file = path.join(ARCHIVE_SRC, f);
      const hash = sha1(file);
      const base = sharp(file);
      const meta = await base.metadata();
      for (const w of ARCHIVE_W) {
        await sharp(file).resize({ width: w, height: Math.round(w / ARCHIVE_ASPECT), fit: 'cover', position: 'left top' }).webp({ quality: 72 }).toFile(path.join(ARCHIVE_OUT, `${name}-${w}.webp`));
      }
      if ((meta.width ?? 0) < 720) warnings.push(`archive/${name}: source is narrower than 720 px`);
      manifest[name] = { widths: ARCHIVE_W, ratio: ARCHIVE_ASPECT, sourceHash: hash };
    }
  }
  writeFileSync(ARCHIVE_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`media: archive prints ${Object.keys(manifest).length}`);
}

/** Optional owner portrait: duotone (ink to paper) so it sits with the print look. Absent source writes { portrait: null } and the page shows the stamp placeholder. */
async function profilePortrait(warnings) {
  let src = null;
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const p = path.join(PROFILE_SRC, `hamza.${ext}`);
    if (existsSync(p)) src = p;
  }
  if (!src) {
    rmSync(PROFILE_OUT, { recursive: true, force: true });
    writeFileSync(PROFILE_MANIFEST, `${JSON.stringify({ portrait: null }, null, 2)}\n`);
    console.log('media: no media-src/profile/hamza.(jpg|png|webp), the stamp placeholder is shown');
    return;
  }
  mkdirSync(PROFILE_OUT, { recursive: true });
  const meta = await sharp(src).metadata();
  if ((meta.width ?? 0) < 800) warnings.push(`profile: portrait is ${meta.width}px wide (800 recommended)`);
  const oriented = await sharp(src).rotate().toBuffer();
  const sizes = [];
  for (const w of PROFILE_W) {
    const { data, info } = await sharp(oriented).resize({ width: w, height: Math.round(w / PROFILE_ASPECT), fit: 'cover', position: 'attention' }).grayscale().normalise().raw().toBuffer({ resolveWithObject: true });
    const [sr, sg, sb] = rgb('#10261C');
    const [hr, hg, hb] = rgb('#F3F0EA');
    const out = Buffer.alloc(info.width * info.height * 3);
    for (let i = 0, j = 0; i < data.length; i += info.channels, j += 3) {
      const l = data[i] / 255;
      out[j] = sr + (hr - sr) * l; out[j + 1] = sg + (hg - sg) * l; out[j + 2] = sb + (hb - sb) * l;
    }
    await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 78 }).toFile(path.join(PROFILE_OUT, `portrait-${w}.webp`));
    sizes.push(w);
  }
  writeFileSync(PROFILE_MANIFEST, `${JSON.stringify({ portrait: { widths: sizes, ratio: PROFILE_ASPECT, sourceHash: sha1(src) } }, null, 2)}\n`);
  console.log(`media: portrait ${sizes.join(', ')}`);
}

async function main() {
  const projects = await loadProjects();
  const old = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
  const manifest = {};
  const missing = [];
  const warnings = [];

  for (const p of projects) {
    const shot = findSource(p.slug, 'desktop-full') ?? findSource(p.slug, 'screenshot');
    if (!shot) {
      missing.push(p.slug);
      continue;
    }
    const mobileSrc = findSource(p.slug, 'mobile-full') ?? findSource(p.slug, 'mobile');
    const hash = sha1(shot, mobileSrc);
    const dir = path.join(OUT, p.slug);
    const prev = old[p.slug];
    if (prev?.sourceHash === hash && existsSync(path.join(dir, 'cover-300.webp')) && existsSync(path.join(dir, 'print-360.webp')) && (!prev.full || Object.values(prev.full).every((f) => existsSync(path.join(dir, f.file))))) {
      manifest[p.slug] = prev;
      continue;
    }
    mkdirSync(dir, { recursive: true });
    const meta = await sharp(shot).metadata();
    if ((meta.width ?? 0) < 1280) warnings.push(`${p.slug}: capture is ${meta.width}px wide (heroes need at least 1280)`);
    if (p.altStatus === 'placeholder') warnings.push(`${p.slug}: media.alt is still a placeholder`);

    // Hero: 16:10 from the top of the capture (full-page captures are taller than 16:10), never upscaled.
    const heroBase = await (await cropAspect(shot, HERO_ASPECT, { x: 0.5, y: 0 })).png().toBuffer();
    const heroW = HERO_W.filter((w) => w <= (meta.width ?? 0));
    if (heroW.length === 0) heroW.push(Math.min(...HERO_W));
    for (const w of heroW) {
      await writePair(sharp(heroBase).resize({ width: w, withoutEnlargement: true }), path.join(dir, `hero-${w}`));
    }

    // Collage print (hero): 4:3 from the top of the capture, webp only.
    for (const w of PRINT_W.filter((x) => x <= (meta.width ?? 0))) {
      await sharp(heroBase).resize({ width: Math.round(w), height: Math.round(w / PRINT_ASPECT), fit: 'cover', position: 'top' }).webp({ quality: 74 }).toFile(path.join(dir, `print-${w}.webp`));
    }

    // Cover art: portrait crop of mobile.* when present, otherwise of the 16:10 hero crop, around media.focal.
    const coverBase = mobileSrc ? mobileSrc : heroBase;
    const cropped = await cropAspect(coverBase, COVER_ASPECT, mobileSrc ? { x: 0.5, y: 0 } : p.focal); // full-page mobile captures: top of the page
    const croppedBuf = await cropped.png().toBuffer();
    const ramp = DUOTONE[p.spine] ?? DUOTONE.ink;
    for (const w of COVER_W) await writePair(await duotone(sharp(croppedBuf), ramp, w), path.join(dir, `cover-${w}`));

    const full = {};
    if (path.basename(shot).startsWith('desktop-full')) full.desktop = await fullPage(shot, FULL.desktop, dir, warnings, p.slug);
    if (mobileSrc && path.basename(mobileSrc).startsWith('mobile-full')) full.mobile = await fullPage(mobileSrc, FULL.mobile, dir, warnings, p.slug);
    // Old generated names from earlier pipeline versions.
    for (const old of ['mobile-390', 'mobile-780']) for (const e of ['avif', 'webp']) rmSync(path.join(dir, `${old}.${e}`), { force: true });

    const stats = await sharp(heroBase).resize(64).stats();
    manifest[p.slug] = {
      hero: { widths: heroW, ratio: HERO_ASPECT },
      print: { widths: PRINT_W },
      cover: { widths: COVER_W },
      full: Object.keys(full).length ? full : null,
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

  await archivePrints(warnings);
  await profilePortrait(warnings);

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);

  for (const w of warnings) console.warn(`media warning: ${w}`);
  if (missing.length) {
    console.warn(`\nmedia: ${missing.length} of ${projects.length} projects have no screenshot (PosterFallback is shown):`);
    for (const slug of missing) console.warn(`  - media-src/projects/${slug}/desktop-full.png (npm run shots:projects)`);
  }
  console.log(`media: manifest has ${Object.keys(sorted).length} entries`);
  if (strict && missing.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
