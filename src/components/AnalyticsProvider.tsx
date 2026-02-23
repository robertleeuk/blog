'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  initAmplitude,
  initUserProperties,
  trackPageView,
  startOutboundTracking,
} from '@/lib/analytics';

/**
 * 전역 Analytics 프로바이더
 * - Amplitude 초기화
 * - 사용자 속성 설정
 * - 페이지뷰 추적 (경로 변경 감지)
 * - 외부 링크 클릭 추적
 */
export default function AnalyticsProvider() {
  const pathname = usePathname();

  // 최초 1회: Amplitude 초기화 + 사용자 속성 + 외부 링크 추적
  useEffect(() => {
    initAmplitude();
    initUserProperties();
    const cleanupOutbound = startOutboundTracking();
    return cleanupOutbound;
  }, []);

  // 경로 변경 시 페이지뷰 추적
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
