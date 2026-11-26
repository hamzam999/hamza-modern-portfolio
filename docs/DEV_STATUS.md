# Dev status

Updated: 2026-11-25T00:00:00Z
Plan: docs/REVAMP_PLAN.md (revision 2)
Current phase: 5 (SEO and GEO done, G5 pending)
Current gate: G3 pending (Opus plus owner /review-animations)
Branch: claude/bold-tesla-le6sg7
Last commit: 7aadc8a (no Phase 0 commit yet; coordinating session commits)
Next task(s): G2 to G5 reviews, then Phase 6
Blockers: none

## Tasks

| Task | Status | Agent | Branch | Last commit | Notes / blockers |
|---|---|---|---|---|---|
| P0-1 | done | sonnet | claude/bold-tesla-le6sg7 | - | deps installed/removed per 2.2 with exact pins; also added @types/react and @types/react-dom (needed for strict TS); scripts typecheck/test/test:e2e/lhci/budgets added (build stays `vite build`; media/prerender/SEO steps arrive in later phases); .gitignore updated; docs/reference/directions.html copied from the planning scratchpad |
| P0-2 | done | sonnet | claude/bold-tesla-le6sg7 | - | sources moved under src/; alias @ -> src; Gemini define removed; index.html cleaned (markers, viewport-fit, theme-color, favicon link). Added public/favicon.svg to stop a 404 console error in the smoke test. Inline js/reduced script left to P1-3 |
| P0-3 | done | sonnet | claude/bold-tesla-le6sg7 | - | Tailwind v4 via @tailwindcss/vite; src/styles/app.css has temporary legacy @theme mappings + ported rules; index.css deleted |
| P0-4 | done | sonnet | claude/bold-tesla-le6sg7 | - | dead code, orphan data/projects, metadata.json deleted; old Portfolio sections/Navbar/Footer/pages deleted too (replaced per 2.1); screenshots moved per 2.3 (public/projects now gone); MASTER.md is a pointer. Earlier work text taken from the plan table |
| P0-5 | done | sonnet | claude/bold-tesla-le6sg7 | - | src/types/content.ts, src/content/{projects,profile,experience,skills,levels,jp}.ts, projects.test.ts; interview data at src/content/interview.ts unchanged. Old constants.tsx/types.ts deleted |
| P0-6 | done | sonnet | claude/bold-tesla-le6sg7 | - | strict + noUncheckedIndexedAccess; vitest.config.ts, playwright.config.ts (11.1 projects), smoke specs; README rewritten |
| P1-1 | done | sonnet | claude/bold-tesla-le6sg7 | - | tokens.css (Appendix A verbatim), base.css, app.css @theme inline; legacy interview mappings kept (minus conflicting `muted`) until P2-7; body padding-bottom moved to `.app--ruler` wrapper so routes without a ruler have none |
| P1-2 | done | sonnet | claude/bold-tesla-le6sg7 | - | fonts.css, fontaine in vite.config.ts (fallbackName "X Fallback"), scripts/subset-jp-fonts.mjs (7 KB woff2, 23 glyphs), kanji-paths.mjs (12 glyphs, 13 KB), build-grain.mjs (10 KB webp); Noto Sans JP variable TTF downloaded into media-src/fonts (tracked); npm scripts fonts:jp, grain |
| P1-3 | done | sonnet | claude/bold-tesla-le6sg7 | - | entry-server.tsx, seo/{site,meta,Head}, scripts/prerender.mjs (fails on empty main, h1 != 1, title > 70), hydrateRoot in main.tsx, inline js/reduced script in index.html; scripts build:client/server/build/build:e2e; vite preview plugin serves clean URLs + real 404 |
| P1-4 | done | sonnet | claude/bold-tesla-le6sg7 | - | src/game/{rules,storage,store,useLevelTracker,testHooks}.ts + 2 test files (27 tests total) |
| P1-5 | done | sonnet | claude/bold-tesla-le6sg7 | - | Button, MaskLine, HalftoneKanji, Grain, Stamp, Toast, SkipLink, lib/motion, lib/useInView, lib/scroll, lib/useLevelNav, icons/Icons.tsx |
| P1-6 | done | sonnet | claude/bold-tesla-le6sg7 | - | TopBar, Ruler (level mode), XPCounter, LevelLabel, Passport + Menu dialogs on shared ModalDialog (native dialog, Tab wrap, animated close), Settings toggles |
| P1-7 | done | sonnet | claude/bold-tesla-le6sg7 | - | Cursor.tsx |
| P1-8 | done | sonnet | claude/bold-tesla-le6sg7 | - | App.tsx (modal-route location override in place, sheet route lands Phase 3), Home with six LevelShells, ProjectsIndex, ProjectPage, Arcade, NotFound (all with one H1), Footer, LevelShell/PageShell, routes/lazyRoutes.tsx |
| P2-1 | done | sonnet | claude/bold-tesla-le6sg7 | - | L1Spawn + l1.css; plain H1 (LCP), mask lead/tagline, kanji clip, ruler baseline/tick draw; LevelShell got `heading` and `className` props |
| P2-2 | done | sonnet | claude/bold-tesla-le6sg7 | - | L2Origin + l2.css; bio, dl facts, 5 stats (5th hidden on mobile), stat numbers mask-slide |
| P2-3 | done | sonnet | claude/bold-tesla-le6sg7 | - | L3SkillTree + l3.css; 10 resume branches, depth by text, visa stamp lands on view, Seen-in links |
| P2-4 | done | sonnet | claude/bold-tesla-le6sg7 | - | L4Archive + TapeGrid, PosterFallback, ArchiveIndex, EarlierWork, l4.css; shelf box reserved, static grid only |
| P2-5 | done | sonnet | claude/bold-tesla-le6sg7 | - | L5CareerPath + l5.css; Ruler career mode (label rides the dot, p formula per 5.5) |
| P2-6 | done | sonnet | claude/bold-tesla-le6sg7 | - | L6FinalBoss + l6.css; door open in SSR/no-JS/reduced, closes by script, opens on level active, button or focusin |
| P2-7 | done | sonnet | claude/bold-tesla-le6sg7 | - | Interview page restyled (src/styles/interview.css, plain CSS); legacy Tailwind mappings and rules removed; axe fixme removed |
| P2-8 | done | sonnet | claude/bold-tesla-le6sg7 | - | ProjectDetail, ProjectPage, ProjectsIndex, NotFound, projects.css |
| P2-9 | done | sonnet | claude/bold-tesla-le6sg7 | - | Home composes L1..L6; project-open XP on /projects/:slug; boss XP on contact actions (level + footer); levels.spec.ts; app.css imports |
| P3-1 | done | sonnet | claude/bold-tesla-le6sg7 | - | scripts/build-project-media.mjs (sharp, duotone raw loop, manifest, missing report, hash skip), npm run media wired into build and build:e2e; ran on the 5 interim screenshots (full-page captures: hero cropped 16:10 from the top, widths 640 and 1280 only because sources are 1879 px wide) |
| P3-2 | done | sonnet | claude/bold-tesla-le6sg7 | - | src/components/shelf/geometry.ts + test (H table, X table vs integral, k relationship, visibility, windowed slots) |
| P3-3 | done | sonnet | claude/bold-tesla-le6sg7 | - | spring.ts createShelfEngine + 10 fake-clock tests |
| P3-4 | done | sonnet | claude/bold-tesla-le6sg7 | - | Shelf, Tape, media.tsx (CoverArt, ProjectHero), shelf.css, ShelfBox (lazy mount into reserved box), L4Archive mount point; chunk 6.2 KB gzip |
| P3-5 | done | sonnet | claude/bold-tesla-le6sg7 | - | useShelfInput: pointer drag + axis lock + flick, wheel rules, keys, tilt, click vs drag; buttons and Reel scrubber in Caption.tsx |
| P3-6 | done | sonnet | claude/bold-tesla-le6sg7 | - | Caption (650 ms mask swap), roving tabindex, aria-hidden copies, debounced live region only without a focus move |
| P3-7 | done | sonnet | claude/bold-tesla-le6sg7 | - | DetailSheet (modal route), InkMask, sheet.css, App.tsx modal route; ProjectDetail got `poster` and `reveal` props |
| P3-8 | done | sonnet | claude/bold-tesla-le6sg7 | - | ShelfBox: reduced-motion grid default, Show as shelf / Show as grid, error boundary |
| P3-9 | done | sonnet | claude/bold-tesla-le6sg7 | - | tests/e2e/shelf.spec.ts and perf.spec.ts (idle rAF, will-change, CLS, 4x throttle drag, N=14 windowed pool); scripts/check-budgets.mjs created |
| P4-1 | done | sonnet | claude/bold-tesla-le6sg7 | - | src/components/arcade/pong-engine.ts + 18 tests (scoring, caps, CPU levels, accessible, orientation) |
| P4-2 | done | sonnet | claude/bold-tesla-le6sg7 | - | ReelPong.tsx: DPR-capped canvas, ResizeObserver, landscape/portrait, banners, draw-only-while-running rAF |
| P4-3 | done | sonnet | claude/bold-tesla-le6sg7 | - | useGameInput.ts (pointer, touch single-finger capture, keys); pause on hidden, blur, <50% visible, dialog open |
| P4-4 | done | sonnet | claude/bold-tesla-le6sg7 | - | Arcade.tsx, games.ts, arcade.css; early-visit banner; win grants XP via grantPongWin, first win lands stamp |
| P4-5 | done | sonnet | claude/bold-tesla-le6sg7 | - | sr-only role=status scoreboard, accessible mode, labels; tests/e2e/arcade.spec.ts (12 tests x 5 projects) |
| P5-1 | done | sonnet | claude/bold-tesla-le6sg7 | - | meta.ts gains `og` (type, absolute image, alt); prerender head now has OG, Twitter, JSON-LD (`<` escaped), markdown alternate link on project pages; client Head.tsx unchanged (initial JS 109.8 KB of 110, so no OG tag syncing on client navigation; crawlers read prerendered HTML); font preloads already existed; src/seo/dates.ts plus `*_UPDATED` exports in profile/experience/skills |
| P5-2 | done | sonnet | claude/bold-tesla-le6sg7 | - | src/seo/jsonld.ts (home Person/WebSite/ProfilePage, project CreativeWork or SoftwareApplication with breadcrumbs, CollectionPage, WebPage for arcade and interview) and jsonld.test.ts (id refs resolve, no telephone/worksFor, no sameAs for private/offline, no dateCreated for unconfirmed years); e2e parses every prerendered block |
| P5-3 | done | sonnet | claude/bold-tesla-le6sg7 | - | scripts/gen-seo-files.mjs reads content through the SSR bundle (entry-server re-exports); robots, sitemap (21 urls, hero image entries use the largest built width, 1280, not 1920), llms.txt, llms-full.txt, dist/projects/<slug>.md; fails on phone pattern, Valerie/SkyAI, ERC on Sui/Solana |
| P5-4 | done | sonnet | claude/bold-tesla-le6sg7 | - | scripts/gen-og.mjs + scripts/og/templates.mjs (plain satori element trees, no JSX runtime); 21 PNGs written to dist/og (not public/og), max 228 KB; halftone kanji drawn from kanji-paths; no grain texture; projects without a hero use a swatch poster with the spine title |
| P5-5 | done | sonnet | claude/bold-tesla-le6sg7 | - | vercel.json per 9.8 plus Content-Type headers for llms*.txt and project .md; no SPA rewrite, 404 status verified against the preview plugin only (`vercel dev` not run here): owner should confirm a real 404 status on the first deploy |
| P5-6 | done | sonnet | claude/bold-tesla-le6sg7 | - | tests/e2e/seo.spec.ts (@seo head/JSON-LD/OG/robots/sitemap/llms/404, @nojs home, project, link names, alt, landmarks); no component fixes needed. check-budgets.mjs now fails on +91 or 9919 in any dist text file, Valerie/SkyAI, missing SEO files or an OG image over 300 KB; build now ends with gen-seo-files, gen-og, budgets; build:e2e runs the first two |

## Deviations and notes
- Appendix B arrays are `readonly` (needed so `as const satisfies readonly Project[]` compiles). Added optional `Project.subtitle` (AI Agent Team subtitle) and `SkillBranch.evidence` (plan 5.3 puts "Seen in" per branch, not per node; node-level evidence is empty).
- framer-motion removed (2.2), so the two interview components that used `motion` now use plain divs (entry fade on the detail pane is dropped). Re-skin stays in P2-7.
- `/` is a temporary placeholder (src/routes/Home.tsx) until Phase 2. InterviewTool moved to src/routes/InterviewFramework.tsx and lazy loaded.
- Playwright 1.65 expects Chromium rev 1255 but the sandbox has 1243: playwright.config.ts falls back to any cached Chromium when the expected one is missing. Webkit/Firefox projects are skipped when not installed (always run in CI).
- Smoke run covers desktop-1024/1440, mobile-360, reduced-1440 (Chromium only here).
- Skill depth: bold-in-resume nodes marked core per plan 5.3 table; Learning branch = familiar; everything else working, `depthStatus: assumed`.
- Experience founder role has empty location (resume gives none). resumePdf is null (action A1).

- Phase 1 deviations: extra CSS files `src/styles/ui.css` and `hud.css` hold primitive and HUD styles (plan 4.1 lists hud.css; ui.css added); icons live in `components/icons/Icons.tsx`; `routes/lazyRoutes.tsx` added for the SSR-eager/client-lazy switch (9.6); `src/lib/useLevelNav.ts`, `hud/ModalDialog.tsx`, `hud/MenuDialog.tsx`, `hud/Settings.tsx`, `src/vite-env.d.ts` and `scripts/` extras added.
- HalftoneKanji renders a CSS dot grid masked by the glyph SVG (data-URI mask) instead of an inline `<svg>` with a shared `<pattern>`: a userSpaceOnUse pattern scales with the viewBox and cannot keep a 3 px pitch at fluid sizes. Still no font, no request, no layout shift, aria-hidden.
- Grain low-end mode drops mix-blend-mode and lowers opacity (no second pre-darkened tile).
- Interview route title shortened to "Frontend interview questions: React, Next.js, JS | Mohammad Hamza" (plan wording is 73 chars, plan fails the build above 70).
- Reduced motion: cursor follows without lag but stays visible (plan 3.5/3.11) rather than being disabled (7.6); plan conflict, chose the two-source reading.
- Button press scale 0.97 (plan) not 0.96 (better-ui skill).
- Persisted JSON is zustand's `{state, version}` envelope under key `aq:v1`, not the flat shape in 7.5.
- Reset progress is an inline two-step confirm (passport and footer), not a separate small dialog.
- Footer links to `/llms.txt` (generated in Phase 5; 404 until then). Resume link omitted while `resumePdf` is null.
- Footer nav landmarks are labelled "Footer levels"/"Footer archive" so `nav[aria-label=Levels]` stays the ruler only.
- `/interview-framework` still uses the legacy dark skin, so its axe test is `test.fixme` until P2-7. Only change there: `<main id="main" tabIndex={-1}>`.
- Ruler career mode, shelf, detail sheet route element, arcade game, XP wiring beyond the level tracker (project open, pong, boss) are later phases.
- Playwright webServer runs `npm run build:e2e` then preview; WebKit/Firefox projects skipped here (not installed).

- Phase 2 deviations: styles for each level in src/styles/levels/l<n>.css plus common.css (kanji scroll reveal via animation-timeline, progressive), projects.css, interview.css (no Tailwind utilities left in the interview page). Interview page: icons and legacy skin dropped; list items are buttons with aria-pressed.
- Archive index group headings are H4 in Level 4 (under "Full archive" H3) and H2 on /projects (plan says H3). L2 bio DOM order is bio then facts; facts sit left on desktop via grid placement.
- L3 "Seen in" for `experience:*` evidence links to the company at `#level-career`. Skill-tree "trunk" is a single top rule, not an SVG. Visa stamp shows the page number (P.01), not a kanji.
- Tape grid fallback lists the ten featured tapes with an OUT OF PRINT badge for the offline project; no "Show as shelf" button yet (Phase 3).
- Door overlay uses a solid ink frame; leaves rotate with transform only. "BOSS DEFEATED" stamp shows only when the door was opened by script and Play mode is on.
- Project open XP fires on /projects/:slug visit (sheet arrives Phase 3). ProjectDetail renders "Owner to confirm" for null roles, per plan.
- Level 1 padding-bottom includes the ruler height so the credits strip is not covered.

- Phase 3 deviations: ShelfBox.tsx added (mount logic, boundary, toggle) instead of putting it all in L4Archive; ProjectDetail and TapeGrid got small edits (hero and cover images through shelf/media.tsx, `poster`/`reveal` props); TapeGrid items renamed `li.tape-grid__item` to free the `.tape` class. Tape rotation is written on the two faces, not on the tape root (a root at rotateY(-90) is edge-on and Chromium cannot hit-test through it). Reserved box uses `html.js:not(.reduced)` plus a motion media query, so no-JS and reduced motion show the full-height grid. H is computed from the stage width (container query units) and `100svh`, so the formula uses the stage, not the window, width. Caption always sits under the shelf (no side placement in phone landscape). A reload on `/projects/:slug` strips the saved modal state in App.tsx so the standalone page shows. App.tsx route effects skip scroll-to-top and focus when the sheet opens or closes. check-budgets.mjs created in P3 (Phase 6 extends it); the JP glyph check covers kana only because kanji are drawn from kanji-paths.ts. `?shelfN=14` (e2e build only) drives the windowed-pool test.

[COPY: approve] strings for the owner: L1 game note ("This page is a six-level run..."); L2 H2 (levels.ts) ; L3 intro ("Skills as listed on my resume...") and legend labels ("core skill / working skill / currently learning"); L4 intro ("Ten tapes on the shelf, seventeen in the archive. Open a tape for the full story." shelf sentence omitted until Phase 3), "Full archive", "Open the archive page", "Earlier work · out of print (5)" and the /projects earlier-work intro; L5 "Now:" summary line and "Earlier client stores from this period"; L6 lead (engagement types unconfirmed), "Open the red door", "Boss defeated", "Thanks for playing."; project page: private notes ("Built for a client...", etc.), "Visit live site", "View repository", "Out of print. This project has shut down.", result source labels, "Owner to confirm"; /projects intro; interview H1/lead ("Frontend interview questions: ..."); 404 text.
Open data flags kept: 25+ projects stat (previous site only), skill depth (assumed), years TBC, resume link hidden until resumePdf exists.

- Phase 4 deviations: ReelPong renders the whole card (scoreboard, canvas, controls, rules) and Arcade imports it statically so the text is prerendered; games.ts lists Pong without `load` (placeholders only). Difficulty and accessible mode persist in the store `pong` record; changing either resets to idle. Orientation: landscape when container width / (innerHeight - topbar - 160) >= 1.05. Starting scrolls the field into view first (otherwise the <50% visibility rule pauses at once). e2e build sets `window.__pong` (engine) so specs can force a won game. Screen shake on a point only when motion is allowed. Arcade chunk 6.0 KB gzip; initial JS 109.6 KB.

## Log
- P4-1..P4-5 done; typecheck, vitest (74), build:e2e, `@arcade|@a11y` (83 passed), budgets, build green; shots in test-results/arcade/
- P3-1..P3-9 done; typecheck, vitest, build:e2e, `@shelf|@sheet|@perf|@a11y`, budgets, shots and build green (details in the Phase 3 notes)
- P2-1..P2-9 done; typecheck, vitest (27), build:e2e, `@levels|@a11y|@nojs` (76 passed), shots and build green
- P1-1..P1-8 done; typecheck, vitest (27), build, build:e2e, `@shell|@a11y` and shots green (see below); 22 prerendered files each with one H1
- P0-1..P0-6 done; typecheck, vitest (9 tests), vite build, playwright smoke (8 passed) green; G0 greps clean

- Phase 5 deviations: llms.txt category headings and project lines come from `seo.llmsSummary`, so wording differs slightly from the 9.7 draft (NFT line keeps ERC-721/1155 on Base, Sui and Solana named separately). Resume link omitted while `resumePdf` is null. Person `alternateName` omitted (Q17 unconfirmed). `/arcade` and `/interview-framework` get a WebPage graph (plan lists none). Reading the sitemap, `/` and `/projects` lastmod is the latest content `updated` (2026-11-25).
