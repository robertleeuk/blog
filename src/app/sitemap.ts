import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';
import { Locale } from '@/types/post';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yanlog.yanbert.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales: Locale[] = ['ko', 'en'];
  const routes: MetadataRoute.Sitemap = [];
  
  // 홈페이지
  routes.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  });
  
  // 각 언어별 블로그 목록 페이지
  for (const locale of locales) {
    routes.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
    
    // 각 포스트 페이지
    const posts = getAllPosts(locale);
    for (const post of posts) {
      routes.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }
  
  return routes;
}
