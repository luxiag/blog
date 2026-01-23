type MdastNode = {
  type: string;
  value?: string;
  name?: string;
  children?: MdastNode[];
  attributes?: Array<{ type: string; name: string; value?: unknown }>;
};

function getParagraphText(node: MdastNode): string | null {
  if (node.type !== 'paragraph' || !Array.isArray(node.children)) return null;
  const parts: string[] = [];
  for (const child of node.children) {
    if (child.type !== 'text' || typeof child.value !== 'string') return null;
    parts.push(child.value);
  }
  return parts.join('');
}

function plugin() {
  return (tree: unknown) => {
    const root = tree as { children?: MdastNode[] };
    const children = root.children;
    if (!children) return;

    const nodesToProcess: Array<{ start: number; end: number; title: string }> = [];
    let i = 0;

    while (i < children.length) {
      const node = children[i];
      const text = node ? getParagraphText(node) : null;
      const openMatch = text?.trim().match(/^:::\s*details(?:\s+(.+))?$/);

      if (openMatch) {
        const title = (openMatch[1] ?? 'Details').trim();
        let depth = 1;
        let j = i + 1;

        while (j < children.length && depth > 0) {
          const current = children[j];
          const currentText = current ? getParagraphText(current) : null;
          const trimmed = currentText?.trim();

          if (trimmed) {
            if (/^:::\s*details(?:\s+.+)?$/.test(trimmed)) {
              depth++;
            } else if (trimmed === ':::') {
              depth--;
              if (depth === 0) {
                nodesToProcess.push({ start: i, end: j, title });
                break;
              }
            }
          }

          j++;
        }

        i = j + 1;
      } else {
        i++;
      }
    }

    for (let k = nodesToProcess.length - 1; k >= 0; k--) {
      const { start, end, title } = nodesToProcess[k];
      const detailsContent = children.slice(start + 1, end);

      const detailsNode: MdastNode = {
        type: 'mdxJsxFlowElement',
        name: 'details',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'data-details-title',
            value: title,
          },
        ],
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'summary',
            attributes: [],
            children: [{ type: 'text', value: title }],
          },
          ...detailsContent,
        ],
      };

      children.splice(start, end - start + 1, detailsNode);
    }
  };
}

export const remarkDetails = plugin;

