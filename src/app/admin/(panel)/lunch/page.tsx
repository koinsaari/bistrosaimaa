import { requireAdmin } from '@/lib/auth';
import { listCategories } from '@/lib/categories';
import { listDishes } from '@/lib/dishes';
import { addWeeks, currentIsoWeek, formatWeekLabel, type IsoWeek } from '@/lib/isoWeek';
import { getWeek, parseWeek } from '@/lib/lunchWeek';
import WeekComposer from './WeekComposer';
import WeekSelector from './WeekSelector';

const WEEKS_BEFORE = 1;
const WEEKS_AFTER = 8;

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLunchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const now = currentIsoWeek(new Date(), 'Europe/Helsinki');
  const requested = parseWeek({ isoYear: pick(params.year), isoWeek: pick(params.week), days: [] });
  const selected: IsoWeek = requested.ok ? requested.data : now;

  const [week, dishes, categories] = await Promise.all([
    getWeek(selected.isoYear, selected.isoWeek),
    listDishes(),
    listCategories(),
  ]);

  const options = Array.from({ length: WEEKS_BEFORE + 1 + WEEKS_AFTER }, (_, i) => addWeeks(now, i - WEEKS_BEFORE));
  if (!options.some((o) => o.isoYear === selected.isoYear && o.isoWeek === selected.isoWeek)) {
    options.push(selected);
    options.sort((a, b) => a.isoYear - b.isoYear || a.isoWeek - b.isoWeek);
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold">Viikon lounas</h1>
      <WeekSelector
        current={`${selected.isoYear}-${selected.isoWeek}`}
        options={options.map((o) => ({ ...o, label: formatWeekLabel(o) }))}
      />
      <WeekComposer
        key={`${selected.isoYear}-${selected.isoWeek}`}
        isoYear={selected.isoYear}
        isoWeek={selected.isoWeek}
        initialDays={Object.fromEntries((week?.days ?? []).map((d) => [d.day, { dishIds: d.dishIds, note: d.note ?? '' }]))}
        stored={week !== null}
        published={week?.published ?? false}
        dishes={dishes.map(({ id, name, categoryId, isActive }) => ({ id, name, categoryId, isActive }))}
        categories={categories.map(({ id, name }) => ({ id, name }))}
      />
    </main>
  );
}
