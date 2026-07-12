"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface MermaidDiagramProps {
  code: string;
}

const MIN_SCALE = 0.4;
const MAX_SCALE = 3;
const SCALE_STEP = 0.2;

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const FONT_FAMILY =
  "'ChineseHandwrittenLocal', 'ZCOOL KuaiLe', 'LXGW WenKai', 'Segoe Print', cursive";

// 主题色
const BRAND = "#ea580c";

// 缓存 mermaid 实例，避免重复导入
let mermaidPromise: Promise<any> | null = null;
async function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => m.default);
  }
  return mermaidPromise;
}

// 预加载 mermaid（在组件外部调用）
if (typeof window !== "undefined") {
  // 延迟预加载，不阻塞首屏
  setTimeout(() => getMermaid(), 1000);
}

// 只注入一次全局字体，供 mermaid 渲染出来的内联 SVG / foreignObject 使用。
let fontInjected = false;
function ensureFontInjected() {
  if (fontInjected || typeof document === "undefined") return;
  fontInjected = true;
  const style = document.createElement("style");
  style.setAttribute("data-mermaid-font", "true");
  style.textContent = `
    @font-face {
      font-family: 'ChineseHandwrittenLocal';
      src: url('${BASE_PATH}/fonts/ZCOOLKuaiLe-Regular.ttf') format('truetype');
      font-display: swap;
    }
    .mermaid-diagram-svg svg,
    .mermaid-diagram-svg svg text,
    .mermaid-diagram-svg svg tspan,
    .mermaid-diagram-svg foreignObject span,
    .mermaid-diagram-svg foreignObject div,
    .mermaid-diagram-svg foreignObject p {
      font-family: ${FONT_FAMILY} !important;
    }
    /* 让 mermaid 的 svg 撑满其容器，缩放 / 拖拽由外层 transform 控制 */
    .mermaid-diagram-svg svg {
      max-width: none !important;
      height: auto;
      display: block;
    }
  `;
  document.head.appendChild(style);
}

// 每次渲染用唯一 id，避免 mermaid 复用同一 id 造成 DOM 冲突
let renderSeq = 0;

function buildThemeVariables(isDark: boolean) {
  if (isDark) {
    return {
      darkMode: true,
      fontFamily: FONT_FAMILY,
      fontSize: "20px",
      background: "#0a0a0a",
      primaryColor: "#431407", // 节点填充：深橙棕
      primaryBorderColor: BRAND,
      primaryTextColor: "#fafaf9",
      secondaryColor: "#1c1917",
      secondaryBorderColor: "#f97316",
      secondaryTextColor: "#fafaf9",
      tertiaryColor: "#171717",
      tertiaryBorderColor: "#f97316",
      tertiaryTextColor: "#fafaf9",
      lineColor: "#fdba74",
      textColor: "#fafaf9",
      // 子图 / 分组
      clusterBkg: "#171717",
      clusterBorder: BRAND,
      titleColor: "#fdba74",
      edgeLabelBackground: "#0a0a0a",
      nodeTextColor: "#fafaf9",
    };
  }
  return {
    darkMode: false,
    fontFamily: FONT_FAMILY,
    fontSize: "16px",
    background: "#ffffff",
    primaryColor: "#ffedd5", // 节点填充：orange-100
    primaryBorderColor: BRAND,
    primaryTextColor: "#7c2d12",
    secondaryColor: "#fef3c7",
    secondaryBorderColor: "#f97316",
    secondaryTextColor: "#7c2d12",
    tertiaryColor: "#fafaf9",
    tertiaryBorderColor: "#fdba74",
    tertiaryTextColor: "#1c1917",
    lineColor: "#9a3412",
    textColor: "#1c1917",
    clusterBkg: "#fafaf9",
    clusterBorder: BRAND,
    titleColor: "#9a3412",
    edgeLabelBackground: "#ffffff",
    nodeTextColor: "#1c1917",
  };
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 缩放 & 平移
  const [scale, setScale] = useState(2);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const scaleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashScale = useCallback(() => {
    setShowScale(true);
    if (scaleTimerRef.current) clearTimeout(scaleTimerRef.current);
    scaleTimerRef.current = setTimeout(() => setShowScale(false), 1200);
  }, []);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)));
    flashScale();
  }, [flashScale]);
  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)));
    flashScale();
  }, [flashScale]);
  const resetView = useCallback(() => {
    setScale(2);
    setPan({ x: 0, y: 0 });
  }, []);

  const viewportRef = useRef<HTMLDivElement>(null);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    setScale((s) => {
      const next = +(s + delta).toFixed(2);
      return Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
    });
    flashScale();
  }, [flashScale]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // 跟随站点亮/暗色（.dark class 挂在祖先元素上）
  useEffect(() => {
    if (typeof document === "undefined") return;
    const read = () => document.documentElement.classList.contains("dark");
    setIsDark(read());
    const observer = new MutationObserver(() => setIsDark(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // 渲染 mermaid
  useEffect(() => {
    let mounted = true;
    if (!code || !code.trim()) return;

    ensureFontInjected();
    setIsLoading(true);
    setError(null);

    const render = async () => {
      try {
        const mermaid = await getMermaid();

        // mermaid 用 <br/> 换行，这里把源码里的字面量 "\n" 统一成 <br/>
        const processed = code.replace(/\\n/g, "<br/>");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose", // 允许 htmlLabels 里的 <br/>
          look: "handDrawn", // 手绘风格
          theme: "base",
          fontFamily: FONT_FAMILY,
          flowchart: { curve: "basis", htmlLabels: true },
          themeVariables: buildThemeVariables(isDark) as Record<string, string>,
        });

        const id = `mermaid-svg-${renderSeq++}`;
        const { svg: rendered } = await mermaid.render(id, processed);
        if (mounted) {
          setSvg(rendered);
          setScale(2);
          setPan({ x: 0, y: 0 });
        }
      } catch (err: any) {
        console.error("Mermaid render error:", err);
        if (mounted) {
          setError(err?.message || "Failed to render Mermaid diagram.");
          setSvg(null);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    render();
    return () => {
      mounted = false;
    };
  }, [code, isDark]);

  // 拖拽平移
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // 只响应左键 / 触控
      if (e.button !== 0) return;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: pan.x,
        originY: pan.y,
      };
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pan]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setPan({
      x: drag.originX + (e.clientX - drag.startX),
      y: drag.originY + (e.clientY - drag.startY),
    });
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-mono my-4">
        <p className="font-bold mb-1">Rendering Error:</p>
        {error}
        <pre className="mt-2 text-xs opacity-75 whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {isLoading && (
        <div className="flex items-center space-x-2 text-gray-500 py-8">
          <div className="w-5 h-5 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: BRAND }}></div>
          <span className="text-sm font-medium">Rendering diagram...</span>
        </div>
      )}

      {!isLoading && svg && (
        <div className="relative w-full overflow-hidden rounded-xl">
          {/* 可缩放 / 可拖拽视口 */}
          <div
            ref={viewportRef}
            className="w-full overflow-hidden p-4 select-none flex items-center justify-center"
            style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none", minHeight: 500 }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <div
              className="mermaid-diagram-svg mx-auto w-fit"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.12s ease-out",
              }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>

          {/* 缩放百分比提示（左上角，仅缩放时显示） */}
          {showScale && (
            <div className="absolute top-3 left-3 z-10 rounded-md bg-neutral-900/90 dark:bg-neutral-100/90 px-2.5 py-1 text-xs font-medium text-white dark:text-neutral-900 shadow-sm backdrop-blur transition-opacity">
              {Math.round(scale * 100)}%
            </div>
          )}

          {/* 缩放工具栏（垂直布局，左下角） */}
          <div className="absolute bottom-3 left-3 z-10 flex flex-col items-center gap-0.5 rounded-md bg-neutral-900/90 dark:bg-neutral-100/90 p-0.5 shadow-sm backdrop-blur">
            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
              aria-label="放大"
              className="flex h-7 w-7 items-center justify-center rounded text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              aria-label="缩小"
              className="flex h-7 w-7 items-center justify-center rounded text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={resetView}
              aria-label="重置视图"
              className="flex h-7 w-7 items-center justify-center rounded text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MermaidDiagram);
