import { describe, expect, it } from 'vitest';
import { visibilityNote } from '@/lib/bot/tools';

// Sunday 2026-11-01 at 12:00 Helsinki: the site still shows week 44.
const NOW = new Date('2026-11-01T10:00:00Z');

describe('visibilityNote', () => {
  it('says a change to the shown week is visible at once', () => {
    expect(visibilityNote({ isoYear: 2026, isoWeek: 44 }, true, NOW)).toBe('näkyy sivulla heti');
  });

  it('says a later week appears when the site switches to it', () => {
    expect(visibilityNote({ isoYear: 2026, isoWeek: 45 }, true, NOW)).toBe('näkyy sivulla sunnuntaina klo 15.30 alkaen');
    expect(visibilityNote({ isoYear: 2027, isoWeek: 1 }, true, NOW)).toContain('alkaen');
  });

  it('says a hidden week is not on the site', () => {
    expect(visibilityNote({ isoYear: 2026, isoWeek: 44 }, false, NOW)).toBe('ei näy sivulla (piilotettu)');
  });
});
