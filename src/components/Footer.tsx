'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import WaterLine from '@/components/WaterLine';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer
      data-testid="footer"
      className="border-t border-primary/20 py-12 text-card-foreground gradient-dark footer-shadow"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center">
            <div className="mb-2 font-serif text-2xl">
              Bistro <em className="font-light italic text-primary">Saimaa</em>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>

          <div className="grid w-full max-w-2xl grid-cols-1 gap-8 justify-items-center md:grid-cols-2 md:gap-16 md:justify-items-start md:pl-16">
            <div className="text-center md:text-left">
              <h3 className="mb-3 flex items-center justify-center text-lg font-semibold">
                <MapPin className="mr-2 h-5 w-5" />
                {t('contactInfo')}
              </h3>
              <div className="inline-block space-y-2 text-left text-sm text-muted-foreground">
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
                    <Link href="tel:+358504499322" data-testid="footer-phone">
                      +358 50 4499 322
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Link href="mailto:bistrosaimaa@gmail.com" data-testid="footer-email">
                      bistrosaimaa@gmail.com
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="mb-3 flex items-center justify-center text-lg font-semibold">
                <Clock className="mr-2 h-5 w-5" />
                {t('openingHours')}
              </h3>
              <div className="inline-block space-y-2 text-left text-sm text-muted-foreground">
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

          <div className="flex gap-6">
            <Link
              href="https://www.facebook.com/bistrosaimaaoy"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-facebook"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 6.03 4.388 11.029 10.125 11.927v-8.434H7.078v-3.493h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.493h-2.796v8.434C19.612 23.102 24 18.103 24 12.073z" />
              </svg>
            </Link>
          </div>

          <WaterLine variant="divider" className="mb-2 w-full" />

          <div className="w-full text-center pt-2">
            <div className="mb-3">
              <Button
                variant="link"
                asChild
                className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
              >
                <Link href="/privacy" data-testid="footer-privacy-link">
                  {t('privacyPolicy')}
                </Link>
              </Button>
            </div>
            <p data-testid="footer-copyright" className="text-sm text-muted-foreground">
              &copy; {t('copyright')}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('madeWith')}{' '}
              <a
                href="https://github.com/koinsaari"
                className="underline transition-colors hover:text-primary"
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
