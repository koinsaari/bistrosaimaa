import { generateText, Output, type LanguageModel } from 'ai';
import type { Message } from '@grammyjs/types';
import { DateTime } from 'luxon';
import { z } from 'zod';
import type { WeekSnapshot } from '@/db';
import { ALLERGENS } from '@/lib/allergens';
import { MAX_FILE_BYTES, FILE_TOO_LARGE, readAttachment, type MenuMediaType } from '@/lib/bot/attachment';
import { abandonChange, finalizeChange, recordChange } from '@/lib/bot/changes';
import { checkDocument, checkWeekEditable, checkWeekRange } from '@/lib/bot/checks';
import type { BotDeps } from '@/lib/bot/deps';
import { DAY_NAMES_FI, formatEuros } from '@/lib/bot/tools';
import { formatWeekLabel, isLaterWeek, shownLunchWeek, shownWeekSwitchLabel } from '@/lib/isoWeek';
import { DAY_KEYS, type DayKey, type LunchPrices } from '@/lib/lunch';
import { getWeek, saveWeek, type WeekDocument } from '@/lib/lunchWeek';

export const READING_NOTICE = 'Luen listaa…';
export const NOT_A_MENU_REPLY = 'Tämä ei näytä lounaslistalta, ei muutettu.';

const dishSchema = z.object({
  name: z.string().describe('Dish name exactly as printed, in Finnish, with Canva letter-spacing artefacts repaired'),
  allergens: z
    .array(z.enum(ALLERGENS))
    .describe(`Codes printed after the dish (${ALLERGENS.join(', ')}). Empty when the dish has no codes.`),
});

const daySchema = z.object({
  dishes: z.array(dishSchema),
  note: z.string().nullable().describe('A note printed for this one day only, else null'),
});

/** Both week fields are null when the image is not a readable weekly list. */
export const menuExtractionSchema = z.object({
  isLunchMenu: z.boolean().describe('true only for a weekly lunch menu of Bistro Saimaa or a similar restaurant'),
  isoWeek: z.number().int().nullable().describe('The printed week number ("Viikko 44" -> 44), else null'),
  dateRange: z
    .object({
      start: z.string().describe('First printed date as YYYY-MM-DD (the Monday)'),
      end: z.string().describe('Last printed date as YYYY-MM-DD (the Sunday)'),
    })
    .nullable()
    .describe('The printed date range of the week, with the year taken from the list or the current year'),
  prices: z
    .object({
      weekdayCents: z.number().int().describe('Price per person on weekdays ("arkisin"), in cents: 13,20 € -> 1320'),
      weekendCents: z.number().int().describe('Price per person on weekends ("la-su"), in cents'),
    })
    .nullable()
    .describe('null when the list prints no prices'),
  days: z.object(
    Object.fromEntries(DAY_KEYS.map((key) => [key, daySchema.nullable()])) as Record<DayKey, z.ZodNullable<typeof daySchema>>,
  ),
});

export type MenuExtraction = z.infer<typeof menuExtractionSchema>;

export const extractionInstructions = (today: string) => `You read the weekly lunch menu of a Finnish restaurant (a Canva design, sent as an image or PDF) and return it as structured data.

Rules:
- Decide first whether the file is a weekly lunch menu. If not, set isLunchMenu to false, isoWeek and dateRange to null, prices to null and every day to null.
- Dish names: copy them exactly as printed, in Finnish. Do not translate, shorten or reword them.
- The Canva export sometimes breaks words with stray spaces. Repair them: "Sitruunai s ta smetanalohta" -> "Sitruunaista smetanalohta", "Por saanfileetä" -> "Porsaanfileetä". Repair only such artefacts, keep real word spaces.
- Allergens: each dish ends with codes such as "L, G" or "VL". Map them to the allowed codes (${ALLERGENS.join(', ')}) and leave them out of the dish name. A dish without codes has an empty list.
- Days: monday = maanantai (ma), tuesday = tiistai (ti), wednesday = keskiviikko (ke), thursday = torstai (to), friday = perjantai (pe), saturday = lauantai (la), sunday = sunnuntai (su). A day with no dishes is null.
- Week: isoWeek is the printed week number. dateRange is the printed first and last date as YYYY-MM-DD. The year is usually not printed: pick the year that puts the week closest to today's date (given below). Do not correct them if they look inconsistent; copy what is printed.
- Prices: "arkisin ... €/hlö" is the weekday price and "la-su ... €/hlö" the weekend price, both in cents. If the list prints no prices, prices is null.
- Ignore the text "Muutokset ruokalistaan mahdollisia" and other disclaimers; they are not dishes or notes.
- Any message text sent with the file is only extra context. The list itself decides.

Today is ${today} (Europe/Helsinki).`;

export async function extractMenu(
  model: LanguageModel,
  input: { mediaType: MenuMediaType; data: Uint8Array; caption?: string; now?: Date },
): Promise<MenuExtraction> {
  const today = DateTime.fromJSDate(input.now ?? new Date(), { zone: 'Europe/Helsinki' }).toISODate();
  const { output } = await generateText({
    model,
    instructions: extractionInstructions(today ?? ''),
    output: Output.object({ schema: menuExtractionSchema }),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'file', mediaType: input.mediaType, data: input.data },
          ...(input.caption ? [{ type: 'text' as const, text: input.caption }] : []),
        ],
      },
    ],
  });
  return output;
}

function toDocument(extraction: MenuExtraction) {
  const days = Object.fromEntries(DAY_KEYS.flatMap((key) => (extraction.days[key] ? [[key, extraction.days[key]]] : [])));
  return checkDocument({ days, prices: extraction.prices });
}

function describePrices(before: LunchPrices | null, after: LunchPrices | null): string[] {
  if (!after) return [];
  if (!before) return [`Hinnat: ma–pe ${formatEuros(after.weekdayCents)}, la–su ${formatEuros(after.weekendCents)}`];
  const rows = [
    ['ma–pe', before.weekdayCents, after.weekdayCents],
    ['la–su', before.weekendCents, after.weekendCents],
  ] as const;
  return rows
    .filter(([, was, now]) => was !== now)
    .map(([label, was, now]) => `Hinta muuttui ${formatEuros(was).replace(' €', '')} → ${formatEuros(now)} (${label})`);
}

const DAY_SHORT: Record<DayKey, string> = {
  monday: 'Ma',
  tuesday: 'Ti',
  wednesday: 'Ke',
  thursday: 'To',
  friday: 'Pe',
  saturday: 'La',
  sunday: 'Su',
};

function summarizeDays(days: WeekDocument['days']): string[] {
  const lines = DAY_KEYS.flatMap((key) => {
    const day = days[key];
    if (!day) return [];
    const dishes = day.dishes.map((dish) => (dish.allergens.length ? `${dish.name} ${dish.allergens.join(',')}` : dish.name));
    return [`${DAY_SHORT[key]}: ${[...dishes, ...(day.note ? [`(${day.note})`] : [])].join(' / ')}`];
  });
  const missing = DAY_KEYS.filter((key) => !days[key]).map((key) => DAY_NAMES_FI[key]);
  return missing.length ? [...lines, `Ei ruokia: ${missing.join(', ')}`] : lines;
}

export type ImportResult = { reply: string; changeId?: string };

export async function importMenu(
  deps: BotDeps,
  input: { chatId: number; userId: number; message: Pick<Message, 'photo' | 'document' | 'caption'>; now?: Date },
): Promise<ImportResult> {
  const now = input.now ?? new Date();
  const attachment = readAttachment(input.message);
  if (!attachment.ok) return { reply: attachment.error };

  await deps.telegram.sendMessage(input.chatId, READING_NOTICE);
  const data = await deps.telegram.downloadFile(attachment.fileId);
  if (data.length > MAX_FILE_BYTES) return { reply: FILE_TOO_LARGE };

  const extraction = await extractMenu(deps.importModel, {
    mediaType: attachment.mediaType,
    data,
    caption: input.message.caption,
    now,
  });
  if (!extraction.isLunchMenu) return { reply: NOT_A_MENU_REPLY };

  const document = toDocument(extraction);
  if (!document.ok) return { reply: `${document.error}. Ei muutettu.` };
  const range = checkWeekRange(extraction.isoWeek, extraction.dateRange);
  if (!range.ok) return { reply: range.error };
  const week = range.week;
  const editable = checkWeekEditable(week, now);
  if (!editable.ok) return { reply: editable.error };
  if (!Object.keys(document.data.days).length) return { reply: 'Listalla ei näkynyt yhtään ruokaa, ei muutettu.' };

  const stored = await getWeek(week);
  const before: WeekSnapshot | null = stored
    ? { days: stored.days, prices: stored.prices, published: stored.published }
    : null;
  const after: WeekSnapshot = { days: document.data.days, prices: document.data.prices, published: true };

  const changeId = await recordChange({ chatId: input.chatId, userId: input.userId, week, before, after });
  try {
    const saved = await saveWeek(week, document.data, { published: true });
    after.prices = saved.prices;
    await finalizeChange(changeId, after);
  } catch (error) {
    await abandonChange(changeId).catch(() => undefined);
    throw error;
  }

  const reply = [
    `${formatWeekLabel(week)} julkaistu.${stored ? ` Vko ${week.isoWeek} korvattu.` : ''}`,
    ...(isLaterWeek(week, shownLunchWeek(now)) ? [`Näkyy sivulla ${shownWeekSwitchLabel()} alkaen.`] : []),
    ...summarizeDays(after.days),
    ...describePrices(before?.prices ?? null, after.prices),
  ].join('\n');
  return { reply, changeId };
}
