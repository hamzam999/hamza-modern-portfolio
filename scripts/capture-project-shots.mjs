// Full-page captures of the owner's own live sites. Run: `npm run shots:projects [-- slug ...] [--force]`
// Reads every project with link.kind === 'live' from src/content/projects.ts and writes
//   media-src/projects/<slug>/desktop-full.png  (1440x900, dpr 1)
//   media-src/projects/<slug>/mobile-full.png   (390x844, dpr 2, touch)
// Idempotent: existing captures are skipped unless --force. Polite: one site at a time, pauses between loads.
// Needs Chromium: set CHROMIUM_PATH or the default /opt/pw-browsers path is used. No logins, forms or purchases.
import { chromium } from '@playwright/test';
import ts from 'typescript';
import { existsSync, mkdirSync, readFileSync, statSync, readdirSync, renameSync, rmSync } from 'node:fs';
import sharp from 'sharp';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'media-src/projects');
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VARIANTS = {
  desktop: {
    file: 'desktop-full.png',
    context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  },
  mobile: {
    file: 'mobile-full.png',
    context: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    },
  },
};

/** Per-slug tweaks: extra wait for WebGL, selectors to hide. */
const TWEAKS = {
  // Scroll-driven WebGL site: content only exists while its section is pinned in view, so a plain full-page shot is mostly black.
  // `stitch` scrolls one viewport at a time and joins the viewport shots, which is what a visitor sees.
  navig: { extraWait: 6000, stitch: true, stepWait: 1500, motion: true },
  // Shopify theme with lazy sections: slower scroll and lazy images forced to load.
  lammles: { slow: true },
};
// Reduced motion is emulated by default (many sites then show reveal content at once); --reveal forces leftover hidden reveals visible.
const REDUCED = !args.includes('--motion'); // default: prefers-reduced-motion on (sites then render reveal content without scroll animation); --motion turns it off
const REVEAL = args.includes('--reveal');

const HIDE_CSS = `
  [id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],[class*="gdpr" i],[id*="gdpr" i],
  [class*="newsletter-popup" i],[class*="popup" i],[class*="modal-overlay" i],
  iframe[src*="tawk" i],iframe[src*="crisp" i],iframe[src*="intercom" i],#tidio-chat,#hubspot-messages-iframe-container,
  [class*="chat-widget" i],[id*="chat-widget" i],#CybotCookiebotDialog,#onetrust-banner-sdk,.cc-window,.cky-consent-container { display: none !important; }
`;
const FREEZE_CSS = `*,*::before,*::after{animation-play-state:paused !important;scroll-behavior:auto !important;}`;

async function loadLive() {
  const code = readFileSync(path.join(ROOT, 'src/content/projects.ts'), 'utf8');
  const js = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  return mod.PROJECTS.filter((p) => p.link?.kind === 'live').map((p) => ({ slug: p.slug, url: p.link.url }));
}

const MAX_RAW = 6 * 1024 * 1024;
/** Raw captures over ~6 MB are re-encoded: 256-colour PNG first, then JPEG q90 (WebP cannot hold more than 16383 px of height). */
async function compact(file) {
  if (statSync(file).size <= MAX_RAW) return file;
  const tmp = `${file}.tmp`;
  await sharp(file, { limitInputPixels: false }).png({ palette: true, quality: 92, colours: 256, effort: 8, dither: 0.6 }).toFile(tmp);
  if (statSync(tmp).size <= MAX_RAW) {
    renameSync(tmp, file);
    return file;
  }
  const jpg = file.replace(/\.png$/, '.jpg');
  await sharp(file, { limitInputPixels: false }).jpeg({ quality: 90, mozjpeg: true }).toFile(jpg);
  rmSync(tmp, { force: true });
  rmSync(file);
  return jpg;
}

async function dismiss(page) {
  const labels = /^(accept( all)?( cookies)?|allow( all)?|agree|i agree|got it|ok(ay)?|continue|close|no thanks|dismiss|reject all|decline)$/i;
  try {
    const buttons = page.locator('button, a[role="button"], [role="button"]');
    const n = Math.min(await buttons.count(), 80);
    for (let i = 0; i < n; i++) {
      const b = buttons.nth(i);
      const t = ((await b.innerText({ timeout: 300 }).catch(() => '')) || '').trim();
      if (t && t.length < 24 && labels.test(t) && (await b.isVisible().catch(() => false))) {
        const inBanner = await b.evaluate((el) => {
          const r = el.closest('[class*="cookie" i],[id*="cookie" i],[class*="consent" i],[class*="banner" i],[role="dialog"],[class*="modal" i],[class*="popup" i]');
          return !!r;
        });
        if (inBanner) await b.click({ timeout: 800 }).catch(() => {});
      }
    }
  } catch {}
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
}

async function scrollThrough(page, vh, tweak) {
  if (tweak?.slow) await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => i.setAttribute('loading', 'eager')));
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.round(vh * (tweak?.slow ? 0.35 : 0.6));
  let y = 0;
  let guard = 0;
  while (y < total + vh && guard++ < 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(tweak?.slow ? 450 : 180);
    y += step;
  }
  await sleep(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
}

/** Viewport-by-viewport capture joined into one tall image (see TWEAKS.stitch). */
async function stitched(page, file, variant, tweak) {
  const { height: vh } = variant.context.viewport;
  const dpr = variant.context.deviceScaleFactor;
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const parts = [];
  let done = 0;
  while (done < total) {
    await page.evaluate((v) => window.scrollTo(0, v), done);
    await sleep(tweak.stepWait ?? 800);
    const y = await page.evaluate(() => Math.round(window.scrollY));
    const shot = await page.screenshot({ fullPage: false });
    const skip = Math.max(0, done - y); // the last slice overlaps when the page cannot scroll further
    const h = Math.min(vh - skip, total - done);
    const buf = skip || h < vh ? await sharp(shot).extract({ left: 0, top: skip * dpr, width: variant.context.viewport.width * dpr, height: h * dpr }).toBuffer() : shot;
    parts.push({ input: buf, top: done * dpr, left: 0 });
    done += h;
  }
  await sharp({ create: { width: variant.context.viewport.width * dpr, height: done * dpr, channels: 3, background: '#000' } })
    .composite(parts)
    .png()
    .toFile(file);
}

async function capture(browser, slug, url, key, variant, tweak) {
  const ctx = await browser.newContext({ ...variant.context, locale: 'en-US', ...(REDUCED && !tweak?.motion ? { reducedMotion: 'reduce' } : {}) });
  const page = await ctx.newPage();
  page.setDefaultTimeout(30000);
  try {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
      await sleep(4000);
    }
    await sleep(2000 + (tweak?.extraWait ?? 0));
    await dismiss(page);
    await scrollThrough(page, variant.context.viewport.height, tweak);
    await dismiss(page);
    // reveal-on-scroll leftovers: force opacity on common reveal classes, then freeze animations
    if (REVEAL || tweak?.reveal) {
      await page.evaluate(() => {
        document.querySelectorAll('body *').forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.opacity === '0' && cs.visibility !== 'hidden' && cs.display !== 'none' && el.getBoundingClientRect().height > 8 && !el.closest('dialog,[aria-hidden="true"],nav,[role="menu"]')) {
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('transform', 'none', 'important');
          }
        });
      });
    }
    await page.addStyleTag({ content: FREEZE_CSS });
    await sleep(600);
    const file = path.join(OUT, slug, variant.file);
    mkdirSync(path.dirname(file), { recursive: true });
    if (tweak?.stitch) await stitched(page, file, variant, tweak);
    else await page.screenshot({ path: file, fullPage: true, timeout: 60000 });
    const kept = await compact(file);
    const kb = Math.round(statSync(kept).size / 1024);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`shots: ${slug} ${key} ok (${kb} KB, page height ${h})`);
    return true;
  } catch (e) {
    console.warn(`shots: ${slug} ${key} FAILED: ${String(e.message).split('\n')[0]}`);
    return false;
  } finally {
    await ctx.close();
  }
}

async function main() {
  if (args.includes('--compact')) {
    for (const d of readdirSync(OUT, { withFileTypes: true }).filter((x) => x.isDirectory())) {
      for (const f of readdirSync(path.join(OUT, d.name)).filter((x) => /-full\.png$/.test(x))) {
        const r = await compact(path.join(OUT, d.name, f));
        console.log(`shots: ${d.name}/${path.basename(r)} ${Math.round(statSync(r).size / 1024)} KB`);
      }
    }
    return;
  }
  const live = (await loadLive()).filter((p) => only.length === 0 || only.includes(p.slug));
  if (!existsSync(CHROME)) throw new Error(`Chromium not found at ${CHROME} (set CHROMIUM_PATH)`);
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  const failed = [];
  for (const { slug, url } of live) {
    for (const [key, variant] of Object.entries(VARIANTS)) {
      const file = path.join(OUT, slug, variant.file);
      if (!force && existsSync(file)) {
        console.log(`shots: ${slug} ${key} exists, skipped (use --force)`);
        continue;
      }
      const ok = await capture(browser, slug, url, key, variant, TWEAKS[slug]);
      if (!ok) failed.push(`${slug}/${key}`);
      await sleep(1500);
    }
  }
  await browser.close();
  if (failed.length) {
    console.warn(`shots: failed ${failed.join(', ')}`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
