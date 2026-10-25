CREATE TABLE "lunch_weeks" (
	"iso_year" integer NOT NULL,
	"iso_week" integer NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"days" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"prices" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lunch_weeks_iso_year_iso_week_pk" PRIMARY KEY("iso_year","iso_week"),
	CONSTRAINT "lunch_weeks_week_range" CHECK ("lunch_weeks"."iso_week" between 1 and 53)
);
