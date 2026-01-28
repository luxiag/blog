import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">关于博客</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              这是我的个人博客，分享技术、生活与思考。希望我的文章能够给你带来启发和帮助。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">快速链接</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  博客文章
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  关于我
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">联系方式</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="mailto:your.email@example.com" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  your.email@example.com
                </a>
              </li>
              <li>
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-center text-xs text-neutral-500 font-mono">
            &copy; {currentYear} 我的博客. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
