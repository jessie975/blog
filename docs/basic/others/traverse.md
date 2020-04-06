---
title: 深度优先遍历和广度优先遍历
date: 2019-11-14 16:39:09
sidebar: 'auto'
categories: 
 - 前端那些事儿
tags: 
 - 算法
publish: true
---
遍历是指：对树中的每一个结点有且仅访问一次。树的遍历分别有**深度优先遍历**和**广度优先遍历**两种模式，而根据访问结点的顺序不同又分为『先序遍历』、『中序遍历』、『后序遍历』三种方法。  

假设我们有这样一组数据,遍历其中所有的name。

```js
const list = [
  {
    name: '1',
    children: [
      { name: '2',
        children: [
          { name: '3' },
          { name: '4',
            children: [{ name: '5' }, { name: '6' }]
          }]
      },
      { name: '7',
        children: [
          { name: '8',
            children: [{ name: '9'}]
          }] }
    ]
  }
]
```

## 深度优先遍历

![深度优先遍历](https://tva1.sinaimg.cn/large/006y8mN6ly1g92cpt8pcmj309e079jrv.jpg)  

深度优先遍历一般采用**堆栈**的形式，即先进后出，递归实现:

```js
function getName(data) {
  let result = [];
  data.forEach(item => {
    let map = data => {
      result.push(data.name);
      data.children && data.children.forEach(child => {map(child)});
    }
    map(item);
  })
  return result.join(',');
}
console.log(getName(list));
// 1,2,3,4,5,6,7,8,9
```

## 广度优先遍历

![广度优先](https://tva1.sinaimg.cn/large/006y8mN6ly1g92frc38gfj30gs0bmac7.jpg)  

广度优先遍历一般采用**队列**的形式实现，即先进先出：

```js
function getName2(data) {
  let result = [];
  let queue = data;
  while (queue.length > 0) {
    [...queue].forEach(child => {
      queue.shift();
      result.push(child.name);
      child.children && (queue.push(...child.children));
    })
  }
  return result.join(',');
}
console.log(getName2(list))
// 1,2,7,3,4,8,5,6,9
```
