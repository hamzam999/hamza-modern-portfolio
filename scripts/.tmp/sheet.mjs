import { chromium } from '@playwright/test';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args:['--no-sandbox'] });
for (const [w,h] of [[390,844],[1440,900]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor: w<500?2:1 });
  const p = await ctx.newPage();
  const reqs=[];
  p.on('request', r=>{ if(/full-(desktop|mobile)/.test(r.url())) reqs.push(r.url().split('/').slice(-2).join('/')); });
  await p.goto('http://localhost:4173/');
  await p.locator('[data-shelf-box]').scrollIntoViewIfNeeded();
  await p.locator('[data-shelf]').waitFor({ state: 'attached' });
  await p.waitForTimeout(2500);
  await p.locator('a.tape[data-copy="0"][data-index="0"]').focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(2500);
  console.log(w,'reqs before scroll', reqs);
  const dlg = p.locator('dialog.sheet');
  await dlg.locator('.fpl').scrollIntoViewIfNeeded();
  await p.waitForTimeout(1500);
  await p.screenshot({ path:`/tmp/claude-0/prev/sheet-${w}.png` });
  console.log(w,'reqs after', reqs);
  await dlg.getByRole('button',{name:/Open full size/}).first().click();
  await p.waitForTimeout(900);
  await p.screenshot({ path:`/tmp/claude-0/prev/lb-${w}.png` });
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  console.log('sheet still open after Esc', await p.locator('dialog.sheet[open]').count());
  await ctx.close();
}
await b.close();
