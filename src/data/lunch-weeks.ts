/**
 * 6-week rotating lunch menu. Edit these in place when the kitchen rotates.
 *
 * The rotation is deterministic — see src/lib/lunch.ts.
 * Placeholder items only. Owner will replace with real menus.
 */

export type LunchItem = { fi: string; en: string };
export type LunchDay = { items: LunchItem[] };
export type LunchWeek = {
  monday: LunchDay;
  tuesday: LunchDay;
  wednesday: LunchDay;
  thursday: LunchDay;
  friday: LunchDay;
};

const placeholderDay: LunchDay = {
  items: [
    { fi: 'Lounasruoka (täytä myöhemmin)', en: 'Lunch dish (fill in later)' },
    { fi: 'Lisäke (täytä myöhemmin)', en: 'Side (fill in later)' },
  ],
};

const placeholderWeek: LunchWeek = {
  monday: placeholderDay,
  tuesday: placeholderDay,
  wednesday: placeholderDay,
  thursday: placeholderDay,
  friday: placeholderDay,
};

export const LUNCH_WEEKS: readonly [
  LunchWeek, LunchWeek, LunchWeek, LunchWeek, LunchWeek, LunchWeek,
] = [
  placeholderWeek, // week index 0
  placeholderWeek, // week index 1
  placeholderWeek, // week index 2
  placeholderWeek, // week index 3
  placeholderWeek, // week index 4
  placeholderWeek, // week index 5
];

/** Anchor for the rotation. Index 0 of LUNCH_WEEKS corresponds to ISO week 1 of this year. */
export const LUNCH_ANCHOR = { year: 2026, week: 1 } as const;
