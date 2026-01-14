
---
title: 代码运行功能演示
date: 2023-12-15
excerpt: 演示如何在博客中使用可运行的 JavaScript 代码块
tags: [JavaScript, 交互式, 演示]
---

# 代码运行功能演示

本篇博客演示了如何在 Markdown 文件中添加可运行的 JavaScript 代码。

## 基本用法

有两种方式可以标记代码块为可运行：

### 方法1：添加特殊注释

在代码块的第一行添加 `// 可运行` 或 `// runnable` 注释：

```javascript
// 可运行
const message = "Hello, World!";
console.log(message);
```

### 方法2：使用 data-runnable 属性（高级用法）

```javascript {data-runnable="true"}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("原始数组:", numbers);
console.log("翻倍后的数组:", doubled);
```

## 示例：计算器

下面是一个简单的计算器示例：

```javascript
// 可运行
function calculate(operation, a, b) {
  switch(operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      return b !== 0 ? a / b : 'Error: Division by zero';
    default:
      return 'Error: Unknown operation';
  }
}

console.log("10 + 5 =", calculate('add', 10, 5));
console.log("10 - 5 =", calculate('subtract', 10, 5));
console.log("10 * 5 =", calculate('multiply', 10, 5));
console.log("10 / 5 =", calculate('divide', 10, 5));
```

## 示例：数组操作

```javascript
// 可运行
const fruits = ['apple', 'banana', 'orange', 'grape', 'kiwi'];

// 过滤长度大于5的水果
const longFruits = fruits.filter(fruit => fruit.length > 5);
console.log("长度大于5的水果:", longFruits);

// 将所有水果名转为大写
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log("大写水果名:", upperFruits);

// 检查是否包含特定水果
console.log("是否包含'apple':", fruits.includes('apple'));
console.log("是否包含'pear':", fruits.includes('pear'));
```

## 注意事项

1. 目前只支持 JavaScript 代码的运行
2. 出于安全考虑，代码运行在受限环境中
3. 代码只能访问 console 对象，无法访问 DOM、网络等 API
4. 复杂的计算可能需要一些时间才能完成

## 总结

通过这个功能，你可以创建交互式的教程和演示，让读者直接在博客中运行代码并查看结果，大大提升了学习和体验的效果。
