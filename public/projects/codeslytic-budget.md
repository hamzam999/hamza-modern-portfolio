# CodesLytic Budget

- Category: Full-stack and Product
- Status: live
- Year: 2026
- Engagement: Built for a client
- Role: Built end to end by me as the sole developer, for a client
- Stack: Next.js, Node.js, PostgreSQL, IndexedDB, Playwright, Docker, GitHub Actions, AWS EC2
- Tools used: Claude Code
- Link: https://app.codeslytic.com
- Page: https://erhamza.tech/projects/codeslytic-budget

A budgeting app that keeps working without internet and syncs when you are back online. It tracks money in many currencies, repeats monthly bills on its own, and splits shared expenses between friends, including paying each other back through UPI.

## Highlights

- Accounts, nested categories, multi-currency tracking, monthly budgets with alerts and projections, recurring transactions on a background worker (time zones, DST, month-end safe)
- Splitwise-style group expenses (equal, exact, percentage, share) with exact-sum rounding, debt simplification, settlements and UPI settle-up
- Offline-first sync engine (IndexedDB, idempotent outbox, field-level merge, conflict inbox) and an installable PWA with WCAG 2.2 work
- Money stored as integer minor units with a shared TypeScript domain core; rotating refresh tokens, Argon2, CSRF checks and multi-tenant access control (per-user data isolation)
- GitHub Actions CI/CD with Docker deploy to AWS EC2 and automatic rollback

## Results

- 1,500+ unit/integration and 160+ E2E test cases (owner-reported)

By Mohammad Hamza: https://erhamza.tech/
