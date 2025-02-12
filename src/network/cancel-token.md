---
title: Axios取消请求 
category:
  - NetWork
tag:
  - Axios
date: 2025-01-30  
---

# AbortController

Axios 支持以 fetch API 方式—— AbortController 取消请求：

```ts
let controller = new AbortController();
let signal = controller.signal;

// 执行可取消操作部分
// 获取 "signal" 对象，
// 并将监听器设置为在 controller.abort() 被调用时触发
signal.addEventListener('abort', () => alert("abort!"));

// 另一部分，取消（在之后的任何时候）：
controller.abort(); // 中止！

// 事件触发，signal.aborted 变为 true
alert(signal.aborted); // true
```

fetch使用

```ts
// 1 秒后中止
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/article/fetch-abort/demo/hang', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') { // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

axios使用

```js
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {
   //...
});
// 取消请求
controller.abort()
```

# Cancel Token

**单个请求**

```js
const CancelToken = axios.CancelToken; 
let cancel; 
axios.get('/user/12345', {   
    cancelToken: new CancelToken(function executor(c) {     
    // executor 函数接收一个 cancel 函数作为参数     
    cancel = c;   
    })
});  
cancel();//取消
```

**多个请求**

```js
const CancelToken = axios.CancelToken; 
const source = CancelToken.source();  
axios.get('/user/12345', {   
    cancelToken: source.token 
}).catch(function(thrown) {   
    if (axios.isCancel(thrown)) {     
    console.log('Request canceled', thrown.message);   
    } else {     
      // 处理错误  
    } 
});
axios.get('/user/123456', {   
    cancelToken: source.token 
})

axios.post('/user/12345', {   
 name: 'new name' 
}, {   
 cancelToken: source.token 
})  
 // 取消请求（message 参数是可选的） 
source.cancel('Operation canceled by the user.');
```

## 原理

::: detail CancelToken

```ts
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

```

:::

### `CancelToken.source`

```ts
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

```

`cancel = c = function cancel(){}`

```ts
class CancelToken {
  constructor(executor) {
    // 将 promise的内部方法resolve赋值给resolvePromise
    // 在外部更改状态
    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }
}
```

### XHRAdapter

```ts
if (_config.cancelToken || _config.signal) {
  // Handle cancellation
  // eslint-disable-next-line func-names
  onCanceled = cancel => {
    if (!request) {
      return;
    }
    reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
    request.abort();
    request = null;
  }
  _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
  if (_config.signal) {
    _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
  }
}
```

### 中断请求

```ts
const source = CancelToken.source();  
 // 取消请求（message 参数是可选的） 
source.cancel('Operation canceled by the user.');

// source.cancel 
function cancel(message, config, request) {
  if (token.reason) {
    // Cancellation has already been requested
    return;
  }
  token.reason = new CanceledError(message, config, request);
  resolvePromise(token.reason);
}
```

### resolvePromise

```ts
this.promise = new Promise(function promiseExecutor(resolve) {
  resolvePromise = resolve;
});
this.promise.then = onfulfilled => {
  let _resolve;
  // eslint-disable-next-line func-names
  const promise = new Promise(resolve => {
    token.subscribe(resolve);
    _resolve = resolve;
  }).then(onfulfilled)
  promise.cancel = function reject() {
    token.unsubscribe(_resolve);
  }
  return promise;
};
 ```

暴露 promise中的resolve,调用中断执行resolve=> 执行`.then` => 执行`xhr.abort()`

通过发布订阅模式实现的,将axios.CancelToken构造器的实例通过cancelToken传入,就会调用实例上的subscribe方法订阅取消消息,再根据需求执行cancel方法触发订阅器取消请求。

### FetchAdapter

```ts
let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

new Request(url,{
  signal: composedSignal,
  // ...
})

// ...
  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

```

### composeSignals

```ts
const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
      }
    }

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT))
    }, timeout)

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    }

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils.asap(unsubscribe);

    return signal;
  }
}
```
