--- 
title: offer攻坚战——算法篇（分治算法）
date: 2020-04-10 15:48:44
sidebar: 'auto'
categories: 
 - 算法
tags: 
 - 算法
publish: true
---

## 什么是分治算法

分治算法的基本思想是将一个规模为N的问题分解为K个规模较小的子问题，这些子问题相互独立且与原问题性质相同。求出子问题的解，就可得到原问题的解。

求解步骤可分为如下步骤：

- 分解：分解原问题为结构相同的子问题（即寻找子问题）
- 解决：当分解到容易求解的边界后，进行递归求解
- 合并：将子问题的解合并成原问题的解

话不多说，赶紧来实践一下吧

## 实战

### 归并排序

最典型的例子就是归并排序了。关于归并排序的思路一个图就可以说明白了：

![归并排序](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdpupqo4ulj30cm0b3mxk.jpg)

由上图可以看到，第一步和第二步都能轻松实现，但是第三步怎么优雅的实现呢？

比如将a = [1,3,5]和b = [2,4,6]合并成一个有序的数组

```js
// 方法一：sort()方法
const merge = (a, b) => {
  return [...a, ...b].sort((a, b) => a - b)
}
```

这样的方法确实很简便，但是这样操作的话咱们还要第一二步干嘛呢~咱们先不贫，今天就来深扒一下sort的内部实现原理：  

首先，sort()内部是利用**递归进行冒泡排序**的，我们知道冒泡排序的时间复杂度最优的、最差的、平均的时间复杂度都是O(n ^ 2)，可知当数量达到一定的数量级，sort的执行效率是很低的  

其次，sort()方法会接受一个**比较函数compare(a, b)**，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字，凡是返回大于0的数字都将交换两者的位置  

因此，我们不用sort()方法

```js
// 方法二：新建一个数组，依次比较a， b数组的元素，每次比较都取小的一个放进新数组
const merge = (a, b) => {
  let result = []
  while (a.length > 0 && b.length > 0) {
    if (a[0] <= b[0]) {
      result.push(a.shift())
    } else {
      result.push(b.shift())
    }
  }
  // 如果还有没有比较的就直接放入数组后面
  while (a.length) {
    result.push(a.shift())
  }
  while (b.length) {
    result.push(b.shift())
  }
  return result
}
```

这个方法看起来好像没毛病，但是我们新增了一个数组，空间复杂度增加了，所以这个方法还不是最优的，那么下面我们再来写一个不创建新数组的

```js
const merge = (a, b) => {
  // 方法三：选择一个数组作为基数组，采用从后往前的方法，将另一个数组的元素依次插入基数组中合适的位置
  let i = a.length - 1 // a数组的最后一个元素
  let j = b.length - 1 // b数组的最后一个元素
  let sum = i + j + 1 // 两个数组的总长度
  while (i >= 0 && j >= 0) {
    if (a[i] > b[j]) {
      a[sum] = a[i]
      i -= 1
    } else {
      a[sum] = b[j]
      j -= 1
    }
    sum -= 1
  }
  return a
}
```

这次应该没啥毛病了吧，接下来我们完整实现一下归并排序

```js
const merge = (a, b) => {
  let i = a.length - 1 // a数组的最后一个元素
  let j = b.length - 1 // b数组的最后一个元素
  let sum = i + j + 1 // 两个数组的总长度
  while (i >= 0 && j >= 0) {
    if (a[i] > b[j]) {
      a[sum] = a[i]
      i -= 1
    } else {
      a[sum] = b[j]
      j -= 1
    }
    sum -= 1
  }
  return a
}
const mergeSort = (array) => {
  if (array.length < 2) return array
  const midleIndex = Math.floor(array.length / 2)
  const left = array.slice(0, midleIndex)
  const right = array.slice(midleIndex)
  return merge(mergeSort(left), mergeSort(right))
}
```
