---
title: Vuex 3.x 框架原理分析
date: 2021-09-11
category:
  - vue2
---

![](./images/1680123401008144724.png)

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
  //  this = Vue实例
  // options.store
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

resetStoreVM(this, state);
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

收集模块构造模块树

::: details ModuleCollection

```js
export default class ModuleCollection {
  // rawRootModule = options
  constructor(rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false);
  }

  get(path) {
    //  this.root 为默认值
    return path.reduce((module, key) => {
      return module.getChild(key);
    }, this.root);
  }
  register(path, rawModule, runtime = true) {
    const newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      // 将root module 赋值给 root
      //  this.root.state = options.state
      this.root = newModule;
    } else {
      // -1 表示最后一个元素 (不包含最后一个元素)
      // 浅拷贝 path
      // 获取 父module
      const parent = this.get(path.slice(0, -1));
      //  将循环注册的子模块 添加到父模块的 _children对象中
      parent.addChild(path[path.length - 1], newModule);
    }

    // register nested modules
    // 注册子模块
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime);
      });
    }
  }
}
```

```js
export default class Module {
  constructor(rawModule, runtime) {
    this.runtime = runtime;
    // Store some children item
    this._children = Object.create(null);
    // Store the origin module object which passed by programmer
    this._rawModule = rawModule;
    const rawState = rawModule.state;

    // Store the origin module's state
    this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
  }
  getChild(key) {
    return this._children[key];
  }
  addChild(key, module) {
    this._children[key] = module;
  }
}
```

:::

module 安装，注册对应的 state,mutations,actions,getters
::: details installModule

```js
//
function installModule(store, rootState, path, module, hot) {
  const isRoot = !path.length;
  const namespace = store._modules.getNamespace(path);

  // register in namespace map
  // 注册命名空间
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && __DEV__) {
      console.error(
        `[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join(
          "/"
        )}`
      );
    }
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  // 不是跟主机设置 state方法
  // this.$store.a.state.stateA
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1));
    const moduleName = path[path.length - 1];
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  const local = (module.context = makeLocalContext(store, namespace, path));
  // 注册对应模块的mutation，供state修改使用
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });
  //
  function registerMutation(store, type, handler, local) {
    const entry = store._mutations[type] || (store._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store, local.state, payload);
    });
  }
  // 注册对应模块的action，供数据操作、提交mutation等异步操作使用
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key;
    const handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  function registerAction(store, type, handler, local) {
    const entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler(payload) {
      let res = handler.call(
        store,
        {
          dispatch: local.dispatch,
          commit: local.commit,
          getters: local.getters,
          state: local.state,
          rootGetters: store.getters,
          rootState: store.state,
        },
        payload
      );
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store._devtoolHook) {
        return res.catch((err) => {
          store._devtoolHook.emit("vuex:error", err);
          throw err;
        });
      } else {
        return res;
      }
    });
  }
  // 注册对应模块的getters，供state读取使用
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });
  function registerGetter(store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
      return;
    }
    store._wrappedGetters[type] = function wrappedGetter(store) {
      return rawGetter(
        local.state, // local state
        local.getters, // local getters
        store.state, // root state
        store.getters // root getters
      );
    };
  }
  // 遍历子module 安装
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}
```

:::
store 组件初始化
::: details resetStoreVM

```js
function resetStoreVM(store, state, hot) {
  const oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null);
  const wrappedGetters = store._wrappedGetters;
  const computed = {};
  // 选好遍历所有getter
  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = partial(fn, store);
    Object.defineProperty(store.getters, key, {
      // this.$store.getters.xxxgetters 能够访问
      get: () => store._vm[key],
      //
      enumerable: true, // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent;
  Vue.config.silent = true;
  // 设置新的storeVm，将当前初始化的state以及getters作为computed属性（刚刚遍历生成的）
  // Vuex其实构建的就是一个名为store的vm组件
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    // 该方法对state执行$watch以禁止从mutation外部修改state
    enableStrictMode(store);
    function enableStrictMode(store) {
      store._vm.$watch(
        "state",
        () => {
          assert(
            store._committing,
            `Do not mutate vuex store state outside mutation handlers.`
          );
        },
        { deep: true, sync: true }
      );
    }
  }

  // 若不是初始化过程执行的该方法，将旧的组件state设置为null，强制更新所有监听者(watchers)，待更新生效，DOM更新完成后，执行vm组件的destroy方法进行销毁，减少内存的占用
  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(() => oldVm.$destroy());
  }
}
```

:::

## 辅助函数

```js
computed: mapState({
  // 箭头函数可使代码更简练
  count: (state) => state.count,

  // 传字符串参数 'count' 等同于 `state => state.count`
  countAlias: "count",

  // 为了能够使用 `this` 获取局部状态，必须使用常规函数
  countPlusLocalState(state) {
    return state.count + this.localCount;
  },
});
```

::: details mapState

```js
export const mapState = normalizeNamespace((namespace, states) => {
  const res = {};
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState() {
      let state = this.$store.state;
      let getters = this.$store.getters;
      if (namespace) {
        const module = getModuleByNamespace(this.$store, "mapState", namespace);
        if (!module) {
          return;
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === "function"
        ? val.call(this, state, getters)
        : state[val];
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res;
});
```

:::

```js
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }

```

::: details mapGetters

```js
export const mapGetters = normalizeNamespace((namespace, getters) => {
  const res = {};
  normalizeMap(getters).forEach(({ key, val }) => {
    // The namespace has been mutated by normalizeNamespace
    val = namespace + val;
    res[key] = function mappedGetter() {
      if (
        namespace &&
        !getModuleByNamespace(this.$store, "mapGetters", namespace)
      ) {
        return;
      }
      return this.$store.getters[val];
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res;
});
```

:::

## min-vux

```js
let Vue;
class Store {
  constructor(options) {
    // 接收用户传入的参数
    this.$options = options;

    // 显式绑定this指向（dispatch中调用commit,commit的指向是undefined）
    this.commit = this.commit.bind(this);

    // 实现getters
    this.getters = {};
    let computed = {};
    var store = this;
    Object.keys(this.$options.getters).forEach((key) => {
      const fn = this.$options.getters[key];
      computed[key] = function () {
        return fn(store.state);
      };
      Object.defineProperty(this.getters, key, {
        get() {
          return store._vm[key];
        },
      });
    });

    // 响应式处理
    this._vm = new Vue({
      data() {
        return {
          $$state: options.state,
        };
      },
      computed,
    });
  }

  // 实现state
  get state() {
    return this._vm._data.$$state;
  }
  set state(val) {
    console.log("只能通过commit修改state的值");
    return;
  }

  // 实现commit
  commit(event, payload) {
    const fn = this.$options.mutations[event]; //找到对应mutations里面的函数
    if (!fn) {
      console.error("没有此mutation方法");
      return;
    } //判断有无此方法
    fn(this.state, payload); //传入state值，执行此方法
  }

  // 实现dispatch
  dispatch(event, payload) {
    const fn = this.$options.actions[event];
    if (!fn) {
      console.error("没有此mutation方法");
      return;
    }
    fn(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      // if判断是因为我们只在根实例里面传入了store
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}
export default {
  Store,
  install,
};
```
