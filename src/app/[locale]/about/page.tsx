import { Metadata } from 'next';
import { Locale } from '@/types/post';
import { generatePageMetadata } from '@/lib/metadata';
import { getPageContent } from '@/lib/mdx';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface AboutPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ko' ? '소개' : 'About';
  const description =
    locale === 'ko'
      ? 'ROBERT LEE에 대해 알아보세요'
      : 'Learn about ROBERT LEE';

  return generatePageMetadata({
    title,
    description,
    locale,
    path: `/${locale}/about`,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const content = getPageContent('about', locale);

  if (!content) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-neutral-500">페이지를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <article className="prose prose-invert max-w-none">
        <MarkdownRenderer content={content} />
      </article>
    </div>
  );
}
