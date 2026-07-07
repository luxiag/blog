import React, { useEffect, useState, useRef, useCallback } from 'react';
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { exportToSvg, convertToExcalidrawElements } from "@excalidraw/excalidraw";


interface MermaidExcalidrawProps {
  code: string;
}

const MIN_SCALE = 0.4;
const MAX_SCALE = 3;
const SCALE_STEP = 0.2;

export const MermaidExcalidraw: React.FC<MermaidExcalidrawProps> = ({ code }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2))), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2))), []);
  const zoomReset = useCallback(() => setScale(1), []);

  useEffect(() => {
    let isMounted = true;

    const convert = async () => {
      if (!code || !code.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // Mermaid 的流程图节点标签不支持字面量 "\n"（尤其在 [(...)] 这类形状里会直接解析报错），
        // 但支持 <br/> 换行。这里先把源码里的 "\n" 统一替换成 <br/> 再交给解析器。
        const preprocessedCode = code.replace(/\\n/g, "<br/>");

        // 1. Convert Mermaid syntax to Excalidraw Elements
        const { elements, files } = await parseMermaidToExcalidraw(preprocessedCode);
        if (!isMounted) return;

        const safeNum = (v: any) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));

        const sanitizedElements: any[] = [];

        // Mermaid / Excalidraw 有时会把换行保留成字面量 "\n" 或 "<br/>"，这里统一转成真实换行
        const normalizeTextNewlines = (text: string) =>
          text.replace(/\\n/g, "\n").replace(/<br\s*\/?>/gi, "\n");

        const pushLabelBackground = (
          ownerId: string,
          x: number,
          y: number,
          width: number,
          height: number,
          paddingX = 3,
          paddingY = 1,
          opacity = 85
        ) => {
          sanitizedElements.push({
            id: `${ownerId}-label-bg`,
            type: "rectangle",
            x: safeNum(x) - paddingX,
            y: safeNum(y) - paddingY,
            width: Math.max(1, safeNum(width) + paddingX * 2),
            height: Math.max(1, safeNum(height) + paddingY * 2),
            angle: 0,
            strokeColor: "transparent",
            backgroundColor: "#ffffff",
            fillStyle: "solid",
            strokeWidth: 0,
            strokeStyle: "solid",
            roughness: 0,
            // 半透明白底：只用来遮挡连线穿过文字，不会把相邻节点整块盖住
            opacity,
            roundness: { type: 3 },
          });
        };

        // 按“字符单位”估算一段（可能多行）文字在给定字号下的宽高。
        // 中文/全角约 1.05 个单位宽，ASCII 约 0.58 个单位宽；行高按 1.25 倍字号。
        const measureText = (text: string, fontSize: number) => {
          const lines = text.split("\n");
          const maxUnits = lines.reduce((m: number, line: string) => {
            const u = line.split("").reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 1.05 : 0.58), 0);
            return Math.max(m, u);
          }, 0);
          return {
            width: maxUnits * fontSize,
            height: lines.length * fontSize * 1.25,
            lineCount: lines.length,
            maxUnits,
          };
        };

        // 关键设计：完全保留 Mermaid 计算出的节点位置与尺寸、以及连线的路径，
        // 不做任何“撑大 / 挪位 / 重排 / 重新吸附”——这些才是导致布局错乱的根源。
        // 我们唯一要解决的是“手写中文字体比 Mermaid 预设字体更宽、文字会溢出节点”，
        // 因此改为按节点尺寸把标签字号缩小到刚好放得下，位置一律沿用 Mermaid 的结果。
        const shapeFitFactor = (type: string) => {
          if (type === "ellipse") return 0.72; // 圆/椭圆的内接矩形
          if (type === "diamond") return 0.6;   // 菱形内接矩形更小
          return 0.88;                          // 矩形留一点内边距
        };

        const fitFontSize = (text: string, baseFontSize: number, boxW: number, boxH: number, factor: number) => {
          const unit = measureText(text, 1); // 字号 1 时的宽(=maxUnits) 与高(=lineCount*1.25)
          const availW = Math.max(1, boxW * factor);
          const availH = Math.max(1, boxH * factor);
          const byWidth = unit.maxUnits > 0 ? availW / unit.maxUnits : baseFontSize;
          const byHeight = unit.lineCount > 0 ? availH / (unit.lineCount * 1.25) : baseFontSize;
          // 不超过原始字号，也不小于 9px，保证可读
          return Math.max(9, Math.min(baseFontSize, byWidth, byHeight));
        };

        elements.forEach((el: any) => {
          const labelText = el.label?.text ? normalizeTextNewlines(el.label.text) : "";
          const baseFontSize = safeNum(el.label?.fontSize || 20);

          // 元素本体：原样保留 Mermaid 的几何，只统一字体族与不透明度。
          sanitizedElements.push({
            ...el,
            fontFamily: 1,
            opacity: 100,
          });

          if (!labelText) return;

          if (el.type === "arrow" && Array.isArray(el.points) && el.points.length > 0) {
            // 连线标签：放在连线中点上方，字号略收敛（不超过 16），并用紧贴的半透明白底
            // 遮住从下方穿过的连线。位置完全基于 Mermaid 的连线路径。
            const arrowFont = Math.min(baseFontSize, 16);
            const m = measureText(labelText, arrowFont);
            const textW = Math.max(1, m.width);
            const textH = Math.max(1, m.height);

            const midIndex = Math.floor(el.points.length / 2);
            const midPoint = el.points[midIndex] || el.points[0];
            const centerX = safeNum(midPoint?.[0]);
            const centerY = safeNum(midPoint?.[1]);

            const tx = safeNum(el.x) + centerX - textW / 2;
            const ty = safeNum(el.y) + centerY - textH - 2;

            pushLabelBackground(el.id || "arrow", tx, ty, textW, textH, 2, 1, 70);

            sanitizedElements.push({
              id: `${el.id || "el"}-label-text`,
              type: "text",
              text: labelText,
              x: tx,
              y: ty,
              width: textW,
              height: textH,
              fontSize: arrowFont,
              fontFamily: 1,
              textAlign: "center",
              verticalAlign: "middle",
              strokeColor: "#1f2937",
            });
            return;
          }

          // 节点标签：把字号缩到刚好放进 Mermaid 给的节点框内，再在框内居中。
          const boxW = safeNum(el.width);
          const boxH = safeNum(el.height);
          const fs = fitFontSize(labelText, baseFontSize, boxW, boxH, shapeFitFactor(el.type));
          const m = measureText(labelText, fs);
          const textW = Math.max(1, m.width);
          const textH = Math.max(1, m.height);
          const tx = safeNum(el.x) + (boxW - textW) / 2;
          const ty = safeNum(el.y) + (boxH - textH) / 2;

          sanitizedElements.push({
            id: `${el.id || "el"}-label-text`,
            type: "text",
            text: labelText,
            x: tx,
            y: ty,
            width: textW,
            height: textH,
            fontSize: fs,
            fontFamily: 1,
            textAlign: "center",
            verticalAlign: "middle",
            strokeColor: "#1f2937",
          });
        });

        // 如果 elements 数组为空，也会导致 exportToSvg 报错
        if (sanitizedElements.length === 0) {
          throw new Error("No renderable elements found.");
        }

        // 2. Convert Excalidraw Elements to SVG
        // Suppress Turbopack Worker error (falls back to main thread automatically)
        const origError = console.error;
        console.error = (...args: any[]) => {
          if (typeof args[0] === 'string' && args[0].includes('Failed to use workers for subsetting')) return;
          origError(...args);
        };
        let svg: SVGSVGElement;
        try {
          svg = await exportToSvg({
            elements: sanitizedElements as any,
            appState: {
              exportWithDarkMode: false,
              viewBackgroundColor: "#ffffff",
            },
            files: files || {},
          });
        } finally {
          console.error = origError;
        }
        // 2. 定义样式块 (包含中文字体补丁)
        const styleBlock = `
  <style>
    /* 引入手写风格中文字体（霞鹜文楷），兼容性好且风格匹配 */

    @font-face {
      font-family: 'VirgilLocal';
      src: url('${process.env.NEXT_PUBLIC_BASE_PATH || ''}/fonts/Virgil.woff2') format('woff2');
      font-display: swap;
    }
    @font-face {
      font-family: 'ChineseHandwrittenLocal';
      src: url('${process.env.NEXT_PUBLIC_BASE_PATH || ''}/fonts/ZCOOLKuaiLe-Regular.ttf') format('truetype');
      font-display: swap;
    }
    /* 强制所有文本使用中文字体 */
    svg text, svg tspan {
      font-family: 'ChineseHandwrittenLocal', 'VirgilLocal', sans-serif !important;
      white-space: pre;
      dominant-baseline: middle;
      text-anchor: middle;
    }

    /* 确保文本容器正确显示 */
    svg text {
      pointer-events: none;
    }
    
    /* 解决换行符不生效的问题 */
tspan { 
      white-space: pre; 
      dominant-baseline: alphabetic;
    }
  </style>
`;

        // 3. 将样式块插入到 SVG 内部
        // 我们将 style 标签插入到 <svg> 标签之后，内容之前
        const svgHtml = svg.outerHTML;
        const insertPosition = svgHtml.indexOf(">") + 1;
        const finalSvg = svgHtml.slice(0, insertPosition) + styleBlock + svgHtml.slice(insertPosition);

        // 4. 更新状态
        if (isMounted) {
          setSvgContent(finalSvg)
        }


      } catch (err: any) {
        console.error("Conversion error:", err);
        if (isMounted) {
          // Mermaid conversion errors are often just strings or simple objects
          const msg = err.message || "Failed to render Mermaid diagram. Please check syntax.";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    convert();

    return () => {
      isMounted = false;
    };
  }, [code]);

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
    <div className="relative flex flex-col items-center justify-center my-6 w-full">
      {isLoading && (
        <div className="flex items-center space-x-2 text-gray-500 py-8">
          <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Sketching diagram...</span>
        </div>
      )}

      {!isLoading && svgContent && (
        <div className="relative w-full overflow-hidden">
          {/* 可滚动的缩放视口 */}
          <div ref={containerRef} className="w-full overflow-auto p-4">
            <div
              className="mx-auto w-fit origin-top transition-transform duration-150 ease-out"
              style={{ transform: `scale(${scale})` }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>

          {/* 缩放工具栏：沿用「查看代码」按钮的 neutral / 暗色风格，放到左下角避免与之重叠 */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-0.5 rounded-md bg-neutral-900/90 dark:bg-neutral-100/90 p-0.5 shadow-sm backdrop-blur">
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
              onClick={zoomReset}
              aria-label="重置缩放"
              className="min-w-[3.25rem] rounded px-1 py-1 text-center text-xs font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
            >
              {Math.round(scale * 100)}%
            </button>
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
          </div>
        </div>
      )}
    </div>
  );
};
