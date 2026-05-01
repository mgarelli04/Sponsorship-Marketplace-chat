CREATE TYPE "public"."asset_role" AS ENUM('logo', 'cover', 'gallery_image', 'gallery_video');--> statement-breakpoint
CREATE TYPE "public"."campaign_goal" AS ENUM('brand_awareness', 'lead_generation', 'product_launch', 'community_building', 'sampling', 'employer_branding');--> statement-breakpoint
CREATE TYPE "public"."creator_type" AS ENUM('venue', 'organizer', 'festival', 'conference', 'community_host', 'media_brand');--> statement-breakpoint
CREATE TYPE "public"."event_format" AS ENUM('in_person', 'hybrid', 'online');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('upcoming', 'past', 'cancelled', 'draft');--> statement-breakpoint
CREATE TYPE "public"."inquiry_source" AS ENUM('public_profile', 'search', 'direct_link', 'admin_created');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('pending', 'negotiating', 'closed_won', 'closed_lost');--> statement-breakpoint
CREATE TYPE "public"."inventory_type" AS ENUM('booth', 'stage_mention', 'logo_placement', 'lanyard', 'vip_activation', 'product_sampling', 'newsletter', 'social_post', 'email_blast', 'digital_screen', 'speaking_slot', 'custom');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('not_started', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."package_type" AS ENUM('bronze', 'silver', 'gold', 'custom');--> statement-breakpoint
CREATE TYPE "public"."profile_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."snapshot_scope" AS ENUM('creator', 'event');--> statement-breakpoint
CREATE TYPE "public"."source_provider" AS ENUM('eventbrite', 'manual', 'third_party');--> statement-breakpoint
CREATE TYPE "public"."storage_provider" AS ENUM('s3', 'ipfs', 'supabase_storage');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('unverified', 'pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TABLE "audience_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid,
	"event_id" uuid,
	"snapshot_scope" "snapshot_scope" NOT NULL,
	"source_provider" "source_provider" NOT NULL,
	"verification_status" "verification_status" NOT NULL,
	"snapshot_date" date NOT NULL,
	"total_attendees" integer DEFAULT 0 NOT NULL,
	"total_tickets_sold" integer DEFAULT 0 NOT NULL,
	"total_checkins" integer DEFAULT 0 NOT NULL,
	"repeat_attendance_pct" numeric(5, 2),
	"demographics_jsonb" jsonb NOT NULL,
	"top_locations_jsonb" jsonb NOT NULL,
	"interests_jsonb" jsonb NOT NULL,
	"notes" text NOT NULL,
	"last_synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "creator_categories" (
	"creator_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "creator_categories_pk" PRIMARY KEY("creator_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "creator_interests" (
	"creator_id" uuid NOT NULL,
	"interest_id" uuid NOT NULL,
	"weight" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "creator_interests_pk" PRIMARY KEY("creator_id","interest_id")
);
--> statement-breakpoint
CREATE TABLE "creator_past_sponsors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"sponsor_name" text NOT NULL,
	"logo_url" text NOT NULL,
	"campaign_title" text,
	"description" text NOT NULL,
	"result_metrics_jsonb" jsonb,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_type" "creator_type" NOT NULL,
	"display_name" text NOT NULL,
	"legal_name" text,
	"slug" text NOT NULL,
	"tagline" text NOT NULL,
	"website_url" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"instagram_url" text NOT NULL,
	"contact_email" text NOT NULL,
	"country_code" text NOT NULL,
	"region" text NOT NULL,
	"city" text NOT NULL,
	"address_line" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"onboarding_status" "onboarding_status" NOT NULL,
	"profile_status" "profile_status" NOT NULL,
	"verification_status" "verification_status" NOT NULL,
	"response_time_hours" integer,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "creators_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "creators_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"asset_role" "asset_role" NOT NULL,
	"storage_provider" "storage_provider" NOT NULL,
	"file_path" text NOT NULL,
	"public_url" text NOT NULL,
	"mime_type" text NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creators_media_kit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"headline" text NOT NULL,
	"short_description" text NOT NULL,
	"about_text" text NOT NULL,
	"mission_text" text NOT NULL,
	"why_partner_text" text NOT NULL,
	"audience_summary_text" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"last_content_update_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "creators_media_kit_creator_id_unique" UNIQUE("creator_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"external_provider" text,
	"external_event_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_format" "event_format" NOT NULL,
	"category_id" uuid,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"timezone" text NOT NULL,
	"venue_name" text NOT NULL,
	"country_code" text NOT NULL,
	"region" text NOT NULL,
	"city" text NOT NULL,
	"address_line" text NOT NULL,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"tickets_sold" integer DEFAULT 0 NOT NULL,
	"checkins_count" integer DEFAULT 0 NOT NULL,
	"event_status" "event_status" NOT NULL,
	"verification_status" "verification_status" NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "interests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"inventory_type" "inventory_type" NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"unit_type" text,
	"capacity" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_items" (
	"package_id" uuid NOT NULL,
	"inventory_item_id" uuid NOT NULL,
	"quantity" integer,
	"notes" text,
	CONSTRAINT "package_items_pk" PRIMARY KEY("package_id","inventory_item_id")
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"package_type" "package_type" NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price_amount" numeric(12, 2) NOT NULL,
	"currency_code" text NOT NULL,
	"estimated_impressions" integer,
	"estimated_reach" integer,
	"estimated_cpm" numeric(12, 2),
	"is_public" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text NOT NULL,
	"phone" text NOT NULL,
	"role" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"website_url" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"description" text NOT NULL,
	"industry" text NOT NULL,
	"company_size" text,
	"country_code" text,
	"city" text,
	"verification_status" "verification_status" NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sponsor_companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sponsor_saved_creators" (
	"sponsor_company_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"saved_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sponsor_saved_creators_pk" PRIMARY KEY("sponsor_company_id","creator_id","saved_by_user_id")
);
--> statement-breakpoint
CREATE TABLE "sponsorship_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"event_id" uuid,
	"sponsor_company_id" uuid NOT NULL,
	"sponsor_user_id" uuid NOT NULL,
	"package_id" uuid,
	"source" "inquiry_source" NOT NULL,
	"campaign_goal" "campaign_goal" NOT NULL,
	"budget_min" numeric(12, 2),
	"budget_max" numeric(12, 2),
	"currency_code" text NOT NULL,
	"preferred_start_date" date,
	"preferred_end_date" date,
	"requirements_text" text NOT NULL,
	"status" "inquiry_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_message_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "audience_snapshots" ADD CONSTRAINT "audience_snapshots_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audience_snapshots" ADD CONSTRAINT "audience_snapshots_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_categories" ADD CONSTRAINT "creator_categories_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_categories" ADD CONSTRAINT "creator_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_interests" ADD CONSTRAINT "creator_interests_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_interests" ADD CONSTRAINT "creator_interests_interest_id_interests_id_fk" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_past_sponsors" ADD CONSTRAINT "creator_past_sponsors_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creators" ADD CONSTRAINT "creators_created_by_user_id_profiles_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creators_assets" ADD CONSTRAINT "creators_assets_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creators_media_kit" ADD CONSTRAINT "creators_media_kit_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_companies" ADD CONSTRAINT "sponsor_companies_created_by_user_id_profiles_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_saved_creators" ADD CONSTRAINT "sponsor_saved_creators_sponsor_company_id_sponsor_companies_id_fk" FOREIGN KEY ("sponsor_company_id") REFERENCES "public"."sponsor_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_saved_creators" ADD CONSTRAINT "sponsor_saved_creators_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_saved_creators" ADD CONSTRAINT "sponsor_saved_creators_saved_by_user_id_profiles_id_fk" FOREIGN KEY ("saved_by_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_inquiries" ADD CONSTRAINT "sponsorship_inquiries_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_inquiries" ADD CONSTRAINT "sponsorship_inquiries_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_inquiries" ADD CONSTRAINT "sponsorship_inquiries_sponsor_company_id_sponsor_companies_id_fk" FOREIGN KEY ("sponsor_company_id") REFERENCES "public"."sponsor_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_inquiries" ADD CONSTRAINT "sponsorship_inquiries_sponsor_user_id_profiles_id_fk" FOREIGN KEY ("sponsor_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_inquiries" ADD CONSTRAINT "sponsorship_inquiries_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audience_snapshots_creator_id_idx" ON "audience_snapshots" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "audience_snapshots_event_id_idx" ON "audience_snapshots" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "creator_categories_category_id_idx" ON "creator_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "creator_interests_interest_id_idx" ON "creator_interests" USING btree ("interest_id");--> statement-breakpoint
CREATE INDEX "creator_past_sponsors_creator_id_idx" ON "creator_past_sponsors" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "creators_created_by_user_id_idx" ON "creators" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "creators_country_code_idx" ON "creators" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "creators_profile_status_idx" ON "creators" USING btree ("profile_status");--> statement-breakpoint
CREATE INDEX "creators_assets_creator_id_idx" ON "creators_assets" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "creators_media_kit_creator_id_idx" ON "creators_media_kit" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "events_creator_id_idx" ON "events" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "events_category_id_idx" ON "events" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "events_starts_at_idx" ON "events" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "inventory_items_creator_id_idx" ON "inventory_items" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "package_items_inventory_item_id_idx" ON "package_items" USING btree ("inventory_item_id");--> statement-breakpoint
CREATE INDEX "packages_creator_id_idx" ON "packages" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "sponsor_companies_created_by_user_id_idx" ON "sponsor_companies" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "sponsor_saved_creators_creator_id_idx" ON "sponsor_saved_creators" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "sponsorship_inquiries_creator_id_idx" ON "sponsorship_inquiries" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "sponsorship_inquiries_sponsor_company_id_idx" ON "sponsorship_inquiries" USING btree ("sponsor_company_id");--> statement-breakpoint
CREATE INDEX "sponsorship_inquiries_event_id_idx" ON "sponsorship_inquiries" USING btree ("event_id");