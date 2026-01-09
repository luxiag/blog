
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';

interface MDXComponentsProps {
  content: string;
}

export default function MDXComponents({ content }: MDXComponentsProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      className="prose prose-lg max-w-none"
      components={{
        // 自定义标题渲染，添加锚点
        h1: ({ children, ...props }) => (
          <h1 id={children?.toString().replace(/\s+/g, '-').toLowerCase()} {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 id={children?.toString().replace(/\s+/g, '-').toLowerCase()} {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 id={children?.toString().replace(/\s+/g, '-').toLowerCase()} {...props}>
            {children}
          </h3>
        ),
        // 自定义图片渲染
        img: ({ src, alt, ...props }) => (
          <div className="my-6">
            <img
              src={src}
              alt={alt}
              className="rounded-lg shadow-md max-w-full h-auto"
              {...props}
            />
            {alt && <p className="text-center text-sm text-gray-500 mt-2 italic">{alt}</p>}
          </div>
        ),
        // 自定义代码块渲染
        code: ({ inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          );
        },
        // 自定义链接渲染
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
            {...props}
          >
            {children}
          </a>
        ),
        // 自定义引用块渲染
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600"
            {...props}
          >
            {children}
          </blockquote>
        ),
        // 自定义表格渲染
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full divide-y divide-gray-200" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-gray-50" {...props}>
            {children}
          </thead>
        ),
        th: ({ children, ...props }) => (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props}>
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
