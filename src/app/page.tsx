/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import HomePageClient from '@/components/HomePageClient';

export const metadata = {
  title: 'Bistro Saimaa - Makuelämyksiä Saimaan rannalla',
  description:
    'Tervetuloa Bistro Saimaalle nauttimaan laadukkaasta ruoasta ja sydämellisestä palvelusta kauniissa Ristiinan maisemissa. Kabinetit ja pitopalvelut.',
  keywords: 'bistro, ravintola, saimaa, ristiina, ruoka, kabinetti, pitopalvelu, mikkeli',
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
