import { Metadata } from 'next';
import { PostFrontmatter, Locale } from '@/types/post';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://robert.yanbert.com';
const SITE_NAME = "ROBERT LEE's Blog";

interface GenerateMetadataOptions {
  title: string;
  description: string;
  locale: Locale;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
}

export function generatePageMetadata({
  title,
  description,
  locale,
  path = '',
  image,
  type = 'website',
  publishedTime,
  tags,
}: GenerateMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/og-image.png`;
  
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        ko: `${BASE_URL}/ko${path.replace(`/${locale}`, '')}`,
        en: `${BASE_URL}/en${path.replace(`/${locale}`, '')}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime && {
        publishedTime,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generatePostMetadata(
  frontmatter: PostFrontmatter,
  locale: Locale
): Metadata {
  return generatePageMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    locale,
    path: `/${locale}/blog/${frontmatter.slug}`,
    image: frontmatter.image,
    type: 'article',
    publishedTime: frontmatter.date,
    tags: frontmatter.tags,
  });
}
