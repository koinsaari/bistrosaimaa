import type { DayKey } from '../../src/lib/lunch';

export type FixtureDay = { dishes: string[]; note?: string };
export type FixtureWeek = Partial<Record<DayKey, FixtureDay>>;

export const FIXTURE_CATEGORY = 'E2E-kategoria';

export const FIXTURE_DISHES = [
  'E2E Lohikeitto',
  'E2E Jauhelihakastike',
  'E2E Kasvispata',
  'E2E Uunimakkara',
  'E2E Broilerpasta',
] as const;

export const RETIRED_DISH = 'E2E Poistunut ruoka';

export const CURRENT_WEEK: FixtureWeek = {
  monday: { dishes: ['E2E Lohikeitto', 'E2E Jauhelihakastike'] },
  tuesday: { dishes: [], note: 'E2E vain huomautus' },
  wednesday: { dishes: ['E2E Kasvispata'], note: 'E2E sisältää pähkinää' },
};

export const NEXT_WEEK: FixtureWeek = {
  monday: { dishes: ['E2E Uunimakkara'] },
};
