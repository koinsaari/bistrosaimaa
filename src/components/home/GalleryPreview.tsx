import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';

const PREVIEW_TILES: Array<{ src: string; altKey: string; ratio: string }> = [
  { src: '/gallery/interior-7.jpg', altKey: 'interior', ratio: 'aspect-[4/5]' },
  { src: '/gallery/food-9.jpeg', altKey: 'atmosphere', ratio: 'aspect-square' },
  { src: '/gallery/outside-3.jpg', altKey: 'outside', ratio: 'aspect-[4/5]' },
  { src: '/gallery/kabinetti-2.jpg', altKey: 'kabinetti', ratio: 'aspect-square' },
  { src: '/gallery/food-22.jpeg', altKey: 'atmosphere', ratio: 'aspect-[4/5]' },
];

export default async function GalleryPreview() {
  const locale = await getLocale();
  const tGallery = await getTranslations({ locale, namespace: 'Gallery' });

  return (
    <section className="bg-background py-20 md:py-28">
      <Reveal className="container mx-auto px-6">
        <header className="mb-10 flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <WaterLine variant="inline" />
              <span>{tGallery('subtitle')}</span>
            </p>
            <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
              {tGallery('title')}
            </h2>
          </div>
          <Button
            asChild
            variant="ghost"
            className="rounded-full text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/gallery" className="flex items-center">
              {tGallery('viewGallery')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {PREVIEW_TILES.map((tile, i) => (
            <Link
              key={tile.src}
              href="/gallery"
              className={`group relative overflow-hidden rounded-lg ${tile.ratio} ${
                i >= 4 ? 'hidden md:block' : ''
              }`}
            >
              <Image
                src={tile.src}
                alt={tGallery(`alt.${tile.altKey}`)}
                fill
                sizes="(max-width: 767px) 50vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </Link>
          ))}
        </div>
      </Reveal>
      <div className="container mx-auto mt-20 px-6">
        <WaterLine variant="divider" />
      </div>
    </section>
  );
}
