---
title: 视觉格式化模型
date: 2021-11-16
next: formatting-context
category:
  - CSS
---

CSS 视觉格式化模型（visual formatting model）是用来处理和在视觉媒体上显示文档时使用的计算规则。该模型是 CSS 的基础概念之一。

> 盒子类型由 display 决定，同时给一个元素设置 display 后，将会决定这个盒子的 2 个显示类型（display type）：
>
> - outer display type（对外显示）：决定了该元素本身是如何布局的，即参与何种格式化上下文；
> - inner display type（对内显示）：其实就相当于把该元素当成了容器，规定了其内部子元素是如何布局的，参与何种格式化上下文；

## outer display type

对外显示方面，盒子类型可以分成 2 类：

block-level box（块级盒子） 和 inline-level box（行内级盒子）

- 块级盒子：display 为 block、list-item、table、flex、grid、flow-root 等；
- 行内级盒子：display 为 inline、inline-block、inline-table 等；

所有块级盒子都会参与 BFC，呈现垂直排列；而所有行内级盒子都参会 IFC，呈现水平排列

### 块级元素
[address](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/address)联系方式信息。[article](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article) 文章内容。[aside](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/aside) 伴随内容。[blockquote](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/blockquote)块引用。[dd](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dd)定义列表中定义条目描述。[div](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div)文档分区。[dl](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dl)定义列表。[fieldset](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/fieldset)表单元素分组。[figcaption](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/figcaption) 图文信息组标题[figure](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/figure) 图文信息组 (参照 [figcaption](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/figcaption))。[footer](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/footer) 区段尾或页尾。[form](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form)表单。[h1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements), [h2](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements), [h3](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements), [h4](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements), [h5](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements), [h6](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)标题级别 1-6.[header](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/header) 区段头或页头。[hgroup](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/hgroup) 标题组。[hr](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/hr)水平分割线。[ol](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ol)有序列表。[p](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/p)行。[pre](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/pre)预格式化文本。[section](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/section) 一个页面区段。[table](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/table)表格。[ul](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ul)

无序列表。
### 行内元素

- [b](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/b), [big](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/big), [i](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/i), [small](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/small), [tt](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/tt)
- [abbr](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/abbr), [acronym](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/acronym), [cite](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/cite), [code](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/code), [dfn](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dfn), [em](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/em), [kbd](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/kbd), [strong](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/strong), [samp](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/samp), [var](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/var)
- [a](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a), [bdo](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/bdo), [br](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/br), [img](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img), [map](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/map), [object](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/object), [q](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/q), [script](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script), [span](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/span), [sub](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/sub), [sup](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/sup)
- [button](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button), [input](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input), [label](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/label), [select](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select), [textarea](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/textarea)


## inner display type 

对内方面，其实就是把元素当成了容器，里面包裹着文本或者其他子元素。container box 的类型依据 display 的值不同，分为 4 种：

- block container：建立 BFC 或者 IFC；
- flex container：建立 FFC；
- grid container：建立 GFC;
- ruby container：接触不多，不做介绍。

> 值得一提的是如果把 img 这种替换元素（replaced element）申明为 block 是不会产生 container box 的，因为替换元素比如 img 设计的初衷就仅仅是通过 src 把内容替换成图片，完全没考虑过会把它当成容器。
>