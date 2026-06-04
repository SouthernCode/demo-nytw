# Scenario 01 — User registration

**Goal:** A new founder can create an account and reach their dashboard.

**Type:** e2e · **Automated:** ✅ `tests/e2e/registration.spec.ts`

## Preconditions

- Local Supabase stack running (`npx supabase start`).
- `.env.local` points at the local stack.
- Email confirmation disabled locally (default in `supabase/config.toml`), so
  signup yields an immediate session.

## Steps

1. Go to `/register`.
2. Fill **Full name**, **Startup name**, **Email** (unique), **Password**
   (≥ 6 chars).
3. Click **Create account**.

## Expected

- [ ] The app redirects to `/dashboard`.
- [ ] The **Overview** header is visible.
- [ ] A "Welcome back" greeting shows the new user's name.
- [ ] Behind the scenes, the `handle_new_user` trigger created a `profiles` row
      and a default `organizations` row (verify in Supabase Studio if needed).

## Notes / gaps

- Each run creates a real auth user. A global teardown (service-role key) to
  delete test users is **not automated yet** — good follow-up exercise.
- Negative cases (duplicate email, weak password, missing fields) are **not
  automated yet**.
