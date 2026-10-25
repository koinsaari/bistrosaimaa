import { and, asc, eq, isNull, lt, sql } from 'drizzle-orm';
import type { Update } from '@grammyjs/types';
import { botChatLocks, botUpdates, getDb } from '@/db';

export const LOCK_SECONDS = 300;
const PROCESSED_RETENTION = sql`now() - interval '7 days'`;

export function chatIdOf(update: Update): number | null {
  return update.message?.chat.id ?? update.callback_query?.message?.chat.id ?? null;
}

/** Stores the update. False means Telegram redelivered one we already have: nothing more to do. */
export async function recordUpdate(update: Update, chatId: number): Promise<boolean> {
  const rows = await getDb()
    .insert(botUpdates)
    .values({ updateId: update.update_id, chatId, payload: update })
    .onConflictDoNothing()
    .returning({ updateId: botUpdates.updateId });
  return rows.length > 0;
}

/**
 * One atomic statement (neon-http has no interactive transactions): insert the lock row, or take over an expired
 * one. A live lock held by someone else makes the conditional update match nothing, so nothing is returned.
 */
export async function acquireChatLock(chatId: number): Promise<boolean> {
  const until = sql`now() + make_interval(secs => ${LOCK_SECONDS})`;
  const rows = await getDb()
    .insert(botChatLocks)
    .values({ chatId, lockedUntil: until })
    .onConflictDoUpdate({
      target: botChatLocks.chatId,
      set: { lockedUntil: until },
      setWhere: lt(botChatLocks.lockedUntil, sql`now()`),
    })
    .returning({ chatId: botChatLocks.chatId });
  return rows.length > 0;
}

export async function renewChatLock(chatId: number): Promise<void> {
  await getDb()
    .update(botChatLocks)
    .set({ lockedUntil: sql`now() + make_interval(secs => ${LOCK_SECONDS})` })
    .where(eq(botChatLocks.chatId, chatId));
}

export async function releaseChatLock(chatId: number): Promise<void> {
  await getDb().delete(botChatLocks).where(eq(botChatLocks.chatId, chatId));
}

async function nextPending(chatId: number): Promise<Update | null> {
  const [row] = await getDb()
    .select({ payload: botUpdates.payload })
    .from(botUpdates)
    .where(and(eq(botUpdates.chatId, chatId), isNull(botUpdates.processedAt)))
    .orderBy(asc(botUpdates.updateId))
    .limit(1);
  return (row?.payload as Update | undefined) ?? null;
}

async function markProcessed(updateId: number): Promise<void> {
  await getDb().update(botUpdates).set({ processedAt: sql`now()` }).where(eq(botUpdates.updateId, updateId));
}

async function pruneProcessed(): Promise<void> {
  await getDb().delete(botUpdates).where(lt(botUpdates.processedAt, PROCESSED_RETENTION));
}

/**
 * Processes the chat's unprocessed updates in `update_id` order, then releases the lock. `handle` must not throw
 * for handled errors; an update is marked processed after it returns either way.
 *
 * Lost wake-up: an update can arrive after the last "nothing pending" check but before the lock is released, and its
 * own drain bounced off our lock. So after releasing we look again and, if something is pending, take the lock back.
 */
export async function drainChat(chatId: number, handle: (update: Update) => Promise<void>): Promise<void> {
  for (;;) {
    if (!(await acquireChatLock(chatId))) return;
    try {
      for (let update = await nextPending(chatId); update; update = await nextPending(chatId)) {
        await renewChatLock(chatId);
        try {
          await handle(update);
        } finally {
          await markProcessed(update.update_id);
        }
        await renewChatLock(chatId);
      }
    } finally {
      await releaseChatLock(chatId);
    }
    if (!(await nextPending(chatId))) break;
  }
  await pruneProcessed().catch(() => undefined);
}
