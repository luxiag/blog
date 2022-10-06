---
title: 清楚浮动原理
date: 2021-11-22
category:
  - css
---

## BFC 清除浮动

```css
.parent {
  overflow: hidden;
  /* 开启BFC */
}
```

## clear 清除浮动

**原理：利用`clear`属性 将伪元素挤下来**

```css
.clear-fix {
  //在旧的web时代。*zoom: 1可以给IE6/IE7浏览器增加haslayout, 用来清除浮动
  zoom: 1;
}
/* 在父元素上创建伪元素 */
.clear-fix::after {
  content: "";
  /* 设置元素类型为块 占据一行 */
  display: block;
  /* both 两边不能有浮动元素 将伪元素 挤下去 撑开父元素 = 父元素有高度 */
  clear: both;
}
```

::: normal-demo 未 clear 之前的浮动元素

```html
<div class="parent">
  parent
  <div class="child">child</div>
</div>
```

```css
.parent {
  color: pink;
  border: 1px solid pink;
}
.child {
  float: left;
  height: 50px;
  border: 1px solid #4caf50;
  color: #4caf50;
}
.parent::after {
  content: "parent::after";
  color: #26c6da;
  border: 1px solid #26c6da;
}
```

:::

::: normal-demo 未 clear 之后的浮动元素

```html
<div class="parent">
  parent
  <div class="child">child</div>
</div>
```

```css
.parent {
  color: pink;
  border: 1px solid pink;
}
.child {
  float: left;
  height: 50px;
  border: 1px solid #4caf50;
  color: #4caf50;
}
.parent::after {
  content: "parent::after";
  color: #26c6da;
  clear: both;
  display:block;
  border: 1px solid #26c6da;
}
```

:::
