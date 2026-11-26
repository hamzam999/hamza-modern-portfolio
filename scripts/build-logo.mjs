// Logo files (npm run urdu): public/favicon.svg, apple-touch-icon.png (180), icon-512.png, logo-mark.svg.
// The mark is the Urdu letter hamza (outline from src/components/brand/hamza-path.ts) knocked out of a cobalt ticket.
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { HAMZA_SRC } from './logo-src.mjs';

const { d, w, h } = HAMZA_SRC;
const COBALT = '#1F3FB0';
const PAPER = '#ECE8E0';
const SHEET = '#F3F0EA';
const TICKET = 'M14 4H50A10 10 0 0 1 60 14V24a8 8 0 0 0 0 16V50A10 10 0 0 1 50 60H14A10 10 0 0 1 4 50V40a8 8 0 0 0 0-16V14A10 10 0 0 1 14 4Z';
const H = 31;
const s = H / h;
const tx = 32 - (w * s) / 2 + 1;
const ty = 32 - H / 2 + 0.5;
const glyph = `<path fill="${SHEET}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})" d="${d}"/>`;
const mark = `<path fill="${COBALT}" d="${TICKET}"/>${glyph}`;

writeFileSync('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${mark}</svg>\n`);
writeFileSync('public/logo-mark.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Mohammad Hamza logo: the Urdu letter hamza on a ticket"><rect width="64" height="64" fill="${PAPER}"/><g transform="translate(6.4 6.4) scale(0.8)">${mark}</g></svg>\n`);

const png = (svg, size) => new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
const padded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${PAPER}"/><g transform="translate(7.5 7.5) scale(0.766)">${mark}</g></svg>`;
writeFileSync('public/apple-touch-icon.png', png(padded, 180));
writeFileSync('public/icon-512.png', png(padded, 512));
console.log('logo: favicon.svg, logo-mark.svg, apple-touch-icon.png, icon-512.png');
