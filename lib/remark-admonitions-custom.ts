
import { visit } from 'unist-util-visit';

type AdmonitionType = 'note' | 'tip' | 'warning' | 'important' | 'info' | 'details';

interface AdmonitionConfig {
  keywords?: AdmonitionType[];
}

const defaultKeywords: AdmonitionType[] = ['note', 'tip', 'warning', 'important', 'info', 'details'];

const admonitionStyles: Record<AdmonitionType, string> = {
  note: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  tip: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  important: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  info: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
  details: 'border-gray-500 bg-gray-50 dark:bg-gray-900/20',
};

const admonitionTitles: Record<AdmonitionType, string> = {
  note: '注意',
  tip: '提示',
  warning: '警告',
  important: '重要',
  info: '信息',
  details: '详情',
};

function plugin(config: AdmonitionConfig = {}) {
  const keywords = config.keywords || defaultKeywords;

  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (node.type !== 'paragraph' || index === undefined || !parent) return;

      const text = node.children?.[0]?.value;
      if (typeof text !== 'string' || !text.startsWith(':::')) return;

      const match = text.match(/^:::\s*(\w+)(?:\s+(.+))?$/);
      if (!match) return;

      const [, type, title] = match;
      const admonitionType = type.toLowerCase() as AdmonitionType;

      if (!keywords.includes(admonitionType)) return;

      const displayTitle = title || admonitionTitles[admonitionType] || type;
      const styleClass = admonitionStyles[admonitionType] || admonitionStyles.info;

      // 查找结束标记
      const siblings = parent.children;
      let endIndex = index + 1;
      let depth = 1;

      while (endIndex < siblings.length && depth > 0) {
        const sibling = siblings[endIndex];
        const siblingText = sibling?.children?.[0]?.value;

        if (typeof siblingText === 'string') {
          if (siblingText.startsWith(':::')) {
            const siblingMatch = siblingText.match(/^:::\s*(\w+)/);
            if (siblingMatch && keywords.includes(siblingMatch[1].toLowerCase() as AdmonitionType)) {
              depth++;
            } else if (siblingText.trim() === ':::') {
              depth--;
            }
          }
        }

        if (depth === 0) break;
        endIndex++;
      }

      // 提取内容节点
      const contentNodes = siblings.slice(index + 1, endIndex);

      // 创建 admonition 节点
      const admonitionNode = {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'className', value: `border-l-4 p-4 my-4 rounded-r ${styleClass}` }
        ],
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: 'font-semibold mb-2'
            },
            children: [{ type: 'text', value: displayTitle }]
          },
          ...contentNodes
        ]
      };

      // 替换节点
      parent.children.splice(index, endIndex - index + 1, admonitionNode);

      // 跳过已处理的节点
      return index;
    });
  };
}

export const remarkAdmonitionsCustom = plugin;
