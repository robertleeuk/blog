// 포스트 참여 추적 - 50% 스크롤 또는 30초 체류 시 발동
import { trackPostEngaged } from './tracking';
import { recordPostEngagement } from './user-properties';
import type { PostEngagedPayload } from './types';

const ENGAGE_TIME_MS = 30_000; // 30초
const ENGAGE_SCROLL_PERCENT = 50;

interface EngagementTrackerOptions {
  postSlug: string;
  contentCategory: string;
}

/**
 * 포스트 참여 추적기 시작
 * 페이지당 1회만 발동, cleanup 함수 반환
 */
export function startEngagementTracker(options: EngagementTrackerOptions): () => void {
  const { postSlug, contentCategory } = options;
  let fired = false;
  const startTime = Date.now();

  function fire(scrollDepth: number): void {
    if (fired) return;
    fired = true;

    const payload: PostEngagedPayload = {
      post_slug: postSlug,
      content_category: contentCategory,
      time_to_engage: Math.round((Date.now() - startTime) / 1000),
      scroll_depth_percent: scrollDepth,
    };

    trackPostEngaged(payload);
    recordPostEngagement(contentCategory);
    cleanup();
  }

  // 스크롤 깊이 계산
  function getScrollPercent(): number {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 100;
    return Math.round((window.scrollY / docHeight) * 100);
  }

  // 스크롤 이벤트 (debounce 200ms)
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;
  function onScroll(): void {
    if (fired) return;
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const percent = getScrollPercent();
      if (percent >= ENGAGE_SCROLL_PERCENT) {
        fire(percent);
      }
    }, 200);
  }

  // 30초 타이머
  const timer = setTimeout(() => {
    if (!fired) fire(getScrollPercent());
  }, ENGAGE_TIME_MS);

  window.addEventListener('scroll', onScroll, { passive: true });

  function cleanup(): void {
    clearTimeout(timer);
    if (scrollTimer) clearTimeout(scrollTimer);
    window.removeEventListener('scroll', onScroll);
  }

  return cleanup;
}
