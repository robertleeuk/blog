'use client';

import { useState, useCallback, isValidElement, ReactNode } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { slugify } from '@/lib/toc';
import { trackCodeCopied } from '@/lib/analytics';

interface MarkdownRendererProps {
  content: string;
  postSlug?: string;
}

/**
 * 코드 블록 복사 버튼 컴포넌트
 */
function CopyButton({ code, postSlug, language }: { code: string; postSlug?: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    if (postSlug) {
      trackCodeCopied({ post_slug: postSlug, language });
    }
    setTimeout(() => setCopied(false), 2000);
  }, [code, postSlug, language]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-300 transition-colors"
      aria-label="코드 복사"
    >
      {copied ? '복사됨' : '복사'}
    </button>
  );
}

/**
 * React children에서 텍스트 추출
 */
function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement(node)) {
    const props = node.props as Record<string, unknown>;
    if (props.children) {
      return extractText(props.children as ReactNode);
    }
  }
  return '';
}

export default function MarkdownRenderer({ content, postSlug }: MarkdownRendererProps) {
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
          // 코드 블록 (복사 버튼 포함)
          pre: ({ children, ...props }) => {
            // code 엘리먼트에서 언어와 텍스트 추출
            const codeText = extractText(children);
            const codeProps = isValidElement(children) ? (children.props as Record<string, unknown>) : {};
            const codeClassName = (codeProps.className as string) || '';
            const langMatch = /language-(\w+)/.exec(codeClassName);
            const language = langMatch ? langMatch[1] : 'text';

            return (
              <div className="relative group">
                <pre
                  className="bg-neutral-900 text-neutral-100 rounded-lg p-4 overflow-x-auto text-sm font-mono my-8 border border-neutral-800"
                  {...props}
                >
                  {children}
                </pre>
                <CopyButton code={codeText} postSlug={postSlug} language={language} />
              </div>
            );
          },
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
              {Array.isArray(children) ? children.map((child, index) => (
                <div key={index}>{child}</div>
              )) : children}
            </ul>
          ),
          // 순서 있는 리스트
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 space-y-2 my-6 text-neutral-800 dark:text-neutral-200" {...props}>
              {Array.isArray(children) ? children.map((child, index) => (
                <div key={index}>{child}</div>
              )) : children}
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
          img: ({ src, alt, width, height, ...props }) => {
            if (!src || typeof src !== 'string') return null;
            
            // width 또는 height 속성이 있으면 고정 크기 사용
            const hasFixedSize = width !== undefined || height !== undefined;
            const imgWidth = width !== undefined ? Number(width) : 800;
            const imgHeight = height !== undefined ? Number(height) : 600;
            
            return (
              <span className={`block relative my-8 rounded-lg overflow-hidden ${hasFixedSize ? '' : 'w-full'}`}>
                <Image
                  src={src}
                  alt={alt ? String(alt) : '이미지'}
                  width={imgWidth}
                  height={imgHeight}
                  className={hasFixedSize ? 'h-auto' : 'w-full h-auto'}
                  loading="lazy"
                  {...props}
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
