import type { Allergen } from '../../src/lib/allergens';
import type { DayKey, LunchPrices } from '../../src/lib/lunch';

export type FixtureDish = { name: string; allergens: Allergen[] };
export type FixtureDay = { dishes: FixtureDish[]; note?: string };
export type FixtureWeek = Partial<Record<DayKey, FixtureDay>>;

// Long before any test run, so a saved week visibly moves the public "Päivitetty" date.
export const CURRENT_WEEK_UPDATED_AT = new Date('2020-01-15T10:00:00Z');

export const CURRENT_WEEK_PRICES: LunchPrices = { weekdayCents: 1320, weekendCents: 1420 };

export const CURRENT_WEEK: FixtureWeek = {
  monday: {
    dishes: [
      { name: 'E2E Lohikeitto', allergens: ['L', 'G'] },
      { name: 'E2E Jauhelihakastike', allergens: ['L', 'G'] },
    ],
  },
  tuesday: { dishes: [], note: 'E2E vain huomautus' },
  wednesday: { dishes: [{ name: 'E2E Kasvispata', allergens: ['L', 'G'] }], note: 'E2E sisältää pähkinää' },
  friday: { dishes: [{ name: 'E2E Broilerpasta', allergens: [] }] },
};

export const NEXT_WEEK: FixtureWeek = {
  monday: { dishes: [{ name: 'E2E Uunimakkara', allergens: [] }] },
};
