
import { notFound } from 'next/navigation';
import { getPostData, getAllPostSlugs, extractToc } from '@/lib/markdown';
import MDXComponents from '@/components/MDXComponents';
import AIChatBox from '@/components/AIChatBox';
import TableOfContents from '@/components/TableOfContents';
import Link from 'next/link';
import Image from 'next/image';
import { logger } from '@/lib/logger';

// 生成静态参数
export async function generateStaticParams() {
  try {
    const slugs = getAllPostSlugs();
    logger.info('Available slugs:', slugs);
    return slugs.map((item) => ({
      slug: item.params.slug,
    }));
  } catch (error) {
    logger.error('Error generating static params:', error);
    return [];
  }
}

// 获取博客文章数据
async function getPost(slug: string) {
  try {
    const post = await getPostData(slug);
    return post;
  } catch (error) {
    logger.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  // 在Next.js 15+中，params是一个Promise，需要await
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    logger.error('Slug is undefined in params');
    notFound();
  }

  logger.info('Fetching post with slug:', slug);
  const post = await getPost(slug);

  if (!post) {
    logger.error('Post not found for slug:', slug);
    notFound();
    return null;
  }

  const toc = extractToc(post.rawContent || post.content);

  logger.debug('Post data:', post)

  return (
    <>
      <TableOfContents toc={toc} />
      <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{padding: '48px 24px'}}>
        <div style={{marginBottom: '32px'}}>
          <Link href="/blog" className="inline-flex items-center transition-colors" style={{color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)'}}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回博客列表
          </Link>
        </div>

        <article>
          <header style={{marginBottom: '48px'}}>
            <h1 style={{fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: 'var(--foreground)', fontFamily: 'var(--font-sans)'}}>{post.title}</h1>
            <div className="flex items-center" style={{marginBottom: '24px', fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>
              <time dateTime={post.date}>{post.date}</time>
              {post.readingTime && (
                <>
                  <span style={{margin: '0 8px'}}>·</span>
                  <span>{post.readingTime}</span>
                </>
              )}
              {post.author && (
                <>
                  <span style={{margin: '0 8px'}}>·</span>
                  <span>{post.author.name}</span>
                </>
              )}
            </div>
            {post.coverImage && (
              <div className="relative h-64 w-full mb-8" style={{borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap" style={{gap: '8px', marginBottom: '32px'}}>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 12px',
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
          </header>

          <div style={{fontSize: '16px', lineHeight: '1.7', color: 'var(--foreground)'}}>
            <MDXComponents content={post.content} isMdxCompiled={post.isMdxCompiled} category={post.category} />
          </div>
        </article>

        <div style={{marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-color)'}}>
          <div className="text-center">
            <Link href="/blog" className="inline-flex items-center transition-colors" style={{color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)'}}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回博客列表
            </Link>
          </div>
        </div>
      </div>
      
      {/* AI聊天框 */}
      <AIChatBox 
        articleTitle={post.title} 
        articleContent={post.rawContent || post.content} 
      />
      </div>
    </>
  );
}
