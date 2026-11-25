# Dev status

Updated: 2026-11-25T00:00:00Z
Plan: docs/REVAMP_PLAN.md (revision 2)
Current phase: 0 (Housekeeping)
Current gate: G0 pending (Opus review)
Branch: claude/bold-tesla-le6sg7
Last commit: 7aadc8a (no Phase 0 commit yet; coordinating session commits)
Next task(s): G0 review, then Phase 1 (P1-1..P1-3 group A)
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

## Deviations and notes
- Appendix B arrays are `readonly` (needed so `as const satisfies readonly Project[]` compiles). Added optional `Project.subtitle` (AI Agent Team subtitle) and `SkillBranch.evidence` (plan 5.3 puts "Seen in" per branch, not per node; node-level evidence is empty).
- framer-motion removed (2.2), so the two interview components that used `motion` now use plain divs (entry fade on the detail pane is dropped). Re-skin stays in P2-7.
- `/` is a temporary placeholder (src/routes/Home.tsx) until Phase 2. InterviewTool moved to src/routes/InterviewFramework.tsx and lazy loaded.
- Playwright 1.65 expects Chromium rev 1255 but the sandbox has 1243: playwright.config.ts falls back to any cached Chromium when the expected one is missing. Webkit/Firefox projects are skipped when not installed (always run in CI).
- Smoke run covers desktop-1024/1440, mobile-360, reduced-1440 (Chromium only here).
- Skill depth: bold-in-resume nodes marked core per plan 5.3 table; Learning branch = familiar; everything else working, `depthStatus: assumed`.
- Experience founder role has empty location (resume gives none). resumePdf is null (action A1).

## Log
- P0-1..P0-6 done; typecheck, vitest (9 tests), vite build, playwright smoke (8 passed) green; G0 greps clean
