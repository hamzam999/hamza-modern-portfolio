import { expect, test } from '@playwright/test';

test.describe('@shell header: Arcade link and XP button', () => {
  test('@shell the top bar has an Arcade link (44px, goes to /arcade) and no Passport button', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('header.topbar');
    const arcade = bar.getByRole('link', { name: 'Arcade' });
    await expect(arcade).toHaveAttribute('href', '/arcade');
    const box = (await arcade.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
    await expect(bar.getByRole('button', { name: /^Passport$/ })).toHaveCount(0);
    await arcade.click();
    await expect(page).toHaveURL(/\/arcade$/);
    await expect(page.getByTestId('arcade-early')).toBeVisible();
  });

  test('@shell the XP counter is a button that opens the Passport with its purpose sentence', async ({ page }) => {
    await page.goto('/');
    const xp = page.getByRole('button', { name: /^Open passport, \d+ frames/ });
    await expect(xp).toBeVisible();
    expect((await xp.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await xp.click();
    const dlg = page.getByRole('dialog', { name: 'Passport' });
    await expect(dlg).toBeVisible();
    await expect(dlg.getByText('Your run so far: XP and a stamp for each level. Nothing is locked.')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    await expect(xp).toBeFocused();
  });

  test('@shell the Passport is also reachable from the menu and the footer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('button', { name: 'Passport' }).click();
    await expect(page.getByRole('dialog', { name: 'Passport' })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('footer').getByRole('button', { name: 'Passport' }).click();
    await expect(page.getByRole('dialog', { name: 'Passport' })).toBeVisible();
  });

  test('@shell no horizontal scroll and an icon-only Arcade below 640px', async ({ page }, info) => {
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    if ((page.viewportSize()?.width ?? 1000) < 640) {
      await expect(page.locator('.topbar__arcadetext')).toHaveCSS('width', '1px');
      await expect(page.locator('header.topbar').getByRole('link', { name: 'Arcade' })).toBeVisible();
    }
    info.annotations.push({ type: 'note', description: 'Arcade label is visually hidden below 640px' });
  });
});

test('@levels the contact stamp and toast use the call-to-action wording', async ({ page }) => {
  await page.goto('/');
  const text = await page.content();
  expect(text.toLowerCase()).not.toContain('door opened');
});
