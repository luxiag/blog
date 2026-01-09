
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">关于博客</h3>
            <p className="text-gray-600 text-sm">
              这是我的个人博客，分享技术、生活与思考。希望我的文章能够给你带来启发和帮助。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  博客文章
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  关于我
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">联系方式</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  your.email@example.com
                </a>
              </li>
              <li>
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} 我的博客. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
