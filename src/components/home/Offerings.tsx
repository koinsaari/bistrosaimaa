import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';

type Offering = {
  testid: string;
  image: string;
  imageAltKey: string;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  href: '/menu' | '/contact';
};

const OFFERINGS: Offering[] = [
  {
    testid: 'offering-card-menu',
    image: '/gallery/food-13.jpeg',
    imageAltKey: 'menuImageAlt',
    titleKey: 'menuTitle',
    descriptionKey: 'menuDescription',
    ctaKey: 'viewMenu',
    href: '/menu',
  },
  {
    testid: 'offering-card-catering',
    image: '/gallery/food-37.jpeg',
    imageAltKey: 'cateringImageAlt',
    titleKey: 'cateringTitle',
    descriptionKey: 'cateringDescription',
    ctaKey: 'askMore',
    href: '/contact',
  },
];

export default async function Offerings() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return (
    <section data-testid="home-offerings" className="bg-background py-20 md:py-28">
      <Reveal className="container mx-auto px-6">
        <header className="mb-12 text-center">
          <p className="mb-3 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            <WaterLine variant="inline" />
            <span>{t('ourOfferings')}</span>
            <WaterLine variant="inline" />
          </p>
          <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.5rem)] text-ink">
            {t('ourOfferings')}
          </h2>
        </header>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {OFFERINGS.map((o) => (
            <Card
              key={o.testid}
              data-testid={o.testid}
              className="group flex h-full flex-col overflow-hidden border-primary/20 p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden md:h-64">
                <Image
                  src={o.image}
                  alt={t(o.imageAltKey)}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <CardContent className="flex flex-1 flex-col bg-gradient-to-br from-white to-background p-7 text-center">
                <h3 className="mb-2 font-serif text-2xl font-medium text-ink">{t(o.titleKey)}</h3>
                <p className="mb-6 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                  {t(o.descriptionKey)}
                </p>
                <Button asChild className="mt-auto rounded-full bg-primary hover:bg-primary/90">
                  <Link href={o.href}>{t(o.ctaKey)}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
