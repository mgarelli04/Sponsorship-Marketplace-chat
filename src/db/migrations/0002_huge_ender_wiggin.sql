CREATE TYPE "public"."chat_connection_status" AS ENUM('pending', 'accepted', 'closed');--> statement-breakpoint
CREATE TABLE "chat_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"sponsor_company_id" uuid NOT NULL,
	"sponsor_user_id" uuid NOT NULL,
	"requested_by_user_id" uuid NOT NULL,
	"accepted_by_user_id" uuid,
	"closed_by_user_id" uuid,
	"status" "chat_connection_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"accepted_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"last_message_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"connection_id" uuid NOT NULL,
	"sender_user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_connections" ADD CONSTRAINT "chat_connections_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_connections" ADD CONSTRAINT "chat_connections_sponsor_company_id_sponsor_companies_id_fk" FOREIGN KEY ("sponsor_company_id") REFERENCES "public"."sponsor_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_connections" ADD CONSTRAINT "chat_connections_sponsor_user_id_profiles_id_fk" FOREIGN KEY ("sponsor_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_connections" ADD CONSTRAINT "chat_connections_requested_by_user_id_profiles_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_connections" ADD CONSTRAINT "chat_connections_accepted_by_user_id_profiles_id_fk" FOREIGN KEY ("accepted_by_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_connections" ADD CONSTRAINT "chat_connections_closed_by_user_id_profiles_id_fk" FOREIGN KEY ("closed_by_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_connection_id_chat_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."chat_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_user_id_profiles_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_connections_creator_id_idx" ON "chat_connections" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "chat_connections_sponsor_company_id_idx" ON "chat_connections" USING btree ("sponsor_company_id");--> statement-breakpoint
CREATE INDEX "chat_connections_sponsor_user_id_idx" ON "chat_connections" USING btree ("sponsor_user_id");--> statement-breakpoint
CREATE INDEX "chat_connections_status_idx" ON "chat_connections" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_messages_connection_id_idx" ON "chat_messages" USING btree ("connection_id");--> statement-breakpoint
CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages" USING btree ("created_at");