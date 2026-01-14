# Implementation Plan: Developer Blog

## Overview

Next.js 14 App Router와 MDX를 기반으로 한 개인 개발자 블로그를 구현합니다. 정적 사이트 생성, 다국어 지원, 외부 이미지 최적화, GitHub Actions 배포, 멀티 채널 배포 기능을 단계별로 구현합니다.

## Tasks

- [x] 1. 프로젝트 초기 설정
  - [x] 1.1 Next.js 14 프로젝트 생성 및 TypeScript 설정
    - `npx create-next-app@latest` 실행
    - App Router 사용, TypeScript, Tailwind CSS, ESLint 활성화
    - _Requirements: 2.1_
  - [x] 1.2 MDX 및 관련 패키지 설치
    - `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `gray-matter` 설치
    - `rehype-highlight`, `remark-gfm` 설치
    - _Requirements: 1.1, 1.4_
  - [x] 1.3 테스트 프레임워크 설정
    - Jest, fast-check, @testing-library/react 설치
    - jest.config.js 설정
    - _Requirements: Testing Strategy_

- [x] 2. MDX 콘텐츠 시스템 구현
  - [x] 2.1 콘텐츠 디렉토리 구조 생성
    - `content/posts/ko/`, `content/posts/en/` 디렉토리 생성
    - 샘플 MDX 파일 작성
    - _Requirements: 1.1, 3.2_
  - [x] 2.2 MDX 파서 및 유틸리티 함수 구현
    - `lib/mdx.ts` 파일 생성
    - `parseFile`, `getAllPosts`, `getPostBySlug` 함수 구현
    - frontmatter 추출 로직 구현
    - _Requirements: 1.1, 1.3_
  - [ ]* 2.3 Property 1: MDX 파싱 라운드 트립 테스트
    - **Property 1: MDX 파싱 라운드 트립**
    - **Validates: Requirements 1.1, 1.3**
  - [ ]* 2.4 Property 2: MDX 구문 오류 처리 테스트
    - **Property 2: MDX 구문 오류 처리**
    - **Validates: Requirements 1.5**
  - [x] 2.5 Post 타입 정의
    - `types/post.ts` 파일 생성
    - PostFrontmatter, Post 인터페이스 정의
    - _Requirements: 1.3_

- [x] 3. Checkpoint - MDX 시스템 검증
  - 모든 테스트 통과 확인, 질문이 있으면 사용자에게 문의

- [x] 4. 정적 사이트 생성 및 라우팅 구현
  - [x] 4.1 블로그 목록 페이지 구현
    - `app/[locale]/blog/page.tsx` 생성
    - 모든 포스트 목록 표시
    - _Requirements: 2.1, 2.2_
  - [x] 4.2 블로그 상세 페이지 구현
    - `app/[locale]/blog/[slug]/page.tsx` 생성
    - `generateStaticParams` 함수로 정적 경로 생성
    - _Requirements: 2.1, 2.4_
  - [ ]* 4.3 Property 3: 정적 라우팅 완전성 테스트
    - **Property 3: 정적 라우팅 완전성**
    - **Validates: Requirements 2.1, 2.4**
  - [x] 4.4 Sitemap 및 robots.txt 생성
    - `app/sitemap.ts`, `app/robots.ts` 파일 생성
    - _Requirements: 2.3, 8.3_
  - [x] 4.5 next.config.js 정적 내보내기 설정
    - `output: 'export'` 설정
    - _Requirements: 2.5_

- [-] 5. 다국어(i18n) 지원 구현
  - [x] 5.1 번역 파일 및 i18n 모듈 구현
    - `translations/ko.json`, `translations/en.json` 생성
    - `lib/i18n.ts` 유틸리티 함수 구현
    - _Requirements: 3.1_
  - [x] 5.2 언어 전환 컴포넌트 구현
    - `components/LanguageToggle.tsx` 생성
    - 로컬 스토리지 저장/조회 로직
    - _Requirements: 3.3, 3.5_
  - [ ]* 5.3 Property 4: 다국어 콘텐츠 구조 일관성 테스트
    - **Property 4: 다국어 콘텐츠 구조 일관성**
    - **Validates: Requirements 3.2, 3.4**
  - [ ]* 5.4 Property 5: 언어 설정 지속성 테스트
    - **Property 5: 언어 설정 지속성 (라운드 트립)**
    - **Validates: Requirements 3.5**
  - [x] 5.5 브라우저 언어 감지 구현
    - 초기 방문 시 브라우저 언어 감지
    - _Requirements: 3.6_

- [x] 6. Checkpoint - 다국어 시스템 검증
  - 모든 테스트 통과 확인, 질문이 있으면 사용자에게 문의

- [-] 7. 이미지 시스템 구현
  - [x] 7.1 외부 이미지 도메인 설정
    - `next.config.js`에 `images.remotePatterns` 설정
    - _Requirements: 4.4_
  - [x] 7.2 ExternalImage 컴포넌트 구현
    - `components/ExternalImage.tsx` 생성
    - 폴백 이미지 처리 로직
    - lazy loading 적용
    - _Requirements: 4.1, 4.3, 4.5_
  - [ ]* 7.3 Property 6: 이미지 로딩 폴백 테스트
    - **Property 6: 이미지 로딩 폴백**
    - **Validates: Requirements 4.3**

- [-] 8. SEO 및 메타데이터 구현
  - [x] 8.1 메타데이터 생성 함수 구현
    - `lib/metadata.ts` 생성
    - generateMetadata 함수 구현
    - _Requirements: 8.1_
  - [x] 8.2 Open Graph 및 Twitter Card 설정
    - 각 페이지에 OG 태그 적용
    - _Requirements: 8.2, 8.5_
  - [ ]* 8.3 Property 7: SEO 메타데이터 완전성 테스트
    - **Property 7: SEO 메타데이터 완전성**
    - **Validates: Requirements 8.1, 8.2, 8.4**

- [x] 9. Checkpoint - 핵심 기능 검증
  - 모든 테스트 통과 확인, 질문이 있으면 사용자에게 문의

- [x] 10. UI 컴포넌트 구현
  - [x] 10.1 레이아웃 컴포넌트 구현
    - `components/Layout.tsx` 생성
    - Header, Footer 포함
    - _Requirements: 7.1_
  - [x] 10.2 반응형 네비게이션 구현
    - 모바일/데스크톱 네비게이션
    - _Requirements: 7.1, 7.2_
  - [x] 10.3 블로그 카드 컴포넌트 구현
    - `components/PostCard.tsx` 생성
    - _Requirements: 7.3_

- [-] 11. 멀티 채널 배포 시스템 구현
  - [x] 11.1 Publisher 모듈 구현
    - `lib/publisher.ts` 생성
    - 플랫폼별 포맷 변환 함수
    - _Requirements: 6.1, 6.3_
  - [ ]* 11.2 Property 8: 멀티채널 포맷 변환 테스트
    - **Property 8: 멀티채널 포맷 변환**
    - **Validates: Requirements 6.3**
  - [x] 11.3 배포 이력 추적 구현
    - `data/publish-history.json` 스키마
    - 저장/조회 함수 구현
    - _Requirements: 6.4_
  - [ ]* 11.4 Property 9: 배포 이력 추적 테스트
    - **Property 9: 배포 이력 추적 (라운드 트립)**
    - **Validates: Requirements 6.4**
  - [x]* 11.5 Nova Act 통합 설정
    - Nova Act API 연동 준비
    - _Requirements: 6.2_

- [x] 12. GitHub Actions 배포 파이프라인 구현
  - [x] 12.1 GitHub Actions 워크플로우 작성
    - `.github/workflows/deploy.yml` 생성
    - 빌드, 린트, 타입 체크 단계 포함
    - _Requirements: 5.1, 5.2_
  - [x] 12.2 GitHub Pages 배포 설정
    - 정적 파일 배포 설정
    - _Requirements: 5.3_
  - [x] 12.3 캐시 및 최적화 설정
    - 의존성 캐시 설정
    - _Requirements: 5.5_

- [x] 13. Final Checkpoint - 전체 시스템 검증
  - 모든 테스트 통과 확인
  - 빌드 및 정적 내보내기 검증
  - 질문이 있으면 사용자에게 문의

## Notes

- `*` 표시된 태스크는 선택적이며, 빠른 MVP를 위해 건너뛸 수 있습니다
- 각 태스크는 특정 요구사항을 참조하여 추적 가능합니다
- Checkpoint에서 점진적 검증을 수행합니다
- Property 테스트는 fast-check 라이브러리를 사용하여 최소 100회 반복 실행합니다
