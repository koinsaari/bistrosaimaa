/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import type { Metadata } from 'next';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
  title: 'Galleria - Bistro Saimaa',
  description:
    'Tutustu Bistro Saimaan tunnelmaan kuvagalleriamme kautta. Ravintolan sisustus, ruoka-annokset ja miljöö Saimaan rannalla.',
  keywords: 'galleria, kuvat, bistro saimaa, ravintola, ristiina, saimaa',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://bistrosaimaa.fi/gallery',
  },
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
