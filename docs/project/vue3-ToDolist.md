--- 
title: vue3初体验——ToDoList
date: 2020/09/21
sidebar: 'auto'
categories: 
 - 实战
tags: 
 - 实战
publish: true
---

2020年9月18日，万众期待的Vue.js 3.0终于发布了~从去年开始Vue3.0就一直被大家所期待，目前国内外也已经拥有了130w+的使用者，我也是看到朋友圈，公众号在疯狂转发关于Vue3.0的相关文章才知道，可见Vue.js的影响力之大，话不多说，先通过一个小Demo来学习学习~

## 引入方式

- CDN方式：`<script src="https://unpkg.com/vue@next"></script>`
- 通过vite脚手架方式：`npm init vite-app hello-vue3 # OR yarn create vite-app hello-vue3`
- 通过vue-cli脚手架方式：

```js
sudo npm install -g @vue/cli # OR yarn global add @vue/cli  (升级脚手架)
vue create hello-vue3  (创建项目)
# select vue 3 preset
```

![选择vue 3 preset](https://tva1.sinaimg.cn/large/007S8ZIlgy1giy35wwboaj30nw06s75o.jpg)

创建出来的目录结构和vue2没有什么差别，但是main.js里的内容有所变化：

```js
//vue2.x  main.js文件
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')


// vue3.0   main.js文件
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

vue3.0中将vue的实例化封装进了createApp方法中，另外App.vue文件中取消了template下的最外层的div元素

```js
// vue2.x    App.vue文件
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

// vue3.0    App.vue文件
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>
```

## 需要关注的新特性

- Composition API
- Teleport
- Fragments
- Emits Component Option
- createRenderer API from @vue/runtime-core to create custom renderers
- SFC Composition API Syntax Sugar (`<script setup>`) experimental
- SFC State-driven CSS Variables (`<style vars>`) experimental
- SFC `<style scoped>` can now include global rules or rules that target only slotted content

### Composition API

> 官方文档对其功能的描述：
> It would be much nicer if we could collocate code related to the same logical concern. And this is exactly what the Composition API enables us to do.

大致翻译一下就是说，使用传统的 Vue2.x 配置方法写组件的时候，随着业务复杂度越来越高，代码量会不断的加大。由于相关业务的代码需要遵循option 的配置写到特定的区域，导致后续维护非常的复杂，同时代码可复用性不高。Composition 这个API可以让我们**配置与相同逻辑相关的代码**。

这个API提供了以下几个方法：

- reactive
- watchEffect
- computed
- ref
- toRefs
- hooks

#### reactive

```js
import { reactive } from 'vue'
export default {
 setup() {
  const state = reactive({
    a: 0
  })
  function increment() {
    state.a++
  }
  return {
    state,
    increment
  }
 }
}

```

> reactive 相当于 Vue2.x 的 Vue.observable () API，经过 reactive 处理后的函数能变成响应式的数据，类似之前写模板页面时定义的 data 属性的值

#### watchEffect

```js
import { reactive, computed, watchEffect } from 'vue'
export default {
  setup() {
    const state = reactive({ a: 0 })

    const double = computed(() => state.a * 2)

    function increment() {
      state.count++
    }

    const wa = watchEffect(() => {
      // 使用到了哪个 ref/reactive 对象.value, 就监听哪个
      console.log(double.value)
    })
    // 可以通过 wa.stop 停止监听
    return {
      state,
      increment
    }
  }
}
```

> watchEffect 被称之为副作用，立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。

#### computed

```js
import { reactive, computed } from 'vue'
export default {
  setup() {
   const state = reactive({
    a: 0
   })
   const double = computed(() => state.a * 2)
   function increment() {
    state.a++
   }
   return {
    double,
    state,
    increment
   }
  }
}
```

> computed 在 Vue2.x 就存在了，只不过现在使用的形式变了一下，需要被计算的属性，通过上述形式返回

#### ref

```js
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

> 因为在js中原始类型都是通过值传递而不是通过引用传递，如果需要使行为在各数据类型中保持一致，就需要用ref包装一下值

## 重大变化

(9-27日待续....)

## 一些学习链接整理

- vue3新增特性以及一些更改的文档：[传送门👉](https://v3.vuejs.org/guide/migration/introduction.html#overview)
- 英文好的同学可以学习这些官方课程：[传送门👉](https://www.vuemastery.com/courses-path/vue3)
