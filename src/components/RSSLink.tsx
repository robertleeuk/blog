import { Locale } from '@/types/post';

export interface RSSLinkProps {
  locale: Locale;
  tag?: string;
}

/**
 * RSS 피드 자동 검색을 위한 link 태그를 생성하는 컴포넌트
 * HTML head에 추가되어 RSS 리더가 피드를 자동으로 찾을 수 있도록 합니다.
 * 
 * @param locale - 현재 언어 (ko 또는 en)
 * @param tag - 선택적 태그 (태그 페이지에서 사용)
 */
export default function RSSLink({ locale, tag }: RSSLinkProps) {
  // 기본 URL 가져오기
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yanlog.yanbert.com';
  
  // RSS 피드 경로 생성 (절대 URL)
  const rssPath = tag 
    ? `/${locale}/tag/${tag}/rss.xml`
    : `/${locale}/rss.xml`;
  
  const rssUrl = `${baseUrl}${rssPath}`;
  
  // RSS 피드 제목 생성
  const rssTitle = tag
    ? `YAN SO's Blog - ${tag} (${locale.toUpperCase()})`
    : `YAN SO's Blog (${locale.toUpperCase()})`;

  return (
    <link
      rel="alternate"
      type="application/rss+xml"
      title={rssTitle}
      href={rssUrl}
    />
  );
}
