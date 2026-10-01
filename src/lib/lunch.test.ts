import { describe, expect, it, vi, beforeEach } from 'vitest';

const { rowsMock } = vi.hoisted(() => ({ rowsMock: vi.fn() }));
vi.mock('@/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/db')>();
  // Every query-builder call returns the chain; awaiting it resolves to the mocked rows.
  const chain: Record<string, unknown> = {
    then: (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) => rowsMock().then(resolve, reject),
  };
  for (const method of ['select', 'from', 'leftJoin', 'where', 'orderBy']) chain[method] = () => chain;
  return { ...actual, getDb: () => chain };
});

const { resolveLunchDisplay, formatUpdatedAt, getLunchRecord } = await import('@/lib/lunch');
import type { LunchRecord } from '@/lib/lunch';

const updatedAt = '2026-09-29T10:00:00.000Z';

describe('resolveLunchDisplay', () => {
  it('returns fallback when there is no published week', () => {
    expect(resolveLunchDisplay(null)).toEqual({ status: 'fallback' });
  });

  it('shows dishes only, note only, and both', () => {
    const record: LunchRecord = {
      updatedAt,
      days: {
        monday: { dishes: ['Lohikeitto', 'Kievin kana'], note: null },
        tuesday: { dishes: [], note: 'Vain huomautus' },
        wednesday: { dishes: ['Kasvispata'], note: 'Sisältää pähkinää' },
      },
    };
    const result = resolveLunchDisplay(record);
    if (result.status !== 'available') throw new Error('expected available');
    expect(result.updatedAt).toBe(updatedAt);
    expect(result.days.slice(0, 3)).toEqual([
      { day: 'monday', status: 'content', dishes: ['Lohikeitto', 'Kievin kana'], note: null },
      { day: 'tuesday', status: 'content', dishes: [], note: 'Vain huomautus' },
      { day: 'wednesday', status: 'content', dishes: ['Kasvispata'], note: 'Sisältää pähkinää' },
    ]);
  });

  it('shows a placeholder for a day with no dishes and no note, or missing entirely', () => {
    const record: LunchRecord = {
      updatedAt,
      days: { monday: { dishes: [], note: '   ' } },
    };
    const result = resolveLunchDisplay(record);
    if (result.status !== 'available') throw new Error('expected available');
    expect(result.days).toHaveLength(7);
    expect(result.days.every((d) => d.status === 'placeholder')).toBe(true);
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
    await expect(getLunchRecord()).resolves.toBeNull();
    expect(logSpy).toHaveBeenCalledWith(expect.any(String), error);
    logSpy.mockRestore();
  });

  it('returns null when the current week is missing or unpublished', async () => {
    rowsMock.mockResolvedValueOnce([]);
    await expect(getLunchRecord()).resolves.toBeNull();
  });

  it('groups joined rows into days with dishes in position order', async () => {
    const weekUpdatedAt = new Date(updatedAt);
    rowsMock.mockResolvedValueOnce([
      { updatedAt: weekUpdatedAt, day: 1, note: null, dish: 'Lohikeitto' },
      { updatedAt: weekUpdatedAt, day: 1, note: null, dish: 'Kievin kana' },
      { updatedAt: weekUpdatedAt, day: 2, note: 'Vain huomautus', dish: null },
      { updatedAt: weekUpdatedAt, day: null, note: null, dish: null },
    ]);
    await expect(getLunchRecord()).resolves.toEqual({
      updatedAt,
      days: {
        monday: { dishes: ['Lohikeitto', 'Kievin kana'], note: null },
        tuesday: { dishes: [], note: 'Vain huomautus' },
      },
    });
  });

  it('returns an empty week when it is published but has no days yet', async () => {
    rowsMock.mockResolvedValueOnce([{ updatedAt: new Date(updatedAt), day: null, note: null, dish: null }]);
    await expect(getLunchRecord()).resolves.toEqual({ updatedAt, days: {} });
  });
});
