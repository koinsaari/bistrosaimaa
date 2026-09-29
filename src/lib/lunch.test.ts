import { describe, expect, it, vi, beforeEach } from 'vitest';

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }));
vi.mock('@vercel/edge-config', () => ({ get: getMock }));

const { resolveLunchDisplay, formatUpdatedAt, getLunchRecord } = await import('@/lib/lunch');
import type { LunchRecord as LunchRecordType } from '@/lib/lunch';

const fullRecord: LunchRecordType = {
  monday: 'Lohikeitto',
  tuesday: 'Jauhelihakastike',
  wednesday: 'Kasvispata',
  thursday: 'Hernekeitto',
  friday: 'Uunikala',
  saturday: 'Pizza',
  sunday: 'Pata',
  updatedAt: '2026-09-29T10:00:00.000Z',
};

describe('resolveLunchDisplay', () => {
  it('returns fallback when no record has ever been saved', () => {
    expect(resolveLunchDisplay(null)).toEqual({ status: 'fallback' });
  });

  it('returns content for every day when the record is fully filled', () => {
    const result = resolveLunchDisplay(fullRecord);
    expect(result).toEqual({
      status: 'available',
      updatedAt: fullRecord.updatedAt,
      days: [
        { day: 'monday', status: 'content', text: 'Lohikeitto' },
        { day: 'tuesday', status: 'content', text: 'Jauhelihakastike' },
        { day: 'wednesday', status: 'content', text: 'Kasvispata' },
        { day: 'thursday', status: 'content', text: 'Hernekeitto' },
        { day: 'friday', status: 'content', text: 'Uunikala' },
        { day: 'saturday', status: 'content', text: 'Pizza' },
        { day: 'sunday', status: 'content', text: 'Pata' },
      ],
    });
  });

  it('shows a placeholder for a day left blank, without falling back to Facebook', () => {
    const result = resolveLunchDisplay({ ...fullRecord, saturday: '', sunday: '   ' });
    expect(result.status).toBe('available');
    if (result.status !== 'available') throw new Error('unreachable');
    expect(result.days.find((d) => d.day === 'saturday')).toEqual({ day: 'saturday', status: 'placeholder' });
    expect(result.days.find((d) => d.day === 'sunday')).toEqual({ day: 'sunday', status: 'placeholder' });
    expect(result.days.find((d) => d.day === 'monday')).toEqual({ day: 'monday', status: 'content', text: 'Lohikeitto' });
  });

  it('treats a day missing from the record as a placeholder instead of crashing', () => {
    const withoutSunday: Partial<LunchRecordType> = { ...fullRecord };
    delete withoutSunday.sunday;
    const result = resolveLunchDisplay(withoutSunday as LunchRecordType);
    expect(result.status).toBe('available');
    if (result.status !== 'available') throw new Error('unreachable');
    expect(result.days.find((d) => d.day === 'sunday')).toEqual({ day: 'sunday', status: 'placeholder' });
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
    getMock.mockReset();
  });

  it('returns null when the Edge Config read throws', async () => {
    getMock.mockRejectedValueOnce(new Error('network error'));
    await expect(getLunchRecord()).resolves.toBeNull();
  });

  it('returns the record when the read succeeds', async () => {
    getMock.mockResolvedValueOnce(fullRecord);
    await expect(getLunchRecord()).resolves.toEqual(fullRecord);
  });
});
