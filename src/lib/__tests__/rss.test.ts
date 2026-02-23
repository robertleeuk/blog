/**
 * RSS Generator 단위 테스트
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.4, 6.5
 */

import { RSSGenerator, RSSChannel, RSSItem } from '../rss';

describe('RSSGenerator', () => {
  let generator: RSSGenerator;

  beforeEach(() => {
    generator = new RSSGenerator();
  });

  describe('generate', () => {
    it('RSS 2.0 XML 헤더를 포함해야 함', () => {
      const channel: RSSChannel = {
        title: 'Test Blog',
        link: 'https://example.com',
        description: 'Test Description',
        language: 'ko',
        lastBuildDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
      };

      const result = generator.generate(channel, []);

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<rss version="2.0">');
    });

    it('channel 필수 요소를 포함해야 함', () => {
      const channel: RSSChannel = {
        title: 'Test Blog',
        link: 'https://example.com',
        description: 'Test Description',
        language: 'ko',
        lastBuildDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
      };

      const result = generator.generate(channel, []);

      expect(result).toContain('<title><![CDATA[Test Blog]]></title>');
      expect(result).toContain('<link>https://example.com</link>');
      expect(result).toContain('<description><![CDATA[Test Description]]></description>');
      expect(result).toContain('<language>ko</language>');
      expect(result).toContain('<lastBuildDate>Mon, 17 Feb 2025 00:00:00 GMT</lastBuildDate>');
    });

    it('item 필수 필드를 포함해야 함', () => {
      const channel: RSSChannel = {
        title: 'Test Blog',
        link: 'https://example.com',
        description: 'Test Description',
        language: 'ko',
        lastBuildDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
      };

      const items: RSSItem[] = [
        {
          title: 'Test Post',
          link: 'https://example.com/post',
          description: 'Post Description',
          pubDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
          guid: 'https://example.com/post',
          categories: [],
        },
      ];

      const result = generator.generate(channel, items);

      expect(result).toContain('<item>');
      expect(result).toContain('<title><![CDATA[Test Post]]></title>');
      expect(result).toContain('<link>https://example.com/post</link>');
      expect(result).toContain('<description><![CDATA[Post Description]]></description>');
      expect(result).toContain('<pubDate>Mon, 17 Feb 2025 00:00:00 GMT</pubDate>');
      expect(result).toContain('<guid>https://example.com/post</guid>');
      expect(result).toContain('</item>');
    });

    it('이미지가 있을 때 enclosure 태그를 포함해야 함', () => {
      const channel: RSSChannel = {
        title: 'Test Blog',
        link: 'https://example.com',
        description: 'Test Description',
        language: 'ko',
        lastBuildDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
      };

      const items: RSSItem[] = [
        {
          title: 'Test Post',
          link: 'https://example.com/post',
          description: 'Post Description',
          pubDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
          guid: 'https://example.com/post',
          categories: [],
          enclosure: {
            url: 'https://example.com/image.webp',
            type: 'image/webp',
          },
        },
      ];

      const result = generator.generate(channel, items);

      expect(result).toContain('<enclosure url="https://example.com/image.webp" type="image/webp"/>');
    });

    it('이미지가 없을 때 enclosure 태그를 포함하지 않아야 함', () => {
      const channel: RSSChannel = {
        title: 'Test Blog',
        link: 'https://example.com',
        description: 'Test Description',
        language: 'ko',
        lastBuildDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
      };

      const items: RSSItem[] = [
        {
          title: 'Test Post',
          link: 'https://example.com/post',
          description: 'Post Description',
          pubDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
          guid: 'https://example.com/post',
          categories: [],
        },
      ];

      const result = generator.generate(channel, items);

      expect(result).not.toContain('<enclosure');
    });

    it('태그를 category 요소로 포함해야 함', () => {
      const channel: RSSChannel = {
        title: 'Test Blog',
        link: 'https://example.com',
        description: 'Test Description',
        language: 'ko',
        lastBuildDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
      };

      const items: RSSItem[] = [
        {
          title: 'Test Post',
          link: 'https://example.com/post',
          description: 'Post Description',
          pubDate: 'Mon, 17 Feb 2025 00:00:00 GMT',
          guid: 'https://example.com/post',
          categories: ['aws', 'kiro', 'developer'],
        },
      ];

      const result = generator.generate(channel, items);

      expect(result).toContain('<category>aws</category>');
      expect(result).toContain('<category>kiro</category>');
      expect(result).toContain('<category>developer</category>');
    });
  });

  describe('formatDate', () => {
    it('ISO 8601 날짜를 RFC 822 형식으로 변환해야 함', () => {
      const result = generator.formatDate('2025-02-17');

      expect(result).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
    });

    it('특정 날짜를 올바르게 변환해야 함', () => {
      const result = generator.formatDate('2025-02-17T00:00:00.000Z');

      expect(result).toBe('Mon, 17 Feb 2025 00:00:00 GMT');
    });
  });

  describe('escapeXml', () => {
    it('HTML 특수문자를 이스케이프해야 함', () => {
      const text = '<tag> & "quotes" & \'apostrophe\'';
      const result = generator.escapeXml(text);

      expect(result).toBe('&lt;tag&gt; &amp; &quot;quotes&quot; &amp; &apos;apostrophe&apos;');
    });

    it('일반 텍스트는 변경하지 않아야 함', () => {
      const text = 'Normal text without special characters';
      const result = generator.escapeXml(text);

      expect(result).toBe(text);
    });
  });

  describe('wrapCDATA', () => {
    it('텍스트를 CDATA 섹션으로 감싸야 함', () => {
      const text = 'Some text with <html> tags';
      const result = generator.wrapCDATA(text);

      expect(result).toBe('<![CDATA[Some text with <html> tags]]>');
    });
  });
});
