import { expect, test } from '@playwright/test';

// Reduced-motion extras (plan 11.4) and forced-colors (11.3). Only the reduced-* projects run the first block.
test.describe('@reduced', () => {
  test('@reduced nothing animates after load and the door is open', async ({ page }, info) => {
    test.skip(!info.project.name.startsWith('reduced'), 'reduced-motion projects only');
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => `${(a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty ?? 'anim'} on ${(a.effect as KeyframeEffect | null)?.target?.nodeName}.${String((a.effect as KeyframeEffect | null)?.target?.getAttribute('class') ?? '')}`));
    expect(running).toEqual([]);
  });
});

test('@forced forced-colors keeps controls visible', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'one project');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /^Passport/ })).toBeVisible();
  await page.getByRole('button', { name: /^Passport/ }).focus();
  const outline = await page.evaluate(() => {
    const cs = getComputedStyle(document.activeElement as Element);
    return { style: cs.outlineStyle, width: cs.outlineWidth };
  });
  expect(outline.style).not.toBe('none');
});
