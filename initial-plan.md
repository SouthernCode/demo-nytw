Create the initial workshop repository branch for our NYC Tech Week “Agentic Coding / Harness Engineering” workshop.

Goal:
Build a realistic but intentionally imperfect Next.js + Supabase SaaS app that we can use live during the workshop to demonstrate investigation, planning, execution, QA verification, and security auditing.

This branch should represent the starting point of the workshop:

* working enough to demo
* realistic enough to audit
* intentionally incomplete
* intentionally vulnerable in a few controlled places
* no custom agent skills yet
* no final implementation plans yet
* no polished QA suite yet

Do not create the completed/fixed version yet. This is the “before” branch.

App concept:
Create a small founder-focused SaaS called LaunchPad.

LaunchPad is a lightweight startup operating system where founders can:

* create an account
* log in
* manage startup projects
* track tasks/milestones
* save investor notes
* collect public waitlist submissions from a landing page form

Technology requirements:

* Next.js app using the existing preferred modern setup
* Supabase for auth and database
* TypeScript
* Tailwind or the repo’s existing styling setup
* clean, modern UI
* responsive enough for demo
* easy to run locally
* clear env variable documentation
* database migrations or SQL setup files included
* seed data if useful

Pages / routes to implement:

Public:

* landing page
* login page
* register page
* public waitlist form

Authenticated:

* dashboard
* projects list
* create project
* project detail
* project tasks / milestones
* investor notes
* settings/profile page

Database model:

* profiles
* organizations
* organization_members
* projects
* project_tasks
* investor_notes
* waitlist_submissions
* optionally audit_events, but leave it incomplete or unused for later workshop improvement

Auth:

* working Supabase email/password auth
* register creates a profile and default organization
* logged-in users can access dashboard and app pages
* logged-out users should be redirected away from protected pages

Important: intentionally include controlled issues for the workshop

Security / quality issues to intentionally include:

1. Stored XSS-style issue:
    * The public waitlist form should accept a free-text field such as “company description”, “founder note”, or “what are you building?”
    * Store the value in Supabase
    * Render it later in an authenticated dashboard/admin-style page in a way that is intentionally unsafe or poorly sanitized
    * Add a clear code comment such as “WORKSHOP_INTENTIONAL_VULNERABILITY” so we can identify it later, but do not display this to users
2. Weak or missing RLS:
    * Include RLS policies for some tables, but intentionally leave one table underprotected or incorrectly scoped
    * Good candidate: investor_notes or waitlist_submissions
    * Add a code or migration comment marking it as intentional for workshop purposes
3. Missing public form protections:
    * No rate limiting
    * Minimal validation
    * No captcha
    * No origin checking
    * This should work, but be intentionally production-incomplete
4. Incomplete authorization:
    * Include at least one server action, API route, or page query where tenant scoping is missing or too weak
    * It should be subtle enough that the investigation skill has something real to find
5. Incomplete QA:
    * Add only very basic tests or no Playwright coverage yet
    * Leave obvious room for a QA agent to create evidence-based tests later
6. Incomplete localization:
    * Hardcode all UI copy in English
    * Structure the app so adding localization later is realistic
    * Do not implement i18n yet
7. Incomplete audit logging:
    * Create a placeholder audit_events table or utility, but do not fully wire it
    * This gives us a good planning example later

Code quality:

* Keep the app understandable for workshop attendees
* Avoid overengineering
* Use clear naming
* Use a realistic folder structure
* Include comments only where useful
* Make the intentional vulnerabilities discoverable by code review, but do not make the app look broken

UI requirements:

* Polished landing page
* Modern dashboard shell
* sidebar or top navigation
* project cards
* task list
* investor notes page
* waitlist submissions view
* settings/profile page

The UI should look good enough that attendees feel this is a real app, not a toy todo list.

Repository documentation:
Create or update README.md with:

* app overview
* local setup instructions
* required env vars
* Supabase setup instructions
* how to run dev server
* how to apply migrations
* known workshop notes explaining that this branch intentionally contains security and quality gaps for training purposes, without listing every vulnerability too explicitly

Do not add:

* custom Cursor/Claude skills yet
* final investigation reports
* final implementation plans
* completed security fixes
* full QA suite
* localization
* production-ready rate limiting
* full SOC2-style controls

Acceptance criteria:

* App runs locally
* User can register and log in
* A default organization is created
* User can create and view projects
* User can create and view tasks/milestones
* User can create and view investor notes
* Public waitlist form stores submissions
* Authenticated user can see waitlist submissions
* Protected pages require login
* Supabase schema/migrations are included
* Initial branch contains intentional issues suitable for later workshop investigation and remediation
* README explains setup clearly

After implementation:

* Run typecheck/lint if available
* Run the app build if possible
* Report what was created
* Report any commands that failed and why
* Do not fix the intentional workshop issues unless they prevent the app from running.


for styles look for v0-southern-code-website main page and use copy styles and look and feel, animations etc. when applicable