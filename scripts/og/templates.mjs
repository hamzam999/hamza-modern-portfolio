// Open Graph card templates (plan 9.9) as plain satori element trees (no JSX runtime needed in a .mjs script).
export const COLORS = { paper: '#ECE8E0', ink: '#141414', cobalt: '#1F3FB0', graphite: '#2A2A2A', muted: '#5E5B55' };
const SWATCH = { cobalt: COLORS.cobalt, ink: COLORS.ink, graphite: COLORS.graphite, paper: '#D9D3C6' };
const h = (type, style, ...children) => ({ type, props: { style: { display: 'flex', ...style }, children: children.flat().filter((c) => c !== null) } });
const text = (style, s) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children: s } });

/** Halftone kanji as an SVG data URI: a dot grid masked by the glyph outlines (mirrors HalftoneKanji). */
export function halftoneKanji(glyphs, upem, chars, size) {
  const paths = [];
  let x = 0;
  for (const c of chars) {
    const g = glyphs[c];
    if (!g) throw new Error(`kanji glyph missing for ${c}`);
    paths.push(`<path transform="translate(${x} 0)" d="${g.d}"/>`);
    x += g.advance;
  }
  const w = x;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${upem}" width="${Math.round((size * w) / upem)}" height="${size}">
<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${upem}"><g fill="#fff">${paths.join('')}</g></mask>
<pattern id="p" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="8" fill="${COLORS.cobalt}"/></pattern></defs>
<rect width="${w}" height="${upem}" fill="url(#p)" mask="url(#m)"/></svg>`;
  return { uri: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`, width: Math.round((size * w) / upem), height: size };
}

function ruler() {
  const ticks = Array.from({ length: 41 }, (_, i) => h('div', { width: 2, height: i % 5 === 0 ? 22 : 12, background: COLORS.ink, marginRight: 28 }));
  return h('div', { position: 'absolute', left: 0, bottom: 0, width: 1200, height: 34, alignItems: 'flex-end', paddingLeft: 40, paddingBottom: 0, borderTop: `2px solid ${COLORS.ink}` }, ...ticks);
}

/** Site card: default, projects, arcade, interview. */
export function siteCard({ title, line, focus, kanji }) {
  return h(
    'div',
    { width: 1200, height: 630, background: COLORS.paper, position: 'relative', fontFamily: 'Inter Tight', color: COLORS.ink },
    h('div', { position: 'absolute', right: 30, top: 70, opacity: 0.9 }, { type: 'img', props: { src: kanji.uri, width: kanji.width, height: kanji.height } }),
    h(
      'div',
      { flexDirection: 'column', position: 'absolute', left: 64, top: 130, width: 520 },
      text({ fontSize: title.length > 20 ? 64 : 96, fontWeight: 600, color: COLORS.cobalt, lineHeight: 1.05, letterSpacing: -2 }, title),
      text({ fontSize: 40, marginTop: 22, fontWeight: 600 }, line),
      focus ? text({ fontFamily: 'Newsreader', fontSize: 30, marginTop: 26, color: COLORS.muted }, focus) : null,
    ),
    ruler(),
  );
}

/** Project card: hero crop (or swatch poster) on the left, text on paper on the right. */
export function projectCard({ eyebrow, title, summary, imageUri, swatch, spine }) {
  const left = imageUri
    ? h('div', { width: 600, height: 630, flexShrink: 0 }, { type: 'img', props: { src: imageUri, width: 600, height: 630 } })
    : h('div', { width: 600, height: 630, flexShrink: 0, background: SWATCH[swatch] ?? COLORS.ink, alignItems: 'center', justifyContent: 'center', padding: 40 }, text({ fontSize: 76, fontWeight: 600, color: swatch === 'paper' ? COLORS.ink : COLORS.paper, letterSpacing: 2, textAlign: 'center' }, spine));
  return h(
    'div',
    { width: 1200, height: 630, background: COLORS.paper, fontFamily: 'Inter Tight', color: COLORS.ink, position: 'relative' },
    left,
    h(
      'div',
      { flexDirection: 'column', width: 600, flexShrink: 0, height: 630, paddingTop: 64, paddingBottom: 64, paddingLeft: 56, paddingRight: 48, justifyContent: 'space-between' },
      h(
        'div',
        { flexDirection: 'column' },
        text({ fontSize: 22, fontWeight: 600, color: COLORS.cobalt, letterSpacing: 3, textTransform: 'uppercase' }, eyebrow),
        text({ fontSize: title.length > 18 ? 56 : 68, fontWeight: 600, lineHeight: 1.05, marginTop: 20, letterSpacing: -1.5 }, title),
        text({ fontFamily: 'Newsreader', fontSize: 28, lineHeight: 1.35, marginTop: 24, color: COLORS.muted }, summary),
      ),
      text({ fontSize: 26, fontWeight: 600 }, 'Mohammad Hamza'),
    ),
    h('div', { position: 'absolute', left: 600, top: 0, width: 4, height: 630, background: COLORS.cobalt }),
  );
}
