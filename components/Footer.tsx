import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-200 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-medium text-gray-1000 dark:text-gray-1000 mb-4 text-[14px]">关于博客</h4>
            <p className="text-[14px] text-gray-500 dark:text-gray-500 leading-[20px]">
              这是我的个人博客，分享技术、生活与思考。希望我的文章能够给你带来启发和帮助。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-1000 dark:text-gray-1000 mb-4 text-[14px]">快速链接</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/posts" className="text-[14px] text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors leading-[20px]">
                  博客文章
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[14px] text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors leading-[20px]">
                  关于我
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-1000 dark:text-gray-1000 mb-4 text-[14px]">联系方式</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="mailto:your.email@example.com" className="text-[14px] text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors leading-[20px]">
                  your.email@example.com
                </a>
              </li>
              <li>
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors leading-[20px]">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors leading-[20px]">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-200">
          <p className="text-center text-[14px] text-gray-500 dark:text-gray-500">
            &copy; {currentYear} 我的博客. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
