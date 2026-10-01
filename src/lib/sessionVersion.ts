import { eq, sql } from 'drizzle-orm';
import { adminState, getDb } from '@/db';

/** A missing row counts as version 1, so nothing needs seeding. */
export async function getSessionVersion(): Promise<number> {
  const [row] = await getDb()
    .select({ version: adminState.sessionVersion })
    .from(adminState)
    .where(eq(adminState.id, 1));
  return row?.version ?? 1;
}

/** Invalidates every session token issued so far. */
export async function bumpSessionVersion(): Promise<void> {
  await getDb()
    .insert(adminState)
    .values({ id: 1, sessionVersion: 2 })
    .onConflictDoUpdate({
      target: adminState.id,
      set: { sessionVersion: sql`${adminState.sessionVersion} + 1` },
    });
}
