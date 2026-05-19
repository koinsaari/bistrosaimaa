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
      <div className="absolute inset-0">
        <Image
          src="/gallery/interior-4.jpg"
          alt=""
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(15,31,28,0.35) 0%, rgba(15,31,28,0.6) 70%, rgba(15,31,28,0.78) 100%)',
          }}
        />
      </div>

      <div className="relative flex min-h-[inherit] items-center justify-center px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center text-white">
          <p className="mb-6 flex items-center justify-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
            <WaterLine variant="inline" className="text-white/70" />
            <span>{t('heroEyebrow')}</span>
            <WaterLine variant="inline" className="text-white/70" />
          </p>

          <h1 className="mb-6 font-serif font-normal leading-[0.98] tracking-[-0.02em] text-[clamp(2.75rem,7vw,5.5rem)] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
            {t.rich('heroTitle', {
              i: (chunks) => (
                <em className="font-semibold italic text-white">{chunks}</em>
              ),
            })}
          </h1>

          <p className="mx-auto mb-10 max-w-[52ch] text-base leading-relaxed text-white/90 md:text-lg">
            {t('heroLead')}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
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
              className="rounded-full border-white/60 !bg-transparent !text-white hover:!bg-white hover:!text-foreground"
            >
              <Link href="/contact">
                <Calendar className="mr-2 h-5 w-5" />
                {t('makeReservation')}
              </Link>
            </Button>
          </div>
        </div>
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
