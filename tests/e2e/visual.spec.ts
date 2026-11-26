import { expect, test, type Page } from '@playwright/test';

// Visual baselines (plan 11.2). Viewport screenshots per level and route; XP counter, toasts and the
// live shelf stage are masked because they depend on timing. Baselines are committed only after review.
const ROUTES = [
  ['projects', '/projects'],
  ['project-navig', '/projects/navig'],
  ['arcade', '/arcade'],
  ['interview', '/interview-framework'],
  ['404', '/no-such-page'],
] as const;

async function prepare(page: Page, route: string) {
  await page.goto(route);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  // Fire one-shot reveals, then hide timing-dependent overlays.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(30);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
}

const masks = (page: Page) => [page.locator('.xp'), page.locator('[role=status]'), page.locator('.toast'), page.locator('[data-shelf]'), page.locator('canvas')];

for (const [name, route] of ROUTES) {
  test(`@visual ${name}`, async ({ page }) => {
    await prepare(page, route);
    await expect(page).toHaveScreenshot(`${name}.png`, { animations: 'disabled', mask: masks(page), maxDiffPixelRatio: 0.01, fullPage: false });
  });
}

for (let n = 1; n <= 6; n += 1) {
  test(`@visual home level ${n}`, async ({ page }) => {
    await prepare(page, '/');
    const level = page.locator(`section[data-level="${n}"]`);
    await level.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY));
    await page.waitForTimeout(900);
    await expect(page).toHaveScreenshot(`home-level-${n}.png`, { animations: 'disabled', mask: masks(page), maxDiffPixelRatio: 0.01 });
  });
}
