---
title: EventLoop
category:
  - JavaScript
date: 2020-12-03
---

## 浏览器进程

- 浏览器是多进程的
- 每一个 TAB 页就是一个进程
- 浏览器主进程
  - 控制其它子进程的创建和销毁
  - 浏览器界面显示，比如用户交互、前进、后退等操作
  - 将渲染的内容绘制到用户界面上
- 渲染进程就是我们说的浏览器内核
  - 负责页面的渲染、脚本执行、事件处理
  - 每个 TAB 页都有一个渲染进程
- 网络进程 处理网络请求、文件访问等操作
- GPU 进程 用于 3D 绘制
- 第三方插件进程

### 渲染进程

- GUI 渲染线程
  - 渲染、布局和绘制页面
  - 当页面需要重绘和回流时，此线程就会执行
  - 与 JS 引擎互斥
- JS 引擎线程
  - 负责解析执行 JS 脚本
  - 只有一个 JS 引擎线程(单线程)
  - 与 GUI 渲染线程互斥
- 事件触发线程
  - 用来控制事件循环(鼠标点击、setTimeout、Ajax 等)
  - 当事件满足触发条件时，把事件放入到 JS 引擎所有的执行队列中
- 定时器触发线程
  - setInterval 和 setTimeout 所在线程
  - 定时任务并不是由 JS 引擎计时，而是由定时触发线程来计时的
  - 计时完毕后会通知事件触发线程
- 异步 HTTP 请求线程
  - 浏览器有一个单独的线程处理 AJAX 请求
  - 当请求完毕后，如果有回调函数，会通知事件触发线程

## EventLoop

### 宏任务

- 页面的大部分任务是在主任务上执行的，比如下面这些都是宏任务
  - 渲染事件(DOM 解析、布局、绘制)
  - 用户交互(鼠标点击、页面缩放)
  - JavaScript 脚本执行
  - 网络请求
  - 文件读写
- 宏任务会添加到消息到消息队列的尾部，当主线程执行到该消息的时候就会执行
- 每次从事件队列中获取一个事件回调并且放到执行栈中的就是一个宏任务，宏任务执行过程中不会执行其它内容
- 每次宏任务执行完毕后会进行 GUI 渲染线程的渲染，然后再执行下一个宏任务
- 宏任务: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering
- 宏任务颗粒度较大，不适合需要精确控制境的任务
- 宏任务是由宿主方控制的

### 微任务

- 宏任务结束后会进行渲染然后执行下一个宏任务
- 微任务是当前宏任务执行后立即执行的宏任务
- 当宏任务执行完，就到达了检查点,会先将执行期间所产生的所有微任务都执行完再去进行渲染
- 微任务是由 V8 引擎控制的，在创建全局执行上下文的时候，也会在 V8 引擎内部创建一个微任务队列
- 微任务: process.nextTick（Nodejs）, Promises, Object.observe, MutationObserver

## 浏览器的 Event Loop

1. 执行全局 Script 同步代码，这些同步代码有一些是同步语句，有一些是异步语句（比如 setTimeout 等）；
2. 全局 Script 代码执行完毕后，调用栈 Stack 会清空；
3. 从微队列 microtask queue 中取出位于队首的回调任务，放入调用栈 Stack 中执行，执行完后 microtask queue 长度减 1；
4. 继续取出位于队首的任务，放入调用栈 Stack 中执行，以此类推，直到直到把 microtask queue 中的所有任务都执行完毕。**注意，如果在执行 microtask 的过程中，又产生了 microtask，那么会加入到队列的末尾，也会在这个周期被调用执行**；
5. microtask queue 中的所有任务都执行完毕，此时 microtask queue 为空队列，调用栈 Stack 也为空；
6. 取出宏队列 macrotask queue 中位于队首的任务，放入 Stack 中执行；
7. 执行完毕后，调用栈 Stack 为空；
8. 重复第 3-7 个步骤；

### promise

```js
console.log(1);
setTimeout(() => {
  console.log(5);
  Promise.resolve().then(() => {
    console.log(6);
  });
});
new Promise((resolve, reject) => {
  console.log(2);
  resolve(4);
}).then((data) => {
  console.log(data);
});
setTimeout(() => {
  console.log(7);
});
console.log(3);
1;
2;
3;
4;
5;
6;
7;
```

### async/await

如果 await 后面跟的不是一个 Promise，那 await 后面表达式的运算结果就是它等到的东西；
如果 await 后面跟的是一个 Promise 对象，await 它会“阻塞”后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值作为 await 表达式的运算结果。但是此“阻塞”非彼“阻塞”这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成“阻塞”，它内部所有的“阻塞”都被封装在一个 Promise 对象中异步执行。

```js
console.log("1");
async function async1() {
  console.log("2");
  await "await的结果";
  console.log("5");
}

async1();
console.log("3");

new Promise(function (resolve) {
  console.log("4");
  resolve();
}).then(function () {
  console.log("6");
});
//1 -> 2 -> 3 -> 4 -> 5 -> 6
```

```js
async function async1() {
  console.log("2");
  await async2();
  console.log("7");
}

async function async2() {
  console.log("3");
}

setTimeout(function () {
  console.log("8");
}, 0);

console.log("1");
async1();

new Promise(function (resolve) {
  console.log("4");
  resolve();
}).then(function () {
  console.log("6");
});
console.log("5");
//1 -> 2 -> 3 -> 4 -> 5 -> 7 -> 6 -> 8
```

### 微任务队列

微任务队列会一次性清空

```js
function loop() {
  Promise.resolve().then(loop);
}
loop();
```

微任务会先于渲染执行

```js
document.body.style = "background:red";
console.log(1);
Promise.resolve().then(() => {
  console.log(2);
  document.body.style = "background:yellow";
});
console.log(3);
```

宏任务结束之后会先执行微任务

```js
setTimeout(() => {
    console.log(1);
    Promise.resolve(3).then(data => console.log(data))
}, 0)

setTimeout(() => {
    console.log(2)
}, 0)

1 3 2

```

## Node10.xx 中的 EventLoop

Node 中的 Event Loop 和浏览器中的是完全不相同的东西。Node.js 采用 V8 作为 js 的解析引擎，而 I/O 处理方面使用了自己设计的 libuv，libuv 是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的 API，事件循环机制也是它里面的实现（下文会详细介绍）。

Node.js 的运行机制如下:

- V8 引擎解析 JavaScript 脚本。
- 解析后的代码，调用 Node API。
- libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎。
- V8 引擎再将结果返回给用户。

### 六个阶段

其中 libuv 引擎中的事件循环分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

从上图中，大致看出 node 中的事件循环的顺序：

外部输入数据–>轮询阶段(poll)–>检查阶段(check)–>关闭事件回调阶段(close callback)–>定时器检测阶段(timer)–>I/O 事件回调阶段(I/O callbacks)–>闲置阶段(idle, prepare)–>轮询阶段（按照该顺序反复运行）…

- timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
- I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
- idle, prepare 阶段：仅 node 内部使用
- poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
- check 阶段：执行 setImmediate() 的回调
- close callbacks 阶段：执行 socket 的 close 事件回调

注意：**上面六个阶段都不包括 process.nextTick()**(下文会介绍)

接下去我们详细介绍`timers`、`poll`、`check`这 3 个阶段，因为日常开发中的绝大部分异步任务都是在这 3 个阶段处理的。

**(1) timer**

timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。
同样，**在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行**。

**(2) poll**

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

- 回到 timer 阶段执行回调
- 执行 I/O 回调

并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生
    - 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
    - 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去

当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

**(3) check 阶段**

setImmediate()的回调会被加入 check 队列中，从 event loop 的阶段图可以知道，check 阶段的执行顺序在 poll 阶段之后。

我们先来看个例子:

```jsx
 console.log('start')
 setTimeout(() => {
   console.log('timer1')
   Promise.resolve().then(function() {
     console.log('promise1')
   })
 }, 0)
 setTimeout(() => {
   console.log('timer2')
   Promise.resolve().then(function() {
     console.log('promise2')
   })
 }, 0)
 Promise.resolve().then(function() {
   console.log('promise3')
 })
 console.log('end')
 //start=>end=>promise3=>timer1=>timer2=>promise1=>promise2
```

- 一开始执行栈的同步任务（这属于宏任务）执行完毕后（依次打印出 start end，并将 2 个 timer 依次放入 timer 队列）,会先去执行微任务（**这点跟浏览器端的一样**），所以打印出 promise3
- 然后进入 timers 阶段，执行 timer1 的回调函数，打印 timer1，并将 promise.then 回调放入 microtask 队列，同样的步骤执行 timer2，打印 timer2；这点跟浏览器端相差比较大，**timers 阶段有几个 setTimeout/setInterval 都会依次执行**，并不像浏览器端，每执行一个宏任务后就去执行一个微任务（关于 Node 与浏览器的 Event Loop 差异，下文还会详细介绍）。

### **3. 注意点**

**(1) setTimeout 和 setImmediate**

二者非常相似，区别主要在于调用时机不同。

- setImmediate 设计在 poll 阶段完成时执行，即 check 阶段；
- setTimeout 设计在 poll 阶段为空闲时，且设定时间到达后执行，但它在 timer 阶段执行

```jsx
 setTimeout(function timeout () {
   console.log('timeout');
 },0);
 setImmediate(function immediate () {
   console.log('immediate');
 });
```

- 对于以上代码来说，setTimeout 可能执行在前，也可能执行在后。
- 首先 setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的
进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
- 如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了

但当二者在异步 i/o callback 内部调用时，总是先执行 setImmediate，再执行 setTimeout

```jsx
 const fs = require('fs')
 fs.readFile(__filename, () => {
     setTimeout(() => {
         console.log('timeout');
     }, 0)
     setImmediate(() => {
         console.log('immediate')
     })
 })
 // immediate
 // timeout
```

在上述代码中，setImmediate 永远先执行。因为两个代码写在 IO 回调中，IO 回调是在 poll 阶段执行，当回调执行完毕后队列为空，发现存在 setImmediate 回调，所以就直接跳转到 check 阶段去执行回调了。

**(2) process.nextTick**

这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行。

```jsx
 setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
 }, 0)
 process.nextTick(() => {
  console.log('nextTick')
  process.nextTick(() => {
    console.log('nextTick')
    process.nextTick(() => {
      console.log('nextTick')
      process.nextTick(() => {
        console.log('nextTick')
      })
    })
  })
 })
 // nextTick=>nextTick=>nextTick=>nextTick=>timer1=>promise1
```

## **Node10.xx 与浏览器的 Event Loop 差异**

**浏览器环境下，microtask 的任务队列是每个 macrotask 执行完之后执行。而在 Node.js 中，microtask 会在每个 macrotask `队列`执行完，也就是一个阶段执行完毕，就会去执行 microtask 队列的任务**。

接下我们通过一个例子来说明两者区别：

```jsx
 setTimeout(()=>{
     console.log('timer1')
     Promise.resolve().then(function() {
         console.log('promise1')
     })
 }, 0)
 setTimeout(()=>{
     console.log('timer2')
     Promise.resolve().then(function() {
         console.log('promise2')
     })
 }, 0)
```

浏览器端运行结果：`timer1=>promise1=>timer2=>promise2`

浏览器端的处理过程如下：

Node 端运行结果：`timer1=>timer2=>promise1=>promise2`

- 全局脚本（main()）执行，将 2 个 timer 依次放入 timer 队列，main()执行完毕，调用栈空闲，任务队列开始执行；
- 首先进入 timers 阶段，执行 timer1 的回调函数，打印 timer1，并将 promise1.then 回调放入 microtask 队列，同样的步骤执行 timer2，打印 timer2；
- 至此，timer 阶段执行结束，event loop 进入下一个阶段之前，执行 microtask 队列的所有任务，依次打印 promise1、promise2