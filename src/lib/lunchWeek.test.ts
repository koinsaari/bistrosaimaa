import { describe, expect, it } from 'vitest';
import { parseWeek } from '@/lib/lunchWeek';

const A = '3f2b8f0e-6a52-4a44-9a3e-1c1f3c2d9a10';
const B = '7c1d5b22-2f0e-4b1a-8d3c-5e6f7a8b9c01';
const week = { isoYear: '2026', isoWeek: '41' };

describe('parseWeek', () => {
  it('parses numbers, trims notes and keeps dish order', () => {
    expect(
      parseWeek({ ...week, days: [{ day: '1', dishIds: [B, A], note: '  pähkinää ' }] }),
    ).toEqual({
      ok: true,
      data: { isoYear: 2026, isoWeek: 41, days: [{ day: 1, dishIds: [B, A], note: 'pähkinää' }] },
    });
  });

  it('drops days with no dishes and no note, and sorts the rest by day', () => {
    const result = parseWeek({
      ...week,
      days: [
        { day: '5', dishIds: [A], note: '' },
        { day: '2', dishIds: [], note: '' },
        { day: '3', dishIds: [], note: 'suljettu' },
      ],
    });
    expect(result).toMatchObject({
      ok: true,
      data: {
        days: [
          { day: 3, dishIds: [], note: 'suljettu' },
          { day: 5, dishIds: [A], note: null },
        ],
      },
    });
  });

  it('accepts a week with no days at all', () => {
    expect(parseWeek({ ...week, days: [] })).toMatchObject({ ok: true, data: { days: [] } });
  });

  it('accepts week 53 only in a 53-week year', () => {
    expect(parseWeek({ isoYear: '2026', isoWeek: '53', days: [] })).toMatchObject({ ok: true });
    expect(parseWeek({ isoYear: '2025', isoWeek: '53', days: [] })).toEqual({ ok: false, error: 'Virheellinen viikko' });
  });

  it.each([
    ['year too small', { isoYear: '1999', isoWeek: '1' }],
    ['year not a number', { isoYear: 'abc', isoWeek: '1' }],
    ['week zero', { isoYear: '2026', isoWeek: '0' }],
    ['week 54', { isoYear: '2026', isoWeek: '54' }],
    ['week fractional', { isoYear: '2026', isoWeek: '1.5' }],
    ['week missing', { isoYear: '2026', isoWeek: undefined }],
  ])('rejects %s', (_label, input) => {
    expect(parseWeek({ ...input, days: [] })).toEqual({ ok: false, error: 'Virheellinen viikko' });
  });

  it.each([['0'], ['8'], ['x'], [undefined]])('rejects day %j', (day) => {
    expect(parseWeek({ ...week, days: [{ day, dishIds: [A], note: '' }] })).toEqual({
      ok: false,
      error: 'Virheellinen päivä',
    });
  });

  it('rejects the same day twice', () => {
    expect(
      parseWeek({
        ...week,
        days: [
          { day: '1', dishIds: [A], note: '' },
          { day: '1', dishIds: [B], note: '' },
        ],
      }),
    ).toEqual({ ok: false, error: 'Sama päivä on listalla kahdesti' });
  });

  it('rejects the same dish twice in one day, but allows it on different days', () => {
    expect(parseWeek({ ...week, days: [{ day: '1', dishIds: [A, A], note: '' }] })).toEqual({
      ok: false,
      error: 'Sama ruoka on päivällä kahdesti',
    });
    expect(
      parseWeek({
        ...week,
        days: [
          { day: '1', dishIds: [A], note: '' },
          { day: '2', dishIds: [A], note: '' },
        ],
      }),
    ).toMatchObject({ ok: true });
  });

  it('rejects a malformed dish id', () => {
    expect(parseWeek({ ...week, days: [{ day: '1', dishIds: ['nope'], note: '' }] })).toEqual({
      ok: false,
      error: 'Ruokaa ei löytynyt',
    });
  });

  it('rejects too many dishes in a day', () => {
    const ids = Array.from({ length: 16 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`);
    expect(parseWeek({ ...week, days: [{ day: '1', dishIds: ids, note: '' }] })).toEqual({
      ok: false,
      error: 'Päivällä on liian monta ruokaa',
    });
  });

  it('rejects a note that is too long', () => {
    expect(parseWeek({ ...week, days: [{ day: '1', dishIds: [], note: 'a'.repeat(301) }] })).toEqual({
      ok: false,
      error: 'Huomautus on liian pitkä',
    });
  });

  it('rejects days that are not a list', () => {
    expect(parseWeek({ ...week, days: 'x' })).toEqual({ ok: false, error: 'Virheellinen päivä' });
  });
});
