# Project Structure

```
├── content/                    # 콘텐츠 (MDX 파일)
│   ├── posts/                  # 블로그 포스트
│   │   ├── ko/                 # 한국어 포스트
│   │   └── en/                 # 영어 포스트
│   └── pages/                  # 정적 페이지 (about 등)
│       ├── ko/
│       └── en/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # 다국어 라우팅
│   │   │   ├── blog/           # 블로그 목록/상세
│   │   │   └── about/          # 소개 페이지
│   │   ├── globals.css         # 전역 스타일
│   │   └── layout.tsx          # 루트 레이아웃
│   ├── components/             # React 컴포넌트
│   ├── lib/                    # 유틸리티 함수
│   │   ├── i18n.ts             # 다국어 처리
│   │   ├── mdx.ts              # MDX 파싱
│   │   └── metadata.ts         # SEO 메타데이터
│   ├── translations/           # 번역 JSON
│   │   ├── ko.json
│   │   └── en.json
│   └── types/                  # TypeScript 타입
├── public/                     # 정적 파일
├── scripts/                    # 유틸리티 스크립트
└── data/                       # 데이터 파일
```

## 콘텐츠 작성 규칙

### MDX Frontmatter 필수 필드
```yaml
---
title: "제목"
date: "YYYY-MM-DD"
description: "설명"
tags: ["tag1", "tag2"]
locale: "ko" | "en"
slug: "url-slug"
---
```

### 선택 필드
- `image`: 썸네일 이미지 URL
- `draft`: true로 설정 시 목록에서 숨김 (작성 중인 글)

## 다국어 구조
- URL: `/ko/blog/...`, `/en/blog/...`
- 기본 언어: 한국어 (ko)
- 지원 언어: ko, en
- 번역 파일: `src/translations/{locale}.json`
