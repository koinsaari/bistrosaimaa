import { expect, test } from '@playwright/test';
import { LunchSectionPage } from './pages/LunchSectionPage';
import { STRANGER_USER_ID, TelegramBot } from './pages/TelegramBot';
import { CURRENT_WEEK } from './fixtures/lunch';
import { addWeeks, shownLunchWeek } from '../src/lib/isoWeek';

test.skip(!process.env.DATABASE_URL, 'no DB');

// These specs edit the shown week; whatever happens, the public specs must find their fixture again.
test.afterEach(async () => {
  await TelegramBot.restoreFixtureWeek();
});

const week = () => shownLunchWeek(new Date());
const mondayEdit = (name: string) => ({
  tool: 'lunch_update_week' as const,
  input: { week: week(), changes: { days: { monday: { dishes: [{ name, allergens: ['M'] }] } } } },
});
const originalMonday = CURRENT_WEEK.monday!.dishes.map((dish) => dish.name);

test.describe('Telegram bot', () => {
  test('a text edit shows on the home page', async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const { response, updateId } = await bot.sendText(bot.scriptText([mondayEdit('E2E Botin keitto')], 'Maanantai päivitetty'));
    expect(response.status()).toBe(200);
    await bot.expectProcessed(updateId);
    await bot.expectReply('Maanantai päivitetty');

    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', ['E2E Botin keitto']);
    await lunch.expectDishAllergens('monday', 'E2E Botin keitto', '(M)');
    await bot.expectChangeCount(1);
  });

  test('Kumoa restores the week', async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const edit = await bot.sendText(bot.scriptText([mondayEdit('E2E Kumottava keitto')]));
    await bot.expectProcessed(edit.updateId);
    const changeId = await bot.latestChangeId();

    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', ['E2E Kumottava keitto']);

    const undo = await bot.pressUndo(changeId);
    expect(undo.response.status()).toBe(200);
    await bot.expectProcessed(undo.updateId);
    await expect.poll(() => bot.replies()).toContainEqual(expect.stringContaining('Kumottu'));
    await lunch.goto();
    await lunch.expectDayDishes('monday', originalMonday);

    const again = await bot.pressUndo(changeId);
    await bot.expectProcessed(again.updateId);
    await bot.expectReply('Tätä muutosta ei voi enää kumota.');
  });

  test("only the week's latest change can be undone", async ({ request }) => {
    const bot = new TelegramBot(request);
    const first = await bot.sendText(bot.scriptText([mondayEdit('E2E Ensimmäinen')]));
    await bot.expectProcessed(first.updateId);
    const firstChange = await bot.latestChangeId();
    const second = await bot.sendText(bot.scriptText([mondayEdit('E2E Toinen')]));
    await bot.expectProcessed(second.updateId);

    const undo = await bot.pressUndo(firstChange);
    await bot.expectProcessed(undo.updateId);
    await bot.expectReply('Tätä muutosta ei voi enää kumota.');
  });

  test("a chat's updates are applied in order", async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const a = await bot.sendText(bot.scriptText([mondayEdit('E2E Ensin')]));
    const b = await bot.sendText(bot.scriptText([mondayEdit('E2E Sitten')]));
    await bot.expectProcessed(a.updateId);
    await bot.expectProcessed(b.updateId);

    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', ['E2E Sitten']);
  });

  test('an unknown user changes nothing and gets no reply', async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const { response, updateId } = await bot.sendText(bot.scriptText([mondayEdit('E2E Tuntematon')]), {
      userId: STRANGER_USER_ID,
    });
    expect(response.status()).toBe(200);
    await bot.expectProcessed(updateId);

    await bot.expectChangeCount(0);
    expect(await bot.replies()).toEqual([]);
    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', originalMonday);
  });

  test('a wrong or missing secret is refused and stores nothing', async ({ request }) => {
    const bot = new TelegramBot(request);
    const wrong = await bot.sendText('Hei', { secret: 'nope' });
    const missing = await bot.sendText('Hei', { secret: null });
    expect(wrong.response.status()).toBe(401);
    expect(missing.response.status()).toBe(401);
    expect(await bot.storedUpdateCount(wrong.updateId)).toBe(0);
    expect(await bot.storedUpdateCount(missing.updateId)).toBe(0);
  });

  test('the same update_id twice makes one change', async ({ request }) => {
    const bot = new TelegramBot(request);
    const first = await bot.sendText(bot.scriptText([mondayEdit('E2E Kerran')]));
    const second = await bot.sendText(bot.scriptText([mondayEdit('E2E Kerran')]), { updateId: first.updateId });
    expect(first.response.status()).toBe(200);
    expect(second.response.status()).toBe(200);
    await bot.expectProcessed(first.updateId);

    await bot.expectChangeCount(1);
    expect(await bot.storedUpdateCount(first.updateId)).toBe(1);
  });

  test('an edit of a past week is refused', async ({ request }) => {
    const bot = new TelegramBot(request);
    const past = addWeeks(week(), -2);
    const { updateId } = await bot.sendText(
      bot.scriptText([
        { tool: 'lunch_update_week', input: { week: past, changes: { days: { monday: { dishes: [{ name: 'E2E Menneisyys' }] } } } } },
      ]),
    );
    await bot.expectProcessed(updateId);

    await bot.expectChangeCount(0);
    expect(await bot.weekExists(past)).toBe(false);
  });

  test('anything but a script gets the out-of-scope answer', async ({ request }) => {
    const bot = new TelegramBot(request);
    const { updateId } = await bot.sendText('Mikä on elämän tarkoitus?');
    await bot.expectProcessed(updateId);
    await bot.expectReply('Osaan auttaa vain lounaslistan kanssa.');
  });
});
