import { expect, test, type Page } from '@playwright/test';

type Hooks = { __aq: { reset: () => void; state: () => { xp: number; events: Record<string, string> } }; __pong: { s: Record<string, number | string>; setPlayerAlong: (v: number) => void } };

const canvas = (page: Page) => page.getByRole('img', { name: /Reel Pong game field/ });
const phase = (page: Page) => canvas(page).getAttribute('data-phase');

test.beforeEach(async ({ page }) => {
  await page.goto('/arcade');
  await page.waitForFunction(() => '__aq' in window && '__pong' in window);
  await page.evaluate(() => (window as unknown as Hooks).__aq.reset());
});

test.describe('@arcade', () => {
  test('@arcade page content, one H1, controls and placeholders', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Arcade');
    await expect(page.getByTestId('pong-score')).toContainText('You 0');
    await expect(page.getByTestId('pong-score')).toContainText('CPU 0');
    await expect(page.getByRole('button', { name: 'Start game' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Normal' })).toBeChecked();
    await expect(page.getByText('Coming later')).toHaveCount(2);
    await expect(page.getByTestId('arcade-early')).toContainText('You found the arcade early');
    expect(await page.content()).not.toMatch(/\+91|9919/);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over).toBeLessThanOrEqual(0);
  });

  test('@arcade canvas is sized to the field and picks an orientation', async ({ page }) => {
    const box = await canvas(page).boundingBox();
    expect(box).not.toBeNull();
    const o = await canvas(page).getAttribute('data-orientation');
    const ratio = (box?.width ?? 0) / (box?.height ?? 1);
    if (o === 'landscape') expect(ratio).toBeCloseTo(1.6, 1);
    else expect(ratio).toBeCloseTo(0.625, 1);
    const vw = page.viewportSize()?.width ?? 0;
    expect(box?.width ?? 0).toBeLessThanOrEqual(vw);
  });

  test('@arcade keyboard: Space starts, P pauses, Space resumes', async ({ page }) => {
    await canvas(page).focus();
    await page.keyboard.press('Space');
    await expect.poll(() => phase(page)).toMatch(/serve|play/);
    await page.keyboard.press('p');
    await expect.poll(() => phase(page)).toBe('paused');
    await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible();
    await page.keyboard.press('Space');
    await expect.poll(() => phase(page)).toMatch(/serve|play|point/);
    await page.keyboard.press('Escape');
    await expect.poll(() => phase(page)).toBe('paused');
  });

  test('@arcade keyboard moves the paddle and arrow keys do not scroll while playing', async ({ page }) => {
    await canvas(page).focus();
    await page.keyboard.press('Enter');
    const o = await canvas(page).getAttribute('data-orientation');
    const [down, up] = o === 'portrait' ? ['ArrowRight', 'ArrowLeft'] : ['ArrowDown', 'ArrowUp'];
    const y0 = await page.evaluate(() => window.scrollY);
    const a = await page.evaluate(() => Number((window as unknown as Hooks).__pong.s.playerAlong));
    await page.keyboard.down(down);
    await page.waitForTimeout(250);
    await page.keyboard.up(down);
    const b = await page.evaluate(() => Number((window as unknown as Hooks).__pong.s.playerAlong));
    expect(b, `phase ${await phase(page)} axis`).toBeGreaterThan(a + 20);
    await page.keyboard.down(up);
    await page.waitForTimeout(250);
    await page.keyboard.up(up);
    const c = await page.evaluate(() => Number((window as unknown as Hooks).__pong.s.playerAlong));
    expect(c).toBeLessThan(b - 20);
    expect(await page.evaluate(() => window.scrollY)).toBe(y0);
  });

  test('@arcade pointer drag sets the paddle', async ({ page }) => {
    const box = await canvas(page).boundingBox();
    if (!box) throw new Error('no canvas');
    const o = await canvas(page).getAttribute('data-orientation');
    await page.getByRole('button', { name: 'Start game' }).click();
    await canvas(page).scrollIntoViewIfNeeded();
    const b2 = (await canvas(page).boundingBox()) ?? box;
    const at = (f: number) => (o === 'portrait' ? { x: b2.x + b2.width * f, y: b2.y + b2.height * 0.9 } : { x: b2.x + b2.width * 0.1, y: b2.y + b2.height * f });
    await page.mouse.move(at(0.5).x, at(0.5).y);
    await page.mouse.move(at(0.2).x, at(0.2).y);
    const v = await page.evaluate(() => Number((window as unknown as Hooks).__pong.s.playerAlong));
    expect(v).toBeGreaterThan(40);
    expect(v).toBeLessThan(90);
  });

  test('@arcade pauses on window blur and when scrolled away', async ({ page }) => {
    await page.getByRole('button', { name: 'Start game' }).click();
    await expect.poll(() => phase(page)).toMatch(/serve|play/);
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await expect.poll(() => phase(page)).toBe('paused');
    await page.getByRole('button', { name: 'Resume' }).click();
    await expect.poll(() => phase(page)).toMatch(/serve|play|point/);
    await page.evaluate(() => {
      const sp = document.createElement('div');
      sp.id = 'spacer';
      sp.style.height = '3000px';
      document.body.prepend(sp);
      window.scrollTo(0, 2900);
    });
    await expect.poll(() => phase(page)).toBe('paused');
  });

  test('@arcade pauses when a dialog opens', async ({ page }) => {
    await page.getByRole('button', { name: 'Start game' }).click();
    await expect.poll(() => phase(page)).toMatch(/serve|play/);
    await page.getByRole('button', { name: /^Open passport/ }).click();
    await expect.poll(() => phase(page)).toBe('paused');
  });

  test('@arcade scoreboard live region announces points and the result', async ({ page }) => {
    await page.getByRole('button', { name: 'Start game' }).click();
    await expect.poll(() => phase(page)).toMatch(/serve|play/);
    await page.evaluate(() => {
      const s = (window as unknown as Hooks).__pong.s as Record<string, number | string>;
      s.phase = 'play'; s.across = 478; s.vAcross = 300; s.cpuAlong = 10; s.along = 250; s.vAlong = 0;
    });
    await expect(page.getByTestId('pong-live')).toHaveText('You 1, CPU 0');
    await expect(page.getByTestId('pong-score')).toContainText('You 1');
  });

  test('@arcade winning grants XP once, lands the stamp and records the win', async ({ page }) => {
    await page.getByRole('button', { name: 'Start game' }).click();
    await page.evaluate(() => {
      const s = (window as unknown as Hooks).__pong.s as Record<string, number | string>;
      s.playerScore = 4; s.phase = 'play'; s.across = 478; s.vAcross = 300; s.cpuAlong = 10; s.along = 250; s.vAlong = 0;
    });
    await expect(page.getByTestId('pong-live')).toContainText('You win, 5 to 0. +120 FR. Arcade stamp earned.');
    await expect(page.getByRole('img', { name: /Reel Pong champion/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Play again' })).toBeVisible();
    const xp = await page.evaluate(() => (window as unknown as Hooks).__aq.state().xp);
    expect(xp).toBe(120);
    // A second win is worth 30 and does not land a second stamp.
    await page.getByRole('button', { name: 'Play again' }).click();
    await expect(page.getByRole('img', { name: /Reel Pong champion/ })).toHaveCount(0);
    await page.evaluate(() => {
      const s = (window as unknown as Hooks).__pong.s as Record<string, number | string>;
      s.playerScore = 4; s.phase = 'play'; s.across = 478; s.vAcross = 300; s.cpuAlong = 10; s.along = 250; s.vAlong = 0;
    });
    await expect(page.getByTestId('pong-live')).toContainText('You win, 5 to 0. +30 FR.');
    expect(await page.evaluate(() => (window as unknown as Hooks).__aq.state().xp)).toBe(150);
  });

  test('@arcade losing says CPU wins and grants nothing', async ({ page }) => {
    await page.getByRole('button', { name: 'Start game' }).click();
    await page.evaluate(() => {
      const s = (window as unknown as Hooks).__pong.s as Record<string, number | string>;
      s.cpuScore = 4; s.phase = 'play'; s.across = 2; s.vAcross = -300; s.playerAlong = 290; s.along = 20; s.vAlong = 0;
    });
    await expect(page.getByTestId('pong-live')).toContainText('CPU wins');
    await expect(page.locator('.pong__result')).toHaveText('CPU wins. Play again?');
    expect(await page.evaluate(() => (window as unknown as Hooks).__aq.state().xp)).toBe(0);
  });

  test('@arcade accessible mode disables difficulty and shows the note', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'Accessible mode' }).check();
    await expect(page.getByRole('radio', { name: 'Hard' })).toBeDisabled();
    await expect(page.getByText(/slower ball, no speed-up, larger paddle/)).toBeVisible();
    await page.getByRole('checkbox', { name: 'Accessible mode' }).uncheck();
    await page.getByRole('radio', { name: 'Hard' }).check();
    await expect(page.getByRole('radio', { name: 'Hard' })).toBeChecked();
  });

  test('@arcade controls are at least 44 px tall', async ({ page }) => {
    for (const loc of [page.getByRole('button', { name: 'Start game' }), page.getByRole('radio', { name: 'Easy' }).locator('xpath=..'), page.getByRole('checkbox', { name: 'Accessible mode' }).locator('xpath=..')]) {
      const b = await loc.boundingBox();
      expect(b?.height ?? 0).toBeGreaterThanOrEqual(43.5);
    }
  });
});
