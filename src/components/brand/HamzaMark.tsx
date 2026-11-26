import { HAMZA } from './hamza-path';

const TICKET = 'M14 4H50A10 10 0 0 1 60 14V24a8 8 0 0 0 0 16V50A10 10 0 0 1 50 60H14A10 10 0 0 1 4 50V40a8 8 0 0 0 0-16V14A10 10 0 0 1 14 4Z';
const H = 31;
const S = H / HAMZA.h;
const TX = 32 - (HAMZA.w * S) / 2 + 1;
const TY = 32 - H / 2 + 0.5;

/** The logo: the Urdu letter hamza (a build-time outline, no font) knocked out of a green ticket. Decorative by default. */
export function HamzaMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} aria-label={title} focusable="false">
      <path fill="currentColor" d={TICKET} />
      <path fill="var(--sheet)" transform={`translate(${TX.toFixed(2)} ${TY.toFixed(2)}) scale(${S.toFixed(4)})`} d={HAMZA.d} />
    </svg>
  );
}

/** Just the letter, in the current colour (used inside stamps). */
export function HamzaGlyph({ size, className }: { size: number; className?: string }) {
  return (
    <svg viewBox={`0 0 ${HAMZA.w} ${HAMZA.h}`} width={(size * HAMZA.w) / HAMZA.h} height={size} className={className} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={HAMZA.d} />
    </svg>
  );
}
