'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type Tile = { src: string; alt: string };

export default function GalleryPreviewCarousel({ tiles }: { tiles: Tile[] }) {
  return (
    <>
      {/* Mobile: native horizontal scroll-snap */}
      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tiles.map((tile) => (
            <Link
              key={tile.src}
              href="/gallery"
              className="relative aspect-[4/5] w-[78%] flex-none snap-start overflow-hidden rounded-lg"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="78vw"
                className="object-cover"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: shadcn Carousel */}
      <div className="hidden md:block">
        <div className="container mx-auto px-6">
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {tiles.map((tile) => (
                <CarouselItem
                  key={tile.src}
                  className="basis-1/2 pl-4 lg:basis-1/3"
                >
                  <Link
                    href="/gallery"
                    className="group relative block aspect-[4/5] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={tile.src}
                      alt={tile.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-border bg-card text-foreground shadow-lg hover:bg-card/80" />
            <CarouselNext className="border-border bg-card text-foreground shadow-lg hover:bg-card/80" />
          </Carousel>
        </div>
      </div>
    </>
  );
}
