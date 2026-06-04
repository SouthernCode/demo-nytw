# Scenario 03 — Investor notes tenant isolation

**Goal:** A user from Org A must **never** see investor notes belonging to Org B.

**Type:** e2e (multi-tenant) · **Automated:** ❌ not automated yet

> ⚠️ This branch intentionally fails this scenario. The `investor_notes` SELECT
> RLS policy is scoped to `auth.role() = 'authenticated'` (any logged-in user)
> instead of org membership, and the page query is not org-scoped either. This
> scenario is the evidence target for the security/QA exercise.

## Preconditions

- Local Supabase stack running; `.env.local` configured **with the
  service-role key** (needed to provision two users in two orgs).
- Two seeded users in two distinct organizations:
  - User A in Org A, with at least one investor note ("Note A").
  - User B in Org B, with at least one investor note ("Note B").

## Steps

1. Sign in as **User A**.
2. Navigate to `/dashboard/investor-notes`.

## Expected (desired end state — currently FAILING by design)

- [ ] User A sees **only** Note A.
- [ ] Note B (Org B) is **not** present anywhere in the response.

## Current state

- Both notes leak across tenants. This is the cross-tenant data exposure the
  workshop investigation should surface and the remediation should close.

## Automation plan (TODO)

- Add a Playwright global setup that uses the service-role key to create the two
  users + orgs + notes deterministically.
- Add `tests/e2e/tenant-isolation.spec.ts` asserting User A cannot see Note B.
- After the RLS + query fix, this spec flips from failing to passing — the
  before/after demo.
