/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { Button } from '@/components/ui/button';
import { useLanguage, Language } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'default' | 'mobile';
  onLanguageChange?: () => void;
}

export default function LanguageSelector({
  variant = 'default',
  onLanguageChange,
}: LanguageSelectorProps) {
  const { language, setLanguage, isPending } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    onLanguageChange?.();
  };

  const isMobile = variant === 'mobile';

  return (
    <div
      className={`flex items-center bg-muted/50 backdrop-blur-sm rounded-full p-1 ${isMobile ? '' : 'ml-2'}`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLanguageChange('fi')}
        disabled={isPending}
        className={`rounded-full ${isMobile ? 'px-4' : 'px-3'} py-1 text-xs transition-all duration-200 ${
          language === 'fi'
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-background hover:text-primary'
        }`}
      >
        FI
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        className={`rounded-full ${isMobile ? 'px-4' : 'px-3'} py-1 text-xs transition-all duration-200 ${
          language === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-background hover:text-primary'
        }`}
      >
        EN
      </Button>
    </div>
  );
}
