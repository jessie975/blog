--- 
title: offer攻坚战——算法篇（动态规划/贪心算法/分治算法）
date: 2020-04-08 15:48:44
sidebar: 'auto'
categories: 
 - 算法
tags: 
 - 算法
publish: true
---

## 动态规划

### 什么是动态规划

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

  for(let i = 2; i < n; i++) {
    temp = a + b
    a = b
    b = temp
  }
  return temp
}
```

这样时间复杂度为O(n),空间复杂度为O(1)，效率得到了提升。

> 更新：得到一位前辈的指导，还可以尝试缓存的写法，接下来实现一下吧

```js
// 使用缓存的思路：首先创建一个缓存容器，在计算时先去检索缓存容器中有没有对应的值，有的话直接取出来用，没有的话就先计算，然后将结果放进缓存容器，方便下次复用

const cache = {}
const dp = (n) => {
  if (n < 1) return 0
  if (n === 1) return 1
  if (n === 2) return 2

  if(cache[n]) {
      return cache[n]
  } else {
      const result = dp(n - 1) + dp(n - 2);
      cache[n] = result
      return result
  }
}
```

### 实战

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

## 贪心算法

### 什么是贪心算法

贪心算法是指在每个阶段做选择的时候都做出当前阶段（或状态）最好的选择，并且期望这样做到的结果是全局最优解（但未必是全局最优解）  

贪心算法其实是动态规划的一种,由于它的「贪心」，只着眼于当前阶段的最优解，所以每个子问题只会被计算一次，如果由此能得出全局最优解，相对于动态规划要对每个子问题求全局最优解，它的时间复杂度无疑是会下降一个量级的  

看下面两个例子：  
1、买卖股票的最佳时期：股票每天的价格不同，如果你最多只允许完成一笔交易（即买入和卖出一支股票一次），设计一个算法来计算你所能获取的最大利润，例如有一个五天的价格数组：[7，1，3，4，2]  

针对这个问题，我们可能会有三种策略：

- 在最低点买入，最高点卖出（第二天价格为1时买入，第四天价格为4时卖出，利润为3）
- 在低点买入，只要价格高于买入价格就卖出（第二天价格为1时买入，第三天价格为3卖出，利润为2）
- 在低点买入，当价格高于低点且价格开始下降就卖出（第二天价格为1时买入，第三题价格为4卖出，利润为3）

这时候我们可以称第三种策略就是贪心算法，即保证当前阶段能做出最好的选择  

2、柃檬水找零：一瓶柃檬水5块钱，有一队人排队购买，手里分别拿着5，10，20的面额的货币，要判断是否能够正确找零，比如有一个数组代表排队的人手中的钱：[5，5，5，10，20]  

针对这个问题，我们可能会有两种策略：

- 不管大小，能找即找（也就是说如果使用的是20，可能找的零会是5，5，5）
- 优先从面额大的开始找，保证能够尽量多的满足各个面额的找零（也就是说如果使用的是20，那么找零就是10， 5）  

这个时候我们就可以称第二种策略是贪心算法的最优解  

我对贪心算法的理解就是，当求一个解时，先不考虑他最终的解法，首先把一个问题分成几个步骤，求每一个步骤的最优解就是贪心算法啦~  

### 实战

接下来我们对上面所说的两个例子求一下解  

#### 第一题：leetcode[121题](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

题目：给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。
如果你最多只允许完成一笔交易（即买入和卖出一支股票一次），设计一个算法来计算你所能获取的最大利润。
注意：你不能在买入股票前卖出股票。

> 示例1
> 输入: [7,1,5,3,6,4]
> 输出: 5
> 解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1
> 注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格  

> 示例2
> 输入: [7,6,4,3,1]
> 输出: 0
> 解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。

由示例可知，leetcode的答案应该是按照之前我们说的第一种策略求出来的结果，也就是价格为1时买入，为6时卖出的策略，那么我们先按照这样的思路来求一下解：  

```js
const maxProfit = (prices) => {
  if (prices.length < 1) return 0
  let min = prices[0]
  let max = 0
  for (let i = 0; i < prices.length; i++) {
    min = Math.min(min, prices[i])
    max = Math.max(max, prices[i] - min)
  }
  return max
}
```

接着用我们的贪心算法的思路来求一下解  

```js
const maxProfit = (prices) => {
  let count = 0 // 利润
  for (let i = 0; i < prices.length; i++) {
    for (let j = i; j < prices.length - 1; j++) {
      if (prices[j + 1] > prices[j]) { // 价格处于上升阶段
        count += prices[j + 1] - prices[j]
        i = j // 指针前移到当前位置
      } else {
        i = j // 卖出
        break
      }
    }
  }
}
```

拿示例1来说，这样求出来的结果是7，明显比5的利润更高  

#### 第二题：leetcode[860题](https://leetcode-cn.com/problems/lemonade-change/)

题目：在柠檬水摊上，每一杯柠檬水的售价为 5 美元。
顾客排队购买你的产品，（按账单 bills 支付的顺序）一次购买一杯。
每位顾客只买一杯柠檬水，然后向你付 5 美元、10 美元或 20 美元。你必须给每个顾客正确找零，也就是说净交易是每位顾客向你支付 5 美元。
注意，一开始你手头没有任何零钱。
如果你能给每位顾客正确找零，返回 true ，否则返回 false

> 示例1
> 输入：[5,5,5,10,20]
> 输出：true
> 解释：
> 前 3 位顾客那里，我们按顺序收取 3 张 5 美元的钞票。
> 第 4 位顾客那里，我们收取一张 10 美元的钞票，并返还 5 美元。
> 第 5 位顾客那里，我们找还一张 10 美元的钞票和一张 5 美元的钞票。
> 由于所有客户都得到了正确的找零，所以我们输出 true。

> 示例2
> 输入：[5,5,10,10,20]
> 输出：false
> 解释：
> 前 2 位顾客那里，我们按顺序收取 2 张 5 美元的钞票。
> 对于接下来的 2 位顾客，我们收取一张 10 美元的钞票，然后返还 5 美元。
> 对于最后一位顾客，我们无法退回 15 美元，因为我们现在只有两张 10 美元的钞票。
> 由于不是每位顾客都得到了正确的找零，所以答案是 false

```js
const lemonadeChange = (bills) => {
  let hand = [] // 收到的钱
  while (bills.length) { // 当还有人在排序需要继续交易
    let money = bills.shift() // 取出排在最前面的
    if (money === 5) { // 不用找零
      hand.push(money)
    } else {
      hand.sort((a, b) => b - a) // 先将手里的钱按从大到小排序
      let change = money - 5 // 需要找的钱
      for (let i = 0; i < hand.length; i++) {
        if (hand[i] <= change) {
          change -= hand[i]
          hand.splice(i, 1)
          i-- // 上一步改变了数组的长度，所以这里要保证数组的长度
        }
        if (change === 0) {
          break
        }
      }
      if (change !== 0) { // 已经没有钱可以找了
        return false
      } else { // 找完之后将钱放进口袋
        hand.push(money)
      }
    }
  }
  return true
}
```

## 分治算法

### 什么是分治算法

分治算法的基本思想是将一个规模为N的问题分解为K个规模较小的子问题，这些子问题相互独立且与原问题性质相同。求出子问题的解，就可得到原问题的解。

求解步骤可分为如下步骤：

- 分解：分解原问题为结构相同的子问题（即寻找子问题）
- 解决：当分解到容易求解的边界后，进行递归求解
- 合并：将子问题的解合并成原问题的解

话不多说，赶紧来实践一下吧

### 实战

#### 归并排序

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
