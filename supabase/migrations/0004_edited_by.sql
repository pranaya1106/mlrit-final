-- 0004_edited_by.sql
-- Track which admin account last wrote each row.
--
-- Nullable: rows created before this migration have no recorded editor, and
-- backfilling a guess would be worse than an honest null. The dashboard renders
-- those as "—".

alter table public.content_blocks add column if not exists edited_by text;
alter table public.banners        add column if not exists edited_by text;
