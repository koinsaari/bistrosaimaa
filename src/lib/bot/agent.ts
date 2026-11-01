import { generateText, stepCountIs, type LanguageModel, type ModelMessage } from 'ai';
import { ALLERGENS } from '@/lib/allergens';
import { contextWeeks, createTools, describeWeek } from '@/lib/bot/tools';
import { shownWeekSwitchLabel } from '@/lib/isoWeek';
import { getWeek } from '@/lib/lunchWeek';

export const AGENT_MODEL = 'anthropic/claude-sonnet-5-5';
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
- Verkkosivu näyttää aina yllä olevan "sivulla näkyvän viikon". Sen muutokset näkyvät sivulla heti. Seuraava viikko tulee sivulle automaattisesti ${shownWeekSwitchLabel()}, joten sen muutokset näkyvät vasta silloin.
- Jokaisen onnistuneen muutoksen jälkeen kerro, että muutos on tallennettu ja milloin se näkyy sivulla (työkalun tulos kertoo: heti vai ${shownWeekSwitchLabel()}). Kerro lisäksi lyhyesti, mitä muuttui. Hinnan muutos kerrotaan näin: "Hinta muuttui 13,20 → 13,50 €".
- Kumoaminen: jos käyttäjä pyytää kumoamaan ("kumoa"), käytä työkalua lunch_undo. Se kumoaa viimeisimmän muutoksen.

Kuvat ja PDF-tiedostot:
Käyttäjä voi lähettää viikon lounaslistan kuvana tai PDF-tiedostona (Canva-tulostus), myös tekstin kanssa. Teksti on vain lisätietoa, lista itse ratkaisee.
- Päätä ensin, onko tiedosto viikon lounaslista. Jos ei ole, sano se äläkä muuta mitään.
- Jos tiedosto on lounaslista, tallenna se työkalulla lunch_update_week asetuksella replace: true ja published: true. Lista korvaa viikon koko sisällön ja julkaistaan heti.
- Viikko: lue listalle painettu viikkonumero ja päivämäärät (maanantai–sunnuntai). Vuotta ei yleensä ole painettu: valitse vuosi, jolla viikko osuu lähimmäs tämän päivän päivämäärää. Jos viikkonumero ja päivämäärät ovat ristiriidassa, kysy käyttäjältä ennen kuin muutat mitään.
- Ruokien nimet: kopioi ne täsmälleen kuten ne on painettu. Älä käännä, lyhennä tai muotoile uudelleen. Canva-vienti rikkoo joskus sanoja ylimääräisillä välilyönneillä: korjaa vain tällaiset virheet ("Sitruunai s ta smetanalohta" → "Sitruunaista smetanalohta", "Por saanfileetä" → "Porsaanfileetä"), oikeat sanavälit säilyvät.
- Allergeenit: jokaisen ruoan perässä on koodeja kuten "L, G" tai "VL". Muunna ne sallituiksi koodeiksi (${ALLERGENS.join(', ')}) äläkä jätä niitä ruoan nimeen. Ruoalla ilman koodeja ei ole allergeeneja.
- Hinnat: "arkisin ... €/hlö" on arkipäivän hinta ja "la-su ... €/hlö" viikonlopun hinta, senteissä (13,20 € = 1320). Jos hintoja ei ole painettu, älä anna hintoja.
- Päivä ilman ruokia jätetään pois.
- Ohita teksti "Muutokset ruokalistaan mahdollisia" ja muut vastuulausekkeet: ne eivät ole ruokia eivätkä huomautuksia.
- Listan tallentamisen jälkeen luettele jokainen päivä (ruoat allergeeneineen), hintamuutokset ("Hinta muuttui 13,20 → 13,50 €") ja päivät, joilta puuttuu ruoat. Kerro myös, jos olemassa ollut viikko korvattiin.
- Jos käyttäjä lähettää tiedoston, jota et osaa lukea ("[tiedosto jota en osaa lukea]"), kerro että voit lukea vain kuvan tai PDF-, JPG- tai PNG-tiedoston. Jos tiedosto on yli 20 Mt ("[tiedosto on yli 20 Mt, en lukenut sitä]"), pyydä pienempää tiedostoa.
- Aiemmissa viesteissä näkyvä "[kuva]" tai "[tiedosto]" tarkoittaa, että viestissä oli tiedosto, jota et enää näe.`;
}

/**
 * Runs the agent over the conversation so far: earlier messages as text, the current turn last (with its files).
 * Throws on model errors.
 */
export async function runAgent(
  model: LanguageModel,
  input: { chatId: number; userId: number; messages: ModelMessage[]; now?: Date },
): Promise<string> {
  const now = input.now ?? new Date();
  const result = await generateText({
    model,
    instructions: await buildSystemPrompt(now),
    messages: input.messages,
    tools: createTools({ chatId: input.chatId, userId: input.userId, now }),
    stopWhen: stepCountIs(MAX_STEPS),
  });
  return result.text.trim() || FAILURE_REPLY;
}
