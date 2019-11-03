--- 
title: 设计模式学习
date: 2019-11-01 14:36:10
sidebar: 'auto'
categories: 
 - 学习总结
tags: 
 - 设计模式
publish: true
---
JavaScript中常见的设计模式

- 观察者模式
- 发布-订阅模式
- 单例模式
- 策略模式
- 代理模式
- 适配者模式
- 装饰者模式

## 观察者模式

观察者模式：当观察的数据对象发生变化时, 自动调用相应函数，例如**vue中的双向绑定**  

1.**Object.defineProperty**  

缺点：  

- Object.defineProperty() 不会监测到数组引用不变的操作(比如 push/pop 等);
- Object.defineProperty() 只能监测到对象的属性的改变, 即如果有深度嵌套的对象则需要再次给之绑定 Object.defineProperty();

```js
var obj = {
  data: { list: [] },
}

Object.defineProperty(obj, 'list', {
  get() {
    return this.data['list']
  },
  set(val) {
    console.log('值被更改了')
    this.data['list'] = val
  }
})
```

2.**Proxy**  

优点：  

- 可以劫持数组的改变;
- defineProperty 是对属性的劫持, Proxy 是对对象的劫持;

```js
var obj = {
  value: 0
}

var proxy = new Proxy(obj, {
  set: function(target, key, value, receiver) { // {value: 0}  "value"  1  Proxy {value: 0}
    console.log('调用相应函数')
    Reflect.set(target, key, value, receiver)
  }
})

proxy.value = 1 // 调用相应函数
```

**[参考链接](https://github.com/MuYunyun/blog/blob/master/BasicSkill/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85%E6%A8%A1%E5%BC%8F.md)**

## 发布-订阅模式

发布订阅模式:希望接收通知的对象基于一个主题通过自定义事件订阅主题，被激活事件的对象通过发布主题事件的方式通知各个订阅该主题的对象。例如**vue中的EventBus**  

实现思路：  

- 创建一个对象(缓存列表)
- on方法用来把回调函数fn都加到缓存列表中
- emit方法取到arguments里第一个当做key，根据key值去执行对应缓存列表中的函数
- off方法可以根据key值取消订阅

```js
let event = {
    list: {},
    on(key, fn) {
        if (!this.list[key]) {
            this.list[key] = [];
        }
        this.list[key].push(fn);
    },
    emit() {
        let key = [].shift.call(arguments),
            fns = this.list[key];

        if (!fns || fns.length === 0) {
            return false;
        }
        fns.forEach(fn => {
            fn.apply(this, arguments);
        });
    },
    off(key, fn) {
        let fns = this.list[key];
        // 如果缓存列表中没有函数，返回false
        if (!fns) return false;
        // 如果没有传对应函数的话
        // 就会将key值对应缓存列表中的函数都清空掉
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            // 遍历缓存列表，看看传入的fn与哪个函数相同
            // 如果相同就直接从缓存列表中删掉即可
            fns.forEach((cb, i) => {
                if (cb === fn) {
                    fns.splice(i, 1);
                }
            });
        }
    }
};

function cat() {
    console.log('一起喵喵喵');
}
function dog() {
    console.log('一起旺旺旺');
}

event.on('pet', data => {
    console.log('接收数据');
    console.log(data);
});
event.on('pet', cat);
event.on('pet', dog);
// 取消dog方法的订阅
event.off('pet', dog);
// 发布
event.emit('pet', ['二哈', '波斯猫']);
/*
    接收数据
    [ '二哈', '波斯猫' ]
    一起喵喵喵
*/

```

[参考链接](https://juejin.im/post/5b125ad3e51d450688133f22)

## 单例模式

单例模式：一个类仅有一个实例，并提供一个全局的访问点，例如**弹框、登录按钮**  

实现思路：  

- 先判断实例存在与否  
- 如果存在则直接返回，否则就创建了再返回  

```js
class CreateUser {
  constructor(name) {
    this.name = name
    this.getName()
  }
  getName() {
    return this.name
  }
}
// 代理实现单例模式
let proxyMode = (function () {
  let instance = null
  return function (name) {
    return instance || (instance = new CreateUser(name))
  }
})()
// 测试单例模式的实例
let a = new proxyMode('aaa')
let b = new proxyMode('bbb')
// 因为单例模式只实例化一次，所以下面的实例是相等的
console.log(a === b) //true
```

## 策略模式

策略模式:根据不同参数可以命中不同的策略  

```js
const A = function(salary) { return salary * 3 }
const B = function(salary) { return salary * 2 }

const calculateBonus = function(func, salary) { return func(salary) }

console.log(calculateBonus(A, 10000)) // 30000
```

## 代理模式

代理模式: 代理对象和本体对象具有一致的接口, 对使用者友好,例如**图片懒加载**

```js
const myImage = (function() {
  const imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: function(src) {
      imgNode.src = src
    }
  }
})()

const proxyImage = (function() {
  const img = new Image()
  img.onload = function() { // http 图片加载完毕后才会执行
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function(src) {
      myImage.setSrc('loading.jpg') // 本地 loading 图片
      img.src = src
    }
  }
})()

proxyImage.setSrc('http://loaded.jpg')
```

[参考链接](https://github.com/MuYunyun/blog/blob/master/BasicSkill/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F.md)

## 适配者模式

适配器用来解决两个接口不兼容的情况，不需要改变已有的接口，通过包装一层的方式实现两个接口的正常协作
**demo**

```js
// 老接口
const zhejiangCityOld = (function() {
  return [
    {
      name: 'hangzhou',
      id: 11,
    },
    {
      name: 'jinhua',
      id: 12
    }
  ]
}())

console.log(getZhejiangCityOld())

// 新接口希望是下面形式
{
  hangzhou: 11,
  jinhua: 12,
}

// 这时候就可采用适配者模式
const adaptor = (function(oldCity) {
  const obj = {}
  for (let city of zhejiangCityOld) {
    obj[city.name] = city.id
  }
  return obj
}())
```

在 Vue 中，我们其实经常使用到适配器模式。比如父组件传递给子组件一个时间戳属性，组件内部需要将时间戳转为正常的日期显示，一般会使用 computed 来做转换这件事情，这个过程就使用到了适配器模式。

**[参考链接](https://github.com/MuYunyun/blog/blob/master/BasicSkill/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E9%80%82%E9%85%8D%E8%80%85%E6%A8%A1%E5%BC%8F.md)**

## 装饰者模式

动态地给函数赋能:简单理解就是（天冷了就穿衣服，天热了就脱衣服），可以在不改变函数内部逻辑的基础上增加新功能

```js
Function.prototype.before = function (beforefn) {
       var _self = this;    //保存原函数引用
       return function () { //返回包含了原函数和新函数的"代理函数"
           beforefn.apply(this, arguments); //执行新函数，修正this
           return _self.apply(this, arguments); //执行原函数
       }
   };

   Function.prototype.after = function (afterfn) {
       var _self = this;
       return function () {
           var ret = _self.apply(this, arguments);
           afterfn.apply(this, arguments);
           return ret;
       }
   };

   var func = function () {
       console.log("2")
   }

   func = func.before(function () {
       console.log("1");
   }).after(function () {
       console.log("3");
   } )

   func();  
```

**[参考链接](https://www.cnblogs.com/yonglin/p/8059183.html)**
