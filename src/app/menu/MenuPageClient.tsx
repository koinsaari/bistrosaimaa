/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslations } from 'next-intl';

const menuPhotosFi = [
  {
    id: 1,
    src: '/menu-1.jpg',
    alt: 'Menu 1',
  },
  {
    id: 2,
    src: '/menu-2.jpg',
    alt: 'Menu 2',
  },
  {
    id: 3,
    src: '/menu-3.jpg',
    alt: 'Menu 3',
  },
  {
    id: 4,
    src: '/menu-4.jpg',
    alt: 'Menu 4',
  },
  {
    id: 5,
    src: '/menu-5.jpg',
    alt: 'Menu 5',
  },
  {
    id: 6,
    src: '/menu-6.jpg',
    alt: 'Menu 6',
  },
];

const menuPhotosEn = [
  {
    id: 1,
    src: '/menu-1-en.jpg',
    alt: 'Menu 1',
  },
  {
    id: 2,
    src: '/menu-2-en.jpg',
    alt: 'Menu 2',
  },
  {
    id: 3,
    src: '/menu-3-en.jpg',
    alt: 'Menu 3',
  },
  {
    id: 4,
    src: '/menu-4-en.jpg',
    alt: 'Menu 4',
  },
  {
    id: 5,
    src: '/menu-5-en.jpg',
    alt: 'Menu 5',
  },
  {
    id: 6,
    src: '/menu-6-en.jpg',
    alt: 'Menu 6',
  },
];

export default function MenuPageClient() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const { language } = useLanguage();
  const t = useTranslations('MenuPage');

  const menuPhotos = language === 'en' ? menuPhotosEn : menuPhotosFi;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const menuSection = e.currentTarget;
    const rect = menuSection.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    const distance = 300; // How far the glow center moves
    const glowX = centerX + Math.cos(angle) * distance;
    const glowY = centerY + Math.sin(angle) * distance;

    setMousePosition({ x: glowX, y: glowY });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        id="menu-hero"
        className="relative min-h-[40vh] flex items-center justify-center text-white"
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/gallery/food-1.jpeg')",
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

      {/* Menu Carousel */}
      <div
        className="py-8 md:py-16 relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(223, 81, 35, 0.15) 0%, rgba(223, 81, 35, 0.05) 30%, transparent 60%)',
        }}
        onMouseMove={handleMouseMove}
      >
        {/* For mobile */}
        <motion.div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(223, 81, 35, 0.25) 0%, rgba(223, 81, 35, 0.1) 40%, transparent 70%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* For desktop */}
        <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(223, 81, 35, 0.2) 0%, rgba(223, 81, 35, 0.1) 30%, transparent 60%)',
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 600px 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(223, 81, 35, 0.3) 0%, rgba(223, 81, 35, 0.15) 30%, transparent 60%)`,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 150,
            }}
          />
        </div>

        <div className="container mx-auto px-2 md:px-4 relative z-10">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg bg-gradient-to-r from-[#df5123] via-[#ff6b3d] to-[#df5123] bg-clip-text text-transparent animate-gradient"
              style={{
                backgroundSize: '200% auto',
                animation: 'gradient 8s linear infinite',
              }}
            >
              {t('newMenu')}
            </h2>
            <p className="text-muted-foreground">{t('newMenuSubtitle')}</p>
          </motion.div>

          <div className="max-w-2xl mx-auto md:px-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Carousel className="w-full relative" opts={{ align: 'center', loop: true }}>
                <CarouselContent className="-ml-0">
                  {menuPhotos.map((photo) => (
                    <CarouselItem key={photo.id} className="pl-0">
                      <div
                        className="relative w-full aspect-[1414/2000] max-h-[85vh] md:max-h-none rounded-lg md:border-2 md:border-primary/20 cursor-pointer transition-transform hover:scale-[1.02]"
                        style={{
                          boxShadow:
                            '0 20px 50px -10px rgba(0, 0, 0, 0.1), 0 0 30px rgba(93, 138, 122, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        }}
                        onClick={() => setSelectedImage(photo.src)}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-contain rounded-lg"
                          priority={photo.id === 1}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 shadow-lg items-center justify-center" />
                <CarouselNext className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 shadow-lg items-center justify-center" />
              </Carousel>
            </motion.div>

            {/* Instructions */}
            <motion.div
              className="text-center mt-8 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-muted-foreground">
                <span className="hidden md:inline">{t('instructionsDesktop')}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">{t('priceInfo')}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors p-2 rounded-full bg-black/50 hover:bg-black/70 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label="Close fullscreen"
          >
            <X className="h-8 w-8" />
          </button>
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={selectedImage} alt="Menu fullscreen" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
