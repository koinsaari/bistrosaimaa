import { generateText, stepCountIs, type LanguageModel, type ModelMessage } from 'ai';
import { ALLERGENS } from '@/lib/allergens';
import { loadMessages } from '@/lib/bot/memory';
import { contextWeeks, createTools, describeWeek } from '@/lib/bot/tools';
import { getWeek } from '@/lib/lunchWeek';

export const MAX_STEPS = 8;
export const FAILURE_REPLY = 'Jokin meni pieleen, yritä uudelleen.';
export const OUT_OF_SCOPE_REPLY = 'Osaan auttaa vain lounaslistan kanssa.';

const ALLERGEN_MEANINGS: Record<(typeof ALLERGENS)[number], string> = {
  G: 'gluteeniton',
  L: 'laktoositon',
  VL: 'vähälaktoosinen',
  M: 'maidoton',
  Veg: 'vegaaninen',
};

export async function buildSystemPrompt(now: Date): Promise<string> {
  const today = new Intl.DateTimeFormat('fi-FI', {
    timeZone: 'Europe/Helsinki',
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(now);
  const [shown, next] = contextWeeks(now);
  const [shownWeek, nextWeek] = await Promise.all([getWeek(shown), getWeek(next)]);

  return `Olet Bistro Saimaan lounaslistan apulainen. Henkilökunta kirjoittaa sinulle Telegramissa ja sinä muokkaat viikon lounaslistaa työkaluilla.

Tänään on ${today} (Helsingin aika).

Sivulla näkyvä viikko:
${JSON.stringify(describeWeek(shown, shownWeek), null, 1)}

Seuraava viikko:
${JSON.stringify(describeWeek(next, nextWeek), null, 1)}

Allergeenikoodit: ${ALLERGENS.map((code) => `${code} = ${ALLERGEN_MEANINGS[code]}`).join(', ')}.

Säännöt:
- Vastaa aina suomeksi, lyhyesti ja pelkkänä tekstinä (ei Markdownia).
- Hoida vain lounaslistaan liittyviä asioita. Muusta sano: "${OUT_OF_SCOPE_REPLY}"
- Jos on epäselvää, mille viikolle muutos kuuluu, kysy ennen kuin muutat mitään.
- Muuta vain sitä, mitä pyydettiin. Kirjoita ruokien nimet kuten käyttäjä ne antaa.
- Lue viikko työkalulla, jos tarvitset muutakin kuin yllä olevan viikon sisällön.
- Jos työkalu palauttaa virheen (ok: false), kerro virhe käyttäjälle äläkä väitä muutoksen onnistuneen.
- Muutoksen jälkeen kerro lyhyesti, mitä muuttui. Hinnan muutos kerrotaan näin: "Hinta muuttui 13,20 → 13,50 €".
- Muokatut viikot ovat heti julkisella verkkosivulla.`;
}

export type AgentResult = { reply: string; changeIds: string[] };

/** Runs the text path. The current user message must already be stored in memory. Throws on model errors. */
export async function runAgent(
  model: LanguageModel,
  input: { chatId: number; userId: number; now?: Date },
): Promise<AgentResult> {
  const now = input.now ?? new Date();
  const history = await loadMessages(input.chatId, now);
  // A conversation must open with the user; drop an assistant message whose question aged out of the window.
  const firstUser = history.findIndex((message) => message.role === 'user');
  const messages: ModelMessage[] = history
    .slice(Math.max(firstUser, 0))
    .map((message) => ({ role: message.role, content: message.text }));

  const changeIds: string[] = [];
  const result = await generateText({
    model,
    instructions: await buildSystemPrompt(now),
    messages,
    tools: createTools({ chatId: input.chatId, userId: input.userId, now, changeIds }),
    stopWhen: stepCountIs(MAX_STEPS),
  });
  return { reply: result.text.trim() || FAILURE_REPLY, changeIds };
}
