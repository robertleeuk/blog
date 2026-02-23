/**
 * RSS 2.0 피드 생성 유틸리티
 * 
 * RSS 2.0 표준을 준수하는 XML 피드를 생성합니다.
 * Requirements: 1.1, 1.2, 1.3
 */

/**
 * RSS 채널 정보
 */
export interface RSSChannel {
  /** 채널 제목 */
  title: string;
  /** 채널 링크 (절대 URL) */
  link: string;
  /** 채널 설명 */
  description: string;
  /** 언어 코드 (예: ko, en) */
  language: string;
  /** 마지막 빌드 날짜 (RFC 822 형식) */
  lastBuildDate: string;
}

/**
 * RSS 아이템 (포스트)
 */
export interface RSSItem {
  /** 아이템 제목 */
  title: string;
  /** 아이템 링크 (절대 URL) */
  link: string;
  /** 아이템 설명 */
  description: string;
  /** 발행 날짜 (RFC 822 형식) */
  pubDate: string;
  /** 고유 식별자 (일반적으로 링크와 동일) */
  guid: string;
  /** 카테고리 목록 (태그) */
  categories: string[];
  /** 첨부 파일 (이미지 등) */
  enclosure?: {
    /** 첨부 파일 URL */
    url: string;
    /** MIME 타입 */
    type: string;
  };
}

/**
 * RSS 2.0 피드 생성기
 */
export class RSSGenerator {
  /**
   * RSS 2.0 XML 피드를 생성합니다.
   * 
   * @param channel - 채널 정보
   * @param items - 아이템 목록
   * @returns RSS 2.0 XML 문자열
   */
  generate(channel: RSSChannel, items: RSSItem[]): string {
    const channelXml = this.generateChannel(channel);
    const itemsXml = items.map(item => this.generateItem(item)).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
${channelXml}
${itemsXml}
  </channel>
</rss>`;
  }

  /**
   * RSS channel 요소를 생성합니다.
   * 
   * @param channel - 채널 정보
   * @returns channel 요소 XML 문자열
   */
  private generateChannel(channel: RSSChannel): string {
    return `    <title>${this.wrapCDATA(channel.title)}</title>
    <link>${this.escapeXml(channel.link)}</link>
    <description>${this.wrapCDATA(channel.description)}</description>
    <language>${this.escapeXml(channel.language)}</language>
    <lastBuildDate>${this.escapeXml(channel.lastBuildDate)}</lastBuildDate>`;
  }

  /**
   * RSS item 요소를 생성합니다.
   * 
   * @param item - 아이템 정보
   * @returns item 요소 XML 문자열
   */
  private generateItem(item: RSSItem): string {
    const categories = item.categories
      .map(cat => `      <category>${this.escapeXml(cat)}</category>`)
      .join('\n');

    const enclosure = item.enclosure
      ? `\n      <enclosure url="${this.escapeXml(item.enclosure.url)}" type="${this.escapeXml(item.enclosure.type)}"/>`
      : '';

    return `    <item>
      <title>${this.wrapCDATA(item.title)}</title>
      <link>${this.escapeXml(item.link)}</link>
      <description>${this.wrapCDATA(item.description)}</description>
      <pubDate>${this.escapeXml(item.pubDate)}</pubDate>
      <guid>${this.escapeXml(item.guid)}</guid>${categories ? '\n' + categories : ''}${enclosure}
    </item>`;
  }

  /**
   * ISO 8601 날짜를 RFC 822 형식으로 변환합니다.
   * 
   * @param date - ISO 8601 형식의 날짜 문자열 (예: 2025-02-17)
   * @returns RFC 822 형식의 날짜 문자열 (예: Mon, 17 Feb 2025 00:00:00 GMT)
   */
  formatDate(date: string): string {
    const dateObj = new Date(date);
    return dateObj.toUTCString();
  }

  /**
   * HTML 특수문자를 XML 엔티티로 이스케이프합니다.
   * 
   * @param text - 이스케이프할 텍스트
   * @returns 이스케이프된 텍스트
   */
  escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * 텍스트를 CDATA 섹션으로 감쌉니다.
   * 
   * @param text - 감쌀 텍스트
   * @returns CDATA 섹션으로 감싼 텍스트
   */
  wrapCDATA(text: string): string {
    return `<![CDATA[${text}]]>`;
  }
}
