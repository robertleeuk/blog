'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getInitialLocale } from '@/lib/i18n';

export default function LocaleRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    const locale = getInitialLocale();
    router.replace(`/${locale}/blog`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
