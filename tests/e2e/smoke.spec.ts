import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/interview-framework'] as const;

for (const route of ROUTES) {
  test(`@smoke ${route} loads with one H1 and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });

    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}
