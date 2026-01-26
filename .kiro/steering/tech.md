# Tech Stack

## 프레임워크
- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript 5.x

## 스타일링
- Tailwind CSS 4.x
- next-themes (다크모드)

## 콘텐츠
- MDX (@mdx-js/loader, @mdx-js/react)
- gray-matter (frontmatter 파싱)
- react-markdown
- remark-gfm (GitHub Flavored Markdown)
- rehype-highlight, rehype-slug, rehype-raw

## 테스팅
- Jest 30.x
- @testing-library/react
- fast-check (Property-based testing)

## 빌드 설정
- Static Export (`output: 'export'`)
- trailingSlash: true

## 주요 명령어
```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run test         # Jest 테스트
npm run test:watch   # Jest watch 모드
npm run convert:webp # 이미지 WebP 변환
```

## 경로 별칭
- `@/*` → `./src/*`
