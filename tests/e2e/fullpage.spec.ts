import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { PROJECTS } from '../../src/content/projects';

type Entry = { full?: { desktop?: { width: number; height: number }; mobile?: { width: number; height: number } } | null };
const entries = JSON.parse(readFileSync('src/content/media-manifest.json', 'utf8')) as Record<string, Entry>;
const withFull = PROJECTS.filter((p) => entries[p.slug]?.full?.desktop && entries[p.slug]?.full?.mobile);
const withoutFull = PROJECTS.filter((p) => !entries[p.slug]?.full);
const target = withFull[0]!;

test.describe('full-page layout viewer (right column, replaces the hero)', () => {
  test('@sheet @fullpage captured projects show both frames with alt text, sizes and lazy loading', async ({ page }) => {
    expect(withFull.length).toBeGreaterThan(0);
    await page.goto(`/projects/${target.slug}`);
    await expect(page.getByRole('heading', { name: 'Full-page layout' })).toHaveCount(1);
    // The viewer replaces the hero image: no separate hero picture on a captured project page.
    await expect(page.locator('.pd__poster .pd__img, .pd__poster picture')).toHaveCount(0);
    for (const device of ['desktop', 'mobile']) {
      const img = page.locator(`img[alt="Full-page ${device} layout of ${target.title} homepage"]`);
      // Only the visible tab's image loads eagerly (Mobile when stacked, Desktop when wide); the other loads on first toggle.
      const wide = (page.viewportSize()?.width ?? 0) >= 1024;
      await expect(img).toHaveAttribute('loading', (device === 'desktop') === wide ? 'eager' : 'lazy');
      await expect(img).toHaveAttribute('width', /^\d+$/);
      await expect(img).toHaveAttribute('height', /^\d+$/);
    }
    await expect(page.locator('.fpl__host').first()).toHaveText(new URL((target.link as { url: string }).url).hostname);
    // Frames scroll inside themselves and take keyboard focus.
    if ((page.viewportSize()?.width ?? 0) < 1024) await page.getByRole('tab', { name: 'Desktop' }).click();
    const region = page.getByRole('region', { name: 'Desktop layout, scrollable' });
    await region.scrollIntoViewIfNeeded();
    await region.focus();
    await page.keyboard.press('PageDown');
    await expect.poll(() => region.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test('@sheet @fullpage Desktop | Mobile tabs switch the frame and use arrow keys; default depends on the layout', async ({ page }) => {
    await page.goto(`/projects/${target.slug}`);
    const wide = (page.viewportSize()?.width ?? 0) >= 1024;
    const first = wide ? 'Desktop' : 'Mobile';
    const second = wide ? 'Mobile' : 'Desktop';
    await expect(page.getByRole('tab')).toHaveCount(2);
    await expect(page.getByRole('tab', { name: first })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(`.fpl__panel--${second.toLowerCase()}`)).toBeHidden();
    await page.getByRole('tab', { name: first }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: second })).toBeFocused();
    await expect(page.getByRole('tab', { name: second })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(`.fpl__panel--${second.toLowerCase()}`)).toBeVisible();
    await expect(page.locator(`.fpl__panel--${first.toLowerCase()}`)).toBeHidden();
  });

  for (const [w, h] of [[360, 640], [390, 844]] as const) {
    test(`@sheet @fullpage first screen at ${w}x${h}: heading, description and the whole phone are in view`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(`/projects/${target.slug}`);
      await expect(page.getByRole('tab', { name: 'Mobile' })).toHaveAttribute('aria-selected', 'true');
      await page.waitForTimeout(300);
      const box = async (sel: string) => (await page.locator(sel).first().boundingBox())!;
      const h1 = await box('h1');
      const syn = await box('.pd__synopsis');
      const phone = await box('.fpl__frame--mobile');
      expect(h1.y).toBeGreaterThanOrEqual(0);
      expect(syn.y + Math.min(syn.height, 20)).toBeLessThanOrEqual(h);
      expect(phone.y + phone.height).toBeLessThanOrEqual(h);
      expect(phone.height).toBeGreaterThan(220);
      // Order on narrow screens: heading, description, viewer, details.
      const role = await box('.pd__grid');
      expect(syn.y).toBeLessThan(phone.y);
      expect(phone.y).toBeLessThan(role.y);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    });
  }

  test('@sheet @fullpage on desktop the viewer sits in the right column and uses the column height', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-1440', 'wide only');
    await page.goto(`/projects/${target.slug}`);
    const viewer = await page.locator('.pd__poster--viewer').boundingBox();
    const synopsis = await page.locator('.pd__synopsis').boundingBox();
    expect(viewer && synopsis && viewer.x > synopsis.x + synopsis.width - 1).toBe(true);
    const frame = await page.locator('.fpl__frame--desktop').boundingBox();
    const vh = page.viewportSize()!.height;
    // The frame fills the viewport height (minus the top bar), and stays in view while the page scrolls.
    expect(frame!.height).toBeGreaterThan(vh * 0.75);
    expect(frame!.height).toBeLessThanOrEqual(vh);
    // Sticky: after a short scroll the frame is still in view, held under the top bar.
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(250);
    const after = await page.locator('.fpl__frame--desktop').boundingBox();
    expect(after!.y).toBeGreaterThanOrEqual(0);
    expect(after!.y + after!.height).toBeLessThanOrEqual(vh + 1);
  });

  test('@sheet @fullpage open full size: dialog with the live link, Escape closes and focus returns', async ({ page }) => {
    await page.goto(`/projects/${target.slug}`);
    if ((page.viewportSize()?.width ?? 0) < 1024) await page.getByRole('tab', { name: 'Desktop' }).click();
    const open = page.getByRole('button', { name: /Open full size.*desktop/ });
    await open.scrollIntoViewIfNeeded();
    await open.click();
    const dlg = page.getByRole('dialog', { name: new RegExp(`${target.title}.*Desktop layout`) });
    await expect(dlg).toBeVisible();
    await expect(dlg.getByRole('link', { name: /Visit/ })).toHaveAttribute('href', (target.link as { url: string }).url);
    await expect(dlg.getByRole('img', { name: /Full-page desktop layout/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    await expect(open).toBeFocused();
  });

  test('@sheet @fullpage projects without captures keep the hero and show no viewer', async ({ page }) => {
    expect(withoutFull.length).toBeGreaterThan(0);
    await page.goto(`/projects/${withoutFull[0]!.slug}`);
    await expect(page.getByRole('heading', { name: 'Full-page layout' })).toHaveCount(0);
    await expect(page.locator('.fpl')).toHaveCount(0);
    await expect(page.locator('.pd__poster')).toHaveCount(1);
  });

  test('@sheet @fullpage the home page never requests the tall images', async ({ page }) => {
    const seen: string[] = [];
    page.on('request', (r) => {
      if (/full-(desktop|mobile)\.webp/.test(r.url())) seen.push(r.url());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(500);
    expect(seen).toEqual([]);
    expect(await page.content()).not.toMatch(/full-(desktop|mobile)\.webp/);
  });
});

test.describe('full-page layout without JS', () => {
  test.use({ javaScriptEnabled: false });
  test('@nojs @fullpage both frames are visible and stacked', async ({ page }) => {
    await page.goto(`/projects/${target.slug}`);
    await expect(page.locator('.fpl__panel--desktop')).toBeVisible();
    await expect(page.locator('.fpl__panel--mobile')).toBeVisible();
    await expect(page.getByRole('img', { name: /Full-page mobile layout/ })).toHaveAttribute('src', /full-mobile\.webp/);
  });
});
