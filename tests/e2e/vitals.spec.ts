import { expect, test, type Page } from '@playwright/test';

const ROUTES = ['/', '/projects', '/projects/navig', '/arcade', '/interview-framework'] as const;
const skipMotionless = (info: { project: { name: string } }) => info.project.name.startsWith('nojs');

async function scrollAll(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 350) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(40);
  }
}

for (const route of ROUTES) {
  test(`@perf CLS stays under 0.05 while scrolling ${route}`, async ({ page, browserName }, info) => {
    test.skip(browserName !== 'chromium' || skipMotionless(info), 'layout-shift entries are Chromium only');
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as Array<{ value: number; hadRecentInput: boolean }>) {
          if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await scrollAll(page);
    await page.waitForTimeout(500);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.05);
  });
}

test('@perf @throttle INP proxy: ruler tap and passport open respond within 150 ms at 4x CPU', async ({ page, browserName }, info) => {
  test.skip(browserName !== 'chromium' || skipMotionless(info), 'CDP throttling is Chromium only');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.addInitScript(() => undefined);
  await page.evaluate(() => {
    (window as unknown as { __inp: number[] }).__inp = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) (window as unknown as { __inp: number[] }).__inp.push(e.duration);
    }).observe({ type: 'event', durationThreshold: 16, buffered: false } as PerformanceObserverInit);
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.getByRole('button', { name: /^Passport/ }).click();
  await expect(page.getByRole('dialog', { name: 'Passport' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.locator('nav[aria-label=Levels] a, nav[aria-label=Levels] button').nth(2).click();
  await page.waitForTimeout(800);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  const worst = await page.evaluate(() => Math.max(0, ...(window as unknown as { __inp: number[] }).__inp));
  test.info().annotations.push({ type: 'inp-proxy', description: `${Math.round(worst)} ms` });
  expect(worst).toBeLessThanOrEqual(150);
});

// Keyboard-only path (plan 11.3): every stop has a visible focus indicator and is not hidden behind the fixed chrome.
test('@a11y keyboard path through the home page: visible focus and never hidden behind the bar or ruler', async ({ page }, info) => {
  test.skip(skipMotionless(info) || info.project.use.hasTouch === true, 'keyboard path runs on desktop projects');
  test.setTimeout(120_000);
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press('Tab');
  const problems: string[] = [];
  let stops = 0;
  for (let i = 0; i < 260; i += 1) {
    await page.waitForTimeout(25);
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const bar = document.querySelector('header')?.getBoundingClientRect();
      const ruler = document.querySelector('nav[aria-label=Levels]')?.getBoundingClientRect();
      const hidden = (b?: DOMRect) => !!b && rect.height > 0 && rect.top >= b.top && rect.bottom <= b.bottom && rect.left < b.right && rect.right > b.left;
      const indicator = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? 'outline' : cs.boxShadow !== 'none' ? 'shadow' : '';
      return { name: `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''} ${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 24)}`, indicator, covered: hidden(bar) || hidden(ruler), inert: !!el.closest('[inert]'), tag: el.tagName, footer: !!el.closest('footer') };
    });
    if (r) {
      stops += 1;
      if (!r.indicator) problems.push(`no focus indicator: ${r.name}`);
      if (r.covered) problems.push(`covered by fixed chrome: ${r.name}`);
      if (r.inert) problems.push(`focus on inert: ${r.name}`);
      if (r.footer && /Reset|llms/.test(r.name)) break;
    }
    await page.keyboard.press('Tab');
  }
  expect(stops).toBeGreaterThan(40);
  expect(problems).toEqual([]);
});
