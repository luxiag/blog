import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl font-bold text-neutral-200 dark:text-neutral-800 mb-4">404</div>
      <h1 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">页面未找到</h1>
      <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">请求的文章不存在或已被移除</p>
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#ea580c] text-white text-sm font-medium hover:bg-[#c2410c] transition-colors"
      >
        返回文章列表
      </Link>
    </div>
  );
}
