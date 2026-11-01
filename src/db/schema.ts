import { sql } from 'drizzle-orm';
import { bigint, boolean, check, index, integer, jsonb, pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
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

const telegramId = (name: string) => bigint(name, { mode: 'number' });

export type WeekSnapshot = { days: Partial<Record<DayKey, LunchDay>>; prices: LunchPrices | null; published: boolean };

export const botChanges = pgTable(
  'bot_changes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    chatId: telegramId('chat_id').notNull(),
    userId: telegramId('user_id').notNull(),
    isoYear: integer('iso_year').notNull(),
    isoWeek: integer('iso_week').notNull(),
    before: jsonb('before').$type<WeekSnapshot>(),
    after: jsonb('after').$type<WeekSnapshot>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    undoneAt: timestamp('undone_at', { withTimezone: true }),
  },
  (t) => [index('bot_changes_week_idx').on(t.isoYear, t.isoWeek, t.createdAt)],
);
