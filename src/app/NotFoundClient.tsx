/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFoundClient() {
  const t = useTranslations('NotFoundPage');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-xl font-semibold text-muted-foreground">{t('title')}</h2>
        </div>

        <p className="text-muted-foreground">{t('description')}</p>

        <Button asChild>
          <Link href="/">{t('backToHome')}</Link>
        </Button>
      </div>
    </div>
  );
}
