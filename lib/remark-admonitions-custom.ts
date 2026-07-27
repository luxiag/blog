
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

function plugin(config: AdmonitionConfig = {}) {
  const keywords = config.keywords || defaultKeywords;
  const format = config.format ?? 'mdx';

  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (node.type !== 'paragraph' || index === undefined || !parent) return;

      const text = node.children?.[0]?.value;
      if (typeof text !== 'string') return;
      if (!text.startsWith(':::')) return;

      // When there is no blank line between the opening marker and the closing :::,
      // remark-parse merges them into ONE paragraph (e.g. ":::note\n:::").
      // Match only the first line so we never capture ":::" as the title.
      const newlinePos = text.indexOf('\n');
      const firstLine  = newlinePos === -1 ? text : text.slice(0, newlinePos);

      const match = firstLine.match(/^:::\s*(\w+)(?:\s+(.+))?\r?$/);
      if (!match) return;

      const [, type, title] = match;
      const admonitionType = type.toLowerCase() as AdmonitionType;

      if (!keywords.includes(admonitionType)) return;

      const displayTitle = title || admonitionTitles[admonitionType] || type;
      const styleClass    = admonitionStyles[admonitionType]     || admonitionStyles.info;
      const titleColor    = admonitionTitleColors[admonitionType] || 'text-gray-700';

      // ── Detect inline-close ──────────────────────────────────────────────────
      // The closing ::: may be in the same paragraph node when there is no blank
      // line between markers. remark-parse may split paragraph children when
      // inline formatting (bold, code, etc.) is present, so:
      //   • children[0].value  → starts with ":::type\n…"
      //   • children[last].value → ends with "…\n:::"
      const restOfText = newlinePos === -1 ? '' : text.slice(newlinePos + 1);
      const lastChild = node.children?.[node.children.length - 1];
      const lastChildValue = typeof lastChild?.value === 'string' ? lastChild.value : '';
      const isInlineClose = (newlinePos !== -1 && restOfText.trim() === ':::') ||
                            lastChildValue.trimEnd().endsWith('\n:::');

      // ── Find closing marker ──────────────────────────────────────────────────
      const siblings = parent.children;
      let endIndex: number;
      // When the close is embedded in a sibling (e.g. a list whose last item ends
      // with \n:::), we need to strip the trailing marker from that sibling.
      let closingEmbedded = false;

      if (isInlineClose) {
        // The closing ::: is inside this paragraph; no sibling node to consume.
        endIndex = index;
      } else {
        endIndex = index + 1;
        let depth = 1;

        while (endIndex < siblings.length && depth > 0) {
          const sibling = siblings[endIndex];
          const siblingText = extractFullText(sibling);

          if (typeof siblingText === 'string') {
            const trimmedText = siblingText.trim();

            if (trimmedText === ':::') {
              // A standalone closing paragraph — the usual case
              depth--;
            } else if (trimmedText.startsWith(':::')) {
              // Could be a nested opening marker
              const siblingMatch = trimmedText.match(/^:::\s*(\w+)/);
              if (siblingMatch && keywords.includes(siblingMatch[1].toLowerCase() as AdmonitionType)) {
                depth++;
              }
            } else if (trimmedText.endsWith('\n:::') || endsWithClose(sibling)) {
              // The closing ::: is embedded at the end of a block element (e.g. a list).
              // Treat it as a closing marker for the current depth.
              depth--;
              if (depth === 0) {
                closingEmbedded = true;
              }
            }
          }

          if (depth === 0) break;
          endIndex++;
        }
      }

      // ── Extract content nodes ────────────────────────────────────────────────
      let contentNodes: any[];

      if (isInlineClose && node.children) {
        // The entire admonition is in a single paragraph node.
        // Strip :::type\n from the first child and \n::: from the last child,
        // then wrap remaining children in a paragraph for correct rendering.
        const innerChildren = node.children.map((child: any, i: number) => {
          const cloned = { ...child };
          if (i === 0 && typeof cloned.value === 'string') {
            // Strip the ":::type\n" prefix from the first text child
            const nlIdx = cloned.value.indexOf('\n');
            cloned.value = nlIdx === -1 ? '' : cloned.value.slice(nlIdx + 1);
          }
          if (i === node.children.length - 1 && typeof cloned.value === 'string') {
            // Strip the trailing "\n:::" from the last text child
            const trailMatch = cloned.value.match(/^([\s\S]*)\n:::[\s]*$/);
            if (trailMatch) {
              cloned.value = trailMatch[1];
            }
          }
          return cloned;
        }).filter((child: any) => !(child.type === 'text' && child.value === ''));

        contentNodes = innerChildren.length > 0
          ? [{ type: 'paragraph', children: innerChildren }]
          : [];
      } else {
        // Content is in sibling nodes between opening and closing markers.
        // The opening paragraph needs its :::type\n prefix removed from first child.
        // When the closing ::: is embedded inside a sibling (e.g. a list whose
        // last item lazily absorbed the ::: line), that sibling at `endIndex` IS
        // content and must be included in the slice; otherwise it is a standalone
        // closing marker and should be excluded.
        const sliceEnd = closingEmbedded ? endIndex + 1 : endIndex;
        const rawContent = siblings.slice(index + 1, sliceEnd);

        // If the closing ::: was embedded in the last sibling (e.g. a list),
        // strip it from that sibling so it doesn't appear in the rendered output.
        if (closingEmbedded && rawContent.length > 0) {
          const lastSibling = rawContent[rawContent.length - 1];
          stripTrailingClose(lastSibling);
        }

        // Strip the :::type\n opener text from the opening paragraph's first child.
        // The opening paragraph node is `node` itself; its first child starts with
        // ":::type\n...rest". We need to keep "...rest" as a separate paragraph.
        const openerRest = newlinePos === -1 ? '' : text.slice(newlinePos + 1);
        if (openerRest.trim()) {
          // There's content on the same line(s) as the opening marker
          const openerChildren = node.children.map((child: any, i: number) => {
            const cloned = { ...child };
            if (i === 0 && typeof cloned.value === 'string') {
              const nlIdx = cloned.value.indexOf('\n');
              cloned.value = nlIdx === -1 ? '' : cloned.value.slice(nlIdx + 1);
            }
            return cloned;
          }).filter((child: any) => !(child.type === 'text' && child.value === ''));

          contentNodes = openerChildren.length > 0
            ? [{ type: 'paragraph', children: openerChildren }, ...rawContent]
            : rawContent;
        } else {
          contentNodes = rawContent;
        }
      }

      // ── Build replacement nodes ──────────────────────────────────────────────
      let replacementNodes: any[];

      if (admonitionType === 'details') {
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
          const detailsNode = {
            type: 'mdxJsxFlowElement',
            name: 'details',
            attributes: attrs,
            children: [...contentNodes],
          };
          replacementNodes = [detailsNode];
        }
      } else if (format === 'html') {
        // ── react-markdown path ────────────────────────────────────────────────
        const outerClass = `${styleClass} rounded-r p-4`;
        const titleClass = `${titleColor}`;
        replacementNodes = [
          {
            type: 'html',
            value: `<div class="${outerClass}"><div class="${titleClass}">${escapeHtml(displayTitle)}</div>`,
          },
          ...contentNodes,
          { type: 'html', value: '</div>' },
        ];
      } else {
        // ── @mdx-js/mdx compile path ───────────────────────────────────────────
        const admonitionNode = {
          type: 'mdxJsxFlowElement',
          name: 'div',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'className',
              value: `${styleClass} rounded-r p-4`,
            },
          ],
          children: [
            {
              type: 'mdxJsxFlowElement',
              name: 'div',
              attributes: [
                {
                  type: 'mdxJsxAttribute',
                  name: 'className',
                  value: titleColor,
                },
              ],
              children: [{ type: 'text', value: displayTitle }],
            },
            ...contentNodes,
          ],
        };
        replacementNodes = [admonitionNode];
      }

      parent.children.splice(index, endIndex - index + 1, ...replacementNodes);

      // Restart visitor from current index so the first replacement node
      // (html or mdxJsxFlowElement) is skipped by the paragraph guard above.
      return index;
    });
  };
}

export const remarkAdmonitionsCustom = plugin;
