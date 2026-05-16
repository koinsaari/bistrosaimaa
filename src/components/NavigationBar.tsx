'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Menu, Calendar, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSelector from './LanguageSelector';

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const t = useTranslations('Navigation');

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      const hero = document.querySelector('[id$="-hero"]') as HTMLElement | null;
      const onHero = hero && y < hero.offsetHeight - 100;
      if (y < 10) {
        setIsVisible(true);
      } else if (onHero) {
        if (y > lastScrollY.current && y > 200) setIsVisible(false);
        else if (y < lastScrollY.current) setIsVisible(true);
      } else {
        if (y > lastScrollY.current && y > 100) setIsVisible(false);
        else if (y < lastScrollY.current) setIsVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      data-testid="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'border-b border-border/50 bg-background/95 shadow-sm backdrop-blur-lg'
          : 'bg-background/80 backdrop-blur-md'
      }`}
      style={{ height: 'var(--nav-h)' }}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        <Link href="/" data-testid="nav-logo" className="flex items-center gap-3 sm:gap-4">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12">
            <Image
              src="/logo-saimaa.png"
              alt="Bistro Saimaa"
              fill
              sizes="48px"
              priority
              className="scale-150 object-contain"
            />
          </div>
          <span className="font-serif text-lg leading-none text-foreground sm:text-xl">
            Bistro <em className="font-light italic text-primary">Saimaa</em>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex" data-testid="nav-desktop">
          <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1 backdrop-blur-sm">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full px-5 py-2 text-foreground transition-all duration-200 hover:bg-background hover:text-primary"
            >
              <Link href="/menu" data-testid="nav-link-menu">
                {t('menu')}
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full px-5 py-2 text-foreground transition-all duration-200 hover:bg-background hover:text-primary"
            >
              <Link href="/gallery" data-testid="nav-link-gallery">
                {t('gallery')}
              </Link>
            </Button>
          </div>

          <Button
            asChild
            className="ml-3 rounded-full bg-primary px-5 py-2 text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90"
          >
            <Link href="/contact" data-testid="nav-link-contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{t('contact')}</span>
            </Link>
          </Button>

          <LanguageSelector />
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                data-testid="nav-mobile-toggle"
                variant="ghost"
                size="sm"
                className="rounded-full p-2 text-foreground hover:bg-muted hover:text-primary"
                aria-label={t('openMenu')}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" data-testid="nav-mobile-menu">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl">
                  Bistro <em className="font-light italic text-primary">Saimaa</em>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-2">
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start rounded-lg py-6 text-base text-foreground hover:bg-muted hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/menu" data-testid="nav-mobile-link-menu">
                    {t('menu')}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start rounded-lg py-6 text-base text-foreground hover:bg-muted hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/gallery" data-testid="nav-mobile-link-gallery">
                    {t('gallery')}
                  </Link>
                </Button>
                <Button
                  asChild
                  className="mt-2 justify-start rounded-lg bg-primary py-6 text-base text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsOpen(false)}
                >
                  <Link
                    href="/contact"
                    data-testid="nav-mobile-link-contact"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{t('contact')}</span>
                  </Link>
                </Button>
                <div className="mt-6 flex items-center justify-center gap-2 border-t border-border/50 pt-6">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <LanguageSelector
                    variant="mobile"
                    onLanguageChange={() => setIsOpen(false)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
