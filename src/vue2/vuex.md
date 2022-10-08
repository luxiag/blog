---
title: vuex
category:
  - vue2
---

![](./images/20221008144724.png)

::: details vuex 使用

`main.js`

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit("increment");
    },
  },
});

new Vue({
  store,
  // ...
});
```

:::

## Vue.use 安装

::: details install

```js
export function install(_Vue) {
  if (Vue && _Vue === Vue) {
    if (__DEV__) {
      console.error(
        "[vuex] already installed. Vue.use(Vuex) should be called only once."
      );
    }
    return;
  }
  Vue = _Vue;
  applyMixin(Vue);
}
```

:::

`applyMixin`通过全局 mixin 将$store 混入到所有 vue 组件中
::: details applyMixin

```js
export default function (Vue) {
  const version = Number(Vue.version.split(".")[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // 处理 vue 1.x的代码
    // 。。。
  }

  function vuexInit() {
    const options = this.$options;
    // store injection
    if (options.store) {
      this.$store =
        typeof options.store === "function" ? options.store() : options.store;
    } else if (options.parent && options.parent.$store) {
      // 子组件从其父组件引用$store属性，层层嵌套进行设置
      this.$store = options.parent.$store;
    }
  }
}
```

:::

## Store 类

::: details class Store

```js
// 定义局部 Vue 变量，用于判断是否已经装载和减少全局作用域查找。
let Vue; // bind on install
export class Store {
  /*
     options =>  new Vuex.store(options)
     {state,getter,mutation,action}
    */
  constructor(options = {}) {
    // 若处于浏览器环境下且加载过Vue，则执行install方法。
    if (!Vue && typeof window !== "undefined" && window.Vue) {
      install(window.Vue);
    }
    // 用于判断是否 mutation 更改的state
    this._committing = false;
    //  action操作对象
    this._actions = Object.create(null);
    // 存放 action订阅
    this._actionSubscribers = [];
    // mutations操作对象
    this._mutations = Object.create(null);
    //  getter 操作对象
    this._wrappedGetters = Object.create(null);
    // 存放 modules 构建module树
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = Object.create(null);
    // 收集订阅者
    // https://v3.vuex.vuejs.org/zh/api/#watch
    this._subscribers = [];
    // Vue组件用于watch监视变化
    this._watcherVM = new Vue();
    this._makeLocalGettersCache = Object.create(null);

    const store = this;
    const { dispatch, commit } = this;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload);
    };
    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options);
    };

    // strict mode
    this.strict = strict;

    // 获取 state
    const state = this._modules.root.state;

    // 安装 module
    installModule(this, state, [], this._modules.root);

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreVM(this, state);

    // apply plugins
    plugins.forEach((plugin) => plugin(this));

    const useDevtools =
      options.devtools !== undefined ? options.devtools : Vue.config.devtools;
    if (useDevtools) {
      devtoolPlugin(this);
    }
  }
}
```

:::

## dispatch

```js
this.dispatch = function boundDispatch(type, payload) {
  return dispatch.call(store, type, payload);
};
// type action中的方法
// payload 传递给action的参数
store.dispatch("increment", 10);
```

::: details dispatch

```js

  dispatch (_type, _payload) {
    // check object-style dispatch
    const {
      type,
      payload
    } = unifyObjectStyle(_type, _payload)

    const action = { type, payload }
    // 获取 当前 type下所有action处理函数的集合
    const entry = this._actions[type]
    this._actionSubscribers
        .slice()
        .filter(sub => sub.before)
        .forEach(sub => sub.before(action, this.state))


    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    return new Promise((resolve, reject) => {
      result.then(res => {

          this._actionSubscribers
            .filter(sub => sub.after)
            .forEach(sub => sub.after(action, this.state))

        resolve(res)
      })
    })
  }
```

:::

## commit

```js
this.commit = function boundCommit(type, payload, options) {
  return commit.call(store, type, payload, options);
};
//  type mutations中的 type

store.commit("increment");
```

::: details commit

```js
commit (_type, _payload, _options) {
    // check object-style commit
    const {
      type,
      payload,
      options
    } = unifyObjectStyle(_type, _payload, _options)

    const mutation = { type, payload }
    const entry = this._mutations[type]
    // 专用修改state方法，其他修改state方法均是非法修改
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })
    // 订阅者函数遍历执行，传入当前的mutation对象和当前的state
    this._subscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .forEach(sub => sub(mutation, this.state))
  }

_withCommit (fn) {
     // 保存之前的提交状态
    const committing = this._committing
    // 进行本次提交，若不设置为true，直接修改state，strict模式下，Vuex将会产生非法修改state的警告
    this._committing = true
     // 执行state的修改操作
    fn()
    this._committing = committing
  }
```

:::

## module 安装

```js
this._modules = new ModuleCollection(options);
// 获取 state
const state = this._modules.root.state;

// 安装 module
installModule(this, state, [], this._modules.root);
```

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

::: details ModuleCollection

```js
export default class ModuleCollection {
  constructor(rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false);
  }
  register(path, rawModule, runtime = true) {
    const newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      const parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime);
      });
    }
  }
}
```

:::

::: details installModule

:::
