---
title: CSS中的数据类型
date: 2021-10-15
category:
  - CSS
---

## 文本类型

- `<custom-ident>`
- 作为  `<ident>`  预定义的关键字
- `<string>`
- `<url>`

### custom-ident

用户自定义字符串标识符

`<custom-ident>`  语法同 CSS 属性名相似，但它是区分大小写的。可以由以下字符组成：

- 字母 (`A` - `Z`, `a` - `z`),
- 十进制数 (`0` - `9`),
- 连字符 (``),
- 下划线 (`_`),
- 转义字符 ( `\`),
- [Unicode](http://en.wikipedia.org/wiki/Unicode)  编码（格式：转义字符（`\`）后跟 1 到 6 位十六进制数）

```css
/* validIdent*/
@keyframe validIdent {
  /* keyframes go here */
}

@keyframe 'validString' {
  /* keyframes go here */
}
.item {
  /*content*/
  grid-area: content;
}
```

### 预定义的关键值

预定义的关键值是由 CSS 标准为属性定义的文本值

```css
.box {
  /*left*/
  float: left;
}
```

### `<string>`

```css
.item::after {
  content: "This is my content.";
}
```

### `<url>`

```css
.box {
  background-image: url("images/my-background.png");
}
```

## 数值数据类型

- `<integer>`
- `<number>`
- `<dimension>`
- `<percentage>`

### integer

一个整数包含  0  到  9 的一个或多个十进制数字，例如  1024  或  -55。一个整数可能额外包含  +  或  -  前缀，在正负号和数值之间没有任何空格。

### number

表示一个真正的数，有可能又或者没有小数点和小数部分。例如 0.255，128 或 -1.2。数值也可能包含前缀 + 或 - 标识正负。

### dimension

是一个包含单位的 `number`，例如 45deg，100ms，或者 10px。

### percentage

百分比

```css
.box {
  width: 50%;
}
```
