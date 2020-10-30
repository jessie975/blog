--- 
title: 移动端适配方案
date: 2020/10/20
sidebar: 'auto'
categories: 
 - 前端那些事儿
tags: 
 - 适配
publish: true
---

关于移动端的适配，不管在工作还是面试中都是常常遇到的，所以今天就来写一篇博客，做一个小小的总结。【好记性不如烂笔头】

## 基本概念

### 像素（px）

屏幕上显示数据的最基本的点，比如屏幕分辨率是1024×768的设备，也就是说设备屏幕的水平方向上有1024个像素点，垂直方向上有768个像素点，像素的大小没有固定的尺寸，也叫做『物理像素』

### 设备独立像素

也就是我们的css像素，这个像素在不同设备上都是固定的，比如width：100px，在A设备下100px里面可能放了100个点（像素），在B设备下还是100px但是里面可能就只有90个点

### 设备像素比（dpr）

也就是物理像素与设备独立像素的比，也就是当设备像素比等于2：1 = 2也就是dpr = 2时，1个设备独立像素就能放四个物理像素（点）

### 视口（viewport）

也就是不同设备上用户的可视窗口大小

## 适配方案

### rem

rem是相对于根元素的字体大小的单位，也就是html的font-size大小，浏览器默认的字体大小是16px，所以默认的1rem=16px，我们可以**根据设备宽度动态设置根元素的font-size**，使得以rem为单位的元素在不同终端上以相对一致的视觉效果呈现

如何设置这个font-size则有不同的方法：

方案一

- 1、拿到设计稿除以100，得到宽度rem值X
- 2、通过给html的style设置font-size，把X代入  document.documentElement.style.fontSize = document.- documentElement.clientWidth / X + ‘px‘
- 3、设计稿px/100即可换算为rem
- 优：通过动态根font-size来做适配，基本无兼容性问题，适配较为精准，换算简便
- 劣：没有viewport缩放，针对iPhone的Retina屏没有做适配，导致对一些手机的适配不是很到位

方案二

- 1、拿到设计稿除以10，得到font-size基准值
- 2、引入flexible
- 3、不设置meta的viewport缩放值
- 4、设计稿px/font-size基准值，即可换算为rem
- 优：通过动态根font-size、viewpor、dpr来做适配，无兼容性问题，适配精准
- 劣：需要根据设计稿进行基准值换算，单位计算复杂

> Flexible是阿里推出的第三方库，主要用于rem自适应
> 页面不要设定 。Flexible会自动设定每个屏幕宽度的根font-size、动态viewport、针对Retina屏做的dpr
> 假设拿到的设计稿是750，Flexible会把设计稿分为10份，可以理解为750=10rem，即1rem=75px，所以根font-size（基准值）=75px
> 之后的css换算rem公式为：px/75=rem,所以100px=100/75=1.33rem,50px=50/75=0.66rem

### viewport + rem + vw/wh

- vw : 1vw 等于 视口宽度 的 1%
- vh : 1vh 等于 视口高度 的 1%
- vmin : 选取 vw 和 vh 中 最小 的那个
- vmax : 选取 vw 和 vh 中 最大 的那个

用视口单位度量，视口宽度为100vw，高度为100vh，例如，在桌面端浏览器视口尺寸为750px，那么 1vw = 750 * 1% = 7.5px

假设设计稿是750px，下面是设置步骤：

第一步：首先设置理想视口【网页的宽 = 设备的宽，同时不允许用户手动缩放】

```js
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

第二步：设置html的font-size大小为13.33333333vw

> 为什么是13.33333333vw？
> 因为vw表示1%的屏幕宽度,而我们的设计稿是750px的,屏幕一共是100vw,对应750px,那么1px=0.1333333vw
> 为了方便计算, 1rem = 100px, 那么 1rem = 13.33333vw，设计图上的200px也就等于2rem了
