/** Every Japanese string shown on the site. `scripts/subset-jp-fonts.mjs` reads this file. */
export const JP = {
  level: 'レベル',
  levels: {
    spawn: 'はじめ',
    origin: 'げんてん',
    skills: 'わざ',
    archive: 'さくひん',
    career: 'けいけん',
    contact: 'れんらく',
  },
  arcade: 'あそび',
  notFound: 'まよい',
} as const;

/** Giant halftone kanji per level, arcade and 404 (plan 3.8). Rendered as SVG paths, not text. */
export const KANJI = {
  spawn: '始',
  origin: '原点',
  skills: '技',
  archive: '作品',
  career: '経験',
  contact: '連絡',
  arcade: '遊',
  notFound: '迷',
} as const;
