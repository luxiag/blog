function plugin() {
  return (tree: unknown) => {
    const children = (tree as { children?: Array<unknown> }).children;
    if (!children) return;

    const nodesToProcess: Array<{ start: number; end: number; title: string }> = [];
    let i = 0;

    while (i < children.length) {
      const node = children[i] as { type: string; value?: string };

      if (node.type === 'paragraph' && typeof node.value === 'string' && node.value.startsWith('::: details')) {
        const titleMatch = node.value.match(/::: details\s+(.+)/);
        const title = titleMatch ? titleMatch[1].trim() : 'Details';
        let depth = 1;
        let j = i + 1;

        while (j < children.length && depth > 0) {
          const current = children[j] as { type: string; value?: string };

          if (current.type === 'paragraph' && typeof current.value === 'string') {
            if (current.value === '::: details') {
              depth++;
            } else if (current.value === ':::') {
              depth--;
              if (depth === 0) {
                nodesToProcess.push({ start: i, end: j, title });
                break;
              }
            }
          }
          j++;
        }
        i = j;
      } else {
        i++;
      }
    }

    for (let i = nodesToProcess.length - 1; i >= 0; i--) {
      const { start, end, title } = nodesToProcess[i];
      const detailsContent = children.slice(start + 1, end);

      const detailsNode = {
        type: 'html',
        value: `<details data-details-title="${title}"><summary></summary>${detailsContent.map((c: unknown) => {
          const node = c as { type: string; value?: string };
          if (node.type === 'code') {
            return `<pre><code>${node.value || ''}</code></pre>`;
          }
          return node.value || '';
        }).join('\n')}</details>`,
      };

      children.splice(start, end - start + 1, detailsNode);
    }
  };
}

export const remarkDetails = plugin;
