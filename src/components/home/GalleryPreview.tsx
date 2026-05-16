import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import WaterLine from '@/components/WaterLine';
import Reveal from '@/components/Reveal';
import GalleryPreviewCarousel from '@/components/home/GalleryPreviewCarousel';

const PREVIEW_TILES: Array<{ src: string; altKey: string }> = [
  { src: '/gallery/interior-7.jpg', altKey: 'interior' },
  { src: '/gallery/food-9.jpeg', altKey: 'food' },
  { src: '/gallery/outside-3.jpg', altKey: 'outside' },
  { src: '/gallery/kabinetti-2.jpg', altKey: 'kabinetti' },
  { src: '/gallery/food-22.jpeg', altKey: 'food2' },
  { src: '/gallery/interior-4.jpg', altKey: 'interior2' },
  { src: '/gallery/food-1.jpeg', altKey: 'food3' },
];

export default async function GalleryPreview() {
  const tGallery = await getTranslations('Gallery');

  const tiles = PREVIEW_TILES.map((tile) => ({
    src: tile.src,
    alt: tGallery(`alt.${tile.altKey}`),
  }));

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
      </Reveal>

      <GalleryPreviewCarousel tiles={tiles} />

      <div className="container mx-auto mt-20 px-6">
        <WaterLine variant="divider" />
      </div>
    </section>
  );
}
