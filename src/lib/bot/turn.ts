import type { ModelMessage, UserContent } from 'ai';
import type { Attachment, Message } from 'chat';

export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const FILE_MEDIA_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;
type FileMediaType = (typeof FILE_MEDIA_TYPES)[number];

export const FILE_TOO_LARGE = '[tiedosto on yli 20 Mt, en lukenut sitä]';
export const UNREADABLE_FILE = '[tiedosto jota en osaa lukea]';

export const HISTORY_MAX_MESSAGES = 20; // the cap Chat SDK applies to the stored list
export const HISTORY_MAX_AGE_MS = 72 * 3_600_000;

function fileMediaType(attachment: Attachment): FileMediaType | undefined {
  return FILE_MEDIA_TYPES.find((type) => type === attachment.mimeType);
}

/** Older messages never carry the file itself, only a note that there was one. */
function historyText(message: Message): string {
  const notes = message.attachments.map((attachment) => (attachment.type === 'image' ? '[kuva]' : '[tiedosto]'));
  return [message.text.trim(), ...notes].filter(Boolean).join('\n');
}

/**
 * Turns the stored thread history into plain-text model messages: the bot's own posts are `assistant`, everything else
 * `user`. The current turn's own messages are left out (the turn is added separately, with its files), none older than
 * `HISTORY_MAX_AGE_MS` (the list itself holds at most `HISTORY_MAX_MESSAGES`).
 */
export function historyToModelMessages(history: Message[], turn: Message[], now: Date): ModelMessage[] {
  const turnIds = new Set(turn.map((message) => message.id));
  // Messages are stored as they arrive, so the previous turn's reply can come after this turn's messages, and user
  // messages after this turn belong to the next one.
  const lastTurn = history.findLastIndex((message) => turnIds.has(message.id));
  const earlier = history.filter(
    (message, index) => !turnIds.has(message.id) && (lastTurn === -1 || index <= lastTurn || message.author.isMe),
  );
  const cutoff = now.getTime() - HISTORY_MAX_AGE_MS;

  const messages = earlier
    .filter((message) => message.metadata.dateSent.getTime() >= cutoff)
    .flatMap((message): ModelMessage[] => {
      const text = historyText(message);
      if (!text) return [];
      return [{ role: message.author.isMe ? 'assistant' : 'user', content: text }];
    });
  // A conversation must open with the user: drop an assistant message whose question aged out of the window.
  const firstUser = messages.findIndex((message) => message.role === 'user');
  return firstUser === -1 ? [] : messages.slice(firstUser);
}

/** One user message for the whole turn: the texts and the files of every message in it, oldest first. */
export async function turnToModelMessage(turn: Message[]): Promise<ModelMessage> {
  const content: Exclude<UserContent, string> = [];
  for (const message of turn) {
    if (message.text.trim()) content.push({ type: 'text', text: message.text.trim() });
    for (const attachment of message.attachments) {
      const mediaType = fileMediaType(attachment);
      if (!mediaType || !attachment.fetchData) {
        content.push({ type: 'text', text: UNREADABLE_FILE });
        continue;
      }
      const data = attachment.size !== undefined && attachment.size > MAX_FILE_BYTES ? null : await attachment.fetchData();
      content.push(data && data.byteLength <= MAX_FILE_BYTES ? { type: 'file', mediaType, data } : { type: 'text', text: FILE_TOO_LARGE });
    }
  }
  if (!content.length) content.push({ type: 'text', text: '[tyhjä viesti]' });
  return { role: 'user', content };
}
