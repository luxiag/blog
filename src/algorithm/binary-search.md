---
title: 二分查找
reference: 算法图解
date: 2022-09-15
category:
  - 算法
tag: 
  - 算法图解
---

**仅当列表是有序的时候，二分查找才管用**

# 工作原理

我随便想一个 1 ～ 100 的数字。
**糟糕的算法**
![](./images/20220915113332.png)  
![](./images/20220915113350.png)
**更佳的查找方式**
![](./images/20220915113532.png)  
![](./images/20220915113549.png)  
![](./images/20220915113613.png)
![](./images/20220915164338.png)  

```js
const binary_search = (list, aim) => {
  let low = 0;
  let hight = list.length - 1;
  let mid = 0;
  while (low < hight) {
    mid = parseInt((low + hight) / 2);
    guess = list[mid];
    if (guess == aim) {
      return mid;
    } else if (guess > aim) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return null;
};
// 运行时间 log2(n)
```
