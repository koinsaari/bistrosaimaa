'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star, Utensils, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import GalleryPreviewSection from './GalleryPreviewSection';

const HeroSection = () => {
  const t = useTranslations('HomePage');

  return (
    <div
      id="home-hero"
      data-testid="home-hero"
      className="text-white relative overflow-hidden min-h-screen flex items-center justify-center"
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/gallery/interior-4.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 relative z-10 py-32">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">{t('title')}</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow-md">{t('subtitle')}</p>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto drop-shadow-md">
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/menu">
                <Utensils className="mr-2 h-5 w-5" />
                {t('exploreMenu')}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white !bg-transparent !text-white hover:!bg-primary hover:!text-white hover:!border-primary"
            >
              <Link href="/contact">
                <Calendar className="mr-2 h-5 w-5" />
                {t('makeReservation')}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeaturedSection = () => {
  const t = useTranslations('HomePage');
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} data-testid="home-offerings" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {t('ourOfferings')}
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="w-full md:flex-1 max-w-sm"
          >
            <Card
              data-testid="offering-card-menu"
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border-primary/20 p-0"
              style={{
                boxShadow:
                  '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 20px rgba(93, 138, 122, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
              <div className="h-64 overflow-hidden relative">
                <Image
                  src="/gallery/food-3.jpeg"
                  alt="À la carte menu"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent
                className="p-6 text-center flex-1 flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f1 100%)',
                }}
              >
                <CardTitle className="text-foreground font-bold mb-2">{t('menuTitle')}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 flex-1">
                  {t('menuDescription')}
                </CardDescription>
                <Button asChild className="bg-primary hover:bg-primary/90 mt-auto">
                  <Link href="/menu">{t('viewMenu')}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="w-full md:flex-1 max-w-sm"
          >
            <Card
              data-testid="offering-card-lunch"
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border-primary/20 p-0"
              style={{
                boxShadow:
                  '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 20px rgba(93, 138, 122, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
              <div className="h-64 overflow-hidden relative">
                <Image
                  src="/gallery/food-1.jpeg"
                  alt="Lounas"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent
                className="p-6 text-center flex-1 flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f1 100%)',
                }}
              >
                <CardTitle className="text-foreground font-bold mb-2">{t('lunchTitle')}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 flex-1">
                  {t('lunchDescription')}
                </CardDescription>
                <Button asChild className="bg-primary hover:bg-primary/90 mt-auto">
                  <a
                    href="https://www.facebook.com/bistrosaimaa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t('viewLunchFacebook')}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -5 }}
            className="w-full md:flex-1 max-w-sm"
          >
            <Card
              data-testid="offering-card-catering"
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border-primary/20 p-0"
              style={{
                boxShadow:
                  '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 20px rgba(93, 138, 122, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
              <div className="h-64 overflow-hidden relative">
                <Image
                  src="/gallery/food-4.jpeg"
                  alt="Pitopalvelut"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent
                className="p-6 text-center flex-1 flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f1 100%)',
                }}
              >
                <CardTitle className="text-foreground font-bold mb-2">
                  {t('cateringTitle')}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4 flex-1">
                  {t('cateringDescription')}
                </CardDescription>
                <Button asChild className="bg-primary hover:bg-primary/90 mt-auto">
                  <Link href="/contact">{t('askMore')}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ReviewsSection = () => {
  const t = useTranslations('HomePage');

  const reviews = [
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

  return (
    <section
      data-testid="home-reviews"
      className="relative py-24 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(93, 138, 122, 0.2) 0%, rgba(93, 138, 122, 0.08) 30%, rgba(248, 246, 241, 0.9) 60%, #f8f6f1 100%)',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-16 text-foreground">{t('reviews')}</h2>

        <div className="max-w-4xl mx-auto">
          <Carousel
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem key={review.id}>
                  <div className="p-1">
                    <Card
                      className="h-80 md:h-80 min-h-[400px] md:min-h-0 border-primary/20 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f1 100%)',
                        boxShadow:
                          '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 20px rgba(93, 138, 122, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <CardContent className="p-6 md:p-8 h-full flex flex-col justify-center overflow-y-auto">
                        <div className="flex flex-col items-center text-center">
                          <div className="text-4xl md:text-5xl text-primary font-serif leading-none mb-4 md:mb-6 drop-shadow-lg">
                            ❝
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="text-base md:text-lg lg:text-xl text-foreground mb-4 md:mb-6 italic leading-relaxed">
                              &ldquo;{review.quote}&rdquo;
                            </p>
                          </div>

                          <div className="mb-4 text-xl">
                            {[...Array(review.rating)].map((_, i) => (
                              <span key={i} className="mx-0.5">
                                ⭐️
                              </span>
                            ))}
                          </div>

                          <div>
                            <h3 className="font-semibold text-foreground text-lg">
                              {review.author}
                            </h3>
                            {review.note && (
                              <p className="text-xs text-muted-foreground italic mt-1">
                                {review.note}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-3">
                          <p className="text-xs text-muted-foreground">{t('reviewSource')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-card text-foreground hover:bg-card/80 border-border shadow-lg" />
            <CarouselNext className="bg-card text-foreground hover:bg-card/80 border-border shadow-lg" />
          </Carousel>

          {/* Google reviews link */}
          <div className="mt-8 flex justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
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
};

export default function HomePageClient() {
  return (
    <div className="font-sans bg-background">
      <HeroSection />
      <FeaturedSection />
      <GalleryPreviewSection />
      <ReviewsSection />
    </div>
  );
}
