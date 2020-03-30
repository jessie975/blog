--- 
title: 面壁思过系列之鹅厂面经
date: 2020-03-28 20:17:23
sidebar: 'auto'
categories: 
 - 面试题
tags: 
 - 面试
publish: true
---

当接听了被200多人标记为骚扰电话的号码，收到了鹅厂的面试通知的我差点一整晚没睡着，幻想着自己进入鹅厂工作的美好生活。然而，奈何自己还是准备得不够充分，技术还达不到要求，最终以遗憾告终。不过没关系，能得到这次面试机会，我已经赚到了，下面就查缺补漏一下本次面试被问到的知识。

## 第一题：快排的时间复杂度计算

起初我学习的快排一直是这样写的,想法也就是把一个数组一分为二，取出中间的数字，遍历数组的每一项与这个中间值进行比较，大的放右边，小的放左边，然后递归左右数组知道数组项为1：

```js
const quickSort = (arr) => {
  if (arr.length < 1) return arr
  const midValue = arr.splice(Math.floor(arr.length / 2), 1)[0]
  const left = []
  const right = []
  arr.forEach((item) => {
    item > midValue ? right.push(item) : left.push(item)
  })
  return [...quickSort(left), midValue, ...quickSort(right)]
}
```

谁知我还没说完我的想法，面试小哥哥就打断了我，说快排一般是不需要新建数组的，突然一下就懵掉了，后来小哥哥一直让我算，照我这样新建数组的话，一个长度为N的数组需要新建多少个数组? 这个算法的时间复杂度又是多少？嗯~~没啥想的，赶紧补这一块的知识就完事儿了

### 时间复杂度的计算

首先，时间复杂度的公式是：**T(n) = O( f(n) )**，其中f(n) 表示每行代码执行次数之和，而 O 表示正比例关系，这个公式的全称是：算法的渐进时间复杂度。具体的计算步骤如下：

⑴ 找出算法中的基本语句
算法中执行次数最多的那条语句就是基本语句，通常是最内层循环的循环体。

⑵ 计算基本语句的执行次数的数量级
只需计算基本语句执行次数的数量级，这就意味着只要保证基本语句执行次数的函数中的最高次幂正确即可，可以忽略所有低次幂和最高次幂的系数。这样能够简化算法分析，并且使注意力集中在最重要的一点上：增长率。

⑶ 用大Ο记号表示算法的时间性能
将基本语句执行次数的数量级放入大Ο记号中，如果算法中包含嵌套的循环，则基本语句通常是最内层的循环体；如果算法中包含并列的循环，则将并列循环的时间复杂度相加

举个例子：

```js
1、   for(let i=0; i<n; i++) {
2、     const item = i
3、     sum += item
4、   }
```

按照如上步骤，我们只需关注循环内的一条基本语句的执行次数即可，即循环内的基本语句将执行n次，那么T(n) = O(n)

那么常见的一些时间复杂量级有：(按效率从高到低)
常数阶O(1)【代码中无循环的时间复杂度】 > 对数阶O(logN) > 线性阶O(n) > 线性对数阶O(nlogN) > 平方阶O(n²) > 立方阶O(n³) > K次方阶O(n^k) > 指数阶(2^n)

按照刚才的思路咱们再来推算几个：

#### 对数阶O(logN)

```js
1、 const i = 1
2、 while (i < n) {
3、   i *= 2
4、 }
```

在while循环中，i每次都*2，也就是说i以两步两步的移动速度靠近n，那么2 ^ i（2的i次方）!== n之后就可以跳出循环了，那么i = log2 ^ n，即第二行代码会执行log2 ^ n次，所以T(n) = O(2log2 ^ n)，又因为时间复杂度只关注最高数量级，且与之系数也没有关系，所以化简下来T(n) = O(logn)

#### 线性对数阶O(nlogN)

```js
1、 for(let m=1; m<n; m++)
2、 {
3、     const i = 1
4、     while(i<n)
5、     {
6、         i = i * 2
7、     }
8、 }
```

我们只需要关注第六行代码会执行多少次即可，经过刚刚的计算，第六行单独来说的时间复杂度为O(logn)，现在也就是说把时间复杂度为O(logn)的代码再执行n次，也就是n * logn，所以T(n) = O(n * logn)

#### 平方阶O(n²)

```js
1、 for(x=1; i<=n; x++)
2、 {
3、    for(i=1; i<=n; i++)
4、     {
5、        j = i;
6、        j++;
7、     }
8、 }
```

也就是说把时间复杂度为n代码再执行n次，所以就是T(n) = O(n * n)，也就是T(n) = O(n ^ 2)

说到这，然后我们就来算一下我的快排的时间复杂度吧

```js
const quickSort = (arr) => {
  if (arr.length < 1) return arr
  const midValue = arr.splice(Math.floor(arr.length / 2), 1)[0]
  const left = []
  const right = []
  arr.forEach((item) => {
    item > midValue ? right.push(item) : left.push(item)
  })
  return [...quickSort(left), midValue, ...quickSort(right)]
}
```

我们主要关注最里面的循环就好了。假设arr的长度为n，那么第一次这个函数就会执行n次，但是接下来的每一次的n都是之前的n的一半，直到n < 1，那么循环部分的代码的执行次数大概就是O(n) + f(n / 2)，化简下来就是T(n) = O(n * log2 ^ n)，这是最理想的分割情况的时间复杂度，这样的推理叫做**主定理**，具体参考[主定理](https://blog.csdn.net/iihtd/article/details/51162106)，看了挺多资料，感觉大家的计算都挺复杂的，但是按照刚刚的推导下来，我觉得我这样的想法和推导也是正确的，如果我的理解有什么错误还希望大家帮我指出。

虽然说我这样的快排的时间复杂度和正确的快排的时间复杂度一样，但是由于创建了新数组，算法的空间复杂度肯定比不创建的大，稍后我们在学习一下空间复杂度，现在我们先来试着实现一下不需要新建数组的快排，思路是：确定一个基数，双指针i,j，j从右边找比基数小的，i从左边找比基数大的，然后交换两个目标元素的位置，直到i=j，然后交换i和基数的位置，递归处理

```js
function quickSort(arr, from, to){
  const i = from //指针i
  const j = to //指针j
  const key = arr[from] //基数
  if(from >= to){ //如果数组只有一个元素
    return
  }
  while(i < j){
    //从右边向左找第一个比key小的数，或者找到两个指针相碰，跳出循环
    while(arr[j] > key && i < j){ j-- }
    //从左边向右找第一个比key大的数，或者找到两个指针相碰，跳出循环,这里的=号保证在本轮循环结束前，key的位置不变，否则的话跳出循环，交换i和from的位置的时候，from位置的上元素有可能不是key
    while(arr[i] <= key && i < j){ i++ }
    /**
      代码执行道这里有三种情况：
      1、两个指针都找到了目标值
      2、j找到了目标值
      3、两个指针都没找到(key是当前数组最小值)
    **/
    if(i < j){ //交换两个元素的位置
      const temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
  }
  arr[from] = arr[i]
  arr[i] = key
  quickSort(arr, from, i-1)
  quickSort(arr, i+1, to)
}

const arr = [3,3,-5,6,0,2,-1,-1,3]
quickSort(arr, 0, arr.length-1)
```

### 空间复杂度

空间复杂度：一个程序的空间复杂度是指运行完一个程序所需内存的大小，利用程序的空间复杂度，可以对程序的运行所需要的内存多少有个预先估计。**空间复杂度是对一个算法在运行过程中临时占用存储空间大小的量度**。一个程序执行时除了需要存储空间和存储本身所使用的指令、常数、变量和输入数据外，还需要一些对数据进行操作的工作单元和存储一些为现实计算所需信息的辅助空间。程序执行时所需存储空间包括以下两部分：  

- 固定部分：这部分空间的大小与输入/输出的数据的个数多少、数值无关，主要包括指令空间（即代码空间）、数据空间（常量、简单变量）等所占的空间，这部分属于静态空间

- 可变空间：这部分空间的主要包括动态分配的空间，以及递归栈所需的空间等，这部分的空间大小与算法有关。一个算法所需的存储空间用f(n)表示。S(n)=O(f(n))，其中n为问题的规模，S(n)表示空间复杂度

通常来说，只要算法不涉及到动态分配的空间以及递归、栈所需的空间，空间复杂度通常为0(1)  
算法的空间复杂度并不是计算实际占用的空间，而是计算整个算法的辅助空间单元的个数，与问题的规模没有关系，所以我们猜想一下我们创建数组的快排大概需要多少辅助空间，也就是一个长度为n的数组需要创建多少个数组才能实现快排：  

经过计算，如果n为偶数，那么新创建的数组为n，如果n为奇数，且n为3或者3n + (n - 1)（n为大于1的整数），则新创建的数组为n - 1，如果n为5或者5n - (n - 1)（n为大于1的整数），则新创建的数组为n + 1

上面的计算是我找规律得到的结果，比较好的计算方法我暂时还没找到，希望有大佬赐教。由此可见相比于不创建的数组的快排的空间复杂度O(1)，我这样的写法确实性能比较差。学习了学习了~

虽然做完第一题就已经知道自己凉凉了，但是面试小哥哥还是給了一套笔试题，一共四道题，要求在一个小时内完成，由于没有固定答案，所以就暂时先不深究了。下面是这四道题的原题，感兴趣的小伙伴可以研究一下哦~

## 笔试部分

### 第一题

Given two sorted integer arrays, please write a function to combine them into a single sorted array.

For example, given array `A = [1, 3, 5, 6, 7]` and array `B = [2, 3, 9]`, you should generate a new array `Result = [1, 2, 3, 3, 5, 6, 7, 9]` .

Requirements:

•	You should not change array A and B - store your answer in array Result.
•	Minimize operations as much as you can.

You can code in any language you like.

### 第二题

Given a DOM node tree and a CSS selector, try to find out all nodes that matches the CSS selector.

The node tree is given in JSON format like this:

```json
{
  "tagName": "div",
  "classList": ["my-class-a", "my-class-b"],
  "otherAttributes": {
    "hidden": "",
    "data-my-key": "my-value"
  },
  "childNodes": [ {
    "tagName": "span",
    "classList": [],
    "otherAttributes": {},
    "childNodes": []
  } ]
}
```

The CSS selector is given as a string. For simplicity, it only contains class selectors, e.g. `.my-class-a` , `.my-class-b.my-class-c` .

You are not allowed to use any DOM methods, e.g. `querySelectorAll` . You can code in any language you like.

### 第三题

有一组 JavaScript 文件，这些文件中有 `require` 语句来表示文件之间的引用关系。现在我们已经逐一分析出了它们之间的引用关系，用一个 JSON 结构表示，例如：

```json
{
  "requires": {
    "a.js": ["c.js", "d.js"],
    "b.js": ["a.js", "d.js"],
    "c.js": ["d.js"],
    "d.js": []
  }
}
```

还有一些 HTML 文件会直接引用这其中的一部分 JS 文件，这些文件被称为“入口文件”。

我们分析发现，这里的每个 JS 文件都被 HTML 文件直接或间接引用到了，且 JS 文件之间没有任何循环依赖（即每个文件都不会直接或间接引用它自身）。

现在我们想知道：

1. 入口文件最少有几个？
2. 此时的入口文件分别是哪些？
3. 去掉 HTML 文件对上述入口文件中某一个入口文件的引用，可以使得被 HTML 文件直接或间接引用到的 JS 文件总量变少。这样，去掉哪一个入口文件可以使得减少的 JS 文件数量最多？

你需要写一段 JavaScript 代码解答上述三个问题。这段 JavaScript 代码需要能够在浏览器和 node.js 环境下运行。如果你熟悉微信小程序，最好使它也能在小程序环境下运行。

### 第四题

你的团队正在制作一个贪食蛇游戏。与传统的贪食蛇游戏不同，整个场景内的任何位置都可以设置障碍物，蛇撞到障碍物上会立刻死亡。

具体地说，整个场景是宽为 W 、高为 H 的地图，一共 W * H 格，其中的每一格都可以被设置为障碍物。已有 `setBlock(x, y)` 和 `clearBlock(x, y)` 两个方法用于设置障碍物或者清除已设置的障碍物。

现在需要你利用这两个方法，在原本没有障碍物的地图上放置若干障碍物，提升游戏难度。

你需要设计算法来随机放置障碍。可以用文字或伪代码来表达你的算法思路。

这是一道开放题。你也可以考虑设计多个算法，并从时空复杂度、游戏难度和其他你能够想到的重要方面来比较这些算法之间的优劣。

## 其他

之后面试官又问了一下我最满意的项目，我先是说了自己新做的一个小程序，讲解了一下当时做这个小程序遇到的一些难点，以及里面的一些算法设计，但是好像面试官并不怎么感兴趣，也有可能觉得太简单了。然后问了一下我在实习时的项目，我大概说了一下做了比较重要的事，貌似面试官也不太感兴趣，后来面试官又问了一下https为什么比较安全，因为之前写过一篇http与https的区别，但是忘了一部分，所以说得有点吞吞吐吐的，就这样就没有然后啦~

通过这次面试，我也认识到了自己的不足~之后的学习要更加注重一下细节，多思考~
