import type { LunchRecord } from '@/lib/lunch';

/**
 * Writes the lunch record via the Edge Config API
 */
export async function writeLunchRecord(record: LunchRecord): Promise<void> {
  const configId = process.env.EDGE_CONFIG_ID;
  const token = process.env.EDGE_CONFIG_WRITE_TOKEN;
  if (!configId || !token) {
    throw new Error('EDGE_CONFIG_ID / EDGE_CONFIG_WRITE_TOKEN are not configured');
  }

  const res = await fetch(`https://api.vercel.com/v1/edge-config/${configId}/items`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ operation: 'upsert', key: process.env.LUNCH_MENU_KEY ?? 'lunchMenu', value: record }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to write lunch record: ${res.status} ${await res.text()}`);
  }
}
