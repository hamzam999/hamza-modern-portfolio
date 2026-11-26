import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/projects', '/projects/navig', '/arcade', '/interview-framework', '/no-such-page'] as const;

for (const route of ROUTES) {
  test(`@smoke ${route} loads with one H1, no console errors, no horizontal scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() !== 'error' && m.type() !== 'warning') return;
      // The 404 page itself is served with status 404.
      if (route === '/no-such-page' && m.text().includes('status of 404')) return;
      errors.push(m.text());
    });

    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('@smoke a full interaction pass logs no console errors or warnings', async ({ page }, info) => {
  test.skip(info.project.name.startsWith('nojs'), 'needs JavaScript');
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  await page.goto('/');
  await page.waitForFunction(() => '__aq' in window);
  await page.getByRole('button', { name: /^Open passport/ }).click();
  await page.keyboard.press('Escape');
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(40);
  }
  await page.locator('[data-shelf-box]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.getByRole('link', { name: /NAVIG/ }).first().click();
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape');
  await page.goto('/arcade');
  await page.getByRole('button', { name: 'Start game' }).click();
  await page.waitForTimeout(600);
  await page.goto('/projects/navig');
  await page.goBack();
  expect(errors).toEqual([]);
});
