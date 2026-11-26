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
      // The visible (default Desktop) tab loads eagerly, the other one lazily on first toggle.
      await expect(img).toHaveAttribute('loading', device === 'desktop' ? 'eager' : 'lazy');
      await expect(img).toHaveAttribute('width', /^\d+$/);
      await expect(img).toHaveAttribute('height', /^\d+$/);
    }
    await expect(page.locator('.fpl__host').first()).toHaveText(new URL((target.link as { url: string }).url).hostname);
    // Frames scroll inside themselves and take keyboard focus.
    const region = page.getByRole('region', { name: 'Desktop layout, scrollable' });
    await region.scrollIntoViewIfNeeded();
    await region.focus();
    await page.keyboard.press('PageDown');
    await expect.poll(() => region.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test('@sheet @fullpage Desktop | Mobile tabs switch the frame, use arrow keys and remember the choice', async ({ page }) => {
    await page.goto(`/projects/${target.slug}`);
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(2);
    await expect(page.getByRole('tab', { name: 'Desktop' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.fpl__panel--mobile')).toBeHidden();
    await page.getByRole('tab', { name: 'Desktop' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Mobile' })).toBeFocused();
    await expect(page.getByRole('tab', { name: 'Mobile' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.fpl__panel--mobile')).toBeVisible();
    await expect(page.locator('.fpl__panel--desktop')).toBeHidden();
  });

  test('@sheet @fullpage on desktop the viewer sits in the right column and uses the column height', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-1440', 'wide only');
    await page.goto(`/projects/${target.slug}`);
    const viewer = await page.locator('.pd__poster--viewer').boundingBox();
    const synopsis = await page.locator('.pd__synopsis').boundingBox();
    expect(viewer && synopsis && viewer.x > synopsis.x + synopsis.width - 1).toBe(true);
    const frame = await page.locator('.fpl__frame--desktop').boundingBox();
    expect(frame!.height).toBeGreaterThan(560);
    expect(frame!.height).toBeLessThanOrEqual(762);
  });

  test('@sheet @fullpage stacked layouts put the viewer at the top with a capped height', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile-360' && info.project.name !== 'mobile-390', 'narrow only');
    await page.goto(`/projects/${target.slug}`);
    const viewer = await page.locator('.pd__poster--viewer').boundingBox();
    const synopsis = await page.locator('.pd__synopsis').boundingBox();
    expect(viewer!.y).toBeLessThan(synopsis!.y);
    const vh = page.viewportSize()!.height;
    expect((await page.locator('.fpl__frame--desktop').boundingBox())!.height).toBeLessThanOrEqual(vh * 0.6 + 2);
  });

  test('@sheet @fullpage open full size: dialog with the live link, Escape closes and focus returns', async ({ page }) => {
    await page.goto(`/projects/${target.slug}`);
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
