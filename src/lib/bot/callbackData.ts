const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export type CallbackAction = { action: 'undo'; changeId: string };

/** Telegram limits callback data to 64 bytes: `undo:` plus a uuid is 41. */
export function undoCallbackData(changeId: string): string {
  return `undo:${changeId}`;
}

export function parseCallbackData(data: string | undefined): CallbackAction | null {
  const match = /^undo:(.+)$/.exec(data ?? '');
  return match && UUID.test(match[1]) ? { action: 'undo', changeId: match[1] } : null;
}
