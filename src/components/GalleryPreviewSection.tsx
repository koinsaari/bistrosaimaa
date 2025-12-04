/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';

const previewImages = [
  { src: '/gallery/interior-1.jpeg', alt: 'Restaurant interior' },
  { src: '/gallery/interior-2.jpeg', alt: 'Restaurant atmosphere' },
  { src: '/gallery/food-1.jpeg', alt: 'Lunch dish' },
  { src: '/gallery/food-2.jpeg', alt: 'Lunch selection' },
  { src: '/gallery/food-3.jpeg', alt: 'Daily special' },
  { src: '/gallery/food-4.jpeg', alt: 'Dessert' },
];

export default function GalleryPreviewSection() {
  const t = useTranslations('Gallery');
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(93, 138, 122, 0.15) 0%, rgba(93, 138, 122, 0.05) 30%, rgba(248, 246, 241, 0.9) 60%, #f8f6f1 100%)',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t('title')}
        </motion.h2>

        <div className="max-w-5xl mx-auto">
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
            <CarouselContent className="-ml-4">
              {previewImages.map((image, index) => (
                <CarouselItem
                  key={image.src}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="aspect-square relative rounded-lg overflow-hidden border border-primary/20 group"
                    style={{
                      boxShadow:
                        '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 20px rgba(93, 138, 122, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-card text-foreground hover:bg-card/80 border-border shadow-lg" />
            <CarouselNext className="bg-card text-foreground hover:bg-card/80 border-border shadow-lg" />
          </Carousel>

          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/gallery">
                {t('viewGallery')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
