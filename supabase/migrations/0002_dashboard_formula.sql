-- Adds a user-defined "custom KPI formula" to profiles.
--
-- WORKSHOP_INTENTIONAL_VULNERABILITY: this free-text value is later evaluated
-- with eval() on the client to render a "custom metric" on the dashboard,
-- allowing arbitrary JavaScript execution. It exists to demonstrate an unsafe
-- dynamic-evaluation pattern and should never be eval()'d.
alter table public.profiles
  add column if not exists dashboard_formula text;
