--- 
title: 从输入URL到页面加载的过程
date: 2019-10-29 10:37:26
sidebar: 'auto'
categories: 
 - 面试题
tags: 
 - 面试
publish: true
---

## 正解

1. 根据地址栏输入的地址向DNS（Domain Name System）查询IP
2. 通过IP向服务器发起TCP连接
3. 向服务器发起请求
4. 服务器返回请求内容
5. 浏览器开始解析渲染页面并显示
6. 关闭连接

## 分析(以及涉及的知识体系)

### 步骤一

**从浏览器接收url到开启网络请求线程**

1、浏览器的进程：

- Browser进程：浏览器的主进程（负责协调、主控），只有一个
- 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建
- GPU进程：最多一个，用于3D绘制
- 浏览器渲染进程（内核）：默认每个Tab页面一个进程，互不影响，控制页面渲染，脚本执行，事件处理等（有时候会优化，如多个空白tab会合并成一个进程）

2、多线程的浏览器内核

- GUI线程
- JS引擎线程
- 事件触发线程
- 定时器线程
- 网络请求线程

**DNS查询得到IP**

大致流程：

- 如果浏览器有缓存，直接使用浏览器缓存，否则使用本机缓存，再没有的话就是用host
- 如果本地没有，就向dns域名服务器查询（当然，中间可能还会经过路由，也有缓存等），查询到对应的IP

### 步骤二

**TCP将http长报文划分为短报文，通过三次握手与服务端建立连接，进行可靠传输**

连接：三次握手(抽象理解)  
客户端：hello，你是server么？  
服务端：hello，我是server，你是client么  
客户端：yes，我是client  

断开连接： 四次挥手(抽象理解)  
主动方：我已经关闭了向你那边的主动通道了，只能被动接收了  
被动方：收到通道关闭的信息  
被动方：那我也告诉你，我这边向你的主动通道也关闭了  
主动方：最后收到数据，之后双方无法通信  

**get和post区别**

浏览器对同一域名下并发的tcp连接是有限制的（2-10个不等），get和post是资源优化方案

| 比较项 | get | post | 具体 |
| :----: | :----: | :----: | :----: |
| 产生数据包 | 一个 | 两个 | get请求时，浏览器会把headers和data一起发送出去，服务器响应200（返回数据）  post请求时，浏览器先发送headers，服务器响应100 continue，浏览器再发送data，服务器响应200（返回数据）|
| 参数传递 | 通过URL | 放在request body中 |
| 请求参数 | 长度有限制，会被完整保存在浏览器的历史记录中 | 无限制，不保留 |
| 浏览器回退时 | 不发请求 | 再次请求 | 因为浏览器会对get请求主动缓存，post不会，除非手动设置 |

### 步骤三/步骤四

**前/后端交互**

1、http报文结构  
报文一般包括了：`通用头部`，`请求/响应头部`，`请求/响应体`

2、通用头部

```js
Request Url: 请求的web服务器地址
Request Method: 请求方式（Get、POST、OPTIONS、PUT、HEAD、DELETE、CONNECT、TRACE）
Status Code: 请求的返回状态码，如200代表成功
Remote Address: 请求的远程服务器地址（会转为IP）
```

- 状态码：

```js
1xx——指示信息，表示请求已接收，继续处理
2xx——成功，表示请求已被成功接收、理解、接受
3xx——重定向，要完成请求必须进行更进一步的操作
4xx——客户端错误，请求有语法错误或请求无法实现
5xx——服务器端错误，服务器未能实现合法的请求
```

- 常用状态码

```js
200——表明该请求被成功地完成，所请求的资源发送回客户端
304——自从上次请求后，请求的网页未修改过，请客户端使用本地缓存
400——客户端请求有错（譬如可以是安全模块拦截）
401——请求未经授权
403——禁止访问（譬如可以是未登录时禁止）
404——资源未找到
500——服务器内部错误
503——服务不可用
```

3、请求/响应头部  
分析方法：

- 请求头部的Accept要和响应头部的Content-Type匹配，否则会报错
- 跨域请求时，请求头部的Origin要匹配响应头部的Access-Control-Allow-Origin，否则会报跨域错误
- 在使用缓存时，请求头部的If-Modified-Since、If-None-Match分别和响应头部的Last-Modified、ETag对应

4、请求/响应体

- 请求实体:将一些需要的参数都放入（用于post请求）
- 响应实体:放服务端需要传给客户端的内容

**缓存**

![缓存头部](https://tva1.sinaimg.cn/large/006y8mN6ly1g7ymsxidytj31ao0tg0xm.jpg)

如果同时启用了Cache-Control与Expires，Cache-Control优先级高  
如果同时带有E-tag和Last-Modified，服务端会优先检查E-tag

### 步骤五

1、渲染步骤

- 解析HTML，构建DOM树
- 解析CSS，生成CSS规则树
- 合并DOM树和CSS规则，生成rende树
- 布局render树（Layout/reflow），负责各元素尺寸、位置的计算
- 绘制render树（paint），绘制页面像素信息
- 浏览器会将各层的信息发送给GPU，GPU会将各层合成（composite），显示在屏幕上

2、回流和重绘

引起回流：

- 页面渲染初始化
- DOM结构改变，比如删除了某个节点
- render树变化，比如减少了padding
- 窗口resize
- 最复杂的一种：获取某些属性，引发回流，
很多浏览器会对回流做优化，会等到数量足够时做一次批处理回流，  
但是除了render树的直接变化，当获取一些属性时，浏览器为了获得正确的值也会触发回流，这样使得浏览器优化无效，包括
     (1) offset(Top/Left/Width/Height)  
     (2) scroll(Top/Left/Width/Height)  
     (3) cilent(Top/Left/Width/Height)  
     (4) width,height  
     (5) 调用了getComputedStyle()或者IE的currentStyle  

减少回流：

- 减少逐项更改样式，最好一次性更改style，或者将样式定义为class并一次性更新
- 避免循环操作dom，创建一个documentFragment或div，在它上面应用所有DOM操作，最后再把它添加到window.document
- 避免多次读取offset等属性。无法避免则将它们缓存到变量
- 将复杂的元素绝对定位或固定定位，使得它脱离文档流，否则回流代价会很高

3、BFC(块级格式化上下文)

BFC特点：

- 内部box在垂直方向，一个接一个的放置
- box的垂直方向由margin决定，属于同一个BFC的两个box间的margin会重叠
- BFC区域不会与float box重叠（可用于排版)
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此
- 计算BFC的高度时，浮动元素也参与计算（不会浮动坍塌）

触发BFC：

- 根元素
- float属性不为none
- position为absolute或fixed
- display为inline-block, flex, inline-flex，table，table-cell，table-caption
- overflow不为visible

## 参考链接

[https://segmentfault.com/a/1190000013662126](https://segmentfault.com/a/1190000013662126)
