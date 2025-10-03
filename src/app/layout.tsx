import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
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
  metadataBase: new URL('https://bistrosaimaa.fi'),
  title: 'Bistro Saimaa - Ravintola, kabinetit ja pitopalvelut',
  description:
    'Täyden palvelun ravintola Ristiinassa: pitopalvelut koko Etelä-Savossa, kabinetit tilaisuuksiin ja upea sijainti Saimaan rannalla.',
  keywords:
    'bistro, ravintola, saimaa, ristiina, ruoka, kabinetti, pitopalvelu, mikkeli, lounas, etelä-savo',
  authors: [{ name: 'Aaro Koinsaari' }],
  creator: 'Aaro Koinsaari',
  publisher: 'Bistro Saimaa',
  openGraph: {
    title: 'Bistro Saimaa - Ravintola, kabinetit ja pitopalvelut',
    description:
      'Täyden palvelun ravintola Ristiinassa: pitopalvelut koko Etelä-Savossa, kabinetit tilaisuuksiin ja upea sijainti Saimaan rannalla.',
    url: 'https://bistrosaimaa.fi',
    siteName: 'Bistro Saimaa',
    locale: 'fi_FI',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://bistrosaimaa.fi',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Bistro Saimaa',
    image: 'https://bistrosaimaa.fi/logo-saimaa.png',
    '@id': 'https://bistrosaimaa.fi',
    url: 'https://bistrosaimaa.fi',
    telephone: '+358504499322',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Brahentie 42',
      addressLocality: 'Ristiina',
      postalCode: '52300',
      addressCountry: 'FI',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 61.5066667,
      longitude: 27.258611,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '11:00',
        closes: '20:00',
      },
    ],
    servesCuisine: 'Finnish',
    acceptsReservations: 'True',
    menu: 'https://bistrosaimaa.fi/menu',
    sameAs: ['https://www.facebook.com/bistrosaimaaoy'],
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            <NavigationBar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Analytics />
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
