--- 
title: vue渲染大量数据的优化方案
date: 2019/10/27
sidebar: 'auto'
categories: 
 - 前端那些事儿
tags: 
 - 性能优化
publish: true
---
通常我们的列表是有多少数据就有多少个DOM，而DOM的渲染需要花费很多时间，所以当渲染大量数据的时候就会导致性能下降，出现首页白屏的现象。为了解决这一问题，出现了分页法和虚拟滚动，接下来我们就来简单学习一下两者的实现原理。

## 分页法

分页就是每一页显示多少条数据就从源数组中取多少数据即可。
![分页](https://tva1.sinaimg.cn/large/006y8mN6ly1g8du4enu5xg31c00hy4qt.gif)

### 思路

- 计算每页可以存放多少数据
- 定义一个数组指针，当点击上一页时，指针减掉每页数据条数，反之点击下一页则相加
- 监听指针的变化计算要截取的数组位置

### 实现

上诉步骤对应的代码如下：

```js
  computed: {
    totalPage() {
      return this.data.length * this.itemHeight / this.viewHeight
    },
    pageSize() {
      return this.viewHeight / this.itemHeight
    }
  },
  watch: {
    currenIndex() {
      this.cutData()
    }
  },
  methods: {
    pre() {
      if (this.currenIndex > 0) {
        this.currenIndex = this.currenIndex - this.pageSize
      }
    },
    next() {
      const { data, pageSize } = this
      if (this.currenIndex < data.length - pageSize) {
        this.currenIndex = this.currenIndex + pageSize
      }
    },
    cutData() {
      const { currenIndex, data, pageSize } = this
      this.pageData = data.slice(currenIndex, currenIndex + pageSize)
    }
  }
```

## 虚拟滚动

下面的效果就是虚拟滚动的效果啦，可以发现不管用户怎么滚动，渲染的DOM也就那么几个，而且不需要用户手动点击翻页，可以说是相当的友好了，赶紧学习一下~
![虚拟滚动](https://tva1.sinaimg.cn/large/006y8mN6ly1g8doh62a2lg31t40rkkk2.gif)

### 思路

假如我有一张 10 * 100的画像，但我只有一个 10 * 10的相框，我只能看到相框中的内容，想要看完整张画像可以选择固定相框，移动画像。同理，假如我有1000条数据，每条的高度是50px，那么整个数据的高度就是（1000 * 50）px，但是实际上用户一次可以看见的数据就10条，也就是（10 * 50）px的高度，所以我们只需要找到用户当前可视区域是源数据的什么位置，找到相应的数据渲染就好了。

实现虚拟列表就是处理滚动条滚动后的可见区域的变更，具体步骤如下：

- 计算当前可见区域起始数据的 startIndex
- 计算当前可见区域结束数据的 endIndex
- 计算当前可见区域的数据，并渲染到页面中
- 计算 startIndex 对应的数据在整个列表中的偏移位置 startOffset，并设置到列表上

![pic](https://tva1.sinaimg.cn/large/006y8mN6ly1g8dpnfs3dxj30qc0hpmzz.jpg)

### 实现

1、 DOM结构

```js
<div class="list-view" @scroll="handleScroll">
    <div class="list-view-phantom" :style=" {'height': contentHeight}" />
    <div ref="content" class="list-view-content">
      <div
        v-for="(item,index) in visibleData"
        :key="index"
        class="list-view-item"
        :style="{
          'height': itemHeight + 'px',
          'background-color': item.color
        }" >
        {{ item.id }}
      </div>
    </div>
</div>
```

其中`list-view-phantom`是为了让滚动条出现,其高度为`数据长度 * 每一项的高度`
`list-view`使用相对定位，`list-view-content`使用绝对定位避免页面重绘

2、监听scroll事件，计算可视区域的数据

```js
handleScroll() {
  const scrollTop = this.$el.scrollTop
  window.requestAnimationFrame(
    () => {
      this.updateVisibleData(scrollTop)
    }
  ) // 当滚动刷新数据过于频繁的时候，渲染就会就会产生闪烁，这时我们就需要通过requestAnimationFrame来调用更新列表的方法来实现对更新列表速率的控制，从而生成平滑的滚动动画。
},
updateVisibleData(scrollTop) {
  scrollTop = scrollTop || 0
  const visibleCount = Math.ceil(this.$el.clientHeight / this.itemHeight) // 取得可见区域的可见列表量
  const start = Math.floor(scrollTop / this.itemHeight) // 取得可见区域的起始数据索引
  const end = start + visibleCount // 取得可见区域的结束数据索引
  this.visibleData = this.data.slice(start, end + 1) // 计算出可见区域对应的数据，end+1是多渲染一条数据让页面更流畅
  this.$refs.content.style.transform = `translate3d(0, ${start * this.itemHeight}px, 0)` // 把可域的 top 设置为起始元素在整个列表中的位置（使用 transform 是为了更好的性能）
}
```

至此一个最简单的虚拟滚动就实现了，因为列表的每一项的高度几乎都是固定的，所以计算方法比较简单，但有时我们要优化的不是一个列表而是一个页面，这时候每一个DOM的高度就不固定了，所以计算方法需要改变一下，具体可以参考:
[掘金](https://juejin.im/post/5ae05bd66fb9a07aa631724b)上的这篇文章和[知乎](https://zhuanlan.zhihu.com/p/34585166)上的这篇文章
