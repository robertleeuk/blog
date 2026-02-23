/**
 * RSS Feed Configuration
 * 
 * RSS 2.0 피드 생성을 위한 설정 및 타입 정의
 */

/**
 * RSS 피드 설정
 * 
 * @property siteUrl - 사이트의 기본 URL (환경 변수에서 로드)
 * @property siteName - 사이트 이름 (RSS 채널 title)
 * @property siteDescription - 사이트 설명 (RSS 채널 description)
 * @property maxItems - RSS 피드에 포함할 최대 포스트 수
 * @property language - RSS 피드 언어 코드
 */
export const RSS_CONFIG = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yanlog.yanbert.com',
  siteName: "YANSO's Blog",
  siteDescription: '개인 기술 블로그',
  maxItems: 20,
  language: 'ko',
} as const;

/**
 * RSS 채널 설정 타입
 * 
 * RSS 2.0 표준의 채널 메타데이터를 정의합니다.
 */
export interface RSSConfig {
  /** 사이트 제목 */
  title: string;
  /** 사이트 설명 */
  description: string;
  /** 사이트 기본 URL (절대 URL) */
  siteUrl: string;
  /** 피드 언어 코드 (예: 'ko', 'en') */
  language: string;
}

/**
 * RSS 아이템 타입
 * 
 * RSS 2.0 표준의 개별 포스트 아이템을 정의합니다.
 */
export interface RSSItem {
  /** 포스트 제목 */
  title: string;
  /** 포스트 절대 URL */
  link: string;
  /** 포스트 설명 (요약) */
  description: string;
  /** 발행 날짜 */
  pubDate: Date;
  /** 고유 식별자 (일반적으로 포스트 URL) */
  guid: string;
  /** 포스트 카테고리 (태그) */
  categories?: string[];
  /** 첨부 파일 (이미지 등) */
  enclosure?: {
    /** 첨부 파일 절대 URL */
    url: string;
    /** MIME 타입 (예: 'image/jpeg', 'image/webp') */
    type: string;
    /** 파일 크기 (바이트, 알 수 없으면 0) */
    length: number;
  };
}

/**
 * RSS 채널 타입
 * 
 * RSS 2.0 표준의 전체 채널 구조를 정의합니다.
 */
export interface RSSChannel {
  /** 채널 제목 */
  title: string;
  /** 채널 링크 (사이트 URL) */
  link: string;
  /** 채널 설명 */
  description: string;
  /** 채널 언어 */
  language: string;
  /** 마지막 빌드 날짜 */
  lastBuildDate: Date;
  /** RSS 아이템 목록 */
  items: RSSItem[];
}
