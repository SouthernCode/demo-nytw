# LaunchPad

LaunchPad is a lightweight **startup operating system** for founders. Create a
workspace, manage projects, track tasks and milestones, keep investor notes, and
collect waitlist signups from a public landing page — all in one calm place.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4** on top of
**Supabase** for authentication and Postgres.

> **Workshop note:** This is the *starting* branch for a hands-on workshop. The
> app works and looks real, but it is intentionally incomplete in a few areas
> (security, authorization, validation, QA, audit logging, localization) so we
> have realistic things to investigate and improve during the session. It is not
> production-ready as-is. See [Workshop notes](#workshop-notes) below.

---

## Features

**Public**

- Polished marketing landing page
- Register / login
- Public waitlist form ("what are you building?")

**Authenticated dashboard**

- Overview with live stats
- Projects: list, create, detail
- Tasks & milestones per project
- Investor notes with sentiment
- Waitlist submissions view
- Settings / profile

## Tech stack

| Area     | Choice                                  |
| -------- | --------------------------------------- |
| Framework| Next.js (App Router, RSC, Server Actions)|
| Language | TypeScript                              |
| Styling  | Tailwind CSS v4 + a small shadcn-style UI kit |
| Backend  | Supabase (Auth + Postgres + RLS)        |
| Fonts    | Inter + JetBrains Mono                   |

---

## Local setup

### 1. Prerequisites

- Node.js 20+
- A Supabase project (free tier is fine) — <https://supabase.com>

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

| Variable                        | Where to find it                                   |
| ------------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Project Settings → API → Project URL     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` public key |

### 4. Set up the database

Apply the schema migration in your Supabase project.

**Option A — Supabase SQL editor (simplest):**

1. Open your project → **SQL Editor**.
2. Paste the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and run it.
3. (Optional) Paste and run [`supabase/seed.sql`](supabase/seed.sql) to add a few
   sample waitlist submissions.

**Option B — Supabase CLI:**

```bash
supabase db push          # or: psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql
psql "$DATABASE_URL" -f supabase/seed.sql   # optional seed
```

The migration creates all tables, enables Row Level Security, adds policies, and
installs a trigger that automatically creates a **profile + default organization**
whenever a new user signs up.

### 5. Auth settings (recommended for local demos)

In Supabase → **Authentication → Providers → Email**, turn **off** "Confirm email"
so that registering signs you straight in. (With confirmation on, you'll need to
click the email link before logging in.)

### 6. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## Project structure

```
src/
  app/
    (auth)/            login, register, auth server actions
    (app)/dashboard/   protected app (overview, projects, notes, waitlist, settings)
    waitlist/          public waitlist form + action
    page.tsx           marketing landing page
  components/
    ui/                small shadcn-style primitives (button, card, input, ...)
    dashboard/         sidebar + page header
  lib/
    supabase/          browser + server clients and session middleware
    data.ts            dashboard context loader (auth + org)
    audit.ts           audit-logging helper (placeholder, not fully wired)
    types.ts           hand-written DB types
supabase/
  migrations/0001_init.sql
  seed.sql
tests/
  unit/                unit tests (Vitest)
  e2e/                 end-to-end browser flows (Playwright)
docs/
  scenarios/           natural-language QA scenarios
```

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run start      # run the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # unit tests (Vitest)
npm run test:watch # unit tests in watch mode
npm run test:e2e   # end-to-end tests (Playwright; needs the local stack + .env.local)
```

---

## Testing

Two layers, run independently:

- **Unit** (`tests/unit`, Vitest) — fast, pure-logic tests with no external
  dependencies. They mock Supabase, so no database or network is required.
- **End-to-end** (`tests/e2e`, Playwright) — drive a real browser against the
  running app and a **live local Supabase stack**.

Plain-English scenarios behind these tests live in
[`docs/scenarios`](docs/scenarios) — a good map of what is and isn't covered.

### Unit tests

```bash
npm run test          # one-shot
npm run test:watch    # watch mode
```

### End-to-end tests

E2E needs the full stack up. One-time setup, then the run:

```bash
# 1. Local Supabase (requires Docker running). Prints your local URL + keys:
npx supabase start

# 2. Point the app at the local stack. Use the values printed above:
#    NEXT_PUBLIC_SUPABASE_URL      -> the API URL (e.g. http://127.0.0.1:55321)
#    NEXT_PUBLIC_SUPABASE_ANON_KEY -> the anon (publishable) key
#    Create .env.local with those (see "Configure environment variables").

# 3. Install the Playwright browser (first run only):
npx playwright install chromium

# 4. Run it. Playwright boots `npm run dev` automatically if nothing is on :3000.
npm run test:e2e
```

Notes:

- Email confirmation must be **off** on the local stack (it is by default in
  [`supabase/config.toml`](supabase/config.toml)) so registration yields an
  immediate session.
- Each e2e run creates a **real auth user** with a unique email. Cleaning those
  up (a Playwright global teardown using the service-role key) is a deliberate
  open task — see [`docs/scenarios/01-registration.md`](docs/scenarios/01-registration.md).

---

## Workshop notes

This branch is deliberately a realistic "before" snapshot. A few areas are
intentionally left incomplete or imperfect so the workshop can practice
investigation, planning, execution, QA, and security auditing on real code:

- **Security & authorization** — review how tenant data is isolated end to end
  (database policies *and* application queries). At least one place trusts the
  wrong layer.
- **Public form hardening** — the waitlist endpoint works but is production-incomplete
  (validation, abuse protection, output handling).
- **QA** — there is only a single placeholder test; there is no end-to-end coverage yet.
- **Audit logging** — an `audit_events` table and helper exist but are not
  consistently wired into mutations.
- **Localization** — all copy is hardcoded in English; the app is structured so
  i18n could be added later.

These gaps are intentional and should be treated as exercises, not bugs to file.
Please don't "fix" them outside the workshop flow.

---

## Facilitator reference — steps to reproduce (SPOILERS)

> ⚠️ **Spoiler warning for instructors only.** This section names the planted
> security issues and shows how to trigger them. Don't share it with attendees
> before the investigation exercise — let them discover these first.

There are three intentionally planted client-side code-execution sinks. All are
marked in the source with a `WORKSHOP_INTENTIONAL_VULNERABILITY` comment.

> Note: these inject and run code in **your own browser session** as a demo.
> Use a throwaway local account. A `<script>…</script>` string does **not**
> execute when assigned via `innerHTML`, which is why the HTML payloads below
> use an element with an inline event handler (`<img onerror=…>` / `<svg onload=…>`).

### 1. Stored XSS — public waitlist field

- **Source:** `What are you building?` field on the public form (`/waitlist`).
- **Sink:** rendered as raw HTML with `dangerouslySetInnerHTML` in
  `src/app/(app)/dashboard/waitlist/page.tsx`.

**Reproduce**

1. Open `/waitlist`, enter any email, and in **What are you building?** paste:

   ```html
   <img src=x onerror="alert('stored XSS via waitlist')">
   ```

2. Submit the form.
3. Sign in, then open **`/dashboard/waitlist`** — the payload runs as the list renders.

The seed data also ships a sample payload on the "Acme Growth" row
(`<img src=x onerror="document.title='xss'">`), so just visiting
`/dashboard/waitlist` changes the browser tab title to `xss`.

Other payloads that work in this field:

```html
<svg onload="alert(document.cookie)"></svg>
```

### 2. Stored XSS — registration display name

- **Source:** **Full name** field on `/register` (also editable later in Settings).
- **Sink:** the dashboard greeting renders the profile name as raw HTML in
  `src/app/(app)/dashboard/page.tsx`.

**Reproduce**

1. Go to `/register`. In **Full name**, enter:

   ```html
   <img src=x onerror="document.body.style.background='crimson'">
   ```

2. Fill in any email + password and submit.
3. You're redirected to `/dashboard`, and the greeting renders the name — the
   payload fires immediately (background turns crimson).

Alert variant:

```html
<img src=x onerror="alert('XSS from the registration form')">
```

### 3. Arbitrary JS via `eval()` — custom KPI formula

- **Source:** **Custom KPI formula** field in **Settings** (`/dashboard/settings`).
- **Sink:** evaluated client-side with `eval()` in
  `src/components/dashboard/metric-card.tsx`.

**Reproduce**

1. In **Settings → Custom KPI formula**, enter a payload, then save.
2. Open **`/dashboard`** — the "Custom metric" card runs it via `eval()`.

Because this is `eval`, payloads are plain JavaScript (no HTML tag tricks needed):

```js
// Proves it really evaluates (uses the live metric variables):
projects * 10 + waitlist
```

```js
// Flashy demos:
alert('code execution via eval ' + document.cookie)
document.body.style.background = 'crimson'
(()=>{let h=0;setInterval(()=>document.body.style.background=`hsl(${h=(h+8)%360},90%,50%)`,40)})()
document.body.innerHTML = '<h1 style="color:lime;font-size:60px">pwned via eval()</h1>'
```

The formula can use these in-scope variables: `projects`, `milestones`,
`notes`, `waitlist`.

### Other planted issues (no single payload)

- **Cross-tenant data leak (weak RLS + missing scope):** the `investor_notes`
  SELECT policy allows any authenticated user to read every org's notes, and
  `/dashboard/investor-notes` doesn't scope its query by org. To observe: create
  two accounts/orgs, add an investor note in each, and confirm both notes appear
  for both users.
- **Unprotected public endpoint:** the waitlist submit action has no rate
  limiting, captcha, or origin checks and only minimal validation.
