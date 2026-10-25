import { describe, expect, it } from 'vitest';
import { MEMORY_MAX_AGE_MS, MEMORY_MAX_MESSAGES, selectRecentMessages } from '@/lib/bot/memory';

const NOW = new Date('2026-10-24T12:00:00Z');
const HOUR = 3_600_000;
const row = (n: number, hoursAgo: number) => ({
  role: 'user' as const,
  text: `m${n}`,
  createdAt: new Date(NOW.getTime() - hoursAgo * HOUR),
});

describe('selectRecentMessages', () => {
  it('keeps at most 20 messages from the last 72 hours', () => {
    expect(MEMORY_MAX_MESSAGES).toBe(20);
    expect(MEMORY_MAX_AGE_MS).toBe(72 * HOUR);
  });

  it('keeps the last 20 in chronological order', () => {
    const rows = Array.from({ length: 25 }, (_, i) => row(i, 25 - i));
    const kept = selectRecentMessages(rows, NOW);
    expect(kept).toHaveLength(20);
    expect(kept[0].text).toBe('m5');
    expect(kept[19].text).toBe('m24');
  });

  it('drops messages older than 72 hours but keeps exactly 72 hours old', () => {
    const kept = selectRecentMessages([row(1, 73), row(2, 72), row(3, 71.9)], NOW);
    expect(kept.map((m) => m.text)).toEqual(['m2', 'm3']);
  });

  it('sorts unordered input and returns role and text only', () => {
    const kept = selectRecentMessages([row(2, 1), row(1, 2)], NOW);
    expect(kept).toEqual([
      { role: 'user', text: 'm1' },
      { role: 'user', text: 'm2' },
    ]);
  });
});
