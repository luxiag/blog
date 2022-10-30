---
title: Vue2.x computed原理分析
date: 2021-09-21
category:
  - vue2
---

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

```js
export function initState(vm: Component) {
  const opts = vm.$options;
  if (opts.computed) initComputed(vm, opts.computed);
}
```

### initComputed

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

对 computed 进行求值时触发 get()=>createComputedGetter() => Watcher.get() => 将 Dep.target 设置为当前 watcher => 进行 computed getter()求值 => 触发 computed getter()中的响应式数据中的 get()拦截器 => get()拦截器 把当前的 computed watcher 添加到 自己的 Dep 中 => 最后 Dep.target 重置

### 更新

computed set 内的响应式式数据发生更新 => 响应式式数据 set()拦截器触发 => dep.notify() dep 通知更新 => subs[i].update() Dep 内收集的 Watcher.update() => watcher.run() => this.get() => computed getter() => watcher value 更新 => 响应式数据更新发生 patch => 视图更新
