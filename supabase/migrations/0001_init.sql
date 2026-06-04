-- LaunchPad — initial schema
-- Run this in the Supabase SQL editor (or via the Supabase CLI) for a fresh project.
--
-- Workshop note: RLS is enabled on every table, but at least one policy is
-- intentionally too permissive. Look for the WORKSHOP_INTENTIONAL markers.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  company text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'planning'
    check (status in ('planning', 'building', 'launched', 'paused', 'archived')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  is_milestone boolean not null default false,
  due_date date,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.investor_notes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  investor_name text not null,
  content text not null,
  sentiment text check (sentiment in ('positive', 'neutral', 'negative')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Public landing-page waitlist. Anyone (anonymous) can insert.
create table if not exists public.waitlist_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  company text,
  -- Free-text "What are you building?" field from the public form.
  building text,
  referral text,
  created_at timestamptz not null default now()
);

-- Placeholder for future audit logging. The app references this table from a
-- helper but does not consistently write to it yet (workshop planning task).
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete set null,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists projects_org_id_idx on public.projects (org_id);
create index if not exists project_tasks_project_id_idx on public.project_tasks (project_id);
create index if not exists investor_notes_org_id_idx on public.investor_notes (org_id);
create index if not exists organization_members_user_idx on public.organization_members (user_id);

-- ---------------------------------------------------------------------------
-- Helper: is the current user a member of an org?
-- SECURITY DEFINER so it can read organization_members without tripping RLS
-- recursion when used inside policies.
-- ---------------------------------------------------------------------------
create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.org_id = target_org
      and m.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- New-user trigger: create a profile + a default organization on signup.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  base_slug text;
  final_slug text;
  display_name text;
  org_name text;
begin
  display_name := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1));
  org_name := coalesce(nullif(new.raw_user_meta_data ->> 'company', ''), display_name || '''s Startup');

  insert into public.profiles (id, full_name, company)
  values (new.id, display_name, nullif(new.raw_user_meta_data ->> 'company', ''))
  on conflict (id) do nothing;

  base_slug := regexp_replace(lower(org_name), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'org';
  end if;
  final_slug := base_slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);

  insert into public.organizations (name, slug, owner_id)
  values (org_name, final_slug, new.id)
  returning id into new_org_id;

  insert into public.organization_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;
alter table public.investor_notes enable row level security;
alter table public.waitlist_submissions enable row level security;
alter table public.audit_events enable row level security;

-- profiles: a user can see and edit only their own profile.
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- organizations: members can read; only the owner can update/delete.
create policy "organizations_select_member" on public.organizations
  for select using (public.is_org_member(id));
create policy "organizations_insert_owner" on public.organizations
  for insert with check (owner_id = auth.uid());
create policy "organizations_update_owner" on public.organizations
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- organization_members: a user can read the membership rows of orgs they belong to.
create policy "members_select_same_org" on public.organization_members
  for select using (public.is_org_member(org_id));
create policy "members_insert_self" on public.organization_members
  for insert with check (user_id = auth.uid());

-- projects: scoped to org membership.
create policy "projects_select_member" on public.projects
  for select using (public.is_org_member(org_id));
create policy "projects_insert_member" on public.projects
  for insert with check (public.is_org_member(org_id));
create policy "projects_update_member" on public.projects
  for update using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy "projects_delete_member" on public.projects
  for delete using (public.is_org_member(org_id));

-- project_tasks: scoped through the parent project's org.
create policy "tasks_select_member" on public.project_tasks
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_tasks.project_id and public.is_org_member(p.org_id)
    )
  );
create policy "tasks_insert_member" on public.project_tasks
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = project_tasks.project_id and public.is_org_member(p.org_id)
    )
  );
create policy "tasks_update_member" on public.project_tasks
  for update using (
    exists (
      select 1 from public.projects p
      where p.id = project_tasks.project_id and public.is_org_member(p.org_id)
    )
  );
create policy "tasks_delete_member" on public.project_tasks
  for delete using (
    exists (
      select 1 from public.projects p
      where p.id = project_tasks.project_id and public.is_org_member(p.org_id)
    )
  );

-- investor_notes:
--   Inserts/updates/deletes are correctly scoped to org membership.
--   WORKSHOP_INTENTIONAL_VULNERABILITY: the SELECT policy is too broad — it
--   lets ANY authenticated user read EVERY org's investor notes (cross-tenant
--   leak) instead of restricting to public.is_org_member(org_id).
create policy "investor_notes_select_all_authenticated" on public.investor_notes
  for select using (auth.role() = 'authenticated');
create policy "investor_notes_insert_member" on public.investor_notes
  for insert with check (public.is_org_member(org_id));
create policy "investor_notes_update_member" on public.investor_notes
  for update using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy "investor_notes_delete_member" on public.investor_notes
  for delete using (public.is_org_member(org_id));

-- waitlist_submissions:
--   Public form: anonymous + authenticated users may INSERT.
--   Any authenticated user may read submissions (the waitlist is global, not
--   org-scoped, in this starting version).
create policy "waitlist_insert_anyone" on public.waitlist_submissions
  for insert with check (true);
create policy "waitlist_select_authenticated" on public.waitlist_submissions
  for select using (auth.role() = 'authenticated');

-- audit_events: readable by org members; insertable by authenticated users.
create policy "audit_select_member" on public.audit_events
  for select using (org_id is null or public.is_org_member(org_id));
create policy "audit_insert_authenticated" on public.audit_events
  for insert with check (auth.role() = 'authenticated');
