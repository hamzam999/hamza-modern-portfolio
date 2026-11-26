import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/projects', '/projects/navig', '/arcade', '/interview-framework', '/no-such-page'] as const;

for (const route of ROUTES) {
  test(`@layout ${route}: no horizontal scroll, targets >= 44 px, top bar fits`, async ({ page }, info) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'horizontal overflow').toBeLessThanOrEqual(0);

    // Interactive targets: visible links, buttons and tab stops. Inline text links inside running copy
    // are exempt (WCAG 2.5.8 inline exception) and so are screen-reader-only and hidden elements.
    const small = await page.evaluate(() => {
      const out: string[] = [];
      const sel = 'a[href], button, [role=button], [role=switch], input, select, textarea, [tabindex="0"]';
      for (const el of document.querySelectorAll<HTMLElement>(sel)) {
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        if (el.closest('[inert], [aria-hidden="true"], .sr-only, dialog:not([open])')) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (el.matches('.skip-link') && r.top < 0) continue;
        // WCAG 2.5.8 inline exception: a text link set inside a line of running text.
        if (el.tagName === 'A' && cs.display === 'inline') continue;
        // Visually hidden native checkbox behind a switch: its label carries the target (checked below).
        if (el.matches('input.toggle__input, .pong__toggle input')) {
          const lr = ((el as HTMLInputElement).labels?.[0] ?? el.closest('label'))?.getBoundingClientRect();
          if (lr && lr.height >= 44 - 0.5) continue;
        }
        // The reel scrubber packs ten ticks into the shelf width: 44 px tall, 24 px minimum width (2.5.8 spacing).
        if (el.matches('.reel__tick') && r.width >= 24 && r.height >= 44 - 0.5) continue;
        if (r.width < 44 - 0.5 || r.height < 44 - 0.5) {
          out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} "${(el.textContent ?? el.getAttribute('aria-label') ?? '').trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return out;
    });
    expect(small, `targets under 44 px on ${info.project.name}`).toEqual([]);

    const bar = await page.evaluate(() => {
      const el = document.querySelector('header');
      if (!el) return null;
      return { scrollW: el.scrollWidth, clientW: el.clientWidth };
    });
    if (bar) expect(bar.scrollW).toBeLessThanOrEqual(bar.clientW + 1);
  });
}

test('@layout the fixed ruler never covers the last focusable element of a level', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const ruler = page.locator('nav[aria-label=Levels]');
  await expect(ruler).toBeVisible();
  const levels = await page.locator('main section[id^="level-"]').all();
  expect(levels.length).toBe(6);
  for (const level of levels) {
    const last = level.locator('a[href], button, [tabindex="0"]').last();
    if ((await last.count()) === 0) continue;
    await last.focus();
    if (await page.evaluate(() => document.activeElement === document.body)) continue; // not focusable in this state (closed door)
    const id = await level.getAttribute('id');
    await page.waitForTimeout(120);
    const covered = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      const bar = document.querySelector('nav[aria-label=Levels]');
      if (!el || el === document.body || !bar) return '';
      const a = el.getBoundingClientRect();
      const b = bar.getBoundingClientRect();
      const hit = a.bottom > b.top && a.top < b.bottom && a.right > b.left && a.left < b.right;
      return hit ? `${el.outerHTML.slice(0, 100)} ${Math.round(a.top)}-${Math.round(a.bottom)} vs ${Math.round(b.top)}` : '';
    });
    expect(covered, `last focusable of ${await level.getAttribute('id')} under the ruler`).toBe('');
  }
});
