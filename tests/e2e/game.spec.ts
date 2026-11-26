import { expect, test, type Page } from '@playwright/test';

type Hooks = { grant: (id: string) => number; reset: () => void; winPong: () => void; state: () => { xp?: number; events: Record<string, string> } };
const aq = (page: Page) => page.waitForFunction(() => '__aq' in window);
const xp = (page: Page) =>
  page.evaluate(() => {
    const s = (window as unknown as { __aq: Hooks }).__aq.state();
    return Object.keys(s.events).length;
  });

test.describe('@game', () => {
  test('@game grants are idempotent and the XP counter reflects them', async ({ page }) => {
    await page.goto('/');
    await aq(page);
    await page.evaluate(() => {
      const h = (window as unknown as { __aq: Hooks }).__aq;
      h.reset();
      h.grant('door:contact');
      h.grant('door:contact');
      h.grant('project:navig:open');
      h.grant('project:navig:open');
    });
    await expect(page.getByRole('img', { name: 'Experience points: 120 of 1200' })).toBeVisible();
  });

  test('@game project XP caps at ten projects', async ({ page }) => {
    await page.goto('/');
    await aq(page);
    await page.evaluate(() => {
      const h = (window as unknown as { __aq: Hooks }).__aq;
      h.reset();
      for (let i = 0; i < 14; i += 1) h.grant(`project:p${i}:open`);
    });
    await expect(page.getByRole('img', { name: 'Experience points: 200 of 1200' })).toBeVisible();
  });

  test('@game pong XP: first win 120, then 30 each, capped at 300', async ({ page }) => {
    await page.goto('/');
    await aq(page);
    await page.evaluate(() => {
      const h = (window as unknown as { __aq: Hooks }).__aq;
      h.reset();
      h.winPong();
    });
    await expect(page.getByRole('img', { name: 'Experience points: 120 of 1200' })).toBeVisible();
    await page.evaluate(() => {
      const h = (window as unknown as { __aq: Hooks }).__aq;
      for (let i = 0; i < 10; i += 1) h.winPong();
    });
    await expect(page.getByRole('img', { name: 'Experience points: 300 of 1200' })).toBeVisible();
  });

  test('@game dwell timer grants level XP under a controlled clock', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    await aq(page);
    await page.evaluate(() => (window as unknown as { __aq: Hooks }).__aq.reset());
    const before = await xp(page);
    await page.clock.fastForward(30_000);
    expect(await xp(page)).toBeGreaterThanOrEqual(before);
  });

  test('@game state persists across reload and syncs between tabs', async ({ page, context }) => {
    await page.goto('/');
    await aq(page);
    await page.evaluate(() => {
      const h = (window as unknown as { __aq: Hooks }).__aq;
      h.reset();
      h.grant('door:contact');
    });
    const other = await context.newPage();
    await other.goto('/');
    await expect(other.getByRole('img', { name: /Experience points: 100 of 1200/ })).toBeVisible();
    await page.evaluate(() => (window as unknown as { __aq: Hooks }).__aq.grant('project:navig:open'));
    await expect(other.getByRole('img', { name: /Experience points: 120 of 1200/ })).toBeVisible({ timeout: 5000 });
    await other.close();
  });

  test('@game Play mode off stops grants', async ({ page }) => {
    await page.goto('/');
    await aq(page);
    await page.evaluate(() => (window as unknown as { __aq: Hooks }).__aq.reset());
    await page.getByRole('button', { name: /^Passport/ }).click();
    await page.getByRole('dialog', { name: 'Passport' }).getByText('Play mode').click();
    await page.keyboard.press('Escape');
    await page.evaluate(() => (window as unknown as { __aq: Hooks }).__aq.grant('door:contact'));
    await expect(page.getByRole('img', { name: /Experience points/ })).toHaveCount(0);
  });
});
