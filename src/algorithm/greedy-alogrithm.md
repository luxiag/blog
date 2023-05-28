---
title: 贪婪算法
date: 2022-10-02
category:
  - 算法
tag:
  - 算法图解
---

## 教室调度问题

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

## 跳跃游戏

来源：https://leetcode.cn/problems/jump-game-ii/description/

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

来源：https://leetcode.cn/problems/jump-game-ii/solutions/230241/tiao-yue-you-xi-ii-by-leetcode-solution/

```js
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
