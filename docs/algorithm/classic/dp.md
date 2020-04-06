--- 
title: offer攻坚战——算法篇（动态规划）
date: 2020-04-06 15:48:44
sidebar: 'auto'
categories: 
 - 算法
tags: 
 - 算法
publish: true
---

## 什么是动态规划

程序员小灰用漫画告诉你[什么是动态规划](https://juejin.im/post/5a29d52cf265da43333e4da7)，这篇文章已经写得很好了，我写这篇文章仅仅是为了給自己加深一下印象  

我的理解（一句话）：**大事化小，小事化了**  ，另外需要掌握动态规划的三要素【最优子结构】、【边界】、【状态转换公式】  

接下来我们通过分析一个问题来看看这三要素分别指什么吧~  

问题：用1或者2来组成一个和为10的一维数组，有多少种组合方式呢？  
分析：我们可以用全1或者全2去组合，也可以用1、2交叉组合，我们用F(n)表示元素和为n的组合方式个数。当元素和为10之前的一个状态为8或者9，即F(10) = F(9) + F(8)，而当元素和为8之前的一个状态为7或者6，即F(8) = F(7) + F(6)，依次类推，我们将一个复杂的问题简单化了。由上所知：  

- 最优子结构（最难分析到的）：F(10) = F(9) + F(8)中的F(9)和F(8)就是解的最优子结构  
- 边界（无边界便无有限结果）：元素全为1或2的情况
- 状态转换公式：F(n) = F(n - 1) + F(n - 2) 【是不是似曾相识，没错，看看[斐波那契数列](https://baike.baidu.com/item/%E6%96%90%E6%B3%A2%E9%82%A3%E5%A5%91%E6%95%B0%E5%88%97/99145?fr=aladdin)你就知道了】  

完成了问题建模，接着我们试着求一下解：

```js
const dp = (n) => {
  if (n < 1) return 0
  if (n === 1) return 1
  if (n === 2) return 2
  return dp(n - 1) + dp(n - 2)
}
```

但是这样的方法时间复杂度很高的，我们经过分析可以得知，要想知道某一个状态的结果只需知道前面两个即可，也就是说想要得到和为3的组合方式就要知道和为1和和为2的组合方式有多少种，那么可以得出：

```js
const dp = (n) => {
  if (n < 1) return 0
  if (n === 1) return 1
  if (n === 2) return 2

  let a = 1
  let b = 2
  let temp = 0

  for(let i = 0; i < n; i++) {
    temp = a + b
    a = b
    b = temp
  }
  return temp
}
```

这样时间复杂度为O(n),空间复杂度为O(1)，效率得到了提升。

## 实战

[leetcode第63题](https://leetcode-cn.com/problems/unique-paths-ii/)

题目：一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为“Start” ）。  
机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为“Finish”）。  
现在考虑网格中有障碍物。那么从左上角到右下角将会有多少条不同的路径？

![题目图片](https://tva1.sinaimg.cn/large/00831rSTgy1gdk6ronyw6j30oo0b4wfg.jpg)

网格中的障碍物和空位置分别用 1 和 0 来表示  
说明：m 和 n 的值均不超过 100  

>示例 1:
> 
> 输入:
> [
>   [0,0,0],
>   [0,1,0],
>   [0,0,0]
> ]
> 输出: 2
> 解释:
> 3x3 网格的正中间有一个障碍物。
> 从左上角到右下角一共有 2 条不同的路径：
> 1. 向右 -> 向右 -> 向下 -> 向下
> 2. 向下 -> 向下 -> 向右 -> 向右

按照刚才的步骤，我们先来做一下问题建模

- 最优子结构：F（从Finish上方到达目的地） 和 F（从Finish左方到达目的地）
- 边界：m为1或者n为1，即只有一行或只有一列
- 状态转换方程：F(m * n) = F（(m - 1) * n） + F（m * (n - 1)）  

接下来求解：  

```js
const uniquePathsWithObstacles = (obstacleGrid) {
  const m = obstacleGrid.length
  const n = obstacleGrid[m].length
  // 处理特殊情况
  if (m < 1 || n < 1 || obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1 ) {
    return 0
  }
  
  let node = []
  for (let i = 0; i < m; i++) {
    node[i] = []
    for (let j = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 1) { // 当前块为1则到达此块的路径为0
        node[i][j] = 0
      } else if (i === 0 && n > 1) { // 若仅有一行 每个节点是否能通过都依赖它左方节点
        node[i][j] = node[i][j - 1] === 0 ? 0 : 1
      } else if (j === 0 && m > 1) { // 若仅有一列 每个节点是否能通过都依赖它上方节点
        node[i][j] = node[i - 1][j] === 0 ? 0 : 1
      } else {
        node[i][j] = node[i - 1][j] + node[i][j - 1]
      }
    }
  }
  return node[n - 1][m - 1]
}
```

优化：

```js
const uniquePathsWithObstacles = (obstacleGrid) {
  const m = obstacleGrid.length
  const n = obstacleGrid[m].length
  // 处理特殊情况
  if (m < 1 || n < 1 || obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1 ) {
    return 0
  }
  
  let node = []
  for (let i = 0; i < m; i++) {
    node[i] = []
    for (let j = 0; j < n; j++) {
      const prevI = i - 1
      const prevJ = j - 1
      let sum = i === 0 && j === 0 ? 1 : 0
      if (prevI >= 0 && !obstacleGrid[prevI][j]) {
        sum += node[prevI][j]
      }
      if (prevJ >= 0 && !obstacleGrid[i][prevJ]) {
        sum += node[i][prevJ]
      }
      node[i][j] = sum
      if (obstacleGrid[i][j]) {
        node[i][j] = 0
      }
    }
  }
  return node[m - 1][n - 1]
}
```
