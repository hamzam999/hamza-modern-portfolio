import { existsSync, readdirSync } from 'node:fs';
import { chromium, defineConfig, devices } from '@playwright/test';

const PORT = 4173;

/** Browsers present in the local Playwright cache. Projects whose browser is missing are skipped. */
const browsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH ?? `${process.env.HOME ?? ''}/.cache/ms-playwright`;
const installed = existsSync(browsersPath) ? readdirSync(browsersPath) : [];

/**
 * Fallback for sandboxes whose preinstalled Chromium revision differs from the one this
 * Playwright version expects: use any Chromium found in the cache instead of failing.
 */
function fallbackChromium(): string | undefined {
  if (process.env.CI !== undefined) return undefined;
  try {
    if (existsSync(chromium.executablePath())) return undefined;
  } catch {
    /* fall through to the search below */
  }
  for (const dir of installed.filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()) {
    for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
      const p = `${browsersPath}/${dir}/${rel}`;
      if (existsSync(p)) return p;
    }
  }
  return undefined;
}
const chromiumPath = fallbackChromium();
const has = (prefix: string) => process.env.CI !== undefined || installed.some((d) => d.startsWith(prefix));

/**
 * Projects follow plan 11.1. Phase 0 runs the smoke spec on every project;
 * later phases add specs and the e2e build hook (`npm run build:e2e`).
 * WebKit and Firefox projects are defined but only run where those browsers are installed.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    ...(chromiumPath ? { launchOptions: { executablePath: chromiumPath } } : {}),
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: ([
    {
      name: 'mobile-360',
      use: { ...devices['Pixel 5'], viewport: { width: 360, height: 740 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    },
    { name: 'mobile-390', use: { ...devices['iPhone 14'] } },
    { name: 'tablet-768', use: { ...devices['iPad Mini'] } },
    { name: 'desktop-1024', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    {
      name: 'firefox-1440',
      grep: /@smoke|@a11y/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'reduced-390',
      use: { ...devices['iPhone 14'], reducedMotion: 'reduce' },
    },
    {
      name: 'reduced-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
    },
    {
      name: 'nojs-1440',
      grep: /@nojs|@seo/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, javaScriptEnabled: false },
    },
  ] as const).filter((p) => has(p.use.defaultBrowserType === 'webkit' ? 'webkit' : p.use.defaultBrowserType === 'firefox' ? 'firefox' : 'chromium')).map((p) => ({ ...p, use: { ...p.use } })),
  webServer: {
    command: `${process.env.E2E_REUSE_BUILD ? 'true' : 'npm run build:e2e'} && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
