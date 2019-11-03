--- 
title: 排序算法学习
date: 2019-10-15 14:40:20
sidebar: 'auto'
categories: 
 - 学习总结
tags: 
 - 算法
publish: true
---
先来张经典的图压压惊：  
![排序算法](https://tva1.sinaimg.cn/large/006y8mN6ly1g818s3f0ixj310e0me190.jpg)

## 快速排序

思路：

1. 将数组中间的数取出
2. 建立左右两个空数组，遍历数组，小于中间的数则放入左数组，否则放入右数组
3. 递归使左右数组长度小于1
4. 将数组拼接得到最终结果

代码：

```js
let quickSort = arr => {
  if (arr.length <= 1) {
    return arr
  }
  let midIndex = Math.floor(arr.length/2)
  let midValue = arr.splice(midIndex,1)[0]
  let leftArr = []
  let rightArr = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < midValue) {
      leftArr.push(arr[i])
    } else {
      rightArr.push(arr[i])
    }
  }
  let result = [...quickSort(leftArr), midValue, ...quickSort(rightArr)]
  return result
}
```

## 归并排序

## 堆排序

**堆**:一种特殊的完全二叉树(除了最后一层，其他层的节点个数都是满的，最后一层的节点都靠左排列)  
只要满足每个节点的值都大于等于（或者小于等于）其左右子节点的值，它就是一个堆  

大顶堆(大根堆): 对于每个节点的值都**大于等于**子树中每个节点值的堆
小顶堆(小根堆): 对于每个节点的值都**小于等于**子树中每个节点值的堆

思路：  

![堆排序](https://tva1.sinaimg.cn/large/006y8mN6ly1g818jc8y6fg30f70a4u0x.gif)

代码：  

```js
// 建立大根堆
let buildMaxHeap = arr => {
  // 最后一个非叶子结点的位置
  let start = parseInt(Math.floor(arr.length/2) - 1)
  let size = arr.length
  for (let i = start; i >= 0; i--) {
    adjustHeap(arr, i, size)
  }
}

let adjustHeap = (arr, index, size) => {
  while(true) {
    let max = index;
    let left = index * 2 + 1;   // 左节点
    let right = index * 2 + 2;  // 右节点
    // 如果左右结点大于当前的结点则交换
    if(left < size && arr[max] < arr[left])  max = left;
    if(right < size && arr[max] < arr[right])  max = right;
    // 再循环一遍判断交换后的左右结点位置是否破坏了堆结构（比左右结点小了）
    if(index !== max) {
      swap(arr, index, max)
      index = max;
    }
    else {
      break;
    }
  }
}

let swap = (arr, index, max) => {
  [arr[index], arr[max]] = [arr[max], arr[index]]
}

let heapSort = arr => {
  buildMaxHeap(arr)
  for(let i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i)
    adjustHeap(arr, 0, i);
  }
  return arr;
}
```

## 对比

```js
let arr = [3, 44, 38, 5, 47, 15, 36, 26];

console.time('quickSort')
console.log(quickSort(arr))
console.timeEnd('quickSort')

console.time('heapSort');
console.log(heapSort(arr));
console.timeEnd('heapSort')
```

![对比](https://tva1.sinaimg.cn/large/006y8mN6ly1g818ldvgfcj30jy03ijrs.jpg)
