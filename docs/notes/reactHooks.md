--- 
title: React Hooks 学习笔记
date: 2021/01/16
sidebar: 'auto'
categories: 
 - 学习笔记
tags: 
 - 学习笔记
publish: true
---

## 什么是React Hooks？

React Hooks 是 React 在 v16.8 版本引入的全新 API。  

React 的核心是组件，由于函数组件没有状态，所以引入了 class 组件，但是 class 组件之间复用状态逻辑很难，解决方案（HOC、Render Props）都需要重新组织组件结构，且代码难以理解，所以 React Hooks 设计的目的就是完全不使用 class 的情况下使用 state 以及其他的 React 特性。

比如 v16.8 版本之前，写一个组件是这样的：

```js
import React, { Component } from "react";

export default class Button extends Component {
  constructor() {
    super();
    this.state = { buttonText: "Click me!" };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(() => {
      return { buttonText: "Ooops!" };
    });
  }
  render() {
    const { buttonText } = this.state;
    return <button onClick={this.handleClick}>{buttonText}</button>;
  }
}
```

而使用React Hooks之后的写法是这样的：

```js
import React, { useState } from "react";

export default function  Button()  {
  const  [buttonText, setButtonText] =  useState("Click me!");

  return  <button  onClick={() => setButtonText("Ooops!")}>{buttonText}</button>;
}
```

Hook 这个单词的意思是"钩子"  

**React Hooks 的意思是，组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码"钩"进来。** React Hooks 就是那些钩子。  

需要什么功能，就使用什么钩子。React 默认提供了一些常用钩子，也可以封装自己的钩子。  

所有的钩子都是为函数引入外部功能，所以 React 约定，钩子一律使用use前缀命名，便于识别。

## 常用的Hooks

- useState
- useEffect
- useContext
- useRef
- useCallback
- useMemo

### useState: 状态钩子

语法：`const [state, setState] = useState(initialState);`

state是变量，setState 是修改 state 值的方法，是异步执行的。

```js
import React, { useState } from 'react';

export default function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### useEffect: 副作用钩子

语法：

```js
useEffect(() => {
  // doSometing
  return () => {
    // 清除订阅事件
  }
}, dependentArray)
```

callback是副作用回调函数，该回调可以返回一个匿名函数用于清除一些订阅的事件，dependentArray是依赖的变量数组。

当需要在状态发生改变时，做某些操作就可以使用这个钩子。默认情况下，effect 将在每轮渲染结束后执行，多个 effect 会按顺序执行，其内部是异步执行的。也可以选择让它在只有某些值改变的时候才执行。

```js
// 默认：渲染结束后执行
useEffect(() => {
  console.log('每次组件渲染就执行该 effect')
})

// 渲染后只执行一次
useEffect(() => {
  console.log('渲染完成')
}, [])

// 当 count 值发生改变时就触发 effect
useEffect(() => {
  console.log('count的值：', count)
}, [count])

// 通常，组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源。要实现这一点，useEffect 函数需返回一个清除函数。以下就是一个创建订阅的例子：
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };
});
```

常见用途：

- 获取数据（data fetching）
- 事件监听或订阅（setting up a subscription）
- 改变 DOM（changing the DOM）
- 输出日志（logging）

### useContext：跨组件共享状态钩子

当组件中需要共享某个状态时可以用到这个钩子：

```js
import React, { useContext, useState } from “react”;

const MyContext = React.createContext();

function Father() {
  const [value, setValue] = useState("init");

  return (
    <div>
      {(() => {
        console.log("Father render");
        return null;
      })()}
      <button onClick={() => {
        console.log("click：更新value")
        setValue(`Ooops!`)
      }}>
        改变value
      </button>
      <MyContext.Provider value={value}>
        <Child1 />
        <Child2 />
      </MyContext.Provider>
    </div>
  );
}

function Child1() {
  const value = useContext(MyContext);
  console.log("Child1-value", value);
  return <div>Child1-value: {value}</div>;
}

function Child2(props) {
  console.log("Child2")
  return <div>Child2</div>;
}

// Father render
// Child1-value: init
// child2
// click：更新value
// Father
// Father render
// Child1-value: Ooops!
// child2
```

结论：

- useContext 的组件总会在 context 值变化时重新渲染， 所以<MyContext.Provider>包裹的越多，层级越深，性能会造成影响。
- <MyContext.Provider> 的 value 发生变化时候， 包裹的组件无论是否订阅content value，所有组件都会从新渲染。

child2 不应该rerender, 可以使用React.memo避免不必要的render：

```js
......
const Child2 = React.memo((props) => {
  return <div>Child2</div>;
})

// Father render
// Child1-value: init
// child2
// click：更新value
// Father
// Father render
// Child1-value: Ooops!
```

### useRef

语法：`const refContainer = useRef(initialValue);`

useRef 会在每次渲染时返回同一个 ref 对象，其 .current 属性被初始化为传入的参数（initialValue），变更 .current 属性不会引发组件重新渲染。返回的 ref 对象在组件的整个生命周期内保持不变，即 useRef 创建的ref 并不会随着组件的更新而重新构建，所以通常可以使用 useRef 来存储常量。

```js
import { useState, useRef } from 'react';

export default function Example() {
  const [count, setCount] = useState(0)
  const ref = useRef()

   useEffect(() => {
    console.log('count', count)
    console.log('ref', ref.current)
  }, [count])

  return (
    <div className="App">
      <button onClick={() => {
        setCount(count + 1);
        if (!ref.current) {
          ref.current = count
        }
      }}>click me</button>
    </div>
  );
}

// count 0
// ref 0
// count 1
// ref 0
// count 2
// ref 1
// count 3
// ref 1
```

### useCallback

语法：

```js
const memoizedCallback = useCallback(() => { 
  doSomething(a, b); 
}, [a, b]);
```

useCallback 的使用场景：

```js
function Child({ event, data }) {
  console.log("child-render");

  useEffect(() => {
    console.log("child-useEffect");
    event();
  }, [event]);
  return (
    <div>
      <p>child</p>
      {/* <p>props-data: {data.data && data.data.openCode}</p> */}
      <button onClick={event}>调用父级 event</button>
    </div>
  );
}

const set = new Set();

export default function Demo() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState({});

  // 第一版
  // const handle = async () => {
  //   const response = await fetch("XXXXXXXXXX");
  //   const res = await response.json();
  //   console.log("handle", data);
  //   setData(res);
  // };

  // 第二版
  // const handle = useCallback(async () => {
  //   const response = await fetch("XXXXXXXXXX");
  //   const res = await response.json();
  //   console.log(“handle”, data);
  //   setData(res);
  // });

  // 第三版
  // const handle = useCallback(async () => {
  //   const response = await fetch("XXXXXXXXXX");
  //   const res = await response.json();
  //   setData(res);
  //   console.log("useCallback", data);
  // }, []);

  // 第四版
  const handle = useCallback(async () => {
    const response = await fetch("XXXXXXXXXX");
    const res = await response.json();
    setData(res);
    console.log("parent-useCallback", data);
  }, [count]);
  set.add(handle);

  console.log("parent-render====>", data);
  return (
    <div>
      <button
        onClick={e => {
          setCount(count + 1);
        }}
      >
        count++
      </button>
      <p>set size: {set.size}</p>
      <p>count:{count}</p>
      <p>data: {data.data && data.data.openCode}</p>
      <p>-------------------------------</p>
      <Child event={handle} />
    </div>
  );
}
```

解释：

- 第一版：每次 render，handle 都是新的函数，且每次都能拿到最新的 data。
- 第二版：用 useCallback 包裹 handle，每次 render， handle 也是新的函数，且每次都能拿到最新的 data， 和一版效果一样，所以不建议这么用。
- 第三版：useCallback 依赖第二个参数 deps，handle 会被 memoized， 所以每次 data 都是第一次记忆时候的data（闭包）。
- 第四版：每当 count 变化时，传入子组件的函数都是最新的，所以导致 child 的 useEffect 执行。

总结：

- useCallback将返回一个记忆的回调版本，仅在其中一个依赖项已更改时才更改。
- 当将回调传递给依赖于引用相等性的优化子组件以防止不必要的渲染时，此方法很有用。
- 使用回调函数作为参数传递，每次render函数都会变化，也会导致子组件rerender， useCallback可以优化rerender。

### useMemo

语法：`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`

总结：

- useMemo 会在 render 前执行。
- 如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值。
- useMemo 用于返回 memoize，防止每次 render 时大计算量带来的开销。
- 使用 useMemo 优化需谨慎， 因为优化本身也带来了计算，大多数时候，不需要考虑去优化不必要的重新渲染。
