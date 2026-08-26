
import { getAllCategoriesWithPosts, CategoryWithPosts } from '@/lib/markdown';
import DocLayout from '@/components/DocLayout';
import Link from 'next/link';

export default function PostsIndexPage() {
  const allCategoriesWithPosts = getAllCategoriesWithPosts();

  return (
    <DocLayout toc={[]} allCategoriesWithPosts={allCategoriesWithPosts}>
      <div>
        <h1 className="text-[2.25rem] font-bold tracking-tight leading-[1.2] mb-2 text-gray-1000 dark:text-gray-1000">
          Docs
        </h1>
        <p className="text-gray-900 dark:text-gray-900 mb-8">
          技术文档与教程，按分类浏览所有文章。
        </p>

        <div className="space-y-10">
          {allCategoriesWithPosts.map((cat) => (
            <section key={cat.category}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-1000 dark:text-gray-1000 mb-4 capitalize">
                {cat.category}
              </h2>
              <ul className="space-y-1">
                {cat.posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="group flex flex-col rounded-md py-2 px-2 -mx-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <span className="text-sm font-medium text-gray-1000 dark:text-gray-1000 group-hover:text-[var(--link-color)] transition-colors">
                        {post.title}
                      </span>
                      {post.description && (
                        <span className="text-sm text-gray-900 dark:text-gray-900 mt-0.5 line-clamp-2">
                          {post.description}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </DocLayout>
  );
}
