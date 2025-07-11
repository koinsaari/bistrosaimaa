/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import { Metadata } from 'next';
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
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageClient />;
}
