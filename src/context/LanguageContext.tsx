/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export type Language = 'fi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isPending: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const currentLocale = useLocale() as Language;
  const [language, setLanguageState] = useState<Language>(currentLocale);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setLanguageState(currentLocale);
  }, [currentLocale]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`; // 1 year

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isPending }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
