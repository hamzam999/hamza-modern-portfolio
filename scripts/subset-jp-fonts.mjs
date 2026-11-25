// Subsets Noto Sans JP (instanced at wght 500) to the characters in the JP object of src/content/jp.ts.
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';

const SRC = 'media-src/fonts/NotoSansJP-VariableFont_wght.ttf';
const OUT = 'public/fonts/noto-sans-jp-500-subset.woff2';

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
writeFileSync(OUT, out);
writeFileSync('src/content/jp-glyphs.lock', chars.join('') + '\n');
const ranges = chars.map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(', ');
console.log(`${OUT}: ${statSync(OUT).size} bytes, ${chars.length} glyphs\nunicode-range: ${ranges}`);
