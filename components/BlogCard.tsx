import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types/blog';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="block transition-transform hover:scale-[1.02]">
      <div className="card overflow-hidden h-full border border-neutral-200 rounded-xl">
        {post.coverImage && (
          <div className="relative h-48 w-full border-b border-neutral-200">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="card-body p-5">
          <div className="flex items-center mb-2 text-xs text-neutral-500 font-mono">
            <time>{post.date}</time>
            {post.readingTime && (
              <>
                <span className="mx-2">·</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-neutral-500 leading-relaxed">{post.excerpt}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
