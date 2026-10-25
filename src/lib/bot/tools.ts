import { tool } from 'ai';
import { z } from 'zod';
import type { WeekSnapshot } from '@/db';
import { ALLERGENS } from '@/lib/allergens';
import { abandonChange, finalizeChange, recordChange, undoLatestForChat } from '@/lib/bot/changes';
import { checkDocument, checkWeekEditable } from '@/lib/bot/checks';
import { addWeeks, formatWeekLabel, shownLunchWeek, type IsoWeek } from '@/lib/isoWeek';
import { DAY_KEYS, type DayKey, type LunchDay, type LunchPrices } from '@/lib/lunch';
import { getWeek, isValidIsoWeek, saveWeek, type StoredWeek } from '@/lib/lunchWeek';

export const DAY_NAMES_FI: Record<DayKey, string> = {
  monday: 'maanantai',
  tuesday: 'tiistai',
  wednesday: 'keskiviikko',
  thursday: 'torstai',
  friday: 'perjantai',
  saturday: 'lauantai',
  sunday: 'sunnuntai',
};

export function formatEuros(cents: number): string {
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`;
}

export function describeWeek(week: IsoWeek, stored: StoredWeek | null) {
  if (!stored) return { viikko: week.isoWeek, vuosi: week.isoYear, jakso: formatWeekLabel(week), olemassa: false };
  const days = Object.fromEntries(
    DAY_KEYS.flatMap((key) => {
      const day = stored.days[key];
      if (!day) return [];
      return [
        [
          DAY_NAMES_FI[key],
          {
            ruoat: day.dishes.map((dish) => ({ nimi: dish.name, allergeenit: dish.allergens })),
            huomautus: day.note,
          },
        ],
      ];
    }),
  );
  return {
    viikko: week.isoWeek,
    vuosi: week.isoYear,
    jakso: formatWeekLabel(week),
    olemassa: true,
    julkaistu: stored.published,
    hinnat: stored.prices
      ? { arkisin: formatEuros(stored.prices.weekdayCents), viikonloppuisin: formatEuros(stored.prices.weekendCents) }
      : null,
    päivät: Object.keys(days).length ? days : 'ei yhtään päivää täytetty',
  };
}

export function contextWeeks(now: Date): IsoWeek[] {
  const shown = shownLunchWeek(now);
  return [shown, addWeeks(shown, 1)];
}

const weekInput = z
  .object({
    isoYear: z.number().int().min(2000).max(2100).describe('ISO-viikon vuosi, esim. 2026'),
    isoWeek: z.number().int().min(1).max(53).describe('ISO-viikon numero 1–53'),
  })
  .refine(isValidIsoWeek, 'Viikkoa ei ole olemassa (vuodessa on 52 tai 53 viikkoa)');

const dishInput = z.object({
  name: z.string().describe('Ruoan nimi suomeksi, esim. "Lohikeitto"'),
  allergens: z
    .array(z.enum(ALLERGENS))
    .optional()
    .describe(`Allergeenikoodit: ${ALLERGENS.join(', ')}. Tyhjä tai puuttuva = ei merkintöjä.`),
});

const dayChangeInput = z.object({
  dishes: z
    .array(dishInput)
    .optional()
    .describe('Päivän KOKO ruokalista järjestyksessä. Korvaa päivän aiemmat ruoat. Tyhjä lista poistaa ruoat.'),
  note: z.string().nullable().optional().describe('Päivän huomautus. null tai tyhjä poistaa huomautuksen.'),
});

const changesInput = z.object({
  days: z
    .object(Object.fromEntries(DAY_KEYS.map((key) => [key, dayChangeInput.optional()])) as Record<DayKey, z.ZodOptional<typeof dayChangeInput>>)
    .optional()
    .describe('Muutettavat päivät. Avaimet: monday, tuesday, wednesday, thursday, friday, saturday, sunday. Mainitsemattomat päivät pysyvät ennallaan.'),
  prices: z
    .object({
      weekdayCents: z.number().int().optional().describe('Arkipäivän (ma–pe) hinta senteissä, esim. 1320'),
      weekendCents: z.number().int().optional().describe('Viikonlopun (la–su) hinta senteissä, esim. 1420'),
    })
    .optional()
    .describe('Viikon hinnat. Vain annettu hinta muuttuu.'),
  published: z.boolean().optional().describe('true = näytetään verkkosivulla, false = piilotetaan.'),
});

export type ToolContext = {
  chatId: number;
  userId: number;
  now: Date;
  /** Filled in as the agent writes: ids of the changes made during this message, oldest first. */
  changeIds: string[];
};

function applyDayChanges(
  current: StoredWeek['days'],
  changes: z.infer<typeof changesInput>['days'],
): Partial<Record<DayKey, LunchDay>> {
  const days = { ...current };
  for (const key of DAY_KEYS) {
    const change = changes?.[key];
    if (!change) continue;
    const existing = days[key] ?? { dishes: [], note: null };
    days[key] = {
      dishes: change.dishes ? change.dishes.map((dish) => ({ name: dish.name, allergens: dish.allergens ?? [] })) : existing.dishes,
      note: change.note !== undefined ? change.note : existing.note,
    };
  }
  return days;
}

function describePriceChange(before: LunchPrices | null, after: LunchPrices | null): string[] {
  if (!after) return [];
  const rows = [
    ['Hinta (ma–pe)', before?.weekdayCents, after.weekdayCents],
    ['Hinta (la–su)', before?.weekendCents, after.weekendCents],
  ] as const;
  return rows
    .filter(([, was, now]) => was !== now)
    .map(([label, was, now]) =>
      was === undefined ? `${label} ${formatEuros(now)}` : `${label} muuttui ${formatEuros(was).replace(' €', '')} → ${formatEuros(now)}`,
    );
}

const snapshotOf = (stored: StoredWeek): WeekSnapshot => ({ days: stored.days, prices: stored.prices, published: stored.published });

export function createTools(ctx: ToolContext) {
  return {
    lunch_get_week: tool({
      description:
        'Lukee lounaslistan viikolta. Ilman viikkoa palauttaa sivulla näkyvän viikon ja seuraavan viikon. Käytä aina ennen muutosta, jos et tiedä viikon nykyistä sisältöä.',
      inputSchema: z.object({ week: weekInput.optional() }),
      execute: async ({ week }) => {
        const weeks = week ? [week] : contextWeeks(ctx.now);
        return Promise.all(weeks.map(async (w) => describeWeek(w, await getWeek(w))));
      },
    }),

    lunch_update_week: tool({
      description:
        'Muuttaa yhtä lounasviikkoa osittain: vain annetut päivät, hinnat ja julkaisutila muuttuvat. Luo viikon, jos sitä ei ole (uusi viikko julkaistaan heti). Mennyttä viikkoa ei voi muuttaa.',
      inputSchema: z.object({ week: weekInput, changes: changesInput }),
      execute: async ({ week, changes }) => {
        const editable = checkWeekEditable(week, ctx.now);
        if (!editable.ok) return { ok: false, virhe: editable.error };

        const stored = await getWeek(week);
        const prices = changes.prices ? { ...stored?.prices, ...changes.prices } : (stored?.prices ?? null);
        const document = checkDocument({ days: applyDayChanges(stored?.days ?? {}, changes.days), prices });
        if (!document.ok) {
          const missingPrice = changes.prices && (prices?.weekdayCents === undefined || prices?.weekendCents === undefined);
          return {
            ok: false,
            virhe: missingPrice
              ? 'Viikolla ei ole vielä hintoja, anna sekä arkipäivän että viikonlopun hinta.'
              : `${document.error}. Ei muutettu.`,
          };
        }

        const before = stored ? snapshotOf(stored) : null;
        const after: WeekSnapshot = {
          days: document.data.days,
          prices: document.data.prices ?? stored?.prices ?? null,
          published: changes.published ?? stored?.published ?? true,
        };
        if (before && JSON.stringify(before) === JSON.stringify(after)) {
          return { ok: true, muutettu: false, huomio: 'Viikko on jo sellainen, ei muutettu.', viikko: describeWeek(week, stored) };
        }

        const changeId = await recordChange({ chatId: ctx.chatId, userId: ctx.userId, week, before, after });
        try {
          const saved = await saveWeek(week, document.data, { published: after.published });
          after.prices = saved.prices;
          await finalizeChange(changeId, after);
        } catch (error) {
          await abandonChange(changeId).catch(() => undefined);
          throw error;
        }
        ctx.changeIds.push(changeId);

        const fresh = describeWeek(week, { ...after, updatedAt: ctx.now });
        const changedNames = DAY_KEYS.filter((key) => changes.days?.[key]).map((key) => DAY_NAMES_FI[key]);
        return {
          ok: true,
          muutettu: true,
          muutosId: changeId,
          muutetutPäivät: changedNames,
          hintamuutokset: describePriceChange(before?.prices ?? null, after.prices),
          viikonTila: fresh,
          huomio: before ? undefined : 'Viikko luotiin ja julkaistiin.',
        };
      },
    }),

    lunch_undo: tool({
      description:
        'Kumoaa tämän keskustelun viimeisimmän muutoksen, jos se on edelleen kyseisen viikon uusin muutos.',
      inputSchema: z.object({}),
      execute: async () => {
        const result = await undoLatestForChat(ctx.chatId);
        if (result.ok) {
          const index = ctx.changeIds.indexOf(result.changeId);
          if (index >= 0) ctx.changeIds.splice(index, 1);
        }
        return result.ok
          ? { ok: true, viikko: result.week.isoWeek, huomio: result.removed ? 'Viikko poistettiin (sitä ei ollut ennen muutosta).' : 'Muutos kumottu.' }
          : { ok: false, virhe: result.error };
      },
    }),
  };
}
