---
title: Vue2.x computed原理分析
date: 2021-09-21
category:
  - Vue
tags: ['vue2']
excerpt: 'Vue2.x computed 计算属性的实现原理分析，包括 computed watcher 的创建、缓存机制与依赖收集'
---

Vue 的 computed 计算属性是开发中最常用的特性之一，它能够自动追踪依赖并在依赖变化时重新计算，同时具有缓存能力——只有在依赖数据变化时才会重新求值，否则直接返回缓存结果。本文从源码层面分析 computed 的初始化流程、缓存机制（dirty 标志位）以及依赖收集与派发更新的完整过程。

```js
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // 仅读取
    aDouble: function () {
      return this.a * 2;
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1;
      },
      set: function (v) {
        this.a = v - 1;
      },
    },
  },
});
```

## init

computed 的初始化发生在 `initState` 阶段，在 props、methods、data 之后处理。如果组件选项中存在 computed，则调用 `initComputed` 进行初始化。

```js
export function initState(vm: Component) {
  const opts = vm.$options;
  if (opts.computed) initComputed(vm, opts.computed);
}
```

### initComputed

`initComputed` 的核心做了三件事：

1. 为每个 computed 属性创建一个 **computed watcher**（注意传入的 `computedWatcherOptions` 中 `lazy: true`，这是与渲染 watcher 的关键区别）
2. 如果 computed 的 key 没有在实例上存在，则通过 `defineComputed` 将其代理到 vm 上
3. 如果 key 已存在于 data 或 props 中，则在开发环境下发出警告

computed watcher 与普通 watcher 最大的区别在于 `lazy: true`，它意味着 watcher 不会立即执行求值，而是将 `dirty` 设为 `true`，等到实际访问该 computed 属性时才进行计算。

```js
function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  // 定义一个对象 储存 watcher
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();

  for (const key in computed) {
    const userDef = computed[key];
    const getter = isFunction(userDef) ? userDef : userDef.get;
    if (!isSSR) {
      // create internal watcher for the computed property.
      // 创建computedWatcher
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions // {lazy: true}
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      // ... key不能和data里的属性重名
      // ... key不能和props里的属性重名
    }
  }
}
```

::: details Watcher

```js
export default class Watcher implements DepTarget {
  constructor(
    vm: Component | null,
    expOrFn: string | (() => any), // computed getter函数
    cb: Function, // 空函数
    options?: WatcherOptions | null, //  {lazy: true}
    isRenderWatcher?: boolean
  ) {
    this.lazy = !!options.lazy;
    this.dirty = this.lazy;
    // computed getter 函数
    this.getter = expOrFn;
    this.value = this.lazy ? undefined : this.get();
  }
}
```

:::

::: details defineComputed

```js
//  vm
//  computed 中的key
// userDef Computed[key]
export function defineComputed(
  target: any,
  key: string,
  userDef: Record<string, any> | (() => any)
) {
  const shouldCache = !isServerRendering();
  // 定义computed的get 和set
  // 通过 defineProperty 进行拦截
  if (isFunction(userDef)) {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

:::

::: details createComputedGetter

```js
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      // 表示 依赖更变 需要重新计算 求知
      // 初始化时 this.dirty = this.lazy = true
      if (watcher.dirty) {
        watcher.evaluate();
      }
      // Dep.target 是当前操作的Watcher
      // watcher.evaluate()时 调用 this.get() 赋的值
      if (Dep.target) {
        watcher.depend();
        // 让每个dep收集当前的watcher
        // 当依赖改变时 通知watcher进行更新
      }
      return watcher.value;
    }
  };
}

// -------------------
class Watcher {
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  depend() {
    let i = this.deps.length;
    while (i--) {
      //  让每个dep收集当前的Watcher
      this.deps[i].depend();
    }
  }
  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
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
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
}
```

:::

## 步骤

### 取值

当我们在模板或代码中访问一个 computed 属性时，会触发由 `defineComputed` 设置的 getter，即 `createComputedGetter` 返回的函数。整个取值流程如下：

对 computed 进行求值时触发 get()=>createComputedGetter() => Watcher.get() => 将 Dep.target 设置为当前 watcher => 进行 computed getter()求值 => 触发 computed getter()中的响应式数据中的 get()拦截器 => get()拦截器 把当前的 computed watcher 添加到 自己的 Dep 中 => 最后 Dep.target 重置

### 更新

当 computed 依赖的响应式数据发生变化时，会触发以下更新链路：

computed set 内的响应式式数据发生更新 => 响应式式数据 set()拦截器触发 => dep.notify() dep 通知更新 => subs[i].update() Dep 内收集的 Watcher.update() => watcher.run() => this.get() => computed getter() => watcher value 更新 => 响应式数据更新发生 patch => 视图更新
