"use client";

import React, { useState, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import * as runtime from 'react/jsx-runtime';
import Lightbox, { useLightbox } from './Lightbox';
import type { MediaItem } from './Lightbox';
import CodeRunner from './CodeRunner';
import InteractiveComponent from './InteractiveComponent';
import ShaderPreview from './ShaderPreview';
import CodePenDemo from './CodePenDemo';
import SqlSimulator from './SqlSimulator';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

const MAX_CODE_LINES = 15;

function CodeBlock({ children, className, ...props }: { children: React.ReactNode; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const codeChild = children as React.ReactElement<{ children?: React.ReactNode }>;
  const codeContent = codeChild?.props?.children || '';
  const codeString = typeof codeContent === 'string' ? codeContent : '';
  const lines = codeString.split('\n');
  const showGradient = lines.length > MAX_CODE_LINES && !isExpanded;

  const displayLines = isExpanded ? lines : lines.slice(0, MAX_CODE_LINES);
  const displayContent = displayLines.join('\n');

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className="relative my-4">
      <div className={`overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 ${!isExpanded ? 'max-h-[400px]' : ''}`}>
        <pre
          className="p-4 overflow-x-auto font-mono text-sm leading-6 text-neutral-800 dark:text-neutral-200 m-0"
          {...props}
        >
          <code className={className}>{displayContent}</code>
        </pre>
        {showGradient && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />
        )}
      </div>
      {lines.length > MAX_CODE_LINES && (
        <button
          onClick={toggleExpand}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-mono rounded-full shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer z-10"
        >
          {isExpanded ? '收起代码' : `展开全部 (${lines.length} 行)`}
        </button>
      )}
    </div>
  );
}

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

export default function MDXContent({ content, isMdxCompiled, category }: MDXContentProps) {
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

  const mdxComponents: Record<string, React.ComponentType<any>> = {
    h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
      <h1
        id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
        className="font-sans text-3xl font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-6 mt-8"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
      <h2
        id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
        className="font-sans text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-12 mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
      <h3
        id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
        className="font-sans text-xl font-semibold text-neutral-900 dark:text-neutral-100 mt-10 mb-3"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
      <h4
        id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
        className="font-sans text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-8 mb-2"
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => (
      <p className="text-neutral-700 dark:text-neutral-300 leading-7 mb-4" {...props}>
        {children}
      </p>
    ),
    img: ({ src, alt, title, ...props }: React.ComponentPropsWithoutRef<'img'>) => {
      const imgSrc = typeof src === 'string' ? src : '';
      const resolvedSrc = resolveImagePath(imgSrc);
      return (
        <figure className="my-6">
          <div className="relative group cursor-zoom-in inline-block" onClick={(e) => resolvedSrc && handleImageClick(e, resolvedSrc)}>
            <img
              src={resolvedSrc}
              data-full-src={resolvedSrc}
              alt={alt || ''}
              title={title}
              className="rounded-lg shadow-sm max-w-full h-auto transition-transform duration-200 group-hover:scale-[1.01]"
              {...props}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors" />
          </div>
          {alt && (
            <figcaption className="text-center text-sm mt-3 italic text-neutral-500">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },
    video: ({ src, poster, controls, ...props }: React.ComponentPropsWithoutRef<'video'>) => {
      const videoSrc = typeof src === 'string' ? src : '';
      return (
        <figure className="my-6">
          <div 
            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm inline-block"
            onClick={(e) => videoSrc && handleVideoClick(e, videoSrc)}
          >
            {poster ? (
              <div className="relative">
                <img src={poster} alt="" className="max-h-[400px] object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-lg">
                <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  <svg className="w-8 h-8 ml-1 text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          {controls && <p className="text-sm text-neutral-500 mt-2 text-center">点击播放视频</p>}
        </figure>
      );
    },
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

      return null;
    },
    pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) => {
      const codeChild = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
      const codeProps = codeChild?.props || {};
      const className = codeProps.className || '';
      
      return (
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
      );
    },
    a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<'a'>) => {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-orange-600 hover:text-orange-700 underline transition-colors"
          {...props}
        >
          {children}
          {isExternal && (
            <svg className="inline-block w-3 h-3 ml-0.5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </a>
      );
    },
    blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote
        className="border-l-4 border-orange-600 pl-4 py-3 my-4 italic bg-neutral-50 dark:bg-neutral-800/50 rounded-r-lg text-neutral-700 dark:text-neutral-300"
        {...props}
      >
        {children}
      </blockquote>
    ),
    ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
      <ul className="list-disc list-inside my-4 text-neutral-700 dark:text-neutral-300 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
      <ol className="list-decimal list-inside my-4 text-neutral-700 dark:text-neutral-300 space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),
    hr: () => (
      <hr className="my-8 border-neutral-200 dark:border-neutral-700" />
    ),
    strong: ({ children, ...props }: React.ComponentPropsWithoutRef<'strong'>) => (
      <strong className="font-semibold text-neutral-900 dark:text-neutral-100" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: React.ComponentPropsWithoutRef<'em'>) => (
      <em className="italic text-neutral-700 dark:text-neutral-300" {...props}>
        {children}
      </em>
    ),
    del: ({ children, ...props }: React.ComponentPropsWithoutRef<'del'>) => (
      <del className="text-neutral-500 dark:text-neutral-400 line-through" {...props}>
        {children}
      </del>
    ),
    table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
      <div className="overflow-x-auto my-8 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="min-w-full" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.ComponentPropsWithoutRef<'thead'>) => (
      <thead className="bg-neutral-100 dark:bg-neutral-800" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: React.ComponentPropsWithoutRef<'tbody'>) => (
      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700" {...props}>
        {children}
      </tbody>
    ),
    th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
      <th
        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
      <td
        className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400"
        {...props}
      >
        {children}
      </td>
    ),
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
          <summary className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 cursor-pointer font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors list-none">
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
    CodeRunner,
    InteractiveComponent,
    ShaderPreview,
    CodePenDemo,
    SqlSimulator,
  };

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
          components={mdxComponents}
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
