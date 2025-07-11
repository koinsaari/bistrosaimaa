import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bistro Saimaa - Makuelämyksiä Saimaan läheisyydessä',
  description:
    'Bistro Saimaa tarjoaa laadukasta ruokaa ja sydämellisestä palvelua kauniissa Ristiinan maisemissa. Kabinetit, pitopalvelut ja à la carte -menu.',
  keywords: 'bistro, ravintola, saimaa, ristiina, ruoka, kabinetti, pitopalvelu, mikkeli, lounas',
  authors: [{ name: 'Aaro Koinsaari' }],
  creator: 'Aaro Koinsaari',
  publisher: 'Bistro Saimaa',
  openGraph: {
    title: 'Bistro Saimaa - Makuelämyksiä Saimaan läheisyydessä',
    description:
      'Bistro Saimaa tarjoaa laadukasta ruokaa ja sydämellisestä palvelua kauniissa Ristiinan maisemissa.',
    url: 'https://bistrosaimaa.fi',
    siteName: 'Bistro Saimaa',
    locale: 'fi_FI',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavigationBar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
