import sharp from 'sharp';
const [,, src, out, top, h, w='1440'] = process.argv;
await sharp(src,{limitInputPixels:false}).extract({left:0,top:+top,width:+w,height:+h}).jpeg({quality:80}).toFile(out);
