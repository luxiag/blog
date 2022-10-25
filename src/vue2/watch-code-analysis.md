---
title: Vue2.x watch原理分析
---

::: details watch 使用

```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5,
      },
    },
  },
  watch: {
    a: function (val, oldVal) {
      console.log("new: %s, old: %s", val, oldVal);
    },
    // 方法名
    b: "someMethod",
    // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    c: {
      handler: function (val, oldVal) {
        /* ... */
      },
      deep: true,
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: "someMethod",
      immediate: true,
    },
    // 你可以传入回调数组，它们会被逐一调用
    e: [
      "handle1",
      function handle2(val, oldVal) {
        /* ... */
      },
      {
        handler: function handle3(val, oldVal) {
          /* ... */
        },
        /* ... */
      },
    ],
    // watch vm.e.f's value: {g: 5}
    "e.f": function (val, oldVal) {
      /* ... */
    },
  },
});
```

:::

```js
watch:{
    name(newName) {...}
}

this.$watch('name',function (newName) {...})

```

## init

```js
export function initState(vm: Component) {
  const opts = vm.$options;
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    if (isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}
```

### createWatcher

```js
function createWatcher(
  vm: Component,
  expOrFn: string | (() => any), //key
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}
```

### $watch

```js
Vue.prototype.$watch = function (
  expOrFn: string | (() => any),
  cb: any,
  options?: Record<string, any>
): Function {
  const vm: Component = this;
  if (isPlainObject(cb)) {
    // 如果cb是对象
    return createWatcher(vm, expOrFn, cb, options);
  }
  options = options || {};
  //   user Watcher 标记
  options.user = true;
  // vm = vue
  //expOrFn = key
  // cb handler
  // options = {immediate?: true,deep?:true}
  const watcher = new Watcher(vm, expOrFn, cb, options);
  //  立刻执行
  if (options.immediate) {
    const info = `callback for immediate watcher "${watcher.expression}"`;
    pushTarget();
    invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
    popTarget();
  }
  //   取消监听
  return function unwatchFn() {
    watcher.teardown();
  };
};
```

::: details watcher

```js
class Watcher {
  constructor() {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.sync = !!options.sync;
    this.active = true;
    if (isFunction(expOrFn)) {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
      }
    }
    this.value = this.get();
  }
}
```

:::

匹配 vm 上的对象
::: details parsePath

```js
const bailRE = /[^\w.$]/; // 对象结构
export function parsePath(path: string): any {
  if (bailRE.test(path)) {
    return;
  }
  const segments = path.split(".");
  return function (obj) {
    // 调用的时候 obj = vm
    //  vm.a.b.c
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      //a.b.c
      // a = a[b]
      // a.b = a.b[c]
      // a.b.c
      obj = obj[segments[i]];
    }
    // 返回该数据
    return obj;
  };
}
```

:::

::: details Watcher

```js
class Watcher {
  constructor() {
    this.value = this.get();
  }
  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
        // this.getter = 上面的闭包
        // value = vm上的值
        // 触发 vm上的值 的get
        // 进行依赖收集
      value = this.getter.call(vm, vm)
    } catch (e: any) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
     //   判断是否需要深度监听
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
    //   派发更新
  run() {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        // watch 使用的Watcher
        if (this.user) {
          const info = `callback for watcher "${this.expression}"`
          invokeWithErrorHandling(
            this.cb,
            this.vm,
            [value, oldValue],
            this.vm,
            info
          )
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

}
```

:::

::: details invokeWithErrorHandling

```js
export function invokeWithErrorHandling(
  handler: Function, // watch 的函数
  context: any, // vm
  args: null | any[], // watch 函数 传入的参数
  vm: any,
  info: string
) {
  let res
  try {
    // vm.handler(args) 调用 watch的函数
    res = args ? handler.apply(context, args) : handler.call(context)
    if (res && !res._isVue && isPromise(res) && !(res as any)._handled) {
      res.catch(e => handleError(e, vm, info + ` (Promise/async)`))
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      ;(res as any)._handled = true
    }
  } catch (e: any) {
    handleError(e, vm, info)
  }
  return res
}
```

:::

## 步骤

**依赖收集**

利用响应式数据 get 时的 dep.depend();进行依赖收集

new Watcher() => this.get() pushTarget(this)赋值为当前 watcher => this.getter() = parsePath(key) 实际是取 vm 上的值 => 触发 vm 上响应式数据收集 => dep.depend() 将 Dep.target = watcher 收集起来

**派发更新**

响应式数据发生变化 => this.set() => dep.notify() = watcher.update() = watcher.run()=>invokeWithErrorHandling() =>调用 watch 的 handler 函数
