import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const dishes = pgTable(
  'dishes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    allergens: text('allergens').array().notNull().default(sql`'{}'::text[]`),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex('dishes_name_lower_idx').on(sql`lower(${t.name})`)],
);

export const lunchWeeks = pgTable(
  'lunch_weeks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    isoYear: integer('iso_year').notNull(),
    isoWeek: integer('iso_week').notNull(),
    published: boolean('published').notNull().default(false),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique('lunch_weeks_year_week_unique').on(t.isoYear, t.isoWeek)],
);

export const lunchDays = pgTable(
  'lunch_days',
  {
    weekId: uuid('week_id')
      .notNull()
      .references(() => lunchWeeks.id, { onDelete: 'cascade' }),
    day: smallint('day').notNull(),
    note: text('note'),
  },
  (t) => [
    primaryKey({ columns: [t.weekId, t.day] }),
    check('lunch_days_day_range', sql`${t.day} between 1 and 7`),
  ],
);

export const lunchDishes = pgTable(
  'lunch_dishes',
  {
    weekId: uuid('week_id').notNull(),
    day: smallint('day').notNull(),
    dishId: uuid('dish_id')
      .notNull()
      .references(() => dishes.id, { onDelete: 'restrict' }),
    position: integer('position').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.weekId, t.day, t.position] }),
    foreignKey({
      columns: [t.weekId, t.day],
      foreignColumns: [lunchDays.weekId, lunchDays.day],
    }).onDelete('cascade'),
  ],
);
