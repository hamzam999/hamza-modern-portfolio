// Subsets Noto Sans JP (instanced at wght 500) to the characters in the JP object of src/content/jp.ts.
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';

const SRC = 'media-src/fonts/NotoSansJP-VariableFont_wght.ttf';
const OUT_DIR = 'public/fonts';
const CSS = 'src/styles/fonts.css';

const jpSource = readFileSync('src/content/jp.ts', 'utf8');
// Only the JP labels use the font; the KANJI object is rendered as SVG paths.
const labelsPart = jpSource.split('export const KANJI')[0] ?? jpSource;
const chars = [...new Set([...labelsPart].filter((c) => c.codePointAt(0) > 0x7f))].sort();
if (chars.length === 0) throw new Error('No JP characters found in src/content/jp.ts');

mkdirSync('public/fonts', { recursive: true });
const out = await subsetFont(readFileSync(SRC), chars.join(''), {
  targetFormat: 'woff2',
  variationAxes: { wght: 500 },
});
// Content-hashed file name so the one-year immutable cache in vercel.json is safe.
const hash = createHash('sha1').update(out).digest('hex').slice(0, 8);
const name = `noto-sans-jp-500-subset.${hash}.woff2`;
const OUT = `${OUT_DIR}/${name}`;
for (const f of readdirSync(OUT_DIR)) if (/^noto-sans-jp-500-subset.*\.woff2$/.test(f)) rmSync(`${OUT_DIR}/${f}`);
writeFileSync(OUT, out);
writeFileSync(CSS, readFileSync(CSS, 'utf8').replace(/\/fonts\/noto-sans-jp-500-subset[\w.]*\.woff2/, `/fonts/${name}`));
writeFileSync('src/content/jp-glyphs.lock', chars.join('') + '\n');
const ranges = chars.map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(', ');
console.log(`${OUT}: ${statSync(OUT).size} bytes, ${chars.length} glyphs\nunicode-range: ${ranges}`);
