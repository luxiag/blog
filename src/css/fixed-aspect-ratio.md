---
title: 固定宽高比
date: 2021-10-17
category:
  - CSS
---

## 可替换元素实现固定宽高比

可替换元素(如`<img>`、`<video>`)和其他元素不同，它们本身有像素宽度和高度的概念

指定其宽度或者高度值，另一边自动计算就可以

::: normal-demo 可替换元素实现固定宽高比

```html
<div class="wrapper">
  <img src="https://p3.ssl.qhimg.com/t01f7d210920c0c73bd.jpg" alt="" />
</div>
```

```css
.wrapper {
  width: 50px;
  padding: 10px;
  margin: auto;
  border: 5px solid #81d4fa;
  font-size: 0;
}
img {
  opacity: 0;
}
```

:::

## padding-bottom 实现

**垂直方向上的内外边距使用百分比做单位时，是基于包含块的宽度来计算的。**

4/3 的固定宽高比的空盒子
::: normal-demo padding-bottom 实现

```html
<div class="pb-wrapper">
  <div class="container"></div>
</div>
```

```css
.pb-wrapper {
  width: 100px;
}
.container {
  width: 100%;
  height: 0;
  padding: 0;
  padding-bottom: 75%;
  margin: 50px;
  background-color: #8bc34a;
}
```

:::

## aspect-ratio 属性实现

16/9 的固定宽高比的空盒子
::: normal-demo aspect-ratio 属性实现

```html
<div class="box1"></div>
```

```css
.box1 {
  width: 100px;
  height: auto;
  aspect-ratio: 16/9;
  background-color: #8bc34a;
}
```

:::
