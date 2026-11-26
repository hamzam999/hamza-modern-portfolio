import { chromium } from '@playwright/test';
const CH='/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const b = await chromium.launch({ executablePath: CH, args:['--no-sandbox'] });
const out='/tmp/claude-0/prev/';
for (const slug of ['navig','lammles','studio-solyn']) for (const w of [360,768,1440]) {
  const ctx = await b.newContext({ viewport:{width:w,height:900}, deviceScaleFactor: w<500?2:1 });
  const p = await ctx.newPage();
  await p.goto(`http://localhost:4173/projects/${slug}`);
  await p.waitForTimeout(800);
  const sec = p.locator('.fpl');
  await sec.scrollIntoViewIfNeeded();
  await p.waitForTimeout(1500);
  await sec.screenshot({ path: `${out}pp-${slug}-${w}.png` });
  console.log(slug,w, JSON.stringify(await p.evaluate(()=>({sw:document.documentElement.scrollWidth, iw:innerWidth}))));
  await ctx.close();
}
await b.close();
