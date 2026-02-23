'use client';

import { useEffect } from 'react';
import { startEngagementTracker } from '@/lib/analytics';

interface PostEngagementTrackerProps {
  postSlug: string;
  contentCategory: string;
}

/**
 * 포스트 참여 추적 컴포넌트
 * 포스트 상세 페이지에 배치하여 50% 스크롤 또는 30초 체류 시 이벤트 발동
 */
export default function PostEngagementTracker({ postSlug, contentCategory }: PostEngagementTrackerProps) {
  useEffect(() => {
    const cleanup = startEngagementTracker({ postSlug, contentCategory });
    return cleanup;
  }, [postSlug, contentCategory]);

  return null;
}
