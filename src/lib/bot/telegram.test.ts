import { describe, expect, it } from 'vitest';
import { splitMessage } from '@/lib/bot/telegram';

describe('splitMessage', () => {
  it('leaves a short message alone', () => {
    expect(splitMessage('Valmis')).toEqual(['Valmis']);
  });

  it('never returns an empty list', () => {
    expect(splitMessage('')).toEqual(['']);
  });

  it('keeps a message of exactly 4096 characters in one piece', () => {
    expect(splitMessage('a'.repeat(4096))).toHaveLength(1);
  });

  it('splits at line breaks when possible and loses no text', () => {
    const line = 'x'.repeat(99);
    const text = Array.from({ length: 100 }, () => line).join('\n');
    const parts = splitMessage(text);
    expect(parts.length).toBeGreaterThan(1);
    for (const part of parts) expect(part.length).toBeLessThanOrEqual(4096);
    expect(parts.join('\n')).toBe(text);
  });

  it('hard-splits a long line without breaks', () => {
    const parts = splitMessage('a'.repeat(10_000));
    expect(parts.map((p) => p.length)).toEqual([4096, 4096, 1808]);
  });

  it('does not cut a surrogate pair in half', () => {
    const text = '😀'.repeat(3000);
    const parts = splitMessage(text);
    for (const part of parts) {
      expect(part.length).toBeLessThanOrEqual(4096);
      expect(part).not.toMatch(/[\ud800-\udbff]$/);
      expect(part).not.toMatch(/^[\udc00-\udfff]/);
    }
    expect(parts.join('')).toBe(text);
  });
});
