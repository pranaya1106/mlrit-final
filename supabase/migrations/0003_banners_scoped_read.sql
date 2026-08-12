-- 0003_banners_scoped_read.sql
-- Narrow the banners read policy to the live publication window.
--
-- The previous `using (true)` matched the pattern used by content_blocks and
-- assets, but banners carry their own notion of "not yet public": anyone
-- holding the anon key could read a draft or embargoed banner — its title,
-- link and asset key — before its start date. Scope the policy to rows that
-- are actually live. Writes still go through the service-role key, which
-- bypasses RLS, so the admin side keeps full visibility.

drop policy if exists banners_public_read on public.banners;
create policy banners_public_read
  on public.banners for select
  using (
    active
    and (start_date is null or start_date <= now())
    and (end_date is null or end_date >= now())
  );
