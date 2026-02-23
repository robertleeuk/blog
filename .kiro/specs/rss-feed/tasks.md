# Implementation Plan: RSS Feed

## Overview

이 구현 계획은 Next.js Static Export 환경에서 RSS 2.0 피드를 생성하는 기능을 단계별로 구현합니다. 빌드 시점에 모든 RSS 파일을 생성하여 정적 호스팅 환경에서 작동하도록 합니다.

## Tasks

- [ ] 1. RSS Generator 유틸리티 구현
  - [x] 1.1 RSS Generator 기본 구조 생성
    - src/lib/rss.ts 파일 생성
    - RSSChannel, RSSItem 인터페이스 정의
    - RSSGenerator 클래스 기본 구조 작성
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 1.2 XML 생성 로직 구현
    - RSS 2.0 XML 템플릿 작성
    - channel 요소 생성 함수 구현
    - item 요소 생성 함수 구현
    - enclosure 태그 조건부 생성
    - category 요소 생성
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 1.3 날짜 형식 변환 구현
    - ISO 8601을 RFC 822 형식으로 변환하는 함수 작성
    - 타임존 처리
    - _Requirements: 6.5_
  
  - [x] 1.4 XML 이스케이프 처리 구현
    - HTML 특수문자 이스케이프 함수 작성
    - CDATA 섹션 래핑 함수 작성
    - _Requirements: 6.4_
  
  - [ ]* 1.5 RSS Generator 단위 테스트 작성
    - 기본 RSS 생성 테스트
    - enclosure 태그 생성 테스트
    - 특수문자 이스케이프 테스트
    - 날짜 형식 변환 테스트
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.4, 6.5_
  
  - [ ]* 1.6 RSS Generator 속성 기반 테스트 작성
    - **Property 1: RSS 2.0 XML 유효성**
    - **Validates: Requirements 1.1, 1.3, 6.1, 6.2**
  
  - [ ]* 1.7 RSS 아이템 필수 필드 속성 테스트
    - **Property 2: RSS 아이템 필수 필드**
    - **Validates: Requirements 1.2**
  
  - [ ]* 1.8 이미지 enclosure 속성 테스트
    - **Property 3: 이미지 enclosure 생성**
    - **Validates: Requirements 1.4**
  
  - [ ]* 1.9 태그 category 변환 속성 테스트
    - **Property 4: 태그를 category로 변환**
    - **Validates: Requirements 1.5**
  
  - [ ]* 1.10 HTML 특수문자 처리 속성 테스트
    - **Property 13: HTML 특수문자 처리**
    - **Validates: Requirements 6.4**
  
  - [ ]* 1.11 날짜 형식 속성 테스트
    - **Property 14: RFC 822 날짜 형식**
    - **Validates: Requirements 6.5**

- [ ] 2. Feed Builder 스크립트 구현
  - [x] 2.1 Feed Builder 기본 구조 생성
    - scripts/generate-rss.ts 파일 생성
    - FeedBuilderConfig 인터페이스 정의
    - FeedBuilder 클래스 기본 구조 작성
    - 환경 변수 로딩 (NEXT_PUBLIC_BASE_URL)
    - _Requirements: 5.5, 7.1_
  
  - [x] 2.2 포스트 데이터 수집 로직 구현
    - 기존 getAllPosts 함수 재사용
    - 언어별 포스트 필터링
    - draft 포스트 제외
    - 날짜 기준 정렬
    - 최신 20개 제한
    - _Requirements: 2.4, 2.5, 2.6_
  
  - [x] 2.3 태그 추출 로직 구현
    - 모든 포스트에서 고유 태그 추출
    - 언어별 태그 목록 생성
    - _Requirements: 3.7_
  
  - [x] 2.4 전체 피드 생성 함수 구현
    - generateMainFeed 함수 작성
    - 언어별 피드 생성 (/ko/rss.xml, /en/rss.xml)
    - RSSGenerator 사용하여 XML 생성
    - public/ 디렉토리에 파일 저장
    - _Requirements: 2.1, 2.2, 2.3, 5.2_
  
  - [x] 2.5 태그별 피드 생성 함수 구현
    - generateTagFeed 함수 작성
    - 언어와 태그로 포스트 필터링
    - 태그별 디렉토리 생성 (/ko/tag/{slug}/, /en/tag/{slug}/)
    - RSSGenerator 사용하여 XML 생성
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 2.6 메인 실행 함수 구현
    - generateAllFeeds 함수 작성
    - 모든 언어에 대해 전체 피드 생성
    - 모든 언어의 모든 태그에 대해 피드 생성
    - 에러 처리 및 로깅
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [ ]* 2.7 Feed Builder 단위 테스트 작성
    - 포스트 필터링 테스트
    - 태그 추출 테스트
    - 파일 생성 테스트
    - 에러 처리 테스트
    - _Requirements: 2.4, 2.5, 2.6, 3.4, 7.3_
  
  - [ ]* 2.8 Draft 필터링 속성 테스트
    - **Property 5: Draft 포스트 필터링**
    - **Validates: Requirements 2.4, 3.5**
  
  - [ ]* 2.9 피드 아이템 수 제한 속성 테스트
    - **Property 6: 피드 아이템 수 제한**
    - **Validates: Requirements 2.5, 3.6**
  
  - [ ]* 2.10 날짜 정렬 속성 테스트
    - **Property 7: 날짜 기준 내림차순 정렬**
    - **Validates: Requirements 2.6**
  
  - [ ]* 2.11 언어와 태그 필터링 속성 테스트
    - **Property 8: 언어와 태그 필터링**
    - **Validates: Requirements 3.4**
  
  - [ ]* 2.12 절대 URL 속성 테스트
    - **Property 11: 절대 URL 사용**
    - **Validates: Requirements 5.4**
  
  - [ ]* 2.13 BASE_URL 환경 변수 속성 테스트
    - **Property 12: BASE_URL 환경 변수 사용**
    - **Validates: Requirements 5.5**

- [x] 3. Checkpoint - RSS 생성 로직 검증
  - 모든 테스트가 통과하는지 확인
  - 생성된 RSS 파일을 RSS 검증 도구로 확인
  - 사용자에게 질문이 있으면 문의

- [ ] 4. RSS Link 컴포넌트 구현
  - [x] 4.1 RSSLink 컴포넌트 생성
    - src/components/RSSLink.tsx 파일 생성
    - RSSLinkProps 인터페이스 정의
    - locale과 tag props 처리
    - _Requirements: 4.1_
  
  - [x] 4.2 RSS link 태그 생성 로직 구현
    - rel, type, title, href 속성 설정
    - 언어별 경로 생성 (/ko/rss.xml, /en/rss.xml)
    - 태그별 경로 생성 (/ko/tag/{slug}/rss.xml)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 4.3 RSSLink 컴포넌트 단위 테스트
    - 전체 피드 링크 렌더링 테스트
    - 태그 피드 링크 렌더링 테스트
    - 속성 검증 테스트
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 4.4 RSS link 태그 속성 테스트
    - **Property 9: RSS link 태그 속성**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.6, 4.7**
  
  - [ ]* 4.5 태그 페이지 RSS 링크 속성 테스트
    - **Property 10: 태그 페이지 RSS 링크**
    - **Validates: Requirements 4.5**

- [ ] 5. 레이아웃에 RSSLink 통합
  - [x] 5.1 루트 레이아웃에 RSSLink 추가
    - src/app/layout.tsx 수정
    - 전체 피드 링크 추가
    - _Requirements: 4.1_
  
  - [x] 5.2 블로그 목록 페이지에 RSSLink 추가
    - src/app/[locale]/blog/page.tsx 수정
    - 현재 언어의 피드 링크 추가
    - _Requirements: 4.1_
  
  - [x] 5.3 태그 페이지에 RSSLink 추가
    - src/app/[locale]/tag/[slug]/page.tsx 파일 확인 및 수정
    - 태그별 피드 링크 추가
    - _Requirements: 4.5_

- [ ] 6. 빌드 프로세스 통합
  - [x] 6.1 package.json 스크립트 수정
    - prebuild 스크립트 추가
    - tsx 패키지 설치 (TypeScript 실행용)
    - _Requirements: 7.1_
  
  - [x] 6.2 빌드 스크립트 실행 가능하도록 설정
    - scripts/generate-rss.ts에 실행 로직 추가
    - 에러 처리 및 종료 코드 설정
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ]* 6.3 빌드 통합 테스트
    - npm run build 실행
    - RSS 파일 생성 확인
    - RSS 파일 내용 검증
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 5.2_

- [ ] 7. 번역 추가
  - [x] 7.1 한국어 번역 추가
    - src/translations/ko.json에 RSS 관련 문구 추가
    - "RSS 피드", "구독하기" 등
  
  - [x] 7.2 영어 번역 추가
    - src/translations/en.json에 RSS 관련 문구 추가
    - "RSS Feed", "Subscribe" 등

- [x] 8. Final Checkpoint - 전체 기능 검증
  - 모든 테스트 통과 확인
  - 빌드 성공 확인
  - 생성된 RSS 파일을 RSS 리더(Feedly, Inoreader 등)로 테스트
  - HTML head에 RSS 링크가 올바르게 추가되었는지 확인
  - 사용자에게 질문이 있으면 문의

## Notes

- `*` 표시된 태스크는 선택사항으로, 빠른 MVP를 위해 건너뛸 수 있습니다
- 각 태스크는 특정 요구사항을 참조하여 추적 가능성을 보장합니다
- Checkpoint는 점진적 검증을 위해 포함되었습니다
- 속성 기반 테스트는 fast-check를 사용하며 최소 100회 반복 실행됩니다
- 단위 테스트는 특정 예제와 엣지 케이스를 검증합니다
