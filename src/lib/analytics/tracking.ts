// 타입 안전한 이벤트 추적 래퍼
import { trackEvent } from './amplitude';
import { EVENTS } from './types';
import type {
  PageViewedPayload,
  PostEngagedPayload,
  OutboundLinkClickedPayload,
  CodeCopiedPayload,
  PageType,
} from './types';

/**
 * 경로에서 페이지 타입 추론
 */
export function resolvePageType(path: string): PageType {
  // /ko/blog/some-slug 또는 /en/blog/some-slug
  if (/^\/\w{2}\/blog\/[^/]+/.test(path)) return 'post';
  if (/^\/\w{2}\/blog\/?$/.test(path)) return 'blog_list';
  if (/^\/\w{2}\/about/.test(path)) return 'about';
  if (path === '/' || /^\/\w{2}\/?$/.test(path)) return 'home';
  return 'other';
}

/**
 * 경로에서 locale 추출
 */
export function resolveLocale(path: string): string {
  const match = path.match(/^\/(\w{2})\//);
  return match ? match[1] : 'ko';
}

/**
 * 경로에서 포스트 slug 추출
 */
export function resolvePostSlug(path: string): string | undefined {
  const match = path.match(/^\/\w{2}\/blog\/([^/]+)/);
  return match ? match[1] : undefined;
}

export function trackPageView(path: string, contentCategory?: string): void {
  const payload: PageViewedPayload = {
    path,
    page_type: resolvePageType(path),
    locale: resolveLocale(path),
    ...(contentCategory && { content_category: contentCategory }),
    ...(resolvePostSlug(path) && { post_slug: resolvePostSlug(path) }),
  };
  trackEvent(EVENTS.PAGE_VIEWED, payload as unknown as Record<string, unknown>);
}

export function trackPostEngaged(payload: PostEngagedPayload): void {
  trackEvent(EVENTS.POST_ENGAGED, payload as unknown as Record<string, unknown>);
}

export function trackOutboundClick(payload: OutboundLinkClickedPayload): void {
  trackEvent(EVENTS.OUTBOUND_LINK_CLICKED, payload as unknown as Record<string, unknown>);
}

export function trackCodeCopied(payload: CodeCopiedPayload): void {
  trackEvent(EVENTS.CODE_COPIED, payload as unknown as Record<string, unknown>);
}
