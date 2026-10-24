import Image from 'next/image';
import { connection } from 'next/server';
import { DateTime } from 'luxon';
import { getLocale, getTranslations } from 'next-intl/server';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';
import { BUSINESS } from '@/lib/business';

const POSTER = '/events/isanpaiva-2026.jpg';
// The section disappears once the buffet closes.
const ENDS_AT = DateTime.fromObject({ year: 2026, month: 11, day: 8, hour: 16 }, { zone: 'Europe/Helsinki' });

export default async function FathersDayMenu() {
  // Per request, so the section hides on time even if the page is ever prerendered.
  await connection();
  if (DateTime.now() >= ENDS_AT) return null;

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return (
    <section data-testid="home-fathers-day" className="relative bg-muted/40 py-20 md:py-28">
      <Reveal className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <a href={POSTER} target="_blank" rel="noopener noreferrer" className="block">
              <div className="relative mx-auto aspect-[1117/1584] w-full max-w-md overflow-hidden rounded-xl shadow-sm">
                <Image
                  src={POSTER}
                  alt={t('fathersDayPosterAlt')}
                  fill
                  sizes="(max-width: 767px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </a>
          </div>
          <div className="md:col-span-7">
            <p className="mb-5 flex items-center gap-3 text-eyebrow font-semibold uppercase tracking-[0.2em] text-primary">
              <WaterLine variant="inline" />
              <span>{t('fathersDayEyebrow')}</span>
            </p>
            <h2 className="mb-5 font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
              {t('fathersDayHeading')}
            </h2>
            <p className="mb-3 font-serif italic text-xl text-ink">{t('fathersDayWhen')}</p>
            <p className="mb-7 max-w-[54ch] text-base leading-relaxed text-foreground/80 md:text-lg">
              {t('fathersDayBody')}
            </p>
            <p className="font-serif text-2xl text-ink">{t('fathersDayPrice')}</p>
            <p className="mb-8 text-base text-muted-foreground">{t('fathersDayChildPrices')}</p>
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90">
              <a href={`tel:${BUSINESS.phone.e164}`} data-testid="fathers-day-call">
                <Phone className="mr-2 h-4 w-4" />
                {t('fathersDayCall', { phone: BUSINESS.phone.national })}
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
