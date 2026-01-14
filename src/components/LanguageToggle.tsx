'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/types/post';
import { setStoredLocale } from '@/lib/i18n';

interface LanguageToggleProps {
  currentLocale: Locale;
}

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const toggleLanguage = () => {
    const newLocale: Locale = currentLocale === 'ko' ? 'en' : 'ko';
    setStoredLocale(newLocale);
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };
  
  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm font-medium"
      aria-label={currentLocale === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      {currentLocale === 'ko' ? 'EN' : '한'}
    </button>
  );
}
