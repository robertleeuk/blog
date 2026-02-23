# Requirements Document

## Introduction

이 문서는 Next.js 기반 블로그에 RSS 2.0 피드 기능을 추가하기 위한 요구사항을 정의합니다. RSS 피드를 통해 독자들이 RSS 리더(Feedly, Inoreader, NetNewsWire 등)를 사용하여 블로그 콘텐츠를 구독하고 새 글을 자동으로 받아볼 수 있습니다.

## Glossary

- **RSS_Generator**: RSS 2.0 형식의 XML 피드를 생성하는 시스템 컴포넌트
- **Feed_Builder**: 빌드 시점에 정적 RSS 파일을 생성하는 시스템
- **Post_Filter**: draft 상태가 아닌 발행된 포스트만 필터링하는 컴포넌트
- **Tag_Filter**: 특정 태그를 가진 포스트만 필터링하는 컴포넌트
- **Feed_Discoverer**: HTML head에 RSS 피드 링크를 추가하여 자동 검색을 지원하는 컴포넌트
- **Static_Export**: Next.js의 정적 사이트 생성 모드 (output: 'export')

## Requirements

### Requirement 1: RSS 2.0 피드 생성

**User Story:** 블로그 소유자로서, RSS 2.0 표준을 준수하는 피드를 자동으로 생성하고 싶습니다. 그래야 다양한 RSS 리더와 호환되기 때문입니다.

#### Acceptance Criteria

1. WHEN 빌드가 실행되면, THE Feed_Builder SHALL 유효한 RSS 2.0 XML 형식의 피드를 생성한다
2. THE RSS_Generator SHALL 각 포스트의 title, link, description, pubDate, guid 필드를 포함한다
3. THE RSS_Generator SHALL 채널 정보로 title, link, description, language를 포함한다
4. WHEN 포스트에 이미지가 있으면, THE RSS_Generator SHALL enclosure 태그를 추가한다
5. THE RSS_Generator SHALL 각 포스트의 태그를 category 요소로 포함한다

### Requirement 2: 전체 블로그 피드

**User Story:** 독자로서, 블로그의 모든 최신 글을 하나의 피드로 구독하고 싶습니다. 그래야 새 글이 올라올 때마다 자동으로 알림을 받을 수 있기 때문입니다.

#### Acceptance Criteria

1. THE Feed_Builder SHALL 각 언어별로 별도의 전체 블로그 피드를 생성한다
2. THE Feed_Builder SHALL 한국어 피드를 /ko/rss.xml 경로에 생성한다
3. THE Feed_Builder SHALL 영어 피드를 /en/rss.xml 경로에 생성한다
4. WHEN 전체 피드를 생성할 때, THE Post_Filter SHALL 해당 언어의 draft가 아닌 포스트만 포함한다
5. THE Feed_Builder SHALL 각 언어별로 최신 20개의 포스트만 피드에 포함한다
6. THE Feed_Builder SHALL 포스트를 날짜 기준 내림차순으로 정렬한다

### Requirement 3: 태그별 피드

**User Story:** 독자로서, 특정 주제(태그)의 글만 선택적으로 구독하고 싶습니다. 그래야 관심 있는 주제의 글만 받아볼 수 있기 때문입니다.

#### Acceptance Criteria

1. THE Feed_Builder SHALL 각 언어별로 태그별 피드를 생성한다
2. THE Feed_Builder SHALL 한국어 태그 피드를 /ko/tag/{slug}/rss.xml 경로에 생성한다
3. THE Feed_Builder SHALL 영어 태그 피드를 /en/tag/{slug}/rss.xml 경로에 생성한다
4. WHEN 태그별 피드를 생성할 때, THE Tag_Filter SHALL 해당 언어와 태그를 모두 만족하는 포스트만 필터링한다
5. THE Tag_Filter SHALL draft가 아닌 포스트만 포함한다
6. THE Feed_Builder SHALL 각 언어의 각 태그별로 최신 20개의 포스트만 포함한다
7. THE Feed_Builder SHALL 각 언어의 모든 고유한 태그에 대해 피드를 생성한다

### Requirement 4: 피드 자동 검색

**User Story:** 독자로서, RSS 리더가 블로그의 피드를 자동으로 찾을 수 있기를 원합니다. 그래야 수동으로 피드 URL을 입력하지 않아도 되기 때문입니다.

#### Acceptance Criteria

1. THE Feed_Discoverer SHALL HTML head에 현재 언어의 전체 피드에 대한 link 태그를 추가한다
2. THE Feed_Discoverer SHALL link 태그에 rel="alternate" 속성을 포함한다
3. THE Feed_Discoverer SHALL link 태그에 type="application/rss+xml" 속성을 포함한다
4. THE Feed_Discoverer SHALL link 태그에 title 속성으로 피드 이름을 포함한다
5. WHEN 태그 페이지에 있을 때, THE Feed_Discoverer SHALL 해당 언어와 태그의 피드 링크를 추가한다
6. WHEN 한국어 페이지에 있을 때, THE Feed_Discoverer SHALL /ko/rss.xml 경로를 사용한다
7. WHEN 영어 페이지에 있을 때, THE Feed_Discoverer SHALL /en/rss.xml 경로를 사용한다

### Requirement 5: Static Export 호환성

**User Story:** 블로그 소유자로서, RSS 피드가 Static Export 모드에서 정상적으로 작동하기를 원합니다. 그래야 서버 없이 정적 호스팅으로 배포할 수 있기 때문입니다.

#### Acceptance Criteria

1. THE Feed_Builder SHALL 빌드 시점에 모든 RSS 파일을 생성한다
2. THE Feed_Builder SHALL 생성된 RSS 파일을 out 디렉토리에 배치한다
3. WHEN Static Export 빌드가 실행되면, THE Feed_Builder SHALL 런타임 의존성 없이 작동한다
4. THE Feed_Builder SHALL 절대 URL을 사용하여 링크를 생성한다
5. THE Feed_Builder SHALL NEXT_PUBLIC_BASE_URL 환경 변수를 사용하여 기본 URL을 설정한다

### Requirement 6: RSS 리더 호환성

**User Story:** 독자로서, 내가 사용하는 RSS 리더에서 피드가 정상적으로 표시되기를 원합니다. 그래야 편하게 글을 읽을 수 있기 때문입니다.

#### Acceptance Criteria

1. THE RSS_Generator SHALL RSS 2.0 표준을 준수하는 XML을 생성한다
2. WHEN RSS 리더가 피드를 파싱할 때, THE RSS_Generator SHALL 유효한 XML 구조를 제공한다
3. THE RSS_Generator SHALL UTF-8 인코딩을 사용한다
4. THE RSS_Generator SHALL HTML 특수문자를 CDATA 섹션 또는 이스케이프 처리한다
5. THE RSS_Generator SHALL 유효한 날짜 형식(RFC 822)을 사용한다

### Requirement 7: 빌드 프로세스 통합

**User Story:** 블로그 소유자로서, RSS 피드가 일반 빌드 프로세스의 일부로 자동 생성되기를 원합니다. 그래야 별도의 작업 없이 항상 최신 피드가 유지되기 때문입니다.

#### Acceptance Criteria

1. WHEN npm run build가 실행되면, THE Feed_Builder SHALL 자동으로 RSS 피드를 생성한다
2. THE Feed_Builder SHALL 빌드 프로세스를 차단하지 않고 완료한다
3. WHEN 피드 생성에 실패하면, THE Feed_Builder SHALL 명확한 에러 메시지를 출력한다
4. THE Feed_Builder SHALL 생성된 피드 파일의 경로를 로그에 출력한다
5. THE Feed_Builder SHALL 기존 빌드 시간에 최소한의 영향만 준다
