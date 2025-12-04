/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Calendar, Mail, Globe } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSelector from './LanguageSelector';

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navbarRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('Navigation');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      const heroSection = document.querySelector('[id$="-hero"]') as HTMLElement;
      const isOnHero = heroSection && currentScrollY < heroSection.offsetHeight - 100;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (isOnHero) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
          setIsVisible(false);
          setIsMenuOpen(false);
        } else if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        }
      } else {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false);
          setIsMenuOpen(false);
        } else if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => firstMenuItemRef.current?.focus(), 100);
      }
      return newState;
    });
  };

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/50'
          : 'bg-background/80 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 gap-4 ml-2 sm:ml-0">
            <div className="relative h-12 w-12">
              <Image
                src="/logo-saimaa.png"
                alt="Bistro Saimaa"
                fill
                className="object-contain transition-all duration-300 scale-150"
              />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-foreground">Bistro Saimaa</div>
              <div className="text-xs text-muted-foreground">
                Ravintola, kabinetit ja pitopalvelut
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted/50 backdrop-blur-sm rounded-full p-1">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full px-5 py-2 text-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-all duration-200"
              >
                <Link href="/">{t('home')}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full px-5 py-2 text-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-all duration-200"
              >
                <Link href="/menu">{t('menu')}</Link>
              </Button>
            </div>

            <Button
              asChild
              className="ml-3 rounded-full px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Link href="/contact" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{t('contact')}</span>
              </Link>
            </Button>

            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 rounded-full text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
              aria-label={isMenuOpen ? 'Sulje valikko' : 'Avaa valikko'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-200" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="bg-background/95 backdrop-blur-lg border-t border-border/50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-2">
              <Button
                ref={firstMenuItemRef}
                asChild
                variant="ghost"
                className="justify-start text-foreground hover:bg-muted hover:text-primary rounded-lg py-3 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/">{t('home')}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="justify-start text-foreground hover:bg-muted hover:text-primary rounded-lg py-3 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/menu">{t('menu')}</Link>
              </Button>
              <Button
                asChild
                className="justify-start bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-3 mt-2 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/contact" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{t('contact')}</span>
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50 mt-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <LanguageSelector variant="mobile" onLanguageChange={() => setIsMenuOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
