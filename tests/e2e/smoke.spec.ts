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
