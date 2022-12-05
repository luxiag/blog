---
title: 双指针
reference: 算法图解
date: 2022-12-30
category:
  - 算法
tag:
  - 算法图解
---

## 盛最多水的容器

来源： https://leetcode.cn/problems/container-with-most-water/description/

![](images/168012340-12-01-15-21-17.png)

```md
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

```js
//来源：https://leetcode.cn/problems/container-with-most-water/solutions/207215/sheng-zui-duo-shui-de-rong-qi-by-leetcode-solution/
// 总是移动数字较小的那个指针
// [1, 8, 6, 2, 5, 4, 8, 3, 7]
//     ^                    ^

function maxArea(height) {
  // 定义两个指针
  let l = 0,
    r = height.length - 1;
  // 最大值
  let ans = 0;
  while (l < r) {
    let area = Math.min(height[l], height[r]) * (r - l);
    ans = Math.max(ans,area);
    if(height[l] <= height[r]) {
        ++l
    }else {
        --r
    }
  }
  return ans
}
```
