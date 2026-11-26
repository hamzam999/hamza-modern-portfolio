import sharp from 'sharp';
const [,, src, out, cols='5', H='900'] = process.argv;
sharp.cache(false);
const m = await sharp(src, {limitInputPixels:false}).metadata();
const c=+cols, colH=Math.ceil(m.height/c); const cw=Math.round(m.width/ (m.width>800?3:1));
const parts=[];
for(let i=0;i<c;i++){
  const top=i*colH, h=Math.min(colH,m.height-top); if(h<=0)break;
  const buf=await sharp(src,{limitInputPixels:false}).extract({left:0,top,width:m.width,height:h}).resize({width:cw}).png().toBuffer();
  parts.push({input:buf,left:i*(cw+8),top:0});
}
const th=Math.round(colH*cw/m.width);
await sharp({create:{width:parts.length*(cw+8),height:th+20,channels:3,background:'#f0f'}}).composite(parts).png().toBuffer().then(b=>sharp(b).resize({height:+H}).jpeg({quality:70}).toFile(out));
console.log(m.width,m.height);
