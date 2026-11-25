# Mohammad Hamza: portfolio

Vite + React 19 + TypeScript + Tailwind CSS v4. The site is being rebuilt as "Archive Quest"; the full plan is in [`docs/REVAMP_PLAN.md`](docs/REVAMP_PLAN.md) and progress is tracked in [`docs/DEV_STATUS.md`](docs/DEV_STATUS.md).

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
| `npm run build` | Production build (`vite build`); prerender, SEO files and budget checks are added in later phases |
| `npm run preview` | Serve the production build |
| `npm run test:e2e` | Playwright tests (builds and serves the site itself) |
| `npm run lhci` | Lighthouse CI (from Phase 6) |
| `npm run budgets` | Bundle budget check (from Phase 1) |

Playwright uses the browsers in its cache. If the cached Chromium revision differs from the one the installed Playwright expects, the config falls back to any cached Chromium. WebKit and Firefox projects only run when those browsers are installed (always in CI).

## Content

All site content is typed data in `src/content/` (types in `src/types/content.ts`). Facts come from the owner's resume and project list; unknown values stay as visible placeholders (for example `Year: TBC`) until confirmed. The phone number is never published.

## Media workflow

Drop screenshots into `media-src/projects/<slug>/screenshot.png` (and optionally `mobile.png`); see Appendix C of the plan for sizes. A media script that turns them into covers and heroes arrives in Phase 3; until then projects use a typographic fallback poster. `media-src/` is not shipped.
