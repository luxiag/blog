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

const usedHeadingIds = new Map<string, number>();

function generateHeadingId(text: string): string {
  const baseId = slugify(text) || 'section';
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
    border-bottom: 1px solid color-mix(in srgb, var(--color-gray-200) 60%, transparent);
  }
  .details-body-inner {
    overflow: hidden;
  }

  .details-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    padding: 5px 10px;
    background: var(--color-gray-1000);
    color: var(--background);
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
    border-top-color: var(--color-gray-1000);
  }
  .details-hint-trigger:hover .details-tooltip {
    opacity: 1;
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
      className={`details-enhanced border border-gray-200 dark:border-gray-200 my-6 rounded-lg bg-background`}
    >
      <summary
        className="details-summary px-4 py-3 cursor-pointer font-sans font-medium text-[0.9375rem] text-gray-1000 dark:text-gray-1000 hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors flex items-center gap-2.5 w-full rounded-t-lg"
        onClick={handleToggle}
      >
        <ChevronRight
          className={`w-4 h-4 text-gray-500 dark:text-gray-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : ''}`}
        />
        <span>{title}</span>
        {hint && (
          <span className="details-hint-trigger relative ml-auto shrink-0">
            <HelpCircle className="w-3.5 h-3.5 text-gray-300 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 transition-colors" />
            <span className="details-tooltip">{hint}</span>
          </span>
        )}
      </summary>
      <div data-details-body className="details-body-wrapper overflow-hidden rounded-b-lg">
        <div className="details-body-inner">
          <div className="px-4 py-4 font-sans text-[0.9375rem] leading-[1.7] text-gray-900 dark:text-gray-900 [&_pre]:my-0">
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

  useEffect(() => {
    usedHeadingIds.clear();
  }, [content]);

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
      return `/blog/posts/${category}/images/${imageName}`;
    }
    return src;
  }, [category]);

  const handleImageClick = useCallback((e: React.MouseEvent, src: string) => {
    e.stopPropagation();
    const clickedSrc = src;
    const allImages = document.querySelectorAll('.prose img[data-full-src]');
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
        action: undefined,
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
    h1: () => null,
    h2: Object.assign(({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => {
      const id = slugify(extractText(children));
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      );
    }, { displayName: 'h2' }),
    h3: Object.assign(({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => {
      const id = slugify(extractText(children));
      return (
        <h3 id={id} {...props}>
          {children}
        </h3>
      );
    }, { displayName: 'h3' }),
    h4: Object.assign(({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => {
      const id = slugify(extractText(children));
      return (
        <h4 id={id} {...props}>
          {children}
        </h4>
      );
    }, { displayName: 'h4' }),
    p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => (
      <p {...props}>{children}</p>
    ),
    img: ({ src, alt, title, ...props }: React.ComponentPropsWithoutRef<'img'>) => {
      const imgSrc = typeof src === 'string' ? src : '';
      const resolvedSrc = resolveImagePath(imgSrc);
      return (
        <>
          <span className="relative group cursor-zoom-in inline-block my-6" onClick={(e) => resolvedSrc && handleImageClick(e, resolvedSrc)}>
            <img
              src={resolvedSrc}
              data-full-src={resolvedSrc}
              alt={alt || ''}
              title={title}
              loading="lazy"
              decoding="async"
              className="max-w-full h-auto transition-opacity duration-200 group-hover:opacity-95 rounded-lg border border-gray-200 dark:border-gray-200"
              {...props}
            />
            {(alt || title) && (
              <span className="block text-center text-xs text-gray-500 dark:text-gray-500 mt-2 font-sans italic">
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
            className="relative group cursor-pointer rounded-lg overflow-hidden inline-block my-6 border border-gray-200 dark:border-gray-200"
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
              <span className="w-full h-48 bg-gray-100 dark:bg-gray-100 flex items-center justify-center rounded-lg">
                <span className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-200 flex items-center justify-center">
                  <svg className="w-8 h-8 ml-1 text-gray-500 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            )}
          </span>
          {controls && <span className="block text-sm text-gray-500 dark:text-gray-500 mt-2 text-center">点击播放视频</span>}
        </>
      );
    },
    code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code {...props}>
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

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
            <svg className="inline-block w-3 h-3 ml-0.5 mb-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
      }

      let resolvedHref = href || '/';

      return (
        <Link
          href={resolvedHref}
          {...props}
        >
          {children}
        </Link>
      );
    },
    blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote {...props}>
        {children}
      </blockquote>
    ),
    ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
      <ul {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
      <ol {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) => (
      <li {...props}>{children}</li>
    ),
    hr: () => (
      <hr />
    ),
    strong: ({ children, ...props }: React.ComponentPropsWithoutRef<'strong'>) => (
      <strong {...props}>{children}</strong>
    ),
    em: ({ children, ...props }: React.ComponentPropsWithoutRef<'em'>) => (
      <em {...props}>{children}</em>
    ),
    del: ({ children, ...props }: React.ComponentPropsWithoutRef<'del'>) => (
      <del {...props}>{children}</del>
    ),
    table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
      <div className="overflow-x-auto my-6 border-t border-b border-gray-200 dark:border-gray-200">
        <table {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.ComponentPropsWithoutRef<'thead'>) => (
      <thead {...props}>{children}</thead>
    ),
    tbody: ({ children, ...props }: React.ComponentPropsWithoutRef<'tbody'>) => (
      <tbody {...props}>{children}</tbody>
    ),
    th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
      <th {...props}>{children}</th>
    ),
    td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
      <td {...props}>{children}</td>
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
          <div className="prose">
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
      <div className="prose">
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
