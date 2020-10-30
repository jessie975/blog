--- 
title: 新型肺炎疫情动态检测——Demo
date: 2020/02/10
sidebar: 'auto'
categories: 
 - 实战
tags: 
 - 实战
publish: true
---

这2020年可真不友好，这新年伊始就爆发了这么严重的疫情，看着新闻上每天增加的数字，想想都害怕。所以，反正在家闲着也是闲着，自己写一个小Demo天天关注着，盼望着有一天能打败疫情，脱下口罩呼吸新鲜空气~  

虽然是个不起眼的小Demo，但写的时候还是遇到了一些小问题，所以还是值得记下笔记的。

### 项目介绍

先上截图：
![项目截图](https://tva1.sinaimg.cn/large/0082zybpgy1gbra5gy0g8j31kr0u07m6.jpg)
![统计表](https://tva1.sinaimg.cn/large/0082zybpgy1gbra669zlzj31fh0u0tce.jpg)

- vue-cli脚手架构建项目
- 使用echarts的散点图(由于散点图调用的百度地图api所以需要申请一个百度地图的ak)
- 通过nodeJs抓取相应数据
- 数据来源于[腾讯接口数据](https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5)
- 地点的经纬度获取通过接口：http://api.tianditu.gov.cn/geocoder/{"keyword":"地点名"}
- 统计表使用element ui的table组件
- 项目部署于github pages
- [线上项目演示](https://jessie975.github.io/pneumonia/index.html)(部署在github上可能地图的解析会比较慢一点)
- [项目源代码](https://github.com/jessie975/pneumonia)

### 问题1：echart散点图的使用

由于项目使用的地图是echarts的散点图，而这个散点图调用的又是百度地图的api，所以在编写项目前需要申请一个百度地图的ak，另外单纯的引入bmap，对于浏览器报错`BMap is not defined`的处理，参考了不少方案，最终的解决方法如下：

1、单独写一个js文件，进行异步操作：

```js
export function MP(ak) {
  return new Promise(function (resolve, reject) {
    window.onload = function () {
      resolve(BMap)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
```

2、在所需的页面中引入这个文件
3、在页面挂载也就是mounted里执行这个函数即可

```js
mounted () {
    this.$nextTick(() => {
      let ak = 'XXXXXX'
      MP(ak).then(BMap => {
        document.getElementById('map').style.height = window.screen.availHeight * 0.9 + 'px'
        this.$nextTick(() => {
          this.drawLine()
        })
        this.$echarts.init(document.getElementById('map')).resize()
      })
    })
    this.initEchart()
  }
```

### 问题2：webpack的配置

当项目成功部署到github上后，打包后的js文件路径找不到，分析发现原来路径中缺少一个项目名称的参数，预计的路径是：  
`https://jessie975.github.io/pneumonia/static/js/vendor.bcd89f5b54be0f28285e.js`
目前的结果是：  
`https://jessie975.github.io/static/js/vendor.bcd89f5b54be0f28285e.js`  
所以需要修改生产打包**公共资源路径**: **assetsPublicPath**(config目录下的index.js文件中)，在这个字段下添加缺少的路径即可
