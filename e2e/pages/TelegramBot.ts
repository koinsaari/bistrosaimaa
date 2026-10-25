import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { and, desc, eq, isNotNull } from 'drizzle-orm';
import { botChanges, botMessages, botUpdates, getDb, lunchWeeks } from '../../src/db';
import { CURRENT_WEEK, CURRENT_WEEK_PRICES, CURRENT_WEEK_UPDATED_AT } from '../fixtures/lunch';
import { DateTime } from 'luxon';
import { shownLunchWeek, weekRange, type IsoWeek } from '../../src/lib/isoWeek';
import { DAY_KEYS } from '../../src/lib/lunch';

export const ALLOWED_USER_ID = 1001;
export const STRANGER_USER_ID = 2002;
const SECRET = 'e2e-secret';

let counter = 0;
// Unique across tests and runs: Telegram's update_id only has to grow, ours only has to never repeat.
const nextUpdateId = () => Date.now() * 1000 + (counter++ % 1000);
const nextChatId = () => 1_000_000_000 + Math.floor(Math.random() * 1_000_000_000);

export type ScriptCall = { tool: 'lunch_get_week' | 'lunch_update_week' | 'lunch_undo'; input: unknown };

export class TelegramBot {
  readonly chatId = nextChatId();

  constructor(private request: APIRequestContext) {}

  post(update: object, secret: string | null = SECRET): Promise<APIResponse> {
    return this.request.post('/api/telegram', {
      headers: secret === null ? {} : { 'x-telegram-bot-api-secret-token': secret },
      data: update,
    });
  }

  /** The fixture model reads the text as a script: tool calls in order, then the reply. */
  scriptText(calls: ScriptCall[], reply = 'Valmis'): string {
    return JSON.stringify({ calls, reply });
  }

  async sendText(text: string, { userId = ALLOWED_USER_ID, updateId = nextUpdateId(), secret = SECRET as string | null } = {}) {
    const response = await this.post(
      {
        update_id: updateId,
        message: {
          message_id: 1,
          date: Math.floor(Date.now() / 1000),
          chat: { id: this.chatId, type: 'private' },
          from: { id: userId, is_bot: false, first_name: 'E2E' },
          text,
        },
      },
      secret,
    );
    return { response, updateId };
  }

  /**
   * Sends a menu image. The fixture model reads the caption as the extraction result (JSON); the file is a tiny stub
   * from `e2e/fixtures/menus`. A `photo` is sent the way Telegram does (several sizes), a `document` with a mime type.
   */
  async sendMenuImage(
    extraction: object | string,
    { kind = 'photo', mimeType = 'image/png', fileId = 'stub.png', userId = ALLOWED_USER_ID, updateId = nextUpdateId() } = {},
  ) {
    const caption = typeof extraction === 'string' ? extraction : JSON.stringify(extraction);
    const attachment =
      kind === 'photo'
        ? {
            photo: [
              { file_id: 'missing-small.png', file_unique_id: 'a', width: 90, height: 90, file_size: 100 },
              { file_id: fileId, file_unique_id: 'b', width: 800, height: 800, file_size: 70 },
            ],
          }
        : { document: { file_id: fileId, file_unique_id: 'c', mime_type: mimeType, file_size: 70 } };
    const response = await this.post({
      update_id: updateId,
      message: {
        message_id: 1,
        date: Math.floor(Date.now() / 1000),
        chat: { id: this.chatId, type: 'private' },
        from: { id: userId, is_bot: false, first_name: 'E2E' },
        caption,
        ...attachment,
      },
    });
    return { response, updateId };
  }

  async pressUndo(changeId: string, updateId = nextUpdateId()) {
    const response = await this.post({
      update_id: updateId,
      callback_query: {
        id: `cb-${updateId}`,
        chat_instance: 'e2e',
        from: { id: ALLOWED_USER_ID, is_bot: false, first_name: 'E2E' },
        data: `undo:${changeId}`,
        message: { message_id: 1, date: Math.floor(Date.now() / 1000), chat: { id: this.chatId, type: 'private' } },
      },
    });
    return { response, updateId };
  }

  /** Processing runs after the response, so wait until the update has been handled. */
  async expectProcessed(updateId: number) {
    await expect
      .poll(async () => {
        const [row] = await getDb()
          .select({ processedAt: botUpdates.processedAt })
          .from(botUpdates)
          .where(and(eq(botUpdates.updateId, updateId), isNotNull(botUpdates.processedAt)));
        return !!row;
      })
      .toBe(true);
  }

  async replies(): Promise<string[]> {
    const rows = await getDb()
      .select({ content: botMessages.content })
      .from(botMessages)
      .where(and(eq(botMessages.chatId, this.chatId), eq(botMessages.role, 'assistant')))
      .orderBy(botMessages.id);
    return rows.map((row) => row.content.text);
  }

  async expectReply(text: string) {
    await expect.poll(() => this.replies()).toContain(text);
  }

  async changes() {
    return getDb().select().from(botChanges).where(eq(botChanges.chatId, this.chatId)).orderBy(desc(botChanges.createdAt));
  }

  async expectChangeCount(count: number) {
    expect(await this.changes()).toHaveLength(count);
  }

  async latestChangeId(): Promise<string> {
    await expect.poll(async () => (await this.changes()).length).toBeGreaterThan(0);
    return (await this.changes())[0].id;
  }

  async storedUpdateCount(updateId: number): Promise<number> {
    return (await getDb().select().from(botUpdates).where(eq(botUpdates.updateId, updateId))).length;
  }

  async weekExists(week: IsoWeek): Promise<boolean> {
    const rows = await getDb()
      .select()
      .from(lunchWeeks)
      .where(and(eq(lunchWeeks.isoYear, week.isoYear), eq(lunchWeeks.isoWeek, week.isoWeek)));
    return rows.length > 0;
  }

  static extraction(week: IsoWeek, overrides: Record<string, unknown> = {}) {
    const { start, end } = weekRange(week);
    const iso = (date: Date) => DateTime.fromJSDate(date, { zone: 'utc' }).toISODate();
    return {
      isLunchMenu: true,
      isoWeek: week.isoWeek,
      dateRange: { start: iso(start), end: iso(end) },
      prices: { weekdayCents: 1350, weekendCents: 1420 },
      days: {
        monday: { dishes: [{ name: 'E2E Kuvan keitto', allergens: ['L', 'G'] }], note: null },
        tuesday: { dishes: [{ name: 'E2E Kuvan pasta', allergens: [] }], note: null },
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
      ...overrides,
    };
  }

  /** Puts the shown week back exactly as `db:seed:e2e` wrote it, so the public specs read their fixture. */
  static async restoreFixtureWeek() {
    const week = shownLunchWeek(new Date());
    const days = Object.fromEntries(
      DAY_KEYS.flatMap((key) => {
        const day = CURRENT_WEEK[key];
        return day ? [[key, { dishes: day.dishes, note: day.note ?? null }]] : [];
      }),
    );
    const values = { published: true, days, prices: CURRENT_WEEK_PRICES, updatedAt: CURRENT_WEEK_UPDATED_AT };
    await getDb()
      .insert(lunchWeeks)
      .values({ ...week, ...values })
      .onConflictDoUpdate({ target: [lunchWeeks.isoYear, lunchWeeks.isoWeek], set: values });
  }
}
