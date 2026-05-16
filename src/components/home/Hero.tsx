import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Utensils, Calendar } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import WaterLine from '@/components/WaterLine';
import { getTodayHoursKey } from '@/lib/hours';

export default async function Hero() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const tFooter = await getTranslations({ locale, namespace: 'Footer' });
  const tContact = await getTranslations({ locale, namespace: 'ContactPage' });

  const todayHours = tFooter(getTodayHoursKey());
  const address = `${tContact('addressLine1')}, ${tContact('addressLine2')}`;

  return (
    <section
      id="home-hero"
      data-testid="home-hero"
      className="relative isolate overflow-hidden"
      style={{ minHeight: 'calc(100svh - var(--nav-h))' }}
    >
      <div className="absolute inset-0 md:left-1/2">
        <Image
          src="/gallery/interior-4.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/55 md:hidden" />
      </div>

      <div className="relative grid min-h-[inherit] grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 pt-24 pb-12 md:px-12 md:py-24 lg:px-20">
          <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white md:text-primary">
            <WaterLine variant="inline" className="text-white md:text-primary" />
            <span>{t('heroEyebrow_PLACEHOLDER')}</span>
          </p>

          <h1 className="mb-6 font-serif font-normal leading-[0.98] tracking-[-0.025em] text-[clamp(2.75rem,7vw,5.25rem)] text-white md:text-ink [text-shadow:0_2px_24px_rgba(0,0,0,0.35)] md:[text-shadow:none]">
            {t.rich('heroTitle_PLACEHOLDER', {
              i: (chunks) => (
                <em className="font-light italic text-white/95 md:text-primary">{chunks}</em>
              ),
            })}
          </h1>

          <p className="mb-9 max-w-[40ch] text-lg leading-relaxed text-white/95 md:text-foreground/85">
            {t('heroLead_PLACEHOLDER')}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90">
              <Link href="/menu">
                <Utensils className="mr-2 h-5 w-5" />
                {t('exploreMenu')}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/70 !bg-transparent !text-white hover:!bg-white hover:!text-foreground md:border-border md:!text-foreground md:hover:!bg-muted"
            >
              <Link href="/contact">
                <Calendar className="mr-2 h-5 w-5" />
                {t('makeReservation')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden md:block" aria-hidden />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/55 to-transparent">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/95">
          <span>{address}</span>
          <span>
            {t('todayOpenLabel')} {todayHours}
          </span>
        </div>
      </div>
    </section>
  );
}
