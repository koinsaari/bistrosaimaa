/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import type { Metadata } from 'next';
import HomePageClient from '@/components/HomePageClient';

export const metadata: Metadata = {
  title: 'Bistro Saimaa - Ravintola, kabinetit ja pitopalvelut',
  description:
    'Täyden palvelun ravintola Ristiinassa: pitopalvelut koko Etelä-Savossa, kabinetit tilaisuuksiin ja upea sijainti Saimaan rannalla.',
  keywords:
    'bistro, ravintola, saimaa, ristiina, ruoka, kabinetti, pitopalvelu, mikkeli, lounas, etelä-savo',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://bistrosaimaa.fi',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
