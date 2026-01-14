import Link from 'next/link';
import { PostMeta, Locale } from '@/types/post';
import ExternalImage from './ExternalImage';

interface PostCardProps {
  post: PostMeta;
  locale: Locale;
}

export default function PostCard({ post, locale }: PostCardProps) {
  return (
    <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {post.image && (
        <Link href={`/${locale}/blog/${post.slug}`}>
          <ExternalImage
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}
      
      <div className="p-4">
        <Link href={`/${locale}/blog/${post.slug}`}>
          <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-500 text-sm mt-1">{post.date}</p>
        <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
          {post.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
