'use client';

import { Star, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import WaterLine from '@/components/WaterLine';

type Review = {
  id: number;
  quote: string;
  author: string;
  rating: number;
  note?: string;
};

// Pasted verbatim from src/components/HomePageClient.tsx — DO NOT REWORD.
const reviews: Review[] = [
  {
    id: 1,
    quote:
      'Hinta ja laatu on tässä paikassa kohdallaan käyn säännöllisesti kahvilla sekä syömässä',
    author: 'Teuvo R.',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'Kiva paikka Ristiinan venesataman vieressä. Hyvää kotiruokaa lounasbuffasta tai tilaamalla menulta ja viihtyisä tunnelma. Ei kannata ohittaa paikkaa, vaikka onkin ulospäin vähän huomaamaton',
    author: 'P.K.',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'Mukava, rauhallinen paikka. Ystävällinen henkilökunta ja hyvä palvelu. Helppo löytää.',
    author: 'Heimo T.',
    rating: 5,
  },
  {
    id: 4,
    quote: 'Erittäin hyvä ruokapaikka ja hinnat maltilliset.',
    author: 'Jesse J.',
    rating: 4,
  },
  {
    id: 5,
    quote: 'Todella kiva viihtyisä ja hyvä ruoka, 10 pistettä!',
    author: 'Mirja H.',
    rating: 1,
    note: '(10 pistettä mutta 1 tähti?? Varmaan tarkoitti että ihan ykkösravintola 😉)',
  },
  {
    id: 6,
    quote:
      'Parhaat ranskalaiset mitä ikinä syönyt nii rapeat 😋 samoin hampurilainen oli mehevä ja Hyvä 💖💖',
    author: 'Ulla H.',
    rating: 5,
  },
  {
    id: 7,
    quote:
      'Ystävällinen ja hyvä palvelu. Haettiin salaatit mukaan rantaan. Olivat hyvät ja runsaat, hyvin pakattu kuljetettavaksi, mukaan saatiin aterimet sekä leipäpalat.',
    author: 'Riitu',
    rating: 5,
  },
  {
    id: 8,
    quote: 'Erinomainen ruoka. Mukava henkilökunta.',
    author: 'Ville',
    rating: 5,
  },
  {
    id: 9,
    quote:
      'Ruoka oli hyvää ja palvelu ystävällistä. Varmasti käymme uudestaan jos Ristiinan suunnille uudestaan eksymme.',
    author: 'Mirja F.',
    rating: 5,
  },
  {
    id: 10,
    quote:
      'Enpä uskonut Ristiinasta löytäväni vegaanista ruokaa, mutta Saimaan ystävällinen henkilökunta pyöräytti neille vegeburgerit! Ja ranskalaiset ovat kyllä taivaallisia. Kiitos tästä!',
    author: 'Veikko S.',
    rating: 5,
  },
  {
    id: 11,
    quote:
      'Iso suositus paikasta! Äärettömän hyvät ateriat, aura-pekoni ateria ja Saimaan makkis-pekkikset testauksessa 🤤',
    author: 'Noora V.',
    rating: 5,
  },
];

export default function Reviews() {
  const t = useTranslations('HomePage');

  return (
    <section
      data-testid="home-reviews"
      className="relative overflow-hidden py-24"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(93, 138, 122, 0.18) 0%, rgba(93, 138, 122, 0.06) 35%, rgba(248, 246, 241, 0.9) 65%, #f8f6f1 100%)',
      }}
    >
      <div className="container mx-auto px-6">
        <header className="mb-12 text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            <WaterLine variant="inline" />
            <span>{t('reviews')}</span>
            <WaterLine variant="inline" />
          </p>
          <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3vw,2.75rem)] text-ink">
            {t('reviews')}
          </h2>
        </header>

        <div className="mx-auto max-w-4xl">
          <Carousel
            plugins={[Autoplay({ delay: 5000 })]}
            opts={{ align: 'start', loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem key={review.id}>
                  <div className="p-1">
                    <Card className="relative h-[26rem] overflow-hidden border-primary/20 bg-gradient-to-br from-white to-background card-shadow md:aspect-auto md:h-80">
                      <CardContent className="flex h-full flex-col items-center justify-center overflow-y-auto p-6 text-center md:p-8">
                        <div className="mb-4 font-serif text-5xl italic leading-none text-primary md:mb-6">
                          ❝
                        </div>
                        <p className="mb-6 text-base italic leading-relaxed text-foreground md:text-lg lg:text-xl">
                          “{review.quote}”
                        </p>
                        <div className="mb-4 text-xl" aria-label={`${review.rating} stars`}>
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="mx-0.5">
                              ⭐️
                            </span>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{review.author}</h3>
                        {review.note && (
                          <p className="mt-1 text-xs italic text-muted-foreground">{review.note}</p>
                        )}
                        <p className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                          {t('reviewSource')}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-border bg-card text-foreground shadow-lg hover:bg-card/80" />
            <CarouselNext className="border-border bg-card text-foreground shadow-lg hover:bg-card/80" />
          </Carousel>

          <div className="mt-8 flex justify-center">
            <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
              <a
                href="https://www.google.com/maps/place/Kahvila+Ravintola+Saimaa+Oy/@61.5066667,27.2560361,17z/data=!4m8!3m7!1s0x469073801b964d6d:0xa50b1dbd31d8cb94!8m2!3d61.5066667!4d27.258611!9m1!1b1!16s%2Fg%2F11dxhzpvtq"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="mr-2 h-4 w-4" />
                {t('leaveReviewGoogle')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
