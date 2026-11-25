import { KANJI_GLYPHS, KANJI_UPEM } from '@/content/kanji-paths';

interface Props {
  text: string;
  className?: string;
}

/** Builds the SVG mask once per string, so server and client output are identical. */
function maskUrl(chars: readonly string[]): string {
  const paths = chars
    .map((c, i) => {
      const g = KANJI_GLYPHS[c];
      return g ? `<path transform="translate(0 ${i * KANJI_UPEM})" d="${g.d}"/>` : '';
    })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${KANJI_UPEM} ${KANJI_UPEM * chars.length}"><g fill="#000">${paths}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Giant halftone kanji (plan 3.8): glyph outlines were converted to SVG paths at build time, so no font is loaded
 * and nothing shifts. The paths mask a CSS dot grid (3 px pitch, as in the reference). Decorative only.
 * Size comes from --fs-kanji per glyph; the parent must clip overflow.
 */
export function HalftoneKanji({ text, className }: Props) {
  const chars = [...text];
  return (
    <span
      aria-hidden="true"
      className={`halftone kanji${className ? ` ${className}` : ''}`}
      style={{ '--n': chars.length, '--mask': maskUrl(chars) } as React.CSSProperties}
    />
  );
}
