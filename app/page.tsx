import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import BlogCard from '@/components/BlogCard';

export default async function Home() {
  const posts = await getAllPosts();
  const featuredPosts = posts.slice(0, 3); // 获取前三篇文章作为特色文章

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              欢迎来到我的博客
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              分享技术见解、学习心得和思考感悟的地方
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/blog" 
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                浏览博客
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-3 bg-transparent text-white border border-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                关于我
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                特色文章
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                精选的博客文章，涵盖技术、学习和思考
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                查看所有文章
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                关于这个博客
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                这是我的个人博客，在这里我分享关于前端开发、软件工程、设计思维以及个人成长的见解和经验。
              </p>
              <p className="text-lg text-gray-600 mb-8">
                我希望通过这个平台与更多的开发者交流，共同学习，共同进步。
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                了解更多
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-gray-200 rounded-lg h-64 md:h-96 flex items-center justify-center">
              <span className="text-gray-500">图片占位符</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            订阅我的博客
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            获取最新的博客文章和技术见解，直接发送到您的邮箱
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="您的邮箱地址"
              className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              订阅
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
