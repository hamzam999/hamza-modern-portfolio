import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const ROUTES = ['/', '/projects', '/projects/navig', '/arcade', '/interview-framework', '/no-such-page'] as const;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

async function scan(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
}

for (const route of ROUTES) {
  test(`@a11y ${route} has no axe violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await scan(page);
  });
}

test('@a11y passport dialog open has no axe violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Passport/ }).click();
  await expect(page.getByRole('dialog', { name: 'Passport' })).toBeVisible();
  await page.waitForTimeout(500);
  await scan(page);
});

test('@a11y menu dialog open has no axe violations', async ({ page }, info) => {
  test.skip((info.project.use.viewport?.width ?? 0) >= 1024, 'Menu button is below 1024 px only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await page.waitForTimeout(500);
  await scan(page);
});
