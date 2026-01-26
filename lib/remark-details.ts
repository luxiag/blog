import { visit } from 'unist-util-visit';

function plugin() {
  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      // 只处理段落节点
      if (node.type !== 'paragraph') return;

      // 检查是否是 ::: details 指令
      const text = node.children?.[0]?.value;
      if (typeof text !== 'string' || !text.startsWith('::: details')) return;

      // 提取标题
      const titleMatch = text.match(/::: details\s+(.+)/);
      const title = titleMatch ? titleMatch[1].trim() : 'Details';

      // 查找结束标记
      const siblings = parent?.children || [];
      let endIndex = index! + 1;
      let depth = 1;

      while (endIndex < siblings.length && depth > 0) {
        const sibling = siblings[endIndex];
        const siblingText = sibling?.children?.[0]?.value;

        if (typeof siblingText === 'string') {
          if (siblingText.startsWith('::: details')) {
            depth++;
          } else if (siblingText === ':::') {
            depth--;
          }
        }

        if (depth === 0) break;
        endIndex++;
      }

      // 提取内容
      const contentNodes = siblings.slice(index! + 1, endIndex);

      // 创建 details 节点
      const detailsNode = {
        type: 'mdxJsxFlowElement',
        name: 'details',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'data-details-title', value: title }
        ],
        children: [...contentNodes]
      };

      // 替换节点
      parent.children.splice(index!, endIndex - index! + 1, detailsNode);

      // 跳过已处理的节点
      return index;
    });
  };
}

export const remarkDetails = plugin;

