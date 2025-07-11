/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import { Metadata } from 'next';
import MenuPageClient from './MenuPageClient';

export const metadata: Metadata = {
  title: 'Menu - Bistro Saimaa',
  description:
    'Tutustu Bistro Saimaan monipuoliseen menuun. Salaatit, pihvit, burgerit, pizzat ja paljon muuta.',
  keywords: 'menu, ruokalista, bistro saimaa, pizza, burger, salaatti, pihvi, ristiina',
  robots: {
    index: true,
    follow: true,
  },
};

export default function MenuPage() {
  return <MenuPageClient />;
}
