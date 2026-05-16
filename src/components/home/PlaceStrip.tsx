import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';

export default async function PlaceStrip() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return (
    <section className="relative bg-background py-24 md:py-32">
      <Reveal className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
              <Image
                src="/gallery/outside-1.jpg"
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-5">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <WaterLine variant="inline" />
              <span>{t('placeStripEyebrow_PLACEHOLDER')}</span>
            </p>
            <h2 className="mb-5 font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
              {t.rich('placeStripHeading_PLACEHOLDER', {
                i: (chunks) => (
                  <em className="font-light italic text-primary">{chunks}</em>
                ),
              })}
            </h2>
            <p className="max-w-[50ch] text-[15px] leading-relaxed text-foreground/80">
              {t('placeStripBody_PLACEHOLDER')}
            </p>
          </div>
        </div>
      </Reveal>
      <div className="container mx-auto mt-20 px-6">
        <WaterLine variant="divider" />
      </div>
    </section>
  );
}
