import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const isReduced = (info: TestInfo) => info.project.name.startsWith('reduced');
const isNoJs = (info: TestInfo) => info.project.name.startsWith('nojs');

/** Scrolls Level 4 into view and waits for the lazy shelf chunk to mount and paint its first frame. */
async function openShelf(page: Page, url = '/') {
  await page.goto(url);
  await page.locator('[data-shelf-box]').scrollIntoViewIfNeeded();
  await page.locator('[data-shelf]').waitFor({ state: 'attached' });
  await expect(page.locator('.shelf-box')).toHaveAttribute('data-view', 'shelf');
  await expect(page.locator('a.tape[data-copy="0"][tabindex="0"]')).toHaveCount(1);
  await page.waitForFunction(() => document.querySelector('a.tape[data-copy="0"][data-current]')?.getAttribute('style')?.includes('translate3d'));
}
const tape = (page: Page, n: number) => page.locator(`a.tape[data-copy="0"][data-index="${n}"]`);
const activeTitle = (page: Page) => page.locator('.cap__layer[data-state="in"] .cap__title');
const activeIndex = (page: Page) => page.locator('a.tape[data-copy="0"][data-current]').getAttribute('data-index');

async function settle(page: Page) {
  await page.waitForTimeout(1500);
}

test.describe('@shelf', () => {
  test.beforeEach(({}, info) => {
    test.skip(isReduced(info) || isNoJs(info), 'motion-allowed projects only');
  });

  test('@shelf pool has three copies, only copy 0 is exposed, labels carry the position', async ({ page }) => {
    await openShelf(page);
    await expect(page.locator('a.tape')).toHaveCount(30);
    await expect(page.locator('a.tape[data-copy="0"]')).toHaveCount(10);
    await expect(page.locator('a.tape[aria-hidden="true"][inert]')).toHaveCount(20);
    await expect(tape(page, 0)).toHaveAttribute('aria-label', 'NAVIG, 3D and Interactive, tape 1 of 10');
    await expect(page.locator('a.tape[tabindex="0"]')).toHaveCount(1);
    await expect(page.locator('[data-shelf-wrap]')).toHaveAttribute('aria-roledescription', 'carousel');
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over).toBeLessThanOrEqual(0);
  });

  test('@shelf geometry: active cover is centred and the caption names it', async ({ page }) => {
    await openShelf(page);
    const shelf = (await page.locator('[data-shelf]').boundingBox())!;
    const cover = (await page.locator('a.tape[data-copy="0"][data-current] .tape__cv').boundingBox())!;
    expect(Math.abs(cover.x + cover.width / 2 - (shelf.x + shelf.width / 2))).toBeLessThan(3);
    expect(Math.abs(cover.y + cover.height / 2 - (shelf.y + shelf.height / 2))).toBeLessThan(10);
    await expect(activeTitle(page)).toHaveText('NAVIG');
  });

  test('@shelf keys: arrows, Home, End, PageDown, wrap in both directions, focus follows selection', async ({ page }) => {
    await openShelf(page);
    await tape(page, 0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tape(page, 1)).toBeFocused();
    await expect(activeTitle(page)).toHaveText('CodesLytic Budget');
    await page.keyboard.press('PageDown');
    await expect(tape(page, 4)).toBeFocused();
    await page.keyboard.press('End');
    await expect(tape(page, 9)).toBeFocused();
    await page.keyboard.press('ArrowRight'); // wraps to the first tape
    await expect(tape(page, 0)).toBeFocused();
    await page.keyboard.press('ArrowLeft'); // and back to the last
    await expect(tape(page, 9)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(tape(page, 0)).toBeFocused();
    await settle(page);
    expect(await activeIndex(page)).toBe('0');
    await expect(page.locator('a.tape[tabindex="0"]')).toHaveAttribute('data-index', '0');
  });

  test('@shelf no gap at any position while wrapping', async ({ page }) => {
    await openShelf(page);
    const next = page.getByRole('button', { name: 'Next project' });
    for (let i = 0; i < 12; i++) {
      await next.click();
      await page.waitForTimeout(120);
      const visible = await page.locator('a.tape:not([hidden])').count();
      expect(visible).toBeGreaterThanOrEqual(14);
    }
  });

  test('@shelf buttons and scrubber move the shelf and the live region announces once settled', async ({ page }) => {
    await openShelf(page);
    await page.getByRole('button', { name: 'Next project' }).click();
    await settle(page);
    await expect(page.locator('[data-shelf-status]')).toHaveText('CodesLytic Budget. Full-stack and Product. Tape 2 of 10.');
    await page.getByRole('button', { name: 'Go to tape 3: Lammle’s Checkout' }).click({ force: true });
    await settle(page);
    expect(await activeIndex(page)).toBe('2');
    await expect(page.locator('[data-shelf-status]')).toContainText('Tape 3 of 10');
    await expect(page.getByRole('button', { name: /^Go to tape/ }).first()).toHaveAttribute('tabindex', '-1');
  });

  test('@shelf keyboard moves do not use the live region (focus carries the label)', async ({ page }) => {
    await openShelf(page);
    await tape(page, 0).focus();
    await page.keyboard.press('ArrowRight');
    await settle(page);
    await expect(page.locator('[data-shelf-status]')).toHaveText('');
  });

  test('@shelf vertical wheel scrolls the page, horizontal wheel moves the shelf', async ({ page }) => {
    await openShelf(page);
    const box = (await page.locator('[data-shelf]').boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const y0 = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 240);
    await page.waitForTimeout(1200); // wheel scrolling can ease for a moment; measure the shelf only once it is still
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(y0);
    expect(await activeIndex(page)).toBe('0');
    await page.evaluate(() => window.scrollBy({ top: document.querySelector('[data-shelf]')!.getBoundingClientRect().top - 120, behavior: 'instant' }));
    await page.waitForTimeout(300);
    const box2 = (await page.locator('[data-shelf]').boundingBox())!;
    await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
    await page.mouse.wheel(260, 0);
    await settle(page);
    expect(Number(await activeIndex(page))).toBeGreaterThanOrEqual(1);
  });

  test('@shelf mouse drag with a flick moves the shelf and does not open a project', async ({ page }) => {
    await openShelf(page);
    const box = (await page.locator('[data-shelf]').boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(cx - i * 30, cy, { steps: 1 });
    await page.mouse.up();
    await settle(page);
    expect(Number(await activeIndex(page))).toBeGreaterThanOrEqual(2);
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(page.locator('dialog.sheet')).toHaveCount(0);
  });

  test('@shelf vertical swipe over the shelf is left to the page (axis lock)', async ({ page }) => {
    await openShelf(page);
    const box = (await page.locator('[data-shelf]').boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 4, cy + 40, { steps: 6 });
    await page.mouse.move(cx + 120, cy + 60, { steps: 6 });
    await page.mouse.up();
    await settle(page);
    expect(await activeIndex(page)).toBe('0');
  });

  test('@shelf the shelf container has touch-action pan-y so vertical touch scrolls the page', async ({ page }) => {
    await openShelf(page);
    expect(await page.locator('[data-shelf]').evaluate((el) => getComputedStyle(el).touchAction)).toBe('pan-y');
  });

  test('@shelf clicking a side tape selects it, clicking the active one opens the sheet', async ({ page }) => {
    await openShelf(page);
    await page.locator('a.tape[data-copy="0"][data-index="1"] .tape__sp').click({ force: true });
    await settle(page);
    expect(await activeIndex(page)).toBe('1');
    await expect(page).toHaveURL(/\/$/);
    await page.locator('a.tape[data-copy="0"][data-current] .tape__cv').click({ force: true });
    await expect(page).toHaveURL(/\/projects\/codeslytic-budget$/);
    await expect(page.locator('dialog.sheet')).toBeVisible();
  });

  test('@shelf modifier-click is not intercepted (link opens normally)', async ({ page }) => {
    await openShelf(page);
    const prevented = await page.locator('a.tape[data-copy="0"][data-current]').evaluate((el) => {
      const ev = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true, button: 0 });
      el.dispatchEvent(ev);
      return ev.defaultPrevented;
    });
    expect(prevented).toBe(false);
  });

  test('@a11y shelf mounted has no axe violations', async ({ page }) => {
    await openShelf(page);
    await settle(page);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
});

test.describe('@sheet', () => {
  test.beforeEach(({}, info) => {
    test.skip(isReduced(info) || isNoJs(info), 'motion-allowed projects only (reduced is covered below)');
  });

  test('@sheet Enter opens the sheet over the page, Escape closes it, focus and scroll are restored', async ({ page }) => {
    await openShelf(page);
    await tape(page, 0).focus();
    const y0 = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/projects\/navig$/);
    const dlg = page.locator('dialog.sheet');
    await expect(dlg).toHaveAttribute('data-state', 'open');
    await expect(page.getByRole('dialog', { name: 'NAVIG' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeFocused();
    await expect(page.locator('html')).toHaveClass(/sheet-open/);
    await expect(page.getByRole('heading', { level: 2, name: 'NAVIG' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open as a page' })).toHaveAttribute('href', '/projects/navig');
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0, { timeout: 4000 });
    await expect(page).toHaveURL(/\/$/);
    await expect(tape(page, 0)).toBeFocused();
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y0)).toBeLessThan(4);
    await expect(page.locator('html')).not.toHaveClass(/sheet-open/);
  });

  test('@sheet the clip-path grows from the cover rectangle', async ({ page }) => {
    await openShelf(page);
    const cover = (await page.locator('a.tape[data-copy="0"][data-current] .tape__cv').boundingBox())!;
    await page.locator('a.tape[data-copy="0"][data-current] .tape__cv').click({ force: true });
    const from = await page.locator('dialog.sheet').evaluate((el) => (el as HTMLElement).style.getPropertyValue('--clip-from'));
    const m = /inset\(([\d.]+)px ([\d.]+)px ([\d.]+)px ([\d.]+)px/.exec(from);
    expect(m).not.toBeNull();
    expect(Math.abs(Number(m![1]) - cover.y)).toBeLessThan(3);
    expect(Math.abs(Number(m![4]) - cover.x)).toBeLessThan(3);
  });

  test('@sheet Close button closes and returns to the page', async ({ page }) => {
    await openShelf(page);
    await page.locator('a.tape[data-copy="0"][data-current] .tape__cv').click({ force: true });
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('dialog.sheet')).toHaveCount(0, { timeout: 4000 });
    await expect(page).toHaveURL(/\/$/);
  });

  test('@sheet reload on the sheet URL shows the standalone page with the same content', async ({ page }) => {
    await openShelf(page);
    await page.locator('a.tape[data-copy="0"][data-current] .tape__cv').click({ force: true });
    await expect(page.locator('dialog.sheet')).toBeVisible();
    await page.reload();
    await expect(page.locator('dialog.sheet')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1, name: 'NAVIG' })).toBeVisible();
  });

  test('@sheet opening the sheet grants project XP once', async ({ page }) => {
    await openShelf(page);
    await page.waitForFunction(() => '__aq' in window);
    await page.locator('a.tape[data-copy="0"][data-current] .tape__cv').click({ force: true });
    await expect(page.locator('dialog.sheet')).toBeVisible();
    const has = await page.evaluate(() => 'project:navig:open' in (window as unknown as { __aq: { state: () => { events: Record<string, string> } } }).__aq.state().events);
    expect(has).toBe(true);
  });

  test('@a11y detail sheet open has no axe violations', async ({ page }) => {
    await openShelf(page);
    await page.locator('a.tape[data-copy="0"][data-current] .tape__cv').click({ force: true });
    await expect(page.locator('dialog.sheet')).toHaveAttribute('data-state', 'open');
    await page.waitForTimeout(2200);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
});

test.describe('@shelf fallbacks', () => {
  test('@shelf reduced motion shows the grid with a Show as shelf button; the shelf then runs without animation', async ({ page }, info) => {
    test.skip(!isReduced(info), 'reduced-motion projects only');
    await page.goto('/');
    await page.locator('[data-shelf-box]').scrollIntoViewIfNeeded();
    await expect(page.locator('.tape-grid li')).toHaveCount(10);
    await expect(page.locator('[data-shelf]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Show as shelf' }).click();
    await expect(page.locator('[data-shelf]')).toBeVisible();
    await expect(page.locator('a.tape')).toHaveCount(30);
    // No spring: the position jumps to the target in the same frame.
    await page.getByRole('button', { name: 'Next project' }).click();
    await expect(page.locator('a.tape[data-copy="0"][data-index="1"][data-current]')).toHaveCount(1);
    await page.getByRole('button', { name: 'Show as grid' }).click();
    await expect(page.locator('.tape-grid li')).toHaveCount(10);
  });

  test('@shelf grid links are real links to the project pages', async ({ page }, info) => {
    test.skip(!isReduced(info), 'reduced-motion projects only');
    await page.goto('/');
    await expect(page.locator('.tape-grid a').first()).toHaveAttribute('href', '/projects/navig');
  });

  test('@nojs the static grid shows ten linked tapes and no shelf', async ({ page }, info) => {
    test.skip(!isNoJs(info), 'JavaScript-disabled project only');
    await page.goto('/');
    await expect(page.locator('.tape-grid a')).toHaveCount(10);
    await expect(page.locator('.tape-grid a').first()).toBeVisible();
    await expect(page.locator('[data-shelf]')).toHaveCount(0);
  });
});
