---
title: 排序算法
date: 2022-09-15
category:
  - 算法
---

## 冒泡排序

- 比较相邻的元素。如果第一个比第二个大，就交换它们两个；
- 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
- 针对所有的元素重复以上的步骤，除了最后一个；
- 重复步骤 1~3，直到排序完成。

```js
function bubbleSort(oldArr) {
  let arr = oldArr;
  for (let i = 0; i < arr.length - 1; i++) {
    // -i 跟i后面的元素进行比较
    for (let j = 0; j < arr.length - 1 - i; j++) {
      // 相邻元素比较
      if (arr[j] > arr[j + 1]) {
        // 元素交换
        const TEMP = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = TEMP;
      }
    }
  }
  return arr;
}
```

## 选择排序

- 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
- 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾
- 以此类推，直到所有元素均排序完毕。

```js
function selectionSort(oldArr) {
  let arr = oldArr;

  let minIndex, temp;

  for (let i = 0; i < arr.length - 1; i++) {
    minIndex = j;
    // 比较后面的元素
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        // 获取最小元素的index
        minIndex = j;
      }
    }
    // 将最小元素移动到已排序的末尾
    temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}
```

## 插入排序

- 以第一个元素建立排序序列
- 取出下一个元素，在排序好的序列中进行对比排序插入
- 以此类推，直到所有元素均排序完毕。

```js
function insertionSort(oldArr) {
  let arr = oldArr;
  let preIndex, current;
  for (let i = 1; i < arr.length; i++) {
    // 获取序列末尾元素
    preIndex = i - 1;
    current = arr[i];
    // 与末尾元素进行比较  末尾元素大于比较元素 进行后移
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    // 插入小于的元素前面
    arr[preIndex + 1] = current;
  }
  return arr;
}
```

## 希尔排序

- 先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序
- 待整个序列中的记录"基本有序"时，再对全体记录进行依次直接插入排序。

| 平均时间复杂度 | 最好情况    | 最坏情况    | 空间复杂度 | 排序方式 | 稳定性 |
| -------------- | ----------- | ----------- | ---------- | -------- | ------ |
| O(nlogn)       | O(nlog^2^ n) | O(nlog^2^ n) | O(1)       | In-place | 不稳定 |

```js
function shellSort(oldArr) {
  let arr = oldArr;
  const len = arr.length;
  //以第gap个元素建立 排序序列 分为若干个子序列进行插入排序
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 开始插入排序
    for (let i = gap; i < len; i++) {
      let j = i;
      let current = arr[i];
      while (j - gap >= 0 && current < arr[j - gap]) {
        arr[j] = arr[j - gap];
        j = j - gap;
      }
      arr[j] = current;
    }
  }
  return arr;
}
```

## 归并排序
- 先使每个子序列有序，再使子序列段间有序
- 将已有序的子序列合并
| 平均时间复杂度 | 最好情况    | 最坏情况    | 空间复杂度 | 排序方式 | 稳定性 |
| -------------- | ----------- | ----------- | ---------- | -------- | ------ |
| O(nlogn)       | O(nlog n) | O(nlog n) | O(n)       | In-place | 不稳定 |

```js


```
