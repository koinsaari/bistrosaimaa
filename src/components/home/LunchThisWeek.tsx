import { connection } from 'next/server';
import { getLocale, getTranslations } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';
import { ALLERGENS } from '@/lib/allergens';
import { formatWeekDates, shownLunchWeek } from '@/lib/isoWeek';
import { getLunchDisplay, formatLunchInfo, formatUpdatedAt, DAY_KEYS, type DayKey } from '@/lib/lunch';

const DAY_MESSAGE_KEYS: Record<DayKey, string> = {
  monday: 'lunchDay.monday',
  tuesday: 'lunchDay.tuesday',
  wednesday: 'lunchDay.wednesday',
  thursday: 'lunchDay.thursday',
  friday: 'lunchDay.friday',
  saturday: 'lunchDay.saturday',
  sunday: 'lunchDay.sunday',
};

export function LunchSkeleton() {
  return (
    <section aria-busy="true" className="relative bg-muted/40 py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mb-12 max-w-2xl space-y-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="mx-auto max-w-4xl divide-y divide-border/60">
          {DAY_KEYS.map((day) => (
            <div key={day} className="flex flex-col gap-2 py-5 md:flex-row md:gap-8 md:py-6">
              <Skeleton className="h-5 w-28 shrink-0" />
              <Skeleton className="h-5 w-full max-w-sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function LunchThisWeek() {
  // Keeps the menu per-request even if the page is ever made static; a prerendered menu would go stale.
  await connection();
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const week = shownLunchWeek(new Date());
  const display = await getLunchDisplay(week);

  return (
    <section className="relative bg-muted/40 py-20 md:py-28">
      <Reveal className="container mx-auto px-6">
        <header className="mb-12 max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-eyebrow font-semibold uppercase tracking-[0.2em] text-primary">
            <WaterLine variant="inline" />
            <span>{t('lunchEyebrow')}</span>
          </p>
          <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
            {t('lunchHeading')}
          </h2>
          <p data-testid="lunch-week" className="mt-3 text-sm text-muted-foreground">
            {t('lunchWeek', { week: week.isoWeek, dates: formatWeekDates(week, locale) })}
          </p>
        </header>

        <div className="mx-auto max-w-4xl">
          {display.status === 'fallback' ? (
            <p data-testid="lunch-fallback" className="text-lg leading-relaxed text-foreground/85">
              {t('lunchFallback')}
            </p>
          ) : (
            <>
              <ul className="divide-y divide-border/60">
                {DAY_KEYS.map((day) => {
                  const dayDisplay = display.days.find((d) => d.day === day)!;
                  return (
                    <li
                      key={day}
                      data-testid={`lunch-day-${day}`}
                      className="flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:gap-8 md:py-6"
                    >
                      <span className="w-40 shrink-0 font-serif italic text-xl text-ink">
                        {t(DAY_MESSAGE_KEYS[day])}
                      </span>
                      {dayDisplay.status === 'content' ? (
                        <div className="space-y-2.5 text-lg leading-snug text-foreground/90">
                          {dayDisplay.dishes.length > 0 && (
                            <ul className="space-y-2.5">
                              {dayDisplay.dishes.map((dish, i) => (
                                <li key={i} data-testid="lunch-dish">
                                  <span data-testid="lunch-dish-name">{dish.name}</span>
                                  {dish.allergens.length > 0 && (
                                    <span data-testid="lunch-dish-allergens" className="ml-1.5 whitespace-nowrap text-sm text-muted-foreground">
                                      ({dish.allergens.join(', ')})
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                          {dayDisplay.note && (
                            <p data-testid="lunch-note" className="italic text-muted-foreground">
                              {dayDisplay.note}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span data-testid="lunch-placeholder" className="text-lg text-muted-foreground">
                          {t('lunchPlaceholder')}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {display.days.some((d) => d.status === 'content' && d.dishes.some((dish) => dish.allergens.length)) && (
                <p className="mt-6 text-sm text-muted-foreground" data-testid="lunch-allergen-key">
                  {ALLERGENS.map((code) => `${code} = ${t(`lunchAllergen.${code}`)}`).join(' · ')}
                </p>
              )}

              <p className="mt-2 text-sm text-muted-foreground" data-testid="lunch-updated">
                {t('lunchUpdatedAt', { date: formatUpdatedAt(display.updatedAt) })}
              </p>
            </>
          )}

          <Separator className="mt-10" />

          <p className="mt-6 text-sm text-muted-foreground">
            {t('lunchHoursAndPriceNote', formatLunchInfo(locale))}
          </p>
          <p data-testid="lunch-disclaimer" className="mt-2 text-sm text-muted-foreground">
            {t('lunchDisclaimer')}
          </p>

          <div className="mt-6">
            <Button asChild variant="outline" className="rounded-full">
              <a href="https://www.facebook.com/bistrosaimaa" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t('lunchFacebookCta')}
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
      <div className="container mx-auto mt-20 px-6">
        <WaterLine variant="divider" />
      </div>
    </section>
  );
}
