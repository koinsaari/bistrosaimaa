import { and, desc, eq, gte, lt, sql } from 'drizzle-orm';
import { botMessages, getDb } from '@/db';

export const MEMORY_MAX_MESSAGES = 20;
export const MEMORY_MAX_AGE_MS = 72 * 3_600_000;

export type MemoryMessage = { role: 'user' | 'assistant'; text: string };
type MemoryRow = MemoryMessage & { createdAt: Date };

export function selectRecentMessages(rows: MemoryRow[], now: Date): MemoryMessage[] {
  const cutoff = now.getTime() - MEMORY_MAX_AGE_MS;
  return rows
    .filter((row) => row.createdAt.getTime() >= cutoff)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(-MEMORY_MAX_MESSAGES)
    .map(({ role, text }) => ({ role, text }));
}

export async function appendMessage(chatId: number, role: MemoryMessage['role'], text: string): Promise<void> {
  const db = getDb();
  await db.insert(botMessages).values({ chatId, role, content: { text } });
  await db.delete(botMessages).where(lt(botMessages.createdAt, sql`now() - interval '72 hours'`));
}

export async function loadMessages(chatId: number, now = new Date()): Promise<MemoryMessage[]> {
  const rows = await getDb()
    .select({ role: botMessages.role, content: botMessages.content, createdAt: botMessages.createdAt })
    .from(botMessages)
    .where(
      and(eq(botMessages.chatId, chatId), gte(botMessages.createdAt, new Date(now.getTime() - MEMORY_MAX_AGE_MS))),
    )
    .orderBy(desc(botMessages.createdAt), desc(botMessages.id))
    .limit(MEMORY_MAX_MESSAGES);
  // Newest first from the query; reversed so same-millisecond rows keep their insert order through the stable sort.
  return selectRecentMessages(
    rows.reverse().map((row) => ({ role: row.role, text: row.content.text, createdAt: row.createdAt })),
    now,
  );
}
