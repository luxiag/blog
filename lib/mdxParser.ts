
import { clientLogger as logger } from './clientLogger';

// 解析包含交互式组件的 Markdown 内容
export function parseInteractiveMarkdown(content: string): { html: string; script?: string } | null {
  // 查找包含 <script> 标签的内容块
  const scriptRegex = /<script(?:\s+lang="(?:ts|js)")?>([\s\S]*?)<\/script>/i;
  const scriptMatch = content.match(scriptRegex);

  if (!scriptMatch) {
    return null; // 没有找到脚本标签，不是交互式组件
  }

  // 提取脚本内容
  const scriptContent = scriptMatch[1].trim();

  // 移除脚本标签，获取HTML内容
  const htmlContent = content.replace(scriptRegex, '').trim();

  logger.debug('解析交互式组件:', { html: htmlContent.substring(0, 100), script: scriptContent.substring(0, 100) });

  return {
    html: htmlContent,
    script: scriptContent
  };
}

// 处理Markdown内容，将交互式组件部分替换为占位符
export function processMarkdownContent(content: string): {
  processedContent: string;
  interactiveComponents: Array<{ id: string; content: string }>;
} {
  // 查找所有可能的交互式组件块
  // 我们使用一个特殊的注释标记来识别交互式组件
  const componentRegex = /<!--\s*interactive-component-start\s*-->([\s\S]*?)<!--\s*interactive-component-end\s*-->/gi;

  const interactiveComponents: Array<{ id: string; content: string }> = [];
  let componentId = 0;

  // 替换交互式组件为占位符
  const processedContent = content.replace(componentRegex, (match) => {
    const id = `interactive-component-${componentId++}`;
    interactiveComponents.push({
      id,
      content: match.replace(/<!--\s*interactive-component-(?:start|end)\s*-->/gi, '').trim()
    });
    return `<!-- ${id} -->`;
  });

  return {
    processedContent,
    interactiveComponents
  };
}
