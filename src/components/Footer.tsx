'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer data-testid="footer" className="text-card-foreground py-12 border-t border-primary/20 gradient-dark footer-shadow">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">{t('bistroSaimaa')}</div>
            <p className="text-muted-foreground text-sm max-w-md">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full md:pl-16 max-w-2xl justify-items-center md:justify-items-start">
            {/* Contact Information */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-3 flex items-center justify-center">
                <MapPin className="mr-2 h-5 w-5" />
                {t('contactInfo')}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground inline-block text-left">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Link
                      href="https://maps.google.com/?q=Bistro+Saimaa+Ristiina"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('addressLine1')}
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Link href="tel:+358504499322" data-testid="footer-phone">+358 50 4499 322</Link>
                  </Button>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Link href="mailto:bistrosaimaa@gmail.com" data-testid="footer-email">bistrosaimaa@gmail.com</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-3 flex items-center justify-center">
                <Clock className="mr-2 h-5 w-5" />
                {t('openingHours')}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground inline-block text-left">
                <div className="flex gap-4">
                  <span className="w-16">{t('monFri')}</span>
                  <span>{t('monFriHours')}</span>
                </div>
                <div className="flex gap-4">
                  <span className="w-16">{t('saturday')}</span>
                  <span>{t('saturdayHours')}</span>
                </div>
                <div className="flex gap-4">
                  <span className="w-16">{t('sunday')}</span>
                  <span>{t('sundayHours')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-6">
            <Link
              href="https://www.facebook.com/bistrosaimaaoy"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-facebook"
              className="bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary h-12 w-12 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 6.03 4.388 11.029 10.125 11.927v-8.434H7.078v-3.493h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.493h-2.796v8.434C19.612 23.102 24 18.103 24 12.073z" />
              </svg>
            </Link>
            {/* <a href="#" className="hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a> */}
          </div>

          {/* Copyright and Privacy Policy */}
          <div className="text-center border-t border-border pt-6 w-full">
            <div className="mb-3">
              <Button
                variant="link"
                asChild
                className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
              >
                <Link href="/privacy" data-testid="footer-privacy-link">{t('privacyPolicy')}</Link>
              </Button>
            </div>
            <p data-testid="footer-copyright" className="text-muted-foreground text-sm">&copy; {t('copyright')}</p>
            <p className="text-muted-foreground text-sm mt-2">
              {t('madeWith')}{' '}
              <a
                href="https://github.com/koinsaari"
                className="underline hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('authorName')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
