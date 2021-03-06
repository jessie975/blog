--- 
title: 这一次，HTTP缓存不再用背的
date: 2020/05/18
sidebar: 'auto'
categories: 
 - 前端那些事儿
tags: 
 - 性能优化
publish: true
---

可能是自己平时做项目的时候没怎么关注过缓存问题，所以关于缓存的知识点一直都是用背的，技术这个东西，还是需要实战需要理解的，今天就踏踏实实的学习一下缓存方面的知识。

首先HTTP缓存分两种，一种强缓存，另一种协商缓存。主要作用是可以加快资源获取速度，提升用户体验，减少网络传输，缓解服务端的压力。这是缓存运作的一个整体的流程图：

![缓存流程图](https://tva1.sinaimg.cn/large/007S8ZIlgy1gewecsx24gj31au0q8jwg.jpg)

## 强缓存

不需要发送请求到服务端，直接读取浏览器本地缓存，在Chrome的Network中显示的HTTP状态码是200，在Chrome中，强缓存又分为Disk Cache（存放在硬盘中）和Memory Cache（存放在内存中），存放的位置是由浏览器控制的。是否强缓存由Expires、Cache-Control和Pragma这三个Header属性**共同**控制的。

> 缓存的位置和特点有（优先级从上到下）：
> Service Worker：自由控制缓存，持续时间长；若没有命中，则不管从哪取到的数据都将显示从此处获取
> Memory Cache（内存）：读取高效，持续时间短，随进程的释放而释放
> Disk Cache（硬盘）：读取较慢，持续时间较长，根据HTTP头判断需要缓存的文件，可跨站点
> Push Cache：回话结束即释放

### Expires

Expires的值是一个HTTP日期，在浏览器发起请求时，会根据系统时间和Expires的值进行比较，如果系统时间超过了Expires的值，缓存失效。由于是和系统时间进行比较，所以当系统时间与服务器时间不一致的时候，会有缓存有效期不准确的问题。Expires的优先级在三个Header属性中是最低的。

![Expires](https://tva1.sinaimg.cn/large/007S8ZIlgy1gewlhs5v6rj30m406gmxz.jpg)

### Cache-Control

Cache-Control是HTTP/1.1中新增的属性，在请求头和响应头中都可以使用，常用的属性值有：

- max-age: 单位是秒，缓存时间计算的方式是距离发起的时间的秒数，超过间隔的秒数缓存失败
- no-cache: 不使用强缓存，需要与服务器验证缓存是否新鲜
- no-store: 禁止使用缓存（包括协商缓存），每次都向服务器请求最新的资源
- private: 专用于个人的缓存，中间代理、CDN等不能缓存此响应
- public: 响应可以被中间代理、CDN等缓存
- must-revalidate: 在缓存过期前可以使用，过期后必须向服务器验证

![Cache-Control](https://tva1.sinaimg.cn/large/007S8ZIlgy1gewkr5ccx7j30vu0amdi3.jpg)

### Pragma

Pragma只有一个属性值，就是no-cache，效果和Cache-Control中的no-cache一致，不使用强缓存，需要与服务器验证缓存是否新鲜，在3个头部属性中的**优先级最高**。

最近也正在学习node，所以用node起个服务，这里使用了express框架，亲自来测试一下

```js
const express = require('express');
const app = express();
const options = {
  etag: false, // 禁用协商缓存
  lastModified: false, // 禁用协商缓存
  setHeaders: (res, path, stat) => {
    res.set('Cache-Control', 'max-age=30'); // 强缓存超时时间为10秒
  },
};
app.use(express.static((__dirname + '/public'), options));
app.listen(3000);
console.log('OK')
```

第一次加载时：

![第一次](https://tva1.sinaimg.cn/large/007S8ZIlgy1gewrkdwscjj30mu0hqjxs.jpg)

第二次加载时：

![第二次](https://tva1.sinaimg.cn/large/007S8ZIlgy1gewrms00v7j30mo0hpjwq.jpg)

过了30秒之后再次请求：

![过了30秒](https://tva1.sinaimg.cn/large/007S8ZIlgy1gewrp5t4e5j30sg0nmtd6.jpg)

## 协商缓存

当浏览器的强缓存失效的时候或者请求头中设置了不走强缓存，并且在请求头中设置了If-Modified-Since 或者 If-None-Match 的时候，会将这两个请求头中的值拿到服务端去验证是否命中协商缓存，如果命中了协商缓存，会返回304状态，加载浏览器缓存，并且响应头会设置Last-Modified或者ETag属性。

### ETag/If-None-Match

ETag/If-None-Match 的值是一串 hash 码，代表的是一个资源的标识符，当服务端的文件变化的时候，它的 hash码会随之改变，通过请求头中的 If-None-Match 和当前文件的 hash 值进行比较，如果相等则表示命中协商缓存。ETag 又有强弱校验之分(默认为弱校验），如果 hash 码是以 "W/" 开头的一串字符串，说明此时协商缓存的校验是弱校验的，只有服务器上的文件差异（根据 ETag 计算方式来决定）达到能够触发 hash 值后缀变化的时候，才会真正地请求资源，否则返回 304 并加载浏览器缓存

### Last-Modified/If-Modified-Since

Last-Modified/If-Modified-Since 的值代表的是文件的最后修改时间，第一次请求服务端会把资源的最后修改时间放到 Last-Modified 响应头中，第二次发起请求的时候，请求头会带上上一次响应头中的 Last-Modified 的时间，并放到 If-Modified-Since 请求头属性中，服务端根据文件最后一次修改时间和 If-Modified-Since 的值进行比较，如果相等，返回 304 ，并加载浏览器缓存

```js
const express = require('express');
const app = express();
const options = {
  etag: true, // 开启协商缓存
  lastModified: true, // 开启协商缓存
  setHeaders: (res, path, stat) => {
    res.set({
      'Cache-Control': 'max-age=00', // 浏览器不走强缓存
      'Pragma': 'no-cache', // 浏览器不走强缓存
    });
  },
};
app.use(express.static((__dirname + '/public'), options));
app.listen(3000);
console.log('OK')
```

第一次加载时：
![第一次](https://tva1.sinaimg.cn/large/007S8ZIlgy1gewruo3g8mj30yc0jy0wh.jpg)

不修改文件，再次加载时：
![不修改文件，再次加载时](https://tva1.sinaimg.cn/large/007S8ZIlgy1gewteifi8xj30wy0twjyo.jpg)

修改文件，再次加载则状态码变为200，且ETag和Last-Modified的值进行了更新

### ETag/If-None-Match 与 Last-Modified/If-Modified-Since 的区别

前者的产生是为了解决后者的不足，因为Last-Modified/If-Modified-Since在遇到当修改文件后又恢复文件，但是文件本身内容没有变化，但Last-Modified/If-Modified-Since的值还是会更新，所以不会命中缓存，会再次发起请求；而ETag启用强校验之后，会校验文件的内容是否更新，若文件内容不变，则ETag的hash值不变，则命中缓存。因此，ETag/If-None-Match的优先级高于Last-Modified/If-Modified-Since

## 总结

之前对于缓存的理解一直停留在死记硬背的层面，今天通过学习[政采云前端团队](https://juejin.im/post/5eb7f811f265da7bbc7cc5bd)在掘金上发布的文章，深刻的理解了强缓存和协商缓存这两个缓存策略，又是收获慢慢的一天~

