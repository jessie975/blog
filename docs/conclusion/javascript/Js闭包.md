--- 
title: js闭包
date: 2019-07-17 12:39:15
sidebar: 'auto'
categories: 
 - 学习总结
tags: 
 - JavaScript
publish: true
---
## 什么是闭包

一般情况一个函数（函数作用域）执行完毕，里面声明的变量会全部释放，被垃圾回收器回收。但使用闭包能让作用域里面的变量，在函数执行完之后依旧保存，不被垃圾回收处理掉。

- 例1

```js
function outer(){
    var a = 1;
    function inner(){
        return a++;
    }
    return inner;
}
var abc = outer();
//outer()只要执行过，就有了引用函数内部变量的可能，然后就会被保存在内存中；
//outer()如果没有执行过，由于作用域的关系，看不到内部作用域，更不会被保存在内存中了；

console.log(abc());//1
console.log(abc());//2
//因为a已经在内存中了，所以再次执行abc()的时候，是在第一次的基础上累加的

abc = null;
//由于闭包占用内存空间，所以要谨慎使用闭包。尽量在使用完闭包后，及时解除引用，释放内存；

// 直接返回函数
function outer2(){
  var t = 1;
  return function (){
    console.log(t++);
  }
}

var a = outer2();
a();//1
a();//2
a();//3
a = null;
```

- 例2

```js
function foo(tmp) {
    return function () {
        alert((tmp++));
    }
}
var bar = foo(1); // bar 现在是一个闭包
bar();//1
bar();//2
bar();//3
bar();//4
```

- 例3

> 闭包混入立即执行函数

```js
var btnList = document.getElementsByClassName("btn"),
  len = btnList.length;
for (var i = 0; i < len; i++) {
  (function (j) {
    btnList[j].onclick = function () {
      console.log("第" + j + "个按钮被点击到了")
    }
  })(i)
}
```

这又哪里产生了闭包了。别急，我们一个个分析。for循环每一次都执行一个 IIEF （自执行函数），每一次变量 i 被当做参数传到IIEF中去 ， 那么这个自执行函数中创建了一个变量，参数 j 然后元素节点 btnList 绑定一个onclick事件，执行函数里面需要用到这个参数 j ，但是你又没点 ， 那么这个遍历 j 就没有被清理 ， 就一直在参数里面被保存着 ， 每一个IIEF都做一样的事情 ， 所以这个时候就产生了闭包 ， 变量 j 并没有被回收，依然在等待你使用。
