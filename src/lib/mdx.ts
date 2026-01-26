import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostFrontmatter, PostMeta, Locale } from '@/types/post';

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');
const PAGES_DIR = path.join(process.cwd(), 'content/pages');

// MDX 파일 파싱
export function parseFile(filePath: string): Post {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  const frontmatter = data as PostFrontmatter;
  
  return {
    frontmatter,
    content,
    slug: frontmatter.slug,
  };
}

// 페이지 파일 읽기 (about 등)
export function getPageContent(pageName: string, locale: Locale): string | null {
  const filePath = path.join(PAGES_DIR, locale, `${pageName}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);
  
  return content;
}

// 특정 언어의 모든 포스트 가져오기
export function getAllPosts(locale: Locale): PostMeta[] {
  const localeDir = path.join(CONTENT_DIR, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  
  const files = fs.readdirSync(localeDir).filter(file => file.endsWith('.mdx'));
  
  const posts = files.map(file => {
    const filePath = path.join(localeDir, file);
    const { frontmatter } = parseFile(filePath);
    
    return {
      title: frontmatter.title,
      date: frontmatter.date,
      description: frontmatter.description,
      tags: frontmatter.tags,
      image: frontmatter.image,
      slug: frontmatter.slug,
      locale: frontmatter.locale,
      draft: frontmatter.draft,
    };
  });
  
  // draft가 true인 포스트 필터링 (기본값: false)
  const publishedPosts = posts.filter(post => post.draft !== true);
  
  // 날짜 기준 내림차순 정렬
  return publishedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// slug로 특정 포스트 가져오기
export function getPostBySlug(slug: string, locale: Locale): Post | null {
  const localeDir = path.join(CONTENT_DIR, locale);
  
  if (!fs.existsSync(localeDir)) {
    return null;
  }
  
  const files = fs.readdirSync(localeDir).filter(file => file.endsWith('.mdx'));
  
  for (const file of files) {
    const filePath = path.join(localeDir, file);
    const post = parseFile(filePath);
    
    if (post.slug === slug) {
      return post;
    }
  }
  
  return null;
}

// 모든 slug 가져오기 (정적 경로 생성용)
export function getAllSlugs(locale: Locale): string[] {
  const posts = getAllPosts(locale);
  return posts.map(post => post.slug);
}

// 번역된 버전이 있는지 확인
export function hasTranslation(slug: string, targetLocale: Locale): boolean {
  return getPostBySlug(slug, targetLocale) !== null;
}
