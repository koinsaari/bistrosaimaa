CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "dishes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category_id" uuid,
	"allergens" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lunch_days" (
	"week_id" uuid NOT NULL,
	"day" smallint NOT NULL,
	"note" text,
	CONSTRAINT "lunch_days_week_id_day_pk" PRIMARY KEY("week_id","day"),
	CONSTRAINT "lunch_days_day_range" CHECK ("lunch_days"."day" between 1 and 7)
);
--> statement-breakpoint
CREATE TABLE "lunch_dishes" (
	"week_id" uuid NOT NULL,
	"day" smallint NOT NULL,
	"dish_id" uuid NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "lunch_dishes_week_id_day_position_pk" PRIMARY KEY("week_id","day","position")
);
--> statement-breakpoint
CREATE TABLE "lunch_weeks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"iso_year" integer NOT NULL,
	"iso_week" integer NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lunch_weeks_year_week_unique" UNIQUE("iso_year","iso_week")
);
--> statement-breakpoint
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lunch_days" ADD CONSTRAINT "lunch_days_week_id_lunch_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."lunch_weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lunch_dishes" ADD CONSTRAINT "lunch_dishes_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lunch_dishes" ADD CONSTRAINT "lunch_dishes_week_id_day_lunch_days_week_id_day_fk" FOREIGN KEY ("week_id","day") REFERENCES "public"."lunch_days"("week_id","day") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "dishes_name_lower_idx" ON "dishes" USING btree (lower("name"));