# Design Document: RSS Feed

## Overview

이 문서는 Next.js Static Export 환경에서 RSS 2.0 피드를 생성하는 시스템의 설계를 정의합니다. 빌드 시점에 모든 RSS 파일을 생성하여 정적 호스팅 환경에서 서버 없이 작동하도록 합니다.

RSS 피드는 다음과 같이 구성됩니다:
- 언어별 전체 피드: `/ko/rss.xml`, `/en/rss.xml`
- 언어별 태그 피드: `/ko/tag/{slug}/rss.xml`, `/en/tag/{slug}/rss.xml`

## Architecture

### 시스템 구성요소

```
┌─────────────────────────────────────────────────────────┐
│                    Build Process                         │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ MDX Content  │─────▶│ Feed Builder │                │
│  │  (posts/)    │      │   Script     │                │
│  └──────────────┘      └──────┬───────┘                │
│                               │                          │
│                               ▼                          │
│                        ┌──────────────┐                 │
│                        │ RSS Generator│                 │
│                        └──────┬───────┘                 │
│                               │                          │
│                               ▼                          │
│                        ┌──────────────┐                 │
│                        │  Static RSS  │                 │
│                        │    Files     │                 │
│                        │  (out/*.xml) │                 │
│                        └──────────────┘                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Runtime (Browser)                      │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ HTML Pages   │─────▶│ RSS Link Tag │                │
│  │              │      │  (Discovery) │                │
│  └──────────────┘      └──────────────┘                │
└─────────────────────────────────────────────────────────┘
```

### 빌드 시점 처리

1. **Feed Builder Script**: Node.js 스크립트로 빌드 전/후에 실행
2. **MDX 파싱**: 기존 `src/lib/mdx.ts`의 함수를 재사용하여 포스트 메타데이터 수집
3. **RSS 생성**: RSS 2.0 XML 형식으로 피드 파일 생성
4. **파일 출력**: `public/` 디렉토리에 생성하여 Static Export에 포함

### 런타임 처리

1. **Feed Discovery**: 각 페이지의 `<head>`에 RSS 링크 추가
2. **언어별 분기**: 현재 locale에 맞는 RSS 경로 사용

## Components and Interfaces

### 1. Feed Builder Script (`scripts/generate-rss.ts`)

빌드 시점에 실행되는 메인 스크립트입니다.

```typescript
interface FeedBuilderConfig {
  baseUrl: string;
  siteName: string;
  siteDescription: string;
  maxItems: number;
}

class FeedBuilder {
  constructor(config: FeedBuilderConfig);
  
  // 모든 RSS 피드 생성
  generateAllFeeds(): Promise<void>;
  
  // 언어별 전체 피드 생성
  generateMainFeed(locale: Locale): Promise<void>;
  
  // 언어별 태그 피드 생성
  generateTagFeeds(locale: Locale): Promise<void>;
  
  // 특정 태그의 피드 생성
  generateTagFeed(locale: Locale, tag: string): Promise<void>;
}
```

### 2. RSS Generator (`src/lib/rss.ts`)

RSS 2.0 XML을 생성하는 유틸리티입니다.

```typescript
interface RSSChannel {
  title: string;
  link: string;
  description: string;
  language: string;
  lastBuildDate: string;
}

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  categories: string[];
  enclosure?: {
    url: string;
    type: string;
  };
}

class RSSGenerator {
  // RSS 2.0 XML 생성
  generate(channel: RSSChannel, items: RSSItem[]): string;
  
  // 날짜를 RFC 822 형식으로 변환
  formatDate(date: string): string;
  
  // HTML 특수문자 이스케이프
  escapeXml(text: string): string;
  
  // CDATA 섹션으로 감싸기
  wrapCDATA(text: string): string;
}
```

### 3. Feed Discovery Component (`src/components/RSSLink.tsx`)

HTML head에 RSS 링크를 추가하는 컴포넌트입니다.

```typescript
interface RSSLinkProps {
  locale: Locale;
  tag?: string;
}

// 사용 예시:
// <RSSLink locale="ko" />
// <RSSLink locale="ko" tag="aws" />
function RSSLink({ locale, tag }: RSSLinkProps): JSX.Element;
```

### 4. Package.json Scripts 수정

```json
{
  "scripts": {
    "prebuild": "tsx scripts/generate-rss.ts",
    "build": "next build"
  }
}
```

## Data Models

### RSS Feed 파일 구조

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>YAN SO's Blog</title>
    <link>https://yanlog.yanbert.com/ko/</link>
    <description>개인 기술 블로그</description>
    <language>ko</language>
    <lastBuildDate>Mon, 17 Feb 2025 00:00:00 GMT</lastBuildDate>
    
    <item>
      <title><![CDATA[포스트 제목]]></title>
      <link>https://yanlog.yanbert.com/ko/blog/post-slug/</link>
      <description><![CDATA[포스트 설명]]></description>
      <pubDate>Mon, 17 Feb 2025 00:00:00 GMT</pubDate>
      <guid>https://yanlog.yanbert.com/ko/blog/post-slug/</guid>
      <category>tag1</category>
      <category>tag2</category>
      <enclosure url="https://images.yanbert.com/blog/image.webp" type="image/webp"/>
    </item>
    
  </channel>
</rss>
```

### 파일 경로 구조

```
public/
├── ko/
│   ├── rss.xml                    # 한국어 전체 피드
│   └── tag/
│       ├── aws/
│       │   └── rss.xml            # 한국어 aws 태그 피드
│       ├── kiro/
│       │   └── rss.xml            # 한국어 kiro 태그 피드
│       └── ...
└── en/
    ├── rss.xml                    # 영어 전체 피드
    └── tag/
        ├── aws/
        │   └── rss.xml            # 영어 aws 태그 피드
        └── ...
```

## Correctness Properties


*속성(Property)은 시스템의 모든 유효한 실행에서 참이어야 하는 특성 또는 동작입니다. 본질적으로 시스템이 무엇을 해야 하는지에 대한 형식적 진술입니다. 속성은 사람이 읽을 수 있는 명세와 기계가 검증할 수 있는 정확성 보장 사이의 다리 역할을 합니다.*

### Property 1: RSS 2.0 XML 유효성

*임의의* 생성된 RSS 피드에 대해, XML 파서로 파싱 가능해야 하며, RSS 2.0 필수 요소(channel, title, link, description)를 포함해야 한다.

**Validates: Requirements 1.1, 1.3, 6.1, 6.2**

### Property 2: RSS 아이템 필수 필드

*임의의* 포스트에 대해 생성된 RSS 아이템은 title, link, description, pubDate, guid 필드를 모두 포함해야 한다.

**Validates: Requirements 1.2**

### Property 3: 이미지 enclosure 생성

*임의의* 이미지를 포함한 포스트에 대해, 생성된 RSS 아이템은 enclosure 태그를 포함해야 하며, 이미지가 없는 포스트는 enclosure 태그를 포함하지 않아야 한다.

**Validates: Requirements 1.4**

### Property 4: 태그를 category로 변환

*임의의* 태그 목록을 가진 포스트에 대해, 생성된 RSS 아이템은 각 태그에 대응하는 category 요소를 포함해야 한다.

**Validates: Requirements 1.5**

### Property 5: Draft 포스트 필터링

*임의의* 포스트 목록에 대해, draft가 true인 포스트는 생성된 RSS 피드에 포함되지 않아야 한다.

**Validates: Requirements 2.4, 3.5**

### Property 6: 피드 아이템 수 제한

*임의의* 언어와 태그 조합에 대해, 생성된 RSS 피드는 최대 20개의 아이템만 포함해야 한다.

**Validates: Requirements 2.5, 3.6**

### Property 7: 날짜 기준 내림차순 정렬

*임의의* RSS 피드에 대해, 아이템들은 pubDate 기준 내림차순으로 정렬되어야 한다 (최신 글이 먼저).

**Validates: Requirements 2.6**

### Property 8: 언어와 태그 필터링

*임의의* 언어와 태그 조합에 대해, 해당 태그 피드는 그 언어이면서 그 태그를 포함하는 포스트만 포함해야 한다.

**Validates: Requirements 3.4**

### Property 9: RSS link 태그 속성

*임의의* 언어에 대해, 생성된 RSS link 태그는 rel="alternate", type="application/rss+xml", title 속성을 포함해야 하며, href는 해당 언어의 RSS 경로를 가리켜야 한다.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.6, 4.7**

### Property 10: 태그 페이지 RSS 링크

*임의의* 언어와 태그 조합에 대해, 태그 페이지의 RSS link 태그는 해당 언어와 태그의 피드 경로를 가리켜야 한다.

**Validates: Requirements 4.5**

### Property 11: 절대 URL 사용

*임의의* 포스트에 대해, 생성된 RSS 아이템의 link와 guid는 절대 URL이어야 한다 (BASE_URL로 시작).

**Validates: Requirements 5.4**

### Property 12: BASE_URL 환경 변수 사용

*임의의* BASE_URL 값에 대해, 생성된 RSS의 모든 링크는 해당 BASE_URL을 접두사로 사용해야 한다.

**Validates: Requirements 5.5**

### Property 13: HTML 특수문자 처리

*임의의* HTML 특수문자(<, >, &, ", ')를 포함한 텍스트에 대해, 생성된 RSS XML은 CDATA 섹션으로 감싸거나 이스케이프 처리되어야 한다.

**Validates: Requirements 6.4**

### Property 14: RFC 822 날짜 형식

*임의의* 날짜 문자열에 대해, RSS에 생성된 pubDate와 lastBuildDate는 RFC 822 형식을 따라야 한다.

**Validates: Requirements 6.5**

## Error Handling

### 빌드 시점 에러

1. **MDX 파싱 실패**
   - 에러 메시지: "Failed to parse MDX file: {filepath}"
   - 처리: 해당 파일을 건너뛰고 계속 진행, 경고 로그 출력

2. **파일 쓰기 실패**
   - 에러 메시지: "Failed to write RSS file: {filepath}"
   - 처리: 빌드 실패, 명확한 에러 메시지와 함께 종료

3. **환경 변수 누락**
   - 에러 메시지: "NEXT_PUBLIC_BASE_URL is not defined"
   - 처리: 기본값 사용 (https://yanlog.yanbert.com), 경고 로그 출력

4. **디렉토리 생성 실패**
   - 에러 메시지: "Failed to create directory: {dirpath}"
   - 처리: 빌드 실패, 권한 문제 안내

### 런타임 에러

RSS 피드는 정적 파일이므로 런타임 에러가 발생하지 않습니다. 모든 에러는 빌드 시점에 처리됩니다.

## Testing Strategy

### 이중 테스팅 접근법

이 기능은 **단위 테스트**와 **속성 기반 테스트**를 모두 사용하여 포괄적인 검증을 수행합니다.

**단위 테스트**는 다음을 검증합니다:
- 특정 예제 포스트에 대한 RSS 생성
- 파일 경로 생성 로직
- 에러 처리 시나리오
- 빌드 스크립트 통합

**속성 기반 테스트**는 다음을 검증합니다:
- 임의의 포스트 데이터에 대한 RSS 유효성
- 필터링 및 정렬 로직의 정확성
- XML 이스케이프 처리
- 날짜 형식 변환

### 속성 기반 테스트 설정

- **라이브러리**: fast-check (이미 프로젝트에 설치됨)
- **반복 횟수**: 최소 100회
- **태그 형식**: `// Feature: rss-feed, Property {number}: {property_text}`

각 correctness property는 하나의 속성 기반 테스트로 구현됩니다.

### 테스트 파일 구조

```
src/lib/__tests__/
├── rss.test.ts              # RSS Generator 단위 테스트
└── rss.property.test.ts     # RSS Generator 속성 기반 테스트

scripts/__tests__/
├── generate-rss.test.ts     # Feed Builder 단위 테스트
└── generate-rss.property.test.ts  # Feed Builder 속성 기반 테스트
```

### 테스트 데이터 생성

fast-check를 사용하여 다음과 같은 임의 데이터를 생성합니다:

```typescript
// 임의의 포스트 메타데이터
const arbPostMeta = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  date: fc.date().map(d => d.toISOString().split('T')[0]),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 10 }),
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  locale: fc.constantFrom('ko', 'en'),
  draft: fc.boolean(),
  image: fc.option(fc.webUrl(), { nil: undefined }),
});
```

### 통합 테스트

빌드 프로세스 통합은 다음과 같이 테스트합니다:

1. 테스트 환경에서 `npm run build` 실행
2. 생성된 RSS 파일 존재 확인
3. RSS 파일 내용 검증
4. 빌드 시간 측정 (성능 회귀 방지)
