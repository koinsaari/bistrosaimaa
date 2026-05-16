'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import WaterLine from '@/components/WaterLine';

type Category = 'all' | 'interior' | 'outside' | 'food' | 'sauna' | 'kabinetti';

interface GalleryImage {
  src: string;
  altKey: string;
  category: Exclude<Category, 'all'>;
}

const galleryImages: GalleryImage[] = [
  { src: '/gallery/interior-1.jpeg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-2.jpeg', altKey: 'atmosphere', category: 'interior' },
  { src: '/gallery/interior-3.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-4.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-5.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-6.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-7.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-8.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-9.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-10.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-11.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-12.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/interior-13.jpg', altKey: 'interior', category: 'interior' },
  { src: '/gallery/food-13.jpeg', altKey: 'salmonSpread', category: 'food' },
  { src: '/gallery/food-30.jpeg', altKey: 'cateringBuffet', category: 'food' },
  { src: '/gallery/food-37.jpeg', altKey: 'cateringSpread', category: 'food' },
  { src: '/gallery/food-1.jpeg', altKey: 'salmonPlatter', category: 'food' },
  { src: '/gallery/food-18.jpeg', altKey: 'cateringBuffet', category: 'food' },
  { src: '/gallery/food-27.jpeg', altKey: 'salmonSpread', category: 'food' },
  { src: '/gallery/food-35.jpeg', altKey: 'cateringCenterpiece', category: 'food' },
  { src: '/gallery/food-40.jpeg', altKey: 'cateringSpread', category: 'food' },
  { src: '/gallery/food-5.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-34.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-38.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-22.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-26.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-29.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-31.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-33.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-39.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-41.jpeg', altKey: 'lunchBuffet', category: 'food' },
  { src: '/gallery/food-7.jpeg', altKey: 'saladSelection', category: 'food' },
  { src: '/gallery/food-8.jpeg', altKey: 'saladSelection', category: 'food' },
  { src: '/gallery/food-17.jpeg', altKey: 'saladSelection', category: 'food' },
  { src: '/gallery/food-21.jpeg', altKey: 'saladSelection', category: 'food' },
  { src: '/gallery/food-25.jpeg', altKey: 'saladSelection', category: 'food' },
  { src: '/gallery/food-36.jpeg', altKey: 'saladSelection', category: 'food' },
  { src: '/gallery/food-3.jpeg', altKey: 'saladSelection', category: 'food' },
  { src: '/gallery/food-2.jpeg', altKey: 'buffetLine', category: 'food' },
  { src: '/gallery/food-10.jpeg', altKey: 'buffetHall', category: 'food' },
  { src: '/gallery/food-4.jpeg', altKey: 'chocolateDesserts', category: 'food' },
  { src: '/gallery/food-12.jpeg', altKey: 'desserts', category: 'food' },
  { src: '/gallery/food-19.jpeg', altKey: 'chocolateDesserts', category: 'food' },
  { src: '/gallery/food-20.jpeg', altKey: 'chocolateDesserts', category: 'food' },
  { src: '/gallery/food-14.jpeg', altKey: 'cake', category: 'food' },
  { src: '/gallery/food-28.jpeg', altKey: 'cake', category: 'food' },
  { src: '/gallery/food-32.jpeg', altKey: 'cake', category: 'food' },
  { src: '/gallery/food-6.jpeg', altKey: 'cookies', category: 'food' },
  { src: '/gallery/food-9.jpeg', altKey: 'eventTable', category: 'food' },
  { src: '/gallery/food-11.jpeg', altKey: 'eventMenu', category: 'food' },
  { src: '/gallery/food-15.jpeg', altKey: 'eventTable', category: 'food' },
  { src: '/gallery/food-16.jpeg', altKey: 'eventTable', category: 'food' },
  { src: '/gallery/food-23.jpeg', altKey: 'eventTable', category: 'food' },
  { src: '/gallery/food-24.jpeg', altKey: 'buffetLine', category: 'food' },
  { src: '/gallery/food-42.jpeg', altKey: 'eventTable', category: 'food' },
  { src: '/gallery/outside-1.jpg', altKey: 'outside', category: 'outside' },
  { src: '/gallery/outside-2.jpg', altKey: 'terrace', category: 'outside' },
  { src: '/gallery/outside-3.jpg', altKey: 'lake', category: 'outside' },
  { src: '/gallery/outside-4.jpg', altKey: 'garden', category: 'outside' },
  { src: '/gallery/outside-5.jpg', altKey: 'entrance', category: 'outside' },
  { src: '/gallery/kabinetti-1.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-2.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-3.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-4.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-5.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-6.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-7.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-8.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-9.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-10.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-11.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/kabinetti-12.jpg', altKey: 'kabinetti', category: 'kabinetti' },
  { src: '/gallery/sauna-1.jpg', altKey: 'sauna', category: 'sauna' },
  { src: '/gallery/sauna-2.jpg', altKey: 'sauna', category: 'sauna' },
  { src: '/gallery/sauna-3.jpg', altKey: 'sauna', category: 'sauna' },
  { src: '/gallery/sauna-4.jpg', altKey: 'sauna', category: 'sauna' },
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
      {/* Page header */}
      <div
        id="gallery-hero"
        className="container mx-auto px-6 pt-32 pb-12 md:pt-40 md:pb-16"
      >
        <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          <WaterLine variant="inline" />
          <span>{t('subtitle')}</span>
        </p>
        <h1 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4.5vw,3.5rem)] text-ink">
          {t('title')}
        </h1>
        <div className="mt-10">
          <WaterLine variant="divider" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="py-8">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-1 rounded-full bg-muted/50 p-1 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-[13px] transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground'
                    : 'text-foreground hover:bg-background hover:text-primary'
                }`}
              >
                {getCategoryLabel(category)}
              </Button>
            ))}
          </motion.div>
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
                    data-testid="gallery-image" className="aspect-square relative rounded-lg overflow-hidden cursor-pointer border border-primary/20 group"
                    style={{
                      boxShadow:
                        '0 4px 15px -3px rgba(0, 0, 0, 0.08), 0 0 10px rgba(93, 138, 122, 0.05)',
                    }}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <Image
                      src={image.src}
                      alt={t(`alt.${image.altKey}`)}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={index === 0}
                      loading={index === 0 ? undefined : 'lazy'}
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
        <DialogContent aria-describedby={undefined} className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-none bg-black/95">
          <DialogTitle className="sr-only">
            {selectedIndex !== null ? t(`alt.${filteredImages[selectedIndex].altKey}`) : t('title')}
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
              data-testid="lightbox-prev" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-primary hover:bg-black/50 rounded-full h-12 w-12"
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
              data-testid="lightbox-next" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-primary hover:bg-black/50 rounded-full h-12 w-12"
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
                  alt={t(`alt.${filteredImages[selectedIndex].altKey}`)}
                  fill
                  sizes="95vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Image counter */}
            {selectedIndex !== null && (
              <div data-testid="lightbox-counter" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {selectedIndex + 1} / {filteredImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
