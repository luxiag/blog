
import { visit } from 'unist-util-visit';

type AdmonitionType = 'note' | 'tip' | 'warning' | 'important' | 'info' | 'details';

interface AdmonitionConfig {
  keywords?: AdmonitionType[];
  /**
   * 'mdx'  – emit mdxJsxFlowElement nodes (for @mdx-js/mdx compile pipeline, default)
   * 'html' – emit split raw-HTML nodes (for react-markdown + rehype-raw pipeline)
   */
  format?: 'mdx' | 'html';
}

const defaultKeywords: AdmonitionType[] = ['note', 'tip', 'warning', 'important', 'info', 'details'];

const admonitionStyles: Record<AdmonitionType, string> = {
  note:      'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  tip:       'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20',
  warning:   'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  important: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20',
  info:      'border-l-4 border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
  details:   'border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/20',
};

const admonitionTitleColors: Record<AdmonitionType, string> = {
  note:      'text-blue-700 dark:text-blue-400',
  tip:       'text-green-700 dark:text-green-400',
  warning:   'text-yellow-700 dark:text-yellow-400',
  important: 'text-red-700 dark:text-red-400',
  info:      'text-cyan-700 dark:text-cyan-400',
  details:   'text-gray-700 dark:text-gray-400',
};

const admonitionTitles: Record<AdmonitionType, string> = {
  note:      '注意',
  tip:       '提示',
  warning:   '警告',
  important: '重要',
  info:      '信息',
  details:   '详情',
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 递归提取节点的完整文本内容
 */
function extractFullText(node: any): string {
  if (!node) return '';
  if (node.value !== undefined) return node.value;
  if (node.children) {
    return node.children.map((child: any) => extractFullText(child)).join('');
  }
  return '';
}

/**
 * Find the deepest last `text` leaf in a node tree.
 * Returns { node, value } or null if not found.
 */
function findLastTextLeaf(node: any): { parent: any; index: number } | null {
  if (!node) return null;
  if (node.type === 'text') {
    // Not really useful without parent context; caller handles this
    return null;
  }
  if (node.children && node.children.length > 0) {
    // Walk the last child first (rightmost)
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      if (child.type === 'text') {
        return { parent: node, index: i };
      }
      const found = findLastTextLeaf(child);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Check if a node's last text leaf ends with "\n:::".
 * If yes, strip that suffix in-place and return true.
 * This handles the case where remark merges block content (lists, etc.)
 * with the closing ::: into the same sibling node.
 */
function stripTrailingClose(node: any): boolean {
  const leaf = findLastTextLeaf(node);
  if (!leaf) return false;
  const { parent, index } = leaf;
  const textNode = parent.children[index];
  if (typeof textNode.value === 'string' && textNode.value.trimEnd().endsWith('\n:::')) {
    const trailMatch = textNode.value.match(/^([\s\S]*)\n:::[\s]*$/);
    if (trailMatch) {
      textNode.value = trailMatch[1];
      // Clean up empty text node
      if (textNode.value === '') {
        parent.children.splice(index, 1);
      }
      return true;
    }
  }
  return false;
}

/**
 * Check if a node's last text leaf ends with "\n:::" without modifying it.
 */
function endsWithClose(node: any): boolean {
  const leaf = findLastTextLeaf(node);
  if (!leaf) return false;
  const { parent, index } = leaf;
  const textNode = parent.children[index];
  return typeof textNode.value === 'string' && textNode.value.trimEnd().endsWith('\n:::');
}

function splitOpeningLine(children: any[]): {
  openingChildren: any[];
  contentChildren: any[];
  hasLineBreak: boolean;
} {
  const openingChildren: any[] = [];
  const contentChildren: any[] = [];
  let hasLineBreak = false;

  for (const child of children) {
    if (hasLineBreak) {
      contentChildren.push({ ...child });
      continue;
    }

    if (child.type === 'text' && typeof child.value === 'string') {
      const newlineIndex = child.value.indexOf('\n');
      if (newlineIndex !== -1) {
        const openingValue = child.value.slice(0, newlineIndex);
        const contentValue = child.value.slice(newlineIndex + 1);
        if (openingValue) openingChildren.push({ ...child, value: openingValue });
        if (contentValue) contentChildren.push({ ...child, value: contentValue });
        hasLineBreak = true;
        continue;
      }
    }

    openingChildren.push({ ...child });
  }

  return { openingChildren, contentChildren, hasLineBreak };
}

function extractTitleChildren(openingChildren: any[]): any[] {
  const titleChildren = openingChildren.map((child) => ({ ...child }));
  const firstText = titleChildren.find((child) => child.type === 'text' && typeof child.value === 'string');

  if (firstText) {
    firstText.value = firstText.value.replace(/^:::\s*\w+(?:[ \t]+)?/, '');
  }

  const lastText = [...titleChildren]
    .reverse()
    .find((child) => child.type === 'text' && typeof child.value === 'string');
  if (lastText) {
    lastText.value = lastText.value.replace(/\r$/, '');
  }

  return titleChildren.filter((child) => !(child.type === 'text' && child.value === ''));
}

function plugin(config: AdmonitionConfig = {}) {
  const keywords = config.keywords || defaultKeywords;
  const format = config.format ?? 'mdx';

  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (node.type !== 'paragraph' || index === undefined || !parent) return;
      if (!Array.isArray(node.children) || node.children.length === 0) return;

      const firstChildValue = node.children[0]?.value;
      if (typeof firstChildValue !== 'string' || !firstChildValue.startsWith(':::')) return;

      // Inline Markdown in a custom title splits the opening line into multiple
      // mdast children. Split at the first real line break, then match against the
      // combined text while retaining the original title nodes for rendering.
      const { openingChildren, contentChildren: openerContentChildren, hasLineBreak } =
        splitOpeningLine(node.children);
      const firstLine = extractFullText({ children: openingChildren });
      const match = firstLine.match(/^:::\s*(\w+)(?:\s+(.+))?\r?$/);
      if (!match) return;

      const [, type, title] = match;
      const admonitionType = type.toLowerCase() as AdmonitionType;
      if (!keywords.includes(admonitionType)) return;

      const displayTitle = title || admonitionTitles[admonitionType] || type;
      const parsedTitleChildren = title ? extractTitleChildren(openingChildren) : [];
      const titleChildren = parsedTitleChildren.length > 0
        ? parsedTitleChildren
        : [{ type: 'text', value: displayTitle }];
      const styleClass = admonitionStyles[admonitionType] || admonitionStyles.info;
      const titleColor = admonitionTitleColors[admonitionType] || 'text-gray-700';

      // The closing marker can be merged into the opening paragraph when no blank
      // lines separate the marker, title and body.
      const openerRest = extractFullText({ children: openerContentChildren });
      const lastChild = openerContentChildren[openerContentChildren.length - 1];
      const lastChildValue = typeof lastChild?.value === 'string' ? lastChild.value : '';
      const isInlineClose = (hasLineBreak && openerRest.trim() === ':::') ||
        lastChildValue.trimEnd().endsWith('\n:::');

      const siblings = parent.children;
      let endIndex: number;
      let closingEmbedded = false;

      if (isInlineClose) {
        endIndex = index;
      } else {
        endIndex = index + 1;
        let depth = 1;

        while (endIndex < siblings.length && depth > 0) {
          const sibling = siblings[endIndex];
          const siblingText = extractFullText(sibling);
          const trimmedText = siblingText.trim();

          if (trimmedText === ':::') {
            depth--;
          } else if (trimmedText.startsWith(':::')) {
            const siblingMatch = trimmedText.match(/^:::\s*(\w+)/);
            if (siblingMatch && keywords.includes(siblingMatch[1].toLowerCase() as AdmonitionType)) {
              depth++;
            }
          } else if (trimmedText.endsWith('\n:::') || endsWithClose(sibling)) {
            depth--;
            if (depth === 0) closingEmbedded = true;
          }

          if (depth === 0) break;
          endIndex++;
        }
      }

      let contentNodes: any[];

      if (isInlineClose) {
        if (openerRest.trim() === ':::') {
          contentNodes = [];
        } else {
          const paragraph = {
            type: 'paragraph',
            children: openerContentChildren.map((child) => ({ ...child })),
          };
          stripTrailingClose(paragraph);
          contentNodes = paragraph.children.length > 0 ? [paragraph] : [];
        }
      } else {
        const sliceEnd = closingEmbedded ? endIndex + 1 : endIndex;
        const rawContent = siblings.slice(index + 1, sliceEnd);

        if (closingEmbedded && rawContent.length > 0) {
          stripTrailingClose(rawContent[rawContent.length - 1]);
        }

        const hasOpenerContent = openerContentChildren.some((child) =>
          child.type !== 'text' || child.value.trim() !== '',
        );
        contentNodes = hasOpenerContent
          ? [{ type: 'paragraph', children: openerContentChildren }, ...rawContent]
          : rawContent;
      }

      let replacementNodes: any[];

      if (admonitionType === 'details') {
        // Details titles are stored in data attributes because CSS renders their
        // summary label; keep their existing plain-text title|hint contract.
        const titleParts = displayTitle.split('|');
        const detailsTitle = titleParts[0].trim();
        const detailsHint = titleParts.length > 1 ? titleParts.slice(1).join('|').trim() : '';
        if (format === 'html') {
          const hintAttr = detailsHint ? ` data-details-hint="${escapeHtml(detailsHint)}"` : '';
          replacementNodes = [
            { type: 'html', value: `<details data-details-title="${escapeHtml(detailsTitle)}"${hintAttr}>` },
            ...contentNodes,
            { type: 'html', value: '</details>' },
          ];
        } else {
          const attrs: any[] = [
            { type: 'mdxJsxAttribute', name: 'data-details-title', value: detailsTitle },
          ];
          if (detailsHint) {
            attrs.push({ type: 'mdxJsxAttribute', name: 'data-details-hint', value: detailsHint });
          }
          replacementNodes = [{
            type: 'mdxJsxFlowElement',
            name: 'details',
            attributes: attrs,
            children: [...contentNodes],
          }];
        }
      } else if (format === 'html') {
        const outerClass = `${styleClass} rounded p-4`;
        replacementNodes = [
          { type: 'html', value: `<div class="${outerClass}"><div class="${titleColor}">` },
          ...titleChildren,
          { type: 'html', value: '</div>' },
          ...contentNodes,
          { type: 'html', value: '</div>' },
        ];
      } else {
        replacementNodes = [{
          type: 'mdxJsxFlowElement',
          name: 'div',
          attributes: [{
            type: 'mdxJsxAttribute',
            name: 'className',
            value: `${styleClass} rounded p-4`,
          }],
          children: [
            {
              type: 'mdxJsxFlowElement',
              name: 'div',
              attributes: [{
                type: 'mdxJsxAttribute',
                name: 'className',
                value: titleColor,
              }],
              children: titleChildren,
            },
            ...contentNodes,
          ],
        }];
      }

      parent.children.splice(index, endIndex - index + 1, ...replacementNodes);
      return index;
    });
  };
}

export const remarkAdmonitionsCustom = plugin;
