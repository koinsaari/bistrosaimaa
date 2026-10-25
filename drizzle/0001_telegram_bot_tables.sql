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
CREATE TABLE "bot_chat_locks" (
	"chat_id" bigint PRIMARY KEY NOT NULL,
	"locked_until" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bot_messages" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bot_messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"chat_id" bigint NOT NULL,
	"role" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bot_updates" (
	"update_id" bigint PRIMARY KEY NOT NULL,
	"chat_id" bigint NOT NULL,
	"payload" jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "bot_changes_week_idx" ON "bot_changes" USING btree ("iso_year","iso_week","created_at");--> statement-breakpoint
CREATE INDEX "bot_messages_chat_idx" ON "bot_messages" USING btree ("chat_id","created_at");--> statement-breakpoint
CREATE INDEX "bot_updates_pending_idx" ON "bot_updates" USING btree ("chat_id","update_id") WHERE "bot_updates"."processed_at" is null;