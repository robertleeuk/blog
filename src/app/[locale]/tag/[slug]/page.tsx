import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { Locale, PostMeta } from '@/types/post';
import { getTranslations } from '@/lib/i18n';
import RSSLink from '@/components/RSSLink';

interface TagPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const locales: Locale[] = ['ko', 'en'];
  const params: { locale: string; slug: string }[] = [];

  // 각 언어별로 모든 태그 수집
  for (const locale of locales) {
    const posts = getAllPosts(locale);
    const tags = new Set<string>();
    
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });

    tags.forEach(tag => {
      params.push({ locale, slug: tag });
    });
  }

  return params;
}

function PostItem({ post, locale }: { post: PostMeta; locale: Locale }) {
  return (
    <article className="group">
      <Link href={`/${locale}/blog/${post.slug}`} className="block py-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h2 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>
          <time className="text-sm text-neutral-500 dark:text-neutral-500 shrink-0">
            {post.date}
          </time>
        </div>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          {post.description}
        </p>
      </Link>
    </article>
  );
}

export default async function TagPage({ params }: TagPageProps) {
  const { locale: localeParam, slug: tag } = await params;
  const locale = (localeParam === 'ko' || localeParam === 'en' ? localeParam : 'ko') as Locale;
  
  // 해당 언어의 모든 포스트 가져오기
  const allPosts = getAllPosts(locale);
  
  // 해당 태그를 가진 포스트만 필터링
  const posts = allPosts.filter(post => post.tags.includes(tag));
  
  const translations = getTranslations(locale);
  
  return (
    <>
      <RSSLink locale={locale} tag={tag} />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="mb-4">
            <Link 
              href={`/${locale}/blog`}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              ← {translations.common.backToList}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {translations.common.tags}: {tag}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </header>
        
        {posts.length === 0 ? (
          <p className="text-neutral-500">{translations.common.noPost}</p>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {posts.map((post) => (
              <PostItem key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
