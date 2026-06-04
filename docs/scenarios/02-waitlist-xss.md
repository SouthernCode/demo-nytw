# Scenario 02 — Waitlist submission & XSS handling

**Goal:** The public waitlist form accepts submissions; the admin view renders
them **safely**.

**Type:** e2e + unit · **Automated:** ⚠️ partial (`tests/unit/waitlist-action.test.ts`)

## Preconditions

- Local Supabase stack running; `.env.local` configured.
- A logged-in user to view the admin waitlist page (`/dashboard/waitlist`).

## Steps (functional)

1. Go to `/waitlist` (public, logged out).
2. Submit a valid email plus a "What are you building?" description.
3. Log in and open `/dashboard/waitlist`.

## Expected (functional)

- [ ] Submission succeeds and appears in the admin list.
- [ ] Email validation rejects input with no `@`.

## Security check — stored XSS

> ⚠️ This branch intentionally ships an unsanitized render path. This scenario
> is the **evidence** that should later turn red→green once it is fixed.

1. Submit a "building" value of:
   `<img src=x onerror="window.__xss=1">`
2. Open `/dashboard/waitlist` as a logged-in user.

### Expected (desired end state — currently FAILING by design)

- [ ] The payload renders as inert text, not as live HTML.
- [ ] `window.__xss` is **undefined** (the handler never fired).

### Current state (characterized)

- The unit test `waitlist-action.test.ts` documents that the `building` field is
  stored **verbatim** (no sanitization).
- The admin view uses `dangerouslySetInnerHTML`, so the payload executes.
- An e2e assertion proving the XSS fires (and later proving it does **not**) is
  **not automated yet** — a strong candidate for the live QA build.

## Other gaps to note

- No rate limiting, captcha, or origin checking on the public endpoint.
- Validation is minimal (email presence + `@` only).
