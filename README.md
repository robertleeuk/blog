## ROBERT LEE's Blog
http://robert.yanbert.com

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 새 포스트 작성

**스크립트를 사용하여 새 포스트를 생성하세요:**

```bash
npm run new:post <slug> [locale]
```

### 파라미터
- `slug`: 포스트 식별자 (필수) - `{slug}-{yyyymmdd}` 형식 필수
- `locale`: `ko` (기본값) 또는 `en`

### 사용 예시

```bash
# 한국어 포스트 생성
npm run new:post my-first-post-20260126

# 영어 포스트 생성
npm run new:post my-first-post-20260126 en
```

### 발행 방법

생성된 포스트는 `draft: true` 상태로 생성됩니다. 발행하려면:

1. 포스트 파일의 frontmatter에서 `draft` 필드를 제거하거나 `false`로 변경
2. 파일을 저장하고 git commit & push

예시:
```yaml
---
title: "포스트 제목"
date: "2026-02-11"
description: "설명"
tags: ["tag1", "tag2"]
locale: "ko"
slug: "my-first-post"
# draft: true  <- 이 줄을 제거하면 발행됨
---
```