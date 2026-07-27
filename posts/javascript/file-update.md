---
title: 大文件上传
category: JavaScript
date: 2024-12-13
---

前端拿到超大文件，需要把文件进行切割分成固定大小的切片，再通过http请求把所有的切片传给后端，后端拿到切片后，处理每一个切片并返回是否处理成功给前端，等把所有的切片都上传完后，后端再把所有的切片合并成一个完整的文件，代表大文件上传完成

```html
<input type="file" @change="handleUploadFile" />



```

# 参考

- <https://juejin.cn/post/7385098943942934582#heading-4>
- <https://juejin.cn/post/6844904046436843527#heading-16>
