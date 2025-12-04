/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type Category = 'all' | 'interior' | 'outside' | 'food' | 'sauna' | 'kabinetti';

interface GalleryImage {
  src: string;
  alt: string;
  category: Exclude<Category, 'all'>;
}

const galleryImages: GalleryImage[] = [
  { src: '/gallery/interior-1.jpeg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-2.jpeg', alt: 'Restaurant atmosphere', category: 'interior' },
  { src: '/gallery/interior-3.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-4.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-5.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-6.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-7.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-8.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-9.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-10.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-11.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-12.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/interior-13.jpg', alt: 'Restaurant interior', category: 'interior' },
  { src: '/gallery/food-1.jpeg', alt: 'Lunch dish', category: 'food' },
  { src: '/gallery/food-2.jpeg', alt: 'Lunch selection', category: 'food' },
  { src: '/gallery/food-3.jpeg', alt: 'Daily special', category: 'food' },
  { src: '/gallery/food-4.jpeg', alt: 'Dessert', category: 'food' },
  { src: '/gallery/food-5.jpg', alt: 'Food', category: 'food' },
  { src: '/gallery/food-6.jpg', alt: 'Food', category: 'food' },
  { src: '/gallery/outside-1.jpg', alt: 'Outside view', category: 'outside' },
  { src: '/gallery/outside-2.jpg', alt: 'Terrace', category: 'outside' },
  { src: '/gallery/outside-3.jpg', alt: 'Lake view', category: 'outside' },
  { src: '/gallery/outside-4.jpg', alt: 'Garden area', category: 'outside' },
  { src: '/gallery/outside-5.jpg', alt: 'Entrance', category: 'outside' },
  { src: '/gallery/kabinetti-1.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-2.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-3.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-4.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-5.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-6.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-7.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-8.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-9.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-10.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-11.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/kabinetti-12.jpg', alt: 'Event room', category: 'kabinetti' },
  { src: '/gallery/sauna-1.jpg', alt: 'Sauna facilities', category: 'sauna' },
  { src: '/gallery/sauna-2.jpg', alt: 'Sauna facilities', category: 'sauna' },
  { src: '/gallery/sauna-3.jpg', alt: 'Sauna facilities', category: 'sauna' },
  { src: '/gallery/sauna-4.jpg', alt: 'Sauna facilities', category: 'sauna' },
];

const categories: Category[] = ['all', 'interior', 'kabinetti', 'sauna', 'food', 'outside'];

export default function GalleryPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const t = useTranslations('Gallery');

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return galleryImages;
    return galleryImages.filter((img) => img.category === selectedCategory);
  }, [selectedCategory]);

  const handlePrevious = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? filteredImages.length - 1 : selectedIndex - 1);
    }
  }, [selectedIndex, filteredImages.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === filteredImages.length - 1 ? 0 : selectedIndex + 1);
    }
  }, [selectedIndex, filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrevious, handleNext]);

  const getCategoryLabel = (category: Category): string => {
    const labels: Record<Category, string> = {
      all: t('categoryAll'),
      interior: t('categoryInterior'),
      outside: t('categoryOutside'),
      food: t('categoryFood'),
      sauna: t('categorySauna'),
      kabinetti: t('categoryKabinetti'),
    };
    return labels[category];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        id="gallery-hero"
        className="relative min-h-[40vh] flex items-center justify-center text-white"
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/gallery/interior-6.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 text-center relative z-10 py-20">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-primary/10 hover:border-primary hover:text-primary'
                  }`}
                >
                  {getCategoryLabel(category)}
                </Button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.src}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="aspect-square relative rounded-lg overflow-hidden cursor-pointer border border-primary/20 group"
                    style={{
                      boxShadow:
                        '0 4px 15px -3px rgba(0, 0, 0, 0.08), 0 0 10px rgba(93, 138, 122, 0.05)',
                    }}
                    onClick={() => setSelectedIndex(index)}
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
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredImages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground">{t('noImages')}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-none bg-black/95">
          <DialogTitle className="sr-only">
            {selectedIndex !== null ? filteredImages[selectedIndex].alt : 'Gallery image'}
          </DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:text-primary hover:bg-black/50 rounded-full"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Previous button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-primary hover:bg-black/50 rounded-full h-12 w-12"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
            >
              <ChevronLeft className="h-8 w-8" />
              <span className="sr-only">Previous</span>
            </Button>

            {/* Next button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-primary hover:bg-black/50 rounded-full h-12 w-12"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight className="h-8 w-8" />
              <span className="sr-only">Next</span>
            </Button>

            {/* Image */}
            {selectedIndex !== null && (
              <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4">
                <Image
                  src={filteredImages[selectedIndex].src}
                  alt={filteredImages[selectedIndex].alt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Image counter */}
            {selectedIndex !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {selectedIndex + 1} / {filteredImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
