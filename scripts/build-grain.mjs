// Generates public/textures/grain.webp (plan 3.9) from the reference feTurbulence filter.
import sharp from 'sharp';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .42 0 0 0 0 .38 0 0 0 .22 0"/></filter><rect width="256" height="256" filter="url(#n)"/></svg>`;
mkdirSync('public/textures', { recursive: true });
const buf = await sharp(Buffer.from(svg)).webp({ quality: 10, alphaQuality: 12, smartSubsample: true, effort: 6 }).toBuffer();
writeFileSync('public/textures/grain.webp', buf);
console.log(`grain.webp ${statSync('public/textures/grain.webp').size} bytes`);
