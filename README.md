## ROBERT LEE's Blog
http://robert.yanbert.com

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 새 포스트 작성

```bash
npm run new:post <slug> [locale]
```

- `slug`: 포스트 식별자 (필수) - `{slug}-{yyyymmdd}` 형식 필수
- `locale`: `ko` (기본) 또는 `en`

예시:
```bash
npm run new:post my-first-post-20260126        # 한국어 포스트
npm run new:post my-first-post-20260126 en     # 영어 포스트
```

`draft: true` 상태로 생성되며, 발행 시 `draft` 필드를 제거하거나 `false`로 변경하세요.