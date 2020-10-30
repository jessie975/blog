--- 
title: 常见手写题（call、apply、bind、new、instanceof内部实现）
date: 2020/01/10
sidebar: 'auto'
categories: 
 - 面试
tags: 
 - 面试
publish: true
---

## call

实现思路：

- 改变了`this`指向，让新的对象可以执行该函数，并能接受参数
- 若不传入第一个参数，那么执行上下文默认为`window`

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this // 给 context 创建一个 fn 属性，并将值设置为需要调用的函数
  const args = [...arguments].slice(1) // arguments是伪数组不能直接调用slice方法
  const result = context.fn(...args)
  delete context.fn // 将对象上的函数删除
  return result
}
```

## apply

apply的实现思路与call基本一致，需要注意的点是apply需要用【数组】进行传参

```js
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  let result
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```

## bind

bind与call、apply最大的区别在于bind需要返回一个改变this指向后的函数  

实现思路：

- bind返回的函数需要考虑两种调用方式：直接调用、new方法
- 直接调用: 可以用call或者apply 的方式实现。下面例子使用apply实现。需要注意的是参数的处理，因为 bind 可以实现类似这样的代码 f.bind(obj, 1)(2)，所以我们需要考虑将两边的参数拼接起来，于是就可以这样写： args.concat(...arguments)
- new方法：因为通过new方法调用的函数，this被固化在了实例上，所以我们需要忽略传入的参数

```js
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const _this = this
  const args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```

## new

实现思路：

- 新生成了一个对象
- 链接到原型
- 绑定 this
- 返回新对象

```js
function myNew() {
  let obj = {}
  let Con = [].shift.call(arguments) // 获取构造函数
  obj.__proto__ = Con.prototype // 将空对象的原型链接到构造函数的原型上
  let result = Con.apply(obj, arguments)
  return result instanceof Object ? result : obj // 确保返回的是一个对象
}
```

## instanceof

instanceof用于判断某对象的类型，内部机制就是通过判断这个对象是否是某类型的实例  

实现思路：

- 获取类型的原型
- 获取对象的原型
- 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null

```js
function myInstanceof(left, right) {
  let prototype = right.prototype // 类型的prototype指向原型
  left = left.__proto__ // 实例的__proto__也指向原型
  while (true) {
    if (left === null || left === undefined)
      return false
    if (prototype === left)
      return true
    left = left.__proto__
  }
}
```
