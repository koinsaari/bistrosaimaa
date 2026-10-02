import { existsSync } from 'node:fs';
import { sql } from 'drizzle-orm';
import { CURRENT_WEEK, CURRENT_WEEK_UPDATED_AT, FIXTURE_CATEGORY, FIXTURE_DISHES, NEXT_WEEK, RETIRED_DISH, type FixtureWeek } from '../../e2e/fixtures/lunch';
import { DAY_KEYS } from '../lib/lunch';
import { currentIsoWeek, type IsoWeek } from '../lib/isoWeek';
import { categories, dishes, getDb, lunchDays, lunchDishes, lunchWeeks } from './index';

// Wipes every table. Only ever loads .env.e2e (ci branch), never .env.local, and needs an explicit opt-in outside CI.
if (process.env.CI !== 'true' && process.env.ALLOW_DB_TRUNCATE !== '1') {
  console.error('Refusing to truncate: set CI=true or ALLOW_DB_TRUNCATE=1.');
  process.exit(1);
}
if (!process.env.DATABASE_URL && existsSync('.env.e2e')) {
  process.loadEnvFile('.env.e2e');
}

const db = getDb();

async function insertWeek(
  week: IsoWeek,
  published: boolean,
  content: FixtureWeek,
  dishIdByName: Map<string, string>,
  updatedAt?: Date,
) {
  const [{ id: weekId }] = await db
    .insert(lunchWeeks)
    .values({ ...week, published, updatedAt })
    .returning({ id: lunchWeeks.id });

  for (const [i, dayKey] of DAY_KEYS.entries()) {
    const entry = content[dayKey];
    if (!entry) continue;
    const day = i + 1;
    await db.insert(lunchDays).values({ weekId, day, note: entry.note ?? null });
    if (entry.dishes.length) {
      await db.insert(lunchDishes).values(
        entry.dishes.map((name, position) => ({ weekId, day, position, dishId: dishIdByName.get(name)! })),
      );
    }
  }
}

async function main() {
  await db.execute(sql`truncate table lunch_dishes, lunch_days, lunch_weeks, dishes, categories, login_attempts, admin_state cascade`);

  const [{ id: categoryId }] = await db
    .insert(categories)
    .values({ name: FIXTURE_CATEGORY })
    .returning({ id: categories.id });

  const inserted = await db
    .insert(dishes)
    .values([
      ...FIXTURE_DISHES.map((name) => ({ name, categoryId, allergens: ['L', 'G'] })),
      { name: RETIRED_DISH, categoryId, isActive: false },
    ])
    .returning({ id: dishes.id, name: dishes.name });
  const dishIdByName = new Map(inserted.map((d) => [d.name, d.id]));

  const now = new Date();
  const nextWeekDate = new Date(now.getTime() + 7 * 86_400_000);
  await insertWeek(currentIsoWeek(now, 'Europe/Helsinki'), true, CURRENT_WEEK, dishIdByName, CURRENT_WEEK_UPDATED_AT);
  await insertWeek(currentIsoWeek(nextWeekDate, 'Europe/Helsinki'), false, NEXT_WEEK, dishIdByName);

  console.log('e2e fixture seeded');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
