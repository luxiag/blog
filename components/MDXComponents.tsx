"use client";

import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import * as runtime from 'react/jsx-runtime';
import CodeRunner from './CodeRunner';
import Lightbox, { useLightbox } from './Lightbox';
import type { MediaItem } from './Lightbox';
import CodePenDemo from './CodePenDemo';
import InteractiveComponent from './InteractiveComponent';
import ShaderPreview from './ShaderPreview';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

const detailsArrowStyles = `
  .details-wrapper > summary:before {
    content: "";
    border-width: 4px;
    border-style: solid;
    border-color: transparent transparent transparent currentColor;
    transition: transform 0.2s;
    transform-origin: 4px 50%;
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translateY(-50%) rotate(0);
  }
  .details-wrapper[open] > summary:before {
    transform: translateY(-50%) rotate(90deg);
  }
  .details-wrapper > summary {
    position: relative;
    padding-left: 24px;
    list-style: none;
  }
  .details-wrapper > summary::-webkit-details-marker {
    display: none;
  }
  .details-wrapper > summary::marker {
    display: none;
  }
`;

interface MDXContentProps {
  content: string;
  isMdxCompiled?: boolean;
  category?: string;
}

// 定义默认的 MDX 组件映射
const defaultComponents = {
  h1: ({ children, ...props }: any) => (
    <h1
      id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--foreground)",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "var(--spacing-md)",
      }}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2
      id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--foreground)",
        marginTop: "var(--spacing-3xl)",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "var(--spacing-sm)",
      }}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3
      id={children?.toString().replace(/\s+/g, "-").toLowerCase()}
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--foreground)",
        marginTop: "var(--spacing-2xl)",
      }}
      {...props}
    >
      {children}
    </h3>
  ),
  img: ({ src, alt, ...props }: any) => (
    <div style={{ margin: "1.5rem 0" }}>
      <img
        src={src}
        alt={alt}
        style={{
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-subtle)",
          maxWidth: "100%",
          height: "auto",
        }}
        {...props}
      />
      {alt && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            marginTop: "0.5rem",
            fontStyle: "italic",
            color: "var(--color-neutral-500)",
          }}
        >
          {alt}
        </p>
      )}
    </div>
  ),
  pre: ({ children, ...props }: any) => (
    <pre
      style={{
        backgroundColor: "white",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
        overflowX: "auto",
        border: "1px solid var(--border-color)",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        lineHeight: "1.6",
      }}
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }: any) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          style={{
            backgroundColor: "var(--color-neutral-100)",
            padding: "0.125em 0.25em",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.875em",
            fontFamily: "var(--font-mono)",
          }}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "var(--color-orange-800)", textDecoration: "underline" }}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      style={{
        borderLeft: "4px solid var(--color-orange-800)",
        paddingLeft: "var(--spacing-lg)",
        padding: "var(--spacing-lg)",
        margin: "var(--spacing-lg) 0",
        fontStyle: "italic",
        backgroundColor: "var(--color-neutral-100)",
      }}
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: any) => (
    <div style={{ overflowX: "auto", margin: "var(--spacing-2xl) 0" }}>
      <table
        style={{ minWidth: "100%", borderBottom: "1px solid var(--border-color)" }}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead style={{ backgroundColor: "var(--color-neutral-100)" }} {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th
      style={{
        padding: "var(--spacing-md) var(--spacing-lg)",
        textAlign: "left",
        fontSize: "0.75rem",
        fontWeight: "600",
        color: "var(--foreground)",
        borderBottom: "1px solid var(--border-color)",
      }}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td
      style={{
        padding: "var(--spacing-md) var(--spacing-lg)",
        whiteSpace: "nowrap",
        fontSize: "0.875rem",
        color: "var(--color-neutral-500)",
        borderBottom: "1px solid var(--border-color)",
      }}
      {...props}
    >
      {children}
    </td>
  ),
  CodeRunner,
  InteractiveComponent,
  ShaderPreview,
  CodePenDemo,
};

export default function MDXContent({ content, isMdxCompiled, category }: MDXContentProps) {
  // 直接使用定义的 defaultComponents，不再依赖外部的 useMDXComponents
  const mdxComponents = defaultComponents;
  const lightbox = useLightbox();

  const resolveImagePath = (src: string): string => {
    if (!src) return src;
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }
    if (src.startsWith('/')) {
      return src;
    }
    if (category && (src.startsWith('./') || !src.startsWith('/'))) {
      let imageName = src.replace(/^\.\//, '');
      if (imageName.startsWith('images/')) {
        imageName = imageName.replace(/^images\//, '');
      }
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) {
        return `/api/posts/${category}/images/${imageName}`;
      }
      return `/posts/${category}/images/${imageName}`;
    }
    return src;
  };

  const handleImageClick = (e: React.MouseEvent, src: string) => {
    e.stopPropagation();
    const clickedSrc = src;
    const allImages = document.querySelectorAll('.mdx-content img[data-full-src]');
    const items: MediaItem[] = Array.from(allImages).map((img) => ({
      src: (img as HTMLImageElement).dataset.fullSrc || (img as HTMLImageElement).src,
      alt: (img as HTMLImageElement).alt,
      type: 'image' as const,
    }));
    const index = Array.from(allImages).findIndex((img) => (img as HTMLImageElement).dataset.fullSrc === clickedSrc || (img as HTMLImageElement).src === clickedSrc);
    lightbox.openLightbox(items, index >= 0 ? index : 0);
  };

  const handleVideoClick = (e: React.MouseEvent, src: string) => {
    e.stopPropagation();
    lightbox.openLightbox([{ src, type: 'video' }], 0);
  };

  const CompiledMDX = useMemo(() => {
    if (!isMdxCompiled) return null;
    
    try {
      const fn = new Function(content);
      const result = fn.call(null, {
        Fragment: (runtime as unknown as { Fragment: unknown }).Fragment,
        jsx: (runtime as unknown as { jsx: unknown }).jsx,
        jsxs: (runtime as unknown as { jsxs: unknown }).jsxs,
      });
      return (result as { default: unknown }).default;
    } catch (e) {
      console.error('Error rendering MDX:', e);
      return null;
    }
  }, [content, isMdxCompiled]);

  if (isMdxCompiled && CompiledMDX) {
    const MDXComponent = CompiledMDX as React.ComponentType<{ components: Record<string, React.ComponentType> }>;
    return (
      <>
        <style>{detailsArrowStyles}</style>
        <div className="mdx-content">
          <MDXComponent components={mdxComponents} />
        </div>
        <Lightbox
          isOpen={lightbox.isOpen}
          onClose={lightbox.closeLightbox}
          items={lightbox.items}
          initialIndex={lightbox.initialIndex}
        />
      </>
    );
  }

  return (
    <>
      <style>{detailsArrowStyles}</style>
      <div className="mdx-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
          components={{
            ...mdxComponents,
            // 覆盖一些 ReactMarkdown 特有的或需要特殊处理的组件
            img: ({ src, alt, title, ...props }: React.ComponentPropsWithoutRef<'img'>) => {
              const imgSrc = typeof src === 'string' ? src : '';
              const resolvedSrc = resolveImagePath(imgSrc);
              return (
                <span className="block my-6">
                  <span className="relative group cursor-zoom-in inline-block" onClick={(e) => resolvedSrc && handleImageClick(e, resolvedSrc)}>
                    <img
                      src={resolvedSrc}
                      data-full-src={resolvedSrc}
                      alt={alt || ''}
                      title={title}
                      className="rounded-lg shadow-sm max-w-full h-auto transition-transform duration-200 group-hover:scale-[1.01]"
                      {...props}
                    />
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors" />
                  </span>
                  {alt && (
                    <figcaption className="block text-center text-sm mt-3 italic text-neutral-500">
                      {alt}
                    </figcaption>
                  )}
                </span>
              );
            },
            video: ({ src, poster, controls, ...props }: React.ComponentPropsWithoutRef<'video'>) => {
              const videoSrc = typeof src === 'string' ? src : '';
              return (
                <span className="block my-6">
                  <span 
                    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm inline-block"
                    onClick={(e) => videoSrc && handleVideoClick(e, videoSrc)}
                  >
                    {poster ? (
                      <span className="relative">
                        <img src={poster} alt="" data-full-src={poster} className="max-h-[400px] object-cover" />
                        <span className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </span>
                    ) : (
                      <span className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-lg">
                        <span className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                          <svg className="w-8 h-8 ml-1 text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    )}
                  </span>
                  {controls && <p className="text-sm text-neutral-500 mt-2 text-center">点击播放视频</p>}
                </span>
              );
            },
            // 保留 ReactMarkdown 特有的代码块处理逻辑（如果是内联代码则使用 code，如果是块级代码则使用 pre+code）
            // 注意：这里我们复用了 defaultComponents 的样式，但逻辑稍有不同
            code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
              const match = /language-(\w+)/.exec(className || '');
              const codeText = String(children).replace(/\n$/, '');
              const isInline = !className;

              const isRunnable = (match && codeText.includes('// 可运行')) ||
                (match && codeText.includes('// runnable'));

              if (!isInline && match) {
                if (isRunnable && (match[1] === 'javascript' || match[1] === 'js')) {
                  return <CodeRunner code={codeText} language={match[1]} />;
                }
              }
              
              if (isInline) {
                return (
                  <code
                    className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono text-orange-600 dark:text-orange-400"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return null; // 让 pre 处理块级代码
            },
            pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) => {
              const codeChild = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
              const codeProps = codeChild?.props || {};
              const className = codeProps.className || '';
              
              return (
                <div className="my-4">
                  <pre
                    className="bg-white dark:bg-neutral-900 rounded-lg p-4 overflow-x-auto border border-neutral-200 dark:border-neutral-700 font-mono text-sm leading-6 text-neutral-800 dark:text-neutral-200"
                    {...props}
                  >
                    <code className={className}>{codeProps.children}</code>
                  </pre>
                </div>
              );
            },
            details: ({ children, ...props }: React.ComponentPropsWithoutRef<'details'>) => {
              const detailsProps = props as { 'data-details-title'?: string };
              const titleFromAttr = detailsProps?.['data-details-title'];
              
              const getSummaryContent = () => {
                if (Array.isArray(children) && children.length > 0) {
                  const firstChild = children[0] as React.ReactElement<{ children?: React.ReactNode }>;
                  if (firstChild?.props?.children) {
                    return firstChild.props.children;
                  }
                }
                return titleFromAttr || 'Details';
              };

              const getBodyContent = () => {
                if (Array.isArray(children)) {
                  return children.slice(1);
                }
                return children;
              };

              return (
                <details
                  className="details-wrapper border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
                  {...props}
                >
                  <summary className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 cursor-pointer font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    {getSummaryContent()}
                  </summary>
                  <div className="p-4 bg-white dark:bg-neutral-900 [&>.my-4]:my-0">
                    {getBodyContent()}
                  </div>
                </details>
              );
            },
            summary: ({ children, ...props }: React.ComponentPropsWithoutRef<'summary'>) => {
              return <div style={{ display: 'contents' }}>{children}</div>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <Lightbox
        isOpen={lightbox.isOpen}
        onClose={lightbox.closeLightbox}
        items={lightbox.items}
        initialIndex={lightbox.initialIndex}
      />
    </>
  );
}
