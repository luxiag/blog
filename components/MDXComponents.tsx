"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkAdmonitionsCustom } from '@/lib/remark-admonitions-custom';
import * as runtime from 'react/jsx-runtime';
import dynamic from 'next/dynamic';
import Lightbox, { useLightbox } from './Lightbox';
import type { MediaItem } from './Lightbox';
import CodeBlock from './CodeBlock';
import '../styles/code-highlight.css';
import 'katex/dist/katex.min.css';
import { slugify } from '@/lib/slugify';
import { ChevronRight, HelpCircle } from 'lucide-react';
import CodeTabs from './CodeTabs';
import CodeAnnotation from './CodeAnnotation';
import Steps from './Steps';
import FileTree from './FileTree';
import DiffCompare from './DiffCompare';
import Glossary from './Glossary';
import ProgressIndicator from './ProgressIndicator';

// 用于追踪已使用的 heading ID，确保唯一性
// 使用 Map 来跟踪每个 baseId 出现的次数，与 extractToc 保持一致
const usedHeadingIds = new Map<string, number>();

function generateHeadingId(text: string): string {
  const baseId = slugify(text) || 'section';

  // 处理重复 - 使用与 extractToc 相同的逻辑
  const count = usedHeadingIds.get(baseId) || 0;
  let finalId = baseId;

  if (count > 0) {
    finalId = `${baseId}-${count}`;
  }

  usedHeadingIds.set(baseId, count + 1);
  return finalId;
}

const CodeRunner = dynamic(() => import('./CodeRunner'), { ssr: false });
const InteractiveComponent = dynamic(() => import('./InteractiveComponent'), { ssr: false });
const ShaderPreview = dynamic(() => import('./ShaderPreview'), { ssr: false });
const CodePenDemo = dynamic(() => import('./CodePenDemo'), { ssr: false });
const SqlSimulator = dynamic(() => import('./SqlSimulator'), { ssr: false });
const FunctionPlotter = dynamic(() => import('./FunctionPlotter'), { ssr: false });




const detailsArrowStyles = `
  .details-enhanced > summary {
    list-style: none;
  }
  .details-enhanced > summary::-webkit-details-marker { display: none; }
  .details-enhanced > summary::marker { display: none; }

  .details-body-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.3s ease;
    opacity: 0;
  }
  .details-enhanced[open] .details-body-wrapper {
    grid-template-rows: 1fr;
    opacity: 1;
  }
  .details-enhanced[open] .details-summary {
    border-bottom: 1px solid color-mix(in srgb, var(--color-neutral-200) 60%, transparent);
  }
  @media (prefers-color-scheme: dark) {
    .details-enhanced[open] .details-summary {
      border-bottom: 1px solid color-mix(in srgb, var(--color-neutral-700) 40%, transparent);
    }
  }
  .details-body-inner {
    overflow: hidden;
  }

  .details-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    padding: 5px 10px;
    background: oklch(0.22 0.01 260);
    color: #fff;
    font-size: 0.8125rem;
    line-height: 1.5;
    border-radius: 6px;
    white-space: nowrap;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 30;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
  .details-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    right: 12px;
    border: 5px solid transparent;
    border-top-color: oklch(0.22 0.01 260);
  }
  .details-hint-trigger:hover .details-tooltip {
    opacity: 1;
  }
  @media (prefers-color-scheme: dark) {
    .details-tooltip {
      background: oklch(0.35 0.01 260);
    }
    .details-tooltip::after {
      border-top-color: oklch(0.35 0.01 260);
    }
  }
  .glossary-term:hover .glossary-tooltip {
    opacity: 1;
  }
`;

function DetailsEnhanced({ title, hint, children }: { title: React.ReactNode; hint?: string; children: React.ReactNode }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const next = !isOpen;
    setIsOpen(next);
    if (detailsRef.current) {
      if (next) {
        detailsRef.current.setAttribute('open', '');
      } else {
        detailsRef.current.removeAttribute('open');
      }
    }
  }, [isOpen]);

  return (
    <details
      ref={detailsRef}
      className={`details-enhanced border border-neutral-200/80 dark:border-neutral-700/60 my-6 rounded-xl bg-gradient-to-br from-neutral-50/50 to-white dark:from-neutral-800/30 dark:to-neutral-900/50`}
    >
      <summary
        className="details-summary px-5 py-3.5 cursor-pointer font-sans font-medium text-[0.9375rem] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2.5 w-full rounded-t-xl"
        onClick={handleToggle}
      >
        <ChevronRight
          className={`w-4 h-4 text-neutral-400 dark:text-neutral-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : ''}`}
        />
        <span>{title}</span>
        {hint && (
          <span className="details-hint-trigger relative ml-auto shrink-0">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors" />
            <span className="details-tooltip">{hint}</span>
          </span>
        )}
      </summary>
          <div data-details-body className="details-body-wrapper overflow-hidden rounded-b-xl">
            <div className="details-body-inner">
              <div className="px-5 py-4 font-sans text-[1.0625rem] leading-[1.75] text-neutral-800 dark:text-neutral-300 [&_pre]:my-0">
                {children}
              </div>
            </div>
          </div>
    </details>
  );
}

interface MDXContentProps {
  content: string;
  isMdxCompiled?: boolean;
  category?: string;
}

export default function MDXContent({ content, isMdxCompiled, category }: MDXContentProps) {
  const lightbox = useLightbox();

  // 每次渲染新内容时清空已使用的 heading IDs
  useEffect(() => {
    usedHeadingIds.clear();
  }, [content]);

  // 缓存 remark/rehype 插件数组，避免每次渲染重新创建
  const remarkPlugins = useMemo(() => [
    remarkGfm,
    remarkMath,
    [remarkAdmonitionsCustom, { keywords: ['details', 'note', 'warning', 'tip', 'important', 'info'], format: 'html' }]
  ] as any[], []);

  const rehypePlugins = useMemo(() => [rehypeRaw, rehypeHighlight, rehypeKatex] as any[], []);

  const resolveImagePath = useCallback((src: string): string => {
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
      // Always use /posts/... path since images are served from public directory
      // Add basePath prefix for static export
      return `/blog/posts/${category}/images/${imageName}`;
    }
    return src;
  }, [category]);

  const handleImageClick = useCallback((e: React.MouseEvent, src: string) => {
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
  }, [lightbox]);

  const handleVideoClick = useCallback((e: React.MouseEvent, src: string) => {
    e.stopPropagation();
    lightbox.openLightbox([{ src, type: 'video' }], 0);
  }, [lightbox]);

  const CompiledMDX = useMemo(() => {
    if (!isMdxCompiled) return null;

    try {
      const fn = new Function(content);
      const result = fn.call(null, {
        Fragment: (runtime as unknown as { Fragment: unknown }).Fragment,
        jsx: (runtime as unknown as { jsx: unknown }).jsx,
        jsxs: (runtime as unknown as { jsxs: unknown }).jsxs,
        action: undefined, // Provide action for Next.js Server Actions
        requestAnimationFrame: typeof window !== 'undefined' ? window.requestAnimationFrame : undefined,
        cancelAnimationFrame: typeof window !== 'undefined' ? window.cancelAnimationFrame : undefined,
      });
      return (result as { default: unknown }).default;
    } catch (e) {
      return null;
    }
  }, [content, isMdxCompiled]);
  const extractText = (node: React.ReactNode): string => {
    if (node == null) return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      return extractText(element.props.children);
    }
    return '';
  };

  const mdxComponents: Record<string, React.ComponentType<any>> = useMemo(() => ({
    h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
      // <h1
      //   id={children?.toString().replace(/\s+/g, '-').toLowerCase()}
      //   className="font-sans text-3xl font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-6 mt-8"
      //   {...props}
      // >
      //   {children}
      // </h1>
      null
    ),
    h2: Object.assign(({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => {
      const id = slugify(extractText(children));
      return (
        <h2
          id={id}
          className="font-sans text-[1.65rem] font-bold text-neutral-900 dark:text-neutral-100 mt-14 mb-5 pb-2.5 border-b-2 border-neutral-900 dark:border-neutral-200 tracking-tight leading-snug"
          {...props}
        >
          {children}
        </h2>
      );
    }, { displayName: 'h2' }),
    h3: Object.assign(({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => {
      const id = slugify(extractText(children));
      return (
        <h3
          id={id}
          className="font-sans text-[1.25rem] font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-3 tracking-tight leading-snug"
          {...props}
        >
          {children}
        </h3>
      );
    }, { displayName: 'h3' }),
    h4: Object.assign(({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => {
      const id = slugify(extractText(children));
      return (
        <h4
          id={id}
          className="font-sans text-[1.1rem] font-bold text-neutral-800 dark:text-neutral-200 mt-8 mb-2 tracking-tight"
          {...props}
        >
          {children}
        </h4>
      );
    }, { displayName: 'h4' }),
    p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => (
      <p className="font-sans text-[1.0625rem] text-neutral-800 dark:text-neutral-300 leading-[1.75] mb-5 tracking-[0.01em]" {...props}>
        {children}
      </p>
    ),
    img: ({ src, alt, title, ...props }: React.ComponentPropsWithoutRef<'img'>) => {
      const imgSrc = typeof src === 'string' ? src : '';
      const resolvedSrc = resolveImagePath(imgSrc);
      return (
        <>
          <span className="relative group cursor-zoom-in inline-block my-8" onClick={(e) => resolvedSrc && handleImageClick(e, resolvedSrc)}>
            <img
              src={resolvedSrc}
              data-full-src={resolvedSrc}
              alt={alt || ''}
              title={title}
              loading="lazy"
              decoding="async"
              className="max-w-full h-auto transition-opacity duration-200 group-hover:opacity-95 shadow-[0_2px_12px_rgba(0,0,0,0.10)]"
              {...props}
            />
            {(alt || title) && (
              <span className="block text-center text-xs text-neutral-500 dark:text-neutral-500 mt-2 font-serif italic">
                {alt || title}
              </span>
            )}
          </span>

        </>
      );
    },
    video: ({ src, poster, controls, ...props }: React.ComponentPropsWithoutRef<'video'>) => {
      const videoSrc = typeof src === 'string' ? src : '';
      return (
        <>
          <span
            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm inline-block my-6"
            onClick={(e) => videoSrc && handleVideoClick(e, videoSrc)}
          >
            {poster ? (
              <span className="relative">
                <img src={poster} alt="" className="max-h-[400px] object-cover" />
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
          {controls && <span className="block text-sm text-neutral-500 mt-2 text-center">点击播放视频</span>}
        </>
      );
    },
    code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code
            className="bg-neutral-100 dark:bg-neutral-800 px-[0.35em] py-[0.1em] rounded-[3px] text-[0.875em] font-mono text-orange-700 dark:text-orange-400 border border-neutral-200 dark:border-neutral-700"
            {...props}
          >
            {children}
          </code>
        );
      }

      return null;
    },
    pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) => {
      const codeChild = React.Children.only(children) as React.ReactElement | null;
      const codeProps = (codeChild?.props || {}) as { className?: string; children?: React.ReactNode };
      const className = codeProps?.className || '';

      const codeString = extractText(codeProps?.children).trimEnd();
      const match = /language-(\w+)/.exec(className || '');
      const isRunnable = (match && codeString.includes('// 可运行')) ||
        (match && codeString.includes('// runnable'));

      if (isRunnable && match && (match[1] === 'javascript' || match[1] === 'js')) {
        return <CodeRunner code={codeString} language={match[1]} />;
      }

      return (
        <CodeBlock className={className} codeContent={codeString} />
      );

    },
    a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<'a'>) => {
      const isExternal = href?.startsWith('http');

      // 外部链接：保持原生 a 标签，新窗口打开
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-700 dark:text-orange-400 underline underline-offset-2 decoration-orange-700/40 dark:decoration-orange-400/40 hover:decoration-orange-700 dark:hover:decoration-orange-400 transition-colors"
            {...props}
          >
            {children}
            <svg className="inline-block w-3 h-3 ml-0.5 mb-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
      }

      // 内部链接：修正 /posts/category/slug → /posts/slug（slug 是路由的唯一标识）
      let resolvedHref = href || '/';

      // 内部链接：使用 Next.js 的 Link 组件，自动处理 basePath
      return (
        <Link
          href={resolvedHref}
          className="text-orange-700 dark:text-orange-400 underline underline-offset-2 decoration-orange-700/40 dark:decoration-orange-400/40 hover:decoration-orange-700 dark:hover:decoration-orange-400 transition-colors"
          {...props}
        >
          {children}
        </Link>
      );
    },
    blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote
        className="relative my-8 px-6 py-5 border-l-[3px] border-[#ea580c] bg-gradient-to-r from-[#ea580c]/5 to-transparent dark:from-[#ea580c]/10 dark:to-transparent rounded-r-lg font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed"
        {...props}
      >
        <span className="absolute top-3 left-4 text-[#ea580c]/20 dark:text-[#ea580c]/30 text-5xl font-sans leading-none select-none pointer-events-none" aria-hidden="true">&ldquo;</span>
        <span className="relative z-10 block pl-4">{children}</span>
      </blockquote>
    ),
    ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
      <ul className="my-5 text-neutral-800 dark:text-neutral-300 space-y-1.5 pl-5 list-disc marker:text-neutral-400 dark:marker:text-neutral-500" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
      <ol className="my-5 text-neutral-800 dark:text-neutral-300 space-y-1.5 pl-5 list-decimal marker:text-neutral-500 dark:marker:text-neutral-400" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) => (
      <li className="font-sans text-[1.0625rem] leading-[1.75]" {...props}>
        {children}
      </li>
    ),
    hr: () => (
      <div className="my-10 flex items-center gap-3 text-neutral-300 dark:text-neutral-600">
        <div className="flex-1 border-t border-current" />
        <span className="text-xs tracking-[0.3em] uppercase font-sans">&#10022;</span>
        <div className="flex-1 border-t border-current" />
      </div>
    ),
    strong: ({ children, ...props }: React.ComponentPropsWithoutRef<'strong'>) => (
      <strong className="font-bold text-neutral-900 dark:text-neutral-100" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: React.ComponentPropsWithoutRef<'em'>) => (
      <em className="italic text-neutral-700 dark:text-neutral-300" {...props}>
        {children}
      </em>
    ),
    del: ({ children, ...props }: React.ComponentPropsWithoutRef<'del'>) => (
      <del className="text-neutral-500 dark:text-neutral-500 line-through" {...props}>
        {children}
      </del>
    ),
    table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
      <div className="overflow-x-auto my-8 border-t-2 border-b border-neutral-900 dark:border-neutral-200">
        <table className="w-full min-w-full font-sans" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.ComponentPropsWithoutRef<'thead'>) => (
      <thead className="w-full border-b border-neutral-900 dark:border-neutral-300" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: React.ComponentPropsWithoutRef<'tbody'>) => (
      <tbody className="w-full divide-y divide-neutral-200 dark:divide-neutral-700" {...props}>
        {children}
      </tbody>
    ),
    th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
      <th
        className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 font-sans"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
      <td
        className="px-4 py-3 text-[0.9375rem] text-neutral-700 dark:text-neutral-400 leading-relaxed"
        {...props}
      >
        {children}
      </td>
    ),
    details: ({ children, ...props }: React.ComponentPropsWithoutRef<'details'> & { 'data-details-title'?: string; 'data-details-hint'?: string }) => {
      const detailsProps = props as { 'data-details-title'?: string; title?: string; 'data-details-hint'?: string };
      const titleFromAttr = detailsProps?.['data-details-title'] || detailsProps?.title;
      const hintFromAttr = detailsProps?.['data-details-hint'];

      const getSummaryContent = () => {
        if (titleFromAttr) {
          return titleFromAttr;
        }
        if (Array.isArray(children) && children.length > 0) {
          const firstChild = children[0];
          if (React.isValidElement(firstChild)) {
            const element = firstChild as React.ReactElement<{ children?: React.ReactNode }>;
            if (typeof firstChild.type === 'string' && firstChild.type === 'p') {
              return element.props.children;
            }
            if (element.props?.children) {
              return element.props.children;
            }
          }
          if (typeof firstChild === 'string') {
            return firstChild;
          }
        }
        return 'Details';
      };

      const getBodyContent = () => {
        if (titleFromAttr) {
          if (Array.isArray(children) && children.length > 0) {
            const firstChild = children[0];
            if (React.isValidElement(firstChild) && typeof firstChild.type === 'string' && firstChild.type === 'summary') {
              return children.slice(1);
            }
          }
          return children;
        }
        if (Array.isArray(children) && children.length > 0) {
          const firstChild = children[0];
          if (React.isValidElement(firstChild) && typeof firstChild.type === 'string' && firstChild.type === 'p') {
            return children.slice(1);
          }
          if (typeof firstChild === 'string') {
            return children.slice(1);
          }
        }
        return children;
      };

      return (
        <DetailsEnhanced
          title={getSummaryContent()}
          hint={hintFromAttr}
        >
          {getBodyContent()}
        </DetailsEnhanced>
      );
    },
    summary: ({ children, ...props }: React.ComponentPropsWithoutRef<'summary'>) => {
      return <summary {...props}>{children}</summary>;
    },
    CodeRunner,
    InteractiveComponent,
    ShaderPreview,
    CodePenDemo,
    codependemo: CodePenDemo,
    SqlSimulator,
    FunctionPlotter,
    CodeTabs,
    CodeAnnotation,
    Steps,
    FileTree,
    DiffCompare,
    Glossary,
    ProgressIndicator,
  }), [resolveImagePath, lightbox]);

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
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={mdxComponents}
        >
          {content || ''}
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
