-- 0002_admin_users.sql
-- Who may edit the CMS, and which sections. Apply manually.
--
-- IMPORTANT — this migration is the switch that turns enforcement ON.
-- Until admin_users holds at least one row, every authenticated user is
-- treated as an owner, which is exactly how the CMS behaved before this
-- table existed. Inserting the first row (yourself, as owner) starts
-- enforcing; anyone not listed then has no edit access at all.
-- Seed yourself in the same transaction you apply this, or you will lock
-- yourself out of your own admin.

create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text        not null,
  -- owner: every section, including user management.
  -- editor:  only the section keys listed below.
  role       text        not null default 'editor' check (role in ('owner', 'editor')),
  -- CONTENT_SECTIONS keys, e.g. {'home/hero','site/footer'}. Ignored for owners.
  sections   text[]      not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_users_email_idx on public.admin_users (email);

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
--
-- A signed-in admin may read ONLY their own row — enough for the app to learn
-- its own permissions, and nothing more. There is deliberately no write policy:
-- role and sections are changed through the owner-only admin UI, which uses the
-- service-role key server-side. A policy allowing self-update would let an
-- editor promote themselves to owner.
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;

drop policy if exists admin_users_read_own on public.admin_users;
create policy admin_users_read_own
  on public.admin_users for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Seed the first owner. Replace the address, then run.
-- Safe to re-run: it does nothing when the account does not exist, and
-- promotes rather than duplicating when the row is already there.
-- ---------------------------------------------------------------------------
insert into public.admin_users (user_id, email, role)
select id, email, 'owner'
from auth.users
where email = 'mlritwebsite@gmail.com'
on conflict (user_id) do update set role = 'owner';
