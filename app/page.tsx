import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import BlogCard from '@/components/BlogCard';
import PageTitle from '@/components/PageTitle';

export default async function Home() {
  const posts = await getAllPosts();
  const featuredPosts = posts.slice(0, 3);

  return (
    <>
      <PageTitle title="首页" />
      <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      {/* Hero Section */}
      {/* Hero Section */}
      <section style={{backgroundColor: 'white', borderBottom: '1px solid var(--border-color)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{padding: '96px 24px'}}>
          <div className="text-center">
            <h1 className="features-title" style={{marginBottom: '24px', fontFamily: 'var(--font-sans)'}}>
              欢迎来到我的博客
            </h1>
            <p style={{fontSize: '18px', marginBottom: '32px', maxWidth: '48rem', margin: '0 auto 32px', color: 'var(--color-neutral-500)', lineHeight: '1.6'}}>
              分享技术见解、学习心得和思考感悟的地方
            </p>
            <div className="flex flex-col sm:flex-row justify-center" style={{gap: '16px'}}>
              <Link 
                href="/posts" 
                className="transition-colors"
                style={{
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '14px',
                  backgroundColor: 'var(--foreground)',
                  color: 'white',
                  display: 'inline-block',
                  border: '1px solid var(--border-color)'
                }}
              >
                浏览博客
              </Link>
              <Link 
                href="/about" 
                className="transition-colors"
                style={{
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: 'var(--foreground)',
                  display: 'inline-block',
                  border: '1px solid var(--border-color)'
                }}
              >
                关于我
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section style={{padding: '64px 0', backgroundColor: 'var(--background)'}}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center" style={{marginBottom: '48px'}}>
              <h2 className="feature-card-title" style={{fontSize: '24px', marginBottom: '16px'}}>
                特色文章
              </h2>
              <p className="feature-card-desc" style={{maxWidth: '32rem', margin: '0 auto'}}>
                精选的博客文章，涵盖技术、学习和思考
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{gap: '32px'}}>
              {featuredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            <div className="text-center" style={{marginTop: '48px'}}>
              <Link 
                href="/posts" 
                className="inline-flex items-center transition-colors"
                style={{
                  padding: '12px 24px',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  backgroundColor: 'white'
                }}
              >
                查看所有文章
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section style={{padding: '64px 0', backgroundColor: 'white', borderTop: '1px solid var(--border-color)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center" style={{gap: '48px'}}>
            <div>
              <h2 className="feature-card-title" style={{fontSize: '24px', marginBottom: '16px'}}>
                关于这个博客
              </h2>
              <p className="feature-card-desc" style={{marginBottom: '16px'}}>
                这是我的个人博客，在这里我分享关于前端开发、软件工程、设计思维以及个人成长的见解和经验。
              </p>
              <p className="feature-card-desc" style={{marginBottom: '32px'}}>
                我希望通过这个平台与更多的开发者交流，共同学习，共同进步。
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center transition-colors"
                style={{
                  padding: '12px 24px',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  backgroundColor: 'white'
                }}
              >
                了解更多
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="pattern-dots" style={{backgroundColor: 'var(--color-neutral-100)', borderRadius: '8px', height: '16rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-neutral-500)'}}>图片占位符</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{padding: '64px 0', backgroundColor: 'var(--foreground)', color: 'white', borderTop: '1px solid var(--border-color)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="feature-card-title" style={{marginBottom: '16px', color: 'white', fontSize: '24px'}}>
            订阅我的博客
          </h2>
          <p style={{marginBottom: '32px', maxWidth: '32rem', margin: '0 auto 32px', color: 'white', opacity: 0.9, fontSize: '16px', lineHeight: '1.6'}}>
            获取最新的博客文章和技术见解，直接发送到您的邮箱
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto" style={{gap: '12px'}}>
            <input
              type="email"
              placeholder="您的邮箱地址"
              className="flex-1 focus:outline-none transition-colors"
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                color: 'var(--foreground)',
                backgroundColor: 'white',
                border: '1px solid white',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px'
              }}
            />
            <button
              type="submit"
              className="transition-colors"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '14px',
                backgroundColor: 'white', 
                color: 'var(--foreground)',
                border: '1px solid white',
                cursor: 'pointer'
              }}
            >
              订阅
            </button>
          </form>
        </div>
      </section>
      </div>
    </>
  );
}
