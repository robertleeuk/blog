'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { slugify } from '@/lib/toc';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          // H1 스타일링 - 큰 제목
          h1: ({ children, ...props }) => {
            const text = String(children);
            const id = slugify(text);
            return (
              <h1 
                id={id} 
                className="text-3xl font-bold mt-16 mb-8 scroll-mt-24 text-neutral-900 dark:text-neutral-100"
                {...props}
              >
                {children}
              </h1>
            );
          },
          // H2 스타일링
          h2: ({ children, ...props }) => {
            const text = String(children);
            const id = slugify(text);
            return (
              <h2 
                id={id} 
                className="text-2xl font-semibold mt-14 mb-6 scroll-mt-24 text-neutral-900 dark:text-neutral-100"
                {...props}
              >
                {children}
              </h2>
            );
          },
          // H3 스타일링
          h3: ({ children, ...props }) => {
            const text = String(children);
            const id = slugify(text);
            return (
              <h3 
                id={id} 
                className="text-xl font-semibold mt-10 mb-4 scroll-mt-24 text-neutral-900 dark:text-neutral-100"
                {...props}
              >
                {children}
              </h3>
            );
          },
          // H4 스타일링
          h4: ({ children, ...props }) => {
            const text = String(children);
            const id = slugify(text);
            return (
              <h4 
                id={id} 
                className="text-lg font-semibold mt-8 mb-4 scroll-mt-24 text-neutral-900 dark:text-neutral-100"
                {...props}
              >
                {children}
              </h4>
            );
          },
          // 문단 스타일링
          p: ({ children, ...props }) => (
            <p 
              className="text-neutral-800 dark:text-neutral-200 leading-7 mb-6"
              {...props}
            >
              {children}
            </p>
          ),
          // 인라인 코드
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            
            if (isInline) {
              return (
                <code
                  className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono text-neutral-800 dark:text-neutral-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // 코드 블록
          pre: ({ children, ...props }) => (
            <pre
              className="bg-neutral-900 text-neutral-100 rounded-lg p-4 overflow-x-auto text-sm font-mono my-8 border border-neutral-800"
              {...props}
            >
              {children}
            </pre>
          ),
          // 링크 - 유일한 컬러 포인트
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          // 순서 없는 리스트
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 space-y-2 my-6 text-neutral-800 dark:text-neutral-200" {...props}>
              {children}
            </ul>
          ),
          // 순서 있는 리스트
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 space-y-2 my-6 text-neutral-800 dark:text-neutral-200" {...props}>
              {children}
            </ol>
          ),
          // 리스트 아이템
          li: ({ children, ...props }) => (
            <li className="leading-7 pl-1" {...props}>
              {children}
            </li>
          ),
          // 블록쿼트
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-2 border-neutral-300 dark:border-neutral-600 pl-4 my-8 text-neutral-600 dark:text-neutral-400 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),
          // 이미지
          img: ({ src, alt }) => {
            if (!src || typeof src !== 'string') return null;
            return (
              <span className="block relative w-full h-auto my-8 rounded-lg overflow-hidden">
                <Image
                  src={src}
                  alt={alt ? String(alt) : '이미지'}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </span>
            );
          },
          // 테이블
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-8">
              <table className="min-w-full" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="border-b border-neutral-200 dark:border-neutral-700" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-4 py-3 text-left font-semibold text-neutral-900 dark:text-neutral-100"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
              {...props}
            >
              {children}
            </td>
          ),
          // 수평선
          hr: () => (
            <hr className="my-12 border-neutral-200 dark:border-neutral-800" />
          ),
          // 강조
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100" {...props}>
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
