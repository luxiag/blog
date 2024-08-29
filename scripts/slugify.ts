// string.js slugify drops non ascii chars so we have to
// use a custom implementation here
import { remove } from 'diacritics'

// eslint-disable-next-line no-control-regex
const rControl = /[\u0000-\u001F]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g


/*
移除非 ASCII 字符：

使用 diacritics 库的 remove 函数移除字符串中的重音符号和其他非 ASCII 字符。
移除控制字符：

使用正则表达式 /[\u0000-\u001F]/g 匹配并移除字符串中的控制字符（ASCII 值在 0 到 31 之间的字符）。
替换特殊字符：

使用正则表达式 /[\s~!@#$%^&*()-_+=[]{}|\;:"'<>,.?/]+/g 匹配并替换字符串中的特殊字符为连字符（-`）。
移除连续的分隔符：

使用正则表达式 /-{2,}/g 匹配并替换字符串中的连续分隔符（两个或更多连字符）为一个分隔符。
移除前缀和尾部的分隔符：

使用正则表达式 /^-+|-+$/g 匹配并移除字符串前缀和尾部的分隔符。
确保不以数字开头：

使用正则表达式 /^(\d)/ 匹配字符串开头的数字，并在其前面添加一个下划线（_）。
转换为小写：

使用 toLowerCase() 方法将字符串转换为小写

*/
export function slugify(str: string): string {
  return (
    remove(str)
      // Remove control characters
      .replace(rControl, '')
      // Replace special characters
      .replace(rSpecial, '-')
      // Remove continuos separators
      .replace(/-{2,}/g, '-')
      // Remove prefixing and trailing separtors
      .replace(/^-+|-+$/g, '')
      // ensure it doesn't start with a number (#121)
      .replace(/^(\d)/, '_$1')
      // lowercase
      .toLowerCase()
  )
}
