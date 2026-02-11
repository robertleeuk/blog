'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getInitialLocale } from '@/lib/i18n';

export default function LocaleRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    const locale = getInitialLocale();
    const targetPath = `/${locale}/blog`;
    
    // 즉시 리다이렉트 시도
    router.replace(targetPath);
    
    // 폴백: 일정 시간 후에도 리다이렉트되지 않으면 강제 이동
    const timeout = setTimeout(() => {
      window.location.href = targetPath;
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
