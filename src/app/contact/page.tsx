/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import ContactPageClient from './ContactPageClient';

export const metadata = {
  title: 'Ota yhteyttä - Bistro Saimaa',
  description:
    'Varaa kabinetti, tilaa pitopalvelu tai kysy lisää. Löydät yhteystietomme ja yhteydenottolomakkeen.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
