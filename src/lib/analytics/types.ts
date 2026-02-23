// 분석 이벤트 이름 상수
export const EVENTS = {
  PAGE_VIEWED: 'Page Viewed',
  POST_ENGAGED: 'Post Engaged',
  OUTBOUND_LINK_CLICKED: 'Outbound Link Clicked',
  CODE_COPIED: 'Code Copied',
} as const;

// 페이지 타입
export type PageType = 'home' | 'post' | 'blog_list' | 'about' | 'other';

// 외부 링크 목적지 타입
export type DestinationType = 'github' | 'aws' | 'kiro' | 'event' | 'other';

// 이벤트 페이로드 타입 정의
export interface PageViewedPayload {
  path: string;
  page_type: PageType;
  locale: string;
  content_category?: string;
  post_slug?: string;
}

export interface PostEngagedPayload {
  post_slug: string;
  content_category: string;
  time_to_engage: number;
  scroll_depth_percent: number;
}

export interface OutboundLinkClickedPayload {
  destination_url: string;
  source_path: string;
  destination_type: DestinationType;
}

export interface CodeCopiedPayload {
  post_slug: string;
  language: string;
}

// 사용자 속성 (localStorage 저장)
export interface UserProperties {
  first_visit_timestamp: number;
  first_referrer: string;
  first_utm_source: string;
  is_returning_user: boolean;
  total_posts_engaged: number;
  last_engaged_category: string;
}
