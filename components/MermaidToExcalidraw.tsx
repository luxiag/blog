import React, { useEffect, useState, useRef } from 'react';
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { exportToSvg } from "@excalidraw/excalidraw";


interface MermaidExcalidrawProps {
  code: string;
}

export const MermaidExcalidraw: React.FC<MermaidExcalidrawProps> = ({ code }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const convert = async () => {
      if (!code || !code.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // 1. Convert Mermaid syntax to Excalidraw Elements
        // Removed invalid 'fontSize' property from config object
        const { elements, files } = await parseMermaidToExcalidraw(code);
        console.log('elements', elements)
        if (!isMounted) return;

        const safeNum = (v: any) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));

        const sanitizedElements: any[] = [];



        // Mermaid / Excalidraw 有时会把换行保留成字面量 "\\n"，这里统一转成真实换行

        const normalizeTextNewlines = (text: string) => text.replace(/\\n/g, "\n");



        // 1. 增强型文本测量：处理多行和中文字符

        const measureMultilineText = (text: string, fontSize: number) => {

          const normalizedText = normalizeTextNewlines(text);

          const lines = normalizedText.split("\n");
          const lineHeight = fontSize * 1.5; // 增加行间距系数
          let maxWidth = 0;

          lines.forEach(line => {
            const lineUnits = line.split("").reduce((acc, char) =>
              acc + (char.charCodeAt(0) > 255 ? 1.1 : 0.55), 0);
            maxWidth = Math.max(maxWidth, lineUnits * fontSize);
          });

          return {
            width: maxWidth + 10, // 额外缓冲区
            height: lines.length * lineHeight,
            lineHeight
          };
        };

        const pushLabelBackground = (
          ownerId: string,
          x: number,
          y: number,
          width: number,
          height: number,
          paddingX = 8,
          paddingY = 5
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
            opacity: 100,
            roundness: { type: 3 },
          });
        };

        const nodeMetricsById = new Map<string, { x: number; y: number; width: number; height: number }>();

        const getLabelMetrics = (el: any) => {
          const labelText = el.label?.text ? normalizeTextNewlines(el.label.text) : "";
          if (!labelText) return { labelText, textMetrics: { width: 0, height: 0 } };

          const fontSize = safeNum(el.label.fontSize || 20);
          const lines = labelText.split("\n");
          const lineHeight = fontSize * 1.5;
          const maxWidth = lines.reduce((max: number, line: string) => {
            // 中文 1.2 系数，确保手写体不会溢出
            const w = line.split("").reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 1.2 : 0.6), 0);
            return Math.max(max, w * fontSize);
          }, 0);

          return {
            labelText,
            textMetrics: { width: maxWidth + 36, height: lines.length * lineHeight + 14 }
          };
        };

        // 第一遍：先算出所有非箭头元素撑大后的尺寸，后面箭头端点要按这个新尺寸吸附
        elements.forEach((el: any) => {
          if (el.type === "arrow") return;

          const { textMetrics } = getLabelMetrics(el);
          const width = Math.max(safeNum(el.width), textMetrics.width);
          const height = Math.max(safeNum(el.height), textMetrics.height);

          if (el.id) {
            nodeMetricsById.set(el.id, {
              x: safeNum(el.x),
              y: safeNum(el.y),
              width,
              height,
            });
          }
        });

        const movePointOutsideBound = (arrow: any, point: any, boundElementId?: string) => {
          if (!boundElementId || !Array.isArray(point)) return point;

          const node = nodeMetricsById.get(boundElementId);
          if (!node) return point;

          const gap = 8;
          const absX = safeNum(arrow.x) + safeNum(point[0]);
          const absY = safeNum(arrow.y) + safeNum(point[1]);
          const cx = node.x + node.width / 2;
          const cy = node.y + node.height / 2;
          const dx = absX - cx;
          const dy = absY - cy;

          let nextX = absX;
          let nextY = absY;

          // 判断原端点更接近哪条边，然后贴到新边界外侧
          if (Math.abs(dy) / Math.max(node.height, 1) >= Math.abs(dx) / Math.max(node.width, 1)) {
            nextY = dy >= 0 ? node.y + node.height + gap : node.y - gap;
            nextX = Math.max(node.x + gap, Math.min(node.x + node.width - gap, absX));
          } else {
            nextX = dx >= 0 ? node.x + node.width + gap : node.x - gap;
            nextY = Math.max(node.y + gap, Math.min(node.y + node.height - gap, absY));
          }

          return [nextX - safeNum(arrow.x), nextY - safeNum(arrow.y)];
        };

        const normalizeArrowGeometry = (el: any) => {
          if (el.type !== "arrow" || !Array.isArray(el.points)) {
            return {
              x: safeNum(el.x),
              y: safeNum(el.y),
              width: safeNum(el.width),
              height: safeNum(el.height),
              points: el.points,
            };
          }

          const startElementId = el.startBinding?.elementId;
          const endElementId = el.endBinding?.elementId;

          // 先转成绝对坐标，端点按撑大后的节点重新吸附到边界外
          const absolutePoints = el.points.map((point: any, index: number) => {
            if (!Array.isArray(point)) return point;

            let nextPoint = [safeNum(point[0]), safeNum(point[1])];
            if (index === 0) {
              nextPoint = movePointOutsideBound(el, nextPoint, startElementId);
            }
            if (index === el.points.length - 1) {
              nextPoint = movePointOutsideBound(el, nextPoint, endElementId);
            }

            return [safeNum(el.x) + safeNum(nextPoint[0]), safeNum(el.y) + safeNum(nextPoint[1])];
          });

          const validPoints = absolutePoints.filter((point: any) => Array.isArray(point));
          if (validPoints.length === 0) {
            return {
              x: safeNum(el.x),
              y: safeNum(el.y),
              width: safeNum(el.width),
              height: safeNum(el.height),
              points: el.points,
            };
          }

          // 重新计算箭头 bbox。只改 points 不改 x/y/width/height，Excalidraw 会继续按旧 bbox 画线。
          const minX = Math.min(...validPoints.map((point: any) => point[0]));
          const minY = Math.min(...validPoints.map((point: any) => point[1]));
          const maxX = Math.max(...validPoints.map((point: any) => point[0]));
          const maxY = Math.max(...validPoints.map((point: any) => point[1]));

          return {
            x: minX,
            y: minY,
            width: Math.max(1, maxX - minX),
            height: Math.max(1, maxY - minY),
            points: absolutePoints.map((point: any) => Array.isArray(point)
              ? [point[0] - minX, point[1] - minY]
              : point
            ),
          };
        };

        elements.forEach((el: any) => {
          const { labelText, textMetrics } = getLabelMetrics(el);
          const arrowGeometry = normalizeArrowGeometry(el);

          // 修正形状宽高；箭头使用重算后的 bbox，避免节点变大后线还按旧尺寸穿进节点
          const baseEl = {
            ...el,
            x: el.type === "arrow" ? arrowGeometry.x : safeNum(el.x),
            y: el.type === "arrow" ? arrowGeometry.y : safeNum(el.y),
            points: el.type === "arrow" ? arrowGeometry.points : el.points,
            width: el.type === "arrow" ? arrowGeometry.width : Math.max(safeNum(el.width), textMetrics.width),
            height: el.type === "arrow" ? arrowGeometry.height : Math.max(safeNum(el.height), textMetrics.height),
            fontFamily: 1,
            opacity: 100
          };
          sanitizedElements.push(baseEl);

          // 处理文字位置（基于修正后的 baseEl）
          if (labelText) {
            let tx = baseEl.x + (baseEl.width - (textMetrics.width - 20)) / 2;
            let ty = baseEl.y + (baseEl.height - (textMetrics.height - 10)) / 2;
            const { width: tWidth, height: tHeight } = measureMultilineText(labelText, el.label.fontSize || 20);

            if (el.type === "arrow" && baseEl.points) {
              const midIndex = Math.floor(baseEl.points.length / 2);
              const midPoint = baseEl.points[midIndex];
              const centerX = safeNum(midPoint?.[0]);
              const centerY = safeNum(midPoint?.[1]);

              tx = baseEl.x + centerX - tWidth / 2;
              ty = baseEl.y + centerY - tHeight - 2;

              // 给箭头文字加一块白底遮罩，水平线不会从文字中间穿过去
              pushLabelBackground(el.id || "arrow", tx, ty, tWidth, tHeight, 8, 5);
            }

            if (el.type !== "arrow") {
              pushLabelBackground(el.id || "el", tx, ty, Math.max(1, textMetrics.width - 36), Math.max(1, textMetrics.height - 14), 8, 5);
            }

            sanitizedElements.push({
              id: `${el.id || "el"}-label-text`,
              type: "text",
              text: labelText,
              x: safeNum(tx),
              y: safeNum(ty),
              width: Math.max(1, textMetrics.width - 36),
              height: Math.max(1, textMetrics.height - 14),
              fontSize: el.label.fontSize || 20,
              fontFamily: 1,
              textAlign: "center",
              verticalAlign: "middle",
              strokeColor: "#1f2937",
            });
          }
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
    <div className="flex flex-col items-center justify-center my-6 w-full overflow-hidden">
      {isLoading && (
        <div className="flex items-center space-x-2 text-gray-500 py-8">
          <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Sketching diagram...</span>
        </div>
      )}

      {!isLoading && svgContent && (
        <div
          ref={containerRef}
          className="w-full overflow-x-auto flex justify-center p-4 bg-white rounded-xl "
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
};
