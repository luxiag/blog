---
title: 格式化上下文
date: 2021-10-14
category:
  - CSS
---

格式化上下文（Formatting Context）是 CSS2.1 规范中的一个概念，大概说的是页面中的一块渲染区域，规定了渲染区域内部的子元素是如何排版以及相互作用的

## BFC

块格式化上下文，它是一个独立的渲染区域，只有块级盒子参与，它规定了内部的块级盒子如何布局，并且与这个区域外部毫不相干。

- 内部的盒子会在垂直方向，一个接一个地放置；

- 盒子垂直方向的距离由 margin 决定，属于同一个 BFC 的两个相邻盒子的 margin 会发生重叠；

- 每个元素的 margin 的左边，与包含块 border 的左边相接触(对于从左往右的格式化，否则相反)，即使存在浮动也是如此；

- BFC 的区域不会与 float 盒子重叠；

- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

- 计算 BFC 的高度时，浮动元素也参与计算。

**创建 BFC**

- 根元素：html
- 非溢出的可见元素：overflow 不为 visible
- 设置浮动：float 属性不为 none
- 设置定位：position 为 absolute 或 fixed
- 定义成块级的非块级元素：display: inline-block/table-cell/table-caption/flex/inline-flex/grid/inline-grid

<div class="bfc-container">
    <div class="bfc-box">
        display:block
    </div>
     <div class="bfc-box">
        display:block
    </div>
     <div class="bfc-box">
        display:block
    </div>
     <div class="bfc-box">
        display:block
    </div>
     <div class="bfc-box">
        display:block
    </div>
    <div class="bfc-float">
    float
    </div>
</div>

**应用场景**

1、 自适应两栏布局

应用原理：BFC 的区域不会和浮动区域重叠，所以就可以把侧边栏固定宽度且左浮动，而对右侧内容触发 BFC，使得它的宽度自适应该行剩余宽度。

2、清除内部浮动

浮动造成的问题就是父元素高度坍塌，所以清除浮动需要解决的问题就是让父元素的高度恢复正常。而用 BFC 清除浮动的原理就是：计算 BFC 的高度时，浮动元素也参与计算。只要触发父元素的 BFC 即可。

3、 防止垂直 margin 合并

BFC 渲染原理之一：同一个 BFC 下的垂直 margin 会发生合并。所以如果让 2 个元素不在同一个 BFC 中即可阻止垂直 margin 合并。那如何让 2 个相邻的兄弟元素不在同一个 BFC 中呢？可以给其中一个元素外面包裹一层，然后触发其包裹层的 BFC，这样一来 2 个元素就不会在同一个 BFC 中了。

## IFC

IFC 的形成条件非常简单，块级元素中仅包含内联级别元素，需要注意的是当 IFC 中有块级元素插入时，会产生两个匿名块将父元素分割开来，产生两个 IFC。

- 子元素在水平方向上一个接一个排列，在垂直方向上将以容器顶部开始向下排列；
- 节点无法声明宽高，其中 margin 和 padding 在水平方向有效在垂直方向无效；
- 节点在垂直方向上以不同形式对齐；
- 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的线盒（line box）。线盒的宽度是由包含块（containing box）和与其中的浮动来决定；
- IFC 中的 line box 一般左右边贴紧其包含块，但 float 元素会优先排列。
- IFC 中的 line box 高度由 line-height 计算规则来确定，同个 IFC 下的多个 line box 高度可能会不同；
- 当内联级盒子的总宽度少于包含它们的 line box 时，其水平渲染规则由 text-align 属性值来决定；
- 当一个内联盒子超过父元素的宽度时，它会被分割成多盒子，这些盒子分布在多个 line box 中。如果子元素未设置强制换行的情况下，inline box 将不可被分割，将会溢出父元素

<div class="ifc-container">
    <div class="ifc-box">
        display:incline
    </div>
       <div class="ifc-box">
        display:incline
    </div>
       <div class="ifc-box">
        display:incline
    </div>
       <div class="ifc-box">
        display:incline
    </div>   <div class="ifc-box">
        display:incline
    </div>
       <div class="ifc-box">
        display:incline
    </div>
    <div class="ifc-float">
    float
    </div>
</div>

**应用场景**

水平居中：当一个块要在环境中水平居中时，设置其为 inline-block 则会在外层产生 IFC，通过 text-align 则可以使其水平居中。

垂直居中：创建一个 IFC，用其中一个元素撑开父元素的高度，然后设置其 vertical-align: middle，其他行内元素则可以在此父元素下垂直居中。


## FFC

FFC(Flex Formatting Contexts)直译为"自适应格式化上下文"，display值为flex或者inline-flex的元素将会生成自适应容器（flex container）。

Flex Box 由伸缩容器和伸缩项目组成。通过设置元素的 display 属性为 flex 或 inline-flex 可以得到一个伸缩容器。设置为 flex 的容器被渲染为一个块级元素，而设置为 inline-flex 的容器则渲染为一个行内元素。

## GFC

GFC(GridLayout Formatting Contexts)直译为"网格布局格式化上下文"，当为一个元素设置display值为grid的时候，此元素将会获得一个独立的渲染区域，我们可以通过在网格容器（grid container）上定义网格定义行（grid definition rows）和网格定义列（grid definition columns）属性各在网格项目（grid item）上定义网格行（grid row）和网格列（grid columns）为每一个网格项目（grid item）定义位置和空间。

GFC将改变传统的布局模式，他将让布局从一维布局变成了二维布局。简单的说，有了GFC之后，布局不再局限于单个维度了。这个时候你要实现类似九宫格，拼图之类的布局效果显得格外的容易。

<style>
    .bfc-container {
        background-color:#FF7043;
        overflow:hidden;
        
    }
    .bfc-box {
        height: 40px;
        width:160px;
        background-color:#FFEB3B;
        padding: 10px;
        margin:10px;
        display:block;

    }
    .bfc-float {
        float:left;
        height: 40px;
        width:160px;
        background-color:#4DD0E1;
        padding: 10px;
        margin:10px;
    }

     .ifc-container {
        background-color:#FF7043;
        display:block;
        margin:20px;
        
    }
    .ifc-box {
           height: 40px;
        width:160px;
        background-color:#FFEB3B;
        padding: 10px;
        margin:10px;
        display:inline;

    }
    .ifc-float {
        float:left;
        height: 40px;
        width:160px;
        background-color:#4DD0E1;
        padding: 10px;
        margin:10px;
        display:inline;
    }
</style>


