import { expect, test } from '@playwright/test';

test.describe('@levels', () => {
  test('@levels all six levels render with one H1 and real content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('section[data-level]')).toHaveCount(6);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mohammad Hamza');
    await expect(page.getByRole('heading', { level: 2, name: 'Selected projects' })).toBeVisible();
    // The ten featured tapes are a static grid first and the lazy shelf on wide, motion-allowed screens.
    await expect(page.locator('.tape-grid li, a.tape[data-copy="0"]')).toHaveCount(10);
    await expect(page.locator('#level-skills .l3__card')).toHaveCount(10);
    await expect(page.locator('#level-career [data-checkpoint]')).toHaveCount(5);
  });

  test('@levels no horizontal scroll', async ({ page }) => {
    await page.goto('/');
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over).toBeLessThanOrEqual(0);
  });

  test('@levels hero shows H1, lead and actions in the first screen above the ruler', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile-360', '360 x 740 acceptance');
    await page.goto('/');
    const ruler = await page.locator('.ruler').boundingBox();
    for (const loc of [page.locator('h1'), page.locator('.l1__lead'), page.getByRole('link', { name: 'Hire me' }).first()]) {
      const box = await loc.boundingBox();
      expect(box).not.toBeNull();
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(ruler?.y ?? 0);
    }
  });

  test('@levels phone number is never published', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toMatch(/\+91|9919/);
  });

  test('@levels red door opens when focus enters the contact card', async ({ page }, info) => {
    test.skip(info.project.name.startsWith('reduced'), 'door is open in reduced motion');
    await page.goto('/');
    const stage = page.locator('.l6__stage');
    await expect(stage).toHaveAttribute('data-door', 'closed');
    await page.locator('.l6__email a').focus();
    await expect(stage).toHaveAttribute('data-door', 'open');
  });

  test('@levels door button opens the door and removes itself', async ({ page }, info) => {
    test.skip(info.project.name.startsWith('reduced'), 'door is open in reduced motion');
    await page.goto('/');
    const btn = page.getByRole('button', { name: 'Open the red door' });
    // Scrolling to the level opens the door by itself, so click through the DOM first.
    await btn.evaluate((el) => (el as HTMLButtonElement).click());
    await expect(page.locator('.l6__stage')).toHaveAttribute('data-door', 'open');
    await expect(btn).toHaveCount(0);
  });

  test('@levels contact info is always in the DOM', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="mailto:erhamza.dev@gmail.com"]').first()).toHaveCount(1);
    await expect(page.locator('#level-contact a[href*="linkedin.com"]')).toHaveCount(1);
    await expect(page.locator('#level-contact a[href*="github.com/hamzam999"]')).toHaveCount(1);
  });

  test('@levels career mode puts a label on the ruler and returns to level mode', async ({ page }, info) => {
    test.skip(info.project.name.startsWith('reduced'), 'timing based');
    await page.goto('/');
    await page.evaluate(() => document.querySelector('#level-career [data-checkpoint][data-label*="ITH"]')?.scrollIntoView({ block: 'center' }));
    await expect(page.locator('.ruler--career .ruler__label')).toContainText('ITH Technologies');
    await page.evaluate(() => document.querySelector('#level-spawn')?.scrollIntoView());
    await expect(page.locator('.ruler--career')).toHaveCount(0);
  });

  test('@levels project page shows detail and grants project XP once', async ({ page }) => {
    await page.goto('/projects/navig');
    await page.waitForFunction(() => '__aq' in window);
    await expect(page.getByRole('heading', { level: 1, name: 'NAVIG' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Visit live site/ })).toBeVisible();
    const xp = await page.evaluate(() => (window as unknown as { __aq: { state: () => { xp: number } } }).__aq.state().xp);
    expect(xp).toBe(20);
  });

  test('@levels archive page lists all 17 projects and earlier work', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('.archive__row')).toHaveCount(17);
    await expect(page.locator('#earlier-work li')).toHaveCount(5);
  });

  test('@levels earlier work opens from the hash', async ({ page }) => {
    await page.goto('/#earlier-work');
    await expect(page.locator('#earlier-work details')).toHaveAttribute('open', '');
  });

  test('@levels interview page filters and shows an answer', async ({ page }) => {
    await page.goto('/interview-framework');
    await page.getByRole('button', { name: 'React', exact: true }).click();
    await page.locator('.iv-card').first().click();
    await expect(page.locator('.iv-detail__h:visible').first()).toBeVisible();
  });
});

test.describe('@levels game', () => {
  test('@levels clearing level 3 unlocks the arcade label; contact click grants door XP', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => '__aq' in window);
    await page.evaluate(() => {
      const w = window as unknown as { __aq: { grant: (id: string) => number } };
      w.__aq.grant('level:3:clear');
    });
    await expect(page.locator('footer').getByRole('link', { name: /^Arcade/ })).toContainText('NEW');
    const gained = await page.evaluate(() => (window as unknown as { __aq: { grant: (id: string) => number } }).__aq.grant('door:contact'));
    expect(gained).toBe(100);
  });
});

test.describe('@nojs', () => {
  test('@nojs all level text and contact links are in the static HTML', async ({ page }, info) => {
    test.skip(info.project.name !== 'nojs-1440', 'JavaScript-disabled project only');
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Mohammad Hamza');
    await expect(page.getByText('Results-driven Frontend Engineer').first()).toBeVisible();
    await expect(page.locator('.l1__actions a')).toHaveCount(3);
    await expect(page.locator('.l6__email a')).toBeVisible();
    await expect(page.locator('.l6__door')).toBeHidden();
    await expect(page.locator('.tape-grid a').first()).toBeVisible();
    await expect(page.locator('#earlier-work')).toHaveCount(1);
    await expect(page.locator('.l5__card').first()).toBeVisible();
  });
});

test.describe('@levels round 2', () => {
  test('@levels top bar shows the six levels as links from 1024 px and jumps with focus', async ({ page }, info) => {
    test.skip((info.project.use.viewport?.width ?? 0) < 1024, 'inline level links are desktop only');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Jump to a level' });
    await expect(nav.getByRole('link')).toHaveCount(6);
    await nav.getByRole('link', { name: /06/ }).click();
    await expect(page.locator('#level-contact-heading')).toBeFocused();
    await expect(nav.getByRole('link', { name: /06/ })).toHaveAttribute('aria-current', 'location');
  });

  test('@levels last level is Open Door with the new copy and no boss wording', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#level-contact .level__eyebrow')).toContainText('OPEN DOOR');
    await expect(page.locator('.l6__lead')).toHaveText('Whether it’s a storefront, a dashboard, a 3D landing page, an ERP or anything else, let’s connect and talk it through.');
    await expect(page.locator('.l6__chip')).toContainText('Available for collaborations, remote');
    expect(await page.content()).not.toMatch(/Final Boss|Boss defeated/i);
  });

  test('@levels Urdu words are decorative, lang=ur, rtl and no Japanese remains', async ({ page }) => {
    await page.goto('/');
    const words = page.locator('.halftone');
    await expect(words).toHaveCount(6);
    for (const w of await words.all()) {
      await expect(w).toHaveAttribute('lang', 'ur');
      await expect(w).toHaveAttribute('dir', 'rtl');
      await expect(w).toHaveAttribute('aria-hidden', 'true');
    }
    expect(await page.content()).not.toMatch(new RegExp('[\\u3040-\\u30ff\\u4e00-\\u9fff]'));
  });

  test('@levels logo, collage and portrait slot render without broken images', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Mohammad Hamza, home' })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.src));
    expect(broken).toEqual([]);
    await expect(page.locator('.portrait')).toHaveCount(1);
    await expect(page.locator('.collage img.print, .collage .print img')).toHaveCount(3);
  });
});
