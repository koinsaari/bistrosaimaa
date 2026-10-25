import { existsSync } from 'node:fs';
import { sql } from 'drizzle-orm';
import { CURRENT_WEEK, CURRENT_WEEK_PRICES, CURRENT_WEEK_UPDATED_AT, NEXT_WEEK, type FixtureWeek } from '../../e2e/fixtures/lunch';
import { DAY_KEYS, type LunchPrices } from '../lib/lunch';
import { addWeeks, shownLunchWeek, type IsoWeek } from '../lib/isoWeek';
import { getDb, lunchWeeks } from './index';

// Wipes every table. Only ever loads .env.e2e (ci branch), never .env.local, and needs an explicit opt-in outside CI.
if (process.env.CI !== 'true' && process.env.ALLOW_DB_TRUNCATE !== '1') {
  console.error('Refusing to truncate: set CI=true or ALLOW_DB_TRUNCATE=1.');
  process.exit(1);
}
if (!process.env.DATABASE_URL && existsSync('.env.e2e')) {
  process.loadEnvFile('.env.e2e');
}

const db = getDb();

async function insertWeek(week: IsoWeek, published: boolean, content: FixtureWeek, updatedAt?: Date, prices: LunchPrices | null = null) {
  const days = Object.fromEntries(
    DAY_KEYS.flatMap((key) => {
      const entry = content[key];
      return entry ? [[key, { dishes: entry.dishes, note: entry.note ?? null }]] : [];
    }),
  );
  await db.insert(lunchWeeks).values({ ...week, published, days, prices, updatedAt });
}

async function main() {
  const { rows } = await db.execute(sql`select tablename from pg_tables where schemaname = 'public' and tablename like 'bot\_%'`);
  const botTables = rows.map((r) => `"${r.tablename}"`);
  await db.execute(sql.raw(`truncate table "lunch_weeks"${botTables.map((t) => `, ${t}`).join('')} cascade`));

  const shown = shownLunchWeek(new Date());
  await insertWeek(shown, true, CURRENT_WEEK, CURRENT_WEEK_UPDATED_AT, CURRENT_WEEK_PRICES);
  await insertWeek(addWeeks(shown, 1), false, NEXT_WEEK);

  console.log('e2e fixture seeded');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
