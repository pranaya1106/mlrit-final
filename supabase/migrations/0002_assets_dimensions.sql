-- 0002_assets_dimensions.sql
-- Image dimensions on assets, plus the banners table.

-- ---------------------------------------------------------------------------
-- assets: intrinsic pixel dimensions, so next/image can reserve layout space
-- without measuring the file at request time. Nullable — non-image assets and
-- rows predating this migration have no dimensions.
-- ---------------------------------------------------------------------------
alter table public.assets add column if not exists width  integer;
alter table public.assets add column if not exists height integer;

-- ---------------------------------------------------------------------------
-- banners: scheduled promotional slots. `asset_key` is the storage key handed
-- to getAssetUrl()/the /cdn route; it is not a foreign key to assets.key so a
-- banner can point at an object uploaded outside the assets metadata table.
-- ---------------------------------------------------------------------------
create table if not exists public.banners (
  id         uuid primary key default gen_random_uuid(),
  title      text        not null,
  asset_key  text        not null,
  link_url   text,
  active     boolean     not null default false,
  start_date timestamptz,
  end_date   timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists banners_set_updated_at on public.banners;
create trigger banners_set_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: same shape as content_blocks/assets — anon may read, writes go through
-- the service-role key, which bypasses RLS, so no write policies are granted.
-- ---------------------------------------------------------------------------
alter table public.banners enable row level security;

drop policy if exists banners_public_read on public.banners;
create policy banners_public_read
  on public.banners for select
  using (true);
