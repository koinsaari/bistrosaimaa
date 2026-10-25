import { describe, expect, it } from 'vitest';
import { parseCallbackData, undoCallbackData } from '@/lib/bot/callbackData';

const ID = '3f2b8c1e-9d4a-4e6b-8a1f-0c5d7e9a2b34';

describe('callback data', () => {
  it('round-trips an undo action', () => {
    expect(undoCallbackData(ID)).toBe(`undo:${ID}`);
    expect(parseCallbackData(`undo:${ID}`)).toEqual({ action: 'undo', changeId: ID });
  });

  it('rejects unknown actions, bad ids and junk', () => {
    for (const data of [undefined, '', 'undo', 'undo:', 'undo:123', `undo:${ID}x`, `redo:${ID}`, `UNDO:${ID}`, ` undo:${ID}`]) {
      expect(parseCallbackData(data), String(data)).toBeNull();
    }
  });

  it('keeps callback data within Telegram’s 64-byte limit', () => {
    expect(undoCallbackData(ID).length).toBeLessThanOrEqual(64);
  });
});
