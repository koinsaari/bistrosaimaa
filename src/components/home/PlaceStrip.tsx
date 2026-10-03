import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Phone, Mail } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';

const PHONE_DISPLAY = '050 449 9322';

const FEATURES = [
  { testid: 'place-strip-catering', image: '/gallery/food-37.jpeg', titleKey: 'placeStripCateringTitle', bodyKey: 'placeStripCateringBody' },
  { testid: 'place-strip-kabinetti', image: '/gallery/kabinetti-9.jpg', titleKey: 'placeStripCabinetTitle', bodyKey: 'placeStripCabinetBody' },
] as const;

export default async function PlaceStrip() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return (
    <section data-testid="home-place-strip" className="relative bg-background py-24 md:py-32">
      <Reveal className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src="/gallery/outside-6.jpg"
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-6">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <WaterLine variant="inline" />
              <span>{t('placeStripEyebrow')}</span>
            </p>
            <h2 className="mb-5 font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
              {t('placeStripHeading')}
            </h2>
            <p className="mb-7 max-w-[54ch] text-base leading-relaxed text-foreground/80 md:text-[17px]">
              {t('placeStripBody')}
            </p>
            <ul className="mb-8 flex flex-col gap-4">
              {FEATURES.map((f) => (
                <li key={f.testid} data-testid={f.testid} className="flex items-center gap-5">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-lg md:size-28">
                    <Image src={f.image} alt="" fill sizes="112px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-ink">{t(f.titleKey)}</h3>
                    <p className="text-base leading-relaxed text-muted-foreground">{t(f.bodyKey)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90">
                <a href="tel:+358504499322" data-testid="place-strip-call">
                  <Phone className="mr-2 h-4 w-4" />
                  {t('placeStripCall')} {PHONE_DISPLAY}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full hover:border-primary hover:bg-background hover:text-primary"
              >
                <Link href="/contact" data-testid="place-strip-quote">
                  <Mail className="mr-2 h-4 w-4" />
                  {t('placeStripQuote')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
      <div className="container mx-auto mt-20 px-6">
        <WaterLine variant="divider" />
      </div>
    </section>
  );
}
