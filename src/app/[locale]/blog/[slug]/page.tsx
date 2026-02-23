import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getAllSlugs, hasTranslation } from '@/lib/mdx';
import { generatePostMetadata } from '@/lib/metadata';
import { extractHeadings } from '@/lib/toc';
import { Locale } from '@/types/post';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import QuestionTags from '@/components/QuestionTags';
import PostEngagementTracker from '@/components/PostEngagementTracker';

interface PostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam === 'ko' || localeParam === 'en' ? localeParam : 'ko') as Locale;
  const post = getPostBySlug(slug, locale);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }
  
  return generatePostMetadata(post.frontmatter, locale);
}

export function generateStaticParams() {
  const locales: Locale[] = ['ko', 'en'];
  const params: { locale: string; slug: string }[] = [];
  
  for (const locale of locales) {
    const slugs = getAllSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  
  return params;
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam === 'ko' || localeParam === 'en' ? localeParam : 'ko') as Locale;
  const post = getPostBySlug(slug, locale);
  
  if (!post) {
    notFound();
  }
  
  const otherLocale: Locale = locale === 'ko' ? 'en' : 'ko';
  const hasOtherLocale = hasTranslation(slug, otherLocale);
  const tocItems = extractHeadings(post.content);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex gap-16 justify-center">
        {/* 메인 콘텐츠 */}
        <article className="max-w-2xl w-full">
          {/* 헤더 */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4 text-sm text-neutral-500">
              <time>{post.frontmatter.date}</time>
              {hasOtherLocale && (
                <>
                  <span>·</span>
                  <Link 
                    href={`/${otherLocale}/blog/${slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {otherLocale === 'ko' ? '한국어' : 'English'}
                  </Link>
                </>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {post.frontmatter.title}
            </h1>
            
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {post.frontmatter.description}
            </p>
            
            {/* 질문 태그 */}
            {post.frontmatter.questions && post.frontmatter.questions.length > 0 && (
              <QuestionTags questions={post.frontmatter.questions} />
            )}
          </header>
          
          {/* 본문 */}
          <MarkdownRenderer content={post.content} postSlug={slug} />
          
          {/* 참여 추적 */}
          <PostEngagementTracker
            postSlug={slug}
            contentCategory={post.frontmatter.tags?.[0] || 'uncategorized'}
          />
          
          {/* 하단 네비게이션 */}
          <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <Link 
              href={`/${locale}/blog`} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← {locale === 'ko' ? '모든 글' : 'All posts'}
            </Link>
          </div>
        </article>
        
        {/* Table of Contents */}
        {tocItems.length > 0 && (
          <aside className="hidden xl:block w-56 shrink-0">
            <TableOfContents items={tocItems} locale={locale} />
          </aside>
        )}
      </div>
    </div>
  );
}
