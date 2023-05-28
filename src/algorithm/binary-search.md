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
  let guess;
  while (low <= hight) {
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

## 在排序数组中查找元素的第一个和最后一个位置

<https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/>
给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 target，返回 [-1, -1]。

你必须设计并实现**时间复杂度为 O(log n)** 的算法解决此问题。

```md
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]

输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
```

```ts
function searchRange(nums: number[], target: number): number[] {
  let result:number[] = [-1,-1]
  const leftIdx = search(nums,target,true)
  const rightIdx = search(nums,target,false) -1

  if(leftIdx <= rightIdx && rightIdx< nums.length && nums[leftIdx ]=== target  && nums[rightIdx] === target) {
    result = [leftIdx,rightIdx]
  }
  return result
}

// lower = true 获取左边界
// lower = false 获取右边界
function search(nums: number[], target: number, lower: boolean): number {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    //  > right 最终会得到比target大的第一位数  右边界
    //  >= right 最终会得到target所在位置，right -1后，即target已经离开匹配范围，左边界
    if (nums[mid] > target || (lower && nums[mid] >= target)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return right + 1;
}
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
