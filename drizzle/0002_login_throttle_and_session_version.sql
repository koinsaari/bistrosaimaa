CREATE TABLE "admin_state" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"session_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "admin_state_singleton" CHECK ("admin_state"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_hash" text NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "login_attempts_ip_time_idx" ON "login_attempts" USING btree ("ip_hash","attempted_at");