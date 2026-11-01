import { Message, type Attachment } from 'chat';
import { describe, expect, it } from 'vitest';
import {
  FILE_TOO_LARGE,
  historyToModelMessages,
  MAX_FILE_BYTES,
  turnToModelMessage,
  UNREADABLE_FILE,
} from '@/lib/bot/turn';

const NOW = new Date('2026-11-01T12:00:00Z');
const hoursAgo = (hours: number) => new Date(NOW.getTime() - hours * 3_600_000);

function message(
  id: string,
  text: string,
  options: { isMe?: boolean; sent?: Date; attachments?: Attachment[] } = {},
): Message {
  return new Message({
    id,
    threadId: 'telegram:1001',
    text,
    formatted: { type: 'root', children: [] },
    raw: null,
    author: { userId: options.isMe ? 'bot' : '1001', userName: 'x', fullName: 'x', isBot: !!options.isMe, isMe: !!options.isMe },
    metadata: { dateSent: options.sent ?? hoursAgo(1), edited: false },
    attachments: options.attachments ?? [],
  });
}

const photo = (data = new Uint8Array([1, 2, 3])): Attachment => ({
  type: 'image',
  mimeType: 'image/jpeg',
  fetchData: async () => Buffer.from(data),
});

describe('historyToModelMessages', () => {
  it('maps the bot to assistant and everyone else to user, oldest first', () => {
    const history = [message('1', 'Mitä listalla on?', { sent: hoursAgo(3) }), message('2', 'Maanantaina keittoa', { isMe: true, sent: hoursAgo(2) }), message('3', 'Kiitos')];
    expect(historyToModelMessages(history, [message('3', 'Kiitos')], NOW)).toEqual([
      { role: 'user', content: 'Mitä listalla on?' },
      { role: 'assistant', content: 'Maanantaina keittoa' },
    ]);
  });

  it('leaves out the turn, also when it is not at the end of the history', () => {
    const history = [message('1', 'ennen'), message('2', 'nyt'), message('3', 'myöhemmin')];
    expect(historyToModelMessages(history, [message('2', 'nyt')], NOW)).toEqual([{ role: 'user', content: 'ennen' }]);
  });

  it('keeps the previous reply stored after a message sent while that turn ran', () => {
    const history = [message('1', 'Lisää perjantaille kalakeitto'), message('2', 'ja hinnat 13,50'), message('3', 'Lisätty', { isMe: true })];
    expect(historyToModelMessages(history, [message('2', 'ja hinnat 13,50')], NOW)).toEqual([
      { role: 'user', content: 'Lisää perjantaille kalakeitto' },
      { role: 'assistant', content: 'Lisätty' },
    ]);
  });

  it('replaces files with a note, and keeps a caption', () => {
    const history = [
      message('1', '', { attachments: [photo()] }),
      message('2', 'tässä lista', { attachments: [{ type: 'file', mimeType: 'application/pdf' }] }),
    ];
    expect(historyToModelMessages(history, [], NOW)).toEqual([
      { role: 'user', content: '[kuva]' },
      { role: 'user', content: 'tässä lista\n[tiedosto]' },
    ]);
  });

  it('drops messages older than 72 hours', () => {
    const history = [message('old', 'vanha', { sent: hoursAgo(73) }), message('new', 'uusi', { sent: hoursAgo(71) })];
    expect(historyToModelMessages(history, [], NOW)).toEqual([{ role: 'user', content: 'uusi' }]);
  });

  it('opens with a user message: an assistant reply whose question aged out is dropped', () => {
    const history = [message('1', 'vastaus', { isMe: true, sent: hoursAgo(2) }), message('2', 'uusi kysymys')];
    expect(historyToModelMessages(history, [], NOW)).toEqual([{ role: 'user', content: 'uusi kysymys' }]);
    expect(historyToModelMessages([message('1', 'vastaus', { isMe: true })], [], NOW)).toEqual([]);
  });

  it('skips messages with neither text nor files', () => {
    expect(historyToModelMessages([message('1', '  ')], [], NOW)).toEqual([]);
  });
});

describe('turnToModelMessage', () => {
  it('joins the texts and files of the whole turn into one user message', async () => {
    const result = await turnToModelMessage([message('1', 'Tässä viikon lista'), message('2', '', { attachments: [photo(new Uint8Array([9]))] })]);
    expect(result).toEqual({
      role: 'user',
      content: [
        { type: 'text', text: 'Tässä viikon lista' },
        { type: 'file', mediaType: 'image/jpeg', data: Buffer.from([9]) },
      ],
    });
  });

  it('accepts PDF and PNG documents', async () => {
    const attachments: Attachment[] = ['application/pdf', 'image/png'].map((mimeType) => ({
      type: 'file',
      mimeType,
      fetchData: async () => Buffer.from([1]),
    }));
    const result = await turnToModelMessage([message('1', '', { attachments })]);
    expect(result).toMatchObject({ content: [{ type: 'file', mediaType: 'application/pdf' }, { type: 'file', mediaType: 'image/png' }] });
  });

  it('tells the agent about a file it cannot read, without fetching it', async () => {
    let fetched = false;
    const sticker: Attachment = {
      type: 'image',
      mimeType: 'image/webp',
      fetchData: async () => {
        fetched = true;
        return Buffer.from([1]);
      },
    };
    const result = await turnToModelMessage([message('1', 'hei', { attachments: [sticker, { type: 'file' }] })]);
    expect(result).toEqual({
      role: 'user',
      content: [
        { type: 'text', text: 'hei' },
        { type: 'text', text: UNREADABLE_FILE },
        { type: 'text', text: UNREADABLE_FILE },
      ],
    });
    expect(fetched).toBe(false);
  });

  it('replaces a file over 20 MB with a note and keeps the rest of the turn', async () => {
    const announced = await turnToModelMessage([
      message('1', 'Vaihda tiistain keitto'),
      message('2', '', { attachments: [{ ...photo(), size: MAX_FILE_BYTES + 1 }] }),
    ]);
    expect(announced.content).toEqual([
      { type: 'text', text: 'Vaihda tiistain keitto' },
      { type: 'text', text: FILE_TOO_LARGE },
    ]);

    const big: Attachment = { type: 'file', mimeType: 'application/pdf', fetchData: async () => new ArrayBuffer(MAX_FILE_BYTES + 1) };
    expect((await turnToModelMessage([message('1', '', { attachments: [big] })])).content).toEqual([{ type: 'text', text: FILE_TOO_LARGE }]);
  });

  it('never sends an empty message', async () => {
    expect(await turnToModelMessage([message('1', '')])).toMatchObject({ content: [{ type: 'text' }] });
  });
});
