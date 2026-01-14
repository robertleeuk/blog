'use client';

import Link from 'next/link';
import { Locale } from '@/types/post';
import { t } from '@/lib/i18n';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800">
      <nav className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          href={`/${locale}/blog`} 
          className="font-semibold text-neutral-50 hover:text-neutral-300 transition-colors"
        >
          {t(locale, 'home.title')}
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href={`/${locale}/blog`} 
            className="text-neutral-400 hover:text-neutral-50 transition-colors text-sm"
          >
            {t(locale, 'nav.blog')}
          </Link>
          <Link 
            href={`/${locale}/about`} 
            className="text-neutral-400 hover:text-neutral-50 transition-colors text-sm"
          >
            {t(locale, 'nav.about')}
          </Link>
          <LanguageToggle currentLocale={locale} />
        </div>
      </nav>
    </header>
  );
}
