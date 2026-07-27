import { visit } from 'unist-util-visit';

/**
 * Find the deepest last `text` leaf in a node tree.
 */
function findLastTextLeaf(node: any): { parent: any; index: number } | null {
  if (!node) return null;
  if (node.type === 'text') return null;
  if (node.children && node.children.length > 0) {
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      if (child.type === 'text') return { parent: node, index: i };
      const found = findLastTextLeaf(child);
      if (found) return found;
    }
  }
  return null;
}

function plugin() {
  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (node.type !== 'paragraph') return;
      if (index === undefined || !parent) return;

      const text = node.children?.[0]?.value;
      if (typeof text !== 'string' || !text.replace(/\r$/, '').startsWith('::: details')) return;

      const titleMatch = text.replace(/\r$/, '').match(/::: details\s+(.+)/);
      const title = titleMatch ? titleMatch[1].trim() : 'Details';

      const siblings = parent.children;
      let endIndex = index + 1;
      let depth = 1;
      let closingEmbedded = false;

      while (endIndex < siblings.length && depth > 0) {
        const sibling = siblings[endIndex];

        // Check full extracted text for standalone markers
        const sibText = extractText(sibling).replace(/\r$/, '');
        const trimmed = sibText.trim();

        if (trimmed === ':::') {
          depth--;
        } else if (trimmed.startsWith('::: details')) {
          depth++;
        } else if (trimmed.endsWith('\n:::')) {
          // Closing ::: embedded at the end of a content paragraph
          depth--;
          if (depth === 0) closingEmbedded = true;
        } else {
          // Check via last text leaf (handles inline formatting splits)
          const leaf = findLastTextLeaf(sibling);
          if (leaf) {
            const leafVal = leaf.parent.children[leaf.index].value;
            if (typeof leafVal === 'string' && leafVal.trimEnd().endsWith('\n:::')) {
              depth--;
              if (depth === 0) closingEmbedded = true;
            }
          }
        }

        if (depth === 0) break;
        endIndex++;
      }

      const sliceEnd = closingEmbedded ? endIndex + 1 : endIndex;
      const contentNodes = siblings.slice(index + 1, sliceEnd);

      // Strip trailing \n::: from the last content node when embedded
      if (closingEmbedded && contentNodes.length > 0) {
        const lastNode = contentNodes[contentNodes.length - 1];
        stripTrailingClose(lastNode);
      }

      // Strip the opener line from the opening paragraph
      const newlinePos = text.indexOf('\n');
      const openerRest = newlinePos === -1 ? '' : text.slice(newlinePos + 1);
      let finalContent: any[];
      if (openerRest.trim()) {
        const openerChildren = node.children.map((child: any, i: number) => {
          const cloned = { ...child };
          if (i === 0 && typeof cloned.value === 'string') {
            const nlIdx = cloned.value.indexOf('\n');
            cloned.value = nlIdx === -1 ? '' : cloned.value.slice(nlIdx + 1);
          }
          return cloned;
        }).filter((child: any) => !(child.type === 'text' && child.value === ''));
        finalContent = openerChildren.length > 0
          ? [{ type: 'paragraph', children: openerChildren }, ...contentNodes]
          : [...contentNodes];
      } else {
        finalContent = [...contentNodes];
      }

      const detailsNode = {
        type: 'mdxJsxFlowElement',
        name: 'details',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'data-details-title', value: title }
        ],
        children: finalContent
      };

      parent.children.splice(index, endIndex - index + 1, detailsNode);
      return index;
    });
  };
}

function extractText(node: any): string {
  if (!node) return '';
  if (node.value !== undefined && typeof node.value === 'string') return node.value;
  if (node.children) {
    return node.children.map((child: any) => extractText(child)).join('');
  }
  return '';
}

function stripTrailingClose(node: any): void {
  const leaf = findLastTextLeaf(node);
  if (!leaf) return;
  const textNode = leaf.parent.children[leaf.index];
  if (typeof textNode.value === 'string') {
    const trailMatch = textNode.value.match(/^([\s\S]*)\n:::[\s]*$/);
    if (trailMatch) {
      textNode.value = trailMatch[1];
      if (textNode.value === '') {
        leaf.parent.children.splice(leaf.index, 1);
      }
    }
  }
}

export const remarkDetails = plugin;
