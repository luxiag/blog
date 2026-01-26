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

        // 1. 增强型文本测量：处理多行和中文字符
        const measureMultilineText = (text: string, fontSize: number) => {
          const lines = text.split("\n");
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

        elements.forEach((el: any) => {
          // 1. 预计算文字所需的尺寸
          let textMetrics = { width: 0, height: 0 };
          if (el.label?.text) {
            const fontSize = safeNum(el.label.fontSize || 20);
            const lines = el.label.text.split("\n");
            const lineHeight = fontSize * 1.5;

            const maxWidth = lines.reduce((max: number, line: string) => {
              // 中文 1.2 系数，确保手写体不会溢出
              const w = line.split("").reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 1.2 : 0.6), 0);
              return Math.max(max, w * fontSize);
            }, 0);

            textMetrics = { width: maxWidth + 20, height: lines.length * lineHeight + 10 };
          }

          // 2. 修正形状（Rectangle）的宽度：取 原始宽度 和 文字宽度 的最大值
          const baseEl = {
            ...el,
            x: safeNum(el.x),
            y: safeNum(el.y),
            // 关键修复：给矩形增加内边距补偿
            width: Math.max(safeNum(el.width), textMetrics.width),
            height: Math.max(safeNum(el.height), textMetrics.height),
            fontFamily: 1,
            opacity: 100
          };
          sanitizedElements.push(baseEl);

          // 3. 处理文字位置（基于修正后的 baseEl）
          if (el.label?.text) {
            let tx = baseEl.x + (baseEl.width - (textMetrics.width - 20)) / 2;
            let ty = baseEl.y + (baseEl.height - (textMetrics.height - 10)) / 2;
            const { width: tWidth, height: tHeight } = measureMultilineText(el.label.text, el.label.fontSize || 20);
            if (el.type === "arrow" && el.points) {
              // 1. 找到线条的“中间段”
              // 对于 3 个点以上的折线，取中间那个点的坐标通常最准确
              const midIndex = Math.floor(el.points.length / 2);
              const midPoint = el.points[midIndex];

              // 2. 这里的坐标是相对于 baseEl.x/y 的偏移
              const centerX = midPoint[0];
              const centerY = midPoint[1];

              tx = baseEl.x + centerX - tWidth / 2;

              // 3. 这里的偏移量从原来的 -15 缩小到 -5，让文字紧贴线条
              // 如果文字在线条下面，可以设为 +5
              ty = baseEl.y + centerY - tHeight - 2;
            }
            sanitizedElements.push({
              type: "text",
              text: el.label.text,
              x: safeNum(tx),
              y: safeNum(ty),
              width: textMetrics.width - 20,
              height: textMetrics.height - 10,
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
        // We cast elements to any because the types between libraries might mismatch slightly in this setup
        const svg = await exportToSvg({
          elements: sanitizedElements as any,
          appState: {
            exportWithDarkMode: false,
            viewBackgroundColor: "#ffffff",
          },
          files: files || {},
        });
        // 2. 定义样式块 (包含中文字体补丁)
        const styleBlock = `
  <style>
    /* 引入手写风格中文字体（霞鹜文楷），兼容性好且风格匹配 */

    @font-face {
      font-family: 'VirgilLocal';
      src: url('/fonts/Virgil.woff2') format('woff2');
      font-display: swap;
    }
    @font-face {
      font-family: 'ChineseHandwrittenLocal';
      src: url('/fonts/ZCOOLKuaiLe-Regular.ttf') format('ttf');
      font-display: swap;
    }
svg text {
      /* 优先使用中文手写，英文回退到 Virgil */
      font-family: 'ChineseHandwrittenLocal', 'VirgilLocal', sans-serif !important;
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
