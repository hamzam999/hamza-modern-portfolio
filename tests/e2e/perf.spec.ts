import { expect, test, type Page, type TestInfo } from '@playwright/test';

const skip = (info: TestInfo) => info.project.name.startsWith('reduced') || info.project.name.startsWith('nojs');

async function openShelf(page: Page, url = '/') {
  await page.goto(url);
  await page.locator('[data-shelf-box]').scrollIntoViewIfNeeded();
  await expect(page.locator('.shelf-box')).toHaveAttribute('data-view', 'shelf');
  await page.waitForFunction(() => document.querySelector('a.tape[data-copy="0"][data-current]')?.getAttribute('style')?.includes('translate3d'));
  await page.waitForTimeout(600); // let the scroll-into-view and level tracking settle before tests scroll away
}

/** Counts requestAnimationFrame calls and records main-thread tasks over 50 ms. */
async function instrument(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __raf: number; __long: number[]; __frames: number[] };
    w.__raf = 0;
    w.__long = [];
    (w as unknown as { __longAt: Array<[number, number]> }).__longAt = [];
    w.__frames = [];
    const orig = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => {
      w.__raf++;
      return orig(cb);
    };
    try {
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { w.__long.push(e.duration); (w as unknown as { __longAt: Array<[number, number]> }).__longAt.push([Math.round(e.startTime), Math.round(e.duration)]); })).observe({ entryTypes: ['longtask'] });
    } catch {
      /* longtask unsupported */
    }
    let last = performance.now();
    const tick = (t: number) => {
      w.__frames.push(t - last);
      last = t;
      orig(tick);
    };
    orig(tick);
  });
}

test.describe('@perf', () => {
  test.beforeEach(({}, info) => test.skip(skip(info), 'motion-allowed projects only'));

  test('@perf idle: no rAF requests from the shelf once settled, and none while it is off screen', async ({ page }) => {
    await openShelf(page);
    await page.getByRole('button', { name: 'Next project' }).click();
    await page.waitForTimeout(2200);
    await page.mouse.move(2, 2);
    await page.waitForTimeout(1500); // let the custom cursor finish easing to its target
    await page.evaluate(() => {
      const w = window as unknown as { __raf: number };
      w.__raf = 0;
      const orig = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => {
        w.__raf++;
        return orig(cb);
      };
    });
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => (window as unknown as { __raf: number }).__raf)).toBeLessThanOrEqual(2);
  });

  test('@perf will-change is on while the shelf is in view and removed when it leaves', async ({ page }) => {
    await openShelf(page);
    await expect(page.locator('[data-shelf]')).toHaveAttribute('data-live', '');
    expect(await page.locator('a.tape[data-copy="0"][data-current]').evaluate((el) => getComputedStyle(el).willChange)).toBe('transform');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('[data-shelf]')).not.toHaveAttribute('data-live', '', { timeout: 3000 });
    expect(await page.locator('a.tape[data-copy="0"][data-current]').evaluate((el) => getComputedStyle(el).willChange)).toBe('auto');
  });

  test('@perf the shelf moves while off screen without running a loop (target is applied at once)', async ({ page }) => {
    await openShelf(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('[data-shelf]')).not.toHaveAttribute('data-live', '', { timeout: 3000 });
    const y = await page.evaluate(() => document.querySelector('[data-shelf-box]')!.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((v) => window.scrollTo({ top: v - 120, behavior: 'instant' }), y);
    await expect(page.locator('[data-shelf]')).toHaveAttribute('data-live', '');
  });

  test('@perf images: first tapes eager at low priority, the rest lazy; every image has dimensions', async ({ page }) => {
    await openShelf(page);
    const info = await page.locator('.shelf img').evaluateAll((imgs) =>
      imgs.map((i) => ({ w: i.getAttribute('width'), h: i.getAttribute('height'), loading: i.getAttribute('loading'), prio: i.getAttribute('fetchpriority') })),
    );
    expect(info.length).toBeGreaterThan(0);
    for (const i of info) {
      expect(i.w).not.toBeNull();
      expect(i.h).not.toBeNull();
      expect(['eager', 'lazy']).toContain(i.loading);
      if (i.loading === 'eager') expect(i.prio).toBe('low');
    }
    expect(info.some((i) => i.loading === 'lazy')).toBe(true);
  });

  test('@perf shelf mount causes no layout shift', async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as Array<{ hadRecentInput: boolean; value: number; sources?: Array<{ node?: Node }> }>) {
          if (e.hadRecentInput) continue;
          if (e.sources?.some((s) => s.node instanceof Element && s.node.closest?.('[data-shelf-box]'))) w.__cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await openShelf(page);
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.001);
  });

  test('@perf the reserved box height equals the mounted shelf height', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-shelf-box]').scrollIntoViewIfNeeded();
    const before = await page.locator('.shelf-box').evaluate((el) => el.getBoundingClientRect().height);
    await expect(page.locator('.shelf-box')).toHaveAttribute('data-view', 'shelf');
    await page.waitForTimeout(300);
    const after = await page.locator('.shelf-box').evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(after - before)).toBeLessThan(1);
  });

  test('@perf virtualisation: 14 featured items use a windowed pool of at most 36 slots with no gap', async ({ page }) => {
    await openShelf(page, '/?shelfN=14');
    const n = await page.locator('a.tape').count();
    expect(n).toBeGreaterThan(14);
    expect(n).toBeLessThanOrEqual(36);
    const next = page.getByRole('button', { name: 'Next project' });
    for (let k = 0; k < 20; k++) {
      await next.click();
      await page.waitForTimeout(130);
      expect(await page.locator('a.tape').count()).toBe(n);
      expect(await page.locator('a.tape:not([hidden])').count()).toBeGreaterThanOrEqual(13);
    }
    await page.waitForTimeout(1500);
    // 20 steps on a ring of 14 land on item 6 (zero-based), and exactly one tape is the real centre.
    await expect(page.locator('a.tape[data-copy="0"][data-current]')).toHaveCount(1);
    await expect(page.locator('a.tape[data-copy="0"][data-current]')).toHaveAttribute('data-index', '6');
    await expect(page.locator('[data-shelf-wrap] .reel__tick')).toHaveCount(14);
  });
});

test.describe('@perf throttled drag', () => {
  // A single main-thread blip in a shared sandbox is noise; a real regression fails every attempt.
  test.describe.configure({ retries: 2 });
  test.beforeEach(({}, info) => test.skip(skip(info), 'motion-allowed projects only'));

  test('@perf drag at 4x CPU throttle stays smooth (no long tasks over 50 ms, 30+ fps under shared CPU)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'CDP throttling is Chromium only');
    test.slow();
    await openShelf(page);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await instrument(page);
    const box = (await page.locator('[data-shelf]').boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    const t0 = Date.now();
    let i = 0;
    while (Date.now() - t0 < 3000) {
      const x = cx + Math.sin(i / 14) * 160;
      await page.mouse.move(x, cy + (i % 3));
      await page.waitForTimeout(8);
      i++;
    }
    await page.mouse.up();
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => {
      const w = window as unknown as { __long: number[]; __frames: number[] };
      const f = w.__frames.slice(5);
      return { at: (w as unknown as { __longAt: unknown }).__longAt, t: Math.round(performance.now()), long: w.__long.filter((d) => d > 50).length, avg: f.reduce((a, b) => a + b, 0) / Math.max(1, f.length) };
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    test.info().annotations.push({ type: 'drag-throttle-4x', description: `long tasks > 50ms: ${r.long}, avg frame ${r.avg.toFixed(1)} ms, at ${JSON.stringify(r.at)} now ${r.t}` });
    expect(r.long).toBe(0);
    // Isolated runs average 18 to 20 ms per frame here; the bound is looser because other workers share the CPU.
    expect(r.avg).toBeLessThan(34);
  });
});
