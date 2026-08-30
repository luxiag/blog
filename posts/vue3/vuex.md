---
title: Vuex 4 原理
date: 2024-11-01
category: Vue
tags:
  - Vuex
excerpt: 深入 Vuex 4 源码，剖析 createStore 创建 store、app.use 注册插件、provide/inject 跨组件传递 store 的完整链路。
nextPost: vue3/vue3-and-vue2
---

本文从源码层面梳理 Vuex 4 的核心流程：`createStore` 如何构建 store 实例，`app.use` 如何触发插件的 `install` 方法，`provide/inject` 如何让任意层级的组件都能访问 store。理解这条链路，就能掌握 Vuex 4 在 Vue 3 中"从注册到使用"的完整机制。

# createStore

首先来看 Vuex 4 的典型用法。通过 `createStore` 创建一个 store 实例，然后通过 `app.use` 将其注册到应用中：

```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* your root component */ })

app.use(store)
```

接下来深入 `createStore` 的实现。它本质上是一个工厂函数，内部实例化 `Store` 类。`Store` 构造函数中最关键的两步是：收集模块（`ModuleCollection`）和将状态变为响应式（`resetStoreState`）。而 `install` 方法则负责将 store 实例通过 `provide` 注入到应用中，同时挂载到 `globalProperties.$store` 上，以兼容 Options API 的 `this.$store` 写法。

```js
export function createStore (options) {
  return new Store(options)
}

export class Store {
    constructor (options = {}) {
      this._modules = new ModuleCollection(options)
      const state = this._modules.root.state
      resetStoreState(this, state)
    }
    install (app, injectKey) {
    app.provide(injectKey || storeKey, this)
    app.config.globalProperties.$store = this

    const useDevtools = this._devtools !== undefined
      ? this._devtools
      : __DEV__ || __VUE_PROD_DEVTOOLS__

    if (useDevtools) {
      addDevtools(app, this)
    }
  }
}

function resetStoreState (store, state) {
  store._state = reactive({
    data: state
  })
}
```

上面代码的要点：构造函数通过 `ModuleCollection` 将传入的 options 解析为模块树，然后调用 `resetStoreState` 用 `reactive` 包裹根状态使其成为响应式对象；`install` 方法通过 `app.provide` 以 `storeKey` 为 key 注入 store 实例，同时将其挂到 `globalProperties.$store`，这样 Options API 组件可以直接用 `this.$store` 访问。

## `app.use`

`app.use(store)` 是整个注册流程的入口。Vue 3 的 `use` 方法会检测插件是否拥有 `install` 方法，如果有则调用 `plugin.install(app, ...options)`。这正是 Vuex 的 `Store.install` 被执行的契机。

```js
use(plugin: Plugin, ...options: any[]) {
  if (installedPlugins.has(plugin)) {
    __DEV__ && warn(`Plugin has already been applied to target app.`)
  } else if (plugin && isFunction(plugin.install)) {
    installedPlugins.add(plugin)
    plugin.install(app, ...options)
  } else if (isFunction(plugin)) {
    installedPlugins.add(plugin)
    plugin(app, ...options)
  } else if (__DEV__) {
    warn(
      `A plugin must either be a function or an object with an "install" ` +
        `function.`,
    )
  }
  return app
}
```

关键点：`use` 方法会将已注册的插件缓存到 `installedPlugins` 中防止重复注册；插件可以是带 `install` 方法的对象，也可以是直接作为函数调用的函数。Vuex 的 `Store` 类实现了 `install` 方法，因此走的是第一个分支。

## `provide`

`install` 方法中调用了 `app.provide(storeKey, this)`，这行代码将 store 实例存入应用上下文的 `provides` 对象。来看 `provide` 的实现：

```js
export function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>,
  hydrate?: RootHydrateFunction,
): CreateAppFunction<HostElement> {
      const context = createAppContext()
      provide(key, value) {
        context.provides[key as string | symbol] = value
        return app
      }
}
export function createAppContext(): AppContext {
  return {
    app: null as any,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: undefined,
      warnHandler: undefined,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  }
}
```

`provide` 的逻辑很简单：将 key-value 写入 `context.provides` 对象。`createAppContext` 初始化时用 `Object.create(null)` 创建一个干净的无原型对象作为 `provides`，避免与 `Object.prototype` 上的属性冲突。

那么子组件如何拿到这个 `provides` 呢？在创建组件实例时，每个组件的 `provides` 会指向父组件的 `provides`（如果不是根组件）或以应用上下文的 `provides` 为原型创建新对象：

```js
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null,
): ComponentInternalInstance {

  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext

  const instance: ComponentInternalInstance = {
      provides: parent ? parent.provides : Object.create(appContext.provides),
  }

  instance.root = parent ? parent.root : instance
  instance.emit = emit.bind(null, instance)

  if (vnode.ce) {
    vnode.ce(instance)
  }

  return instance
}
```

这里的核心设计是原型链：根组件的 `provides` 以 `appContext.provides` 为原型，子组件的 `provides` 直接引用父组件的 `provides`。这意味着 store 实例通过 `app.provide` 注入后，所有组件都能通过原型链访问到它。

# useStore

在组件中使用 store 时，我们通过 `useStore()` 获取 store 实例，配合 `computed` 保持响应式：

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      count: computed(() => store.state.count),
      double: computed(() => store.getters.double)
    }
  }
}
```

## inject

`useStore` 的实现极其简洁——它就是 `inject` 的封装，用 `storeKey` 作为注入 key 去查找：

```js
import { inject } from 'vue'

export const storeKey = 'store'

export function useStore (key = null) {
  return inject(key !== null ? key : storeKey)
}
```

那么 `inject` 是如何沿着原型链找到 store 的呢？来看它的源码：

```js
export function inject<T>(key: InjectionKey<T> | string): T | undefined
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T,
  treatDefaultAsFactory?: false,
): T
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T | (() => T),
  treatDefaultAsFactory: true,
): T
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false,
) {
  const instance = currentInstance || currentRenderingInstance

  if (instance || currentApp) {
    const provides = currentApp
      ? currentApp._context.provides
      : instance
        ? instance.parent == null
          ? instance.vnode.appContext && instance.vnode.appContext.provides
          : instance.parent.provides
        : undefined

    if (provides && (key as string | symbol) in provides) {
      return provides[key as string]
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance && instance.proxy)
        : defaultValue
    } else if (__DEV__) {
      warn(`injection "${String(key)}" not found.`)
    }
  } else if (__DEV__) {
    warn(`inject() can only be used inside setup() or functional components.`)
  }
}
```

`inject` 的查找策略：如果存在 `currentApp`，直接从 `currentApp._context.provides` 中查找；否则根据组件层级，根组件从 `appContext.provides` 查找，子组件从父组件的 `provides` 查找。由于原型链的存在，只要在应用级别 `provide` 了 store，任意层级的组件都能通过 `inject` 拿到同一个 store 实例。

# 总结

Vuex 4 的完整数据流可以概括为以下链路：

1. **`createStore`**：构建 `Store` 实例，收集模块树，用 `reactive` 包裹根状态使其响应式。
2. **`app.use(store)`**：触发 `Store.install`，执行 `app.provide(storeKey, store)` 将 store 注入应用上下文，同时挂载到 `globalProperties.$store`。
3. **`provide`**：将 store 实例存入 `appContext.provides`，组件实例通过原型链继承该 `provides` 对象。
4. **`useStore`**：封装 `inject(storeKey)`，在组件 `setup` 中取出 store 实例。
5. **`inject`**：沿组件层级向上查找 `provides`，最终在应用上下文中找到 store 实例并返回。

整条链路的本质是 Vue 3 的 `provide/inject` 机制加上 `reactive` 响应式系统，Vuex 4 只是利用了这两个原语来完成全局状态管理。
