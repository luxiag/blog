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

找到列表的中间值，如果中间值大于查找值，则往数组的左边继续查找，如果小于查找值这往右边继续查找。

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

## 寻找两个正序数组的中位数

<https://leetcode.cn/problems/median-of-two-sorted-arrays/>

给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数
**算法的时间复杂度应该为 O(log (m+n)) 。**

```md
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2
```

::: playground#ts 寻找两个正序数组的中位数

@file index.ts

```ts
// 1 暴力直接数组合并

let nums1 = [1, 2, 3, 4];
let nums2 = [6, 7, 8, 9];

function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  let arr1 = nums1[0] > nums2[0] ? nums2 : nums1;
  let arr2 = nums1[0] > nums2[0] ? nums1 : nums2;
  for (let i = arr1.length; i > 0; i--) {
    if (arr1[i] <= arr2[0]) {
      arr1.splice(i, 0, ...arr2);
      break;
    }
  }
  let lng: number = nums1.length + nums2.length;
  console.log(arr1);
  if (lng % 2 === 0) {
    let i = Math.floor(lng / 2);
    return (arr1[i - 1] + arr1[i]) / 2;
  } else {
    let i = lng / 2;
    return arr1[i] / 2;
  }
}


console.log(findMedianSortedArrays(nums1, nums2));

//  2
```

@setting

```json
{
  "target": "es5"
}
```

---
