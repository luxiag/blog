
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types/blog';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block transition-transform hover:scale-[1.02]">
      <div className="card overflow-hidden h-full">
        {post.coverImage && (
          <div className="relative h-48 w-full" style={{borderBottom: '1px solid var(--border-color)'}}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="card-body">
          <div className="flex items-center mb-2" style={{fontSize: '12px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>
            <time>{post.date}</time>
            {post.readingTime && (
              <>
                <span style={{margin: '0 8px'}}>·</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
          <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--foreground)'}}>
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-3" style={{color: 'var(--color-neutral-500)', fontSize: '14px', lineHeight: '1.6'}}>{post.excerpt}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap" style={{gap: '8px'}}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="transition-colors"
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)'
                  }}
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
