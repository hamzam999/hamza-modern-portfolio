// Captures the real hero of "/" as the Open Graph image: `npm run og:hero` (after `npm run build`).
// Serves dist/ with `vite preview`, opens it at 1200x630 (dpr 1, reduced motion so the collage is settled)
// and writes media-src/og/home-hero.png (optimised, well under 300 KB). scripts/gen-og.mjs reads that
// committed file for `/`, so the Vercel build needs no browser. Re-run whenever the hero or the accent colour changes.
import { chromium } from '@playwright/test';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { preview } from 'vite';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'media-src/og/home-hero.png');
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
if (!existsSync(path.join(ROOT, 'dist/index.html'))) {
  console.error('og:hero: dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const server = await preview({ root: ROOT, preview: { port: 0, host: '127.0.0.1' }, logLevel: 'error' });
const url = server.resolvedUrls?.local?.[0] ?? `http://127.0.0.1:${server.config.preview.port}/`;
const browser = await chromium.launch({ executablePath: existsSync(CHROME) ? CHROME : undefined });
try {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('h1');
  // Capture only what a visitor sees first: hide the fixed bottom ruler and any toast so the crop is the hero itself.
  await page.addStyleTag({ content: '.ruler, .toast, [role=status] { visibility: hidden !important; }' });
  await page.waitForTimeout(800);
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  mkdirSync(path.dirname(OUT), { recursive: true });
  const out = await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90, effort: 9 }).toBuffer();
  writeFileSync(OUT, out);
  console.log(`og:hero wrote ${path.relative(ROOT, OUT)} (${(out.length / 1024).toFixed(0)} KB)`);
  if (out.length > 300 * 1024) throw new Error('home-hero.png is over 300 KB');
} finally {
  await browser.close();
  await server.close();
}
