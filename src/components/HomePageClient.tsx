/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

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

const HeroSection = () => (
  <div
    id="home-hero"
    className="text-white relative overflow-hidden min-h-screen flex items-center justify-center"
  >
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: "url('/saimaa-interior_1.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="container mx-auto px-4 relative z-10 py-32">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Bistro Saimaa</h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Makuelämyksiä Saimaan läheisyydessä
        </p>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Tervetuloa nauttimaan laadukkaasta ruoasta ja sydämellisestä palvelusta kauniissa
          Ristiinan maisemissa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/menu">
              <Utensils className="mr-2 h-5 w-5" />
              Tutustu menuun
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white !bg-transparent !text-white hover:!bg-white hover:!text-foreground"
          >
            <Link href="/contact">
              <Calendar className="mr-2 h-5 w-5" />
              Tee varaus
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  </div>
);

const FeaturedSection = () => {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Tarjontamme</h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="flex-1 max-w-sm"
          >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="/lounas_3.jpeg"
                  alt="À la carte menu"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center flex-1 flex flex-col">
                <CardTitle className="text-foreground font-bold mb-2">Menu</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 flex-1">
                  Tutustu à la carte -menuumme.
                </CardDescription>
                <Button asChild className="bg-primary hover:bg-primary/90 mt-auto">
                  <Link href="/menu">Katso menu</Link>
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
            className="flex-1 max-w-sm"
          >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="/lounas_1.jpeg"
                  alt="Lounas"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center flex-1 flex flex-col">
                <CardTitle className="text-foreground font-bold mb-2">
                  Viikoittain vaihtuva lounas
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4 flex-1">
                  Tarjoamme viikoittain vaihtuvan lounaan
                </CardDescription>
                <Button asChild className="bg-primary hover:bg-primary/90 mt-auto">
                  <a
                    href="https://www.facebook.com/bistrosaimaa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Näytä lounaslista Facebookissa
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
            className="flex-1 max-w-sm"
          >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="/kakku.jpeg"
                  alt="Pitopalvelut"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center flex-1 flex flex-col">
                <CardTitle className="text-foreground font-bold mb-2">
                  Pitopalvelut & kabinetti
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4 flex-1">
                  Ruokaa ja tarjoilua joko paikan päällä kabinetissa tai toimitettuna muualle.
                </CardDescription>
                <Button asChild className="bg-primary hover:bg-primary/90 mt-auto">
                  <Link href="/contact">Kysy lisää</Link>
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
      quote:
        'Parhaat ranskalaiset mitä ikinä syönyt nii rapeat 😋 samoin hampurilainen oli mehevä ja Hyvä 💖💖',
      author: 'Ulla H.',
      rating: 5,
    },
    {
      id: 6,
      quote:
        'Ystävällinen ja hyvä palvelu. Haettiin salaatit mukaan rantaan. Olivat hyvät ja runsaat, hyvin pakattu kuljetettavaksi, mukaan saatiin aterimet sekä leipäpalat.',
      author: 'Riitu',
      rating: 5,
    },
    {
      id: 7,
      quote: 'Erinomainen ruoka. Mukava henkilökunta.',
      author: 'Ville',
      rating: 5,
    },
    {
      id: 8,
      quote:
        'Ruoka oli hyvää ja palvelu ystävällistä. Varmasti käymme uudestaan jos Ristiinan suunnille uudestaan eksymme.',
      author: 'Mirja F.',
      rating: 5,
    },
    {
      id: 9,
      quote:
        'Enpä uskonut Ristiinasta löytäväni vegaanista ruokaa, mutta Saimaan ystävällinen henkilökunta pyöräytti neille vegeburgerit! Ja ranskalaiset ovat kyllä taivaallisia. Kiitos tästä!',
      author: 'Veikko S.',
      rating: 5,
    },
    {
      id: 10,
      quote:
        'Iso suositus paikasta! Äärettömän hyvät ateriat, aura-pekoni ateria ja Saimaan makkis-pekkikset testauksessa 🤤',
      author: 'Noora V.',
      rating: 5,
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <Image
        src="https://images.pexels.com/photos/27798098/pexels-photo-27798098/free-photo-of-lake-saimaa-1.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Lake Saimaa"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">Arvostelut</h2>

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
                    <Card className="bg-white/20 backdrop-blur-lg border-white/20 h-80">
                      <CardContent className="p-8 h-full flex flex-col justify-center">
                        <div className="flex flex-col items-center text-center">
                          <div className="text-5xl text-amber-400 font-serif leading-none mb-6">
                            ❝
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="text-lg md:text-xl text-foreground mb-6 italic leading-relaxed">
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
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-3">
                          <p className="text-xs text-muted-foreground">Lähde: Google</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 border-white/20" />
            <CarouselNext className="bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 border-white/20" />
          </Carousel>

          {/* Google reviews link */}
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              variant="secondary"
              className="bg-white/90 text-foreground hover:bg-white"
            >
              <a
                href="https://www.google.com/maps/place/Kahvila+Ravintola+Saimaa+Oy/@61.5066667,27.2560361,17z/data=!4m8!3m7!1s0x469073801b964d6d:0xa50b1dbd31d8cb94!8m2!3d61.5066667!4d27.258611!9m1!1b1!16s%2Fg%2F11dxhzpvtq"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="mr-2 h-4 w-4" />
                Jätä arvostelu Googleen
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
      <ReviewsSection />
    </div>
  );
}
