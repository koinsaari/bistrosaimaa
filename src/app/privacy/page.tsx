/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import type { Metadata } from 'next';
import PrivacyPolicyPageClient from './PrivacyPolicyPageClient';

export const metadata: Metadata = {
  title: 'Tietosuojaseloste - Bistro Saimaa',
  description:
    'Bistro Saimaan tietosuojaseloste. Lue miten käsittelemme henkilötietojasi yhteydenottolomakkeen kautta.',
  keywords: 'tietosuoja, tietosuojaseloste, henkilötiedot, bistro saimaa, gdpr',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://bistrosaimaa.fi/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageClient />;
}
