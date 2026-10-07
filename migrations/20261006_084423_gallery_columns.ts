import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."home_success_stories_cards" ADD COLUMN "season" varchar;
  ALTER TABLE "payload"."home_success_stories_cards" ADD COLUMN "name" varchar;
  ALTER TABLE "payload"."home_success_stories_cards" ADD COLUMN "detail" varchar;
  ALTER TABLE "payload"."_home_success_stories_v_version_cards" ADD COLUMN "season" varchar;
  ALTER TABLE "payload"."_home_success_stories_v_version_cards" ADD COLUMN "name" varchar;
  ALTER TABLE "payload"."_home_success_stories_v_version_cards" ADD COLUMN "detail" varchar;
  ALTER TABLE "payload"."home_testimonials_people" ADD COLUMN "name" varchar;
  ALTER TABLE "payload"."home_testimonials_people" ADD COLUMN "title" varchar;
  ALTER TABLE "payload"."home_testimonials_people" ADD COLUMN "description" varchar;
  ALTER TABLE "payload"."_home_testimonials_v_version_people" ADD COLUMN "name" varchar;
  ALTER TABLE "payload"."_home_testimonials_v_version_people" ADD COLUMN "title" varchar;
  ALTER TABLE "payload"."_home_testimonials_v_version_people" ADD COLUMN "description" varchar;
  ALTER TABLE "payload"."home_events_slides" ADD COLUMN "title" varchar;
  ALTER TABLE "payload"."home_events_slides" ADD COLUMN "tag" varchar;
  ALTER TABLE "payload"."home_events_slides" ADD COLUMN "desc" varchar;
  ALTER TABLE "payload"."home_events_slides" ADD COLUMN "quote" varchar;
  ALTER TABLE "payload"."home_events_slides" ADD COLUMN "speaker" varchar;
  ALTER TABLE "payload"."home_events_slides" ADD COLUMN "speaker_role" varchar;
  ALTER TABLE "payload"."home_events_slides" ADD COLUMN "logo" varchar;
  ALTER TABLE "payload"."home_events_slides" ADD COLUMN "poster" varchar;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD COLUMN "title" varchar;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD COLUMN "tag" varchar;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD COLUMN "desc" varchar;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD COLUMN "quote" varchar;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD COLUMN "speaker" varchar;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD COLUMN "speaker_role" varchar;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD COLUMN "logo" varchar;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD COLUMN "poster" varchar;
  ALTER TABLE "payload"."site_footer_logos" ADD COLUMN "name" varchar;
  ALTER TABLE "payload"."_site_footer_v_version_logos" ADD COLUMN "name" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."home_success_stories_cards" DROP COLUMN "season";
  ALTER TABLE "payload"."home_success_stories_cards" DROP COLUMN "name";
  ALTER TABLE "payload"."home_success_stories_cards" DROP COLUMN "detail";
  ALTER TABLE "payload"."_home_success_stories_v_version_cards" DROP COLUMN "season";
  ALTER TABLE "payload"."_home_success_stories_v_version_cards" DROP COLUMN "name";
  ALTER TABLE "payload"."_home_success_stories_v_version_cards" DROP COLUMN "detail";
  ALTER TABLE "payload"."home_testimonials_people" DROP COLUMN "name";
  ALTER TABLE "payload"."home_testimonials_people" DROP COLUMN "title";
  ALTER TABLE "payload"."home_testimonials_people" DROP COLUMN "description";
  ALTER TABLE "payload"."_home_testimonials_v_version_people" DROP COLUMN "name";
  ALTER TABLE "payload"."_home_testimonials_v_version_people" DROP COLUMN "title";
  ALTER TABLE "payload"."_home_testimonials_v_version_people" DROP COLUMN "description";
  ALTER TABLE "payload"."home_events_slides" DROP COLUMN "title";
  ALTER TABLE "payload"."home_events_slides" DROP COLUMN "tag";
  ALTER TABLE "payload"."home_events_slides" DROP COLUMN "desc";
  ALTER TABLE "payload"."home_events_slides" DROP COLUMN "quote";
  ALTER TABLE "payload"."home_events_slides" DROP COLUMN "speaker";
  ALTER TABLE "payload"."home_events_slides" DROP COLUMN "speaker_role";
  ALTER TABLE "payload"."home_events_slides" DROP COLUMN "logo";
  ALTER TABLE "payload"."home_events_slides" DROP COLUMN "poster";
  ALTER TABLE "payload"."_home_events_v_version_slides" DROP COLUMN "title";
  ALTER TABLE "payload"."_home_events_v_version_slides" DROP COLUMN "tag";
  ALTER TABLE "payload"."_home_events_v_version_slides" DROP COLUMN "desc";
  ALTER TABLE "payload"."_home_events_v_version_slides" DROP COLUMN "quote";
  ALTER TABLE "payload"."_home_events_v_version_slides" DROP COLUMN "speaker";
  ALTER TABLE "payload"."_home_events_v_version_slides" DROP COLUMN "speaker_role";
  ALTER TABLE "payload"."_home_events_v_version_slides" DROP COLUMN "logo";
  ALTER TABLE "payload"."_home_events_v_version_slides" DROP COLUMN "poster";
  ALTER TABLE "payload"."site_footer_logos" DROP COLUMN "name";
  ALTER TABLE "payload"."_site_footer_v_version_logos" DROP COLUMN "name";`)
}
