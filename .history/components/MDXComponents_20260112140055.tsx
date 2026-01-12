
"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import CodeRunner from './CodeRunner';
import InteractiveComponent from './InteractiveComponent';
import { parseInteractiveMarkdown, processMarkdownContent } from '@/lib/mdxParser';
import 'highlight.js/styles/github.css';

interface MDXComponentsProps {
  content: string;
}

export default function MDXComponents({ content }: MDXComponentsProps) {
  const [processedContent, setProcessedContent] = useState(content);
  const [interactiveComponents, setInteractiveComponents] = useState<Array<{ id: string; content: string }>>([]);

  useEffect(() => {
    // 处理Markdown内容，提取交互式组件
    const { processedContent: newContent, interactiveComponents: components } = processMarkdownContent(content);
    setProcessedContent(newContent);
    setInteractiveComponents(components);
  }, [content]);

  // 渲染交互式组件
  const renderInteractiveComponent = (id: string) => {
    const component = interactiveComponents.find(c => c.id === id);
    if (!component) return null;

    const parsed = parseInteractiveMarkdown(component.content);
    if (!parsed) return null;

    return <InteractiveComponent key={id} html={parsed.html} script={parsed.script} />;
  };

  // 自定义渲染函数，处理交互式组件占位符
  const renderNode = (node: any, index: number) => {
    // 检查是否是交互式组件占位符
    if (node.type === 'comment' && node.value.startsWith('interactive-component-')) {
      return renderInteractiveComponent(node.value);
    }

    // 默认渲染
    return null;
  };

  return (
    <div className="mdx-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        style={{ fontFamily: 'var(--font-sans)', color: 'var(--foreground)', maxWidth: 'none', fontSize: '1.125rem', lineHeight: '1.75' }}
        components={{
          // 自定义标题渲染，添加锚点
          h1: ({ children, ...props }) => (
            <h1
              id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--foreground)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--spacing-md)' }}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--foreground)', marginTop: 'var(--spacing-3xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--spacing-sm)' }}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--foreground)', marginTop: 'var(--spacing-2xl)' }}
              {...props}
            >
              {children}
            </h3>
          ),
          // 自定义图片渲染
          img: ({ src, alt, ...props }) => (
            <div style={{ margin: '1.5rem 0' }}>
              <img
                src={src}
                alt={alt}
                style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-subtle)', maxWidth: '100%', height: 'auto' }}
                {...props}
              />
              {alt && <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--color-neutral-500)' }}>{alt}</p>}
            </div>
          ),
          // 自定义代码块渲染
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeText = String(children).replace(/\n$/, '');

            // 检查是否是可运行代码块
            const isRunnable = props['data-runnable'] === 'true' ||
              (match && codeText.includes('// 可运行')) ||
              (match && codeText.includes('// runnable'));

            if (!inline && match) {
              // 如果是可运行代码，使用CodeRunner组件
              if (isRunnable && (match[1] === 'javascript' || match[1] === 'js')) {
                return <CodeRunner code={codeText} language={match[1]} />;
              }

              // 普通代码块
              return (
                <pre
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-lg)',
                    overflowX: 'auto',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}
                >
                  <code {...props}>
                    {children}
                  </code>
                </pre>
              );
            } else {
              // 内联代码
              return (
                <code
                  style={{
                    backgroundColor: 'var(--color-neutral-100)',
                    padding: '0.125em 0.25em',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875em',
                    fontFamily: 'var(--font-mono)'
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
          },
          // 自定义链接渲染
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-orange-800)', textDecoration: 'underline' }}
              {...props}
            >
              {children}
            </a>
          ),
          // 自定义引用块渲染
          blockquote: ({ children, ...props }) => (
            <blockquote
              style={{
                borderLeft: '4px solid var(--color-orange-800)',
                paddingLeft: 'var(--spacing-lg)',
                padding: 'var(--spacing-lg)',
                margin: 'var(--spacing-lg) 0',
                fontStyle: 'italic',
                backgroundColor: 'var(--color-neutral-100)'
              }}
              {...props}
            >
              {children}
            </blockquote>
          ),
          // 自定义表格渲染
          table: ({ children, ...props }) => (
            <div style={{ overflowX: 'auto', margin: 'var(--spacing-2xl) 0' }}>
              <table style={{ minWidth: '100%', borderBottom: '1px solid var(--border-color)' }} {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead style={{ backgroundColor: 'var(--color-neutral-100)' }} {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--foreground)',
                borderBottom: '1px solid var(--border-color)'
              }}
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem',
                color: 'var(--color-neutral-500)',
                borderBottom: '1px solid var(--border-color)'
              }}
              {...props}
            >
              {children}
            </td>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
