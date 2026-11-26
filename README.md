# Mohammad Hamza: portfolio

"Archive Quest": a prerendered Vite + React 19 + TypeScript + Tailwind CSS v4 portfolio built as a six-level run with a VHS-tape project shelf, a small arcade and generated SEO/GEO files. The full plan is in [`docs/REVAMP_PLAN.md`](docs/REVAMP_PLAN.md); progress and deviations are in [`docs/DEV_STATUS.md`](docs/DEV_STATUS.md).

## Setup

```bash
npm ci
npm run dev        # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run test` | Vitest unit tests |
| `npm run build` | Media, client and SSR builds, prerender every route, SEO files (robots, sitemap, llms.txt, per-project Markdown), OG images, budget check |
| `npm run build:e2e` | Same build in `e2e` mode (exposes `window.__aq` test hooks and `?shelfN=`), without the budget check |
| `npm run preview` | Serve the production build |
| `npm run test:e2e` | Playwright: every spec on every installed project, then the `@throttle` specs alone with one worker (4x CPU budgets need an idle machine) |
| `npm run test:e2e -- --grep @visual` | Visual snapshots only (`--update-snapshots` after a reviewed change) |
| `npm run shots` | Review screenshots of every route at 360, 390, 768, 1024 and 1440 into `test-results/shots/` |
| `npm run lhci` | Lighthouse CI: mobile (`lighthouserc.json`) then desktop (`lighthouserc.desktop.json`); set `CHROME_PATH` if Chrome is not found |
| `npm run budgets` | Byte budgets from `dist/` (initial JS 110 KB, shelf 18 KB, arcade 14 KB, CSS 22 KB, first-view fonts and transfer) plus content guards (no phone number, no removed projects) |
| `npm run media`, `urdu`, `grain`, `seo` | Individual asset and SEO generators |

Playwright uses the browsers in its cache. If the cached Chromium revision differs from the one the installed Playwright expects, the config falls back to any cached Chromium. WebKit and Firefox projects (`mobile-390`, `tablet-768`, `reduced-390`, `firefox-1440`) only run when those browsers are installed (always in CI), so their visual baselines must be generated there.

## Test suites (`tests/e2e/`)

`smoke`, `layout` (overflow, 44 px targets, ruler never covers content), `shell`, `levels` (includes `@nojs`), `game`, `shelf` (includes `@sheet`), `arcade`, `seo`, `a11y` (axe, WCAG 2.0 to 2.2 AA), `perf` and `vitals` (CLS, long tasks, INP proxy), `motion` (reduced motion, forced colors), `visual`, `shots`.

## Content

All site content is typed data in `src/content/` (types in `src/types/content.ts`). Facts come from the owner's resume and project list; unknown values stay as visible placeholders (for example `Year: TBC`) until confirmed. The phone number is never published.

## Media workflow

Drop screenshots into `media-src/projects/<slug>/screenshot.png` (and optionally `mobile.png`); see Appendix C of the plan for sizes. `npm run media` (part of the build) turns them into covers and heroes; projects without a screenshot use a typographic fallback poster. `media-src/` is not shipped.

## Hosting

Static output in `dist/`, configured for Vercel by `vercel.json` (clean URLs, caching, real 404). Confirm a 404 status for unknown paths on the first deploy.
