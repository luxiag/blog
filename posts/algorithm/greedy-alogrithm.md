---
title: 贪婪算法
date: 2022-10-02
category:
  - 算法
tag:
  - 算法图解
---


是一种在每一步选择中都采取在当前状态下最好或最优（即最有利）的选择，从而希望导致结果是最好或最优的算法。

# 教室调度问题

| 课程   | 开始时间 | 结束时间 |
| ------ | -------- | -------- |
| 美术   | 9AM      | 10AM     |
| 英语   | 9:30AM   | 10:30AM  |
| 数学   | 10AM     | 11AM     |
| 计算机 | 10:30AM  | 11:30AM  |
| 音乐   | 11AM     | 12PM     |

(1) 选出结束最早的课，它就是要在这间教室上的第一堂课。

(2) 接下来，必须选择第一堂课结束后才开始的课。同样，你选择结束最早的课，这将是要
在这间教室上的第二堂课。

| 课程   | 开始时间 | 结束时间 |     |
| ------ | -------- | -------- | --- |
| 美术   | 9AM      | 10AM     | ✅  |
| 英语   | 9:30AM   | 10:30AM  | ❌  |
| 数学   | 10AM     | 11AM     | ✅  |
| 计算机 | 10:30AM  | 11:30AM  | ❌  |
| 音乐   | 11AM     | 12PM     | ✅  |

# [种花问题](https://leetcode.cn/problems/can-place-flowers/description/?envType=problem-list-v2&envId=greedy)

假设有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花不能种植在相邻的地块上，它们会争夺水源，两者都会死去。

给你一个整数数组 flowerbed 表示花坛，由若干 0 和 1 组成，其中 0 表示没种植花，1 表示种植了花。另有一个数 n ，能否在不打破种植规则的情况下种入 n 朵花？能则返回 true ，不能则返回 false 。

```md
输入：flowerbed = [1,0,0,0,1], n = 1
输出：true

输入：flowerbed = [1,0,0,0,1], n = 2
输出：false

```

```ts

function canPlaceFlowers(flowerbed: number[], n: number): boolean {
    let length = flowerbed.length;
    /**
     * 贪心
     * 能种花的地方
     *  当前位置没有花
     *  前面要么没有花, 要么是边界
     *  后面要么没有花, 要么是边界
     */
    for (let i = 0; i < length; i++) {
        if (flowerbed[i] == 0 && (i == 0 || flowerbed[i-1] == 0) && (i == length-1 || flowerbed[i+1] == 0)){
            n--;
            flowerbed[i] = 1;
        }
        if (n <= 0){
            return true;
        }
    }
    return false;
}

```

# [跳跃游戏](https://leetcode.cn/problems/jump-game/description/?envType=problem-list-v2&envId=greedy)

给定一个非负整数数组 nums ，你最初位于数组的第一个位置。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个位置。

```md
输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步，从位置 0 到达 位置 1, 然后再从位置 1 跳 3 步到达最后一个位置。

输入：nums = [3,2,1,0,4]
输出：false
解释：无论怎样，你总会到达索引为 3 的位置。但该位置的最大跳跃长度是 0 ， 所以你永远不可能到达最后一个位置。
```

```ts
function canJump(nums: number[]): boolean {
    const n = nums.length;
    let rightmost = 0;
    for (let i = 0; i < n; ++i) {
        if (i <= rightmost) {
          // 每次都拿最大值
            rightmost = Math.max(rightmost, i + nums[i]);
            if (rightmost >= n - 1) {
                return true;
            }
        }
    }
    return false;
}
```

# [跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/description/)

```md
给你一个非负整数数组 nums ，你最初位于数组的第一个位置。
数组中的每个元素代表你在该位置可以跳跃的最大长度。
你的目标是使用最少的跳跃次数到达数组的最后一个位置。
假设你总是可以到达数组的最后一个位置。

输入: nums = [2,3,1,1,4]
输出: 2
解释: 跳到最后一个位置的最小跳跃数是 2。
从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
```

```js
// https://leetcode.cn/problems/jump-game-ii/solutions/230241/tiao-yue-you-xi-ii-by-leetcode-solution/
function jump(nums) {
  let length = nums.length;
  let end = 0;
  let maxPosition = 0;
  let steps = 0;
  for (let i = 0; i < length - 1; i++) {
    //每次在上次能跳到的范围（end）内选择一个能跳的最远的位置
    maxPosition = Math.max(maxPosition, i + nums[i]);
    if (i === end) {
      end = maxPosition;
      steps++;
    }
  }
  return steps;
}
```

# [雇佣 K 名工人的最低成本](https://leetcode.cn/problems/minimum-cost-to-hire-k-workers/description/?envType=problem-list-v2&envId=greedy)

有 n 名工人。 给定两个数组 quality 和 wage ，其中，quality[i] 表示第 i 名工人的工作质量，其最低期望工资为 wage[i] 。

现在我们想雇佣 k 名工人组成一个 工资组。在雇佣 一组 k 名工人时，我们必须按照下述规则向他们支付工资：

对工资组中的每名工人，应当按其工作质量与同组其他工人的工作质量的比例来支付工资。
工资组中的每名工人至少应当得到他们的最低期望工资

```md

输入： quality = [10,20,5], wage = [70,50,30], k = 2
输出： 105.00000
解释： 我们向 0 号工人支付 70，向 2 号工人支付 35。

输入： quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
输出： 30.66667
解释： 我们向 0 号工人支付 4，向 2 号和 3 号分别支付 13.33333。


```

```ts
function mincostToHireWorkers(quality: number[], wage: number[], k: number): number {
    const n = quality.length;
    const h = new Array(n).fill(0).map((_, i) => i);
    h.sort((a, b) => {
        return quality[b] * wage[a] - quality[a] * wage[b];
    });
    let res = 1e9;
    let totalq = 0.0;
    const pq = new MaxPriorityQueue();
    for (let i = 0; i < k - 1; i++) {
        totalq += quality[h[i]];
        pq.enqueue(quality[h[i]]);
    }
    for (let i = k - 1; i < n; i++) {
        let idx = h[i];
        totalq += quality[idx];
        pq.enqueue(quality[idx]);
        const totalc = (wage[idx] / quality[idx]) * totalq;
        res = Math.min(res, totalc);
        totalq -= pq.dequeue().element;
    }
    return res;
}

```
