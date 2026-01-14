// 블로그 포스트 타입 정의

export type Locale = 'ko' | 'en';

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
  locale: Locale;
  slug: string;
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  slug: string;
}

export interface PostMeta {
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
  slug: string;
  locale: Locale;
}
