/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Ota yhteyttä - Bistro Saimaa',
  description:
    'Varaa kabinetti, tilaa pitopalvelu tai kysy lisää. Löydät yhteystietomme ja yhteydenottolomakkeen.',
  keywords: 'ota yhteyttä, bistro saimaa, kabinettivaraus, pitopalvelutilaus, ristiina, ravintola',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://bistrosaimaa.fi/contact',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
