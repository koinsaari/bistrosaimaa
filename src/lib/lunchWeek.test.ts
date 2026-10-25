import { describe, expect, it } from 'vitest';
import { isPastWeek, parseWeekDocument, resolvePrices, weekDocumentSchema } from '@/lib/lunchWeek';

const dish = (name: string, allergens: string[] = []) => ({ name, allergens });
const parse = (days: unknown, prices: unknown = null) => parseWeekDocument({ days, prices });

function parsed(days: unknown, prices: unknown = null) {
  const result = parse(days, prices);
  if (!result.ok) throw new Error(`expected ok, got: ${result.error}`);
  return result.data;
}

describe('weekDocumentSchema', () => {
  it('accepts an empty document', () => {
    expect(weekDocumentSchema.safeParse({ days: {}, prices: null }).success).toBe(true);
  });

  it('trims names and notes', () => {
    const { days } = parsed({ monday: { dishes: [dish('  Lohikeitto  ')], note: '  Huom  ' } });
    expect(days.monday).toEqual({ dishes: [dish('Lohikeitto')], note: 'Huom' });
  });

  it('dedupes allergens and orders them as ALLERGENS', () => {
    const { days } = parsed({ monday: { dishes: [dish('Keitto', ['Veg', 'L', 'G', 'L'])], note: null } });
    expect(days.monday!.dishes[0].allergens).toEqual(['G', 'L', 'Veg']);
  });

  it('rejects an unknown allergen', () => {
    expect(parse({ monday: { dishes: [dish('Keitto', ['X'])], note: null } }).ok).toBe(false);
  });

  it('turns an empty or missing note into null', () => {
    const { days } = parsed({
      monday: { dishes: [dish('A')], note: '   ' },
      tuesday: { dishes: [dish('B')] },
    });
    expect(days.monday!.note).toBeNull();
    expect(days.tuesday!.note).toBeNull();
  });

  it('drops days with no dishes and no note, keeps note-only days', () => {
    const { days } = parsed({
      monday: { dishes: [], note: null },
      tuesday: { dishes: [], note: '  ' },
      wednesday: { dishes: [], note: 'Suljettu' },
      thursday: { dishes: [dish('A')], note: null },
    });
    expect(Object.keys(days)).toEqual(['wednesday', 'thursday']);
  });

  it('rejects an unknown day key', () => {
    expect(parse({ funday: { dishes: [dish('A')], note: null } }).ok).toBe(false);
  });

  it('limits dishes per day to 15', () => {
    const many = (n: number) => Array.from({ length: n }, (_, i) => dish(`Ruoka ${i}`));
    expect(parse({ monday: { dishes: many(15), note: null } }).ok).toBe(true);
    expect(parse({ monday: { dishes: many(16), note: null } }).ok).toBe(false);
  });

  it('limits dish names to 1-120 characters', () => {
    expect(parse({ monday: { dishes: [dish('   ')], note: null } }).ok).toBe(false);
    expect(parse({ monday: { dishes: [dish('a'.repeat(120))], note: null } }).ok).toBe(true);
    expect(parse({ monday: { dishes: [dish('a'.repeat(121))], note: null } }).ok).toBe(false);
  });

  it('limits notes to 300 characters', () => {
    expect(parse({ monday: { dishes: [], note: 'a'.repeat(300) } }).ok).toBe(true);
    expect(parse({ monday: { dishes: [], note: 'a'.repeat(301) } }).ok).toBe(false);
  });

  it('accepts integer prices from 0 to 10000 and null', () => {
    expect(parsed({}, { weekdayCents: 1320, weekendCents: 1420 }).prices).toEqual({ weekdayCents: 1320, weekendCents: 1420 });
    expect(parsed({}, { weekdayCents: 0, weekendCents: 10000 }).prices).toEqual({ weekdayCents: 0, weekendCents: 10000 });
    expect(parsed({}, null).prices).toBeNull();
  });

  it('rejects fractional, negative and too large prices', () => {
    expect(parse({}, { weekdayCents: 13.2, weekendCents: 1420 }).ok).toBe(false);
    expect(parse({}, { weekdayCents: -1, weekendCents: 1420 }).ok).toBe(false);
    expect(parse({}, { weekdayCents: 1320, weekendCents: 10001 }).ok).toBe(false);
  });

  it('returns a Finnish message for the first issue', () => {
    const result = parse({ monday: { dishes: [dish('')], note: null } });
    expect(result).toEqual({ ok: false, error: expect.any(String) });
  });
});

describe('resolvePrices', () => {
  const given = { weekdayCents: 1350, weekendCents: 1450 };
  const own = { weekdayCents: 1300, weekendCents: 1400 };
  const previous = { weekdayCents: 1320, weekendCents: 1420 };

  it('keeps the given prices', () => {
    expect(resolvePrices(given, own, previous)).toEqual(given);
  });

  it("keeps the week's own prices over the previous week's", () => {
    expect(resolvePrices(null, own, previous)).toEqual(own);
  });

  it('copies the previous week prices when the week has none', () => {
    expect(resolvePrices(null, null, previous)).toEqual(previous);
  });

  it('is null when none exist', () => {
    expect(resolvePrices(null, null, null)).toBeNull();
  });
});

describe('isPastWeek', () => {
  const week = { isoYear: 2026, isoWeek: 43 }; // Mon 19.10. - Sun 25.10.2026

  it('is false during the week', () => {
    expect(isPastWeek(week, new Date('2026-10-21T10:00:00Z'))).toBe(false);
  });

  it('is false late on Sunday in Helsinki', () => {
    // 2026-10-25 21:30 UTC = 23:30 Helsinki (EET, DST ended that night): still Sunday
    expect(isPastWeek(week, new Date('2026-10-25T21:30:00Z'))).toBe(false);
  });

  it('is true from Monday 00:00 Helsinki', () => {
    // 2026-10-25 22:00 UTC = Mon 00:00 Helsinki (UTC+2)
    expect(isPastWeek(week, new Date('2026-10-25T22:00:00Z'))).toBe(true);
    expect(isPastWeek(week, new Date('2026-10-25T21:59:59Z'))).toBe(false);
  });

  it('is false for future weeks', () => {
    expect(isPastWeek({ isoYear: 2026, isoWeek: 44 }, new Date('2026-10-21T10:00:00Z'))).toBe(false);
  });

  it('handles the year boundary', () => {
    const last = { isoYear: 2026, isoWeek: 53 }; // ends Sun 3.1.2027
    expect(isPastWeek(last, new Date('2027-01-03T12:00:00Z'))).toBe(false);
    expect(isPastWeek(last, new Date('2027-01-04T12:00:00Z'))).toBe(true);
  });
});
