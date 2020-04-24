--- 
title: offer攻坚战——JS基础
date: 2020-04-24 11:05:37
sidebar: 'auto'
categories: 
 - 面试
tags: 
 - 面试
publish: true
---

废话不多说，干就完了~

![导图](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge4okz9vbaj30qw0ocac6.jpg)

## 执行上下文/作用域链/闭包

什么是执行上下文，简单的理解就是JS代码的执行环境。执行上下文分为：

- 全局执行上下文: 任何不在函数内的代码都在全局上下文中，一个程序中只会有一个全局执行上下文（浏览器中的window对象）
- 函数执行上下文: 函数被调用时，每个函数都会创建自己的执行上下文

执行栈：一种拥有先进后出的数据结构的栈，被用来存储代码运行时所创建的执行上下文。  

当JS引擎第一次加载脚本时，它会先创建一个全局的执行上下文并放入当前执行栈。每当函数遇到一个函数的调用就会为该函数创建一个新的执行上下文并放入执行栈，引擎会先执行栈顶的函数，当函数执行完毕就将其执行上下文弹出，控制流程到达当前栈中的下一个上下文。

创建执行上下文有两个阶段：**创建**、**执行**

创建阶段会发生着三件事：

- 绑定this（this指向函数执行的上下文）
- 创建词法环境组件
- 创建变量环境组件

> 面试题：怎么判断this的指向

![判断this指向](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge4ufrkfkoj31jo0oytbl.jpg)  

**谁调用函数谁就是this**，牢记这个图，然后通过下面的例子理解一下：

```js
var x = 'window_x'
var obj = {
    x: 'obj_x',
    funA: function() {
        console.log(this.x)
    },
    funB: () => {
        console.log(this.x)
    }
}
obj.funA() // obj_x   解释：obj调用funA，所以this指向obj
obj.funB() // window_x  解释：obj调用funB，funB是箭头函数，箭头函数的this指向包裹它的第一个普通函数的this，也就是指向obj的this，也就是window
var fn = obj.funA
fn() // window_x   解释：相当于上图中普通函数部分的fun()方式，所以指向window
fn.call(obj) // obj_x 1   解释：call调用，this为传入的第一个参数
fn.apply(obj)
console.log(fn.bind(obj))
fn.bind(obj)()
```

关于词法环境和变量环境这个涉及到编译原理，在平时的开发工作中，与之相对应的概念为**let、const、var**的区别。在 ES6 中，词法环境组件和变量环境的一个不同就是前者被用来**存储函数声明和变量（let 和 const）绑定**，而后者只用来**存储 var 变量绑定**

> 面试题：var、let、const的区别

在执行上下文创建阶段，引擎检查出变量或者函数，将他们的声明提到全局作用域【变量提升和函数提升，函数提升优先于变量提升】，对使用**var**关键字声明的变量初始化为`undefined`，而**let**和**const**则将不被初始化【暂时性死区】，这就是为什么我们可以在var声明前访问到变量的原因了。  

下面来看一个经典的程序题来体会他们的区别：

```js
for (var i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i)
    }, 1000)
}
console.log(i) // 5 隔一秒 5 5 5 5 5

// 注意以上输出是一秒输出的，而不是每隔一秒输出一个数字
// 因为在循环执行过程中，几乎同时设置了 5 个定时器，一般情况下，这些定时器都会在 1 秒之后触发，而循环完的输出是立即执行的
```

如果想让其变为输出5 0 1 2 3 4应该怎么做呢？因为var声明的变量会被提升至全局作用域，当执行i++的时候相当于是在对同一个i做++，而setTimeout又属于宏任务，会等到所有的同步代码执行完毕后才执行，所以当执行到setTimeout的时候i已经变成了5。所以想要实现输出5 0 1 2 3 4，我们只需要保证i在声明的时候就能够输出就好啦，根据let的特征得到如下代码：

```js
for (let i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i)
    }, 1000)
}
console.log(i) // 5 隔一秒 0 1 2 3 4
```

或者根据setTimeout的第三个参数arg1, ..., argN(附加参数，一旦定时器到期，它们会作为参数传递给function)可以得到如下代码：

```js
for (var i = 0; i < 5; i++) {
    setTimeout((j) => {
        console.log(j)
    }, 1000, i)
}
console.log(i) // 5 隔一秒 0 1 2 3 4
```

另外还可以**闭包**来解决这个问题

> 面试题：什么是闭包？闭包的应用场景？闭包的缺点

看了很多文章，还是觉得这个定义最好理解也最贴切：**闭包是一个可以访问外部作用域的内部函数，即使这个外部作用域已经执行结束。**  

我们先用闭包来解决刚刚的疑问：

```js
for (var i = 0; i < 5; i++) {
    (function (j) {
        setTimeout(() => {
            console.log(j)
        }, 1000)
    })(i)
}
console.log(i) // 5 隔一秒 0 1 2 3 4
```

我们在循环内创建了一个立即执行函数，这个函数可以访问到外部作用域的i变量，即使这个外部作用域已经执行了，这个内部函数仍然可以操作这个变量i。另外，我们说的作用域也可以分为**全局作用域**、**块级作用域**和**函数作用域**，使用var声明的变量是在全局作用域下，而使用let和const声明的则在块级作用域下，**作用域链**也就是当引擎查找变量的时候，会先从当前的作用域下的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)的作用域下的变量对象中查找，一直找到全局作用域，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。简而言之，理解起来就是：**函数内部能够访问函数外部的变量，反之则不能访问**

```js
var a = 1
console.log(b)  // 报错
function fun() {
    var b = 2
    console.log(a)
}
fun() // 1
```

继续说闭包。  

那么闭包有哪些实际的应用场景呢？

- 封装私有变量

```js
function people (number) {
    const age = number
    this.getAge = function () {
        return age
    }
    this.addAge = function () {
        age++
    }
}
const jessie = new People(22)
jessie.addAge()
console.log(jessie.age) // undefined
console.log(jessie.getAge()) // 23
const arley = new People(22)
console.log(arley.getAge()) // 22
```

关于封装私有变量还可以使用`Object.defineProperty()`和`Symbol`

```js
function People(name, age) {
    Object.defineProperty(this, '_name', {
        value: name,
        enumberable: false, // 不可枚举
        writable: true, // 可读
        configurable: true // 可配置更改
    })
    this[Symbol('_age')] = age
}
const p1 = new People('jessie', 22)
const p2 = new People('arley', 22)
p1._name = 'hello'
console.log(p1) // People {_name: "hello", Symbol(_age): 22}
console.log(p2) // People {_name: "arley", Symbol(_age): 22}
```

- 函数防抖

```js
function debounce(fn) {
    var timer = null
    return function() {
        if(timer) {     //timer第一次执行后会保存在内存里 永远都是执行器 直到最后被触发
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(function() {
            fn()
        }, 1000)
    }
}
```

- 设计单例模式

```js
class CreateUser {
    constructor(name) {
        this.name = name;
        this.getName();
    }
    getName() {
        return this.name;
    }
}
// 代理实现单例模式
var ProxyMode = (function() {
    var instance = null;
    return function(name) {
        if(!instance) {
            instance = new CreateUser(name);
        }
        return instance;
    }
})();
// 测试单体模式的实例
var a = ProxyMode("aaa");
var b = ProxyMode("bbb");
// 因为单体模式是只实例化一次，所以下面的实例是相等的
console.log(a === b);    //true
```

通过上面的例子我们也可以发现，闭包访问的变量会被一直保存在内存中，不被垃圾回收机制处理，所以**闭包的缺点就是内存泄露**

## this/call/apply/bind

关于判断this的指向上文我们已经提到了，这一小节主要是几个常考的手写题

关于这部分的内容可以参考之前写的一篇文章：[手写题](http://jessie.i7xy.cn/interviewQuestions/write.html#call)

## 原型/继承
