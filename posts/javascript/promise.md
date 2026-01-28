---
title: Promise实现
category:
  - JavaScript
date: 2020-10-16
---

| **参考**                                                                     |
| ---------------------------------------------------------------------------- |
| **[100 行代码实现 Promises/A+ 规范](https://zhuanlan.zhihu.com/p/83965949)** |
| **[Promises/A+](https://promisesaplus.com/)**                                |

## **0.前期工作**

通过 `npm install promises-aplus-tests` ，可以下载测试套件。

**[GitHub - promises-aplus/promises-tests: Compliances tests for Promises/A+](https://github.com/promises-aplus/promises-tests)**

## **1.术语**

1.1. promise: 一个拥有符合这个规范的行为的 then 方法的对象或函数。
1.2. thenable: 定义了一个 then 方法的对象或函数。
1.3. 值(value): 任意合法的 JavaScript 值(包括 undefined,thenable,promise)。
1.4. 异常(exception): 使用 throw 语句抛出的一个值
1.5. 原因(reason): 表示 promise 为什么被拒绝的一个值

## **2.必要条件**

### **2.1 Promise 状态**

promise 必须是这三个状态中的一种：等待态 pending/ˈpendɪŋ/,解决态 fulfilled/fʊl; fl/或拒绝态 rejected

2.1.1. 当一个 promise 处于等待状态的时候：
2.1.1.1. 可能变为解决或者拒绝状态。

2.1.2. 当一个 promise 处于解决状态的时候：
2.1.2.1. 一定不能转换为任何其它状态
2.1.2.2. 必须有一个不能改变的值

2.1.3. 当一个 promise 处于拒绝状态的时候：
2.1.3.1. 一定不能转换为任何其它状态
2.1.3.2. 必须有一个不能改变的值

在这里，"一定不能改变"意味着不变的身份(例如 ===)，但是并不意味着深度不可变性。(译注者：这里应该是说只要值的引用相同即可，并不需要引用中的每一个值都相等)

```jsx
//有 3 个常量 pending, fulfilled, rejected，
//一个 Promise 构造函数，有 state 和 result 两个属性。
//当 state 为 fulfilled 时，result 作为 value 看待。
//当 state 为 rejected 时，result 作为 reason 看待。
//一个 transition 状态迁移函数，它只会在 state 为 pending 时，进行状态迁移。
const PENDING = Symbol("pending");
const FULFILLED = Symbol("fulfilled");
const REJECTED = Symbol("rejected"); //一个 transition 状态迁移函数，它只会在 state 为 pending 时，进行状态迁移。

const transition = (promise, state, result) => {
  if (promise.state !== PENDING) return;
  promise.state = state;
  promise.result = result;
  notifyAll(promise);
};
function Promise(f) {
  this.state = PENDING;
  let onFulfilled = (value) => transition(this, FULFILLED, value);
  let onRejected = (reason) => transition(this, REJECTED, reason);
  //调用只能一次resolve 或者reject
  let ignore = false;

  let resolve = (value) => {
    if (ignore) return;
    ignore = true;
    onFullfilled(value);
  };
  let reject = (reason) => {
    if (ignore) return;
    ignore = true;
    onRejected(reason);
  };
  //函数必须立即执行
  try {
    f(resolve, reject);
  } catch (error) {
    reject(error);
  }
}
```

### **2.2 Then 方法**

2.2.1 onFulfilled 和 onRejected 都是可选的参数

2.2.1.1. 如果 onFulfilled 不是一个函数，它必须被忽略

2.2.1.2. 如果 onRejected 不是一个函数，它必须被忽略

2.2.2. 如果 onFulfilled 是一个函数

2.2.2.1. 它必须在 promise 被解决后调用，promise 的值作为它的第一个参数。

2.2.2.2. 它一定不能在 promise 被解决前调用。

2.2.2.3. 它一定不能被调用多次。

2.2.3. 如果 onRejected 是一个函数

2.2.3.1. 它必须在 promise 被拒绝之后调用，用 promise 的原因作为它的第一个参数。

2.2.3.2. 它一定不能在 promise 被拒绝之前调用。

2.2.3.3. 它一定不能被调用多次。

2.2.4. 在执行上下文栈中只包含平台代码之前，onFulfilled 或 onRejected 一定不能被调用 [3.1]

2.2.5. onFulfilled 和 onRejected 一定被作为函数调用(没有 this 值) [3.2]

2.2.6. 同一个 promise 上的 then 可能被调用多次

2.2.6.1. 如果 promise 被解决，所有相应的 onFulfilled 回调必须按照他们原始调用 then 的顺序执行

2.2.6.2. 如果 promise 被拒绝，所有相应的 onRejected 回调必须按照他们原始调用 then 的顺序执行

**实现：**

```jsx
Promise.prototype.then = function (onFulfilled, onRejected) {};

const notify = (handler, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = handler;
  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result);
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result);
    }
  } catch (error) {
    reject(error);
  }
};
```

**then 方法可以被调用很多次，每次注册一组 onFulfilled 和 onRejected 的 callback。它们如果被调用，必须按照注册顺序调用。**

```jsx
let promise = new Promsie((resolve, reject) => {
  //3秒后才能知道promsie结果
  setTimeout(() => {
    resolve("成功");
  }, 3000);
});
promise.then(
  (data) => {
    console.log("success", data);
  },
  (err) => {
    console.log("fail", err);
  }
);
```

```jsx
function Promsie() {
  this.state = PENDING;
  this.result = null; //当pending状态时，将then存储起来
  this.handlers = [];
}
```

2.2.7. then 必须返回一个 promise [3.3]

```jsx
Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {});
};
```

2.2.7.1. 如果 onFulfilled 或 onRjected 返回一个值 x，运行 promise 解决程序`[[Resolve]](promise2,x)`

2.2.7.2. 如果 onFulfilled 或 onRejected 抛出一个异常 e，promise2 必须用 e 作为原因被拒绝

2.2.7.3. 如果 onFulfilled 不是一个函数并且 promise1 被解决，promise2 必须用与 promise1 相同的值被解决

2.2.7.4. 如果 onRejected 不是一个函数并且 promise1 被拒绝，promise2 必须用与 promise1 相同的原因被拒绝

**实现：**

```jsx
Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    this.handlers.push({ onFulfilled, onRejected, resolve, reject });
    this.state !== PENDING && notifyAll(this);
  });
};
const delay =
  (f, time = 0) =>
  (value) =>
    setTimeout(() => f(value), time); //使用setTimeout包裹目的无法访问 在对此创建完毕之前无法访问this

const notifyAll = delay((promise) => {
  let { handlers, state, result } = promise;
  while (handlers.length) notify(handlers.shift(), state, result);
});
// 另一种写法
const notifyAll = (promise) => {
  setTimeout(() => {
    let { handlers, state, result } = promise;
    while (handlers.length) notify(handlers.shift(), state, result);
  }, 0);
};
const notify = (handler, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = handler;
  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result);
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result);
    }
  } catch (error) {
    reject(error);
  }
};
```

### **2.3 Promise 解决程序**

promise 解决程序是一个抽象操作，它以一个 promise 和一个值作为输入，我们将其表示为`[[Resolve]](promise, x)`。如果 x 是一个 thenable，它尝试让 promise 采用 x 的状态，并假设 x 的行为至少在某种程度上类似于 promise。否则，它将会用值 x 解决 promise。

这种 thenable 的特性使得 Promise 的实现更具有通用性：只要其暴露一个遵循 Promise/A+协议的 then 方法即可。这同时也使遵循 Promise/A+规范的实现可以与那些不太规范但可用的实现能良好共存。

要运行`[[Resolve]](promise, x)`，需要执行如下步骤：

2.3.1. 如果 promise 和 x 引用同一个对象，用一个 TypeError 作为原因来拒绝 promise
2.3.2. 如果 x 是一个 promise，采用它的状态：[3.4]

2.3.2.1. 如果 x 是等待态，promise 必须保持等待状态，直到 x 被解决或拒绝

2.3.2.2. 如果 x 是解决态，用相同的值解决 promise

2.3.2.3. 如果 x 是拒绝态，用相同的原因拒绝 promise

2.3.3. 否则，如果 x 是一个对象或函数

2.3.3.1. 让 then 成为 x.then。[3.5]

2.3.3.2. 如果检索属性 x.then 导致抛出了一个异常 e，用 e 作为原因拒绝 promise

2.3.3.3. 如果 then 是一个函数，用 x 作为 this 调用它。then 方法的参数为俩个回调函数，第一个参数叫做 resolvePromise，第二个参数叫做 rejectPromise：

2.3.3.3.1. 如果 resolvePromise 用一个值 y 调用，运行**[[Resolve]](notion://www.notion.so/promise,%20y)**。译者注：这里再次调用**[[Resolve]](notion://www.notion.so/promise,y)**，因为 y 可能还是 promise

2.3.3.3.2. 如果 rejectPromise 用一个原因 r 调用，用 r 拒绝 promise。译者注：这里如果 r 为 promise 的话，依旧会直接 reject，拒绝的原因就是 promise。并不会等到 promise 被解决或拒绝

2.3.3.3.3. 如果 resolvePromise 和 rejectPromise 都被调用，或者对同一个参数进行多次调用，那么第一次调用优先，以后的调用都会被忽略。译者注：这里主要针对 thenable，promise 的状态一旦更改就不会再改变。

2.3.3.3.4. 如果调用 then 抛出了一个异常 e,

2.3.3.4.1. 如果 resolvePromise 或 rejectPromise 已经被调用，忽略它

2.3.3.4.2. 否则，用 e 作为原因拒绝 promise

2.3.3.4. 如果 then 不是一个函数，用 x 解决 promise

2.3.4. 如果 x 不是一个对象或函数，用 x 解决 promise

如果 promise 用一个循环的 thenable 链解决，由于`[[Resolve]](promise, thenalbe)`的递归特性，最终将导致`[[Resolve]](promise, thenable)`被再次调用，遵循上面的算法将会导致无限递归。规范中并没有强制要求处理这种情况，但也鼓励实现者检测这样的递归是否存在，并且用一个信息丰富的 TypeError 作为原因拒绝 promise。[3.6]

**实现：**

```jsx
const checkValue = (promise, value, onFulfilled, onRejected) => {
  if (value === promise) {
    let reason = new TypeError("Can not fufill promise with itself");
    return onRejected(reason);
  }
  if (value instanceof Promise) {
    return value.then(onFulfilled, onRejected);
  }
  if (isThenable(value)) {
    try {
      let then = value.then;
      if (isFunction(then)) {
        return new Promise(then.bind(value)).then(onFulfilled, onRejected);
      }
    } catch (error) {
      return onRejected(error);
    }
  }
  onFulfilled(value);
};
```

## function-promise

::: details function-promise

```js
const delay =
  (f, time = 0) =>
  (value) =>
    setTimeout(() => f(value), time);
const isFunction = (obj) => typeof obj === "function";
const toString = Object.prototype.toString;
const isObject = (obj) => toString.call(obj) === "[object Object]";
const isThenable = (obj) => (isObject(obj) || isFunction(obj)) && "then" in obj;
const isPromise = (promise) => promise instanceof Promise;

const PENDING = Symbol("pending");
const FULFILLED = Symbol("fulfilled");
const REJECTED = Symbol("rejected");

const notify = (handler, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = handler;
  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result);
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result);
    }
  } catch (error) {
    reject(error);
  }
};
const notifyAll = (promise) => {
  setTimeout(() => {
    let { handlers, state, result } = promise;
    while (handlers.length) notify(handlers.shift(), state, result);
  }, 0);
};
// const notifyAll = delay((promise) => {
//   let { handlers, state, result } = promise;
//   while (handlers.length) notify(handlers.shift(), state, result);
// });

const transition = (promise, state, result) => {
  if (promise.state !== PENDING) return;
  promise.state = state;
  promise.result = result;
  notifyAll(promise);
};

const checkValue = (promise, value, onFulfilled, onRejected) => {
  //如果promise和x引用同一个对象，用一个TypeError作为原因来拒绝promise
  if (value === promise) {
    let reason = new TypeError("Can not fufill promise with itself");
    return onRejected(reason);
  }
  if (value instanceof Promise) {
    return value.then(onFulfilled, onRejected);
  }

  if (isThenable(value)) {
    try {
      let then = value.then;
      if (isFunction(then)) {
        // 如果then是一个函数，用x作为this调用它。
        return new Promise(then.bind(value)).then(onFulfilled, onRejected);
      }
    } catch (error) {
      return onRejected(error);
    }
  }
  onFulfilled(value);
};

function Promise(f) {
  this.state = PENDING;
  this.handlers = [];
  let onFulfilled = (value) => transition(this, FULFILLED, value);
  let onRejected = (reason) => transition(this, REJECTED, reason);
  let ignore = false;
  let resolve = (value) => {
    if (ignore) return;
    ignore = true;
    checkValue(this, value, onFulfilled, onRejected);
  };
  let reject = (reason) => {
    if (ignore) return;
    ignore = true;
    onRejected(reason);
  };
  try {
    f(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    this.handlers.push({ onFulfilled, onRejected, resolve, reject });
    this.state !== PENDING && notifyAll(this);
  });
};

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.finally = function (onFinally) {
  return this.then(
    /* onFulfilled */
    (res) => Promise.resolve(onFinally()).then(() => res),
    /* onRejected */
    (err) =>
      Promise.resolve(onFinally()).then(() => {
        throw err;
      })
  );
};

Promise.resolve = (value) => new Promise((resolve) => resolve(value));
Promise.reject = (reason) => new Promise((_, reject) => reject(reason));

Promise.all = (promises = []) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    let values = new Array(promises.length);
    let collectValue = (index) => (value) => {
      values[index] = value;
      count += 1;
      count === promises.length && resolve(values);
    };
    promises.forEach((promise, i) => {
      if (isPromise(promise)) {
        promise.then(collectValue(i), reject);
      } else {
        collectValue(i)(promise);
      }
    });
  });
};
Promise.race = (promises = []) => {
  return new Promise((resolve, reject) =>
    promises.forEach((promise) => {
      if (isPromise(promise)) {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    })
  );
};

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
```

:::
