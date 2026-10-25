import { sql } from 'drizzle-orm';
import { bigint, boolean, check, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
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

// Telegram bot state. Telegram ids exceed 32 bits, and stay far below 2^53, so `number` mode is safe.
const telegramId = (name: string) => bigint(name, { mode: 'number' });

// Every webhook update, kept for de-duplication (primary key) and ordered per-chat processing.
export const botUpdates = pgTable(
  'bot_updates',
  {
    updateId: telegramId('update_id').primaryKey(),
    chatId: telegramId('chat_id').notNull(),
    payload: jsonb('payload').notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
  },
  (t) => [index('bot_updates_pending_idx').on(t.chatId, t.updateId).where(sql`${t.processedAt} is null`)],
);

// One row per chat being drained; the row is the lock and expires on its own if the holder dies.
export const botChatLocks = pgTable('bot_chat_locks', {
  chatId: telegramId('chat_id').primaryKey(),
  lockedUntil: timestamp('locked_until', { withTimezone: true }).notNull(),
});

export const botMessages = pgTable(
  'bot_messages',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    chatId: telegramId('chat_id').notNull(),
    role: text('role').$type<'user' | 'assistant'>().notNull(),
    content: jsonb('content').$type<{ text: string }>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('bot_messages_chat_idx').on(t.chatId, t.createdAt)],
);

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
