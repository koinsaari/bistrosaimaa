import { sql } from 'drizzle-orm';
import { boolean, check, integer, jsonb, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import type { LunchDay, LunchPrices, DayKey } from '../lib/lunch';

export const lunchWeeks = pgTable(
  'lunch_weeks',
  {
    isoYear: integer('iso_year').notNull(),
    isoWeek: integer('iso_week').notNull(),
    published: boolean('published').notNull().default(false),
    days: jsonb('days').$type<Partial<Record<DayKey, LunchDay>>>().notNull().default({}),
    prices: jsonb('prices').$type<LunchPrices>(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.isoYear, t.isoWeek] }),
    check('lunch_weeks_week_range', sql`${t.isoWeek} between 1 and 53`),
  ],
);
