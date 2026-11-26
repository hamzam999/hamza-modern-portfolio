import { mkdirSync } from 'node:fs';
import { test } from '@playwright/test';

// Review screenshots only, no assertions (plan 11.2). Runs once, in the desktop-1440 project.
const WIDTHS = [360, 390, 768, 1024, 1440] as const;
const ROUTES: ReadonlyArray<readonly [string, string]> = [
  ['home', '/'],
  ['projects', '/projects'],
  ['project-navig', '/projects/navig'],
  ['arcade', '/arcade'],
  ['interview', '/interview-framework'],
  ['404', '/no-such-page'],
];

test.describe('shots', () => {
  test.setTimeout(240_000);

  test('capture routes at five widths', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-1440', 'single project run');
    mkdirSync('test-results/shots', { recursive: true });
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: width < 768 ? 800 : 900 });
      for (const [name, route] of ROUTES) {
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        // Scroll through once so one-shot reveals have fired.
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < h; y += 500) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(40);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(900);
        await page.screenshot({ path: `test-results/shots/${name}-${width}.png`, fullPage: true });
      }
    }
  });
});
