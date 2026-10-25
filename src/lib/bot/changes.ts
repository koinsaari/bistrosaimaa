import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { botChanges, getDb, lunchWeeks, type WeekSnapshot } from '@/db';
import type { IsoWeek } from '@/lib/isoWeek';

export const CANNOT_UNDO = 'Tätä muutosta ei voi enää kumota.';

export type UndoResult = { ok: true; changeId: string; week: IsoWeek; removed: boolean } | { ok: false; error: string };

export async function recordChange(change: {
  chatId: number;
  userId: number;
  week: IsoWeek;
  before: WeekSnapshot | null;
  after: WeekSnapshot;
}): Promise<string> {
  const [row] = await getDb()
    .insert(botChanges)
    .values({
      chatId: change.chatId,
      userId: change.userId,
      isoYear: change.week.isoYear,
      isoWeek: change.week.isoWeek,
      before: change.before,
      after: change.after,
    })
    .returning({ id: botChanges.id });
  return row.id;
}

export async function finalizeChange(changeId: string, after: WeekSnapshot): Promise<void> {
  await getDb().update(botChanges).set({ after }).where(eq(botChanges.id, changeId));
}

export async function abandonChange(changeId: string): Promise<void> {
  await getDb().update(botChanges).set({ undoneAt: sql`now()` }).where(eq(botChanges.id, changeId));
}

async function latestOpenChangeId(week: IsoWeek): Promise<string | null> {
  const [row] = await getDb()
    .select({ id: botChanges.id })
    .from(botChanges)
    .where(and(eq(botChanges.isoYear, week.isoYear), eq(botChanges.isoWeek, week.isoWeek), isNull(botChanges.undoneAt)))
    .orderBy(desc(botChanges.createdAt))
    .limit(1);
  return row?.id ?? null;
}

export async function undoChange(changeId: string): Promise<UndoResult> {
  const db = getDb();
  const [change] = await db.select().from(botChanges).where(eq(botChanges.id, changeId)).limit(1);
  if (!change || change.undoneAt) return { ok: false, error: CANNOT_UNDO };

  const week = { isoYear: change.isoYear, isoWeek: change.isoWeek };
  if ((await latestOpenChangeId(week)) !== change.id) return { ok: false, error: CANNOT_UNDO };

  const markUndone = db.update(botChanges).set({ undoneAt: sql`now()` }).where(eq(botChanges.id, change.id));
  const where = and(eq(lunchWeeks.isoYear, week.isoYear), eq(lunchWeeks.isoWeek, week.isoWeek));
  const before = change.before;
  // One batch, so the week and the audit row can't disagree.
  await db.batch([
    markUndone,
    before
      ? db
          .insert(lunchWeeks)
          .values({ ...week, ...before })
          .onConflictDoUpdate({
            target: [lunchWeeks.isoYear, lunchWeeks.isoWeek],
            set: { days: before.days, prices: before.prices, published: before.published, updatedAt: sql`now()` },
          })
      : db.delete(lunchWeeks).where(where),
  ]);
  return { ok: true, changeId: change.id, week, removed: !before };
}

export async function undoLatestForChat(chatId: number): Promise<UndoResult> {
  const [latest] = await getDb()
    .select({ id: botChanges.id })
    .from(botChanges)
    .where(and(eq(botChanges.chatId, chatId), isNull(botChanges.undoneAt)))
    .orderBy(desc(botChanges.createdAt))
    .limit(1);
  return latest ? undoChange(latest.id) : { ok: false, error: 'Ei kumottavaa muutosta.' };
}
