
// 计算文章的阅读时间（分钟）
export function calculateReadingTime(content: string): string {
  // 平均阅读速度：每分钟 200 个单词（中文）
  // 英文单词平均长度约为 5 个字符，中文每个字符算一个词
  const wordsPerMinute = 200;

  // 移除 Markdown 语法
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 移除图片
    .replace(/\[[^\]]*\]\([^)]*\)/g, '') // 移除链接
    .replace(/#{1,6}\s+/g, '') // 移除标题标记
    .replace(/\*\*([^*]*)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*([^*]*)\*/g, '$1') // 移除斜体标记
    .replace(/~~([^~]*)~~/g, '$1') // 移除删除线标记
    .replace(/^\s*[-*+]\s+/gm, '') // 移除列表标记
    .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表标记
    .replace(/^\s*>\s+/gm, '') // 移除引用标记
    .replace(/\n{2,}/g, '\n') // 合并多个换行
    .trim();

  // 计算字符数（中文每个字符算一个词，英文按空格分词）
  const chineseChars = (plainText.match(/[一-龥]/g) || []).length;
  const englishWords = plainText
    .replace(/[一-龥]/g, '') // 移除中文字符
    .split(/\s+/) // 按空格分词
    .filter(word => word.length > 0).length;

  const totalWords = chineseChars + englishWords;
  const readingTime = Math.ceil(totalWords / wordsPerMinute);

  return `${readingTime} 分钟阅读`;
}
