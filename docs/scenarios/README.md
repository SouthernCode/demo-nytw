# QA Scenarios

Natural-language test scenarios for LaunchPad. Each scenario describes a user
journey or a risk to verify, in plain English, so that **either a human or an
agent** can execute it and produce evidence (screenshots, assertions, console
logs).

These docs are the bridge between "what we want to verify" and the automated
tests under [`/tests`](../../tests):

- **`tests/unit`** — fast, pure-logic tests (Vitest).
- **`tests/e2e`** — full-stack browser flows against the local stack (Playwright).

## How to use

1. Pick a scenario file (e.g. `01-registration.md`).
2. Follow the **Steps**, checking each item under **Expected**.
3. If automating, the scenario maps to a spec in `tests/e2e` or a test in
   `tests/unit`. Keep them in sync — a scenario without a test is a TODO.

## Conventions

- One scenario per file, numbered by area.
- State **Preconditions** explicitly (stack running, env configured, seed data).
- Capture **Evidence** for anything security-relevant.
- Mark items that are intentionally unverified-yet as `STATUS: not automated`.

## Index

| # | Scenario | Type | Automated |
|---|----------|------|-----------|
| 01 | [User registration](./01-registration.md) | e2e | ✅ `tests/e2e/registration.spec.ts` |
| 02 | [Waitlist submission & XSS handling](./02-waitlist-xss.md) | e2e + unit | ⚠️ partial (`tests/unit/waitlist-action.test.ts`) |
| 03 | [Investor notes tenant isolation](./03-tenant-isolation.md) | e2e | ❌ not automated |
