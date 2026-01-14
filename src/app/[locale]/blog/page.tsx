import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { Locale, PostMeta } from '@/types/post';
import { getTranslations } from '@/lib/i18n';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
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

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === 'ko' || localeParam === 'en' ? localeParam : 'ko') as Locale;
  const posts = getAllPosts(locale);
  const translations = getTranslations(locale);
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          {translations.blog.title}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {translations.blog.description}
        </p>
      </header>
      
      {posts.length === 0 ? (
        <p className="text-neutral-500">{translations.blog.noPost}</p>
      ) : (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {posts.map((post) => (
            <PostItem key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
