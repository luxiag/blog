---
title: 哈希表
date: 2022-09-23
category:
  - 算法
tag: 
  - 算法图解

---



哈希表（Hash Table，也叫散列表），是根据键（Key）而直接访问在内存存储位置的数据结构。哈希表通过计算一个关于键值的函数，将所需查询的数据映射到表中一个位置来访问记录，这加快了查找速度。这个映射函数称做哈希函数，存放记录的数组称做哈希表

打造一个让你能够迅速获悉商品价格的工具

```js
const table = [];
table["apple"] = "5块";
table["milk"] = "4块";
```

# [两数之和](https://leetcode.cn/problems/two-sum/description/?envType=problem-list-v2&envId=hash-table)

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

```md
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

输入：nums = [3,2,4], target = 6
输出：[1,2]

输入：nums = [3,3], target = 6
输出：[0,1]

```

```ts
// 记录每个索引的值
// 遍历数组，如果存在 target - 当前值，则返回当前索引和 target - 当前值的索引
function twoSum(nums: number[], target: number): number[] {
    const hashtable: Map<number, number> = new Map<number, number>();
    for (let i = 0; i < nums.length; ++i) {
        if (hashtable.has(target - nums[i])) {
            return [hashtable.get(target - nums[i])!, i];
        }
        hashtable.set(nums[i], i);
    }
    return [];
}

```

# [最长连续序列] (<https://leetcode.cn/problems/longest-consecutive-sequence/description/?envType=problem-list-v2&envId=hash-table>)

给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

```md
输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。

输入：nums = [0,3,7,2,5,8,4,6,0,1]
输出：9

```

```ts
//https://leetcode.cn/problems/longest-consecutive-sequence/solutions/276931/zui-chang-lian-xu-xu-lie-by-leetcode-solution/?envType=problem-list-v2&envId=hash-table

// 建立每个值对应的索引，
// 遍历数组，如果存在当前值 - 1，则跳过，否则从当前值开始，查找当前值 + 1，直到不存在，记录当前值
function longestConsecutive (nums: number[]): number {
    let num_set: Set<number> = new Set();
    for (const num of nums) {
        num_set.add(num);
    }

    let longestStreak = 0;

    for (const num of num_set) {
        if (!num_set.has(num - 1)) {
            let currentNum = num;
            let currentStreak = 1;

            while (num_set.has(currentNum + 1)) {
                currentNum += 1;
                currentStreak += 1;
            }

            longestStreak = Math.max(longestStreak, currentStreak);
        }
    }

    return longestStreak;   
};

```

# [多数元素 II](https://leetcode.cn/problems/majority-element-ii/description/?envType=problem-list-v2&envId=hash-table)

给定一个大小为 n 的整数数组，找出其中所有出现超过 ⌊ n/3 ⌋ 次的元素。

```md
输入：nums = [3,2,3]
输出：[3]

输入：nums = [1]
输出：[1]
```

```ts
// 遍历数组 对数组的值作为key,出现次数作为value
function majorityElement(nums: number[]): number[] {
    const cnt = new Map();

    for (let i = 0; i < nums.length; i++) {
        if (cnt.has(nums[i])) {
            cnt.set(nums[i], cnt.get(nums[i]) + 1);
        } else {
            cnt.set(nums[i], 1);
        }
    }
    const ans = [];
    for (const x of cnt.keys()) {
        if (cnt.get(x) > Math.floor(nums.length / 3)) {
            ans.push(x);
        }
    }

    return ans;
}
```
