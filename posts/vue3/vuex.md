---
title: Vuex 4 原理
date: 2024-11-01
category:
  - Vue
tag: 
  - Vuex
---

```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

// Create a new store instance.
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

// Install the store instance as a plugin
app.use(store)

```
# createStore
```js
export function createStore (options) {
  return new Store(options)
}

export class Store {
    constructor (options = {}) {
      // ...
      this._modules = new ModuleCollection(options)
      const state = this._modules.root.state
      resetStoreState(this, state)

    }
  // ...
    install (app, injectKey) {
    // export const storeKey = 'store'
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
  // ...
}

```

## `app.use`

```js
// 执行install方法,将vue实例作为参数传入
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

## `provide`
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
    // Object.create() 静态方法以一个现有对象作为原型，创建一个新对象。
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  }
}

```

```js
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null,
): ComponentInternalInstance { 

  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext
  // ...

  const instance: ComponentInternalInstance = { 
    // ...
      provides: parent ? parent.provides : Object.create(appContext.provides),
  }
  // ...
  instance.root = parent ? parent.root : instance
  instance.emit = emit.bind(null, instance)

  // apply custom element special handling
  if (vnode.ce) {
    vnode.ce(instance)
  }

  return instance
}

```

# useStore

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // access a state in computed function
      count: computed(() => store.state.count),

      // access a getter in computed function
      double: computed(() => store.getters.double)
    }
  }
}

```
## inject
```js
import { inject } from 'vue'

export const storeKey = 'store'

export function useStore (key = null) {
  return inject(key !== null ? key : storeKey)
}

```

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
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const instance = currentInstance || currentRenderingInstance

  // also support looking up from app-level provides w/ `app.runWithContext()`
  if (instance || currentApp) {
    // #2400
    // to support `app.use` plugins,
    // fallback to appContext's `provides` if the instance is at root
    // #11488, in a nested createApp, prioritize using the provides from currentApp
    //// 如果instance位于根目录下，则返回到appContext的provides，否则就返回父组件的provides
    const provides = currentApp
      ? currentApp._context.provides
      : instance
        ? instance.parent == null
          ? instance.vnode.appContext && instance.vnode.appContext.provides
          : instance.parent.provides
        : undefined

    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type
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
