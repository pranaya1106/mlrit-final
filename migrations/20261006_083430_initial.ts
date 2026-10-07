import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Payload targets a dedicated `payload` schema (see payload.config.ts) so its
  // tables sit beside public.content_blocks rather than mixing with it, but the
  // generated migration never creates that schema — every CREATE TYPE below
  // then fails on a schema that does not exist. Created here rather than by
  // hand so a fresh database (staging, or RDS after the AWS move) comes up from
  // migrations alone.
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "payload";`)

  await db.execute(sql`
   CREATE TYPE "payload"."enum_users_sections" AS ENUM('home/hero', 'home/stats', 'home/achievements', 'home/programs', 'home/why-mlrit', 'home/success-stories', 'home/testimonials', 'home/events', 'home/placements', 'placements/track-record', 'placements/statistics', 'placements/mous', 'placements/support', 'placements/recruiters', 'iqac/aqar', 'iqac/best-practices', 'iqac/functions', 'iqac/objectives', 'iqac/overview', 'iqac/initiatives', 'iqac/support', 'iqac/reports', 'iqac/feedback', 'iqac/contact', 'iqac/nba', 'site/page-headers', 'info/pages', 'site/documents', 'examinations/annual-reports', 'examinations/certificates', 'examinations/circulars', 'examinations/citizen-charter', 'examinations/coe', 'examinations/contact', 'site/footer', 'about/overview', 'about/rankings-awards', 'about/vision-mission', 'academics/overview', 'admissions/b-category', 'admissions/fees', 'admissions/why-mlrit', 'chronicles/overview', 'departments/pg', 'departments/ug', 'examinations/downloads', 'examinations/fee-results', 'examinations/notifications', 'examinations/pyqs', 'examinations/regulations', 'examinations/student-verifications', 'examinations/timetable-external', 'examinations/timetable-internal', 'iqac/composition', 'iqac/naac', 'placements/drives', 'placements/global-certification', 'placements/industry-readiness', 'placements/overview', 'research/support', 'student-life/overview', 'admissions/overview', 'admissions/counselling', 'admissions/support', 'admissions/scholarships', 'admissions/by-degree', 'examinations/syllabus', 'placements/alumni', 'about/internal-governance', 'site/faculty-profile', 'site/research-profile', 'site/syllabus-regulation', 'site/syllabus-semester', 'admissions/policies');
  CREATE TYPE "payload"."enum_users_role" AS ENUM('owner', 'editor');
  CREATE TYPE "payload"."enum_home_hero_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_hero_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_home_stats_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_stats_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_home_achievements_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_achievements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_home_programs_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_programs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_home_why_mlrit_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_why_mlrit_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_home_success_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_success_stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_home_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_home_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_home_placements_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__home_placements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_track_record_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_track_record_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_statistics_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_statistics_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_mous_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_mous_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_support_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_support_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_recruiters_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_recruiters_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_aqar_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_aqar_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_best_practices_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_best_practices_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_functions_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_functions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_objectives_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_objectives_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_overview_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_overview_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_initiatives_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_initiatives_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_support_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_support_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_feedback_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_feedback_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_contact_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_contact_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_nba_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_nba_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_page_headers_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__site_page_headers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_info_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__info_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_documents_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__site_documents_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_annual_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_annual_reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_certificates_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_certificates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_circulars_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_circulars_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_citizen_charter_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_citizen_charter_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_coe_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_coe_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_contact_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_contact_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__site_footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_about_overview_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__about_overview_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_about_rankings_awards_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__about_rankings_awards_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_about_vision_mission_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__about_vision_mission_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_academics_overview_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__academics_overview_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_b_category_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_b_category_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_fees_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_fees_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_why_mlrit_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_why_mlrit_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_chronicles_overview_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__chronicles_overview_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_departments_pg_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__departments_pg_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_departments_ug_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__departments_ug_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_downloads_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_downloads_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_fee_results_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_fee_results_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_notifications_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_notifications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_pyqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_pyqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_regulations_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_regulations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_student_verifications_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_student_verifications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_timetable_external_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_timetable_external_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_timetable_internal_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_timetable_internal_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_composition_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_composition_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_iqac_naac_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__iqac_naac_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_drives_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_drives_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_global_certification_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_global_certification_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_industry_readiness_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_industry_readiness_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_overview_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_overview_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_research_support_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__research_support_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_student_life_overview_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__student_life_overview_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_overview_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_overview_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_counselling_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_counselling_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_support_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_support_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_scholarships_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_scholarships_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_by_degree_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_by_degree_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_examinations_syllabus_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__examinations_syllabus_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_placements_alumni_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__placements_alumni_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_about_internal_governance_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__about_internal_governance_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_faculty_profile_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__site_faculty_profile_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_research_profile_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__site_research_profile_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_syllabus_regulation_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__site_syllabus_regulation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_syllabus_semester_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__site_syllabus_semester_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_admissions_policies_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__admissions_policies_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."users_sections" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum_users_sections",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "payload"."enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."home_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline_lead" varchar DEFAULT 'Engineering',
  	"headline_accent" varchar DEFAULT 'the Future.',
  	"body" varchar DEFAULT 'Two decades of shaping minds. 11,000+ engineers and counting. At MLRIT, we don''t just teach the future — we build it.',
  	"film" varchar,
  	"poster" varchar,
  	"_status" "payload"."enum_home_hero_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_hero_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_headline_lead" varchar DEFAULT 'Engineering',
  	"version_headline_accent" varchar DEFAULT 'the Future.',
  	"version_body" varchar DEFAULT 'Two decades of shaping minds. 11,000+ engineers and counting. At MLRIT, we don''t just teach the future — we build it.',
  	"version_film" varchar,
  	"version_poster" varchar,
  	"version__status" "payload"."enum__home_hero_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."home_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"caption" varchar,
  	"footnote" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_home_stats_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_stats_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"target" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"caption" varchar,
  	"footnote" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_stats_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__home_stats_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."home_achievements_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"name" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_achievements_ranks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"tint" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_achievements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline_lead" varchar DEFAULT 'Accreditations',
  	"headline_accent" varchar DEFAULT 'and Approvals.',
  	"body" varchar DEFAULT 'AICTE, NAAC, NBA, ARIIA and more — MLRIT is recognised by every leading national body for academic excellence, programme quality and innovation.',
  	"_status" "payload"."enum_home_achievements_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_achievements_v_version_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"name" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_achievements_v_version_ranks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"tint" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_achievements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_headline_lead" varchar DEFAULT 'Accreditations',
  	"version_headline_accent" varchar DEFAULT 'and Approvals.',
  	"version_body" varchar DEFAULT 'AICTE, NAAC, NBA, ARIIA and more — MLRIT is recognised by every leading national body for academic excellence, programme quality and innovation.',
  	"version__status" "payload"."enum__home_achievements_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."home_programs_ug" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"dept" varchar,
  	"name" varchar,
  	"meta" varchar,
  	"desc" varchar,
  	"accent" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_programs_pg" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"dept" varchar,
  	"name" varchar,
  	"meta" varchar,
  	"desc" varchar,
  	"accent" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline_lead" varchar DEFAULT 'Find the programme',
  	"headline_accent" varchar DEFAULT 'built for you.',
  	"body" varchar DEFAULT 'Scroll through every UG and PG programme — each card stacks into view, revealing the next.',
  	"_status" "payload"."enum_home_programs_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_programs_v_version_ug" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"dept" varchar,
  	"name" varchar,
  	"meta" varchar,
  	"desc" varchar,
  	"accent" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_programs_v_version_pg" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"dept" varchar,
  	"name" varchar,
  	"meta" varchar,
  	"desc" varchar,
  	"accent" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_programs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_headline_lead" varchar DEFAULT 'Find the programme',
  	"version_headline_accent" varchar DEFAULT 'built for you.',
  	"version_body" varchar DEFAULT 'Scroll through every UG and PG programme — each card stacks into view, revealing the next.',
  	"version__status" "payload"."enum__home_programs_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."home_why_mlrit" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline_lead" varchar DEFAULT 'Industry.',
  	"headline_accent" varchar DEFAULT 'Integrated.',
  	"headline_tail" varchar DEFAULT 'Blended with sport.',
  	"body" varchar DEFAULT 'An integrated curriculum that gives equal weight to academics, employable skills, and sport.',
  	"footnote" varchar DEFAULT 'Founded in **2005** by the KMR Education Trust, headed by **Mr. Marri Laxman Reddy**. Located in Dundigal, Hyderabad. Affiliated to JNTUH. Granted autonomous status by the UGC in 2015.',
  	"video" varchar,
  	"_status" "payload"."enum_home_why_mlrit_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_why_mlrit_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_headline_lead" varchar DEFAULT 'Industry.',
  	"version_headline_accent" varchar DEFAULT 'Integrated.',
  	"version_headline_tail" varchar DEFAULT 'Blended with sport.',
  	"version_body" varchar DEFAULT 'An integrated curriculum that gives equal weight to academics, employable skills, and sport.',
  	"version_footnote" varchar DEFAULT 'Founded in **2005** by the KMR Education Trust, headed by **Mr. Marri Laxman Reddy**. Located in Dundigal, Hyderabad. Affiliated to JNTUH. Granted autonomous status by the UGC in 2015.',
  	"version_video" varchar,
  	"version__status" "payload"."enum__home_why_mlrit_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."home_success_stories_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_success_stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Wall of Achievements',
  	"heading_lead" varchar DEFAULT 'Building Real Careers,',
  	"heading_accent" varchar DEFAULT 'Not Just Degrees.',
  	"body" varchar DEFAULT 'Real placements, real achievements — MLRIT students on the biggest campus stages and the country''s top recruiters.',
  	"_status" "payload"."enum_home_success_stories_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_success_stories_v_version_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_success_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_eyebrow" varchar DEFAULT 'Wall of Achievements',
  	"version_heading_lead" varchar DEFAULT 'Building Real Careers,',
  	"version_heading_accent" varchar DEFAULT 'Not Just Degrees.',
  	"version_body" varchar DEFAULT 'Real placements, real achievements — MLRIT students on the biggest campus stages and the country''s top recruiters.',
  	"version__status" "payload"."enum__home_success_stories_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."home_testimonials_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Alumni Voices',
  	"heading_lead" varchar DEFAULT 'What Our',
  	"heading_accent" varchar DEFAULT 'Graduates Say.',
  	"body" varchar DEFAULT 'Five MLRIT alumni — five different paths, one shared starting line.',
  	"_status" "payload"."enum_home_testimonials_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_testimonials_v_version_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_eyebrow" varchar DEFAULT 'Alumni Voices',
  	"version_heading_lead" varchar DEFAULT 'What Our',
  	"version_heading_accent" varchar DEFAULT 'Graduates Say.',
  	"version_body" varchar DEFAULT 'Five MLRIT alumni — five different paths, one shared starting line.',
  	"version__status" "payload"."enum__home_testimonials_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."home_events_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_home_events_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_events_v_version_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__home_events_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."home_placements_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"note" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."home_placements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"highest" varchar DEFAULT '44',
  	"highest_unit" varchar DEFAULT 'LPA',
  	"_status" "payload"."enum_home_placements_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_home_placements_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"note" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_home_placements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_highest" varchar DEFAULT '44',
  	"version_highest_unit" varchar DEFAULT 'LPA',
  	"version__status" "payload"."enum__home_placements_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_track_record_years" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"academic_year" varchar,
  	"job_offers" numeric,
  	"companies_visited" numeric,
  	"highest_package_lpa" numeric,
  	"provisional" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."placements_track_record_companies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"company" varchar,
  	"role" varchar,
  	"salary_display" varchar,
  	"selected" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."placements_track_record" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_placements_track_record_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_track_record_v_version_years" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"academic_year" varchar,
  	"job_offers" numeric,
  	"companies_visited" numeric,
  	"highest_package_lpa" numeric,
  	"provisional" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_placements_track_record_v_version_companies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"company" varchar,
  	"role" varchar,
  	"salary_display" varchar,
  	"selected" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_placements_track_record_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__placements_track_record_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_statistics_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."placements_statistics_infrastructure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."placements_statistics_infra_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"label" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."placements_statistics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nav_label" varchar DEFAULT 'Statistics',
  	"infra_eyebrow" varchar DEFAULT 'Facilities',
  	"infra_heading_lead" varchar DEFAULT 'Placement',
  	"infra_heading_italic" varchar DEFAULT 'infrastructure.',
  	"infra_body" varchar DEFAULT 'MLRIT maintains a dedicated placement block equipped to host large-scale campus recruitment drives throughout the year.',
  	"_status" "payload"."enum_placements_statistics_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_statistics_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_placements_statistics_v_version_infrastructure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_placements_statistics_v_version_infra_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"label" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_placements_statistics_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_nav_label" varchar DEFAULT 'Statistics',
  	"version_infra_eyebrow" varchar DEFAULT 'Facilities',
  	"version_infra_heading_lead" varchar DEFAULT 'Placement',
  	"version_infra_heading_italic" varchar DEFAULT 'infrastructure.',
  	"version_infra_body" varchar DEFAULT 'MLRIT maintains a dedicated placement block equipped to host large-scale campus recruitment drives throughout the year.',
  	"version__status" "payload"."enum__placements_statistics_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_mous_mous" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"domain" varchar,
  	"package" varchar,
  	"type" varchar,
  	"doc_label" varchar,
  	"doc_file" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."placements_mous" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"coe" varchar DEFAULT 'CoE',
  	"mou" varchar DEFAULT 'MoU',
  	"centres_of" varchar DEFAULT 'Centres of',
  	"mou2" varchar DEFAULT 'MoU',
  	"excellence" varchar DEFAULT 'Excellence.',
  	"on_campus" varchar DEFAULT 'On-Campus',
  	"strategic" varchar DEFAULT 'Strategic',
  	"partners" varchar DEFAULT 'Partners.',
  	"_status" "payload"."enum_placements_mous_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_mous_v_version_mous" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"domain" varchar,
  	"package" varchar,
  	"type" varchar,
  	"doc_label" varchar,
  	"doc_file" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_placements_mous_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_coe" varchar DEFAULT 'CoE',
  	"version_mou" varchar DEFAULT 'MoU',
  	"version_centres_of" varchar DEFAULT 'Centres of',
  	"version_mou2" varchar DEFAULT 'MoU',
  	"version_excellence" varchar DEFAULT 'Excellence.',
  	"version_on_campus" varchar DEFAULT 'On-Campus',
  	"version_strategic" varchar DEFAULT 'Strategic',
  	"version_partners" varchar DEFAULT 'Partners.',
  	"version__status" "payload"."enum__placements_mous_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_support_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"designation" varchar,
  	"phones" varchar,
  	"email" varchar,
  	"purpose" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."placements_support" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"medchal_malkajgiri_telangana500" varchar DEFAULT 'Medchal Malkajgiri, Telangana – 500 043',
  	"survey_no444_dundigal" varchar DEFAULT 'Survey No. 444, Dundigal, Gandi Maisamma',
  	"call919849991299" varchar DEFAULT 'Call +91 98499 91299',
  	"eapcet_code_mlid" varchar DEFAULT 'EAPCET Code · MLID',
  	"email_t_p_cell" varchar DEFAULT 'Email T&P Cell',
  	"mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"t_p_cell_ground" varchar DEFAULT 'T&P Cell — Ground Floor, Main Block',
  	"office_location" varchar DEFAULT 'Office Location',
  	"_status" "payload"."enum_placements_support_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_support_v_version_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"designation" varchar,
  	"phones" varchar,
  	"email" varchar,
  	"purpose" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_placements_support_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_medchal_malkajgiri_telangana500" varchar DEFAULT 'Medchal Malkajgiri, Telangana – 500 043',
  	"version_survey_no444_dundigal" varchar DEFAULT 'Survey No. 444, Dundigal, Gandi Maisamma',
  	"version_call919849991299" varchar DEFAULT 'Call +91 98499 91299',
  	"version_eapcet_code_mlid" varchar DEFAULT 'EAPCET Code · MLID',
  	"version_email_t_p_cell" varchar DEFAULT 'Email T&P Cell',
  	"version_mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"version_t_p_cell_ground" varchar DEFAULT 'T&P Cell — Ground Floor, Main Block',
  	"version_office_location" varchar DEFAULT 'Office Location',
  	"version__status" "payload"."enum__placements_support_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_recruiters_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"name" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."placements_recruiters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_placements_recruiters_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_recruiters_v_version_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"name" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_placements_recruiters_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__placements_recruiters_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_aqar_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"val" varchar,
  	"sub" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_aqar_reports" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"file" varchar,
  	"available" varchar,
  	"latest" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_aqar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"download_pdf" varchar DEFAULT 'Download PDF',
  	"latest" varchar DEFAULT 'Latest',
  	"contact_iqac_office" varchar DEFAULT 'Contact IQAC Office',
  	"about_heading" varchar DEFAULT 'About AQAR',
  	"about_body1" varchar DEFAULT 'The Annual Quality Assurance Report (AQAR) is a yearly report prepared and submitted by MLRIT''s Internal Quality Assurance Cell (IQAC) to NAAC. It documents the quality initiatives undertaken, academic outcomes achieved and improvements made during the academic year.',
  	"about_body2" varchar DEFAULT 'AQAR submission is a mandatory requirement for all NAAC-accredited institutions and forms a key part of the continuous quality assessment process. It covers curriculum, teaching-learning, research, infrastructure, student support and governance.',
  	"reports_heading" varchar DEFAULT 'AQAR Reports',
  	"reports_lede" varchar DEFAULT 'Annual Quality Assurance Reports for each academic year. Click to download the PDF.',
  	"_status" "payload"."enum_iqac_aqar_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_aqar_v_version_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"val" varchar,
  	"sub" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_aqar_v_version_reports" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"file" varchar,
  	"available" varchar,
  	"latest" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_aqar_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"version_download_pdf" varchar DEFAULT 'Download PDF',
  	"version_latest" varchar DEFAULT 'Latest',
  	"version_contact_iqac_office" varchar DEFAULT 'Contact IQAC Office',
  	"version_about_heading" varchar DEFAULT 'About AQAR',
  	"version_about_body1" varchar DEFAULT 'The Annual Quality Assurance Report (AQAR) is a yearly report prepared and submitted by MLRIT''s Internal Quality Assurance Cell (IQAC) to NAAC. It documents the quality initiatives undertaken, academic outcomes achieved and improvements made during the academic year.',
  	"version_about_body2" varchar DEFAULT 'AQAR submission is a mandatory requirement for all NAAC-accredited institutions and forms a key part of the continuous quality assessment process. It covers curriculum, teaching-learning, research, infrastructure, student support and governance.',
  	"version_reports_heading" varchar DEFAULT 'AQAR Reports',
  	"version_reports_lede" varchar DEFAULT 'Annual Quality Assurance Reports for each academic year. Click to download the PDF.',
  	"version__status" "payload"."enum__iqac_aqar_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_best_practices_practices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"n" varchar,
  	"t" varchar,
  	"d" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_best_practices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_iqac_best_practices_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_best_practices_v_version_practices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"n" varchar,
  	"t" varchar,
  	"d" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_best_practices_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__iqac_best_practices_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_functions_functions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_functions_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"n" varchar,
  	"label" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_functions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"the_quality_assurance_process" varchar DEFAULT 'The quality assurance process is participative, involving all stakeholders, including management, faculty, students, alumni, employers, parents, and industry experts.',
  	"methodology_and_aligns_institutional" varchar DEFAULT 'methodology and aligns institutional quality initiatives with the requirements of NAAC, NBA, AICTE, UGC, JNTUH, NIRF, AISHE, and other statutory and regulatory bodies.',
  	"the_iqac_follows_the" varchar DEFAULT 'The IQAC follows the',
  	"iqac_quality_assurance_process" varchar DEFAULT 'IQAC Quality Assurance Process',
  	"iqac_process_flow" varchar DEFAULT 'IQAC Process Flow',
  	"key_functions" varchar DEFAULT 'Key Functions',
  	"_status" "payload"."enum_iqac_functions_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_functions_v_version_functions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_functions_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"n" varchar,
  	"label" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_functions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_the_quality_assurance_process" varchar DEFAULT 'The quality assurance process is participative, involving all stakeholders, including management, faculty, students, alumni, employers, parents, and industry experts.',
  	"version_methodology_and_aligns_institutional" varchar DEFAULT 'methodology and aligns institutional quality initiatives with the requirements of NAAC, NBA, AICTE, UGC, JNTUH, NIRF, AISHE, and other statutory and regulatory bodies.',
  	"version_the_iqac_follows_the" varchar DEFAULT 'The IQAC follows the',
  	"version_iqac_quality_assurance_process" varchar DEFAULT 'IQAC Quality Assurance Process',
  	"version_iqac_process_flow" varchar DEFAULT 'IQAC Process Flow',
  	"version_key_functions" varchar DEFAULT 'Key Functions',
  	"version__status" "payload"."enum__iqac_functions_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_objectives_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"n" varchar,
  	"t" varchar,
  	"d" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_objectives_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_objectives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"driving_excellence_through_continuous" varchar DEFAULT 'Driving Excellence through Continuous Quality Enhancement — by integrating quality benchmarks into all institutional processes, IQAC ensures that every academic and administrative activity contributes to sustainable growth, stakeholder satisfaction, and national and international recognition.',
  	"the_institute_strives_to" varchar DEFAULT 'The Institute strives to continuously enhance academic and administrative processes by adopting transparent governance, learner-centric education, industry engagement, digital transformation, and evidence-based decision-making to produce competent professionals and responsible citizens.',
  	"committed_to_academic_excellence" varchar DEFAULT 'Committed to Academic Excellence and Continuous Improvement',
  	"quality_policy_statement_the" varchar DEFAULT 'Quality Policy Statement — The Institution is committed to:',
  	"strategic_goals_of_iqac" varchar DEFAULT 'Strategic Goals of IQAC',
  	"quality_policy" varchar DEFAULT 'Quality Policy',
  	"_status" "payload"."enum_iqac_objectives_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_objectives_v_version_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"n" varchar,
  	"t" varchar,
  	"d" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_objectives_v_version_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_objectives_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_driving_excellence_through_continuous" varchar DEFAULT 'Driving Excellence through Continuous Quality Enhancement — by integrating quality benchmarks into all institutional processes, IQAC ensures that every academic and administrative activity contributes to sustainable growth, stakeholder satisfaction, and national and international recognition.',
  	"version_the_institute_strives_to" varchar DEFAULT 'The Institute strives to continuously enhance academic and administrative processes by adopting transparent governance, learner-centric education, industry engagement, digital transformation, and evidence-based decision-making to produce competent professionals and responsible citizens.',
  	"version_committed_to_academic_excellence" varchar DEFAULT 'Committed to Academic Excellence and Continuous Improvement',
  	"version_quality_policy_statement_the" varchar DEFAULT 'Quality Policy Statement — The Institution is committed to:',
  	"version_strategic_goals_of_iqac" varchar DEFAULT 'Strategic Goals of IQAC',
  	"version_quality_policy" varchar DEFAULT 'Quality Policy',
  	"version__status" "payload"."enum__iqac_objectives_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_overview_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_overview_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_overview_frameworks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"label" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_overview" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"the_internal_quality_assurance" varchar DEFAULT 'The Internal Quality Assurance Cell (IQAC) serves as the quality sustenance and enhancement mechanism of the institution. Established in accordance with the guidelines of the National Assessment and Accreditation Council (NAAC), IQAC promotes a culture of quality through systematic planning, monitoring, documentation, and continuous improvement of academic and administrative processes.',
  	"the_iqac_acts_as" varchar DEFAULT 'The IQAC acts as a catalyst for institutional excellence by encouraging innovation, outcome-based education, digital transformation, stakeholder participation, and evidence-based decision making. It coordinates quality initiatives aligned with NAAC, NBA, NIRF, AISHE, UGC, AICTE, and other regulatory frameworks to ensure holistic institutional development.',
  	"through_continuous_monitoring_and" varchar DEFAULT 'Through continuous monitoring and periodic reviews, IQAC strengthens teaching-learning processes, research, extension activities, governance, infrastructure, and student support systems, thereby contributing to the realization of the institution''s vision and mission.',
  	"to_nurture_a_culture" varchar DEFAULT 'To nurture a culture of continuous quality enhancement and innovation that transforms MLR Institute of Technology into a globally recognized institution of academic excellence, research, innovation, and societal impact.',
  	"quality_is_not_an" varchar DEFAULT '“Quality is not an event; it is a continuous journey towards excellence.”',
  	"iqac_aligns_institutional_activities" varchar DEFAULT 'IQAC aligns institutional activities with the following quality frameworks:',
  	"institutional_quality_framework" varchar DEFAULT 'Institutional Quality Framework',
  	"our_commitment_to_quality" varchar DEFAULT 'Our Commitment to Quality',
  	"iqac_is_committed_to" varchar DEFAULT 'IQAC is committed to:',
  	"vision_mission" varchar DEFAULT 'Vision & Mission',
  	"about_iqac" varchar DEFAULT 'About IQAC',
  	"iqac_motto" varchar DEFAULT 'IQAC Motto',
  	"framework" varchar DEFAULT 'Framework',
  	"full_name" varchar DEFAULT 'Full Name',
  	"mission_heading" varchar DEFAULT 'Mission',
  	"vision" varchar DEFAULT 'Vision',
  	"_status" "payload"."enum_iqac_overview_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_overview_v_version_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_overview_v_version_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_overview_v_version_frameworks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"label" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_overview_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_the_internal_quality_assurance" varchar DEFAULT 'The Internal Quality Assurance Cell (IQAC) serves as the quality sustenance and enhancement mechanism of the institution. Established in accordance with the guidelines of the National Assessment and Accreditation Council (NAAC), IQAC promotes a culture of quality through systematic planning, monitoring, documentation, and continuous improvement of academic and administrative processes.',
  	"version_the_iqac_acts_as" varchar DEFAULT 'The IQAC acts as a catalyst for institutional excellence by encouraging innovation, outcome-based education, digital transformation, stakeholder participation, and evidence-based decision making. It coordinates quality initiatives aligned with NAAC, NBA, NIRF, AISHE, UGC, AICTE, and other regulatory frameworks to ensure holistic institutional development.',
  	"version_through_continuous_monitoring_and" varchar DEFAULT 'Through continuous monitoring and periodic reviews, IQAC strengthens teaching-learning processes, research, extension activities, governance, infrastructure, and student support systems, thereby contributing to the realization of the institution''s vision and mission.',
  	"version_to_nurture_a_culture" varchar DEFAULT 'To nurture a culture of continuous quality enhancement and innovation that transforms MLR Institute of Technology into a globally recognized institution of academic excellence, research, innovation, and societal impact.',
  	"version_quality_is_not_an" varchar DEFAULT '“Quality is not an event; it is a continuous journey towards excellence.”',
  	"version_iqac_aligns_institutional_activities" varchar DEFAULT 'IQAC aligns institutional activities with the following quality frameworks:',
  	"version_institutional_quality_framework" varchar DEFAULT 'Institutional Quality Framework',
  	"version_our_commitment_to_quality" varchar DEFAULT 'Our Commitment to Quality',
  	"version_iqac_is_committed_to" varchar DEFAULT 'IQAC is committed to:',
  	"version_vision_mission" varchar DEFAULT 'Vision & Mission',
  	"version_about_iqac" varchar DEFAULT 'About IQAC',
  	"version_iqac_motto" varchar DEFAULT 'IQAC Motto',
  	"version_framework" varchar DEFAULT 'Framework',
  	"version_full_name" varchar DEFAULT 'Full Name',
  	"version_mission_heading" varchar DEFAULT 'Mission',
  	"version_vision" varchar DEFAULT 'Vision',
  	"version__status" "payload"."enum__iqac_overview_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_initiatives_initiatives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_initiatives_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_initiatives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"the_iqac_actively_coordinates" varchar DEFAULT 'The IQAC actively coordinates institutional initiatives in the following areas to ensure holistic institutional development:',
  	"the_iqac_acts_as" varchar DEFAULT 'The IQAC acts as the institutional quality catalyst by:',
  	"major_quality_initiatives" varchar DEFAULT 'Major Quality Initiatives',
  	"key_responsibilities" varchar DEFAULT 'Key Responsibilities',
  	"_status" "payload"."enum_iqac_initiatives_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_initiatives_v_version_initiatives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_initiatives_v_version_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_initiatives_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_the_iqac_actively_coordinates" varchar DEFAULT 'The IQAC actively coordinates institutional initiatives in the following areas to ensure holistic institutional development:',
  	"version_the_iqac_acts_as" varchar DEFAULT 'The IQAC acts as the institutional quality catalyst by:',
  	"version_major_quality_initiatives" varchar DEFAULT 'Major Quality Initiatives',
  	"version_key_responsibilities" varchar DEFAULT 'Key Responsibilities',
  	"version__status" "payload"."enum__iqac_initiatives_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_support_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"phone" varchar,
  	"toll_free" varchar,
  	"email" varchar,
  	"purpose" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_support" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"medchal_malkajgiri_telangana500" varchar DEFAULT 'Medchal Malkajgiri, Telangana – 500 043',
  	"survey_no444_dundigal" varchar DEFAULT 'Survey No. 444, Dundigal, Gandi Maisamma',
  	"email_iqac_office" varchar DEFAULT 'Email IQAC Office',
  	"mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"iqac_office_administrative_block" varchar DEFAULT 'IQAC Office — Administrative Block',
  	"phone_to_be_updated" varchar DEFAULT 'Phone — To be updated',
  	"office_location" varchar DEFAULT 'Office Location',
  	"_status" "payload"."enum_iqac_support_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_support_v_version_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"phone" varchar,
  	"toll_free" varchar,
  	"email" varchar,
  	"purpose" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_support_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_medchal_malkajgiri_telangana500" varchar DEFAULT 'Medchal Malkajgiri, Telangana – 500 043',
  	"version_survey_no444_dundigal" varchar DEFAULT 'Survey No. 444, Dundigal, Gandi Maisamma',
  	"version_email_iqac_office" varchar DEFAULT 'Email IQAC Office',
  	"version_mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"version_iqac_office_administrative_block" varchar DEFAULT 'IQAC Office — Administrative Block',
  	"version_phone_to_be_updated" varchar DEFAULT 'Phone — To be updated',
  	"version_office_location" varchar DEFAULT 'Office Location',
  	"version__status" "payload"."enum__iqac_support_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_reports_aqar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"tag" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_reports_minutes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"tag" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_reports_other" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"tag" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_to_be_updated" varchar DEFAULT 'Content to be updated.',
  	"policy_documents" varchar DEFAULT 'Policy Documents',
  	"audit_reports" varchar DEFAULT 'Audit Reports',
  	"aqar_reports" varchar DEFAULT 'AQAR Reports',
  	"minutes_heading" varchar DEFAULT 'Minutes',
  	"open" varchar DEFAULT 'Open →',
  	"_status" "payload"."enum_iqac_reports_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_reports_v_version_aqar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"tag" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_reports_v_version_minutes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"tag" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_reports_v_version_other" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"tag" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_reports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_content_to_be_updated" varchar DEFAULT 'Content to be updated.',
  	"version_policy_documents" varchar DEFAULT 'Policy Documents',
  	"version_audit_reports" varchar DEFAULT 'Audit Reports',
  	"version_aqar_reports" varchar DEFAULT 'AQAR Reports',
  	"version_minutes_heading" varchar DEFAULT 'Minutes',
  	"version_open" varchar DEFAULT 'Open →',
  	"version__status" "payload"."enum__iqac_reports_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_feedback_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"desc" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_feedback" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_iqac_feedback_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_feedback_v_version_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"desc" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_feedback_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__iqac_feedback_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_contact_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"for_questions_related_to" varchar DEFAULT 'For questions related to accreditation, quality assurance reports, feedback forms or IQAC activities, write to us directly or visit the IQAC office during working hours.',
  	"email_iqac" varchar DEFAULT 'Email IQAC →',
  	"contact_details" varchar DEFAULT 'Contact Details',
  	"send_a_query" varchar DEFAULT 'Send a Query',
  	"send_query" varchar DEFAULT 'Send Query',
  	"_status" "payload"."enum_iqac_contact_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_contact_v_version_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_contact_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_for_questions_related_to" varchar DEFAULT 'For questions related to accreditation, quality assurance reports, feedback forms or IQAC activities, write to us directly or visit the IQAC office during working hours.',
  	"version_email_iqac" varchar DEFAULT 'Email IQAC →',
  	"version_contact_details" varchar DEFAULT 'Contact Details',
  	"version_send_a_query" varchar DEFAULT 'Send a Query',
  	"version_send_query" varchar DEFAULT 'Send Query',
  	"version__status" "payload"."enum__iqac_contact_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_nba_programmes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dept" varchar,
  	"code" varchar,
  	"cycle" varchar,
  	"status" varchar,
  	"dcp" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."iqac_nba" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"the_following_b_tech" varchar DEFAULT 'The following B.Tech programmes at MLRIT are currently accredited by the National Board of Accreditation under the Tier-1 framework.',
  	"download" varchar DEFAULT 'Download',
  	"download_pdf" varchar DEFAULT 'Download PDF',
  	"accreditation_cycle" varchar DEFAULT 'Accreditation Cycle',
  	"accredited" varchar DEFAULT 'Accredited',
  	"programme" varchar DEFAULT 'Programme',
  	"status" varchar DEFAULT 'Status',
  	"about" varchar DEFAULT 'About',
  	"_status" "payload"."enum_iqac_nba_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_nba_v_version_programmes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"dept" varchar,
  	"code" varchar,
  	"cycle" varchar,
  	"status" varchar,
  	"dcp" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_iqac_nba_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_the_following_b_tech" varchar DEFAULT 'The following B.Tech programmes at MLRIT are currently accredited by the National Board of Accreditation under the Tier-1 framework.',
  	"version_download" varchar DEFAULT 'Download',
  	"version_download_pdf" varchar DEFAULT 'Download PDF',
  	"version_accreditation_cycle" varchar DEFAULT 'Accreditation Cycle',
  	"version_accredited" varchar DEFAULT 'Accredited',
  	"version_programme" varchar DEFAULT 'Programme',
  	"version_status" varchar DEFAULT 'Status',
  	"version_about" varchar DEFAULT 'About',
  	"version__status" "payload"."enum__iqac_nba_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."site_page_headers_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"italic" varchar,
  	"dek" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."site_page_headers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_site_page_headers_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_site_page_headers_v_version_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"italic" varchar,
  	"dek" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_site_page_headers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__site_page_headers_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."info_pages_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"italic" varchar,
  	"dek" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."info_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_info_pages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_info_pages_v_version_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"italic" varchar,
  	"dek" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_info_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__info_pages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."site_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brochure" varchar,
  	"brochure_label" varchar DEFAULT 'Download Brochure',
  	"_status" "payload"."enum_site_documents_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_site_documents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_brochure" varchar,
  	"version_brochure_label" varchar DEFAULT 'Download Brochure',
  	"version__status" "payload"."enum__site_documents_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_annual_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"latest" varchar DEFAULT 'Latest',
  	"contact_us" varchar DEFAULT 'Contact Us',
  	"examination_reports" varchar DEFAULT 'examination reports.',
  	"reports" varchar DEFAULT 'Reports',
  	"_status" "payload"."enum_examinations_annual_reports_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_annual_reports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"version_latest" varchar DEFAULT 'Latest',
  	"version_contact_us" varchar DEFAULT 'Contact Us',
  	"version_examination_reports" varchar DEFAULT 'examination reports.',
  	"version_reports" varchar DEFAULT 'Reports',
  	"version__status" "payload"."enum__examinations_annual_reports_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_certificates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_label" varchar DEFAULT 'View Form',
  	"download_label" varchar DEFAULT 'Download Form',
  	"attach_supporting_documents_and" varchar DEFAULT '. Attach supporting documents and proof of fee payment where applicable.',
  	"coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"contact_coe_office" varchar DEFAULT 'Contact COE Office →',
  	"available_documents" varchar DEFAULT 'Available Documents',
  	"application_form" varchar DEFAULT 'application form.',
  	"start_here" varchar DEFAULT 'Start Here',
  	"_status" "payload"."enum_examinations_certificates_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_certificates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_label" varchar DEFAULT 'View Form',
  	"version_download_label" varchar DEFAULT 'Download Form',
  	"version_attach_supporting_documents_and" varchar DEFAULT '. Attach supporting documents and proof of fee payment where applicable.',
  	"version_coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"version_contact_coe_office" varchar DEFAULT 'Contact COE Office →',
  	"version_available_documents" varchar DEFAULT 'Available Documents',
  	"version_application_form" varchar DEFAULT 'application form.',
  	"version_start_here" varchar DEFAULT 'Start Here',
  	"version__status" "payload"."enum__examinations_certificates_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_circulars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_label" varchar DEFAULT 'View',
  	"download_label" varchar DEFAULT 'Download',
  	"all_documents_below_are" varchar DEFAULT 'All documents below are hosted locally. Use View to open in-browser or Download to save a copy.',
  	"coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"contact_us" varchar DEFAULT 'Contact Us',
  	"recent" varchar DEFAULT 'Recent',
  	"circulars" varchar DEFAULT 'circulars.',
  	"_status" "payload"."enum_examinations_circulars_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_circulars_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_label" varchar DEFAULT 'View',
  	"version_download_label" varchar DEFAULT 'Download',
  	"version_all_documents_below_are" varchar DEFAULT 'All documents below are hosted locally. Use View to open in-browser or Download to save a copy.',
  	"version_coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"version_contact_us" varchar DEFAULT 'Contact Us',
  	"version_recent" varchar DEFAULT 'Recent',
  	"version_circulars" varchar DEFAULT 'circulars.',
  	"version__status" "payload"."enum__examinations_circulars_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_citizen_charter" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_label" varchar DEFAULT 'View PDF',
  	"download_label" varchar DEFAULT 'Download PDF',
  	"the_citizen_charter_commits" varchar DEFAULT 'The Citizen Charter commits the Controller of Examinations office to delivering services within defined timelines. It also outlines the grievance redressal procedure for unresolved complaints.',
  	"coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"contact_coe_office" varchar DEFAULT 'Contact COE Office →',
  	"grievance_redressal" varchar DEFAULT 'Grievance Redressal',
  	"service_standards" varchar DEFAULT 'Service Standards',
  	"service_timelines" varchar DEFAULT 'Service Timelines',
  	"expect_from_us" varchar DEFAULT 'expect from us.',
  	"_status" "payload"."enum_examinations_citizen_charter_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_citizen_charter_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_label" varchar DEFAULT 'View PDF',
  	"version_download_label" varchar DEFAULT 'Download PDF',
  	"version_the_citizen_charter_commits" varchar DEFAULT 'The Citizen Charter commits the Controller of Examinations office to delivering services within defined timelines. It also outlines the grievance redressal procedure for unresolved complaints.',
  	"version_coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"version_contact_coe_office" varchar DEFAULT 'Contact COE Office →',
  	"version_grievance_redressal" varchar DEFAULT 'Grievance Redressal',
  	"version_service_standards" varchar DEFAULT 'Service Standards',
  	"version_service_timelines" varchar DEFAULT 'Service Timelines',
  	"version_expect_from_us" varchar DEFAULT 'expect from us.',
  	"version__status" "payload"."enum__examinations_citizen_charter_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_coe" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_label" varchar DEFAULT 'View Profile',
  	"download_label" varchar DEFAULT 'Download Profile',
  	"a_ugc_autonomous_institution" varchar DEFAULT 'A UGC-autonomous institution designing its own regulations, grading norms and academic policies — aligned with Outcome-Based Education and NEP 2020.',
  	"the_coe_office_ensures" varchar DEFAULT 'The COE office ensures transparency, consistency and integrity across all programmes — from timetable notification to final grade cards.',
  	"examination_framework" varchar DEFAULT 'examination framework.',
  	"contact_the_coe_office" varchar DEFAULT 'Contact the COE Office →',
  	"autonomous_since2015" varchar DEFAULT 'Autonomous Since 2015',
  	"coe_office_does" varchar DEFAULT 'COE office does.',
  	"milestones" varchar DEFAULT 'milestones.',
  	"functions" varchar DEFAULT 'Functions',
  	"timeline" varchar DEFAULT 'Timeline',
  	"_status" "payload"."enum_examinations_coe_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_coe_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_label" varchar DEFAULT 'View Profile',
  	"version_download_label" varchar DEFAULT 'Download Profile',
  	"version_a_ugc_autonomous_institution" varchar DEFAULT 'A UGC-autonomous institution designing its own regulations, grading norms and academic policies — aligned with Outcome-Based Education and NEP 2020.',
  	"version_the_coe_office_ensures" varchar DEFAULT 'The COE office ensures transparency, consistency and integrity across all programmes — from timetable notification to final grade cards.',
  	"version_examination_framework" varchar DEFAULT 'examination framework.',
  	"version_contact_the_coe_office" varchar DEFAULT 'Contact the COE Office →',
  	"version_autonomous_since2015" varchar DEFAULT 'Autonomous Since 2015',
  	"version_coe_office_does" varchar DEFAULT 'COE office does.',
  	"version_milestones" varchar DEFAULT 'milestones.',
  	"version_functions" varchar DEFAULT 'Functions',
  	"version_timeline" varchar DEFAULT 'Timeline',
  	"version__status" "payload"."enum__examinations_coe_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"medchal_malkajgiri_telangana500" varchar DEFAULT 'Medchal Malkajgiri, Telangana – 500 043',
  	"survey_no444_dundigal" varchar DEFAULT 'Survey No. 444, Dundigal, Gandi Maisamma',
  	"open_exam_portal" varchar DEFAULT 'Open Exam Portal ↗',
  	"email_coe_office" varchar DEFAULT 'Email COE Office',
  	"mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"coe_office_administrative_block" varchar DEFAULT 'COE Office — Administrative Block',
  	"office_location" varchar DEFAULT 'Office Location',
  	"_status" "payload"."enum_examinations_contact_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_contact_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_medchal_malkajgiri_telangana500" varchar DEFAULT 'Medchal Malkajgiri, Telangana – 500 043',
  	"version_survey_no444_dundigal" varchar DEFAULT 'Survey No. 444, Dundigal, Gandi Maisamma',
  	"version_open_exam_portal" varchar DEFAULT 'Open Exam Portal ↗',
  	"version_email_coe_office" varchar DEFAULT 'Email COE Office',
  	"version_mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"version_coe_office_administrative_block" varchar DEFAULT 'COE Office — Administrative Block',
  	"version_office_location" varchar DEFAULT 'Office Location',
  	"version__status" "payload"."enum__examinations_contact_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."site_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"head" varchar,
  	"label" varchar,
  	"href" varchar,
  	"external" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."site_footer_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."site_footer_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"item_id" varchar
  );
  
  CREATE TABLE "payload"."site_footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"watermark" varchar DEFAULT 'MLRIT',
  	"crafted_lead" varchar DEFAULT 'Crafted with passion by ',
  	"crafted_name" varchar DEFAULT 'The Students',
  	"crafted_tail" varchar DEFAULT ' of MLRIT',
  	"copyright" varchar DEFAULT '© 2026 KMR Educational Society',
  	"disclosures_label" varchar DEFAULT 'Disclosures',
  	"disclosures_href" varchar DEFAULT 'https://mlrit.ac.in/mandatory-disclosures/',
  	"_status" "payload"."enum_site_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_site_footer_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"head" varchar,
  	"label" varchar,
  	"href" varchar,
  	"external" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_site_footer_v_version_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_site_footer_v_version_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"item_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_site_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_watermark" varchar DEFAULT 'MLRIT',
  	"version_crafted_lead" varchar DEFAULT 'Crafted with passion by ',
  	"version_crafted_name" varchar DEFAULT 'The Students',
  	"version_crafted_tail" varchar DEFAULT ' of MLRIT',
  	"version_copyright" varchar DEFAULT '© 2026 KMR Educational Society',
  	"version_disclosures_label" varchar DEFAULT 'Disclosures',
  	"version_disclosures_href" varchar DEFAULT 'https://mlrit.ac.in/mandatory-disclosures/',
  	"version__status" "payload"."enum__site_footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."about_overview" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"with_a_clear_purpose" varchar DEFAULT ', with a clear purpose — to bring rigorous, industry-aligned engineering education to Telangana.',
  	"across_five_branches_and" varchar DEFAULT 'across five branches, and a consistent place in NIRF engineering rankings.',
  	"read_our_full_legacy" varchar DEFAULT 'Read our full legacy →',
  	"to_a_benchmark_today" varchar DEFAULT 'to a benchmark today.',
  	"from_a_vision_in" varchar DEFAULT 'From a vision in 2005',
  	"view_timeline" varchar DEFAULT 'View timeline →',
  	"right_education_bright_placements" varchar DEFAULT 'right education, bright placements.',
  	"nba_programme_level_accreditation" varchar DEFAULT 'NBA programme-level accreditation',
  	"naac_institutional_accreditation" varchar DEFAULT 'NAAC institutional accreditation',
  	"sri_marri_laxman_reddy" varchar DEFAULT 'Sri Marri Laxman Reddy Garu',
  	"kmr_educational_society" varchar DEFAULT 'KMR Educational Society',
  	"autonomous_status" varchar DEFAULT 'autonomous status',
  	"what_defines_us" varchar DEFAULT 'What Defines Us',
  	"our_story" varchar DEFAULT 'Our Story',
  	"mlrit" varchar DEFAULT 'MLRIT.',
  	"_status" "payload"."enum_about_overview_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_about_overview_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_with_a_clear_purpose" varchar DEFAULT ', with a clear purpose — to bring rigorous, industry-aligned engineering education to Telangana.',
  	"version_across_five_branches_and" varchar DEFAULT 'across five branches, and a consistent place in NIRF engineering rankings.',
  	"version_read_our_full_legacy" varchar DEFAULT 'Read our full legacy →',
  	"version_to_a_benchmark_today" varchar DEFAULT 'to a benchmark today.',
  	"version_from_a_vision_in" varchar DEFAULT 'From a vision in 2005',
  	"version_view_timeline" varchar DEFAULT 'View timeline →',
  	"version_right_education_bright_placements" varchar DEFAULT 'right education, bright placements.',
  	"version_nba_programme_level_accreditation" varchar DEFAULT 'NBA programme-level accreditation',
  	"version_naac_institutional_accreditation" varchar DEFAULT 'NAAC institutional accreditation',
  	"version_sri_marri_laxman_reddy" varchar DEFAULT 'Sri Marri Laxman Reddy Garu',
  	"version_kmr_educational_society" varchar DEFAULT 'KMR Educational Society',
  	"version_autonomous_status" varchar DEFAULT 'autonomous status',
  	"version_what_defines_us" varchar DEFAULT 'What Defines Us',
  	"version_our_story" varchar DEFAULT 'Our Story',
  	"version_mlrit" varchar DEFAULT 'MLRIT.',
  	"version__status" "payload"."enum__about_overview_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."about_rankings_awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"numbers_that" varchar DEFAULT 'Numbers that',
  	"accreditations_rankings" varchar DEFAULT 'Accreditations & Rankings',
  	"speak_for_themselves" varchar DEFAULT 'speak for themselves.',
  	"recognitions" varchar DEFAULT 'recognitions.',
  	"timeline" varchar DEFAULT 'Timeline',
  	"_status" "payload"."enum_about_rankings_awards_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_about_rankings_awards_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_numbers_that" varchar DEFAULT 'Numbers that',
  	"version_accreditations_rankings" varchar DEFAULT 'Accreditations & Rankings',
  	"version_speak_for_themselves" varchar DEFAULT 'speak for themselves.',
  	"version_recognitions" varchar DEFAULT 'recognitions.',
  	"version_timeline" varchar DEFAULT 'Timeline',
  	"version__status" "payload"."enum__about_rankings_awards_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."about_vision_mission" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"promote_academic_excellence_research" varchar DEFAULT 'Promote academic excellence, research, innovation, and entrepreneurial skills to produce graduates with human values and leadership qualities to serve the nation.',
  	"core_values" varchar DEFAULT 'Core Values',
  	"mission" varchar DEFAULT 'Mission',
  	"vision" varchar DEFAULT 'Vision',
  	"_status" "payload"."enum_about_vision_mission_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_about_vision_mission_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_promote_academic_excellence_research" varchar DEFAULT 'Promote academic excellence, research, innovation, and entrepreneurial skills to produce graduates with human values and leadership qualities to serve the nation.',
  	"version_core_values" varchar DEFAULT 'Core Values',
  	"version_mission" varchar DEFAULT 'Mission',
  	"version_vision" varchar DEFAULT 'Vision',
  	"version__status" "payload"."enum__about_vision_mission_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."academics_overview" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"every_academic_decision_at" varchar DEFAULT 'Every academic decision at MLRIT runs through four lenses — outcome-based teaching, autonomy of regulation, industry integration, and research-led depth.',
  	"pick_your" varchar DEFAULT 'Pick your',
  	"the_four" varchar DEFAULT 'The four',
  	"how_we_teach" varchar DEFAULT 'How We Teach',
  	"frameworks" varchar DEFAULT 'frameworks.',
  	"explore" varchar DEFAULT 'Explore',
  	"thread" varchar DEFAULT 'thread.',
  	"open" varchar DEFAULT 'Open →',
  	"_status" "payload"."enum_academics_overview_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_academics_overview_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_every_academic_decision_at" varchar DEFAULT 'Every academic decision at MLRIT runs through four lenses — outcome-based teaching, autonomy of regulation, industry integration, and research-led depth.',
  	"version_pick_your" varchar DEFAULT 'Pick your',
  	"version_the_four" varchar DEFAULT 'The four',
  	"version_how_we_teach" varchar DEFAULT 'How We Teach',
  	"version_frameworks" varchar DEFAULT 'frameworks.',
  	"version_explore" varchar DEFAULT 'Explore',
  	"version_thread" varchar DEFAULT 'thread.',
  	"version_open" varchar DEFAULT 'Open →',
  	"version__status" "payload"."enum__academics_overview_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_b_category" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_admissions" varchar DEFAULT 'Contact Admissions',
  	"view_fee_structure" varchar DEFAULT 'View Fee Structure',
  	"get_in_touch" varchar DEFAULT 'Get in Touch',
  	"management_quota" varchar DEFAULT 'Management Quota',
  	"admissions" varchar DEFAULT 'Admissions',
  	"b_category" varchar DEFAULT 'B-Category',
  	"limited_seats_available" varchar DEFAULT 'Limited seats available',
  	"ready_to_join_mlrit" varchar DEFAULT 'Ready to join MLRIT?',
  	"admissions2" varchar DEFAULT 'Admissions',
  	"b_category2" varchar DEFAULT 'B-Category',
  	"home" varchar DEFAULT 'Home',
  	"_status" "payload"."enum_admissions_b_category_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_b_category_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_contact_admissions" varchar DEFAULT 'Contact Admissions',
  	"version_view_fee_structure" varchar DEFAULT 'View Fee Structure',
  	"version_get_in_touch" varchar DEFAULT 'Get in Touch',
  	"version_management_quota" varchar DEFAULT 'Management Quota',
  	"version_admissions" varchar DEFAULT 'Admissions',
  	"version_b_category" varchar DEFAULT 'B-Category',
  	"version_limited_seats_available" varchar DEFAULT 'Limited seats available',
  	"version_ready_to_join_mlrit" varchar DEFAULT 'Ready to join MLRIT?',
  	"version_admissions2" varchar DEFAULT 'Admissions',
  	"version_b_category2" varchar DEFAULT 'B-Category',
  	"version_home" varchar DEFAULT 'Home',
  	"version__status" "payload"."enum__admissions_b_category_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_fees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fee_structure_is_subject" varchar DEFAULT 'Fee structure is subject to revision by the respective fee regulatory authority each academic year. Fees shown are for AY 2025–26. Management quota fees differ from convener quota and are available on request.',
  	"how_to_apply" varchar DEFAULT 'How to Apply',
  	"these_are_in_addition" varchar DEFAULT 'These are in addition to the annual tuition fee.',
  	"accepted_payment_modes" varchar DEFAULT 'Accepted Payment Modes',
  	"approx_total_year" varchar DEFAULT 'Approx. Total / Year',
  	"approx_total_year2" varchar DEFAULT 'Approx. total / year',
  	"other_fees_charges" varchar DEFAULT 'Other Fees & Charges',
  	"tuition_fee_year" varchar DEFAULT 'Tuition Fee / Year',
  	"fee_revision_note" varchar DEFAULT 'Fee Revision Note',
  	"tuition_year" varchar DEFAULT 'Tuition / year',
  	"programme" varchar DEFAULT 'Programme',
  	"_status" "payload"."enum_admissions_fees_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_fees_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_fee_structure_is_subject" varchar DEFAULT 'Fee structure is subject to revision by the respective fee regulatory authority each academic year. Fees shown are for AY 2025–26. Management quota fees differ from convener quota and are available on request.',
  	"version_how_to_apply" varchar DEFAULT 'How to Apply',
  	"version_these_are_in_addition" varchar DEFAULT 'These are in addition to the annual tuition fee.',
  	"version_accepted_payment_modes" varchar DEFAULT 'Accepted Payment Modes',
  	"version_approx_total_year" varchar DEFAULT 'Approx. Total / Year',
  	"version_approx_total_year2" varchar DEFAULT 'Approx. total / year',
  	"version_other_fees_charges" varchar DEFAULT 'Other Fees & Charges',
  	"version_tuition_fee_year" varchar DEFAULT 'Tuition Fee / Year',
  	"version_fee_revision_note" varchar DEFAULT 'Fee Revision Note',
  	"version_tuition_year" varchar DEFAULT 'Tuition / year',
  	"version_programme" varchar DEFAULT 'Programme',
  	"version__status" "payload"."enum__admissions_fees_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_why_mlrit" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"five_letters_one_story" varchar DEFAULT 'Five letters. One story.',
  	"every_letter_of_mlrit" varchar DEFAULT 'Every letter of MLRIT stands',
  	"scroll_to_explore" varchar DEFAULT 'Scroll to explore',
  	"you_can_feel" varchar DEFAULT 'you can feel.',
  	"_status" "payload"."enum_admissions_why_mlrit_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_why_mlrit_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_five_letters_one_story" varchar DEFAULT 'Five letters. One story.',
  	"version_every_letter_of_mlrit" varchar DEFAULT 'Every letter of MLRIT stands',
  	"version_scroll_to_explore" varchar DEFAULT 'Scroll to explore',
  	"version_you_can_feel" varchar DEFAULT 'you can feel.',
  	"version__status" "payload"."enum__admissions_why_mlrit_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."chronicles_overview" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"in_brief" varchar DEFAULT 'In Brief',
  	"today" varchar DEFAULT 'Today',
  	"live_wire" varchar DEFAULT 'Live Wire',
  	"twelve_months_one_campus" varchar DEFAULT 'Twelve months, one campus',
  	"older_stories" varchar DEFAULT 'Older stories',
  	"the_campus_broadsheet_of" varchar DEFAULT 'The campus broadsheet of MLR Institute of Technology',
  	"campus_research_placements_sport" varchar DEFAULT 'Campus · Research · Placements · Sport',
  	"continue_reading" varchar DEFAULT 'Continue reading →',
  	"mlrit_chronicles" varchar DEFAULT 'MLRIT Chronicles',
  	"mlrit_hyderabad" varchar DEFAULT 'MLRIT · HYDERABAD',
  	"vol_v_no23" varchar DEFAULT 'VOL. V · NO. 23',
  	"spring_edition" varchar DEFAULT 'SPRING EDITION',
  	"most_read" varchar DEFAULT 'Most Read',
  	"_status" "payload"."enum_chronicles_overview_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_chronicles_overview_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_in_brief" varchar DEFAULT 'In Brief',
  	"version_today" varchar DEFAULT 'Today',
  	"version_live_wire" varchar DEFAULT 'Live Wire',
  	"version_twelve_months_one_campus" varchar DEFAULT 'Twelve months, one campus',
  	"version_older_stories" varchar DEFAULT 'Older stories',
  	"version_the_campus_broadsheet_of" varchar DEFAULT 'The campus broadsheet of MLR Institute of Technology',
  	"version_campus_research_placements_sport" varchar DEFAULT 'Campus · Research · Placements · Sport',
  	"version_continue_reading" varchar DEFAULT 'Continue reading →',
  	"version_mlrit_chronicles" varchar DEFAULT 'MLRIT Chronicles',
  	"version_mlrit_hyderabad" varchar DEFAULT 'MLRIT · HYDERABAD',
  	"version_vol_v_no23" varchar DEFAULT 'VOL. V · NO. 23',
  	"version_spring_edition" varchar DEFAULT 'SPRING EDITION',
  	"version_most_read" varchar DEFAULT 'Most Read',
  	"version__status" "payload"."enum__chronicles_overview_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."departments_pg" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"four_research_led_m" varchar DEFAULT 'Four research-led M.Tech tracks across CSE, VLSI, Power Systems and Aerospace Propulsion.',
  	"explore_mba_programme" varchar DEFAULT 'Explore MBA programme →',
  	"m_tech" varchar DEFAULT 'M.Tech',
  	"_status" "payload"."enum_departments_pg_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_departments_pg_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_four_research_led_m" varchar DEFAULT 'Four research-led M.Tech tracks across CSE, VLSI, Power Systems and Aerospace Propulsion.',
  	"version_explore_mba_programme" varchar DEFAULT 'Explore MBA programme →',
  	"version_m_tech" varchar DEFAULT 'M.Tech',
  	"version__status" "payload"."enum__departments_pg_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."departments_ug" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"every_b_tech_branch" varchar DEFAULT 'Every B.Tech branch at MLRIT is JNTUH-affiliated, AICTE-approved and offered as a 4-year programme.',
  	"engineering" varchar DEFAULT 'Engineering',
  	"open" varchar DEFAULT 'Open →',
  	"_status" "payload"."enum_departments_ug_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_departments_ug_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_every_b_tech_branch" varchar DEFAULT 'Every B.Tech branch at MLRIT is JNTUH-affiliated, AICTE-approved and offered as a 4-year programme.',
  	"version_engineering" varchar DEFAULT 'Engineering',
  	"version_open" varchar DEFAULT 'Open →',
  	"version__status" "payload"."enum__departments_ug_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view" varchar DEFAULT 'View',
  	"download" varchar DEFAULT 'Download',
  	"download_print_and_submit" varchar DEFAULT 'Download, print and submit these forms to the COE office with supporting documents and prescribed fees.',
  	"current" varchar DEFAULT 'Current',
  	"academic_calendars" varchar DEFAULT 'Academic Calendars',
  	"student_forms" varchar DEFAULT 'Student Forms',
  	"documents" varchar DEFAULT 'documents.',
  	"calendars" varchar DEFAULT 'calendars.',
  	"forms" varchar DEFAULT 'forms.',
  	"_status" "payload"."enum_examinations_downloads_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_downloads_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view" varchar DEFAULT 'View',
  	"version_download" varchar DEFAULT 'Download',
  	"version_download_print_and_submit" varchar DEFAULT 'Download, print and submit these forms to the COE office with supporting documents and prescribed fees.',
  	"version_current" varchar DEFAULT 'Current',
  	"version_academic_calendars" varchar DEFAULT 'Academic Calendars',
  	"version_student_forms" varchar DEFAULT 'Student Forms',
  	"version_documents" varchar DEFAULT 'documents.',
  	"version_calendars" varchar DEFAULT 'calendars.',
  	"version_forms" varchar DEFAULT 'forms.',
  	"version__status" "payload"."enum__examinations_downloads_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_fee_results" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"semester_results_are_published" varchar DEFAULT 'Semester results are published on the MLRIT Exam Portal within the timelines specified in the academic calendar. Log in with your student credentials to view and download your grade sheet.',
  	"the_mlrit_examinations_portal" varchar DEFAULT 'The MLRIT Examinations Portal is the single destination for paying examination fees, accessing results and downloading hall tickets.',
  	"contact_coe_for_result" varchar DEFAULT 'Contact COE for Result Queries →',
  	"view_results_on_portal" varchar DEFAULT 'View Results on Portal ↗',
  	"mlrit_examinations_portal" varchar DEFAULT 'MLRIT Examinations Portal',
  	"open_exam_portal" varchar DEFAULT 'Open Exam Portal ↗',
  	"fee_payment_and_results" varchar DEFAULT 'Fee payment and results',
  	"are_on_the_exam" varchar DEFAULT 'are on the Exam Portal.',
  	"four_steps" varchar DEFAULT 'four steps.',
  	"how_to_pay" varchar DEFAULT 'How to Pay',
  	"results" varchar DEFAULT 'results.',
  	"results2" varchar DEFAULT 'Results',
  	"_status" "payload"."enum_examinations_fee_results_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_fee_results_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_semester_results_are_published" varchar DEFAULT 'Semester results are published on the MLRIT Exam Portal within the timelines specified in the academic calendar. Log in with your student credentials to view and download your grade sheet.',
  	"version_the_mlrit_examinations_portal" varchar DEFAULT 'The MLRIT Examinations Portal is the single destination for paying examination fees, accessing results and downloading hall tickets.',
  	"version_contact_coe_for_result" varchar DEFAULT 'Contact COE for Result Queries →',
  	"version_view_results_on_portal" varchar DEFAULT 'View Results on Portal ↗',
  	"version_mlrit_examinations_portal" varchar DEFAULT 'MLRIT Examinations Portal',
  	"version_open_exam_portal" varchar DEFAULT 'Open Exam Portal ↗',
  	"version_fee_payment_and_results" varchar DEFAULT 'Fee payment and results',
  	"version_are_on_the_exam" varchar DEFAULT 'are on the Exam Portal.',
  	"version_four_steps" varchar DEFAULT 'four steps.',
  	"version_how_to_pay" varchar DEFAULT 'How to Pay',
  	"version_results" varchar DEFAULT 'results.',
  	"version_results2" varchar DEFAULT 'Results',
  	"version__status" "payload"."enum__examinations_fee_results_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view" varchar DEFAULT 'View',
  	"download" varchar DEFAULT 'Download',
  	"results_declarations_mark_verifications" varchar DEFAULT 'Results declarations, mark verifications and revaluation notices. Use View to open in-browser or Download to save a copy.',
  	"coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"new" varchar DEFAULT 'New',
  	"notifications" varchar DEFAULT 'notifications.',
  	"_status" "payload"."enum_examinations_notifications_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_notifications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view" varchar DEFAULT 'View',
  	"version_download" varchar DEFAULT 'Download',
  	"version_results_declarations_mark_verifications" varchar DEFAULT 'Results declarations, mark verifications and revaluation notices. Use View to open in-browser or Download to save a copy.',
  	"version_coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"version_new" varchar DEFAULT 'New',
  	"version_notifications" varchar DEFAULT 'notifications.',
  	"version__status" "payload"."enum__examinations_notifications_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_pyqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"b_tech" varchar DEFAULT 'B.Tech',
  	"bg_green50_border" varchar DEFAULT 'bg-green-50 border-green-200 text-secondary',
  	"m_tech_mba" varchar DEFAULT 'M.Tech / MBA',
  	"bg_orange50_border" varchar DEFAULT 'bg-orange-50 border-orange-200 text-primary',
  	"semester_wise_archives_from" varchar DEFAULT 'Semester-wise archives from 2016 to 2026, organised by year.',
  	"pg_programme_archives_from" varchar DEFAULT 'PG programme archives from 2020 to 2026.',
  	"mlrit_exam_portal" varchar DEFAULT 'MLRIT Exam Portal',
  	"question_papers" varchar DEFAULT 'Question Papers.',
  	"winrar" varchar DEFAULT 'WinRAR',
  	"undergraduate" varchar DEFAULT 'Undergraduate',
  	"text7_zip" varchar DEFAULT '7-Zip',
  	"postgraduate" varchar DEFAULT 'Postgraduate',
  	"_status" "payload"."enum_examinations_pyqs_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_pyqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_b_tech" varchar DEFAULT 'B.Tech',
  	"version_bg_green50_border" varchar DEFAULT 'bg-green-50 border-green-200 text-secondary',
  	"version_m_tech_mba" varchar DEFAULT 'M.Tech / MBA',
  	"version_bg_orange50_border" varchar DEFAULT 'bg-orange-50 border-orange-200 text-primary',
  	"version_semester_wise_archives_from" varchar DEFAULT 'Semester-wise archives from 2016 to 2026, organised by year.',
  	"version_pg_programme_archives_from" varchar DEFAULT 'PG programme archives from 2020 to 2026.',
  	"version_mlrit_exam_portal" varchar DEFAULT 'MLRIT Exam Portal',
  	"version_question_papers" varchar DEFAULT 'Question Papers.',
  	"version_winrar" varchar DEFAULT 'WinRAR',
  	"version_undergraduate" varchar DEFAULT 'Undergraduate',
  	"version_text7_zip" varchar DEFAULT '7-Zip',
  	"version_postgraduate" varchar DEFAULT 'Postgraduate',
  	"version__status" "payload"."enum__examinations_pyqs_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_regulations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"as_an_autonomous_institution" varchar DEFAULT 'As an autonomous institution since 2015, MLRIT designs its own regulations approved by UGC and affiliated to JNTUH. Download the applicable regulation PDF for your programme and batch year.',
  	"examination_policy_pdf" varchar DEFAULT 'Examination Policy PDF',
  	"examinations_support" varchar DEFAULT 'Examinations Support',
  	"all_regulations" varchar DEFAULT 'All Regulations',
  	"programme" varchar DEFAULT 'Programme',
  	"regulations" varchar DEFAULT 'regulations.',
  	"_status" "payload"."enum_examinations_regulations_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_regulations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_as_an_autonomous_institution" varchar DEFAULT 'As an autonomous institution since 2015, MLRIT designs its own regulations approved by UGC and affiliated to JNTUH. Download the applicable regulation PDF for your programme and batch year.',
  	"version_examination_policy_pdf" varchar DEFAULT 'Examination Policy PDF',
  	"version_examinations_support" varchar DEFAULT 'Examinations Support',
  	"version_all_regulations" varchar DEFAULT 'All Regulations',
  	"version_programme" varchar DEFAULT 'Programme',
  	"version_regulations" varchar DEFAULT 'regulations.',
  	"version__status" "payload"."enum__examinations_regulations_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_student_verifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_form" varchar DEFAULT 'View Form',
  	"download_form" varchar DEFAULT 'Download Form',
  	"download_and_complete_the" varchar DEFAULT 'Download and complete the Student Verification Form. This form is required for all credential authentication requests submitted to the COE office.',
  	"text57_working_days" varchar DEFAULT '5–7 working days for standard requests. Urgent requests may be accommodated subject to workload — contact the office in advance.',
  	"attach_a_copy_of" varchar DEFAULT '. Attach a copy of the document to be verified and a valid government-issued ID proof.',
  	"download_the_verification_form" varchar DEFAULT 'Download the Verification Form',
  	"coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"submit_to_the_coe" varchar DEFAULT 'Submit to the COE Office',
  	"page_for_office_details" varchar DEFAULT 'page for office details.',
  	"verification_is_accepted_for" varchar DEFAULT 'Verification is accepted for',
  	"processing_time" varchar DEFAULT 'Processing time:',
  	"contact_us" varchar DEFAULT 'Contact Us',
  	"step1" varchar DEFAULT 'Step 1',
  	"step2" varchar DEFAULT 'Step 2',
  	"_status" "payload"."enum_examinations_student_verifications_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_student_verifications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_form" varchar DEFAULT 'View Form',
  	"version_download_form" varchar DEFAULT 'Download Form',
  	"version_download_and_complete_the" varchar DEFAULT 'Download and complete the Student Verification Form. This form is required for all credential authentication requests submitted to the COE office.',
  	"version_text57_working_days" varchar DEFAULT '5–7 working days for standard requests. Urgent requests may be accommodated subject to workload — contact the office in advance.',
  	"version_attach_a_copy_of" varchar DEFAULT '. Attach a copy of the document to be verified and a valid government-issued ID proof.',
  	"version_download_the_verification_form" varchar DEFAULT 'Download the Verification Form',
  	"version_coe_mlrinstitutions_ac_in" varchar DEFAULT 'coe@mlrinstitutions.ac.in',
  	"version_submit_to_the_coe" varchar DEFAULT 'Submit to the COE Office',
  	"version_page_for_office_details" varchar DEFAULT 'page for office details.',
  	"version_verification_is_accepted_for" varchar DEFAULT 'Verification is accepted for',
  	"version_processing_time" varchar DEFAULT 'Processing time:',
  	"version_contact_us" varchar DEFAULT 'Contact Us',
  	"version_step1" varchar DEFAULT 'Step 1',
  	"version_step2" varchar DEFAULT 'Step 2',
  	"version__status" "payload"."enum__examinations_student_verifications_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_timetable_external" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_pdf" varchar DEFAULT 'View PDF',
  	"download" varchar DEFAULT 'Download',
  	"all_timetables_are_hosted" varchar DEFAULT 'All timetables are hosted locally. Use View to open in-browser or Download to save a copy.',
  	"current" varchar DEFAULT 'Current',
  	"coe_office" varchar DEFAULT 'COE office',
  	"circulars" varchar DEFAULT 'Circulars',
  	"schedules" varchar DEFAULT 'schedules.',
  	"_status" "payload"."enum_examinations_timetable_external_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_timetable_external_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_pdf" varchar DEFAULT 'View PDF',
  	"version_download" varchar DEFAULT 'Download',
  	"version_all_timetables_are_hosted" varchar DEFAULT 'All timetables are hosted locally. Use View to open in-browser or Download to save a copy.',
  	"version_current" varchar DEFAULT 'Current',
  	"version_coe_office" varchar DEFAULT 'COE office',
  	"version_circulars" varchar DEFAULT 'Circulars',
  	"version_schedules" varchar DEFAULT 'schedules.',
  	"version__status" "payload"."enum__examinations_timetable_external_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_timetable_internal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_pdf" varchar DEFAULT 'View PDF',
  	"download" varchar DEFAULT 'Download',
  	"mid_term_and_unit" varchar DEFAULT 'Mid-term and unit test timetables published by the COE. Use View to open in-browser or Download to save a copy.',
  	"current" varchar DEFAULT 'Current',
  	"coe_office" varchar DEFAULT 'COE office',
  	"schedules" varchar DEFAULT 'schedules.',
  	"_status" "payload"."enum_examinations_timetable_internal_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_timetable_internal_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_pdf" varchar DEFAULT 'View PDF',
  	"version_download" varchar DEFAULT 'Download',
  	"version_mid_term_and_unit" varchar DEFAULT 'Mid-term and unit test timetables published by the COE. Use View to open in-browser or Download to save a copy.',
  	"version_current" varchar DEFAULT 'Current',
  	"version_coe_office" varchar DEFAULT 'COE office',
  	"version_schedules" varchar DEFAULT 'schedules.',
  	"version__status" "payload"."enum__examinations_timetable_internal_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_composition" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"an_acclaimed_academician_and" varchar DEFAULT 'An acclaimed academician and administrator in the field of technical education with more than 21 years of academic experience. Former Head of the Science and Humanities Department at MLR Institute of Technology.',
  	"she_has_organised_and" varchar DEFAULT 'She has organised and attended several National and International Conferences, Seminars and Workshops, and has published nearly 20 research papers in Journals of National and International Repute.',
  	"the_iqac_functions_as" varchar DEFAULT 'The IQAC functions as the nodal agency for quality assurance and enhancement, ensuring that the institution continuously improves its academic and administrative performance.',
  	"the_iqac_functions_as2" varchar DEFAULT 'The IQAC functions as the nodal agency for quality assurance and enhancement, bringing together institutional leadership, faculty, and external experts.',
  	"tcos_smart_materials_higher" varchar DEFAULT 'TCOs · Smart Materials · Higher Education · ICT in Education',
  	"density_functional_theory_transparent" varchar DEFAULT 'Density Functional Theory · Transparent Conducting Oxides',
  	"hyderabad_central_university" varchar DEFAULT 'Hyderabad Central University',
  	"iqac_member_composition" varchar DEFAULT 'IQAC Member Composition',
  	"m_sc_ph_d" varchar DEFAULT 'M.Sc., Ph.D — Physics',
  	"dr_radhika_devi_v" varchar DEFAULT 'Dr. Radhika Devi V',
  	"specialisation" varchar DEFAULT 'Specialisation',
  	"research_focus" varchar DEFAULT 'Research Focus',
  	"qualification" varchar DEFAULT 'Qualification',
  	"iqac_members" varchar DEFAULT 'IQAC Members',
  	"head_iqac" varchar DEFAULT 'Head IQAC',
  	"category" varchar DEFAULT 'Category',
  	"position" varchar DEFAULT 'Position',
  	"_status" "payload"."enum_iqac_composition_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_composition_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_an_acclaimed_academician_and" varchar DEFAULT 'An acclaimed academician and administrator in the field of technical education with more than 21 years of academic experience. Former Head of the Science and Humanities Department at MLR Institute of Technology.',
  	"version_she_has_organised_and" varchar DEFAULT 'She has organised and attended several National and International Conferences, Seminars and Workshops, and has published nearly 20 research papers in Journals of National and International Repute.',
  	"version_the_iqac_functions_as" varchar DEFAULT 'The IQAC functions as the nodal agency for quality assurance and enhancement, ensuring that the institution continuously improves its academic and administrative performance.',
  	"version_the_iqac_functions_as2" varchar DEFAULT 'The IQAC functions as the nodal agency for quality assurance and enhancement, bringing together institutional leadership, faculty, and external experts.',
  	"version_tcos_smart_materials_higher" varchar DEFAULT 'TCOs · Smart Materials · Higher Education · ICT in Education',
  	"version_density_functional_theory_transparent" varchar DEFAULT 'Density Functional Theory · Transparent Conducting Oxides',
  	"version_hyderabad_central_university" varchar DEFAULT 'Hyderabad Central University',
  	"version_iqac_member_composition" varchar DEFAULT 'IQAC Member Composition',
  	"version_m_sc_ph_d" varchar DEFAULT 'M.Sc., Ph.D — Physics',
  	"version_dr_radhika_devi_v" varchar DEFAULT 'Dr. Radhika Devi V',
  	"version_specialisation" varchar DEFAULT 'Specialisation',
  	"version_research_focus" varchar DEFAULT 'Research Focus',
  	"version_qualification" varchar DEFAULT 'Qualification',
  	"version_iqac_members" varchar DEFAULT 'IQAC Members',
  	"version_head_iqac" varchar DEFAULT 'Head IQAC',
  	"version_category" varchar DEFAULT 'Category',
  	"version_position" varchar DEFAULT 'Position',
  	"version__status" "payload"."enum__iqac_composition_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."iqac_naac" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mlrit_is_accredited_by" varchar DEFAULT 'MLRIT is accredited by NAAC. Below are the key documents available for public download.',
  	"for_direct_document_access" varchar DEFAULT 'For direct document access, write to the IQAC office at',
  	"available_on_request_contact" varchar DEFAULT 'Available on request — contact',
  	"iqac_mlrinstitutions_ac_in" varchar DEFAULT 'iqac@mlrinstitutions.ac.in',
  	"accreditation" varchar DEFAULT 'Accreditation',
  	"document" varchar DEFAULT 'Document',
  	"_status" "payload"."enum_iqac_naac_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_iqac_naac_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_mlrit_is_accredited_by" varchar DEFAULT 'MLRIT is accredited by NAAC. Below are the key documents available for public download.',
  	"version_for_direct_document_access" varchar DEFAULT 'For direct document access, write to the IQAC office at',
  	"version_available_on_request_contact" varchar DEFAULT 'Available on request — contact',
  	"version_iqac_mlrinstitutions_ac_in" varchar DEFAULT 'iqac@mlrinstitutions.ac.in',
  	"version_accreditation" varchar DEFAULT 'Accreditation',
  	"version_document" varchar DEFAULT 'Document',
  	"version__status" "payload"."enum__iqac_naac_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_drives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"max_width768px100vw" varchar DEFAULT '(max-width: 768px) 100vw, 1280px',
  	"max_width768px50vw" varchar DEFAULT '(max-width: 768px) 50vw, 25vw',
  	"industry_partners_recruit_directly" varchar DEFAULT 'Industry partners recruit directly from campus — bringing pre-placement talks, assessments, and offer sessions to MLRIT every year.',
  	"placement" varchar DEFAULT 'Placement',
  	"on_campus" varchar DEFAULT 'On Campus',
  	"drives" varchar DEFAULT 'Drives.',
  	"_status" "payload"."enum_placements_drives_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_drives_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_max_width768px100vw" varchar DEFAULT '(max-width: 768px) 100vw, 1280px',
  	"version_max_width768px50vw" varchar DEFAULT '(max-width: 768px) 50vw, 25vw',
  	"version_industry_partners_recruit_directly" varchar DEFAULT 'Industry partners recruit directly from campus — bringing pre-placement talks, assessments, and offer sessions to MLRIT every year.',
  	"version_placement" varchar DEFAULT 'Placement',
  	"version_on_campus" varchar DEFAULT 'On Campus',
  	"version_drives" varchar DEFAULT 'Drives.',
  	"version__status" "payload"."enum__placements_drives_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_global_certification" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"additional_certification_partners_full" varchar DEFAULT 'Additional certification partners — full programme details updated as institutional records are confirmed.',
  	"beyond_the" varchar DEFAULT 'Beyond the',
  	"verified" varchar DEFAULT 'Verified',
  	"certification_partners" varchar DEFAULT 'Certification Partners',
  	"more" varchar DEFAULT 'More',
  	"certifications" varchar DEFAULT 'certifications.',
  	"why_it_matters" varchar DEFAULT 'Why It Matters',
  	"programmes" varchar DEFAULT 'programmes.',
  	"partner" varchar DEFAULT 'Partner',
  	"degree" varchar DEFAULT 'degree.',
  	"_status" "payload"."enum_placements_global_certification_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_global_certification_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_additional_certification_partners_full" varchar DEFAULT 'Additional certification partners — full programme details updated as institutional records are confirmed.',
  	"version_beyond_the" varchar DEFAULT 'Beyond the',
  	"version_verified" varchar DEFAULT 'Verified',
  	"version_certification_partners" varchar DEFAULT 'Certification Partners',
  	"version_more" varchar DEFAULT 'More',
  	"version_certifications" varchar DEFAULT 'certifications.',
  	"version_why_it_matters" varchar DEFAULT 'Why It Matters',
  	"version_programmes" varchar DEFAULT 'programmes.',
  	"version_partner" varchar DEFAULT 'Partner',
  	"version_degree" varchar DEFAULT 'degree.',
  	"version__status" "payload"."enum__placements_global_certification_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_industry_readiness" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"preparation" varchar DEFAULT 'Preparation',
  	"branch_wise" varchar DEFAULT 'Branch-wise',
  	"curriculum" varchar DEFAULT 'Curriculum',
  	"training" varchar DEFAULT 'training.',
  	"areas" varchar DEFAULT 'areas.',
  	"_status" "payload"."enum_placements_industry_readiness_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_industry_readiness_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_preparation" varchar DEFAULT 'Preparation',
  	"version_branch_wise" varchar DEFAULT 'Branch-wise',
  	"version_curriculum" varchar DEFAULT 'Curriculum',
  	"version_training" varchar DEFAULT 'training.',
  	"version_areas" varchar DEFAULT 'areas.',
  	"version__status" "payload"."enum__placements_industry_readiness_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_overview" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"twenty_one_years_of" varchar DEFAULT 'Twenty-one years of building industry-ready professionals — every year, MLRIT places 81%+ of its graduating class.',
  	"explore_the_placements_section" varchar DEFAULT 'Explore the Placements Section',
  	"explore" varchar DEFAULT 'Explore →',
  	"placements_apart" varchar DEFAULT 'placements apart.',
  	"mlrit_placements" varchar DEFAULT 'MLRIT placements.',
  	"begin" varchar DEFAULT 'begin.',
  	"why_mlrit" varchar DEFAULT 'Why MLRIT',
  	"overview" varchar DEFAULT 'Overview',
  	"_status" "payload"."enum_placements_overview_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_overview_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_twenty_one_years_of" varchar DEFAULT 'Twenty-one years of building industry-ready professionals — every year, MLRIT places 81%+ of its graduating class.',
  	"version_explore_the_placements_section" varchar DEFAULT 'Explore the Placements Section',
  	"version_explore" varchar DEFAULT 'Explore →',
  	"version_placements_apart" varchar DEFAULT 'placements apart.',
  	"version_mlrit_placements" varchar DEFAULT 'MLRIT placements.',
  	"version_begin" varchar DEFAULT 'begin.',
  	"version_why_mlrit" varchar DEFAULT 'Why MLRIT',
  	"version_overview" varchar DEFAULT 'Overview',
  	"version__status" "payload"."enum__placements_overview_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."research_support" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"medchal_malkajgiri_telangana500" varchar DEFAULT 'Medchal Malkajgiri, Telangana – 500 043',
  	"survey_no444_dundigal" varchar DEFAULT 'Survey No. 444, Dundigal, Gandi Maisamma',
  	"email_r_d_cell" varchar DEFAULT 'Email R&D Cell',
  	"mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"r_d_cell_research" varchar DEFAULT 'R&D Cell — Research Block',
  	"phone_to_be_updated" varchar DEFAULT 'Phone — To be updated',
  	"office_location" varchar DEFAULT 'Office Location',
  	"_status" "payload"."enum_research_support_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_research_support_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_medchal_malkajgiri_telangana500" varchar DEFAULT 'Medchal Malkajgiri, Telangana – 500 043',
  	"version_survey_no444_dundigal" varchar DEFAULT 'Survey No. 444, Dundigal, Gandi Maisamma',
  	"version_email_r_d_cell" varchar DEFAULT 'Email R&D Cell',
  	"version_mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"version_r_d_cell_research" varchar DEFAULT 'R&D Cell — Research Block',
  	"version_phone_to_be_updated" varchar DEFAULT 'Phone — To be updated',
  	"version_office_location" varchar DEFAULT 'Office Location',
  	"version__status" "payload"."enum__research_support_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."student_life_overview" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"a_lifetime_of_memories" varchar DEFAULT 'A lifetime of memories',
  	"max_width768px80vw" varchar DEFAULT '(max-width: 768px) 80vw, 38vw',
  	"max_width1360px100vw" varchar DEFAULT '(max-width: 1360px) 100vw, 1360px',
  	"dive_into_campus_clubs" varchar DEFAULT 'Dive into campus clubs, cultural fests, sports leagues, and academic competitions that spark growth and lasting memories. At MLRIT, every event is a chance to discover your passion, build your network, and create experiences that stay with you long after graduation.',
  	"where_learning_meets_living" varchar DEFAULT 'Where learning meets living — every day on campus',
  	"celebrate_campus" varchar DEFAULT 'Celebrate Campus',
  	"engagements" varchar DEFAULT 'Engagements',
  	"welcome_to_student_life" varchar DEFAULT 'Welcome to Student Life',
  	"mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"_status" "payload"."enum_student_life_overview_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_student_life_overview_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_a_lifetime_of_memories" varchar DEFAULT 'A lifetime of memories',
  	"version_max_width768px80vw" varchar DEFAULT '(max-width: 768px) 80vw, 38vw',
  	"version_max_width1360px100vw" varchar DEFAULT '(max-width: 1360px) 100vw, 1360px',
  	"version_dive_into_campus_clubs" varchar DEFAULT 'Dive into campus clubs, cultural fests, sports leagues, and academic competitions that spark growth and lasting memories. At MLRIT, every event is a chance to discover your passion, build your network, and create experiences that stay with you long after graduation.',
  	"version_where_learning_meets_living" varchar DEFAULT 'Where learning meets living — every day on campus',
  	"version_celebrate_campus" varchar DEFAULT 'Celebrate Campus',
  	"version_engagements" varchar DEFAULT 'Engagements',
  	"version_welcome_to_student_life" varchar DEFAULT 'Welcome to Student Life',
  	"version_mlr_institute_of_technology" varchar DEFAULT 'MLR Institute of Technology',
  	"version__status" "payload"."enum__student_life_overview_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_overview" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"we_believe_no_student" varchar DEFAULT 'We believe no student should miss out on quality education for financial reasons. MLRIT disburses scholarships across merit, need, sports and SC/ST categories every year.',
  	"mlrit_opens_its_doors" varchar DEFAULT 'MLRIT opens its doors to students who are curious, driven and ready to shape the future. A transparent, merit-based admissions process — designed for you.',
  	"explore_scholarships" varchar DEFAULT 'Explore Scholarships',
  	"view_fee_structure" varchar DEFAULT 'View Fee Structure',
  	"explore_more" varchar DEFAULT 'Explore More',
  	"admissions202526" varchar DEFAULT 'Admissions 2025–26',
  	"download_brochure" varchar DEFAULT 'Download Brochure',
  	"check_details" varchar DEFAULT 'Check Details',
  	"b_cat_details" varchar DEFAULT 'B-Cat Details',
  	"b_category" varchar DEFAULT 'B-Category',
  	"why_mlrit" varchar DEFAULT 'Why MLRIT',
  	"admissions" varchar DEFAULT '§ Admissions',
  	"scholarships" varchar DEFAULT 'Scholarships',
  	"five_steps_to" varchar DEFAULT 'Five steps to',
  	"scholarship" varchar DEFAULT 'Scholarship',
  	"fees" varchar DEFAULT 'Fees &',
  	"financial_support" varchar DEFAULT 'Financial Support',
  	"how_to_apply" varchar DEFAULT 'How to Apply',
  	"admissions2" varchar DEFAULT 'Admissions',
  	"your_seat" varchar DEFAULT 'your seat.',
  	"types" varchar DEFAULT 'types.',
  	"home" varchar DEFAULT 'Home',
  	"_status" "payload"."enum_admissions_overview_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_overview_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_we_believe_no_student" varchar DEFAULT 'We believe no student should miss out on quality education for financial reasons. MLRIT disburses scholarships across merit, need, sports and SC/ST categories every year.',
  	"version_mlrit_opens_its_doors" varchar DEFAULT 'MLRIT opens its doors to students who are curious, driven and ready to shape the future. A transparent, merit-based admissions process — designed for you.',
  	"version_explore_scholarships" varchar DEFAULT 'Explore Scholarships',
  	"version_view_fee_structure" varchar DEFAULT 'View Fee Structure',
  	"version_explore_more" varchar DEFAULT 'Explore More',
  	"version_admissions202526" varchar DEFAULT 'Admissions 2025–26',
  	"version_download_brochure" varchar DEFAULT 'Download Brochure',
  	"version_check_details" varchar DEFAULT 'Check Details',
  	"version_b_cat_details" varchar DEFAULT 'B-Cat Details',
  	"version_b_category" varchar DEFAULT 'B-Category',
  	"version_why_mlrit" varchar DEFAULT 'Why MLRIT',
  	"version_admissions" varchar DEFAULT '§ Admissions',
  	"version_scholarships" varchar DEFAULT 'Scholarships',
  	"version_five_steps_to" varchar DEFAULT 'Five steps to',
  	"version_scholarship" varchar DEFAULT 'Scholarship',
  	"version_fees" varchar DEFAULT 'Fees &',
  	"version_financial_support" varchar DEFAULT 'Financial Support',
  	"version_how_to_apply" varchar DEFAULT 'How to Apply',
  	"version_admissions2" varchar DEFAULT 'Admissions',
  	"version_your_seat" varchar DEFAULT 'your seat.',
  	"version_types" varchar DEFAULT 'types.',
  	"version_home" varchar DEFAULT 'Home',
  	"version__status" "payload"."enum__admissions_overview_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_counselling" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"dates_are_indicative_refer" varchar DEFAULT 'Dates are indicative. Refer to the official AP/TS EAMCET counselling website for confirmed schedules.',
  	"gate_qualified_candidates_may" varchar DEFAULT 'GATE qualified candidates may also be considered for direct admission subject to seat availability.',
  	"refer_to_the_official" varchar DEFAULT 'Refer to the official AP ICET / TS ICET website for confirmed schedules.',
  	"text30_of_seats_in" varchar DEFAULT '30% of seats in each branch are filled under Management Quota based on eligibility as per JNTU rules.',
  	"download_b_category_form" varchar DEFAULT 'Download B-Category Form',
  	"carry_originals_and_one" varchar DEFAULT 'Carry originals and one set of photocopies on the day of verification.',
  	"eligibility_criteria" varchar DEFAULT 'Eligibility Criteria',
  	"important_instructions" varchar DEFAULT 'Important Instructions',
  	"counselling_schedule" varchar DEFAULT 'Counselling Schedule',
  	"indicative_dates_for_ap" varchar DEFAULT 'Indicative dates for AP/TS state counselling rounds in 2025.',
  	"cutoff_ranks202425" varchar DEFAULT 'Cutoff Ranks 2024–25',
  	"how_to_apply" varchar DEFAULT 'How to Apply',
  	"step_by_step_walkthrough" varchar DEFAULT 'Step-by-step walkthrough from application to confirmation.',
  	"required_documents" varchar DEFAULT 'Required Documents',
  	"admission_process" varchar DEFAULT 'Admission Process',
  	"our_admissions_team_is" varchar DEFAULT 'Our admissions team is available Mon–Sat, 9 AM – 5 PM.',
  	"admissions_mlrinstitutions_ac_in" varchar DEFAULT 'admissions@mlrinstitutions.ac.in',
  	"need_help_with_admissions" varchar DEFAULT 'Need help with admissions?',
  	"admissions_helpdesk" varchar DEFAULT 'Admissions Helpdesk',
  	"_status" "payload"."enum_admissions_counselling_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_counselling_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_dates_are_indicative_refer" varchar DEFAULT 'Dates are indicative. Refer to the official AP/TS EAMCET counselling website for confirmed schedules.',
  	"version_gate_qualified_candidates_may" varchar DEFAULT 'GATE qualified candidates may also be considered for direct admission subject to seat availability.',
  	"version_refer_to_the_official" varchar DEFAULT 'Refer to the official AP ICET / TS ICET website for confirmed schedules.',
  	"version_text30_of_seats_in" varchar DEFAULT '30% of seats in each branch are filled under Management Quota based on eligibility as per JNTU rules.',
  	"version_download_b_category_form" varchar DEFAULT 'Download B-Category Form',
  	"version_carry_originals_and_one" varchar DEFAULT 'Carry originals and one set of photocopies on the day of verification.',
  	"version_eligibility_criteria" varchar DEFAULT 'Eligibility Criteria',
  	"version_important_instructions" varchar DEFAULT 'Important Instructions',
  	"version_counselling_schedule" varchar DEFAULT 'Counselling Schedule',
  	"version_indicative_dates_for_ap" varchar DEFAULT 'Indicative dates for AP/TS state counselling rounds in 2025.',
  	"version_cutoff_ranks202425" varchar DEFAULT 'Cutoff Ranks 2024–25',
  	"version_how_to_apply" varchar DEFAULT 'How to Apply',
  	"version_step_by_step_walkthrough" varchar DEFAULT 'Step-by-step walkthrough from application to confirmation.',
  	"version_required_documents" varchar DEFAULT 'Required Documents',
  	"version_admission_process" varchar DEFAULT 'Admission Process',
  	"version_our_admissions_team_is" varchar DEFAULT 'Our admissions team is available Mon–Sat, 9 AM – 5 PM.',
  	"version_admissions_mlrinstitutions_ac_in" varchar DEFAULT 'admissions@mlrinstitutions.ac.in',
  	"version_need_help_with_admissions" varchar DEFAULT 'Need help with admissions?',
  	"version_admissions_helpdesk" varchar DEFAULT 'Admissions Helpdesk',
  	"version__status" "payload"."enum__admissions_counselling_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_support" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"search_questions_e_g" varchar DEFAULT 'Search questions — e.g. ''hostel'', ''fee'', ''documents''…',
  	"info_mlrinstitutions_ac_in" varchar DEFAULT 'info@mlrinstitutions.ac.in',
  	"our_admissions_team_is" varchar DEFAULT 'Our admissions team is available Monday to Saturday, 9 AM – 5 PM.',
  	"telangana500043" varchar DEFAULT 'Telangana – 500 043',
  	"dundigal_v_survey_no" varchar DEFAULT 'Dundigal V, Survey No. 444, Dundigal,',
  	"gandi_maisamma_medchal_malkajgiri" varchar DEFAULT 'Gandi Maisamma, Medchal Malkajgiri,',
  	"still_have_questions" varchar DEFAULT 'Still have questions?',
  	"general_enquiries" varchar DEFAULT 'General Enquiries',
  	"official_address" varchar DEFAULT 'Official Address',
  	"key_contacts" varchar DEFAULT 'Key Contacts',
  	"search_faqs" varchar DEFAULT 'Search FAQs',
  	"designation" varchar DEFAULT 'Designation',
  	"eapcet_code" varchar DEFAULT 'EAPCET Code',
  	"reach_us" varchar DEFAULT 'Reach Us',
  	"contact" varchar DEFAULT 'Contact',
  	"email" varchar DEFAULT 'Email',
  	"name" varchar DEFAULT 'Name',
  	"_status" "payload"."enum_admissions_support_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_support_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_search_questions_e_g" varchar DEFAULT 'Search questions — e.g. ''hostel'', ''fee'', ''documents''…',
  	"version_info_mlrinstitutions_ac_in" varchar DEFAULT 'info@mlrinstitutions.ac.in',
  	"version_our_admissions_team_is" varchar DEFAULT 'Our admissions team is available Monday to Saturday, 9 AM – 5 PM.',
  	"version_telangana500043" varchar DEFAULT 'Telangana – 500 043',
  	"version_dundigal_v_survey_no" varchar DEFAULT 'Dundigal V, Survey No. 444, Dundigal,',
  	"version_gandi_maisamma_medchal_malkajgiri" varchar DEFAULT 'Gandi Maisamma, Medchal Malkajgiri,',
  	"version_still_have_questions" varchar DEFAULT 'Still have questions?',
  	"version_general_enquiries" varchar DEFAULT 'General Enquiries',
  	"version_official_address" varchar DEFAULT 'Official Address',
  	"version_key_contacts" varchar DEFAULT 'Key Contacts',
  	"version_search_faqs" varchar DEFAULT 'Search FAQs',
  	"version_designation" varchar DEFAULT 'Designation',
  	"version_eapcet_code" varchar DEFAULT 'EAPCET Code',
  	"version_reach_us" varchar DEFAULT 'Reach Us',
  	"version_contact" varchar DEFAULT 'Contact',
  	"version_email" varchar DEFAULT 'Email',
  	"version_name" varchar DEFAULT 'Name',
  	"version__status" "payload"."enum__admissions_support_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_scholarships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"students_may_also_benefit" varchar DEFAULT 'Students may also benefit from the following state and central government schemes: AP ePass / TS ePass fee reimbursement, Post-Matric Scholarship for SC/ST/OBC, EWS scholarships, and AICTE/UGC sponsored fellowships.',
  	"all_scholarship_and_fee" varchar DEFAULT 'All scholarship and fee-reimbursement applications must be submitted during or within 30 days of admission. Late applications may not be considered. For queries, contact the accounts or student affairs office.',
  	"telangana_epass_portal" varchar DEFAULT 'Telangana ePass Portal ↗',
  	"applications_are_processed_at" varchar DEFAULT 'Applications are processed at the time of admission',
  	"government_external_schemes" varchar DEFAULT 'Government & External Schemes',
  	"_status" "payload"."enum_admissions_scholarships_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_scholarships_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_students_may_also_benefit" varchar DEFAULT 'Students may also benefit from the following state and central government schemes: AP ePass / TS ePass fee reimbursement, Post-Matric Scholarship for SC/ST/OBC, EWS scholarships, and AICTE/UGC sponsored fellowships.',
  	"version_all_scholarship_and_fee" varchar DEFAULT 'All scholarship and fee-reimbursement applications must be submitted during or within 30 days of admission. Late applications may not be considered. For queries, contact the accounts or student affairs office.',
  	"version_telangana_epass_portal" varchar DEFAULT 'Telangana ePass Portal ↗',
  	"version_applications_are_processed_at" varchar DEFAULT 'Applications are processed at the time of admission',
  	"version_government_external_schemes" varchar DEFAULT 'Government & External Schemes',
  	"version__status" "payload"."enum__admissions_scholarships_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_by_degree" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"admission_criteria" varchar DEFAULT 'Admission Criteria',
  	"_status" "payload"."enum_admissions_by_degree_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_by_degree_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_admission_criteria" varchar DEFAULT 'Admission Criteria',
  	"version__status" "payload"."enum__admissions_by_degree_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."examinations_syllabus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"syllabus_data_for_this" varchar DEFAULT 'Syllabus data for this combination is not yet available.',
  	"subjects_appear_here_each" varchar DEFAULT 'Subjects appear here — each links to its official syllabus PDF',
  	"select_department_regulation_and" varchar DEFAULT 'Select department, regulation and semester above',
  	"check_exam_portal" varchar DEFAULT 'Check Exam Portal →',
  	"step1_department" varchar DEFAULT 'Step 1 — Department',
  	"step2_regulation" varchar DEFAULT 'Step 2 — Regulation',
  	"step3_semester" varchar DEFAULT 'Step 3 — Semester',
  	"no_semesters_available_for" varchar DEFAULT 'No semesters available for this combination.',
  	"_status" "payload"."enum_examinations_syllabus_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_examinations_syllabus_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_syllabus_data_for_this" varchar DEFAULT 'Syllabus data for this combination is not yet available.',
  	"version_subjects_appear_here_each" varchar DEFAULT 'Subjects appear here — each links to its official syllabus PDF',
  	"version_select_department_regulation_and" varchar DEFAULT 'Select department, regulation and semester above',
  	"version_check_exam_portal" varchar DEFAULT 'Check Exam Portal →',
  	"version_step1_department" varchar DEFAULT 'Step 1 — Department',
  	"version_step2_regulation" varchar DEFAULT 'Step 2 — Regulation',
  	"version_step3_semester" varchar DEFAULT 'Step 3 — Semester',
  	"version_no_semesters_available_for" varchar DEFAULT 'No semesters available for this combination.',
  	"version__status" "payload"."enum__examinations_syllabus_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."placements_alumni" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alumni_portal_link_will" varchar DEFAULT 'Alumni portal link will be published once confirmed by the institution.',
  	"alumni_portal_coming_soon" varchar DEFAULT 'Alumni Portal — Coming Soon',
  	"contact_t_p_cell" varchar DEFAULT 'Contact T&P Cell',
  	"alumni_network" varchar DEFAULT 'Alumni Network',
  	"member" varchar DEFAULT 'Member.',
  	"_status" "payload"."enum_placements_alumni_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_placements_alumni_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_alumni_portal_link_will" varchar DEFAULT 'Alumni portal link will be published once confirmed by the institution.',
  	"version_alumni_portal_coming_soon" varchar DEFAULT 'Alumni Portal — Coming Soon',
  	"version_contact_t_p_cell" varchar DEFAULT 'Contact T&P Cell',
  	"version_alumni_network" varchar DEFAULT 'Alumni Network',
  	"version_member" varchar DEFAULT 'Member.',
  	"version__status" "payload"."enum__placements_alumni_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."about_internal_governance" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"the_people_who_lead" varchar DEFAULT 'The people who lead and shape MLR Institute of Technology.',
  	"principal" varchar DEFAULT 'Principal.',
  	"leadership" varchar DEFAULT 'Leadership',
  	"_status" "payload"."enum_about_internal_governance_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_about_internal_governance_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_the_people_who_lead" varchar DEFAULT 'The people who lead and shape MLR Institute of Technology.',
  	"version_principal" varchar DEFAULT 'Principal.',
  	"version_leadership" varchar DEFAULT 'Leadership',
  	"version__status" "payload"."enum__about_internal_governance_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."site_faculty_profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"google_scholar" varchar DEFAULT 'Google Scholar',
  	"teaching_experience" varchar DEFAULT 'Teaching Experience',
  	"linkedin" varchar DEFAULT 'LinkedIn',
  	"scopus" varchar DEFAULT 'Scopus',
  	"profiles" varchar DEFAULT 'Profiles',
  	"designation" varchar DEFAULT 'Designation',
  	"department" varchar DEFAULT 'Department',
  	"emp_id" varchar DEFAULT 'Emp ID',
  	"email" varchar DEFAULT 'Email',
  	"academic_qualifications" varchar DEFAULT 'Academic Qualifications',
  	"areas_of_specialisation" varchar DEFAULT 'Areas of Specialisation',
  	"books_book_chapters" varchar DEFAULT 'Books & Book Chapters',
  	"subjects_taught" varchar DEFAULT 'Subjects Taught',
  	"publications" varchar DEFAULT 'Publications',
  	"profile" varchar DEFAULT 'Profile',
  	"patents" varchar DEFAULT 'Patents',
  	"_status" "payload"."enum_site_faculty_profile_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_site_faculty_profile_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_google_scholar" varchar DEFAULT 'Google Scholar',
  	"version_teaching_experience" varchar DEFAULT 'Teaching Experience',
  	"version_linkedin" varchar DEFAULT 'LinkedIn',
  	"version_scopus" varchar DEFAULT 'Scopus',
  	"version_profiles" varchar DEFAULT 'Profiles',
  	"version_designation" varchar DEFAULT 'Designation',
  	"version_department" varchar DEFAULT 'Department',
  	"version_emp_id" varchar DEFAULT 'Emp ID',
  	"version_email" varchar DEFAULT 'Email',
  	"version_academic_qualifications" varchar DEFAULT 'Academic Qualifications',
  	"version_areas_of_specialisation" varchar DEFAULT 'Areas of Specialisation',
  	"version_books_book_chapters" varchar DEFAULT 'Books & Book Chapters',
  	"version_subjects_taught" varchar DEFAULT 'Subjects Taught',
  	"version_publications" varchar DEFAULT 'Publications',
  	"version_profile" varchar DEFAULT 'Profile',
  	"version_patents" varchar DEFAULT 'Patents',
  	"version__status" "payload"."enum__site_faculty_profile_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."site_research_profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"research_areas" varchar DEFAULT 'research areas',
  	"_status" "payload"."enum_site_research_profile_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_site_research_profile_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_research_areas" varchar DEFAULT 'research areas',
  	"version__status" "payload"."enum__site_research_profile_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."site_syllabus_regulation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_pdf" varchar DEFAULT 'View PDF ↗',
  	"other_regulations" varchar DEFAULT 'Other Regulations',
  	"syllabus" varchar DEFAULT 'Syllabus',
  	"subject" varchar DEFAULT 'Subject',
  	"code" varchar DEFAULT 'Code',
  	"_status" "payload"."enum_site_syllabus_regulation_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_site_syllabus_regulation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_pdf" varchar DEFAULT 'View PDF ↗',
  	"version_other_regulations" varchar DEFAULT 'Other Regulations',
  	"version_syllabus" varchar DEFAULT 'Syllabus',
  	"version_subject" varchar DEFAULT 'Subject',
  	"version_code" varchar DEFAULT 'Code',
  	"version__status" "payload"."enum__site_syllabus_regulation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."site_syllabus_semester" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"view_pdf" varchar DEFAULT 'View PDF ↗',
  	"other_semesters" varchar DEFAULT 'Other semesters',
  	"syllabus" varchar DEFAULT 'Syllabus',
  	"courses" varchar DEFAULT 'Courses',
  	"subject" varchar DEFAULT 'Subject',
  	"code" varchar DEFAULT 'Code',
  	"_status" "payload"."enum_site_syllabus_semester_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_site_syllabus_semester_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_view_pdf" varchar DEFAULT 'View PDF ↗',
  	"version_other_semesters" varchar DEFAULT 'Other semesters',
  	"version_syllabus" varchar DEFAULT 'Syllabus',
  	"version_courses" varchar DEFAULT 'Courses',
  	"version_subject" varchar DEFAULT 'Subject',
  	"version_code" varchar DEFAULT 'Code',
  	"version__status" "payload"."enum__site_syllabus_semester_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."admissions_policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"students_admitted_to_mlrit" varchar DEFAULT 'Students admitted to MLRIT are expected to abide by the rules and regulations of the institution. Violation of the code of conduct may result in disciplinary action up to and including expulsion.',
  	"reservation_percentages_are_indicative" varchar DEFAULT 'Reservation percentages are indicative and subject to state government notifications for the respective academic year. Inter-se merit within each category is the basis for seat allotment.',
  	"mlrit_does_not_discriminate" varchar DEFAULT 'MLRIT does not discriminate on the basis of gender, religion, caste, race or place of birth. All eligible candidates who have secured a valid rank are welcome to seek admission.',
  	"policies_are_subject_to" varchar DEFAULT 'Policies are subject to revision as per regulatory directives. This page was last updated June 2025. For the most current version, contact the MLRIT administrative office.',
  	"mlrit_has_a_multi" varchar DEFAULT 'MLRIT has a multi-tier grievance redressal mechanism to ensure all student concerns are addressed fairly and promptly.',
  	"or_dropped_in_the" varchar DEFAULT 'or dropped in the grievance box at the administrative office.',
  	"written_grievances_may_also" varchar DEFAULT 'Written grievances may also be submitted via email to',
  	"grievance_mlrit_ac_in" varchar DEFAULT 'grievance@mlrit.ac.in',
  	"management_quota" varchar DEFAULT 'Management Quota',
  	"mlrit_helpline" varchar DEFAULT 'MLRIT Helpline:',
  	"convener_quota" varchar DEFAULT 'Convener Quota',
  	"ugc_helpline" varchar DEFAULT 'UGC Helpline:',
  	"category" varchar DEFAULT 'Category',
  	"_status" "payload"."enum_admissions_policies_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_admissions_policies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_students_admitted_to_mlrit" varchar DEFAULT 'Students admitted to MLRIT are expected to abide by the rules and regulations of the institution. Violation of the code of conduct may result in disciplinary action up to and including expulsion.',
  	"version_reservation_percentages_are_indicative" varchar DEFAULT 'Reservation percentages are indicative and subject to state government notifications for the respective academic year. Inter-se merit within each category is the basis for seat allotment.',
  	"version_mlrit_does_not_discriminate" varchar DEFAULT 'MLRIT does not discriminate on the basis of gender, religion, caste, race or place of birth. All eligible candidates who have secured a valid rank are welcome to seek admission.',
  	"version_policies_are_subject_to" varchar DEFAULT 'Policies are subject to revision as per regulatory directives. This page was last updated June 2025. For the most current version, contact the MLRIT administrative office.',
  	"version_mlrit_has_a_multi" varchar DEFAULT 'MLRIT has a multi-tier grievance redressal mechanism to ensure all student concerns are addressed fairly and promptly.',
  	"version_or_dropped_in_the" varchar DEFAULT 'or dropped in the grievance box at the administrative office.',
  	"version_written_grievances_may_also" varchar DEFAULT 'Written grievances may also be submitted via email to',
  	"version_grievance_mlrit_ac_in" varchar DEFAULT 'grievance@mlrit.ac.in',
  	"version_management_quota" varchar DEFAULT 'Management Quota',
  	"version_mlrit_helpline" varchar DEFAULT 'MLRIT Helpline:',
  	"version_convener_quota" varchar DEFAULT 'Convener Quota',
  	"version_ugc_helpline" varchar DEFAULT 'UGC Helpline:',
  	"version_category" varchar DEFAULT 'Category',
  	"version__status" "payload"."enum__admissions_policies_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload"."users_sections" ADD CONSTRAINT "users_sections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_stats_stats" ADD CONSTRAINT "home_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_stats_v_version_stats" ADD CONSTRAINT "_home_stats_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_stats_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_achievements_logos" ADD CONSTRAINT "home_achievements_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_achievements_ranks" ADD CONSTRAINT "home_achievements_ranks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_achievements_v_version_logos" ADD CONSTRAINT "_home_achievements_v_version_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_achievements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_achievements_v_version_ranks" ADD CONSTRAINT "_home_achievements_v_version_ranks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_achievements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_programs_ug" ADD CONSTRAINT "home_programs_ug_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_programs_pg" ADD CONSTRAINT "home_programs_pg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_programs_v_version_ug" ADD CONSTRAINT "_home_programs_v_version_ug_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_programs_v_version_pg" ADD CONSTRAINT "_home_programs_v_version_pg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_success_stories_cards" ADD CONSTRAINT "home_success_stories_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_success_stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_success_stories_v_version_cards" ADD CONSTRAINT "_home_success_stories_v_version_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_success_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_testimonials_people" ADD CONSTRAINT "home_testimonials_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_testimonials_v_version_people" ADD CONSTRAINT "_home_testimonials_v_version_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_events_slides" ADD CONSTRAINT "home_events_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_events_v_version_slides" ADD CONSTRAINT "_home_events_v_version_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_placements_stats" ADD CONSTRAINT "home_placements_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home_placements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_home_placements_v_version_stats" ADD CONSTRAINT "_home_placements_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_home_placements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."placements_track_record_years" ADD CONSTRAINT "placements_track_record_years_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."placements_track_record"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."placements_track_record_companies" ADD CONSTRAINT "placements_track_record_companies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."placements_track_record"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_placements_track_record_v_version_years" ADD CONSTRAINT "_placements_track_record_v_version_years_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_placements_track_record_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_placements_track_record_v_version_companies" ADD CONSTRAINT "_placements_track_record_v_version_companies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_placements_track_record_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."placements_statistics_highlights" ADD CONSTRAINT "placements_statistics_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."placements_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."placements_statistics_infrastructure" ADD CONSTRAINT "placements_statistics_infrastructure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."placements_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."placements_statistics_infra_stats" ADD CONSTRAINT "placements_statistics_infra_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."placements_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_placements_statistics_v_version_highlights" ADD CONSTRAINT "_placements_statistics_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_placements_statistics_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_placements_statistics_v_version_infrastructure" ADD CONSTRAINT "_placements_statistics_v_version_infrastructure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_placements_statistics_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_placements_statistics_v_version_infra_stats" ADD CONSTRAINT "_placements_statistics_v_version_infra_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_placements_statistics_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."placements_mous_mous" ADD CONSTRAINT "placements_mous_mous_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."placements_mous"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_placements_mous_v_version_mous" ADD CONSTRAINT "_placements_mous_v_version_mous_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_placements_mous_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."placements_support_contacts" ADD CONSTRAINT "placements_support_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."placements_support"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_placements_support_v_version_contacts" ADD CONSTRAINT "_placements_support_v_version_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_placements_support_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."placements_recruiters_logos" ADD CONSTRAINT "placements_recruiters_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."placements_recruiters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_placements_recruiters_v_version_logos" ADD CONSTRAINT "_placements_recruiters_v_version_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_placements_recruiters_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_aqar_facts" ADD CONSTRAINT "iqac_aqar_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_aqar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_aqar_reports" ADD CONSTRAINT "iqac_aqar_reports_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_aqar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_aqar_v_version_facts" ADD CONSTRAINT "_iqac_aqar_v_version_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_aqar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_aqar_v_version_reports" ADD CONSTRAINT "_iqac_aqar_v_version_reports_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_aqar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_best_practices_practices" ADD CONSTRAINT "iqac_best_practices_practices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_best_practices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_best_practices_v_version_practices" ADD CONSTRAINT "_iqac_best_practices_v_version_practices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_best_practices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_functions_functions" ADD CONSTRAINT "iqac_functions_functions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_functions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_functions_steps" ADD CONSTRAINT "iqac_functions_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_functions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_functions_v_version_functions" ADD CONSTRAINT "_iqac_functions_v_version_functions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_functions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_functions_v_version_steps" ADD CONSTRAINT "_iqac_functions_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_functions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_objectives_objectives" ADD CONSTRAINT "iqac_objectives_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_objectives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_objectives_commitments" ADD CONSTRAINT "iqac_objectives_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_objectives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_objectives_v_version_objectives" ADD CONSTRAINT "_iqac_objectives_v_version_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_objectives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_objectives_v_version_commitments" ADD CONSTRAINT "_iqac_objectives_v_version_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_objectives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_overview_mission" ADD CONSTRAINT "iqac_overview_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_overview_commitments" ADD CONSTRAINT "iqac_overview_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_overview_frameworks" ADD CONSTRAINT "iqac_overview_frameworks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_overview_v_version_mission" ADD CONSTRAINT "_iqac_overview_v_version_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_overview_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_overview_v_version_commitments" ADD CONSTRAINT "_iqac_overview_v_version_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_overview_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_overview_v_version_frameworks" ADD CONSTRAINT "_iqac_overview_v_version_frameworks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_overview_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_initiatives_initiatives" ADD CONSTRAINT "iqac_initiatives_initiatives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_initiatives_responsibilities" ADD CONSTRAINT "iqac_initiatives_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_initiatives_v_version_initiatives" ADD CONSTRAINT "_iqac_initiatives_v_version_initiatives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_initiatives_v_version_responsibilities" ADD CONSTRAINT "_iqac_initiatives_v_version_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_support_contacts" ADD CONSTRAINT "iqac_support_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_support"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_support_v_version_contacts" ADD CONSTRAINT "_iqac_support_v_version_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_support_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_reports_aqar" ADD CONSTRAINT "iqac_reports_aqar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_reports_minutes" ADD CONSTRAINT "iqac_reports_minutes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_reports_other" ADD CONSTRAINT "iqac_reports_other_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_reports_v_version_aqar" ADD CONSTRAINT "_iqac_reports_v_version_aqar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_reports_v_version_minutes" ADD CONSTRAINT "_iqac_reports_v_version_minutes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_reports_v_version_other" ADD CONSTRAINT "_iqac_reports_v_version_other_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_feedback_types" ADD CONSTRAINT "iqac_feedback_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_feedback"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_feedback_v_version_types" ADD CONSTRAINT "_iqac_feedback_v_version_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_feedback_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_contact_details" ADD CONSTRAINT "iqac_contact_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_contact_v_version_details" ADD CONSTRAINT "_iqac_contact_v_version_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_contact_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."iqac_nba_programmes" ADD CONSTRAINT "iqac_nba_programmes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."iqac_nba"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_iqac_nba_v_version_programmes" ADD CONSTRAINT "_iqac_nba_v_version_programmes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_iqac_nba_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_page_headers_headers" ADD CONSTRAINT "site_page_headers_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_page_headers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_site_page_headers_v_version_headers" ADD CONSTRAINT "_site_page_headers_v_version_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_site_page_headers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."info_pages_pages" ADD CONSTRAINT "info_pages_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."info_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_info_pages_v_version_pages" ADD CONSTRAINT "_info_pages_v_version_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_info_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_footer_links" ADD CONSTRAINT "site_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_footer_logos" ADD CONSTRAINT "site_footer_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_footer_badges" ADD CONSTRAINT "site_footer_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_site_footer_v_version_links" ADD CONSTRAINT "_site_footer_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_site_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_site_footer_v_version_logos" ADD CONSTRAINT "_site_footer_v_version_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_site_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_site_footer_v_version_badges" ADD CONSTRAINT "_site_footer_v_version_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_site_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sections_order_idx" ON "payload"."users_sections" USING btree ("order");
  CREATE INDEX "users_sections_parent_idx" ON "payload"."users_sections" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "payload"."media" USING btree ("sizes_thumbnail_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_hero__status_idx" ON "payload"."home_hero" USING btree ("_status");
  CREATE INDEX "_home_hero_v_version_version__status_idx" ON "payload"."_home_hero_v" USING btree ("version__status");
  CREATE INDEX "_home_hero_v_created_at_idx" ON "payload"."_home_hero_v" USING btree ("created_at");
  CREATE INDEX "_home_hero_v_updated_at_idx" ON "payload"."_home_hero_v" USING btree ("updated_at");
  CREATE INDEX "_home_hero_v_latest_idx" ON "payload"."_home_hero_v" USING btree ("latest");
  CREATE INDEX "home_stats_stats_order_idx" ON "payload"."home_stats_stats" USING btree ("_order");
  CREATE INDEX "home_stats_stats_parent_id_idx" ON "payload"."home_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "home_stats__status_idx" ON "payload"."home_stats" USING btree ("_status");
  CREATE INDEX "_home_stats_v_version_stats_order_idx" ON "payload"."_home_stats_v_version_stats" USING btree ("_order");
  CREATE INDEX "_home_stats_v_version_stats_parent_id_idx" ON "payload"."_home_stats_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_stats_v_version_version__status_idx" ON "payload"."_home_stats_v" USING btree ("version__status");
  CREATE INDEX "_home_stats_v_created_at_idx" ON "payload"."_home_stats_v" USING btree ("created_at");
  CREATE INDEX "_home_stats_v_updated_at_idx" ON "payload"."_home_stats_v" USING btree ("updated_at");
  CREATE INDEX "_home_stats_v_latest_idx" ON "payload"."_home_stats_v" USING btree ("latest");
  CREATE INDEX "home_achievements_logos_order_idx" ON "payload"."home_achievements_logos" USING btree ("_order");
  CREATE INDEX "home_achievements_logos_parent_id_idx" ON "payload"."home_achievements_logos" USING btree ("_parent_id");
  CREATE INDEX "home_achievements_ranks_order_idx" ON "payload"."home_achievements_ranks" USING btree ("_order");
  CREATE INDEX "home_achievements_ranks_parent_id_idx" ON "payload"."home_achievements_ranks" USING btree ("_parent_id");
  CREATE INDEX "home_achievements__status_idx" ON "payload"."home_achievements" USING btree ("_status");
  CREATE INDEX "_home_achievements_v_version_logos_order_idx" ON "payload"."_home_achievements_v_version_logos" USING btree ("_order");
  CREATE INDEX "_home_achievements_v_version_logos_parent_id_idx" ON "payload"."_home_achievements_v_version_logos" USING btree ("_parent_id");
  CREATE INDEX "_home_achievements_v_version_ranks_order_idx" ON "payload"."_home_achievements_v_version_ranks" USING btree ("_order");
  CREATE INDEX "_home_achievements_v_version_ranks_parent_id_idx" ON "payload"."_home_achievements_v_version_ranks" USING btree ("_parent_id");
  CREATE INDEX "_home_achievements_v_version_version__status_idx" ON "payload"."_home_achievements_v" USING btree ("version__status");
  CREATE INDEX "_home_achievements_v_created_at_idx" ON "payload"."_home_achievements_v" USING btree ("created_at");
  CREATE INDEX "_home_achievements_v_updated_at_idx" ON "payload"."_home_achievements_v" USING btree ("updated_at");
  CREATE INDEX "_home_achievements_v_latest_idx" ON "payload"."_home_achievements_v" USING btree ("latest");
  CREATE INDEX "home_programs_ug_order_idx" ON "payload"."home_programs_ug" USING btree ("_order");
  CREATE INDEX "home_programs_ug_parent_id_idx" ON "payload"."home_programs_ug" USING btree ("_parent_id");
  CREATE INDEX "home_programs_pg_order_idx" ON "payload"."home_programs_pg" USING btree ("_order");
  CREATE INDEX "home_programs_pg_parent_id_idx" ON "payload"."home_programs_pg" USING btree ("_parent_id");
  CREATE INDEX "home_programs__status_idx" ON "payload"."home_programs" USING btree ("_status");
  CREATE INDEX "_home_programs_v_version_ug_order_idx" ON "payload"."_home_programs_v_version_ug" USING btree ("_order");
  CREATE INDEX "_home_programs_v_version_ug_parent_id_idx" ON "payload"."_home_programs_v_version_ug" USING btree ("_parent_id");
  CREATE INDEX "_home_programs_v_version_pg_order_idx" ON "payload"."_home_programs_v_version_pg" USING btree ("_order");
  CREATE INDEX "_home_programs_v_version_pg_parent_id_idx" ON "payload"."_home_programs_v_version_pg" USING btree ("_parent_id");
  CREATE INDEX "_home_programs_v_version_version__status_idx" ON "payload"."_home_programs_v" USING btree ("version__status");
  CREATE INDEX "_home_programs_v_created_at_idx" ON "payload"."_home_programs_v" USING btree ("created_at");
  CREATE INDEX "_home_programs_v_updated_at_idx" ON "payload"."_home_programs_v" USING btree ("updated_at");
  CREATE INDEX "_home_programs_v_latest_idx" ON "payload"."_home_programs_v" USING btree ("latest");
  CREATE INDEX "home_why_mlrit__status_idx" ON "payload"."home_why_mlrit" USING btree ("_status");
  CREATE INDEX "_home_why_mlrit_v_version_version__status_idx" ON "payload"."_home_why_mlrit_v" USING btree ("version__status");
  CREATE INDEX "_home_why_mlrit_v_created_at_idx" ON "payload"."_home_why_mlrit_v" USING btree ("created_at");
  CREATE INDEX "_home_why_mlrit_v_updated_at_idx" ON "payload"."_home_why_mlrit_v" USING btree ("updated_at");
  CREATE INDEX "_home_why_mlrit_v_latest_idx" ON "payload"."_home_why_mlrit_v" USING btree ("latest");
  CREATE INDEX "home_success_stories_cards_order_idx" ON "payload"."home_success_stories_cards" USING btree ("_order");
  CREATE INDEX "home_success_stories_cards_parent_id_idx" ON "payload"."home_success_stories_cards" USING btree ("_parent_id");
  CREATE INDEX "home_success_stories__status_idx" ON "payload"."home_success_stories" USING btree ("_status");
  CREATE INDEX "_home_success_stories_v_version_cards_order_idx" ON "payload"."_home_success_stories_v_version_cards" USING btree ("_order");
  CREATE INDEX "_home_success_stories_v_version_cards_parent_id_idx" ON "payload"."_home_success_stories_v_version_cards" USING btree ("_parent_id");
  CREATE INDEX "_home_success_stories_v_version_version__status_idx" ON "payload"."_home_success_stories_v" USING btree ("version__status");
  CREATE INDEX "_home_success_stories_v_created_at_idx" ON "payload"."_home_success_stories_v" USING btree ("created_at");
  CREATE INDEX "_home_success_stories_v_updated_at_idx" ON "payload"."_home_success_stories_v" USING btree ("updated_at");
  CREATE INDEX "_home_success_stories_v_latest_idx" ON "payload"."_home_success_stories_v" USING btree ("latest");
  CREATE INDEX "home_testimonials_people_order_idx" ON "payload"."home_testimonials_people" USING btree ("_order");
  CREATE INDEX "home_testimonials_people_parent_id_idx" ON "payload"."home_testimonials_people" USING btree ("_parent_id");
  CREATE INDEX "home_testimonials__status_idx" ON "payload"."home_testimonials" USING btree ("_status");
  CREATE INDEX "_home_testimonials_v_version_people_order_idx" ON "payload"."_home_testimonials_v_version_people" USING btree ("_order");
  CREATE INDEX "_home_testimonials_v_version_people_parent_id_idx" ON "payload"."_home_testimonials_v_version_people" USING btree ("_parent_id");
  CREATE INDEX "_home_testimonials_v_version_version__status_idx" ON "payload"."_home_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_home_testimonials_v_created_at_idx" ON "payload"."_home_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_home_testimonials_v_updated_at_idx" ON "payload"."_home_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_home_testimonials_v_latest_idx" ON "payload"."_home_testimonials_v" USING btree ("latest");
  CREATE INDEX "home_events_slides_order_idx" ON "payload"."home_events_slides" USING btree ("_order");
  CREATE INDEX "home_events_slides_parent_id_idx" ON "payload"."home_events_slides" USING btree ("_parent_id");
  CREATE INDEX "home_events__status_idx" ON "payload"."home_events" USING btree ("_status");
  CREATE INDEX "_home_events_v_version_slides_order_idx" ON "payload"."_home_events_v_version_slides" USING btree ("_order");
  CREATE INDEX "_home_events_v_version_slides_parent_id_idx" ON "payload"."_home_events_v_version_slides" USING btree ("_parent_id");
  CREATE INDEX "_home_events_v_version_version__status_idx" ON "payload"."_home_events_v" USING btree ("version__status");
  CREATE INDEX "_home_events_v_created_at_idx" ON "payload"."_home_events_v" USING btree ("created_at");
  CREATE INDEX "_home_events_v_updated_at_idx" ON "payload"."_home_events_v" USING btree ("updated_at");
  CREATE INDEX "_home_events_v_latest_idx" ON "payload"."_home_events_v" USING btree ("latest");
  CREATE INDEX "home_placements_stats_order_idx" ON "payload"."home_placements_stats" USING btree ("_order");
  CREATE INDEX "home_placements_stats_parent_id_idx" ON "payload"."home_placements_stats" USING btree ("_parent_id");
  CREATE INDEX "home_placements__status_idx" ON "payload"."home_placements" USING btree ("_status");
  CREATE INDEX "_home_placements_v_version_stats_order_idx" ON "payload"."_home_placements_v_version_stats" USING btree ("_order");
  CREATE INDEX "_home_placements_v_version_stats_parent_id_idx" ON "payload"."_home_placements_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_placements_v_version_version__status_idx" ON "payload"."_home_placements_v" USING btree ("version__status");
  CREATE INDEX "_home_placements_v_created_at_idx" ON "payload"."_home_placements_v" USING btree ("created_at");
  CREATE INDEX "_home_placements_v_updated_at_idx" ON "payload"."_home_placements_v" USING btree ("updated_at");
  CREATE INDEX "_home_placements_v_latest_idx" ON "payload"."_home_placements_v" USING btree ("latest");
  CREATE INDEX "placements_track_record_years_order_idx" ON "payload"."placements_track_record_years" USING btree ("_order");
  CREATE INDEX "placements_track_record_years_parent_id_idx" ON "payload"."placements_track_record_years" USING btree ("_parent_id");
  CREATE INDEX "placements_track_record_companies_order_idx" ON "payload"."placements_track_record_companies" USING btree ("_order");
  CREATE INDEX "placements_track_record_companies_parent_id_idx" ON "payload"."placements_track_record_companies" USING btree ("_parent_id");
  CREATE INDEX "placements_track_record__status_idx" ON "payload"."placements_track_record" USING btree ("_status");
  CREATE INDEX "_placements_track_record_v_version_years_order_idx" ON "payload"."_placements_track_record_v_version_years" USING btree ("_order");
  CREATE INDEX "_placements_track_record_v_version_years_parent_id_idx" ON "payload"."_placements_track_record_v_version_years" USING btree ("_parent_id");
  CREATE INDEX "_placements_track_record_v_version_companies_order_idx" ON "payload"."_placements_track_record_v_version_companies" USING btree ("_order");
  CREATE INDEX "_placements_track_record_v_version_companies_parent_id_idx" ON "payload"."_placements_track_record_v_version_companies" USING btree ("_parent_id");
  CREATE INDEX "_placements_track_record_v_version_version__status_idx" ON "payload"."_placements_track_record_v" USING btree ("version__status");
  CREATE INDEX "_placements_track_record_v_created_at_idx" ON "payload"."_placements_track_record_v" USING btree ("created_at");
  CREATE INDEX "_placements_track_record_v_updated_at_idx" ON "payload"."_placements_track_record_v" USING btree ("updated_at");
  CREATE INDEX "_placements_track_record_v_latest_idx" ON "payload"."_placements_track_record_v" USING btree ("latest");
  CREATE INDEX "placements_statistics_highlights_order_idx" ON "payload"."placements_statistics_highlights" USING btree ("_order");
  CREATE INDEX "placements_statistics_highlights_parent_id_idx" ON "payload"."placements_statistics_highlights" USING btree ("_parent_id");
  CREATE INDEX "placements_statistics_infrastructure_order_idx" ON "payload"."placements_statistics_infrastructure" USING btree ("_order");
  CREATE INDEX "placements_statistics_infrastructure_parent_id_idx" ON "payload"."placements_statistics_infrastructure" USING btree ("_parent_id");
  CREATE INDEX "placements_statistics_infra_stats_order_idx" ON "payload"."placements_statistics_infra_stats" USING btree ("_order");
  CREATE INDEX "placements_statistics_infra_stats_parent_id_idx" ON "payload"."placements_statistics_infra_stats" USING btree ("_parent_id");
  CREATE INDEX "placements_statistics__status_idx" ON "payload"."placements_statistics" USING btree ("_status");
  CREATE INDEX "_placements_statistics_v_version_highlights_order_idx" ON "payload"."_placements_statistics_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_placements_statistics_v_version_highlights_parent_id_idx" ON "payload"."_placements_statistics_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_placements_statistics_v_version_infrastructure_order_idx" ON "payload"."_placements_statistics_v_version_infrastructure" USING btree ("_order");
  CREATE INDEX "_placements_statistics_v_version_infrastructure_parent_id_idx" ON "payload"."_placements_statistics_v_version_infrastructure" USING btree ("_parent_id");
  CREATE INDEX "_placements_statistics_v_version_infra_stats_order_idx" ON "payload"."_placements_statistics_v_version_infra_stats" USING btree ("_order");
  CREATE INDEX "_placements_statistics_v_version_infra_stats_parent_id_idx" ON "payload"."_placements_statistics_v_version_infra_stats" USING btree ("_parent_id");
  CREATE INDEX "_placements_statistics_v_version_version__status_idx" ON "payload"."_placements_statistics_v" USING btree ("version__status");
  CREATE INDEX "_placements_statistics_v_created_at_idx" ON "payload"."_placements_statistics_v" USING btree ("created_at");
  CREATE INDEX "_placements_statistics_v_updated_at_idx" ON "payload"."_placements_statistics_v" USING btree ("updated_at");
  CREATE INDEX "_placements_statistics_v_latest_idx" ON "payload"."_placements_statistics_v" USING btree ("latest");
  CREATE INDEX "placements_mous_mous_order_idx" ON "payload"."placements_mous_mous" USING btree ("_order");
  CREATE INDEX "placements_mous_mous_parent_id_idx" ON "payload"."placements_mous_mous" USING btree ("_parent_id");
  CREATE INDEX "placements_mous__status_idx" ON "payload"."placements_mous" USING btree ("_status");
  CREATE INDEX "_placements_mous_v_version_mous_order_idx" ON "payload"."_placements_mous_v_version_mous" USING btree ("_order");
  CREATE INDEX "_placements_mous_v_version_mous_parent_id_idx" ON "payload"."_placements_mous_v_version_mous" USING btree ("_parent_id");
  CREATE INDEX "_placements_mous_v_version_version__status_idx" ON "payload"."_placements_mous_v" USING btree ("version__status");
  CREATE INDEX "_placements_mous_v_created_at_idx" ON "payload"."_placements_mous_v" USING btree ("created_at");
  CREATE INDEX "_placements_mous_v_updated_at_idx" ON "payload"."_placements_mous_v" USING btree ("updated_at");
  CREATE INDEX "_placements_mous_v_latest_idx" ON "payload"."_placements_mous_v" USING btree ("latest");
  CREATE INDEX "placements_support_contacts_order_idx" ON "payload"."placements_support_contacts" USING btree ("_order");
  CREATE INDEX "placements_support_contacts_parent_id_idx" ON "payload"."placements_support_contacts" USING btree ("_parent_id");
  CREATE INDEX "placements_support__status_idx" ON "payload"."placements_support" USING btree ("_status");
  CREATE INDEX "_placements_support_v_version_contacts_order_idx" ON "payload"."_placements_support_v_version_contacts" USING btree ("_order");
  CREATE INDEX "_placements_support_v_version_contacts_parent_id_idx" ON "payload"."_placements_support_v_version_contacts" USING btree ("_parent_id");
  CREATE INDEX "_placements_support_v_version_version__status_idx" ON "payload"."_placements_support_v" USING btree ("version__status");
  CREATE INDEX "_placements_support_v_created_at_idx" ON "payload"."_placements_support_v" USING btree ("created_at");
  CREATE INDEX "_placements_support_v_updated_at_idx" ON "payload"."_placements_support_v" USING btree ("updated_at");
  CREATE INDEX "_placements_support_v_latest_idx" ON "payload"."_placements_support_v" USING btree ("latest");
  CREATE INDEX "placements_recruiters_logos_order_idx" ON "payload"."placements_recruiters_logos" USING btree ("_order");
  CREATE INDEX "placements_recruiters_logos_parent_id_idx" ON "payload"."placements_recruiters_logos" USING btree ("_parent_id");
  CREATE INDEX "placements_recruiters__status_idx" ON "payload"."placements_recruiters" USING btree ("_status");
  CREATE INDEX "_placements_recruiters_v_version_logos_order_idx" ON "payload"."_placements_recruiters_v_version_logos" USING btree ("_order");
  CREATE INDEX "_placements_recruiters_v_version_logos_parent_id_idx" ON "payload"."_placements_recruiters_v_version_logos" USING btree ("_parent_id");
  CREATE INDEX "_placements_recruiters_v_version_version__status_idx" ON "payload"."_placements_recruiters_v" USING btree ("version__status");
  CREATE INDEX "_placements_recruiters_v_created_at_idx" ON "payload"."_placements_recruiters_v" USING btree ("created_at");
  CREATE INDEX "_placements_recruiters_v_updated_at_idx" ON "payload"."_placements_recruiters_v" USING btree ("updated_at");
  CREATE INDEX "_placements_recruiters_v_latest_idx" ON "payload"."_placements_recruiters_v" USING btree ("latest");
  CREATE INDEX "iqac_aqar_facts_order_idx" ON "payload"."iqac_aqar_facts" USING btree ("_order");
  CREATE INDEX "iqac_aqar_facts_parent_id_idx" ON "payload"."iqac_aqar_facts" USING btree ("_parent_id");
  CREATE INDEX "iqac_aqar_reports_order_idx" ON "payload"."iqac_aqar_reports" USING btree ("_order");
  CREATE INDEX "iqac_aqar_reports_parent_id_idx" ON "payload"."iqac_aqar_reports" USING btree ("_parent_id");
  CREATE INDEX "iqac_aqar__status_idx" ON "payload"."iqac_aqar" USING btree ("_status");
  CREATE INDEX "_iqac_aqar_v_version_facts_order_idx" ON "payload"."_iqac_aqar_v_version_facts" USING btree ("_order");
  CREATE INDEX "_iqac_aqar_v_version_facts_parent_id_idx" ON "payload"."_iqac_aqar_v_version_facts" USING btree ("_parent_id");
  CREATE INDEX "_iqac_aqar_v_version_reports_order_idx" ON "payload"."_iqac_aqar_v_version_reports" USING btree ("_order");
  CREATE INDEX "_iqac_aqar_v_version_reports_parent_id_idx" ON "payload"."_iqac_aqar_v_version_reports" USING btree ("_parent_id");
  CREATE INDEX "_iqac_aqar_v_version_version__status_idx" ON "payload"."_iqac_aqar_v" USING btree ("version__status");
  CREATE INDEX "_iqac_aqar_v_created_at_idx" ON "payload"."_iqac_aqar_v" USING btree ("created_at");
  CREATE INDEX "_iqac_aqar_v_updated_at_idx" ON "payload"."_iqac_aqar_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_aqar_v_latest_idx" ON "payload"."_iqac_aqar_v" USING btree ("latest");
  CREATE INDEX "iqac_best_practices_practices_order_idx" ON "payload"."iqac_best_practices_practices" USING btree ("_order");
  CREATE INDEX "iqac_best_practices_practices_parent_id_idx" ON "payload"."iqac_best_practices_practices" USING btree ("_parent_id");
  CREATE INDEX "iqac_best_practices__status_idx" ON "payload"."iqac_best_practices" USING btree ("_status");
  CREATE INDEX "_iqac_best_practices_v_version_practices_order_idx" ON "payload"."_iqac_best_practices_v_version_practices" USING btree ("_order");
  CREATE INDEX "_iqac_best_practices_v_version_practices_parent_id_idx" ON "payload"."_iqac_best_practices_v_version_practices" USING btree ("_parent_id");
  CREATE INDEX "_iqac_best_practices_v_version_version__status_idx" ON "payload"."_iqac_best_practices_v" USING btree ("version__status");
  CREATE INDEX "_iqac_best_practices_v_created_at_idx" ON "payload"."_iqac_best_practices_v" USING btree ("created_at");
  CREATE INDEX "_iqac_best_practices_v_updated_at_idx" ON "payload"."_iqac_best_practices_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_best_practices_v_latest_idx" ON "payload"."_iqac_best_practices_v" USING btree ("latest");
  CREATE INDEX "iqac_functions_functions_order_idx" ON "payload"."iqac_functions_functions" USING btree ("_order");
  CREATE INDEX "iqac_functions_functions_parent_id_idx" ON "payload"."iqac_functions_functions" USING btree ("_parent_id");
  CREATE INDEX "iqac_functions_steps_order_idx" ON "payload"."iqac_functions_steps" USING btree ("_order");
  CREATE INDEX "iqac_functions_steps_parent_id_idx" ON "payload"."iqac_functions_steps" USING btree ("_parent_id");
  CREATE INDEX "iqac_functions__status_idx" ON "payload"."iqac_functions" USING btree ("_status");
  CREATE INDEX "_iqac_functions_v_version_functions_order_idx" ON "payload"."_iqac_functions_v_version_functions" USING btree ("_order");
  CREATE INDEX "_iqac_functions_v_version_functions_parent_id_idx" ON "payload"."_iqac_functions_v_version_functions" USING btree ("_parent_id");
  CREATE INDEX "_iqac_functions_v_version_steps_order_idx" ON "payload"."_iqac_functions_v_version_steps" USING btree ("_order");
  CREATE INDEX "_iqac_functions_v_version_steps_parent_id_idx" ON "payload"."_iqac_functions_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_iqac_functions_v_version_version__status_idx" ON "payload"."_iqac_functions_v" USING btree ("version__status");
  CREATE INDEX "_iqac_functions_v_created_at_idx" ON "payload"."_iqac_functions_v" USING btree ("created_at");
  CREATE INDEX "_iqac_functions_v_updated_at_idx" ON "payload"."_iqac_functions_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_functions_v_latest_idx" ON "payload"."_iqac_functions_v" USING btree ("latest");
  CREATE INDEX "iqac_objectives_objectives_order_idx" ON "payload"."iqac_objectives_objectives" USING btree ("_order");
  CREATE INDEX "iqac_objectives_objectives_parent_id_idx" ON "payload"."iqac_objectives_objectives" USING btree ("_parent_id");
  CREATE INDEX "iqac_objectives_commitments_order_idx" ON "payload"."iqac_objectives_commitments" USING btree ("_order");
  CREATE INDEX "iqac_objectives_commitments_parent_id_idx" ON "payload"."iqac_objectives_commitments" USING btree ("_parent_id");
  CREATE INDEX "iqac_objectives__status_idx" ON "payload"."iqac_objectives" USING btree ("_status");
  CREATE INDEX "_iqac_objectives_v_version_objectives_order_idx" ON "payload"."_iqac_objectives_v_version_objectives" USING btree ("_order");
  CREATE INDEX "_iqac_objectives_v_version_objectives_parent_id_idx" ON "payload"."_iqac_objectives_v_version_objectives" USING btree ("_parent_id");
  CREATE INDEX "_iqac_objectives_v_version_commitments_order_idx" ON "payload"."_iqac_objectives_v_version_commitments" USING btree ("_order");
  CREATE INDEX "_iqac_objectives_v_version_commitments_parent_id_idx" ON "payload"."_iqac_objectives_v_version_commitments" USING btree ("_parent_id");
  CREATE INDEX "_iqac_objectives_v_version_version__status_idx" ON "payload"."_iqac_objectives_v" USING btree ("version__status");
  CREATE INDEX "_iqac_objectives_v_created_at_idx" ON "payload"."_iqac_objectives_v" USING btree ("created_at");
  CREATE INDEX "_iqac_objectives_v_updated_at_idx" ON "payload"."_iqac_objectives_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_objectives_v_latest_idx" ON "payload"."_iqac_objectives_v" USING btree ("latest");
  CREATE INDEX "iqac_overview_mission_order_idx" ON "payload"."iqac_overview_mission" USING btree ("_order");
  CREATE INDEX "iqac_overview_mission_parent_id_idx" ON "payload"."iqac_overview_mission" USING btree ("_parent_id");
  CREATE INDEX "iqac_overview_commitments_order_idx" ON "payload"."iqac_overview_commitments" USING btree ("_order");
  CREATE INDEX "iqac_overview_commitments_parent_id_idx" ON "payload"."iqac_overview_commitments" USING btree ("_parent_id");
  CREATE INDEX "iqac_overview_frameworks_order_idx" ON "payload"."iqac_overview_frameworks" USING btree ("_order");
  CREATE INDEX "iqac_overview_frameworks_parent_id_idx" ON "payload"."iqac_overview_frameworks" USING btree ("_parent_id");
  CREATE INDEX "iqac_overview__status_idx" ON "payload"."iqac_overview" USING btree ("_status");
  CREATE INDEX "_iqac_overview_v_version_mission_order_idx" ON "payload"."_iqac_overview_v_version_mission" USING btree ("_order");
  CREATE INDEX "_iqac_overview_v_version_mission_parent_id_idx" ON "payload"."_iqac_overview_v_version_mission" USING btree ("_parent_id");
  CREATE INDEX "_iqac_overview_v_version_commitments_order_idx" ON "payload"."_iqac_overview_v_version_commitments" USING btree ("_order");
  CREATE INDEX "_iqac_overview_v_version_commitments_parent_id_idx" ON "payload"."_iqac_overview_v_version_commitments" USING btree ("_parent_id");
  CREATE INDEX "_iqac_overview_v_version_frameworks_order_idx" ON "payload"."_iqac_overview_v_version_frameworks" USING btree ("_order");
  CREATE INDEX "_iqac_overview_v_version_frameworks_parent_id_idx" ON "payload"."_iqac_overview_v_version_frameworks" USING btree ("_parent_id");
  CREATE INDEX "_iqac_overview_v_version_version__status_idx" ON "payload"."_iqac_overview_v" USING btree ("version__status");
  CREATE INDEX "_iqac_overview_v_created_at_idx" ON "payload"."_iqac_overview_v" USING btree ("created_at");
  CREATE INDEX "_iqac_overview_v_updated_at_idx" ON "payload"."_iqac_overview_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_overview_v_latest_idx" ON "payload"."_iqac_overview_v" USING btree ("latest");
  CREATE INDEX "iqac_initiatives_initiatives_order_idx" ON "payload"."iqac_initiatives_initiatives" USING btree ("_order");
  CREATE INDEX "iqac_initiatives_initiatives_parent_id_idx" ON "payload"."iqac_initiatives_initiatives" USING btree ("_parent_id");
  CREATE INDEX "iqac_initiatives_responsibilities_order_idx" ON "payload"."iqac_initiatives_responsibilities" USING btree ("_order");
  CREATE INDEX "iqac_initiatives_responsibilities_parent_id_idx" ON "payload"."iqac_initiatives_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "iqac_initiatives__status_idx" ON "payload"."iqac_initiatives" USING btree ("_status");
  CREATE INDEX "_iqac_initiatives_v_version_initiatives_order_idx" ON "payload"."_iqac_initiatives_v_version_initiatives" USING btree ("_order");
  CREATE INDEX "_iqac_initiatives_v_version_initiatives_parent_id_idx" ON "payload"."_iqac_initiatives_v_version_initiatives" USING btree ("_parent_id");
  CREATE INDEX "_iqac_initiatives_v_version_responsibilities_order_idx" ON "payload"."_iqac_initiatives_v_version_responsibilities" USING btree ("_order");
  CREATE INDEX "_iqac_initiatives_v_version_responsibilities_parent_id_idx" ON "payload"."_iqac_initiatives_v_version_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "_iqac_initiatives_v_version_version__status_idx" ON "payload"."_iqac_initiatives_v" USING btree ("version__status");
  CREATE INDEX "_iqac_initiatives_v_created_at_idx" ON "payload"."_iqac_initiatives_v" USING btree ("created_at");
  CREATE INDEX "_iqac_initiatives_v_updated_at_idx" ON "payload"."_iqac_initiatives_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_initiatives_v_latest_idx" ON "payload"."_iqac_initiatives_v" USING btree ("latest");
  CREATE INDEX "iqac_support_contacts_order_idx" ON "payload"."iqac_support_contacts" USING btree ("_order");
  CREATE INDEX "iqac_support_contacts_parent_id_idx" ON "payload"."iqac_support_contacts" USING btree ("_parent_id");
  CREATE INDEX "iqac_support__status_idx" ON "payload"."iqac_support" USING btree ("_status");
  CREATE INDEX "_iqac_support_v_version_contacts_order_idx" ON "payload"."_iqac_support_v_version_contacts" USING btree ("_order");
  CREATE INDEX "_iqac_support_v_version_contacts_parent_id_idx" ON "payload"."_iqac_support_v_version_contacts" USING btree ("_parent_id");
  CREATE INDEX "_iqac_support_v_version_version__status_idx" ON "payload"."_iqac_support_v" USING btree ("version__status");
  CREATE INDEX "_iqac_support_v_created_at_idx" ON "payload"."_iqac_support_v" USING btree ("created_at");
  CREATE INDEX "_iqac_support_v_updated_at_idx" ON "payload"."_iqac_support_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_support_v_latest_idx" ON "payload"."_iqac_support_v" USING btree ("latest");
  CREATE INDEX "iqac_reports_aqar_order_idx" ON "payload"."iqac_reports_aqar" USING btree ("_order");
  CREATE INDEX "iqac_reports_aqar_parent_id_idx" ON "payload"."iqac_reports_aqar" USING btree ("_parent_id");
  CREATE INDEX "iqac_reports_minutes_order_idx" ON "payload"."iqac_reports_minutes" USING btree ("_order");
  CREATE INDEX "iqac_reports_minutes_parent_id_idx" ON "payload"."iqac_reports_minutes" USING btree ("_parent_id");
  CREATE INDEX "iqac_reports_other_order_idx" ON "payload"."iqac_reports_other" USING btree ("_order");
  CREATE INDEX "iqac_reports_other_parent_id_idx" ON "payload"."iqac_reports_other" USING btree ("_parent_id");
  CREATE INDEX "iqac_reports__status_idx" ON "payload"."iqac_reports" USING btree ("_status");
  CREATE INDEX "_iqac_reports_v_version_aqar_order_idx" ON "payload"."_iqac_reports_v_version_aqar" USING btree ("_order");
  CREATE INDEX "_iqac_reports_v_version_aqar_parent_id_idx" ON "payload"."_iqac_reports_v_version_aqar" USING btree ("_parent_id");
  CREATE INDEX "_iqac_reports_v_version_minutes_order_idx" ON "payload"."_iqac_reports_v_version_minutes" USING btree ("_order");
  CREATE INDEX "_iqac_reports_v_version_minutes_parent_id_idx" ON "payload"."_iqac_reports_v_version_minutes" USING btree ("_parent_id");
  CREATE INDEX "_iqac_reports_v_version_other_order_idx" ON "payload"."_iqac_reports_v_version_other" USING btree ("_order");
  CREATE INDEX "_iqac_reports_v_version_other_parent_id_idx" ON "payload"."_iqac_reports_v_version_other" USING btree ("_parent_id");
  CREATE INDEX "_iqac_reports_v_version_version__status_idx" ON "payload"."_iqac_reports_v" USING btree ("version__status");
  CREATE INDEX "_iqac_reports_v_created_at_idx" ON "payload"."_iqac_reports_v" USING btree ("created_at");
  CREATE INDEX "_iqac_reports_v_updated_at_idx" ON "payload"."_iqac_reports_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_reports_v_latest_idx" ON "payload"."_iqac_reports_v" USING btree ("latest");
  CREATE INDEX "iqac_feedback_types_order_idx" ON "payload"."iqac_feedback_types" USING btree ("_order");
  CREATE INDEX "iqac_feedback_types_parent_id_idx" ON "payload"."iqac_feedback_types" USING btree ("_parent_id");
  CREATE INDEX "iqac_feedback__status_idx" ON "payload"."iqac_feedback" USING btree ("_status");
  CREATE INDEX "_iqac_feedback_v_version_types_order_idx" ON "payload"."_iqac_feedback_v_version_types" USING btree ("_order");
  CREATE INDEX "_iqac_feedback_v_version_types_parent_id_idx" ON "payload"."_iqac_feedback_v_version_types" USING btree ("_parent_id");
  CREATE INDEX "_iqac_feedback_v_version_version__status_idx" ON "payload"."_iqac_feedback_v" USING btree ("version__status");
  CREATE INDEX "_iqac_feedback_v_created_at_idx" ON "payload"."_iqac_feedback_v" USING btree ("created_at");
  CREATE INDEX "_iqac_feedback_v_updated_at_idx" ON "payload"."_iqac_feedback_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_feedback_v_latest_idx" ON "payload"."_iqac_feedback_v" USING btree ("latest");
  CREATE INDEX "iqac_contact_details_order_idx" ON "payload"."iqac_contact_details" USING btree ("_order");
  CREATE INDEX "iqac_contact_details_parent_id_idx" ON "payload"."iqac_contact_details" USING btree ("_parent_id");
  CREATE INDEX "iqac_contact__status_idx" ON "payload"."iqac_contact" USING btree ("_status");
  CREATE INDEX "_iqac_contact_v_version_details_order_idx" ON "payload"."_iqac_contact_v_version_details" USING btree ("_order");
  CREATE INDEX "_iqac_contact_v_version_details_parent_id_idx" ON "payload"."_iqac_contact_v_version_details" USING btree ("_parent_id");
  CREATE INDEX "_iqac_contact_v_version_version__status_idx" ON "payload"."_iqac_contact_v" USING btree ("version__status");
  CREATE INDEX "_iqac_contact_v_created_at_idx" ON "payload"."_iqac_contact_v" USING btree ("created_at");
  CREATE INDEX "_iqac_contact_v_updated_at_idx" ON "payload"."_iqac_contact_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_contact_v_latest_idx" ON "payload"."_iqac_contact_v" USING btree ("latest");
  CREATE INDEX "iqac_nba_programmes_order_idx" ON "payload"."iqac_nba_programmes" USING btree ("_order");
  CREATE INDEX "iqac_nba_programmes_parent_id_idx" ON "payload"."iqac_nba_programmes" USING btree ("_parent_id");
  CREATE INDEX "iqac_nba__status_idx" ON "payload"."iqac_nba" USING btree ("_status");
  CREATE INDEX "_iqac_nba_v_version_programmes_order_idx" ON "payload"."_iqac_nba_v_version_programmes" USING btree ("_order");
  CREATE INDEX "_iqac_nba_v_version_programmes_parent_id_idx" ON "payload"."_iqac_nba_v_version_programmes" USING btree ("_parent_id");
  CREATE INDEX "_iqac_nba_v_version_version__status_idx" ON "payload"."_iqac_nba_v" USING btree ("version__status");
  CREATE INDEX "_iqac_nba_v_created_at_idx" ON "payload"."_iqac_nba_v" USING btree ("created_at");
  CREATE INDEX "_iqac_nba_v_updated_at_idx" ON "payload"."_iqac_nba_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_nba_v_latest_idx" ON "payload"."_iqac_nba_v" USING btree ("latest");
  CREATE INDEX "site_page_headers_headers_order_idx" ON "payload"."site_page_headers_headers" USING btree ("_order");
  CREATE INDEX "site_page_headers_headers_parent_id_idx" ON "payload"."site_page_headers_headers" USING btree ("_parent_id");
  CREATE INDEX "site_page_headers__status_idx" ON "payload"."site_page_headers" USING btree ("_status");
  CREATE INDEX "_site_page_headers_v_version_headers_order_idx" ON "payload"."_site_page_headers_v_version_headers" USING btree ("_order");
  CREATE INDEX "_site_page_headers_v_version_headers_parent_id_idx" ON "payload"."_site_page_headers_v_version_headers" USING btree ("_parent_id");
  CREATE INDEX "_site_page_headers_v_version_version__status_idx" ON "payload"."_site_page_headers_v" USING btree ("version__status");
  CREATE INDEX "_site_page_headers_v_created_at_idx" ON "payload"."_site_page_headers_v" USING btree ("created_at");
  CREATE INDEX "_site_page_headers_v_updated_at_idx" ON "payload"."_site_page_headers_v" USING btree ("updated_at");
  CREATE INDEX "_site_page_headers_v_latest_idx" ON "payload"."_site_page_headers_v" USING btree ("latest");
  CREATE INDEX "info_pages_pages_order_idx" ON "payload"."info_pages_pages" USING btree ("_order");
  CREATE INDEX "info_pages_pages_parent_id_idx" ON "payload"."info_pages_pages" USING btree ("_parent_id");
  CREATE INDEX "info_pages__status_idx" ON "payload"."info_pages" USING btree ("_status");
  CREATE INDEX "_info_pages_v_version_pages_order_idx" ON "payload"."_info_pages_v_version_pages" USING btree ("_order");
  CREATE INDEX "_info_pages_v_version_pages_parent_id_idx" ON "payload"."_info_pages_v_version_pages" USING btree ("_parent_id");
  CREATE INDEX "_info_pages_v_version_version__status_idx" ON "payload"."_info_pages_v" USING btree ("version__status");
  CREATE INDEX "_info_pages_v_created_at_idx" ON "payload"."_info_pages_v" USING btree ("created_at");
  CREATE INDEX "_info_pages_v_updated_at_idx" ON "payload"."_info_pages_v" USING btree ("updated_at");
  CREATE INDEX "_info_pages_v_latest_idx" ON "payload"."_info_pages_v" USING btree ("latest");
  CREATE INDEX "site_documents__status_idx" ON "payload"."site_documents" USING btree ("_status");
  CREATE INDEX "_site_documents_v_version_version__status_idx" ON "payload"."_site_documents_v" USING btree ("version__status");
  CREATE INDEX "_site_documents_v_created_at_idx" ON "payload"."_site_documents_v" USING btree ("created_at");
  CREATE INDEX "_site_documents_v_updated_at_idx" ON "payload"."_site_documents_v" USING btree ("updated_at");
  CREATE INDEX "_site_documents_v_latest_idx" ON "payload"."_site_documents_v" USING btree ("latest");
  CREATE INDEX "examinations_annual_reports__status_idx" ON "payload"."examinations_annual_reports" USING btree ("_status");
  CREATE INDEX "_examinations_annual_reports_v_version_version__status_idx" ON "payload"."_examinations_annual_reports_v" USING btree ("version__status");
  CREATE INDEX "_examinations_annual_reports_v_created_at_idx" ON "payload"."_examinations_annual_reports_v" USING btree ("created_at");
  CREATE INDEX "_examinations_annual_reports_v_updated_at_idx" ON "payload"."_examinations_annual_reports_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_annual_reports_v_latest_idx" ON "payload"."_examinations_annual_reports_v" USING btree ("latest");
  CREATE INDEX "examinations_certificates__status_idx" ON "payload"."examinations_certificates" USING btree ("_status");
  CREATE INDEX "_examinations_certificates_v_version_version__status_idx" ON "payload"."_examinations_certificates_v" USING btree ("version__status");
  CREATE INDEX "_examinations_certificates_v_created_at_idx" ON "payload"."_examinations_certificates_v" USING btree ("created_at");
  CREATE INDEX "_examinations_certificates_v_updated_at_idx" ON "payload"."_examinations_certificates_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_certificates_v_latest_idx" ON "payload"."_examinations_certificates_v" USING btree ("latest");
  CREATE INDEX "examinations_circulars__status_idx" ON "payload"."examinations_circulars" USING btree ("_status");
  CREATE INDEX "_examinations_circulars_v_version_version__status_idx" ON "payload"."_examinations_circulars_v" USING btree ("version__status");
  CREATE INDEX "_examinations_circulars_v_created_at_idx" ON "payload"."_examinations_circulars_v" USING btree ("created_at");
  CREATE INDEX "_examinations_circulars_v_updated_at_idx" ON "payload"."_examinations_circulars_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_circulars_v_latest_idx" ON "payload"."_examinations_circulars_v" USING btree ("latest");
  CREATE INDEX "examinations_citizen_charter__status_idx" ON "payload"."examinations_citizen_charter" USING btree ("_status");
  CREATE INDEX "_examinations_citizen_charter_v_version_version__status_idx" ON "payload"."_examinations_citizen_charter_v" USING btree ("version__status");
  CREATE INDEX "_examinations_citizen_charter_v_created_at_idx" ON "payload"."_examinations_citizen_charter_v" USING btree ("created_at");
  CREATE INDEX "_examinations_citizen_charter_v_updated_at_idx" ON "payload"."_examinations_citizen_charter_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_citizen_charter_v_latest_idx" ON "payload"."_examinations_citizen_charter_v" USING btree ("latest");
  CREATE INDEX "examinations_coe__status_idx" ON "payload"."examinations_coe" USING btree ("_status");
  CREATE INDEX "_examinations_coe_v_version_version__status_idx" ON "payload"."_examinations_coe_v" USING btree ("version__status");
  CREATE INDEX "_examinations_coe_v_created_at_idx" ON "payload"."_examinations_coe_v" USING btree ("created_at");
  CREATE INDEX "_examinations_coe_v_updated_at_idx" ON "payload"."_examinations_coe_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_coe_v_latest_idx" ON "payload"."_examinations_coe_v" USING btree ("latest");
  CREATE INDEX "examinations_contact__status_idx" ON "payload"."examinations_contact" USING btree ("_status");
  CREATE INDEX "_examinations_contact_v_version_version__status_idx" ON "payload"."_examinations_contact_v" USING btree ("version__status");
  CREATE INDEX "_examinations_contact_v_created_at_idx" ON "payload"."_examinations_contact_v" USING btree ("created_at");
  CREATE INDEX "_examinations_contact_v_updated_at_idx" ON "payload"."_examinations_contact_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_contact_v_latest_idx" ON "payload"."_examinations_contact_v" USING btree ("latest");
  CREATE INDEX "site_footer_links_order_idx" ON "payload"."site_footer_links" USING btree ("_order");
  CREATE INDEX "site_footer_links_parent_id_idx" ON "payload"."site_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_footer_logos_order_idx" ON "payload"."site_footer_logos" USING btree ("_order");
  CREATE INDEX "site_footer_logos_parent_id_idx" ON "payload"."site_footer_logos" USING btree ("_parent_id");
  CREATE INDEX "site_footer_badges_order_idx" ON "payload"."site_footer_badges" USING btree ("_order");
  CREATE INDEX "site_footer_badges_parent_id_idx" ON "payload"."site_footer_badges" USING btree ("_parent_id");
  CREATE INDEX "site_footer__status_idx" ON "payload"."site_footer" USING btree ("_status");
  CREATE INDEX "_site_footer_v_version_links_order_idx" ON "payload"."_site_footer_v_version_links" USING btree ("_order");
  CREATE INDEX "_site_footer_v_version_links_parent_id_idx" ON "payload"."_site_footer_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_site_footer_v_version_logos_order_idx" ON "payload"."_site_footer_v_version_logos" USING btree ("_order");
  CREATE INDEX "_site_footer_v_version_logos_parent_id_idx" ON "payload"."_site_footer_v_version_logos" USING btree ("_parent_id");
  CREATE INDEX "_site_footer_v_version_badges_order_idx" ON "payload"."_site_footer_v_version_badges" USING btree ("_order");
  CREATE INDEX "_site_footer_v_version_badges_parent_id_idx" ON "payload"."_site_footer_v_version_badges" USING btree ("_parent_id");
  CREATE INDEX "_site_footer_v_version_version__status_idx" ON "payload"."_site_footer_v" USING btree ("version__status");
  CREATE INDEX "_site_footer_v_created_at_idx" ON "payload"."_site_footer_v" USING btree ("created_at");
  CREATE INDEX "_site_footer_v_updated_at_idx" ON "payload"."_site_footer_v" USING btree ("updated_at");
  CREATE INDEX "_site_footer_v_latest_idx" ON "payload"."_site_footer_v" USING btree ("latest");
  CREATE INDEX "about_overview__status_idx" ON "payload"."about_overview" USING btree ("_status");
  CREATE INDEX "_about_overview_v_version_version__status_idx" ON "payload"."_about_overview_v" USING btree ("version__status");
  CREATE INDEX "_about_overview_v_created_at_idx" ON "payload"."_about_overview_v" USING btree ("created_at");
  CREATE INDEX "_about_overview_v_updated_at_idx" ON "payload"."_about_overview_v" USING btree ("updated_at");
  CREATE INDEX "_about_overview_v_latest_idx" ON "payload"."_about_overview_v" USING btree ("latest");
  CREATE INDEX "about_rankings_awards__status_idx" ON "payload"."about_rankings_awards" USING btree ("_status");
  CREATE INDEX "_about_rankings_awards_v_version_version__status_idx" ON "payload"."_about_rankings_awards_v" USING btree ("version__status");
  CREATE INDEX "_about_rankings_awards_v_created_at_idx" ON "payload"."_about_rankings_awards_v" USING btree ("created_at");
  CREATE INDEX "_about_rankings_awards_v_updated_at_idx" ON "payload"."_about_rankings_awards_v" USING btree ("updated_at");
  CREATE INDEX "_about_rankings_awards_v_latest_idx" ON "payload"."_about_rankings_awards_v" USING btree ("latest");
  CREATE INDEX "about_vision_mission__status_idx" ON "payload"."about_vision_mission" USING btree ("_status");
  CREATE INDEX "_about_vision_mission_v_version_version__status_idx" ON "payload"."_about_vision_mission_v" USING btree ("version__status");
  CREATE INDEX "_about_vision_mission_v_created_at_idx" ON "payload"."_about_vision_mission_v" USING btree ("created_at");
  CREATE INDEX "_about_vision_mission_v_updated_at_idx" ON "payload"."_about_vision_mission_v" USING btree ("updated_at");
  CREATE INDEX "_about_vision_mission_v_latest_idx" ON "payload"."_about_vision_mission_v" USING btree ("latest");
  CREATE INDEX "academics_overview__status_idx" ON "payload"."academics_overview" USING btree ("_status");
  CREATE INDEX "_academics_overview_v_version_version__status_idx" ON "payload"."_academics_overview_v" USING btree ("version__status");
  CREATE INDEX "_academics_overview_v_created_at_idx" ON "payload"."_academics_overview_v" USING btree ("created_at");
  CREATE INDEX "_academics_overview_v_updated_at_idx" ON "payload"."_academics_overview_v" USING btree ("updated_at");
  CREATE INDEX "_academics_overview_v_latest_idx" ON "payload"."_academics_overview_v" USING btree ("latest");
  CREATE INDEX "admissions_b_category__status_idx" ON "payload"."admissions_b_category" USING btree ("_status");
  CREATE INDEX "_admissions_b_category_v_version_version__status_idx" ON "payload"."_admissions_b_category_v" USING btree ("version__status");
  CREATE INDEX "_admissions_b_category_v_created_at_idx" ON "payload"."_admissions_b_category_v" USING btree ("created_at");
  CREATE INDEX "_admissions_b_category_v_updated_at_idx" ON "payload"."_admissions_b_category_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_b_category_v_latest_idx" ON "payload"."_admissions_b_category_v" USING btree ("latest");
  CREATE INDEX "admissions_fees__status_idx" ON "payload"."admissions_fees" USING btree ("_status");
  CREATE INDEX "_admissions_fees_v_version_version__status_idx" ON "payload"."_admissions_fees_v" USING btree ("version__status");
  CREATE INDEX "_admissions_fees_v_created_at_idx" ON "payload"."_admissions_fees_v" USING btree ("created_at");
  CREATE INDEX "_admissions_fees_v_updated_at_idx" ON "payload"."_admissions_fees_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_fees_v_latest_idx" ON "payload"."_admissions_fees_v" USING btree ("latest");
  CREATE INDEX "admissions_why_mlrit__status_idx" ON "payload"."admissions_why_mlrit" USING btree ("_status");
  CREATE INDEX "_admissions_why_mlrit_v_version_version__status_idx" ON "payload"."_admissions_why_mlrit_v" USING btree ("version__status");
  CREATE INDEX "_admissions_why_mlrit_v_created_at_idx" ON "payload"."_admissions_why_mlrit_v" USING btree ("created_at");
  CREATE INDEX "_admissions_why_mlrit_v_updated_at_idx" ON "payload"."_admissions_why_mlrit_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_why_mlrit_v_latest_idx" ON "payload"."_admissions_why_mlrit_v" USING btree ("latest");
  CREATE INDEX "chronicles_overview__status_idx" ON "payload"."chronicles_overview" USING btree ("_status");
  CREATE INDEX "_chronicles_overview_v_version_version__status_idx" ON "payload"."_chronicles_overview_v" USING btree ("version__status");
  CREATE INDEX "_chronicles_overview_v_created_at_idx" ON "payload"."_chronicles_overview_v" USING btree ("created_at");
  CREATE INDEX "_chronicles_overview_v_updated_at_idx" ON "payload"."_chronicles_overview_v" USING btree ("updated_at");
  CREATE INDEX "_chronicles_overview_v_latest_idx" ON "payload"."_chronicles_overview_v" USING btree ("latest");
  CREATE INDEX "departments_pg__status_idx" ON "payload"."departments_pg" USING btree ("_status");
  CREATE INDEX "_departments_pg_v_version_version__status_idx" ON "payload"."_departments_pg_v" USING btree ("version__status");
  CREATE INDEX "_departments_pg_v_created_at_idx" ON "payload"."_departments_pg_v" USING btree ("created_at");
  CREATE INDEX "_departments_pg_v_updated_at_idx" ON "payload"."_departments_pg_v" USING btree ("updated_at");
  CREATE INDEX "_departments_pg_v_latest_idx" ON "payload"."_departments_pg_v" USING btree ("latest");
  CREATE INDEX "departments_ug__status_idx" ON "payload"."departments_ug" USING btree ("_status");
  CREATE INDEX "_departments_ug_v_version_version__status_idx" ON "payload"."_departments_ug_v" USING btree ("version__status");
  CREATE INDEX "_departments_ug_v_created_at_idx" ON "payload"."_departments_ug_v" USING btree ("created_at");
  CREATE INDEX "_departments_ug_v_updated_at_idx" ON "payload"."_departments_ug_v" USING btree ("updated_at");
  CREATE INDEX "_departments_ug_v_latest_idx" ON "payload"."_departments_ug_v" USING btree ("latest");
  CREATE INDEX "examinations_downloads__status_idx" ON "payload"."examinations_downloads" USING btree ("_status");
  CREATE INDEX "_examinations_downloads_v_version_version__status_idx" ON "payload"."_examinations_downloads_v" USING btree ("version__status");
  CREATE INDEX "_examinations_downloads_v_created_at_idx" ON "payload"."_examinations_downloads_v" USING btree ("created_at");
  CREATE INDEX "_examinations_downloads_v_updated_at_idx" ON "payload"."_examinations_downloads_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_downloads_v_latest_idx" ON "payload"."_examinations_downloads_v" USING btree ("latest");
  CREATE INDEX "examinations_fee_results__status_idx" ON "payload"."examinations_fee_results" USING btree ("_status");
  CREATE INDEX "_examinations_fee_results_v_version_version__status_idx" ON "payload"."_examinations_fee_results_v" USING btree ("version__status");
  CREATE INDEX "_examinations_fee_results_v_created_at_idx" ON "payload"."_examinations_fee_results_v" USING btree ("created_at");
  CREATE INDEX "_examinations_fee_results_v_updated_at_idx" ON "payload"."_examinations_fee_results_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_fee_results_v_latest_idx" ON "payload"."_examinations_fee_results_v" USING btree ("latest");
  CREATE INDEX "examinations_notifications__status_idx" ON "payload"."examinations_notifications" USING btree ("_status");
  CREATE INDEX "_examinations_notifications_v_version_version__status_idx" ON "payload"."_examinations_notifications_v" USING btree ("version__status");
  CREATE INDEX "_examinations_notifications_v_created_at_idx" ON "payload"."_examinations_notifications_v" USING btree ("created_at");
  CREATE INDEX "_examinations_notifications_v_updated_at_idx" ON "payload"."_examinations_notifications_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_notifications_v_latest_idx" ON "payload"."_examinations_notifications_v" USING btree ("latest");
  CREATE INDEX "examinations_pyqs__status_idx" ON "payload"."examinations_pyqs" USING btree ("_status");
  CREATE INDEX "_examinations_pyqs_v_version_version__status_idx" ON "payload"."_examinations_pyqs_v" USING btree ("version__status");
  CREATE INDEX "_examinations_pyqs_v_created_at_idx" ON "payload"."_examinations_pyqs_v" USING btree ("created_at");
  CREATE INDEX "_examinations_pyqs_v_updated_at_idx" ON "payload"."_examinations_pyqs_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_pyqs_v_latest_idx" ON "payload"."_examinations_pyqs_v" USING btree ("latest");
  CREATE INDEX "examinations_regulations__status_idx" ON "payload"."examinations_regulations" USING btree ("_status");
  CREATE INDEX "_examinations_regulations_v_version_version__status_idx" ON "payload"."_examinations_regulations_v" USING btree ("version__status");
  CREATE INDEX "_examinations_regulations_v_created_at_idx" ON "payload"."_examinations_regulations_v" USING btree ("created_at");
  CREATE INDEX "_examinations_regulations_v_updated_at_idx" ON "payload"."_examinations_regulations_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_regulations_v_latest_idx" ON "payload"."_examinations_regulations_v" USING btree ("latest");
  CREATE INDEX "examinations_student_verifications__status_idx" ON "payload"."examinations_student_verifications" USING btree ("_status");
  CREATE INDEX "_examinations_student_verifications_v_version_version__s_idx" ON "payload"."_examinations_student_verifications_v" USING btree ("version__status");
  CREATE INDEX "_examinations_student_verifications_v_created_at_idx" ON "payload"."_examinations_student_verifications_v" USING btree ("created_at");
  CREATE INDEX "_examinations_student_verifications_v_updated_at_idx" ON "payload"."_examinations_student_verifications_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_student_verifications_v_latest_idx" ON "payload"."_examinations_student_verifications_v" USING btree ("latest");
  CREATE INDEX "examinations_timetable_external__status_idx" ON "payload"."examinations_timetable_external" USING btree ("_status");
  CREATE INDEX "_examinations_timetable_external_v_version_version__stat_idx" ON "payload"."_examinations_timetable_external_v" USING btree ("version__status");
  CREATE INDEX "_examinations_timetable_external_v_created_at_idx" ON "payload"."_examinations_timetable_external_v" USING btree ("created_at");
  CREATE INDEX "_examinations_timetable_external_v_updated_at_idx" ON "payload"."_examinations_timetable_external_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_timetable_external_v_latest_idx" ON "payload"."_examinations_timetable_external_v" USING btree ("latest");
  CREATE INDEX "examinations_timetable_internal__status_idx" ON "payload"."examinations_timetable_internal" USING btree ("_status");
  CREATE INDEX "_examinations_timetable_internal_v_version_version__stat_idx" ON "payload"."_examinations_timetable_internal_v" USING btree ("version__status");
  CREATE INDEX "_examinations_timetable_internal_v_created_at_idx" ON "payload"."_examinations_timetable_internal_v" USING btree ("created_at");
  CREATE INDEX "_examinations_timetable_internal_v_updated_at_idx" ON "payload"."_examinations_timetable_internal_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_timetable_internal_v_latest_idx" ON "payload"."_examinations_timetable_internal_v" USING btree ("latest");
  CREATE INDEX "iqac_composition__status_idx" ON "payload"."iqac_composition" USING btree ("_status");
  CREATE INDEX "_iqac_composition_v_version_version__status_idx" ON "payload"."_iqac_composition_v" USING btree ("version__status");
  CREATE INDEX "_iqac_composition_v_created_at_idx" ON "payload"."_iqac_composition_v" USING btree ("created_at");
  CREATE INDEX "_iqac_composition_v_updated_at_idx" ON "payload"."_iqac_composition_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_composition_v_latest_idx" ON "payload"."_iqac_composition_v" USING btree ("latest");
  CREATE INDEX "iqac_naac__status_idx" ON "payload"."iqac_naac" USING btree ("_status");
  CREATE INDEX "_iqac_naac_v_version_version__status_idx" ON "payload"."_iqac_naac_v" USING btree ("version__status");
  CREATE INDEX "_iqac_naac_v_created_at_idx" ON "payload"."_iqac_naac_v" USING btree ("created_at");
  CREATE INDEX "_iqac_naac_v_updated_at_idx" ON "payload"."_iqac_naac_v" USING btree ("updated_at");
  CREATE INDEX "_iqac_naac_v_latest_idx" ON "payload"."_iqac_naac_v" USING btree ("latest");
  CREATE INDEX "placements_drives__status_idx" ON "payload"."placements_drives" USING btree ("_status");
  CREATE INDEX "_placements_drives_v_version_version__status_idx" ON "payload"."_placements_drives_v" USING btree ("version__status");
  CREATE INDEX "_placements_drives_v_created_at_idx" ON "payload"."_placements_drives_v" USING btree ("created_at");
  CREATE INDEX "_placements_drives_v_updated_at_idx" ON "payload"."_placements_drives_v" USING btree ("updated_at");
  CREATE INDEX "_placements_drives_v_latest_idx" ON "payload"."_placements_drives_v" USING btree ("latest");
  CREATE INDEX "placements_global_certification__status_idx" ON "payload"."placements_global_certification" USING btree ("_status");
  CREATE INDEX "_placements_global_certification_v_version_version__stat_idx" ON "payload"."_placements_global_certification_v" USING btree ("version__status");
  CREATE INDEX "_placements_global_certification_v_created_at_idx" ON "payload"."_placements_global_certification_v" USING btree ("created_at");
  CREATE INDEX "_placements_global_certification_v_updated_at_idx" ON "payload"."_placements_global_certification_v" USING btree ("updated_at");
  CREATE INDEX "_placements_global_certification_v_latest_idx" ON "payload"."_placements_global_certification_v" USING btree ("latest");
  CREATE INDEX "placements_industry_readiness__status_idx" ON "payload"."placements_industry_readiness" USING btree ("_status");
  CREATE INDEX "_placements_industry_readiness_v_version_version__status_idx" ON "payload"."_placements_industry_readiness_v" USING btree ("version__status");
  CREATE INDEX "_placements_industry_readiness_v_created_at_idx" ON "payload"."_placements_industry_readiness_v" USING btree ("created_at");
  CREATE INDEX "_placements_industry_readiness_v_updated_at_idx" ON "payload"."_placements_industry_readiness_v" USING btree ("updated_at");
  CREATE INDEX "_placements_industry_readiness_v_latest_idx" ON "payload"."_placements_industry_readiness_v" USING btree ("latest");
  CREATE INDEX "placements_overview__status_idx" ON "payload"."placements_overview" USING btree ("_status");
  CREATE INDEX "_placements_overview_v_version_version__status_idx" ON "payload"."_placements_overview_v" USING btree ("version__status");
  CREATE INDEX "_placements_overview_v_created_at_idx" ON "payload"."_placements_overview_v" USING btree ("created_at");
  CREATE INDEX "_placements_overview_v_updated_at_idx" ON "payload"."_placements_overview_v" USING btree ("updated_at");
  CREATE INDEX "_placements_overview_v_latest_idx" ON "payload"."_placements_overview_v" USING btree ("latest");
  CREATE INDEX "research_support__status_idx" ON "payload"."research_support" USING btree ("_status");
  CREATE INDEX "_research_support_v_version_version__status_idx" ON "payload"."_research_support_v" USING btree ("version__status");
  CREATE INDEX "_research_support_v_created_at_idx" ON "payload"."_research_support_v" USING btree ("created_at");
  CREATE INDEX "_research_support_v_updated_at_idx" ON "payload"."_research_support_v" USING btree ("updated_at");
  CREATE INDEX "_research_support_v_latest_idx" ON "payload"."_research_support_v" USING btree ("latest");
  CREATE INDEX "student_life_overview__status_idx" ON "payload"."student_life_overview" USING btree ("_status");
  CREATE INDEX "_student_life_overview_v_version_version__status_idx" ON "payload"."_student_life_overview_v" USING btree ("version__status");
  CREATE INDEX "_student_life_overview_v_created_at_idx" ON "payload"."_student_life_overview_v" USING btree ("created_at");
  CREATE INDEX "_student_life_overview_v_updated_at_idx" ON "payload"."_student_life_overview_v" USING btree ("updated_at");
  CREATE INDEX "_student_life_overview_v_latest_idx" ON "payload"."_student_life_overview_v" USING btree ("latest");
  CREATE INDEX "admissions_overview__status_idx" ON "payload"."admissions_overview" USING btree ("_status");
  CREATE INDEX "_admissions_overview_v_version_version__status_idx" ON "payload"."_admissions_overview_v" USING btree ("version__status");
  CREATE INDEX "_admissions_overview_v_created_at_idx" ON "payload"."_admissions_overview_v" USING btree ("created_at");
  CREATE INDEX "_admissions_overview_v_updated_at_idx" ON "payload"."_admissions_overview_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_overview_v_latest_idx" ON "payload"."_admissions_overview_v" USING btree ("latest");
  CREATE INDEX "admissions_counselling__status_idx" ON "payload"."admissions_counselling" USING btree ("_status");
  CREATE INDEX "_admissions_counselling_v_version_version__status_idx" ON "payload"."_admissions_counselling_v" USING btree ("version__status");
  CREATE INDEX "_admissions_counselling_v_created_at_idx" ON "payload"."_admissions_counselling_v" USING btree ("created_at");
  CREATE INDEX "_admissions_counselling_v_updated_at_idx" ON "payload"."_admissions_counselling_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_counselling_v_latest_idx" ON "payload"."_admissions_counselling_v" USING btree ("latest");
  CREATE INDEX "admissions_support__status_idx" ON "payload"."admissions_support" USING btree ("_status");
  CREATE INDEX "_admissions_support_v_version_version__status_idx" ON "payload"."_admissions_support_v" USING btree ("version__status");
  CREATE INDEX "_admissions_support_v_created_at_idx" ON "payload"."_admissions_support_v" USING btree ("created_at");
  CREATE INDEX "_admissions_support_v_updated_at_idx" ON "payload"."_admissions_support_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_support_v_latest_idx" ON "payload"."_admissions_support_v" USING btree ("latest");
  CREATE INDEX "admissions_scholarships__status_idx" ON "payload"."admissions_scholarships" USING btree ("_status");
  CREATE INDEX "_admissions_scholarships_v_version_version__status_idx" ON "payload"."_admissions_scholarships_v" USING btree ("version__status");
  CREATE INDEX "_admissions_scholarships_v_created_at_idx" ON "payload"."_admissions_scholarships_v" USING btree ("created_at");
  CREATE INDEX "_admissions_scholarships_v_updated_at_idx" ON "payload"."_admissions_scholarships_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_scholarships_v_latest_idx" ON "payload"."_admissions_scholarships_v" USING btree ("latest");
  CREATE INDEX "admissions_by_degree__status_idx" ON "payload"."admissions_by_degree" USING btree ("_status");
  CREATE INDEX "_admissions_by_degree_v_version_version__status_idx" ON "payload"."_admissions_by_degree_v" USING btree ("version__status");
  CREATE INDEX "_admissions_by_degree_v_created_at_idx" ON "payload"."_admissions_by_degree_v" USING btree ("created_at");
  CREATE INDEX "_admissions_by_degree_v_updated_at_idx" ON "payload"."_admissions_by_degree_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_by_degree_v_latest_idx" ON "payload"."_admissions_by_degree_v" USING btree ("latest");
  CREATE INDEX "examinations_syllabus__status_idx" ON "payload"."examinations_syllabus" USING btree ("_status");
  CREATE INDEX "_examinations_syllabus_v_version_version__status_idx" ON "payload"."_examinations_syllabus_v" USING btree ("version__status");
  CREATE INDEX "_examinations_syllabus_v_created_at_idx" ON "payload"."_examinations_syllabus_v" USING btree ("created_at");
  CREATE INDEX "_examinations_syllabus_v_updated_at_idx" ON "payload"."_examinations_syllabus_v" USING btree ("updated_at");
  CREATE INDEX "_examinations_syllabus_v_latest_idx" ON "payload"."_examinations_syllabus_v" USING btree ("latest");
  CREATE INDEX "placements_alumni__status_idx" ON "payload"."placements_alumni" USING btree ("_status");
  CREATE INDEX "_placements_alumni_v_version_version__status_idx" ON "payload"."_placements_alumni_v" USING btree ("version__status");
  CREATE INDEX "_placements_alumni_v_created_at_idx" ON "payload"."_placements_alumni_v" USING btree ("created_at");
  CREATE INDEX "_placements_alumni_v_updated_at_idx" ON "payload"."_placements_alumni_v" USING btree ("updated_at");
  CREATE INDEX "_placements_alumni_v_latest_idx" ON "payload"."_placements_alumni_v" USING btree ("latest");
  CREATE INDEX "about_internal_governance__status_idx" ON "payload"."about_internal_governance" USING btree ("_status");
  CREATE INDEX "_about_internal_governance_v_version_version__status_idx" ON "payload"."_about_internal_governance_v" USING btree ("version__status");
  CREATE INDEX "_about_internal_governance_v_created_at_idx" ON "payload"."_about_internal_governance_v" USING btree ("created_at");
  CREATE INDEX "_about_internal_governance_v_updated_at_idx" ON "payload"."_about_internal_governance_v" USING btree ("updated_at");
  CREATE INDEX "_about_internal_governance_v_latest_idx" ON "payload"."_about_internal_governance_v" USING btree ("latest");
  CREATE INDEX "site_faculty_profile__status_idx" ON "payload"."site_faculty_profile" USING btree ("_status");
  CREATE INDEX "_site_faculty_profile_v_version_version__status_idx" ON "payload"."_site_faculty_profile_v" USING btree ("version__status");
  CREATE INDEX "_site_faculty_profile_v_created_at_idx" ON "payload"."_site_faculty_profile_v" USING btree ("created_at");
  CREATE INDEX "_site_faculty_profile_v_updated_at_idx" ON "payload"."_site_faculty_profile_v" USING btree ("updated_at");
  CREATE INDEX "_site_faculty_profile_v_latest_idx" ON "payload"."_site_faculty_profile_v" USING btree ("latest");
  CREATE INDEX "site_research_profile__status_idx" ON "payload"."site_research_profile" USING btree ("_status");
  CREATE INDEX "_site_research_profile_v_version_version__status_idx" ON "payload"."_site_research_profile_v" USING btree ("version__status");
  CREATE INDEX "_site_research_profile_v_created_at_idx" ON "payload"."_site_research_profile_v" USING btree ("created_at");
  CREATE INDEX "_site_research_profile_v_updated_at_idx" ON "payload"."_site_research_profile_v" USING btree ("updated_at");
  CREATE INDEX "_site_research_profile_v_latest_idx" ON "payload"."_site_research_profile_v" USING btree ("latest");
  CREATE INDEX "site_syllabus_regulation__status_idx" ON "payload"."site_syllabus_regulation" USING btree ("_status");
  CREATE INDEX "_site_syllabus_regulation_v_version_version__status_idx" ON "payload"."_site_syllabus_regulation_v" USING btree ("version__status");
  CREATE INDEX "_site_syllabus_regulation_v_created_at_idx" ON "payload"."_site_syllabus_regulation_v" USING btree ("created_at");
  CREATE INDEX "_site_syllabus_regulation_v_updated_at_idx" ON "payload"."_site_syllabus_regulation_v" USING btree ("updated_at");
  CREATE INDEX "_site_syllabus_regulation_v_latest_idx" ON "payload"."_site_syllabus_regulation_v" USING btree ("latest");
  CREATE INDEX "site_syllabus_semester__status_idx" ON "payload"."site_syllabus_semester" USING btree ("_status");
  CREATE INDEX "_site_syllabus_semester_v_version_version__status_idx" ON "payload"."_site_syllabus_semester_v" USING btree ("version__status");
  CREATE INDEX "_site_syllabus_semester_v_created_at_idx" ON "payload"."_site_syllabus_semester_v" USING btree ("created_at");
  CREATE INDEX "_site_syllabus_semester_v_updated_at_idx" ON "payload"."_site_syllabus_semester_v" USING btree ("updated_at");
  CREATE INDEX "_site_syllabus_semester_v_latest_idx" ON "payload"."_site_syllabus_semester_v" USING btree ("latest");
  CREATE INDEX "admissions_policies__status_idx" ON "payload"."admissions_policies" USING btree ("_status");
  CREATE INDEX "_admissions_policies_v_version_version__status_idx" ON "payload"."_admissions_policies_v" USING btree ("version__status");
  CREATE INDEX "_admissions_policies_v_created_at_idx" ON "payload"."_admissions_policies_v" USING btree ("created_at");
  CREATE INDEX "_admissions_policies_v_updated_at_idx" ON "payload"."_admissions_policies_v" USING btree ("updated_at");
  CREATE INDEX "_admissions_policies_v_latest_idx" ON "payload"."_admissions_policies_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."users_sections" CASCADE;
  DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."home_hero" CASCADE;
  DROP TABLE "payload"."_home_hero_v" CASCADE;
  DROP TABLE "payload"."home_stats_stats" CASCADE;
  DROP TABLE "payload"."home_stats" CASCADE;
  DROP TABLE "payload"."_home_stats_v_version_stats" CASCADE;
  DROP TABLE "payload"."_home_stats_v" CASCADE;
  DROP TABLE "payload"."home_achievements_logos" CASCADE;
  DROP TABLE "payload"."home_achievements_ranks" CASCADE;
  DROP TABLE "payload"."home_achievements" CASCADE;
  DROP TABLE "payload"."_home_achievements_v_version_logos" CASCADE;
  DROP TABLE "payload"."_home_achievements_v_version_ranks" CASCADE;
  DROP TABLE "payload"."_home_achievements_v" CASCADE;
  DROP TABLE "payload"."home_programs_ug" CASCADE;
  DROP TABLE "payload"."home_programs_pg" CASCADE;
  DROP TABLE "payload"."home_programs" CASCADE;
  DROP TABLE "payload"."_home_programs_v_version_ug" CASCADE;
  DROP TABLE "payload"."_home_programs_v_version_pg" CASCADE;
  DROP TABLE "payload"."_home_programs_v" CASCADE;
  DROP TABLE "payload"."home_why_mlrit" CASCADE;
  DROP TABLE "payload"."_home_why_mlrit_v" CASCADE;
  DROP TABLE "payload"."home_success_stories_cards" CASCADE;
  DROP TABLE "payload"."home_success_stories" CASCADE;
  DROP TABLE "payload"."_home_success_stories_v_version_cards" CASCADE;
  DROP TABLE "payload"."_home_success_stories_v" CASCADE;
  DROP TABLE "payload"."home_testimonials_people" CASCADE;
  DROP TABLE "payload"."home_testimonials" CASCADE;
  DROP TABLE "payload"."_home_testimonials_v_version_people" CASCADE;
  DROP TABLE "payload"."_home_testimonials_v" CASCADE;
  DROP TABLE "payload"."home_events_slides" CASCADE;
  DROP TABLE "payload"."home_events" CASCADE;
  DROP TABLE "payload"."_home_events_v_version_slides" CASCADE;
  DROP TABLE "payload"."_home_events_v" CASCADE;
  DROP TABLE "payload"."home_placements_stats" CASCADE;
  DROP TABLE "payload"."home_placements" CASCADE;
  DROP TABLE "payload"."_home_placements_v_version_stats" CASCADE;
  DROP TABLE "payload"."_home_placements_v" CASCADE;
  DROP TABLE "payload"."placements_track_record_years" CASCADE;
  DROP TABLE "payload"."placements_track_record_companies" CASCADE;
  DROP TABLE "payload"."placements_track_record" CASCADE;
  DROP TABLE "payload"."_placements_track_record_v_version_years" CASCADE;
  DROP TABLE "payload"."_placements_track_record_v_version_companies" CASCADE;
  DROP TABLE "payload"."_placements_track_record_v" CASCADE;
  DROP TABLE "payload"."placements_statistics_highlights" CASCADE;
  DROP TABLE "payload"."placements_statistics_infrastructure" CASCADE;
  DROP TABLE "payload"."placements_statistics_infra_stats" CASCADE;
  DROP TABLE "payload"."placements_statistics" CASCADE;
  DROP TABLE "payload"."_placements_statistics_v_version_highlights" CASCADE;
  DROP TABLE "payload"."_placements_statistics_v_version_infrastructure" CASCADE;
  DROP TABLE "payload"."_placements_statistics_v_version_infra_stats" CASCADE;
  DROP TABLE "payload"."_placements_statistics_v" CASCADE;
  DROP TABLE "payload"."placements_mous_mous" CASCADE;
  DROP TABLE "payload"."placements_mous" CASCADE;
  DROP TABLE "payload"."_placements_mous_v_version_mous" CASCADE;
  DROP TABLE "payload"."_placements_mous_v" CASCADE;
  DROP TABLE "payload"."placements_support_contacts" CASCADE;
  DROP TABLE "payload"."placements_support" CASCADE;
  DROP TABLE "payload"."_placements_support_v_version_contacts" CASCADE;
  DROP TABLE "payload"."_placements_support_v" CASCADE;
  DROP TABLE "payload"."placements_recruiters_logos" CASCADE;
  DROP TABLE "payload"."placements_recruiters" CASCADE;
  DROP TABLE "payload"."_placements_recruiters_v_version_logos" CASCADE;
  DROP TABLE "payload"."_placements_recruiters_v" CASCADE;
  DROP TABLE "payload"."iqac_aqar_facts" CASCADE;
  DROP TABLE "payload"."iqac_aqar_reports" CASCADE;
  DROP TABLE "payload"."iqac_aqar" CASCADE;
  DROP TABLE "payload"."_iqac_aqar_v_version_facts" CASCADE;
  DROP TABLE "payload"."_iqac_aqar_v_version_reports" CASCADE;
  DROP TABLE "payload"."_iqac_aqar_v" CASCADE;
  DROP TABLE "payload"."iqac_best_practices_practices" CASCADE;
  DROP TABLE "payload"."iqac_best_practices" CASCADE;
  DROP TABLE "payload"."_iqac_best_practices_v_version_practices" CASCADE;
  DROP TABLE "payload"."_iqac_best_practices_v" CASCADE;
  DROP TABLE "payload"."iqac_functions_functions" CASCADE;
  DROP TABLE "payload"."iqac_functions_steps" CASCADE;
  DROP TABLE "payload"."iqac_functions" CASCADE;
  DROP TABLE "payload"."_iqac_functions_v_version_functions" CASCADE;
  DROP TABLE "payload"."_iqac_functions_v_version_steps" CASCADE;
  DROP TABLE "payload"."_iqac_functions_v" CASCADE;
  DROP TABLE "payload"."iqac_objectives_objectives" CASCADE;
  DROP TABLE "payload"."iqac_objectives_commitments" CASCADE;
  DROP TABLE "payload"."iqac_objectives" CASCADE;
  DROP TABLE "payload"."_iqac_objectives_v_version_objectives" CASCADE;
  DROP TABLE "payload"."_iqac_objectives_v_version_commitments" CASCADE;
  DROP TABLE "payload"."_iqac_objectives_v" CASCADE;
  DROP TABLE "payload"."iqac_overview_mission" CASCADE;
  DROP TABLE "payload"."iqac_overview_commitments" CASCADE;
  DROP TABLE "payload"."iqac_overview_frameworks" CASCADE;
  DROP TABLE "payload"."iqac_overview" CASCADE;
  DROP TABLE "payload"."_iqac_overview_v_version_mission" CASCADE;
  DROP TABLE "payload"."_iqac_overview_v_version_commitments" CASCADE;
  DROP TABLE "payload"."_iqac_overview_v_version_frameworks" CASCADE;
  DROP TABLE "payload"."_iqac_overview_v" CASCADE;
  DROP TABLE "payload"."iqac_initiatives_initiatives" CASCADE;
  DROP TABLE "payload"."iqac_initiatives_responsibilities" CASCADE;
  DROP TABLE "payload"."iqac_initiatives" CASCADE;
  DROP TABLE "payload"."_iqac_initiatives_v_version_initiatives" CASCADE;
  DROP TABLE "payload"."_iqac_initiatives_v_version_responsibilities" CASCADE;
  DROP TABLE "payload"."_iqac_initiatives_v" CASCADE;
  DROP TABLE "payload"."iqac_support_contacts" CASCADE;
  DROP TABLE "payload"."iqac_support" CASCADE;
  DROP TABLE "payload"."_iqac_support_v_version_contacts" CASCADE;
  DROP TABLE "payload"."_iqac_support_v" CASCADE;
  DROP TABLE "payload"."iqac_reports_aqar" CASCADE;
  DROP TABLE "payload"."iqac_reports_minutes" CASCADE;
  DROP TABLE "payload"."iqac_reports_other" CASCADE;
  DROP TABLE "payload"."iqac_reports" CASCADE;
  DROP TABLE "payload"."_iqac_reports_v_version_aqar" CASCADE;
  DROP TABLE "payload"."_iqac_reports_v_version_minutes" CASCADE;
  DROP TABLE "payload"."_iqac_reports_v_version_other" CASCADE;
  DROP TABLE "payload"."_iqac_reports_v" CASCADE;
  DROP TABLE "payload"."iqac_feedback_types" CASCADE;
  DROP TABLE "payload"."iqac_feedback" CASCADE;
  DROP TABLE "payload"."_iqac_feedback_v_version_types" CASCADE;
  DROP TABLE "payload"."_iqac_feedback_v" CASCADE;
  DROP TABLE "payload"."iqac_contact_details" CASCADE;
  DROP TABLE "payload"."iqac_contact" CASCADE;
  DROP TABLE "payload"."_iqac_contact_v_version_details" CASCADE;
  DROP TABLE "payload"."_iqac_contact_v" CASCADE;
  DROP TABLE "payload"."iqac_nba_programmes" CASCADE;
  DROP TABLE "payload"."iqac_nba" CASCADE;
  DROP TABLE "payload"."_iqac_nba_v_version_programmes" CASCADE;
  DROP TABLE "payload"."_iqac_nba_v" CASCADE;
  DROP TABLE "payload"."site_page_headers_headers" CASCADE;
  DROP TABLE "payload"."site_page_headers" CASCADE;
  DROP TABLE "payload"."_site_page_headers_v_version_headers" CASCADE;
  DROP TABLE "payload"."_site_page_headers_v" CASCADE;
  DROP TABLE "payload"."info_pages_pages" CASCADE;
  DROP TABLE "payload"."info_pages" CASCADE;
  DROP TABLE "payload"."_info_pages_v_version_pages" CASCADE;
  DROP TABLE "payload"."_info_pages_v" CASCADE;
  DROP TABLE "payload"."site_documents" CASCADE;
  DROP TABLE "payload"."_site_documents_v" CASCADE;
  DROP TABLE "payload"."examinations_annual_reports" CASCADE;
  DROP TABLE "payload"."_examinations_annual_reports_v" CASCADE;
  DROP TABLE "payload"."examinations_certificates" CASCADE;
  DROP TABLE "payload"."_examinations_certificates_v" CASCADE;
  DROP TABLE "payload"."examinations_circulars" CASCADE;
  DROP TABLE "payload"."_examinations_circulars_v" CASCADE;
  DROP TABLE "payload"."examinations_citizen_charter" CASCADE;
  DROP TABLE "payload"."_examinations_citizen_charter_v" CASCADE;
  DROP TABLE "payload"."examinations_coe" CASCADE;
  DROP TABLE "payload"."_examinations_coe_v" CASCADE;
  DROP TABLE "payload"."examinations_contact" CASCADE;
  DROP TABLE "payload"."_examinations_contact_v" CASCADE;
  DROP TABLE "payload"."site_footer_links" CASCADE;
  DROP TABLE "payload"."site_footer_logos" CASCADE;
  DROP TABLE "payload"."site_footer_badges" CASCADE;
  DROP TABLE "payload"."site_footer" CASCADE;
  DROP TABLE "payload"."_site_footer_v_version_links" CASCADE;
  DROP TABLE "payload"."_site_footer_v_version_logos" CASCADE;
  DROP TABLE "payload"."_site_footer_v_version_badges" CASCADE;
  DROP TABLE "payload"."_site_footer_v" CASCADE;
  DROP TABLE "payload"."about_overview" CASCADE;
  DROP TABLE "payload"."_about_overview_v" CASCADE;
  DROP TABLE "payload"."about_rankings_awards" CASCADE;
  DROP TABLE "payload"."_about_rankings_awards_v" CASCADE;
  DROP TABLE "payload"."about_vision_mission" CASCADE;
  DROP TABLE "payload"."_about_vision_mission_v" CASCADE;
  DROP TABLE "payload"."academics_overview" CASCADE;
  DROP TABLE "payload"."_academics_overview_v" CASCADE;
  DROP TABLE "payload"."admissions_b_category" CASCADE;
  DROP TABLE "payload"."_admissions_b_category_v" CASCADE;
  DROP TABLE "payload"."admissions_fees" CASCADE;
  DROP TABLE "payload"."_admissions_fees_v" CASCADE;
  DROP TABLE "payload"."admissions_why_mlrit" CASCADE;
  DROP TABLE "payload"."_admissions_why_mlrit_v" CASCADE;
  DROP TABLE "payload"."chronicles_overview" CASCADE;
  DROP TABLE "payload"."_chronicles_overview_v" CASCADE;
  DROP TABLE "payload"."departments_pg" CASCADE;
  DROP TABLE "payload"."_departments_pg_v" CASCADE;
  DROP TABLE "payload"."departments_ug" CASCADE;
  DROP TABLE "payload"."_departments_ug_v" CASCADE;
  DROP TABLE "payload"."examinations_downloads" CASCADE;
  DROP TABLE "payload"."_examinations_downloads_v" CASCADE;
  DROP TABLE "payload"."examinations_fee_results" CASCADE;
  DROP TABLE "payload"."_examinations_fee_results_v" CASCADE;
  DROP TABLE "payload"."examinations_notifications" CASCADE;
  DROP TABLE "payload"."_examinations_notifications_v" CASCADE;
  DROP TABLE "payload"."examinations_pyqs" CASCADE;
  DROP TABLE "payload"."_examinations_pyqs_v" CASCADE;
  DROP TABLE "payload"."examinations_regulations" CASCADE;
  DROP TABLE "payload"."_examinations_regulations_v" CASCADE;
  DROP TABLE "payload"."examinations_student_verifications" CASCADE;
  DROP TABLE "payload"."_examinations_student_verifications_v" CASCADE;
  DROP TABLE "payload"."examinations_timetable_external" CASCADE;
  DROP TABLE "payload"."_examinations_timetable_external_v" CASCADE;
  DROP TABLE "payload"."examinations_timetable_internal" CASCADE;
  DROP TABLE "payload"."_examinations_timetable_internal_v" CASCADE;
  DROP TABLE "payload"."iqac_composition" CASCADE;
  DROP TABLE "payload"."_iqac_composition_v" CASCADE;
  DROP TABLE "payload"."iqac_naac" CASCADE;
  DROP TABLE "payload"."_iqac_naac_v" CASCADE;
  DROP TABLE "payload"."placements_drives" CASCADE;
  DROP TABLE "payload"."_placements_drives_v" CASCADE;
  DROP TABLE "payload"."placements_global_certification" CASCADE;
  DROP TABLE "payload"."_placements_global_certification_v" CASCADE;
  DROP TABLE "payload"."placements_industry_readiness" CASCADE;
  DROP TABLE "payload"."_placements_industry_readiness_v" CASCADE;
  DROP TABLE "payload"."placements_overview" CASCADE;
  DROP TABLE "payload"."_placements_overview_v" CASCADE;
  DROP TABLE "payload"."research_support" CASCADE;
  DROP TABLE "payload"."_research_support_v" CASCADE;
  DROP TABLE "payload"."student_life_overview" CASCADE;
  DROP TABLE "payload"."_student_life_overview_v" CASCADE;
  DROP TABLE "payload"."admissions_overview" CASCADE;
  DROP TABLE "payload"."_admissions_overview_v" CASCADE;
  DROP TABLE "payload"."admissions_counselling" CASCADE;
  DROP TABLE "payload"."_admissions_counselling_v" CASCADE;
  DROP TABLE "payload"."admissions_support" CASCADE;
  DROP TABLE "payload"."_admissions_support_v" CASCADE;
  DROP TABLE "payload"."admissions_scholarships" CASCADE;
  DROP TABLE "payload"."_admissions_scholarships_v" CASCADE;
  DROP TABLE "payload"."admissions_by_degree" CASCADE;
  DROP TABLE "payload"."_admissions_by_degree_v" CASCADE;
  DROP TABLE "payload"."examinations_syllabus" CASCADE;
  DROP TABLE "payload"."_examinations_syllabus_v" CASCADE;
  DROP TABLE "payload"."placements_alumni" CASCADE;
  DROP TABLE "payload"."_placements_alumni_v" CASCADE;
  DROP TABLE "payload"."about_internal_governance" CASCADE;
  DROP TABLE "payload"."_about_internal_governance_v" CASCADE;
  DROP TABLE "payload"."site_faculty_profile" CASCADE;
  DROP TABLE "payload"."_site_faculty_profile_v" CASCADE;
  DROP TABLE "payload"."site_research_profile" CASCADE;
  DROP TABLE "payload"."_site_research_profile_v" CASCADE;
  DROP TABLE "payload"."site_syllabus_regulation" CASCADE;
  DROP TABLE "payload"."_site_syllabus_regulation_v" CASCADE;
  DROP TABLE "payload"."site_syllabus_semester" CASCADE;
  DROP TABLE "payload"."_site_syllabus_semester_v" CASCADE;
  DROP TABLE "payload"."admissions_policies" CASCADE;
  DROP TABLE "payload"."_admissions_policies_v" CASCADE;
  DROP TYPE "payload"."enum_users_sections";
  DROP TYPE "payload"."enum_users_role";
  DROP TYPE "payload"."enum_home_hero_status";
  DROP TYPE "payload"."enum__home_hero_v_version_status";
  DROP TYPE "payload"."enum_home_stats_status";
  DROP TYPE "payload"."enum__home_stats_v_version_status";
  DROP TYPE "payload"."enum_home_achievements_status";
  DROP TYPE "payload"."enum__home_achievements_v_version_status";
  DROP TYPE "payload"."enum_home_programs_status";
  DROP TYPE "payload"."enum__home_programs_v_version_status";
  DROP TYPE "payload"."enum_home_why_mlrit_status";
  DROP TYPE "payload"."enum__home_why_mlrit_v_version_status";
  DROP TYPE "payload"."enum_home_success_stories_status";
  DROP TYPE "payload"."enum__home_success_stories_v_version_status";
  DROP TYPE "payload"."enum_home_testimonials_status";
  DROP TYPE "payload"."enum__home_testimonials_v_version_status";
  DROP TYPE "payload"."enum_home_events_status";
  DROP TYPE "payload"."enum__home_events_v_version_status";
  DROP TYPE "payload"."enum_home_placements_status";
  DROP TYPE "payload"."enum__home_placements_v_version_status";
  DROP TYPE "payload"."enum_placements_track_record_status";
  DROP TYPE "payload"."enum__placements_track_record_v_version_status";
  DROP TYPE "payload"."enum_placements_statistics_status";
  DROP TYPE "payload"."enum__placements_statistics_v_version_status";
  DROP TYPE "payload"."enum_placements_mous_status";
  DROP TYPE "payload"."enum__placements_mous_v_version_status";
  DROP TYPE "payload"."enum_placements_support_status";
  DROP TYPE "payload"."enum__placements_support_v_version_status";
  DROP TYPE "payload"."enum_placements_recruiters_status";
  DROP TYPE "payload"."enum__placements_recruiters_v_version_status";
  DROP TYPE "payload"."enum_iqac_aqar_status";
  DROP TYPE "payload"."enum__iqac_aqar_v_version_status";
  DROP TYPE "payload"."enum_iqac_best_practices_status";
  DROP TYPE "payload"."enum__iqac_best_practices_v_version_status";
  DROP TYPE "payload"."enum_iqac_functions_status";
  DROP TYPE "payload"."enum__iqac_functions_v_version_status";
  DROP TYPE "payload"."enum_iqac_objectives_status";
  DROP TYPE "payload"."enum__iqac_objectives_v_version_status";
  DROP TYPE "payload"."enum_iqac_overview_status";
  DROP TYPE "payload"."enum__iqac_overview_v_version_status";
  DROP TYPE "payload"."enum_iqac_initiatives_status";
  DROP TYPE "payload"."enum__iqac_initiatives_v_version_status";
  DROP TYPE "payload"."enum_iqac_support_status";
  DROP TYPE "payload"."enum__iqac_support_v_version_status";
  DROP TYPE "payload"."enum_iqac_reports_status";
  DROP TYPE "payload"."enum__iqac_reports_v_version_status";
  DROP TYPE "payload"."enum_iqac_feedback_status";
  DROP TYPE "payload"."enum__iqac_feedback_v_version_status";
  DROP TYPE "payload"."enum_iqac_contact_status";
  DROP TYPE "payload"."enum__iqac_contact_v_version_status";
  DROP TYPE "payload"."enum_iqac_nba_status";
  DROP TYPE "payload"."enum__iqac_nba_v_version_status";
  DROP TYPE "payload"."enum_site_page_headers_status";
  DROP TYPE "payload"."enum__site_page_headers_v_version_status";
  DROP TYPE "payload"."enum_info_pages_status";
  DROP TYPE "payload"."enum__info_pages_v_version_status";
  DROP TYPE "payload"."enum_site_documents_status";
  DROP TYPE "payload"."enum__site_documents_v_version_status";
  DROP TYPE "payload"."enum_examinations_annual_reports_status";
  DROP TYPE "payload"."enum__examinations_annual_reports_v_version_status";
  DROP TYPE "payload"."enum_examinations_certificates_status";
  DROP TYPE "payload"."enum__examinations_certificates_v_version_status";
  DROP TYPE "payload"."enum_examinations_circulars_status";
  DROP TYPE "payload"."enum__examinations_circulars_v_version_status";
  DROP TYPE "payload"."enum_examinations_citizen_charter_status";
  DROP TYPE "payload"."enum__examinations_citizen_charter_v_version_status";
  DROP TYPE "payload"."enum_examinations_coe_status";
  DROP TYPE "payload"."enum__examinations_coe_v_version_status";
  DROP TYPE "payload"."enum_examinations_contact_status";
  DROP TYPE "payload"."enum__examinations_contact_v_version_status";
  DROP TYPE "payload"."enum_site_footer_status";
  DROP TYPE "payload"."enum__site_footer_v_version_status";
  DROP TYPE "payload"."enum_about_overview_status";
  DROP TYPE "payload"."enum__about_overview_v_version_status";
  DROP TYPE "payload"."enum_about_rankings_awards_status";
  DROP TYPE "payload"."enum__about_rankings_awards_v_version_status";
  DROP TYPE "payload"."enum_about_vision_mission_status";
  DROP TYPE "payload"."enum__about_vision_mission_v_version_status";
  DROP TYPE "payload"."enum_academics_overview_status";
  DROP TYPE "payload"."enum__academics_overview_v_version_status";
  DROP TYPE "payload"."enum_admissions_b_category_status";
  DROP TYPE "payload"."enum__admissions_b_category_v_version_status";
  DROP TYPE "payload"."enum_admissions_fees_status";
  DROP TYPE "payload"."enum__admissions_fees_v_version_status";
  DROP TYPE "payload"."enum_admissions_why_mlrit_status";
  DROP TYPE "payload"."enum__admissions_why_mlrit_v_version_status";
  DROP TYPE "payload"."enum_chronicles_overview_status";
  DROP TYPE "payload"."enum__chronicles_overview_v_version_status";
  DROP TYPE "payload"."enum_departments_pg_status";
  DROP TYPE "payload"."enum__departments_pg_v_version_status";
  DROP TYPE "payload"."enum_departments_ug_status";
  DROP TYPE "payload"."enum__departments_ug_v_version_status";
  DROP TYPE "payload"."enum_examinations_downloads_status";
  DROP TYPE "payload"."enum__examinations_downloads_v_version_status";
  DROP TYPE "payload"."enum_examinations_fee_results_status";
  DROP TYPE "payload"."enum__examinations_fee_results_v_version_status";
  DROP TYPE "payload"."enum_examinations_notifications_status";
  DROP TYPE "payload"."enum__examinations_notifications_v_version_status";
  DROP TYPE "payload"."enum_examinations_pyqs_status";
  DROP TYPE "payload"."enum__examinations_pyqs_v_version_status";
  DROP TYPE "payload"."enum_examinations_regulations_status";
  DROP TYPE "payload"."enum__examinations_regulations_v_version_status";
  DROP TYPE "payload"."enum_examinations_student_verifications_status";
  DROP TYPE "payload"."enum__examinations_student_verifications_v_version_status";
  DROP TYPE "payload"."enum_examinations_timetable_external_status";
  DROP TYPE "payload"."enum__examinations_timetable_external_v_version_status";
  DROP TYPE "payload"."enum_examinations_timetable_internal_status";
  DROP TYPE "payload"."enum__examinations_timetable_internal_v_version_status";
  DROP TYPE "payload"."enum_iqac_composition_status";
  DROP TYPE "payload"."enum__iqac_composition_v_version_status";
  DROP TYPE "payload"."enum_iqac_naac_status";
  DROP TYPE "payload"."enum__iqac_naac_v_version_status";
  DROP TYPE "payload"."enum_placements_drives_status";
  DROP TYPE "payload"."enum__placements_drives_v_version_status";
  DROP TYPE "payload"."enum_placements_global_certification_status";
  DROP TYPE "payload"."enum__placements_global_certification_v_version_status";
  DROP TYPE "payload"."enum_placements_industry_readiness_status";
  DROP TYPE "payload"."enum__placements_industry_readiness_v_version_status";
  DROP TYPE "payload"."enum_placements_overview_status";
  DROP TYPE "payload"."enum__placements_overview_v_version_status";
  DROP TYPE "payload"."enum_research_support_status";
  DROP TYPE "payload"."enum__research_support_v_version_status";
  DROP TYPE "payload"."enum_student_life_overview_status";
  DROP TYPE "payload"."enum__student_life_overview_v_version_status";
  DROP TYPE "payload"."enum_admissions_overview_status";
  DROP TYPE "payload"."enum__admissions_overview_v_version_status";
  DROP TYPE "payload"."enum_admissions_counselling_status";
  DROP TYPE "payload"."enum__admissions_counselling_v_version_status";
  DROP TYPE "payload"."enum_admissions_support_status";
  DROP TYPE "payload"."enum__admissions_support_v_version_status";
  DROP TYPE "payload"."enum_admissions_scholarships_status";
  DROP TYPE "payload"."enum__admissions_scholarships_v_version_status";
  DROP TYPE "payload"."enum_admissions_by_degree_status";
  DROP TYPE "payload"."enum__admissions_by_degree_v_version_status";
  DROP TYPE "payload"."enum_examinations_syllabus_status";
  DROP TYPE "payload"."enum__examinations_syllabus_v_version_status";
  DROP TYPE "payload"."enum_placements_alumni_status";
  DROP TYPE "payload"."enum__placements_alumni_v_version_status";
  DROP TYPE "payload"."enum_about_internal_governance_status";
  DROP TYPE "payload"."enum__about_internal_governance_v_version_status";
  DROP TYPE "payload"."enum_site_faculty_profile_status";
  DROP TYPE "payload"."enum__site_faculty_profile_v_version_status";
  DROP TYPE "payload"."enum_site_research_profile_status";
  DROP TYPE "payload"."enum__site_research_profile_v_version_status";
  DROP TYPE "payload"."enum_site_syllabus_regulation_status";
  DROP TYPE "payload"."enum__site_syllabus_regulation_v_version_status";
  DROP TYPE "payload"."enum_site_syllabus_semester_status";
  DROP TYPE "payload"."enum__site_syllabus_semester_v_version_status";
  DROP TYPE "payload"."enum_admissions_policies_status";
  DROP TYPE "payload"."enum__admissions_policies_v_version_status";`)

  await db.execute(sql`DROP SCHEMA IF EXISTS "payload" CASCADE;`)
}
