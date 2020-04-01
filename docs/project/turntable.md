--- 
title: 用canvas实现一个可配置的转盘组件（微信小程序）
date: 2020-03-24 09:49:15
sidebar: 'auto'
categories: 
 - 实战
tags: 
 - 实战
publish: true
---

先打个小广告，本人第一次独立开发的小程序**下决定**已经上线啦~这是一款专门针对选择困难症的人设计的小程序。其实类似的小程序已经不少了，但是我们下决定可是不一样的烟火（小傲娇），具体呢就体现在以下几点

- 自定义转盘的内容和概率，满足你各种各样的需求
- 作弊模式：可以指定旋转的结果
- 支持手动旋转转盘，增加用户体验

![小程序码](https://tva1.sinaimg.cn/large/00831rSTgy1gd4w9w4h2oj30u00u0q43.jpg)

希望大家前来体验和吐槽哦~好了，接下来我们来康康我是怎么实现这个转盘的吧，走起！

## 准备工作

首先我们需要复习几个公式

- 角度转弧度：2 * Math.PI * 弧度 = 角度
- 正弦定理和余弦定理：在任意一个三角形ABC中，sinA = 对边 / 斜边，cosA = 邻边 / 斜边，tanA = 对边 / 邻边，如果不懂的话，可以自行搜索哦~

如果对canvas不太熟悉，可以看一下慕课网上这个免费的[教程](https://www.imooc.com/learn/612)，然后再看一下微信小程序[文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.createCanvasContext.html)上canvas的部分，准备工作做好之后，我们先来说一下大体的实现思路：

- 转盘的绘制：使用扇形拼接，通过不同的弧度绘制不同大小的扇形
- 转盘的旋转：因为绘制的时候是从0度开始绘制，我们只需要不停的改变开始的角度，让转盘连续绘制，就可以行成旋转的效果了
- 旋转的结果：每一块扇形都有自己的弧度区域和索引，我们只需要随机选中一个索引，然后从索引对应的弧度区域再随机选中一个具体的弧度，然后计算起始点到终点需要多长的弧度，然后让转盘旋转相应的弧度就可以了
- 指定转盘的结果：我们只需要将上一步随机生成索引的步骤换成传入一个指定的索引即可
- 手动旋转：记录手指落下点和离开点在转盘上的横纵坐标，这两个点与转盘原点行成一个夹角，计算这个夹角，将夹角转换成弧度，就是转盘需要旋转的弧度了，在选择结束后记下选择结束后的起始点，这样下一次旋转就不是从0度开始，而是从这一个的结束点开始了

接下来我们就来一一实现上述的思路

## 转盘的绘制

因为需要将其设置为一个组件，所以首先说一下传入数据：

1、转盘的宽width  
2、选中的索引（可选）checkIndex，默认-1  
3、数组（扇形的数据）sector：  

```js
sector: [
  {order: 1, text: '扇形1', color: '#5B8FF9'},
  {order: 1, text: '扇形2', color: '#6DC8EC'},
  {order: 1, text: '扇形3', color: '#E8684A'}
]
```

上述数组代表的是每一块扇形占圆的1 / 3，即order越大，所占圆的面积越大，概率也就越大

因为canvas绘制圆弧的API:CanvasContext.arc(number x, number y, number r, number sAngle, number eAngle, boolean counterclockwise)，需要接收的参数分别是圆心X，圆心Y，半径R，开始角度，结束角度，是否是逆时针，所以我们需要先计算每一块扇形的起始和终止角度

```js
/**
 * 处理扇形数据
 * @param {Array} sector 扇区
 * @param {Number} starAngle：开始的角度
 */
export const calAngle = (sector, startAngle) => {
  // 计算数据总和
  let count = 0
  sector.forEach((item) => {
    count += item.order
  })

  // 计算出开始的弧度和所占比例
  return sector.map((item) => {
    item.proportion = item.order / count
    item.startAngle = startAngle
    startAngle += 2 * Math.PI * item.proportion
    return item
  })
}
```

然后是扇形上文字的绘制，我们希望如果文本太长的话可以换行，文本相对于圆心进行旋转

```js
/**
 * 处理文本换行:将满足定义的宽度的文本作为value单独添加到数组中,最后返回的数组的每一项就是我们处理后的每一行了
 * @param {Object} context         画布上下文
 * @param {String} text            需要处理的长文本
 * @param {Number} maxLineWidth    自己定义的一行文本最大的宽度
 */
export const getLineTextList = (context, text, maxLineWidth) => {
  const wordList = text.split('')
  let tempLine = ''
  const lineList = []
  for (let i = 0; i < wordList.length; i++) {
    // measureText: 测量文本尺寸信息。目前仅返回文本宽度
    // fontSize的大小,所以基于这个,我们将maxLineWidth设置为当前字体大小的倍数
    if (context.measureText(tempLine).width >= maxLineWidth) {
      lineList.push(tempLine)
      maxLineWidth -= context.measureText(text[0]).width
      tempLine = ''
    }
    tempLine += wordList[i]
  }
  lineList.push(tempLine)
  return lineList
}
```

计算好这些之后就可以开始绘制了

```js
export const draw = (context, sector, x, y, r, startAngle) => {
  const sector = calAngle(sector, startAngle)
  // 描边
  context.lineWidth = 2
  context.strokeStyle = '#ffffff'
  // 文字大小根据扇形数变化，当超过6时依次减小文字大小
  let maxLineWidth = 100
  let font = 14
  if (sector.length > 6) {
    maxLineWidth -= (sector.length - 6) * 10
    font -= (sector.length - 6)
  }

  sector.forEach((item) => {
    /**
     * 绘制扇形
     */
    context.save()
    context.beginPath()
    context.fillStyle = item.color
    context.moveTo(x, y)
    context.arc(x, y, r, item.startAngle, item.startAngle + 2 * Math.PI * item.proportion)
    context.closePath()
    context.fill()
    context.stroke() // 描边
    context.restore()

    /**
     * 绘制文字
     */
    context.save()
    context.fillStyle = '#fff'
    context.font = `${font}px sans-serif`
    // 改变canvas原点的位置
    context.translate(
      x + Math.cos(item.startAngle + item.proportion * 3) * r,
      y + Math.sin(item.startAngle + item.proportion * 3) * r
    )
    // 文字旋转角度,这个旋转是相对于原点进行旋转的.
    context.rotate(item.startAngle + item.proportion * 3 + Math.PI / 2)
    getLineTextList(context, item.text, maxLineWidth).forEach((line, index) => {
      // 要绘制的文字,开始绘制的x坐标,开始绘制的y坐标
      context.fillText(line, -context.measureText(line).width / 2, ++index * 35)
    })
    context.restore()
  })

  /**
   * 绘制指针底盘
   */
  context.save()
  context.beginPath()
  context.moveTo(x, y)
  context.arc(x, y, 25, 0, 2 * Math.PI)
  context.fillStyle = '#fff'
  context.shadowOffsetX = 1
  context.shadowOffsetY = 1
  context.shadowOffsetColor = '#eee'
  context.fill()
  context.restore()

  /**
   * 绘制指针
   */
  context.save()
  context.beginPath()
  context.fillStyle = '#fff'
  context.moveTo(x - 10, x - 15)
  context.lineTo(x, x - 50)
  context.lineTo(x + 10, x - 15)
  context.closePath()
  context.fill()
  context.restore()

  /**
   * 绘制文字环
   */
  context.save()
  context.beginPath()
  context.moveTo(x, y)
  context.arc(x, y, 20, 0, 2 * Math.PI)
  context.fillStyle = '#eee'
  context.fill()
  context.restore()

  /**
   * 绘制start文字
   */
  context.save()
  context.beginPath()
  context.fillStyle = '#333'
  context.font = '12px sans-serif'
  context.translate(x, y - 5) // 文字居中
  context.fillText('Start', -context.measureText('Start').width / 2, 8)
  context.restore()

  context.draw()
}
```

这样转盘就绘制好啦~  
但是有一点需要特殊说明一下，微信小程序官方提倡使用getContext()来获取canvas的上下文，由于使用这个方法按照官方的提示做的不同设备的适配不太符合预期，而且存在模糊的情况（很有可能是我自己的问题），所以暂时还是用的createCanvasContext()来获取的上下文，这个点先暂时留着下一个版本去优化。

## 开始旋转

关于旋转，就我上述所说，需要不停的改变转盘绘制的初始角度，行成旋转的效果，所以这里我使用的requestAnimationFrame这个API去循环调用绘制函数，这个API的原理是：它不需要使用者指定循环间隔时间，浏览器会基于当前页面是否可见、CPU的负荷情况等来自行决定最佳的帧速率，从而更合理地使用CPU。但是由于我用的createCanvasContext()来获取的上下文，这个API获取的context是不支持requestAnimationFrame这个方法的，因此我需要自己实现一个requestAnimationFrame

```js
/**
 * 自定义canvas.requestAnimationFrame方法
 * @param {Function} callback
 */
let lastFrameTime = 0
const doAnimationFrame = (callback) => {
  const currTime = new Date().getTime()
  const timeToCall = Math.max(0, 16 - (currTime - lastFrameTime)) // 一般渲染帧间隔为 16ms 左右
  const id = setTimeout(function () { callback(currTime + timeToCall) }, timeToCall)
  lastFrameTime = currTime + timeToCall
  return id
}
```

接着我们需要设计一个算法来得到随机选中的索引：因为我设置的转盘最多支持12项，所以我将一个圆分成12份，按照扇形所占的比例分給其相应的份数，例如上述那个三等分转盘的数组，那么得到的索引数组就应该是：[0,0,0,0,1,1,1,1,2,2,2,2]，如果上述的数组的order分别是1，2，3，那么得到的索引数组就应该是：[0,0,1,1,1,1,2,2,2,2,2,2]，所以按照这样的逻辑，得到如下函数：

```js
/**
 * 得到的索引数组
 * @param {Array} sector 扇形块
 */
export const probability = (sector) => {
  const randomList = []
  const averageNum = Math.floor(100 / 12)
  sector.forEach((item, index) => {
    const itemNumber = Math.floor(item.proportion * 100 / averageNum)
    const itemArr = Array.from({length: itemNumber}).fill(index)
    randomList.push(...itemArr)
  })
  const index = Math.floor((Math.random()*randomList.length))
  return randomList[index]
}
```

接下来我们需要计算停下的点与起点的距离了

```js
/**
 * 确定随机停下的点与起点的距离
 * @param {Array} sector 扇形块
 * @param {Number} checkIndex 指定结果index
 */

export const distanceToStop = (sector, checkIndex = -1) => {
  const blockList = [] // 每个扇形块所占的弧度数组
  let distance = 0
  sector.forEach(item => {
    blockList.push(item.proportion * 2 * Math.PI)
  })
  const currentPieIndex = checkIndex === -1 ? probability(sector) : checkIndex // 随机生成选中扇形索引
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  const targetBlockList = (from, to) => blockList.slice(from, to) // 截取选中扇形与起始扇形数组，方便计算目标区域的最大最小值
  const minDistance = currentPieIndex === 0 ? 0 : targetBlockList(0, currentPieIndex).reduce(reducer) //目标区域的最小弧度
  const maxDistance = currentPieIndex === 0 ? blockList[currentPieIndex] : targetBlockList(0, currentPieIndex + 1).reduce(reducer) // 目标区域的最大弧度
  const targetDistance = Math.random() * (maxDistance - minDistance) + minDistance // 在最大最小弧度间随机取一个弧度
  // 因为指针是垂直向上的，相当坐标系的Math.PI * 3/2,所以我们这里要进行判断来移动角度
  distance = Math.PI * 3 / 2 - targetDistance
  // 额外加上后面的值，是为了让转盘多转动几圈，体验更好
  return {
    distance: distance + Math.PI * 20,
    checkedIndex: currentPieIndex
  }
}
```

万事俱备，只欠东风！这个时候我们就可以让转盘旋转起来了

```js
/**
 * 旋转动画
 * @param {Object} context canvas上下文
 * @param {Array} sector  扇形数组
 * @param {Number} x 原点x
 * @param {Number} y 原点y
 * @param {Number} r 转盘半径
 * @param {Number} distance 选中项跑到指针位置要转动的距离
 * @param {Number} startAngle 开始的角度
 */
export const rotate = (context, sector, x, y, r, distance, startAngle = 0) => {
  const changeRadian = (distance - startAngle) / 10 // 除10是为了细化每一次改变的角度大小，让旋转更久一点提升用户体验
  startAngle += changeRadian
  if (distance - startAngle <= 0.05) return
  draw(context, sector, x, y, r, startAngle)
  // 循环调用rotate方法，使转盘连续绘制， 形成旋转视觉
  doAnimationFrame(rotate.bind(this, context, sector, x, y, r, distance, startAngle))
}
```

怎么样，你的转盘旋转起来了吗？如果转盘已经转动起来了，那么手动旋转就只需要做一点计算就好啦

```js
/**
 * 手动旋转
 * @param {Number} param0 开始点与中心点的距离
 * @param {Number} param1 结束点与中心点的距离
 */

const getAngle = ({x: x1, y: y1}, {x: x2, y: y2}) => {
  const dot = x1 * x2 + y1 * y2
  const det = x1 * y2 - y1 * x2
  const angle = Math.atan2(det, dot) / Math.PI * 180
  return angle
}

/**
 * 手动旋转时移动的距离
 * @param {Number} moveX 移动点X
 * @param {Number} moveY 移动点Y
 * @param {Number} w 中心点X，Y和半径R
 * @param {Number} startX 鼠标落下的点X
 * @param {Number} startY 鼠标落下的点Y
 */

export const getDistance = (moveX, moveY, w, startX, startY) => {
  const angle = getAngle({
    x: startX - w,
    y: startY - w,
  }, {
    x: moveX - w,
    y: moveY - w,
  })
  return angle * Math.PI / 180
}
```

## 最后

本文只提供了一些思路和部分实现方法，具体的业务还是需要各位自己去组装编写的哦。我这个小菜菜研究这个小转盘花了整整三天的时间，也踩了不少坑，走了不少弯路，希望把我的经验分享給大家，大家也可以制作出自己的小转盘~另外給大家再推荐两款小程序哈  

**单词天天斗**：单词对战PK，支持好友对战。可选小学、中考、高考、CET4、CET6、考研等核心词汇  
![单词天天斗](https://tva1.sinaimg.cn/large/00831rSTgy1gd50hk4y6cj30by0by766.jpg)  
**有本密码**：安全简洁的账号密码管家，支持指纹验证、faceID，N重安全保障  
![有本密码](https://tva1.sinaimg.cn/large/00831rSTgy1gd50hx67i7j30760760tg.jpg)
