import { getLocale, getTranslations } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';
import { getCurrentLunchWeek } from '@/lib/lunch';
import type { LunchDay, LunchWeek } from '@/data/lunch-weeks';

const DAY_KEYS: Array<{ key: keyof LunchWeek; messageKey: string }> = [
  { key: 'monday', messageKey: 'lunchDay.monday' },
  { key: 'tuesday', messageKey: 'lunchDay.tuesday' },
  { key: 'wednesday', messageKey: 'lunchDay.wednesday' },
  { key: 'thursday', messageKey: 'lunchDay.thursday' },
  { key: 'friday', messageKey: 'lunchDay.friday' },
];

export default async function LunchThisWeek() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const { week, isoWeek } = getCurrentLunchWeek();
  const langKey: 'fi' | 'en' = locale === 'fi' ? 'fi' : 'en';

  const renderItems = (day: LunchDay) => day.items.map((item) => item[langKey]).join(' · ');

  return (
    <section className="relative bg-muted/40 py-20 md:py-28">
      <Reveal className="container mx-auto px-6">
        <header className="mb-12 max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            <WaterLine variant="inline" />
            <span>{t('lunchEyebrow')}</span>
          </p>
          <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
            {t('lunchHeading', { week: isoWeek })}
          </h2>
        </header>

        <div className="mx-auto max-w-3xl">
          <ul className="divide-y divide-border/60">
            {DAY_KEYS.map(({ key, messageKey }) => {
              const day = week[key];
              return (
                <li
                  key={key}
                  className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:gap-8 md:py-6"
                >
                  <span className="w-36 shrink-0 font-serif italic text-[15px] text-ink">
                    {t(messageKey)}
                  </span>
                  <span className="text-[15px] leading-relaxed text-foreground/85">
                    {renderItems(day)}
                  </span>
                </li>
              );
            })}
          </ul>

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
