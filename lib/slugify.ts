/**
 * 将文本转换为可用于 HTML id 的 slug
 * 统一处理中英文、数字，移除特殊字符
 * 
 * 注意：此函数需要与客户端 extractText + generateHeadingId 的行为保持一致
 * 客户端 React 渲染时会移除某些符号（如括号、冒号等），所以这里也要先移除它们
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  // 先统一处理符号：移除中英文引号、括号、冒号、顿号、问号、斜杠、点号
  // 破折号转成连字符（与客户端行为保持一致）
  const normalizedText = text
    .replace(/[""''""「」『』]/g, '')  // 引号
    .replace(/[（）()]/g, '')         // 括号
    .replace(/[：:]/g, '')            // 冒号
    .replace(/[、，,]/g, '')          // 顿号、逗号
    .replace(/[？?]/g, '')            // 问号
    .replace(/[\/]/g, '')            // 斜杠
    .replace(/[.]/g, '')              // 点号（如 3.1 中的点）
    .replace(/[—–]+/g, '-');          // 破折号转成连字符（注意：不包括普通连字符 -）
  
  return normalizedText
    .toLowerCase()
    // 保留中文字符(\u4e00-\u9fa5)、字母、数字，其他字符替换为 -
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')
    // 移除开头和结尾的 -
    .replace(/^-+|-+$/g, '');
}

/**
 * 生成唯一的 id，处理重复的情况
 * 与 extractToc 函数使用相同的逻辑
 */
export function generateUniqueId(text: string, usedIds: Map<string, number>): string {
  let baseId = slugify(text);
  
  // 如果 ID 为空（例如标题全是特殊符号），给个默认值
  if (!baseId) baseId = 'section';
  
  // 处理重复 - 使用与 extractToc 相同的逻辑
  const count = usedIds.get(baseId) || 0;
  let finalId = baseId;
  
  if (count > 0) {
    finalId = `${baseId}-${count}`;
  }
  
  usedIds.set(baseId, count + 1);
  
  return finalId;
}
