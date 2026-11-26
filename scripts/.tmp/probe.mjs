import { chromium } from '@playwright/test';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args:['--no-sandbox'] });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
const p = await ctx.newPage();
const fails=[];
p.on('requestfailed', r=>fails.push(r.url().slice(0,100)+' '+(r.failure()?.errorText)));
await p.goto('https://www.lammles.com/',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
for (let y=0;y<4000;y+=300){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(400);}
await p.evaluate(()=>scrollTo(0,0));
const info = await p.evaluate(()=>{
  const out=[];
  for (const s of document.querySelectorAll('body *')) { if (s.parentElement===document.body) {} else if (!(s.matches('section,div') && s.getBoundingClientRect().height>200 && s.getBoundingClientRect().width>1200)) continue;
    const r=s.getBoundingClientRect();
    if (r.top+scrollY>700 && r.top+scrollY<1500) out.push([s.id||s.className.slice(0,60), Math.round(r.top+scrollY), Math.round(r.height), s.innerText.trim().slice(0,40)]);
  }
  return out;
});
console.log(JSON.stringify(info,null,1)); console.log(fails.slice(0,15).join('\n'));
await b.close();
