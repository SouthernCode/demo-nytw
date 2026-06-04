<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Package manager

This project uses **npm**. Use `npm`/`npx` (not pnpm or yarn). There is a single
lockfile, `package-lock.json` — keep it the only one.

# Testing

Two layers. Add new tests to the matching folder.

- **Unit** — `tests/unit/`, run with **Vitest** (`npm run test`, `npm run test:watch`).
  Pure logic only; mock external dependencies (e.g. the Supabase client) so these
  stay fast and need no database or network. The `@/` import alias maps to `src/`.
- **End-to-end** — `tests/e2e/`, run with **Playwright** (`npm run test:e2e`).
  These drive a real browser and require a **live local Supabase stack** plus a
  configured `.env.local`. Playwright boots `npm run dev` automatically.

Plain-English scenarios live in `docs/scenarios/` and are the source of truth for
what should be covered. Prefer **evidence-based** tests: assert observable
behavior, and when a scenario documents an intentional gap, write the test to
capture current behavior (and note the desired end state) rather than skipping it.

Before running e2e: `npx supabase start` (needs Docker), create `.env.local` from
the printed local URL + anon key, and `npx playwright install chromium` once.

Always run `npm run typecheck` and `npm run lint` after changes; keep both clean.
