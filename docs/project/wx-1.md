--- 
title: 微信小程序实战之封装wx.request
date: 2019-12-11 10:22:57
sidebar: true
categories: 
 - 实战
tags: 
 - 实战
publish: true
---

## 为什么要封装

微信小程序框架自带的网络请求和Ajax请求非常相似，都是异步请求，请求参数中需要送入url、method、data、header等参数，还要设置success成功的回调函数和fail失败的回调函数，当无数个success的嵌套再嵌套【回调地狱】，为了避免这种情况，故采用ES6的promise进行封装。

## 更优雅的调用方式

我们希望将Url和method统一放在一个文件（url.js）中去管理，而data这样的参数希望放在具体的业务中去传入，即这样的形式：  

url.js文件

```js
  login: {
    url: '/user/login/'    // 服务端请求地址
    method: 'get'
  }
```

app.js文件

```js
  Api.login({code: data.code}).then(data => {  // 小程序wx.login接口会返回一个code，将这个code发送给后端
    console.log('请求成功', data)
  }).catch(err => {
    console.log('请求失败', err)
  })
```

## 知识点准备

### promise

primise是异步编程的一种方案，简单来说promise主要解决的就是大量的函数嵌套情况，让异步函数可以链式调用。
例如有一个请求分为3个过程，每个过程之间有紧密的联系，传统的写法容易造成**回调地狱**：  

```js
  请求A(function(data){
    请求B(function(请求A的结果){
      请求C(function(请求B的结果){
        ...
      })
    })
  })
```

而用promise的常规写法是怎样的呢？

```js
new Promise(请求A)
  .then(请求B(请求A的结果))
  .then(请求C(请求B的结果))
  .catch(处理异常(异常信息))
```

通过上面的例子，不难发现promise的写法明显更加直观，可读性、可维护性都比传统的写法好，并且还能够在回调外捕获异常信息。接下来我们看看promise的常用Api.

#### promise常用api

##### Promise.resolve

- Promise.resolve(value)可以接收一个值或者是一个Promise对象作为参数  
- 当参数是普通值时，它返回一个**resolved状态**的Promise对象，对象的值就是这个参数 

> 说明：Promise有三种状态：pending，resolved，rejected  
> 当Promise刚创建完成时，处于pending状态  
> 当Promise中的函数参数执行了resolve后，Promise由pending状态变成resolved状态  
> 如果在Promise的函数参数中执行的是reject方法，那么Promise会由pending状态变成rejected状态  
> 并且Promise状态一旦变成resolved或rejected时，Promise的状态和值就固定下来了，不论后续怎么调用resolve或reject方法，都不能改变它的状态和值

```js
let p1 = Promise.resolve(1)
console.log(p1)
// Promise {<resolved>: 1}
```

##### Promise.reject

与Promise.resolve唯一的不同是返回的状态为reject

```js
let p2 = Promise.reject(1)
console.log(p2)
// Promise {<reject>: 1}
```

##### Promise.then

Promise 注册回调函数，函数形式：fn(vlaue){}，value 是上一个任务的返回结果，then 中的函数一定要 return 一个结果或者一个新的 Promise 对象，才可以让之后的then 回调接收

##### Promise.catch

捕获异常，函数形式：fn(err){}, err 是 catch 注册 之前的回调抛出的异常信息

##### Promise.race

多个 Promise 任务同时执行，返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败

##### Promise.all

多个 Promise 任务同时执行。
如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果。 如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果

Promise是一个比较难理解的知识点，本文不着重讲解，掌握了以上api才可以进行下面的封装。关于Promise的讲解还有很多优秀的文章，感兴趣的话可以深入研究一下，参考以下文章：  
[https://juejin.im/post/5b31a4b7f265da595725f322](https://juejin.im/post/5b31a4b7f265da595725f322)  
[https://juejin.im/post/597724c26fb9a06bb75260e8](https://juejin.im/post/597724c26fb9a06bb75260e8)

### 函数柯里化

柯里化，听着很高大上的词，其实在我的理解中，它就是将函数的参数分多次，一次只传递一个参数的一种技术而已。  

比如我们写一个计算乘积的函数

```js
const multiply = (a, b, c) => {
    return a * b * c;
}
multiply(1,2,3); // 6

```

低配版柯里化写法：

```js
const multiply = (a) => {
    return (b) => {
        return (c) => {
            return a * b * c
        }
    }
}
console.log(multiply(1)(2)(3)); // 6
```

高配版柯里化写法：

```js
const curry = fn =>
    (arg, args = [arg]) =>
    (!fn.length || args.length === fn.length ? fn(...args) : newArg => curry(fn)(newArg, [...args, newArg]));
const result = curry(multiply)
console.log(result(1)(2)(3)) // 6
```

这是天书吗？哈哈哈，没错，这是我当时看到这个写法的第一反应，来不及懊悔了，快去膜拜下大佬：[三行代码实现柯里化](https://juejin.im/post/5bf9bb7ff265da616916e816)

还有另外一个概念：**部分应用**和柯里化极其相似，它实现的效果是接受部分参数，然后返回一个接收剩下参数的函数。get！就是这个效果啦~我们理想中的效果就是将`url`和`method`放在一个文件中管理，而需要传输的data则在具体业务中传递。有了上面的知识储备之后就可以开始封装啦~

## 实现

文件require.js

```js
const apiRootUrl = 'http://XXXXX:8360'; // 服务端地址

/**
 * 封装微信的的request
 */
const request = (params) => {
  return (data = {}) => {
    return new Promise((resolve, reject) => {
      let url = apiRootUrl + params.url;
      let method = params.method ? params.method : 'get';
      wx.showNavigationBarLoading(); // 显示加载loading
      wx.request({
        url,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': wx.getStorageSync('token') // 每一个请求带上一个token让服务端知道用户的身份
        },
        success: (res) => {
          let retry = false; // 出现401后，限制只能重试一次
          if (res.data.errno === 0) {
            resolve(res.data.data);
          } else if (res.data.errno === -1) {
            resolve(res.data.errmsg);
          } else if (res.data.errno === 401) {
            // 鉴权失败，重试
            if (!retry) {
              retry = true;
              // 重新调用登录接口获取用户token
              wx.login({
                success (res) {
                  if (res.code) {
                    request({url: '/user/login'})({code: res.code}).then((res) => {
                      try {
                        wx.setStorageSync('token', res.token);
                        // 递归调用出现401的接口
                        return request(params)(data).then((res) => {
                          return resolve(res);
                        });
                      } catch (e) {
                        showToast('网络异常，请稍后重试~');
                      }
                    });
                  } else {
                    showToast('网络异常，请稍后重试~');
                  }
                }
              });
            } else {
              showToast('网络异常，请稍后重试~');
            }
          }
        },
        fail: (err) => {
          reject(err);
        },
        complete: () => {
          wx.hideNavigationBarLoading(); // 关闭加载loading
        }
      });
    });
  };
};

module.exports = request;
```

文件index.js

```js
const apiList = require('./url.js');
const request = require('./request.js');
const Api = {};

for (let key in apiList) {
  Api[key] = request(apiList[key]);
}

module.exports = Api;
```

文件url.js

```js
module.exports = {
  // user
  login: {
    url: '/user/login'
  },
  register: {
    url: '/store/register',
    method: 'post'
  }
  ...
};
```

调用：

```js
const Api = require('./api/index');

...
Api.login({code: res.code}).then((data) => {
  try {
    wx.setStorageSync('token', data.token);
  } catch (e) {
    wx.showToast('登录失败，请稍后重试~');
  }
}).catch((err) => {
  wx.showToast(err);
})
...
```

大功告成~嘿嘿，开心开心  
如果有不对的地方，欢迎大家指正，我们互相学习，共同进步~
