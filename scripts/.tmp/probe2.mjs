import { chromium } from '@playwright/test';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args:['--no-sandbox'] });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
const p = await ctx.newPage();
await p.goto('https://www.lammles.com/',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
console.log(await p.evaluate(()=>{
  const it=[...document.querySelectorAll('.slide-banner-item')];
  return it.map(e=>({cls:e.className, parent:e.parentElement.className.slice(0,80), gp:e.parentElement.parentElement.className.slice(0,80), top:Math.round(e.getBoundingClientRect().top+scrollY), h:Math.round(e.getBoundingClientRect().height), html:e.innerHTML.slice(0,300)}));
}));
await b.close();
