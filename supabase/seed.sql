-- LaunchPad — optional seed data.
-- Safe to run after 0001_init.sql. Only seeds the public waitlist (which has
-- no dependency on auth.users); org/project/investor data is created naturally
-- as you register and use the app.

insert into public.waitlist_submissions (email, name, company, building, referral)
values
  (
    'maya@northwind.io',
    'Maya Chen',
    'Northwind Labs',
    'A scheduling copilot for clinics — we want to cut no-shows with smart reminders.',
    'Twitter'
  ),
  (
    'dev@payloop.app',
    'Devon Park',
    'Payloop',
    'Usage-based billing for API companies. Stripe is too manual for our metering.',
    'Product Hunt'
  ),
  (
    'sam@harborlytics.com',
    'Sam Ortiz',
    'Harborlytics',
    'Logistics analytics for small freight brokers.',
    'Referral'
  ),
  -- Demonstration entry: the public form does no sanitization, and the admin
  -- waitlist view renders this field as raw HTML. (Workshop sample payload.)
  (
    'growth@acme.test',
    'Alex Rivera',
    'Acme Growth',
    'We''re building <b>analytics</b> <img src=x onerror="document.title=''xss''" />',
    'Newsletter'
  );
