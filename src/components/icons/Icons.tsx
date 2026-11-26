import type { SVGProps } from 'react';

/** Inline icons: 24 px grid, 1.5 px stroke, currentColor (plan 3.11). Decorative by default. */
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

export const IconPassport = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <circle cx="12" cy="10" r="3" />
    <path d="M8.5 16.5h7" />
  </svg>
);
export const IconGamepad = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="7" width="18" height="11" rx="5" />
    <path d="M8 10.5v4M6 12.5h4" />
    <circle cx="15.5" cy="11.5" r="0.6" fill="currentColor" />
    <circle cx="17.5" cy="13.5" r="0.6" fill="currentColor" />
  </svg>
);
export const IconMenu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const IconClose = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
