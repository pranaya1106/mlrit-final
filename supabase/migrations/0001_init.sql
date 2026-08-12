-- 0001_init.sql
-- Content + asset metadata tables. Apply manually (supabase db push / SQL editor).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- content_blocks: one JSON blob per (page, section), versioned for optimistic
-- concurrency. saveSection() updates WHERE version = expectedVersion.
-- ---------------------------------------------------------------------------
create table if not exists public.content_blocks (
  id          uuid primary key default gen_random_uuid(),
  page_slug   text        not null,
  section_key text        not null,
  content     jsonb       not null default '{}'::jsonb,
  version     integer     not null default 1,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint content_blocks_page_section_key unique (page_slug, section_key)
);

create index if not exists content_blocks_page_slug_idx
  on public.content_blocks (page_slug);

-- ---------------------------------------------------------------------------
-- assets: metadata for objects stored in the `assets` storage bucket.
-- `key` is the storage path passed to getAssetUrl()/uploadAsset().
-- ---------------------------------------------------------------------------
create table if not exists public.assets (
  id           uuid primary key default gen_random_uuid(),
  key          text        not null unique,
  content_type text        not null,
  size_bytes   bigint,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_blocks_set_updated_at on public.content_blocks;
create trigger content_blocks_set_updated_at
  before update on public.content_blocks
  for each row execute function public.set_updated_at();

drop trigger if exists assets_set_updated_at on public.assets;
create trigger assets_set_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: anon/authenticated may read; writes go through the service-role key,
-- which bypasses RLS entirely, so no write policies are granted here.
-- ---------------------------------------------------------------------------
alter table public.content_blocks enable row level security;
alter table public.assets         enable row level security;

drop policy if exists content_blocks_public_read on public.content_blocks;
create policy content_blocks_public_read
  on public.content_blocks for select
  using (true);

drop policy if exists assets_public_read on public.assets;
create policy assets_public_read
  on public.assets for select
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for uploadAsset()/getAssetUrl(). Public so getPublicUrl()
-- resolves; swap to public = false + signed URLs if that is not wanted.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;
