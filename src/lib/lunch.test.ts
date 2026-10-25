import { describe, expect, it, vi, beforeEach } from 'vitest';

const { rowsMock } = vi.hoisted(() => ({ rowsMock: vi.fn() }));
vi.mock('@/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/db')>();
  // Every query-builder call returns the chain; awaiting it resolves to the mocked rows.
  const chain: Record<string, unknown> = {
    then: (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) => rowsMock().then(resolve, reject),
  };
  for (const method of ['select', 'from', 'where', 'limit']) chain[method] = () => chain;
  return { ...actual, getDb: () => chain };
});

const { resolveLunchDisplay, formatLunchInfo, formatUpdatedAt, getLunchRecord } = await import('@/lib/lunch');
import type { LunchRecord } from '@/lib/lunch';
import type { Allergen } from '@/lib/allergens';

const updatedAt = '2026-09-29T10:00:00.000Z';
const PRICES = { weekdayCents: 1320, weekendCents: 1420 };
const WEEK = { isoYear: 2026, isoWeek: 40 };
const dish = (name: string, allergens: Allergen[] = []) => ({ name, allergens });

describe('resolveLunchDisplay', () => {
  it('returns fallback when there is no published week', () => {
    expect(resolveLunchDisplay(null)).toEqual({ status: 'fallback' });
  });

  it('shows dishes only, note only, and both', () => {
    const record: LunchRecord = {
      updatedAt,
      prices: PRICES,
      days: {
        monday: { dishes: [dish('Lohikeitto'), dish('Kievin kana')], note: null },
        tuesday: { dishes: [], note: 'Vain huomautus' },
        wednesday: { dishes: [dish('Kasvispata')], note: 'Sisältää pähkinää' },
      },
    };
    const result = resolveLunchDisplay(record);
    if (result.status !== 'available') throw new Error('expected available');
    expect(result.updatedAt).toBe(updatedAt);
    expect(result.prices).toEqual(PRICES);
    expect(result.days.slice(0, 3)).toEqual([
      { day: 'monday', status: 'content', dishes: [dish('Lohikeitto'), dish('Kievin kana')], note: null },
      { day: 'tuesday', status: 'content', dishes: [], note: 'Vain huomautus' },
      { day: 'wednesday', status: 'content', dishes: [dish('Kasvispata')], note: 'Sisältää pähkinää' },
    ]);
  });

  it('shows a placeholder for a day with no dishes and no note, or missing entirely', () => {
    const record: LunchRecord = {
      updatedAt,
      prices: null,
      days: { monday: { dishes: [], note: '   ' }, tuesday: { dishes: [dish('Lohikeitto')], note: null } },
    };
    const result = resolveLunchDisplay(record);
    if (result.status !== 'available') throw new Error('expected available');
    expect(result.days).toHaveLength(7);
    expect(result.days.filter((d) => d.status === 'placeholder')).toHaveLength(6);
  });

  it('carries null prices through when the week has none', () => {
    const result = resolveLunchDisplay({ updatedAt, prices: null, days: { monday: { dishes: [dish('A')], note: null } } });
    if (result.status !== 'available') throw new Error('expected available');
    expect(result.prices).toBeNull();
  });

  it('falls back when no day has any content', () => {
    expect(resolveLunchDisplay({ updatedAt, prices: PRICES, days: {} })).toEqual({ status: 'fallback' });
    expect(resolveLunchDisplay({ updatedAt, prices: PRICES, days: { monday: { dishes: [], note: '  ' } } })).toEqual({
      status: 'fallback',
    });
  });
});

describe('formatUpdatedAt', () => {
  it('formats an ISO date as Finnish d.M.', () => {
    expect(formatUpdatedAt('2026-09-29T10:00:00.000Z')).toBe('29.9.');
  });

  it('pads neither day nor month', () => {
    expect(formatUpdatedAt('2026-01-05T10:00:00.000Z')).toBe('5.1.');
  });

  it('renders in Helsinki local time, not UTC', () => {
    // 2026-09-29T21:30:00Z is 2026-09-30T00:30 in Helsinki (UTC+3, DST)
    expect(formatUpdatedAt('2026-09-29T21:30:00.000Z')).toBe('30.9.');
  });
});

describe('getLunchRecord', () => {
  beforeEach(() => {
    rowsMock.mockReset();
  });

  it('returns null and logs when the query throws', async () => {
    const error = new Error('network error');
    const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    rowsMock.mockRejectedValueOnce(error);
    await expect(getLunchRecord(WEEK)).resolves.toBeNull();
    expect(logSpy).toHaveBeenCalledWith(expect.any(String), error);
    logSpy.mockRestore();
  });

  it('returns null when the current week is missing or unpublished', async () => {
    rowsMock.mockResolvedValueOnce([]);
    await expect(getLunchRecord(WEEK)).resolves.toBeNull();
  });

  it('maps the stored document, ordering allergens and keeping prices', () => {
    const weekUpdatedAt = new Date(updatedAt);
    rowsMock.mockResolvedValueOnce([
      {
        updatedAt: weekUpdatedAt,
        prices: PRICES,
        days: {
          monday: { dishes: [{ name: 'Lohikeitto', allergens: ['L', 'G'] }, dish('Kievin kana')], note: null },
          tuesday: { dishes: [], note: 'Vain huomautus' },
        },
      },
    ]);
    return expect(getLunchRecord(WEEK)).resolves.toEqual({
      updatedAt,
      prices: PRICES,
      days: {
        monday: { dishes: [dish('Lohikeitto', ['G', 'L']), dish('Kievin kana')], note: null },
        tuesday: { dishes: [], note: 'Vain huomautus' },
      },
    });
  });

  it('returns an empty week with null prices when the document is empty', async () => {
    rowsMock.mockResolvedValueOnce([{ updatedAt: new Date(updatedAt), prices: null, days: {} }]);
    await expect(getLunchRecord(WEEK)).resolves.toEqual({ updatedAt, prices: null, days: {} });
  });
});

describe('formatLunchInfo', () => {
  // Intl separates the Finnish amount and € with a no-break space (U+00A0).
  it("uses each locale's clock and currency format", () => {
    expect(formatLunchInfo('fi', PRICES)).toEqual({
      opens: '11.00',
      closes: '15.00',
      prices: { weekdayPrice: '13,20\u00a0€', weekendPrice: '14,20\u00a0€' },
    });
    expect(formatLunchInfo('en', PRICES)).toEqual({
      opens: '11:00',
      closes: '15:00',
      prices: { weekdayPrice: '€13.20', weekendPrice: '€14.20' },
    });
  });

  it('has no prices when the week has none', () => {
    expect(formatLunchInfo('fi', null)).toEqual({ opens: '11.00', closes: '15.00', prices: null });
  });
});
