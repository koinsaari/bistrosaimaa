CREATE TABLE "bot_changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"iso_year" integer NOT NULL,
	"iso_week" integer NOT NULL,
	"before" jsonb,
	"after" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"undone_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "bot_changes_week_idx" ON "bot_changes" USING btree ("iso_year","iso_week","created_at");