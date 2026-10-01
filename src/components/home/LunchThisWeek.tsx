import { connection } from 'next/server';
import { getLocale, getTranslations } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';
import { getLunchDisplay, formatUpdatedAt, DAY_KEYS, type DayKey } from '@/lib/lunch';

const DAY_MESSAGE_KEYS: Record<DayKey, string> = {
  monday: 'lunchDay.monday',
  tuesday: 'lunchDay.tuesday',
  wednesday: 'lunchDay.wednesday',
  thursday: 'lunchDay.thursday',
  friday: 'lunchDay.friday',
  saturday: 'lunchDay.saturday',
  sunday: 'lunchDay.sunday',
};

export default async function LunchThisWeek() {
  // Keeps the menu per-request even if the page is ever made static; a prerendered menu would go stale.
  await connection();
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const display = await getLunchDisplay();

  return (
    <section className="relative bg-muted/40 py-20 md:py-28">
      <Reveal className="container mx-auto px-6">
        <header className="mb-12 max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            <WaterLine variant="inline" />
            <span>{t('lunchEyebrow')}</span>
          </p>
          <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
            {t('lunchHeading')}
          </h2>
        </header>

        <div className="mx-auto max-w-3xl">
          {display.status === 'fallback' ? (
            <p data-testid="lunch-fallback" className="text-[15px] leading-relaxed text-foreground/85">
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
                      className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:gap-8 md:py-6"
                    >
                      <span className="w-36 shrink-0 font-serif italic text-[15px] text-ink">
                        {t(DAY_MESSAGE_KEYS[day])}
                      </span>
                      {dayDisplay.status === 'content' ? (
                        <div className="text-[15px] leading-relaxed text-foreground/85">
                          {dayDisplay.dishes.length > 0 && (
                            <ul>
                              {dayDisplay.dishes.map((dish, i) => (
                                <li key={i} data-testid="lunch-dish">
                                  {dish}
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
                        <span data-testid="lunch-placeholder" className="text-[15px] leading-relaxed text-foreground/85">
                          {t('lunchPlaceholder')}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 text-xs text-muted-foreground">
                {t('lunchUpdatedAt', { date: formatUpdatedAt(display.updatedAt) })}
              </p>
            </>
          )}

          <Separator className="mt-10" />

          <p className="mt-6 text-sm text-muted-foreground">
            {t('lunchHoursAndPriceNote')}
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
