import { expect, test } from '@playwright/test';
import { LunchSectionPage } from './pages/LunchSectionPage';
import { TelegramBot } from './pages/TelegramBot';
import { CURRENT_WEEK } from './fixtures/lunch';
import { addWeeks, shownLunchWeek } from '../src/lib/isoWeek';

test.skip(!process.env.DATABASE_URL, 'no DB');

// These specs overwrite the shown week; whatever happens, the public specs must find their fixture again.
test.afterEach(async () => {
  await TelegramBot.restoreFixtureWeek();
});

const week = () => shownLunchWeek(new Date());
const originalMonday = CURRENT_WEEK.monday!.dishes.map((dish) => dish.name);

test.describe('Telegram bot image import', () => {
  test('a menu photo replaces the shown week and the home page shows it', async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const { response, updateId } = await bot.sendMenuImage(TelegramBot.extraction(week()));
    expect(response.status()).toBe(200);
    await bot.expectProcessed(updateId);

    await expect.poll(() => bot.replies()).toContainEqual(expect.stringMatching(new RegExp(`julkaistu\\. Vko ${week().isoWeek} korvattu\\.`)));
    await expect.poll(() => bot.replies()).toContainEqual(expect.stringContaining('Hinta muuttui 13,20 → 13,50'));
    await bot.expectChangeCount(1);

    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', ['E2E Kuvan keitto']);
    await lunch.expectDishAllergens('monday', 'E2E Kuvan keitto', '(G, L)');
    await lunch.expectDayDishes('tuesday', ['E2E Kuvan pasta']);
    await lunch.expectDishNowhere(CURRENT_WEEK.friday!.dishes[0].name);
    await lunch.expectHoursNote('13,50');
  });

  test('a menu PDF document is imported too', async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const { updateId } = await bot.sendMenuImage(TelegramBot.extraction(week()), {
      kind: 'document',
      mimeType: 'application/pdf',
    });
    await bot.expectProcessed(updateId);
    await bot.expectChangeCount(1);

    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', ['E2E Kuvan keitto']);
  });

  test('Kumoa restores the week', async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const imported = await bot.sendMenuImage(TelegramBot.extraction(week()));
    await bot.expectProcessed(imported.updateId);
    const changeId = await bot.latestChangeId();

    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', ['E2E Kuvan keitto']);

    const undo = await bot.pressUndo(changeId);
    await bot.expectProcessed(undo.updateId);
    await expect.poll(() => bot.replies()).toContainEqual(expect.stringContaining('Kumottu'));
    await lunch.goto();
    await lunch.expectDayDishes('monday', originalMonday);
    await lunch.expectDishNowhere('E2E Kuvan keitto');
  });

  test('a week number that does not match the dates is refused and nothing is saved', async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const wrongNumber = week().isoWeek === 1 ? 2 : week().isoWeek - 1;
    const { updateId } = await bot.sendMenuImage(TelegramBot.extraction(week(), { isoWeek: wrongNumber }));
    await bot.expectProcessed(updateId);

    await expect.poll(() => bot.replies()).toContainEqual(expect.stringContaining(`viikko ${wrongNumber}`));
    await expect.poll(() => bot.replies()).toContainEqual(expect.stringContaining('ei muutettu'));
    await bot.expectChangeCount(0);
    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', originalMonday);
  });

  test('a date range that is not Monday to Sunday is refused', async ({ request }) => {
    const bot = new TelegramBot(request);
    const extraction = TelegramBot.extraction(week());
    const { updateId } = await bot.sendMenuImage({ ...extraction, dateRange: { start: extraction.dateRange.start, end: extraction.dateRange.start } });
    await bot.expectProcessed(updateId);
    await expect.poll(() => bot.replies()).toContainEqual(expect.stringContaining('maanantaista sunnuntaihin'));
    await bot.expectChangeCount(0);
  });

  test('a picture that is not a lunch menu changes nothing', async ({ page, request }) => {
    const bot = new TelegramBot(request);
    const { updateId } = await bot.sendMenuImage(
      TelegramBot.extraction(week(), {
        isLunchMenu: false,
        isoWeek: null,
        dateRange: null,
        prices: null,
        days: { monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null, sunday: null },
      }),
    );
    await bot.expectProcessed(updateId);

    await bot.expectReply('Tämä ei näytä lounaslistalta, ei muutettu.');
    await bot.expectChangeCount(0);
    const lunch = new LunchSectionPage(page);
    await lunch.goto();
    await lunch.expectDayDishes('monday', originalMonday);
  });

  test('a menu of a past week is refused', async ({ request }) => {
    const bot = new TelegramBot(request);
    const past = addWeeks(week(), -2);
    const { updateId } = await bot.sendMenuImage(TelegramBot.extraction(past));
    await bot.expectProcessed(updateId);

    await expect.poll(() => bot.replies()).toContainEqual(`Vko ${past.isoWeek} on jo mennyt, ei muutettu.`);
    await bot.expectChangeCount(0);
    expect(await bot.weekExists(past)).toBe(false);
  });

  test('a file type that cannot be read is refused before any model call', async ({ request }) => {
    const bot = new TelegramBot(request);
    const { updateId } = await bot.sendMenuImage(TelegramBot.extraction(week()), { kind: 'document', mimeType: 'text/plain' });
    await bot.expectProcessed(updateId);

    await expect.poll(() => bot.replies()).toContainEqual(expect.stringContaining('Tätä tiedostoa en osaa lukea'));
    await bot.expectChangeCount(0);
  });

  test('an unknown user cannot import a menu', async ({ request }) => {
    const bot = new TelegramBot(request);
    const { updateId } = await bot.sendMenuImage(TelegramBot.extraction(week()), { userId: 2002 });
    await bot.expectProcessed(updateId);
    await bot.expectChangeCount(0);
    expect(await bot.replies()).toEqual([]);
  });
});
