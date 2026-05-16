import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';

const MAPS_URL =
  'https://www.google.com/maps/place/Kahvila+Ravintola+Saimaa+Oy/@61.5066667,27.2560361,17z/data=!4m8!3m7!1s0x469073801b964d6d:0xa50b1dbd31d8cb94!8m2!3d61.5066667!4d27.258611!9m1!1b1!16s%2Fg%2F11dxhzpvtq';

export default async function LocationStrip() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const tContact = await getTranslations({ locale, namespace: 'ContactPage' });
  const tFooter = await getTranslations({ locale, namespace: 'Footer' });

  return (
    <section className="relative bg-primary/5 py-20 md:py-28">
      <Reveal className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <WaterLine variant="inline" />
              <span>{t('locationEyebrow')}</span>
            </p>
            <h2 className="mb-5 font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
              {t.rich('locationHeading_PLACEHOLDER', {
                i: (chunks) => (
                  <em className="font-light italic text-primary">{chunks}</em>
                ),
              })}
            </h2>
            <p className="mb-8 max-w-[48ch] text-[15px] leading-relaxed text-foreground/80">
              {t('locationBody_PLACEHOLDER')}
            </p>

            <dl className="mb-8 space-y-3 text-[14px] text-foreground/85">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-medium text-muted-foreground">
                  {tContact('address')}
                </dt>
                <dd>
                  {tContact('addressLine1')}, {tContact('addressLine2')}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-medium text-muted-foreground">
                  {tFooter('monFri')}
                </dt>
                <dd>{tFooter('monFriHours')}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-medium text-muted-foreground">
                  {tFooter('saturday')}
                </dt>
                <dd>{tFooter('saturdayHours')}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-medium text-muted-foreground">
                  {tFooter('sunday')}
                </dt>
                <dd>{tFooter('sundayHours')}</dd>
              </div>
            </dl>

            <Button asChild className="w-full rounded-full bg-primary hover:bg-primary/90 sm:w-auto">
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                <MapPin className="mr-2 h-4 w-4" />
                {t('locationMapCta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:aspect-[5/4]">
            <Image
              src="/gallery/outside-4.jpg"
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
