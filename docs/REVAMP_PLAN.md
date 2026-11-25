# Archive Quest: Portfolio UI Revamp Plan

**Owner:** Mohammad Hamza, Senior Frontend Engineer
**Repository:** `hamza-modern-portfolio` (Vite + React 19 + TypeScript)
**Plan author:** Opus planning lead. **Executors:** Sonnet developer agents, with Opus review gates.
**Status:** Draft for owner review. Nothing in this plan has been implemented yet.
**Date:** 2026-11-25

This document is the single source of truth for the revamp. It is written so that a developer agent can pick up any task in Section 10, read only the sections that task references, and finish it without guessing. Where the plan makes an assumption about the owner (dates, roles, domain, naming permissions), it says so with the tag **[ASSUMPTION]** or lists it in Section 12 as an open question. Agents must not resolve those by inventing facts; they leave the clearly marked placeholder in place.

Conventions used throughout:

- File paths are relative to the repository root unless they start with `/`.
- "Level" means one of the six sections of the landing page. Levels are numbered 1 to 6.
- `--token` names refer to the CSS custom properties defined in Appendix A.
- "Reduced motion" means `prefers-reduced-motion: reduce` **or** the in-site "Motion: off" setting.
- Every task in Section 10 has an ID such as `P3-5`. Commit messages and review notes should cite that ID.

---

## Table of contents

1. Goals, non-goals and success criteria
2. Current-state audit
3. Design system
4. Architecture
5. Section-by-section revamp (levels, chrome, secondary pages)
6. The VHS Archive shelf in depth
7. Gamification system
8. Arcade page
9. SEO and GEO
10. Phased execution roadmap
11. Testing plan
12. Risks and open questions for the owner
13. Appendices: CSS tokens, TypeScript data types, screenshot spec sheet, project data

---

## 1. Goals, non-goals and success criteria

### 1.1 Goals

1. **Replace the dark "cyber cyan" site with the "Archive Quest" world**: warm paper, cobalt ink, a film-archive and VHS metaphor, and a light gamified roadmap of six levels on one landing page.
2. **Show the work properly.** The 18 real projects from the owner's CSV replace the old `PROJECTS` array. The best ten sit on a curved VHS shelf; all 18 are listed in a plain index and have their own crawlable page at `/projects/<slug>`.
3. **Make the site findable by search engines and language models.** Every piece of real text exists as semantic HTML in prerendered files. The site ships `llms.txt`, `llms-full.txt`, `sitemap.xml`, `robots.txt`, JSON-LD and Open Graph images.
4. **Feel fast and correct on phones first.** The site must work without layout bugs at 360, 390, 768, 1024 and 1440 pixels wide, on iOS Safari and Android Chrome, with touch, mouse and keyboard.
5. **Treat accessibility and reduced motion as first-class modes**, not as afterthoughts. The game layer is optional, skippable and can be switched off.
6. **Leave the codebase easier to work on**: one source of content, typed data, a real Tailwind build instead of the CDN script, tests, and a repeatable media pipeline so the owner can drop in screenshots later.

### 1.2 Non-goals

- No dark mode. The design is a single-theme world (paper). The site sets `color-scheme: light` and respects `forced-colors`.
- No WebGL or Three.js on the landing page. The 3D feel of the shelf is CSS 3D transforms only. (`three` is removed from dependencies; it can return later for a dedicated experiment page.)
- No CMS, no backend, no analytics beyond what the owner later chooses. XP lives in `localStorage` only.
- No migration to Next.js. The `nextjs-app-router-patterns` skill is reference material only.
- No rewrite of the interview question content in `interviewData.ts`; that page is re-skinned only (see 5.10).
- No invented facts. Years, roles and claims that the owner has not confirmed stay as visible placeholders (for example `Year: TBC`).

### 1.3 Success criteria (measurable)

All numbers are checked in Phase 6 (Section 11) on a production build served by `npm run preview` and, where stated, on the deployed site.

| Area | Criterion | How it is measured |
|---|---|---|
| Lighthouse, mobile (simulated Moto G Power, slow 4G) | Performance ≥ 95 on `/` and `/projects/navig`; ≥ 90 on `/arcade`. Accessibility = 100. Best Practices ≥ 95. SEO = 100. | `npx lhci autorun` with `lighthouserc.json` (Section 11.5) |
| Lighthouse, desktop | Performance ≥ 98 on `/`; other categories as mobile | same, desktop preset |
| LCP | Lab ≤ 2.0 s mobile; field p75 ≤ 2.5 s | Lighthouse; later CrUX or `web-vitals` if the owner adds analytics |
| CLS | ≤ 0.05 lab and field (threshold 0.1) | Lighthouse plus a Playwright `PerformanceObserver` check |
| INP | ≤ 150 ms for shelf drag, ruler tap, passport open (threshold 200 ms) | Playwright trace with 4x CPU throttle; `web-vitals` onINP in a test page |
| TBT (lab proxy for INP) | ≤ 150 ms mobile | Lighthouse |
| JavaScript | Initial JS for `/` ≤ 110 KB gzip; shelf chunk ≤ 18 KB; arcade chunk ≤ 14 KB; interview page chunk loaded only on that route | `scripts/check-budgets.mjs` reading `dist/.vite/manifest.json` |
| CSS | ≤ 22 KB gzip total | same script |
| Fonts on first view | ≤ 5 WOFF2 files, ≤ 150 KB total | same script plus Lighthouse network list |
| Accessibility | Zero axe violations (WCAG 2.0 A/AA, 2.1 AA, 2.2 AA tags) on every route, in default and reduced-motion modes; full keyboard path through all levels, shelf, detail sheet, passport and arcade | `@axe-core/playwright`; keyboard Playwright spec |
| Touch targets | Every interactive element ≥ 44 × 44 CSS px hit area (WCAG 2.5.8 needs 24; we hold 44) | Playwright script measuring bounding boxes of `a, button, [role=button], [tabindex="0"]` |
| Mobile layout | No horizontal scroll at 360, 390, 768, 1024, 1440 (`scrollWidth ≤ innerWidth`); fixed ruler never covers interactive content; safe areas respected in iPhone landscape | Playwright layout spec; manual device check |
| Crawlability | With JavaScript disabled, `/` shows all six levels' text, all 18 project links, contact links; each `/projects/<slug>` shows its H1 and synopsis | Playwright context with `javaScriptEnabled: false`; `curl` of built HTML |
| Structured data | JSON-LD on `/` and every project page passes the Schema.org validator with no errors; Google Rich Results Test shows no errors for BreadcrumbList | manual check at gate G5 |
| Reduced motion | Full site usable, no transform animation longer than 1 frame except caption swaps reduced to instant; no auto-moving element | Playwright project with `reducedMotion: 'reduce'` |

---

## 2. Current-state audit

The repository was generated from a Google AI Studio template and then grown by hand. It builds with Vite but carries several leftovers that will break or slow the new site. `node_modules` is not installed in this checkout, so Phase 0 starts with `npm install`.

### 2.1 What exists

| Path | What it is | Notes |
|---|---|---|
| `index.html` | Entry HTML | Loads **Tailwind Play CDN** (`cdn.tailwindcss.com`, not meant for production), an **importmap to esm.sh** left from AI Studio (unused by Vite, risky), Google Fonts Archivo and Space Grotesk, and two decorative divs (`ambient-glow`, `bg-grid`) whose classes are not defined anywhere. |
| `index.tsx` | Client entry, `createRoot` | Will become `src/main.tsx` with `hydrateRoot`. |
| `App.tsx` | Router, `ScrollProvider`, `SmoothScroller` (Lenis), `Navbar`, `Footer`, two routes (`/`, `/interview-framework`) | Hard-coded `bg-[#0A0A0B]`, scanline overlays. |
| `index.css` | Old design tokens (`--bg #000`, emerald and blue accents, Archivo/Space Grotesk), bento grid, glass console | Imports Google Fonts a second time. Several classes used in components (`section-full`, `section-content`, `scanlines`, `hud-border`) are not defined. |
| `constants.tsx` | `SECTION_MAP`, `SOCIAL_LINKS`, `HERO_CONTENT`, `ABOUT_CONTENT`, `PROJECTS` (11 old entries), `EXPERIENCES` (4), `SKILLS` (3 categories) | `SOCIAL_LINKS.portfolio = "https://erhamza.dev"` is the only domain in the repo. `PROJECTS` is replaced by the CSV data. `EXPERIENCES`, `ABOUT_CONTENT`, `HERO_CONTENT`, `SOCIAL_LINKS`, `SKILLS` are **kept as content** and moved. |
| `types.ts` | Old `Project`, `Experience`, `Skill`, `SkillCategory` | Replaced by `src/types/content.ts` (Appendix B). |
| `interviewData.ts` (77 KB) | Interview Q&A content and `CATEGORIES` | Kept unchanged, moved to `src/content/interview.ts`, loaded only by its route. |
| `pages/Portfolio.tsx` | Composes Hero, About, TechFoundation, Work, ExperienceTimeline, CTA | Replaced by `src/routes/Home.tsx`. |
| `pages/InterviewTool.tsx` + `components/interview/*` (5 files) | Interview framework page | Kept, re-skinned (5.10). |
| `components/Hero.tsx`, `About.tsx`, `TechFoundation.tsx`, `Work.tsx`, `ExperienceTimeline.tsx`, `CTA.tsx`, `Navbar.tsx`, `Footer.tsx` | Current sections and chrome, framer-motion and GSAP based, with opacity fades and invented HUD text ("SYS_STATUS ONLINE", "LATENCY 12ms") | Replaced. Copy that is real (bio, experience details) is preserved through the content files. |
| `components/ScrollContext.tsx` | rAF loop polling `scrollY` every frame forever | Deleted. It runs a permanent rAF loop even when idle. |
| `components/SmoothScroller.tsx` | Lenis + GSAP ticker + ScrollTrigger | Deleted (decision in 4.3). |
| `components/BackgroundSystem.tsx` | The only Three.js user; already commented out in `App.tsx` | Deleted; `three` and `@types/three` removed. |
| `components/HeroBackground.tsx`, `MarqueeText.tsx`, `TextReveal.tsx`, `Typewriter.tsx`, `Values.tsx`, `SectionTitle.tsx`, `GlassCard.tsx`, `NeonIcon.tsx` | Unused or only used by unused files | Deleted. |
| `components/ScrollReveal.tsx`, `TextHighlight.tsx`, `TechMarquee.tsx` | Used only by sections being replaced | Deleted. |
| `src/data/projects.ts`, `src/data/project-analysis.json` | Orphaned case-study data (not imported anywhere) | Deleted. Some claims there contradict the CSV (for example it describes Lammle's work as GTM and Klaviyo, while the CSV says checkout extensions and Shopify Functions). The CSV wins. |
| `src/projects/*.tsx` (5 files) | Orphaned stub pages referencing `.webp` files that do not exist; three of them (Slurvo, WanHam Leathers, Sedef Anatolia) are not in the CSV | Deleted. |
| `public/projects/*.png` (10 files, 20 MB total; `lammles.png` alone is 6.4 MB) | Old screenshots | Five map to CSV projects and are moved to `media-src/projects/<slug>/screenshot.png` as interim sources (see 2.3). The rest are removed after owner confirmation. |
| `vite.config.ts` | Defines `process.env.API_KEY` and `process.env.GEMINI_API_KEY` from env | Nothing reads them. Remove: if a key were ever set it would be inlined into the public bundle. |
| `tsconfig.json` | No `strict`; `@/*` maps to repo root | Becomes strict; `@/*` maps to `src/*`. |
| `metadata.json` | AI Studio metadata ("5+ years") | Deleted. |
| `README.md` | AI Studio boilerplate (Gemini key instructions) | Rewritten in Phase 0. |
| `docs/Mohammad_Hamza_6April.pdf`, `docs/Mohammad_Hamza_Resume_v6.pdf` | Resumes | One is published at `/resume.pdf` once the owner picks it (Section 12). |
| `design-system/hamza-portfolio-revamp/MASTER.md` | Earlier generated design system (Archivo, Space Grotesk, "NFT/Web3 Platform") | Superseded by this plan. Replace its content with a pointer to this file in Phase 0. |
| `design-md/` (60 brand folders) | Reference design notes for other brands | Not imported and not shipped. Leave untouched; it is out of scope. |
| `.claude/skills/`, `.agents/skills/` | Agent skills | Leave untouched. |

### 2.2 Dependency decisions

| Package | Decision | Reason |
|---|---|---|
| `react`, `react-dom` 19, `react-router-dom` 7 | Keep | Core. React Router 7 provides `StaticRouter` for prerendering. |
| `framer-motion` | **Remove** | Every animation in the new design is a CSS transition or a small rAF loop. Removing it saves roughly 35 to 45 KB gzip from the initial bundle and removes a second animation model. |
| `gsap` | **Remove** | Same reasoning; ScrollTrigger is not needed with the native scroll decision (4.3). |
| `lenis` | **Remove** | See 4.3. |
| `three`, `@types/three` | **Remove** | No WebGL on the new site. `@types/three` was wrongly in `dependencies`. |
| `lucide-react` | Keep, but import icons individually | Used by the interview page. New site icons are inline SVG components in `src/components/icons/`. |
| Add `tailwindcss@4`, `@tailwindcss/vite` | Add | Decision in 3.6. |
| Add `zustand` | Add | Game state store (4.2). About 1 KB gzip. |
| Add `@fontsource/inter-tight`, `@fontsource/newsreader` | Add | Self-hosted fonts (3.7). |
| Add `fontaine` (dev) | Add | Generates metric-matched fallback fonts to remove font-swap layout shift. |
| Add `sharp`, `subset-font`, `opentype.js`, `satori`, `@resvg/resvg-js` (dev) | Add | Media pipeline, JP font subsetting, kanji SVG paths, OG images. |
| Add `vitest`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli` (dev) | Add | Testing (Section 11). |

Pin exact minor versions in `package.json` at install time (`npm install -E`), and commit `package-lock.json`.

### 2.3 Old screenshots to interim sources

| Old file | New interim source | Note |
|---|---|---|
| `public/projects/navig.png` | does not exist | Referenced by old constants but missing; NAVIG uses the typographic fallback until the owner supplies one. |
| `public/projects/lammles.png` | `media-src/projects/lammles/screenshot.png` | Owner should replace with a checkout screenshot, since that is the work shown. |
| `public/projects/nighatahmadofficial.png` | `media-src/projects/nighat-ahmad-official/screenshot.png` | |
| `public/projects/gesim.png` | `media-src/projects/gesim/screenshot.png` | |
| `public/projects/nft.png` | `media-src/projects/nft-marketplace/screenshot.png` | Project is shut down; keep only if the owner has rights to show it. |
| `public/projects/safe.png` | `media-src/projects/dex-cex-multisig-wallet/screenshot.png` | Private work. Owner must confirm the image shows no client data. |
| `public/projects/cursor.png`, `louis-cardin.png`, `slurvo.png`, `wanhamleathers.png`, `sedefanatolia.png` | Remove from `public/` | Projects not in the CSV. Move to `media-src/archive/` (not shipped) until the owner confirms deletion. |

---

## 3. Design system

Skills that own this section: **better-colors** (token naming, contrast), **better-typography** (scale, wrapping, numerals), **better-layout** (grid, reading order), **better-ui** and **emil-design-eng** (surfaces and motion details), **tailwind-design-system** (v4 `@theme` wiring), **taste-skill** and **impeccable** (art-direction review at gate G1).

### 3.1 Design principles for agents

1. **Paper and ink, nothing glowing.** No gradients on surfaces, no blur, no glassmorphism, no drop shadows except the single "tape on shelf" shadow and the detail sheet edge.
2. **Cobalt is the voice; vermilion is the reward.** Cobalt carries links, active states, HUD and headings. Vermilion appears only for stamps, XP gains, the "out of print" sticker, the red door, and error/alert messages.
3. **No opacity fades for reveals.** Elements arrive by mask slide (translate inside an `overflow: clip` parent), `clip-path` inset or circle, or scale. Static opacity on decorative layers (grain, halftone) is allowed; animating `opacity` from 0 to 1 is not.
4. **Text is real.** Every word a visitor reads is DOM text, never canvas or image text (the only exceptions are the Pong score, which is mirrored in a live region, and OG images, which are not part of the page).
5. **Motion has a job.** Each animation either confirms an action, shows a spatial relationship (cover grows into sheet), or rewards progress. Nothing loops idly except the cursor follower.

### 3.2 Color tokens and contrast

Base palette (given by the chosen direction) plus three derived tokens needed to pass WCAG AA. Ratios are WCAG 2.x relative-luminance contrast, computed for this plan.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#ECE8E0` | Page background |
| `--sheet` | `#F3F0EA` | Raised surfaces: detail sheet, passport, cards, top bar |
| `--ink` | `#141414` | Body text, rules, strong UI |
| `--muted` | `#6D6A63` | Decorative secondary text only at large sizes, or on `--sheet` |
| `--muted-strong` | `#5E5B55` | **New.** Small secondary text on `--paper` (captions, meta, ruler years) |
| `--cobalt` | `#1F3FB0` | Links, headings accent, HUD, focus ring, primary button fill |
| `--cobalt-deep` | `#17318C` | **New.** Pressed state of cobalt buttons; cobalt text on hover |
| `--vermilion` | `#D9432B` | Stamps, XP pulse, stickers, door artwork (graphics and large text only) |
| `--vermilion-ink` | `#B8321D` | **New.** Vermilion used as small text or as a button fill with text on it |
| `--graphite` | `#2A2A2A` | Spine swatch only |
| `--line` | `rgb(20 20 20 / 0.18)` | Hairlines on paper (non-text, decorative dividers) |
| `--line-strong` | `rgb(20 20 20 / 0.55)` | Borders that identify a control (meets 3:1 non-text contrast on paper) |

Contrast-checked pairs (AA normal text needs 4.5:1, AA large text and UI components need 3:1):

| Foreground on background | Ratio | Allowed use |
|---|---|---|
| ink on paper | 15.08 | All text |
| ink on sheet | 16.20 | All text |
| cobalt on paper | 7.17 | All text, links, icons, focus ring |
| cobalt on sheet | 7.71 | All text |
| paper on cobalt | 7.17 | Button label on cobalt fill |
| sheet on cobalt | 7.71 | Button label on cobalt fill (preferred) |
| cobalt-deep on paper | 9.27 | Hover text |
| muted on paper | **4.42 (fails AA normal)** | Only text ≥ 24 px regular or ≥ 18.66 px bold, or decorative |
| muted on sheet | 4.74 | Small text allowed on sheet only |
| muted-strong on paper | 5.54 | Small secondary text on paper |
| vermilion on paper | **3.59 (fails AA normal)** | Graphics (stamps, stickers, door art) and text ≥ 24 px only |
| vermilion on sheet | 3.86 | Same restriction |
| vermilion-ink on paper | 4.89 | Small alert or reward text |
| vermilion-ink on sheet | 5.26 | Small alert or reward text |
| sheet on vermilion-ink | 5.26 | "Open the red door" button label |
| white on vermilion | **4.39 (fails)** | Do not use |
| ink on vermilion | **4.20 (fails)** | Do not use for normal text |
| cobalt on ink | **2.10 (fails)** | Never put cobalt text on ink or graphite spines |
| paper on ink | 15.08 | Text on ink spines and covers |

Rules for agents:

- Any new text color pair must be checked with the **better-colors** skill before merge, and added to this table in the PR description.
- Focus ring: `outline: 2px solid var(--cobalt); outline-offset: 3px`. On cobalt-filled controls use `outline-color: var(--ink)` (ink against the paper behind the offset gap is 15:1).
- `@media (forced-colors: active)`: hide grain and halftone layers, remove spine colors (use `CanvasText` borders), keep all text.

### 3.3 Typography

Families:

| Family | Weights and styles | Used for |
|---|---|---|
| Inter Tight | 500, 600 | UI, headings, HUD, labels, captions, buttons |
| Newsreader | 400 regular and italic | Synopses, bio, credits lines ("A Mohammad Hamza build"), long reading text |
| Noto Sans JP | 500, subset to the exact characters used | Small JP labels next to level names |
| Noto Sans JP 800 glyph outlines | (converted to SVG paths at build time, no font file shipped) | Giant halftone kanji (see 3.8) |

Fluid type scale. Values are `clamp(min, preferred, max)`; the preferred value is tuned so the minimum applies at 360 px and the maximum at 1440 px.

| Token | Value | Line height | Tracking | Family / weight | Use |
|---|---|---|---|---|---|
| `--fs-display` | `clamp(3rem, 1.75rem + 5.6vw, 8.5rem)` | 0.9 | -0.035em | Inter Tight 600 | Hero name (H1 on `/`) |
| `--fs-h2` | `clamp(2.25rem, 1.6rem + 2.9vw, 4.5rem)` | 0.95 | -0.03em | Inter Tight 600 | Level titles (H2), project page H1 |
| `--fs-h3` | `clamp(1.5rem, 1.25rem + 1.1vw, 2.25rem)` | 1.05 | -0.015em | Inter Tight 600 | Card titles, caption title, experience role |
| `--fs-lead` | `clamp(1.25rem, 1.12rem + 0.55vw, 1.625rem)` | 1.4 | -0.005em | Newsreader 400 | Hero subtitle, level intro paragraph |
| `--fs-body` | `1.125rem` (18 px) | 1.55 | 0 | Newsreader 400 | Synopses, bio |
| `--fs-ui` | `1rem` (16 px) | 1.45 | -0.005em | Inter Tight 500 | Buttons, lists, nav, stack chips |
| `--fs-small` | `0.875rem` (14 px) | 1.45 | 0 | Inter Tight 500 | Meta lines, footer |
| `--fs-label` | `0.75rem` (12 px) | 1.2 | 0.14em, uppercase | Inter Tight 600 | Eyebrows ("LEVEL 04 / 06"), tags |
| `--fs-micro` | `0.6875rem` (11 px) | 1 | 0.08em | Inter Tight 500 | Ruler year ticks only |
| `--fs-kanji` | `clamp(7rem, 22vw, 17rem)` | 1 | 0 | SVG | Halftone kanji block height |

Typography rules:

- `font-variant-numeric: tabular-nums` on XP counter, ruler years, frame numbers, Pong score, dates.
- `text-wrap: balance` on H1, H2, H3, captions; `text-wrap: pretty` on paragraphs.
- Measure: paragraphs `max-width: 62ch`; synopsis in the detail sheet `max-width: 44ch`.
- Uppercase only for `--fs-label` and spine titles. Never uppercase Newsreader.
- Minimum rendered text size anywhere: 11 px (ruler years). All other text ≥ 12 px.
- Use real typographic characters in content: curly apostrophes (Lammle’s), en dash for ranges (2023–2025), the multiplication sign is never used for "x".

### 3.4 Spacing, layout grid, radius

Spacing scale (4 px base): `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 24px`, `--space-6: 32px`, `--space-7: 48px`, `--space-8: 64px`, `--space-9: 96px`, `--space-10: 128px`.

Layout:

- `--gutter: min(56px, max(16px, 4vw))`. Horizontal padding of the page wrapper is `max(var(--gutter), env(safe-area-inset-left))` on the left and the mirror on the right.
- Content grid: 12 columns from 1024 px, 8 columns at 768 to 1023 px, 4 columns below 768 px. Column gap `--space-5` (24 px) desktop, `--space-4` mobile. Max content width 1280 px.
- Level vertical rhythm: `--level-pad-y: clamp(96px, 12vw, 176px)`. Each level has `min-height: 100svh` (with `100vh` fallback declared first) except Spawn, which is exactly `min-height: 100svh`.
- Bottom ruler height: `--ruler-h: 56px` mobile, `64px` from 768 px. Body gets `padding-bottom: calc(var(--ruler-h) + env(safe-area-inset-bottom))`.
- Top bar height: `--topbar-h: 56px` mobile, `64px` from 768 px. `html { scroll-padding-top: calc(var(--topbar-h) + 16px); scroll-padding-bottom: calc(var(--ruler-h) + 16px); }`.

Radius: `--r-0: 0`, `--r-1: 2px` (tapes, chips), `--r-2: 3px` (sheets, cards, poster), `--r-round: 999px` (ruler dot, round arrow buttons, stamps). Paper objects are nearly square-cornered; nothing uses 8 px or larger radii.

Shadows (only two):

- `--shadow-tape: 0 34px 60px -30px rgb(20 16 10 / 0.6)` on the active cover.
- `--shadow-sheet: 0 1px 0 var(--line), 0 30px 80px -40px rgb(20 16 10 / 0.45)` on the passport dialog.

### 3.5 Motion tokens

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(.2,.8,.2,1)` | Default for every UI transition |
| `--ease-sheet` | `cubic-bezier(.76,0,.18,1)` | Detail sheet clip-path grow and shrink, red door |
| `--ease-stamp` | `cubic-bezier(.3,1.35,.45,1)` | Stamp landing (small overshoot) |
| `--dur-press` | `120ms` | Button press scale (0.97) |
| `--dur-ui` | `220ms` | Hover, toggles, XP digit roll |
| `--dur-dot` | `600ms` | Ruler dot glide |
| `--dur-caption` | `650ms` | Shelf caption mask-slide swap |
| `--dur-reveal` | `700ms` | Heading mask-line reveal |
| `--dur-stamp` | `520ms` | Stamp land |
| `--dur-door` | `900ms` | Red door opening |
| `--dur-sheet` | `1050ms` | Detail sheet clip-path |
| `--stagger` | `60ms` | Between lines in a mask reveal |

Spring for the shelf (JavaScript only): `s += (T - s) * (1 - Math.exp(-k * dt))`, `k = 5.2` at rest, `k = 18` while dragging, `dt` in seconds, clamped to 0.05.

Reduced motion: every duration token is redefined to `0ms` (`--dur-caption` to `1ms` so `transitionend` still fires), the spring snaps (`s = T`), cursor follower moves without lag, stamps appear in place, door is open. See 7.6.

Rules: animate only `transform`, `clip-path` and (for the shade overlay of tapes only) `opacity` of a non-text overlay. Never animate `width`, `height`, `top`, `left`, `filter` or `box-shadow`.

### 3.6 Tailwind decision

**Finding:** Tailwind is not installed. The current site runs the Tailwind v3 **Play CDN** script inside `index.html` with an inline config. That script compiles CSS in the browser at runtime, is documented as not for production, blocks rendering, and cannot work in a prerendered page without JavaScript.

**Decision:** install **Tailwind CSS v4** with the official Vite plugin (`@tailwindcss/vite`) and wire it to the CSS custom properties in Appendix A through a CSS-first `@theme` block. Write the complex, highly dynamic parts (shelf, detail sheet, halftone, grain, stamp) as plain CSS files in `src/styles/` that use the same custom properties.

Justification:

- The existing components and the interview page are written with Tailwind utilities, so v4 keeps that page working with minimal edits during the re-skin.
- v4 compiles at build time into a single small CSS file, works with prerendered HTML and with JavaScript disabled, and its `@theme` tokens become real CSS variables, so plain CSS files and utilities share one source of truth.
- The shelf's 3D transforms are computed per frame in JavaScript and do not benefit from utilities, so they live in `src/styles/shelf.css`.
- Browser support for v4 (Safari 16.4+, Chrome 111+, Firefox 128+) is acceptable for this audience in 2026. **[ASSUMPTION]** The owner accepts that iOS 15 and older get an unsupported, but still readable, page.

Wiring (exact):

- `vite.config.ts`: `plugins: [react(), tailwindcss(), FontaineTransform.vite({...})]`.
- `src/styles/app.css`: `@import "tailwindcss";` then `@import "./tokens.css";` then a `@theme inline { --color-paper: var(--paper); ... }` block mapping tokens to utility names (`bg-paper`, `text-ink`, `text-cobalt`, `font-ui`, `font-read`, `ease-archive`), then `@import "./base.css"; @import "./shelf.css";` etc.
- During Phase 0 only, a temporary `@theme` block also maps the legacy names the interview page uses (`emerald`, `blue`, `background`, `card`, `primary`, `muted`, `font-heading`, `font-mono`) so that page still renders until it is re-skinned in `P2-7`. Delete those legacy mappings in `P2-7`.

### 3.7 Font loading plan

1. **Self-host** Inter Tight and Newsreader through Fontsource, latin subset only:
   `@fontsource/inter-tight/latin-500.css`, `latin-600.css`, `@fontsource/newsreader/latin-400.css`, `latin-400-italic.css`. Import them in `src/styles/fonts.css`. Do not load Google Fonts at runtime (removes two third-party connections and a render-blocking stylesheet).
2. **Preload** exactly two files, the ones used above the fold on `/`: Inter Tight 600 latin and Newsreader 400 latin. The prerender script (`scripts/prerender.mjs`) reads their hashed URLs from the Vite manifest and injects `<link rel="preload" as="font" type="font/woff2" crossorigin>` into every HTML file.
3. `font-display: swap` for all text fonts, plus **fontaine** fallbacks (`Inter Tight` falls back to a metric-adjusted `Arial`; `Newsreader` falls back to a metric-adjusted `Georgia`) so the swap causes no layout shift.
4. **JP labels:** `scripts/subset-jp-fonts.mjs` reads every string from `src/content/jp.ts`, subsets Noto Sans JP (variable source font instanced at weight 500) with `subset-font` to `public/fonts/noto-sans-jp-500-subset.woff2` (expected under 15 KB), and writes `src/content/jp-glyphs.lock` listing the characters. The source TTF lives at `media-src/fonts/NotoSansJP-VariableFont_wght.ttf` (SIL Open Font License; download once from the `google/fonts` repository). `scripts/check-budgets.mjs` fails the build if any character in `jp.ts` is missing from the lock file, which tells the developer to re-run `npm run fonts:jp`.
5. **Kanji:** no font is shipped for the giant kanji. See 3.8.
6. Declare the JP `@font-face` with `unicode-range` limited to the subset's code points, so it is only downloaded when a JP label renders.

### 3.8 Halftone kanji technique

The direction asks for giant halftone kanji using Noto Sans JP 800. A text element that large would very likely become the page's LCP element and would wait for a web font, so this plan **converts the glyphs to SVG paths at build time** instead of shipping an 800-weight font:

- `scripts/kanji-paths.mjs` uses `opentype.js` on the same variable source font instanced at weight 800 (`subset-font` with `variationAxes: { wght: 800 }` to produce a temporary static font, then `opentype.js` to read glyph outlines) and writes `src/content/kanji-paths.ts`: `{ char, d, advance }` per character, with a units-per-em value.
- `HalftoneKanji` renders an `<svg aria-hidden="true" focusable="false">` that stacks the glyphs vertically (vertical writing, top to bottom) and fills them with a `<pattern>` of dots: circle radius 1.15 px on a 3 px grid, fill `rgb(64 82 138 / 0.55)` as in the reference. The pattern is defined once in a shared hidden `<svg>` in the app shell and referenced by `fill="url(#halftone-dots)"`.
- Because inline SVG paths are not LCP candidates and need no font, the kanji costs no network request and causes no layout shift (the SVG has a fixed `viewBox` and explicit size).
- Fallback if this proves too heavy (unlikely; each glyph path is 1 to 3 KB): ship `public/fonts/noto-sans-jp-800-kanji.woff2` subset with `font-display: optional` and the reference CSS `background-clip: text` technique.

Kanji per level, with meaning (**[ASSUMPTION]** these choices are the planner's; the owner may change them):

| Level | Kanji | Reading and meaning |
|---|---|---|
| 1 Spawn | 始 | hajime, "beginning" |
| 2 Origin | 原点 | genten, "point of origin" |
| 3 Skill Tree | 技 | waza, "skill, technique" |
| 4 Archive | 作品 | sakuhin, "works" |
| 5 Career Path | 経験 | keiken, "experience" |
| 6 Final Boss | 連絡 | renraku, "contact" |
| Arcade | 遊 | asobi, "play" |
| 404 | 迷 | mayoi, "lost" |

Small JP labels (in `src/content/jp.ts`) are the readings above in kana plus `レベル` ("level"). Each JP label is wrapped in `<span lang="ja">`, and if it carries meaning it is followed by an English equivalent in the DOM; purely decorative labels get `aria-hidden="true"`.

### 3.9 Grain

- A static 256 × 256 noise tile (`public/textures/grain.webp`, under 10 KB) generated once by `scripts/build-grain.mjs` from the reference SVG (`feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3"` with the reference color matrix), rasterized with `sharp`.
- Applied as a fixed overlay: `position: fixed; inset: 0; pointer-events: none; z-index: var(--z-grain); background: url(/textures/grain.webp) repeat; opacity: 0.6; mix-blend-mode: multiply;`.
- **Performance guard:** a full-viewport blended layer is cheap on desktop but can cost scroll frames on low-end Android. `Grain` drops `mix-blend-mode` (keeping a pre-darkened alpha tile, visually almost identical on paper) when `navigator.hardwareConcurrency <= 4` or `deviceMemory <= 4`. Agents verify in a Chrome performance trace at 4x CPU throttle that scrolling stays at 60 fps.
- Hidden under `forced-colors: active` and in print.

### 3.10 Z-index map

| Token | Value | Layer |
|---|---|---|
| `--z-base` | 0 | Page flow |
| `--z-kanji` | 1 | Halftone kanji (inside each level, behind content) |
| `--z-content` | 10 | Level content |
| `--z-shelf` | 20 | Shelf stage and its controls |
| `--z-topbar` | 40 | Top bar |
| `--z-ruler` | 50 | Bottom ruler and XP HUD |
| `--z-toast` | 60 | XP gain toast, stamp landing animation |
| `--z-dialog` | 70 | Detail sheet, passport (native `<dialog>` uses the top layer anyway; this value is for non-dialog fallbacks) |
| `--z-grain` | 80 | Grain overlay |
| `--z-cursor` | 90 | Custom cursor |
| `--z-skip` | 100 | Skip link when focused |

### 3.11 Component inventory

All components live under `src/components/`. Each row names the file, the props contract, and the behavior agents must implement. "SSR-safe" means no `window` or `document` access during render; use effects.

| Component | File | Props (essential) | Behavior |
|---|---|---|---|
| `LevelShell` | `ui/LevelShell.tsx` | `level: Level`, `children`, `kanjiPosition?: 'left' \| 'right'` | Renders `<section id={level.anchor} aria-labelledby={headingId} data-level={level.index}>`, the eyebrow `LEVEL 0n / 06 · NAME` plus JP label, the halftone kanji, a heading slot, an end sentinel `<div data-level-end aria-hidden>`, and registers with the level tracker. Heading gets `tabIndex={-1}` so ruler jumps can move focus. SSR-safe. |
| `Ruler` | `hud/Ruler.tsx` | none (reads store) | Fixed bottom. `<nav aria-label="Levels">` with an ordered list of six links (`href="#level-spawn"` and so on), visual tick marks for 2019 to 2026 (`aria-hidden`), the gliding cobalt dot (`aria-hidden`), active link has `aria-current="location"`. Career mode in Level 5 (5.5). |
| `XPCounter` | `hud/XPCounter.tsx` | none | Shows XP as a film frame count: `FR 0340` (four digits, zero-padded, tabular). Digit roll on change (each digit is a mask; new digit slides up 100% in `--dur-ui`). `aria-label="Experience points: 340 of 1200"`. Hidden when Play mode is off. |
| `LevelLabel` | `hud/LevelLabel.tsx` | none | `LEVEL 04 / 06` plus level name on desktop, `04/06` on mobile. Text swaps with a mask slide. Not a live region (the ruler already conveys location). |
| `Passport` | `hud/Passport.tsx` | none | Button in the top bar (passport icon + "Passport", 44 px). Opens a native `<dialog>` (modal) listing seven stamp slots (six levels + arcade) with text status ("Level 3, Skill Tree: cleared on 25 Nov 2026" or "not yet"), total XP, "Reset progress" and "Play mode" toggle. |
| `Stamp` | `ui/Stamp.tsx` | `level`, `state: 'empty' \| 'landing' \| 'set'`, `date?` | SVG circular stamp: vermilion ring, kanji at center, "LEVEL 03 CLEARED" around the rim, date. Landing: scale 1.6 → 1 and rotate -14° → -6° over `--dur-stamp` with `--ease-stamp`, plus a `clip-path: circle()` ink spread from 0 % to 75 % in the first 180 ms. Reduced motion: appears set. |
| `MaskLine` | `ui/MaskLine.tsx` | `as`, `lines: string[]` or `children`, `delay?`, `trigger?: 'inview' \| 'mount' \| 'none'` | Each line is wrapped in a block with `overflow: clip` (fallback `hidden`) and `padding-block: 0.08em` so descenders are not cut; the inner span starts at `translateY(110%)` and goes to 0 over `--dur-reveal` with `--ease`, staggered by `--stagger`. Hidden state applies only when `html.js` is present **and** motion is allowed, so no-JS and reduced-motion users always see text. Used for headings and labels only, never paragraphs. |
| `HalftoneKanji` | `ui/HalftoneKanji.tsx` | `text: string`, `size?` | See 3.8. `aria-hidden`. Absolutely positioned inside `LevelShell`; must never cause horizontal overflow (container has `overflow: clip`). |
| `Grain` | `ui/Grain.tsx` | none | See 3.9. Rendered once in the app shell. |
| `Cursor` | `ui/Cursor.tsx` | none | Only when `(pointer: fine) and (hover: hover)` and the user has not chosen "Classic cursor". 8 px cobalt dot (follows exactly) and a 36 px cobalt ring (lerp 0.18 per frame) drawn with `transform` only. Ring scales to 1.6 over links and buttons; shows a small label ("DRAG" over the shelf, "OPEN" over the active cover, "PLAY" over the Pong canvas). Native cursor is hidden with `cursor: none` on `html.has-cursor`, but restored on `input`, `textarea`, `select`, `[contenteditable]` and inside `dialog`. rAF loop stops when the pointer is idle for 500 ms. Reduced motion: no lerp. |
| `Button` | `ui/Button.tsx` | `variant: 'primary' \| 'secondary' \| 'ghost' \| 'door'`, `size: 'md' \| 'lg'`, `as?: 'a' \| 'button'`, `href?` | Min height 44 px (48 px for `lg`). `primary`: cobalt fill, sheet text. `secondary`: 1 px cobalt border, cobalt text, transparent fill. `ghost`: underlined cobalt text, 44 px hit area via padding. `door`: `--vermilion-ink` fill, sheet text. Press: `scale(0.97)` over `--dur-press`. Renders `<a>` for navigation, `<button>` for actions; never a `div`. |
| `Shelf` | `shelf/Shelf.tsx` + `Tape.tsx`, `geometry.ts`, `spring.ts`, `useShelfInput.ts` | `projects: Project[]` (featured, ordered) | Section 6. Client-only (lazy chunk), mounted into a reserved box. |
| `DetailSheet` | `shelf/DetailSheet.tsx` + `InkMask.tsx` | `project`, `originRect?: DOMRect` | Section 6.8. Native `<dialog>`, grows from the cover rect. Shares `ProjectDetail` content with the project page. |
| `ProjectDetail` | `projects/ProjectDetail.tsx` | `project`, `headingLevel: 1 \| 2` | Content block used by both `DetailSheet` and `/projects/:slug`: eyebrow (category and genre), title, synopsis, role, stack chips, owner-stated results, link or private notice, poster. |
| `ArchiveIndex` | `projects/ArchiveIndex.tsx` | `projects`, `variant: 'compact' \| 'full'` | Semantic list of all 18 projects grouped by category (Section 6.10). SSR-rendered. |
| `PosterFallback` | `projects/PosterFallback.tsx` | `project` | Typographic poster used whenever a screenshot is missing (6.11). |
| `TopBar` | `hud/TopBar.tsx` | none | 5.7. |
| `Footer` | `hud/Footer.tsx` | none | 5.8. |
| `ReelPong` | `arcade/ReelPong.tsx` + `pong-engine.ts` | `difficulty`, `onWin`, `onLose` | Section 8. |
| `Toast` | `ui/Toast.tsx` | store-driven | "+60 FR" XP gain chip near the XP counter; slides in from below inside a mask, stays 1.6 s, slides out. Not announced (see 7.5). |
| `SkipLink` | `ui/SkipLink.tsx` | none | "Skip to content" and "Skip to projects" links, visible on focus. |
| `Icon*` | `icons/*.tsx` | `title?` | Inline SVGs, 24 px grid, 1.5 px stroke, `currentColor`. Decorative icons get `aria-hidden`. |

---

## 4. Architecture

Skills: **vercel-react-best-practices** (bundle splitting, re-render control, effects), **typescript-advanced-types** (content types, slug unions), **better-accessibility** (focus management in routing).

### 4.1 Folder structure

```
/
├─ index.html                     # template; prerender injects head + app HTML
├─ vite.config.ts
├─ tsconfig.json                  # strict, "@/*" -> "src/*"
├─ playwright.config.ts
├─ vitest.config.ts
├─ lighthouserc.json
├─ vercel.json                    # [ASSUMPTION] Vercel hosting (see 9.8)
├─ media-src/                     # NOT shipped. Owner drops screenshots here.
│  ├─ projects/<slug>/screenshot.png      # desktop capture (required for media)
│  ├─ projects/<slug>/mobile.png          # optional phone capture (better cover crop)
│  ├─ fonts/NotoSansJP-VariableFont_wght.ttf
│  └─ archive/                    # old screenshots awaiting owner decision
├─ public/
│  ├─ projects/<slug>/...         # GENERATED by npm run media (committed)
│  ├─ og/                         # GENERATED OG images
│  ├─ fonts/noto-sans-jp-500-subset.woff2   # GENERATED
│  ├─ textures/grain.webp         # GENERATED once
│  ├─ favicon.svg, apple-touch-icon.png
│  └─ resume.pdf                  # copied from docs/ after owner choice
├─ scripts/
│  ├─ build-project-media.mjs     # screenshots -> covers, spines, heroes, manifest
│  ├─ subset-jp-fonts.mjs
│  ├─ kanji-paths.mjs
│  ├─ build-grain.mjs
│  ├─ prerender.mjs               # SSR render of every route into dist/
│  ├─ gen-seo-files.mjs           # sitemap.xml, robots.txt, llms.txt, llms-full.txt, /projects/<slug>.md
│  ├─ gen-og.mjs                  # satori + resvg OG images
│  └─ check-budgets.mjs
├─ src/
│  ├─ main.tsx                    # hydrateRoot, sets html.js, registers motion prefs
│  ├─ entry-server.tsx            # render(url) for prerender
│  ├─ App.tsx                     # routes + app shell (TopBar, Ruler, Grain, Cursor, Footer)
│  ├─ routes/
│  │  ├─ Home.tsx                 # six levels
│  │  ├─ ProjectsIndex.tsx        # /projects
│  │  ├─ ProjectPage.tsx          # /projects/:slug (standalone)
│  │  ├─ Arcade.tsx               # /arcade (lazy)
│  │  ├─ InterviewFramework.tsx   # /interview-framework (lazy)
│  │  └─ NotFound.tsx
│  ├─ levels/
│  │  ├─ L1Spawn.tsx  L2Origin.tsx  L3SkillTree.tsx
│  │  ├─ L4Archive.tsx L5CareerPath.tsx L6FinalBoss.tsx
│  ├─ components/
│  │  ├─ ui/ hud/ shelf/ projects/ arcade/ icons/ interview/
│  ├─ game/
│  │  ├─ store.ts                 # zustand store (XP, stamps, settings)
│  │  ├─ rules.ts                 # XP table, caps (pure, unit tested)
│  │  ├─ storage.ts               # try/catch localStorage adapter
│  │  └─ useLevelTracker.ts       # IntersectionObserver for active level and clears
│  ├─ content/
│  │  ├─ profile.ts               # HERO_CONTENT, ABOUT_CONTENT, SOCIAL_LINKS (moved)
│  │  ├─ projects.ts              # 18 projects (Appendix D)
│  │  ├─ experience.ts            # EXPERIENCES (moved, with ISO dates)
│  │  ├─ skills.ts                # skill tree
│  │  ├─ levels.ts                # six levels
│  │  ├─ jp.ts, kanji-paths.ts (generated), jp-glyphs.lock (generated)
│  │  ├─ media-manifest.json      # GENERATED by build-project-media
│  │  └─ interview.ts             # moved interviewData.ts
│  ├─ seo/
│  │  ├─ site.ts                  # SITE_URL, names, sameAs
│  │  ├─ meta.ts                  # per-route title/description/canonical/og
│  │  ├─ jsonld.ts                # builders
│  │  └─ Head.tsx                 # client-side head sync on navigation
│  ├─ lib/
│  │  ├─ motion.ts                # useReducedMotion (media query OR setting)
│  │  ├─ useInView.ts
│  │  └─ scroll.ts                # scrollToLevel with focus handling
│  ├─ styles/
│  │  ├─ app.css tokens.css base.css fonts.css shelf.css sheet.css hud.css
│  └─ types/content.ts            # Appendix B
└─ tests/
   ├─ e2e/*.spec.ts
   └─ unit (colocated *.test.ts under src/)
```

### 4.2 State

Two kinds of state exist:

1. **Navigation state** (which level is active, whether a programmatic scroll is running): changes often, read by the ruler, level label and cursor.
2. **Game state** (XP, stamps, unlocked arcade, settings such as Play mode, Motion, Classic cursor): changes rarely, persisted.

**Decision: one zustand store (`src/game/store.ts`) with selectors, plus no React context for these values.** Reasoning: a React context holding the active level would re-render every consumer on each level change, and the shelf loop must never trigger React renders. Zustand gives selector-based subscriptions (`useGame(s => s.activeLevel)`), works outside React (the level tracker and shelf can call `useGame.getState()`), and is about 1 KB. Persistence uses zustand's `persist` middleware with a **custom storage adapter** (`src/game/storage.ts`) that wraps every `localStorage` call in `try/catch` and falls back to an in-memory map (Safari private mode and some embedded browsers throw on access).

Hydration rule: the store's initial state is the same on server and client (XP 0, no stamps). Persisted values are rehydrated in an effect after mount (`persist` with `skipHydration: true`, then `useGame.persist.rehydrate()` in `main.tsx` after `hydrateRoot`). This avoids hydration mismatches. The XP counter has a fixed width, so the change from `0000` to the saved value causes no layout shift.

**Active level detection:** `useLevelTracker` creates one `IntersectionObserver` with `rootMargin: "-50% 0px -50% 0px"` (a horizontal line at the viewport center) over all six `section[data-level]` elements. The section intersecting that line is active. A second observer watches each `[data-level-end]` sentinel for level clears (rules in 7.2). While a programmatic scroll from the ruler is in progress (`scrollend` event, or a 1200 ms timeout where `scrollend` is unsupported), the tracker updates the active level but does not grant XP for levels passed through.

### 4.3 Scroll engine decision

**Decision: native browser scrolling. Remove Lenis, GSAP and ScrollTrigger. No CSS scroll snapping on the page.**

Reasons:

- iOS Safari and Android Chrome scroll best natively: momentum, rubber-banding, the collapsing address bar, find-in-page and accessibility scroll actions all keep working. Lenis does not smooth touch by default anyway, so on phones it would only add work.
- Smooth-scroll libraries take over the wheel. The shelf needs to read horizontal wheel and trackpad gestures while passing vertical scrolling through to the page (6.5); with Lenis these two would fight.
- ScrollTrigger pinning is unnecessary because no level is pinned. Every level is normal flow, which is also what keeps the text crawlable and readable without "scrolling magic".
- Mandatory scroll snap fails when a level is taller than the viewport (Career Path and the Archive index are) and feels sticky on trackpads. Proximity snap gives little benefit. Neither is used.
- Ruler jumps use `element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })`, which respects `scroll-padding`. After the jump, focus moves to the level heading (`tabIndex=-1`, `preventScroll: true`) so keyboard and screen-reader users land in the right place.
- Scroll-linked effects (none are essential) may use CSS scroll-driven animations (`animation-timeline: view()`) only as progressive enhancement inside `@supports (animation-timeline: view())`.

Viewport height handling: layout uses `min-height: 100svh` (small viewport, stable while the iOS toolbar moves) with a `100vh` fallback declared first. `100dvh` is not used for layout because it changes during scroll and causes jumps. The arcade game area uses `max-height: calc(100svh - var(--topbar-h) - 120px)`.

`<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` so `env(safe-area-inset-*)` works for the ruler and top bar. Never set `maximum-scale` or `user-scalable=no`.

### 4.4 Routing

| Path | Component | Prerendered file | Indexable | Notes |
|---|---|---|---|---|
| `/` | `Home` | `dist/index.html` | yes | Six levels |
| `/projects` | `ProjectsIndex` | `dist/projects/index.html` | yes | Full archive index with all 18 (breadcrumb parent) |
| `/projects/:slug` | `ProjectPage` | `dist/projects/<slug>/index.html` (18 files) | yes | Standalone page; also the URL of the open detail sheet |
| `/arcade` | `Arcade` (lazy) | `dist/arcade/index.html` | yes | Game is client-only; page text is prerendered |
| `/interview-framework` | `InterviewFramework` (lazy) | `dist/interview-framework/index.html` | yes | Existing page, re-skinned |
| `*` | `NotFound` | `dist/404.html` | no (`noindex`) | Served by host with HTTP 404 |

**Detail sheet as a modal route.** Clicking the active cover (or pressing Enter on it) calls `navigate('/projects/' + slug, { state: { backgroundLocation: location, originRect } })`. `App.tsx` renders `<Routes location={state?.backgroundLocation ?? location}>` for the page, and when `backgroundLocation` exists it also renders `<Route path="/projects/:slug" element={<DetailSheet />}>` on top. This is the standard React Router "modal over background route" pattern. Results:

- The URL is shareable and matches the crawlable page.
- Direct visits, reloads and crawlers get the full standalone `ProjectPage`.
- Closing the sheet calls `navigate(-1)` when the sheet was opened from the shelf in this session (tracked with a flag in `history.state`), otherwise `navigate('/#level-archive')`.
- `DOMRect` is not serializable across reloads, so `originRect` is only used when present; otherwise the sheet grows from the center (inset 35 % 38 % 30 % 38 % as in the reference).

Hash anchors for levels: `#level-spawn`, `#level-origin`, `#level-skills`, `#level-archive`, `#level-career`, `#level-contact`. The old IDs (`section-hero` and so on) are dropped; there are no inbound links worth preserving **[ASSUMPTION]**.

Head management: `src/seo/meta.ts` exports `getRouteMeta(pathname)` returning title, description, canonical, robots, OG and JSON-LD. The prerender script writes these into each HTML file. On client-side navigation, `src/seo/Head.tsx` updates `document.title`, the description meta, canonical link and OG tags in an effect. Crawlers that matter read the prerendered HTML, so the client update exists for the tab title and sharing extensions.

Route transitions: none animated beyond the detail sheet. On route change, scroll to top unless navigating to a hash, and move focus to the route's H1 (`tabIndex=-1`).

### 4.5 Prerendering (summary; detail in 9.6)

The site is a client-rendered SPA today, so crawlers that do not run JavaScript, and most AI crawlers, see an empty `<div id="root">`. The plan adds a **build-time prerender using React's own server renderer**, following Vite's documented SSR pattern:

1. `vite build` (client) outputs `dist/` with `manifest.json`.
2. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` outputs a Node module exposing `render(url)`, which uses `renderToString` with React Router's `StaticRouter`.
3. `node scripts/prerender.mjs` imports `dist-ssr/entry-server.js`, renders every route from the route list (Section 4.4), injects the HTML into the `<div id="root">` of `dist/index.html`, writes head tags from `getRouteMeta`, preload links and JSON-LD, and writes each file to its path.
4. The client entry uses `hydrateRoot`. Components that depend on the browser (shelf, cursor, Pong, store rehydration) render their SSR-safe placeholder first and enhance after mount.

This is set up in Phase 1 (`P1-3`) so every component is SSR-checked from the start, and completed with SEO tags in Phase 5.

### 4.6 Data model

Full types are in Appendix B. Summary:

- `Project`: slug (string literal union), title, card and spine titles, category, genre tag, year (or `null` with status `tbc`), featured flag and shelf order, synopsis, role, stack, owner-stated claims, link (discriminated union: `live`, `repo`, `private`, `offline`), spine swatch, media settings (focal point, alt text), SEO overrides, `updated` ISO date.
- `Level`: id, index 1..6, slug, anchor, name, descriptive H2, kanji, JP label, XP values.
- `SkillNode`: id, name, branch, depth (`core`, `working`, `familiar`), evidence (project slugs).
- `Experience`: id, role, company, start and end as `YYYY-MM`, location, details.

Content files export `as const satisfies readonly Project[]` so slugs become a literal union (`ProjectSlug`) and links between skills and projects are type-checked.

### 4.7 Where screenshots plug in

1. Owner saves `media-src/projects/<slug>/screenshot.png` (and optionally `mobile.png`), following Appendix C.
2. `npm run media` (also run by `prebuild` with `--allow-missing`) generates hero, cover and spine images into `public/projects/<slug>/` and updates `src/content/media-manifest.json`.
3. Components read the manifest by slug. If a slug has no entry, they render `PosterFallback`. Missing screenshots never break the build; the script prints a warning table of missing slugs.
4. The owner edits `media.alt` and, if needed, `media.focal` for that project in `src/content/projects.ts`.

---

## 5. Section-by-section revamp

Every level follows the same frame: `LevelShell` with an eyebrow (`LEVEL 0n / 06 · NAME` plus JP label), a halftone kanji, one descriptive H2 that carries search keywords (the playful level name stays in the eyebrow), real content, and an end sentinel. The playful name is never the only label: screen-reader users and crawlers always get the descriptive heading.

Copy below marked **[COPY: approve]** is written by the planner from repository content and needs the owner's sign-off. Copy quoted from `constants.tsx` or the CSV is real.

Skills for all of Section 5: **taste-skill** (art direction and screenshot look-and-fix loop), **better-layout** (responsive structure, reading order), **better-typography**, **better-accessibility**. Animation tasks also apply **emil-design-eng**.

### 5.1 Level 1, Spawn (hero) — `src/levels/L1Spawn.tsx`

**Purpose.** Say who this is and what he builds within one screen, and invite the visitor to start the run or skip straight to projects or contact.

**Content source.** `src/content/profile.ts` (moved from `HERO_CONTENT` and `SOCIAL_LINKS`), computed counts from `projects.ts`.

**Copy outline.**

- Eyebrow: `LEVEL 01 / 06 · SPAWN` + `はじめ` (aria-hidden).
- H1: `Mohammad Hamza` with a second line inside the same H1: `Senior Frontend Engineer` (smaller, `--fs-h3`, cobalt). One H1 on the page.
- Lead (Newsreader, `--fs-lead`), from `HERO_CONTENT.subtitle`: "Results-driven Frontend Engineer with 6+ years of experience building e-commerce platforms, Web3 applications, and interactive web experiences."
- Tagline (Newsreader italic): "Engineering Business Impact." (from `HERO_CONTENT.tagline`).
- Focus line (Inter Tight, `--fs-ui`, as a plain list): React · Next.js · Three.js / WebGL · Shopify · Web3.
- Availability: "Available for Collaborations" (from `HERO_CONTENT.availability`) · "Remote" **[ASSUMPTION: confirm]**.
- Credits strip (film credits style, `--fs-label`): `A MOHAMMAD HAMZA BUILD · 2019–2026 · 18 REELS IN THE ARCHIVE` (the count is computed from data).
- Actions: primary `Press start` (link to `#level-origin`), secondary `Skip to projects` (`#level-archive`), ghost `Hire me` (`#level-contact`).
- One-line game note under the actions, `--fs-small`, muted-strong: "This page is a six-level run. Scroll to play, or turn Play mode off in the passport." **[COPY: approve]**

**Layout, desktop (≥ 1024).** 12-column grid, `min-height: 100svh`, content vertically centered with the credits strip anchored above the ruler. H1 spans columns 1 to 9; kanji 始 sits in columns 10 to 12, vertical, top-aligned with the eyebrow, sized `--fs-kanji`. Lead and tagline span columns 1 to 7. Actions in a row.

**Layout, mobile (< 768).** Single column. Kanji at 55 % size, absolutely positioned top-right behind the H1 (`z-index: var(--z-kanji)`), clipped by the level container. H1 at `--fs-display` minimum (48 px) wraps to two lines; "Senior Frontend Engineer" on its own line. Actions stack full width, 48 px tall, 12 px apart. Credits strip wraps onto two lines. Tablet (768 to 1023): 8-column grid, kanji in columns 7 to 8.

**Animation.**

- H1 is **not** animated, so the LCP element paints immediately.
- Eyebrow, role line, lead and tagline: `MaskLine` on mount, starting at 80 ms, `--dur-reveal`, `--stagger` between lines.
- Kanji: `clip-path: inset(0 0 100% 0)` to `inset(0)` over 900 ms `--ease`, starting at 200 ms.
- Ruler: the baseline draws with `transform: scaleX(0 → 1)` from the left over 700 ms, starting at 300 ms; ticks then pop with `scaleY(0 → 1)` staggered 30 ms.
- Reduced motion: everything rendered in its final state.

**Gamification.** Level 1 "enter" XP is granted after 1.2 s on the page; "clear" when its end sentinel enters the viewport (the visitor has scrolled past the hero).

**Accessibility.** Skip link precedes the top bar. Actions are links (they navigate). The game note is plain text, not a tooltip. The kanji and credits strip ornaments are `aria-hidden` except the credits text, which stays readable.

**SEO.** H1 contains the name and "Senior Frontend Engineer". The lead contains "Frontend Engineer", "e-commerce", "Web3", "interactive". The focus list contains "React", "Next.js", "Three.js", "WebGL", "Shopify".

**Acceptance criteria.**

1. LCP element is the H1 and paints before 2.0 s in Lighthouse mobile.
2. At 360 × 740 the H1, lead and all three actions are visible without scrolling, above the ruler.
3. No horizontal scroll at any of the 5 widths; kanji never overflows.
4. With JavaScript disabled the hero looks the same, minus animation.
5. Tab order: skip link, top bar controls, Press start, Skip to projects, Hire me.

### 5.2 Level 2, Origin (about) — `src/levels/L2Origin.tsx`

**Purpose.** Give the human story and quick facts in a form that both recruiters and language models can quote.

**Content source.** `ABOUT_CONTENT` (bio, stats, education, achievement) and `EXPERIENCES` from `src/content/profile.ts` and `experience.ts`.

**Copy outline.**

- Eyebrow: `LEVEL 02 / 06 · ORIGIN` + `げんてん`.
- H2: "From running a D2C store to building Web3 and 3D interfaces" **[COPY: approve]** (based on the Self-Employed 2020–2022 and ITH Technologies entries).
- Bio: `ABOUT_CONTENT.bio`, split into three paragraphs at natural breaks: (1) the opening through "Shopify", (2) "with deep expertise in Shopify Store 2.0..." through "conversion-driven UI/UX", (3) the rest. Agents keep the wording; they only split and fix obvious punctuation ("data heavy" → "data-heavy").
- Quick facts, as a `<dl>`:
  - Role: Senior Frontend Engineer
  - Experience: 6+ years, since 2020
  - Focus: React, Next.js, Shopify (Online Store 2.0, Functions, Checkout Extensions), Web3 (Solana and EVM), Three.js and GLSL
  - Education: Bachelor of Computer Science, CSJM University, Kanpur – 2020
  - Recognition: "Promising Newcomer" award at ITH Technologies (from `ABOUT_CONTENT.achievement`)
  - Based in: Kanpur, India **[ASSUMPTION: derived from experience locations; confirm]**
  - Works: Remote
- Stats as "credits" (number large, label small). Each stat must carry its context so it is not misleading:
  - `6+` years of experience
  - `25+` projects shipped (owner-stated; the archive lists 18)
  - `35%` faster page loads after merging trading tools into one Next.js CRM (owner-stated)
  - `30–50%` speed improvement on the same CRM (owner-stated)
  The old unqualified "Performance Gain 50%" stat is replaced by the CRM-specific wording, which is how the CSV states it.

**Layout.** Desktop: H2 across columns 1 to 10; bio in columns 6 to 12; facts `<dl>` in columns 1 to 4 (aligned to the bio's first line); stats in a 4-up row below, separated by vertical hairlines like a film credit roll. Kanji 原点 on the left behind the facts. Mobile: H2, bio, facts (two-column `<dl>` grid: term 40 %, description 60 %; below 390 px terms stack above descriptions), stats as a 2 × 2 grid.

**Animation.** H2 and eyebrow `MaskLine` on view. Stat numbers mask-slide up (no count-up animation). Kanji clip reveal on view. Reduced motion: static.

**Gamification.** Enter and clear XP as in 7.2.

**Accessibility.** `<dl>` semantics; stats are a `<ul>` where each item reads "35% faster page loads after merging trading tools into one Next.js CRM". Reading order in DOM matches the visual order on mobile.

**SEO.** H2 contains "Web3" and "3D". Facts include "Senior Frontend Engineer", "React", "Next.js", "Shopify", "Kanpur, India", "Remote". This `<dl>` is also the source for the Person JSON-LD (9.5) so they never drift.

**Acceptance criteria.** All bio text visible without interaction; no stat appears without its context sentence; `<dl>` passes axe; layout holds at 360 with long words like "Online Store 2.0" wrapping cleanly.

### 5.3 Level 3, Skill Tree (tech stack) — `src/levels/L3SkillTree.tsx`

**Purpose.** Show breadth and depth, and prove each skill with a project.

**Content source.** `src/content/skills.ts` (new), built from `SKILLS` in `constants.tsx` plus the stacks in the CSV. Each node lists evidence as project slugs, so the type system rejects a skill that points to a project that does not exist.

**Skill tree (branches, nodes, evidence).** Depth labels are **[ASSUMPTION]** and must be confirmed by the owner (Section 12).

| Branch (H3) | Nodes | Evidence |
|---|---|---|
| Core frontend | React (core), Next.js (core), TypeScript (core), Angular (working), Tailwind CSS (working) | codeslytic-budget, unified-trading-crm, muftimaaz, skyai-3d-robot, existing `SKILLS` |
| Motion and 3D | Three.js (core), GLSL shaders (working), React Three Fiber (working), GSAP and ScrollTrigger (core), CSS animation (core), Pointer Events (working), Framer (working) | navig, skyai-3d-robot, motiongrid, studio-solyn |
| Commerce | Shopify Online Store 2.0 and Dawn (core), Liquid (core), Shopify Functions (core), Checkout Extensions (core), Shopify GraphQL (working), Custom apps with Remix, Polaris and Shopify CLI (working) | lammles, nighat-ahmad-official, hefashion, berbanto-atelier, Freelance experience entry |
| Web3 | Solana Web3.js, SPL tokens and Raydium SDK (core), Ethers.js (core), Wagmi (core), Web3.js (working), AppKit (working), Paymaster gasless minting (working), Solidity (familiar), wallet SDKs in React Native (working) | dex-cex-multisig-wallet, nft-marketplace, gesim, existing `SKILLS` |
| Product and backend | Node.js (working), PostgreSQL (working), IndexedDB offline sync (working), Docker (working), GitHub Actions (working), AWS EC2 (working), Cloudflare R2 (working), YouTube Data API (working), ERPNext and Frappe (working) | codeslytic-budget, muftimaaz, erpnext-manufacturing |
| Quality | Playwright end-to-end testing (working) | codeslytic-budget |
| Platforms and automation | WordPress and PHP 8 (working), WordPress REST API (working), n8n (working), NVIDIA NIM (familiar), Cloudflare Tunnel and Access (familiar) | bookease, promenade-medulin, ai-agent-team |
| Tools | Git, GitHub, Figma, VS Code, Postman, Jira | existing `SKILLS` |

**Copy outline.** Eyebrow `LEVEL 03 / 06 · SKILL TREE` + `わざ`. H2: "Skill tree: React, Next.js, Three.js, Shopify and Web3". Intro (one sentence): "Every skill below links to a project where it was used." **[COPY: approve]**. Each branch: H3, node chips in a `<ul>`, then a single line "Seen in: NAVIG · SkyAI robot · MotionGrid" with links to the project pages. A legend explains depth marks (filled dot = core, half = working, ring = familiar), with text, not only shapes.

**Layout.** Desktop: branches are "passport pages", cards on `--sheet` with a 1 px `--line` border and a page number, arranged in a 4-column masonry-free grid (2 rows of 4; Tools spans the last slot). A decorative SVG "trunk" line connects the branch cards along the top edge (`aria-hidden`). Mobile: single column of cards, chips wrap; no horizontal scrolling. Tablet: 2 columns.

**Animation.** When a card enters view, a small vermilion "visa" stamp lands in its corner (`Stamp` small variant, `--dur-stamp`, 80 ms stagger between cards). Chips do not animate. Reduced motion: stamps shown set.

**Gamification.** Clearing Level 3 unlocks the Arcade (7.4): toast "Arcade unlocked: Reel Pong" and the footer link updates.

**Accessibility.** Depth is conveyed by text in each chip (`<span class="sr-only">core skill</span>` or a visible small label), not by dot shape alone. Stamps are `aria-hidden`.

**SEO.** H2 and H3s carry the main technology keywords. Internal links from skills to project pages spread relevance to those pages.

**Acceptance criteria.** Every evidence slug resolves (type-checked); every "Seen in" link works with JS disabled; cards align on a baseline grid at 1024 and 1440; nothing overflows at 360.

### 5.4 Level 4, Archive (projects) — `src/levels/L4Archive.tsx`

**Purpose.** The centerpiece: browse the work as tapes on a curved shelf, open one into a detail sheet, and still see a plain index of everything.

**Content source.** `src/content/projects.ts` (Appendix D), `media-manifest.json`.

**Copy outline.** Eyebrow `LEVEL 04 / 06 · ARCHIVE` + `さくひん`. H2: "Selected projects". Intro: "Ten tapes on the shelf, eighteen in the archive. Drag, scroll sideways or use the arrow keys, then open a tape for the full story." **[COPY: approve]**. Below the shelf: H3 "Full archive" with the grouped index (6.10) and a link "Open the archive page" to `/projects`.

**Layout.** Desktop: the shelf stage spans the full content width (it may bleed to the viewport edges, clipped by the level). Stage height `min(100svh - var(--topbar-h) - var(--ruler-h), 760px)`. Caption under the active cover, round arrow buttons on either side of the caption, reel scrubber under the caption. Kanji 作品 at left, behind the shelf, as in the reference. Mobile: same structure, arrows sit at the caption's left and right edges (44 px), scrubber below. Full detail in Section 6.

**Animation, gamification, accessibility.** Section 6 and 7.

**SEO.** H2 "Selected projects"; each tape is a real `<a href="/projects/<slug>">`; the full index lists all 18 with descriptive link text (project title plus a short descriptor), all present in the prerendered HTML.

**Acceptance criteria.** Section 6.12.

### 5.5 Level 5, Career Path (experience) — `src/levels/L5CareerPath.tsx`

**Purpose.** Show the progression as a path, oldest to newest, with the ruler acting as the timeline.

**Content source.** `src/content/experience.ts` (moved from `EXPERIENCES`, with ISO month dates added: `2020-01`–`2022-01`, `2022-03`–`2023-01`, `2023-02`–`2025-12`, `2026-01`–present).

**Copy outline.**

- Eyebrow `LEVEL 05 / 06 · CAREER PATH` + `けいけん`.
- H2: "Career path: 6+ years of frontend engineering".
- Summary line right under the H2 so the latest role is seen first: "Now: Frontend Developer (Freelance), Product and E-commerce Solutions, since Jan 2026, remote."
- Four checkpoints in chronological order (oldest first, matching the ruler running left to right):
  1. Shopify and WordPress Developer (Founder), Self-Employed, Jan 2020 – Jan 2022, Remote.
  2. Shopify Developer, House of THL, Mar 2022 – Jan 2023, Kanpur, U.P.
  3. Frontend and Web3 Engineer, ITH Technologies, Feb 2023 – Dec 2025, Kanpur, U.P.
  4. Frontend Developer (Freelance), Product and E-commerce Solutions, Jan 2026 – Present, Remote.
  Each with its `details` bullet list verbatim from `EXPERIENCES`. Each checkpoint links to related projects ("Projects from this period: Unified CRM, DEX/CEX dashboards") only where the link is certain (ITH entry mentions the CRM, the trading dashboards and the multi-sig wallet). Other links wait for owner-confirmed years.

**Layout.** Desktop: a vertical path line in column 2 with checkpoint nodes; cards in columns 3 to 11; the year of each checkpoint set large (`--fs-h3`, cobalt) at the node. Mobile: the path line runs at the left gutter (16 px from the edge), nodes 12 px, cards full width to the right of the line.

**Ruler career mode.** While Level 5 is active, the ruler changes role: the six level markers dim (`--muted-strong`, still clickable), the year ticks get full weight, and the cobalt dot moves to the date of the checkpoint currently crossing the viewport center, using `p = (year + (month - 1) / 12 - 2019) / 7`. A small label rides above the dot: "2023 · ITH Technologies". When Level 5 is no longer active, the dot glides back to the level marker. The 2019 tick has no checkpoint **[open question: does the owner want a 2019 entry, for example the final year of the degree?]**.

**Animation.** Checkpoint nodes reveal with `clip-path: circle(0 → 50%)` over 420 ms when they reach the center line; role headings use `MaskLine`. The path line itself does not animate (it is structure). Reduced motion: static.

**Accessibility.** Each checkpoint is an `<article>` with an H3 (role), company, and `<time datetime="2023-02">Feb 2023</time> – <time datetime="2025-12">Dec 2025</time>`. Ruler career mode is visual only; dates are in the DOM.

**SEO.** H2 contains "frontend engineering"; H3s carry role titles ("Frontend and Web3 Engineer", "Shopify Developer"), which are role keywords.

**Acceptance criteria.** Dates are machine-readable; career mode dot matches the checkpoint in view within one frame of the IntersectionObserver callback; switching back to level mode glides in `--dur-dot`.

### 5.6 Level 6, Final Boss (contact) — `src/levels/L6FinalBoss.tsx`

**Purpose.** Convert: make contacting the owner obvious and rewarding, behind a playful red door that never blocks anyone.

**Content source.** `SOCIAL_LINKS` (email `erhamza.dev@gmail.com`, LinkedIn `https://www.linkedin.com/in/er-mohammad-hamza/`, GitHub `https://github.com/hamzam999`), resume file (Section 12).

**Copy outline.**

- Eyebrow `LEVEL 06 / 06 · FINAL BOSS` + `れんらく`.
- H2: "Hire a senior frontend developer".
- Lead: "Available for collaborations, remote. Tell me what you are building: a storefront, a dashboard, a 3D landing page or something stranger." **[COPY: approve; engagement types (freelance, contract, full-time) need the owner's confirmation]**
- Contact card (behind the door): email as a `mailto:` link plus a "Copy email" button; LinkedIn; GitHub; "Download resume (PDF)". No contact form (there is no backend).
- Closing credit line: "Thanks for playing." in Newsreader italic.

**The red door.** A door graphic sized to the contact card: ink frame, two `--vermilion` leaves with a paper-colored handle, the word "EXIT" set in Inter Tight above the frame. The contact card sits behind it in the DOM, before the door in reading order.

- The door opens automatically the first time the level becomes active, and also when the visitor activates the "Open the red door" button, or when keyboard focus enters the contact card (`focusin`). Focus therefore never lands on hidden content.
- Opening: the two leaves rotate on their outer edges, `rotateY(0 → -82deg)` and `rotateY(0 → 82deg)`, perspective 1200 px, over `--dur-door` with `--ease-sheet`. Then a vermilion stamp lands on the card: "BOSS DEFEATED" (only if Play mode is on).
- Reduced motion and no-JS: the door is rendered open (leaves not shown). Contact information is always in the prerendered HTML.

**Gamification.** Level 6 clears when its end sentinel is seen. Using any contact action grants the one-time "boss" XP (7.2).

**Accessibility.** The door graphic is `aria-hidden`. The "Open the red door" button has `aria-expanded` and controls the card; once open, it is removed. "Copy email" announces "Email address copied" through the status region and falls back to selecting the text if the Clipboard API is unavailable.

**SEO.** H2 "Hire a senior frontend developer" is a target phrase. Links to LinkedIn and GitHub match `sameAs` in JSON-LD.

**Acceptance criteria.** With JS disabled, email, LinkedIn, GitHub and resume links are visible and work; tabbing into the card opens the door instantly; the button label meets contrast (sheet on vermilion-ink, 5.26:1).

### 5.7 Top bar and navigation — `src/components/hud/TopBar.tsx`

- Fixed top, height `--topbar-h`, background `--sheet`, bottom hairline `--line`, padding-top `env(safe-area-inset-top)`. It never hides on scroll (a hiding bar causes jank and confusion on mobile).
- Left: monogram "MH" (cobalt square, sheet letters, 32 px inside a 44 px link to `/`) and the name "Mohammad Hamza" from 400 px wide.
- Center, from 1024 px: `LevelLabel` ("LEVEL 04 / 06 · ARCHIVE").
- Right: `XPCounter` (all widths, compact on mobile), `Passport` button, "Hire me" small primary button (from 1024 px, links to `#level-contact`), and a "Menu" button below 1024 px.
- Menu: a modal `<dialog>` that slides down from the top bar with `clip-path: inset(0 0 100% 0 → 0)`, containing: the six levels, All projects (`/projects`), Arcade, Interview framework, Resume, and settings (Play mode, Motion, Classic cursor). Closes on Escape, on link activation and on the backdrop.
- On routes other than `/`, the level label is replaced by the page name ("ARCHIVE / NAVIG", "ARCADE", "INTERVIEW FRAMEWORK"), and level links in the menu point to `/#level-...`.
- At 360 px the bar fits: monogram 44, level label "04/06" 56, XP 72, passport 44, menu 44, with 16 px gutters and 8 px gaps.

### 5.8 Bottom ruler and footer

The **ruler** (`src/components/hud/Ruler.tsx`) is the main navigation on `/`:

- Fixed bottom, `--ruler-h`, padding-bottom `env(safe-area-inset-bottom)`, background `--paper` with a top hairline so it reads as part of the page. Left and right padding include `env(safe-area-inset-left/right)` for iPhone landscape.
- A cobalt 1 px baseline; eight year ticks (2019 to 2026, `--fs-micro`, `--muted-strong`), decorative; six level markers placed at 0 %, 20 %, 40 %, 60 %, 80 %, 100 % of the track. Each marker is a link with a 44 × 44 hit area and a 9 px visual dot; its accessible name is "Level 4: Archive, selected projects".
- The active dot is a separate element inside a full-width track; its position is `transform: translateX(calc(var(--p) * 100%))` on the track wrapper, transitioning over `--dur-dot` with `--ease`. Transform only.
- Tap or click a marker to jump (4.3). Optional enhancement (P2 priority): drag the dot to scrub between levels; it snaps to the nearest level on release.
- On routes other than `/`, the ruler is hidden; the footer carries navigation.

The **footer** (`src/components/hud/Footer.tsx`) sits above the ruler padding:

- Column 1: name, "Senior Frontend Engineer", one line from the bio.
- Column 2: "Levels" (six links).
- Column 3: "Archive": All projects, and the first five featured titles.
- Column 4: "Elsewhere": Email, LinkedIn, GitHub, Resume (PDF).
- Column 5: "Extras": Arcade (with lock label, 7.4), Interview framework, `llms.txt`.
- Settings row: Play mode, Motion, Classic cursor toggles and "Reset progress" (asks for confirmation in a small dialog).
- Colophon: "Set in Inter Tight and Newsreader. Built with React and Vite. © 2026 Mohammad Hamza." The year is computed at build time.
- Mobile: columns stack; link lists in two columns where they fit.

### 5.9 404 — `src/routes/NotFound.tsx`

Kanji 迷. H1 "Lost reel". Text: "This tape is not in the archive. It may have been renamed or never existed." Links: Home, All projects, Arcade, and the five first featured projects. `<meta name="robots" content="noindex">`. Prerendered to `dist/404.html`; the host returns it with status 404 (9.8). No ruler on this page.

### 5.10 Interview framework page — `src/routes/InterviewFramework.tsx`

**Decision: keep the page and its behavior, re-skin it with the new tokens, and keep it indexable.** It is useful standalone content ("frontend interview questions" for JavaScript, TypeScript, React, Next.js, Angular, Shopify) and supports the owner's expertise signal, but it is not part of the game: no levels, no ruler, no XP on this route.

Changes:

- Move `pages/InterviewTool.tsx` and `components/interview/*` to `src/routes/InterviewFramework.tsx` and `src/components/interview/`; move `interviewData.ts` to `src/content/interview.ts`. Load the route with `React.lazy` so its 77 KB of data never ships on `/`.
- Replace colors: background `--paper`, panels `--sheet`, text `--ink`, accents `--cobalt`, selection highlight `--cobalt` at 12 % as a background with ink text. Remove all cyan, emerald, glow and blur classes.
- Typography: questions in Inter Tight 600, answers in Newsreader 400, code in the system monospace stack (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`), no extra font download.
- Keep search, category filter, list and detail pane. Fix keyboard support while there: list items as buttons with `aria-pressed` or a proper listbox; detail pane as a region with a heading.
- Title tag "Frontend interview questions: JavaScript, React, Next.js | Mohammad Hamza" and a matching description (9.3).
- Remove the temporary legacy Tailwind mappings (3.6) at the end of this task.

---

## 6. The VHS Archive shelf in depth

Skills: **emil-design-eng** (feel, interruptibility, spring tuning), **vercel-react-best-practices** (no per-frame React renders, lazy chunk), **better-accessibility** (carousel pattern, dialog, live region), **better-ui** (shadows, faces, edge details). Gate G3 uses the **review-animations** checklist: that skill has `disable-model-invocation: true`, so the owner runs `/review-animations` at the gate, or the reviewer reads `.claude/skills/review-animations/STANDARDS.md` directly.

### 6.1 What is ported from the reference, and what changes

Reference: `directions.html` in the planning scratchpad (function `layoutA`, CSS `.shelf`, `.sstage`, `.tape`, `.f`, `.sp`, `.cv`, `.cap`, `.ruler`, `.sheetD`). **Agents must copy the reference file into the repo at `docs/reference/directions.html` in task `P0-1`**, because the scratchpad is temporary.

| Reference behavior | Production change |
|---|---|
| Each tape animates with a CSS `transition: transform .8s` | A single rAF loop with a critically damped spring writes transforms directly; the CSS transition is removed so drag can follow the finger exactly and motion is interruptible |
| Integer active index `ai`, clamped at both ends | Float position `s` and target `T`, infinite wrap-around with three copies of the list |
| Swipe detected only on `pointerup` with a 40 px threshold | Continuous drag with axis lock, velocity flick, and `setPointerCapture` |
| No wheel support | Horizontal wheel and trackpad gestures move the shelf; vertical wheel always scrolls the page |
| `xs(u)` integrates `scl` with a step of 2 on every call | Precomputed lookup table per resize, linear interpolation |
| Global `document` keydown listener | Keys handled only when focus is within the shelf |
| `innerHTML` templates, `aria-label` rewritten each layout | React renders the tapes once; the loop only writes styles |
| Detail sheet clip-path starts from a fixed inset, 900 ms | Starts from the clicked cover's real rectangle, 1050 ms `--ease-sheet`, with text rise and ink-mask poster |
| Placeholder art gradients | Duotone screenshot art from the media pipeline, with the gradient poster kept as the fallback |

### 6.2 Geometry (exact formulas)

Inputs measured on resize: stage width `w`, stage height `stageH`.

Tape height `H`:

```
H = clamp(200, min(0.78 * w, 0.44 * stageH), 400)        // px
H = max(160, H) when window.innerHeight < 500 (phone landscape), using min 160 instead of 200
stageH = min(innerHeight(svh) - topbarH - rulerH, 760)
```

Expected values: 360 × 740 → H ≈ 276; 390 × 844 → H ≈ 304; 768 × 1024 → H ≈ 334; 1024 × 768 → H ≈ 289; 1440 × 900 → H ≈ 334.

Derived constants (all in px, recomputed on resize):

```
ws  = H * 142 / 840            // spine width
d   = H * 474 / 900            // cover width (tape depth)
gap = H * 0.035
U   = (w < 768 ? 1.05 : 1.3) * H
P   = 1400                     // CSS perspective on .shelf
```

For a tape at signed offset `r` from the current position (float, after wrapping, 6.3):

```
smooth(x) = x * x * (3 - 2 * x)
o   = smooth(max(0, 1 - |r|))                         // 1 at center, 0 for |r| >= 1
B(r)= |r| < 1 ? (r + sin(PI * r) / PI) / 2 : sign(r) * 0.5
u   = r * (ws + gap) + (d - ws + 1.4 * gap) * B(r)    // arc-length position
hidden if |u| > 1.95 * U
scl(u) = 1 / (1 + (|u| / U) ^ 1.6)
sc  = scl(u);  k = 1 / sc
X(u)= sign(u) * integral from 0 to |u| of scl(q) dq   // lookup table
x   = X(u) * k
y   = (H * 0.5 * (1 - sc) * 0.42 + o * H * 0.012) * k
z   = P * (1 - k) + o * H * 0.1
ry  = sign(u) * min(1, |u| / U) * 26 * (1 - o) - 90 * o + tiltY     // degrees
transform = translate3d(x, y, z) rotateY(ry) rotateX(tiltX)
zIndex    = round(3000 + z)
spineShade = min(0.6, o * 0.55 + (1 - sc) * 0.32)
coverShade = (1 - o) * 0.82
```

Why the `k` factors: pushing a tape back by `z = P(1-k)` makes perspective shrink it to exactly `sc`, and multiplying `x` and `y` by `k` cancels the perspective shift, so the on-screen position equals `X(u)`. Agents must keep this relationship if they tune anything.

Faces (set once per resize, not per frame):

- Spine: `left: -ws/2; top: -H/2; width: ws; height: H; transform: translateZ(d/2)`.
- Cover: `left: -d/2; top: -H/2; width: d; height: H; transform: rotateY(90deg) translateZ(ws/2)`.
- Both faces `backface-visibility: hidden`, radius `--r-1`.

Lookup table: on resize, compute `X` for integer `u` from 0 to `ceil(2U)` with the trapezoid rule; at runtime interpolate linearly. Unit-test that the table matches a fine numerical integral within 0.5 px and that `X` is monotonic.

Containment: `.shelf` (the perspective root) has `overflow: clip; contain: layout paint;` so off-stage tapes never create horizontal page scroll. The child `.sstage` keeps `transform-style: preserve-3d`; only the perspective root clips, which does not flatten the 3D children.

### 6.3 Loop, spring and wrap-around

State held in refs (never React state): `s` (current float position), `T` (target), `N` (featured count, 10), `dragging`, `tilt {x, y, tx, ty}`.

Each frame:

```
dt = min(0.05, (now - last) / 1000)
kSpring = dragging ? 18 : 5.2
s += (T - s) * (1 - exp(-kSpring * dt))
tilt.x += (tilt.tx - tilt.x) * (1 - exp(-8 * dt))   // same for y
if (|T - s| < 0.0005 && tilt settled && !dragging) { s = T; render(); stop loop }
if (s >= N) { s -= N; T -= N }  if (s < 0) { s += N; T += N }
render()
```

Wrap-around with three copies: the pool contains `3N` tape elements, one per pair (item `i`, copy `c` with `c` in {-1, 0, 1}). For each:

```
r0 = ((i - s) mod N + N) mod N;  if (r0 > N / 2) r0 -= N
r  = r0 + c * N
```

With `N = 10`, `r` covers about -15 to 15, which exceeds the widest visible span (about ±12 tapes on desktop), so no gap ever appears. Active index = `((round(s) mod N) + N) mod N`. Moving to item `j` uses the shortest path: `T = s + shortest(j - activeIndex)` where `shortest` maps the difference into (-N/2, N/2].

Rendering writes only `style.transform`, `style.zIndex`, the shade overlay's `style.opacity`, and toggles `hidden` when a tape crosses the visibility threshold (rare). React re-renders only when the rounded active index changes (to update the caption and roving tabindex), and that update is batched and deferred with `startTransition`.

### 6.4 Performance policy

- **Transform-only.** No layout reads in the loop; sizes cached on resize (`ResizeObserver` on the stage, coalesced into the next frame).
- **Shade overlays** are real child elements (`.shade`) whose `opacity` is set directly, rather than a CSS custom property read by a pseudo-element, to avoid style recalculation of the face.
- **`will-change: transform`** is set on visible tapes only while the shelf intersects the viewport (IntersectionObserver, `rootMargin: 200px`), and removed when it leaves. Estimated layer memory at 1440 px with about 25 visible tapes is roughly 25 MB at DPR 2, acceptable; at 360 px about 18 tapes.
- **Pause:** the loop stops when settled, when the shelf is off screen, and on `visibilitychange` to hidden. Idle CPU must be 0 % in a performance trace.
- **Virtualization (36-tape cap):** the pool size is `min(36, 3N)`. With 10 featured items the pool is 30. If the owner ever features more than 12 items, the shelf switches to windowed rendering: compute the visible offset range `[-R, R]` from `|u(r)| <= 1.95U`, allocate `2R + 1` pool slots (at most 36), and reassign slots to logical positions when `floor(s)` changes. Unit-test the slot assignment.
- **Images:** cover art via `<picture>` (AVIF, WebP), explicit `width` and `height`, `decoding="async"`. The three tapes nearest the start position load eagerly with `fetchpriority="low"`; all others `loading="lazy"`.
- **Chunking:** `Shelf` is `React.lazy` and mounts when Level 4 is within one viewport height (IntersectionObserver `rootMargin: "100% 0px"`) or on `requestIdleCallback` after load, whichever comes first. Chunk budget 18 KB gzip.
- **No CLS:** the stage box has its height defined in CSS with the same formula (`clamp()` with `svh`), and the SSR grid fallback (6.9) occupies the same box, so mounting the shelf swaps content without shifting the page.
- **INP:** pointer handlers do arithmetic only; opening the sheet defers heavy work (mask filter setup) to the next frame after the dialog is shown.

### 6.5 Input handling

Pointer (mouse, pen, touch) on `.shelf`:

1. `pointerdown` (primary button or any touch): store `x0, y0, t0, s0`; do not capture yet.
2. `pointermove`: if no axis is decided and `|dx| > 8` and `|dx| > |dy|`, enter drag: `setPointerCapture`, `dragging = true`. If `|dy| > 8` first, abandon; the browser takes the vertical pan because of `touch-action: pan-y` and fires `pointercancel`.
3. During drag: `T = s0 - dx / pitch`, where `pitch = d + gap`. Track velocity in px/ms as an exponential moving average over the last 80 ms.
4. `pointerup`: `T = round(T - velocity * 120 / pitch)`, limited to ±4 from the release position; `dragging = false`.
5. Click handling: if total movement was under 6 px, treat it as a click. A capture-phase click listener cancels the click that follows a drag.

`touch-action: pan-y` on `.shelf` is mandatory: vertical page scrolling over the shelf must work on iOS and Android.

Wheel (`passive: false`, but only calls `preventDefault` when it consumes the event):

- If `|deltaX| > |deltaY|` (trackpad sideways swipe, horizontal wheel), consume: `T += deltaX_px / pitch` (normalize `deltaMode`: line = 16 px, page = stage width). After 140 ms without wheel events, snap `T = round(T)`.
- If `shiftKey` and `deltaY` is non-zero, treat `deltaY` as horizontal (common desktop convention).
- Plain vertical wheel is never consumed, so the page always scrolls.

Keyboard (only while focus is within the shelf): Left and Right move by one; PageUp and PageDown by three; Home and End go to the first and last featured item by the shortest path; Enter or Space on the active tape opens it; on another tape, selects it.

Buttons: previous and next round buttons (44 px, cobalt outline) beside the caption, with `aria-controls` pointing to the shelf.

Reel scrubber: one small tick per featured tape labeled with its frame number (01 to 10); clicking jumps by the shortest path. Ticks are buttons with accessible names ("Go to tape 3: Lammle’s") but `tabindex="-1"`, because the arrow keys and the index already cover keyboard use and ten extra tab stops would be noise.

Cover tilt (mouse and pen only, motion allowed): while the pointer is over the active cover, `tilt.tx = -(py - 0.5) * 10` degrees (rotateX) and `tilt.ty = (px - 0.5) * 14` degrees (added to rotateY), where `px` and `py` are the pointer position in the cover from 0 to 1. On leave, targets return to 0.

Clicking an inactive tape selects it; clicking the active tape opens the detail sheet. Modifier-clicks (Ctrl, Cmd, Shift, middle button) are not intercepted, so the link opens `/projects/<slug>` in a new tab as usual.

### 6.6 Mobile behavior and geometry

- `U = 1.05 H` below 768 px, so the arc is tighter and more tapes stay visible.
- Expected H values are in 6.2. At 360 px the cover is about 145 px wide, which keeps the title legible at `--fs-h3` in the caption (the cover's own title is decorative repetition).
- Caption: title `clamp(26px, 4.4vw, 44px)` as in the reference, then category and genre in `--fs-label`, a short cobalt bar, and the year meta.
- Arrow buttons sit to the left and right of the caption with at least 8 px from the safe-area edge.
- Phone landscape (height under 500 px): H minimum 160 px; the caption moves beside the shelf only if width ≥ 740 px; otherwise the stage simply scrolls with the page.
- No horizontal page scroll is possible because the perspective root clips.

### 6.7 Keyboard and screen-reader pattern

Markup (simplified):

```html
<section class="shelf-wrap" aria-roledescription="carousel" aria-label="Project shelf">
  <p id="shelf-help" class="sr-only">Use the left and right arrow keys to browse tapes. Press Enter to open the selected project.</p>
  <div class="shelf" data-shelf>
    <div class="sstage">
      <!-- copy 0: real, focusable via roving tabindex -->
      <a class="tape" href="/projects/navig" tabindex="0"
         aria-label="NAVIG, 3D and interactive, tape 1 of 10" aria-describedby="shelf-help">…</a>
      <!-- copies -1 and +1: decorative -->
      <a class="tape" href="/projects/navig" tabindex="-1" aria-hidden="true" inert>…</a>
    </div>
  </div>
  <div class="caption" aria-hidden="true">…</div>
  <p class="sr-only" aria-live="polite" aria-atomic="true" data-shelf-status></p>
  <button aria-controls="…" aria-label="Previous project">…</button>
  <button aria-controls="…" aria-label="Next project">…</button>
</section>
```

Rules:

- Roving tabindex: only the active copy-0 tape is in the tab order. Arrow keys move focus to the new active tape (focus follows selection), and its label is read.
- The live region is updated only when the selection changes **without** a focus move (drag, wheel, arrow buttons, scrubber), debounced 250 ms after the shelf settles, with text like "Lammle’s. E-commerce and Shopify. Tape 3 of 10." This avoids double announcements for keyboard users.
- The visual caption is `aria-hidden` because the label and live region carry the same information.
- There is no auto-rotation, so no pause control is needed (WCAG 2.2.2).

### 6.8 Detail sheet

- Implementation: native `<dialog>` opened with `showModal()` when the modal route mounts; `aria-labelledby` points to the project title. The background becomes inert automatically.
- Initial focus: the Close button (top-left, 44 px, label "Close"). Escape triggers the `cancel` event; the handler prevents the default, runs the close animation, then calls `close()` and navigates back (4.4). Focus returns to the copy-0 tape for that slug (or the index link if the sheet was opened from the index).
- Scroll lock: `html { overflow: hidden }` while open, `overscroll-behavior: contain` on the dialog, and `scrollbar-gutter: stable` on `html` so the page does not shift.
- **Open animation:**
  1. Start clip from the cover's rectangle: `clip-path: inset(top right bottom left round 2px)` computed from `originRect` and the viewport. Without `originRect`, use `inset(35% 38% 30% 38% round 3px)`.
  2. Next frame: transition to `inset(0 round 0)` over `--dur-sheet` (1050 ms) with `--ease-sheet`.
  3. Text: every line of the eyebrow, title, synopsis lead and meta is a `MaskLine` starting at `translateY(110%)`, beginning at 450 ms, `--dur-reveal`, `--stagger`.
  4. Poster ink reveal, starting at 300 ms: the poster is an inline `<svg>` containing `<image href=... preserveAspectRatio="xMidYMid slice">` with `mask="url(#ink-<slug>)"`. The mask holds seven `<circle>` elements filtered by `feTurbulence` (`baseFrequency="0.018"`, `numOctaves="2"`, seed derived from the slug) and `feDisplacementMap` (`scale="38"`), giving ragged ink edges. Circle centers in poster units: (0.20, 0.30), (0.75, 0.25), (0.50, 0.60), (0.15, 0.80), (0.85, 0.70), (0.40, 0.15), (0.62, 0.88); target radii as a fraction of the poster diagonal: 0.32, 0.28, 0.36, 0.24, 0.30, 0.22, 0.26. Each grows from 0 over 900 ms `--ease`, staggered 70 ms, driven by rAF writing the `r` attribute. At 1400 ms the mask is removed so the filter no longer costs anything while reading. (A CSS `mask: url(#id)` on an HTML element is not used because Chromium does not support SVG mask references on HTML content.)
- **Close animation:** text lines drop to `translateY(110%)` in 250 ms; the clip shrinks back to the current rectangle of the active cover over 700 ms `--ease-sheet`; then `close()`.
- **Layout:** desktop two columns (text in 5 of 12 columns, poster in 7, padding `56px 6vw 28px` as in the reference); mobile one column with the poster first at 16:10, the Close button sticky at top-left, safe-area padding, and internal scrolling.
- **Content:** `ProjectDetail` with `headingLevel={2}`: eyebrow (category · genre), H2 title, synopsis, "My role", "Stack" (chips), "Results" (owner-stated claims only, each attributed), link block (live site, repository, private notice or "out of print"), "Built by Mohammad Hamza" credit, and "Open as a page" link (same URL, for copying).
- **Reduced motion:** no clip animation, no mask, no text rise; the dialog simply appears.

### 6.9 Fallbacks: no JavaScript, reduced motion, failure

- **Prerendered markup** for the stage box is a static grid of the ten featured tapes shown face-on (`<ol class="tape-grid">`): cover art (or `PosterFallback`), title, category, each a link to `/projects/<slug>`. This is what crawlers and no-JS visitors see.
- **JavaScript with motion allowed:** the shelf chunk mounts and replaces the grid inside the same box.
- **JavaScript with reduced motion:** the grid stays, with a button "Show as shelf". If chosen, the shelf runs with `s = T` instantly (no spring), no tilt, no sheet animation. The choice is stored in settings.
- **Error boundary:** if the shelf throws, the grid is restored and the error is logged to the console only.
- Grid columns: 2 at 360 to 767 px, 3 at 768 to 1023 px, 5 at 1024 px and above.

### 6.10 Archive index (all 18 projects)

Rendered under the shelf (compact variant) and on `/projects` (full variant). Grouped by category in this order: 3D and Interactive, E-commerce and Shopify, Web3, Full-stack and Product, AI and Automation, WordPress and Client. Each group is a `<section>` with an H3 and a `<ul>`. Each row: title (link to `/projects/<slug>`), one-line summary, first three stack items, and a status badge: `LIVE`, `REPO`, `PRIVATE` or `OUT OF PRINT` (vermilion-ink text for out of print). The full variant adds the year column (shows "TBC" until confirmed).

### 6.11 Asset pipeline for screenshots

Owner input (Appendix C has the full spec):

- Required: `media-src/projects/<slug>/screenshot.png` (or `.jpg`, `.webp`), desktop capture, 2560 × 1600 (16:10), minimum 1920 × 1200.
- Optional: `media-src/projects/<slug>/mobile.png`, 1170 × 2532 (iPhone at 3x). If present, the cover art is cropped from it (portrait source suits the portrait cover); otherwise from the desktop screenshot.

`scripts/build-project-media.mjs` (uses `sharp`), for every project in `projects.ts`:

1. Find the source; if missing, record it as missing and continue.
2. **Hero** (true color; used by the project page, the detail sheet poster and OG images): resize to 16:10 at widths 640, 1280, 1920 → `public/projects/<slug>/hero-640.avif`, `hero-1280.avif`, `hero-1920.avif` (AVIF quality 55, effort 6) and the same in `.webp` (quality 78).
3. **Cover art** (duotone; used on the cover face and the spine strip): crop to aspect 0.823 (the cover's art window, see below) around `media.focal` (default `{ x: 0.5, y: 0.3 }`), at 300 × 364 and 600 × 728. Convert to grayscale, apply `linear(1.15, -12)` for contrast, then map each pixel's luminance `l` from the swatch's shadow color to its highlight color in a raw pixel loop (`out = shadow + (highlight - shadow) * l / 255`). Write `cover-300.avif/.webp` and `cover-600.avif/.webp`.
4. **Mobile** (optional, true color): `mobile-390.avif/.webp`, `mobile-780.avif/.webp`.
5. Write `src/content/media-manifest.json`: `{ "<slug>": { "hero": { "w": [640,1280,1920], "ratio": 1.6 }, "cover": { "w": [300,600] }, "mobile": { "w": [390,780] } | null, "dominant": "#rrggbb", "sourceHash": "<sha1>" } }`. Unchanged sources (same hash) are skipped, so the script is fast.
6. Print a table of missing screenshots. Exit 0 unless `--strict` is passed.

Duotone colors by spine swatch:

| Swatch | Spine background | Spine text | Duotone shadow | Duotone highlight |
|---|---|---|---|---|
| `cobalt` | `--cobalt` | `--sheet` | `#1F3FB0` | `#ECE8E0` |
| `ink` | `--ink` | `--paper` | `#141414` | `#ECE8E0` |
| `graphite` | `--graphite` | `--sheet` | `#2A2A2A` | `#F3F0EA` |
| `paper` | `--paper` with a 6 px cobalt band at top and bottom and a 1 px `--line-strong` edge | `--cobalt` | `#1F3FB0` | `#F3F0EA` |

How the faces are composed in CSS (no extra image files):

- **Cover face**, top to bottom: a solid swatch band (22 % of H) with `A MOHAMMAD HAMZA BUILD` (`--fs-label`, size scaled with H) and the card title in Newsreader 600 uppercase as in the reference; the **art window** (64 % of H, aspect `d / 0.64H ≈ 0.823`) holding the duotone `<img>` with `object-fit: cover` and `object-position` from the focal point; a bottom band (14 %) with the genre tag in a bordered box and a `VHS` badge.
- **Spine face**: solid swatch, a top strip (28 % of H) showing the same cover-art image with `object-fit: cover` (which crops a thin vertical slice automatically), the vertical title (`writing-mode: vertical-rl; transform: rotate(180deg)`), a dot, and the `VHS` mark at the bottom, as in the reference.
- **NFT Marketplace** additionally gets an `OUT OF PRINT` sticker (vermilion fill, sheet text at 24 px equivalent, or vermilion-ink if smaller) on the cover band.
- **Private projects** keep their art, but the cover band shows `PRIVATE REEL`.

**Fallback while screenshots are missing** (`PosterFallback`): the art window and poster use the reference's geometric poster: `radial-gradient(circle at 72% 28%, accent 0 16%, transparent 17%), linear-gradient(160deg, swatchBg 55%, accent 56%)` with the accent from the swatch table (cobalt swatch uses vermilion accent only as a 16 % circle, which counts as decorative), plus the project title set large in Inter Tight. The build never fails because of a missing image; the image sitemap only lists images that exist.

Alt text rules: the hero image's alt comes from `media.alt` ("NAVIG homepage: a 3D wave of glowing particles rendered in WebGL"). Cover art inside a tape link is decorative (`alt=""`) because the link has a full label. Until the owner writes `media.alt`, it defaults to "Screenshot of <title>", and the media script warns.

### 6.12 Shelf acceptance criteria

1. Drag follows the finger with no visible lag at 60 fps on a mid-range Android (4x CPU throttle in Chrome DevTools as the lab proxy), with no long tasks over 50 ms during drag.
2. Vertical swipes over the shelf scroll the page on iOS Safari and Android Chrome.
3. Vertical mouse wheel over the shelf scrolls the page; horizontal trackpad swipes move the shelf.
4. Infinite wrap in both directions with no visible gap or jump at any viewport width.
5. Idle CPU is 0 % with the shelf in view and settled; the loop stops when the shelf is off screen.
6. Keyboard: Tab reaches the active tape; arrows, Home, End, PageUp, PageDown, Enter all work; focus returns to the tape after closing the sheet.
7. Screen reader (VoiceOver iOS and macOS, NVDA or TalkBack): tape labels read with position; drag changes are announced once.
8. The detail sheet URL is `/projects/<slug>`; reload shows the standalone page with the same content.
9. Reduced motion shows the grid by default; the shelf option works without animation.
10. With JS disabled the grid and full index render with working links.
11. CLS contribution from the shelf mount is 0.

---

## 7. Gamification system

Skills: **emil-design-eng** (reward moments), **better-accessibility** (announcements, opt-out), **typescript-advanced-types** (event ID types).

### 7.1 Principles

- The game is a layer over a normal portfolio. **No content is ever locked behind XP.** A visitor who ignores the game, or turns it off, loses nothing but stamps and numbers.
- It rewards attention, not compulsion: no streaks, no timers, no countdowns, no "you will lose your progress", no nagging, no notifications, no daily caps or resets designed to bring people back, no fake scarcity.
- Nothing leaves the browser. XP is stored in `localStorage` only. There is no tracking.

### 7.2 XP rules (`src/game/rules.ts`)

| Event ID | Trigger | XP | Limit |
|---|---|---|---|
| `level:<n>:enter` | Level `n` has been the active level for 1.2 s cumulative | 40 | Once per level (6 levels, 240 total) |
| `level:<n>:clear` | Level `n`'s end sentinel intersects the viewport after level `n` has been active for at least 2 s cumulative, and not during a programmatic ruler jump | 60 + stamp | Once per level (360 total) |
| `project:<slug>:open` | Detail sheet opened, or `/projects/<slug>` visited | 20 | Once per project, at most 10 projects (200 total) |
| `arcade:pong:win` | Win a game of Reel Pong (any difficulty or accessible mode) | 120 for the first win, 30 for later wins | 300 total |
| `boss:contact` | Use any contact action in Level 6 or the footer (mailto click, copy email, LinkedIn, GitHub, resume) | 100 | Once |

Maximum: **1,200 XP**. The counter shows `FR 0000` to `FR 1200`. Completing all six levels shows a "Run complete" card in the passport (no extra XP).

Implementation: the store keeps a record of granted events with timestamps; XP is **derived** from the events by `rules.ts` (`computeXP(events)`), so rule changes migrate cleanly and editing `localStorage` cannot produce more than the cap. `rules.ts` is pure and fully unit-tested (caps, ordering, unknown events ignored).

### 7.3 Stamps and passport

- Seven stamps: six level stamps (kanji of the level, "LEVEL 0n CLEARED", date) and one arcade stamp ("REEL PONG CHAMPION", 遊).
- When a level clears with Play mode on, a stamp lands near the XP counter (toast layer) and the passport button shows a small vermilion dot until opened.
- Passport dialog content: title "Passport", total XP, seven slots (each with text status), "Run complete" card if applicable, settings (Play mode, Motion, Classic cursor), "Reset progress" (confirmation step).

### 7.4 Arcade unlock

- `level:3:clear` sets `arcadeUnlocked`. A toast reads "Arcade unlocked: Reel Pong".
- The Arcade link is always visible in the footer and menu. Locked: "Arcade · clear Level 3 to unlock". Unlocked: "Arcade" with a "NEW" mark until first visit.
- Visiting `/arcade` while locked still works; a banner says "You found the arcade early. Play anyway." The lock is a label, not a gate.

### 7.5 Persistence and announcements

Storage key `aq:v1`:

```json
{
  "version": 1,
  "events": { "level:1:enter": "2026-11-25T10:00:00Z" },
  "settings": { "play": true, "motion": "system", "cursor": "custom", "shelfView": "auto" },
  "pong": { "wins": 0, "losses": 0, "difficulty": "normal", "accessible": false },
  "arcadeSeen": false
}
```

- All reads and writes go through `src/game/storage.ts` with `try/catch`; on failure the store keeps working in memory for the session.
- Unknown `version` resets to defaults. A `storage` event listener keeps multiple tabs in sync.
- Announcements: one polite live region (`#game-status`) announces only level clears ("Level 3 cleared. Stamp added to your passport.") and the arcade unlock. XP increments are not announced (too chatty). Nothing is announced when Play mode is off.

### 7.6 Off switch, skipping and reduced motion

- **Play mode off** hides the XP counter, toasts, stamp landings and the door's "BOSS DEFEATED" stamp, and stops granting XP. The ruler, level labels and passport button remain (the passport becomes the place to turn Play mode back on). The arcade remains available.
- **Skipping:** hero actions, the ruler, the skip link and the menu let anyone jump anywhere at any time.
- **Motion off** (setting) or `prefers-reduced-motion: reduce`: duration tokens become 0, the spring snaps, stamps appear set, XP digits change in place, the toast appears and disappears without sliding, the door is open, the shelf shows the grid by default, the cursor follower is disabled (native cursor shown).

---

## 8. Arcade page (`/arcade`)

Skills: **vercel-react-best-practices** (lazy route, effect cleanup), **better-accessibility** (game alternative, keyboard), **emil-design-eng** (game feel), **playwright-best-practices** (canvas testing).

### 8.1 Page content (prerendered)

- Kanji 遊, eyebrow `ARCADE`, H1 "Arcade".
- Intro: "Small games built for this site. Win Reel Pong to earn the arcade stamp." **[COPY: approve]**
- Game card "Reel Pong": a DOM scoreboard ("You 0 · CPU 0"), the canvas area, controls (Start or Pause button, Difficulty segmented control Easy / Normal / Hard, Accessible mode toggle), and a "How to play" paragraph: "First to 5 points wins. The rally speeds up with every hit. Move your paddle with the mouse, by dragging a finger, or with the arrow keys or W and S. Press P or Escape to pause."
- Two placeholder slots: "Reel 02" and "Reel 03", each reading "Coming later" with no fake screenshots or descriptions. Driven by a registry in `src/components/arcade/games.ts`: `{ id, title, status: 'live' | 'soon', load?: () => import(...) }`.
- Link back to the archive and home.

### 8.2 Engine (`src/components/arcade/pong-engine.ts`, pure TypeScript, unit-tested)

- Fixed timestep: 120 Hz accumulator; rendering on rAF.
- Coordinates are expressed along the paddle axis ("along") and toward the opponent ("across"), so the same engine runs in landscape (field 480 × 300) and portrait (300 × 480).
- Ball radius 7; paddles 8 × 60 (8 × 90 in accessible mode), 14 px from the edge.
- Serve speed 240 px/s at a random angle within ±0.4 rad, toward the player who just lost the point (the first serve goes toward the CPU); 700 ms pause before each serve.
- On a player hit: speed × 1.07; on a CPU hit: × 1.05; maximum 660 px/s. Spin: the along-velocity changes by `(ballAlong - paddleAlong) * 4.2` per hit (the reference's per-frame constant converted to per-second units).
- Walls reflect the along-velocity.
- CPU: follows the ball when it moves toward the CPU, otherwise returns to center. Easy: 130 px/s, 180 ms reaction delay, ±18 px aim error. Normal: 174 px/s (the reference's 2.9 px per frame), 90 ms delay. Hard: 230 px/s, predicts wall bounces, no delay.
- Accessible mode: ball speed × 0.7, no speed-up, larger paddle, CPU fixed at Easy.
- States: `idle`, `serve`, `play`, `point`, `paused`, `over`. First to 5 ends the game.

### 8.3 Rendering (`ReelPong.tsx`)

- `<canvas>` sized by `ResizeObserver` to its container; backing store scaled by `min(devicePixelRatio, 2)`.
- Orientation: landscape when the container aspect is at least 1.05 (8:5 field), otherwise portrait (5:8 field) with the CPU at the top and the player at the bottom, so phone players drag with a thumb.
- Palette from the reference: `--paper` field, cobalt center dashes and paddles, ink ball with a paper center dot, a 1 px ink frame, score digits in cobalt at 25 % alpha drawn on the canvas as decoration. In accessible mode, paddles are ink for stronger contrast.
- Idle and paused banners are drawn on the canvas **and** mirrored by DOM buttons ("Start game", "Resume").
- Mobile: canvas width 100 % of the content column, height at most `calc(100svh - var(--topbar-h) - 160px)`, centered; controls below in a wrapping row of 44 px buttons.

### 8.4 Controls

- Pointer: moving the mouse or dragging a finger on the canvas sets the paddle position directly. `touch-action: none` on the canvas only, so the page still scrolls when touching outside it.
- Keyboard (canvas focused, `tabindex="0"`, visible focus ring): hold ArrowUp/ArrowDown or W/S in landscape, ArrowLeft/ArrowRight or A/D in portrait, paddle speed 360 px/s; Space or Enter to start or serve; P or Escape to pause. Arrow keys call `preventDefault` only while the canvas is focused and the game is running, so the page never gets stuck.
- Pause automatically on `visibilitychange` (hidden), window `blur`, the canvas leaving the viewport (IntersectionObserver below 50 %), and any dialog opening.

### 8.5 Accessibility alternative

- The game is optional; nothing but the arcade stamp and Pong XP depends on it.
- Accessible mode (8.2), full keyboard play, pause at any time, and a polite live region in the DOM scoreboard announcing each point ("You 3, CPU 2") and the result.
- The canvas has `role="img"` and an `aria-label` describing the game; the controls and rules are DOM text.
- Reduced motion does not remove the game (the player starts it deliberately) but disables screen-shake and the win stamp animation.

### 8.6 Unlock and XP

- See 7.4 for unlock. A win calls `grant('arcade:pong:win')`; the first win also lands the arcade stamp over the game card and shows the toast "+120 FR".
- Losing has no penalty and no message beyond "CPU wins. Play again?".
- Budget: arcade route chunk ≤ 14 KB gzip; the engine has no dependencies.

---

## 9. SEO and GEO

Skills: **vercel-react-best-practices** (prerender, hydration, bundle), **better-accessibility** (semantic HTML doubles as SEO), **nextjs-app-router-patterns** (reference only, for metadata conventions), **playwright-best-practices** (crawlability tests).

### 9.0 Honest expectations

Rankings depend mostly on content that matches what people search for, on links from other sites, and on time. Technical work (prerendering, metadata, structured data, speed) removes obstacles; it does not create demand or authority. Realistically:

- **Name queries** ("Mohammad Hamza frontend", "erhamza") should rank first within weeks of indexing, because the site, LinkedIn and GitHub will agree on one entity.
- **Long-tail and project queries** ("Shopify checkout extension developer", "Three.js particle scroll website developer", "Angular to Next.js migration developer") are winnable, because each project page is specific and the competition is thinner.
- **Head terms** ("React developer", "senior frontend developer") are dominated by job boards and marketplaces. The site should target them in headings for relevance, but traffic from them depends on backlinks: GitHub profile and repository READMEs linking to the site, the LinkedIn "Website" field, client credits in site footers where clients allow it, and occasional write-ups (for example a technical post about the NAVIG particle system or the shelf geometry) on dev.to, Hashnode or Medium with a canonical link back.
- **GEO (answers from language models)** benefits from clear, consistent, factual text: the quick-facts list, the project pages with plain-language synopses, `llms.txt` and `llms-full.txt`, and consistent `sameAs` links. None of this guarantees citation.

### 9.1 Keyword strategy

Intent groups and where each is targeted. "Primary" terms appear in titles and H1/H2s; "secondary" in H2/H3s, intros and descriptions; "long-tail" on the specific project pages.

| Intent | Primary | Secondary | Long-tail examples | Target page or section |
|---|---|---|---|---|
| Identity | Mohammad Hamza | Mohammad Hamza frontend engineer; Er. Hamza developer | Mohammad Hamza React developer India | `/` H1, title, Person JSON-LD |
| Senior frontend role | senior frontend developer; senior frontend engineer | frontend engineer 6+ years; React and Next.js engineer | senior frontend developer for e-commerce and Web3 | `/` title and description, L1 H1 role line, L6 H2 |
| React and Next.js | React developer; Next.js developer | freelance React developer; remote Next.js developer; Next.js performance optimization | Angular to Next.js migration; offline-first Next.js app with IndexedDB sync | L3 H2, `/projects/unified-trading-crm`, `/projects/codeslytic-budget`, `/projects/muftimaaz` |
| 3D and WebGL | Three.js developer; WebGL developer | React Three Fiber developer; GSAP scroll animation developer; GLSL shader developer | Three.js scroll particle website; 3D robot scroll landing page React Three Fiber | L3 branch "Motion and 3D", `/projects/navig`, `/projects/skyai-3d-robot` |
| Shopify | Shopify developer | Shopify Functions developer; Shopify checkout extensions developer; Shopify theme customization; Online Store 2.0 Dawn developer | Shopify checkout payment and delivery customization; Shopify Atelier theme custom sections | L3 branch "Commerce", `/projects/lammles`, `/projects/berbanto-atelier`, `/projects/nighat-ahmad-official`, `/projects/hefashion` |
| Web3 | Web3 frontend developer | Solana frontend developer; crypto trading dashboard developer; dApp frontend developer | multi-signature wallet frontend React; NFT marketplace Base Solana Sui frontend; eSIM Web3 app | L3 branch "Web3", `/projects/dex-cex-multisig-wallet`, `/projects/nft-marketplace`, `/projects/gesim` |
| Freelance and remote | freelance frontend developer; remote frontend developer | hire React developer; contract frontend engineer | hire freelance Shopify developer India | L6 H2 and lead, `/` description |
| Location | frontend developer India | frontend developer Kanpur **[ASSUMPTION: location]** | React developer India remote for global clients | L2 quick facts, Person JSON-LD `address` |
| Services (supporting) | WordPress developer; ERPNext developer | WordPress booking plugin; ERPNext customization for manufacturing; n8n automation | WordPress multilingual holiday rental site | `/projects/bookease`, `/projects/promenade-medulin`, `/projects/erpnext-manufacturing`, `/projects/ai-agent-team` |

Rules for using keywords:

- Write for people first; use each primary term naturally once or twice per page. No keyword lists in visible text and no hidden text.
- Use the same name and role wording everywhere ("Mohammad Hamza", "Senior Frontend Engineer"); the alias "Er. Hamza" appears only in JSON-LD `alternateName` **[ASSUMPTION: the old logo used "Er. HAMZA"; confirm the owner wants it]**.
- Do not claim services the data does not support (for example, no "Shopify Plus" claim even though checkout extensions often require it).

### 9.2 URL, heading, title and alt rules

- URLs: lowercase, hyphenated, ASCII, no trailing slash, no dates, no file extensions: `/projects/<slug>`. Slugs are stable once published; if one must change, add a redirect in `vercel.json`.
- One H1 per page. On `/` the H1 is the name and role; on project pages the H1 is the project title; on `/projects` it is "Project archive".
- Level H2s carry descriptive keywords; game names live in eyebrows.
- Title tag: ≤ 60 characters where possible, pattern `<Page subject> | Mohammad Hamza`; home is the exception (9.3).
- Meta description: 140 to 160 characters, a complete sentence, no keyword stuffing.
- Alt text: describe what the screenshot shows and what it is, in one sentence under 125 characters, for example "Lammle’s checkout page showing custom delivery and pickup options". Decorative images get `alt=""`.
- Internal links use descriptive anchor text (project titles), never "click here".

### 9.3 Per-route meta

`SITE_URL` comes from `src/seo/site.ts`: `import.meta.env.VITE_SITE_URL ?? 'https://erhamza.dev'`. The default is the only domain found in the repository (`SOCIAL_LINKS.portfolio` in `constants.tsx`) and is **[ASSUMPTION: confirm this is the production domain]**.

| Route | Title | Meta description | Canonical | Robots | OG type and image |
|---|---|---|---|---|---|
| `/` | Mohammad Hamza · Senior Frontend Developer (React, Next.js) | Senior frontend engineer with 6+ years building React and Next.js apps, Shopify storefronts, Web3 dashboards and Three.js experiences. Remote. | `/` | index, follow | `profile`; `/og/default.png` |
| `/projects` | Project archive: React, Shopify, Web3 and 3D work \| Mohammad Hamza | Eighteen projects by Mohammad Hamza: Shopify checkouts and storefronts, Web3 dashboards and wallets, Three.js sites, Next.js products and WordPress builds. | `/projects` | index, follow | `website`; `/og/projects.png` |
| `/projects/<slug>` | from `project.seo.title` (Appendix D) | from `project.seo.description` (Appendix D) | `/projects/<slug>` | index, follow | `article`; `/og/projects/<slug>.png` |
| `/arcade` | Arcade: Reel Pong \| Mohammad Hamza | Play Reel Pong, a small paper-and-cobalt Pong game built for this portfolio. First to five wins; touch, mouse and keyboard supported. | `/arcade` | index, follow | `website`; `/og/arcade.png` |
| `/interview-framework` | Frontend interview questions: JavaScript, React, Next.js \| Mohammad Hamza | A searchable set of frontend interview questions and short answers on JavaScript, TypeScript, React, Next.js, Angular and Shopify. | `/interview-framework` | index, follow | `website`; `/og/interview.png` |
| `404` | Lost reel \| Mohammad Hamza | (none) | (none) | noindex | (none) |

Every indexable route also gets: `og:title`, `og:description`, `og:url`, `og:image` (absolute), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, `og:site_name` "Mohammad Hamza", `twitter:card` `summary_large_image`, and `<link rel="canonical">` with the absolute URL. `hreflang` is not needed (single language, `lang="en"`).

### 9.4 Semantic HTML checklist

- Landmarks: `<header>` (top bar), `<nav aria-label="Levels">` (ruler), `<nav aria-label="Main">` (menu), `<main id="content">`, `<footer>`.
- Each level is a `<section>` with `aria-labelledby` its H2. Projects in the index are `<article>`s inside lists only on the full `/projects` page; elsewhere `<li>`.
- Dates use `<time datetime>`. Quick facts use `<dl>`. Stack chips are `<ul>`.
- Links navigate; buttons act. No click handlers on non-interactive elements.
- No text in images (OG images are not part of the page).

### 9.5 JSON-LD

Built by `src/seo/jsonld.ts` from the same content files as the visible page, and injected by the prerender script as one `<script type="application/ld+json">` per page using `@graph`. IDs are stable URLs.

Home (`/`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://erhamza.dev/#person",
      "name": "Mohammad Hamza",
      "alternateName": "Er. Hamza",
      "url": "https://erhamza.dev/",
      "image": "https://erhamza.dev/og/default.png",
      "jobTitle": "Senior Frontend Engineer",
      "description": "Frontend engineer with 6+ years of experience building e-commerce platforms, Web3 applications and interactive 3D web experiences.",
      "email": "mailto:erhamza.dev@gmail.com",
      "address": { "@type": "PostalAddress", "addressLocality": "Kanpur", "addressRegion": "Uttar Pradesh", "addressCountry": "IN" },
      "alumniOf": { "@type": "CollegeOrUniversity", "name": "CSJM University, Kanpur" },
      "award": "Promising Newcomer, ITH Technologies",
      "knowsAbout": ["React", "Next.js", "TypeScript", "Three.js", "WebGL", "GLSL", "GSAP", "Shopify", "Shopify Functions", "Shopify Checkout Extensions", "Liquid", "Web3", "Solana", "Ethers.js", "Wagmi", "Angular", "Node.js", "PostgreSQL", "Playwright", "WordPress"],
      "sameAs": [
        "https://www.linkedin.com/in/er-mohammad-hamza/",
        "https://github.com/hamzam999"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://erhamza.dev/#website",
      "url": "https://erhamza.dev/",
      "name": "Mohammad Hamza",
      "inLanguage": "en",
      "publisher": { "@id": "https://erhamza.dev/#person" }
    },
    {
      "@type": "ProfilePage",
      "@id": "https://erhamza.dev/#profile",
      "url": "https://erhamza.dev/",
      "name": "Mohammad Hamza · Senior Frontend Developer",
      "isPartOf": { "@id": "https://erhamza.dev/#website" },
      "mainEntity": { "@id": "https://erhamza.dev/#person" },
      "dateModified": "<computed: max(updated) of content>"
    }
  ]
}
```

`address`, `alternateName` and `award` are emitted only if the owner confirms them (Section 12); the builder takes them from `profile.ts`, where unconfirmed values are `null` and are skipped.

Project page (`/projects/navig`), CreativeWork with breadcrumbs:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CreativeWork",
      "@id": "https://erhamza.dev/projects/navig#work",
      "name": "NAVIG",
      "url": "https://erhamza.dev/projects/navig",
      "description": "A visually rich website for a crypto and AI intelligence product, where a 3D scene of 25,000+ particles reshapes into ocean waves, waterfalls and data streams as you scroll.",
      "genre": "3D and interactive website",
      "keywords": "React, Three.js, GLSL, GSAP, WebGL",
      "creator": { "@id": "https://erhamza.dev/#person" },
      "image": "https://erhamza.dev/projects/navig/hero-1280.webp",
      "sameAs": "https://navig-app.vercel.app/",
      "isPartOf": { "@id": "https://erhamza.dev/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://erhamza.dev/" },
        { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://erhamza.dev/projects" },
        { "@type": "ListItem", "position": 3, "name": "NAVIG", "item": "https://erhamza.dev/projects/navig" }
      ]
    },
    { "@type": "Person", "@id": "https://erhamza.dev/#person", "name": "Mohammad Hamza", "url": "https://erhamza.dev/" }
  ]
}
```

Type per project: `SoftwareApplication` (with `applicationCategory` and `operatingSystem`) for `codeslytic-budget` (FinanceApplication, Web), `bookease` (BusinessApplication, WordPress plugin), `gesim` (UtilitiesApplication, iOS and Android, pending owner confirmation of the stack); `CreativeWork` for all others. No `offers` or `aggregateRating` are invented, which means Google will not show software rich results; the markup is for entity understanding only. Private and shut-down projects omit `sameAs` and `url` to external sites. `image` is emitted only when the hero image exists. `dateCreated` is emitted only for confirmed years.

`/projects` gets `CollectionPage` with `hasPart` listing the 18 `CreativeWork` IDs, plus a two-item breadcrumb.

Validation: a Vitest test parses every prerendered JSON-LD block and checks required fields and `@id` references; at gate G5 the reviewer also runs the Schema.org validator on `/` and two project pages.

### 9.6 Prerendering (specification)

**Approach: React's built-in server renderer at build time (`renderToString` with React Router's `StaticRouter`), driven by a small Node script.** This is the pattern from Vite's SSR guide. Alternatives were considered and rejected: `react-snap` (unmaintained, Puppeteer-based, brittle), `vite-plugin-ssr`/Vike (a framework migration), `vite-react-ssg` (workable, but adds an opinionated routing layer on top of React Router 7 for little gain at 24 routes).

Files:

- `src/entry-server.tsx`:

  ```tsx
  import { renderToString } from 'react-dom/server';
  import { StaticRouter } from 'react-router';
  import { App } from './App';
  export function render(url: string) {
    return renderToString(<StaticRouter location={url}><App /></StaticRouter>);
  }
  export { getRouteMeta, getAllRoutes } from './seo/meta';
  ```

  Lazy routes (`Arcade`, `InterviewFramework`) must render their page content on the server: export them both as lazy (client) and eager (server) through a small `routes.tsx` that picks `import.meta.env.SSR ? Eager : lazy(...)`. The Pong canvas and the shelf are client-only by design and render their fallbacks.

- `src/main.tsx`: `hydrateRoot(document.getElementById('root')!, <BrowserRouter><App /></BrowserRouter>)`; before that, an inline script in `index.html` sets `document.documentElement.classList.add('js')` and reads the motion setting from storage (inside `try/catch`) to add `reduced` early and avoid a flash of hidden reveal states.

- `scripts/prerender.mjs`:
  1. Read `dist/index.html` (template) and `dist/.vite/manifest.json`.
  2. Import `dist-ssr/entry-server.js`; get the route list from `getAllRoutes()` (`/`, `/projects`, 18 project routes, `/arcade`, `/interview-framework`, `/404`).
  3. For each route: `html = render(url)`; `meta = getRouteMeta(url)`; replace `<!--app-head-->` with title, description, canonical, robots, OG/Twitter tags, JSON-LD and font preloads; replace `<!--app-html-->` with `html`; write to `dist/<route>/index.html` (`dist/index.html` for `/`, `dist/404.html` for 404).
  4. Fail the build if any route renders an empty `<main>`, lacks exactly one `<h1>`, or produces a title longer than 70 characters.
- `package.json` scripts:

  ```json
  {
    "build:client": "vite build",
    "build:server": "vite build --ssr src/entry-server.tsx --outDir dist-ssr",
    "build": "npm run media -- --allow-missing && npm run build:client && npm run build:server && node scripts/prerender.mjs && node scripts/gen-seo-files.mjs && node scripts/gen-og.mjs && node scripts/check-budgets.mjs"
  }
  ```

- Hydration safety rules (enforced in review): no `window`, `document`, `localStorage`, `matchMedia` or `Date.now()`-dependent output during render; random values seeded from props; time-dependent text (copyright year) computed at build time.

How the shelf and project URLs coexist: the prerendered `/projects/<slug>` is a full standalone page with real content. On the home page the shelf's tapes are `<a href="/projects/<slug>">`, so crawlers find all project URLs in `/`'s HTML even without the shelf running; JavaScript upgrades a click into the modal sheet at the same URL (4.4).

### 9.7 Generated SEO files (`scripts/gen-seo-files.mjs`)

Generated from the content files after prerendering, written to `dist/`.

**`robots.txt`:**

```
User-agent: *
Allow: /

Sitemap: https://erhamza.dev/sitemap.xml
```

AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are allowed by default because GEO is a goal. If the owner wants to opt out of model training while keeping search, add explicit `Disallow: /` blocks for the training crawlers only (Section 12).

**`sitemap.xml`** (image extension namespace; `changefreq` and `priority` omitted because Google ignores them):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://erhamza.dev/</loc>
    <lastmod>2026-12-01</lastmod>
  </url>
  <url>
    <loc>https://erhamza.dev/projects</loc>
    <lastmod>2026-12-01</lastmod>
  </url>
  <url>
    <loc>https://erhamza.dev/projects/navig</loc>
    <lastmod>2026-12-01</lastmod>
    <image:image><image:loc>https://erhamza.dev/projects/navig/hero-1920.webp</image:loc></image:image>
  </url>
  <!-- one <url> per project; <image:image> only when the hero exists -->
  <url>
    <loc>https://erhamza.dev/arcade</loc>
    <lastmod>2026-12-01</lastmod>
  </url>
  <url>
    <loc>https://erhamza.dev/interview-framework</loc>
    <lastmod>2026-12-01</lastmod>
  </url>
</urlset>
```

`lastmod` strategy: each project has an `updated` ISO date in `projects.ts`, bumped by hand when its content or screenshot changes (the media script prints a reminder when a source hash changes). `/projects` and `/` use the latest `updated` across all content files (`profile.ts`, `experience.ts`, `skills.ts`, `projects.ts` each export `updated`). `/arcade` and `/interview-framework` have their own constants. Never set `lastmod` to the build time for every URL: search engines learn to ignore inaccurate dates.

**`llms.txt`** (spec: llmstxt.org; an H1, a blockquote summary, optional prose, then H2 sections of link lists). Full draft:

```markdown
# Mohammad Hamza

> Mohammad Hamza is a Senior Frontend Engineer with 6+ years of experience building e-commerce platforms, Web3 applications and interactive 3D web experiences. He works with React, Next.js, TypeScript, Shopify (Online Store 2.0, Functions, Checkout Extensions), Solana and EVM wallets, and Three.js with GLSL. He works remotely.

This site is his portfolio. Every project below has its own page with a plain-language summary, his role, the tech stack and links. Results quoted on project pages are as stated by the owner. Private client work is described without naming the client or linking to it.

## About

- [Profile and quick facts](https://erhamza.dev/#level-origin): role, experience since 2020, education (Bachelor of Computer Science, CSJM University, Kanpur, 2020), recognition ("Promising Newcomer" at ITH Technologies)
- [Career path](https://erhamza.dev/#level-career): Freelance frontend developer (2026–present); Frontend and Web3 Engineer at ITH Technologies (2023–2025); Shopify Developer at House of THL (2022–2023); Shopify and WordPress developer and founder of a D2C store (2020–2022)
- [Skills with evidence](https://erhamza.dev/#level-skills): each skill links to the projects where it was used
- [Contact](https://erhamza.dev/#level-contact): email erhamza.dev@gmail.com, LinkedIn, GitHub, resume

## Projects: 3D and interactive

- [NAVIG](https://erhamza.dev/projects/navig): website for a crypto and AI intelligence product; a scroll-driven 3D scene of 25,000+ particles that reshapes into waves, waterfalls and data streams (React, Three.js, GLSL, GSAP)
- [SkyAI 3D robot landing page](https://erhamza.dev/projects/skyai-3d-robot): four-section landing page where a 3D robot turns and moves as you scroll; desktop only (React, React Three Fiber, GSAP ScrollTrigger, Tailwind CSS 4, Zustand)
- [MotionGrid showcase](https://erhamza.dev/projects/motiongrid): one-page showcase of 12 projects that a design agency attaches to client proposals (React, CSS animation)
- [Studio Solyn](https://erhamza.dev/projects/studio-solyn): website for a product design studio working in furniture, lighting and objects (Framer, React, Pointer Events API)

## Projects: e-commerce and Shopify

- [Lammle’s checkout customization](https://erhamza.dev/projects/lammles): checkout changes for a Shopify store that validate customer details before payment and adjust which delivery and payment options appear (Shopify Checkout Extensions, Shopify Functions)
- [Nighat Ahmad Official](https://erhamza.dev/projects/nighat-ahmad-official): fast, mobile-first online store for a fashion brand selling in India and abroad (Shopify Online Store 2.0, Dawn, Liquid, Meta Pixel)
- [HE Fashion](https://erhamza.dev/projects/hefashion): custom design and features for a multi-brand fashion store, including customer reviews and product popularity notices (Shopify, Liquid, GraphQL)
- [Berbanto: Atelier theme customization](https://erhamza.dev/projects/berbanto-atelier): eleven new store features, such as category carousels, popups and a tilted scrolling banner, all editable in Shopify's visual editor (Shopify Atelier theme, Liquid)

## Projects: Web3

- [GeSIM](https://erhamza.dev/projects/gesim): app offering global eSIM mobile data across 190+ countries with privacy tools such as a built-in VPN, virtual numbers and spending cards (React, React Native, wallet SDKs)
- [DEX/CEX trading dashboards and multi-signature wallet](https://erhamza.dev/projects/dex-cex-multisig-wallet): live trading screens for crypto exchanges, and a multi-signature wallet that needs approvals from a minimum number of owners before any transaction (React, Next.js, Ethers.js, Wagmi, Web3.js, Solana RPC, Raydium SDK); private
- [NFT marketplace](https://erhamza.dev/projects/nft-marketplace): marketplace on Base, Sui and Solana with pre-mint listings, auctions, fixed-price sales, a creator dashboard and sponsored minting fees; the project has since shut down

## Projects: full-stack and product

- [CodesLytic Budget](https://erhamza.dev/projects/codeslytic-budget): offline-first budgeting app with multi-currency tracking, recurring bills and shared expenses with UPI settle-up; 1,500+ automated checks and 160+ end-to-end tests (Next.js, Node.js, PostgreSQL, IndexedDB, Playwright, Docker)
- [Unified CRM for trading platforms](https://erhamza.dev/projects/unified-trading-crm): several Angular trading tools merged into one Next.js customer management system with per-account access; pages load about 35% faster; private
- [ERPNext for manufacturing](https://erhamza.dev/projects/erpnext-manufacturing): custom ERPNext app replacing a factory's manual production tracking, from bills of materials and work orders to weekly labour payment vouchers (ERPNext/Frappe, Next.js); private
- [Muftimaaz.com](https://erhamza.dev/projects/muftimaaz): website for an Islamic scholar with YouTube channel integration, API caching and audio streaming (Next.js, YouTube Data API, Cloudflare R2)

## Projects: AI and automation

- [AI agent team](https://erhamza.dev/projects/ai-agent-team): a team of AI assistants for marketing chores (lead finding, social post drafts, job scouting) run from a control panel with human approval of every output; in testing; private

## Projects: WordPress

- [Promenade Medulin](https://erhamza.dev/projects/promenade-medulin): five-language website for a holiday property in Medulin, Croatia (WordPress, PHP, custom plugin, custom post types)
- [BookEase](https://erhamza.dev/projects/bookease): WordPress booking plugin for hotels, restaurants and clinics with free-slot selection, confirmation emails, self-service cancel and reschedule, and CSV export (PHP 8, WordPress REST API)

## Optional

- [Full project archive](https://erhamza.dev/projects)
- [Full text for language models](https://erhamza.dev/llms-full.txt)
- [Frontend interview questions](https://erhamza.dev/interview-framework)
- [Arcade](https://erhamza.dev/arcade)
- [GitHub](https://github.com/hamzam999)
- [LinkedIn](https://www.linkedin.com/in/er-mohammad-hamza/)
```

The generator builds this file from `projects.ts` (category order, `seo.llmsSummary` per project) and `profile.ts`, so it never drifts from the site. Wording for projects with open questions (GeSIM stack, HE Fashion naming, Promenade stack, Studio Solyn role) updates automatically when the content file is corrected.

**`llms-full.txt`** (outline; generated): plain Markdown, no navigation chrome.

1. H1 name, the same blockquote summary.
2. "Quick facts" as a list (from the L2 `<dl>` source).
3. "Career" with every experience entry and all its detail bullets.
4. "Skills" by branch with evidence project names.
5. "Projects": for each of the 18, an H2 with the title, then: category, status (live, repository, private, shut down), year (or "not stated"), role, stack, synopsis (full), owner-stated results (each prefixed "Owner-reported:"), link.
6. "Contact".
7. A footer line: "Generated from the site's content files on <date>."

Also generated: a Markdown twin of each project page at `/projects/<slug>.md` (same content as its section in `llms-full.txt`), as the llms.txt proposal suggests; linked from the page with `<link rel="alternate" type="text/markdown">`.

### 9.8 Hosting assumptions, caching and status codes

**[ASSUMPTION]** The site is deployed on Vercel as a static build (the `.gitignore` already lists `.vercel`). If another static host is used, mirror these rules.

`vercel.json`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/fonts/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/projects/(.*)\\.(avif|webp)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800" }] },
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ] }
  ]
}
```

No SPA catch-all rewrite: unknown paths must return `404.html` with status 404 (no soft 404s). All valid routes exist as prerendered files.

### 9.9 Open Graph images (`scripts/gen-og.mjs`)

- Tooling: `satori` (JSX to SVG) and `@resvg/resvg-js` (SVG to PNG), using Inter Tight and Newsreader `.woff` files from Fontsource (satori does not read WOFF2) and the kanji SVG paths.
- Site default `public/og/default.png` (1200 × 630): paper background with grain, "Mohammad Hamza" in Inter Tight 600 cobalt at 96 px, "Senior Frontend Engineer" below, focus line "React · Next.js · Three.js · Shopify · Web3", the halftone 作品 on the right, and a ruler strip along the bottom.
- Per project `public/og/projects/<slug>.png`: left half is the hero screenshot cropped 600 × 630 (or the fallback poster), right half on paper: eyebrow (category), title, one-line summary, "Mohammad Hamza" credit.
- `projects.png`, `arcade.png`, `interview.png` with the same template.
- Each PNG under 300 KB (quantize with `sharp().png({ palette: true })` if larger).

### 9.10 Performance and Core Web Vitals budget

| Metric | Budget | Notes |
|---|---|---|
| LCP (mobile lab) | ≤ 2.0 s | LCP element is the hero H1 text, painted with the preloaded Inter Tight 600 or its metric-matched fallback |
| CLS | ≤ 0.05 | Fixed-size HUD, reserved shelf box, fontaine fallbacks, explicit image dimensions |
| INP | ≤ 150 ms | No React renders per frame; heavy work deferred with `startTransition` or the next frame |
| TBT (lab) | ≤ 150 ms | |
| Initial JS (`/`) | ≤ 110 KB gzip | React, React DOM, router, zustand, app shell, levels |
| Shelf chunk | ≤ 18 KB gzip | |
| Arcade chunk | ≤ 14 KB gzip | |
| CSS | ≤ 22 KB gzip | |
| Fonts on first view | ≤ 5 files, ≤ 150 KB | Inter Tight 500/600, Newsreader 400/400i, JP subset (only if a JP label renders) |
| Images above the fold on `/` | none required | Hero is text; covers load lazily |
| Total transfer for `/` first view | ≤ 450 KB | Excluding lazy images |

Image strategy: AVIF first, WebP fallback, through `<picture>` with `srcset` and `sizes`; explicit `width`/`height`; `loading="lazy"` below the fold; `fetchpriority="high"` only on a project page's hero image (the LCP candidate there); no JPEG/PNG served to browsers except OG images.

If the LCP budget is missed because of the render-blocking stylesheet, inline critical CSS with `beasties` (the maintained successor of `critters`) in the prerender step; do not add it pre-emptively.

---

## 10. Phased execution roadmap

### 10.0 How agents work on this plan

**Model split.** Opus plans and reviews; Sonnet implements.

- **Opus** owns this plan, answers ambiguity questions raised by developer agents, and runs every review gate (G0 to G6). At each gate Opus reads the diff, runs the verification commands, looks at the Playwright screenshots for all five viewports, and either approves or returns a numbered list of required fixes. Opus also runs `/code-review` (level `high`) on the phase diff at every gate.
- **Sonnet** developer agents each take one task ID at a time from the tables below. A task is small (roughly one to four files), has a definition of done, and must pass its verification commands before the agent reports back. An agent that finds the plan ambiguous stops and asks instead of guessing.
- **Owner** answers the open questions in Section 12 and runs `/review-animations` at gate G3 (that skill cannot be invoked by a model).

**Rules for every task.**

1. Read the plan sections the task cites, plus Appendix A and B.
2. Invoke the skills listed for the task before writing code (via the Skill tool), and follow them where they do not contradict this plan. If a skill contradicts the plan, follow the plan and mention the conflict in the report.
3. Touch only the files listed (plus tests for them). If another file must change, say so in the report.
4. Never edit `src/content/*` facts (years, roles, claims) except as the task says; placeholders stay placeholders.
5. Keep every component SSR-safe (4.5, 9.6).
6. Report: files changed, commands run with results, screenshots taken (paths under `test-results/`), open issues.
7. Do not commit unless the coordinating session asks; when committing, one commit per task, message starting with the task ID.

**Standard verification commands** (defined in `P0-1`):

| Command | What it runs |
|---|---|
| `npm run typecheck` | `tsc --noEmit -p tsconfig.json` |
| `npm run test` | `vitest run` (unit tests) |
| `npm run build` | media (allow missing), client build, SSR build, prerender, SEO files, OG images, budget check |
| `npm run build:e2e` | same build with `--mode e2e` (enables test hooks, 11.2) |
| `npm run test:e2e` | `playwright test` against `vite preview` of the e2e build |
| `npm run test:e2e -- --grep @visual` | visual snapshots only |
| `npm run test:e2e -- --grep @a11y` | axe checks only |
| `npm run shots` | `playwright test tests/e2e/shots.spec.ts`: full-page screenshots of every route at 360, 390, 768, 1024, 1440 into `test-results/shots/` for review (no assertions) |
| `npm run lhci` | `lhci autorun` on the production build |
| `npm run budgets` | `node scripts/check-budgets.mjs` |

Parallelism notation: tasks with the same **Group** letter in a phase can run in parallel agents; groups run in alphabetical order; tasks marked **Seq** run alone in the order shown.

### Phase 0: Housekeeping

Goal: a clean, strict, Tailwind-v4 Vite app under `src/` that still serves the current interview page, with content migrated to typed files and test tooling in place. No visual redesign yet.

| ID | Task | Files touched | Group |
|---|---|---|---|
| P0-1 | Install and remove dependencies (2.2); add scripts (10.0); copy the reference file to `docs/reference/directions.html`; add `.gitignore` entries for `dist-ssr/`, `test-results/` and `playwright-report/` (keep `media-src/fonts/*.ttf` tracked, because the font scripts need it) | `package.json`, `package-lock.json`, `.gitignore`, `docs/reference/directions.html` | Seq |
| P0-2 | Move sources under `src/` (`App.tsx`, `index.tsx` to `main.tsx`, `pages/`, `components/`, `interviewData.ts`, `constants.tsx`, `types.ts`); update the `@` alias in `vite.config.ts` and `tsconfig.json`; remove the Gemini `define`; clean `index.html` (remove CDN script, importmap, Google Fonts, decorative divs; add `viewport-fit=cover`, `theme-color #ECE8E0`, `<!--app-head-->` and `<!--app-html-->` markers) | listed files | Seq |
| P0-3 | Install Tailwind v4 via `@tailwindcss/vite`; create `src/styles/app.css` with `@import "tailwindcss"` and the temporary legacy `@theme` mappings (3.6) so the interview page renders; delete `index.css` after porting the few rules the interview page uses | `vite.config.ts`, `src/styles/app.css`, `src/main.tsx` | A |
| P0-4 | Delete dead code listed in 2.1; move old screenshots per 2.3; replace `design-system/hamza-portfolio-revamp/MASTER.md` content with a pointer to this plan; delete `metadata.json` | deletions, `media-src/` | A |
| P0-5 | Create `src/types/content.ts` (Appendix B) and content files: `projects.ts` (all 18, Appendix D, with placeholders), `profile.ts`, `experience.ts` (ISO dates), `skills.ts`, `levels.ts`, `jp.ts`; remove `PROJECTS` and other moved constants from the old file and delete it once nothing imports it | `src/types/content.ts`, `src/content/*` | A |
| P0-6 | Enable `"strict": true`, `"noUncheckedIndexedAccess": true`; fix resulting type errors in moved interview files; add `vitest.config.ts`, `playwright.config.ts` (projects in 11.1) and one smoke test per runner; rewrite `README.md` (setup, scripts, media workflow, link to this plan) | `tsconfig.json`, configs, `tests/`, `README.md`, interview files | B |

Skills: **typescript-advanced-types** (P0-5), **tailwind-design-system** (P0-3), **playwright-best-practices** (P0-6), **vercel-react-best-practices** (P0-1 dependency choices).

Definition of done: `npm run typecheck`, `npm run test`, `vite build` all pass; `/interview-framework` renders in `npm run dev` with readable styling; no file imports a deleted module; `git grep -n "cdn.tailwindcss\|esm.sh\|GEMINI"` returns nothing.

Verification: `npm ci && npm run typecheck && npm run test && npx vite build && npx playwright test tests/e2e/smoke.spec.ts`.

**Gate G0 (Opus):** directory structure matches 4.1; content files match the CSV exactly (spot-check five projects against the CSV); placeholders are present where Appendix D says TBC; dependency list matches 2.2.

### Phase 1: Tokens, fonts, shell, prerender skeleton

Goal: the empty Archive Quest world: tokens, fonts, grain, top bar, ruler, passport, store, cursor, footer, routes with empty level shells, and a working prerender of every route.

| ID | Task | Files touched | Group |
|---|---|---|---|
| P1-1 | Tokens and base styles: Appendix A into `tokens.css`; Tailwind `@theme inline` mapping; `base.css` (reset, body background, selection color, focus ring, `scroll-padding`, `scrollbar-gutter`, `forced-colors` and print rules, `.sr-only`) | `src/styles/tokens.css`, `base.css`, `app.css` | A |
| P1-2 | Fonts: Fontsource imports, fontaine fallbacks, `scripts/subset-jp-fonts.mjs` and output, `scripts/kanji-paths.mjs` and `src/content/kanji-paths.ts`, `scripts/build-grain.mjs` and `public/textures/grain.webp` | `src/styles/fonts.css`, scripts, generated files, `vite.config.ts` | A |
| P1-3 | Prerender skeleton: `src/entry-server.tsx`, `src/seo/meta.ts` (route list and minimal titles), `scripts/prerender.mjs`, `hydrateRoot` in `main.tsx`, inline `js`/`reduced` class script in `index.html`; build writes one HTML file per route | listed | A |
| P1-4 | Game store: `src/game/storage.ts`, `rules.ts`, `store.ts` with unit tests for caps, derived XP, storage failure, version reset, multi-tab sync | `src/game/*` | A |
| P1-5 | UI primitives: `Button`, `MaskLine`, `HalftoneKanji`, `Grain`, `Stamp`, `Toast`, `SkipLink`, `lib/motion.ts` (`useReducedMotion` combining media query and setting), `lib/useInView.ts` | `src/components/ui/*`, `src/lib/*` | B (after A) |
| P1-6 | HUD: `TopBar`, `Ruler` (level mode only), `XPCounter`, `LevelLabel`, `Passport` dialog, menu dialog, settings toggles; `useLevelTracker`; `lib/scroll.ts` | `src/components/hud/*`, `src/game/useLevelTracker.ts`, `src/lib/scroll.ts` | B |
| P1-7 | `Cursor` | `src/components/ui/Cursor.tsx` | B |
| P1-8 | Routes and shells: `App.tsx` with modal-route structure (4.4), `Home.tsx` with six `LevelShell`s holding only eyebrow, H2 and placeholder paragraph, `ProjectsIndex`, `ProjectPage` (title only), `Arcade` (title only), `NotFound`, `Footer` | `src/App.tsx`, `src/routes/*`, `src/components/hud/Footer.tsx`, `src/components/ui/LevelShell.tsx` | C (after B) |

Skills: **better-colors** and **tailwind-design-system** (P1-1), **better-typography** (P1-1, P1-2), **better-ui** and **emil-design-eng** (P1-5, P1-7), **better-accessibility** (P1-6, P1-8), **vercel-react-best-practices** (P1-3, P1-4), **typescript-advanced-types** (P1-4).

Definition of done: `npm run build` produces `dist/index.html`, `dist/projects/index.html`, 18 `dist/projects/<slug>/index.html`, `dist/arcade/index.html`, `dist/interview-framework/index.html`, `dist/404.html`, each with exactly one H1 in the static HTML; ruler jumps work and move focus; passport opens, traps focus and closes on Escape; XP survives reload and the app works when `localStorage` throws; no hydration warnings in the console; no horizontal scroll at any viewport.

Verification: `npm run typecheck && npm run test && npm run build && npm run build:e2e && npm run test:e2e -- --grep "@shell|@a11y" && npm run shots`.

**Gate G1 (Opus):** design review of `test-results/shots/` at all five widths using **taste-skill** (look-and-fix loop) and **impeccable** (critique mode); contrast spot checks with **better-colors**; keyboard walk-through; `/code-review high`. No level content is judged yet, only the frame.

### Phase 2: Level builds

Goal: all six levels with real content and animations, plus project pages, archive page, interview restyle, 404. The shelf area shows the static grid fallback in this phase.

| ID | Task | Files touched | Group |
|---|---|---|---|
| P2-1 | Level 1 Spawn (5.1) | `src/levels/L1Spawn.tsx`, `src/styles/levels.css` (section block for L1) | A |
| P2-2 | Level 2 Origin (5.2) | `src/levels/L2Origin.tsx`, levels.css L2 block | A |
| P2-3 | Level 3 Skill Tree (5.3) | `src/levels/L3SkillTree.tsx`, levels.css L3 block | A |
| P2-4 | Level 4 frame: section, intro, static tape grid fallback (6.9), `ArchiveIndex` compact (6.10), `PosterFallback` (6.11) | `src/levels/L4Archive.tsx`, `src/components/projects/ArchiveIndex.tsx`, `PosterFallback.tsx`, levels.css L4 block | A |
| P2-5 | Level 5 Career Path including ruler career mode (5.5) | `src/levels/L5CareerPath.tsx`, `src/components/hud/Ruler.tsx` (career mode only), levels.css L5 block | A |
| P2-6 | Level 6 Final Boss with red door (5.6) | `src/levels/L6FinalBoss.tsx`, levels.css L6 block | A |
| P2-7 | Interview page restyle (5.10); remove legacy Tailwind mappings | `src/routes/InterviewFramework.tsx`, `src/components/interview/*`, `src/styles/app.css` | A |
| P2-8 | `ProjectDetail` component, `/projects/:slug` standalone page, `/projects` full archive, 404 content | `src/components/projects/ProjectDetail.tsx`, `src/routes/ProjectPage.tsx`, `ProjectsIndex.tsx`, `NotFound.tsx` | A |
| P2-9 | Integration: compose `Home.tsx`, wire all XP events (7.2) and level clears, toasts, arcade unlock label, end-to-end level spec | `src/routes/Home.tsx`, `src/game/*` (wiring only), `tests/e2e/levels.spec.ts`, `game.spec.ts` | Seq (after A) |

To avoid merge conflicts in `levels.css`, each level task writes its own file `src/styles/levels/l<n>.css` imported by `app.css`; `P2-9` owns `app.css` imports.

Skills: **taste-skill** and **better-layout** (all level tasks), **better-typography** (P2-1, P2-2, P2-8), **emil-design-eng** (animations in P2-1, P2-5, P2-6), **better-accessibility** (all), **impeccable** (P2-7 restyle).

Definition of done per level task: matches its acceptance criteria in Section 5; `npm run shots` images for that level reviewed by the agent itself against the taste-skill checklist; axe clean; reduced-motion run shows final states; JS-disabled run shows all text.

Verification: `npm run typecheck && npm run test && npm run build:e2e && npm run test:e2e -- --grep "@levels|@a11y|@nojs" && npm run shots`.

**Gate G2 (Opus):** full visual review at five widths and in reduced motion; copy check against Section 5 and the CSV (no invented facts, all **[COPY: approve]** strings listed for the owner); `/code-review high`; first visual baselines approved and committed (`--update-snapshots` only after approval).

### Phase 3: The shelf

Goal: the production VHS shelf and detail sheet, plus the media pipeline.

| ID | Task | Files touched | Group |
|---|---|---|---|
| P3-1 | Media pipeline (6.11): `scripts/build-project-media.mjs`, manifest, duotone, missing-source report; run it on the five interim screenshots | `scripts/build-project-media.mjs`, `src/content/media-manifest.json`, `public/projects/*` | A |
| P3-2 | Geometry module (6.2): pure functions, lookup table, H formula, unit tests (monotonic X, k relationship, visibility threshold, expected H table) | `src/components/shelf/geometry.ts`, `geometry.test.ts` | A |
| P3-3 | Spring and wrap engine (6.3): `createShelfEngine({ N, onFrame })` with `setTarget`, `nudge`, `startDrag`, `drag`, `endDrag`, `shortestTo`, sleep and wake; unit tests with a fake clock | `src/components/shelf/spring.ts`, `spring.test.ts` | A |
| P3-4 | Shelf DOM: `Shelf.tsx`, `Tape.tsx` (spine and cover faces with media or fallback), pool with three copies, style writes from engine frames, lazy mount into the reserved box, `shelf.css` | `src/components/shelf/Shelf.tsx`, `Tape.tsx`, `src/styles/shelf.css`, `src/levels/L4Archive.tsx` (mount point only) | B (after A) |
| P3-5 | Input (6.5): pointer drag with axis lock, wheel rules, keys, arrow buttons, scrubber, tilt, click versus drag | `src/components/shelf/useShelfInput.ts`, `Shelf.tsx` | C |
| P3-6 | Caption and accessibility (6.7): caption mask swap (650 ms), roving tabindex, live region rules, labels | `src/components/shelf/Caption.tsx`, `Shelf.tsx` | C |
| P3-7 | Detail sheet (6.8): modal route, `<dialog>`, clip-path from origin rect, text rise, `InkMask`, close animation, scroll lock, focus return | `src/components/shelf/DetailSheet.tsx`, `InkMask.tsx`, `src/styles/sheet.css`, `src/App.tsx` (modal route only) | C |
| P3-8 | Fallback modes (6.9): reduced-motion grid default, "Show as shelf" toggle, error boundary | `src/levels/L4Archive.tsx`, `Shelf.tsx` | D |
| P3-9 | Performance pass (6.4): offscreen pause, `will-change` policy, image loading priorities, trace at 4x CPU throttle, virtualization path test with N = 14 fixture | shelf files, `tests/e2e/perf.spec.ts`, `tests/e2e/shelf.spec.ts` | Seq (after D) |

P3-5, P3-6 and P3-7 touch `Shelf.tsx`; to run them in parallel, `P3-4` must expose clear extension points (`Shelf` composes `useShelfInput`, `<Caption>` and an `onOpen(slug, rect)` callback). If an agent needs to change `Shelf.tsx` beyond its extension point, it coordinates through the reviewer.

Skills: **emil-design-eng** (P3-3 to P3-7), **better-ui** (P3-4 faces, shadows), **better-accessibility** (P3-6, P3-7, P3-8), **vercel-react-best-practices** (P3-4, P3-9), **playwright-best-practices** (P3-9), **typescript-advanced-types** (P3-3 engine API).

Definition of done: all acceptance criteria in 6.12; unit tests for geometry and engine pass; shelf chunk within budget.

Verification: `npm run typecheck && npm run test && npm run build:e2e && npm run test:e2e -- --grep "@shelf|@sheet|@perf|@a11y" && npm run budgets && npm run shots`.

**Gate G3 (Opus plus owner):** owner runs `/review-animations` on the shelf, caption and sheet; Opus reviews a Chrome performance trace of a 3-second drag at 4x throttle (no long tasks over 50 ms, frames at 60 fps) and the idle trace (no rAF); keyboard and VoiceOver walkthrough; `/code-review high`.

### Phase 4: Arcade

Can start after Gate G1, in parallel with Phases 2 and 3, because it touches only arcade files and the store's public API.

| ID | Task | Files touched | Group |
|---|---|---|---|
| P4-1 | Pong engine (8.2), pure, with unit tests for scoring, speed caps, CPU difficulty, accessible mode, orientation mapping | `src/components/arcade/pong-engine.ts`, `pong-engine.test.ts` | A |
| P4-2 | `ReelPong` canvas component (8.3): DPR, resize, orientation, drawing, banners | `src/components/arcade/ReelPong.tsx` | B |
| P4-3 | Controls and pause rules (8.4) | `ReelPong.tsx`, `src/components/arcade/useGameInput.ts` | B |
| P4-4 | Arcade page (8.1), game registry, placeholder slots, unlock banner, XP and stamp wiring | `src/routes/Arcade.tsx`, `src/components/arcade/games.ts` | C |
| P4-5 | Accessibility: scoreboard live region, accessible mode, labels; e2e spec | `ReelPong.tsx`, `tests/e2e/arcade.spec.ts` | D |

Skills: **emil-design-eng** (game feel), **better-accessibility** (P4-5), **vercel-react-best-practices** (P4-2, P4-4), **playwright-best-practices** (P4-5).

Definition of done: playable on touch and keyboard at all five widths; pauses on blur and when scrolled away; win grants XP once and lands the stamp; arcade chunk ≤ 14 KB gzip.

Verification: `npm run test && npm run build:e2e && npm run test:e2e -- --grep "@arcade|@a11y" && npm run budgets`.

**Gate G4 (Opus):** play a full game on a touch-emulated 390 px viewport and with keyboard only; `/code-review high`.

### Phase 5: SEO and GEO

| ID | Task | Files touched | Group |
|---|---|---|---|
| P5-1 | `src/seo/site.ts`, full `meta.ts` per 9.3 and Appendix D, client `Head.tsx`, prerender head injection, font preloads | `src/seo/*`, `scripts/prerender.mjs` | A |
| P5-2 | JSON-LD builders (9.5) and tests that parse prerendered output | `src/seo/jsonld.ts`, `jsonld.test.ts`, `scripts/prerender.mjs` | A |
| P5-3 | `scripts/gen-seo-files.mjs`: `robots.txt`, `sitemap.xml` with image entries and `lastmod` strategy, `llms.txt`, `llms-full.txt`, `/projects/<slug>.md` | script, `src/content/*` (`seo.llmsSummary` fields, `updated` exports) | B (after A) |
| P5-4 | `scripts/gen-og.mjs` and OG templates (9.9) | script, `scripts/og/*.tsx` | B |
| P5-5 | `vercel.json` (9.8); verify 404 status with `npx vercel dev` or the host's local emulator if available, otherwise document for the owner | `vercel.json` | B |
| P5-6 | Semantic and crawlability audit: landmarks, headings, link text, `alt` rules, JS-disabled spec, `seo.spec.ts` | components (small fixes only), `tests/e2e/seo.spec.ts` | Seq (after B) |

Skills: **vercel-react-best-practices** (P5-1), **nextjs-app-router-patterns** (reference for metadata shape only, P5-1), **better-accessibility** (P5-6), **playwright-best-practices** (P5-6).

Definition of done: every route's built HTML contains correct title, description, canonical, OG, Twitter and JSON-LD; `sitemap.xml` lists exactly the indexable routes; `llms.txt` matches the draft in 9.7 with any owner corrections; OG images exist and are under 300 KB.

Verification: `npm run build && npm run test && npm run test:e2e -- --grep "@seo|@nojs" && npx xmllint --noout dist/sitemap.xml` (if `xmllint` is available; otherwise the Vitest sitemap parser test).

**Gate G5 (Opus):** validate JSON-LD for `/`, `/projects/navig`, `/projects/lammles` in the Schema.org validator; read `llms.txt` and `llms-full.txt` end to end for accuracy against the CSV; `/code-review high`.

### Phase 6: QA and performance

| ID | Task | Files touched | Group |
|---|---|---|---|
| P6-1 | Complete Playwright suites (Section 11) and approve visual baselines | `tests/e2e/*` | A |
| P6-2 | Lighthouse CI config and budgets; fix regressions | `lighthouserc.json`, `scripts/check-budgets.mjs`, fixes | A |
| P6-3 | Real-device checklist (11.6) run by the owner or a human tester; file issues | issue list in `docs/QA_CHECKLIST.md` only if the owner asks for a file | A |
| P6-4 | Fix pass for all issues from P6-1 to P6-3 | as needed | Seq |
| P6-5 | Final cleanup: remove unused CSS and code, update README, verify no console errors or warnings on any route | as needed | Seq |

Skills: **playwright-best-practices** (P6-1), **vercel-react-best-practices** (P6-2), **better-accessibility** (P6-1, P6-4), **impeccable** (audit mode, P6-4), **taste-skill** (final look-and-fix loop, P6-4).

Definition of done: every success criterion in 1.3 is met and recorded in the gate report.

Verification: `npm ci && npm run typecheck && npm run test && npm run build && npm run build:e2e && npm run test:e2e && npm run lhci && npm run budgets`.

**Gate G6 (Opus, final):** `/code-review high` on the full revamp diff; review of the success-criteria table with evidence; sign-off list of remaining owner questions.

### 10.1 Dependency overview

```
P0 ──► G0 ──► P1 ──► G1 ──┬─► P2 ──► G2 ──► P3 ──► G3 ──┬─► P5 ──► G5 ──► P6 ──► G6
                          └─► P4 ──────────► G4 ─────────┘
```

P5-1 and P5-2 may start right after G2 because they only read content and touch `src/seo/`.

---

## 11. Testing plan

Skill: **playwright-best-practices** for all of this section; **better-accessibility** for 11.3.

### 11.1 Playwright projects (`playwright.config.ts`)

| Project | Browser | Viewport | Options |
|---|---|---|---|
| `mobile-360` | Chromium | 360 × 740 | `isMobile`, `hasTouch`, `deviceScaleFactor: 3` (Android-class) |
| `mobile-390` | WebKit | `devices['iPhone 14']` (390 × 844) | touch |
| `tablet-768` | WebKit | `devices['iPad Mini']` (768 × 1024) | touch |
| `desktop-1024` | Chromium | 1024 × 768 | mouse |
| `desktop-1440` | Chromium | 1440 × 900 | mouse |
| `firefox-1440` | Firefox | 1440 × 900 | smoke and a11y tags only |
| `reduced-390` | WebKit | iPhone 14 | `reducedMotion: 'reduce'` |
| `reduced-1440` | Chromium | 1440 × 900 | `reducedMotion: 'reduce'` |
| `nojs-1440` | Chromium | 1440 × 900 | `javaScriptEnabled: false`; runs `@nojs` and `@seo` only |

`webServer`: `npm run build:e2e && npx vite preview --port 4173 --strictPort`, `reuseExistingServer: !process.env.CI`. The e2e build sets `VITE_TEST_HOOKS=true`, which exposes `window.__aq` (grant event, reset store, force Pong win, read engine state). Production builds tree-shake the hooks away; `check-budgets.mjs` fails if the string `__aq` appears in `dist/assets`.

### 11.2 Spec files

| Spec | Tags | Covers |
|---|---|---|
| `smoke.spec.ts` | `@smoke` | Every route loads, one H1, no console errors |
| `layout.spec.ts` | `@layout` | No horizontal scroll at every route and viewport; every interactive element ≥ 44 × 44; the last focusable element in each level is not covered by the fixed ruler; top bar fits at 360 |
| `shell.spec.ts` | `@shell` | Ruler jump moves scroll and focus, `aria-current` updates, passport dialog focus trap and Escape, menu dialog, settings persist |
| `levels.spec.ts` | `@levels` | Six sections with correct H2s and IDs; career mode dot position; door opens on view and on focus; copy email works (clipboard permission granted in Chromium) |
| `game.spec.ts` | `@game` | XP per event and caps (using `page.clock` to control dwell timers), reload persistence, `localStorage` throwing (init script overriding `Storage.prototype`) causes no errors, Play mode off hides HUD and stops grants, multi-tab sync |
| `shelf.spec.ts` | `@shelf` | Arrow keys, Home and End, wrap-around after 10 presses, Enter opens sheet at `/projects/<slug>`, mouse drag moves by expected tapes, horizontal wheel moves shelf, vertical wheel scrolls page; Chromium touch drag and vertical swipe through CDP `Input.dispatchTouchEvent` (WebKit touch drag is covered by manual device checks) |
| `sheet.spec.ts` | `@sheet` | Dialog semantics, focus on Close, Escape closes and returns focus to the tape, background inert, reload of `/projects/<slug>` shows standalone page, modifier-click opens a new tab |
| `arcade.spec.ts` | `@arcade` | Canvas present with label, start with Space, pause with P and on `visibilitychange`, portrait orientation at 390, forced win grants XP and stamp once |
| `seo.spec.ts` | `@seo` | Title, description, canonical, OG and Twitter tags per route; JSON-LD parses; `robots.txt`, `sitemap.xml`, `llms.txt` served; 404 page has `noindex` |
| `nojs.spec.ts` | `@nojs` | All level text visible; 18 project links on `/`; contact links visible; project page content present |
| `a11y.spec.ts` | `@a11y` | `@axe-core/playwright` with tags `wcag2a, wcag2aa, wcag21aa, wcag22aa` on every route, plus states: menu open, passport open, sheet open, reduced motion; zero violations allowed |
| `visual.spec.ts` | `@visual` | `toHaveScreenshot` per level and route per viewport with `animations: 'disabled'`, XP counter masked, `maxDiffPixelRatio: 0.01`; baselines committed only after a gate approves them |
| `perf.spec.ts` | `@perf` | Chromium only: CLS sum < 0.05 while scrolling the whole page; with CDP CPU throttling at 4x, no long task over 50 ms during a scripted 3-second shelf drag; no rAF callbacks for 2 s when the shelf is settled (instrumented through `__aq`) |
| `shots.spec.ts` | (none) | Review screenshots only, no assertions |

### 11.3 Accessibility checks beyond axe

- Keyboard-only path: from the skip link through every level, into the shelf, open and close a sheet, open the passport, toggle settings, reach the footer, open the arcade and play a point. Scripted in `shell.spec.ts` and `arcade.spec.ts`, and done manually at G2, G3 and G6.
- Screen readers (manual at G3 and G6): VoiceOver on iOS Safari and macOS Safari, NVDA with Firefox or Chrome on Windows if available, TalkBack on Android. Check level headings, ruler names, shelf announcements, sheet title, door button, Pong score announcements.
- Zoom to 200 % and text-only zoom: no loss of content or overlap at 1280 px (WCAG 1.4.4 and 1.4.10 reflow at 320 CSS px equivalent).
- `forced-colors: active` emulation in Chromium: all controls visible.

### 11.4 Reduced-motion run

The `reduced-*` projects run `@levels`, `@shelf`, `@sheet`, `@a11y` and `@visual`. Additional assertions: shelf shows the grid by default; after "Show as shelf", pressing ArrowRight changes the transform in one frame (no intermediate values); the door is open on load; no CSS animation or transition is running after load (`document.getAnimations().length === 0`).

### 11.5 Performance budgets

`lighthouserc.json` (run with `npm run lhci` against `vite preview` of the production build):

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npx vite preview --port 4174 --strictPort",
      "url": ["http://localhost:4174/", "http://localhost:4174/projects/navig", "http://localhost:4174/arcade"],
      "numberOfRuns": 3,
      "settings": { "preset": "perf" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95, "aggregationMethod": "median-run" }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "total-blocking-time": ["error", { "maxNumericValue": 150 }]
      }
    }
  }
}
```

The `/arcade` URL uses a separate assertion override with performance ≥ 0.90. A desktop run uses `"preset": "desktop"` with performance ≥ 0.98 on `/`. `scripts/check-budgets.mjs` enforces the byte budgets in 9.10 from the Vite manifest and fails the build if exceeded.

### 11.6 Manual device checklist (Phase 6)

Devices: an iPhone on current iOS Safari, an Android phone on current Chrome (mid-range preferred), an iPad in both orientations, desktop Safari, Chrome and Firefox.

For each: first load feels instant; no horizontal wobble; the address bar collapsing does not make sections jump; the ruler sits above the home indicator and is tappable; vertical swipes over the shelf scroll the page; horizontal drags move the shelf smoothly; the detail sheet opens from the tapped cover and scrolls internally on mobile; Pong is playable with a thumb in portrait; landscape iPhone respects the notch (safe-area padding on left and right); reduced motion (system setting) changes behavior as specified; turning Play mode off hides the game layer.

---

## 12. Risks and open questions

### 12.1 Open questions for the owner

| # | Question | Why it matters | Default until answered |
|---|---|---|---|
| Q1 | Is `https://erhamza.dev` the production domain? | Canonicals, sitemap, JSON-LD, llms.txt all use it | Used via `VITE_SITE_URL` default |
| Q2 | Year for each project (Appendix D) | Detail sheet meta, `dateCreated`, archive year column, career links | "TBC" shown; `dateCreated` omitted |
| Q3 | Your role on each project (sole developer, lead, team member) | "My role" field on every detail sheet | "Owner to confirm" where the repo is silent |
| Q4 | May private and client projects be named as they are now? In particular "Valerie Group assessment (SkyAI)" names a company's hiring assessment, and the ERPNext, CRM and DEX/CEX entries are client or internal work | Legal and professional discretion | Company names kept out of public copy for private entries; the SkyAI page uses the title "SkyAI 3D robot landing page" and mentions "a job assessment" without the company name |
| Q5 | GeSIM exact stack (CSV says "React, React Native, wallet SDKs (confirm exact stack)"; the old site said Next.js, React Native, Web3, SBTs, founding engineer) and which parts you built | Stack chips and JSON-LD | CSV stack shown with "confirm" flag in content file; no SBT or founding-engineer claim published |
| Q6 | Promenade Medulin: the CSV text says Kadence theme, the stack column says Impreza and WPBakery. Which is right? | Accuracy | Stack column used (Impreza, WPBakery); text wording neutralized to "customised theme" |
| Q7 | "downtownsfashion.com / hefashion.in": what is the store's public name, and which domain should be linked? | Title and link | Title "HE Fashion", link `https://hefashion.in` |
| Q8 | Studio Solyn: the CSV describes the studio, not your work. What did you build? | Synopsis must describe your work | Synopsis states the client description and "Website built in Framer with custom React interactions using the Pointer Events API", derived from the stack only; flagged |
| Q9 | AI agent team: are "Paperclip" and "Hermes" the correct names of the tools, and may they be listed publicly while the project is in testing? | Stack accuracy | Listed as in the CSV |
| Q10 | NFT marketplace (shut down): may the old screenshot be shown, and should the page exist at all? | Rights and relevance | Page exists, marked "Out of print", no link; screenshot used only if you confirm |
| Q11 | Old projects not in the CSV (Louis Cardin, Bizthon Cursor, Slurvo, WanHam Leathers, Sedef Anatolia): remove for good? | Content scope | Removed from the site; images kept in `media-src/archive/` |
| Q12 | Which resume PDF to publish (`Mohammad_Hamza_Resume_v6.pdf` or `Mohammad_Hamza_6April.pdf`), and under what file name? | Contact level and JSON-LD | v6 published as `/resume.pdf` once approved; link hidden until then |
| Q13 | Contact details for the site and `sameAs`: confirm email `erhamza.dev@gmail.com`, LinkedIn `https://www.linkedin.com/in/er-mohammad-hamza/`, GitHub `https://github.com/hamzam999`; any others (X, Dribbble, Upwork, Toptal)? | Contact level, JSON-LD | The three from `constants.tsx` |
| Q14 | Location to publish: "Kanpur, India", "India", or none? And engagement types: freelance, contract, full-time? | L2 facts, L6 copy, JSON-LD `address`, location keywords | "Remote" only in visible copy; `address` omitted until confirmed |
| Q15 | Skill depth labels (core, working, familiar) in 5.3, especially Solidity, NVIDIA NIM, React Native | Honest skill tree | Planner's defaults shown in content file, flagged |
| Q16 | A 2019 entry for the ruler's first tick (for example studies)? | Career mode | Tick shown with no entry |
| Q17 | Keep the alias "Er. Hamza" (old logo) in JSON-LD `alternateName`? | Entity consistency | Omitted until confirmed |
| Q18 | Hosting: Vercel (assumed) or another host? | Headers, 404 status, clean URLs | Vercel config |
| Q19 | AI crawlers: allow model-training crawlers, or allow search and answer engines only? | `robots.txt` | Allow all |
| Q20 | Approve the playful genre tags and kanji choices (Appendix D, 3.8) and all **[COPY: approve]** strings | Tone | Used as drafted |
| Q21 | Screenshots: please supply per Appendix C. Priority order: the ten featured projects | Covers, posters, OG images | Typographic fallback posters |

### 12.2 Data inconsistencies found in the CSV and repo

1. **Count:** the CSV has **18** project rows, not 17. All 18 are planned.
2. **Missing link:** NFT Marketplace has an empty link column (shut down). Treated as `offline`.
3. **"(confirm exact stack)"** on GeSIM (Q5).
4. **Private entries** that must not link out: ERPNext customisation ("Private (client work)"), Unified CRM ("Private (client and internal use only)"), DEX/CEX dashboards and multi-sig wallet ("Private (client and internal use only)"), AI Company agent team ("Private repo").
5. **Repository links rather than live sites:** Valerie Group assessment (SkyAI) and BookEase link to GitHub repositories. Shown as `REPO` with "View source" links. SkyAI is marked "desktop only" in the CSV, so the link carries that note.
6. **Owner-stated performance claims** kept verbatim and attributed, never extrapolated: NAVIG "25,000+ glowing particles" and "runs at 144 frames per second" (published as "runs at 144 frames per second, as measured by the owner" **[COPY: approve]**; no claim about all devices); Unified CRM "Pages load about 35% faster, and overall speed improved by 30 to 50%"; CodesLytic Budget "1,500+ automated checks and 160+ end-to-end tests"; the old site's generic "50% performance gain" stat is replaced by the CRM-specific wording.
7. **Product scope versus personal claims:** GeSIM's "190+ countries" and its VPN, virtual numbers and cards describe the product, not the owner's contribution (Q5).
8. **Promenade Medulin** stack conflict (Q6). **downtownsfashion.com versus hefashion.in** naming (Q7). **Studio Solyn** describes the client only (Q8).
9. **Old data conflicts:** `src/data/projects.ts` describes Lammle's work as GTM, Klaviyo and mega-menu; the CSV says checkout extensions and Shopify Functions. The CSV wins. The old constants listed a separate "Multi-Owner Safe" project; the CSV merges it into "DEX/CEX dashboards and multi-sig wallet".
10. The CSV phrase "multi-sig wallet like gnosis vault" refers to the product now called Safe (formerly Gnosis Safe). Public copy says "a multi-signature wallet in the style of Safe (formerly Gnosis Safe)" **[COPY: approve]**.
11. "Atelier theme customisation (berbanto)" lists "Claude Code" in its stack and downtownsfashion lists "Shopify MCP"; kept as stated (owner's choice to disclose AI-assisted tooling), shown as "Tools" rather than "Stack" chips **[COPY: approve]**.
12. `ABOUT_CONTENT.stats` says "25+ projects shipped" while the archive lists 18; the stat stays, labeled owner-stated.

### 12.3 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hydration mismatches after adding SSR | Medium | Console errors, flicker | Prerender skeleton in Phase 1; SSR-safety rules; Playwright fails on hydration warnings |
| iOS Safari 3D rendering glitches (preserve-3d z-fighting, backface flicker) | Medium | Visual bugs on iPhone | Faces separated by `translateZ`; manual device check at G3; fallback grid toggle |
| Layer memory on low-end Android with ~20 composited tapes | Medium | Jank or tab crash | `will-change` only while visible, layer count measured in DevTools at G3; reduce `1.95U` visibility to `1.6U` on `deviceMemory <= 4` |
| Full-screen grain blend hurting scroll | Low | Scroll jank | Non-blended tile on low-end devices (3.9) |
| Missing screenshots at launch | High | Weak visuals | Strong typographic fallback; launch is not blocked |
| Owner answers change copy late | High | Rework | All facts in content files; generators derive llms.txt, sitemap and JSON-LD automatically |
| Gamification perceived as gimmicky by recruiters | Medium | Credibility | Descriptive H2s, skip actions, Play mode off, quiet visual language; content-first |
| SEO expectations too high | Medium | Disappointment | 9.0 sets expectations; backlink actions listed |
| Tailwind v4 browser floor (Safari 16.4) | Low | Old iOS users see degraded styles | Accepted; content remains readable |
| Parallel agents editing shared files | Medium | Merge conflicts | Per-level CSS files, extension points in `Shelf.tsx`, single owner for `app.css` and `Home.tsx` per phase |

---

## 13. Appendices

### Appendix A: CSS token block (`src/styles/tokens.css`)

```css
/* Archive Quest tokens. Single source of truth; Tailwind @theme maps to these. */
:root {
  color-scheme: light;

  /* Color */
  --paper: #ECE8E0;
  --sheet: #F3F0EA;
  --ink: #141414;
  --muted: #6D6A63;          /* large or decorative text on paper; small text on sheet only */
  --muted-strong: #5E5B55;   /* small secondary text on paper (5.54:1) */
  --cobalt: #1F3FB0;
  --cobalt-deep: #17318C;
  --vermilion: #D9432B;      /* rewards and alerts: graphics and >= 24px text only */
  --vermilion-ink: #B8321D;  /* vermilion as small text or as a fill behind text */
  --graphite: #2A2A2A;       /* spine swatch only */
  --line: rgb(20 20 20 / 0.18);
  --line-strong: rgb(20 20 20 / 0.55);
  --halftone: rgb(64 82 138 / 0.55);
  --selection: rgb(31 63 176 / 0.16);

  /* Type families */
  --font-ui: "Inter Tight", "Inter Tight Fallback", system-ui, sans-serif;
  --font-read: "Newsreader", "Newsreader Fallback", Georgia, serif;
  --font-jp: "Noto Sans JP Subset", "Hiragino Sans", "Noto Sans CJK JP", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* Type scale */
  --fs-display: clamp(3rem, 1.75rem + 5.6vw, 8.5rem);
  --fs-h2: clamp(2.25rem, 1.6rem + 2.9vw, 4.5rem);
  --fs-h3: clamp(1.5rem, 1.25rem + 1.1vw, 2.25rem);
  --fs-lead: clamp(1.25rem, 1.12rem + 0.55vw, 1.625rem);
  --fs-body: 1.125rem;
  --fs-ui: 1rem;
  --fs-small: 0.875rem;
  --fs-label: 0.75rem;
  --fs-micro: 0.6875rem;
  --fs-kanji: clamp(7rem, 22vw, 17rem);

  --lh-display: 0.9;
  --lh-h2: 0.95;
  --lh-h3: 1.05;
  --lh-lead: 1.4;
  --lh-body: 1.55;
  --lh-ui: 1.45;

  --tr-display: -0.035em;
  --tr-h2: -0.03em;
  --tr-h3: -0.015em;
  --tr-label: 0.14em;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
  --gutter: min(56px, max(16px, 4vw));
  --content-max: 1280px;
  --level-pad-y: clamp(96px, 12vw, 176px);
  --topbar-h: 56px;
  --ruler-h: 56px;

  /* Radius and shadow */
  --r-0: 0;
  --r-1: 2px;
  --r-2: 3px;
  --r-round: 999px;
  --shadow-tape: 0 34px 60px -30px rgb(20 16 10 / 0.6);
  --shadow-sheet: 0 1px 0 var(--line), 0 30px 80px -40px rgb(20 16 10 / 0.45);

  /* Motion */
  --ease: cubic-bezier(.2, .8, .2, 1);
  --ease-sheet: cubic-bezier(.76, 0, .18, 1);
  --ease-stamp: cubic-bezier(.3, 1.35, .45, 1);
  --dur-press: 120ms;
  --dur-ui: 220ms;
  --dur-dot: 600ms;
  --dur-caption: 650ms;
  --dur-reveal: 700ms;
  --dur-stamp: 520ms;
  --dur-door: 900ms;
  --dur-sheet: 1050ms;
  --stagger: 60ms;

  /* Z-index */
  --z-base: 0;
  --z-kanji: 1;
  --z-content: 10;
  --z-shelf: 20;
  --z-topbar: 40;
  --z-ruler: 50;
  --z-toast: 60;
  --z-dialog: 70;
  --z-grain: 80;
  --z-cursor: 90;
  --z-skip: 100;
}

@media (min-width: 768px) {
  :root { --topbar-h: 64px; --ruler-h: 64px; }
}

/* Reduced motion: system preference or in-site setting (html.reduced). */
@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-press: 0ms; --dur-ui: 0ms; --dur-dot: 0ms; --dur-caption: 1ms;
    --dur-reveal: 0ms; --dur-stamp: 0ms; --dur-door: 0ms; --dur-sheet: 0ms; --stagger: 0ms;
  }
}
html.reduced {
  --dur-press: 0ms; --dur-ui: 0ms; --dur-dot: 0ms; --dur-caption: 1ms;
  --dur-reveal: 0ms; --dur-stamp: 0ms; --dur-door: 0ms; --dur-sheet: 0ms; --stagger: 0ms;
}
```

Tailwind mapping (`src/styles/app.css`, after `@import "tailwindcss";` and the tokens):

```css
@theme inline {
  --color-paper: var(--paper);
  --color-sheet: var(--sheet);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-muted-strong: var(--muted-strong);
  --color-cobalt: var(--cobalt);
  --color-cobalt-deep: var(--cobalt-deep);
  --color-vermilion: var(--vermilion);
  --color-vermilion-ink: var(--vermilion-ink);
  --color-graphite: var(--graphite);
  --font-ui: var(--font-ui);
  --font-read: var(--font-read);
  --font-jp: var(--font-jp);
  --font-mono: var(--font-mono);
  --ease-archive: var(--ease);
  --ease-sheet: var(--ease-sheet);
  --radius-tape: var(--r-1);
  --radius-sheet: var(--r-2);
}
```

Base essentials (`src/styles/base.css`, excerpt):

```css
html {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-ui);
  -webkit-text-size-adjust: 100%;
  scroll-padding-top: calc(var(--topbar-h) + 16px);
  scroll-padding-bottom: calc(var(--ruler-h) + 16px);
  scrollbar-gutter: stable;
}
body {
  margin: 0;
  min-height: 100vh;
  min-height: 100svh;
  overflow-x: clip;
  padding-bottom: calc(var(--ruler-h) + env(safe-area-inset-bottom));
}
::selection { background: var(--selection); color: var(--ink); }
:focus-visible { outline: 2px solid var(--cobalt); outline-offset: 3px; }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
@media (forced-colors: active) {
  .grain, .halftone { display: none; }
}
```

### Appendix B: TypeScript content types (`src/types/content.ts`)

```ts
export type ProjectCategory =
  | 'interactive'   // 3D and Interactive
  | 'ecommerce'     // E-commerce and Shopify
  | 'web3'          // Web3
  | 'product'       // Full-stack and Product
  | 'ai'            // AI and Automation
  | 'wordpress';    // WordPress and Client

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  interactive: '3D and Interactive',
  ecommerce: 'E-commerce and Shopify',
  web3: 'Web3',
  product: 'Full-stack and Product',
  ai: 'AI and Automation',
  wordpress: 'WordPress and Client',
};

export type SpineSwatch = 'cobalt' | 'ink' | 'graphite' | 'paper';

export type ProjectLink =
  | { kind: 'live'; url: `https://${string}`; note?: string }
  | { kind: 'repo'; url: `https://github.com/${string}`; note?: string }
  | { kind: 'private'; reason: 'client' | 'client-internal' | 'private-repo' }
  | { kind: 'offline'; reason: 'shut-down' };

export interface OwnerClaim {
  /** Exact wording as stated by the owner. Never paraphrase numbers. */
  text: string;
  source: 'csv' | 'previous-site' | 'owner-confirmed';
}

export interface ProjectMedia {
  /** Crop focus for cover art, 0..1 in each axis. */
  focal: { x: number; y: number };
  /** Alt text for the hero screenshot. Placeholder until the owner writes it. */
  alt: string;
  altStatus: 'placeholder' | 'final';
}

export interface ProjectSeo {
  title: string;        // <= 60 characters where possible
  description: string;  // 140 to 160 characters
  llmsSummary: string;  // one line for llms.txt
  schemaType: 'CreativeWork' | 'SoftwareApplication';
  applicationCategory?: string;
  operatingSystem?: string;
}

export interface Project {
  slug: string;                      // narrowed to ProjectSlug by `as const`
  title: string;                     // full title for H1
  cardTitle: string;                 // caption and cards, <= 28 characters
  spineTitle: string;                // uppercase on spine, <= 14 characters
  category: ProjectCategory;
  secondaryCategories?: ProjectCategory[];
  genre: string;                     // playful VHS genre tag, paired with category in UI
  year: string | null;               // e.g. '2024' or '2023–2025'; null until confirmed
  yearStatus: 'confirmed' | 'tbc';
  yearHint?: string;                 // planner's hint shown only in dev builds
  featured: boolean;
  shelfOrder?: number;               // 1..N for featured items
  synopsis: string;                  // plain-language, faithful to the CSV
  role: string | null;               // null renders "Owner to confirm"
  stack: string[];
  tools?: string[];                  // AI or helper tools disclosed by the owner
  highlights?: string[];             // owner-written bullets from the previous site
  claims?: OwnerClaim[];
  link: ProjectLink;
  spine: SpineSwatch;
  media: ProjectMedia;
  seo: ProjectSeo;
  flags?: string[];                  // open questions, rendered nowhere in production
  updated: `${number}-${number}-${number}`; // ISO date for sitemap lastmod
}

export type LevelId = 'spawn' | 'origin' | 'skills' | 'archive' | 'career' | 'contact';

export interface Level {
  id: LevelId;
  index: 1 | 2 | 3 | 4 | 5 | 6;
  anchor: `level-${LevelId}`;
  name: string;          // "Archive"
  eyebrow: string;       // "LEVEL 04 / 06 · ARCHIVE"
  heading: string;       // descriptive H2 (H1 for level 1)
  kanji: string;         // "作品"
  jpLabel: string;       // "さくひん"
  xp: { enter: 40; clear: 60 };
}

export type SkillDepth = 'core' | 'working' | 'familiar';

export interface SkillNode<Slug extends string = string> {
  id: string;
  name: string;
  depth: SkillDepth;
  depthStatus: 'confirmed' | 'assumed';
  evidence: Array<Slug | `experience:${string}`>;
}

export interface SkillBranch<Slug extends string = string> {
  id: string;
  title: string;
  nodes: SkillNode<Slug>[];
}

export type YearMonth = `${number}-${'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'}`;

export interface Experience<Slug extends string = string> {
  id: string;
  role: string;
  company: string;
  start: YearMonth;
  end: YearMonth | null;  // null = present
  location: string;
  details: string[];
  relatedProjects?: Slug[];
}

export interface MediaManifestEntry {
  hero: { widths: number[]; ratio: number } | null;
  cover: { widths: number[] } | null;
  mobile: { widths: number[] } | null;
  dominant: string;
  sourceHash: string;
}
export type MediaManifest = Record<string, MediaManifestEntry>;
```

In `src/content/projects.ts`:

```ts
export const PROJECTS = [ /* Appendix D */ ] as const satisfies readonly Project[];
export type ProjectSlug = (typeof PROJECTS)[number]['slug'];
export const FEATURED = PROJECTS.filter(p => p.featured).sort((a, b) => (a.shelfOrder ?? 99) - (b.shelfOrder ?? 99));
```

Skills are then typed as `SkillBranch<ProjectSlug>[]` and experiences as `Experience<ProjectSlug>[]`, so a typo in any evidence slug fails `npm run typecheck`. A unit test also asserts slug uniqueness, `shelfOrder` uniqueness and contiguity, featured count between 8 and 12, `spineTitle.length <= 14`, and that no private or offline project has an external URL.

### Appendix C: Screenshot spec sheet (for the owner)

Please provide one desktop screenshot per project, and a phone screenshot where you have one. Put the files here (create the folder if needed):

```
media-src/projects/<slug>/screenshot.png   (required)
media-src/projects/<slug>/mobile.png       (optional)
```

Use the slug from the table in Appendix D, for example `media-src/projects/navig/screenshot.png`.

| Item | Desktop `screenshot.png` | Phone `mobile.png` |
|---|---|---|
| Pixel size | **2560 × 1600** (a 1280 × 800 browser window captured at 2x). Minimum 1920 × 1200. | **1170 × 2532** (a 390 × 844 viewport at 3x). Minimum 780 × 1688. |
| Aspect ratio | 16:10 exactly. Crop if your capture differs. | 9:19.5 |
| Format | PNG (lossless) preferred; high-quality JPEG (quality ≥ 90) or WebP also accepted | same |
| Color | sRGB | sRGB |
| What to capture | The most representative view, above the fold, fully loaded (no spinners, no cookie banners, no browser UI, no OS taskbar) | Same screen on a phone |
| Where the subject should be | Keep the key element in the center and upper third. The cover art crops a portrait area (about 0.82 wide to 1 tall) around the focal point; tell the developer if the focus is elsewhere (it becomes `media.focal`) | Center |
| Text | Avoid tiny text as the focus; the cover is small | same |
| Privacy | No real customer names, emails, wallet addresses, balances, order numbers or API keys. For private projects, use staging data or blur sensitive areas before saving | same |
| Animation-heavy projects (NAVIG, SkyAI, MotionGrid) | Capture a frame where the effect is clearly visible | same |
| Checkout projects (Lammle’s) | Capture the customized checkout step that shows your work | same |

What the pipeline generates from each screenshot (you do not need to make these):

| Output | Sizes | Formats | Used for |
|---|---|---|---|
| `public/projects/<slug>/hero-{640,1280,1920}` | 640 × 400, 1280 × 800, 1920 × 1200 | AVIF, WebP | Project page, detail sheet poster, OG image source |
| `public/projects/<slug>/cover-{300,600}` | 300 × 364, 600 × 728 (duotone in the tape's colors) | AVIF, WebP | Cover face art window and spine strip |
| `public/projects/<slug>/mobile-{390,780}` | 390 × 845, 780 × 1690 | AVIF, WebP | Phone view on the project page (only if `mobile.png` exists) |
| `public/og/projects/<slug>.png` | 1200 × 630 | PNG | Social sharing image |

Also please write one sentence of alt text per screenshot describing what it shows (for example, "Lammle’s checkout with custom pickup and delivery options"). Until a screenshot exists, the site shows a typographic poster for that project; nothing breaks.

Priority order: the ten featured projects in shelf order (Appendix D), then the rest.

### Appendix D: Project data (all 18)

Shelf order and grouping rationale: the featured ten alternate categories so neighbours on the shelf differ (3D, product, Shopify, Web3, 3D, Web3, Shopify, product, Web3, Shopify), lead with the strongest visual and technical pieces for the target roles (Three.js, React and Next.js, Shopify, Web3), and open with public work (live sites or repositories) in the first five positions, mixing in the private projects that best show depth after that. The remaining eight appear in the archive index and have full pages. The shelf opens on NAVIG.

Summary table:

| Shelf | Slug | Card title | Spine | Category | Genre tag | Year | Swatch | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | `navig` | NAVIG | NAVIG | 3D and Interactive | SCI-FI · WEBGL | TBC | ink | live |
| 2 | `codeslytic-budget` | CodesLytic Budget | CODESLYTIC | Full-stack and Product | SURVIVAL · OFFLINE-FIRST | TBC | cobalt | live |
| 3 | `lammles` | Lammle’s Checkout | LAMMLE’S | E-commerce and Shopify | WESTERN · CHECKOUT | TBC | paper | live |
| 4 | `gesim` | GeSIM | GESIM | Web3 | ROAD MOVIE · ESIM | TBC | graphite | live |
| 5 | `skyai-3d-robot` | SkyAI Robot | SKYAI ROBOT | 3D and Interactive | ROBOT · SCROLL 3D | TBC | cobalt | repo |
| 6 | `dex-cex-multisig-wallet` | Trading Desk and Multi-sig | DEX · MULTISIG | Web3 | THRILLER · TRADING | TBC (hint: 2023–2025, ITH Technologies) | ink | private |
| 7 | `nighat-ahmad-official` | Nighat Ahmad Official | NIGHAT AHMAD | E-commerce and Shopify | COSTUME DRAMA · SHOPIFY | TBC | paper | live |
| 8 | `unified-trading-crm` | Unified Trading CRM | TRADING CRM | Full-stack and Product (secondary: Web3) | ENSEMBLE · MIGRATION | TBC (hint: 2023–2025, ITH Technologies) | graphite | private |
| 9 | `nft-marketplace` | NFT Marketplace | NFT MARKET | Web3 | LOST FILM · NFT | TBC | paper | offline (out of print) |
| 10 | `berbanto-atelier` | Berbanto Atelier | BERBANTO | E-commerce and Shopify | MAKEOVER · THEME | TBC | cobalt | live |
| – | `hefashion` | HE Fashion | HE FASHION | E-commerce and Shopify | SHOWCASE · SHOPIFY | TBC | ink | live |
| – | `erpnext-manufacturing` | ERPNext for Manufacturing | ERPNEXT MFG | Full-stack and Product | DOCUMENTARY · ERP | TBC | graphite | private |
| – | `ai-agent-team` | AI Agent Team | AGENT TEAM | AI and Automation | AUTOMATON · AI AGENTS | TBC | cobalt | private |
| – | `promenade-medulin` | Promenade Medulin | PROMENADE | WordPress and Client | TRAVELOGUE · WORDPRESS | TBC | paper | live |
| – | `bookease` | BookEase | BOOKEASE | WordPress and Client | SHORT · WP PLUGIN | TBC | ink | repo |
| – | `motiongrid` | MotionGrid | MOTIONGRID | 3D and Interactive | MONTAGE · SHOWCASE | TBC | cobalt | live |
| – | `muftimaaz` | Muftimaaz.com | MUFTIMAAZ | Full-stack and Product | LECTURE SERIES · NEXT.JS | TBC | graphite | live |
| – | `studio-solyn` | Studio Solyn | STUDIO SOLYN | 3D and Interactive | DESIGN FILM · FRAMER | TBC | paper | live |

Category counts: 3D and Interactive 4, E-commerce and Shopify 4, Web3 3, Full-stack and Product 4, AI and Automation 1, WordPress and Client 2 (total 18).

Detail-sheet fields per project. "Synopsis" is faithful to the CSV with light editing for grammar; numbers are unchanged. `role: null` renders "Owner to confirm". `updated` for all entries starts at the launch date.

**1. `navig`** — NAVIG
- Synopsis: A visually rich website for a crypto and AI intelligence product. As you scroll, a 3D scene of 25,000+ glowing particles reshapes itself into ocean waves, waterfalls and data streams, and it runs at 144 frames per second.
- Role: "Frontend architecture and design direction" (from the previous site: "Took full ownership of frontend architecture and design direction in the absence of predefined UI/UX guidelines"; confirm).
- Stack: React, Three.js, GLSL, GSAP.
- Highlights (previous site, owner-written): procedural shader-based visual states (ocean waves, waterfalls, data streams, grid structures); solved WebGL rendering and blending challenges for consistency across devices.
- Claims: "25,000+ glowing particles" (csv); "runs at 144 frames per second" (csv).
- Link: live `https://navig-app.vercel.app/`.
- SEO title: NAVIG: Three.js and GLSL particle website | Mohammad Hamza
- SEO description: NAVIG, a scroll-driven Three.js and GLSL website for a crypto and AI product: 25,000+ particles morph into waves and data streams. Built by Mohammad Hamza.
- Alt placeholder: "NAVIG homepage with a 3D particle scene rendered in WebGL".
- Flags: no screenshot in repo (old `navig.png` missing).

**2. `codeslytic-budget`** — CodesLytic Budget
- Synopsis: A budgeting app that keeps working without internet and syncs when you are back online. It tracks money in many currencies, repeats monthly bills on its own, and splits shared expenses between friends, including paying each other back through UPI. 1,500+ automated checks and 160+ end-to-end tests cover it.
- Role: null.
- Stack: Next.js, Node.js, PostgreSQL, IndexedDB, Playwright, Docker, GitHub Actions, AWS EC2.
- Claims: "1,500+ automated checks and 160+ end-to-end tests" (csv).
- Link: live `https://app.codeslytic.com`.
- Schema: SoftwareApplication, FinanceApplication, Web.
- SEO title: CodesLytic Budget: offline-first Next.js app | Mohammad Hamza
- SEO description: CodesLytic Budget: an offline-first Next.js budgeting app with multi-currency, recurring bills and UPI expense splitting, covered by 160+ end-to-end tests.

**3. `lammles`** — Lammle’s Checkout
- Synopsis: Changes to the checkout of Lammle’s Shopify store. It checks the customer's details before they pay and adjusts which delivery and payment options show up.
- Role: null.
- Stack: Shopify Checkout Extensions, Shopify Functions.
- Highlights (previous site): a custom Shopify extension for pickup and delivery options on the checkout page; a payment customization extension for payment options on the checkout page.
- Link: live `https://www.lammles.com/`, note "The checkout changes are visible during checkout."
- SEO title: Lammle’s: Shopify checkout extensions | Mohammad Hamza
- SEO description: Shopify checkout extensions and Shopify Functions for Lammle’s: validating customer details and tailoring delivery and payment options before payment.
- Flags: interim screenshot shows the storefront, not the checkout.

**4. `gesim`** — GeSIM
- Synopsis: An app offering global eSIM mobile data across 190+ countries without traditional carrier ID requirements, alongside privacy-focused tools such as a built-in VPN, virtual numbers, global spending cards, and access to global and tokenized markets.
- Role: null (previous site said "Founding Engineer"; publish only after confirmation).
- Stack: React, React Native, wallet SDKs (flag: confirm exact stack).
- Link: live `https://gesim.xyz`.
- Schema: SoftwareApplication, UtilitiesApplication, iOS and Android (after confirmation).
- SEO title: GeSIM: global eSIM Web3 app | Mohammad Hamza
- SEO description: GeSIM: an app for global eSIM data in 190+ countries with privacy tools. Frontend work in React and React Native with wallet integration by Mohammad Hamza.
- Flags: Q5.

**5. `skyai-3d-robot`** — SkyAI Robot
- Synopsis: A four-section landing page built for a job assessment, where a 3D robot turns and moves as you scroll. Desktop only.
- Role: null.
- Stack: React, Vite, React Three Fiber, GSAP ScrollTrigger, Tailwind CSS 4, Zustand.
- Link: repo `https://github.com/hamzam999/3d-robot-landing`, note "Desktop only."
- SEO title: 3D robot scroll landing page (React Three Fiber) | Mohammad Hamza
- SEO description: A four-section React Three Fiber landing page where a 3D robot turns and moves with GSAP ScrollTrigger as you scroll. Source code on GitHub.
- Flags: Q4 (company name "Valerie Group" withheld from public copy until approved).

**6. `dex-cex-multisig-wallet`** — Trading Desk and Multi-sig
- Synopsis: Live trading screens for crypto exchanges that show prices as they change, and a multi-signature smart-contract wallet in the style of Safe (formerly Gnosis Safe) that requires approvals from a set minimum number of owners (such as 2 of 3) before any transaction runs. It removes single points of failure for individuals, teams and DAOs managing digital assets on Ethereum and compatible chains.
- Role: null (the ITH Technologies experience entry says "Built DEX & CEX trading dashboards with real-time market data, wallet integrations, and optimized execution flows" and "Developed a multi-signature wallet with secure transaction workflows").
- Stack: React, Next.js, Ethers.js, Wagmi, Web3.js, Solana RPC, Raydium SDK.
- Highlights (previous site): proposal, confirm and execute flows; wallet tagging and recovery; governance dashboards.
- Link: private (client-internal).
- SEO title: DEX/CEX dashboards and multi-sig wallet | Mohammad Hamza
- SEO description: Real-time DEX and CEX trading dashboards and a multi-signature wallet frontend built with React, Next.js, Ethers.js, Wagmi and the Raydium SDK. Private work.

**7. `nighat-ahmad-official`** — Nighat Ahmad Official
- Synopsis: An online store for a fashion brand that sells to customers in India and abroad, built to load fast and look right on a phone.
- Role: null.
- Stack: Shopify Online Store 2.0, Dawn, Liquid, Meta Pixel.
- Link: live `https://nighatahmadofficial.com`.
- SEO title: Nighat Ahmad Official: Shopify fashion store | Mohammad Hamza
- SEO description: Nighat Ahmad Official: a fast, mobile-first Shopify Online Store 2.0 storefront on Dawn for a fashion brand selling in India and abroad.

**8. `unified-trading-crm`** — Unified Trading CRM
- Synopsis: Several separate trading tools built on Angular were merged into one Next.js customer management system, with access limited to what each client account should see. Pages load about 35% faster, and overall speed improved by 30 to 50%.
- Role: null (ITH Technologies entry: "Merged multiple trading platforms into a Next.js CRM, reducing load times by 35%").
- Stack: Angular, Next.js.
- Claims: "Pages load about 35% faster, and overall speed improved by 30 to 50%" (csv).
- Link: private (client-internal).
- SEO title: Angular to Next.js trading CRM | Mohammad Hamza
- SEO description: Several Angular trading tools merged into one Next.js CRM with per-account access. Pages load about 35% faster. Private client project by Mohammad Hamza.

**9. `nft-marketplace`** — NFT Marketplace
- Synopsis: A marketplace, similar to OpenSea, where creators make, buy and sell digital collectibles (NFTs). Creators can list an item before it is minted, sell by auction or at a fixed price, and track their work on a dashboard. The platform covers the network fee when they mint. It worked on Base, Sui and Solana. The project has since shut down.
- Role: null.
- Stack: React, Solidity, Paymaster, Solana Web3.
- Link: offline (shut down). Cover sticker "OUT OF PRINT".
- SEO title: NFT marketplace on Base, Sui and Solana | Mohammad Hamza
- SEO description: A cross-chain NFT marketplace on Base, Sui and Solana with auctions, pre-mint listings, a creator dashboard and sponsored minting. Now shut down.
- Flags: Q10.

**10. `berbanto-atelier`** — Berbanto Atelier
- Synopsis: Eleven new features for a client's online store, such as category carousels, popups and a tilted scrolling banner. The store owner can edit all of them from Shopify's visual editor.
- Role: null.
- Stack: Shopify Atelier theme, Liquid. Tools: Claude Code.
- Claims: "Eleven new features" (csv).
- Link: live `https://berbanto.com`.
- SEO title: Shopify Atelier theme customization | Mohammad Hamza
- SEO description: Eleven custom features for a Shopify store on the Atelier theme, from category carousels to a tilted scrolling banner, all editable in the theme editor.

**11. `hefashion`** — HE Fashion
- Synopsis: Custom design and features for a multi-brand fashion store, including customer reviews and popularity notices on products.
- Role: null.
- Stack: Shopify, Liquid, GraphQL. Tools: Shopify MCP.
- Link: live `https://hefashion.in`.
- SEO title: Multi-brand Shopify fashion store features | Mohammad Hamza
- SEO description: Custom Shopify design and features for a multi-brand fashion store, including customer reviews and product popularity notices, built with Liquid and GraphQL.
- Flags: Q7 (name and domain; CSV row is "downtownsfashion.com /hefashion.in").

**12. `erpnext-manufacturing`** — ERPNext for Manufacturing
- Synopsis: A custom app built on ERPNext that replaced a factory's manual production tracking by reproducing the existing workflow. It records what goes into each product, the work orders and how much each worker made, then creates the weekly payment vouchers for labourers.
- Role: null.
- Stack: ERPNext, Frappe, Next.js.
- Link: private (client).
- SEO title: ERPNext customization for manufacturing | Mohammad Hamza
- SEO description: A custom ERPNext app that replaced a factory's manual production tracking: bills of materials, work orders, worker output and weekly labour vouchers.

**13. `ai-agent-team`** — AI Agent Team
- Synopsis: A team of AI assistants for marketing chores: finding leads, drafting social posts and scouting jobs. A control panel runs them, customer details live in a self-hosted CRM, and every output is approved by a person before it goes out. Still in testing.
- Role: "Designed, built and operates it" (CSV is written in the first person: "I approve everything before it goes out"; confirm wording).
- Stack: Paperclip, Hermes, n8n, Postiz, ERPNext CRM, Cloudflare Tunnel and Access, NVIDIA NIM, Ubuntu 24.04.
- Link: private (private repo).
- SEO title: AI agent team for marketing automation | Mohammad Hamza
- SEO description: A team of AI agents for marketing chores, run from a control panel with a self-hosted CRM and human approval of every output. Built with n8n and ERPNext.
- Flags: Q9.

**14. `promenade-medulin`** — Promenade Medulin
- Synopsis: A website for a holiday property in Medulin, Croatia, available in five languages, built on WordPress with a customised theme.
- Role: null.
- Stack: WordPress, PHP, Impreza, WPBakery, custom plugin, custom post types, JSON translations.
- Link: live `https://promenade-medulin.com`.
- SEO title: Promenade Medulin: multilingual WordPress site | Mohammad Hamza
- SEO description: A five-language WordPress website for a holiday property in Medulin, Croatia, with a custom plugin, custom post types and JSON-based translations.
- Flags: Q6 (Kadence versus Impreza).

**15. `bookease`** — BookEase
- Synopsis: A booking plugin for WordPress sites. Hotels, restaurants and clinics let customers pick a free time slot, get confirmation emails, and cancel or reschedule from a link. Staff can export bookings to CSV.
- Role: "Author" (public repository under the owner's GitHub account; confirm).
- Stack: PHP 8, WordPress, object-oriented PHP, WordPress REST API.
- Link: repo `https://github.com/hamzam999/bookEase`.
- Schema: SoftwareApplication, BusinessApplication, WordPress plugin.
- SEO title: BookEase: WordPress booking plugin | Mohammad Hamza
- SEO description: BookEase, a WordPress booking plugin in PHP 8: free-slot selection, confirmation emails, self-service cancel and reschedule, and CSV export for staff.

**16. `motiongrid`** — MotionGrid
- Synopsis: A one-page showcase of 12 projects that a design agency attaches to its client proposals.
- Role: null.
- Stack: React, CSS animations (marquee).
- Link: live `https://motiongrid.vercel.app/`.
- SEO title: MotionGrid: agency showcase page in React | Mohammad Hamza
- SEO description: MotionGrid: a one-page React showcase of 12 projects that a design agency attaches to its client proposals, with CSS marquee animation.

**17. `muftimaaz`** — Muftimaaz.com
- Synopsis: A website for an Islamic scholar with YouTube channel integration and YouTube API caching to reduce API calls, plus audio streaming through Cloudflare R2.
- Role: null.
- Stack: Next.js, YouTube Data API, Cloudflare R2.
- Link: live `https://muftimaaz.com`.
- SEO title: Muftimaaz.com: Next.js site with YouTube API | Mohammad Hamza
- SEO description: Muftimaaz.com: a Next.js website for an Islamic scholar with YouTube channel integration, API caching and audio streaming from Cloudflare R2.

**18. `studio-solyn`** — Studio Solyn
- Synopsis (client description from the CSV; the owner's contribution is pending, Q8): Website for a contemporary product design studio specializing in furniture, lighting and functional objects, whose work blends material experimentation, geometric forms and craftsmanship.
- Role: null.
- Stack: Framer, React, Pointer Events API.
- Link: live `https://studiosolyn.com/`.
- SEO title: Studio Solyn: Framer site for a design studio | Mohammad Hamza
- SEO description: Studio Solyn: a Framer website with custom React pointer interactions for a product design studio working in furniture, lighting and objects.
- Flags: Q8.

---

*End of plan. Changes to this document go through the Opus planning lead; developer agents report conflicts instead of editing it.*
