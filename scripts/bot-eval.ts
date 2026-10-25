// Manual eval of the real model (costs a few cents, never runs in CI): `npm run bot:eval`.
//  - image cases: every e2e/fixtures/menus/*.{pdf,jpg,png} with a sibling *.expected.json
//  - text cases: Finnish commands run through the real agent against a fixed starting week in the ci database
// Env: AI_GATEWAY_API_KEY (or VERCEL_OIDC_TOKEN) is read from .env.local (only those variables), DATABASE_URL from .env.e2e (the Neon ci branch).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';

function loadOnly(file: string, name: string) {
  if (!existsSync(file)) return;
  const value = parseEnv(readFileSync(file, 'utf8'))[name];
  if (value) process.env[name] = value;
}
// Gateway auth only: an API key, or the short-lived OIDC token `vercel env pull` writes. Nothing else from .env.local.
if (!process.env.AI_GATEWAY_API_KEY) loadOnly('.env.local', 'AI_GATEWAY_API_KEY');
if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) loadOnly('.env.local', 'VERCEL_OIDC_TOKEN');
// Always the ci branch, whatever the shell has: the text cases write to the database.
delete process.env.DATABASE_URL;
loadOnly('.env.e2e', 'DATABASE_URL');

import { describeError } from '@/lib/bot/handleUpdate';

type Day = { dishes: { name: string; allergens: string[] }[]; note?: string | null };
type Expected = {
  isoWeek: number;
  dateRange: { start: string; end: string };
  prices: { weekdayCents: number; weekendCents: number } | null;
  days: Record<string, Day>;
};

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

/** One comparable line per fact, so a diff is a set difference. */
function flatten(week: { isoWeek: number | null; dateRange: { start: string; end: string } | null; prices: Expected['prices']; days: Record<string, Day | null | undefined> }): string[] {
  const lines = [`week ${week.isoWeek}`, `range ${week.dateRange?.start}..${week.dateRange?.end}`, `prices ${week.prices ? `${week.prices.weekdayCents}/${week.prices.weekendCents}` : 'none'}`];
  for (const [key, day] of Object.entries(week.days)) {
    if (!day) continue;
    day.dishes.forEach((dish, index) => lines.push(`${key}[${index}] ${normalize(dish.name)} {${[...dish.allergens].sort().join(',')}}`));
    if (day.note) lines.push(`${key} note ${normalize(day.note).toLowerCase().replace(/\.$/, '')}`);
  }
  return lines;
}

function diff(expected: string[], actual: string[]): string[] {
  return [
    ...expected.filter((line) => !actual.includes(line)).map((line) => `    - expected ${line}`),
    ...actual.filter((line) => !expected.includes(line)).map((line) => `    + got      ${line}`),
  ];
}

let failed = 0;
function report(name: string, differences: string[]) {
  if (differences.length) failed++;
  console.log(`${differences.length ? '❌' : '✅'} ${name}`);
  for (const line of differences) console.log(line);
}

const MEDIA_TYPES: Record<string, 'application/pdf' | 'image/jpeg' | 'image/png'> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

async function imageCases() {
  const { extractMenu } = await import('@/lib/bot/importMenu');
  const { checkWeekRange } = await import('@/lib/bot/checks');
  const { GATEWAY_MODEL } = await import('@/lib/bot/deps');
  const dir = path.join('e2e', 'fixtures', 'menus');
  const files = readdirSync(dir).filter((file) => MEDIA_TYPES[path.extname(file)] && existsSync(path.join(dir, file.replace(/\.[^.]+$/, '.expected.json'))));
  console.log(`\nImage cases (${files.length}) with ${GATEWAY_MODEL}`);
  for (const file of files) {
    const expected = JSON.parse(readFileSync(path.join(dir, file.replace(/\.[^.]+$/, '.expected.json')), 'utf8')) as Expected;
    try {
      const extraction = await extractMenu(GATEWAY_MODEL, {
        mediaType: MEDIA_TYPES[path.extname(file)],
        data: readFileSync(path.join(dir, file)),
        // The sample lists are for a past or current week; the eval only reads them, so the "past week" check is not applied.
        now: new Date(`${expected.dateRange.start}T08:00:00Z`),
      });
      const differences = diff(flatten(expected), flatten({ ...extraction, days: extraction.days }));
      const range = checkWeekRange(extraction.isoWeek, extraction.dateRange);
      if (!range.ok) differences.push(`    ! week and dates disagree: ${range.error}`);
      report(file, differences);
    } catch (error) {
      report(file, [`    ! ${describeError(error)}`]);
    }
  }
}


const START: Expected['days'] = {
  monday: { dishes: [{ name: 'Lohikeitto', allergens: ['G', 'L'] }, { name: 'Jauhelihakastike', allergens: ['G', 'L'] }] },
  tuesday: { dishes: [{ name: 'Broilerpasta', allergens: ['L'] }] },
  wednesday: { dishes: [{ name: 'Kasvispata', allergens: ['Veg'] }] },
  thursday: { dishes: [{ name: 'Uunilohi', allergens: ['G', 'L'] }] },
  friday: { dishes: [{ name: 'Pizza', allergens: [] }] },
};
const START_PRICES = { weekdayCents: 1320, weekendCents: 1420 };

type TextCase = {
  name: string;
  command: string;
  expect: (week: { days: Record<string, Day>; prices: typeof START_PRICES; published: boolean }) => void;
};

const TEXT_CASES: TextCase[] = [
  {
    name: 'replace a dish',
    command: 'Vaihda maanantain lohikeitto kinkkukeitoksi (L, G)',
    expect: (w) => (w.days.monday.dishes[0] = { name: 'Kinkkukeitto', allergens: ['G', 'L'] }),
  },
  {
    name: 'add a note',
    command: 'Lisää keskiviikolle huomautus: sisältää pähkinää',
    expect: (w) => (w.days.wednesday.note = 'sisältää pähkinää'),
  },
  {
    name: 'change both prices',
    command: 'Hinnat ovat nyt 13,50 ja 14,50',
    expect: (w) => (w.prices = { weekdayCents: 1350, weekendCents: 1450 }),
  },
  {
    name: 'change the weekday price only',
    command: 'Muuta arkipäivän hinnaksi 12,90',
    expect: (w) => (w.prices = { weekdayCents: 1290, weekendCents: 1420 }),
  },
  {
    name: 'clear a day',
    command: 'Poista torstain ruoat',
    expect: (w) => delete w.days.thursday,
  },
  {
    name: 'add a dish to a day',
    command: 'Lisää perjantaille Kalakeitto (L, G)',
    expect: (w) => w.days.friday.dishes.push({ name: 'Kalakeitto', allergens: ['G', 'L'] }),
  },
  {
    name: 'fill an empty weekend day',
    command: 'Lisää lauantaille Lihapullat (L, G) ja Perunamuusi (L, G)',
    expect: (w) => (w.days.saturday = { dishes: [{ name: 'Lihapullat', allergens: ['G', 'L'] }, { name: 'Perunamuusi', allergens: ['G', 'L'] }] }),
  },
  {
    name: 'hide the week',
    command: 'Piilota tämän viikon lista sivulta',
    expect: (w) => (w.published = false),
  },
];

async function textCases() {
  if (!process.env.DATABASE_URL) {
    console.log('\nText cases skipped: DATABASE_URL (ci branch) not found in .env.e2e');
    failed++;
    return;
  }
  const { getDb, lunchWeeks } = await import('@/db');
  const { and, eq } = await import('drizzle-orm');
  const { runAgent } = await import('@/lib/bot/agent');
  const { GATEWAY_MODEL } = await import('@/lib/bot/deps');
  const { appendMessage } = await import('@/lib/bot/memory');
  const { getWeek } = await import('@/lib/lunchWeek');
  const { shownLunchWeek } = await import('@/lib/isoWeek');

  const now = new Date();
  const week = shownLunchWeek(now);
  const where = and(eq(lunchWeeks.isoYear, week.isoYear), eq(lunchWeeks.isoWeek, week.isoWeek));
  const original = await getWeek(week);
  const putStart = () =>
    getDb()
      .insert(lunchWeeks)
      .values({ ...week, days: START, prices: START_PRICES, published: true })
      .onConflictDoUpdate({
        target: [lunchWeeks.isoYear, lunchWeeks.isoWeek],
        set: { days: START, prices: START_PRICES, published: true },
      });

  console.log(`\nText cases (${TEXT_CASES.length}) against week ${week.isoWeek}/${week.isoYear} of the ci database`);
  try {
    for (const [index, textCase] of TEXT_CASES.entries()) {
      // A fresh chat per case: no memory carries over.
      const chatId = 8_000_000_000 + Math.floor(Math.random() * 1_000_000) * 10 + index;
      try {
        await putStart();
        await appendMessage(chatId, 'user', textCase.command);
        await runAgent(GATEWAY_MODEL, { chatId, userId: 1, now });
        const expected = { days: structuredClone(START) as Record<string, Day>, prices: { ...START_PRICES }, published: true };
        textCase.expect(expected);
        const actual = await getWeek(week);
        const toLines = (w: { days: Record<string, Day | undefined>; prices: Expected['prices']; published: boolean } | null) =>
          w ? [...flatten({ isoWeek: null, dateRange: null, prices: w.prices, days: w.days }).slice(2), `published ${w.published}`] : ['week missing'];
        report(`${textCase.name}: "${textCase.command}"`, diff(toLines(expected), toLines(actual)));
      } catch (error) {
        report(`${textCase.name}: "${textCase.command}"`, [`    ! ${describeError(error)}`]);
      }
    }
  } finally {
    // Leave the ci week as it was found (the next E2E run reseeds it anyway).
    if (original) {
      const values = { days: original.days, prices: original.prices, published: original.published, updatedAt: original.updatedAt };
      await getDb().insert(lunchWeeks).values({ ...week, ...values }).onConflictDoUpdate({ target: [lunchWeeks.isoYear, lunchWeeks.isoWeek], set: values });
    } else {
      await getDb().delete(lunchWeeks).where(where);
    }
  }
}

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    throw new Error('No gateway auth: set AI_GATEWAY_API_KEY (or run `vercel env pull` for VERCEL_OIDC_TOKEN) in the environment or .env.local');
  }
  await imageCases();
  await textCases();
  console.log(failed ? `\n${failed} case(s) failed` : '\nAll cases passed');
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(describeError(error));
  process.exit(1);
});
