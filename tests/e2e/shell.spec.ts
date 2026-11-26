import { expect, test } from '@playwright/test';

test.describe('@shell', () => {
  test('@shell ruler jump moves scroll and focus and updates aria-current', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('navigation', { name: 'Levels' }).getByRole('link', { name: /Level 4: Archive/ });
    await link.click();
    await expect(page.locator('#level-archive-heading')).toBeFocused();
    await expect(link).toHaveAttribute('aria-current', 'location');
    const top = await page.locator('#level-archive').evaluate((el) => el.getBoundingClientRect().top);
    expect(Math.abs(top)).toBeLessThan(120);
    expect(page.url()).toContain('#level-archive');
  });

  test('@shell passport dialog traps focus, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: /^Open passport/ });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Passport' });
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('dialog'));
      expect(inside).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('@shell menu dialog opens, lists the pages and closes on Escape', async ({ page }, info) => {
    test.skip((info.project.use.viewport?.width ?? 0) >= 1024, 'Menu button is below 1024 px only');
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Menu' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'All projects' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('@shell menu link navigates after closing', async ({ page }, info) => {
    test.skip((info.project.use.viewport?.width ?? 0) >= 1024, 'Menu button is below 1024 px only');
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'All projects' }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Project archive' })).toBeFocused();
  });

  test('@shell settings persist across reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^Open passport/ }).click();
    const dialog = page.getByRole('dialog', { name: 'Passport' });
    await dialog.getByText('Classic cursor').click();
    await expect(dialog.getByRole('switch', { name: 'Classic cursor' })).toBeChecked();
    await page.reload();
    await page.getByRole('button', { name: /^Open passport/ }).click();
    await expect(page.getByRole('dialog', { name: 'Passport' }).getByRole('switch', { name: 'Classic cursor' })).toBeChecked();
  });

  test('@shell XP survives a reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => '__aq' in window);
    await page.evaluate(() => (window as unknown as { __aq: { grant: (id: string) => number } }).__aq.grant('door:contact'));
    await expect(page.getByRole('button', { name: 'Open passport, 100 frames' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Open passport, 100 frames' })).toBeVisible();
  });

  test('@shell app works when localStorage throws', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      const boom = () => {
        throw new Error('blocked');
      };
      Storage.prototype.getItem = boom;
      Storage.prototype.setItem = boom;
      Storage.prototype.removeItem = boom;
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('button', { name: /^Open passport/ }).click();
    await expect(page.getByRole('dialog', { name: 'Passport' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('@shell Play mode off hides the XP counter', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /^Open passport/ })).toBeVisible();
    await page.getByRole('button', { name: /^Open passport/ }).click();
    await page.getByRole('dialog', { name: 'Passport' }).getByText('Play mode').click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: /^Open passport/ })).toHaveCount(0);
  });

  test('@shell skip link moves focus to main', async ({ page }) => {
    await page.goto('/projects');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });
});
